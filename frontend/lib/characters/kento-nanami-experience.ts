import type { LocalizedText } from "./types";

/**
 * Kento Nanami — "Mesai" deneyim sayfasının veri iskeleti.
 *
 * ── BU DOSYA NEDEN YENİDEN YAZILDI ───────────────────────────────────────
 * 25 Ağustos 2026'daki ilk Nanami sayfası ("Yedi Üçe") beş JJK sayfasıyla
 * birlikte reddedildi: hepsi aynı şablondan çıkmıştı. Eski set
 * `components/character/.deprecated/kento-nanami/` altındaydı; 2026-09-01'de
 * silindi (denetim B-06), git geçmişinde duruyor. Buradaki METİNLERİN bir
 * kısmı oradan taşındı (biyografi,
 * kronoloji, iki replik); ama görsel kimlik, mekanik ve terminoloji baştan
 * kuruldu. Eski mekanik (tahmin → ölç → kes, hep %70) yasak listesinde.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (3 Temmuz), yaş (27), boy (184 cm), derece (1. sınıf büyücü),
 * meslek, bağlı olduğu yer ve teknik satırı depodaki künye dosyasından
 * birebir alındı: `public/assets/anime/karakterler/kento-nanami/kaynak.json`
 * (AniList #133704 çekimi). Takma adlar da orada: "Nanamin", "7:3 Sorcerer".
 *
 * ⚠️ DOĞUM YILI ve KAN GRUBU KAYITTA YOK. İkisi de boş bırakıldı; yaştan
 * bir yıl TÜRETİLMEDİ. Sayfa bu iki boşluğu gider raporundaki "açıklanmayan
 * kalem" satırı olarak GÖSTERİYOR — gizlemiyor.
 *
 * ── TERMİNOLOJİ: YALNIZCA JUJUTSU KAISEN ─────────────────────────────────
 * 呪術 (jujutsu) · 呪力 (lanet enerjisi) · 十劃呪法 (Oran Tekniği) ·
 * 黒閃 (kara şimşek) · 反転術式 (ters lanet tekniği) · 縛り (bağlayıcı
 * yemin) · 呪具 (lanetli alet) · 呪霊 (lanetli ruh) · 一級呪術師 (birinci
 * sınıf büyücü) · 時間外労働 (mesai dışı çalışma). Bleach ya da Naruto
 * sözlüğünden tek kelime geçmiyor.
 *
 * ⚠️ Derece yazımı: görev belgesi "呪術師一級" diyor, kanonik dizilim
 * **一級呪術師** (sıfat önce). Doğru dizilim yazıldı; anlam aynı.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Tırnak içinde iki cümle var: 「労働はクソだ」 ve Shibuya'daki son sözü
 * 「あとは頼みます」. Emin olunmayan hiçbir cümle tırnağa alınmadı; kalan
 * her şey anlatı.
 */

export const NANAMI_ID = 133704;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const NANAMI_SITE_URL = "https://anilist.co/character/133704";

/**
 * Depodaki resmî portre. 230×345 — KÜÇÜK, o yüzden yalnızca dar bir
 * "personel kartı" kadrajında kullanılıyor; büyük kare küratör yuvası.
 */
export const NANAMI_PORTRAIT = {
  src: "/assets/anime/karakterler/kento-nanami/anilist-portrait.png",
  w: 230,
  h: 345,
} as const;

/** Küratör yuvaları — hepsi characterId 133704 kaydında, ABILITY yuvasında. */
export const NANAMI_IMAGE_KEYS = {
  hero: "nan:hero",
  ratio: "nan:jukkaku",
  overtime: "nan:jikangai",
  flash: "nan:kokusen",
  toolBlade: "nan:jugu",
  toolGrade: "nan:ikkyu",
  toolEnergy: "nan:juryoku",
  toolReverse: "nan:hanten",
  clock: "nan:tokei",
  fateSchool: "nan:kayit-haibara",
  fateQuit: "nan:kayit-taishoku",
  fateReturn: "nan:kayit-fukushoku",
  fateJunpei: "nan:kayit-junpei",
  fateShibuya: "nan:kayit-shibuya",
  closing: "nan:closing",
} as const;

/** Yuva etiketleri — yükleyen kişi ne beklendiğini okur. */
export const NANAMI_SLOT_LABELS: Record<string, LocalizedText> = {
  [NANAMI_IMAGE_KEYS.hero]: {
    tr: "Hero — takım elbise, çizgili kravat, gözlük; sakin duruş",
    en: "Hero — suit, striped tie, tinted glasses; a still stance",
  },
  [NANAMI_IMAGE_KEYS.ratio]: {
    tr: "Oran Tekniği — hedefin üstünde beliren bölme çizgisi",
    en: "Ratio Technique — the division line appearing across the target",
  },
  [NANAMI_IMAGE_KEYS.overtime]: {
    tr: "Mesai dışı çalışma — saat geçtikten sonraki ilk vuruş",
    en: "Overtime — the first strike after the hour has passed",
  },
  [NANAMI_IMAGE_KEYS.flash]: {
    tr: "Kara şimşek — çarpmanın olduğu andaki kıvılcım",
    en: "Black Flash — the spark at the instant of impact",
  },
  [NANAMI_IMAGE_KEYS.toolBlade]: {
    tr: "Lanetli alet — kör ağızlı satır, yakın çekim",
    en: "Cursed tool — the blunt cleaver, close crop",
  },
  [NANAMI_IMAGE_KEYS.toolGrade]: {
    tr: "Birinci sınıf — görev bildirimi, kimlik kartı",
    en: "Grade 1 — a mission notice, an ID card",
  },
  [NANAMI_IMAGE_KEYS.toolEnergy]: {
    tr: "Lanet enerjisi — ele toplanan akış",
    en: "Cursed energy — the flow gathering in the hand",
  },
  [NANAMI_IMAGE_KEYS.toolReverse]: {
    tr: "Ters lanet tekniği — sözlük kadrajı, figürsüz",
    en: "Reverse cursed technique — a glossary frame, no figure",
  },
  [NANAMI_IMAGE_KEYS.clock]: {
    tr: "Mesai saati — duvar saati ya da metro saati, geniş kadraj",
    en: "The working hour — a wall or station clock, wide crop",
  },
  [NANAMI_IMAGE_KEYS.fateSchool]: {
    tr: "Okul yılları — üniformalı iki öğrenci",
    en: "The school years — two students in uniform",
  },
  [NANAMI_IMAGE_KEYS.fateQuit]: {
    tr: "İstifa — masa, kravat, floresan ışık",
    en: "The resignation — a desk, a tie, fluorescent light",
  },
  [NANAMI_IMAGE_KEYS.fateReturn]: {
    tr: "Dönüş — takım elbise ve satır bir arada",
    en: "The return — the suit and the cleaver together",
  },
  [NANAMI_IMAGE_KEYS.fateJunpei]: {
    tr: "Junpei kaydı — sinema salonu, iki kişi",
    en: "The Junpei entry — a cinema, two people",
  },
  [NANAMI_IMAGE_KEYS.fateShibuya]: {
    tr: "Shibuya — metro koridoru, duman",
    en: "Shibuya — a station corridor, smoke",
  },
  [NANAMI_IMAGE_KEYS.closing]: {
    tr: "Kapanış — boş bir ofis koridoru ya da sahil, düşük kontrast",
    en: "Closing — an empty office corridor or a shoreline, low contrast",
  },
};

/** Beklenen kare: tip + ölçü. Yalnızca yöneticiye gösteriliyor. */
export const NANAMI_SLOT_SPECS: Record<string, LocalizedText> = {
  [NANAMI_IMAGE_KEYS.hero]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [NANAMI_IMAGE_KEYS.ratio]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [NANAMI_IMAGE_KEYS.overtime]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [NANAMI_IMAGE_KEYS.flash]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [NANAMI_IMAGE_KEYS.toolBlade]: {
    tr: "küçük kadraj · 900×600 · webp",
    en: "small frame · 900×600 · webp",
  },
  [NANAMI_IMAGE_KEYS.toolGrade]: {
    tr: "küçük kadraj · 900×600 · webp",
    en: "small frame · 900×600 · webp",
  },
  [NANAMI_IMAGE_KEYS.toolEnergy]: {
    tr: "küçük kadraj · 900×600 · webp",
    en: "small frame · 900×600 · webp",
  },
  [NANAMI_IMAGE_KEYS.toolReverse]: {
    tr: "küçük kadraj · 900×600 · webp",
    en: "small frame · 900×600 · webp",
  },
  [NANAMI_IMAGE_KEYS.clock]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [NANAMI_IMAGE_KEYS.fateSchool]: {
    tr: "kayıt kadrajı · 1200×800 · webp",
    en: "record frame · 1200×800 · webp",
  },
  [NANAMI_IMAGE_KEYS.fateQuit]: {
    tr: "kayıt kadrajı · 1200×800 · webp",
    en: "record frame · 1200×800 · webp",
  },
  [NANAMI_IMAGE_KEYS.fateReturn]: {
    tr: "kayıt kadrajı · 1200×800 · webp",
    en: "record frame · 1200×800 · webp",
  },
  [NANAMI_IMAGE_KEYS.fateJunpei]: {
    tr: "kayıt kadrajı · 1200×800 · webp",
    en: "record frame · 1200×800 · webp",
  },
  [NANAMI_IMAGE_KEYS.fateShibuya]: {
    tr: "kayıt kadrajı · 1200×800 · webp",
    en: "record frame · 1200×800 · webp",
  },
  [NANAMI_IMAGE_KEYS.closing]: {
    tr: "bant · 1920×720 · webp",
    en: "band · 1920×720 · webp",
  },
};

export const NANAMI_SLOT_SIZES: Record<string, { w: number; h: number }> = {
  [NANAMI_IMAGE_KEYS.hero]: { w: 1600, h: 900 },
  [NANAMI_IMAGE_KEYS.ratio]: { w: 1600, h: 900 },
  [NANAMI_IMAGE_KEYS.overtime]: { w: 1600, h: 900 },
  [NANAMI_IMAGE_KEYS.flash]: { w: 1600, h: 900 },
  [NANAMI_IMAGE_KEYS.toolBlade]: { w: 900, h: 600 },
  [NANAMI_IMAGE_KEYS.toolGrade]: { w: 900, h: 600 },
  [NANAMI_IMAGE_KEYS.toolEnergy]: { w: 900, h: 600 },
  [NANAMI_IMAGE_KEYS.toolReverse]: { w: 900, h: 600 },
  [NANAMI_IMAGE_KEYS.clock]: { w: 1600, h: 900 },
  [NANAMI_IMAGE_KEYS.fateSchool]: { w: 1200, h: 800 },
  [NANAMI_IMAGE_KEYS.fateQuit]: { w: 1200, h: 800 },
  [NANAMI_IMAGE_KEYS.fateReturn]: { w: 1200, h: 800 },
  [NANAMI_IMAGE_KEYS.fateJunpei]: { w: 1200, h: 800 },
  [NANAMI_IMAGE_KEYS.fateShibuya]: { w: 1200, h: 800 },
  [NANAMI_IMAGE_KEYS.closing]: { w: 1920, h: 720 },
};

export const NANAMI_PORTRAIT_SLOT: LocalizedText = {
  tr: "Personel kartı — dikey portre · 1200×1600 · webp",
  en: "Personnel card — vertical portrait · 1200×1600 · webp",
};

/** Boş kadrajın yöneticiye görünen tek kelimesi. */
export const NANAMI_FRAME_EMPTY: LocalizedText = {
  tr: "Kadraj boş",
  en: "Frame empty",
};

export const NANAMI_CRUMB = {
  series: { tr: "Jujutsu Kaisen", en: "Jujutsu Kaisen" },
} as const;

export const NANAMI_ALT = {
  /** Her sahne `alt`ının önüne geliyor — kaynağı da söylüyor. */
  scenePrefix: {
    tr: "Kento Nanami — arşive küratör tarafından yüklenen kare:",
    en: "Kento Nanami — frame uploaded to the archive by the curator:",
  },
  companionSuffix: {
    tr: "portresi (arşiv kaydı)",
    en: "portrait (archive record)",
  },
} as const;

/**
 * Bandın sağ hücresindeki SABİT notlar — açılabilir kayıt taşımayan
 * bantlarda (bölüm başlıkları, bağlar, kapanış) defter boş kalmasın diye.
 * Metinleri soldakinin tekrarı DEĞİL: defter kendi diliyle konuşuyor.
 */
export const NANAMI_SIDE_NOTES = {
  arts: {
    label: { tr: "Kalem grubu", en: "Item group" },
    value: "A-01 / A-03",
    note: {
      tr: "Üç ana kalemin üçü de aynı bütçeden çıkıyor: lanet enerjisi. Defterde ayrı satırlar, kasada tek hesap.",
      en: "All three principal items are drawn from the same budget: cursed energy. Separate lines in the ledger, one account in the till.",
    },
  },
  tools: {
    label: { tr: "Kalem grubu", en: "Item group" },
    value: "B-01 / B-04",
    note: {
      tr: "Dört ek kalemin biri bilerek boş. Doldurulamayan satırı silmek, raporu düzeltmek değil bozmaktır.",
      en: "One of the four secondary items is deliberately blank. Deleting a line you cannot fill does not tidy a report, it falsifies it.",
    },
  },
  fate: {
    label: { tr: "Kayıt grubu", en: "Entry group" },
    value: "C-01 / C-05",
    note: {
      tr: "Beş kaydın dördü mesai içinde açılıyor. Sonuncusu açılmıyor — Nanami'nin son günü bir tercih değildi.",
      en: "Four of the five entries open during working hours. The last one does not — Nanami's final day was not a choice.",
    },
  },
  bonds: {
    label: { tr: "Bağlı kayıtlar", en: "Linked entries" },
    value: "05",
    note: {
      tr: "Beş isim, iki yön: ikisi Nanami'ye bakıyor (çırağı, kurtaramadığı çocuk), üçü ona karşı duruyor.",
      en: "Five names, two directions: two of them look to Nanami (his student, the boy he could not save); three stand opposite him.",
    },
  },
  closing: {
    label: { tr: "Vardiya kapanışı", en: "Shift close" },
    value: "七海建人",
    note: {
      tr: "Defterin son satırı imzasız. Nanami hiçbir kaydı kendi adıyla kapatmadı; kapanışı hep başkası yazdı.",
      en: "The last line of the ledger is unsigned. Nanami never closed a record with his own name; someone else always wrote the close.",
    },
  },
} as const;

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const NANAMI_IDENTITY = {
  name: "Kento Nanami",
  nativeName: "七海建人",
  /** Filigran — dekoratif (aria-hidden) */
  watermark: "七海建人",
  house: {
    tr: "Tokyo Jujutsu Lisesi mezunu · 一級呪術師",
    en: "Tokyo Jujutsu High alumnus · 一級呪術師",
  },
  houseReading: {
    tr: "Ikkyū jujutsushi — birinci sınıf büyücü",
    en: "Ikkyū jujutsushi — first grade sorcerer",
  },
  epigraph: {
    tr: "Mesaisi olan bir büyücü. Saat dokuzda başlıyor, altıda bitiriyor ve bittiğinde bunu yüksek sesle söylüyor.",
    en: "A sorcerer with working hours. He starts at nine, finishes at six, and when it is finished he says so out loud.",
  },
} as const;

export const NANAMI_HERO = {
  lede: {
    tr: "Nanami jujutsu dünyasına bir kahraman olarak değil, işe giden bir adam olarak dönüyor. Tekniği bir ölçü, silahı kör bir satır, disiplini bir sözleşme. Bu sayfanın düzeni de aynı sözleşmeyi taşıyor: sol yedi, sağ üç. Sol sütun anlatı, sağ sütun mesai defteri — ve oran hiçbir yerde değişmiyor.",
    en: "Nanami returns to the jujutsu world not as a hero but as a man going to work. His technique is a measure, his weapon a blunt cleaver, his discipline a contract. This page carries the same contract: seven on the left, three on the right. The left column is the account, the right is the shift ledger — and the ratio never changes anywhere.",
  },
  /** Küratör bir PORTRAIT yüklediyse bu okunuyor. */
  portraitAltUploaded: {
    tr: "Kento Nanami — arşivin yüklediği portre",
    en: "Kento Nanami — portrait uploaded by the archive",
  },
  /** Yükleme yoksa depodaki resmî kare okunuyor. */
  portraitAltRepo: {
    tr: "Kento Nanami — AniList resmî portresi (depodaki 230×345 kopya)",
    en: "Kento Nanami — official AniList portrait (230×345 copy in the repository)",
  },
  heroCaption: {
    tr: "Bu kadraj boş: depodaki resmî portre 230×345, geniş bir kare için küçük. Büyük kare küratörün yükleyeceği görseli bekliyor.",
    en: "This frame is empty: the official portrait in the repository is 230×345, too small for a wide frame. The large frame is waiting for the curator's upload.",
  },
  cardLabel: { tr: "Personel kartı", en: "Personnel card" },
  cardNumber: "133704",
  cardRole: { tr: "Büyücü · birinci sınıf", en: "Sorcerer · first grade" },
} as const;

/* ── Mod düğmesi: "Mesai bitti" ─────────────────────────────────────────── */

export const NANAMI_OVERTIME = {
  title: { tr: "Kurumsal katman", en: "The corporate layer" },
  native: "時間外労働",
  enter: { tr: "Mesai bitti", en: "The day is over" },
  exit: { tr: "Mesaiye dön", en: "Back on the clock" },
  hintOff: {
    tr: "Mesai sürüyor. Lacivert açık, defter sayıyor, her şey yerinde duruyor.",
    en: "The day is still running. The navy is light, the ledger is counting, everything is in its place.",
  },
  hintOn: {
    tr: "Mesai bitti. Lacivert koyulaştı, altın öne çıktı ve sağ sütun bir fazla mesai kaydına döndü.",
    en: "The day is over. The navy has deepened, the gold has come forward, and the right column has become an overtime record.",
  },
  autoNote: {
    tr: "Saat 18:00'e geldiğinde bu katman kendiliğinden düşüyor. Düğme yalnızca görünüşü çeviriyor; kilitleri saat belirliyor.",
    en: "When the clock reaches 18:00 this layer falls on its own. The button only turns the appearance; the locks are decided by the clock.",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const NANAMI_SECTIONS = {
  report: {
    title: { tr: "Gider raporu", en: "Expense report" },
    lede: {
      tr: "Künye bir tanıtım değil bir kalem listesi. Doldurulamayan iki satır boş bırakıldı ve dipnotta sayıldı.",
      en: "The dossier is not an introduction but a list of line items. Two lines could not be filled; they were left blank and counted in the footnote.",
    },
  },
  arts: {
    title: { tr: "Üç ana kalem", en: "Three principal items" },
    lede: {
      tr: "Bir lanetli teknik, bir bağlayıcı yemin ve bir kayıt. Üçü de aynı cümleyi kuruyor: doğru yere vur, gerisini bırak.",
      en: "A cursed technique, a binding vow, and a record. All three make the same sentence: hit the right place and leave the rest.",
    },
  },
  tools: {
    title: { tr: "Dört ek kalem", en: "Four secondary items" },
    lede: {
      tr: "Alet, derece, yakıt ve arşivde boş kalan bir satır.",
      en: "The tool, the grade, the fuel, and a line that stayed blank in the archive.",
    },
  },
  clock: {
    title: { tr: "Mesai saati", en: "The working hour" },
    lede: {
      tr: "Sayfanın kalbi. Saati sen çeviremiyorsun — okuduğun her kayıt bir saat harcıyor. Gün dokuz saat; kayıt on iki tane.",
      en: "The heart of the page. You cannot turn the clock — every record you open spends an hour. The day is nine hours long; there are twelve records.",
    },
  },
  fate: {
    title: { tr: "Beş kayıt", en: "Five entries" },
    lede: {
      tr: "Bir ölüm, bir istifa, bir dönüş, kurtarılamayan bir çocuk ve bir devir.",
      en: "A death, a resignation, a return, a boy who was not saved, and a handover.",
    },
  },
  bonds: {
    title: { tr: "Bağlar", en: "Ties" },
    lede: {
      tr: "Beş isim. Arşivde dosyası olan bağlantılı, olmayan düz adla yazılı.",
      en: "Five names. Those with a file in the archive are linked; those without are plain text.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "Son cümlesi bir veda değil, bir iş devriydi.",
      en: "His last sentence was not a farewell but a handover of work.",
    },
  },
} as const;

/* ── Gider raporu (künye şeridi) ────────────────────────────────────────── */

export interface NanamiExpenseRow {
  /** Kalem numarası — çevrilmez */
  code: string;
  item: LocalizedText;
  entry: LocalizedText;
  source: LocalizedText;
  /** Kayıtta karşılığı yok — bilerek boş */
  blank?: boolean;
}

export const NANAMI_EXPENSE: NanamiExpenseRow[] = [
  {
    code: "01",
    item: { tr: "Doğum günü", en: "Date of birth" },
    entry: { tr: "03.07", en: "03.07" },
    source: { tr: "AniList künyesi", en: "AniList record" },
  },
  {
    code: "02",
    item: { tr: "Doğum yılı", en: "Year of birth" },
    entry: { tr: "—", en: "—" },
    source: { tr: "kayıtta yok", en: "absent from the record" },
    blank: true,
  },
  {
    code: "03",
    item: { tr: "Yaş", en: "Age" },
    entry: { tr: "27", en: "27" },
    source: { tr: "AniList künyesi", en: "AniList record" },
  },
  {
    code: "04",
    item: { tr: "Boy", en: "Height" },
    entry: { tr: "184 cm", en: "184 cm" },
    source: { tr: "AniList açıklaması", en: "AniList description" },
  },
  {
    code: "05",
    item: { tr: "Kan grubu", en: "Blood type" },
    entry: { tr: "—", en: "—" },
    source: { tr: "kayıtta yok", en: "absent from the record" },
    blank: true,
  },
  {
    code: "06",
    item: { tr: "Derece", en: "Grade" },
    entry: { tr: "一級呪術師 · birinci sınıf", en: "一級呪術師 · first grade" },
    source: { tr: "AniList künyesi", en: "AniList record" },
  },
  {
    code: "07",
    item: { tr: "Bağlı olduğu yer", en: "Affiliation" },
    entry: { tr: "Tokyo Jujutsu Lisesi", en: "Tokyo Jujutsu High" },
    source: { tr: "AniList künyesi", en: "AniList record" },
  },
  {
    code: "08",
    item: { tr: "Lanetli teknik", en: "Cursed technique" },
    entry: { tr: "十劃呪法 · Oran", en: "十劃呪法 · Ratio" },
    source: { tr: "AniList künyesi", en: "AniList record" },
  },
  {
    code: "09",
    item: { tr: "Takma adları", en: "Also known as" },
    entry: { tr: "Nanamin · 7:3 büyücüsü", en: "Nanamin · the 7:3 sorcerer" },
    source: { tr: "AniList künyesi", en: "AniList record" },
  },
];

export const NANAMI_EXPENSE_UI = {
  colCode: { tr: "Kalem", en: "Item" },
  colItem: { tr: "Açıklama", en: "Description" },
  colEntry: { tr: "Kayıt", en: "Entry" },
  colSource: { tr: "Kaynak", en: "Source" },
  totalLabel: { tr: "Açıklanmayan kalem", en: "Unaccounted items" },
  totalValue: "2 / 9",
  footnote: {
    tr: "İki satır boş: doğum yılı ve kan grubu kayıtta yok. Yaştan bir yıl türetilmedi — türetilen sayı kayıt değil tahmindir.",
    en: "Two lines are blank: the year of birth and the blood type are absent from the record. No year was derived from the age — a derived number is a guess, not a record.",
  },
  tableLabel: {
    tr: "Kento Nanami künye kalemleri",
    en: "Kento Nanami dossier line items",
  },
  scrollHint: {
    tr: "Tablo dar ekranda yatay kayar.",
    en: "The table scrolls sideways on a narrow screen.",
  },
  /** Defterde açıldığında beliren kenar notu — soldaki dipnotun tekrarı değil. */
  record: {
    tr: "Kenar notu: doğum günü 3 Temmuz. Adındaki 七海 «yedi deniz», tekniği 7:3, sayfanın ızgarası 7:3. Aynı iki sayı üç ayrı yerde duruyor ve hiçbiri tesadüf gibi durmuyor.",
    en: "Margin note: his birthday is 3 July. The 七海 in his name means “seven seas”, his technique is 7:3, this page's grid is 7:3. The same two numbers stand in three separate places, and none of them looks like a coincidence.",
  },
} as const;

/* ── Üç ana kalem (büyük kartlar) ───────────────────────────────────────── */

export interface NanamiArt {
  key: string;
  /** Kayıt numarası — çevrilmez */
  code: string;
  kanji: string;
  romaji: string;
  turkish: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
  imageKey: string;
  entry: NanamiEntry;
}

/** Mesai defterinde açılabilen bir kayıt — bir saat harcıyor. */
export interface NanamiEntry {
  /** Saat mekaniğindeki benzersiz kimlik */
  id: string;
  label: LocalizedText;
  /** Açıldığında beliren kenar notu */
  record: LocalizedText;
}

export const NANAMI_ARTS: NanamiArt[] = [
  {
    key: "ratio",
    code: "A-01",
    kanji: "十劃呪法",
    romaji: "Jukkaku Juhō",
    turkish: { tr: "Oran Tekniği", en: "Ratio Technique" },
    tagline: {
      tr: "Lanetli teknik. Gördüğü her şeyi yediye üç böler.",
      en: "The cursed technique. It divides everything he sees seven to three.",
    },
    text: {
      tr: "Teknik hasar üretmiyor; hedefin üstünde bir çizgi belirliyor — uzunluğu yüzde yetmişe yüzde otuz bölen nokta. O nokta hedefin zayıf yeri oluyor ve oraya inen vuruş, aynı vuruşun başka bir yere inmesinden kat kat ağır. Nanami'nin gücü kolundan değil, nereye vuracağını bilmesinden geliyor: teknik bir silah değil bir ölçü aleti.",
      en: "The technique produces no damage; it marks a line on the target — the point that splits its length seventy to thirty. That point becomes the target's weak spot, and a blow landing there is worth many times the same blow landing anywhere else. Nanami's power comes not from his arm but from knowing where to put it: the technique is not a weapon but a measuring instrument.",
    },
    traits: [
      { tr: "Hasar üretmez", en: "Produces no damage" },
      { tr: "Canlı-cansız ayırmaz", en: "Does not distinguish living from dead" },
      { tr: "Ölçek tanımaz", en: "Has no scale" },
    ],
    imageKey: NANAMI_IMAGE_KEYS.ratio,
    entry: {
      id: "art-ratio",
      label: { tr: "Oran Tekniği", en: "Ratio Technique" },
      record: {
        tr: "Kenar notu: teknik lanet enerjisini büyütmüyor, ONU YERİNDEN TASARRUF ediyor. Aynı 呪力 ile daha az iş harcayan bir büyücü, daha uzun çalışabilen bir büyücüdür.",
        en: "Margin note: the technique does not enlarge cursed energy, it SPENDS LESS OF IT. A sorcerer who wastes less 呪力 on the same job is a sorcerer who can work longer.",
      },
    },
  },
  {
    key: "overtime",
    code: "A-02",
    kanji: "時間外労働",
    romaji: "Jikangai Rōdō",
    turkish: { tr: "Mesai Dışı Çalışma", en: "Overtime" },
    tagline: {
      tr: "Bağlayıcı yemin (縛り). Saatin ötesinde ödenen fazla mesai.",
      en: "A binding vow (縛り). Extra hours, paid past the clock.",
    },
    text: {
      tr: "Nanami kendi kendine bir 縛り yapıyor: mesai saatleri içinde belli bir sınırın üstüne çıkmayacak. Karşılığında saat geçtikten SONRA lanet enerjisi ölçülü bir miktarda artıyor. Kendi disiplinini bir kısıtlama olarak yazıp faizini akşam tahsil eden bir hesap — ve bu, bütün karakterin tek cümlelik özeti: kural koyan, kurala uyan, karşılığını alan.",
      en: "Nanami makes a 縛り with himself: within working hours he will not exceed a set limit. In exchange, AFTER the hour has passed, his cursed energy rises by a measured amount. An account that writes his own discipline down as a restriction and collects the interest in the evening — and that is the whole character in one line: he sets a rule, keeps it, and takes what it pays.",
    },
    traits: [
      { tr: "Kendi kendine yemin", en: "A vow with himself" },
      { tr: "Saate bağlı", en: "Bound to the clock" },
      { tr: "Ölçülü artış", en: "A measured increase" },
    ],
    imageKey: NANAMI_IMAGE_KEYS.overtime,
    entry: {
      id: "art-overtime",
      label: { tr: "Mesai Dışı Çalışma", en: "Overtime" },
      record: {
        tr: "Kenar notu: yemin bir hile değil bir sözleşme. Kısıtlamayı bozarsa kazandığı da gider — Nanami'nin saate bu kadar dikkat etmesinin sebebi bu.",
        en: "Margin note: the vow is not a trick but a contract. If he breaks the restriction, the gain goes with it — which is why Nanami watches the clock so closely.",
      },
    },
  },
  {
    key: "flash",
    code: "A-03",
    kanji: "黒閃",
    romaji: "Kokusen",
    turkish: { tr: "Kara Şimşek", en: "Black Flash" },
    tagline: {
      tr: "Kayıtlı en uzun ardışık seri: dört.",
      en: "The longest consecutive run on record: four.",
    },
    text: {
      tr: "黒閃, lanet enerjisinin darbeyle bir anlık sapma içinde çakışması — kuvveti katlıyor ve bilerek üretilemiyor. Nanami'nin ardışık dört kara şimşeği bu yüzden bir gösteri değil bir istatistik: talih değil tekrar. Yıllarca aynı hareketi aynı biçimde yapan bir adamın, tesadüfe en çok yaklaşan hâli.",
      en: "黒閃 is cursed energy colliding with the blow inside a momentary deviation — it multiplies force and cannot be produced on purpose. Nanami's four consecutive Black Flashes are therefore not a display but a statistic: not luck but repetition. It is what a man who performs the same motion the same way for years looks like when he comes closest to chance.",
    },
    traits: [
      { tr: "İstenerek üretilemez", en: "Cannot be produced at will" },
      { tr: "Kuvveti katlar", en: "Multiplies the force" },
      { tr: "Tekrarın ödülü", en: "The reward of repetition" },
    ],
    imageKey: NANAMI_IMAGE_KEYS.flash,
    entry: {
      id: "art-flash",
      label: { tr: "Kara Şimşek", en: "Black Flash" },
      record: {
        tr: "Kenar notu: dört, arşivde kayıtlı en uzun seri. Nanami bunu bir yetenek değil, iyi yapılmış bir işin yan ürünü sayardı.",
        en: "Margin note: four is the longest run in the archive. Nanami would call it not a talent but a by-product of work done properly.",
      },
    },
  },
];

/* ── Dört ek kalem (küçük kartlar) ──────────────────────────────────────── */

export interface NanamiTool {
  key: string;
  code: string;
  kanji: string;
  romaji: string;
  name: LocalizedText;
  note: LocalizedText;
  imageKey: string;
  entry: NanamiEntry;
  /** Evren sayfasındaki çapa — yoksa yazılmıyor */
  anchor?: { id: string; label: LocalizedText };
}

export const NANAMI_TOOLS: NanamiTool[] = [
  {
    key: "blade",
    code: "B-01",
    kanji: "呪具",
    romaji: "Jugu",
    name: { tr: "Lanetli alet", en: "Cursed tool" },
    note: {
      tr: "Taşıdığı alet bilerek körleştirilmiş bir satır. Keskinlik gerekmiyor çünkü isabet zaten garantili: doğru noktaya inen kör bir ağız, yanlış noktaya inen keskin bir ağızdan daha çok iş görüyor.",
      en: "The tool he carries is a deliberately blunted cleaver. Sharpness is unnecessary because the hit is already guaranteed: a blunt edge on the right point does more work than a keen edge on the wrong one.",
    },
    imageKey: NANAMI_IMAGE_KEYS.toolBlade,
    entry: {
      id: "tool-blade",
      label: { tr: "Lanetli alet", en: "Cursed tool" },
      record: {
        tr: "Kenar notu: alet bir imza değil bir malzeme. Kırılırsa yenisi alınır — Nanami hiçbir zaman silahına bir ad vermedi.",
        en: "Margin note: the tool is not a signature but a supply. If it breaks, another is issued — Nanami never gave his weapon a name.",
      },
    },
  },
  {
    key: "grade",
    code: "B-02",
    kanji: "一級呪術師",
    romaji: "Ikkyū Jujutsushi",
    name: { tr: "Birinci sınıf büyücü", en: "Grade 1 sorcerer" },
    note: {
      tr: "Derece bir güç ölçüsü değil bir yetki ölçüsü: hangi görevin kime verileceğini belirliyor. Nanami özel sınıfa terfi etmek için hiçbir girişimde bulunmadı; birinci sınıf, yapmak istediği işin tam karşılığıydı.",
      en: "A grade is not a measure of power but of authority: it decides which mission goes to whom. Nanami never made a move toward special grade; first grade was exactly the size of the job he wanted to do.",
    },
    imageKey: NANAMI_IMAGE_KEYS.toolGrade,
    entry: {
      id: "tool-grade",
      label: { tr: "Birinci sınıf", en: "Grade 1" },
      record: {
        tr: "Kenar notu: derece sistemi bir kariyer merdiveni gibi kurulmuş ama Nanami onu bir görev tanımı olarak okuyor. Terfi bir amaç değil, fazladan mesai demek.",
        en: "Margin note: the grading system is built like a career ladder, but Nanami reads it as a job description. Promotion is not a goal — it means more hours.",
      },
    },
    anchor: {
      id: "grades",
      label: { tr: "Evren sayfası · dereceler", en: "Universe page · grades" },
    },
  },
  {
    key: "energy",
    code: "B-03",
    kanji: "呪力",
    romaji: "Juryoku",
    name: { tr: "Lanet enerjisi", en: "Cursed energy" },
    note: {
      tr: "Bütün 呪術'in yakıtı: insanların olumsuz duygularından sızan ve büyücünün kullandığı akış. Nanami'nin miktarı olağanüstü değil; olağanüstü olan, onu ne kadar az israf ettiği.",
      en: "The fuel of all 呪術: the flow that leaks from people's negative emotions and that a sorcerer puts to use. Nanami's quantity is not extraordinary; what is extraordinary is how little of it he wastes.",
    },
    imageKey: NANAMI_IMAGE_KEYS.toolEnergy,
    entry: {
      id: "tool-energy",
      label: { tr: "Lanet enerjisi", en: "Cursed energy" },
      record: {
        tr: "Kenar notu: yemin de teknik de aynı kalemi ucuzlatıyor. Nanami'nin bütün sistemi bir bütçe yönetimi.",
        en: "Margin note: both the vow and the technique make the same line item cheaper. Nanami's entire system is budget management.",
      },
    },
    anchor: {
      id: "energy",
      label: { tr: "Evren sayfası · lanet enerjisi", en: "Universe page · cursed energy" },
    },
  },
  {
    key: "reverse",
    code: "B-04",
    kanji: "反転術式",
    romaji: "Hanten Jutsushiki",
    name: { tr: "Ters lanet tekniği", en: "Reverse cursed technique" },
    note: {
      tr: "İki negatif lanet enerjisinin çarpımından pozitif enerji üretip yarayı kapatan teknik. Arşivin Nanami kaydında bu satır BOŞ: onun bu tekniği kullandığı bir sahne kayıtlı değil. Bir yeteneğin yokluğu da bir kalemdir ve burada öyle yazıldı.",
      en: "The technique that multiplies two negatives of cursed energy into positive energy and closes a wound. In the archive's Nanami record this line is BLANK: no scene of him using it is logged. The absence of an ability is a line item too, and it is written as one here.",
    },
    imageKey: NANAMI_IMAGE_KEYS.toolReverse,
    entry: {
      id: "tool-reverse",
      label: { tr: "Ters lanet tekniği", en: "Reverse cursed technique" },
      record: {
        tr: "Kenar notu: boş satır bir eksiklik değil bir sınır. Kendini iyileştiremeyen bir büyücü, saatine daha çok dikkat eder.",
        en: "Margin note: a blank line is not a shortcoming but a limit. A sorcerer who cannot heal himself watches his clock more carefully.",
      },
    },
  },
];

/* ── Mesai saati: sayfanın kalbi ────────────────────────────────────────── */

/** Vardiya 09:00'da açılıyor, 18:00'de kapanıyor. Dokuz saat. */
export const NANAMI_SHIFT_START = 9;
export const NANAMI_SHIFT_END = 18;

export const NANAMI_CLOCK_UI = {
  stripLabel: {
    tr: "Mesai şeridi — 09:00'dan 18:00'e",
    en: "The shift strip — from 09:00 to 18:00",
  },
  nowLabel: { tr: "Şu an", en: "Now" },
  spentLabel: { tr: "Harcanan saat", en: "Hours spent" },
  leftLabel: { tr: "Kalan saat", en: "Hours left" },
  openedLabel: { tr: "Açılan kayıt", en: "Records opened" },
  logTitle: { tr: "Kayıt defteri", en: "The log" },
  logEmpty: {
    tr: "Defter boş. Sayfadaki bir kaydı açtığında saat bir ilerliyor ve satır buraya düşüyor.",
    en: "The ledger is empty. When you open a record on the page the clock moves an hour and the line drops in here.",
  },
  rule: {
    tr: "Saati doğrudan çeviremezsin ve geri alamazsın. Zamanı harcayan şey ilerlemenin kendisi: her açılan kayıt bir saat.",
    en: "You cannot turn the clock directly and you cannot take it back. What spends the time is the progress itself: every opened record costs an hour.",
  },
  resetLabel: { tr: "Yeni bir gün başlat", en: "Start a new day" },
  resetHint: {
    tr: "Saati 09:00'a alır. Açtığın kayıtlar açık kalır; kilitlenenler yeniden açılabilir hâle gelir.",
    en: "Sets the clock back to 09:00. The records you opened stay open; the locked ones become openable again.",
  },
  statusRunning: {
    tr: "Mesai sürüyor.",
    en: "The day is still running.",
  },
  statusClosed: {
    tr: "Mesai bitti. Açılmamış kayıtlar bugünlük kapandı; Shibuya kaydı açıldı.",
    en: "The day is over. The unopened records are closed for today; the Shibuya entry has opened.",
  },
  statusReset: {
    tr: "Saat 09:00'a alındı. Yeni bir gün başladı.",
    en: "The clock is back at 09:00. A new day has started.",
  },
  closedBanner: {
    tr: "18:00 — mesai bitti",
    en: "18:00 — the day is over",
  },
  openBanner: {
    tr: "Vardiya açık",
    en: "Shift open",
  },
} as const;

export const NANAMI_ENTRY_UI = {
  ledgerLabel: { tr: "Mesai defteri", en: "Shift ledger" },
  openLabel: { tr: "Kaydı aç", en: "Open the record" },
  costLabel: { tr: "1 saat", en: "1 hour" },
  openedLabel: { tr: "Açıldı", en: "Opened" },
  stampPrefix: { tr: "Kaydedildi", en: "Logged" },
  lockedLabel: { tr: "Bugünlük kapandı", en: "Closed for today" },
  lockedNote: {
    tr: "Mesai bittiğinde bu kayıt açılmamıştı. Soldaki metin yerinde duruyor ve okunmaya devam ediyor — kapanan tek şey Nanami'nin kenar notu. Mesai şeridindeki «yeni bir gün başlat» düğmesi bu kaydı yeniden açılabilir yapıyor.",
    en: "This record was still unopened when the day ended. The text on the left is untouched and still readable — the only thing that closed is Nanami's margin note. The “start a new day” button on the shift strip makes this record openable again.",
  },
  overtimeLockedLabel: { tr: "18:00'den önce açılmaz", en: "Does not open before 18:00" },
  overtimeLockedNote: {
    tr: "Bu kayıt fazla mesaide açılıyor. Saat 18:00'e geldiğinde kendiliğinden düşecek.",
    en: "This record opens in overtime. It will drop on its own when the clock reaches 18:00.",
  },
  overtimeStamp: { tr: "Fazla mesai", en: "Overtime" },
} as const;

/* ── Beş kayıt (kader çizelgesi) ────────────────────────────────────────── */

export interface NanamiFate {
  key: string;
  code: string;
  /** Yaş/dönem etiketi */
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: string; reading: LocalizedText; by: LocalizedText };
  kin?: { characterId: number; name: string; role: LocalizedText };
  anchor?: { id: string; label: LocalizedText };
  imageKey: string;
  entry: NanamiEntry;
  /** Yalnızca mesai bittiğinde açılan kayıt */
  overtimeOnly?: boolean;
}

export const NANAMI_TIMELINE: NanamiFate[] = [
  {
    key: "school",
    code: "C-01",
    age: { tr: "okul yılları · 16 civarı", en: "the school years · around 16" },
    title: { tr: "Haibara", en: "Haibara" },
    text: {
      tr: "Tokyo Jujutsu Lisesi'nde okurken sınıf arkadaşı Yū Haibara bir görevde öldü. Ölüm Nanami'ye işin kendisini değil, işin yürütülme biçimini sorgulattı: hazırlıksız gönderilen bir öğrencinin ölmesi bir kaza değil, bir yönetim sonucuydu. Bu, sayfadaki bütün saat takıntısının başladığı yer.",
      en: "While studying at Tokyo Jujutsu High his classmate Yū Haibara died on a mission. The death made Nanami question not the work itself but the way it was run: a student sent out unprepared dying is not an accident but an outcome of management. This is where all the clock-watching on this page begins.",
    },
    imageKey: NANAMI_IMAGE_KEYS.fateSchool,
    entry: {
      id: "fate-school",
      label: { tr: "Haibara", en: "Haibara" },
      record: {
        tr: "Kenar notu: Nanami bu ölümden sonra kimseyi suçlamadı. Kurumu suçlamak yerine kurumdan çıktı — ilk çözümü istifaydı.",
        en: "Margin note: Nanami blamed no one after that death. Instead of blaming the institution he left it — his first solution was resignation.",
      },
    },
  },
  {
    key: "quit",
    code: "C-02",
    age: { tr: "mezuniyetten sonra · 4 yıl", en: "after graduation · 4 years" },
    title: { tr: "İstifa", en: "The resignation" },
    text: {
      tr: "Mezun olur olmaz jujutsu dünyasından çıktı ve bir ticaret şirketine girdi. Dört yıl kravat taktı, toplantıya girdi, rapor yazdı. Bu bir kaçış değil bir denemeydi: başka bir hayatın gerçekten mümkün olup olmadığını ölçtü. Ölçüm sonucu olumsuz çıktı.",
      en: "The moment he graduated he left the jujutsu world and joined a trading company. For four years he wore a tie, sat in meetings, wrote reports. It was not an escape but a trial: he was measuring whether another life was genuinely possible. The measurement came back negative.",
    },
    imageKey: NANAMI_IMAGE_KEYS.fateQuit,
    entry: {
      id: "fate-quit",
      label: { tr: "İstifa", en: "The resignation" },
      record: {
        tr: "Kenar notu: sayfadaki kurumsal estetik bir metafor değil bir biyografi. Nanami gerçekten dört yıl o masada oturdu ve kravatını bırakmadan geri döndü.",
        en: "Margin note: the corporate look of this page is not a metaphor but a biography. Nanami really did sit at that desk for four years, and he came back without taking the tie off.",
      },
    },
  },
  {
    key: "return",
    code: "C-03",
    age: { tr: "dört yıl sonra", en: "four years later" },
    title: { tr: "Daha az berbat olanı", en: "The less awful one" },
    text: {
      tr: "Geri döndü ve gerekçesini hiç süslemedi: iki işin de berbat olduğunu gördü, daha az berbat olanı seçti. Cümle bir espri gibi duruyor ama sayfadaki en dürüst satır — Nanami hiçbir zaman yaptığı işi yücelten biri olmadı, yalnızca gereğini yaptı.",
      en: "He came back, and he never dressed the reason up: he saw both jobs were awful and picked the less awful one. The sentence reads like a joke, but it is the most honest line on the page — Nanami never ennobled his own work, he simply did what it required.",
    },
    quote: {
      text: "労働はクソだ",
      reading: {
        tr: "Rōdō wa kuso da — «çalışmak berbat bir şey».",
        en: "Rōdō wa kuso da — “labour is a miserable business”.",
      },
      by: { tr: "Nanami, işi anlatırken", en: "Nanami, describing the work" },
    },
    imageKey: NANAMI_IMAGE_KEYS.fateReturn,
    entry: {
      id: "fate-return",
      label: { tr: "Daha az berbat olanı", en: "The less awful one" },
      record: {
        tr: "Kenar notu: bu cümleyi bir şikâyet sanmak kolay. Şikâyet olsa gitmezdi — Nanami cümleyi kurduktan sonra her sabah işe gidiyor.",
        en: "Margin note: it is easy to mistake this line for a complaint. If it were, he would not go — Nanami says it and then goes to work every morning.",
      },
    },
  },
  {
    key: "junpei",
    code: "C-04",
    age: { tr: "27 yaş", en: "age 27" },
    title: { tr: "Junpei", en: "Junpei" },
    text: {
      tr: "Bir lanetli ruhun (呪霊) peşine düşerken Junpei Yoshino adında bir liseliyle karşılaştı ve onu jujutsu tarafına çekmeye çalıştı. Çocuğu Mahito'nun elinden alamadı. Olaydan sonra çırağına söylediği şey bir teselli değil bir yöntem oldu: elinden geleni yap, sonra kalanı taşımayı öğren.",
      en: "Tracking a cursed spirit (呪霊) he came across a high-schooler named Junpei Yoshino and tried to bring him over to the jujutsu side. He could not take the boy out of Mahito's hands. What he told his student afterwards was not consolation but method: do what you can, then learn to carry the rest.",
    },
    kin: {
      characterId: 157214,
      name: "Junpei Yoshino",
      role: { tr: "Kurtaramadığı çocuk", en: "The boy he could not save" },
    },
    anchor: {
      id: "spirits",
      label: { tr: "Evren sayfası · lanetli ruhlar", en: "Universe page · cursed spirits" },
    },
    imageKey: NANAMI_IMAGE_KEYS.fateJunpei,
    entry: {
      id: "fate-junpei",
      label: { tr: "Junpei", en: "Junpei" },
      record: {
        tr: "Kenar notu: Nanami bu kaydı kapatmadı. Mahito'yla arasındaki hesap Shibuya'ya kadar açık kaldı ve orada da kapanmadı.",
        en: "Margin note: Nanami never closed this entry. His account with Mahito stayed open until Shibuya, and it did not close there either.",
      },
    },
  },
  {
    key: "shibuya",
    code: "C-05",
    age: { tr: "Shibuya · 31 Ekim", en: "Shibuya · 31 October" },
    title: { tr: "Devir", en: "The handover" },
    text: {
      tr: "Shibuya'da mesai çoktan bitmişti ve Nanami sonuna kadar çalıştı: yaralı, yanmış, tek başına, koridorun sonuna kadar. Son sahnesinde ne bir kahramanlık cümlesi kurdu ne de veda etti — yapılacak işin kalanını çırağına devretti. Sayfanın başındaki oran burada kapanıyor: bir gün de yediye üç bölünüyor ve kalan üçü başkası taşıyor.",
      en: "At Shibuya the working day was long over, and Nanami worked to the end: wounded, burned, alone, all the way down the corridor. In his last scene he made no heroic speech and said no goodbye — he handed the remainder of the job to his student. The ratio from the top of this page closes here: a day too divides seven to three, and someone else carries the three.",
    },
    quote: {
      text: "あとは頼みます",
      reading: {
        tr: "Ato wa tanomimasu — «gerisini size bırakıyorum».",
        en: "Ato wa tanomimasu — “the rest is in your hands”.",
      },
      by: { tr: "Nanami, Shibuya'daki son sözü", en: "Nanami, his last words at Shibuya" },
    },
    kin: {
      characterId: 127212,
      name: "Yuuji Itadori",
      role: { tr: "İşi devrettiği çırak", en: "The student he handed the job to" },
    },
    anchor: {
      id: "shibuya",
      label: { tr: "Evren sayfası · Shibuya", en: "Universe page · Shibuya" },
    },
    imageKey: NANAMI_IMAGE_KEYS.fateShibuya,
    overtimeOnly: true,
    entry: {
      id: "fate-shibuya",
      label: { tr: "Devir", en: "The handover" },
      record: {
        tr: "Fazla mesai kaydı: Nanami bu günü planlamadı ve bitirmedi. Defterin son satırı bir sonuç değil, bir devir teslim tutanağı.",
        en: "Overtime entry: Nanami neither planned this day nor finished it. The last line of the ledger is not a result but a handover note.",
      },
    },
  },
];

/* ── Bağlar ─────────────────────────────────────────────────────────────── */

export interface NanamiBond {
  characterId: number;
  name: string;
  nameNative: string;
  role: LocalizedText;
  summary: LocalizedText;
  anchor?: { id: string; label: LocalizedText };
}

/**
 * ⚠️ Beş kimlik `EXPERIENCE_COMPANIONS[133704]` ile BİREBİR aynı
 * (127212, 127691, 133702, 157214, 133700). Dalga 1'in dördüncü dersi:
 * sayfanın çizdiği her kimlik o listede olmalı, yoksa portre kaydı
 * girildiğinde bile kadraj sonsuza kadar boş kalır.
 */
export const NANAMI_BONDS: NanamiBond[] = [
  {
    characterId: 127212,
    name: "Yuuji Itadori",
    nameNative: "虎杖悠仁",
    role: { tr: "Çırağı", en: "His student" },
    summary: {
      tr: "Nanami'nin öğretme biçimi tek cümlelik: işi göster, gerekçesini söyleme, sonra bırak. Yūji'ye verdiği son şey bir teknik değil bir sorumluluk oldu.",
      en: "Nanami teaches in one sentence: show the job, do not explain yourself, then step back. The last thing he gave Yūji was not a technique but a responsibility.",
    },
  },
  {
    characterId: 127691,
    name: "Satoru Gojou",
    nameNative: "五条悟",
    role: { tr: "Bir üst sınıfı", en: "The year above him" },
    summary: {
      tr: "Aynı okuldan, bir üst sınıftan. Gojō gürültülü, esnek ve kural tanımaz; Nanami sessiz, katı ve saatli. İkisi de aynı öğrenciye bakıyor ve tam tersi şeyleri öğretiyorlar.",
      en: "Same school, one year above. Gojō is loud, elastic and unruled; Nanami is quiet, rigid and on the clock. Both are looking after the same student and teaching him opposite things.",
    },
    anchor: {
      id: "archetypes",
      label: { tr: "Evren sayfası · arketipler", en: "Universe page · archetypes" },
    },
  },
  {
    characterId: 133702,
    name: "Mahito",
    nameNative: "真人",
    role: { tr: "Karşısındaki lanetli ruh", en: "The cursed spirit opposite him" },
    summary: {
      tr: "Ruhu biçimlendiren özel sınıf bir 呪霊. Nanami'nin ölçülebilir dünyasının tam karşıtı: Mahito'nun elinde hiçbir şeyin sabit bir oranı yok. Junpei'yi o aldı, Shibuya'daki son darbeyi de o vurdu.",
      en: "A special grade 呪霊 who reshapes the soul. The exact opposite of Nanami's measurable world: in Mahito's hands nothing keeps a fixed ratio. He took Junpei, and he struck the last blow at Shibuya.",
    },
    anchor: {
      id: "spirits",
      label: { tr: "Evren sayfası · lanetli ruhlar", en: "Universe page · cursed spirits" },
    },
  },
  {
    characterId: 157214,
    name: "Junpei Yoshino",
    nameNative: "吉野順平",
    role: { tr: "Kurtaramadığı çocuk", en: "The boy he could not save" },
    summary: {
      tr: "Nanami'nin kapatamadığı tek kalem. Onu jujutsu tarafına çekmeye çalıştı, geç kaldı ve bunu bir daha hiç konuşmadı.",
      en: "The one line item Nanami could not close. He tried to bring the boy over to the jujutsu side, arrived late, and never spoke of it again.",
    },
  },
  {
    characterId: 133700,
    name: "Nobara Kugisaki",
    nameNative: "釘崎野薔薇",
    role: { tr: "Beraber çalıştığı öğrenci", en: "A student he worked alongside" },
    summary: {
      tr: "Gojō'nun üç öğrencisinden biri. Nanami ile ilişkisi meslekî ve kısa: aynı görevlerde bulundular, aynı saatleri paylaştılar, birbirlerine hiçbir şey açıklamak zorunda kalmadılar.",
      en: "One of Gojō's three students. Her relation with Nanami is professional and brief: shared missions, shared hours, and nothing either of them had to explain to the other.",
    },
  },
];

export const NANAMI_BOND_UI = {
  hasPage: { tr: "arşivde dosyası var", en: "has a file in the archive" },
  noPage: { tr: "dosya yok — düz kayıt", en: "no file — plain entry" },
  portraitMissing: {
    tr: "Portre kaydı yok",
    en: "No portrait on record",
  },
} as const;

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const NANAMI_CLOSING = {
  quotes: [
    {
      text: "労働はクソだ",
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
      text: "あとは頼みます",
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
  motto: "七海建人",
  mottoNote: {
    tr: "Nanami Kento. Soyadındaki 七海 «yedi deniz» demek ve doğum günü 3 Temmuz — yedi ve üç, adında da tarihinde de aynı iki sayı. Sayfanın oranı buradan geliyor.",
    en: "Nanami Kento. The 七海 in his family name means “seven seas”, and his birthday is 3 July — seven and three, the same two numbers in his name and in his date. That is where this page's ratio comes from.",
  },
  credit: {
    tr: "Künye, portre ve doğum bilgileri AniList'ten:",
    en: "Dossier, portrait and birth data from AniList:",
  },
  creditLink: {
    tr: "AniList · Kento Nanami #133704",
    en: "AniList · Kento Nanami #133704",
  },
  creditNote: {
    tr: "Portre depoda duruyor (230×345, PNG); dışarıya hiçbir görsel bağlanmadı. Sayfadaki kravat çizgisi deseni, saat kadranı ve bütün işaretler elle çizilmiş SVG.",
    en: "The portrait is stored in the repository (230×345, PNG); no image is hotlinked. The tie-stripe pattern, the clock dial and every mark on this page are hand-drawn SVG.",
  },
} as const;

/* ── Küratör özeti ──────────────────────────────────────────────────────── */

export const NANAMI_GAPS = {
  title: { tr: "Boş kadrajlar", en: "Empty frames" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bütün kadrajlar dolu. Defterde açık kalem yok.",
    en: "Every frame is filled. There is no open item left in the ledger.",
  },
} as const;
