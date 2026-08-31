import type { LocalizedText } from "./types";

/**
 * Yūta Okkotsu (乙骨憂太) — "Renk Taşması" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Sahne görselleri veritabanında — characterId 129571 kaydının ABILITY
 * yuvaları, `yut:*` anahtarlarıyla.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * Sayfa MONOKROM. Tek renk bölgesi sağ kenardaki dar şerit ve o şerit
 * Rika'nın. Yūta başkalarının tekniklerini kopyalıyor; kullanıcı bir tekniği
 * desteye aldıkça şeritteki çentikler doluyor ve renk şeritten sayfaya
 * SIZIYOR. Toplama tek yönlü değil: her kart geri verilebilir, renk geri
 * çekilir.
 *
 * ⚠️ Monokrom bir FİLTREYLE kurulmadı. `filter: grayscale()` hem metnin
 * okunabilirliğini hem küratörün yüklediği görselin gerçek rengini bozardı
 * (küratör gri gördüğü kareyi yanlış değerlendirir). Bunun yerine paletin
 * NÖTR ailesi (`--text-*`, `--gold: #858585`, `--border*`, `--surface*`)
 * sayfanın tamamını taşıyor ve `--accent` ailesi YALNIZCA Rika'nın
 * bulunduğu yerlerde, `--yut-spread` katsayısıyla açılıyor. Yani "monokrom"
 * bir efekt değil, bir KULLANIM kararı.
 *
 * ⚠️ Eski Getō'nun haznesiyle karıştırılmasın: orada tek yönlü bir kap var
 * (al · biriktir · bir kere boşalt). Burada kapasite yok, boşaltma yok,
 * sıra yok — altı kaynağın her biri bağımsızca alınıp GERİ VERİLEBİLİYOR ve
 * görsel sonuç bir göstergenin dolması değil, rengin sayfaya yayılması.
 * Dalga 5'in "dallanan ihanet yolu"yla da ilgisi yok: burada dal yok, yol
 * yok, seçim geri alınamaz değil.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (7 Mart 2001), yaş işareti ("16-17"), tür (İnsan), derece
 * (Özel Derece Büyücü), okul (Jujutsu Lisesi) ve meslek satırları AniList
 * künyesinden birebir alındı (karakter 129571, depodaki
 * `public/assets/anime/karakterler/yuuta-okkotsu/kaynak.json`).
 *
 * ⚠️ KAN GRUBU YOK. `kanGrubu` alanı `null`. Künye şeridinde uydurulmadı;
 * satır "kayıtlı değil" diyerek duruyor.
 * ⚠️ BOY YOK. AniList açıklamasında boy geçmiyor; o satır da boş bırakıldı.
 *
 * ── REPLİK VE JAPONCA DİSİPLİNİ ──────────────────────────────────────────
 * Sayfada Japonca olarak YALNIZCA emin olunan diziler var:
 *   · Terminoloji — 呪術 / 呪力 / 術式 / 領域展開 / 呪霊 / 呪具 / 反転術式 /
 *     束縛 (dalga brief'inin verdiği liste), 呪言 (Inumaki'nin tekniği),
 *     特級 · 特級呪術師 (derece), 呪術高専 (okulun kısa adı).
 *   · Adlar — 乙骨憂太, 里香, 五条悟, 夏油傑, 禪院真希, パンダ.
 *   · TEK replik — 「愛ほど歪んだ呪いはない」 (Gojō, Jujutsu Kaisen 0).
 *     Sahnede cümlenin sonuna ek geliyor ve iki farklı yazım dolaşımda;
 *     bu yüzden yalnızca ORTAK ÇEKİRDEK tırnağa alındı ve künyesinde
 *     bu not duruyor.
 *
 * Kapanıştaki iki replik BİREBİR İFADE DEĞİL, arşivin sahne kaydı — ve
 * künyelerinde bu açıkça yazıyor. Orijinal ifadesinden emin olunmayan
 * hiçbir cümle Japonca yazılmadı (görev şartı). Aynı sebeple Rika'nın soyadı
 * ve Inumaki'nin adı kanjisiz duruyor: romanizasyonları biliniyor, yazımları
 * bu arşivde doğrulanmadı.
 *
 * ── NE YAZILMADI ─────────────────────────────────────────────────────────
 * Yūta'nın alan genişletmesine ad verilmedi. `領域展開` kartı terimin
 * kendisini ve bir AYRIMI anlatıyor (Rika'nın tam tezahürü bir alan
 * DEĞİLDİR); uydurma bir teknik adı yazmaktansa kart boş bilgiyle değil,
 * doğru bir ayrımla ayakta duruyor.
 */

export const YUUTA_ID = 129571;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const YUUTA_SITE_URL = "https://anilist.co/character/129571";

/**
 * Depodaki resmî portre.
 *
 * `kaynak.json` `jpg` diyor ve ölçüyü de veriyor: 230×345. Bu kare tam
 * kanama bir hero için KÜÇÜK — sayfada yalnızca hero'nun madalyonunda,
 * yüzük halkasının içinde duruyor. Büyük hero kadrajı küratör yuvası olarak
 * boş bırakıldı (`yut:hero`).
 */
export const YUUTA_PORTRAIT = {
  src: "/assets/anime/karakterler/yuuta-okkotsu/anilist-portrait.jpg",
  w: 230,
  h: 345,
} as const;

/**
 * Sergi görselleri — hepsi characterId 129571 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `yut:` önekli (küratör modu şartı).
 */
export const YUUTA_IMAGE_KEYS = {
  hero: "yut:hero",
  rika: "yut:rika",
  copy: "yut:copy",
  queen: "yut:queen",
  reserve: "yut:reserve",
  domain: "yut:domain",
  reverse: "yut:reverse",
  tool: "yut:tool",
  vow: "yut:vow",
  deck: "yut:deck",
  promise: "yut:promise",
  accident: "yut:accident",
  school: "yut:school",
  geto: "yut:geto",
  order: "yut:order",
  closing: "yut:closing",
} as const;

/** Küratör yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const YUUTA_SLOT_LABELS: Record<string, LocalizedText> = {
  [YUUTA_IMAGE_KEYS.hero]: {
    tr: "Hero — büyük dikey kare, tören havası; renk yalnızca sağ kenarda (3:4)",
    en: "Hero — large vertical frame, ceremonial; colour only along the right edge (3:4)",
  },
  [YUUTA_IMAGE_KEYS.rika]: {
    tr: "Rika — özel derece lanetli ruh, tam tezahür; tek renkli kare (dikey)",
    en: "Rika — special grade cursed spirit, full manifestation; the one coloured frame (portrait)",
  },
  [YUUTA_IMAGE_KEYS.copy]: {
    tr: "Kopyalama — gördüğü tekniği tekrarladığı an (yatay)",
    en: "Copying — the moment he repeats a technique he has seen (landscape)",
  },
  [YUUTA_IMAGE_KEYS.queen]: {
    tr: "Kraliçe — Rika'nın açılmış hâli, Yūta'nın arkasında (yatay)",
    en: "The Queen — Rika unfolded, standing behind Yuuta (landscape)",
  },
  [YUUTA_IMAGE_KEYS.reserve]: {
    tr: "Lanet enerjisi — çıkışın görünür olduğu kare, hava bozuluyor (yatay)",
    en: "Cursed energy — a frame where the output is visible, the air distorting (landscape)",
  },
  [YUUTA_IMAGE_KEYS.domain]: {
    tr: "Alan genişletme — terimin kendisi: kapanan alan (kare)",
    en: "Domain expansion — the term itself: the closing domain (square)",
  },
  [YUUTA_IMAGE_KEYS.reverse]: {
    tr: "Ters lanet tekniği — kapanan yara, elin üstünde (kare)",
    en: "Reverse cursed technique — a wound closing under a hand (square)",
  },
  [YUUTA_IMAGE_KEYS.tool]: {
    tr: "Lanetli alet — kılıç; kabza ve ağız, yakın çekim (kare)",
    en: "Cursed tool — the sword; grip and edge, close crop (square)",
  },
  [YUUTA_IMAGE_KEYS.vow]: {
    tr: "Bağlayıcı söz — verilen sözün anı, iki el (kare)",
    en: "Binding vow — the moment the vow is made, two hands (square)",
  },
  [YUUTA_IMAGE_KEYS.deck]: {
    tr: "Kopyalanan teknikler — Yūta başkasının tekniğini kullanırken (yatay)",
    en: "Copied techniques — Yuuta using someone else's technique (landscape)",
  },
  [YUUTA_IMAGE_KEYS.promise]: {
    tr: "Söz — çocukluk, yüzüğün verildiği an (yatay)",
    en: "The promise — childhood, the moment the ring is given (landscape)",
  },
  [YUUTA_IMAGE_KEYS.accident]: {
    tr: "Kaza — Rika'nın öldüğü gün; kalabalık ya da yol (yatay)",
    en: "The accident — the day Rika died; the crowd or the road (landscape)",
  },
  [YUUTA_IMAGE_KEYS.school]: {
    tr: "Okul — Gojō ile ilk karşılaşma, Jujutsu Lisesi'nin kapısı (yatay)",
    en: "The school — the first meeting with Gojou, the gate of Jujutsu High (landscape)",
  },
  [YUUTA_IMAGE_KEYS.geto]: {
    tr: "Getō — karşı karşıya duran iki büyücü (yatay)",
    en: "Getou — two sorcerers facing each other (landscape)",
  },
  [YUUTA_IMAGE_KEYS.order]: {
    tr: "Emir — mühürden sonra Yūta'ya verilen görev; tek figür (yatay)",
    en: "The order — the task given to Yuuta after the sealing; a single figure (landscape)",
  },
  [YUUTA_IMAGE_KEYS.closing]: {
    tr: "Kapanış — geniş bant; monokrom sahnede tek renk noktası (16:9)",
    en: "Closing — wide band; a single point of colour in a monochrome scene (16:9)",
  },
};

/** Küratör kareyi bu ölçüde hazırlasın — `CuratorUpload` oranı kendi yazıyor. */
export const YUUTA_SLOT_SIZES: Record<string, { w: number; h: number }> = {
  [YUUTA_IMAGE_KEYS.hero]: { w: 1200, h: 1600 },
  [YUUTA_IMAGE_KEYS.rika]: { w: 900, h: 1350 },
  [YUUTA_IMAGE_KEYS.copy]: { w: 900, h: 600 },
  [YUUTA_IMAGE_KEYS.queen]: { w: 900, h: 600 },
  [YUUTA_IMAGE_KEYS.reserve]: { w: 900, h: 600 },
  [YUUTA_IMAGE_KEYS.domain]: { w: 600, h: 600 },
  [YUUTA_IMAGE_KEYS.reverse]: { w: 600, h: 600 },
  [YUUTA_IMAGE_KEYS.tool]: { w: 600, h: 600 },
  [YUUTA_IMAGE_KEYS.vow]: { w: 600, h: 600 },
  [YUUTA_IMAGE_KEYS.deck]: { w: 1100, h: 620 },
  [YUUTA_IMAGE_KEYS.promise]: { w: 900, h: 560 },
  [YUUTA_IMAGE_KEYS.accident]: { w: 900, h: 560 },
  [YUUTA_IMAGE_KEYS.school]: { w: 900, h: 560 },
  [YUUTA_IMAGE_KEYS.geto]: { w: 900, h: 560 },
  [YUUTA_IMAGE_KEYS.order]: { w: 900, h: 560 },
  [YUUTA_IMAGE_KEYS.closing]: { w: 1600, h: 900 },
};

/** `CuratorGaps` satırlarının "beklenen kare" sütunu. */
export const YUUTA_SLOT_SPECS: Record<string, LocalizedText> = {
  [YUUTA_IMAGE_KEYS.hero]: {
    tr: "dikey kadraj · 1200×1600 · webp",
    en: "vertical frame · 1200×1600 · webp",
  },
  [YUUTA_IMAGE_KEYS.rika]: {
    tr: "dikey kadraj · 900×1350 · webp",
    en: "vertical frame · 900×1350 · webp",
  },
  [YUUTA_IMAGE_KEYS.copy]: {
    tr: "yatay sahne · 900×600 · webp",
    en: "landscape scene · 900×600 · webp",
  },
  [YUUTA_IMAGE_KEYS.queen]: {
    tr: "yatay sahne · 900×600 · webp",
    en: "landscape scene · 900×600 · webp",
  },
  [YUUTA_IMAGE_KEYS.reserve]: {
    tr: "yatay sahne · 900×600 · webp",
    en: "landscape scene · 900×600 · webp",
  },
  [YUUTA_IMAGE_KEYS.domain]: {
    tr: "kare rozet · 600×600 · webp",
    en: "square badge · 600×600 · webp",
  },
  [YUUTA_IMAGE_KEYS.reverse]: {
    tr: "kare rozet · 600×600 · webp",
    en: "square badge · 600×600 · webp",
  },
  [YUUTA_IMAGE_KEYS.tool]: {
    tr: "kare rozet · 600×600 · webp",
    en: "square badge · 600×600 · webp",
  },
  [YUUTA_IMAGE_KEYS.vow]: {
    tr: "kare rozet · 600×600 · webp",
    en: "square badge · 600×600 · webp",
  },
  [YUUTA_IMAGE_KEYS.deck]: {
    tr: "geniş sahne · 1100×620 · webp",
    en: "wide scene · 1100×620 · webp",
  },
  [YUUTA_IMAGE_KEYS.promise]: {
    tr: "yatay sahne · 900×560 · webp",
    en: "landscape scene · 900×560 · webp",
  },
  [YUUTA_IMAGE_KEYS.accident]: {
    tr: "yatay sahne · 900×560 · webp",
    en: "landscape scene · 900×560 · webp",
  },
  [YUUTA_IMAGE_KEYS.school]: {
    tr: "yatay sahne · 900×560 · webp",
    en: "landscape scene · 900×560 · webp",
  },
  [YUUTA_IMAGE_KEYS.geto]: {
    tr: "yatay sahne · 900×560 · webp",
    en: "landscape scene · 900×560 · webp",
  },
  [YUUTA_IMAGE_KEYS.order]: {
    tr: "yatay sahne · 900×560 · webp",
    en: "landscape scene · 900×560 · webp",
  },
  [YUUTA_IMAGE_KEYS.closing]: {
    tr: "geniş bant · 1600×900 · webp",
    en: "wide band · 1600×900 · webp",
  },
};

/** `CuratorGaps` satır sırası — sayfadaki okuma sırasıyla aynı. */
export const YUUTA_GAP_ORDER: readonly string[] = [
  YUUTA_IMAGE_KEYS.hero,
  YUUTA_IMAGE_KEYS.rika,
  YUUTA_IMAGE_KEYS.copy,
  YUUTA_IMAGE_KEYS.queen,
  YUUTA_IMAGE_KEYS.reserve,
  YUUTA_IMAGE_KEYS.domain,
  YUUTA_IMAGE_KEYS.reverse,
  YUUTA_IMAGE_KEYS.tool,
  YUUTA_IMAGE_KEYS.vow,
  YUUTA_IMAGE_KEYS.deck,
  YUUTA_IMAGE_KEYS.promise,
  YUUTA_IMAGE_KEYS.accident,
  YUUTA_IMAGE_KEYS.school,
  YUUTA_IMAGE_KEYS.geto,
  YUUTA_IMAGE_KEYS.order,
  YUUTA_IMAGE_KEYS.closing,
];

export const YUUTA_GAPS = {
  title: { tr: "Boş yuvalar", en: "Empty slots" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bu sayfadaki bütün kadrajlar dolu.",
    en: "Every frame on this page is filled.",
  },
} as const;

export const YUUTA_CRUMB = {
  series: { tr: "Jujutsu Kaisen", en: "Jujutsu Kaisen" },
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   1 · KİMLİK VE HERO
   ══════════════════════════════════════════════════════════════════════════ */

export const YUUTA_IDENTITY = {
  name: "Yuuta Okkotsu",
  nativeName: "乙骨憂太",
  /** Filigranın kanjisi — Rika, brief'te kilitli */
  watermark: "里香",
  grade: { tr: "ÖZEL DERECE BÜYÜCÜ", en: "SPECIAL GRADE SORCERER" },
  gradeNative: "特級呪術師",
  school: { tr: "Tokyo Jujutsu Lisesi", en: "Tokyo Jujutsu High" },
  schoolNative: "呪術高専",
  epigraph: {
    tr: "Kendisi tek bir şeyi kopyalayamadı: verilen sözü.",
    en: "The one thing he could not copy was the promise he was given.",
  },
} as const;

/**
 * Künye satırları — hepsi `kaynak.json`dan.
 *
 * İki satır BİLEREK "kayıtlı değil" diyor: AniList kaydında kan grubu boş
 * (`kanGrubu: null`) ve açıklamada boy geçmiyor. Uydurulmadı.
 */
export const YUUTA_FACTS: readonly { label: LocalizedText; value: LocalizedText }[] = [
  {
    label: { tr: "Doğum", en: "Born" },
    value: { tr: "7 Mart 2001", en: "7 March 2001" },
  },
  {
    label: { tr: "Yaş", en: "Age" },
    value: { tr: "16–17", en: "16–17" },
  },
  {
    label: { tr: "Tür", en: "Species" },
    value: { tr: "İnsan", en: "Human" },
  },
  {
    label: { tr: "Derece", en: "Grade" },
    value: {
      tr: "Özel derece büyücü · 特級呪術師",
      en: "Special grade sorcerer · 特級呪術師",
    },
  },
  {
    label: { tr: "Okul", en: "School" },
    value: {
      tr: "Tokyo Jujutsu Lisesi · 呪術高専",
      en: "Tokyo Jujutsu High · 呪術高専",
    },
  },
  {
    label: { tr: "Uğraş", en: "Occupation" },
    value: { tr: "Büyücü, öğrenci", en: "Sorcerer, student" },
  },
  {
    label: { tr: "Boy", en: "Height" },
    value: { tr: "kayıtlı değil", en: "not recorded" },
  },
  {
    label: { tr: "Kan grubu", en: "Blood type" },
    value: { tr: "kayıtlı değil", en: "not recorded" },
  },
  {
    label: { tr: "Sembolik obje", en: "Symbolic object" },
    value: {
      tr: "Yüzük — Rika'nın verdiği",
      en: "A ring — the one Rika gave him",
    },
  },
];

export const YUUTA_MISSING_NOTE = {
  tr: "Boy ve kan grubu AniList kaydında yok. Bu iki satır boş bırakıldı; sayfada hiçbir sayı türetilmedi.",
  en: "Height and blood type are absent from the AniList record. Both rows are left empty; no figure on this page is inferred.",
} as const;

export const YUUTA_HERO = {
  lede: {
    tr: "Sayfa tek renk taşıyor ve o renk Yūta'nın değil. Sağ kenardaki dar şerit Rika'ya ait; sayfanın geri kalanı, kopyalanacak bir şey bulunana kadar gri kalıyor.",
    en: "This page carries a single colour and it does not belong to Yuuta. The narrow strip along the right edge is Rika's; the rest stays grey until there is something to copy.",
  },
  portraitAlt: {
    tr: "Yūta Okkotsu — AniList resmî portresi (230×345)",
    en: "Yuuta Okkotsu — official AniList portrait (230×345)",
  },
  portraitAltUploaded: {
    tr: "Yūta Okkotsu — küratör tarafından yüklenen portre",
    en: "Yuuta Okkotsu — portrait uploaded by the curator",
  },
  frameNote: {
    tr: "Bu kadraj boş: hero karesi yüklenmedi.",
    en: "This frame is empty: the hero image has not been uploaded.",
  },
  ringLabel: {
    tr: "Rika'nın verdiği yüzük — sayfanın filigranı",
    en: "The ring Rika gave him — the page's watermark",
  },
  railLabel: {
    tr: "Rika'nın şeridi — sayfanın tek renkli bölgesi",
    en: "Rika's strip — the one coloured region on this page",
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   2 · MOD DÜĞMESİ — "RİKA"
   ⚠️ Düğme ŞERİDİ YARATMIYOR, DOLDURUYOR (Onizuka dersi: mod düğmesi
   yapıyı açıp kapatmaz, derecesini değiştirir). Şerit her iki durumda da
   sayfada; `alone` hâlinde altı çentiği boş bir kontur olarak duruyor.
   ══════════════════════════════════════════════════════════════════════════ */

export const YUUTA_MODE = {
  title: { tr: "Rika", en: "Rika" },
  titleNative: "里香",
  lede: {
    tr: "Tek düğme. Kapalıyken Yūta yalnız: sayfa baştan sona gri ve sağ şerit boş bir kontur. Açıkken Rika şeride giriyor, renk sayfaya sızıyor ve üç okuma yükseliyor. Deste ne kadar doluysa sızıntı o kadar ileri gidiyor.",
    en: "One switch. Off, Yuuta is alone: the page is grey end to end and the right strip is an empty outline. On, Rika enters the strip, colour seeps into the page and three readings rise. The fuller the deck, the further the seepage travels.",
  },
  enter: { tr: "Rika'yı çağır", en: "Call Rika" },
  exit: { tr: "Rika'yı bırak", en: "Let Rika go" },
  stateLabel: { tr: "Durum", en: "State" },
  stateAlone: { tr: "YALNIZ", en: "ALONE" },
  stateBound: { tr: "BAĞLI", en: "BOUND" },
  hintAlone: {
    tr: "Sayfa monokrom. Sağ şerit yerinde duruyor ama boş: altı çentik, hiçbiri dolu değil.",
    en: "The page is monochrome. The right strip is in place but empty: six notches, none of them filled.",
  },
  hintBound: {
    tr: "Şerit doldu. Renk sağ kenardan sola doğru ilerliyor; destedeki her teknik onu biraz daha içeri taşıyor.",
    en: "The strip has filled. Colour advances from the right edge leftward; every technique in the deck carries it a little further in.",
  },
  readingsTitle: { tr: "Üç okuma", en: "Three readings" },
  readingsNote: {
    tr: "Bu üç çubuk arşivin kendi ölçeği (0–10). Kaynakta Yūta için sayısal bir değer yok; çubuklar bir ölçüm değil, düğmenin neyi değiştirdiğini gösteren bir okuma.",
    en: "These three bars are the archive's own scale (0–10). The source records no numeric value for Yuuta; the bars are a reading of what the switch changes, not a measurement.",
  },
} as const;

/**
 * Mod düğmesiyle yükselen okumalar.
 *
 * `base` yalnızken, `base + lift` bağlıyken. Ondalık yok: çubuk genişliği
 * `(base + lift × yayılım) × 10%` olarak hesaplanıyor.
 */
export const YUUTA_READINGS: readonly {
  key: string;
  kanji: string;
  label: LocalizedText;
  note: LocalizedText;
  base: number;
  lift: number;
}[] = [
  {
    key: "energy",
    kanji: "呪力",
    label: { tr: "Lanet enerjisi çıkışı", en: "Cursed energy output" },
    note: {
      tr: "Yalnızken bile yüksek; Rika bağlıyken ölçeğin tepesine oturuyor.",
      en: "High even alone; with Rika bound it sits at the top of the scale.",
    },
    base: 4,
    lift: 6,
  },
  {
    key: "rika",
    kanji: "呪霊",
    label: { tr: "Rika'nın tezahürü", en: "Rika's manifestation" },
    note: {
      tr: "Bu satır düğmenin kendisi: yalnızken sıfır, bağlıyken tam.",
      en: "This row is the switch itself: zero alone, full when bound.",
    },
    base: 0,
    lift: 10,
  },
  {
    key: "reverse",
    kanji: "反転術式",
    label: { tr: "Ters lanet tekniğiyle onarım", en: "Repair by reverse cursed technique" },
    note: {
      tr: "Enerji arttıkça kapanan yara da büyüyor; ikisi aynı kaynaktan besleniyor.",
      en: "As the energy rises so does the wound that can be closed; both draw on the same source.",
    },
    base: 3,
    lift: 5,
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   3 · BÖLÜM BAŞLIKLARI
   ══════════════════════════════════════════════════════════════════════════ */

export const YUUTA_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "Record" },
    lede: {
      tr: "Dokuz satır; ikisi bilerek boş. AniList kaydı ne diyorsa o yazılı.",
      en: "Nine rows, two of them deliberately empty. What the AniList record says is what is written.",
    },
  },
  lab: {
    title: { tr: "Lanet laboratuvarı", en: "Curse laboratory" },
    lede: {
      tr: "Üç büyük kart Yūta'nın taşıdığı üç şeyi anlatıyor: kendi tekniği, ona bağlı olan ruh ve elindeki enerji. Dört küçük kart jujutsu'nun kendi terimleri.",
      en: "Three large cards for the three things Yuuta carries: his own technique, the spirit bound to him, and the energy in his hands. Four small cards for jujutsu's own terms.",
    },
    majorLabel: { tr: "Üç büyük", en: "The three" },
    minorLabel: { tr: "Dört terim", en: "Four terms" },
  },
  deck: {
    title: { tr: "Kopyalanan teknikler", en: "Copied techniques" },
    lede: {
      tr: "Yūta gördüğü tekniği tekrarlayabiliyor. Aşağıdaki altı kaynağı desteye al ya da geri ver: deste büyüdükçe sağ şeritteki çentikler doluyor ve renk sayfanın içine doğru ilerliyor. Hiçbiri kalıcı değil — her kart geri verilebilir.",
      en: "Yuuta can repeat a technique he has seen. Take the six sources below into the deck or give them back: as the deck grows, the notches on the right strip fill and the colour advances into the page. Nothing here is permanent — every card can be given back.",
    },
  },
  timeline: {
    title: { tr: "Kader çizelgesi", en: "The line of his fate" },
    lede: {
      tr: "Beş durak. Yaş etiketleri AniList'in yaş aralığına ve serinin kendi anlatısına dayanıyor; ara yıllar türetilmedi.",
      en: "Five stops. The age labels rest on the AniList age range and the series' own account; no intermediate years were inferred.",
    },
  },
  bonds: {
    title: { tr: "Bağlar", en: "Bonds" },
    lede: {
      tr: "Dördünün arşivde kendi dosyası var ve kartları oraya açılıyor. İki ad bağlantısız: numaraları bu arşivde kayıtlı değil.",
      en: "Four of these have their own files in the archive and their cards open onto them. Two names carry no link: their ids are not recorded in this archive.",
    },
    unlistedLabel: {
      tr: "Arşivde dosyası olmayanlar",
      en: "Names without a file in the archive",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "İki sahne kaydı, bir unvan ve kaynağın künyesi.",
      en: "Two scene records, one title, and the source credit.",
    },
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   4 · LANET LABORATUVARI — 3 BÜYÜK + 4 KÜÇÜK
   Terminoloji dalga brief'inin verdiği listeden: 術式 · 領域展開 ·
   反転術式 · 呪具 · 束縛. Naruto/Bleach terimi yok.
   ══════════════════════════════════════════════════════════════════════════ */

export interface YuutaCard {
  key: string;
  /** Japonca terim — yalnızca emin olunanlar */
  kanji: string;
  /** Romanizasyon; `aria-hidden`, ekran okuyucuya iki kez okunmasın */
  reading: string;
  turkish: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
  imageKey: string;
}

export const YUUTA_LAB_MAJOR: readonly YuutaCard[] = [
  {
    key: "copy",
    kanji: "術式",
    reading: "jutsushiki",
    turkish: { tr: "Lanetli teknik: kopyalama", en: "Cursed technique: copying" },
    tagline: {
      tr: "Kendine ait olan tek şey, başkasınınkini alabilmek",
      en: "The only thing that is his own is the ability to take what is not",
    },
    text: {
      tr: "Yūta'nın doğuştan gelen tekniği bir saldırı değil bir tekrar: gördüğü lanetli tekniği taklit edebiliyor. Bu yüzden sayfası da tek bir renge sahip değil — hangi renk gelirse onu taşıyor.",
      en: "Yuuta's innate technique is not an attack but a repetition: he can imitate a cursed technique he has seen. Which is why his page has no colour of its own — it carries whichever colour arrives.",
    },
    traits: [
      { tr: "Gördüğünü tekrarlar", en: "Repeats what he sees" },
      { tr: "Kendi imzası yok", en: "No signature of its own" },
    ],
    imageKey: YUUTA_IMAGE_KEYS.copy,
  },
  {
    key: "queen",
    kanji: "呪霊",
    reading: "jurei",
    turkish: { tr: "Lanetli ruh: Rika — «Kraliçe»", en: "Cursed spirit: Rika — “the Queen”" },
    tagline: {
      tr: "Özel derece; Yūta'ya bağlı ve yalnızca ona",
      en: "Special grade; bound to Yuuta and to no one else",
    },
    text: {
      tr: "Çocukluk arkadaşı Rika Orimoto öldükten sonra Yūta'ya bağlandı ve özel derece bir lanetli ruh oldu. Yıllarca herkes bunu Rika'nın laneti sandı; sayfanın sonundaki ayrım tam olarak burada.",
      en: "After his childhood friend Rika Orimoto died she became bound to Yuuta and turned into a special grade cursed spirit. For years everyone took this for Rika's curse; the distinction at the end of this page is exactly here.",
    },
    traits: [
      { tr: "Özel derece · 特級", en: "Special grade · 特級" },
      { tr: "Yūta'nın deposu", en: "Yuuta's reservoir" },
    ],
    imageKey: YUUTA_IMAGE_KEYS.queen,
  },
  {
    key: "reserve",
    kanji: "呪力",
    reading: "juryoku",
    turkish: { tr: "Lanet enerjisi rezervi", en: "Cursed energy reserve" },
    tagline: {
      tr: "Teknik değil miktar — ve miktarın kendisi bir silah",
      en: "Not technique but quantity — and the quantity itself is a weapon",
    },
    text: {
      tr: "Yūta'yı özel dereceye taşıyan ikinci şey teknik değil hacim: elindeki lanet enerjisi ölçünün dışında. Kopyalama o hacmi kullanacak bir biçim buluyor, Rika ise onu besliyor.",
      en: "The second thing that carries Yuuta to special grade is not technique but volume: the cursed energy in his hands is off the scale. Copying finds a shape to spend it in; Rika keeps it fed.",
    },
    traits: [
      { tr: "Ölçünün dışında", en: "Off the scale" },
      { tr: "Kopyalamanın yakıtı", en: "The fuel that copying burns" },
    ],
    imageKey: YUUTA_IMAGE_KEYS.reserve,
  },
];

export const YUUTA_LAB_MINOR: readonly YuutaCard[] = [
  {
    key: "domain",
    kanji: "領域展開",
    reading: "ryouiki tenkai",
    turkish: { tr: "Alan genişletme", en: "Domain expansion" },
    tagline: {
      tr: "Bir ayrım kartı",
      en: "A card that draws a distinction",
    },
    text: {
      tr: "Alan genişletme, büyücünün kendi lanetli tekniğini bir mekâna çevirmesi. Rika'nın tam tezahürü bunun yerine geçmiyor: o bir alan değil, bağlı bir ruhun açılması. Bu arşiv Yūta'nın alanına ad vermiyor — emin olunmayan bir teknik adı yazılmadı.",
      en: "A domain expansion turns a sorcerer's own cursed technique into a place. Rika's full manifestation is not that: it is not a domain but a bound spirit unfolding. This archive gives no name to Yuuta's domain — an uncertain technique name was not written.",
    },
    traits: [{ tr: "Ad yazılmadı", en: "No name written" }],
    imageKey: YUUTA_IMAGE_KEYS.domain,
  },
  {
    key: "reverse",
    kanji: "反転術式",
    reading: "hanten jutsushiki",
    turkish: { tr: "Ters lanet tekniği", en: "Reverse cursed technique" },
    tagline: { tr: "Negatifi negatifle çarpmak", en: "Multiplying a negative by a negative" },
    text: {
      tr: "Lanet enerjisini tersine çevirip iyileştirmeye dönüştürmek. Yūta bunu hem kendisi hem başkası için kullanabiliyor; rezerv büyük olduğu için onarım da büyük.",
      en: "Turning cursed energy inside out and making it heal. Yuuta can use it on himself and on others; because the reserve is large, so is the repair.",
    },
    traits: [{ tr: "Onarım", en: "Repair" }],
    imageKey: YUUTA_IMAGE_KEYS.reverse,
  },
  {
    key: "tool",
    kanji: "呪具",
    reading: "jugu",
    turkish: { tr: "Lanetli alet", en: "Cursed tool" },
    tagline: { tr: "Kılıç bir kanal", en: "The sword is a conduit" },
    text: {
      tr: "Yūta bir kılıçla dövüşüyor. Alet tek başına bir güç değil, taşıdığı enerjinin biçimi: rezerv çelikten geçince ölçülebilir bir şeye dönüşüyor.",
      en: "Yuuta fights with a sword. The tool is not a power in itself but a shape for the energy it carries: once the reserve passes through steel it becomes something measurable.",
    },
    traits: [{ tr: "Kılıç", en: "Sword" }],
    imageKey: YUUTA_IMAGE_KEYS.tool,
  },
  {
    key: "vow",
    kanji: "束縛",
    reading: "sokubaku",
    turkish: { tr: "Bağlayıcı söz", en: "Binding vow" },
    tagline: { tr: "Verilen sözün karşılığı güç", en: "A promise given, power received" },
    text: {
      tr: "Jujutsu'da bir söz gerçekten bağlar: vazgeçilen şeyin karşılığında güç gelir. Yūta'nın hikâyesi bir çocukluk sözüyle başlıyor ve o söz hiçbir zaman iptal edilmiyor.",
      en: "In jujutsu a vow genuinely binds: what is given up returns as power. Yuuta's story begins with a childhood promise, and that promise is never revoked.",
    },
    traits: [{ tr: "Söz", en: "Vow" }],
    imageKey: YUUTA_IMAGE_KEYS.vow,
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   5 · SAYFANIN KALBİ — KOPYALANAN TEKNİKLER DESTESİ
   ⚠️ Getō'nun haznesinden ayrımı: kapasite yok, boşaltma yok, sıra yok.
   Altı kaynağın her biri bağımsız ve GERİ VERİLEBİLİR; görsel sonuç bir
   göstergenin dolması değil, rengin sayfaya yayılması.
   ⚠️ Renk tek başına bilgi taşımıyor: her kartın üstünde DESTEDE / DIŞARIDA
   rozeti var, destenin içeriği ayrı bir listede adlarıyla yazılıyor ve her
   değişiklik `aria-live` ile duyuruluyor.
   ══════════════════════════════════════════════════════════════════════════ */

export type YuutaOrigin = "copy" | "learned" | "own" | "given";

export interface YuutaDeckCard {
  key: string;
  kanji: string;
  reading: string;
  name: LocalizedText;
  origin: YuutaOrigin;
  /** Nereden geldiği — kopyaysa kimden */
  source: LocalizedText;
  note: LocalizedText;
}

export const YUUTA_ORIGIN_LABELS: Record<YuutaOrigin, LocalizedText> = {
  copy: { tr: "KOPYA", en: "COPIED" },
  learned: { tr: "ÖĞRENİLEN", en: "LEARNED" },
  own: { tr: "KENDİ", en: "HIS OWN" },
  given: { tr: "VERİLEN", en: "GIVEN" },
};

export const YUUTA_DECK: readonly YuutaDeckCard[] = [
  {
    key: "speech",
    kanji: "呪言",
    reading: "jugon",
    name: { tr: "Lanetli söz", en: "Cursed speech" },
    origin: "copy",
    source: { tr: "Toge Inumaki — sınıf arkadaşı", en: "Toge Inumaki — classmate" },
    note: {
      tr: "Söylenen sözün emre dönüştüğü teknik. Yūta bunu sınıf arkadaşından kopyalıyor; destedeki en açık kopya bu.",
      en: "The technique in which a spoken word becomes a command. Yuuta copies this from his classmate; it is the clearest copy in the deck.",
    },
  },
  {
    key: "reverse",
    kanji: "反転術式",
    reading: "hanten jutsushiki",
    name: { tr: "Ters lanet tekniği", en: "Reverse cursed technique" },
    origin: "learned",
    source: { tr: "Jujutsu Lisesi — öğretilen", en: "Jujutsu High — taught" },
    note: {
      tr: "Kopyalanan değil öğrenilen bir kullanım: lanet enerjisini iyileştirmeye çevirmek.",
      en: "Not copied but learned: turning cursed energy into healing.",
    },
  },
  {
    key: "tool",
    kanji: "呪具",
    reading: "jugu",
    name: { tr: "Lanetli alet", en: "Cursed tool" },
    origin: "learned",
    source: { tr: "Okulun deposu — kılıç", en: "The school's armoury — a sword" },
    note: {
      tr: "Alet kopyalanmıyor, kuşanılıyor. Yūta'nın elinde kılıç bir kanal: rezervi biçime sokuyor.",
      en: "A tool is not copied, it is taken up. In Yuuta's hands the sword is a conduit: it gives the reserve a shape.",
    },
  },
  {
    key: "vow",
    kanji: "束縛",
    reading: "sokubaku",
    name: { tr: "Bağlayıcı söz", en: "Binding vow" },
    origin: "learned",
    source: { tr: "Jujutsu'nun kendi kuralı", en: "Jujutsu's own rule" },
    note: {
      tr: "Vazgeçilen şeyin karşılığı güç. Bu kart destede en pahalı olan: karşılığı her zaman ödeniyor.",
      en: "What is given up comes back as power. This is the costliest card in the deck: the price is always paid.",
    },
  },
  {
    key: "energy",
    kanji: "呪力",
    reading: "juryoku",
    name: { tr: "Lanet enerjisi", en: "Cursed energy" },
    origin: "own",
    source: { tr: "Yūta'nın kendi rezervi", en: "Yuuta's own reserve" },
    note: {
      tr: "Kopya değil: bu zaten onun. Ama destedeki her kartı çalıştıran şey bu, o yüzden burada duruyor.",
      en: "Not a copy: this is already his. But it is what runs every other card in the deck, which is why it stands here.",
    },
  },
  {
    key: "rika",
    kanji: "里香",
    reading: "Rika",
    name: { tr: "Rika", en: "Rika" },
    origin: "given",
    source: { tr: "Rika Orimoto — çocukluk arkadaşı", en: "Rika Orimoto — childhood friend" },
    note: {
      tr: "Destedeki tek alınmayan kart. Rika kopyalanmadı, öğrenilmedi, kazanılmadı — verildi. Sağ şerit de zaten onun.",
      en: "The one card in the deck that was not taken. Rika was not copied, not learned, not earned — she was given. The right strip is hers to begin with.",
    },
  },
];

export const YUUTA_DECK_UI = {
  groupLabel: { tr: "Kopyalanabilir kaynaklar", en: "Sources that can be copied" },
  take: { tr: "Desteye al", en: "Add to deck" },
  drop: { tr: "Geri ver", en: "Give back" },
  inDeck: { tr: "DESTEDE", en: "IN DECK" },
  outDeck: { tr: "DIŞARIDA", en: "OUT" },
  countLabel: { tr: "Deste", en: "Deck" },
  contentsLabel: { tr: "Destedekiler", en: "In the deck" },
  emptyDeck: {
    tr: "Deste boş. Sayfa tamamen gri.",
    en: "The deck is empty. The page is entirely grey.",
  },
  spreadLabel: { tr: "Renk yayılımı", en: "Colour spread" },
  /** `{ad}` ve `{n}` yerine geçiyor — istemci adasında düz dize olarak */
  liveTaken: {
    tr: "{ad} desteye alındı. Destede {n} kaynak var.",
    en: "{ad} added to the deck. The deck holds {n} sources.",
  },
  liveDropped: {
    tr: "{ad} geri verildi. Destede {n} kaynak var.",
    en: "{ad} given back. The deck holds {n} sources.",
  },
  keyboardHint: {
    tr: "Her kart bir düğme: Sekme ile gez, Boşluk ya da Enter ile al veya geri ver. Aynı düğme geri almayı da yapıyor.",
    en: "Every card is a button: Tab between them, Space or Enter to take or give back. The same button also undoes the take.",
  },
  monochromeNote: {
    tr: "Renk burada tek başına bilgi taşımıyor: hangi kaynağın destede olduğu rozetle, adla ve yukarıdaki sayaçla da yazılı. Rika kapalıyken deste yine çalışıyor, yalnızca renk gelmiyor.",
    en: "Colour carries no information on its own here: which source is in the deck is also written as a badge, as a name, and in the counter above. With Rika off the deck still works, only the colour stays away.",
  },
  frameNote: {
    tr: "Bu kadraj boş: kopyalama sahnesi yüklenmedi.",
    en: "This frame is empty: the copying scene has not been uploaded.",
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   6 · KADER ÇİZELGESİ — 5 ADIM
   ⚠️ Tek Japonca replik burada, üçüncü adımda. Sahnede cümlenin sonuna ek
   geliyor ve iki yazım dolaşımda; yalnızca ortak çekirdek tırnağa alındı.
   ══════════════════════════════════════════════════════════════════════════ */

export interface YuutaStep {
  key: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: {
    ja: string;
    reading: string;
    meaning: LocalizedText;
    by: LocalizedText;
    where: LocalizedText;
  };
  imageKey: string;
}

export const YUUTA_TIMELINE: readonly YuutaStep[] = [
  {
    key: "promise",
    age: { tr: "Çocukluk", en: "Childhood" },
    title: { tr: "Yüzük ve söz", en: "The ring and the promise" },
    text: {
      tr: "Yūta ve Rika Orimoto çocukken birbirlerine büyüyünce evlenme sözü veriyor; Rika ona bir yüzük veriyor. Bu sayfanın filigranı o yüzük — çok büyük, çok ince, ve sayfanın hiçbir yerine değmiyor.",
      en: "As children Yuuta and Rika Orimoto promise to marry when they grow up, and Rika gives him a ring. That ring is this page's watermark — very large, very thin, and touching nothing on the page.",
    },
    imageKey: YUUTA_IMAGE_KEYS.promise,
  },
  {
    key: "accident",
    age: { tr: "Çocukluk — kaza", en: "Childhood — the accident" },
    title: { tr: "Rika ölüyor, gitmiyor", en: "Rika dies but does not leave" },
    text: {
      tr: "Rika bir kazada ölüyor. Ölümünden sonra Yūta'ya bağlanıyor ve özel derece bir lanetli ruh hâline geliyor. Yūta bu yüzden yıllarca kendi çevresi için bir tehlike olarak kaydediliyor: yanına gelen zarar görüyor.",
      en: "Rika dies in an accident. After her death she becomes bound to Yuuta and turns into a special grade cursed spirit. For years Yuuta is recorded as a danger to everyone near him: whoever comes close is hurt.",
    },
    imageKey: YUUTA_IMAGE_KEYS.accident,
  },
  {
    key: "school",
    age: { tr: "16 yaş", en: "Age 16" },
    title: { tr: "İnfaz kararı ve Gojō", en: "The execution order and Gojou" },
    text: {
      tr: "Jujutsu dünyası Yūta için gizli bir infaz kararı veriyor. Satoru Gojō araya giriyor, kararı durduruyor ve Yūta'yı Tokyo Jujutsu Lisesi'ne kaydettiriyor. Sınıf arkadaşları Maki Zen'in, Toge Inumaki ve Panda oluyor.",
      en: "The jujutsu world issues a secret execution order for Yuuta. Satoru Gojou steps in, stops it, and enrols him at Tokyo Jujutsu High. His classmates become Maki Zen'in, Toge Inumaki and Panda.",
    },
    quote: {
      ja: "愛ほど歪んだ呪いはない",
      reading: "ai hodo yuganda noroi wa nai",
      meaning: {
        tr: "«Aşktan daha çarpık bir lanet yoktur.»",
        en: "“There is no curse more twisted than love.”",
      },
      by: { tr: "Satoru Gojō", en: "Satoru Gojou" },
      where: {
        tr: "Jujutsu Kaisen 0 — sahnede cümlenin sonuna ek geliyor; burada yalnızca ortak çekirdek yazılı",
        en: "Jujutsu Kaisen 0 — the line carries a sentence-final particle on screen; only the shared core is written here",
      },
    },
    imageKey: YUUTA_IMAGE_KEYS.school,
  },
  {
    key: "geto",
    age: { tr: "16 yaş", en: "Age 16" },
    title: { tr: "Getō ve sözün bedeli", en: "Getou and the price of the vow" },
    text: {
      tr: "Suguru Getō okula saldırıyor ve karşısına Yūta çıkıyor. Yūta Rika'nın tamamını serbest bırakmak için bir bağlayıcı söz veriyor. Karşılaşmanın sonunda Getō ölüyor; öldüren el Gojō'nunki.",
      en: "Suguru Getou attacks the school and Yuuta stands against him. To release the whole of Rika, Yuuta makes a binding vow. Getou dies at the end of the encounter; the hand that kills him is Gojou's.",
    },
    imageKey: YUUTA_IMAGE_KEYS.geto,
  },
  {
    key: "order",
    age: { tr: "16–17 yaş", en: "Age 16–17" },
    title: { tr: "Mühür, sonra emir", en: "The seal, and then the order" },
    text: {
      tr: "Gojō mühürlendikten sonra üst merciler Yūta'ya bir emir veriyor: Yūji Itadori'nin infazı. Yūta bir zamanlar hakkında infaz kararı verilen taraftı; şimdi emri taşıyan taraf.",
      en: "After Gojou is sealed, the higher-ups give Yuuta an order: the execution of Yuuji Itadori. Yuuta was once the one an execution order was written for; now he is the one carrying it.",
    },
    imageKey: YUUTA_IMAGE_KEYS.order,
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   7 · BAĞLAR + KAPANIŞ
   ⚠️ `EXPERIENCE_COMPANIONS[129571]` merkezde şu dört kimlikle yazıldı:
   127691 · 133699 · 134167 · 137974. Bu bölüm TAM olarak o dördünü çiziyor —
   listede olmayan biri çizilseydi kadrajı sonsuza kadar boş kalırdı
   (Dalga 1'de Armin↔Levi emsali). Rika Orimoto ve Toge Inumaki'nin arşivde
   numarası YOK: düz ad olarak, bağlantısız yazılıyorlar.
   ══════════════════════════════════════════════════════════════════════════ */

export interface YuutaBond {
  key: string;
  name: string;
  characterId: number;
  kanji: string;
  role: LocalizedText;
  summary: LocalizedText;
}

export const YUUTA_BONDS: readonly YuutaBond[] = [
  {
    key: "gojou",
    name: "Satoru Gojou",
    characterId: 127691,
    kanji: "五条悟",
    role: { tr: "Ustası", en: "His teacher" },
    summary: {
      tr: "Yūta hakkındaki infaz kararını durduran ve onu Tokyo Jujutsu Lisesi'ne getiren kişi. AniList künyesi de bunu tek cümleyle yazıyor: Gojō ona akıl hocalığı yaptı ve okula kaydettirdi.",
      en: "The person who stopped the execution order on Yuuta and brought him to Tokyo Jujutsu High. The AniList record puts it in one sentence: Gojou mentored him and enrolled him at the school.",
    },
  },
  {
    key: "getou",
    name: "Suguru Getou",
    characterId: 133699,
    kanji: "夏油傑",
    role: { tr: "Karşısına çıkan", en: "The one he faced" },
    summary: {
      tr: "Jujutsu Kaisen 0'da Yūta'nın karşısındaki taraf. Getō lanetli ruhları topluyordu; Yūta ise ona bağlı olan tek ruhla dövüşüyordu — iki ayrı ilişki biçimi, aynı sahnede.",
      en: "The other side in Jujutsu Kaisen 0. Getou collected cursed spirits; Yuuta fought with the single spirit bound to him — two different ways of relating, in the same scene.",
    },
  },
  {
    key: "maki",
    name: "Maki Zen'in",
    characterId: 134167,
    kanji: "禪院真希",
    role: { tr: "Sınıf arkadaşı", en: "Classmate" },
    summary: {
      tr: "Aynı yılın öğrencisi. Maki'nin elinde alet var, lanet enerjisi yok; Yūta'nın elinde ölçünün dışında bir rezerv var. Okul ikisini de aynı sıraya oturttu.",
      en: "A student of the same year. Maki carries tools and no cursed energy; Yuuta carries a reserve that is off the scale. The school seated them side by side.",
    },
  },
  {
    key: "panda",
    name: "Panda",
    characterId: 137974,
    kanji: "パンダ",
    role: { tr: "Sınıf arkadaşı", en: "Classmate" },
    summary: {
      tr: "İkinci sınıfın üçüncü üyesi. Panda insan değil, Yūta'nın yanındaki ruh ölü bir çocuk: bu sınıfın hiçbir üyesi jujutsu dünyasının standart kutularına sığmıyor.",
      en: "The third member of the second year. Panda is not human, and the spirit at Yuuta's side is a dead child: no member of this class fits the jujutsu world's standard boxes.",
    },
  },
];

/** Arşivde numarası olmayan iki ad — bağlantısız, portresiz. */
export const YUUTA_UNLISTED: readonly {
  key: string;
  name: string;
  kanji?: string;
  role: LocalizedText;
  summary: LocalizedText;
}[] = [
  {
    key: "rika",
    name: "Rika Orimoto",
    kanji: "里香",
    role: { tr: "Çocukluk arkadaşı", en: "Childhood friend" },
    summary: {
      tr: "Sayfanın sağ şeridi onun. Kanjisi yalnızca adı: soyadının yazımı bu arşivde doğrulanmadı, o yüzden yazılmadı.",
      en: "The strip on the right of this page is hers. The kanji is her given name only: the spelling of her family name is unverified in this archive, so it is not written.",
    },
  },
  {
    key: "inumaki",
    name: "Toge Inumaki",
    role: { tr: "Sınıf arkadaşı", en: "Classmate" },
    summary: {
      tr: "Lanetli söz (呪言) tekniğinin sahibi; destedeki en açık kopyanın kaynağı. Adının kanjisi bu arşivde doğrulanmadığı için yazılmadı.",
      en: "The owner of the cursed speech technique (呪言); the source of the clearest copy in the deck. The kanji of his name is unverified in this archive, so it is not written.",
    },
  },
];

export const YUUTA_COMPANION_SUFFIX = {
  tr: "— arşiv portresi",
  en: "— archive portrait",
} as const;

export const YUUTA_CLOSING = {
  /**
   * ⚠️ İkisi de BİREBİR İFADE DEĞİL — arşivin sahne kaydı. Japonca
   * yazılmamasının sebebi budur: orijinal ifadelerinden emin olunmadı ve
   * emin olunmayan bir cümleyi tırnağa almak uydurma kanon olurdu.
   */
  records: [
    {
      key: "promise",
      text: {
        tr: "«Büyüyünce evlenelim.» — iki çocuk, bir yüzük ve hiç iptal edilmeyen bir söz.",
        en: "“Let's get married when we grow up.” — two children, a ring, and a promise never revoked.",
      },
      where: {
        tr: "Jujutsu Kaisen 0 · sahne kaydı — birebir ifade değil",
        en: "Jujutsu Kaisen 0 · scene record — not a verbatim quote",
      },
    },
    {
      key: "reveal",
      text: {
        tr: "«Beni Rika lanetlemedi. Onu ben lanetledim.» — sayfanın bütün rengini yeniden anlamlandıran ayrım.",
        en: "“Rika did not curse me. I cursed her.” — the distinction that re-reads every colour on this page.",
      },
      where: {
        tr: "Jujutsu Kaisen 0 · sahne kaydı — birebir ifade değil",
        en: "Jujutsu Kaisen 0 · scene record — not a verbatim quote",
      },
    },
  ],
  motto: "特級呪術師 乙骨憂太",
  mottoReading: "tokkyū jujutsushi · Okkotsu Yūta",
  mottoNote: {
    tr: "Özel derece büyücü Yūta Okkotsu — unvan ve ad, AniList künyesindeki hâliyle.",
    en: "Special grade sorcerer Yuuta Okkotsu — the title and the name exactly as the AniList record has them.",
  },
  bandNote: {
    tr: "Bu kadraj boş: kapanış bandı yüklenmedi.",
    en: "This frame is empty: the closing band has not been uploaded.",
  },
  bandAlt: {
    tr: "Yūta Okkotsu — kapanış bandı, küratör tarafından yüklendi",
    en: "Yuuta Okkotsu — closing band, uploaded by the curator",
  },
  rikaAlt: {
    tr: "Rika — küratör tarafından yüklenen kare",
    en: "Rika — frame uploaded by the curator",
  },
  rikaNote: {
    tr: "Bu kadraj boş ve boş kalması beklenen bir kadraj: Rika'nın resmî bir portresi arşivde yok. Yerinde elle çizilmiş bir siluet duruyor.",
    en: "This frame is empty, and expected to be: there is no official portrait of Rika in the archive. A hand-drawn silhouette stands in its place.",
  },
  rikaSilhouetteLabel: {
    tr: "Rika — elle çizilmiş siluet, halkanın içinde",
    en: "Rika — a hand-drawn silhouette inside the ring",
  },
  credit: {
    tr: "Künye ve portre AniList'ten:",
    en: "Record and portrait from AniList:",
  },
  creditLink: {
    tr: "AniList · karakter 129571",
    en: "AniList · character 129571",
  },
  sourceNote: {
    tr: "Portre dışındaki bütün çizimler (yüzük halkası, çentikli şerit, siluet) bu sayfa için elle SVG olarak çizildi; dışarıdan görsel indirilmedi. Sahne kadrajları küratör yuvası olarak boş duruyor.",
    en: "Every drawing other than the portrait (the ring, the notched strip, the silhouette) was hand-drawn as SVG for this page; no image was fetched from elsewhere. The scene frames stand empty as curator slots.",
  },
} as const;

/** Sahne görsellerinin `alt` metni — kaynak bilgisi her zaman içinde. */
export function yuutaSceneAlt(scene: string, name: string): string {
  return `${scene} — ${name} (küratör tarafından yüklenen kare)`;
}
