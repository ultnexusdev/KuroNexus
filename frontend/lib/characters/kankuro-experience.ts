import type { LocalizedText } from "./types";

/**
 * Kankurō — "Kukla Sandığı" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 4694 kaydının ABILITY yuvaları,
 * `kankuro:*` anahtarlarıyla. Görsel bağlı değilse bölüm görselsiz ama
 * AYAKTA çizilir; hiçbir bölüm yükleme bekleyerek çökmez.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (15 Mayıs), boy (165/175 cm), kilo (61,2 kg), kan grubu (B),
 * yaş (14 / 18), rütbe (Genin → Jōnin), şinobi kayıt numarası (54-002) ve
 * sevdiği/sevmediği satırları AniList künyesinden birebir alındı
 * (`anilist-detay-22.json`, karakter 4694). Uydurma satır yok; künyede
 * olmayan hiçbir ölçü şeride yazılmadı.
 *
 * ── AD YAZIMI ────────────────────────────────────────────────────────────
 * AniList kaydı makronsuz: "Kankuro". Arşivin gövde metni yıllardır makronlu
 * yazıyor ("Kankurō") ve başlıkla metnin ayrışması okurun gözüne batıyor —
 * bu yüzden sayfa BAŞLIĞI da buradan, `KANKURO_IDENTITY.name`den geliyor.
 * `detail.character.name` yalnızca görsel `alt` metinlerinde kaynağın kendi
 * yazımıyla anılıyor.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfadaki tırnaklı üç cümlenin üçü de Kankurō'nun teknik çağrısıdır ve
 * üçü de kaynakta birebir geçer. Emin olunmayan hiçbir diyalog satırı
 * tırnak içine alınmadı: dövüşlerin ayrıntısı arşivin kendi anlatımı olarak,
 * düz metin hâlinde yazıldı.
 */

export const KANKURO_ID = 4694;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const KANKURO_SITE_URL = "https://anilist.co/character/4694";

/**
 * Sergi görselleri — hepsi characterId 4694 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `kankuro:` önekli (kürator modu şartı).
 */
export const KANKURO_IMAGE_KEYS = {
  /** Hero: lake siyah kukla gövdesi, figür kadrajın kenarında (16:9) */
  hero: "kankuro:hero",
  kugutsu: "kankuro:kugutsu",
  kikiIppon: "kankuro:kiki-ippon",
  redSand: "kankuro:red-sand",
  thread: "kankuro:thread",
  poisonBlade: "kankuro:poison-blade",
  repair: "kankuro:repair",
  corps: "kankuro:corps",
  karasu: "kankuro:karasu",
  kuroari: "kankuro:kuroari",
  sanshouo: "kankuro:sanshouo",
  sasori: "kankuro:sasori",
  poison: "kankuro:poison",
  antidote: "kankuro:antidote",
  fateInherit: "kankuro:fate-inherit",
  fateChunin: "kankuro:fate-chunin",
  fatePoison: "kankuro:fate-poison",
  fateAntidote: "kankuro:fate-antidote",
  fateWar: "kankuro:fate-war",
  closing: "kankuro:closing",
} as const;

/** Kürator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const KANKURO_SLOT_LABELS: Record<string, LocalizedText> = {
  [KANKURO_IMAGE_KEYS.hero]: {
    tr: "Hero — lake siyah kukla gövdesi, figür kenarda (16:9)",
    en: "Hero — black lacquered puppet body, figure at the edge (16:9)",
  },
  [KANKURO_IMAGE_KEYS.kugutsu]: {
    tr: "Kugutsu no Jutsu — parmak uçlarından çıkan çakra telleri",
    en: "Kugutsu no Jutsu — chakra threads leaving the fingertips",
  },
  [KANKURO_IMAGE_KEYS.kikiIppon]: {
    tr: "Kurohigi Kiki Ippon — kapanan Kuroari, giren bıçaklar",
    en: "Kurohigi Kiki Ippon — Kuroari closing, the blades going in",
  },
  [KANKURO_IMAGE_KEYS.redSand]: {
    tr: "Kızıl Kum — Sasori'nin devralınan gövdesi",
    en: "The Red Sand — Sasori's inherited body",
  },
  [KANKURO_IMAGE_KEYS.thread]: {
    tr: "Çakra ipi — gerilmiş tek tel yakın plan",
    en: "Chakra thread — a single taut strand, close up",
  },
  [KANKURO_IMAGE_KEYS.poisonBlade]: {
    tr: "Zehirli bıçak ağzı — sürülmüş ince tabaka",
    en: "Poisoned blade edge — the thin coat",
  },
  [KANKURO_IMAGE_KEYS.repair]: {
    tr: "Tezgâh — sökülmüş eklemler ve tamir aletleri",
    en: "The bench — opened joints and repair tools",
  },
  [KANKURO_IMAGE_KEYS.corps]: {
    tr: "Suna'nın kukla birliği — sıraya dizilmiş gövdeler",
    en: "Suna's puppet brigade — bodies lined up",
  },
  [KANKURO_IMAGE_KEYS.karasu]: {
    tr: "Karasu — ayrılmış uzuvlar, açık bıçak yuvaları",
    en: "Karasu — detached limbs, open blade housings",
  },
  [KANKURO_IMAGE_KEYS.kuroari]: {
    tr: "Kuroari — açılmış içi boş gövde",
    en: "Kuroari — the hollow body opened",
  },
  [KANKURO_IMAGE_KEYS.sanshouo]: {
    tr: "Sanshōuo — geniş zırh kabuğu",
    en: "Sanshōuo — the broad armoured shell",
  },
  [KANKURO_IMAGE_KEYS.sasori]: {
    tr: "Sasori kuklası — göğüsteki boş çekirdek yuvası",
    en: "The Sasori puppet — the empty core socket in the chest",
  },
  [KANKURO_IMAGE_KEYS.poison]: {
    tr: "Zehir — Sasori'nin karışımı, şişede",
    en: "The poison — Sasori's mixture, in the vial",
  },
  [KANKURO_IMAGE_KEYS.antidote]: {
    tr: "Panzehir — Sakura'nın hazırladığı şişe",
    en: "The antidote — the vial Sakura prepared",
  },
  [KANKURO_IMAGE_KEYS.fateInherit]: {
    tr: "Miras — ustadan kalan üç kukla",
    en: "Inheritance — three puppets left by the master",
  },
  [KANKURO_IMAGE_KEYS.fateChunin]: {
    tr: "Chūnin sınavı — çekilen el",
    en: "Chūnin exam — the raised hand",
  },
  [KANKURO_IMAGE_KEYS.fatePoison]: {
    tr: "Sasori karşılaşması — kesilen göğüs, dağılan kuklalar",
    en: "The Sasori encounter — the cut chest, the scattered puppets",
  },
  [KANKURO_IMAGE_KEYS.fateAntidote]: {
    tr: "Suna hastanesi — panzehrin hazırlandığı masa",
    en: "The Suna hospital — the table where the antidote was made",
  },
  [KANKURO_IMAGE_KEYS.fateWar]: {
    tr: "Savaş — anne ve baba kuklalarının karşıya çıkarılışı",
    en: "The war — the Mother and Father puppets brought forward",
  },
  [KANKURO_IMAGE_KEYS.closing]: {
    tr: "Kapanış — kapanan sandık, gevşeyen ipler",
    en: "Closing — the chest shut, the strings slack",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const KANKURO_IDENTITY = {
  name: "Kankurō",
  nativeName: "カンクロウ",
  /** Hero filigranı — dikey sütun, dekoratif (aria-hidden). 傀儡 = kukla */
  watermark: "傀儡",
  attribution: {
    tr: "Sunagakure · Kukla ustası · Kum Kardeşler'in ortancası",
    en: "Sunagakure · Puppet master · The middle of the Sand Siblings",
  },
  epigraph: {
    tr: "Üç kuklasını da başkası yaptı. Onları taşıyan elleri kendi yaptı.",
    en: "Someone else built all three of his puppets. He built the hands that carry them.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "15 Mayıs", en: "15 May" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "165 cm (I) · 175 cm (II)", en: "165 cm (I) · 175 cm (II)" },
    },
    {
      label: { tr: "Kilo", en: "Weight" },
      value: { tr: "61,2 kg", en: "61.2 kg" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "B", en: "B" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "14 (I) · 18 (II)", en: "14 (I) · 18 (II)" },
    },
    {
      label: { tr: "Rütbe", en: "Rank" },
      value: { tr: "Genin (I) → Jōnin (II)", en: "Genin (I) → Jōnin (II)" },
    },
    {
      label: { tr: "Şinobi kayıt no", en: "Shinobi registration" },
      value: { tr: "54-002", en: "54-002" },
    },
    {
      label: { tr: "Takım", en: "Team" },
      value: {
        tr: "Kum Kardeşler — Gaara, Temari · Öğretmen: Baki",
        en: "The Sand Siblings — Gaara, Temari · Sensei: Baki",
      },
    },
    {
      label: { tr: "Sırtında taşıdığı", en: "What he carries" },
      value: {
        tr: "Bezle sarılı bir kukla — hep sarılı, hep hazır",
        en: "A bandaged puppet — always wrapped, always ready",
      },
    },
    {
      label: { tr: "Sevdiği · sevmediği", en: "Likes · dislikes" },
      value: {
        tr: "Hamburger steak, kukla toplamak · ıspanak, çocuklar",
        en: "Hamburger steak, collecting puppets · spinach, children",
      },
    },
  ],
} as const;

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

export const KANKURO_MODE_TEXT = {
  enter: { tr: "İpler sende değil", en: "The strings are not yours" },
  exit: { tr: "İpleri bırak", en: "Let the strings go" },
  hint: {
    tr: "Sayfanın her bloğu yukarıdan bir ipe asıldı: hepsi hafifçe yana yattı, ışık koyulaştı.",
    en: "Every block on this page now hangs from a string above: each one leans a little, and the light goes dark.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const KANKURO_HERO = {
  lede: {
    tr: "Suna'nın üç kardeşinden ortancası. Ablasının gölgesinde büyüdü, kardeşinin korkusunda yaşadı; sonunda ikisinin arasında durmayı seçti ve o yerden bir daha kıpırdamadı.",
    en: "The middle of Sunagakure's three siblings. He grew up in his sister's shadow and lived in fear of his brother; in the end he chose to stand between them, and never moved from that spot again.",
  },
  portraitAlt: {
    tr: "Kankurō — arşive yüklenmiş kadro portresi",
    en: "Kankurō — cast portrait uploaded to the archive",
  },
  portraitAltFallback: {
    tr: "Kankurō — AniList künye portresi (yaklaşık 230 piksel)",
    en: "Kankurō — AniList profile portrait (about 230 pixels)",
  },
  kumadoriTitle: { tr: "Yüz boyası", en: "The face paint" },
  kumadoriNative: "隈取",
  kumadoriNote: {
    tr: "Kabuki kumadori'sinin izini taşıyan mor çizgiler. Arşivin okuması: usta, kendi yüzünü de sandığındaki gövdelere benzetiyor.",
    en: "Purple lines carrying the trace of kabuki kumadori. The archive's reading: the master paints his own face to match the bodies in his chest.",
  },
  kumadoriChartAlt: {
    tr: "Kumadori şeması: yüzün üstüne oturan mor boya çizgilerinin elle çizilmiş planı",
    en: "Kumadori chart: a hand-drawn plan of the purple paint lines that sit on the face",
  },
} as const;

/**
 * Görsel alt metinleri — BRIEF §4.5: her alt iki dilli ve KAYNAĞINI söyler.
 * Yoldaş portrelerinin tamamı kendi veritabanımızdan geliyor (PORTRAIT
 * yuvası), bu yüzden tek bir son ek yetiyor.
 */
export const KANKURO_ALT = {
  companionSuffix: {
    tr: "— arşive yüklenmiş kadro portresi",
    en: "— cast portrait uploaded to the archive",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const KANKURO_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "Naruto Universe" },
} as const;

export const KANKURO_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "The record" },
    lede: {
      tr: "Suna'nın kayıt defterinden: numaralar, ölçüler ve sırtında hep sarılı duran şey.",
      en: "From Sunagakure's register: the numbers, the measurements, and the thing always wrapped on his back.",
    },
  },
  workshop: {
    title: { tr: "Atölye", en: "The workshop" },
    lede: {
      tr: "Kukla sanatı bir yetenek değil, bir zanaat: önce elin işi, sonra çakranın. Üç büyük tezgâh ve yanlarında duran dört alet.",
      en: "Puppetry is not a talent but a trade: first the hand's work, then the chakra's. Three big benches, and the four tools that sit beside them.",
    },
  },
  chest: {
    title: { tr: "Kukla sandığı", en: "The puppet chest" },
    lede: {
      tr: "Dördü de yukarıdan bir ipe asılı duruyor. Birini seç: ipi gerilir, gövdesi eklem eklem ayrılır ve içine ne konduğu görünür.",
      en: "All four hang from a string above. Choose one: its thread pulls taut, the body comes apart joint by joint, and you see what was put inside.",
    },
  },
  poison: {
    title: { tr: "Zehir masası", en: "The poison table" },
    lede: {
      tr: "Bu sanatın asıl silahı tahta değil: bıçağın ağzına sürülen ince tabaka. Kankurō bunu bir kere kendi bedeninde ölçtü.",
      en: "The real weapon of this craft is not the wood: it is the thin coat brushed onto the blade. Kankurō measured it once, on his own body.",
    },
  },
  strings: {
    title: { tr: "Öbür uçtaki eller", en: "The hands at the other end" },
    lede: {
      tr: "Kankurō dört kuklayı yürütüyor. Onu da dört kişi yürüttü — ve o ipler yukarıdan iniyor.",
      en: "Kankurō moves four puppets. Four people moved him — and those strings come down from above.",
    },
  },
  fate: {
    title: { tr: "Kader çizelgesi", en: "A life in five entries" },
    lede: {
      tr: "Beş kayıt: biri miras, biri çekilme, biri zehir, biri panzehir, sonuncusu bir sandığın kapanışı.",
      en: "Five entries: an inheritance, a withdrawal, a poison, an antidote, and the closing of a chest.",
    },
  },
} as const;

/* ── Atölye: üç büyük tezgâh ────────────────────────────────────────────── */

export const KANKURO_CRAFT = [
  {
    key: "kugutsu" as const,
    imageKey: KANKURO_IMAGE_KEYS.kugutsu,
    kanji: "傀儡の術",
    name: "Kugutsu no Jutsu",
    turkish: { tr: "Kukla Sanatı", en: "Puppet Technique" },
    tagline: {
      tr: "Parmak uçlarından çıkan çakra telleri: her tel bir eklem, her eklem bir karar.",
      en: "Chakra threads from the fingertips: each thread a joint, each joint a decision.",
    },
    text: {
      tr: "Kukla ustası dövüşün içinde değil, kenarında durur. Çakra parmak uçlarından tel hâlinde çıkar, kuklanın eklemlerine bağlanır; ustanın en küçük parmak hareketi tahtanın öbür ucunda bir bıçağa dönüşür. Zorluk telin kendisinde değil sayısındadır: on parmak aynı anda onlarca ayrı hareket demektir ve hepsi ustanın kafasında ayrı ayrı tutulur. Karşılığında usta bir şey satın alır — vurulan o değildir. Kankurō'nun bütün sanatı bu takasın üstüne kurulu: bedeli tahta öder, hesabı o tutar.",
      en: "A puppet master stands beside the fight, not inside it. Chakra leaves the fingertips as thread, ties into the puppet's joints, and the smallest twitch of a finger becomes a blade at the far end of the wood. The difficulty is not the thread but the count: ten fingers mean dozens of separate movements at once, each held apart in the master's head. In exchange he buys one thing — he is not the one who gets hit. His whole craft rests on that trade: the wood pays the price, he keeps the ledger.",
    },
    traits: [
      { tr: "Parmak başına bir tel", en: "One thread per finger" },
      { tr: "Menzilden dövüş", en: "Fighting at range" },
      { tr: "Bedeli tahta öder", en: "The wood pays" },
    ],
  },
  {
    key: "kikiIppon" as const,
    imageKey: KANKURO_IMAGE_KEYS.kikiIppon,
    kanji: "黒秘技・機々一発",
    name: "Kurohigi Kiki Ippon",
    turkish: {
      tr: "Kara Gizli Teknik — Tek Atışlık Düzenek",
      en: "Black Secret Technique — Machine One Shot",
    },
    tagline: {
      tr: "İki kukla, tek hamle: biri kapan, öbürü bıçak.",
      en: "Two puppets, one move: one is the trap, the other is the blade.",
    },
    text: {
      tr: "Kıskacın ilk yarısı Kuroari'dir: gövdesi içi boş bir sandıktır, açılır, hedefin üstüne kapanır ve mandalları kilitlenir. İkinci yarısı Karasu — kolları katlanıp bıçak demetine dönüşür ve Kuroari'nin kabuğundaki işaretli noktalardan içeri girer. İki kukla birbirini görmez; ikisini de aynı eller yürütür, bu yüzden teknik bir kombinasyon değil, tek bir hareketin iki ucudur. İçeride kaçacak açı bırakılmaz. Kapan kapandıktan sonra ustanın yapacağı tek şey, ellerini kapatmaktır.",
      en: "The first half of the pincer is Kuroari: its body is a hollow chest that opens, folds over the target and locks. The second half is Karasu — its arms collapse into a bundle of blades and enter through the marked points on Kuroari's shell. The two puppets never see each other; the same hands run both, which is why this is not a combination but the two ends of a single movement. No angle of escape is left inside. Once the trap has shut, the only thing left for the master to do is close his hands.",
    },
    call: { text: "黒蟻、構え", romaji: "Kuroari, kamae." },
    traits: [
      { tr: "Kapan + bıçak", en: "Trap plus blade" },
      { tr: "Kaçış açısı yok", en: "No angle out" },
      { tr: "Uçlar zehirli", en: "The tips are poisoned" },
    ],
  },
  {
    key: "redSand" as const,
    imageKey: KANKURO_IMAGE_KEYS.redSand,
    kanji: "赤砂",
    name: "Akasuna — Kızıl Kum'un devralınması",
    turkish: {
      tr: "Ustanın gövdesinin mirasçısı",
      en: "Heir to the master's own body",
    },
    tagline: {
      tr: "Üç kuklasını yapan adam köyden kaçmıştı. Kankurō önce kuklaları, sonra adamı devraldı.",
      en: "The man who built his three puppets had fled the village. Kankurō inherited the puppets first, then the man.",
    },
    text: {
      tr: "Karasu, Kuroari ve Sanshōuo'yu Sasori yaptı; Suna'dan ayrıldıktan sonra üçü de yıllar içinde Kankurō'nun eline geçti. Kankurō onları taşımakla yetinmedi — özellikle Karasu'yu neredeyse tanınmaz hâle gelene kadar değiştirdi. Zehir onu az kalsın öldürdükten yıllar sonra sıra dördüncüsüne geldi: Sasori'nin kendi gövdesine. O gövdenin göğsündeki çekirdek yuvası artık boştur; Sasori'yi ayakta tutan şey oradaydı ve orada değil. Onu yürüten tek şey Kankurō'nun telleri. Aynı sanat, ters yöne çevrilmiş hâli.",
      en: "Sasori built Karasu, Kuroari and Sanshōuo; after he left Suna, all three came into Kankurō's hands over the years. Kankurō did not merely carry them — Karasu in particular he rebuilt until it was barely recognisable. Years after the poison nearly killed him, the fourth arrived: Sasori's own body. The core socket in that chest is empty now; the thing that kept Sasori standing was there, and is not. The only thing moving it is Kankurō's thread. The same craft, turned the other way.",
    },
    traits: [
      { tr: "Boş çekirdek", en: "An empty core" },
      { tr: "Ustanın gövdesi", en: "The master's body" },
      { tr: "Aynı sanat, ters yön", en: "Same craft, other way" },
    ],
  },
] as const;

/* ── Atölye: dört alet ──────────────────────────────────────────────────── */

export const KANKURO_TOOLS = [
  {
    key: "thread" as const,
    imageKey: KANKURO_IMAGE_KEYS.thread,
    glyph: "thread" as const,
    name: { tr: "Çakra ipi kontrolü", en: "Chakra thread control" },
    note: {
      tr: "Tel yalnızca kuklaya bağlanmaz: bir kayaya, bir kapıya, düşmek üzere olan bir arkadaşa da bağlanır. Görünmez, ince ve ustanın menzilini kolunun boyundan çok daha uzağa taşır.",
      en: "The thread does not only tie to puppets: it ties to a rock, a door, a comrade about to fall. Invisible, fine, and it carries the master's reach far past the length of his arm.",
    },
  },
  {
    key: "poisonBlade" as const,
    imageKey: KANKURO_IMAGE_KEYS.poisonBlade,
    glyph: "blade" as const,
    name: { tr: "Zehirli bıçaklar", en: "Poisoned blades" },
    note: {
      tr: "Suna'nın kukla birliğinde bıçağın kendisi tek başına sayılmaz; sayılan, ağzına sürülen tabakadır. Tek bir çizik yeter: dövüş o çizikten sonra bir süre daha devam eder, sonra kendiliğinden biter.",
      en: "In Suna's puppet brigade the blade alone does not count; what counts is the coat brushed onto its edge. One scratch is enough: the fight goes on a while after it, then ends by itself.",
    },
  },
  {
    key: "repair" as const,
    imageKey: KANKURO_IMAGE_KEYS.repair,
    glyph: "joint" as const,
    name: { tr: "Kukla tamiri", en: "Puppet repair" },
    note: {
      tr: "Sasori'yle karşılaştığı gece üç kuklası da elinden gitti. Sonraki yıllarda üçünü de kendi tezgâhında yeniden kurdu. Bu sanatta ustayı asıl ayıran şey vurabilmesi değil, kırılanı geri getirebilmesidir.",
      en: "The night he met Sasori he lost all three of his puppets. In the years after he rebuilt all three at his own bench. In this craft what separates a master is not that he can strike, but that he can bring back what broke.",
    },
  },
  {
    key: "corps" as const,
    imageKey: KANKURO_IMAGE_KEYS.corps,
    glyph: "corps" as const,
    name: { tr: "Suna'nın savaş kuklaları", en: "Suna's battle puppets" },
    note: {
      tr: "Kukla sanatı Sunagakure'nin imzasıdır; köyün kukla birliği nesillerdir aynı tezgâhtan çıkıyor ve o tezgâhın kuralları Kankurō'dan çok önce yazıldı. Savaştan sonra Kankurō o birliğin en kıdemli ustalarından biri oldu.",
      en: "Puppetry is Sunagakure's signature; the village's puppet brigade has come off the same bench for generations, and that bench's rules were written long before Kankurō. After the war he became one of its most senior masters.",
    },
  },
] as const;

/* ── Kukla sandığı — sayfanın kalbi ─────────────────────────────────────── */

export interface KankuroWeapon {
  /** Şemadaki numaralı işaretle birebir aynı sıra (1'den başlar) */
  name: LocalizedText;
  note: LocalizedText;
}

export interface KankuroPuppet {
  key: "karasu" | "kuroari" | "sanshouo" | "sasori";
  imageKey: string;
  kanji: string;
  name: string;
  turkish: LocalizedText;
  role: LocalizedText;
  maker: LocalizedText;
  summary: LocalizedText;
  figureAlt: LocalizedText;
  weapons: KankuroWeapon[];
}

/**
 * Dört kukla.
 *
 * `weapons` dizisinin SIRASI şemadaki numaralı işaretlerle bağlı:
 * `PuppetFigure` her kuklada aynı sayıda işaret çiziyor ve n numaralı işaret
 * bu dizinin n-1 indisine karşılık geliyor. Sıra değişirse şema yalan söyler.
 */
export const KANKURO_PUPPETS: KankuroPuppet[] = [
  {
    key: "karasu",
    imageKey: KANKURO_IMAGE_KEYS.karasu,
    kanji: "烏",
    name: "Karasu",
    turkish: { tr: "Karga", en: "Crow" },
    role: { tr: "Saldırı", en: "Assault" },
    maker: {
      tr: "Sasori — sonra Kankurō'nun elinden geçti",
      en: "Sasori — then passed through Kankurō's hands",
    },
    summary: {
      tr: "Kankurō'nun ilk kuklası ve en çok elden geçirdiği olanı. Sasori'nin yaptığı gövdenin üstünde bugün Kankurō'nun eklediği düzenekler var: kollar, bacaklar ve baş gövdeden ayrılıp tek başlarına saldırabiliyor. Dövüşü çoğu zaman Karasu açar — ortalığı zehirli dumana boğar, görüşü keser, ilk kesiği o atar.",
      en: "Kankurō's first puppet and the one he has worked over most. Sasori built the body; the mechanisms on it now are Kankurō's: arms, legs and head detach and attack on their own. Karasu usually opens the fight — it floods the ground with poison smoke, cuts the sightlines, and lands the first cut.",
    },
    figureAlt: {
      tr: "Karasu şeması: ipe asılı kukla, eklemlerinden ayrılmış hâlde; aradaki boşluklarda gizli silahları görünüyor.",
      en: "Karasu diagram: the puppet on its string, split at the joints, its hidden weapons visible in the gaps.",
    },
    weapons: [
      {
        name: { tr: "Ayrılabilir uzuvlar", en: "Detachable limbs" },
        note: {
          tr: "Kol, bacak ve baş gövdeden kopup ayrı ayrı saldırır; her parça kendi teliyle yürür.",
          en: "Arm, leg and head break away and attack separately; each piece runs on its own thread.",
        },
      },
      {
        name: { tr: "Gizli bıçak yuvaları", en: "Concealed blade housings" },
        note: {
          tr: "Ön kollarda katlanmış bıçak demetleri duruyor; açıldığında tek kol dört ayrı ağız taşır.",
          en: "Bundles of folded blades sit in the forearms; opened, a single arm carries four separate edges.",
        },
      },
      {
        name: { tr: "Zehirli duman", en: "Poison smoke" },
        note: {
          tr: "Karın boşluğundaki hazneden çıkan bulut alanı kaplar: hedefi kör eder, sonra ciğerine iner.",
          en: "A cloud from the chamber in the abdomen covers the ground: it blinds the target first, then goes into the lungs.",
        },
      },
      {
        name: { tr: "Fırlatma iğneleri", en: "Launched needles" },
        note: {
          tr: "Ağızdan ve omuzdan çıkan zehir kaplı iğneler; menzil dövüşünün açılış hamlesi.",
          en: "Poison-coated needles from the mouth and shoulder; the opening move of a ranged fight.",
        },
      },
    ],
  },
  {
    key: "kuroari",
    imageKey: KANKURO_IMAGE_KEYS.kuroari,
    kanji: "黒蟻",
    name: "Kuroari",
    turkish: { tr: "Kara Karınca", en: "Black Ant" },
    role: { tr: "Kapan", en: "Capture" },
    maker: { tr: "Sasori", en: "Sasori" },
    summary: {
      tr: "Tek başına kimseyi öldürmez; işi tutmaktır. Gövdesi içi boş bir sandıktır: iki kabuk ayrılır, hedefin üstüne kapanır ve kollarındaki mandallar kilitlenir. Kankurō'nun en soğukkanlı kuklası budur — dövüşü bitiren darbe her zaman başka bir yerden gelir.",
      en: "It kills no one by itself; its job is to hold. Its body is a hollow chest: two shells part, fold over the target, and the catches in its arms lock. This is Kankurō's coldest puppet — the blow that ends the fight always comes from somewhere else.",
    },
    figureAlt: {
      tr: "Kuroari şeması: içi boş gövde iki kabuğa ayrılmış; kabuğun üstündeki işaretli delik noktaları görünüyor.",
      en: "Kuroari diagram: the hollow body split into two shells, with the marked entry points showing on the casing.",
    },
    weapons: [
      {
        name: { tr: "İçi boş gövde", en: "The hollow body" },
        note: {
          tr: "İki kabuk ayrılıp hedefin üstüne kapanır; içeride kımıldayacak yer bırakılmaz.",
          en: "Two shells part and fold over the target; no room to move is left inside.",
        },
      },
      {
        name: { tr: "Kilitleyen mandallar", en: "Locking catches" },
        note: {
          tr: "Kabuk kapandıktan sonra kollar mandala dönüşür — içeriden açılmaz.",
          en: "Once the shell has closed, the arms become catches: it does not open from within.",
        },
      },
      {
        name: { tr: "İşaretli delik noktaları", en: "The marked entry points" },
        note: {
          tr: "Kabuğun üstündeki işaretler Karasu'nun bıçaklarının gireceği yerlerdir. Kıskacın ikinci yarısı buradan girer.",
          en: "The marks on the casing are where Karasu's blades will come through. The second half of the pincer enters here.",
        },
      },
      {
        name: { tr: "Testere ağızları", en: "Saw edges" },
        note: {
          tr: "Kollar testereye dönüşerek kapalı gövdenin içinde kalanı keser.",
          en: "The arms convert into saws and cut through whatever is left inside the closed body.",
        },
      },
    ],
  },
  {
    key: "sanshouo",
    imageKey: KANKURO_IMAGE_KEYS.sanshouo,
    kanji: "山椒魚",
    name: "Sanshōuo",
    turkish: { tr: "Semender", en: "Salamander" },
    role: { tr: "Siper", en: "Shelter" },
    maker: { tr: "Sasori", en: "Sasori" },
    summary: {
      tr: "Üçünün en az görüleni ve en az saldırganı: geniş, alçak, kalın kabuklu bir gövde. İşi vurmak değil dayanmaktır. Gövdesi içi boştur ve Kankurō gerektiğinde kuklasının içine girip saklanır — çünkü bir kukla ustasının tek zayıf noktası kendi bedenidir ve bu kukla tam olarak o zayıflık için yapılmıştır.",
      en: "The least seen and least aggressive of the three: a broad, low body with a thick shell. Its job is not to strike but to hold. The body is hollow, and when he must, Kankurō climbs inside his own puppet — because a puppet master's one weak point is his own body, and this puppet was built for exactly that weakness.",
    },
    figureAlt: {
      tr: "Sanshōuo şeması: geniş zırh kabuğu ikiye ayrılmış; içindeki boşlukta saklanan ustanın silueti görünüyor.",
      en: "Sanshōuo diagram: the broad armoured shell split open, the silhouette of the sheltering master visible in the cavity.",
    },
    weapons: [
      {
        name: { tr: "Ağır zırh kabuğu", en: "Heavy armoured shell" },
        note: {
          tr: "Alçak ve geniş gövde darbeyi tek noktada karşılamaz, yüzeye yayar.",
          en: "The low, wide body does not meet a blow at one point; it spreads it over the surface.",
        },
      },
      {
        name: { tr: "İçine girilebilen boşluk", en: "A cavity to hide in" },
        note: {
          tr: "Ustanın kendisi kuklanın içine sığar. Dışarıdan bakan yalnızca bir kabuk görür.",
          en: "The master himself fits inside the puppet. From outside it is only a shell.",
        },
      },
      {
        name: { tr: "Yere yayılan duruş", en: "A splayed stance" },
        note: {
          tr: "Dört kısa ayak ağırlığı geniş bir tabana dağıtır; devirmek için itmek yetmez.",
          en: "Four short legs spread the weight across a wide base; a shove is not enough to topple it.",
        },
      },
    ],
  },
  {
    key: "sasori",
    imageKey: KANKURO_IMAGE_KEYS.sasori,
    kanji: "蠍",
    name: "Sasori",
    turkish: { tr: "Kızıl Kum'un Sasori'si", en: "Sasori of the Red Sand" },
    role: { tr: "Miras", en: "Inheritance" },
    maker: {
      tr: "Sasori — kendi kendine, kendi elleriyle",
      en: "Sasori — on himself, with his own hands",
    },
    summary: {
      tr: "Kankurō'nun dördüncü kuklası bir kukla değil, bir insandı: Sasori kendini kendi eliyle kuklaya çevirmişti. Göğsündeki çekirdek yuvası artık boş — onu yaşatan şey oradaydı ve orada değil. Kankurō o gövdeyi savaşta kullandı; karşısında yine Sasori vardı.",
      en: "Kankurō's fourth puppet was not a puppet but a man: Sasori had turned himself into one, with his own hands. The core socket in that chest is empty now — the thing that kept him alive was there, and is not. Kankurō used that body in the war; the one standing across from him was Sasori again.",
    },
    figureAlt: {
      tr: "Sasori kuklası şeması: gövde eklemlerinden ayrılmış, göğüsteki boş çekirdek yuvası ve mafsallı kuyruk görünüyor.",
      en: "Sasori puppet diagram: the body split at the joints, showing the empty core socket in the chest and the jointed tail.",
    },
    weapons: [
      {
        name: { tr: "Boş çekirdek yuvası", en: "The empty core socket" },
        note: {
          tr: "Göğüsteki kapağın altında 蠍 işareti duruyor. İçinde tutulması gereken şey artık yok.",
          en: "Under the hatch in the chest is the mark 蠍. What was meant to be held there is gone.",
        },
      },
      {
        name: { tr: "Çekilebilen kuyruk", en: "The retracting tail" },
        note: {
          tr: "Gövdenin arkasından çıkan mafsallı kablo ve ucundaki zehirli iğne — Kankurō'yu az kalsın öldüren şeyin aynısı.",
          en: "A jointed cable out of the back and the poisoned sting at its end — the same thing that nearly killed Kankurō.",
        },
      },
      {
        name: { tr: "Kol bıçakları", en: "Arm blades" },
        note: {
          tr: "Ön kollardan çıkan ağızlar; ustanın kendi bedeni için yaptığı tasarım.",
          en: "Edges that come out of the forearms; the design the master made for his own body.",
        },
      },
      {
        name: { tr: "Tel çıkışları", en: "Thread ports" },
        note: {
          tr: "Parmak uçlarındaki delikler. Bu gövde bir zamanlar başka kuklaları yürütüyordu; şimdi kendisi yürütülüyor.",
          en: "The holes at the fingertips. This body once moved other puppets; now it is the one being moved.",
        },
      },
    ],
  },
];

export const KANKURO_CHEST_UI = {
  listLabel: { tr: "Sandıktaki kuklalar", en: "Puppets in the chest" },
  roleLabel: { tr: "Savaştaki işi", en: "Role in a fight" },
  makerLabel: { tr: "Yapan", en: "Built by" },
  weaponsLabel: { tr: "Açılınca görünenler", en: "What opens up" },
  tautLabel: { tr: "İp gerildi", en: "String taut" },
  slackLabel: { tr: "İp gevşek", en: "String slack" },
  keyboardHint: {
    tr: "Sol/sağ ok tuşlarıyla da geçebilirsin; Home ve End ilk ve son kuklaya gider.",
    en: "The left and right arrow keys work too; Home and End jump to the first and last puppet.",
  },
} as const;

/* ── Zehir masası ───────────────────────────────────────────────────────── */

export const KANKURO_POISON = {
  vials: [
    {
      key: "poison" as const,
      imageKey: KANKURO_IMAGE_KEYS.poison,
      kanji: "毒",
      label: { tr: "Zehir", en: "The poison" },
      by: { tr: "Sasori'nin karışımı", en: "Sasori's mixture" },
      text: {
        tr: "Sasori'nin karışımı bir anda öldürmez; kasları sırayla kilitler ve nefes en sonda gelir. Hiruko'nun kuyruğu Kankurō'nun göğsünü çizdiğinde geriye kalan süre üç gündü — üç gün, bir dövüşü kaybetmiş bir adamın elinde kalan her şeydi.",
        en: "Sasori's mixture does not kill at once; it locks the muscles in order and takes the breath last. When Hiruko's tail opened Kankurō's chest, three days were left — three days, and that was everything a man who had lost his fight still had.",
      },
    },
    {
      key: "antidote" as const,
      imageKey: KANKURO_IMAGE_KEYS.antidote,
      kanji: "解毒",
      label: { tr: "Panzehir", en: "The antidote" },
      by: { tr: "Sakura Haruno'nun işi", en: "Sakura Haruno's work" },
      text: {
        tr: "Suna'nın hekimleri karışımı çözemedi. Konoha'dan gelen Sakura Haruno önce zehri bedenden çekip aldı, sonra aldığı örnekten panzehri üretti. İşi bitirdiğinde yalnızca Kankurō'yu kurtarmış olmadı: aynı panzehir birkaç gün sonra Sasori'nin karşısına çıkacak takımın cebindeydi.",
        en: "Suna's physicians could not break the mixture down. Sakura Haruno, arriving from Konoha, first drew the poison out of his body, then built the antidote from the sample she had taken. When she finished she had not only saved Kankurō: the same antidote was in the pockets of the team that would face Sasori days later.",
      },
    },
  ],
  closingLine: {
    tr: "Kankurō o gece ölmedi. Uyandığında dövüşü kaybetmişti, üç kuklasını da kaybetmişti; geriye tek bir iş kalmıştı ve o işi bir daha elinden bırakmadı: kardeşinin abisi olmak.",
    en: "Kankurō did not die that night. When he woke he had lost the fight and all three of his puppets; one job was left, and he never put it down again: being his brother's older brother.",
  },
  bladeAlt: {
    tr: "Zehir masası şeması: bıçağın ağzındaki tabaka ve yanında panzehir şişesi, elle çizilmiş.",
    en: "Poison table diagram: the coat on the blade's edge and the antidote vial beside it, drawn by hand.",
  },
} as const;

/* ── Öbür uçtaki eller ──────────────────────────────────────────────────── */

/**
 * `characterId` alanları `EXPERIENCE_COMPANIONS[4694]` listesiyle birebir
 * aynı: 1662 Gaara, 2174 Temari, 1900 Sasori, 22920 Rasa. Portre kaydı
 * olmayan kişi adıyla çizilir, bölüm çökmez.
 */
export const KANKURO_STRINGS = [
  {
    characterId: 1662,
    name: "Gaara",
    role: { tr: "Kardeşi", en: "His brother" },
    note: {
      tr: "Yıllarca korktuğu çocuk, sonra uğruna tek başına Akatsuki'nin peşine düştüğü Kazekage. Kankurō'nun bütün hikâyesi bu ipin geriliminde okunur.",
      en: "The child he feared for years, then the Kazekage he chased Akatsuki alone for. Kankurō's whole story can be read in the tension of this one string.",
    },
  },
  {
    characterId: 2174,
    name: "Temari",
    role: { tr: "Ablası", en: "His sister" },
    note: {
      tr: "Üçlünün en büyüğü ve en sert konuşanı. Gaara'nın herkesi korkuttuğu yıllarda Kankurō'yla aynı sırada durdu; ikisi de o sıradan hiç ayrılmadı.",
      en: "The eldest of the three and the bluntest. In the years when Gaara frightened everyone she stood in the same row as Kankurō; neither of them ever stepped out of it.",
    },
  },
  {
    characterId: 1900,
    name: "Sasori",
    role: { tr: "Kuklaların yapıcısı", en: "The one who built the puppets" },
    note: {
      tr: "Kankurō'nun elindeki her tahtada onun izi var. Onu neredeyse öldüren de, sanatını ona bırakan da aynı adam — ve sonunda o adamın gövdesi de Kankurō'nun tellerine bağlandı.",
      en: "His mark is on every piece of wood in Kankurō's hands. The man who nearly killed him and the man who left him the craft are the same — and in the end that man's body was tied to Kankurō's threads too.",
    },
  },
  {
    characterId: 22920,
    name: "Rasa",
    role: { tr: "Babası", en: "His father" },
    note: {
      tr: "Dördüncü Kazekage. Gaara'yı köyün silahı hâline getiren karar onundu; o kararın faturasını yıllarca Temari'yle Kankurō ödedi.",
      en: "The Fourth Kazekage. The decision that made Gaara into the village's weapon was his; Temari and Kankurō paid that decision's bill for years.",
    },
  },
] as const;

/* ── Kader çizelgesi ────────────────────────────────────────────────────── */

/**
 * Çizelge satırı. `quote` opsiyonel — beş kaydın yalnızca birinde replik var
 * (`as const` bir birleşim tipi üretip opsiyonel alanı gizlediği için satır
 * tipi burada açıkça yazıldı).
 */
export interface KankuroFateEntry {
  key: string;
  imageKey: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: string; romaji: string; by: LocalizedText };
}

export const KANKURO_TIMELINE: KankuroFateEntry[] = [
  {
    key: "inherit",
    imageKey: KANKURO_IMAGE_KEYS.fateInherit,
    age: { tr: "14 öncesi", en: "Before 14" },
    title: { tr: "Ustanın bıraktığı tahta", en: "The wood the master left" },
    text: {
      tr: "Sasori Sunagakure'den ayrıldığında geride yaptığı kuklalar kaldı. Karasu, Kuroari ve Sanshōuo yıllar içinde Kankurō'nun eline geçti — ve Kankurō onları kullanmakla yetinmedi: açtı, söktü, kendine göre yeniden kurdu. Suna'da kukla ustalığına giden yol hep aynıdır; önce başkasının yaptığını taşırsın, sonra onu tanınmaz hâle getirirsin.",
      en: "When Sasori left Sunagakure the puppets he had built stayed behind. Karasu, Kuroari and Sanshōuo came into Kankurō's hands over the years — and he did not settle for using them: he opened them, took them apart, rebuilt them his own way. The road to mastery in Suna is always the same; first you carry what someone else made, then you make it unrecognisable.",
    },
  },
  {
    key: "chunin",
    imageKey: KANKURO_IMAGE_KEYS.fateChunin,
    age: { tr: "14 yaş", en: "Age 14" },
    title: {
      tr: "Çekilen el — Shino'nun karşısında",
      en: "The hand raised — across from Shino",
    },
    text: {
      tr: "Chūnin sınavının finalinde kurası Shino Aburame'ye çıktı ve Kankurō maça hiç çıkmadan çekildi. Sebep rakibi değildi: o gün Suna'nın Konoha'ya dönük bir planı vardı ve Kankurō'nun kuklasını arenada göstermemesi gerekiyordu. Sınavın en tuhaf kaydı bu oldu — kaybetmeyi kendisi seçen tek aday.",
      en: "In the Chūnin exam final he drew Shino Aburame, and withdrew without setting foot in the arena. The reason was not his opponent: Suna had a plan for Konoha that day, and Kankurō's puppet was not to be shown on the sand. It is the strangest entry in that exam's record — the only candidate who chose to lose.",
    },
  },
  {
    key: "poison",
    imageKey: KANKURO_IMAGE_KEYS.fatePoison,
    age: { tr: "18 yaş", en: "Age 18" },
    title: { tr: "Kıskaç kuruldu, kabuk kesti", en: "The pincer shut, the shell cut" },
    text: {
      tr: "Akatsuki Gaara'yı kaçırdığında Kankurō peşlerinden tek başına gitti ve Sasori'nin karşısına çıktı. Kıskacı kurdu: Kuroari kapandı, Karasu'nun bıçakları işaretli noktalardan içeri girdi. Ama kapanın içindeki şey Sasori'nin kendisi değil, Hiruko'nun kabuğuydu; o kabuğun kuyruğu dışarı uzandı ve Kankurō'nun göğsünü çizdi. Dövüş bittiğinde üç kuklası da elinden gitmişti, zehir çoktan yürümüştü.",
      en: "When Akatsuki took Gaara, Kankurō went after them alone and came face to face with Sasori. He set the pincer: Kuroari shut, Karasu's blades went in through the marked points. But what was inside the trap was not Sasori — it was Hiruko's shell, and that shell's tail reached out and opened Kankurō's chest. By the end of the fight all three of his puppets were gone and the poison was already moving.",
    },
    quote: {
      text: "黒秘技・機々一発",
      romaji: "Kurohigi: Kiki Ippon.",
      by: { tr: "Kankurō — tekniğin çağrısı", en: "Kankurō — calling the technique" },
    },
  },
  {
    key: "antidote",
    imageKey: KANKURO_IMAGE_KEYS.fateAntidote,
    age: { tr: "18 yaş", en: "Age 18" },
    title: { tr: "Üç gün — Sakura'nın panzehri", en: "Three days — Sakura's antidote" },
    text: {
      tr: "Zehir kasları sırayla kilitliyordu ve Suna'nın hekimleri karışımı çözemedi. Konoha'dan gelen Sakura Haruno önce zehri bedenden çekip aldı, sonra o örnekten panzehri üretti. Kankurō o odadan sağ çıktı — ve hayatında ilk kez, bir dövüşü kazanmadan hayatta kaldı.",
      en: "The poison was locking his muscles in order, and Suna's physicians could not break the mixture down. Sakura Haruno, arriving from Konoha, drew the poison out first and then built the antidote from that sample. Kankurō walked out of that room alive — and for the first time in his life he survived without winning the fight.",
    },
  },
  {
    key: "war",
    imageKey: KANKURO_IMAGE_KEYS.fateWar,
    age: { tr: "Savaş", en: "The war" },
    title: {
      tr: "Ustanın karşısına ustanın gövdesiyle",
      en: "Against the master, with the master's body",
    },
    text: {
      tr: "Dördüncü Büyük Şinobi Savaşı'nda Kankurō sürpriz saldırı bölüğünün başındaydı ve karşısına diriltilmiş Sasori çıktı. Bu kez elinde Sasori'nin kendi gövdesi vardı — ama dövüşü bitiren şey bıçak olmadı. Kankurō, Sasori'nin yıllar önce kendi elleriyle yaptığı anne ve baba kuklalarını çıkardı karşısına. Kızıl Kum o gün direnmeyi bıraktı ve mühürlenmeye razı oldu: sandığı kapatan, ustanın kendi eseriydi.",
      en: "In the Fourth Great Shinobi War, Kankurō led the surprise attack division, and the reanimated Sasori came to stand across from him. This time he held Sasori's own body — but the thing that ended the fight was not a blade. Kankurō brought forward the Mother and Father puppets Sasori had built with his own hands years before. The Red Sand stopped resisting that day and allowed himself to be sealed: what closed the chest was the master's own work.",
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

/**
 * ⚠️ İki replik de teknik ÇAĞRISIDIR ve ikisi de kaynakta birebir geçer.
 * Kankurō'nun ağzından çıkan, arşivin doğrulayabildiği cümleler bunlar; emin
 * olunmayan diyalog satırı bilerek konmadı (BRIEF §9).
 */
export const KANKURO_CLOSING = {
  quotes: [
    {
      text: "黒蟻、構え",
      romaji: "Kuroari, kamae.",
      gloss: { tr: "“Kuroari, pozisyon al.”", en: "“Kuroari, take position.”" },
      by: { tr: "Kankurō", en: "Kankurō" },
      note: {
        tr: "Kıskacın ilk yarısı. Emri alan tahta, veren el.",
        en: "The first half of the pincer. The wood takes the order; the hand gives it.",
      },
    },
    {
      text: "黒秘技・機々一発",
      romaji: "Kurohigi: Kiki Ippon.",
      gloss: {
        tr: "“Kara gizli teknik: tek atışlık düzenek.”",
        en: "“Black secret technique: machine one shot.”",
      },
      by: { tr: "Kankurō", en: "Kankurō" },
      note: {
        tr: "Arşivin notu: Kankurō'nun en çok tekrarlanan iki cümlesi de bir emirdir — ve ikisi de bir insana değil, bir tahtaya söylenmiştir.",
        en: "The archive's note: the two lines Kankurō repeats most are both orders — and neither is given to a person, but to a piece of wood.",
      },
    },
  ],
  motto: "傀儡",
  mottoNote: {
    tr: "kugutsu — “kukla”",
    en: "kugutsu — “puppet”",
  },
  credit: {
    tr: "Künye verileri (doğum, boy, kilo, kan grubu, yaş, rütbe, şinobi kayıt numarası, sevdikleri) ve kapak portresi AniList'ten alınmıştır; Kankurō'nun arşivde tam boy portresi olmadığı için portre bilerek dar kadrajda kullanıldı. Dört kukla şeması, çakra ipleri, kumadori planı ve zehir masasındaki işaretler bu sayfa için elle çizilmiş SVG'lerdir.",
    en: "Profile data (birthday, height, weight, blood type, age, rank, shinobi registration number, likes) and the cover portrait come from AniList; the archive holds no full-size portrait of Kankurō, so the portrait is deliberately used in a narrow crop. The four puppet diagrams, the chakra strings, the kumadori plan and the marks on the poison table are SVGs drawn by hand for this page.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList profile" },
} as const;
