import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slugify';

/**
 * Kitap künyesinin dış kaynakları: **Google Books** ana kaynak, **Open
 * Library** eksik kalan yerleri doldurur (kullanıcı kararı).
 *
 * İş bölümü rastgele değil, iki kaynağın gerçekten iyi olduğu yerler farklı:
 *  - Google Books Türkçe **baskıları** biliyor (yayıncı, ISBN, kapak) ama
 *    eserin ilk yayım yılını baskı yılıyla karıştırıyor ve seri bilgisi yok.
 *  - Open Library eserin **kendisini** biliyor (`first_publish_year`, seri,
 *    orijinal ad) ama Türkçe baskıların çoğu kayıtlı değil.
 *
 * Bu yüzden akış şu: Google'da Türkçe baskı aranır → seçilen kitap Open
 * Library'de eseriyle eşleştirilip ilk yayım yılı/seri/orijinal ad eklenir.
 * Türkçe baskı hiç yoksa kitap orijinal diliyle döner ve "henüz çevrilmedi"
 * olarak işaretlenir (kullanıcı kararı: seri eksik görünmesin).
 *
 * Her yanıt `ExternalCache`e yazılır (kural 4/14): künye neredeyse hiç
 * değişmez, her sayfa açılışında dış istek atmak gereksizdir.
 */

const GOOGLE_BASE = 'https://www.googleapis.com/books/v1';
const OPENLIBRARY_BASE = 'https://openlibrary.org';
const OPENLIBRARY_COVERS = 'https://covers.openlibrary.org/b/id';

// Kural 14: künye TTL'i 7 gün. Kitap künyesi filmden de durgun ama aynı
// varsayılanda kalıyor — tek bir sayı takip etmek yeterli.
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// Arama sonucu kaç kayıt taşır (Türkçe ve genel arama birlikte)
const SEARCH_LIMIT = 20;

/** Arama sonucu ve künye için ortak biçim — iki kaynak da buna indirgenir. */
export interface BookSource {
  googleId: string | null;
  olKey: string | null;
  isbn13: string | null;
  title: string;
  subtitle: string | null;
  authors: string[];
  publisher: string | null;
  publishedYear: number | null;
  firstPublishedYear: number | null;
  pageCount: number | null;
  /** Baskının dili ("tr", "en"…) — çeviri durumu bundan tahmin edilir */
  language: string | null;
  coverImage: string | null;
  description: string | null;
  genres: string[];
  seriesName: string | null;
  seriesIndex: number | null;
  originalTitle: string | null;
  provider: 'GOOGLE' | 'OPENLIBRARY';
}

interface GoogleVolumeRaw {
  id?: string;
  volumeInfo?: {
    title?: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    language?: string;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    industryIdentifiers?: Array<{ type?: string; identifier?: string }>;
  };
}

interface GoogleVolumesResponse {
  items?: GoogleVolumeRaw[];
}

interface OpenLibraryDoc {
  key?: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  number_of_pages_median?: number;
  series?: string[];
  language?: string[];
  subject?: string[];
}

interface OpenLibrarySearchResponse {
  docs?: OpenLibraryDoc[];
}

@Injectable()
export class GoogleBooksService {
  private readonly logger = new Logger(GoogleBooksService.name);
  /** İsteğe bağlı: anahtarsız da çalışır, anahtar yalnızca kotayı yükseltir */
  private readonly apiKey?: string;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService,
  ) {
    this.apiKey = config.get<string>('GOOGLE_BOOKS_API_KEY');
  }

  /**
   * Küratörün arşive kitap eklerken kullandığı arama.
   *
   * Önce `langRestrict=tr` ile Türkçe baskılar, sonra genel arama; ikisi
   * birleştirilir ve Türkçe olanlar başa alınır. Böylece "Dune" araması önce
   * Türkçe baskıyı, altında da orijinalini gösteriyor — çevrilmemiş kitabı da
   * eklemek mümkün kalıyor (kullanıcı kararı).
   *
   * Cache'lenmez: sorgu her seferinde farklı.
   */
  async search(query: string): Promise<BookSource[]> {
    const trimmed = query.trim();
    if (!trimmed) {
      return [];
    }

    const [turkish, general] = await Promise.all([
      this.googleSearch(trimmed, 'tr'),
      this.googleSearch(trimmed),
    ]);

    const merged: BookSource[] = [];
    const seen = new Set<string>();
    for (const item of [...turkish, ...general]) {
      // Aynı baskı iki listede de olabilir; kimlik Google numarası
      const key = item.googleId ?? `${item.title}|${item.authors[0] ?? ''}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      merged.push(item);
    }

    // Google'da hiç sonuç yoksa (eski ya da niş kitap) Open Library'ye düşülür
    if (merged.length === 0) {
      return this.openLibrarySearch(trimmed);
    }
    return merged.slice(0, SEARCH_LIMIT);
  }

  /**
   * Tek bir cildin künyesi. Kayıt açılırken ve "⟳ tazele" ile çağrılır;
   * dış istek düşerse bayat cache sunulur, kullanıcıya hata gösterilmez.
   */
  async getVolume(googleId: string): Promise<BookSource> {
    const cacheKey = `books:google:v1:${googleId}`;
    const cached = await this.prisma.externalCache.findUnique({
      where: { cacheKey },
    });
    if (cached && Date.now() - cached.fetchedAt.getTime() < CACHE_TTL_MS) {
      return cached.payload as unknown as BookSource;
    }

    try {
      const raw = await this.googleRequest<GoogleVolumeRaw>(
        `/volumes/${encodeURIComponent(googleId)}`,
      );
      const book = normalizeGoogle(raw);
      if (!book) {
        throw new ServiceUnavailableException('BOOKS.SOURCE_UNAVAILABLE');
      }
      await this.writeCache(cacheKey, book);
      return book;
    } catch (error) {
      if (cached) {
        this.logger.warn(
          `Google Books ${googleId} yenilenemedi, bayat cache sunuluyor: ${String(error)}`,
        );
        return cached.payload as unknown as BookSource;
      }
      throw error;
    }
  }

  /**
   * Google'dan gelen künyeyi Open Library ile tamamlar: ilk yayım yılı, seri
   * adı/sırası ve orijinal ad. Bulunamazsa künye olduğu gibi döner — eksik
   * alan sayfayı bozmuyor (kural 4).
   */
  async enrich(book: BookSource): Promise<BookSource> {
    const author = book.authors[0] ?? '';
    const title = book.originalTitle ?? book.title;
    const cacheKey = `books:ol:v1:${slugKey(title)}:${slugKey(author)}`;
    const cached = await this.prisma.externalCache.findUnique({
      where: { cacheKey },
    });

    let doc: OpenLibraryDoc | null = null;
    if (cached && Date.now() - cached.fetchedAt.getTime() < CACHE_TTL_MS) {
      doc = cached.payload as unknown as OpenLibraryDoc | null;
    } else {
      try {
        doc = await this.openLibraryLookup(title, author);
        await this.writeCache(cacheKey, doc);
      } catch (error) {
        this.logger.warn(`Open Library okunamadı: ${String(error)}`);
        doc = (cached?.payload as unknown as OpenLibraryDoc | null) ?? null;
      }
    }
    if (!doc) {
      return book;
    }

    const series = readSeries(doc.series?.[0]);
    return {
      ...book,
      olKey: book.olKey ?? doc.key ?? null,
      firstPublishedYear:
        book.firstPublishedYear ?? doc.first_publish_year ?? null,
      seriesName: book.seriesName ?? series.name,
      seriesIndex: book.seriesIndex ?? series.index,
      // Türkçe baskıda Google'ın verdiği ad zaten Türkçe; orijinali Open
      // Library'nin (İngilizce ağırlıklı) kaydından geliyor
      originalTitle:
        book.originalTitle ??
        (doc.title && doc.title !== book.title ? doc.title : null),
      pageCount: book.pageCount ?? doc.number_of_pages_median ?? null,
      coverImage:
        book.coverImage ??
        (doc.cover_i ? `${OPENLIBRARY_COVERS}/${doc.cover_i}-L.jpg` : null),
    };
  }

  /**
   * Bir eserin Türkçe baskısı var mı? Çeviri durumunu tahmin etmek için
   * kullanılır — küratör yanlışsa tek tıkla düzeltir.
   *
   * "Yok" demek zor bir iddia: arama düşerse `null` döner ve çağıran karar
   * vermez (yanlışlıkla "çevrilmedi" damgası vurulmasın).
   */
  async hasTurkishEdition(
    title: string,
    author: string | null,
  ): Promise<boolean | null> {
    const query = author ? `${title} ${author}` : title;
    try {
      const results = await this.googleSearch(query, 'tr');
      return results.some((item) => item.language === 'tr');
    } catch {
      return null;
    }
  }

  // --- Google ---

  private async googleSearch(
    query: string,
    langRestrict?: string,
  ): Promise<BookSource[]> {
    const params: Record<string, string> = {
      q: query,
      maxResults: '20',
      printType: 'books',
      orderBy: 'relevance',
    };
    if (langRestrict) {
      params.langRestrict = langRestrict;
    }
    const payload = await this.googleRequest<GoogleVolumesResponse>(
      '/volumes',
      params,
    );
    return (payload.items ?? [])
      .map((item) => normalizeGoogle(item))
      .filter((item): item is BookSource => item !== null);
  }

  private async googleRequest<T>(
    path: string,
    params: Record<string, string> = {},
  ): Promise<T> {
    const url = new URL(`${GOOGLE_BASE}${path}`);
    // Türkçe künye alanları (kategori adları vb.) için ülke/dil ipucu
    url.searchParams.set('country', 'TR');
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
    if (this.apiKey) {
      url.searchParams.set('key', this.apiKey);
    }

    const response = await fetch(url, {
      headers: { accept: 'application/json' },
    });
    if (!response.ok) {
      this.logger.warn(`Google Books ${path} → ${response.status}`);
      throw new ServiceUnavailableException('BOOKS.SOURCE_UNAVAILABLE');
    }
    return (await response.json()) as T;
  }

  // --- Open Library ---

  private async openLibrarySearch(query: string): Promise<BookSource[]> {
    try {
      const payload = await this.openLibraryRequest<OpenLibrarySearchResponse>(
        '/search.json',
        { q: query, limit: '10' },
      );
      return (payload.docs ?? [])
        .map((doc) => normalizeOpenLibrary(doc))
        .filter((item): item is BookSource => item !== null);
    } catch {
      // İkinci kaynak da düşerse arama boş döner; arayüz "sonuç yok" gösterir
      return [];
    }
  }

  private async openLibraryLookup(
    title: string,
    author: string,
  ): Promise<OpenLibraryDoc | null> {
    const params: Record<string, string> = {
      title,
      limit: '5',
      fields:
        'key,title,author_name,first_publish_year,cover_i,number_of_pages_median,series,language,subject',
    };
    if (author) {
      params.author = author;
    }
    const payload = await this.openLibraryRequest<OpenLibrarySearchResponse>(
      '/search.json',
      params,
    );
    const docs = payload.docs ?? [];
    if (docs.length === 0) {
      return null;
    }
    // Yazar adı da tutan ilk kayıt: aynı adlı başka bir esere bağlanmasın
    const normalizedAuthor = slugKey(author);
    const exact = docs.find((doc) =>
      (doc.author_name ?? []).some(
        (name) => slugKey(name) === normalizedAuthor,
      ),
    );
    return exact ?? docs[0];
  }

  private async openLibraryRequest<T>(
    path: string,
    params: Record<string, string>,
  ): Promise<T> {
    const url = new URL(`${OPENLIBRARY_BASE}${path}`);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
    const response = await fetch(url, {
      headers: { accept: 'application/json' },
    });
    if (!response.ok) {
      this.logger.warn(`Open Library ${path} → ${response.status}`);
      throw new ServiceUnavailableException('BOOKS.SOURCE_UNAVAILABLE');
    }
    return (await response.json()) as T;
  }

  private async writeCache(cacheKey: string, payload: unknown): Promise<void> {
    await this.prisma.externalCache.upsert({
      where: { cacheKey },
      create: {
        cacheKey,
        payload: payload as object,
        fetchedAt: new Date(),
      },
      update: { payload: payload as object, fetchedAt: new Date() },
    });
  }
}

/**
 * Google'ın kapak adresi küçük ve `http`: `zoom=2` ile büyüğü isteniyor,
 * `edge=curl` (sahte sayfa kıvrımı) atılıyor ve şema `https`e çekiliyor —
 * karışık içerik uyarısı vermesin.
 */
function googleCover(links: { thumbnail?: string } | undefined): string | null {
  const raw = links?.thumbnail;
  if (!raw) {
    return null;
  }
  return raw
    .replace(/^http:/, 'https:')
    .replace(/&edge=curl/, '')
    .replace(/&zoom=\d/, '&zoom=2');
}

function normalizeGoogle(raw: GoogleVolumeRaw): BookSource | null {
  const info = raw.volumeInfo;
  if (!raw.id || !info?.title) {
    return null;
  }
  const isbn13 =
    info.industryIdentifiers?.find((item) => item.type === 'ISBN_13')
      ?.identifier ?? null;
  const year = Number.parseInt((info.publishedDate ?? '').slice(0, 4), 10);

  return {
    googleId: raw.id,
    olKey: null,
    isbn13,
    title: info.title,
    subtitle: info.subtitle ?? null,
    authors: info.authors ?? [],
    publisher: info.publisher ?? null,
    publishedYear: Number.isFinite(year) ? year : null,
    firstPublishedYear: null,
    pageCount: info.pageCount && info.pageCount > 0 ? info.pageCount : null,
    language: info.language ?? null,
    coverImage: googleCover(info.imageLinks),
    description: info.description ?? null,
    genres: info.categories ?? [],
    seriesName: null,
    seriesIndex: null,
    originalTitle: null,
    provider: 'GOOGLE',
  };
}

function normalizeOpenLibrary(doc: OpenLibraryDoc): BookSource | null {
  if (!doc.title) {
    return null;
  }
  const series = readSeries(doc.series?.[0]);
  return {
    googleId: null,
    olKey: doc.key ?? null,
    isbn13: null,
    title: doc.title,
    subtitle: null,
    authors: doc.author_name ?? [],
    publisher: null,
    publishedYear: doc.first_publish_year ?? null,
    firstPublishedYear: doc.first_publish_year ?? null,
    pageCount: doc.number_of_pages_median ?? null,
    language: doc.language?.[0] === 'tur' ? 'tr' : (doc.language?.[0] ?? null),
    coverImage: doc.cover_i
      ? `${OPENLIBRARY_COVERS}/${doc.cover_i}-L.jpg`
      : null,
    description: null,
    genres: (doc.subject ?? []).slice(0, 6),
    seriesName: series.name,
    seriesIndex: series.index,
    originalTitle: null,
    provider: 'OPENLIBRARY',
  };
}

/**
 * Open Library seri alanı tek bir metin: "The Wheel of Time, 3" ya da yalnızca
 * "Mistborn". Sondaki sayı cilt sırasıdır; yoksa sıra boş bırakılır.
 */
function readSeries(value: string | undefined): {
  name: string | null;
  index: number | null;
} {
  if (!value) {
    return { name: null, index: null };
  }
  const match = /^(.*?)[,;]?\s*#?(\d{1,3})$/.exec(value.trim());
  if (!match) {
    return { name: value.trim(), index: null };
  }
  return { name: match[1].trim(), index: Number.parseInt(match[2], 10) };
}

/** Cache anahtarı ve yazar eşleştirmesi için sade karşılaştırma biçimi. */
function slugKey(value: string): string {
  return slugify(value).slice(0, 60);
}
