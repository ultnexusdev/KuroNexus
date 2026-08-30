import type { LocalizedText } from "./types";

/**
 * Levi (Ackerman) — "Kesinlik" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Bileşen bu dosyadan okuyup `pick(text, locale)` ile seçiyor; istemci
 * adalarına yalnızca düz dize iniyor.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * KAPASİTE VE UNUTMA. Levi'nin sayfası dalganın en az öğe taşıyanı: dar tek
 * kolon, kutu yok, kart yok — yalnız çizgi ve cümle. Sayfanın kalbi de bir
 * kapasite tezgâhı: aynı anda en fazla ÜÇ şey taşınabiliyor, dördüncü
 * geldiğinde en eskisi düşüyor ve düşerken cümlesini de götürüyor. Geriye
 * yalnızca adı kalıyor.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (25 Aralık), kan grubu (A), boy (160 cm) ve unvanların tamamı
 * AniList künyesinden birebir alındı (karakter 45627, 30 Ağustos 2026;
 * `public/assets/anime/karakterler/levi/kaynak.json` aynı çekimin kopyası).
 *
 * ⚠️ YAŞ YOK. AniList kaydında `age` boş ve seri de Levi'nin yaşını hiç
 * vermiyor. Künye şeridinde bu bir eksiklik olarak DEĞİL, bir satır olarak
 * duruyor — uydurulmuş bir sayı yazmaktansa boşluğu göstermek bu sayfanın
 * zaten konusu.
 *
 * ── KRONOLOJİ ────────────────────────────────────────────────────────────
 * Serinin kendi takvimi kullanıldı: 845 (Shiganshina'nın düşüşü), 850
 * (57. Sefer, ayaklanma ve Shiganshina'nın geri alınışı aynı yıl), 854
 * (Marley baskını ve sonrası). Yeraltı yılları ve Levi'nin Keşif Birliği'ne
 * alınışı takvimde sabit bir yıla bağlanmadığı için yıl YAZILMADI; o iki
 * durak dönem adıyla anılıyor.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada tırnak içinde YALNIZCA iki cümle var:
 *   「悔いが残らない方を自分で選べ」 — Eren'e, 57. Sefer'den önce
 *   「ゆっくり休め」               — Erwin'e, Shiganshina'da
 * İkisi de kaynağıyla anılıyor. Emin olunmayan hiçbir cümle tırnağa
 * alınmadı; geri kalan her şey anlatı sesiyle yazıldı.
 *
 * ── TERMİNOLOJİ ──────────────────────────────────────────────────────────
 * 立体機動装置 (rittai kidō sōchi — üç boyutlu manevra donanımı),
 * うなじ (unaji — ense, tek geçerli hedef), 超硬質ブレード (chōkōshitsu
 * burēdo — ultra sert ağız), 雷槍 (raisō — yıldırım mızrağı),
 * 対人立体機動装置 (taijin rittai kidō sōchi — insana karşı donanım),
 * 特別作戦班 (tokubetsu sakusen han — özel harekât müfrezesi),
 * 調査兵団 (chōsa heidan — Keşif Birliği), 兵士長 (heishichō — rütbesi),
 * 悔いなき選択 (kuinaki sentaku — pişmanlıksız seçim).
 * Türkçe karşılıklar arşivin kendi sözlüğünden.
 */

export const LEVI_ID = 45627;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const LEVI_SITE_URL = "https://anilist.co/character/45627";

/**
 * Depodaki resmî portre (Faz 2 kararı: hotlink yok, kare repoda).
 *
 * ⚠️ 230×345 — yani KÜÇÜK. Sayfada yalnızca dar bir madalyon kadrajında
 * kullanılıyor; büyük hero karesi küratör yuvası olarak boş bırakıldı.
 * Kendi kaynağımız olduğu için `next/image`de `unoptimized` YOK.
 */
export const LEVI_PORTRAIT = {
  src: "/assets/anime/karakterler/levi/anilist-portrait.png",
  w: 230,
  h: 345,
} as const;

/**
 * Sergi görselleri — hepsi characterId 45627 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `lvi:` önekli (küratör modu şartı).
 */
export const LEVI_IMAGE_KEYS = {
  hero: "lvi:hero",
  gearOdm: "lvi:rittai-kido",
  gearNape: "lvi:unaji",
  gearBlood: "lvi:ackerman",
  kitBlade: "lvi:blade",
  kitSpear: "lvi:raiso",
  kitAntiPersonnel: "lvi:taijin",
  kitSquad: "lvi:sakusen-han",
  voidScene: "lvi:choice",
  fateUnderground: "lvi:fate-chikagai",
  fateSurface: "lvi:fate-surface",
  fateExpedition: "lvi:fate-850",
  fateShiganshina: "lvi:fate-shiganshina",
  fateAfter: "lvi:fate-854",
  closing: "lvi:closing",
} as const;

/** Küratör yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const LEVI_SLOT_LABELS: Record<string, LocalizedText> = {
  [LEVI_IMAGE_KEYS.hero]: {
    tr: "Hero — dikey portre, tam boy, sade zemin (3:4)",
    en: "Hero — vertical portrait, full figure, plain ground (3:4)",
  },
  [LEVI_IMAGE_KEYS.gearOdm]: {
    tr: "Manevra donanımı — kanca ve tel, havada dönüş (16:9)",
    en: "ODM gear — anchor and wire, a spin in mid-air (16:9)",
  },
  [LEVI_IMAGE_KEYS.gearNape]: {
    tr: "Ense — kesilen şeridin yakın çekimi (16:9)",
    en: "The nape — close crop of the strip that gets cut (16:9)",
  },
  [LEVI_IMAGE_KEYS.gearBlood]: {
    tr: "Uyanış — Ackerman kanının açıldığı an (16:9)",
    en: "Awakening — the moment the Ackerman blood opens (16:9)",
  },
  [LEVI_IMAGE_KEYS.kitBlade]: {
    tr: "Ağızlar — kırılmış ve değiştirilmiş bıçaklar (3:2)",
    en: "Blades — chipped and replaced edges (3:2)",
  },
  [LEVI_IMAGE_KEYS.kitSpear]: {
    tr: "Yıldırım mızrağı — patlamadan önceki an (3:2)",
    en: "Thunder spear — the instant before detonation (3:2)",
  },
  [LEVI_IMAGE_KEYS.kitAntiPersonnel]: {
    tr: "İnsana karşı donanım — dar koridor, tavan kancası (3:2)",
    en: "Anti-personnel gear — a narrow corridor, a ceiling anchor (3:2)",
  },
  [LEVI_IMAGE_KEYS.kitSquad]: {
    tr: "Özel harekât müfrezesi — dört asker, tek kadraj (3:2)",
    en: "Special Operations Squad — four soldiers, one frame (3:2)",
  },
  [LEVI_IMAGE_KEYS.voidScene]: {
    tr: "Seçim — iki yol, tek şırınga; karar anı (16:9)",
    en: "The choice — two paths, one syringe; the moment of decision (16:9)",
  },
  [LEVI_IMAGE_KEYS.fateUnderground]: {
    tr: "Yeraltı şehri — tavandan sızan tek ışık (3:2)",
    en: "The Underground — the single shaft of light from the ceiling (3:2)",
  },
  [LEVI_IMAGE_KEYS.fateSurface]: {
    tr: "Yüzey — ilk kez açık gökyüzü, yağmur (3:2)",
    en: "The surface — open sky for the first time, rain (3:2)",
  },
  [LEVI_IMAGE_KEYS.fateExpedition]: {
    tr: "57. Sefer — ormanda dev ağaçlar, boş eyerler (3:2)",
    en: "The 57th expedition — giant trees, empty saddles (3:2)",
  },
  [LEVI_IMAGE_KEYS.fateShiganshina]: {
    tr: "Shiganshina — duvarın dibinde iki yaralı, bir şırınga (3:2)",
    en: "Shiganshina — two wounded at the wall, one syringe (3:2)",
  },
  [LEVI_IMAGE_KEYS.fateAfter]: {
    tr: "Sonrası — sargılı el, kapalı sağ göz (3:2)",
    en: "After — a bandaged hand, a closed right eye (3:2)",
  },
  [LEVI_IMAGE_KEYS.closing]: {
    tr: "Kapanış — geniş bant, boş bir manzara, düşük kontrast (8:3)",
    en: "Closing — wide band, an empty landscape, low contrast (8:3)",
  },
};

/** `CuratorGaps` satırlarındaki teknik künye — tip + ölçü + biçim. */
export const LEVI_SLOT_SPECS: Record<string, LocalizedText> = {
  [LEVI_IMAGE_KEYS.hero]: {
    tr: "dikey kadraj · 1200×1600 · webp",
    en: "vertical frame · 1200×1600 · webp",
  },
  [LEVI_IMAGE_KEYS.gearOdm]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [LEVI_IMAGE_KEYS.gearNape]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [LEVI_IMAGE_KEYS.gearBlood]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [LEVI_IMAGE_KEYS.kitBlade]: {
    tr: "küçük kadraj · 900×600 · webp",
    en: "small frame · 900×600 · webp",
  },
  [LEVI_IMAGE_KEYS.kitSpear]: {
    tr: "küçük kadraj · 900×600 · webp",
    en: "small frame · 900×600 · webp",
  },
  [LEVI_IMAGE_KEYS.kitAntiPersonnel]: {
    tr: "küçük kadraj · 900×600 · webp",
    en: "small frame · 900×600 · webp",
  },
  [LEVI_IMAGE_KEYS.kitSquad]: {
    tr: "küçük kadraj · 900×600 · webp",
    en: "small frame · 900×600 · webp",
  },
  [LEVI_IMAGE_KEYS.voidScene]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [LEVI_IMAGE_KEYS.fateUnderground]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [LEVI_IMAGE_KEYS.fateSurface]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [LEVI_IMAGE_KEYS.fateExpedition]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [LEVI_IMAGE_KEYS.fateShiganshina]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [LEVI_IMAGE_KEYS.fateAfter]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [LEVI_IMAGE_KEYS.closing]: {
    tr: "bant · 1920×720 · webp",
    en: "band · 1920×720 · webp",
  },
};

/** `CuratorSlot`a geçen önerilen piksel ölçüleri. */
export const LEVI_SLOT_SIZES: Record<string, { w: number; h: number }> = {
  [LEVI_IMAGE_KEYS.hero]: { w: 1200, h: 1600 },
  [LEVI_IMAGE_KEYS.gearOdm]: { w: 1600, h: 900 },
  [LEVI_IMAGE_KEYS.gearNape]: { w: 1600, h: 900 },
  [LEVI_IMAGE_KEYS.gearBlood]: { w: 1600, h: 900 },
  [LEVI_IMAGE_KEYS.kitBlade]: { w: 900, h: 600 },
  [LEVI_IMAGE_KEYS.kitSpear]: { w: 900, h: 600 },
  [LEVI_IMAGE_KEYS.kitAntiPersonnel]: { w: 900, h: 600 },
  [LEVI_IMAGE_KEYS.kitSquad]: { w: 900, h: 600 },
  [LEVI_IMAGE_KEYS.voidScene]: { w: 1600, h: 900 },
  [LEVI_IMAGE_KEYS.fateUnderground]: { w: 1200, h: 800 },
  [LEVI_IMAGE_KEYS.fateSurface]: { w: 1200, h: 800 },
  [LEVI_IMAGE_KEYS.fateExpedition]: { w: 1200, h: 800 },
  [LEVI_IMAGE_KEYS.fateShiganshina]: { w: 1200, h: 800 },
  [LEVI_IMAGE_KEYS.fateAfter]: { w: 1200, h: 800 },
  [LEVI_IMAGE_KEYS.closing]: { w: 1920, h: 720 },
};

/**
 * Yüklenen kadrajların `alt` metninin başı (FAZ 2 §3: her alt kaynağını
 * söylüyor). Devamına o yuvanın etiketi ekleniyor.
 */
export const LEVI_ALT = {
  scenePrefix: {
    tr: "Levi Ackerman — arşive yüklenmiş kare:",
    en: "Levi Ackerman — frame uploaded to the archive:",
  },
} as const;

/** Boş kadrajın içine yazılan tek satır — küratör modu kapalıyken de görünür. */
export const LEVI_FRAME_EMPTY: LocalizedText = {
  tr: "boş kadraj",
  en: "empty frame",
};

/** Portre yuvasının etiketi (ABILITY değil, PORTRAIT). */
export const LEVI_PORTRAIT_SLOT: LocalizedText = {
  tr: "Portre — dikey, tam boy, 1200×1600'e kadar",
  en: "Portrait — vertical, full figure, up to 1200×1600",
};

export const LEVI_CRUMB = {
  series: {
    tr: "Attack on Titan · Keşif Birliği",
    en: "Attack on Titan · Survey Corps",
  },
} as const;

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const LEVI_IDENTITY = {
  name: "Levi",
  nativeName: "リヴァイ",
  /** AniList'teki takma adlardan biri; unvan olarak kullanılıyor */
  title: "人類最強の兵士",
  titleReading: {
    tr: "Jinrui saikyō no heishi — insanlığın en güçlü askeri",
    en: "Jinrui saikyō no heishi — humanity’s strongest soldier",
  },
  house: {
    tr: "Keşif Birliği · Özel Harekât Müfrezesi",
    en: "Survey Corps · Special Operations Squad",
  },
  epigraph: {
    tr: "Doğru seçimin hangisi olduğunu kimse bilmiyor. Bilinen tek şey elde ne kadar yer kaldığı.",
    en: "Nobody knows which choice is the right one. The only known quantity is how much room is left in your hands.",
  },
  facts: [
    {
      label: { tr: "Doğum günü", en: "Birthday" },
      value: { tr: "25 Aralık", en: "25 December" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "160 cm", en: "160 cm" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "A", en: "A" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: {
        tr: "Verilmedi — künyede boş bırakılmış",
        en: "Not given — the dossier leaves it blank",
      },
    },
    {
      label: { tr: "Rütbe", en: "Rank" },
      value: {
        tr: "兵士長 (heishichō) · müfreze yüzbaşısı",
        en: "兵士長 (heishichō) · squad captain",
      },
    },
    {
      label: { tr: "Birlik", en: "Corps" },
      value: {
        tr: "調査兵団 · Keşif Birliği, 特別作戦班",
        en: "調査兵団 · Survey Corps, 特別作戦班",
      },
    },
    {
      label: { tr: "Selam", en: "Salute" },
      value: {
        tr: "心臓を捧げよ — kalbini ada",
        en: "心臓を捧げよ — devote your heart",
      },
    },
    {
      label: { tr: "Sembolik obje", en: "Symbolic object" },
      value: {
        tr: "Kenarından tutulan çay fincanı",
        en: "A teacup held by the rim",
      },
    },
  ],
} as const;

export const LEVI_HERO = {
  lede: {
    tr: "Bu sayfa neredeyse boş. Levi'nin taşıdığı şey de öyle sayılabilir: elinde her zaman yer var, ama hiçbir zaman üçten fazlası için değil.",
    en: "This page is almost empty. So is what Levi carries: there is always room in his hands, and never room for more than three things.",
  },
  portraitAlt: {
    tr: "Levi Ackerman — AniList resmî portresi",
    en: "Levi Ackerman — official AniList portrait",
  },
  portraitAltUploaded: {
    tr: "Levi Ackerman — arşive yüklenmiş portre",
    en: "Levi Ackerman — portrait uploaded to the archive",
  },
  heroCaption: {
    tr: "Bu kadraj boş. Doldurulana kadar da boş kalacak — sayfanın kuralı bu.",
    en: "This frame is empty. It stays empty until it is filled — that is the rule of this page.",
  },
} as const;

/* ── Mod düğmesi: pişmanlıksız seçim ────────────────────────────────────── */

/**
 * 悔いなき選択 (kuinaki sentaku) — Levi'nin yan hikâyesinin adı ve bu
 * sayfanın modu. Açıldığında sayfadaki İKİNCİ DERECEDEN her şey kalkıyor:
 * okunuşlar, etiket şeritleri, yardımcı cümleler, boş kadrajlar ve
 * filigran. Geriye yalnız çekirdek cümleler kalıyor.
 */
export const LEVI_CLEAN = {
  title: { tr: "Pişmanlıksız seçim", en: "A choice with no regrets" },
  native: "悔いなき選択",
  enter: {
    tr: "İkinci dereceyi at",
    en: "Discard the second order",
  },
  exit: {
    tr: "İkinci dereceyi geri getir",
    en: "Bring the second order back",
  },
  hintOff: {
    tr: "Sayfa şu anda her şeyi taşıyor: okunuşlar, etiketler, boş kadrajlar, filigran.",
    en: "Right now the page carries everything: readings, labels, empty frames, the watermark.",
  },
  hintOn: {
    tr: "İkinci dereceden her şey atıldı. Kalan cümleler çekirdek — geri getirmek de bir seçim.",
    en: "Everything of the second order has been discarded. What is left is the core — bringing it back is also a choice.",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const LEVI_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "Dossier" },
    lede: {
      tr: "Sekiz satır. Biri boş, ve o boşluk düzeltilmiyor.",
      en: "Eight lines. One of them is blank, and the blank is not corrected.",
    },
  },
  gear: {
    title: { tr: "Donanım", en: "Equipment" },
    lede: {
      tr: "Levi'nin hiçbir şeyi kendine ait değil: donanım herkeste aynı, ağızlar aynı fabrikadan, hedef aynı yer. Fark, aynı aletle yapılan işte.",
      en: "Nothing Levi uses is his own: the gear is the same for everyone, the blades come from the same forge, the target is the same spot. The difference is what gets done with the same tool.",
    },
  },
  kit: {
    title: { tr: "Dört ayrıntı", en: "Four details" },
    lede: {
      tr: "Dördü de sonlu: kırılıyor, bitiyor, tek kullanımlık ya da ölüyor.",
      en: "All four are finite: they chip, they run out, they are single-use, or they die.",
    },
  },
  voidStop: {
    title: { tr: "Boşluk", en: "The empty hand" },
    lede: {
      tr: "Aşağıdaki sekiz şeyin hepsi Levi'nin taşıdığı şeyler. Üçünden fazlası aynı anda taşınmıyor: dördüncüyü aldığında en eski olan düşüyor ve düşerken cümlesini de götürüyor. Geriye adı kalıyor.",
      en: "The eight things below are all things Levi carries. No more than three fit at once: take a fourth and the oldest falls, taking its sentence with it. Only the name remains.",
    },
  },
  fate: {
    title: { tr: "Beş durak", en: "Five stops" },
    lede: {
      tr: "Yeraltından başlıyor, yeraltına benzeyen bir sessizlikte bitiyor.",
      en: "It begins underground and ends in a silence that resembles the underground.",
    },
  },
  bonds: {
    title: { tr: "Bağlar", en: "Bonds" },
    lede: {
      tr: "Beş isim. Üçünün bu arşivde kendi dosyası var.",
      en: "Five names. Three of them have their own file in this archive.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "İki cümle. İkisi de bir emir değil, bir yöntem.",
      en: "Two sentences. Neither is an order; both are a method.",
    },
  },
} as const;

/* ── Donanım: üç büyük ──────────────────────────────────────────────────── */

export const LEVI_GEAR = [
  {
    key: "odm",
    name: "立体機動装置",
    reading: "Rittai kidō sōchi",
    turkish: {
      tr: "Üç boyutlu manevra donanımı",
      en: "Omni-directional mobility gear",
    },
    tagline: {
      tr: "Kanca, tel, gaz. Üçü de sonlu.",
      en: "Anchor, wire, gas. All three run out.",
    },
    text: {
      tr: "Bele takılan kutulardan iki kanca fırlıyor, basınçlı gaz makaraları sarıyor ve gövde tele asılı kalıyor. Donanım Keşif Birliği'ndeki herkeste aynı. Levi'yi ayıran şey ekipman değil, telin etrafında dönerek tek geçişte birden fazla kesik bırakması — ve gazın ne zaman biteceğini hiç şaşırmaması.",
      en: "Two anchors fire from the boxes at the waist, pressurised gas winds the reels in, and the body hangs from the wire. Every soldier in the Survey Corps carries the same rig. What separates Levi is not the equipment but the spin around the wire that leaves more than one cut in a single pass — and never being wrong about when the gas will run out.",
    },
    traits: [
      { tr: "Çift kanca", en: "Twin anchors" },
      { tr: "Basınçlı gaz", en: "Pressurised gas" },
      { tr: "Değişebilir ağız", en: "Replaceable edge" },
    ],
    imageKey: LEVI_IMAGE_KEYS.gearOdm,
  },
  {
    key: "nape",
    name: "うなじ",
    reading: "Unaji",
    turkish: { tr: "Ense", en: "The nape" },
    tagline: {
      tr: "Bir metre boyunda, on santim eninde. Başka yer yok.",
      en: "One metre long, ten centimetres wide. There is no other place.",
    },
    text: {
      tr: "Titan kesilen her yerini geri getiriyor: kol, bacak, yüz. Tek istisna ensedeki şerit — yaklaşık bir metre uzunluğunda, on santim eninde. Oradan kesilirse ölüyor, başka her yerden kesilirse yalnızca zaman kaybediliyor. Bu sayfanın bütün dilbilgisi o şeritten çıkıyor: tek yer, tek kesik, gerisi gürültü.",
      en: "A Titan restores everything you cut: arm, leg, face. The single exception is the strip at the nape — roughly one metre long and ten centimetres wide. Cut there and it dies; cut anywhere else and you have only spent time. The whole grammar of this page comes from that strip: one place, one cut, the rest is noise.",
    },
    traits: [
      { tr: "1 m × 10 cm", en: "1 m × 10 cm" },
      { tr: "Tek geçerli hedef", en: "The only valid target" },
      { tr: "Gerisi yenilenir", en: "Everything else regrows" },
    ],
    imageKey: LEVI_IMAGE_KEYS.gearNape,
  },
  {
    key: "blood",
    name: "アッカーマン",
    reading: "Akkāman",
    turkish: { tr: "Ackerman kanı", en: "Ackerman blood" },
    tagline: {
      tr: "Adı konmamış bir güç; Levi hiç açıklamıyor.",
      en: "An unnamed power; Levi never explains it.",
    },
    text: {
      tr: "Ackermanlar, Titan gücünün değiştirdiği ama Titan'a çevirmediği bir aile. Uyanış geldiğinde bedene hattın biriktirdiği dövüş bilgisi açılıyor — öğrenilmemiş bir ustalık, hazır gelmiş bir refleks. Levi bu şeye bir ad vermiyor, bir kere bile anlatmıyor; hikâye onu Levi'nin etrafında açıklıyor. Aynı kan Mikasa'da ve onu yetiştiren Kenny'de.",
      en: "The Ackermans are a family the Titan power altered without turning into Titans. When the awakening comes, the accumulated combat knowledge of the line opens into the body — a mastery never learned, a reflex that arrives ready-made. Levi gives this nothing, not a name, not one explanation; the story explains it around him. The same blood runs in Mikasa, and in Kenny, who raised him.",
    },
    traits: [
      { tr: "Aile hattı", en: "A family line" },
      { tr: "Uyanış anı", en: "The awakening" },
      { tr: "Titan gücü değil", en: "Not a Titan power" },
    ],
    imageKey: LEVI_IMAGE_KEYS.gearBlood,
  },
] as const;

/* ── Dört küçük ─────────────────────────────────────────────────────────── */

export const LEVI_KIT = [
  {
    key: "blade",
    name: "超硬質ブレード",
    reading: "Chōkōshitsu burēdo",
    turkish: { tr: "Ultra sert ağız", en: "Ultrahard blade" },
    note: {
      tr: "Birkaç kesikten sonra körelen, çentiklenen, atılıp yenisi takılan çift ağız. Hiçbiri sonuna kadar dayanmıyor; kalıcı olan yalnızca sap.",
      en: "A pair of edges that dull after a few cuts, chip, get thrown away and replaced. None of them lasts to the end; only the grip is permanent.",
    },
    imageKey: LEVI_IMAGE_KEYS.kitBlade,
  },
  {
    key: "spear",
    name: "雷槍",
    reading: "Raisō",
    turkish: { tr: "Yıldırım mızrağı", en: "Thunder spear" },
    note: {
      tr: "Zırhı kesilemeyen hedefler için geliştirilen patlayıcı mızrak. Tek kullanımlık: saplanıyor, çekiliyor, bitiyor.",
      en: "An explosive lance developed for targets whose armour cannot be cut. Single use: it lodges, it is pulled, it is spent.",
    },
    imageKey: LEVI_IMAGE_KEYS.kitSpear,
  },
  {
    key: "antipersonnel",
    name: "対人立体機動装置",
    reading: "Taijin rittai kidō sōchi",
    turkish: {
      tr: "İnsana karşı manevra donanımı",
      en: "Anti-personnel ODM gear",
    },
    note: {
      tr: "Dar iç mekânlarda, hedefi Titan olmayan bir donanım. Duvarların içinde geçen ayaklanmada karşı taraf da aynı aleti kullanıyordu.",
      en: "A rig for cramped interiors, where the target is not a Titan. In the uprising inside the walls the other side carried the same tool.",
    },
    imageKey: LEVI_IMAGE_KEYS.kitAntiPersonnel,
  },
  {
    key: "squad",
    name: "特別作戦班",
    reading: "Tokubetsu sakusen han",
    turkish: { tr: "Özel harekât müfrezesi", en: "Special Operations Squad" },
    note: {
      tr: "Levi'nin tek tek kendi seçtiği dört asker: Petra, Oluo, Eld, Gunther. Donanımın en pahalı parçası buydu ve bir öğleden sonrada tükendi.",
      en: "Four soldiers Levi picked one by one: Petra, Oluo, Eld, Gunther. This was the most expensive part of the equipment, and it was spent in a single afternoon.",
    },
    imageKey: LEVI_IMAGE_KEYS.kitSquad,
  },
] as const;

/* ── Sayfanın kalbi: kapasite tezgâhı ───────────────────────────────────── */

/**
 * Sekiz taşınabilir şey. Tezgâhın kapasitesi ÜÇ.
 *
 * `name` özel ad ya da Japonca terim (çevrilmiyor), `title` onun Türkçe/
 * İngilizce karşılığı, `line` ise yalnızca TAŞINIRKEN görünen cümle. Öğe
 * düştüğünde `line` kayboluyor ve geriye `name` kalıyor — mekanizmanın
 * bütün fikri bu.
 */
export const LEVI_VOID_ITEMS = [
  {
    key: "kuchel",
    name: "クシェル",
    title: { tr: "Annesi", en: "His mother" },
    line: {
      tr: "Yeraltında hastalıktan öldü. Levi cesedin yanından kimse gelene kadar ayrılmadı; o kimse de amcası çıktı.",
      en: "She died of illness underground. Levi did not leave the body until somebody came; the somebody turned out to be his uncle.",
    },
  },
  {
    key: "kenny",
    name: "ケニー",
    title: { tr: "Onu yetiştiren adam", en: "The man who raised him" },
    line: {
      tr: "Bıçağı ve hayatta kalmayı öğretti, bir sabah da hiçbir şey söylemeden gitti. Levi neden gittiğini yıllar sonra öğrendi.",
      en: "He taught him the blade and how to stay alive, then one morning left without a word. Levi learned the reason years later.",
    },
  },
  {
    key: "furlan",
    name: "ファーラン と イザベル",
    title: { tr: "Yeraltından iki arkadaş", en: "Two friends from below" },
    line: {
      tr: "Yüzeye onunla birlikte çıktılar. İlk seferde, yağmurun altında, ikisi de geri dönmedi.",
      en: "They came up to the surface with him. On the first expedition, in the rain, neither of them came back.",
    },
  },
  {
    key: "squad",
    name: "特別作戦班",
    title: { tr: "Kendi seçtiği dört asker", en: "The four he chose himself" },
    line: {
      tr: "Petra, Oluo, Eld, Gunther. Dördü de 57. Sefer'de, aynı ormanda, aynı Titan'ın elinde öldü.",
      en: "Petra, Oluo, Eld, Gunther. All four died on the 57th expedition, in the same forest, at the hands of the same Titan.",
    },
  },
  {
    key: "erwin",
    name: "エルヴィン",
    title: { tr: "Komutanı", en: "His commander" },
    line: {
      tr: "Elindeki tek serumu ona vermedi. Bu bir hata değildi ve bir doğru da değildi; yalnızca bir seçimdi ve Levi arkasında durdu.",
      en: "He did not give him the only syringe he had. It was not a mistake and it was not right; it was only a choice, and Levi stood behind it.",
    },
  },
  {
    key: "vow",
    name: "約束",
    title: { tr: "Verdiği söz", en: "The promise he gave" },
    line: {
      tr: "Canavar Titan'ı kendi eliyle bitirmek. Sözü verdiği adam onu tutmasını göremedi.",
      en: "To finish the Beast Titan with his own hands. The man he gave the promise to did not live to see it kept.",
    },
  },
  {
    key: "wounds",
    name: "右手と右目",
    title: { tr: "Sağ eli ve sağ gözü", en: "His right hand and right eye" },
    line: {
      tr: "Bir patlamadan sonra iki parmağı ve bir gözü yok. Bunu bir kayıp olarak anlatmıyor; kalan elle çalışıyor.",
      en: "After one detonation two fingers and one eye are gone. He does not narrate it as a loss; he works with the hand that remains.",
    },
  },
  {
    key: "clean",
    name: "掃除",
    title: { tr: "Temizlik", en: "Cleaning" },
    line: {
      tr: "Elinde kalan tek düzen. Seferden dönülünce aynı iş: toz alınır, zemin silinir, hiçbir şey düzelmez ama oda temiz olur.",
      en: "The only order still in his hands. The same work after every expedition: dust taken off, floor wiped, nothing repaired — but the room is clean.",
    },
  },
] as const;

export const LEVI_VOID_UI = {
  opening: {
    tr: "Şimdilik elde hiçbir şey yok.",
    en: "For now the hands are empty.",
  },
  capacityLabel: { tr: "Kapasite", en: "Capacity" },
  heldTitle: { tr: "Taşınan", en: "Held" },
  droppedTitle: { tr: "Düşen", en: "Dropped" },
  emptySlot: { tr: "boş", en: "empty" },
  droppedEmpty: {
    tr: "Henüz hiçbir şey düşmedi.",
    en: "Nothing has fallen yet.",
  },
  listTitle: { tr: "Alınabilecekler", en: "What can be picked up" },
  heldBadge: { tr: "elde", en: "in hand" },
  releaseHint: {
    tr: "Taşınan bir şeyin üstüne basmak onu elden bırakır.",
    en: "Pressing a held item puts it down.",
  },
  keyboardHint: {
    tr: "Listedeki her satır bir düğme: sekmeyle gezilir, boşluk ya da enter ile alınır.",
    en: "Every row in the list is a button: reach it with Tab, take it with Space or Enter.",
  },
  resetLabel: { tr: "Elleri boşalt", en: "Empty the hands" },
  statusTaken: {
    tr: "alındı.",
    en: "taken.",
  },
  statusDropped: {
    tr: "düştü ve cümlesi gitti.",
    en: "fell, and its sentence is gone.",
  },
  statusReleased: {
    tr: "elden bırakıldı.",
    en: "was put down.",
  },
  statusReset: {
    tr: "Eller boşaltıldı. Düşenlerin adı listede kalıyor.",
    en: "The hands were emptied. The names of the fallen stay on the list.",
  },
  closingLine: {
    tr: "Sekizini de gördün. Üçünü taşıyorsun. Aradaki fark Levi'nin bütün mesleği.",
    en: "You have seen all eight. You are carrying three. The difference between those numbers is Levi’s entire profession.",
  },
} as const;

/* ── Beş durak ──────────────────────────────────────────────────────────── */

/** Bir durakta anılan kişi. `characterId` arşivdeki dosyaya bağlanmak için. */
export interface LeviKin {
  characterId: number;
  name: string;
  role: LocalizedText;
}

/**
 * Bir durak.
 *
 * ⚠️ `quote.text` bilerek düz dize: Japonca alıntının kendisi bir çeviri
 * değil KAYNAK metin, iki dilde de aynı. Çevrilen şey `reading` (okunuşun
 * anlamı) ve `by` (kime/nerede söylendiği) — ikisi de `LocalizedText`.
 *
 * ⚠️ `stamp` "yaş etiketi" yerine geçiyor: Levi'nin yaşı hiçbir kaynakta
 * verilmiyor, o yüzden duraklar serinin kendi takvimiyle (850, 854) ve
 * dönem adlarıyla işaretlendi. Uydurulmuş bir yaş yazılmadı.
 */
export interface LeviStop {
  key: string;
  stamp: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: string; reading: LocalizedText; by: LocalizedText };
  kin: LeviKin | null;
  imageKey: string;
}

export const LEVI_TIMELINE: LeviStop[] = [
  {
    key: "underground",
    stamp: { tr: "Yeraltı · çocukluk", en: "The Underground · childhood" },
    title: { tr: "Tavanı taş olan şehir", en: "A city with a stone ceiling" },
    text: {
      tr: "Başkentin altındaki yeraltı şehrinde doğdu. Annesi hastalıktan ölünce onu bulan kişi, annesinin ağabeyi Kenny oldu: bıçağı, hırsızlığı ve kimseye borçlu kalmamayı öğretti, sonra bir gün geri gelmedi. Levi'nin ilk öğrendiği şey bir teknik değil bir ölçü — neyin taşınabileceği.",
      en: "He was born in the underground city beneath the capital. When his mother died of illness, the man who found him was her older brother, Kenny: he taught the blade, the theft and the habit of owing nobody, then one day did not come back. The first thing Levi learned was not a technique but a measure — what can be carried.",
    },
    kin: null,
    imageKey: LEVI_IMAGE_KEYS.fateUnderground,
  },
  {
    key: "surface",
    stamp: { tr: "Yüzeye çıkış", en: "Coming up" },
    title: { tr: "Seçim gibi görünmeyen seçim", en: "A choice that did not look like one" },
    text: {
      tr: "Yeraltında iki arkadaşıyla çalışan Levi'yi Keşif Birliği yakaladı ve komutan Erwin Smith ona iki kapı gösterdi: hücre ya da birlik. İlk seferinde yağmur bastırdı, düzen dağıldı, iki arkadaşı geri dönmedi. Bu dönemi anlatan yan hikâyenin adı 悔いなき選択 — pişmanlıksız seçim; ad bir iddia değil, o günden sonra uygulanan bir yöntem.",
      en: "The Survey Corps caught Levi while he was working underground with two friends, and Commander Erwin Smith showed him two doors: a cell or the Corps. On his first expedition the rain came down, the formation broke, and his two friends did not return. The side story that covers this period is titled 悔いなき選択 — a choice with no regrets; the title is not a boast but a method applied from that day on.",
    },
    kin: {
      characterId: 46496,
      name: "Erwin Smith",
      role: {
        tr: "13. Komutan — onu yüzeye çıkaran adam",
        en: "13th Commander — the man who brought him up",
      },
    },
    imageKey: LEVI_IMAGE_KEYS.fateSurface,
  },
  {
    key: "expedition",
    stamp: { tr: "Yıl 850 · 57. Sefer", en: "Year 850 · 57th expedition" },
    title: { tr: "Bir öğleden sonrada dört kişi", en: "Four people in one afternoon" },
    text: {
      tr: "Kendi seçtiği dört askerle Eren'in sorumluluğunu aldı. Dev ağaçların arasında Dişi Titan'la karşılaştılar; Levi geri döndüğünde müfrezesi yoktu. Seferden önce Eren'e söylediği şey bir cesaret konuşması değildi, bir itiraftı: doğru seçimin hangisi olduğunu kendisi de bilmiyordu.",
      en: "With four soldiers he had chosen himself he took responsibility for Eren. Among the giant trees they met the Female Titan; when Levi came back his squad was gone. What he told Eren before the mission was not a pep talk but an admission: he did not know which choice was the right one either.",
    },
    quote: {
      text: "悔いが残らない方を自分で選べ",
      reading: {
        tr: "«Pişmanlığın az kalacağı tarafı kendin seç.»",
        en: "“Choose for yourself the side that leaves you less regret.”",
      },
      by: {
        tr: "Levi — Eren'e, 57. Sefer'den önce",
        en: "Levi — to Eren, before the 57th expedition",
      },
    },
    kin: {
      characterId: 40882,
      name: "Eren Yeager",
      role: {
        tr: "Sorumluluğunu üstlendiği çocuk",
        en: "The boy he took responsibility for",
      },
    },
    imageKey: LEVI_IMAGE_KEYS.fateExpedition,
  },
  {
    key: "shiganshina",
    stamp: { tr: "Yıl 850 · Shiganshina", en: "Year 850 · Shiganshina" },
    title: { tr: "Tek şırınga, iki ölmek üzere olan", en: "One syringe, two dying men" },
    text: {
      tr: "Shiganshina geri alındı ama bedeli birliğin neredeyse tamamı oldu. Duvarın dibinde elde tek bir serum vardı ve iki kişi ölüyordu: bodrumun sırrını hayatının amacı yapmış komutan ve denizi görmek isteyen çocuk. Levi çocuğu seçti, komutanı bıraktı ve bunu bir daha tartışmaya açmadı.",
      en: "Shiganshina was retaken, and the price was almost the entire corps. At the foot of the wall there was a single dose and two men dying: the commander who had made the secret of the basement his life's purpose, and the boy who wanted to see the sea. Levi chose the boy, let the commander go, and never reopened the question.",
    },
    quote: {
      text: "ゆっくり休め",
      reading: {
        tr: "«Rahat uyu.»",
        en: "“Rest easy.”",
      },
      by: {
        tr: "Levi — Erwin'e, Shiganshina'da",
        en: "Levi — to Erwin, at Shiganshina",
      },
    },
    kin: {
      characterId: 46494,
      name: "Armin Arlert",
      role: {
        tr: "Serumun verildiği kişi",
        en: "The one the syringe was given to",
      },
    },
    imageKey: LEVI_IMAGE_KEYS.fateShiganshina,
  },
  {
    key: "after",
    stamp: { tr: "Yıl 854 · sonrası", en: "Year 854 · after" },
    title: { tr: "Kalan elle çalışmak", en: "Working with the hand that is left" },
    text: {
      tr: "Marley baskınından dönerken bir patlama Levi'yi ağır yaraladı: sağ elinden iki parmak, sağ gözünden görme. Ayakta kalan şey rütbe değildi, verilmiş bir sözdü — ve o söz sonunda tutuldu. Sayfanın başındaki ölçü burada kapanıyor: elde her seferinde daha az yer kalıyor, taşınacak şeyin sayısı hiç azalmıyor.",
      en: "On the way back from the Marley raid a detonation wounded Levi badly: two fingers of the right hand, the sight of the right eye. What stayed on its feet was not a rank but a promise given — and in the end the promise was kept. The measure from the top of this page closes here: there is less room in the hands each time, and the number of things to carry never drops.",
    },
    kin: {
      characterId: 71121,
      name: "Hange Zoe",
      role: {
        tr: "14. Komutan — Erwin'den sonrası",
        en: "14th Commander — what came after Erwin",
      },
    },
    imageKey: LEVI_IMAGE_KEYS.fateAfter,
  },
];

/* ── Bağlar ─────────────────────────────────────────────────────────────── */

export const LEVI_BONDS = [
  {
    characterId: 46496,
    name: "Erwin Smith",
    role: {
      tr: "13. Komutan. Levi'yi yeraltından çıkardı, sonuncu seçimde onu geride bıraktı.",
      en: "13th Commander. He brought Levi up from underground; in the last choice Levi left him behind.",
    },
  },
  {
    characterId: 40882,
    name: "Eren Yeager",
    role: {
      tr: "Mahkemede tekmeleyerek koruduğu, sonunda karşısına aldığı çocuk.",
      en: "The boy he protected by kicking him in a courtroom, and finally stood against.",
    },
  },
  {
    characterId: 40881,
    name: "Mikasa Ackerman",
    role: {
      tr: "Aynı soyadı, aynı uyanış. İkisi de bunu kimseye açıklamıyor.",
      en: "The same surname, the same awakening. Neither of them explains it to anyone.",
    },
  },
  {
    characterId: 46494,
    name: "Armin Arlert",
    role: {
      tr: "Shiganshina'da serumun verildiği kişi. Levi'nin seçiminin sonucu.",
      en: "The one the syringe went to at Shiganshina. The outcome of Levi's choice.",
    },
  },
  {
    characterId: 71121,
    name: "Hange Zoe",
    role: {
      tr: "14. Komutan. Erwin'den sonra emri devralan kişi; Levi onun yanında kaldı.",
      en: "14th Commander. The one who took command after Erwin; Levi stayed at that side.",
    },
  },
] as const;

export const LEVI_BOND_UI = {
  hasPage: { tr: "arşivde dosyası var", en: "has a file in this archive" },
  noPage: { tr: "künye dosyası yok", en: "no file yet" },
  companionSuffix: { tr: "— portre", en: "— portrait" },
} as const;

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const LEVI_CLOSING = {
  quotes: [
    {
      text: "悔いが残らない方を自分で選べ",
      reading: {
        tr: "Pişmanlığın az kalacağı tarafı kendin seç.",
        en: "Choose for yourself the side that leaves you less regret.",
      },
      by: { tr: "Levi", en: "Levi" },
      note: {
        tr: "Eren'e, 57. Sefer'den önce. Bir tavsiye değil: kendi gücüne de güvendiğini, yoldaşlarının seçimine de güvendiğini, sonucu yine de kimsenin bilemediğini söyledikten sonra kalan tek cümle.",
        en: "To Eren, before the 57th expedition. Not advice: the one sentence left after saying that he has trusted his own strength, and trusted his comrades' choices, and that nobody could know the outcome either way.",
      },
    },
    {
      text: "ゆっくり休め",
      reading: {
        tr: "Rahat uyu.",
        en: "Rest easy.",
      },
      by: { tr: "Levi", en: "Levi" },
      note: {
        tr: "Erwin'e, Shiganshina'da, serumu vermemeye karar verdiği an. Bir veda değil, bir izin: rüyayı bırakmasına izin veriyor.",
        en: "To Erwin at Shiganshina, at the moment he decided not to give him the dose. Not a farewell but a permission: he is letting him put the dream down.",
      },
    },
  ],
  motto: "悔いなき選択",
  mottoNote: {
    tr: "Kuinaki sentaku — «pişmanlıksız seçim». Levi'nin yan hikâyesinin adı ve bu sayfanın modu. Sözün iddiası «doğru seçtim» değil: seçtikten sonra dönüp bakmamak bir karakter özelliği değil bir disiplin.",
    en: "Kuinaki sentaku — “a choice with no regrets”. The title of Levi's side story and the mode of this page. The claim is not “I chose correctly”: not looking back after choosing is not a personality trait but a discipline.",
  },
  credit: {
    tr: "Künye, portre, doğum günü, boy ve kan grubu AniList'ten alındı; portre karesi depoda duruyor (hotlink yok):",
    en: "Dossier, portrait, birthday, height and blood type are from AniList; the portrait file lives in this repository (no hotlinking):",
  },
  creditLink: {
    tr: "AniList · Levi #45627",
    en: "AniList · Levi #45627",
  },
  creditNote: {
    tr: "Sayfadaki diğer bütün kadrajlar boş: sahne, dönem ve teknik görselleri üretilmiyor, küratör yüklemesi bekliyor. Filigrandaki kanat arması elle çizilmiş SVG.",
    en: "Every other frame on this page is empty: scene, era and technique images are not generated and wait for a curator upload. The wing crest in the watermark is a hand-drawn SVG.",
  },
} as const;

/** Künyedeki boş satırın açıklaması — çekirdek değil, ikinci derece. */
export const LEVI_MISSING_NOTE: LocalizedText = {
  tr: "AniList kaydında yaş alanı boş ve seri de bir sayı vermiyor. Buraya bir tahmin yazmak sayfanın kendi kuralını bozardı.",
  en: "The age field is blank on the AniList record and the series never gives a number. Writing a guess here would break this page's own rule.",
};

export const LEVI_GAPS = {
  title: { tr: "Boş kadrajlar", en: "Empty frames" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bütün kadrajlar dolu. Sayfada boşluk yalnızca tasarım olarak kaldı.",
    en: "Every frame is filled. The only emptiness left on the page is the designed kind.",
  },
} as const;
