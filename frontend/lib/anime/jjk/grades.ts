import type { Localized } from "./types";

/**
 * P05 · DERECE DUVARI — resmî kayıt ↔ gerçek tehdit.
 *
 * Bölümün tezi: derecelendirme bir ölçüm değil, İDARİ bir karar. Aynı isim
 * iki listede farklı basamakta durabiliyor ve fark kırmızıyla işaretli.
 * "Gerçek tehdit" sütunu bir güç sıralaması değil, arşivcinin saha
 * gözlemi — kaynağı hikâyenin kendisi (Maki'nin Zenin baskını, Yuji'nin
 * Shibuya'sı), sayısal bir güç ölçüsü değil.
 *
 * ⚠️ Kanji anahtarları (特級, 1級…) ÇEVRİLMEZ ve iki listeyi birbirine
 * bağlayan kimliklerdir; ad listesi `official`/`real` alanlarıyla bu
 * anahtarlara işaret eder. Anahtar kayarsa isim duvardan sessizce düşer —
 * `check-jjk-grades` denetimi tam bunu tarıyor.
 */
export interface GradeTier {
  /** ÇEVRİLMEZ — kayıt anahtarı */
  key: string;
  name: Localized;
}

export const GRADE_TIERS: readonly GradeTier[] = [
  { key: "特級", name: { tr: "Özel Derece", en: "Special Grade" } },
  { key: "1級", name: { tr: "1. Derece", en: "Grade 1" } },
  { key: "準1級", name: { tr: "Yarı 1. Derece", en: "Semi-Grade 1" } },
  { key: "2級", name: { tr: "2. Derece", en: "Grade 2" } },
  { key: "3級", name: { tr: "3. Derece", en: "Grade 3" } },
  { key: "4級", name: { tr: "4. Derece", en: "Grade 4" } },
];

export interface GradeEntry {
  /** ÇEVRİLMEZ */
  name: string;
  /** Resmî kayıt — `GRADE_TIERS.key` değerlerinden biri */
  official: string;
  /** Sahada gözlenen tehdit — aynı anahtar uzayı */
  real: string;
  /** Karakter sayfası köprüsü (AniList) — varsa isim bağlantıya dönüşür */
  characterId?: number;
}

export const GRADE_ROSTER: readonly GradeEntry[] = [
  { name: "Satoru Gojo", official: "特級", real: "特級", characterId: 127691 },
  { name: "Yuta Okkotsu", official: "特級", real: "特級" },
  { name: "Yuki Tsukumo", official: "特級", real: "特級" },
  { name: "Suguru Geto", official: "特級", real: "特級" },
  { name: "Kento Nanami", official: "1級", real: "1級" },
  { name: "Aoi Todo", official: "1級", real: "1級" },
  { name: "Hiromi Higuruma", official: "1級", real: "特級" },
  { name: "Kinji Hakari", official: "1級", real: "特級" },
  { name: "Atsuya Kusakabe", official: "1級", real: "1級" },
  { name: "Noritoshi Kamo", official: "準1級", real: "1級" },
  { name: "Kokichi Muta", official: "準1級", real: "1級" },
  { name: "Utahime Iori", official: "準1級", real: "準1級" },
  { name: "Megumi Fushiguro", official: "2級", real: "1級" },
  { name: "Panda", official: "2級", real: "1級" },
  { name: "Toge Inumaki", official: "2級", real: "1級" },
  { name: "Nobara Kugisaki", official: "3級", real: "2級" },
  { name: "Kasumi Miwa", official: "3級", real: "3級" },
  { name: "Momo Nishimiya", official: "3級", real: "3級" },
  { name: "Maki Zenin", official: "4級", real: "特級" },
  { name: "Yuji Itadori", official: "4級", real: "特級" },
  { name: "Kiyotaka Ijichi", official: "4級", real: "4級" },
];
