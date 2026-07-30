import type { ArchiveShow } from "@/lib/api/types";

/**
 * Raf sayfalarının süzgeç ve sıralama kuralları — film salonundaki
 * `lib/film/filters.ts` ile birebir aynı, tek fark alan adı (`releaseYear`
 * dizide ilk yayın yılı).
 */

export const SORT_KEYS = [
  "added",
  "ratingDesc",
  "ratingAsc",
  "myRatingDesc",
  "yearDesc",
  "yearAsc",
  "title",
] as const;

export type SortKey = (typeof SORT_KEYS)[number];

export const DEFAULT_SORT: SortKey = "added";

export function isSortKey(value: string | null): value is SortKey {
  return value !== null && (SORT_KEYS as readonly string[]).includes(value);
}

const SINGLE_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020];
const DECADES = [2010, 2000, 1990, 1980];

export interface PeriodOption {
  value: string;
  kind: "year" | "decade" | "older";
  year?: number;
  decade?: number;
}

export const PERIOD_OPTIONS: PeriodOption[] = [
  ...SINGLE_YEARS.map((year) => ({
    value: String(year),
    kind: "year" as const,
    year,
  })),
  ...DECADES.map((decade) => ({
    value: `${decade}s`,
    kind: "decade" as const,
    decade,
  })),
  { value: "older", kind: "older" },
];

function matchesPeriod(show: ArchiveShow, period: string): boolean {
  const year = show.releaseYear;
  if (year === null) {
    return false;
  }
  const option = PERIOD_OPTIONS.find((item) => item.value === period);
  if (!option) {
    return true;
  }
  if (option.kind === "year") {
    return year === option.year;
  }
  if (option.kind === "decade") {
    return year >= option.decade! && year < option.decade! + 10;
  }
  return year < DECADES[DECADES.length - 1];
}

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
  shows: ArchiveShow[],
  options: { genre: string | null; period: string | null; sort: SortKey },
): ArchiveShow[] {
  const filtered = shows.filter((show) => {
    if (options.genre !== null && !show.genres.includes(options.genre)) {
      return false;
    }
    if (options.period !== null && !matchesPeriod(show, options.period)) {
      return false;
    }
    return true;
  });

  const sorted = [...filtered];
  switch (options.sort) {
    case "ratingDesc":
      sorted.sort((a, b) => byNumber(a.voteAverage, b.voteAverage, "desc"));
      break;
    case "ratingAsc":
      sorted.sort((a, b) => byNumber(a.voteAverage, b.voteAverage, "asc"));
      break;
    case "myRatingDesc":
      sorted.sort((a, b) =>
        byNumber(a.personalRating, b.personalRating, "desc"),
      );
      break;
    case "yearDesc":
      sorted.sort((a, b) => byNumber(a.releaseYear, b.releaseYear, "desc"));
      break;
    case "yearAsc":
      sorted.sort((a, b) => byNumber(a.releaseYear, b.releaseYear, "asc"));
      break;
    case "title":
      sorted.sort((a, b) => a.title.localeCompare(b.title, "tr"));
      break;
    default:
      break;
  }
  return sorted;
}
