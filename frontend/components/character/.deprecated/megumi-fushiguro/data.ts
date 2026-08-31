import type { LocalizedText } from "./types";

/**
 * Megumi Fushiguro — "Gölge Çizgisi" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 126635 kaydının ABILITY yuvaları,
 * `meg:*` anahtarlarıyla.
 *
 * ⚠️ 25 Ağustos 2026 itibarıyla JJK kadrosunun hiçbirinin veritabanımızda
 * görseli YOK. Sayfa buna göre tasarlandı: on gölgenin hepsi elle çizilmiş
 * SVG siluet, hiçbiri yüklenmiş görsele bağlı değil.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum (22 Aralık 2002), yaş (15), boy (175 cm), tür (insan), derece
 * (2. sınıf büyücü), teknik (On Gölge) ve bağlı olduğu yer (Jujutsu Lisesi)
 * AniList künyesinden birebir alındı (karakter 126635, 25 Ağustos 2026).
 * Kan grubu AniList'te BOŞ — künye şeridinde de yok.
 *
 * ── ON GÖLGENİN LİSTESİ ──────────────────────────────────────────────────
 * Sayfadaki on kayıt tekniğin kendi on shikigami'si. Üçü ayrı bir DURUM
 * taşıyor ve mekaniğin tamamı bu ayrım üstüne kurulu:
 *   · 玉犬・白  → KIRILMIŞ. Bir shikigami yok edildiğinde bir daha
 *                çağrılamıyor; tekniğin tek geri alınamaz kuralı bu.
 *   · 魔虚羅    → TERBİYE EDİLMEMİŞ. Çağrılması için 調伏の儀 okunması
 *                gerekiyor ve ritüelin bilinen tek sonucu var.
 *   · Kalan sekizi terbiye edilmiş, serbestçe çağrılıyor.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada iki replik tırnak içinde: 「俺は不平等に人を助ける」 (kendi adalet
 * tanımı) ve 調伏の儀'nin sözü 「布留部 由良由良 布留部」. İkisi de
 * kaynağıyla anılıyor; emin olunmayan hiçbir cümle tırnağa alınmadı.
 */

export const MEGUMI_ID = 126635;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const MEGUMI_SITE_URL = "https://anilist.co/character/126635";

/**
 * Sergi görselleri — hepsi characterId 126635 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `meg:` önekli (kurator modu şartı).
 */
export const MEGUMI_IMAGE_KEYS = {
  hero: "meg:hero",
  technique: "meg:jusshiki",
  domain: "meg:kanmoki",
  ritual: "meg:chofuku",
  smallStore: "meg:kage-shimau",
  smallChain: "meg:banri",
  smallZenin: "meg:zenin",
  smallIncomplete: "meg:mikansei",
  fateBought: "meg:fate-bought",
  fateSister: "meg:fate-sister",
  fateFound: "meg:fate-found",
  fateBroken: "meg:fate-broken",
  fateRitual: "meg:fate-ritual",
  closing: "meg:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const MEGUMI_SLOT_LABELS: Record<string, LocalizedText> = {
  [MEGUMI_IMAGE_KEYS.hero]: {
    tr: "Hero — Megumi, ayaklarının dibinden uzayan tek gölge (16:9)",
    en: "Hero — Megumi with a single shadow stretching from his feet (16:9)",
  },
  [MEGUMI_IMAGE_KEYS.technique]: {
    tr: "On Gölge — el işareti ve yerden yükselen siluet",
    en: "Ten Shadows — the hand sign and a silhouette rising from the ground",
  },
  [MEGUMI_IMAGE_KEYS.domain]: {
    tr: "Kanmoki An'ei Tei — zemini tamamen kaplayan gölge bahçesi",
    en: "Chimera Shadow Garden — the shadow flooding the whole floor",
  },
  [MEGUMI_IMAGE_KEYS.ritual]: {
    tr: "Chōfuku no Gi — ritüel okunurken, tek kare",
    en: "The taming ritual — mid-incantation, a single frame",
  },
  [MEGUMI_IMAGE_KEYS.smallStore]: {
    tr: "Gölgeye bırakılan eşya — elin gölgeye girdiği an",
    en: "An object stored in shadow — the hand entering it",
  },
  [MEGUMI_IMAGE_KEYS.smallChain]: {
    tr: "Banri no Kusari — gölgeden çıkan zincir",
    en: "Chain of a Thousand Miles — the chain leaving the shadow",
  },
  [MEGUMI_IMAGE_KEYS.smallZenin]: {
    tr: "Zen'in ailesi — arka planda aile arması ya da konak",
    en: "The Zen'in family — the crest or the estate in the background",
  },
  [MEGUMI_IMAGE_KEYS.smallIncomplete]: {
    tr: "Yarım kalan alan — kubbesi kapanmamış gölge",
    en: "The unfinished domain — a shadow whose dome never closes",
  },
  [MEGUMI_IMAGE_KEYS.fateBought]: {
    tr: "Satılan çocuk — Zen'in konağı ve küçük Megumi",
    en: "The bought child — the Zen'in estate and a small Megumi",
  },
  [MEGUMI_IMAGE_KEYS.fateSister]: {
    tr: "Tsumiki — hastane odası, uyuyan abla",
    en: "Tsumiki — the hospital room, the sleeping sister",
  },
  [MEGUMI_IMAGE_KEYS.fateFound]: {
    tr: "Gojō'nun bulduğu gün — okul bahçesinde iki figür",
    en: "The day Gojō found him — two figures in a schoolyard",
  },
  [MEGUMI_IMAGE_KEYS.fateBroken]: {
    tr: "Beyaz köpeğin son anı — dağılan siluet",
    en: "The white dog's last moment — a silhouette coming apart",
  },
  [MEGUMI_IMAGE_KEYS.fateRitual]: {
    tr: "Ritüelin okunduğu an — çevresinde çember",
    en: "The moment the ritual is read — a circle around him",
  },
  [MEGUMI_IMAGE_KEYS.closing]: {
    tr: "Kapanış — tek başına duran figür, uzun gölge, düşük kontrast",
    en: "Closing — a lone figure, a long shadow, low contrast",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const MEGUMI_IDENTITY = {
  name: "Megumi Fushiguro",
  nativeName: "伏黒恵",
  /** Hero filigranı — dekoratif (aria-hidden): 十種 = on tür */
  watermark: "十種",
  house: {
    tr: "Zen'in kanı · Tokyo Jujutsu Lisesi",
    en: "Zen'in blood · Tokyo Jujutsu High",
  },
  epigraph: {
    tr: "Gölge bir saklanma yeri değil, bir depo: içinden ne çıkacağını yalnızca o biliyor.",
    en: "The shadow is not a hiding place but a store: only he knows what will come out of it.",
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
      label: { tr: "Teknik", en: "Cursed technique" },
      value: { tr: "On Gölge (十種影法術)", en: "Ten Shadows (十種影法術)" },
    },
    {
      label: { tr: "Okul", en: "School" },
      value: { tr: "Birinci sınıf öğrencisi", en: "First-year student" },
    },
  ],
} as const;

export const MEGUMI_MISSING_NOTE: LocalizedText = {
  tr: "Kan grubu künyede kayıtlı değil; bu yüzden şeritte de yok.",
  en: "Blood type is not recorded in the dossier, so it is absent here too.",
};

/* ── Mod düğmesi: gölgeyi uzatmak ───────────────────────────────────────── */

export const MEGUMI_DUSK_TEXT = {
  enter: { tr: "Gölgeyi uzat", en: "Lengthen the shadow" },
  exit: { tr: "Gölgeyi topla", en: "Draw the shadow back" },
  hint: {
    tr: "Işık alçaldı: sayfadaki her şeyin gölgesi uzadı ve zemin çizgisi kalınlaştı.",
    en: "The light has dropped: everything on the page casts further, and the ground line has thickened.",
  },
} as const;

export const MEGUMI_HERO = {
  lede: {
    tr: "Megumi'nin tekniği bir saldırı değil bir DAVET. Ayağının dibindeki gölge yüzeyin altında duran bir kapı; el işareti yapıldığında oradan bir şey çıkıyor. On kapı var, hepsinin ayrı bir adı ve ayrı bir huyu var, ve her biri ancak bir kez terbiye edilebiliyor. Bu sayfa o on kapıyı tek bir zemin çizgisinin üstüne diziyor: seçtiğin gölge çizgiden doğruluyor, kırılmış olan bir daha doğrulmuyor.",
    en: "Megumi's technique is not an attack but an INVITATION. The shadow at his feet is a door lying under the surface; make the sign and something comes through. There are ten doors, each with its own name and temper, and each can be tamed only once. This page lines those ten doors up along a single ground line: the shadow you choose stands up from it, and the broken one never stands again.",
  },
  portraitAlt: {
    tr: "Megumi Fushiguro — arşivin yüklediği portre",
    en: "Megumi Fushiguro — portrait uploaded by the archive",
  },
  portraitAltFallback: {
    tr: "Megumi Fushiguro — AniList künye portresi",
    en: "Megumi Fushiguro — AniList dossier portrait",
  },
  groundCaption: {
    tr: "Zemin çizgisi sayfanın tamamında aynı çizgi: bütün gölgeler oradan çıkıyor ve oraya dönüyor.",
    en: "The ground line is one and the same across the page: every shadow leaves it and returns to it.",
  },
} as const;

export const MEGUMI_ALT = {
  companionSuffix: { tr: "portresi", en: "portrait" },
} as const;

export const MEGUMI_CRUMB = {
  series: { tr: "Jujutsu Kaisen", en: "Jujutsu Kaisen" },
} as const;

export const MEGUMI_SECTIONS = {
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
      tr: "Teknik, alan ve tekniğin bedelini belirleyen ritüel.",
      en: "The technique, the domain, and the ritual that sets the technique's price.",
    },
  },
  tools: {
    title: { tr: "Dört ayrıntı", en: "Four details" },
    lede: {
      tr: "Gölgenin shikigami dışında ne işe yaradığı, ve mirasın ağırlığı.",
      en: "What the shadow does beyond shikigami — and the weight of the inheritance.",
    },
  },
  shadows: {
    title: { tr: "On gölge", en: "Ten shadows" },
    lede: {
      tr: "Zemin çizgisinden birini doğrult. Terbiye edilmiş olan kalkar; kırılmış olan yerinde kalır; terbiye edilmemiş olan önce ritüeli ister.",
      en: "Raise one from the ground line. A tamed shadow stands; a broken one stays down; an untamed one demands the ritual first.",
    },
  },
  fate: {
    title: { tr: "Beş durak", en: "Five stops" },
    lede: {
      tr: "Adaleti eşitsiz dağıtmaya karar veren bir çocuğun kısa geçmişi.",
      en: "The short history of a boy who decided to hand out justice unequally.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "Bir kere kırılan gölgenin arkasında kalan.",
      en: "What remains behind a shadow once it has been broken.",
    },
  },
} as const;

/* ── Üç sütun ───────────────────────────────────────────────────────────── */

export interface MegumiArt {
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

export const MEGUMI_ARTS: MegumiArt[] = [
  {
    key: "technique",
    name: "Jusshu Kagehōjutsu",
    kanji: "十種影法術",
    reading: "じゅっしゅかげほうじゅつ",
    turkish: { tr: "On Gölge Tekniği", en: "Ten Shadows Technique" },
    tagline: {
      tr: "Gölgeden on ayrı yaratık çağırır.",
      en: "It calls ten separate creatures out of the shadow.",
    },
    text: {
      tr: "Zen'in ailesinin kanıyla geçen miras teknik. İki elin arasında oluşan gölge bir yüzey değil bir geçit: oradan on shikigami'den biri çıkıyor. Her biri kendi doğasıyla geliyor — biri koku alıyor, biri yutuyor, biri iyileştiriyor, biri yalnızca hız. Kullanıcı hepsine aynı anda sahip değil: her shikigami ayrı ayrı terbiye edilmek zorunda.",
      en: "An inherited technique carried in Zen'in blood. The shadow formed between two hands is not a surface but a passage: one of ten shikigami comes through it. Each arrives with its own nature — one tracks by scent, one swallows, one heals, one is only speed. The user does not own them all at once: every shikigami must be tamed separately.",
    },
    traits: [
      { tr: "On shikigami", en: "Ten shikigami" },
      { tr: "Miras teknik", en: "Inherited technique" },
      { tr: "Tek tek terbiye", en: "Tamed one by one" },
    ],
    imageKey: MEGUMI_IMAGE_KEYS.technique,
  },
  {
    key: "domain",
    name: "Kanmoki An'ei Tei",
    kanji: "嵌合暗翳庭",
    reading: "かんごうあんえいてい",
    turkish: { tr: "Kaynaşmış Gölge Bahçesi", en: "Chimera Shadow Garden" },
    tagline: {
      tr: "Zeminin tamamını gölgeye çevirir.",
      en: "It turns the entire floor into shadow.",
    },
    text: {
      tr: "Alan açılımı bir kubbe kurmak yerine ZEMİNİ ele geçiriyor: her yer gölge olduğu için her yer bir çıkış kapısı. Shikigami'ler artık tek bir noktadan değil, ayak bastığın her yerden çıkabiliyor. Megumi bu alanı kubbesi kapanmamış hâlde kullanıyor — yarım kalan bir alan garanti isabeti vermiyor, ama açık kalmasının bedeli de düşük.",
      en: "Rather than raising a dome, this domain seizes the FLOOR: everything is shadow, so everything is an exit. Shikigami no longer emerge from one point but from wherever you set foot. Megumi uses it with the dome unfinished — an incomplete domain forfeits the guaranteed hit, but its upkeep is cheap.",
    },
    traits: [
      { tr: "Zemin tabanlı", en: "Floor-based" },
      { tr: "Çoklu çıkış", en: "Many exits" },
      { tr: "Bilerek yarım", en: "Deliberately incomplete" },
    ],
    imageKey: MEGUMI_IMAGE_KEYS.domain,
  },
  {
    key: "ritual",
    name: "Chōfuku no Gi",
    kanji: "調伏の儀",
    reading: "ちょうふくのぎ",
    turkish: { tr: "Terbiye Ritüeli", en: "The Taming Ritual" },
    tagline: {
      tr: "Kazanılan bir izin, verilen bir izin değil.",
      en: "Permission won, not permission granted.",
    },
    text: {
      tr: "Bir shikigami kendiliğinden hizmet etmiyor: önce yenilmesi gerekiyor. Ritüel bu dövüşün çağrısı ve kaybedilirse bedeli ölüm. Terbiye edilen shikigami sonsuza kadar çağrılabilir hâle geliyor; yok edilen ise bir daha asla dönmüyor. Tekniğin bütün ağırlığı bu iki kuralın arasında duruyor.",
      en: "A shikigami does not serve on its own: it must first be beaten. The ritual is the summons to that fight, and losing it costs a life. A tamed shikigami becomes callable forever; a destroyed one never returns. The whole weight of the technique sits between those two rules.",
    },
    traits: [
      { tr: "Kazanılırsa kalıcı", en: "Permanent if won" },
      { tr: "Kaybedilirse ölüm", en: "Death if lost" },
      { tr: "Geri alınamaz", en: "Irreversible" },
    ],
    imageKey: MEGUMI_IMAGE_KEYS.ritual,
  },
];

/* ── Dört ayrıntı ───────────────────────────────────────────────────────── */

export interface MegumiDetail {
  key: string;
  name: LocalizedText;
  kanji: string;
  note: LocalizedText;
  imageKey: string;
}

export const MEGUMI_DETAILS: MegumiDetail[] = [
  {
    key: "store",
    name: { tr: "Gölgeye bırakmak", en: "Storing in shadow" },
    kanji: "影",
    note: {
      tr: "Gölge yalnızca shikigami çıkarmıyor; içine eşya da giriyor. Bir kılıç, bir lanetli parmak, bir yaralı — hepsi yüzeyin altına konabiliyor ve istendiğinde geri alınıyor.",
      en: "The shadow does not only produce shikigami; things go into it too. A blade, a cursed finger, a wounded body — all can be slipped below the surface and taken back on demand.",
    },
    imageKey: MEGUMI_IMAGE_KEYS.smallStore,
  },
  {
    key: "chain",
    name: { tr: "Bin fersahlık zincir", en: "Chain of a thousand miles" },
    kanji: "万里ノ鎖",
    note: {
      tr: "Shikigami olmayan tek çıktı: gölgeden çıkan ve bağlayan bir zincir. Bir yaratık gibi terbiye edilmesi gerekmiyor, ama tek başına bir dövüşü de bitirmiyor — işi tutmak.",
      en: "The one output that is not a shikigami: a chain that comes out of the shadow and binds. It needs no taming, but it ends no fight on its own — its job is to hold.",
    },
    imageKey: MEGUMI_IMAGE_KEYS.smallChain,
  },
  {
    key: "zenin",
    name: { tr: "Zen'in mirası", en: "The Zen'in inheritance" },
    kanji: "禪院",
    note: {
      tr: "Teknik üç büyük aileden birine ait ve Megumi ona kan yoluyla sahip. Aile onu bebekken satın almak istedi; alınmadı. Sahip olduğu tek şey adının taşımadığı bir miras.",
      en: "The technique belongs to one of the three great families, and Megumi holds it by blood. The family tried to buy him as an infant; the sale did not happen. What he owns is an inheritance his name does not carry.",
    },
    imageKey: MEGUMI_IMAGE_KEYS.smallZenin,
  },
  {
    key: "incomplete",
    name: { tr: "Yarım kalan alan", en: "The unfinished domain" },
    kanji: "未完成",
    note: {
      tr: "Alanın kubbesini kapatmak isabeti garantiye alıyor ama enerjiyi yakıyor. Megumi kubbeyi bilerek açık bırakıyor: garanti yerine süre satın alıyor. Kendi gücünün sınırını bir eksiklik olarak değil, bir hesap olarak kullanıyor.",
      en: "Closing the dome guarantees the hit but burns energy. Megumi leaves it open on purpose: he buys duration instead of certainty. He treats the limit of his own power not as a lack but as arithmetic.",
    },
    imageKey: MEGUMI_IMAGE_KEYS.smallIncomplete,
  },
];

/* ── On gölge: sayfanın kalbi ───────────────────────────────────────────── */

export type MegumiShadowState = "tamed" | "broken" | "untamed";

/** Siluet çizimleri `ShadowFigures.tsx`'te; bu anahtar oraya geçiyor. */
export type MegumiFigure =
  | "dog"
  | "toad"
  | "serpent"
  | "elephant"
  | "rabbit"
  | "nue"
  | "ox"
  | "deer"
  | "wheel";

export interface MegumiShadow {
  key: string;
  kanji: string;
  name: string;
  reading: string;
  turkish: LocalizedText;
  figure: MegumiFigure;
  state: MegumiShadowState;
  /** Ne işe yaradığı — tek satır, listede okunuyor */
  role: LocalizedText;
  text: LocalizedText;
  /** Yalnızca terbiye edilmemiş olanda: ritüelin uyarısı */
  ritualWarning?: LocalizedText;
}

export const MEGUMI_SHADOWS: MegumiShadow[] = [
  {
    key: "haku",
    kanji: "玉犬・白",
    name: "Gyokuken · Haku",
    reading: "ぎょくけん・はく",
    turkish: { tr: "Cins Köpek · Beyaz", en: "Divine Dog · White" },
    figure: "dog",
    state: "broken",
    role: { tr: "İkizin beyaz yarısı — yok edildi", en: "The white half of the pair — destroyed" },
    text: {
      tr: "İki köpekten biri. Megumi'nin ilk çağırdığı shikigami çiftinin beyaz olanı, özel sınıf bir lanetin karşısında paramparça oldu ve teknik onu bir daha vermedi. Kaybın telafisi yok; sonradan gelen tek şey iki köpeğin birleşmiş hâli oldu, yani beyazın yerine yeni bir beyaz değil, ikisinin bıraktığı tek bir gövde geçti.",
      en: "One of the two dogs. The white of the first pair Megumi ever called was torn apart facing a special grade curse, and the technique never gave it back. The loss has no remedy; what came later was the merged form of the two dogs — not a new white, but a single body left behind by both.",
    },
  },
  {
    key: "kuro",
    kanji: "玉犬・黒",
    name: "Gyokuken · Kuro",
    reading: "ぎょくけん・くろ",
    turkish: { tr: "Cins Köpek · Siyah", en: "Divine Dog · Black" },
    figure: "dog",
    state: "tamed",
    role: { tr: "İz sürer, kokuyu bulur", en: "Tracks, finds by scent" },
    text: {
      tr: "Çiftin hayatta kalanı. Hızlı, dişleri işe yarıyor ve asıl değeri koku: görünmeyen bir laneti ya da kaybolmuş bir insanı bulmak için Megumi'nin ilk elini attığı gölge bu. Tek başına kaldıktan sonra da aynı işi görüyor — eksik olan güç değil, ikinci burun.",
      en: "The survivor of the pair. Fast, its teeth do work, and its real value is scent: this is the first shadow Megumi reaches for when an unseen curse or a missing person has to be found. It does the same job alone — what is missing is not power but a second nose.",
    },
  },
  {
    key: "gama",
    kanji: "蝦蟇",
    name: "Gama",
    reading: "がま",
    turkish: { tr: "Kurbağa", en: "Toad" },
    figure: "toad",
    state: "tamed",
    role: { tr: "Diliyle yakalar ve taşır", en: "Catches and carries with its tongue" },
    text: {
      tr: "Saldırmıyor: tutuyor. Uzun dili bir kişiyi tehlikeden çekip almak, bir düşmanı yerinde durdurmak ya da bir düşüşü kesmek için kullanılıyor. Megumi'nin listesinde kurtarma işini gören ilk gölge — dövüşün kendisi değil, dövüşün dışına çıkarmak.",
      en: "It does not strike: it holds. The long tongue pulls someone out of danger, pins an enemy in place, or breaks a fall. The first shadow on Megumi's list that does rescue work — not the fight itself, but removal from it.",
    },
  },
  {
    key: "orochi",
    kanji: "大蛇",
    name: "Orochi",
    reading: "おろち",
    turkish: { tr: "Büyük Yılan", en: "Great Serpent" },
    figure: "serpent",
    state: "tamed",
    role: { tr: "Uzaktan delip geçer", en: "Pierces from a distance" },
    text: {
      tr: "Gölgeden ok gibi fırlayan uzun gövde. Menzili listedeki en uzun menzil ve tek işi delmek: araya girmez, tutmaz, dönmez. Megumi onu bir açılış hamlesi gibi kullanıyor — mesafeyi kapatmadan ilk temasını kurmak için.",
      en: "A long body that shoots from the shadow like an arrow. Its reach is the longest on the list and its only job is to pierce: it does not intervene, hold, or return. Megumi uses it as an opening move — first contact without closing the distance.",
    },
  },
  {
    key: "manzo",
    kanji: "満象",
    name: "Manzō",
    reading: "まんぞう",
    turkish: { tr: "Dolu Fil", en: "Max Elephant" },
    figure: "elephant",
    state: "tamed",
    role: { tr: "Alanı suyla süpürür", en: "Sweeps the field with water" },
    text: {
      tr: "Listedeki en pahalı gölge: çağırmak Megumi'nin enerjisinin büyük kısmını götürüyor. Karşılığında hortumundan çıkan su bir sokağı süpürecek hacimde ve suyun kendisi lanet enerjisi taşıdığı için sıradan bir sel değil. Çıktığı yerde artık kimse ayakta durmuyor.",
      en: "The most expensive shadow on the list: calling it drains most of Megumi's energy. In return, the water from its trunk comes in volumes that sweep a street, and because the water carries cursed energy it is no ordinary flood. Where it lands, nobody stays standing.",
    },
  },
  {
    key: "datto",
    kanji: "脱兎",
    name: "Datto",
    reading: "だっと",
    turkish: { tr: "Kaçan Tavşan", en: "Rabbit Escape" },
    figure: "rabbit",
    state: "tamed",
    role: { tr: "Sayıca boğar, göz karıştırır", en: "Overwhelms by number, blinds the eye" },
    text: {
      tr: "Tek tek hiçbir işe yaramıyorlar: küçükler, zayıflar, vurunca ölüyorlar. Ama gölgeden onlarcası birden çıkıyor ve rakibin gözü hepsini takip etmek zorunda kalıyor. Megumi'nin kazandığı şey hasar değil, iki saniyelik bir görüş kaybı — ve o iki saniyede başka bir gölge kalkıyor.",
      en: "Individually they are useless: small, weak, dead on contact. But dozens leave the shadow at once and the opponent's eye is forced to track all of them. What Megumi gains is not damage but two seconds of lost sight — and in those two seconds another shadow stands up.",
    },
  },
  {
    key: "nue",
    kanji: "鵺",
    name: "Nue",
    reading: "ぬえ",
    turkish: { tr: "Nue", en: "Nue" },
    figure: "nue",
    state: "tamed",
    role: { tr: "Havayı alır, çarpar", en: "Takes the air, strikes" },
    text: {
      tr: "Kanatlı olan tek gölge. Megumi'yi havaya kaldırıyor, düşüşünü kesiyor ve kanatlarındaki elektrikle sersemletiyor. Listedeki en esnek shikigami: hem taşıma hem saldırı hem kaçış — üç işi birden gören tek kayıt.",
      en: "The only winged shadow. It lifts Megumi into the air, breaks his fall, and stuns with the electricity in its wings. The most flexible shikigami on the list: transport, attack and escape — the only entry that does all three.",
    },
  },
  {
    key: "kansen",
    kanji: "貫牛",
    name: "Kansen",
    reading: "かんせん",
    turkish: { tr: "Delen Öküz", en: "Piercing Ox" },
    figure: "ox",
    state: "tamed",
    role: { tr: "Aldıkça hızlanan tek yönlü koşu", en: "A one-way charge that keeps gaining" },
    text: {
      tr: "Dönemiyor, duramıyor, yön değiştiremiyor: yalnızca ileri koşuyor. Buna karşılık kat ettiği her metrede ağırlaşıyor ve çarptığı şeye önceki bütün mesafeyi de taşıyor. Megumi onu hesaplı kullanıyor — bir kere salındığında geri çağrılamayan tek shikigami bu.",
      en: "It cannot turn, stop or change direction: it only runs forward. In exchange it grows heavier with every metre covered and delivers all of that distance into whatever it hits. Megumi spends it carefully — once released, it is the one shikigami that cannot be called back.",
    },
  },
  {
    key: "encho",
    kanji: "円鹿",
    name: "Enchō",
    reading: "えんちょう",
    turkish: { tr: "Halka Boynuzlu Geyik", en: "Round Deer" },
    figure: "deer",
    state: "tamed",
    role: { tr: "Ters akışla iyileştirir", en: "Heals through reversed flow" },
    text: {
      tr: "Listenin tek şifacısı ve tek dövüşmeyeni. Boynuzlarında taşıdığı ters akış, Megumi'nin kendi başına yapamadığı şeyi yapıyor: yarayı kapatmak. Bir shikigami'nin sağlayabileceği en garip avantaj — sahibinin sahip olmadığı bir yeteneği ödünç vermek.",
      en: "The list's only healer and its only non-combatant. The reversed flow it carries in its antlers does what Megumi cannot do himself: close a wound. The strangest advantage a shikigami can offer — lending its owner an ability its owner does not have.",
    },
  },
  {
    key: "mahoraga",
    kanji: "魔虚羅",
    name: "Makora",
    reading: "まこら",
    turkish: { tr: "Mahoraga", en: "Mahoraga" },
    figure: "wheel",
    state: "untamed",
    role: { tr: "Terbiye edilmemiş — ritüel şart", en: "Untamed — the ritual is required" },
    text: {
      tr: "Zen'in ailesinin tarihinde hiç kimsenin terbiye edemediği shikigami. Başının üstündeki çark her aldığı saldırıdan sonra dönüyor ve döndükçe o saldırıya karşı bir daha işlemeyecek bir uyum kuruyor. Yani onu iki kez aynı şeyle vurmak mümkün değil. Çağrılması bir hamle değil bir kumar: ritüeli okumak, kaybedeni öldüren bir dövüşü başlatmak demek.",
      en: "The shikigami no one in the history of the Zen'in family has ever tamed. The wheel above its head turns after every attack it takes, and each turn builds an adaptation that makes that attack useless forever after. It cannot be struck twice by the same thing. Summoning it is not a move but a wager: reading the ritual means starting a fight that kills whoever loses.",
    },
    ritualWarning: {
      tr: "Ritüel geri alınamaz. Bugüne kadar okuyan hiç kimse dövüşü kazanmadı; Megumi onu ancak başka her şey bittiğinde çağırıyor.",
      en: "The ritual cannot be recalled. No one who has read it has ever won the fight; Megumi calls it only when everything else is gone.",
    },
  },
];

export const MEGUMI_SHADOW_UI = {
  listLabel: { tr: "On gölgenin listesi", en: "The list of ten shadows" },
  stageLabel: {
    tr: "Zemin çizgisi — seçilen gölge buradan doğruluyor",
    en: "The ground line — the chosen shadow rises from here",
  },
  stateTamed: { tr: "Terbiye edilmiş", en: "Tamed" },
  stateBroken: { tr: "Kırılmış", en: "Broken" },
  stateUntamed: { tr: "Terbiye edilmemiş", en: "Untamed" },
  ritualButton: { tr: "Ritüeli oku", en: "Read the ritual" },
  ritualWord: "布留部 由良由良 布留部",
  ritualWordNote: {
    tr: "Furube yura yura furube — terbiye ritüelinin sözü.",
    en: "Furube yura yura furube — the words of the taming ritual.",
  },
  countLabel: { tr: "Çağrılabilir", en: "Callable" },
  countBrokenLabel: { tr: "kırılmış", en: "broken" },
  statusRisen: {
    tr: "Gölge çizgiden doğruldu.",
    en: "The shadow has risen from the line.",
  },
  statusBroken: {
    tr: "Bu gölge kırıldı. Çizgi kıpırdıyor ama hiçbir şey kalkmıyor — tekniğin tek geri alınamaz kuralı bu.",
    en: "This shadow is broken. The line stirs but nothing rises — the technique's one irreversible rule.",
  },
  statusUntamed: {
    tr: "Bu gölge henüz terbiye edilmedi. Doğrulması için ritüelin okunması gerekiyor.",
    en: "This shadow has not been tamed. The ritual must be read before it will rise.",
  },
  statusRitual: {
    tr: "Ritüel okundu. Çark dönmeye başladı.",
    en: "The ritual has been read. The wheel has begun to turn.",
  },
  keyboardHint: {
    tr: "Listedeki her satır bir düğme; sekmeyle gez, boşluk ya da enter ile doğrult.",
    en: "Every row in the list is a button; tab through them and raise one with space or enter.",
  },
} as const;

/* ── Beş durak ──────────────────────────────────────────────────────────── */

export interface MegumiFate {
  key: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: LocalizedText };
  kin?: { characterId: number; name: string; role: LocalizedText };
  imageKey: string;
}

export const MEGUMI_TIMELINE: MegumiFate[] = [
  {
    key: "bought",
    age: { tr: "bebeklik", en: "infancy" },
    title: { tr: "Satılmayan çocuk", en: "The child who was not sold" },
    text: {
      tr: "Zen'in ailesi On Gölge'yi taşıyan bebeği satın almak istedi. Babası pazarlığı yaptı ama satış tamamlanmadı; çocuk aileden uzakta, adı Zen'in olmadan büyüdü. Sahip olduğu tek şey adının taşımadığı bir teknik oldu.",
      en: "The Zen'in family moved to buy the infant who carried the Ten Shadows. His father haggled, but the sale never closed; the boy grew up away from the family, without the Zen'in name. What he owned was a technique his name did not carry.",
    },
    kin: {
      characterId: 162722,
      name: "Touji Fushiguro",
      role: { tr: "Pazarlığı yapan baba", en: "The father who struck the deal" },
    },
    imageKey: MEGUMI_IMAGE_KEYS.fateBought,
  },
  {
    key: "sister",
    age: { tr: "çocukluk", en: "childhood" },
    title: { tr: "Uyuyan abla", en: "The sleeping sister" },
    text: {
      tr: "Üvey ablası Tsumiki bir lanetin etkisiyle uyandırılamayacak bir uykuya girdi. Megumi'nin büyücü olmayı kabul etmesinin sebebi bir görev duygusu değil bu: iyi bir insanın hak etmediği bir şeyi yaşaması. Adaleti eşitsiz dağıtma kararı buradan çıkıyor.",
      en: "His stepsister Tsumiki fell into a sleep no one could wake her from, under a curse. What made Megumi accept sorcery was not duty but this: a kind person living something she had not earned. His decision to hand out justice unequally begins here.",
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
    age: { tr: "13 yaş", en: "age 13" },
    title: { tr: "Bulunma", en: "Being found" },
    text: {
      tr: "Satoru Gojō, ailesinin peşine düştüğü tekniği taşıyan çocuğu buldu ve onu okula aldı. Megumi ilk kez kendi tekniğini bir miras olarak değil bir araç olarak kullanmayı öğrendi — ve ilk kez birinin ona ne olacağını değil ne yapacağını sorduğu bir yere girdi.",
      en: "Satoru Gojō found the boy carrying the technique his family had been chasing and brought him into the school. For the first time Megumi learned to use his technique as a tool rather than an inheritance — and for the first time entered a place where someone asked what he would do, not what he would become.",
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
      tr: "İlk büyük görevinde özel sınıf bir lanetin karşısında iki köpeğinden biri parçalandı. Teknik onu geri vermedi ve vermeyecek. Megumi o gün tekniğinin gerçek fiyatını öğrendi: çağırdığı her şey ödünç değil, riske attığı bir varlık.",
      en: "On his first major mission, facing a special grade curse, one of his two dogs was torn apart. The technique did not give it back and never will. That day Megumi learned his technique's real price: nothing he calls is on loan — each is a holding he is putting at risk.",
    },
    imageKey: MEGUMI_IMAGE_KEYS.fateBroken,
  },
  {
    key: "ritual",
    age: { tr: "Shibuya", en: "Shibuya" },
    title: { tr: "Kimsenin okumadığı sözü okumak", en: "Reading the words no one reads" },
    text: {
      tr: "Elinde başka bir şey kalmadığında Megumi ailesinin tarihinde hiç kimsenin kazanamadığı ritüeli okudu. Çağırdığı şey bir müttefik değildi; kendisi de dâhil olmak üzere sahnedeki herkese karşı duran bir üçüncü taraftı. Kaybedeceğini biliyordu ve yine de okudu.",
      en: "With nothing else in hand, Megumi read the ritual no one in his family's history had ever won. What he called was not an ally; it was a third party set against everyone on the scene, himself included. He knew he would lose, and he read it anyway.",
    },
    quote: {
      text: { tr: "布留部 由良由良 布留部", en: "布留部 由良由良 布留部" },
      by: {
        tr: "Terbiye ritüelinin sözü — Shibuya'da",
        en: "The words of the taming ritual — at Shibuya",
      },
    },
    imageKey: MEGUMI_IMAGE_KEYS.fateRitual,
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const MEGUMI_CLOSING = {
  quotes: [
    {
      text: { tr: "俺は不平等に人を助ける", en: "俺は不平等に人を助ける" },
      reading: {
        tr: "İnsanları eşit olmayan bir biçimde kurtarırım.",
        en: "I save people unequally.",
      },
      by: { tr: "Megumi Fushiguro", en: "Megumi Fushiguro" },
      note: {
        tr: "Kendi adalet tanımını anlatırken — kahraman olduğunu değil, bencil davrandığını söylüyor.",
        en: "Explaining his own definition of justice — he calls it selfish, not heroic.",
      },
    },
    {
      text: { tr: "布留部 由良由良 布留部", en: "布留部 由良由良 布留部" },
      reading: {
        tr: "Furube yura yura furube — terbiye ritüelinin sözü.",
        en: "Furube yura yura furube — the words of the taming ritual.",
      },
      by: { tr: "Chōfuku no Gi", en: "Chōfuku no Gi" },
      note: {
        tr: "Ailesinin tarihinde bu sözü okuyup dövüşü kazanan olmadı.",
        en: "In his family's history, no one has read these words and won the fight.",
      },
    },
  ],
  motto: "十種影法術",
  mottoNote: {
    tr: "On Gölge Tekniği. Adı bir güç değil bir SAYI söylüyor: elinde tam olarak on tane var ve biri gittiğinde dokuz kalıyor.",
    en: "The Ten Shadows Technique. Its name states not a power but a NUMBER: he holds exactly ten, and when one goes, nine remain.",
  },
  credit: {
    tr: "Künye, portre ve doğum bilgileri AniList'ten:",
    en: "Dossier, portrait and birth data from AniList:",
  },
  creditLink: {
    tr: "AniList · Megumi Fushiguro #126635",
    en: "AniList · Megumi Fushiguro #126635",
  },
} as const;
