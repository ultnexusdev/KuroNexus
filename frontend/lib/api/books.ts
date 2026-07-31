import { apiFetch } from "./client";
import type {
  AwardDetail,
  AwardSummary,
  BookArchive,
  BookDetail,
  BookShowcase,
} from "./types";

const EMPTY_SHOWCASE: BookShowcase = { left: null, right: null };

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

/** Arşiv alınamazsa salon boş açılır, sayfa çökmez (kural 4 ruhu). */
export async function getBookArchive(): Promise<BookArchive> {
  try {
    return await fetchBookArchive();
  } catch {
    return EMPTY_ARCHIVE;
  }
}

/** Kitap sayfası: künye + alıntılar + seri + komşular. Yoksa null (404). */
export async function getBookDetail(slug: string): Promise<BookDetail | null> {
  try {
    return await apiFetch<BookDetail>(`/books/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
  } catch {
    return null;
  }
}

/**
 * Ödül rafları. Önbellek YOK: kapaklar backend'de arka planda dolduğu için
 * ikinci açılışta sayfanın dolmuş olması gerekiyor — `revalidate` konsaydı
 * kullanıcı eski, kapaksız hâli görmeye devam ederdi.
 *
 * Alınamazsa boş liste: ödüller bölümü "alınamadı" der, salon çökmez (kural 4).
 */
export async function getAwards(): Promise<AwardSummary[]> {
  try {
    return await apiFetch<AwardSummary[]>("/books/awards", {
      cache: "no-store",
    });
  } catch {
    return [];
  }
}

/** Tek ödülün rafı. Bilinmeyen anahtar için null (sayfa 404 verir). */
export async function getAward(key: string): Promise<AwardDetail | null> {
  try {
    return await apiFetch<AwardDetail>(
      `/books/awards/${encodeURIComponent(key)}`,
      { cache: "no-store" },
    );
  } catch {
    return null;
  }
}

/** Salon girişinin iki yanındaki kapaklar; alınamazsa lobi onlarsız açılır. */
export async function getBookShowcase(): Promise<BookShowcase> {
  try {
    return await apiFetch<BookShowcase>("/books/showcase", {
      next: { revalidate: 86400 },
    });
  } catch {
    return EMPTY_SHOWCASE;
  }
}
