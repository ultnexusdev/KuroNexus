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
  /**
   * Kabaca "bu kitap ne kadar biliniyor". Open Library'de **baskı sayısı**,
   * Google'da değerlendirme sayısı. Ölçüldü: "Bülbülü Öldürmek" aramasında
   * gerçek eser 213 baskı, aynı sonuçtaki alakasız kitap 1 baskı döndü —
   * gürültüyü aşağı itmek için en iyi tek sinyal bu. Bilinmiyorsa 0.
   */
  popularity: number;
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
    /** Popülerlik sinyali; Google çoğu ciltte vermiyor, o zaman 0 sayılır */
    ratingsCount?: number;
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
  /** Kaç ayrı baskısı var — popülerliğin en iyi göstergesi (ölçüldü) */
  edition_count?: number;
}

interface OpenLibrarySearchResponse {
  docs?: OpenLibraryDoc[];
}

/** ISBN ile çekilen **baskı** kaydı (eser değil). */
interface OpenLibraryEdition {
  title?: string;
  /** Çeviri baskılarda eserin orijinal adı — Türkçe kayıtta en değerli alan */
  translation_of?: string;
  covers?: number[];
  works?: Array<{ key?: string }>;
  number_of_pages?: number;
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
   * Üç bacak **birlikte** koşar ve hepsi tek listede döner: Google
   * `langRestrict=tr`, Google genel, Open Library. Sonuç `rank()` ile
   * sıralanır — Türkçe baskı, sonra kapak, sonra popülerlik.
   *
   * Cache'lenmez: sorgu her seferinde farklı.
   *
   * **Hiçbir bacak diğerini düşürmez.** Anahtarsız Google istekleri kotaya
   * takılıp `429`, ara sıra da `503` veriyor (ikisi de ölçüldü); `allSettled`
   * sayesinde ayakta kalan bacaklar kullanılıyor. Anahtar
   * (`GOOGLE_BOOKS_API_KEY`) tanımlıyken Türkçe baskılar öne geçiyor.
   */
  async search(query: string): Promise<BookSource[]> {
    const trimmed = query.trim();
    if (!trimmed) {
      return [];
    }

    /**
     * **Üç bacak birlikte koşuyor ve hepsi tek listede gösteriliyor.**
     *
     * Eskiden Open Library yalnızca Google sıfır sonuç verince devreye
     * giriyordu. Bu, kullanıcının bildirdiği soruna yol açıyordu: "Bülbülü
     * Öldürmek" Google'da **kapaksız** dönüyor, Open Library'de aynı eserin
     * kapağı VAR (`cover_i` dolu), ama Google sonuç verdiği için Open Library
     * hiç sorulmuyordu. Artık ikisi de sorulup küratöre birlikte gösteriliyor
     * ve hangi kaydın daha iyi olduğuna **o** karar veriyor (kullanıcı
     * kararı: "iki yerden neresi iyiyse kendim seçeyim").
     *
     * `allSettled`: bacaklar birbirinden bağımsız. Google'ın anlık bir `503`'ü
     * (ölçümde görüldü) Türkçe bacağı ya da Open Library'yi çöpe atmasın.
     */
    const [turkish, general, openLibrary] = await Promise.allSettled([
      this.googleSearch(trimmed, 'tr'),
      this.googleSearch(trimmed),
      this.openLibrarySearch(trimmed),
    ]);

    for (const leg of [turkish, general, openLibrary]) {
      if (leg.status === 'rejected') {
        this.logger.warn(
          `Kitap aramasının bir bacağı düştü: ${String(leg.reason)}`,
        );
      }
    }

    const merged: BookSource[] = [];
    const seen = new Set<string>();
    for (const item of [
      ...(turkish.status === 'fulfilled' ? turkish.value : []),
      ...(general.status === 'fulfilled' ? general.value : []),
      ...(openLibrary.status === 'fulfilled' ? openLibrary.value : []),
    ]) {
      /**
       * Tekilleştirme **kaynak içinde** yapılıyor, kaynaklar ARASINDA değil:
       * aynı eserin Google ve Open Library kaydı bilerek yan yana duruyor,
       * küratör kapağı olanı seçebilsin diye. Anahtara sağlayıcı ekleniyor.
       */
      const identity =
        item.googleId ?? item.olKey ?? `${item.title}|${item.authors[0] ?? ''}`;
      const key = `${item.provider}:${identity}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      merged.push(item);
    }

    /**
     * **Yalnızca Türkçe baskılar başa alınır; başka hiçbir yeniden sıralama
     * YAPILMAZ.** Bu kural ölçümle konuldu, tercih değil.
     *
     * Bir ara sıralama "kapak + popülerlik" puanına çevrilmişti ve alakayı
     * yok etti: "bülbülü öldürmek" aramasında Harper Lee ilk sekizden düştü,
     * yerine kapağı olan alakasız dergiler (İçtiğim Deniz, Notos Öykü…)
     * çıktı; "dune frank herbert" aramasında Dune'un kendisi kaybolup
     * Children of Dune tepeye oturdu. Sebep basit: kaynakların alaka sırası
     * bizim üretebileceğimiz her puandan iyi, onu ezmek zarar veriyor.
     *
     * `sort` kararlı olduğu için her bacağın kendi sırası grup içinde
     * korunuyor. Popülerlik (`popularity`) sıralamada DEĞİL, arayüzde bilgi
     * olarak gösteriliyor — küratör iki kayıt arasında seçim yaparken
     * "213 baskı" bilgisi işe yarıyor.
     */
    merged.sort(
      (a, b) => (a.language === 'tr' ? 0 : 1) - (b.language === 'tr' ? 0 : 1),
    );
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
   * adı/sırası, orijinal ad ve (Google'da yoksa) kapak. Bulunamazsa künye
   * olduğu gibi döner — eksik alan sayfayı bozmuyor (kural 4).
   *
   * Çeviri kitapta arama iki adımlı olmak zorunda: Open Library'de eser
   * çoğunlukla **orijinal adıyla** kayıtlı, "Bülbülü Öldürmek" diye aramak
   * sonuç vermiyor. O yüzden Türkçe adla bulunamazsa ISBN'den baskı kaydına
   * gidilip `translation_of` ile orijinal ad öğreniliyor ve arama onunla
   * tekrarlanıyor.
   */
  async enrich(book: BookSource): Promise<BookSource> {
    const author = book.authors[0] ?? '';
    const title = book.originalTitle ?? book.title;

    let doc = await this.cachedOpenLibraryLookup(title, author);
    let editionCover: string | null = null;
    let originalTitle = book.originalTitle;

    if ((!doc || !doc.cover_i) && book.isbn13) {
      const edition = await this.cachedOpenLibraryIsbn(book.isbn13);
      if (edition?.covers?.[0]) {
        editionCover = `${OPENLIBRARY_COVERS}/${edition.covers[0]}-L.jpg`;
      }
      // Baskı kaydı orijinal adı biliyorsa hem künyeye yazılır hem de eser
      // araması onunla tekrarlanır
      if (edition?.translation_of) {
        originalTitle = originalTitle ?? edition.translation_of;
        doc =
          doc ??
          (await this.cachedOpenLibraryLookup(edition.translation_of, author));
      }
    }

    if (!doc) {
      return {
        ...book,
        originalTitle,
        coverImage: book.coverImage ?? editionCover,
      };
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
        originalTitle ??
        (doc.title && doc.title !== book.title ? doc.title : null),
      pageCount: book.pageCount ?? doc.number_of_pages_median ?? null,
      coverImage:
        book.coverImage ??
        editionCover ??
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
      // İki arama birden: `langRestrict` bazı çevirileri hiç bulamıyor (Google
      // o cildin dilini işaretlememiş olabiliyor), o cilt genel aramanın alt
      // sıralarında duruyor — tek sorguya güvenilmiyor
      const [restricted, general] = await Promise.all([
        this.googleSearch(query, 'tr'),
        this.googleSearch(query),
      ]);
      return [...restricted, ...general].some((item) => item.language === 'tr');
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
    /**
     * `country` parametresi BİLEREK gönderilmiyor.
     *
     * Dil ipucu sanılıp `TR` verilmişti; oysa Google Books'ta `country`
     * **Play Kitaplar mağaza uygunluğu** demek — o ülkede satışa sunulmuş
     * ciltlerin dışındaki her şeyi eliyor. Türkçe *basılı* çevirilerin çoğu
     * TR mağazasında olmadığı için tam da bulunması istenen kayıtlar
     * düşüyordu ("Bülbülü Öldürmek" aranınca yalnızca İngilizcesi geliyordu).
     */
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

  /** Eser araması, cache'li. Bulunamadı bilgisi de (null) cache'lenir. */
  private async cachedOpenLibraryLookup(
    title: string,
    author: string,
  ): Promise<OpenLibraryDoc | null> {
    const cacheKey = `books:ol:v1:${slugKey(title)}:${slugKey(author)}`;
    const cached = await this.prisma.externalCache.findUnique({
      where: { cacheKey },
    });
    if (cached && Date.now() - cached.fetchedAt.getTime() < CACHE_TTL_MS) {
      return cached.payload as unknown as OpenLibraryDoc | null;
    }
    try {
      const doc = await this.openLibraryLookup(title, author);
      await this.writeCache(cacheKey, doc);
      return doc;
    } catch (error) {
      this.logger.warn(`Open Library okunamadı: ${String(error)}`);
      return (cached?.payload as unknown as OpenLibraryDoc | null) ?? null;
    }
  }

  /**
   * ISBN'den baskı kaydı. Çeviri kitabın orijinal adını (`translation_of`) ve
   * kimi zaman kapağını buradan öğreniyoruz — eser araması Türkçe adla
   * sonuç vermediğinde tek köprü bu.
   *
   * Kayıt yoksa Open Library 404 döner; bu bir hata değil, "bilmiyorum"
   * demektir ve null olarak cache'lenir (aynı ISBN her eklemede sorulmasın).
   */
  private async cachedOpenLibraryIsbn(
    isbn: string,
  ): Promise<OpenLibraryEdition | null> {
    const cacheKey = `books:ol-isbn:v1:${isbn}`;
    const cached = await this.prisma.externalCache.findUnique({
      where: { cacheKey },
    });
    if (cached && Date.now() - cached.fetchedAt.getTime() < CACHE_TTL_MS) {
      return cached.payload as unknown as OpenLibraryEdition | null;
    }
    try {
      const edition = await this.openLibraryRequest<OpenLibraryEdition>(
        `/isbn/${encodeURIComponent(isbn)}.json`,
        {},
      );
      await this.writeCache(cacheKey, edition);
      return edition;
    } catch {
      await this.writeCache(cacheKey, null);
      return null;
    }
  }

  private async openLibrarySearch(query: string): Promise<BookSource[]> {
    try {
      const payload = await this.openLibraryRequest<OpenLibrarySearchResponse>(
        '/search.json',
        {
          q: query,
          limit: '10',
          // `fields` verilmezse Open Library dev bir belge döndürüyor ve
          // `edition_count` yine de gelmiyor; alanlar açıkça isteniyor
          fields:
            'key,title,author_name,first_publish_year,cover_i,number_of_pages_median,series,language,subject,edition_count',
        },
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
function googleCover(
  links: { thumbnail?: string; smallThumbnail?: string } | undefined,
): string | null {
  /**
   * `books.google.com/books/content?id=…` adresi BİLEREK kullanılmıyor.
   *
   * O uç her cilt için 200 dönüyor ama kapağı olmayan kayıtlarda 1269 baytlık
   * "kapak yok" görselini veriyor (Türkçe basılı baskıların çoğu böyle).
   * Kullanılsaydı arşiv boş çerçeve yerine aynı gri lekeyle dolardı ve
   * küratör hangi kitabın kapağını elle koyması gerektiğini göremezdi.
   * `imageLinks` yoksa kapak gerçekten yoktur: null dönüyoruz.
   */
  const raw = links?.thumbnail ?? links?.smallThumbnail;
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
    popularity: info.ratingsCount ?? 0,
  };
}

/**
 * Open Library dili **üç harfli** veriyor ("tur", "eng", "pol"), Google ise
 * iki harfli ("tr", "en"). Aynı alanda iki ayrı alfabe tutmak dil süzgecini
 * ve "Türkçe önce" kuralını sessizce bozardı; burada tek biçime indiriliyor.
 * Listede olmayan kod olduğu gibi bırakılıyor — uydurmaktansa görünür kalsın.
 */
const OPENLIBRARY_LANGS: Record<string, string> = {
  tur: 'tr',
  eng: 'en',
  ger: 'de',
  deu: 'de',
  fre: 'fr',
  fra: 'fr',
  spa: 'es',
  ita: 'it',
  rus: 'ru',
  por: 'pt',
  pol: 'pl',
  cze: 'cs',
  jpn: 'ja',
  chi: 'zh',
  ara: 'ar',
};

function openLibraryLanguage(code: string | undefined): string | null {
  if (!code) {
    return null;
  }
  return OPENLIBRARY_LANGS[code] ?? code;
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
    language: openLibraryLanguage(doc.language?.[0]),
    coverImage: doc.cover_i
      ? `${OPENLIBRARY_COVERS}/${doc.cover_i}-L.jpg`
      : null,
    description: null,
    genres: (doc.subject ?? []).slice(0, 6),
    seriesName: series.name,
    seriesIndex: series.index,
    originalTitle: null,
    provider: 'OPENLIBRARY',
    popularity: doc.edition_count ?? 0,
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
