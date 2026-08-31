import type { LocalizedText } from "./types";

/**
 * Panda (パンダ) — "Üç çekirdek" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali): karaktere ait BÜTÜN anlatı kodda, iki dilli
 * `LocalizedText` çiftleri olarak. Bileşen `pick(text, locale)` ile seçiyor;
 * istemci adalarına yalnızca DÜZ DİZE iniyor.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * ÜÇ SÜTUN, ÜÇ ÇEKİRDEK, VE HER KULLANIM BİR TANESİNİ TÜKETİYOR.
 * Sayfanın tamamı üç dikey sütun üzerine kurulu; bir çekirdek yakıldığında
 * o sütun genişliyor, diğer ikisi daralıyor (akordiyon değil, ORAN). Ama
 * seçim kalıcı değil: yakılan çekirdek TÜKENİYOR ve bir daha yakılmıyor.
 * Üçü de tükenince sayfa kilitleniyor.
 *
 * Ton sıcak-komik, alt metni karanlık: Panda bir lanetli ceset ve her
 * çekirdek bir yaşam. "Üç kere ölebilirim" cümlesi bir espri değil,
 * aritmetik.
 *
 * ── KÜNYE VERİLERİNİN KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (5 Mart), tür (Cursed Corpse), meslek (Jujutsu Sorcerer,
 * Student), bağlı olduğu okul (Jujutsu High), derece (2), yaratıcısı
 * (Masamichi Yaga) ve ÜÇ ÇEKİRDEK bilgisi AniList künyesinden birebir
 * alındı — karakter 137974, 31 Ağustos 2026; çekimin kopyası
 * `public/assets/anime/karakterler/panda/kaynak.json`.
 *
 * Künye üç çekirdeği şöyle sayıyor: "the youngest brother 'Panda', the
 * eldest brother 'Gorilla' and a sister."
 *
 * ⚠️ YAŞ YOK, KAN GRUBU YOK ve bu sayfada bir EKSİK DEĞİL. AniList kaydında
 * ikisi de boş. "Bilinmiyor" yazmak yerine künye şeridinin üçüncü sütunu
 * bunu doğrudan karakterizasyona çeviriyor: bir lanetli cesedin kan grubu
 * olmaz, çünkü kanı yoktur; bir cesedin doğum günü kayıtlıdır ama yaşı
 * sayılmaz. Uydurma sayı yazılmadı.
 *
 * ── ÜÇÜNCÜ ÇEKİRDEĞİN ADI — AÇIKÇA UYDURULMADI ───────────────────────────
 * Künye üçüncü çekirdek için yalnızca "a sister" diyor; ona ad vermiyor.
 * Bu sayfa üçüncü sütunu ÜÇGEN diye işaretliyor ve bunun bir kanon ad
 * DEĞİL, sayfanın kendi işareti olduğunu metnin içinde yazıyor (üç
 * çekirdek bir üçgenin üç köşesi; üçüncüsü kayıtta adsız kalan köşe).
 * Okuyucu eksiği görmeli, uydurmayı değil.
 *
 * ── STAT SAYILARI ARŞİVİN OKUMASI ────────────────────────────────────────
 * Künye sayısal bir güç ölçümü vermiyor. Çekirdek okumalarındaki çubuklar
 * arşivin kendi göreli okuması ve bölüm bunu yazıyor. ÜÇGEN sütununda
 * sayılar YOK — kayıt o çekirdeği çalışırken hiç göstermiyor, dolayısıyla
 * ölçülecek bir şey de yok. Boş bırakmak, uydurmaktan dürüst.
 *
 * ── TERMİNOLOJİ (Jujutsu Kaisen; Naruto/Bleach sözlüğü KULLANILMADI) ─────
 * 呪骸 Lanetli Ceset · 術式 Lanetli Teknik · 領域展開 Alan Genişletme ·
 * 反転術式 Ters Lanet Tekniği · 呪具 Lanetli Alet · 束縛 Bağlayıcı Söz ·
 * 呪力 Lanet Enerjisi · 呪霊 Lanetli Ruh · 呪術高専 Jujutsu Lisesi ·
 * 二級 ikinci derece.
 *
 * ── REPLİK DİSİPLİNİ — ⚠️ BU SAYFADA DİYALOG TIRNAĞA ALINMADI ────────────
 * Dalga kuralı: "emin olmadığın cümleyi tırnağa alma." Panda'nın
 * doğrulanabilir Japonca replik kaydı bu turda elde edilemedi (AniList
 * künyesi replik taşımıyor). Uydurulmuş bir cümleyi tırnak içinde
 * göstermek kanon hatası olurdu.
 *
 * Bu yüzden "orijinal dil" durakları DİYALOG değil KAYIT: her kader
 * durağında ve kapanışta tırnağa alınan şey künyede geçen bir TERİM ya da
 * ADIN kendisi, ve her birinin altında nereden geldiği yazılı.
 */

export const PND_ID = 137974;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const PND_SITE_URL = "https://anilist.co/character/137974";

/**
 * Depodaki resmî portre (Faz 2 §3: hotlink yok, kare repoda).
 *
 * ⚠️ 230×335 — KÜÇÜK. Yalnızca madalyon kadrajında kullanılıyor; büyük hero
 * karesi küratör yuvası olarak boş duruyor.
 */
export const PND_PORTRAIT = {
  src: "/assets/anime/karakterler/panda/anilist-portrait.jpg",
  w: 230,
  h: 335,
} as const;

/** Sergi görselleri — hepsi characterId 137974, ABILITY yuvası, `pnd:` önekli. */
export const PND_IMAGE_KEYS = {
  hero: "pnd:hero",
  coreGorilla: "pnd:core-gorilla",
  coreBrother: "pnd:core-brother",
  coreTriangle: "pnd:core-triangle",
  corpse: "pnd:corpse",
  bodyCorpse: "pnd:corpse-body",
  bodyMutation: "pnd:mutation",
  bodyEnergy: "pnd:cursed-energy",
  fateWorkshop: "pnd:fate-workshop",
  fateSentience: "pnd:fate-sentience",
  fateClass: "pnd:fate-class",
  fateGorilla: "pnd:fate-gorilla",
  fateCost: "pnd:fate-cost",
  closing: "pnd:closing",
} as const;

export type PandaImageKey =
  (typeof PND_IMAGE_KEYS)[keyof typeof PND_IMAGE_KEYS];

/** Küratör yuvası etiketleri — yükleyen kişi ne beklendiğini okur. */
export const PND_SLOT_LABELS: Record<string, LocalizedText> = {
  [PND_IMAGE_KEYS.hero]: {
    tr: "Hero — geniş kadraj, bambu ormanında tam boy (3:4)",
    en: "Hero — wide frame, full figure in a bamboo grove (3:4)",
  },
  [PND_IMAGE_KEYS.coreGorilla]: {
    tr: "Gorilla çekirdeği — güç kipi, omuzlar genişlemiş (4:5)",
    en: "Gorilla core — power mode, shoulders broadened (4:5)",
  },
  [PND_IMAGE_KEYS.coreBrother]: {
    tr: "Kardeş çekirdeği — Panda'nın kendi hâli, günlük duruş (4:5)",
    en: "Brother core — Panda's own state, everyday stance (4:5)",
  },
  [PND_IMAGE_KEYS.coreTriangle]: {
    tr: "Üçgen çekirdeği — kayıtta gösterilmiyor; boş kalabilir (4:5)",
    en: "Triangle core — never shown in the record; may stay empty (4:5)",
  },
  [PND_IMAGE_KEYS.corpse]: {
    tr: "Lanetli ceset kipi — gövdenin içi, üç çekirdeğin yeri (16:9)",
    en: "Cursed corpse mode — the body's interior, where three cores sit (16:9)",
  },
  [PND_IMAGE_KEYS.bodyCorpse]: {
    tr: "呪骸 — bez ve pamuk gövde, dikiş hattı görünür (16:9)",
    en: "呪骸 — cloth-and-cotton body, seam line visible (16:9)",
  },
  [PND_IMAGE_KEYS.bodyMutation]: {
    tr: "突然変異 — konuşan ceset, gözlerdeki bilinç (16:9)",
    en: "Mutation — the talking corpse, awareness in the eyes (16:9)",
  },
  [PND_IMAGE_KEYS.bodyEnergy]: {
    tr: "呪力 — gövdeyi yürüten enerji, yumruk anı (16:9)",
    en: "呪力 — the energy that drives the body, the punch (16:9)",
  },
  [PND_IMAGE_KEYS.fateWorkshop]: {
    tr: "Atölye — Yaga'nın çalışma odası, yarım cesetler (3:2)",
    en: "The workshop — Yaga's studio, half-finished corpses (3:2)",
  },
  [PND_IMAGE_KEYS.fateSentience]: {
    tr: "İlk söz — cesedin konuştuğu an (3:2)",
    en: "First word — the moment the corpse speaks (3:2)",
  },
  [PND_IMAGE_KEYS.fateClass]: {
    tr: "İkinci sınıf — üç kişilik sınıf, okul avlusu (3:2)",
    en: "Second year — a class of three, the school yard (3:2)",
  },
  [PND_IMAGE_KEYS.fateGorilla]: {
    tr: "ゴリラ — çekirdek değişimi, gövdenin büyüdüğü kare (3:2)",
    en: "ゴリラ — the core swap, the frame where the body grows (3:2)",
  },
  [PND_IMAGE_KEYS.fateCost]: {
    tr: "Bedel — kırık gövde, dağılmış pamuk (3:2)",
    en: "The cost — broken body, scattered stuffing (3:2)",
  },
  [PND_IMAGE_KEYS.closing]: {
    tr: "Kapanış — bambu ve üç halka, geniş bant (21:9)",
    en: "Closing — bamboo and three rings, wide band (21:9)",
  },
};

/** Beklenen kare — `CuratorGaps` bunu satırın altına yazıyor. */
export const PND_SLOT_SPECS: Record<string, LocalizedText> = {
  [PND_IMAGE_KEYS.hero]: {
    tr: "dikey kadraj · 1200×1600 · webp",
    en: "vertical frame · 1200×1600 · webp",
  },
  [PND_IMAGE_KEYS.coreGorilla]: {
    tr: "dikey kart · 960×1200 · webp",
    en: "vertical card · 960×1200 · webp",
  },
  [PND_IMAGE_KEYS.coreBrother]: {
    tr: "dikey kart · 960×1200 · webp",
    en: "vertical card · 960×1200 · webp",
  },
  [PND_IMAGE_KEYS.coreTriangle]: {
    tr: "dikey kart · 960×1200 · webp",
    en: "vertical card · 960×1200 · webp",
  },
  [PND_IMAGE_KEYS.corpse]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [PND_IMAGE_KEYS.bodyCorpse]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [PND_IMAGE_KEYS.bodyMutation]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [PND_IMAGE_KEYS.bodyEnergy]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [PND_IMAGE_KEYS.fateWorkshop]: {
    tr: "yatay kare · 1200×800 · webp",
    en: "landscape · 1200×800 · webp",
  },
  [PND_IMAGE_KEYS.fateSentience]: {
    tr: "yatay kare · 1200×800 · webp",
    en: "landscape · 1200×800 · webp",
  },
  [PND_IMAGE_KEYS.fateClass]: {
    tr: "yatay kare · 1200×800 · webp",
    en: "landscape · 1200×800 · webp",
  },
  [PND_IMAGE_KEYS.fateGorilla]: {
    tr: "yatay kare · 1200×800 · webp",
    en: "landscape · 1200×800 · webp",
  },
  [PND_IMAGE_KEYS.fateCost]: {
    tr: "yatay kare · 1200×800 · webp",
    en: "landscape · 1200×800 · webp",
  },
  [PND_IMAGE_KEYS.closing]: {
    tr: "bant · 2100×900 · webp",
    en: "band · 2100×900 · webp",
  },
};

/** `CuratorSlot`un yükleyiciye söylediği piksel ölçüsü. */
export const PND_SLOT_SIZES: Record<string, { w: number; h: number }> = {
  [PND_IMAGE_KEYS.hero]: { w: 1200, h: 1600 },
  [PND_IMAGE_KEYS.coreGorilla]: { w: 960, h: 1200 },
  [PND_IMAGE_KEYS.coreBrother]: { w: 960, h: 1200 },
  [PND_IMAGE_KEYS.coreTriangle]: { w: 960, h: 1200 },
  [PND_IMAGE_KEYS.corpse]: { w: 1600, h: 900 },
  [PND_IMAGE_KEYS.bodyCorpse]: { w: 1600, h: 900 },
  [PND_IMAGE_KEYS.bodyMutation]: { w: 1600, h: 900 },
  [PND_IMAGE_KEYS.bodyEnergy]: { w: 1600, h: 900 },
  [PND_IMAGE_KEYS.fateWorkshop]: { w: 1200, h: 800 },
  [PND_IMAGE_KEYS.fateSentience]: { w: 1200, h: 800 },
  [PND_IMAGE_KEYS.fateClass]: { w: 1200, h: 800 },
  [PND_IMAGE_KEYS.fateGorilla]: { w: 1200, h: 800 },
  [PND_IMAGE_KEYS.fateCost]: { w: 1200, h: 800 },
  [PND_IMAGE_KEYS.closing]: { w: 2100, h: 900 },
};

/** Kapak portresi yuvasının etiketi. */
export const PND_PORTRAIT_SLOT: LocalizedText = {
  tr: "Kapak portresi — dikey, tam boy (1200×1600)",
  en: "Cover portrait — vertical, full figure (1200×1600)",
};

/** Boş kadrajın İÇİNDEKİ tek kelime — YALNIZCA küratör görüyor. */
export const PND_FRAME_EMPTY: LocalizedText = {
  tr: "boş kadraj",
  en: "empty frame",
};

/** `alt` metinlerinin ortak öneki — her görselin kaynağı yazılı. */
export const PND_ALT = {
  scenePrefix: {
    tr: "Panda — küratör yüklemesi:",
    en: "Panda — curator upload:",
  },
  portrait: {
    tr: "Panda — AniList resmî portresi (karakter 137974)",
    en: "Panda — official AniList portrait (character 137974)",
  },
  portraitUploaded: {
    tr: "Panda — arşive yüklenmiş kapak portresi",
    en: "Panda — cover portrait uploaded to the archive",
  },
  companion: {
    tr: "arşivdeki portre kaydı",
    en: "portrait record in the archive",
  },
} as const;

export const PND_CRUMB = {
  series: { tr: "Jujutsu Kaisen", en: "Jujutsu Kaisen" },
} as const;

/**
 * Hero künyesi. `species` künyedeki "Cursed Corpse" satırının Japoncası;
 * kanji filigranın kendisi de bu.
 */
export const PND_IDENTITY = {
  name: "Panda",
  nativeName: "パンダ",
  species: "呪骸",
  speciesReading: {
    tr: "jugai — lanetli ceset",
    en: "jugai — cursed corpse",
  },
  school: {
    tr: "Tokyo Jujutsu Lisesi · ikinci sınıf",
    en: "Tokyo Jujutsu High · second year",
  },
  grade: {
    tr: "İkinci derece jujutsu büyücüsü",
    en: "Grade 2 jujutsu sorcerer",
  },
  epigraph: {
    tr: "Konuşuyor, şaka yapıyor, sınıfın en sakin kafası. Ve bir insan değil.",
    en: "He talks, he jokes, he is the calmest head in the class. And he is not a human.",
  },
} as const;

export const PND_HERO = {
  lede: {
    tr: "Panda bir lanetli ceset — Masamichi Yaga'nın yaptığı bir bebek. İçinde tek bir çekirdek yok: üç tane var. Sayfanın üç sütunu o üç çekirdek, ve aşağıda bir tanesini yaktığında geri gelmiyor.",
    en: "Panda is a cursed corpse — a doll built by Masamichi Yaga. There is not one core inside him: there are three. This page's three columns are those three cores, and once you burn one below, it does not come back.",
  },
  columnsLabel: {
    tr: "Üç çekirdek sütunu",
    en: "The three core columns",
  },
  frameNote: {
    tr: "Bu kadraj boş: geniş hero karesi arşive yüklenmedi. AniList portresi 230×335 ve buraya sığmıyor, o yüzden solda madalyon olarak duruyor.",
    en: "This frame is empty: the wide hero shot has not been uploaded. The AniList portrait is 230×335 and will not fill it, so it sits on the left as a medallion.",
  },
} as const;

/** Mod düğmesi — "Lanetli ceset". Sayfanın tonunu çeviriyor, ızgarasını DEĞİL. */
export const PND_CORPSE_UI = {
  title: { tr: "Lanetli ceset", en: "Cursed corpse" },
  native: "呪骸",
  enter: { tr: "Cesedi göster", en: "Show the corpse" },
  exit: { tr: "Sıcak tona dön", en: "Back to the warm tone" },
  hintWarm: {
    tr: "Sıcak kip: sayfa Panda'yı sınıf arkadaşı olarak okuyor.",
    en: "Warm mode: the page reads Panda as a classmate.",
  },
  hintCorpse: {
    tr: "Ceset kipi: renkler çekildi, çekirdek göstergeleri anatomik çizime döndü.",
    en: "Corpse mode: the colour has drained, the core indicators became an anatomical drawing.",
  },
  subtext: {
    tr: "Bu gövde bez, pamuk ve lanet enerjisinden yapıldı. Kanı yok, yaşı yok, nabzı yok. Şaka yapan şey bir cenaze malzemesi.",
    en: "This body is cloth, cotton and cursed energy. No blood, no age, no pulse. The thing making jokes is funerary material.",
  },
  anatomyLabel: {
    tr: "Gövdenin şeması — üç çekirdeğin yeri",
    en: "Diagram of the body — where the three cores sit",
  },
} as const;

export const PND_SECTIONS = {
  identity: {
    title: { tr: "Künye şeridi", en: "The record strip" },
    lede: {
      tr: "Üç sütun, üç tür bilgi: gövde, kayıt, ve kayıtta olmayan. Üçüncüsü boş değil — bir cesedin künyesinde bazı satırlar sorulmaz.",
      en: "Three columns, three kinds of information: the body, the record, and what the record does not hold. The third is not empty — some rows are simply not asked of a corpse.",
    },
  },
  lab: {
    title: { tr: "Lanet laboratuvarı", en: "The curse laboratory" },
    lede: {
      tr: "Üç büyük kart Panda'nın gerçekten ne olduğunu anlatıyor. Gücü bir teknikten değil, gövdesinden geliyor — ve bu, JJK kadrosunda neredeyse tekil bir durum.",
      en: "Three large cards say what Panda actually is. His power comes not from a technique but from his body — and in the JJK cast that is nearly singular.",
    },
  },
  kit: {
    title: { tr: "Dört boş raf", en: "Four empty shelves" },
    lede: {
      tr: "Bir büyücü künyesinin doldurulması beklenen dört satırı. Panda'da dördü de boş, ve boşluk bir eksiklik değil bir tanım: gövdesi zaten tekniğin kendisi.",
      en: "Four rows a sorcerer's record is expected to fill. In Panda's file all four are empty, and the emptiness is not a gap but a definition: his body is already the technique.",
    },
  },
  cores: {
    title: { tr: "Üç çekirdek", en: "Three cores" },
    lede: {
      tr: "Bir çekirdek seç: sütunu genişler, okuması açılır, sayfanın vurgusu ona döner. Ama seçim kalıcı değil — yaktığın çekirdek tükenir ve bir daha yakılmaz. Üçü de tükendiğinde sayfa kilitlenir.",
      en: "Pick a core: its column widens, its reading opens, the page's emphasis turns to it. But the choice is not permanent — a core you burn is spent and cannot be burned again. When all three are spent the page locks.",
    },
  },
  fate: {
    title: { tr: "Kader çizelgesi", en: "The fate chart" },
    lede: {
      tr: "Beş durak. Yaş etiketi YOK ve bu bir ihmal değil: künyede yaş satırı boş, çünkü bir ceset yaşlanmaz — üretildiği tarih vardır, geçirdiği yıl değil.",
      en: "Five stops. There are no age labels and that is not an omission: the age row in the record is blank, because a corpse does not age — it has a date of manufacture, not years lived.",
    },
  },
  bonds: {
    title: { tr: "Bağlar", en: "Bonds" },
    lede: {
      tr: "Panda'nın çevresi küçük ve keskin: aynı sınıfın iki kişisi, bir usta ve bir birinci sınıf. Arşivde sayfası olan adlar bağlantılı.",
      en: "Panda's circle is small and sharp: two people from the same class, a teacher, and a first-year. Names with a page in the archive are linked.",
    },
  },
  world: {
    title: { tr: "Evrene açılan kapılar", en: "Doors into the world" },
    lede: {
      tr: "Lanetli Arşiv'in ilgili bölümleri — okul düzeni, dereceler, lanet enerjisi ve lanetli ruhlar.",
      en: "The relevant chapters of the Cursed Archive — the school order, the grades, cursed energy and cursed spirits.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "İki kayıt ve bir okuma. Hiçbiri diyalog değil — nedeni aşağıda yazıyor.",
      en: "Two records and one reading. None of them is dialogue — the reason is written below.",
    },
  },
} as const;

/* ═══════════════════════════════════════════════════════════════════════
   KÜNYE ŞERİDİ — üç sütun
   ═══════════════════════════════════════════════════════════════════════ */

export interface PandaFactRow {
  key: string;
  kanji?: string;
  label: LocalizedText;
  value: LocalizedText;
  /** Satırın altındaki küçük not; boş bırakılabilir. */
  note?: LocalizedText;
  /** `absent`: künyede karşılığı YOK ve bu bilerek boş. */
  state: "recorded" | "read" | "absent";
}

export interface PandaFactColumn {
  key: string;
  /** Sayfanın üç sütunundan hangisi (1 · 2 · 3) */
  column: 1 | 2 | 3;
  title: LocalizedText;
  lede: LocalizedText;
  rows: PandaFactRow[];
}

export const PND_FACT_COLUMNS: PandaFactColumn[] = [
  {
    key: "body",
    column: 1,
    title: { tr: "Gövde", en: "The body" },
    lede: {
      tr: "Malzemeden okunanlar.",
      en: "What the material tells us.",
    },
    rows: [
      {
        key: "species",
        kanji: "呪骸",
        label: { tr: "Tür", en: "Species" },
        value: { tr: "Lanetli ceset", en: "Cursed corpse" },
        note: {
          tr: "Künyedeki satır: “Cursed Corpse (varies among 3 personalities)”.",
          en: "The record's line: “Cursed Corpse (varies among 3 personalities)”.",
        },
        state: "recorded",
      },
      {
        key: "maker",
        kanji: "夜蛾正道",
        label: { tr: "Yapan", en: "Made by" },
        value: { tr: "Masamichi Yaga", en: "Masamichi Yaga" },
        note: {
          tr: "Künye onu Yaga'nın en iyi yapıtı olarak kaydediyor.",
          en: "The record files him as Yaga's finest creation.",
        },
        state: "recorded",
      },
      {
        key: "cores",
        kanji: "核",
        label: { tr: "Çekirdek", en: "Cores" },
        value: { tr: "Üç", en: "Three" },
        note: {
          tr: "Künyenin sayımı: küçük kardeş “Panda”, ağabey “Gorilla” ve bir abla.",
          en: "The record's count: the youngest brother “Panda”, the eldest brother “Gorilla”, and a sister.",
        },
        state: "recorded",
      },
      {
        key: "object",
        label: { tr: "Sembolik obje", en: "Symbolic object" },
        value: { tr: "Bambu sapı", en: "A bamboo stalk" },
        note: {
          tr: "Sayfanın kendi işareti: içi boş, boğumlu, kırılınca yerine yenisi gelmiyor.",
          en: "The page's own sign: hollow, jointed, and once snapped it is not replaced.",
        },
        state: "read",
      },
    ],
  },
  {
    key: "record",
    column: 2,
    title: { tr: "Kayıt", en: "The record" },
    lede: {
      tr: "AniList künyesinden birebir.",
      en: "Verbatim from the AniList record.",
    },
    rows: [
      {
        key: "birthday",
        label: { tr: "Doğum günü", en: "Birthday" },
        value: { tr: "5 Mart", en: "5 March" },
        note: {
          tr: "Kayıtta yıl yok, yalnızca gün ve ay var.",
          en: "The record carries no year, only day and month.",
        },
        state: "recorded",
      },
      {
        key: "grade",
        kanji: "二級",
        label: { tr: "Derece", en: "Grade" },
        value: { tr: "2. derece", en: "Grade 2" },
        state: "recorded",
      },
      {
        key: "school",
        kanji: "呪術高専",
        label: { tr: "Bağlı olduğu yer", en: "Affiliation" },
        value: { tr: "Jujutsu Lisesi", en: "Jujutsu High" },
        note: {
          tr: "Tokyo kanadı, ikinci sınıf.",
          en: "The Tokyo wing, second year.",
        },
        state: "recorded",
      },
      {
        key: "role",
        label: { tr: "Görev", en: "Occupation" },
        value: {
          tr: "Jujutsu büyücüsü · öğrenci",
          en: "Jujutsu sorcerer · student",
        },
        state: "recorded",
      },
    ],
  },
  {
    key: "absent",
    column: 3,
    title: { tr: "Kayıtta olmayan", en: "Not in the record" },
    lede: {
      tr: "Bu satırlar boş değil — sorulmuyor.",
      en: "These rows are not blank — they are not asked.",
    },
    rows: [
      {
        key: "blood",
        label: { tr: "Kan grubu", en: "Blood type" },
        value: { tr: "Sorusu düşüyor", en: "The question does not apply" },
        note: {
          tr: "Bir lanetli cesedin kan grubu olmaz, çünkü kanı yoktur. Künyedeki boşluk bir bilgi eksiği değil, türün kendisi.",
          en: "A cursed corpse has no blood type because it has no blood. The blank in the record is not missing data — it is the species.",
        },
        state: "absent",
      },
      {
        key: "age",
        label: { tr: "Yaş", en: "Age" },
        value: { tr: "Sayılmıyor", en: "Not counted" },
        note: {
          tr: "Doğum günü kayıtlı ama yaş yok: üretim tarihi var, geçirilmiş yıl yok.",
          en: "The birthday is on file but the age is not: there is a date of manufacture, not years lived.",
        },
        state: "absent",
      },
      {
        key: "technique",
        kanji: "術式",
        label: { tr: "Lanetli teknik", en: "Cursed technique" },
        value: { tr: "Kayıtta yok", en: "Not in the record" },
        note: {
          tr: "Künye ona doğuştan bir teknik atamıyor. Uydurulmadı; boş bırakıldı.",
          en: "The record assigns him no innate technique. Nothing was invented; the row was left empty.",
        },
        state: "absent",
      },
      {
        key: "sister",
        label: { tr: "Ablanın adı", en: "The sister's name" },
        value: { tr: "Kayıtta yok", en: "Not in the record" },
        note: {
          tr: "Künye üçüncü çekirdek için yalnızca “a sister” diyor. Bu sayfadaki “Üçgen” adı arşivin işareti, kanon bir ad değil.",
          en: "The record says only “a sister” for the third core. The name “Triangle” on this page is the archive's marker, not a canon name.",
        },
        state: "absent",
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   LANET LABORATUVARI — 3 büyük + 4 küçük
   ═══════════════════════════════════════════════════════════════════════ */

export interface PandaPower {
  key: string;
  /** Japonca terim — çeviri gerektirmeyen özel ad */
  name: string;
  reading: string;
  turkish: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
  imageKey: string;
  /** Hangi sütunda duruyor */
  column: 1 | 2 | 3;
}

export const PND_POWERS: PandaPower[] = [
  {
    key: "corpse",
    name: "呪骸",
    reading: "jugai",
    turkish: { tr: "Lanetli Ceset", en: "Cursed Corpse" },
    tagline: {
      tr: "Malzemesi bez, iskeleti tahta, yakıtı lanet enerjisi.",
      en: "Cloth for material, wood for frame, cursed energy for fuel.",
    },
    text: {
      tr: "Lanetli ceset, bir büyücünün lanet enerjisiyle yürüttüğü bir bebektir; çoğu sessizdir, çoğu tek işlevlidir, çoğu tek çekirdek taşır. Panda üçünde de kural dışı. Künye onu doğrudan Yaga'nın en iyi yapıtı diye kaydediyor.",
      en: "A cursed corpse is a doll driven by a sorcerer's cursed energy; most are mute, most serve one function, most carry one core. Panda breaks all three rules. The record files him plainly as Yaga's finest creation.",
    },
    traits: [
      { tr: "Yapan: Masamichi Yaga", en: "Made by Masamichi Yaga" },
      { tr: "呪具 · lanetli alet taşımıyor", en: "Carries no 呪具 · cursed tool" },
      { tr: "Gövde tamir edilebilir", en: "The body can be repaired" },
    ],
    imageKey: PND_IMAGE_KEYS.bodyCorpse,
    column: 1,
  },
  {
    key: "mutation",
    name: "突然変異",
    reading: "totsuzen hen'i",
    turkish: { tr: "Mutasyon", en: "Mutation" },
    tagline: {
      tr: "Bilinç sahibi. Bu, kayıttaki tek gerçek anomali.",
      en: "Sentient. This is the single true anomaly in the record.",
    },
    text: {
      tr: "Künye onu “mutasyona uğramış lanetli ceset” olarak işaretliyor ve bilinç sahibi olduğunu açıkça yazıyor. Bir lanetli cesedin konuşması, şaka yapması, kendi adına karar vermesi kayıtta başka örneği olmayan bir durum — Panda bir alet değil, bir sınıf arkadaşı.",
      en: "The record marks him a “metamorphosed cursed corpse” and states outright that he is sentient. A cursed corpse that talks, jokes and decides for itself has no second example in the file — Panda is not a tool, he is a classmate.",
    },
    traits: [
      { tr: "Kendi adına konuşuyor", en: "Speaks for himself" },
      { tr: "İkinci sınıfın üç kişisinden biri", en: "One of three second-years" },
      { tr: "Künyede eşi yok", en: "No counterpart in the record" },
    ],
    imageKey: PND_IMAGE_KEYS.bodyMutation,
    column: 2,
  },
  {
    key: "energy",
    name: "呪力",
    reading: "juryoku",
    turkish: { tr: "Lanet Enerjisi", en: "Cursed Energy" },
    tagline: {
      tr: "Tekniği yok; enerjiyi doğrudan gövdeye veriyor.",
      en: "No technique; he pours the energy straight into the body.",
    },
    text: {
      tr: "Panda'nın dövüşü tekniğe değil kütleye dayanıyor: lanet enerjisi bir 術式'e dönüşmeden gövdeyi güçlendiriyor. İkinci derecelik de buradan geliyor — ölçülen şey ne alan ne teknik, sadece cesedin dayanma ve vurma kapasitesi.",
      en: "Panda's fighting rests on mass, not technique: the cursed energy reinforces the body without ever becoming a 術式. His grade 2 comes from exactly that — what is measured is neither domain nor technique, only the corpse's capacity to take and land a hit.",
    },
    traits: [
      { tr: "二級 · ikinci derece", en: "二級 · grade 2" },
      { tr: "Yakın dövüş", en: "Close quarters" },
      { tr: "束縛 · bağlayıcı söz kaydı yok", en: "No 束縛 · binding vow on file" },
    ],
    imageKey: PND_IMAGE_KEYS.bodyEnergy,
    column: 3,
  },
];

export interface PandaKitCard {
  key: string;
  name: string;
  reading: string;
  turkish: LocalizedText;
  verdict: LocalizedText;
  text: LocalizedText;
}

export const PND_KIT: PandaKitCard[] = [
  {
    key: "technique",
    name: "術式",
    reading: "jutsushiki",
    turkish: { tr: "Lanetli Teknik", en: "Cursed Technique" },
    verdict: { tr: "Kayıtta yok", en: "Not in the record" },
    text: {
      tr: "Doğuştan teknik, bir büyücünün künyesindeki ilk satırdır. Panda'da o satır boş — ve bir cesedin doğuştanı olmaz.",
      en: "The innate technique is the first line of a sorcerer's file. In Panda's it is blank — and a corpse has no birth to be born with.",
    },
  },
  {
    key: "domain",
    name: "領域展開",
    reading: "ryōiki tenkai",
    turkish: { tr: "Alan Genişletme", en: "Domain Expansion" },
    verdict: { tr: "Kayıtta yok", en: "Not in the record" },
    text: {
      tr: "Alan, tekniğin en uç hâlidir; tekniği olmayanda karşılığı yoktur. Kayıt Panda için hiç açmıyor.",
      en: "A domain is a technique taken to its limit; with no technique there is nothing to take. The record never opens one for Panda.",
    },
  },
  {
    key: "reverse",
    name: "反転術式",
    reading: "hanten jutsushiki",
    turkish: { tr: "Ters Lanet Tekniği", en: "Reverse Cursed Technique" },
    verdict: { tr: "Kayıtta yok", en: "Not in the record" },
    text: {
      tr: "Ters teknik canlı dokuyu onarır. Panda'nın dokusu canlı değil: kırıldığında iyileşmiyor, tamir ediliyor.",
      en: "Reverse technique mends living tissue. Panda's tissue is not living: when he breaks he is not healed, he is repaired.",
    },
  },
  {
    key: "tool",
    name: "呪具",
    reading: "jugu",
    turkish: { tr: "Lanetli Alet", en: "Cursed Tool" },
    verdict: { tr: "Kayıtta yok", en: "Not in the record" },
    text: {
      tr: "Künyede ona bağlı bir alet geçmiyor. Sınıf arkadaşı Maki bir cephane taşırken Panda çıplak elle giriyor — çünkü aletin kendisi o.",
      en: "No tool is filed against his name. His classmate Maki carries an armoury; Panda walks in bare-handed — because he is the tool.",
    },
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   ÜÇ ÇEKİRDEK — sayfanın kalbi
   ═══════════════════════════════════════════════════════════════════════ */

export interface PandaCoreStat {
  key: string;
  label: LocalizedText;
  /** `null` → kayıt bu çekirdeği çalışırken göstermiyor; uydurulmadı. */
  value: number | null;
  max: number;
}

export interface PandaCore {
  key: "gorilla" | "brother" | "triangle";
  column: 1 | 2 | 3;
  name: LocalizedText;
  native: string;
  /** Künyedeki karşılığı — “the eldest brother 'Gorilla'” gibi */
  recordLine: LocalizedText;
  kin: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  /** Yakıldığında açılan okuma */
  reading: LocalizedText;
  /** Tükendiğinde ne kaybedildi */
  loss: LocalizedText;
  stats: PandaCoreStat[];
  /** Gövde silueti — `PandaGlyphs` içindeki çizim anahtarı */
  silhouette: "broad" | "round" | "unknown";
  imageKey: string;
}

export const PND_CORES: PandaCore[] = [
  {
    key: "gorilla",
    column: 1,
    name: { tr: "Gorilla", en: "Gorilla" },
    native: "ゴリラ",
    recordLine: {
      tr: "Künye: “the eldest brother ‘Gorilla’”",
      en: "Record: “the eldest brother ‘Gorilla’”",
    },
    kin: { tr: "Ağabey", en: "The eldest brother" },
    tagline: {
      tr: "Güç kipi. Gövde büyüyor, sakinlik gidiyor.",
      en: "Power mode. The body grows, the calm leaves.",
    },
    text: {
      tr: "Ağabeyin çekirdeği devreye girdiğinde gövde genişliyor ve Panda'nın o dengeli sesi kayboluyor. Kayıtta gösterilen tek çekirdek değişimi bu: seyirci ilk kez bir lanetli cesedin içinde birden fazla kişi olduğunu burada anlıyor.",
      en: "When the eldest brother's core takes over the body broadens and Panda's level voice disappears. It is the only core swap the record actually shows: this is where an audience first understands that more than one person lives inside a cursed corpse.",
    },
    reading: {
      tr: "Sütun genişledi: Gorilla yakıldı. Gövde kütlesi artıyor, hız düşüyor, lanet enerjisi tek yöne — vuruşa — akıyor.",
      en: "The column widened: Gorilla is burning. Mass rises, speed drops, cursed energy flows in one direction only — the hit.",
    },
    loss: {
      tr: "Ağabey tükendi. Panda ölmedi; ağabeyini kaybetti.",
      en: "The eldest brother is spent. Panda did not die; he lost his brother.",
    },
    stats: [
      { key: "power", label: { tr: "Güç", en: "Power" }, value: 9, max: 10 },
      { key: "speed", label: { tr: "Hız", en: "Speed" }, value: 6, max: 10 },
      {
        key: "endurance",
        label: { tr: "Dayanıklılık", en: "Endurance" },
        value: 8,
        max: 10,
      },
      {
        key: "energy",
        label: { tr: "Lanet enerjisi", en: "Cursed energy" },
        value: 4,
        max: 10,
      },
    ],
    silhouette: "broad",
    imageKey: PND_IMAGE_KEYS.coreGorilla,
  },
  {
    key: "brother",
    column: 2,
    name: { tr: "Kardeş", en: "Brother" },
    native: "パンダ",
    recordLine: {
      tr: "Künye: “the youngest brother ‘Panda’”",
      en: "Record: “the youngest brother ‘Panda’”",
    },
    kin: { tr: "Küçük kardeş — Panda'nın kendisi", en: "The youngest brother — Panda himself" },
    tagline: {
      tr: "Varsayılan hâl. Sınıfın sakin kafası bu çekirdek.",
      en: "The default state. The class's calm head is this core.",
    },
    text: {
      tr: "Sayfanın orta sütunu Panda'nın kendi çekirdeği: konuşan, şaka yapan, arkadaşlarını toparlayan taraf. Künyede “küçük kardeş” diye geçiyor, yani Panda üç kişilik bir gövdenin en küçüğü — ve gövdenin adını o taşıyor.",
      en: "The page's middle column is Panda's own core: the side that talks, jokes and holds his friends together. The record calls him the “youngest brother”, so Panda is the smallest of three in one body — and the body carries his name.",
    },
    reading: {
      tr: "Sütun genişledi: Kardeş yakıldı. Dengeli okuma — ne en güçlü ne en hızlı; ayakta kalan taraf.",
      en: "The column widened: Brother is burning. A level reading — neither the strongest nor the fastest; the side that stays standing.",
    },
    loss: {
      tr: "Küçük kardeş tükendi. Gövde ayakta, ama adını taşıyan çekirdek gitti.",
      en: "The youngest brother is spent. The body stands, but the core that carries its name is gone.",
    },
    stats: [
      { key: "power", label: { tr: "Güç", en: "Power" }, value: 6, max: 10 },
      { key: "speed", label: { tr: "Hız", en: "Speed" }, value: 7, max: 10 },
      {
        key: "endurance",
        label: { tr: "Dayanıklılık", en: "Endurance" },
        value: 7,
        max: 10,
      },
      {
        key: "energy",
        label: { tr: "Lanet enerjisi", en: "Cursed energy" },
        value: 5,
        max: 10,
      },
    ],
    silhouette: "round",
    imageKey: PND_IMAGE_KEYS.coreBrother,
  },
  {
    key: "triangle",
    column: 3,
    name: { tr: "Üçgen", en: "Triangle" },
    native: "三",
    recordLine: {
      tr: "Künye: “and a sister” — ad verilmiyor",
      en: "Record: “and a sister” — no name given",
    },
    kin: { tr: "Abla", en: "The sister" },
    tagline: {
      tr: "Üçüncü köşe. Kayıt onu hiç açmıyor.",
      en: "The third corner. The record never opens it.",
    },
    text: {
      tr: "Üçüncü çekirdek künyede tek bir kelimeyle geçiyor: bir abla. Adı yok, sahnesi yok, ölçümü yok. Bu sayfa ona “Üçgen” diyor çünkü üç çekirdek bir üçgenin üç köşesi ve üçüncü köşe kayıtta karanlıkta kalıyor — ad arşivin işareti, kanon değil.",
      en: "The third core appears in the record as a single phrase: a sister. No name, no scene, no measurement. This page calls her “Triangle” because three cores make three corners and the third corner stays dark in the record — the name is the archive's marker, not canon.",
    },
    reading: {
      tr: "Sütun genişledi ve içi boş çıktı: kayıt bu çekirdeği çalışırken hiç göstermiyor. Ölçülecek bir şey olmadığı için çubuklar boş. Bu sütunu yakmak saf kayıp.",
      en: "The column widened and came up hollow: the record never shows this core in action. With nothing to measure the bars stay empty. Burning this column is pure loss.",
    },
    loss: {
      tr: "Abla tükendi. Hiç görülmeden gitti — kaybın en sessizi.",
      en: "The sister is spent. She went without ever being seen — the quietest of the three losses.",
    },
    stats: [
      { key: "power", label: { tr: "Güç", en: "Power" }, value: null, max: 10 },
      { key: "speed", label: { tr: "Hız", en: "Speed" }, value: null, max: 10 },
      {
        key: "endurance",
        label: { tr: "Dayanıklılık", en: "Endurance" },
        value: null,
        max: 10,
      },
      {
        key: "energy",
        label: { tr: "Lanet enerjisi", en: "Cursed energy" },
        value: null,
        max: 10,
      },
    ],
    silhouette: "unknown",
    imageKey: PND_IMAGE_KEYS.coreTriangle,
  },
];

/**
 * Çekirdek güvertesinin bütün metinleri.
 *
 * ⚠️ `{ad}` ve `{sayi}` yer tutucuları bileşende `replace` ile dolduruluyor.
 * İstemci adasına yalnızca hazır DÜZ DİZE iniyor.
 */
export const PND_CORE_UI = {
  deckLabel: { tr: "Üç çekirdek — seçim tüketir", en: "Three cores — choosing consumes" },
  ignite: { tr: "Bu çekirdeği yak", en: "Burn this core" },
  reopen: { tr: "Kaydı yeniden aç", en: "Reopen the record" },
  intactBadge: { tr: "dokunulmamış", en: "intact" },
  spentBadge: { tr: "tükendi", en: "spent" },
  liveBadge: { tr: "yanıyor", en: "burning" },
  spentHelp: {
    tr: "Bu çekirdek tükendi. Kaydı okunabilir ama bir daha yakılamaz.",
    en: "This core is spent. Its record stays readable but it cannot be burned again.",
  },
  remaining: { tr: "Kalan çekirdek", en: "Cores remaining" },
  statsTitle: { tr: "Çekirdek okuması", en: "Core reading" },
  statsNote: {
    tr: "Çubuklar arşivin göreli okuması; künye sayısal bir ölçüm vermiyor.",
    en: "The bars are the archive's relative reading; the record gives no numeric measurement.",
  },
  unmeasured: { tr: "ölçülemiyor", en: "unmeasured" },
  silhouetteLabel: { tr: "Gövde silueti", en: "Body silhouette" },
  idleHint: {
    tr: "Üç sütun da dokunulmamış. Birini seçtiğin anda o çekirdek tükenmeye başlıyor.",
    en: "All three columns are intact. The moment you pick one, that core starts being spent.",
  },
  announceIgnite: {
    tr: "{ad} çekirdeği yakıldı ve tükendi. Kalan çekirdek: {sayi}.",
    en: "The {ad} core was burned and is now spent. Cores remaining: {sayi}.",
  },
  announceReopen: {
    tr: "{ad} çekirdeğinin kaydı yeniden açıldı. Bu çekirdek tükenmiş durumda.",
    en: "The record of the {ad} core is open again. This core is spent.",
  },
  announceLocked: {
    tr: "Üç çekirdek de tükendi. Sayfa kilitlendi; bütün metin okunabilir durumda kalıyor.",
    en: "All three cores are spent. The page is locked; all text remains readable.",
  },
  lockedTitle: { tr: "Üç kere ölebilirim", en: "I can die three times" },
  lockedNative: "核",
  lockedBody: {
    tr: "Bir çekirdeği yok edilirse Panda ölmüyor — o çekirdeği kalıcı olarak kaybediyor. Üç çekirdek, üç yaşam, tek gövde. Şaka yapan sınıf arkadaşının altındaki aritmetik bu: elinde üç tane var ve hiçbiri geri gelmiyor.",
    en: "If a core is destroyed Panda does not die — he permanently loses that core. Three cores, three lives, one body. This is the arithmetic beneath the classmate who cracks jokes: he holds three, and not one of them comes back.",
  },
  lockedNote: {
    tr: "Bu sayfada da geri gelmiyorlar: üç sütun sayfa yenilenene dek kilitli kalır. Metnin tamamı okunabilir durumda — kilit görsel ve etkileşimsel, içerik değil.",
    en: "They do not come back here either: the three columns stay locked until the page is reloaded. All the text remains readable — the lock is visual and interactive, not editorial.",
  },
} as const;

/* ═══════════════════════════════════════════════════════════════════════
   KADER ÇİZELGESİ — beş durak
   ═══════════════════════════════════════════════════════════════════════ */

export interface PandaStop {
  key: string;
  /** Yaş DEĞİL: bir ceset yaşlanmaz. Durağın kendi damgası. */
  stamp: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  /** ⚠️ DİYALOG DEĞİL — künyede geçen doğrulanmış terim/ad. */
  record: {
    text: string;
    reading: LocalizedText;
    source: LocalizedText;
  };
  imageKey: string;
  column: 1 | 2 | 3;
}

export const PND_TIMELINE: PandaStop[] = [
  {
    key: "workshop",
    stamp: { tr: "Atölye", en: "The workshop" },
    title: { tr: "Yapılıyor", en: "Being made" },
    text: {
      tr: "Panda bir doğumla değil bir imalatla başlıyor. Onu Tokyo Jujutsu Lisesi'nin müdürü Masamichi Yaga yapıyor; künye onu doğrudan Yaga'nın en iyi yapıtı olarak kaydediyor. Sayfanın ilk sütunu bu yüzden gövdeyle açılıyor: önce malzeme var, sonra kişi.",
      en: "Panda begins not with a birth but with a build. He is made by Masamichi Yaga, principal of Tokyo Jujutsu High; the record files him outright as Yaga's finest creation. That is why this page's first column opens with the body: material first, person after.",
    },
    record: {
      text: "夜蛾正道",
      reading: { tr: "Masamichi Yaga — onu yapan", en: "Masamichi Yaga — the one who made him" },
      source: {
        tr: "AniList künyesi, karakter 137974 (bağlantılı ad)",
        en: "AniList record, character 137974 (linked name)",
      },
    },
    imageKey: PND_IMAGE_KEYS.fateWorkshop,
    column: 1,
  },
  {
    key: "sentience",
    stamp: { tr: "İlk söz", en: "First word" },
    title: { tr: "Konuşuyor", en: "He speaks" },
    text: {
      tr: "Lanetli cesetler işlev taşır, kişilik değil. Panda'nın kaydı bu kuralı tek satırda deviriyor: bilinç sahibi. Mutasyona uğramış bir ceset, yani kendi başına düşünen bir alet — ve bu andan sonra ona alet demek zorlaşıyor.",
      en: "Cursed corpses carry function, not personality. Panda's file overturns that in one line: he is sentient. A metamorphosed corpse, a tool that thinks for itself — and after this moment calling him a tool gets difficult.",
    },
    record: {
      text: "呪骸",
      reading: { tr: "jugai — lanetli ceset", en: "jugai — cursed corpse" },
      source: {
        tr: "AniList künyesi: “__Species:__ Cursed Corpse”",
        en: "AniList record: “__Species:__ Cursed Corpse”",
      },
    },
    imageKey: PND_IMAGE_KEYS.fateSentience,
    column: 2,
  },
  {
    key: "class",
    stamp: { tr: "İkinci sınıf", en: "Second year" },
    title: { tr: "Üç kişilik sınıf", en: "A class of three" },
    text: {
      tr: "Tokyo kanadının ikinci sınıfı üç kişi: Panda, Maki Zen'in ve Toge Inumaki. Üçü de kendi yolunda kural dışı — biri lanet enerjisiz, biri yalnızca pirinç topu malzemesiyle konuşuyor, biri zaten ölü. Panda bu üçlünün dengesi.",
      en: "The Tokyo wing's second year is three people: Panda, Maki Zen'in and Toge Inumaki. All three are exceptions in their own way — one without cursed energy, one who speaks only in rice-ball fillings, one already dead. Panda is the balance of that trio.",
    },
    record: {
      text: "呪術高専",
      reading: { tr: "jujutsu kōsen — Jujutsu Lisesi", en: "jujutsu kōsen — Jujutsu High" },
      source: {
        tr: "AniList künyesi: “__Affiliation:__ Jujutsu High”",
        en: "AniList record: “__Affiliation:__ Jujutsu High”",
      },
    },
    imageKey: PND_IMAGE_KEYS.fateClass,
    column: 3,
  },
  {
    key: "gorilla",
    stamp: { tr: "Çekirdek değişimi", en: "The core swap" },
    title: { tr: "İçeride başkası var", en: "There is someone else inside" },
    text: {
      tr: "Kayıttaki tek açık çekirdek değişimi: ağabeyin çekirdeği devreye giriyor, gövde genişliyor, ses değişiyor. O ana kadar Panda tek bir tuhaflıktı; o andan sonra üç kişilik bir gövde. Sayfanın ilk sütunu tam olarak bunun için var.",
      en: "The one core swap the record makes explicit: the eldest brother's core takes over, the body broadens, the voice changes. Until then Panda was a single oddity; after it, a body of three. This page's first column exists exactly for that.",
    },
    record: {
      text: "ゴリラ",
      reading: { tr: "Gorilla — ağabeyin çekirdeği", en: "Gorilla — the eldest brother's core" },
      source: {
        tr: "AniList künyesi: “the eldest brother ‘Gorilla’”",
        en: "AniList record: “the eldest brother ‘Gorilla’”",
      },
    },
    imageKey: PND_IMAGE_KEYS.fateGorilla,
    column: 1,
  },
  {
    key: "cost",
    stamp: { tr: "Bedel", en: "The cost" },
    title: { tr: "Üç kere kaybedilebilir", en: "He can be lost three times" },
    text: {
      tr: "Bir çekirdek yok edilirse Panda ölmüyor — ama o çekirdeği kalıcı kaybediyor. Yani gövde ayakta kalırken içindeki biri gidiyor. Sayfanın mekaniği bu cümlenin kendisi: yaktığın sütun geri gelmiyor, üçü de bitince kilit kapanıyor.",
      en: "If a core is destroyed Panda does not die — but he loses that core for good. The body stays standing while someone inside it leaves. This page's mechanic is that sentence itself: the column you burn does not return, and when all three are gone the lock closes.",
    },
    record: {
      text: "核",
      reading: { tr: "kaku — çekirdek", en: "kaku — core" },
      source: {
        tr: "AniList künyesi: “three cores inside the doll body”",
        en: "AniList record: “three cores inside the doll body”",
      },
    },
    imageKey: PND_IMAGE_KEYS.fateCost,
    column: 3,
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   BAĞLAR
   ═══════════════════════════════════════════════════════════════════════ */

export interface PandaBond {
  characterId: number;
  name: string;
  native: string;
  role: LocalizedText;
  line: LocalizedText;
  column: 1 | 2 | 3;
}

/**
 * ⚠️ Bu dört numara `EXPERIENCE_COMPANIONS[137974]` kaydıyla BİREBİR aynı
 * (134167 · 129571 · 127691 · 127212). Listede olmayan bir numarayı çizmek,
 * portresi arşive girdiğinde bile kadrajı sonsuza kadar boş bırakır
 * (Dalga 1'de Armin↔Levi emsali).
 */
export const PND_BONDS: PandaBond[] = [
  {
    characterId: 134167,
    name: "Maki Zen'in",
    native: "禪院真希",
    role: { tr: "Sınıf arkadaşı", en: "Classmate" },
    line: {
      tr: "Aynı sınıfın iki kural dışı hâli: birinin lanet enerjisi yok, ötekinin bedeni canlı değil. İkisi de gövdeyle dövüşüyor.",
      en: "The same classroom's two exceptions: one has no cursed energy, the other has no living body. Both fight with the body itself.",
    },
    column: 1,
  },
  {
    characterId: 129571,
    name: "Yūta Okkotsu",
    native: "乙骨憂太",
    role: { tr: "Okul arkadaşı", en: "Schoolmate" },
    line: {
      tr: "Tokyo kanadının öteki tuhaflığı. Panda'nın içinde üç kişi var; Yūta'nın yanında bir tane.",
      en: "The Tokyo wing's other oddity. Panda has three people inside him; Yūta has one beside him.",
    },
    column: 2,
  },
  {
    characterId: 127691,
    name: "Satoru Gojō",
    native: "五条悟",
    role: { tr: "Öğretmen", en: "Teacher" },
    line: {
      tr: "Okulun en güçlü adı ve Panda'nın sınıfının sorumlusu. Panda ona karşı bir alet değil, bir öğrenci.",
      en: "The school's strongest name and the one responsible for Panda's class. To him Panda is not a tool but a student.",
    },
    column: 3,
  },
  {
    characterId: 127212,
    name: "Yūji Itadori",
    native: "虎杖悠仁",
    role: { tr: "Birinci sınıf", en: "First-year" },
    line: {
      tr: "İçinde başka biri taşıyan öteki öğrenci. Yūji'nin taşıdığı şey ona ait değil; Panda'nın taşıdıkları kardeşleri.",
      en: "The other student carrying someone else inside. What Yūji carries is not his; what Panda carries are his siblings.",
    },
    column: 1,
  },
];

/**
 * Kayıtta adı geçen ama arşivde numarası OLMAYAN adlar.
 * Bağlantı kurulmuyor, portre aranmıyor — düz ad.
 */
export const PND_UNLISTED = {
  title: { tr: "Numarası olmayan adlar", en: "Names without a number" },
  note: {
    tr: "Bu ikisi kayıtta geçiyor ama arşivde karakter numaraları yok; bağlantı kurulmadı.",
    en: "These two appear in the record but have no character number in the archive; no link was made.",
  },
  people: [
    {
      name: "Masamichi Yaga",
      native: "夜蛾正道",
      role: { tr: "Onu yapan", en: "The one who made him" },
    },
    {
      name: "Toge Inumaki",
      native: "狗巻棘",
      role: { tr: "Sınıf arkadaşı", en: "Classmate" },
    },
  ],
} as const;

/** Lanetli Arşiv'in çapaları — `lib/anime/jjk/anchors.ts` defterinden. */
export const PND_WORLD_LINKS = [
  {
    anchor: "society",
    label: { tr: "Jujutsu Lisesi düzeni", en: "The Jujutsu High order" },
    note: {
      tr: "Panda'nın kayıtlı olduğu okul ve sınıf yapısı.",
      en: "The school and class structure Panda is enrolled in.",
    },
  },
  {
    anchor: "grades",
    label: { tr: "Dereceler", en: "The grades" },
    note: {
      tr: "İkinci derecenin ne ölçtüğü — Panda'nın künyesindeki tek sayı.",
      en: "What grade 2 measures — the only number in Panda's file.",
    },
  },
  {
    anchor: "energy",
    label: { tr: "Lanet enerjisi", en: "Cursed energy" },
    note: {
      tr: "Cesedi yürüten yakıt; Panda'da tekniğe hiç dönüşmüyor.",
      en: "The fuel that drives the corpse; in Panda it never becomes a technique.",
    },
  },
  {
    anchor: "spirits",
    label: { tr: "Lanetli ruhlar", en: "Cursed spirits" },
    note: {
      tr: "Karşı taraf — lanetten doğanlar ile lanetten YAPILANLAR arasındaki fark.",
      en: "The other side — the difference between born of curse and built from curse.",
    },
  },
] as const;

/* ═══════════════════════════════════════════════════════════════════════
   KAPANIŞ
   ═══════════════════════════════════════════════════════════════════════ */

export const PND_CLOSING = {
  lines: [
    {
      text: "パンダ",
      reading: { tr: "Panda — adın kendisi", en: "Panda — the name itself" },
      note: {
        tr: "Künyedeki ad bir takma ad değil: gövdenin türü, mesleği ve adı aynı kelime. Bir lanetli cesedin kimliği tam olarak bu kadar.",
        en: "The name in the record is not a nickname: the body's species, occupation and name are one word. A cursed corpse's identity is exactly this wide.",
      },
      by: { tr: "AniList künyesi · karakter 137974", en: "AniList record · character 137974" },
    },
    {
      text: "兄・弟・姉",
      reading: {
        tr: "ağabey · kardeş · abla — üç çekirdeğin üçü",
        en: "elder brother · younger brother · sister — all three cores",
      },
      note: {
        tr: "Künyenin üç çekirdeği saydığı sıra bu. Üçü de bir gövdede, üçü de ayrı ayrı kaybedilebilir.",
        en: "This is the order in which the record counts the three cores. All three in one body, and all three losable one at a time.",
      },
      by: {
        tr: "AniList künyesi: “the youngest brother ‘Panda’, the eldest brother ‘Gorilla’ and a sister”",
        en: "AniList record: “the youngest brother ‘Panda’, the eldest brother ‘Gorilla’ and a sister”",
      },
    },
  ],
  quoteDiscipline: {
    tr: "⚠️ Bu sayfada hiçbir diyalog tırnağa alınmadı. Panda'nın doğrulanabilir Japonca replik kaydı bu turda elde edilemedi; uydurulmuş bir cümleyi tırnak içinde göstermek kanon hatası olurdu. Tırnağa alınan her şey künyede geçen bir terim ya da adın kendisi ve kaynağı altında yazılı.",
    en: "⚠️ No dialogue is quoted on this page. No verifiable Japanese line for Panda could be obtained this round; presenting an invented sentence in quotation marks would be a canon error. Everything quoted here is a term or a name from the record, with its source written underneath.",
  },
  motto: "三つの核",
  mottoReading: {
    tr: "mittsu no kaku — üç çekirdek",
    en: "mittsu no kaku — three cores",
  },
  mottoNote: {
    tr: "Künyedeki İngilizce satırın karşılığı (“three cores inside the doll body”). Kanon bir slogan değil, arşivin okuması.",
    en: "The rendering of the record's English line (“three cores inside the doll body”). Not a canon slogan — the archive's reading.",
  },
  credit: {
    tr: "Künye ve portre kaynağı: AniList, karakter 137974 —",
    en: "Record and portrait source: AniList, character 137974 —",
  },
  creditLink: {
    tr: "anilist.co/character/137974",
    en: "anilist.co/character/137974",
  },
  creditNote: {
    tr: "Portre `public/assets/anime/karakterler/panda/anilist-portrait.jpg` olarak repoda duruyor (230×335); çekimin künyesi aynı klasördeki `kaynak.json` dosyasında. Sayfadaki bütün desen, halka ve siluet çizimleri elle yazılmış SVG — dışarıdan raster indirilmedi, hotlink kullanılmadı.",
    en: "The portrait lives in the repo as `public/assets/anime/karakterler/panda/anilist-portrait.jpg` (230×335); the capture's metadata is in `kaynak.json` in the same folder. Every pattern, ring and silhouette drawing on this page is hand-written SVG — no raster was downloaded and no hotlink is used.",
  },
} as const;

/** Küratör boşluk özeti — sayfanın en altında, düzenleyicisiz. */
export const PND_GAPS = {
  title: { tr: "Panda · boş kadrajlar", en: "Panda · empty frames" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bütün kadrajlar dolu — sayfada boş yuva kalmadı.",
    en: "Every frame is filled — no empty slot left on the page.",
  },
} as const;
