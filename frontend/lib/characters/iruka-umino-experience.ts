import type { LocalizedText } from "./types";

/**
 * Iruka Umino — "Sınıf Defteri" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 2011 kaydının ABILITY yuvaları,
 * `iruka:*` anahtarlarıyla. Görsel bağlı değilse bölüm görselsiz ama
 * AYAKTA çizilir; hiçbir bölüm yükleme bekleyerek çökmez.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * Bu bir dövüş sayfası değil. Iruka'nın gücü jutsu değil, TANIMA: bir
 * çocuğa adıyla seslenmek. Sayfanın omurgası bu yüzden bir savaş şeması
 * değil, bir DEFTERİN ÇİZGİLERİ — ve soldaki kırmızı kenar çizgisiyle
 * burnunun üstündeki yara aynı renkte, çünkü aynı çizgi.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (26 Mayıs), boy (5′8″), kan grubu (A) ve yaş (23 / 26)
 * AniList künyesinden birebir alındı (24 Ağustos 2026'da önbellekten
 * çekilen `anilist-detay-22.json`, karakter 2011). Boyun santimetre
 * karşılığı çevrilerek yazıldı, kaynakta inç var. Kilo AniList kaydında
 * YOK, bu yüzden künye şeridinde de yok. Adın "umi no iruka" okunuşu ve
 * Kyūbi gecesinde anne-babasının ölümü aynı künyenin açıklama metninde
 * geçiyor — uydurma değil.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada yalnızca iki replik tırnak içinde ve ikisi de konuşanına
 * atfedilmiş. Ichiraku bölümündeki iki satır BİLEREK tırnaksız: o sahnede
 * söylenenin tam metninden emin değiliz, bu yüzden arşivin kendi anlatımı
 * olarak, düz cümlelerle yazıldı. Emin olunmayan hiçbir cümle replik
 * kılığına sokulmadı.
 */

export const IRUKA_ID = 2011;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const IRUKA_SITE_URL = "https://anilist.co/character/2011";

/**
 * Sergi görselleri — hepsi characterId 2011 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `iruka:` önekli (kurator modu şartı).
 *
 * Kara tahtanın kendisinde yuva YOK: oradaki her çizgi bu sayfa için elle
 * çizilmiş SVG (bkz. ChalkGlyphs.tsx). Tahtanın arkasına raster bir görsel
 * konsaydı tebeşir çizimi bir dokunun üstünde yüzerdi.
 */
export const IRUKA_IMAGE_KEYS = {
  /** Hero: akşam ışığı almış boş derslik, sıralar ve tahta (16:9) */
  hero: "iruka:hero",
  academy: "iruka:academy",
  kageBunshin: "iruka:kage-bunshin",
  shuriken: "iruka:shuriken",
  register: "iruka:register",
  headband: "iruka:headband",
  ichiraku: "iruka:ichiraku",
  chunin: "iruka:chunin",
  classroom: "iruka:classroom",
  counter: "iruka:counter",
  fateKyuubi: "iruka:fate-kyuubi",
  fatePrank: "iruka:fate-prank",
  fateTeacher: "iruka:fate-teacher",
  fateMizuki: "iruka:fate-mizuki",
  fateHall: "iruka:fate-hall",
  closing: "iruka:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const IRUKA_SLOT_LABELS: Record<string, LocalizedText> = {
  [IRUKA_IMAGE_KEYS.hero]: {
    tr: "Hero — akşam ışığındaki boş derslik (16:9)",
    en: "Hero — the empty classroom in evening light (16:9)",
  },
  [IRUKA_IMAGE_KEYS.academy]: {
    tr: "Akademi — kürsünün arkasındaki öğretmen",
    en: "The Academy — the instructor behind the lectern",
  },
  [IRUKA_IMAGE_KEYS.kageBunshin]: {
    tr: "Kage Bunshin — ormandaki klon kalabalığı",
    en: "Kage Bunshin — the crowd of clones in the forest",
  },
  [IRUKA_IMAGE_KEYS.shuriken]: {
    tr: "Shurikenjutsu — hedef tahtası ve atış alanı",
    en: "Shurikenjutsu — the target board and the throwing yard",
  },
  [IRUKA_IMAGE_KEYS.register]: {
    tr: "Sınıf defteri — açık sayfa, isim listesi",
    en: "The class register — an open page of names",
  },
  [IRUKA_IMAGE_KEYS.headband]: {
    tr: "Alın koruyucu — Konoha işareti, yakın çekim",
    en: "The forehead protector — Konoha's mark, close up",
  },
  [IRUKA_IMAGE_KEYS.ichiraku]: {
    tr: "Ichiraku Ramen — dükkânın perdesi ve tezgâhı",
    en: "Ichiraku Ramen — the curtain and the counter",
  },
  [IRUKA_IMAGE_KEYS.chunin]: {
    tr: "Chūnin yeleği — rütbenin kendisi",
    en: "The chūnin vest — the rank itself",
  },
  [IRUKA_IMAGE_KEYS.classroom]: {
    tr: "Derslik — tahtanın önünden sıralara bakış",
    en: "The classroom — from the board towards the desks",
  },
  [IRUKA_IMAGE_KEYS.counter]: {
    tr: "Tezgâh — yan yana iki tabure, akşam",
    en: "The counter — two stools side by side, evening",
  },
  [IRUKA_IMAGE_KEYS.fateKyuubi]: {
    tr: "Kyūbi gecesi — yanan köy",
    en: "The night of the Nine-Tails — the burning village",
  },
  [IRUKA_IMAGE_KEYS.fatePrank]: {
    tr: "Akademi yılları — cezalı çocuk",
    en: "Academy years — the boy in detention",
  },
  [IRUKA_IMAGE_KEYS.fateTeacher]: {
    tr: "Masanın öteki tarafı — kürsüdeki Iruka",
    en: "The other side of the desk — Iruka at the lectern",
  },
  [IRUKA_IMAGE_KEYS.fateMizuki]: {
    tr: "Mizuki gecesi — ormandaki yaralı öğretmen",
    en: "The Mizuki night — the wounded teacher in the forest",
  },
  [IRUKA_IMAGE_KEYS.fateHall]: {
    tr: "Salondaki adam — Hokage töreninde kalabalık",
    en: "The man in the hall — the crowd at the Hokage ceremony",
  },
  [IRUKA_IMAGE_KEYS.closing]: {
    tr: "Kapanış — silinmiş tahta ve tebeşir tozu",
    en: "Closing — a wiped board and chalk dust",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const IRUKA_IDENTITY = {
  name: "Iruka Umino",
  nativeName: "うみのイルカ",
  /** Hero filigranı — dekoratif (aria-hidden) */
  watermark: "先生",
  /** Adın altındaki kayıt satırı — künye eyebrow'u DEĞİL, başlıktan sonra gelir */
  post: {
    tr: "Konoha Ninja Akademisi · öğretmen · chūnin",
    en: "Konoha Ninja Academy · instructor · chūnin",
  },
  epigraph: {
    tr: "Gücü hiçbir zaman bir jutsu olmadı. Tanımaktı.",
    en: "His power was never a jutsu. It was recognition.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "26 Mayıs", en: "26 May" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "5′8″ (≈173 cm)", en: "5′8″ (≈173 cm)" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "A", en: "A" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "23 (I) · 26 (II)", en: "23 (I) · 26 (II)" },
    },
    {
      label: { tr: "Rütbe", en: "Rank" },
      value: { tr: "Chūnin", en: "Chūnin" },
    },
    {
      label: { tr: "Görev", en: "Posting" },
      value: {
        tr: "Ninja Akademisi — sınıf öğretmeni",
        en: "The Ninja Academy — classroom instructor",
      },
    },
    {
      label: { tr: "Adın okunuşu", en: "The name, read aloud" },
      value: {
        tr: "umi no iruka — denizin yunusu",
        en: "umi no iruka — dolphin of the sea",
      },
    },
    {
      label: { tr: "Verdiği", en: "What he gave away" },
      value: {
        tr: "Kendi alın koruyucusu",
        en: "His own forehead protector",
      },
    },
  ],
} as const;

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

export const IRUKA_DISMISS_TEXT = {
  enter: { tr: "Ders bitti", en: "Class dismissed" },
  exit: { tr: "Sınıfa dön", en: "Back to class" },
  hint: {
    tr: "Tahta silindi, sıralar boşaldı, pencereden akşam indi.",
    en: "The board is wiped, the desks are empty, evening is in the window.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const IRUKA_HERO = {
  lede: {
    tr: "Bu sayfada tek bir dövüş var ve Iruka onu kaybediyor. Yine de arşivin en önemli adamlarından biri: Naruto Uzumaki'ye içindeki şeyin adıyla değil, kendi adıyla seslenen ilk kişi.",
    en: "There is exactly one fight on this page, and Iruka loses it. He is still one of the most important people in this archive: the first to call Naruto Uzumaki by his own name instead of the name of the thing inside him.",
  },
  scarCaption: {
    tr: "Burnun üstündeki yara çocukluktan kalma. Sayfanın sol kenarındaki kırmızı çizgi de aynı çizgi.",
    en: "The scar across his nose has been there since childhood. The red rule down the left of this page is the same line.",
  },
  portraitAlt: {
    tr: "Iruka Umino — arşive yüklenmiş kadro portresi",
    en: "Iruka Umino — cast portrait uploaded to the archive",
  },
  portraitAltFallback: {
    tr: "Iruka Umino — AniList künye portresi",
    en: "Iruka Umino — AniList profile portrait",
  },
} as const;

/**
 * Görsel alt metinleri — BRIEF §3.5: her alt iki dilli ve KAYNAĞINI söyler.
 * Sıralardaki portrelerin tamamı kendi veritabanımızdan geliyor (PORTRAIT
 * yuvası), bu yüzden tek bir son ek yetiyor.
 */
export const IRUKA_ALT = {
  deskSuffix: {
    tr: "— arşive yüklenmiş kadro portresi",
    en: "— cast portrait uploaded to the archive",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const IRUKA_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "Naruto Universe" },
} as const;

export const IRUKA_SECTIONS = {
  identity: {
    title: { tr: "Defterin ilk sayfası", en: "First page of the register" },
    lede: {
      tr: "AniList künyesindeki satırlar, arşivin kendi eklediği iki satırla birlikte. Kilo kayıtta yok, o yüzden burada da yok.",
      en: "The rows from the AniList record, plus two the archive added itself. Weight is not in the record, so it is not here either.",
    },
  },
  desks: {
    title: { tr: "Sıralar", en: "The desks" },
    lede: {
      tr: "Bu odadan geçen dört isim. Biri sıranın en arkasında oturdu ve bütün gürültüyü o çıkardı.",
      en: "Four names that passed through this room. One of them sat at the very back and made all the noise.",
    },
  },
  craft: {
    title: { tr: "Ders programı", en: "The syllabus" },
    lede: {
      tr: "Iruka'nın dosyasında ünlü bir jutsu yok. Aşağıdaki üç başlık gerçekten iyi olduğu üç şey — ve ilki teknik bile sayılmıyor.",
      en: "There is no famous jutsu in Iruka's file. The three entries below are the three things he was genuinely good at — and the first is not even counted as a technique.",
    },
  },
  drawer: {
    title: { tr: "Öğretmen masasının çekmecesi", en: "The teacher's desk drawer" },
    lede: {
      tr: "Dört nesne. Üçü sınıfa ait; dördüncüsü artık bir çocuğun alnında.",
      en: "Four objects. Three belong to the room; the fourth is on a boy's forehead now.",
    },
  },
  board: {
    title: { tr: "Kara tahta", en: "The blackboard" },
    lede: {
      tr: "Beş ders. Dördü tahtaya yazıldı, beşincisi boş bırakıldı. Bir ders seç: tebeşir çizimi tamamlanır ve altında o dersin sınıf dışındaki karşılığı açılır.",
      en: "Five lessons. Four were written on the board and the fifth was left blank. Choose one: the chalk drawing completes itself, and beneath it the lesson's meaning outside the classroom opens up.",
    },
  },
  ichiraku: {
    title: { tr: "Ichiraku masası", en: "The counter at Ichiraku" },
    lede: {
      tr: "Bir öğretmenin bir öğrenciyi ilk kez dışarı çıkardığı akşam. Anıttaki boya temizlendikten, ceza bittikten sonra tezgâha iki kâse kondu.",
      en: "The evening a teacher first took a student out. After the paint was scrubbed off the monument and the punishment was over, two bowls went down on the counter.",
    },
  },
  fate: {
    title: { tr: "Beş satırlık yoklama", en: "Roll call, five lines" },
    lede: {
      tr: "Beş kayıt. İkisi çocukluk, biri bir sınıfa geri dönüş, biri bir gece, sonuncusu bir kalabalık.",
      en: "Five entries. Two of childhood, one a return to a classroom, one a single night, and a crowd at the end.",
    },
  },
} as const;

/* ── Sıralar (yoldaş portreleri) ────────────────────────────────────────── */

/**
 * `characterId` alanları `EXPERIENCE_COMPANIONS[2011]` listesiyle birebir
 * aynı: 17 Naruto, 7571 Hiruzen, 3889 Konohamaru, 85 Kakashi. Portre kaydı
 * olmayan sıra adıyla çizilir, bölüm çökmez.
 *
 * `seat: "back"` olan sıra tahtadan en uzak sıradır (bileşende `data-seat`):
 * kadraj daha küçük, sayı daha büyük — odanın arkası.
 */
export const IRUKA_DESKS = [
  {
    characterId: 17,
    name: "Naruto Uzumaki",
    seat: "back" as const,
    row: { tr: "En arka sıra", en: "Back row" },
    note: {
      tr: "Sınıfın en arkasında oturan, en yüksek sesle bağıran çocuk. Iruka onun gürültüsünü değil gürültünün sebebini gördü: kimse bakmıyorsa insan bakılacak bir şey yapar.",
      en: "The boy at the back of the room who shouted the loudest. Iruka did not see the noise, he saw the reason for it: when nobody is looking, a person will do something that has to be looked at.",
    },
  },
  {
    characterId: 7571,
    name: "Hiruzen Sarutobi",
    seat: "front" as const,
    row: { tr: "Kürsünün ötesi", en: "Beyond the lectern" },
    note: {
      tr: "Köyün kararnamesini yazan adam: çocuğun içindekinden kimse söz etmeyecek. Yasak onu korudu ama yalnızlığını da büyüttü. Iruka'nın yaptığı şey o yasağın kapsamında değildi — bakmak yasaklanmamıştı.",
      en: "The man who wrote the village decree: no one is to speak of what is sealed in the boy. The ban protected him and enlarged his loneliness at the same time. What Iruka did fell outside it — looking was never forbidden.",
    },
  },
  {
    characterId: 3889,
    name: "Konohamaru Sarutobi",
    seat: "back" as const,
    row: { tr: "Bir sonraki sıra", en: "The next seat" },
    note: {
      tr: "Aynı odaya yıllar sonra giren bir başka torun. Iruka'nın işi tek bir çocukla bitmedi; sıra hiç boşalmadı, yalnızca defterdeki ad değişti.",
      en: "Another grandson who walked into the same room years later. Iruka's work did not end with one child; the seat never emptied, only the name in the register changed.",
    },
  },
  {
    characterId: 85,
    name: "Kakashi Hatake",
    seat: "front" as const,
    row: { tr: "Devralan", en: "The one who took over" },
    note: {
      tr: "Naruto'yu Akademi'den sonra teslim alan öğretmen. İki öğretmeni karşılaştırmak bu sayfanın işi değil; ama Kakashi'nin devraldığı çocuk, Iruka'nın tanıdığı çocuktu.",
      en: "The teacher who took Naruto on after the Academy. Comparing the two is not this page's business — but the boy Kakashi received was the boy Iruka had recognised.",
    },
  },
] as const;

/* ── Ders programı — üç büyük ───────────────────────────────────────────── */

export const IRUKA_CRAFT = [
  {
    key: "academy" as const,
    kanji: "先生",
    name: "Sensei",
    turkish: { tr: "Akademi öğretmenliği", en: "Teaching at the Academy" },
    tagline: {
      tr: "Sayfanın asıl tekniği bu ve hiçbir jutsu listesinde geçmiyor.",
      en: "This is the page's real technique, and it appears on no list of jutsu.",
    },
    text: {
      tr: "Akademi öğretmenliği Konoha'da bir kariyer basamağı değil, seçilen bir iştir: köyün en tehlikeli çocuklarını, onlar tehlikeli olmadan önce tanımak. Iruka'nın dosyasında büyük bir muharebe yok; onun yerine on yıla yakın bir süre boyunca her sabah aynı odaya girmiş olması var. Ölçülebilir tek çıktısı da sınıf listesinin en altındaki çocuk.",
      en: "Teaching at the Academy is not a rung on a career ladder in Konoha; it is a job you choose: to know the village's most dangerous children before they become dangerous. There is no great battle in Iruka's file. In its place there is the fact that for the better part of a decade he walked into the same room every morning. Its one measurable output is the boy at the bottom of the class list.",
    },
    traits: [
      { tr: "Aynı sınıf, her sabah", en: "The same room, every morning" },
      { tr: "Rütbe değil, tercih", en: "A choice, not a rank" },
      { tr: "Silahı dikkat", en: "Attention as the weapon" },
    ],
  },
  {
    key: "kageBunshin" as const,
    kanji: "影分身の術",
    name: "Kage Bunshin no Jutsu",
    turkish: { tr: "Gölge Klonu — öğretilmeyen ders", en: "Shadow Clone — the lesson never taught" },
    tagline: {
      tr: "Naruto bunu Iruka'dan öğrenmedi. Bir gecede, çalınmış bir tomardan öğrendi.",
      en: "Naruto did not learn this from Iruka. He learned it in one night, from a stolen scroll.",
    },
    text: {
      tr: "Kage Bunshin yasaklı sınıftan bir tekniktir: klonlar yanılsama değil, gerçek bedenlerdir ve kullanıcının çakrası aralarında eşit bölünür — sıradan bir şinobi için birkaç klon bile ölümcül bir masraftır. Naruto'nun aynı gece onlarcasını çıkarabilmesinin sebebi olağandışı çakra hacmiydi. Ama sayfanın ilgilendiği kısım şu: Akademi'de yıllarca beceremediği bir işi tek gecede bitirdi, çünkü ilk kez bir sebebi vardı.",
      en: "Kage Bunshin belongs to the forbidden class: the clones are not illusions but real bodies, and the user's chakra is split evenly between them — for an ordinary shinobi even a handful is a lethal expense. Naruto could put out dozens the same night because his chakra volume was abnormal. What concerns this page, though, is different: he finished in one night what had defeated him for years at the Academy, because for the first time he had a reason.",
    },
    traits: [
      { tr: "Kinjutsu — yasaklı sınıf", en: "Kinjutsu — the forbidden class" },
      { tr: "Klonlar gerçek, çakra bölünür", en: "Real bodies, chakra divided" },
      { tr: "Bir gecede öğrenildi", en: "Learned in a single night" },
    ],
  },
  {
    key: "shuriken" as const,
    kanji: "手裏剣術",
    name: "Shurikenjutsu",
    turkish: { tr: "Shuriken ve kunai temeli", en: "The shuriken and kunai basics" },
    tagline: {
      tr: "Akademi'nin ilk yılı: sıkıcı olan, sonradan hayatta tutan.",
      en: "The Academy's first year: the boring thing that later keeps you alive.",
    },
    text: {
      tr: "Kunainin halkası işaret parmağına geçer, başparmak sırta bastırır, bilek gevşek kalır; shuriken düz uçmaz, dönüşü hesaba katılır ve göz hedeften atıştan önce ayrılmaz. Bunların hiçbiri etkileyici değildir ve hepsi tekrar ister. Bir öğretmenin asıl işi de burada başlar: birinci denemeyi herkes yapar, öğretmen ikinciyi, otuzuncuyu ve otuz birinciyi bekleyen kişidir.",
      en: "The kunai's ring goes over the index finger, the thumb presses the spine, the wrist stays loose; a shuriken does not fly straight, its spin is part of the arithmetic, and the eye does not leave the mark before the throw does. None of this is impressive and all of it takes repetition. That is where a teacher's real work starts: anyone will make the first attempt — the teacher is the one who waits for the second, the thirtieth and the thirty-first.",
    },
    traits: [
      { tr: "Tekrar, sonra yine tekrar", en: "Repetition, then more repetition" },
      { tr: "Tutuş ve açı", en: "Grip and angle" },
      { tr: "Otuz birinci denemeyi beklemek", en: "Waiting for the thirty-first try" },
    ],
  },
] as const;

/* ── Çekmece — dört küçük ───────────────────────────────────────────────── */

export const IRUKA_DRAWER = [
  {
    key: "register" as const,
    imageKey: IRUKA_IMAGE_KEYS.register,
    name: { tr: "Sınıf defteri", en: "The class register" },
    note: {
      tr: "İçinde tek bir sır yok: sadece isimler ve karşılarında bir işaret. Bu sayfanın adını da o defterden aldı.",
      en: "It holds no secret at all: only names, and a mark beside each. This page took its name from that book.",
    },
  },
  {
    key: "headband" as const,
    imageKey: IRUKA_IMAGE_KEYS.headband,
    name: { tr: "Alın koruyucu", en: "The forehead protector" },
    note: {
      tr: "Tam yetkili bir şinobinin işareti; hediye edilmez, hak edilir. Iruka kendininkini çözüp bir çocuğun alnına bağladığında kuralı çiğnemedi — çocuğun hak ettiğine dair kararı verdi.",
      en: "The mark of a full-fledged shinobi; it is earned, not given. When Iruka untied his own and fastened it around a boy's head he did not break the rule — he made the ruling.",
    },
  },
  {
    key: "ichiraku" as const,
    imageKey: IRUKA_IMAGE_KEYS.ichiraku,
    name: { tr: "Ichiraku fişi", en: "The tab at Ichiraku" },
    note: {
      tr: "Bir çocuğa yemek ısmarlamak küçük bir şeydir; kimsenin ısmarlamadığı bir çocuğa ısmarlamak değildir. Hesabı ödeyen kişi, o akşam odadaki tek yetişkindi.",
      en: "Buying a child a meal is a small thing; buying one for a child nobody buys meals for is not. The man who paid was the only adult in the room that evening.",
    },
  },
  {
    key: "chunin" as const,
    imageKey: IRUKA_IMAGE_KEYS.chunin,
    name: { tr: "Chūnin yeleği", en: "The chūnin vest" },
    note: {
      tr: "Rütbesi burada durdu; çizelgede jōnin satırı yok. Değeri rütbeyle ölçen bir köyde bu bir eksiklik gibi okunur — arşivin iddiası şu ki eksik olan ölçü.",
      en: "His rank stopped here; there is no jōnin line on the chart. In a village that measures worth by rank that reads like a shortfall — the archive's claim is that the measure is what falls short.",
    },
  },
] as const;

/* ── Kara tahta — sayfanın kalbi ────────────────────────────────────────── */

export const IRUKA_BOARD_UI = {
  listLabel: { tr: "Tahtadaki dersler", en: "Lessons on the board" },
  lessonWord: { tr: "ders", en: "lesson" },
  prev: { tr: "Önceki ders", en: "Previous lesson" },
  next: { tr: "Sonraki ders", en: "Next lesson" },
  taughtLabel: { tr: "Tahtada", en: "On the board" },
  realLabel: { tr: "Sınıfın dışında", en: "Outside the classroom" },
  keyboardHint: {
    tr: "Yukarı ve aşağı ok tuşlarıyla da gezebilirsin.",
    en: "The up and down arrow keys work too.",
  },
  blankRow: { tr: "Boş satır", en: "Blank line" },
  trayLabel: {
    tr: "Tebeşir oluğu: bir tebeşir parçası ve bir silgi.",
    en: "The chalk tray: one stub of chalk and an eraser.",
  },
} as const;

/**
 * Beş ders.
 *
 * `chalk` tahtaya yazılan başlık (el yazısı ailesiyle çiziliyor),
 * `taught` Akademi müfredatının söylediği şey, `real` ise Iruka'nın
 * gerçekte öğrettiği şey. `blank` olan tek satır beşincisi: tahtada yeri
 * var, yazısı yok.
 */
export interface IrukaLesson {
  key: string;
  chalk: LocalizedText;
  taught: LocalizedText;
  real: LocalizedText;
  /** Tebeşir çiziminin ekran okuyucuya inen açıklaması */
  glyphAlt: LocalizedText;
  blank?: boolean;
}

export const IRUKA_LESSONS: IrukaLesson[] = [
  {
    key: "grip",
    chalk: { tr: "Kunai tutuşu", en: "How to hold a kunai" },
    glyphAlt: {
      tr: "Tebeşir çizimi: bir kunai, halkasından geçen parmak ve elin yanında iki titreme işareti.",
      en: "Chalk drawing: a kunai, a finger through its ring, and two tremor marks beside the hand.",
    },
    taught: {
      tr: "Halka işaret parmağına geçer, başparmak sırta bastırır, bilek gevşek kalır. Titreyen el açıyı bozar.",
      en: "The ring goes over the index finger, the thumb presses the spine, the wrist stays loose. A shaking hand ruins the angle.",
    },
    real: {
      tr: "Iruka bir çocuğa elini titretmemeyi öğretmedi; titrediğini kabul etmeyi öğretti. Korktuğunu söyleyebilen çocuk sınıfta kalır ve sorusunu sorar. Korkmuyormuş gibi yapan çocuk ormana tek başına gider.",
      en: "He never taught a child to stop his hand from shaking; he taught him to admit that it does. A child who can say he is afraid stays in the room and asks his question. A child who pretends otherwise walks into the forest alone.",
    },
  },
  {
    key: "target",
    chalk: { tr: "Hedef tahtası", en: "The target board" },
    glyphAlt: {
      tr: "Tebeşir çizimi: iç içe üç halka, dış halkaya saplanmış bir shuriken ve kesik çizgiyle atış yayı.",
      en: "Chalk drawing: three concentric rings, a shuriken stuck in the outer ring, and a dashed flight arc.",
    },
    taught: {
      tr: "Shuriken düz uçmaz. Nişan aldığın yere değil, baktığın yere gider; gözünü hedeften atıştan önce ayırırsan kenardan geçer.",
      en: "A shuriken does not fly straight. It goes where you look, not where you aim; take your eyes off the mark before the throw and it passes wide.",
    },
    real: {
      tr: "Bir sınıfta kırk çocuk var ve öğretmenin gözü kırk yere birden bakamaz. Iruka'nın tekniği tam olarak buydu: bir hedef seç ve gerçekten bak. En arkadaki çocuğu seçmesinin sebebi yeteneği değildi — kimsenin bakmıyor olmasıydı.",
      en: "A class holds forty children and a teacher cannot look at forty places at once. This was precisely his technique: choose one mark and actually look at it. He chose the boy at the back not for his talent, but because nobody else was looking.",
    },
  },
  {
    key: "seals",
    chalk: { tr: "El mühürleri", en: "Hand seals" },
    glyphAlt: {
      tr: "Tebeşir çizimi: çapraz duran iki el ve aralarında haç biçimindeki mühür işareti.",
      en: "Chalk drawing: two crossed hands with the cross-shaped seal between them.",
    },
    taught: {
      tr: "On iki mühür, sabit bir sıra, eşit tempo. Akademi'nin ilk yılı budur: aynı şekli bin kere yapmak, bin birincide düşünmeden yapabilmek.",
      en: "Twelve seals, a fixed order, an even tempo. That is the Academy's first year: making the same shape a thousand times so the thousand-and-first needs no thought.",
    },
    real: {
      tr: "Tekrarı çocuk zaten yapar; öğretmenin işi sebebi vermektir. Naruto yıllardır beceremediği tekniği tek bir gecede çıkardı, çünkü o gece ilk kez birinin onu bekliyor olduğunu biliyordu.",
      en: "The child will do the repetition on his own; the teacher's job is to supply the reason. Naruto produced in a single night the technique that had beaten him for years, because that night, for the first time, he knew someone was waiting for him.",
    },
  },
  {
    key: "rollcall",
    chalk: { tr: "Yoklama", en: "Roll call" },
    glyphAlt: {
      tr: "Tebeşir çizimi: çizgili bir defter sayfası, üç isim satırı, bir onay işareti ve daire içine alınmış son satır.",
      en: "Chalk drawing: a ruled register page, three name lines, one check mark, and a circle around the last line.",
    },
    taught: {
      tr: "Defter açılır, isimler sırayla okunur, her ismin karşılığında bir ses gelir. Günün en kısa ve en sıkıcı beş dakikası.",
      en: "The register opens, the names are read in order, and each one is answered. The shortest, dullest five minutes of the day.",
    },
    real: {
      tr: "Bir ismi yüksek sesle okumak, odadaki herkese o kişinin var olduğunu duyurmaktır. Konoha yıllarca o çocuğun içindekinin adını fısıldadı; Iruka her sabah çocuğun kendi adını okudu. Sayfanın bütün iddiası bu satırda.",
      en: "To read a name aloud is to announce to everyone in the room that this person exists. For years the village whispered the name of the thing inside the boy; every morning Iruka read out the boy's own name. This page's whole claim sits on that line.",
    },
  },
  {
    key: "blank",
    blank: true,
    chalk: { tr: "", en: "" },
    glyphAlt: {
      tr: "Tebeşir çizimi: boş bir satır ve satırın başında tek bir tebeşir noktası.",
      en: "Chalk drawing: an empty line with a single chalk dot at its start.",
    },
    taught: {
      tr: "Bu satır boş. Iruka yazmadı.",
      en: "This line is blank. Iruka did not write it.",
    },
    real: {
      tr: "Bu dersi öğrenciler yazar. Iruka'nın bütün öğretmenliği bu boşluğa dayanıyor: son satırı kendi doldursaydı, çocuk dört ders öğrenip durmuş olurdu.",
      en: "The students write this one. His whole teaching rests on that blank: had he filled the last line himself, the child would have learned four lessons and stopped.",
    },
  },
];

/* ── Ichiraku masası ────────────────────────────────────────────────────── */

export const IRUKA_ICHIRAKU = {
  bowls: [
    {
      key: "naruto" as const,
      who: { tr: "Naruto", en: "Naruto" },
      line: {
        tr: "Alnındakini istedi.",
        en: "He asked for the one on Iruka's forehead.",
      },
      note: {
        tr: "Bir çocuğun pazarlıksız istediği tek şey, ait olduğunu gösteren bir nesnedir.",
        en: "The one thing a child asks for without bargaining is an object that proves he belongs.",
      },
    },
    {
      key: "iruka" as const,
      who: { tr: "Iruka", en: "Iruka" },
      line: {
        tr: "Hayır dedi. Mezun olduğunda, dedi.",
        en: "He said no. When you graduate, he said.",
      },
      note: {
        tr: "Aynı alın koruyucusu, o akşamdan birkaç gece sonra, aynı çocuğun alnına bağlandı.",
        en: "The same forehead protector was tied around the same boy's head a few nights later.",
      },
    },
  ],
  bowlAlt: {
    tr: "Tezgâhta yan yana iki ramen kâsesi; ikisinden de buhar çıkıyor, içlerinde birer narutomaki dilimi var.",
    en: "Two ramen bowls side by side on the counter, both steaming, each with a slice of narutomaki in it.",
  },
  caption: {
    tr: "Kâsedeki beyaz spiralli dilime narutomaki denir. Adaş.",
    en: "The white slice with the spiral is called narutomaki. Namesake.",
  },
  close: {
    tr: "Sayfanın duygusal merkezi burası ve iki cümleden ibaret. Uzatmak bozardı.",
    en: "This is the emotional centre of the page, and it is two sentences long. Any more would spoil it.",
  },
} as const;

/* ── Beş satırlık yoklama ───────────────────────────────────────────────── */

/**
 * Çizelge satırı. `quote` opsiyonel — beş kaydın yalnızca birinde replik
 * var (`as const` bir birleşim tipi üretip opsiyonel alanı gizlediği için
 * satır tipi burada açıkça yazıldı).
 */
export interface IrukaFateEntry {
  key: string;
  imageKey: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: LocalizedText };
}

export const IRUKA_TIMELINE: IrukaFateEntry[] = [
  {
    key: "kyuubi",
    imageKey: IRUKA_IMAGE_KEYS.fateKyuubi,
    age: { tr: "Çocukluk", en: "Childhood" },
    title: { tr: "Kyūbi gecesi", en: "The night of the Nine-Tails" },
    text: {
      tr: "Dokuz Kuyruklu Tilki Konoha'ya saldırdığında Iruka henüz çocuktu. Annesi ve babası tilkiye karşı çıkan şinobiler arasındaydı ve o gece öldüler. Adını bilmediğimiz bir ninja onu güvenli bölgeye sürükledi; Iruka gitmek istemedi, kalmak istedi. Aynı gecenin sonunda, birkaç sokak ötede, bir bebeğin karnına bir mühür çiziliyordu.",
      en: "Iruka was still a child when the Nine-Tailed Fox attacked Konoha. His mother and father were among the shinobi who went out against it, and they died that night. A ninja whose name we do not know dragged him back to safety; he did not want to go, he wanted to stay. By the end of that same night, a few streets away, a seal was being drawn on an infant's stomach.",
    },
  },
  {
    key: "prank",
    imageKey: IRUKA_IMAGE_KEYS.fatePrank,
    age: { tr: "Akademi yılları", en: "Academy years" },
    title: {
      tr: "Görülmek için gürültü yapan çocuk",
      en: "The boy who made noise to be seen",
    },
    text: {
      tr: "Ondan sonra Akademi'nin soytarısı oldu: yaramazlık, bağırış, ceza, tekrar. Sınıf onunla dalga geçti. Yıllar sonra en arka sırada aynı şeyi yapan bir çocuk gördüğünde onu tanımak için hiç uğraşmadı — teşhis hazırdı, çünkü hastalık kendisininkiydi.",
      en: "After that he became the Academy's clown: pranks, shouting, punishment, repeat. The class laughed at him. Years later, when he saw a boy at the back doing exactly the same, he did not have to work to recognise him — the diagnosis was already written, because the illness had been his own.",
    },
  },
  {
    key: "teacher",
    imageKey: IRUKA_IMAGE_KEYS.fateTeacher,
    age: { tr: "23 yaş", en: "Age 23" },
    title: { tr: "Masanın öteki tarafı", en: "The other side of the desk" },
    text: {
      tr: "Aynı odaya geri döndü, bu kez kürsünün arkasına. Köyün kayıtlarında Iruka Umino chūnin rütbeli bir Akademi öğretmeni: cephede değil, sınıfta. Bu sayfanın iddiası şu — Konoha'nın bir sonraki neslinin ne olacağı o odada, tahtanın önünde belirleniyordu ve kimse oraya bakmıyordu.",
      en: "He came back to the same room, this time behind the lectern. In the village's records Iruka Umino is a chūnin and an Academy instructor: not at the front, in a classroom. This page's claim: what Konoha's next generation would become was being decided in that room, in front of that board, and nobody was looking at it.",
    },
  },
  {
    key: "mizuki",
    imageKey: IRUKA_IMAGE_KEYS.fateMizuki,
    age: { tr: "23 yaş", en: "Age 23" },
    title: {
      tr: "Mizuki gecesi ve alın koruyucu",
      en: "The Mizuki night and the forehead protector",
    },
    text: {
      tr: "Mizuki, Naruto'yu yasak tomarı çalmaya kandırdı ve sonra çocuğun içindeki mührü ona kendi ağzıyla duyurdu. Iruka araya girdi, yaralandı ve dövüşü kaybetti; Mizuki'yi bitiren, aynı gece bir tomardan öğrendiği Kage Bunshin'le Naruto oldu. Sonrasında Iruka çocuğa gözlerini kapatmasını söyledi, kendi alın koruyucusunu çözdü ve onun alnına bağladı.",
      en: "Mizuki tricked Naruto into stealing the forbidden scroll, then told the boy out loud what had been sealed inside him. Iruka stepped in, was wounded, and lost the fight; the one who finished Mizuki was Naruto, with the Kage Bunshin he had learned from a scroll that same night. Afterwards Iruka told the boy to close his eyes, untied his own forehead protector and fastened it around his head.",
    },
    quote: {
      text: { tr: "Tebrikler. Mezun oldun.", en: "Congratulations. You graduate." },
      by: { tr: "Iruka Umino", en: "Iruka Umino" },
    },
  },
  {
    key: "hall",
    imageKey: IRUKA_IMAGE_KEYS.fateHall,
    age: { tr: "Sonrası", en: "After" },
    title: { tr: "Salondaki adam", en: "The man in the hall" },
    text: {
      tr: "O çocuk Yedinci Hokage oldu. Iruka'nın adı ne törende okundu ne de taş yüzlerin arasında duruyor; rütbesi de chūnin'de kaldı. Arşivin kaydı şu: kalabalığın içindeki adam olmak bir eksiklik değil, bu sayfanın konusu. Birini ilk kez gerçekten gören kişinin adı çoğu zaman anıta yazılmaz.",
      en: "That boy became the Seventh Hokage. Iruka's name was not read at the ceremony and it is not carved among the stone faces; his rank stayed chūnin. The archive's entry: being the man in the crowd is not a shortfall, it is the subject of this page. The name of the first person who truly saw you is rarely the one on the monument.",
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const IRUKA_CLOSING = {
  quotes: [
    {
      text: {
        tr: "O, Dokuz Kuyruklu Tilki değil. O, Konoha'nın bir ninjası. O, Naruto Uzumaki.",
        en: "He is not the Nine-Tailed Fox. He is a ninja of the Hidden Leaf. He is Naruto Uzumaki.",
      },
      by: { tr: "Iruka Umino — Mizuki'ye", en: "Iruka Umino — to Mizuki" },
      note: {
        tr: "Sayfanın bütün fikri bu üç cümlede: birine “o şey” demeyi bırakıp adını söylemek.",
        en: "The page's whole idea sits in those three sentences: to stop calling someone “that thing” and say his name instead.",
      },
    },
    {
      text: { tr: "Tebrikler. Mezun oldun.", en: "Congratulations. You graduate." },
      by: { tr: "Iruka Umino — aynı gecenin sonunda", en: "Iruka Umino — at the end of the same night" },
      note: {
        tr: "Alın koruyucusunu çözüp çocuğun alnına bağladı; sonra ikisi Ichiraku'ya gitti.",
        en: "He untied his forehead protector and fastened it around the boy's head; then the two of them went to Ichiraku.",
      },
    },
  ],
  motto: "卒業おめでとう",
  mottoNote: {
    tr: "sotsugyō omedetō — “mezuniyetin kutlu olsun”",
    en: "sotsugyō omedetō — “congratulations on graduating”",
  },
  credit: {
    tr: "Künye verileri (doğum, boy, kan grubu, yaş) ve kapak portresi AniList'ten alınmıştır; bu karakterin arşive yüklenmiş tam boy portresi henüz yok, bu yüzden portre dar kadrajla kullanıldı. Kara tahta, tebeşir çizimleri, yara çizgisi ve ramen kâseleri bu sayfa için elle çizilmiş SVG'lerdir.",
    en: "Profile data (birthday, height, blood type, age) and the cover portrait come from AniList; the archive has no full-size portrait of this character yet, so the portrait is used in a tight crop. The blackboard, the chalk drawings, the scar line and the ramen bowls are SVGs drawn by hand for this page.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList profile" },
} as const;
