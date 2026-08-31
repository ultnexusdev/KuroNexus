import type { LocalizedText } from "./types";

/**
 * Tōji Fushiguro (伏黒甚爾) — "Cennetsel Kısıtlama" deneyim sayfasının verisi.
 *
 * Ev deseni (Itachi emsali): karaktere ait BÜTÜN anlatı kodda, iki dilli
 * `LocalizedText` çiftleri olarak. Bileşen `pick(text, locale)` ile seçiyor;
 * istemci adalarına yalnızca düz dize iniyor.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * BİR ŞEYİN YOKLUĞU. Tōji'nin lanet enerjisi sıfır. Sayfa bunu bir espri
 * ya da bir dipnot olarak değil, TEZ olarak kuruyor: üst üçte bir boş
 * gökyüzü, içerik alçak ve yatay bir bantta, ve mekanizmanın merkezinde
 * hiç kıpırdamayan bir sütun.
 *
 * ── VERİNİN KAYNAĞI ──────────────────────────────────────────────────────
 * Künye satırlarının tamamı
 * `public/assets/anime/karakterler/touji-fushiguro/kaynak.json`'dan
 * (AniList #162722 çekiminin repodaki kopyası):
 *   ad "Touji Fushiguro" · yerel ad 伏黒甚爾 · doğum 31 Aralık (yıl YOK) ·
 *   cinsiyet Male · yaş null · kan grubu null ·
 *   diğer adlar "Sorcerer Killer", "Toji Fushiguro", "Touji Zenin" ·
 *   portre 230×345 · altı yapım.
 *
 * ⚠️ YAŞ VE KAN GRUBU YOK. İkisi de kaynakta `null`. Künye şeridinde
 * "bilinmiyor" YAZMIYOR — satırlar karakterizasyona çevrildi, ama uydurma
 * sayı da yazılmadı. Bu sayfanın konusu zaten boş kalan ölçüm.
 *
 * ── KRONOLOJİ ────────────────────────────────────────────────────────────
 * Beş durak yaşla değil ARK ADIYLA damgalandı: Tōji'nin yaşı hiçbir
 * kaynakta yok, uydurulmuş bir sayı yazmaktansa serinin kendi bölümlemesi
 * kullanıldı. İki damga doğrudan `kaynak.json`'daki yapım adından geliyor:
 * "Jujutsu Kaisen: Kaigyoku・Gyokusetsu" → 懐玉 ve 玉折.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * ⚠️ Bu sayfada TIRNAK İÇİNDE SÖYLENMİŞ CÜMLE YOK — bilinçli. Tōji'nin
 * Japonca repliklerinin birebir yazımı doğrulanamadı ve görev şartı açık:
 * emin olunmayan satır yazılmaz. Kapanıştaki iki blok bu yüzden söz değil
 * AD: ona verilen ad (呪術師殺し) ve kendi aldığı ad (伏黒). İkisi de
 * doğrulanmış — birincisi `kaynak.json`'daki "Sorcerer Killer", ikincisi
 * aynı dosyadaki soyadı. Motto da bir cümle değil bir terim: 天与呪縛.
 * Olayların anlatımı tırnaksız, anlatı sesiyle yazıldı.
 *
 * ── TERMİNOLOJİ (yalnızca Jujutsu Kaisen) ────────────────────────────────
 * 呪力 (juryoku — lanet enerjisi) · 術式 (jutsushiki — lanetli teknik) ·
 * 領域展開 (ryōiki tenkai — alan genişletme) · 反転術式 (hanten jutsushiki
 * — ters lanet tekniği) · 呪具 (jugu — lanetli alet) · 束縛 (sokubaku —
 * bağlayıcı söz) · 天与呪縛 (ten'yo jubaku — cennetsel kısıtlama) ·
 * 星漿体 (seishōtai — yıldız plazma kabı) · 呪霊 (jurei — lanetli ruh).
 * Naruto ya da Bleach terminolojisi kullanılmadı.
 */

export const TOUJI_ID = 162722;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const TOUJI_SITE_URL = "https://anilist.co/character/162722";

/**
 * Depodaki resmî portre (Faz 2 §3: hotlink yok, kare repoda).
 *
 * ⚠️ 230×345 — KÜÇÜK. Sayfada yalnızca dar bir künye kartında kullanılıyor;
 * büyük hero karesi küratör yuvası olarak boş bırakıldı.
 */
export const TOUJI_PORTRAIT = {
  src: "/assets/anime/karakterler/touji-fushiguro/anilist-portrait.jpg",
  w: 230,
  h: 345,
} as const;

/**
 * Sergi görselleri — hepsi characterId 162722 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `toj:` önekli (küratör modu şartı).
 *
 * ⚠️ Üç küçük kart (術式 · 領域展開 · 反転術式) BİLEREK yuvasız: cevapları
 * "yok" ve olmayan bir şeyin kadrajı olmaz. Kadraj koymak o üç kartı
 * doldurulmayı bekleyen bir boşluğa çevirirdi; oysa onlar sayfanın tezi.
 */
export const TOUJI_IMAGE_KEYS = {
  hero: "toj:hero",
  restriction: "toj:restriction",
  zero: "toj:zero",
  tools: "toj:tools",
  spear: "toj:sakahoko",
  cloud: "toj:yuun",
  satchel: "toj:satchel",
  fateZenin: "toj:fate-zenin",
  fateFushiguro: "toj:fate-fushiguro",
  fateKaigyoku: "toj:fate-kaigyoku",
  fateGyokusetsu: "toj:fate-gyokusetsu",
  fateShibuya: "toj:fate-shibuya",
  closing: "toj:closing",
} as const;

/** Küratör yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const TOUJI_SLOT_LABELS: Record<string, LocalizedText> = {
  [TOUJI_IMAGE_KEYS.hero]: {
    tr: "Hero — dikey portre, tam boy, geniş boş gökyüzü (3:4)",
    en: "Hero — vertical portrait, full figure, wide empty sky (3:4)",
  },
  [TOUJI_IMAGE_KEYS.restriction]: {
    tr: "Cennetsel Kısıtlama — gövdenin sınırı aştığı an (16:9)",
    en: "Heavenly Restriction — the body crossing its limit (16:9)",
  },
  [TOUJI_IMAGE_KEYS.zero]: {
    tr: "Sıfır — lanet enerjisi olmayan bir figür, boş zemin (16:9)",
    en: "Zero — a figure with no cursed energy, empty ground (16:9)",
  },
  [TOUJI_IMAGE_KEYS.tools]: {
    tr: "Lanetli aletler — bez kılıf açılmış, aletler yan yana (16:9)",
    en: "Cursed tools — the cloth wrap opened, tools side by side (16:9)",
  },
  [TOUJI_IMAGE_KEYS.spear]: {
    tr: "Ters Mızrak — ucun yakın çekimi (3:2)",
    en: "Inverted Spear — close crop of the tip (3:2)",
  },
  [TOUJI_IMAGE_KEYS.cloud]: {
    tr: "Playful Cloud — zincirle bağlı üç parça (3:2)",
    en: "Playful Cloud — three sections joined by chain (3:2)",
  },
  [TOUJI_IMAGE_KEYS.satchel]: {
    tr: "Envanter — aletin çıkarıldığı an, alçak ve yatay kadraj (16:9)",
    en: "Inventory — the instant a tool comes out, low wide frame (16:9)",
  },
  [TOUJI_IMAGE_KEYS.fateZenin]: {
    tr: "Zen'in — klan avlusu, tek figür kenarda (3:2)",
    en: "Zen'in — the clan courtyard, one figure at the edge (3:2)",
  },
  [TOUJI_IMAGE_KEYS.fateFushiguro]: {
    tr: "Fushiguro — bırakılan ad, sıradan bir sokak (3:2)",
    en: "Fushiguro — the name left behind, an ordinary street (3:2)",
  },
  [TOUJI_IMAGE_KEYS.fateKaigyoku]: {
    tr: "懐玉 — görev, uzaktan bakan bir siluet (3:2)",
    en: "Hidden Inventory — the job, a silhouette watching from afar (3:2)",
  },
  [TOUJI_IMAGE_KEYS.fateGyokusetsu]: {
    tr: "玉折 — dövüşün bittiği yer, geniş ve boş (3:2)",
    en: "Premature Death — where the fight ended, wide and empty (3:2)",
  },
  [TOUJI_IMAGE_KEYS.fateShibuya]: {
    tr: "渋谷 — iki figür karşı karşıya, aralarında boşluk (3:2)",
    en: "Shibuya — two figures facing each other, a gap between (3:2)",
  },
  [TOUJI_IMAGE_KEYS.closing]: {
    tr: "Kapanış — çok geniş bant, üstte gökyüzü, altta ince ufuk (8:3)",
    en: "Closing — very wide band, sky above, thin horizon below (8:3)",
  },
};

/**
 * `CuratorGaps` satırlarındaki teknik künye — tip + ölçü + biçim.
 *
 * ⚠️ Bu metin ZİYARETÇİYE HİÇ ÇİZİLMİYOR. Dalga 1'de Levi'de boş kadrajın
 * içine yazılmıştı ve sıradan ziyaretçi on beş kez üretim metadatası
 * okuyordu. Bu sayfada hata daha da ağır olurdu: sayfanın konusu boşluk,
 * ve o boşluğu ölçü yazılarıyla doldurmak tasarımı çökertirdi. Yalnızca
 * `isAdmin` dalında.
 */
export const TOUJI_SLOT_SPECS: Record<string, LocalizedText> = {
  [TOUJI_IMAGE_KEYS.hero]: {
    tr: "dikey kadraj · 1200×1600 · webp",
    en: "vertical frame · 1200×1600 · webp",
  },
  [TOUJI_IMAGE_KEYS.restriction]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [TOUJI_IMAGE_KEYS.zero]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [TOUJI_IMAGE_KEYS.tools]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [TOUJI_IMAGE_KEYS.spear]: {
    tr: "küçük kadraj · 900×600 · webp",
    en: "small frame · 900×600 · webp",
  },
  [TOUJI_IMAGE_KEYS.cloud]: {
    tr: "küçük kadraj · 900×600 · webp",
    en: "small frame · 900×600 · webp",
  },
  [TOUJI_IMAGE_KEYS.satchel]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [TOUJI_IMAGE_KEYS.fateZenin]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [TOUJI_IMAGE_KEYS.fateFushiguro]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [TOUJI_IMAGE_KEYS.fateKaigyoku]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [TOUJI_IMAGE_KEYS.fateGyokusetsu]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [TOUJI_IMAGE_KEYS.fateShibuya]: {
    tr: "sahne kadrajı · 1200×800 · webp",
    en: "scene frame · 1200×800 · webp",
  },
  [TOUJI_IMAGE_KEYS.closing]: {
    tr: "bant · 1920×720 · webp",
    en: "band · 1920×720 · webp",
  },
};

/** `CuratorSlot`un önerdiği piksel ölçüsü — `spec` metniyle aynı sayılar. */
export const TOUJI_SLOT_SIZES: Record<string, { w: number; h: number }> = {
  [TOUJI_IMAGE_KEYS.hero]: { w: 1200, h: 1600 },
  [TOUJI_IMAGE_KEYS.restriction]: { w: 1600, h: 900 },
  [TOUJI_IMAGE_KEYS.zero]: { w: 1600, h: 900 },
  [TOUJI_IMAGE_KEYS.tools]: { w: 1600, h: 900 },
  [TOUJI_IMAGE_KEYS.spear]: { w: 900, h: 600 },
  [TOUJI_IMAGE_KEYS.cloud]: { w: 900, h: 600 },
  [TOUJI_IMAGE_KEYS.satchel]: { w: 1600, h: 900 },
  [TOUJI_IMAGE_KEYS.fateZenin]: { w: 1200, h: 800 },
  [TOUJI_IMAGE_KEYS.fateFushiguro]: { w: 1200, h: 800 },
  [TOUJI_IMAGE_KEYS.fateKaigyoku]: { w: 1200, h: 800 },
  [TOUJI_IMAGE_KEYS.fateGyokusetsu]: { w: 1200, h: 800 },
  [TOUJI_IMAGE_KEYS.fateShibuya]: { w: 1200, h: 800 },
  [TOUJI_IMAGE_KEYS.closing]: { w: 1920, h: 720 },
};

export const TOUJI_PORTRAIT_SLOT: LocalizedText = {
  tr: "Portre — dikey, omuz üstü, kirli beyaz zemin (3:4)",
  en: "Portrait — vertical, above the shoulders, off-white ground (3:4)",
};

/** Küratör kadrajının içindeki tek kelime — YALNIZCA yöneticide çiziliyor. */
export const TOUJI_FRAME_EMPTY: LocalizedText = {
  tr: "boş kadraj",
  en: "empty frame",
};

/** Görsel `alt` metinleri — hepsinde kaynak bilgisi var (Faz 2 §3). */
export const TOUJI_ALT = {
  portrait: {
    tr: "Tōji Fushiguro — AniList resmî portresi (#162722), repodaki kopya",
    en: "Tōji Fushiguro — official AniList portrait (#162722), local copy",
  },
  portraitUploaded: {
    tr: "Tōji Fushiguro — arşive küratör tarafından yüklenen portre",
    en: "Tōji Fushiguro — portrait uploaded to the archive by the curator",
  },
  scenePrefix: {
    tr: "Tōji Fushiguro — arşive yüklenen kadraj:",
    en: "Tōji Fushiguro — frame uploaded to the archive:",
  },
} satisfies Record<string, LocalizedText>;

export const TOUJI_CRUMB = {
  series: { tr: "Jujutsu Kaisen", en: "Jujutsu Kaisen" },
} satisfies Record<string, LocalizedText>;

/**
 * BOŞ GÖKYÜZÜ.
 *
 * ⚠️ Boşluğun kendisi `aria-hidden` (ekran okuyucuda gürültü yapmasın), ama
 * ANLAMI metinle de söyleniyor: aşağıdaki cümle hero'da GÖRÜNÜR bir
 * paragraf olarak duruyor. Yalnızca görsel boşluğa yaslanmak, sayfanın
 * tezini ekran okuyucudan tamamen saklamak olurdu.
 *
 * ⚠️ Gökyüzü VARSAYILAN durumda da var — mod düğmesi onu açıp kapatmıyor
 * (Onizuka dersi: düğmenin işi yapıyı GÖSTERMEK, boşluğu doğurmak değil).
 */
export const TOUJI_SKY = {
  note: {
    tr: "Bu sayfanın üst üçte biri boş ve boş kalacak. Orada olmayan şey lanet enerjisi: Tōji Fushiguro sıfırla doğdu ve ölene kadar sıfır kaldı. Aşağıdaki her bölüm o boşluğun altına yerleşiyor.",
    en: "The top third of this page is empty and will stay empty. What is missing there is cursed energy: Tōji Fushiguro was born at zero and stayed at zero until he died. Every section below settles underneath that emptiness.",
  },
  horizon: {
    tr: "ufuk",
    en: "horizon",
  },
} satisfies Record<string, LocalizedText>;

/** Hero — ad, unvan, giriş. */
export const TOUJI_HERO = {
  house: { tr: "Zen'in klanından ayrılan", en: "Departed from the Zen'in clan" },
  epithet: { tr: "Büyücü Katili", en: "Sorcerer Killer" },
  lede: {
    tr: "Jujutsu dünyasının bütün ölçüleri lanet enerjisiyle alınır: derece, teknik, alan, iyileşme. Tōji'nin ölçüsü alınamadı, çünkü ölçülecek şey yoktu. Onun yerine bir gövde vardı ve bir çanta dolusu alet.",
    en: "Every measurement in the jujutsu world is taken in cursed energy: grade, technique, domain, healing. Tōji could not be measured, because there was nothing to measure. In its place there was a body, and a bag of tools.",
  },
  heroCaption: {
    tr: "Bu kadraj boş. Sayfanın en büyük görseli hâlâ yüklenmedi — ve boşken de sayfa ayakta duruyor.",
    en: "This frame is empty. The page's largest image has not been uploaded yet — and the page stands without it.",
  },
} satisfies Record<string, LocalizedText>;

/**
 * MOD DÜĞMESİ — "Gökyüzü boş".
 *
 * ⚠️ Maki Zen'in'in sayfasında da 天与呪縛 bir düğme; oradaki düğme PALETİ
 * ve İSTATİSTİKLERİ değiştiriyor (öncesi/sonrası). Burada düğme hiçbir
 * sayıyı ve hiçbir rengi değiştirmiyor: sayfanın kenarından inen LANET
 * ENERJİSİ SÜTUNUNU görünür kılıyor. Sütun görününce de boş bir şerit;
 * yokluğun görselleşmesi. Yani aynı kavram, başka iş.
 */
export const TOUJI_MODE = {
  title: { tr: "Gökyüzü boş", en: "The sky is empty" },
  native: "天与呪縛",
  nativeReading: {
    tr: "ten'yo jubaku — cennetsel kısıtlama",
    en: "ten'yo jubaku — heavenly restriction",
  },
  enter: {
    tr: "Lanet enerjisi sütununu göster",
    en: "Show the cursed energy column",
  },
  exit: {
    tr: "Lanet enerjisi sütununu gizle",
    en: "Hide the cursed energy column",
  },
  hintOff: {
    tr: "Sayfanın kenarında bir sütun var ama çizilmedi. Açtığında bütün bölümlerin yanından geçen boş bir şerit olarak beliriyor ve hiçbir yerde dolmuyor.",
    en: "There is a column at the edge of this page, but it has not been drawn. Turn it on and it appears as an empty strip running past every section, filling nowhere.",
  },
  hintOn: {
    tr: "Sütun açık. Sayfanın başından sonuna kadar iniyor ve tek bir noktada bile yükselmiyor. Okuduğu değer: 0.",
    en: "The column is on. It runs from the top of the page to the bottom and never rises at a single point. The value it reads: 0.",
  },
} satisfies Record<string, LocalizedText | string>;

/** Kenardan inen sütunun metinleri. */
export const TOUJI_COLUMN = {
  label: { tr: "Lanet enerjisi", en: "Cursed energy" },
  native: "呪力",
  value: "0",
  reading: {
    tr: "Sayfanın tamamı boyunca: sıfır.",
    en: "Along the whole page: zero.",
  },
} satisfies Record<string, LocalizedText | string>;

/** Bölüm başlıkları ve giriş cümleleri. */
export const TOUJI_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "Record" },
    lede: {
      tr: "Arşivin elindeki bütün doğrulanmış veri. Boş kalan satırlar boş bırakıldı: uydurulmuş bir yaş ya da bir kan grubu, bu dosyada tam olarak yanlış olan şey olurdu.",
      en: "Every verified field the archive holds. Empty rows were left empty: an invented age or blood type would be exactly the wrong thing in this file.",
    },
  },
  lab: {
    title: { tr: "Lanet laboratuvarı", en: "Cursed laboratory" },
    lede: {
      tr: "Bir büyücü üç şeyle ölçülür: tekniği, alanı, iyileştirmesi. Tōji'de üçü de yok. Aşağıdaki yedi kartın dördü \"var\" diyor, üçü \"yok\" — ve bu sayfada asıl bilgi olanlarda değil, olmayanlarda.",
      en: "A sorcerer is measured by three things: technique, domain, reversal. Tōji has none of them. Of the seven cards below, four say \"yes\" and three say \"no\" — and on this page the real information is in the ones that say no.",
    },
    majorTitle: { tr: "Üç büyük", en: "Three large" },
    minorTitle: { tr: "Dört küçük", en: "Four small" },
  },
  satchel: {
    title: { tr: "Envanter", en: "Inventory" },
    lede: {
      tr: "Tōji aletlerini bir lanetli ruhun içinde taşıyor ve gerektiğinde oradan çekiyor. Aşağıdaki rulo o çanta. Bir bölmeyi aç, alet dışarı çıksın; sağdaki üç fiziksel okuma yükselsin. Sonra sola bak.",
      en: "Tōji carries his tools inside a cursed spirit and pulls them out when he needs them. The roll below is that bag. Open a pocket, let a tool come out, watch the three physical readings on the right rise. Then look to the left.",
    },
  },
  fate: {
    title: { tr: "Kader çizelgesi", en: "Line of fate" },
    lede: {
      tr: "Beş durak. Yaşla değil ark adıyla damgalandı — Tōji'nin yaşı hiçbir kayıtta yok ve arşiv sayı uydurmuyor.",
      en: "Five stops, stamped with arc names instead of ages — Tōji's age appears in no record, and the archive does not invent numbers.",
    },
  },
  bonds: {
    title: { tr: "Bağlar", en: "Bonds" },
    lede: {
      tr: "Dört dosya bu sayfaya bağlı. İki ad bağsız kaldı: arşivde numaraları yok, o yüzden yalnızca yazıldılar.",
      en: "Four files link to this page. Two names stay unlinked: the archive has no id for them, so they are only written.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "İki ad ve bir terim. Bu sayfada tırnak içinde söylenmiş cümle yok — bkz. aşağıdaki not.",
      en: "Two names and one term. There are no spoken lines in quotation marks on this page — see the note below.",
    },
  },
} satisfies Record<string, Record<string, LocalizedText>>;

/**
 * KÜNYE SATIRLARI.
 *
 * Kaynak: `kaynak.json` (AniList #162722). Beşinci ve altıncı satır
 * kaynakta `null` — "bilinmiyor" yazmak yerine karakterizasyona çevrildi,
 * ama hiçbir sayı uydurulmadı.
 */
export const TOUJI_IDENTITY = {
  name: "Tōji Fushiguro",
  nativeName: "伏黒甚爾",
  facts: [
    {
      label: { tr: "Doğduğu ad", en: "Born as" },
      value: {
        tr: "Zen'in Tōji · 禪院甚爾",
        en: "Tōji Zen'in · 禪院甚爾",
      },
    },
    {
      label: { tr: "Taşıdığı ad", en: "Name he took" },
      value: {
        tr: "Fushiguro · 伏黒 — eşinin soyadı",
        en: "Fushiguro · 伏黒 — his wife's family name",
      },
    },
    {
      label: { tr: "Anıldığı ad", en: "Called" },
      value: { tr: "Büyücü Katili", en: "Sorcerer Killer" },
    },
    {
      label: { tr: "Doğum", en: "Birth" },
      value: {
        tr: "31 Aralık — yıl kayıtlı değil",
        en: "31 December — no year on record",
      },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: {
        tr: "Kayıtta sayı yok. Onu tanımlayan sayı zaten yaşı değil.",
        en: "No number on record. The number that defines him was never his age.",
      },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: {
        tr: "Kayıt yok. Bu dosyada yapılmış tek ölçüm var ve sonucu sıfır.",
        en: "No record. This file holds one measurement only, and it came back zero.",
      },
    },
    {
      label: { tr: "Lanet enerjisi · 呪力", en: "Cursed energy · 呪力" },
      value: { tr: "0", en: "0" },
    },
    {
      label: { tr: "Sembolik obje", en: "Symbolic object" },
      value: {
        tr: "Ters Mızrak · 天逆鉾 — dokunduğu tekniği geçersiz kılan alet",
        en: "Inverted Spear · 天逆鉾 — the tool that voids the technique it touches",
      },
    },
  ],
  /** `kaynak.json` → `yapimlar`. Rol adları oradan geliyor. */
  appearancesTitle: { tr: "Göründüğü yapımlar", en: "Appearances" },
  appearances: [
    {
      title: "Jujutsu Kaisen",
      role: { tr: "Yardımcı", en: "Supporting" },
    },
    {
      title: "Jujutsu Kaisen 2nd Season",
      role: { tr: "Yardımcı", en: "Supporting" },
    },
    {
      title: "Jujutsu Kaisen: Kaigyoku・Gyokusetsu",
      role: { tr: "Yardımcı", en: "Supporting" },
    },
    {
      title: "Jujutsu Kaisen: Shibuya Jihen Tokubetsu Henshuu-ban",
      role: { tr: "Yardımcı", en: "Supporting" },
    },
    {
      title: "Jujutsu Kaisen: Shimetsu Kaiyuu - Zenpen",
      role: { tr: "Arka plan", en: "Background" },
    },
    {
      title: "Jujutsu Kaisen Modulo",
      role: { tr: "Arka plan", en: "Background" },
    },
  ],
  missingNote: {
    tr: "Yaş ve kan grubu satırları AniList kaydında boş geliyor. Arşiv onları doldurmadı; bu sayfanın konusu tam olarak doldurulmayan ölçüm.",
    en: "The age and blood type fields come back empty from the AniList record. The archive did not fill them in; an unfilled measurement is precisely this page's subject.",
  },
} as const;

/** Üç büyük kart — "var" diyen taraf. */
export const TOUJI_LAB_MAJOR = [
  {
    key: "restriction",
    name: "天与呪縛",
    reading: "ten'yo jubaku",
    turkish: { tr: "Cennetsel Kısıtlama", en: "Heavenly Restriction" },
    verdict: { tr: "Var — doğuştan", en: "Present — from birth" },
    text: {
      tr: "Bir şeyden tamamen vazgeçildiğinde başka bir şey insan sınırının ötesine geçiyor. Tōji'de vazgeçilen lanet enerjisiydi; karşılığında aldığı şey bir gövde oldu. Pazarlık doğumda yapıldı ve geri alınamaz.",
      en: "When something is given up completely, something else crosses the human limit. What Tōji gave up was cursed energy; what he received in return was a body. The bargain was struck at birth and cannot be undone.",
    },
    traits: [
      { tr: "Doğuştan gelir, seçilmez", en: "Given at birth, not chosen" },
      { tr: "Karşılığı fiziksel", en: "Paid out in the body" },
      { tr: "Geri alınamaz", en: "Cannot be reversed" },
    ],
    imageKey: TOUJI_IMAGE_KEYS.restriction,
  },
  {
    key: "energy",
    name: "呪力",
    reading: "juryoku",
    turkish: { tr: "Lanet Enerjisi", en: "Cursed Energy" },
    verdict: { tr: "Sıfır", en: "Zero" },
    text: {
      tr: "Jujutsu dünyasının para birimi. Tōji'de hiç yok — ve bunun bir yan etkisi var: lanetli ruhlar ve büyücüler onu hissedemiyor. Odaya giren şeyi göremiyorsan, ona hazırlanamazsın da.",
      en: "The currency of the jujutsu world. Tōji has none of it — and that has a side effect: curses and sorcerers cannot sense him. If you cannot feel the thing entering the room, you cannot prepare for it either.",
    },
    traits: [
      { tr: "Ölçüm bir kere yapıldı", en: "Measured once" },
      { tr: "Algılanamıyor", en: "Cannot be sensed" },
      { tr: "Sayfadaki sütun bu", en: "This is the column on the page" },
    ],
    imageKey: TOUJI_IMAGE_KEYS.zero,
  },
  {
    key: "tools",
    name: "呪具",
    reading: "jugu",
    turkish: { tr: "Lanetli Alet", en: "Cursed Tool" },
    verdict: { tr: "Var — satın alınmış", en: "Present — bought" },
    text: {
      tr: "Lanetli alet kendi lanetini taşır, yani kullanmak için tekniğe gerek yok. Tōji'nin çözümü bu: olmayan tekniğin yerine satın alınmış alet. Aletleri bir lanetli ruhun içinde saklıyor ve gerektiğinde oradan çekiyor.",
      en: "A cursed tool carries its own curse, so using one requires no technique. That is Tōji's answer: a bought tool in place of a technique he does not have. He keeps them inside a cursed spirit and pulls them out when he needs them.",
    },
    traits: [
      { tr: "Teknik gerektirmiyor", en: "Requires no technique" },
      { tr: "Taşınabilir, satılabilir", en: "Portable, sellable" },
      { tr: "Bitince biter", en: "When it runs out, it is out" },
    ],
    imageKey: TOUJI_IMAGE_KEYS.tools,
    /** Kartın içindeki iki küçük kadraj — iki doğrulanmış alet. */
    pieces: [
      {
        key: "spear",
        name: "天逆鉾",
        reading: "ama-no-sakahoko",
        turkish: { tr: "Ters Mızrak", en: "Inverted Spear of Heaven" },
        note: {
          tr: "Değdiği lanetli tekniği o an geçersiz kılıyor. Sınırsız bir savunmanın karşısına çıkan tek pratik cevap.",
          en: "It voids the cursed technique it touches, on contact. The one practical answer to a limitless defence.",
        },
        imageKey: TOUJI_IMAGE_KEYS.spear,
      },
      {
        key: "cloud",
        name: "遊雲",
        reading: "yūun",
        turkish: { tr: "Playful Cloud", en: "Playful Cloud" },
        note: {
          tr: "Zincirle bağlı üç parçalı sopa; özel dereceli bir lanetli alet. Ağırlığı taşıyabilen biri için tek başına bir silah sınıfı.",
          en: "A three-sectioned staff joined by chain; a special grade cursed tool. For anyone who can carry the weight, a weapon class of its own.",
        },
        imageKey: TOUJI_IMAGE_KEYS.cloud,
      },
    ],
  },
] as const;

/**
 * Dört küçük kart — üçü "yok" diyor.
 *
 * ⚠️ Kadrajları YOK ve bu bilinçli: olmayan bir tekniğin sahne kadrajı da
 * olmaz. Küratör yuvası koymak, doldurulmayı bekleyen bir eksik gibi
 * görünürdü; oysa bu üç kart eksik değil, cevabın kendisi.
 */
export const TOUJI_LAB_MINOR = [
  {
    key: "technique",
    name: "術式",
    reading: "jutsushiki",
    turkish: { tr: "Lanetli Teknik", en: "Cursed Technique" },
    verdict: { tr: "Yok", en: "None" },
    note: {
      tr: "Miras alınacak bir teknik yok. Zen'in klanının ona bakarken gördüğü şey buydu.",
      en: "There is no technique to inherit. This is what the Zen'in clan saw when it looked at him.",
    },
  },
  {
    key: "domain",
    name: "領域展開",
    reading: "ryōiki tenkai",
    turkish: { tr: "Alan Genişletme", en: "Domain Expansion" },
    verdict: { tr: "Yok", en: "None" },
    note: {
      tr: "Alan lanet enerjisinden kuruluyor. Sıfırdan alan kurulmuyor — bu satırda tartışılacak bir şey yok.",
      en: "A domain is built out of cursed energy. Zero builds no domain — there is nothing to argue about on this line.",
    },
  },
  {
    key: "reversal",
    name: "反転術式",
    reading: "hanten jutsushiki",
    turkish: { tr: "Ters Lanet Tekniği", en: "Reverse Cursed Technique" },
    verdict: { tr: "Yok", en: "None" },
    note: {
      tr: "İyileşme de lanet enerjisi istiyor. Tōji'nin yaraları sıradan bir bedenin hızıyla kapanıyor; yani kapanmıyor.",
      en: "Healing also costs cursed energy. Tōji's wounds close at the speed of an ordinary body; which is to say, they do not.",
    },
  },
  {
    key: "vow",
    name: "束縛",
    reading: "sokubaku",
    turkish: { tr: "Bağlayıcı Söz", en: "Binding Vow" },
    verdict: { tr: "Var — ama pazarlığı o yapmadı", en: "Present — but he did not strike it" },
    note: {
      tr: "Cennetsel Kısıtlama doğuştan gelen bir bağlayıcı sözdür. Büyücüler bağlayıcı sözü seçerek yapar; Tōji doğduğunda anlaşma çoktan imzalanmıştı.",
      en: "Heavenly Restriction is a binding vow granted at birth. Sorcerers choose their vows; by the time Tōji was born, his had already been signed.",
    },
  },
] as const;

/**
 * ENVANTER — sayfanın kalbi.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Beş bölmeli bir ÇANTA (rulo). Bir bölme açılıyor, alet dışarı çıkıyor ve
 * üç FİZİKSEL okuma (hız / güç / menzil) yükseliyor. Yanındaki LANET
 * ENERJİSİ sütunu hiç kıpırdamıyor: her seçimde `0` yazıyor, geri koymada
 * da `0` yazıyor, hepsini çekince de `0` yazıyor.
 *
 * ── MAKİ'DEN AYRIM (zorunlu) ─────────────────────────────────────────────
 * Maki Zen'in'in sayfasında da envanter var: eşit hücreli bir RAF, seçim
 * stat şeridini yeniden hesaplıyor, sıfır sütunu dört sütun arasında
 * sessiz bir espri. Burada:
 *   · ızgara değil AÇILAN RULO — hücre yok, satır var, ölçüler eşit değil
 *   · seçim tekli değil BİRİKİMLİ, ve geri konabiliyor
 *   · sıfır sütunu espri değil TEZ: sayfanın en büyük tek öğesi o
 *   · iki bölme hiçbir şeyi değiştirmiyor ve ikisi farklı sebeple
 * Aynı kavram (alet envanteri), tamamen başka bir cümle.
 *
 * ⚠️ Beşinci bölme BOŞ. Aletlerden biri değil; 術式'in duracağı yer.
 * Çekilebiliyor, çünkü tıklanabilir olmayan bir yer tutucu tezi
 * anlatmazdı — çekilince hiçbir okuma değişmiyor.
 */
export interface ToujiToolGain {
  /** Hangi fiziksel okuma */
  stat: "speed" | "power" | "reach";
  amount: number;
}

export interface ToujiTool {
  key: string;
  /** Japonca ad — çeviri gerektirmeyen özel ad; boşsa Latin ad kullanılıyor */
  name: string;
  reading: string;
  turkish: LocalizedText;
  line: LocalizedText;
  gains: ToujiToolGain[];
  /** Çekildiğinde durum satırına yazılan cümle */
  pulled: LocalizedText;
}

export const TOUJI_TOOLS: ToujiTool[] = [
  {
    key: "sakahoko",
    name: "天逆鉾",
    reading: "ama-no-sakahoko",
    turkish: { tr: "Ters Mızrak", en: "Inverted Spear of Heaven" },
    line: {
      tr: "Değdiği lanetli tekniği o anda siliyor. Uzaktan atılabiliyor, ve ucuna bağlanan iple geri çağrılıyor.",
      en: "It erases the cursed technique it touches, at the moment of contact. It can be thrown, and called back by the rope tied to it.",
    },
    gains: [
      { stat: "reach", amount: 3 },
      { stat: "power", amount: 1 },
    ],
    pulled: {
      tr: "Ters Mızrak dışarıda. Menzil yükseldi.",
      en: "The Inverted Spear is out. Reach went up.",
    },
  },
  {
    key: "yuun",
    name: "遊雲",
    reading: "yūun",
    turkish: { tr: "Playful Cloud", en: "Playful Cloud" },
    line: {
      tr: "Zincirle bağlı üç parça. Özel dereceli bir alet, ve ağırlığı taşıyabilen birinin elinde tek başına bir güç sınıfı.",
      en: "Three sections joined by chain. A special grade tool, and in the hands of someone who can carry the weight, a power class on its own.",
    },
    gains: [
      { stat: "power", amount: 4 },
      { stat: "reach", amount: 1 },
    ],
    pulled: {
      tr: "Playful Cloud dışarıda. Güç yükseldi.",
      en: "Playful Cloud is out. Power went up.",
    },
  },
  {
    key: "firearm",
    name: "",
    reading: "",
    turkish: { tr: "Ateşli silah", en: "Firearm" },
    line: {
      tr: "Lanetli alet değil. Sıradan, satın alınabilir bir silah — ve Yıldız Plazma Kabı görevini bitiren şey buydu.",
      en: "Not a cursed tool. An ordinary, purchasable weapon — and the thing that ended the Star Plasma Vessel job.",
    },
    gains: [{ stat: "reach", amount: 4 }],
    pulled: {
      tr: "Silah dışarıda. Menzil yükseldi — hiçbir lanet harcanmadan.",
      en: "The gun is out. Reach went up — with no curse spent at all.",
    },
  },
  {
    key: "rope",
    name: "",
    reading: "",
    turkish: { tr: "Aletlere bağlı ip", en: "The rope on the tools" },
    line: {
      tr: "Atılan aleti geri çağıran ip. Tek başına hiçbir şey; ama onsuz atılan alet bir kere kullanılıyor.",
      en: "The rope that calls a thrown tool back. Nothing on its own; but without it, a thrown tool is used once.",
    },
    gains: [{ stat: "speed", amount: 2 }],
    pulled: {
      tr: "İp dışarıda. Hız yükseldi.",
      en: "The rope is out. Speed went up.",
    },
  },
  {
    key: "empty",
    name: "",
    reading: "",
    turkish: { tr: "Boş bölme", en: "The empty pocket" },
    line: {
      tr: "Çantanın beşinci bölmesi. Bir büyücüde burada 術式 dururdu. Açabilirsin — açmak bir şeyi değiştirmiyor, ve değiştirmemesi bu sayfanın söylediği şey.",
      en: "The fifth pocket of the bag. On a sorcerer, 術式 would sit here. You can open it — opening it changes nothing, and that it changes nothing is what this page is saying.",
    },
    gains: [],
    pulled: {
      tr: "Bölme açıldı. İçinde bir şey yok, ve hiçbir okuma değişmedi.",
      en: "The pocket is open. There is nothing inside it, and no reading changed.",
    },
  },
];

/**
 * Üç fiziksel okuma. Taban değerler ALETSİZ hâli: gövdenin kendisi, yani
 * Cennetsel Kısıtlama'nın karşılığı. `max` 12 — bütün aletler çekildiğinde
 * bile hiçbiri tavana dayanmıyor, çünkü tavan bir hedef değil bir ölçek.
 */
export const TOUJI_STATS = [
  {
    key: "speed",
    label: { tr: "Hız", en: "Speed" },
    native: "速",
    base: 6,
    max: 12,
    note: {
      tr: "Gövdeden geliyor, aletten değil.",
      en: "Comes from the body, not the tool.",
    },
  },
  {
    key: "power",
    label: { tr: "Güç", en: "Power" },
    native: "力",
    base: 6,
    max: 12,
    note: {
      tr: "Aletin ağırlığını taşıyabilen kol.",
      en: "The arm that can carry the tool's weight.",
    },
  },
  {
    key: "reach",
    label: { tr: "Menzil", en: "Reach" },
    native: "間",
    base: 2,
    max: 12,
    note: {
      tr: "Tek gerçekten satın alınabilen okuma.",
      en: "The one reading that can genuinely be bought.",
    },
  },
] as const;

/** Envanter adasının bütün arayüz metinleri (istemciye düz dize iniyor). */
export const TOUJI_SATCHEL_UI = {
  rollTitle: { tr: "Çanta", en: "The bag" },
  rollHint: {
    tr: "Bir bölmeyi aç ya da kapat. Sekmeyle gezilebilir; Boşluk ve Enter aynı işi yapıyor.",
    en: "Open or close a pocket. Tab through them; Space and Enter do the same thing.",
  },
  physicalTitle: { tr: "Fiziksel okuma", en: "Physical readings" },
  columnTitle: { tr: "Lanet enerjisi", en: "Cursed energy" },
  columnNative: "呪力",
  columnCaption: {
    tr: "Bu sütun sayfadaki tek değişmeyen şey. Ne çekersen çek, ne kadar çekersen çek, okuduğu sayı aynı kalıyor.",
    en: "This column is the one thing on the page that does not change. Whatever you pull out, however much you pull out, the number it reads stays the same.",
  },
  outBadge: { tr: "dışarıda", en: "out" },
  inBadge: { tr: "çantada", en: "in the bag" },
  attemptsLabel: { tr: "Denenen bölme", en: "Pockets tried" },
  attemptsNote: {
    tr: "Sütunun değeri hâlâ 0.",
    en: "The column still reads 0.",
  },
  resetLabel: { tr: "Hepsini çantaya koy", en: "Put everything back" },
  statusIdle: {
    tr: "Çanta kapalı. Üç fiziksel okuma gövdenin kendi değerinde, lanet enerjisi 0.",
    en: "The bag is closed. The three physical readings sit at the body's own value, cursed energy at 0.",
  },
  statusReturned: {
    tr: "Geri kondu. Fiziksel okuma düştü, lanet enerjisi 0.",
    en: "Put back. The physical reading dropped, cursed energy 0.",
  },
  statusReset: {
    tr: "Çanta kapandı. Bütün aletler içeride, lanet enerjisi hâlâ 0.",
    en: "The bag is closed again. Every tool is inside, cursed energy still 0.",
  },
  statusAll: {
    tr: "Beş bölmenin beşi de açık. Üç okuma tavana yaklaştı, sütun kıpırdamadı.",
    en: "All five pockets are open. Three readings climbed toward the ceiling, the column did not move.",
  },
  closingLine: {
    tr: "Bu, sayfanın tek argümanı: artan taraf satın alınabiliyor, değişmeyen taraf satın alınamıyor. Tōji ömrü boyunca ilk sütunu doldurdu ve ikincisine hiç dokunamadı.",
    en: "This is the page's only argument: the side that rises can be bought, the side that does not cannot. Tōji spent his life filling the first column and never touched the second.",
  },
} satisfies Record<string, LocalizedText | string>;

/**
 * KADER ÇİZELGESİ — beş durak.
 *
 * Damgalar ark adları: 禪院 (klan) · 伏黒 (aldığı ad) · 懐玉 ve 玉折
 * (`kaynak.json`'daki "Kaigyoku・Gyokusetsu" yapımından) · 渋谷.
 * `mark` alanı tırnak içinde bir SÖZ değil, o durağın Japonca terimi —
 * replik disiplini dosya başında yazılı.
 */
export const TOUJI_TIMELINE = [
  {
    key: "zenin",
    stamp: "禪院",
    stampReading: { tr: "Zen'in klanı", en: "The Zen'in clan" },
    title: { tr: "Sıfırla doğdu", en: "Born at zero" },
    text: {
      tr: "Japonya'nın üç büyük büyücü klanından birinde, lanet enerjisi olmadan doğdu. Klanın ölçüsünde bu bir kusurdu ve ona öyle davranıldı. Karşılığında aldığı şey klanın hiçbir üyesinde yoktu: Cennetsel Kısıtlama'nın verdiği gövde.",
      en: "He was born into one of the three great sorcerer clans with no cursed energy at all. By the clan's measure that was a defect, and he was treated as one. What he received in exchange, no member of the clan had: the body that Heavenly Restriction pays out.",
    },
    mark: "天与呪縛",
    markReading: {
      tr: "cennetsel kısıtlama — pazarlık doğumda yapıldı",
      en: "heavenly restriction — the bargain struck at birth",
    },
    imageKey: TOUJI_IMAGE_KEYS.fateZenin,
    kin: null,
  },
  {
    key: "fushiguro",
    stamp: "伏黒",
    stampReading: { tr: "Aldığı ad", en: "The name he took" },
    title: { tr: "Klanı bıraktı", en: "He left the clan" },
    text: {
      tr: "Zen'in adını bıraktı ve evlendiği kadının soyadını aldı: Fushiguro. Oğlu Megumi o soyadla doğdu ve bugün arşivde o soyadla duruyor. Tōji'nin hayatında geri alınamayacak tek iyi karar buydu, ve o da bir addı.",
      en: "He dropped the Zen'in name and took the family name of the woman he married: Fushiguro. His son Megumi was born under that name and stands in this archive under it still. It was the one irreversible good decision of Tōji's life, and even that was only a name.",
    },
    mark: "伏黒恵",
    markReading: { tr: "Fushiguro Megumi — oğlu", en: "Fushiguro Megumi — his son" },
    imageKey: TOUJI_IMAGE_KEYS.fateFushiguro,
    kin: {
      characterId: 126635,
      name: "Megumi Fushiguro",
      role: { tr: "oğlu", en: "his son" },
    },
  },
  {
    key: "kaigyoku",
    stamp: "懐玉",
    stampReading: { tr: "Sipariş", en: "The contract" },
    title: { tr: "Yıldız Plazma Kabı", en: "The Star Plasma Vessel" },
    text: {
      tr: "Yıldız Dini Grubu'ndan bir iş aldı: Yıldız Plazma Kabı'nı öldürmek. Hedefin adı Riko Amanai'ydi ve onu koruyan iki lise öğrencisi vardı, Satoru Gojō ile Suguru Getō. İşi Tōji'ye bağlayan aracı Shiu Kong'du. İş bitti — ve bitiren şey bir lanetli alet bile değildi.",
      en: "He took a job from the Star Religious Group: kill the Star Plasma Vessel. The target's name was Riko Amanai, and two high-school students were guarding her, Satoru Gojō and Suguru Getō. The broker who tied him to the job was Shiu Kong. The job closed — and the thing that closed it was not even a cursed tool.",
    },
    mark: "星漿体",
    markReading: {
      tr: "seishōtai — yıldız plazma kabı",
      en: "seishōtai — star plasma vessel",
    },
    imageKey: TOUJI_IMAGE_KEYS.fateKaigyoku,
    kin: {
      characterId: 127691,
      name: "Satoru Gojō",
      role: { tr: "hedefi koruyan", en: "guarding the target" },
    },
  },
  {
    key: "gyokusetsu",
    stamp: "玉折",
    stampReading: { tr: "Dövüşün sonu", en: "The end of the fight" },
    title: { tr: "Gojō'yu bir kere öldürdü", en: "He killed Gojō once" },
    text: {
      tr: "Sınırsız'ın karşısına lanet enerjisiyle çıkılmıyor; Tōji Ters Mızrak'la çıktı ve Gojō'yu bir kez öldürdü. Gojō geri döndü, dövüş orada bitti. Tōji ölürken oğlunu Zen'in klanına sattığını söyledi — o cümle yıllar sonra Megumi'yi klanın elinden çıkaran şey oldu.",
      en: "You do not meet Limitless with cursed energy; Tōji met it with the Inverted Spear and killed Gojō once. Gojō came back, and the fight ended there. As he was dying Tōji said he had sold his son to the Zen'in clan — that sentence was what pulled Megumi out of the clan's hands years later.",
    },
    mark: "天逆鉾",
    markReading: {
      tr: "ama-no-sakahoko — tekniği geçersiz kılan alet",
      en: "ama-no-sakahoko — the tool that voids the technique",
    },
    imageKey: TOUJI_IMAGE_KEYS.fateGyokusetsu,
    kin: {
      characterId: 133699,
      name: "Suguru Getō",
      role: { tr: "aynı görevin öbür tarafı", en: "the other side of the same job" },
    },
  },
  {
    key: "shibuya",
    stamp: "渋谷",
    stampReading: { tr: "Yıllar sonra", en: "Years later" },
    title: { tr: "Adını sordu", en: "He asked for the name" },
    text: {
      tr: "Shibuya'da bedeni geri çağrıldı; çağıran, Getō'nun bedenini taşıyan taraftı. Karşısına çıkan büyücü kendi oğluydu. Tōji onu tanımadı, dövüştü, sonra adını sordu. Cevabı duyduğunda dövüşü kimse kazanmadı — Tōji onu kendi eliyle bitirdi.",
      en: "In Shibuya his body was called back; the one calling was the side wearing Getō's body. The sorcerer who stepped in front of him was his own son. Tōji did not recognise him, fought him, then asked for his name. When he heard the answer, nobody won the fight — Tōji ended it with his own hand.",
    },
    mark: "伏黒",
    markReading: {
      tr: "Fushiguro — sorduğu ad, kendi verdiği ad",
      en: "Fushiguro — the name he asked for, the name he gave",
    },
    imageKey: TOUJI_IMAGE_KEYS.fateShibuya,
    kin: {
      characterId: 126635,
      name: "Megumi Fushiguro",
      role: { tr: "karşısındaki büyücü", en: "the sorcerer facing him" },
    },
  },
] as const;

/**
 * NEXUS BAĞLARI.
 *
 * Dört kimlik merkezdeki `EXPERIENCE_COMPANIONS[162722]` kaydıyla birebir:
 * 126635 · 134167 · 127691 · 133699. Başka bir kimlik çizilirse kadrajı
 * sonsuza kadar boş kalır, o yüzden liste burada da aynı dört numara.
 *
 * Riko Amanai ve Shiu Kong'un arşivde numarası YOK — düz ad olarak
 * yazıldılar, bağlantı kurulmadı.
 */
export const TOUJI_BONDS = [
  {
    characterId: 126635,
    name: "Megumi Fushiguro",
    native: "伏黒恵",
    role: { tr: "oğlu", en: "his son" },
    line: {
      tr: "Tōji'nin bıraktığı tek şey soyadıydı ve Megumi onu taşıyor. İkisi Shibuya'da bir kere karşılaştı; Tōji oğlunu ancak adını sorduktan sonra tanıdı.",
      en: "The only thing Tōji left behind was a family name, and Megumi carries it. They met once, in Shibuya; Tōji recognised his son only after asking for his name.",
    },
  },
  {
    characterId: 134167,
    name: "Maki Zen'in",
    native: "禪院真希",
    role: { tr: "klan üstünden akrabası", en: "kin through the clan" },
    line: {
      tr: "Zen'in klanının aynı ölçüsü ikisini de dışarı itti. Maki de bedeniyle çözdü — ama Tōji'nin aksine klanın içinde kalıp cevabı orada verdi.",
      en: "The same Zen'in measure pushed them both out. Maki also answered with her body — but unlike Tōji she stayed inside the clan and gave the answer there.",
    },
  },
  {
    characterId: 127691,
    name: "Satoru Gojō",
    native: "五条悟",
    role: { tr: "bir kere öldürdüğü", en: "the one he killed once" },
    line: {
      tr: "Lanet enerjisi olmayan biri, jujutsu tarihinin en güçlü büyücüsünü bir kez öldürdü. Gojō geri döndü; o yenilgi Gojō'nun bir daha asla aynı şekilde dövüşmemesinin sebebi oldu.",
      en: "A man with no cursed energy killed the strongest sorcerer in jujutsu history, once. Gojō came back; that defeat is the reason he never fought the same way again.",
    },
  },
  {
    characterId: 133699,
    name: "Suguru Getō",
    native: "夏油傑",
    role: { tr: "aynı görevin öbür tarafı", en: "the other side of the same job" },
    line: {
      tr: "Yıldız Plazma Kabı görevinde karşı taraftaydı. Yıllar sonra Tōji'nin bedenini Shibuya'ya geri çağıran el de Getō'nun bedenini taşıyordu.",
      en: "He stood on the opposite side of the Star Plasma Vessel job. Years later, the hand that called Tōji's body back to Shibuya was wearing Getō's body.",
    },
  },
] as const;

/** Arşivde numarası olmayan adlar — bağlantı kurulmuyor (görev şartı). */
export const TOUJI_PLAIN_NAMES = [
  {
    name: "Riko Amanai",
    role: { tr: "Yıldız Plazma Kabı", en: "the Star Plasma Vessel" },
  },
  {
    name: "Shiu Kong",
    role: { tr: "işi bağlayan aracı", en: "the broker who tied the job" },
  },
] as const;

export const TOUJI_BOND_UI = {
  hasPage: { tr: "arşivde dosyası var", en: "has a file in the archive" },
  noPage: { tr: "arşivde dosyası yok", en: "no file in the archive" },
} satisfies Record<string, LocalizedText>;

/**
 * KAPANIŞ.
 *
 * ⚠️ İki blok da SÖZ DEĞİL AD (replik disiplini, dosya başı): birincisi
 * ona başkalarının verdiği ad, ikincisi kendi aldığı ad. İkisi de
 * `kaynak.json`'da doğrulanabiliyor. Motto da bir cümle değil bir terim.
 */
export const TOUJI_CLOSING = {
  lines: [
    {
      text: "呪術師殺し",
      reading: { tr: "jujutsushi-goroshi", en: "jujutsushi-goroshi" },
      turkish: { tr: "Büyücü Katili", en: "Sorcerer Killer" },
      note: {
        tr: "Ona başkalarının verdiği ad. Bir tekniği olmadığı için değil, olmadığı hâlde işini bitirdiği için verildi.",
        en: "The name other people gave him. Not because he had no technique, but because he finished the job without one.",
      },
      by: {
        tr: "Büyücü çevresinin kaydı — AniList künyesinde \"Sorcerer Killer\"",
        en: "The sorcerers' record — \"Sorcerer Killer\" in the AniList entry",
      },
    },
    {
      text: "伏黒",
      reading: { tr: "fushiguro", en: "fushiguro" },
      turkish: { tr: "Fushiguro", en: "Fushiguro" },
      note: {
        tr: "Kendi aldığı ad. Önce eşinin soyadıydı, sonra oğlunun soyadı oldu; Tōji'den geriye kalan tek şey de bu.",
        en: "The name he chose. First his wife's family name, then his son's; and the only thing left of Tōji.",
      },
      by: {
        tr: "Doğduğu ad 禪院甚爾 — AniList künyesinde \"Touji Zenin\"",
        en: "Born 禪院甚爾 — \"Touji Zenin\" in the AniList entry",
      },
    },
  ],
  quoteNote: {
    tr: "Bu sayfada tırnak içinde tek bir cümle yok. Tōji'nin Japonca repliklerinin birebir yazımı doğrulanamadı ve arşivin kuralı açık: emin olunmayan satır yazılmaz. Olaylar anlatı sesiyle anlatıldı, Japonca yalnızca doğrulanmış terimlerde ve adlarda kullanıldı.",
    en: "There is not one sentence in quotation marks on this page. The exact Japanese wording of Tōji's lines could not be verified, and the archive's rule is plain: an unverified line does not get written. The events are told in narrative voice; Japanese appears only in verified terms and names.",
  },
  motto: "天与呪縛",
  mottoNote: {
    tr: "Ten'yo jubaku — cennetsel kısıtlama. Bir şeyden tamamen vazgeçiliyor, karşılığında başka bir şey insan sınırının ötesine geçiyor. Tōji'nin vazgeçtiği şey seçilmedi, doğumda verildi; sayfanın üstündeki boşluk da o.",
    en: "Ten'yo jubaku — heavenly restriction. Something is given up completely, and in exchange something else crosses the human limit. What Tōji gave up was not chosen; it was handed to him at birth. The emptiness at the top of this page is that.",
  },
  credit: {
    tr: "Künye ve portre: AniList — Touji Fushiguro (#162722).",
    en: "Record and portrait: AniList — Touji Fushiguro (#162722).",
  },
  creditLink: {
    tr: "anilist.co/character/162722",
    en: "anilist.co/character/162722",
  },
  creditNote: {
    tr: "Portre AniList'in resmî karesi (230×345) ve repoda duruyor — hotlink yok. Sayfadaki bütün siluetler elle çizilmiş SVG; hiçbiri dışarıdan indirilmedi. Anlatı arşivin kendi yazısı.",
    en: "The portrait is AniList's official image (230×345) and is stored in this repository — no hotlinking. Every silhouette on the page is hand-drawn SVG; none of it was downloaded. The prose is the archive's own.",
  },
} as const;

/** `CuratorGaps` başlıkları — yalnızca küratör modunda görünüyor. */
export const TOUJI_GAPS = {
  title: { tr: "Boş kadrajlar", en: "Empty frames" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bu sayfadaki bütün kadrajlar dolu.",
    en: "Every frame on this page is filled.",
  },
} satisfies Record<string, LocalizedText>;
