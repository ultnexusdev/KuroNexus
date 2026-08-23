import type { LocalizedText } from "./types";

/**
 * Naruto Uzumaki — deneyim sayfasının veri iskeleti.
 *
 * Itachi emsalinin kardeşi: karaktere ait BÜTÜN anlatı burada, iki dilli
 * `LocalizedText` çiftleri olarak (kural 1). Görseller veritabanında
 * (`CharacterImage`, characterId 17, ABILITY yuvası).
 *
 * ⚠️ YUVA ÖNEKİ: bu sayfanın anahtarları `naruto-uzumaki:*`. Aynı karakter
 * kaydında ZATEN `naruto:*` önekli 17 görsel var — onlar Naruto Evreni
 * sayfasına (`/anime/naruto`) ait ve buraya karışmamalı. Yeni bir yuva
 * eklerken öneki kontrol et.
 *
 * ── SAYFANIN TEZİ ────────────────────────────────────────────────────────
 * Kuyruk sayısı bir güç ölçüsü değil, bir MESAFE ölçüsü: Naruto ile
 * içindeki şey arasındaki mesafe. Bu yüzden ölçeğin ısı eğrisi dokuzuncu
 * kuyrukta tepe yapıp Bijuu Modu'nda DÜŞÜYOR (bkz. NARUTO_SCALE yorumu ve
 * CSS'teki `--nrt-heat` merdiveni). Sayfanın duygusu umut; on üç sayfanın
 * en sıcağı burası olmalı.
 */

export const NARUTO_ID = 17;

/** Küratörün yükleyeceği görsel yuvaları — hepsi characterId 17 · ABILITY. */
export const NARUTO_IMAGE_KEYS = {
  /** Hero'nun arkasındaki geniş gece sahnesi (16:9). Boşsa gradyan + sarmal kalır. */
  heroScene: "naruto-uzumaki:hero-scene",

  /* Kuyruk rayının dokuz kademesi (4:3) */
  stageHuman: "naruto-uzumaki:stage-human",
  stageOne: "naruto-uzumaki:stage-one",
  stageThree: "naruto-uzumaki:stage-three",
  stageFour: "naruto-uzumaki:stage-four",
  stageSix: "naruto-uzumaki:stage-six",
  stageEight: "naruto-uzumaki:stage-eight",
  stageFull: "naruto-uzumaki:stage-full",
  stageBijuu: "naruto-uzumaki:stage-bijuu",
  stageBaryon: "naruto-uzumaki:stage-baryon",

  /* Laboratuvar — üç büyük (16:9) */
  jutsuRasengan: "naruto-uzumaki:jutsu-rasengan",
  jutsuKageBunshin: "naruto-uzumaki:jutsu-kage-bunshin",
  jutsuSennin: "naruto-uzumaki:jutsu-sennin",

  /* Laboratuvar — dört mühür etiketi (3:4) */
  tagRasenshuriken: "naruto-uzumaki:tag-rasenshuriken",
  tagBond: "naruto-uzumaki:tag-bijuu-bond",
  tagSeal: "naruto-uzumaki:tag-uzumaki-seal",
  tagGamakichi: "naruto-uzumaki:tag-gamakichi",

  /* Kader çizelgesi — beş durak (16:9) */
  eraSealed: "naruto-uzumaki:era-sealed",
  eraTeam7: "naruto-uzumaki:era-team7",
  eraJiraiya: "naruto-uzumaki:era-jiraiya",
  eraPain: "naruto-uzumaki:era-pain",
  eraWar: "naruto-uzumaki:era-war",
} as const;

/** Küratör yuvalarının etiketleri — yükleme kutusunun üstünde görünür. */
export const NARUTO_SLOT_LABELS: Record<string, LocalizedText> = {
  [NARUTO_IMAGE_KEYS.heroScene]: {
    tr: "Hero sahnesi — Konoha gecesi (16:9)",
    en: "Hero scene — Konoha at night (16:9)",
  },
  [NARUTO_IMAGE_KEYS.stageHuman]: {
    tr: "Kademe 0 — mühürlü çocuk (4:3)",
    en: "Stage 0 — the sealed boy (4:3)",
  },
  [NARUTO_IMAGE_KEYS.stageOne]: {
    tr: "Kademe 1 — ilk kuyruk (4:3)",
    en: "Stage 1 — the first tail (4:3)",
  },
  [NARUTO_IMAGE_KEYS.stageThree]: {
    tr: "Kademe 3 — üç kuyruk (4:3)",
    en: "Stage 3 — three tails (4:3)",
  },
  [NARUTO_IMAGE_KEYS.stageFour]: {
    tr: "Kademe 4 — manto (4:3)",
    en: "Stage 4 — the cloak (4:3)",
  },
  [NARUTO_IMAGE_KEYS.stageSix]: {
    tr: "Kademe 6 — altı kuyruk (4:3)",
    en: "Stage 6 — six tails (4:3)",
  },
  [NARUTO_IMAGE_KEYS.stageEight]: {
    tr: "Kademe 8 — mührün eşiği (4:3)",
    en: "Stage 8 — the breaking seal (4:3)",
  },
  [NARUTO_IMAGE_KEYS.stageFull]: {
    tr: "Kademe 9 — tam Kurama (4:3)",
    en: "Stage 9 — full Kurama (4:3)",
  },
  [NARUTO_IMAGE_KEYS.stageBijuu]: {
    tr: "Bijuu Modu — sennin + Kurama (4:3)",
    en: "Bijū Mode — sage + Kurama (4:3)",
  },
  [NARUTO_IMAGE_KEYS.stageBaryon]: {
    tr: "Baryon Modu (4:3)",
    en: "Baryon Mode (4:3)",
  },
  [NARUTO_IMAGE_KEYS.jutsuRasengan]: {
    tr: "Rasengan sahnesi (16:9)",
    en: "Rasengan scene (16:9)",
  },
  [NARUTO_IMAGE_KEYS.jutsuKageBunshin]: {
    tr: "Kage Bunshin sahnesi (16:9)",
    en: "Kage Bunshin scene (16:9)",
  },
  [NARUTO_IMAGE_KEYS.jutsuSennin]: {
    tr: "Sennin Modo sahnesi (16:9)",
    en: "Sage Mode scene (16:9)",
  },
  [NARUTO_IMAGE_KEYS.tagRasenshuriken]: {
    tr: "Etiket — Rasenshuriken (3:4)",
    en: "Tag — Rasenshuriken (3:4)",
  },
  [NARUTO_IMAGE_KEYS.tagBond]: {
    tr: "Etiket — ödünç chakra (3:4)",
    en: "Tag — borrowed chakra (3:4)",
  },
  [NARUTO_IMAGE_KEYS.tagSeal]: {
    tr: "Etiket — Uzumaki mührü (3:4)",
    en: "Tag — the Uzumaki seal (3:4)",
  },
  [NARUTO_IMAGE_KEYS.tagGamakichi]: {
    tr: "Etiket — Gamakichi (3:4)",
    en: "Tag — Gamakichi (3:4)",
  },
  [NARUTO_IMAGE_KEYS.eraSealed]: {
    tr: "Dönem — mühürlenen bebek (16:9)",
    en: "Era — the sealed newborn (16:9)",
  },
  [NARUTO_IMAGE_KEYS.eraTeam7]: {
    tr: "Dönem — Iruka ve Takım 7 (16:9)",
    en: "Era — Iruka and Team 7 (16:9)",
  },
  [NARUTO_IMAGE_KEYS.eraJiraiya]: {
    tr: "Dönem — Jiraiya ve Rasengan (16:9)",
    en: "Era — Jiraiya and the Rasengan (16:9)",
  },
  [NARUTO_IMAGE_KEYS.eraPain]: {
    tr: "Dönem — Pain ve köyün tanıması (16:9)",
    en: "Era — Pain and the village's recognition (16:9)",
  },
  [NARUTO_IMAGE_KEYS.eraWar]: {
    tr: "Dönem — Dördüncü Savaş ve Hokage (16:9)",
    en: "Era — the Fourth War and Hokage (16:9)",
  },
};

/* ── Yoldaşlar ───────────────────────────────────────────────────────────
   Portreler veritabanımızdan geliyor (`companionPortraits`); burada yalnız
   AD var, çünkü ad bir tasarım kararı (hangi yazılışı gösteriyoruz), veri
   değil. Kaydı olmayan karakter sayfada hiç çizilmez. */
export const NARUTO_COMPANION_NAMES: Record<number, string> = {
  13: "Sasuke Uchiha",
  85: "Kakashi Hatake",
  145: "Sakura Haruno",
  1555: "Hinata Hyūga",
  1662: "Gaara",
  2423: "Jiraiya",
  2535: "Minato Namikaze",
  3180: "Pain — Nagato",
  7302: "Kushina Uzumaki",
  7407: "Kurama",
};

/* ── Mod düğmesi ─────────────────────────────────────────────────────── */

export const NARUTO_MODE_TEXT = {
  enter: { tr: "Kurama modu", en: "Kurama mode" },
  exit: { tr: "Kurama modundan çık", en: "Leave Kurama mode" },
  /** Ekran okuyucuya modun ne yaptığını söyleyen kısa açıklama */
  note: {
    tr: "Sayfayı mührün içinden gösterir: kafes çizgileri belirir, ışık kızıla döner.",
    en: "Shows the page from inside the seal: the cage lines appear and the light turns red.",
  },
} as const;

/* ── Hero ────────────────────────────────────────────────────────────── */

export const NARUTO_HERO = {
  name: "Naruto Uzumaki",
  nativeName: "うずまきナルト",
  /** Arşivin kendi cümlesi — replik DEĞİL, bu yüzden tırnaksız dizilir. */
  epigraph: {
    tr: "Köyün ondan sakladığı şey içindeydi; köyün ona vermediği şey dışarıda, herkesin elindeydi. On yedi yılda ikisini aynı yere getirdi.",
    en: "What the village hid from him was inside him; what the village withheld was outside, in everyone else's hands. In seventeen years he brought the two to the same place.",
  },
  tags: [
    { tr: "Konohagakure", en: "Konohagakure" },
    { tr: "Dokuz Kuyruklu'nun kabı", en: "Jinchūriki of the Nine-Tails" },
    { tr: "Yedinci Hokage", en: "Seventh Hokage" },
  ],
} as const;

/* ── Künye şeridi ─────────────────────────────────────────────────────
   Sayılar `anilist-detay.json`dan (id 17): doğum 10 Ekim, kan grubu B,
   yaş "12-17 (Naruto), 27- (Boruto)", boy trait'i "145-180 cm". Geri
   kalanı seri künyesi. Son hücre CANLI: kuyruk rayı onu değiştiriyor. */

export const NARUTO_IDENTITY = {
  heading: { tr: "Künye", en: "Record" },
  pressureLabel: { tr: "Chakra basıncı", en: "Chakra pressure" },
  rows: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "10 Ekim", en: "October 10" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "145 – 180 cm (seri boyunca)", en: "145–180 cm (across the series)" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "B", en: "B" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "12 – 17 · Boruto'da 27+", en: "12–17 · 27+ in Boruto" },
    },
    {
      label: { tr: "Rütbe", en: "Rank" },
      value: { tr: "Genin → Yedinci Hokage", en: "Genin → Seventh Hokage" },
    },
    {
      label: { tr: "Takım", en: "Team" },
      value: { tr: "Takım 7 — Kakashi, Sasuke, Sakura", en: "Team 7 — Kakashi, Sasuke, Sakura" },
    },
    {
      label: { tr: "Doğa türü", en: "Nature type" },
      value: { tr: "Rüzgâr — Fūton", en: "Wind — Fūton" },
    },
    {
      label: { tr: "Sembolik obje", en: "Token" },
      value: { tr: "Iruka'nın alın koruyucusu", en: "Iruka's forehead protector" },
    },
  ],
} as const;

/* ── Kuyruk rayı — sayfanın kalbi ────────────────────────────────────── */

export interface NarutoStage {
  key: string;
  /** Ray üstündeki kısa ad — panelde tam ad kullanılır */
  short: LocalizedText;
  /** Ray üstündeki işaret — kuyruk sayısı. Son üç kademe de dokuz taşır. */
  mark: string;
  /** Yelpazede kaç kuyruk açılacak (CSS `--tails`) */
  tails: number;
  /** Düğüm glifi — NarutoGlyphs'teki çizim */
  node: "seal" | "ember" | "cloak" | "beast" | "sage" | "fusion";
  native: string;
  name: LocalizedText;
  when: LocalizedText;
  text: LocalizedText;
  /** Künyedeki canlı satırın değeri */
  pressure: LocalizedText;
  /** O kademenin bedeli — panelin alt satırı */
  cost: LocalizedText;
  imageKey: string;
  /** Panelde yüzü görünecek yoldaş (varsa) */
  companionId?: number;
}

export const NARUTO_SCALE = {
  title: { tr: "Dokuz Kuyruk Ölçeği", en: "The Nine-Tail Scale" },
  lede: {
    tr: "Kuyruk sayısı bir güç ölçüsü değil, bir mesafe ölçüsüdür: Naruto ile içindeki şey arasındaki mesafe. Ölçek dokuzda biter — sondaki iki kademe de dokuz kuyruk taşır, ama artık sayıyı değil ilişkiyi anlatır.",
    en: "The tail count measures distance, not power — the distance between Naruto and the thing inside him. The scale ends at nine; the last two stops still carry nine tails, but they describe a relationship rather than a number.",
  },
  railLabel: { tr: "Kuyruk kademesi", en: "Tail stage" },
  hint: {
    tr: "Ok tuşlarıyla kademeler arasında gezinebilirsin.",
    en: "Use the arrow keys to move between stages.",
  },
  whenLabel: { tr: "Ne zaman", en: "When" },
  costLabel: { tr: "Bedeli", en: "Cost" },
  /** Yelpazenin ekran okuyucu karşılığı — kuyruk sayısı görsel bilgi */
  fanLabel: {
    tr: "Açılan kuyruk sayısı",
    en: "Tails unfurled",
  },
} as const;

/**
 * Dokuz kademe.
 *
 * ⚠️ ISI EĞRİSİ CSS'te (`--nrt-heat`) ve bilinçli olarak MONOTON DEĞİL:
 * 0 → 1 → 0.34. Dokuzuncu kuyrukta tepe yapar, Bijuu Modu'nda düşer.
 * Sebebi sayfanın tezi: kontrol daha çok ısı değil, ortaklık. Kademe
 * sırasını değiştirirsen CSS'teki `[data-tail]` merdivenini de güncelle.
 *
 * Tip AÇIKÇA yazıldı (`as const` değil): `companionId` yalnız bazı
 * kademelerde var ve `as const` ile dizi elemanları ayrık literal tiplere
 * dönüşüp `stage.companionId` erişimini kırardı.
 */
export const NARUTO_STAGES: NarutoStage[] = [
  {
    key: "human",
    short: { tr: "Mühürlü", en: "Sealed" },
    mark: "0",
    tails: 0,
    node: "seal",
    native: "封印",
    name: { tr: "Mühürlü", en: "Sealed" },
    when: {
      tr: "Doğduğu geceden itibaren",
      en: "From the night he was born",
    },
    text: {
      tr: "Mühür kapalı. Karnındaki sekiz uçlu desen Dördüncü Hokage'nin son işidir: içeride bir kuyruklu canavar, dışarıda yalnız bir çocuk. Bu kademede Naruto'nun elinde yalnızca kendi chakrası var — Uzumaki kanından gelen, yaşına göre fazlaca büyük bir kap.",
      en: "The seal is shut. The eight-trigram pattern on his stomach is the Fourth Hokage's last act: a tailed beast inside, a lonely boy outside. At this stage Naruto has only his own chakra — an Uzumaki reservoir far too large for his age.",
    },
    pressure: { tr: "kapalı — yalnız kendi chakrası", en: "sealed — his own chakra only" },
    cost: {
      tr: "Bedeli yok. Yalnızlığı var.",
      en: "No cost. Only the loneliness.",
    },
    imageKey: NARUTO_IMAGE_KEYS.stageHuman,
  },
  {
    key: "one",
    short: { tr: "Bir kuyruk", en: "One tail" },
    mark: "1",
    tails: 1,
    node: "ember",
    native: "一尾",
    name: { tr: "Bir kuyruk", en: "One tail" },
    when: {
      tr: "12 yaş — Nami ülkesindeki köprü",
      en: "Age 12 — the bridge in the Land of Waves",
    },
    text: {
      tr: "Sasuke'nin yerde yattığını gördüğü an mühürden ilk kez bir şey taşar: kızıl bir buhar, sivrilen tırnaklar, kendiliğinden kapanan yaralar. Bu kuyruk çağrılmaz, çekilir — güç değil, kaybetme korkusu açar kapıyı.",
      en: "The moment he sees Sasuke lying on the ground, something spills through the seal for the first time: red vapour, sharpening nails, wounds that close by themselves. This tail is not summoned but pulled — the door is opened by the fear of losing someone, not by power.",
    },
    pressure: { tr: "ilk taşma — öfkeyle", en: "first overflow — through rage" },
    cost: {
      tr: "O an ne yaptığını hatırlamıyor.",
      en: "He does not remember what he did.",
    },
    imageKey: NARUTO_IMAGE_KEYS.stageOne,
  },
  {
    key: "three",
    short: { tr: "Üç kuyruk", en: "Three tails" },
    mark: "3",
    tails: 3,
    node: "ember",
    native: "三尾",
    name: { tr: "Üç kuyruk", en: "Three tails" },
    when: {
      tr: "15 yaş — Tenchi Köprüsü'ne giden yol",
      en: "Age 15 — the road to Tenchi Bridge",
    },
    text: {
      tr: "Üçüncü kuyrukta chakra biçim kazanır: deriye yapışır, tilkinin hatları görünür. Yamato'nun bastırma mührü artık bir tedbir değil, zorunluluktur. Sasuke'yi geri getirme sözü ile kendi bedenini yakma hızı ilk kez burada yarışır.",
      en: "At the third tail the chakra takes shape: it clings to his skin and the fox's outline appears. Yamato's suppression seal stops being a precaution and becomes a requirement. Here, for the first time, his promise to bring Sasuke back races against the speed at which he burns himself.",
    },
    pressure: { tr: "manto şekilleniyor — deri yanıyor", en: "the cloak takes shape — skin burning" },
    cost: {
      tr: "Chakra kabuğu kendi derisini yakar.",
      en: "The chakra shroud burns his own skin.",
    },
    imageKey: NARUTO_IMAGE_KEYS.stageThree,
  },
  {
    key: "four",
    short: { tr: "Manto", en: "The cloak" },
    mark: "4",
    tails: 4,
    node: "cloak",
    native: "四尾",
    name: { tr: "Dört kuyruk — manto", en: "Four tails — the cloak" },
    when: {
      tr: "15 yaş — Orochimaru'nun karşısında",
      en: "Age 15 — face to face with Orochimaru",
    },
    text: {
      tr: "Dördüncü kuyruk eşiktir. Manto koyulaşıp dışarıda bir kabuğa dönüşür ve içeride kalan artık Naruto değildir; kendi takımını da vurur. Yamato onu Birinci Hokage'nin kolyesiyle geri çeker. Sonrasında Naruto, mühür odasında kafesin önüne ilk kez pazarlık etmeye gider.",
      en: "The fourth tail is the threshold. The cloak darkens into a shell and what remains inside is no longer Naruto; he strikes his own team as well. Yamato hauls him back with the First Hokage's necklace. Afterwards Naruto walks to the cage in the seal chamber for the first time — to bargain.",
    },
    pressure: { tr: "kabuk dışarıda — dost düşman ayrımı yok", en: "shroud outside — no friend or foe" },
    cost: {
      tr: "Kendi takımını yaralar.",
      en: "He wounds his own team.",
    },
    imageKey: NARUTO_IMAGE_KEYS.stageFour,
  },
  {
    key: "six",
    short: { tr: "Altı kuyruk", en: "Six tails" },
    mark: "6",
    tails: 6,
    node: "cloak",
    native: "六尾",
    name: { tr: "Altı kuyruk", en: "Six tails" },
    when: {
      tr: "16 yaş — Konoha'nın enkazında, Pain'e karşı",
      en: "Age 16 — in the ruins of Konoha, against Pain",
    },
    text: {
      tr: "Köy yıkılmış, Hinata gözünün önünde düşmüştür. Altıncı kuyruk buradan çıkar: chakra artık manto değil, kemik gibi bir kafestir ve Naruto'nun kendi sesi duyulmaz. Bu kademede Kurama ilk kez pazarlıksız öne geçer.",
      en: "The village is levelled and Hinata has fallen in front of him. The sixth tail comes out of that: the chakra is no longer a cloak but a bone-like cage, and Naruto's own voice cannot be heard. Here Kurama steps forward for the first time without negotiating.",
    },
    pressure: { tr: "sınır aşıldı — mühür zorlanıyor", en: "limit passed — the seal is straining" },
    cost: {
      tr: "Kendi iradesi susar.",
      en: "His own will falls silent.",
    },
    imageKey: NARUTO_IMAGE_KEYS.stageSix,
  },
  {
    key: "eight",
    short: { tr: "Sekiz kuyruk", en: "Eight tails" },
    mark: "8",
    tails: 8,
    node: "beast",
    native: "八尾",
    name: { tr: "Sekiz kuyruk", en: "Eight tails" },
    when: {
      tr: "16 yaş — mührün kopma anı",
      en: "Age 16 — the moment the seal tears",
    },
    text: {
      tr: "Sekizinci kuyrukta mühür yırtılmaya başlar. Kurama'nın kurtulmasına tek bir hamle kalmışken, mühre yerleştirilmiş Minato'nun chakrası belirip oğlunu tutar. Naruto babasını ilk kez orada görür: on altı yıl sonra, kaybetmenin eşiğinde.",
      en: "At the eighth tail the seal begins to tear. With Kurama one move from breaking free, Minato's chakra — left inside the seal for exactly this — appears and holds his son. Naruto sees his father for the first time there: sixteen years late, on the edge of losing everything.",
    },
    pressure: { tr: "mühür yırtılıyor — bir hamle kaldı", en: "the seal is tearing — one move left" },
    cost: {
      tr: "Mührü kapatan babasıdır.",
      en: "It is his father who closes the seal.",
    },
    imageKey: NARUTO_IMAGE_KEYS.stageEight,
    companionId: 2535,
  },
  {
    key: "full",
    short: { tr: "Tam Kurama", en: "Full Kurama" },
    mark: "9",
    tails: 9,
    node: "beast",
    native: "九尾",
    name: { tr: "Tam Kurama", en: "Full Kurama" },
    when: {
      tr: "16 – 17 yaş — Şelale ve mühür tapınağı",
      en: "Age 16–17 — the falls and the seal temple",
    },
    text: {
      tr: "Dokuz kuyruk: kaptan taşmış hâl. Naruto bu biçimi uzun süre düşman olarak görür — önce Hakikat Şelalesi'nde kendi nefretiyle, sonra tapınakta doğrudan Kurama'yla karşılaşır. Chakrayı zorla çeker; tilki kaçmaya kalkarken araya annesinin zinciri girer. Ölçeğin sonu burasıdır, sayı daha fazla büyümez.",
      en: "Nine tails: what overflows the vessel. For a long time Naruto treats this form as an enemy — first meeting his own hatred at the Falls of Truth, then Kurama itself in the temple. He tears the chakra out by force; as the fox lunges for freedom his mother's chains come between them. This is the end of the scale — the number cannot grow further.",
    },
    pressure: { tr: "ölçek sonu — kap ile canavar aynı bedende", en: "end of scale — vessel and beast in one body" },
    cost: {
      tr: "Kazanan taraf yok; ikisi de tükenir.",
      en: "Neither side wins; both are spent.",
    },
    imageKey: NARUTO_IMAGE_KEYS.stageFull,
    companionId: 7302,
  },
  {
    key: "bijuu",
    short: { tr: "Bijuu Modu", en: "Bijū Mode" },
    mark: "9",
    tails: 9,
    node: "sage",
    native: "仙法・九尾チャクラモード",
    name: { tr: "Sennin + Kurama — Bijuu Modu", en: "Sage + Kurama — Bijū Mode" },
    when: {
      tr: "17 yaş — Dördüncü Büyük Ninja Savaşı",
      en: "Age 17 — the Fourth Great Ninja War",
    },
    text: {
      tr: "Sayı aynı: dokuz. Değişen ilişki. Naruto tilkiye adını sorar, ilk kez «Kurama» der ve kafesin kapısını kendi eliyle açar. Chakra artık çekilmiyor, veriliyor. Sennin modunun doğa enerjisi bunun üstüne binince ortaya çıkan manto altın rengidir — kızıl değil. Sayfanın bütün iddiası bu kademede: ısı düşer, güç artar.",
      en: "The number is the same: nine. The relationship is not. Naruto asks the fox its name, says «Kurama» for the first time, and opens the cage himself. The chakra is no longer taken but given. When Sage Mode's natural energy is layered on top, the cloak that appears is gold — not red. The whole argument of this page sits at this stage: the heat drops and the power rises.",
    },
    pressure: { tr: "ortaklık — chakra ödünç değil, paylaşık", en: "partnership — chakra shared, not borrowed" },
    cost: {
      tr: "Bedeli güven.",
      en: "The cost is trust.",
    },
    imageKey: NARUTO_IMAGE_KEYS.stageBijuu,
    companionId: 7407,
  },
  {
    key: "baryon",
    short: { tr: "Baryon", en: "Baryon" },
    mark: "9",
    tails: 9,
    node: "fusion",
    native: "バリオンモード",
    name: { tr: "Baryon Modu", en: "Baryon Mode" },
    when: {
      tr: "Boruto çağı — Isshiki Ōtsutsuki'ye karşı",
      en: "The Boruto era — against Isshiki Ōtsutsuki",
    },
    text: {
      tr: "Naruto ile Kurama chakralarını bir füzyon gibi birleştirir: iki ayrı enerji tek bir yeni enerjiye dönüşür ve karşısındakinin ömrünü yakar. Bedel tek taraflı değildir. Kurama bu kademenin sonunda kaybolur — ve gidenin kim olduğunu Naruto'ya söyleyen yine kendisidir.",
      en: "Naruto and Kurama fuse their chakra the way particles fuse: two separate energies become one new energy, and it burns away the opponent's lifespan. The cost is not one-sided. Kurama is gone at the end of this stage — and the one who tells Naruto who is leaving is Kurama itself.",
    },
    pressure: { tr: "füzyon — yakıt ömrün kendisi", en: "fusion — the fuel is life itself" },
    cost: {
      tr: "Kurama geri dönmez.",
      en: "Kurama does not come back.",
    },
    imageKey: NARUTO_IMAGE_KEYS.stageBaryon,
    companionId: 7407,
  },
];

/* ── Laboratuvar ─────────────────────────────────────────────────────── */

export interface NarutoJutsu {
  key: "rasengan" | "kagebunshin" | "sennin";
  name: string;
  native: string;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
  imageKey: string;
}

export const NARUTO_LAB = {
  title: { tr: "Avucunda taşıdıkları", en: "What he carries in his palm" },
  lede: {
    tr: "Üçü büyük, dördü küçük. Ortak yanları şu: hiçbiri ona doğuştan verilmedi.",
    en: "Three large, four small. What they share: not one of them was given to him at birth.",
  },
  jutsu: [
    {
      key: "rasengan",
      name: "Rasengan",
      native: "螺旋丸",
      tagline: {
        tr: "El mührü yok. Yalnızca avuçta dönen bir küre.",
        en: "No hand seals. Just a sphere spinning in the palm.",
      },
      text: {
        tr: "Dördüncü Hokage'nin üç yılda geliştirdiği şekil dönüşümü; Jiraiya bunu Naruto'ya üç adımda öğretti: su balonunu döndürerek patlatmak, lastik topu içeriden patlatmak, sonra kabuğu ayakta tutmak. Naruto ilk iki adımı herkesten hızlı geçti, çünkü aynı anda yüzlerce el çalışıyordu. Teknik babasının imzasıydı — Naruto onu babasını tanımadan öğrendi.",
        en: "A shape transformation the Fourth Hokage spent three years building; Jiraiya taught it to Naruto in three steps: burst a water balloon by spinning it, burst a rubber ball from the inside, then hold the shell steady. Naruto cleared the first two faster than anyone, because hundreds of hands were working at once. The technique was his father's signature — he learned it without knowing his father.",
      },
      traits: [
        { tr: "Şekil dönüşümü", en: "Shape transformation" },
        { tr: "El mührü gerektirmez", en: "Needs no hand seals" },
        { tr: "Jiraiya'dan", en: "From Jiraiya" },
      ],
      imageKey: NARUTO_IMAGE_KEYS.jutsuRasengan,
    },
    {
      key: "kagebunshin",
      name: "Kage Bunshin no Jutsu",
      native: "影分身の術",
      tagline: {
        tr: "Sınıfta kalan çocuk, yasak parşömeni bir gecede okudu.",
        en: "The boy who failed the exam read the forbidden scroll in one night.",
      },
      text: {
        tr: "Sıradan bir gölge kopyası değil: her kopya gerçek bir bedendir, kendi chakrasını taşır ve dağıldığında öğrendiği her şeyi asıl bedene geri gönderir. Bu yüzden Naruto'nun en büyük yeteneği yumruğu değil öğrenme hızıdır; bir günde bin günlük çalışma sığdırabilir. Ve daha küçük bir gerçek: hayatında ilk kez boş masaya kendisiyle oturmuştur.",
        en: "Not an ordinary shadow copy: each clone is a real body with its own chakra, and when it disperses it sends everything it learned back to the original. That is why Naruto's greatest gift is not his fist but his rate of learning; he can fit a thousand days of practice into one. And a smaller truth: at that empty table he sat down with himself for the first time.",
      },
      traits: [
        { tr: "B sınıfı yasak teknik", en: "B-rank forbidden technique" },
        { tr: "Deneyim geri döner", en: "Experience returns" },
        { tr: "Chakra bedeli yüksek", en: "Expensive in chakra" },
      ],
      imageKey: NARUTO_IMAGE_KEYS.jutsuKageBunshin,
    },
    {
      key: "sennin",
      name: "Sennin Modo",
      native: "仙人モード",
      tagline: {
        tr: "Kıpırdamadan durabilmek — onun için en zor iş.",
        en: "Staying perfectly still — the hardest task he was ever set.",
      },
      text: {
        tr: "Myōbokuzan'da kurbağa büyücülerinden öğrendi: doğa enerjisini bedeninde kendi chakrasıyla dengede tutmak. Denge kaçarsa taşa döner; bu yüzden Fukasaku'nun omzundaki gözler ve enerjiyi dışarıda toplayan kage bunshin'ler devreye girer. Modda gözler kurbağa gözüne döner, algı köyün ötesine uzanır, her vuruş doğa enerjisiyle ağırlaşır. Jiraiya bu modu hiç tamamlayamadı; öğrencisi tamamladı.",
        en: "He learned it from the toad sages of Mount Myōboku: holding natural energy in balance with his own chakra. Lose the balance and you turn to stone, which is why Fukasaku rides his shoulder and shadow clones gather the energy elsewhere. In the mode his eyes become toad eyes, his perception reaches past the village, and every strike carries the weight of nature. Jiraiya never completed this mode; his student did.",
      },
      traits: [
        { tr: "Doğa enerjisi", en: "Natural energy" },
        { tr: "Geniş algı yarıçapı", en: "Wide sensory radius" },
        { tr: "Kıpırdamadan toplanır", en: "Gathered by staying still" },
      ],
      imageKey: NARUTO_IMAGE_KEYS.jutsuSennin,
    },
  ] satisfies NarutoJutsu[],
  /** Dört mühür etiketi — kâğıt fişler */
  tags: [
    {
      key: "rasenshuriken",
      name: "Fūton: Rasenshuriken",
      native: "風遁・螺旋手裏剣",
      note: {
        tr: "Rasengan'a rüzgâr doğası eklendi: hücre seviyesinde kesen bir şuriken. İlk hâli fırlatılamıyor, Naruto'nun kendi kolunu da parçalıyordu. Sennin modu onu atılabilir hâle getirdi.",
        en: "Wind nature added to the Rasengan: a shuriken that cuts at the cellular level. The first version could not be thrown and shredded Naruto's own arm as well. Sage Mode made it a throwing weapon.",
      },
      imageKey: NARUTO_IMAGE_KEYS.tagRasenshuriken,
    },
    {
      key: "bond",
      name: "Ödünç chakra",
      native: "尾獣チャクラ",
      note: {
        tr: "Dördüncü Savaş'ta Naruto, Kurama'nın chakrasını yanındaki bütün orduya dağıttı: binlerce shinobi aynı anda altın bir manto taşıdı. Kuyruklu canavar chakrası ilk kez silah olarak değil, bağ olarak kullanıldı.",
        en: "In the Fourth War Naruto handed Kurama's chakra to the entire allied army: thousands of shinobi wore a golden cloak at the same time. For once, tailed-beast chakra was used as a bond rather than a weapon.",
      },
      imageKey: NARUTO_IMAGE_KEYS.tagBond,
    },
    {
      key: "seal",
      name: "Uzumaki mühür mirası",
      native: "封印術",
      note: {
        tr: "Annesinin klanı mühürcülükte ustaydı. Kurama'yı tutan sekiz uçlu desen de Kushina'nın chakra zincirleri de aynı kandan gelir. Konoha yeleklerinin sırtındaki spiral, o klanın köye bıraktığı iz.",
        en: "His mother's clan were masters of sealing. The eight-trigram pattern that holds Kurama and Kushina's chakra chains come from the same blood. The spiral on the back of every Konoha flak jacket is that clan's mark on the village.",
      },
      imageKey: NARUTO_IMAGE_KEYS.tagSeal,
    },
    {
      key: "gamakichi",
      name: "Kuchiyose: Gamakichi",
      native: "口寄せ・ガマ吉",
      note: {
        tr: "Gamabunta'nın oğlu. Naruto onu ilk çağırdığında avuç içi kadardı; savaşta artık Naruto'yu sırtında taşıyordu. İkisi birlikte büyüdü — hem ilk sözleşmesi hem en eski arkadaşlarından biri.",
        en: "Gamabunta's son. The first time Naruto summoned him he fitted in a palm; by the war he carried Naruto on his back. The two grew up together — his first contract and one of his oldest friends.",
      },
      imageKey: NARUTO_IMAGE_KEYS.tagGamakichi,
    },
  ],
} as const;

/* ── Kader çizelgesi ─────────────────────────────────────────────────── */

export interface NarutoEra {
  key: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  /** Kanon replik — yalnız emin olunan yerde dolu */
  quote?: LocalizedText;
  /** Arşivin kendi notu — replik DEĞİL, tırnaksız dizilir */
  note?: LocalizedText;
  /** O dönemde yanında olanlar; portreleri veritabanından gelir */
  companionIds: number[];
  imageKey: string;
}

export const NARUTO_CHRONICLE = {
  title: { tr: "Reddedilmişten kabul edilmişe", en: "From rejected to accepted" },
  lede: {
    tr: "Beş durak. Aralarındaki mesafe yıl değil, bakış: köyün ona nasıl baktığı.",
    en: "Five stops. What separates them is not years but a gaze — the way the village looked at him.",
  },
  /** Yoldaş yüzlerinin başlığı */
  withLabel: { tr: "Yanındakiler", en: "Who was there" },
} as const;

/**
 * Beş durak. `quote` yalnızca EMİN OLUNAN replikte dolu; geri kalan
 * duraklarda `note` var — o arşivin kendi cümlesi, replik değil (kural:
 * uydurma replik yazma). Tip açıkça yazıldı, `as const` değil: iki alan da
 * opsiyonel ve literal tipler erişimi kırardı.
 */
export const NARUTO_ERAS: NarutoEra[] = [
  {
    key: "sealed",
    age: { tr: "0 – 12", en: "0 – 12" },
    title: { tr: "Mühürlenen bebek", en: "The sealed newborn" },
    text: {
      tr: "10 Ekim gecesi Kurama Konoha'ya saldırdı. Dördüncü Hokage Minato canavarı yeni doğmuş oğluna mühürledi ve o mühürle birlikte öldü; Kushina da o gece kaldı. Minato'nun son dileği çocuğun bir kahraman sayılmasıydı. Köy tersini yaptı: yetişkinler nefret etti, çocuklar ebeveynlerini taklit etti. Naruto sebebini bilmeden dışlandı ve fark edilmenin tek yolunu buldu — şaka yapmak.",
      en: "On the night of October 10 Kurama attacked Konoha. The Fourth Hokage, Minato, sealed the beast into his newborn son and died with that seal; Kushina stayed behind that night too. Minato's last wish was that the boy be seen as a hero. The village did the opposite: the adults hated him and the children copied their parents. Naruto was cast out without being told why, and found the only way left to be noticed — pranks.",
    },
    /** Arşivin kendi notu — replik değil, bu yüzden tırnak yok */
    note: {
      tr: "Bir bebeğe düşman muamelesi yapmak için önce onun adını unutmak gerekiyor. Köy tam olarak bunu yaptı: ona yıllarca «Dokuz Kuyruklu» dedi.",
      en: "To treat a baby as an enemy you first have to forget his name. That is exactly what the village did: for years it called him «the Nine-Tails».",
    },
    companionIds: [2535, 7302, 7407],
    imageKey: NARUTO_IMAGE_KEYS.eraSealed,
  },
  {
    key: "team7",
    age: { tr: "12", en: "12" },
    title: { tr: "Iruka'nın kabulü ve Takım 7", en: "Iruka's acceptance and Team 7" },
    text: {
      tr: "Mizuki, Naruto'yu yasak parşömeni çalmaya kandırdı; o gece Naruto kage bunshin'i tek başına öğrendi. Mizuki gerçeği yüzüne fırlattığında araya giren Iruka oldu — onu içindeki canavarla değil, adıyla anan ilk yetişkin. Iruka kendi alın koruyucusunu çıkarıp ona taktı. Ertesi gün Naruto, Kakashi'nin altında Sasuke ve Sakura ile Takım 7'ye verildi: hayatında ilk kez bir yere ait oldu.",
      en: "Mizuki tricked Naruto into stealing the forbidden scroll; that night he taught himself the shadow clone. When Mizuki threw the truth in his face, Iruka stepped in — the first adult who named him instead of naming the beast. Iruka took off his own forehead protector and tied it on him. The next day Naruto was placed in Team 7 under Kakashi, with Sasuke and Sakura: for the first time in his life he belonged somewhere.",
    },
    quote: {
      tr: "Hokage olacak adam benim.",
      en: "I'm the one who's going to be Hokage.",
    },
    companionIds: [85, 13, 145],
    imageKey: NARUTO_IMAGE_KEYS.eraTeam7,
  },
  {
    key: "jiraiya",
    age: { tr: "13 – 15", en: "13 – 15" },
    title: { tr: "Jiraiya ve Rasengan", en: "Jiraiya and the Rasengan" },
    text: {
      tr: "Üç yıl köyün dışında, tek bir ustayla. Jiraiya ona Rasengan'ı, kuyruklu canavarın chakrasını çekmeyi ve daha önemlisi vazgeçmemenin bir teknik olmadığını öğretti. Naruto ona «Ero-sennin» dedi; Jiraiya ona hiç «öğrencim» demeden vaftiz babası gibi davrandı. Dönüşte ilk iş Gaara'yı Akatsuki'nin elinden almak oldu — kendisi gibi bir kabı kurtarmak.",
      en: "Three years outside the village with a single master. Jiraiya taught him the Rasengan, how to draw on the tailed beast, and — more importantly — that refusing to give up is not a technique. Naruto called him «Ero-sennin»; Jiraiya acted like a godfather without ever calling him «my student». The first job after the return was pulling Gaara out of Akatsuki's hands — saving a vessel like himself.",
    },
    note: {
      tr: "Jiraiya, Pain'in elinde öldüğünde geriye bir şifre ve bir soru bıraktı: barış mümkün mü? Naruto'nun bütün ikinci yarısı o sorunun cevabıdır.",
      en: "When Jiraiya died at Pain's hands he left behind a code and a question: is peace possible? The entire second half of Naruto's story is the answer to it.",
    },
    companionIds: [2423, 1662],
    imageKey: NARUTO_IMAGE_KEYS.eraJiraiya,
  },
  {
    key: "pain",
    age: { tr: "16", en: "16" },
    title: { tr: "Pain ve köyün tanıması", en: "Pain, and the village's recognition" },
    text: {
      tr: "Konoha tek bir teknikle düzlendi. Naruto döndüğünde ortada bir enkaz ve bir mezar alanı vardı. Altı Yolu tek tek yendikten sonra Nagato'nun karşısına silahla değil Jiraiya'nın kitabıyla çıktı ve intikamı reddetti. Nagato hayatı geri verdi. Naruto enkazın üstüne indiğinde köy onu omuzlarına aldı — on altı yıl yüzüne bakmayan insanlar adını bağırıyordu.",
      en: "Konoha was flattened by a single technique. Naruto came back to rubble and a field of graves. After beating the Six Paths one by one he faced Nagato with Jiraiya's book instead of a weapon, and refused revenge. Nagato gave the lives back. When Naruto came down onto the rubble the village lifted him onto its shoulders — people who had not looked at him for sixteen years were shouting his name.",
    },
    note: {
      tr: "Bu sayfanın kırılma noktası burası: Naruto'nun gücü değişmedi, köyün bakışı değişti. Kabul, kazanılan bir savaştan sonra değil, reddedilen bir intikamdan sonra geldi.",
      en: "This is the page's hinge: Naruto's power did not change, the village's gaze did. Acceptance came not after a battle won but after a revenge refused.",
    },
    companionIds: [3180, 1555],
    imageKey: NARUTO_IMAGE_KEYS.eraPain,
  },
  {
    key: "war",
    age: { tr: "17 →", en: "17 →" },
    title: { tr: "Dördüncü Savaş, Kurama ve Hokage", en: "The Fourth War, Kurama, and Hokage" },
    text: {
      tr: "Naruto savaşa iki şeyle girdi: bütün orduya dağıttığı chakra ve bir isim. Kafesin önünde tilkiye adını sordu, «Kurama» cevabını aldı ve mührü kendi eliyle açtı. Aynı savaşta babasını, annesini, ustasını ve Sasuke'yi yeniden karşısında buldu. Savaş bittiğinde köy Hokage'sini seçmek zorunda bile kalmadı — sıra, kapı önünde bekletilen çocuğa gelmişti.",
      en: "Naruto entered the war with two things: chakra he handed out to the whole army, and a name. He asked the fox its name at the cage, was answered «Kurama», and opened the seal with his own hand. In the same war he faced his father, his mother, his master and Sasuke again. When it ended the village barely had to choose its Hokage — the turn had come round to the boy who had been kept outside the door.",
    },
    companionIds: [7407, 13],
    imageKey: NARUTO_IMAGE_KEYS.eraWar,
  },
];

/* ── Kapanış ─────────────────────────────────────────────────────────── */

export const NARUTO_CLOSING = {
  /** İki büyük replik — ikisi de Naruto'nun defalarca tekrarladığı sözler. */
  quotes: [
    {
      text: {
        tr: "Sözümden dönmem. Bu benim ninja yolum.",
        en: "I never go back on my word. That's my ninja way.",
      },
      note: {
        tr: "Akademiden Dördüncü Savaş'a kadar tekrarladığı yemin",
        en: "The vow he repeats from the academy to the Fourth War",
      },
    },
    {
      text: {
        tr: "Hokage olacak adam benim.",
        en: "I'm the one who's going to be Hokage.",
      },
      note: {
        tr: "Kimse dinlemezken de söylediği cümle",
        en: "The sentence he kept saying while nobody listened",
      },
    },
  ],
  motto: {
    native: "忍道",
    gloss: { tr: "nindō — ninja yolu", en: "nindō — the ninja way" },
  },
  credit: {
    tr: "Künye bilgileri ve künye portresi AniList'ten (karakter 17). Sayfadaki bütün grafikler — Uzumaki sarmalı, kuyruk yelpazesi, mühür ve düğüm glifleri — arşivin kendi çizimidir; dışarıdan alınmış raster görsel yoktur. Sahne görselleri küratör tarafından yüklenir.",
    en: "Record data and the record portrait come from AniList (character 17). Every graphic on this page — the Uzumaki spiral, the tail fan, the seal and node glyphs — is drawn by the archive; no raster artwork is taken from outside. Scene images are uploaded by the curator.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList entry" },
} as const;
