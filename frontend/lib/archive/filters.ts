/**
 * Raf sayfalarının süzgeç ve sıralama kuralları — film, dizi ve kitap
 * kanatlarının ortak hattı.
 *
 * ── NEDEN TEK DOSYA ───────────────────────────────────────────────────────
 * `lib/film/filters.ts` ile `lib/show/filters.ts` **birebir aynıydı**; tek
 * fark parametre tipiydi ve dizi dosyasının kendi yorumu bunu itiraf ediyordu
 * (1 Eylül 2026 denetimi, bulgu D-F1). `byNumber`ın üçüncü bir kopyası da
 * kitap kanadında duruyordu. Süzgeç davranışında yapılacak her düzeltme üç
 * dosyaya elle taşınmak zorundaydı; taşınmazsa iki raf aynı seçenekle farklı
 * sonuç verirdi ve bu hiçbir yerde hata olarak görünmezdi.
 *
 * Puan sıralaması TMDB puanına bakar (arşivde IMDb verisi yok); kişisel puan
 * ayrı bir seçenek. Puanı olmayan kayıt hangi yönde sıralanırsa sıralansın en
 * sona düşer — "puansız" kayıtlar listenin başını işgal etmesin.
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

// Tek tek yıllar yakın geçmiş için, onluklar öncesi için. "2020'ler" seçeneği
// YOK: 2020-2026 zaten tek tek listeleniyor, ikisi bir arada çakışırdı.
const SINGLE_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020];
const DECADES = [2010, 2000, 1990, 1980];

export interface PeriodOption {
  /** URL'de ve seçimde kullanılan değer: "2024", "1990s", "older" */
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

/**
 * Süzgecin dokunduğu alanlar. Film `releaseYear`i vizyon yılı, dizi ilk yayın
 * yılı olarak taşıyor — kural ikisinde de aynı olduğu için tip burada ortak.
 */
export interface FilterableEntry {
  genres: string[];
  releaseYear: number | null;
  voteAverage: number | null;
  personalRating: number | null;
  title: string;
}

function matchesPeriod(entry: FilterableEntry, period: string): boolean {
  const year = entry.releaseYear;
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

/**
 * `null` her zaman sona. Kitap kanadı da bunu kullanıyor: orada üçüncü bir
 * kopyası duruyordu.
 */
export function byNumber(
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

/**
 * Jenerik: çağıranın kayıt tipi korunur, yani film listesi film listesi
 * olarak döner. Tip parametresi olmasaydı her kanat kendi sarmalayıcısını
 * yazmak zorunda kalırdı — tekrarın geri gelme yolu tam olarak budur.
 */
export function applyFilters<T extends FilterableEntry>(
  entries: T[],
  options: { genre: string | null; period: string | null; sort: SortKey },
): T[] {
  const filtered = entries.filter((entry) => {
    if (options.genre !== null && !entry.genres.includes(options.genre)) {
      return false;
    }
    if (options.period !== null && !matchesPeriod(entry, options.period)) {
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
