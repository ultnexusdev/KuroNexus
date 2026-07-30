import type { ArchiveBook, BookTranslation } from "@/lib/api/types";

/**
 * Kitap arşivinin süzgeç ve sıralama kuralları.
 *
 * Film kanadından iki fark var, ikisi de kitaba özgü:
 *  - dönem listesi **kitap ölçeğinde**: film salonunda 1980'lerden bugüne
 *    yetiyor, kitapta Dostoyevski de rafta duruyor — 19. yüzyıl ve öncesi
 *    ayrı kovalar,
 *  - dönem **baskı yılına değil ilk yayım yılına** bakar; 1866'da yazılıp
 *    2019'da basılan kitap 19. yüzyılda aranır.
 */

export const SORT_KEYS = [
  "added",
  "myRatingDesc",
  "yearDesc",
  "yearAsc",
  "pagesDesc",
  "title",
  "author",
  "series",
] as const;

export type SortKey = (typeof SORT_KEYS)[number];

export const DEFAULT_SORT: SortKey = "added";

export function isSortKey(value: string | null): value is SortKey {
  return value !== null && (SORT_KEYS as readonly string[]).includes(value);
}

/**
 * Dönem kovaları — film salonundaki "Dönem" seçkisinin kitap karşılığı.
 * Yakın onluklar tek tek, eskiler gitgide genişleyerek: arşivde 1994 ile 1997
 * arasındaki fark anlamlı, 1840 ile 1870 arasındaki değil.
 */
export const PERIOD_OPTIONS = [
  { value: "2020s", from: 2020, to: 2029 },
  { value: "2010s", from: 2010, to: 2019 },
  { value: "2000s", from: 2000, to: 2009 },
  { value: "1990s", from: 1990, to: 1999 },
  { value: "1980s", from: 1980, to: 1989 },
  { value: "1970s", from: 1970, to: 1979 },
  { value: "1960s", from: 1960, to: 1969 },
  { value: "1950s", from: 1950, to: 1959 },
  { value: "1900-1949", from: 1900, to: 1949 },
  { value: "19c", from: 1800, to: 1899 },
  { value: "older", from: null, to: 1799 },
] as const;

export type PeriodValue = (typeof PERIOD_OPTIONS)[number]["value"];

export interface BookFilterState {
  genres: string[];
  /** Dönem kovası; null = tüm yıllar */
  period: PeriodValue | null;
  /** Baskı dili ("tr", "en"); boş = hepsi */
  languages: string[];
  translation: BookTranslation | null;
  search: string;
  sort: SortKey;
}

export const EMPTY_FILTERS: BookFilterState = {
  genres: [],
  period: null,
  languages: [],
  translation: null,
  search: "",
  sort: DEFAULT_SORT,
};

/** Kitabın süzgeçlerde kullanılan yılı: önce ilk yayım, yoksa baskı yılı. */
export function bookYear(book: ArchiveBook): number | null {
  return book.firstPublishedYear ?? book.publishedYear;
}

function matchesPeriod(book: ArchiveBook, period: PeriodValue): boolean {
  const year = bookYear(book);
  // Yılı bilinmeyen kitap dönem süzgecinde elenir: aksi hâlde her kovada
  // birden görünürdü
  if (year === null) {
    return false;
  }
  const option = PERIOD_OPTIONS.find((item) => item.value === period);
  if (!option) {
    return true;
  }
  return (option.from === null || year >= option.from) && year <= option.to;
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
  const filtered = books.filter((book) => {
    // Türler VEYA ile birleşir: "Fantastik + Bilim Kurgu" ikisinden birini
    // taşıyan her kitabı getirir (VE ile seçim neredeyse hep boş dönüyordu)
    if (
      filters.genres.length > 0 &&
      !book.genres.some((genre) => filters.genres.includes(genre))
    ) {
      return false;
    }
    if (filters.period !== null && !matchesPeriod(book, filters.period)) {
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
