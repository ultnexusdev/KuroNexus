import type { LocalizedText } from "./types";

/**
 * Yamato — "Mokuton: Büyüyen Yapı" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 2006 kaydının ABILITY yuvaları,
 * `yamato:*` anahtarlarıyla. Görsel bağlı değilse bölüm görselsiz ama
 * AYAKTA çizilir; hiçbir bölüm yükleme bekleyerek çökmez.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (10 Ağustos), boy (178 cm), kan grubu (A), yaş (26), ikinci
 * adı (Tenzō / テンゾウ) ve "ANBU üyesi, Takım Kakashi'nin geçici kaptanı,
 * `Yamato` adını Tsunade koydu" satırının tamamı AniList künyesinden
 * birebir alındı (`anilist-detay-22.json`, karakter 2006). Kilo AniList
 * kaydında YOK, bu yüzden künye şeridinde de yok.
 *
 * Aynı künyenin açıklama metninde geçen iki ayrıntı sayfada da geçiyor ve
 * ikisi de uydurma değil: takımın "kamp kurmak" için ahşaptan ev yapması,
 * ve Kakashi'nin Ichiraku'da ona kendisini denk gördüğünü söylemesi.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * BRIEF §9: emin olunmayan replik yazılmaz. Yamato'nun Türkçeye güvenle
 * aktarılabilecek birebir repliği elimizde YOK; bu yüzden sayfada tırnak
 * içinde tek bir karakter cümlesi var ve o da AKTARIM olarak işaretlendi
 * (Kakashi'nin sözü, kaynağı AniList künyesinin kendi metni). Kapanışın
 * ikinci bloğu bir karaktere değil, açıkça ARŞİVE atfedildi — sahte replik
 * üretmemek için bilinçli tercih.
 *
 * ── TEKNİK ADLARINDA DİKKAT ──────────────────────────────────────────────
 * "Dört sütun" ailesinde iki teknik doğrulanabiliyor: Shichūrō no Jutsu
 * (四柱牢の術, dört sütunlu ZİNDAN) ve Shichūka no Jutsu (四柱家の術, dört
 * sütunlu EV). Sayfa bu ikisini kullanıyor. Üçüncü bir okunuş elimizde
 * doğrulanamadığı için yazılmadı.
 *
 * Bastırma tekniğinin uzun adı Hokage Shiki Jijun Jutsu — Kakuan Nitten
 * Suishu. Filigrana yalnızca güvenli kısmı (火影式耳順術) konuldu; ikinci
 * yarının kanji yazımı doğrulanamadığı için latin harflerle geçiyor.
 *
 * Keşif tohumu kartında Yamato'ya bir kuchiyose sözleşmesi ATFEDİLMİYOR:
 * doğrulanabilen şey hedefe bırakılan ahşap tohum ve ileri gönderilen
 * ahşap kopyalar. Kart bunu, kuchiyose ile iş gören şinobilerle
 * karşılaştırarak anlatıyor.
 */

export const YAMATO_ID = 2006;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const YAMATO_SITE_URL = "https://anilist.co/character/2006";

/**
 * Sergi görselleri — hepsi characterId 2006 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `yamato:` önekli (kurator modu şartı).
 */
export const YAMATO_IMAGE_KEYS = {
  /** Hero: orman içi, sisli, figür küçük (16:9) */
  hero: "yamato:hero",
  shichuro: "yamato:shichuro",
  daijurin: "yamato:daijurin",
  suppression: "yamato:suppression",
  kinoe: "yamato:kinoe",
  seed: "yamato:seed",
  suiton: "yamato:suiton",
  house: "yamato:house",
  growSeed: "yamato:grow-seed",
  growPillars: "yamato:grow-pillars",
  growDome: "yamato:grow-dome",
  growHouse: "yamato:grow-house",
  growForest: "yamato:grow-forest",
  faceCalm: "yamato:face-calm",
  faceScary: "yamato:face-scary",
  fateExperiment: "yamato:fate-experiment",
  fateRoot: "yamato:fate-root",
  fateCaptain: "yamato:fate-captain",
  fateSuppress: "yamato:fate-suppress",
  fateTaken: "yamato:fate-taken",
  closing: "yamato:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const YAMATO_SLOT_LABELS: Record<string, LocalizedText> = {
  [YAMATO_IMAGE_KEYS.hero]: {
    tr: "Hero — sisli orman, figür küçük ve uzakta (16:9)",
    en: "Hero — misty forest, small distant figure (16:9)",
  },
  [YAMATO_IMAGE_KEYS.shichuro]: {
    tr: "Shichūrō no Jutsu — yerden fırlayan dört sütun",
    en: "Shichūrō no Jutsu — four pillars bursting from the ground",
  },
  [YAMATO_IMAGE_KEYS.daijurin]: {
    tr: "Daijurin no Jutsu — koldan çıkan dal kütlesi",
    en: "Daijurin no Jutsu — the mass of branches leaving his arm",
  },
  [YAMATO_IMAGE_KEYS.suppression]: {
    tr: "Bastırma — avuçtaki mühür Naruto'nun göğsünde",
    en: "Suppression — the palm seal against Naruto's chest",
  },
  [YAMATO_IMAGE_KEYS.kinoe]: {
    tr: "Kinoe — Kök yıllarından ANBU maskesi",
    en: "Kinoe — the ANBU mask from the Root years",
  },
  [YAMATO_IMAGE_KEYS.seed]: {
    tr: "Keşif tohumu — avuçtaki ahşap çekirdek",
    en: "The scouting seed — a wooden pip in the palm",
  },
  [YAMATO_IMAGE_KEYS.suiton]: {
    tr: "Suiton — yükselen su duvarı",
    en: "Suiton — the rising wall of water",
  },
  [YAMATO_IMAGE_KEYS.house]: {
    tr: "Shichūka no Jutsu — kamp için büyütülen ev",
    en: "Shichūka no Jutsu — the house grown for camp",
  },
  [YAMATO_IMAGE_KEYS.growSeed]: {
    tr: "1. kademe — tohum: nakledilen hücre",
    en: "Stage 1 — the seed: the transplanted cell",
  },
  [YAMATO_IMAGE_KEYS.growPillars]: {
    tr: "2. kademe — dört sütun, aralarında duvar",
    en: "Stage 2 — four pillars with walls between them",
  },
  [YAMATO_IMAGE_KEYS.growDome]: {
    tr: "3. kademe — kapanan ahşap kubbe",
    en: "Stage 3 — the closing wooden dome",
  },
  [YAMATO_IMAGE_KEYS.growHouse]: {
    tr: "4. kademe — takımın evi, pencereli",
    en: "Stage 4 — the team's house, with windows",
  },
  [YAMATO_IMAGE_KEYS.growForest]: {
    tr: "5. kademe — bir anda büyüyen orman",
    en: "Stage 5 — a forest grown in one breath",
  },
  [YAMATO_IMAGE_KEYS.faceCalm]: {
    tr: "Kaptan yüzü — sakin, ANBU duruşu",
    en: "The captain's face — calm, ANBU posture",
  },
  [YAMATO_IMAGE_KEYS.faceScary]: {
    tr: "Korkutucu yüz — o meşhur jest",
    en: "The scary face — that famous gesture",
  },
  [YAMATO_IMAGE_KEYS.fateExperiment]: {
    tr: "Deney — laboratuvardaki tüpler",
    en: "The experiment — tubes in the laboratory",
  },
  [YAMATO_IMAGE_KEYS.fateRoot]: {
    tr: "Kök yılları — maskeli çocuk",
    en: "The Root years — the masked child",
  },
  [YAMATO_IMAGE_KEYS.fateCaptain]: {
    tr: "Kaptanlık — Takım Kakashi'nin önünde",
    en: "The captaincy — standing before Team Kakashi",
  },
  [YAMATO_IMAGE_KEYS.fateSuppress]: {
    tr: "Bastırma — kabaran manto ve mühür",
    en: "Suppression — the swelling cloak and the seal",
  },
  [YAMATO_IMAGE_KEYS.fateTaken]: {
    tr: "Alınan beden — Kabuto'nun elinde",
    en: "The taken body — in Kabuto's hands",
  },
  [YAMATO_IMAGE_KEYS.closing]: {
    tr: "Kapanış — boş orman, ayakta kalan ev",
    en: "Closing — an empty forest and the house still standing",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const YAMATO_IDENTITY = {
  name: "Yamato",
  nativeName: "ヤマト",
  /** Hero filigranı — dikey sütun, dekoratif (aria-hidden) */
  watermark: "木遁",
  epigraph: {
    tr: "Üç adı oldu ve üçünü de başkaları koydu. Kendi eliyle adını koyduğu tek şey, takımın uyuduğu evdi.",
    en: "He had three names and someone else chose each one. The only thing he ever named himself was the house his team slept in.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "10 Ağustos", en: "10 August" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "178 cm", en: "178 cm" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "A", en: "A" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "26", en: "26" },
    },
    {
      label: { tr: "Rütbe", en: "Rank" },
      value: {
        tr: "ANBU — Kök'ten çıkma",
        en: "ANBU — brought up in Root",
      },
    },
    {
      label: { tr: "Takım", en: "Team" },
      value: {
        tr: "Takım Kakashi — geçici kaptan",
        en: "Team Kakashi — acting captain",
      },
    },
    {
      label: { tr: "Diğer adları", en: "Other names" },
      value: { tr: "Tenzō · Kinoe", en: "Tenzō · Kinoe" },
    },
    {
      label: { tr: "Taşıdığı", en: "What he carries" },
      value: {
        tr: "Hashirama Senju'nun hücresi",
        en: "A cell of Hashirama Senju",
      },
    },
  ],
} as const;

/**
 * Üç ad, üç sahibi.
 *
 * Hero'da bir merdiven olarak çiziliyor. Kicker DEĞİL: her satır kimin
 * koyduğunu söylüyor, yani başlığın süsü değil sayfanın tezi.
 */
export const YAMATO_NAMES = [
  {
    name: "Kinoe",
    native: "キノエ",
    by: { tr: "Danzō koydu — Kök", en: "Named by Danzō — Root" },
  },
  {
    name: "Tenzō",
    native: "テンゾウ",
    by: { tr: "ANBU sicilinde", en: "On the ANBU register" },
  },
  {
    name: "Yamato",
    native: "ヤマト",
    by: { tr: "Tsunade koydu — Takım Kakashi", en: "Named by Tsunade — Team Kakashi" },
  },
] as const;

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

export const YAMATO_MODE_TEXT = {
  enter: { tr: "Mokuton modu", en: "Wood Release mode" },
  exit: { tr: "Ahşabı geri çek", en: "Withdraw the wood" },
  hint: {
    tr: "Ahşap kenarlardan içeri sızıyor: köşeler yumuşuyor, yeşil derinleşiyor.",
    en: "The wood is seeping in from the edges: the corners soften and the green deepens.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const YAMATO_HERO = {
  lede: {
    tr: "Konoha'da Mokuton kullanabilen ikinci kişi. Birincisi Birinci Hokage'ydi ve öleli çok olmuştu; Yamato bu gücü miras almadı, ona yerleştirildi.",
    en: "The second person in Konoha able to use Wood Release. The first was the First Hokage, dead for decades; Yamato did not inherit that power — it was put inside him.",
  },
  portraitAlt: {
    tr: "Yamato — arşive yüklenmiş kadro portresi",
    en: "Yamato — cast portrait uploaded to the archive",
  },
  portraitAltFallback: {
    tr: "Yamato — AniList künye portresi",
    en: "Yamato — AniList profile portrait",
  },
} as const;

/**
 * Görsel alt metinleri — BRIEF §3.5: her alt iki dilli ve KAYNAĞINI söyler.
 * Yoldaş portrelerinin tamamı kendi veritabanımızdan geliyor (PORTRAIT
 * yuvası), bu yüzden tek bir son ek yetiyor.
 */
export const YAMATO_ALT = {
  companionSuffix: {
    tr: "— arşive yüklenmiş kadro portresi",
    en: "— cast portrait uploaded to the archive",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const YAMATO_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "Naruto Universe" },
} as const;

export const YAMATO_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "The record" },
    lede: {
      tr: "Bir kod adının altındaki tutanak. Yaş, boy, kan grubu — hepsi kayıtlı. Asıl adı değil.",
      en: "The file kept under a codename. Age, height, blood type — all on record. His real name is not.",
    },
  },
  roots: {
    title: { tr: "Kök, gövde, dal", en: "Root, trunk, branch" },
    lede: {
      tr: "Bir ağacı üç parçadan okursun: onu besleyen kök, ayakta tutan gövde, taşıdığı dal. Yamato'nun etrafındaki altı kişi tam olarak böyle diziliyor — ve kökte duran üçü onu hiç sormadı.",
      en: "You read a tree in three parts: the root that feeds it, the trunk that holds it up, the branch it carries. The six people around Yamato line up exactly that way — and the three at the root never asked him first.",
    },
  },
  jutsu: {
    title: { tr: "Mokuton'un üç işi", en: "Three jobs of the Wood Release" },
    lede: {
      tr: "Mokuton bir saldırı tekniği değil, bir inşaat tekniği. Yamato'nun üç büyük kullanımı da aynı fiilin üç ayarı: bir şeyi kapatmak, bir şeyi yarmak, bir şeyi bastırmak.",
      en: "Wood Release is not an attack technique; it is a construction technique. Yamato's three great uses are three settings of one verb: close something in, tear something open, hold something down.",
    },
  },
  bench: {
    title: { tr: "Tezgâh", en: "The workbench" },
    lede: {
      tr: "Büyük yapıların altında dört küçük alet var. Biri geçmişten kalma, üçü her gün kullanılıyor.",
      en: "Beneath the great structures lie four small tools. One is left over from the past; three are in daily use.",
    },
  },
  grow: {
    title: { tr: "Büyüyen yapı", en: "The growing structure" },
    lede: {
      tr: "Aynı mühür, aynı eller — değişen tek şey ölçek. Gövdedeki boğumlara bas: tohumdan ormana beş kademe, her kademede ahşap bir kat daha yükseliyor.",
      en: "The same seal, the same hands — the only thing that changes is scale. Press the knots on the trunk: five stages from seed to forest, and at each one the wood climbs another storey.",
    },
  },
  faces: {
    title: { tr: "İki yüz", en: "Two faces" },
    lede: {
      tr: "Kaptanlığın iki ayarı var ve ikisi de aynı adamın yüzünde duruyor.",
      en: "The captaincy has two settings, and both of them sit on the same man's face.",
    },
  },
  fate: {
    title: { tr: "Kader çizelgesi", en: "A life in five entries" },
    lede: {
      tr: "Beş kayıt. Üçünde kararı başkası verdi, birinde Yamato verdi, sonuncusunda kimse sormadı.",
      en: "Five entries. In three of them someone else decided, in one he decided, and in the last nobody asked.",
    },
  },
} as const;

/* ── Kök, gövde, dal (yoldaş portreleri) ────────────────────────────────── */

/**
 * `characterId` alanları `EXPERIENCE_COMPANIONS[2006]` listesiyle birebir
 * aynı: 85 Kakashi, 17 Naruto, 1901 Sai, 12464 Hashirama, 2455 Orochimaru,
 * 23424 Danzō. Portre kaydı olmayan kişi adıyla çizilir, bölüm çökmez.
 *
 * `part`: ağacın hangi katmanı. Bölüm bunları YUKARIDAN AŞAĞIYA diziyor —
 * dallar üstte, gövde ortada, kökler altta — yani okuma yönü ağacın kendi
 * yönü. Kök kartları toprağın altındaymış gibi koyu çiziliyor.
 */
export const YAMATO_KIN = [
  {
    characterId: 17,
    name: "Naruto Uzumaki",
    part: "branch" as const,
    role: { tr: "Tuttuğu kişi", en: "The one he holds" },
    note: {
      tr: "Yamato'nun Takım Kakashi'ye katılma sebebi tek bir cümleye sığıyordu: Naruto kontrolü kaybederse onu durdurabilecek tek kişi o.",
      en: "The reason Yamato joined Team Kakashi fitted into one sentence: if Naruto lost control, he was the only one who could stop him.",
    },
  },
  {
    characterId: 1901,
    name: "Sai",
    part: "branch" as const,
    role: { tr: "Aynı kökten gelen", en: "Grown from the same root" },
    note: {
      tr: "İkisi de Kök'ün elinden çıktı, ikisi de Takım 7'ye sonradan yerleştirildi. Aralarındaki fark dokuz yıl ve bir isim.",
      en: "Both came out of Root, both were placed into Team 7 after the fact. Nine years and a name separate them.",
    },
  },
  {
    characterId: 85,
    name: "Kakashi Hatake",
    part: "trunk" as const,
    role: { tr: "Yerini aldığı kişi", en: "The man whose place he took" },
    note: {
      tr: "ANBU'da kıdemlisiydi, sonra takımını devraldı. Kakashi ona bir kez kendisine denk gördüğünü söyledi; Yamato o gün öğle yemeğinin hesabını ödedi.",
      en: "His senior in the ANBU, and later the man whose squad he inherited. Kakashi once told him he considered him an equal; Yamato paid for lunch that day.",
    },
  },
  {
    characterId: 12464,
    name: "Hashirama Senju",
    part: "root" as const,
    role: { tr: "Hücrenin sahibi", en: "The owner of the cell" },
    note: {
      tr: "Mokuton onun kan sınırıydı ve onunla birlikte gömülmüştü. Yamato'nun bedeninden çıkan her dal, aslında ölü bir Hokage'den artakalan.",
      en: "Wood Release was his bloodline limit, buried with him. Every branch that leaves Yamato's body is a remainder of a dead Hokage.",
    },
  },
  {
    characterId: 2455,
    name: "Orochimaru",
    part: "root" as const,
    role: { tr: "Deneyi yapan", en: "The one who ran the experiment" },
    note: {
      tr: "Altmış bebeğe Hashirama'nın hücresini nakletti; elli dokuzu dayanamadı. Deneyin tek çıktısı bir çocuktu ve o çocuğun kaydı bugün bu sayfa.",
      en: "He transplanted Hashirama's cells into sixty infants; fifty-nine did not survive. The experiment's single output was one child, and that child's file is this page.",
    },
  },
  {
    characterId: 23424,
    name: "Danzō Shimura",
    part: "root" as const,
    role: { tr: "Kök'ün başı", en: "The head of Root" },
    note: {
      tr: "Sağ kalan çocuğu aldı, ona Kinoe adını verdi ve gücünü köyün gölge tarafında çalıştırdı. Yamato'nun ilk mesleği ahşap değil, sessizlikti.",
      en: "He took the surviving child, called him Kinoe, and put his power to work on the village's shadow side. Yamato's first trade was not carpentry but silence.",
    },
  },
] as const;

/* ── Mokuton'un üç işi ──────────────────────────────────────────────────── */

export const YAMATO_JUTSU = [
  {
    key: "shichuro" as const,
    kanji: "四柱牢の術",
    name: "Mokuton: Shichūrō no Jutsu",
    turkish: { tr: "Dört Sütun Zindanı", en: "Four-Pillar Prison" },
    tagline: {
      tr: "Yerden dört sütun fırlar, aralarına duvar örülür: hedef dövüşmeden kapatılır.",
      en: "Four pillars burst from the ground and walls grow between them: the target is shut in without a fight.",
    },
    text: {
      tr: "Yamato'nun imzası vurmak değil kapatmaktır. Dört ahşap sütun yerden çıkar, aralarına gövde büyür ve içeride ne varsa bir odaya kilitlenir. Aynı ailenin ikinci tekniği (Shichūka no Jutsu) birebir aynı dört sütunu kaldırır, ama duvarlarına pencere açar: biri zindan, öbürü ev. Aradaki bütün fark niyettir — teknik tek bir teknik.",
      en: "Yamato's signature is not the strike but the enclosure. Four wooden pillars rise, trunk grows between them, and whatever stands inside is locked into a room. The second technique of the same family, Shichūka no Jutsu, raises exactly those four pillars but cuts windows into the walls: one is a cell, the other a home. The entire difference is intent — the technique is one technique.",
    },
    traits: [
      { tr: "Dört sütun", en: "Four pillars" },
      { tr: "Dövüşsüz durdurur", en: "Stops without a fight" },
      { tr: "Zindan ile ev aynı iskelet", en: "Cell and home, one skeleton" },
    ],
  },
  {
    key: "daijurin" as const,
    kanji: "大樹林の術",
    name: "Mokuton: Daijurin no Jutsu",
    turkish: { tr: "Büyük Ağaç Ormanı", en: "Great Forest Technique" },
    tagline: {
      tr: "Kol bir anda kalınlaşır ve önündeki her şeyi süpüren bir dal kütlesine dönüşür.",
      en: "The arm thickens in an instant into a mass of branches that sweeps everything ahead of it.",
    },
    text: {
      tr: "Kapatmanın tersi. Yamato kolunu uzatır, ahşap bedeninden büyüyerek çıkar ve sivri uçlu bir dal ormanı hâlinde ileri atılır. Bu teknik Yamato'nun ölçeğinin sınırını gösterir: bir odayı örmek dikkat işi, bir ormanı bir anda büyütmek ise ham güç işi — ve o ham güç aslında ona ait değil. Kullandığında hep bir hesap ödüyor gibi görünmesinin sebebi bu.",
      en: "The opposite of enclosure. Yamato extends his arm, the wood grows out of his body, and a forest of pointed branches drives forward. This technique marks the ceiling of his scale: weaving a room is a matter of care, growing a forest in one breath is raw force — and the raw force is not his. That is why he always looks like a man settling a bill when he uses it.",
    },
    traits: [
      { tr: "Kütle ve menzil", en: "Mass and reach" },
      { tr: "Bedenden büyür", en: "Grows out of the body" },
      { tr: "Ödünç ölçek", en: "A borrowed scale" },
    ],
  },
  {
    key: "suppression" as const,
    kanji: "火影式耳順術",
    name: "Hokage Shiki Jijun Jutsu — Kakuan Nitten Suishu",
    turkish: {
      tr: "Kuyruklu canavar chakrasını bastırma",
      en: "Suppressing tailed-beast chakra",
    },
    tagline: {
      tr: "Hashirama hücresinin asıl işi bu: dövüşmek değil, dizginlemek.",
      en: "This is the real work of the Hashirama cell: not fighting, but reining in.",
    },
    text: {
      tr: "Mokuton'un tek bir sebebi vardır ve o sebep dövüş değildir. Birinci Hokage kuyruklu canavarları bu hücreyle dizginledi; o hücre bir çocuğa nakledildiğinde köyün aslında satın aldığı şey de buydu. Naruto'nun mantosu kabardığında Yamato avucundaki mührü göğsüne bastırır ve chakra geri çekilir. Takım Kakashi'nin kaptanlığı ona teknik değerlendirmeye göre verilmedi: yalnızca onun elinde bu fren olduğu için verildi.",
      en: "Wood Release exists for one reason, and that reason is not combat. The First Hokage used this cell to rein in the tailed beasts; when the cell was transplanted into a child, that capability is what the village actually bought. When Naruto's cloak swells, Yamato presses the seal in his palm to the boy's chest and the chakra withdraws. He was not given Team Kakashi on a technical assessment — he was given it because he was the only one holding this brake.",
    },
    traits: [
      { tr: "Fren, silah değil", en: "A brake, not a weapon" },
      { tr: "Avuçtaki mühür", en: "The seal in the palm" },
      { tr: "Kaptanlığın gerçek sebebi", en: "The real reason for the captaincy" },
    ],
  },
] as const;

/* ── Tezgâh — dört küçük ────────────────────────────────────────────────── */

export const YAMATO_BENCH = [
  {
    key: "kinoe" as const,
    imageKey: YAMATO_IMAGE_KEYS.kinoe,
    name: { tr: "Kök'ün çocuğu: Kinoe", en: "Root's child: Kinoe" },
    note: {
      tr: "Ahşaptan önce maske vardı. Danzō'nun altında geçen yıllarda adı Kinoe'ydi ve işi köyün kimseye anlatmadığı işlerdi. Yamato'nun kaptanlıktaki soğukkanlılığı bir mizaç değil, o yıllardan kalma bir alışkanlık.",
      en: "Before the wood there was a mask. Under Danzō he was called Kinoe, and his work was the work the village never spoke of. The composure he carries as a captain is not temperament; it is a habit left over from those years.",
    },
  },
  {
    key: "seed" as const,
    imageKey: YAMATO_IMAGE_KEYS.seed,
    name: { tr: "Keşif tohumu", en: "The scouting seed" },
    note: {
      tr: "Takım dağılsa da Yamato kimin nerede olduğunu bilir: hedefe bıraktığı ahşap tohum ve ileri gönderdiği ahşap kopyalar ona sürekli rapor verir. Başka şinobiler bu işi bir kuchiyose sözleşmesiyle görür; Yamato'nun aleti kendi bedeninden çıkıyor.",
      en: "Even with the team scattered, Yamato knows where everyone is: a wooden seed left on his target and wood clones sent ahead report back to him without pause. Other shinobi do this work through a summoning contract; Yamato's instrument grows out of his own body.",
    },
  },
  {
    key: "suiton" as const,
    imageKey: YAMATO_IMAGE_KEYS.suiton,
    name: { tr: "Suiton — suyun kendi başına", en: "Suiton — water on its own" },
    note: {
      tr: "Mokuton, toprak ile suyun aynı mühürde birleşmesidir; yani ikisi Yamato'nun elinde tek başına da çalışır. Suijinheki bir duvarı sudan örer — ahşap duvarın hızlı ve harcanabilir kardeşi.",
      en: "Wood Release is earth and water joined inside one seal, which means each of them also works alone in his hands. Suijinheki raises a wall out of water — the fast, expendable sibling of the wooden one.",
    },
  },
  {
    key: "house" as const,
    imageKey: YAMATO_IMAGE_KEYS.house,
    name: { tr: "Kampın evi", en: "The camp house" },
    note: {
      tr: "Görev arazide uzayınca Yamato çadır kurmaz: dört sütun kaldırır, çatı büyütür, kapı açar. Künyesinde bile geçen ayrıntı bu — görev dışındayken Mokuton'u rahat etmek için kullanmaktan çekinmiyor.",
      en: "When a mission runs long in the field, Yamato does not pitch a tent: he raises four pillars, grows a roof and cuts a door. Even his profile records it — off duty he is perfectly willing to use Wood Release for comfort.",
    },
  },
] as const;

/* ── Büyüyen yapı — sayfanın kalbi ─────────────────────────────────────── */

export const YAMATO_GROW_UI = {
  listLabel: { tr: "Büyüme kademeleri", en: "Growth stages" },
  stageWord: { tr: "kademe", en: "stage" },
  prev: { tr: "Bir boğum aşağı", en: "One knot down" },
  next: { tr: "Bir boğum yukarı", en: "One knot up" },
  scaleLabel: { tr: "Ölçek", en: "Scale" },
  keyboardHint: {
    tr: "Yukarı/aşağı ok tuşlarıyla gövdede gezinebilirsin.",
    en: "The up and down arrow keys move you along the trunk.",
  },
  treeAlt: {
    tr: "Gövde şeması: kademe yükseldikçe ahşap gövde uzuyor, dalları çoğalıyor ve o kademenin yapısı gövdenin dibinde beliriyor.",
    en: "Trunk diagram: as the stage rises the wooden trunk grows taller, its branches multiply, and that stage's structure appears at its foot.",
  },
} as const;

/**
 * Beş kademe — sayfanın kalbi.
 *
 * `scale` alanı bilinçli olarak bir ÖLÇÜ: bölümdeki tek monospace satır o
 * ve mimari bir çizimdeki kot işareti gibi okunuyor.
 */
export const YAMATO_GROWTH = [
  {
    key: "seed" as const,
    imageKey: YAMATO_IMAGE_KEYS.growSeed,
    kanji: "種",
    title: { tr: "Tohum", en: "Seed" },
    scale: { tr: "bir avuç", en: "a handful" },
    read: {
      tr: "Mokuton bir yetenek değil, bir nakil. Hashirama Senju'nun hücresi altmış bebeğe yerleştirildi ve elli dokuzu dayanamadı. Kaynak burada: bir çocuğun içine konmuş, ona ait olmayan bir tohum.",
      en: "Wood Release is not a talent but a transplant. Hashirama Senju's cells were placed into sixty infants and fifty-nine of them did not survive. The source is here: a seed put inside a child, a seed that was never his.",
    },
    note: {
      tr: "Bu kademenin ölçüsü yok; yalnızca bir sağ kalan var.",
      en: "This stage has no measurements — only a survivor.",
    },
  },
  {
    key: "pillars" as const,
    imageKey: YAMATO_IMAGE_KEYS.growPillars,
    kanji: "四柱",
    title: { tr: "Sütunlar", en: "Pillars" },
    scale: { tr: "dört sütun · bir oda", en: "four pillars · one room" },
    read: {
      tr: "İlk gerçek yapı bir duvar değil, dört sütun. Shichūrō no Jutsu tam olarak bu: kaldır, bağla, kapat. Yamato'nun bütün mimarisi bu dörtlünün üstüne kuruluyor — sonrasında yapılan her şey aynı iskeletin başka bir çözümü.",
      en: "The first real structure is not a wall but four pillars. Shichūrō no Jutsu is exactly that: raise, join, close. Yamato's whole architecture stands on this quartet — everything after it is another solution over the same skeleton.",
    },
    note: {
      tr: "Sütun sayısı hiç değişmiyor. Değişen, aralarına ne örüldüğü.",
      en: "The number of pillars never changes. What changes is what gets woven between them.",
    },
  },
  {
    key: "dome" as const,
    imageKey: YAMATO_IMAGE_KEYS.growDome,
    kanji: "檻",
    title: { tr: "Kubbe", en: "Dome" },
    scale: { tr: "bir arena", en: "one arena" },
    read: {
      tr: "Sütunlar tepeden birbirine bağlanınca oda kubbeye döner. Yamato bunu çoğu zaman bir düşmanı tutmak için değil, bir dövüşü dışarı sızdırmamak için kurar: içeride ne olursa olsun dışarıda kimse görmez, kimse zarar görmez.",
      en: "Join the pillars at the top and the room becomes a dome. He usually raises it not to hold an enemy but to keep a fight from leaking out: whatever happens inside, no one outside sees it and no one outside is hurt.",
    },
    note: {
      tr: "Hapishane burada iki yönlü çalışıyor — dışarıyı da koruyor.",
      en: "Here the prison works in both directions — it also protects the outside.",
    },
  },
  {
    key: "house" as const,
    imageKey: YAMATO_IMAGE_KEYS.growHouse,
    kanji: "四柱家",
    title: { tr: "Ev", en: "House" },
    scale: { tr: "iki kat · bir takım", en: "two storeys · one squad" },
    read: {
      tr: "Aynı dört sütun, bu sefer duvarlarına pencere açılıyor. Shichūka no Jutsu bir savaş tekniği olarak kayıtlı değil; Yamato onu takım arazide uzun kalınca, uyumak için kuruyor. Sayfanın en ilginç yeri burası: adamın en meşhur becerisi, en az dövüştüğü an.",
      en: "The same four pillars, only now the walls get windows. Shichūka no Jutsu is not filed as a combat technique; Yamato raises it when the squad is out in the field too long and needs to sleep. This is the most interesting spot on the page: the man's most famous skill at the moment he fights least.",
    },
    note: {
      tr: "Kendi adını verdiği tek yapı bu.",
      en: "This is the only structure he ever named himself.",
    },
  },
  {
    key: "forest" as const,
    imageKey: YAMATO_IMAGE_KEYS.growForest,
    kanji: "大樹林",
    title: { tr: "Orman", en: "Forest" },
    scale: { tr: "Hashirama ölçeği", en: "Hashirama scale" },
    read: {
      tr: "Son kademede yapı biter, arazi başlar. Daijurin no Jutsu bir binaya benzemez; bir ormanın bir anda büyümesidir. Yamato buraya ancak zorlandığında çıkar, çünkü bu ölçek onun değil — ve savaşta Kabuto onu tam olarak bunun için aldı: o beden bir ordu büyütebiliyordu.",
      en: "At the last stage the building ends and the terrain begins. Daijurin no Jutsu does not resemble a structure; it is a forest arriving all at once. Yamato only climbs this high when he is forced to, because the scale is not his — and in the war Kabuto took him for exactly this: that body could grow an army.",
    },
    note: {
      tr: "Gövde burada sayfanın dışına çıkıyor; ölçek artık okunmuyor.",
      en: "Here the trunk leaves the page; the scale stops being readable.",
    },
  },
] as const;

/* ── İki yüz ────────────────────────────────────────────────────────────── */

export const YAMATO_FACES = {
  calm: {
    imageKey: YAMATO_IMAGE_KEYS.faceCalm,
    label: { tr: "Kaptan", en: "The captain" },
    text: {
      tr: "ANBU'dan gelen sakinlik: sesini yükseltmez, plan bozulduğunda da bozulmaz. Takım Kakashi'nin en tehlikeli üyesi değil, ayakta tutan üyesi.",
      en: "Composure carried over from the ANBU: he does not raise his voice, and he does not come apart when the plan does. Not Team Kakashi's most dangerous member — the one holding it up.",
    },
    alt: {
      tr: "Yamato — kaptan duruşu, arşive yüklenmiş sahne görseli",
      en: "Yamato — the captain's posture, scene image uploaded to the archive",
    },
  },
  scary: {
    imageKey: YAMATO_IMAGE_KEYS.faceScary,
    label: { tr: "O yüz", en: "That face" },
    text: {
      tr: "Söz dinlenmediğinde tek bir şey yapar: yüzünü değiştirir. Kimseye vurmaz, kimseyi bağlamaz — Naruto ile Sakura'nın hizaya girmesi için o kadarı yetiyor.",
      en: "When nobody listens he does exactly one thing: he changes his face. He strikes no one and binds no one — with Naruto and Sakura, that much is enough.",
    },
    alt: {
      tr: "Yamato — korkutucu yüz jesti, arşive yüklenmiş sahne görseli",
      en: "Yamato — the scary-face gesture, scene image uploaded to the archive",
    },
  },
  line: {
    tr: "Sayfadaki tek şaka bu ve kaptan onu bilerek kullanıyor: dört sütun kaldırmaya değmeyen işler için bir yüz yeter.",
    en: "It is the page's only joke, and the captain uses it on purpose: for jobs that do not warrant four pillars, one face will do.",
  },
} as const;

/* ── Kader çizelgesi ────────────────────────────────────────────────────── */

/**
 * Çizelge satırı. `quote` opsiyonel — beş kaydın yalnızca birinde var ve o
 * da AKTARIM (bkz. dosya başındaki replik disiplini notu). `as const` bir
 * birleşim tipi üretip opsiyonel alanı gizlediği için satır tipi burada
 * açıkça yazıldı.
 */
export interface YamatoFateEntry {
  key: string;
  imageKey: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: LocalizedText; kind: LocalizedText };
}

export const YAMATO_TIMELINE: YamatoFateEntry[] = [
  {
    key: "experiment",
    imageKey: YAMATO_IMAGE_KEYS.fateExperiment,
    age: { tr: "Adı yokken", en: "Before he had a name" },
    title: {
      tr: "Altmış çocuktan sağ kalan",
      en: "The survivor of sixty children",
    },
    text: {
      tr: "Orochimaru, Birinci Hokage'nin hücresini altmış bebeğe nakletti. Elli dokuzu öldü. Sağ kalan tek çocuğun bedeni hücreyi kabul etti ve Mokuton onunla birlikte köye geri döndü — kimsenin planlamadığı, kimsenin durduramadığı bir sonuç olarak.",
      en: "Orochimaru transplanted the First Hokage's cells into sixty infants. Fifty-nine died. The one child who lived accepted the cell, and Wood Release came back to the village with him — an outcome nobody planned and nobody could undo.",
    },
  },
  {
    key: "root",
    imageKey: YAMATO_IMAGE_KEYS.fateRoot,
    age: { tr: "Kinoe yılları", en: "The Kinoe years" },
    title: { tr: "Kök'ün altında", en: "Under Root" },
    text: {
      tr: "Danzō Shimura çocuğu aldı, ona Kinoe adını verdi ve Kök'e yazdı. Ahşap orada bir miras değil, bir alettir: köyün resmî kayıtlarına girmeyen işlerde kullanılır. Yamato'nun bugün hâlâ taşıdığı ölçülü sessizlik o yılların bakiyesi.",
      en: "Danzō Shimura took the child, named him Kinoe and entered him into Root. There the wood is not an inheritance but an instrument, used on work that never reaches the village's official record. The measured silence Yamato still carries is the balance left from those years.",
    },
  },
  {
    key: "captain",
    imageKey: YAMATO_IMAGE_KEYS.fateCaptain,
    age: { tr: "26 yaş", en: "Age 26" },
    title: {
      tr: "Kakashi'nin yerine, üçüncü adla",
      en: "In Kakashi's place, under a third name",
    },
    text: {
      tr: "Kakashi hastanede kalınca Tsunade Takım 7'yi başsız bırakmadı: ANBU'dan bir isim çekti ve ona yeni bir kod adı verdi — Yamato. Takımın geçici kaptanı oldu ve geçici olan on yıllık bir kimliğe dönüştü.",
      en: "With Kakashi in hospital, Tsunade did not leave Team 7 without a head: she pulled a name out of the ANBU and gave it a new codename — Yamato. He became the squad's acting captain, and the acting part turned into a decade-long identity.",
    },
    quote: {
      text: {
        tr: "Seni kendime denk görüyorum.",
        en: "I consider you an equal.",
      },
      by: { tr: "Kakashi Hatake", en: "Kakashi Hatake" },
      kind: {
        tr: "AniList künyesinin anlattığı sözden aktarım — birebir replik değil",
        en: "Reported from the line recounted in the AniList profile — not verbatim",
      },
    },
  },
  {
    key: "suppress",
    imageKey: YAMATO_IMAGE_KEYS.fateSuppress,
    age: { tr: "26 yaş", en: "Age 26" },
    title: { tr: "Frenin adı", en: "The name of the brake" },
    text: {
      tr: "Naruto'nun mantosu kabardıkça takımın etrafındaki herkes geri çekilir; Yamato ileri gider. Avucundaki mühür göğse değer, chakra geri iner. Bu kaydın en soğuk tarafı şu: Yamato o takıma bir öğretmen olarak değil, bir emniyet tertibatı olarak yazıldı ve bunu kendisi de biliyordu.",
      en: "As Naruto's cloak swells, everyone around the squad backs away; Yamato steps forward. The seal in his palm meets the chest and the chakra sinks back. The coldest part of this entry: he was written into that team not as a teacher but as a safety device, and he knew it.",
    },
  },
  {
    key: "taken",
    imageKey: YAMATO_IMAGE_KEYS.fateTaken,
    age: { tr: "Savaşta", en: "In the war" },
    title: { tr: "Alınan beden", en: "The body they took" },
    text: {
      tr: "Dördüncü Büyük Şinobi Savaşı'nda Kabuto onu kaçırdı. İstediği Yamato değildi, içindeki hücreydi: o hücre Zetsu ordusunu büyütmek için kullanıldı. Yamato savaşın büyük kısmını, kendi gücünün karşı tarafta çalıştığını bilerek geçirdi.",
      en: "In the Fourth Great Shinobi War, Kabuto abducted him. What he wanted was not Yamato but the cell inside him, and that cell was used to grow the Zetsu army. Yamato spent most of the war knowing his own power was working for the other side.",
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

/**
 * İki blok. Birincisi bir karaktere ait AKTARIM (kaynağı işaretli),
 * ikincisi açıkça arşivin kendi cümlesi — sahte replik üretmemek için.
 */
export const YAMATO_CLOSING = {
  quotes: [
    {
      text: {
        tr: "Seni kendime denk görüyorum.",
        en: "I consider you an equal.",
      },
      by: { tr: "Kakashi Hatake", en: "Kakashi Hatake" },
      note: {
        tr: "AniList künyesindeki anlatıdan aktarım — birebir replik değil. Kakashi bunu söylediğinde Yamato Ichiraku'nun hesabını ödedi; bir cümle için ödenmiş en ucuz bedel.",
        en: "Reported from the account in the AniList profile — not a verbatim line. When Kakashi said it, Yamato picked up the tab at Ichiraku: the cheapest price ever paid for a sentence.",
      },
    },
    {
      text: {
        tr: "Ona verilen her ad başkasının işineydi. Yalnızca bir kez kendi işi için ahşap büyüttü: takımın uyuduğu ev.",
        en: "Every name he was given belonged to someone else's work. Only once did he grow wood for his own: the house his team slept in.",
      },
      by: { tr: "Arşivin notu", en: "The archive's note" },
      note: {
        tr: "Bu satır bir replik değil; sayfanın kendi hükmü, kaynağı yok.",
        en: "This line is not a quotation; it is the page's own verdict, with no source but itself.",
      },
    },
  ],
  motto: "四柱家",
  mottoNote: {
    tr: "shichūka — “dört sütunlu ev”",
    en: "shichūka — “the four-pillar house”",
  },
  credit: {
    tr: "Künye verileri (doğum, boy, kan grubu, yaş, ikinci ad, rütbe) ve yedek portre AniList'ten alınmıştır. Sayfadaki tam boy portre arşivin kendi yüklemesidir; gövde, yıllık halkalar, kökler ve büyüme şeması bu sayfa için elle çizilmiş SVG'lerdir.",
    en: "Profile data (birthday, height, blood type, age, alternative name, rank) and the fallback portrait come from AniList. The full-size portrait is the archive's own upload; the trunk, the growth rings, the roots and the growth diagram are SVGs drawn by hand for this page.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList profile" },
} as const;
