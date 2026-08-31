import type { LocalizedText } from "./types";

/**
 * Maki Zen'in (禪院真希) — "SİLAH RAFI" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Bileşen buradan okuyup `pick(text, locale)` ile seçiyor; istemci adalarına
 * yalnızca düz dize iniyor.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * ENVANTER. Maki'nin sayfasında büyü yok, alet var. Sayfanın tamamı eşit
 * hücreli bir silah rafı: künye rafın bir gözü, güç kartları rafın bir gözü,
 * mekanik de rafın kendisi. Süs yok, işlev var.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum (20 Ocak, yıl YOK), yaş (16), boy (170 cm / 5'7"), kan grubu (kayıt
 * yok → `null`), diğer ad ("Miss Zenin"), rütbe (grade 4), okul (Tokyo
 * Metropolitan Jujutsu Technical High School, ikinci sınıf), klan (Zen'in
 * ana kolu, "Prominent Three Families") ve ikizi (Mai Zen'in) AniList
 * künyesinden birebir alındı — karakter 134167, çekimin kopyası
 * `public/assets/anime/karakterler/maki-zenin/kaynak.json`.
 *
 * ⚠️ ÜÇ ÖLÇÜ SÜTUNU ARŞİVİN KENDİ ÖLÇÜSÜ. Kaynak menzil/ağırlık/hız için
 * SAYI VERMİYOR. Rafın üç sütunu (間合 · 重量 · 速度) bu yüzden arşivin
 * atölye ölçüsü olarak işaretli ve sayfada da öyle yazıyor. Onları kanon
 * gibi sunmak uydurmak olurdu. DÖRDÜNCÜ sütun (呪力) kanon: sıfır.
 *
 * ⚠️ DİYALOG ALINTISI YOK — bilinçli. Maki'nin repliklerinin Türkçe/İngilizce
 * karşılıkları çeviriden çeviriye değişiyor ve elimizde doğrulanmış bir
 * metin yok. Uydurma replik yazmaktansa kapanışta ve çizelgede ESERİN KENDİ
 * TERİMLERİ (kanji + okunuş + anlam) duruyor; `MAKI_QUOTE_NOTE` bunu
 * ziyaretçiye de söylüyor.
 *
 * ── TERMİNOLOJİ (JJK, Dalga 4 sözleşmesi) ────────────────────────────────
 *   呪術 Jujutsu · 呪力 Lanet Enerjisi · 術式 Lanetli Teknik
 *   領域展開 Alan Genişletme · 呪霊 Lanetli Ruh · 呪具 Lanetli Alet
 *   反転術式 Ters Lanet Tekniği · 束縛 Bağlayıcı Söz
 *   天与呪縛 Cennetsel Kısıtlama
 * Naruto ya da Bleach terminolojisi bu dosyaya girmiyor.
 */

export const MAKI_ID = 134167;

/** Kaynak künyesinin adresi — kapanıştaki atıf buraya bağlanıyor. */
export const MAKI_SITE_URL = "https://anilist.co/character/134167";

/**
 * Depodaki resmî portre. 230×345 — KÜÇÜK. Tam kanama bir hero olarak
 * kullanılmıyor; künye madalyonunda duruyor (FAZ 2 §3).
 */
export const MAKI_PORTRAIT = {
  src: "/assets/anime/karakterler/maki-zenin/anilist-portrait.png",
  w: 230,
  h: 345,
} as const;

/**
 * ABILITY yuva anahtarları — hepsi `mki:` önekli.
 *
 * On dört kadraj bugün BOŞ. Sayfa görselsiz de tam çalışıyor: her hücre
 * elle çizilmiş SVG siluetiyle ayakta duruyor, küratör bir kare yüklerse
 * siluetin yerini alıyor.
 */
export const MAKI_IMAGE_KEYS = {
  hero: "mki:hero",
  manifest: "mki:manifest",
  restriction: "mki:restriction",
  tools: "mki:tools",
  energy: "mki:energy",
  rack: "mki:rack",
  toolCloud: "mki:tool-playful-cloud",
  toolBone: "mki:tool-dragon-bone",
  toolNaginata: "mki:tool-naginata",
  toolKatana: "mki:tool-katana",
  toolGlasses: "mki:tool-glasses",
  toolFist: "mki:tool-fist",
  timeline: "mki:timeline",
  closing: "mki:closing",
} as const;

/** Yuva etiketi — küratör bu metni yükleme kutusunda okuyor. */
export const MAKI_SLOT_LABELS: Record<string, LocalizedText> = {
  [MAKI_IMAGE_KEYS.hero]: {
    tr: "Hero — dikey tam boy kare",
    en: "Hero — tall full-length frame",
  },
  [MAKI_IMAGE_KEYS.manifest]: {
    tr: "Künye şeridi — yatay bant",
    en: "Manifest strip — wide band",
  },
  [MAKI_IMAGE_KEYS.restriction]: {
    tr: "Cennetsel Kısıtlama — kart karesi",
    en: "Heavenly Restriction — card frame",
  },
  [MAKI_IMAGE_KEYS.tools]: {
    tr: "Lanetli Alet — kart karesi",
    en: "Cursed Tool — card frame",
  },
  [MAKI_IMAGE_KEYS.energy]: {
    tr: "Lanet Enerjisi — kart karesi",
    en: "Cursed Energy — card frame",
  },
  [MAKI_IMAGE_KEYS.rack]: {
    tr: "Silah rafı — geniş duvar karesi",
    en: "Weapon rack — wide wall frame",
  },
  [MAKI_IMAGE_KEYS.toolCloud]: {
    tr: "遊雲 — alet hücresi",
    en: "遊雲 — tool cell",
  },
  [MAKI_IMAGE_KEYS.toolBone]: {
    tr: "龍骨 — alet hücresi",
    en: "龍骨 — tool cell",
  },
  [MAKI_IMAGE_KEYS.toolNaginata]: {
    tr: "薙刀 — alet hücresi",
    en: "薙刀 — tool cell",
  },
  [MAKI_IMAGE_KEYS.toolKatana]: {
    tr: "刀 — alet hücresi",
    en: "刀 — tool cell",
  },
  [MAKI_IMAGE_KEYS.toolGlasses]: {
    tr: "眼鏡 — alet hücresi",
    en: "眼鏡 — tool cell",
  },
  [MAKI_IMAGE_KEYS.toolFist]: {
    tr: "拳 — alet hücresi",
    en: "拳 — tool cell",
  },
  [MAKI_IMAGE_KEYS.timeline]: {
    tr: "Kader çizelgesi — yatay bant",
    en: "Fate ledger — wide band",
  },
  [MAKI_IMAGE_KEYS.closing]: {
    tr: "Kapanış — yatay bant",
    en: "Closing — wide band",
  },
};

/** Beklenen kare: tip + ölçü + biçim. `CuratorGaps` bu satırı yazıyor. */
export const MAKI_SLOT_SPECS: Record<string, LocalizedText> = {
  [MAKI_IMAGE_KEYS.hero]: {
    tr: "dikey portre · 1200×1600 · webp",
    en: "tall portrait · 1200×1600 · webp",
  },
  [MAKI_IMAGE_KEYS.manifest]: {
    tr: "geniş bant · 1600×600 · webp",
    en: "wide band · 1600×600 · webp",
  },
  [MAKI_IMAGE_KEYS.restriction]: {
    tr: "kare kadraj · 1000×1000 · webp",
    en: "square frame · 1000×1000 · webp",
  },
  [MAKI_IMAGE_KEYS.tools]: {
    tr: "kare kadraj · 1000×1000 · webp",
    en: "square frame · 1000×1000 · webp",
  },
  [MAKI_IMAGE_KEYS.energy]: {
    tr: "kare kadraj · 1000×1000 · webp",
    en: "square frame · 1000×1000 · webp",
  },
  [MAKI_IMAGE_KEYS.rack]: {
    tr: "geniş bant · 1800×700 · webp",
    en: "wide band · 1800×700 · webp",
  },
  [MAKI_IMAGE_KEYS.toolCloud]: {
    tr: "hücre karesi · 640×640 · webp",
    en: "cell square · 640×640 · webp",
  },
  [MAKI_IMAGE_KEYS.toolBone]: {
    tr: "hücre karesi · 640×640 · webp",
    en: "cell square · 640×640 · webp",
  },
  [MAKI_IMAGE_KEYS.toolNaginata]: {
    tr: "hücre karesi · 640×640 · webp",
    en: "cell square · 640×640 · webp",
  },
  [MAKI_IMAGE_KEYS.toolKatana]: {
    tr: "hücre karesi · 640×640 · webp",
    en: "cell square · 640×640 · webp",
  },
  [MAKI_IMAGE_KEYS.toolGlasses]: {
    tr: "hücre karesi · 640×640 · webp",
    en: "cell square · 640×640 · webp",
  },
  [MAKI_IMAGE_KEYS.toolFist]: {
    tr: "hücre karesi · 640×640 · webp",
    en: "cell square · 640×640 · webp",
  },
  [MAKI_IMAGE_KEYS.timeline]: {
    tr: "geniş bant · 1600×600 · webp",
    en: "wide band · 1600×600 · webp",
  },
  [MAKI_IMAGE_KEYS.closing]: {
    tr: "geniş bant · 1600×600 · webp",
    en: "wide band · 1600×600 · webp",
  },
};

/** `CuratorSlot`un `size` propu — yükleyici oranı buradan yazıyor. */
export const MAKI_SLOT_SIZES: Record<string, { w: number; h: number }> = {
  [MAKI_IMAGE_KEYS.hero]: { w: 1200, h: 1600 },
  [MAKI_IMAGE_KEYS.manifest]: { w: 1600, h: 600 },
  [MAKI_IMAGE_KEYS.restriction]: { w: 1000, h: 1000 },
  [MAKI_IMAGE_KEYS.tools]: { w: 1000, h: 1000 },
  [MAKI_IMAGE_KEYS.energy]: { w: 1000, h: 1000 },
  [MAKI_IMAGE_KEYS.rack]: { w: 1800, h: 700 },
  [MAKI_IMAGE_KEYS.toolCloud]: { w: 640, h: 640 },
  [MAKI_IMAGE_KEYS.toolBone]: { w: 640, h: 640 },
  [MAKI_IMAGE_KEYS.toolNaginata]: { w: 640, h: 640 },
  [MAKI_IMAGE_KEYS.toolKatana]: { w: 640, h: 640 },
  [MAKI_IMAGE_KEYS.toolGlasses]: { w: 640, h: 640 },
  [MAKI_IMAGE_KEYS.toolFist]: { w: 640, h: 640 },
  [MAKI_IMAGE_KEYS.timeline]: { w: 1600, h: 600 },
  [MAKI_IMAGE_KEYS.closing]: { w: 1600, h: 600 },
};

/** Kapak portresi yuvasının etiketi. */
export const MAKI_PORTRAIT_SLOT: LocalizedText = {
  tr: "Kapak portresi — dikey, 1200×1600, webp",
  en: "Cover portrait — tall, 1200×1600, webp",
};

/** Boş kadrajın İÇİNDEKİ tek kelime — YALNIZCA küratör görüyor. */
export const MAKI_FRAME_EMPTY: LocalizedText = {
  tr: "BOŞ GÖZ",
  en: "EMPTY SLOT",
};

/** `alt` metinleri — hepsi kaynağı söylüyor (FAZ 2 §3). */
export const MAKI_ALT = {
  portrait: {
    tr: "Maki Zen'in — AniList resmî portresi (karakter 134167)",
    en: "Maki Zenin — official AniList portrait (character 134167)",
  },
  portraitUploaded: {
    tr: "Maki Zen'in — arşiv küratörünün yüklediği portre",
    en: "Maki Zenin — portrait uploaded by the archive curator",
  },
  scenePrefix: {
    tr: "Maki Zen'in — küratörün yüklediği kare:",
    en: "Maki Zenin — frame uploaded by the curator:",
  },
} as const;

export const MAKI_CRUMB = {
  series: { tr: "Jujutsu Kaisen · 呪術廻戦", en: "Jujutsu Kaisen · 呪術廻戦" },
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   1 · HERO
   ══════════════════════════════════════════════════════════════════════════ */

export const MAKI_IDENTITY = {
  /** Raf başlığı — çevrilmez, stencil ailesine basılıyor */
  wordmark: "ARMORY / 武器庫",
  /** Filigranın kanjisi — klanın adı */
  watermarkKanji: "禪院",
  name: "Maki Zenin",
  nativeName: "禪院真希",
  /** Raf numarası gibi duran kimlik — çevrilmez */
  serial: "ANILIST-134167",
  rank: {
    tr: "4. SINIF BÜYÜCÜ · 呪術師四級",
    en: "GRADE 4 SORCERER · 呪術師四級",
  },
  epigraph: {
    tr: "Lanet enerjisi neredeyse sıfır. Geriye kalan her şey: gövde, alet ve karar.",
    en: "Cursed energy: almost none. What is left: body, tool, and decision.",
  },
  lede: {
    tr: "Zen'in klanı ölçüyü lanet enerjisiyle alıyordu ve Maki o ölçüde okunmuyordu. Klan ona değersiz dedi; o da klanı bırakıp Tokyo'ya, büyücü lisesine gitti. Bu sayfa bu yüzden bir teknik föyü değil bir ENVANTER: rafta ne varsa onunla dövüşen birinin dökümü.",
    en: "The Zen'in clan measured worth in cursed energy, and Maki did not register on that scale. The clan called her worthless; she left it for the sorcerer school in Tokyo. That is why this page is not a technique sheet but an INVENTORY: the ledger of someone who fights with whatever is on the rack.",
  },
  heroCaption: {
    tr: "Bu büyük kadraj bilerek boş: raf, doldurulmayı bekleyen bir gözü de gösterir.",
    en: "This large frame is deliberately empty: a rack also shows the slot still waiting to be filled.",
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   2 · MOD DÜĞMESİ — CENNETSEL KISITLAMA (天与呪縛)
   ══════════════════════════════════════════════════════════════════════════ */

export type MakiRestriction = "before" | "after";

export const MAKI_RESTRICTION = {
  title: { tr: "CENNETSEL KISITLAMA", en: "HEAVENLY RESTRICTION" },
  kanji: "天与呪縛",
  reading: { tr: "ten'yo jubaku", en: "ten'yo jubaku" },
  lede: {
    tr: "Kısıtlama bir takas: verilmeyen lanet enerjisinin karşılığında verilen gövde. Maki'de bu takas uzun süre YARIM kaldı — tek yumurta ikizleri jujutsu dünyasında tek kişi sayılıyor ve güçleri birbirini sınırlıyor (AniList künyesi). İkizi Mai'nin ölümünden sonra Maki'nin lanet enerjisi tamamen gitti, kısıtlama TAM oldu ve künye onu Tōji Fushiguro'yla aynı sıraya yazıyor.",
    en: "The restriction is a trade: a body given in place of the cursed energy withheld. In Maki that trade stayed HALF for a long time — in the jujutsu world identical twins count as a single individual and their strength limits one another (AniList profile). After her twin Mai's death Maki lost her cursed energy entirely, the restriction became FULL, and the profile places her on par with Toji Fushiguro.",
  },
  modes: {
    before: {
      mark: "半",
      name: { tr: "YARIM", en: "HALF" },
      label: {
        tr: "Kısıtlama yarım · gözlük takılı",
        en: "Restriction half · glasses on",
      },
      hint: {
        tr: "Gözlük rafta duruyor: onsuz laneti göremiyor. Ölçü sütunları düşük, raf çizgileri ince, palet soluk.",
        en: "The glasses stay on the rack: without them she cannot see the curse. The gauges read low, the rack lines are thin, the palette is muted.",
      },
    },
    after: {
      mark: "全",
      name: { tr: "TAM", en: "FULL" },
      label: {
        tr: "Kısıtlama tam · gözlük rafta değil",
        en: "Restriction full · glasses off the rack",
      },
      hint: {
        tr: "Gözlük hücresi kapatıldı, ölçü sütunları yükseldi, raf çizgileri kalınlaştı, palet keskinleşti. Değişmeyen tek sayı 呪力.",
        en: "The glasses cell is retired, the gauges climbed, the rack lines thickened, the palette sharpened. The only number that does not move is 呪力.",
      },
    },
  },
  /** Düğmenin ne yaptığını YAZIYLA da söyleyen kural satırı */
  rule: {
    tr: "Düğme rafı açıp kapatmıyor — rafın DERECESİNİ çeviriyor. Izgara iki durumda da yerinde.",
    en: "The switch does not open or close the rack — it turns its DEGREE. The grid stands in both states.",
  },
  source: {
    tr: "Kısıtlamanın yarım kalması ve tamamlanması AniList künyesinin kendi açıklamasından; kanji 天与呪縛.",
    en: "The half and completed restriction both come from the AniList profile text; kanji 天与呪縛.",
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   3 · KÜNYE ŞERİDİ — "EQUIPMENT MANIFEST"
   Hepsi kaynak.json'dan. Uydurma satır YOK; olmayan veri "kayıt yok" yazıyor.
   ══════════════════════════════════════════════════════════════════════════ */

export interface MakiManifestRow {
  /** Raf gözü numarası — çevrilmez */
  mark: string;
  /** Satırın kanji işareti — çevrilmez */
  kanji: string;
  label: LocalizedText;
  value: LocalizedText;
}

export const MAKI_MANIFEST: readonly MakiManifestRow[] = [
  {
    mark: "01",
    kanji: "名",
    label: { tr: "AD", en: "NAME" },
    value: { tr: "Maki Zenin · 禪院真希", en: "Maki Zenin · 禪院真希" },
  },
  {
    mark: "02",
    kanji: "別",
    label: { tr: "DİĞER AD", en: "ALIAS" },
    value: { tr: "Miss Zenin", en: "Miss Zenin" },
  },
  {
    mark: "03",
    kanji: "生",
    label: { tr: "DOĞUM", en: "BIRTH" },
    value: {
      tr: "20 Ocak · yıl kayıtlı değil",
      en: "20 January · year not recorded",
    },
  },
  {
    mark: "04",
    kanji: "齢",
    label: { tr: "YAŞ", en: "AGE" },
    value: { tr: "16", en: "16" },
  },
  {
    mark: "05",
    kanji: "丈",
    label: { tr: "BOY", en: "HEIGHT" },
    value: { tr: "170 cm (5'7\")", en: "170 cm (5'7\")" },
  },
  {
    mark: "06",
    kanji: "血",
    label: { tr: "KAN GRUBU", en: "BLOOD TYPE" },
    value: { tr: "kayıt yok", en: "not recorded" },
  },
  {
    mark: "07",
    kanji: "級",
    label: { tr: "RÜTBE", en: "GRADE" },
    value: {
      tr: "4. sınıf büyücü (grade 4)",
      en: "Grade 4 sorcerer",
    },
  },
  {
    mark: "08",
    kanji: "校",
    label: { tr: "OKUL", en: "SCHOOL" },
    value: {
      tr: "Tokyo Metropolitan Jujutsu Technical High School · ikinci sınıf",
      en: "Tokyo Metropolitan Jujutsu Technical High School · second year",
    },
  },
  {
    mark: "09",
    kanji: "家",
    label: { tr: "KLAN", en: "CLAN" },
    value: {
      tr: "Zen'in (禪院) ana kolu · \"Prominent Three Families\"den biri",
      en: "Zen'in (禪院) main branch · one of the \"Prominent Three Families\"",
    },
  },
  {
    mark: "10",
    kanji: "双",
    label: { tr: "İKİZ", en: "TWIN" },
    value: {
      tr: "Mai Zen'in — küçük ikiz kardeşi (arşivde kendi dosyası yok)",
      en: "Mai Zenin — her younger twin sister (no file of her own in the archive)",
    },
  },
  {
    mark: "11",
    kanji: "具",
    label: { tr: "SEMBOLİK OBJE", en: "SIGNATURE OBJECT" },
    value: {
      tr: "Gözlük (眼鏡) ve lanetli alet (呪具) — biri görmek, öteki vurmak için",
      en: "Glasses (眼鏡) and the cursed tool (呪具) — one to see, one to strike",
    },
  },
  {
    mark: "12",
    kanji: "作",
    label: { tr: "YAPIMLAR", en: "APPEARANCES" },
    value: {
      tr: "Jujutsu Kaisen · 2. Sezon · Jujutsu Kaisen 0 · 3. Sezon (Culling Game I) — yardımcı rol",
      en: "Jujutsu Kaisen · Season 2 · Jujutsu Kaisen 0 · Season 3 (Culling Game I) — supporting role",
    },
  },
];

export const MAKI_MANIFEST_UI = {
  title: { tr: "KÜNYE DÖKÜMÜ", en: "EQUIPMENT MANIFEST" },
  kanji: "台帳",
} as const;

export const MAKI_MANIFEST_NOTE: LocalizedText = {
  tr: "On iki satırın on ikisi de AniList künyesinden (karakter 134167). Kan grubu kayıtta boş; boş bırakıldı, doldurulmadı.",
  en: "All twelve rows come from the AniList profile (character 134167). The blood type field is empty in the record; it was left empty, not filled in.",
};

/* ══════════════════════════════════════════════════════════════════════════
   4 · LANET LABORATUVARI — 3 büyük + 4 küçük
   Dört küçük kartın dördü de OLUMSUZ ve bu doğru: Maki'nin lanetli tekniği
   yok, alan genişletmesi yok, ters lanet tekniği yok. Kartlar bunu boş
   bırakmıyor, YAZIYOR.
   ══════════════════════════════════════════════════════════════════════════ */

export interface MakiSystem {
  /** Yuva anahtarı — büyük kartlarda kadraj var */
  key: string;
  mark: string;
  kanji: string;
  /** Romaji okunuş — çevrilmez */
  reading: string;
  title: LocalizedText;
  summary: LocalizedText;
  traits: readonly LocalizedText[];
}

export const MAKI_SYSTEMS: readonly MakiSystem[] = [
  {
    key: MAKI_IMAGE_KEYS.restriction,
    mark: "A",
    kanji: "天与呪縛",
    reading: "ten'yo jubaku",
    title: { tr: "CENNETSEL KISITLAMA", en: "HEAVENLY RESTRICTION" },
    summary: {
      tr: "Doğuştan gelen bir takas: bir yanda alınan, öbür yanda verilen. Maki'de alınan lanet enerjisi, verilen gövde. Bağlayıcı Söz gibi görünür ama değil — söz verilerek kurulmuyor, doğuştan geliyor.",
      en: "A trade you are born into: something taken on one side, something given on the other. In Maki what is taken is cursed energy, what is given is the body. It looks like a Binding Vow but is not — it is not struck by agreement, it comes with birth.",
    },
    traits: [
      {
        tr: "Lanet enerjisi neredeyse sıfır — büyücü ölçeğinin dışında kalıyor",
        en: "Cursed energy almost nil — she falls outside the sorcerer scale",
      },
      {
        tr: "İkiz bağı yüzünden uzun süre yarım kaldı (AniList künyesi)",
        en: "Held at half for a long time by the twin bond (AniList profile)",
      },
      {
        tr: "Tamamlandığında künye onu Tōji Fushiguro'yla aynı sıraya yazıyor",
        en: "Once complete, the profile places her on par with Toji Fushiguro",
      },
    ],
  },
  {
    key: MAKI_IMAGE_KEYS.tools,
    mark: "B",
    kanji: "呪具",
    reading: "jugu",
    title: { tr: "LANETLİ ALET", en: "CURSED TOOL" },
    summary: {
      tr: "Lanetli alet, taşıyanın lanet enerjisine ihtiyaç duymadan iş görebilen silahtır. Maki'nin sayfasının kalbi burada: enerjisi olmayan bir büyücü için alet, tekniğin kendisidir. Zen'in klanının deposu da tam olarak bunun için dolu.",
      en: "A cursed tool is a weapon that can work without drawing on its bearer's cursed energy. This is the heart of Maki's page: for a sorcerer with no energy, the tool IS the technique. The Zen'in clan's vault is stocked for exactly this.",
    },
    traits: [
      {
        tr: "Özel sınıf aletler bile taşıyandan lanet enerjisi istemiyor",
        en: "Even special grade tools ask no cursed energy of the bearer",
      },
      {
        tr: "遊雲 (Playful Cloud) ve 龍骨 (Dragon-Bone) — elindeki iki özel sınıf",
        en: "遊雲 (Playful Cloud) and 龍骨 (Dragon-Bone) — the two special grades in her hands",
      },
      {
        tr: "Aletin ölçüsü değişince dövüşün ölçüsü değişiyor — rafın mekaniği bu",
        en: "Change the tool's measure and the fight's measure changes — that is the rack's mechanic",
      },
    ],
  },
  {
    key: MAKI_IMAGE_KEYS.energy,
    mark: "C",
    kanji: "呪力",
    reading: "juryoku",
    title: { tr: "LANET ENERJİSİ", en: "CURSED ENERGY" },
    summary: {
      tr: "Bu kart bir güç kartı değil, bir YOKLUK kaydı. Jujutsu dünyasının bütün ölçüsü bu sayının üstüne kurulu ve Maki'de o sayı okunmuyor. Sayfadaki dördüncü sütun bu yüzden hangi alet seçilirse seçilsin 0 yazıyor.",
      en: "This is not a power card but a record of ABSENCE. The whole measure of the jujutsu world is built on this number, and in Maki it does not register. That is why the fourth column on this page reads 0 no matter which tool is picked.",
    },
    traits: [
      {
        tr: "Klanın ölçüsü buydu; Maki bu ölçüde değersiz sayıldı",
        en: "This was the clan's yardstick; by it Maki was deemed worthless",
      },
      {
        tr: "Gözlük olmadan lanetli ruhları göremiyordu — yokluğun gündelik bedeli",
        en: "Without glasses she could not see cursed spirits — the daily cost of the absence",
      },
      {
        tr: "Kısıtlama tamamlanınca bu sütun yükselmiyor, sıfırda kalıyor",
        en: "When the restriction completes this column does not rise; it stays at zero",
      },
    ],
  },
];

export interface MakiVoid {
  mark: string;
  kanji: string;
  reading: string;
  title: LocalizedText;
  verdict: LocalizedText;
  note: LocalizedText;
}

/** Dört küçük kart: Maki'nin SAHİP OLMADIKLARI, adlarıyla. */
export const MAKI_VOIDS: readonly MakiVoid[] = [
  {
    mark: "D",
    kanji: "術式",
    reading: "jutsushiki",
    title: { tr: "LANETLİ TEKNİK", en: "CURSED TECHNIQUE" },
    verdict: { tr: "YOK", en: "NONE" },
    note: {
      tr: "Lanetli teknik lanet enerjisiyle çalışıyor. Enerji yoksa teknik de yok; künyede kayıtlı bir teknik bulunmuyor.",
      en: "A cursed technique runs on cursed energy. No energy, no technique; the profile records none.",
    },
  },
  {
    mark: "E",
    kanji: "領域展開",
    reading: "ryōiki tenkai",
    title: { tr: "ALAN GENİŞLETME", en: "DOMAIN EXPANSION" },
    verdict: { tr: "YOK", en: "NONE" },
    note: {
      tr: "Alan genişletme bir tekniğin en üst basamağı. Basamağın altı boşsa üstü de boş.",
      en: "A domain expansion is the top step of a technique. If the step below is empty, so is the one above.",
    },
  },
  {
    mark: "F",
    kanji: "反転術式",
    reading: "hanten jutsushiki",
    title: { tr: "TERS LANET TEKNİĞİ", en: "REVERSE CURSED TECHNIQUE" },
    verdict: { tr: "YOK", en: "NONE" },
    note: {
      tr: "İyileştirme de enerji harcıyor. Maki'nin yaraları normal insan hızında kapanıyor — bu sayfadaki en sessiz cezalardan biri.",
      en: "Healing spends energy too. Maki's wounds close at ordinary human speed — one of the quietest penalties on this page.",
    },
  },
  {
    mark: "G",
    kanji: "束縛",
    reading: "sokubaku",
    title: { tr: "BAĞLAYICI SÖZ", en: "BINDING VOW" },
    verdict: { tr: "KARIŞTIRMA", en: "DO NOT CONFLATE" },
    note: {
      tr: "Bağlayıcı Söz kurulur: bir şeyden vazgeçip karşılığını alırsın. Cennetsel Kısıtlama kurulmaz, doğuştan gelir. Maki'nin gövdesi bir pazarlığın değil, bir doğumun sonucu.",
      en: "A Binding Vow is struck: you give something up and take something back. A Heavenly Restriction is not struck; you are born into it. Maki's body is the result of a birth, not a bargain.",
    },
  },
];

export const MAKI_LAB = {
  title: { tr: "LANET LABORATUVARI", en: "CURSE LABORATORY" },
  lede: {
    tr: "Üç sistem ve dört yokluk. Bir büyücünün dosyasında dört boş kutu görmek olağan değil; Maki'nin dosyası tam olarak bu dört boş kutunun etrafında kurulu.",
    en: "Three systems and four absences. Four empty boxes on a sorcerer's file is not ordinary; Maki's file is built precisely around those four.",
  },
  voidsTitle: { tr: "OLMAYANLAR", en: "WHAT IS ABSENT" },
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   5 · İNTERAKTİF — SİLAH RAFI
   ══════════════════════════════════════════════════════════════════════════ */

/** Hücredeki elle çizilmiş siluetin biçimi. */
export type MakiGlyphShape =
  | "staff"
  | "bone"
  | "naginata"
  | "katana"
  | "glasses"
  | "fist";

export interface MakiToolReadings {
  /** cm */
  reach: number;
  /** 0–100 arası atölye endeksi */
  speed: number;
}

export interface MakiTool {
  /** ABILITY yuva anahtarı */
  key: string;
  /** Kararlı kimlik — istemci adasındaki seçim bu dizeyi tutuyor */
  id: string;
  /** Raf gözü numarası — çevrilmez */
  mark: string;
  kanji: string;
  /** Romaji / İngilizce özel ad — çevrilmez */
  reading: string;
  glyph: MakiGlyphShape;
  name: LocalizedText;
  /** Sınıf kanjisi — 特級呪具 / 呪具 / 補助具 / 素手 */
  gradeKanji: string;
  grade: LocalizedText;
  /** kg — moda göre DEĞİŞMİYOR; gerekçesi sayfada yazılı */
  mass: number;
  half: MakiToolReadings;
  full: MakiToolReadings;
  note: LocalizedText;
  /** Kısıtlama tamamlanınca raftan kalkan hücre (yalnızca gözlük) */
  retired?: boolean;
}

export const MAKI_TOOLS: readonly MakiTool[] = [
  {
    key: MAKI_IMAGE_KEYS.toolCloud,
    id: "playful-cloud",
    mark: "01",
    kanji: "遊雲",
    reading: "Playful Cloud",
    glyph: "staff",
    name: { tr: "ÜÇ BÖLMELİ ASA", en: "THREE-SECTION STAFF" },
    gradeKanji: "特級呪具",
    grade: { tr: "özel sınıf lanetli alet", en: "special grade cursed tool" },
    mass: 6.4,
    half: { reach: 205, speed: 62 },
    full: { reach: 232, speed: 94 },
    note: {
      tr: "Üç bölmeli asa: zincirle bağlı üç gövde, her darbede menzili kendisi uzatıyor. Maki'nin elindeki iki özel sınıf aletten biri.",
      en: "A three-section staff: three linked segments that extend their own reach with every swing. One of the two special grade tools in Maki's hands.",
    },
  },
  {
    key: MAKI_IMAGE_KEYS.toolBone,
    id: "dragon-bone",
    mark: "02",
    kanji: "龍骨",
    reading: "Dragon-Bone",
    glyph: "bone",
    name: { tr: "AĞIR OMURGA", en: "HEAVY SPINE" },
    gradeKanji: "特級呪具",
    grade: { tr: "özel sınıf lanetli alet", en: "special grade cursed tool" },
    mass: 8.9,
    half: { reach: 158, speed: 48 },
    full: { reach: 174, speed: 86 },
    note: {
      tr: "Rafın en ağır gözü. Ağırlık burada bir kusur değil bir tercih: gövde yeterse ağırlık isabetin yerine geçiyor.",
      en: "The heaviest slot on the rack. Weight here is a choice, not a flaw: when the body can carry it, mass stands in for precision.",
    },
  },
  {
    key: MAKI_IMAGE_KEYS.toolNaginata,
    id: "naginata",
    mark: "03",
    kanji: "薙刀",
    reading: "naginata",
    glyph: "naginata",
    name: { tr: "UZUN SAPLI KILIÇ", en: "POLEARM" },
    gradeKanji: "呪具",
    grade: { tr: "lanetli alet", en: "cursed tool" },
    mass: 3.1,
    half: { reach: 236, speed: 71 },
    full: { reach: 251, speed: 97 },
    note: {
      tr: "Maki'nin silueti bu: uzun sap, tek ağız, mesafeyi kendi belirleyen bir duruş. Rafın en uzun menzili burada.",
      en: "This is Maki's silhouette: long shaft, single edge, a stance that sets its own distance. The longest reach on the rack.",
    },
  },
  {
    key: MAKI_IMAGE_KEYS.toolKatana,
    id: "katana",
    mark: "04",
    kanji: "刀",
    reading: "katana",
    glyph: "katana",
    name: { tr: "KILIÇ", en: "SWORD" },
    gradeKanji: "呪具",
    grade: { tr: "lanetli alet", en: "cursed tool" },
    mass: 1.1,
    half: { reach: 102, speed: 80 },
    full: { reach: 111, speed: 99 },
    note: {
      tr: "Kısa menzil, en yüksek hız. Rafın en sade gözü ve en çok kullanılanı: ders vermek için de bunu seçiyor.",
      en: "Short reach, highest speed. The plainest slot on the rack and the most used one: it is also what she picks when she is teaching.",
    },
  },
  {
    key: MAKI_IMAGE_KEYS.toolGlasses,
    id: "glasses",
    mark: "05",
    kanji: "眼鏡",
    reading: "megane",
    glyph: "glasses",
    name: { tr: "GÖZLÜK", en: "GLASSES" },
    gradeKanji: "補助具",
    grade: { tr: "yardımcı alet — silah değil", en: "aid — not a weapon" },
    mass: 0.03,
    half: { reach: 0, speed: 0 },
    full: { reach: 0, speed: 0 },
    retired: true,
    note: {
      tr: "Rafın tek silah olmayan gözü. Üç ölçü sütunu da sıfır okuyor — ve dördüncüsü zaten sıfırdı. Kısıtlama tamamlandığında bu hücre kapanıyor: artık laneti çıplak gözle görüyor.",
      en: "The one slot on the rack that is not a weapon. All three gauges read zero — and the fourth already did. When the restriction completes this cell is retired: she now sees the curse with her own eyes.",
    },
  },
  {
    key: MAKI_IMAGE_KEYS.toolFist,
    id: "fist",
    mark: "06",
    kanji: "拳",
    reading: "kobushi",
    glyph: "fist",
    name: { tr: "ÇIPLAK EL", en: "BARE HAND" },
    gradeKanji: "素手",
    grade: { tr: "aletsiz", en: "no tool" },
    mass: 0,
    half: { reach: 68, speed: 74 },
    full: { reach: 74, speed: 100 },
    note: {
      tr: "Ağırlık sütunu sıfır çünkü taşınacak bir şey yok. Rafın son gözü, elinden her şey alındığında geriye kalan: gövdenin kendisi.",
      en: "The weight column is zero because there is nothing to carry. The last slot on the rack, what remains when everything is taken away: the body itself.",
    },
  },
];

export interface MakiGauge {
  id: "reach" | "mass" | "speed" | "energy";
  kanji: string;
  label: LocalizedText;
  /** Birim — çevrilmez */
  unit: string;
  /** Çubuğun tam dolduğu değer */
  max: number;
}

export const MAKI_GAUGES: readonly MakiGauge[] = [
  {
    id: "reach",
    kanji: "間合",
    label: { tr: "MENZİL", en: "REACH" },
    unit: "cm",
    max: 260,
  },
  {
    id: "mass",
    kanji: "重量",
    label: { tr: "AĞIRLIK", en: "WEIGHT" },
    unit: "kg",
    max: 10,
  },
  {
    id: "speed",
    kanji: "速度",
    label: { tr: "HIZ", en: "SPEED" },
    unit: "/100",
    max: 100,
  },
  {
    id: "energy",
    kanji: "呪力",
    label: { tr: "LANET ENERJİSİ", en: "CURSED ENERGY" },
    unit: "/100",
    max: 100,
  },
];

/** Silah rafı adasının BÜTÜN yüzey metni — istemciye düz dize iniyor. */
export const MAKI_RACK_UI = {
  title: { tr: "SİLAH RAFI", en: "THE WEAPON RACK" },
  kanji: "武器庫",
  lede: {
    tr: "Altı göz, altı alet. Bir gözü seç: künye şeridi o alete göre yeniden hesaplanıyor — menzil, ağırlık ve hız gerçekten değişiyor. Dördüncü sütun değişmiyor.",
    en: "Six slots, six tools. Pick one: the gauge strip recomputes for that tool — reach, weight and speed genuinely change. The fourth column does not.",
  },
  rackLabel: { tr: "Envanter ızgarası", en: "Inventory grid" },
  rackHint: {
    tr: "Ok tuşlarıyla gözler arasında gez, Enter ya da boşlukla seç.",
    en: "Move between slots with the arrow keys, select with Enter or Space.",
  },
  stripTitle: { tr: "ÖLÇÜ ŞERİDİ", en: "GAUGE STRIP" },
  idleName: { tr: "RAF TOPLAMI", en: "RACK TOTAL" },
  idleNote: {
    tr: "Hiçbir göz seçili değil: şerit şu an rafın toplamını okuyor — en uzun menzil, taşınan toplam ağırlık, en yüksek hız. Dördüncü sütun toplamda da sıfır.",
    en: "No slot is selected: the strip currently reads the rack as a whole — longest reach, total weight carried, top speed. The fourth column is zero in the total as well.",
  },
  selectedLabel: { tr: "SEÇİLİ", en: "SELECTED" },
  retiredLabel: { tr: "RAFTAN KALDIRILDI", en: "RETIRED" },
  zeroNote: {
    tr: "呪力 sütunu her seçimde 0. Bu bir hata değil, künyenin kendisi.",
    en: "The 呪力 column reads 0 on every selection. That is not a bug; it is the profile itself.",
  },
  massNote: {
    tr: "Ağırlık kısıtlamayla değişmiyor — aletin kütlesi aynı kalıyor, değişen taşıyan.",
    en: "Weight does not move with the restriction — the tool's mass is unchanged; what changes is who carries it.",
  },
  measureNote: {
    tr: "⚠ Menzil, ağırlık ve hız ARŞİVİN ATÖLYE ÖLÇÜSÜ: kaynak bu üç şey için sayı vermiyor, sayılar aletin biçiminden türetildi. Kanon olan tek sütun 呪力 ve o da sıfır.",
    en: "⚠ Reach, weight and speed are THE ARCHIVE'S WORKSHOP MEASURE: the source gives no figures for these three, so they were derived from the shape of each tool. The only canonical column is 呪力, and it is zero.",
  },
  statusPrefix: { tr: "Seçildi:", en: "Selected:" },
  statusCleared: { tr: "Seçim kaldırıldı.", en: "Selection cleared." },
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   6 · KADER ÇİZELGESİ — beş adım
   ⚠️ Yaşlar: AniList yalnızca "16" veriyor. Ara basamaklar serinin kendi
   takviminden çıkarıldı ve etiketlerinde `≈` işaretiyle duruyor. Kesin gibi
   yazmak uydurmak olurdu (Uryū emsali).
   ══════════════════════════════════════════════════════════════════════════ */

export interface MakiStep {
  mark: string;
  /** Yaş etiketi — `≈` işaretli olanlar türetilmiş */
  age: LocalizedText;
  kanji: string;
  /** Kanjinin okunuşu — çevrilmez */
  reading: string;
  title: LocalizedText;
  text: LocalizedText;
  /** O adımda eserin KENDİ terimi ve ne anlama geldiği */
  term: LocalizedText;
}

export const MAKI_TIMELINE: readonly MakiStep[] = [
  {
    mark: "01",
    age: { tr: "doğum", en: "birth" },
    kanji: "禪院",
    reading: "Zen'in",
    title: { tr: "ANA KOLDA DOĞMAK", en: "BORN TO THE MAIN BRANCH" },
    text: {
      tr: "Zen'in klanının ana kolunda, Üç Büyük Aile'nin birinde doğdu. İkizi Mai'yle birlikte: tek yumurta ikizleri jujutsu dünyasında tek kişi sayılıyor ve bu bir uğursuzluk işareti.",
      en: "Born into the main branch of the Zen'in clan, one of the three prominent families. Together with her twin Mai: in the jujutsu world identical twins count as a single individual, and that counts as an ill omen.",
    },
    term: {
      tr: "禪院 · Zen'in — klanın adı; sayfanın filigranında üstü çizili duran şey.",
      en: "禪院 · Zen'in — the clan name; the thing struck through in this page's watermark.",
    },
  },
  {
    mark: "02",
    age: { tr: "≈ çocukluk", en: "≈ childhood" },
    kanji: "呪力",
    reading: "juryoku",
    title: { tr: "ÖLÇÜYE GİRMEMEK", en: "OFF THE SCALE" },
    text: {
      tr: "Klanın tek ölçüsü lanet enerjisiydi ve Maki o ölçüde okunmadı. Kararı klan verdi: büyücü olamaz. Laneti görebilmek için gözlük takması gerekiyordu; ölçünün dışında kalmanın gündelik hâli buydu.",
      en: "The clan's only yardstick was cursed energy, and Maki did not register on it. The clan ruled: she cannot be a sorcerer. She needed glasses to see curses at all; that was the daily shape of being off the scale.",
    },
    term: {
      tr: "呪力 · juryoku — lanet enerjisi; bu sayfada hiç yükselmeyen sütun.",
      en: "呪力 · juryoku — cursed energy; the column on this page that never rises.",
    },
  },
  {
    mark: "03",
    age: { tr: "≈ 15", en: "≈ 15" },
    kanji: "呪術高専",
    reading: "jujutsu kōsen",
    title: { tr: "EVİ BIRAKMAK", en: "LEAVING THE HOUSE" },
    text: {
      tr: "Klanın hükmünü kabul etmedi ve büyücü olabileceğini kanıtlamak için Zen'in ailesinden ayrıldı. Tokyo Metropolitan Jujutsu Technical High School: klanın ölçüsünün geçmediği ilk yer.",
      en: "She refused the clan's ruling and left the Zen'in family to prove she could be a sorcerer. Tokyo Metropolitan Jujutsu Technical High School: the first place where the clan's yardstick did not apply.",
    },
    term: {
      tr: "呪術高専 · jujutsu kōsen — büyücü lisesi; künyede kayıtlı okulu.",
      en: "呪術高専 · jujutsu kōsen — the jujutsu school; the school on her profile.",
    },
  },
  {
    mark: "04",
    age: { tr: "16", en: "16" },
    kanji: "呪具",
    reading: "jugu",
    title: { tr: "RAFI KURMAK", en: "BUILDING THE RACK" },
    text: {
      tr: "İkinci sınıf, 4. sınıf büyücü. Enerjisi olmayan bir büyücünün tek gerçek kütüphanesi lanetli alet deposu: alet taşıyandan enerji istemiyor. Maki'nin dosyası buradan itibaren bir teknik listesi değil, bir envanter.",
      en: "Second year, grade 4 sorcerer. For a sorcerer without energy the only real library is the cursed tool vault: a tool asks nothing of its bearer. From here on Maki's file is not a technique list but an inventory.",
    },
    term: {
      tr: "呪具 · jugu — lanetli alet; bu sayfanın altı gözünü dolduran şey.",
      en: "呪具 · jugu — cursed tool; what fills the six slots of this page.",
    },
  },
  {
    mark: "05",
    age: { tr: "16 sonrası", en: "after 16" },
    kanji: "天与呪縛",
    reading: "ten'yo jubaku",
    title: { tr: "TAKASIN TAMAMLANMASI", en: "THE TRADE COMPLETED" },
    text: {
      tr: "İkizi Mai'nin ölümünden sonra Maki'nin lanet enerjisi tamamen gitti ve Cennetsel Kısıtlaması tamamlandı; künye onun beceri ve insan kapasitesini Tōji Fushiguro'yla aynı sıraya yazıyor. Gözlük artık rafta değil.",
      en: "After her twin Mai's death Maki's cursed energy went entirely and her Heavenly Restriction completed; the profile places her skills and human capabilities on par with Toji Fushiguro's. The glasses are no longer on the rack.",
    },
    term: {
      tr: "天与呪縛 · ten'yo jubaku — cennetsel kısıtlama; bu sayfanın düğmesi.",
      en: "天与呪縛 · ten'yo jubaku — heavenly restriction; the switch on this page.",
    },
  },
];

export const MAKI_TIMELINE_UI = {
  title: { tr: "KADER ÇİZELGESİ", en: "FATE LEDGER" },
  lede: {
    tr: "Beş adım, yaş etiketli. `≈` işaretli yaşlar türetilmiş: AniList yalnızca 16'yı veriyor, ara basamaklar serinin kendi takviminden çıkarıldı ve kesin gibi yazılmadı.",
    en: "Five steps, each labelled with an age. Ages marked `≈` are derived: AniList gives only 16, the intermediate steps come from the series' own calendar and are not presented as exact.",
  },
  termLabel: { tr: "ESERİN KENDİ TERİMİ", en: "THE WORK'S OWN TERM" },
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   7 · BAĞLAR + KAPANIŞ
   ⚠️ `EXPERIENCE_COMPANIONS[134167]` merkezde şu beş kimlikle yazıldı:
   162722 · 129571 · 137974 · 127691 · 133704. Bu bölüm TAM olarak o beşini
   çiziyor — listede olmayan biri çizilseydi kadrajı sonsuza kadar boş
   kalırdı (Dalga 1'de Armin↔Levi emsali). Mai Zen'in'in arşivde numarası
   YOK: düz ad olarak, bağlantısız yazılıyor.
   ══════════════════════════════════════════════════════════════════════════ */

export interface MakiBond {
  name: string;
  /** Arşivde dosyası varsa AniList numarası; yoksa alan hiç yazılmıyor */
  characterId?: number;
  kanji: string;
  role: LocalizedText;
  summary: LocalizedText;
}

export const MAKI_BONDS: readonly MakiBond[] = [
  {
    name: "Touji Fushiguro",
    characterId: 162722,
    kanji: "伏黒甚爾",
    role: { tr: "Aynı klan, aynı yokluk", en: "Same clan, same absence" },
    summary: {
      tr: "Zen'in klanında lanet enerjisi olmadan doğan öteki kişi. Klan onu da ölçüsünün dışında bıraktı. AniList künyesi Maki'nin tamamlanmış hâlini doğrudan onunla eşliyor: beceriler ve insan kapasitesi aynı sırada.",
      en: "The other person born into the Zen'in clan without cursed energy. The clan left him off its scale too. The AniList profile matches Maki's completed state directly to his: skills and human capabilities on par.",
    },
  },
  {
    name: "Yuuta Okkotsu",
    characterId: 129571,
    kanji: "乙骨憂太",
    role: { tr: "Aynı yılın öğrencisi", en: "Same year at school" },
    summary: {
      tr: "Tokyo Jujutsu Lisesi'nde aynı sınıf. Yūta'nın elinde muazzam bir lanet enerjisi var, Maki'nin elinde alet — okul ikisini de aynı sıraya oturttu ve ölçüyü klanlardan geri aldı.",
      en: "The same class at Tokyo Jujutsu High. Yuuta carries an enormous amount of cursed energy, Maki carries tools — the school seated them side by side and took the yardstick back from the clans.",
    },
  },
  {
    name: "Panda",
    characterId: 137974,
    kanji: "パンダ",
    role: { tr: "Sınıf arkadaşı", en: "Classmate" },
    summary: {
      tr: "İkinci sınıfın üçüncü üyesi. Panda insan değil, Maki ölçüye girmiyor: aynı sınıfın iki öğrencisi de jujutsu dünyasının standart kutularına sığmıyor ve okul ikisini de kaydediyor.",
      en: "The third member of the second year. Panda is not human, Maki does not register on the scale: two students of the same class who fit none of the jujutsu world's standard boxes, and the school enrols them both.",
    },
  },
  {
    name: "Satoru Gojou",
    characterId: 127691,
    kanji: "五条悟",
    role: { tr: "Okulun öğretmeni", en: "The school's teacher" },
    summary: {
      tr: "Klan düzeninin karşısındaki en yüksek sesli isim ve Maki'nin okuldaki öğretmeni. Onun ölçüsü doğuştan gelen sayı değil, öğrencinin ne yapabildiği.",
      en: "The loudest voice against the clan order and Maki's teacher at the school. His measure is not the number you were born with but what the student can do.",
    },
  },
  {
    name: "Kento Nanami",
    characterId: 133704,
    kanji: "七海建人",
    role: { tr: "Bıçakla işe giden büyücü", en: "The sorcerer who goes to work with a blade" },
    summary: {
      tr: "Aynı okulun mezunu, 1. sınıf büyücü. Nanami'nin lanetli tekniği var, Maki'nin yok — ama ikisi de sahaya aynı şeyle çıkıyor: elde bir bıçak ve işi bitirme niyeti. Shibuya ikisini de aynı geceye yazdı.",
      en: "A graduate of the same school, a grade 1 sorcerer. Nanami has a cursed technique, Maki has none — yet both walk onto the field with the same thing: a blade in hand and the intent to finish the job. Shibuya wrote them both into the same night.",
    },
  },
];

export const MAKI_BOND_UI = {
  title: { tr: "BAĞLAR", en: "BONDS" },
  lede: {
    tr: "Beş dosya ve bir ad. Adın dosyası yok — arşiv onu bağlamıyor, yalnızca yazıyor.",
    en: "Five files and one name. The name has no file — the archive does not link it, only records it.",
  },
  hasPage: { tr: "arşivde dosyası var", en: "has a file in the archive" },
  noPage: { tr: "arşivde dosyası yok", en: "no file in the archive" },
} as const;

/** Arşivde numarası olmayan tek bağ — düz ad, bağlantı YOK. */
export const MAKI_TWIN = {
  name: "Mai Zenin",
  kanji: "禪院真依",
  role: { tr: "İkizi", en: "Her twin" },
  summary: {
    tr: "Küçük ikiz kardeşi. Tek yumurta ikizleri jujutsu dünyasında tek kişi sayılıyor ve güçleri birbirini ciddi biçimde sınırlıyor (AniList künyesi). Mai'nin ölümünden sonra Maki'nin lanet enerjisi tamamen gitti. Arşivde Mai'nin kendi dosyası yok; bu yüzden burada bağlantısız duruyor.",
    en: "Her younger twin sister. In the jujutsu world identical twins count as a single individual and their strength is considerably limited by one another (AniList profile). After Mai's death Maki lost her cursed energy entirely. Mai has no file of her own in the archive, so her name stands here unlinked.",
  },
} as const;

export interface MakiHallLink {
  anchor: string;
  kanji: string;
  label: LocalizedText;
  note: LocalizedText;
}

/** Çapaların üçü de `lib/anime/jjk/anchors.ts` defterinde kayıtlı. */
export const MAKI_HALL_LINKS: readonly MakiHallLink[] = [
  {
    anchor: "energy",
    kanji: "呪力",
    label: { tr: "Lanet Enerjisi", en: "Cursed Energy" },
    note: {
      tr: "Bu sayfanın sıfır kalan sütununun evrendeki karşılığı.",
      en: "What the column that stays at zero on this page means in the wider world.",
    },
  },
  {
    anchor: "society",
    kanji: "高専",
    label: { tr: "Büyücü Toplumu", en: "Sorcerer Society" },
    note: {
      tr: "Klanlar, okul ve rütbe düzeni — Maki'nin bıraktığı ve girdiği iki yapı.",
      en: "Clans, the school and the grading order — the two structures Maki left and entered.",
    },
  },
  {
    anchor: "shibuya",
    kanji: "渋谷",
    label: { tr: "Shibuya", en: "Shibuya" },
    note: {
      tr: "Kadronun tamamını aynı geceye yazan olay.",
      en: "The event that wrote the whole cast into a single night.",
    },
  },
];

export const MAKI_HALL_UI = {
  title: { tr: "LANETLİ ARŞİV", en: "THE CURSED ARCHIVE" },
  lede: {
    tr: "Evrenin kendi kaydındaki üç durak — terimlerin uzun hâli orada.",
    en: "Three stops in the universe's own record — the long form of these terms lives there.",
  },
} as const;

/**
 * ⚠️ ALINTI POLİTİKASI. Aşağıdaki iki blok DİYALOG ALINTISI DEĞİL: eserin
 * kendi terimleri ve arşivin okuması. Maki'nin repliklerinin doğrulanmış bir
 * Türkçe/İngilizce metni elimizde yok ve uydurma replik yazmak yasak; o
 * yüzden kapanış terimlerle kuruldu. `quoteNote` bunu ziyaretçiye söylüyor.
 */
export const MAKI_QUOTE_NOTE: LocalizedText = {
  tr: "Bu arşiv doğrulayamadığı repliği alıntılamıyor: Maki'nin sözlerinin çeviriden çeviriye değişen karşılıkları var ve elimizde tek bir kesin metin yok. Kapanıştaki iki blok bu yüzden replik değil, eserin kendi terimleri ve arşivin okuması.",
  en: "This archive does not quote dialogue it cannot verify: Maki's lines differ from translation to translation and we hold no single authoritative text. The two blocks below are therefore not quotations but the work's own terms with the archive's reading.",
};

export interface MakiClosingBlock {
  /** Kanji — çevrilmez */
  term: string;
  reading: LocalizedText;
  note: LocalizedText;
  by: LocalizedText;
}

export const MAKI_CLOSING = {
  title: { tr: "KAPANIŞ", en: "CLOSING" },
  lede: {
    tr: "Rafın sonunda iki kelime kalıyor: biri taşıdığı ad, biri eline aldığı şey.",
    en: "Two words are left at the end of the rack: the name she carries and the thing she picks up.",
  },
  blocks: [
    {
      term: "禪院",
      reading: { tr: "Zen'in — klanın adı", en: "Zen'in — the clan name" },
      note: {
        tr: "Taşıdığı ad ama kabul ettiği hüküm değil. Klan onu ölçüsünün dışında bıraktı, o da klanı bıraktı; sayfanın filigranındaki X tam olarak bu.",
        en: "The name she carries, not the verdict she accepts. The clan left her off its scale, so she left the clan; the X across this page's watermark is exactly that.",
      },
      by: { tr: "arşivin okuması", en: "the archive's reading" },
    },
    {
      term: "呪具",
      reading: { tr: "jugu — lanetli alet", en: "jugu — cursed tool" },
      note: {
        tr: "Enerjisi olmayan bir büyücü için alet, tekniğin yerine geçen şey. Maki'nin dosyası bir teknik listesi değil, bir envanter — ve envanter dolu.",
        en: "For a sorcerer without energy, the tool is what stands in for the technique. Maki's file is not a technique list but an inventory — and the inventory is full.",
      },
      by: { tr: "arşivin okuması", en: "the archive's reading" },
    },
  ] as readonly MakiClosingBlock[],
  /** Orijinal dil motto — eserin kendi terimi */
  motto: "天与呪縛",
  mottoReading: {
    tr: "ten'yo jubaku — \"cennetin verdiği bağ\": alınanın karşılığında verilen gövde.",
    en: "ten'yo jubaku — \"the bond heaven gives\": the body granted in return for what is taken.",
  },
  credit: {
    tr: "Künye ve portre AniList'ten alındı — karakter 134167, çekimin kopyası depoda (kaynak.json).",
    en: "Profile and portrait come from AniList — character 134167, a copy of the fetch is kept in the repository (kaynak.json).",
  },
  creditLink: {
    tr: "AniList · Maki Zenin (#134167)",
    en: "AniList · Maki Zenin (#134167)",
  },
  creditNote: {
    tr: "Portre dışında sayfada dış kaynaklı görsel yok: bütün siluetler, klan mührü ve raf çizgileri bu sayfa için elle SVG olarak çizildi. Menzil/ağırlık/hız sütunları arşivin kendi atölye ölçüsü, kanon değil.",
    en: "Apart from the portrait there is no externally sourced image on this page: every silhouette, the clan seal and the rack lines were drawn by hand as SVG for this page. The reach/weight/speed columns are the archive's own workshop measure, not canon.",
  },
} as const;

/* ── Küratör özeti ──────────────────────────────────────────────────────── */

export const MAKI_GAPS = {
  title: { tr: "RAFTA BOŞ KALAN GÖZLER", en: "SLOTS STILL EMPTY" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Rafın on dört gözü de dolu.",
    en: "All fourteen slots on the rack are filled.",
  },
} as const;
