import type { LocalizedText } from "./types";

/**
 * Eikichi Onizuka — "İZLEME" (tracking) deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 434 kaydının ABILITY yuvaları,
 * `onz:*` anahtarlarıyla.
 *
 * ── BU SAYFA NEDEN AYKIRI ────────────────────────────────────────────────
 * Arşivdeki 41 sayfanın hepsinde bir GÜÇ var: çakra, reiatsu, lanetli enerji,
 * titan. Burada hiçbiri yok. Onizuka'nın "tekniği" ikinci dan karate, günlük
 * antrenman iddiası ve hileyle alınmış bir öğretmenlik diploması. Sayfa bunu
 * gizlemiyor, tam tersine konusu yapıyor: iki KANAL var, biri adamın sesi,
 * diğeri resmî kayıt — ve ikisi birbirini tutmuyor.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (3 Ağustos), yaş (22), cinsiyet ve portre AniList kaydından
 * (karakter 434, 30 Ağustos 2026 — `/anime/characters/434` üzerinden
 * doğrulandı). Seslendiren (Wataru Takagi) ve dizinin yılı (1999) aynı
 * yanıtın `appearances` dizisinden.
 *
 * ⚠️ AniList kaydında KAN GRUBU ve BOY YOK (`bloodType: null`, `traits: []`).
 * Künye şeridinde ikisi de "kayıt yok" olarak duruyor — uydurulmadı.
 * ⚠️ DOĞUM YILI da yok (`dateOfBirth.year: null`); yaştan bir yıl
 * TÜRETİLMEDİ.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada tırnak içine alınan üç şey var ve üçünün de kaynağı belli:
 *   1. 「オレは22歳、独身、グレートティーチャー・オニヅカだ！」 — Onizuka'nın
 *      kendini tanıtma cümlesi (GTO).
 *   2–3. AniList künyesinin İngilizce özetinden iki kısa parça — resmî
 *      kaydın kendi dilinde, kaynağı yazılı olarak anılıyor.
 * Emin olunmayan hiçbir cümle tırnağa alınmadı; okul/öğrenci hikâyeleri
 * anlatı olarak yazıldı, replik olarak değil.
 *
 * ── TERMİNOLOJİ ──────────────────────────────────────────────────────────
 * 鬼爆コンビ (Onibaku Konbi — Onizuka + Ryuji Danma ikilisi, Shōnan yılları),
 * 聖林学園 (Seirin Gakuen — Holy Forest Akademisi), 3年4組 (san-nen yon-kumi
 * — üçüncü sınıf dördüncü şube), 空手二段 (karate ni-dan), 教員免許 (kyōin
 * menkyo — öğretmenlik ehliyeti), カワサキ750RS「Z2」 (motosikleti).
 * Türkçeleri arşivin kendi karşılıkları.
 *
 * ⚠️ OKUL ADI — ÜÇ UYARLAMA ÜÇ AYRI AD, KARIŞTIRMASI KOLAY (30 Ağustos
 * 2026'da düzeltildi; ja.wikipedia「GTO (漫画)」ile doğrulandı):
 *     manga (1997)      → 東京吉祥学苑  Tōkyō Kichijō Gakuen
 *     TV animesi (1999) → 聖林学園      Seirin Gakuen      ← BU SAYFA
 *     dizi (1998)       → 武蔵野聖林学苑 Musashino Seirin Gakuen
 * Sayfa animeyi kaynak aldığı için 聖林学園 doğru olan. İlk yazımda
 * 聖林学苑 yazılmıştı — 園 yerine 苑, yani DİZİNİN kanjisi. Tek karakter
 * ama sayfanın tezi belgesel titizlik olduğu için sözünü bozuyordu.
 * "Holy Forest Academy" 聖林学園'ın yerleşik İngilizce karşılığı, doğru.
 */

export const ONIZUKA_ID = 434;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const ONIZUKA_SITE_URL = "https://anilist.co/character/434";

/**
 * Arşivdeki seri sayfası. Onizuka GTO kadrosunda arşivin TEK kaydı olduğu
 * için sayfa başka bir karaktere bağ veremiyor (BRIEF: "Onizuka'nın bağı
 * yok"); bağ seri sayfasına gidiyor. Slug 30 Ağustos 2026'da arşiv listesinden
 * doğrulandı (`/anime` → `gto-great-teacher-onizuka`).
 */
export const ONIZUKA_SERIES_SLUG = "gto-great-teacher-onizuka";

/**
 * Depodaki resmî portre (Faz 2 kararı: hotlink yok, dosya repoda).
 * ⚠️ 230×345 — KÜÇÜK. Büyük hero karesi olarak kullanılmıyor; polaroid
 * kadrajında duruyor, geniş kare küratör yuvası olarak boş bekliyor.
 */
export const ONIZUKA_PORTRAIT = {
  src: "/assets/anime/karakterler/eikichi-onizuka/anilist-portrait.png",
  w: 230,
  h: 345,
} as const;

/**
 * Sergi görselleri — hepsi characterId 434 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `onz:` önekli (küratör modu şartı).
 */
export const ONIZUKA_IMAGE_KEYS = {
  hero: "onz:hero",
  karate: "onz:karate",
  onibaku: "onz:onibaku",
  drill: "onz:nikka",
  bike: "onz:z2",
  licence: "onz:menkyo",
  classroom: "onz:34kumi",
  cresta: "onz:cresta",
  tapeYoshikawa: "onz:tape-yoshikawa",
  tapeAizawa: "onz:tape-aizawa",
  tapeKanzaki: "onz:tape-kanzaki",
  tapeMurai: "onz:tape-murai",
  tapeNomura: "onz:tape-nomura",
  fateShonan: "onz:fate-shonan",
  fateDegree: "onz:fate-daigaku",
  fateJobless: "onz:fate-mushoku",
  fateHolyForest: "onz:fate-seirin",
  fateGto: "onz:fate-gto",
  closing: "onz:closing",
} as const;

/** `CuratorSlot` PORTRAIT yuvası — künye özetinde de bir satırı var. */
export const ONIZUKA_PORTRAIT_SLOT = "PORTRAIT";

export interface OnizukaSlotSpec {
  label: LocalizedText;
  /** `CuratorGaps` satırındaki "ne beklendiği" metni */
  spec: LocalizedText;
  size: { w: number; h: number };
}

/**
 * Yuva künyesi — etiket, beklenen kare ve ölçü tek yerde.
 *
 * `CuratorSlot` `label` + `size` okuyor, sayfanın altındaki `CuratorGaps`
 * `label` + `spec`. Üçünü ayrı haritalarda tutmak, birinin diğerinden
 * ayrışmasına açık kapı bırakıyordu.
 */
export const ONIZUKA_SLOTS: Record<string, OnizukaSlotSpec> = {
  [ONIZUKA_PORTRAIT_SLOT]: {
    label: {
      tr: "Portre — tam boy dikey kare; depodaki 230×345'i ezer",
      en: "Portrait — full-size vertical frame; overrides the repo's 230×345",
    },
    spec: { tr: "dikey portre · 1200×1600 · webp", en: "vertical portrait · 1200×1600 · webp" },
    size: { w: 1200, h: 1600 },
  },
  [ONIZUKA_IMAGE_KEYS.hero]: {
    label: {
      tr: "Hero — geniş kadraj: Onizuka ve motosiklet, okul bahçesi (16:9)",
      en: "Hero — wide frame: Onizuka and the bike, the schoolyard (16:9)",
    },
    spec: { tr: "geniş kadraj · 1600×900 · webp", en: "wide frame · 1600×900 · webp" },
    size: { w: 1600, h: 900 },
  },
  [ONIZUKA_IMAGE_KEYS.karate]: {
    label: { tr: "Karate — duruş ya da tek vuruş, yakın çekim", en: "Karate — a stance or a single strike, close crop" },
    spec: { tr: "yatay kart · 960×540 · webp", en: "landscape card · 960×540 · webp" },
    size: { w: 960, h: 540 },
  },
  [ONIZUKA_IMAGE_KEYS.onibaku]: {
    label: { tr: "Onibaku — Onizuka ve Ryuji Danma yan yana", en: "Onibaku — Onizuka and Ryuji Danma side by side" },
    spec: { tr: "yatay kart · 960×540 · webp", en: "landscape card · 960×540 · webp" },
    size: { w: 960, h: 540 },
  },
  [ONIZUKA_IMAGE_KEYS.drill]: {
    label: { tr: "Günlük antrenman — şınav, barfiks, ağırlık", en: "The daily drill — push-ups, pull-ups, weights" },
    spec: { tr: "yatay kart · 960×540 · webp", en: "landscape card · 960×540 · webp" },
    size: { w: 960, h: 540 },
  },
  [ONIZUKA_IMAGE_KEYS.bike]: {
    label: { tr: "Kawasaki 750RS «Z2» — motosiklet, yandan", en: "Kawasaki 750RS “Z2” — the bike, side view" },
    spec: { tr: "kare kart · 640×640 · webp", en: "square card · 640×640 · webp" },
    size: { w: 640, h: 640 },
  },
  [ONIZUKA_IMAGE_KEYS.licence]: {
    label: { tr: "Öğretmenlik ehliyeti — belge, masa üstü", en: "The teaching licence — a document on a desk" },
    spec: { tr: "kare kart · 640×640 · webp", en: "square card · 640×640 · webp" },
    size: { w: 640, h: 640 },
  },
  [ONIZUKA_IMAGE_KEYS.classroom]: {
    label: { tr: "3年4組 — sınıf, arka sıralar, kara tahta", en: "Class 3-4 — the room, the back rows, the blackboard" },
    spec: { tr: "kare kart · 640×640 · webp", en: "square card · 640×640 · webp" },
    size: { w: 640, h: 640 },
  },
  [ONIZUKA_IMAGE_KEYS.cresta]: {
    label: { tr: "Cresta — Uchiyamada'nın arabası, hasarlı", en: "The Cresta — Uchiyamada's car, damaged" },
    spec: { tr: "kare kart · 640×640 · webp", en: "square card · 640×640 · webp" },
    size: { w: 640, h: 640 },
  },
  [ONIZUKA_IMAGE_KEYS.tapeYoshikawa]: {
    label: { tr: "Kaset 00:04 — çatı, korkuluk, iki figür", en: "Tape 00:04 — the roof, the railing, two figures" },
    spec: { tr: "kaset karesi · 1024×576 · webp", en: "tape still · 1024×576 · webp" },
    size: { w: 1024, h: 576 },
  },
  [ONIZUKA_IMAGE_KEYS.tapeAizawa]: {
    label: { tr: "Kaset 00:17 — sınıfın önü, tek öğrenci ayakta", en: "Tape 00:17 — the front of the class, one student standing" },
    spec: { tr: "kaset karesi · 1024×576 · webp", en: "tape still · 1024×576 · webp" },
    size: { w: 1024, h: 576 },
  },
  [ONIZUKA_IMAGE_KEYS.tapeKanzaki]: {
    label: { tr: "Kaset 00:31 — boş sıra, pencere kenarı", en: "Tape 00:31 — an empty desk by the window" },
    spec: { tr: "kaset karesi · 1024×576 · webp", en: "tape still · 1024×576 · webp" },
    size: { w: 1024, h: 576 },
  },
  [ONIZUKA_IMAGE_KEYS.tapeMurai]: {
    label: { tr: "Kaset 00:46 — koridor, karşı karşıya duran ikili", en: "Tape 00:46 — a corridor, two people facing off" },
    spec: { tr: "kaset karesi · 1024×576 · webp", en: "tape still · 1024×576 · webp" },
    size: { w: 1024, h: 576 },
  },
  [ONIZUKA_IMAGE_KEYS.tapeNomura]: {
    label: { tr: "Kaset 01:02 — sahne ışığı, tek kişi", en: "Tape 01:02 — a stage light, one person" },
    spec: { tr: "kaset karesi · 1024×576 · webp", en: "tape still · 1024×576 · webp" },
    size: { w: 1024, h: 576 },
  },
  [ONIZUKA_IMAGE_KEYS.fateShonan]: {
    label: { tr: "Shōnan — sahil yolu, gece, motosikletler", en: "Shōnan — the coast road at night, motorcycles" },
    spec: { tr: "geniş şerit · 1280×720 · webp", en: "wide strip · 1280×720 · webp" },
    size: { w: 1280, h: 720 },
  },
  [ONIZUKA_IMAGE_KEYS.fateDegree]: {
    label: { tr: "Diploma — sınav salonu ya da mezuniyet karesi", en: "The degree — an exam hall or a graduation frame" },
    spec: { tr: "geniş şerit · 1280×720 · webp", en: "wide strip · 1280×720 · webp" },
    size: { w: 1280, h: 720 },
  },
  [ONIZUKA_IMAGE_KEYS.fateJobless]: {
    label: { tr: "İşsizlik — alışveriş merkezi, boş gün", en: "Unemployment — a shopping mall, an empty day" },
    spec: { tr: "geniş şerit · 1280×720 · webp", en: "wide strip · 1280×720 · webp" },
    size: { w: 1280, h: 720 },
  },
  [ONIZUKA_IMAGE_KEYS.fateHolyForest]: {
    label: { tr: "Holy Forest — okul cephesi, ilk gün", en: "Holy Forest — the school facade, day one" },
    spec: { tr: "geniş şerit · 1280×720 · webp", en: "wide strip · 1280×720 · webp" },
    size: { w: 1280, h: 720 },
  },
  [ONIZUKA_IMAGE_KEYS.fateGto]: {
    label: { tr: "GTO — sınıfın önünde, tebeşir elde", en: "GTO — in front of the class, chalk in hand" },
    spec: { tr: "geniş şerit · 1280×720 · webp", en: "wide strip · 1280×720 · webp" },
    size: { w: 1280, h: 720 },
  },
  [ONIZUKA_IMAGE_KEYS.closing]: {
    label: { tr: "Kapanış — boş sınıf ya da gece yolu, düşük kontrast", en: "Closing — an empty classroom or a night road, low contrast" },
    spec: { tr: "geniş kadraj · 1600×900 · webp", en: "wide frame · 1600×900 · webp" },
    size: { w: 1600, h: 900 },
  },
};

/** `CuratorGaps` satırlarının sırası — sayfadaki sırayla aynı. */
export const ONIZUKA_SLOT_ORDER: string[] = [
  ONIZUKA_IMAGE_KEYS.hero,
  ONIZUKA_PORTRAIT_SLOT,
  ONIZUKA_IMAGE_KEYS.karate,
  ONIZUKA_IMAGE_KEYS.onibaku,
  ONIZUKA_IMAGE_KEYS.drill,
  ONIZUKA_IMAGE_KEYS.bike,
  ONIZUKA_IMAGE_KEYS.licence,
  ONIZUKA_IMAGE_KEYS.classroom,
  ONIZUKA_IMAGE_KEYS.cresta,
  ONIZUKA_IMAGE_KEYS.tapeYoshikawa,
  ONIZUKA_IMAGE_KEYS.tapeAizawa,
  ONIZUKA_IMAGE_KEYS.tapeKanzaki,
  ONIZUKA_IMAGE_KEYS.tapeMurai,
  ONIZUKA_IMAGE_KEYS.tapeNomura,
  ONIZUKA_IMAGE_KEYS.fateShonan,
  ONIZUKA_IMAGE_KEYS.fateDegree,
  ONIZUKA_IMAGE_KEYS.fateJobless,
  ONIZUKA_IMAGE_KEYS.fateHolyForest,
  ONIZUKA_IMAGE_KEYS.fateGto,
  ONIZUKA_IMAGE_KEYS.closing,
];

/* ── Breadcrumb ─────────────────────────────────────────────────────────── */

export const ONIZUKA_CRUMB = {
  series: { tr: "GTO · Great Teacher Onizuka", en: "GTO · Great Teacher Onizuka" },
} as const;

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const ONIZUKA_IDENTITY = {
  name: "Eikichi Onizuka",
  nativeName: "鬼塚英吉",
  /** Hero filigranı — dekoratif (aria-hidden) */
  watermark: "鬼塚",
  eyebrow: {
    tr: "Holy Forest Akademisi · 3年4組 sınıf öğretmeni",
    en: "Holy Forest Academy · homeroom teacher of Class 3-4",
  },
  epigraph: {
    tr: "Arşivdeki herkesin bir gücü var. Bu adamın ikinci dan karatesi, hileyle alınmış bir diploması ve bir motosikleti var — ve listedeki en zor işi o yapıyor.",
    en: "Everyone else in this archive has a power. This man has a second-dan black belt, a degree he cheated for, and a motorcycle — and he has the hardest job on the list.",
  },
  facts: [
    {
      label: { tr: "Doğum günü", en: "Birthday" },
      value: { tr: "3 Ağustos", en: "3 August" },
    },
    { label: { tr: "Yaş", en: "Age" }, value: { tr: "22", en: "22" } },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "Kayıt yok", en: "Not on record" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "Kayıt yok", en: "Not on record" },
    },
    {
      label: { tr: "Unvan", en: "Title" },
      value: {
        tr: "Öğretmen — 聖林学園, 3年4組",
        en: "Teacher — 聖林学園, Class 3-4",
      },
    },
    {
      label: { tr: "Takım", en: "Crew" },
      value: {
        tr: "鬼爆コンビ — Ryuji Danma ile, Shōnan yılları",
        en: "鬼爆コンビ — with Ryuji Danma, the Shōnan years",
      },
    },
    {
      label: { tr: "Sembolik obje", en: "Signature object" },
      value: { tr: "Kawasaki 750RS «Z2»", en: "Kawasaki 750RS “Z2”" },
    },
    {
      label: { tr: "Seslendiren", en: "Voice" },
      value: { tr: "Wataru Takagi (TV, 1999)", en: "Wataru Takagi (TV, 1999)" },
    },
  ],
} as const;

export const ONIZUKA_MISSING_NOTE: LocalizedText = {
  tr: "Boy ve kan grubu AniList kaydında boş (`bloodType: null`, `traits: []`); doğum yılı da yok. Uydurulmadı — kayıt neyi söylüyorsa o yazıyor.",
  en: "Height and blood type are empty on the AniList record (`bloodType: null`, `traits: []`), and there is no birth year either. Nothing was invented — the dossier says what it says.",
};

/* ── Mod düğmesi: DERS ZİLİ ─────────────────────────────────────────────── */

/**
 * Zil sayfanın YAPISINI çeviriyor, ışığını değil:
 *   class  → paneller düzleşiyor (eğim 0), aralıklar eşitleniyor, üst üste
 *            binme kalkıyor, mono etiketler tebeşir çizgisine oturuyor
 *   street → eğim artıyor, paneller birbirine biniyor, gren ve halftone
 *            kabarıyor, asfalt tonu zemine basıyor
 */
export const ONIZUKA_BELL = {
  label: { tr: "DERS ZİLİ", en: "CLASS BELL" },
  classState: { tr: "SINIF", en: "CLASS" },
  streetState: { tr: "SOKAK", en: "STREET" },
  toClass: { tr: "Zili çal — sınıfa geç", en: "Ring the bell — go to class" },
  toStreet: { tr: "Zili çal — sokağa çık", en: "Ring the bell — go to the street" },
  classHint: {
    tr: "Ders başladı: paneller hizalandı, aralar eşitlendi, gren kısıldı.",
    en: "Class is in: panels straightened, the gaps evened out, the grain turned down.",
  },
  streetHint: {
    tr: "Zil çaldı: paneller eğildi ve üst üste bindi, gren açıldı, asfalt bastı.",
    en: "Bell's gone: panels tilted and started overlapping, grain up, asphalt in.",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const ONIZUKA_SECTIONS = {
  identity: {
    /** Panelin sol üstündeki mono işaret — kaset kutusundaki sıra numarası */
    mark: { tr: "001 / ETİKET", en: "001 / LABEL" },
    title: { tr: "KÜNYE ŞERİDİ", en: "THE LABEL STRIP" },
    lede: {
      tr: "Kasetin sırtındaki etiket. Yazılı olanı yazdık; yazılı olmayanı boş bıraktık.",
      en: "The label on the spine of the tape. What is written is written; what is not was left blank.",
    },
  },
  record: {
    mark: { tr: "002 / SİCİL", en: "002 / RECORD" },
    title: { tr: "SİCİL", en: "THE RECORD" },
    lede: {
      tr: "Teknik yok, jutsu yok, quirk yok. Elinde ne varsa o: bir kuşak, bir ikili, bir günlük program — ve dört tane eşya.",
      en: "No technique, no jutsu, no quirk. Only what he actually has: a belt, a duo, a daily routine — and four objects.",
    },
  },
  tape: {
    mark: { tr: "003 / KASET", en: "003 / TAPE" },
    title: { tr: "KASET · 3年4組", en: "THE TAPE · CLASS 3-4" },
    lede: {
      tr: "Beş kayıt, tek kaset. Kaset yıpranmış: her kaydın üstünde bir izleme bandı duruyor ve bandı düzeltmeden altındaki satır okunmuyor. Konumu seç, sonra TRACKING ile temizle.",
      en: "Five recordings, one tape. The tape is worn: a tracking band sits over every entry, and the line beneath it will not read until you fix the picture. Pick a position, then clean it with TRACKING.",
    },
  },
  fate: {
    mark: { tr: "004 / SAYAÇ", en: "004 / COUNTER" },
    title: { tr: "SAYAÇ", en: "THE COUNTER" },
    lede: {
      tr: "Sokaktan sınıfa beş durak. Yaşlar AniList künyesinden ve serinin kendi kronolojisinden; kesin olmayanların önünde ~ var.",
      en: "Five stops from the street to the classroom. Ages from the AniList dossier and the series' own chronology; the uncertain ones are marked with ~.",
    },
  },
  closing: {
    mark: { tr: "005 / STEREO", en: "005 / STEREO" },
    title: { tr: "İKİ KANAL", en: "TWO CHANNELS" },
    lede: {
      tr: "Kaset stereo. A kanalında adamın kendi sesi var, B kanalında resmî kayıt. İkisi aynı kişiyi anlatıyor ve birbirini tutmuyor.",
      en: "The tape is stereo. Channel A carries the man's own voice, channel B the official record. They describe the same person and they do not agree.",
    },
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const ONIZUKA_HERO = {
  lede: {
    tr: "Yirmi iki yaşında, bekâr ve Japonya'nın en zor sınıfının öğretmeni. Kadroda süper gücü olmayan tek kişi; sınıfı tek başına devralan da o.",
    en: "Twenty-two, single, and the teacher of the hardest class in Japan. The only one on the roster without a power — and the only one who took a classroom on alone.",
  },
  portraitCaption: {
    tr: "AniList resmî portresi · 230×345 — depodaki dosya",
    en: "AniList official portrait · 230×345 — the file in the repo",
  },
  portraitAlt: {
    tr: "Eikichi Onizuka — AniList resmî portresi",
    en: "Eikichi Onizuka — AniList official portrait",
  },
  portraitAltUploaded: {
    tr: "Eikichi Onizuka — arşive yüklenmiş portre",
    en: "Eikichi Onizuka — portrait uploaded to the archive",
  },
  frameLabel: { tr: "GENİŞ KADRAJ", en: "WIDE FRAME" },
  frameEmpty: {
    tr: "Bu kare boş. Depodaki portre 230×345 — bir hero için küçük, o yüzden burada değil aşağıdaki polaroid'de duruyor. Geniş kareyi küratör yükleyecek.",
    en: "This frame is empty. The portrait in the repo is 230×345 — too small for a hero, so it sits in the polaroid below instead. The wide frame is for the curator to fill.",
  },
} as const;

/* ── SİCİL — üç büyük kart ──────────────────────────────────────────────── */

export interface OnizukaRecordCard {
  key: string;
  kanji: string;
  reading: string;
  name: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
  imageKey: string;
}

export const ONIZUKA_RECORD_MAJOR: OnizukaRecordCard[] = [
  {
    key: "karate",
    kanji: "空手二段",
    reading: "karate ni-dan",
    name: { tr: "Karate — ikinci dan", en: "Karate — second dan" },
    tagline: {
      tr: "Sayfadaki tek resmî yetkinlik.",
      en: "The only formally certified skill on this page.",
    },
    text: {
      tr: "AniList künyesinin verdiği tek dövüş derecesi bu: ikinci dan siyah kuşak. Dojo terbiyesi değil, sokakta sınanmış bir teknik — Onizuka duruşunu bozar, kuralı boşverir, ama uzaklık ve zamanlama duygusu eğitimden gelir. Sınıfta bir kere bile öğrencisine karşı kullanmıyor; kullandığı yerler hep dışarısı.",
      en: "The only combat grade the AniList dossier gives: a second-dan black belt. Not dojo etiquette but a technique tested on the street — Onizuka breaks his stance and ignores the rulebook, yet the sense of distance and timing comes from training. He never once uses it on a student; every time he does use it, it is outside the school.",
    },
    traits: [
      { tr: "Kayıtlı derece", en: "Recorded grade" },
      { tr: "Sokakta sınanmış", en: "Street-tested" },
      { tr: "Sınıfın içinde asla", en: "Never inside the classroom" },
    ],
    imageKey: ONIZUKA_IMAGE_KEYS.karate,
  },
  {
    key: "onibaku",
    kanji: "鬼爆コンビ",
    reading: "Onibaku Konbi",
    name: { tr: "Onibaku ikilisi", en: "The Onibaku duo" },
    tagline: {
      tr: "Bir kişi değil, bir çift olarak tanınıyordu.",
      en: "He was known not as one person but as half of a pair.",
    },
    text: {
      tr: "Shōnan yıllarında Onizuka ve Ryuji Danma tek isimle anılıyordu: 鬼爆. İkisi de motosikletli, ikisi de dövüşle tanınmış; şöhretleri okuldan değil bölgeden geliyordu. GTO'nun bütün itibarı buradan devrediliyor — sınıf ona ilk gün bir öğretmen olarak değil, adı duyulmuş biri olarak bakıyor. Ryuji, Onizuka öğretmen olduktan sonra da yanında kalıyor.",
      en: "In the Shōnan years Onizuka and Ryuji Danma were spoken of under a single name: 鬼爆. Both on motorcycles, both known for fighting; their reputation came from the district, not the school. All of GTO's credit is inherited from here — on day one the class does not look at him as a teacher but as a name it has heard. Ryuji stays at his side after he becomes a teacher, too.",
    },
    traits: [
      { tr: "Shōnan", en: "Shōnan" },
      { tr: "Ryuji Danma", en: "Ryuji Danma" },
      { tr: "İtibar okuldan gelmiyor", en: "Reputation not earned at school" },
    ],
    imageKey: ONIZUKA_IMAGE_KEYS.onibaku,
  },
  {
    key: "drill",
    kanji: "日課",
    reading: "nikka",
    name: { tr: "Günlük program", en: "The daily routine" },
    tagline: {
      tr: "500 · 1000 · 2000 — ve 150 kg. Kaydın söylediği bu.",
      en: "500 · 1000 · 2000 — and 150 kg. That is what the record says.",
    },
    text: {
      tr: "AniList künyesi net: 150 kiloluk bench press yapabiliyor, günde 500 şınav, 1000 barfiks ve 2000 squat yaptığını İDDİA ediyor. Künyenin kendi fiili «claims» — yani rakamların kaynağı Onizuka'nın ağzı. Sayfa bu ayrımı koruyor: ölçülen tek şey 150 kilo, geri kalanı bir adamın kendi hakkında söylediği şey. GTO'nun bütün komedisi tam olarak bu boşlukta duruyor.",
      en: "The AniList dossier is explicit: he can bench press 150 kg, and he *claims* to do 500 push-ups, 1000 pull-ups and 2000 squats a day. The dossier's own verb is “claims” — the source of those numbers is Onizuka's own mouth. This page keeps the distinction: the only measured figure is the 150 kg; the rest is what a man says about himself. All of GTO's comedy lives in exactly that gap.",
    },
    traits: [
      { tr: "Ölçülen: 150 kg", en: "Measured: 150 kg" },
      { tr: "İddia edilen: 3500 tekrar", en: "Claimed: 3,500 reps" },
      { tr: "Kaynak: kendisi", en: "Source: himself" },
    ],
    imageKey: ONIZUKA_IMAGE_KEYS.drill,
  },
];

/* ── SİCİL — dört küçük kart ────────────────────────────────────────────── */

export interface OnizukaKitCard {
  key: string;
  kanji: string;
  reading: string;
  name: LocalizedText;
  note: LocalizedText;
  imageKey: string;
}

export const ONIZUKA_RECORD_MINOR: OnizukaKitCard[] = [
  {
    key: "bike",
    kanji: "カワサキ750RS",
    reading: "Z2",
    name: { tr: "Motosiklet", en: "The motorcycle" },
    note: {
      tr: "Yetmişlerin ağır Japon motoru. Onizuka'nın tek sabit mülkü ve sokak kimliğinin devamı: öğretmen olduktan sonra da okula onunla geliyor.",
      en: "A heavy Japanese machine from the seventies. Onizuka's one fixed possession and the surviving half of his street identity: he still rides it to school after he becomes a teacher.",
    },
    imageKey: ONIZUKA_IMAGE_KEYS.bike,
  },
  {
    key: "licence",
    kanji: "教員免許",
    reading: "kyōin menkyo",
    name: { tr: "Öğretmenlik ehliyeti", en: "The teaching licence" },
    note: {
      tr: "Alt sıradaki bir üniversiteden, kopya çekerek alınmış bir diploma üstüne yazılmış. Sayfanın en kirli belgesi ve en çok işe yarayanı.",
      en: "Written on top of a degree obtained by cheating at a bottom-rung university. The dirtiest document on this page and the most useful one.",
    },
    imageKey: ONIZUKA_IMAGE_KEYS.licence,
  },
  {
    key: "class",
    kanji: "3年4組",
    reading: "san-nen yon-kumi",
    name: { tr: "Üçüncü sınıf, dördüncü şube", en: "Third year, class four" },
    note: {
      tr: "Holy Forest'ın öğretmen kıran sınıfı. Onizuka'ya veriliyor çünkü kimse almıyor; sayfanın kaseti de bu sınıfın kaydı.",
      en: "Holy Forest's teacher-breaking class. It is handed to Onizuka because nobody else will take it; the tape on this page is that class's recording.",
    },
    imageKey: ONIZUKA_IMAGE_KEYS.classroom,
  },
  {
    key: "cresta",
    kanji: "クレスタ",
    reading: "Kuresuta",
    name: { tr: "Uchiyamada'nın Cresta'sı", en: "Uchiyamada's Cresta" },
    note: {
      tr: "Müdür yardımcısının göz bebeği araba. Serinin en sadık tekrar eden şakası: Onizuka her ilerlediğinde Cresta bir yerinden daha gidiyor.",
      en: "The vice-principal's beloved car. The series' most faithful running gag: every time Onizuka gets somewhere, another piece of the Cresta goes.",
    },
    imageKey: ONIZUKA_IMAGE_KEYS.cresta,
  },
];

/* ── KASET — sayfanın kalbi ─────────────────────────────────────────────── */

export interface OnizukaTapeSegment {
  key: string;
  /** Kaset sayacı — sahte zaman kodu, sayfanın kendi ölçüsü */
  counter: string;
  name: string;
  romaji: string;
  role: LocalizedText;
  /** İzleme bandı bozukken de görünen satır */
  picture: LocalizedText;
  /** TRACKING 1'de açılan satır */
  record: LocalizedText;
  /** TRACKING 2'de açılan satır */
  afterword: LocalizedText;
  imageKey: string;
}

export const ONIZUKA_TAPE: OnizukaTapeSegment[] = [
  {
    key: "yoshikawa",
    counter: "00:04",
    name: "吉川のぼる",
    romaji: "Noboru Yoshikawa",
    role: { tr: "Sınıfın en sessizi", en: "The quietest one in the room" },
    picture: {
      tr: "Parası alınıyor, eşyaları kayboluyor, adı yoklamada okunuyor ve orada bitiyor. Sınıfın geri kalanı onu görmüyor; öğretmenler de görmüyor.",
      en: "His money is taken, his things go missing, his name is read at roll call and that is where it ends. The rest of the class does not see him; neither do the teachers.",
    },
    record: {
      tr: "Onizuka onu okulun çatısında, korkuluğun dışında buluyor. Aşağı inmesi için ikna etmeye çalışmıyor — aynı korkuluğa çıkıyor ve orada duruyor.",
      en: "Onizuka finds him on the school roof, on the wrong side of the railing. He does not try to talk him down — he climbs onto the same railing and stands there.",
    },
    afterword: {
      tr: "Sayfanın ilk dersi: Onizuka kimseyi yukarıdan kurtarmıyor. Aynı hizaya geçiyor, riski paylaşıyor ve ancak ondan sonra konuşuyor.",
      en: "The tape's first lesson: Onizuka never rescues anyone from above. He moves to the same level, takes on the same risk, and only then speaks.",
    },
    imageKey: ONIZUKA_IMAGE_KEYS.tapeYoshikawa,
  },
  {
    key: "aizawa",
    counter: "00:17",
    name: "相沢雅",
    romaji: "Miyabi Aizawa",
    role: { tr: "Sınıfın elebaşı", en: "The one who leads the class" },
    picture: {
      tr: "3年4組'in öğretmen kırma yöntemi hazır ve denenmiş: kayıt tut, iftira at, veliyi çağır. Onizuka'dan önceki öğretmenler bu yöntemle gitti.",
      en: "Class 3-4's method for breaking a teacher is ready and proven: keep a record, make an accusation, call the parents. The teachers before Onizuka left this way.",
    },
    record: {
      tr: "Miyabi'nin öfkesi sınıfa ait değil, kişisel: daha önce güvendiği bir öğretmen onu satmıştı. Yöntem bir intikamın kurumsallaşmış hâli.",
      en: "Miyabi's anger does not belong to the class; it is personal. A teacher she once trusted sold her out. The method is a private revenge turned into an institution.",
    },
    afterword: {
      tr: "Onizuka suçlamayı reddetmiyor, üstüne gidiyor: yalanı çürütmek yerine yalanın neden kurulduğunu soruyor. Sınıfın silahı orada işlevsizleşiyor.",
      en: "Onizuka does not deny the accusation; he walks into it. Instead of disproving the lie he asks why the lie was built. That is where the class's weapon stops working.",
    },
    imageKey: ONIZUKA_IMAGE_KEYS.tapeAizawa,
  },
  {
    key: "kanzaki",
    counter: "00:31",
    name: "神崎麗美",
    romaji: "Urumi Kanzaki",
    role: { tr: "IQ 200", en: "IQ 200" },
    picture: {
      tr: "Sırası boş. Yıllardır okula düzenli gelmiyor ve geldiğinde odadaki herkesten hızlı düşünüyor — öğretmenler dâhil.",
      en: "Her desk is empty. She has not attended regularly for years, and when she does she thinks faster than anyone in the room — the teachers included.",
    },
    record: {
      tr: "Onizuka'yı zekâsıyla köşeye sıkıştırıyor ve sıkıştırdığını da ona kanıtlıyor. Onizuka karşılık vermeye çalışmıyor: yenildiğini kabul edip kalıyor.",
      en: "She corners Onizuka with sheer intelligence and proves to him that she has. Onizuka does not try to match her: he concedes the point and stays.",
    },
    afterword: {
      tr: "Kaset burada bir kere daha aynı şeyi söylüyor: bu adamın gücü akıl değil, terk etmemek. Zekâ yarışını kaybetmesi hikâyeyi bitirmiyor.",
      en: "Here the tape says the same thing once more: this man's power is not intellect, it is not leaving. Losing the contest of wits does not end the story.",
    },
    imageKey: ONIZUKA_IMAGE_KEYS.tapeKanzaki,
  },
  {
    key: "murai",
    counter: "00:46",
    name: "村井国男",
    romaji: "Kunio Murai",
    role: { tr: "Sınıfın ön saftaki sesi", en: "The class's voice at the front" },
    picture: {
      tr: "İlk saldıran o. Sınıfın sözcüsü, en gürültülüsü ve öğretmen kırma işinin sahadaki yürütücüsü.",
      en: "He is the first to attack. The class's spokesman, the loudest of them, and the one who actually carries out the teacher-breaking.",
    },
    record: {
      tr: "Onizuka'nın kazandığı ilk öğrenci de o. Kazanma biçimi ders vermek değil: Murai'nin evine, ailesine ve derdine, öğretmenin gitmeyeceği yere kadar giriyor.",
      en: "He is also the first student Onizuka wins over. Not by teaching him a lesson: Onizuka walks into Murai's home, his family and his trouble — further than a teacher is supposed to go.",
    },
    afterword: {
      tr: "Bir sınıfı ikna etmenin yolu sınıf değil. Onizuka teker teker giriyor ve sınıf, ilk kişiyi kaybettiği anda blok olmaktan çıkıyor.",
      en: "The way to persuade a class is not the class. Onizuka goes in one at a time, and the moment it loses its first member the class stops being a bloc.",
    },
    imageKey: ONIZUKA_IMAGE_KEYS.tapeMurai,
  },
  {
    key: "nomura",
    counter: "01:02",
    name: "野村トモコ",
    romaji: "Tomoko Nomura",
    role: { tr: "Ekranda olmak isteyen", en: "The one who wants to be on screen" },
    picture: {
      tr: "Sınıfın en düşük notları onda. Derste sorulan hiçbir soruya cevabı yok; tek istediği şey televizyona çıkmak.",
      en: "She has the lowest marks in the class. She has no answer to a single question asked in the lesson; the one thing she wants is to be on television.",
    },
    record: {
      tr: "Onizuka onu ne düzeltiyor ne vazgeçiriyor. Hedefini ciddiye alıyor ve o hedefi kullanarak onu avlamaya çalışanların önüne geçiyor.",
      en: "Onizuka neither corrects her nor talks her out of it. He takes the goal seriously — and steps in front of the people who would use that goal to prey on her.",
    },
    afterword: {
      tr: "Kasetin son kaydı en açık olanı: bu öğretmenin işi öğrencisini kendine benzetmek değil, kendisi olmasının bedelini düşürmek.",
      en: "The last entry on the tape is the plainest: this teacher's job is not to make the student resemble him, but to lower the price of her being herself.",
    },
    imageKey: ONIZUKA_IMAGE_KEYS.tapeNomura,
  },
];

/** Kaset çubuğunun bütün arayüz metinleri — adaya düz dize olarak iniyor. */
export const ONIZUKA_TAPE_UI = {
  groupLabel: { tr: "Kaset izleme çubuğu", en: "Tape tracking scrubber" },
  positionsLabel: { tr: "KONUM", en: "POSITION" },
  prev: { tr: "Geri sar", en: "Rewind" },
  next: { tr: "İleri sar", en: "Fast-forward" },
  counterLabel: { tr: "SAYAÇ", en: "COUNTER" },
  /** VHS ekran işareti — iki dilde de aynı cihaz jargonu */
  recLabel: { tr: "REC", en: "REC" },
  trackingLabel: { tr: "TRACKING", en: "TRACKING" },
  trackingUp: { tr: "İzlemeyi düzelt", en: "Improve tracking" },
  trackingDown: { tr: "İzlemeyi boz", en: "Degrade tracking" },
  trackingStates: [
    { tr: "BOZUK — bandın altı okunmuyor", en: "BROKEN — the line beneath will not read" },
    { tr: "YARIM — kayıt açıldı, iz hâlâ kapalı", en: "HALF — the entry is open, the trace still is not" },
    { tr: "TEMİZ — kaydın tamamı görünür", en: "CLEAN — the whole entry is visible" },
  ],
  recordLabel: { tr: "KAYIT", en: "ENTRY" },
  afterLabel: { tr: "İZ", en: "TRACE" },
  pictureLabel: { tr: "GÖRÜNTÜ", en: "PICTURE" },
  lockedNote: {
    tr: "Bandın altı kapalı. TRACKING'i bir kademe düzelt.",
    en: "The line beneath the band is closed. Step the TRACKING up once.",
  },
  halfNote: {
    tr: "Bir kademe daha var: kaydın izi hâlâ kapalı.",
    en: "One step left: the trace of this entry is still closed.",
  },
  cleanNote: {
    tr: "Bu kayıt temiz. Başka bir konuma geçebilirsin — bu konumun ayarı hatırlanıyor.",
    en: "This entry is clean. Move to another position — this one remembers its setting.",
  },
  hint: {
    tr: "Klavye: konum düğmeleri arasında sekme, TRACKING düğmeleriyle netleştir. Her konum kendi ayarını saklıyor.",
    en: "Keyboard: tab between the position buttons, sharpen with the TRACKING buttons. Every position keeps its own setting.",
  },
  frameEmpty: {
    tr: "Bu konumun karesi boş — kayıt metinle çalışıyor, görsel gelince yerine oturur.",
    en: "This position has no still — the entry works on text alone, and the image drops in when it arrives.",
  },
} as const;

/* ── SAYAÇ — beş durak ──────────────────────────────────────────────────── */

export interface OnizukaFateEntry {
  key: string;
  age: LocalizedText;
  counter: string;
  native: string;
  title: LocalizedText;
  text: LocalizedText;
  quote?: {
    text: LocalizedText;
    lang: string;
    reading: LocalizedText;
    by: LocalizedText;
  };
  imageKey: string;
}

export const ONIZUKA_TIMELINE: OnizukaFateEntry[] = [
  {
    key: "shonan",
    age: { tr: "~17 · lise yılları", en: "~17 · the school years" },
    counter: "00:00",
    native: "鬼爆コンビ",
    title: { tr: "Shōnan — ikilinin yarısı", en: "Shōnan — half of a duo" },
    text: {
      tr: "Onizuka'nın hikâyesi bir sınıfta değil sahil yolunda başlıyor: Ryuji Danma ile birlikte bölgenin tanıdığı bir isim. Dövüş, motosiklet, gece. Bu dönemin kaydı GTO'nun değil, ondan önceki serinin — Shonan Junai Gumi.",
      en: "Onizuka's story begins on a coast road, not in a classroom: a name the district knows, alongside Ryuji Danma. Fights, motorcycles, night. This stretch is recorded not by GTO but by the series before it — Shonan Junai Gumi.",
    },
    imageKey: ONIZUKA_IMAGE_KEYS.fateShonan,
  },
  {
    key: "degree",
    age: { tr: "~20 · üniversite", en: "~20 · university" },
    counter: "00:21",
    native: "大学",
    title: { tr: "Kopyayla alınan diploma", en: "The degree he cheated for" },
    text: {
      tr: "AniList künyesi bu adımı tek cümlede özetliyor: alt sıradaki bir üniversiteden kopya çekerek mezun oluyor. Sayfanın en önemli ayrıntısı bu — Onizuka'nın öğretmenliği bir liyakat hikâyesi olarak başlamıyor.",
      en: "The AniList dossier compresses this step into one sentence: he graduates from a bottom-rung university by cheating. It is the most important detail on this page — Onizuka's teaching career does not begin as a story of merit.",
    },
    imageKey: ONIZUKA_IMAGE_KEYS.fateDegree,
  },
  {
    key: "jobless",
    age: { tr: "22 · iş yok", en: "22 · no job" },
    counter: "00:38",
    native: "無職",
    title: { tr: "Diploması olan işsiz", en: "Unemployed, with a degree" },
    text: {
      tr: "Diploma bir iş getirmiyor. Künyeye göre günleri alışveriş merkezinde geçiyor. Öğretmen olma kararı da tam burada, hiç de yüce olmayan bir sebeple veriliyor — ve karar, sebebinden daha uzun yaşıyor.",
      en: "The degree does not produce a job. According to the dossier his days pass in a shopping mall. The decision to become a teacher is taken right here, for a thoroughly ignoble reason — and the decision outlives the reason.",
    },
    quote: {
      text: {
        tr: "cannot get a decent job",
        en: "cannot get a decent job",
      },
      lang: "en",
      reading: {
        tr: "«doğru düzgün bir iş bulamıyor»",
        en: "“cannot get a decent job”",
      },
      by: {
        tr: "AniList künyesi, karakter #434 — resmî kaydın kendi cümlesinden",
        en: "AniList dossier, character #434 — from the official record's own sentence",
      },
    },
    imageKey: ONIZUKA_IMAGE_KEYS.fateJobless,
  },
  {
    key: "holyforest",
    age: { tr: "22 · ilk gün", en: "22 · day one" },
    counter: "00:52",
    native: "聖林学園 3年4組",
    title: { tr: "Kimsenin almadığı sınıf", en: "The class nobody would take" },
    text: {
      tr: "Holy Forest Akademisi'ne alınıyor ve ona 3年4組 veriliyor: öğretmenlerini teker teker kıran, yöntemi oturmuş bir sınıf. Sınıfın hesabı basit — bu da diğerleri gibi birkaç haftada gider.",
      en: "He is taken on at Holy Forest Academy and handed Class 3-4: a room that has broken its teachers one by one, with a method that works. The class's calculation is simple — this one will last a few weeks like the rest.",
    },
    imageKey: ONIZUKA_IMAGE_KEYS.fateHolyForest,
  },
  {
    key: "gto",
    age: { tr: "22 · kalıyor", en: "22 · he stays" },
    counter: "01:19",
    native: "グレート・ティーチャー・オニヅカ",
    title: { tr: "Great Teacher Onizuka", en: "Great Teacher Onizuka" },
    text: {
      tr: "Sınıf yöntemini uyguluyor ve yöntem işlemiyor: iftira tutmuyor, veli baskısı tutmuyor, taciz tutmuyor. Çünkü Onizuka'nın kaybedecek itibarı yok ve gitmeye niyeti hiç yok. Unvanı kimse vermiyor — kendi takıyor, sonra sınıf onaylıyor.",
      en: "The class runs its method and the method fails: the accusation does not stick, the parental pressure does not stick, the harassment does not stick. Because Onizuka has no reputation to lose and no intention whatsoever of leaving. Nobody awards him the title — he gives it to himself, and the class ratifies it afterwards.",
    },
    imageKey: ONIZUKA_IMAGE_KEYS.fateGto,
  },
];

/* ── Kapanış — iki kanal ────────────────────────────────────────────────── */

export const ONIZUKA_CLOSING = {
  channels: [
    {
      tag: { tr: "A KANALI · KENDİ SESİ", en: "CHANNEL A · HIS OWN VOICE" },
      text: {
        tr: "オレは22歳、独身、グレートティーチャー・オニヅカだ！",
        en: "オレは22歳、独身、グレートティーチャー・オニヅカだ！",
      },
      lang: "ja",
      reading: {
        tr: "«Ben yirmi iki yaşındayım, bekârım, Great Teacher Onizuka'yım!»",
        en: "“I'm twenty-two, single, and I'm Great Teacher Onizuka!”",
      },
      by: { tr: "Eikichi Onizuka — kendini tanıtırken (GTO)", en: "Eikichi Onizuka — introducing himself (GTO)" },
      note: {
        tr: "Unvanı bir kurum vermiyor, cümlenin içinde kendisi veriyor. Yaşı ve medeni hâli de aynı nefeste — çünkü onun için üçü aynı bilgi.",
        en: "No institution grants the title; he grants it inside the sentence itself. His age and marital status ride in the same breath — because to him all three are one fact.",
      },
    },
    {
      tag: { tr: "B KANALI · RESMÎ KAYIT", en: "CHANNEL B · THE OFFICIAL RECORD" },
      text: {
        tr: "graduated from a bottom-rung university by cheating",
        en: "graduated from a bottom-rung university by cheating",
      },
      lang: "en",
      reading: {
        tr: "«alt sıradaki bir üniversiteden kopya çekerek mezun oldu»",
        en: "“graduated from a bottom-rung university by cheating”",
      },
      by: { tr: "AniList künyesi, karakter #434", en: "AniList dossier, character #434" },
      note: {
        tr: "Aynı adam hakkında ikinci cümle. Kayıt yalan söylemiyor; sadece işin en zor kısmını ölçemiyor — çünkü o kısım bir belgeye yazılmıyor.",
        en: "The second sentence about the same man. The record is not lying; it simply cannot measure the hardest part of the job — because that part does not go on a document.",
      },
    },
  ],
  motto: "グレート・ティーチャー・オニヅカ",
  mottoNote: {
    tr: "Gurēto Tīchā Onizuka — serinin adı ve Onizuka'nın kendine taktığı unvan. Sayfanın tezi de burada: unvan, kaydın değil kişinin üstünde duruyor.",
    en: "Gurēto Tīchā Onizuka — the series' name and the title Onizuka pins on himself. This is the page's thesis too: the title sits on the person, not on the record.",
  },
  nexusLead: {
    tr: "Onizuka arşivde GTO kadrosunun tek elle tasarlanmış dosyası. Kadro bağı yerine serinin kendi sayfası:",
    en: "Onizuka is the only hand-built file from the GTO cast in this archive. Instead of a cast link, the series' own page:",
  },
  nexusLabel: { tr: "GTO · Great Teacher Onizuka — arşiv kaydı", en: "GTO · Great Teacher Onizuka — archive entry" },
  credit: {
    tr: "Künye, yaş, doğum günü, seslendiren ve portre AniList'ten; portre dosyası depoda (`anilist-portrait.png`, 230×345). Sayfadaki motosiklet, zil ve kaset motifleri elle çizilmiş SVG'dir.",
    en: "Dossier, age, birthday, voice actor and portrait from AniList; the portrait file lives in the repo (`anilist-portrait.png`, 230×345). The motorcycle, bell and tape motifs on this page are hand-drawn SVG.",
  },
  creditLink: {
    tr: "AniList · Eikichi Onizuka #434",
    en: "AniList · Eikichi Onizuka #434",
  },
} as const;

/* ── Küratör özeti ──────────────────────────────────────────────────────── */

export const ONIZUKA_GAPS = {
  title: { tr: "Boş kareler — Onizuka", en: "Empty frames — Onizuka" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bütün kareler dolu. Kaset baştan sona temiz.",
    en: "Every frame is filled. The tape is clean end to end.",
  },
} as const;

/* ── Ortak alt metinler ─────────────────────────────────────────────────── */

export const ONIZUKA_ALT = {
  /** Boş kadrajların üstündeki işaret — bölüm görselsiz de tam çalışıyor */
  emptyFrame: { tr: "BOŞ KARE", en: "EMPTY FRAME" },
} as const;
