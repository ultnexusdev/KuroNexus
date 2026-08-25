import type { LocalizedText } from "./types";

/**
 * Nagato — "Acıyı Bil" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 3180 kaydının ABILITY yuvaları,
 * `nagato:*` anahtarlarıyla. Görsel bağlı değilse bölüm görselsiz ama
 * AYAKTA çizilir.
 *
 * ── AD MESELESİ ──────────────────────────────────────────────────────────
 * AniList bu numarayı **"Pain"** adıyla tutuyor (ana dildeki karşılığı da
 * ペイン, yani Pain'in katakanası — 長門 değil). "Pain" altı bedenin ortak
 * personası; sayfa ise personayı değil ONU anlatıyor. Bu yüzden başlık
 * "Nagato", filigran 長門, künye şeridinde de AniList'in kaydettiği adın
 * "Pain" olduğu AÇIKÇA yazılı. `roster.ts` yıllardır aynı eşleşmeyi
 * kullanıyor, sayfa ondan sapmıyor.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (19 Eylül), cinsiyet ve alternatif adlar AniList künyesinden
 * birebir alındı (24 Ağustos 2026 önbelleği, `anilist-detay-22.json`,
 * karakter 3180). Yaş, boy ve kan grubu o kayıtta **boş** ve `traits`
 * dizisi de boş — bu yüzden künye şeridinde uydurma bir sayı yok, bunun
 * yerine kaydın sustuğunu söyleyen bir satır var (BRIEF §9).
 *
 * Aynı sebeple kader çizelgesinin sol sütunu YAŞ değil DÖNEM taşıyor:
 * Nagato'nun yaşı AniList'te yok, anlatıda da tek bir yerde sabitlenmiyor.
 * Uydurulmuş beş sayı yerine beş dönem adı yazıldı.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada tırnak içinde YALNIZCA iki cümle var:
 *   1. 痛みを知れ — "Acıyı bil." (Konoha saldırısında söylenen, serinin en
 *      çok bilinen repliği; sayfanın kavramı da bu.)
 *   2. Jiraiya'nın Nagato'ya söylediği acı/naziklik cümlesi — arşivde ZATEN
 *      Jiraiya dosyasında (`jiraiya-experience.ts`) kayıtlı ve orada
 *      doğrulanmış hâliyle alındı.
 * Üç sorunun cevapları replik DEĞİL: arşivin kendi anlatımı, düz metin.
 * Emin olunmayan hiçbir cümle tırnağa alınmadı.
 */

export const NAGATO_ID = 3180;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const NAGATO_SITE_URL = "https://anilist.co/character/3180";

/** Altı Yol sergisinin giriş kapısı — `animeHref.akatsukiPath` bu anahtarı alır. */
export const NAGATO_SIX_PATHS_KEY = "deva";

/**
 * Sergi görselleri — hepsi characterId 3180 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `nagato:` önekli.
 *
 * ⚠️ Bu kayıtta BAŞKA sayfaların anahtarları da duruyor (`akatsuki:*`,
 * `path:*`, `era:*`, `world:*` — Akatsuki sergisi ve Altı Yol sayfaları).
 * Önek ayrımı bilinçli: bu sayfa onların hiçbirini okumuyor, onlar da
 * bunları görmüyor.
 */
export const NAGATO_IMAGE_KEYS = {
  /** Hero arkası: Ame'nin kuleleri, yağmur, paslı borular (21:9) */
  hero: "nagato:hero",
  rinnegan: "nagato:rinnegan",
  chibaku: "nagato:chibaku-tensei",
  shinra: "nagato:shinra-tensei",
  rinneTensei: "nagato:rinne-tensei",
  rods: "nagato:rods",
  gedoMazo: "nagato:gedo-mazo",
  rainNet: "nagato:rain-net",
  /** Çiviler bölümü: makineye bağlı beden */
  machine: "nagato:machine",
  fateOrphan: "nagato:fate-orphan",
  fateJiraiya: "nagato:fate-jiraiya",
  fateYahiko: "nagato:fate-yahiko",
  fatePain: "nagato:fate-pain",
  fateReturn: "nagato:fate-return",
  closing: "nagato:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const NAGATO_SLOT_LABELS: Record<string, LocalizedText> = {
  [NAGATO_IMAGE_KEYS.hero]: {
    tr: "Hero — Ame'nin kuleleri ve yağmur, figür küçük (21:9)",
    en: "Hero — the towers of Ame in the rain, small figure (21:9)",
  },
  [NAGATO_IMAGE_KEYS.rinnegan]: {
    tr: "Rinnegan — halkalı göz, yakın kadraj",
    en: "Rinnegan — the ringed eye, close crop",
  },
  [NAGATO_IMAGE_KEYS.chibaku]: {
    tr: "Chibaku Tensei — havada toplanan kaya küresi",
    en: "Chibaku Tensei — the sphere of earth gathering in the sky",
  },
  [NAGATO_IMAGE_KEYS.shinra]: {
    tr: "Shinra Tensei — itilen enkaz, düzleşen Konoha",
    en: "Shinra Tensei — the debris pushed out, Konoha flattened",
  },
  [NAGATO_IMAGE_KEYS.rinneTensei]: {
    tr: "Gedō: Rinne Tensei — ölülerin geri döndüğü an",
    en: "Gedō: Rinne Tensei — the moment the dead come back",
  },
  [NAGATO_IMAGE_KEYS.rods]: {
    tr: "Kara alıcı çubuklar — yakın kadraj",
    en: "Black chakra receivers — close crop",
  },
  [NAGATO_IMAGE_KEYS.gedoMazo]: {
    tr: "Gedō Mazō — dış yolun heykeli",
    en: "Gedō Mazō — the Demonic Statue of the Outer Path",
  },
  [NAGATO_IMAGE_KEYS.rainNet]: {
    tr: "Ame'nin yağmuru — sokakların üstündeki perde",
    en: "The rain of Ame — the curtain over the streets",
  },
  [NAGATO_IMAGE_KEYS.machine]: {
    tr: "Çiviler — makineye bağlı beden, kulenin içi",
    en: "The rods — the body wired to the machine, inside the tower",
  },
  [NAGATO_IMAGE_KEYS.fateOrphan]: {
    tr: "Savaş yılları — Ame'de yıkılmış bir ev",
    en: "The war years — a ruined house in Ame",
  },
  [NAGATO_IMAGE_KEYS.fateJiraiya]: {
    tr: "Çıraklık — üç çocuk ve öğretmenleri",
    en: "The apprenticeship — three children and their teacher",
  },
  [NAGATO_IMAGE_KEYS.fateYahiko]: {
    tr: "Yahiko'nun ölümü — yağmurun altındaki kunai",
    en: "Yahiko's death — the kunai under the rain",
  },
  [NAGATO_IMAGE_KEYS.fatePain]: {
    tr: "Pain yılları — Akatsuki ve Konoha'nın enkazı",
    en: "The Pain years — Akatsuki and the ruins of Konoha",
  },
  [NAGATO_IMAGE_KEYS.fateReturn]: {
    tr: "Son gün — Rinne Tensei ve dinen yağmur",
    en: "The last day — Rinne Tensei and the rain stopping",
  },
  [NAGATO_IMAGE_KEYS.closing]: {
    tr: "Kapanış — boş kule odası, sessiz yağmur",
    en: "Closing — the empty tower room, quiet rain",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const NAGATO_IDENTITY = {
  name: "Nagato",
  /** Sayfanın taşıdığı ana dildeki ad — AniList'inki (ペイン) DEĞİL */
  nativeName: "長門",
  /** Hero filigranı — dikey sütun, dekoratif (aria-hidden) */
  watermark: "長門",
  village: { tr: "Amegakure — Yağmur Köyü", en: "Amegakure — the Village Hidden by Rain" },
  epigraph: {
    tr: "Gözleri kendisinin değildi, bedeni onu taşımıyordu, adı başkasının yüzünde duruyordu. Yine de dünyaya barışı kendisinin getireceğine inandı.",
    en: "The eyes were not his own, the body would not carry him, and his name sat on someone else's face. He still believed he was the one who would bring the world peace.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "19 Eylül", en: "19 September" },
    },
    {
      label: { tr: "Cinsiyet", en: "Gender" },
      value: { tr: "Erkek", en: "Male" },
    },
    {
      label: { tr: "AniList'teki adı", en: "Name on AniList" },
      value: {
        tr: "Pain (ペイン) — altı bedenin ortak adı",
        en: "Pain (ペイン) — the shared name of the six bodies",
      },
    },
    {
      label: { tr: "Kayıttaki unvanlar", en: "Titles in the record" },
      value: {
        tr: "Kami (神) · Yogen no Ko (予言の子) · Kono Yo no Kyūseishu (この世の救世主)",
        en: "Kami (神) · Yogen no Ko (予言の子) · Kono Yo no Kyūseishu (この世の救世主)",
      },
    },
    {
      label: { tr: "Köy", en: "Village" },
      value: {
        tr: "Amegakure (雨隠れの里)",
        en: "Amegakure (雨隠れの里)",
      },
    },
    {
      label: { tr: "Klan", en: "Clan" },
      value: {
        tr: "Uzumaki — uzun ömrü ve chakra hacmi oradan",
        en: "Uzumaki — the long life and the chakra volume come from there",
      },
    },
    {
      label: { tr: "Dōjutsu", en: "Dōjutsu" },
      value: { tr: "Rinnegan (輪廻眼)", en: "Rinnegan (輪廻眼)" },
    },
    {
      label: { tr: "Örgüt", en: "Organisation" },
      value: {
        tr: "Akatsuki — görünürdeki lider",
        en: "Akatsuki — the visible leader",
      },
    },
    {
      label: { tr: "Ortağı", en: "Partner" },
      value: {
        tr: "Konan — üç yetimden geriye kalan",
        en: "Konan — the one left of the three orphans",
      },
    },
    {
      label: { tr: "Yanında duran", en: "What stayed beside him" },
      value: {
        tr: "Kara alıcı çubuklar ve onu ayakta tutan makine",
        en: "Black chakra receivers, and the machine that held him upright",
      },
    },
    {
      label: { tr: "Yaş · boy · kan grubu", en: "Age · height · blood type" },
      value: {
        tr: "AniList kaydında boş — arşiv sayı uydurmuyor",
        en: "Empty on the AniList record — the archive does not invent numbers",
      },
    },
  ],
} as const;

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

export const NAGATO_RAIN_TEXT = {
  enter: { tr: "Yağmur", en: "Rain" },
  exit: { tr: "Yağmuru durdur", en: "Stop the rain" },
  hint: {
    tr: "Yağmur bütün sayfaya iniyor: görseller griye düşüyor, yalnızca yazı yerinde kalıyor.",
    en: "The rain covers the whole page: the imagery drops to grey and only the writing stays where it was.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const NAGATO_HERO = {
  lede: {
    tr: "Amegakure'nin üstünde yıllarca yağmur yağdı ve o yağmur bir adamın chakrasıydı. Bu sayfa altı bedenin katalogu değil — yağmuru yağdıran aklın kaydı.",
    en: "For years it rained over Amegakure, and the rain was one man's chakra. This page is not a catalogue of the six bodies — it is the record of the mind that made the rain fall.",
  },
  eyeCaption: {
    tr: "Rinnegan: halkaları bu sayfanın tek geometrisi.",
    en: "The Rinnegan: its rings are the only geometry on this page.",
  },
  portraitAlt: {
    tr: "Nagato — arşive yüklenmiş kadro portresi",
    en: "Nagato — cast portrait uploaded to the archive",
  },
  portraitAltFallback: {
    tr: "Nagato — AniList künye portresi (kayıt bu karakteri “Pain” adıyla tutuyor)",
    en: "Nagato — AniList profile portrait (the record files this character as “Pain”)",
  },
} as const;

/**
 * Görsel alt metinleri — BRIEF §3.5: her alt iki dilli ve KAYNAĞINI söyler.
 * Yoldaş portrelerinin hepsi kendi veritabanımızdan (PORTRAIT yuvası).
 */
export const NAGATO_ALT = {
  faceSuffix: {
    tr: "— arşive yüklenmiş kadro portresi",
    en: "— cast portrait uploaded to the archive",
  },
} as const;

/* ── Breadcrumb ve bölüm başlıkları ─────────────────────────────────────── */

export const NAGATO_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "Naruto Universe" },
} as const;

export const NAGATO_SECTIONS = {
  record: {
    title: { tr: "Kayıt", en: "The record" },
    lede: {
      tr: "Kaydın kendisi de bir ad karışıklığıyla başlıyor. Arşiv onu düzeltmiyor, yanına not düşüyor.",
      en: "The record itself opens with a confusion of names. The archive does not correct it; it writes a note beside it.",
    },
  },
  arsenal: {
    title: { tr: "Halkanın üç işi", en: "Three works of the ring" },
    lede: {
      tr: "Rinnegan bir teknik listesi değil, bir yetki. Aşağıdaki üçü o yetkinin sayfaya sığan kısmı: gören göz, toplayan çekim, iten çekim.",
      en: "The Rinnegan is not a list of techniques but an authority. These three are the part of it that fits on a page: the eye that sees, the gravity that gathers, the gravity that pushes.",
    },
  },
  tools: {
    title: { tr: "Görünmeyen dört şey", en: "Four things nobody sees" },
    lede: {
      tr: "Bir tekniğin ekranda görünen kısmı hep sonuncusudur. Bunlar öncekiler.",
      en: "What a technique shows on screen is always the last part of it. These are the earlier ones.",
    },
  },
  faces: {
    title: { tr: "Yağmurun altındaki beş yüz", en: "Five faces under the rain" },
    lede: {
      tr: "Nagato'nun hikâyesinde beş kişi var ve beşi de aynı soruyu farklı yerinden tuttu.",
      en: "Five people stand in Nagato's story, and all five took hold of the same question from a different side.",
    },
  },
  debate: {
    title: { tr: "Üç soru", en: "Three questions" },
    lede: {
      tr: "Bu bölüm bir tartışma. Her soruyu aç: solda Nagato'nun cevabı, sağda ona verilen karşı cevap. Soru açıldıkça sayfaya yağmur iner; üçüncüsünde durur.",
      en: "This section is an argument. Open each question: Nagato's answer on the left, the reply on the right. As the questions open, rain falls across the page; at the third it stops.",
    },
  },
  rods: {
    title: { tr: "Çiviler", en: "The rods" },
    lede: {
      tr: "Sayfanın en sessiz bölümü, en ağır olanı.",
      en: "The quietest section on this page is the heaviest one.",
    },
  },
  fate: {
    title: { tr: "Kader çizelgesi", en: "A life in five entries" },
    lede: {
      tr: "Beş kayıt. Her kayıt bir öncekinden biraz daha derinde: sayfa da onunla birlikte iniyor.",
      en: "Five entries. Each one sits a little deeper than the last, and the page sinks with them.",
    },
  },
} as const;

/* ── Altı Yol sergisine bağlantı ────────────────────────────────────────── */

/**
 * Sitede Altı Yol'un ayrıntılı sergisi ZATEN var
 * (`/anime/akatsuki/six-paths/<key>`). Bu sayfa onu tekrarlamıyor: tek
 * cümle değinip kapıyı gösteriyor.
 */
export const NAGATO_SIX_PATHS_NOTE = {
  text: {
    tr: "Altı bedenin her biri ayrı bir yol, her yolun ayrı bir dosyası var. Bu sayfa onları saymıyor — arşivde kendi sergileri duruyor.",
    en: "Each of the six bodies is a separate path, and each path has its own file. This page does not count them — they have their own exhibit in the archive.",
  },
  link: {
    tr: "Altı Yol sergisi — Tendō'dan başla",
    en: "The Six Paths exhibit — start with Tendō",
  },
} as const;

/* ── Halkanın üç işi ────────────────────────────────────────────────────── */

export interface NagatoTechnique {
  key: "rinnegan" | "chibaku" | "shinra";
  /** `TechniqueSigil` bileşenindeki elle çizilmiş mühür */
  sigil: "rings" | "collapse" | "pushpull";
  imageKey: string;
  kanji: string;
  name: string;
  turkish: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
}

export const NAGATO_TECHNIQUES: NagatoTechnique[] = [
  {
    key: "rinnegan",
    sigil: "rings",
    imageKey: NAGATO_IMAGE_KEYS.rinnegan,
    kanji: "輪廻眼",
    name: "Rinnegan",
    turkish: { tr: "Samsara Gözü", en: "Samsara Eye" },
    tagline: {
      tr: "Üç büyük dōjutsu'nun en tepesi — ve Nagato'nun doğduğunda sahip olmadığı tek şey.",
      en: "The highest of the three great dōjutsu — and the one thing Nagato was not born with.",
    },
    text: {
      tr: "Halkalı göz, Rikudō Sennin'in gözü sayılır: beş doğa dönüşümünün hepsini ve altı yolun tekniklerini birden açar. Nagato'nun kullanımındaki asıl fark menzil değil, SAYI. Kara alıcı çubuklarla bağladığı bedenlerin her birine kendi chakrasını gönderiyor, altısını aynı anda yönetiyor ve altısının gördüğünü tek bir odada oturarak görüyordu. Gözlerin ona nereden geldiği ise hikâyenin en soğuk yeri: bebekken Madara Uchiha tarafından yerleştirilmişler. Yani sayfanın başındaki cümle tam anlamıyla doğru — gözler onun değildi.",
      en: "The ringed eye is said to be the eye of the Sage of the Six Paths: it opens all five nature transformations and the techniques of the six paths at once. What set Nagato's use apart was not range but COUNT. Through black chakra receivers he fed his own chakra into each bound body, drove six of them at the same time, and saw what all six saw while sitting in a single room. Where the eyes came from is the coldest part of the story: Madara Uchiha implanted them when he was an infant. So the line at the top of this page is literal — the eyes were not his.",
    },
    traits: [
      { tr: "Altı bedeni aynı anda", en: "Six bodies at once" },
      { tr: "Ortak görüş alanı", en: "One shared field of vision" },
      { tr: "Sonradan yerleştirildi", en: "Implanted, not inherited" },
    ],
  },
  {
    key: "chibaku",
    sigil: "collapse",
    imageKey: NAGATO_IMAGE_KEYS.chibaku,
    kanji: "地爆天星",
    name: "Chibaku Tensei",
    turkish: { tr: "Yeri Patlatan Gök Yıldızı", en: "Planetary Devastation" },
    tagline: {
      tr: "Bir çekim çekirdeği havaya bırakılır; yeryüzü onun etrafına sarılır.",
      en: "A core of gravity is released into the air, and the ground wraps itself around it.",
    },
    text: {
      tr: "Küçük, siyah bir çekirdek gökyüzüne çıkar ve altındaki her şeyi kendine çeker: toprak, kaya, bina, gövde. Yukarıda büyüyen şey bir hapishane — içine aldığını mühürler ve dünyanın üstünde asılı kalır. Nagato bunu Konoha'nın üstünde kullandı; savaşın ortasında gökyüzünde yeni bir ay belirdi. Tekniğin dürüstlüğü şurada: yıkım hedefe gitmiyor, hedefin altındaki zemini alıp götürüyor.",
      en: "A small black core rises into the sky and pulls everything beneath it upward: soil, rock, buildings, bodies. What grows up there is a prison — it seals whatever it swallows and hangs above the world. Nagato used it over Konoha, and a new moon appeared in the middle of a battle. The honesty of the technique is this: the destruction does not travel to the target, it takes away the ground the target is standing on.",
    },
    traits: [
      { tr: "Mühürleyerek bitirir", en: "Ends by sealing" },
      { tr: "Zemini alır", en: "Takes the ground" },
      { tr: "Gökte kalır", en: "Stays in the sky" },
    ],
  },
  {
    key: "shinra",
    sigil: "pushpull",
    imageKey: NAGATO_IMAGE_KEYS.shinra,
    kanji: "神羅天征",
    name: "Shinra Tensei · Banshō Ten'in",
    turkish: { tr: "İten ve çeken", en: "The push and the pull" },
    tagline: {
      tr: "Tek bir yeteneğin iki yönü: her şeyi uzaklaştır, ya da her şeyi kendine getir.",
      en: "One ability in two directions: drive everything away, or bring everything to you.",
    },
    text: {
      tr: "Shinra Tensei bir vuruş değil, bir itiş: temas olmadan, yönsüz, çevredeki her şeyi birden uzaklaştırır. Konoha'yı düzleyen şey buydu ve o ölçekte kullanmak Nagato'ya neredeyse bedeninin kalanına mal oldu. Banshō Ten'in aynı kuvvetin tersi — hedefi elin altına çeker. Tekniğin bilinen tek açığı ritmi: iki büyük itiş arasında birkaç saniyelik bir aralık var ve ölçek büyüdükçe aralık uzuyor. Kakashi bu aralığı savaşın ortasında sayarak buldu; Nagato'yu yenen şey gücü değil, saati oldu.",
      en: "Shinra Tensei is not a strike but a push: contactless, directionless, driving everything nearby away at once. It is what flattened Konoha, and using it at that scale cost Nagato nearly what was left of his body. Banshō Ten'in is the same force reversed — it drags the target into reach. The one known flaw is rhythm: a few seconds must pass between two large pushes, and the interval grows with the scale. Kakashi found that interval by counting in the middle of a battle; what beat Nagato was not power but a clock.",
    },
    traits: [
      { tr: "Temassız", en: "Contactless" },
      { tr: "Aralık gerektirir", en: "Needs an interval" },
      { tr: "Ölçek bedeli", en: "Scale has a price" },
    ],
  },
];

/* ── Görünmeyen dört şey ────────────────────────────────────────────────── */

export interface NagatoTool {
  key: string;
  imageKey: string;
  /** Yalnızca kaynağı doğrulanmış adların kanjisi var; olmayanlarda boş */
  kanji?: string;
  name: string;
  turkish: LocalizedText;
  note: LocalizedText;
}

export const NAGATO_TOOLS: NagatoTool[] = [
  {
    key: "rinne-tensei",
    imageKey: NAGATO_IMAGE_KEYS.rinneTensei,
    kanji: "外道・輪廻天生の術",
    name: "Gedō: Rinne Tensei no Jutsu",
    turkish: { tr: "Samsara Yeniden Doğuş", en: "Samsara of Heavenly Life" },
    note: {
      tr: "Belirli bir alanda yakın zamanda ölmüş herkesi geri getirir. Bedeli sabit ve pazarlıksız: kullananın hayatı. Nagato bunu bir kez kullandı, Konoha'da öldürdüğü herkes için, ve kullandığı yerde öldü.",
      en: "It brings back everyone who died recently within a given area. The price is fixed and not negotiable: the life of whoever uses it. Nagato used it once, for everyone he had killed in Konoha, and died where he used it.",
    },
  },
  {
    key: "receivers",
    imageKey: NAGATO_IMAGE_KEYS.rods,
    name: "Chakra Receiver",
    turkish: { tr: "Kara alıcı çubuklar", en: "Black chakra receivers" },
    note: {
      tr: "Bedenlere saplanan siyah çubuklar bir silah değil, bir kablo. Nagato'nun chakrasını taşıyor ve altı cesedi tek bir iradeye bağlıyorlar. Aynı çubuklardan bir kısmı onun kendi omurgasında — kumanda eden uçla kumanda edilen uç aynı malzeme.",
      en: "The black rods driven into the bodies are not weapons but cabling. They carry Nagato's chakra and bind six corpses to a single will. Some of the same rods are in his own spine — the controlling end and the controlled end are made of the same material.",
    },
  },
  {
    key: "gedo-mazo",
    imageKey: NAGATO_IMAGE_KEYS.gedoMazo,
    kanji: "口寄せ・外道魔像",
    name: "Kuchiyose: Gedō Mazō",
    turkish: { tr: "Dış Yolun Heykeli", en: "The Demonic Statue of the Outer Path" },
    note: {
      tr: "Kuyruklu canavarların çıktığı gövdenin boş kabuğu; Akatsuki'nin mühürleme törenleri onun ağzında yapılıyor. Nagato onu ilk kez genç yaşta çağırdı ve o gün bedenini kaybetti. Sayfanın bir sonraki bölümü o günün faturası.",
      en: "The empty husk of the body the tailed beasts came out of; Akatsuki's sealing ceremonies are performed at its mouth. Nagato summoned it for the first time when he was young, and lost his body that day. The next section of this page is the bill for that day.",
    },
  },
  {
    key: "rain-net",
    imageKey: NAGATO_IMAGE_KEYS.rainNet,
    turkish: { tr: "Ame'nin yağmur algılama ağı", en: "The rain-sensing net of Ame" },
    name: "Amegakure",
    note: {
      tr: "Köyün üstündeki yağmur doğal değil: damlaların içinde Nagato'nun chakrası var ve her damla bir duyu organı. Sokağa giren yabancı, daha adım atmadan sayılmış oluyor. Bir gözetim sistemi olarak kusursuz; bir hava durumu olarak tarif edilemez derecede yorucu.",
      en: "The rain over the village is not weather: Nagato's chakra is inside the drops and every drop is a sense organ. A stranger walking into a street is counted before the second step. As surveillance it is flawless; as a climate it is indescribably wearing.",
    },
  },
];

/* ── Yağmurun altındaki beş yüz ─────────────────────────────────────────── */

/**
 * `characterId` alanları `EXPERIENCE_COMPANIONS[3180]` listesiyle birebir
 * aynı: 23050 Yahiko, 3179 Konan, 2423 Jiraiya, 17 Naruto, 3149 Obito.
 * Portre kaydı olmayan kişi adıyla çizilir, bölüm çökmez.
 */
export const NAGATO_FACES = [
  {
    characterId: 23050,
    name: "Yahiko",
    role: { tr: "İlk yol", en: "The first path" },
    note: {
      tr: "Ame'nin barışını ilk isteyen çocuk. Öldükten sonra yüzü Pain'in yüzü oldu; dünyaya tanrı diye görünen surat aslında Nagato'nun en yakın arkadaşının suratıydı.",
      en: "The boy who wanted peace for Ame first. After he died his face became Pain's face; the countenance the world took for a god was in fact his closest friend's.",
    },
  },
  {
    characterId: 3179,
    name: "Konan",
    role: { tr: "Yanında kalan", en: "The one who stayed" },
    note: {
      tr: "Üç yetimden geriye kalan. Nagato'nun odasının kapısında yılları geçirdi, o öldükten sonra bedenini ve Yahiko'nunkini alıp götürdü.",
      en: "The one left of the three orphans. She spent years at the door of Nagato's room, and when he died she carried his body and Yahiko's away.",
    },
  },
  {
    characterId: 2423,
    name: "Jiraiya",
    role: { tr: "Öğretmen", en: "The teacher" },
    note: {
      tr: "Üç çocuğu doyurdu, sonra dövüşmeyi öğretti, sonra üç yıl kaldı. Nagato'nun gözlerini gördüğünde kehanetin çocuğunu bulduğunu sandı. Yanıldığını öğrenmesi yirmi yıl aldı ve öğrendiği yer öğrencisinin karşısıydı.",
      en: "He fed the three children, then taught them to fight, then stayed three years. When he saw Nagato's eyes he believed he had found the child of the prophecy. It took twenty years to learn he was wrong, and he learned it standing across from his own student.",
    },
  },
  {
    characterId: 17,
    name: "Naruto Uzumaki",
    role: { tr: "Cevap", en: "The answer" },
    note: {
      tr: "Aynı klanın adını, aynı öğretmeni ve aynı kaybı taşıyan çocuk. Nagato'nun sorusuna silahla değil, öğretmenlerinin yazdığı bir kitapla cevap verdi.",
      en: "A boy carrying the same clan name, the same teacher and the same loss. He answered Nagato's question not with a weapon but with a book their teacher had written.",
    },
  },
  {
    characterId: 3149,
    name: "Obito Uchiha",
    role: { tr: "Perdenin arkasındaki", en: "The one behind the curtain" },
    note: {
      tr: "Kendini Madara diye tanıtıp Akatsuki'yi Nagato'nun adı altında çalıştırdı. Nagato öldüğünde ilk giden o oldu ve gözleri aldı — sayfanın başındaki gözler, hikâyeyi ödünç veren elin eline geri döndü.",
      en: "He introduced himself as Madara and ran Akatsuki under Nagato's name. When Nagato died he was the first to arrive, and he took the eyes — the eyes at the top of this page went back to the hand that had lent them.",
    },
  },
] as const;

/* ── Üç soru — sayfanın kalbi ───────────────────────────────────────────── */

export const NAGATO_DEBATE_UI = {
  listLabel: {
    tr: "Nagato'nun sorduğu üç soru",
    en: "The three questions Nagato asked",
  },
  nagatoLabel: { tr: "Nagato", en: "Nagato" },
  hint: {
    tr: "Her soru bir düğme: Sekme tuşuyla gel, Enter ya da boşlukla aç.",
    en: "Each question is a button: reach it with Tab, open it with Enter or Space.",
  },
  gaugeLabel: { tr: "Yağmur", en: "Rain" },
  /** `data-step` 0–3 ile aynı sırada; 3. adımda yağmur duruyor. */
  weather: [
    { tr: "Hava kapalı, yağmıyor.", en: "Overcast. Not raining." },
    { tr: "Çiselemeye başladı.", en: "It has started to drizzle." },
    { tr: "Bastırıyor.", en: "It is coming down hard." },
    { tr: "Yağmur dindi.", en: "The rain has stopped." },
  ],
} as const;

export interface NagatoQuestion {
  key: string;
  /** Sorunun sırası — üçünün sırası bilgi taşıyor (yağmur onunla artıyor) */
  order: string;
  question: LocalizedText;
  /** Sol sütunda konuşan. Yazılmazsa Nagato (`NAGATO_DEBATE_UI.nagatoLabel`). */
  answerWho?: LocalizedText;
  answerLabel: LocalizedText;
  answer: LocalizedText;
  counter?: {
    who: string;
    label: LocalizedText;
    text: LocalizedText;
    quote?: { text: LocalizedText; by: LocalizedText };
  };
  /** Cevabı olmayan soru: karşı sütun yerine bu satır çizilir */
  silence?: { headline: LocalizedText; text: LocalizedText };
}

export const NAGATO_QUESTIONS: NagatoQuestion[] = [
  {
    key: "peace",
    order: "1",
    question: { tr: "Barış nasıl kurulur?", en: "How is peace made?" },
    answerLabel: { tr: "Ortak acı", en: "Shared pain" },
    answer: {
      tr: "Nagato'nun cevabı bir duygu değil, bir mekanizma: insanlar başkasının acısını ancak kendi bedeninde tattıklarında durur. O hâlde herkesin aynı anda kaybedeceği kadar büyük bir silah gerekir; silah kullanıldığında dünya acıyı öğrenir ve bir süre kimse kımıldayamaz. Bu barış değil, korkunun ürettiği duraklamadır — Nagato bunu da biliyordu. Duraklamanın bir gün biteceğini, insanların unutacağını ve döngünün yeniden başlayacağını kendisi söylüyordu. Cevabının kendi içindeki çatlağı görüyor ve yine de daha iyisini bulamadığı için onu savunuyordu.",
      en: "Nagato's answer is not a feeling but a mechanism: people stop only when they have tasted another's pain in their own body. Therefore you need a weapon large enough that everyone loses at the same moment; when it is used the world learns pain, and for a while nobody moves. That is not peace but a pause manufactured by fear — and he knew it. He said himself that the pause would end, that people would forget, and that the cycle would start again. He could see the crack running through his own answer, and defended it anyway because he had found nothing better.",
    },
    counter: {
      who: "Jiraiya",
      label: { tr: "Karşı cevap", en: "The reply" },
      text: {
        tr: "Öğretmeninin cevabı yoktu ve olmadığını saklamadı. Jiraiya'nın tuttuğu şey bir formül değil bir tutumdu: aramayı bırakmamak. Cevabı bir gün birinin bulacağına inandı, o inancı kimsenin okumadığı bir romana yazdı ve romanın adını verdiği çocuğu büyüttü. Nagato'ya söylediği cümle sayfanın kavramıyla tam olarak aynı yerden başlıyor, sonra ters yöne gidiyor.",
        en: "His teacher had no answer and did not hide that he had none. What Jiraiya held was not a formula but a posture: don't stop looking. He believed someone would find the answer one day, wrote that belief into a novel nobody read, and raised the boy he had named after it. The line he said to Nagato begins in exactly the same place as this page's title, then walks the other way.",
      },
      quote: {
        text: {
          tr: "Acıyı tanımak insanı nazik kılabilir. Acı insanı büyütür — nasıl büyüyeceğin ise sana kalmış.",
          en: "Knowing pain allows a person to be kind. Pain lets a person grow — and how you grow is up to you.",
        },
        by: { tr: "Jiraiya, Nagato'ya", en: "Jiraiya, to Nagato" },
      },
    },
  },
  {
    key: "justice",
    order: "2",
    question: { tr: "Adalet nedir?", en: "What is justice?" },
    answerLabel: { tr: "İntikam doğaldır", en: "Revenge is natural" },
    answer: {
      tr: "Nagato adaleti soyut bir terazi olarak değil, doğal bir zincir olarak tarif etti: seveni kaybeden acı çeker, acı çeken nefret eder, nefret eden öcünü ister. Bu zincirde hiçbir halka sapkın değil — hepsi insanın normal hâli. O yüzden Konoha'nın onun köyüne yaptığını “savaş”, kendisinin Konoha'ya yaptığını “terör” diye ayırmayı reddetti; ikisinin de aynı zincirin halkası olduğunu söyledi. Kendi ölçüsü buydu: adalet, çeken tarafın acısının büyüklüğüyle ölçülür ve ölçen de o taraftır.",
      en: "Nagato described justice not as an abstract scale but as a natural chain: whoever loses someone suffers, whoever suffers hates, whoever hates wants payment. No link in that chain is deviant — every one of them is the ordinary human condition. So he refused to file what Konoha did to his village as “war” and what he did to Konoha as “terror”; he said both were links in the same chain. That was his measure: justice is scaled by the size of the suffering party's pain, and the suffering party does the measuring.",
    },
    counter: {
      who: "Naruto Uzumaki",
      label: { tr: "Karşı cevap", en: "The reply" },
      text: {
        tr: "Naruto bu tarifi çürütmedi — çürütemezdi, çünkü zinciri kendi üstünde taşıyordu: aynı öğretmeni kaybetmişti ve ilk isteği tam olarak Nagato'nun tarif ettiği şeydi. Yaptığı tek şey zinciri kendi halkasında kesmekti. Ölçüyü değiştirmedi, hesabı kapatmayı reddetti; öldürmedi ve öldürmediğini bir konuşmayla değil, elindeki kunayı indirerek söyledi. Cevabı bir fikir değil, bir eksiltmeydi.",
        en: "Naruto did not refute the description — he could not, because he was carrying the chain himself: he had lost the same teacher, and his first want was exactly what Nagato had described. All he did was cut the chain at his own link. He did not change the measure; he refused to settle the account. He did not kill, and he said so not with a speech but by lowering the blade in his hand. His answer was not an idea but a subtraction.",
      },
    },
  },
  {
    key: "verdict",
    order: "3",
    question: { tr: "Kim haklıydı?", en: "Who was right?" },
    /* Bu sorunun sol sütununda konuşan Nagato DEĞİL: kimse cevap
       vermediği için söz arşivde kalıyor. */
    answerWho: { tr: "Arşiv", en: "The archive" },
    answerLabel: { tr: "Not", en: "Note" },
    answer: {
      tr: "Nagato öldürdüğü herkesi geri getirdi ve kendi hayatını verdi; bunu bir fikir değiştirdiği için değil, bir kişiye kredi açtığı için yaptı. Naruto barışı kurdu; sonra bir savaş daha çıktı ve o savaşta ölenler geri gelmedi. İkisi de yanılmadı, ikisi de kazanmadı.",
      en: "Nagato brought back everyone he had killed and gave his own life for it — not because he had changed his mind but because he had extended credit to one person. Naruto built peace; then another war came, and the people who died in it did not come back. Neither was wrong. Neither won.",
    },
    silence: {
      headline: { tr: "Bu soruya cevap yok.", en: "There is no answer to this one." },
      text: {
        tr: "Karşı sütun bilerek boş. Arşiv burada taraf tutmuyor: iki cevap da yukarıda, aynı puntoda ve aynı ciddiyetle duruyor. Yağmur da bu noktada dindi — çünkü tartışma bitmedi, yalnızca susuldu.",
        en: "The opposite column is deliberately empty. The archive takes no side here: both answers stand above, at the same size and with the same seriousness. The rain stopped at this point too — not because the argument ended, but because it went quiet.",
      },
    },
  },
];

/* ── Çiviler ────────────────────────────────────────────────────────────── */

export const NAGATO_RODS = {
  headline: {
    tr: "Tanrı gibi görünen adam yerinden kalkamıyordu.",
    en: "The man who looked like a god could not get up.",
  },
  lede: {
    tr: "Konoha'yı düzleyen güç bir savaş meydanından değil, kapalı bir odadan geldi. O odada bir makine ve makineye bağlı bir beden vardı.",
    en: "The force that flattened Konoha did not come from a battlefield but from a closed room. In that room there was a machine, and a body wired into it.",
  },
  figureAlt: {
    tr: "Elle çizilmiş şema: makine çerçevesine bağlı oturan bir gövde ve omurgasına giren altı kara çubuk.",
    en: "Hand-drawn diagram: a seated body wired into a machine frame, with six black rods entering the spine.",
  },
  notes: [
    {
      key: "machine",
      title: { tr: "Makine", en: "The machine" },
      text: {
        tr: "Gedō Mazō'yu ilk çağırdığı gün bedeni tükendi; bir daha yürümedi. Sonrasında hayatı, omurgasına giren çubukların bağlandığı bir aygıtın içinde geçti. O aygıt hem onu ayakta tutuyor hem de altı bedene chakra taşıyordu: yaşam desteği ve silah aynı makineydi.",
        en: "The day he first summoned the Gedō Mazō his body was spent; he never walked again. After that his life was lived inside a device the rods in his spine were wired into. That device kept him upright and carried chakra to the six bodies at the same time: the life support and the weapon were one machine.",
      },
    },
    {
      key: "distance",
      title: { tr: "Mesafe", en: "Distance" },
      text: {
        tr: "Konoha'da yürüyen, konuşan ve öldüren altı beden onun değildi. Kendisi kilometrelerce uzakta, bir kulenin içinde, kımıldamadan oturuyordu. Sayfadaki bütün yıkımın gerçek konumu burası: karanlık bir oda ve hareketsiz bir adam.",
        en: "The six bodies that walked, spoke and killed in Konoha were not him. He was kilometres away, inside a tower, sitting without moving. That is the true location of all the destruction on this page: a dark room and a motionless man.",
      },
    },
    {
      key: "bill",
      title: { tr: "Fatura", en: "The bill" },
      text: {
        tr: "Altı Yol'un her adımı onun chakrasından çıkıyordu; bir beden düştüğünde bedeli onun bedeni ödüyordu. Görünen güç ne kadar büyükse, görünmeyen fatura o kadar ağır. “Tanrı” kelimesini kendisi için kullandığında bunu bilerek kullanıyordu — bu kadar güçlü bir varlığın bu kadar çaresiz olabileceğini en iyi o biliyordu.",
        en: "Every step the Six Paths took came out of his chakra; when a body fell, his body paid for it. The larger the visible power, the heavier the invisible bill. When he used the word “god” about himself he used it knowingly — nobody understood better how helpless something that powerful could be.",
      },
    },
  ],
} as const;

/* ── Kader çizelgesi ────────────────────────────────────────────────────── */

/**
 * Çizelge satırı. Sol sütun YAŞ değil DÖNEM taşıyor (dosya başındaki nota
 * bak: AniList kaydında yaş yok, uydurulmuş beş sayı yazılmadı).
 * `quote` opsiyonel — beş kaydın yalnızca birinde replik var.
 */
export interface NagatoFateEntry {
  key: string;
  imageKey: string;
  era: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: LocalizedText };
}

export const NAGATO_TIMELINE: NagatoFateEntry[] = [
  {
    key: "orphan",
    imageKey: NAGATO_IMAGE_KEYS.fateOrphan,
    era: { tr: "Savaş yılları", en: "The war years" },
    title: {
      tr: "Başkasının savaşı, kendi evinde",
      en: "Someone else's war, inside his own house",
    },
    text: {
      tr: "Ame büyük ülkelerin savaşını kendi topraklarında karşıladı: savaşan taraflar başkaları, yıkılan köy Nagato'nunkiydi. Bir gece iki Konoha shinobisi evine girdi, anne ve babasını öldürdü. O gün çocuğun gözlerinde Rinnegan açıldı ve ilk kullandığı yerde iki ceset kaldı. Nagato hikâyesine bir kurban olarak değil, kurban ve fail aynı dakikada olarak başladı.",
      en: "Ame took the great countries' war onto its own soil: other people were fighting, and the village being destroyed was Nagato's. One night two Konoha shinobi came into his house and killed his mother and father. That day the Rinnegan opened in the child's eyes, and where he first used it two bodies were left. Nagato's story does not begin with him as a victim, but as victim and killer in the same minute.",
    },
  },
  {
    key: "jiraiya",
    imageKey: NAGATO_IMAGE_KEYS.fateJiraiya,
    era: { tr: "Çıraklık — üç yıl", en: "The apprenticeship — three years" },
    title: { tr: "Yağmurun üç yetimi", en: "Three orphans of the rain" },
    text: {
      tr: "Savaştan geriye aç üç çocuk kaldı: Yahiko, Konan ve konuşmayan Nagato. Jiraiya onları önce doyurdu, sonra dövüşmeyi öğretti, sonra üç yıl kaldı. Rinnegan'ı gördüğünde kehanetin çocuğunu bulduğunu düşündü. Üçlü, kendi ülkelerinde savaşı bitirmek için küçük bir örgüt kurdu; adını Akatsuki koydular ve o günlerde örgütün amacı gerçekten barıştı.",
      en: "Three hungry children were left over from the war: Yahiko, Konan, and Nagato who would not speak. Jiraiya fed them first, then taught them to fight, then stayed three years. When he saw the Rinnegan he decided he had found the child of the prophecy. The three founded a small organisation to end the war in their own country; they called it Akatsuki, and in those days its purpose really was peace.",
    },
  },
  {
    key: "yahiko",
    imageKey: NAGATO_IMAGE_KEYS.fateYahiko,
    era: { tr: "Kopuş", en: "The break" },
    title: { tr: "Yahiko'nun ölümü", en: "Yahiko's death" },
    text: {
      tr: "Hanzō ve Danzō'nun kurduğu tuzakta Konan rehin alındı ve Nagato'nun önüne tek bir seçenek kondu: arkadaşını öldür, kızı kurtar. Seçmesine izin verilmedi — Yahiko kendini Nagato'nun elindeki kunayın üstüne bıraktı. O günden sonra Nagato bir daha kendi adıyla konuşmadı. Arkadaşının bedenini bir çubukla bağladı, ilk yol o oldu, ve dünyaya kendini Pain diye tanıttı.",
      en: "In the trap laid by Hanzō and Danzō, Konan was taken hostage and Nagato was given one option: kill your friend, save the girl. He was not allowed to choose — Yahiko let himself fall onto the kunai in Nagato's hand. After that day Nagato never spoke in his own name again. He bound his friend's body with a rod, that became the first path, and he introduced himself to the world as Pain.",
    },
  },
  {
    key: "pain",
    imageKey: NAGATO_IMAGE_KEYS.fatePain,
    era: { tr: "Pain yılları", en: "The Pain years" },
    title: { tr: "Tanrı adını alan adam", en: "The man who took the name of a god" },
    text: {
      tr: "Akatsuki büyüdü ve amacı değişti: barış artık kuyruklu canavarların toplanmasıyla gelecekti. Nagato örgütün görünürdeki lideriydi; perdenin arkasında kendini Madara diye tanıtan biri vardı. Jiraiya öğrencisinin karşısına çıktı ve o dövüşten dönmedi. Ardından Konoha'ya gidildi: köy tek bir teknikle düzleştirildi ve Nagato'nun adı bir daha silinmemek üzere haritaya yazıldı.",
      en: "Akatsuki grew and its purpose changed: peace would now come from collecting the tailed beasts. Nagato was the organisation's visible leader; behind the curtain stood someone introducing himself as Madara. Jiraiya went to face his own student and did not come back from that fight. Then came Konoha: the village was flattened by a single technique, and Nagato's name was written onto the map for good.",
    },
  },
  {
    key: "return",
    imageKey: NAGATO_IMAGE_KEYS.fateReturn,
    era: { tr: "Son gün", en: "The last day" },
    title: { tr: "Bir konuşma ve dinen yağmur", en: "A conversation, and the rain stopping" },
    text: {
      tr: "Naruto altı bedeni tek tek düşürdükten sonra Nagato'nun odasına silahla değil bir kitapla girdi: öğretmenlerinin yazdığı, kimsenin okumadığı roman. Konuşma uzun sürdü ve kimse kimseyi ikna etmedi; Naruto yalnızca intikam almayacağını söyledi. Nagato buna karşılık kendi cevabını değil, kendi hayatını verdi: Rinne Tensei'yi kullandı, Konoha'da öldürdüğü herkesi geri getirdi ve orada öldü. Ölürken bıraktığı şey bir öğreti değil, bir kredi oldu.",
      en: "After bringing down the six bodies one by one, Naruto walked into Nagato's room carrying not a weapon but a book: the novel their teacher wrote and nobody read. The conversation was long and neither convinced the other; Naruto only said he would not take revenge. In return Nagato gave not his answer but his life: he used Rinne Tensei, brought back everyone he had killed in Konoha, and died there. What he left behind was not a doctrine but a line of credit.",
    },
    quote: {
      text: { tr: "Acıyı bil.", en: "Know pain." },
      by: {
        tr: "Nagato — Konoha'nın üstünde, Pain olarak",
        en: "Nagato — above Konoha, as Pain",
      },
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const NAGATO_CLOSING = {
  quotes: [
    {
      text: { tr: "Acıyı bil.", en: "Know pain." },
      by: { tr: "Nagato, Pain olarak", en: "Nagato, as Pain" },
      note: {
        tr: "Serinin en çok bilinen emri ve bu sayfanın adı. Bir tehdit gibi söylendi; aslında bir öğretme yöntemi olarak kastedilmişti.",
        en: "The best-known order in the series and the title of this page. It was spoken like a threat; it was meant as a method of teaching.",
      },
    },
    {
      text: {
        tr: "Acıyı tanımak insanı nazik kılabilir. Acı insanı büyütür — nasıl büyüyeceğin ise sana kalmış.",
        en: "Knowing pain allows a person to be kind. Pain lets a person grow — and how you grow is up to you.",
      },
      by: { tr: "Jiraiya, Nagato'ya", en: "Jiraiya, to Nagato" },
      note: {
        tr: "Aynı cümlenin başlangıcı, başka bir sonu. İki adam da acının öğrettiğine inanıyordu; yalnızca ne öğrettiği konusunda ayrıldılar.",
        en: "The same sentence at the start, a different ending. Both men believed pain teaches; they only disagreed about what it teaches.",
      },
    },
  ],
  motto: "痛みを知れ",
  mottoNote: {
    tr: "itami o shire — “acıyı bil”",
    en: "itami o shire — “know pain”",
  },
  credit: {
    tr: "Künye verileri (doğum günü, cinsiyet, alternatif adlar) ve yedek portre AniList'ten alınmıştır; kayıt bu karakteri “Pain” adıyla tutuyor, yaş/boy/kan grubu alanları boştur. Sayfadaki tam boy portre arşivin kendi yüklemesidir. Yağmur perdesi, Rinnegan halkaları, teknik mühürleri ve çivili beden şeması bu sayfa için elle çizilmiş SVG'lerdir.",
    en: "Profile data (birthday, gender, alternative names) and the fallback portrait come from AniList, where this character is filed as “Pain” and the age, height and blood-type fields are empty. The full-size portrait is the archive's own upload. The rain curtain, the Rinnegan rings, the technique sigils and the diagram of the wired body are SVGs drawn by hand for this page.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList profile" },
} as const;
