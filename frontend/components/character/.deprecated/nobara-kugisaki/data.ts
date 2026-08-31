import type { LocalizedText } from "./types";

/**
 * Nobara Kugisaki — "Rezonans" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 133700 kaydının ABILITY yuvaları,
 * `nob:*` anahtarlarıyla.
 *
 * ⚠️ 25 Ağustos 2026 itibarıyla JJK kadrosunun hiçbirinin veritabanımızda
 * görseli YOK. Sayfanın kalbi (rezonans tezgâhı) tamamen elle çizilmiş SVG
 * ve hiçbir görsele bağlı değil.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum (7 Ağustos 2002), yaş (16), boy (160 cm), derece (3. sınıf büyücü),
 * meslek (büyücü ve öğrenci) ve bağlı olduğu yer (Tokyo Jujutsu Lisesi)
 * AniList künyesinden birebir alındı (karakter 133700, 25 Ağustos 2026).
 *
 * ⚠️ AniList kaydında TEKNİK SATIRI YOK: Gojō'da ve Megumi'de bulunan
 * "Cursed Technique" alanı Nobara'nın künyesinde hiç geçmiyor. Teknik adı
 * (芻霊呪法) bu yüzden künye şeridine değil, teknik bölümüne yazıldı ve
 * şeritte bir "kayıtta yok" notu bırakıldı. Kan grubu da boş.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada iki replik tırnak içinde: 「私は釘崎野薔薇だ」 (kendini tanıtırken)
 * ve 「悪くないじゃん、私の人生」 (Shibuya'daki son sahnesinde). İkisi de
 * kaynağıyla anılıyor; emin olunmayan hiçbir cümle tırnağa alınmadı.
 *
 * ⚠️ SHIBUYA'NIN SONU: Nobara'nın Mahito'yla karşılaşmasının sonucu
 * hikâyede uzun süre AÇIKTA bırakıldı. Metin bunu olduğu gibi yazıyor —
 * "öldü" ya da "kurtuldu" denmiyor, belirsizliğin kendisi anlatılıyor.
 */

export const NOBARA_ID = 133700;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const NOBARA_SITE_URL = "https://anilist.co/character/133700";

/**
 * Sergi görselleri — hepsi characterId 133700 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `nob:` önekli (kurator modu şartı).
 */
export const NOBARA_IMAGE_KEYS = {
  hero: "nob:hero",
  doll: "nob:surei",
  resonance: "nob:kyomei",
  hairpin: "nob:kanzashi",
  smallTools: "nob:kanazuchi",
  smallFlash: "nob:kokusen",
  smallPiece: "nob:katami",
  smallTokyo: "nob:tokyo",
  fateVillage: "nob:fate-village",
  fateTokyo: "nob:fate-tokyo",
  fateKyoto: "nob:fate-kyoto",
  fateFlash: "nob:fate-flash",
  fateShibuya: "nob:fate-shibuya",
  closing: "nob:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const NOBARA_SLOT_LABELS: Record<string, LocalizedText> = {
  [NOBARA_IMAGE_KEYS.hero]: {
    tr: "Hero — Nobara, elinde çekiç, dik duruş (16:9)",
    en: "Hero — Nobara, hammer in hand, standing squarely (16:9)",
  },
  [NOBARA_IMAGE_KEYS.doll]: {
    tr: "Saman bebek — avucunda, yakın çekim",
    en: "The straw doll — in her palm, close crop",
  },
  [NOBARA_IMAGE_KEYS.resonance]: {
    tr: "Kyōmei — çivi bebeğe girerken, karşı tarafta çatlak",
    en: "Resonance — the nail entering the doll, the crack opening elsewhere",
  },
  [NOBARA_IMAGE_KEYS.hairpin]: {
    tr: "Kanzashi — içeriden dışarı patlayan çiviler",
    en: "Hairpin — the nails bursting outward from within",
  },
  [NOBARA_IMAGE_KEYS.smallTools]: {
    tr: "Çekiç ve çivi kutusu — masada, yakın çekim",
    en: "Hammer and box of nails — on a table, close crop",
  },
  [NOBARA_IMAGE_KEYS.smallFlash]: {
    tr: "Kara şimşek — temas anındaki siyah kıvılcım",
    en: "Black flash — the black spark at the moment of contact",
  },
  [NOBARA_IMAGE_KEYS.smallPiece]: {
    tr: "Bağ maddesi — bebeğin içine konan parça",
    en: "The link — the fragment placed inside the doll",
  },
  [NOBARA_IMAGE_KEYS.smallTokyo]: {
    tr: "Tokyo — vitrinler, kalabalık, gece",
    en: "Tokyo — shop windows, a crowd, night",
  },
  [NOBARA_IMAGE_KEYS.fateVillage]: {
    tr: "Köy — dar sokak, iki çocuk",
    en: "The village — a narrow lane, two children",
  },
  [NOBARA_IMAGE_KEYS.fateTokyo]: {
    tr: "Okula geliş — üç birinci sınıf yan yana",
    en: "Arriving at school — three first-years side by side",
  },
  [NOBARA_IMAGE_KEYS.fateKyoto]: {
    tr: "Kyoto karşılaşması — meydan okuma anı",
    en: "The Kyoto event — the moment of challenge",
  },
  [NOBARA_IMAGE_KEYS.fateFlash]: {
    tr: "Kara şimşeği indirdiği an — yumruk ve siyah kıvılcım",
    en: "Landing the black flash — the fist and the black spark",
  },
  [NOBARA_IMAGE_KEYS.fateShibuya]: {
    tr: "Shibuya — metro çıkışı, tek figür",
    en: "Shibuya — the station exit, a single figure",
  },
  [NOBARA_IMAGE_KEYS.closing]: {
    tr: "Kapanış — boş bir sokak, düşük kontrast",
    en: "Closing — an empty street, low contrast",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const NOBARA_IDENTITY = {
  name: "Nobara Kugisaki",
  nativeName: "釘崎野薔薇",
  /** Hero filigranı — dekoratif (aria-hidden): 釘 = çivi */
  watermark: "釘",
  house: {
    tr: "Taşradan Tokyo'ya · Jujutsu Lisesi birinci sınıf",
    en: "From the country to Tokyo · Jujutsu High, first year",
  },
  epigraph: {
    tr: "Vuruş burada iner, acı orada çıkar. Aradaki mesafeyi kapatan şey güç değil, bir bağ.",
    en: "The blow lands here, the pain comes out there. What closes the distance is not force but a link.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Born" },
      value: { tr: "7 Ağustos 2002", en: "7 August 2002" },
    },
    { label: { tr: "Yaş", en: "Age" }, value: { tr: "16", en: "16" } },
    { label: { tr: "Boy", en: "Height" }, value: { tr: "160 cm", en: "160 cm" } },
    {
      label: { tr: "Derece", en: "Grade" },
      value: { tr: "3. sınıf büyücü", en: "Grade 3 sorcerer" },
    },
    {
      label: { tr: "Okul", en: "School" },
      value: { tr: "Tokyo Jujutsu Lisesi", en: "Tokyo Jujutsu High" },
    },
    {
      label: { tr: "İşi", en: "Occupation" },
      value: { tr: "Büyücü ve öğrenci", en: "Sorcerer and student" },
    },
  ],
} as const;

export const NOBARA_MISSING_NOTE: LocalizedText = {
  tr: "AniList kaydında Nobara için teknik satırı ve kan grubu YOK — bu yüzden şeritte de yok. Teknik adı aşağıdaki bölümde, kendi kaynağıyla.",
  en: "Nobara's AniList record carries no cursed-technique line and no blood type, so neither appears here. The technique's name is in the section below, with its own source.",
};

/* ── Mod düğmesi: kendini tanıtmak ──────────────────────────────────────── */

export const NOBARA_ASSERT_TEXT = {
  enter: { tr: "Sesini yükselt", en: "Raise her voice" },
  exit: { tr: "Sesini indir", en: "Lower her voice" },
  hint: {
    tr: "Sayfa artık kendini küçültmüyor: ölçek büyüdü, kenarlar sertleşti, bakır ısındı.",
    en: "The page has stopped making itself small: the scale is up, the edges are hard, the copper has warmed.",
  },
  banner: "私は釘崎野薔薇",
  bannerNote: {
    tr: "Ben Nobara Kugisaki'yim.",
    en: "I am Nobara Kugisaki.",
  },
} as const;

export const NOBARA_HERO = {
  lede: {
    tr: "Nobara'nın tekniğinin tuhaflığı şu: vurduğu şeyle acıyan şey aynı yerde değil. Elindeki saman bebeğe bir çivi çakıyor ve çivi, o bebekle bağı kurulmuş olan bedende çıkıyor. Bağ yoksa çekiç boşa iniyor. Bu sayfa o tuhaflığın üstüne kurulu: solda vuruyorsun, sağda oluyor — ve arada bir şey olmazsa hiçbir şey olmuyor.",
    en: "The oddity of Nobara's technique is this: the thing she strikes and the thing that hurts are not in the same place. She drives a nail into the straw doll in her hand, and the nail comes out in the body that doll is linked to. With no link, the hammer falls on nothing. This page is built on that oddity: you strike on the left, it happens on the right — and if nothing sits between them, nothing happens at all.",
  },
  portraitAlt: {
    tr: "Nobara Kugisaki — arşivin yüklediği portre",
    en: "Nobara Kugisaki — portrait uploaded by the archive",
  },
  portraitAltFallback: {
    tr: "Nobara Kugisaki — AniList künye portresi",
    en: "Nobara Kugisaki — AniList dossier portrait",
  },
  toolCaption: {
    tr: "Silahı bir kılıç değil bir marangoz takımı: bir çekiç, bir kutu çivi ve bir avuç saman.",
    en: "Her weapon is not a blade but a carpenter's kit: a hammer, a box of nails and a handful of straw.",
  },
} as const;

export const NOBARA_ALT = {
  companionSuffix: { tr: "portresi", en: "portrait" },
} as const;

export const NOBARA_CRUMB = {
  series: { tr: "Jujutsu Kaisen", en: "Jujutsu Kaisen" },
} as const;

export const NOBARA_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "Dossier" },
    lede: {
      tr: "AniList kaydından birebir; boşları doldurulmadı.",
      en: "Taken verbatim from the AniList record; blanks left blank.",
    },
  },
  arts: {
    title: { tr: "Üç sütun", en: "Three pillars" },
    lede: {
      tr: "Bir teknik, onun uzaktan çalışan hâli ve içeriden patlayan hâli.",
      en: "One technique, its version that works at a distance, and its version that bursts from within.",
    },
  },
  tools: {
    title: { tr: "Dört ayrıntı", en: "Four details" },
    lede: {
      tr: "Takım çantası, tek seferlik bir kıvılcım, tekniğin şartı ve bir şehir.",
      en: "The toolbox, a one-off spark, the technique's precondition, and a city.",
    },
  },
  bench: {
    title: { tr: "Rezonans tezgâhı", en: "The resonance bench" },
    lede: {
      tr: "Solda bebek, sağda hedef. Çiviyi solda çakıyorsun — ama bağ kurulmadıysa sağ taraf hiçbir şey hissetmiyor.",
      en: "The doll on the left, the target on the right. You drive the nail on the left — but with no link established, the right side feels nothing.",
    },
  },
  fate: {
    title: { tr: "Beş durak", en: "Five stops" },
    lede: {
      tr: "Kendini küçültmeyi hiçbir yerde kabul etmemiş bir on altı yaş.",
      en: "Sixteen years that never once agreed to be made smaller.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "Söylenen son cümle bir şikâyet değildi.",
      en: "The last sentence spoken was not a complaint.",
    },
  },
} as const;

/* ── Üç sütun ───────────────────────────────────────────────────────────── */

export interface NobaraArt {
  key: string;
  name: string;
  kanji: string;
  reading: string;
  turkish: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
  imageKey: string;
}

export const NOBARA_ARTS: NobaraArt[] = [
  {
    key: "doll",
    name: "Sūrei Jubō",
    kanji: "芻霊呪法",
    reading: "すうれいじゅほう",
    turkish: { tr: "Saman Bebek Tekniği", en: "Straw Doll Technique" },
    tagline: {
      tr: "Bir bebeği bir bedenin yerine koyar.",
      en: "It puts a doll in place of a body.",
    },
    text: {
      tr: "Tekniğin temeli bir yer değiştirme: elindeki saman bebek, bağ kurulan bedenin vekili oluyor. Çekiç bebeğe iniyor, hasar bedene çıkıyor. Bu sayede Nobara hiç yaklaşmadan, hatta hedefi görmeden vurabiliyor. Karşılığında tekniğin tamamı tek bir şarta bağlı: bağın gerçekten kurulmuş olması.",
      en: "The technique's base is a substitution: the straw doll in her hand becomes the proxy of a linked body. The hammer falls on the doll, the damage surfaces on the body. This lets Nobara strike without closing in, even without seeing her target. In exchange the whole technique rests on one condition: that the link is genuinely made.",
    },
    traits: [
      { tr: "Vekil beden", en: "Proxy body" },
      { tr: "Mesafe gerektirmez", en: "Distance-agnostic" },
      { tr: "Bağa bağlı", en: "Link-dependent" },
    ],
    imageKey: NOBARA_IMAGE_KEYS.doll,
  },
  {
    key: "resonance",
    name: "Kyōmei",
    kanji: "共鳴り",
    reading: "きょうめい",
    turkish: { tr: "Rezonans", en: "Resonance" },
    tagline: {
      tr: "Parçadan bütüne geri döner.",
      en: "It travels back from the fragment to the whole.",
    },
    text: {
      tr: "Hedefin bir parçası — bir saç teli, bir damla kan, kopmuş bir uzuv — bebeğin içine konduğunda çivi artık bebeği değil sahibini buluyor. Menzili yok: parça neredeyse bağ oradan kuruluyor. Nobara'nın tekniğinin gerçek gücü hasarda değil, hedefin nerede olduğunu bilmek zorunda olmamasında.",
      en: "When a fragment of the target — a strand of hair, a drop of blood, a severed limb — goes into the doll, the nail no longer finds the doll but its owner. It has no range: wherever the fragment is, the link runs from there. The real strength of Nobara's technique is not its damage but that she need not know where her target is.",
    },
    traits: [
      { tr: "Parça şart", en: "A fragment is required" },
      { tr: "Menzilsiz", en: "No range limit" },
      { tr: "Görüş gerekmez", en: "No line of sight" },
    ],
    imageKey: NOBARA_IMAGE_KEYS.resonance,
  },
  {
    key: "hairpin",
    name: "Kanzashi",
    kanji: "簪",
    reading: "かんざし",
    turkish: { tr: "Saç Tokası", en: "Hairpin" },
    tagline: {
      tr: "İçeri girmiş çiviyi dışarı patlatır.",
      en: "It detonates a nail that is already inside.",
    },
    text: {
      tr: "Önce çivi hedefin içine giriyor, sonra o çivi yerinde patlatılıyor. Yani hasar dışarıdan değil içeriden geliyor ve deriyi delmek yerine dokuyu dağıtıyor. Bir kereden fazla çivi yerleştirilmişse hepsi aynı anda patlatılabiliyor — Nobara'nın önce yatırım yapıp sonra tahsil ettiği tek hamlesi bu.",
      en: "First the nail goes into the target, then that nail is detonated where it sits. The damage comes from within rather than without, tearing tissue instead of piercing skin. If more than one nail has been placed, all of them can go off at once — this is the one move where Nobara invests first and collects later.",
    },
    traits: [
      { tr: "İçeriden hasar", en: "Damage from within" },
      { tr: "Biriktirilebilir", en: "Stackable" },
      { tr: "Tek anda boşalır", en: "Discharged all at once" },
    ],
    imageKey: NOBARA_IMAGE_KEYS.hairpin,
  },
];

/* ── Dört ayrıntı ───────────────────────────────────────────────────────── */

export interface NobaraDetail {
  key: string;
  name: LocalizedText;
  kanji: string;
  note: LocalizedText;
  imageKey: string;
}

export const NOBARA_DETAILS: NobaraDetail[] = [
  {
    key: "tools",
    name: { tr: "Çekiç ve çiviler", en: "Hammer and nails" },
    kanji: "金槌",
    note: {
      tr: "Silahı bir marangoz takımı. Çiviler lanet enerjisi yüklenerek tek başlarına da atılabiliyor — o hâlde bebeğe bile ihtiyaç kalmıyor, yalnızca menzil kısalıyor.",
      en: "Her armament is a carpenter's kit. Loaded with cursed energy, the nails can also be thrown on their own — no doll required then, only a shorter reach.",
    },
    imageKey: NOBARA_IMAGE_KEYS.smallTools,
  },
  {
    key: "flash",
    name: { tr: "Kara şimşek", en: "Black flash" },
    kanji: "黒閃",
    note: {
      tr: "Lanet enerjisinin temasla arasındaki gecikme binde bir saniyenin altına indiğinde çıkan siyah kıvılcım. Kimse isteyerek yapamıyor. Nobara onu bir kez indirdi ve o vuruş kariyerinin en yüksek noktası oldu.",
      en: "The black spark that appears when the gap between cursed energy and contact drops below a thousandth of a second. No one can do it on purpose. Nobara landed one, and that strike was the high point of her career.",
    },
    imageKey: NOBARA_IMAGE_KEYS.smallFlash,
  },
  {
    key: "piece",
    name: { tr: "Bağ maddesi", en: "The link" },
    kanji: "形見",
    note: {
      tr: "Rezonansın tek şartı. Bir saç, bir damla kan, kopmuş bir parça — hedefe ait olduğu sürece ne olduğu önemli değil. Bağ kurulmadan çakılan çivi yalnızca samanı deliyor.",
      en: "Resonance's only condition. A hair, a drop of blood, a torn-off piece — what it is does not matter as long as it belongs to the target. A nail driven before the link is made merely pierces straw.",
    },
    imageKey: NOBARA_IMAGE_KEYS.smallPiece,
  },
  {
    key: "tokyo",
    name: { tr: "Tokyo", en: "Tokyo" },
    kanji: "東京",
    note: {
      tr: "Büyücü olmasının sebebi bir görev duygusu değil: küçük bir kasabada büyümüş olmak ve oradan çıkmak istemek. Jujutsu Lisesi ona bir amaçtan önce bir ADRES verdi — sevdiği şehirde yaşamanın yolu bu oldu.",
      en: "What made her a sorcerer was not duty: it was growing up in a small town and wanting out of it. Jujutsu High gave her an ADDRESS before it gave her a purpose — this was how she got to live in the city she loved.",
    },
    imageKey: NOBARA_IMAGE_KEYS.smallTokyo,
  },
];

/* ── Rezonans tezgâhı: sayfanın kalbi ───────────────────────────────────── */

/**
 * Çakma noktaları. İKİ PANO da AYNI listeyi okuyor — mekaniğin bütün fikri
 * bu: solda ve sağda aynı koordinat, farklı beden. Koordinatlar yüzde,
 * çünkü iki pano da farklı boyutta çizilebiliyor.
 */
export interface NobaraPoint {
  key: string;
  x: number;
  y: number;
  name: LocalizedText;
}

export const NOBARA_POINTS: NobaraPoint[] = [
  { key: "head", x: 50, y: 13, name: { tr: "Baş", en: "Head" } },
  { key: "left-arm", x: 25, y: 36, name: { tr: "Sol kol", en: "Left arm" } },
  { key: "right-arm", x: 75, y: 36, name: { tr: "Sağ kol", en: "Right arm" } },
  { key: "chest", x: 50, y: 40, name: { tr: "Göğüs", en: "Chest" } },
  { key: "left-leg", x: 38, y: 76, name: { tr: "Sol bacak", en: "Left leg" } },
  { key: "right-leg", x: 62, y: 76, name: { tr: "Sağ bacak", en: "Right leg" } },
];

export const NOBARA_BENCH_UI = {
  dollLabel: { tr: "Saman bebek — vurulan taraf", en: "The straw doll — the struck side" },
  targetLabel: { tr: "Hedef — acıyan taraf", en: "The target — the hurting side" },
  dollKanji: "藁人形",
  targetKanji: "呪霊",
  strikeVerb: { tr: "çivi çak", en: "drive a nail" },
  pullVerb: { tr: "çiviyi sök", en: "pull the nail" },
  linkButton: { tr: "Bağı kur — parçayı bebeğe koy", en: "Make the link — place the fragment" },
  linkedTag: { tr: "Bağ kuruldu", en: "Link established" },
  unlinkedTag: { tr: "Bağ yok", en: "No link" },
  hairpinButton: { tr: "Simetriyi boz — çivileri patlat (簪)", en: "Break the symmetry — detonate the nails (簪)" },
  resetButton: { tr: "Tezgâhı topla", en: "Clear the bench" },
  nailsLabel: { tr: "Çakılan çivi", en: "Nails driven" },
  statusIdle: {
    tr: "Tezgâh boş. Bebekteki bir noktaya çivi çakabilirsin.",
    en: "The bench is empty. You can drive a nail into any point on the doll.",
  },
  statusUnlinked: {
    tr: "Çivi samana girdi. Bağ kurulmadığı için karşı taraf hiçbir şey hissetmiyor — teknik burada duruyor.",
    en: "The nail went into straw. With no link, the other side feels nothing — the technique stops here.",
  },
  statusLinked: {
    tr: "Bağ kuruldu. Bebeğe inen her çivi artık karşı tarafta çıkıyor.",
    en: "The link is made. Every nail that lands on the doll now surfaces on the other side.",
  },
  statusStruck: {
    tr: "Çivi bebeğe girdi ve aynı nokta karşı tarafta açıldı.",
    en: "The nail entered the doll and the same point opened on the other side.",
  },
  statusPulled: {
    tr: "Çivi söküldü; karşı taraftaki iz de kapandı.",
    en: "The nail was pulled; the mark on the other side closed with it.",
  },
  statusHairpin: {
    tr: "İçerideki çivilerin hepsi aynı anda patladı. Hasar dışarıdan değil içeriden geldi.",
    en: "Every nail inside went off at once. The damage came from within, not from without.",
  },
  hairpinNote: {
    tr: "Simetri bozulduğunda sayfanın kuralı da bozuluyor: soldaki bebek boşalıyor, sağdaki iz kalıyor.",
    en: "When the symmetry breaks, so does the page's rule: the doll on the left empties, the mark on the right stays.",
  },
  keyboardHint: {
    tr: "Bebekteki her nokta bir düğme; sekmeyle gez, boşluk ya da enter ile çak. Aynı noktaya tekrar basmak çiviyi söker.",
    en: "Every point on the doll is a button; tab through them and drive with space or enter. Pressing the same point again pulls the nail.",
  },
} as const;

/* ── Beş durak ──────────────────────────────────────────────────────────── */

export interface NobaraFate {
  key: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: LocalizedText };
  kin?: { characterId: number; name: string; role: LocalizedText };
  imageKey: string;
}

export const NOBARA_TIMELINE: NobaraFate[] = [
  {
    key: "village",
    age: { tr: "çocukluk", en: "childhood" },
    title: { tr: "Kalınmayacak kasaba", en: "The town no one stays in" },
    text: {
      tr: "Küçük bir kasabada, herkesin herkesi izlediği bir yerde büyüdü. Şehirden gelip bir süre kalan ve sonra dönüp giden bir kız gördü; kasabanın o kıza yaptığı şey Nobara'nın oradan çıkma kararını kesinleştirdi. Sevdiği şeyleri savunmayı da orada öğrendi.",
      en: "She grew up in a small town where everyone watched everyone. She saw a girl arrive from the city, stay a while, and go back; what the town did to that girl settled Nobara's decision to leave. She also learned there to defend the things she liked.",
    },
    imageKey: NOBARA_IMAGE_KEYS.fateVillage,
  },
  {
    key: "tokyo",
    age: { tr: "16 yaş · nisan", en: "age 16 · April" },
    title: { tr: "Kendini tanıtma", en: "The introduction" },
    text: {
      tr: "Tokyo Jujutsu Lisesi'ne geldiği gün iki sınıf arkadaşıyla tanıştı ve ilk cümlesi bir selam değil bir sıralama oldu. Kaba görünen bu giriş bir poz değildi: Nobara ne olduğunu baştan söyleyip sonra sözünü tutan bir insan.",
      en: "The day she arrived at Tokyo Jujutsu High she met two classmates, and her first sentence was not a greeting but a ranking. The rudeness was not a pose: Nobara is someone who states what she is up front and then keeps her word.",
    },
    kin: {
      characterId: 127212,
      name: "Yuuji Itadori",
      role: { tr: "Sınıf arkadaşı", en: "Classmate" },
    },
    imageKey: NOBARA_IMAGE_KEYS.fateTokyo,
  },
  {
    key: "kyoto",
    age: { tr: "16 yaş · sonbahar", en: "age 16 · autumn" },
    title: { tr: "Küçültülmeyi reddetmek", en: "Refusing to be made small" },
    text: {
      tr: "Kyoto'yla yapılan okullar arası karşılaşmada karşısına çıkan şey yalnızca bir rakip değildi: ona nasıl bir kız olması gerektiğini söyleyen bir ses de vardı. Nobara ikisine de aynı cevabı verdi ve bu, sayfadaki en net karakter anı oldu.",
      en: "At the inter-school event against Kyoto, what faced her was not only an opponent: there was also a voice telling her what kind of girl she ought to be. Nobara gave both the same answer, and it became the clearest moment of character on this page.",
    },
    quote: {
      text: { tr: "私は釘崎野薔薇だ", en: "私は釘崎野薔薇だ" },
      by: {
        tr: "Nobara — kendini tanıtırken",
        en: "Nobara — introducing herself",
      },
    },
    imageKey: NOBARA_IMAGE_KEYS.fateKyoto,
  },
  {
    key: "flash",
    age: { tr: "16 yaş · kış", en: "age 16 · winter" },
    title: { tr: "Kara şimşek", en: "The black flash" },
    text: {
      tr: "Yanında dövüşen sınıf arkadaşıyla birlikte, kimsenin isteyerek yapamadığı vuruşu indirdi. Kara şimşek bir teknik değil bir isabet; bir kez olması bile bir büyücünün kendi tavanını görmesi demek. Nobara o vuruştan sonra kendi ölçüsünü biliyordu.",
      en: "Fighting beside her classmate, she landed the strike no one can produce on purpose. The black flash is not a technique but an accuracy; landing one even once means a sorcerer has seen their own ceiling. After that strike Nobara knew her own measure.",
    },
    imageKey: NOBARA_IMAGE_KEYS.fateFlash,
  },
  {
    key: "shibuya",
    age: { tr: "16 yaş · Shibuya", en: "age 16 · Shibuya" },
    title: { tr: "Açık bırakılan son", en: "An ending left open" },
    text: {
      tr: "Shibuya'da ruhun kendisine dokunabilen bir laneti karşısında buldu — yani tekniğinin ulaşamadığı tek yere vurabilen birini. Sahnenin sonucu hikâyede uzun süre AÇIKTA bırakıldı; arşiv de öyle bırakıyor. Kesin olan tek şey son cümlesinin bir şikâyet olmadığı.",
      en: "At Shibuya she came up against a curse that could touch the soul itself — someone able to strike the one place her technique could not reach. The outcome of that scene was left OPEN in the story for a long time; the archive leaves it open too. The one certainty is that her last sentence was not a complaint.",
    },
    quote: {
      text: { tr: "悪くないじゃん、私の人生", en: "悪くないじゃん、私の人生" },
      by: {
        tr: "Nobara — Shibuya'daki son sahnesinde",
        en: "Nobara — in her last scene at Shibuya",
      },
    },
    kin: {
      characterId: 133702,
      name: "Mahito",
      role: { tr: "Karşısındaki lanet", en: "The curse she faced" },
    },
    imageKey: NOBARA_IMAGE_KEYS.fateShibuya,
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const NOBARA_CLOSING = {
  quotes: [
    {
      text: { tr: "私は釘崎野薔薇だ", en: "私は釘崎野薔薇だ" },
      reading: {
        tr: "Ben Nobara Kugisaki'yim.",
        en: "I am Nobara Kugisaki.",
      },
      by: { tr: "Nobara Kugisaki", en: "Nobara Kugisaki" },
      note: {
        tr: "Kendini tanıtırken — bir açıklama değil, tartışmanın kapatılması.",
        en: "Introducing herself — not an explanation but the closing of an argument.",
      },
    },
    {
      text: { tr: "悪くないじゃん、私の人生", en: "悪くないじゃん、私の人生" },
      reading: {
        tr: "Fena değilmiş, benim hayatım.",
        en: "Not bad at all, this life of mine.",
      },
      by: { tr: "Nobara Kugisaki", en: "Nobara Kugisaki" },
      note: {
        tr: "Shibuya'daki son sahnesinde. On altı yılın kapanış cümlesi bir pişmanlık değil.",
        en: "In her last scene at Shibuya. Sixteen years closed on something other than regret.",
      },
    },
  ],
  motto: "共鳴り",
  mottoNote: {
    tr: "Kyōmei — «birlikte titremek». Adı bir vuruşu değil bir BAĞI anlatıyor: iki şey aynı anda titreşiyorsa aralarındaki mesafenin bir önemi yok.",
    en: "Kyōmei — “to ring together”. The name describes not a blow but a LINK: if two things vibrate at once, the distance between them stops mattering.",
  },
  credit: {
    tr: "Künye, portre ve doğum bilgileri AniList'ten:",
    en: "Dossier, portrait and birth data from AniList:",
  },
  creditLink: {
    tr: "AniList · Nobara Kugisaki #133700",
    en: "AniList · Nobara Kugisaki #133700",
  },
} as const;
