/**
 * SLAM DUNK EVRENİ — TİP SÖZLEŞMESİ.
 *
 * ── NEDEN BLEACH'İN TİPLERİ ALINMADI ─────────────────────────────────────
 * `Localized` ve `pick` iki dosyada da aynı üç satır; ama Bleach'in tip
 * dosyası `BleachWorld` gibi o evrene ait bir alan sözlüğü de taşıyor ve
 * import etmek Slam Dunk'ı o sözlüğe bağlardı. Kullanıcı kararı
 * (28 Ağustos 2026): **Slam Dunk Bleach'in tasarım dilini paylaşmıyor.**
 * Paylaşılan tek şey küratör ALTYAPISI (`lib/curated/`), veri şekli değil.
 *
 * ── İKİ DİL, TEK KAYIT ───────────────────────────────────────────────────
 *   `Localized<string>` → çevrilen her şey (bio, oynayış notu, anlatı)
 *   düz `string`        → ÇEVRİLMEYEN özel adlar: kanji, okul adı, lakap
 *
 * Arayüz etiketleri (düğme, sekme, başlık) buraya DEĞİL `messages/*.json`
 * içine yazılır.
 */

/** İki dilli metin. `en` boşsa UI `tr`ye düşer — yarım çeviri sayfayı boşaltmasın. */
export interface Localized<T = string> {
  tr: T;
  en?: T;
}

/** Kaydın dilini seç. */
export function pick<T>(value: Localized<T>, locale: string): T {
  return locale === "en" && value.en !== undefined ? value.en : value.tr;
}

/**
 * Sayfada yeri olan beş takım.
 *
 * Kanagawa'nın dört gücü + Sannoh (Akita). Beşi de Shohoku'nun sahada
 * karşılaştığı takımlar; sayfanın "Rakip Seçici"si bu listeden besleniyor.
 */
export const TEAM_IDS = [
  "shohoku",
  "ryonan",
  "kainan",
  "shoyo",
  "sannoh",
] as const;
export type TeamId = (typeof TEAM_IDS)[number];

/**
 * Basketbol mevkileri — kısaltma KODU, çevrilmez.
 *
 * Uzun karşılığı sözlükten geliyor (`slamDunk.positions.<kod>`): "PG" iki
 * dilde de PG, ama "Oyun Kurucu" / "Point Guard" ayrışıyor.
 */
export const POSITIONS = ["PG", "SG", "SF", "PF", "C"] as const;
export type Position = (typeof POSITIONS)[number];

/**
 * Kadro kaydının rolü.
 *
 * `player` dışındakiler stat barı ÇİZMİYOR — bir koçu şut yüzdesiyle
 * puanlamak veriyi uydurmak olurdu. Kart tipi role göre değişiyor.
 */
export type RosterRole = "player" | "coach" | "manager";

/**
 * DÖRT BAR — kullanıcı şartı (28 Ağustos 2026).
 *
 * ⚠️ Bu sayılar CANON DEĞİL. Slam Dunk'ın hiçbir resmî kaynağı oyuncuları
 * sayısal olarak derecelendirmiyor; buradaki 0-100 değerler fandom
 * künyelerindeki "Abilities/Strengths/Weakness" bölümlerinden ve maç
 * anlatılarından ÇIKARILMIŞ arşiv değerlendirmesidir. Arayüz bunu
 * gizlemiyor: bar bloğunun altında kaynak notu basılıyor
 * (`slamDunk.stats.disclaimer`).
 *
 * Ölçek çapası — okunabilir kalsın diye sabit:
 *   95+  serinin en iyisi (Sawakita'nın hücumu, Sakuragi'nin ribaundu)
 *   85+  ulusal seviye
 *   70+  bölge seviyesinde güçlü
 *   50+  ilk beş oynayabilir
 *   -50  belirgin zayıflık (Fukuda'nın savunması)
 */
export interface Stats {
  /** Şut — mesafe, isabet, baskı altında bozulmama */
  shooting: number;
  /** Savunma — birebir tutma, top çalma, blok, savunma zekâsı */
  defense: number;
  /** Ribaunt — sıçrama, konumlanma, ikinci şans topları */
  rebounding: number;
  /** Hız — ilk adım, geçiş hücumu, sahayı boydan boya koşma */
  speed: number;
}

/** Stat barlarının çizim sırası — tek doğruluk kaynağı. */
export const STAT_KEYS = [
  "shooting",
  "defense",
  "rebounding",
  "speed",
] as const;
export type StatKey = (typeof STAT_KEYS)[number];

/**
 * Kadro kaydı.
 *
 * ⚠️ `null` GEÇERLİ BİR DEĞER. Fandom künyesinde boy/kilo yoksa uydurulmuyor;
 * arayüz o satırı "kayıt yok" olarak çiziyor. Shohoku'nun yedek sınıfında ve
 * Kainan'ın bir oyuncusunda gerçekten yok.
 */
export interface RosterMember {
  /** Kararlı kimlik — küratör yuvası (`slam-dunk:player:<id>`) buna bağlı. ⚠️ Değiştirme. */
  id: string;
  /** Latin harfli ad — ÇEVRİLMEZ */
  name: string;
  /** Kanji — ÇEVRİLMEZ. Kaynak: ja.wikipedia "SLAM DUNKの登場人物" */
  kanji: string;
  team: TeamId;
  role: RosterRole;
  /** Forma numarası. Koç ve menajerde `null`. */
  number: number | null;
  /** Mevki. `player` dışında `null`. */
  position: Position | null;
  /** Santimetre. Kaynakta yoksa `null`. */
  height: number | null;
  /** Kilogram. Kaynakta yoksa `null`. */
  weight: number | null;
  /** Sınıf (1-3). Koçlarda `null`. */
  year: number | null;
  /** Lakap — ÇEVRİLİYOR: "Ribaunt Kralı" / "King of Rebounds" anlam taşıyor. */
  epithet: Localized | null;
  /** Bir cümlelik oynayış notu. Fandom'daki Abilities bölümünden. */
  note: Localized;
  /** `player` ise dolu, değilse `null`. */
  stats: Stats | null;
  /** Kadronun ilk beşinde mi — sayfanın "sahne" kartlarını bu seçiyor. */
  starter?: boolean;
}
