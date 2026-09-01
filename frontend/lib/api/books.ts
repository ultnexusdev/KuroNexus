import { cache } from "react";
import { apiFetch } from "./client";
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
 * Sayfa önbelleği yok: arşive kitap ekledikten hemen sonra salonda görmek
 * gerekiyor (film kanadında verilen aynı karar).
 */
export function fetchBookArchive(): Promise<BookArchive> {
  return apiFetch<BookArchive>("/books", { cache: "no-store" });
}

/**
 * Arşiv alınamazsa salon boş açılır, sayfa çökmez (kural 4 ruhu).
 * `unavailable` bayrağının gerekçesi `movies.ts`te yazılı.
 */
export const getBookArchive = cache(async (): Promise<BookArchive> => {
  try {
    return await fetchBookArchive();
  } catch {
    return { ...EMPTY_ARCHIVE, unavailable: true };
  }
});

/** Kitap sayfası: künye + alıntılar + seri + komşular. Yoksa null (404). */
export const getBookDetail = cache(
  async (slug: string): Promise<BookDetail | null> => {
    try {
      return await apiFetch<BookDetail>(`/books/${encodeURIComponent(slug)}`, {
        cache: "no-store",
      });
    } catch {
      return null;
    }
  },
);

/**
 * Yazar / çevirmen sayfası. Önbellek YOK: biyografi ilk ziyarette backend'de
 * kaynaktan çekilip saklanıyor, `revalidate` konsaydı kullanıcı biyografisiz
 * hâli görmeye devam ederdi (ödül raflarıyla aynı gerekçe).
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
 * Seri sayfası. Önbellek YOK: arşive yeni cilt eklendiğinde serinin sayfasında
 * hemen görünmesi gerekiyor (salonla aynı karar).
 */
export const getBookSeries = cache(
  async (slug: string): Promise<BookSeriesPage | null> => {
    try {
      return await apiFetch<BookSeriesPage>(
        `/books/seri/${encodeURIComponent(slug)}`,
        { cache: "no-store" },
      );
    } catch {
      return null;
    }
  },
);

export const getBookPublisher = cache(
  async (slug: string): Promise<BookPublisherPage | null> => {
    try {
      return await apiFetch<BookPublisherPage>(
        `/books/yayinevi/${encodeURIComponent(slug)}`,
        { cache: "no-store" },
      );
    } catch {
      return null;
    }
  },
);

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
 * Ödül rafları. Önbellek YOK: kapaklar backend'de arka planda dolduğu için
 * ikinci açılışta sayfanın dolmuş olması gerekiyor — `revalidate` konsaydı
 * kullanıcı eski, kapaksız hâli görmeye devam ederdi.
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
