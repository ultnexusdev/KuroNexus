import type { LocalizedText } from "./types";

/**
 * Rock Lee — "Sekiz Kapı" deneyim sayfasının veri iskeleti.
 *
 * Kural 1'in uygulanışı: sayfada görünen HER metin burada, iki dilli
 * `LocalizedText` çifti olarak duruyor; bileşen yalnızca `pick()` ile
 * seçiyor. Görseller veritabanında (characterId 306, ABILITY yuvası,
 * `rocklee:*` anahtarları — Itachi'deki `itachi:*` deseninin kardeşi).
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────
 * Lee'nin dosyası bir güç listesi değil, bir DİSİPLİN BELGESİ. İki motif
 * taşıyor:
 *
 *   1. SEKİZ KAPI — dikey bir merdiven. Her kapı bir sınırı kaldırır ve
 *      karşılığında bedenden bir şey alır. Kapı açıldıkça sayfanın ısısı
 *      artar (bkz. RockLeeExperience.module.css, `--lee-mix` rampası).
 *   2. TEKRAR — bölüm aralarındaki sayaç satırları. Lee'nin kendine
 *      verdiği cezalar; şaka değil, defter kaydı.
 *
 * ── KAYNAK ───────────────────────────────────────────────────────────
 * Künye satırlarının doğum günü AniList'ten (27 Kasım, `anilist-detay.json`).
 * Boy/kilo/kan grubu/rütbe databook künyesinden elle yazıldı — AniList bu
 * alanları Lee için boş döndürüyor. Replikler yalnızca kaynağından emin
 * olunanlar: uydurma replik yok (BRIEF kural 9).
 */

export const ROCK_LEE_ID = 306;

/**
 * Sergi görselleri — hepsi characterId 306 kaydında ABILITY yuvasında.
 *
 * Kapak portresi bu listede YOK: Lee'nin tam boy portresi PORTRAIT
 * yuvasında zaten yüklü ve `primaryPortrait()` onu getiriyor.
 */
export const LEE_IMAGE_KEYS = {
  /** Hero'nun arkasındaki geniş şafak bandı (21:9 — koşu yolu, toz) */
  dawn: "rocklee:dawn",
  rengeOmote: "rocklee:renge-omote",
  rengeUra: "rocklee:renge-ura",
  hirudora: "rocklee:hirudora",
  minorSenpu: "rocklee:minor-senpu",
  minorSuiken: "rocklee:minor-suiken",
  minorWeights: "rocklee:minor-weights",
  minorBandage: "rocklee:minor-bandage",
  /** Sekizinci kapı sahnesi — merdivenin tepesinde, yalnızca açıkken */
  gateEighth: "rocklee:gate-eighth",
  eraAcademy: "rocklee:era-academy",
  eraGuy: "rocklee:era-guy",
  eraGaara: "rocklee:era-gaara",
  eraKimimaro: "rocklee:era-kimimaro",
  eraWar: "rocklee:era-war",
} as const;

/** Küratör yuvalarının etiketleri — yükleme kutusunun üstünde görünür. */
export const LEE_SLOT_LABELS: Record<string, LocalizedText> = {
  [LEE_IMAGE_KEYS.dawn]: {
    tr: "Şafak bandı — koşu yolu, toz (geniş kadraj)",
    en: "Dawn band — the running road, dust (wide crop)",
  },
  [LEE_IMAGE_KEYS.rengeOmote]: {
    tr: "Omote Renge — Ön Nilüfer",
    en: "Omote Renge — Front Lotus",
  },
  [LEE_IMAGE_KEYS.rengeUra]: {
    tr: "Ura Renge — Ters Nilüfer",
    en: "Ura Renge — Reverse Lotus",
  },
  [LEE_IMAGE_KEYS.hirudora]: {
    tr: "Hirudora — Gündüz Kaplanı",
    en: "Hirudora — Daytime Tiger",
  },
  [LEE_IMAGE_KEYS.minorSenpu]: {
    tr: "Konoha Senpū — dönen tekme",
    en: "Konoha Senpū — the spinning kick",
  },
  [LEE_IMAGE_KEYS.minorSuiken]: {
    tr: "Suiken — sarhoş yumruk",
    en: "Suiken — drunken fist",
  },
  [LEE_IMAGE_KEYS.minorWeights]: {
    tr: "Bacak ağırlıkları",
    en: "The leg weights",
  },
  [LEE_IMAGE_KEYS.minorBandage]: {
    tr: "Bandaj — sarılı yumruk",
    en: "Bandage — the wrapped fist",
  },
  [LEE_IMAGE_KEYS.gateEighth]: {
    tr: "Sekizinci kapı — kızıl buhar",
    en: "The eighth gate — crimson steam",
  },
  [LEE_IMAGE_KEYS.eraAcademy]: {
    tr: "Akademi — chakra tutmayan çocuk",
    en: "The academy — the boy who could not mould chakra",
  },
  [LEE_IMAGE_KEYS.eraGuy]: {
    tr: "Guy'ın çırağı — ilk kapı",
    en: "Guy's student — the first gate",
  },
  [LEE_IMAGE_KEYS.eraGaara]: {
    tr: "Gaara — kum ve ezilen kol",
    en: "Gaara — sand and the crushed arm",
  },
  [LEE_IMAGE_KEYS.eraKimimaro]: {
    tr: "Kimimaro — sarhoş yumruk gecesi",
    en: "Kimimaro — the night of the drunken fist",
  },
  [LEE_IMAGE_KEYS.eraWar]: {
    tr: "Dördüncü Savaş — yedinci kapı",
    en: "The Fourth War — the seventh gate",
  },
};

/* ── Üst şerit ───────────────────────────────────────────────────────── */

export const LEE_CRUMB = {
  universe: { tr: "Naruto Evreni", en: "Naruto Universe" },
};

/* ── 1 · HERO ────────────────────────────────────────────────────────── */

export const LEE_HERO = {
  name: "Rock Lee",
  nativeName: "ロック・リー",
  /** Sayfanın filigranı: 努力 — doryoku, "çaba" */
  watermark: "努力",
  watermarkReading: {
    tr: "doryoku — çaba",
    en: "doryoku — effort",
  },
  aliases: [
    { tr: "Konoha'nın Yeşil Vahşisi", en: "The Green Beast of Konoha" },
    { tr: "Gür Kaşlar", en: "Bushy Brows" },
  ],
  epigraph: {
    tr: "Chakra'sı ninjutsu'ya yetmeyen bir çocuk, geriye kalan tek şeyi seçti: tekrar.",
    en: "A boy whose chakra would never carry a ninjutsu chose the only thing left to him: repetition.",
  },
  standfirst: {
    tr: "Konohagakure'li taijutsu uzmanı. Ninjutsu ve genjutsu kuramıyor; bunun yerine bedenini bir silaha çevirdi ve o silahın sekiz kilidi var.",
    en: "A taijutsu specialist of Konohagakure. He can weave neither ninjutsu nor genjutsu, so he turned his body into the weapon — and that weapon has eight locks.",
  },
  portraitAltUploaded: {
    tr: "Rock Lee — arşive yüklenen tam boy portre",
    en: "Rock Lee — full-length portrait uploaded to the archive",
  },
  portraitAltAnilist: {
    tr: "Rock Lee — AniList künye portresi",
    en: "Rock Lee — AniList profile portrait",
  },
  dawnAlt: {
    tr: "Şafakta koşu yolu — küratör yüklemesi",
    en: "The running road at dawn — curator upload",
  },
  scrollHint: {
    tr: "Merdiven aşağıda başlıyor",
    en: "The ladder begins below",
  },
};

/* ── 2 · MOD DÜĞMESİ ─────────────────────────────────────────────────── */

/**
 * Mod düğmesi merdivenin KISAYOLU: bir tıklamada sekiz kapının hepsini
 * açar, ikinci tıklamada hepsini kapatır. Sayfada tek bir sayı var
 * (0–8) ve ısı da, mod da, merdiven de aynı sayıyı okuyor.
 */
export const LEE_MODE = {
  enter: { tr: "Sekizinci Kapı", en: "Eighth Gate" },
  exit: { tr: "Kapıları kapat", en: "Close the gates" },
  hint: {
    tr: "Sekiz kapıyı birden açar",
    en: "Opens all eight gates at once",
  },
};

/* ── 3 · KÜNYE ŞERİDİ ────────────────────────────────────────────────── */

export const LEE_IDENTITY = {
  title: { tr: "Künye", en: "Registry" },
  lede: {
    tr: "Sayılar databook künyesinden; iki değer varsa soldaki I. Bölüm, sağdaki II. Bölüm.",
    en: "Figures from the databook profile; where two are given, the first is Part I and the second Part II.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "27 Kasım", en: "27 November" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "158,9 cm → 172,1 cm", en: "158.9 cm → 172.1 cm" },
    },
    {
      label: { tr: "Kilo", en: "Weight" },
      value: { tr: "46,5 kg → 54,5 kg", en: "46.5 kg → 54.5 kg" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "A", en: "A" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "13 → 17", en: "13 → 17" },
    },
    {
      label: { tr: "Rütbe", en: "Rank" },
      value: { tr: "Genin → Chūnin", en: "Genin → Chūnin" },
    },
    {
      label: { tr: "Köy", en: "Village" },
      value: { tr: "Konohagakure", en: "Konohagakure" },
    },
    {
      label: { tr: "Uzmanlık", en: "Specialty" },
      value: {
        tr: "Yalnızca taijutsu — ninjutsu yok, genjutsu yok",
        en: "Taijutsu only — no ninjutsu, no genjutsu",
      },
    },
    {
      label: { tr: "Sembolik obje", en: "Symbolic object" },
      value: {
        tr: "Bacak ağırlıkları — tulumun altında, gün boyu",
        en: "Leg weights — under the jumpsuit, all day",
      },
    },
  ],
  teamTitle: { tr: "Takım Guy", en: "Team Guy" },
  teamNote: {
    tr: "Üç öğrenci, bir usta. Lee'nin dosyası bu dörtlünün dışında okunamaz.",
    en: "Three students, one teacher. Lee's file cannot be read outside this quartet.",
  },
  team: [
    {
      characterId: 307,
      name: "Might Guy",
      role: {
        tr: "Usta — kapıları ona o öğretti",
        en: "The teacher — he is the one who taught him the gates",
      },
    },
    {
      characterId: 1694,
      name: "Neji Hyūga",
      role: {
        tr: "Dâhi — Lee'nin kendini ölçtüğü ayna",
        en: "The prodigy — the mirror Lee measured himself against",
      },
    },
    {
      characterId: 3710,
      name: "Tenten",
      role: {
        tr: "Silah ustası — takımın sabit ölçüsü",
        en: "The weapons master — the steady measure of the team",
      },
    },
  ],
  faceAlt: {
    tr: "arşiv portresi",
    en: "archive portrait",
  },
};

/* ── TEKRAR: sayaç satırları ─────────────────────────────────────────── */

export interface LeeTally {
  key: string;
  /** Cezanın koşulu — "şunu yapamazsam" */
  condition: LocalizedText;
  count: number;
  unit: LocalizedText;
  /** Nerede, ne zaman — defter kaydının alt satırı */
  cadence: LocalizedText;
}

/**
 * Lee'nin kendine kestiği cezalar. Sayılar dizideki sıraya göre büyüyor:
 * her satır bir öncekinin başarısızlığına bağlı. Sayfa bunları bölüm
 * aralarına, bir defter kaydı gibi koyuyor — mizah değil.
 */
export const LEE_TALLIES: LeeTally[] = [
  {
    key: "laps",
    condition: {
      tr: "Ters Nilüfer'i bugün de kuramazsam",
      en: "If I fail to land the Reverse Lotus again today",
    },
    count: 500,
    unit: { tr: "tur", en: "laps" },
    cadence: {
      tr: "köyün çevresinde · aynı gün içinde",
      en: "around the village · the same day",
    },
  },
  {
    key: "pushups",
    condition: {
      tr: "Beş yüz turu tamamlayamazsam",
      en: "If I cannot finish the five hundred laps",
    },
    count: 1000,
    unit: { tr: "şınav", en: "push-ups" },
    cadence: {
      tr: "eller yerden kalkmadan · aralıksız",
      en: "hands never leaving the ground · unbroken",
    },
  },
  {
    key: "rope",
    condition: {
      tr: "Bin şınavı kaldıramazsam",
      en: "If the thousand push-ups break me",
    },
    count: 2000,
    unit: { tr: "ip atlama", en: "skips" },
    cadence: {
      tr: "sayı şaşarsa baştan · her seferinde",
      en: "miscount and start over · every time",
    },
  },
  {
    key: "kicks",
    condition: {
      tr: "Sabah antrenmanına bir dakika geç kalırsam",
      en: "If I am one minute late to morning training",
    },
    count: 300,
    unit: { tr: "tekme", en: "kicks" },
    cadence: {
      tr: "kütüğe · gün doğmadan",
      en: "into the training post · before sunrise",
    },
  },
];

/* ── 4 · TEKNİK LABORATUVARI ─────────────────────────────────────────── */

export const LEE_LAB_TITLE = {
  title: { tr: "Nilüfer", en: "The Lotus" },
  lede: {
    tr: "Lee'nin bütün repertuvarı tek bir cümleye dayanır: bedeni taşıyabileceğinden fazlasını yapmaya zorla, sonra bedeli öde. Üç büyük teknik, o cümlenin üç aşaması.",
    en: "Lee's whole repertoire rests on one sentence: force the body past what it can carry, then pay for it. Three great techniques, three stages of that sentence.",
  },
};

export interface LeeTechnique {
  key: "omote" | "ura" | "hirudora";
  imageKey: string;
  name: string;
  kanji: string;
  gloss: LocalizedText;
  /** Kartın üstündeki tek satır — teknik ne yapar */
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
  /** Kaynağı belli olan replik; yoksa alan yazılmaz */
  quote?: LocalizedText;
  altText: LocalizedText;
}

export const LEE_TECHNIQUES: LeeTechnique[] = [
  {
    key: "omote",
    imageKey: LEE_IMAGE_KEYS.rengeOmote,
    name: "Omote Renge",
    kanji: "表蓮華",
    gloss: { tr: "Ön Nilüfer", en: "Front Lotus" },
    tagline: {
      tr: "Birinci kapı açılır ve nilüfer topraktan çıkar.",
      en: "The first gate opens and the lotus breaks through the soil.",
    },
    text: {
      tr: "Rakibi tekmeyle havaya kaldırır, bandajıyla sarar, dönerek ivme toplar ve başı yere gelecek biçimde çakar. Kaimon açılmadan gövde bu dönüşü taşımaz: teknik rakibi kadar kullanıcısını da zorlar, o yüzden yasak sınıfındadır ve Guy'ın izni olmadan kurulmaz.",
      en: "He kicks the opponent skyward, binds them in his bandages, gathers momentum in a spin and drives them head-first into the ground. Without Kaimon the body cannot carry that rotation: the technique strains its user as much as its target, which is why it is forbidden and never thrown without Guy's leave.",
    },
    traits: [
      { tr: "Kaimon şart", en: "Requires Kaimon" },
      { tr: "Bandaj", en: "Bandage" },
      { tr: "Yakın dövüş", en: "Close range" },
    ],
    altText: {
      tr: "Omote Renge sahnesi — küratör yüklemesi",
      en: "Omote Renge scene — curator upload",
    },
  },
  {
    key: "ura",
    imageKey: LEE_IMAGE_KEYS.rengeUra,
    name: "Ura Renge",
    kanji: "裏蓮華",
    gloss: { tr: "Ters Nilüfer", en: "Reverse Lotus" },
    tagline: {
      tr: "Aynı nilüfer, ikinci kez ve daha yüksekte açar.",
      en: "The same lotus, blooming a second time and higher.",
    },
    quote: {
      tr: "Konoha'nın nilüferi iki kez açar.",
      en: "The lotus of the Leaf blooms twice.",
    },
    text: {
      tr: "Seimon'a kadar açılan kapılarla kurulur: deri kızarır, kan basıncı fırlar, hız görüşün önüne geçer. Rakip havada ardışık vuruşlarla tutulur ve yere çakılır. Vuruş dizisi bitmeden beden bedeli ödemeye başlar — kaslar yırtılır, sonrası günlerce yataktır.",
      en: "It is built on gates opened up to Seimon: the skin flushes, blood pressure spikes, speed outruns sight. The opponent is held in the air through a chain of blows and hammered down. The body starts paying before the chain ends — muscle tears, and what follows is days flat on a bed.",
    },
    traits: [
      { tr: "Seimon'a kadar", en: "Up to Seimon" },
      { tr: "Kas yırtılması", en: "Muscle tearing" },
      { tr: "Tek atış", en: "One attempt" },
    ],
    altText: {
      tr: "Ura Renge sahnesi — küratör yüklemesi",
      en: "Ura Renge scene — curator upload",
    },
  },
  {
    key: "hirudora",
    imageKey: LEE_IMAGE_KEYS.hirudora,
    name: "Hirudora",
    kanji: "昼虎",
    gloss: { tr: "Gündüz Kaplanı", en: "Daytime Tiger" },
    tagline: {
      tr: "Ustanın imzası; çırağın ölçüsü.",
      en: "The teacher's signature; the student's measure.",
    },
    text: {
      tr: "Altıncı kapının basıncı bir avuç havaya sıkıştırılır ve tek hamlede bırakılır; patlamanın biçimi bir kaplan başına benzer. Bu teknik Might Guy'ın imzası — Lee'nin dosyasında bir başarı satırı olarak değil, bir hedef satırı olarak duruyor: ustasının vardığı yer.",
      en: "The pressure of the sixth gate is compressed into a handful of air and released in a single strike; the blast takes the shape of a tiger's head. The technique is Might Guy's signature — in Lee's file it is not an achievement but a marker: the place his teacher reached.",
    },
    traits: [
      { tr: "Keimon", en: "Keimon" },
      { tr: "Basınç dalgası", en: "Pressure wave" },
      { tr: "Guy'ın mirası", en: "Guy's legacy" },
    ],
    altText: {
      tr: "Hirudora sahnesi — küratör yüklemesi",
      en: "Hirudora scene — curator upload",
    },
  },
];

export interface LeeMinor {
  key: string;
  imageKey: string;
  /** Çevrilmeyen özel ad — yalnızca jutsu satırlarında var */
  name?: string;
  kanji?: string;
  /** Görünen etiket; özel ad yoksa başlığın kendisi budur */
  label: LocalizedText;
  note: LocalizedText;
  altText: LocalizedText;
}

export const LEE_MINOR: LeeMinor[] = [
  {
    key: "senpu",
    imageKey: LEE_IMAGE_KEYS.minorSenpu,
    name: "Konoha Senpū",
    kanji: "木ノ葉旋風",
    label: { tr: "Konoha Kasırgası", en: "Leaf Whirlwind" },
    note: {
      tr: "Alçak ve yüksek dönme tekmelerinin zinciri. Kapı istemez, ağırlık istemez — Lee'nin kapı açmadan da kurabildiği temel.",
      en: "A chain of low and high spinning kicks. It asks for no gate and no weights — the base Lee can throw with every lock still shut.",
    },
    altText: {
      tr: "Konoha Senpū — küratör yüklemesi",
      en: "Konoha Senpū — curator upload",
    },
  },
  {
    key: "suiken",
    imageKey: LEE_IMAGE_KEYS.minorSuiken,
    name: "Suiken",
    kanji: "酔拳",
    label: { tr: "Sarhoş Yumruk", en: "Drunken Fist" },
    note: {
      tr: "Sarhoş yumruk. Bir yudum sake yeter; hareketin nereye gideceğini kullanıcısı da bilmez. Lee bunu öğrenmedi, kazara buldu.",
      en: "Drunken fist. One mouthful of sake is enough; not even its user knows where the next motion goes. Lee did not learn it — he stumbled into it.",
    },
    altText: {
      tr: "Suiken — küratör yüklemesi",
      en: "Suiken — curator upload",
    },
  },
  {
    key: "weights",
    imageKey: LEE_IMAGE_KEYS.minorWeights,
    label: { tr: "Ağırlıklar", en: "The Weights" },
    note: {
      tr: "Tulumun altında, bacaklarda, gün boyu. Çıkarıldığı an hız iki katına çıkar — ve Lee onları yalnızca gerçekten gerektiğinde çıkarır.",
      en: "Under the jumpsuit, on his shins, all day long. The moment they come off his speed doubles — and he takes them off only when it truly matters.",
    },
    altText: {
      tr: "Bacak ağırlıkları — küratör yüklemesi",
      en: "The leg weights — curator upload",
    },
  },
  {
    key: "bandage",
    imageKey: LEE_IMAGE_KEYS.minorBandage,
    label: { tr: "Bandaj", en: "Bandage" },
    note: {
      tr: "Yumruğu koruyan sargı aynı zamanda tekniğin aleti: Ön Nilüfer'de rakibi saran şey odur. Yıprandıkça değiştirilir; Lee'nin elinde hiç temiz durmaz.",
      en: "The wrap that guards the fist is also the tool of the technique: in the Front Lotus it is what binds the opponent. It is replaced as it frays; on Lee's hands it is never clean.",
    },
    altText: {
      tr: "Bandaj — küratör yüklemesi",
      en: "Bandage — curator upload",
    },
  },
];

/* ── 5 · SEKİZ KAPI (sayfanın kalbi) ─────────────────────────────────── */

export interface LeeGate {
  key: string;
  /** 1–8; kartın büyük rakamı ve merdivendeki basamağı */
  index: number;
  name: string;
  kanji: string;
  gloss: LocalizedText;
  /** Bedendeki yeri */
  site: LocalizedText;
  /** Açılan sınır — kapı neyi serbest bırakıyor */
  limit: LocalizedText;
  /** Bedeli — beden ne ödüyor */
  cost: LocalizedText;
  /** Bu kapıda mümkün olan teknik; her kapıda yok */
  unlocks?: LocalizedText;
  /** Yalnızca sekizinci kapı: sayfa kızıla döner, uyarı çıkar */
  fatal?: boolean;
}

export const LEE_GATES_TITLE = {
  title: { tr: "Sekiz Kapı", en: "The Eight Gates" },
  kanji: "八門遁甲",
  lede: {
    tr: "Beyin, bedeni kendinden korumak için kaslara bir tavan koyar. Sekiz Kapı o tavanı sırayla kaldırır: her kapı bir sınırı siler ve yerine bir yara bırakır. Merdiven aşağıdan yukarı çıkar; bir kapıya dokunduğunda altındakilerin hepsi açılır, ikinci dokunuş onu ve üstündekileri kapatır.",
    en: "The brain caps the muscles to protect the body from itself. The Eight Gates lift that cap one lock at a time: each gate erases a limit and leaves a wound in its place. The ladder climbs from the bottom; touching a gate opens every gate beneath it, and touching it again closes it and everything above.",
  },
  meterLabel: { tr: "Açık kapı", en: "Gates open" },
  openAction: { tr: "Aç", en: "Open" },
  closeAction: { tr: "Kapat", en: "Close" },
  limitLabel: { tr: "Açılan sınır", en: "Limit removed" },
  costLabel: { tr: "Bedel", en: "The price" },
  unlockLabel: { tr: "Burada mümkün", en: "Possible here" },
  siteLabel: { tr: "Yeri", en: "Seat" },
  rungLabel: { tr: "Basamak", en: "Rung" },
  eighthAlt: {
    tr: "Sekizinci kapı sahnesi — küratör yüklemesi",
    en: "The eighth gate scene — curator upload",
  },
};

export const LEE_GATES: LeeGate[] = [
  {
    key: "kaimon",
    index: 1,
    name: "Kaimon",
    kanji: "開門",
    gloss: { tr: "Açılış Kapısı", en: "Gate of Opening" },
    site: { tr: "Beyin", en: "Brain" },
    limit: {
      tr: "Beynin kaslar üzerindeki frenini kaldırır. Beden artık gücünün yüzde yüzünü kullanır — normalde erişilemeyen, çünkü erişilmesi tehlikeli olan pay.",
      en: "Releases the brain's restraint on the muscles. The body now draws a hundred per cent of its strength — the share normally kept out of reach because reaching it is dangerous.",
    },
    cost: {
      tr: "Kas lifleri kendi güçlerine dayanamaz; ilk yırtıklar burada başlar.",
      en: "Muscle fibre cannot withstand its own strength; the first tears begin here.",
    },
    unlocks: { tr: "Omote Renge", en: "Omote Renge" },
  },
  {
    key: "kyumon",
    index: 2,
    name: "Kyūmon",
    kanji: "休門",
    gloss: { tr: "Dinlenme Kapısı", en: "Gate of Healing" },
    site: { tr: "Beyin", en: "Brain" },
    limit: {
      tr: "Yorgunluğu iptal eder: dayanıklılık tazelenir, hız bir kademe daha artar. Kullanıcı bitkinken bile bitkin değilmiş gibi hareket eder.",
      en: "Cancels fatigue: stamina is renewed and speed climbs another notch. The user moves as though not spent, even while spent.",
    },
    cost: {
      tr: "Bedenin “yeter” deme yeteneği kapanır. Uyarı sistemi susmuştur, hasar sessizce birikir.",
      en: "The body loses its ability to say “enough”. The warning system is muted and damage piles up in silence.",
    },
  },
  {
    key: "seimon",
    index: 3,
    name: "Seimon",
    kanji: "生門",
    gloss: { tr: "Yaşam Kapısı", en: "Gate of Life" },
    site: { tr: "Omurilik", en: "Spinal cord" },
    limit: {
      tr: "Kan akışını ve kırmızı kan hücresi üretimini patlatır; deri kızarır. Ters Nilüfer'in gerektirdiği ivme ancak burada toplanır.",
      en: "Blows open blood flow and red cell production; the skin turns red. Only here can the momentum the Reverse Lotus demands be gathered.",
    },
    cost: {
      tr: "Damarlar bu basınç için yapılmadı. Dövüş biter, sonraki günler yatakta geçer.",
      en: "Vessels were not built for this pressure. The fight ends and the days after are spent flat.",
    },
    unlocks: { tr: "Ura Renge", en: "Ura Renge" },
  },
  {
    key: "shomon",
    index: 4,
    name: "Shōmon",
    kanji: "傷門",
    gloss: { tr: "Yara Kapısı", en: "Gate of Pain" },
    site: { tr: "Omurilik", en: "Spinal cord" },
    limit: {
      tr: "Hız ve güç birinci kapının birkaç katına çıkar. Bu noktadan sonra hareketler çıplak gözle takip edilmez.",
      en: "Speed and power multiply several times over the first gate. Past this point the movements cannot be followed by eye.",
    },
    cost: {
      tr: "Kaslar her vuruşta yırtılır. Yaralanma artık ihtimal değil, hesaplanmış bir kesinlik.",
      en: "Muscle tears with every blow. Injury is no longer a risk but a scheduled certainty.",
    },
  },
  {
    key: "tomon",
    index: 5,
    name: "Tomon",
    kanji: "杜門",
    gloss: { tr: "Sınır Kapısı", en: "Gate of Limit" },
    site: { tr: "Karın", en: "Abdomen" },
    limit: {
      tr: "Chakra'nın hacmi devasa büyür ve bedenin çevresinde görülür hâle gelir. Guy'ın büyük teknikleri bu kapıdan sonra kurulur.",
      en: "The volume of chakra swells enormously and becomes visible around the body. Guy's great techniques are built from this gate on.",
    },
    cost: {
      tr: "İç organlar basınç altında çalışır; beden kendi motorunu aşırı yüklemektedir.",
      en: "The organs work under pressure; the body is overloading its own engine.",
    },
  },
  {
    key: "keimon",
    index: 6,
    name: "Keimon",
    kanji: "景門",
    gloss: { tr: "Manzara Kapısı", en: "Gate of View" },
    site: { tr: "Mide", en: "Stomach" },
    limit: {
      tr: "Beden ısısı ter buharlaşacak kadar yükselir; kullanıcının etrafında yeşil bir buhar belirir. Hirudora'nın basıncı burada toplanır.",
      en: "Body heat rises until sweat evaporates; a green vapour gathers around the user. The pressure Hirudora needs is collected here.",
    },
    cost: {
      tr: "Deri kendi buharıyla yanar. Kaslar iflasa bir adım kalmıştır.",
      en: "The skin burns in its own steam. The muscles are one step from failure.",
    },
    unlocks: { tr: "Hirudora", en: "Hirudora" },
  },
  {
    key: "kyomon",
    index: 7,
    name: "Kyōmon",
    kanji: "驚門",
    gloss: { tr: "Şok Kapısı", en: "Gate of Wonder" },
    site: { tr: "Midenin altı", en: "Below the stomach" },
    limit: {
      tr: "Yeşil chakra bedeni tümüyle sarar; hız ve güç insan ölçeğinin dışına çıkar. Lee bu kapıya Dördüncü Savaş'ta vardı.",
      en: "Green chakra sheathes the whole body; speed and power leave the human scale behind. Lee reached this gate in the Fourth War.",
    },
    cost: {
      tr: "Kaslar lif lif kopar, damarlar patlar. Bundan sonrası tedaviyle değil, zamanla ölçülür.",
      en: "Muscle comes apart fibre by fibre and vessels rupture. What follows is measured not in treatment but in years.",
    },
  },
  {
    key: "shimon",
    index: 8,
    name: "Shimon",
    kanji: "死門",
    gloss: { tr: "Ölüm Kapısı", en: "Gate of Death" },
    site: { tr: "Kalp", en: "Heart" },
    limit: {
      tr: "Kalbin kendi freni kalkar. Kullanıcı sekiz kapının tamamını taşıyarak, bir insanın ulaşabileceği en yüksek güce çıkar — birkaç dakikalığına.",
      en: "The heart's own restraint is lifted. Carrying all eight gates at once, the user rises to the greatest power a human can hold — for a few minutes.",
    },
    cost: {
      tr: "Kan buharlaşır, beden yanarak tükenir. Bu kapı geri dönüşü olan bir seçim değil: ölümle ödenir.",
      en: "The blood evaporates and the body burns itself out. This gate is not a choice that can be taken back: it is paid for with death.",
    },
    fatal: true,
  },
];

/** Sekizinci kapı açıkken sayfanın gösterdiği uyarı. */
export const LEE_DEATH_WARNING = {
  title: { tr: "Bu kapı ölümle ödenir", en: "This gate is paid for with death" },
  text: {
    tr: "Shimon açıldığında geri sayım başlar. Teknik bir riski değil, bir sonucu tarif eder: kullanıcı dövüşü kazanabilir, ama dövüşten sağ çıkmaz. Lee'nin dosyasında bu kapı bir yetenek olarak değil, ustasının ödediği bir bedel olarak duruyor.",
    en: "When Shimon opens a countdown begins. The technique describes not a risk but an outcome: the user may win the fight, but does not walk out of it. In Lee's file this gate stands not as an ability but as a price his teacher paid.",
  },
};

/* ── 6 · KADER ÇİZELGESİ ─────────────────────────────────────────────── */

export const LEE_TIMELINE_TITLE = {
  title: { tr: "Kader Çizelgesi", en: "The Ledger of a Life" },
  lede: {
    tr: "Beş kayıt. Hiçbirinde bir yetenek belirmiyor; hepsinde aynı şey tekrar ediyor.",
    en: "Five entries. In none of them does a talent appear; in all of them the same thing repeats.",
  },
};

export interface LeeEra {
  key: string;
  imageKey: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: LocalizedText;
  quoteBy?: string;
  /** Sahnede yanında olan karakter — portresi varsa çizilir */
  companionId?: number;
  altText: LocalizedText;
}

export const LEE_TIMELINE: LeeEra[] = [
  {
    key: "academy",
    imageKey: LEE_IMAGE_KEYS.eraAcademy,
    age: { tr: "0 – 12 yaş", en: "Ages 0 – 12" },
    title: {
      tr: "Chakra tutmayan çocuk",
      en: "The boy who could not hold chakra",
    },
    text: {
      tr: "Akademideki hiçbir denemede ninjutsu ve genjutsu için gereken chakra kontrolünü kuramadı. Sınıfın çoğu için mesele kapanmıştı: bir ninja üç dalın ikisini yapamıyorsa ninja değildir. Lee bunu bir mahkûmiyet değil, bir tarif olarak okudu — geriye tek dal kalmıştı ve o dalda kimseden geri kalmayacaktı.",
      en: "Not once at the academy could he shape the chakra that ninjutsu and genjutsu demand. For most of the class the matter was settled: a shinobi who fails two of the three disciplines is not a shinobi. Lee read it not as a verdict but as an instruction — one discipline was left, and in that one he would fall behind no one.",
    },
    altText: {
      tr: "Akademi yılları — küratör yüklemesi",
      en: "The academy years — curator upload",
    },
  },
  {
    key: "guy",
    imageKey: LEE_IMAGE_KEYS.eraGuy,
    age: { tr: "12 yaş", en: "Age 12" },
    title: { tr: "Guy'ın çırağı ve ilk kapı", en: "Guy's student, and the first gate" },
    text: {
      tr: "Might Guy onda kendi gençliğini gördü ve taijutsu'yu kendi yöntemiyle öğretti: sayarak, tekrarlayarak, başarısızlığa ceza yazarak. Kapıların varlığını da ona o söyledi — ve ilk kapının ancak izinle açılacağını. Lee'nin bütün dosyası bu iki cümlenin arasında geçer.",
      en: "Might Guy saw his own youth in the boy and taught taijutsu his own way: by counting, by repeating, by writing a penalty against every failure. It was Guy who told him the gates existed — and that the first one opens only with permission. Lee's entire file plays out between those two sentences.",
    },
    quote: {
      tr: "Konoha'nın nilüferi iki kez açar.",
      en: "The lotus of the Leaf blooms twice.",
    },
    quoteBy: "Might Guy",
    companionId: 307,
    altText: {
      tr: "Guy'ın çırağı — küratör yüklemesi",
      en: "Guy's student — curator upload",
    },
  },
  {
    key: "gaara",
    imageKey: LEE_IMAGE_KEYS.eraGaara,
    age: { tr: "13 yaş", en: "Age 13" },
    title: { tr: "Gaara, kum ve ameliyat kararı", en: "Gaara, sand, and the surgery" },
    text: {
      tr: "Chūnin sınavında ağırlıklarını çıkardı, kapıları açtı ve hayatının en iyi dövüşünü kaybetti: kum onu havada yakaladı, sol kolu ve sol bacağı ezildi. Ninjalığı bitiren teşhisi Tsunade tersine çevirebilirdi — yüzde elli ihtimalle. Reddetmek sakat ama sağ kalmak, kabul etmek ise ninja kalmak demekti. Lee ameliyatı seçti.",
      en: "At the chūnin exams he dropped his weights, opened the gates and lost the best fight of his life: the sand caught him in the air and crushed his left arm and left leg. Tsunade could reverse the diagnosis that ended his career — at fifty-fifty odds. Refusing meant living, crippled; accepting meant remaining a shinobi. Lee chose the operation.",
    },
    companionId: 1662,
    altText: {
      tr: "Gaara ile dövüş — küratör yüklemesi",
      en: "The fight with Gaara — curator upload",
    },
  },
  {
    key: "kimimaro",
    imageKey: LEE_IMAGE_KEYS.eraKimimaro,
    age: { tr: "13 yaş", en: "Age 13" },
    title: { tr: "Kimimaro ve sarhoş yumruk", en: "Kimimaro and the drunken fist" },
    text: {
      tr: "Sasuke'nin peşindeki görevde Naruto'yu Kimimaro'dan çekip aldı. İlacını yanlış şişeden içti; bir yudum sake Suiken'i açtı ve dövüş bir anda kimsenin — Lee'nin bile — okuyamadığı bir şeye döndü. Ameliyattan yeni kalkmış bir bedenle, kaybedeceği belli bir dövüşü kabul etti.",
      en: "On the mission after Sasuke he pulled Naruto out of Kimimaro's reach. He drank his medicine from the wrong bottle; one mouthful of sake opened Suiken and the fight turned into something nobody — not even Lee — could read. With a body barely off the operating table, he accepted a fight he was going to lose.",
    },
    companionId: 17,
    altText: {
      tr: "Kimimaro ile karşılaşma — küratör yüklemesi",
      en: "The encounter with Kimimaro — curator upload",
    },
  },
  {
    key: "war",
    imageKey: LEE_IMAGE_KEYS.eraWar,
    age: { tr: "17 yaş", en: "Age 17" },
    title: { tr: "Dördüncü Savaş ve yedinci kapı", en: "The Fourth War and the seventh gate" },
    text: {
      tr: "Savaşın son cephesinde ustasının yanında durdu ve kapıları yedinciye kadar açtı. Artık her kapının ne aldığını biliyordu — akademideki çocuk bilmiyordu, on üç yaşındaki çocuk tahmin ediyordu, bu adam hesaplıyordu. Ve hesabı bilerek yaptı.",
      en: "On the last front of the war he stood beside his teacher and opened the gates as far as the seventh. By then he knew exactly what each gate takes — the boy at the academy did not know, the boy of thirteen guessed, this man calculated. And he did the arithmetic on purpose.",
    },
    companionId: 307,
    altText: {
      tr: "Dördüncü Savaş — küratör yüklemesi",
      en: "The Fourth War — curator upload",
    },
  },
];

/* ── 7 · KAPANIŞ ─────────────────────────────────────────────────────── */

export const LEE_QUOTES = [
  {
    text: {
      tr: "Ninjutsu ve genjutsu kullanamasam bile harika bir ninja olabileceğimi kanıtlayacağım.",
      en: "I will prove that I can become a splendid ninja even without ninjutsu or genjutsu.",
    },
    by: "Rock Lee",
  },
  {
    text: {
      tr: "Lee, sen çabanın dâhisisin.",
      en: "Lee, you are a genius of hard work.",
    },
    by: "Might Guy",
  },
];

export const LEE_CLOSING = {
  motto: "努力の天才",
  mottoReading: {
    tr: "doryoku no tensai — çabanın dâhisi",
    en: "doryoku no tensai — a genius of hard work",
  },
  coda: {
    tr: "Bu sayfadaki her sayı bir yeteneği değil, bir tekrarı ölçüyor.",
    en: "Every number on this page measures a repetition, not a talent.",
  },
};

export const LEE_CREDIT = {
  title: { tr: "Kaynak künyesi", en: "Sources" },
  text: {
    tr: "Künye bilgileri ve yedek portre AniList'ten alındı; tam boy portre ile bölüm görselleri arşive elle yüklendi. Boy, kilo, kan grubu ve rütbe satırları Naruto databook künyesinden yazıldı. Dekoratif çizimlerin tamamı (kapı, bandajlı yumruk, nilüfer, çetele) bu sayfa için elle çizilmiş SVG'dir.",
    en: "Profile data and the fallback portrait come from AniList; the full-length portrait and the section images were uploaded to the archive by hand. Height, weight, blood type and rank are taken from the Naruto databook profile. Every decorative drawing on this page (gate, bandaged fist, lotus, tally) is hand-authored SVG made for it.",
  },
  linkLabel: { tr: "AniList künyesi", en: "AniList profile" },
  href: "https://anilist.co/character/306",
};
