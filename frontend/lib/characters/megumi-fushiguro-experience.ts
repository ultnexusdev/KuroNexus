import type { LocalizedText } from "./types";

/**
 * Megumi Fushiguro — "Gölge Menajerisi" (`ShadowMenagerieExperience`) verisi.
 *
 * ⚠️ BU DOSYA YENİ. Eski veri dosyası
 * `components/character/.deprecated/megumi-fushiguro/data.ts` altındaydı
 * (2026-09-01'de silindi — denetim B-06, git geçmişinde duruyor);
 * oradan METİN taşındı ama hiçbir şey import edilmedi (Faz 2 · Dalga 5 şartı).
 * Taşınırken düzeltilen üç şey aşağıda "DÜZELTİLENLER" başlığında yazılı.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * On Gölge bir liste değil bir BÜTÇE. Sayfanın altında tek bir gölge havuzu
 * var; on şikigami onu paylaşıyor. Bir şikigami çağrıldığında havuz o kadar
 * küçülüyor ve yaratık sayfada kalıyor. Havuz bitince yenisi çağrılamıyor —
 * çağrılanlardan birini geri göndermek gerekiyor.
 *
 * ── HAVUZUN SAYILARI KANON DEĞİL ─────────────────────────────────────────
 * `cost` alanları bir OKUMA ARACI: kaynakta şikigami başına sayısal bir
 * lanet enerjisi bedeli verilmiyor. Sıralama kanonun söylediği tek şeyi
 * izliyor — 満象 listenin en pahalısı, 脱兎 ve 蝦蟇 en ucuzları. Sayfa bunu
 * ziyaretçiye AÇIKÇA söylüyor (`MEGUMI_POOL_UI.deviceNote`), çünkü uydurulmuş
 * bir sayıyı kanon gibi sunmak Dalga 1'in beşinci dersinin ihlali olurdu.
 *
 * ── DÜZELTİLENLER (eski data.ts'e göre) ──────────────────────────────────
 *  1. 嵌合暗翳庭'in romanizasyonu "Kanmoki An'ei Tei" yazılmıştı; kana
 *     okunuşu (かんごうあんえいてい) ile çelişiyordu. **Kangō An'ei Tei**.
 *  2. 調伏の儀 "Chōfuku no Gi" yazılmıştı; 調伏 Budist terim olarak
 *     **chōbuku** okunuyor. Kana da ちょうぶくのぎ olarak düzeltildi.
 *  3. Beyaz köpeğin kırıldığı görev "ilk büyük görevi" diye anlatılıyordu;
 *     kaynağa göre bu erken bir görev ama "ilk" olduğu doğrulanamıyor —
 *     cümle "erken bir görevde" olarak yumuşatıldı. Aynı disiplinle
 *     Gojō'nun onu bulduğu an için verilen "13 yaş" kaldırıldı: künyede
 *     böyle bir sayı yok, "ortaokul yılları" yazıldı.
 *
 * ── SAYILARIN KAYNAĞI ────────────────────────────────────────────────────
 * Doğum (22 Aralık 2002), yaş (15), boy (175 cm), derece (2. sınıf büyücü),
 * teknik ve okul AniList künyesinden birebir
 * (`public/assets/anime/karakterler/megumi-fushiguro/kaynak.json`,
 * karakter 126635). Kan grubu künyede BOŞ — şeritte de yok.
 */

export const MEGUMI_ID = 126635;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const MEGUMI_SITE_URL = "https://anilist.co/character/126635";

/** Depodaki resmî portre. 230×345 — KÜÇÜK, o yüzden yalnızca dar madalyon. */
export const MEGUMI_PORTRAIT = {
  src: "/assets/anime/karakterler/megumi-fushiguro/anilist-portrait.png",
  w: 230,
  h: 345,
} as const;

/* ══ Küratör yuvaları ══════════════════════════════════════════════════════
   On altı ABILITY anahtarı, hepsi `meg:` önekli. Her biri sayfada bir
   kadrajın HEMEN ALTINDA duruyor; sayfa sonunda toplu yuva bloğu YOK. */

export const MEGUMI_IMAGE_KEYS = {
  hero: "meg:hero",
  jusshiki: "meg:jusshiki",
  garden: "meg:garden",
  ritual: "meg:ritual",
  store: "meg:store",
  chain: "meg:chain",
  zenin: "meg:zenin",
  incomplete: "meg:incomplete",
  pool: "meg:pool",
  fateBought: "meg:fate-bought",
  fateSister: "meg:fate-sister",
  fateFound: "meg:fate-found",
  fateBroken: "meg:fate-broken",
  fateRitual: "meg:fate-ritual",
  bonds: "meg:bonds",
  closing: "meg:closing",
} as const;

export const MEGUMI_SLOT_LABELS: Record<string, LocalizedText> = {
  [MEGUMI_IMAGE_KEYS.hero]: {
    tr: "Hero — Megumi ve ayaklarının altında yayılan gölge",
    en: "Hero — Megumi and the shadow spreading under his feet",
  },
  [MEGUMI_IMAGE_KEYS.jusshiki]: {
    tr: "On Gölge Tekniği — el işareti ve açılan gölge",
    en: "Ten Shadows Technique — the hand sign and the opening shadow",
  },
  [MEGUMI_IMAGE_KEYS.garden]: {
    tr: "Kangō An'ei Tei — zemini kaplayan gölge bahçesi",
    en: "Chimera Shadow Garden — the shadow flooding the floor",
  },
  [MEGUMI_IMAGE_KEYS.ritual]: {
    tr: "Chōbuku no Gi — ritüel okunurken, tek kare",
    en: "The taming ritual — mid-incantation, a single frame",
  },
  [MEGUMI_IMAGE_KEYS.store]: {
    tr: "Gölgeye bırakılan eşya — elin yüzeye girdiği an",
    en: "An object stored in shadow — the hand entering the surface",
  },
  [MEGUMI_IMAGE_KEYS.chain]: {
    tr: "Banri no Kusari — gölgeden çıkan zincir",
    en: "Chain of a Thousand Miles — the chain leaving the shadow",
  },
  [MEGUMI_IMAGE_KEYS.zenin]: {
    tr: "Zen'in konağı — arma ya da avlu",
    en: "The Zen'in estate — the crest or the courtyard",
  },
  [MEGUMI_IMAGE_KEYS.incomplete]: {
    tr: "Yarım kalan alan — kubbesi kapanmamış gölge",
    en: "The unfinished domain — a shadow whose dome never closes",
  },
  [MEGUMI_IMAGE_KEYS.pool]: {
    tr: "Havuz — yerden yükselmeye başlayan tek gölge kütlesi",
    en: "The pool — a single shadow mass beginning to rise from the ground",
  },
  [MEGUMI_IMAGE_KEYS.fateBought]: {
    tr: "Alınmayan çocuk — Zen'in avlusu ve küçük bir siluet",
    en: "The child who was not taken — the Zen'in courtyard and a small silhouette",
  },
  [MEGUMI_IMAGE_KEYS.fateSister]: {
    tr: "Tsumiki — hastane odası, uyuyan abla",
    en: "Tsumiki — the hospital room, the sleeping sister",
  },
  [MEGUMI_IMAGE_KEYS.fateFound]: {
    tr: "Bulunma — okul bahçesinde iki figür",
    en: "Being found — two figures in a schoolyard",
  },
  [MEGUMI_IMAGE_KEYS.fateBroken]: {
    tr: "Beyazın son anı — dağılan siluet",
    en: "The white one's last moment — a silhouette coming apart",
  },
  [MEGUMI_IMAGE_KEYS.fateRitual]: {
    tr: "Ritüelin okunduğu an — çevresinde çember",
    en: "The moment the ritual is read — a circle around him",
  },
  [MEGUMI_IMAGE_KEYS.bonds]: {
    tr: "Bağlar — Takım Gojō, üç kişilik bir kare",
    en: "Bonds — Team Gojō, a frame of three",
  },
  [MEGUMI_IMAGE_KEYS.closing]: {
    tr: "Kapanış — tek figür, uzayan gölge, düşük kontrast",
    en: "Closing — a lone figure, a lengthening shadow, low contrast",
  },
};

export const MEGUMI_SLOT_SIZES: Record<string, { w: number; h: number }> = {
  [MEGUMI_IMAGE_KEYS.hero]: { w: 1600, h: 900 },
  [MEGUMI_IMAGE_KEYS.jusshiki]: { w: 1400, h: 800 },
  [MEGUMI_IMAGE_KEYS.garden]: { w: 1400, h: 800 },
  [MEGUMI_IMAGE_KEYS.ritual]: { w: 1400, h: 800 },
  [MEGUMI_IMAGE_KEYS.store]: { w: 900, h: 900 },
  [MEGUMI_IMAGE_KEYS.chain]: { w: 900, h: 900 },
  [MEGUMI_IMAGE_KEYS.zenin]: { w: 900, h: 900 },
  [MEGUMI_IMAGE_KEYS.incomplete]: { w: 900, h: 900 },
  [MEGUMI_IMAGE_KEYS.pool]: { w: 1600, h: 700 },
  [MEGUMI_IMAGE_KEYS.fateBought]: { w: 1200, h: 700 },
  [MEGUMI_IMAGE_KEYS.fateSister]: { w: 1200, h: 700 },
  [MEGUMI_IMAGE_KEYS.fateFound]: { w: 1200, h: 700 },
  [MEGUMI_IMAGE_KEYS.fateBroken]: { w: 1200, h: 700 },
  [MEGUMI_IMAGE_KEYS.fateRitual]: { w: 1200, h: 700 },
  [MEGUMI_IMAGE_KEYS.bonds]: { w: 1400, h: 700 },
  [MEGUMI_IMAGE_KEYS.closing]: { w: 1600, h: 640 },
};

/** Yalnızca YÖNETİCİ görüyor: boş kadrajın üretim künyesi (Dalga 1 · ders 1). */
export const MEGUMI_SLOT_SPECS: Record<string, LocalizedText> = {
  [MEGUMI_IMAGE_KEYS.hero]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [MEGUMI_IMAGE_KEYS.jusshiki]: {
    tr: "geniş kadraj · 1400×800 · webp",
    en: "wide frame · 1400×800 · webp",
  },
  [MEGUMI_IMAGE_KEYS.garden]: {
    tr: "geniş kadraj · 1400×800 · webp",
    en: "wide frame · 1400×800 · webp",
  },
  [MEGUMI_IMAGE_KEYS.ritual]: {
    tr: "geniş kadraj · 1400×800 · webp",
    en: "wide frame · 1400×800 · webp",
  },
  [MEGUMI_IMAGE_KEYS.store]: {
    tr: "kare kadraj · 900×900 · webp",
    en: "square frame · 900×900 · webp",
  },
  [MEGUMI_IMAGE_KEYS.chain]: {
    tr: "kare kadraj · 900×900 · webp",
    en: "square frame · 900×900 · webp",
  },
  [MEGUMI_IMAGE_KEYS.zenin]: {
    tr: "kare kadraj · 900×900 · webp",
    en: "square frame · 900×900 · webp",
  },
  [MEGUMI_IMAGE_KEYS.incomplete]: {
    tr: "kare kadraj · 900×900 · webp",
    en: "square frame · 900×900 · webp",
  },
  [MEGUMI_IMAGE_KEYS.pool]: {
    tr: "panorama şerit · 1600×700 · webp",
    en: "panoramic band · 1600×700 · webp",
  },
  [MEGUMI_IMAGE_KEYS.fateBought]: {
    tr: "sahne karesi · 1200×700 · webp",
    en: "scene frame · 1200×700 · webp",
  },
  [MEGUMI_IMAGE_KEYS.fateSister]: {
    tr: "sahne karesi · 1200×700 · webp",
    en: "scene frame · 1200×700 · webp",
  },
  [MEGUMI_IMAGE_KEYS.fateFound]: {
    tr: "sahne karesi · 1200×700 · webp",
    en: "scene frame · 1200×700 · webp",
  },
  [MEGUMI_IMAGE_KEYS.fateBroken]: {
    tr: "sahne karesi · 1200×700 · webp",
    en: "scene frame · 1200×700 · webp",
  },
  [MEGUMI_IMAGE_KEYS.fateRitual]: {
    tr: "sahne karesi · 1200×700 · webp",
    en: "scene frame · 1200×700 · webp",
  },
  [MEGUMI_IMAGE_KEYS.bonds]: {
    tr: "grup karesi · 1400×700 · webp",
    en: "group frame · 1400×700 · webp",
  },
  [MEGUMI_IMAGE_KEYS.closing]: {
    tr: "kapanış şeridi · 1600×640 · webp",
    en: "closing band · 1600×640 · webp",
  },
};

export const MEGUMI_PORTRAIT_SLOT: LocalizedText = {
  tr: "Portre — dikey kadraj, 1200×1600, webp",
  en: "Portrait — vertical frame, 1200×1600, webp",
};

/** Boş kadrajın üstündeki tek kelime — YALNIZCA yöneticide çiziliyor. */
export const MEGUMI_FRAME_EMPTY: LocalizedText = {
  tr: "Boş yuva",
  en: "Empty slot",
};

export const MEGUMI_GAPS = {
  title: { tr: "Yüklenecek kadrajlar", en: "Frames to fill" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "On altı kadrajın hepsi dolu.",
    en: "All sixteen frames are filled.",
  },
} as const;

/* ══ Kimlik ════════════════════════════════════════════════════════════════ */

export const MEGUMI_CRUMB = {
  series: { tr: "Jujutsu Kaisen", en: "Jujutsu Kaisen" },
} as const;

export const MEGUMI_IDENTITY = {
  name: "Megumi Fushiguro",
  nativeName: "伏黒恵",
  /** Filigran — dekoratif (`aria-hidden`) */
  watermark: "十種影法術",
  seal: { tr: "MÜHÜR", en: "SEAL" },
  house: {
    tr: "Zen'in kanı · Tokyo Jujutsu Lisesi birinci sınıf",
    en: "Zen'in blood · first year at Tokyo Jujutsu High",
  },
  epigraph: {
    tr: "Gölge bir saklanma yeri değil bir hazne: içinde tam olarak on tane var ve her çağrı ondan eksiltiyor.",
    en: "The shadow is not a hiding place but a reservoir: it holds exactly ten, and every call takes from it.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Born" },
      value: { tr: "22 Aralık 2002", en: "22 December 2002" },
    },
    { label: { tr: "Yaş", en: "Age" }, value: { tr: "15", en: "15" } },
    { label: { tr: "Boy", en: "Height" }, value: { tr: "175 cm", en: "175 cm" } },
    {
      label: { tr: "Derece", en: "Grade" },
      value: { tr: "2. sınıf büyücü", en: "Grade 2 sorcerer" },
    },
    {
      label: { tr: "Lanetli teknik", en: "Cursed technique" },
      value: {
        tr: "On Gölge Tekniği · 十種影法術",
        en: "Ten Shadows Technique · 十種影法術",
      },
    },
    {
      label: { tr: "Bağlı olduğu yer", en: "Affiliation" },
      value: { tr: "Tokyo Jujutsu Lisesi", en: "Tokyo Jujutsu High" },
    },
    {
      label: { tr: "Sembolik nesne", en: "Symbolic object" },
      value: {
        tr: "İki elin arasında açılan gölge",
        en: "The shadow opened between two hands",
      },
    },
  ],
} as const;

export const MEGUMI_MISSING_NOTE: LocalizedText = {
  tr: "Kan grubu AniList künyesinde boş; şeritte de uydurulmadı.",
  en: "Blood type is blank in the AniList record, so it is not invented here either.",
};

export const MEGUMI_ALT = {
  scenePrefix: { tr: "Kadraj —", en: "Frame —" },
  companionSuffix: {
    tr: "— arşivin yüklediği portre",
    en: "— portrait uploaded by the archive",
  },
} as const;

export const MEGUMI_HERO = {
  lede: {
    tr: "Megumi'nin tekniği bir saldırı değil bir BÜTÇE. Ayağının dibindeki gölge tek bir hazne ve on şikigami onu paylaşıyor: biri çıktığında hazne o kadar küçülüyor, ve o yaratık geri gönderilmeden yenisi çağrılamıyor. Sayfanın alt kenarında duran şerit o hazne; aşağıdaki bölümler onun üstünde akıyor.",
    en: "Megumi's technique is not an attack but a BUDGET. The shadow at his feet is one reservoir and ten shikigami share it: when one comes out the reservoir shrinks by that much, and nothing new can be called until something is sent back. The strip along the bottom edge of this page is that reservoir; the sections below flow above it.",
  },
  portraitAlt: {
    tr: "Megumi Fushiguro — AniList künye portresi",
    en: "Megumi Fushiguro — AniList dossier portrait",
  },
  portraitAltUploaded: {
    tr: "Megumi Fushiguro — arşivin yüklediği portre",
    en: "Megumi Fushiguro — portrait uploaded by the archive",
  },
  heroCaption: {
    tr: "Bu geniş kadraj bilerek boş: depodaki resmî portre 230×345 ve tam kanama bir kare için küçük.",
    en: "This wide frame is deliberately empty: the official portrait in the repository is 230×345, too small for a full-bleed frame.",
  },
} as const;

/* ══ Mod düğmesi — "Alan" ══════════════════════════════════════════════════ */

export const MEGUMI_DOMAIN = {
  title: { tr: "Alan", en: "Domain" },
  native: "嵌合暗翳庭",
  enter: { tr: "Alanı aç", en: "Open the domain" },
  exit: { tr: "Alanı kapat", en: "Close the domain" },
  hintOff: {
    tr: "Alan kapalı: bölümlerin kenarları duruyor, gölge yalnızca alttaki şeritte.",
    en: "The domain is closed: section edges hold, and the shadow stays in the strip below.",
  },
  hintOn: {
    tr: "Alan açık: zemin tamamen gölgeye döndü, bölüm kenarları kayboldu, sayfa tek bir sürekli karanlık.",
    en: "The domain is open: the floor has turned entirely to shadow, section edges are gone, and the page is one continuous dark field.",
  },
  note: {
    tr: "Kangō An'ei Tei kubbe kurmuyor, ZEMİNİ alıyor. Düğme de sayfaya aynısını yapıyor: ışığı değil, zemini değiştiriyor.",
    en: "Chimera Shadow Garden raises no dome; it takes the FLOOR. This button does the same to the page: it changes the ground, not the light.",
  },
} as const;

/* ══ Bölüm başlıkları ══════════════════════════════════════════════════════ */

export const MEGUMI_SECTIONS = {
  identity: {
    seal: "恵",
    title: { tr: "Künye", en: "Dossier" },
    lede: {
      tr: "AniList kaydından birebir; boş alanlar boş bırakıldı.",
      en: "Verbatim from the AniList record; blank fields left blank.",
    },
  },
  arts: {
    seal: "術式",
    title: { tr: "Üç sütun", en: "Three pillars" },
    lede: {
      tr: "Teknik, alan genişletmesi ve tekniğin fiyatını belirleyen ritüel.",
      en: "The technique, the domain expansion, and the ritual that sets the technique's price.",
    },
  },
  kit: {
    seal: "影",
    title: { tr: "Dört ayrıntı", en: "Four details" },
    lede: {
      tr: "Gölgenin şikigami dışında ne işe yaradığı — ve mirasın ağırlığı.",
      en: "What the shadow does beyond shikigami — and the weight of the inheritance.",
    },
  },
  pool: {
    seal: "十種",
    title: { tr: "Gölge havuzu", en: "The shadow pool" },
    lede: {
      tr: "Aşağıdaki şerit tek bir havuz. Bir şikigami çağır: havuz o kadar küçülür ve yaratık bölümlerin arasına yerleşir. Sekizinin toplam bedeli haznenin tuttuğundan fazla, yani hepsi aynı anda sahada olamıyor — havuz bittiğinde devam etmek için birini geri göndermek gerekiyor.",
      en: "The strip below is a single pool. Call a shikigami: the pool shrinks by that much and the creature settles between the sections. The eight together cost more than the reservoir holds, so they cannot all be on the field at once — when the pool runs out you have to send one back to keep going.",
    },
  },
  fate: {
    seal: "五",
    title: { tr: "Beş durak", en: "Five stops" },
    lede: {
      tr: "Adaleti eşit dağıtmamaya karar veren bir çocuğun kısa geçmişi.",
      en: "The short history of a boy who decided not to hand out justice equally.",
    },
  },
  bonds: {
    seal: "縁",
    title: { tr: "Bağlar", en: "Bonds" },
    lede: {
      tr: "Arşivde dosyası olan adlar bağlantılı; olmayanlar düz yazılıyor.",
      en: "Names with a file in the archive are linked; the others are plain text.",
    },
  },
  closing: {
    seal: "終",
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "Bir kere eksilen haznenin arkasında kalan.",
      en: "What remains behind a reservoir once it has been reduced.",
    },
  },
} as const;

/* ══ 4 · Güç laboratuvarı — üç büyük ═══════════════════════════════════════
   Terminoloji Jujutsu Kaisen'in kendi sözlüğü: 呪術 · 呪術式 · 領域展開 ·
   反転術式 · 呪力 · 十種影法術 · 式神. Bleach ya da Naruto terimi yok. */

export interface MegumiArt {
  key: string;
  kanji: string;
  name: string;
  reading: string;
  turkish: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
  imageKey: string;
  /** JJK evren sayfasındaki çapa (`#domain`, `#society`, `#grades`) */
  anchor?: string;
  anchorLabel?: LocalizedText;
}

export const MEGUMI_ARTS: MegumiArt[] = [
  {
    key: "jusshiki",
    kanji: "十種影法術",
    name: "Jusshu Kagehōjutsu",
    reading: "じゅっしゅかげほうじゅつ",
    turkish: { tr: "On Gölge Tekniği", en: "Ten Shadows Technique" },
    tagline: {
      tr: "Bir lanetli teknik (呪術式) değil, on ayrı sözleşme.",
      en: "Not one cursed technique (呪術式) but ten separate contracts.",
    },
    text: {
      tr: "Zen'in ailesinin kanıyla geçen miras teknik. İki elin arasında açılan gölge bir yüzey değil bir geçit: oradan on şikigami'den (式神) biri çıkıyor. Her biri kendi doğasıyla geliyor — biri koku alıyor, biri tutuyor, biri deliyor, biri iyileştiriyor. Kullanıcı hepsine birden sahip değil; her şikigami ayrı ayrı terbiye edilmek zorunda ve terbiye edilen de bedava gelmiyor: çağrı lanet enerjisiyle (呪力) ödeniyor.",
      en: "An inherited technique carried in Zen'in blood. The shadow that opens between two hands is not a surface but a passage: one of ten shikigami (式神) comes through it. Each arrives with its own nature — one tracks by scent, one holds, one pierces, one heals. The user does not own them all at once; every shikigami has to be tamed separately, and even a tamed one is not free: the call is paid in cursed energy (呪力).",
    },
    traits: [
      { tr: "On şikigami · 式神", en: "Ten shikigami · 式神" },
      { tr: "Miras teknik", en: "Inherited technique" },
      { tr: "Tek tek terbiye", en: "Tamed one at a time" },
    ],
    imageKey: MEGUMI_IMAGE_KEYS.jusshiki,
    anchor: "grades",
    anchorLabel: {
      tr: "Evren sayfası — büyücü dereceleri",
      en: "Universe page — sorcerer grades",
    },
  },
  {
    key: "garden",
    kanji: "嵌合暗翳庭",
    name: "Kangō An'ei Tei",
    reading: "かんごうあんえいてい",
    turkish: { tr: "Kaynaşmış Gölge Bahçesi", en: "Chimera Shadow Garden" },
    tagline: {
      tr: "Alan genişletmesi (領域展開) kubbe kurmaz, zemini alır.",
      en: "A domain expansion (領域展開) that raises no dome and takes the floor instead.",
    },
    text: {
      tr: "Alan genişletmesi bir kubbe yerine ZEMİNİ ele geçiriyor: her yer gölge olduğu için her yer bir çıkış kapısı. Şikigami artık tek bir noktadan değil, ayak bastığın her yerden çıkabiliyor. Megumi bu alanı kubbesi kapanmamış hâlde kullanıyor — yarım kalan bir alan garanti isabeti vermiyor, ama açık kalmasının bedeli de düşük. Sayfadaki 'Alan' düğmesi tam olarak bunu yapıyor: zemin gölgeye dönüyor, bölüm kenarları kayboluyor.",
      en: "Instead of raising a dome, this domain expansion seizes the FLOOR: everything is shadow, so everything is an exit. Shikigami no longer emerge from a single point but from wherever you set foot. Megumi uses it with the dome unfinished — an incomplete domain forfeits the guaranteed hit, but its upkeep is cheap. The 'Domain' button on this page does exactly that: the ground turns to shadow and section edges disappear.",
    },
    traits: [
      { tr: "Zemin tabanlı", en: "Floor-based" },
      { tr: "Çoklu çıkış", en: "Many exits" },
      { tr: "Bilerek yarım", en: "Deliberately incomplete" },
    ],
    imageKey: MEGUMI_IMAGE_KEYS.garden,
    anchor: "domain",
    anchorLabel: {
      tr: "Evren sayfası — alan genişletmesi",
      en: "Universe page — domain expansion",
    },
  },
  {
    key: "ritual",
    kanji: "調伏の儀",
    name: "Chōbuku no Gi",
    reading: "ちょうぶくのぎ",
    turkish: { tr: "Terbiye Ritüeli", en: "The Taming Ritual" },
    tagline: {
      tr: "Kazanılan bir izin — verilen değil.",
      en: "Permission won, not permission granted.",
    },
    text: {
      tr: "Bir şikigami kendiliğinden hizmet etmiyor: önce yenilmesi gerekiyor. Ritüel o dövüşün çağrısı ve kaybedilirse bedeli hayat. Terbiye edilen şikigami sonsuza kadar çağrılabilir hâle geliyor; yok edilen ise bir daha asla dönmüyor. Tekniğin bütün ağırlığı bu iki kuralın arasında: kazanılan kalıcı, kaybedilen kalıcı.",
      en: "A shikigami does not serve on its own: it must first be beaten. The ritual is the summons to that fight, and losing it costs a life. A tamed shikigami becomes callable forever; a destroyed one never returns. The whole weight of the technique sits between those two rules: what is won is permanent, and so is what is lost.",
    },
    traits: [
      { tr: "Kazanılırsa kalıcı", en: "Permanent if won" },
      { tr: "Kaybedilirse ölüm", en: "Death if lost" },
      { tr: "Geri alınamaz", en: "Irreversible" },
    ],
    imageKey: MEGUMI_IMAGE_KEYS.ritual,
  },
];

/* ══ 4b · Dört küçük ═══════════════════════════════════════════════════════ */

export interface MegumiKit {
  key: string;
  kanji: string;
  name: LocalizedText;
  note: LocalizedText;
  imageKey: string;
}

export const MEGUMI_KIT: MegumiKit[] = [
  {
    key: "store",
    kanji: "影",
    name: { tr: "Gölgeye bırakmak", en: "Storing in shadow" },
    note: {
      tr: "Gölge yalnızca şikigami çıkarmıyor; içine eşya da giriyor. Bir kılıç, bir lanetli nesne, bir yaralı — hepsi yüzeyin altına konabiliyor ve istendiğinde geri alınıyor.",
      en: "The shadow does not only produce shikigami; things go into it too. A blade, a cursed object, a wounded body — all can be slipped below the surface and taken back on demand.",
    },
    imageKey: MEGUMI_IMAGE_KEYS.store,
  },
  {
    key: "chain",
    kanji: "万里ノ鎖",
    name: { tr: "Bin fersahlık zincir", en: "Chain of a thousand miles" },
    note: {
      tr: "Şikigami olmayan tek çıktı: gölgeden çıkan ve bağlayan bir zincir. Terbiye edilmesi gerekmiyor, ama tek başına bir dövüşü de bitirmiyor — işi tutmak.",
      en: "The one output that is not a shikigami: a chain that comes out of the shadow and binds. It needs no taming, but it ends no fight on its own — its job is to hold.",
    },
    imageKey: MEGUMI_IMAGE_KEYS.chain,
  },
  {
    key: "zenin",
    kanji: "禪院",
    name: { tr: "Zen'in mirası", en: "The Zen'in inheritance" },
    note: {
      tr: "On Gölge üç büyük aileden birine ait ve Megumi ona kan yoluyla sahip. Aile onu almak istedi; girmedi. Sahip olduğu tek şey adının taşımadığı bir miras.",
      en: "The Ten Shadows belongs to one of the three great families, and Megumi holds it by blood. The family moved to take him; he never entered it. What he owns is an inheritance his name does not carry.",
    },
    imageKey: MEGUMI_IMAGE_KEYS.zenin,
  },
  {
    key: "incomplete",
    kanji: "未完成",
    name: { tr: "Yarım kalan alan", en: "The unfinished domain" },
    note: {
      tr: "Kubbeyi kapatmak isabeti garantiye alıyor ama lanet enerjisini (呪力) yakıyor. Megumi kubbeyi bilerek açık bırakıyor: garanti yerine süre satın alıyor. Kendi sınırını eksiklik değil hesap olarak kullanıyor.",
      en: "Closing the dome guarantees the hit but burns cursed energy (呪力). Megumi leaves it open on purpose: he buys duration instead of certainty. He treats his own limit not as a lack but as arithmetic.",
    },
    imageKey: MEGUMI_IMAGE_KEYS.incomplete,
  },
];

/* ══ 5 · Gölge havuzu — SAYFANIN KALBİ ═════════════════════════════════════
   Tek havuz, on şikigami. `cost` bir okuma aracı (dosya başındaki nota bak);
   sekiz çağrılabilir şikigami'nin bedelleri toplamı = kullanılabilir havuz. */

/**
 * ⚠️ SEKİZİNİN TOPLAMI HAZNEDEN BÜYÜK — mekaniğin can damarı bu.
 *
 * Çağrılabilir sekiz şikigami'nin bedeli toplam 20 birim, kullanılabilir
 * hazne ise 18 (20 − 2, kırılan pay). Yani hepsi AYNI ANDA sahada olamıyor:
 * bir yerde havuz bitiyor ve devam etmek için birini geri göndermek
 * gerekiyor. İlk denemede bedeller tam 18'e toplanıyordu ve o hâlde
 * "havuz yetmiyor" durumu MATEMATİKSEL OLARAK ulaşılamazdı (her alt kümenin
 * kalanı tümleyeninin toplamına eşit) — yani kıtlık hiç doğmuyordu.
 *
 * Mahoraga'nın kilidi bu yüzden "hepsi aynı anda sahada" değil, **her biri
 * en az bir kez çağrılmış + havuz tamamen boş**: ikisi birden ancak
 * geri gönderme kullanılarak sağlanabiliyor.
 */
export const MEGUMI_POOL = {
  /** Haznenin tamamı */
  total: 20,
  /** 玉犬・白 kırıldığında haznenin geri gelmeyen payı */
  scar: 2,
} as const;

/** Mühür çizimlerinin anahtarı — `MegumiGlyphs.tsx` bunları çiziyor. */
export type MegumiSigil =
  | "dogWhite"
  | "dogBlack"
  | "toad"
  | "serpent"
  | "elephant"
  | "rabbit"
  | "nue"
  | "ox"
  | "deer"
  | "wheel";

export type MegumiBeastState = "callable" | "scar" | "locked";

export interface MegumiBeast {
  key: string;
  kanji: string;
  name: string;
  reading: string;
  turkish: LocalizedText;
  sigil: MegumiSigil;
  state: MegumiBeastState;
  /** Havuzdan eksilttiği pay. Kırık ve kilitli olanlar havuzdan ödenmiyor. */
  cost: number;
  role: LocalizedText;
  text: LocalizedText;
  /** Sahaya çıktığında yanına yazılan tek satır */
  onField: LocalizedText;
  note?: LocalizedText;
}

export const MEGUMI_BEASTS: MegumiBeast[] = [
  {
    key: "haku",
    kanji: "玉犬・白",
    name: "Gyokuken · Haku",
    reading: "ぎょくけん・はく",
    turkish: { tr: "Cins Köpek · Beyaz", en: "Divine Dog · White" },
    sigil: "dogWhite",
    state: "scar",
    cost: MEGUMI_POOL.scar,
    role: {
      tr: "Yok edildi — havuzdaki payı geri gelmiyor",
      en: "Destroyed — its share of the pool never returns",
    },
    text: {
      tr: "İkizin beyaz olanı. Erken bir görevde, özel sınıf bir lanetin karşısında parçalandı ve teknik onu bir daha vermedi. Sayfadaki havuzun ucundaki iki koyu birim onun payı: hazne yirmi birim ama on sekizi kullanılabiliyor, çünkü kaybedilen bir şikigami eksiltmeyi kalıcı yapıyor.",
      en: "The white one of the pair. It was torn apart on an early mission, facing a special grade curse, and the technique never gave it back. The two dark units at the end of the gauge on this page are its share: the reservoir holds twenty but only eighteen are usable, because a lost shikigami makes the subtraction permanent.",
    },
    onField: {
      tr: "Sahaya çıkmıyor.",
      en: "It does not take the field.",
    },
    note: {
      tr: "Bu satır bir düğme değil, bir yara. Sayfadaki tek geri alınamaz kayıp burada duruyor.",
      en: "This row is not a button but a scar. The page's one irreversible loss sits here.",
    },
  },
  {
    key: "kuro",
    kanji: "玉犬・黒",
    name: "Gyokuken · Kuro",
    reading: "ぎょくけん・くろ",
    turkish: { tr: "Cins Köpek · Siyah", en: "Divine Dog · Black" },
    sigil: "dogBlack",
    state: "callable",
    cost: 2,
    role: { tr: "İz sürer, kokuyu bulur", en: "Tracks, finds by scent" },
    text: {
      tr: "Çiftin hayatta kalanı. Hızlı, dişleri işe yarıyor ve asıl değeri koku: görünmeyen bir laneti ya da kaybolmuş bir insanı bulmak için ilk atılan el bu. Tek başına kaldıktan sonra da aynı işi görüyor — eksik olan güç değil, ikinci burun.",
      en: "The survivor of the pair. Fast, its teeth do work, and its real value is scent: this is the first hand played when an unseen curse or a missing person has to be found. It does the same job alone — what is missing is not power but a second nose.",
    },
    onField: {
      tr: "Kokuyu tutmuş, çizginin ilerisinde bekliyor.",
      en: "It has the scent and waits ahead of the line.",
    },
  },
  {
    key: "gama",
    kanji: "蝦蟇",
    name: "Gama",
    reading: "がま",
    turkish: { tr: "Kurbağa", en: "Toad" },
    sigil: "toad",
    state: "callable",
    cost: 1,
    role: { tr: "Diliyle yakalar ve taşır", en: "Catches and carries with its tongue" },
    text: {
      tr: "Saldırmıyor: tutuyor. Uzun dili bir kişiyi tehlikeden çekip almak, bir düşmanı yerinde durdurmak ya da bir düşüşü kesmek için kullanılıyor. Listede kurtarma işini gören ilk gölge — dövüşün kendisi değil, dövüşün dışına çıkarmak.",
      en: "It does not strike: it holds. The long tongue pulls someone out of danger, pins an enemy in place, or breaks a fall. The first shadow on the list that does rescue work — not the fight itself, but removal from it.",
    },
    onField: {
      tr: "Dilini uzatmış, aradaki boşluğu kapatıyor.",
      en: "Its tongue is out, closing the gap between.",
    },
  },
  {
    key: "orochi",
    kanji: "大蛇",
    name: "Orochi",
    reading: "おろち",
    turkish: { tr: "Büyük Yılan", en: "Great Serpent" },
    sigil: "serpent",
    state: "callable",
    cost: 2,
    role: { tr: "Uzaktan delip geçer", en: "Pierces from a distance" },
    text: {
      tr: "Gölgeden ok gibi fırlayan uzun gövde. Menzili listedeki en uzun menzil ve tek işi delmek: araya girmiyor, tutmuyor, dönmüyor. Bir açılış hamlesi — mesafeyi kapatmadan ilk teması kurmak için.",
      en: "A long body that shoots from the shadow like an arrow. Its reach is the longest on the list and its only job is to pierce: it does not intervene, hold, or return. An opening move — first contact without closing the distance.",
    },
    onField: {
      tr: "Gövdesi bölümün altından geçiyor.",
      en: "Its body runs beneath the section.",
    },
  },
  {
    key: "manzo",
    kanji: "満象",
    name: "Manzō",
    reading: "まんぞう",
    turkish: { tr: "Dolu Fil", en: "Max Elephant" },
    sigil: "elephant",
    state: "callable",
    cost: 6,
    role: { tr: "Alanı suyla süpürür", en: "Sweeps the field with water" },
    text: {
      tr: "Listedeki en pahalı gölge: çağırmak lanet enerjisinin (呪力) büyük kısmını götürüyor. Karşılığında hortumundan çıkan su bir sokağı süpürecek hacimde ve suyun kendisi lanet enerjisi taşıdığı için sıradan bir sel değil. Çıktığı yerde kimse ayakta kalmıyor — ama kullanılabilir havuzun tam üçte biri onunla gidiyor.",
      en: "The most expensive shadow on the list: calling it takes most of the cursed energy (呪力). In return the water from its trunk comes in volumes that sweep a street, and because the water carries cursed energy it is no ordinary flood. Nobody stays standing where it lands — but exactly a third of the usable pool goes with it.",
    },
    onField: {
      tr: "Su bölümün kenarından taşıyor.",
      en: "Water spills over the edge of the section.",
    },
  },
  {
    key: "datto",
    kanji: "脱兎",
    name: "Datto",
    reading: "だっと",
    turkish: { tr: "Kaçan Tavşan", en: "Rabbit Escape" },
    sigil: "rabbit",
    state: "callable",
    cost: 1,
    role: {
      tr: "Sayıca boğar, gözü karıştırır",
      en: "Overwhelms by number, blinds the eye",
    },
    text: {
      tr: "Tek tek hiçbir işe yaramıyorlar: küçükler, zayıflar, vurunca dağılıyorlar. Ama gölgeden onlarcası birden çıkıyor ve rakibin gözü hepsini takip etmek zorunda kalıyor. Kazanılan şey hasar değil, iki saniyelik bir görüş kaybı — ve o iki saniyede havuzdan başka bir şey çıkıyor.",
      en: "Individually they are useless: small, weak, gone on contact. But dozens leave the shadow at once and the opponent's eye is forced to track all of them. What is gained is not damage but two seconds of lost sight — and in those two seconds something else leaves the pool.",
    },
    onField: {
      tr: "Sayıları bölümün etrafına dağılmış.",
      en: "Their number is scattered around the section.",
    },
  },
  {
    key: "nue",
    kanji: "鵺",
    name: "Nue",
    reading: "ぬえ",
    turkish: { tr: "Nue", en: "Nue" },
    sigil: "nue",
    state: "callable",
    cost: 4,
    role: { tr: "Havayı alır, çarpar", en: "Takes the air, strikes" },
    text: {
      tr: "Kanatlı olan tek gölge. Megumi'yi havaya kaldırıyor, düşüşünü kesiyor ve kanatlarındaki elektrikle sersemletiyor. Listedeki en esnek şikigami: hem taşıma hem saldırı hem kaçış — üç işi birden gören tek kayıt, ve bedeli de ona göre.",
      en: "The only winged shadow. It lifts Megumi into the air, breaks his fall, and stuns with the electricity in its wings. The most flexible shikigami on the list: transport, attack and escape — the only entry that does all three, and priced accordingly.",
    },
    onField: {
      tr: "Bölümün üstünde asılı duruyor.",
      en: "It hangs above the section.",
    },
  },
  {
    key: "kansen",
    kanji: "貫牛",
    name: "Kansen",
    reading: "かんせん",
    turkish: { tr: "Delen Öküz", en: "Piercing Ox" },
    sigil: "ox",
    state: "callable",
    cost: 2,
    role: {
      tr: "Aldıkça ağırlaşan tek yönlü koşu",
      en: "A one-way charge that keeps gaining weight",
    },
    text: {
      tr: "Dönemiyor, duramıyor, yön değiştiremiyor: yalnızca ileri koşuyor. Buna karşılık kat ettiği her metrede ağırlaşıyor ve çarptığı şeye önceki bütün mesafeyi taşıyor. Hesapla harcanan bir gölge — bir kere salındığında yolun ortasında geri çağrılmıyor.",
      en: "It cannot turn, stop or change direction: it only runs forward. In exchange it grows heavier with every metre covered and delivers all of that distance into whatever it hits. A shadow spent by calculation — once released it is not recalled mid-run.",
    },
    onField: {
      tr: "Yönünü almış, bir daha dönmeyecek.",
      en: "It has taken its direction and will not turn again.",
    },
  },
  {
    key: "encho",
    kanji: "円鹿",
    name: "Enchō",
    reading: "えんちょう",
    turkish: { tr: "Halka Boynuzlu Geyik", en: "Round Deer" },
    sigil: "deer",
    state: "callable",
    cost: 2,
    role: {
      tr: "Ters lanet tekniğiyle (反転術式) iyileştirir",
      en: "Heals with reverse cursed technique (反転術式)",
    },
    text: {
      tr: "Listenin tek şifacısı ve tek dövüşmeyeni. Boynuzlarında taşıdığı ters lanet tekniği (反転術式) Megumi'nin kendi başına yapamadığı şeyi yapıyor: yarayı kapatmak. Bir şikigami'nin sağlayabileceği en tuhaf avantaj — sahibine, sahibinin olmayan bir yeteneği ödünç vermek.",
      en: "The list's only healer and its only non-combatant. The reverse cursed technique (反転術式) it carries in its antlers does what Megumi cannot do himself: close a wound. The strangest advantage a shikigami can offer — lending its owner an ability its owner does not have.",
    },
    onField: {
      tr: "Boynuzları bölümün kenarını kapatıyor.",
      en: "Its antlers close the edge of the section.",
    },
  },
  {
    key: "mahoraga",
    kanji: "魔虚羅",
    name: "Makora",
    reading: "まこら",
    turkish: { tr: "Mahoraga", en: "Mahoraga" },
    sigil: "wheel",
    state: "locked",
    cost: 0,
    role: {
      tr: "Terbiye edilmemiş — havuzdan ödenmiyor",
      en: "Untamed — not paid for out of the pool",
    },
    text: {
      tr: "Zen'in ailesinin tarihinde hiç kimsenin terbiye edemediği şikigami. Başının üstündeki çark her aldığı saldırıdan sonra dönüyor ve döndükçe o saldırıya karşı bir daha işlemeyecek bir uyum kuruyor; onu iki kez aynı şeyle vurmak mümkün değil. Çağrısı havuzdan ödenmiyor çünkü ödeyecek bir şey kalmadığında çağrılıyor. Bedeli lanet enerjisi değil, ritüelin kendisi.",
      en: "The shikigami no one in the history of the Zen'in family has ever tamed. The wheel above its head turns after every attack it takes, and each turn builds an adaptation that makes that attack useless forever after; it cannot be struck twice by the same thing. Its call is not paid out of the pool, because it is called when there is nothing left to pay with. Its price is not cursed energy but the ritual itself.",
    },
    onField: {
      tr: "Çark dönüyor. Sayfa artık geri alınamaz.",
      en: "The wheel is turning. The page cannot be undone.",
    },
    note: {
      tr: "Kilit iki şarta bağlı: çağrılabilecek her şikigami'nin en az bir kez çağrılmış olması ve havuzun tamamen boşalması.",
      en: "The lock has two conditions: every callable shikigami must have been called at least once, and the pool must be fully drained.",
    },
  },
];

export const MEGUMI_POOL_UI = {
  gaugeTitle: { tr: "Gölge havuzu", en: "Shadow pool" },
  gaugeNative: "影",
  remainingLabel: { tr: "Kalan", en: "Remaining" },
  usableLabel: { tr: "Kullanılabilir", en: "Usable" },
  scarLabel: { tr: "Kırılan pay", en: "Broken share" },
  fieldLabel: { tr: "Sahada", en: "On the field" },
  unitLabel: { tr: "birim", en: "units" },
  costLabel: { tr: "Bedel", en: "Cost" },
  summon: { tr: "Çağır", en: "Call" },
  returnOne: { tr: "Geri gönder", en: "Send back" },
  returnAll: { tr: "Hepsini gölgeye çek", en: "Draw everything back" },
  insufficient: { tr: "Havuz yetmiyor", en: "Pool is short" },
  brokenBadge: { tr: "Kırılmış", en: "Broken" },
  lockedBadge: { tr: "Kilitli", en: "Locked" },
  outBadge: { tr: "Sahada", en: "On field" },
  readyBadge: { tr: "Havuzda", en: "In the pool" },
  emptyField: {
    tr: "Havuz dolu, saha boş. Bir şikigami çağrıldığında burada görünür.",
    en: "The pool is full and the field is empty. A called shikigami shows up here.",
  },
  lockHint: {
    tr: "Mahoraga'nın kapısı iki şartla açılıyor: çağrılabilecek sekiz şikigami'nin her biri en az bir kez çağrılmış olacak VE havuz tamamen boşalacak. Sekizi aynı anda sahaya sığmadığı için ikisini birden sağlamanın tek yolu geri göndermek.",
    en: "Mahoraga's door opens on two conditions: each of the eight callable shikigami must have been called at least once AND the pool must be fully drained. Since the eight do not fit on the field at once, the only way to meet both is to send some back.",
  },
  unlockedHint: {
    tr: "Şartlar tamam. Ritüel okunursa sayfa GERİ ALINAMAZ biçimde değişir: havuz mühürlenir, çağrılar kilitlenir ve hiçbir şikigami geri gönderilemez. Sayfayı yenilemek dışında dönüş yok.",
    en: "The conditions are met. If the ritual is read the page changes IRREVERSIBLY: the pool is sealed, calls lock, and no shikigami can be sent back. There is no way back short of reloading the page.",
  },
  ritualButton: {
    tr: "Ritüeli oku — geri alınamaz",
    en: "Read the ritual — irreversible",
  },
  ritualDone: { tr: "Çark dönüyor", en: "The wheel is turning" },
  ritualWord: "布留部 由良由良 布留部",
  ritualWordNote: {
    tr: "Furube yura yura furube — terbiye ritüelinin sözü.",
    en: "Furube yura yura furube — the words of the taming ritual.",
  },
  afterRitual: {
    tr: "Sayfa kapandı. Bu durumdan çıkış yok — sayfayı yenilemek dışında.",
    en: "The page has closed. There is no way out of this state short of reloading.",
  },
  keyboardHint: {
    tr: "Listedeki her satır bir düğme; sekmeyle gez, boşluk ya da enter ile çağır. Sahadaki bir şikigami'yi aynı düğme geri gönderir.",
    en: "Every row in the list is a button; tab through them and call with space or enter. The same button sends a called shikigami back.",
  },
  deviceNote: {
    tr: "Havuzun sayıları bir okuma aracı: kaynakta şikigami başına sayısal bir lanet enerjisi bedeli verilmiyor. Sıralama kanonun söylediği tek şeyi izliyor — 満象 listenin en pahalısı, 蝦蟇 ve 脱兎 en ucuzları.",
    en: "The pool's numbers are a reading device: the source gives no numeric cursed-energy price per shikigami. The ordering follows the only thing canon states — 満象 is the most expensive on the list, 蝦蟇 and 脱兎 the cheapest.",
  },
  statusCalled: {
    tr: "çağrıldı. Havuzda kalan:",
    en: "was called. Remaining in the pool:",
  },
  statusReturned: {
    tr: "gölgeye döndü. Havuzda kalan:",
    en: "returned to the shadow. Remaining in the pool:",
  },
  statusAllReturned: {
    tr: "Bütün şikigami gölgeye çekildi. Havuz on sekiz birimde.",
    en: "Every shikigami has been drawn back. The pool stands at eighteen units.",
  },
  statusRefused: {
    tr: "Havuz bitti: kalanla başka hiçbir şikigami çağrılamıyor. Devam etmek için sahadaki birini geri gönder.",
    en: "The pool is out: nothing else can be called with what remains. Send one back from the field to keep going.",
  },
  statusUnlocked: {
    tr: "Sekizinin hepsi çağrıldı ve havuz tamamen boşaldı. Mahoraga'nın kapısı açıldı.",
    en: "All eight have been called and the pool is fully drained. Mahoraga's door has opened.",
  },
  progressCalled: { tr: "Çağrılan", en: "Called" },
  progressLeft: { tr: "havuzda kalan", en: "left in the pool" },
  statusRitual: {
    tr: "Ritüel okundu. Çark dönmeye başladı ve sayfa kapandı: çağrılar kilitlendi, hiçbir şikigami geri gönderilemiyor.",
    en: "The ritual has been read. The wheel has begun to turn and the page has closed: calls are locked and no shikigami can be sent back.",
  },
  bandLabel: {
    tr: "Havuzdan çıkanlar",
    en: "Out of the pool",
  },
} as const;

/* ══ 6 · Beş durak ═════════════════════════════════════════════════════════ */

export interface MegumiStop {
  key: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: string; reading: LocalizedText; by: LocalizedText };
  kin?: { characterId: number; name: string; role: LocalizedText };
  imageKey: string;
}

export const MEGUMI_TIMELINE: MegumiStop[] = [
  {
    key: "bought",
    age: { tr: "bebeklik", en: "infancy" },
    title: { tr: "Aileye girmeyen çocuk", en: "The child who never entered the family" },
    text: {
      tr: "Zen'in ailesi On Gölge'yi taşıyan bebeği almak istedi ve pazarlık babasının elinden geçti. Çocuk aileye girmedi: Zen'in adını taşımadan, konağın dışında büyüdü. Sahip olduğu tek şey adının taşımadığı bir teknik oldu.",
      en: "The Zen'in family moved to take the infant who carried the Ten Shadows, and the bargaining went through his father. The boy never entered the family: he grew up outside the estate, without the Zen'in name. What he owned was a technique his name did not carry.",
    },
    kin: {
      characterId: 162722,
      name: "Tōji Fushiguro",
      role: { tr: "Pazarlığı yapan baba", en: "The father who did the bargaining" },
    },
    imageKey: MEGUMI_IMAGE_KEYS.fateBought,
  },
  {
    key: "sister",
    age: { tr: "çocukluk", en: "childhood" },
    title: { tr: "Uyuyan abla", en: "The sleeping sister" },
    text: {
      tr: "Üvey ablası Tsumiki bir lanetin etkisiyle uyandırılamayan bir uykuya girdi. Megumi'yi büyücülüğe götüren şey bir görev duygusu değil bu oldu: iyi bir insanın hak etmediği bir şeyi yaşaması. Adaleti eşit dağıtmama kararı buradan çıkıyor.",
      en: "His stepsister Tsumiki fell into a sleep no one could wake her from, under a curse. What carried Megumi into sorcery was not duty but this: a kind person living something she had not earned. His decision not to hand out justice equally begins here.",
    },
    kin: {
      characterId: 193479,
      name: "Tsumiki Fushiguro",
      role: { tr: "Üvey ablası", en: "His stepsister" },
    },
    imageKey: MEGUMI_IMAGE_KEYS.fateSister,
  },
  {
    key: "found",
    age: { tr: "ortaokul yılları", en: "middle-school years" },
    title: { tr: "Bulunma", en: "Being found" },
    text: {
      tr: "Satoru Gojō, Zen'in ailesinin peşine düştüğü tekniği taşıyan çocuğu buldu ve onu Tokyo Jujutsu Lisesi'ne aldı. Megumi ilk kez tekniğini bir miras olarak değil bir araç olarak kullanmayı öğrendi — ve ilk kez birinin ona ne olacağını değil ne yapacağını sorduğu bir yere girdi.",
      en: "Satoru Gojō found the boy carrying the technique the Zen'in family had been after and brought him into Tokyo Jujutsu High. For the first time Megumi learned to use his technique as a tool rather than an inheritance — and for the first time entered a place where someone asked what he would do, not what he would become.",
    },
    kin: {
      characterId: 127691,
      name: "Satoru Gojou",
      role: { tr: "Onu okula alan öğretmen", en: "The teacher who brought him in" },
    },
    imageKey: MEGUMI_IMAGE_KEYS.fateFound,
  },
  {
    key: "broken",
    age: { tr: "15 yaş", en: "age 15" },
    title: { tr: "Beyazın kırılması", en: "The breaking of the white" },
    text: {
      tr: "Erken bir görevde, özel sınıf bir lanetin karşısında iki köpeğinden biri parçalandı. Teknik onu geri vermedi ve vermeyecek. Megumi o gün tekniğinin gerçek fiyatını öğrendi: çağırdığı hiçbir şey ödünç değil — her biri riske attığı bir varlık, ve havuz bir daha eski büyüklüğüne dönmüyor.",
      en: "On an early mission, facing a special grade curse, one of his two dogs was torn apart. The technique did not give it back and never will. That day Megumi learned his technique's real price: nothing he calls is on loan — each is a holding he puts at risk, and the pool never returns to its old size.",
    },
    imageKey: MEGUMI_IMAGE_KEYS.fateBroken,
  },
  {
    key: "ritual",
    age: { tr: "15 yaş · Shibuya", en: "age 15 · Shibuya" },
    title: {
      tr: "Kimsenin okumadığı sözü okumak",
      en: "Reading the words no one reads",
    },
    text: {
      tr: "Elinde başka bir şey kalmadığında Megumi ailesinin tarihinde hiç kimsenin kazanamadığı ritüeli okudu. Çağırdığı şey bir müttefik değildi; kendisi de dâhil olmak üzere sahnedeki herkese karşı duran bir üçüncü taraftı. Kaybedeceğini biliyordu ve yine de okudu.",
      en: "With nothing else in hand, Megumi read the ritual no one in his family's history had ever won. What he called was not an ally; it was a third party set against everyone on the scene, himself included. He knew he would lose, and he read it anyway.",
    },
    quote: {
      text: "布留部 由良由良 布留部",
      reading: {
        tr: "Furube yura yura furube",
        en: "Furube yura yura furube",
      },
      by: {
        tr: "Terbiye ritüelinin sözü — Shibuya'da",
        en: "The words of the taming ritual — at Shibuya",
      },
    },
    imageKey: MEGUMI_IMAGE_KEYS.fateRitual,
  },
];

/* ══ 7a · Bağlar ═══════════════════════════════════════════════════════════
   ⚠️ Her numara `EXPERIENCE_COMPANIONS[126635]` içinde (Dalga 1 · ders 4).
   Sayfası olanlar `isExperienceCharacter()` ile bağlantılı çiziliyor. */

export interface MegumiBond {
  characterId: number;
  name: string;
  native: string;
  role: LocalizedText;
  line: LocalizedText;
}

export const MEGUMI_BONDS: MegumiBond[] = [
  {
    characterId: 127691,
    name: "Satoru Gojou",
    native: "五条悟",
    role: { tr: "Öğretmeni", en: "His teacher" },
    line: {
      tr: "Onu Zen'in ailesinden önce buldu ve okula aldı. Megumi'nin tekniğini bir miras değil bir araç saymasının sebebi bu adam.",
      en: "He found him before the Zen'in family did and brought him into the school. This man is the reason Megumi treats his technique as a tool and not an inheritance.",
    },
  },
  {
    characterId: 127212,
    name: "Yuuji Itadori",
    native: "虎杖悠仁",
    role: { tr: "Sınıf arkadaşı", en: "His classmate" },
    line: {
      tr: "Megumi onu bir görevde buldu ve infazına karşı çıktı. Adaleti eşit dağıtmama kararının ilk uygulaması bu oldu.",
      en: "Megumi found him on a mission and argued against his execution. That was the first application of his decision not to hand out justice equally.",
    },
  },
  {
    characterId: 133700,
    name: "Nobara Kugisaki",
    native: "釘崎野薔薇",
    role: { tr: "Sınıf arkadaşı", en: "His classmate" },
    line: {
      tr: "Takım Gojō'nun üçüncüsü. Megumi'nin ölçülü hesabıyla onun doğrudan sertliği aynı görevlerde yan yana duruyor.",
      en: "The third of Team Gojō. Megumi's measured arithmetic and her blunt hardness stand side by side on the same missions.",
    },
  },
  {
    characterId: 133701,
    name: "Ryoumen Sukuna",
    native: "両面宿儺",
    role: { tr: "Sınıf arkadaşının içindeki", en: "What lives inside his classmate" },
    line: {
      tr: "Yūji'nin taşıdığı lanet. Megumi'nin On Gölge'si ona uzun süredir dışarıdan bakılan bir teknik — ve o bakışın sebebi Mahoraga.",
      en: "The curse Yūji carries. Megumi's Ten Shadows is a technique it has been watching from outside for a long time — and the reason for that watching is Mahoraga.",
    },
  },
  {
    characterId: 162722,
    name: "Tōji Fushiguro",
    native: "伏黒甚爾",
    role: { tr: "Babası", en: "His father" },
    line: {
      tr: "Lanet enerjisi olmayan bir adam ve Zen'in pazarlığının öbür ucu. Megumi'nin adı ondan geliyor, tekniği ondan gelmiyor.",
      en: "A man with no cursed energy and the other end of the Zen'in bargain. Megumi's surname comes from him; his technique does not.",
    },
  },
  {
    characterId: 193479,
    name: "Tsumiki Fushiguro",
    native: "伏黒津美紀",
    role: { tr: "Üvey ablası", en: "His stepsister" },
    line: {
      tr: "Uyanmayan abla. Megumi'nin kimi kurtaracağına karar verirken kullandığı ölçü tam olarak o.",
      en: "The sister who does not wake. She is exactly the measure Megumi uses when he decides whom to save.",
    },
  },
];

export const MEGUMI_BOND_UI = {
  hasPage: { tr: "arşivde dosyası var", en: "has a file in the archive" },
  noPage: { tr: "dosyası yok", en: "no file yet" },
  portraitMissing: {
    tr: "Portre kaydı yok — mühür çizildi.",
    en: "No portrait on record — a seal is drawn instead.",
  },
  slotNote: {
    tr: "Yoldaş kareleri arşivin kendi kaydından geliyor; buraya yükleme yuvası konmuyor, çünkü başka bir karakterin yüzünü bu karakterin kaydına yazmak olurdu.",
    en: "Companion frames come from the archive's own record; no upload slot goes here, because it would write another character's face into this character's record.",
  },
  school: {
    tr: "Tokyo Jujutsu Lisesi",
    en: "Tokyo Jujutsu High",
  },
  schoolLink: {
    tr: "Evren sayfası — büyücü toplumu",
    en: "Universe page — the sorcerer society",
  },
} as const;

/* ══ 7b · Kapanış ══════════════════════════════════════════════════════════ */

export const MEGUMI_CLOSING = {
  quotes: [
    {
      text: "俺は不平等に人を助ける",
      reading: {
        tr: "Ore wa fubyōdō ni hito o tasukeru — insanları eşit olmayan bir biçimde kurtarırım.",
        en: "Ore wa fubyōdō ni hito o tasukeru — I save people unequally.",
      },
      by: { tr: "Megumi Fushiguro", en: "Megumi Fushiguro" },
      note: {
        tr: "Kendi adalet tanımını anlatırken. Kahraman olduğunu değil, bencil davrandığını söylüyor.",
        en: "Explaining his own definition of justice. He calls it selfish, not heroic.",
      },
    },
    {
      text: "布留部 由良由良 布留部",
      reading: {
        tr: "Furube yura yura furube — terbiye ritüelinin sözü.",
        en: "Furube yura yura furube — the words of the taming ritual.",
      },
      by: { tr: "Chōbuku no Gi · 調伏の儀", en: "Chōbuku no Gi · 調伏の儀" },
      note: {
        tr: "Ailesinin tarihinde bu sözü okuyup dövüşü kazanan olmadı.",
        en: "In his family's history, no one has read these words and won the fight.",
      },
    },
  ],
  motto: "十種影法術",
  mottoNote: {
    tr: "On Gölge Tekniği. Adı bir güç değil bir SAYI söylüyor: elinde tam olarak on tane var, biri gittiğinde dokuz kalıyor ve hazne bir daha büyümüyor.",
    en: "The Ten Shadows Technique. Its name states not a power but a NUMBER: he holds exactly ten, when one goes nine remain, and the reservoir never grows back.",
  },
  credit: {
    tr: "Künye, portre ve doğum bilgileri AniList'ten:",
    en: "Dossier, portrait and birth data from AniList:",
  },
  creditLink: {
    tr: "AniList · Megumi Fushiguro #126635",
    en: "AniList · Megumi Fushiguro #126635",
  },
  creditNote: {
    tr: "Sayfadaki bütün mühürler, gölge kütleleri ve yaratık işaretleri elle çizilmiş SVG. Dışarıya giden tek bağlantı yukarıdaki AniList adresi; hiçbir görsel hotlink edilmiyor.",
    en: "Every seal, shadow mass and creature mark on this page is hand-drawn SVG. The only outbound link is the AniList address above; no image is hotlinked.",
  },
} as const;
