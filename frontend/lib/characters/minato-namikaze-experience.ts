import type { LocalizedText } from "./types";

/**
 * Minato Namikaze — "Sarı Şimşek · İşaretler" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 2535 kaydının ABILITY yuvaları,
 * `minato:*` anahtarlarıyla. Görsel bağlı değilse bölüm görselsiz ama
 * AYAKTA çizilir; hiçbir bölüm yükleme bekleyerek çökmez.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (25 Ocak), boy (179 cm), kan grubu (B), yaş (24) ve üç unvan
 * (Yondaime Hokage / Fourth Hokage / Konoha's Yellow Flash) AniList
 * künyesinden birebir alındı (`anilist-detay-22.json`, karakter 2535).
 * Kilo o kayıtta YOK, bu yüzden künye şeridinde de yok. Aynı künyenin
 * açıklama metninde geçen iki bilgi daha sayfada kullanıldı ve kaynağı
 * söylendi: Üçüncü Şinobi Savaşı'ndaki "görürsen kaç" emri ve Minato'nun
 * köye son isteği (çocuğa içindeki canavar olarak bakılmaması).
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada TIRNAK İÇİNDE TEK BİR REPLİK YOK. Minato'nun ağzından çıktığı
 * bilinen cümlelerin Türkçe karşılıkları çeviriden çeviriye değişiyor ve
 * BRIEF §9 emin olunmayan repliği yasaklıyor. Kapanıştaki iki blok bu
 * yüzden diyalog değil BELGE: biri bir orduya verilmiş cephe emri, diğeri
 * AniList künyesinde kayıtlı son istek. İkisi de kaynağıyla anılıyor.
 */

export const MINATO_ID = 2535;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const MINATO_SITE_URL = "https://anilist.co/character/2535";

/**
 * İŞARET DURAKLARI — sayfanın kalbi olan ışınlanma sütununun hedefleri.
 *
 * Değerler DOM kimlikleri: istemci adası `document.getElementById` ile bu
 * düğümleri buluyor, sunucu bileşeni aynı kimlikleri `<section id>` olarak
 * basıyor. İkisi tek yerden okusun diye burada duruyorlar — kimliği bir
 * tarafta değiştirip diğerini unutmak mümkün olmasın.
 */
export const MINATO_STOPS = {
  hero: "min-stop-hero",
  record: "min-stop-record",
  marks: "min-stop-marks",
  jutsu: "min-stop-jutsu",
  kit: "min-stop-kit",
  fate: "min-stop-fate",
  night: "min-stop-night",
} as const;

export type MinatoStopKey = keyof typeof MINATO_STOPS;

/**
 * İşaret sütununun yedi mührü.
 *
 * `glyph` elle çizilmiş SVG setindeki mühür numarası (0-6, bkz.
 * `MinatoGlyphs.tsx`). Sıra sayfadaki sıra: sütun yukarıdan aşağı okununca
 * sayfa da yukarıdan aşağı okunuyor.
 */
export interface MinatoMark {
  key: MinatoStopKey;
  glyph: number;
  title: LocalizedText;
  /** İşaret sözlüğünde (İşaretler bölümü) mührün ne anlattığı */
  note: LocalizedText;
}

export const MINATO_MARKS: MinatoMark[] = [
  {
    key: "hero",
    glyph: 0,
    title: { tr: "Üç uçlu", en: "Three prongs" },
    note: {
      tr: "Kunai'ın ucu — sayfanın başı.",
      en: "The kunai's head — the top of the page.",
    },
  },
  {
    key: "record",
    glyph: 1,
    title: { tr: "Künye", en: "The record" },
    note: {
      tr: "Üç satır: ölçülen, sayılan, yazılan.",
      en: "Three lines: measured, counted, filed.",
    },
  },
  {
    key: "marks",
    glyph: 2,
    title: { tr: "İşaretler", en: "The marks" },
    note: {
      tr: "Formülün kendisi: kare içinde bir nokta.",
      en: "The formula itself: a dot inside a square.",
    },
  },
  {
    key: "jutsu",
    glyph: 3,
    title: { tr: "Üç teknik", en: "Three techniques" },
    note: {
      tr: "Sarmal — avuçta dönen çakra.",
      en: "The spiral — chakra turning in a palm.",
    },
  },
  {
    key: "kit",
    glyph: 4,
    title: { tr: "Kunai, mühür, unvan, kurbağa", en: "Kunai, seal, title, toad" },
    note: {
      tr: "Kesişen iki çizgi ve bir bıçak ağzı.",
      en: "Two crossing lines and a blade.",
    },
  },
  {
    key: "fate",
    glyph: 5,
    title: { tr: "Yirmi dört yıl", en: "Twenty-four years" },
    note: {
      tr: "Bir hat üstünde beş durak.",
      en: "Five stops along one line.",
    },
  },
  {
    key: "night",
    glyph: 6,
    title: { tr: "Mühürleme gecesi", en: "The night of the sealing" },
    note: {
      tr: "Halka ve içine dolanan sarmal.",
      en: "A ring, and the spiral wound inside it.",
    },
  },
];

/**
 * Sergi görselleri — hepsi characterId 2535 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `minato:` önekli (kürator modu şartı).
 */
export const MINATO_IMAGE_KEYS = {
  /** Hero: gece göğü, köyün üstü; figür küçük (16:9) */
  hero: "minato:hero",
  marks: "minato:marks",
  hiraishin: "minato:hiraishin",
  rasengan: "minato:rasengan",
  shikiFujin: "minato:shiki-fujin",
  kunai: "minato:kunai",
  uzumakiSeal: "minato:uzumaki-seal",
  yellowFlash: "minato:yellow-flash",
  gamabunta: "minato:gamabunta",
  fateAcademy: "minato:fate-academy",
  fateTeam: "minato:fate-team",
  fateWar: "minato:fate-war",
  fateHokage: "minato:fate-hokage",
  fateKyuubi: "minato:fate-kyuubi",
  night: "minato:night",
  closing: "minato:closing",
} as const;

/** Kürator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const MINATO_SLOT_LABELS: Record<string, LocalizedText> = {
  [MINATO_IMAGE_KEYS.hero]: {
    tr: "Hero — gece göğü ve köyün silueti, figür küçük (16:9)",
    en: "Hero — night sky over the village, small figure (16:9)",
  },
  [MINATO_IMAGE_KEYS.marks]: {
    tr: "İşaret formülü — kunai sapındaki yazı, yakın kadraj",
    en: "The formula — the script on the kunai's grip, close crop",
  },
  [MINATO_IMAGE_KEYS.hiraishin]: {
    tr: "Hiraishin no Jutsu — sarı çizgi ve boşalan yer",
    en: "Hiraishin no Jutsu — the yellow streak and the empty spot",
  },
  [MINATO_IMAGE_KEYS.rasengan]: {
    tr: "Rasengan — avuçtaki dönen küre",
    en: "Rasengan — the turning sphere in the palm",
  },
  [MINATO_IMAGE_KEYS.shikiFujin]: {
    tr: "Shiki Fūjin — çağrılan Shinigami'nin gölgesi",
    en: "Shiki Fūjin — the shadow of the summoned Shinigami",
  },
  [MINATO_IMAGE_KEYS.kunai]: {
    tr: "Üç uçlu kunai — sap sargısı ve formül",
    en: "The three-pronged kunai — grip wrap and formula",
  },
  [MINATO_IMAGE_KEYS.uzumakiSeal]: {
    tr: "Sekiz Trigram Mühürleme Şekli — karındaki mühür",
    en: "Eight Trigrams Sealing Style — the seal on the belly",
  },
  [MINATO_IMAGE_KEYS.yellowFlash]: {
    tr: "Sarı Şimşek — savaş alanında boşalan cephe",
    en: "The Yellow Flash — a battlefield emptying out",
  },
  [MINATO_IMAGE_KEYS.gamabunta]: {
    tr: "Gamabunta kuchiyose'si — dev kurbağanın sırtı",
    en: "Summoning Gamabunta — the great toad's back",
  },
  [MINATO_IMAGE_KEYS.fateAcademy]: {
    tr: "Akademi — kar üstünde kırmızı saç teli",
    en: "The Academy — a strand of red hair on the snow",
  },
  [MINATO_IMAGE_KEYS.fateTeam]: {
    tr: "Takım Minato — Kakashi, Obito, Rin",
    en: "Team Minato — Kakashi, Obito, Rin",
  },
  [MINATO_IMAGE_KEYS.fateWar]: {
    tr: "Üçüncü Şinobi Savaşı — cephe",
    en: "The Third Shinobi War — the front",
  },
  [MINATO_IMAGE_KEYS.fateHokage]: {
    tr: "Dördüncü Hokage — cübbe ve şapka",
    en: "The Fourth Hokage — cloak and hat",
  },
  [MINATO_IMAGE_KEYS.fateKyuubi]: {
    tr: "Kyūbi gecesi — köyün üstündeki tilki",
    en: "The night of the Nine-Tails — the fox above the village",
  },
  [MINATO_IMAGE_KEYS.night]: {
    tr: "Mühürleme gecesi — iki ebeveyn ve bir bebek, çok sessiz kadraj",
    en: "The night of the sealing — two parents and a baby, a very quiet frame",
  },
  [MINATO_IMAGE_KEYS.closing]: {
    tr: "Kapanış — sabaha karşı boş bir alan",
    en: "Closing — an empty field near dawn",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const MINATO_IDENTITY = {
  name: "Minato Namikaze",
  nativeName: "波風ミナト",
  /** Hero filigranı — dikey sütun, dekoratif (aria-hidden) */
  watermark: "四代目",
  roles: {
    tr: "Dördüncü Hokage · Konoha'nın Sarı Şimşeği",
    en: "Fourth Hokage · Konoha's Yellow Flash",
  },
  epigraph: {
    tr: "Hızlı değildi. Aradaki yolu hiç yürümedi.",
    en: "He was not fast. He simply never walked the distance in between.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "25 Ocak", en: "25 January" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "179 cm", en: "179 cm" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "B", en: "B" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "24 — öldüğünde", en: "24 — at his death" },
    },
    {
      label: { tr: "Unvan", en: "Office" },
      value: {
        tr: "Yondaime Hokage — Dördüncü Hokage",
        en: "Yondaime Hokage — the Fourth Hokage",
      },
    },
    {
      label: { tr: "Namı", en: "Known as" },
      value: {
        tr: "Konoha'nın Sarı Şimşeği",
        en: "Konoha's Yellow Flash",
      },
    },
    {
      label: { tr: "Ustası", en: "Teacher" },
      value: { tr: "Jiraiya", en: "Jiraiya" },
    },
    {
      label: { tr: "Takımı", en: "His team" },
      value: {
        tr: "Takım Minato — Kakashi, Obito, Rin",
        en: "Team Minato — Kakashi, Obito, Rin",
      },
    },
    {
      label: { tr: "Yanında taşıdığı", en: "What he carries" },
      value: {
        tr: "Sapında formül yazan üç uçlu kunai",
        en: "A three-pronged kunai with a formula on the grip",
      },
    },
  ],
} as const;

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

/**
 * Düğmenin adı DEĞİŞMİYOR: erişilebilir ad sabit kalsın, durumu
 * `aria-pressed` söylesin. Açıkken ne olduğunu `hint` satırı anlatıyor
 * (`role="status"`), yani ekran okuyucu da modun etkisini duyuyor.
 */
export const MINATO_MODE = {
  label: { tr: "Hiraishin", en: "Flying Thunder God" },
  hint: {
    tr: "Bütün işaretler aynı anda göründü: bölüm başlarındaki formül çizgileri açık.",
    en: "Every mark is lit at once: the formula lines at the section heads are showing.",
  },
} as const;

/* ── İşaret sütununun metinleri ─────────────────────────────────────────── */

export const MINATO_RAIL = {
  label: { tr: "Hiraishin işaretleri", en: "Hiraishin marks" },
  hint: {
    tr: "Kenardaki yedi işaret. Birine bas: sayfa o bölümde — aradaki yol yok.",
    en: "Seven marks along the edge. Press one: the page is already there — no distance in between.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const MINATO_HERO = {
  lede: {
    tr: "Yirmi dört yıl yaşadı ve bunun son gecesine bir savaş, bir mühür ve bir veda sığdı. Geriye kalan iki şey aynı adamın iki tarafı: aradaki mesafeyi ortadan kaldıran bir teknik ve mesafeyi kapatmak için kendi canını veren bir baba.",
    en: "He lived twenty-four years, and into the last night of them went a battle, a seal and a goodbye. Two things outlast him, and they are two sides of one man: a technique that deletes the distance in between, and a father who closed a distance with his own life.",
  },
  portraitAlt: {
    tr: "Minato Namikaze — arşive yüklenmiş kadro portresi",
    en: "Minato Namikaze — cast portrait uploaded to the archive",
  },
  portraitAltFallback: {
    tr: "Minato Namikaze — AniList künye portresi",
    en: "Minato Namikaze — AniList profile portrait",
  },
  hemAlt: {
    tr: "Hokage cübbesinin eteğindeki alev deseni — bu sayfa için elle çizildi",
    en: "The flame pattern on the hem of the Hokage cloak — drawn by hand for this page",
  },
} as const;

/**
 * Görsel alt metinleri — BRIEF §4.5: her alt iki dilli ve KAYNAĞINI söyler.
 * Yoldaş portrelerinin tamamı kendi veritabanımızdan geliyor (PORTRAIT
 * yuvası), bu yüzden tek bir son ek yetiyor.
 */
export const MINATO_ALT = {
  faceSuffix: {
    tr: "— arşive yüklenmiş kadro portresi",
    en: "— cast portrait uploaded to the archive",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const MINATO_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "Naruto Universe" },
} as const;

export const MINATO_SECTIONS = {
  record: {
    title: { tr: "Künye", en: "The record" },
    lede: {
      tr: "Ölçülebilen her şey burada. Ölçülemeyen kısmı sayfanın geri kalanı.",
      en: "Everything measurable sits here. The rest of the page is the part that is not.",
    },
  },
  marks: {
    title: { tr: "İşaretler", en: "The marks" },
    lede: {
      tr: "Bu sayfanın kenarındaki sütun bir süs değil: Minato'nun tekniğinin aynısı, sayfaya uygulanmış hâli.",
      en: "The column along the edge of this page is not decoration: it is his technique, applied to a page.",
    },
  },
  jutsu: {
    title: { tr: "Üç teknik", en: "Three techniques" },
    lede: {
      tr: "Biri onu efsane yaptı, biri oğluna miras kaldı, biri onu öldürdü.",
      en: "One made him a legend, one was left to his son, one killed him.",
    },
  },
  kit: {
    title: {
      tr: "Kunai, mühür, unvan, kurbağa",
      en: "A kunai, a seal, a title, a toad",
    },
    lede: {
      tr: "Büyük teknikleri işe yarar kılan dört küçük şey. Üçü elle tutulur, biri değil.",
      en: "Four small things that make the big techniques work. Three you can hold; one you cannot.",
    },
  },
  fate: {
    title: { tr: "Yirmi dört yıl", en: "Twenty-four years" },
    lede: {
      tr: "Beş durak. İlkinde bir kız kurtardı, sonuncusunda bir oğul.",
      en: "Five stops. At the first he saved a girl; at the last, a son.",
    },
  },
  night: {
    title: { tr: "Mühürleme gecesi", en: "The night of the sealing" },
    lede: {
      tr: "Bu sayfada her şey anlık oluyor. Bu bölümde değil.",
      en: "Everything on this page happens instantly. Not in this section.",
    },
  },
} as const;

/* ── İşaretler bölümü — mekaniğin kendisi ───────────────────────────────── */

export const MINATO_MARKS_TEXT = {
  body: [
    {
      tr: "Hiraishin no Jutsu bir hız tekniği değil. Minato formülü (術式) bir kunai'ın sapına, bir duvara ya da bir avucun değdiği omza bırakır; sonra o formülün durduğu noktaya geçer. Aradaki mesafe kat edilmez, iptal edilir. Bu yüzden ona karşı hızlanmak işe yaramaz: yarışacak bir yol yoktur.",
      en: "Hiraishin no Jutsu is not a speed technique. He leaves a formula (術式) on the grip of a kunai, on a wall, on a shoulder his palm touched — and then he is where the formula is. The distance in between is not crossed; it is cancelled. Getting faster against him is useless: there is no road to race along.",
    },
    {
      tr: "Tekniği İkinci Hokage Tobirama Senju yazdı. Minato onu devraldı ve tek bir şey ekledi: işaretleri önceden, avuç avuç, savaş alanının her yerine bırakmak. Teknik o eklemeden sonra onun adıyla anılmaya başladı.",
      en: "The Second Hokage, Tobirama Senju, wrote the technique. Minato inherited it and added one thing: scattering the marks in advance, by the handful, all over the field. After that addition the technique started being called by his name.",
    },
    {
      tr: "Kenardaki sütun aynı mantıkla çalışıyor. Yedi işaret, yedi bölüm. Bir işarete bastığın anda sayfa o bölümde: kaydırma yok, geçiş yok, yalnızca varış — ve varılan bölümün kenarında bir an parlayan sarı bir çizgi. Klavyeyle de aynı: sekme tuşuyla işaretlere gel, Enter'a bas.",
      en: "The column along the edge runs on the same logic. Seven marks, seven sections. The instant you press one, the page is there: no scrolling, no transition, only arrival — and a yellow line flaring for a moment at the edge of the section you land in. The keyboard does the same: tab to a mark, press Enter.",
    },
  ],
  legendTitle: { tr: "Sütundaki yedi mühür", en: "The seven seals in the column" },
  formulaAlt: {
    tr: "Hiraishin formülünün şeması — bu sayfa için elle çizildi",
    en: "Diagram of the Hiraishin formula — drawn by hand for this page",
  },
} as const;

/* ── Üç teknik ──────────────────────────────────────────────────────────── */

export const MINATO_JUTSU = [
  {
    key: "hiraishin" as const,
    imageKey: MINATO_IMAGE_KEYS.hiraishin,
    kanji: "飛雷神の術",
    name: "Hiraishin no Jutsu",
    turkish: { tr: "Uçan Gök Gürültüsü Tanrısı", en: "Flying Thunder God" },
    tagline: {
      tr: "Mesafe kat edilmez — iptal edilir.",
      en: "Distance is not crossed — it is cancelled.",
    },
    text: {
      tr: "Uzay-zaman ninjutsu'su. Menzil, Minato'nun ne kadar hızlı koştuğuna değil işaretin nerede durduğuna bağlı; yani onunla dövüşen kişi aslında haritasını çoktan kaybetmiştir. Bir avuç kunai savurmak, bir alanı bir anda kendi alanına çevirmek demektir. Bir kez dokunduğu omuz da işaretli sayılır — kaçmak da işe yaramaz.",
      en: "Space-time ninjutsu. Range depends on where the mark sits, not on how fast he runs, which means anyone fighting him has already lost the map. Throwing a handful of kunai turns a field into his field in one motion. A shoulder his hand once touched counts as marked too — so running is no better than standing.",
    },
    traits: [
      { tr: "Uzay-zaman", en: "Space-time" },
      { tr: "İşaret şart", en: "Requires a mark" },
      { tr: "Hız değil, varış", en: "Not speed — arrival" },
    ],
  },
  {
    key: "rasengan" as const,
    imageKey: MINATO_IMAGE_KEYS.rasengan,
    kanji: "螺旋丸",
    name: "Rasengan",
    turkish: { tr: "Sarmal Küre", en: "Spiralling Sphere" },
    tagline: {
      tr: "Üç yıl, tek avuç, hiç el mührü yok.",
      en: "Three years, one palm, not a single hand seal.",
    },
    text: {
      tr: "Kuyruklu canavarın çakra topundan yola çıktı ve üç yılda kurdu: avuç içinde kendi etrafında dönen, biçimini kendi tutan bir çakra küresi. El mührü gerekmediği için karşı taraf ne geldiğini önceden okuyamaz. Minato bunu bitmiş saymadı; üstüne kendi doğa dönüşümünü ekleyecekti ve ömrü yetmedi. Yarım bıraktığı yeri yıllar sonra oğlu rüzgârla tamamladı.",
      en: "He started from a tailed beast's chakra bomb and spent three years on it: a sphere of chakra that turns around itself in the palm and holds its own shape. No hand seals, so the other side cannot read what is coming. He never called it finished — he meant to add his own nature transformation and ran out of life. Years later his son completed the missing half with wind.",
    },
    traits: [
      { tr: "Mühürsüz", en: "No hand seals" },
      { tr: "Üç yıllık iş", en: "Three years of work" },
      { tr: "Bilerek yarım", en: "Knowingly unfinished" },
    ],
  },
  {
    key: "shikiFujin" as const,
    imageKey: MINATO_IMAGE_KEYS.shikiFujin,
    kanji: "屍鬼封尽",
    name: "Shiki Fūjin",
    turkish: { tr: "Ölüm Tanrısı Mührü", en: "Dead Demon Consuming Seal" },
    tagline: {
      tr: "Fiyatı pazarlığa kapalı: çağıranın canı.",
      en: "The price is not negotiable: the summoner's life.",
    },
    text: {
      tr: "Uzumaki kökenli yasak bir fūinjutsu. Çağrılan Shinigami, mühürlenecek şeyi kullanıcının bedeninden geçirerek alır — ve ücretini de aynı bedenden alır. Minato bu mühürle Kurama'nın yin yarısını kendi içine kilitledi. Sayfadaki tek teknik bu: çalıştığı anda çalıştıranı bitiriyor, ve o gece bunu bilerek çalıştırdı.",
      en: "A forbidden fūinjutsu of Uzumaki origin. The summoned Shinigami draws whatever is being sealed through the user's own body — and takes its fee from that same body. With it Minato locked the Yin half of Kurama inside himself. It is the only technique on this page that finishes the person using it, and he used it knowing exactly that.",
    },
    traits: [
      { tr: "Yasak mühür", en: "A forbidden seal" },
      { tr: "Geri alınamaz", en: "Cannot be undone" },
      { tr: "Ücreti can", en: "Paid for with a life" },
    ],
  },
] as const;

/* ── Dört küçük ─────────────────────────────────────────────────────────── */

export const MINATO_KIT = [
  {
    key: "kunai" as const,
    imageKey: MINATO_IMAGE_KEYS.kunai,
    glyph: 0,
    name: { tr: "Üç uçlu kunai", en: "The three-pronged kunai" },
    note: {
      tr: "Sap sargısının altında formül yazılı. Minato bunları teker teker değil avuç avuç savurur: düştüğü yerde her biri bir kapıdır. Savaş alanına ne kadar çok bırakırsa alan o kadar onun olur — ve kimse kapıların nerede olduğunu bilmez.",
      en: "The formula is written under the grip wrap. He throws them by the handful, never one at a time: wherever one lands, it is a door. The more he leaves on a field the more the field belongs to him — and nobody else knows where the doors are.",
    },
  },
  {
    key: "uzumakiSeal" as const,
    imageKey: MINATO_IMAGE_KEYS.uzumakiSeal,
    glyph: 1,
    name: { tr: "Uzumaki mühür bilgisi", en: "Uzumaki sealing craft" },
    note: {
      tr: "Naruto'nun karnındaki Sekiz Trigram Mühürleme Şekli (八卦の封印式) Uzumaki fūinjutsu'suna dayanıyor. Yani o gece kullanılan mühür bir Konoha tekniği değil, karısının ailesinden gelen bir miras.",
      en: "The Eight Trigrams Sealing Style (八卦の封印式) on Naruto's belly rests on Uzumaki fūinjutsu. The seal used that night was not a Konoha technique but an inheritance from his wife's family.",
    },
  },
  {
    key: "yellowFlash" as const,
    imageKey: MINATO_IMAGE_KEYS.yellowFlash,
    glyph: 2,
    name: {
      tr: "Sarı Şimşek unvanı ve kaçma emri",
      en: "The Yellow Flash, and the order to run",
    },
    note: {
      tr: "Üçüncü Şinobi Savaşı'nda Iwagakure kendi askerlerine bir emir çıkardı: sarı saçlıyı görürsen dövüşme, çekil. Bir kişinin adının bir orduya talimat olarak yazılması ender bir şey; künyedeki unvan tam olarak buradan geliyor.",
      en: "During the Third Shinobi War, Iwagakure issued its own troops a standing order: if you see the yellow-haired one, do not fight — withdraw. It is a rare thing for a single name to be written into an army's instructions; the title in the record comes from exactly there.",
    },
  },
  {
    key: "gamabunta" as const,
    imageKey: MINATO_IMAGE_KEYS.gamabunta,
    glyph: 3,
    name: { tr: "Gamabunta kuchiyose'si", en: "Summoning Gamabunta" },
    note: {
      tr: "Myōbokuzan kurbağalarıyla sözleşmesi vardı — Jiraiya'dan kalan hat. Kyūbi gecesinde Gamabunta'yı çağırıp tilkinin sırtına bindirdi: o gece kuchiyose bir saldırı değil, bir taşıma aracıydı.",
      en: "He held the contract with the toads of Myōbokuzan — the line that came down from Jiraiya. On the night of the Nine-Tails he summoned Gamabunta and put him on the fox's back: that night the summon was not an attack but a means of transport.",
    },
  },
] as const;

/* ── Yirmi dört yıl ─────────────────────────────────────────────────────── */

/**
 * Çizelge satırı.
 *
 * `era` bilinçli olarak "yaş" değil DÖNEM: AniList'in verdiği tek yaş 24 ve
 * o da ölüm yaşı. Akademi ya da savaş yıllarına sayı uydurmaktansa dönem
 * adı yazıldı (BRIEF §9: uydurma yok). Sayının bilindiği tek satırda sayı
 * duruyor.
 *
 * `faces` yoldaş portrelerinin AniList numaraları; kaydı olmayan yüz hiç
 * çizilmez, satır çökmez.
 */
export interface MinatoFateEntry {
  key: string;
  imageKey: string;
  era: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  faces: { characterId: number; name: string }[];
}

export const MINATO_TIMELINE: MinatoFateEntry[] = [
  {
    key: "academy",
    imageKey: MINATO_IMAGE_KEYS.fateAcademy,
    era: { tr: "Akademi yılları", en: "The Academy years" },
    title: {
      tr: "Kırmızı saçı fark eden tek kişi",
      en: "The only one who noticed the red hair",
    },
    text: {
      tr: "Kumogakure'nin ekibi Kushina Uzumaki'yi köyden kaçırdığında kimse bir şey anlamadı. Kushina yol boyunca saçından tel tel bırakmıştı; o telleri gören tek kişi Minato oldu. Peşlerinden gitti, kızı geri aldı ve kollarında taşıyarak döndü. Kushina o güne kadar kırmızı saçından utanıyordu; o günden sonra utanmadı.",
      en: "When a Kumogakure squad took Kushina Uzumaki out of the village, nobody understood what had happened. She had dropped strands of her hair the whole way; Minato was the only one who saw them. He went after them, took her back, and carried her home in his arms. Until that day she had been ashamed of her red hair. After it, she was not.",
    },
    faces: [{ characterId: 7302, name: "Kushina Uzumaki" }],
  },
  {
    key: "team",
    imageKey: MINATO_IMAGE_KEYS.fateTeam,
    era: { tr: "Çıraklık ve öğretmenlik", en: "Apprentice, then teacher" },
    title: {
      tr: "Jiraiya'nın öğrencisi, Takım Minato'nun öğretmeni",
      en: "Jiraiya's student, Team Minato's teacher",
    },
    text: {
      tr: "Jiraiya onu üç genin'den biri olarak aldı ve yıllarca çalıştırdı; Rasengan'ın da Hiraishin'in de arkasında o yılların sabrı var. Sonra kendi takımını kurdu: Kakashi Hatake, Obito Uchiha ve Rin Nohara. Kannabi Köprüsü görevinden Obito dönmedi — Kakashi onun gözüyle döndü. Rin'i de birkaç yıl sonra kaybettiler.",
      en: "Jiraiya took him on as one of three genin and drilled him for years; the patience of those years sits behind both the Rasengan and the Hiraishin. Then he built his own team: Kakashi Hatake, Obito Uchiha and Rin Nohara. Obito did not come back from the Kannabi Bridge mission — Kakashi came back with his eye. Rin they lost a few years later.",
    },
    faces: [
      { characterId: 2423, name: "Jiraiya" },
      { characterId: 85, name: "Kakashi Hatake" },
      { characterId: 3149, name: "Obito Uchiha" },
      { characterId: 14082, name: "Rin Nohara" },
    ],
  },
  {
    key: "war",
    imageKey: MINATO_IMAGE_KEYS.fateWar,
    era: { tr: "Üçüncü Şinobi Savaşı", en: "The Third Shinobi War" },
    title: {
      tr: "Bir adın taktik emre dönüşmesi",
      en: "When a name became a standing order",
    },
    text: {
      tr: "Cephede tek başına bir Iwagakure birliğinin üstesinden geldiği anlatılır; anlatılanın ne kadarı savaş efsanesi, ne kadarı tutanak, bugün ayırmak zor. Ayırmaya gerek de kalmadı: Iwa askerlerine sarı saçlıyla dövüşmeme emri verildiğinde efsane resmî hâle gelmişti. Savaşın gidişatını değiştiren şey onun nerede olduğu değil, nerede olabileceğinin bilinmemesiydi.",
      en: "It is said he broke an entire Iwagakure unit on his own; how much of that is war legend and how much is record is hard to separate now. It stopped mattering: the moment Iwa's soldiers were ordered not to fight the yellow-haired one, the legend had been made official. What turned the war was not where he was, but that nobody could know where he might be.",
    },
    faces: [],
  },
  {
    key: "hokage",
    imageKey: MINATO_IMAGE_KEYS.fateHokage,
    era: { tr: "Dördüncü Hokage", en: "The Fourth Hokage" },
    title: {
      tr: "Yirmi dörtten önce köyün başında",
      en: "At the head of the village before twenty-four",
    },
    text: {
      tr: "Hiruzen Sarutobi'nin seçimiyle Konohagakure'nin Dördüncü Hokage'si oldu. Aynı yıllarda Kushina Uzumaki ile evlendi. Doğacak çocuklarının adını ustalarının yazdığı romandan aldılar — Jiraiya'nın kitabındaki inatçı kahramanın adından: Naruto.",
      en: "By Hiruzen Sarutobi's choice he became the Fourth Hokage of Konohagakure. In the same years he married Kushina Uzumaki. They took the name of their unborn child from their teacher's novel — from the stubborn hero in Jiraiya's book: Naruto.",
    },
    faces: [],
  },
  {
    key: "kyuubi",
    imageKey: MINATO_IMAGE_KEYS.fateKyuubi,
    era: { tr: "24 yaş", en: "Age 24" },
    title: { tr: "Kyūbi gecesi", en: "The night of the Nine-Tails" },
    text: {
      tr: "Doğum sırasında Kushina'nın mührü zayıfladı; maskeli bir adam Kurama'yı çıkardı ve köyün üstüne saldı. Minato bebeği güvenli yere ışınladı, maskeliyle dövüştü, tilkinin üstündeki kontrolü sözleşme mührüyle kırdı, Gamabunta'yı çağırıp onu köyden uzağa taşıdı. Bunların hepsi bir gecede oldu ve hepsi bir sonraki adımı kazanmak içindi. Son adım Shiki Fūjin'di.",
      en: "The seal weakened during the birth; a masked man pulled Kurama out and set him on the village. Minato teleported the baby to safety, fought the masked man, broke his hold on the fox with a contract seal, summoned Gamabunta and hauled it away from the village. All of it happened in one night, and all of it was to buy the next step. The last step was Shiki Fūjin.",
    },
    faces: [
      { characterId: 7302, name: "Kushina Uzumaki" },
      { characterId: 17, name: "Naruto Uzumaki" },
    ],
  },
];

/* ── Mühürleme gecesi — sayfanın yavaşladığı yer ────────────────────────── */

/**
 * Beş kısa paragraf. Bilerek az: bölüm uzunlukla değil boşlukla ağır.
 * Bileşende aralarında bir bölüm yüksekliği kadar boşluk var ve bu bölümde
 * hiçbir geçiş/animasyon tanımlı değil (bkz. modülün "gece" başlığı).
 */
export const MINATO_NIGHT = {
  lines: [
    {
      tr: "O gece sayfadaki her şeyin tersi oldu: hiçbir şey anında bitmedi.",
      en: "That night was the opposite of the rest of this page: nothing was over in an instant.",
    },
    {
      tr: "Kurama'nın pençesi indiğinde iki kişi aynı anda öne çıktı. Pençe ikisini birden geçti ve çocuğa değmedi.",
      en: "When the claw came down, two people stepped forward at the same moment. It went through both of them and never reached the child.",
    },
    {
      tr: "Minato tilkinin yin yarısını kendi içine, yang yarısını oğluna mühürledi. Shiki Fūjin'in bedelini biliyordu. Mührü yine de kurdu.",
      en: "He sealed the fox's Yin half into himself and its Yang half into his son. He knew what Shiki Fūjin costs. He set the seal anyway.",
    },
    {
      tr: "Köye bıraktığı son istek buydu: çocuğa içindeki canavar olarak değil, onu tutan kişi olarak baksınlar. Köy bu isteği tutmadı.",
      en: "The last thing he asked of the village was this: look at the boy as the one holding the thing, not as the thing itself. The village did not keep the request.",
    },
    {
      tr: "Kushina'yla birlikte, bir ömür boyu söyleyecekleri her şeyi tek bir geceye sığdırdılar. Sonra ikisi de sustu.",
      en: "Together with Kushina, they fitted everything they would ever have said into a single night. Then both of them went quiet.",
    },
  ],
  sealAlt: {
    tr: "Sekiz Trigram Mühürleme Şekli'nin sarmalı — bu sayfa için elle çizildi",
    en: "The spiral of the Eight Trigrams Sealing Style — drawn by hand for this page",
  },
  sourceNote: {
    tr: "Son istek, AniList künyesinin açıklama metninde kayıtlı.",
    en: "The last request is recorded in the description on his AniList profile.",
  },
} as const;

/* ── Kapanış ────────────────────────────────────────────────────────────── */

/**
 * İki blok — ve ikisi de replik DEĞİL, belge. Biri bir orduya verilmiş
 * cephe emrinin özeti, diğeri AniList künyesinde kayıtlı son istek. Bu
 * yüzden tırnak işareti kullanılmadı: cümleler arşivin kalemiyle yazıldı,
 * kaynakları altlarında duruyor.
 */
export const MINATO_CLOSING = {
  records: [
    {
      text: {
        tr: "Sarı saçlıyı görürsen dövüşme. Çekil.",
        en: "If you see the yellow-haired one, do not fight. Withdraw.",
      },
      by: {
        tr: "Iwagakure'nin cephe emri — Üçüncü Şinobi Savaşı",
        en: "Iwagakure's standing order — the Third Shinobi War",
      },
      note: {
        tr: "Bir kişinin adı bir orduya talimat olarak yazıldı; unvan buradan doğdu.",
        en: "One man's name was written into an army's instructions; the title was born there.",
      },
    },
    {
      text: {
        tr: "Çocuğa içindeki şey olarak değil, onu taşıyan kişi olarak bakın.",
        en: "Look at the boy as the one carrying the thing, not as the thing.",
      },
      by: {
        tr: "Minato'nun köyden son isteği",
        en: "Minato's last request of the village",
      },
      note: {
        tr: "AniList künyesinde kayıtlı. Köy isteği tutmadı — Naruto'nun bütün çocukluğu bunun sonucu.",
        en: "Recorded on his AniList profile. The village did not keep it, and Naruto's entire childhood is what followed.",
      },
    },
  ],
  motto: "木ノ葉の黄色い閃光",
  mottoNote: {
    tr: "Konoha no Kiiroi Senkō — Konoha'nın Sarı Şimşeği",
    en: "Konoha no Kiiroi Senkō — Konoha's Yellow Flash",
  },
  credit: {
    tr: "Künye verileri (doğum, boy, kan grubu, yaş, unvanlar) ve yedek portre AniList'ten alındı; kaçma emri ile Minato'nun köye son isteği de aynı künyenin açıklama metninde geçiyor. Sayfadaki tam boy portre ve yoldaş portreleri arşivin kendi yüklemeleri. İşaret sütunundaki yedi mühür, cübbe eteğindeki alev deseni, formül şeması ve mühür sarmalı bu sayfa için elle çizilmiş SVG'lerdir. Sayfada tırnak içinde replik yok: kaynağından emin olunmayan hiçbir cümle karaktere atfedilmedi.",
    en: "Profile data (birthday, height, blood type, age, titles) and the fallback portrait come from AniList; the flee-on-sight order and Minato's last request of the village are recorded in the description on the same profile. The full-size portrait and the companion portraits are the archive's own uploads. The seven seals in the mark column, the flame pattern on the cloak hem, the formula diagram and the sealing spiral are SVGs drawn by hand for this page. There is not a single quoted line on this page: no sentence was attributed to him unless its source was certain.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList profile" },
} as const;
