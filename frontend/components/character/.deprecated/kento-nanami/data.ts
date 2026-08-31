import type { LocalizedText } from "./types";

/**
 * Kento Nanami — "Yedi Üçe" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 133704 kaydının ABILITY yuvaları,
 * `nan:*` anahtarlarıyla.
 *
 * ⚠️ 25 Ağustos 2026 itibarıyla JJK kadrosunun hiçbirinin veritabanımızda
 * görseli YOK. Sayfanın kalbi (ölçüm tezgâhı) elle çizilmiş SVG ve hiçbir
 * görsele bağlı değil.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (3 Temmuz), yaş (27), boy (184 cm), derece (1. sınıf büyücü),
 * meslek (büyücü), bağlı olduğu yer (Jujutsu Lisesi) ve teknik satırı
 * (Ratio) AniList künyesinden birebir alındı (karakter 133704, 25 Ağustos
 * 2026). Aynı kayıttaki takma adlar da oradan: "Nanamin" ve "7:3 Sorcerer".
 *
 * ⚠️ DOĞUM YILI YOK. AniList kaydında `dateOfBirth.year` boş (yalnızca gün
 * ve ay var). Künye şeridinde de yıl yazılmadı — yaş ile doğum yılından bir
 * tarih TÜRETİLMEDİ, çünkü hikâyenin "şimdi"si tek bir yıla sabit değil.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada iki replik tırnak içinde: 「労働はクソだ」 (çalışma hakkındaki
 * meşhur cümlesi) ve 「あとは頼みます」 (Shibuya'daki son sözü). İkisi de
 * kaynağıyla anılıyor; emin olunmayan hiçbir cümle tırnağa alınmadı.
 *
 * ── TERMİNOLOJİ ──────────────────────────────────────────────────────────
 * 十劃呪法 (Jukkaku Jubō — Oran Tekniği), 時間外労働 (Jikangai Rōdō — mesai
 * dışı çalışma), 縛り (shibari — bağlayıcı yemin), 呪具 (jugu — lanetli
 * alet), 黒閃 (kokusen — kara şimşek). Türkçeleri arşivin kendi karşılıkları.
 */

export const NANAMI_ID = 133704;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const NANAMI_SITE_URL = "https://anilist.co/character/133704";

/**
 * Sergi görselleri — hepsi characterId 133704 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `nan:` önekli (kurator modu şartı).
 */
export const NANAMI_IMAGE_KEYS = {
  hero: "nan:hero",
  ratio: "nan:jukkaku",
  overtime: "nan:jikangai",
  blade: "nan:donto",
  smallVow: "nan:shibari",
  smallTool: "nan:jugu",
  smallOffice: "nan:kaishain",
  smallStudent: "nan:deshi",
  fateSchool: "nan:fate-school",
  fateQuit: "nan:fate-quit",
  fateReturn: "nan:fate-return",
  fateJunpei: "nan:fate-junpei",
  fateShibuya: "nan:fate-shibuya",
  closing: "nan:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const NANAMI_SLOT_LABELS: Record<string, LocalizedText> = {
  [NANAMI_IMAGE_KEYS.hero]: {
    tr: "Hero — takım elbise, gözlük, elde satır; sakin duruş (16:9)",
    en: "Hero — suit, tinted glasses, cleaver in hand; a still stance (16:9)",
  },
  [NANAMI_IMAGE_KEYS.ratio]: {
    tr: "Jukkaku — hedefin üstünde beliren bölme çizgisi",
    en: "Ratio — the division line appearing across the target",
  },
  [NANAMI_IMAGE_KEYS.overtime]: {
    tr: "Mesai dışı — saat geçtikten sonraki ilk vuruş",
    en: "Overtime — the first strike after the hour has passed",
  },
  [NANAMI_IMAGE_KEYS.blade]: {
    tr: "Kör satır — keskin olmayan ağız, yakın çekim",
    en: "The blunt cleaver — the unsharpened edge, close crop",
  },
  [NANAMI_IMAGE_KEYS.smallVow]: {
    tr: "Bağlayıcı yemin — sözün verildiği an",
    en: "Binding vow — the moment the terms are set",
  },
  [NANAMI_IMAGE_KEYS.smallTool]: {
    tr: "Lanetli alet — kılıfından çıkarken",
    en: "The cursed tool — leaving its sheath",
  },
  [NANAMI_IMAGE_KEYS.smallOffice]: {
    tr: "Ofis yılları — masa, kravat, floresan ışık",
    en: "The office years — a desk, a tie, fluorescent light",
  },
  [NANAMI_IMAGE_KEYS.smallStudent]: {
    tr: "Çırağıyla — iki figür, konuşma anı",
    en: "With his student — two figures, mid-conversation",
  },
  [NANAMI_IMAGE_KEYS.fateSchool]: {
    tr: "Okul yılları — üniformalı iki öğrenci",
    en: "The school years — two students in uniform",
  },
  [NANAMI_IMAGE_KEYS.fateQuit]: {
    tr: "Bırakış — sırtı dönük figür, kapı",
    en: "The exit — a figure with his back turned, a door",
  },
  [NANAMI_IMAGE_KEYS.fateReturn]: {
    tr: "Dönüş — takım elbise ve satır bir arada",
    en: "The return — the suit and the cleaver together",
  },
  [NANAMI_IMAGE_KEYS.fateJunpei]: {
    tr: "Junpei olayı — sinema salonu, iki kişi",
    en: "The Junpei case — a cinema, two people",
  },
  [NANAMI_IMAGE_KEYS.fateShibuya]: {
    tr: "Shibuya — metro koridoru, duman",
    en: "Shibuya — a station corridor, smoke",
  },
  [NANAMI_IMAGE_KEYS.closing]: {
    tr: "Kapanış — deniz kenarı, boş sahil, düşük kontrast",
    en: "Closing — a shoreline, an empty beach, low contrast",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const NANAMI_IDENTITY = {
  name: "Kento Nanami",
  nativeName: "七海建人",
  /** Hero filigranı — dekoratif (aria-hidden): 七三 = yedi üç */
  watermark: "七三",
  house: {
    tr: "Tokyo Jujutsu Lisesi mezunu · 1. sınıf büyücü",
    en: "Tokyo Jujutsu High alumnus · Grade 1 sorcerer",
  },
  epigraph: {
    tr: "Her şeyin bir zayıf noktası var ve o nokta her zaman aynı yerde: yedinin üçe düştüğü yerde.",
    en: "Everything has a weak point, and it is always in the same place: where the seven falls to the three.",
  },
  facts: [
    {
      label: { tr: "Doğum günü", en: "Birthday" },
      value: { tr: "3 Temmuz", en: "3 July" },
    },
    { label: { tr: "Yaş", en: "Age" }, value: { tr: "27", en: "27" } },
    { label: { tr: "Boy", en: "Height" }, value: { tr: "184 cm", en: "184 cm" } },
    {
      label: { tr: "Derece", en: "Grade" },
      value: { tr: "1. sınıf büyücü", en: "Grade 1 sorcerer" },
    },
    {
      label: { tr: "Teknik", en: "Cursed technique" },
      value: { tr: "Oran (十劃呪法)", en: "Ratio (十劃呪法)" },
    },
    {
      label: { tr: "Takma adları", en: "Also known as" },
      value: { tr: "Nanamin · 7:3 büyücüsü", en: "Nanamin · the 7:3 sorcerer" },
    },
  ],
} as const;

export const NANAMI_MISSING_NOTE: LocalizedText = {
  tr: "Doğum YILI künyede boş — yalnızca gün ve ay kayıtlı. Yaşla birleştirip bir yıl TÜRETİLMEDİ; kan grubu da kayıtta yok.",
  en: "The birth YEAR is blank in the record — only day and month are logged. No year has been DERIVED by combining it with the age; blood type is absent too.",
};

/* ── Mod düğmesi: mesai ─────────────────────────────────────────────────── */

export const NANAMI_OVERTIME_TEXT = {
  enter: { tr: "Mesaiyi bitir", en: "End the working day" },
  exit: { tr: "Mesaiye dön", en: "Back on the clock" },
  hint: {
    tr: "Saat geçti: oran çizgileri serbest kaldı, sayfaya deniz rengi indi.",
    en: "The hour has passed: the ratio lines have let go and the sea colour has come over the page.",
  },
  clockOn: "09:00 — 18:00",
  clockOff: "18:00 —",
  clockLabel: { tr: "Mesai", en: "Hours" },
} as const;

export const NANAMI_HERO = {
  lede: {
    tr: "Nanami'nin tekniği bir güç değil bir ÖLÇÜ. Gördüğü her şeyi yediye üç böler ve o bölme çizgisinin düştüğü yer, o şeyin en zayıf noktasıdır. Vuruş oraya iniyor. Karşılığında hiçbir gösteri yok: satır kör, hamle sade, sonuç kesin. Bu sayfanın düzeni de aynı oranı taşıyor — mesai bitene kadar her çizgi yedide kırılıyor.",
    en: "Nanami's technique is not a force but a MEASURE. It divides everything he sees seven to three, and where that division line falls is that thing's weakest point. The blow lands there. In return there is no display: the cleaver is blunt, the move is plain, the result is certain. This page carries the same ratio — until the working day ends, every line breaks at the seven.",
  },
  portraitAlt: {
    tr: "Kento Nanami — arşivin yüklediği portre",
    en: "Kento Nanami — portrait uploaded by the archive",
  },
  portraitAltFallback: {
    tr: "Kento Nanami — AniList künye portresi",
    en: "Kento Nanami — AniList dossier portrait",
  },
  ruleCaption: {
    tr: "Sayfadaki her çizgi yüzde yetmişte kırılıyor. Mesai bittiğinde kırılmayı bırakıyor.",
    en: "Every line on this page breaks at seventy percent. When the working day ends, it stops breaking.",
  },
} as const;

export const NANAMI_ALT = {
  companionSuffix: { tr: "portresi", en: "portrait" },
} as const;

export const NANAMI_CRUMB = {
  series: { tr: "Jujutsu Kaisen", en: "Jujutsu Kaisen" },
} as const;

export const NANAMI_SECTIONS = {
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
      tr: "Bir ölçü, bir saat ve keskin olmayan bir ağız.",
      en: "A measure, a clock, and an edge that is not sharp.",
    },
  },
  tools: {
    title: { tr: "Dört ayrıntı", en: "Four details" },
    lede: {
      tr: "Yemin, alet, geçmiş meslek ve devraldığı çırak.",
      en: "The vow, the tool, the former career, and the student he took on.",
    },
  },
  bench: {
    title: { tr: "Ölçüm tezgâhı", en: "The measuring bench" },
    lede: {
      tr: "Önce zayıf noktayı TAHMİN et, sonra ölç. Hedef ne olursa olsun çizgi hep aynı yere düşüyor.",
      en: "First GUESS the weak point, then measure. Whatever the target, the line always falls in the same place.",
    },
  },
  fate: {
    title: { tr: "Beş durak", en: "Five stops" },
    lede: {
      tr: "İşi bıraktı, geri döndü ve gerekçesini hiçbir zaman süslemedi.",
      en: "He quit the work, came back, and never once dressed up his reason.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "Son cümlesi bir veda değil, bir devirdi.",
      en: "His last sentence was not a farewell but a handover.",
    },
  },
} as const;

/* ── Üç sütun ───────────────────────────────────────────────────────────── */

export interface NanamiArt {
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

export const NANAMI_ARTS: NanamiArt[] = [
  {
    key: "ratio",
    name: "Jukkaku Jubō",
    kanji: "十劃呪法",
    reading: "じっかくじゅほう",
    turkish: { tr: "Oran Tekniği", en: "Ratio Technique" },
    tagline: {
      tr: "Gördüğü her şeyi yediye üç böler.",
      en: "It divides everything he sees seven to three.",
    },
    text: {
      tr: "Teknik hasar üretmiyor, hedef üzerinde bir çizgi belirliyor: uzunluğu yüzde yetmişe yüzde otuz bölen nokta. O nokta hedefin zayıf yeri oluyor ve oraya inen vuruş, aynı vuruşun başka bir yere inmesinden kat kat daha ağır. Yani Nanami'nin gücü kolundan değil, nereye vuracağını bilmesinden geliyor.",
      en: "The technique produces no damage; it marks a line on the target: the point that splits its length seventy to thirty. That point becomes the target's weak spot, and a blow landing there is worth many times the same blow landing anywhere else. Nanami's power comes not from his arm but from knowing where to put it.",
    },
    traits: [
      { tr: "Hasar üretmez", en: "Produces no damage" },
      { tr: "Her hedefte çalışır", en: "Works on any target" },
      { tr: "Ölçü sabit", en: "The measure is fixed" },
    ],
    imageKey: NANAMI_IMAGE_KEYS.ratio,
  },
  {
    key: "overtime",
    name: "Jikangai Rōdō",
    kanji: "時間外労働",
    reading: "じかんがいろうどう",
    turkish: { tr: "Mesai Dışı Çalışma", en: "Overtime" },
    tagline: {
      tr: "Saatin ötesinde ödenen bir fazla mesai.",
      en: "Extra hours, paid past the clock.",
    },
    text: {
      tr: "Nanami kendi kendine bir bağlayıcı yemin ediyor: mesai saatleri içinde belli bir sınırın üstüne çıkmayacak. Karşılığında saat geçtikten SONRA lanet enerjisi ölçülü bir miktarda artıyor. Kendi disiplinini bir kısıtlama olarak yazıp faizini akşam tahsil eden bir hesap — tekniğin kendisi kadar karaktere ait bir çözüm.",
      en: "Nanami makes a binding vow with himself: within working hours he will not exceed a set limit. In exchange, AFTER the hour has passed, his cursed energy rises by a measured amount. An account that writes his own discipline down as a restriction and collects the interest in the evening — a solution as characteristic as the technique itself.",
    },
    traits: [
      { tr: "Kendi kendine yemin", en: "A vow with himself" },
      { tr: "Saate bağlı", en: "Bound to the clock" },
      { tr: "Ölçülü artış", en: "A measured increase" },
    ],
    imageKey: NANAMI_IMAGE_KEYS.overtime,
  },
  {
    key: "blade",
    name: "Dontō",
    kanji: "鈍刀",
    reading: "どんとう",
    turkish: { tr: "Kör Satır", en: "The Blunt Cleaver" },
    tagline: {
      tr: "Keskin olmayan bir ağzın işe yaraması.",
      en: "An edge that is not sharp, and works anyway.",
    },
    text: {
      tr: "Taşıdığı lanetli alet bilerek körleştirilmiş bir satır. Keskinlik gerekmiyor çünkü isabet zaten garantili: doğru noktaya inen kör bir ağız, yanlış noktaya inen keskin bir ağızdan daha çok iş görüyor. Aletin sadeliği Nanami'nin bütün üslubunun özeti — gösteri yok, yalnızca yapılan iş var.",
      en: "The cursed tool he carries is a deliberately blunted cleaver. Sharpness is unnecessary because the hit is already guaranteed: a blunt edge on the right point does more work than a keen edge on the wrong one. The plainness of the tool sums up his whole manner — no display, only the job done.",
    },
    traits: [
      { tr: "Bilerek kör", en: "Blunt on purpose" },
      { tr: "Lanetli alet", en: "A cursed tool" },
      { tr: "İsabet keskinliğin yerine", en: "Accuracy instead of an edge" },
    ],
    imageKey: NANAMI_IMAGE_KEYS.blade,
  },
];

/* ── Dört ayrıntı ───────────────────────────────────────────────────────── */

export interface NanamiDetail {
  key: string;
  name: LocalizedText;
  kanji: string;
  note: LocalizedText;
  imageKey: string;
}

export const NANAMI_DETAILS: NanamiDetail[] = [
  {
    key: "vow",
    name: { tr: "Bağlayıcı yemin", en: "Binding vow" },
    kanji: "縛り",
    note: {
      tr: "Kendine bir kısıtlama koyup karşılığında güç almak. Kural katı: söz tutulmazsa kazanılan da gider. Nanami'nin mesai yemini bunun en düzenli örneği — bir kural değil, bir sözleşme.",
      en: "Placing a restriction on yourself and taking power in return. The rule is strict: break the terms and the gain goes with them. Nanami's working-hours vow is its tidiest example — not a rule but a contract.",
    },
    imageKey: NANAMI_IMAGE_KEYS.smallVow,
  },
  {
    key: "tool",
    name: { tr: "Lanetli alet", en: "Cursed tool" },
    kanji: "呪具",
    note: {
      tr: "Lanet enerjisi taşıyan silah. Büyücü olmayan biri bile böyle bir aletle laneti kesebiliyor; Nanami'nin elinde ise alet tekniği taşıyan bir kol uzantısına dönüşüyor.",
      en: "A weapon that carries cursed energy. Even a non-sorcerer can cut a curse with one; in Nanami's hand the tool becomes an extension of the arm that carries the technique.",
    },
    imageKey: NANAMI_IMAGE_KEYS.smallTool,
  },
  {
    key: "office",
    name: { tr: "Şirket yılları", en: "The company years" },
    kanji: "会社員",
    note: {
      tr: "Okuldan sonra jujutsu dünyasını bırakıp bir şirkete girdi ve dört yıl orada çalıştı. Geri dönüşünün sebebi bir aydınlanma değil bir karşılaştırma oldu: iki işin de berbat olduğunu görüp daha az berbat olanı seçti.",
      en: "After school he left the jujutsu world for a company and worked there for four years. What brought him back was not an epiphany but a comparison: he saw both jobs were awful and picked the less awful one.",
    },
    imageKey: NANAMI_IMAGE_KEYS.smallOffice,
  },
  {
    key: "student",
    name: { tr: "Devraldığı çırak", en: "The student he took on" },
    kanji: "弟子",
    note: {
      tr: "Gojō'nun tam tersi bir öğretmen: şaka yok, teşvik yok, gereksiz cümle yok. Öğrettiği tek şey işin nasıl yapıldığı ve ne zaman bırakılması gerektiği. Çırağına verdiği en büyük şey de bir teknik değil, bir sorumluluk devri oldu.",
      en: "A teacher who is Gojō's exact opposite: no jokes, no encouragement, no unnecessary sentences. The only things he taught were how the job is done and when to walk away from it. What he ultimately gave his student was not a technique but a transfer of responsibility.",
    },
    imageKey: NANAMI_IMAGE_KEYS.smallStudent,
  },
];

/* ── Ölçüm tezgâhı: sayfanın kalbi ──────────────────────────────────────── */

/**
 * Hedefler. Uzunlukları BİLEREK farklı: mekaniğin göstermek istediği şey
 * tam olarak bu — hedef değişse de bölme noktası hep yüzde yetmişte.
 */
export interface NanamiTarget {
  key: string;
  kanji: string;
  name: LocalizedText;
  /** Ekranda çubuğun kaplayacağı genişlik yüzdesi — oranla İLGİSİ YOK */
  span: number;
  size: LocalizedText;
  note: LocalizedText;
}

export const NANAMI_TARGETS: NanamiTarget[] = [
  {
    key: "curse",
    kanji: "呪霊",
    name: { tr: "Sıradan lanet", en: "An ordinary curse" },
    span: 62,
    size: { tr: "2. sınıf · orta boy", en: "Grade 2 · mid-sized" },
    note: {
      tr: "Günlük iş. Çizgi belirdiği anda dövüş bitiyor; geri kalan yalnızca kol hareketidir.",
      en: "Routine work. The moment the line appears the fight is over; the rest is just arm movement.",
    },
  },
  {
    key: "special",
    kanji: "特級",
    name: { tr: "Özel sınıf lanet", en: "A special grade curse" },
    span: 100,
    size: { tr: "özel sınıf · en büyük hedef", en: "special grade · the largest target" },
    note: {
      tr: "Hedef büyüdükçe zayıf nokta da büyüyor, ama YERİ değişmiyor. Nanami'nin sınıf farkını kapatma yöntemi bu.",
      en: "As the target grows the weak point grows with it, but its PLACE does not move. This is how Nanami closes a gap in grade.",
    },
  },
  {
    key: "wall",
    kanji: "壁",
    name: { tr: "Beton duvar", en: "A concrete wall" },
    span: 84,
    size: { tr: "cansız · yapı elemanı", en: "inanimate · structural" },
    note: {
      tr: "Teknik canlı-cansız ayırmıyor. Bir duvarın da yedide üçe düşen bir noktası var ve satır oraya iniyor.",
      en: "The technique does not distinguish living from dead. A wall too has a point where seven falls to three, and the cleaver lands there.",
    },
  },
  {
    key: "small",
    kanji: "小",
    name: { tr: "Küçük hedef", en: "A small target" },
    span: 40,
    size: { tr: "avuç içi · en küçük hedef", en: "palm-sized · the smallest target" },
    note: {
      tr: "Küçüldükçe pay da küçülüyor; hata payı daralıyor ama oran aynı kalıyor. Tekniğin ölçeği yok.",
      en: "As it shrinks so does the margin; the room for error narrows but the ratio holds. The technique has no scale.",
    },
  },
];

export const NANAMI_BENCH_UI = {
  stageLabel: {
    tr: "Ölçüm tezgâhı — hedefin üstündeki tahmin ve gerçek nokta",
    en: "The measuring bench — the guess and the true point on the target",
  },
  targetLabel: { tr: "Hedef", en: "Target" },
  guessLabel: { tr: "Tahminin", en: "Your guess" },
  guessHelp: {
    tr: "Zayıf noktanın hedefin yüzde kaçında olduğunu tahmin et.",
    en: "Guess what percentage along the target the weak point sits.",
  },
  measureButton: { tr: "Ölç", en: "Measure" },
  cutButton: { tr: "İndir", en: "Bring it down" },
  resetButton: { tr: "Tezgâhı sıfırla", en: "Reset the bench" },
  trueLabel: { tr: "Gerçek nokta", en: "True point" },
  errorLabel: { tr: "Sapma", en: "Deviation" },
  ratioLabel: { tr: "Oran", en: "Ratio" },
  ratioValue: "7 : 3",
  statusIdle: {
    tr: "Bir hedef seç ve zayıf noktayı tahmin et. Ölçmeden önce çizgi görünmüyor.",
    en: "Pick a target and guess the weak point. The line stays invisible until you measure.",
  },
  statusMeasured: {
    tr: "Ölçüldü. Nokta hedefin yüzde yetmişinde — tahminin ne olursa olsun, hedef ne olursa olsun.",
    en: "Measured. The point sits at seventy percent of the target — whatever you guessed, whatever the target.",
  },
  statusCut: {
    tr: "Satır çizginin üstüne indi. Hedef yediye üç ayrıldı.",
    en: "The cleaver came down on the line. The target split seven to three.",
  },
  statusExact: {
    tr: "Tahminin tam üstüne düştü. Nanami bunu bir yetenek değil, bir alışkanlık sayardı.",
    en: "Your guess landed exactly on it. Nanami would call that a habit, not a talent.",
  },
  keyboardHint: {
    tr: "Tahmin kaydırıcısı ok tuşlarıyla, hedefler ve düğmeler sekmeyle geziliyor.",
    en: "The guess slider moves with the arrow keys; targets and buttons are reachable by tab.",
  },
} as const;

/* ── Beş durak ──────────────────────────────────────────────────────────── */

export interface NanamiFate {
  key: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: LocalizedText };
  kin?: { characterId: number; name: string; role: LocalizedText };
  imageKey: string;
}

export const NANAMI_TIMELINE: NanamiFate[] = [
  {
    key: "school",
    age: { tr: "okul yılları", en: "the school years" },
    title: { tr: "Kaybedilen sınıf arkadaşı", en: "The classmate who was lost" },
    text: {
      tr: "Tokyo Jujutsu Lisesi'nde okurken bir görevde sınıf arkadaşını kaybetti. Ölüm ona işin kendisini değil, işin yürütülme biçimini sorgulattı: hazırlıksız gönderilen bir öğrencinin ölmesi bir kaza değil, bir yönetim sonucuydu.",
      en: "While studying at Tokyo Jujutsu High he lost a classmate on a mission. The death made him question not the work itself but the way it was run: a student sent out unprepared dying is not an accident but an outcome of management.",
    },
    imageKey: NANAMI_IMAGE_KEYS.fateSchool,
  },
  {
    key: "quit",
    age: { tr: "mezuniyetten sonra", en: "after graduation" },
    title: { tr: "İşi bırakmak", en: "Quitting the job" },
    text: {
      tr: "Mezun olur olmaz jujutsu dünyasından çıktı ve bir şirkete girdi. Dört yıl kravat taktı, toplantıya girdi, rapor yazdı. Bu bir kaçış değil bir denemeydi: dünyanın başka bir yerinde başka bir hayatın mümkün olup olmadığını ölçtü.",
      en: "The moment he graduated he left the jujutsu world and joined a company. For four years he wore a tie, sat in meetings, wrote reports. It was not an escape but a trial: he was measuring whether another life was possible somewhere else.",
    },
    imageKey: NANAMI_IMAGE_KEYS.fateQuit,
  },
  {
    key: "return",
    age: { tr: "dört yıl sonra", en: "four years later" },
    title: { tr: "Daha az berbat olanı seçmek", en: "Choosing the less awful one" },
    text: {
      tr: "Geri döndü. Gerekçesini hiç süslemedi: iki işin de berbat olduğunu gördü ve daha az berbat olanı seçti. Bu cümle bir espri gibi duruyor ama sayfadaki en dürüst cümle — Nanami hiçbir zaman yaptığı işi yücelten biri olmadı.",
      en: "He came back. He never dressed the reason up: he saw that both jobs were awful and picked the less awful one. The sentence reads like a joke but it is the most honest line on this page — Nanami was never someone who ennobled his own work.",
    },
    quote: {
      text: { tr: "労働はクソだ", en: "労働はクソだ" },
      by: {
        tr: "Nanami — işi anlatırken",
        en: "Nanami — on the work",
      },
    },
    imageKey: NANAMI_IMAGE_KEYS.fateReturn,
  },
  {
    key: "junpei",
    age: { tr: "27 yaş", en: "age 27" },
    title: { tr: "Kurtarılamayan çocuk", en: "The boy who was not saved" },
    text: {
      tr: "Bir lanetin peşine düşerken bir liseliyle karşılaştı ve onu kurtarmaya çalıştı. Kurtaramadı. O olaydan sonra çırağına söylediği şey bir teselli değil bir yöntem oldu: elinden geleni yap, sonra geri kalanını taşımayı öğren.",
      en: "Tracking a curse he came across a high-schooler and tried to save him. He could not. What he told his student afterwards was not consolation but method: do what you can, then learn to carry the rest.",
    },
    kin: {
      characterId: 157214,
      name: "Junpei Yoshino",
      role: { tr: "Kurtarmaya çalıştığı çocuk", en: "The boy he tried to save" },
    },
    imageKey: NANAMI_IMAGE_KEYS.fateJunpei,
  },
  {
    key: "shibuya",
    age: { tr: "Shibuya", en: "Shibuya" },
    title: { tr: "Devir", en: "The handover" },
    text: {
      tr: "Shibuya'da mesai çoktan bitmişti ve Nanami sonuna kadar çalıştı. Son sahnesinde ne bir kahramanlık cümlesi kurdu ne de bir veda etti: yapılacak işin kalanını çırağına devretti. Sayfanın başındaki ölçü burada kapanıyor — bir hayat da yediye üç bölünüyor ve kalan üçü başkası taşıyor.",
      en: "At Shibuya the working day was long over, and Nanami worked to the end. In his last scene he made no heroic speech and said no goodbye: he handed the remainder of the job to his student. The measure from the top of this page closes here — a life too divides seven to three, and someone else carries the three.",
    },
    quote: {
      text: { tr: "あとは頼みます", en: "あとは頼みます" },
      by: {
        tr: "Nanami — Shibuya'daki son sözü",
        en: "Nanami — his last words at Shibuya",
      },
    },
    kin: {
      characterId: 127212,
      name: "Yuuji Itadori",
      role: { tr: "İşi devrettiği çırak", en: "The student he handed the job to" },
    },
    imageKey: NANAMI_IMAGE_KEYS.fateShibuya,
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const NANAMI_CLOSING = {
  quotes: [
    {
      text: { tr: "労働はクソだ", en: "労働はクソだ" },
      reading: {
        tr: "Çalışmak berbat bir şey.",
        en: "Labour is a miserable business.",
      },
      by: { tr: "Kento Nanami", en: "Kento Nanami" },
      note: {
        tr: "Şirketten döndükten sonra, işi anlatırken. Bir şikâyet değil bir tespit — ve buna rağmen işe gidiyor.",
        en: "After coming back from the company, describing the work. Not a complaint but an assessment — and he goes to work anyway.",
      },
    },
    {
      text: { tr: "あとは頼みます", en: "あとは頼みます" },
      reading: {
        tr: "Gerisini size bırakıyorum.",
        en: "The rest is in your hands.",
      },
      by: { tr: "Kento Nanami", en: "Kento Nanami" },
      note: {
        tr: "Shibuya'daki son sözü. Veda değil, iş devri.",
        en: "His last words at Shibuya. Not a farewell — a handover.",
      },
    },
  ],
  motto: "七三",
  mottoNote: {
    tr: "Shichisan — «yedi üç». Adı bir teknikten çok bir ALIŞKANLIK: Nanami dünyaya bakarken zaten bölüyor, teknik yalnızca gördüğünü onaylıyor.",
    en: "Shichisan — “seven three”. The name is less a technique than a HABIT: Nanami is already dividing as he looks at the world, and the technique only confirms what he sees.",
  },
  credit: {
    tr: "Künye, portre ve doğum bilgileri AniList'ten:",
    en: "Dossier, portrait and birth data from AniList:",
  },
  creditLink: {
    tr: "AniList · Kento Nanami #133704",
    en: "AniList · Kento Nanami #133704",
  },
} as const;
