import type { ArchiveBook, BookTranslation } from "@/lib/api/types";

/**
 * Kitap arşivinin süzgeç ve sıralama kuralları.
 *
 * Film kanadından üç fark var, üçü de kitaba özgü:
 *  - **sayfa aralığı** süzgeci (film süresinin karşılığı),
 *  - **çeviri durumu** süzgeci ("henüz çevrilmedi"leri gizle),
 *  - yıl süzgeci baskı yılına değil **ilk yayım yılına** bakar; 1954'te yazılıp
 *    2019'da basılan kitap 1950'lerde aranır.
 */

export const SORT_KEYS = [
  "added",
  "myRatingDesc",
  "yearDesc",
  "yearAsc",
  "pagesDesc",
  "pagesAsc",
  "title",
  "author",
  "series",
] as const;

export type SortKey = (typeof SORT_KEYS)[number];

export const DEFAULT_SORT: SortKey = "added";

export function isSortKey(value: string | null): value is SortKey {
  return value !== null && (SORT_KEYS as readonly string[]).includes(value);
}

/** Sol paneldeki sayfa sayısı kovaları (resimdeki düzen). */
export const PAGE_BUCKETS = [
  { value: "0-300", min: 0, max: 300 },
  { value: "301-500", min: 301, max: 500 },
  { value: "501-800", min: 501, max: 800 },
  { value: "801-1200", min: 801, max: 1200 },
  { value: "1200+", min: 1201, max: Number.MAX_SAFE_INTEGER },
] as const;

export type PageBucket = (typeof PAGE_BUCKETS)[number]["value"];

/** Sol paneldeki puan eşikleri: "90+" = 9.0 ve üstü (beş yıldız). */
export const RATING_THRESHOLDS = [
  { value: "5", min: 9 },
  { value: "4", min: 7.5 },
  { value: "3", min: 5 },
  { value: "2", min: 2.5 },
  { value: "1", min: 0 },
] as const;

export interface BookFilterState {
  genres: string[];
  /** Yıldız eşiği ("5", "4"…) — biri seçilir, altındakiler de dahil olmaz */
  rating: string | null;
  /** İlk yayım yılı aralığı; null = sınırsız */
  yearFrom: number | null;
  yearTo: number | null;
  pages: PageBucket[];
  /** Baskı dili ("tr", "en"); boş = hepsi */
  languages: string[];
  translation: BookTranslation | null;
  search: string;
  sort: SortKey;
}

export const EMPTY_FILTERS: BookFilterState = {
  genres: [],
  rating: null,
  yearFrom: null,
  yearTo: null,
  pages: [],
  languages: [],
  translation: null,
  search: "",
  sort: DEFAULT_SORT,
};

/** Kitabın süzgeçlerde kullanılan yılı: önce ilk yayım, yoksa baskı yılı. */
export function bookYear(book: ArchiveBook): number | null {
  return book.firstPublishedYear ?? book.publishedYear;
}

function matchesPages(book: ArchiveBook, buckets: PageBucket[]): boolean {
  if (buckets.length === 0) {
    return true;
  }
  // Sayfa sayısı bilinmeyen kitap sayfa süzgecinde elenir: aksi halde her
  // kovada birden görünürdü
  if (!book.pageCount) {
    return false;
  }
  return buckets.some((value) => {
    const bucket = PAGE_BUCKETS.find((item) => item.value === value);
    return (
      bucket !== undefined &&
      book.pageCount! >= bucket.min &&
      book.pageCount! <= bucket.max
    );
  });
}

function matchesSearch(book: ArchiveBook, query: string): boolean {
  const trimmed = query.trim().toLocaleLowerCase("tr");
  if (!trimmed) {
    return true;
  }
  const haystack = [
    book.title,
    book.originalTitle ?? "",
    book.seriesName ?? "",
    ...book.authors,
  ]
    .join(" ")
    .toLocaleLowerCase("tr");
  return haystack.includes(trimmed);
}

/** Puansızlar sona: karşılaştırmada null yerine yön farkı gözetilir. */
function byNumber(
  a: number | null,
  b: number | null,
  direction: "asc" | "desc",
): number {
  if (a === null && b === null) {
    return 0;
  }
  if (a === null) {
    return 1;
  }
  if (b === null) {
    return -1;
  }
  return direction === "desc" ? b - a : a - b;
}

export function applyFilters(
  books: ArchiveBook[],
  filters: BookFilterState,
): ArchiveBook[] {
  const threshold = filters.rating
    ? (RATING_THRESHOLDS.find((item) => item.value === filters.rating)?.min ??
      null)
    : null;

  const filtered = books.filter((book) => {
    // Türler VEYA ile birleşir: "Fantastik + Bilim Kurgu" ikisinden birini
    // taşıyan her kitabı getirir (VE ile seçim neredeyse hep boş dönüyordu)
    if (
      filters.genres.length > 0 &&
      !book.genres.some((genre) => filters.genres.includes(genre))
    ) {
      return false;
    }
    if (
      threshold !== null &&
      (book.personalRating === null || book.personalRating < threshold)
    ) {
      return false;
    }
    const year = bookYear(book);
    if (filters.yearFrom !== null && (year === null || year < filters.yearFrom)) {
      return false;
    }
    if (filters.yearTo !== null && (year === null || year > filters.yearTo)) {
      return false;
    }
    if (!matchesPages(book, filters.pages)) {
      return false;
    }
    if (
      filters.languages.length > 0 &&
      (book.language === null || !filters.languages.includes(book.language))
    ) {
      return false;
    }
    if (
      filters.translation !== null &&
      book.translationState !== filters.translation
    ) {
      return false;
    }
    return matchesSearch(book, filters.search);
  });

  const sorted = [...filtered];
  switch (filters.sort) {
    case "myRatingDesc":
      sorted.sort((a, b) =>
        byNumber(a.personalRating, b.personalRating, "desc"),
      );
      break;
    case "yearDesc":
      sorted.sort((a, b) => byNumber(bookYear(a), bookYear(b), "desc"));
      break;
    case "yearAsc":
      sorted.sort((a, b) => byNumber(bookYear(a), bookYear(b), "asc"));
      break;
    case "pagesDesc":
      sorted.sort((a, b) => byNumber(a.pageCount, b.pageCount, "desc"));
      break;
    case "pagesAsc":
      sorted.sort((a, b) => byNumber(a.pageCount, b.pageCount, "asc"));
      break;
    case "title":
      // Türkçe sıralama: "İ" ve "ş" doğru yere düşsün
      sorted.sort((a, b) => a.title.localeCompare(b.title, "tr"));
      break;
    case "author":
      sorted.sort((a, b) =>
        (a.authors[0] ?? "").localeCompare(b.authors[0] ?? "", "tr"),
      );
      break;
    case "series":
      // Serisi olmayanlar sona; seri içinde cilt sırası korunur
      sorted.sort((a, b) => {
        if (!a.seriesName && !b.seriesName) {
          return a.title.localeCompare(b.title, "tr");
        }
        if (!a.seriesName) {
          return 1;
        }
        if (!b.seriesName) {
          return -1;
        }
        return (
          a.seriesName.localeCompare(b.seriesName, "tr") ||
          (a.seriesIndex ?? 0) - (b.seriesIndex ?? 0)
        );
      });
      break;
    default:
      // "added": API sırası zaten en yeni önce — dokunulmaz
      break;
  }
  return sorted;
}
