/**
 * Sitenin renk temaları.
 *
 * ── NEDEN İKİ TANE ────────────────────────────────────────────────────────
 * Önce üç vardı (mor, turuncu, lacivert). Üçü de koyuydu ve aynı token setini
 * yalnızca ton olarak değiştiriyordu — yani farklı bir ihtiyaca değil zevke
 * hizmet ediyorlardı. Bedeli gerçekti: her renk kararı üç palette birden
 * doğrulanmak zorundaydı ve `[data-category]` derileri de aynı tokenları
 * ezdiği için test yüzeyi tema × kategori kadar büyüyordu.
 *
 * Turuncu kaldırıldı çünkü zemini (#121212) morunkiyle (#14141a) neredeyse
 * aynıydı: "başka bir tema" değil "aynı tema, başka vurgu" gibi duruyordu.
 * Lacivert kaldı, zemini (#10141c) gerçekten ayrı olan tek tema.
 *
 * Açık tema bilinçli olarak YOK: sitenin mottosu "gölgede kalan" ve düzen
 * afiş/backdrop üzerine kurulu; açık zemin afişlerin derinliğini söndürürdü.
 *
 * ⚠️ Eski `orange` çerezini taşıyan tarayıcılar kendiliğinden varsayılana
 * düşüyor — `layout.tsx` çerezi bu listeye karşı doğruluyor, göç kodu gereksiz.
 */
export const THEMES = ["purple", "navy"] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = "purple";

export const THEME_COOKIE = "kuronexus-theme";
