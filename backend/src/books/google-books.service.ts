import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slugify';
import { BinKitapService } from './bin-kitap.service';

/**
 * Kitap künyesinin dış kaynakları. Üçü birlikte koşar, hiçbiri diğerinin
 * yerine geçmez (kullanıcı kararı):
 *  - **1000Kitap** Türkçe künyenin ana kaynağı; çevirmeni ve gerçek önek
 *    aramasını yalnız o veriyor (bkz. `bin-kitap.service.ts`). Listede
 *    ayrılmış kontenjanla başta durur.
 *  - **Google Books** geniş kapsam, çevrilmemiş yabancı kitaplarda vazgeçilmez.
 *  - **Open Library** eserin kendisini bilir, eksik kalan yerleri doldurur.
 *
 * Google ile Open Library arasındaki iş bölümü rastgele değil, ikisinin
 * gerçekten iyi olduğu yerler farklı:
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

/**
 * Dış isteğin en fazla ne kadar sürebileceği.
 *
 * **Bu sınır olmadan ne oluyordu (2026-08-04'te canlıda ölçüldü):**
 * Open Library cevap vermez hâle geldi (`HTTP 000`, bağlantı düşüyor).
 * `search()` dört bacağı `Promise.allSettled` ile birlikte bekliyor; Google
 * yarım saniyede dönse bile arama, asılı kalan Open Library bacağı düşene
 * kadar bekliyordu — küratör araması **30–40 saniye** sürüyordu.
 *
 * `bin-kitap.service.ts`'te bu önlem baştan alınmıştı (`REQUEST_TIMEOUT_MS`,
 * gerekçesi: *"asılı kalan bir istek arama bacağını da askıda tutar"*);
 * burada atlanmış.
 *
 * Zaman aşımı yalnızca yavaşlık değil, bir **kaynak tükenmesi** meselesi:
 * sınırsız bekleyen dış istekler soket havuzunu ve olay döngüsünü doldurur,
 * yani dışarıdan tetiklenebilen bir hizmet reddi yüzeyi açar.
 *
 * 8 saniye: küratör yazarken bekliyor, ama yavaş-ama-çalışan bir yanıtı da
 * kesmeyecek kadar geniş. Google bacağındaki tekrar döngüsü bunu ikiye
 * katlamaz — tekrar yalnızca **alınmış** bir yanıtta (429/5xx) tetikleniyor,
 * o da hızlı döner; zaman aşımı ise döngüden çıkıp bacağı düşürür.
 */
const REQUEST_TIMEOUT_MS = 8_000;

/**
 * Open Library için **ayrılmış** sıra sayısı.
 *
 * Kontenjan olmadan Open Library listede hiç görünmüyordu ve kullanıcı bunu
 * bildirdi. Sebebi ölçüldü: "bülbülü öldürmek" aramasında Google iki
 * bacaktan 40 kayıt döndürüyor, hepsi Türkçe olduğu için "Türkçe önce"
 * sıralamasıyla başa geçiyor ve Open Library'nin 2 kaydı 40–41. sıraya
 * düşüyordu; `slice(0, 20)` onları tamamen kesiyordu.
 */
const OPENLIBRARY_SLOTS = 5;

/**
 * 1000Kitap için **ayrılmış** ve listenin BAŞINDA duran sıra sayısı.
 *
 * Kullanıcı kararı: "önce 1000Kitap sonuçları görünsün". Kaynak şartlı
 * çalıştırılmıyor (yani "1000Kitap boş dönerse ötekiler sorulsun" değil) —
 * bu, daha önce ölçümle terk edilmiş bir davranıştı: Open Library yalnızca
 * Google boş dönünce sorulduğunda kapağı olan kayıtlar hiç görünmüyordu.
 * Üç kaynak birlikte koşmaya devam ediyor, 1000Kitap yalnızca SIRALAMADA
 * öne alınıyor; böylece çevrilmemiş yabancı kitaplarda Google ve Open
 * Library kapsamı korunuyor.
 */
const BINKITAP_SLOTS = 8;

/** Alaka süzgecinde yok sayılacak kadar kısa sözcükler ("ve", "bir"…) */
const MIN_TOKEN = 3;

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
  provider: 'GOOGLE' | 'OPENLIBRARY' | 'BINKITAP';
  /**
   * 1000Kitap kitap sayfasının anahtarı ("bulbulu-oldurmek--939"). Künyenin
   * tamamı ancak küratör "ekle" dediğinde bununla çekiliyor — arama sonucu
   * yayınevi/ISBN/sayfa sayısı taşımıyor.
   */
  binKitapSlug: string | null;
  /**
   * Kabaca "bu kitap ne kadar biliniyor". Open Library'de **baskı sayısı**,
   * Google'da değerlendirme sayısı, 1000Kitap'ta okunma sayısı. Ölçüldü:
   * "Bülbülü Öldürmek" aramasında gerçek eser 213 baskı, aynı sonuçtaki
   * alakasız kitap 1 baskı döndü — gürültüyü aşağı itmek için en iyi tek
   * sinyal bu. Bilinmiyorsa 0.
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
  /**
   * Aramaya `language` verildiğinde o dildeki **baskılar** burada dönüyor.
   * Eser kaydı hep orijinaldir ("To Kill a Mockingbird"); Türkçe ad ve Türkçe
   * kapak yalnızca burada.
   */
  editions?: { docs?: OpenLibraryEditionDoc[] };
}

/** Eser aramasında istenen alanlar; iki sorgu da bunları paylaşıyor. */
const OL_WORK_FIELDS =
  'key,title,author_name,first_publish_year,cover_i,number_of_pages_median,series,language,subject,edition_count';

/** Arama sonucundaki baskı kaydı (eser değil). */
interface OpenLibraryEditionDoc {
  key?: string;
  title?: string;
  language?: string[];
  cover_i?: number;
  publish_date?: string[];
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
    private readonly binKitap: BinKitapService,
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
    const [binKitap, turkish, general, openLibrary] = await Promise.allSettled([
      this.binKitap.search(trimmed),
      this.googleSearch(trimmed, 'tr'),
      this.googleSearch(trimmed),
      this.openLibrarySearch(trimmed),
    ]);

    for (const leg of [binKitap, turkish, general, openLibrary]) {
      if (leg.status === 'rejected') {
        this.logger.warn(
          `Kitap aramasının bir bacağı düştü: ${String(leg.reason)}`,
        );
      }
    }

    /**
     * **Alaka süzgeci yalnızca Google bacaklarına uygulanıyor.**
     *
     * Google'ın `langRestrict=tr` bacağı sorguyla hiç ilgisi olmayan Türkçe
     * kayıtlar döndürüyor (ölçüldü: "bülbülü öldürmek" için ULAK 5. Sayı,
     * Notos Öykü, Bakî Divanı Sözlüğü) ve bunlar Türkçe oldukları için
     * listenin başına geçiyordu — kullanıcının şikâyeti buydu.
     *
     * Open Library'ye de uygulanıyor — ama **ancak Türkçe baskı desteği
     * geldikten sonra güvenli oldu.** Önceden Open Library "bülbülü
     * öldürmek" sorgusuna eseri orijinal adıyla döndürüyordu ("To Kill a
     * Mockingbird") ve süzgeç tam da görmek istediğimiz kaydı elerdi. Artık
     * Türkçe baskı Türkçe adıyla geldiği için süzgeç onu tanıyor; karşılığında
     * Open Library'nin alakasız önerileri ("dune frank herbert" sorgusuna
     * gelen "Bir Yaz Gecesi Rüyası") temizleniyor. `isRelevant` samanlığa
     * `originalTitle`ı da katıyor ki çeviri kayıtları orijinal adından da
     * tutabilsin.
     */
    const tokens = searchTokens(trimmed);
    const googleHits = [
      ...(turkish.status === 'fulfilled' ? turkish.value : []),
      ...(general.status === 'fulfilled' ? general.value : []),
    ].filter((item) => isRelevant(item, tokens));

    /**
     * Kontenjan: Open Library'ye ayrılan sıralar Google'ın hacmine
     * bakılmaksızın korunuyor. Aksi hâlde Google 40 kayıt döndürünce Open
     * Library listeden düşüyor (bkz. `OPENLIBRARY_SLOTS`).
     */
    const openLibraryHits = (
      openLibrary.status === 'fulfilled' ? openLibrary.value : []
    )
      .filter((item) => isRelevant(item, tokens))
      .slice(0, OPENLIBRARY_SLOTS);

    /**
     * 1000Kitap kontenjanı listenin başında ayrılıyor; kalan sıraları Google
     * ve Open Library paylaşıyor. Alaka süzgeci buna da uygulanıyor — kaynak
     * Türkçe olduğu için süzgecin eleyeceği bir kayıp yok, ama sorguyla
     * ilgisiz baskılar listeye çıkmasın.
     */
    const binKitapHits = (binKitap.status === 'fulfilled' ? binKitap.value : [])
      .filter((item) => isRelevant(item, tokens))
      .slice(0, BINKITAP_SLOTS);
    const remaining = Math.max(0, SEARCH_LIMIT - binKitapHits.length);

    const merged: BookSource[] = [];
    const seen = new Set<string>();
    for (const item of [
      ...googleHits.slice(0, Math.max(0, remaining - openLibraryHits.length)),
      ...openLibraryHits.slice(0, remaining),
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
    /**
     * 1000Kitap bloğu sıralamaya HİÇ girmiyor, doğrudan başa ekleniyor: hem
     * kullanıcının istediği kaynak önceliği bu, hem de kaynağın kendi alaka
     * sırası bizim üretebileceğimiz her puandan iyi (yukarıdaki ölçüm).
     */
    return [...binKitapHits, ...merged].slice(0, SEARCH_LIMIT);
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

    /**
     * Geçici hatalarda **bir kez** yeniden deneniyor.
     *
     * Google bu uçta sık sık anlık `503` veriyor (ölçümde arka arkaya
     * denemelerde görüldü: aynı sorgu bir turda düşüp bir sonrakinde 200
     * dönüyor). Tek denemede kalınca kullanıcı aramanın yarısını kaybediyor
     * — bir seferinde "dune frank herbert" sonucundan Dune'un kendisi
     * tamamen kayboldu, çünkü iki Google bacağı da o an düşmüştü.
     *
     * Yalnızca `429` ve `5xx` için: `400` gibi kalıcı hatalarda tekrar
     * denemek boşuna gecikme olurdu. Tek tekrar ve kısa bekleme, çünkü bu
     * istek kullanıcı yazarken atılıyor.
     */
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await fetch(url, {
        headers: { accept: 'application/json' },
        // Asılı kalan istek bütün aramayı askıda tutar (bkz. REQUEST_TIMEOUT_MS)
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (response.ok) {
        return (await response.json()) as T;
      }
      const retryable = response.status === 429 || response.status >= 500;
      if (!retryable || attempt === 1) {
        this.logger.warn(`Google Books ${path} → ${response.status}`);
        throw new ServiceUnavailableException('BOOKS.SOURCE_UNAVAILABLE');
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    // Döngü her hâlükârda dönüyor ya da fırlatıyor; derleyici için
    throw new ServiceUnavailableException('BOOKS.SOURCE_UNAVAILABLE');
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
      /**
       * **İki sorgu birden: Türkçe baskılar ve eserin kendisi.**
       *
       * Open Library araması `eser` döndürüyor ve eser kaydı hep orijinal
       * dilde: "Bülbülü Öldürmek" arandığında "To Kill a Mockingbird" ve
       * onun İngilizce kapağı geliyordu. Kullanıcı Open Library'de Türkçe
       * kapaklı bir sayfa olduğunu bildirdi — o bir **baskı** kaydı.
       *
       * `language=tur` + `editions` alt alanı istenince Open Library o eserin
       * Türkçe baskısını da veriyor: `Bülbülü Öldürmek`, `cover_i 15153566`
       * (doğrulandı: 39 KB'lik gerçek kapak). Türkçe baskı bulunursa arama
       * sonucunda **o** gösteriliyor; bulunamazsa eser kaydı kalıyor, yani
       * çevrilmemiş kitap yine bulunabiliyor.
       */
      const [turkish, works] = await Promise.allSettled([
        this.openLibraryRequest<OpenLibrarySearchResponse>('/search.json', {
          q: query,
          limit: '5',
          language: 'tur',
          fields: `${OL_WORK_FIELDS},editions,editions.key,editions.title,editions.language,editions.cover_i,editions.publish_date`,
        }),
        this.openLibraryRequest<OpenLibrarySearchResponse>('/search.json', {
          q: query,
          limit: '10',
          // `fields` verilmezse Open Library dev bir belge döndürüyor ve
          // `edition_count` yine de gelmiyor; alanlar açıkça isteniyor
          fields: OL_WORK_FIELDS,
        }),
      ]);

      const merged: BookSource[] = [];
      const seen = new Set<string>();
      for (const item of [
        ...(turkish.status === 'fulfilled'
          ? (turkish.value.docs ?? []).map((doc) =>
              normalizeOpenLibraryTurkish(doc),
            )
          : []),
        ...(works.status === 'fulfilled'
          ? (works.value.docs ?? []).map((doc) => normalizeOpenLibrary(doc))
          : []),
      ]) {
        if (!item) {
          continue;
        }
        // Aynı eser iki sorgudan da gelebilir; Türkçe baskı olan kazanır
        // çünkü listede önce o duruyor
        const key = item.olKey ?? `${item.title}|${item.authors[0] ?? ''}`;
        if (seen.has(key)) {
          continue;
        }
        seen.add(key);
        merged.push(item);
      }
      return merged;
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
      // Asılı kalan istek bütün aramayı askıda tutar (bkz. REQUEST_TIMEOUT_MS).
      // 2026-08-04'te tam olarak bu bacak düştü ve aramayı 40 saniyeye çıkardı.
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
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
    binKitapSlug: null,
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
 * Open Library kaydı bir **esere** ait, tek bir baskıya değil: `language`
 * alanı o eserin bütün baskılarının dillerini taşıyor ve ilk eleman rastgele.
 * "To Kill a Mockingbird" için `kor` dönüyordu ve arayüzde İngilizce esere
 * **KOR** rozeti takılıyordu — yanlış bilgi.
 *
 * Bu yüzden yalnızca tek bir soruya cevap veriliyor: bu eserin **Türkçe**
 * baskısı var mı? Varsa `tr` (ve "Türkçe önce" sıralaması onu kapsıyor),
 * yoksa `null` — arayüz dil rozetini boş gösteriyor. Uydurulmuş bir dil
 * yazmaktansa bilinmiyor demek doğru olan.
 */
function openLibraryLanguage(codes: string[] | undefined): string | null {
  return codes?.includes('tur') ? 'tr' : null;
}

/**
 * Karşılaştırma için sadeleştirme. `ı` elle `i`ye çevriliyor çünkü ayrı bir
 * HARF, birleşik işaret değil — NFD ayrıştırması ona dokunmuyor. Kalan
 * aksanlar (ö/ü/ş/ç/ğ) taban harfe indiriliyor. Böylece "bulbulu" ile
 * "Bülbülü" aynı metne dönüyor.
 */
function foldSearch(value: string): string {
  return value
    .toLocaleLowerCase('tr')
    .replaceAll('ı', 'i')
    .normalize('NFD')
    .replace(/\p{M}+/gu, '');
}

/** Sorgunun anlamlı sözcükleri; çok kısa olanlar gürültü yapıyor. */
function searchTokens(query: string): string[] {
  return foldSearch(query)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length >= MIN_TOKEN);
}

/**
 * Sonuç sorguyla en az bir sözcüğü paylaşıyor mu.
 *
 * "En az bir" (hepsi değil) bilerek: kullanıcı "bülbülü öldürmek harper"
 * yazdığında yalnızca "Bülbülü Öldürmek" başlıklı cilt de tutmalı, yazar
 * adı başlıkta geçmese bile. Yazar ve seri adı da samanlığa katılıyor ki
 * "harper lee" araması eserin adıyla eşleşsin.
 */
function isRelevant(item: BookSource, tokens: string[]): boolean {
  if (tokens.length === 0) {
    return true;
  }
  const haystack = foldSearch(
    [
      item.title,
      // Çeviri kaydı orijinal adından da tutmalı: Open Library'nin Türkçe
      // baskısında ad "Bülbülü Öldürmek", asıl ad "To Kill a Mockingbird"
      item.originalTitle ?? '',
      item.subtitle ?? '',
      item.seriesName ?? '',
      ...item.authors,
    ]
      .join(' ')
      .trim(),
  );
  return tokens.some((token) => haystack.includes(token));
}

/**
 * Türkçe **baskı** kaydı. Eser kaydından farkı: ad ve kapak baskıdan gelir,
 * yazar/yıl/seri gibi eser bilgileri üstteki kayıttan.
 *
 * Türkçe baskı yoksa `null` döner ve çağıran eser kaydına düşer — böylece
 * çevrilmemiş kitap aramadan kaybolmuyor.
 */
function normalizeOpenLibraryTurkish(doc: OpenLibraryDoc): BookSource | null {
  const edition = (doc.editions?.docs ?? []).find((item) =>
    item.language?.includes('tur'),
  );
  if (!edition?.title) {
    return null;
  }
  const base = normalizeOpenLibrary(doc);
  if (!base) {
    return null;
  }
  const year = Number.parseInt(edition.publish_date?.[0]?.slice(-4) ?? '', 10);
  return {
    ...base,
    // Baskı anahtarı (`/books/OL…M`); yalnızca saklanıp yinelenen kayıt
    // kontrolünde kullanılıyor, tekrar sorgulanmıyor — güvenli
    olKey: edition.key ?? base.olKey,
    title: edition.title,
    // Eserin orijinal adı ikinci satır olarak duruyor: küratör hangi kitabın
    // çevirisi olduğunu görebilsin
    originalTitle: doc.title ?? null,
    // Kapağı olmayan baskıda eserin kapağına düşülüyor — boş çerçeveden iyi
    coverImage: edition.cover_i
      ? `${OPENLIBRARY_COVERS}/${edition.cover_i}-L.jpg`
      : base.coverImage,
    publishedYear: Number.isFinite(year) ? year : base.publishedYear,
    language: 'tr',
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
    binKitapSlug: null,
    isbn13: null,
    title: doc.title,
    subtitle: null,
    authors: doc.author_name ?? [],
    publisher: null,
    publishedYear: doc.first_publish_year ?? null,
    firstPublishedYear: doc.first_publish_year ?? null,
    pageCount: doc.number_of_pages_median ?? null,
    language: openLibraryLanguage(doc.language),
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
