/**
 * SAYFA İÇİ ÇAPALAR — SKORBORD MENÜSÜNÜN DEFTERİ.
 *
 * ── ÜÇ YERİ BİRDEN BESLİYOR ──────────────────────────────────────────────
 *   1. Neon skorbord menüsü (`Scoreboard`) — site başlığının altında
 *      yapışkan duran çeyrek listesi
 *   2. JSON-LD `ItemList` — arama motoruna sayfanın iç yapısı
 *   3. `scripts/check-slam-dunk.mjs` — her çapanın GERÇEKTEN var olduğu
 *
 * ⚠️ ÖLÜ ÇAPA YASAK. Bleach'te bunun için ayrı bir denetim betiği yazılmıştı
 * ve bir kez gerçek bir kırık bağlantı yakaladı: bölümün `id`si değişince
 * menü kullanıcıyı sayfanın başına fırlatıyordu. Aynı bekçi burada da var.
 *
 * ── NEDEN `slots.ts`teki BÖLÜM LİSTESİ DEĞİL ─────────────────────────────
 * O liste küratör PANELİNİN gruplama defteri: bir yuvanın hangi başlık
 * altında listeleneceğini söylüyor. Bu liste sayfanın GEZİNME omurgası.
 * Bugün ikisi aynı beş kimliği taşıyor ama işleri ayrı; birleştirmek, bir
 * gün panelde alt grup açmak istendiğinde menüyü de bölerdi.
 */

export interface SlamDunkAnchor {
  /**
   * Sayfadaki gerçek `id`. `#` YOK — bağlantıyı kuran taraf ekliyor.
   * Denetim betiği bu değeri bileşen kaynaklarında arıyor.
   */
  anchor: string;
  /** `slamDunk.quarters` altındaki kısa etiket (skorbordda yazan) */
  key: string;
}

/**
 * SAYFA SIRASI. Değiştirirsen `page.tsx`teki çizim sırası da değişmeli;
 * ikisi ayrışırsa skorbord ziyaretçiyi yanlış yere indirir.
 */
export const SLAM_DUNK_ANCHORS: readonly SlamDunkAnchor[] = [
  { anchor: "tipoff", key: "q1" },
  { anchor: "shohoku", key: "q2" },
  { anchor: "matchup", key: "half" },
  { anchor: "bench", key: "q3" },
  { anchor: "buzzer", key: "q4" },
];
