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
  "kitap",
  "kadim-dunyalar",
];

/**
 * Kod tanımlı salonlar: holde kapısı olan ama henüz `UniverseCategory` kaydı
 * bulunmayan kanatlar. Kitap salonunun kapısı arşivi hazırlanırken de duvarda
 * durur — kapı duvarı ve Nexus kapıları bu listeyi kendi kayıtlarıyla
 * birleştirir. Kategori sonradan panelden oluşturulursa **veritabanı kazanır**,
 * kapı iki kez çizilmez.
 */
export interface CodeHall {
  slug: string;
  /** `public/` altındaki özel kapı görseli (yüklenmiş kapak değil) */
  art: string;
  /** Salon açıldı ama içeriği henüz yok: sayı yerine "yakında" yazılır */
  soon: boolean;
}

export const CODE_HALLS: CodeHall[] = [
  { slug: "kitap", art: "/halls/kitap.svg", soon: true },
];

export function codeHall(slug: string): CodeHall | undefined {
  return CODE_HALLS.find((hall) => hall.slug === slug);
}

/**
 * Veritabanı salonlarıyla kod tanımlı salonları birleştirip salon sırasına
 * dizer. `make` yalnızca eksik kod salonları için çağrılır; iki surface (kapı
 * duvarı ve Nexus kapıları) aynı listeyi üretsin diye tek yerde durur.
 */
export function mergeCodeHalls<T>(
  items: T[],
  slugOf: (item: T) => string,
  make: (hall: CodeHall) => T,
): T[] {
  const present = new Set(items.map(slugOf));
  const merged = [
    ...items,
    ...CODE_HALLS.filter((hall) => !present.has(hall.slug)).map(make),
  ];
  return merged.sort((a, b) => {
    const ia = HALL_ORDER.indexOf(slugOf(a));
    const ib = HALL_ORDER.indexOf(slugOf(b));
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
}

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

/**
 * Kategorinin salon numarası (01'den başlar); bulunamazsa null.
 *
 * Sayım **kod tanımlı salonları da içerir** — yoksa kategori kaydı olmayan bir
 * kanat (Kitap) numarasız kalır, ondan sonraki salonlar da kapı duvarındaki
 * numaradan bir eksik görünür. Kapı duvarı, Nexus kapıları ve salon başlıkları
 * bu tek kaynaktan okuduğu için üçü her zaman aynı sayıyı söyler.
 */
export function hallNumber(
  categories: Array<{ slug: string }>,
  slug: string,
): number | null {
  const index = mergeCodeHalls(
    categories.map((category) => ({ slug: category.slug })),
    (item) => item.slug,
    (hall) => ({ slug: hall.slug }),
  ).findIndex((item) => item.slug === slug);
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
