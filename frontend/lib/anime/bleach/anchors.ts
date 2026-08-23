/**
 * SAYFA İÇİ ÇAPALARIN TEK DEFTERİ — P18-b.
 *
 * ── NEDEN AYRI BİR DOSYA ─────────────────────────────────────────────────
 * `slots.ts` içindeki `BLEACH_SECTIONS` küratör panelinin gruplama defteri
 * ve kimlikleri sayfadaki `id`lerle AYNI DEĞİL: orada `wandenreich` ve
 * `timeline` yazıyor, sayfada `empire` ve `story` duruyor (ilki katman
 * `id`siyle çakışmasın diye, `WorldSection` başlığında yazılı). O deftere
 * çapa görevi yüklemek iki farklı işi tek listeye bindirmek olurdu.
 *
 * Bu defter üç yeri birden besliyor ve üçünün de aynı sırayı görmesi şart:
 *   1. "Bölümlere atla" listesi (`SectionNav`) — klavyeyle gelen kişinin
 *      on altı bölüme tek sekmede ulaşması
 *   2. JSON-LD `ItemList` — arama motoruna sayfanın iç yapısı
 *   3. `scripts/check-bleach-anchors.mjs` — her çapanın GERÇEKTEN var olduğu
 *
 * ⚠️ ÖLÜ ÇAPA YASAK. `worlds.ts`teki `READY_SECTIONS` aynı dersi taşıyor:
 * "ölü bir sayfa içi çapası, olmayan bir bağlantıdan kötüdür". Fark şu ki
 * orada karar elle veriliyor, burada **betik denetliyor**: bir bölümün
 * `id`si değişirse `pnpm check:bleach` kırmızı yanıyor.
 */

export interface BleachAnchor {
  /**
   * Sayfadaki gerçek `id`. `#` YOK — bağlantıyı kuran taraf ekliyor.
   * `check-bleach-anchors.mjs` bu değeri bileşen kaynaklarında arıyor.
   */
  anchor: string;
  /**
   * `anime.bleach.toc` altındaki etiket anahtarı.
   *
   * ⚠️ Bölümün kendi `title`ı KULLANILMADI: içerik başlıkları uzun ve
   * bazıları listede anlamsız ("BLEACH", "Cevap Veren On"). İçindekiler
   * listesi başka bir metin türü — kısa, gezinilebilir, tarayıcının
   * odak halkasında bir satıra sığan.
   */
  key: string;
}

/**
 * SAYFA SIRASI. Değiştirirsen `page.tsx`teki çizim sırası da değişmeli;
 * ikisi ayrışırsa "atla" listesi kullanıcıyı yukarı fırlatır.
 *
 * ⚠️ `worlds` çapası `living` — Üç Dünya bölümü tek bir kutu değil, beş
 * kardeş katman (`WorldLayers` bir fragment; her katmanın tam taşan kendi
 * derisi var ve araya sarmalayıcı koymak o deriyi kırardı). İniş ilk
 * katmanda başlıyor, çapa da orada. Beş katmanın tamamı zaten derinlik
 * rayında ayrı ayrı duruyor (`DepthRail`), listede beş satır daha açmak
 * on altı bölümlük omurgayı okunmaz yapardı.
 */
export const BLEACH_ANCHORS: readonly BleachAnchor[] = [
  { anchor: "hero", key: "hero" },
  { anchor: "living", key: "worlds" },
  { anchor: "gotei", key: "gotei" },
  { anchor: "zanpakuto", key: "zanpakuto" },
  { anchor: "bankai", key: "bankai" },
  { anchor: "hierarchy", key: "hierarchy" },
  { anchor: "hueco", key: "hueco" },
  { anchor: "espada", key: "espada" },
  { anchor: "empire", key: "wandenreich" },
  { anchor: "powers", key: "powers" },
  { anchor: "masks", key: "masks" },
  { anchor: "war", key: "war" },
  { anchor: "legends", key: "legends" },
  { anchor: "houses", key: "houses" },
  { anchor: "locations", key: "locations" },
  { anchor: "story", key: "timeline" },
];
