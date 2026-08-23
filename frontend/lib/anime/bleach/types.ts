/**
 * BLEACH EVRENİ — TİP SÖZLEŞMESİ.
 *
 * ── NEDEN KENDİ KLASÖRÜ ──────────────────────────────────────────────────
 * Naruto Evreni verisi `lib/anime/naruto/` altında konu başına bir dosya
 * (`geography`, `history`, `people`, `power`). Bleach 18 bölüm, 13 bölük,
 * 26 Sternritter ve 10 Espada taşıyacak; futbol defterinde öğrenilen ders
 * burada da geçerli (`lib/sport/players/types.ts` başlığı): tek dosya hem
 * okunamaz hâle gelir hem de paralel worktree'lerde aynı satır aralığına
 * düşen iki ajan birbirini kilitler.
 *
 * ── İKİ DİL, TEK KAYIT ───────────────────────────────────────────────────
 * Kullanıcı kararı (23 Ağustos 2026): Bleach sayfası GERÇEKTEN İngilizce
 * açılacak. Naruto Evreni sayfası Türkçe gömülü ve `/en/anime/naruto` bugün
 * Türkçe çiziliyor — bu tekrarlanmayacak.
 *
 * Bölüşüm:
 *   `Localized<string>`  → çevrilen her şey (bio, açıklama, anlatı)
 *   düz `string`         → ÇEVRİLMEYEN özel adlar: kanji, romaji, Zanpakutō
 *                          adı, Schrift harfi, Resurrección adı
 *
 * Arayüz etiketleri (düğme, başlık, küratör paneli) buraya DEĞİL
 * `messages/*.json` içine yazılır — kayıt verisi ile arayüz sözlüğü
 * karışmasın.
 */

/** İki dilli metin. Çeviri gelmediyse `en` boş bırakılabilir; UI `tr`ye düşer. */
export interface Localized<T = string> {
  tr: T;
  en?: T;
}

/**
 * Kaydın dilini seç. `en` boşsa `tr` dönüyor — yarım çeviri sayfayı
 * boşaltmasın (arşivin yerleşik "kaynak düşerse sayfa ayakta kalır" kuralı).
 */
export function pick<T>(value: Localized<T>, locale: string): T {
  return locale === "en" && value.en !== undefined ? value.en : value.tr;
}

/**
 * Beş dünya + cehennem.
 *
 * `hell` bugün hiçbir bölümde kullanılmıyor ama şemada duruyor: canon'da var
 * ve sayfanın "arşivci" kimliği bilmediğini değil, göstermediğini söylüyor.
 */
export type BleachWorld =
  | "living"
  | "soul-society"
  | "hueco-mundo"
  | "wandenreich"
  | "royal"
  | "hell";

/** Dünyaya bağlı olmayan bölümler için */
export type BleachSlotWorld = BleachWorld | "neutral";
