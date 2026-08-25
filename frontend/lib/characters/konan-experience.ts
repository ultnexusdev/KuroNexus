import type { LocalizedText } from "./types";

/**
 * Konan — "Kâğıt Melek" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 3179 kaydının ABILITY yuvaları,
 * `konan:*` anahtarlarıyla. Görsel bağlı değilse bölüm görselsiz ama
 * AYAKTA çizilir; hiçbir bölüm yükleme bekleyerek çökmez.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (20 Şubat), kan grubu (O), yaş (35), cinsiyet ve "Tenshi
 * (天使) / Angel" takma adları AniList künyesinden birebir alındı
 * (`anilist-detay-22.json`, karakter 3179 — 24 Ağustos 2026 önbelleği).
 * Akatsuki'nin tek kadın üyesi olduğu ve ıslandığında tekniklerinin
 * kısıtlandığı bilgisi de aynı künyenin açıklama metninde geçiyor.
 *
 * ⚠️ BOY YOK. AniList kaydının `traits` dizisi Konan'da BOŞ; boy satırı
 * hiçbir yerde geçmiyor. Bu yüzden künye şeridinde de yok — uydurulmadı.
 * Yüzük kanjisi (白 · byaku) kendi `lib/anime/akatsuki.ts` kaydımızdan.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada iki replik var, ikisi de Konan'a ait ve ikisi de sahnesiyle
 * birlikte anılıyor:
 *   1. Obito ile son karşılaşma — "yağmur dindiğinde açacak çiçek" satırı
 *   2. Amegakure'de Naruto'ya — "ben de inanacağım" satırı
 * Türkçeleri ARŞİVİN KENDİ çevirisi; İngilizceleri yaygın olarak dolaşan
 * karşılıklar. Emin olunmayan hiçbir cümle tırnağa alınmadı: dövüşün ve
 * kronolojinin ayrıntıları arşivin kendi anlatımı olarak düz metin yazıldı.
 *
 * ── ORİGAMİ NOTASYONU ────────────────────────────────────────────────────
 * Katlama masasındaki işaretler uydurma değil, gerçek origami diyagram
 * dili: vadi katı (谷折り) kesik çizgi, dağ katı (山折り) nokta-kesik çizgi.
 * `foldKind` alanı bileşende bu iki glife çevriliyor.
 */

export const KONAN_ID = 3179;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const KONAN_SITE_URL = "https://anilist.co/character/3179";

/**
 * Sergi görselleri — hepsi characterId 3179 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `konan:` önekli (kurator modu şartı).
 */
export const KONAN_IMAGE_KEYS = {
  /** Hero: yağmurlu Ame silueti, kadrajın çoğu gökyüzü (16:9) */
  hero: "konan:hero",
  shikigami: "konan:shikigami",
  shuriken: "konan:shuriken",
  kibakufuda: "konan:kibakufuda",
  smallClone: "konan:kami-bunshin",
  smallSea: "konan:kami-no-umi",
  smallRule: "konan:ame-rule",
  smallFlower: "konan:kami-no-hana",
  fold1: "konan:fold-flower",
  fold2: "konan:fold-wings",
  fold3: "konan:fold-sea",
  fold4: "konan:fold-tags",
  fold5: "konan:fold-last",
  count: "konan:count",
  fateOrphan: "konan:fate-orphan",
  fateYahiko: "konan:fate-yahiko",
  fateAngel: "konan:fate-angel",
  fateBreak: "konan:fate-break",
  fateEnd: "konan:fate-end",
  closing: "konan:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const KONAN_SLOT_LABELS: Record<string, LocalizedText> = {
  [KONAN_IMAGE_KEYS.hero]: {
    tr: "Hero — yağmur altındaki Ame silueti, figür küçük (16:9)",
    en: "Hero — Amegakure under rain, small figure (16:9)",
  },
  [KONAN_IMAGE_KEYS.shikigami]: {
    tr: "Shikigami no Mai — bedenin kâğıt yapraklarına dağılması",
    en: "Shikigami no Mai — the body scattering into paper",
  },
  [KONAN_IMAGE_KEYS.shuriken]: {
    tr: "Kâğıt shuriken yağmuru ve katlanan kalkan",
    en: "The paper shuriken volley and the folded shield",
  },
  [KONAN_IMAGE_KEYS.kibakufuda]: {
    tr: "Göl yüzeyini kaplayan etiketler — patlamadan hemen önce",
    en: "Tags covering the lake surface — just before detonation",
  },
  [KONAN_IMAGE_KEYS.smallClone]: {
    tr: "Kâğıt klonu dağılırken",
    en: "The paper clone coming apart",
  },
  [KONAN_IMAGE_KEYS.smallSea]: {
    tr: "Şehrin üstüne yayılan yaprak bulutu",
    en: "The sheet cloud spread over the city",
  },
  [KONAN_IMAGE_KEYS.smallRule]: {
    tr: "Ame'nin lideri olarak Konan — kule ve yağmur",
    en: "Konan as Ame's leader — the tower and the rain",
  },
  [KONAN_IMAGE_KEYS.smallFlower]: {
    tr: "Saçındaki mavi origami çiçek, yakın çekim",
    en: "The blue origami flower in her hair, close crop",
  },
  [KONAN_IMAGE_KEYS.fold1]: {
    tr: "1. kat — Ame sokaklarında üç yetim",
    en: "Fold 1 — three orphans in the streets of Ame",
  },
  [KONAN_IMAGE_KEYS.fold2]: {
    tr: "2. kat — gökte açılan kâğıt kanatlar",
    en: "Fold 2 — paper wings opening in the sky",
  },
  [KONAN_IMAGE_KEYS.fold3]: {
    tr: "3. kat — şehrin üstündeki kâğıt denizi",
    en: "Fold 3 — the paper sea above the city",
  },
  [KONAN_IMAGE_KEYS.fold4]: {
    tr: "4. kat — gölün üstünde on dakikalık patlama",
    en: "Fold 4 — the ten-minute blast over the lake",
  },
  [KONAN_IMAGE_KEYS.fold5]: {
    tr: "5. kat — Naruto'ya verilen kâğıt çiçekler",
    en: "Fold 5 — the paper flowers given to Naruto",
  },
  [KONAN_IMAGE_KEYS.count]: {
    tr: "Sayı bandı zemini — etiket tarlası, düşük kontrast",
    en: "Number band backdrop — a field of tags, low contrast",
  },
  [KONAN_IMAGE_KEYS.fateOrphan]: {
    tr: "Çocukluk — yağmurun altında yiyecek arayan üç çocuk",
    en: "Childhood — three children scavenging in the rain",
  },
  [KONAN_IMAGE_KEYS.fateYahiko]: {
    tr: "Yahiko'nun ölümü — Nagato'nun elindeki kunai",
    en: "Yahiko's death — the kunai in Nagato's hand",
  },
  [KONAN_IMAGE_KEYS.fateAngel]: {
    tr: "Akatsuki yılları — Pain'in yanındaki melek",
    en: "The Akatsuki years — the angel beside Pain",
  },
  [KONAN_IMAGE_KEYS.fateBreak]: {
    tr: "Kopuş — iki bedeni Ame'ye geri götürüşü",
    en: "The break — carrying the two bodies back to Ame",
  },
  [KONAN_IMAGE_KEYS.fateEnd]: {
    tr: "Son savaş — su, kâğıt ve Obito",
    en: "The last fight — water, paper and Obito",
  },
  [KONAN_IMAGE_KEYS.closing]: {
    tr: "Kapanış — dinmiş yağmur, düzelmiş tek yaprak",
    en: "Closing — the rain stopped, one flat sheet",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const KONAN_IDENTITY = {
  name: "Konan",
  nativeName: "小南",
  /** Hero filigranı — tek karakter, dekoratif (aria-hidden): 紙 = kâğıt */
  watermark: "紙",
  title: { tr: "Ame'nin Meleği", en: "The Angel of Ame" },
  epigraph: {
    tr: "Kâğıt yırtılır, ama katlanan kâğıt kırılmaz — yalnızca yön değiştirir.",
    en: "Paper tears, but folded paper does not break — it only changes direction.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "20 Şubat", en: "20 February" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "O", en: "O" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "35", en: "35" },
    },
    {
      label: { tr: "Unvan", en: "Title" },
      value: {
        tr: "Tenshi (天使) — Ame halkının verdiği ad",
        en: "Tenshi (天使) — the name Ame's people gave her",
      },
    },
    {
      label: { tr: "Köy", en: "Village" },
      value: {
        tr: "Amegakure — Yağmur Köyü",
        en: "Amegakure — the Village Hidden in Rain",
      },
    },
    {
      label: { tr: "Örgüt", en: "Organisation" },
      value: {
        tr: "Akatsuki — kurucu üçlüden biri, tek kadın üye",
        en: "Akatsuki — one of the three founders, its only woman",
      },
    },
    {
      label: { tr: "Yüzük", en: "Ring" },
      value: { tr: "白 · byaku (ak)", en: "白 · byaku (white)" },
    },
    {
      label: { tr: "Yanında taşıdığı", en: "What she carries" },
      value: {
        tr: "Saçında bir kâğıt çiçek",
        en: "A paper flower in her hair",
      },
    },
  ],
} as const;

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

export const KONAN_ANGEL_TEXT = {
  enter: { tr: "Melek", en: "Angel" },
  exit: { tr: "Kanatları kapat", en: "Fold the wings" },
  hint: {
    tr: "Kanatlar iki kenardan açıldı: kâğıt düzeldi, zemin bir tık aydınlandı.",
    en: "The wings opened from both edges: the paper lies flat and the ground lifts a shade.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const KONAN_HERO = {
  lede: {
    tr: "Ame'nin göğünde yağmur hiç dinmedi. Onun altında bir kız, elindeki tek malzemeyi önce bir çiçeğe, sonra bir kanada, en sonunda altı yüz milyar patlayıcı etikete katladı.",
    en: "The rain over Ame never stopped. Beneath it a girl folded the only material she had — first into a flower, then into a wing, and finally into six hundred billion explosive tags.",
  },
  flowerCaption: {
    tr: "Saçındaki çiçek çocukluğundan kaldı; katlaması hiç değişmedi.",
    en: "The flower in her hair is left from childhood; the fold never changed.",
  },
  portraitAlt: {
    tr: "Konan — arşive yüklenmiş kadro portresi",
    en: "Konan — cast portrait uploaded to the archive",
  },
  portraitAltFallback: {
    tr: "Konan — AniList künye portresi",
    en: "Konan — AniList profile portrait",
  },
} as const;

/**
 * Görsel alt metinleri — BRIEF §3.5: her alt iki dilli ve KAYNAĞINI söyler.
 * Yoldaş portrelerinin tamamı kendi veritabanımızdan geliyor (PORTRAIT
 * yuvası), bu yüzden tek bir son ek yetiyor.
 */
export const KONAN_ALT = {
  companionSuffix: {
    tr: "— arşive yüklenmiş kadro portresi",
    en: "— cast portrait uploaded to the archive",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const KONAN_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "Naruto Universe" },
} as const;

export const KONAN_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "The record" },
    lede: {
      tr: "Bir yetim, bir melek, bir köyün son yöneticisi. Kayıt kısa; içine sığmayan şey uzun.",
      en: "An orphan, an angel, a village's last ruler. The record is short; what will not fit in it is long.",
    },
  },
  forms: {
    title: { tr: "Kâğıdın üç hâli", en: "Three states of paper" },
    lede: {
      tr: "Konan'ın bütün cephaneliği tek bir malzemeden çıkar. Değişen malzeme değil, katlama açısı.",
      en: "Her whole arsenal comes out of one material. What changes is not the paper but the angle of the fold.",
    },
  },
  hands: {
    title: { tr: "Elindeki dört şey", en: "Four things in her hands" },
    lede: {
      tr: "Dövüş dışında da aynı kâğıt: bir kopya, bir sınır, bir yönetim biçimi ve bir hatıra.",
      en: "Outside a fight it is the same paper: a copy, a border, a way of governing, and a keepsake.",
    },
  },
  names: {
    title: { tr: "Dört isim", en: "Four names" },
    lede: {
      tr: "Konan'ın ömrü dört kişinin etrafında katlandı: biri onu büyüttü, biri onu bıraktı, biri onu melek yaptı, biri onu öldürdü.",
      en: "Her life folded around four people: one raised her, one left her, one made her an angel, one killed her.",
    },
  },
  fold: {
    title: { tr: "Katlama masası", en: "The folding table" },
    lede: {
      tr: "Beş kat, beş dönem. Kâğıt önce bir çiçek, sonra bir kanat, sonra bir deniz, sonra bir tuzak, en sonunda tek bir düz yaprak oldu. Bir katı seç: düzlem kendi üzerinden kalkar ve açılır.",
      en: "Five folds, five eras. The paper was a flower, then a wing, then a sea, then a trap, and at the end a single flat sheet. Choose a fold: the plane lifts off itself and opens.",
    },
  },
  count: {
    title: { tr: "Altı yüz milyar", en: "Six hundred billion" },
  },
  fate: {
    title: { tr: "Kader çizelgesi", en: "A life in five entries" },
    lede: {
      tr: "Beş kayıt. İkisi cenaze, biri unvan, biri kopuş, sonuncusu bir gölün üstünde.",
      en: "Five entries. Two funerals, one title, one break, and the last one over a lake.",
    },
  },
} as const;

/* ── Kâğıdın üç hâli — büyük kartlar ────────────────────────────────────── */

export const KONAN_FORMS = [
  {
    key: "shikigami" as const,
    imageKey: KONAN_IMAGE_KEYS.shikigami,
    kanji: "式神の舞",
    name: "Shikigami no Mai",
    turkish: { tr: "Kâğıt Dansı", en: "Dance of the Shikigami" },
    tagline: {
      tr: "Bedenini sayısız kâğıt yaprağına böler ve her yaprağı ayrı ayrı yönetir.",
      en: "She divides her body into countless sheets and steers every one of them separately.",
    },
    text: {
      tr: "Konan'ın bütün tekniklerinin altında tek bir dönüşüm var: beden kâğıda iner. Yapraklar uzaktan yönetilir — bir araya gelip mızrak olur, dağılıp bir odayı tarar, gerekirse bir darbenin önüne kendini koyar. Zayıflık da aynı yerde duruyor: ıslanan kâğıt kendi kendine yapışır ve sertliğini kaybeder. Ömrünü hiç dinmeyen bir yağmurun altında geçirmiş biri için bu, üzerinde en çok düşündüğü sınırdır.",
      en: "One transformation sits under every technique she has: the body comes down to paper. The sheets are steered from a distance — they gather into a spear, scatter to sweep a room, or put themselves in front of a blow. The weakness lives in the same place: wet paper clings to itself and loses its stiffness. For someone who spent a life under rain that never stopped, that is the limit she thought about most.",
    },
    traits: [
      { tr: "Uzaktan yönetim", en: "Steered remotely" },
      { tr: "Bedeni bölme", en: "Divides the body" },
      { tr: "Islanınca durur", en: "Water stops it" },
    ],
  },
  {
    key: "shuriken" as const,
    imageKey: KONAN_IMAGE_KEYS.shuriken,
    kanji: "紙手裏剣",
    name: "Kami Shuriken",
    turkish: { tr: "Kâğıt shuriken ve kâğıt kalkan", en: "Paper shuriken and paper shield" },
    tagline: {
      tr: "Aynı yaprak hem kesen hem tutan olur: katlanınca bıçak, üst üste binince kalkan.",
      en: "The same sheet cuts and holds: folded it is a blade, stacked it is a shield.",
    },
    text: {
      tr: "Yapraklar keskin kenarlı yıldızlara katlanıp yüzlercesi birden atılır; aynı yapraklar üst üste yığıldığında darbeyi yayan bir yüzeye dönüşür. Konan'ın dövüş biçimi bir seçim meselesi değil, bir ayar meselesidir: sıklığı ve açıyı değiştirir, malzeme aynı kalır. Mızraklar, halkalar, kanatlar ve o kanatların altındaki kalkan — hepsi tek bir katlama sözlüğünden çıkıyor.",
      en: "The sheets fold into hard-edged stars and fly by the hundred; stacked, those same sheets become a surface that spreads a blow instead of taking it. Her fighting style is not a choice between forms but a setting: she changes the density and the angle, the material stays. Spears, rings, wings, and the shield under those wings all come out of one folding vocabulary.",
    },
    traits: [
      { tr: "Aynı malzeme, iki iş", en: "One material, two jobs" },
      { tr: "Yüzlercesi birden", en: "Hundreds at once" },
      { tr: "Açı belirler", en: "The angle decides" },
    ],
  },
  {
    key: "kibakufuda" as const,
    imageKey: KONAN_IMAGE_KEYS.kibakufuda,
    kanji: "起爆札",
    name: "Kibakufuda",
    turkish: {
      tr: "Altı yüz milyar patlayıcı etiket",
      en: "Six hundred billion explosive tags",
    },
    tagline: {
      tr: "Yıllarca hazırlanmış tek bir tuzak: kâğıdın her yaprağı bir bomba.",
      en: "One trap prepared over years: every sheet of the paper is a bomb.",
    },
    text: {
      tr: "Konan, Obito'yu bir gölün ortasına çeker ve suyun yüzünü kâğıtla kaplar. Yüzeyin altında yıllardır katladığı etiketler durmaktadır. Etiketler sırayla tutuşur ve patlama on dakika sürer. Bu, elindeki her şeyi tek bir ana yığdığı hesaptır: kaçış yok, ikinci deneme yok, geri alınacak hamle yok. Hesap doğrudur — eksik olan tek şey, karşısındakinin gerçeğin kendisini bir kez geri alabildiğini bilmemesidir.",
      en: "She draws Obito to the middle of a lake and covers the face of the water with paper. Under that surface lie the tags she has been folding for years. They catch in sequence and the blast runs for ten minutes. This is the calculation where she stakes everything on a single moment: no escape, no second attempt, no move to take back. The calculation is right — the only thing missing from it is that the man across from her can take reality itself back once.",
    },
    traits: [
      { tr: "Tek atış", en: "One shot" },
      { tr: "On dakika", en: "Ten minutes" },
      { tr: "Yetmedi", en: "Not enough" },
    ],
  },
] as const;

/* ── Elindeki dört şey — küçük kartlar ──────────────────────────────────── */

export const KONAN_HANDS = [
  {
    key: "clone" as const,
    imageKey: KONAN_IMAGE_KEYS.smallClone,
    kanji: "紙分身",
    name: { tr: "Kâğıt klonu", en: "Paper clone" },
    note: {
      tr: "Kâğıttan bir kopya. Darbeyi yiyen dağılır, asıl beden çoktan başka bir yerdedir; en ucuz kaçış yolu ve en sessiz tuzak kurma biçimi.",
      en: "A copy made of paper. The one that takes the hit comes apart while the real body is already elsewhere: her cheapest way out and her quietest way to set a trap.",
    },
  },
  {
    key: "sea" as const,
    imageKey: KONAN_IMAGE_KEYS.smallSea,
    kanji: "紙の海",
    name: { tr: "Kâğıt denizi", en: "Paper sea" },
    note: {
      tr: "Bedenini yapraklara bölüp bir alanın üstüne yayar. Kâğıt hem göz hem sınırdır: içeri giren her şeye dokunur, dokunduğu her şeyi bildirir.",
      en: "She splits into sheets and spreads them over an area. The paper is both an eye and a border: it touches everything that enters and reports everything it touches.",
    },
  },
  {
    key: "rule" as const,
    imageKey: KONAN_IMAGE_KEYS.smallRule,
    kanji: "雨隠れ",
    name: { tr: "Ame'nin yönetimi", en: "Ruling Ame" },
    note: {
      tr: "Nagato'nun ölümünden sonra köyün başına geçti. Ame yıllardır dışarıya kapalıydı; farkı, kapının artık bir tanrının değil, kalan tek kişinin elinde olmasıydı.",
      en: "After Nagato's death she took the village. Ame had been closed to the outside for years; the difference was that the door was now held not by a god but by the only one left.",
    },
  },
  {
    key: "flower" as const,
    imageKey: KONAN_IMAGE_KEYS.smallFlower,
    kanji: "紙の花",
    name: { tr: "Kâğıt çiçek", en: "Paper flower" },
    note: {
      tr: "Saçındaki mavi origami. Bir silah değil, bir tarih: katlaması çocukluğundan beri aynı ve son sahnesinde de aynı çiçekten bir demet bırakıyor.",
      en: "The blue origami in her hair. Not a weapon but a date: the fold has not changed since childhood, and in her last scene she leaves behind a bunch of the same flower.",
    },
  },
] as const;

/* ── Dört isim (yoldaş portreleri) ──────────────────────────────────────── */

/**
 * `characterId` alanları `EXPERIENCE_COMPANIONS[3179]` listesiyle birebir
 * aynı: 3180 Nagato (AniList'te "Pain"), 23050 Yahiko, 2423 Jiraiya,
 * 3149 Obito (AniList'te "Tobi"). Portre kaydı olmayan isim yalnızca adıyla
 * çizilir, bölüm çökmez.
 *
 * `side`: portrenin katlanmış köşesi hangi yöne bakacak — "kept" olanlar
 * sola, "lost" olan sağa. Bileşende `data-side`.
 */
export const KONAN_NAMES = [
  {
    characterId: 23050,
    name: "Yahiko",
    side: "kept" as const,
    role: { tr: "Sevdiği", en: "The one she loved" },
    note: {
      tr: "Üçlünün konuşanı ve inananıydı. Konan rehin alındığında kendini Nagato'nun elindeki kunaiye bıraktı; Akatsuki'nin ilk hâli onunla birlikte öldü.",
      en: "The one of the three who spoke and who believed. When Konan was taken hostage he let himself fall onto the kunai in Nagato's hand; the first Akatsuki died with him.",
    },
  },
  {
    characterId: 3180,
    name: "Nagato",
    side: "kept" as const,
    role: { tr: "Yanında durduğu", en: "The one she stood beside" },
    note: {
      tr: "Yahiko'dan sonra kalan tek kişi. Nagato'nun tanrı olduğu yıllarda Konan onun meleğiydi; ikisinin arasındaki şey bir ortaklıktan çok bir nöbetti.",
      en: "The only one left after Yahiko. In the years when Nagato was a god she was his angel; what held them together was less a partnership than a watch kept.",
    },
  },
  {
    characterId: 2423,
    name: "Jiraiya",
    side: "kept" as const,
    role: { tr: "Öğretmeni", en: "Her teacher" },
    note: {
      tr: "Üç aç çocuğu savaşın ortasında buldu, üç yıl kaldı ve Konan'ın origami yeteneğini bir dövüş biçimine çevirdi. Yıllar sonra aynı çocukların elinde öldü.",
      en: "He found three hungry children in the middle of a war, stayed three years, and turned Konan's talent for origami into a way of fighting. Years later he died at the hands of those same children.",
    },
  },
  {
    characterId: 3149,
    name: "Obito Uchiha",
    side: "lost" as const,
    role: { tr: "Karşısındaki", en: "The one across from her" },
    note: {
      tr: "Nagato'nun Rinnegan'ı için geldi. Konan'ın hesabını on dakikalık bir patlamayla değil, gerçeğin kendisini geri alarak bozdu.",
      en: "He came for Nagato's Rinnegan. He broke her calculation not by surviving ten minutes of fire but by taking reality itself back.",
    },
  },
] as const;

/* ── Katlama masası — sayfanın kalbi ────────────────────────────────────── */

export const KONAN_FOLD_UI = {
  listLabel: { tr: "Katlama adımları", en: "Folding steps" },
  foldWord: { tr: "kat", en: "fold" },
  prev: { tr: "Önceki kat", en: "Previous fold" },
  next: { tr: "Sonraki kat", en: "Next fold" },
  eraLabel: { tr: "Dönem", en: "Era" },
  keyboardHint: {
    tr: "Yukarı/aşağı ok tuşlarıyla da gezebilirsin.",
    en: "The up and down arrow keys work too.",
  },
  sheetAlt: {
    tr: "Katlama şeması: seçilen adıma kadar olan yapraklar açılır, kâğıt küçük bir tomardan tam yaprağa doğru büyür.",
    en: "Folding diagram: every leaf up to the chosen step swings open, and the paper grows from a small packet into a full sheet.",
  },
  kinds: {
    core: { tr: "Katlanmamış", en: "Unfolded" },
    valley: { tr: "Vadi katı · 谷折り", en: "Valley fold · 谷折り" },
    mountain: { tr: "Dağ katı · 山折り", en: "Mountain fold · 山折り" },
  },
} as const;

export type KonanFoldKind = "core" | "valley" | "mountain";

export interface KonanFoldStep {
  key: string;
  imageKey: string;
  kanji: string;
  foldKind: KonanFoldKind;
  era: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
}

/**
 * Beş kat.
 *
 * İlk adım kâğıdın KATLANMIŞ hâli (tomar); kalan dördü şemadaki dört yaprağı
 * sırayla açıyor. Yani "beş adım, dört yaprak" — son adımda kâğıt tam açık.
 */
export const KONAN_FOLDS: KonanFoldStep[] = [
  {
    key: "flower",
    imageKey: KONAN_IMAGE_KEYS.fold1,
    kanji: "花",
    foldKind: "core",
    era: { tr: "Çocukluk", en: "Childhood" },
    title: { tr: "Kâğıt çiçek", en: "The paper flower" },
    text: {
      tr: "Ame'de savaştan artakalan üç çocuk: Yahiko, Nagato ve Konan. Yiyecek çalıp yağmurun altında uyudular. Jiraiya onları bulduğunda Konan'ın elinde zaten kâğıt vardı — origamiye doğuştan yatkındı ve ustası onu tam da o yetenek üstünden dövüşmeye çalıştırdı. Saçındaki çiçek o günlerden kaldı ve bir daha hiç değişmedi.",
      en: "Three children left over from a war in Ame: Yahiko, Nagato and Konan. They stole food and slept in the rain. When Jiraiya found them Konan already had paper in her hands — origami came naturally to her, and her teacher trained her to fight through exactly that talent. The flower in her hair is left from those days and never changed again.",
    },
  },
  {
    key: "wings",
    imageKey: KONAN_IMAGE_KEYS.fold2,
    kanji: "翼",
    foldKind: "valley",
    era: { tr: "Akatsuki", en: "Akatsuki" },
    title: { tr: "Melek kanatları", en: "The angel's wings" },
    text: {
      tr: "Yahiko'nun ölümünden sonra Nagato \"tanrı\" oldu, Konan da onun meleği. Ame halkı gökte açılan kâğıt kanatları gördü ve ona 天使 dedi. Akatsuki'nin kurucu üçlüsünden biriydi ve örgütün tek kadın üyesi olarak kaldı; ama unvanın altındaki iş inanç değil, nöbetti.",
      en: "After Yahiko's death Nagato became a god and Konan became his angel. The people of Ame saw paper wings open in the sky and called her 天使. She was one of Akatsuki's three founders and remained its only woman — but the work under the title was not faith, it was a watch kept.",
    },
  },
  {
    key: "sea",
    imageKey: KONAN_IMAGE_KEYS.fold3,
    kanji: "海",
    foldKind: "mountain",
    era: { tr: "Ame'nin koruyucusu", en: "Ame's keeper" },
    title: { tr: "Kâğıt denizi", en: "The paper sea" },
    text: {
      tr: "Bedenini yapraklara bölüp şehrin üstüne yaydı: kâğıt hem gözdü hem sınır. Ame yıllarca dışarıya kapalı kaldı, çünkü sınırın kendisi canlıydı ve her yaprağı Konan'ın kendisiydi. Bir köyü savunmanın en sessiz biçimi — kimse kapıda bir nöbetçi görmüyordu.",
      en: "She split into sheets and spread them over the city: the paper was both an eye and a border. Ame stayed closed to the outside for years because the border itself was alive and every sheet of it was Konan. The quietest way to defend a village — nobody ever saw a guard at the gate.",
    },
  },
  {
    key: "tags",
    imageKey: KONAN_IMAGE_KEYS.fold4,
    kanji: "札",
    foldKind: "valley",
    era: { tr: "Obito tuzağı", en: "The trap for Obito" },
    title: { tr: "Altı yüz milyar patlayıcı etiket", en: "Six hundred billion explosive tags" },
    text: {
      tr: "Nagato öldükten sonra Obito, Rinnegan'ın peşine düştü. Konan onu bir gölün ortasına çekti ve yıllardır hazırladığı tuzağı kapattı: yüzeyin üstü kâğıt, altı etiketti. On dakika boyunca patladı. Ömrü boyunca yaptığı en büyük katlama buydu ve tam olarak planladığı gibi işledi — sonra Izanagi o on dakikayı hiç olmamışa çevirdi.",
      en: "After Nagato died, Obito came after the Rinnegan. Konan drew him to the middle of a lake and closed the trap she had been preparing for years: paper above the surface, tags below it. It burned for ten minutes. It was the largest fold of her life and it worked exactly as designed — and then Izanagi turned those ten minutes into something that had never happened.",
    },
  },
  {
    key: "last",
    imageKey: KONAN_IMAGE_KEYS.fold5,
    kanji: "紙",
    foldKind: "mountain",
    era: { tr: "Son kâğıt", en: "The last sheet" },
    title: { tr: "Yahiko ve Nagato'nun yanına", en: "Back beside Yahiko and Nagato" },
    text: {
      tr: "Obito ondan iki bedenin yerini istedi; Konan söylemedi ve orada öldürüldü. Geriye iki şey kaldı: Naruto'ya verdiği kâğıt çiçekler ve son ana kadar sakladığı mezar. Kâğıt en sonunda düzeldi — üstünde ne kanat vardı ne etiket, yalnızca düz bir yaprak.",
      en: "Obito asked her where two bodies lay; she did not say, and she was killed there. Two things were left: the paper flowers she had given Naruto, and the grave she kept to the last moment. In the end the paper lay flat — no wings on it and no tags, only a plain sheet.",
    },
  },
];

/* ── Altı yüz milyar — sayı bandı ───────────────────────────────────────── */

/**
 * Sayının kendisi sayfanın görsel çapası.
 *
 * Rakamlar GRUP GRUP çiziliyor (`groups`), çünkü tek bir dize 360 pikselde
 * ya taşar ya da okunamayacak kadar küçülür; gruplar sarınca sayı iki
 * satıra iniyor ve hiçbir yerde yatay taşma olmuyor. Ayraç dile bağlı:
 * Türkçede nokta, İngilizcede virgül. Ekran okuyucuya rakam değil, `spoken`
 * alanındaki cümle iniyor.
 */
export const KONAN_COUNT = {
  groups: ["600", "000", "000", "000"] as const,
  separator: { tr: ".", en: "," },
  spoken: {
    tr: "Altı yüz milyar patlayıcı etiket",
    en: "Six hundred billion explosive tags",
  },
  kanji: "起爆札",
  lede: {
    tr: "Konan bu sayıyı yıllar içinde tek tek katladı. Hepsi tek bir göle, tek bir adama ve tek bir ana ayrılmıştı.",
    en: "She folded this number one tag at a time over years. All of it was set aside for one lake, one man and one moment.",
  },
  measures: [
    {
      value: { tr: "10 dakika", en: "10 minutes" },
      note: {
        tr: "Patlamanın sürdüğü süre — bir dövüş değil, bir kuşatma.",
        en: "How long the blast ran — not a fight but a siege.",
      },
    },
    {
      value: { tr: "1 hamle", en: "1 move" },
      note: {
        tr: "Tuzağın tamamı tek seferlik: kaçış planı yok, ikinci deneme yok.",
        en: "The whole trap was single-use: no escape plan, no second attempt.",
      },
    },
    {
      value: { tr: "0 sonuç", en: "0 result" },
      note: {
        tr: "Izanagi gerçeği geri aldı ve on dakika hiç yaşanmamış oldu.",
        en: "Izanagi took reality back and the ten minutes became something that never happened.",
      },
    },
  ],
  closingLine: {
    tr: "Bu sayfadaki en büyük sayı, aynı zamanda Konan'ın en büyük yenilgisi.",
    en: "The largest number on this page is also her largest defeat.",
  },
} as const;

/* ── Kader çizelgesi ────────────────────────────────────────────────────── */

/**
 * Çizelge satırı. `quote` opsiyonel — beş kaydın yalnızca birinde replik
 * var (`as const` bir birleşim tipi üretip opsiyonel alanı gizlediği için
 * satır tipi burada açıkça yazıldı).
 *
 * ⚠️ YAŞ ETİKETLERİ: AniList Konan için TEK bir yaş veriyor (35) ve o da
 * Part II'ye ait. Bu yüzden ilk üç kayıt sayı değil dönem etiketi taşıyor;
 * uydurma yaş yazılmadı.
 */
export interface KonanFateEntry {
  key: string;
  imageKey: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: LocalizedText };
}

export const KONAN_TIMELINE: KonanFateEntry[] = [
  {
    key: "orphan",
    imageKey: KONAN_IMAGE_KEYS.fateOrphan,
    age: { tr: "Çocukluk", en: "Childhood" },
    title: {
      tr: "Ame'de aç bir yetim, sonra Jiraiya'nın öğrencisi",
      en: "A hungry orphan in Ame, then Jiraiya's student",
    },
    text: {
      tr: "Amegakure'nin savaşlarından biri onu öksüz bıraktı. Yahiko ve Nagato'yla birlikte sokakta yaşadı; üçü de kendi başının çaresine bakmak zorunda kaldı. Jiraiya onları bulup üç yıl kaldı, ninjutsu öğretti ve Konan'ın origami yeteneğini bir dövüş biçimine çevirdi. Ustası gittiğinde geriye üç çocuk ve bir fikir kaldı: yağmuru durdurmak.",
      en: "One of Amegakure's many wars orphaned her. She lived on the street with Yahiko and Nagato, all three left to fend for themselves. Jiraiya found them, stayed three years, taught them ninjutsu, and turned Konan's talent for origami into a way of fighting. When he left, three children and one idea remained: stop the rain.",
    },
  },
  {
    key: "yahiko",
    imageKey: KONAN_IMAGE_KEYS.fateYahiko,
    age: { tr: "Gençlik", en: "Youth" },
    title: { tr: "Yahiko'nun ölümü", en: "Yahiko's death" },
    text: {
      tr: "Üçünün kurduğu ilk örgüt Ame'de bir güç hâline gelince Hanzō ve Danzō bir barış görüşmesi tuzağı kurdu. Konan rehin alındı; Yahiko'ya, arkadaşını kurtarmak için Nagato'nun onu öldürmesi şartı sunuldu. Yahiko kararı kimseye bırakmadı: Nagato'nun elindeki kunaiye kendini bıraktı. O günden sonra örgütün adı aynı kaldı, anlamı değişti.",
      en: "When the group the three of them built became a power in Ame, Hanzō and Danzō set a trap dressed as peace talks. Konan was taken hostage; Yahiko was offered his friend's life on the condition that Nagato take his. Yahiko left the decision to no one: he let himself fall onto the kunai in Nagato's hand. After that day the organisation kept its name and lost its meaning.",
    },
  },
  {
    key: "angel",
    imageKey: KONAN_IMAGE_KEYS.fateAngel,
    age: { tr: "Akatsuki yılları", en: "The Akatsuki years" },
    title: { tr: "Tanrı'nın meleği", en: "The god's angel" },
    text: {
      tr: "Nagato, Yahiko'nun bedenini kullanarak \"Pain\" oldu ve kendini tanrı ilan etti. Konan yanında durdu: kâğıt kanatlarıyla Ame'nin göğünde görünen, halkın 天使 dediği kişi. Akatsuki'nin kurucu üçlüsünden geriye ikisi kalmıştı ve ikisi de artık başka bir şeydi. Konan bu yıllarda ne itiraz etti ne de inandı — sadece kaldı.",
      en: "Using Yahiko's body Nagato became \"Pain\" and declared himself a god. Konan stayed beside him: the figure the people of Ame saw in the sky on paper wings and called 天使. Two of the three founders were left and both were now something else. Through those years she neither objected nor believed — she simply stayed.",
    },
  },
  {
    key: "break",
    imageKey: KONAN_IMAGE_KEYS.fateBreak,
    age: { tr: "35 yaş", en: "Age 35" },
    title: {
      tr: "Nagato'nun ölümü ve Akatsuki'den kopuş",
      en: "Nagato's death and the break from Akatsuki",
    },
    text: {
      tr: "Nagato, Konoha'da öldürdüklerini geri getirdi ve o çabada öldü. Konan iki bedeni — Yahiko'nunkini ve Nagato'nunkini — Ame'ye geri taşıdı, Akatsuki'den ayrıldı ve köyün başına geçti. Naruto'ya bir demet kâğıt çiçek bıraktı; bu, ömrü boyunca kimseye söylemediği bir cümlenin yerine geçen tek jestti.",
      en: "Nagato brought back the people he had killed in Konoha and died in the effort. Konan carried two bodies — Yahiko's and Nagato's — back to Ame, left Akatsuki and took the village. She left Naruto a bunch of paper flowers: the single gesture that stood in for a sentence she never said out loud to anyone.",
    },
  },
  {
    key: "end",
    imageKey: KONAN_IMAGE_KEYS.fateEnd,
    age: { tr: "35 yaş", en: "Age 35" },
    title: { tr: "Obito ile son savaş", en: "The last fight, against Obito" },
    text: {
      tr: "Obito, Nagato'nun Rinnegan'ı için Ame'ye geldi. Konan onu suya çekti ve altı yüz milyar etiketi tutuşturdu; on dakika süren patlama tam olarak planladığı gibi işledi. Obito Izanagi'yle o on dakikayı gerçeklikten sildi. İki bedenin yerini söylemeyi reddeden Konan orada öldürüldü.",
      en: "Obito came to Ame for Nagato's Rinnegan. Konan drew him onto the water and lit six hundred billion tags; the ten-minute blast worked exactly as planned. Obito used Izanagi to erase those ten minutes from reality. Refusing to say where two bodies lay, Konan was killed there.",
    },
    quote: {
      text: {
        tr: "Ben bir asi değilim. Ben, yağmur dindiğinde açacak çiçeğim.",
        en: "I'm no rebel. I am the flower that will bloom when the rain stops.",
      },
      by: { tr: "Konan", en: "Konan" },
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const KONAN_CLOSING = {
  quotes: [
    {
      text: {
        tr: "Ben bir asi değilim. Ben, yağmur dindiğinde açacak çiçeğim.",
        en: "I'm no rebel. I am the flower that will bloom when the rain stops.",
      },
      by: { tr: "Konan", en: "Konan" },
      note: {
        tr: "Obito ile son karşılaşmasında. Ame'de yağmur onun ömrü boyunca hiç dinmedi.",
        en: "In her last encounter with Obito. The rain over Ame never once stopped in her lifetime.",
      },
    },
    {
      text: {
        tr: "Nagato sana inandı. Yahiko sana inandı. Ben de inanacağım.",
        en: "Nagato believed in you. Yahiko believed in you. I will believe in you too.",
      },
      by: { tr: "Konan", en: "Konan" },
      note: {
        tr: "Amegakure'de Naruto'ya, kâğıt çiçekleri verirken. Ölmeden önce açıkça inandığı tek şey buydu.",
        en: "To Naruto in Amegakure, as she handed him the paper flowers. It was the one thing she openly believed before she died.",
      },
    },
  ],
  motto: "天使",
  mottoNote: {
    tr: "tenshi — “melek”; Ame halkının ona verdiği ad, AniList künyesinde de kayıtlı.",
    en: "tenshi — “angel”; the name Ame's people gave her, also recorded on her AniList profile.",
  },
  credit: {
    tr: "Künye verileri (doğum, kan grubu, yaş, unvanlar) ve yedek portre AniList'ten alınmıştır; boy satırı o kayıtta bulunmadığı için yazılmadı. Sayfadaki tam boy portre arşivin kendi yüklemesidir. Kâğıt çiçek, kat çizgileri, kanatlar, düşen yapraklar ve katlama şeması bu sayfa için elle çizilmiş SVG'lerdir.",
    en: "Profile data (birthday, blood type, age, titles) and the fallback portrait come from AniList; height is absent from that record, so no height is claimed here. The full-size portrait is the archive's own upload. The paper flower, the crease lines, the wings, the falling sheets and the folding diagram are SVGs drawn by hand for this page.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList profile" },
} as const;
