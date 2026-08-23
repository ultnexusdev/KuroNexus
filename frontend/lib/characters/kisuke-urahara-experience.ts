import type { LocalizedText } from "./types";

/**
 * Kisuke Urahara — deneyim sayfasının veri iskeleti.
 *
 * Sayfanın konsepti bir MEKÂN: Urahara Dükkânı. Diğer on iki karakter
 * sayfası bir portre, bir göz ya da bir savaş alanı; bu sayfa bir ODA —
 * ahşap raflar, fener ışığı, hasır zemin ve dokuz kapalı çekmece.
 *
 * Bütün görünen metin burada, iki dilli `LocalizedText` çiftleri olarak
 * (AGENTS.md kural 1). Bileşen yalnızca `pick(text, locale)` çağırır;
 * istemci adalarına düz dize iner.
 *
 * Künye sayıları `anilist-detay.json` önbelleğinden (AniList #210,
 * 22 Ağustos 2026): doğum günü 31 Aralık, boy 183 cm, ırk Shinigami,
 * görev "Urahara Dükkânı'nın sahibi", zanpakutō Benihime, takma ad
 * "Mr. Hat-and-Clogs". Yaş, kan grubu ve kilo künyede BOŞ — uydurulmadı,
 * sayfada "kayıtta olmayan" satırı olarak duruyor (karaktere de yakışıyor).
 *
 * Replik disiplini: sayfada yalnızca iki replik var ve ikisi de
 * doğrulanabilir — Shikai serbest bırakma komutu (「起きろ、紅姫」) ve
 * AniList künye metninin aktardığı kendi tarifi. Uydurma replik yok.
 */

export const URAHARA_ID = 210;

/**
 * Sahne görselleri — hepsi characterId 210 kaydında ABILITY yuvasında,
 * `urahara:*` anahtarlarıyla (Itachi'deki `itachi:*` deseninin kardeşi).
 *
 * Çekmecelerin İÇİ bu listede YOK: dokuz nesnenin her biri elle çizilmiş
 * SVG (`ShopGlyphs.tsx`). Çekmece bölümü sayfanın kalbi ve her koşulda
 * eksiksiz açılmalı — küratör bir görsel yüklemese bile.
 */
export const URAHARA_IMAGE_KEYS = {
  /** Hero arkası: dükkânın içi — ahşap raflar, fener, tezgâh (16:9) */
  shop: "urahara:shop",
  benihime: "urahara:benihime",
  bankai: "urahara:bankai",
  kido: "urahara:kido",
  hogyoku: "urahara:hogyoku",
  gigai: "urahara:gigai",
  senju: "urahara:senju",
  kikoo: "urahara:kikoo",
  eraCaptain: "urahara:era-captain",
  eraExile: "urahara:era-exile",
  eraShop: "urahara:era-shop",
  eraIchigo: "urahara:era-ichigo",
  eraPlan: "urahara:era-plan",
} as const;

export type UraharaImageKey =
  (typeof URAHARA_IMAGE_KEYS)[keyof typeof URAHARA_IMAGE_KEYS];

/** Küratör yuvalarının etiketleri — yükleme kutusunun üstünde görünür. */
export const URAHARA_SLOT_LABELS: Record<UraharaImageKey, LocalizedText> = {
  [URAHARA_IMAGE_KEYS.shop]: {
    tr: "Dükkânın içi — geniş kadraj (16:9)",
    en: "Shop interior — wide frame (16:9)",
  },
  [URAHARA_IMAGE_KEYS.benihime]: {
    tr: "Benihime — Shikai (16:9)",
    en: "Benihime — Shikai (16:9)",
  },
  [URAHARA_IMAGE_KEYS.bankai]: {
    tr: "Kannonbiraki Benihime Aratame — Bankai (16:9)",
    en: "Kannonbiraki Benihime Aratame — Bankai (16:9)",
  },
  [URAHARA_IMAGE_KEYS.kido]: {
    tr: "Kidō — mühür ve bariyer (16:9)",
    en: "Kidō — seals and barriers (16:9)",
  },
  [URAHARA_IMAGE_KEYS.hogyoku]: {
    tr: "Hōgyoku — küre (16:9)",
    en: "Hōgyoku — the orb (16:9)",
  },
  [URAHARA_IMAGE_KEYS.gigai]: {
    tr: "Gigai ve Tenshintai (16:9)",
    en: "Gigai and Tenshintai (16:9)",
  },
  [URAHARA_IMAGE_KEYS.senju]: {
    tr: "Hadō #91 Senju Kōten Taihō (16:9)",
    en: "Hadō #91 Senju Kōten Taihō (16:9)",
  },
  [URAHARA_IMAGE_KEYS.kikoo]: {
    tr: "Kikōō — kalkan (16:9)",
    en: "Kikōō — the shield (16:9)",
  },
  [URAHARA_IMAGE_KEYS.eraCaptain]: {
    tr: "Çizelge 1 — 12. Bölük Kaptanı (16:9)",
    en: "Timeline 1 — Captain of Squad 12 (16:9)",
  },
  [URAHARA_IMAGE_KEYS.eraExile]: {
    tr: "Çizelge 2 — hollowlaşma ve sürgün (16:9)",
    en: "Timeline 2 — hollowfication and exile (16:9)",
  },
  [URAHARA_IMAGE_KEYS.eraShop]: {
    tr: "Çizelge 3 — Karakura'da dükkân (16:9)",
    en: "Timeline 3 — the shop in Karakura (16:9)",
  },
  [URAHARA_IMAGE_KEYS.eraIchigo]: {
    tr: "Çizelge 4 — Ichigo'nun eğitimi (16:9)",
    en: "Timeline 4 — training Ichigo (16:9)",
  },
  [URAHARA_IMAGE_KEYS.eraPlan]: {
    tr: "Çizelge 5 — Aizen'i yenen plan (16:9)",
    en: "Timeline 5 — the plan that beat Aizen (16:9)",
  },
};

/**
 * Elle çizilmiş nesne setinin adları (`ShopGlyphs.tsx`).
 *
 * Dokuz çekmecenin dokuz nesnesi + dükkânın kendi işaretleri. Hepsi tek
 * kalem kalınlığında, 64'lük kutuda, `currentColor` konturuyla çizildi:
 * rengi bağlam veriyor, dosyada tek hex yok.
 */
export type ShopGlyph =
  | "orb"
  | "gigai"
  | "tenshintai"
  | "blade"
  | "sky"
  | "mask"
  | "seal"
  | "house"
  | "fan"
  | "hat"
  | "lantern"
  | "pull"
  | "geta";

/* ── Künye ───────────────────────────────────────────────────────────── */

export const URAHARA_IDENTITY = {
  name: "Kisuke Urahara",
  nativeName: "浦原喜助",
  /** Dükkânın tabelası — hero filigranı, aria-hidden çizilir */
  shopSign: "浦原商店",
  /** Kapıdaki tahta levha: "açık" */
  openPlate: "営業中",
  openPlateText: {
    tr: "Açık",
    en: "Open",
  },
  alias: {
    tr: "“Şapkalı Takunyalı Bey” — AniList künyesindeki tek takma ad",
    en: "“Mr. Hat-and-Clogs” — the only alias on the AniList profile",
  },
  epigraph: {
    tr: "Ön tarafta şeker satılıyor. Arka odada, Soul Society'nin bir daha denemediği şeyler yapılıyor. İkisi de aynı dükkân.",
    en: "Candy is sold at the front. In the back room, things Soul Society never tried again get built. Same shop.",
  },
  facts: [
    {
      label: { tr: "Doğum günü", en: "Birthday" },
      value: { tr: "31 Aralık", en: "December 31" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "183 cm", en: "183 cm" },
    },
    {
      label: { tr: "Irk", en: "Race" },
      value: { tr: "Shinigami", en: "Shinigami" },
    },
    {
      label: { tr: "Görevi", en: "Position" },
      value: {
        tr: "Urahara Dükkânı'nın sahibi",
        en: "Owner of the Urahara Shop",
      },
    },
    {
      label: { tr: "Zanpakutō", en: "Zanpakutō" },
      value: { tr: "Benihime — 紅姫", en: "Benihime — 紅姫" },
    },
    {
      label: { tr: "Eski rütbe", en: "Former rank" },
      value: {
        tr: "12. Bölük Kaptanı · Araştırma Enstitüsü'nün kurucusu",
        en: "Captain of Squad 12 · founder of the Research Institute",
      },
    },
    {
      label: { tr: "Dükkânın kadrosu", en: "Shop staff" },
      value: {
        tr: "Tessai Tsukabishi · Jinta Hanakari · Ururu Tsumugiya",
        en: "Tessai Tsukabishi · Jinta Hanakari · Ururu Tsumugiya",
      },
    },
    {
      label: { tr: "Sembolik obje", en: "Signature object" },
      value: {
        tr: "Yeşil-beyaz çizgili şapka ve geta",
        en: "Green-and-white striped hat and geta clogs",
      },
    },
    {
      label: { tr: "Kayıtta olmayan", en: "Off the record" },
      value: {
        tr: "Yaş · kan grubu · kilo — künye bu üç satırı boş bırakıyor",
        en: "Age · blood type · weight — the profile leaves these three blank",
      },
    },
  ],
} as const;

/* ── Mod düğmesi ─────────────────────────────────────────────────────── */

export const URAHARA_MODE_TEXT = {
  enter: { tr: "Benihime modu", en: "Benihime mode" },
  exit: { tr: "Işıkları yak", en: "Turn the lights on" },
  /** Mod açıkken sayfanın üstünde beliren tek satır */
  banner: {
    tr: "Dükkân kapandı. 起きろ、紅姫.",
    en: "The shop is closed. 起きろ、紅姫.",
  },
} as const;

/* ── Künye şeridinin başlığı ─────────────────────────────────────────── */

export const URAHARA_RECORD_TITLE = {
  title: { tr: "Dükkânın künyesi", en: "The shop's record" },
} as const;

/* ── Güç laboratuvarı ────────────────────────────────────────────────── */

export const URAHARA_LAB_TITLE = {
  title: { tr: "Arka oda", en: "The back room" },
  lede: {
    tr: "Urahara elindekinin yarısını hiç göstermez. Gösterdikleri bunlar.",
    en: "Urahara never shows half of what he has. This is the half he shows.",
  },
} as const;

export interface UraharaTechnique {
  key: "benihime" | "bankai" | "kido";
  name: string;
  kanji: string;
  imageKey: UraharaImageKey;
  release?: { native: string; text: LocalizedText };
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
}

export const URAHARA_TECHNIQUES: UraharaTechnique[] = [
  {
    key: "benihime",
    name: "Benihime",
    kanji: "紅姫",
    imageKey: URAHARA_IMAGE_KEYS.benihime,
    release: {
      native: "起きろ、紅姫",
      text: { tr: "Uyan, Benihime", en: "Awaken, Benihime" },
    },
    tagline: {
      tr: "Shikai — bastonun içindeki kılıç",
      en: "Shikai — the blade inside the cane",
    },
    text: {
      tr: "Urahara silahını bir baston olarak taşır: dükkâncının bastonu, kılıcın kını. Serbest bıraktığında elinde dar, kızıl kabzalı bir katana kalır ve dövüşün karakteri anında değişir — Benihime kesmez, keser gibi yapıp kanatır. Bir Shinigami'nin yalnız Shikai'yle kaptan seviyesinde dövüşebildiği ender örneklerden biri.",
      en: "He carries his weapon as a cane: a shopkeeper's stick that happens to be a scabbard. Released, it becomes a narrow, crimson-hilted blade and the fight changes character at once — Benihime does not simply cut, it makes cuts happen where you did not expect them. One of the rare Shinigami who fights at captain level with Shikai alone.",
    },
    traits: [
      { tr: "Nake, Benihime — kızıl enerji dalgası", en: "Nake, Benihime — crimson energy wave" },
      { tr: "Kamisori, Benihime — savrulan kesik", en: "Kamisori, Benihime — a thrown cut" },
      { tr: "Chikasumi no Tate — kan sisi kalkanı", en: "Chikasumi no Tate — shield of blood mist" },
      { tr: "Shibari, Benihime — bağlayan ağ", en: "Shibari, Benihime — a binding net" },
    ],
  },
  {
    key: "bankai",
    name: "Kannonbiraki Benihime Aratame",
    kanji: "観音開紅姫改メ",
    imageKey: URAHARA_IMAGE_KEYS.bankai,
    tagline: {
      tr: "Bankai — sökülüp yeniden kurulan şey",
      en: "Bankai — taken apart, put back differently",
    },
    text: {
      tr: "Yüz yıldan fazla saklandı. Açıldığında dev, kimonolu bir figür belirir ve sardığı şeyi parçalarına ayırıp yeniden kurar. Ölçüsü yara değil kurgu: bir düşmanın neyden yapıldığını çözer, sonra onu başka bir şey olarak geri toplar. Urahara'nın bütün icatlarıyla aynı mantık, bu kez kılıç eliyle.",
      en: "Hidden for more than a century. Released, a vast kimono-clad figure appears and takes whatever it wraps apart, then rebuilds it. The measure is not the wound but the reassembly: it works out what an enemy is made of and puts it back as something else. The same logic as every invention of his, this time held in a sword.",
    },
    traits: [
      { tr: "Sarar, söker, yeniden kurar", en: "Wraps, dismantles, rebuilds" },
      { tr: "Bin Yıllık Kan Savaşı'nda ilk kez", en: "First seen in the Thousand-Year Blood War" },
      { tr: "Onarmak için de kullanılabilir", en: "Can be used to repair, too" },
    ],
  },
  {
    key: "kido",
    name: "Kidō",
    kanji: "鬼道",
    imageKey: URAHARA_IMAGE_KEYS.kido,
    tagline: {
      tr: "Kitapta yazmayan kısmı",
      en: "The part that is not in the book",
    },
    text: {
      tr: "Yüksek seviye kidō'yu okumasız kullanır; ama asıl mesele kullanma biçimi. Urahara kidō'yu bir listeden seçmez, üzerine yazar: kendi icat ettiği mühürler, bariyerler, boyutlar arası geçitler, ölçüm alanları. Soul Society'nin bilinen büyüsünün yarısı onun defterinden çıkmış gibidir — kalan yarısını da eğip bükmüştür.",
      en: "He casts high-level kidō without incantation, but the point is how he uses it. Urahara does not pick spells off a list, he writes over it: seals of his own design, barriers, gates between worlds, measuring fields. Half of Soul Society's known kidō reads like a page from his notebook — and he bends the other half.",
    },
    traits: [
      { tr: "Okumasız yüksek seviye kidō", en: "High-level kidō without incantation" },
      { tr: "Kendi icadı mühürler ve geçitler", en: "Seals and gates of his own making" },
      { tr: "Bariyeri silaha çevirir", en: "Turns a barrier into a weapon" },
    ],
  },
];

export interface UraharaTool {
  key: "hogyoku" | "gigai" | "senju" | "kikoo";
  name: string;
  kanji: string;
  imageKey: UraharaImageKey;
  note: LocalizedText;
}

export const URAHARA_TOOLS: UraharaTool[] = [
  {
    key: "hogyoku",
    name: "Hōgyoku",
    kanji: "崩玉",
    imageKey: URAHARA_IMAGE_KEYS.hogyoku,
    note: {
      tr: "Ruhun sınırlarını silen küre. Yapan da o, yok etmeye çalışan da.",
      en: "The orb that erases a soul's limits. He made it; he also tried to destroy it.",
    },
  },
  {
    key: "gigai",
    name: "Gigai · Tenshintai",
    kanji: "義骸・転神体",
    imageKey: URAHARA_IMAGE_KEYS.gigai,
    note: {
      tr: "Sahte beden ve zanpakutō ruhunu maddeye çağıran gövde. Ichigo'nun üç günü buradan çıktı.",
      en: "A false body, and the frame that drags a zanpakutō spirit into matter. Ichigo's three days came out of these.",
    },
  },
  {
    key: "senju",
    name: "Hadō #91 · Senju Kōten Taihō",
    kanji: "千手皎天汰炮",
    imageKey: URAHARA_IMAGE_KEYS.senju,
    note: {
      tr: "Bin elin ışığı. Doksan birinci hadō'yu sayılı Shinigami çıkarabilir.",
      en: "The light of a thousand hands. Only a handful of Shinigami can fire the ninety-first hadō.",
    },
  },
  {
    key: "kikoo",
    name: "Kikōō",
    kanji: "鬼哭王",
    imageKey: URAHARA_IMAGE_KEYS.kikoo,
    note: {
      tr: "Kalkan. Tutması gerekeni tuttuğu için ünlü, tuttuğu şey yüzünden korkutucu.",
      en: "A shield — famous for what it held, frightening because of what it had to hold.",
    },
  },
];

/* ── Çekmece ızgarası: sayfanın kalbi ────────────────────────────────── */

export const URAHARA_DRAWERS_TITLE = {
  title: { tr: "Kapalı çekmeceler", en: "The closed drawers" },
  lede: {
    tr: "Dokuz çekmece, dokuz sır. Hepsi kapalı açılıyor; siz çektikçe dükkânın feneri güçleniyor.",
    en: "Nine drawers, nine secrets. They all start shut — the shop's lantern grows as you pull them open.",
  },
  /** Fener göstergesinin okunur karşılığı (role="status") — {n} sayıya dönüşür */
  countTemplate: {
    tr: "Dükkânın {n} çekmecesi açık.",
    en: "{n} of the shop's drawers are open.",
  },
  /** Düğmenin erişilebilir adı — {n} sıra, {t} çekmecenin üstündeki tek kelime */
  ariaTemplate: {
    tr: "{n}. çekmece — {t}",
    en: "Drawer {n} — {t}",
  },
  lampLabel: { tr: "Fener", en: "Lantern" },
} as const;

export interface UraharaDrawer {
  key: string;
  /** Çekmecenin pirinç plakasındaki Japonca rakam */
  numeral: string;
  kanji: string;
  glyph: ShopGlyph;
  /** Kapalıyken görünen TEK kelime — çekmecenin üstündeki etiket */
  teaser: LocalizedText;
  /** İçindekinin adı (çevrilmez) */
  name: string;
  title: LocalizedText;
  text: LocalizedText;
}

export const URAHARA_DRAWERS: UraharaDrawer[] = [
  {
    key: "hogyoku",
    numeral: "一",
    kanji: "崩玉",
    glyph: "orb",
    teaser: { tr: "küre", en: "an orb" },
    name: "Hōgyoku",
    title: { tr: "Sınırı silen şey", en: "The thing that erases the line" },
    text: {
      tr: "Bir ruhun Shinigami ile Hollow arasındaki sınırını silen küçük bir küre. Urahara onu yaptı, durduramayacağını anlayınca yok etmeye çalıştı ve beceremedi. Kalan tek seçenek saklamaktı: bir kızın sahte bedeninin içine gömüp Karakura'ya gönderdi.",
      en: "A small orb that erases the line between Shinigami and Hollow inside a soul. Urahara built it, realised he could not stop it, tried to destroy it, and failed. Hiding it was the only move left: he buried it inside a girl's false body and sent it to Karakura.",
    },
  },
  {
    key: "gigai",
    numeral: "二",
    kanji: "義骸",
    glyph: "gigai",
    teaser: { tr: "beden", en: "a body" },
    name: "Gigai",
    title: { tr: "Giyilen sahte beden", en: "The body you put on" },
    text: {
      tr: "Ruhların yaşayanlar dünyasında dolaşmak için giydiği kabuk. Urahara'nınki farklıydı: giyenin gücünü sessizce emiyor, onu yavaşça insana çeviriyordu. Rukia Kuchiki'ye verdiği tam olarak buydu ve Rukia bunu aylar sonra öğrendi.",
      en: "The shell a soul wears to walk among the living. His version was different: it quietly drank the wearer's power and turned them human by degrees. That is exactly what he handed Rukia Kuchiki, and she found out long after.",
    },
  },
  {
    key: "tenshintai",
    numeral: "三",
    kanji: "転神体",
    glyph: "tenshintai",
    teaser: { tr: "kazık", en: "a stake" },
    name: "Tenshintai",
    title: { tr: "Üç günde Bankai", en: "Bankai in three days" },
    text: {
      tr: "Zanpakutō'nun ruhunu maddeye çağıran tahta gövde: kılıcı saplarsın, karşına ruhu çıkar. Bankai normalde on yıllık bir iştir; Urahara bunu üç güne indirdi ve kimse ona bunun bedelini sormadı.",
      en: "A wooden frame that drags a zanpakutō's spirit into matter: drive the blade in, and the spirit stands in front of you. Bankai is normally a decade of work; Urahara cut it to three days, and nobody asked him what that costs.",
    },
  },
  {
    key: "benihime",
    numeral: "四",
    kanji: "紅姫",
    glyph: "blade",
    teaser: { tr: "ad", en: "a name" },
    name: "Benihime",
    title: { tr: "Kızıl Prenses", en: "Crimson Princess" },
    text: {
      tr: "Zanpakutō'nun adını sahibinin ruhu koyar. Yani nazik, şakacı, hep gülümseyen dükkâncı kılıcına “Kızıl Prenses” demiş. Ona her seslenişinde de aynı iki kelimeyi kullanıyor: uyan, Benihime.",
      en: "A zanpakutō is named by its owner's soul. Which means the polite, joking, always-smiling shopkeeper called his sword “Crimson Princess”. And every time he calls her, it is the same two words: awaken, Benihime.",
    },
  },
  {
    key: "underground",
    numeral: "五",
    kanji: "地下訓練場",
    glyph: "sky",
    teaser: { tr: "gökyüzü", en: "a sky" },
    name: "Chika Kunrenjō",
    title: { tr: "Yeraltı eğitim odası", en: "The underground training ground" },
    text: {
      tr: "Dükkânın altında kayadan oyulmuş uçsuz bir alan; tavanına gökyüzü çizilmiş, ufkuna kayalar dizilmiş. AniList künyesi bunu bir huy olarak kaydediyor: gizlice büyük eğitim alanları yapmak neredeyse onun hobisi. Ichigo'nun Shinigami olduğu yer burası.",
      en: "A cavern hollowed out under the shop, with a sky painted on the ceiling and boulders set along the horizon. His AniList profile records it as a habit: secretly building large training spaces is practically his hobby. This is where Ichigo became a Shinigami.",
    },
  },
  {
    key: "vizard",
    numeral: "六",
    kanji: "仮面の軍勢",
    glyph: "mask",
    teaser: { tr: "maske", en: "a mask" },
    name: "Visored",
    title: { tr: "Maskeliler", en: "The masked ones" },
    text: {
      tr: "Bir gece sekiz Shinigami hollowlaştı. Urahara onları tutacak şeyi yaptı, Tessai kidō'suyla o anı dondurdu ve ikisi de o gecenin faili sayıldı. Kurtardıkları bugün hâlâ maskelerini takıyor; o hâlâ suçlu.",
      en: "One night, eight Shinigami began to hollowfy. Urahara built the thing that could hold them, Tessai froze the moment with his kidō, and both were named as the cause. The ones they saved still wear their masks; he is still the guilty party.",
    },
  },
  {
    key: "exile",
    numeral: "七",
    kanji: "追放",
    glyph: "seal",
    teaser: { tr: "hüküm", en: "a verdict" },
    name: "Tsuihō",
    title: { tr: "Sürgün kararı", en: "The exile" },
    text: {
      tr: "Merkez 46 aynı gece iki karar verdi: Tessai Tsukabishi'ye hapis, Kisuke Urahara'ya sürgün. Yoruichi Shihōin ikisini de kaçırdı. Soul Society'de geriye tek soru kaldı — küre nerede.",
      en: "Central 46 handed down two sentences the same night: imprisonment for Tessai Tsukabishi, exile for Kisuke Urahara. Yoruichi Shihōin got them both out. One question stayed behind in Soul Society — where is the orb.",
    },
  },
  {
    key: "kurosaki",
    numeral: "八",
    kanji: "黒崎家",
    glyph: "house",
    teaser: { tr: "aile", en: "a family" },
    name: "Kurosaki",
    title: { tr: "Kurosaki ailesiyle anlaşma", en: "The Kurosaki agreement" },
    text: {
      tr: "Isshin Kurosaki gücünü bir kadını kurtarmak için bıraktı ve insan oldu. Urahara ona bedenini verdi, sırrını tuttu ve yirmi yıl boyunca kimseye tek kelime etmedi. Sonra aynı mahallede bir dükkân açtı ve çocuğun büyümesini bekledi.",
      en: "Isshin Kurosaki spent his power saving a woman and became human. Urahara gave him the body, kept the secret, and said nothing to anyone for twenty years. Then he opened a shop in the same neighbourhood and waited for the boy to grow up.",
    },
  },
  {
    key: "plan",
    numeral: "九",
    kanji: "全部計画",
    glyph: "fan",
    teaser: { tr: "plan", en: "the plan" },
    name: "Zenbu Keikaku",
    title: { tr: "Hepsini ben planladım", en: "I planned all of it" },
    text: {
      tr: "Rukia'nın Karakura'ya gönderilişi, Ichigo'nun eline geçen güç, üç günde Bankai, Aizen'i tutan mühür. Urahara olayların kenarında durur, karışmaz, iş bitince gülümseyerek ortaya çıkar. En alt çekmecede duran şey bu: her şey göründüğünden fazlası.",
      en: "Rukia sent to Karakura, power ending up in Ichigo's hands, Bankai in three days, the seal that finally held Aizen. Urahara stands at the edge of events, does not intervene, and turns up smiling once it is done. This is what sits in the bottom drawer: everything is more than it looks.",
    },
  },
];

/* ── Dükkânın defteri (yoldaşlar) ────────────────────────────────────── */

export const URAHARA_LEDGER_TITLE = {
  title: { tr: "Dükkânın defteri", en: "The shop ledger" },
  lede: {
    tr: "Beş isim, beş kalem. Hiçbiri parayla kapanmadı.",
    en: "Five names, five entries. None of them settled in cash.",
  },
} as const;

export interface UraharaLedgerRow {
  characterId: number;
  name: string;
  native: string;
  entry: LocalizedText;
  note: LocalizedText;
}

export const URAHARA_LEDGER: UraharaLedgerRow[] = [
  {
    characterId: 908,
    name: "Yoruichi Shihōin",
    native: "四楓院 夜一",
    entry: { tr: "Kaçış", en: "The escape" },
    note: {
      tr: "Sürgün kararından önce onu bilen tek kişi. Kapıyı o açtı, üçünü de o çıkardı; dükkânın kedisi hâlâ o.",
      en: "The only one who knew before the verdict. She opened the door and got all three out; the shop's cat is still her.",
    },
  },
  {
    characterId: 5,
    name: "Ichigo Kurosaki",
    native: "黒崎 一護",
    entry: { tr: "Eğitim", en: "The training" },
    note: {
      tr: "Dükkâna gücünü kaybetmiş bir çocuk olarak geldi, yerin altından Shinigami olarak çıktı. Urahara'nın en uzun vadeli yatırımı.",
      en: "He came to the shop as a boy who had lost his power and came up from underground a Shinigami. Urahara's longest-dated investment.",
    },
  },
  {
    characterId: 1086,
    name: "Sōsuke Aizen",
    native: "藍染 惣右介",
    entry: { tr: "Ödenmedi", en: "Unpaid" },
    note: {
      tr: "Ödemeden alan tek müşteri. Küreyi bulması yüz yılını aldı; Urahara o yüz yılda ona başka bir şey hazırlıyordu.",
      en: "The one customer who took without paying. Finding the orb cost him a century; Urahara spent that century preparing something else for him.",
    },
  },
  {
    characterId: 6,
    name: "Rukia Kuchiki",
    native: "朽木 ルキア",
    entry: { tr: "Emanet", en: "Held in trust" },
    note: {
      tr: "İstemediği bir gigai giydi, içinde ne olduğunu bilmeden taşıdı. Bütün hikâye onun kapısında başlıyor.",
      en: "She wore a gigai she never asked for and carried what was inside it without knowing. The whole story starts at her door.",
    },
  },
  {
    characterId: 1081,
    name: "Ulquiorra Cifer",
    native: "ウルキオラ・シファー",
    entry: { tr: "Sonuç", en: "The result" },
    note: {
      tr: "Çekmecedeki kürenin ne yapabildiğinin canlı kanıtı: Aizen'in elinde Espada'nın dördüncüsü çıktı.",
      en: "Living proof of what the orb in the drawer can do: in Aizen's hands it produced the fourth Espada.",
    },
  },
];

/* ── Kader çizelgesi ─────────────────────────────────────────────────── */

export const URAHARA_TIMELINE_TITLE = {
  title: { tr: "Dükkâna giden yol", en: "The road to the shop" },
  lede: {
    tr: "Beş durak. Hiçbirinde plan değişmiyor, yalnızca yer değiştiriyor.",
    en: "Five stops. The plan never changes at any of them — it only moves.",
  },
} as const;

export interface UraharaEra {
  key: "captain" | "exile" | "shop" | "ichigo" | "plan";
  imageKey: UraharaImageKey;
  glyph: ShopGlyph;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { native: string; text: LocalizedText; note: LocalizedText };
}

export const URAHARA_TIMELINE: UraharaEra[] = [
  {
    key: "captain",
    imageKey: URAHARA_IMAGE_KEYS.eraCaptain,
    glyph: "seal",
    age: { tr: "110 yıl önce", en: "110 years ago" },
    title: {
      tr: "12. Bölük Kaptanı",
      en: "Captain of Squad 12",
    },
    text: {
      tr: "Bölüğün başına geçtiğinde yanında bir de kurum getirdi: Shinigami Araştırma ve Geliştirme Enstitüsü. Enstitü onun için bir laboratuvardan çok bir izin belgesiydi — Soul Society'de kimsenin sormadığı soruları sormak resmen serbest hâle geldi.",
      en: "He took the squad and brought an institution with him: the Shinigami Research and Development Institute. For him it was less a laboratory than a permit — asking the questions nobody in Soul Society asked suddenly became official work.",
    },
  },
  {
    key: "exile",
    imageKey: URAHARA_IMAGE_KEYS.eraExile,
    glyph: "mask",
    age: { tr: "Aynı yıl, tek bir gece", en: "That same year, one night" },
    title: {
      tr: "Hollowlaşma ve sürgün",
      en: "Hollowfication and exile",
    },
    text: {
      tr: "Sekiz Shinigami'nin ruhu bir gecede çözüldü. Urahara onları tutacak bedeni yaptı, Tessai yasaklı bir kidō'yla o anı dondurdu ve Merkez 46 ikisini de o gecenin sebebi ilan etti. Sürgün kararının ardında kalan asıl mesele hükümde yazmıyordu: küre.",
      en: "In one night, eight Shinigami came apart. Urahara built the bodies that could hold them, Tessai froze the moment with a forbidden kidō, and Central 46 declared the two of them the cause. The real matter behind the sentence was not written in it: the orb.",
    },
  },
  {
    key: "shop",
    imageKey: URAHARA_IMAGE_KEYS.eraShop,
    glyph: "house",
    age: { tr: "Yaklaşık yüz yıl", en: "About a hundred years" },
    title: {
      tr: "Karakura'da bir dükkân",
      en: "A shop in Karakura",
    },
    text: {
      tr: "Yaşayanlar dünyasında küçük bir dükkân açtı: raflarda şeker, arka odada Shinigami malzemesi, altında kayadan oyulmuş bir eğitim alanı. Yüz yıl boyunca hiçbir şey yapmadı — daha doğrusu, herkes öyle sandı.",
      en: "He opened a small shop in the world of the living: candy on the shelves, Shinigami supplies in the back, a cavern carved out underneath. For a century he did nothing — or rather, everyone assumed so.",
    },
  },
  {
    key: "ichigo",
    imageKey: URAHARA_IMAGE_KEYS.eraIchigo,
    glyph: "tenshintai",
    age: { tr: "Ichigo on beş yaşında", en: "Ichigo at fifteen" },
    title: {
      tr: "Bir Shinigami yetiştirmek",
      en: "Raising a Shinigami",
    },
    text: {
      tr: "Gücünü kaybetmiş çocuğu yerin altına indirdi, zincirini kesti, üç gün verdi. Yöntem acımasızdı, sonucu tartışılmaz: Soul Society'ye giren Ichigo artık kaptanların dengi. Urahara bu eğitimin tek bir dakikasını rastgele kurmadı.",
      en: "He took the boy who had lost his power underground, cut his chain and gave him three days. The method was merciless and the result is not arguable: the Ichigo who walked into Soul Society could stand against captains. Not one minute of that training was improvised.",
    },
    quote: {
      native: "起きろ、紅姫",
      text: { tr: "Uyan, Benihime.", en: "Awaken, Benihime." },
      note: {
        tr: "Shikai serbest bırakma komutu",
        en: "The Shikai release command",
      },
    },
  },
  {
    key: "plan",
    imageKey: URAHARA_IMAGE_KEYS.eraPlan,
    glyph: "fan",
    age: { tr: "Kış Savaşı", en: "The Winter War" },
    title: {
      tr: "Aizen'i yenen plan",
      en: "The plan that beat Aizen",
    },
    text: {
      tr: "Aizen'i kimse tek başına yenmedi; onu bir sıra yendi. Sıranın kurucusu Urahara'ydı: küreyi tanıyan, gigai'yi yapan, Ichigo'yu yetiştiren ve son mührü kendi eliyle vuran adam. Sonunda ortaya çıkıp gülümsedi — hep yaptığı gibi.",
      en: "Nobody beat Aizen alone; a sequence did. Urahara built the sequence: the man who knew the orb, made the gigai, trained Ichigo, and set the final seal himself. At the end he stepped out and smiled — the way he always does.",
    },
  },
];

/* ── Kapanış ─────────────────────────────────────────────────────────── */

export const URAHARA_CLOSING = {
  title: { tr: "Dükkân kapanırken", en: "As the shop closes" },
  quotes: [
    {
      text: {
        tr: "Ben sadece dürüst, yakışıklı ve biraz da edepsiz bir tüccarım.",
        en: "I am but an honest, handsome, perverted businessman.",
      },
      note: {
        tr: "Kendi tarifi — AniList künye metninden aktarılıyor",
        en: "His own description — as related in the AniList profile text",
      },
    },
    {
      text: {
        tr: "Uyan, Benihime.",
        en: "Awaken, Benihime.",
      },
      note: {
        tr: "起きろ、紅姫 — Shikai serbest bırakma komutu",
        en: "起きろ、紅姫 — the Shikai release command",
      },
    },
  ],
  motto: {
    native: "浦原商店",
    text: {
      tr: "Urahara Shōten — tabela da bir kılık: dükkânın adı, sahibinin en uzun süre taşıdığı maske.",
      en: "Urahara Shōten — the sign is a disguise too: the shop's name is the mask its owner wore longest.",
    },
  },
  credit: {
    tr: "Künye ve portre: AniList — Kisuke Urahara (#210). Portre AniList görsel sunucusundan geliyor ve iyileştirilmeden çiziliyor. Sayfadaki bütün çizimler — şapkanın şerit deseni, fener, çekmece halkaları ve dokuz nesne — bu arşiv için elle çizildi; dışarıdan görsel kullanılmadı.",
    en: "Profile and portrait: AniList — Kisuke Urahara (#210). The portrait is served by AniList's image CDN and rendered unoptimised. Every drawing on this page — the hat's stripe pattern, the lantern, the drawer pulls and the nine objects — was drawn by hand for this archive; no external imagery was used.",
  },
  creditLink: {
    tr: "AniList künyesi",
    en: "AniList profile",
  },
  siteUrl: "https://anilist.co/character/210",
} as const;

/* ── Görsel alt metinleri ────────────────────────────────────────────── */

export const URAHARA_ALT = {
  portrait: {
    tr: "Kisuke Urahara — AniList künye portresi",
    en: "Kisuke Urahara — AniList profile portrait",
  },
  /** Defterdeki portreler: {name} ada dönüşür */
  ledger: {
    tr: "{name} — arşivin karakter portresi",
    en: "{name} — character portrait from the archive",
  },
} as const;
