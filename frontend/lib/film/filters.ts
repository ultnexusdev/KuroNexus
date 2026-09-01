/**
 * Film rafının süzgeç ve sıralama kuralları.
 *
 * Gövde `lib/archive/filters.ts`te: bu dosya ile `lib/show/filters.ts` birebir
 * aynıydı ve tek fark parametre tipiydi (1 Eylül 2026 denetimi, D-F1).
 * `applyFilters` jenerik olduğu için film listesi film listesi olarak dönüyor;
 * çağrı yerleri değişmedi.
 *
 * Yeniden dışa aktarma bilinçli: kanat kendi adresinden okumaya devam etsin,
 * ileride filme özgü bir süzgeç gerekirse buraya eklensin.
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
