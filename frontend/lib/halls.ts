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

/**
 * Arşiv salonlarının taşıdığı "bölüm" sayısı. Film/Dizi/Anime kanatlarının
 * `WikiUniverse` kaydı yoktur (içerik TMDB/AniList arşivi), ama her biri tek
 * bir arşiv bölümü açar ("Film Arşivi", "Dizi Arşivi", "Anime Arşivi"). Bu
 * bölüm keşif sayımında bir evren olarak sayılır (kullanıcı kararı: bir
 * salonda açılmış her başlık bir evrendir). Spor ve Kadim Dünyalar gerçek
 * evrenler taşıdığından listede yok — onlar için 0 eklenir.
 */
const ARCHIVE_SECTIONS: Record<string, number> = {
  film: 1,
  dizi: 1,
  anime: 1,
};

/**
 * Bir salonun keşifte görünen evren sayısı: gerçek `WikiUniverse` sayısına
 * o salonun açtığı arşiv bölümleri eklenir. Kapı duvarı da Nexus kapıları da
 * bu tek kaynaktan okur, iki yerde ayrı hesaplanıp birbirini tutmasın diye.
 */
export function hallWorldCount(slug: string, universeCount: number): number {
  return universeCount + (ARCHIVE_SECTIONS[slug] ?? 0);
}

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

/**
 * Salonun görünen adı: veritabanındaki kategori adı. Kod içinde sabit bir ad
 * TUTULMAZ — kategori `/admin/universe-categories`ten yeniden adlandırılınca
 * ana sayfadaki kapı, salon girişi ve salon başlıkları birlikte değişsin diye.
 */
export function hallName(
  categories: Array<{ slug: string; name: string }>,
  slug: string,
  fallback: string,
): string {
  return categories.find((category) => category.slug === slug)?.name ?? fallback;
}

/** "01", "02" … — başlıklarda iki haneli gösterilir. */
export function hallLabel(value: number | null): string {
  return value === null ? "" : String(value).padStart(2, "0");
}
