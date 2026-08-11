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
  /**
   * Salon 06 — 11 Ağustos 2026'da Kadim Dünyalar'ın YERİNİ ALDI (kullanıcı
   * kararı). Kadim kategorisi aynı gün yumuşak silindi; buradan da çıkarıldı.
   *
   * ⚠️ Temürkan Efsaneleri bu listeye GİRMEZ ve girmemeli: o bir
   * `UniverseCategory` değil, `app/[locale]/page.tsx`te listenin sonuna elle
   * eklenen mühürlü bir kapı (`hall: doors.length + 1`). Buraya yazılırsa
   * `hallNumber` onu kategori sanar ve bütün salon numaraları kayar.
   */
  "muzik",
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

// Kitap arşivi açıldı: kapının altında artık "yakında" değil evren sayısı var
export const CODE_HALLS: CodeHall[] = [
  { slug: "kitap", art: "/halls/kitap.svg", soon: false },
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
  kitap: 1,
  /* Salon 06 · Müzik de tek bir arşiv bölümü açıyor ("Müzik Arşivi") ve hiç
     `WikiUniverse` taşımıyor — içeriği `Music*` tablolarında. Kapının altındaki
     ölçü zaten sanatçı sayısı (bkz. `pulse.service.ts`), bu satır yalnızca
     keşif sayımındaki toplam evren sayısına katkısı için var. */
  muzik: 1,
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

/**
 * Salon kapısının açıldığı adres.
 *
 * 8 Ağustos 2026'ya kadar üç yüzey de `/dark-stories/category/${slug}` dizesini
 * ELLE yazıyordu: ana sayfadaki kapı duvarı (üç ayrı yerde — biri backend
 * düştüğünde devreye giren yedek kadro), Nexus kapıları ve **her sayfanın**
 * footer'ındaki salon sütunu. Spor kendi ağacına taşınırken bu üç yüzeyi ayrı
 * ayrı düzeltmek, üç kez unutma şansı demekti — ve yedek kadroyu unutmak en
 * sinsisi olurdu: hata yalnızca backend çöktüğünde görünürdü.
 *
 * `hallNumber`/`mergeCodeHalls` deseninin varlık sebebi tam olarak bu; adres de
 * artık aynı yerden geliyor.
 *
 * Spor adresi değişen İLK salon. İkinci bir salon taşınırsa bu haritaya girer
 * ve yine hiçbir yüzeye dokunulmaz.
 */
/**
 * Kendi ağacında yaşayan salonlar.
 *
 * Ad "MOVED" olarak kaldı ama artık iki tür kayıt tutuyor:
 *  - `spor` gerçekten TAŞINDI (`/dark-stories/category/spor` → `/spor`,
 *    8 Ağustos 2026, kalıcı yönlendirmeleriyle)
 *  - `muzik` hiç `/dark-stories` altında YAŞAMADI: 11 Ağustos'ta doğduğu anda
 *    kendi ağacında kuruldu, spor göçünün dersi tekrarlanmasın diye
 */
const MOVED_HALLS: Record<string, string> = {
  spor: "/spor",
  muzik: "/muzik",
};

export function hallHref(slug: string): string {
  return MOVED_HALLS[slug] ?? `/dark-stories/category/${slug}`;
}
