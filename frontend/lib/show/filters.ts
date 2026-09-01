/**
 * Dizi rafının süzgeç ve sıralama kuralları.
 *
 * Gövde `lib/archive/filters.ts`te — bu dosya film kanadındaki ikiziyle
 * birebir aynıydı ve eski yorumu bunu zaten itiraf ediyordu (1 Eylül 2026
 * denetimi, D-F1). Dizide `releaseYear` ilk yayın yılı; kural aynı olduğu için
 * ortak hat onu da karşılıyor.
 */
export {
  applyFilters,
  byNumber,
  DEFAULT_SORT,
  isSortKey,
  PERIOD_OPTIONS,
  SORT_KEYS,
} from "@/lib/archive/filters";
export type { PeriodOption, SortKey } from "@/lib/archive/filters";
