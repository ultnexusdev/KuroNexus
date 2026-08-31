import type { LocalizedText } from "./types";

/**
 * Uryū Ishida — "Nişangâh" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Bileşen buradan okuyup `pick(text, locale)` ile seçiyor; istemci adalarına
 * yalnızca düz dize iniyor.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * QUINCY GEOMETRİSİ VE TERZİLİK — iki hassasiyet: NİŞAN ve DİKİŞ. Sayfa bir
 * hedefleme arayüzü gibi kuruldu: görünür blueprint ızgarası, köşelerde artı
 * işaretleri, hiçbir şey serbest değil. Kalbi de bir nişangâh: beş hedef, bir
 * reticle, ve seçilen hedefin büyütülüp ÖLÇÜLMESİ.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum (6 Kasım), yaş aralığı (15–27), kan grubu (AB), boy (171–177 cm),
 * ırk (İnsan/Quincy), ruh silahı (Heilig Bogen) ve akrabalar (Ryūken, Sōken,
 * Kanae) AniList künyesinden birebir alındı — karakter 564, çekimin kopyası
 * `public/assets/anime/karakterler/uryuu-ishida/kaynak.json`.
 *
 * ⚠️ ARA YAŞLAR TÜRETİLMİŞ. AniList yalnızca "15-27" aralığını veriyor.
 * Kader çizelgesindeki 16 ve 17, serinin kendi takviminden çıkarıldı ve
 * etiketlerinde `≈` işaretiyle duruyor. Kesin gibi yazmak uydurmak olurdu.
 *
 * ── TERMİNOLOJİ: HEPSİ ARŞİVİN KENDİ DOĞRULANMIŞ KAYDINDAN ───────────────
 * Aşağıdaki kanji/romaji çiftlerinin tamamı `lib/anime/bleach/powers.ts` ve
 * `lib/anime/bleach/wandenreich.ts` dosyalarında zaten doğrulanmış hâlde
 * duruyor (23 Ağustos 2026, Fandom wikitext turu):
 *   神聖弓   Heilig Bogen     · 神聖滅矢 Heilig Pfeil
 *   血装     Blut             · 静血装   Blut Vene   · 動血装 Blut Arterie
 *   滅却師完聖体 Vollständig  · 聖文字   Schrift     · 霊子   Reishi
 *   滅却師   Quincy
 * Aynı kayıt Uryū'nun Sternritter harfini de yazıyor: **A — Antithesis**,
 * "veliaht — sonra saf değiştirdi".
 *
 * Bu dosyanın tek başına eklediği iki terim — 飛廉脚 (Hirenkyaku) ve
 * 乱装天傀 (Ransōtengai) — serinin standart Quincy sözlüğünden. Üçüncüsü
 * **Quincy: Letzt Stil** BİLEREK kanjisiz yazıldı: Almanca adı kesin,
 * kanjisinin birebir yazımından emin olunmadı ve emin olunmayan bir işaret
 * yazılmaz.
 *
 * ── ⚠️ REPLİK DİSİPLİNİ — BU SAYFADA TIRNAK İÇİNDE DİYALOG YOK ───────────
 * Kural: "emin olmadığın cümleyi tırnağa alma" (Dalga 1'in beşinci dersi).
 * Uryū'nun repliklerinin birebir Japonca metni bu turda doğrulanamadı, o
 * yüzden HİÇBİRİ tırnağa alınmadı. Kapanıştaki iki blok ve çizelgedeki
 * damgalar, diyalog yerine **doğrulanmış özgün terimleri** taşıyor: kaynağı
 * her birinin altında yazılı. Sayfa bu eksikliği saklamıyor — görünür bir
 * not olarak duruyor (`URYUU_QUOTE_NOTE`), çünkü ölçüyü konu edinen bir
 * sayfanın kendi ölçüsü hakkında yalan söylememesi gerekiyor.
 *
 * ── ⚠️ GOTİK AİLE (UnifrakturMaguntia) ───────────────────────────────────
 * Ailede ş/ğ/İ/ı YOK (`scripts/check-bleach-fonts.mjs` denetliyor). Bu
 * dosyada gotik aileye basılacak her dize `*_GERMAN` / `name` alanlarında
 * ve hepsi Latin-1 sınırları içinde: "Steckbrief", "Vollständig", "Blut",
 * "Heilig Bogen". Türkçe hiçbir metin o aileye geçmiyor.
 */

export const URYUU_ID = 564;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const URYUU_SITE_URL = "https://anilist.co/character/564";

/**
 * Depodaki resmî portre (Faz 2 kararı: hotlink yok, kare repoda).
 *
 * ⚠️ 230×345 — KÜÇÜK. Sayfada yalnızca dar bir künye madalyonunda
 * kullanılıyor; büyük hero karesi küratör yuvası olarak boş bırakıldı.
 * Kendi kaynağımız olduğu için `next/image`de `unoptimized` YOK.
 */
export const URYUU_PORTRAIT = {
  src: "/assets/anime/karakterler/uryuu-ishida/anilist-portrait.jpg",
  w: 230,
  h: 345,
} as const;

/**
 * Sergi görselleri — hepsi characterId 564 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `ury:` önekli (küratör modu şartı).
 */
export const URYUU_IMAGE_KEYS = {
  hero: "ury:hero",
  armBogen: "ury:heilig-bogen",
  armBlut: "ury:blut",
  armVollstandig: "ury:vollstandig",
  kitPfeil: "ury:heilig-pfeil",
  kitHirenkyaku: "ury:hirenkyaku",
  kitRansotengai: "ury:ransotengai",
  kitLetztStil: "ury:letzt-stil",
  reticle: "ury:nishangah",
  fateSouken: "ury:fate-souken",
  fateKarakura: "ury:fate-karakura",
  fateSoulSociety: "ury:fate-soul-society",
  fateRyuuken: "ury:fate-ryuuken",
  fateSchrift: "ury:fate-schrift",
  closing: "ury:closing",
} as const;

/** Küratör yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const URYUU_SLOT_LABELS: Record<string, LocalizedText> = {
  [URYUU_IMAGE_KEYS.hero]: {
    tr: "Hero — dikey portre, yay gergin, soğuk mavi ışık (3:4)",
    en: "Hero — vertical portrait, bow drawn, cold blue light (3:4)",
  },
  [URYUU_IMAGE_KEYS.armBogen]: {
    tr: "Heilig Bogen — havada kurulan yayın yakın çekimi (16:9)",
    en: "Heilig Bogen — close crop of the bow built from thin air (16:9)",
  },
  [URYUU_IMAGE_KEYS.armBlut]: {
    tr: "Blut — deri altında beliren mavi damar deseni (16:9)",
    en: "Blut — the blue vein pattern rising under the skin (16:9)",
  },
  [URYUU_IMAGE_KEYS.armVollstandig]: {
    tr: "Vollstandig — halka ve ışık kanatları, tam tezahür (16:9)",
    en: "Vollstandig — halo and wings of light, full manifestation (16:9)",
  },
  [URYUU_IMAGE_KEYS.kitPfeil]: {
    tr: "Heilig Pfeil — tek okun bırakıldığı an (3:2)",
    en: "Heilig Pfeil — the instant a single arrow is loosed (3:2)",
  },
  [URYUU_IMAGE_KEYS.kitHirenkyaku]: {
    tr: "Hirenkyaku — ayağın altında kurulan reishi zemini (3:2)",
    en: "Hirenkyaku — the reishi footing built underfoot (3:2)",
  },
  [URYUU_IMAGE_KEYS.kitRansotengai]: {
    tr: "Ransotengai — bedeni taşıyan ışık iplikleri (3:2)",
    en: "Ransotengai — the threads of light carrying the body (3:2)",
  },
  [URYUU_IMAGE_KEYS.kitLetztStil]: {
    tr: "Letzt Stil — çevredeki bütün reishi'nin çekildiği an (3:2)",
    en: "Letzt Stil — the moment all ambient reishi is drawn in (3:2)",
  },
  [URYUU_IMAGE_KEYS.reticle]: {
    tr: "Nişangâh — hedefe kilitlenmiş bakış, dar kadraj (16:9)",
    en: "The reticle — a gaze locked on target, tight crop (16:9)",
  },
  [URYUU_IMAGE_KEYS.fateSouken]: {
    tr: "Dede — atölyede iki kişi, iğne ve yay (3:2)",
    en: "The grandfather — two people in a workshop, needle and bow (3:2)",
  },
  [URYUU_IMAGE_KEYS.fateKarakura]: {
    tr: "Karakura — okul çatısı, iki rakip, akşamüstü (3:2)",
    en: "Karakura — a school roof, two rivals, late afternoon (3:2)",
  },
  [URYUU_IMAGE_KEYS.fateSoulSociety]: {
    tr: "Soul Society — kırık bir yay, boşalan eller (3:2)",
    en: "Soul Society — a broken bow, hands emptied (3:2)",
  },
  [URYUU_IMAGE_KEYS.fateRyuuken]: {
    tr: "Baba — hastane koridoru, iki Ishida yan yana (3:2)",
    en: "The father — a hospital corridor, two Ishida side by side (3:2)",
  },
  [URYUU_IMAGE_KEYS.fateSchrift]: {
    tr: "Schrift — beyaz üniforma, göğüste tek harf (3:2)",
    en: "Schrift — white uniform, a single letter at the chest (3:2)",
  },
  [URYUU_IMAGE_KEYS.closing]: {
    tr: "Kapanış — geniş bant, boş bir gökyüzü, tek çizgi (8:3)",
    en: "Closing — wide band, an empty sky, one line (8:3)",
  },
};

/** `CuratorGaps` satırlarındaki teknik künye — tip + ölçü + biçim. */
export const URYUU_SLOT_SPECS: Record<string, LocalizedText> = {
  [URYUU_IMAGE_KEYS.hero]: {
    tr: "dikey kadraj · 1200×1600 · webp",
    en: "vertical frame · 1200×1600 · webp",
  },
  [URYUU_IMAGE_KEYS.armBogen]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [URYUU_IMAGE_KEYS.armBlut]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [URYUU_IMAGE_KEYS.armVollstandig]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [URYUU_IMAGE_KEYS.kitPfeil]: {
    tr: "küçük kadraj · 900×600 · webp",
    en: "small frame · 900×600 · webp",
  },
  [URYUU_IMAGE_KEYS.kitHirenkyaku]: {
    tr: "küçük kadraj · 900×600 · webp",
    en: "small frame · 900×600 · webp",
  },
  [URYUU_IMAGE_KEYS.kitRansotengai]: {
    tr: "küçük kadraj · 900×600 · webp",
    en: "small frame · 900×600 · webp",
  },
  [URYUU_IMAGE_KEYS.kitLetztStil]: {
    tr: "küçük kadraj · 900×600 · webp",
    en: "small frame · 900×600 · webp",
  },
  [URYUU_IMAGE_KEYS.reticle]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [URYUU_IMAGE_KEYS.fateSouken]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [URYUU_IMAGE_KEYS.fateKarakura]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [URYUU_IMAGE_KEYS.fateSoulSociety]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [URYUU_IMAGE_KEYS.fateRyuuken]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [URYUU_IMAGE_KEYS.fateSchrift]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [URYUU_IMAGE_KEYS.closing]: {
    tr: "geniş bant · 1600×600 · webp",
    en: "wide band · 1600×600 · webp",
  },
};

/** `CuratorUpload`un ziyaretçiye değil KÜRATÖRE gösterdiği hedef ölçü. */
export const URYUU_SLOT_SIZES: Record<string, { w: number; h: number }> = {
  [URYUU_IMAGE_KEYS.hero]: { w: 1200, h: 1600 },
  [URYUU_IMAGE_KEYS.armBogen]: { w: 1600, h: 900 },
  [URYUU_IMAGE_KEYS.armBlut]: { w: 1600, h: 900 },
  [URYUU_IMAGE_KEYS.armVollstandig]: { w: 1600, h: 900 },
  [URYUU_IMAGE_KEYS.kitPfeil]: { w: 900, h: 600 },
  [URYUU_IMAGE_KEYS.kitHirenkyaku]: { w: 900, h: 600 },
  [URYUU_IMAGE_KEYS.kitRansotengai]: { w: 900, h: 600 },
  [URYUU_IMAGE_KEYS.kitLetztStil]: { w: 900, h: 600 },
  [URYUU_IMAGE_KEYS.reticle]: { w: 1600, h: 900 },
  [URYUU_IMAGE_KEYS.fateSouken]: { w: 1200, h: 800 },
  [URYUU_IMAGE_KEYS.fateKarakura]: { w: 1200, h: 800 },
  [URYUU_IMAGE_KEYS.fateSoulSociety]: { w: 1200, h: 800 },
  [URYUU_IMAGE_KEYS.fateRyuuken]: { w: 1200, h: 800 },
  [URYUU_IMAGE_KEYS.fateSchrift]: { w: 1200, h: 800 },
  [URYUU_IMAGE_KEYS.closing]: { w: 1600, h: 600 },
};

/** Kapak portresi yuvasının etiketi (ABILITY değil, PORTRAIT). */
export const URYUU_PORTRAIT_SLOT: LocalizedText = {
  tr: "Künye portresi — dikey, tam boy, sade zemin (3:4)",
  en: "Profile portrait — vertical, full figure, plain ground (3:4)",
};

/** Boş kadrajın içindeki tek kelime — YALNIZCA küratöre gösteriliyor. */
export const URYUU_FRAME_EMPTY: LocalizedText = {
  tr: "ölçülmemiş kadraj",
  en: "unmeasured frame",
};

/** Sayfa sonundaki düzenleyicisiz yuva özeti. */
export const URYUU_GAPS = {
  title: { tr: "Boş kadrajlar", en: "Empty frames" } satisfies LocalizedText,
  empty: { tr: "boş", en: "empty" } satisfies LocalizedText,
  filled: { tr: "dolu", en: "filled" } satisfies LocalizedText,
  allFilled: {
    tr: "Bütün kadrajlar ölçüldü — boş yuva kalmadı.",
    en: "Every frame is measured — no empty slot left.",
  } satisfies LocalizedText,
};

/** Breadcrumb'ın ikinci parçası. */
export const URYUU_CRUMB = {
  series: { tr: "BLEACH · Quincy", en: "BLEACH · Quincy" } satisfies LocalizedText,
};

/**
 * Sayfa üstünde okunan kimlik.
 *
 * ⚠️ `name` ASCII: gotik aileye (UnifrakturMaguntia, yalnız `latin` dilimi)
 * basılan tek özel ad bu. AniList kaydı da "Uryuu Ishida" yazıyor. Uzun
 * ünlülü doğru yazım (`nameLong`) MONO ailede, künye satırında duruyor.
 */
export const URYUU_IDENTITY = {
  name: "Uryuu Ishida",
  nameLong: "Uryū Ishida",
  nativeName: "石田雨竜",
  /** Gotik aileye basılan wordmark — Latin-1 sınırları içinde */
  wordmark: "Quincy",
  /** Filigranın yanındaki kanji */
  watermarkKanji: "滅却師",
  schrift: "A — Antithesis",
  epigraph: {
    tr: "Bir Quincy silahını taşımaz; onu yerinde kurar. Sayfanın bütün geometrisi bu cümleden çıkıyor: önce ölçersin, sonra çizersin, sonra bırakırsın.",
    en: "A Quincy does not carry a weapon; they build one on the spot. Every line of geometry on this page comes from that sentence: measure, then draw, then loose.",
  } satisfies LocalizedText,
  lede: {
    tr: "İki hassasiyet aynı elde toplanmış: nişan ve dikiş. Biri hedefi bir milimetreye indiriyor, öteki söküğü bir milimetreye kapatıyor. Bu sayfa o eli bir ölçü aleti gibi çiziyor.",
    en: "Two precisions gathered in one hand: aim and stitch. One narrows a target to the millimetre, the other closes a tear to the millimetre. This page draws that hand as a measuring instrument.",
  } satisfies LocalizedText,
  heroCaption: {
    tr: "Bu büyük kadraj bilerek boş: küratör kendi karesini yükleyene kadar sayfanın ölçüsü eksik kalıyor.",
    en: "This large frame is deliberately empty: until the curator uploads their own plate, the page's measurement stays incomplete.",
  } satisfies LocalizedText,
} as const;

/** Künye şeridi — blueprint bir teknik föy gibi okunuyor. */
export const URYUU_FACTS: readonly { label: LocalizedText; value: LocalizedText }[] = [
  {
    label: { tr: "Ad", en: "Name" },
    value: { tr: "Uryū Ishida · 石田雨竜", en: "Uryū Ishida · 石田雨竜" },
  },
  {
    label: { tr: "Doğum", en: "Born" },
    value: { tr: "6 Kasım", en: "6 November" },
  },
  {
    label: { tr: "Yaş", en: "Age" },
    value: { tr: "15 → 27", en: "15 → 27" },
  },
  {
    label: { tr: "Boy", en: "Height" },
    value: { tr: "171–177 cm", en: "171–177 cm" },
  },
  {
    label: { tr: "Kan grubu", en: "Blood type" },
    value: { tr: "AB", en: "AB" },
  },
  {
    label: { tr: "Irk", en: "Species" },
    value: { tr: "İnsan (Quincy)", en: "Human (Quincy)" },
  },
  {
    label: { tr: "Ruh silahı", en: "Spirit weapon" },
    value: { tr: "Heilig Bogen · 神聖弓", en: "Heilig Bogen · 神聖弓" },
  },
  {
    label: { tr: "Baba", en: "Father" },
    value: { tr: "Ryūken Ishida", en: "Ryūken Ishida" },
  },
  {
    label: { tr: "Dede", en: "Grandfather" },
    value: { tr: "Sōken Ishida (öldü)", en: "Sōken Ishida (deceased)" },
  },
  {
    label: { tr: "Anne", en: "Mother" },
    value: { tr: "Kanae Katagiri (öldü)", en: "Kanae Katagiri (deceased)" },
  },
  {
    label: { tr: "Diğer adlar", en: "Also known as" },
    value: { tr: "Prinz von Licht · Megane-kun", en: "Prinz von Licht · Megane-kun" },
  },
  {
    label: { tr: "Schrift", en: "Schrift" },
    value: { tr: "A — Antithesis · 聖文字", en: "A — Antithesis · 聖文字" },
  },
  {
    label: { tr: "Sembol", en: "Symbol" },
    value: { tr: "Quincy haçı (beş uçlu)", en: "The Quincy cross (five-pointed)" },
  },
  {
    label: { tr: "İkinci alet", en: "Second tool" },
    value: { tr: "Dikiş iğnesi", en: "A sewing needle" },
  },
];

/** Künye şeridinin altındaki tek not. */
export const URYUU_FACT_NOTE: LocalizedText = {
  tr: "Bu föydeki her satır AniList künyesinden birebir alındı. Föyün son satırı oradan gelmiyor: iğne bir istatistik değil, bir alışkanlık — ve bu sayfanın ikinci ekseni.",
  en: "Every line on this sheet comes verbatim from the AniList profile. The last line does not: the needle is not a statistic but a habit — and the second axis of this page.",
};

/** Blut düğmesi — sayfanın tamamını çeviren tek durum. */
export const URYUU_BLUT = {
  title: { tr: "Blut", en: "Blut" } satisfies LocalizedText,
  /** Gotik aileye basılan iki ad — Latin-1 güvenli */
  veneName: "Vene",
  arterieName: "Arterie",
  veneKanji: "静血装",
  arterieKanji: "動血装",
  veneLabel: {
    tr: "Blut Vene — savunma",
    en: "Blut Vene — defence",
  } satisfies LocalizedText,
  arterieLabel: {
    tr: "Blut Arterie — saldırı",
    en: "Blut Arterie — offence",
  } satisfies LocalizedText,
  veneHint: {
    tr: "Savunma açık: ızgara çizgileri kalınlaştı, kutular dört kenardan kapandı, nişangâh halkaları daraldı.",
    en: "Defence is open: the grid lines thickened, the boxes closed on all four sides, the reticle rings narrowed.",
  } satisfies LocalizedText,
  arterieHint: {
    tr: "Saldırı açık: ızgara inceldi, kutuların iki kenarı kalktı, nişangâh halkaları açıldı ve mavi haçlar keskinleşti.",
    en: "Offence is open: the grid thinned, two sides of every box lifted, the reticle rings opened and the blue crosses sharpened.",
  } satisfies LocalizedText,
  rule: {
    tr: "Canon kuralı: ikisi aynı anda açılamaz. Bu yüzden düğme bir aç/kapat değil, bir TARAF SEÇİMİ — sayfa hiçbir zaman ikisini birden gösteremiyor.",
    en: "The canon rule: the two can never be open at once. So this control is not an on/off but a CHOICE OF SIDE — the page can never show both.",
  } satisfies LocalizedText,
  source: {
    tr: "Kaynak: arşivin kendi Quincy kaydı (Bleach Evreni · Güçler).",
    en: "Source: the archive's own Quincy record (Bleach Universe · Powers).",
  } satisfies LocalizedText,
};

/** Bölüm başlıkları ve girişleri. */
export const URYUU_SECTIONS = {
  identity: {
    /** Gotik aileye basılan Almanca işaret — Latin-1 güvenli, aria-hidden */
    mark: "Steckbrief",
    title: { tr: "Teknik föy", en: "Technical sheet" } satisfies LocalizedText,
    lede: {
      tr: "Künye bir tanıtım değil bir ölçü listesi. Satırlar ızgaraya oturuyor, değerler sağa dayanıyor; okunmayan tek şey satır aralarındaki boşluk.",
      en: "A profile is not an introduction here but a list of measurements. Rows sit on the grid, values align right; the only thing left unread is the space between them.",
    } satisfies LocalizedText,
  },
  arsenal: {
    mark: "Waffenkammer",
    title: { tr: "Üç ana sistem", en: "Three core systems" } satisfies LocalizedText,
    lede: {
      tr: "Quincy gücü tek bir yetenek değil, üst üste binen üç sistem: silahı kurmak, kanı kullanmak, biçimi tamamlamak. Üçü de dışarıdan toplanan reishi ile çalışıyor.",
      en: "Quincy power is not one talent but three stacked systems: build the weapon, use the blood, complete the form. All three run on reishi gathered from outside.",
    } satisfies LocalizedText,
  },
  kit: {
    mark: "Werkzeug",
    title: { tr: "Dört alet", en: "Four tools" } satisfies LocalizedText,
    lede: {
      tr: "Ana sistemlerin altındaki dört parça. İkisi mesafeyle, biri hızla, biri bedelle ilgili — ve üçüncüsü bu sayfanın terzilik eksenine en çok yaklaşan tekniği.",
      en: "Four pieces beneath the core systems. Two are about distance, one about speed, one about cost — and the third is the technique that comes closest to this page's tailoring axis.",
    } satisfies LocalizedText,
  },
  reticle: {
    mark: "Zielfernrohr",
    title: { tr: "Nişangâh", en: "The reticle" } satisfies LocalizedText,
    lede: {
      tr: "Sayfanın kalbi. Panoda beş hedef var; birine kilitlendiğinde halkalar dönerek daralıyor, hedef büyütülüyor ve yanda ölçüleri açılıyor. Bir Quincy için nişan almak, vurmadan önce ölçmektir.",
      en: "The heart of the page. Five targets sit on the board; lock onto one and the rings turn inward, the target is magnified and its measurements open alongside. For a Quincy, taking aim means measuring before firing.",
    } satisfies LocalizedText,
  },
  fate: {
    mark: "Chronik",
    title: { tr: "Beş durak", en: "Five stops" } satisfies LocalizedText,
    lede: {
      tr: "Bir yay iki kez kuruldu, bir kez kırıldı, bir kez geri verildi ve bir kez düşmanın elinden alındı. Her durağın altında o durağın özgün terimi duruyor.",
      en: "A bow was built twice, broken once, handed back once, and once taken from the enemy's own hand. Under each stop stands the original term for that stop.",
    } satisfies LocalizedText,
  },
  bonds: {
    mark: "Bindungen",
    title: { tr: "Bağlar", en: "Bonds" } satisfies LocalizedText,
    lede: {
      tr: "Beş kişi. Biri rakip diye başlayıp dost olmuş, ikisi aynı çöle birlikte inmiş, biri kan bağı olduğu hâlde en uzak duran, biri de karşısına çıkan Espada.",
      en: "Five people. One began as a rival and became a friend, two descended into the same desert with him, one is blood and yet stands furthest away, and one is the Espada who stood across from him.",
    } satisfies LocalizedText,
  },
  closing: {
    mark: "Abschied",
    title: { tr: "Kapanış", en: "Closing" } satisfies LocalizedText,
    lede: {
      tr: "İki blok, bir motto ve künyenin kendisi. Tırnak içinde diyalog yok — sebebi aşağıda yazılı.",
      en: "Two blocks, one motto, and the credit itself. There is no dialogue in quotation marks — the reason is written below.",
    } satisfies LocalizedText,
  },
};

/**
 * ÜÇ ANA SİSTEM — 3 büyük kart.
 *
 * `name` gotik aileye basılıyor: üçü de Latin-1 sınırları içinde
 * ("Vollständig"in ä'si Latin-1'de var; ş/ğ/ı YOK ve zaten geçmiyor).
 */
export const URYUU_ARSENAL: readonly {
  key: string;
  name: string;
  kanji: string;
  romaji: string;
  turkish: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: readonly LocalizedText[];
  imageKey: string;
}[] = [
  {
    key: "bogen",
    name: "Heilig Bogen",
    kanji: "神聖弓",
    romaji: "Heilig Bogen",
    turkish: { tr: "Kutsal yay", en: "Holy bow" },
    tagline: {
      tr: "Taşınmaz — kurulur.",
      en: "Not carried — constructed.",
    },
    text: {
      tr: "Havadaki reishi toplanıp elin önünde bir yay hâline getiriliyor. Shinigami gücünü içinden üretiyor, Quincy dışarıdan topluyor: iki ırkın uzlaşamamasının sebebi tam olarak bu fark. Uryū'nun yayı seriye göre biçim değiştiriyor ama ilkesi hiç değişmiyor — silah bir mülk değil, bir hesap.",
      en: "Ambient reishi is gathered and shaped into a bow in front of the hand. A Shinigami produces power from within, a Quincy gathers it from without: that difference is precisely why the two races cannot be reconciled. Uryū's bow changes shape across the series, but its principle never does — the weapon is not a possession, it is a calculation.",
    },
    traits: [
      { tr: "Silah yok, yalnızca ölçü var", en: "No weapon, only measurement" },
      { tr: "Reishi yoğunluğu menzili belirliyor", en: "Reishi density sets the range" },
      { tr: "Biçim değişir, ilke değişmez", en: "Form changes, principle does not" },
    ],
    imageKey: URYUU_IMAGE_KEYS.armBogen,
  },
  {
    key: "blut",
    name: "Blut",
    kanji: "血装",
    romaji: "Blut",
    turkish: { tr: "Kan kuşanması", en: "Blood vestment" },
    tagline: {
      tr: "İki damar, tek anda bir tanesi.",
      en: "Two vessels, one at a time.",
    },
    text: {
      tr: "Reishi'yi kendi damarlarından geçirmek. İki ayrı sistem var: 静血装 Blut Vene savunmayı, 動血装 Blut Arterie saldırıyı açıyor. Kural sert — ikisi aynı anda açılamaz. Bu sayfanın düğmesi de bu yüzden bir aç/kapat değil bir taraf seçimi; her seçim ötekini kapatıyor.",
      en: "Running reishi through one's own blood vessels. There are two separate systems: 静血装 Blut Vene opens defence, 動血装 Blut Arterie opens offence. The rule is hard — both can never be active at once. That is why this page's control is not an on/off but a choice of side; every choice closes the other.",
    },
    traits: [
      { tr: "Vene · savunma · 静血装", en: "Vene · defence · 静血装" },
      { tr: "Arterie · saldırı · 動血装", en: "Arterie · offence · 動血装" },
      { tr: "Aynı anda ikisi asla", en: "Never both at once" },
    ],
    imageKey: URYUU_IMAGE_KEYS.armBlut,
  },
  {
    key: "vollstandig",
    name: "Vollständig",
    kanji: "滅却師完聖体",
    romaji: "Vollständig",
    turkish: { tr: "Tam tezahür", en: "Complete manifestation" },
    tagline: {
      tr: "Ölçünün sonu.",
      en: "The end of the measurement.",
    },
    text: {
      tr: "Quincy'nin son biçimi: başın üstünde bir 光輪 halka, sırtta 光翼 ışık kanatları. Bu artık toplanan reishi'nin bir aleti değil, taşıyıcısının kendisi. Sayfanın geometrisi de burada tamamlanıyor — çizim bitiyor, geriye yalnız biçim kalıyor.",
      en: "A Quincy's final form: a 光輪 halo above the head, 光翼 wings of light at the back. This is no longer a tool made of gathered reishi but the bearer themself. The page's geometry completes here too — the drawing ends and only the form remains.",
    },
    traits: [
      { tr: "光輪 — başın üstünde halka", en: "光輪 — a halo above the head" },
      { tr: "光翼 — sırtta ışık kanatları", en: "光翼 — wings of light at the back" },
      { tr: "Alet değil, taşıyıcının kendisi", en: "Not a tool but the bearer" },
    ],
    imageKey: URYUU_IMAGE_KEYS.armVollstandig,
  },
];

/**
 * DÖRT ALET — küçük kartlar.
 *
 * ⚠️ `name` burada MONO aileye basılıyor, gotik değil: "Ransōtengai"nin ō'su
 * UnifrakturMaguntia'nın `latin` diliminde YOK ve satır yarı-gotik çizilirdi.
 */
export const URYUU_KIT: readonly {
  key: string;
  name: string;
  kanji: string | null;
  turkish: LocalizedText;
  note: LocalizedText;
  imageKey: string;
}[] = [
  {
    key: "pfeil",
    name: "Heilig Pfeil",
    kanji: "神聖滅矢",
    turkish: { tr: "Kutsal ok", en: "Holy arrow" },
    note: {
      tr: "Yayın attığı şey. Yok ettiği Hollow geri dönmüyor — Quincy'nin Soul Society ile kavgası tam da buradan çıkıyor: denge bir ok kadar dar bir yerden bozuluyor.",
      en: "What the bow looses. A Hollow it annihilates never returns — and that is exactly where the Quincy quarrel with Soul Society begins: the balance breaks at a point as narrow as an arrow.",
    },
    imageKey: URYUU_IMAGE_KEYS.kitPfeil,
  },
  {
    key: "hirenkyaku",
    name: "Hirenkyaku",
    kanji: "飛廉脚",
    turkish: { tr: "Uçan perde adımı", en: "Flying screen step" },
    note: {
      tr: "Ayağın altına reishi'den bir zemin kurup onun üstünde kaymak. Shunpo bir sıçrama, bu bir kayış: Quincy mesafeyi aşmıyor, mesafeye zemin döşüyor.",
      en: "Building a floor of reishi underfoot and gliding on it. Shunpo is a leap; this is a slide: a Quincy does not clear a distance, they lay a floor across it.",
    },
    imageKey: URYUU_IMAGE_KEYS.kitHirenkyaku,
  },
  {
    key: "ransotengai",
    name: "Ransōtengai",
    kanji: "乱装天傀",
    turkish: { tr: "Göksel kukla kuşanması", en: "Heavenly wild puppet suit" },
    note: {
      tr: "Bedeni reishi ipleriyle yukarıdan oynatmak; kırık uzuv bile ipin çektiği yere gidiyor. Sayfanın iki ekseni burada tek teknikte birleşiyor — nişan alan el ile dikiş diken el aynı ipi kullanıyor.",
      en: "Working the body from above with threads of reishi; even a broken limb goes where the thread pulls. Here the page's two axes meet in a single technique — the hand that aims and the hand that stitches use the same thread.",
    },
    imageKey: URYUU_IMAGE_KEYS.kitRansotengai,
  },
  {
    key: "letzt-stil",
    name: "Quincy: Letzt Stil",
    kanji: null,
    turkish: { tr: "Son biçim", en: "Final form" },
    note: {
      tr: "Çevredeki bütün reishi'yi tek seferde çekmek. Bedeli baştan biliniyor: kullanan Quincy gücünü kaybediyor. Bu bir yükseltme değil, peşin ödenmiş bir fatura.",
      en: "Drawing in all ambient reishi at once. The price is known in advance: the Quincy who uses it loses their power. This is not an upgrade but an invoice paid up front.",
    },
    imageKey: URYUU_IMAGE_KEYS.kitLetztStil,
  },
];

/**
 * NİŞANGÂH — sayfanın kalbi. Beş hedef.
 *
 * ⚠️ `x`/`y` panonun yüzdesi; ölçü panelindeki üç okuma (mesafe, açı, ok
 * sayısı) ARAYÜZÜN KENDİ NOTASYONU — kanon bir veri değil. Sayfa bunu
 * saklamıyor, `URYUU_RETICLE_UI.readingNote` olarak yazıyor.
 */
export const URYUU_TARGETS: readonly {
  key: string;
  /** Panodaki kısa ad — çevrilmez özel ad / kanji */
  mark: string;
  kanji: string;
  name: LocalizedText;
  /** Ölçü paneli okumaları */
  distance: string;
  angle: string;
  arrows: string;
  verdict: LocalizedText;
  text: LocalizedText;
  /** Arşivde dosyası olan bir karakterse bağ kuruluyor */
  characterId?: number;
  x: number;
  y: number;
}[] = [
  {
    key: "hollow",
    mark: "I",
    kanji: "虚",
    name: { tr: "Hollow", en: "Hollow" },
    distance: "42.0 m",
    angle: "07°",
    arrows: "1",
    verdict: { tr: "meşru hedef", en: "legitimate target" },
    x: 21,
    y: 23,
    text: {
      tr: "Quincy'nin var olma sebebi. Ok isabet ettiğinde Hollow yok oluyor ve yok olan ruh geri dönmüyor — Shinigami ise onu arındırıp döngüye geri veriyor. İki yöntem arasındaki fark ahlaki değil hesabi: bir tarafta denge, öbür tarafta kesinlik. Uryū'nun ilk hedefi de, kavgasının kökeni de burada.",
      en: "The reason the Quincy exist. When the arrow lands the Hollow is annihilated, and an annihilated soul never returns — whereas a Shinigami purifies it and hands it back to the cycle. The difference between the two methods is not moral but arithmetic: balance on one side, certainty on the other. Uryū's first target, and the root of his quarrel, are both here.",
    },
  },
  {
    key: "shinigami",
    mark: "II",
    kanji: "死神",
    name: { tr: "Shinigami", en: "Soul Reaper" },
    distance: "18.5 m",
    angle: "22°",
    arrows: "3",
    verdict: { tr: "miras alınan husumet", en: "an inherited quarrel" },
    x: 75,
    y: 19,
    text: {
      tr: "Soul Society Quincy'lerin çoğunu kılıçtan geçirdi ve gerekçesi intikam değil dengeydi. Uryū bu husumeti kendi seçmedi, devraldı: dedesi Sōken bir Hollow saldırısında öldü ve Shinigami'ler zamanında gelmedi. Sayfanın en gergin hedefi bu — çünkü sonunda yanında savaştığı insanların çoğu bu hedefin içinde.",
      en: "Soul Society put most of the Quincy to the sword, and the justification was not revenge but balance. Uryū did not choose this quarrel, he inherited it: his grandfather Sōken died in a Hollow attack and the Soul Reapers did not arrive in time. This is the page's most strained target — because in the end most of the people he fights beside stand inside it.",
    },
  },
  {
    key: "arrancar",
    mark: "III",
    kanji: "破面",
    name: { tr: "Arrancar", en: "Arrancar" },
    distance: "6.0 m",
    angle: "41°",
    arrows: "5",
    verdict: { tr: "menzil kapandı", en: "the range closed" },
    x: 50,
    y: 51,
    text: {
      tr: "Hueco Mundo'da mesafe işe yaramadı. Okçunun bütün üstünlüğü uzaklıkta ve orada uzaklık yoktu; karşısındaki Espada bir adımda o boşluğu kapattı. Uryū'nun sayfası bir nişangâh olduğu için bu hedef özel: ölçünün geçerliliğini yitirdiği tek durum.",
      en: "In Hueco Mundo distance was of no use. An archer's whole advantage is in range, and there was no range; the Espada across from him closed that gap in a single step. Because Uryū's page is a reticle, this target is the special case: the one condition in which measurement loses its validity.",
    },
    characterId: 1081,
  },
  {
    key: "quincy",
    mark: "IV",
    kanji: "滅却師",
    name: { tr: "Kendi ırkı", en: "His own kind" },
    distance: "0.9 m",
    angle: "88°",
    arrows: "1",
    verdict: { tr: "en zor açı", en: "the hardest angle" },
    x: 23,
    y: 78,
    text: {
      tr: "Wandenreich onu istedi ve aldı: göğsüne 聖文字 kazındı, harfi A oldu. İmparatorun kendi harfini bir kez daha vermesi olay örgüsünün kendisi. Bir okçunun ölçemeyeceği tek şey neredeyse doksan derecelik bir açı — yani kendi safında duran hedef.",
      en: "The Wandenreich wanted him and took him: a 聖文字 was engraved on his chest and his letter was A. That the emperor gave away his own letter a second time is the plot itself. The one thing an archer cannot measure is an angle of nearly ninety degrees — that is, a target standing on his own side.",
    },
  },
  {
    key: "yhwach",
    mark: "V",
    kanji: "見えざる帝国",
    name: { tr: "İmparator", en: "The emperor" },
    distance: "0.0 m",
    angle: "00°",
    arrows: "1",
    verdict: { tr: "tek atış", en: "a single shot" },
    x: 79,
    y: 76,
    text: {
      tr: "Son hedef sıfır mesafede duruyor: Uryū imparatorluğun içine, veliaht sıfatıyla girdi. Harfinin adı Antithesis — seçtiği iki hedef arasında olmuş olanı tersine çeviriyor, yani alınan yara ile onu açan el yer değiştiriyor. Bir nişangâhın verebileceği en tuhaf okuma bu: hedefin kendisi, atışın yönünü belirliyor.",
      en: "The last target stands at zero distance: Uryū walked into the empire as its heir apparent. His letter is named Antithesis — it reverses what has already happened between two chosen targets, so the wound taken and the hand that dealt it trade places. That is the strangest reading a reticle can give: the target itself decides the direction of the shot.",
    },
  },
];

/** Nişangâh adasının bütün etiketleri — istemciye düz dize olarak iniyor. */
export const URYUU_RETICLE_UI = {
  boardLabel: {
    tr: "Hedef panosu — beş hedef",
    en: "Target board — five targets",
  } satisfies LocalizedText,
  boardHint: {
    tr: "Bir hedefe tıkla ya da sekmeyle gel ve Enter'a bas: halkalar ona kilitlenir, hedef büyütülür ve ölçüleri açılır.",
    en: "Click a target, or tab to it and press Enter: the rings lock onto it, the target is magnified and its measurements open.",
  } satisfies LocalizedText,
  idleTitle: {
    tr: "Kilit yok",
    en: "No lock",
  } satisfies LocalizedText,
  idleText: {
    tr: "Nişangâh boşta duruyor. Bir Quincy için bu, henüz hiçbir şeyin ölçülmediği andır.",
    en: "The reticle is idle. For a Quincy this is the moment when nothing has been measured yet.",
  } satisfies LocalizedText,
  panelTitle: {
    tr: "Ölçüm",
    en: "Measurement",
  } satisfies LocalizedText,
  distanceLabel: { tr: "Mesafe", en: "Distance" } satisfies LocalizedText,
  angleLabel: { tr: "Açı", en: "Angle" } satisfies LocalizedText,
  arrowsLabel: { tr: "Ok sayısı", en: "Arrows" } satisfies LocalizedText,
  verdictLabel: { tr: "Kayıt", en: "Verdict" } satisfies LocalizedText,
  lockedLabel: { tr: "kilitlendi", en: "locked" } satisfies LocalizedText,
  releaseLabel: { tr: "Kilidi bırak", en: "Release the lock" } satisfies LocalizedText,
  statusLocked: {
    tr: "Nişangâh kilitlendi:",
    en: "The reticle locked onto:",
  } satisfies LocalizedText,
  statusReleased: {
    tr: "Kilit bırakıldı, nişangâh boşa döndü.",
    en: "The lock was released; the reticle returned to idle.",
  } satisfies LocalizedText,
  linkLabel: {
    tr: "Bu hedefin kendi dosyası var →",
    en: "This target has its own file →",
  } satisfies LocalizedText,
  readingNote: {
    tr: "⚠️ Mesafe, açı ve ok sayısı BU ARAYÜZÜN kendi notasyonu — kanon bir ölçü değil. Hedeflerin altındaki metinler kanon; sayılar sayfanın kendi diliyle konuşuyor.",
    en: "⚠️ Distance, angle and arrow count are THIS INTERFACE's own notation — not canon measurements. The texts beneath the targets are canon; the numbers speak in the page's own language.",
  } satisfies LocalizedText,
};

/**
 * BEŞ DURAK.
 *
 * ⚠️ `stamp` içindeki yaşlar: 15 ve 15→27 aralığı AniList künyesinden;
 * `≈16` ve `≈17` serinin kendi takviminden TÜRETİLDİ ve yaklaşık işaretiyle
 * yazıldı. `term` bir replik değil, o durağın doğrulanmış özgün terimi —
 * gerekçesi dosya başındaki replik disiplini notunda.
 */
export const URYUU_TIMELINE: readonly {
  key: string;
  stamp: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  term: { text: string; reading: LocalizedText; source: LocalizedText };
  imageKey: string;
}[] = [
  {
    key: "souken",
    stamp: { tr: "çocukluk · Karakura", en: "childhood · Karakura" },
    title: { tr: "Dedenin atölyesi", en: "The grandfather's workshop" },
    text: {
      tr: "Ryūken oğluna Quincy olmayı öğretmeyi reddetti; öğreten dede Sōken oldu. Sonra Sōken bir Hollow saldırısında öldü ve Shinigami'ler zamanında yetişmedi. Uryū'nun bütün ölçü takıntısı buradan çıkıyor: geç kalmanın ne demek olduğunu bir kere öğrendi.",
      en: "Ryūken refused to teach his son to be a Quincy; the one who taught him was his grandfather Sōken. Then Sōken died in a Hollow attack and the Soul Reapers did not arrive in time. Every obsession with measurement that Uryū carries comes from here: he learned once what it means to be late.",
    },
    term: {
      text: "滅却師",
      reading: { tr: "Quincy — \"yok eden usta\"", en: "Quincy — \"the master who annihilates\"" },
      source: { tr: "Arşivin Bleach güç kaydı", en: "The archive's Bleach powers record" },
    },
    imageKey: URYUU_IMAGE_KEYS.fateSouken,
  },
  {
    key: "karakura",
    stamp: { tr: "15 · Karakura", en: "15 · Karakura" },
    title: { tr: "Kendini açması", en: "He shows himself" },
    text: {
      tr: "Sınıf arkadaşı olarak durduğu Ichigo'ya kendini Quincy olarak açtı ve bir yarış başlattı: kim daha çok Hollow indirecek. Yarış şehri tehlikeye attı ve ders sertti — nişan almak yetmiyor, neye nişan aldığını bilmek gerekiyor.",
      en: "He revealed himself as a Quincy to Ichigo, whose classmate he had been, and started a contest: who could down more Hollows. The contest endangered the town and the lesson was harsh — taking aim is not enough, you must know what you are aiming at.",
    },
    term: {
      text: "神聖弓",
      reading: { tr: "Heilig Bogen — kutsal yay", en: "Heilig Bogen — holy bow" },
      source: { tr: "Arşivin Bleach güç kaydı", en: "The archive's Bleach powers record" },
    },
    imageKey: URYUU_IMAGE_KEYS.fateKarakura,
  },
  {
    key: "soul-society",
    stamp: { tr: "15 · Soul Society", en: "15 · Soul Society" },
    title: { tr: "Peşin ödenen fatura", en: "The invoice paid up front" },
    text: {
      tr: "Soul Society'ye Rukia için girdi ve orada Mayuri Kurotsuchi ile karşılaştı. Kazanmak için son biçimi açtı — Quincy: Letzt Stil — ve bedelini baştan bilerek ödedi: gücünü kaybetti. Yayı olmayan bir okçu olarak kaldı.",
      en: "He entered Soul Society for Rukia and there met Mayuri Kurotsuchi. To win he opened the final form — Quincy: Letzt Stil — and paid its price knowing it in advance: he lost his powers. He was left an archer without a bow.",
    },
    term: {
      text: "Quincy: Letzt Stil",
      reading: { tr: "Son biçim — bedeli güç kaybı", en: "Final form — the price is the power itself" },
      source: {
        tr: "Almanca adı canon; kanjisi bu turda doğrulanamadı, o yüzden yazılmadı",
        en: "The German name is canon; its kanji could not be verified this round, so it is not written",
      },
    },
    imageKey: URYUU_IMAGE_KEYS.fateSoulSociety,
  },
  {
    key: "ryuuken",
    stamp: { tr: "≈16 · Arrancar dönemi", en: "≈16 · Arrancar period" },
    title: { tr: "Babanın şartı", en: "The father's condition" },
    text: {
      tr: "Gücü geri veren, onu vermeyi reddeden adam oldu. Ryūken tek bir şart koştu: bir daha Shinigami'lerle iş tutmayacak. Uryū şartı kabul etti ve tutmadı. Babasına adıyla hitap etmesi de bu mesafenin adı — Japonca'da kaba sayılan bir seçim, ve bilinçli.",
      en: "The one who gave the power back was the man who had refused to give it. Ryūken set a single condition: never to work with Soul Reapers again. Uryū accepted the condition and did not keep it. That he calls his father by his given name is the name of this distance — a choice considered rude in Japanese, and a deliberate one.",
    },
    term: {
      text: "石田竜弦",
      reading: { tr: "Ryūken Ishida — baba", en: "Ryūken Ishida — the father" },
      source: { tr: "AniList künyesi (kaynak.json)", en: "AniList profile (kaynak.json)" },
    },
    imageKey: URYUU_IMAGE_KEYS.fateRyuuken,
  },
  {
    key: "schrift",
    stamp: { tr: "≈17 · Bin Yıl Kan Savaşı", en: "≈17 · Thousand-Year Blood War" },
    title: { tr: "Harf A", en: "The letter A" },
    text: {
      tr: "Yhwach onu Sternritter yaptı ve veliaht ilan etti; harfi A oldu — imparatorun kendi harfi. Uryū beyaz üniformayı giydi, sonra saf değiştirdi. Arşivin Wandenreich kaydı harfin adını yazıyor: Antithesis — seçtiği iki hedef arasında olmuş olanı tersine çeviriyor.",
      en: "Yhwach made him a Sternritter and named him heir apparent; his letter was A — the emperor's own letter. Uryū put on the white uniform, then defected. The archive's Wandenreich record names the letter: Antithesis — it reverses what has already happened between two chosen targets.",
    },
    term: {
      text: "聖文字",
      reading: { tr: "Schrift — A · Antithesis", en: "Schrift — A · Antithesis" },
      source: { tr: "Arşivin Wandenreich kaydı", en: "The archive's Wandenreich record" },
    },
    imageKey: URYUU_IMAGE_KEYS.fateSchrift,
  },
];

/**
 * BAĞLAR — beşi de `EXPERIENCE_COMPANIONS[564]` listesindeki numaralar.
 * Bu listenin dışında portre çizilmiyor (Dalga 1'in dördüncü dersi).
 */
export const URYUU_BONDS: readonly {
  characterId: number;
  name: string;
  role: LocalizedText;
  summary: LocalizedText;
}[] = [
  {
    characterId: 5,
    name: "Ichigo Kurosaki",
    role: { tr: "rakip, sonra dost", en: "rival, then friend" },
    summary: {
      tr: "Rekabetle başladı: bir Hollow yarışı ve iki inatçı ergen. Sonunda Uryū, Ichigo'ya insan kalan yanını en çok hatırlatan kişi oldu.",
      en: "It began as rivalry: a Hollow contest and two stubborn teenagers. In the end Uryū became the one who most reminds Ichigo of the human left in him.",
    },
  },
  {
    characterId: 7,
    name: "Orihime Inoue",
    role: { tr: "sınıf arkadaşı", en: "classmate" },
    summary: {
      tr: "Aynı sınıftan, aynı çöle inen dört kişiden ikisi. Uryū'nun dikiş iğnesi ilk kez onun için işe yaradı: kumaş da onarılabilir bir şey.",
      en: "Two of the four from the same classroom who went down into the same desert. Uryū's sewing needle proved useful for her first: cloth, too, is something that can be repaired.",
    },
  },
  {
    characterId: 575,
    name: "Yasutora Sado",
    role: { tr: "aynı çölde", en: "in the same desert" },
    summary: {
      tr: "Hueco Mundo'da yan yana duran iki insan. İkisi de Shinigami değil, ikisi de geri dönmemeyi göze aldı.",
      en: "Two humans standing side by side in Hueco Mundo. Neither of them a Soul Reaper, and both of them prepared not to come back.",
    },
  },
  {
    characterId: 1083,
    name: "Ryūken Ishida",
    role: { tr: "baba — en uzak duran", en: "the father — the one standing furthest" },
    summary: {
      tr: "Öğretmeyi reddetti, sonra gücü geri verdi, ama şartla. Uryū ona adıyla sesleniyor: bir kan bağının içindeki en ölçülü mesafe.",
      en: "He refused to teach, then handed the power back — with a condition. Uryū calls him by his given name: the most measured distance inside a blood tie.",
    },
  },
  {
    characterId: 1081,
    name: "Ulquiorra Cifer",
    role: { tr: "karşısındaki Espada", en: "the Espada across from him" },
    summary: {
      tr: "Hueco Mundo'da menzilin kapandığı yer. Bir okçunun bütün üstünlüğü uzaklıkta ve o gün uzaklık yoktu.",
      en: "The place in Hueco Mundo where the range closed. An archer's whole advantage is distance, and that day there was none.",
    },
  },
];

/** Bağ kartının altındaki iki rozet. */
export const URYUU_BOND_UI = {
  hasPage: { tr: "arşivde dosyası var", en: "has a file in the archive" } satisfies LocalizedText,
  noPage: { tr: "yalnızca künye", en: "profile only" } satisfies LocalizedText,
};

/**
 * BLEACH EVRENİ'NE ÜÇ BAĞ.
 *
 * Çapa adları `lib/anime/bleach/anchors.ts` defterinden; hepsi doğrulandı
 * (ölü çapa yasak). Adresin kendisi `animeHref.bleach()` ile kuruluyor —
 * hiçbir bileşen `/anime/...` dizesini elle yazmıyor.
 */
export const URYUU_HALL_LINKS: readonly {
  anchor: string;
  label: LocalizedText;
  note: LocalizedText;
}[] = [
  {
    anchor: "empire",
    label: { tr: "Wandenreich — Görünmeyen İmparatorluk", en: "Wandenreich — The Invisible Empire" },
    note: {
      tr: "Yirmi altı harflik alfabe ve Uryū'nun A'sı orada duruyor.",
      en: "The twenty-six-letter alphabet, and Uryū's A, stand there.",
    },
  },
  {
    anchor: "powers",
    label: { tr: "Güçler — Quincy geometrisi", en: "Powers — Quincy geometry" },
    note: {
      tr: "Heilig Pfeil, Blut, Vollständig, Schrift ve Reishi'nin beş düğümlü şeması.",
      en: "The five-node diagram of Heilig Pfeil, Blut, Vollständig, Schrift and Reishi.",
    },
  },
  {
    anchor: "war",
    label: { tr: "Bin Yıl Kan Savaşı", en: "The Thousand-Year Blood War" },
    note: {
      tr: "Soykırımın gerekçesi bir denklemdi; bu sayfanın bütün gerginliği oradan geliyor.",
      en: "The justification for a genocide was an equation; all of this page's tension comes from there.",
    },
  },
];

export const URYUU_HALL_UI = {
  title: { tr: "Evrenin kendi kaydı", en: "The universe's own record" } satisfies LocalizedText,
  lede: {
    tr: "Bu sayfa bir kişiyi ölçüyor. Ölçünün etrafındaki dünya Bleach Evreni salonunda duruyor — üç bölüm doğrudan bu dosyaya bakıyor.",
    en: "This page measures one person. The world around that measurement stands in the Bleach Universe hall — three of its sections look directly at this file.",
  } satisfies LocalizedText,
};

/**
 * ⚠️ SAYFANIN REPLİK NOTU — görünür, saklanmıyor.
 *
 * Gerekçesi dosya başındaki replik disiplini bloğunda. Bu metin ziyaretçiye
 * de gösteriliyor: ölçüyü konu edinen bir sayfanın kendi ölçüsü hakkında
 * dürüst olması gerekiyor.
 */
export const URYUU_QUOTE_NOTE: LocalizedText = {
  tr: "Bu sayfada tırnak içine alınmış tek bir diyalog yok. Uryū'nun repliklerinin birebir özgün metni bu turda doğrulanamadı ve arşivin kuralı açık: doğrulanmayan cümle tırnağa alınmaz. Aşağıdaki iki blok diyalog değil — kaynağı yazılı, doğrulanmış özgün terimler.",
  en: "There is not a single line of dialogue in quotation marks on this page. The verbatim original text of Uryū's lines could not be verified this round, and the archive's rule is plain: an unverified sentence is not put in quotes. The two blocks below are not dialogue — they are verified original terms, each with its source written out.",
};

/** Kapanış: iki blok + özgün dil motto + kaynak künyesi. */
export const URYUU_CLOSING = {
  blocks: [
    {
      text: "滅却師の誇り",
      reading: { tr: "Quincy'nin gururu", en: "The pride of the Quincy" } satisfies LocalizedText,
      note: {
        tr: "AniList künyesi Uryū'yu tarif ederken bu ahlaki ilkeyi adıyla anıyor. Aynı künye ikinci bir şey daha yazıyor: kazanabiliyorsa öldürmüyor, etkisiz bırakıyor. Gurur burada bir üstünlük iddiası değil, bir sınır.",
        en: "The AniList profile names this moral ethic outright when describing Uryū. The same profile writes a second thing: when he can win without it, he does not kill — he incapacitates. Here pride is not a claim of superiority but a limit.",
      } satisfies LocalizedText,
      by: { tr: "AniList künyesi · kaynak.json", en: "AniList profile · kaynak.json" } satisfies LocalizedText,
    },
    {
      text: "聖文字 A — Antithesis",
      reading: {
        tr: "Olmuş olanı, iki hedef arasında tersine çevirmek",
        en: "To reverse what has already happened, between two targets",
      } satisfies LocalizedText,
      note: {
        tr: "İmparator harfini bir kez daha verdi ve alan kişi onu ona karşı kullandı. Bir okçunun elindeki en tuhaf alet bu: menzili değil, olmuş olanı değiştiriyor.",
        en: "The emperor gave his letter away a second time, and the one who received it used it against him. It is the strangest instrument in an archer's hand: it alters not the range but what has already happened.",
      } satisfies LocalizedText,
      by: {
        tr: "Arşivin Wandenreich kaydı · Sternritter A",
        en: "The archive's Wandenreich record · Sternritter A",
      } satisfies LocalizedText,
    },
  ],
  motto: "滅却師",
  mottoReading: {
    tr: "metsukyakushi — \"yok eden usta\". Shinigami arındırıp geri verir; Quincy yok eder ve geri vermez. Bütün kavga bu tek kelimenin içinde.",
    en: "metsukyakushi — \"the master who annihilates\". A Soul Reaper purifies and returns; a Quincy annihilates and does not. The entire quarrel sits inside this one word.",
  } satisfies LocalizedText,
  credit: {
    tr: "Künye, portre ve ölçüler AniList'ten:",
    en: "Profile, portrait and measurements from AniList:",
  } satisfies LocalizedText,
  creditLink: { tr: "AniList · karakter 564", en: "AniList · character 564" } satisfies LocalizedText,
  creditNote: {
    tr: "Portre depoda duruyor (230×345, `anilist-portrait.jpg`) — hotlink yok. Sahne görselleri üretilmedi: her kadraj bir küratör yuvası, sayfadaki bütün motifler elle çizilmiş SVG. Terminoloji arşivin kendi Bleach kaydından doğrulandı.",
    en: "The portrait lives in the repository (230×345, `anilist-portrait.jpg`) — no hotlinking. No scene imagery was generated: every frame is a curator slot, and all motifs on the page are hand-drawn SVG. The terminology was verified against the archive's own Bleach record.",
  } satisfies LocalizedText,
};

/** Görsel `alt` metinleri — hepsinde kaynak bilgisi var (FAZ 2 §3). */
export const URYUU_ALT = {
  portrait: {
    tr: "Uryū Ishida — AniList resmî portresi (depodaki kopya)",
    en: "Uryū Ishida — official AniList portrait (repository copy)",
  } satisfies LocalizedText,
  portraitUploaded: {
    tr: "Uryū Ishida — arşive küratör tarafından yüklenen portre",
    en: "Uryū Ishida — portrait uploaded to the archive by the curator",
  } satisfies LocalizedText,
  scenePrefix: {
    tr: "Uryū Ishida — küratör tarafından yüklenen kadraj:",
    en: "Uryū Ishida — frame uploaded by the curator:",
  } satisfies LocalizedText,
  companionPrefix: {
    tr: "Arşivdeki portre:",
    en: "Portrait in the archive:",
  } satisfies LocalizedText,
};
