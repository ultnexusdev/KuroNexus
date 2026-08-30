import type { Localized } from "./types";

/**
 * P08 · ARKETİPLER — isim değil, işlev.
 *
 * Bölümün tezi: hikâyede kimse kendi seçtiği rolü oynamıyor; rolü ona bir
 * miras, bir beden ya da bir plan veriyor. Liste bu yüzden "en güçlüler
 * sıralaması" değil, yedi işlevin dizini.
 *
 * `role` çevriliyor; `jp` rol kanjisi ve kişi/alan adları çevrilmiyor.
 */
export interface Archetype {
  /** ÇEVRİLMEZ — yuva kimliği bundan türetiliyor (`jjk:arche:<slug>`) */
  slug: string;
  role: Localized;
  /** ÇEVRİLMEZ — rolün kanjisi */
  jp: string;
  /** ÇEVRİLMEZ */
  name: string;
  tech: Localized;
  /** ÇEVRİLMEZ — alan adı; yoksa "—" */
  domain: string;
  affiliation: Localized;
  /** Tanımlayıcı karşılaşma — özel adlar çevrilmez */
  fight: Localized;
  arc: Localized;
  line: Localized;
  /** Karakter sayfası köprüsü (AniList) */
  characterId?: number;
}

export const ARCHETYPES: readonly Archetype[] = [
  {
    slug: "vessel",
    role: { tr: "KAP", en: "THE VESSEL" },
    jp: "器",
    name: "Yuji Itadori",
    tech: { tr: "Sukuna'nın kabı", en: "Sukuna's vessel" },
    domain: "—",
    affiliation: { tr: "Tokyo Jujutsu Lisesi", en: "Tokyo Jujutsu High" },
    fight: { tr: "Mahito", en: "Mahito" },
    arc: { tr: "Shibuya Olayı", en: "The Shibuya Incident" },
    line: {
      tr: "Doğru ölümü sağlamak isteyen çocuk, kendisi ölümün taşıyıcısı oldu.",
      en: "The boy who wanted to grant proper deaths became death's own carrier.",
    },
  },
  {
    slug: "strongest",
    role: { tr: "EN GÜÇLÜ", en: "THE STRONGEST" },
    jp: "最強",
    name: "Satoru Gojo",
    tech: { tr: "Sınırsızlık / Altı Göz", en: "Limitless / Six Eyes" },
    domain: "Unlimited Void",
    affiliation: { tr: "Tokyo Jujutsu Lisesi", en: "Tokyo Jujutsu High" },
    fight: { tr: "Ryomen Sukuna", en: "Ryomen Sukuna" },
    arc: { tr: "Shinjuku Hesaplaşması", en: "The Shinjuku Showdown" },
    line: {
      tr: "Tek başına dengeyi tutan adam. Mühürlendiğinde denge de mühürlendi.",
      en: "The man who held the balance alone. When he was sealed, so was the balance.",
    },
    characterId: 127691,
  },
  {
    slug: "king",
    role: { tr: "KRAL", en: "THE KING" },
    jp: "呪いの王",
    name: "Ryomen Sukuna",
    tech: { tr: "Ayır / Böl / Fırın", en: "Dismantle / Cleave / Furnace" },
    domain: "Malevolent Shrine",
    affiliation: { tr: "yok", en: "none" },
    fight: { tr: "Satoru Gojo", en: "Satoru Gojo" },
    arc: { tr: "Shinjuku Hesaplaşması", en: "The Shinjuku Showdown" },
    line: {
      tr: "Bin yıl önce yakılamadı; yirmi parçada beklemeyi seçti.",
      en: "A thousand years ago he could not be burned; he chose to wait in twenty pieces.",
    },
  },
  {
    slug: "shadow",
    role: { tr: "GÖLGE", en: "THE SHADOW" },
    jp: "影",
    name: "Megumi Fushiguro",
    tech: { tr: "On Gölge Tekniği", en: "Ten Shadows Technique" },
    domain: "Chimera Shadow Garden",
    affiliation: { tr: "Tokyo Jujutsu Lisesi", en: "Tokyo Jujutsu High" },
    fight: { tr: "Mahoraga çağrısı", en: "summoning Mahoraga" },
    arc: { tr: "Shibuya Olayı", en: "The Shibuya Incident" },
    line: {
      tr: "Kendi değerini hep başkalarının kurtarılmasıyla ölçtü. Bedeli buydu.",
      en: "He always measured his worth in other people's rescues. That was the price.",
    },
  },
  {
    slug: "copy",
    role: { tr: "KOPYA", en: "THE COPY" },
    jp: "模倣",
    name: "Yuta Okkotsu",
    tech: { tr: "teknik kopyalama", en: "technique copying" },
    domain: "Authentic Mutual Love",
    affiliation: { tr: "Tokyo Jujutsu Lisesi", en: "Tokyo Jujutsu High" },
    fight: { tr: "Ryomen Sukuna", en: "Ryomen Sukuna" },
    arc: { tr: "Shinjuku Hesaplaşması", en: "The Shinjuku Showdown" },
    line: {
      tr: "Ödünç aldığı her teknikle Gojo'nun bıraktığı boşluğu doldurmayı denedi.",
      en: "With every borrowed technique he tried to fill the space Gojo left.",
    },
  },
  {
    slug: "body",
    role: { tr: "BEDEN", en: "THE BODY" },
    jp: "肉体",
    name: "Maki Zenin",
    tech: { tr: "Göksel Kısıtlama", en: "Heavenly Restriction" },
    domain: "—",
    affiliation: { tr: "Tokyo Jujutsu Lisesi", en: "Tokyo Jujutsu High" },
    fight: { tr: "Zenin ailesi", en: "the Zenin clan" },
    arc: { tr: "Kusursuz Hazırlık", en: "Perfect Preparation" },
    line: {
      tr: "Lanetli enerjisiz doğdu. Aileyi tek başına silmesi için yeterliydi.",
      en: "Born without cursed energy — which proved enough to erase the clan alone.",
    },
  },
  {
    slug: "brain",
    role: { tr: "BEYİN", en: "THE BRAIN" },
    jp: "脳",
    name: "Kenjaku",
    tech: { tr: "beden değiştirme", en: "body hopping" },
    domain: "—",
    affiliation: { tr: "yok", en: "none" },
    fight: { tr: "Yuki Tsukumo", en: "Yuki Tsukumo" },
    arc: { tr: "Kıyım Oyunu", en: "The Culling Game" },
    line: {
      tr: "Bin yıllık plan. Shibuya bir savaş değil, tek bir hamlenin uygulanmasıydı.",
      en: "A thousand-year plan. Shibuya was not a war — it was one move, executed.",
    },
  },
];
