/**
 * KÜRATÖR YUVASI — EVRENDEN BAĞIMSIZ SÖZLEŞME.
 *
 * ── NEDEN AYRI DOSYA ─────────────────────────────────────────────────────
 * Bu üç liste (oran, işlem biçimi, karışım kipi) backend DTO'suyla birebir
 * eşleşiyor ve HİÇBİRİ bir evrene ait değil. 23 Ağustos 2026'da Bleach için
 * yazıldıkları için `lib/anime/bleach/slots.ts` içinde duruyorlardı; Slam
 * Dunk evreni (28 Ağustos 2026) aynı düzenleyiciyi kullanınca ikinci evrenin
 * Bleach'in veri dosyasını import etmesi gerekiyordu. Alternatif kopyalamaktı
 * ve iki kopyadan biri backend listesi değişince sessizce eskirdi.
 *
 * ⚠️ Bleach'in `slots.ts`i bunları RE-EXPORT ediyor — o dosyadan import eden
 * on altı bölüm dosyasına dokunulmadı.
 *
 * ── BURAYA NE GİRMEZ ─────────────────────────────────────────────────────
 * Yuvanın kendisi (`CuratedSlotDef`), bölüm listesi ve yedek çizim biçimi
 * evrene AİT: Bleach'in `world` alanı ve `typographic` yedeği Slam Dunk'ta
 * anlamsız. Her evren kendi manifestosunu kendi klasöründe tanımlıyor;
 * paylaşılan tek şey aşağıdaki üç liste ve düzenleyicinin gördüğü görünüm.
 */

/**
 * İzin verilen kırpma oranları.
 *
 * Sayılı liste, çünkü değer doğrudan `aspect-ratio`ya basılıyor ve küratör
 * paneli seçenekleri buradan çiziyor. Serbest metin, yuvanın tasarlandığı
 * kutuya sığmayan bir oran girilmesine izin verirdi.
 */
export const SLOT_RATIOS = [
  "21:9",
  "2:1",
  "16:9",
  "3:2",
  "4:3",
  "1:1",
  "4:5",
  /**
   * 2:3 — 28 Ağustos 2026'da eklendi.
   *
   * Bleach'in Espada portreleri 600×900 tasarlandı ve bu tam olarak 2:3;
   * listede karşılığı olmadığı için yuva tanımı derlenmiyordu. Yatay
   * karşılığı (`3:2`) zaten vardı, dikeyi eksikti — liste artık simetrik.
   */
  "2:3",
  "3:4",
  "9:16",
] as const;
export type SlotRatio = (typeof SLOT_RATIOS)[number];

/**
 * Görselin işlenme biçimi.
 *
 * `duotone` renklerini çizen bileşen veriyor (Bleach'te dünya paleti, Slam
 * Dunk'ta takım paleti); yuva kaydı RENK TAŞIMIYOR.
 */
export const SLOT_TREATMENTS = ["photo", "silhouette", "duotone"] as const;
export type SlotTreatment = (typeof SLOT_TREATMENTS)[number];

/** Ön yüzün çizebildiği karışım kipleri — backend DTO'suyla aynı liste. */
export const SLOT_BLENDS = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "soft-light",
  "hard-light",
  "luminosity",
] as const;
export type SlotBlend = (typeof SLOT_BLENDS)[number];

/**
 * Yuva tanımının İSTEMCİ ADASINA inen hâli.
 *
 * Tanımın tamamı geçmiyor: düzenleyici yalnızca etiketleri, izin verilen
 * oranları ve varsayılanları kullanıyor. İki dilli alanlar sunucuda TEK dile
 * indiriliyor — adaya sözlük göndermek gereksiz bayt olurdu.
 *
 * ⚠️ Bu tip iki evrenin ORTAK arayüzü: yeni bir evren düzenleyiciyi
 * kullanmak istiyorsa yuvasını bu şekle indirmek zorunda.
 */
export interface CuratedSlotView {
  id: string;
  label: string;
  hint: string;
  size: { w: number; h: number };
  /**
   * ⚠️ `readonly` DEĞİL. Düzenleyicinin kırpma sekmesi bu diziyi `string[]`
   * bekleyen bir alt bileşene geçiriyor; `readonly` yapmak orayı da
   * değiştirmeyi gerektirirdi ve dizi zaten her çizimde `[...slot.ratios]`
   * ile KOPYALANARAK üretiliyor — manifesto mutasyona açılmıyor.
   */
  ratios: SlotRatio[];
  defaultRatio: SlotRatio;
  defaultTreatment: SlotTreatment;
}
