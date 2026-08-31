import type { LocalizedText } from "./types";

/**
 * Chōsō (脹相) — "Kan Bağı" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Bileşen bu dosyadan okuyup `pick(text, locale)` ile seçiyor; istemci
 * adalarına yalnızca düz dize iniyor.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * DOKUZ SAYILDI, ÜÇÜ ADLANDIRILDI. Chōsō呪胎九相図'nun ilki: dokuz lanetli
 * rahmin en büyüğü. Kayıt dokuzunu da sayıyor ama yalnızca üçünün adını
 * tutuyor — kendisi, Eso ve Kechizu. Kalan altısı kayıtta ADSIZ.
 *
 * Sayfanın kalbi bu boşluk üstüne kuruldu: dokuz kardeş damar sütununda
 * sıralı, tıklanan kardeşten aşağı kan akıyor, akış bitince o kardeşin
 * anısı açılıyor. Üçünde ad var; altısında yalnızca kayıtın kendisi var.
 * Dokuzu da açıldığında onuncu kadraj beliriyor: Chōsō'nun Yūji'yi kardeşi
 * saydığı an.
 *
 * ── KÜNYE VERİSİNİN KAYNAĞI ──────────────────────────────────────────────
 * Yaş (150+), cinsiyet, özel derece, kardeş adları, Noritoshi Kamo'nun
 * "üçüncü ebeveyn" olması, Mahito'nun grubuyla hareket etmesi ve altı
 * yapımın listesi AniList künyesinden birebir alındı (karakter 157116,
 * 31 Ağustos 2026; kopyası
 * `public/assets/anime/karakterler/chousou/kaynak.json`).
 *
 * ⚠️ DOĞUM TARİHİ, BOY VE KAN GRUBU KAYITTA YOK. Üçü de AniList kaydında
 * `null`. Künye şeridinde satırlar SİLİNMEDİ; "kayıtta yok" cevabıyla
 * duruyorlar. Kan grubunun boş olması bu sayfada ayrıca bir cümle:
 * tekniği kan olan adamın kan grubu kayıtlı değil.
 *
 * ── REPLİK DİSİPLİNİ (bu sayfanın en sıkı kuralı) ────────────────────────
 * Tırnak içine alınan HER satır kayıtın kendi adlandırması: teknik adı,
 * sınıflandırma ya da sayı. Chōsō'nun ağzından çıkmış hiçbir DİYALOG
 * tırnağa alınmadı — Rukia sayfasında (31 Ağustos 2026) kurulan disiplinin
 * aynısı. Doğrulayamadığım bir cümleyi tırnak içinde göstermektense anlatı
 * sesiyle yazmayı seçtim. Kullanılan satırlar:
 *   「呪胎九相図」 jutai kyūsōzu — sınıflandırmanın kendisi
 *   「赤血操術」   sekketsu sōjutsu — kalıtsal teknik
 *   「赤鱗躍動」   sekirin yakudō
 *   「穿血」       senketsu
 *   「超新星」     chōshinsei
 *   「特級」       tokkyū — derece
 *   「九」→「十」  sayının kendisi (replik DEĞİL, sayı; metinde de öyle yazılı)
 *
 * ── TERMİNOLOJİ (Jujutsu Kaisen; Naruto/Bleach sözlüğü KULLANILMADI) ─────
 * 呪術 (jujutsu), 呪力 (lanet enerjisi), 術式 (lanetli teknik),
 * 領域展開 (alan genişletme), 呪霊 (lanetli ruh), 呪具 (lanetli alet),
 * 特級 (özel derece), 呪胎九相図 (lanetli rahim: dokuz aşama resmi).
 * Türkçe karşılıklar arşivin JJK kanadındaki sözlükten.
 *
 * ── KRONOLOJİ ────────────────────────────────────────────────────────────
 * JJK'nın takvimi Chōsō için yıl vermiyor; kayıttaki tek sayı "150+".
 * Kader çizelgesinin beş durağı bu yüzden YIL değil DURUM adıyla anılıyor:
 * doğmadan önce · mühürde · serbest · iki eksik · tanıma.
 */

export const CHOUSOU_ID = 157116;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const CHOUSOU_SITE_URL = "https://anilist.co/character/157116";

/**
 * Depodaki resmî portre (Faz 2 kararı: hotlink yok, kare repoda).
 *
 * ⚠️ 230×345 — yani KÜÇÜK. Sayfada yalnızca dar bir madalyon kadrajında
 * kullanılıyor; büyük hero karesi küratör yuvası olarak boş bırakıldı.
 * Kendi kaynağımız olduğu için `next/image`de `unoptimized` YOK — kural
 * yalnızca küratörün yüklediği kare için `isUploadedPortrait(detail)`
 * üstünden işliyor.
 */
export const CHOUSOU_PORTRAIT = {
  src: "/assets/anime/karakterler/chousou/anilist-portrait.png",
  w: 230,
  h: 345,
} as const;

/**
 * Sergi görselleri — hepsi characterId 157116 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `chs:` önekli (küratör modu şartı).
 *
 * ⚠️ İki lanet terimine (領域展開 ve 呪具) BİLEREK anahtar açılmadı:
 * ikisi de bu karakterde "kayıtta yok" cevabı veriyor ve olmayan bir
 * tekniğe kadraj açmak kadrajı sonsuza kadar yalan bir boşluk yapardı.
 */
export const CHOUSOU_IMAGE_KEYS = {
  hero: "chs:hero",
  sekketsu: "chs:sekketsu",
  sekirin: "chs:sekirin",
  senketsu: "chs:senketsu",
  choushinsei: "chs:choushinsei",
  juryoku: "chs:juryoku",
  column: "chs:column",
  kinEsou: "chs:kin-esou",
  kinKechizu: "chs:kin-kechizu",
  recognition: "chs:recognition",
  fateKamo: "chs:fate-kamo",
  fateSeal: "chs:fate-seal",
  fateRelease: "chs:fate-release",
  fateLoss: "chs:fate-loss",
  fateTurn: "chs:fate-turn",
  bonds: "chs:bonds",
  closing: "chs:closing",
} as const;

/** Küratör yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const CHOUSOU_SLOT_LABELS: Record<string, LocalizedText> = {
  [CHOUSOU_IMAGE_KEYS.hero]: {
    tr: "Hero — dikey portre, tam boy, koyu zemin (3:4)",
    en: "Hero — vertical portrait, full figure, dark ground (3:4)",
  },
  [CHOUSOU_IMAGE_KEYS.sekketsu]: {
    tr: "赤血操術 — kanın havada tutulduğu an, geniş kadraj (16:9)",
    en: "赤血操術 — blood held in the air, wide frame (16:9)",
  },
  [CHOUSOU_IMAGE_KEYS.sekirin]: {
    tr: "赤鱗躍動 — kendi kanını işlerken, gövde yakın çekim (16:9)",
    en: "赤鱗躍動 — working his own blood, close on the body (16:9)",
  },
  [CHOUSOU_IMAGE_KEYS.senketsu]: {
    tr: "穿血 — sıkıştırılmış kanın fırlatıldığı kare (16:9)",
    en: "穿血 — the frame where compressed blood is fired (16:9)",
  },
  [CHOUSOU_IMAGE_KEYS.choushinsei]: {
    tr: "超新星 — kan kütlesi, orta kadraj (3:2)",
    en: "超新星 — the mass of blood, medium frame (3:2)",
  },
  [CHOUSOU_IMAGE_KEYS.juryoku]: {
    tr: "呪力 — yarı lanetli ruh gövdesi, orta kadraj (3:2)",
    en: "呪力 — the half cursed spirit body, medium frame (3:2)",
  },
  [CHOUSOU_IMAGE_KEYS.column]: {
    tr: "Dokuz rahim — mühürlü kaplar, dikey kadraj (3:4)",
    en: "The nine wombs — sealed vessels, vertical frame (3:4)",
  },
  [CHOUSOU_IMAGE_KEYS.kinEsou]: {
    tr: "Eso (壊相) — ikinci kardeş, dikey portre (4:5)",
    en: "Eso (壊相) — the second brother, vertical portrait (4:5)",
  },
  [CHOUSOU_IMAGE_KEYS.kinKechizu]: {
    tr: "Kechizu (血塗) — üçüncü kardeş, dikey portre (4:5)",
    en: "Kechizu (血塗) — the third brother, vertical portrait (4:5)",
  },
  [CHOUSOU_IMAGE_KEYS.recognition]: {
    tr: "Tanıma anı — Chōsō ve Yūji aynı karede (16:9)",
    en: "The recognition — Chōsō and Yūji in one frame (16:9)",
  },
  [CHOUSOU_IMAGE_KEYS.fateKamo]: {
    tr: "Kader 1 — Kamo'nun kanı, dönem kadrajı (16:9)",
    en: "Fate 1 — Kamo's blood, period frame (16:9)",
  },
  [CHOUSOU_IMAGE_KEYS.fateSeal]: {
    tr: "Kader 2 — mühür ve depo, geniş kadraj (16:9)",
    en: "Fate 2 — the seal and the storeroom, wide frame (16:9)",
  },
  [CHOUSOU_IMAGE_KEYS.fateRelease]: {
    tr: "Kader 3 — üç kardeş serbest, geniş kadraj (16:9)",
    en: "Fate 3 — the three brothers freed, wide frame (16:9)",
  },
  [CHOUSOU_IMAGE_KEYS.fateLoss]: {
    tr: "Kader 4 — iki kardeşin eksildiği an (16:9)",
    en: "Fate 4 — the moment two brothers are gone (16:9)",
  },
  [CHOUSOU_IMAGE_KEYS.fateTurn]: {
    tr: "Kader 5 — öfkenin yön değiştirdiği kare (16:9)",
    en: "Fate 5 — the frame where the fury turns (16:9)",
  },
  [CHOUSOU_IMAGE_KEYS.bonds]: {
    tr: "Bağlar — beş adın aynı karede durduğu geniş kare (16:9)",
    en: "Bonds — five names in one wide frame (16:9)",
  },
  [CHOUSOU_IMAGE_KEYS.closing]: {
    tr: "Kapanış — yatay bant, tek figür, çok boşluk (21:9)",
    en: "Closing — horizontal band, one figure, much space (21:9)",
  },
};

/** Beklenen kare: tip + ölçü. Yalnızca küratör görüyor (ziyaretçiye sızmaz). */
export const CHOUSOU_SLOT_SPECS: Record<string, LocalizedText> = {
  [CHOUSOU_IMAGE_KEYS.hero]: {
    tr: "dikey kadraj · 1200×1600 · webp",
    en: "vertical frame · 1200×1600 · webp",
  },
  [CHOUSOU_IMAGE_KEYS.sekketsu]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [CHOUSOU_IMAGE_KEYS.sekirin]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [CHOUSOU_IMAGE_KEYS.senketsu]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [CHOUSOU_IMAGE_KEYS.choushinsei]: {
    tr: "orta kadraj · 1200×800 · webp",
    en: "medium frame · 1200×800 · webp",
  },
  [CHOUSOU_IMAGE_KEYS.juryoku]: {
    tr: "orta kadraj · 1200×800 · webp",
    en: "medium frame · 1200×800 · webp",
  },
  [CHOUSOU_IMAGE_KEYS.column]: {
    tr: "dikey kadraj · 1200×1600 · webp",
    en: "vertical frame · 1200×1600 · webp",
  },
  [CHOUSOU_IMAGE_KEYS.kinEsou]: {
    tr: "dikey portre · 800×1000 · webp",
    en: "vertical portrait · 800×1000 · webp",
  },
  [CHOUSOU_IMAGE_KEYS.kinKechizu]: {
    tr: "dikey portre · 800×1000 · webp",
    en: "vertical portrait · 800×1000 · webp",
  },
  [CHOUSOU_IMAGE_KEYS.recognition]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [CHOUSOU_IMAGE_KEYS.fateKamo]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [CHOUSOU_IMAGE_KEYS.fateSeal]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [CHOUSOU_IMAGE_KEYS.fateRelease]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [CHOUSOU_IMAGE_KEYS.fateLoss]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [CHOUSOU_IMAGE_KEYS.fateTurn]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [CHOUSOU_IMAGE_KEYS.bonds]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [CHOUSOU_IMAGE_KEYS.closing]: {
    tr: "yatay bant · 1800×760 · webp",
    en: "horizontal band · 1800×760 · webp",
  },
};

/** `CuratorSlot`un `size` prop'u — yükleyici oranı kendisi yazıyor. */
export const CHOUSOU_SLOT_SIZES: Record<string, { w: number; h: number }> = {
  [CHOUSOU_IMAGE_KEYS.hero]: { w: 1200, h: 1600 },
  [CHOUSOU_IMAGE_KEYS.sekketsu]: { w: 1600, h: 900 },
  [CHOUSOU_IMAGE_KEYS.sekirin]: { w: 1600, h: 900 },
  [CHOUSOU_IMAGE_KEYS.senketsu]: { w: 1600, h: 900 },
  [CHOUSOU_IMAGE_KEYS.choushinsei]: { w: 1200, h: 800 },
  [CHOUSOU_IMAGE_KEYS.juryoku]: { w: 1200, h: 800 },
  [CHOUSOU_IMAGE_KEYS.column]: { w: 1200, h: 1600 },
  [CHOUSOU_IMAGE_KEYS.kinEsou]: { w: 800, h: 1000 },
  [CHOUSOU_IMAGE_KEYS.kinKechizu]: { w: 800, h: 1000 },
  [CHOUSOU_IMAGE_KEYS.recognition]: { w: 1600, h: 900 },
  [CHOUSOU_IMAGE_KEYS.fateKamo]: { w: 1600, h: 900 },
  [CHOUSOU_IMAGE_KEYS.fateSeal]: { w: 1600, h: 900 },
  [CHOUSOU_IMAGE_KEYS.fateRelease]: { w: 1600, h: 900 },
  [CHOUSOU_IMAGE_KEYS.fateLoss]: { w: 1600, h: 900 },
  [CHOUSOU_IMAGE_KEYS.fateTurn]: { w: 1600, h: 900 },
  [CHOUSOU_IMAGE_KEYS.bonds]: { w: 1600, h: 900 },
  [CHOUSOU_IMAGE_KEYS.closing]: { w: 1800, h: 760 },
};

/** Portre yuvasının etiketi (PORTRAIT yuvası — ABILITY değil). */
export const CHOUSOU_PORTRAIT_SLOT: LocalizedText = {
  tr: "Kapak portresi — dikey, tam boy (3:4)",
  en: "Cover portrait — vertical, full figure (3:4)",
};

/** Yoldaş portresi yuvalarının etiket kuyruğu. */
export const CHOUSOU_COMPANION_SLOT: LocalizedText = {
  tr: "yoldaş portresi (3:4)",
  en: "companion portrait (3:4)",
};

/** Boş kadrajda yalnızca KÜRATÖRE yazılan söz. */
export const CHOUSOU_FRAME_EMPTY: LocalizedText = {
  tr: "boş kadraj",
  en: "empty frame",
};

/** `alt` metinlerinin kaynak önekleri (Faz 2 §3: her alt kaynağını söyler). */
export const CHOUSOU_ALT = {
  scenePrefix: {
    tr: "Chōsō — küratör arşivinden yüklenen kare:",
    en: "Chōsō — frame uploaded from the curator archive:",
  },
  companionPrefix: {
    tr: "KuroNexus arşiv portresi —",
    en: "KuroNexus archive portrait —",
  },
} as const;

/** Breadcrumb'ın ikinci halkası. */
export const CHOUSOU_CRUMB = {
  series: { tr: "Jujutsu Kaisen", en: "Jujutsu Kaisen" },
} as const;

/**
 * Künye şeridi.
 *
 * On satırın dördü "kayıtta yok" diyor ve bu bir eksiklik değil bir cevap.
 * Kan grubu satırı sayfanın en sessiz esprisi: tekniği kan olan adamın kan
 * grubu kayıtlı değil.
 */
export const CHOUSOU_IDENTITY = {
  name: "Chousou",
  nativeName: "脹相",
  title: "呪胎九相図",
  titleReading: {
    tr: "jutai kyūsōzu — Lanetli Rahim: Dokuz Aşama Resmi",
    en: "jutai kyūsōzu — Cursed Womb: Death Painting",
  },
  epigraph: {
    tr: "Dokuz sayıldı. Üçü adlandırıldı. Ağabey, adı olmayan altısını da sayan kişidir.",
    en: "Nine were counted. Three were named. The eldest is the one who counts the six without names as well.",
  },
  facts: [
    {
      label: { tr: "Ad", en: "Name" },
      value: { tr: "Chōsō · 脹相 (kayıtta: Chousou, Choso)", en: "Chōsō · 脹相 (in the record: Chousou, Choso)" },
    },
    {
      label: { tr: "Sınıf", en: "Class" },
      value: {
        tr: "呪胎九相図 — dokuz lanetli rahmin ilki, en büyüğü",
        en: "呪胎九相図 — first and eldest of the nine cursed wombs",
      },
    },
    {
      label: { tr: "Derece", en: "Grade" },
      value: { tr: "特級 · Özel Derece", en: "特級 · Special Grade" },
    },
    {
      label: { tr: "Yapı", en: "Make" },
      value: {
        tr: "Yarı insan, yarı lanetli ruh (呪霊)",
        en: "Half human, half cursed spirit (呪霊)",
      },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "150+", en: "150+" },
    },
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "kayıtta yok", en: "not in the record" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "kayıtta yok", en: "not in the record" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "kayıtta yok", en: "not in the record" },
    },
    {
      label: { tr: "Üçüncü ebeveyn", en: "Third parent" },
      value: {
        tr: "Noritoshi Kamo — kendi kanını karıştıran adam",
        en: "Noritoshi Kamo — the man who mixed in his own blood",
      },
    },
    {
      label: { tr: "Kardeşler", en: "Brothers" },
      value: { tr: "Eso (壊相) · Kechizu (血塗)", en: "Eso (壊相) · Kechizu (血塗)" },
    },
    {
      label: { tr: "Taraf", en: "Side" },
      value: {
        tr: "Mahito'nun grubu — sonradan karşısına geçtiği taraf",
        en: "Mahito's group — the side he later turned against",
      },
    },
    {
      label: { tr: "Sembolik nesne", en: "Symbolic object" },
      value: {
        tr: "Kanın kendisi: hem silahı, hem soyağacı, hem de tanıma yöntemi",
        en: "Blood itself: his weapon, his family tree and his way of recognising kin",
      },
    },
    {
      label: { tr: "Yapımlar", en: "Appearances" },
      value: {
        tr: "Jujutsu Kaisen · 2. Sezon · Shimetsu Kaiyū (Zenpen/Kōhen) · Execution — hepsinde yan rol",
        en: "Jujutsu Kaisen · Season 2 · Shimetsu Kaiyū (Parts 1–2) · Execution — supporting in all",
      },
    },
  ],
} as const;

/** Künye şeridinin altındaki not — boş satırların açıklaması. */
export const CHOUSOU_MISSING_NOTE: LocalizedText = {
  tr: "Doğum, boy ve kan grubu AniList kaydında boş. Uydurulmuş bir sayı yazmaktansa boşluk kayıtta bırakıldı — kan grubunun boş olması, kanı teknik olan biri için ayrıca bir cevap.",
  en: "Birthday, height and blood type are empty in the AniList record. Rather than inventing a number the gap was left standing — and for a man whose technique is blood, an empty blood type is itself an answer.",
};

/** Hero bölümünün metinleri. */
export const CHOUSOU_HERO = {
  lede: {
    tr: "Bu sayfa yukarıdan aşağı okunur. Ortadaki damar hiç geri akmıyor: bölümler ondan sağa ve sola dallanıyor, dallanma noktaları görünür duruyor. Kanın yönü belli — kardeşlik de öyle.",
    en: "This page reads from top to bottom. The vein down the middle never runs backwards: sections branch left and right from it and the branch points stay visible. Blood has a direction, and so does brotherhood.",
  },
  portraitAlt: {
    tr: "Chōsō — AniList resmî portresi (230×345, depoya indirildi)",
    en: "Chōsō — official AniList portrait (230×345, downloaded into the repository)",
  },
  portraitAltUploaded: {
    tr: "Chōsō — küratör arşivine yüklenen kapak portresi",
    en: "Chōsō — cover portrait uploaded to the curator archive",
  },
  heroCaption: {
    tr: "Büyük kare bilerek boş: elimizdeki resmî portre 230 piksel genişliğinde ve tam kanama bir hero için küçük. Madalyon onun ölçüsü.",
    en: "The large frame is deliberately empty: the official portrait we hold is 230 pixels wide, too small for a full-bleed hero. The medallion is its true size.",
  },
} as const;

/**
 * Mod düğmesi — "Kan Bağı".
 *
 * Açıkken sayfanın YAPISI değişiyor, ışığı değil: damar ağı bölümlerin
 * kenarlarına kılcal damarlar uzatıyor, palet doyuyor ve her bölümde o
 * bölüme ait KARDEŞ ADI beliriyor (kapalıyken o satırlar hiç çizilmiyor).
 */
export const CHOUSOU_BLOOD = {
  title: { tr: "Kan Bağı", en: "Blood Tie" },
  native: "赤血操術",
  enter: { tr: "Kan bağını aç", en: "Open the blood tie" },
  exit: { tr: "Kan bağını kapat", en: "Close the blood tie" },
  hintOn: {
    tr: "Kan bağı açık: damar ağı bölüm kenarlarına yayıldı, palet doydu ve her bölümde o bölümün kardeşi adıyla duruyor.",
    en: "Blood tie open: the vein network has spread to the section edges, the palette has saturated and each section now names its brother.",
  },
  hintOff: {
    tr: "Kan bağı kapalı: sayfa yalnızca gövde damarını taşıyor, kardeş adları görünmüyor.",
    en: "Blood tie closed: the page carries only the trunk vein and the brothers' names stay hidden.",
  },
  lede: {
    tr: "Tek düğme, tek durum. Açtığında sayfa aydınlanmıyor — damarlanıyor.",
    en: "One button, one state. Opening it does not brighten the page — it makes it vascular.",
  },
} as const;

/**
 * "Kan Bağı" açıkken beliren KARDEŞ ADLARI.
 *
 * Sayfada tam dokuz bölüm var (hero · mod · kayıt · üç ağırlık · dört terim
 * · dokuz kardeş · bağlar · kader · kapanış) ve dokuz rahim var. Düğme
 * açıldığında her bölümün damar düğümüne bir kardeş yazılıyor: hero'ya
 * birinci (Chōsō'nun kendisi), kapanışa dokuzuncu. Üçünde ad var, altısında
 * "adı kayıtta yok" — sayfanın tamamı bu yüzden bir sayım gibi okunuyor.
 *
 * Sıra `CHOUSOU_WOMBS` ile aynı; ad uydurulmuş hiçbir halka yok.
 */
export const CHOUSOU_WHISPERS = [
  {
    index: "一",
    native: "脹相",
    name: "Chōsō",
    note: { tr: "sayan", en: "the one who counts" },
  },
  {
    index: "二",
    native: "壊相",
    name: "Eso",
    note: { tr: "ikinci", en: "the second" },
  },
  {
    index: "三",
    native: "血塗",
    name: "Kechizu",
    note: { tr: "üçüncü", en: "the third" },
  },
  { index: "四", native: null, name: null, note: { tr: "dördüncü", en: "the fourth" } },
  { index: "五", native: null, name: null, note: { tr: "beşinci", en: "the fifth" } },
  { index: "六", native: null, name: null, note: { tr: "altıncı", en: "the sixth" } },
  { index: "七", native: null, name: null, note: { tr: "yedinci", en: "the seventh" } },
  { index: "八", native: null, name: null, note: { tr: "sekizinci", en: "the eighth" } },
  { index: "九", native: null, name: null, note: { tr: "dokuzuncu", en: "the ninth" } },
] as const;

/** Adsız halkaların ortak etiketi — hem mekanikte hem fısıltıda okunuyor. */
export const CHOUSOU_NAMELESS: LocalizedText = {
  tr: "adı kayıtta yok",
  en: "no name in the record",
};

/** Bölüm başlıkları ve girişleri. */
export const CHOUSOU_SECTIONS = {
  record: {
    title: { tr: "Kayıt", en: "The Record" },
    lede: {
      tr: "On üç satır. Dördü boş ve boş kalıyor.",
      en: "Thirteen lines. Four are empty and stay empty.",
    },
  },
  arts: {
    title: { tr: "Lanet Laboratuvarı — üç ağırlık", en: "Curse Laboratory — three weights" },
    lede: {
      tr: "術式 (lanetli teknik) Chōsō'da kalıtsal: Noritoshi Kamo kendi kanını karıştırdığı için Kamo klanının tekniği ona da geçti. Üçü de aynı maddeyi işliyor.",
      en: "The 術式 (cursed technique) is inherited here: because Noritoshi Kamo mixed in his own blood, the Kamo clan's technique reached Chōsō too. All three work the same material.",
    },
  },
  terms: {
    title: { tr: "Dört terim", en: "Four terms" },
    lede: {
      tr: "İkisi onda var, ikisi kayıtta yok. Boş olanlar da bu bölümde duruyor — bir arşivde eksik, sessizce silinmez.",
      en: "Two he has, two are not in the record. The empty ones stay in this section too: in an archive a gap is not quietly deleted.",
    },
  },
  wombs: {
    title: { tr: "Dokuz Kardeş", en: "Nine Brothers" },
    lede: {
      tr: "Damar sütunundaki dokuz halka. Birine bastığında kan ondan AŞAĞI akıyor; akış tamamlanınca o kardeşin anısı açılıyor ve yandaki kan bağı göstergesi bir kademe doluyor. Akış hiçbir zaman yukarı gitmiyor.",
      en: "Nine rings along the vein column. Press one and blood runs DOWN from it; when the flow completes that brother's memory opens and the blood-tie gauge beside it fills one step. The flow never runs upward.",
    },
  },
  kin: {
    title: { tr: "Bağlar", en: "Bonds" },
    lede: {
      tr: "Beş ad. İkisinin arşivde sayfası var, ikisinin yok, biri onu kardeş sayacağı kişi.",
      en: "Five names. Two have pages in this archive, two do not, and one is the person he will come to count as a brother.",
    },
  },
  fate: {
    title: { tr: "Kader Çizelgesi", en: "The Fate Chart" },
    lede: {
      tr: "Beş durak, hepsi aynı damarın üstünde. Kayıttaki tek sayı 150+ olduğu için duraklar yılla değil durumla anılıyor.",
      en: "Five stops, all on the same vein. Since the only number in the record is 150+, the stops are named by state rather than by year.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "Aşağıdaki iki satır diyalog değil: kayıtın kendi adlandırması. Chōsō'nun ağzından çıkmış hiçbir cümle bu sayfada tırnağa alınmadı — sözcüğünü doğrulayamadığım bir repliği tırnak içinde göstermek arşivin kendi kuralını bozardı.",
      en: "The two lines below are not dialogue: they are the record's own naming. No sentence spoken by Chōsō is quoted on this page — showing a line whose wording I cannot verify inside quotation marks would break the archive's own rule.",
    },
  },
} as const;

/**
 * Üç ağırlık — lanetli teknik (術式) kartları.
 *
 * Üçü de doğrulanmış teknik adı. Görev dosyası ikisini (赤鱗躍動, 穿血)
 * doğrudan örnek olarak veriyor; üçüncüsü tekniğin kendi adı.
 */
export const CHOUSOU_ARTS = [
  {
    key: "sekketsu",
    name: "赤血操術",
    reading: "sekketsu sōjutsu",
    turkish: { tr: "Kızıl Kan İşletme", en: "Blood Manipulation" },
    tagline: {
      tr: "Kalıtsal teknik. Ona kanla geçti — çünkü ona geçen şey zaten kandı.",
      en: "The inherited technique. It came to him through blood — because what came to him was blood.",
    },
    text: {
      tr: "Kamo klanının kalıtsal tekniği. Kayıt bunu bir soyağacı olarak değil bir müdahale olarak anlatıyor: Noritoshi Kamo, dokuz rahmi taşıyan kadın hamileyken kendi kanını karıştırmış. Chōsō'nun tekniği bu yüzden hem miras hem yara.",
      en: "The Kamo clan's inherited technique. The record tells it not as a lineage but as an intervention: Noritoshi Kamo mixed his own blood in while the woman carrying the nine wombs was pregnant. That is why Chōsō's technique is at once an inheritance and an injury.",
    },
    traits: [
      { tr: "Kan bedenin dışında da denetim altında kalıyor", en: "Blood stays under control outside the body" },
      { tr: "Kaynak kendi kanı — kullandıkça eksiliyor", en: "The source is his own blood — using it costs him" },
      { tr: "Kamo klanının kalıtsal tekniği (術式)", en: "The Kamo clan's inherited cursed technique (術式)" },
    ],
    imageKey: CHOUSOU_IMAGE_KEYS.sekketsu,
  },
  {
    key: "sekirin",
    name: "赤鱗躍動",
    reading: "sekirin yakudō",
    turkish: { tr: "Kızıl Pulun Kıpırtısı", en: "Flowing Red Scale" },
    tagline: {
      tr: "Dışarı değil içeri uygulanan teknik: kanı silah yapmıyor, bedeni yükseltiyor.",
      en: "The technique turned inward: it does not weaponise the blood, it raises the body.",
    },
    text: {
      tr: "Kendi kan akışını işleyerek bedeninin çıktısını yükseltiyor. Sayfadaki bütün hareketin ağır ve viskoz olmasının sebebi bu: Chōsō'nun hızı bir sıçrama değil, akışın hızlanması.",
      en: "By working his own bloodstream he raises the output of his body. That is why every movement on this page is heavy and viscous: Chōsō's speed is not a leap, it is a flow accelerating.",
    },
    traits: [
      { tr: "Hedefi kendisi — dışarı atılan bir şey yok", en: "The target is himself — nothing is thrown outward" },
      { tr: "Süresi kanın taşıdığı yüke bağlı", en: "Its duration hangs on the load the blood carries" },
      { tr: "Sayfanın hareket dili buradan çıktı", en: "The page's motion language was drawn from this" },
    ],
    imageKey: CHOUSOU_IMAGE_KEYS.sekirin,
  },
  {
    key: "senketsu",
    name: "穿血",
    reading: "senketsu",
    turkish: { tr: "Delen Kan", en: "Piercing Blood" },
    tagline: {
      tr: "Sıkıştırılmış kan. Tek yönlü, geri dönüşü olmayan bir çizgi.",
      en: "Compressed blood. A single-direction line with no way back.",
    },
    text: {
      tr: "Kanı sıkıştırıp bir doğrultuda fırlatıyor. Bu sayfanın ızgarası da aynı mantıkla kuruldu: damar hiç geri akmıyor, bölümler ondan yalnızca dallanıyor.",
      en: "He compresses blood and fires it along one line. This page's grid was laid out on the same logic: the vein never runs back, sections only branch off it.",
    },
    traits: [
      { tr: "Tek doğrultu — kavis yok, dönüş yok", en: "One line — no arc, no return" },
      { tr: "Menzili kanın basıncına bağlı", en: "Its reach hangs on the pressure of the blood" },
      { tr: "En pahalı teknik: attığı kanı geri almıyor", en: "The most expensive technique: the blood he throws does not come back" },
    ],
    imageKey: CHOUSOU_IMAGE_KEYS.senketsu,
  },
] as const;

/**
 * Dört terim — ikisi dolu, ikisi kayıtta boş.
 *
 * Boş olan ikiye (領域展開, 呪具) bilerek görsel yuvası AÇILMADI: olmayan
 * bir tekniğe kadraj açmak, sonsuza kadar dolmayacak bir boşluk üretirdi.
 */
export const CHOUSOU_TERMS = [
  {
    key: "choushinsei",
    name: "超新星",
    reading: "chōshinsei",
    turkish: { tr: "Süpernova", en: "Supernova" },
    note: {
      tr: "Kan kütlesi hâlinde savrulan saldırı. Adı da işleyişi gibi: tek bir noktada biriktirip bırakmak.",
      en: "An attack hurled as a mass of blood. The name works like the thing: gather at one point, then let go.",
    },
    imageKey: CHOUSOU_IMAGE_KEYS.choushinsei,
  },
  {
    key: "juryoku",
    name: "呪力",
    reading: "juryoku",
    turkish: { tr: "Lanet Enerjisi", en: "Cursed Energy" },
    note: {
      tr: "Kayıtta iki satır yan yana duruyor: yarı insan yarı lanetli ruh, ve yaş 150+. Arşiv ikisini birbirine bağlamıyor; bu sayfa da bağlamıyor, yan yana bırakıyor.",
      en: "Two lines sit side by side in the record: half human, half cursed spirit, and age 150+. The archive does not join them, and neither does this page — it leaves them adjacent.",
    },
    imageKey: CHOUSOU_IMAGE_KEYS.juryoku,
  },
  {
    key: "ryouiki",
    name: "領域展開",
    reading: "ryōiki tenkai",
    turkish: { tr: "Alan Genişletme", en: "Domain Expansion" },
    note: {
      tr: "Kayıtta yok. Chōsō'ya atfedilmiş bir alan bulunmuyor; bu kutu boş kalıyor ve boş kaldığı yazıyor.",
      en: "Not in the record. No domain is attributed to Chōsō; this box stays empty, and it says so.",
    },
    imageKey: null,
  },
  {
    key: "jugu",
    name: "呪具",
    reading: "jugu",
    turkish: { tr: "Lanetli Alet", en: "Cursed Tool" },
    note: {
      tr: "Kayıtta yok. Taşıdığı bir alet yok — aleti kendi damarında duruyor.",
      en: "Not in the record. He carries no tool — his tool is already in his veins.",
    },
    imageKey: null,
  },
] as const;

/**
 * DOKUZ KARDEŞ — sayfanın kalbi.
 *
 * ⚠️ KAYIT DOKUZUNU SAYIYOR, ÜÇÜNÜ ADLANDIRIYOR. Chōsō (ilk), Eso (ikinci)
 * ve Kechizu (üçüncü) adlı; dördüncüden dokuzuncuya kadar hiçbirinin adı
 * kaynakta geçmiyor. O altısına ad UYDURULMADI: her biri kayıtın kendi
 * doğrulanmış cümlelerinden birini taşıyor ve "adı kayıtta yok" damgasıyla
 * duruyor. Sayfanın duygusu tam olarak burada: gösterge dokuza kadar
 * doluyor ama altı yüz boş kalıyor.
 *
 * `name` alanı `null` olan halka adsızdır ve bileşen onu öyle çiziyor.
 */
export const CHOUSOU_WOMBS = [
  {
    key: "ichi",
    index: "一",
    order: 1,
    name: "Chōsō",
    native: "脹相",
    reading: "chōsō",
    title: { tr: "İlk", en: "The first" },
    memory: {
      tr: "Sayan kişi. Dokuzun ilki ve en büyüğü. Bir ağabeyin ilk işi saymaktır; bu sayfanın da ilk işi o.",
      en: "The one who counts. First and eldest of the nine. An elder brother's first job is to count; so is this page's.",
    },
    imageKey: null,
  },
  {
    key: "ni",
    index: "二",
    order: 2,
    name: "Eso",
    native: "壊相",
    reading: "eso",
    title: { tr: "İkinci", en: "The second" },
    memory: {
      tr: "İkinci kardeş. Chōsō ve Kechizu ile birlikte mühürden çıktı, Mahito'nun grubunun yanında hareket etti ve o hattın sonunda öldü. Adı kayıtta duruyor; bu sayfada da duruyor.",
      en: "The second brother. He came out of the seal with Chōsō and Kechizu, moved alongside Mahito's group, and died at the end of that line. His name stands in the record; it stands on this page too.",
    },
    imageKey: CHOUSOU_IMAGE_KEYS.kinEsou,
  },
  {
    key: "san",
    index: "三",
    order: 3,
    name: "Kechizu",
    native: "血塗",
    reading: "kechizu",
    title: { tr: "Üçüncü", en: "The third" },
    memory: {
      tr: "Üçüncü kardeş. Eso ile aynı hatta yürüdü ve aynı hatta kaldı. Chōsō'nun kardeşlerine düşkünlüğü ve onları aşırı koruması kayıtta ayrıca yazılı — bu iki adın kaybı o cümlenin karşılığı.",
      en: "The third brother. He walked the same line as Eso and stayed on it. The record notes separately that Chōsō is deeply attached to his brothers and fiercely protective of them — the loss of these two names is what that sentence costs.",
    },
    imageKey: CHOUSOU_IMAGE_KEYS.kinKechizu,
  },
  {
    key: "shi",
    index: "四",
    order: 4,
    name: null,
    native: null,
    reading: null,
    title: { tr: "Adı kayıtta yok", en: "No name in the record" },
    memory: {
      tr: "Dokuz rahim vardı. Kayıt dokuzunu da sayıyor, üçünü adlandırıyor. Bu halkaya bir ad yazmak arşivin kendi kuralını bozardı; boş bırakıldı.",
      en: "There were nine wombs. The record counts all nine and names three. Writing a name into this ring would break the archive's own rule; it was left empty.",
    },
    imageKey: null,
  },
  {
    key: "go",
    index: "五",
    order: 5,
    name: null,
    native: null,
    reading: null,
    title: { tr: "Adı kayıtta yok", en: "No name in the record" },
    memory: {
      tr: "Kayıt şunu söylüyor: Chōsō ve kardeşleri bir zamanlar Jujutsu Lisesi'nde, Sukuna'nın parmaklarıyla aynı depoda saklanıyordu. Bu halka o depodan geliyor.",
      en: "The record says this: Chōsō and his brothers were once stored at Jujutsu High, in the same store as Sukuna's fingers. This ring comes from that store.",
    },
    imageKey: null,
  },
  {
    key: "roku",
    index: "六",
    order: 6,
    name: null,
    native: null,
    reading: null,
    title: { tr: "Adı kayıtta yok", en: "No name in the record" },
    memory: {
      tr: "Dokuzunun ortak tarifi tek cümle: yarı insan, yarı lanetli ruh. Bu halkanın hakkında bilinen her şey o cümlenin içinde.",
      en: "One sentence describes all nine: half human, half cursed spirit. Everything known about this ring lives inside that sentence.",
    },
    imageKey: null,
  },
  {
    key: "shichi",
    index: "七",
    order: 7,
    name: null,
    native: null,
    reading: null,
    title: { tr: "Adı kayıtta yok", en: "No name in the record" },
    memory: {
      tr: "Üçüncü ebeveyn: Noritoshi Kamo. Kayıt onu bir baba olarak değil, hamile bir kadına kendi kanını karıştıran adam olarak anıyor. Dokuz halkanın hepsi o karışımdan çıktı.",
      en: "The third parent: Noritoshi Kamo. The record remembers him not as a father but as the man who mixed his own blood into a pregnant woman. All nine rings came out of that mixture.",
    },
    imageKey: null,
  },
  {
    key: "hachi",
    index: "八",
    order: 8,
    name: null,
    native: null,
    reading: null,
    title: { tr: "Adı kayıtta yok", en: "No name in the record" },
    memory: {
      tr: "Chōsō kendi geçmişinin ne kadarını hatırlıyor, kayıt söylemiyor. Söylediği tek şey şu: Noritoshi'yi hatırlıyor ve annesiyle kardeşlerinin hayatlarıyla oynadığı için ona kin tutuyor.",
      en: "How much of his own past Chōsō remembers, the record does not say. The one thing it does say: he remembers Noritoshi, and he holds a grudge for what was done to his mother's and his brothers' lives.",
    },
    imageKey: null,
  },
  {
    key: "kyuu",
    index: "九",
    order: 9,
    name: null,
    native: null,
    reading: null,
    title: { tr: "Adı kayıtta yok", en: "No name in the record" },
    memory: {
      tr: "Dokuzuncu halka boş duruyor. Bu sayfada onu dolduran bir cümle yok — ve gösterge dolduğunda bile bu altı yüz boş kalıyor. Sayının tamamlanması, kaydın tamamlanması değil.",
      en: "The ninth ring stands empty. No sentence on this page fills it — and even when the gauge is full these six faces stay blank. A completed count is not a completed record.",
    },
    imageKey: null,
  },
] as const;

/** Mekaniğin arayüz metinleri — istemci adasına düz dize olarak iniyor. */
export const CHOUSOU_WOMB_UI = {
  gaugeLabel: { tr: "Kan bağı", en: "Blood tie" },
  gaugeUnit: { tr: "kardeş açıldı", en: "brothers opened" },
  openLabel: { tr: "Kanı aşağı ver", en: "Send the blood down" },
  openedLabel: { tr: "Açıldı", en: "Opened" },
  flowingLabel: { tr: "Akıyor…", en: "Flowing…" },
  namelessLabel: { tr: "adı kayıtta yok", en: "no name in the record" },
  idleHint: {
    tr: "Bir halkaya bas: kan ondan aşağı akmaya başlar. Sekme tuşuyla halkalar arasında gezinebilirsin.",
    en: "Press a ring: blood starts running down from it. You can move between the rings with the Tab key.",
  },
  flowHint: {
    tr: "Akış sürüyor. Bitmesini bekle — bu sayfada hiçbir şey hızlı olmuyor.",
    en: "The flow is running. Wait for it to finish — nothing on this page is quick.",
  },
  midHint: {
    tr: "Açık kalan halkalar aşağıda birikiyor. Akış hep yukarıdan aşağı: açılmış bir halka kapanmıyor.",
    en: "The opened rings accumulate below. The flow is always downward: an opened ring does not close.",
  },
  doneHint: {
    tr: "Dokuzu da açıldı. Sayının bittiği yerde onuncu kadraj beliriyor.",
    en: "All nine are open. Where the count ends, a tenth frame appears.",
  },
  statusFlowing: { tr: "Kan akıyor:", en: "Blood is flowing:" },
  statusOpened: { tr: "Anı açıldı:", en: "Memory opened:" },
  statusDone: {
    tr: "Dokuz kardeşin dokuzu da açıldı. Onuncu kadraj göründü.",
    en: "All nine brothers are open. The tenth frame has appeared.",
  },
  keyboardHint: {
    tr: "Dokuz halkanın hepsi gerçek düğme: sekmeyle geziliyor, Enter ve boşlukla açılıyor.",
    en: "All nine rings are real buttons: reachable by Tab, opened with Enter or Space.",
  },
} as const;

/**
 * ONUNCU KADRAJ — dokuz açıldığında beliriyor.
 *
 * Tanıma anının gerekçesi kayıtta yazılı olduğu kadarıyla alındı: Itadori
 * ile dövüşürken gördüğü bir görüntüden sonra, Sukuna'nın kabının kendi
 * küçük kardeşlerinden biri olduğuna ikna oluyor. Sonrasında onu Itadori'ye
 * zarar vermeye yönlendirdikleri için Mahito'ya ve diğer lanetli ruhlara
 * öfkeleniyor. Bu iki cümlenin ötesinde bir mekanizma ANLATILMADI.
 */
export const CHOUSOU_TENTH = {
  index: "十",
  mark: { from: "九", to: "十" },
  markNote: {
    tr: "Bu bir replik değil, bir sayı: dokuz, ona göre, dokuz kalmıyor.",
    en: "This is not a line of dialogue, it is a number: nine, to him, does not stay nine.",
  },
  name: "Yūji Itadori",
  native: "虎杖悠仁",
  characterId: 127212,
  title: { tr: "Onuncu", en: "The tenth" },
  text: {
    tr: "Itadori ile dövüşürken gördüğü bir görüntüden sonra, Sukuna'nın kabının kendi küçük kardeşlerinden biri olduğuna ikna oluyor. Ardından öfkesi yön değiştiriyor: onu Itadori'ye zarar vermeye yönlendirdikleri için Mahito'ya ve yanındaki lanetli ruhlara dönüyor.",
    en: "After a vision during his fight with Itadori, he becomes convinced that Sukuna's vessel is in fact one of his younger brothers. His fury then changes direction: it turns on Mahito and the cursed spirits beside him for steering him into harming Itadori.",
  },
  note: {
    tr: "Sayfadaki mekaniğin tamamı bu kadraja çıkıyor. Gösterge dokuzda dolduğu hâlde altı halka adsız kalıyor — Chōsō'nun ekleyeceği ad, kayıtta olmayan altısından biri değil, onuncusu.",
    en: "The whole mechanic on this page leads to this frame. Even with the gauge full at nine, six rings stay nameless — the name Chōsō adds is not one of the six missing from the record but a tenth.",
  },
  imageKey: CHOUSOU_IMAGE_KEYS.recognition,
} as const;

/**
 * Bağlar — beş ad.
 *
 * ⚠️ Beşi de `EXPERIENCE_COMPANIONS[157116]` ile birebir aynı küme:
 * [127212, 210832, 210831, 133702, 133701]. Bu listede olmayan bir kimliği
 * çizmek kadrajı sonsuza kadar boş bırakırdı (Dalga 1'de Armin↔Levi emsali).
 */
export const CHOUSOU_BONDS = [
  {
    characterId: 127212,
    name: "Yūji Itadori",
    role: { tr: "onuncu kardeş", en: "the tenth brother" },
    line: {
      tr: "Önce karşısındaki, sonra kardeşi. Sayfanın mekaniği tam olarak bu sıranın kendisi.",
      en: "First his opponent, then his brother. The page's mechanic is exactly that order.",
    },
  },
  {
    characterId: 210831,
    name: "Eso",
    role: { tr: "ikinci kardeş", en: "the second brother" },
    line: {
      tr: "Mühürden onunla ve Kechizu ile birlikte çıktı. Arşivde henüz kendi sayfası yok.",
      en: "He came out of the seal with him and with Kechizu. He has no page of his own in this archive yet.",
    },
  },
  {
    characterId: 210832,
    name: "Kechizu",
    role: { tr: "üçüncü kardeş", en: "the third brother" },
    line: {
      tr: "Üçlünün sonuncusu. Adı kayıtta var; arşivde henüz sayfası yok.",
      en: "The last of the three. His name is in the record; his page is not in the archive yet.",
    },
  },
  {
    characterId: 133702,
    name: "Mahito",
    role: { tr: "yanında durduğu, sonra karşısına geçtiği", en: "the one he stood beside, then turned against" },
    line: {
      tr: "Üç kardeş onun grubunun yanında hareket etti. Tanıma anından sonra Chōsō'nun öfkesi ona döndü.",
      en: "The three brothers moved alongside his group. After the recognition, Chōsō's fury turned on him.",
    },
  },
  {
    characterId: 133701,
    name: "Sukuna",
    role: { tr: "aynı depoda mühürlü duran", en: "sealed in the same store" },
    line: {
      tr: "Kayıttaki en sessiz komşuluk: dokuz rahim, Sukuna'nın parmaklarıyla aynı yerde saklanıyordu.",
      en: "The quietest adjacency in the record: the nine wombs were stored in the same place as Sukuna's fingers.",
    },
  },
] as const;

export const CHOUSOU_BOND_UI = {
  hasPage: { tr: "arşivde sayfası var", en: "has a page in the archive" },
  noPage: { tr: "arşivde sayfası yok", en: "no page in the archive" },
  noPortrait: { tr: "portre kaydı yok", en: "no portrait on record" },
} as const;

/**
 * KADER ÇİZELGESİ — beş durak.
 *
 * Yaş etiketi kayıttaki tek sayıya dayanıyor (150+). Yıl verilmedi çünkü
 * kaynakta yıl yok; duraklar DURUM adıyla anılıyor.
 *
 * Orijinal dil işaretleri replik değil: dördü teknik/sınıf adı, beşincisi
 * sayının kendisi. Metinde de böyle yazılı.
 */
export const CHOUSOU_TIMELINE = [
  {
    key: "kamo",
    stamp: { tr: "yaş 0 · doğmadan önce", en: "age 0 · before birth" },
    title: { tr: "Karıştırılan kan", en: "The blood that was mixed in" },
    text: {
      tr: "Lanetli ruh çocuklar doğurabilen bir kadın; dokuz rahim; ve hamileliğin ortasında kendi kanını karıştıran Noritoshi Kamo. Chōsō'nun tekniği de, kardeşleri de, kini de aynı cümleden çıkıyor.",
      en: "A woman able to bear cursed spirit children; nine wombs; and Noritoshi Kamo, mixing in his own blood midway through the pregnancy. Chōsō's technique, his brothers and his grudge all come out of that one sentence.",
    },
    mark: { text: "赤血操術", reading: { tr: "sekketsu sōjutsu — kalıtsal teknik", en: "sekketsu sōjutsu — the inherited technique" } },
    imageKey: CHOUSOU_IMAGE_KEYS.fateKamo,
  },
  {
    key: "seal",
    stamp: { tr: "yaş kayıtta yok · mühürde", en: "age not in the record · sealed" },
    title: { tr: "Depodaki komşuluk", en: "Neighbours in the store" },
    text: {
      tr: "Bir noktada Chōsō ve kardeşleri Jujutsu Lisesi'nde saklanıyor — Sukuna'nın bazı parmaklarıyla aynı yerde. Mühür ne zaman vuruldu, kayıt söylemiyor.",
      en: "At some point Chōsō and his brothers are stored at Jujutsu High — in the same place as some of Sukuna's fingers. When the seal was set, the record does not say.",
    },
    mark: { text: "呪胎九相図", reading: { tr: "jutai kyūsōzu — sınıflandırmanın kendisi", en: "jutai kyūsōzu — the classification itself" } },
    imageKey: CHOUSOU_IMAGE_KEYS.fateSeal,
  },
  {
    key: "release",
    stamp: { tr: "yaş 150+ · serbest", en: "age 150+ · freed" },
    title: { tr: "Üçü birden", en: "The three at once" },
    text: {
      tr: "Chōsō, Eso ve Kechizu mühürden çıkıyor ve Mahito'nun grubunun yanında hareket ediyor. Kayıt Chōsō'nun derecesini burada veriyor: özel derece.",
      en: "Chōsō, Eso and Kechizu come out of the seal and move alongside Mahito's group. Here the record gives Chōsō's grade: special grade.",
    },
    mark: { text: "特級", reading: { tr: "tokkyū — özel derece", en: "tokkyū — special grade" } },
    imageKey: CHOUSOU_IMAGE_KEYS.fateRelease,
  },
  {
    key: "loss",
    stamp: { tr: "yaş 150+ · iki eksik", en: "age 150+ · two short" },
    title: { tr: "Sayı üçten bire düşüyor", en: "The count drops from three to one" },
    text: {
      tr: "Eso ve Kechizu o hattın sonunda kalıyor. Kayıt Chōsō'nun kardeşlerine düşkünlüğünü ve onları aşırı koruduğunu ayrıca yazıyor; bu durak o cümlenin bedeli.",
      en: "Eso and Kechizu stay at the end of that line. The record separately notes how attached and how fiercely protective Chōsō is of his brothers; this stop is what that sentence costs.",
    },
    mark: { text: "穿血", reading: { tr: "senketsu — tek yönlü, geri dönüşü olmayan", en: "senketsu — one direction, no way back" } },
    imageKey: CHOUSOU_IMAGE_KEYS.fateLoss,
  },
  {
    key: "turn",
    stamp: { tr: "yaş 150+ · tanıma", en: "age 150+ · recognition" },
    title: { tr: "Dokuz, dokuz kalmıyor", en: "Nine does not stay nine" },
    text: {
      tr: "Itadori ile dövüşürken gördüğü bir görüntüden sonra, Sukuna'nın kabının kendi küçük kardeşlerinden biri olduğuna ikna oluyor. Öfkesi bu noktada yön değiştiriyor ve onu Itadori'ye zarar vermeye yönlendiren Mahito'ya ve yanındaki lanetli ruhlara dönüyor.",
      en: "After a vision during his fight with Itadori, he becomes convinced that Sukuna's vessel is one of his younger brothers. At this point his fury changes direction and turns on Mahito and the cursed spirits beside him, who steered him into harming Itadori.",
    },
    mark: { text: "九 → 十", reading: { tr: "replik değil, sayının kendisi: dokuz → on", en: "not a line of dialogue but the number itself: nine → ten" } },
    imageKey: CHOUSOU_IMAGE_KEYS.fateTurn,
  },
] as const;

/** Kapanış — iki satır, motto ve kaynak künyesi. */
export const CHOUSOU_CLOSING = {
  quotes: [
    {
      text: "呪胎九相図",
      reading: { tr: "jutai kyūsōzu", en: "jutai kyūsōzu" },
      note: {
        tr: "Ne olduğunun adı. Dokuz aşamalı bir resim serisinin adıyla anılan dokuz rahim; Chōsō o serinin ilki.",
        en: "The name of what he is: nine wombs called after a nine-phase series of paintings — and Chōsō is the first of them.",
      },
      by: { tr: "Kayıttaki sınıflandırma", en: "The classification in the record" },
    },
    {
      text: "赤血操術",
      reading: { tr: "sekketsu sōjutsu", en: "sekketsu sōjutsu" },
      note: {
        tr: "Hem tekniğinin hem yarasının adı: ona geçen şey bir yetenek değil, karıştırılmış bir kandı.",
        en: "The name of his technique and of his injury at once: what reached him was not a talent but blood that had been mixed in.",
      },
      by: { tr: "Kayıttaki teknik adı", en: "The technique name in the record" },
    },
  ],
  motto: "赤鱗躍動",
  mottoNote: {
    tr: "sekirin yakudō — «kızıl pulun kıpırtısı». Kan durduğunda değil, kıpırdadığında iş görüyor; bu sayfadaki her hareket de o yüzden ağır ve sürekli.",
    en: "sekirin yakudō — “the stirring of the red scale.” Blood works when it moves, not when it stands still; that is why every movement on this page is heavy and continuous.",
  },
  credit: {
    tr: "Künye ve portre AniList'ten (karakter 157116, 31 Ağustos 2026); portre depoya indirildi, hotlink yok. Sayfadaki bütün damar, dallanma ve filigran desenleri elle çizilmiş SVG.",
    en: "Record and portrait from AniList (character 157116, 31 August 2026); the portrait was downloaded into the repository, no hotlinking. Every vein, branch and watermark pattern on this page is hand-drawn SVG.",
  },
  creditLink: { tr: "AniList · Chōsō #157116", en: "AniList · Chōsō #157116" },
  creditNote: {
    tr: "Sahne, teknik ve dönem kareleri üretilmedi: her biri boş bir küratör yuvası olarak duruyor ve görsel yokken bölümler görselsiz ama ayakta kalıyor.",
    en: "Scene, technique and period frames were not generated: each stands as an empty curator slot, and without images the sections stay standing, simply without pictures.",
  },
} as const;

/** Sayfanın en altındaki düzenleyicisiz özet. */
export const CHOUSOU_GAPS = {
  title: { tr: "Chōsō — boş kadrajlar", en: "Chōsō — empty frames" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bu sayfadaki bütün kadrajlar dolu.",
    en: "Every frame on this page is filled.",
  },
} as const;
