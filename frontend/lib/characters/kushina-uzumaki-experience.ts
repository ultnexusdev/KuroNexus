import type { LocalizedText } from "./types";

/**
 * Kushina Uzumaki — "Çakra Zincirleri" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 7302 kaydının ABILITY yuvaları,
 * `kushina:*` anahtarlarıyla. Görsel bağlı değilse bölüm görselsiz ama
 * AYAKTA çizilir.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (10 Temmuz), boy (165 cm), kan grubu (B), yaş (24), ana
 * dildeki ad (うずまきクシナ) ve "Red Hot-Blooded Habanero" / "Tomato" yan
 * adları AniList künyesinden birebir alındı (`anilist-detay-22.json`,
 * karakter 7302). Uzushiogakure ("the former Land of the Whirlpool") ve
 * ailesi de aynı künyenin açıklama metninde geçiyor. Kilo AniList kaydında
 * YOK, künye şeridinde de yok.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada üç replik var ve üçü de konuşanına atfedilmiş. Mühürleme
 * gecesindeki uzun konuşma ayrı bir bölüm olarak duruyor ve arşivin kendi
 * çevirisi olduğu bölümün künyesinde açıkça yazıyor. Mito'nun Kushina'ya
 * söylediklerinin birebir sözü elimizde olmadığı için o beat tırnak içine
 * alınmadı, düz anlatı olarak yazıldı.
 *
 * ── DİL NOTU ─────────────────────────────────────────────────────────────
 * Kushina'nın konuşma tiki "-ttebane" (だってばね). Türkçede cümle sonu
 * vurgusuna çevrildi ve BİLEREK yalnızca İKİ yerde kullanıldı: "Kızıl
 * Habanero" bağının metninde ve aynı adı taşıyan küçük kartta. Üçüncüsü
 * karikatür olurdu.
 */

export const KUSHINA_ID = 7302;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const KUSHINA_SITE_URL = "https://anilist.co/character/7302";

/**
 * Sergi görselleri — hepsi characterId 7302 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `kushina:` önekli (kürator modu şartı).
 */
export const KUSHINA_IMAGE_KEYS = {
  /** Hero: portrenin arkasına giren geniş sahne (16:9) */
  hero: "kushina:hero",
  kongoFusa: "kushina:kongo-fusa",
  jinchuriki: "kushina:jinchuriki",
  fuinjutsu: "kushina:fuinjutsu",
  toolKenjutsu: "kushina:kenjutsu",
  toolSeal: "kushina:hakke",
  toolUzushio: "kushina:uzushio",
  toolHabanero: "kushina:habanero",
  bondUzushio: "kushina:bond-uzushio",
  bondHabanero: "kushina:bond-habanero",
  bondKurama: "kushina:bond-kurama",
  bondMinato: "kushina:bond-minato",
  bondNaruto: "kushina:bond-naruto",
  fateArrival: "kushina:fate-arrival",
  fateKidnap: "kushina:fate-kidnap",
  fateMito: "kushina:fate-mito",
  fateMarriage: "kushina:fate-marriage",
  fateSealing: "kushina:fate-sealing",
  lastWords: "kushina:last-words",
  closing: "kushina:closing",
} as const;

/** Kürator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const KUSHINA_SLOT_LABELS: Record<string, LocalizedText> = {
  [KUSHINA_IMAGE_KEYS.hero]: {
    tr: "Hero — geniş sahne, kızıl saç kadrajın dışına taşsın (16:9)",
    en: "Hero — wide scene, red hair running out of frame (16:9)",
  },
  [KUSHINA_IMAGE_KEYS.kongoFusa]: {
    tr: "Kongō Fūsa — sırttan çıkan çakra zincirleri",
    en: "Kongō Fūsa — chakra chains erupting from her back",
  },
  [KUSHINA_IMAGE_KEYS.jinchuriki]: {
    tr: "Jinchūriki — mühür deseni ve taşınan öfke",
    en: "Jinchūriki — the seal pattern and the rage it carries",
  },
  [KUSHINA_IMAGE_KEYS.fuinjutsu]: {
    tr: "Fūinjutsu — mühür kâğıdı, yazı ve el işaretleri",
    en: "Fūinjutsu — seal paper, script and hand signs",
  },
  [KUSHINA_IMAGE_KEYS.toolKenjutsu]: {
    tr: "Kenjutsu — kılıçla yakın dövüş",
    en: "Kenjutsu — close combat with a blade",
  },
  [KUSHINA_IMAGE_KEYS.toolSeal]: {
    tr: "Hakke no Fūin Shiki — Naruto'nun karnındaki mühür",
    en: "Hakke no Fūin Shiki — the seal on Naruto's stomach",
  },
  [KUSHINA_IMAGE_KEYS.toolUzushio]: {
    tr: "Uzushiogakure — yıkılmış girdap köyü",
    en: "Uzushiogakure — the ruined village of whirlpools",
  },
  [KUSHINA_IMAGE_KEYS.toolHabanero]: {
    tr: "Kızıl Habanero — havada duran dokuz saç teli",
    en: "The Red Habanero — nine strands of hair standing in the air",
  },
  [KUSHINA_IMAGE_KEYS.bondUzushio]: {
    tr: "1. halka — Uzushiogakure",
    en: "Link 1 — Uzushiogakure",
  },
  [KUSHINA_IMAGE_KEYS.bondHabanero]: {
    tr: "2. halka — taşıdığı ad",
    en: "Link 2 — the name she carried",
  },
  [KUSHINA_IMAGE_KEYS.bondKurama]: {
    tr: "3. halka — Mito'dan devralınan Kurama",
    en: "Link 3 — Kurama, handed over by Mito",
  },
  [KUSHINA_IMAGE_KEYS.bondMinato]: {
    tr: "4. halka — Minato",
    en: "Link 4 — Minato",
  },
  [KUSHINA_IMAGE_KEYS.bondNaruto]: {
    tr: "5. halka — Naruto ve kopuş",
    en: "Link 5 — Naruto, and the break",
  },
  [KUSHINA_IMAGE_KEYS.fateArrival]: {
    tr: "Uzushio'dan Konoha'ya getirilişi",
    en: "Brought from Uzushio to Konoha",
  },
  [KUSHINA_IMAGE_KEYS.fateKidnap]: {
    tr: "Yolda bırakılan kızıl saç telleri",
    en: "The red strands left along the road",
  },
  [KUSHINA_IMAGE_KEYS.fateMito]: {
    tr: "Mito Uzumaki'den devir",
    en: "The handover from Mito Uzumaki",
  },
  [KUSHINA_IMAGE_KEYS.fateMarriage]: {
    tr: "Minato ile evlilik ve bekleyiş",
    en: "Marriage to Minato, and the waiting",
  },
  [KUSHINA_IMAGE_KEYS.fateSealing]: {
    tr: "Mühürleme gecesi — zincirler ve pençe",
    en: "The night of the sealing — the chains and the claw",
  },
  [KUSHINA_IMAGE_KEYS.lastWords]: {
    tr: "Son sözler — anne, baba ve yeni doğmuş çocuk",
    en: "The last words — mother, father and the newborn",
  },
  [KUSHINA_IMAGE_KEYS.closing]: {
    tr: "Kapanış — kopmuş zincir, tek kalan halka",
    en: "Closing — the snapped chain and the one link left",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const KUSHINA_IDENTITY = {
  name: "Kushina Uzumaki",
  nativeName: "うずまきクシナ",
  /** Hero filigranı — dekoratif (aria-hidden) */
  watermark: "うずまき",
  clan: { tr: "Uzumaki Klanı", en: "Uzumaki Clan" },
  epigraph: {
    tr: "Zincirleri çakradandı, elmastandı, hiçbir şey onları koparamıyordu. Onu asıl yerinde tutan şey ise bağlandığı şeylerdi.",
    en: "Her chains were chakra and adamantine, and nothing could snap them. What actually held her in place was everything she was bound to.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "10 Temmuz", en: "10 July" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "165 cm", en: "165 cm" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "B", en: "B" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "24", en: "24" },
    },
    {
      label: { tr: "Memleket", en: "Homeland" },
      value: {
        tr: "Uzushiogakure — Girdap Ülkesi",
        en: "Uzushiogakure — the Land of Whirlpools",
      },
    },
    {
      label: { tr: "Unvan", en: "Title" },
      value: {
        tr: "Akai Chishio no Habanero — Kızıl Kanlı Habanero",
        en: "Akai Chishio no Habanero — the Red Hot-Blooded Habanero",
      },
    },
    {
      label: { tr: "Anılan diğer ad", en: "Also called" },
      value: {
        tr: "“Domates” — çocukken takılan ad",
        en: "“Tomato” — the name the other children used",
      },
    },
    {
      label: { tr: "Görev", en: "Role" },
      value: {
        tr: "Dokuz Kuyruklu'nun ikinci jinchūriki'si",
        en: "Second jinchūriki of the Nine-Tails",
      },
    },
    {
      label: { tr: "Aile", en: "Family" },
      value: {
        tr: "Minato Namikaze (eş) · Naruto Uzumaki (oğul)",
        en: "Minato Namikaze (husband) · Naruto Uzumaki (son)",
      },
    },
    {
      label: { tr: "Geride bıraktığı iz", en: "The trace she left" },
      value: {
        tr: "Bir tel kızıl saç",
        en: "A single strand of red hair",
      },
    },
  ],
} as const;

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

export const KUSHINA_HABANERO_TEXT = {
  enter: { tr: "Kızıl Habanero", en: "Red Hot Habanero" },
  exit: { tr: "Sakinleştir", en: "Let it cool" },
  hint: {
    tr: "Saç dokuz tele ayrılıp sayfaya yayılıyor: palet ısınıyor, yazı sertleşiyor.",
    en: "Her hair splits into nine strands and spreads across the page: the palette heats, the type hardens.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const KUSHINA_HERO = {
  lede: {
    tr: "Uzushiogakure'den bir çocuk olarak getirildi ve içine dünyanın en büyük öfkesi mühürlendi. Son gecesinde zincirlerini o öfkeyi tutmak için değil, yeni doğmuş bir bebeğin üstüne kapanmak için kullandı.",
    en: "She was brought over from Uzushiogakure as a child, and the largest rage in the world was sealed inside her. On her last night she used her chains not to hold that rage down, but to close herself over a newborn.",
  },
  hairCaption: {
    tr: "Yolda bıraktığı iz de buydu: tel tel, kızıl.",
    en: "This was the trail she left, too: strand by strand, red.",
  },
  portraitAlt: {
    tr: "Kushina Uzumaki — arşive yüklenmiş kadro portresi",
    en: "Kushina Uzumaki — cast portrait uploaded to the archive",
  },
  portraitAltFallback: {
    tr: "Kushina Uzumaki — AniList künye portresi",
    en: "Kushina Uzumaki — AniList profile portrait",
  },
} as const;

/**
 * Görsel alt metinleri — BRIEF §3.5: her alt iki dilli ve KAYNAĞINI söyler.
 * Yoldaş portrelerinin tamamı kendi veritabanımızdan geliyor (PORTRAIT
 * yuvası), bu yüzden tek bir son ek yetiyor.
 */
export const KUSHINA_ALT = {
  companionSuffix: {
    tr: "— arşive yüklenmiş kadro portresi",
    en: "— cast portrait uploaded to the archive",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const KUSHINA_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "Naruto Universe" },
} as const;

export const KUSHINA_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "The record" },
    lede: {
      tr: "Kısa bir tutanak: yirmi dört yıl, iki köy, bir kuyruklu ve bir çocuk.",
      en: "A short file: twenty-four years, two villages, one tailed beast and one child.",
    },
  },
  arts: {
    title: { tr: "Kanın getirdiği üç şey", en: "Three things the blood gave her" },
    lede: {
      tr: "Kushina'nın gücü çalışmakla kazanılmadı; Uzumaki olmakla geldi. Üçü de aynı fikrin devamı: bir şeyi bir yerde tutmak.",
      en: "Kushina's power was not earned by training; it came with being an Uzumaki. All three are the same idea continued: holding something in place.",
    },
  },
  tools: {
    title: { tr: "Dosyaya düşülen dört not", en: "Four notes in the file" },
    lede: {
      tr: "Büyük üçünün yanına sığmayan, ama onlarsız sayfanın eksik kalacağı dört kayıt.",
      en: "Four entries that do not fit beside the big three, and without which the page would be incomplete.",
    },
  },
  bonds: {
    title: { tr: "Zincirin halkaları", en: "Links of the chain" },
    lede: {
      tr: "Kushina'nın zinciri bir devir zinciri değil, bir bağ zinciri: neye bağlı olduğunu gösteriyor. Bir halkayı seç, o bağ gerilsin. Son halkayı seçersen zincirin tamamı gerilir — ve kopar.",
      en: "Kushina's chain is not a chain of succession but a chain of attachment: it shows what she was bound to. Pick a link and that bond pulls taut. Pick the last one and the whole chain goes taut — then it breaks.",
    },
  },
  fate: {
    title: {
      tr: "Yirmi dört yılın beş durağı",
      en: "Five stops in twenty-four years",
    },
    lede: {
      tr: "Getirildiği gün, kaçırıldığı gün, yükü devraldığı gün, evlendiği gün ve son gece.",
      en: "The day she was brought in, the day she was taken, the day she took on the burden, the day she married, and the last night.",
    },
  },
  lastWords: {
    title: { tr: "Son sözler", en: "The last words" },
    lede: {
      tr: "Sayfanın geri kalanı zincirlerle, mühürlerle ve devasa çakrayla ilgili. Burası değil. Burada bir anne, birkaç dakikası kaldığını bilerek, oğluna yirmi yıllık öğüt sığdırmaya çalışıyor.",
      en: "The rest of this page is about chains, seals and enormous chakra. This part is not. Here a mother, knowing she has minutes left, tries to fit twenty years of advice into them.",
    },
  },
} as const;

/* ── Kanın getirdiği üç şey ─────────────────────────────────────────────── */

export const KUSHINA_ARTS = [
  {
    key: "kongoFusa" as const,
    imageKey: KUSHINA_IMAGE_KEYS.kongoFusa,
    kanji: "金剛封鎖",
    name: "Kongō Fūsa",
    turkish: { tr: "Elmas Mühür Zincirleri", en: "Adamantine Sealing Chains" },
    tagline: {
      tr: "Sırtından çıkan çakra zincirleri — Uzumaki kanının en görünür işareti.",
      en: "Chakra chains that come out of her back — the most visible mark of Uzumaki blood.",
    },
    text: {
      tr: "Zincirler bedenden fışkırır, hedefi bulunduğu yere çiviler ve istendiğinde bir mühür barikatına dönüşür. Kushina'nın elinde bu bir saldırı tekniği değil, bir tutma biçimiydi: Dokuz Kuyruklu'yu tek başına bağlayabilen tek şey. Aynı zincirler bir kubbe örebiliyor, mühür kırıldığında dışarı taşan çakrayı içeride tutabiliyordu. Uzumaki kanı dışında kimsede görülmedi.",
      en: "The chains burst out of the body, pin the target where it stands and, when needed, close into a sealing barrier. In Kushina's hands this was never an attack but a way of holding: the only thing that could bind the Nine-Tails alone. The same chains could weave a dome and keep the overflowing chakra inside once the seal was broken. Nobody outside Uzumaki blood was ever seen using it.",
    },
    traits: [
      { tr: "Kurama'yı tek başına tutar", en: "Holds Kurama alone" },
      { tr: "Bariyer örer", en: "Weaves a barrier" },
      { tr: "Yalnızca Uzumaki'de", en: "Uzumaki blood only" },
    ],
  },
  {
    key: "jinchuriki" as const,
    imageKey: KUSHINA_IMAGE_KEYS.jinchuriki,
    kanji: "人柱力",
    name: "Jinchūriki",
    turkish: {
      tr: "İnsan kabı — Dokuz Kuyruklu'nun ikinci taşıyıcısı",
      en: "Human vessel — second bearer of the Nine-Tails",
    },
    tagline: {
      tr: "Devasa çakra, uzun ömür ve çıkarılmaya dayanan bir beden.",
      en: "Enormous chakra, a long life, and a body that survived extraction.",
    },
    text: {
      tr: "Uzumaki'ler olağanüstü çakra rezerviyle ve inatçı bir yaşam gücüyle bilinir; Mito Uzumaki'nin de Kushina'nın da kuyrukluyu taşıyabilmesinin sebebi bu. Kuyruklusu çıkarılan bir jinchūriki kural olarak ölür. Kushina o gece ölmedi: çıkarma bittikten sonra ayakta kaldı, konuştu, zincirlerini bir kez daha çıkardı ve pençenin önüne geçecek kadar yaşadı. Bu sayfadaki her şey o tek istisnanın üstüne kurulu.",
      en: "The Uzumaki are known for an extraordinary chakra reserve and a stubborn life force; that is why both Mito Uzumaki and Kushina could carry the beast. A jinchūriki whose tailed beast is extracted dies, as a rule. Kushina did not die that night: after the extraction was finished she stayed on her feet, she spoke, she brought her chains out one more time, and she lived long enough to step in front of the claw. Everything on this page rests on that single exception.",
    },
    traits: [
      { tr: "Devasa çakra", en: "Enormous chakra" },
      { tr: "İnatçı yaşam gücü", en: "Stubborn life force" },
      { tr: "Çıkarılmaya dayandı", en: "Survived extraction" },
    ],
  },
  {
    key: "fuinjutsu" as const,
    imageKey: KUSHINA_IMAGE_KEYS.fuinjutsu,
    kanji: "封印術",
    name: "Fūinjutsu",
    turkish: { tr: "Mühürleme sanatı", en: "The sealing arts" },
    tagline: {
      tr: "Uzushiogakure'yi ünlü eden ve sonra yıktıran ustalık.",
      en: "The mastery that made Uzushiogakure famous, then got it destroyed.",
    },
    text: {
      tr: "Mühürleme, bir şeyi bir yerde tutma sanatıdır: çakrayı, bir silahı, bir kuyrukluyu. Uzumaki klanı bu işte o kadar ileriydi ki çevre köyler onu bir tehdit sayıp Uzushio'yu birlikte yıktılar. Sağ kalanlar dağıldı, bilgi dağılmadı — Konoha'nın Sekizli Mühür Düzeni de, Kushina'nın karnındaki mühür de aynı okuldan. Konoha yeleklerinin sırtındaki kırmızı girdap, o ittifaktan kalan tek işaret.",
      en: "Sealing is the art of keeping something where it is: chakra, a weapon, a tailed beast. The Uzumaki clan was so far ahead in it that the surrounding villages judged them a threat and destroyed Uzushio together. The survivors scattered; the knowledge did not. Konoha's Eight Trigrams Sealing Style and the seal on Kushina's own stomach come from the same school. The red whirl on the back of every Konoha flak jacket is the one mark left of that alliance.",
    },
    traits: [
      { tr: "Klanın imzası", en: "The clan signature" },
      { tr: "Yıkılma sebebi", en: "The reason they fell" },
      { tr: "Yeleklerdeki amblem", en: "The emblem on the jackets" },
    ],
  },
] as const;

/* ── Dosyaya düşülen dört not ───────────────────────────────────────────── */

/**
 * Küçük kartlardan biri (`uzushio`) bir yoldaş portresi taşıyor: Mito
 * Uzumaki'nin torunu Tsunade. Portre kaydı yoksa kart adla çizilir.
 */
export interface KushinaNote {
  key: string;
  imageKey: string;
  companionId?: number;
  companionName?: string;
  companionRole?: LocalizedText;
  name: LocalizedText;
  note: LocalizedText;
}

export const KUSHINA_NOTES: KushinaNote[] = [
  {
    key: "kenjutsu",
    imageKey: KUSHINA_IMAGE_KEYS.toolKenjutsu,
    name: { tr: "Kenjutsu — kılıç", en: "Kenjutsu — the blade" },
    note: {
      tr: "Kushina'nın dövüş tarzı uzaktan değil, yakındandı: kılıç kullanmayı biliyordu ve kavgadan hiç kaçmadı. Kızıl Habanero unvanı yalnızca saç rengiyle ilgili değildi.",
      en: "Kushina fought up close, not at range: she knew her way around a sword and never once walked away from a fight. The Red Habanero title was not only about the colour of her hair.",
    },
  },
  {
    key: "seal",
    imageKey: KUSHINA_IMAGE_KEYS.toolSeal,
    name: {
      tr: "Hakke no Fūin Shiki — Sekizli Mühür Düzeni",
      en: "Hakke no Fūin Shiki — Eight Trigrams Sealing Style",
    },
    note: {
      tr: "Naruto'nun karnındaki mührü Minato uyguladı. Kushina'nın payı, mührün içine kendi çakrasından bir parça bırakmaktı: oğlu büyüyüp mührü zorladığında karşısına annesi çıksın diye. Yıllar sonra tam olarak öyle oldu.",
      en: "It was Minato who applied the seal on Naruto's stomach. Kushina's share was leaving a piece of her own chakra inside it, so that when her son grew up and pushed the seal too far, his mother would be standing there. Years later that is exactly what happened.",
    },
  },
  {
    key: "uzushio",
    imageKey: KUSHINA_IMAGE_KEYS.toolUzushio,
    companionId: 2767,
    companionName: "Tsunade",
    companionRole: {
      tr: "Mito Uzumaki'nin torunu",
      en: "Granddaughter of Mito Uzumaki",
    },
    name: { tr: "Uzushiogakure mirası", en: "The Uzushiogakure inheritance" },
    note: {
      tr: "Girdap köyü yıkıldı, klan dağıldı, kan dağılmadı. Aynı kan Senju hattına da karıştı: İlk Hokage'nin eşi Mito Uzumaki'ydi, torunu da Tsunade. Konoha'nın Beşinci Hokage'si, Kushina'nın uzaktan akrabası.",
      en: "The village of whirlpools fell and the clan scattered; the blood did not. The same blood ran into the Senju line: the First Hokage's wife was Mito Uzumaki, and her granddaughter is Tsunade. Konoha's Fifth Hokage is a distant relative of Kushina's.",
    },
  },
  {
    key: "habanero",
    imageKey: KUSHINA_IMAGE_KEYS.toolHabanero,
    name: { tr: "Kızıl Habanero unvanı", en: "The Red Habanero title" },
    note: {
      tr: "Kızdığında saçı dokuz ayrı tele ayrılır, havada durur ve kimse yaklaşmazdı. Köy ona adı böyle taktı. Sonunda kendisi de benimsedi — kızdırma onu, tamam mı!",
      en: "When she lost her temper her hair split into nine separate strands, stood up in the air, and nobody came near. That is how the village named her. In the end she took the name for herself — so do not make her angry, all right!",
    },
  },
];

/* ── Zincirin halkaları — sayfanın kalbi ────────────────────────────────── */

export const KUSHINA_BOND_UI = {
  listLabel: { tr: "Kushina'nın bağları", en: "Kushina's bonds" },
  linkWord: { tr: "halka", en: "link" },
  prev: { tr: "Önceki halka", en: "Previous link" },
  next: { tr: "Sonraki halka", en: "Next link" },
  pullLabel: { tr: "Neye bağlı", en: "Bound to" },
  strainLabel: { tr: "Gerilim", en: "Strain" },
  breakLabel: { tr: "Kopuş", en: "The break" },
  keyboardHint: {
    tr: "Yukarı/aşağı ok tuşlarıyla da gezebilirsin; Home ve End zincirin iki ucuna gider.",
    en: "The up and down arrow keys work too; Home and End jump to the two ends of the chain.",
  },
  railAlt: {
    tr: "Beş halkalı zincir şeması: seçilen halka gerilir, son halkada zincir kopar.",
    en: "Diagram of a five-link chain: the selected link pulls taut, and at the last link the chain snaps.",
  },
  statusTaut: {
    tr: "Zincirin bu bölümü gerildi.",
    en: "This section of the chain has pulled taut.",
  },
  statusBroken: {
    tr: "Zincirin tamamı gerildi ve koptu. Elde tek halka kaldı.",
    en: "The whole chain pulled taut and snapped. One link is left.",
  },
} as const;

/**
 * Beş bağ. `companionId` verilen halka yoldaş portresiyle, verilmeyen halka
 * elle çizilmiş bir amblemle (`glyph`) çizilir — portre kaydı olmayan iki
 * halka (memleket ve ad) zaten bir kişiye değil bir şeye bağlı.
 *
 * `breaks: true` yalnızca son halkada: seçildiğinde zincirin tamamı gerilir
 * ve dördüncü halka açılıp kopar.
 */
export interface KushinaBond {
  key: string;
  imageKey: string;
  companionId?: number;
  glyph?: "whirl" | "hair";
  breaks?: true;
  tag: LocalizedText;
  name: string;
  kanji: string;
  turkish: LocalizedText;
  pull: LocalizedText;
  text: LocalizedText;
  strain: LocalizedText;
  breakText?: LocalizedText;
}

export const KUSHINA_BONDS: KushinaBond[] = [
  {
    key: "uzushio",
    imageKey: KUSHINA_IMAGE_KEYS.bondUzushio,
    glyph: "whirl",
    tag: { tr: "Memleket", en: "Homeland" },
    name: "Uzushiogakure",
    kanji: "渦潮隠れの里",
    turkish: {
      tr: "Girdap İçinde Gizli Köy",
      en: "Village Hidden by Whirling Tides",
    },
    pull: {
      tr: "Girdapların ortasındaki mühür ustaları",
      en: "The seal masters out among the whirlpools",
    },
    text: {
      tr: "Uzumaki klanının köyü, girdapların ortasında bir adaydı. Mühürleme sanatındaki ustalığı çevre köylere o kadar tehlikeli göründü ki birleşip Uzushio'yu yıktılar; klan dağıldı, sağ kalanlar başka köylere sığındı. Kushina o yıkımdan önce Konoha'ya getirilmişti — yani memleketini kaybettiğinde başka bir yerdeydi ve dönecek bir yer kalmamıştı.",
      en: "The Uzumaki village was an island out among the whirlpools. Its mastery of the sealing arts looked so dangerous to the surrounding villages that they joined forces and levelled Uzushio; the clan scattered and the survivors took shelter elsewhere. Kushina had already been brought to Konoha before it fell — which means she was somewhere else when she lost her home, and there was nowhere left to go back to.",
    },
    strain: {
      tr: "Bu halka bir yere değil, artık olmayan bir yere bağlı.",
      en: "This link is tied not to a place, but to a place that no longer exists.",
    },
  },
  {
    key: "habanero",
    imageKey: KUSHINA_IMAGE_KEYS.bondHabanero,
    glyph: "hair",
    tag: { tr: "Ad", en: "The name" },
    name: "Akai Chishio no Habanero",
    kanji: "赤い血潮のハバネロ",
    turkish: {
      tr: "Kızıl Kanlı Habanero",
      en: "The Red Hot-Blooded Habanero",
    },
    pull: {
      tr: "Önce alay konusu, sonra rozet",
      en: "First a joke, then a badge",
    },
    text: {
      tr: "Konoha'ya geldiğinde saçıyla dalga geçtiler: domates dediler. Kızdığında saçının dokuz ayrı tele ayrılıp havada durması ikinci bir ad getirdi — Kızıl Habanero. İlkine katlandı, ikincisini sevdi. Sonra Minato o saçın güzel olduğunu söyledi ve mesele kapandı: saçından utanan çocuk gitti, kalan, adını kendi taşıyan biriydi işte.",
      en: "When she arrived in Konoha they made fun of her hair and called her a tomato. When she lost her temper that hair split into nine strands and stood up in the air, and a second name arrived with it — the Red Habanero. She put up with the first and grew fond of the second. Then Minato told her the hair was beautiful and the matter was closed: the child who was ashamed of it left, and what remained was someone who carried her own name.",
    },
    strain: {
      tr: "Bu halka bir yükten çok bir tutamak: gerildikçe sağlamlaşıyor.",
      en: "This link is less a weight than a handhold: the harder it pulls, the stronger it gets.",
    },
  },
  {
    key: "kurama",
    imageKey: KUSHINA_IMAGE_KEYS.bondKurama,
    companionId: 7407,
    tag: { tr: "Yük", en: "The burden" },
    name: "Kurama",
    kanji: "九尾",
    turkish: { tr: "Dokuz Kuyruklu", en: "The Nine-Tails" },
    pull: {
      tr: "Mito Uzumaki'den devralınan kuyruklu",
      en: "The beast handed over by Mito Uzumaki",
    },
    text: {
      tr: "Konoha'ya getirilmesinin asıl sebebi buydu. İlk Hokage'nin eşi Mito Uzumaki, Dokuz Kuyruklu'yu kendi bedeninde tutan ilk jinchūriki'ydi ve yaşlanıyordu; mührün yeni bir kaba ihtiyacı vardı ve o kap Uzumaki olmak zorundaydı. Devir sessizce yapıldı. Mito ona tek bir şey öğretti: bu mührü ayakta tutan şey çakranın miktarı değil, sevginin varlığıdır. Kushina bunu bir öğüt olarak değil, bir teknik tarifi olarak aldı.",
      en: "This was the real reason she was brought to Konoha. Mito Uzumaki, wife of the First Hokage, was the first jinchūriki to hold the Nine-Tails inside her own body, and she was growing old; the seal needed a new vessel and that vessel had to be an Uzumaki. The handover was done quietly. Mito taught her one thing: what keeps this seal standing is not the amount of chakra but the presence of love. Kushina took that not as advice but as a technical specification.",
    },
    strain: {
      tr: "Bu halka içeriden çekiyor. Gerildiğinde acıyan taraf hep o.",
      en: "This link pulls from the inside. When it goes taut, that is always the side that hurts.",
    },
  },
  {
    key: "minato",
    imageKey: KUSHINA_IMAGE_KEYS.bondMinato,
    companionId: 2535,
    tag: { tr: "Eş", en: "Husband" },
    name: "Minato Namikaze",
    kanji: "波風ミナト",
    turkish: { tr: "Dördüncü Hokage", en: "The Fourth Hokage" },
    pull: {
      tr: "Saç tellerini gören tek kişi",
      en: "The only one who saw the strands",
    },
    text: {
      tr: "Kumogakure'nin şinobileri onu çakrası için kaçırdığında Kushina geride tek bir iz bırakabildi: yol boyunca kopardığı kızıl saç telleri. Konoha'da kimse yere bakmadı. Minato baktı, telleri takip etti, tek başına gidip onu geri getirdi. Kushina o güne kadar “fazla sessiz, fazla yumuşak” diye küçümsediği çocuğa bir daha aynı gözle bakmadı. Sonrası kısa: evlilik, Dördüncü Hokage'nin karısı olmak ve bir çocuk beklemek.",
      en: "When shinobi from Kumogakure took her for her chakra, Kushina managed to leave exactly one trace: strands of red hair pulled out along the road. In Konoha nobody looked down. Minato did. He followed the strands, went alone, and brought her back. She never again looked the same way at the boy she had dismissed as too quiet and too soft. The rest is short: marriage, becoming the Fourth Hokage's wife, and expecting a child.",
    },
    strain: {
      tr: "Bu halka dışarıdan tutuyor. Zincirin taşıdığı ağırlığın yarısı burada.",
      en: "This link holds from the outside. Half the weight the chain carries sits here.",
    },
  },
  {
    key: "naruto",
    imageKey: KUSHINA_IMAGE_KEYS.bondNaruto,
    companionId: 17,
    breaks: true,
    tag: { tr: "Oğul", en: "Son" },
    name: "Naruto Uzumaki",
    kanji: "うずまきナルト",
    turkish: { tr: "Zincirin son halkası", en: "The last link of the chain" },
    pull: {
      tr: "Doğumun kendisi bir güvenlik açığıydı",
      en: "The birth itself was the vulnerability",
    },
    text: {
      tr: "Bir kadın jinchūriki doğum yaparken mühür zayıflar; bu yüzden doğum köyün dışında, gizli bir sığınakta, sayılı kişinin bildiği bir gecede planlandı. Maskeli bir adam sığınağı buldu, yeni doğmuş bebeği rehin aldı ve mührü açıp Kurama'yı Kushina'dan söktü. Kuyruklusu çıkarılan bir jinchūriki ölür; Uzumaki yaşam gücü o gece bir kez daha araya girdi ve Kushina ölmedi.",
      en: "A female jinchūriki's seal weakens while she gives birth; that is why the delivery was planned outside the village, in a hidden shelter, on a night only a handful of people knew about. A masked man found the shelter, took the newborn hostage, opened the seal and tore Kurama out of Kushina. A jinchūriki whose beast is extracted dies; the Uzumaki life force stepped in one more time, and Kushina did not.",
    },
    strain: {
      tr: "Bu halka yeni dövüldü ve zincirin en ağır ucunda duruyor.",
      en: "This link was forged minutes ago and it hangs at the heaviest end of the chain.",
    },
    breakText: {
      tr: "Kalan gücüyle zincirlerini son bir kez çıkardı, Kurama'yı yere çiviledi ve onu kendisiyle birlikte ölüme çekmek istedi. Minato izin vermedi: kuyruklu ölürse dengenin yerine bir boşluk kalırdı ve oğullarının önünde duracak bir gelecek olmazdı. Pençe bebeğe indiğinde ikisi arasına girdiler. Zincir orada koptu — yukarısı, yani memleket, ad, canavar ve koca, düştü. Elde kalan tek halka çocuktu.",
      en: "With what strength was left she brought the chains out one more time, pinned Kurama to the ground, and tried to drag him into death with her. Minato refused: kill the beast and a hole is left where the balance used to be, and no future would be standing in front of their son. When the claw came down on the newborn, the two of them stepped between. That is where the chain snapped — everything above it, the homeland, the name, the beast and the husband, fell away. The one link left in hand was the child.",
    },
  },
];

/* ── Yirmi dört yılın beş durağı ────────────────────────────────────────── */

/**
 * Çizelge satırı. `quote` opsiyonel — beş kaydın yalnızca birinde replik
 * var; kalanların anlatısı arşivin kendi kalemi.
 */
export interface KushinaFateEntry {
  key: string;
  imageKey: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: LocalizedText };
}

export const KUSHINA_TIMELINE: KushinaFateEntry[] = [
  {
    key: "arrival",
    imageKey: KUSHINA_IMAGE_KEYS.fateArrival,
    age: { tr: "Çocukluk", en: "Childhood" },
    title: {
      tr: "Girdaptan getirilen çocuk",
      en: "The child brought in from the whirlpool",
    },
    text: {
      tr: "Uzushiogakure'den Konoha'ya, sebebi kendisine söylenmeden getirildi. Akademideki ilk gününde sınıfa dönüp ne olacağını duyurdu; kızıl saçı ve o cümlesi yüzünden aynı gün alay konusu oldu. Sebebi yıllar sonra öğrenecekti: getirilme kararı onun geleceğiyle değil, Mito Uzumaki'nin yaşıyla ilgiliydi.",
      en: "She was brought from Uzushiogakure to Konoha without being told why. On her first day at the Academy she turned to the class and announced what she was going to become; between the red hair and that sentence, she was a joke by the end of the day. She would learn the real reason years later: the decision to bring her had nothing to do with her future and everything to do with Mito Uzumaki's age.",
    },
    quote: {
      text: {
        tr: "Konoha'nın ilk kadın Hokage'si ben olacağım!",
        en: "I'm going to be Konoha's first female Hokage!",
      },
      by: { tr: "Kushina Uzumaki", en: "Kushina Uzumaki" },
    },
  },
  {
    key: "kidnap",
    imageKey: KUSHINA_IMAGE_KEYS.fateKidnap,
    age: { tr: "Akademi yılları", en: "Academy years" },
    title: {
      tr: "Yolda bırakılan saç telleri",
      en: "The strands left along the road",
    },
    text: {
      tr: "Kumogakure onun olağanüstü çakrasını fark etti ve gece yarısı köyden kaçırdı. Kushina yol boyunca saçından tel tel kopardı: ince, kızıl, kolay gözden kaçan bir iz. Konoha'da kimse yere bakmadı. Minato Namikaze baktı ve tek başına peşlerinden gitti; Kushina'yı sırtında geri getirdi. O geceden sonra saçından utanmayı bıraktı.",
      en: "Kumogakure noticed her extraordinary chakra and took her out of the village in the middle of the night. All along the road Kushina pulled her hair out strand by strand: a thin red trail, easy to miss. In Konoha nobody looked down. Minato Namikaze did, and he went after them alone; he brought her back on his shoulders. After that night she stopped being ashamed of her hair.",
    },
  },
  {
    key: "mito",
    imageKey: KUSHINA_IMAGE_KEYS.fateMito,
    age: { tr: "Genç kunoichi", en: "Young kunoichi" },
    title: {
      tr: "Mito'dan devralınan yük",
      en: "The burden handed over by Mito",
    },
    text: {
      tr: "İlk Hokage'nin eşi Mito Uzumaki, Dokuz Kuyruklu'yu kendi bedeninde tutan ilk jinchūriki'ydi ve ömrünün sonuna geliyordu. Devir sessizce, köyün çoğunun haberi olmadan yapıldı. Mito ona mührün sırrının çakra miktarı değil sevgi olduğunu söyledi ve öldü. Kushina o günden sonra dünyanın en büyük öfkesini kimseye söylemeden taşıdı.",
      en: "Mito Uzumaki, wife of the First Hokage, was the first jinchūriki to hold the Nine-Tails in her own body, and she was reaching the end of her life. The handover was done quietly, with most of the village never told. Mito told her the secret of the seal was not the amount of chakra but love, and then she died. From that day on Kushina carried the largest rage in the world without telling anyone.",
    },
  },
  {
    key: "marriage",
    imageKey: KUSHINA_IMAGE_KEYS.fateMarriage,
    age: { tr: "Erişkinlik", en: "Adulthood" },
    title: {
      tr: "Dördüncü'nün karısı, çocuk bekleyen jinchūriki",
      en: "The Fourth's wife, a jinchūriki expecting a child",
    },
    text: {
      tr: "Minato ile evlendi; Minato Dördüncü Hokage oldu. Kushina hamile kaldığında köyün en kırılgan sırrı masaya geldi: doğum sırasında mühür zayıflar ve kuyruklu dışarı taşabilir. Doğum köyün dışında, gizli bir sığınakta, Üçüncü Hokage'nin karısının ve seçilmiş bir ANBU ekibinin gözetiminde planlandı. Plan yalnızca bir kişinin bilmesi hâlinde işe yarardı; o kişi bilmiyordu.",
      en: "She married Minato, and Minato became the Fourth Hokage. When Kushina fell pregnant the village's most fragile secret came to the table: during birth the seal weakens and the beast can spill out. The delivery was planned outside the village, in a hidden shelter, watched over by the Third Hokage's wife and a hand-picked ANBU team. The plan only worked if exactly one person did not know about it; that person did.",
    },
  },
  {
    key: "sealing",
    imageKey: KUSHINA_IMAGE_KEYS.fateSealing,
    age: { tr: "24 yaş", en: "Age 24" },
    title: { tr: "Mühürleme gecesi", en: "The night of the sealing" },
    text: {
      tr: "Maskeli adam sığınağı bastı, bebeği rehin aldı, mührü kırdı ve Kurama'yı Kushina'dan söktü. Kushina hayatta kaldı — Uzumaki yaşam gücünün en acı kanıtı. Kalan gücüyle zincirlerini çıkarıp kuyrukluyu bağladı, Minato ile birlikte pençenin önüne geçti ve ikisi de bebeğin üstüne kapandı. Minato mühre kendi çakrasını koydu, Kushina da kendisininkini: oğulları büyüyüp mührü zorladığında karşısında ana babası dursun diye.",
      en: "The masked man broke into the shelter, took the newborn hostage, cracked the seal and tore Kurama out of Kushina. Kushina survived — the cruellest proof there is of the Uzumaki life force. With what was left of her she brought the chains out and bound the beast, stepped in front of the claw beside Minato, and the two of them closed over the child. Minato put his own chakra into the seal and Kushina put hers, so that when their son grew up and pushed the seal too far, his parents would be standing there.",
    },
  },
];

/* ── Son sözler — sayfanın duygusal merkezi ─────────────────────────────── */

/**
 * Mühürleme gecesindeki uzun konuşma.
 *
 * Kaynak: Naruto: Shippūden'in mühürleme gecesi bölümleri. Metin arşivin
 * kendi Türkçe çevirisi — sözcük sözcük dublaj kopyası değil, ama içeriğine
 * hiçbir cümle EKLENMEDİ. Bölümün künyesinde bu açıkça yazıyor.
 */
export const KUSHINA_LAST_WORDS = {
  intro: {
    tr: "Kurama çıkarılmış, zincirler tutuyor, Minato mührü kurmaya hazırlanıyor. Kushina'nın konuşacak birkaç dakikası var ve onu bir vasiyet yazmak için değil, yemek, uyku ve arkadaş seçimi konuşmak için kullanıyor. Sayfadaki en uzun, en sakin blok bu — ve kesilmiyor.",
    en: "Kurama has been extracted, the chains are holding, Minato is preparing the seal. Kushina has a few minutes left to talk, and she spends them not on a testament but on eating, sleeping and picking your friends. This is the longest and quietest block on the page — and it is not interrupted.",
  },
  by: { tr: "Kushina Uzumaki", en: "Kushina Uzumaki" },
  toWhom: {
    tr: "yeni doğmuş oğluna",
    en: "to her newborn son",
  },
  paragraphs: [
    {
      tr: "Naruto… yemek seçme, ne varsa ye. Bol ye, iyi büyü. Her gün yıkan, üşütme kendini. Geç saatlere kadar oturma; uykunu al.",
      en: "Naruto… don't be a picky eater, eat what's in front of you. Eat plenty and grow strong. Take a bath every day, keep yourself warm. Don't stay up late; get your sleep.",
    },
    {
      tr: "Arkadaş edin. Çok olmasına gerek yok — gerçekten güvenebileceğin birkaç kişi yeter.",
      en: "Make friends. You don't need a lot of them; a few you can genuinely trust is enough.",
    },
    {
      tr: "Ben pek beceremezdim ama sen çalış, ninjutsu'na çalış. Herkesin iyi olduğu ve olmadığı şeyler vardır; bir şey bir türlü olmuyorsa hemen yıkılma. Akademideki öğretmenlerine ve senden büyük olanlara saygı göster.",
      en: "I was never much good at it, but you study, and practise your ninjutsu. Everyone has things they're good at and things they aren't; if something won't come, don't fall apart over it. Respect your teachers at the Academy, and the ones ahead of you.",
    },
    {
      tr: "Bir şinobinin üç yasağı vardır. Para alıp vermeye dikkat et; görev ücretlerini biriktir. Yirmi yaşına kadar içki yok, sonrasında da ölçüyü kaçırma. Üçüncüsü kadınlar… ben kadınım, çok bir şey diyemem. Şu kadarını bil: dünya kadınlarla erkeklerden kurulu, birine ilgi duyman kadar doğal bir şey yok. Yalnızca yanlış kadına tutulma. Benim gibi birini bul.",
      en: "A shinobi has three prohibitions. Be careful about lending and borrowing money; put your mission pay away. No drinking until you're twenty, and even then know your limit. The third one is women… I'm a woman, so I can't say much. Just know this: the world is made of women and men, and there is nothing more natural than taking an interest in someone. Only don't fall for the wrong one. Find someone like me.",
    },
    {
      tr: "Üç yasak demişken — Sannin'den Jiraiya-sensei'ye karşı biraz dikkatli ol.",
      en: "And speaking of the three prohibitions — be a little careful around Jiraiya-sensei of the Sannin.",
    },
    {
      tr: "Naruto… bundan sonra çok acı çekeceksin, çok zorlanacaksın. Kendin kal. Bir hayalin olsun, ve o hayali gerçekleştirecek güveni kendinde bul.",
      en: "Naruto… from here on there will be a great deal of pain, and a great deal of hardship. Stay yourself. Have a dream, and find in yourself the confidence to see it through.",
    },
    {
      tr: "Sana söylemek istediğim o kadar çok şey var ki… öğretmek istediğim o kadar çok şey var. Yanında kalmak isterdim. Seni seviyorum.",
      en: "There is so much more I want to tell you… so much more I want to teach you. I wanted to stay with you. I love you.",
    },
  ],
  coda: {
    text: {
      tr: "Naruto… babanın uzun konuşması da annenin söyledikleriyle aynı.",
      en: "Naruto… your father's long speech is the same as your mother's.",
    },
    by: { tr: "Minato Namikaze", en: "Minato Namikaze" },
    note: {
      tr: "Kushina'nın dakikalarını tek cümleye sığdırdı ve mührü kapattı.",
      en: "He fit Kushina's minutes into one sentence and closed the seal.",
    },
  },
  source: {
    tr: "Konuşma Naruto: Shippūden'in mühürleme gecesi bölümlerinden; buradaki Türkçe ve İngilizce metin arşivin kendi çevirisi. İçeriğine cümle eklenmedi.",
    en: "The speech comes from the sealing-night episodes of Naruto: Shippūden; the Turkish and English text here is the archive's own translation. No sentence was added to it.",
  },
} as const;

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const KUSHINA_CLOSING = {
  quotes: [
    {
      text: {
        tr: "Beni sevdiğin için teşekkür ederim.",
        en: "Thank you for loving me.",
      },
      by: { tr: "Kushina Uzumaki → Minato Namikaze", en: "Kushina Uzumaki → Minato Namikaze" },
      note: {
        tr: "Oğluna yirmi yıllık öğüt bıraktı; kocasına tek bir cümle bıraktı ve o cümle bir teşekkürdü.",
        en: "She left her son twenty years of advice. She left her husband one sentence, and that sentence was a thank-you.",
      },
    },
    {
      text: {
        tr: "Konoha'nın ilk kadın Hokage'si ben olacağım!",
        en: "I'm going to be Konoha's first female Hokage!",
      },
      by: { tr: "Kushina Uzumaki", en: "Kushina Uzumaki" },
      note: {
        tr: "Hokage olmadı. Aynı cümleyi aynı sınıfta kuran oğlu oldu.",
        en: "She never became Hokage. The son who said the same sentence in the same classroom did.",
      },
    },
  ],
  motto: "だってばね",
  mottoNote: {
    tr: "dattebane — cümlelerinin sonuna taktığı vurgu; oğluna “dattebayo” olarak geçti",
    en: "dattebane — the emphasis she stuck on the end of her sentences; it reached her son as “dattebayo”",
  },
  credit: {
    tr: "Künye verileri (doğum, boy, kan grubu, yaş, ana dildeki ad, “Kızıl Kanlı Habanero” ve “Domates” yan adları) ve yedek portre AniList'ten alınmıştır. Sayfadaki tam boy portre arşivin kendi yüklemesidir. Uzumaki girdap amblemi, kızıl saç telleri ve beş halkalı zincir bu sayfa için elle çizilmiş SVG'lerdir.",
    en: "Profile data (birthday, height, blood type, age, native name, and the “Red Hot-Blooded Habanero” and “Tomato” alternative names) and the fallback portrait come from AniList. The full-size portrait is the archive's own upload. The Uzumaki whirl emblem, the red strands and the five-link chain are SVGs drawn by hand for this page.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList profile" },
} as const;
