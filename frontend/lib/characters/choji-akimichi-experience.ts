import type { LocalizedText } from "./types";

/**
 * Chōji Akimichi — "Üç Renkli Hap" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 2008 kaydının ABILITY yuvaları,
 * `choji:*` anahtarlarıyla. Görsel bağlı değilse bölüm görselsiz ama AYAKTA
 * çizilir; hiçbir bölüm yükleme bekleyerek çökmez.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * Chōji'nin tekniği bir güç merdiveni değil, bir FİYAT LİSTESİ. Akimichi
 * hidenı kaloriyi çakraya çeviriyor; üç renkli hap o çevrimi sırayla üçe,
 * ona ve yüze katlıyor. Her kademede kazanılan şeyin yanında ödenen şey de
 * büyüyor, üstelik daha hızlı. Sayfanın kalbi bu yüzden bir TERAZİ: sol
 * kefe kazanç, sağ kefe bedel. Kırmızı hapta kiriş artık dengede değil.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (1 Mayıs), boy (156,3 cm / 172,3 cm), kan grubu (B) ve yaş
 * (13 / 16) AniList künyesinden birebir alındı (24 Ağustos 2026'da çekilen
 * `anilist-detay-22.json`, karakter 2008). Kilo kayıtta YOK — bu sayfada
 * özellikle önemli bir eksik, o yüzden uydurulmadı: "ağırlık meselesi"
 * bölümü rakam değil, iki BOY ölçüsü üzerinden konuşuyor.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada yalnızca iki replik var ve ikisi de konuşanına atfedilmiş.
 * Dövüşlerin ayrıntısı, hapların etkisi ve savaş sahnesi tırnak içine
 * alınmadan, arşivin kendi anlatımı olarak yazıldı.
 */

export const CHOJI_ID = 2008;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const CHOJI_SITE_URL = "https://anilist.co/character/2008";

/**
 * Sergi görselleri — hepsi characterId 2008 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `choji:` önekli (kurator modu şartı).
 */
export const CHOJI_IMAGE_KEYS = {
  /** Hero: geniş kadraj, sıcak ışık; figür sağda (16:9) */
  hero: "choji:hero",
  weight: "choji:weight",
  baika: "choji:baika",
  nikudan: "choji:nikudan",
  butterfly: "choji:butterfly",
  pills: "choji:pills",
  bubun: "choji:bubun",
  formation: "choji:formation",
  chips: "choji:chips",
  pillGreen: "choji:pill-green",
  pillYellow: "choji:pill-yellow",
  pillRed: "choji:pill-red",
  fateAcademy: "choji:fate-academy",
  fateHill: "choji:fate-hill",
  fateRedPill: "choji:fate-red-pill",
  fateAsuma: "choji:fate-asuma",
  fateWar: "choji:fate-war",
  closing: "choji:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const CHOJI_SLOT_LABELS: Record<string, LocalizedText> = {
  [CHOJI_IMAGE_KEYS.hero]: {
    tr: "Hero — sıcak ışıkta geniş kadraj, figür sağda (16:9)",
    en: "Hero — wide frame in warm light, figure to the right (16:9)",
  },
  [CHOJI_IMAGE_KEYS.weight]: {
    tr: "Ağırlık meselesi — akademi sırası ya da 10. Takım'ın ilk günü",
    en: "The matter of weight — the academy bench or Team 10's first day",
  },
  [CHOJI_IMAGE_KEYS.baika]: {
    tr: "Baika no Jutsu — gövdenin kat kat büyümesi",
    en: "Baika no Jutsu — the body multiplying in size",
  },
  [CHOJI_IMAGE_KEYS.nikudan]: {
    tr: "Nikudan Sensha — yuvarlanan et mermisi",
    en: "Nikudan Sensha — the rolling human bullet",
  },
  [CHOJI_IMAGE_KEYS.butterfly]: {
    tr: "Kelebek Chōji — sırtta çakra kanatları",
    en: "Butterfly Chōji — chakra wings at his back",
  },
  [CHOJI_IMAGE_KEYS.pills]: {
    tr: "Üç renkli hap — açılmış hap kutusu",
    en: "The three coloured pills — the opened pill case",
  },
  [CHOJI_IMAGE_KEYS.bubun]: {
    tr: "Bubun Baika — büyütülmüş tek yumruk",
    en: "Bubun Baika — a single enlarged fist",
  },
  [CHOJI_IMAGE_KEYS.formation]: {
    tr: "Ino-Shika-Chō — üçlü formasyon",
    en: "Ino-Shika-Chō — the three-man formation",
  },
  [CHOJI_IMAGE_KEYS.chips]: {
    tr: "Cips paketi — Chōji'nin elinden düşmeyen obje",
    en: "The crisp packet — the object never out of his hand",
  },
  [CHOJI_IMAGE_KEYS.pillGreen]: {
    tr: "Yeşil hap — ıspanak hapı",
    en: "Green pill — the spinach pill",
  },
  [CHOJI_IMAGE_KEYS.pillYellow]: {
    tr: "Sarı hap — köri hapı",
    en: "Yellow pill — the curry pill",
  },
  [CHOJI_IMAGE_KEYS.pillRed]: {
    tr: "Kırmızı hap — kırmızı biber hapı",
    en: "Red pill — the chilli pill",
  },
  [CHOJI_IMAGE_KEYS.fateAcademy]: {
    tr: "Akademi — takım kurulurken en sona kalan çocuk",
    en: "The academy — the boy left until last",
  },
  [CHOJI_IMAGE_KEYS.fateHill]: {
    tr: "Tepe — Shikamaru'nun yanına oturduğu yer",
    en: "The hill — where Shikamaru sat down beside him",
  },
  [CHOJI_IMAGE_KEYS.fateRedPill]: {
    tr: "Jirōbō dövüşü — kırmızı hap ve kelebek biçimi",
    en: "The fight with Jirōbō — the red pill and the butterfly form",
  },
  [CHOJI_IMAGE_KEYS.fateAsuma]: {
    tr: "Asuma'nın ardından — 10. Takım'ın son görevi",
    en: "After Asuma — Team 10's final mission",
  },
  [CHOJI_IMAGE_KEYS.fateWar]: {
    tr: "Savaş — kanatlar, bu kez hapsız",
    en: "The war — the wings, this time without a pill",
  },
  [CHOJI_IMAGE_KEYS.closing]: {
    tr: "Kapanış — sönen kanatlar ya da boş bir paket",
    en: "Closing — fading wings, or an empty packet",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const CHOJI_IDENTITY = {
  name: "Chōji Akimichi",
  nativeName: "秋道チョウジ",
  /** Hero filigranı — dikey sütun, dekoratif (aria-hidden) */
  watermark: "秋道",
  clan: { tr: "Akimichi Klanı", en: "Akimichi Clan" },
  epigraph: {
    tr: "Ağırlığı yüzünden güldüler. O ağırlık, köyün en pahalı yakıtıydı.",
    en: "They laughed at his weight. That weight was the most expensive fuel in the village.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "1 Mayıs", en: "1 May" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: {
        tr: "156,3 cm (I) · 172,3 cm (II)",
        en: "156.3 cm (I) · 172.3 cm (II)",
      },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "B", en: "B" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "13 (I) · 16 (II)", en: "13 (I) · 16 (II)" },
    },
    {
      label: { tr: "Rütbe", en: "Rank" },
      value: {
        tr: "Genin (I) → Chūnin (II) → Jōnin (sonrası)",
        en: "Genin (I) → Chūnin (II) → Jōnin (later)",
      },
    },
    {
      label: { tr: "Takım", en: "Team" },
      value: {
        tr: "10. Takım — Asuma, Shikamaru, Ino",
        en: "Team 10 — Asuma, Shikamaru, Ino",
      },
    },
    {
      label: { tr: "Klan hidenı", en: "Clan hiden" },
      value: {
        tr: "Kalori → çakra → kütle",
        en: "Calories → chakra → mass",
      },
    },
    {
      label: { tr: "Yanında taşıdığı", en: "What he carries" },
      value: {
        tr: "Bir paket cips, bir de üç gözlü hap kutusu",
        en: "A packet of crisps and a three-chamber pill case",
      },
    },
  ],
} as const;

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

export const CHOJI_BUTTERFLY_TEXT = {
  enter: { tr: "Kelebek Modu", en: "Butterfly mode" },
  exit: { tr: "Kanatları kapat", en: "Fold the wings" },
  hint: {
    tr: "Kanatlar açık: sayfa Chōji'nin son biçiminin ışığında duruyor.",
    en: "The wings are open: the page now stands in the light of Chōji's final form.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const CHOJI_HERO = {
  lede: {
    tr: "Akimichi hesabı basittir: gövde bir depodur, kalori çakraya çevrilir, çakra kütleye. Chōji'nin bedeni bir kusur değil bir cephanelikti — ve her atışın bir fiyatı vardı.",
    en: "The Akimichi arithmetic is simple: the body is a store, calories become chakra, chakra becomes mass. Chōji's size was never a flaw but an arsenal — and every shot had a price.",
  },
  wingCaption: {
    tr: "Kanatlar burada soluk duruyor. Kelebek Modu'nda sayfanın tamamı onların ışığına giriyor.",
    en: "The wings sit faint here. In Butterfly mode the whole page enters their light.",
  },
  portraitAlt: {
    tr: "Chōji Akimichi — arşive yüklenmiş kadro portresi",
    en: "Chōji Akimichi — cast portrait uploaded to the archive",
  },
  portraitAltFallback: {
    tr: "Chōji Akimichi — AniList künye portresi",
    en: "Chōji Akimichi — AniList profile portrait",
  },
} as const;

/**
 * Görsel alt metinleri — BRIEF §4.5: her alt iki dilli ve KAYNAĞINI söyler.
 * Sofra portrelerinin tamamı kendi veritabanımızdan geliyor (PORTRAIT
 * yuvası), bu yüzden tek bir son ek yetiyor.
 */
export const CHOJI_ALT = {
  companionSuffix: {
    tr: "— arşive yüklenmiş kadro portresi",
    en: "— cast portrait uploaded to the archive",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const CHOJI_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "Naruto Universe" },
} as const;

export const CHOJI_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "The record" },
    lede: {
      tr: "Bir çocuğun ölçüleri. İki boy arasında dört yıl ve on altı santim var; o dört yılı kimse ona kolay geçirtmedi.",
      en: "The measurements of a boy. Between the two heights lie four years and sixteen centimetres; nobody made those four years easy.",
    },
  },
  weight: {
    title: { tr: "Ağırlık meselesi", en: "The matter of weight" },
    lede: {
      tr: "Chōji'nin dosyasındaki en sık geçen kelime bir hakaret. Bu sayfa onun üstüne şaka yapmıyor; tam tersini yapıyor.",
      en: "The word that recurs most often in Chōji's file is an insult. This page does not make a joke of it; it does the opposite.",
    },
  },
  arsenal: {
    title: { tr: "Cephanelik", en: "The arsenal" },
    lede: {
      tr: "Akimichi tekniklerinin hepsi tek bir denklemin ayarı: kalori çakraya, çakra kütleye, kütle darbeye. Üç büyük ayar, giderek büyüyen bir daire gibi.",
      en: "Every Akimichi technique is one equation at a different setting: calories to chakra, chakra to mass, mass to impact. Three settings, each a wider circle than the last.",
    },
  },
  hand: {
    title: { tr: "El altındakiler", en: "Close at hand" },
    lede: {
      tr: "Büyük teknikleri ayakta tutan dört küçük şey: bir kutu, bir yumruk, bir formasyon ve bir paket.",
      en: "Four small things hold the big techniques up: a case, a fist, a formation and a packet.",
    },
  },
  table: {
    title: { tr: "Sofradakiler", en: "Around the table" },
    lede: {
      tr: "Chōji'nin ölçüsü hep başkalarıyla birlikte alınır: yemek tek başına yenmez, üçlü formasyon tek kişiyle kurulmaz. Hanafuda destesindeki en yüksek üçlü de tam olarak budur — yaban domuzu, geyik, kelebek.",
      en: "Chōji is always measured alongside others: no meal is eaten alone and no three-man formation is built by one. The highest trio in a hanafuda deck says the same thing — boar, deer, butterfly.",
    },
  },
  scale: {
    title: { tr: "Hap terazisi", en: "The scale of pills" },
    lede: {
      tr: "Üç renkli hap bir güç merdiveni değil, bir fiyat listesi. Bir hap seç: sol kefede kazandığın, sağ kefede ödediğin durur. Kırmızıya geldiğinde kiriş artık dengede değildir.",
      en: "The three coloured pills are not a ladder of power but a price list. Choose one: the left pan holds what you gain, the right what you pay. By the time you reach red, the beam is no longer level.",
    },
  },
  fate: {
    title: { tr: "Kader çizelgesi", en: "Five entries in the ledger" },
    lede: {
      tr: "Beş kayıt, hepsi aynı soruyu soruyor: bu sefer kendinden ne kadarını vereceksin?",
      en: "Five entries, all asking the same question: how much of yourself, this time?",
    },
  },
} as const;

/* ── Ağırlık meselesi ───────────────────────────────────────────────────── */

/**
 * Sayfanın ikinci yapısal fikri. Kasıtlı olarak KISA ve rakamsız: AniList
 * kaydında kilo yok, uydurulmadı. Ölçü olarak yalnızca künyedeki iki boy
 * kullanıldı; aradaki fark (16 cm) hesapla değil, iki satırın çıkarmasıyla
 * geliyor — yani sayfada uydurulmuş tek bir sayı bile yok.
 */
export const CHOJI_WEIGHT = {
  imageKey: CHOJI_IMAGE_KEYS.weight,
  paragraphs: [
    {
      tr: "Chōji'nin çocukluğu tek bir kelimeyle özetlenebilir ve o kelime bir hakarettir. Akademide takım kurulurken en sona kalan, en son seçilen çocuk oydu; kelimeyi ilk kullananlar sınıf arkadaşlarıydı. Chōji her duyduğunda dövüşmeye hazır hâle geldi ve düşmanları bunu yıllar içinde öğrenip bir düğme gibi kullandı.",
      en: "Chōji's childhood can be summed up in a single word, and that word is an insult. At the academy he was the boy left until last when teams were picked, and it was his classmates who used the word first. Every time he heard it he became ready to fight — and over the years his enemies learned this and used it like a switch.",
    },
    {
      tr: "Asuma'nın cevabı bir teselli değil bir düzeltmeydi: çocuk şişman değildi, kemikleri iriydi. Cümlenin işe yaraması, avutucu olmasından değil, ölçü olmasından geliyordu — bir öğretmen öğrencisinin künyesini doğru okumuştu.",
      en: "Asuma's answer was not consolation but correction: the boy was not fat, he was big-boned. The line worked not because it soothed but because it measured — a teacher had read his student's file correctly.",
    },
    {
      tr: "Arşivin kendi okuması şu: Akimichi doktrininde gövde kütlesi cephanedir. Chōji'nin alay konusu olan şeyi, tekniğinin yakıtının ta kendisidir. Kırmızı hap o yakıtın tamamını yakar ve geriye zayıf bir beden bırakır — bu evrende zayıflık bir ödül değil, ölümün biçimidir.",
      en: "The archive's own reading: in Akimichi doctrine, body mass is ammunition. The very thing he was mocked for is the fuel his technique runs on. The red pill burns all of it and leaves a thin body behind — in this world thinness is not a prize, it is the shape of death.",
    },
  ],
  quote: {
    text: { tr: "Şişman değil. Kemikleri iri.", en: "He's not fat. He's big-boned." },
    by: { tr: "Asuma Sarutobi", en: "Asuma Sarutobi" },
  },
  measureLabel: { tr: "Künyedeki tek ölçü", en: "The only measurement on file" },
  marks: [
    {
      key: "one" as const,
      label: { tr: "Bölüm I · 13 yaş", en: "Part I · age 13" },
      value: { tr: "156,3 cm", en: "156.3 cm" },
    },
    {
      key: "two" as const,
      label: { tr: "Bölüm II · 16 yaş", en: "Part II · age 16" },
      value: { tr: "172,3 cm", en: "172.3 cm" },
    },
  ],
  delta: {
    label: { tr: "Aradaki fark", en: "The difference" },
    value: { tr: "16 cm", en: "16 cm" },
    note: {
      tr: "Kilo bilgisi künyede yok. Sayfada da yok: uydurulmuş bir rakam, tam da bu bölümün karşı çıktığı şey olurdu.",
      en: "No weight is recorded on file, so none appears here: an invented figure would be exactly what this section argues against.",
    },
  },
} as const;

/* ── Cephanelik — üç büyük ──────────────────────────────────────────────── */

export const CHOJI_TECHNIQUES = [
  {
    key: "baika" as const,
    imageKey: CHOJI_IMAGE_KEYS.baika,
    kanji: "倍化",
    name: "Baika no Jutsu",
    turkish: { tr: "Kat Büyüme Tekniği", en: "Multi-Size Technique" },
    tagline: {
      tr: "Klanın hidenı: yenen her şey çakraya, çakra da hacme çevrilir.",
      en: "The clan hiden: everything eaten becomes chakra, and chakra becomes volume.",
    },
    text: {
      tr: "Akimichi'nin gizli tekniği aslında bir dönüştürücü. Bedende biriken kaloriyi çakraya, çakrayı da hacme çeviriyor; Chōji tek bir uzvunu ya da gövdesinin tamamını kat kat büyütebiliyor. Büyüyen şey boy değil, çarpma anındaki kütle. Bedeli açık: depo boşalıyor. Bu yüzden Akimichi şinobisi savaşa aç girmez ve dövüşün ortasında yemek yemek onun için kaçamak değil, şarjör değiştirmektir.",
      en: "The Akimichi hiden is really a converter: it turns stored calories into chakra and chakra into volume. Chōji can enlarge a single limb or his entire body, and what grows is not height but the mass behind the impact. The cost is plain — the store empties. This is why an Akimichi never walks into a fight hungry, and why eating mid-battle is not indulgence but reloading.",
    },
    traits: [
      { tr: "Kalori → çakra", en: "Calories → chakra" },
      { tr: "Hacim değil, kütle", en: "Mass, not volume" },
      { tr: "Depo boşalır", en: "The store empties" },
    ],
  },
  {
    key: "nikudan" as const,
    imageKey: CHOJI_IMAGE_KEYS.nikudan,
    kanji: "肉弾戦車",
    name: "Nikudan Sensha",
    turkish: { tr: "Et Mermisi Tankı", en: "Human Bullet Tank" },
    tagline: {
      tr: "Büyüyen gövde bir küreye kapanır ve dönmeye başlar.",
      en: "The enlarged body closes into a sphere and begins to spin.",
    },
    text: {
      tr: "Chōji kollarını ve bacaklarını gövdesine çekip Baika ile şişiyor ve kendini yuvarlanan bir tanka çeviriyor. Yön değiştirmesi zor, durması daha zor; tekniğin bütün ikna gücü buradan geliyor — ne olacağını görürsün ve yine de kaçamazsın. Chō Baika ile birleşip saçlar diken hâline getirildiğinde teknik Nikudan Hari Sensha oluyor: aynı kütle, artık kesici.",
      en: "Chōji pulls his arms and legs into his torso, swells with Baika and turns himself into a rolling tank. It is hard to steer and harder to stop, and that is the whole of its persuasion: you can see it coming and still cannot get out of the way. Combined with Chō Baika, with the hair drawn out into spikes, it becomes Nikudan Hari Sensha — the same mass, now edged.",
    },
    traits: [
      { tr: "Yuvarlanan kütle", en: "Rolling mass" },
      { tr: "Yön değiştirmez", en: "It does not steer" },
      { tr: "Dikenli çeşidi var", en: "It has a spiked variant" },
    ],
  },
  {
    key: "butterfly" as const,
    imageKey: CHOJI_IMAGE_KEYS.butterfly,
    kanji: "蝶",
    name: "Chō Chōji Mōdo",
    turkish: { tr: "Kelebek Chōji Modu", en: "Butterfly Chōji Mode" },
    tagline: {
      tr: "Bedendeki bütün yağın çakraya döndüğü son biçim: sırtta iki kanat.",
      en: "The final form, where all the body's fat turns to chakra: two wings at his back.",
    },
    text: {
      tr: "Kırmızı hap alındığında beden depolanmış yağın tamamını çakraya çeviriyor; açığa çıkan çakra sırtta iki kanat, saçlarda uzayan bir hâle olarak görünüyor. Bu biçimde vuruş tek seferlik: Chōdan arkasında ne düşmanda ne de kendisinde bir şey bırakıyor, teknik biterken beden de bitiyor. Chōji bunu on üç yaşında bir kez yaptı ve öldü sayıldı. Yıllar sonra, savaşın ortasında, aynı kanatları hiçbir hap almadan açtı.",
      en: "With the red pill the body converts every gram of stored fat into chakra, and the released chakra shows as two wings at the back and a lengthening halo of hair. In this form the strike is single-use: Chōdan leaves nothing behind, in the enemy or in himself — when the technique ends, so does the body. Chōji did it once, at thirteen, and was counted dead. Years later, in the middle of a war, he opened the same wings without any pill at all.",
    },
    traits: [
      { tr: "Yağ → çakra", en: "Fat → chakra" },
      { tr: "Tek vuruş", en: "One strike" },
      { tr: "Bedeli: kalp", en: "The price: the heart" },
    ],
  },
] as const;

/* ── El altındakiler — dört küçük ───────────────────────────────────────── */

export const CHOJI_HAND = [
  {
    key: "pills" as const,
    glyph: "case" as const,
    imageKey: CHOJI_IMAGE_KEYS.pills,
    kanji: "三色の丸薬",
    name: { tr: "Üç Renkli Hap", en: "The Three Coloured Pills" },
    note: {
      tr: "Klanın hiden ilacı: yeşil, sarı, kırmızı. Her renk çakrayı bir kademe daha katlıyor ve bedeni bir kademe daha yırtıyor. Sayfanın kalbi olan terazi tam olarak bu üç hapı tartıyor.",
      en: "The clan's hiden medicine: green, yellow, red. Each colour multiplies the chakra one step further and tears the body one step deeper. The balance at the heart of this page weighs exactly these three.",
    },
  },
  {
    key: "bubun" as const,
    glyph: "fist" as const,
    imageKey: CHOJI_IMAGE_KEYS.bubun,
    kanji: "部分倍化の術",
    name: { tr: "Bubun Baika no Jutsu", en: "Bubun Baika no Jutsu" },
    note: {
      tr: "Bütün gövdeyi değil tek bir uzvu büyütüyor — çoğu zaman bir yumruk ya da bir avuç. Ucuz, hızlı, sessiz: Chōji'nin en çok kullandığı ayar aslında en gösterişsiz olanı.",
      en: "It enlarges one limb rather than the whole body — usually a fist or an open hand. Cheap, fast and quiet: the setting he uses most is the one that shows least.",
    },
  },
  {
    key: "formation" as const,
    glyph: "cards" as const,
    imageKey: CHOJI_IMAGE_KEYS.formation,
    kanji: "猪鹿蝶",
    name: { tr: "Ino-Shika-Chō", en: "Ino-Shika-Chō" },
    note: {
      tr: "Hanafuda destesinin en yüksek üçlüsü: yaban domuzu, geyik, kelebek. Formasyonu babaları kurdu, çocukları devraldı. Kelebek olan Chōji: adı da, son biçimi de aynı kelimeye çıkıyor.",
      en: "The highest trio in a hanafuda deck: boar, deer, butterfly. Their fathers built the formation and the children inherited it. Chōji is the butterfly — his name and his final form run back to the same word.",
    },
  },
  {
    key: "chips" as const,
    glyph: "packet" as const,
    imageKey: CHOJI_IMAGE_KEYS.chips,
    kanji: "食",
    name: { tr: "Bir paket cips", en: "A packet of crisps" },
    note: {
      tr: "Chōji'nin elinden düşmeyen obje ve göğsündeki tek kelime. Bu evrende bir paket cips atıştırmalık değil şarjördür; Akimichi doktrininde yemek yemek silah doldurmaktır. Onunla dalga geçenlerin hiçbiri bu hesabı yapmadı.",
      en: "The object never out of his hand, and the single word across his chest. In this world a packet of crisps is not a snack but a magazine: in Akimichi doctrine, eating is loading. None of the people who mocked him ever did that arithmetic.",
    },
  },
] as const;

/* ── Sofradakiler ───────────────────────────────────────────────────────── */

/**
 * `characterId` alanları `EXPERIENCE_COMPANIONS[2008]` listesiyle birebir
 * aynı: 2007 Shikamaru, 2009 Ino, 4775 Asuma, 17 Naruto. Portre kaydı
 * olmayan kişi adıyla çizilir, bölüm çökmez.
 *
 * `mark` yalnızca hanafuda üçlüsünde var (猪 Ino, 鹿 Shika); Chōji'nin kendi
 * kartı 蝶, o da sayfanın kendisi olduğu için burada yok.
 */
export const CHOJI_TABLE = [
  {
    characterId: 2007,
    name: "Shikamaru Nara",
    mark: "鹿",
    role: { tr: "İlk arkadaş", en: "The first friend" },
    note: {
      tr: "Akademide kimse Chōji'yi takımına almazken tepedeki çocuk yanına oturdu. Chōji'nin hayatındaki ilk eşitlik oradan geldi ve bir ömür sürdü.",
      en: "When nobody at the academy would take Chōji on their team, the boy on the hill sat down beside him. The first equality of Chōji's life came from there, and it lasted one.",
    },
  },
  {
    characterId: 2009,
    name: "Ino Yamanaka",
    mark: "猪",
    role: { tr: "Üçlünün domuzu", en: "The boar of the trio" },
    note: {
      tr: "Hanafuda destesindeki 猪. Chōji'yi en çok azarlayan ve en çok savunan kişi aynı kişidir; savaşta onu yerinden kaldıran ses de onun sesiydi.",
      en: "The 猪 of the deck. The person who scolds Chōji most is also the one who defends him most, and in the war hers was the voice that got him moving.",
    },
  },
  {
    characterId: 4775,
    name: "Asuma Sarutobi",
    mark: null,
    role: { tr: "Öğretmen", en: "The teacher" },
    note: {
      tr: "10. Takım'ı kuran adam. Chōji'ye “şişman değilsin” demedi; “kemiklerin iri” dedi — aradaki fark bir tesellinin ölçüye dönüşmesiydi ve çocuk bunu anladı.",
      en: "The man who built Team 10. He did not tell Chōji he wasn't fat; he told him he was big-boned — the difference between consolation and measurement, and the boy understood it.",
    },
  },
  {
    characterId: 17,
    name: "Naruto Uzumaki",
    mark: null,
    role: { tr: "Yanında koşan", en: "The one who ran beside him" },
    note: {
      tr: "Sasuke'yi geri getirme görevinde aynı beşliydiler. Takımın önü açılsın diye ilk geride kalan Chōji oldu; o gece kimse ona gülmedi.",
      en: "They were part of the same five on the mission to bring Sasuke back. Chōji was the first to stay behind so the rest could go on; nobody laughed at him that night.",
    },
  },
] as const;

/* ── Hap terazisi — sayfanın kalbi ──────────────────────────────────────── */

export const CHOJI_SCALE_UI = {
  listLabel: { tr: "Üç renkli hap", en: "The three coloured pills" },
  doseWord: { tr: "kademe", en: "step" },
  gainLabel: { tr: "Sol kefe · kazanılan", en: "Left pan · what you gain" },
  costLabel: { tr: "Sağ kefe · ödenen", en: "Right pan · what you pay" },
  chakraLabel: { tr: "Çakra", en: "Chakra" },
  dangerLabel: { tr: "Uyarı", en: "Warning" },
  keyboardHint: {
    tr: "Ok tuşlarıyla haplar arasında gezebilirsin.",
    en: "The arrow keys move between the pills.",
  },
  balanceAlt: {
    tr: "Terazi şeması: hap ilerledikçe sol kefedeki çakra büyüyor, sağ kefeye bir bedel taşı daha ekleniyor ve kiriş sağa yatıyor. Kırmızı hapta terazinin arkasında kelebek kanatları açılıyor.",
    en: "Balance diagram: as the pill advances the chakra in the left pan grows, another weight of cost is added to the right pan, and the beam tips to the right. At the red pill, butterfly wings open behind the balance.",
  },
  wingNote: {
    tr: "Kanatlar yalnızca burada açılıyor.",
    en: "The wings open only here.",
  },
  coda: {
    tr: "Ve yıllar sonra, savaşın ortasında, aynı kanatları hiçbir hap almadan açtı — o gün sağ kefe boştu.",
    en: "And years later, in the middle of a war, he opened these same wings without any pill at all — that day the right pan was empty.",
  },
} as const;

/**
 * Üç hap. `imageKey` küratör yuvası, `mark` haptaki renk kanjisi
 * (緑 / 黄 / 赤 — 三色, "üç renk" ifadesinin kendisi).
 *
 * ⚠️ Çarpanlar (×3, ×10, ×100) serinin kendi verisidir, arşivin tahmini
 * değil. Bedel satırları da öyle: yorgunluk, kas dokusunun yırtılması ve
 * kalbin durması sırasıyla üç hapın bilinen sonuçları.
 */
export const CHOJI_PILLS = [
  {
    key: "green" as const,
    imageKey: CHOJI_IMAGE_KEYS.pillGreen,
    mark: "緑",
    name: "Hōrensō no Gan'yaku",
    title: { tr: "Yeşil hap · ıspanak", en: "Green pill · spinach" },
    multiplier: "×3",
    gain: {
      tr: "Çakra üç katına çıkıyor. Tükenmiş bir Akimichi dövüşe yeni girmiş gibi oluyor; Baika bir kez daha kurulabiliyor.",
      en: "Chakra triples. A spent Akimichi is returned to the state of someone just entering the fight, and Baika can be raised once more.",
    },
    cost: {
      tr: "Ağır yorgunluk. Hapın etkisi geçtiğinde ayakta kalmak bile emek istiyor.",
      en: "Heavy fatigue. When it wears off, even staying on your feet takes effort.",
    },
  },
  {
    key: "yellow" as const,
    imageKey: CHOJI_IMAGE_KEYS.pillYellow,
    mark: "黄",
    name: "Karē no Gan'yaku",
    title: { tr: "Sarı hap · köri", en: "Yellow pill · curry" },
    multiplier: "×10",
    gain: {
      tr: "Çakra on katına çıkıyor. Bu kademede Baika artık gövdeyi değil sahayı ölçekliyor; tek bir vuruş bir bölüğün işini görüyor.",
      en: "Chakra multiplies tenfold. At this step Baika no longer scales the body but the field: a single blow does the work of a squad.",
    },
    cost: {
      tr: "Kas dokusu yırtılıyor. Kazanılan güç dışarıdan değil, bedenin kendisinden kesiliyor.",
      en: "Muscle tissue tears. The strength gained is not borrowed from outside; it is cut out of the body itself.",
    },
  },
  {
    key: "red" as const,
    imageKey: CHOJI_IMAGE_KEYS.pillRed,
    mark: "赤",
    name: "Tōgarashi no Gan'yaku",
    title: { tr: "Kırmızı hap · kırmızı biber", en: "Red pill · chilli" },
    multiplier: "×100",
    gain: {
      tr: "Çakra yüz katına çıkıyor, bedendeki bütün yağ çakraya dönüyor ve sırtta iki kanat açılıyor. Kelebek Chōji budur.",
      en: "Chakra multiplies a hundredfold, every gram of fat in the body turns to chakra, and two wings open at his back. This is Butterfly Chōji.",
    },
    cost: {
      tr: "Kalp duruyor. Bu hap bir teknik değil, bir vasiyet: alan kişi dövüşü kazanmayı değil, bitirmeyi seçiyor.",
      en: "The heart stops. This pill is not a technique but a will: whoever takes it chooses not to win the fight but to end it.",
    },
    danger: { tr: "Bu hap öldürür.", en: "This pill kills." },
  },
] as const;

/* ── Kader çizelgesi ────────────────────────────────────────────────────── */

/**
 * Çizelge satırı. `quote` opsiyonel — beş kaydın yalnızca birinde replik
 * var (`as const` bir birleşim tipi üretip opsiyonel alanı gizlediği için
 * satır tipi burada açıkça yazıldı).
 */
export interface ChojiFateEntry {
  key: string;
  imageKey: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: LocalizedText };
}

export const CHOJI_TIMELINE: ChojiFateEntry[] = [
  {
    key: "academy",
    imageKey: CHOJI_IMAGE_KEYS.fateAcademy,
    age: { tr: "Akademi", en: "The academy" },
    title: {
      tr: "En sona kalan çocuk",
      en: "The boy left until last",
    },
    text: {
      tr: "İri, yavaş ve iyi huyluydu; akademide bu üçlü en kötü kombinasyondu. Takım kurulurken hep en sona kaldı, alay konusu oldu ve alayın kelimesi hep aynıydı. Bu bölümün geri kalanı o kelimenin nasıl bir silaha dönüştüğünün kaydı.",
      en: "He was big, slow and good-natured, and at the academy that was the worst possible combination. He was always left until last when teams were picked, and the word used against him never changed. The rest of this ledger records how that word turned into a weapon.",
    },
  },
  {
    key: "hill",
    imageKey: CHOJI_IMAGE_KEYS.fateHill,
    age: { tr: "12 yaş", en: "Age 12" },
    title: { tr: "Tepedeki çocuk", en: "The boy on the hill" },
    text: {
      tr: "Shikamaru Nara onunla dalga geçmedi, ona acımadı da; sadece yanına oturup bulutlara baktı. Ino-Shika-Chō formasyonunun asıl temeli bir teknik değil, o tepedir. Chōji'nin sonraki bütün cesareti bu arkadaşlığın üstüne kuruldu.",
      en: "Shikamaru Nara neither mocked him nor pitied him; he simply sat down beside him and watched the clouds. The real foundation of the Ino-Shika-Chō formation is not a technique but that hill. Every piece of courage Chōji found later was built on that friendship.",
    },
  },
  {
    key: "redpill",
    imageKey: CHOJI_IMAGE_KEYS.fateRedPill,
    age: { tr: "13 yaş", en: "Age 13" },
    title: {
      tr: "Sasuke görevi ve kırmızı hap",
      en: "The retrieval mission and the red pill",
    },
    text: {
      tr: "Sasuke'yi geri getirme görevinde takımın önü açılsın diye geride kalıp Jirōbō ile dövüştü. Rakibi ona o kelimeyi söyledi. Chōji önce yeşili aldı, sonra sarıyı; ikisi de yetmedi. Babasının “asla” dediği kırmızıyı da aldı, kelebek biçimini açtı ve dövüşü tek vuruşta bitirdi. Ardından öldü sayıldı; hayatta kalması, Chōza'nın getirdiği klan panzehiri ve Tsunade'nin elleri sayesinde oldu.",
      en: "On the mission to bring Sasuke back he stayed behind to fight Jirōbō so the rest of the team could go on. His opponent used the word on him. Chōji took the green pill, then the yellow; neither was enough. He took the red one his father had told him never to touch, opened the butterfly form and ended the fight in a single strike. Afterwards he was counted dead; he survived only because of the clan antidote Chōza brought and Tsunade's hands.",
    },
    quote: {
      text: { tr: "Bana şişman deme.", en: "Don't call me fat." },
      by: { tr: "Chōji Akimichi", en: "Chōji Akimichi" },
    },
  },
  {
    key: "asuma",
    imageKey: CHOJI_IMAGE_KEYS.fateAsuma,
    age: { tr: "16 yaş", en: "Age 16" },
    title: {
      tr: "Asuma'nın ardından",
      en: "After Asuma",
    },
    text: {
      tr: "Öğretmenleri Akatsuki'nin ölümsüz ikilisi tarafından öldürüldü. Shikamaru hesabı Hidan'la kendi gördü; Chōji ile Ino, Kakashi'nin yanında Kakuzu'yu üzerlerine aldı. On üç yaşında hapla satın aldığı gücü, on altı yaşında bir plandaki yerini bilerek kullandı — aradaki fark öfke ile sıranın farkıdır.",
      en: "Their teacher was killed by Akatsuki's immortal pair. Shikamaru settled his own account with Hidan; Chōji and Ino took Kakuzu, alongside Kakashi. The strength he had bought with a pill at thirteen he now used at sixteen from a known position in a plan — the difference between rage and taking your turn.",
    },
  },
  {
    key: "war",
    imageKey: CHOJI_IMAGE_KEYS.fateWar,
    age: { tr: "Savaş", en: "The war" },
    title: {
      tr: "Kanatlar, bu kez hapsız",
      en: "The wings, this time without a pill",
    },
    text: {
      tr: "Dördüncü Büyük Şinobi Savaşı'nda, On Kuyruklu'nun karşısında Chōji uzun süre kımıldayamadı. Kımıldadığında kanatları açan şey bir hap değildi: aynı biçim, aynı ışık, aynı kütle — ama bu sefer sağ kefede ödenecek bir şey yoktu. Babası Chōza aynı cephedeydi; klanın hesabında yakıt hep gövdedeydi, o gün iradenin de sayıldığı görüldü.",
      en: "In the Fourth Great Shinobi War, facing the Ten-Tails, Chōji could not move for a long time. When he did, what opened the wings was not a pill: the same form, the same light, the same mass — but this time there was nothing to pay into the right pan. His father Chōza was on the same front; the clan arithmetic had always counted fuel as body, and that day it turned out will could be counted too.",
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const CHOJI_CLOSING = {
  quotes: [
    {
      text: { tr: "Bana şişman deme.", en: "Don't call me fat." },
      by: { tr: "Chōji Akimichi", en: "Chōji Akimichi" },
      note: {
        tr: "Bir hakaret değil, bir düğme. Onu ilk kez dövüştüren cümle buydu ve sonuncusu olmadı.",
        en: "Not an insult but a switch. It was the line that first made him fight, and it was not the last time.",
      },
    },
    {
      text: { tr: "Şişman değil. Kemikleri iri.", en: "He's not fat. He's big-boned." },
      by: { tr: "Asuma Sarutobi", en: "Asuma Sarutobi" },
      note: {
        tr: "Bir öğretmenin düzeltmesi. Klan tekniği tam da o kemiklerin taşıdığı kütlenin üstüne kurulu.",
        en: "A teacher's correction. The clan technique is built on precisely the mass those bones carry.",
      },
    },
  ],
  motto: "蝶",
  mottoNote: {
    tr: "chō — kelebek: Ino-Shika-Chō'nun üçüncü kartı ve Chōji'nin son biçimi",
    en: "chō — butterfly: the third card of Ino-Shika-Chō and Chōji's final form",
  },
  credit: {
    tr: "Künye verileri (doğum, boy, kan grubu, yaş) ve yedek portre AniList'ten alınmıştır. Sayfadaki tam boy portre arşivin kendi yüklemesidir; Akimichi spirali, kelebek kanatları, terazi şeması, ölçü cetveli ve dört küçük işaret bu sayfa için elle çizilmiş SVG'lerdir.",
    en: "Profile data (birthday, height, blood type, age) and the fallback portrait come from AniList. The full-size portrait is the archive's own upload; the Akimichi spiral, the butterfly wings, the balance diagram, the measuring rule and the four small marks are SVGs drawn by hand for this page.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList profile" },
} as const;
