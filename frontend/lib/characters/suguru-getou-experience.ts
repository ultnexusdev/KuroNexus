import type { LocalizedText } from "./types";

/**
 * Suguru Getō — "Yutulan" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 133699 kaydının ABILITY yuvaları,
 * `get:*` anahtarlarıyla.
 *
 * ⚠️ 25 Ağustos 2026 itibarıyla JJK kadrosunun hiçbirinin veritabanımızda
 * görseli YOK. Sayfanın kalbi (yutma haznesi) elle çizilmiş SVG ve hiçbir
 * görsele bağlı değil.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum (3 Şubat 1990), yaş (27), boy (183 cm), tür (insan), meslek
 * ("Curse User"), derece ("Special Grade Curse User") ve teknik satırı
 * ("Cursed Spirit Manipulation") AniList künyesinden birebir alındı
 * (karakter 133699, 25 Ağustos 2026). Kan grubu kayıtta BOŞ.
 *
 * ⚠️ MESLEK SATIRI BİR SEÇİMDİR. Künyede yazan "büyücü" değil "lanet
 * kullanıcısı" — yani kayıt onu okuldan atılmış hâliyle tanımlıyor. Sayfa
 * bunu düzeltmiyor: adam gerçekten o tarafa geçti ve künye o tarafı yazıyor.
 *
 * ── ANLATIM DİSİPLİNİ ────────────────────────────────────────────────────
 * Getō bir kötü karakter ve sayfa onu öyle anlatıyor. Kırılma noktası
 * (bir gecede yüzden fazla sivili öldürmesi) AniList künyesinin kendi
 * spoiler'lı paragrafında da geçiyor ve burada yumuşatılmadan yazıldı.
 * Ulaştığı sonuç arşivin sesiyle AÇIKÇA reddediliyor — anlamak ile onaylamak
 * arasındaki fark sayfada yazılı duruyor.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Uydurma diyalog yok. Tırnak içindeki iki şey de kaynağı kesin olan
 * metinler: 「猿」 (büyücü olmayanlar için kullandığı sözcük — karakterin
 * en çok anılan ve arşivin açıkça karşı çıktığı ifadesi) ve
 * 「極ノ番『うずまき』」 (en güçlü tekniğinin sesli çağrısı). Emin olunmayan
 * hiçbir cümle tırnağa alınmadı; kalan her şey arşivin kendi anlatımı.
 */

export const GETO_ID = 133699;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const GETO_SITE_URL = "https://anilist.co/character/133699";

/**
 * Sergi görselleri — hepsi characterId 133699 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `get:` önekli (kurator modu şartı).
 */
export const GETO_IMAGE_KEYS = {
  hero: "get:hero",
  manipulation: "get:sojutsu",
  uzumaki: "get:uzumaki",
  curseUser: "get:jusoshi",
  smallBall: "get:tama",
  smallWord: "get:kotoba",
  smallTwins: "get:futago",
  smallVessel: "get:seishotai",
  fateSchool: "get:fate-school",
  fateRiko: "get:fate-riko",
  fateCrack: "get:fate-crack",
  fateVillage: "get:fate-village",
  fateAfter: "get:fate-after",
  closing: "get:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const GETO_SLOT_LABELS: Record<string, LocalizedText> = {
  [GETO_IMAGE_KEYS.hero]: {
    tr: "Hero — kesa giyimli Getō, arkasında lanet siluetleri (16:9)",
    en: "Hero — Getō in the kesa, curse silhouettes behind him (16:9)",
  },
  [GETO_IMAGE_KEYS.manipulation]: {
    tr: "Juryō Sōjutsu — çevresinde duran laneti sürüsü",
    en: "Cursed Spirit Manipulation — the flock of curses around him",
  },
  [GETO_IMAGE_KEYS.uzumaki]: {
    tr: "Uzumaki — avuçta dönen kütle, tek kare",
    en: "Uzumaki — the mass spinning in his palm, a single frame",
  },
  [GETO_IMAGE_KEYS.curseUser]: {
    tr: "Lanet kullanıcısı — okuldan sonraki hâli, tapınak",
    en: "The curse user — after the school, a temple",
  },
  [GETO_IMAGE_KEYS.smallBall]: {
    tr: "Lanet küresi — parmaklarının arasında, yakın çekim",
    en: "The curse ball — between his fingers, close crop",
  },
  [GETO_IMAGE_KEYS.smallWord]: {
    tr: "Kalabalık — sıradan insanların olduğu bir sokak",
    en: "A crowd — a street of ordinary people",
  },
  [GETO_IMAGE_KEYS.smallTwins]: {
    tr: "İkizler — yanındaki iki çocuk",
    en: "The twins — the two children at his side",
  },
  [GETO_IMAGE_KEYS.smallVessel]: {
    tr: "Yıldız Kabı — koruma görevindeki kız",
    en: "The Star Plasma Vessel — the girl under escort",
  },
  [GETO_IMAGE_KEYS.fateSchool]: {
    tr: "Okul yılları — üniformalı üç öğrenci",
    en: "The school years — three students in uniform",
  },
  [GETO_IMAGE_KEYS.fateRiko]: {
    tr: "Görevin sonu — salon, alkışlayan kalabalık",
    en: "The end of the mission — a hall, an applauding crowd",
  },
  [GETO_IMAGE_KEYS.fateCrack]: {
    tr: "Çatlak — tek başına, gece, yağmur",
    en: "The crack — alone, at night, in rain",
  },
  [GETO_IMAGE_KEYS.fateVillage]: {
    tr: "Köy — sabah, boş sokak, sis",
    en: "The village — morning, an empty street, fog",
  },
  [GETO_IMAGE_KEYS.fateAfter]: {
    tr: "Sonrası — tapınak avlusu, müritler",
    en: "Afterwards — a temple courtyard, followers",
  },
  [GETO_IMAGE_KEYS.closing]: {
    tr: "Kapanış — boş bir tapınak koridoru, düşük kontrast",
    en: "Closing — an empty temple corridor, low contrast",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const GETO_IDENTITY = {
  name: "Suguru Getō",
  nativeName: "夏油傑",
  /** Hero filigranı — dekoratif (aria-hidden): 呪 = lanet */
  watermark: "呪",
  house: {
    tr: "Tokyo Jujutsu Lisesi'nden atıldı · lanet kullanıcısı",
    en: "Expelled from Tokyo Jujutsu High · curse user",
  },
  epigraph: {
    tr: "Bir laneti yok etmiyor, yutuyor. Sonra o lanet artık onun. Bu sayfanın anlattığı şey bir güç değil, bir alışkanlığın bir insanı nereye götürdüğü.",
    en: "He does not destroy a curse, he swallows it. Then that curse is his. What this page describes is not a power but where a habit took a man.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Born" },
      value: { tr: "3 Şubat 1990", en: "3 February 1990" },
    },
    { label: { tr: "Yaş", en: "Age" }, value: { tr: "27", en: "27" } },
    { label: { tr: "Boy", en: "Height" }, value: { tr: "183 cm", en: "183 cm" } },
    {
      label: { tr: "Derece", en: "Grade" },
      value: {
        tr: "Özel sınıf lanet kullanıcısı",
        en: "Special grade curse user",
      },
    },
    {
      label: { tr: "Teknik", en: "Cursed technique" },
      value: {
        tr: "Lanet Ruhu Kumandası",
        en: "Cursed Spirit Manipulation",
      },
    },
    {
      label: { tr: "Künyedeki sınıflandırma", en: "Dossier classification" },
      value: { tr: "Büyücü değil — lanet kullanıcısı", en: "Not a sorcerer — a curse user" },
    },
  ],
} as const;

export const GETO_MISSING_NOTE: LocalizedText = {
  tr: "Kan grubu künyede kayıtlı değil. Meslek satırı bilerek düzeltilmedi: kayıt onu okuldan atıldıktan SONRAKİ hâliyle tanımlıyor ve sayfa bu tanımı olduğu gibi taşıyor.",
  en: "Blood type is not recorded. The occupation line was deliberately left uncorrected: the record defines him by what he became AFTER the expulsion, and this page carries that definition as it stands.",
};

/* ── Mod düğmesi: rengin çekilmesi ──────────────────────────────────────── */

export const GETO_AFTER_TEXT = {
  enter: { tr: "Sonrasına geç", en: "Move to the after" },
  exit: { tr: "Öncesine dön", en: "Back to the before" },
  hint: {
    tr: "Renk sayfadan çekildi: geriye yalnızca yuttuğu şeyler renkli kaldı.",
    en: "The colour has drained from the page: only the things he swallowed are still coloured.",
  },
  beforeTag: { tr: "Okul yılları", en: "The school years" },
  afterTag: { tr: "Atıldıktan sonrası", en: "After the expulsion" },
} as const;

export const GETO_HERO = {
  lede: {
    tr: "Bir büyücünün laneti yok etme yolu onu dağıtmaktır. Getō'nun yolu farklı: laneti küçük bir küreye sıkıştırıp YUTUYOR ve o andan itibaren onu istediği zaman çağırabiliyor. Bu yüzden gücü kolunda değil, hafızasında birikiyor — ne kadar çok yutarsa o kadar kalabalık oluyor. Sayfanın kalbi de bu: al, biriktir, sonra hepsini tek seferde boşalt.",
    en: "A sorcerer's way of ending a curse is to disperse it. Getō's way is different: he compresses the curse into a small sphere and SWALLOWS it, and from that moment can call it up whenever he likes. His power therefore accumulates not in his arm but in his ledger — the more he takes in, the more crowded he becomes. That is this page's heart too: take, accumulate, then empty it all at once.",
  },
  portraitAlt: {
    tr: "Suguru Getō — arşivin yüklediği portre",
    en: "Suguru Getō — portrait uploaded by the archive",
  },
  portraitAltFallback: {
    tr: "Suguru Getō — AniList künye portresi",
    en: "Suguru Getō — AniList dossier portrait",
  },
  tasteCaption: {
    tr: "Yutulan her şeyin tadı aynı ve hiç değişmiyor: eski bir bezin sıkılmış suyu. Getō bunu bir kere anlatıyor ve bir daha şikâyet etmiyor.",
    en: "Everything swallowed tastes the same and never changes: the wrung-out water of an old rag. Getō describes it once and never complains again.",
  },
} as const;

export const GETO_ALT = {
  companionSuffix: { tr: "portresi", en: "portrait" },
} as const;

export const GETO_CRUMB = {
  series: { tr: "Jujutsu Kaisen", en: "Jujutsu Kaisen" },
} as const;

export const GETO_SECTIONS = {
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
      tr: "Bir teknik, onun en uç hâli ve seçtiği sınıflandırma.",
      en: "A technique, its furthest extent, and the classification he chose.",
    },
  },
  tools: {
    title: { tr: "Dört ayrıntı", en: "Four details" },
    lede: {
      tr: "Yutulan şeyin tadı, kullandığı sözcük, yanına aldığı iki çocuk ve onu kıran görev.",
      en: "The taste of the thing swallowed, the word he used, the two children he took in, and the mission that broke him.",
    },
  },
  vault: {
    title: { tr: "Yutma haznesi", en: "The swallowing vault" },
    lede: {
      tr: "Bir laneti yut ve hazneye insin. Yutulan geri verilmiyor — hazneyi boşaltmanın tek yolu hepsini birden harcamak.",
      en: "Swallow a curse and it drops into the vault. What goes in does not come back — the only way to empty the vault is to spend all of it at once.",
    },
  },
  fate: {
    title: { tr: "Beş durak", en: "Five stops" },
    lede: {
      tr: "Sorusu haklıydı, cevabı değildi. Sayfa ikisini birbirine karıştırmıyor.",
      en: "His question was fair; his answer was not. This page does not confuse the two.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "Yuttuğu şeylerin hiçbiri onu doyurmadı.",
      en: "Nothing he swallowed ever fed him.",
    },
  },
} as const;

/* ── Üç sütun ───────────────────────────────────────────────────────────── */

export interface GetoArt {
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

export const GETO_ARTS: GetoArt[] = [
  {
    key: "manipulation",
    name: "Juryō Sōjutsu",
    kanji: "呪霊操術",
    reading: "じゅれいそうじゅつ",
    turkish: { tr: "Lanet Ruhu Kumandası", en: "Cursed Spirit Manipulation" },
    tagline: {
      tr: "Yenilen laneti yok etmez, kadrosuna katar.",
      en: "A beaten curse is not destroyed but recruited.",
    },
    text: {
      tr: "Yenilmiş bir lanet küçük bir küreye sıkışıyor ve yutulduğu anda kullanıcının emrine giriyor. Bu tekniğin gücü tek bir dövüşte değil ZAMANDA birikiyor: on yıl çalışan bir kullanıcı on yıllık bir kadroya sahip oluyor. Getō'nun elindeki şey bir teknik değil, bir envanter.",
      en: "A defeated curse compresses into a small sphere and, the moment it is swallowed, enters the user's service. This technique's power accumulates not in a single fight but over TIME: a user who works for ten years owns ten years of roster. What Getō holds is not a technique but an inventory.",
    },
    traits: [
      { tr: "Zamanla birikir", en: "Accumulates over time" },
      { tr: "Yutmak şart", en: "Swallowing is required" },
      { tr: "Geri verilmez", en: "Nothing is given back" },
    ],
    imageKey: GETO_IMAGE_KEYS.manipulation,
  },
  {
    key: "uzumaki",
    name: "Kyoku no Ban «Uzumaki»",
    kanji: "極ノ番「うずまき」",
    reading: "きょくのばん・うずまき",
    turkish: { tr: "Uç Sıra — «Girdap»", en: "Maximum — “Uzumaki”" },
    tagline: {
      tr: "Elindeki her şeyi tek bir şeye çevirir.",
      en: "It turns everything he holds into one thing.",
    },
    text: {
      tr: "Yutulmuş bütün lanetleri aynı anda çağırıp tek bir kütlede eritmek. Ortaya çıkan şey artık ayrı ayrı yaratıklar değil, hepsinin toplamı olan bir girdap. Bedeli açık: bir kere kullanıldığında hazne boşalıyor ve yeniden dolması yıllar sürüyor. Getō'nun en güçlü hamlesi aynı zamanda en pahalı hamlesi.",
      en: "Calling every swallowed curse at once and melting them into a single mass. What appears is no longer separate creatures but a vortex that is the sum of them all. The price is plain: once used, the vault empties, and refilling it takes years. Getō's strongest move is also his most expensive one.",
    },
    traits: [
      { tr: "Hepsini harcar", en: "Spends everything" },
      { tr: "Hazneyi boşaltır", en: "Empties the vault" },
      { tr: "Yeniden dolması yıllar", en: "Years to refill" },
    ],
    imageKey: GETO_IMAGE_KEYS.uzumaki,
  },
  {
    key: "curseuser",
    name: "Jusoshi",
    kanji: "呪詛師",
    reading: "じゅそし",
    turkish: { tr: "Lanet Kullanıcısı", en: "Curse User" },
    tagline: {
      tr: "Bir teknik değil, bir sınıflandırma.",
      en: "Not a technique but a classification.",
    },
    text: {
      tr: "Jujutsu dünyası tekniğini insanlara karşı kullanan büyücüyü ayrı bir sınıfa koyuyor ve o sınıfın cezası infaz. Getō bu sınıfa düşmedi, bilerek geçti: okuldan atıldı, idam kararı çıkarıldı ve kendi cemaatini kurdu. Künyesinde «büyücü» yazmamasının sebebi bu — sayfadaki en önemli satır bir teknik değil, bir etiket.",
      en: "The jujutsu world places a sorcerer who turns their technique on people into a separate class, and that class carries an execution order. Getō did not fall into it; he walked across: expelled from the school, sentenced, and then founder of his own congregation. This is why his record does not say “sorcerer” — the most important line on this page is not a technique but a label.",
    },
    traits: [
      { tr: "İnfaz kararı", en: "Under an execution order" },
      { tr: "Kendi cemaati", en: "His own congregation" },
      { tr: "Seçilmiş taraf", en: "A chosen side" },
    ],
    imageKey: GETO_IMAGE_KEYS.curseUser,
  },
];

/* ── Dört ayrıntı ───────────────────────────────────────────────────────── */

export interface GetoDetail {
  key: string;
  name: LocalizedText;
  kanji: string;
  note: LocalizedText;
  imageKey: string;
}

export const GETO_DETAILS: GetoDetail[] = [
  {
    key: "ball",
    name: { tr: "Lanet küresi", en: "The curse ball" },
    kanji: "玉",
    note: {
      tr: "Yenilen lanetin sıkıştırılmış hâli: gri-yeşil, avuç içi kadar, ıslak. Yutmak zorunlu ve tadı hiç değişmiyor. Tekniğin en anlatılmayan tarafı budur — her kazanılan güç aynı iğrenç yudumdan geçiyor.",
      en: "The compressed form of a beaten curse: grey-green, palm-sized, wet. Swallowing it is mandatory and the taste never changes. This is the least-discussed part of the technique — every gained power passes through the same foul mouthful.",
    },
    imageKey: GETO_IMAGE_KEYS.smallBall,
  },
  {
    key: "word",
    name: { tr: "Kullandığı sözcük", en: "The word he used" },
    kanji: "猿",
    note: {
      tr: "Büyücü olmayan herkesi tek bir sözcükle andı: maymun. Bu, gerekçesinin çöktüğü noktadır — bir sorunu insanları insanlıktan çıkararak çözmek, o sorunu çözmez, yalnızca cinayeti kolaylaştırır. Arşiv bunu bir görüş olarak değil, karakterin kırılma anı olarak kaydediyor.",
      en: "He referred to everyone without a technique by a single word: monkeys. This is the point where his reasoning collapses — solving a problem by stripping people of their humanity does not solve it, it only makes killing them easier. The archive records this not as a viewpoint but as the character's breaking point.",
    },
    imageKey: GETO_IMAGE_KEYS.smallWord,
  },
  {
    key: "twins",
    name: { tr: "İki çocuk", en: "The two children" },
    kanji: "双子",
    note: {
      tr: "Bir köyde lanetli sayıldıkları için kafese kapatılmış iki kız çocuğunu alıp yanına aldı ve yıllarca büyüttü. Aynı adam. Sayfanın çözmediği ve çözmeye çalışmadığı çelişki tam olarak bu.",
      en: "He took in two girls a village had caged for being considered cursed, and raised them for years. The same man. This is exactly the contradiction the page does not resolve and does not try to.",
    },
    imageKey: GETO_IMAGE_KEYS.smallTwins,
  },
  {
    key: "vessel",
    name: { tr: "Kırılma görevi", en: "The mission that broke him" },
    kanji: "星漿体",
    note: {
      tr: "Sınıf arkadaşıyla birlikte bir kızı korumakla görevlendirildiler ve koruyamadılar. Kızın ölümünden sonra bir salon dolusu insanın alkışladığını gördü. Sorduğu soru o gün doğdu: korumakla yükümlü olduğu insanlar buysa bu iş neye yarıyor.",
      en: "He and his classmate were assigned to protect a girl and failed. After her death he watched a hall full of people applaud. The question was born that day: if these are the people he is obliged to protect, what is the work for.",
    },
    imageKey: GETO_IMAGE_KEYS.smallVessel,
  },
];

/* ── Yutma haznesi: sayfanın kalbi ──────────────────────────────────────── */

/**
 * Hazneye inecek lanetler. Ağırlıklar derecelerinden geliyor ve toplamı
 * 15; girdabın eşiği 8 — yani hazneyi doldurmadan da harcanabiliyor ama
 * yarısını geçmeden hiç harcanamıyor.
 */
export interface GetoCurse {
  key: string;
  kanji: string;
  grade: LocalizedText;
  weight: number;
  name: LocalizedText;
  origin: LocalizedText;
}

export const GETO_CURSES: GetoCurse[] = [
  {
    key: "c1",
    kanji: "四級",
    grade: { tr: "4. sınıf", en: "Grade 4" },
    weight: 1,
    name: { tr: "Koridor laneti", en: "The corridor curse" },
    origin: {
      tr: "Bir okul koridorunda yıllarca biriken küçük korkulardan doğdu.",
      en: "Born of small fears accumulated for years in a school corridor.",
    },
  },
  {
    key: "c2",
    kanji: "四級",
    grade: { tr: "4. sınıf", en: "Grade 4" },
    weight: 1,
    name: { tr: "Depo laneti", en: "The storeroom curse" },
    origin: {
      tr: "Kimsenin girmediği bir odada kendi kendine büyüdü.",
      en: "It grew by itself in a room nobody entered.",
    },
  },
  {
    key: "c3",
    kanji: "三級",
    grade: { tr: "3. sınıf", en: "Grade 3" },
    weight: 1,
    name: { tr: "Köprü altı", en: "Under the bridge" },
    origin: {
      tr: "Kalabalığın her gün üstünden geçtiği, kimsenin altına bakmadığı yerden.",
      en: "From the place a crowd crosses daily and no one looks beneath.",
    },
  },
  {
    key: "c4",
    kanji: "三級",
    grade: { tr: "3. sınıf", en: "Grade 3" },
    weight: 1,
    name: { tr: "Hastane katı", en: "The hospital floor" },
    origin: {
      tr: "Bekleme salonlarında biriken sabırsızlıktan ve çaresizlikten.",
      en: "Of the impatience and helplessness that pools in waiting rooms.",
    },
  },
  {
    key: "c5",
    kanji: "二級",
    grade: { tr: "2. sınıf", en: "Grade 2" },
    weight: 2,
    name: { tr: "Kapalı okul", en: "The closed school" },
    origin: {
      tr: "Boşaltılmış bir binada kalan bütün küçük zorbalıkların toplamı.",
      en: "The sum of every small cruelty left behind in an emptied building.",
    },
  },
  {
    key: "c6",
    kanji: "二級",
    grade: { tr: "2. sınıf", en: "Grade 2" },
    weight: 2,
    name: { tr: "Yol kenarı", en: "The roadside" },
    origin: {
      tr: "Aynı virajda tekrarlanan kazaların bıraktığı korkudan.",
      en: "Of the fear left by accidents repeating at the same bend.",
    },
  },
  {
    key: "c7",
    kanji: "一級",
    grade: { tr: "1. sınıf", en: "Grade 1" },
    weight: 3,
    name: { tr: "Mahalle", en: "The neighbourhood" },
    origin: {
      tr: "Bir mahallenin uzun yıllar boyunca birbirine duyduğu güvensizlikten.",
      en: "Of a neighbourhood's long-standing distrust of itself.",
    },
  },
  {
    key: "c8",
    kanji: "特級",
    grade: { tr: "Özel sınıf", en: "Special grade" },
    weight: 4,
    name: { tr: "Ölçülemeyen", en: "The unmeasured" },
    origin: {
      tr: "Kaynağı tek bir yere bağlanamayan, birden fazla neslin bıraktığı bir şey.",
      en: "Something no single source explains — left by more than one generation.",
    },
  },
];

/** Girdabın açılması için gereken toplam ağırlık. Toplam kapasite 15. */
export const GETO_UZUMAKI_THRESHOLD = 8;

export const GETO_VAULT_UI = {
  offerLabel: { tr: "Karşındakiler", en: "In front of him" },
  vaultLabel: { tr: "Hazne", en: "The vault" },
  swallowVerb: { tr: "yut", en: "swallow" },
  swallowedTag: { tr: "yutuldu", en: "swallowed" },
  gaugeLabel: {
    tr: "Hazne doluluğu — yutulan ağırlık",
    en: "Vault level — the weight swallowed",
  },
  tasteLabel: { tr: "Tat", en: "Taste" },
  taste: {
    tr: "Eski bir bezin sıkılmış suyu. Her seferinde aynı.",
    en: "The wrung-out water of an old rag. The same every time.",
  },
  uzumakiButton: { tr: "極ノ番「うずまき」 — hepsini harca", en: "極ノ番「うずまき」 — spend it all" },
  uzumakiLocked: {
    tr: "Girdap için hazne en az yarıya kadar dolmalı.",
    en: "The vortex needs the vault at least half full.",
  },
  resetButton: { tr: "Baştan başla", en: "Start over" },
  statusIdle: {
    tr: "Hazne boş. Karşındakilerden birini yutabilirsin — ama yutulan geri verilmiyor.",
    en: "The vault is empty. You can swallow one of these — but what goes in does not come back.",
  },
  statusSwallowed: {
    tr: "Hazneye indi. Bir daha karşına çıkmayacak; artık senin kadronda.",
    en: "It has dropped into the vault. It will not stand in front of you again; it is on your roster now.",
  },
  statusReady: {
    tr: "Hazne yarıyı geçti. Girdap açılabilir — ama açılırsa hepsi gider.",
    en: "The vault is past halfway. The vortex can open — but if it does, all of it goes.",
  },
  statusSpent: {
    tr: "Girdap açıldı ve hazne tamamen boşaldı. Yıllarca biriken şey tek bir hamlede harcandı.",
    en: "The vortex opened and the vault is completely empty. What took years to gather was spent in a single move.",
  },
  statusEmptyOffer: {
    tr: "Karşında kimse kalmadı. Hazne dolu ama artık yutacak bir şey yok.",
    en: "No one is left in front of him. The vault is full, but there is nothing more to swallow.",
  },
  keyboardHint: {
    tr: "Karşındaki her lanet bir düğme; sekmeyle gez, boşluk ya da enter ile yut.",
    en: "Every curse in front of him is a button; tab through them and swallow with space or enter.",
  },
} as const;

/* ── Beş durak ──────────────────────────────────────────────────────────── */

export interface GetoFate {
  key: string;
  age: LocalizedText;
  era: "before" | "after";
  title: LocalizedText;
  text: LocalizedText;
  kin?: { characterId: number; name: string; role: LocalizedText };
  imageKey: string;
}

export const GETO_TIMELINE: GetoFate[] = [
  {
    key: "school",
    age: { tr: "16 yaş", en: "age 16" },
    era: "before",
    title: { tr: "Sınıfın en iyisi", en: "The best in the class" },
    text: {
      tr: "Tokyo Jujutsu Lisesi'nde okurken sınıfının en yetenekli iki öğrencisinden biriydi ve ikisi de birbirinin tek dengiydi. O yıllarda büyücülüğü bir görev olarak savunan taraf oydu: zayıf olanı korumak için güçlü olmak gerektiğini söyleyen kişi Getō'ydu.",
      en: "At Tokyo Jujutsu High he was one of the two most gifted students in his class, and the two were each other's only equals. In those years he was the one who defended sorcery as a duty: it was Getō who said you had to be strong in order to protect the weak.",
    },
    kin: {
      characterId: 127691,
      name: "Satoru Gojou",
      role: { tr: "Sınıf arkadaşı ve tek dengi", en: "Classmate and only equal" },
    },
    imageKey: GETO_IMAGE_KEYS.fateSchool,
  },
  {
    key: "riko",
    age: { tr: "16 yaş", en: "age 16" },
    era: "before",
    title: { tr: "Alkışlanan ölüm", en: "A death that was applauded" },
    text: {
      tr: "Korumakla görevlendirildikleri kız öldürüldü. Getō'nun kırıldığı yer ölümün kendisi değil, ardından gelen sahne oldu: bir salon dolusu insan bunu alkışladı. O günden sonra taşıdığı soru şuydu — korunması istenen şey buysa, bu işin bedeli neye ödeniyor.",
      en: "The girl they were assigned to protect was killed. What broke Getō was not the death but the scene that followed: a hall full of people applauded it. From that day the question he carried was this — if this is the thing he is asked to protect, what is the price of the work being paid for.",
    },
    kin: {
      characterId: 203015,
      name: "Riko Amanai",
      role: { tr: "Koruyamadıkları kız", en: "The girl they failed to protect" },
    },
    imageKey: GETO_IMAGE_KEYS.fateRiko,
  },
  {
    key: "crack",
    age: { tr: "17 yaş", en: "age 17" },
    era: "before",
    title: { tr: "Çatlak", en: "The crack" },
    text: {
      tr: "Görevler devam etti ama anlamı gitti. Getō laneti doğuran şeyin sıradan insanların korkusu olduğunu ve büyücülerin ömürlerini o korkuyu temizlemeye harcadığını gördü. Sorusu buraya kadar haklıydı: kaynağı hiç durmayan bir işi yapmak gerçekten de sonu olmayan bir iştir.",
      en: "The missions continued but their meaning left. Getō saw that what gives birth to a curse is the fear of ordinary people, and that sorcerers spend their lives clearing that fear away. Up to here his question was fair: doing work whose source never stops really is work without end.",
    },
    imageKey: GETO_IMAGE_KEYS.fateCrack,
  },
  {
    key: "village",
    age: { tr: "17 yaş", en: "age 17" },
    era: "after",
    title: { tr: "Cevabın verildiği gece", en: "The night the answer was given" },
    text: {
      tr: "Bir gecede yüzden fazla sivili öldürdü. Okuldan atıldı ve hakkında infaz kararı çıkarıldı. Sorusu haklıydı, cevabı değildi: bir işin sonsuz olması, o işin yükünü taşıyan insanları ortadan kaldırmayı gerekçelendirmez. Arşiv bu ayrımı bilerek yapıyor — anlatmak onaylamak değil.",
      en: "In a single night he killed over a hundred civilians. He was expelled from the school and an execution order was issued. His question was fair; his answer was not: that work is endless does not justify removing the people who bear its weight. The archive draws this line deliberately — to narrate is not to endorse.",
    },
    imageKey: GETO_IMAGE_KEYS.fateVillage,
  },
  {
    key: "after",
    age: { tr: "27 yaş", en: "age 27" },
    era: "after",
    title: { tr: "Cemaat ve sonrası", en: "The congregation and after" },
    text: {
      tr: "Kendi cemaatini kurdu, müritler topladı ve on yıl boyunca yuttuğu her şeyi bir kadroya çevirdi. Sonu da bu kadroyla geldi. Ölümünden sonra bedeni bir başkası tarafından kullanıldı; yani sayfadaki son gerçek şu — geriye kalan şey adam değil, adamın yüzüydü.",
      en: "He founded his own congregation, gathered followers, and over ten years turned everything he swallowed into a roster. His end came with that roster too. After his death his body was worn by someone else; the last fact on this page is therefore that what remained was not the man but the man's face.",
    },
    kin: {
      characterId: 289584,
      name: "Kenjaku",
      role: { tr: "Bedenini devralan", en: "The one who took over the body" },
    },
    imageKey: GETO_IMAGE_KEYS.fateAfter,
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const GETO_CLOSING = {
  quotes: [
    {
      text: { tr: "猿", en: "猿" },
      reading: {
        tr: "Maymun.",
        en: "Monkey.",
      },
      by: { tr: "Suguru Getō", en: "Suguru Getō" },
      note: {
        tr: "Büyücü olmayan herkes için kullandığı sözcük. Arşiv bunu bir görüş olarak değil, gerekçesinin çöktüğü nokta olarak kaydediyor: insanları insanlıktan çıkarmak bir soruyu cevaplamaz, yalnızca cinayeti kolaylaştırır.",
        en: "The word he used for everyone without a technique. The archive records it not as a viewpoint but as the point where his reasoning collapsed: stripping people of their humanity answers no question, it only makes killing them easier.",
      },
    },
    {
      text: { tr: "極ノ番「うずまき」", en: "極ノ番「うずまき」" },
      reading: {
        tr: "Uç sıra — «Girdap».",
        en: "Maximum — “Uzumaki”.",
      },
      by: { tr: "Suguru Getō", en: "Suguru Getō" },
      note: {
        tr: "En güçlü tekniğinin sesli çağrısı. Yıllarca biriktirdiği her şeyi tek bir hamlede harcamanın adı — ve bu sayfanın en iyi özeti.",
        en: "The spoken invocation of his strongest technique. The name for spending everything gathered over years in a single move — and the best summary of this page.",
      },
    },
  ],
  motto: "呪霊操術",
  mottoNote: {
    tr: "Juryō Sōjutsu — «lanet ruhunu kumanda etme sanatı». Adı bir yok etmeyi değil bir SAHİPLENMEYİ anlatıyor: yenilen şey ortadan kalkmıyor, el değiştiriyor.",
    en: "Juryō Sōjutsu — “the art of commanding a cursed spirit”. The name describes not a destruction but a TAKING: what is beaten does not vanish, it changes hands.",
  },
  credit: {
    tr: "Künye, portre ve doğum bilgileri AniList'ten:",
    en: "Dossier, portrait and birth data from AniList:",
  },
  creditLink: {
    tr: "AniList · Suguru Getou #133699",
    en: "AniList · Suguru Getou #133699",
  },
} as const;
