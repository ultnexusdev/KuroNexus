import type { UniverseCategory } from "./api/types";

/**
 * Gece Müzesi'ndeki salon sırası. Kapı duvarı da salon başlıkları da bu tek
 * kaynaktan okur — numaralar iki yerde ayrı hesaplanırsa (ana sayfada 01,
 * içeride 02 gibi) birbirini tutmaz.
 *
 * Listede olmayan yeni kategoriler sona eklenir.
 */
export const HALL_ORDER = [
  "film",
  "dizi",
  "spor",
  "anime",
  "kadim-dunyalar",
];

export function sortByHallOrder(
  categories: UniverseCategory[],
): UniverseCategory[] {
  return [...categories].sort((a, b) => {
    const ia = HALL_ORDER.indexOf(a.slug);
    const ib = HALL_ORDER.indexOf(b.slug);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
}

/** Kategorinin salon numarası (01'den başlar); bulunamazsa null. */
export function hallNumber(
  categories: UniverseCategory[],
  slug: string,
): number | null {
  const index = sortByHallOrder(categories).findIndex(
    (category) => category.slug === slug,
  );
  return index === -1 ? null : index + 1;
}

/** "01", "02" … — başlıklarda iki haneli gösterilir. */
export function hallLabel(value: number | null): string {
  return value === null ? "" : String(value).padStart(2, "0");
}
