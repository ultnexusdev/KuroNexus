import type { LocalizedText } from "./types";

/**
 * Grimmjow Jaegerjaquez — "Desgarrón" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Bileşen buradan okuyup `pick(text, locale)` ile seçiyor; istemci adalarına
 * yalnızca düz dize iniyor.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * VAHŞİLİK — ve vahşiliğin tek biçimsel karşılığı: YIRTMA. Sayfada hizalı
 * kutu yok. Bölümler tam genişlikte üst üste binmiş bantlar ve her bandın
 * alt kenarı `clip-path` ile düzensiz bir yırtık. Geçişler açılmıyor,
 * YIRTILIYOR: fade hiç kullanılmadı.
 *
 * Bu, karakterin kendi adından çıkıyor. İspanyolca *arrancar* "koparmak,
 * söküp almak" demek; Japoncası 破面 (hafumen) "kırılmış yüz/maske".
 * Arrancar, maskesini kendi eliyle YIRTMIŞ Hollow. Sayfanın motifi bir
 * süsleme değil, ırkın tarifi.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (31 Temmuz), boy (186 cm), ırk (Arrancar), Espada sırası
 * (altıncı) ve sırttaki çarpık 6 dövmesinin tarifi AniList künyesinden
 * birebir alındı (karakter 1080; `public/assets/anime/karakterler/
 * grimmjow-jaegerjaquez/kaynak.json` aynı çekimin kopyası).
 *
 * ⚠️ YAŞ VE KAN GRUBU YOK. AniList kaydında iki alan da boş. Künye şeridi
 * bu ikisini bir eksiklik olarak değil, İKİ BOŞ SATIR olarak taşıyor —
 * uydurulmuş bir sayı yazmak bu arşivin kuralını bozardı.
 *
 * ── REPLİK DİSİPLİNİ (kural 5) ───────────────────────────────────────────
 * Sayfada tırnak içinde YALNIZCA iki ibare var ve ikisi de diyalog DEĞİL:
 *   「軋れ、パンテラ」  — Resurrección'un serbest bırakma komutu
 *   「豹王の爪」        — Desgarrón'un Japonca adı
 * İkisi de sabit, kaynaktan kaynağa kaymayan terimler. Grimmjow'un
 * konuşmaları çeviriden çeviriye değiştiği için hiçbir diyalog cümlesi
 * tırnağa ALINMADI; karakterin sesi anlatı sesiyle aktarıldı.
 *
 * ── TERMİNOLOJİ (Bleach evreni — Naruto/JJK terimi YOK) ──────────────────
 * 破面 (Arrancar), 虚 (Hollow), Adjuchas — ve teknik adları:
 *   鋼皮   kōhi        → Hierro, çelik deri
 *   虚閃   kyosen      → Cero
 *   王虚の閃光 ōko no senkō → Gran Rey Cero
 *   虚弾   kyodan      → Bala
 *   響転   kyōten      → Sonído
 *   探査回路 tansa kairo → Pesquisa
 *   帰刃   kiriha      → Resurrección
 *   豹王の爪 hyōō no tsume → Desgarrón
 * Espada, Fracción, Adjuchas, Las Noches, Hueco Mundo özel ad olarak
 * bırakıldı; Türkçe karşılıkları arşivin kendi sözlüğünden.
 */

export const GRIMMJOW_ID = 1080;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const GRIMMJOW_SITE_URL = "https://anilist.co/character/1080";

/**
 * Depodaki resmî portre (Faz 2 kararı: hotlink yok, kare repoda).
 *
 * ⚠️ 230×345 — yani KÜÇÜK. Sayfada yalnızca dar bir künye kadrajında
 * kullanılıyor; büyük hero karesi küratör yuvası olarak boş bırakıldı.
 * Kendi kaynağımız olduğu için `next/image`de `unoptimized` YOK.
 */
export const GRIMMJOW_PORTRAIT = {
  src: "/assets/anime/karakterler/grimmjow-jaegerjaquez/anilist-portrait.jpg",
  w: 230,
  h: 345,
} as const;

/**
 * Sergi görselleri — hepsi characterId 1080 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `grm:` önekli (küratör modu şartı).
 */
export const GRIMMJOW_IMAGE_KEYS = {
  hero: "grm:hero",
  powerHierro: "grm:hierro",
  powerCero: "grm:cero",
  powerPantera: "grm:pantera",
  kitGranRey: "grm:gran-rey",
  kitBala: "grm:bala",
  kitSonido: "grm:sonido",
  kitPesquisa: "grm:pesquisa",
  desgarron: "grm:desgarron",
  fateAdjuchas: "grm:fate-adjuchas",
  fateEspada: "grm:fate-espada",
  fateKarakura: "grm:fate-karakura",
  fateLasNoches: "grm:fate-las-noches",
  fateReturn: "grm:fate-return",
  closing: "grm:closing",
} as const;

/** Küratör yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const GRIMMJOW_SLOT_LABELS: Record<string, LocalizedText> = {
  [GRIMMJOW_IMAGE_KEYS.hero]: {
    tr: "Hero — dikey portre, tam boy, koyu zemin (3:4)",
    en: "Hero — vertical portrait, full figure, dark ground (3:4)",
  },
  [GRIMMJOW_IMAGE_KEYS.powerHierro]: {
    tr: "Hierro — çeliğe çarpan darbenin yakın çekimi (16:9)",
    en: "Hierro — close crop of a blow landing on steel (16:9)",
  },
  [GRIMMJOW_IMAGE_KEYS.powerCero]: {
    tr: "Cero — avuçta toplanan mavi ışık (16:9)",
    en: "Cero — blue light gathering in the palm (16:9)",
  },
  [GRIMMJOW_IMAGE_KEYS.powerPantera]: {
    tr: "Resurrección — serbest bırakılmış hâl, tam boy (16:9)",
    en: "Resurrección — the released form, full figure (16:9)",
  },
  [GRIMMJOW_IMAGE_KEYS.kitGranRey]: {
    tr: "Gran Rey Cero — kanla karışmış, dönen kesit (3:2)",
    en: "Gran Rey Cero — the spinning disc mixed with blood (3:2)",
  },
  [GRIMMJOW_IMAGE_KEYS.kitBala]: {
    tr: "Bala — sertleşmiş reiatsunun bıraktığı iz (3:2)",
    en: "Bala — the trail hardened reiatsu leaves (3:2)",
  },
  [GRIMMJOW_IMAGE_KEYS.kitSonido]: {
    tr: "Sonído — yer değiştirmenin bıraktığı boşluk (3:2)",
    en: "Sonído — the gap the displacement leaves behind (3:2)",
  },
  [GRIMMJOW_IMAGE_KEYS.kitPesquisa]: {
    tr: "Pesquisa — çevreyi tarayan duyu, geniş plan (3:2)",
    en: "Pesquisa — the sense sweeping the field, wide shot (3:2)",
  },
  [GRIMMJOW_IMAGE_KEYS.desgarron]: {
    tr: "Desgarrón — havada asılı duran dev pençeler (16:9)",
    en: "Desgarrón — the giant claws hanging in the air (16:9)",
  },
  [GRIMMJOW_IMAGE_KEYS.fateAdjuchas]: {
    tr: "Adjuchas — Hueco Mundo'nun kumunda panter siluetti (3:2)",
    en: "Adjuchas — a panther silhouette on the sand of Hueco Mundo (3:2)",
  },
  [GRIMMJOW_IMAGE_KEYS.fateEspada]: {
    tr: "Espada — sırttaki çarpık 6, yakın çekim (3:2)",
    en: "Espada — the crooked 6 on the back, close crop (3:2)",
  },
  [GRIMMJOW_IMAGE_KEYS.fateKarakura]: {
    tr: "Karakura — izinsiz akın, gece, altı gölge (3:2)",
    en: "Karakura — the unsanctioned raid, night, six shadows (3:2)",
  },
  [GRIMMJOW_IMAGE_KEYS.fateLasNoches]: {
    tr: "Las Noches — beyaz kubbenin altındaki son karşılaşma (3:2)",
    en: "Las Noches — the last encounter beneath the white dome (3:2)",
  },
  [GRIMMJOW_IMAGE_KEYS.fateReturn]: {
    tr: "Dönüş — Kan Savaşı'nda aynı tarafta duran figür (3:2)",
    en: "The return — a figure standing on the same side in the Blood War (3:2)",
  },
  [GRIMMJOW_IMAGE_KEYS.closing]: {
    tr: "Kapanış — geniş bant, kumda derin pençe izleri (8:3)",
    en: "Closing — wide band, deep claw furrows in the sand (8:3)",
  },
};

/** `CuratorGaps` satırlarındaki teknik künye — tip + ölçü + biçim. */
export const GRIMMJOW_SLOT_SPECS: Record<string, LocalizedText> = {
  [GRIMMJOW_IMAGE_KEYS.hero]: {
    tr: "dikey kadraj · 1200×1600 · webp",
    en: "vertical frame · 1200×1600 · webp",
  },
  [GRIMMJOW_IMAGE_KEYS.powerHierro]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [GRIMMJOW_IMAGE_KEYS.powerCero]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [GRIMMJOW_IMAGE_KEYS.powerPantera]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [GRIMMJOW_IMAGE_KEYS.kitGranRey]: {
    tr: "küçük kadraj · 900×600 · webp",
    en: "small frame · 900×600 · webp",
  },
  [GRIMMJOW_IMAGE_KEYS.kitBala]: {
    tr: "küçük kadraj · 900×600 · webp",
    en: "small frame · 900×600 · webp",
  },
  [GRIMMJOW_IMAGE_KEYS.kitSonido]: {
    tr: "küçük kadraj · 900×600 · webp",
    en: "small frame · 900×600 · webp",
  },
  [GRIMMJOW_IMAGE_KEYS.kitPesquisa]: {
    tr: "küçük kadraj · 900×600 · webp",
    en: "small frame · 900×600 · webp",
  },
  [GRIMMJOW_IMAGE_KEYS.desgarron]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [GRIMMJOW_IMAGE_KEYS.fateAdjuchas]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [GRIMMJOW_IMAGE_KEYS.fateEspada]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [GRIMMJOW_IMAGE_KEYS.fateKarakura]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [GRIMMJOW_IMAGE_KEYS.fateLasNoches]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [GRIMMJOW_IMAGE_KEYS.fateReturn]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [GRIMMJOW_IMAGE_KEYS.closing]: {
    tr: "bant · 1920×720 · webp",
    en: "band · 1920×720 · webp",
  },
};

/** `CuratorSlot`a geçen önerilen piksel ölçüleri. */
export const GRIMMJOW_SLOT_SIZES: Record<string, { w: number; h: number }> = {
  [GRIMMJOW_IMAGE_KEYS.hero]: { w: 1200, h: 1600 },
  [GRIMMJOW_IMAGE_KEYS.powerHierro]: { w: 1600, h: 900 },
  [GRIMMJOW_IMAGE_KEYS.powerCero]: { w: 1600, h: 900 },
  [GRIMMJOW_IMAGE_KEYS.powerPantera]: { w: 1600, h: 900 },
  [GRIMMJOW_IMAGE_KEYS.kitGranRey]: { w: 900, h: 600 },
  [GRIMMJOW_IMAGE_KEYS.kitBala]: { w: 900, h: 600 },
  [GRIMMJOW_IMAGE_KEYS.kitSonido]: { w: 900, h: 600 },
  [GRIMMJOW_IMAGE_KEYS.kitPesquisa]: { w: 900, h: 600 },
  [GRIMMJOW_IMAGE_KEYS.desgarron]: { w: 1600, h: 900 },
  [GRIMMJOW_IMAGE_KEYS.fateAdjuchas]: { w: 1200, h: 800 },
  [GRIMMJOW_IMAGE_KEYS.fateEspada]: { w: 1200, h: 800 },
  [GRIMMJOW_IMAGE_KEYS.fateKarakura]: { w: 1200, h: 800 },
  [GRIMMJOW_IMAGE_KEYS.fateLasNoches]: { w: 1200, h: 800 },
  [GRIMMJOW_IMAGE_KEYS.fateReturn]: { w: 1200, h: 800 },
  [GRIMMJOW_IMAGE_KEYS.closing]: { w: 1920, h: 720 },
};

/**
 * Yüklenen kadrajların `alt` metninin başı (FAZ 2 §3: her alt kaynağını
 * söylüyor). Devamına o yuvanın etiketi ekleniyor.
 */
export const GRIMMJOW_ALT = {
  scenePrefix: {
    tr: "Grimmjow Jaegerjaquez — arşive yüklenmiş kare:",
    en: "Grimmjow Jaegerjaquez — frame uploaded to the archive:",
  },
  companionPrefix: {
    tr: "Arşivdeki portre kaydı:",
    en: "Portrait record in this archive:",
  },
} as const;

/** Boş kadrajın içine yazılan tek satır — yalnızca küratöre görünüyor. */
export const GRIMMJOW_FRAME_EMPTY: LocalizedText = {
  tr: "yırtık boş",
  en: "the tear is empty",
};

/** Portre yuvasının etiketi (ABILITY değil, PORTRAIT). */
export const GRIMMJOW_PORTRAIT_SLOT: LocalizedText = {
  tr: "Portre — dikey, tam boy, 1200×1600'e kadar",
  en: "Portrait — vertical, full figure, up to 1200×1600",
};

export const GRIMMJOW_CRUMB = {
  series: {
    tr: "Bleach · Espada",
    en: "Bleach · Espada",
  },
} as const;

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const GRIMMJOW_IDENTITY = {
  name: "Grimmjow Jaegerjaquez",
  nativeName: "グリムジョー・ジャガージャック",
  /** Sırası: altıncı. İspanyolca sıra adı Espada künyesinin kendisi. */
  title: "Sexta Espada",
  titleReading: {
    tr: "Altıncı Kılıç — Aizen'in on Arrancar'ından altıncısı",
    en: "The Sixth Sword — sixth of Aizen’s ten Arrancar",
  },
  house: {
    tr: "Hueco Mundo · Las Noches · Espada",
    en: "Hueco Mundo · Las Noches · Espada",
  },
  epigraph: {
    tr: "Maskesini kendi eliyle yırtan varlığa Arrancar deniyor. Grimmjow'un yırttığı yalnızca maske değildi.",
    en: "A being that tears off its own mask is called an Arrancar. The mask was not the only thing Grimmjow tore.",
  },
  facts: [
    {
      key: "birthday",
      label: { tr: "Doğum günü", en: "Birthday" },
      value: { tr: "31 Temmuz", en: "31 July" },
      blank: false,
    },
    {
      key: "height",
      label: { tr: "Boy", en: "Height" },
      value: { tr: "186 cm", en: "186 cm" },
      blank: false,
    },
    {
      key: "race",
      label: { tr: "Irk", en: "Race" },
      value: { tr: "破面 · Arrancar", en: "破面 · Arrancar" },
      blank: false,
    },
    {
      key: "rank",
      label: { tr: "Sıra", en: "Rank" },
      value: {
        tr: "Sexta Espada — onun altıncısı",
        en: "Sexta Espada — sixth of the ten",
      },
      blank: false,
    },
    {
      key: "mark",
      label: { tr: "İşaret", en: "The mark" },
      value: {
        tr: "Sırtta çarpık bir 6; Hollow deliğinin hemen üstünde ve sağında",
        en: "A crooked 6 on the back, just above and to the right of the hollow hole",
      },
      blank: false,
    },
    {
      key: "zanpakuto",
      label: { tr: "Zanpakutō", en: "Zanpakutō" },
      value: { tr: "Pantera — パンテラ", en: "Pantera — パンテラ" },
      blank: false,
    },
    {
      key: "age",
      label: { tr: "Yaş", en: "Age" },
      value: {
        tr: "Verilmedi — künyede boş",
        en: "Not given — blank in the dossier",
      },
      blank: true,
    },
    {
      key: "blood",
      label: { tr: "Kan grubu", en: "Blood type" },
      value: {
        tr: "Verilmedi — künyede boş",
        en: "Not given — blank in the dossier",
      },
      blank: true,
    },
  ],
} as const;

export const GRIMMJOW_HERO = {
  lede: {
    tr: "Bu sayfada hizalı tek bir kenar yok. Bölümler üst üste binmiş bantlar ve her bandın altı yırtık — çünkü Grimmjow'un evrende yaptığı tek şey bir şeyleri açmak: maskeyi, sırasını, kendi kolunu, karşısındakini.",
    en: "There is not one straight edge on this page. The sections are bands stacked on top of each other and every band is torn along its underside — because the only thing Grimmjow does in this world is open things: the mask, his rank, his own arm, whoever is in front of him.",
  },
  portraitAlt: {
    tr: "Grimmjow Jaegerjaquez — AniList resmî portresi",
    en: "Grimmjow Jaegerjaquez — official AniList portrait",
  },
  portraitAltUploaded: {
    tr: "Grimmjow Jaegerjaquez — arşive yüklenmiş portre",
    en: "Grimmjow Jaegerjaquez — portrait uploaded to the archive",
  },
  heroCaption: {
    tr: "Bu büyük kadraj boş. Depodaki resmî portre 230 piksel eninde — tam kanama bir hero için küçük, o yüzden bu kare küratör yüklemesini bekliyor.",
    en: "This large frame is empty. The official portrait in the repository is 230 pixels wide — too small for a full-bleed hero, so this frame waits for a curator upload.",
  },
  /** Filigranın okunuşu — ekran okuyucuya değil, meraklıya. */
  markNote: {
    tr: "Filigran elle çizildi: dört paralel yırtık, 破面 (hafumen — kırılmış maske) ve Aizen'in sırta kazıdığı çarpık 6.",
    en: "The watermark is hand-drawn: four parallel tears, 破面 (hafumen — broken mask) and the crooked 6 Aizen carved into his back.",
  },
} as const;

/* ── Mod düğmesi: Resurrección ──────────────────────────────────────────── */

/**
 * 帰刃 (kiriha) — Resurrección. Sayfanın TEK modu ve YAPIYI değiştiriyor:
 * yırtıkların derinliği `--grm-rip` bir kademe artıyor (bantlar birbirine
 * daha çok giriyor), başlıklar bir kademe büyüyor, kenarlarda pençe izi
 * gölgeleri beliriyor ve elektrik mavisi doyuyor.
 *
 * ⚠️ Kapalıyken yırtıklar KAYBOLMUYOR, yalnızca SIĞ oluyor. Kilitli ızgara
 * varsayılanda da var (Dalga 1 dersi 2).
 */
export const GRIMMJOW_MODE = {
  title: { tr: "Resurrección", en: "Resurrección" },
  native: "帰刃",
  nativeReading: {
    tr: "Kiriha — «dönen kılıç»; Arrancar'ın kılıcını bedenine geri alması",
    en: "Kiriha — “the returning blade”; an Arrancar taking its sword back into its body",
  },
  enter: {
    tr: "Serbest bırak",
    en: "Release it",
  },
  exit: {
    tr: "Kılıcı geri al",
    en: "Seal it back",
  },
  hintOff: {
    tr: "Mühürlü hâl. Yırtıklar sığ, başlıklar dar, mavi kısık.",
    en: "The sealed state. The tears are shallow, the headings tight, the blue held down.",
  },
  hintOn: {
    tr: "Serbest hâl. Yırtıklar derinleşti, başlıklar bir kademe büyüdü, kenarlarda pençe izleri belirdi.",
    en: "Released. The tears run deeper, the headings step up a size, claw furrows have surfaced along the edges.",
  },
  release: "軋れ、パンテラ",
  releaseReading: {
    tr: "Kishire, Pantera — «Gıcırda, Pantera»",
    en: "Kishire, Pantera — “Grind, Pantera”",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const GRIMMJOW_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "Dossier" },
    lede: {
      tr: "Sekiz satır. İkisi boş ve o boşluk düzeltilmiyor: AniList kaydında Grimmjow'un ne yaşı var ne kan grubu.",
      en: "Eight lines. Two are blank and the blanks are not corrected: the AniList record gives Grimmjow neither an age nor a blood type.",
    },
  },
  power: {
    title: { tr: "Üç güç", en: "Three powers" },
    lede: {
      tr: "Arrancar gücü üç katmanda okunuyor: dayandığı şey, fırlattığı şey, geri aldığı şey.",
      en: "Arrancar power reads in three layers: what it withstands, what it throws, and what it takes back.",
    },
  },
  kit: {
    title: { tr: "Dört teknik", en: "Four techniques" },
    lede: {
      tr: "Dördü de Hollow'un ortak dağarcığı; Espada olmak bunları daha büyük yapıyor, yeni bir şey eklemiyor.",
      en: "All four belong to the shared Hollow vocabulary; being an Espada makes them bigger, it does not add anything new.",
    },
  },
  desgarron: {
    title: { tr: "Desgarrón", en: "Desgarrón" },
    lede: {
      tr: "Beş pençe. Her pençeye basıldığında sayfa fiziksel olarak yırtılıyor ve yırtığın altından bir kart çıkıyor. Yırtıklar birikimli: beşi de açıldığında bu bölüm parçalı bir kolaja dönüşüyor ve bir daha toparlanmıyor.",
      en: "Five claws. Press one and the page physically tears; a card comes out from under the tear. The tears accumulate: with all five open this section becomes a shredded collage and does not knit back together.",
    },
  },
  fate: {
    title: { tr: "Beş durak", en: "Five stops" },
    lede: {
      tr: "Yaş yok, takvim yok — Bleach Grimmjow'a ikisini de vermiyor. Duraklar dönem adlarıyla işaretlendi.",
      en: "No age, no calendar — Bleach gives Grimmjow neither. The stops are marked by the name of their era.",
    },
  },
  bonds: {
    title: { tr: "Dört isim", en: "Four names" },
    lede: {
      tr: "Dördünün de bu arşivde kendi dosyası var. Dördü de Grimmjow'a farklı bir şey yapıyor: biri hedefi, biri zıddı, biri sahibi, biri aynası.",
      en: "All four have their own file in this archive. Each does something different to Grimmjow: one is his target, one his opposite, one his owner, one his mirror.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "İki ibare, bir ad. Üçü de tırnak içinde durabilecek kadar sabit.",
      en: "Two phrases and one name. All three are fixed enough to sit inside quotation marks.",
    },
  },
} as const;

/* ── Üç büyük güç ───────────────────────────────────────────────────────── */

export interface GrimmjowPower {
  key: string;
  name: string;
  native: string;
  reading: string;
  turkish: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
  imageKey: string;
}

export const GRIMMJOW_POWERS: GrimmjowPower[] = [
  {
    key: "hierro",
    name: "Hierro",
    native: "鋼皮",
    reading: "Kōhi",
    turkish: { tr: "Çelik deri", en: "Steel skin" },
    tagline: {
      tr: "Zırh takılmıyor; deri zaten zırh.",
      en: "No armour is worn; the skin already is the armour.",
    },
    text: {
      tr: "Arrancar'ın yoğunlaşmış reiatsusu derinin altında katılaşıyor ve gövde çelikten sert oluyor. Hiçbir Arrancar bunu açıp kapatmıyor — Hierro sürekli açık, bedene ait bir özellik. Grimmjow'da bu, dövüş biçiminin temeli: kaçmıyor, siper almıyor, gelen darbeyi üstüne alıp aradaki mesafeyi kapatıyor. Sayfanın bantları da öyle duruyor: birbirinden kaçmıyor, üstüne biniyor.",
      en: "The condensed reiatsu of an Arrancar hardens beneath the skin and the body becomes as tough as steel. No Arrancar switches it on or off — Hierro is always on, a property of the body itself. In Grimmjow this is the foundation of how he fights: he does not retreat, he does not guard, he takes the incoming blow and closes the distance instead. The bands of this page stand the same way: not clearing each other, but overlapping.",
    },
    traits: [
      { tr: "Sürekli açık", en: "Always on" },
      { tr: "Sıraya göre kalınlaşır", en: "Thickens with rank" },
      { tr: "Siper gerektirmez", en: "Removes the need to guard" },
    ],
    imageKey: GRIMMJOW_IMAGE_KEYS.powerHierro,
  },
  {
    key: "cero",
    name: "Cero",
    native: "虚閃",
    reading: "Kyosen",
    turkish: { tr: "Hollow parıltısı", en: "Hollow flash" },
    tagline: {
      tr: "Toplanan reiatsu, tek yönde boşaltılıyor.",
      en: "Gathered reiatsu, emptied in one direction.",
    },
    text: {
      tr: "Hollow'ların ortak silahı: parmak ucunda, avuçta ya da ağızda toplanan reiatsu bir ışın hâlinde bırakılıyor. Espada'nın Cero'su renkli oluyor ve renk sahibine ait; Grimmjow'unki elektrik mavisi — bu sayfanın accent rengi doğrudan oradan geldi. Cero hazırlık istiyor, yani Grimmjow'un hiç sevmediği tek şeyi: beklemeyi.",
      en: "The shared weapon of the Hollows: reiatsu gathered at a fingertip, in the palm or in the mouth, then let go as a beam. An Espada's Cero is coloured and the colour belongs to its owner; Grimmjow's is electric blue — the accent colour of this page comes straight from it. A Cero needs a wind-up, which is the one thing Grimmjow has no patience for: waiting.",
    },
    traits: [
      { tr: "Elektrik mavisi", en: "Electric blue" },
      { tr: "Parmak, avuç ya da ağız", en: "Finger, palm or mouth" },
      { tr: "Toplanma süresi ister", en: "Demands a charge" },
    ],
    imageKey: GRIMMJOW_IMAGE_KEYS.powerCero,
  },
  {
    key: "pantera",
    name: "Resurrección: Pantera",
    native: "帰刃",
    reading: "Kiriha",
    turkish: { tr: "Serbest bırakma — Pantera", en: "Release — Pantera" },
    tagline: {
      tr: "Kılıç kaybolmuyor; bedene geri giriyor.",
      en: "The sword is not drawn; it goes back into the body.",
    },
    text: {
      tr: "Shinigami'nin Zanpakutō'su dışarı açılıyor, Arrancar'ınki içeri kapanıyor: Resurrección kılıcı bedene geri alıp Hollow'un asıl biçimini serbest bırakıyor. Pantera'nın açtığı hâl bir panter: uzayan saç, pençeler, kollardaki bıçaksı çıkıntılar, hız ve dayanıklılıkta topyekûn artış. Bu hâlin kendi saldırıları var — kollardaki çıkıntıların savrulduğu Garra de la Pantera ve bölümün altındaki Desgarrón. Serbest bırakma komutu 「軋れ、パンテラ」.",
      en: "A Shinigami's Zanpakutō opens outward; an Arrancar's closes inward: Resurrección takes the sword back into the body and releases the Hollow's true shape. What Pantera opens is a panther: lengthened hair, claws, blade-like protrusions along the forearms, a wholesale rise in speed and durability. The form carries its own attacks — Garra de la Pantera, where those forearm protrusions are thrown, and the Desgarrón below. The release command is 「軋れ、パンテラ」.",
    },
    traits: [
      { tr: "帰刃 — kılıç içeri", en: "帰刃 — the blade goes in" },
      { tr: "Garra de la Pantera", en: "Garra de la Pantera" },
      { tr: "Hız ve dayanıklılık artışı", en: "Speed and durability rise" },
    ],
    imageKey: GRIMMJOW_IMAGE_KEYS.powerPantera,
  },
];

/* ── Dört küçük teknik ──────────────────────────────────────────────────── */

export interface GrimmjowTechnique {
  key: string;
  name: string;
  native: string;
  reading: string;
  turkish: LocalizedText;
  note: LocalizedText;
  imageKey: string;
}

export const GRIMMJOW_KIT: GrimmjowTechnique[] = [
  {
    key: "granrey",
    name: "Gran Rey Cero",
    native: "王虚の閃光",
    reading: "Ōko no senkō",
    turkish: { tr: "Kral Hollow'un parıltısı", en: "The king Hollow’s flash" },
    note: {
      tr: "Yalnızca Espada'nın kullanabildiği Cero: Arrancar kendi kanını reiatsuya karıştırıyor ve ışın dönerek, sıradan bir Cero'dan kat kat büyük çıkıyor. Bedel açık — silahı büyütmek için yaralanmak gerekiyor.",
      en: "The Cero only an Espada can fire: the Arrancar mixes its own blood into the reiatsu and the beam leaves spinning, many times larger than an ordinary Cero. The price is plain — to enlarge the weapon you have to open yourself.",
    },
    imageKey: GRIMMJOW_IMAGE_KEYS.kitGranRey,
  },
  {
    key: "bala",
    name: "Bala",
    native: "虚弾",
    reading: "Kyodan",
    turkish: { tr: "Hollow mermisi", en: "Hollow bullet" },
    note: {
      tr: "Cero'nun küçük ve hızlı hâli: sertleştirilmiş reiatsu bir mermi gibi fırlatılıyor. Yirmi kat daha hızlı, çok daha zayıf. Grimmjow'un beklemekten kaçtığı yerde bu geliyor.",
      en: "The small, fast version of the Cero: hardened reiatsu thrown like a bullet. Around twenty times faster and far weaker. This is what comes out wherever Grimmjow refuses to wait.",
    },
    imageKey: GRIMMJOW_IMAGE_KEYS.kitBala,
  },
  {
    key: "sonido",
    name: "Sonído",
    native: "響転",
    reading: "Kyōten",
    turkish: { tr: "Ses dönüşü", en: "Sound turn" },
    note: {
      tr: "Arrancar'ın yüksek hızlı yer değiştirmesi — Shinigami'nin Shunpo'suna karşılık gelen şey. Adı sesten geliyor: hareketin kendisi görülmüyor, geride bırakılan gürültü duyuluyor.",
      en: "The Arrancar's high-speed movement — the counterpart of the Shinigami's Shunpo. The name comes from sound: the motion itself is not seen, the noise it leaves behind is heard.",
    },
    imageKey: GRIMMJOW_IMAGE_KEYS.kitSonido,
  },
  {
    key: "pesquisa",
    name: "Pesquisa",
    native: "探査回路",
    reading: "Tansa kairo",
    turkish: { tr: "Tarama devresi", en: "Scanning circuit" },
    note: {
      tr: "Çevredeki reiatsuyu ölçen Arrancar duyusu; kimin nerede olduğunu ve ne kadar güçlü olduğunu veriyor. Grimmjow'un onu en çok kullandığı yer dövüşün ortası değil, dövüşecek birini ararken.",
      en: "The Arrancar sense that measures the reiatsu around it, giving who is where and how strong they are. The place Grimmjow uses it most is not the middle of a fight but the search for somebody to have one with.",
    },
    imageKey: GRIMMJOW_IMAGE_KEYS.kitPesquisa,
  },
];

/* ── Sayfanın kalbi: beş pençe ──────────────────────────────────────────── */

/**
 * Beş pençe, beş kart. Her kart Grimmjow'un YIRTTIĞI ya da YIRTILAN bir
 * şey — mekanik ile içerik aynı fiili paylaşıyor.
 *
 * ⚠️ "Beş" sayısı keyfi değil: Grimmjow'un Fracción'u tam beş kişiydi
 * (Shawlong, Edrad, Nakeem, Yylfordt, Di Roy) ve beşi de aynı gece öldü.
 * Dördüncü kart doğrudan onlar.
 *
 * `claw` alanı pençenin üstünde yazan kısa etiket, `native` Japonca terim,
 * `card` ise ancak YIRTILDIKTAN sonra açılan gövde.
 */
export interface GrimmjowClaw {
  key: string;
  /** Pençe düğmesinin üstündeki sıra numarası (01–05) */
  index: string;
  native: string;
  reading: string;
  claw: LocalizedText;
  /** Yırtılan şey — tek satır, düğmenin üstünde okunuyor */
  torn: LocalizedText;
  cardTitle: LocalizedText;
  cardText: LocalizedText;
}

export const GRIMMJOW_CLAWS: GrimmjowClaw[] = [
  {
    key: "mask",
    index: "01",
    native: "破面",
    reading: "Hafumen",
    claw: { tr: "Maske", en: "The mask" },
    torn: {
      tr: "Yırtılan: kendi yüzü",
      en: "Torn: his own face",
    },
    cardTitle: {
      tr: "Adın kendisi bir fiil",
      en: "The name is a verb",
    },
    cardText: {
      tr: "İspanyolca *arrancar* «koparmak, söküp almak» demek; Japoncası 破面, «kırılmış maske». Arrancar, Hollow maskesini kendi eliyle yırtıp Shinigami gücüne yaklaşmış varlık. Grimmjow'un çenesinin sağ yanında duran kemik parçası o maskeden arta kalan şey — silinmiş bir geçmiş değil, kırılmış bir yüzün kalıntısı. Bu sayfanın bütün biçimi bu tek kelimeden çıkıyor.",
      en: "The Spanish *arrancar* means “to tear off, to rip out”; the Japanese is 破面, “broken mask”. An Arrancar is a being that has torn away its own Hollow mask and moved toward Shinigami power. The piece of bone along the right side of Grimmjow's jaw is what is left of that mask — not an erased past but the remains of a broken face. Every formal decision on this page comes out of that one word.",
    },
  },
  {
    key: "six",
    index: "02",
    native: "六",
    reading: "Roku",
    claw: { tr: "Altı", en: "The six" },
    torn: {
      tr: "Yırtılan: adının yerini alan sayı",
      en: "Torn: the number that replaced his name",
    },
    cardTitle: {
      tr: "Aizen'in kazıdığı rakam",
      en: "The digit Aizen carved",
    },
    cardText: {
      tr: "Aizen on Espada'yı bizzat işaretliyor: sıra numarası bedene dövme olarak kazınıyor ve o sayı artık o kişinin gücünün resmî ilanı. Grimmjow'unki sırtında, Hollow deliğinin hemen üstünde ve sağında duran ÇARPIK bir 6. Çarpıklık künyede özellikle yazılı ve bu sayfanın tek düz olmayan rakamı orada: filigrandaki 6 da elle, eğri çizildi. Bir sıra numarası bir isim değildir — Grimmjow'un bütün huysuzluğu bu farkın etrafında dönüyor.",
      en: "Aizen marks the ten Espada himself: the rank is tattooed onto the body and that number becomes the official declaration of the bearer's strength. Grimmjow's sits on his back, just above and to the right of his hollow hole, and it is CROOKED. The dossier says so explicitly, and it is why the only un-straight digit on this page is there: the 6 in the watermark is hand-drawn and off-kilter too. A rank is not a name — the whole of Grimmjow's temper turns around that difference.",
    },
  },
  {
    key: "arm",
    index: "03",
    native: "腕",
    reading: "Ude",
    claw: { tr: "Kol", en: "The arm" },
    torn: {
      tr: "Yırtılan: kendi tarafının eliyle, kendi kolu",
      en: "Torn: his own arm, by his own side",
    },
    cardTitle: {
      tr: "Ceza aşağıdan değil yukarıdan geldi",
      en: "The punishment came from above, not below",
    },
    cardText: {
      tr: "Karakura'ya izinsiz inen akından sonra Grimmjow'un sol kolunu kesen düşman değil, kendi safındaki Kaname Tousen oldu — itaatsizliğin cezası olarak. Espada olmak bir korumaya dönüşmüyor; sıra numarası aynı anda hem rütbe hem tasma. Kolu sonradan Orihime Inoue'nin gücüyle geri geldi, ama izin veren yine Grimmjow'un kendisi değildi. Sayfadaki yırtıkların hepsinin aşağı doğru açılması bundan: kesik yukarıdan geliyor.",
      en: "After the unsanctioned raid on Karakura, the one who cut off Grimmjow's left arm was not an enemy but Kaname Tousen, from his own side — as the penalty for disobedience. Being an Espada does not turn into protection; the rank is a title and a leash at once. The arm came back later through Orihime Inoue's power, and again the permission was not Grimmjow's to give. That is why every tear on this page opens downward: the cut comes from above.",
    },
  },
  {
    key: "pack",
    index: "04",
    native: "従属官",
    reading: "Fracción",
    claw: { tr: "Sürü", en: "The pack" },
    torn: {
      tr: "Yırtılan: beş kişi, tek gecede",
      en: "Torn: five people, in one night",
    },
    cardTitle: {
      tr: "Beşi de aynı gece",
      en: "All five, the same night",
    },
    cardText: {
      tr: "Grimmjow'un Fracción'u — Shawlong Koufang, Edrad Liones, Nakeem Grindina, Yylfordt Granz, Di Roy Rinker — Hueco Mundo'daki panter sürüsünden gelen beş isimdi. Karakura'ya izinsiz inen akına onunla birlikte gittiler ve o gece beşi de öldü. Grimmjow'un onlar için yas tuttuğunu gösteren bir sahne yok; ama akını başlatan da, cezasını ödeyen de yalnızca oydu. Bu bölümün beş pençesi tam olarak bu beş kişi yüzünden beş.",
      en: "Grimmjow's Fracción — Shawlong Koufang, Edrad Liones, Nakeem Grindina, Yylfordt Granz, Di Roy Rinker — were five names carried over from the panther pack in Hueco Mundo. They went with him on the unsanctioned raid into Karakura, and all five died that night. There is no scene of Grimmjow mourning them; but he was the one who started the raid and the only one who paid for it. The five claws in this section are five because of these five people.",
    },
  },
  {
    key: "desgarron",
    index: "05",
    native: "豹王の爪",
    reading: "Hyōō no tsume",
    claw: { tr: "Desgarrón", en: "Desgarrón" },
    torn: {
      tr: "Yırtılan: geri kalan her şey",
      en: "Torn: everything else",
    },
    cardTitle: {
      tr: "Pençelerin kendisi",
      en: "The claws themselves",
    },
    cardText: {
      tr: "İspanyolca *desgarrón* «derin yırtık» demek, Japonca adı 豹王の爪 — «panter kralın pençesi». Serbest bırakılmış hâlin en büyük saldırısı: yoğunlaştırılmış reiatsu pençelerden dev bıçaklar hâlinde uzuyor ve tek hamlede önündeki her şeyi açıyor. Grimmjow'un en büyük silahının adı bir dövüş tekniğinden çok bir sonuç tarifi: geriye kalan şey yarık.",
      en: "The Spanish *desgarrón* means “a deep tear”; the Japanese name is 豹王の爪 — “the panther king's claw”. It is the released form's largest attack: condensed reiatsu extends from the claws as enormous blades and opens everything in front of them in one stroke. The name of Grimmjow's biggest weapon describes an outcome rather than a technique: what is left behind is the gash.",
    },
  },
];

export const GRIMMJOW_CLAW_UI = {
  rackLabel: { tr: "Beş pençe", en: "Five claws" },
  counterLabel: { tr: "Açılan yırtık", en: "Tears opened" },
  sealedBadge: { tr: "kapalı", en: "sealed" },
  tornBadge: { tr: "yırtık", en: "torn" },
  tearAction: { tr: "Yırt", en: "Tear" },
  sealAction: { tr: "Kapat", en: "Close" },
  resetLabel: { tr: "Bütün yırtıkları kapat", en: "Close every tear" },
  keyboardHint: {
    tr: "Her pençe bir düğme: sekmeyle gezilir, boşluk ya da enter ile yırtılır. Aynı pençeye tekrar basmak yırtığı kapatır.",
    en: "Every claw is a button: reach it with Tab, tear it with Space or Enter. Pressing the same claw again closes the tear.",
  },
  emptyState: {
    tr: "Bölüm şu anda kapalı. Hiçbir pençe inmedi.",
    en: "The section is closed. No claw has landed yet.",
  },
  statusTorn: {
    tr: "yırtıldı; kartı açıldı.",
    en: "was torn; its card is open.",
  },
  statusSealed: {
    tr: "kapatıldı; kartı geri gitti.",
    en: "was closed; its card went back.",
  },
  statusReset: {
    tr: "Bütün yırtıklar kapatıldı. Sayfa geri toparlandı.",
    en: "Every tear was closed. The page knitted back together.",
  },
  completeLine: {
    tr: "Beş yırtık da açık. Bölümün ızgarası artık yok: geriye üst üste binmiş beş parça kaldı ve hiçbirinin kenarı ötekiyle hizalı değil.",
    en: "All five tears are open. The section no longer has a grid: what is left is five overlapping fragments and not one of their edges lines up with another.",
  },
} as const;

/* ── Beş durak ──────────────────────────────────────────────────────────── */

/** Bir durakta anılan kişi. `characterId` arşivdeki dosyaya bağlanmak için. */
export interface GrimmjowKin {
  characterId: number;
  name: string;
  role: LocalizedText;
}

/**
 * Bir durak.
 *
 * ⚠️ `stamp` "yaş etiketi" yerine geçiyor: Grimmjow'un yaşı hiçbir kaynakta
 * verilmiyor ve Bleach'in Hueco Mundo tarafında bir takvim de yok. Duraklar
 * dönem adlarıyla işaretlendi; uydurulmuş bir sayı yazılmadı.
 *
 * ⚠️ `quote.text` bilerek düz dize: ibare bir çeviri değil KAYNAK metin, iki
 * dilde de aynı. Çevrilen şey `reading` (okunuşun anlamı) ve `by` (nereden
 * geldiği).
 */
export interface GrimmjowStop {
  key: string;
  stamp: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: string; reading: LocalizedText; by: LocalizedText };
  kin: GrimmjowKin | null;
  imageKey: string;
}

export const GRIMMJOW_TIMELINE: GrimmjowStop[] = [
  {
    key: "adjuchas",
    stamp: { tr: "Hueco Mundo · Adjuchas", en: "Hueco Mundo · Adjuchas" },
    title: { tr: "Kumda bir panter", en: "A panther on the sand" },
    text: {
      tr: "Arrancar olmadan önce Grimmjow bir Adjuchas'tı: Hollow'ların ikinci basamağında, panter biçiminde ve bir sürünün başında. Hueco Mundo'nun kuralı tek satır — yemeyen yeniliyor — ve Grimmjow o kuralı hiç sorgulamadı. Sonradan Fracción'u olacak beş isim ona bu dönemden bağlıydı; yani Espada rütbesi ona bir sürü vermedi, zaten olan sürüyü sayıya bağladı.",
      en: "Before he was an Arrancar, Grimmjow was an Adjuchas: the second tier of Hollow, panther-shaped, at the head of a pack. The rule in Hueco Mundo is one line — eat or be eaten — and Grimmjow never questioned it. The five names that would later be his Fracción were tied to him from this period; the Espada rank did not give him a pack, it attached a number to the one he already had.",
    },
    kin: null,
    imageKey: GRIMMJOW_IMAGE_KEYS.fateAdjuchas,
  },
  {
    key: "espada",
    stamp: { tr: "Las Noches · Sexta", en: "Las Noches · Sexta" },
    title: { tr: "Sırta kazınan altı", en: "The six carved into his back" },
    text: {
      tr: "Aizen Hollow'ları Arrancar'a çevirip ordusunu kurduğunda Grimmjow onun altıncı Espada'sı oldu. On Espada'nın en güçlüsünden en zayıfına doğru numaralandığı bir düzende altıncı olmak, aynı anda hem bir güç ilanı hem bir sınır: yukarıda beş kişi var. Aizen sıraları bizzat dövme olarak işliyor ve Grimmjow'un işareti sırtında, Hollow deliğinin hemen üstünde ve sağında duran çarpık bir 6. Grimmjow bütün seri boyunca bu sayının üstüne çıkmaya çalışıyor.",
      en: "When Aizen turned Hollows into Arrancar and built his army, Grimmjow became his sixth Espada. In an order numbered from strongest to weakest, being sixth is a declaration of power and a ceiling at once: there are five people above. Aizen inscribes the ranks himself as tattoos, and Grimmjow's mark sits on his back, just above and to the right of his hollow hole — a crooked 6. Grimmjow spends the entire series trying to climb over that number.",
    },
    kin: {
      characterId: 1086,
      name: "Sōsuke Aizen",
      role: {
        tr: "Onu Arrancar yapan ve sırasını sırtına kazıyan kişi",
        en: "The one who made him an Arrancar and carved his rank into his back",
      },
    },
    imageKey: GRIMMJOW_IMAGE_KEYS.fateEspada,
  },
  {
    key: "karakura",
    stamp: { tr: "Karakura · izinsiz akın", en: "Karakura · the unsanctioned raid" },
    title: { tr: "Emirsiz inen altı kişi", en: "Six who came down without orders" },
    text: {
      tr: "Grimmjow beş Fracción'uyla birlikte, emir almadan Karakura'ya indi. Gece bittiğinde beşi de ölmüştü. Ceza düşmandan değil kendi safından geldi: Kaname Tousen itaatsizliğin karşılığı olarak Grimmjow'un sol kolunu kesti. Espada olmanın ne anlama geldiği tam olarak burada görünüyor — sıra numarası bir rütbe kadar bir tasma.",
      en: "Grimmjow went down to Karakura with his five Fracción and without orders. By the end of the night all five were dead. The punishment came not from the enemy but from his own side: Kaname Tousen cut off Grimmjow's left arm as the answer to disobedience. What being an Espada actually means shows itself exactly here — the rank is as much a leash as a title.",
    },
    kin: null,
    imageKey: GRIMMJOW_IMAGE_KEYS.fateKarakura,
  },
  {
    key: "lasnoches",
    stamp: { tr: "Las Noches · karşılaşma", en: "Las Noches · the encounter" },
    title: { tr: "Önce iyileştir, sonra dövüş", en: "Heal him first, then fight" },
    text: {
      tr: "Kolunu Orihime Inoue'nin gücüyle geri aldıktan sonra Grimmjow aynı gücü ikinci kez, çok tuhaf bir amaçla kullandırdı: karşısındaki Ichigo Kurosaki'yi iyileştirtti. Sebebi merhamet değildi — yarım bir rakibi yenmenin hiçbir şeyi kanıtlamayacağını düşünüyordu. Ardından 「軋れ、パンテラ」 dedi ve Pantera'yı serbest bıraktı. Dövüşü kaybetti; ayağa kalktığında da onu yere seren Ichigo değil, kendi safındaki bir başka Espada oldu.",
      en: "After getting his arm back through Orihime Inoue's power, Grimmjow had that same power used a second time for a very strange purpose: he had Ichigo Kurosaki, his opponent, healed. The reason was not mercy — he held that beating half an opponent would prove nothing. Then he said 「軋れ、パンテラ」 and released Pantera. He lost the fight; and when he got up, the one who put him down was not Ichigo but another Espada from his own side.",
    },
    quote: {
      text: "軋れ、パンテラ",
      reading: {
        tr: "«Gıcırda, Pantera.»",
        en: "“Grind, Pantera.”",
      },
      by: {
        tr: "Resurrección'un serbest bırakma komutu",
        en: "The release command of the Resurrección",
      },
    },
    kin: {
      characterId: 5,
      name: "Ichigo Kurosaki",
      role: {
        tr: "Tam gücüyle yenmek istediği tek kişi",
        en: "The only person he wanted to beat at full strength",
      },
    },
    imageKey: GRIMMJOW_IMAGE_KEYS.fateLasNoches,
  },
  {
    key: "return",
    stamp: { tr: "Kan Savaşı · dönüş", en: "The Blood War · the return" },
    title: { tr: "Aynı tarafta duran adam", en: "The man standing on the same side" },
    text: {
      tr: "Bin Yıllık Kan Savaşı'nda Grimmjow geri döndü — bu kez Shinigami'lerin karşısında değil, onlarla aynı yönde. Taraf değiştirmesi bir tövbe değil: Grimmjow hiçbir zaman Aizen'in davasına bağlı değildi, yalnızca dövüşecek yere bağlıydı. Bu yüzden dönüşü karakterinde bir kırılma değil, karakterin en tutarlı hâli. Yenmek istediği kişi hâlâ aynı kişi ve o kişi de aynı tarafta.",
      en: "In the Thousand-Year Blood War Grimmjow came back — this time not against the Shinigami but pointed the same way. The change of side is not repentance: Grimmjow was never attached to Aizen's cause, only to wherever the fighting was. That is why the return is not a break in the character but its most consistent state. The person he wants to beat is still the same person, and that person is now on the same side.",
    },
    kin: {
      characterId: 1081,
      name: "Ulquiorra Cifer",
      role: {
        tr: "Dördüncü Espada — Grimmjow'un tam zıddı: soğukluk ve boşluk",
        en: "The fourth Espada — Grimmjow's exact opposite: coldness and emptiness",
      },
    },
    imageKey: GRIMMJOW_IMAGE_KEYS.fateReturn,
  },
];

/* ── Dört isim ──────────────────────────────────────────────────────────── */

export const GRIMMJOW_BONDS = [
  {
    characterId: 5,
    name: "Ichigo Kurosaki",
    native: "黒崎一護",
    role: {
      tr: "Takıntısı. Grimmjow'un istediği onu öldürmek değil, tam gücündeyken yenmek — bu yüzden bir kez iyileştirilmesini bile sağladı.",
      en: "His fixation. What Grimmjow wants is not to kill him but to beat him at full strength — which is why he once had him healed first.",
    },
  },
  {
    characterId: 1081,
    name: "Ulquiorra Cifer",
    native: "ウルキオラ・シファー",
    role: {
      tr: "Dördüncü Espada ve tam zıddı. Ulquiorra soru soruyor, Grimmjow saldırıyor; biri boşluk, öteki yırtık.",
      en: "The fourth Espada and his exact opposite. Ulquiorra asks questions, Grimmjow attacks; one is a void, the other a tear.",
    },
  },
  {
    characterId: 1086,
    name: "Sōsuke Aizen",
    native: "藍染惣右介",
    role: {
      tr: "Onu Arrancar yapan, sırasını sırtına kazıyan ve hiçbir zaman sadakatini kazanamayan kişi.",
      en: "The one who made him an Arrancar, carved his rank into his back, and never once earned his loyalty.",
    },
  },
  {
    characterId: 909,
    name: "Kenpachi Zaraki",
    native: "更木剣八",
    role: {
      tr: "Benzeri. AniList künyesi bile ikisini yan yana koyuyor: aynı dövüş açlığı, aynı otorite tanımazlık, aynı gülüş.",
      en: "His likeness. Even the AniList dossier sets the two side by side: the same hunger for a fight, the same contempt for authority, the same grin.",
    },
  },
] as const;

export const GRIMMJOW_BOND_UI = {
  hasPage: { tr: "arşivde dosyası var", en: "has a file in this archive" },
  noPage: { tr: "künye dosyası yok", en: "no file yet" },
  portraitMissing: { tr: "portre kaydı yok", en: "no portrait record" },
} as const;

/* ── Evren bağları (Bleach evren sayfasındaki çapalar) ──────────────────── */

/**
 * `/anime/bleach` sayfasının kendi çapaları. Adresler `animeHref.bleach()`
 * üzerinden kuruluyor (kural: hiçbir bileşen `/anime/...` dizesini elle
 * yazmaz), çapa adları `lib/anime/bleach/anchors.ts` defterinden.
 *
 * Üçü de o sayfada GERÇEKTEN var; ölü çapa yok.
 */
export const GRIMMJOW_WORLD_LINKS = [
  {
    anchor: "espada",
    label: { tr: "Espada — onun sırası", en: "Espada — the order of ten" },
    note: {
      tr: "Grimmjow altıncı sırada duruyor.",
      en: "Grimmjow stands sixth.",
    },
  },
  {
    anchor: "hueco",
    label: { tr: "Hueco Mundo", en: "Hueco Mundo" },
    note: {
      tr: "Adjuchas dönemi ve Las Noches burada.",
      en: "The Adjuchas years and Las Noches are here.",
    },
  },
  {
    anchor: "hierarchy",
    label: { tr: "Hollow hiyerarşisi", en: "The Hollow hierarchy" },
    note: {
      tr: "Adjuchas'tan Arrancar'a giden basamaklar.",
      en: "The rungs that run from Adjuchas to Arrancar.",
    },
  },
] as const;

export const GRIMMJOW_WORLD_UI = {
  title: { tr: "Evrende nerede", en: "Where this sits in the world" },
  lede: {
    tr: "Üç bağ Bleach evren sayfasının ilgili bölümüne iniyor.",
    en: "Three links drop into the matching section of the Bleach world page.",
  },
} as const;

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const GRIMMJOW_CLOSING = {
  quotes: [
    {
      text: "軋れ、パンテラ",
      reading: {
        tr: "Kishire, Pantera — «Gıcırda, Pantera.»",
        en: "Kishire, Pantera — “Grind, Pantera.”",
      },
      by: {
        tr: "Resurrección'un serbest bırakma komutu",
        en: "The release command of the Resurrección",
      },
      note: {
        tr: "Bir Shinigami kılıcını çıkarır; bir Arrancar kılıcını içeri alır. Bu iki kelimeden sonra Grimmjow'un elinde kılıç kalmıyor — kılıç artık gövdenin kendisi.",
        en: "A Shinigami draws the sword out; an Arrancar takes it in. After these two words there is no sword in Grimmjow's hand — the sword is now the body itself.",
      },
    },
    {
      text: "豹王の爪",
      reading: {
        tr: "Hyōō no tsume — «panter kralın pençesi»; İspanyolcası Desgarrón, «derin yırtık».",
        en: "Hyōō no tsume — “the panther king's claw”; in Spanish Desgarrón, “a deep tear”.",
      },
      by: {
        tr: "Serbest bırakılmış hâlin en büyük saldırısının adı",
        en: "The name of the released form's largest attack",
      },
      note: {
        tr: "Adın iki dili iki farklı şeyi söylüyor: Japoncası saldıranı adlandırıyor, İspanyolcası geriye kalanı. Bu sayfa ikincisinin tarafını tuttu.",
        en: "The two languages of the name say two different things: the Japanese names the attacker, the Spanish names what is left. This page took the side of the second.",
      },
    },
  ],
  quoteDiscipline: {
    tr: "Sayfada tırnak içinde yalnızca bu iki ibare var ve ikisi de diyalog değil, sabit terim. Grimmjow'un replikleri çeviriden çeviriye kayıyor; emin olunmayan hiçbir cümle tırnağa alınmadı.",
    en: "These two phrases are the only quoted text on the page, and neither is dialogue — both are fixed terms. Grimmjow's lines drift from translation to translation; no sentence that could not be verified was placed inside quotation marks.",
  },
  motto: "破面",
  mottoNote: {
    tr: "Hafumen — «kırılmış maske». Irkın adı ve bu sayfanın biçimi. İspanyolcası *arrancar*: koparmak, söküp almak. İki dilde de aynı fiil duruyor ve o fiil bir süsleme değil, bir tarif — sayfadaki her kenarın neden kırık olduğunun cevabı burada.",
    en: "Hafumen — “broken mask”. The name of the race and the form of this page. The Spanish is *arrancar*: to tear off, to rip out. The same verb stands in both languages, and it is a description rather than an ornament — it is the answer to why every edge on this page is broken.",
  },
  credit: {
    tr: "Künye, portre, doğum günü, boy, ırk, Espada sırası ve sırttaki çarpık 6'nın tarifi AniList'ten alındı; portre karesi depoda duruyor (hotlink yok):",
    en: "Dossier, portrait, birthday, height, race, Espada rank and the description of the crooked 6 on his back are from AniList; the portrait file lives in this repository (no hotlinking):",
  },
  creditLink: {
    tr: "AniList · Grimmjow Jaegerjaquez #1080",
    en: "AniList · Grimmjow Jaegerjaquez #1080",
  },
  creditNote: {
    tr: "Sayfadaki diğer bütün kadrajlar boş: sahne, dönem ve teknik görselleri üretilmiyor, küratör yüklemesi bekliyor. Filigrandaki pençe izi, çarpık 6 ve bölüm kenarlarındaki yırtıklar elle çizilmiş SVG ve `clip-path`. Yoldaş portreleri arşivin kendi PORTRAIT kayıtlarından geliyor.",
    en: "Every other frame on this page is empty: scene, era and technique images are not generated and wait for a curator upload. The claw mark in the watermark, the crooked 6 and the tears along the section edges are hand-drawn SVG and `clip-path`. Companion portraits come from this archive's own PORTRAIT records.",
  },
} as const;

/** Künyedeki iki boş satırın açıklaması. */
export const GRIMMJOW_MISSING_NOTE: LocalizedText = {
  tr: "AniList kaydında yaş ve kan grubu alanlarının ikisi de boş; Bleach de bu iki sayıyı hiçbir yerde vermiyor. Buraya bir tahmin yazmak künyeyi künye olmaktan çıkarırdı.",
  en: "Both the age and the blood type fields are blank on the AniList record, and Bleach never supplies either number. Writing a guess here would stop the dossier from being a dossier.",
};

export const GRIMMJOW_GAPS = {
  title: { tr: "Boş yırtıklar", en: "Empty tears" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bütün kadrajlar dolu. Sayfada kalan tek yırtık tasarımın kendisi.",
    en: "Every frame is filled. The only tear left on the page is the designed one.",
  },
} as const;
