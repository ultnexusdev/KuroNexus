import type { LocalizedText } from "./types";

/**
 * Aoi Tōdō (東堂葵) — "Boogie Woogie" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Bileşen buradan okuyup `pick(text, locale)` ile seçiyor; istemci adalarına
 * yalnızca düz dize iniyor.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * TAKAS. Boogie Woogie (不義遊戯) tek bir şey yapıyor: alkışla, menzil
 * içindeki lanet enerjisi taşıyan iki şeyin yerini DEĞİŞTİRİYOR. Sayfa da
 * tam olarak bunu yapıyor — okurken bölümler gerçekten yer değiştiriyor.
 *
 * Biçim bir İDOL POSTERİ: ortalanmış, simetrik, kalın çerçeveli bloklar;
 * dev ve ortalanmış poster başlıkları; Takada-chan bölümünde pop etiketler.
 * Dalga 4'ün en parlak ve en neşeli sayfası olması bilinçli — Tōdō'nun
 * kendisi ciddiyetsiz ve sayfa onu ciddileştirmiyor.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Yaş (18), doğum günü (23 Eylül), boy (190 cm), tür (insan), okul (Kyoto
 * Jujutsu Lisesi), sınıf (üçüncü) ve derece (1. derece jujutsu büyücüsü)
 * `public/assets/anime/karakterler/aoi-toudou/kaynak.json` dosyasından
 * BİREBİR alındı; o dosya AniList #137975 künyesinin kopyası.
 *
 * ⚠️ KAN GRUBU YOK. AniList kaydında alan boş. Künye şeridi bunu bir
 * eksiklik olarak değil BOŞ BİR SATIR olarak taşıyor — uydurulmuş bir harf
 * yazmak bu arşivin kuralını bozardı.
 *
 * ⚠️ ÇİZELGE YAŞ İLERLETMİYOR. Kaynakta tek bir yaş var (18) ve dizideki
 * bütün duraklar aynı yılın içinde. Beş durak da "18 yaş" etiketi taşıyor
 * ve çizelge yaşı değil ARKI ilerletiyor; gerekçe sayfada da yazılı.
 *
 * ── REPLİK DİSİPLİNİ (Grimmjow emsali, kural 5) ──────────────────────────
 * Tırnak içinde YALNIZCA sabit terimler var — 不義遊戯, 黒閃, 親友, 拍手,
 * 一級呪術師 — çünkü bunlar çeviriden çeviriye kaymıyor. Tōdō'nun imza
 * sorusu ("Kadın zevkin nedir?") sayfada var ama AKTARILMIŞ SÖZ olarak,
 * Japonca tırnak içinde değil: sorunun Japonca ifadesi kaynaktan kaynağa
 * değişiyor ve yanlış bir dizeyi orijinal diye yazmak uydurma olurdu.
 *
 * ── TERMİNOLOJİ (Jujutsu Kaisen — Naruto/Bleach terimi YOK) ──────────────
 *   呪術      jujutsu            → lanet büyüsü
 *   呪力      juryoku            → lanet enerjisi
 *   術式      jutsushiki         → lanetli teknik
 *   領域展開  ryōiki tenkai      → alan genişletme
 *   反転術式  hanten jutsushiki  → ters lanet teknigi
 *   呪具      jugu               → lanetli alet
 *   束縛      sokubaku           → bağlayıcı söz
 *   呪霊      jurei              → lanetli ruh
 *   黒閃      kokusen            → kara flaş
 *   一級呪術師 ikkyū jujutsushi  → 1. derece jujutsu büyücüsü
 */

export const TOUDOU_ID = 137975;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const TOUDOU_SITE_URL = "https://anilist.co/character/137975";

/**
 * Depodaki resmî portre (Faz 2 kararı: hotlink yok, kare repoda).
 *
 * ⚠️ 230×345 — yani KÜÇÜK. Sayfada yalnızca madalyon ölçüsünde bir künye
 * kadrajında ve takas sahnesindeki kendi panelinde kullanılıyor; büyük hero
 * posteri küratör yuvası olarak boş bırakıldı.
 */
export const TOUDOU_PORTRAIT = {
  src: "/assets/anime/karakterler/aoi-toudou/anilist-portrait.png",
  w: 230,
  h: 345,
} as const;

/**
 * Poster kadrajları — hepsi characterId 137975 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `tdo:` önekli (küratör modu şartı).
 */
export const TOUDOU_IMAGE_KEYS = {
  hero: "tdo:hero",
  powerBoogie: "tdo:boogie-woogie",
  powerFlash: "tdo:black-flash",
  powerBody: "tdo:physique",
  takada: "tdo:takada",
  stage: "tdo:stage",
  fateKyoto: "tdo:kyoto",
  fateGoodwill: "tdo:goodwill",
  fateBrother: "tdo:brother",
  fateShibuya: "tdo:shibuya",
  fatePhantom: "tdo:phantom-clap",
  closing: "tdo:closing",
} as const;

/** Küratör yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const TOUDOU_SLOT_LABELS: Record<string, LocalizedText> = {
  [TOUDOU_IMAGE_KEYS.hero]: {
    tr: "Hero posteri — dikey, tam boy, parlak zemin (3:4)",
    en: "Hero poster — vertical, full figure, bright ground (3:4)",
  },
  [TOUDOU_IMAGE_KEYS.powerBoogie]: {
    tr: "Boogie Woogie — alkış anı, iki hedef aynı karede (16:9)",
    en: "Boogie Woogie — the clap, both targets in frame (16:9)",
  },
  [TOUDOU_IMAGE_KEYS.powerFlash]: {
    tr: "Kara Flaş — çarpma anındaki kara kıvılcım (16:9)",
    en: "Black Flash — the black spark at the moment of impact (16:9)",
  },
  [TOUDOU_IMAGE_KEYS.powerBody]: {
    tr: "Fiziksel güç — yakın dövüş, tam gövde (16:9)",
    en: "Physique — close combat, full body (16:9)",
  },
  [TOUDOU_IMAGE_KEYS.takada]: {
    tr: "Takada-chan kadrajı — idol posteri, dikey (5:7)",
    en: "Takada-chan frame — idol poster, vertical (5:7)",
  },
  [TOUDOU_IMAGE_KEYS.stage]: {
    tr: "Takas sahnesi — geniş kadraj, iki figür (16:9)",
    en: "Swap stage — wide frame, two figures (16:9)",
  },
  [TOUDOU_IMAGE_KEYS.fateKyoto]: {
    tr: "Kyoto Jujutsu Lisesi — okul, geniş kadraj (7:4)",
    en: "Kyoto Jujutsu High — the school, wide frame (7:4)",
  },
  [TOUDOU_IMAGE_KEYS.fateGoodwill]: {
    tr: "Değişim Etkinliği — Kyoto ve Tokyo karşı karşıya (7:4)",
    en: "Goodwill Event — Kyoto and Tokyo face to face (7:4)",
  },
  [TOUDOU_IMAGE_KEYS.fateBrother]: {
    tr: "\"Kardeşim\" — Tōdō ve Yūji aynı karede (7:4)",
    en: "\"My brother\" — Tōdō and Yūji in one frame (7:4)",
  },
  [TOUDOU_IMAGE_KEYS.fateShibuya]: {
    tr: "Shibuya — Mahito karşısında, koyu kadraj (7:4)",
    en: "Shibuya — facing Mahito, dark frame (7:4)",
  },
  [TOUDOU_IMAGE_KEYS.fatePhantom]: {
    tr: "Hayali alkış — tek el, kapanan kadraj (7:4)",
    en: "The imagined clap — one hand, closing frame (7:4)",
  },
  [TOUDOU_IMAGE_KEYS.closing]: {
    tr: "Kapanış bandı — panoramik, poster kuyruğu (21:9)",
    en: "Closing band — panoramic, poster tail (21:9)",
  },
};

/** Yuvanın beklediği kare: tip + ölçü. `CuratorGaps` bunu yazıyor. */
export const TOUDOU_SLOT_SPECS: Record<string, LocalizedText> = {
  [TOUDOU_IMAGE_KEYS.hero]: {
    tr: "dikey poster · 1200×1600 · webp",
    en: "vertical poster · 1200×1600 · webp",
  },
  [TOUDOU_IMAGE_KEYS.powerBoogie]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [TOUDOU_IMAGE_KEYS.powerFlash]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [TOUDOU_IMAGE_KEYS.powerBody]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [TOUDOU_IMAGE_KEYS.takada]: {
    tr: "dikey idol posteri · 1000×1400 · webp",
    en: "vertical idol poster · 1000×1400 · webp",
  },
  [TOUDOU_IMAGE_KEYS.stage]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [TOUDOU_IMAGE_KEYS.fateKyoto]: {
    tr: "sahne karesi · 1400×800 · webp",
    en: "scene frame · 1400×800 · webp",
  },
  [TOUDOU_IMAGE_KEYS.fateGoodwill]: {
    tr: "sahne karesi · 1400×800 · webp",
    en: "scene frame · 1400×800 · webp",
  },
  [TOUDOU_IMAGE_KEYS.fateBrother]: {
    tr: "sahne karesi · 1400×800 · webp",
    en: "scene frame · 1400×800 · webp",
  },
  [TOUDOU_IMAGE_KEYS.fateShibuya]: {
    tr: "sahne karesi · 1400×800 · webp",
    en: "scene frame · 1400×800 · webp",
  },
  [TOUDOU_IMAGE_KEYS.fatePhantom]: {
    tr: "sahne karesi · 1400×800 · webp",
    en: "scene frame · 1400×800 · webp",
  },
  [TOUDOU_IMAGE_KEYS.closing]: {
    tr: "panoramik bant · 1800×800 · webp",
    en: "panoramic band · 1800×800 · webp",
  },
};

/** `CuratorUpload` önerilen pikseli kendisi yazıyor; kaynağı burası. */
export const TOUDOU_SLOT_SIZES: Record<string, { w: number; h: number }> = {
  [TOUDOU_IMAGE_KEYS.hero]: { w: 1200, h: 1600 },
  [TOUDOU_IMAGE_KEYS.powerBoogie]: { w: 1600, h: 900 },
  [TOUDOU_IMAGE_KEYS.powerFlash]: { w: 1600, h: 900 },
  [TOUDOU_IMAGE_KEYS.powerBody]: { w: 1600, h: 900 },
  [TOUDOU_IMAGE_KEYS.takada]: { w: 1000, h: 1400 },
  [TOUDOU_IMAGE_KEYS.stage]: { w: 1600, h: 900 },
  [TOUDOU_IMAGE_KEYS.fateKyoto]: { w: 1400, h: 800 },
  [TOUDOU_IMAGE_KEYS.fateGoodwill]: { w: 1400, h: 800 },
  [TOUDOU_IMAGE_KEYS.fateBrother]: { w: 1400, h: 800 },
  [TOUDOU_IMAGE_KEYS.fateShibuya]: { w: 1400, h: 800 },
  [TOUDOU_IMAGE_KEYS.fatePhantom]: { w: 1400, h: 800 },
  [TOUDOU_IMAGE_KEYS.closing]: { w: 1800, h: 800 },
};

/** Portre yuvasının etiketi (küratör 1200×1600 tam boyu buraya yüklüyor). */
export const TOUDOU_PORTRAIT_SLOT: LocalizedText = {
  tr: "Portre — dikey, tam boy, 1200×1600",
  en: "Portrait — vertical, full figure, 1200×1600",
};

/** Boş kadrajın küratöre yazdığı tek kelime. Ziyaretçi bunu GÖRMÜYOR. */
export const TOUDOU_FRAME_EMPTY: LocalizedText = {
  tr: "boş kadraj",
  en: "empty frame",
};

/** Sayfanın en altındaki düzenleyicisiz yuva özeti. */
export const TOUDOU_GAPS = {
  title: { tr: "Poster kadrajları", en: "Poster frames" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bütün kadrajlar dolu — bu sayfada yüklenecek kare kalmadı.",
    en: "Every frame is filled — nothing left to upload on this page.",
  },
} as const;

export const TOUDOU_CRUMB = {
  series: { tr: "Jujutsu Kaisen", en: "Jujutsu Kaisen" },
} as const;

export const TOUDOU_ALT = {
  portrait: {
    tr: "Aoi Tōdō — AniList resmî portresi (#137975)",
    en: "Aoi Tōdō — official AniList portrait (#137975)",
  },
  portraitUploaded: {
    tr: "Aoi Tōdō — arşive yüklenmiş portre",
    en: "Aoi Tōdō — portrait uploaded to the archive",
  },
  scenePrefix: {
    tr: "Aoi Tōdō sayfası, küratör kadrajı:",
    en: "Aoi Tōdō page, curated frame:",
  },
  companionPrefix: {
    tr: "Arşiv portresi:",
    en: "Archive portrait:",
  },
} as const;

/** Hero — poster başlığı ve üstündeki filigran. */
export const TOUDOU_HERO = {
  eyebrow: {
    tr: "Kyoto Jujutsu Lisesi · üçüncü sınıf",
    en: "Kyoto Jujutsu High · third year",
  },
  billing: {
    tr: "1. Derece Jujutsu Büyücüsü",
    en: "Grade 1 Jujutsu Sorcerer",
  },
  billingNative: "一級呪術師",
  tagline: {
    tr: "Alkışlıyor. İki şey yer değiştiriyor. Sonrası tartışılır.",
    en: "He claps. Two things trade places. The rest is negotiable.",
  },
  lede: {
    tr: "Tōdō ölçüsüz bir adam: 190 santim, kahkahalı, bir idol hayranı ve Kyoto'nun en güçlü öğrencisi. Tekniği de aynı ölçüsüzlükte basit — elini bir kere çırpıyor ve menzilindeki iki şey yerini değiştiriyor. Bu sayfa o basitliği ciddiye alıyor: aşağıda okuduğunuz bloklar gerçekten takas edilebiliyor.",
    en: "Tōdō is a man without moderation: 190 centimetres, all laughter, an idol fan and Kyoto's strongest student. His technique is just as immoderately simple — one clap, and two things inside his range trade places. This page takes that simplicity literally: the blocks you read below really can be swapped.",
  },
  signature: {
    tr: "İlk sorusu her zaman aynı: kadın zevkin nedir? Cevabı beğenirse dostu olursunuz; beğenmezse yine de dostu olursunuz, sadece daha gürültülü olur.",
    en: "His opening question is always the same: what's your type of woman? If he likes the answer you become his friend; if he doesn't, you still become his friend, it is just louder.",
  },
  signatureNote: {
    tr: "Bu soru aktarılmış sözdür, tırnak içinde değildir: Japonca ifadesi kaynaktan kaynağa değişiyor ve arşiv yalnızca sabit terimleri orijinal dilde tırnağa alıyor.",
    en: "That question is reported speech, not a quotation: its Japanese wording varies between sources, and this archive only quotes fixed terms in the original language.",
  },
  heroCaption: {
    tr: "Bu büyük poster karesi bilerek boş: depodaki resmî portre 230×345 ve bu ölçüye gerilmesi onu bozardı. Kadraj küratör yüklemesini bekliyor.",
    en: "This large poster frame is deliberately empty: the official portrait in the repo is 230×345, and stretching it here would ruin it. The frame is waiting for a curated upload.",
  },
  watermarkNote: {
    tr: "Arkadaki filigran elle çizildi: birbirine değen iki el ve tekniğin adı — 不義遊戯.",
    en: "The watermark behind is hand-drawn: two hands meeting, and the technique's name — 不義遊戯.",
  },
} as const;

/** Mod düğmesi — sayfanın tamamını çeviren tek durum. */
export const TOUDOU_MODE = {
  title: { tr: "Kardeşim!", en: "My brother!" },
  native: "親友",
  nativeReading: {
    tr: "shinyū — en iyi dost",
    en: "shinyū — best friend",
  },
  enter: { tr: "Kardeşim! · aç", en: "My brother! · on" },
  exit: { tr: "Kardeşim! · kapat", en: "My brother! · off" },
  hintOn: {
    tr: "Çerçeve açık: Yūji her bölümde Tōdō'nun yanında beliriyor ve palet fuşyaya doyuyor.",
    en: "The frame is on: Yūji appears beside Tōdō in every section and the palette saturates into fuchsia.",
  },
  hintOff: {
    tr: "Çerçeve kapalı: sayfada yalnızca Tōdō var. Düğmeye basınca ikinci kişi geliyor.",
    en: "The frame is off: only Tōdō is on the page. Press the button and the second person arrives.",
  },
  note: {
    tr: "Tōdō için 親友 bir nezaket sözü değil, bir ilan: karşısındakini kendi kararıyla kardeşi yapıyor ve o karardan dönmüyor.",
    en: "For Tōdō 親友 is not a courtesy, it is a declaration: he makes the other person his brother by his own decision, and does not take it back.",
  },
} as const;

/**
 * "Kardeşim!" açıkken her bölümde beliren Yūji şeridi.
 *
 * ⚠️ Şeritler sunucuda çiziliyor ve mod KAPALIYKEN `display: none` ile hem
 * ekrandan hem erişilebilirlik ağacından çıkıyor — yani ekran okuyucunun
 * duyduğu şey ile ekranda görünen şey aynı kalıyor.
 */
export const TOUDOU_BROTHER = {
  badge: { tr: "en iyi dostum", en: "my best friend" },
  /** Yūji Itadori — portresi `EXPERIENCE_COMPANIONS` üzerinden geliyor. */
  characterId: 127212,
  name: "Yūji Itadori",
  native: "虎杖悠仁",
  missing: { tr: "portre yok", en: "no portrait" },
  lines: {
    identity: {
      tr: "Künyede yazmıyor ama Tōdō'ya sorarsanız en önemli satır bu: Yūji onun kardeşi.",
      en: "It is not in the record, but ask Tōdō and this is the important line: Yūji is his brother.",
    },
    power: {
      tr: "Kara Flaş'ı Tōdō anlatmadı, dövüşün ortasında gösterdi — ve Yūji aynı gün ilkini vurdu.",
      en: "Tōdō did not explain Black Flash, he demonstrated it mid-fight — and Yūji landed his first one that day.",
    },
    kit: {
      tr: "Takasın işe yaraması için ikinci bir gövde gerekiyor. Tōdō'nun aklındaki gövde hep aynı kişi.",
      en: "A swap needs a second body. The body in Tōdō's head is always the same person.",
    },
    clap: {
      tr: "Sahnede iki kişi varsa Tōdō hangisini alkışlayacağını çoktan biliyor.",
      en: "If there are two people on stage, Tōdō already knows which one he is clapping for.",
    },
    fate: {
      tr: "Çizelgenin ortasındaki üç durak Yūji olmadan anlatılamıyor.",
      en: "The three middle stops of this timeline cannot be told without Yūji.",
    },
    closing: {
      tr: "Tōdō'nun son alkışı kendisi için değildi.",
      en: "Tōdō's last clap was not for himself.",
    },
  },
} as const;

/** Künye şeridi — kaynak.json'daki gerçek veriler. */
export const TOUDOU_IDENTITY = {
  name: "Aoi Toudou",
  nativeName: "東堂葵",
  romanized: {
    tr: "Aoi Tōdō (arşiv yazımı) · Aoi Toudou (AniList yazımı)",
    en: "Aoi Tōdō (archive spelling) · Aoi Toudou (AniList spelling)",
  },
  facts: [
    {
      key: "age",
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "18", en: "18" },
      blank: false,
    },
    {
      key: "birthday",
      label: { tr: "Doğum günü", en: "Birthday" },
      value: { tr: "23 Eylül", en: "23 September" },
      blank: false,
    },
    {
      key: "height",
      label: { tr: "Boy", en: "Height" },
      value: { tr: "190 cm", en: "190 cm" },
      blank: false,
    },
    {
      key: "blood",
      label: { tr: "Kan grubu", en: "Blood type" },
      value: {
        tr: "kayıtta yok",
        en: "not in the record",
      },
      blank: true,
    },
    {
      key: "species",
      label: { tr: "Tür", en: "Species" },
      value: { tr: "İnsan", en: "Human" },
      blank: false,
    },
    {
      key: "school",
      label: { tr: "Okul", en: "School" },
      value: {
        tr: "Kyoto Jujutsu Lisesi",
        en: "Kyoto Jujutsu Technical High School",
      },
      blank: false,
    },
    {
      key: "year",
      label: { tr: "Sınıf", en: "Year" },
      value: { tr: "Üçüncü sınıf", en: "Third year" },
      blank: false,
    },
    {
      key: "grade",
      label: { tr: "Derece", en: "Grade" },
      value: {
        tr: "1. derece jujutsu büyücüsü",
        en: "Grade 1 jujutsu sorcerer",
      },
      blank: false,
    },
    {
      key: "technique",
      label: { tr: "Lanetli teknik", en: "Cursed technique" },
      value: { tr: "Boogie Woogie · 不義遊戯", en: "Boogie Woogie · 不義遊戯" },
      blank: false,
    },
    {
      key: "object",
      label: { tr: "Sembolik obje", en: "Symbolic object" },
      value: {
        tr: "İki el — alkışın kendisi",
        en: "Two hands — the clap itself",
      },
      blank: false,
    },
    {
      key: "idol",
      label: { tr: "İdol", en: "Idol" },
      value: { tr: "Takada-chan", en: "Takada-chan" },
      blank: false,
    },
  ],
} as const;

export const TOUDOU_MISSING_NOTE: LocalizedText = {
  tr: "Kan grubu satırı boş çünkü AniList kaydında o alan boş. Arşiv boş bir alanı doldurmuyor.",
  en: "The blood type row is blank because the field is blank in the AniList record. This archive does not fill in empty fields.",
};

/** "Göründüğü Yapımlar" — kaynak.json'daki liste, yinelenenler ayıklandı. */
export const TOUDOU_PRODUCTIONS = {
  title: { tr: "Göründüğü yapımlar", en: "Appears in" },
  role: { tr: "yardımcı kadro", en: "supporting" },
  items: [
    { tr: "Jujutsu Kaisen", en: "Jujutsu Kaisen" },
    { tr: "Jujutsu Kaisen 2. Sezon", en: "Jujutsu Kaisen Season 2" },
    { tr: "Jujutsu Kaisen 0", en: "Jujutsu Kaisen 0" },
    {
      tr: "Jujutsu Kaisen 3. Sezon — Katliam Oyunu, 1. Bölüm",
      en: "Jujutsu Kaisen Season 3 — The Culling Game, Part 1",
    },
  ],
} as const;

/** Bölüm başlıkları ve giriş cümleleri. */
export const TOUDOU_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "The Record" },
    lede: {
      tr: "Poster kuyruğu: adın altına basılan sayılar. Hepsi AniList künyesinden geliyor, biri hariç — o satır boş.",
      en: "The billing block: the numbers printed under the name. All of them come from the AniList record, except one — that row is blank.",
    },
  },
  power: {
    title: { tr: "Lanet Laboratuvarı", en: "Cursed Laboratory" },
    lede: {
      tr: "Üç büyük kart. Üçü de tek bir cümlenin etrafında dönüyor: Tōdō menzil içindeki bir şeyi başka bir şeyle değiştirebiliyor.",
      en: "Three big cards. All three orbit a single sentence: Tōdō can trade one thing inside his range for another.",
    },
  },
  kit: {
    title: { tr: "Dört Küçük Not", en: "Four Small Notes" },
    lede: {
      tr: "Tekniğin şartları, sınırları ve kayıtta olmayanı. Dördüncü kart bilerek boş bir cevap taşıyor.",
      en: "The technique's conditions, its limits, and what is not in the record. The fourth card deliberately carries an empty answer.",
    },
  },
  glossary: {
    title: { tr: "Sözlük", en: "Glossary" },
    lede: {
      tr: "Bu sayfada geçen jujutsu terimleri, orijinal yazımlarıyla.",
      en: "The jujutsu terms used on this page, in their original spellings.",
    },
  },
  clap: {
    title: { tr: "Alkış", en: "The Clap" },
    lede: {
      tr: "Sayfanın kalbi. İki paneli işaretle, sonra alkışla — panelller gerçekten yer değiştiriyor. Sayfada üç ayrı alan bunu yapıyor ve hepsi bağımsız çalışıyor.",
      en: "The heart of the page. Mark two panels, then clap — the panels really do trade places. Three separate fields on this page do this, and each works on its own.",
    },
  },
  takada: {
    title: { tr: "Takada-chan", en: "Takada-chan" },
    lede: {
      tr: "Tōdō'nun idolü. Kadraj boş, çünkü arşivde ona ait bir kare yok; yerinde elle çizilmiş bir idol silueti duruyor.",
      en: "Tōdō's idol. The frame is empty because the archive holds no image of her; a hand-drawn idol silhouette stands in its place.",
    },
  },
  fate: {
    title: { tr: "Kader Çizelgesi", en: "The Fate Sheet" },
    lede: {
      tr: "Beş durak. Hepsi aynı yaşta — 18 — çünkü kaynakta tek bir yaş var ve dizideki her durak o yılın içinde. Çizelge yaşı değil, arkı ilerletiyor.",
      en: "Five stops. All at the same age — 18 — because the record holds a single age and every stop falls inside that year. The sheet advances the arc, not the age.",
    },
  },
  bonds: {
    title: { tr: "Kadro", en: "The Cast" },
    lede: {
      tr: "Tōdō'nun ölçüt aldığı, kardeş ilan ettiği ve aynı sınıfı paylaştığı isimler.",
      en: "The names Tōdō measures himself against, declares as kin, and shares a classroom with.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "İki sabit terim, bir motto ve künye. Sayfanın son alkışı.",
      en: "Two fixed terms, a motto and the credit. The page's last clap.",
    },
  },
} as const;

/** Üç büyük kart — takas edilebilir. */
export const TOUDOU_POWERS = [
  {
    key: "boogie",
    name: "Boogie Woogie",
    native: "不義遊戯",
    reading: "fugi yūgi",
    kind: {
      tr: "Lanetli Teknik · 術式",
      en: "Cursed Technique · 術式",
    },
    turkish: {
      tr: "Hakkaniyetsiz Oyun",
      en: "The Unfair Game",
    },
    tagline: {
      tr: "Bir alkış, iki yer.",
      en: "One clap, two places.",
    },
    text: {
      tr: "Tōdō ellerini çırpıyor ve menzili içinde, lanet enerjisi taşıyan iki şeyin konumu anında değişiyor. Şart tek: her iki hedef de lanet enerjisi taşımalı. Nesne olabilir, insan olabilir, kendisi olabilir. Sınır menzil; kural yok.",
      en: "Tōdō claps, and inside his range two things that carry cursed energy instantly exchange positions. There is one condition: both targets must carry cursed energy. It can be an object, a person, himself. The limit is range; there is no rule.",
    },
    traits: [
      { tr: "Tetikleyici: alkış", en: "Trigger: a clap" },
      { tr: "Şart: iki hedef de lanet enerjisi taşıyacak", en: "Condition: both targets carry cursed energy" },
      { tr: "Sınır: menzil", en: "Limit: range" },
    ],
    imageKey: TOUDOU_IMAGE_KEYS.powerBoogie,
  },
  {
    key: "flash",
    name: "Kara Flaş",
    nameEn: "Black Flash",
    native: "黒閃",
    reading: "kokusen",
    kind: {
      tr: "Olgu — teknik değil",
      en: "A phenomenon — not a technique",
    },
    turkish: {
      tr: "Kara Şimşek",
      en: "Black Lightning",
    },
    tagline: {
      tr: "Öğretilmez; bir kere denk gelir, sonra aranır.",
      en: "It cannot be taught; it happens once, then you chase it.",
    },
    text: {
      tr: "Fiziksel darbe ile lanet enerjisinin çarpması arasındaki fark yeterince küçüldüğünde uzay çarpılıyor ve çıkan güç katlanıyor. Kara Flaş bir lanetli teknik değil, bir isabet anı. Tōdō bunu Yūji'ye anlatarak değil, dövüşün ortasında yaptırarak öğretti.",
      en: "When the gap between the physical blow and the cursed energy impact becomes small enough, space distorts and the output multiplies. Black Flash is not a cursed technique, it is a moment of contact. Tōdō taught it to Yūji not by explaining it, but by making him do it mid-fight.",
    },
    traits: [
      { tr: "Teknik değil, isabet", en: "Not a technique, a hit" },
      { tr: "Tōdō'nun Yūji'ye bıraktığı ders", en: "The lesson Tōdō left with Yūji" },
      { tr: "Bir kere görülünce peşinden gidiliyor", en: "Once seen, it is chased" },
    ],
    imageKey: TOUDOU_IMAGE_KEYS.powerFlash,
  },
  {
    key: "body",
    name: "Fiziksel Güç",
    nameEn: "Physique",
    native: "体術",
    reading: "taijutsu",
    kind: {
      tr: "Beden — künyeden birebir",
      en: "The body — verbatim from the record",
    },
    turkish: {
      tr: "Beden Tekniği",
      en: "Body Technique",
    },
    tagline: {
      tr: "190 santim, ve tekniği hiç kullanmasa da tehlikeli.",
      en: "190 centimetres, and dangerous even without the technique.",
    },
    text: {
      tr: "AniList künyesi Tōdō'yu üç kelimeyle tarif ediyor: insan üstü kuvvet, dayanıklılık ve hız. Takas bir kaçış numarası değil, o gövdenin uzantısı — Tōdō yerini değiştirdiği anda zaten yumruğunu atmış oluyor.",
      en: "The AniList record describes Tōdō in three words: inhuman strength, durability and speed. The swap is not an escape trick, it is an extension of that body — the instant he changes places, the punch is already thrown.",
    },
    traits: [
      { tr: "İnsan üstü kuvvet", en: "Inhuman strength" },
      { tr: "İnsan üstü dayanıklılık", en: "Inhuman durability" },
      { tr: "İnsan üstü hız", en: "Inhuman speed" },
    ],
    imageKey: TOUDOU_IMAGE_KEYS.powerBody,
  },
] as const;

/** Dört küçük kart — bunlar da takas edilebilir. Görsel kadrajı YOK. */
export const TOUDOU_KIT = [
  {
    key: "energy",
    name: "Lanet Enerjisi",
    nameEn: "Cursed Energy",
    native: "呪力",
    reading: "juryoku",
    note: {
      tr: "Takasın tek şartı. Enerji taşımayan bir şey Tōdō için görünmez: alkış onu yerinden oynatmıyor.",
      en: "The swap's only condition. A thing that carries no energy is invisible to Tōdō: the clap will not move it.",
    },
  },
  {
    key: "clap",
    name: "Alkış",
    nameEn: "The Clap",
    native: "拍手",
    reading: "hakushu",
    note: {
      tr: "Tetikleyicinin kendisi. Shibuya'da eli koptuktan sonra Tōdō alkışı hayalinde kurdu ve teknik bir kez daha çalıştı.",
      en: "The trigger itself. After his hand was taken in Shibuya, Tōdō formed the clap in his imagination and the technique worked one more time.",
    },
  },
  {
    key: "grade",
    name: "1. Derece",
    nameEn: "Grade 1",
    native: "一級呪術師",
    reading: "ikkyū jujutsushi",
    note: {
      tr: "Künyedeki rütbe. Jujutsu dünyasında özel derecenin bir altı; Kyoto'nun öğrenci kadrosunda en üstü.",
      en: "The rank in the record. One step below special grade in the jujutsu world; the top of Kyoto's student roster.",
    },
  },
  {
    key: "domain",
    name: "Alan Genişletme",
    nameEn: "Domain Expansion",
    native: "領域展開",
    reading: "ryōiki tenkai",
    note: {
      tr: "Kayıtta yok. Tōdō'ya ait bir alan genişletme arşivde bulunmuyor ve bu kart bilerek boş bırakıldı — uydurulmuş bir alan adı yazmak arşivin kuralını bozardı.",
      en: "Not in the record. No domain expansion of Tōdō's exists in this archive, and this card is deliberately left empty — inventing a domain name would break the archive's rule.",
    },
  },
] as const;

/** Sözlük şeridi — evrenin terimleri, iddia değil tanım. */
export const TOUDOU_GLOSSARY = [
  {
    native: "術式",
    reading: "jutsushiki",
    text: { tr: "lanetli teknik", en: "cursed technique" },
  },
  {
    native: "呪力",
    reading: "juryoku",
    text: { tr: "lanet enerjisi", en: "cursed energy" },
  },
  {
    native: "領域展開",
    reading: "ryōiki tenkai",
    text: { tr: "alan genişletme", en: "domain expansion" },
  },
  {
    native: "反転術式",
    reading: "hanten jutsushiki",
    text: { tr: "ters lanet tekniği", en: "reverse cursed technique" },
  },
  {
    native: "呪具",
    reading: "jugu",
    text: { tr: "lanetli alet", en: "cursed tool" },
  },
  {
    native: "束縛",
    reading: "sokubaku",
    text: { tr: "bağlayıcı söz", en: "binding vow" },
  },
] as const;

/** Takas sahnesindeki altı panel. */
export const TOUDOU_STAGE = [
  {
    key: "toudou",
    name: "Aoi Tōdō",
    native: "東堂葵",
    kind: "self" as const,
    characterId: null,
    note: {
      tr: "Alkışlayan. Takasın bir ucu her zaman kendisi olabilir.",
      en: "The one who claps. One end of the swap can always be himself.",
    },
  },
  {
    key: "yuuji",
    name: "Yūji Itadori",
    native: "虎杖悠仁",
    kind: "companion" as const,
    characterId: 127212,
    note: {
      tr: "Kardeşi. Tōdō onu dövüşün ortasında sahnenin öbür ucuna taşıyor.",
      en: "His brother. Tōdō carries him to the far end of the stage mid-fight.",
    },
  },
  {
    key: "gojou",
    name: "Satoru Gojō",
    native: "五条悟",
    kind: "companion" as const,
    characterId: 127691,
    note: {
      tr: "Ölçüt. Tōdō gücü onunla karşılaştırarak konuşuyor.",
      en: "The benchmark. Tōdō talks about strength by measuring against him.",
    },
  },
  {
    key: "nobara",
    name: "Nobara Kugisaki",
    native: "釘崎野薔薇",
    kind: "companion" as const,
    characterId: 133700,
    note: {
      tr: "Tokyo kadrosundan; Değişim Etkinliği'nin karşı tarafı.",
      en: "From the Tokyo roster; the other side of the Goodwill Event.",
    },
  },
  {
    key: "megumi",
    name: "Megumi Fushiguro",
    native: "伏黒恵",
    kind: "companion" as const,
    characterId: 126635,
    note: {
      tr: "Tokyo kadrosundan; aynı etkinlikte karşı sahada.",
      en: "From the Tokyo roster; on the opposite field at the same event.",
    },
  },
  {
    key: "takada",
    name: "Takada-chan",
    native: "高田ちゃん",
    kind: "idol" as const,
    characterId: null,
    note: {
      tr: "İdol. Arşivde numarası yok, kadrajı boş — yerinde elle çizilmiş bir siluet duruyor.",
      en: "The idol. She has no number in this archive and her frame is empty — a hand-drawn silhouette stands in its place.",
    },
  },
] as const;

/**
 * Takas alanının bütün metinleri.
 *
 * `{a}` ve `{b}` yer tutucuları istemci adasında panel adlarıyla
 * dolduruluyor; iki dil de aynı yer tutucuları taşıyor.
 */
export const TOUDOU_CLAP_UI = {
  markAction: { tr: "İşaretle", en: "Mark" },
  unmarkAction: { tr: "İşareti kaldır", en: "Unmark" },
  clapAction: { tr: "ALKIŞLA", en: "CLAP" },
  resetAction: { tr: "Sırayı sıfırla", en: "Reset order" },
  hintPick: {
    tr: "İki panel işaretle, sonra alkışla.",
    en: "Mark two panels, then clap.",
  },
  hintOne: {
    tr: "Bir panel işaretli. Bir tane daha seç.",
    en: "One panel marked. Pick one more.",
  },
  hintReady: {
    tr: "İki hedef hazır. Alkışla.",
    en: "Two targets ready. Clap.",
  },
  statusNeedTwo: {
    tr: "Takas için tam olarak iki hedef gerekiyor.",
    en: "A swap needs exactly two targets.",
  },
  statusMarked: { tr: "{a} işaretlendi.", en: "{a} marked." },
  statusUnmarked: { tr: "{a} işareti kaldırıldı.", en: "{a} unmarked." },
  statusSwapped: {
    tr: "Alkış. {a} ile {b} yer değiştirdi.",
    en: "Clap. {a} and {b} traded places.",
  },
  statusReset: {
    tr: "Sıra başlangıç hâline döndü.",
    en: "The order is back to its starting state.",
  },
  keyboardHint: {
    tr: "Klavyeyle: sekme ile panellere gel, boşluk ile işaretle, alkış düğmesiyle takas et. Takastan sonra odak taşınan panele geçiyor.",
    en: "By keyboard: tab to the panels, space to mark, then the clap button to swap. After a swap, focus moves to the panel that travelled.",
  },
  fieldPowers: { tr: "Alan 1 · üç büyük kart", en: "Field 1 · three big cards" },
  fieldKit: { tr: "Alan 2 · dört küçük not", en: "Field 2 · four small notes" },
  fieldStage: { tr: "Alan 3 · sahne", en: "Field 3 · the stage" },
} as const;

/** Takada-chan bölümünün pop etiketleri. */
export const TOUDOU_TAKADA = {
  name: "Takada-chan",
  native: "高田ちゃん",
  pops: [
    { tr: "İDOL", en: "IDOL" },
    { tr: "1 NUMARA", en: "NUMBER ONE" },
    { tr: "HAYRAN: TŌDŌ", en: "FAN: TŌDŌ" },
    { tr: "KADRAJ BOŞ", en: "FRAME EMPTY" },
  ],
  text: {
    tr: "Tōdō'nun idolü. Sayfadaki tek kadraj ki kalıcı olarak boş kalabilir: Takada-chan'ın arşivde numarası yok, dolayısıyla portresi de yok. Yerinde duran siluet elle çizildi ve bir görsel değil, bir yer tutucu.",
    en: "Tōdō's idol. This is the one frame on the page that may stay empty for good: Takada-chan has no number in this archive, and therefore no portrait. The silhouette standing in for her is hand-drawn — a placeholder, not an image.",
  },
  note: {
    tr: "Bağ kurulmadı: arşivde numarası olmayan isimler düz metin kalıyor, uydurulmuş bir adrese bağlanmıyor.",
    en: "No link was made: names without a number in this archive stay as plain text rather than pointing at an invented address.",
  },
} as const;

/** Beş durak — hepsi 18 yaşında, ark ilerliyor. */
export const TOUDOU_TIMELINE = [
  {
    key: "kyoto",
    age: { tr: "18 yaş", en: "age 18" },
    stamp: {
      tr: "Kyoto Jujutsu Lisesi · üçüncü sınıf",
      en: "Kyoto Jujutsu High · third year",
    },
    title: { tr: "Kyoto'nun en üstü", en: "The top of Kyoto" },
    text: {
      tr: "Tōdō üçüncü sınıf ve 1. derece jujutsu büyücüsü. Kyoto'nun öğrenci kadrosunda ondan yukarısı yok; künyede yazan her şey bu iki satırdan çıkıyor.",
      en: "Tōdō is a third-year and a grade 1 jujutsu sorcerer. Nothing on Kyoto's student roster stands above him; everything the record says grows out of these two lines.",
    },
    quote: {
      text: "一級呪術師",
      reading: { tr: "ikkyū jujutsushi — 1. derece jujutsu büyücüsü", en: "ikkyū jujutsushi — grade 1 jujutsu sorcerer" },
      by: { tr: "AniList künyesindeki derece", en: "the grade in the AniList record" },
    },
    imageKey: TOUDOU_IMAGE_KEYS.fateKyoto,
  },
  {
    key: "goodwill",
    age: { tr: "18 yaş", en: "age 18" },
    stamp: {
      tr: "Jujutsu Liseleri Değişim Etkinliği",
      en: "Jujutsu High Goodwill Event",
    },
    title: { tr: "Karşı taraf", en: "The other side" },
    text: {
      tr: "Kyoto ile Tokyo karşı karşıya geliyor. Tōdō karşısındaki Tokyo öğrencisine önce her zamanki sorusunu soruyor, sonra dövüşüyor. Sorunun cevabı dövüşten daha belirleyici oluyor.",
      en: "Kyoto meets Tokyo. Tōdō first asks the Tokyo student in front of him his usual question, then fights him. The answer turns out to matter more than the fight.",
    },
    quote: null,
    imageKey: TOUDOU_IMAGE_KEYS.fateGoodwill,
  },
  {
    key: "brother",
    age: { tr: "18 yaş", en: "age 18" },
    stamp: { tr: "Kardeş ilanı ve ders", en: "The declaration and the lesson" },
    title: { tr: "Kardeşim", en: "My brother" },
    text: {
      tr: "Tōdō, Yūji'yi kendi kararıyla kardeşi ilan ediyor ve aynı dövüşün içinde ona Kara Flaş'ı öğretiyor — anlatarak değil, yaptırarak. Yūji o gün ilk Kara Flaş'ını vuruyor.",
      en: "Tōdō declares Yūji his brother by his own decision, and inside the same fight teaches him Black Flash — not by explaining but by making him do it. Yūji lands his first Black Flash that day.",
    },
    quote: {
      text: "黒閃",
      reading: { tr: "kokusen — kara flaş", en: "kokusen — black flash" },
      by: { tr: "Tōdō'nun Yūji'ye bıraktığı terim", en: "the term Tōdō left with Yūji" },
    },
    imageKey: TOUDOU_IMAGE_KEYS.fateBrother,
  },
  {
    key: "shibuya",
    age: { tr: "18 yaş", en: "age 18" },
    stamp: { tr: "Shibuya", en: "Shibuya" },
    title: { tr: "Kaybedilen el", en: "The hand that was lost" },
    text: {
      tr: "Shibuya'da Mahito'nun karşısında Tōdō elini kaybediyor. Tekniğin tetikleyicisi alkıştı; alkışlayacak iki eli kalmayınca Boogie Woogie de kalmıyor.",
      en: "Facing Mahito in Shibuya, Tōdō loses his hand. The technique's trigger was a clap; with no two hands left to clap, Boogie Woogie is gone too.",
    },
    quote: {
      text: "不義遊戯",
      reading: { tr: "fugi yūgi — Boogie Woogie", en: "fugi yūgi — Boogie Woogie" },
      by: { tr: "o an kullanılamaz hâle gelen teknik", en: "the technique that became unusable in that moment" },
    },
    imageKey: TOUDOU_IMAGE_KEYS.fateShibuya,
  },
  {
    key: "phantom",
    age: { tr: "18 yaş", en: "age 18" },
    stamp: { tr: "Hayali alkış", en: "The imagined clap" },
    title: { tr: "Bir kere daha", en: "One more time" },
    text: {
      tr: "Tōdō alkışı hayalinde kuruyor ve teknik bir kez daha çalışıyor. Sayfanın en sessiz anı bu: iki elin yaptığı işi bir hayal yapıyor ve o tek takas kavganın yönünü çeviriyor.",
      en: "Tōdō forms the clap in his imagination, and the technique works one more time. This is the quietest moment on the page: an image does the work of two hands, and that single swap turns the fight.",
    },
    quote: {
      text: "拍手",
      reading: { tr: "hakushu — alkış", en: "hakushu — the clap" },
      by: { tr: "elleri olmadan kurulan tetikleyici", en: "the trigger formed without hands" },
    },
    imageKey: TOUDOU_IMAGE_KEYS.fatePhantom,
  },
] as const;

/** Kadro — arşivde numarası olanlar bağlanıyor, olmayanlar düz ad. */
export const TOUDOU_BONDS = [
  {
    key: "yuuji",
    name: "Yūji Itadori",
    native: "虎杖悠仁",
    characterId: 127212,
    role: {
      tr: "Kardeşi. Tōdō'nun kendi kararıyla ilan ettiği en iyi dostu.",
      en: "His brother. The best friend Tōdō declared by his own decision.",
    },
  },
  {
    key: "gojou",
    name: "Satoru Gojō",
    native: "五条悟",
    characterId: 127691,
    role: {
      tr: "Ölçüt. Tōdō gücü konuşurken karşılaştırmayı ondan başlatıyor.",
      en: "The benchmark. When Tōdō talks about strength, he starts the comparison there.",
    },
  },
  {
    key: "nobara",
    name: "Nobara Kugisaki",
    native: "釘崎野薔薇",
    characterId: 133700,
    role: {
      tr: "Tokyo Jujutsu Lisesi öğrencisi; Değişim Etkinliği'nin karşı tarafı.",
      en: "A Tokyo Jujutsu High student; the other side of the Goodwill Event.",
    },
  },
  {
    key: "megumi",
    name: "Megumi Fushiguro",
    native: "伏黒恵",
    characterId: 126635,
    role: {
      tr: "Tokyo Jujutsu Lisesi öğrencisi; aynı etkinlikte karşı sahada.",
      en: "A Tokyo Jujutsu High student; on the opposite field at the same event.",
    },
  },
  {
    key: "takada",
    name: "Takada-chan",
    native: "高田ちゃん",
    characterId: null,
    role: {
      tr: "Tōdō'nun idolü. Arşivde numarası yok — bağ kurulmadı.",
      en: "Tōdō's idol. No number in this archive — no link was made.",
    },
  },
  {
    key: "mai",
    name: "Mai Zen'in",
    native: "禪院真依",
    characterId: null,
    role: {
      tr: "Kyoto Jujutsu Lisesi öğrencisi. Arşivde numarası yok — bağ kurulmadı.",
      en: "A Kyoto Jujutsu High student. No number in this archive — no link was made.",
    },
  },
] as const;

export const TOUDOU_BOND_UI = {
  hasPage: { tr: "sayfası var", en: "has a page" },
  noPage: { tr: "sayfası yok", en: "no page" },
  portraitMissing: { tr: "portre yok", en: "no portrait" },
} as const;

/** Kapanış — iki sabit terim, motto ve kaynak künyesi. */
export const TOUDOU_CLOSING = {
  quotes: [
    {
      text: "親友",
      reading: { tr: "shinyū — en iyi dost", en: "shinyū — best friend" },
      note: {
        tr: "Tōdō için bir nezaket sözü değil, tek taraflı bir karar. Karşısındakinin onaylaması gerekmiyor.",
        en: "For Tōdō this is not a courtesy but a one-sided decision. The other person's agreement is not required.",
      },
      by: { tr: "Yūji için kullandığı sözcük", en: "the word he uses for Yūji" },
    },
    {
      text: "黒閃",
      reading: { tr: "kokusen — kara flaş", en: "kokusen — black flash" },
      note: {
        tr: "Öğrettiği tek şey. Tōdō'nun mirası bir teknik değil, bir isabet anının adı.",
        en: "The only thing he taught. Tōdō's legacy is not a technique but the name of a moment of contact.",
      },
      by: { tr: "Yūji'ye bıraktığı terim", en: "the term he left with Yūji" },
    },
  ],
  quoteDiscipline: {
    tr: "Sayfada tırnak içinde yalnızca sabit terimler var. Tōdō'nun konuşmaları çeviriden çeviriye değiştiği için hiçbir diyalog cümlesi orijinal dilde tırnağa alınmadı; imza sorusu aktarılmış söz olarak verildi.",
    en: "Only fixed terms appear in quotation marks on this page. Because Tōdō's lines shift between translations, no dialogue sentence was quoted in the original language; his signature question is given as reported speech.",
  },
  motto: "不義遊戯",
  mottoReading: { tr: "fugi yūgi", en: "fugi yūgi" },
  mottoNote: {
    tr: "Tekniğin adı ve sayfanın mottosu: hakkaniyetsiz oyun. Kurallar herkes için aynı değil — Tōdō alkışladığı anda tahta yeniden diziliyor.",
    en: "The technique's name and the page's motto: the unfair game. The rules are not the same for everyone — the moment Tōdō claps, the board is rearranged.",
  },
  credit: {
    tr: "Künye ve portre: AniList karakter kaydı",
    en: "Record and portrait: AniList character entry",
  },
  creditLink: {
    tr: "anilist.co/character/137975",
    en: "anilist.co/character/137975",
  },
  creditNote: {
    tr: "Portre resmî AniList karesidir ve depoda duruyor (230×345, PNG); hotlink kullanılmadı. Sayfadaki bütün motifler — eller, yıldız patlaması, idol silueti, takas okları — bu sayfa için elle çizilmiş SVG'lerdir. Diğer poster kadrajları boştur ve küratör yüklemesini bekler.",
    en: "The portrait is the official AniList frame, stored in this repository (230×345, PNG); no hotlinking is used. Every motif on this page — the hands, the starburst, the idol silhouette, the swap arrows — is an SVG hand-drawn for this page. The remaining poster frames are empty and await curated uploads.",
  },
} as const;
