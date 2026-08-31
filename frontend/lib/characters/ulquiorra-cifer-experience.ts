import type { LocalizedText } from "./types";

/**
 * Ulquiorra Cifer — "Boşluk" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Bileşen buradan okuyup `pick(text, locale)` ile seçiyor; istemci adalarına
 * yalnızca düz dize iniyor.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * BOŞLUK. Ulquiorra'nın Hollow deliği bu sayfada bir metafor değil, ızgaranın
 * ortasındaki GERÇEK bir kolon: `grid-template-columns`ün ikinci parçası boş
 * ve bütün bölümler onun etrafından dolanıyor. Delik bir sayaç — her bölüm
 * ona bir cevap veriyor ve delik küçülüyor. Beşinci cevapta kapanmıyor:
 * sayfanın tamamı kadar büyüyüp içeriği yutuyor, geriye tek bir cümle
 * kalıyor.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (1 Aralık) ve boy (169 cm) AniList künyesinden birebir alındı
 * (karakter 1081, 31 Ağustos 2026; çekimin kopyası
 * `public/assets/anime/karakterler/ulquiorra-cifer/kaynak.json`).
 *
 * ⚠️ YAŞ YOK, KAN GRUBU YOK. AniList kaydında ikisi de `null` ve seri de
 * vermiyor. Künye şeridinde ikisi de SATIR olarak duruyor ve değerleri boş:
 * uydurulmuş bir sayı yazmaktansa boşluğu göstermek bu sayfanın zaten konusu.
 *
 * ── EVREN VERİSİNİN KAYNAĞI ──────────────────────────────────────────────
 * Sıra (Cuatro · 4), yön (虚無 kyomu — hiçlik), dövmenin yeri (sol göğüs),
 * cero rengi (yeşil), miğfer parçası (sol üst, kırık boynuz), Resurrección
 * (黒翼大魔 · Murciélago), ikinci salıveriş (刀剣解放第二階層 · Segunda
 * Etapa) ve siyah cero (黒虚閃) arşivin KENDİ Bleach defterinden alındı:
 * `lib/anime/bleach/espada.ts`, `rank: 4` kaydı. Lanza del Relámpago'nun
 * kanjisi (雷霆の槍) AniList künyesinin gövdesinde yazılı.
 *
 * ── REPLİK DİSİPLİNİ — ⚠️ BU SAYFADA TIRNAK İÇİNDE DİYALOG YOK ───────────
 * Ulquiorra'nın son sahnesindeki cümle çok ünlü ve internette birbirinden
 * farklı en az üç Japonca yazımıyla dolaşıyor. Arşivin elinde o sahnenin
 * birebir metnini doğrulayacak bir kaynak YOK, dolayısıyla hiçbir diyalog
 * tırnağa alınmadı (dalga kuralı: "kaynağından emin değilsen tırnağa alma").
 *
 * Onun yerine sayfa iki tür orijinal dil metni taşıyor ve ikisi de ne
 * olduğunu kendisi söylüyor:
 *   · TERİM — 虚無, 黒翼大魔, 黒虚閃, 刀剣解放第二階層, 雷霆の槍… Hepsi
 *     doğrulanmış (yukarıdaki iki kaynak) ve "terim" etiketiyle çiziliyor.
 *   · SORU — sahnenin döndüğü iki soru, ARŞİVİN KENDİ Japonca karşılığı.
 *     Tırnak yok, konuşan yok, "soru" etiketi var. Bu bir alıntı değil.
 * Bu ayrım sayfanın konusuyla da örtüşüyor: doğrulanamayan yer boş kalıyor.
 *
 * ── TERMİNOLOJİ ──────────────────────────────────────────────────────────
 * Hollow / Arrancar / Espada · Hierro (鋼皮) · Cero (虚閃) ·
 * Cero Oscuras (黒虚閃) · Bala (虚弾) · Sonído (響転) · Pesquisa (探査回路) ·
 * Resurrección (刀剣解放) · Segunda Etapa (刀剣解放第二階層) ·
 * Lanza del Relámpago (雷霆の槍) · Hueco Mundo · Las Noches.
 * Naruto ya da Jujutsu Kaisen terimi YOK.
 */

export const ULQ_ID = 1081;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const ULQ_SITE_URL = "https://anilist.co/character/1081";

/**
 * Depodaki resmî portre (Faz 2 kararı: hotlink yok, kare repoda).
 *
 * ⚠️ 230×345 — yani KÜÇÜK. Sayfada yalnızca dar bir madalyon kadrajında
 * kullanılıyor; büyük hero karesi küratör yuvası olarak boş bırakıldı.
 * Kendi kaynağımız olduğu için `next/image`de `unoptimized` YOK.
 */
export const ULQ_PORTRAIT = {
  src: "/assets/anime/karakterler/ulquiorra-cifer/anilist-portrait.png",
  w: 230,
  h: 345,
} as const;

/**
 * Sergi görselleri — hepsi characterId 1081 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `ulq:` önekli (küratör modu şartı).
 */
export const ULQ_IMAGE_KEYS = {
  hero: "ulq:hero",
  hole: "ulq:hollow-hole",
  powerHierro: "ulq:hierro",
  powerMurcielago: "ulq:murcielago",
  powerSegunda: "ulq:segunda-etapa",
  minorCero: "ulq:cero-oscuras",
  minorBala: "ulq:bala",
  minorSonido: "ulq:sonido",
  minorPesquisa: "ulq:pesquisa",
  heart: "ulq:heart",
  fateVasto: "ulq:fate-vasto-lorde",
  fateCuatro: "ulq:fate-cuatro",
  fateKarakura: "ulq:fate-karakura",
  fateCell: "ulq:fate-cell",
  fateAsh: "ulq:fate-ash",
  closing: "ulq:closing",
} as const;

/** Küratör yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const ULQ_SLOT_LABELS: Record<string, LocalizedText> = {
  [ULQ_IMAGE_KEYS.hero]: {
    tr: "Hero — dikey portre, tam boy, boş beyaz zemin (3:4)",
    en: "Hero — vertical portrait, full figure, empty white ground (3:4)",
  },
  [ULQ_IMAGE_KEYS.hole]: {
    tr: "Delik — boğazın dibindeki Hollow deliği, yakın çekim (1:1)",
    en: "The hole — the Hollow hole at the base of the throat, close crop (1:1)",
  },
  [ULQ_IMAGE_KEYS.powerHierro]: {
    tr: "Hierro — çeliğe çarpan bıçak, kesmeyen kenar (16:9)",
    en: "Hierro — a blade striking steel, an edge that does not cut (16:9)",
  },
  [ULQ_IMAGE_KEYS.powerMurcielago]: {
    tr: "Murciélago — açılan yarasa kanatları, Las Noches gecesi (16:9)",
    en: "Murciélago — bat wings opening over the night of Las Noches (16:9)",
  },
  [ULQ_IMAGE_KEYS.powerSegunda]: {
    tr: "Segunda Etapa — uzayan boynuzlar, kuyruk, siyah kürk (16:9)",
    en: "Segunda Etapa — elongated horns, a tail, black fur (16:9)",
  },
  [ULQ_IMAGE_KEYS.minorCero]: {
    tr: "Cero Oscuras — siyah ışın, yeşil kenar (3:2)",
    en: "Cero Oscuras — a black beam with a green rim (3:2)",
  },
  [ULQ_IMAGE_KEYS.minorBala]: {
    tr: "Bala — parmak ucundan çıkan kısa atış (3:2)",
    en: "Bala — the short shot leaving a fingertip (3:2)",
  },
  [ULQ_IMAGE_KEYS.minorSonido]: {
    tr: "Sonído — boş kalan yer, sesin geldiği yön (3:2)",
    en: "Sonído — the emptied spot, the direction the sound came from (3:2)",
  },
  [ULQ_IMAGE_KEYS.minorPesquisa]: {
    tr: "Pesquisa — ölçülen reiatsu, çöl üstünde tarama (3:2)",
    en: "Pesquisa — reiatsu being measured, a sweep over the desert (3:2)",
  },
  [ULQ_IMAGE_KEYS.heart]: {
    tr: "Kalp — uzanan el, dağılan kül (16:9)",
    en: "The heart — a reaching hand, scattering ash (16:9)",
  },
  [ULQ_IMAGE_KEYS.fateVasto]: {
    tr: "Kader 1 — Hueco Mundo çölü, Aizen'den önce (3:2)",
    en: "Fate 1 — the desert of Hueco Mundo, before Aizen (3:2)",
  },
  [ULQ_IMAGE_KEYS.fateCuatro]: {
    tr: "Kader 2 — Espada masası, dördüncü sandalye (3:2)",
    en: "Fate 2 — the Espada table, the fourth chair (3:2)",
  },
  [ULQ_IMAGE_KEYS.fateKarakura]: {
    tr: "Kader 3 — Karakura, ilk gözlem (3:2)",
    en: "Fate 3 — Karakura, the first observation (3:2)",
  },
  [ULQ_IMAGE_KEYS.fateCell]: {
    tr: "Kader 4 — Las Noches'te beyaz hücre, tek pencere (3:2)",
    en: "Fate 4 — the white cell in Las Noches, a single window (3:2)",
  },
  [ULQ_IMAGE_KEYS.fateAsh]: {
    tr: "Kader 5 — kubbenin üstü, küle dönen el (3:2)",
    en: "Fate 5 — above the dome, a hand turning to ash (3:2)",
  },
  [ULQ_IMAGE_KEYS.closing]: {
    tr: "Kapanış — boş bir kadraj, tek bir figür (21:9)",
    en: "Closing — an empty frame, a single figure (21:9)",
  },
};

/** Küratör yuvalarının teknik künyesi — yalnızca yöneticiye gösterilir. */
export const ULQ_SLOT_SPECS: Record<string, LocalizedText> = {
  [ULQ_IMAGE_KEYS.hero]: {
    tr: "dikey kadraj · 1200×1600 · webp",
    en: "vertical frame · 1200×1600 · webp",
  },
  [ULQ_IMAGE_KEYS.hole]: {
    tr: "kare kadraj · 900×900 · webp",
    en: "square frame · 900×900 · webp",
  },
  [ULQ_IMAGE_KEYS.powerHierro]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [ULQ_IMAGE_KEYS.powerMurcielago]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [ULQ_IMAGE_KEYS.powerSegunda]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [ULQ_IMAGE_KEYS.minorCero]: {
    tr: "orta kadraj · 1200×800 · webp",
    en: "medium frame · 1200×800 · webp",
  },
  [ULQ_IMAGE_KEYS.minorBala]: {
    tr: "orta kadraj · 1200×800 · webp",
    en: "medium frame · 1200×800 · webp",
  },
  [ULQ_IMAGE_KEYS.minorSonido]: {
    tr: "orta kadraj · 1200×800 · webp",
    en: "medium frame · 1200×800 · webp",
  },
  [ULQ_IMAGE_KEYS.minorPesquisa]: {
    tr: "orta kadraj · 1200×800 · webp",
    en: "medium frame · 1200×800 · webp",
  },
  [ULQ_IMAGE_KEYS.heart]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [ULQ_IMAGE_KEYS.fateVasto]: {
    tr: "orta kadraj · 1200×800 · webp",
    en: "medium frame · 1200×800 · webp",
  },
  [ULQ_IMAGE_KEYS.fateCuatro]: {
    tr: "orta kadraj · 1200×800 · webp",
    en: "medium frame · 1200×800 · webp",
  },
  [ULQ_IMAGE_KEYS.fateKarakura]: {
    tr: "orta kadraj · 1200×800 · webp",
    en: "medium frame · 1200×800 · webp",
  },
  [ULQ_IMAGE_KEYS.fateCell]: {
    tr: "orta kadraj · 1200×800 · webp",
    en: "medium frame · 1200×800 · webp",
  },
  [ULQ_IMAGE_KEYS.fateAsh]: {
    tr: "orta kadraj · 1200×800 · webp",
    en: "medium frame · 1200×800 · webp",
  },
  [ULQ_IMAGE_KEYS.closing]: {
    tr: "bant kadraj · 1680×720 · webp",
    en: "band frame · 1680×720 · webp",
  },
};

/** `CuratorSlot`un `size` propu — yükleyici oranı kendisi yazıyor. */
export const ULQ_SLOT_SIZES: Record<string, { w: number; h: number }> = {
  [ULQ_IMAGE_KEYS.hero]: { w: 1200, h: 1600 },
  [ULQ_IMAGE_KEYS.hole]: { w: 900, h: 900 },
  [ULQ_IMAGE_KEYS.powerHierro]: { w: 1600, h: 900 },
  [ULQ_IMAGE_KEYS.powerMurcielago]: { w: 1600, h: 900 },
  [ULQ_IMAGE_KEYS.powerSegunda]: { w: 1600, h: 900 },
  [ULQ_IMAGE_KEYS.minorCero]: { w: 1200, h: 800 },
  [ULQ_IMAGE_KEYS.minorBala]: { w: 1200, h: 800 },
  [ULQ_IMAGE_KEYS.minorSonido]: { w: 1200, h: 800 },
  [ULQ_IMAGE_KEYS.minorPesquisa]: { w: 1200, h: 800 },
  [ULQ_IMAGE_KEYS.heart]: { w: 1600, h: 900 },
  [ULQ_IMAGE_KEYS.fateVasto]: { w: 1200, h: 800 },
  [ULQ_IMAGE_KEYS.fateCuatro]: { w: 1200, h: 800 },
  [ULQ_IMAGE_KEYS.fateKarakura]: { w: 1200, h: 800 },
  [ULQ_IMAGE_KEYS.fateCell]: { w: 1200, h: 800 },
  [ULQ_IMAGE_KEYS.fateAsh]: { w: 1200, h: 800 },
  [ULQ_IMAGE_KEYS.closing]: { w: 1680, h: 720 },
};

/** Kapak portresinin küratör yuvası. */
export const ULQ_PORTRAIT_SLOT: LocalizedText = {
  tr: "Kapak portresi — dikey, tam boy, 1200×1600 · webp",
  en: "Cover portrait — vertical, full figure, 1200×1600 · webp",
};

/**
 * `alt` metinlerinin ortak önekleri.
 *
 * Faz 2 §3: her `alt` kaynağını söylüyor. Küratörün yüklediği kare "arşive
 * yüklenen" diye anılıyor, depodaki resmî kare AniList diye.
 */
export const ULQ_ALT = {
  scenePrefix: {
    tr: "Arşive yüklenen kare —",
    en: "Frame uploaded to the archive —",
  },
} as const;

/**
 * Küratöre gösterilen boş kadraj notu.
 *
 * ⚠️ ZİYARETÇİ BUNU HİÇ GÖRMÜYOR. Bu sayfanın konusu boşluk: dolmamış bir
 * kadraj ziyaretçide etiketli bir kutu olarak değil, GERÇEK bir boşluk
 * olarak duruyor (bileşende `isAdmin` kesmesi).
 */
export const ULQ_FRAME_EMPTY: LocalizedText = {
  tr: "Bu kadraj boş",
  en: "This frame is empty",
};

/* ── 1 · HERO ─────────────────────────────────────────────────────────── */

export const ULQ_CRUMB = {
  series: { tr: "Bleach", en: "Bleach" },
} as const;

export const ULQ_HERO = {
  eyebrow: {
    tr: "Cuatro Espada · Las Noches",
    en: "Cuatro Espada · Las Noches",
  },
  lede: {
    tr: "Gözle görülmeyenin var olmadığını söyleyen bir Arrancar. Bu sayfa onun tezini bir düzen kuralına çevirdi: ortadaki boşluk bir süs değil, ızgaranın gerçek bir parçası. Bölümler onun etrafından dolanıyor.",
    en: "An Arrancar who says that what the eye cannot see does not exist. This page turns his thesis into a layout rule: the emptiness in the middle is not decoration, it is a real part of the grid. The sections go around it.",
  },
  portraitAlt: {
    tr: "Ulquiorra Cifer — AniList resmî portresi (anilist.co/character/1081)",
    en: "Ulquiorra Cifer — official AniList portrait (anilist.co/character/1081)",
  },
  portraitAltUploaded: {
    tr: "Ulquiorra Cifer — arşive yüklenen kapak portresi",
    en: "Ulquiorra Cifer — cover portrait uploaded to the archive",
  },
  /** Yalnızca kadraj GERÇEKTEN boşken ve yalnızca küratörde yazılıyor. */
  heroCaption: {
    tr: "Büyük hero karesi bilerek boş: depodaki resmî portre 230×345, tam kanama bir kadraj için küçük.",
    en: "The large hero frame is deliberately empty: the official portrait in the repo is 230×345, too small to bleed.",
  },
  frameCredit: {
    tr: "Kare arşive küratör tarafından yüklendi.",
    en: "Frame uploaded to the archive by the curator.",
  },
} as const;

/* ── 2 · MOD DÜĞMESİ ──────────────────────────────────────────────────── */

/**
 * Sayfanın tek modu: **"Kalp nerede?"**
 *
 * Açıkken sayfadaki bütün anlatı metni bir kademe soluyor ve SORULAR öne
 * çıkıyor. Ulquiorra'nın cevap değil soru soran hâli: sayfa aynı sayfa,
 * ama okuduğun şey artık cevaplar değil sorular.
 */
export const ULQ_MODE = {
  title: { tr: "Kalp nerede?", en: "Where is the heart?" },
  native: "心はどこにある",
  enter: { tr: "Soruları öne al", en: "Bring the questions forward" },
  exit: { tr: "Soruları geri bırak", en: "Let the questions recede" },
  hintOff: {
    tr: "Sayfa şu an cevaplarla okunuyor. Düğme soruları öne alır, anlatıyı bir kademe geri çeker.",
    en: "The page currently reads as answers. The button brings the questions forward and pulls the narrative back a step.",
  },
  hintOn: {
    tr: "Sorular önde. Anlatı hâlâ okunaklı ama bir kademe geride — bu adam cevapları değil soruları biriktiriyordu.",
    en: "The questions are in front. The narrative is still legible but one step back — this man collected questions, not answers.",
  },
} as const;

/* ── 3 · KÜNYE ŞERİDİ ─────────────────────────────────────────────────── */

export const ULQ_IDENTITY = {
  name: "Ulquiorra Cifer",
  nativeName: "ウルキオラ・シファー",
  /** AniList'te ikinci bir yazım olarak kayıtlı. */
  altName: { tr: "Diğer yazım: Schiffer", en: "Alternate spelling: Schiffer" },
  aspect: "虚無",
  aspectReading: {
    tr: "kyomu — hiçlik. Espada'nın on yönünden dördüncüsü.",
    en: "kyomu — nihility. The fourth of the Espada's ten aspects.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birth" },
      value: { tr: "1 Aralık", en: "1 December" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "169 cm", en: "169 cm" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "—", en: "—" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "—", en: "—" },
    },
    {
      label: { tr: "Tür", en: "Kind" },
      value: { tr: "Arrancar", en: "Arrancar" },
    },
    {
      label: { tr: "Sıra", en: "Rank" },
      value: { tr: "Cuatro — dördüncü Espada", en: "Cuatro — fourth Espada" },
    },
    {
      label: { tr: "Numaranın yeri", en: "Where the number is" },
      value: { tr: "Sol göğsünde", en: "On the left of his chest" },
    },
    {
      label: { tr: "Zanpakutō", en: "Zanpakutō" },
      value: { tr: "Murciélago · 黒翼大魔", en: "Murciélago · 黒翼大魔" },
    },
    {
      label: { tr: "Miğfer parçası", en: "Mask fragment" },
      value: {
        tr: "Başının sol üstünde kırık boynuzlu miğfer",
        en: "A broken horned helmet on the upper left of his head",
      },
    },
    {
      label: { tr: "Cero rengi", en: "Cero colour" },
      value: { tr: "Yeşil", en: "Green" },
    },
  ],
} as const;

/** Boş bırakılan iki satırın gerekçesi — uydurmamanın yazılı hâli. */
export const ULQ_MISSING_NOTE: LocalizedText = {
  tr: "Yaş ve kan grubu satırları boş. AniList kaydında ikisi de yok, seri de vermiyor; bu iki boşluk kapatılmadı.",
  en: "The age and blood type rows are empty. Neither is in the AniList record and the series does not give them; these two gaps were left open.",
};

/** Deliğin kendisi bir künye satırı — ama bir kutuya sığmıyor. */
export const ULQ_HOLE_FACT = {
  title: { tr: "Delik", en: "The hole" },
  text: {
    tr: "Her Hollow'un bir deliği var; Ulquiorra'nınki boğazının dibinde. Delik bir yara değil bir tanım: orada bir şeyin olmadığını değil, orada bir şeyin OLMADIĞINI gösteriyor. Bu sayfada o delik ızgaranın ortasında duruyor ve ölçüsü sabit değil.",
    en: "Every Hollow has a hole; his sits at the base of his throat. The hole is not a wound but a definition: it does not show that something is missing, it shows that nothing is there. On this page that hole sits in the middle of the grid, and its size is not fixed.",
  },
} as const;

/* ── 4 · GÜÇ LABORATUVARI ─────────────────────────────────────────────── */

export interface UlqPower {
  key: string;
  /** Kanji — canon terim, çevrilmiyor */
  name: string;
  /** Latin harfli okunuş + İspanyolca ad */
  reading: string;
  turkish: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
  imageKey: string;
}

/** Üç büyük kart — Hollow/Arrancar terminolojisi. */
export const ULQ_POWERS: UlqPower[] = [
  {
    key: "hierro",
    name: "鋼皮",
    reading: "kōhi · Hierro",
    turkish: { tr: "Çelik deri", en: "Steel skin" },
    tagline: {
      tr: "Savunma bir hareket değil, bir yüzey.",
      en: "Defence is not a movement, it is a surface.",
    },
    text: {
      tr: "Arrancar'ın yoğunlaşmış reiatsu'su deriye çöküyor ve deriyi zırha çeviriyor. Ulquiorra'nınki Espada içinde en sertlerden: kılıcı çekmeden karşılanan darbeler onun için bir savunma tercihi değil, bir alışkanlık. Bir şeyi durdurmak için bir şey yapmıyor — sadece duruyor.",
      en: "The Arrancar's condensed reiatsu settles into the skin and turns skin into armour. His is among the hardest of the Espada: blows taken without drawing a blade are not a defensive choice for him but a habit. He does nothing to stop a thing — he simply stands there.",
    },
    traits: [
      { tr: "Kılıç çekmeden karşılama", en: "Meeting a blow without drawing" },
      { tr: "İki parmakla durdurma", en: "Stopping with two fingers" },
      { tr: "Yorulmayan yüzey", en: "A surface that does not tire" },
    ],
    imageKey: ULQ_IMAGE_KEYS.powerHierro,
  },
  {
    key: "murcielago",
    name: "黒翼大魔",
    reading: "Murciélago · Resurrección",
    turkish: { tr: "Kara kanatlı büyük şeytan", en: "Great black-winged demon" },
    tagline: {
      tr: "Salıveriş, gecenin bir kat daha koyulaşması.",
      en: "The release: the night thickening one more shade.",
    },
    text: {
      tr: "Zanpakutō salıverildiğinde sırtta iki büyük siyah kanat açılıyor, miğfer başın üstünde toplanıyor ve üniforma aşağı doğru cüppeleşiyor. Cero'su bu hâlde rengini değiştiriyor: 黒虚閃, yalnızca onun çıkarabildiği siyah. Enerjiden uzun mızraklar — 雷霆の槍 — bu hâlde de üretiliyor.",
      en: "When the zanpakutō is released two great black wings open at his back, the helmet gathers atop his head and the uniform lengthens into a robe. His cero changes colour in this form: 黒虚閃, a black only he can produce. Long lances of energy — 雷霆の槍 — are made in this form too.",
    },
    traits: [
      { tr: "İki büyük siyah kanat", en: "Two great black wings" },
      { tr: "Miğfer başın üstünde toplanıyor", en: "The helmet gathers atop the head" },
      { tr: "黒虚閃 · Cero Oscuras", en: "黒虚閃 · Cero Oscuras" },
      { tr: "雷霆の槍 · Lanza del Relámpago", en: "雷霆の槍 · Lanza del Relámpago" },
    ],
    imageKey: ULQ_IMAGE_KEYS.powerMurcielago,
  },
  {
    key: "segunda",
    name: "刀剣解放第二階層",
    reading: "Segunda Etapa",
    turkish: { tr: "İkinci kat salıveriş", en: "The second stage of release" },
    tagline: {
      tr: "Espada içinde ikinci bir salıverişe ulaşan tek isim.",
      en: "The only name among the Espada to reach a second release.",
    },
    text: {
      tr: "Kaslar büyüyor, eller ve ayaklar pençeleşiyor, gözlerin akı siyaha dönüyor; miğfer yerini uzun boynuzlara bırakıyor, kalçadan aşağısı siyah kürkle kaplanıyor ve arkada ince, uzun bir kuyruk beliriyor. Arşivin defterine göre bunu güç için değil bir soruyu kanıtlamak için açıyor: karşısındakine gerçek umutsuzluğu göstermek.",
      en: "The muscles thicken, hands and feet become clawed, the whites of the eyes turn black; the helmet gives way to long horns, everything below the hips is covered in black fur and a thin, long tail appears behind. By the archive's own record he opens this not for power but to prove a point: to show his opponent true despair.",
    },
    traits: [
      { tr: "Gözlerin akı siyah", en: "The whites of the eyes go black" },
      { tr: "Uzun boynuzlar, ince kuyruk", en: "Long horns, a thin tail" },
      { tr: "Espada'da eşi yok", en: "Without equal among the Espada" },
    ],
    imageKey: ULQ_IMAGE_KEYS.powerSegunda,
  },
];

export interface UlqMinor {
  key: string;
  name: string;
  reading: string;
  turkish: LocalizedText;
  note: LocalizedText;
  imageKey: string;
}

/** Dört küçük kart. */
export const ULQ_MINORS: UlqMinor[] = [
  {
    key: "cero",
    name: "虚閃 · 黒虚閃",
    reading: "kyosen · Cero / Cero Oscuras",
    turkish: { tr: "Sıfır · Kara sıfır", en: "Zero · Dark zero" },
    note: {
      tr: "Her Hollow'un yoğunlaştırılmış ışını. Ulquiorra'nınki yeşil; salıverişten sonra siyaha dönüyor ve kenarında yeşil bir çizgi kalıyor.",
      en: "Every Hollow's condensed beam. His is green; after the release it turns black and keeps a green line at its rim.",
    },
    imageKey: ULQ_IMAGE_KEYS.minorCero,
  },
  {
    key: "bala",
    name: "虚弾",
    reading: "kyodan · Bala",
    turkish: { tr: "Mermi", en: "Bullet" },
    note: {
      tr: "Cero'nun zayıf ama çok daha hızlı akrabası. Nişan almak için değil, aradaki mesafeyi kapatmadan bir cevap vermek için.",
      en: "Cero's weaker but far faster relative. Not for aiming, but for answering without closing the distance.",
    },
    imageKey: ULQ_IMAGE_KEYS.minorBala,
  },
  {
    key: "sonido",
    name: "響転",
    reading: "kyōten · Sonído",
    turkish: { tr: "Ses", en: "Sound" },
    note: {
      tr: "Arrancar'ın yüksek hız hareketi. Shunpo gibi görünüyor ama arkasında bir ses bırakıyor: durduğu yer değil, geldiği yön duyuluyor.",
      en: "The Arrancar's high-speed movement. It looks like shunpo but leaves a sound behind: what you hear is not where he stopped but the direction he came from.",
    },
    imageKey: ULQ_IMAGE_KEYS.minorSonido,
  },
  {
    key: "pesquisa",
    name: "探査回路",
    reading: "tansa kairo · Pesquisa",
    turkish: { tr: "Tarama devresi", en: "Probe circuit" },
    note: {
      tr: "Reiatsu ölçme yeteneği. Ulquiorra bunu bir uyarı sistemi gibi değil bir kanaat aracı gibi kullanıyor: ölçüyor, sayıya bakıyor, kararını veriyor.",
      en: "The ability to measure reiatsu. He uses it not as a warning system but as an instrument of judgement: he measures, reads the number, and decides.",
    },
    imageKey: ULQ_IMAGE_KEYS.minorPesquisa,
  },
];

/* ── 5 · KALP — SAYFANIN KALBİ ────────────────────────────────────────── */

/**
 * Beş cevap. Delik bir sayaç: her bölüm ona bir cevap veriyor ve delik
 * küçülüyor. Beşinci cevapta kapanmıyor — sayfanın tamamı kadar büyüyor.
 *
 * Cevapların hiçbiri "kalp" değil ve mekanik tam olarak bunun üstüne
 * kurulu: sayı, güç, göz, ad, emir — hepsi ölçülebilir, hiçbiri yetmiyor.
 */
export interface UlqAnswer {
  key: string;
  /** Kanji — bir TERİM, replik değil */
  glyph: string;
  romaji: string;
  label: LocalizedText;
  /** Düğmenin üstündeki metin */
  press: LocalizedText;
  /** Verildikten sonra deliğin altında okunan satır */
  note: LocalizedText;
}

export const ULQ_ANSWERS: UlqAnswer[] = [
  {
    key: "kazu",
    glyph: "数",
    romaji: "kazu",
    label: { tr: "Bir sayı", en: "A number" },
    press: { tr: "Deliğe bir sayı ver", en: "Give the hollow a number" },
    note: {
      tr: "Dört. Sıra ölçülebilir bir şey ve ölçülebilen her şey gibi kişiyi anlatmıyor.",
      en: "Four. Rank is a measurable thing, and like everything measurable it does not describe the person.",
    },
  },
  {
    key: "chikara",
    glyph: "力",
    romaji: "chikara",
    label: { tr: "Bir güç", en: "A power" },
    press: { tr: "Deliğe bir güç ver", en: "Give the hollow a power" },
    note: {
      tr: "Hierro, cero, iki kanat, bir kuyruk. Hepsi görülebiliyor; onun kabul ettiği tek varlık ölçütü de bu.",
      en: "Hierro, cero, two wings, a tail. All of it can be seen; and that is the only test of existence he accepts.",
    },
  },
  {
    key: "me",
    glyph: "目",
    romaji: "me",
    label: { tr: "Bir göz", en: "An eye" },
    press: { tr: "Deliğe bir göz ver", en: "Give the hollow an eye" },
    note: {
      tr: "İnsan dünyasına gönderilen gözdü. Gördüğünü bildirdi, ölçtüğünü yazdı; gördüğü şeyin ne olduğunu sormadı.",
      en: "He was the eye sent into the human world. He reported what he saw and recorded what he measured; he did not ask what the thing he saw was.",
    },
  },
  {
    key: "na",
    glyph: "名",
    romaji: "na",
    label: { tr: "Bir ad", en: "A name" },
    press: { tr: "Deliğe bir ad ver", en: "Give the hollow a name" },
    note: {
      tr: "Murciélago. Bir ad bir sınır çiziyor — ama sınır, içinde ne olduğunu söylemiyor.",
      en: "Murciélago. A name draws a boundary — but a boundary does not say what is inside it.",
    },
  },
  {
    key: "meirei",
    glyph: "命令",
    romaji: "meirei",
    label: { tr: "Bir emir", en: "An order" },
    press: { tr: "Deliğe bir emir ver", en: "Give the hollow an order" },
    note: {
      tr: "Getir, gözle, bekle, öldürme. Emir bir yön veriyor ve yön, isteğin yerine geçmiyor.",
      en: "Fetch, observe, wait, do not kill. An order gives a direction, and a direction does not stand in for a want.",
    },
  },
];

/** Kalp mekaniğinin bütün arayüz metinleri (istemci adasına düz dize iner). */
export const ULQ_HEART_UI = {
  holeLabel: { tr: "Boşluk", en: "The hollow" },
  glyph: "虚",
  glyphReading: { tr: "kyo — boşluk", en: "kyo — hollow" },
  counter: { tr: "verilen cevap", en: "answers given" },
  ledgerTitle: { tr: "Beş cevap", en: "Five answers" },
  ledgerLede: {
    tr: "Her bölüm deliğe bir cevap veriyor. Cevap biriktikçe boşluk daralıyor — ızgaranın orta kolonu gerçekten küçülüyor. Beşincide kapanmıyor.",
    en: "Each section gives the hollow an answer. As answers accumulate the emptiness narrows — the middle column of the grid really does shrink. On the fifth it does not close.",
  },
  given: { tr: "verildi", en: "given" },
  takeBack: { tr: "Geri al", en: "Take back" },
  resetLabel: { tr: "Boşluğu geri aç", en: "Open the hollow again" },
  keyboardHint: {
    tr: "Cevap düğmeleri bölümlerin içinde; sekmeyle gezilebilir, boşluk ya da Enter ile verilir. Verilen bir cevap aynı düğmeyle geri alınır.",
    en: "The answer buttons sit inside the sections; tab to them and press Space or Enter. A given answer is taken back with the same button.",
  },
  statusGiven: { tr: "cevabı verildi. Boşluk daraldı.", en: "answer given. The hollow narrowed." },
  statusTaken: { tr: "cevabı geri alındı. Boşluk genişledi.", en: "answer taken back. The hollow widened." },
  statusReset: {
    tr: "Bütün cevaplar geri alındı. Boşluk ilk ölçüsünde.",
    en: "All answers were taken back. The hollow is at its first size.",
  },
  swallowTitle: { tr: "Boşluk büyüdü", en: "The hollow grew" },
  swallowLine: {
    tr: "Beş cevap verildi, hiçbiri kalp değildi. Delik kapanmadı; sayfayı aldı.",
    en: "Five answers were given, not one of them was the heart. The hollow did not close; it took the page.",
  },
  swallowUndo: { tr: "Son cevabı geri al", en: "Take back the last answer" },
  swallowReset: { tr: "Sayfayı geri getir", en: "Bring the page back" },
} as const;

/* ── 6 · KADER ÇİZELGESİ ──────────────────────────────────────────────── */

export interface UlqStop {
  key: string;
  /** Dönem etiketi — yaş YOK, çünkü kayıtlı bir yaşı yok */
  era: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  /**
   * Kilit anın orijinal dil karşılığı.
   *
   * ⚠️ `kind` alanı bilerek var: `term` doğrulanmış canon terimi,
   * `question` arşivin kendi Japonca soru karşılığı. İkisi de REPLİK
   * DEĞİL ve sayfa bunu yazıyla söylüyor (dosya başındaki replik
   * disiplini bloğu).
   */
  mark?: {
    kind: "term" | "question";
    text: string;
    reading: LocalizedText;
  };
  kin?: { characterId: number; name: string; role: LocalizedText };
  imageKey: string;
}

export const ULQ_TIMELINE: UlqStop[] = [
  {
    key: "vasto",
    era: { tr: "Hueco Mundo — Aizen'den önce", en: "Hueco Mundo — before Aizen" },
    title: { tr: "Çölde bir şey", en: "A thing in the desert" },
    text: {
      tr: "Beyaz kumun üstünde, gecesi bitmeyen bir dünyada. Espada'nın en üst sıralarındaki birkaç isim gibi o da oraya bir Hollow olarak geldi; adı, sayısı ve emri sonradan verildi. Bu duraktan geriye kalan tek şey deliğin kendisi.",
      en: "On white sand, in a world whose night does not end. Like a few of the highest-ranked Espada he arrived there as a Hollow; his name, his number and his orders came later. All that remains from this stop is the hole itself.",
    },
    mark: {
      kind: "term",
      text: "虚無",
      reading: {
        tr: "kyomu — hiçlik. Espada içindeki yönü bu.",
        en: "kyomu — nihility. This is his aspect among the Espada.",
      },
    },
    imageKey: ULQ_IMAGE_KEYS.fateVasto,
  },
  {
    key: "cuatro",
    era: { tr: "Las Noches — numaralandırma", en: "Las Noches — the numbering" },
    title: { tr: "Dördüncü sandalye", en: "The fourth chair" },
    text: {
      tr: "Hōgyoku Hollow'lardan Arrancar, Arrancar'lardan on numaralı Espada yaptı. Ulquiorra dördüncü oldu ve numara sol göğsüne yazıldı. Masadaki her sandalyenin bir işlevi vardı; onunki bakmak ve bildirmekti.",
      en: "The Hōgyoku made Arrancar out of Hollows and ten numbered Espada out of Arrancar. Ulquiorra became the fourth, and the number was written on the left of his chest. Every chair at that table had a function; his was to look and to report.",
    },
    mark: {
      kind: "term",
      text: "四",
      reading: { tr: "shi — dört. Cuatro.", en: "shi — four. Cuatro." },
    },
    kin: {
      characterId: 1086,
      name: "Sōsuke Aizen",
      role: { tr: "Numarayı veren", en: "The one who gave the number" },
    },
    imageKey: ULQ_IMAGE_KEYS.fateCuatro,
  },
  {
    key: "karakura",
    era: { tr: "Karakura — ilk gözlem", en: "Karakura — the first observation" },
    title: { tr: "Ölçtü ve öldürmedi", en: "He measured, and did not kill" },
    text: {
      tr: "İnsan dünyasına Aizen'in gözü olarak gönderildi. Karşısındaki çocuğun gücünün çok zayıfla kendisinden güçlü arasında gidip geldiğini not etti ve onu öldürmemeye karar verdi: böyle dalgalanan bir gücün eninde sonunda sahibini yıkacağını düşünüyordu. Aynı turda bir insanın iyileştirme yeteneğini de ölçtü ve bunun bir zaman-mekân yeteneği olduğunu öne sürdü.",
      en: "He was sent into the human world as Aizen's eye. He noted that the boy in front of him swung between very weak and stronger than himself, and decided not to kill him: he judged that a power fluctuating like that would destroy its owner in the end. On the same trip he measured a human's healing ability and argued that it was a spatio-temporal one.",
    },
    kin: {
      characterId: 5,
      name: "Ichigo Kurosaki",
      role: { tr: "Ölçülen çocuk", en: "The boy who was measured" },
    },
    imageKey: ULQ_IMAGE_KEYS.fateKarakura,
  },
  {
    key: "cell",
    era: { tr: "Las Noches — beyaz hücre", en: "Las Noches — the white cell" },
    title: { tr: "Gardiyan ve soru", en: "The jailer and the question" },
    text: {
      tr: "Tutsağın başında duran oydu: yemek getiriyor, saatleri sayıyor, bir şey sormuyordu. Sonra sormaya başladı. Sorusu kalbin ne olduğu değildi — kalbin nerede DURDUĞUydu. Görülemeyen bir şeyin var olabileceğini kabul etmiyordu ve bu duraktan sonra ilk kez kendi ölçüsünün dışında bir şeyle karşılaştı.",
      en: "He was the one who stood over the prisoner: bringing food, counting the hours, asking nothing. Then he began to ask. His question was not what the heart is — it was WHERE the heart is kept. He would not accept that something unseeable could exist, and after this stop he met, for the first time, a thing outside his own measure.",
    },
    mark: {
      kind: "question",
      text: "心はどこにある",
      reading: {
        tr: "Sahnenin sorusu — arşivin kendi Japonca karşılığı, birebir replik değil.",
        en: "The question of the scene — the archive's own Japanese rendering, not a verbatim line.",
      },
    },
    kin: {
      characterId: 7,
      name: "Orihime Inoue",
      role: { tr: "Sorulan kişi", en: "The one who was asked" },
    },
    imageKey: ULQ_IMAGE_KEYS.fateCell,
  },
  {
    key: "ash",
    era: { tr: "Las Noches — kubbenin üstü", en: "Las Noches — above the dome" },
    title: { tr: "İkinci salıveriş ve kül", en: "The second release, and ash" },
    text: {
      tr: "Espada'da eşi olmayan ikinci kat salıverişi açtı ve karşısındakine umutsuzluğu göstermeye çalıştı. Sonunda ayakta kalan o değildi. Dağılırken elini uzattı; sayfanın burada bıraktığı şey, o elin ne aradığı sorusu. Arşiv o andaki cümlenin birebir metnini doğrulayamadığı için buraya tırnak koymuyor.",
      en: "He opened the second stage of release, which no other Espada reaches, and tried to show his opponent despair. He was not the one left standing. As he came apart he reached out; what this page leaves here is the question of what that hand was looking for. The archive could not verify the verbatim line of that moment, so it puts no quotation marks here.",
    },
    mark: {
      kind: "term",
      text: "刀剣解放第二階層",
      reading: {
        tr: "Segunda Etapa — ikinci kat salıveriş.",
        en: "Segunda Etapa — the second stage of release.",
      },
    },
    imageKey: ULQ_IMAGE_KEYS.fateAsh,
  },
];

/* ── 7a · BAĞLAR ──────────────────────────────────────────────────────── */

export interface UlqBond {
  characterId: number;
  name: string;
  nativeName: string;
  role: LocalizedText;
  line: LocalizedText;
}

/**
 * Yoldaş listesi — `EXPERIENCE_COMPANIONS[1081]` ile BİREBİR aynı sıra.
 *
 * ⚠️ Dalga 1'in dördüncü dersi: sayfa kimi çiziyorsa o numara kayıtta olmak
 * zorunda, yoksa portresi girildiğinde bile kadraj sonsuza kadar boş kalıyor
 * (Armin'de olmuştu). Bu dört numaranın dördü de kayıtta.
 */
export const ULQ_BONDS: UlqBond[] = [
  {
    characterId: 7,
    name: "Orihime Inoue",
    nativeName: "井上織姫",
    role: { tr: "Tutsağı", en: "His prisoner" },
    line: {
      tr: "Kapının önünde duran gardiyan ile içerideki kişi arasındaki tek konu kalpti. Ölçemediği ilk şey.",
      en: "Between the jailer at the door and the person inside there was only one subject: the heart. The first thing he could not measure.",
    },
  },
  {
    characterId: 5,
    name: "Ichigo Kurosaki",
    nativeName: "黒崎一護",
    role: { tr: "Ölçtüğü ve yanıldığı", en: "Measured, and misjudged" },
    line: {
      tr: "İlk turda öldürmeye değmez saydı. İkinci turda karşısında duran şey artık ölçülebilir bir şey değildi.",
      en: "On the first pass he judged him not worth killing. On the second, the thing standing in front of him was no longer measurable.",
    },
  },
  {
    characterId: 1080,
    name: "Grimmjow Jaegerjaquez",
    nativeName: "グリムジョー・ジャガージャック",
    role: { tr: "Altıncı Espada", en: "The sixth Espada" },
    line: {
      tr: "İki Espada anlaşamıyor: biri tehdidin kendi kendini yok edeceğini söylüyor, diğeri şimdi bitirilmesi gerektiğini. Aizen dördüncünün kanaatini seçti ve altıncı izinsiz saldırdı.",
      en: "Two Espada do not agree: one says the threat will destroy itself, the other that it must be finished now. Aizen chose the fourth's judgement, and the sixth attacked without leave.",
    },
  },
  {
    characterId: 1086,
    name: "Sōsuke Aizen",
    nativeName: "藍染惣右介",
    role: { tr: "Efendisi", en: "His master" },
    line: {
      tr: "Emri veren ve kanaate güvenen kişi. Ulquiorra'nın bütün cevapları bir yere bildiriliyordu; bildirilen yer buydu.",
      en: "The one who gave the orders and trusted the judgement. All of Ulquiorra's answers were reported somewhere; this was the somewhere.",
    },
  },
];

export const ULQ_BOND_UI = {
  hasPage: { tr: "arşivde dosyası var", en: "has a file in the archive" },
  noPage: { tr: "dosyası yok", en: "no file yet" },
  portraitAlt: {
    tr: "arşive yüklenen portre",
    en: "portrait uploaded to the archive",
  },
} as const;

/** Bleach evren sayfasındaki gerçek çapalar (merkezde doğrulandı). */
export const ULQ_WORLD_LINKS = [
  {
    anchor: "espada",
    label: { tr: "Espada — on sandalye", en: "The Espada — ten chairs" },
    note: { tr: "Dördüncü sıra burada.", en: "The fourth rank is here." },
  },
  {
    anchor: "hueco",
    label: { tr: "Hueco Mundo", en: "Hueco Mundo" },
    note: { tr: "Çöl ve Las Noches.", en: "The desert and Las Noches." },
  },
  {
    anchor: "hierarchy",
    label: { tr: "Hollow hiyerarşisi", en: "The Hollow hierarchy" },
    note: {
      tr: "Bir Hollow'un Arrancar olana kadar geçtiği basamaklar.",
      en: "The steps a Hollow climbs on the way to becoming an Arrancar.",
    },
  },
] as const;

/* ── 7b · KAPANIŞ ─────────────────────────────────────────────────────── */

/**
 * ⚠️ İki "replik" yuvası TIRNAK İÇİNDE DEĞİL ve bilerek öyle: dosya
 * başındaki replik disiplini bloğuna bak. İkisi de SORU olarak etiketli ve
 * arşivin kendi Japonca karşılığı; sahnedeki cümlenin birebir metni
 * doğrulanamadı.
 */
export const ULQ_CLOSING = {
  questions: [
    {
      text: "心はどこにある",
      reading: { tr: "Kalp nerede duruyor?", en: "Where is the heart kept?" },
      note: {
        tr: "Gardiyanın hücrede sorduğu soru — arşivin kendi karşılığı, replik değil.",
        en: "The question the jailer asked in the cell — the archive's own rendering, not a line.",
      },
    },
    {
      text: "見えぬものは無いのか",
      reading: {
        tr: "Görülmeyen şey yok mudur?",
        en: "Is the unseen thing nothing?",
      },
      note: {
        tr: "Bütün tezinin tek satıra indirgenmiş hâli — yine arşivin karşılığı.",
        en: "His entire thesis reduced to one line — again the archive's rendering.",
      },
    },
  ],
  questionBadge: { tr: "soru", en: "question" },
  termBadge: { tr: "terim", en: "term" },
  quoteDiscipline: {
    tr: "Bu sayfada tırnak içinde tek bir diyalog yok. Ulquiorra'nın son sahnesindeki cümle çok ünlü ama birbirinden farklı yazımlarla dolaşıyor ve arşiv birebir metnini doğrulayamadı; doğrulanamayan yer boş bırakıldı.",
    en: "There is not a single quoted line of dialogue on this page. The sentence from Ulquiorra's final scene is famous but circulates in conflicting transcriptions, and the archive could not verify a verbatim text; the unverified place was left empty.",
  },
  motto: "黒翼大魔",
  mottoReading: {
    tr: "Murciélago — kara kanatlı büyük şeytan. Zanpakutō'nun adı; İspanyolcası \"yarasa\".",
    en: "Murciélago — great black-winged demon. The name of the zanpakutō; the Spanish word means \"bat\".",
  },
  credit: {
    tr: "Künye AniList'ten:",
    en: "Record from AniList:",
  },
  creditLink: {
    tr: "anilist.co/character/1081",
    en: "anilist.co/character/1081",
  },
  creditNote: {
    tr: "Doğum günü, boy ve Lanza del Relámpago'nun kanjisi AniList künyesinden; sıra, yön (虚無), dövmenin yeri, cero rengi, Murciélago ve Segunda Etapa arşivin kendi Bleach defterinden (lib/anime/bleach/espada.ts, dördüncü sıra kaydı). Portre AniList'in resmî karesi ve depoda duruyor — hotlink yok.",
    en: "Birthday, height and the kanji for Lanza del Relámpago come from the AniList record; the rank, the aspect (虚無), the placement of the tattoo, the cero colour, Murciélago and Segunda Etapa come from the archive's own Bleach ledger (lib/anime/bleach/espada.ts, the fourth-rank entry). The portrait is AniList's official frame and lives in the repo — no hotlinking.",
  },
} as const;

/* ── Bölüm başlıkları ve her bölümün SORUSU ───────────────────────────── */

/**
 * Her bölümün bir soru satırı var ve o satır varsayılanda da SAYFADA:
 * "Kalp nerede?" modu onu yaratmıyor, öne alıyor (dalga 1'in ikinci dersi:
 * kilitli ızgara varsayılanda da var olmalı).
 */
export const ULQ_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "The record" },
    lede: {
      tr: "Ölçülebilen her şey burada. İki satır boş ve öyle kalıyor.",
      en: "Everything measurable is here. Two rows are empty and stay that way.",
    },
    ask: {
      tr: "Bir künye kişiyi anlatabilir mi, yoksa yalnızca sınırlarını mı çiziyor?",
      en: "Can a record describe a person, or does it only draw their boundaries?",
    },
  },
  powers: {
    title: { tr: "Güç laboratuvarı", en: "The power lab" },
    lede: {
      tr: "Üç büyük. Hepsi görülebilen şeyler — onun kabul ettiği tek varlık ölçütü.",
      en: "Three large ones. All of them visible things — the only test of existence he accepts.",
    },
    ask: {
      tr: "Görülebilen her şey var; peki görülemeyen her şey yok mu?",
      en: "Everything visible exists; does that make everything invisible nothing?",
    },
  },
  minors: {
    title: { tr: "Dört küçük", en: "Four smaller" },
    lede: {
      tr: "Ölçüm, hız, mermi, ışın. Dördü de bir cevap üretiyor ve dördü de sayı veriyor.",
      en: "Measurement, speed, bullet, beam. All four produce an answer, and all four give a number.",
    },
    ask: {
      tr: "Bir sayıyla ölçtüğün şeyi tanımış olur musun?",
      en: "Does measuring a thing with a number mean you have known it?",
    },
  },
  heart: {
    title: { tr: "Kalp", en: "The heart" },
    lede: {
      tr: "Sayfanın kalbi burada değil — ortadaki boşlukta. Bu bölüm yalnızca defteri tutuyor.",
      en: "The heart of the page is not here — it is in the emptiness in the middle. This section only keeps the ledger.",
    },
    ask: {
      tr: "Beş cevabın hiçbiri yetmezse, soru mu yanlıştı yoksa cevap veren mi?",
      en: "If not one of five answers is enough, was the question wrong, or the one answering?",
    },
  },
  fate: {
    title: { tr: "Kader çizelgesi", en: "The chart of fate" },
    lede: {
      tr: "Beş durak, yaş yerine dönem etiketiyle: kayıtlı bir yaşı yok.",
      en: "Five stops, labelled by era instead of age: he has no recorded age.",
    },
    ask: {
      tr: "Bir yol, sonuna kadar gidilmeden anlaşılabilir mi?",
      en: "Can a road be understood before it is walked to the end?",
    },
  },
  bonds: {
    title: { tr: "Bağlar", en: "Bonds" },
    lede: {
      tr: "Dört kişi. Üçü emir zincirinde, biri değil — ve fark eden o oldu.",
      en: "Four people. Three of them in the chain of command, one not — and she was the one who made the difference.",
    },
    ask: {
      tr: "Bir bağ ölçülemiyorsa, o bağ yok mu sayılır?",
      en: "If a bond cannot be measured, does that mean there is no bond?",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "İki soru, bir ad ve kaynak künyesi. Tırnak yok.",
      en: "Two questions, one name and the source record. No quotation marks.",
    },
    ask: {
      tr: "Elini uzattığında ne aradığını biliyor muydu?",
      en: "When he reached out, did he know what he was reaching for?",
    },
  },
} as const;

/** Küratör özet bloğunun metinleri. */
export const ULQ_GAPS = {
  title: { tr: "Ulquiorra — boş yuvalar", en: "Ulquiorra — empty slots" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bütün yuvalar dolu. Bu sayfanın boşluğu artık yalnızca ızgarasında.",
    en: "Every slot is filled. This page's emptiness now lives only in its grid.",
  },
} as const;
