import type { DomainSlug, Localized } from "./types";

/**
 * P07 · ALAN GENİŞLEMESİ — dokuz alan.
 *
 * ── RENK BURADA DEĞİL ────────────────────────────────────────────────────
 * Her alanın tam paleti `globals.css` `[data-world="jjk"] [data-domain=…]`
 * bloklarında (kural 16: renk kararı tek dosyada). Bu dosya yalnızca
 * KAYIT verisi taşıyor: ad, kuran, derece, kesin isabet, anlatı.
 *
 * ── ÇEVİRİ SINIRI ────────────────────────────────────────────────────────
 * `jp` kanji ve `en` alan adı ("Malevolent Shrine") ÇEVRİLMEZ — ikisi de
 * özel ad. `grade`/`hit`/`body`/`tag` çevrilir.
 *
 * ⚠️ İki canon düzeltmesi mockup'a göre (30 Ağustos 2026, fandom'dan
 * doğrulandı — Bleach'in "kadro listesine güvenme" dersi):
 *   - Yuta'nın alanının kanjisi 真贋相愛 (mockup jenerik 領域展開 yazmıştı).
 *   - Dagon'un alanı 蕩蘊平線 (mockup 蕩窮蔵魂 yazmıştı).
 */
export interface DomainRecord {
  slug: DomainSlug;
  /** ÇEVRİLMEZ — kuranın adı */
  caster: string;
  /** ÇEVRİLMEZ — alanın kanjisi */
  jp: string;
  /** ÇEVRİLMEZ — alanın yerleşik İngilizce adı */
  en: string;
  grade: Localized;
  /** "Kesin isabet neyle geliyor" — tek kelimelik kayıt alanı */
  hit: Localized;
  body: Localized;
  /** Devralma ekranındaki tek satırlık kural özeti */
  tag: Localized;
  /** Devralma fonunda duran dev kanji — alanın ilk karakteri */
  glyph: string;
}

export const DOMAINS: readonly DomainRecord[] = [
  {
    slug: "gojo",
    caster: "Satoru Gojo",
    jp: "無量空処",
    en: "Unlimited Void",
    grade: { tr: "Özel Derece", en: "Special Grade" },
    hit: { tr: "sonsuz bilgi", en: "infinite information" },
    body: {
      tr: "Kurban, hiçbir eylemi tamamlayamadan tüm duyu girdisini sonsuz miktarda alır. Öldürmez; karar verme yeteneğini durdurur.",
      en: "The target receives infinite sensory input and can complete no action. It does not kill; it halts the ability to decide.",
    },
    tag: {
      tr: "sonsuz bilgi akışı — hiçbir eylem tamamlanamaz",
      en: "an infinite stream of information — no action can be completed",
    },
    glyph: "無",
  },
  {
    slug: "sukuna",
    caster: "Ryomen Sukuna",
    jp: "伏魔御廚子",
    en: "Malevolent Shrine",
    grade: { tr: "Özel Derece", en: "Special Grade" },
    hit: { tr: "kesme", en: "slashing" },
    body: {
      tr: "Duvarsız alan. Sınır yerine bir tapınak kurar ve menzilindeki her şeyi ayrım gözetmeksizin biçer. Bedelini çevre öder.",
      en: "A domain without walls. Instead of a barrier it raises a shrine, and everything in range is cut without distinction. The surroundings pay the price.",
    },
    tag: {
      tr: "duvarsız alan — menzildeki her şey biçilir",
      en: "a wall-less domain — everything in range is carved",
    },
    glyph: "伏",
  },
  {
    slug: "mahito",
    caster: "Mahito",
    jp: "自閉円頓裹",
    en: "Self-Embodiment of Perfection",
    grade: { tr: "Özel Derece", en: "Special Grade" },
    hit: { tr: "ruh dokunuşu", en: "a touch on the soul" },
    body: {
      tr: "İçindeki her varlığın ruhuna doğrudan temas eder. Beden, ruhun aldığı biçime uymak zorunda kalır.",
      en: "It touches the soul of every being inside directly. The body has no choice but to follow the shape the soul is given.",
    },
    tag: {
      tr: "ruha doğrudan temas — beden ruhun biçimini alır",
      en: "direct contact with the soul — the body takes its shape",
    },
    glyph: "自",
  },
  {
    slug: "jogo",
    caster: "Jogo",
    jp: "蓋棺鉄囲山",
    en: "Coffin of the Iron Mountain",
    grade: { tr: "Özel Derece", en: "Special Grade" },
    hit: { tr: "ısı", en: "heat" },
    body: {
      tr: "Alan bir volkanın içine dönüşür. Kaçış yok; sıcaklık tek başına bir infaz aracıdır.",
      en: "The domain becomes the inside of a volcano. There is no exit; the heat alone is an instrument of execution.",
    },
    tag: {
      tr: "kapalı volkan — ısı tek başına infaz aracı",
      en: "a sealed volcano — heat alone executes",
    },
    glyph: "蓋",
  },
  {
    slug: "dagon",
    caster: "Dagon",
    jp: "蕩蘊平線",
    en: "Horizon of the Captivating Skandha",
    grade: { tr: "Özel Derece", en: "Special Grade" },
    hit: { tr: "balık sürüsü", en: "a shoal of fish" },
    body: {
      tr: "Sonsuz bir kıyı. Suyun içinden gelen lanet balıkları alanın kuralı gereği hedefi bulur.",
      en: "An endless shore. The cursed fish that rise from the water find their target by the domain's own rule.",
    },
    tag: {
      tr: "sonsuz kıyı — sürü hedefi kuralla bulur",
      en: "an endless shore — the shoal finds you by rule",
    },
    glyph: "蕩",
  },
  {
    slug: "higuruma",
    caster: "Hiromi Higuruma",
    jp: "誅伏賜死",
    en: "Deadly Sentencing",
    grade: { tr: "1. Derece", en: "Grade 1" },
    hit: { tr: "mahkeme", en: "a courtroom" },
    body: {
      tr: "Bir duruşma salonu kurar. Suçluluk kabul edilirse ceza infaz edilir; savunma hakkı vardır ama yargıç alanın kendisidir.",
      en: "It raises a courtroom. If guilt is confirmed the sentence is carried out; there is a right to defence, but the judge is the domain itself.",
    },
    tag: {
      tr: "duruşma açıldı — savunma hakkı vardır",
      en: "court is in session — you may plead your case",
    },
    glyph: "誅",
  },
  {
    slug: "hakari",
    caster: "Kinji Hakari",
    jp: "坐殺博徒",
    en: "Idle Death Gamble",
    grade: { tr: "1. Derece", en: "Grade 1" },
    hit: { tr: "kural", en: "the rules" },
    body: {
      tr: "Alan bir kumar salonudur. Jackpot geldiğinde dört dakika boyunca sınırsız enerji ve anında ters lanet tekniği.",
      en: "The domain is a gambling parlour. When the jackpot hits: four minutes of limitless energy and instant reverse cursed technique.",
    },
    tag: {
      tr: "jackpot — dört dakika sınırsız enerji",
      en: "jackpot — four minutes of limitless energy",
    },
    glyph: "坐",
  },
  {
    slug: "megumi",
    caster: "Megumi Fushiguro",
    jp: "嵌合暗翳庭",
    en: "Chimera Shadow Garden",
    grade: { tr: "2. Derece", en: "Grade 2" },
    hit: { tr: "gölge", en: "shadow" },
    body: {
      tr: "Zemin sıvı gölgeye dönüşür. Kesin isabetten çok konum ve hazırlık üstünlüğü sağlar; eksik alan olarak kurulabilir.",
      en: "The ground turns to liquid shadow. It grants position and preparation rather than a sure-hit, and can be raised as an incomplete domain.",
    },
    tag: {
      tr: "zemin sıvı gölge — konum üstünlüğü",
      en: "the ground is liquid shadow — position is everything",
    },
    glyph: "嵌",
  },
  {
    slug: "yuta",
    caster: "Yuta Okkotsu",
    jp: "真贋相愛",
    en: "Authentic Mutual Love",
    grade: { tr: "Özel Derece", en: "Special Grade" },
    hit: { tr: "kopya arşivi", en: "an archive of copies" },
    body: {
      tr: "Kopyalanan tekniklerin üstüne kurulmuş alan. Yuta için alan bir güç gösterisi değil, ödünç alınan her şeyi aynı anda kullanma imkânıdır.",
      en: "A domain built on copied techniques. For Yuta it is not a show of force but the chance to wield everything he has borrowed at once.",
    },
    tag: {
      tr: "ödünç alınan her teknik aynı anda",
      en: "every borrowed technique, all at once",
    },
    glyph: "真",
  },
];

/** Kimlik → kayıt. Alan bölümü ve yuva manifestosu buradan okuyor. */
const BY_SLUG = new Map(DOMAINS.map((domain) => [domain.slug, domain]));

export function domainBySlug(slug: DomainSlug): DomainRecord {
  /* Dizi `DOMAIN_SLUGS`tan türedigi için her slug'ın kaydı var; `!` değil
     açık hata — kimlik kayarsa derlemede değil ilk çizimde net patlasın. */
  const record = BY_SLUG.get(slug);
  if (!record) throw new Error(`jjk: tanımsız alan kimliği "${slug}"`);
  return record;
}
