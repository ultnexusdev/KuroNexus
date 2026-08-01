import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slugify';
import { GoogleBooksService, type BookSource } from './google-books.service';
import {
  binKitapSlug,
  BinKitapRateLimitError,
  BinKitapService,
  type BinKitapDetail,
} from './bin-kitap.service';
import { BookCoverService } from './book-cover.service';
import { BookCreditsService } from './book-credits.service';
import { AWARDS } from './data/awards.data';
import { CreateBookEntryDto } from './dto/create-book-entry.dto';
import { UpdateBookEntryDto } from './dto/update-book-entry.dto';
import { CreateBookQuoteDto } from './dto/create-book-quote.dto';
import { UpdateBookQuoteDto } from './dto/update-book-quote.dto';
import { UpsertReadingGoalDto } from './dto/upsert-reading-goal.dto';
import type {
  BookEntry,
  BookPersonRole,
  BookQuote,
  Prisma,
  ReadingGoal,
} from '../generated/prisma/client';

/**
 * Kayıt açılırken dış kaynaktan toplanan her şey. `translator` ve `raw`
 * ayrı duruyor çünkü ikisinin de `BookSource`ta karşılığı yok: biri kendi
 * sütununa, öteki `externalData`ya yazılıyor.
 */
interface BookSeed {
  source: BookSource | null;
  translator: string | null;
  raw: BinKitapDetail['raw'] | null;
  /** İlişkisel künyenin girdisi (Faz 2a); yalnızca 1000Kitap veriyor */
  credits: BinKitapDetail['credits'] | null;
}

const EMPTY_SEED: BookSeed = {
  source: null,
  translator: null,
  raw: null,
  credits: null,
};

/** Kitap sayfasındaki "benzer kitaplar" ve seri listeleri kaç kayıt taşır. */
const NEIGHBOUR_LIMIT = 8;

/** Sağ raydaki "son eklediklerim" şeridi. */
const RECENT_LIMIT = 6;

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
  /**
   * 1000Kitap sayfa anahtarı. Arayüzde gösterilmiyor; ödül rafından gelen
   * kaynak sayfasının "bu kitap zaten arşivimde" bağını kurmak için gerekli.
   */
  binKitapSlug: string | null;
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
  /**
   * Tıklanabilir künye (Faz 2b). Düz metin alanlarının (`authors`,
   * `publisher`, `seriesName`) yanında duruyor: ilişkisi olan kayıtta bağ
   * kurulur, olmayanda düz metin gösterilir. Böylece Google/Open Library'den
   * eklenmiş ya da Faz 2a öncesi kayıtlar da eksiksiz görünmeye devam eder.
   */
  credits: BookCredits;
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
  /**
   * Yazar sayfasının adresi — kişinin **arşivde ilişkisel kaydı varsa** dolu.
   * Yoksa null ve kart sayfa açmak yerine arşivi o adla süzüyor: olmayan
   * kişinin sayfası 404 verirdi (künyedeki `BookCredits` ile aynı karar).
   */
  slug: string | null;
  /**
   * Yazarın portresi (`/uploads/books/…`). Kişi sayfası ilk kez açıldığında
   * kaynaktan indirilip saklanıyor; hiç açılmamış yazarda **null** ve arayüz
   * baş harflerden bir madalyon çiziyor. Toplu doldurma admin bakım
   * ekranında (`people/photos`).
   */
  photo: string | null;
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

/** Kitap künyesinde tıklanabilir bir kişi (yazar / çevirmen / editör). */
export interface BookCreditPerson {
  slug: string;
  name: string;
  role: BookPersonRole;
}

/**
 * Kitabın ilişkisel künyesi. Faz 2a öncesi eklenmiş ya da Google/Open
 * Library'den gelen kayıtlarda **boş olabilir** — arayüz o zaman düz metni
 * gösteriyor, bağ kurmuyor. Geçiş boyunca ikisi bir arada yaşıyor.
 */
export interface BookCredits {
  people: BookCreditPerson[];
  publisher: { slug: string; name: string } | null;
  series: { slug: string; name: string } | null;
}

/**
 * Kaynak künyesindeki bir kişi. `slug` yalnızca o kişinin **arşivde** kaydı
 * varsa dolu: olmayan kişinin sayfası 404 verirdi, o yüzden düz metin
 * gösteriliyor (kitap sayfasındaki `BookCredits` ile aynı karar).
 */
export interface SourceBookCredit {
  name: string;
  role: BookPersonRole;
  slug: string | null;
}

/**
 * Arşivde **olmayan** bir kitabın künye sayfası (`/kitap/kaynak/<slug>`).
 *
 * Ödül rafındaki kartların tıklanabilmesi için var: liste 235 kitap, arşivde
 * ise bir avuç. Eskiden arşivde olmayan kart hiç tıklanmıyordu — okur ödülü
 * görüp kitabı merak ettiğinde gidecek yeri yoktu.
 *
 * Kayıt AÇILMIYOR: sayfa tamamen kaynağın künyesinden çiziliyor, veritabanına
 * hiçbir şey yazılmıyor. Arşiv küratörün seçtiği kitapların yeri olarak
 * kalıyor (kullanıcı kararı).
 */
export interface SourceBookPage {
  /** 1000Kitap sayfa anahtarı; adresin kendisi */
  slug: string;
  title: string;
  subtitle: string | null;
  originalTitle: string | null;
  authors: string[];
  translator: string | null;
  editor: string | null;
  publisher: string | null;
  /** Yayınevinin arşivde kaydı varsa sayfası; yoksa düz metin */
  publisherSlug: string | null;
  publishedYear: number | null;
  firstPublishedYear: number | null;
  pageCount: number | null;
  language: string | null;
  isbn13: string | null;
  coverImage: string | null;
  description: string | null;
  genres: string[];
  seriesName: string | null;
  seriesIndex: number | null;
  people: SourceBookCredit[];
  /** Kitap arşive sonradan eklendiyse okuru kendi sayfasına göndermek için */
  inArchive: boolean;
  archiveSlug: string | null;
}

/** Kişi sayfasındaki ödül satırı — kaynağı kod içi ödül listesi. */
export interface BookPersonAward {
  /** Ödül rafının adresi (`/kitap/oduller/<key>`) */
  key: string;
  name: string;
  year: number;
  /** Ödülü getiren eser; yazara verilen ödülde temsilci eseri, yoksa null */
  title: string | null;
}

/** Yazar/çevirmen sayfası. */
export interface BookPersonPage {
  slug: string;
  name: string;
  photo: string | null;
  biography: string | null;
  /** Hangi rollerde görünüyor — "Yazar · Çevirmen" satırı için */
  roles: BookPersonRole[];
  books: ArchiveBook[];
  /**
   * Ödül listesindeki geçtiği yerler. Arşivde kaydı olmayan yazarın sayfası
   * bu olmadan yalnızca biyografiden ibaret kalırdı — okur oraya ödül
   * rafından geliyor, bağlamı orada kalsın.
   */
  awards: BookPersonAward[];
  /**
   * Kişinin arşivde ilişkisel kaydı var mı. `false` ise sayfa tamamen
   * kaynaktan çizilmiştir: kitap rafı boştur ve bu bir eksiklik değil.
   */
  inArchive: boolean;
}

/**
 * Seri sayfası (`/kitap/seri/<slug>`).
 *
 * Seri kartı eskiden arşivi o adla **süzüyordu**; kullanıcı serinin kendi
 * sayfasını istedi. Ciltler sıraya dizili geliyor ve çevrilmemiş olanlar da
 * listede: serinin eksiğini görmek bu sayfanın asıl işi.
 */
export interface BookSeriesPage {
  slug: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  /** Kadim Dünyalar bağı — ciltlerden biri bir evrene bağlıysa dolu */
  universeSlug: string | null;
  count: number;
  readCount: number;
  translatedCount: number;
  untranslatedCount: number;
  /** Ciltler `seriesIndex` sırasında; sırasız olanlar sonda */
  books: ArchiveBook[];
}

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly source: GoogleBooksService,
    private readonly binKitap: BinKitapService,
    private readonly covers: BookCoverService,
    private readonly credits: BookCreditsService,
  ) {}

  // --- Public ---

  /**
   * Salonun tamamı tek istekte döner (film/dizi/anime kanadıyla aynı karar):
   * arşiv birkaç yüz kayıt, sayfalama yerine istemci tarafı süzgeç çok daha
   * akıcı bir okuma sağlıyor.
   */
  async getArchive(): Promise<BookArchive> {
    const [entries, goal, universes, people] = await Promise.all([
      this.prisma.bookEntry.findMany({
        where: { isDeleted: false },
        orderBy: [{ finishedAt: 'desc' }, { createdAt: 'desc' }],
        include: CREDITS_INCLUDE,
      }),
      this.currentGoal(),
      this.prisma.wikiUniverse.findMany({
        where: { isDeleted: false },
        select: { id: true, slug: true },
      }),
      // Yazar panelindeki portreler; kişi tablosu küçük, tek sorgu yetiyor
      this.prisma.bookPerson.findMany({
        where: { photo: { not: null } },
        select: { slug: true, photo: true },
      }),
    ]);
    const books = withSlugs(entries);
    const universeSlugs = new Map(
      universes.map((universe) => [universe.id, universe.slug]),
    );
    const photos = new Map(people.map((person) => [person.slug, person.photo]));

    return {
      books,
      stats: buildStats(books, goal),
      series: buildSeries(books, entries, universeSlugs),
      authors: buildAuthors(books, photos),
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
      include: CREDITS_INCLUDE,
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

  /**
   * Yazar / çevirmen sayfası: künye, biyografi ve o kişinin arşivdeki kitapları.
   *
   * **Biyografi ilk ziyarette çekilip kalıcı olarak saklanıyor.** Kişi
   * kaydı eklenirken çekilseydi her kitap eklemesi bir istek daha atardı ve
   * çoğu yazarın sayfası hiç açılmayacaktı. Kaynak susarsa sayfa
   * biyografisiz çizilir (kural 4) — kişi ve kitapları zaten bizde.
   */
  async getPerson(slug: string): Promise<BookPersonPage> {
    const person = await this.prisma.bookPerson.findFirst({
      /**
       * İki anahtar birden aranıyor. Ödül rafındaki yazar bağı kaynağın
       * kendi adres anahtarıyla (`seo_adi`) kuruluyor ve o bizim slug'ımızla
       * aynı olmak zorunda değil — arama tek alana baksaydı arşivde kaydı
       * olan yazar için bile kaynak sayfası çizilirdi (kitapları görünmezdi).
       */
      where: { OR: [{ slug }, { binKitapSeoName: slug }] },
      include: {
        entries: {
          where: { entry: { isDeleted: false } },
          include: { entry: { include: CREDITS_INCLUDE } },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });
    if (!person) {
      return this.sourcePerson(slug);
    }

    const filled = await this.fillBiography(person);
    const books = withSlugs(person.entries.map((link) => link.entry));
    return {
      slug: person.slug,
      name: person.name,
      photo: filled.photo,
      biography: filled.biography,
      roles: [...new Set(person.entries.map((link) => link.role))],
      books,
      awards: toPersonAwards(awardsForPerson(person.name)),
      inArchive: true,
    };
  }

  /**
   * Arşivde kaydı **olmayan** kişinin sayfası.
   *
   * Kullanıcı isteği: ödül rafında bir kitap Türkçeye çevrilmemiş ya da hiç
   * arşivde olmasa bile yazarına tıklanınca sayfası açılsın. Bu yüzden 404
   * son çare oldu — önce kaynağın yazar sayfası, sonra kod içi ödül listesi
   * deneniyor. İkisi de susarsa 404 (uydurma sayfa çizilmiyor).
   *
   * **Kayıt açılmıyor, fotoğraf indirilmiyor.** Arşiv küratörün seçtiği
   * kitapların yeri (kaynak künye sayfasıyla aynı karar); fotoğraf ise
   * kalıcı bir yola yazılmadığı sürece her ziyarette yeniden indirilirdi ve
   * kaynağı hotlink'lemek zaten yapılmıyor.
   */
  private async sourcePerson(slug: string): Promise<BookPersonPage> {
    const awards = awardsForPerson(slug);
    let detail: Awaited<ReturnType<BinKitapService['getPerson']>> = null;
    try {
      detail = await this.binKitap.getPerson(slug);
    } catch {
      // Kaynak susarsa ödül listesi tek başına da sayfayı ayakta tutuyor
      detail = null;
    }

    const name = detail?.name ?? awards[0]?.personName ?? null;
    if (!name) {
      throw new NotFoundException('BOOKS.PERSON_NOT_FOUND');
    }

    return {
      slug,
      name,
      photo: null,
      biography: detail?.biography ?? null,
      // Rol uydurulmuyor: yalnızca ödül listesi yazarlığı kanıtlıyorsa yazılır
      roles: awards.length > 0 ? ['AUTHOR'] : [],
      books: [],
      awards: toPersonAwards(awards),
      inArchive: false,
    };
  }

  /**
   * Seri sayfası: serinin arşivdeki bütün ciltleri, sırasıyla.
   *
   * Ciltler `slug` üzerinden iki yoldan toplanıyor — ilişkisel seri kaydı ve
   * düz metin `seriesName`. Yalnızca ilişkiye bakılsaydı Faz 2a öncesi
   * eklenmiş ciltler serilerinin sayfasında görünmezdi; yalnızca düz metne
   * bakılsaydı ilişkisi kurulmuş ama adı boş kalmış cilt kaybolurdu.
   */
  async getSeriesPage(slug: string): Promise<BookSeriesPage> {
    const [entries, universes, record] = await Promise.all([
      this.prisma.bookEntry.findMany({
        where: { isDeleted: false },
        orderBy: [{ finishedAt: 'desc' }, { createdAt: 'desc' }],
        include: CREDITS_INCLUDE,
      }),
      this.prisma.wikiUniverse.findMany({
        where: { isDeleted: false },
        select: { id: true, slug: true },
      }),
      this.prisma.bookSeries.findUnique({
        where: { slug },
        select: { name: true, description: true, coverImage: true },
      }),
    ]);

    const books = withSlugs(entries);
    const list = books
      .filter(
        (book) =>
          book.credits.series?.slug === slug ||
          (book.seriesName !== null && slugify(book.seriesName) === slug),
      )
      .sort(sortBySeriesIndex);

    if (list.length === 0 && !record) {
      throw new NotFoundException('BOOKS.SERIES_NOT_FOUND');
    }

    // Evren bağı ciltlerden herhangi biri bağlıysa kuruluyor (seri kartıyla aynı)
    const universeSlugs = new Map(
      universes.map((universe) => [universe.id, universe.slug]),
    );
    const universeByEntry = new Map(
      entries.map((entry) => [entry.id, entry.universeId]),
    );
    const universeId =
      list
        .map((book) => universeByEntry.get(book.id) ?? null)
        .find((id): id is string => Boolean(id)) ?? null;

    return {
      slug,
      name:
        record?.name ??
        list.find((book) => book.seriesName)?.seriesName ??
        list[0]?.credits.series?.name ??
        slug,
      description: record?.description ?? null,
      coverImage:
        record?.coverImage ??
        list.find((book) => book.coverImage)?.coverImage ??
        null,
      universeSlug: universeId ? (universeSlugs.get(universeId) ?? null) : null,
      count: list.length,
      readCount: list.filter((book) => book.status === 'READ').length,
      translatedCount: list.filter(
        (book) =>
          book.translationState === 'TRANSLATED' ||
          book.translationState === 'ORIGINAL',
      ).length,
      untranslatedCount: list.filter(
        (book) =>
          book.translationState === 'UNTRANSLATED' ||
          book.translationState === 'IN_PROGRESS',
      ).length,
      books: list,
    };
  }

  /**
   * Biyografi ve fotoğraf eksikse kaynaktan bir kez doldurur.
   *
   * Adres **kaynağın kendi `seo_adi`si** olmak zorunda: ölçüldü ki
   * `/yazar/harper-lee` çalışıyor, `/yazar/harper-lee--566` ve `/yazar/566`
   * ise 200 dönüp BOŞ sayfa veriyor. Kimlik taşıyan biçimlere güvenmek
   * biyografiyi sessizce kaybettirirdi.
   *
   * `seo_adi` yoksa (Faz 2a'da eklenmiş kayıtlarda boş) kendi slug'umuz
   * deneniyor — çoğu adda aynı çıkıyor, tutmazsa sayfa biyografisiz çizilir.
   */
  private async fillBiography(person: {
    id: string;
    slug: string;
    binKitapSeoName: string | null;
    photo: string | null;
    biography: string | null;
  }): Promise<{ photo: string | null; biography: string | null }> {
    if (person.biography) {
      return { photo: person.photo, biography: person.biography };
    }

    const detail = await this.binKitap.getPerson(
      person.binKitapSeoName ?? person.slug,
    );
    if (!detail?.biography && !detail?.photo) {
      return { photo: person.photo, biography: person.biography };
    }

    const photo = person.photo ?? (await this.covers.download(detail.photo));
    const biography = person.biography ?? detail.biography;
    await this.prisma.bookPerson.update({
      where: { id: person.id },
      data: { photo, biography },
    });
    return { photo, biography };
  }

  /** Yayınevi sayfası: o yayınevinden arşivdeki kitaplar. */
  async getPublisher(
    slug: string,
  ): Promise<{ slug: string; name: string; books: ArchiveBook[] }> {
    const publisher = await this.prisma.bookPublisher.findUnique({
      where: { slug },
      include: {
        books: {
          where: { isDeleted: false },
          orderBy: { title: 'asc' },
          include: CREDITS_INCLUDE,
        },
      },
    });
    if (!publisher) {
      throw new NotFoundException('BOOKS.PUBLISHER_NOT_FOUND');
    }
    return {
      slug: publisher.slug,
      name: publisher.name,
      books: withSlugs(publisher.books),
    };
  }

  /**
   * Arşivde olmayan bir kitabın künye sayfası — ödül raflarının tıklanabilir
   * olmasını sağlayan uç.
   *
   * Künye tamamen kaynaktan geliyor ve kaynağın kendi 30 günlük cache'inden
   * okunuyor; **veritabanına hiçbir şey yazılmıyor.** Bağlar (yazar, çevirmen,
   * yayınevi) yalnızca o kayıt arşivde varsa kuruluyor: olmayan kişinin
   * sayfası 404 verirdi. Aynı ayrım kitap sayfasında da geçerli.
   */
  async getSourceBook(slug: string): Promise<SourceBookPage> {
    const detail = await this.binKitap.getDetail(slug);
    if (!detail) {
      throw new NotFoundException('BOOKS.SOURCE_NOT_FOUND');
    }
    const { source, credits } = detail;

    const publisherSlug = credits.publisher ? slugify(credits.publisher) : null;
    const [known, publisher, archived] = await Promise.all([
      this.prisma.bookPerson.findMany({
        where: {
          OR: [
            {
              binKitapId: {
                in: credits.people
                  .map((person) => person.binKitapId)
                  .filter((id): id is string => id !== null),
              },
            },
            {
              slug: {
                in: credits.people.map((person) => slugify(person.name)),
              },
            },
          ],
        },
        select: { slug: true, binKitapId: true },
      }),
      publisherSlug
        ? this.prisma.bookPublisher.findUnique({
            where: { slug: publisherSlug },
            select: { slug: true },
          })
        : Promise.resolve(null),
      this.findArchivedBySource(slug, source.isbn13),
    ]);

    // Eşleştirme sırası kayıt açmadakiyle aynı: kaynak kimliği önce, ad yedek
    const byBinKitapId = new Map(
      known
        .filter((person) => person.binKitapId !== null)
        .map((person) => [person.binKitapId, person.slug]),
    );
    const bySlug = new Set(known.map((person) => person.slug));

    return {
      slug,
      title: source.title,
      subtitle: source.subtitle,
      originalTitle: source.originalTitle,
      authors: source.authors,
      translator: detail.translator,
      editor: detail.raw.editor,
      publisher: source.publisher,
      publisherSlug: publisher?.slug ?? null,
      publishedYear: source.publishedYear,
      firstPublishedYear: source.firstPublishedYear,
      pageCount: source.pageCount,
      language: source.language,
      isbn13: source.isbn13,
      coverImage: source.coverImage,
      description: source.description,
      genres: source.genres,
      seriesName: source.seriesName,
      seriesIndex: source.seriesIndex,
      people: credits.people.map((person) => {
        const ownSlug = slugify(person.name);
        return {
          name: person.name,
          role: person.role,
          slug:
            (person.binKitapId
              ? byBinKitapId.get(person.binKitapId)
              : undefined) ?? (bySlug.has(ownSlug) ? ownSlug : null),
        };
      }),
      inArchive: archived !== null,
      archiveSlug: archived,
    };
  }

  /**
   * Bu kaynak kaydının arşivdeki karşılığının adresi.
   *
   * Adres sütun değil, başlıktan türetiliyor ve çakışmada yıl/sıra ekleniyor
   * (`withSlugs`) — bu yüzden arşiv aynı yoldan okunuyor, `slugify` burada
   * tekrar edilmiyor (ödül servisindeki aynı gerekçe).
   */
  private async findArchivedBySource(
    binKitapSlug: string,
    isbn13: string | null,
  ): Promise<string | null> {
    const entries = await this.prisma.bookEntry.findMany({
      where: { isDeleted: false },
      orderBy: [{ finishedAt: 'desc' }, { createdAt: 'desc' }],
      include: CREDITS_INCLUDE,
    });
    const hit = withSlugs(entries).find(
      (book) =>
        book.binKitapSlug === binKitapSlug ||
        (isbn13 !== null && book.isbn13 === isbn13),
    );
    return hit?.slug ?? null;
  }

  // --- Admin ---

  /**
   * Arşive eklemek için arama. Sonuçta arşivde olanlar işaretli gelir —
   * küratör aynı kitabı iki kez eklemeye çalışmasın.
   */
  async search(
    query: string,
  ): Promise<Array<BookSource & { inArchive: boolean }>> {
    const results = await this.searchOrResolve(query);
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

  /**
   * Sorgu bir **1000Kitap kitap adresi** ise doğrudan o künyeyi döner, değilse
   * normal arama yapar.
   *
   * Kullanıcı isteği: "istediğim kitabın linkini yapıştırıp detayları buradan
   * al diyebileyim." Gerekliliği ölçümle de görüldü — aynı eserin kaynakta
   * birden çok baskısı var (*Sessiz Kılıç* için en az `--308785` ve `--498745`,
   * ISBN'leri farklı) ve arama hangi baskıyı öne çıkaracağını küratör adına
   * seçiyor. Adres ise **tam olarak o baskıyı** işaret ediyor.
   *
   * Adres çözülemezse (silinmiş kayıt, yanlış anahtar) sessizce normal aramaya
   * düşülüyor: küratör en azından bir liste görsün.
   */
  private async searchOrResolve(query: string): Promise<BookSource[]> {
    if (!binKitapSlug(query)) {
      return this.source.search(query);
    }
    try {
      const direct = await this.binKitap.getByUrl(query);
      if (direct) {
        return [direct];
      }
    } catch {
      // Kaynak düştü; aşağıdaki normal arama denenir (kural 4)
    }
    return this.source.search(query);
  }

  findAllForAdmin() {
    return this.prisma.bookEntry.findMany({
      where: { isDeleted: false },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Dış adresle duran kapakları kendi diskimize taşır (kullanıcı kararı:
   * hotlink yok). 1000Kitap'tan önce eklenmiş kayıtlar için tek seferlik.
   *
   * Bir kapak inmezse kayıt olduğu gibi bırakılıp tura devam edilir — tek
   * kırık adres yüzünden bütün geri doldurma durmasın.
   */
  async localizeCovers(): Promise<{ scanned: number; localized: number }> {
    const entries = await this.prisma.bookEntry.findMany({
      where: {
        isDeleted: false,
        coverImage: { not: null, startsWith: 'http' },
      },
      select: { id: true, coverImage: true },
    });

    let localized = 0;
    for (const entry of entries) {
      const local = await this.covers.download(entry.coverImage);
      if (!local) {
        continue;
      }
      await this.prisma.bookEntry.update({
        where: { id: entry.id },
        data: { coverImage: local },
      });
      localized += 1;
    }
    return { scanned: entries.length, localized };
  }

  /**
   * Fotoğrafı olmayan kişilerin portrelerini kaynaktan indirir.
   *
   * Portre normalde **kişi sayfası ilk açıldığında** iniyor (`fillBiography`);
   * hiç ziyaret edilmemiş yazarın fotoğrafı da yok. Salonun yazar paneline
   * portreler gelince (kullanıcı isteği) bu görünür oldu: panel çoğunlukla
   * madalyonla doluyordu. Bu iş onu tek seferde kapatıyor.
   *
   * **Elle tetikleniyor, arka planda değil.** Kaynağın kuyruğu paylaşımlı ve
   * saniyede bir istek geçiyor; onlarca yazarı sayfa açılışında yüklemek
   * küratör aramasını yine askıya alırdı (bkz. kuyruk açlığı notu).
   *
   * Bir kişi düşerse tura devam ediliyor — tek kırık adres bütün işi
   * durdurmasın. Hız sınırı görülürse tur **biter**: ısrar yeni 429'dan başka
   * bir şey getirmiyor (ölçüldü).
   */
  async backfillPersonPhotos(): Promise<{ scanned: number; filled: number }> {
    const people = await this.prisma.bookPerson.findMany({
      where: { photo: null },
      select: { id: true, slug: true, binKitapSeoName: true },
    });

    let filled = 0;
    for (const person of people) {
      let detail: Awaited<ReturnType<BinKitapService['getPerson']>> = null;
      try {
        detail = await this.binKitap.getPerson(
          person.binKitapSeoName ?? person.slug,
        );
      } catch (error) {
        if (error instanceof BinKitapRateLimitError) {
          break;
        }
        continue;
      }
      const photo = await this.covers.download(detail?.photo ?? null);
      if (!photo) {
        continue;
      }
      await this.prisma.bookPerson.update({
        where: { id: person.id },
        // Biyografi de elimizdeyken yazılıyor: aynı isteğin ikinci ürünü
        data: { photo, biography: detail?.biography ?? undefined },
      });
      filled += 1;
    }
    return { scanned: people.length, filled };
  }

  /**
   * Onay bekleyen türler: kaynaktan geldi ama sözlükte karşılığı yok.
   *
   * Kullanıcı kararı gereği bunlar otomatik kabul edilmiyor — süzgeçte
   * görünmüyorlar, burada listelenip elle onaylanıyorlar. Kaç kitapta
   * geçtikleri birlikte dönüyor: "1 kitapta geçen tür" ile "40 kitapta geçen
   * tür" farklı kararlar.
   */
  async pendingGenres(): Promise<
    Array<{ id: string; name: string; slug: string; bookCount: number }>
  > {
    const genres = await this.prisma.bookGenre.findMany({
      where: { isApproved: false },
      include: { _count: { select: { entries: true } } },
    });
    return genres
      .map((genre) => ({
        id: genre.id,
        name: genre.name,
        slug: genre.slug,
        bookCount: genre._count.entries,
      }))
      .sort((a, b) => b.bookCount - a.bookCount);
  }

  /**
   * Bir türü onaylar ya da reddeder.
   *
   * Reddetmek türü **siliyor**, gizlemiyor: aksi hâlde aynı ad her kitap
   * eklemesinde yeniden bekleyenlere düşer ve liste hiç boşalmaz. Silinince
   * kitapla bağı da düşüyor (`onDelete: Cascade`), zaten süzgeçte görünmüyordu.
   */
  async reviewGenre(id: string, approve: boolean): Promise<{ id: string }> {
    if (approve) {
      await this.prisma.bookGenre.update({
        where: { id },
        data: { isApproved: true },
      });
    } else {
      await this.prisma.bookGenre.delete({ where: { id } });
    }
    return { id };
  }

  /**
   * Mevcut kayıtların düz metin künyesinden ilişkileri kurar (Faz 2a geçişi).
   *
   * 1000Kitap'tan önce eklenmiş kitaplarda yazar/yayınevi/tür yalnızca metin
   * olarak var. Burada aynı `link` yolundan geçiriliyorlar — ayrı bir
   * dönüştürme kodu yazmamak için düz metin, kaynağın verdiği yapıya
   * çevriliyor. Kimlik yok, eşleştirme ada göre yapılıyor; kitap sonradan
   * 1000Kitap'tan tazelenirse kimlik o zaman dolar.
   */
  async backfillCredits(): Promise<{ scanned: number; linked: number }> {
    const entries = await this.prisma.bookEntry.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        authors: true,
        translator: true,
        publisher: true,
        genres: true,
        seriesName: true,
        seriesIndex: true,
      },
    });

    let linked = 0;
    for (const entry of entries) {
      const people = [
        ...entry.authors.map((name, index) => ({
          binKitapId: null,
          name,
          // Geri doldurmada kaynak kimliği yok: kayıtta yalnızca düz metin
          // var. Kitap 1000Kitap'tan tazelenirse kimlikler o zaman dolar.
          seoName: null,
          photo: null,
          role: 'AUTHOR' as const,
          orderIndex: index,
        })),
        // Çevirmen sütunu birden çok adı virgülle taşıyabiliyor
        ...splitNames(entry.translator).map((name, index) => ({
          binKitapId: null,
          name,
          // Geri doldurmada kaynak kimliği yok: kayıtta yalnızca düz metin
          // var. Kitap 1000Kitap'tan tazelenirse kimlikler o zaman dolar.
          seoName: null,
          photo: null,
          role: 'TRANSLATOR' as const,
          orderIndex: index,
        })),
      ];
      const credits = {
        people,
        genres: entry.genres.map((name) => ({ binKitapId: null, name })),
        publisher: entry.publisher,
        series: entry.seriesName
          ? { name: entry.seriesName, index: entry.seriesIndex }
          : null,
      };
      if (
        people.length === 0 &&
        credits.genres.length === 0 &&
        !credits.publisher &&
        !credits.series
      ) {
        continue;
      }

      const { publisherId, seriesId } = await this.credits.link(
        entry.id,
        credits,
      );
      await this.prisma.bookEntry.update({
        where: { id: entry.id },
        data: { publisherId, seriesId },
      });
      linked += 1;
    }
    return { scanned: entries.length, linked };
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
    /**
     * Künye tekrar kontrolünden ÖNCE çekiliyor: kontrol eserin adına ve
     * yazarına bakıyor, ikisi de ancak künye gelince biliniyor. Maliyeti yok,
     * künye zaten `ExternalCache`ten okunuyor. Kapak ise kontrolden SONRA
     * indiriliyor — zaten arşivde olan kitap için dosya yazılmasın.
     */
    const { source: seed, translator, raw, credits } = await this.seed(dto);
    const duplicate = await this.findDuplicate(dto, userId, seed);
    if (duplicate) {
      throw new ConflictException('BOOKS.ALREADY_IN_ARCHIVE');
    }

    const status = dto.status ?? 'READ';
    const translationState = await this.resolveTranslation(dto, seed);
    /**
     * Kapak **indiriliyor**, dış adres saklanmıyor (kullanıcı kararı: hotlink
     * yok). İndirme başarısızsa dış adres son çare olarak kalıyor — kapaksız
     * kayıt açmaktansa kırılabilir bir adres iyidir, küratör sonra düzeltir.
     */
    const localCover = await this.covers.download(seed?.coverImage);
    const entry = await this.prisma.bookEntry.create({
      data: {
        googleId: dto.googleId ?? null,
        olKey: dto.olKey ?? seed?.olKey ?? null,
        binKitapSlug: dto.binKitapSlug ?? seed?.binKitapSlug ?? null,
        isbn13: seed?.isbn13 ?? null,
        title: dto.title ?? seed?.title ?? 'Adsız kitap',
        originalTitle: seed?.originalTitle ?? null,
        authors: seed?.authors ?? [],
        translator,
        publisher: seed?.publisher ?? null,
        publishedYear: seed?.publishedYear ?? null,
        firstPublishedYear: seed?.firstPublishedYear ?? null,
        pageCount: seed?.pageCount ?? null,
        language: seed?.language ?? null,
        coverImage: localCover ?? seed?.coverImage ?? null,
        description: seed?.description ?? null,
        genres: seed?.genres ?? [],
        seriesName: dto.seriesName ?? seed?.seriesName ?? null,
        seriesIndex: dto.seriesIndex ?? seed?.seriesIndex ?? null,
        status,
        translationState,
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
        /**
         * Ham anlık görüntü: künye + `BookSource`a sığmayan 1000Kitap alanları
         * (ülke, editör, format, orijinal dil, diğer baskı sayısı). Kullanıcı
         * kararı — şema büyütmek yerine ham veri saklansın, ileride gereken
         * sütuna terfi ettirilsin.
         */
        externalData: (seed
          ? { ...seed, binKitap: raw ?? undefined }
          : undefined) as unknown as Prisma.InputJsonValue,
        externalDataFetchedAt: seed ? new Date() : null,
        userId,
      },
    });

    /**
     * İlişkisel künye (Faz 2a) kayıt AÇILDIKTAN sonra kuruluyor: join
     * tabloları kitabın kimliğini istiyor. Yalnızca 1000Kitap yapısal veri
     * veriyor (kimlikli kişi ve tür); Google/Open Library'den eklenen kitap
     * düz metin künyesiyle kalıyor ve küratör isterse elle bağlar.
     *
     * Bu adım kaydı **bozamaz**: `link` fırlatmıyor, en kötü ihtimalle
     * ilişkiler boş kalır ve arayüz zaten hâlâ düz metin sütunlarını okuyor.
     */
    if (!credits) {
      return entry;
    }
    const { publisherId, seriesId } = await this.credits.link(
      entry.id,
      credits,
    );
    if (!publisherId && !seriesId) {
      return entry;
    }
    return this.prisma.bookEntry.update({
      where: { id: entry.id },
      data: { publisherId, seriesId },
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

    /**
     * Tazeleme kapağı yalnızca kayıt kapaksızken dolduruyor — ve dolduruyorsa
     * dış adresi saklamak yerine indiriyor (kullanıcı kararı: hotlink yok).
     */
    const filledCover =
      entry.coverImage ?? (await this.covers.download(fresh.coverImage));

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
        coverImage: filledCover ?? fresh.coverImage,
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
    seed: BookSource | null,
  ): Promise<BookEntry | null> {
    const or: Prisma.BookEntryWhereInput[] = [];

    // 1) Kaynak kimlikleri — kesin eşleşme, aynı kaydın kendisi
    if (dto.googleId) {
      or.push({ googleId: dto.googleId });
    }
    if (dto.olKey) {
      or.push({ olKey: dto.olKey });
    }

    /**
     * 2) **Eser** seviyesi: orijinal ad + yazar.
     *
     * Bu kontrol ISBN'den ÖNCE geliyor ve sırası bilerek böyle (kullanıcı
     * kararı: "aynı kitap iki kez oluşmasın"). ISBN bir **baskı** kimliği;
     * aynı eserin iki baskısı iki ayrı ISBN taşır, ISBN'e bakarak karar
     * verilse *Bülbülü Öldürmek*'in Sel ve Epsilon baskıları iki ayrı kitap
     * sayılırdı — tam da engellenmek istenen şey.
     */
    const author = seed?.authors[0] ?? null;
    for (const title of [seed?.originalTitle, seed?.title, dto.title]) {
      if (!title) {
        continue;
      }
      const clause: Prisma.BookEntryWhereInput = author
        ? {
            OR: [
              { title: { equals: title, mode: 'insensitive' } },
              { originalTitle: { equals: title, mode: 'insensitive' } },
            ],
            authors: { has: author },
          }
        : { title: { equals: title, mode: 'insensitive' } };
      or.push(clause);
    }

    // 3) Aynı baskı: ISBN. Eser kontrolü kaçırmışsa son ağ.
    if (seed?.isbn13) {
      or.push({ isbn13: seed.isbn13 });
    }

    if (or.length === 0) {
      return null;
    }
    return this.prisma.bookEntry.findFirst({
      where: { userId, isDeleted: false, OR: or },
    });
  }

  /**
   * Çeviri durumunun son hâli.
   *
   * Küratörün seçtiği baskı İngilizce olduğu için arayüz "henüz çevrilmedi"
   * öneriyor — ama bu, **eserin** çevrilmediği anlamına gelmiyor: küratör
   * çevirisi olan bir kitabın İngilizce baskısını seçmiş de olabilir. Böyle
   * bir durumda kaynağa bir kez daha sorulup Türkçe baskı gerçekten varsa
   * damga "Türkçesi var"a çevriliyor.
   *
   * Yalnızca UNTRANSLATED yukarı düzeltiliyor: "çevrilmiş" demek kolay,
   * "çevrilmemiş" demek zor bir iddia ve bu kanadın en görünür satırını
   * ("5 kitaptan 3'ü Türkçe") yanlış besliyor. Kaynak susarsa (null) hiçbir
   * şey değişmiyor, küratörün seçimi kalıyor.
   */
  private async resolveTranslation(
    dto: CreateBookEntryDto,
    seed: BookSource | null,
  ): Promise<BookEntry['translationState']> {
    const picked = dto.translationState ?? guessTranslation(seed);
    if (picked !== 'UNTRANSLATED') {
      return picked;
    }
    const title = seed?.originalTitle ?? seed?.title ?? dto.title ?? '';
    if (!title) {
      return picked;
    }
    const exists = await this.source.hasTurkishEdition(
      title,
      seed?.authors[0] ?? null,
    );
    return exists === true ? 'TRANSLATED' : picked;
  }

  /**
   * Dış kaynaktan ilk veriyi çeker; erişilemezse null (kayıt yine açılır).
   *
   * Google cilt künyesi düşerse (anahtarsız isteklerde `429` görülüyor) kayıt
   * künyesiz kalmasın diye ada göre aramaya düşülüyor — `search` kendi içinde
   * zaten Open Library'ye düşebiliyor.
   */
  private async seed(dto: CreateBookEntryDto): Promise<BookSeed> {
    /**
     * 1000Kitap önce denenir: Türkçe ad, çevirmen, yayınevi ve gerçek kapak
     * en eksiksiz orada. Düşerse aşağıdaki kaynaklara sessizce inilir —
     * kayıt açılamaması kabul edilemez (kural 4).
     */
    if (dto.binKitapSlug) {
      try {
        const detail = await this.binKitap.getDetail(dto.binKitapSlug);
        if (detail) {
          return {
            source: detail.source,
            translator: detail.translator,
            raw: detail.raw,
            credits: detail.credits,
          };
        }
      } catch {
        // Kaynak düştü; Google/Open Library denenir
      }
    }
    if (dto.googleId) {
      try {
        return {
          ...EMPTY_SEED,
          source: await this.source.enrich(
            await this.source.getVolume(dto.googleId),
          ),
        };
      } catch {
        // Cilt künyesi alınamadı; aşağıdaki ada göre arama denenir
      }
    }
    /**
     * Kimlikten çözülemeyen kayıt — başlıca **Open Library** seçimleri, çünkü
     * o kaynağın tek kayıt ucu yok; bir de kaynaksız elle eklemeler.
     *
     * **Yazar sorguya giriyor.** Yalnızca adla aramak genel adlarda felakete
     * yol açıyor: "Miras" sorgusu 1000Kitap'ta *Kültürel Miras Duyarlılığı ve
     * Somut Olmayan Kültürel Miras Tutumları* kaydını döndürüyor ve eskiden
     * bu sonuç **körü körüne** kabul ediliyordu — kullanıcı R. A. Salvatore'un
     * *Miras*'ını ekledi, arşive o akademik çalışmanın künyesi yazıldı.
     */
    if (dto.title) {
      try {
        const query = dto.author ? `${dto.title} ${dto.author}` : dto.title;
        const results = await this.source.search(query);
        const picked = pickSeed(results, dto);
        return {
          ...EMPTY_SEED,
          source: picked ? await this.source.enrich(picked) : null,
        };
      } catch {
        return EMPTY_SEED;
      }
    }
    return EMPTY_SEED;
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

/**
 * Tek sütunda virgülle duran adları ayırır ("Ülker İnce, Bilge Sancı").
 * Kaynak birden çok çevirmeni bu biçimde veriyor; ilişkisel modelde her biri
 * ayrı kişi olmalı.
 */
function splitNames(value: string | null): string[] {
  if (!value) {
    return [];
  }
  return value
    .split(',')
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
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
    binKitapSlug: null,
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
    // Arşivdeki kayıt zaten seçilmiş; popülerlik sıralaması yalnızca arama
    // sonuçlarını dizmek için var, burada anlamı yok
    popularity: 0,
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
function withSlugs(entries: BookEntryWithCredits[]): ArchiveBook[] {
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

/**
 * İlişkileri yüklenmiş kayıt.
 *
 * İlişkiler **zorunlu** ve bu bilinçli bir kısıt: `ArchiveBook.credits`
 * sözleşmenin parçası, yani bir kaydı arşiv nesnesine çeviren her sorgunun
 * `CREDITS_INCLUDE` kullanması gerekiyor. Alanlar bir ara isteğe bağlıydı ve
 * tam da beklenen hata oldu — kitap sayfasının sorgusu `include` almayı
 * atlayınca künye sessizce boş döndü, yazar adı tıklanamaz hâle geldi ve
 * derleyici hiçbir şey söylemedi. Zorunlu olunca aynı hata derlemede patlıyor.
 */
type BookEntryWithCredits = BookEntry & {
  people: Array<{
    role: BookPersonRole;
    orderIndex: number;
    person: { slug: string; name: string };
  }>;
  publisherRef: { slug: string; name: string } | null;
  series: { slug: string; name: string } | null;
};

/** Salon ve kitap sayfasının künye bağları için ortak `include`. */
const CREDITS_INCLUDE = {
  people: {
    include: { person: { select: { slug: true, name: true } } },
    orderBy: { orderIndex: 'asc' },
  },
  publisherRef: { select: { slug: true, name: true } },
  series: { select: { slug: true, name: true } },
} satisfies Prisma.BookEntryInclude;

function toCredits(entry: BookEntryWithCredits): BookCredits {
  return {
    people: entry.people.map((link) => ({
      slug: link.person.slug,
      name: link.person.name,
      role: link.role,
    })),
    publisher: entry.publisherRef,
    series: entry.series,
  };
}

function toArchiveBook(entry: BookEntryWithCredits): ArchiveBook {
  return {
    id: entry.id,
    slug: '',
    credits: toCredits(entry),
    googleId: entry.googleId,
    olKey: entry.olKey,
    binKitapSlug: entry.binKitapSlug,
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

/**
 * Yazar paneli: arşivden türetilir, elle yazılmaz.
 *
 * Liste **kırpılmıyor**: salon ilk iki sırayı gösterip kalanı kendi yazarlar
 * sayfasına devrediyor (kullanıcı isteği), o sayfanın da tam listeye ihtiyacı
 * var. Arşiv zaten bütün kitaplarıyla geliyor, birkaç düzine yazar kartı
 * yanında hiçbir şey.
 */
function buildAuthors(
  books: ArchiveBook[],
  photos: Map<string, string | null>,
): BookAuthorCard[] {
  const groups = new Map<string, ArchiveBook[]>();
  for (const book of books) {
    for (const name of book.authors) {
      const list = groups.get(name) ?? [];
      list.push(book);
      groups.set(name, list);
    }
  }

  /**
   * Düz metin yazar adından kişi sayfasının adresine köprü.
   *
   * Panel `authors` **düz metin** sütunundan kuruluyor (Faz 2c'de düşecek),
   * sayfa adresi ise ilişkisel kayıttan geliyor. İkisini burada birleştirmek
   * şart: aksi hâlde ilişkisi olan yazarın kartı bile tıklanmıyordu
   * (kullanıcı bildirimi).
   *
   * Anahtar iki biçimde yazılıyor — adın kendisi ve katlanmış hâli: künyedeki
   * "Robert Jordan" ile düz metindeki "ROBERT JORDAN" aynı kişi.
   */
  const personSlugs = new Map<string, string>();
  for (const book of books) {
    for (const person of book.credits.people) {
      if (person.role !== 'AUTHOR') {
        continue;
      }
      personSlugs.set(person.name, person.slug);
      personSlugs.set(slugify(person.name), person.slug);
    }
  }

  return [...groups.entries()]
    .map(([name, list]) => {
      const rated = list.filter((book) => book.personalRating !== null);
      const sum = rated.reduce(
        (total, book) => total + (book.personalRating ?? 0),
        0,
      );
      const slug =
        personSlugs.get(name) ?? personSlugs.get(slugify(name)) ?? null;
      return {
        name,
        slug,
        photo: slug ? (photos.get(slug) ?? null) : null,
        count: list.length,
        readCount: list.filter((book) => book.status === 'READ').length,
        averageRating:
          rated.length > 0 ? Number((sum / rated.length).toFixed(1)) : null,
        coverImage: list.find((book) => book.coverImage)?.coverImage ?? null,
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'tr'));
}

/**
 * Bir adın karşılaştırılabilir anahtarları.
 *
 * İki biçim birden üretiliyor çünkü `slugify` kesme işaretini ayraca
 * çeviriyor: "Flann O'Brien" bizde `flann-o-brien`, ödül listesindeki aynı ad
 * kesmesiz yazılmış olabiliyor. Tek biçime güvenmek o yazarı sessizce
 * ıskalatırdı.
 */
function nameKeys(value: string): string[] {
  return [slugify(value), slugify(value.replace(/[’'`]/g, ''))].filter(
    (key) => key.length > 0,
  );
}

/**
 * Kişinin kod içi ödül listesinde geçtiği yerler.
 *
 * `personName` yalnızca **arşivde kaydı olmayan** yazar için gerekli: sayfanın
 * başlığına yazılacak adın tek kaynağı o zaman bu liste oluyor. Dışarı
 * dönerken ayıklanıyor.
 */
function awardsForPerson(
  nameOrSlug: string,
): Array<BookPersonAward & { personName: string }> {
  const wanted = new Set(nameKeys(nameOrSlug));
  if (wanted.size === 0) {
    return [];
  }

  const found: Array<BookPersonAward & { personName: string }> = [];
  for (const award of AWARDS) {
    for (const winner of award.winners) {
      if (!nameKeys(winner.author).some((key) => wanted.has(key))) {
        continue;
      }
      found.push({
        key: award.key,
        name: award.name,
        year: winner.year,
        // Nobel yazara verilir: eser satırı temsilci eser, yoksa boş
        title:
          award.grantedTo === 'AUTHOR'
            ? (winner.notableWork ?? null)
            : winner.title,
        personName: winner.author,
      });
    }
  }
  return found.sort((a, b) => b.year - a.year);
}

/**
 * Arama sonucundan **küratörün seçtiği** kaydı bulur.
 *
 * Eskiden burada körü körüne `results[0]` alınıyordu ve bu gerçek bir hataya
 * yol açtı: Open Library'den seçilen *Miras* (R. A. Salvatore) eklenirken
 * `seed` kimlik dalı bulamayıp ada göre arıyor, "Miras" sorgusu bambaşka bir
 * kitap döndürüyor ve **onun künyesi** yazılıyordu — kapağı, ISBN'i, arka
 * kapağı, yazarı dahil. Kullanıcı bildirdi.
 *
 * İki kademe:
 *  1. **Kimlik** — kesin. Aynı arama listesi küratöre gösterilmişti, seçilen
 *     kayıt kimliğiyle içinde duruyor.
 *  2. **Ad + yazar** — doğrulanmış yedek. Ad **birebir** aranıyor: gevşek
 *     eşleşme burada *Dune* yerine *Dune Mesihi*'ni getirirdi (ödül
 *     eşleştirmesinde ölçülmüş tuzağın aynısı).
 *
 * Hiçbiri tutmazsa `null`: kayıt yalnızca adıyla açılır, künyeyi küratör
 * doldurur. **Doğrulanmamış künye yazmaktansa boş bırakmak doğru** — kod
 * tabanının geri kalanında da geçerli olan kural.
 *
 * Sınıfın dışında ve **dışa açık**: saf bir işlev ve arşive yazılan künyenin
 * doğruluğu buna bağlı — `books.service.spec.ts` bunu doğrudan sınıyor
 * (ödül eşleştirmesindeki `pickBest` ile aynı gerekçe).
 */
export function pickSeed(
  results: BookSource[],
  dto: CreateBookEntryDto,
): BookSource | null {
  const byIdentity = results.find(
    (item) =>
      (dto.olKey !== undefined && item.olKey === dto.olKey) ||
      (dto.googleId !== undefined && item.googleId === dto.googleId) ||
      (dto.binKitapSlug !== undefined &&
        item.binKitapSlug === dto.binKitapSlug),
  );
  if (byIdentity) {
    return byIdentity;
  }

  // Yazar bilinmiyorsa doğrulanacak bir şey yok; tahmin yürütülmüyor
  const wantedTitle = dto.title ? slugify(dto.title) : '';
  const wantedAuthor = dto.author ? slugify(dto.author) : '';
  if (!wantedTitle || !wantedAuthor) {
    return null;
  }

  return (
    results.find(
      (item) =>
        slugify(item.title) === wantedTitle &&
        item.authors.some((name) => looseMatch(slugify(name), wantedAuthor)),
    ) ?? null
  );
}

/**
 * Katlanmış iki adın tutup tutmadığı — birebir ya da biri ötekini içeriyor.
 *
 * Boş anahtar **her zaman** başarısız: `slugify` ASCII dışı yazıyı tamamen
 * eliyor ve `''.includes` ile `x.includes('')` sessizce `true` dönerdi
 * (ödül eşleştirmesinde aynı tuzağa `titleRank` içinde guard konmuştu).
 */
function looseMatch(left: string, right: string): boolean {
  if (!left || !right) {
    return false;
  }
  return left === right || left.includes(right) || right.includes(left);
}

/** `personName` yalnızca sayfa başlığını bulmak içindi; dışarı çıkmıyor. */
function toPersonAwards(
  awards: Array<BookPersonAward & { personName: string }>,
): BookPersonAward[] {
  return awards.map((award) => ({
    key: award.key,
    name: award.name,
    year: award.year,
    title: award.title,
  }));
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
    // Yalnızca ada bakılıyor; portre haritası burada gereksiz
    topAuthor: buildAuthors(read, new Map())[0]?.name ?? null,
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
