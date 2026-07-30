import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slugify';
import { GoogleBooksService, type BookSource } from './google-books.service';
import { CreateBookEntryDto } from './dto/create-book-entry.dto';
import { UpdateBookEntryDto } from './dto/update-book-entry.dto';
import { CreateBookQuoteDto } from './dto/create-book-quote.dto';
import { UpdateBookQuoteDto } from './dto/update-book-quote.dto';
import { UpsertReadingGoalDto } from './dto/upsert-reading-goal.dto';
import type {
  BookEntry,
  BookQuote,
  Prisma,
  ReadingGoal,
} from '../generated/prisma/client';

/** Kitap sayfasındaki "benzer kitaplar" ve seri listeleri kaç kayıt taşır. */
const NEIGHBOUR_LIMIT = 8;

/** Sağ raydaki "son eklediklerim" şeridi. */
const RECENT_LIMIT = 6;

/** Yazar panelinde kaç yazar görünür. */
const AUTHOR_LIMIT = 12;

// Salon girişinin iki yanındaki kapaklar — başlık burada, kapak kaynaktan
const SHOWCASE_LEFT = 'Dune Frank Herbert';
const SHOWCASE_RIGHT = 'Yüzüklerin Efendisi Tolkien';
const SHOWCASE_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * `interface` DEĞİL tür takma adı: cache'e yazılırken Prisma'nın
 * `InputJsonValue`ına doğrudan geçebilmesi için örtük index imzası gerekiyor
 * ve TypeScript bunu yalnızca tür takma adlarına veriyor. Aksi hâlde her
 * yazmada tip dönüşümü gerekiyor, o dönüşümü de ESLint gereksiz sayıp
 * siliyor — ikisinin ortasında kalmamak için.
 */
export type BookShowcaseCover = {
  title: string;
  coverImage: string;
};

/** Elle girilen adresler — `BookEntry.links` alanının şekli. */
export interface BookCustomLinks {
  goodreads?: string;
  dr?: string;
  idefix?: string;
  official?: string;
}

const BOOK_LINK_FIELDS = [
  'goodreads',
  'dr',
  'idefix',
  'official',
] as const satisfies ReadonlyArray<keyof BookCustomLinks>;

export interface ArchiveBookQuote {
  id: string;
  text: string;
  page: number | null;
  context: string | null;
  isFavorite: boolean;
}

export interface ArchiveBook {
  id: string;
  /** Kitap sayfasının adresi; başlıktan türetilir, veritabanında tutulmaz */
  slug: string;
  googleId: string | null;
  olKey: string | null;
  isbn13: string | null;
  title: string;
  originalTitle: string | null;
  authors: string[];
  translator: string | null;
  publisher: string | null;
  publishedYear: number | null;
  firstPublishedYear: number | null;
  pageCount: number | null;
  language: string | null;
  coverImage: string | null;
  description: string | null;
  genres: string[];
  seriesName: string | null;
  seriesIndex: number | null;
  status: BookEntry['status'];
  translationState: BookEntry['translationState'];
  isFavorite: boolean;
  personalRating: number | null;
  personalNote: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  currentPage: number;
  /** Okuma yüzdesi; sayfa sayısı bilinmiyorsa null (çubuk çizilmez) */
  progress: number | null;
  universeId: string | null;
}

/** Seri kartı: "5 kitaptan 3'ü Türkçe" satırının kaynağı. */
export interface BookSeries {
  name: string;
  slug: string;
  /** Arşivdeki cilt sayısı */
  count: number;
  readCount: number;
  translatedCount: number;
  untranslatedCount: number;
  /** Serinin ilk cildinin kapağı — kart görseli */
  coverImage: string | null;
  /**
   * Kadim Dünyalar bağı: ciltlerden herhangi biri bir evrene bağlıysa dolu.
   * Kimlik değil **slug** dönüyor — evren sayfasının adresi slug'la kuruluyor
   * (`/dark-stories/[universeSlug]`), arayüz ikinci bir istek atmasın diye.
   */
  universeSlug: string | null;
}

export interface BookAuthorCard {
  name: string;
  count: number;
  readCount: number;
  averageRating: number | null;
  coverImage: string | null;
}

/** Salonun sağ rayındaki "Okuma İstatistiklerim" levhası. */
export interface BookArchiveStats {
  read: number;
  readThisYear: number;
  toRead: number;
  reading: number;
  abandoned: number;
  favorites: number;
  totalPages: number;
  pagesThisYear: number;
  averageRating: number | null;
  longest: { title: string; pageCount: number } | null;
  shortest: { title: string; pageCount: number } | null;
  topGenre: string | null;
  topAuthor: string | null;
  /** Yıllık hedef; kurulmamışsa null (halka çizilmez) */
  goal: {
    year: number;
    targetBooks: number;
    targetPages: number | null;
    doneBooks: number;
    donePages: number;
  } | null;
}

export interface BookArchive {
  books: ArchiveBook[];
  stats: BookArchiveStats;
  series: BookSeries[];
  authors: BookAuthorCard[];
  genres: Array<{ name: string; count: number }>;
  /** Sağ raydaki şerit */
  recent: ArchiveBook[];
  /** Salonun altındaki dönen alıntı — kitap adıyla birlikte */
  quoteOfTheDay:
    (ArchiveBookQuote & { bookTitle: string; bookSlug: string }) | null;
}

export interface BookDetail {
  book: ArchiveBook;
  quotes: ArchiveBookQuote[];
  links: Array<{ kind: string; url: string; isSearch: boolean }>;
  customLinks: BookCustomLinks;
  /** Aynı serinin ciltleri, sıraya dizili — çevrilmemişler de burada */
  series: ArchiveBook[];
  seriesName: string | null;
  /** Aynı yazarın arşivdeki diğer kitapları */
  byAuthor: ArchiveBook[];
  /** Aynı türden komşular; yazar listesinde geçenler tekrar etmez */
  byGenre: ArchiveBook[];
  /** Bağlı evren (Kadim Dünyalar) — yoksa null */
  universe: { id: string; name: string; slug: string } | null;
}

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly source: GoogleBooksService,
  ) {}

  // --- Public ---

  /**
   * Salonun tamamı tek istekte döner (film/dizi/anime kanadıyla aynı karar):
   * arşiv birkaç yüz kayıt, sayfalama yerine istemci tarafı süzgeç çok daha
   * akıcı bir okuma sağlıyor.
   */
  async getArchive(): Promise<BookArchive> {
    const [entries, goal, universes] = await Promise.all([
      this.prisma.bookEntry.findMany({
        where: { isDeleted: false },
        orderBy: [{ finishedAt: 'desc' }, { createdAt: 'desc' }],
      }),
      this.currentGoal(),
      this.prisma.wikiUniverse.findMany({
        where: { isDeleted: false },
        select: { id: true, slug: true },
      }),
    ]);
    const books = withSlugs(entries);
    const universeSlugs = new Map(
      universes.map((universe) => [universe.id, universe.slug]),
    );

    return {
      books,
      stats: buildStats(books, goal),
      series: buildSeries(books, entries, universeSlugs),
      authors: buildAuthors(books),
      genres: buildGenres(books),
      recent: books.slice(0, RECENT_LIMIT),
      quoteOfTheDay: await this.pickQuoteOfTheDay(books),
    };
  }

  /** Kitap sayfası: künye + alıntılar + seri + komşular + evren bağı. */
  async getDetail(slug: string): Promise<BookDetail> {
    const entries = await this.prisma.bookEntry.findMany({
      where: { isDeleted: false },
      orderBy: [{ finishedAt: 'desc' }, { createdAt: 'desc' }],
    });
    const books = withSlugs(entries);
    const index = books.findIndex((item) => item.slug === slug);
    if (index === -1) {
      throw new NotFoundException('BOOKS.NOT_FOUND');
    }
    const book = books[index];
    const entry = entries[index];

    const [quotes, universe] = await Promise.all([
      this.prisma.bookQuote.findMany({
        where: { entryId: entry.id, isDeleted: false },
        orderBy: [{ orderIndex: 'asc' }, { createdAt: 'asc' }],
      }),
      entry.universeId
        ? this.prisma.wikiUniverse.findFirst({
            where: { id: entry.universeId, isDeleted: false },
            select: { id: true, name: true, slug: true },
          })
        : Promise.resolve(null),
    ]);

    const series = book.seriesName
      ? books
          .filter((item) => item.seriesName === book.seriesName)
          .sort(sortBySeriesIndex)
      : [];

    const others = books.filter((item) => item.id !== book.id);
    const byAuthor = others
      .filter((item) =>
        item.authors.some((name) => book.authors.includes(name)),
      )
      .slice(0, NEIGHBOUR_LIMIT);

    const picked = new Set([
      ...byAuthor.map((item) => item.id),
      ...series.map((item) => item.id),
    ]);
    const genres = new Set(book.genres);
    const byGenre = others
      .filter(
        (item) =>
          !picked.has(item.id) && item.genres.some((name) => genres.has(name)),
      )
      .sort(
        (a, b) =>
          b.genres.filter((name) => genres.has(name)).length -
          a.genres.filter((name) => genres.has(name)).length,
      )
      .slice(0, NEIGHBOUR_LIMIT);

    return {
      book,
      quotes: quotes.map(toArchiveQuote),
      links: buildLinks(entry),
      customLinks: readCustomLinks(entry),
      series,
      seriesName: book.seriesName,
      byAuthor,
      byGenre,
      universe: universe ?? null,
    };
  }

  /**
   * Salon girişinin iki yanındaki kapaklar. Adres koda GÖMÜLMEZ: başlıkla
   * aranır ve sonuç cache'lenir. Arama düşerse boş döner — lobi kapı
   * çizimiyle açılır, hata göstermez.
   */
  async showcase(): Promise<{
    left: BookShowcaseCover | null;
    right: BookShowcaseCover | null;
  }> {
    const cacheKey = 'books:showcase:v1';
    const cached = await this.prisma.externalCache.findUnique({
      where: { cacheKey },
    });
    if (
      cached &&
      Date.now() - cached.fetchedAt.getTime() < SHOWCASE_CACHE_TTL_MS
    ) {
      return cached.payload as unknown as {
        left: BookShowcaseCover | null;
        right: BookShowcaseCover | null;
      };
    }

    const resolve = async (
      query: string,
    ): Promise<BookShowcaseCover | null> => {
      try {
        const results = await this.source.search(query);
        const match = results.find((item) => item.coverImage);
        return match?.coverImage
          ? { title: match.title, coverImage: match.coverImage }
          : null;
      } catch {
        return null;
      }
    };

    const [left, right] = await Promise.all([
      resolve(SHOWCASE_LEFT),
      resolve(SHOWCASE_RIGHT),
    ]);
    const payload = { left, right };

    if (left || right) {
      await this.prisma.externalCache.upsert({
        where: { cacheKey },
        create: { cacheKey, payload, fetchedAt: new Date() },
        update: { payload, fetchedAt: new Date() },
      });
    } else if (cached) {
      return cached.payload as unknown as {
        left: BookShowcaseCover | null;
        right: BookShowcaseCover | null;
      };
    }
    return payload;
  }

  // --- Admin ---

  /**
   * Arşive eklemek için arama. Sonuçta arşivde olanlar işaretli gelir —
   * küratör aynı kitabı iki kez eklemeye çalışmasın.
   */
  async search(
    query: string,
  ): Promise<Array<BookSource & { inArchive: boolean }>> {
    const results = await this.source.search(query);
    const known = await this.prisma.bookEntry.findMany({
      where: { isDeleted: false },
      select: { googleId: true, isbn13: true },
    });
    const googleIds = new Set(
      known.map((item) => item.googleId).filter(Boolean),
    );
    const isbns = new Set(known.map((item) => item.isbn13).filter(Boolean));
    return results.map((item) => ({
      ...item,
      inArchive:
        (item.googleId !== null && googleIds.has(item.googleId)) ||
        (item.isbn13 !== null && isbns.has(item.isbn13)),
    }));
  }

  findAllForAdmin() {
    return this.prisma.bookEntry.findMany({
      where: { isDeleted: false },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Arşive kitap ekler.
   *
   * Kullanıcı kararı gereği künye alanları **kayıt anında** dış kaynaktan
   * tohumlanıp kendi sütunlarımıza yazılır; bundan sonra kitabın sahibi
   * arşiv. Dış kaynak erişilemezse kayıt yine açılır (kural 4) — o zaman
   * başlık DTO'dan gelir, kalan alanlar boş kalır ve küratör doldurur.
   */
  async create(dto: CreateBookEntryDto, userId: string): Promise<BookEntry> {
    const duplicate = await this.findDuplicate(dto, userId);
    if (duplicate) {
      throw new ConflictException('BOOKS.ALREADY_IN_ARCHIVE');
    }

    const seed = await this.seed(dto);
    const status = dto.status ?? 'READ';
    return this.prisma.bookEntry.create({
      data: {
        googleId: dto.googleId ?? null,
        olKey: dto.olKey ?? seed?.olKey ?? null,
        isbn13: seed?.isbn13 ?? null,
        title: dto.title ?? seed?.title ?? 'Adsız kitap',
        originalTitle: seed?.originalTitle ?? null,
        authors: seed?.authors ?? [],
        publisher: seed?.publisher ?? null,
        publishedYear: seed?.publishedYear ?? null,
        firstPublishedYear: seed?.firstPublishedYear ?? null,
        pageCount: seed?.pageCount ?? null,
        language: seed?.language ?? null,
        coverImage: seed?.coverImage ?? null,
        description: seed?.description ?? null,
        genres: seed?.genres ?? [],
        seriesName: dto.seriesName ?? seed?.seriesName ?? null,
        seriesIndex: dto.seriesIndex ?? seed?.seriesIndex ?? null,
        status,
        translationState:
          dto.translationState ?? guessTranslation(seed ?? null),
        isFavorite: dto.isFavorite ?? false,
        personalRating: dto.personalRating ?? null,
        personalNote: dto.personalNote ?? null,
        // "Okudum" işaretlenmiş kitabın bitiş tarihi boş kalmasın: sıralama ve
        // "bu yıl kaç kitap" sayacı bu alandan okunuyor
        finishedAt:
          dto.finishedAt !== undefined
            ? parseDate(dto.finishedAt)
            : status === 'READ'
              ? new Date()
              : null,
        startedAt: dto.startedAt ? parseDate(dto.startedAt) : null,
        externalData: (seed ?? undefined) as unknown as Prisma.InputJsonValue,
        externalDataFetchedAt: seed ? new Date() : null,
        userId,
      },
    });
  }

  async update(id: string, dto: UpdateBookEntryDto): Promise<BookEntry> {
    const entry = await this.findByIdOrFail(id);
    const data: Prisma.BookEntryUncheckedUpdateInput = {
      title: dto.title,
      originalTitle: dto.originalTitle,
      translator: dto.translator,
      publisher: dto.publisher,
      publishedYear: dto.publishedYear,
      firstPublishedYear: dto.firstPublishedYear,
      pageCount: dto.pageCount,
      language: dto.language,
      coverImage: dto.coverImage,
      description: dto.description,
      seriesName: dto.seriesName,
      seriesIndex: dto.seriesIndex,
      status: dto.status,
      translationState: dto.translationState,
      isFavorite: dto.isFavorite,
      personalRating: dto.personalRating,
      personalNote: dto.personalNote,
      universeId: dto.universeId,
      ...(dto.authors !== undefined && { authors: dto.authors }),
      ...(dto.genres !== undefined && { genres: dto.genres }),
      ...(dto.startedAt !== undefined && {
        startedAt: parseDate(dto.startedAt),
      }),
      ...(dto.finishedAt !== undefined && {
        finishedAt: parseDate(dto.finishedAt),
      }),
    };

    // Sayfa ilerlemesi: sayfa sayısını aşamaz, eksiye düşemez
    if (dto.currentPage !== undefined) {
      const limit = dto.pageCount ?? entry.pageCount;
      data.currentPage = clamp(dto.currentPage, 0, limit);
    }

    /**
     * Durum ile tarihler birbirini takip eder — iki yerde ayrı ayrı
     * güncellemek zorunda kalmamak için:
     *  - "okudum" işaretlenince bitiş tarihi yoksa bugün yazılır ve sayfa
     *    sonuna gidilir,
     *  - "okuyorum" işaretlenince başlangıç tarihi yoksa bugün yazılır.
     * Elle gönderilen tarih her zaman kazanır.
     */
    if (dto.status === 'READ' && dto.finishedAt === undefined) {
      data.finishedAt = entry.finishedAt ?? new Date();
      const pages = dto.pageCount ?? entry.pageCount;
      if (pages && dto.currentPage === undefined) {
        data.currentPage = pages;
      }
    }
    if (dto.status === 'READING' && dto.startedAt === undefined) {
      data.startedAt = entry.startedAt ?? new Date();
    }

    if (dto.links !== undefined) {
      const incoming = dto.links;
      const merged: BookCustomLinks = { ...readCustomLinks(entry) };
      for (const field of BOOK_LINK_FIELDS) {
        if (incoming[field] === undefined) {
          continue;
        }
        const url = normalizeUrl(incoming[field]);
        if (url) {
          merged[field] = url;
        } else {
          delete merged[field];
        }
      }
      data.links = merged as unknown as Prisma.InputJsonValue;
    }

    return this.prisma.bookEntry.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<BookEntry> {
    await this.findByIdOrFail(id);
    return this.prisma.bookEntry.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  /**
   * Künyeyi dış kaynaktan tazeler — ama **yalnızca boş alanları doldurur**.
   *
   * Film/dizi kanadındaki "tazele" künyenin tamamını yeniler; burada
   * yenilemez. Kullanıcı kararı: arşivin künyesi elle düzeltiliyor (Türkçe ad,
   * çevirmen, doğru sayfa sayısı) ve bir tazeleme bunları silerse yapılan iş
   * kaybolur. Kişisel alanlara (puan, not, durum) zaten hiç dokunulmuyor.
   */
  async refresh(id: string): Promise<BookEntry> {
    const entry = await this.findByIdOrFail(id);
    let fresh: BookSource | null = null;
    try {
      if (entry.googleId) {
        fresh = await this.source.enrich(
          await this.source.getVolume(entry.googleId),
        );
      } else {
        fresh = await this.source.enrich(toSourceShape(entry));
      }
    } catch {
      // Kaynak düşerse künye olduğu gibi kalır (kural 4)
      return entry;
    }

    return this.prisma.bookEntry.update({
      where: { id },
      data: {
        originalTitle: entry.originalTitle ?? fresh.originalTitle,
        publisher: entry.publisher ?? fresh.publisher,
        publishedYear: entry.publishedYear ?? fresh.publishedYear,
        firstPublishedYear:
          entry.firstPublishedYear ?? fresh.firstPublishedYear,
        pageCount: entry.pageCount ?? fresh.pageCount,
        language: entry.language ?? fresh.language,
        coverImage: entry.coverImage ?? fresh.coverImage,
        description: entry.description ?? fresh.description,
        seriesName: entry.seriesName ?? fresh.seriesName,
        seriesIndex: entry.seriesIndex ?? fresh.seriesIndex,
        olKey: entry.olKey ?? fresh.olKey,
        isbn13: entry.isbn13 ?? fresh.isbn13,
        ...(entry.authors.length === 0 && { authors: fresh.authors }),
        ...(entry.genres.length === 0 && { genres: fresh.genres }),
        externalData: fresh as unknown as Prisma.InputJsonValue,
        externalDataFetchedAt: new Date(),
      },
    });
  }

  // --- Alıntı defteri ---

  async addQuote(entryId: string, dto: CreateBookQuoteDto): Promise<BookQuote> {
    await this.findByIdOrFail(entryId);
    const last = await this.prisma.bookQuote.findFirst({
      where: { entryId, isDeleted: false },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    });
    return this.prisma.bookQuote.create({
      data: {
        entryId,
        text: dto.text,
        page: dto.page ?? null,
        context: dto.context ?? null,
        isFavorite: dto.isFavorite ?? false,
        orderIndex: (last?.orderIndex ?? -1) + 1,
      },
    });
  }

  async updateQuote(id: string, dto: UpdateBookQuoteDto): Promise<BookQuote> {
    const quote = await this.prisma.bookQuote.findFirst({
      where: { id, isDeleted: false },
    });
    if (!quote) {
      throw new NotFoundException('BOOKS.QUOTE_NOT_FOUND');
    }
    return this.prisma.bookQuote.update({
      where: { id },
      data: {
        text: dto.text,
        page: dto.page,
        context: dto.context,
        isFavorite: dto.isFavorite,
      },
    });
  }

  async deleteQuote(id: string): Promise<BookQuote> {
    const quote = await this.prisma.bookQuote.findFirst({
      where: { id, isDeleted: false },
    });
    if (!quote) {
      throw new NotFoundException('BOOKS.QUOTE_NOT_FOUND');
    }
    return this.prisma.bookQuote.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  // --- Yıllık hedef ---

  /** Yıl başına tek kayıt; aynı yıl tekrar gönderilirse hedef güncellenir. */
  upsertGoal(dto: UpsertReadingGoalDto, userId: string): Promise<ReadingGoal> {
    const year = dto.year ?? new Date().getFullYear();
    return this.prisma.readingGoal.upsert({
      where: { userId_year: { userId, year } },
      create: {
        year,
        targetBooks: dto.targetBooks,
        targetPages: dto.targetPages ?? null,
        userId,
      },
      update: {
        targetBooks: dto.targetBooks,
        targetPages: dto.targetPages ?? null,
      },
    });
  }

  private currentGoal(): Promise<ReadingGoal | null> {
    return this.prisma.readingGoal.findFirst({
      where: { year: new Date().getFullYear() },
    });
  }

  // --- Yardımcılar ---

  private async findByIdOrFail(id: string): Promise<BookEntry> {
    const entry = await this.prisma.bookEntry.findFirst({
      where: { id, isDeleted: false },
    });
    if (!entry) {
      throw new NotFoundException('BOOKS.NOT_FOUND');
    }
    return entry;
  }

  /**
   * Aynı kitap iki kez girmesin. Google numarası tek başına yetmiyor: aynı
   * eserin Türkçe ve İngilizce baskısının numarası farklı, ISBN'i de farklı —
   * o yüzden son çare olarak ad+yazar da karşılaştırılıyor.
   */
  private async findDuplicate(
    dto: CreateBookEntryDto,
    userId: string,
  ): Promise<BookEntry | null> {
    const or: Prisma.BookEntryWhereInput[] = [];
    if (dto.googleId) {
      or.push({ googleId: dto.googleId });
    }
    if (dto.olKey) {
      or.push({ olKey: dto.olKey });
    }
    if (dto.title) {
      or.push({ title: { equals: dto.title, mode: 'insensitive' } });
    }
    if (or.length === 0) {
      return null;
    }
    return this.prisma.bookEntry.findFirst({
      where: { userId, isDeleted: false, OR: or },
    });
  }

  /**
   * Dış kaynaktan ilk veriyi çeker; erişilemezse null (kayıt yine açılır).
   *
   * Google cilt künyesi düşerse (anahtarsız isteklerde `429` görülüyor) kayıt
   * künyesiz kalmasın diye ada göre aramaya düşülüyor — `search` kendi içinde
   * zaten Open Library'ye düşebiliyor.
   */
  private async seed(dto: CreateBookEntryDto): Promise<BookSource | null> {
    if (dto.googleId) {
      try {
        return await this.source.enrich(
          await this.source.getVolume(dto.googleId),
        );
      } catch {
        // Cilt künyesi alınamadı; aşağıdaki ada göre arama denenir
      }
    }
    if (dto.title) {
      try {
        const results = await this.source.search(dto.title);
        return results[0] ? await this.source.enrich(results[0]) : null;
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Salonun altındaki dönen alıntı. "Günün" alıntısı gerçekten günlük: gün
   * numarasından türetilen sabit bir seçim, her istekte değişmiyor —
   * sayfa yenilendiğinde alıntının değişmesi huzursuz ediyordu.
   */
  private async pickQuoteOfTheDay(
    books: ArchiveBook[],
  ): Promise<
    (ArchiveBookQuote & { bookTitle: string; bookSlug: string }) | null
  > {
    const quotes = await this.prisma.bookQuote.findMany({
      where: { isDeleted: false, entry: { isDeleted: false } },
      orderBy: { createdAt: 'asc' },
    });
    if (quotes.length === 0) {
      return null;
    }
    const favorites = quotes.filter((quote) => quote.isFavorite);
    const pool = favorites.length > 0 ? favorites : quotes;
    const dayNumber = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
    const quote = pool[dayNumber % pool.length];
    const book = books.find((item) => item.id === quote.entryId);
    if (!book) {
      return null;
    }
    return {
      ...toArchiveQuote(quote),
      bookTitle: book.title,
      bookSlug: book.slug,
    };
  }
}

// --- Saf yardımcılar ---

function clamp(value: number, min: number, max: number | null): number {
  const lower = Math.max(min, Math.round(value));
  return max === null ? lower : Math.min(lower, max);
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Şemasız yapıştırılan adrese `https://` ekler; boş metin null döner. */
function normalizeUrl(value: string | null | undefined): string | null {
  const trimmed = (value ?? '').trim();
  if (!trimmed) {
    return null;
  }
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function readCustomLinks(entry: BookEntry): BookCustomLinks {
  return (entry.links ?? {}) as BookCustomLinks;
}

/**
 * Çeviri durumunun ilk tahmini. Türkçe baskı bulunduysa "çevrildi"; kitap
 * Türkçe yazılmışsa bunu bilemeyiz, o yüzden yine "çevrildi" denmez —
 * küratör tek tıkla "özgün Türkçe" yapar. Yabancı dilde bir baskı geldiyse
 * "henüz çevrilmedi" işaretlenir.
 */
function guessTranslation(
  seed: BookSource | null,
): BookEntry['translationState'] {
  if (!seed?.language) {
    return 'TRANSLATED';
  }
  return seed.language === 'tr' ? 'TRANSLATED' : 'UNTRANSLATED';
}

/** Kaynağı olmayan (elle açılmış) kayıt için arama şekli. */
function toSourceShape(entry: BookEntry): BookSource {
  return {
    googleId: entry.googleId,
    olKey: entry.olKey,
    isbn13: entry.isbn13,
    title: entry.title,
    subtitle: null,
    authors: entry.authors,
    publisher: entry.publisher,
    publishedYear: entry.publishedYear,
    firstPublishedYear: entry.firstPublishedYear,
    pageCount: entry.pageCount,
    language: entry.language,
    coverImage: entry.coverImage,
    description: entry.description,
    genres: entry.genres,
    seriesName: entry.seriesName,
    seriesIndex: entry.seriesIndex,
    originalTitle: entry.originalTitle,
    provider: 'GOOGLE',
  };
}

function toArchiveQuote(quote: BookQuote): ArchiveBookQuote {
  return {
    id: quote.id,
    text: quote.text,
    page: quote.page,
    context: quote.context,
    isFavorite: quote.isFavorite,
  };
}

/**
 * Kitaplara adres verir (film/anime kanadındaki desen). Slug veritabanında
 * tutulmuyor: başlıktan türetiliyor, çakışırsa yıl, o da yetmezse sıra
 * numarası ekleniyor.
 */
function withSlugs(entries: BookEntry[]): ArchiveBook[] {
  const used = new Set<string>();
  return entries.map((entry, index) => {
    const book = toArchiveBook(entry);
    const base = slugify(book.title) || `kitap-${index + 1}`;
    const withYear = book.firstPublishedYear
      ? `${base}-${book.firstPublishedYear}`
      : base;
    const slug = !used.has(base)
      ? base
      : !used.has(withYear)
        ? withYear
        : `${base}-${index + 1}`;
    used.add(slug);
    return { ...book, slug };
  });
}

function toArchiveBook(entry: BookEntry): ArchiveBook {
  return {
    id: entry.id,
    slug: '',
    googleId: entry.googleId,
    olKey: entry.olKey,
    isbn13: entry.isbn13,
    title: entry.title,
    originalTitle: entry.originalTitle,
    authors: entry.authors,
    translator: entry.translator,
    publisher: entry.publisher,
    publishedYear: entry.publishedYear,
    firstPublishedYear: entry.firstPublishedYear,
    pageCount: entry.pageCount,
    language: entry.language,
    coverImage: entry.coverImage,
    description: entry.description,
    genres: entry.genres,
    seriesName: entry.seriesName,
    seriesIndex: entry.seriesIndex,
    status: entry.status,
    translationState: entry.translationState,
    isFavorite: entry.isFavorite,
    personalRating: entry.personalRating,
    personalNote: entry.personalNote,
    startedAt: entry.startedAt ? entry.startedAt.toISOString() : null,
    finishedAt: entry.finishedAt ? entry.finishedAt.toISOString() : null,
    currentPage: entry.currentPage,
    progress:
      entry.pageCount && entry.pageCount > 0
        ? Math.min(100, Math.round((entry.currentPage / entry.pageCount) * 100))
        : null,
    universeId: entry.universeId,
  };
}

function sortBySeriesIndex(a: ArchiveBook, b: ArchiveBook): number {
  // Sırasız ciltler sona: seri listesi "1, 2, 3, … sırası bilinmeyen" okunur
  const left = a.seriesIndex ?? Number.MAX_SAFE_INTEGER;
  const right = b.seriesIndex ?? Number.MAX_SAFE_INTEGER;
  return left - right || a.title.localeCompare(b.title, 'tr');
}

/**
 * Seri kartları. "5 kitaptan 3'ü Türkçe" satırının kaynağı: çevrilmemiş
 * ciltler de arşivde durduğu için toplam gerçek cilt sayısını veriyor.
 */
function buildSeries(
  books: ArchiveBook[],
  entries: BookEntry[],
  universeSlugs: Map<string, string>,
): BookSeries[] {
  const groups = new Map<string, ArchiveBook[]>();
  for (const book of books) {
    if (!book.seriesName) {
      continue;
    }
    const list = groups.get(book.seriesName) ?? [];
    list.push(book);
    groups.set(book.seriesName, list);
  }

  const universeByEntry = new Map(
    entries.map((entry) => [entry.id, entry.universeId]),
  );

  return [...groups.entries()]
    .map(([name, list]) => {
      const sorted = [...list].sort(sortBySeriesIndex);
      const universeId =
        sorted
          .map((book) => universeByEntry.get(book.id) ?? null)
          .find((id): id is string => Boolean(id)) ?? null;
      const universeSlug = universeId
        ? (universeSlugs.get(universeId) ?? null)
        : null;
      return {
        name,
        slug: slugify(name),
        count: sorted.length,
        readCount: sorted.filter((book) => book.status === 'READ').length,
        translatedCount: sorted.filter(
          (book) =>
            book.translationState === 'TRANSLATED' ||
            book.translationState === 'ORIGINAL',
        ).length,
        untranslatedCount: sorted.filter(
          (book) =>
            book.translationState === 'UNTRANSLATED' ||
            book.translationState === 'IN_PROGRESS',
        ).length,
        coverImage: sorted.find((book) => book.coverImage)?.coverImage ?? null,
        universeSlug,
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'tr'));
}

/** Yazar paneli: arşivden türetilir, elle yazılmaz. */
function buildAuthors(books: ArchiveBook[]): BookAuthorCard[] {
  const groups = new Map<string, ArchiveBook[]>();
  for (const book of books) {
    for (const name of book.authors) {
      const list = groups.get(name) ?? [];
      list.push(book);
      groups.set(name, list);
    }
  }

  return [...groups.entries()]
    .map(([name, list]) => {
      const rated = list.filter((book) => book.personalRating !== null);
      const sum = rated.reduce(
        (total, book) => total + (book.personalRating ?? 0),
        0,
      );
      return {
        name,
        count: list.length,
        readCount: list.filter((book) => book.status === 'READ').length,
        averageRating:
          rated.length > 0 ? Number((sum / rated.length).toFixed(1)) : null,
        coverImage: list.find((book) => book.coverImage)?.coverImage ?? null,
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'tr'))
    .slice(0, AUTHOR_LIMIT);
}

/** Sol süzgeç panelindeki tür listesi — sayılarıyla birlikte. */
function buildGenres(books: ArchiveBook[]): Array<{
  name: string;
  count: number;
}> {
  const counts = new Map<string, number>();
  for (const book of books) {
    for (const genre of book.genres) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'tr'));
}

function buildStats(
  books: ArchiveBook[],
  goal: ReadingGoal | null,
): BookArchiveStats {
  const currentYear = new Date().getFullYear();
  // Çevrilmemiş ciltler arşivde duruyor ama okuma sayılarına girmiyor
  const read = books.filter((book) => book.status === 'READ');
  const thisYear = read.filter(
    (book) =>
      book.finishedAt &&
      new Date(book.finishedAt).getFullYear() === currentYear,
  );
  const withPages = read.filter(
    (book): book is ArchiveBook & { pageCount: number } =>
      typeof book.pageCount === 'number' && book.pageCount > 0,
  );
  const rated = books.filter((book) => book.personalRating !== null);
  const sum = rated.reduce(
    (total, book) => total + (book.personalRating ?? 0),
    0,
  );

  const totalPages = withPages.reduce(
    (total, book) => total + book.pageCount,
    0,
  );
  const pagesThisYear = thisYear.reduce(
    (total, book) => total + (book.pageCount ?? 0),
    0,
  );
  const byPages = [...withPages].sort((a, b) => b.pageCount - a.pageCount);

  return {
    read: read.length,
    readThisYear: thisYear.length,
    toRead: books.filter((book) => book.status === 'TO_READ').length,
    reading: books.filter((book) => book.status === 'READING').length,
    abandoned: books.filter((book) => book.status === 'ABANDONED').length,
    favorites: books.filter((book) => book.isFavorite).length,
    totalPages,
    pagesThisYear,
    averageRating:
      rated.length > 0 ? Number((sum / rated.length).toFixed(1)) : null,
    longest: byPages[0]
      ? { title: byPages[0].title, pageCount: byPages[0].pageCount }
      : null,
    shortest: byPages.at(-1)
      ? {
          title: byPages.at(-1)!.title,
          pageCount: byPages.at(-1)!.pageCount,
        }
      : null,
    topGenre: buildGenres(read)[0]?.name ?? null,
    topAuthor: buildAuthors(read)[0]?.name ?? null,
    goal: goal
      ? {
          year: goal.year,
          targetBooks: goal.targetBooks,
          targetPages: goal.targetPages,
          doneBooks: thisYear.length,
          donePages: pagesThisYear,
        }
      : null,
  };
}

/**
 * Bağlantı kartları. Goodreads'in API'si kapalı, Türkçe kitapçıların hiç yok:
 * elle adres girilmediyse **arama adresi** üretilir ve `isSearch` ile
 * işaretlenir (film kanadındaki Rotten Tomatoes deseni).
 */
function buildLinks(
  entry: BookEntry,
): Array<{ kind: string; url: string; isSearch: boolean }> {
  const custom = readCustomLinks(entry);
  const query = encodeURIComponent(
    [entry.originalTitle ?? entry.title, entry.authors[0] ?? '']
      .filter(Boolean)
      .join(' '),
  );
  const links: Array<{ kind: string; url: string; isSearch: boolean }> = [];

  if (custom.goodreads) {
    links.push({ kind: 'GOODREADS', url: custom.goodreads, isSearch: false });
  } else {
    links.push({
      kind: 'GOODREADS',
      url: `https://www.goodreads.com/search?q=${query}`,
      isSearch: true,
    });
  }

  if (entry.googleId) {
    links.push({
      kind: 'GOOGLE_BOOKS',
      url: `https://books.google.com/books?id=${entry.googleId}`,
      isSearch: false,
    });
  }
  if (entry.olKey) {
    links.push({
      kind: 'OPEN_LIBRARY',
      url: `https://openlibrary.org${entry.olKey}`,
      isSearch: false,
    });
  }

  const trQuery = encodeURIComponent(entry.title);
  links.push({
    kind: 'DR',
    url: custom.dr ?? `https://www.dr.com.tr/search?q=${trQuery}`,
    isSearch: !custom.dr,
  });
  if (custom.idefix) {
    links.push({ kind: 'IDEFIX', url: custom.idefix, isSearch: false });
  }
  if (custom.official) {
    links.push({ kind: 'OFFICIAL', url: custom.official, isSearch: false });
  }
  return links;
}
