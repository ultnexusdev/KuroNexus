import type { LocalizedText } from "./types";

/**
 * Katsuki Bakugō — "Geri Tepme" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Sahne görselleri veritabanında — characterId 88892 kaydının ABILITY
 * yuvaları, `bkg:*` anahtarlarıyla.
 *
 * ── SAYFANIN TEK CÜMLESİ ─────────────────────────────────────────────────
 * HER PATLAMA ONU DA SAVURUR. Bakugō'nun gücü tek yönlü bir silah değil:
 * aynı el hem namlu hem kabza. Sayfanın mekaniği tam olarak bu — bir
 * teknik ateşlendiğinde kart ileri fırlıyor, sayfa gövdesi ters yöne
 * kayıyor. Etki ve tepki her zaman zıt.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (20 Nisan), boy (172 cm), kan grubu (A), künyedeki yaş
 * ("14-"), Quirk adı (Explosion), sınıf (U.A. Lisesi 1-A) ve takma adlar
 * (かっちゃん / Kacchan, 大爆殺神ダイナマイト) arşivin kendi kopyasından
 * birebir alındı: `public/assets/anime/karakterler/katsuki-bakugou/
 * kaynak.json` (AniList #88892, 30 Ağustos 2026).
 *
 * ⚠️ DOĞUM YILI KAYITTA YOK (`dogum.year: null`). Künyede boş bırakıldı ve
 * künyedeki "14-" ile birleştirilip bir yıl TÜRETİLMEDİ. Kader çizelgesi de
 * takvim yılı kullanmıyor: adımlar Quirk'ün belirdiği yaş, ortaokul ve U.A.
 * birinci yılın olayları üzerinden ilerliyor — kılavuzun "emin olmadığın
 * ölçüyü yazma" kuralı gereği.
 *
 * ⚠️ KAHRAMAN ADININ YAZIMI. `kaynak.json` → `digerAdlar` şunu taşıyor:
 * "Daibakusasshin Dynamight (大•爆•殺•神ダイナマイト)". Ayırıcı orada ASCII
 * madde imiyle (•) yazılmış; sayfada Japon orta noktasıyla (・) basılıyor,
 * karakter dizisinin kendisi değişmedi. Romanizasyon da künyedeki hâliyle
 * korundu (arşivin doğrulayabildiği tek kaynak o kayıt).
 *
 * ── TERMİNOLOJİ (bu evren: My Hero Academia) ─────────────────────────────
 * 個性 (Kosei — Quirk), 爆破 (Bakuha — Patlama, Bakugō'nun Quirk'ü),
 * Ultimate Move (超必殺技 kategorisinin sitedeki karşılığı olarak "Ultimate
 * Move" yazılıyor), Hero Adı, Kahraman Sıralaması, 雄英高校 (Yūei — U.A.
 * Lisesi), 1-A. "Jutsu" ya da "teknik" bu sayfada YAZILMIYOR.
 *
 * ── QUIRK TANIMININ KAYNAĞI ──────────────────────────────────────────────
 * "Avuç içlerinden nitrogliserine benzer bir ter salgılıyor ve komutla
 * ateşliyor; ne kadar çok terlerse patlama o kadar güçlü oluyor; patlamayı
 * kendini itmek, havada yön değiştirmek ve gelen saldırılardan kaçınmak
 * için de kullanıyor; şok dalgası kalkan olarak da kullanılabiliyor" —
 * hepsi `kaynak.json` → `aciklama` alanının son paragrafından. Sayfanın
 * "itme = tepki" tezi uydurma değil, künyenin kendi cümlesi.
 *
 * ── ULTIMATE MOVE ADLARI ─────────────────────────────────────────────────
 * Beş adın hiçbiri AniList künyesinde YOK; hepsi serinin kendisinden
 * geliyor ve burada katakanasıyla birlikte yazılıyor:
 *   APショット (AP Shot) · ハウザーインパクト (Howitzer Impact) ·
 *   爆速ターボ (Blast Rush Turbo) · スタングレネード (Stun Grenade) ·
 *   クラスター (Cluster)
 * Aynı şekilde グレネードブレス (Grenadier Bracers) kostüm parçası da
 * seriden. Künyede olmayan bu adlar sayfada TEK BAŞINA bir olay iddiası
 * taşımıyor: her kart tekniğin MEKANİĞİNİ anlatıyor, bir bölüm numarası ya
 * da bir maç sonucu iddia etmiyor.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada tırnak içine alınan Japonca yalnızca iki dize:
 *   「くたばれ、デク！」        — ortaokul çağında Midoriya'ya söylediği
 *   「大・爆・殺・神ダイナマイト」 — kendi ilan ettiği kahraman adı (künyede)
 * Üçüncü bir "replik" uydurulmadı. Kamino sonrasındaki itiraf ve Spor
 * Festivali'ndeki öfke düz anlatı olarak yazıldı, Japonca cümle olarak
 * DEĞİL — emin olunmayan cümle tırnağa alınmıyor.
 *
 * ── MOTTO ────────────────────────────────────────────────────────────────
 * 勝己 — adının ikinci yarısı. 勝 "galibiyet", 己 "kendi". Yani künyedeki
 * 爆豪勝己 dizisinin son iki karakteri "kendine karşı galibiyet" diye de
 * okunuyor. Bu bir yorum değil karakterlerin kendi anlamı; kaynağı yine
 * `kaynak.json` → `adNative`.
 */

export const BAKUGO_ID = 88892;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const BAKUGO_SITE_URL = "https://anilist.co/character/88892";

/**
 * Depodaki resmî portre (Faz 2 §3: hotlink YOK, dosya repoda).
 * Ölçüsü `kaynak.json` → `portre`: 230×345, yani KÜÇÜK. Sayfada künye
 * kartının yanında madalyon boyunda duruyor; büyük kadraj `bkg:hero`
 * yuvasında bekliyor.
 */
export const BAKUGO_PORTRAIT = {
  src: "/assets/anime/karakterler/katsuki-bakugou/anilist-portrait.png",
  w: 230,
  h: 345,
} as const;

/**
 * Sahne görselleri — hepsi characterId 88892 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `bkg:` önekli (küratör modu şartı).
 */
export const BAKUGO_IMAGE_KEYS = {
  hero: "bkg:hero",
  quirk: "bkg:bakuha",
  drive: "bkg:suishin",
  bracer: "bkg:bracer",
  cardName: "bkg:hero-adi",
  cardGrades: "bkg:notlar",
  cardRead: "bkg:sezgi",
  cardOther: "bkg:mutfak",
  stage: "bkg:stage",
  fateQuirk: "bkg:fate-avuc",
  fateSchool: "bkg:fate-ortaokul",
  fateFestival: "bkg:fate-festival",
  fateKamino: "bkg:fate-kamino",
  fateName: "bkg:fate-dynamight",
  rivals: "bkg:rakipler",
  closing: "bkg:closing",
} as const;

/** Portre yuvası ABILITY değil PORTRAIT — yüklenen kare 230×345'i EZER. */
export const BAKUGO_PORTRAIT_SLOT_KEY = "PORTRAIT";

/**
 * Küratör yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur.
 *
 * ⚠️ BU METİNLER ZİYARETÇİYE GÖRÜNMEZ. Yalnızca `isAdmin` dalındaki
 * `CuratorSlot`/`CuratorGaps` çağrılarına gidiyor. Dalga 1 denetiminde en
 * ağır bulgu buydu: bir sayfa boş kadrajların İÇİNE üretim metadatasını
 * yazmış ve `isAdmin` ile kesmemişti. Bu sayfada boş kadraj YAZISIZ.
 */
export const BAKUGO_SLOT_LABELS: Record<string, LocalizedText> = {
  [BAKUGO_IMAGE_KEYS.hero]: {
    tr: "Hero — geniş patlama karesi: parlama anı, savrulan toz (16:9, webp)",
    en: "Hero — a wide detonation plate: the flash, the thrown dust (16:9, webp)",
  },
  [BAKUGO_PORTRAIT_SLOT_KEY]: {
    tr: "Portre — dikey kare; yüklenen görsel künyedeki 230×345'i ezer (2:3, webp)",
    en: "Portrait — a vertical frame; an upload overrides the record's 230×345 (2:3, webp)",
  },
  [BAKUGO_IMAGE_KEYS.quirk]: {
    tr: "個性・爆破 — açık avuç, ter damlası ve kıvılcım; yakın çekim (4:3)",
    en: "個性・爆破 — an open palm, a bead of sweat and a spark; close crop (4:3)",
  },
  [BAKUGO_IMAGE_KEYS.drive]: {
    tr: "İtiş — havada yön değiştiren gövde, arkada patlama konisi (4:3)",
    en: "Propulsion — a body changing course in mid-air, a blast cone behind (4:3)",
  },
  [BAKUGO_IMAGE_KEYS.bracer]: {
    tr: "グレネードブレス — bileklik, pim ve namlu ağzı; ürün çekimi gibi (4:3)",
    en: "グレネードブレス — the bracer, the pin and the muzzle; product-shot framing (4:3)",
  },
  [BAKUGO_IMAGE_KEYS.cardName]: {
    tr: "Hero adı — ilan levhası ya da mikrofon başındaki figür (1:1)",
    en: "Hero name — a declaration board or a figure at a microphone (1:1)",
  },
  [BAKUGO_IMAGE_KEYS.cardGrades]: {
    tr: "Notlar — sınıf sırası, açık defter, kalem; kimse yok (1:1)",
    en: "Grades — a classroom desk, an open notebook, a pen; no one in frame (1:1)",
  },
  [BAKUGO_IMAGE_KEYS.cardRead]: {
    tr: "Sezgi — savaş alanını okuyan bakış, dar kadraj (1:1)",
    en: "Perception — the look that reads a battlefield, tight crop (1:1)",
  },
  [BAKUGO_IMAGE_KEYS.cardOther]: {
    tr: "Beklenmedik el — mutfak tezgâhı ya da enstrüman; soğuk ışık (1:1)",
    en: "The unexpected hand — a kitchen counter or an instrument; cool light (1:1)",
  },
  [BAKUGO_IMAGE_KEYS.stage]: {
    tr: "Geri tepme sahnesi — çok geniş zemin karesi, üstüne perde biniyor (21:9)",
    en: "The recoil stage — an ultra-wide ground plate, a scrim sits over it (21:9)",
  },
  [BAKUGO_IMAGE_KEYS.fateQuirk]: {
    tr: "Avuçlar — küçük bir çocuğun elinde ilk kıvılcım (16:9)",
    en: "The palms — a small child's hand throwing its first spark (16:9)",
  },
  [BAKUGO_IMAGE_KEYS.fateSchool]: {
    tr: "Ortaokul — koridor, sıra dizisi, iki figür arasında mesafe (16:9)",
    en: "Middle school — a corridor, a row of desks, distance between two figures (16:9)",
  },
  [BAKUGO_IMAGE_KEYS.fateFestival]: {
    tr: "Spor Festivali — kürsü ve kalabalık, tek figür ayakta (16:9)",
    en: "The Sports Festival — a podium and a crowd, one figure standing (16:9)",
  },
  [BAKUGO_IMAGE_KEYS.fateKamino]: {
    tr: "Kamino — gece, duman, uzakta ışık; figür küçük (16:9)",
    en: "Kamino — night, smoke, a light far off; the figure small (16:9)",
  },
  [BAKUGO_IMAGE_KEYS.fateName]: {
    tr: "Dynamight — kostüm tam boy, bileklikler görünür (16:9)",
    en: "Dynamight — the full costume, the bracers visible (16:9)",
  },
  [BAKUGO_IMAGE_KEYS.rivals]: {
    tr: "Rakipler — iki figür karşı karşıya, geniş şerit (2:1)",
    en: "Rivals — two figures facing each other, wide strip (2:1)",
  },
  [BAKUGO_IMAGE_KEYS.closing]: {
    tr: "Kapanış — patlamadan sonraki boş zemin, insansız (2:1)",
    en: "Closing — the empty ground after a blast, no people (2:1)",
  },
};

/** Küratör özetindeki "beklenen kare" satırları — yalnızca yönetici görür. */
export const BAKUGO_SLOT_SPECS: Record<string, LocalizedText> = {
  [BAKUGO_IMAGE_KEYS.hero]: {
    tr: "geniş patlama karesi · 1920×1080 · webp",
    en: "wide detonation plate · 1920×1080 · webp",
  },
  [BAKUGO_PORTRAIT_SLOT_KEY]: {
    tr: "dikey portre · 1200×1600 · webp",
    en: "vertical portrait · 1200×1600 · webp",
  },
  [BAKUGO_IMAGE_KEYS.quirk]: {
    tr: "büyük kart · 1200×900 · webp",
    en: "large card · 1200×900 · webp",
  },
  [BAKUGO_IMAGE_KEYS.drive]: {
    tr: "büyük kart · 1200×900 · webp",
    en: "large card · 1200×900 · webp",
  },
  [BAKUGO_IMAGE_KEYS.bracer]: {
    tr: "büyük kart · 1200×900 · webp",
    en: "large card · 1200×900 · webp",
  },
  [BAKUGO_IMAGE_KEYS.cardName]: {
    tr: "kare detay · 800×800 · webp",
    en: "square detail · 800×800 · webp",
  },
  [BAKUGO_IMAGE_KEYS.cardGrades]: {
    tr: "kare detay · 800×800 · webp",
    en: "square detail · 800×800 · webp",
  },
  [BAKUGO_IMAGE_KEYS.cardRead]: {
    tr: "kare detay · 800×800 · webp",
    en: "square detail · 800×800 · webp",
  },
  [BAKUGO_IMAGE_KEYS.cardOther]: {
    tr: "kare detay · 800×800 · webp",
    en: "square detail · 800×800 · webp",
  },
  [BAKUGO_IMAGE_KEYS.stage]: {
    tr: "çok geniş zemin · 2100×900 · webp",
    en: "ultra-wide ground · 2100×900 · webp",
  },
  [BAKUGO_IMAGE_KEYS.fateQuirk]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [BAKUGO_IMAGE_KEYS.fateSchool]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [BAKUGO_IMAGE_KEYS.fateFestival]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [BAKUGO_IMAGE_KEYS.fateKamino]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [BAKUGO_IMAGE_KEYS.fateName]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [BAKUGO_IMAGE_KEYS.rivals]: {
    tr: "geniş şerit · 1600×800 · webp",
    en: "wide strip · 1600×800 · webp",
  },
  [BAKUGO_IMAGE_KEYS.closing]: {
    tr: "geniş şerit · 1600×800 · webp",
    en: "wide strip · 1600×800 · webp",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const BAKUGO_IDENTITY = {
  name: "Katsuki Bakugou",
  nativeName: "爆豪勝己",
  /** Filigranın kanji yarısı — dekoratif (aria-hidden): soyadı, 爆 = patlama */
  watermark: "爆豪",
  /** Kahraman adı — künyedeki `digerAdlar` kaydından (ayırıcı ・ ile) */
  heroName: "大・爆・殺・神ダイナマイト",
  heroNameRoman: "Daibakusasshin Dynamight",
  nickname: "かっちゃん",
  house: {
    tr: "U.A. Lisesi · 1-A · 個性: 爆破",
    en: "U.A. High School · Class 1-A · Quirk: Explosion",
  },
  epigraph: {
    tr: "Avucundan çıkan şey onu ileri götürüyor. Aynı avuçtan çıkan şey onu geri itiyor. Bakugō'nun bütün hikâyesi bu iki cümlenin arasında geçiyor: ilerlemek için savrulmayı göze almak, ve savrulduğunu kimseye söylememek.",
    en: "What leaves his palm carries him forward. The same thing shoves him back. Bakugō's whole story happens between those two sentences: accepting the throw in order to advance, and never telling anyone that you were thrown.",
  },
  facts: [
    {
      label: { tr: "Doğum günü", en: "Birthday" },
      value: { tr: "20 Nisan", en: "20 April" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "172 cm", en: "172 cm" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "A", en: "A" },
    },
    {
      label: { tr: "Künyedeki yaş", en: "Age in the record" },
      value: { tr: "14− (doğum yılı boş)", en: "14− (birth year blank)" },
    },
    {
      label: { tr: "Quirk (個性)", en: "Quirk (個性)" },
      value: { tr: "爆破 — Patlama", en: "爆破 — Explosion" },
    },
    {
      label: { tr: "Okul ve sınıf", en: "School and class" },
      value: { tr: "U.A. Lisesi · 1-A", en: "U.A. High School · Class 1-A" },
    },
    {
      label: { tr: "Hero adı", en: "Hero name" },
      value: {
        tr: "大・爆・殺・神ダイナマイト",
        en: "大・爆・殺・神ダイナマイト",
      },
    },
    {
      label: { tr: "Sembolik obje", en: "Symbolic object" },
      value: {
        tr: "グレネードブレス — pimli bileklikler",
        en: "グレネードブレス — the pinned bracers",
      },
    },
  ],
} as const;

export const BAKUGO_MISSING_NOTE: LocalizedText = {
  tr: "Künyede doğum YILI boş (`dogum.year: null`) ve yaş yalnızca «14−» olarak kayıtlı. İkisi birleştirilip bir yıl türetilmedi; kader çizelgesi de takvim yılı değil OKUL KADEMESİ kullanıyor. Kahraman sıralaması künyede hiç geçmiyor, o yüzden bu sayfada bir sıra numarası yazmıyor.",
  en: "The record leaves the birth YEAR blank (`dogum.year: null`) and carries the age only as “14−”. The two have not been combined into a derived year; the fate chart runs on SCHOOL STAGE, not the calendar. The record carries no hero ranking either, so no rank number appears on this page.",
};

export const BAKUGO_ALT = {
  companionSuffix: { tr: "portresi", en: "portrait" },
  portraitUploaded: {
    tr: "Katsuki Bakugō — arşivin yüklediği portre",
    en: "Katsuki Bakugō — portrait uploaded by the archive",
  },
  portraitLocal: {
    tr: "Katsuki Bakugō — AniList resmî portresi (depodaki kopya, 230×345)",
    en: "Katsuki Bakugō — official AniList portrait (repository copy, 230×345)",
  },
} as const;

export const BAKUGO_CRUMB = {
  series: { tr: "My Hero Academia", en: "My Hero Academia" },
} as const;

/* ── Mod düğmesi: NİTROGLİSERİN ─────────────────────────────────────────── */

/**
 * `data-sweat="dry" | "primed"`.
 *
 * ⚠️ Düğme kilitli ızgarayı AÇIP KAPATMIYOR, DERECESİNİ değiştiriyor.
 * Uyarı bantları `dry` durumda da görünüyor (Dalga 1'in ikinci dersi:
 * mod kapalıyken sayfa düz bir yığına dönüyordu). `primed` yalnızca
 * bandı KALINLAŞTIRIYOR, kenarları çentikliyor, tipografiyi bir kademe
 * büyütüyor ve paleti turuncuya doyuruyor.
 */
export const BAKUGO_SWEAT_TEXT = {
  label: { tr: "Nitrogliserin", en: "Nitroglycerin" },
  toPrimed: { tr: "Terlet", en: "Make him sweat" },
  toDry: { tr: "Soğut", en: "Cool him down" },
  stateDry: { tr: "乾 — kuru avuç", en: "乾 — dry palm" },
  statePrimed: { tr: "汗 — dolu avuç", en: "汗 — loaded palm" },
  hintDry: {
    tr: "Uyarı bantları ince, kenarlar düz, ölçek sakin. Ter az olduğunda patlama da küçük oluyor — künyenin kendi cümlesi bu.",
    en: "The hazard bands are thin, the edges straight, the scale calm. Less sweat means a smaller blast — that is the record's own sentence.",
  },
  hintPrimed: {
    tr: "Bantlar kalınlaştı, kenarlar çentiklendi, başlıklar bir kademe büyüdü ve sayfa turuncuya doydu. Aynı ızgara — yalnızca derecesi değişti.",
    en: "The bands have thickened, the edges are notched, the headings have gone up one step and the page has saturated to orange. The same grid — only its degree has changed.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const BAKUGO_HERO = {
  lede: {
    tr: "Künye Bakugō'yu tek bir mekanizmayla anlatıyor: avuç içlerinden nitrogliserine benzer bir ter salgılıyor ve onu komutla ateşliyor. Ne kadar çok terlerse patlama o kadar güçlü. Aynı kayıt patlamanın ikinci işini de yazıyor — kendini itmek, havada yön değiştirmek, gelen saldırıdan kaçmak, hatta şok dalgasını kalkan gibi kullanmak. Yani bu güç hiçbir zaman tek yönlü olmadı: her atış aynı anda bir itiş. Sayfa bunun üstüne kuruldu.",
    en: "The record explains Bakugō with a single mechanism: he secretes a nitroglycerin-like sweat from his palms and ignites it on command. The more he sweats, the stronger the blast. The same record notes the blast's second job — propelling himself, changing course in mid-air, evading an incoming attack, even using the shockwave as a shield. So the power was never one-directional: every shot is also a shove. This page is built on that.",
  },
  frameCaption: {
    tr: "Büyük patlama karesi küratör yuvası olarak bekliyor. Yüklenene kadar kadraj boş ama ayakta duruyor.",
    en: "The large detonation plate waits as a curator slot. Until one is uploaded the frame stays empty but standing.",
  },
  gridCaption: {
    tr: "Sayfanın bütün blokları bir uyarı bandına asılı ve hiçbiri diğeriyle aynı genişlikte değil. Hizasızlık kasıtlı: bu sayfada düzgün sıralanmış tek bir şey yok, çünkü anlattığı şey de kontrollü değil.",
    en: "Every block on this page hangs off a hazard band and no two share a width. The misalignment is deliberate: nothing here lines up, because the thing it describes does not line up either.",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const BAKUGO_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "Dossier" },
    lede: {
      tr: "AniList kaydından birebir; boşları boş bırakıldı.",
      en: "Verbatim from the AniList record; blanks left blank.",
    },
  },
  quirk: {
    title: { tr: "Quirk laboratuvarı", en: "The Quirk lab" },
    lede: {
      tr: "Üç büyük parça: gücün kendisi, gücün ikinci işi ve gücü taşıyan donanım. Ardından künyenin verdiği dört küçük kayıt.",
      en: "Three large pieces: the power itself, the power's second job, and the gear that carries it. Then four small entries the record gives us.",
    },
  },
  recoil: {
    title: { tr: "Geri tepme", en: "Recoil" },
    lede: {
      tr: "Beş Ultimate Move. Birine bastığında kart etki yönünde fırlıyor, sayfanın gövdesi ters yöne kayıyor. Yön her seferinde farklı, kural her seferinde aynı: etki neredeyse tepki karşısında.",
      en: "Five Ultimate Moves. Press one and the card is thrown along the action, while the body of the page slides the opposite way. The direction differs every time; the rule never does — wherever the action goes, the reaction is opposite.",
    },
  },
  fate: {
    title: { tr: "Beş durak", en: "Five stops" },
    lede: {
      tr: "Okul kademesiyle ilerliyor, takvimle değil: künyede doğum yılı yok ve arşiv olmayan bir sayıyı yazmıyor.",
      en: "It runs on school stage, not the calendar: the record has no birth year and the archive does not write a number it does not have.",
    },
  },
  bonds: {
    title: { tr: "Karşısındakiler", en: "The ones opposite him" },
    lede: {
      tr: "Bakugō'yu tarif etmenin en kısa yolu, kime karşı durduğunu saymak. Beşinin de arşivde kaydı var; üçünün kendi dosyası da.",
      en: "The shortest way to describe Bakugō is to count who he stands against. All five are in the archive; three of them have their own file.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "Bir hakaret ve bir ad. İkisi de kendi ağzından çıktı, ikisi de aynı yöne bakıyor.",
      en: "One insult and one name. Both came out of his own mouth, and both point the same way.",
    },
  },
} as const;

/* ── Quirk laboratuvarı: üç büyük kart ──────────────────────────────────── */

export interface BakugoCore {
  key: string;
  /** Japonca ad / kostüm parçası adı — çevrilmiyor */
  name: string;
  reading: string;
  turkish: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
  /** Kaynak künyeden mi geliyor yoksa seriden mi — ziyaretçiye YAZILIYOR */
  source: LocalizedText;
  imageKey: string;
}

export const BAKUGO_CORES: BakugoCore[] = [
  {
    key: "bakuha",
    name: "爆破",
    reading: "ばくは",
    turkish: { tr: "Patlama", en: "Explosion" },
    tagline: {
      tr: "Ter bir yakıt. Avuç bir ateşleyici. Fazlası daha büyük, azı daha küçük.",
      en: "The sweat is fuel. The palm is an igniter. More means bigger, less means smaller.",
    },
    text: {
      tr: "Bakugō'nun avuç içleri nitrogliserine benzeyen bir sıvı salgılıyor ve o sıvıyı komutla ateşleyebiliyor. Gücün ölçeği bir irade meselesi değil bir MİKTAR meselesi: ne kadar çok terlerse patlama o kadar güçlü oluyor. Bu, gücü aynı anda hem sınırsız hem de tükenebilir yapıyor — sıcakta ve hareket hâlindeyken artıyor, uzun bir çarpışmanın sonunda azalıyor. Sayfadaki bütün geri tepmelerin sebebi bu tek cümle: bir kaynağı harcayarak ivme üretiyorsun ve ivme iki yönlü.",
      en: "Bakugō's palms secrete a nitroglycerin-like fluid, and he can ignite it on command. The scale of the power is not a question of will but of QUANTITY: the more he sweats, the stronger the blast. That makes it limitless and exhaustible at once — it rises in heat and in motion, and drops at the end of a long fight. Every recoil on this page comes out of that one sentence: you spend a resource to make acceleration, and acceleration runs both ways.",
    },
    traits: [
      { tr: "Avuç içinden salgı", en: "Secreted from the palms" },
      { tr: "Komutla ateşleme", en: "Ignited on command" },
      { tr: "Çok ter = büyük patlama", en: "More sweat = bigger blast" },
    ],
    source: {
      tr: "Künyeden — AniList kaydının açıklama alanı",
      en: "From the record — the AniList description field",
    },
    imageKey: BAKUGO_IMAGE_KEYS.quirk,
  },
  {
    key: "drive",
    name: "推進",
    reading: "すいしん",
    turkish: { tr: "İtiş ve kalkan", en: "Propulsion and shield" },
    tagline: {
      tr: "Patlamanın ikinci işi: vurmak değil, taşımak.",
      en: "The blast's second job: not to strike but to carry.",
    },
    text: {
      tr: "Künye bu maddeyi ayrıca yazıyor ve sayfanın tezi tam olarak burada: Bakugō patlamayı kendini itmek için de kullanıyor. Havada yüksek hızla yön değiştiriyor, rakibine tepki verecek vakit bırakmadan üstüne gidiyor, gelen saldırıdan kaçınıyor — havadayken bile. Aynı şok dalgası bir kalkan olarak da işe yarıyor. Yani hücum, kaçış ve savunma tek bir mekanizmadan çıkıyor. Bunun bedeli de tek: her yön değiştirme, bir yere doğru bir şey fırlatmakla oluyor. Bir yöne gitmek isteyen, ters yöne bir patlama harcamak zorunda.",
      en: "The record states this separately, and it is exactly the page's thesis: Bakugō also uses the blast to move himself. He changes course in mid-air at high speed, closes on an opponent before they have time to react, and evades incoming attacks — even while airborne. The same shockwave also works as a shield. So attack, escape and defence all come out of one mechanism. And it has one cost: every change of course happens by throwing something the other way. To go one direction you must spend a blast in the opposite one.",
    },
    traits: [
      { tr: "Havada yön değiştirme", en: "Course changes in mid-air" },
      { tr: "Tepki vermeye vakit bırakmama", en: "No time left to react" },
      { tr: "Şok dalgası = kalkan", en: "Shockwave as shield" },
    ],
    source: {
      tr: "Künyeden — AniList kaydının açıklama alanı",
      en: "From the record — the AniList description field",
    },
    imageKey: BAKUGO_IMAGE_KEYS.drive,
  },
  {
    key: "bracer",
    name: "グレネードブレス",
    reading: "ぐれねーどぶれす",
    turkish: { tr: "Grenadier Bracers", en: "Grenadier Bracers" },
    tagline: {
      tr: "Teri harcamak yerine biriktiren tek parça. Ve tek seferlik.",
      en: "The one piece that saves the sweat instead of spending it. And it fires once.",
    },
    text: {
      tr: "Kostümün bilekliklerinde büyük, huni ağızlı birer hazne var: Bakugō terini oraya biriktiriyor ve pimi çektiğinde birikenin tamamı tek bir yönlendirilmiş patlama olarak çıkıyor. Donanımın çözdüğü sorun, gücün kendi sınırı — avuç anlık salgıyla çalışırken bileklik zamanla çalışıyor. Ama takas açık: biriktirdiğin şeyi bir kere kullanıyorsun ve o andan sonra elinde kalan yalnızca avucun kendisi. Sayfadaki en dürüst nesne bu, çünkü bedelini önceden söylüyor.",
      en: "The costume's bracers carry a large funnel-mouthed reservoir each: Bakugō stores his sweat there, and when the pin is pulled everything stored comes out as one directed blast. The problem the gear solves is the power's own limit — the palm works on instantaneous secretion, the bracer works on time. But the trade is plain: what you saved, you use once, and from that moment on all you have left is the palm itself. It is the most honest object on this page, because it states its price in advance.",
    },
    traits: [
      { tr: "Biriktirilen ter", en: "Stored sweat" },
      { tr: "Pimle boşaltma", en: "Released by a pin" },
      { tr: "Tek atış", en: "One shot" },
    ],
    source: {
      tr: "Seriden — kostüm parçası; AniList künyesinde geçmiyor",
      en: "From the series — a costume part; not present in the AniList record",
    },
    imageKey: BAKUGO_IMAGE_KEYS.bracer,
  },
];

/* ── Quirk laboratuvarı: dört küçük kart ────────────────────────────────── */

export interface BakugoNote {
  key: string;
  name: LocalizedText;
  kanji: string;
  note: LocalizedText;
  imageKey: string;
}

/**
 * Dördü de künyenin kendi cümlelerinden çıkıyor (`kaynak.json` → `aciklama`).
 * Bilerek "kahraman sıralaması" kartı YOK: kayıtta bir sıra numarası
 * geçmiyor ve arşiv olmayan bir sayıyı yazmıyor.
 */
export const BAKUGO_NOTES: BakugoNote[] = [
  {
    key: "name",
    name: { tr: "Hero adı", en: "Hero name" },
    kanji: "大・爆・殺・神",
    note: {
      tr: "İlan ettiği ad künyede de kayıtlı: 大・爆・殺・神ダイナマイト. Dört karakter sırayla «büyük», «patlama», «öldürme» ve «tanrı» demek; arkasına da İngilizce bir kelime ekleniyor. Kimsenin sevmediği, kimsenin de değiştiremediği bir ad — Bakugō'nun kendini nasıl gördüğünü tek satırda anlatıyor.",
      en: "The name he declared is in the record too: 大・爆・殺・神ダイナマイト. The four characters read, in order, “great”, “explosion”, “killing” and “god”, with an English word attached behind them. A name nobody liked and nobody could change — it says how Bakugō sees himself in a single line.",
    },
    imageKey: BAKUGO_IMAGE_KEYS.cardName,
  },
  {
    key: "grades",
    name: { tr: "Notlar", en: "Grades" },
    kanji: "成績",
    note: {
      tr: "Künye açıkça yazıyor: notları sınıfının en yüksekleri arasında. Bakugō'yu yalnızca öfkeli bir güç sanmak burada bozuluyor — bağırarak kazandığı hiçbir şey yok, çalışarak kazandığı çok şey var.",
      en: "The record says it plainly: his grades are among the highest in his class. The idea of Bakugō as nothing but angry power breaks here — he has won nothing by shouting and a great deal by working.",
    },
    imageKey: BAKUGO_IMAGE_KEYS.cardGrades,
  },
  {
    key: "read",
    name: { tr: "Okuma ve doğaçlama", en: "Reading and improvisation" },
    kanji: "洞察",
    note: {
      tr: "Kayıt üç sıfat birden veriyor: çok zeki, son derece sezgili ve hem stratejik planlama hem doğaçlama yapabilen. Bakugō'nun kazandığı çarpışmaların çoğu güç farkıyla değil, karşısındakinin bir sonraki hamlesini erken okumasıyla bitiyor.",
      en: "The record gives three adjectives at once: very intelligent, extremely perceptive, and capable of both strategic planning and improvisation. Most of the fights Bakugō wins end not on a gap in power but on his reading the other side's next move early.",
    },
    imageKey: BAKUGO_IMAGE_KEYS.cardRead,
  },
  {
    key: "other",
    name: { tr: "Beklenmedik el", en: "The unexpected hand" },
    kanji: "料理",
    note: {
      tr: "Künyedeki en tuhaf satır: yemek ve müzikte de şaşırtıcı derecede yetenekli, ama ikisiyle de özel olarak ilgilenmiyor. Patlayan avuç aynı zamanda ölçüyle çalışan bir el — bu iki şeyi yan yana koymak, karakteri anlamanın en kısa yolu.",
      en: "The strangest line in the record: he is surprisingly talented at cooking and music, though he takes no particular interest in either. The palm that detonates is also a hand that works by measure — putting those two side by side is the quickest way to understand him.",
    },
    imageKey: BAKUGO_IMAGE_KEYS.cardOther,
  },
];

/* ── Sayfanın kalbi: GERİ TEPME ─────────────────────────────────────────── */

/**
 * Beş Ultimate Move, beş farklı geri tepme yönü.
 *
 * `kick` bir BİRİM VEKTÖR (-1…1). Kart bu yönde fırlıyor; sayfanın gövdesi
 * aynı vektörün TERSİNE, daha küçük bir katsayıyla kayıyor. Ölçüler CSS'te:
 *   kart  → --bkg-kick-x/y  × 30px
 *   gövde → --bkg-shove-x/y × −10px
 * Yani mermi uzağa gidiyor, atan az geri geliyor. Fizik de böyle.
 *
 * ⚠️ Beş adın hiçbiri AniList künyesinde YOK; hepsi serinin kendisinden
 * (dosya başındaki "ULTIMATE MOVE ADLARI" notu). Kartların metni tekniğin
 * MEKANİĞİNİ anlatıyor — hiçbiri bir bölüm numarası ya da maç sonucu iddia
 * etmiyor.
 */
export interface BakugoMove {
  key: string;
  /** Katakana / kanji ad — çevrilmiyor */
  name: string;
  latin: string;
  turkish: LocalizedText;
  /** Etki yönü — birim vektör */
  kick: { x: number; y: number };
  /** Ekranda okunan yön adı */
  actionDir: LocalizedText;
  reactionDir: LocalizedText;
  action: LocalizedText;
  reaction: LocalizedText;
  cost: LocalizedText;
}

export const BAKUGO_MOVES: BakugoMove[] = [
  {
    key: "ap",
    name: "APショット",
    latin: "AP Shot",
    turkish: { tr: "Zırh delici atış", en: "Armour-piercing shot" },
    kick: { x: 1, y: 0 },
    actionDir: { tr: "ileri →", en: "forward →" },
    reactionDir: { tr: "← geri", en: "← back" },
    action: {
      tr: "Avucu neredeyse tamamen kapatıp patlamayı iğne ucu kadar bir delikten çıkarıyor. Aynı miktar ter, çok daha küçük bir kesitten geçince yayılmıyor — deliyor.",
      en: "He closes his palm to almost nothing and pushes the blast out through a pinhole. The same amount of sweat, forced through a far smaller cross-section, no longer spreads — it pierces.",
    },
    reaction: {
      tr: "Kesit daraldıkça basınç artıyor ve artan basınç yalnızca ileri gitmiyor: kabza tarafında da aynı büyüklükte bir itiş var. Delici atışın bedeli, darbenin bilekte toplanması.",
      en: "As the cross-section narrows the pressure climbs, and the climb does not travel forward alone: there is a shove of the same size on the grip side. The price of a piercing shot is that the impact gathers in the wrist.",
    },
    cost: {
      tr: "Aynı el hem namlu hem kabza.",
      en: "The same hand is both muzzle and grip.",
    },
  },
  {
    key: "howitzer",
    name: "ハウザーインパクト",
    latin: "Howitzer Impact",
    turkish: { tr: "Obüs darbesi", en: "Howitzer impact" },
    kick: { x: 0, y: -1 },
    actionDir: { tr: "yukarı ↑", en: "upward ↑" },
    reactionDir: { tr: "↓ aşağı", en: "↓ downward" },
    action: {
      tr: "Havada dönerek çevresine bir ter hunisi kuruyor, sonra hepsini birden ateşliyor. Sayfadaki en büyük tek atış: dar bir delik değil, koca bir koni.",
      en: "Spinning in the air he builds a funnel of sweat around himself, then ignites the whole of it at once. The largest single shot on this page: not a narrow hole but an entire cone.",
    },
    reaction: {
      tr: "Huniyi kurmak zaman istiyor ve o zamanda Bakugō dönmekten başka bir şey yapamıyor. Yukarı giden şey ne kadar büyükse, atışa hazırlanırken açıkta kalınan süre de o kadar uzun.",
      en: "Building the funnel takes time, and during that time Bakugō can do nothing but spin. The bigger the thing that goes up, the longer the stretch spent exposed while getting there.",
    },
    cost: {
      tr: "Büyük atışın bedeli barut değil, süre.",
      en: "A big shot is paid for in time, not powder.",
    },
  },
  {
    key: "turbo",
    name: "爆速ターボ",
    latin: "Blast Rush Turbo",
    turkish: { tr: "Patlamalı hız", en: "Blast rush" },
    kick: { x: 0, y: 1 },
    actionDir: { tr: "aşağı ↓", en: "downward ↓" },
    reactionDir: { tr: "↑ yukarı", en: "↑ upward" },
    action: {
      tr: "Bu sefer hedef karşıda değil altta: teri gövdesinin her yerinden salıp arkaya doğru ateşliyor. Patlama bir saldırı değil, bir motor.",
      en: "This time the target is not opposite him but beneath him: he lets the sweat out over his whole body and fires it backwards. The blast is not an attack but an engine.",
    },
    reaction: {
      tr: "Ve burada tepki bir bedel değil, tekniğin ta kendisi. Bakugō'yu ileri fırlatan şey patlamanın kendisi değil, patlamanın geri tepmesi. Sayfadaki tek durak burası: etki ile tepkinin yerini değiştirdiğin an, geri tepme bir kayıp olmaktan çıkıyor.",
      en: "And here the reaction is not a cost but the technique itself. What throws Bakugō forward is not the blast but the blast's recoil. This is the one stop on the page where swapping action and reaction stops the recoil from being a loss.",
    },
    cost: {
      tr: "Tek seferde bütün bedenin teri.",
      en: "The whole body's sweat, all at once.",
    },
  },
  {
    key: "stun",
    name: "スタングレネード",
    latin: "Stun Grenade",
    turkish: { tr: "Sersemletici", en: "Stun grenade" },
    kick: { x: -1, y: 0 },
    actionDir: { tr: "← yana", en: "← sideways" },
    reactionDir: { tr: "yana →", en: "sideways →" },
    action: {
      tr: "Bu atışın amacı hasar değil. Geniş, gürültülü, göz alan bir parlama: karşıdakinin bir saniyeliğine nereye baktığını unutması yetiyor.",
      en: "This shot is not aimed at damage. A wide, loud, blinding flash: it is enough that the other side forgets, for a second, where it was looking.",
    },
    reaction: {
      tr: "Ama ışık taraf tutmuyor. Kapalı bir alanda parlamayı üretenle ona yakalanan aynı mesafede duruyor. Bakugō'nun sezgisi burada bir ekstra değil zorunluluk: kendi ürettiği körlüğün içinde sıradaki hamleyi ezberden yapması gerekiyor.",
      en: "But light takes no sides. In a closed space the one who makes the flash and the one caught by it stand at the same distance from it. Bakugō's perception is not a bonus here but a requirement: inside a blindness he made himself, the next move has to come from memory.",
    },
    cost: {
      tr: "Kendi ürettiğin körlük seni de kapsıyor.",
      en: "The blindness you make includes you.",
    },
  },
  {
    key: "cluster",
    name: "クラスター",
    latin: "Cluster",
    turkish: { tr: "Küme", en: "Cluster" },
    kick: { x: 0.72, y: 0.72 },
    actionDir: { tr: "ileri-aşağı ↘", en: "forward-down ↘" },
    reactionDir: { tr: "↖ geri-yukarı", en: "↖ back-up" },
    action: {
      tr: "Tek bir büyük patlama yerine üst üste binen katmanlar: her katman bir öncekini sıkıştırıyor, sonuncusu hepsinin toplamını taşıyor. Miktar aynı, düzen farklı.",
      en: "Instead of one large blast, layers stacked on each other: each layer compresses the one before it, and the last carries the sum of all. The same quantity, a different arrangement.",
    },
    reaction: {
      tr: "Katmanlar üst üste bindiği için tepki de üst üste biniyor. Beş atışı beş ayrı ana yaymak yerine tek bir ana sıkıştırmak, karşı tarafta ne kazandırıyorsa aynı el üzerinde onu geri alıyor.",
      en: "Because the layers stack, the reaction stacks too. Compressing five shots into a single moment rather than spreading them across five takes back, on the same hand, exactly what it wins on the other side.",
    },
    cost: {
      tr: "Sıkıştırılan yalnızca patlama değil, tepki de.",
      en: "What gets compressed is not only the blast but the recoil.",
    },
  },
];

export const BAKUGO_RECOIL_UI = {
  stageLabel: {
    tr: "Geri tepme sahnesi — zemin karesi ve şok dalgası halkaları",
    en: "The recoil stage — the ground plate and the shockwave rings",
  },
  listLabel: { tr: "Beş Ultimate Move", en: "Five Ultimate Moves" },
  fireHint: {
    tr: "Bir tekniğe bas: kart etki yönünde fırlar, sayfanın gövdesi ters yöne kayar. Aynı tekniğe tekrar basmak sayfayı yerine bırakır.",
    en: "Press a technique: the card is thrown along the action and the body of the page slides the other way. Pressing the same technique again lets the page settle back.",
  },
  keyboardHint: {
    tr: "Beş teknik de sekmeyle geziliyor; her biri gerçek bir düğme, boşluk ve enter ateşliyor.",
    en: "All five techniques are reachable by tab; each is a real button, and space or enter fires it.",
  },
  release: { tr: "Sayfayı bırak", en: "Let the page settle" },
  actionLabel: { tr: "Etki", en: "Action" },
  reactionLabel: { tr: "Tepki", en: "Reaction" },
  costLabel: { tr: "Bedel", en: "Price" },
  idleTitle: { tr: "Hiçbiri ateşlenmedi", en: "Nothing has been fired" },
  idleText: {
    tr: "Sayfa şu anda yerinde duruyor. Beş tekniğin hiçbirine basılmadığı sürece etki de yok, tepki de yok — ve Bakugō'nun tek yapamadığı şey tam olarak bu.",
    en: "The page is sitting still. As long as none of the five is pressed there is no action and no reaction — and standing still is the one thing Bakugō cannot do.",
  },
  statusFired: { tr: "ateşlendi · gövde ters yöne kaydı", en: "fired · the body slid the opposite way" },
  statusReleased: { tr: "bırakıldı · gövde yerine döndü", en: "released · the body has settled back" },
  closingNote: {
    tr: "Beşinde de aynı şey oluyor: kart bir yöne gidiyor, sayfa öbür yöne. Yalnızca 爆速ターボ'da bu bir kayıp değil — çünkü orada Bakugō zaten tepkiyi kullanmayı seçiyor. Aradaki fark bir güç farkı değil, bir yön tercihi.",
    en: "The same thing happens in all five: the card goes one way, the page goes the other. Only in 爆速ターボ is that not a loss — because there Bakugō has already chosen to use the reaction. The difference between them is not power but which way you point.",
  },
} as const;

/* ── Beş durak ──────────────────────────────────────────────────────────── */

export interface BakugoFate {
  key: string;
  /** Okul kademesi etiketi — takvim yılı YOK (gerekçe: dosya başı) */
  stage: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: string; reading: LocalizedText; by: LocalizedText };
  imageKey: string;
  /** Uyarı bandının hangi yanına oturacak — hizasız ızgara için */
  lane: "left" | "right";
}

export const BAKUGO_TIMELINE: BakugoFate[] = [
  {
    key: "quirk",
    stage: {
      tr: "Dört yaş civarı — Quirk'lerin belirdiği yaş",
      en: "Around age four — when Quirks appear",
    },
    title: { tr: "Avuçlar", en: "The palms" },
    text: {
      tr: "Bu evrende Quirk'ler dört yaş civarında beliriyor ve Bakugō'nunki beliren en gösterişlilerinden biri: elini açıp kapattığında avucundan ışık ve ses çıkıyor. Künyenin en önemli cümlesi de tam burada başlıyor — yeteneğinin ve güçlü Quirk'ünün sürekli övülmesi yüzünden bir üstünlük kompleksi geliştirdi. Yani karakterin çekirdeği bir travmadan değil, KESİNTİSİZ BİR ALKIŞTAN çıkıyor. Etrafındaki herkes ona en baştan kazanmış biri gibi davrandı; o da kaybetmeyi hiç öğrenemedi.",
      en: "In this universe Quirks appear around the age of four, and Bakugō's is one of the loudest to appear: open and close his hand and light and noise come out of the palm. The record's most important sentence starts right here — because of the constant praise of his talent and his powerful Quirk, he developed a superiority complex. So the core of the character comes not from a trauma but from UNBROKEN APPLAUSE. Everyone around him treated him as someone who had already won; he never learned how to lose.",
    },
    imageKey: BAKUGO_IMAGE_KEYS.fateQuirk,
    lane: "left",
  },
  {
    key: "school",
    stage: {
      tr: "Ortaokul — künyedeki yaş «14−»",
      en: "Middle school — the record's age “14−”",
    },
    title: { tr: "Kacchan", en: "Kacchan" },
    text: {
      tr: "Aynı sokakta büyüdüğü, Quirk'süz doğmuş bir çocuk ona çocukluğundan kalma bir adla sesleniyor: かっちゃん. Bakugō için bu ad bir sevgi değil bir kayıt — birinin onu güçlü olmadan önce tanıdığının kanıtı. Ortaokul yıllarında Midoriya'ya davranışı kabalıktan öteye geçiyor ve sınıfın geri kalanı bunu izliyor. Sonra bir gün bir suçlu Bakugō'yu rehin alıyor; kalabalığın ve profesyonel kahramanların beklediği yerde içeri koşan tek kişi, o Quirk'süz çocuk oluyor. Bakugō'nun hikâyesindeki ilk gerçek geri tepme bu: kurtarılmak, hem de kurtarılmaması gereken kişi tarafından.",
      en: "A boy from the same street, born Quirkless, calls him by a name left over from childhood: かっちゃん. To Bakugō the name is not affection but a record — proof that somebody knew him before he was strong. Through middle school his treatment of Midoriya goes well past rudeness, and the rest of the class watches it happen. Then one day a villain takes Bakugō hostage; where the crowd and the professional heroes wait, the only person who runs in is that Quirkless boy. This is the first real recoil in Bakugō's story: being rescued, and by exactly the person who should not have been the one.",
    },
    quote: {
      text: "くたばれ、デク！",
      reading: {
        tr: "«Geber, Deku!»",
        en: "“Drop dead, Deku!”",
      },
      by: {
        tr: "Bakugō — ortaokul çağında Midoriya'ya",
        en: "Bakugō — to Midoriya, in their middle-school years",
      },
    },
    imageKey: BAKUGO_IMAGE_KEYS.fateSchool,
    lane: "right",
  },
  {
    key: "festival",
    stage: {
      tr: "U.A. birinci yıl — Spor Festivali",
      en: "U.A. first year — the Sports Festival",
    },
    title: { tr: "Kürsüdeki zincir", en: "The chain on the podium" },
    text: {
      tr: "U.A.'nın Spor Festivali okulun en görünür sınavı: bütün ülke izliyor ve profesyoneller oradan öğrenci seçiyor. Bakugō turnuvayı kazanıyor. Ama finaldeki rakibi elindeki gücün yarısını kullanmayı reddettiği için, Bakugō kazandığı şeyin eksik olduğunu düşünüyor ve kürsüde kabul etmiyor. Birinciliği ancak zincirle ve ağzı bağlanarak alabiliyor. Sayfadaki en net görüntü bu: kazanmak onu tatmin etmiyor, çünkü kazanmanın nasıl olduğunu karşısındaki belirledi.",
      en: "U.A.'s Sports Festival is the school's most visible exam: the whole country watches and the professionals pick students out of it. Bakugō wins the tournament. But because his opponent in the final refused to use half of his own power, Bakugō decides that what he won is incomplete, and will not accept it on the podium. He can only be given first place in chains, with his mouth restrained. It is the clearest image on this page: winning does not satisfy him, because the shape of the win was decided by the other side.",
    },
    imageKey: BAKUGO_IMAGE_KEYS.fateFestival,
    lane: "left",
  },
  {
    key: "kamino",
    stage: {
      tr: "U.A. birinci yıl — Kamino ve sonrası",
      en: "U.A. first year — Kamino and after",
    },
    title: { tr: "Taşınan suç", en: "The blame he carried" },
    text: {
      tr: "Bakugō bir kez daha kaçırılıyor ve bu sefer onu geri almak için gelenlerin başında hayranı olduğu sembol var. Kurtarma başarıyla bitiyor ama sembol o gecenin sonunda gücünü tüketiyor ve geri çekilmek zorunda kalıyor. Bakugō bunun sorumluluğunu kendi üstüne alıyor ve kimseye söylemiyor — sayfanın bütün mekaniği burada bir kere daha doğruluyor: dışarıya giden patlamanın faturası her seferinde onu tutan ele çıkıyor. Aynı dönemde Midoriya ile boş bir eğitim sahasında hesaplaşıyorlar; Bakugō'nun o güne kadar yüksek sesle söylemediği tek şey oradan çıkıyor.",
      en: "Bakugō is taken again, and this time the symbol he admires is at the head of the group that comes to bring him back. The rescue succeeds, but by the end of that night the symbol has spent his power and has to step down. Bakugō takes the responsibility for it onto himself and tells no one — the whole mechanic of this page confirms itself once more here: the bill for the blast that goes outward always lands on the hand that held it. In the same stretch he and Midoriya settle it in an empty training ground; the one thing Bakugō had never said out loud comes out there.",
    },
    imageKey: BAKUGO_IMAGE_KEYS.fateKamino,
    lane: "right",
  },
  {
    key: "name",
    stage: {
      tr: "U.A. birinci yıl — geçici lisans ve ad",
      en: "U.A. first year — the provisional licence and the name",
    },
    title: { tr: "Dynamight", en: "Dynamight" },
    text: {
      tr: "Geçici kahraman lisansı sınavını ilk denemede geçemiyor: gücü yeterli, tavrı değil — sınav kurtarmayı ölçüyor, yenmeyi değil. Telafi kursunu tamamlayıp lisansı aldıktan sonra kendi kahraman adını ilan ediyor: 大・爆・殺・神ダイナマイト. Ad kimseyi memnun etmiyor ve değişmiyor. Beş durağın sonunda Bakugō'nun öğrendiği şey öfkesini bırakmak değil, onu bir yöne bağlamak oluyor — aynı miktarda patlama, bu sefer seçilmiş bir hedefe.",
      en: "He does not pass the provisional hero licence exam on the first attempt: his power is enough, his attitude is not — the exam measures rescue, not defeat. After completing the remedial course and taking the licence, he declares his own hero name: 大・爆・殺・神ダイナマイト. The name pleases nobody and does not change. What Bakugō learns by the end of these five stops is not to give up his anger but to attach it to a direction — the same quantity of blast, this time at a chosen target.",
    },
    quote: {
      text: "大・爆・殺・神ダイナマイト",
      reading: {
        tr: "«Büyük Patlama Öldüren Tanrı Dynamight» — kendi ilan ettiği kahraman adı",
        en: "“Great Explosion Murder God Dynamight” — the hero name he declared himself",
      },
      by: {
        tr: "Künyede kayıtlı (AniList #88892 · diğer adlar)",
        en: "Recorded in the dossier (AniList #88892 · alternative names)",
      },
    },
    imageKey: BAKUGO_IMAGE_KEYS.fateName,
    lane: "left",
  },
];

/* ── Karşısındakiler ────────────────────────────────────────────────────── */

export interface BakugoBond {
  characterId: number;
  name: string;
  nativeName: string;
  role: LocalizedText;
  note: LocalizedText;
}

/**
 * ⚠️ Beş kimlik de `EXPERIENCE_COMPANIONS[88892]` listesinde KAYITLI
 * (`lib/characters/experiences.ts`) — portre kaydı girildiğinde kadrajlar
 * kendiliğinden dolar. Adlar 30 Ağustos 2026'da AniList GraphQL'den tek tek
 * doğrulandı: 89028 Izuku Midoriya (緑谷出久), 89224 Toshinori Yagi
 * (八木俊典), 89220 Shouto Todoroki (轟焦凍), 89243 Eijirou Kirishima
 * (切島鋭児郎), 89225 Shouta Aizawa (相澤消太).
 *
 * Üçünün (89028 · 89224 · 89220) kendi deneyim sayfası var ve
 * `isExperienceCharacter` onları bağlantılı çiziyor; Kirishima ve Aizawa
 * için `false` dönüyor, o yüzden bağ verilmiyor, yalnız ad yazılıyor.
 */
export const BAKUGO_BONDS: BakugoBond[] = [
  {
    characterId: 89028,
    name: "Izuku Midoriya",
    nativeName: "緑谷出久",
    role: { tr: "Ölçtüğü tek kişi", en: "The only one he measures himself against" },
    note: {
      tr: "Aynı sokakta büyüdüler ve Bakugō ona hâlâ çocukluk adıyla sesleniyor. Karşısındakinin Quirk'süz doğmuş olması meseleyi çözmüyor, büyütüyor: Bakugō'nun bütün ölçüsü «ondan önde olmak» üzerine kurulu ve o ölçü onu hiç rahat bırakmıyor.",
      en: "They grew up on the same street, and Bakugō still calls him by a childhood name. That the other was born Quirkless does not settle the matter but enlarges it: Bakugō's entire measure is built on “being ahead of him”, and that measure never lets him rest.",
    },
  },
  {
    characterId: 89224,
    name: "Toshinori Yagi",
    nativeName: "八木俊典",
    role: { tr: "Ölçünün kendisi", en: "The measure itself" },
    note: {
      tr: "Bakugō'nun çocukluğundan beri örnek aldığı figür. Ondan öğrendiği şey teknik değil bir duruş: kazanan kahraman gülüyor. Bakugō gülmüyor — ama kazanmak zorunda olduğu fikrini oradan aldı.",
      en: "The figure Bakugō has modelled himself on since childhood. What he took from him was not technique but a stance: the winning hero smiles. Bakugō does not smile — but the idea that he must win came from there.",
    },
  },
  {
    characterId: 89220,
    name: "Shouto Todoroki",
    nativeName: "轟焦凍",
    role: { tr: "Eksik bıraktığı zafer", en: "The victory left incomplete" },
    note: {
      tr: "Spor Festivali finalinde karşısına çıkan ve elindeki gücün yarısını kullanmayı reddeden kişi. Bakugō turnuvayı kazandı ama kazandığı şeyin biçimini karşısındaki belirlediği için kürsüde kabul etmedi.",
      en: "The one who faced him in the Sports Festival final and refused to use half of his own power. Bakugō won the tournament, but because the shape of that win was decided by the other side he would not accept it on the podium.",
    },
  },
  {
    characterId: 89243,
    name: "Eijirou Kirishima",
    nativeName: "切島鋭児郎",
    role: { tr: "Yanında duran", en: "The one who stands beside him" },
    note: {
      tr: "1-A'nın Bakugō'yu kovmayan tek üyesi. Bakugō'nun kimseye açıklamadığı şeyleri açıklamak zorunda kalmadan yanında durabilen biri — bu sayfada tepkiyi soğuran tek yüzey.",
      en: "The one member of 1-A who does not push Bakugō away. Someone who can stand next to him without requiring him to explain the things he explains to no one — the only surface on this page that absorbs the recoil.",
    },
  },
  {
    characterId: 89225,
    name: "Shouta Aizawa",
    nativeName: "相澤消太",
    role: { tr: "Sınıf öğretmeni", en: "The homeroom teacher" },
    note: {
      tr: "1-A'nın sorumlusu. Bakugō'nun gücünü değil tavrını ölçen ilk yetişkin: geçici lisans sınavının ölçtüğü şey de tam olarak buydu ve Bakugō ilk denemede oradan geçemedi.",
      en: "The one responsible for Class 1-A. The first adult to measure not Bakugō's power but his attitude: that was exactly what the provisional licence exam measured, and it was there that he failed on the first attempt.",
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const BAKUGO_CLOSING = {
  quotes: [
    {
      text: "くたばれ、デク！",
      reading: {
        tr: "«Geber, Deku!»",
        en: "“Drop dead, Deku!”",
      },
      by: { tr: "Katsuki Bakugō", en: "Katsuki Bakugō" },
      note: {
        tr: "Ortaokul çağında, kurtarılmadan önce. Cümlenin muhatabı, birkaç yıl sonra ona en yakın duran kişi olacak — ve cümle hiç değişmeyecek, yalnızca söylendiği ton değişecek.",
        en: "In middle school, before the rescue. The person it is aimed at will, a few years later, be the one standing closest to him — and the sentence will never change, only the tone it is said in.",
      },
    },
    {
      text: "大・爆・殺・神ダイナマイト",
      reading: {
        tr: "«Büyük Patlama Öldüren Tanrı Dynamight»",
        en: "“Great Explosion Murder God Dynamight”",
      },
      by: { tr: "Katsuki Bakugō", en: "Katsuki Bakugō" },
      note: {
        tr: "Kendi seçtiği kahraman adı; künyede de kayıtlı. Kimse beğenmedi, kimse değiştiremedi. Bakugō'nun bir şeyi yumuşatmayı hiç düşünmediğinin en kısa kanıtı.",
        en: "The hero name he chose himself; the dossier carries it too. Nobody liked it, nobody could change it. The shortest proof that Bakugō has never once considered softening anything.",
      },
    },
  ],
  motto: "勝己",
  mottoNote: {
    tr: "Katsuki — adının ikinci yarısı. 勝 «galibiyet», 己 «kendi» demek; yani künyedeki 爆豪勝己 dizisinin son iki karakteri «kendine karşı galibiyet» diye de okunuyor. Sayfanın filigranı 爆豪 (patlama + güç), ama işin özü bu ikisinde: Bakugō'nun asıl rakibi hiçbir zaman karşısındaki olmadı, her seferinde kendi geri tepmesi oldu.",
    en: "Katsuki — the second half of his name. 勝 means “victory”, 己 means “self”; so the last two characters of 爆豪勝己 in the record can also be read as “victory over the self”. The page's watermark is 爆豪 (explosion + force), but the heart of it is in these two: Bakugō's real opponent was never the person opposite him, it was his own recoil, every time.",
  },
  credit: {
    tr: "Künye, portre, doğum günü, boy, kan grubu, Quirk tanımı ve diğer adlar AniList'ten; portre dosyası depoya indirildi (hotlink yok). Ultimate Move adları ve グレネードブレス künyede geçmiyor, serinin kendisinden alındı ve kartlarında kaynağı yazılı. Sayfadaki bütün grafikler — patlama poligonu, uyarı bandı, şok dalgası halkaları, avuç işareti — elle çizilmiş SVG ve CSS.",
    en: "Dossier, portrait, birthday, height, blood type, Quirk description and alternative names from AniList; the portrait file was downloaded into the repository (no hotlinking). The Ultimate Move names and グレネードブレス do not appear in the record and were taken from the series itself, with their source stated on their cards. Every graphic on this page — the detonation polygon, the hazard band, the shockwave rings, the palm mark — is hand-drawn SVG and CSS.",
  },
  creditLink: {
    tr: "AniList · Katsuki Bakugou #88892",
    en: "AniList · Katsuki Bakugou #88892",
  },
} as const;

/* ── Küratör boşluk özeti ───────────────────────────────────────────────── */

export const BAKUGO_GAPS = {
  title: {
    tr: "Katsuki Bakugō — görsel yuvaları",
    en: "Katsuki Bakugō — image slots",
  },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bütün yuvalar dolu. Sayfada eksik kadraj kalmadı.",
    en: "Every slot is filled. No frame on this page is missing.",
  },
} as const;
