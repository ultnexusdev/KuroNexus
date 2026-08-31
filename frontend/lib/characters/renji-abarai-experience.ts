import type { LocalizedText } from "./types";

/**
 * Renji Abarai (阿散井恋次) — AniList #906, Bleach.
 *
 * Sayfanın BÜTÜN metni burada. Bileşen tarafında tek bir düz dize yok
 * (Faz 2 §1): görünen her şey `LocalizedText` ve `pick(text, locale)` ile
 * çözülüyor, istemci adalarına yalnızca çözülmüş düz dize iniyor.
 *
 * ── KÜNYE KAYNAĞI ────────────────────────────────────────────────────────
 * `public/assets/anime/karakterler/renji-abarai/kaynak.json` (AniList
 * çekimi). Oradan gelen doğrulanmış alanlar: doğum 31 Ağustos, boy 188 cm,
 * ırk Shinigami, rütbe 6. Bölük Vekili, zanpakutō Zabimaru, kaptanı
 * Byakuya Kuchiki, diğer adlar "Freeloader" ve "Red Pineapple".
 *
 * ⚠️ YAŞ ve KAN GRUBU AniList künyesinde `null`. Uydurulmadı — künye
 * şeridinde iki satır bilerek boş duruyor ve `RENJI_MISSING_NOTE` bunu
 * yazıyla söylüyor. Aynı disiplin sayılar için de geçerli: bu dosyada
 * menzil, ağırlık, bölüm numarası gibi ölçülmemiş hiçbir sayı yok —
 * zincirin "menzil" okumaları NİTELİKSEL (kol boyu, salon boyu), çünkü
 * Zabimaru'nun uzunluğu kaynakta bir sayı olarak verilmiyor.
 *
 * ── TIRNAK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Tırnak içine yalnızca BELGELİ orijinal diziler alındı: serbest bırakma
 * komutu 「咆えろ、蛇尾丸」 ve bankai çağrısı 「卍解、狒狒王蛇尾丸」.
 * Uydurma diyalog yok; kalan her cümle anlatı sesinde, tırnaksız.
 */

export const RENJI_ID = 906;

/** Künyedeki resmî adres — `detail.character.siteUrl` boşsa buraya düşülür. */
export const RENJI_SITE_URL = "https://anilist.co/character/906";

/**
 * Depodaki resmî portre. 230×346 — yani KÜÇÜK: tam kanama bir hero olarak
 * kullanılamaz, yalnızca dar bir madalyon kadrajında duruyor (Faz 2 §3).
 * Büyük hero karesi boş bir küratör yuvası olarak bekliyor.
 */
export const RENJI_PORTRAIT = {
  src: "/assets/anime/karakterler/renji-abarai/anilist-portrait.png",
  w: 230,
  h: 346,
} as const;

/**
 * ABILITY yuva anahtarları — önek `ren:`.
 *
 * Sahne görseli ÜRETİLMİYOR (Faz 2 §3). Her kadraj boş duruyor, hemen
 * altında kendi yükleme yuvası var ve bölüm görselsiz de ayakta.
 */
export const RENJI_IMAGE_KEYS = {
  hero: "ren:hero",

  /* Güç laboratuvarı — üç büyük */
  zanpakuto: "ren:zanpakuto",
  shikai: "ren:shikai",
  bankai: "ren:bankai",

  /* Güç laboratuvarı — dört küçük */
  soo: "ren:soo",
  kido: "ren:kido",
  hoho: "ren:hoho",
  zanjutsu: "ren:zanjutsu",

  /* Eklem zinciri — altı kademe */
  kademe1: "ren:kademe-1",
  kademe2: "ren:kademe-2",
  kademe3: "ren:kademe-3",
  kademe4: "ren:kademe-4",
  kademe5: "ren:kademe-5",
  kademe6: "ren:kademe-6",

  /* Kader çizelgesi — beş dönem */
  donem1: "ren:donem-1",
  donem2: "ren:donem-2",
  donem3: "ren:donem-3",
  donem4: "ren:donem-4",
  donem5: "ren:donem-5",

  closing: "ren:kapanis",
} as const;

export type RenjiImageKey =
  (typeof RENJI_IMAGE_KEYS)[keyof typeof RENJI_IMAGE_KEYS];

/** Yuvanın sayfadaki adı — `CuratorSlot` etiketi ve `CuratorGaps` satırı. */
export const RENJI_SLOT_LABELS: Record<string, LocalizedText> = {
  [RENJI_IMAGE_KEYS.hero]: {
    tr: "Hero — dikey portre",
    en: "Hero — vertical portrait",
  },
  [RENJI_IMAGE_KEYS.zanpakuto]: {
    tr: "Zanpakutō — mühürlü kılıç",
    en: "Zanpakutō — the sealed blade",
  },
  [RENJI_IMAGE_KEYS.shikai]: {
    tr: "Shikai — eklemlere ayrılan ağız",
    en: "Shikai — the blade splitting into segments",
  },
  [RENJI_IMAGE_KEYS.bankai]: {
    tr: "Bankai — Hihiō Zabimaru",
    en: "Bankai — Hihiō Zabimaru",
  },
  [RENJI_IMAGE_KEYS.soo]: {
    tr: "Sōō Zabimaru — gerçek ad",
    en: "Sōō Zabimaru — the true name",
  },
  [RENJI_IMAGE_KEYS.kido]: { tr: "Kidō — zayıf kanat", en: "Kidō — the weak wing" },
  [RENJI_IMAGE_KEYS.hoho]: { tr: "Hohō — Shunpo", en: "Hohō — Shunpo" },
  [RENJI_IMAGE_KEYS.zanjutsu]: { tr: "Zanjutsu — kılıç işi", en: "Zanjutsu — swordwork" },

  [RENJI_IMAGE_KEYS.kademe1]: {
    tr: "Kademe 1 — mühür",
    en: "Stage 1 — sealed",
  },
  [RENJI_IMAGE_KEYS.kademe2]: {
    tr: "Kademe 2 — shikai",
    en: "Stage 2 — shikai",
  },
  [RENJI_IMAGE_KEYS.kademe3]: {
    tr: "Kademe 3 — iki ruh",
    en: "Stage 3 — two spirits",
  },
  [RENJI_IMAGE_KEYS.kademe4]: {
    tr: "Kademe 4 — bankai",
    en: "Stage 4 — bankai",
  },
  [RENJI_IMAGE_KEYS.kademe5]: {
    tr: "Kademe 5 — kırık",
    en: "Stage 5 — broken",
  },
  [RENJI_IMAGE_KEYS.kademe6]: {
    tr: "Kademe 6 — gerçek ad",
    en: "Stage 6 — the true name",
  },

  [RENJI_IMAGE_KEYS.donem1]: { tr: "Dönem 1 — Inuzuri", en: "Era 1 — Inuzuri" },
  [RENJI_IMAGE_KEYS.donem2]: { tr: "Dönem 2 — Akademi", en: "Era 2 — the Academy" },
  [RENJI_IMAGE_KEYS.donem3]: { tr: "Dönem 3 — Gotei 13", en: "Era 3 — Gotei 13" },
  [RENJI_IMAGE_KEYS.donem4]: { tr: "Dönem 4 — Seireitei", en: "Era 4 — the Seireitei" },
  [RENJI_IMAGE_KEYS.donem5]: {
    tr: "Dönem 5 — Bin Yıllık Kan Savaşı",
    en: "Era 5 — the Thousand-Year Blood War",
  },

  [RENJI_IMAGE_KEYS.closing]: { tr: "Kapanış bandı", en: "Closing band" },
};

/** Beklenen kare: tip + ölçü + biçim. `CuratorGaps` bunu ikinci satıra yazıyor. */
export const RENJI_SLOT_SPECS: Record<string, LocalizedText> = {
  [RENJI_IMAGE_KEYS.hero]: {
    tr: "dikey kadraj · 1200×1600 · webp",
    en: "vertical frame · 1200×1600 · webp",
  },
  [RENJI_IMAGE_KEYS.zanpakuto]: {
    tr: "geniş kadraj · 1400×900 · webp",
    en: "wide frame · 1400×900 · webp",
  },
  [RENJI_IMAGE_KEYS.shikai]: {
    tr: "geniş kadraj · 1400×900 · webp",
    en: "wide frame · 1400×900 · webp",
  },
  [RENJI_IMAGE_KEYS.bankai]: {
    tr: "geniş kadraj · 1400×900 · webp",
    en: "wide frame · 1400×900 · webp",
  },
  [RENJI_IMAGE_KEYS.soo]: {
    tr: "kare kadraj · 800×800 · webp",
    en: "square frame · 800×800 · webp",
  },
  [RENJI_IMAGE_KEYS.kido]: {
    tr: "kare kadraj · 800×800 · webp",
    en: "square frame · 800×800 · webp",
  },
  [RENJI_IMAGE_KEYS.hoho]: {
    tr: "kare kadraj · 800×800 · webp",
    en: "square frame · 800×800 · webp",
  },
  [RENJI_IMAGE_KEYS.zanjutsu]: {
    tr: "kare kadraj · 800×800 · webp",
    en: "square frame · 800×800 · webp",
  },

  [RENJI_IMAGE_KEYS.kademe1]: {
    tr: "eklem kadrajı · 1200×720 · webp",
    en: "segment frame · 1200×720 · webp",
  },
  [RENJI_IMAGE_KEYS.kademe2]: {
    tr: "eklem kadrajı · 1200×720 · webp",
    en: "segment frame · 1200×720 · webp",
  },
  [RENJI_IMAGE_KEYS.kademe3]: {
    tr: "eklem kadrajı · 1200×720 · webp",
    en: "segment frame · 1200×720 · webp",
  },
  [RENJI_IMAGE_KEYS.kademe4]: {
    tr: "eklem kadrajı · 1200×720 · webp",
    en: "segment frame · 1200×720 · webp",
  },
  [RENJI_IMAGE_KEYS.kademe5]: {
    tr: "eklem kadrajı · 1200×720 · webp",
    en: "segment frame · 1200×720 · webp",
  },
  [RENJI_IMAGE_KEYS.kademe6]: {
    tr: "eklem kadrajı · 1200×720 · webp",
    en: "segment frame · 1200×720 · webp",
  },

  [RENJI_IMAGE_KEYS.donem1]: {
    tr: "dönem kadrajı · 1400×800 · webp",
    en: "era frame · 1400×800 · webp",
  },
  [RENJI_IMAGE_KEYS.donem2]: {
    tr: "dönem kadrajı · 1400×800 · webp",
    en: "era frame · 1400×800 · webp",
  },
  [RENJI_IMAGE_KEYS.donem3]: {
    tr: "dönem kadrajı · 1400×800 · webp",
    en: "era frame · 1400×800 · webp",
  },
  [RENJI_IMAGE_KEYS.donem4]: {
    tr: "dönem kadrajı · 1400×800 · webp",
    en: "era frame · 1400×800 · webp",
  },
  [RENJI_IMAGE_KEYS.donem5]: {
    tr: "dönem kadrajı · 1400×800 · webp",
    en: "era frame · 1400×800 · webp",
  },

  [RENJI_IMAGE_KEYS.closing]: {
    tr: "yatay bant · 1600×700 · webp",
    en: "horizontal band · 1600×700 · webp",
  },
};

/** `CuratorUpload` ölçüyü ve oranı kendisi yazıyor; kaynağı bu tablo. */
export const RENJI_SLOT_SIZES: Record<string, { w: number; h: number }> = {
  [RENJI_IMAGE_KEYS.hero]: { w: 1200, h: 1600 },
  [RENJI_IMAGE_KEYS.zanpakuto]: { w: 1400, h: 900 },
  [RENJI_IMAGE_KEYS.shikai]: { w: 1400, h: 900 },
  [RENJI_IMAGE_KEYS.bankai]: { w: 1400, h: 900 },
  [RENJI_IMAGE_KEYS.soo]: { w: 800, h: 800 },
  [RENJI_IMAGE_KEYS.kido]: { w: 800, h: 800 },
  [RENJI_IMAGE_KEYS.hoho]: { w: 800, h: 800 },
  [RENJI_IMAGE_KEYS.zanjutsu]: { w: 800, h: 800 },
  [RENJI_IMAGE_KEYS.kademe1]: { w: 1200, h: 720 },
  [RENJI_IMAGE_KEYS.kademe2]: { w: 1200, h: 720 },
  [RENJI_IMAGE_KEYS.kademe3]: { w: 1200, h: 720 },
  [RENJI_IMAGE_KEYS.kademe4]: { w: 1200, h: 720 },
  [RENJI_IMAGE_KEYS.kademe5]: { w: 1200, h: 720 },
  [RENJI_IMAGE_KEYS.kademe6]: { w: 1200, h: 720 },
  [RENJI_IMAGE_KEYS.donem1]: { w: 1400, h: 800 },
  [RENJI_IMAGE_KEYS.donem2]: { w: 1400, h: 800 },
  [RENJI_IMAGE_KEYS.donem3]: { w: 1400, h: 800 },
  [RENJI_IMAGE_KEYS.donem4]: { w: 1400, h: 800 },
  [RENJI_IMAGE_KEYS.donem5]: { w: 1400, h: 800 },
  [RENJI_IMAGE_KEYS.closing]: { w: 1600, h: 700 },
};

/** PORTRAIT yuvası — küratörün yükleyeceği tam boy kapak. */
export const RENJI_PORTRAIT_SLOT: LocalizedText = {
  tr: "Kapak portresi — dikey, 1200×1600, webp",
  en: "Cover portrait — vertical, 1200×1600, webp",
};

/**
 * Boş kadrajın içindeki üretim notu.
 *
 * ⚠️ Yalnızca `isAdmin` iken çiziliyor (Dalga 1'in birinci dersi): sıradan
 * ziyaretçi yirmi kutu ve yirmi kez üretim metadatası görmemeli, ekran
 * okuyucu da onları okumamalı.
 */
export const RENJI_FRAME_EMPTY: LocalizedText = {
  tr: "eklem boş",
  en: "joint empty",
};

export const RENJI_ALT = {
  scenePrefix: {
    tr: "Renji Abarai — küratörün yüklediği kare:",
    en: "Renji Abarai — curator-uploaded frame:",
  },
} as const;

export const RENJI_CRUMB = {
  series: { tr: "Bleach", en: "Bleach" },
} as const;

/* ══ 1 · HERO ═══════════════════════════════════════════════════════════ */

export const RENJI_HERO = {
  lede: {
    tr: "Zabimaru tek parça bir kılıç değil. Kabzadan uca kadar eklemli, ve her eklem bir uzama izni. Bu sayfa da öyle kuruldu: bölümler sola sağa kayıyor, aralarındaki eklemler onları birbirine bağlıyor, göz yukarıdan aşağı zikzak çiziyor.",
    en: "Zabimaru is not one solid blade. It is jointed from grip to tip, and every joint is permission to grow. This page is built the same way: sections swing left and right, joints bind them together, and the eye zigzags from top to bottom.",
  },
  portraitAlt: {
    tr: "Renji Abarai — AniList resmî portresi (230×346, depoya indirildi)",
    en: "Renji Abarai — official AniList portrait (230×346, stored in-repo)",
  },
  portraitAltUploaded: {
    tr: "Renji Abarai — küratörün yüklediği kapak portresi",
    en: "Renji Abarai — curator-uploaded cover portrait",
  },
  heroCaption: {
    tr: "Büyük hero karesi bilerek boş: elimizdeki resmî portre 230 piksel eninde ve bu kadraj için küçük kalıyor. Kare doldurulana kadar burada eklemli bir omurga duruyor.",
    en: "The large hero frame is deliberately empty: the official portrait we hold is 230 pixels wide and too small for this crop. Until it is filled, a jointed spine stands here.",
  },
  watermarkReading: {
    tr: "蛇尾丸 — Zabimaru: yılan, kuyruk, ve kılıç adlarına eklenen -maru.",
    en: "蛇尾丸 — Zabimaru: snake, tail, and the -maru suffix given to blade names.",
  },
} as const;

export const RENJI_IDENTITY = {
  name: "Renji Abarai",
  nativeName: "阿散井恋次",
  title: "六番隊副隊長",
  titleReading: {
    tr: "Rokubantai fukutaichō — Altıncı Bölük Vekili",
    en: "Rokubantai fukutaichō — Lieutenant of the Sixth Division",
  },
  epigraph: {
    tr: "Bir kılıcın uzayabilmesi için önce kırılmayı göze alması gerekir.",
    en: "For a blade to reach further, it must first accept being broken.",
  },

  /** Künye şeridi. İki satır bilerek boş — gerekçe `RENJI_MISSING_NOTE`. */
  facts: [
    {
      label: { tr: "Doğum", en: "Birth" },
      value: { tr: "31 Ağustos", en: "31 August" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "188 cm", en: "188 cm" },
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
      label: { tr: "Irk", en: "Race" },
      value: { tr: "Shinigami", en: "Shinigami" },
    },
    {
      label: { tr: "Rütbe", en: "Rank" },
      value: {
        tr: "Vekil (fukutaichō)",
        en: "Lieutenant (fukutaichō)",
      },
    },
    {
      label: { tr: "Takım", en: "Squad" },
      value: { tr: "Gotei 13 · 6. Bölük", en: "Gotei 13 · Sixth Division" },
    },
    {
      label: { tr: "Kaptanı", en: "Captain" },
      value: { tr: "Byakuya Kuchiki", en: "Byakuya Kuchiki" },
    },
    {
      label: { tr: "Zanpakutō", en: "Zanpakutō" },
      value: { tr: "Zabimaru (蛇尾丸)", en: "Zabimaru (蛇尾丸)" },
    },
    {
      label: { tr: "Diğer adları", en: "Also known as" },
      value: {
        tr: "Freeloader · Red Pineapple",
        en: "Freeloader · Red Pineapple",
      },
    },
    {
      label: { tr: "Sembolik obje", en: "Symbolic object" },
      value: {
        tr: "Eklemli ağız — ve alındaki dövme çizgileri",
        en: "The jointed blade — and the tattoo lines on his brow",
      },
    },
  ],
} as const;

export const RENJI_MISSING_NOTE: LocalizedText = {
  tr: "Yaş ve kan grubu satırları boş, çünkü AniList künyesi Renji için ikisini de taşımıyor. Uydurmak yerine boş bırakıldı; kayıt güncellenirse satır kendiliğinden dolar.",
  en: "The age and blood-type rows are empty because the AniList record carries neither for Renji. Rather than invent them we left them blank; if the record is updated, the rows fill themselves.",
};

/* ══ 2 · MOD DÜĞMESİ ════════════════════════════════════════════════════ */

/**
 * "Bankai" düğmesi — `data-release="shikai" | "bankai"`.
 *
 * Düğme ışık değil YAPI değiştiriyor: zikzağın genliği açılıyor, eklem
 * parçaları uzuyor, kemik beyazı omurga motifi beliriyor. `shikai`
 * hâlinde de zikzak DURUYOR, yalnızca dar (Dalga 1'in ikinci dersi:
 * kilitli ızgara varsayılan durumda da var olmalı).
 */
export const RENJI_RELEASE = {
  title: { tr: "Bırakma", en: "Release" },
  native: "卍解",
  toBankai: { tr: "Bankai", en: "Bankai" },
  toShikai: { tr: "Shikai'ye dön", en: "Back to shikai" },
  hintShikai: {
    tr: "Shikai. Eklemler kısa, zikzak dar — sayfa kabzaya yakın duruyor.",
    en: "Shikai. Joints short, zigzag narrow — the page stays close to the grip.",
  },
  hintBankai: {
    tr: "Bankai. Eklemler uzadı, zikzağın genliği açıldı ve kemik beyazı omurga göründü.",
    en: "Bankai. The joints have stretched, the zigzag has widened, and the bone-white spine has surfaced.",
  },
  markLabel: {
    tr: "Eklem göstergesi",
    en: "Joint indicator",
  },
} as const;

/* ══ BÖLÜM BAŞLIKLARI ═══════════════════════════════════════════════════ */

export const RENJI_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "Record" },
    lede: {
      tr: "AniList çekiminden gelen satırlar. Boş olanlar boş bırakıldı.",
      en: "Rows from the AniList capture. The empty ones were left empty.",
    },
  },
  blades: {
    title: { tr: "Ağız", en: "The Blade" },
    lede: {
      tr: "Üç büyük kademe: mühürlü zanpakutō, shikai ve bankai. Bleach'in kendi terminolojisiyle.",
      en: "Three major stages: the sealed zanpakutō, shikai, and bankai — in Bleach's own terminology.",
    },
  },
  kit: {
    title: { tr: "Dört Kanat", en: "Four Wings" },
    lede: {
      tr: "Bir Shinigami dört kanatta ölçülür. Renji'ninkilerden biri açıkça kısa ve bunu kendisi de saklamıyor.",
      en: "A Shinigami is measured on four wings. One of Renji's is plainly short, and he does not hide it.",
    },
  },
  chain: {
    title: { tr: "Uzat", en: "Extend" },
    lede: {
      tr: "Sayfanın kalbi. Her tıklamada zincir bir eklem daha uzuyor, o eklem aşağıda yeni bir bölüm açıyor ve zikzağın yönü değişiyor. Altı eklem, altı kademe.",
      en: "The heart of the page. Each press extends the chain by one joint, that joint opens a new section below, and the zigzag flips direction. Six joints, six stages.",
    },
  },
  fate: {
    title: { tr: "Beş Dönem", en: "Five Eras" },
    lede: {
      tr: "Yaş değil dönem: künyede yaş yok, ama Renji'nin geçtiği yerler belli.",
      en: "Eras, not ages: the record carries no age, but the places Renji passed through are clear.",
    },
  },
  bonds: {
    title: { tr: "Bağlar", en: "Bonds" },
    lede: {
      tr: "Beş isim. Arşivde dosyası olanlar bağlantılı, olmayanlar düz adla duruyor.",
      en: "Five names. Those with a file in the archive are linked; the rest stand as plain names.",
    },
  },
  nexus: {
    title: { tr: "Evrene Açılan Eklemler", en: "Joints Into the World" },
    lede: {
      tr: "Bleach Evreni sayfasındaki dört bölüm — Renji'nin durduğu yerler.",
      en: "Four sections of the Bleach universe page — the places Renji stands in.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "İki komut ve bir ad. Tırnak içine yalnızca belgeli orijinal diziler alındı.",
      en: "Two commands and a name. Only documented original strings were placed in quotes.",
    },
  },
} as const;

/* ══ 4a · GÜÇ LABORATUVARI — ÜÇ BÜYÜK ═══════════════════════════════════ */

export const RENJI_BLADES = [
  {
    key: "zanpakuto",
    imageKey: RENJI_IMAGE_KEYS.zanpakuto,
    name: "蛇尾丸",
    reading: "Zabimaru",
    turkish: { tr: "Zanpakutō — mühürlü hâl", en: "Zanpakutō — sealed state" },
    tagline: {
      tr: "Kapalıyken sıradan bir katana.",
      en: "Sealed, it is an ordinary katana.",
    },
    text: {
      tr: "Mühürlü hâlde Zabimaru diğer zanpakutōlardan ayırt edilemez: tek ağız, tek gövde, bir kol boyu menzil. Adın kendisi ise ne olacağını baştan söylüyor — 蛇 yılan, 尾 kuyruk, 丸 kılıç adlarına eklenen sonek. Yani kabzada duran şey zaten bir kuyruk.",
      en: "Sealed, Zabimaru is indistinguishable from any other zanpakutō: one edge, one body, an arm's length of reach. The name says what it will become — 蛇 snake, 尾 tail, 丸 the suffix given to blade names. What rests in the grip is already a tail.",
    },
    traits: [
      { tr: "Tek ağız, tek gövde", en: "One edge, one body" },
      { tr: "Menzil: bir kol boyu", en: "Reach: an arm's length" },
      { tr: "Adı sonucu söylüyor", en: "The name states the outcome" },
    ],
  },
  {
    key: "shikai",
    imageKey: RENJI_IMAGE_KEYS.shikai,
    name: "始解",
    reading: "Shikai",
    turkish: { tr: "İlk Bırakma", en: "Initial Release" },
    tagline: { tr: "咆えろ、蛇尾丸", en: "咆えろ、蛇尾丸" },
    text: {
      tr: "Komutla birlikte ağız altı bölüme ayrılıyor ve aralarını esnek bir bağ tutuyor. Artık kılıç değil kamçı: uzuyor, kıvrılıyor, siperin arkasından dolanıyor. Bedeli de aynı yerden geliyor — eklemli bir ağız savunmada tek parça bir ağız kadar sağlam değil.",
      en: "On command the edge separates into segments held together by a flexible link. It is no longer a sword but a whip: it extends, it curls, it reaches around cover. The cost comes from the same place — a jointed edge does not hold a guard the way a solid one does.",
    },
    traits: [
      { tr: "Komut: 咆えろ (Hoero — kükre)", en: "Command: 咆えろ (Hoero — howl)" },
      { tr: "Bölümlere ayrılan ağız", en: "Edge parted into segments" },
      { tr: "Menzilde kazanır, siperde kaybeder", en: "Wins on reach, loses on guard" },
    ],
  },
  {
    key: "bankai",
    imageKey: RENJI_IMAGE_KEYS.bankai,
    name: "狒狒王蛇尾丸",
    reading: "Hihiō Zabimaru",
    turkish: { tr: "Bankai — Babun Kralı Zabimaru", en: "Bankai — Baboon King Zabimaru" },
    tagline: {
      tr: "Aynı eklem, sokak boyunda.",
      en: "The same joint, at street length.",
    },
    text: {
      tr: "Bankai'de eklemler kemikten devasa bir yılana dönüşüyor; ağızda dişler, kuyrukta ayrı bir gövde. Mekanik değişmiyor, yalnızca ölçek değişiyor: uzat, sav, geri topla. Renji bankai'sini ilk kez kaptanının karşısında açtı ve o gün de kazanamadı.",
      en: "In bankai the joints become a colossal serpent of bone: teeth at the head, a separate body in the tail. The mechanism does not change, only the scale: extend, strike, retract. Renji first opened his bankai against his own captain, and did not win that day either.",
    },
    traits: [
      { tr: "Çağrı: 卍解、狒狒王蛇尾丸", en: "Call: 卍解、狒狒王蛇尾丸" },
      { tr: "Kemik eklemli yılan gövdesi", en: "Serpent body of bone joints" },
      { tr: "Ölçek büyüyor, mekanik aynı", en: "Scale grows, mechanism holds" },
    ],
  },
] as const;

/* ══ 4b · GÜÇ LABORATUVARI — DÖRT KÜÇÜK ═════════════════════════════════ */

export const RENJI_KIT = [
  {
    key: "soo",
    imageKey: RENJI_IMAGE_KEYS.soo,
    name: "双王蛇尾丸",
    reading: "Sōō Zabimaru",
    turkish: { tr: "Gerçek bankai", en: "The true bankai" },
    note: {
      tr: "Kılıcı kırıldıktan sonra yeniden dövüldü ve Renji Zabimaru'nun gerçek adını öğrendi. 双王: iki kral — çünkü Zabimaru baştan beri iki varlıktı.",
      en: "After his blade broke it was reforged, and Renji learned Zabimaru's true name. 双王: twin kings — because Zabimaru was two beings all along.",
    },
  },
  {
    key: "kido",
    imageKey: RENJI_IMAGE_KEYS.kido,
    name: "鬼道",
    reading: "Kidō",
    turkish: { tr: "Şeytan yolu — büyü", en: "Demon way — spellcraft" },
    note: {
      tr: "Renji'nin açıkça zayıf olduğu kanat. Kidō hassasiyet ve sabır istiyor; onun elindeki her şey menzile ve şiddete gidiyor. Bunu bir sır gibi taşımıyor, meselesi zaten bu değil.",
      en: "The wing where Renji is plainly weak. Kidō asks for precision and patience; everything in his hands turns into reach and force instead. He does not carry this as a secret — it was never his question.",
    },
  },
  {
    key: "hoho",
    imageKey: RENJI_IMAGE_KEYS.hoho,
    name: "歩法",
    reading: "Hohō · Shunpo",
    turkish: { tr: "Adım yöntemi", en: "Step method" },
    note: {
      tr: "Shunpo'yu bir vekilden beklenecek düzeyde kullanıyor: yetişmeye yeter, kaçmaya değil. Zaten uzayan bir ağzı olan biri için hız ikinci mesele.",
      en: "He uses shunpo at the level a lieutenant is expected to: enough to close a gap, not to slip one. For someone whose edge already extends, speed is the second question.",
    },
  },
  {
    key: "zanjutsu",
    imageKey: RENJI_IMAGE_KEYS.zanjutsu,
    name: "斬術",
    reading: "Zanjutsu",
    turkish: { tr: "Kılıç işi", en: "Swordwork" },
    note: {
      tr: "Asıl kanat burası. Renji'nin kılıç işi 11. Bölük'ün kaba okulunda başladı ve 6. Bölük'ün disiplinli okulunda biçim aldı; iki mektebi de üzerinde taşıyor.",
      en: "This is the real wing. Renji's swordwork began in the rough school of the Eleventh Division and took shape in the disciplined school of the Sixth; he carries both on him.",
    },
  },
] as const;

/* ══ 5 · EKLEM ZİNCİRİ — SAYFANIN KALBİ ═════════════════════════════════ */

/**
 * Altı kademe. Her biri zincirin BİR EKLEMİ ve açıldığında sayfada yeni bir
 * bölüm oluyor; zikzağın yönü her eklemde değişiyor.
 *
 * ⚠️ `reach` alanı bilerek NİTELİKSEL. Zabimaru'nun uzunluğu kaynakta bir
 * sayı olarak verilmiyor; "12 metre" yazmak uydurma olurdu (Dalga 1'in
 * beşinci dersi). Beşinci eklem bunun tersi: menzil sıfır, çünkü kılıç
 * kırık — zincir uzuyor ama erişim çöküyor.
 */
export const RENJI_SEGMENTS = [
  {
    key: "muhur",
    imageKey: RENJI_IMAGE_KEYS.kademe1,
    native: "蛇尾丸",
    stage: { tr: "Kademe bir", en: "Stage one" },
    title: { tr: "Mühür", en: "Sealed" },
    reach: { tr: "Menzil: bir kol boyu", en: "Reach: an arm's length" },
    text: {
      tr: "Kabzada duran şey henüz bir katana. Rukongai'den gelen bir çocuğun eline verilen ilk ciddi alet, ve o çocuk onunla ne yapacağını daha bilmiyor.",
      en: "What rests in the grip is still a katana. The first serious tool handed to a boy out of the Rukongai, and that boy does not yet know what to do with it.",
    },
    note: {
      tr: "Zincirin ilk halkası: kapalı, tek parça, sessiz.",
      en: "The chain's first link: closed, solid, silent.",
    },
  },
  {
    key: "shikai",
    imageKey: RENJI_IMAGE_KEYS.kademe2,
    native: "始解",
    stage: { tr: "Kademe iki", en: "Stage two" },
    title: { tr: "Shikai", en: "Shikai" },
    reach: { tr: "Menzil: odanın karşı duvarı", en: "Reach: the far wall of the room" },
    text: {
      tr: "咆えろ. Ağız altı bölüme ayrılıyor ve aralarındaki bağ geriliyor. Renji'nin bütün dövüş üslubu bu tek cümlede kuruluyor: mesafeyi kapatma, mesafeyi uzat.",
      en: "咆えろ. The edge parts into segments and the link between them draws tight. Renji's entire style is founded on one sentence: do not close the distance — extend it.",
    },
    note: {
      tr: "İlk yön değişimi: sayfa buradan itibaren öteki tarafa kayıyor.",
      en: "The first flip: from here the page swings to the other side.",
    },
  },
  {
    key: "iki-ruh",
    imageKey: RENJI_IMAGE_KEYS.kademe3,
    native: "蛇 · 狒狒",
    stage: { tr: "Kademe üç", en: "Stage three" },
    title: { tr: "İki ruh", en: "Two spirits" },
    reach: { tr: "Menzil: iki ayrı ses", en: "Reach: two separate voices" },
    text: {
      tr: "Zabimaru tek bir ruh değil: yılan ve babun, aynı kılıcın içinde iki varlık. Arşivin kendi kaynağı da bunu doğruluyor — AniList Zabimaru'yu tek kayıt olarak değil, dişi ve erkek iki ayrı karakter kaydı olarak tutuyor.",
      en: "Zabimaru is not a single spirit: a snake and a baboon, two beings inside one blade. The archive's own source confirms it — AniList keeps Zabimaru not as one entry but as two separate character records, female and male.",
    },
    note: {
      tr: "Kaynak: kaynak.json'daki zanpakutō alanı iki ayrı AniList kaydına bağlanıyor.",
      en: "Source: the zanpakutō field in kaynak.json links to two separate AniList records.",
    },
  },
  {
    key: "bankai",
    imageKey: RENJI_IMAGE_KEYS.kademe4,
    native: "卍解",
    stage: { tr: "Kademe dört", en: "Stage four" },
    title: { tr: "Bankai", en: "Bankai" },
    reach: { tr: "Menzil: sokağın öbür ucu", en: "Reach: the far end of the street" },
    text: {
      tr: "卍解、狒狒王蛇尾丸. Eklemler kemikten bir yılana büyüyor. Renji bunu ilk kez kaptanının karşısında açtı — ve kaybetti. Kademe, kazanılan dövüşle değil, girilebilen ölçekle sayılıyor.",
      en: "卍解、狒狒王蛇尾丸. The joints grow into a serpent of bone. Renji first opened it against his own captain — and lost. A stage is counted by the scale you can enter, not by the fight you win.",
    },
    note: {
      tr: "Zikzak burada en geniş salınımına çıkıyor.",
      en: "The zigzag reaches its widest swing here.",
    },
  },
  {
    key: "kirik",
    imageKey: RENJI_IMAGE_KEYS.kademe5,
    native: "—",
    stage: { tr: "Kademe beş", en: "Stage five" },
    title: { tr: "Kırık", en: "Broken" },
    reach: { tr: "Menzil: sıfır", en: "Reach: zero" },
    text: {
      tr: "Zincirin tek geri adımı. Zabimaru kırıldı ve elinde adı olmayan bir parça kaldı. Bu eklem de uzuyor — ama açtığı bölümde okunacak bir menzil yok. Kılıcın bir kademesi de kaybetmektir.",
      en: "The chain's single step backwards. Zabimaru broke, and what remained in his hand was a piece without a name. This joint extends too — but the section it opens has no reach to read. One of a blade's stages is losing it.",
    },
    note: {
      tr: "Bu eklemin kanjisi yok, çünkü o anda kılıcın adı da yoktu.",
      en: "This joint carries no kanji, because at that moment the blade had no name either.",
    },
  },
  {
    key: "gercek-ad",
    imageKey: RENJI_IMAGE_KEYS.kademe6,
    native: "双王蛇尾丸",
    stage: { tr: "Kademe altı", en: "Stage six" },
    title: { tr: "Gerçek ad", en: "The true name" },
    reach: { tr: "Menzil: iki kral birden", en: "Reach: both kings at once" },
    text: {
      tr: "Kırık kılıç yeniden dövüldü ve Renji bu kez ondan bir komut değil bir ad öğrendi: Sōō Zabimaru. İki ruh artık sırayla değil aynı anda çıkıyor. Zincirin sonu, başındaki adın açılmış hâli.",
      en: "The broken blade was reforged, and this time Renji learned from it not a command but a name: Sōō Zabimaru. The two spirits no longer take turns — they arrive together. The end of the chain is the opened form of the name at its start.",
    },
    note: {
      tr: "Altıncı eklem zinciri kapatıyor: 蛇尾丸 ile başladı, 双王蛇尾丸 ile bitiyor.",
      en: "The sixth joint closes the chain: it began at 蛇尾丸 and ends at 双王蛇尾丸.",
    },
  },
] as const;

export const RENJI_CHAIN_UI = {
  extend: { tr: "Uzat", en: "Extend" },
  extendDone: { tr: "Zincir tam", en: "Chain complete" },
  retract: { tr: "Topla", en: "Retract" },
  counterLabel: { tr: "Açık eklem", en: "Open joints" },
  emptyLead: {
    tr: "Zincir kapalı. İlk eklemi açmak için Uzat'a bas — her eklem aşağıda yeni bir bölüm açacak ve zikzağın yönünü çevirecek.",
    en: "The chain is closed. Press Extend to open the first joint — each joint opens a new section below and flips the zigzag.",
  },
  keyboardHint: {
    tr: "Klavye: düğmelere Sekme ile gel, Boşluk ya da Enter ile aç. Açılan bölümler sayfa akışına giriyor, ayrı bir pencere açılmıyor.",
    en: "Keyboard: reach the buttons with Tab, open with Space or Enter. Opened sections enter the page flow; no separate window is opened.",
  },
  statusOpened: {
    tr: "Eklem açıldı, yeni bölüm aşağıda:",
    en: "Joint opened, new section below:",
  },
  statusFull: {
    tr: "Altı eklemin altısı da açık. Zincir tam boyunda.",
    en: "All six joints are open. The chain is at full length.",
  },
  statusRetracted: {
    tr: "Zincir toplandı, sayfa kabzaya döndü.",
    en: "The chain retracted; the page returned to the grip.",
  },
  sideLeft: { tr: "sol eklem", en: "left joint" },
  sideRight: { tr: "sağ eklem", en: "right joint" },
  closingLine: {
    tr: "Altı eklem, tek kılıç. Uzayan şey menzil değil — Renji'nin ne kadarını göze aldığı.",
    en: "Six joints, one blade. What extends is not the reach — it is how much Renji is willing to risk.",
  },
} as const;

/* ══ 6 · KADER ÇİZELGESİ ════════════════════════════════════════════════ */

/**
 * Bir dönem durağı.
 *
 * ⚠️ Açık tip ŞART: dizi heterojen (beş durağın yalnızca ikisinde `quote`
 * var). `as const` ile bırakılsaydı `stop.quote` bir birleşim tipinde
 * okunamayan alan olurdu ve tsc haklı olarak patlardı.
 */
export interface RenjiStop {
  key: string;
  imageKey: string;
  stamp: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  /** Yalnızca BELGELİ orijinal dizi; uydurma diyalog yok */
  quote?: { text: string; reading: LocalizedText; by: LocalizedText };
  kin?: { characterId: number; name: string; role: LocalizedText };
}

export const RENJI_TIMELINE: readonly RenjiStop[] = [
  {
    key: "inuzuri",
    imageKey: RENJI_IMAGE_KEYS.donem1,
    stamp: { tr: "Dönem · Inuzuri", en: "Era · Inuzuri" },
    title: { tr: "Soyadı olmayanlar", en: "Those without a family name" },
    text: {
      tr: "Rukongai'nin dip mahallesinde, ailesiz çocuklardan kurulu bir avuç dolusu grupta büyüdü. Rukia da oradaydı. O günlerin tek kuralı basitti: birlikte kal, yoksa kaybol.",
      en: "He grew up in the outermost slum of the Rukongai, in a handful of children with no families. Rukia was there too. The only rule of those days was simple: stay together, or be lost.",
    },
    kin: {
      characterId: 6,
      name: "Rukia Kuchiki",
      role: { tr: "aynı sokaktan", en: "from the same street" },
    },
  },
  {
    key: "akademi",
    imageKey: RENJI_IMAGE_KEYS.donem2,
    stamp: { tr: "Dönem · Shin'ō Akademisi", en: "Era · Shin'ō Academy" },
    title: { tr: "Alınan ve alınmayan", en: "The taken and the left" },
    text: {
      tr: "İkisi Akademi'ye birlikte girdi. Sonra Kuchiki hanesi Rukia'yı evlat edindi ve o kapıdan yalnızca biri geçti. Renji'nin bütün hırsı, geride kalınan o kapının önünde başlıyor.",
      en: "The two entered the Academy together. Then the Kuchiki house adopted Rukia, and only one of them walked through that door. All of Renji's ambition begins in front of the door he was left outside.",
    },
    kin: {
      characterId: 907,
      name: "Byakuya Kuchiki",
      role: { tr: "kapının öbür tarafı", en: "the other side of the door" },
    },
  },
  {
    key: "gotei",
    imageKey: RENJI_IMAGE_KEYS.donem3,
    stamp: { tr: "Dönem · Gotei 13", en: "Era · Gotei 13" },
    title: { tr: "On birden altıya", en: "From the Eleventh to the Sixth" },
    text: {
      tr: "Önce 11. Bölük'ün kaba mektebinde dövüştü, sonra 6. Bölük'ün vekili oldu. İki okul da üzerinde kaldı: sokak öfkesi ile hane disiplini, aynı omuzda.",
      en: "First he fought in the rough school of the Eleventh Division, then became lieutenant of the Sixth. Both schools stayed on him: street anger and household discipline on the same shoulder.",
    },
    kin: {
      characterId: 909,
      name: "Kenpachi Zaraki",
      role: { tr: "ilk mektep", en: "the first school" },
    },
  },
  {
    key: "seireitei",
    imageKey: RENJI_IMAGE_KEYS.donem4,
    stamp: { tr: "Dönem · Seireitei", en: "Era · the Seireitei" },
    title: { tr: "İki yenilgi, bir karar", en: "Two defeats, one decision" },
    text: {
      tr: "İnsan dünyasında Ichigo'nun karşısına ilk çıkan oydu. Seireitei'de aynı çocuğa yenildi, ardından bankai'siyle kaptanının karşısına çıktı ve yine yenildi. Ama Rukia'yı kurtarma işini o iki yenilgiden sonra bırakmadı.",
      en: "In the human world he was the first to stand against Ichigo. In the Seireitei he lost to that same boy, then faced his captain with his bankai and lost again. Yet he did not let go of saving Rukia after those two defeats.",
    },
    quote: {
      text: "咆えろ、蛇尾丸",
      reading: {
        tr: "Hoero, Zabimaru — Kükre, Zabimaru. (Shikai komutu)",
        en: "Hoero, Zabimaru — Howl, Zabimaru. (Shikai command)",
      },
      by: { tr: "Serbest bırakma komutu", en: "Release command" },
    },
    kin: {
      characterId: 5,
      name: "Ichigo Kurosaki",
      role: { tr: "iki kez karşısında", en: "twice across from him" },
    },
  },
  {
    key: "tybw",
    imageKey: RENJI_IMAGE_KEYS.donem5,
    stamp: {
      tr: "Dönem · Bin Yıllık Kan Savaşı",
      en: "Era · Thousand-Year Blood War",
    },
    title: { tr: "Kırılan ve adlandırılan", en: "Broken, then named" },
    text: {
      tr: "Zabimaru kırıldı. Renji kılıcını yeniden dövdürdü ve bu kez ondan bir komut değil bir ad öğrendi. Kırılma bir son değil, zincirin beşinci eklemiydi.",
      en: "Zabimaru broke. Renji had his blade reforged, and this time learned from it a name rather than a command. The break was not an ending but the chain's fifth joint.",
    },
    quote: {
      text: "卍解、狒狒王蛇尾丸",
      reading: {
        tr: "Bankai, Hihiō Zabimaru — Babun Kralı Zabimaru.",
        en: "Bankai, Hihiō Zabimaru — Baboon King Zabimaru.",
      },
      by: { tr: "Bankai çağrısı", en: "Bankai call" },
    },
    kin: {
      characterId: 1086,
      name: "Sōsuke Aizen",
      role: { tr: "savaşın gölgesi", en: "the shadow over the war" },
    },
  },
];

/* ══ 7a · BAĞLAR ════════════════════════════════════════════════════════ */

/**
 * ⚠️ Bu liste `EXPERIENCE_COMPANIONS[906]` ile BİREBİR aynı sırada:
 * [6, 907, 5, 1086, 909]. Dalga 1'in dördüncü dersi — sayfa kimi
 * çiziyorsa o numara yoldaş satırında olmak zorunda, yoksa portre
 * arşive girse bile kadraj sonsuza kadar boş kalır (Armin/Levi emsali).
 */
export const RENJI_BONDS = [
  {
    characterId: 6,
    name: "Rukia Kuchiki",
    native: "朽木ルキア",
    role: { tr: "Aynı sokaktan", en: "From the same street" },
    text: {
      tr: "Inuzuri'den beri aynı grupta. Renji'nin bütün ölçüleri onun bir adım gerisinde ya da bir adım önünde durmakla belirleniyor; iki yön de aynı bağa bağlı.",
      en: "In the same group since Inuzuri. Every measure Renji takes is set by standing one step behind her or one step ahead; both directions run through the same bond.",
    },
  },
  {
    characterId: 907,
    name: "Byakuya Kuchiki",
    native: "朽木白哉",
    role: { tr: "Kaptanı ve ölçütü", en: "His captain and his measure" },
    text: {
      tr: "Künyenin kendi cümlesi: Renji, Byakuya'yı aşması gereken hedef olarak görüyor. Akademi'deyken ondan ürktü, sonra vekili oldu ve zamanla rakipten örneğe döndü.",
      en: "The record's own sentence: Renji sees Byakuya as the goal he must surpass. He was chilled by him back at the Academy, later became his lieutenant, and in time the rival turned into a model.",
    },
  },
  {
    characterId: 5,
    name: "Ichigo Kurosaki",
    native: "黒崎一護",
    role: { tr: "Karşısındaki ve yanındaki", en: "Across from him, then beside him" },
    text: {
      tr: "Önce düşman, sonra ortak. Renji'ye \"Red Pineapple\" adını takan da o — künyedeki iki lakaptan biri buradan geliyor.",
      en: "First an enemy, then an ally. He is also the one who tagged Renji \"Red Pineapple\" — one of the two nicknames in the record comes from here.",
    },
  },
  {
    characterId: 1086,
    name: "Sōsuke Aizen",
    native: "藍染惣右介",
    role: { tr: "Herkesin üstündeki gölge", en: "The shadow above everyone" },
    text: {
      tr: "Rukia'nın idam kararının arkasındaki plan onundu. Renji'nin Seireitei'de verdiği bütün kavgalar, sonradan bakıldığında başka birinin kurduğu bir sahnede geçiyordu.",
      en: "The plan behind Rukia's execution order was his. Every fight Renji gave in the Seireitei was, in hindsight, played out on a stage someone else had built.",
    },
  },
  {
    characterId: 909,
    name: "Kenpachi Zaraki",
    native: "更木剣八",
    role: { tr: "İlk bölüğü", en: "His first division" },
    text: {
      tr: "11. Bölük Renji'ye kılıcı öğretmedi, kavgayı öğretti. Aradaki farkı 6. Bölük'e geçtiğinde anladı.",
      en: "The Eleventh Division did not teach Renji the sword; it taught him the fight. He understood the difference only after moving to the Sixth.",
    },
  },
] as const;

export const RENJI_BOND_UI = {
  hasPage: { tr: "arşivde dosyası var", en: "has a file in the archive" },
  noPage: { tr: "henüz dosyası yok", en: "no file yet" },
  portraitAlt: {
    tr: "arşivdeki portre kaydı",
    en: "portrait record in the archive",
  },
  noPortrait: {
    tr: "Portre kaydı yok — ad düz çiziliyor.",
    en: "No portrait record — the name is drawn plain.",
  },
} as const;

/* ══ 7b · NEXUS BAĞLARI ═════════════════════════════════════════════════ */

/**
 * Bleach Evreni sayfasındaki gerçek çapalar (`lib/anime/bleach/anchors.ts`).
 * Adres elle yazılmıyor — `animeHref.bleach()` + çapa (routes.ts kuralı).
 */
export const RENJI_NEXUS = [
  {
    key: "gotei",
    anchor: "gotei",
    title: { tr: "Gotei 13 · 6. Bölük", en: "Gotei 13 · Sixth Division" },
    text: {
      tr: "Renji'nin vekili olduğu bölük ve on üç bölüğün tamamı.",
      en: "The division where Renji serves as lieutenant, and all thirteen.",
    },
  },
  {
    key: "bankai",
    anchor: "bankai",
    title: { tr: "Bankai Salonu", en: "The Bankai Hall" },
    text: {
      tr: "Hihiō Zabimaru'nun durduğu yer: bankai'lerin toplandığı bölüm.",
      en: "Where Hihiō Zabimaru stands: the section that gathers the bankai.",
    },
  },
  {
    key: "zanpakuto",
    anchor: "zanpakuto",
    title: { tr: "Zanpakutō Arşivi", en: "The Zanpakutō Archive" },
    text: {
      tr: "Kılıcın kendisi bir ruh: Zabimaru'nun ait olduğu sınıflandırma.",
      en: "The blade is itself a spirit: the classification Zabimaru belongs to.",
    },
  },
  {
    key: "houses",
    anchor: "houses",
    title: { tr: "Soylu Haneler", en: "The Noble Houses" },
    text: {
      tr: "Kuchiki hanesi — Rukia'yı alan, Byakuya'yı yetiştiren kapı.",
      en: "The Kuchiki house — the door that took Rukia in and raised Byakuya.",
    },
  },
] as const;

/* ══ 7c · KAPANIŞ ═══════════════════════════════════════════════════════ */

export const RENJI_CLOSING = {
  quotes: [
    {
      text: "咆えろ、蛇尾丸",
      reading: { tr: "Hoero, Zabimaru", en: "Hoero, Zabimaru" },
      note: {
        tr: "Shikai komutu. 咆える kükremek demek — Renji kılıcına susmasını değil, ses çıkarmasını söylüyor.",
        en: "The shikai command. 咆える means to howl — Renji does not tell his blade to be quiet, but to make noise.",
      },
      by: { tr: "Serbest bırakma komutu", en: "Release command" },
    },
    {
      text: "卍解、狒狒王蛇尾丸",
      reading: { tr: "Bankai, Hihiō Zabimaru", en: "Bankai, Hihiō Zabimaru" },
      note: {
        tr: "Bankai çağrısı. 狒狒 babun, 王 kral: eklemli ağız burada kemikten bir gövdeye kavuşuyor.",
        en: "The bankai call. 狒狒 baboon, 王 king: here the jointed edge gains a body of bone.",
      },
      by: { tr: "Bankai çağrısı", en: "Bankai call" },
    },
  ],
  motto: "蛇尾丸",
  mottoNote: {
    tr: "Üç işaret: 蛇 yılan, 尾 kuyruk, 丸 kılıç adlarına eklenen sonek. Ad zaten eklemli — sayfa da öyle.",
    en: "Three signs: 蛇 snake, 尾 tail, 丸 the suffix given to blade names. The name is already jointed — so is this page.",
  },
  credit: {
    tr: "Künye, portre ve diğer adlar AniList'ten alındı; çekimin kopyası depoda (kaynak.json). Karakter kaydı:",
    en: "Record, portrait and alternative names come from AniList; a copy of the capture is stored in-repo (kaynak.json). Character record:",
  },
  creditLink: { tr: "AniList #906 · Renji Abarai", en: "AniList #906 · Renji Abarai" },
  creditNote: {
    tr: "Sahne görseli üretilmedi. Sayfadaki bütün kadrajlar boş küratör yuvası; motifler (dövme deseni, omurga, eklem çizgileri) elle çizilmiş SVG. Dışarıdan raster indirilmedi, hotlink yok.",
    en: "No scene imagery was generated. Every frame on this page is an empty curator slot; the motifs (tattoo pattern, spine, joint lines) are hand-drawn SVG. No raster was downloaded from outside and there is no hotlinking.",
  },
} as const;

/* ══ KÜRATÖR ÖZETİ ══════════════════════════════════════════════════════ */

export const RENJI_GAPS = {
  title: { tr: "Boş eklemler", en: "Empty joints" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Yirmi kadrajın hepsi dolu — zincirde boş eklem kalmadı.",
    en: "All twenty frames are filled — no empty joint remains in the chain.",
  },
} as const;
