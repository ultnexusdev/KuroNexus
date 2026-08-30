/**
 * SAYFA İÇİ ÇAPALARIN TEK DEFTERİ — Bleach'in `anchors.ts` deseninin aynısı.
 *
 * Üç yeri birden besliyor ve üçü de AYNI sırayı görmek zorunda:
 *   1. "Bölümlere atla" listesi (`SectionNav`)
 *   2. JSON-LD `ItemList` (`JjkJsonLd`)
 *   3. `scripts/check-jjk-anchors.mjs` — her çapanın gerçekten var olduğu
 *
 * Kanji rayı (`KanjiRail`) da bu defteri okuyor: raydaki on bir sekme,
 * atla listesi ve arama motorunun gördüğü yapı tek kaynaktan çıkıyor.
 *
 * ⚠️ ÖLÜ ÇAPA YASAK. Bir bölümün `id`si değişirse `npm run check:jjk`
 * kırmızı yanar. `#` yok — bağlantıyı kuran taraf ekliyor.
 */

export interface JjkAnchor {
  /** Sayfadaki gerçek `id` */
  anchor: string;
  /** `anime.jjk.toc` altındaki etiket anahtarı */
  key: string;
  /** Kanji rayındaki işaret — ÇEVRİLMEZ */
  kanji: string;
}

/** SAYFA SIRASI. Değişirse `page.tsx` çizim sırası da değişmeli. */
export const JJK_ANCHORS: readonly JjkAnchor[] = [
  { anchor: "veil", key: "veil", kanji: "帳" },
  { anchor: "energy", key: "energy", kanji: "呪力" },
  { anchor: "society", key: "society", kanji: "高専" },
  { anchor: "grades", key: "grades", kanji: "六眼" },
  { anchor: "spirits", key: "spirits", kanji: "呪霊" },
  { anchor: "domain", key: "domain", kanji: "領域" },
  { anchor: "archetypes", key: "archetypes", kanji: "最強" },
  { anchor: "fingers", key: "fingers", kanji: "指" },
  { anchor: "shibuya", key: "shibuya", kanji: "渋谷" },
  { anchor: "culling", key: "culling", kanji: "死滅" },
  { anchor: "finale", key: "finale", kanji: "記録" },
];
