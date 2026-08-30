/**
 * JUJUTSU KAISEN EVRENİ — TİP SÖZLEŞMESİ.
 *
 * ── NEDEN KENDİ KLASÖRÜ ──────────────────────────────────────────────────
 * Bleach deseninin aynısı (`lib/anime/bleach/types.ts` başlığı): on bir
 * bölüm, 27 kişilik kadro, 20 parmak ve 9 alan tek dosyada okunmaz olur;
 * paralel oturumlar aynı satır aralığına düşmesin diye konu başına dosya.
 *
 * ── İKİ DİL, TEK KAYIT ───────────────────────────────────────────────────
 * Sayfa GERÇEKTEN İngilizce açılacak (Bleach kuralı):
 *   `Localized<string>`  → çevrilen her şey (anlatı, not, durum)
 *   düz `string`         → ÇEVRİLMEYEN özel adlar: kanji, romaji, kişi adı,
 *                          alan adı (Malevolent Shrine), teknik özel adları
 *
 * Arayüz etiketleri (düğme, başlık, ray) buraya DEĞİL `messages/*.json`
 * içine — kayıt verisi ile arayüz sözlüğü karışmasın.
 *
 * ⚠️ Bleach'ten import ETMİYORUZ: iki evren birbirinin iç tipine bağlanırsa
 * birinde yapılan şema değişikliği öbür sayfayı sessizce kırar. `Localized`
 * ve `pick` bilinçli kopya.
 */

/** İki dilli metin. `en` boşsa UI `tr`ye düşer — yarım çeviri sayfayı boşaltmasın. */
export interface Localized<T = string> {
  tr: T;
  en?: T;
}

/** Kaydın dilini seç. `en` yoksa `tr` döner. */
export function pick<T>(value: Localized<T>, locale: string): T {
  return locale === "en" && value.en !== undefined ? value.en : value.tr;
}

/**
 * Sayfa içi RENK BÖLGELERİ. Arşivin tabanı mürekkep + kızıl; üç bölüm kendi
 * sesini taşıyor: Lanetli Enerji (mor — lanet enerjisinin klasik rengi),
 * Lanet Arşivi (bataklık yeşili — lanetin organik tarafı), Kıyım Oyunu
 * (soğuk mavi — kolonilerin bariyer haritası). Token blokları `globals.css`
 * `[data-world="jjk"]` altında (kural 16).
 */
export const JJK_ZONES = ["energy", "spirits", "culling"] as const;
export type JjkZone = (typeof JJK_ZONES)[number];

/**
 * Dokuz alanın KARARLI kimlikleri. Küratör yuvaları (`jjk:domain:<slug>`),
 * globals.css `[data-domain]` palet blokları ve alan bölümünün durumu aynı
 * diziden okunuyor — üç kopya tutulsaydı biri kayardı (Bleach'in Bankai
 * niş dersi: `slots.ts` başlığındaki kimlik kayması olayı).
 */
export const DOMAIN_SLUGS = [
  "gojo",
  "sukuna",
  "mahito",
  "jogo",
  "dagon",
  "higuruma",
  "hakari",
  "megumi",
  "yuta",
] as const;
export type DomainSlug = (typeof DOMAIN_SLUGS)[number];
