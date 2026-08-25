import type { LocalizedText } from "./types";

/**
 * Temari — "Üç Yıldız" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 2174 kaydının ABILITY yuvaları,
 * `temari:*` anahtarlarıyla. Görsel bağlı değilse bölüm görselsiz ama
 * AYAKTA çizilir; hiçbir bölüm yükleme bekleyerek çökmez.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (23 Ağustos), boy (165 cm), kan grubu (O), yaş aralığı (15–19)
 * ve rütbe satırı (Genin → Jōnin) AniList künyesinden birebir alındı
 * (`anilist-detay-22.json`, karakter 2174). "Tatlı kestane ve kenchin
 * çorbası" satırı da aynı künyenin açıklama metninde geçiyor — uydurma
 * değil. Köy, takım ve yelpaze satırlarını arşiv ekledi ve künye şeridinde
 * bu ayrım açıkça yazıyor.
 *
 * ⚠️ YAŞ ETİKETLERİ: AniList tek bir aralık veriyor (15–19), bölüm ayrımı
 * yok. Çizelgedeki "15 · I. bölüm" ve "17 · II. bölüm" etiketleri o aralığın
 * içinde kalıyor ve databook ayrımını izliyor; künye şeridinde ham aralık
 * olduğu gibi duruyor ki okuyan kaynağı görebilsin.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada karakterin ağzından TEK bir replik yok. Temari'nin doğrulanmış
 * bir cümlesini bulamadık; BRIEF §9 gereği emin olunmayan replik yazılmadı.
 * Kapanıştaki iki satır arşivin kendi kalemi ve künyesi de öyle diyor
 * ("Arşivin notu"), yani hiçbir yerde karakterin sözü gibi sunulmuyor.
 * Japonca motto bir replik değil, kanon teknik adı: 切り切り舞.
 */

export const TEMARI_ID = 2174;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const TEMARI_SITE_URL = "https://anilist.co/character/2174";

/**
 * Sergi görselleri — hepsi characterId 2174 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `temari:` önekli (kurator modu şartı).
 */
export const TEMARI_IMAGE_KEYS = {
  /** Hero: geniş çöl kadrajı, savrulan kum, sırtta yelpaze (16:9) */
  hero: "temari:hero",
  siblings: "temari:siblings",
  kamaitachi: "temari:kamaitachi",
  kirikiriMai: "temari:kirikiri-mai",
  daikamaitachi: "temari:daikamaitachi",
  tessen: "temari:tessen",
  windRead: "temari:wind-read",
  kamatari: "temari:kamatari",
  envoy: "temari:envoy",
  star1: "temari:star-1",
  star2: "temari:star-2",
  star3: "temari:star-3",
  fateChildhood: "temari:fate-childhood",
  fateExam: "temari:fate-exam",
  fateInvasion: "temari:fate-invasion",
  fateRescue: "temari:fate-rescue",
  fateWar: "temari:fate-war",
  closing: "temari:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const TEMARI_SLOT_LABELS: Record<string, LocalizedText> = {
  [TEMARI_IMAGE_KEYS.hero]: {
    tr: "Hero — geniş çöl kadrajı, savrulan kum, sırtta yelpaze (16:9)",
    en: "Hero — wide desert frame, blown sand, fan on her back (16:9)",
  },
  [TEMARI_IMAGE_KEYS.siblings]: {
    tr: "Suna'nın üç kardeşi bir arada",
    en: "Suna's three siblings together",
  },
  [TEMARI_IMAGE_KEYS.kamaitachi]: {
    tr: "Kamaitachi no Jutsu — savruluş ve hortum",
    en: "Kamaitachi no Jutsu — the swing and the twister",
  },
  [TEMARI_IMAGE_KEYS.kirikiriMai]: {
    tr: "Kirikiri Mai — Kamatari rüzgâra biniyor",
    en: "Kirikiri Mai — Kamatari riding the wind",
  },
  [TEMARI_IMAGE_KEYS.daikamaitachi]: {
    tr: "Daikamaitachi — yatan orman",
    en: "Daikamaitachi — the flattened forest",
  },
  [TEMARI_IMAGE_KEYS.tessen]: {
    tr: "Tessen — üç mor yıldızlı savaş yelpazesi, açık hâlde",
    en: "Tessen — the war fan open, three purple stars showing",
  },
  [TEMARI_IMAGE_KEYS.windRead]: {
    tr: "Dövüşü okuyan bakış — yelpaze kapalı, gözler rakipte",
    en: "Reading the fight — fan closed, eyes on the opponent",
  },
  [TEMARI_IMAGE_KEYS.kamatari]: {
    tr: "Kuchiyose: Kamatari — tek gözlü, orak taşıyan gelincik",
    en: "Kuchiyose: Kamatari — the one-eyed weasel with the sickle",
  },
  [TEMARI_IMAGE_KEYS.envoy]: {
    tr: "Suna elçiliği — Konoha kapısında resmî heyet",
    en: "Suna's envoy — an official delegation at Konoha's gate",
  },
  [TEMARI_IMAGE_KEYS.star1]: {
    tr: "Bir yıldız — yelpaze tek kademe açık",
    en: "One star — the fan open one notch",
  },
  [TEMARI_IMAGE_KEYS.star2]: {
    tr: "İki yıldız — yay genişlemiş, hortum dönüyor",
    en: "Two stars — the arc widened, the twister turning",
  },
  [TEMARI_IMAGE_KEYS.star3]: {
    tr: "Üç yıldız — yelpaze sonuna kadar açık",
    en: "Three stars — the fan opened to its limit",
  },
  [TEMARI_IMAGE_KEYS.fateChildhood]: {
    tr: "Çocukluk — Kazekage'nin evi",
    en: "Childhood — the Kazekage's house",
  },
  [TEMARI_IMAGE_KEYS.fateExam]: {
    tr: "Chūnin sınavı — havada kalan silahlar",
    en: "Chūnin exam — the weapons held in the air",
  },
  [TEMARI_IMAGE_KEYS.fateInvasion]: {
    tr: "Konoha harekâtı — kardeşini sırtlayıp ormandan çıkış",
    en: "The Konoha invasion — carrying her brother out of the forest",
  },
  [TEMARI_IMAGE_KEYS.fateRescue]: {
    tr: "Kurtarma görevi — Nara ormanına inen rüzgâr",
    en: "The retrieval mission — the wind coming down on the Nara forest",
  },
  [TEMARI_IMAGE_KEYS.fateWar]: {
    tr: "Dördüncü Savaş — uzun menzilli bölüğün hattı",
    en: "The Fourth War — the long-range division's line",
  },
  [TEMARI_IMAGE_KEYS.closing]: {
    tr: "Kapanış — kapalı yelpaze ve dinen kum",
    en: "Closing — the folded fan and the sand settling",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const TEMARI_IDENTITY = {
  name: "Temari",
  nativeName: "テマリ",
  /** Hero filigranı — dev fırça karakteri, dekoratif (aria-hidden) */
  watermark: "風",
  house: { tr: "Sunagakure — Kazekage'nin evi", en: "Sunagakure — the Kazekage's house" },
  epigraph: {
    tr: "Rüzgârı çağırmayı öğrenmeden önce okumayı öğrendi. Yelpazesindeki üç yıldız, ne kadarını çağıracağına verdiği karardır.",
    en: "She learned to read the wind before she learned to call it. The three stars on her fan are her decision about how much of it to call.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "23 Ağustos", en: "23 August" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "165 cm", en: "165 cm" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "O", en: "O" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "15–19 (AniList aralığı)", en: "15–19 (AniList range)" },
    },
    {
      label: { tr: "Rütbe", en: "Rank" },
      value: { tr: "Genin (I) → Jōnin (II)", en: "Genin (I) → Jōnin (II)" },
    },
    {
      label: { tr: "Köy", en: "Village" },
      value: { tr: "Sunagakure — Rüzgâr Ülkesi", en: "Sunagakure — the Land of Wind" },
    },
    {
      label: { tr: "Takım", en: "Team" },
      value: {
        tr: "Suna kardeşleri — Gaara, Kankurō; usta: Baki",
        en: "The Suna siblings — Gaara, Kankurō; sensei: Baki",
      },
    },
    {
      label: { tr: "Taşıdığı", en: "What she carries" },
      value: {
        tr: "Tessen — üç yıldızlı demir yelpaze",
        en: "A tessen — the three-starred iron fan",
      },
    },
    {
      label: { tr: "Sevdikleri", en: "Favourites" },
      value: {
        tr: "Tatlı kestane, kenchin çorbası",
        en: "Sweet chestnuts, kenchin soup",
      },
    },
  ],
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const TEMARI_HERO = {
  lede: {
    tr: "Suna'nın üç kardeşinin en büyüğü. Sırtındaki demir yelpaze hem silahı hem ölçüsü: karşısındakine ne kadar rüzgâr gerektiği sorusuna, yelpazeyi kaç yıldıza kadar açacağına karar vererek cevap verir.",
    en: "The eldest of Suna's three siblings. The iron fan on her back is both her weapon and her measure: she answers the question of how much wind an opponent needs by deciding how many stars to open.",
  },
  portraitAlt: {
    tr: "Temari'nin tam boy portresi — arşivin kendi yüklediği görsel.",
    en: "Full-length portrait of Temari — uploaded to this archive.",
  },
  portraitAltFallback: {
    tr: "Temari'nin AniList künye portresi (yaklaşık 230 piksel).",
    en: "Temari's AniList profile portrait (about 230 pixels).",
  },
  portraitNote: {
    tr: "Rüzgâr Ülkesi · Fūton kullanıcısı",
    en: "Land of Wind · Fūton user",
  },
} as const;

export const TEMARI_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "The Naruto Universe" },
} as const;

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

export const TEMARI_MODE = {
  enter: { tr: "Kamaitachi", en: "Cutting Whirlwind" },
  exit: { tr: "Rüzgârı indir", en: "Let the wind down" },
  hint: {
    tr: "Kesikler kenarlardan giriyor: bölümlerin köşeleri alındı, renk soğudu.",
    en: "The cuts come in from the edges: the sections lost their corners and the colour has cooled.",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const TEMARI_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "Profile" },
    lede: {
      tr: "Aşağıdaki satırların çoğu AniList kaydından geliyor; köy, takım ve yelpaze satırlarını arşiv ekledi.",
      en: "Most of the rows below come from the AniList record; the village, team and fan rows were added by the archive.",
    },
  },
  siblings: {
    title: { tr: "Ablanın işi", en: "The elder sister's work" },
    lede: {
      tr: "Kazekage'nin evinde üç çocuk vardı: biri kukla yapıyordu, birinin içinde bir canavar uyuyordu, biri de ikisini aynı masada tutuyordu.",
      en: "There were three children in the Kazekage's house: one made puppets, one had a monster asleep inside him, and one kept the other two at the same table.",
    },
  },
  jutsu: {
    title: { tr: "Rüzgârın üç ölçüsü", en: "Three measures of wind" },
    lede: {
      tr: "Üçü de aynı yelpazeden çıkar. Aralarındaki tek fark, yelpazenin ne kadar açıldığıdır.",
      en: "All three come out of the same fan. The only difference between them is how far it opens.",
    },
  },
  kit: {
    title: { tr: "Yanında taşıdıkları", en: "What she carries" },
    lede: {
      tr: "Bir demir yelpaze, bir kuchiyose sözleşmesi, bir okuma alışkanlığı ve iki köy arasında duran bir görev.",
      en: "An iron fan, a summoning contract, a reading habit, and a post that stands between two villages.",
    },
  },
  fan: {
    title: { tr: "Üç Yıldız", en: "Three Stars" },
    lede: {
      tr: "Yelpazeyi aç. Her kademede bir yıldız daha görünür, yay genişler, çağrılan rüzgâr büyür. Üçüncü yıldıza kadar açmak bir gösteri değil, bir karar.",
      en: "Open the fan. Each notch reveals one more star, the arc widens, and the wind she calls grows with it. Opening all the way to the third star is not a display; it is a decision.",
    },
  },
  fate: {
    title: { tr: "Yelpazenin açıldığı beş yer", en: "Five places the fan opened" },
    lede: {
      tr: "Ortadaki üç kayıt aynı yılın içinde geçti: I. bölümün tamamı Temari için tek bir yıl.",
      en: "The three records in the middle all fall inside one year: the whole of Part I is a single year for Temari.",
    },
  },
} as const;

/* ── Ablanın işi: bağlar ────────────────────────────────────────────────── */

export interface TemariBond {
  characterId: number;
  name: string;
  role: LocalizedText;
  note: LocalizedText;
}

/**
 * Portreler `companions` prop'undan geliyor (EXPERIENCE_COMPANIONS[2174] =
 * 1662 Gaara, 4694 Kankurō, 2007 Shikamaru, 22920 Rasa). Kaydı olmayan
 * karakterin kartı portresiz ama ayakta çizilir.
 */
export const TEMARI_BONDS: TemariBond[] = [
  {
    characterId: 1662,
    name: "Gaara",
    role: { tr: "Küçük kardeş · Beşinci Kazekage", en: "Younger brother · Fifth Kazekage" },
    note: {
      tr: "Künyesinde onu ürküten şeylerin listesi kısadır ve başında kendi kardeşi durur. Yıllarca Gaara'nın yanında sesini alçaltarak yürüdü. Konoha'dan sonra o çocuk değişti; Kazekage seçildiğinde arkasında duran ilk iki kişiden biri Temari'ydi.",
      en: "The list of things that frighten her is short, and her own brother stands at the top of it. For years she walked beside Gaara with her voice lowered. After Konoha that boy changed; when he was named Kazekage, Temari was one of the first two people standing behind him.",
    },
  },
  {
    characterId: 4694,
    name: "Kankurō",
    role: { tr: "Ortanca kardeş · Kukla ustası", en: "Middle brother · Puppet master" },
    note: {
      tr: "İkisi de dilini tutmayan tiptir, bu yüzden sürekli atışırlar. Sahada atışma biter ve sırt sırta dururlar: kuklalar yakını, rüzgâr uzağı tutar.",
      en: "Neither of them keeps their mouth shut, so they bicker constantly. In the field the bickering stops and they stand back to back: the puppets hold the near range, the wind holds the far.",
    },
  },
  {
    characterId: 22920,
    name: "Rasa",
    role: { tr: "Baba · Dördüncü Kazekage", en: "Father · Fourth Kazekage" },
    note: {
      tr: "Çocuklarını köyün silahı olarak yetiştirdi ve en küçüğünü bir canavarın kabına çevirdi. Temari'nin ablalığı, o evde kimsenin üstlenmediği işi üstlenmekle başladı.",
      en: "He raised his children as the village's weapons and turned the youngest into a vessel for a monster. Temari's role as elder sister began by taking on the job no one in that house would.",
    },
  },
  {
    characterId: 2007,
    name: "Shikamaru Nara",
    role: { tr: "Konoha bağı · Elçilik masası", en: "The Konoha tie · The envoy's desk" },
    note: {
      tr: "Onu sınav sahasında köşeye sıkıştıran tek kişi — üstelik hiç saldırmadan. Yıllar sonra iki köy arasındaki yazışmanın çoğu ikisinin masasından geçecek: Suna'nın elçisi, Konoha'nın gölgesiyle çalışacak.",
      en: "The only person who ever cornered her in the exam arena — and he did it without attacking. Years later most of the correspondence between the two villages would cross their desks: Suna's envoy working with Konoha's shadow.",
    },
  },
];

/* ── Rüzgârın üç ölçüsü ─────────────────────────────────────────────────── */

export interface TemariJutsu {
  key: "kamaitachi" | "kirikiriMai" | "daikamaitachi";
  name: string;
  kanji: string;
  turkish: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
}

export const TEMARI_JUTSU: TemariJutsu[] = [
  {
    key: "kamaitachi",
    name: "Kamaitachi no Jutsu",
    kanji: "鎌鼬の術",
    turkish: { tr: "Orak Gelincik Tekniği", en: "Sickle Weasel Technique" },
    tagline: {
      tr: "Görünmeyen bıçaklar taşıyan bir hortum.",
      en: "A twister that carries blades you cannot see.",
    },
    text: {
      tr: "Yelpazenin tek savruluşu havayı sıkıştırır ve önündeki koridoru bir hortuma çevirir. Yaralayan rüzgârın kendisi değil, içindeki kesiklerdir: karşıdaki, kimsenin dokunmadığı yerlerden açılır. Fūton'un ilk dersi burada — menzil, silahın uzunluğuyla değil bileğin ve ciğerin gücüyle ölçülür.",
      en: "A single swing of the fan compresses the air and turns the corridor in front of her into a twister. What wounds is not the wind but the cuts inside it: the opponent is opened where nothing touched them. This is Fūton's first lesson — range is measured by wrist and lungs, not by the length of a blade.",
    },
    traits: [
      { tr: "Fūton", en: "Fūton" },
      { tr: "Orta–uzun menzil", en: "Mid to long range" },
      { tr: "Saldırı", en: "Offensive" },
    ],
  },
  {
    key: "kirikiriMai",
    name: "Kirikiri Mai",
    kanji: "切り切り舞",
    turkish: { tr: "Kesip Kesip Dönen Dans", en: "The Cut-and-Whirl Dance" },
    tagline: {
      tr: "Üçüncü yıldız açıldığında çağrılan şey.",
      en: "What gets called when the third star shows.",
    },
    text: {
      tr: "Yelpaze sonuna kadar açılır, kan mürekkep olur ve rüzgârın içine tek gözlü bir gelincik biner: Kamatari. Elindeki orak, hortumun taşıdığı bütün kesikleri tek bir yöne toplar. Kirikiri Mai bir vuruş değil bir tarama — önündeki alan biçilir, geriye düzlük kalır.",
      en: "The fan opens all the way, blood becomes ink, and a one-eyed weasel rides into the wind: Kamatari. The sickle in his hand gathers every cut the twister carries into a single direction. Kirikiri Mai is not a strike but a sweep — the field in front of her is mown, and flat ground is what remains.",
    },
    traits: [
      { tr: "Kuchiyose", en: "Kuchiyose" },
      { tr: "Üç yıldız", en: "Three stars" },
      { tr: "Alan süpürme", en: "Area sweep" },
    ],
  },
  {
    key: "daikamaitachi",
    name: "Daikamaitachi no Jutsu",
    kanji: "大鎌鼬の術",
    turkish: { tr: "Büyük Orak Gelincik Tekniği", en: "Great Sickle Weasel Technique" },
    tagline: {
      tr: "Tek savruluşla bir ormanı yatırmak.",
      en: "One swing that lays a forest down.",
    },
    text: {
      tr: "Kamaitachi'nin çakra sınırına kadar büyütülmüş hâli. Temari bunu ölçüyü kaçırdığı için değil, saklanan bir düşmanı saklandığı yerle birlikte kaldırmak gerektiği için kullanır: ağaç kalmazsa gölge de kalmaz. Tayuya'yı bulduğu ormanda tam olarak bu oldu.",
      en: "Kamaitachi grown to the limit of her chakra. She uses it not because she has lost her sense of measure but because a hidden enemy sometimes has to be removed along with the place hiding them: no trees, no cover. That is exactly what happened in the forest where she found Tayuya.",
    },
    traits: [
      { tr: "Fūton", en: "Fūton" },
      { tr: "Geniş alan", en: "Wide area" },
      { tr: "Son ölçü", en: "Final measure" },
    ],
  },
];

/* ── Yanında taşıdıkları — dört küçük ───────────────────────────────────── */

export interface TemariKitItem {
  key: string;
  name: LocalizedText;
  note: LocalizedText;
  imageKey: string;
}

export const TEMARI_KIT: TemariKitItem[] = [
  {
    key: "tessen",
    name: { tr: "Tessen — üç yıldız", en: "Tessen — three stars" },
    note: {
      tr: "Demir kaburgalı savaş yelpazesi. Yüzündeki üç mor yıldız süs değil kademe işareti: kaç yıldız görünüyorsa o kadar rüzgâr çağrılmış demektir. Kapalıyken sopa, açıkken yelken — üstüne binip süzülür.",
      en: "An iron-ribbed war fan. The three purple stars on its face are notches, not decoration: the number showing is the amount of wind being called. Folded it is a club, open it is a sail — she rides it.",
    },
    imageKey: TEMARI_IMAGE_KEYS.tessen,
  },
  {
    key: "read",
    name: { tr: "Rüzgâr okuma ve taktik", en: "Reading the wind, and the tactics" },
    note: {
      tr: "AniList künyesi bile yazıyor: dövüş başladıktan kısa süre sonra rakibin planını ve zayıf yerini çıkarır. Çölde havayı okumakla aynı huy — hava nereden geliyorsa saldırı da oradan gelir.",
      en: "Even her AniList profile records it: soon after a fight begins she works out the opponent's plan and their weak point. The same habit as reading the desert air — the attack comes from wherever the wind does.",
    },
    imageKey: TEMARI_IMAGE_KEYS.windRead,
  },
  {
    key: "kamatari",
    name: { tr: "Kuchiyose: Kamatari", en: "Kuchiyose: Kamatari" },
    note: {
      tr: "Tek gözlü, orak taşıyan gelincik. Kendi başına dövüşmez; rüzgâra biner ve rüzgârın taşıdığı kesiği yönlendirir. Yelpaze üç yıldıza açılmadan çağrılmaz.",
      en: "A one-eyed weasel carrying a sickle. He does not fight on his own; he rides the wind and steers the cut it carries. He is not called before the fan reaches three stars.",
    },
    imageKey: TEMARI_IMAGE_KEYS.kamatari,
  },
  {
    key: "envoy",
    name: { tr: "Suna elçiliği", en: "Suna's envoy" },
    note: {
      tr: "Savaştan sonra iki köyün arasını tutan iş ona kaldı: ortak Chūnin sınavlarının düzeni, yazışma, Konoha'ya inen her resmî heyet. Kılıç işi değil takvim işi — ve ittifakı ayakta tutan da o.",
      en: "After the war the work of holding the two villages together fell to her: running the joint Chūnin exams, the correspondence, every official delegation arriving in Konoha. Calendar work rather than sword work — and it is what keeps the alliance standing.",
    },
    imageKey: TEMARI_IMAGE_KEYS.envoy,
  },
];

/* ── Üç Yıldız — sayfanın kalbi ─────────────────────────────────────────── */

export interface TemariStar {
  key: string;
  /** 1, 2, 3 — açılan yıldız sayısı, yayın genişliğini de bu belirliyor */
  stars: 1 | 2 | 3;
  title: LocalizedText;
  /** O kademede çağrılan şeyin kanon adı — çevrilmez */
  call: string;
  opens: LocalizedText;
  measure: LocalizedText;
  imageKey: string;
}

export const TEMARI_STARS: TemariStar[] = [
  {
    key: "one",
    stars: 1,
    title: { tr: "Bir yıldız — kesici rüzgâr", en: "One star — the cutting wind" },
    call: "Fūton",
    opens: {
      tr: "Yelpaze bir kademe açılır ve ilk mor yıldız görünür. Bu, tek bir hedefe yetecek kadar hava: dar bir koridor, keskin bir savruluş, bitmiş bir iş.",
      en: "The fan opens one notch and the first purple star appears. This is enough air for a single target: a narrow corridor, one sharp swing, a finished job.",
    },
    measure: {
      tr: "Temari'nin dövüşlerinin çoğu burada biter. Ölçüyü büyütmek güç göstermek değil, işi büyütmektir — ve o, işi büyütmeyi sevmez.",
      en: "Most of Temari's fights end here. Raising the measure is not a show of strength but an enlargement of the job — and she does not care for enlarging the job.",
    },
    imageKey: TEMARI_IMAGE_KEYS.star1,
  },
  {
    key: "two",
    stars: 2,
    title: { tr: "İki yıldız — Kamaitachi", en: "Two stars — Kamaitachi" },
    call: "Kamaitachi no Jutsu",
    opens: {
      tr: "Yay ikinci yıldıza kadar genişler. Artık tek bir koridor değil bir alan var: hortum döner ve içindeki kesikler önüne çıkan her şeye dağılır. Tenten'in bütün silahları bu genişlikte havada kaldı.",
      en: "The arc widens to the second star. There is no longer a corridor but a field: the twister turns and the cuts inside it spread across everything in front of it. Every one of Tenten's weapons was held in the air at this width.",
    },
    measure: {
      tr: "Bu kademede kimin nerede durduğunu bilmek zorundasın. Rüzgâr dostla düşmanı ayırmaz; ölçüyü tutan şey teknik değil, Temari'nin kafasındaki haritadır.",
      en: "At this notch you have to know where everyone is standing. Wind does not tell friend from foe; what holds the measure is not the technique but the map in Temari's head.",
    },
    imageKey: TEMARI_IMAGE_KEYS.star2,
  },
  {
    key: "three",
    stars: 3,
    title: { tr: "Üç yıldız — Kirikiri Mai", en: "Three stars — Kirikiri Mai" },
    call: "Kirikiri Mai · Kuchiyose: Kamatari",
    opens: {
      tr: "Yelpaze sonuna kadar açılır, üçüncü yıldız görünür ve rüzgâra bir binici gelir: Kamatari. Bundan sonrası tek bir tarama — ormansa orman, saftaysa saf.",
      en: "The fan opens to its limit, the third star appears, and the wind gets a rider: Kamatari. What follows is a single sweep — a forest if it is a forest, a rank if it is a rank.",
    },
    measure: {
      tr: "Üçüncü yıldız pazarlığın bittiği yerdir. Temari bunu açtıysa karşısındakini küçümsemeyi bırakmış, ölçmüş ve büyük bulmuştur.",
      en: "The third star is where the bargaining ends. If Temari has opened it, she has stopped underestimating her opponent — she has measured them and found them large.",
    },
    imageKey: TEMARI_IMAGE_KEYS.star3,
  },
];

/**
 * Üç Yıldız adasının arayüz metni. İstemci adasına `LocalizedText` inmez
 * (BRIEF §5): bunlar sunucuda `pick` ile düz dizeye çevrilip geçiliyor.
 */
export const TEMARI_FAN_UI = {
  listLabel: { tr: "Yelpazenin kademeleri", en: "The fan's notches" },
  starWord: { tr: "yıldız", en: "star" },
  openLabel: { tr: "Bir yıldız daha aç", en: "Open one more star" },
  foldLabel: { tr: "Yelpazeyi kapat", en: "Fold the fan" },
  opensLabel: { tr: "Açılan", en: "What opens" },
  measureLabel: { tr: "Ölçü", en: "The measure" },
  callLabel: { tr: "Çağrılan", en: "What is called" },
  keyboardHint: {
    tr: "Kademeler arasında ← ve → ile gez; Home ilk yıldıza, End üç yıldıza götürür.",
    en: "Move between the notches with ← and →; Home goes to the first star, End to the third.",
  },
  fanAlt: {
    tr: "Elle çizilmiş şema: demir kaburgalı savaş yelpazesi bir yay boyunca açılıyor, açılan her kademede yüzündeki mor yıldızlardan biri daha görünür oluyor.",
    en: "Hand-drawn diagram: an iron-ribbed war fan opening along an arc, each notch revealing one more of the purple stars on its face.",
  },
} as const;

/* ── Yelpazenin açıldığı beş yer ────────────────────────────────────────── */

export interface TemariFateEntry {
  key: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  imageKey: string;
}

export const TEMARI_TIMELINE: TemariFateEntry[] = [
  {
    key: "childhood",
    age: { tr: "Çocukluk", en: "Childhood" },
    title: { tr: "Kazekage'nin ilk çocuğu", en: "The Kazekage's first child" },
    text: {
      tr: "Rüzgâr Ülkesi'nin en büyük evinde doğdu ve üç kardeşin en büyüğü oldu. Annelerini en küçüğün doğumunda kaybettiler; babaları o küçüğü köyün silahı olarak yetiştirdi. Temari'ye düşen, o evde kimsenin istemediği işti: korkulan çocuğun ablası olmak.",
      en: "She was born into the largest house in the Land of Wind and became the eldest of three. They lost their mother at the youngest's birth; their father raised that youngest as the village's weapon. What fell to Temari was the job no one in that house wanted: being the feared child's elder sister.",
    },
    imageKey: TEMARI_IMAGE_KEYS.fateChildhood,
  },
  {
    key: "exam",
    age: { tr: "15 · I. bölüm", en: "15 · Part I" },
    title: { tr: "Chūnin sınavı: Tenten'e karşı tek yay", en: "Chūnin exam: one arc against Tenten" },
    text: {
      tr: "Eleme turunda karşısına silah ustası bir kız çıktı. Temari yelpazesini açtı, havaya atılan bütün kılıç ve tomarları rüzgârın içinde tuttu, sonra rakibini kapalı yelpazesinin üstüne düşürdü. Dövüş bir tur değil bir cümle sürdü — ve Temari kazandıktan sonra da dilini tutmadı.",
      en: "In the preliminaries she drew a weapons specialist. Temari opened her fan, held every blade and scroll thrown at her inside the wind, then let her opponent drop onto the folded fan. The fight lasted a sentence rather than a round — and after winning she did not hold her tongue either.",
    },
    imageKey: TEMARI_IMAGE_KEYS.fateExam,
  },
  {
    key: "invasion",
    age: { tr: "15 · I. bölüm", en: "15 · Part I" },
    title: { tr: "Shikamaru'nun karesi ve Konoha'dan çıkış", en: "Shikamaru's square, and the way out of Konoha" },
    text: {
      tr: "Finalde onu köşeye sıkıştıran kişi hiç saldırmayan biriydi: Shikamaru gölgesini uzattı, Temari'yi tam istediği kareye getirdi — ve sonra kendi eliyle çekildi. Aynı gün Konoha'ya harekât başladı; ablalık işi bu kez savaş alanında geri geldi. Temari ve Kankurō, Naruto'nun karşısında yığılan kardeşlerini sırtlayıp ormandan çıkardı.",
      en: "In the finals the one person who cornered her never attacked: Shikamaru stretched his shadow, walked Temari onto exactly the square he wanted — and then forfeited the match himself. The invasion of Konoha began the same day, and the elder-sister job came back on a battlefield. Temari and Kankurō carried their collapsed brother out of the forest.",
    },
    imageKey: TEMARI_IMAGE_KEYS.fateInvasion,
  },
  {
    key: "rescue",
    age: { tr: "15 · I. bölüm", en: "15 · Part I" },
    title: { tr: "Kurtarma görevi: gelen rüzgâr", en: "The retrieval mission: the wind arrives" },
    text: {
      tr: "Suna'nın üç kardeşi, bir yıl önce yıkmaya geldikleri köye bu kez yardıma geldi. Temari, Tayuya'nın flütü Shikamaru'yu bitirmeye dakikalar kala Nara ormanına indi ve tek bir Daikamaitachi ile hem ağaçları hem saklanacak yeri ortadan kaldırdı. Kurtardığı kişi, sınavda onu köşeye sıkıştıran kişiydi.",
      en: "Suna's three siblings came to help the village they had come to destroy a year earlier. Temari came down into the Nara forest minutes before Tayuya's flute could finish Shikamaru, and one Daikamaitachi removed the trees and the hiding place together. The person she saved was the person who had cornered her in the exam.",
    },
    imageKey: TEMARI_IMAGE_KEYS.fateRescue,
  },
  {
    key: "war",
    age: { tr: "17 · II. bölüm", en: "17 · Part II" },
    title: { tr: "Elçi, sonra bölük", en: "Envoy, then division" },
    text: {
      tr: "Kardeşi Kazekage seçildikten sonra Temari, Suna'nın Konoha'ya bakan yüzü oldu: ortak sınavların düzeni, yazışma, resmî heyetler. Dördüncü Shinobi Dünya Savaşı'nda Gaara'nın komutasındaki uzun menzilli Dördüncü Bölük'te savaştı — ittifakın en uzağa uzanan kolunda. Yıllar sonra Konoha'ya yerleşecek; oğlu iki köyün de çocuğu olacak.",
      en: "After her brother was named Kazekage, Temari became the face Suna turned toward Konoha: running the joint exams, the correspondence, the official delegations. In the Fourth Shinobi World War she fought in the long-range Fourth Division under Gaara's command — the arm of the alliance that reached furthest. Years later she would settle in Konoha; her son would belong to both villages.",
    },
    imageKey: TEMARI_IMAGE_KEYS.fateWar,
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const TEMARI_CLOSING = {
  /**
   * ⚠️ Bunlar REPLİK DEĞİL, arşivin kendi satırları — künye de öyle diyor.
   * Temari'nin doğrulanmış bir cümlesini bulamadığımız için hiçbir yerde
   * karakterin ağzından cümle yazılmadı (BRIEF §9).
   */
  lines: [
    {
      text: {
        tr: "Suna'nın en büyük kardeşi hiçbir zaman kurtarılmayı beklemedi; kurtarmaya giden hep o oldu.",
        en: "The eldest of Suna's siblings never waited to be rescued; she was always the one who went.",
      },
      by: { tr: "Arşivin notu", en: "From the archive" },
      note: {
        tr: "Kaynak: Sasuke kurtarma görevi, Nara ormanı.",
        en: "Source: the Sasuke retrieval mission, the Nara forest.",
      },
    },
    {
      text: {
        tr: "Yelpazesini üçüncü yıldıza kadar açtığı her seferde, aslında karşısındakinin ne kadar büyük olduğunu söylemiş oluyordu.",
        en: "Every time she opened her fan to the third star, she was really stating how large her opponent was.",
      },
      by: { tr: "Arşivin notu", en: "From the archive" },
      note: {
        tr: "Kaynak: Kirikiri Mai kademesi.",
        en: "Source: the Kirikiri Mai notch.",
      },
    },
  ],
  motto: "切り切り舞",
  mottoNote: {
    tr: "Kirikiri Mai — üçüncü yıldız göründüğünde çağrılan dans.",
    en: "Kirikiri Mai — the dance called when the third star shows.",
  },
  credit: {
    tr: "Künye satırları ve portre AniList kaydından; portrenin tam boy hâli arşivin kendi yüklemesidir. Jutsu adları, kronoloji ve bölük notu arşivin kendi kalemidir.",
    en: "The profile rows and the portrait come from the AniList record; the full-size portrait is this archive's own upload. Technique names, chronology and the division note are the archive's own.",
  },
  creditLink: {
    tr: "AniList · Temari #2174",
    en: "AniList · Temari #2174",
  },
} as const;

/* ── Görsel alt metinleri ───────────────────────────────────────────────── */

export const TEMARI_ALT = {
  bondSuffix: {
    tr: "portresi — arşivin karakter kaydından",
    en: "portrait — from this archive's character record",
  },
} as const;
