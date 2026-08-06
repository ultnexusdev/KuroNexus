/**
 * Karakter katmanı — AniList künyesinin ÜSTÜNE binen yazılı içerik.
 *
 * Neden veritabanı değil kod: her karakter sayfası kendi başına tasarlanıyor
 * (Bleach'te Zanpakutō, Naruto'da jutsu, My Hero'da quirk — aynı kutu değil).
 * Esnek bölüm tiplerini bir yönetim formuna sığdırmak, tasarım özgürlüğünü
 * forma feda etmek olurdu. Kullanıcı kararı, 6 Ağustos 2026.
 *
 * Bölümlerin hepsi opsiyonel: veri yoksa bölüm hiç çizilmiyor. Bir karakterin
 * yalnızca replikleri varsa sayfa yalnızca replikleri gösterir.
 *
 * ⚠️ Metinler iki dilli (AGENTS.md kural 1). Yeni bir alan eklerken `string`
 * değil `LocalizedText` kullan — tek dilli bir alan İngilizce sayfada Türkçe
 * görünür ve bunu fark etmek zordur.
 */

export interface LocalizedText {
  tr: string;
  en: string;
}

/** Künye tablosunun elle yazılmış satırı (AniList'in vermediği bilgiler). */
export interface CharacterFact {
  label: LocalizedText;
  value: LocalizedText;
}

/** Güç profili çubuğu. `max` sabit 10 değil: bazı karakterlerde 5'lik ölçek daha dürüst. */
export interface CharacterStat {
  label: LocalizedText;
  value: number;
  max: number;
}

/**
 * Yetenek kartı. Başlık bölümün kendisinde (`abilities.title`) çünkü seriye
 * göre değişiyor: "Zanpakutō", "Jutsu", "Quirk", "Nen"…
 */
export interface CharacterAbility {
  /** "Shikai — Nozarashi" gibi; çeviri gerektirmeyen özel ad */
  name: string;
  /** Serbest bırakma komutu / tetikleyici söz */
  release?: LocalizedText;
  summary: LocalizedText;
  traits: LocalizedText[];
}

export type BattleOutcome = "WIN" | "DRAW" | "LOSS" | "UNRESOLVED";

export interface CharacterBattle {
  opponent: string;
  /** Hangi ark/sezon */
  arc: LocalizedText;
  outcome: BattleOutcome;
  /** Arşivdeki karakterlerden biriyse sayfasına bağlanır */
  opponentCharacterId?: number;
}

export interface CharacterQuote {
  text: LocalizedText;
  /** Nerede söylendiği — biliniyorsa */
  source?: LocalizedText;
}

/** İlişki. `characterId` verilirse kart o karakterin sayfasına açılır. */
export interface CharacterBond {
  name: string;
  characterId?: number;
  summary: LocalizedText;
}

/** İzleme/okuma rehberinin bir satırı. */
export interface CharacterGuideEntry {
  /** "Bölüm 20–21", "TYBW" gibi aralık işareti */
  range: LocalizedText;
  note: LocalizedText;
}

/**
 * Galeri görseli.
 *
 * `src` ya kendi sunucumuzdaki bir yol (`/uploads/…`) ya da tam adres.
 * Yükleme akışı: kürator modunda sayfadaki yükleme kutusundan görsel
 * gönderilir, dönen adres kopyalanıp bu dosyaya yazılır. Veritabanı
 * kullanılmadığı için adres kodda duruyor — bilinçli tercih, bkz. dosya başı.
 */
export interface CharacterGalleryImage {
  src: string;
  alt: LocalizedText;
  caption?: LocalizedText;
}

export interface CharacterOverlay {
  /** AniList karakter numarası — künyeyle bu alan üzerinden eşleşiyor */
  characterId: number;
  /** Kapak portresi. AniList'in `large`ı en fazla ~230px; elle yüklenen görsel bunu ezer. */
  portrait?: string;
  /** Sayfanın üstündeki geniş görsel */
  banner?: string;
  /** Hero'daki büyük alıntı */
  epigraph?: LocalizedText;
  /** Hero'daki küçük etiketler ("Shinigami", "11. Bölük Kaptanı") */
  tags?: LocalizedText[];
  /** Künye tablosuna eklenen satırlar; AniList'ten gelenlerin ARDINA gelir */
  facts?: CharacterFact[];
  /** "Hakkında" paragrafları */
  about?: LocalizedText[];
  stats?: { title: LocalizedText; rows: CharacterStat[] };
  abilities?: { title: LocalizedText; cards: CharacterAbility[] };
  battles?: CharacterBattle[];
  quotes?: CharacterQuote[];
  gallery?: CharacterGalleryImage[];
  guide?: {
    anime?: CharacterGuideEntry[];
    manga?: CharacterGuideEntry[];
  };
  bonds?: CharacterBond[];
}

/** Sayfa dilini seçer. Bilinmeyen dil Türkçeye düşer (sitenin ana dili). */
export function pick(text: LocalizedText, locale: string): string {
  return locale === "en" ? text.en : text.tr;
}
