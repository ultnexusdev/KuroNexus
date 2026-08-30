import type { Localized } from "./types";

/**
 * P06 · LANET ARŞİVİ — on mühürlü dosya.
 *
 * Bölümün tezi: lanetli ruhlar yaratılmaz, BIRAKILIR. Katalog karanlıkta
 * tutulur; ziyaretçi bir silüete dokununca dosya "açılır" ve tehdit
 * değerlendirmesi okunur hâle gelir. Açılmamış kayıt isimsizdir (???).
 *
 * `threat/intel/energy` 1–10 arası arşivci notu — canon bir ölçek değil,
 * bölümün kendi değerlendirme dili. Sınıf adlarındaki kanji parantezleri
 * ÇEVRİLMEZ (災害呪霊 vb.).
 */
export interface SpiritRecord {
  /** ÇEVRİLMEZ — kimlik de bu addan türetiliyor (yuva: `jjk:spirit:<slug>`) */
  slug: string;
  /** ÇEVRİLMEZ */
  name: string;
  /** ÇEVRİLMEZ — kanji */
  jp: string;
  cls: Localized;
  threat: number;
  intel: number;
  energy: number;
  note: Localized;
}

export const SPIRITS: readonly SpiritRecord[] = [
  {
    slug: "mahito",
    name: "Mahito",
    jp: "真人",
    cls: { tr: "Felaket Laneti (災害呪霊)", en: "Disaster Curse (災害呪霊)" },
    threat: 9,
    intel: 9,
    energy: 9,
    note: {
      tr: "Ruha doğrudan dokunur. İnsanı bir malzeme olarak gördüğü için değişim geçirmiş insanlar üretebiliyor.",
      en: "He touches the soul directly. Because he treats humans as material, he can manufacture transfigured people.",
    },
  },
  {
    slug: "jogo",
    name: "Jogo",
    jp: "漏瑚",
    cls: { tr: "Felaket Laneti (災害呪霊)", en: "Disaster Curse (災害呪霊)" },
    threat: 9,
    intel: 8,
    energy: 9,
    note: {
      tr: "Ateş ve ısı. Lanetlerin insanlığa duyduğu öfkeyi en saf biçimde taşıyan üye.",
      en: "Fire and heat. Of all the curses he carries their anger at humanity in its purest form.",
    },
  },
  {
    slug: "hanami",
    name: "Hanami",
    jp: "花御",
    cls: { tr: "Felaket Laneti (災害呪霊)", en: "Disaster Curse (災害呪霊)" },
    threat: 8,
    intel: 7,
    energy: 8,
    note: {
      tr: "Ormanların laneti. Yıkımı öfkeden değil, doğayı korumak istemesinden ötürü seçti.",
      en: "The curse of the forests. It chose destruction not out of anger but to protect nature.",
    },
  },
  {
    slug: "dagon",
    name: "Dagon",
    jp: "陀艮",
    cls: { tr: "Felaket Laneti (災害呪霊)", en: "Disaster Curse (災害呪霊)" },
    threat: 9,
    intel: 6,
    energy: 9,
    note: {
      tr: "Denizin korkusundan doğdu. Olgunlaşması Shibuya'da alanının içinde tamamlandı.",
      en: "Born from the fear of the sea. His maturation completed inside his own domain, in Shibuya.",
    },
  },
  {
    slug: "rika",
    name: "Rika Orimoto",
    jp: "折本里香",
    cls: {
      tr: "Özel Derece Kinci Ruh (特級過呪怨霊)",
      en: "Special Grade Vengeful Spirit (特級過呪怨霊)",
    },
    threat: 10,
    intel: 6,
    energy: 10,
    note: {
      tr: "Aşkın laneti. Bir kişiye bağlı olduğu sürece sınırsız enerjiye erişimi var.",
      en: "The curse of love. Bound to a single person, she has access to limitless energy.",
    },
  },
  {
    slug: "kurourushi",
    name: "Kurourushi",
    jp: "黒漆",
    cls: { tr: "Özel Derece Lanet (特級呪霊)", en: "Special Grade Curse (特級呪霊)" },
    threat: 9,
    intel: 8,
    energy: 9,
    note: {
      tr: "Böcek biçimli özel derece. Kıyım Oyunu'nda oyuncu olarak kayda geçti.",
      en: "A special grade in the shape of an insect. Entered the record as a player in the Culling Game.",
    },
  },
  {
    slug: "hosogami",
    name: "Hōsōgami",
    jp: "疱瘡神",
    cls: { tr: "Özel Derece Lanet (特級呪霊)", en: "Special Grade Curse (特級呪霊)" },
    threat: 8,
    intel: 7,
    energy: 8,
    note: {
      tr: "Salgın korkusunun laneti. Geto'nun envanterinin en ağır parçalarından biri.",
      en: "The curse of epidemic fear. One of the heaviest pieces in Geto's inventory.",
    },
  },
  {
    slug: "choso",
    name: "Choso",
    jp: "脹相",
    cls: {
      tr: "Lanetli Rahim — Ölüm Resmi (呪胎九相図)",
      en: "Cursed Womb: Death Painting (呪胎九相図)",
    },
    threat: 7,
    intel: 8,
    energy: 7,
    note: {
      tr: "Yarı insan yarı lanet. Kardeşlik bağını kan tekniğinden daha güçlü kullanıyor.",
      en: "Half human, half curse. He wields brotherhood harder than he wields blood.",
    },
  },
  {
    slug: "eso",
    name: "Eso",
    jp: "壊相",
    cls: {
      tr: "Lanetli Rahim — Ölüm Resmi (呪胎九相図)",
      en: "Cursed Womb: Death Painting (呪胎九相図)",
    },
    threat: 5,
    intel: 6,
    energy: 5,
    note: {
      tr: "Çürüme. Ölüm Resmi kardeşlerin ilk sahaya inen ikilisinden biri.",
      en: "Rot. One of the first pair of Death Painting brothers to take the field.",
    },
  },
  {
    slug: "kechizu",
    name: "Kechizu",
    jp: "血塗",
    cls: {
      tr: "Lanetli Rahim — Ölüm Resmi (呪胎九相図)",
      en: "Cursed Womb: Death Painting (呪胎九相図)",
    },
    threat: 5,
    intel: 4,
    energy: 5,
    note: {
      tr: "Kan teması ile çürüme yayar. Kardeşine bağımlı, tek başına eksik.",
      en: "Spreads rot through blood contact. Dependent on his brother — incomplete alone.",
    },
  },
];
