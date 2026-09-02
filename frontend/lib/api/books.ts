import { cache } from "react";
import { apiFetch } from "./client";
import { freshness } from "./freshness";
import type {
  AwardDetail,
  AwardSummary,
  BookArchive,
  BookDetail,
  BookPersonPage,
  BookPublisherPage,
  BookSeriesPage,
  ReadingOrderDetail,
  ReadingOrderSummary,
  SourceBookPage,
} from "./types";

const EMPTY_ARCHIVE: BookArchive = {
  books: [],
  stats: {
    read: 0,
    readThisYear: 0,
    toRead: 0,
    reading: 0,
    abandoned: 0,
    favorites: 0,
    totalPages: 0,
    pagesThisYear: 0,
    averageRating: null,
    longest: null,
    shortest: null,
    topGenre: null,
    topAuthor: null,
    goal: null,
  },
  series: [],
  authors: [],
  genres: [],
  recent: [],
  quoteOfTheDay: null,
};

/**
 * Salon tek istekte dolar; künye dış kaynaktan değil kendi tablomuzdan gelir.
 *
 * Tazelik `fresh`e bağlı (`lib/api/freshness.ts`): küratör arşive kitap
 * ekledikten hemen sonra salonda görür, ziyaretçi en geç beş dakikada.
 * 2 Eylül 2026'ya kadar herkes için `no-store` idi — 558 KB'lık yanıt her
 * ziyarette yeniden üretiliyordu.
 */
export function fetchBookArchive(fresh?: boolean): Promise<BookArchive> {
  return apiFetch<BookArchive>("/books", freshness(fresh));
}

/*
 * `cache()` sarmalayıcıları `fresh`i BOOLEAN'a normalize ederek çağrılır:
 * React `cache` argümanları referans/değer eşitliğiyle anahtarlıyor, yani
 * `undefined` ile `false` AYRI girişler olurdu — `generateMetadata` (arg
 * vermez) ile sayfa gövdesi (isAdmin=false verir) aynı ziyarette iki ayrı
 * fetch atardı ve API-03'ün dedupe kazancı sessizce kaybolurdu.
 */

/**
 * Arşiv alınamazsa salon boş açılır, sayfa çökmez (kural 4 ruhu).
 * `unavailable` bayrağının gerekçesi `movies.ts`te yazılı.
 */
const cachedBookArchive = cache(async (fresh: boolean): Promise<BookArchive> => {
  try {
    return await fetchBookArchive(fresh);
  } catch {
    return { ...EMPTY_ARCHIVE, unavailable: true };
  }
});
export function getBookArchive(fresh?: boolean): Promise<BookArchive> {
  return cachedBookArchive(fresh === true);
}

/** Kitap sayfası: künye + alıntılar + seri + komşular. Yoksa null (404). */
const cachedBookDetail = cache(
  async (slug: string, fresh: boolean): Promise<BookDetail | null> => {
    try {
      return await apiFetch<BookDetail>(
        `/books/${encodeURIComponent(slug)}`,
        freshness(fresh),
      );
    } catch {
      return null;
    }
  },
);
export function getBookDetail(
  slug: string,
  fresh?: boolean,
): Promise<BookDetail | null> {
  return cachedBookDetail(slug, fresh === true);
}

/**
 * Yazar / çevirmen sayfası. Önbellek YOK ve 2 Eylül'deki `fresh` geçişinin
 * BİLEREK dışında: biyografi ilk ziyarette backend'de kaynaktan çekilip
 * saklanıyor, `revalidate` konsaydı ZİYARETÇİ biyografisiz hâli beş dakika
 * görmeye devam ederdi — küratör muafiyeti bunu çözmez, çünkü gecikmeli
 * doldurma ziyaretçiye dönük (ödül raflarıyla aynı gerekçe).
 */
export const getBookPerson = cache(
  async (slug: string): Promise<BookPersonPage | null> => {
    try {
      return await apiFetch<BookPersonPage>(
        `/books/kisi/${encodeURIComponent(slug)}`,
        { cache: "no-store" },
      );
    } catch {
      return null;
    }
  },
);

/**
 * Seri sayfası. Küratör arşive yeni cilt eklediğinde serinin sayfasında
 * hemen görür (`fresh`); ziyaretçi beş dakikalık önbellekten okur.
 */
const cachedBookSeries = cache(
  async (slug: string, fresh: boolean): Promise<BookSeriesPage | null> => {
    try {
      return await apiFetch<BookSeriesPage>(
        `/books/seri/${encodeURIComponent(slug)}`,
        freshness(fresh),
      );
    } catch {
      return null;
    }
  },
);
export function getBookSeries(
  slug: string,
  fresh?: boolean,
): Promise<BookSeriesPage | null> {
  return cachedBookSeries(slug, fresh === true);
}

const cachedBookPublisher = cache(
  async (slug: string, fresh: boolean): Promise<BookPublisherPage | null> => {
    try {
      return await apiFetch<BookPublisherPage>(
        `/books/yayinevi/${encodeURIComponent(slug)}`,
        freshness(fresh),
      );
    } catch {
      return null;
    }
  },
);
export function getBookPublisher(
  slug: string,
  fresh?: boolean,
): Promise<BookPublisherPage | null> {
  return cachedBookPublisher(slug, fresh === true);
}

/**
 * Arşivde olmayan kitabın künye sayfası (ödül raflarından gelinir).
 *
 * Künye backend'de 30 gün cache'leniyor, o yüzden burada da bir gün
 * `revalidate` var: kaynağa her ziyarette gidilmiyor ve sayfa hızlı açılıyor.
 * Kitap arşive eklendiğinde gecikme sorun değil — kart zaten arşiv sayfasına
 * gitmeye başlıyor (`inArchive`, ödül rafında canlı hesaplanıyor).
 */
export const getSourceBook = cache(
  async (slug: string): Promise<SourceBookPage | null> => {
    try {
      return await apiFetch<SourceBookPage>(
        `/books/kaynak/${encodeURIComponent(slug)}`,
        { next: { revalidate: 86400 } },
      );
    } catch {
      return null;
    }
  },
);

/**
 * Ödül rafları. Önbellek YOK ve `fresh` geçişinin BİLEREK dışında: kapaklar
 * backend'de arka planda doluyor ve raf `pending` sayacıyla kendini tazeliyor
 * — ziyaretçi için `revalidate` konsaydı o döngü beş dakika boyunca aynı
 * "bekleyen" yanıtı okurdu. Ucun bedeli API-06/API-10 ile zaten düştü.
 *
 * Alınamazsa boş liste: ödüller bölümü "alınamadı" der, salon çökmez (kural 4).
 */
export const getAwards = cache(async (): Promise<AwardSummary[]> => {
  try {
    return await apiFetch<AwardSummary[]>("/books/awards", {
      cache: "no-store",
    });
  } catch {
    return [];
  }
});

/** Tek ödülün rafı. Bilinmeyen anahtar için null (sayfa 404 verir). */
export const getAward = cache(
  async (key: string): Promise<AwardDetail | null> => {
    try {
      return await apiFetch<AwardDetail>(
        `/books/awards/${encodeURIComponent(key)}`,
        { cache: "no-store" },
      );
    } catch {
      return null;
    }
  },
);

/**
 * Okuma sıraları. Önbellek YOK: "hangi durak arşivimde" canlı hesaplanıyor,
 * arşive kitap eklendikten hemen sonra tabloda görünmesi gerekiyor.
 */
export const getReadingOrders = cache(
  async (): Promise<ReadingOrderSummary[]> => {
    try {
      return await apiFetch<ReadingOrderSummary[]>("/books/okuma-sirasi", {
        cache: "no-store",
      });
    } catch {
      return [];
    }
  },
);

/** Tek bir okuma sırası. Bilinmeyen anahtar için null (sayfa 404 verir). */
export const getReadingOrder = cache(
  async (key: string): Promise<ReadingOrderDetail | null> => {
    try {
      return await apiFetch<ReadingOrderDetail>(
        `/books/okuma-sirasi/${encodeURIComponent(key)}`,
        { cache: "no-store" },
      );
    } catch {
      return null;
    }
  },
);

/*
 * getBookShowcase 2026-08-22 denetiminde SİLİNDİ: kitap lobisi vitrin
 * kapaklarını artık bu uçtan almıyor ve fonksiyonun repo genelinde tek
 * referansı kendi tanımıydı (film/dizi/anime kanatlarının kendi showcase
 * getiricileri kullanımda ve DURUYOR). Backend'deki GET /books/showcase
 * ucunun kaldırılması sahibinin kararı (denetim raporunda listeli).
 */
