import type { LocalizedText } from "./types";

/**
 * Kakashi Hatake — "Kopya Kütüğü" deneyim sayfasının veri iskeleti.
 *
 * Itachi emsalinin kardeşi: karaktere ait BÜTÜN anlatı burada, iki dilli
 * `LocalizedText` çiftleri hâlinde (kural 1). Görseller veritabanında
 * (`CharacterImage`, characterId 85, ABILITY yuvası `kakashi:*`).
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * Kakashi'nin dosyası bir arşiv kartoteksi gibi kuruluyor: ince çizgili
 * fişler, damga izleri, çekmece etiketleri. Sıcaklık yok, düzen var —
 * "bin jutsu'yu kopyalayan adamın dosya dolabı".
 *
 * Kütüğün kendi dürüstlüğü tasarımın parçası: bin kopyanın çoğu hiçbir
 * yerde kayıtlı değil. Her çekmece bu yüzden bir BOŞ FİŞ ile kapanıyor
 * (`kind: "kayip"`) — eksikliği gizlemek yerine ölçüsünü yazmak, arşivin
 * kendi sesi.
 *
 * ⚠️ Replik disiplini: yalnızca kanona güvendiğimiz sözler yazıldı.
 * Emin olunmayan cümle fişe geçmedi; kaynağı belirsiz teknikte kaynak
 * satırı "boş" diye işaretlendi (uydurma kaynak yazmak yerine).
 */

export const KAKASHI_ID = 85;

/** Sergi görselleri — hepsi characterId 85 kaydında ABILITY yuvasında. */
export const KAKASHI_IMAGE_KEYS = {
  /** Hero bandı: Kamui girdabının altında maskeli portre (21:9 civarı) */
  hero: "kakashi:hero",
  chidori: "kakashi:chidori",
  kamui: "kakashi:kamui",
  ninken: "kakashi:ninken",
  suiryudan: "kakashi:suiryudan",
  doryuheki: "kakashi:doryuheki",
  kageBunshin: "kakashi:kage-bunshin",
  ichaIcha: "kakashi:icha-icha",
  eraSakumo: "kakashi:era-sakumo",
  eraKannabi: "kakashi:era-kannabi",
  eraAnbu: "kakashi:era-anbu",
  eraTeam7: "kakashi:era-team7",
  eraHokage: "kakashi:era-hokage",
} as const;

/** Kürator yuvalarının etiketleri — yükleme kutusunda ne beklendiğini söyler. */
export const KAKASHI_SLOT_LABELS: Record<string, LocalizedText> = {
  [KAKASHI_IMAGE_KEYS.hero]: {
    tr: "Hero bandı — Kamui girdabının altında maskeli portre (geniş kadraj)",
    en: "Hero band — masked portrait beneath the Kamui vortex (wide crop)",
  },
  [KAKASHI_IMAGE_KEYS.chidori]: {
    tr: "Chidori / Raikiri — elde toplanan yıldırım",
    en: "Chidori / Raikiri — lightning gathered in the hand",
  },
  [KAKASHI_IMAGE_KEYS.kamui]: {
    tr: "Kamui — Mangekyō'nun açtığı girdap",
    en: "Kamui — the vortex the Mangekyō opens",
  },
  [KAKASHI_IMAGE_KEYS.ninken]: {
    tr: "Kuchiyose: Ninken — Pakkun ve sekiz köpek",
    en: "Kuchiyose: Ninken — Pakkun and the eight hounds",
  },
  [KAKASHI_IMAGE_KEYS.suiryudan]: {
    tr: "Suiton: Suiryūdan — yükselen su ejderi",
    en: "Suiton: Suiryūdan — the rising water dragon",
  },
  [KAKASHI_IMAGE_KEYS.doryuheki]: {
    tr: "Doton: Doryūheki — çamurdan duvar",
    en: "Doton: Doryūheki — the mud wall",
  },
  [KAKASHI_IMAGE_KEYS.kageBunshin]: {
    tr: "Kage Bunshin — bölünen beden",
    en: "Kage Bunshin — the divided body",
  },
  [KAKASHI_IMAGE_KEYS.ichaIcha]: {
    tr: "Icha Icha Paradise — kütüğe kaçak giren kitap",
    en: "Icha Icha Paradise — the book that slipped into the ledger",
  },
  [KAKASHI_IMAGE_KEYS.eraSakumo]: {
    tr: "Dönem — Beyaz Diş'in gölgesi",
    en: "Era — the White Fang's shadow",
  },
  [KAKASHI_IMAGE_KEYS.eraKannabi]: {
    tr: "Dönem — Kannabi Köprüsü, Obito'nun gözü",
    en: "Era — Kannabi Bridge, Obito's eye",
  },
  [KAKASHI_IMAGE_KEYS.eraAnbu]: {
    tr: "Dönem — ANBU yılları, kurt maskesi",
    en: "Era — the ANBU years, the wolf mask",
  },
  [KAKASHI_IMAGE_KEYS.eraTeam7]: {
    tr: "Dönem — Takım 7'nin ustası",
    en: "Era — the master of Team 7",
  },
  [KAKASHI_IMAGE_KEYS.eraHokage]: {
    tr: "Dönem — Altıncı Hokage",
    en: "Era — the Sixth Hokage",
  },
};

/* ── Hero ve kütük künyesi ──────────────────────────────────────────── */

export const KAKASHI_HERO = {
  name: "Kakashi Hatake",
  nativeName: "はたけカカシ",
  /** Filigran — dikey yazılan lakap, `aria-hidden` çizilir */
  watermark: "写輪眼のカカシ",
  /** Kütük numarası AniList kimliğinin kendisi: arşivin gerçek dosya no'su */
  fileNo: "085",
  fileLabel: { tr: "Kütük no.", en: "Ledger no." },
  epigraph: {
    tr: "Bin tekniği kopyaladı. Kendi adına yazdığı fiş iki tane.",
    en: "He copied a thousand techniques. Two cards in this ledger carry his own name.",
  },
  /** Portrenin yanındaki dosya sırtı — lakaplar AniList künyesinden */
  aliases: [
    { tr: "Kopya Ninja", en: "The Copy Ninja" },
    { tr: "Sharingan'ın Kakashi'si", en: "Kakashi of the Sharingan" },
  ],
} as const;

export const KAKASHI_KAMUI_TEXT = {
  enter: { tr: "Kamui modu", en: "Kamui mode" },
  exit: { tr: "Kamui'den çık", en: "Leave Kamui" },
} as const;

export const KAKASHI_IDENTITY = {
  title: { tr: "Kütük künyesi", en: "Ledger record" },
  /** Damga izi — künye şeridinin köşesindeki mühür yazısı */
  stamp: { tr: "Konohagakure · Jōnin", en: "Konohagakure · Jōnin" },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "15 Eylül", en: "September 15" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "180 cm", en: "180 cm" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "O", en: "O" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "25 – 29", en: "25 – 29" },
    },
    {
      label: { tr: "Rütbe", en: "Rank" },
      value: { tr: "Jōnin → Altıncı Hokage", en: "Jōnin → Sixth Hokage" },
    },
    {
      label: { tr: "Takım", en: "Team" },
      value: { tr: "Takım Minato → ANBU → Takım 7", en: "Team Minato → ANBU → Team 7" },
    },
    {
      label: { tr: "Sembolik obje", en: "Signature object" },
      value: { tr: "Icha Icha Paradise", en: "Icha Icha Paradise" },
    },
    {
      label: { tr: "Takma kimlik", en: "Cover identity" },
      value: { tr: "Sukea", en: "Sukea" },
    },
  ],
} as const;

/* ── Laboratuvar ────────────────────────────────────────────────────── */

export interface KakashiTechnique {
  key: "chidori" | "kamui" | "ninken";
  kanji: string;
  name: string;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
}

export const KAKASHI_LAB_TITLE = {
  title: { tr: "Kütüğün üç ağır dosyası", en: "The ledger's three heavy files" },
  lede: {
    tr: "Kartoteksteki yüzlerce fişin arasında üç dosya ayrı raftadır: biri kendi icadı, biri ölü bir arkadaşın armağanı, biri de sekiz burnun anlaşması.",
    en: "Among hundreds of index cards, three files sit on their own shelf: one he invented, one a dead friend gave him, one an agreement signed with eight noses.",
  },
} as const;

export const KAKASHI_LAB: KakashiTechnique[] = [
  {
    key: "chidori",
    kanji: "千鳥 · 雷切",
    name: "Chidori / Raikiri",
    tagline: {
      tr: "Bin kuş, tek el.",
      en: "A thousand birds, one hand.",
    },
    text: {
      tr: "Avucunda toplanan yıldırım, bin kuşun aynı anda öttüğü sesi çıkarır. Kakashi tekniği kendi geliştirdi, ama hız kendi gözünü aştı: hedefi göremeden saplanıyor, saldırı intihara dönüyordu. Chidori'yi tamamlayan şey Sharingan oldu — yani kendi icadını ancak bir başkasının gözüyle kullanabildi. Adı, anlatılana göre bir şimşeği ikiye böldüğü gün Raikiri'ye döndü.",
      en: "Lightning gathers in his palm with the sound of a thousand birds crying at once. Kakashi developed it himself, but the speed outran his own eye: he would strike before he could see, turning the attack into suicide. What completed Chidori was the Sharingan — he could only wield his own invention through someone else's eye. The name became Raikiri, they say, on the day it cut a bolt of lightning in two.",
    },
    traits: [
      { tr: "Kakashi'nin icadı", en: "Kakashi's own invention" },
      { tr: "Sharingan olmadan tamamlanmaz", en: "Incomplete without the Sharingan" },
      { tr: "Raiton · delici", en: "Raiton · piercing" },
    ],
  },
  {
    key: "kamui",
    kanji: "神威",
    name: "Kamui",
    tagline: {
      tr: "Baktığı yeri buradan siler.",
      en: "What he looks at stops being here.",
    },
    text: {
      tr: "Mangekyō'nun açtığı girdap, odaklandığı noktayı kendi cep boyutuna çeker. Obito'nunki geçiren taraftır — saldırıyı bedeninden akıtır; Kakashi'ninki emen taraf: uzaktan bakar ve alır. Aynı göz, iki yarım. Kütüğün en pahalı fişi de budur: her kullanımda gözün bedeli chakra değil, görme süresidir.",
      en: "The vortex the Mangekyō opens pulls whatever it focuses on into its own pocket dimension. Obito's half lets things pass through him; Kakashi's half absorbs — he looks from a distance and takes. One eye, two halves. It is also the ledger's most expensive card: every use is paid for not in chakra but in sight.",
    },
    traits: [
      { tr: "Mangekyō Sharingan", en: "Mangekyō Sharingan" },
      { tr: "Obito'nun sol gözü", en: "Obito's left eye" },
      { tr: "Uzun menzil · emen taraf", en: "Long range · the absorbing half" },
    ],
  },
  {
    key: "ninken",
    kanji: "口寄せ・忍犬",
    name: "Kuchiyose: Ninken",
    tagline: {
      tr: "Sekiz burun, tek iz.",
      en: "Eight noses, one trail.",
    },
    text: {
      tr: "Kakashi'nin çağırdığı sekiz ninken kavgayı kazanmak için değil, kaçmayı imkânsız kılmak için gelir: kokuyu bulur, hedefi yere mıhlar, Raikiri'nin geçeceği saniyeyi açarlar. En küçüğü Pakkun konuşur, en çok da o söylenir. Kütükte bu fiş 'takım' başlığı altındadır — Kakashi'nin tek başına çalışmadığı nadir kayıt.",
      en: "The eight ninken Kakashi summons do not come to win a fight but to make escape impossible: they find the scent, pin the target down, and open the second Raikiri needs. The smallest, Pakkun, is the one who talks — and complains. In the ledger this card is filed under 'team': the rare record where Kakashi does not work alone.",
    },
    traits: [
      { tr: "Kuchiyose", en: "Summoning" },
      { tr: "Pakkun · sekiz köpek", en: "Pakkun · eight hounds" },
      { tr: "İz sürme · sabitleme", en: "Tracking · pinning" },
    ],
  },
];

export interface KakashiMinorEntry {
  name: string;
  kanji: string;
  imageKey: string;
  note: LocalizedText;
}

export const KAKASHI_MINOR: KakashiMinorEntry[] = [
  {
    name: "Suiton: Suiryūdan no Jutsu",
    kanji: "水遁・水龍弾の術",
    imageKey: KAKASHI_IMAGE_KEYS.suiryudan,
    note: {
      tr: "Zabuza mühürleri yaparken Kakashi aynı mühürleri aynı anda yaptı; iki su ejderi tek saniyede yükseldi.",
      en: "As Zabuza formed the seals, Kakashi formed the same ones at the same instant; two water dragons rose in one second.",
    },
  },
  {
    name: "Doton: Doryūheki",
    kanji: "土遁・土流壁",
    imageKey: KAKASHI_IMAGE_KEYS.doryuheki,
    note: {
      tr: "Ağızdan çıkan çamurun anında sertleşmesi. Kütüğün savunma fişi: kazanmaz, ayakta tutar.",
      en: "Mud leaves the mouth and hardens on contact. The ledger's defensive card: it does not win, it keeps you standing.",
    },
  },
  {
    name: "Kage Bunshin no Jutsu",
    kanji: "影分身の術",
    imageKey: KAKASHI_IMAGE_KEYS.kageBunshin,
    note: {
      tr: "Bedeni bölmek. Kakashi genelde ikiye böler — biri konuşur, biri arkadan dolanır.",
      en: "Splitting the body. Kakashi usually makes two — one talks, the other circles behind you.",
    },
  },
  {
    name: "Icha Icha Paradise",
    kanji: "イチャイチャパラダイス",
    imageKey: KAKASHI_IMAGE_KEYS.ichaIcha,
    note: {
      tr: "Kütüğe kaçak giren fiş: teknik değil, kitap. Jiraiya'nın yazdığı roman, görev sırasında bile kapanmaz.",
      en: "The card that slipped into the ledger: not a technique, a book. Jiraiya wrote it, and it stays open even mid-mission.",
    },
  },
];

/* ── Doğa türü kartoteksi — sayfanın kalbi ──────────────────────────── */

export type NatureKey = "katon" | "suiton" | "doton" | "raiton" | "yin";

/**
 * Fişin türü kartın çizimini belirler:
 *  - `kopya` → köşesinde 写 damgası, kaynak satırı dolu
 *  - `kendi` → damga yok, kaynak satırında kütüğün kendi notu
 *  - `kayip` → boş fiş: kesik çizgili, adsız; çekmecenin eksiğini söyler
 */
export type FicheKind = "kopya" | "kendi" | "kayip";

export interface LedgerFiche {
  /** Fiş numarası: doğanın kanji'si + sıra ("火-01") */
  code: string;
  name: string;
  kanji: string;
  kind: FicheKind;
  /** "Kimden kopyalandı" — bilinmiyorsa kütük bunu açıkça yazar */
  source: LocalizedText;
  note: LocalizedText;
}

export interface NatureDrawer {
  key: NatureKey;
  kanji: string;
  name: string;
  label: LocalizedText;
  lede: LocalizedText;
  fiches: LedgerFiche[];
}

export const KAKASHI_INDEX_TITLE = {
  title: { tr: "Doğa türü kartoteksi", en: "Nature type card index" },
  lede: {
    tr: "Beş çekmece, beş doğa. Bir çekmeceyi açtığında fişler yeniden dizilir: tekniğin adı, kimden kopyalandığı ve tek cümlelik not.",
    en: "Five drawers, five natures. Open one and the cards deal again: the technique's name, whom it was copied from, and a single line of note.",
  },
} as const;

/** Kartoteks arayüzünün metinleri — istemci adasına düz dize iner. */
export const KAKASHI_INDEX_TEXT = {
  railLabel: { tr: "Doğa türü çekmeceleri", en: "Nature type drawers" },
  sourceLabel: { tr: "Kaynak", en: "Source" },
  copiedLabel: { tr: "Kopyalandı", en: "Copied" },
  blankLabel: { tr: "Boş fiş", en: "Blank card" },
  countLabel: { tr: "kayıtlı fiş", en: "cards on file" },
  hint: {
    tr: "Çekmeceler arasında ok tuşlarıyla da gezinebilirsin.",
    en: "You can also move between drawers with the arrow keys.",
  },
} as const;

export const KAKASHI_NATURES: NatureDrawer[] = [
  {
    key: "katon",
    kanji: "火遁",
    name: "Katon",
    label: { tr: "Ateş", en: "Fire" },
    lede: {
      tr: "Sharingan'ın kopyaladığı ilk doğa, gözü veren klanın kendi ateşi oldu.",
      en: "The first nature the Sharingan copied was the fire of the clan that gave him the eye.",
    },
    fiches: [
      {
        code: "火-01",
        name: "Katon: Gōkakyū no Jutsu",
        kanji: "火遁・豪火球の術",
        kind: "kopya",
        source: { tr: "Uchiha klanı", en: "The Uchiha clan" },
        note: {
          tr: "Uchiha'nın çocuklarına ilk öğrettiği teknik. Kakashi onu bir kez, bir başkasının elinde gördü — fiş o gün yazıldı.",
          en: "The first technique the Uchiha teach their children. Kakashi saw it once, in someone else's hands — the card was written that day.",
        },
      },
      {
        code: "火-02",
        name: "Katon: Karyū Endan",
        kanji: "火遁・火龍炎弾",
        kind: "kopya",
        source: { tr: "Kütükte kaynak satırı boş", en: "Source line left blank" },
        note: {
          tr: "Ateş ejderi mermisi — Kakashi'nin ateş doğasını en geniş açtığı kayıt. Kimden alındığı fişte yazmıyor.",
          en: "The fire dragon bullet — the widest his fire nature ever opened. The card does not say whom it came from.",
        },
      },
      {
        code: "火-⋯",
        name: "",
        kanji: "",
        kind: "kayip",
        source: { tr: "—", en: "—" },
        note: {
          tr: "Bu çekmecedeki fişlerin çoğu hiç yazılmadı. Kopyalanan bin teknikten kütüğe geçen, gördüğün kadarı.",
          en: "Most cards in this drawer were never written. Of a thousand copied techniques, what reached the ledger is what you see.",
        },
      },
    ],
  },
  {
    key: "suiton",
    kanji: "水遁",
    name: "Suiton",
    label: { tr: "Su", en: "Water" },
    lede: {
      tr: "Kopyanın en açık kanıtı bu çekmecede: Zabuza'nın sisinde aynı mühür, aynı saniye.",
      en: "The clearest proof of copying sits in this drawer: in Zabuza's mist, the same seal at the same second.",
    },
    fiches: [
      {
        code: "水-01",
        name: "Suiton: Suiryūdan no Jutsu",
        kanji: "水遁・水龍弾の術",
        kind: "kopya",
        source: { tr: "Zabuza Momochi", en: "Zabuza Momochi" },
        note: {
          tr: "Zabuza mühürleri yaparken Kakashi aynı mühürleri aynı anda yaptı. İki su ejderi karşılıklı yükseldi; ikisi de aynı elden çıkmış gibiydi.",
          en: "As Zabuza formed the seals, Kakashi formed them at the same instant. Two water dragons rose facing each other, as if from one hand.",
        },
      },
      {
        code: "水-02",
        name: "Suiton: Daibakufu no Jutsu",
        kanji: "水遁・大瀑布の術",
        kind: "kopya",
        source: { tr: "Zabuza Momochi", en: "Zabuza Momochi" },
        note: {
          tr: "Büyük şelale: aynı kavganın kapanışı. Kopyalanan teknik, sahibine karşı kullanıldı.",
          en: "The great waterfall: the closing move of that same fight. The copied technique was turned on its owner.",
        },
      },
      {
        code: "水-03",
        name: "Suiton: Suijinheki",
        kanji: "水遁・水陣壁",
        kind: "kopya",
        source: { tr: "Kütükte kaynak satırı boş", en: "Source line left blank" },
        note: {
          tr: "Su siperi — önüne çektiği dönen duvar. Savunma fişleri kütükte hep kısa yazılır.",
          en: "The water wall — a spinning barrier drawn up in front of him. Defensive cards are always written short.",
        },
      },
      {
        code: "水-⋯",
        name: "",
        kanji: "",
        kind: "kayip",
        source: { tr: "—", en: "—" },
        note: {
          tr: "Sisin içinde kopyalanan başka teknikler de vardı. Kütük onların yalnızca sayısını biliyor, adını değil.",
          en: "Other techniques were copied inside that mist. The ledger knows their number, not their names.",
        },
      },
    ],
  },
  {
    key: "doton",
    kanji: "土遁",
    name: "Doton",
    label: { tr: "Toprak", en: "Earth" },
    lede: {
      tr: "Toprak, Kakashi'nin gizlenme doğası: bu çekmecede duvarlar ve tuzaklar var.",
      en: "Earth is his nature for hiding: this drawer holds walls and traps.",
    },
    fiches: [
      {
        code: "土-01",
        name: "Doton: Doryūheki",
        kanji: "土遁・土流壁",
        kind: "kopya",
        source: { tr: "Kütükte kaynak satırı boş", en: "Source line left blank" },
        note: {
          tr: "Ağızdan çıkan çamur değince sertleşir. Kakashi'nin en sık başvurduğu savunma kaydı.",
          en: "Mud leaves the mouth and hardens where it lands. The defensive record he reaches for most.",
        },
      },
      {
        code: "土-02",
        name: "Doton: Shinjū Zanshu no Jutsu",
        kanji: "土遁・心中斬首の術",
        kind: "kopya",
        source: { tr: "Kütükte kaynak satırı boş", en: "Source line left blank" },
        note: {
          tr: "Toprağın altından çekip hedefi boynuna kadar gömmek. Kakashi bunu bir düşmana değil, çan sınavında kendi öğrencisine uyguladı.",
          en: "Pull the target under and bury them to the neck. Kakashi used it not on an enemy but on his own student, during the bell test.",
        },
      },
      {
        code: "土-03",
        name: "Doton: Moguragakure no Jutsu",
        kanji: "土遁・土竜隠れの術",
        kind: "kopya",
        source: { tr: "Kütükte kaynak satırı boş", en: "Source line left blank" },
        note: {
          tr: "Köstebek gibi toprağa dalıp iz bırakmadan ilerlemek. Çan sınavının bütün pusuları bu fişten çıktı.",
          en: "Sink into the earth like a mole and move without leaving a trail. Every ambush in the bell test came off this card.",
        },
      },
      {
        code: "土-⋯",
        name: "",
        kanji: "",
        kind: "kayip",
        source: { tr: "—", en: "—" },
        note: {
          tr: "Toprak çekmecesi en az yazılan çekmecedir: gizlenme tekniklerinin çoğu görülmediği için kaydedilmedi.",
          en: "The earth drawer is the least written: most hiding techniques were never seen, so they were never filed.",
        },
      },
    ],
  },
  {
    key: "raiton",
    kanji: "雷遁",
    name: "Raiton",
    label: { tr: "Yıldırım", en: "Lightning" },
    lede: {
      tr: "Kütüğün tek özgün çekmecesi. Burada kaynak satırları boş, çünkü kaynak kendisi.",
      en: "The ledger's one original drawer. The source lines are empty here, because the source is him.",
    },
    fiches: [
      {
        code: "雷-01",
        name: "Chidori",
        kanji: "千鳥",
        kind: "kendi",
        source: { tr: "Kaynak yok — kütüğün kendi kalemi", en: "No source — the ledger's own hand" },
        note: {
          tr: "Bin kuşun aynı anda öttüğü ses. Kakashi'nin icadı; ama hız kendi gözünü aştığı için ustası tekniği yarım saydı.",
          en: "The sound of a thousand birds crying at once. His invention — yet the speed outran his own eye, and his teacher called it unfinished.",
        },
      },
      {
        code: "雷-02",
        name: "Raikiri",
        kanji: "雷切",
        kind: "kendi",
        source: { tr: "Kaynak yok — kütüğün kendi kalemi", en: "No source — the ledger's own hand" },
        note: {
          tr: "Chidori'nin adını değiştiren tek vuruş: anlatılana göre Kakashi o elle bir şimşeği ikiye böldü.",
          en: "The single strike that renamed Chidori: the story says that hand cut a bolt of lightning in two.",
        },
      },
      {
        code: "雷-⋯",
        name: "",
        kanji: "",
        kind: "kayip",
        source: { tr: "—", en: "—" },
        note: {
          tr: "Bu çekmecede kayıp fiş yok. İki fiş var ve ikisi de kendi eliyle yazıldı — kütüğün tamamlanmış tek bölümü burası.",
          en: "Nothing is missing from this drawer. Two cards, both written in his own hand — the only part of the ledger that is finished.",
        },
      },
    ],
  },
  {
    key: "yin",
    kanji: "陰陽",
    name: "Yin-Yang · Kamui",
    label: { tr: "Yin-Yang ve Kamui", en: "Yin-Yang & Kamui" },
    lede: {
      tr: "Son çekmece kopyayı mümkün kılan şeyi saklıyor: gözün kendisi ve gözün açtığı boşluk.",
      en: "The last drawer holds what made copying possible: the eye itself, and the void the eye opens.",
    },
    fiches: [
      {
        code: "陰-01",
        name: "Sharingan",
        kanji: "写輪眼",
        kind: "kopya",
        source: { tr: "Obito Uchiha", en: "Obito Uchiha" },
        note: {
          tr: "Bir teknik değil, kütüğün ta kendisi. Kannabi Köprüsü'nde, kaya altında kalan bir çocuğun verdiği sol göz — bin kopyanın hepsi buradan geçti.",
          en: "Not a technique but the ledger itself. A left eye given under the rubble at Kannabi Bridge by a dying boy — every one of the thousand copies passed through it.",
        },
      },
      {
        code: "神-02",
        name: "Kamui",
        kanji: "神威",
        kind: "kendi",
        source: { tr: "Aynı göz — ikinci defter", en: "The same eye — a second volume" },
        note: {
          tr: "Obito'nunki geçiren taraf, Kakashi'ninki emen taraf. Aynı gözün iki yarımı, iki ayrı çocuğun elinde açıldı.",
          en: "Obito's half lets things pass; Kakashi's half absorbs. Two halves of one eye, opened in the hands of two different boys.",
        },
      },
      {
        code: "神-03",
        name: "Kamui Raikiri",
        kanji: "神威雷切",
        kind: "kendi",
        source: { tr: "Kaynak yok — kütüğün kendi kalemi", en: "No source — the ledger's own hand" },
        note: {
          tr: "Kendi icadının ucuna ölü arkadaşının gözünü giydirmek: dokunduğu şeyi kesmek yerine boyutundan söküp almak.",
          en: "Fitting a dead friend's eye onto the tip of his own invention: instead of cutting what it touches, it tears it out of this dimension.",
        },
      },
      {
        code: "陰-04",
        name: "Magen: Jubaku Satsu",
        kanji: "魔幻・樹縛殺",
        kind: "kopya",
        source: { tr: "Kütükte kaynak satırı boş", en: "Source line left blank" },
        note: {
          tr: "Ağaç bağı yanılsaması: kurbanı gövdeye mıhlar. Kütükte kayıtlı tek genjutsu fişi.",
          en: "The tree-binding illusion: it pins the victim to a trunk. The only genjutsu card in the ledger.",
        },
      },
      {
        code: "陰-⋯",
        name: "",
        kanji: "",
        kind: "kayip",
        source: { tr: "—", en: "—" },
        note: {
          tr: "Bu çekmecede kayıp sayılmaz: Kamui'nin götürdüğü her şey hâlâ bir yerde duruyor.",
          en: "Nothing counts as lost in this drawer: everything Kamui took is still somewhere.",
        },
      },
    ],
  },
];

/* ── Kader çizelgesi ────────────────────────────────────────────────── */

export type EraKey = "sakumo" | "kannabi" | "anbu" | "team7" | "hokage";

export interface KakashiEra {
  key: EraKey;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: LocalizedText;
  imageKey: string;
  /** Dönemde adı geçen karakterler — portreleri `companions`tan gelir */
  people: { id: number; name: string; role: LocalizedText }[];
}

export const KAKASHI_TIMELINE_TITLE = {
  title: { tr: "Kader çizelgesi", en: "The chart of what came late" },
  lede: {
    tr: "Kakashi'nin dosyası bir yükseliş anlatmıyor. Beş durakta hep aynı şey oluyor: bir şey geç anlaşılıyor, geri kalan ömür onu telafi etmekle geçiyor.",
    en: "This file does not describe a rise. At all five stops the same thing happens: something is understood too late, and the rest of a life goes into making up for it.",
  },
} as const;

export const KAKASHI_TIMELINE: KakashiEra[] = [
  {
    key: "sakumo",
    age: { tr: "0 – 5 yaş", en: "Ages 0 – 5" },
    title: { tr: "Beyaz Diş'in gölgesi", en: "The White Fang's shadow" },
    text: {
      tr: "Babası Sakumo Hatake, Konoha'nın Beyaz Dişi: efsanevi sanılan bir isim. Bir görevde görevi bırakıp takım arkadaşlarını kurtardı ve köy onu affetmedi — kurtardıkları dahil. Sakumo o suçlamanın altında kendi canını aldı. Kakashi bu evden tek bir ders çıkardı: kural her şeyin üstündedir.",
      en: "His father Sakumo Hatake was Konoha's White Fang, a name spoken like a legend. On one mission he abandoned the objective to save his teammates, and the village never forgave him — including the men he saved. Sakumo took his own life under that blame. Kakashi left that house with one lesson: the rules come before everything.",
    },
    imageKey: KAKASHI_IMAGE_KEYS.eraSakumo,
    people: [],
  },
  {
    key: "kannabi",
    age: { tr: "13 yaş", en: "Age 13" },
    title: { tr: "Kannabi Köprüsü — Obito'nun gözü", en: "Kannabi Bridge — Obito's eye" },
    text: {
      tr: "Sol gözünü bir görevde kaybetti; aynı görevde Obito Uchiha, kaçırılan Rin'i kurtarmak için kuralı çiğnedi ve Kakashi'yi arkasından sürükledi. Kaya Obito'nun yarısını ezerken çocuk son isteğini söyledi: yeni uyanmış Sharingan'ını Kakashi'ye verdi. Kakashi Rin'i koruyacağına söz verdi — ve o söz, Rin'in kendi Chidori'sine adım attığı gün elinde kırıldı.",
      en: "He lost his left eye on a mission; on the same mission Obito Uchiha broke the rules to save the captured Rin and dragged Kakashi back with him. As the rock crushed half of him, the boy made his last request: he gave Kakashi his newly awakened Sharingan. Kakashi promised to protect Rin — and that promise broke in his own hand the day she stepped into his Chidori.",
    },
    imageKey: KAKASHI_IMAGE_KEYS.eraKannabi,
    people: [
      { id: 3149, name: "Obito Uchiha", role: { tr: "Gözü veren", en: "Who gave the eye" } },
      { id: 14082, name: "Rin Nohara", role: { tr: "Korunamayan söz", en: "The promise unkept" } },
      { id: 2535, name: "Minato Namikaze", role: { tr: "Ustası", en: "His teacher" } },
    ],
  },
  {
    key: "anbu",
    age: { tr: "14 – 20'li yaşlar", en: "Teens into his twenties" },
    title: { tr: "ANBU yılları — kaydı tutulmayan defter", en: "The ANBU years — the volume no one kept" },
    text: {
      tr: "Maske takıp Hokage'ye doğrudan bağlı gölge birimine girdi. İsimsiz görevler, isimsiz cesetler; hiçbiri kütüğe geçmez, geçmesi de yasaktır. Aynı yıllarda aynı birimde Itachi Uchiha vardı — on üçünde yüzbaşı olan bir çocuk. Kakashi'nin dosyasında bu bölüm bilerek boştur: arşiv sustuğunda da bir şey anlatır.",
      en: "He put on a mask and joined the shadow unit that answers to the Hokage alone. Nameless missions, nameless bodies; none of it enters a ledger, and none of it may. In those same years the same unit held Itachi Uchiha, a boy made captain at thirteen. This chapter of the file is deliberately empty: an archive says something when it goes quiet, too.",
    },
    imageKey: KAKASHI_IMAGE_KEYS.eraAnbu,
    people: [
      { id: 14, name: "Itachi Uchiha", role: { tr: "Aynı birim", en: "Same unit" } },
    ],
  },
  {
    key: "team7",
    age: { tr: "26 – 29 yaş", en: "Ages 26 – 29" },
    title: { tr: "Takım 7'nin ustası", en: "The master of Team 7" },
    text: {
      tr: "Kendinden önceki altı takımı sınavda bırakmış bir jōnin, üç çocuğu ilk kez geçirdi — çünkü çanları alamayan bu üçü ilk kez birbirini bıraktı, sonra vazgeçti bırakmaktan. Kakashi'nin öğretisi teknik değildi: geç kaldığı dersi zamanında vermek. Üçü de onu geçti. Bunu bir kayıp değil, dosyanın kapanışı sayar.",
      en: "A jōnin who had failed six teams before them passed three children for the first time — because these three, unable to take the bells, first abandoned each other and then refused to. What Kakashi taught was not technique: it was giving on time the lesson he had received too late. All three surpassed him. He files that as the record closing well, not as a loss.",
    },
    quote: {
      tr: "Adım Kakashi Hatake. Sevdiklerim, sevmediklerim... Bunları size anlatmaya niyetim yok. Geleceğe dair hayallerim mi? Hiç düşünmedim. Hobilerim... epeyce hobim var.",
      en: "My name is Kakashi Hatake. What I like and what I hate... I don't feel like telling you. Dreams for the future? Never really thought about it. As for hobbies... I have quite a few hobbies.",
    },
    imageKey: KAKASHI_IMAGE_KEYS.eraTeam7,
    people: [
      { id: 17, name: "Naruto Uzumaki", role: { tr: "Öğrencisi", en: "His student" } },
      { id: 13, name: "Sasuke Uchiha", role: { tr: "Öğrencisi", en: "His student" } },
      { id: 145, name: "Sakura Haruno", role: { tr: "Öğrencisi", en: "His student" } },
    ],
  },
  {
    key: "hokage",
    age: { tr: "31 yaş ve sonrası", en: "Thirty-one and after" },
    title: { tr: "Altıncı Hokage", en: "The Sixth Hokage" },
    text: {
      tr: "Savaş bitince iki Sharingan da söndü; geriye Kakashi'nin kendi iki gözü kaldı. Kopyanın bittiği yer burasıdır — ve tam orada köyün şapkasını taktı. Sorumluluktan hoşlanmayan adam, hayatının en büyük sorumluluğunu üstlendi, sonra onu zamanı gelince Naruto'ya devretti. Telafi böyle bir şey: geç kalınan şeyi, bir başkası için erken yapmak.",
      en: "When the war ended both Sharingan went dark; what remained were Kakashi's own two eyes. That is where the copying stops — and exactly there he put on the village's hat. The man who disliked responsibility took on the largest one of his life, then handed it to Naruto when the time came. That is what making up for it looks like: doing early, for someone else, the thing you did too late.",
    },
    imageKey: KAKASHI_IMAGE_KEYS.eraHokage,
    people: [
      { id: 17, name: "Naruto Uzumaki", role: { tr: "Yedinci Hokage", en: "The Seventh Hokage" } },
    ],
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────── */

/**
 * İki replik aslında TEK cümledir: ilk yarısını on üç yaşındaki Kakashi
 * söyler, ikinci yarısını Obito. Kakashi ömrünü bu cümlenin ikinci
 * yarısını taşıyarak geçirir — kapanışın tasarımı bu kırılmanın üstüne
 * kuruldu, bu yüzden ikisi ayrı ayrı çizilir.
 */
export const KAKASHI_QUOTES: { text: LocalizedText; note: LocalizedText }[] = [
  {
    text: {
      tr: "Ninja dünyasında kuralları çiğneyenler çöptür.",
      en: "In the ninja world, those who break the rules are trash.",
    },
    note: {
      tr: "Kakashi, on üç yaşında — babasından çıkardığı ders",
      en: "Kakashi at thirteen — the lesson he drew from his father",
    },
  },
  {
    text: {
      tr: "Ama arkadaşlarını yok sayanlar çöpten de beterdir.",
      en: "But those who abandon their friends are worse than trash.",
    },
    note: {
      tr: "Obito Uchiha'nın cevabı — Kakashi bu yarıyı ömür boyu taşıdı",
      en: "Obito Uchiha's answer — Kakashi carried this half for the rest of his life",
    },
  },
];

export const KAKASHI_CLOSING = {
  motto: "仲間を見捨てる奴はそれ以上のクズだ",
  credit: {
    tr: "Künye ve portre: AniList — Kakashi Hatake (#85). Sayfadaki bütün işaretler (Kamui girdabı, doğa mühürleri, kopya damgası, ANBU maskesi) bu arşiv için elle çizildi; dışarıdan görsel alınmadı.",
    en: "Record and portrait: AniList — Kakashi Hatake (#85). Every mark on this page (the Kamui vortex, the nature seals, the copy stamp, the ANBU mask) was drawn by hand for this archive; no external artwork was used.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList entry" },
  creditHref: "https://anilist.co/character/85",
} as const;
