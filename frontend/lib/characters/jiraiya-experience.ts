import type { LocalizedText } from "./types";

/**
 * Jiraiya — "Yazarın El Yazması" deneyim sayfasının veri iskeleti.
 *
 * Sayfanın bütün görünen metni burada, iki dilli `LocalizedText` çiftleri
 * olarak (AGENTS.md kural 1; Itachi ve Zaraki emsallerinin devamı).
 * Bileşen `pick(text, locale)` ile seçer, istemci adalarına düz dize iner.
 *
 * ── SAYFANIN FİKRİ ────────────────────────────────────────────────────
 * Jiraiya bir ninja olmadan önce bir YAZAR. Kendi romanını yazdı, kitabı
 * satmadı, kahramanına Naruto adını verdi ve o ad bir çocuğa geçti; öleceğini
 * bilerek suyun dibinde son satırını yazdı. Sayfa bu yüzden bir el yazması:
 * kenarında murekkep lekeleri olan, bölümleri çevrilerek okunan bir parşömen.
 *
 * ── UYDURMA REPLİK YOK ────────────────────────────────────────────────
 * Jiraiya'nın romanı "Dokonjō Ninden"in satırları kanonda YAZILI DEĞİL —
 * yalnızca varlığı, kahramanının adı ve son bölümdeki şifre biliniyor. Bu
 * yüzden her el yazması sayfasındaki italik satır `margin` alanında duruyor
 * ve arayüzde açıkça "kenar notu" diye etiketleniyor: o cümleler ARŞİVİN
 * kalemidir, romandan alıntı değil. Gerçek replikler ayrı `quote` alanında
 * ve kaynağıyla birlikte veriliyor (BRIEF madde 9).
 *
 * Görseller veritabanında: characterId 2423 kaydının ABILITY yuvasında,
 * `jiraiya:*` anahtarlarıyla. Görsel inmemişse bölüm görselsiz ama ayakta
 * kalır — küratör sonradan yükler.
 */

export const JIRAIYA_ID = 2423;

/** Sayfanın görsel yuvaları — hepsi characterId 2423, ABILITY. */
export const JIRAIYA_IMAGE_KEYS = {
  /** Hero'nun arka kadrajı: yazı masası / Myōbokuzan (geniş, 16:9) */
  cover: "jiraiya:kapak",
  gamabunta: "jiraiya:gamabunta",
  rasengan: "jiraiya:rasengan",
  senninModo: "jiraiya:sennin-modo",
  hariJizo: "jiraiya:hari-jizo",
  yomiNuma: "jiraiya:yomi-numa",
  kebariSenbon: "jiraiya:kebari-senbon",
  gamaRinsho: "jiraiya:gama-rinsho",
  leaf1: "jiraiya:bolum-1",
  leaf2: "jiraiya:bolum-2",
  leaf3: "jiraiya:bolum-3",
  leaf4: "jiraiya:bolum-4",
  leaf5: "jiraiya:bolum-5",
  leaf6: "jiraiya:bolum-6",
} as const;

/** Küratör yuvasının başlığı — yönetici modda yükleme kutusunun etiketi. */
export const JIRAIYA_SLOT_LABELS: Record<string, LocalizedText> = {
  [JIRAIYA_IMAGE_KEYS.cover]: {
    tr: "Kapak sahnesi — yazı masası ya da Myōbokuzan (geniş)",
    en: "Cover scene — writing desk or Myōbokuzan (wide)",
  },
  [JIRAIYA_IMAGE_KEYS.gamabunta]: {
    tr: "Kuchiyose — Gamabunta",
    en: "Kuchiyose — Gamabunta",
  },
  [JIRAIYA_IMAGE_KEYS.rasengan]: { tr: "Rasengan", en: "Rasengan" },
  [JIRAIYA_IMAGE_KEYS.senninModo]: {
    tr: "Sennin Mōdo — Ma ve Pa ile füzyon",
    en: "Sennin Mōdo — fusion with Ma and Pa",
  },
  [JIRAIYA_IMAGE_KEYS.hariJizo]: {
    tr: "Hari Jizō — saç zırhı",
    en: "Hari Jizō — hair armour",
  },
  [JIRAIYA_IMAGE_KEYS.yomiNuma]: {
    tr: "Yomi Numa — bataklık",
    en: "Yomi Numa — swamp",
  },
  [JIRAIYA_IMAGE_KEYS.kebariSenbon]: {
    tr: "Kebari Senbon — saç iğneleri",
    en: "Kebari Senbon — hair needles",
  },
  [JIRAIYA_IMAGE_KEYS.gamaRinsho]: {
    tr: "Gama Rinshō — kurbağa şarkısı",
    en: "Gama Rinshō — the toads' song",
  },
  [JIRAIYA_IMAGE_KEYS.leaf1]: {
    tr: "Bölüm 一 — Hiruzen'in üç öğrencisi",
    en: "Chapter 一 — Hiruzen's three students",
  },
  [JIRAIYA_IMAGE_KEYS.leaf2]: {
    tr: "Bölüm 二 — Amegakure, üç yetim",
    en: "Chapter 二 — Amegakure, three orphans",
  },
  [JIRAIYA_IMAGE_KEYS.leaf3]: {
    tr: "Bölüm 三 — gezgin yazar",
    en: "Chapter 三 — the travelling author",
  },
  [JIRAIYA_IMAGE_KEYS.leaf4]: {
    tr: "Bölüm 四 — Minato ve kitaptaki ad",
    en: "Chapter 四 — Minato and the name in the book",
  },
  [JIRAIYA_IMAGE_KEYS.leaf5]: {
    tr: "Bölüm 五 — Naruto ile iki buçuk yıl",
    en: "Chapter 五 — two and a half years with Naruto",
  },
  [JIRAIYA_IMAGE_KEYS.leaf6]: {
    tr: "Bölüm 六 — suyun dibi",
    en: "Chapter 六 — the bottom of the water",
  },
};

/* ── Hero ─────────────────────────────────────────────────────────────── */

export const JIRAIYA_HERO = {
  name: "Jiraiya",
  /** Hero'nun büyük fırça filigranı — dekoratif, aria-hidden */
  watermark: "自来也",
  /** h1'in altındaki küçük satır: kendi taktığı ad */
  alias: "エロ仙人",
  aliasNote: {
    tr: "Ero-sennin — kendi seçtiği unvan",
    en: "Ero-sennin — the title he chose for himself",
  },
  lede: {
    tr: "Konoha'nın üç efsanevi ninjasından biri; Myōbokuzan'ın kurbağa bilgesi; iki Hokage'nin ustası. Ama kendini tarif ederken önce şunu söylerdi: yazar.",
    en: "One of Konoha's three legendary ninja; the toad sage of Myōbokuzan; teacher to two Hokage. Yet when he described himself, he said this first: novelist.",
  },
  /** Portrenin altındaki el yazısı künye */
  plateCaption: {
    tr: "Arşiv kaydı — künye portresi",
    en: "Archive record — profile portrait",
  },
  portraitAlt: {
    tr: "Jiraiya — arşive yüklenmiş künye portresi",
    en: "Jiraiya — profile portrait uploaded to the archive",
  },
  /** Kapak sahnesi bağlıysa görselin alt metni */
  coverAlt: {
    tr: "Jiraiya'nın dünyasından kapak sahnesi — arşive yüklenmiş görsel",
    en: "Cover scene from Jiraiya's world — image uploaded to the archive",
  },
} as const;

/* ── Sennin modu (istemci adasına düz dize iner) ──────────────────────── */

export const JIRAIYA_SENNIN = {
  enter: { tr: "Sennin modu", en: "Sage mode" },
  exit: { tr: "Sennin modundan çık", en: "Leave sage mode" },
} as const;

/* ── Künye şeridi ─────────────────────────────────────────────────────── */

export const JIRAIYA_IDENTITY = {
  title: { tr: "Künye", en: "Colophon" },
  lede: {
    tr: "Bir el yazmasının ilk yaprağı künyesidir: kimin eli, hangi tarih, hangi ölçü.",
    en: "The first leaf of a manuscript is its colophon: whose hand, which date, what measure.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "11 Kasım", en: "November 11" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "191,2 cm", en: "191.2 cm" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "B", en: "B" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "54 — öldüğünde", en: "54 — at death" },
    },
    {
      label: { tr: "Unvan", en: "Title" },
      value: {
        tr: "Densetsu no Sannin — Efsanevi Üç Ninja",
        en: "Densetsu no Sannin — the Legendary Three Ninja",
      },
    },
    {
      label: { tr: "Takım", en: "Team" },
      value: {
        tr: "Hiruzen Sarutobi'nin takımı — Tsunade, Orochimaru",
        en: "Hiruzen Sarutobi's team — Tsunade, Orochimaru",
      },
    },
    {
      label: { tr: "Doğa türü", en: "Nature type" },
      value: { tr: "Ateş · Toprak · Su", en: "Fire · Earth · Water" },
    },
    {
      label: { tr: "Sözleşme", en: "Contract" },
      value: {
        tr: "Myōbokuzan kurbağaları — Gamabunta, Fukasaku, Shima",
        en: "The toads of Myōbokuzan — Gamabunta, Fukasaku, Shima",
      },
    },
    {
      label: { tr: "Reddettiği makam", en: "Office declined" },
      value: {
        tr: "Beşinci Hokage'lik — yerine Tsunade'yi önerdi",
        en: "Fifth Hokage — he nominated Tsunade instead",
      },
    },
    {
      label: { tr: "Sembolik obje", en: "Symbolic object" },
      value: {
        tr: "Yazı fırçası ve kuchiyose parşömeni",
        en: "A writing brush and a summoning scroll",
      },
    },
    {
      label: { tr: "İlk kitabı", en: "First book" },
      value: {
        tr: "Dokonjō Ninden — hiç satmadı",
        en: "Dokonjō Ninden — it never sold",
      },
    },
    {
      label: { tr: "Öteki adları", en: "Other names" },
      value: {
        tr: "Ero-sennin · Gama-sennin · Kurbağa Bilgesi",
        en: "Ero-sennin · Gama-sennin · Toad Sage",
      },
    },
  ],
} as const;

/* ── Teknik laboratuvarı ──────────────────────────────────────────────── */

export interface JiraiyaTechnique {
  key: "gamabunta" | "rasengan" | "senninModo";
  kanji: string;
  name: string;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
}

export const JIRAIYA_LAB_TITLE = {
  title: { tr: "Fırça ve mühür", en: "Brush and seal" },
  lede: {
    tr: "Üç büyük teknik: birini bir dağ kadar kurbağa taşır, birini kendi öğrencisi tamamlar, birini yalnızca iki yaşlı kurbağayla birlikte kurabilir.",
    en: "Three great techniques: one is carried by a toad the size of a mountain, one is finished by his own student, one he can only assemble with two elderly toads.",
  },
} as const;

export const JIRAIYA_TECHNIQUES: readonly JiraiyaTechnique[] = [
  {
    key: "gamabunta",
    kanji: "口寄せの術",
    name: "Kuchiyose no Jutsu — Gamabunta",
    tagline: {
      tr: "Kan mühürlendi, dağ kadar kurbağa geldi",
      en: "The blood is sealed, and a toad the size of a mountain arrives",
    },
    text: {
      tr: "Myōbokuzan'la kurulan sözleşme Jiraiya'nın en eski bağı. Çağırdığı kurbağalar bir teknik değil bir hane: Gamabunta savaş alanının kendisini değiştirir, Gamaken ve Gamahiro kalkan olur, Fukasaku ile Shima ona bilgelik taşır. Kurbağalar konuşur, itiraz eder, içki ister — Jiraiya'nın hiçbir tekniği bu kadar kalabalık değildir.",
      en: "The contract with Myōbokuzan is Jiraiya's oldest bond. The toads he summons are not a technique but a household: Gamabunta rearranges the battlefield itself, Gamaken and Gamahiro become shields, Fukasaku and Shima carry wisdom to him. The toads talk back, argue, ask for a drink — no other technique of his is this crowded.",
    },
    traits: [
      { tr: "Kan mührü", en: "Blood seal" },
      { tr: "Myōbokuzan sözleşmesi", en: "Myōbokuzan contract" },
      { tr: "Savaş alanı ölçeği", en: "Battlefield scale" },
    ],
  },
  {
    key: "rasengan",
    kanji: "螺旋丸",
    name: "Rasengan",
    tagline: {
      tr: "Ustasının bıraktığı yarım cümle",
      en: "The half-sentence his teacher left behind",
    },
    text: {
      tr: "Minato'nun üç yıl çalışıp bitiremeden bıraktığı teknik: avuçta dönen, doğa türü taşımayan saf şekil manipülasyonu. Jiraiya onu tamamlayamadı ama sakladı ve sırayla aktardı — Minato'dan Jiraiya'ya, Jiraiya'dan Naruto'ya. Üç kuşak boyunca elden ele geçen bir taslak; sonunda onu bitiren, kitabındaki kahramanla aynı adı taşıyan çocuk oldu.",
      en: "The technique Minato worked on for three years and left unfinished: pure shape manipulation spinning in the palm, with no nature type in it. Jiraiya could not complete it, but he kept it and passed it on — Minato to Jiraiya, Jiraiya to Naruto. A draft handed down across three generations; the one who finally finished it was the boy who shared a name with the hero of his book.",
    },
    traits: [
      { tr: "Şekil manipülasyonu", en: "Shape manipulation" },
      { tr: "Mühürsüz", en: "No hand seals" },
      { tr: "Üç kuşak", en: "Three generations" },
    ],
  },
  {
    key: "senninModo",
    kanji: "仙人モード",
    name: "Sennin Mōdo",
    tagline: {
      tr: "Tek başına dengede duramadığı güç",
      en: "The power he cannot balance alone",
    },
    text: {
      tr: "Doğa enerjisini bedene çekmek bir insanı taşa çevirebilir. Jiraiya bu yüzden yalnız girmez: Fukasaku sol omzunda, Shima sağ omzunda, üçü tek beden gibi çalışır. Denge yine de tam değildir — burnu ve gözleri kurbağalaşır, yüzü değişir. Kanondaki en dürüst detay bu: sayfanın en güçlü hâli, aynı zamanda en gülünç göründüğü hâl.",
      en: "Drawing nature energy into the body can turn a person to stone. So Jiraiya does not enter alone: Fukasaku on his left shoulder, Shima on his right, the three working as one body. Even so the balance is imperfect — his nose and eyes turn toad-like, his face changes. That is the most honest detail in the canon: his strongest form is also the one where he looks most ridiculous.",
    },
    traits: [
      { tr: "Doğa enerjisi", en: "Nature energy" },
      { tr: "Füzyon — Ma ve Pa", en: "Fusion — Ma and Pa" },
      { tr: "Kurbağa yağı", en: "Toad oil" },
    ],
  },
];

export interface JiraiyaMinorTechnique {
  key: "hariJizo" | "yomiNuma" | "kebariSenbon" | "gamaRinsho";
  kanji: string;
  name: string;
  note: LocalizedText;
}

export const JIRAIYA_MINOR: readonly JiraiyaMinorTechnique[] = [
  {
    key: "hariJizo",
    kanji: "針地蔵",
    name: "Hari Jizō",
    note: {
      tr: "Beyaz saçını sertleştirip iğneden bir zırh örer; içindeki adam görünmez olur.",
      en: "He hardens his white hair into a shell of needles; the man inside disappears.",
    },
  },
  {
    key: "yomiNuma",
    kanji: "黄泉沼",
    name: "Yomi Numa",
    note: {
      tr: "Zemini dipsiz bir bataklığa çevirir. Ne kadar büyük gelirse o kadar derine batar.",
      en: "It turns the ground into a bottomless swamp. The bigger the thing that comes, the deeper it sinks.",
    },
  },
  {
    key: "kebariSenbon",
    kanji: "毛針千本",
    name: "Kebari Senbon",
    note: {
      tr: "Aynı saç, bu kez savurulan bin iğne. Zırh ile yağmur, tek maddenin iki hâli.",
      en: "The same hair, now a thousand thrown needles. Armour and rain: one material, two states.",
    },
  },
  {
    key: "gamaRinsho",
    kanji: "蝦蟇臨終",
    name: "Gama Rinshō",
    note: {
      tr: "Ma ile Pa'nın söylediği şarkı. Kılıç değil ses: duyanı kendi bedeninde kilitler.",
      en: "The song Ma and Pa sing. Not a blade but a sound: it locks the listener inside their own body.",
    },
  },
];

/* ── EL YAZMASI — sayfanın kalbi ──────────────────────────────────────── */

export interface JiraiyaLeaf {
  key: string;
  /** Bölüm rakamı — dekoratif, aria-hidden */
  folio: string;
  /** Bölüm başlığının Japonca karşılığı — dekoratif */
  folioKanji: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  /** Arşivin kendi kalemi — romandan ALINTI DEĞİL (bkz. dosya başı) */
  margin: LocalizedText;
  /** Gerçek replik; yalnızca kaynağından emin olunan yerlerde */
  quote?: { text: LocalizedText; by: LocalizedText };
  /** Son sayfadaki şifre — kanondaki hâliyle */
  cipher?: { glyphs: string; reading: LocalizedText };
  imageKey: string;
}

export const JIRAIYA_BOOK_TITLE = {
  title: { tr: "Dokonjō Ninden", en: "Dokonjō Ninden" },
  subtitle: {
    tr: "Aşırı İnatçı Bir Ninja'nın Hikâyesi",
    en: "The Tale of the Utterly Gutsy Shinobi",
  },
  lede: {
    tr: "Altı yapraklık bir el yazması. Sayfaları çevirin: her yaprakta hayatının bir bölümü ve kenarında bir not var.",
    en: "A manuscript of six leaves. Turn the pages: each leaf carries a chapter of his life, with a note in the margin.",
  },
  /** Kenar notlarının ne olduğunu açıkça söyleyen uyarı — dürüstlük şartı */
  disclaimer: {
    tr: "Romanın satırları kanonda yazılı değil; kenar notları arşivin kalemidir. Gerçek replikler kaynağıyla verilmiştir.",
    en: "The novel's own lines are not written down in the canon; the marginalia are the archive's hand. Genuine quotations are given with their source.",
  },
  marginLabel: { tr: "Kenar notu", en: "In the margin" },
  prev: { tr: "Önceki sayfa", en: "Previous page" },
  next: { tr: "Sonraki sayfa", en: "Next page" },
  pageWord: { tr: "Yaprak", en: "Leaf" },
  stackLabel: {
    tr: "El yazması — sayfalar arasında ok tuşlarıyla gezinin",
    en: "Manuscript — move between the leaves with the arrow keys",
  },
  goTo: { tr: "Yaprak", en: "Leaf" },
} as const;

export const JIRAIYA_LEAVES: readonly JiraiyaLeaf[] = [
  {
    key: "sannin",
    folio: "一",
    folioKanji: "三忍",
    age: { tr: "İkinci Shinobi Savaşı", en: "Second Shinobi War" },
    title: { tr: "Düşmanın verdiği ad", en: "The name the enemy gave" },
    text: {
      tr: "Hiruzen Sarutobi üç öğrenci aldı: bir kız, bir sessiz çocuk ve gürültülü olanı. Amegakure'de Hanzō'nun karşısına çıktıklarında üçü de ölmeliydi; ölmediler. Hanzō onları öldürmek yerine bir ad verdi — Sannin. Konoha'nın en büyük üç ninjası, adını düşmanının ağzından aldı ve o günden sonra üç ayrı yöne yürüdü.",
      en: "Hiruzen Sarutobi took three students: a girl, a quiet boy, and the loud one. When they faced Hanzō at Amegakure all three should have died; they did not. Instead of killing them Hanzō gave them a name — Sannin. Konoha's three greatest ninja took their title from an enemy's mouth, and from that day walked in three different directions.",
    },
    margin: {
      tr: "Üç ad, tek kaynak: Jiraiya, Tsunade ve Orochimaru 1839 tarihli bir halk masalından geliyor. Kishimoto onlara ad vermedi, ödünç verdi.",
      en: "Three names, one source: Jiraiya, Tsunade and Orochimaru come from an 1839 folktale. Kishimoto did not name them so much as lend them a name.",
    },
    imageKey: JIRAIYA_IMAGE_KEYS.leaf1,
  },
  {
    key: "ame",
    folio: "二",
    folioKanji: "雨隠れ",
    age: { tr: "Savaş sonrası — üç yıl", en: "After the war — three years" },
    title: { tr: "Yağmurun üç yetimi", en: "Three orphans of the rain" },
    text: {
      tr: "Savaş bitince geriye aç üç çocuk kaldı: Yahiko, Konan ve konuşmayan Nagato. Jiraiya onları besledi, sonra dövüşmeyi öğretti, sonra üç yıl yanlarında kaldı. Nagato'nun gözlerindeki Rinnegan'ı gördüğünde bu dünyaya barışı getirecek çocuğun o olduğunu düşündü. Yanıldığını öğrenmesi yirmi yıl aldı.",
      en: "When the war ended three hungry children were left: Yahiko, Konan, and Nagato who would not speak. Jiraiya fed them, then taught them to fight, then stayed three years. When he saw the Rinnegan in Nagato's eyes he decided this was the child who would bring peace to the world. It took him twenty years to learn he was wrong.",
    },
    margin: {
      tr: "Bir öğretmenin en tehlikeli cümlesi: bu çocuk seçilmiş olabilir. Jiraiya bunu hayatında iki kez söyledi ve ikisinde de bütün ağırlığı üstlendi.",
      en: "The most dangerous sentence a teacher can say: this child may be the chosen one. Jiraiya said it twice in his life, and both times took the whole weight of it onto himself.",
    },
    quote: {
      text: {
        tr: "Acıyı tanımak insanı nazik kılabilir. Acı insanı büyütür — nasıl büyüyeceğin ise sana kalmış.",
        en: "Knowing pain allows a person to be kind. Pain lets a person grow — and how you grow is up to you.",
      },
      by: { tr: "Jiraiya, Nagato'ya", en: "Jiraiya, to Nagato" },
    },
    imageKey: JIRAIYA_IMAGE_KEYS.leaf2,
  },
  {
    key: "author",
    folio: "三",
    folioKanji: "土産話",
    age: { tr: "Gezgin yıllar", en: "The travelling years" },
    title: { tr: "Satmayan kitap", en: "The book that did not sell" },
    text: {
      tr: "Konoha'ya döndü ama kalmadı. Yollarda casus ağını kurdu, hamamların önünde not tuttu, kendine bir unvan taktı: Ero-sennin. İlk romanı Dokonjō Ninden'i o yıllarda yazdı — asla pes etmeyen bir ninjanın hikâyesi. Kitap satmadı. Bir sonraki serisi, Icha Icha, ülkenin en çok satanı oldu. Hayatının en önemli cümlesini, kimsenin okumadığı kitaba yazmıştı.",
      en: "He returned to Konoha but did not stay. On the road he built his spy network, took notes outside bathhouses, and gave himself a title: Ero-sennin. In those years he wrote his first novel, Dokonjō Ninden — the story of a ninja who never gives up. It did not sell. His next series, Icha Icha, became the country's bestseller. He had written the most important sentence of his life into the book nobody read.",
    },
    margin: {
      tr: "Mizah ve hüzün aynı elden çıkıyor. Aynı adam hem hamam duvarından not alıyor hem de bir çocuğa ad veriyor.",
      en: "The comedy and the grief come from the same hand. The same man takes notes at a bathhouse wall and gives a child his name.",
    },
    imageKey: JIRAIYA_IMAGE_KEYS.leaf3,
  },
  {
    key: "minato",
    folio: "四",
    folioKanji: "名付け",
    age: { tr: "Dördüncü Hokage'nin ustası", en: "Teacher of the Fourth Hokage" },
    title: { tr: "Kitaptaki ad", en: "The name in the book" },
    text: {
      tr: "Minato Namikaze onun öğrencisiydi ve satmayan kitabı okuyan sayılı kişiden biri. Kahramanın adını sevdi. Oğlu doğduğunda o adı ona verdi ve Jiraiya'dan vaftiz babası olmasını istedi. Böylece bir romanın kahramanı, kâğıttan çıkıp Konoha'da yürümeye başladı — ve romanı yazan adam, kendi kurgusunun sorumluluğunu üstlendi.",
      en: "Minato Namikaze was his student, and one of the few people who read the book that did not sell. He liked the hero's name. When his son was born he gave the boy that name and asked Jiraiya to be his godfather. So the hero of a novel stepped off the page and began walking around Konoha — and the man who wrote him took responsibility for his own fiction.",
    },
    margin: {
      tr: "Sayfada bir ad seçtin diye bir çocuğun kaderini yazmış olmuyorsun. Ama Jiraiya öyle davrandı.",
      en: "Choosing a name on a page does not mean you have written a child's fate. Jiraiya behaved as though it did.",
    },
    imageKey: JIRAIYA_IMAGE_KEYS.leaf4,
  },
  {
    key: "naruto",
    folio: "五",
    folioKanji: "師弟",
    age: { tr: "İki buçuk yıl", en: "Two and a half years" },
    title: { tr: "Adaşıyla yolculuk", en: "Travelling with his namesake" },
    text: {
      tr: "Naruto'ya önce Rasengan'ı verdi — Minato'nun bitiremediği taslağı. Sonra kurbağa sözleşmesini. Sonra iki buçuk yıl boyunca ülkeyi dolaştı onunla: eğitim kadar yol arkadaşlığı, ders kadar şaka. Kendi kitabındaki kahramana ne öğretmek istediyse, o adı taşıyan çocuğa onu öğretti. Bir yazarın karakterini ete kemiğe büründürme biçimi buydu.",
      en: "First he gave Naruto the Rasengan — the draft Minato never finished. Then the toad contract. Then two and a half years of walking the country with him: as much companionship as training, as much joking as instruction. Whatever he had wanted to teach the hero of his book, he taught to the boy who carried that name. This was one author's way of giving his character a body.",
    },
    margin: {
      tr: "Öğretmenliğin ölçüsü öğrencinin kazandığı dövüş değil, ustası olmadan verdiği ilk karardır.",
      en: "The measure of a teacher is not the fight the student wins, but the first decision the student makes without him.",
    },
    imageKey: JIRAIYA_IMAGE_KEYS.leaf5,
  },
  {
    key: "water",
    folio: "六",
    folioKanji: "結末",
    age: { tr: "Son bölüm", en: "The final chapter" },
    title: { tr: "Suyun dibindeki satır", en: "The line at the bottom of the water" },
    text: {
      tr: "Amegakure'nin altında, Pain'in altı bedeni karşısında sol kolunu ve gırtlağını kaybetti. Konuşamıyordu; yazabiliyordu. Fukasaku'nun sırtına bir şifre kazıdı — çözümü, kimsenin okumadığı kendi romanının satırlarındaydı. Sonra suya bıraktı kendini. Son düşüncesi bir eleştiriydi: hikâyesinin sonunu değerlendirdi ve fena bulmadı.",
      en: "Beneath Amegakure, facing Pain's six bodies, he lost his left arm and his throat. He could not speak; he could write. He carved a cipher into Fukasaku's back — its key lay in the lines of his own unread novel. Then he let himself go into the water. His last thought was a review: he considered the ending of his story, and did not think it was bad.",
    },
    margin: {
      tr: "Ölürken bile yazdı. Bu sayfanın bütün fikri o tek hareketten geliyor.",
      en: "Even while dying, he wrote. The whole idea of this page comes from that single gesture.",
    },
    cipher: {
      glyphs: "ホンモノハイナイ",
      reading: {
        tr: "«Gerçek olan aralarında değil» — şifrenin çözümü, Naruto onu kendi kitabından okudu.",
        en: "«The real one is not among them» — the solved cipher, which Naruto read out of his own book.",
      },
    },
    imageKey: JIRAIYA_IMAGE_KEYS.leaf6,
  },
];

/* ── Kader çizelgesi ──────────────────────────────────────────────────── */

export interface JiraiyaFateStep {
  key: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: LocalizedText };
  /** Adımda portresi görünecek karakterler — companions prop'undan çözülür */
  companions: { id: number; name: string }[];
}

export const JIRAIYA_FATE_TITLE = {
  title: { tr: "Kader çizelgesi", en: "The ledger of fate" },
  lede: {
    tr: "Jiraiya'nın hikâyesi tekniklerle değil insanlarla ilerliyor: bir usta, üç yetim, iki öğrenci ve karşısına dikilen kendi başarısızlığı.",
    en: "Jiraiya's story moves through people, not techniques: one teacher, three orphans, two students, and his own failure standing across from him.",
  },
} as const;

export const JIRAIYA_FATE: readonly JiraiyaFateStep[] = [
  {
    key: "sannin",
    age: { tr: "Genç — İkinci Savaş", en: "Young — Second War" },
    title: { tr: "Hanzō'nun verdiği ad", en: "The name Hanzō gave" },
    text: {
      tr: "Hiruzen'in üç öğrencisi Amegakure'de Hanzō'nun karşısında sağ kaldı. Düşmanları onlara Sannin adını verdi; o ad üçünü de ömür boyu taşıdı, ama aynı yolda tutmadı.",
      en: "Hiruzen's three students survived Hanzō at Amegakure. Their enemy called them the Sannin; the name carried all three for life, but it did not keep them on the same road.",
    },
    companions: [
      { id: 7571, name: "Hiruzen Sarutobi" },
      { id: 2767, name: "Tsunade" },
      { id: 2455, name: "Orochimaru" },
    ],
  },
  {
    key: "nagato",
    age: { tr: "Üç yıl — Amegakure", en: "Three years — Amegakure" },
    title: { tr: "Ame'nin yetimleri", en: "The orphans of Ame" },
    text: {
      tr: "Yahiko, Konan ve Nagato. Üç yıl kaldı, üçüne de ninjutsu öğretti ve Rinnegan'ı taşıyan çocuğu barışın anahtarı sandı. Yıllar sonra o çocuk Pain adını almış olarak karşısına çıktı.",
      en: "Yahiko, Konan and Nagato. He stayed three years, taught all three ninjutsu, and mistook the boy with the Rinnegan for the key to peace. Years later that boy came back to face him under the name Pain.",
    },
    quote: {
      text: {
        tr: "Acıyı tanımak insanı nazik kılabilir. Acı insanı büyütür — nasıl büyüyeceğin ise sana kalmış.",
        en: "Knowing pain allows a person to be kind. Pain lets a person grow — and how you grow is up to you.",
      },
      by: { tr: "Jiraiya, Nagato'ya", en: "Jiraiya, to Nagato" },
    },
    companions: [{ id: 3180, name: "Nagato" }],
  },
  {
    key: "minato",
    age: { tr: "Konoha — savaş yılları", en: "Konoha — the war years" },
    title: { tr: "Dördüncü Hokage'nin ustası", en: "Teacher of the Fourth Hokage" },
    text: {
      tr: "Minato Namikaze onun elinde yetişti ve Hokage oldu. Jiraiya'nın satmayan romanını okuyup kahramanın adını beğendi — oğluna o adı verdi ve ustasını vaftiz baba yaptı.",
      en: "Minato Namikaze grew up under his hand and became Hokage. He read Jiraiya's unsold novel, liked the hero's name — gave it to his son, and made his teacher the boy's godfather.",
    },
    companions: [{ id: 2535, name: "Minato Namikaze" }],
  },
  {
    key: "naruto",
    age: { tr: "İki buçuk yıl", en: "Two and a half years" },
    title: { tr: "Adaşının ustası", en: "Teacher of his namesake" },
    text: {
      tr: "Rasengan, kurbağa sözleşmesi ve iki buçuk yıllık yol. Jiraiya, kitabındaki karakteri gerçek bir çocuk olarak yetiştirdi; Naruto ise ustasının bitiremediği tekniği bitirdi.",
      en: "The Rasengan, the toad contract, and two and a half years on the road. Jiraiya raised the character from his book as an actual boy; Naruto finished the technique his teacher never could.",
    },
    companions: [{ id: 17, name: "Naruto Uzumaki" }],
  },
  {
    key: "pain",
    age: { tr: "54 — son görev", en: "54 — the last mission" },
    title: { tr: "Suyun dibindeki şifre", en: "The cipher under the water" },
    text: {
      tr: "Amegakure'ye tek başına girdi ve kendi öğrencisiyle karşılaştı. Kolunu ve sesini kaybetti, ama son hareketi bir kaçış değil bir yazı oldu: Fukasaku'nun sırtına kazıdığı şifre Konoha'yı kurtardı. Sonra sessizce suya bıraktı kendini.",
      en: "He walked into Amegakure alone and met his own student. He lost his arm and his voice, but his last act was not an escape, it was a piece of writing: the cipher he carved into Fukasaku's back saved Konoha. Then he quietly let himself sink.",
    },
    quote: {
      text: {
        tr: "Bir shinobi'nin değeri nasıl yaşadığıyla değil, nasıl öldüğüyle ölçülür.",
        en: "The true measure of a shinobi is not how he lives but how he dies.",
      },
      by: { tr: "Jiraiya", en: "Jiraiya" },
    },
    companions: [{ id: 3180, name: "Pain" }],
  },
];

/* ── Kapanış ──────────────────────────────────────────────────────────── */

export const JIRAIYA_CLOSING = {
  title: { tr: "Son yaprak", en: "The last leaf" },
  quotes: [
    {
      text: {
        tr: "İnsanlar sevmeyi öğrendikleri an, nefreti taşıma riskini de alırlar.",
        en: "The moment people come to know love, they run the risk of carrying hate.",
      },
      by: { tr: "Jiraiya", en: "Jiraiya" },
    },
    {
      text: {
        tr: "Jiraiya Cengâver'in Hikâyesi… Sonu hiç de fena değil.",
        en: "The Tale of Jiraiya the Gallant… The ending is not bad at all.",
      },
      by: {
        tr: "Jiraiya'nın son düşüncesi",
        en: "Jiraiya's final thought",
      },
    },
  ],
  motto: "自来也豪傑物語",
  mottoNote: {
    tr: "Jiraiya Gōketsu Monogatari — 1839'da yazılmış halk masalının adı; ölürken kendi hayatına da o adı verdi.",
    en: "Jiraiya Gōketsu Monogatari — the title of an 1839 folktale; as he died he gave the same title to his own life.",
  },
  credit: {
    tr: "Künye verileri ve varsayılan portre AniList'ten alınmıştır; portre arşive elle yüklenmiştir. Sahne ve teknik görselleri küratör yuvalarında bekliyor — dolmayan yuva sayfada boş bırakılır. Dağ silüetleri, kurbağa, mürekkep lekeleri ve spiral bu arşiv için elle çizilmiş SVG'lerdir.",
    en: "Profile data and the default portrait come from AniList; the portrait was uploaded to the archive by hand. Scene and technique images are waiting in curator slots — an unfilled slot is simply left empty on the page. The mountain silhouettes, the toad, the ink blots and the spiral are SVGs drawn by hand for this archive.",
  },
  creditLink: {
    tr: "AniList kaydı",
    en: "AniList record",
  },
} as const;
