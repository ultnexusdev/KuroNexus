import type { LocalizedText } from "./types";

/**
 * Shōto Todoroki — "Yarım ve Yarım" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali): karaktere özel BÜTÜN anlatı kodda, iki dilli
 * `LocalizedText` çiftleri olarak (AGENTS.md kural 1). Bileşen buradan okuyup
 * `pick(text, locale)` ile seçiyor; istemci adasına yalnızca DÜZ DİZE iniyor.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * BÖLÜNME BİR ORAN. Sayfa boyunca inen tek bir dikey çizgi var ve HER bölüm
 * o çizginin iki yanına yerleşiyor: solda buz, sağda alev. Çizginin yeri
 * sabit değil — ziyaretçi bir kaydırakla oranı değiştiriyor ve sayfadaki
 * bütün bölümlerin iki yarısı BİRLİKTE genişleyip daralıyor. Uçlarda (%0 ve
 * %100) bir taraf tamamen kapanıyor ve yerine o tarafsız yaşamanın bedeli
 * yazılıyor.
 *
 * ⚠️ AYNA UYARISI. Kanonda buz onun SAĞ yarısından, alev SOL yarısından
 * geliyor. Sayfa ona BAKIYOR: ziyaretçinin solunda gördüğü sütun onun sağ
 * tarafı. Bu, künye şeridinde açıkça yazılı bir satır olarak duruyor —
 * sessiz bir tercih olarak bırakılmadı.
 *
 * ── KAYNAKLAR (hepsi doğrulandı, 31 Ağustos 2026) ────────────────────────
 * [A] AniList künyesi — arşivin kendi kaydı, `/anime/characters/89220` ve
 *     `public/assets/anime/karakterler/shouto-todoroki/kaynak.json`:
 *     doğum 11 Ocak, kan grubu O, boy 176 cm, yaş "15-", okul U.A.,
 *     Quirk "Half-Cold Half-Hot", diğer adlar arasında "Shouto (ショート)".
 *     Ayrıca açıklama metni: sağ yarı buz / sol yarı alev, tek tarafı aşırı
 *     kullanmanın vücut ısısına bindirdiği bedel, babayı reddetmekten doğan
 *     "buzu yeğleme" alışkanlığı, tavsiyeyle (recommendation) giriş, babası
 *     Endeavor (AniList #126158, kayıtta "Enji Todoroki / 轟炎司").
 * [B] ja.wikipedia.org/wiki/轟焦凍 (31 Ağustos 2026 çekimi) — yalnızca
 *     [A]'da OLMAYAN ve doğrulanması gereken özel adlar, sayılar ve
 *     replikler için:
 *       · Quirk'ün Japoncası 「半冷半燃」
 *       · Hero adı 「ショート」, kendi adından alınmış
 *       · 推薦枠 ile giriş; 2. ciltte 15 yaşında
 *       · beş yaşında kardeşlerinden ayrılıp ağır eğitime sokulması
 *       · annesinin adı 冷 (Rei), ağabeyi 燈矢 (Touya) — sonradan Dabi
 *       · babasının onu 「最高傑作」 diye anması
 *       · Bakugō'nun ona taktığı ad 「半分野郎」
 *       · Spor Festivali replikleri (aşağıda, tırnak içinde)
 *       · Ultimate Move 「大氷海嘯」
 *       · sevdiği şey 「温かくないそば」, sol yarıdaki kızıl saçın doğal olduğu
 *       · babasının sıralaması: 2. ciltte No.2, sonradan No.1
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada tırnak içinde YALNIZCA üç cümle var, üçü de [B]'de birebir yazılı:
 *   「君の力じゃないか！！」        — Midoriya, Spor Festivali
 *   「俺だってヒーローに…！！」      — Todoroki, aynı maçta
 *   「血に囚われることなんかない。なりたい自分になっていいんだよ」 — annesi
 * Emin olunmayan hiçbir cümle tırnağa alınmadı; geri kalan her şey anlatı
 * sesiyle yazıldı.
 *
 * ── TERMİNOLOJİ (MHA evreni — "jutsu"/"teknik" YASAK) ────────────────────
 * 個性 (kosei — Quirk), 半冷半燃 (hanrei hannen — Quirk'ün adı),
 * ヒーロー名 (hero adı), 必殺技/Ultimate Move, 推薦枠 (tavsiye kontenjanı),
 * 雄英高校 (U.A. Lisesi), ヒーロー科1年A組 (Kahramanlık Bölümü 1-A).
 */

export const TDR_ID = 89220;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const TDR_SITE_URL = "https://anilist.co/character/89220";

/**
 * Depodaki resmî portre (Faz 2 §3: hotlink yok, kare repoda).
 *
 * ⚠️ 230×345 — yani KÜÇÜK. Sayfada yalnızca künye madalyonu ölçüsünde
 * kullanılıyor; büyük hero karesi `tdr:hero` küratör yuvası olarak boş
 * bırakıldı. Kendi kaynağımız olduğu için `next/image`de `unoptimized` YOK.
 */
export const TDR_PORTRAIT = {
  src: "/assets/anime/karakterler/shouto-todoroki/anilist-portrait.png",
  w: 230,
  h: 345,
} as const;

/** PORTRAIT yuvasının küratör özetindeki anahtarı (ABILITY değil). */
export const TDR_PORTRAIT_SLOT_KEY = "tdr:portrait";

/**
 * Sergi görselleri — hepsi characterId 89220 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `tdr:` önekli (küratör modu şartı).
 */
export const TDR_IMAGE_KEYS = {
  hero: "tdr:hero",
  quirkIce: "tdr:hanrei",
  quirkFlame: "tdr:hannen",
  quirkCost: "tdr:taion",
  moveUltimate: "tdr:daihyokaisho",
  moveName: "tdr:heroname",
  moveRank: "tdr:rank",
  moveEntry: "tdr:suisenwaku",
  dial: "tdr:wariai",
  fateBorn: "tdr:fate-kessaku",
  fateFive: "tdr:fate-gosai",
  fateScald: "tdr:fate-yakedo",
  fateFestival: "tdr:fate-taiikusai",
  fateAfter: "tdr:fate-sonogo",
  bonds: "tdr:kizuna",
  closing: "tdr:closing",
} as const;

/**
 * Küratör yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur.
 *
 * ⚠️ Bu metinler ZİYARETÇİYE GÖSTERİLMEZ. Yalnızca `isAdmin` dalındaki
 * `CuratorSlot` ve `CuratorGaps` okuyor (Dalga 1 denetiminin 1 numaralı
 * bulgusu: Levi'de üretim metadatası boş kadrajların içine sızmıştı).
 */
export const TDR_SLOT_LABELS: Record<string, LocalizedText> = {
  [TDR_PORTRAIT_SLOT_KEY]: {
    tr: "Portre — dikey tam boy, sade zemin (3:4)",
    en: "Portrait — full figure, vertical, plain ground (3:4)",
  },
  [TDR_IMAGE_KEYS.hero]: {
    tr: "Hero — geniş kadraj, yüz tam ortada, iki yarı da görünsün (16:9)",
    en: "Hero — wide crop, face centred, both halves visible (16:9)",
  },
  [TDR_IMAGE_KEYS.quirkIce]: {
    tr: "Buz yarısı — sağ taraftan çıkan buz duvarı (3:2)",
    en: "The ice half — the wall of ice from his right side (3:2)",
  },
  [TDR_IMAGE_KEYS.quirkFlame]: {
    tr: "Alev yarısı — sol taraftan çıkan alev (3:2)",
    en: "The flame half — the fire from his left side (3:2)",
  },
  [TDR_IMAGE_KEYS.quirkCost]: {
    tr: "Bedel — donma / aşırı ısınma; bedenin kendi ısısı (3:2)",
    en: "The cost — frostbite / overheating; his own body temperature (3:2)",
  },
  [TDR_IMAGE_KEYS.moveUltimate]: {
    tr: "Ultimate Move — tek kare, buzun en büyük hâli (1:1)",
    en: "Ultimate Move — one frame, the ice at its largest (1:1)",
  },
  [TDR_IMAGE_KEYS.moveName]: {
    tr: "Hero adı — kostüm ya da tabela üzerinde ad (1:1)",
    en: "Hero name — the name on the costume or a sign (1:1)",
  },
  [TDR_IMAGE_KEYS.moveRank]: {
    tr: "Sıralama — babasının sıralama karesi; boş bırakılabilir (1:1)",
    en: "The ranking — his father's rank card; may stay empty (1:1)",
  },
  [TDR_IMAGE_KEYS.moveEntry]: {
    tr: "Tavsiye kontenjanı — U.A. kapısı ya da 1-A sınıfı (1:1)",
    en: "Recommendation slot — the U.A. gate or Class 1-A (1:1)",
  },
  [TDR_IMAGE_KEYS.dial]: {
    tr: "Oran — iki yarı aynı karede, tam profil (21:9)",
    en: "The ratio — both halves in one frame, full profile (21:9)",
  },
  [TDR_IMAGE_KEYS.fateBorn]: {
    tr: "Kader 1 — aile fotoğrafı ya da bebeklik karesi (16:9)",
    en: "Fate 1 — a family photograph or an infant frame (16:9)",
  },
  [TDR_IMAGE_KEYS.fateFive]: {
    tr: "Kader 2 — beş yaşındaki eğitim; salon, ter, yalnızlık (16:9)",
    en: "Fate 2 — the training at five; a hall, sweat, solitude (16:9)",
  },
  [TDR_IMAGE_KEYS.fateScald]: {
    tr: "Kader 3 — mutfak; suyun kaynadığı an (16:9)",
    en: "Fate 3 — the kitchen; the moment the water boils (16:9)",
  },
  [TDR_IMAGE_KEYS.fateFestival]: {
    tr: "Kader 4 — Spor Festivali arenası, alevin ilk çıktığı kare (16:9)",
    en: "Fate 4 — the Sports Festival arena, the first ignition (16:9)",
  },
  [TDR_IMAGE_KEYS.fateAfter]: {
    tr: "Kader 5 — hastane koridoru ya da iş deneyimi karesi (16:9)",
    en: "Fate 5 — a hospital corridor or the work-study frame (16:9)",
  },
  [TDR_IMAGE_KEYS.bonds]: {
    tr: "Bağlar — 1-A sırasında ya da aile masasında grup karesi (2:1)",
    en: "Bonds — a group frame in the 1-A row or at the family table (2:1)",
  },
  [TDR_IMAGE_KEYS.closing]: {
    tr: "Kapanış — sırtı dönük, iki yarı da sakin (2:1)",
    en: "Closing — seen from behind, both halves at rest (2:1)",
  },
};

/**
 * Küratör özetindeki teknik künye — beklenen tip ve ölçü.
 * Yine YALNIZCA `isAdmin` dalında okunuyor.
 */
export const TDR_SLOT_SPECS: Record<string, LocalizedText> = {
  [TDR_PORTRAIT_SLOT_KEY]: {
    tr: "dikey portre · 1200×1600 · webp",
    en: "vertical portrait · 1200×1600 · webp",
  },
  [TDR_IMAGE_KEYS.hero]: {
    tr: "geniş kadraj · 1920×1080 · webp",
    en: "wide crop · 1920×1080 · webp",
  },
  [TDR_IMAGE_KEYS.quirkIce]: {
    tr: "yatay sahne · 1200×800 · webp",
    en: "landscape scene · 1200×800 · webp",
  },
  [TDR_IMAGE_KEYS.quirkFlame]: {
    tr: "yatay sahne · 1200×800 · webp",
    en: "landscape scene · 1200×800 · webp",
  },
  [TDR_IMAGE_KEYS.quirkCost]: {
    tr: "yatay sahne · 1200×800 · webp",
    en: "landscape scene · 1200×800 · webp",
  },
  [TDR_IMAGE_KEYS.moveUltimate]: {
    tr: "kare · 800×800 · webp",
    en: "square · 800×800 · webp",
  },
  [TDR_IMAGE_KEYS.moveName]: {
    tr: "kare · 800×800 · webp",
    en: "square · 800×800 · webp",
  },
  [TDR_IMAGE_KEYS.moveRank]: {
    tr: "kare · 800×800 · webp",
    en: "square · 800×800 · webp",
  },
  [TDR_IMAGE_KEYS.moveEntry]: {
    tr: "kare · 800×800 · webp",
    en: "square · 800×800 · webp",
  },
  [TDR_IMAGE_KEYS.dial]: {
    tr: "panorama · 2100×900 · webp",
    en: "panorama · 2100×900 · webp",
  },
  [TDR_IMAGE_KEYS.fateBorn]: {
    tr: "yatay sahne · 1440×810 · webp",
    en: "landscape scene · 1440×810 · webp",
  },
  [TDR_IMAGE_KEYS.fateFive]: {
    tr: "yatay sahne · 1440×810 · webp",
    en: "landscape scene · 1440×810 · webp",
  },
  [TDR_IMAGE_KEYS.fateScald]: {
    tr: "yatay sahne · 1440×810 · webp",
    en: "landscape scene · 1440×810 · webp",
  },
  [TDR_IMAGE_KEYS.fateFestival]: {
    tr: "yatay sahne · 1440×810 · webp",
    en: "landscape scene · 1440×810 · webp",
  },
  [TDR_IMAGE_KEYS.fateAfter]: {
    tr: "yatay sahne · 1440×810 · webp",
    en: "landscape scene · 1440×810 · webp",
  },
  [TDR_IMAGE_KEYS.bonds]: {
    tr: "geniş şerit · 1600×800 · webp",
    en: "wide strip · 1600×800 · webp",
  },
  [TDR_IMAGE_KEYS.closing]: {
    tr: "geniş şerit · 1600×800 · webp",
    en: "wide strip · 1600×800 · webp",
  },
};

/**
 * Yuvaların beklenen piksel ölçüsü — `CuratorSlot`in `size` alanı.
 *
 * `TDR_SLOT_SPECS` aynı sayıyı METİN olarak taşıyor (küratör okusun diye);
 * burası aynı sayının MAKİNE hâli. İkisini ayrı tutmak, ölçüyü metinden
 * ayrıştırmak zorunda kalmamak için.
 */
export const TDR_SLOT_SIZES: Record<string, { w: number; h: number }> = {
  [TDR_PORTRAIT_SLOT_KEY]: { w: 1200, h: 1600 },
  [TDR_IMAGE_KEYS.hero]: { w: 1920, h: 1080 },
  [TDR_IMAGE_KEYS.quirkIce]: { w: 1200, h: 800 },
  [TDR_IMAGE_KEYS.quirkFlame]: { w: 1200, h: 800 },
  [TDR_IMAGE_KEYS.quirkCost]: { w: 1200, h: 800 },
  [TDR_IMAGE_KEYS.moveUltimate]: { w: 800, h: 800 },
  [TDR_IMAGE_KEYS.moveName]: { w: 800, h: 800 },
  [TDR_IMAGE_KEYS.moveRank]: { w: 800, h: 800 },
  [TDR_IMAGE_KEYS.moveEntry]: { w: 800, h: 800 },
  [TDR_IMAGE_KEYS.dial]: { w: 2100, h: 900 },
  [TDR_IMAGE_KEYS.fateBorn]: { w: 1440, h: 810 },
  [TDR_IMAGE_KEYS.fateFive]: { w: 1440, h: 810 },
  [TDR_IMAGE_KEYS.fateScald]: { w: 1440, h: 810 },
  [TDR_IMAGE_KEYS.fateFestival]: { w: 1440, h: 810 },
  [TDR_IMAGE_KEYS.fateAfter]: { w: 1440, h: 810 },
  [TDR_IMAGE_KEYS.bonds]: { w: 1600, h: 800 },
  [TDR_IMAGE_KEYS.closing]: { w: 1600, h: 800 },
};

/* ── Breadcrumb ─────────────────────────────────────────────────────────── */

export const TDR_CRUMB = {
  series: { tr: "My Hero Academia", en: "My Hero Academia" },
} as const;

/* ── alt metinleri ──────────────────────────────────────────────────────── */

export const TDR_ALT = {
  portraitLocal: {
    tr: "Shouto Todoroki — AniList resmî portresi (depodaki kopya)",
    en: "Shouto Todoroki — official AniList portrait (repository copy)",
  },
  portraitUploaded: {
    tr: "Shouto Todoroki — arşive yüklenmiş portre",
    en: "Shouto Todoroki — portrait uploaded to this archive",
  },
  /** Küratör yüklemesi olan sahne kareleri: önek + o kadrajın adı. */
  scenePrefix: {
    tr: "Arşive yüklenmiş kare",
    en: "Frame uploaded to this archive",
  },
  companionSuffix: { tr: "— portre", en: "— portrait" },
} as const;

/* ── 1 · HERO ───────────────────────────────────────────────────────────── */

export const TDR_IDENTITY = {
  name: "Shouto Todoroki",
  nativeName: "轟焦凍",
  /** Filigran: 半分 (hanbun — yarım). Bölünme çizgisinin iki yanına düşüyor. */
  watermarkLeft: "半",
  watermarkRight: "分",
  house: {
    tr: "雄英高校 · Kahramanlık Bölümü 1-A · tavsiye kontenjanı",
    en: "U.A. High School · Hero Course, Class 1-A · recommendation slot",
  },
  epigraph: {
    tr: "Sağ yarısı donduruyor, sol yarısı yakıyor. On beş yaşına kadar yalnızca birini kullandı — çünkü diğeri babasından kalmıştı.",
    en: "His right half freezes, his left half burns. Until he was fifteen he used only one of them — because the other one came from his father.",
  },
  lede: {
    tr: "Bu sayfa ikiye bölünmüş durumda ve bölünme çizgisi en aşağıya kadar iniyor. Soldaki her şey soğuk, sağdaki her şey sıcak. Çizginin yeri sabit değil: aşağıdaki oran kaydırağı onu hareket ettiriyor ve sayfadaki bütün bölümler aynı anda yeniden bölünüyor.",
    en: "This page is split in two and the seam runs all the way down. Everything to the left is cold, everything to the right is hot. The seam is not fixed: the ratio slider below moves it, and every section on the page re-splits at the same moment.",
  },
  /** Ayna uyarısı — sessiz bir tercih olarak bırakılmadı. */
  mirror: {
    tr: "Sayfa ona bakıyor. Solda gördüğünüz sütun onun SAĞ yarısı (buz), sağdaki sütun onun SOL yarısı (alev).",
    en: "The page is facing him. The column on your left is his RIGHT half (ice); the column on your right is his LEFT half (flame).",
  },
  heroFrameCaption: {
    tr: "Büyük kadraj boş: sahne görselleri üretilmiyor, küratör yüklemesi bekliyor.",
    en: "The large frame is empty: scene images are not generated here; it waits for a curator upload.",
  },
} as const;

/* ── 2 · MOD DÜĞMESİ ────────────────────────────────────────────────────── */

/**
 * "Yarım güç" — sayfanın tek modu.
 *
 * ⚠️ Bu düğme kilitli ızgarayı AÇIP KAPATMIYOR (Dalga 1 denetiminin 2
 * numaralı bulgusu). Bölünme her iki durumda da yerinde duruyor; değişen,
 * alev yarısının ÇALIŞIP çalışmadığı. Varsayılan `half`, çünkü karakterin
 * kendi başlangıç ayarı bu.
 */
export const TDR_MODE = {
  title: { tr: "Yarım güç", en: "Half power" },
  native: "半分の力",
  toFull: { tr: "Sol yarıyı aç", en: "Open the left half" },
  toHalf: { tr: "Sol yarıyı kapat", en: "Shut the left half down" },
  stateHalf: {
    tr: "YARIM — sağ yarı çalışıyor, sol yarı sönük.",
    en: "HALF — the right half is working, the left half is out.",
  },
  stateFull: {
    tr: "TAM — iki yarı da çalışıyor.",
    en: "FULL — both halves are working.",
  },
  hintHalf: {
    tr: "Sayfanın alev tarafı külün rengine düştü ve o taraftaki hareket durdu. Kendi kuralı buydu: babasından kalan yarıyı kullanmadan bir numara olmak.",
    en: "The flame side of this page has dropped to the colour of ash and the motion on that side has stopped. This was his own rule: to become number one without using the half he inherited from his father.",
  },
  hintFull: {
    tr: "Alev tarafı geri geldi. Bölünme kapanmadı — yalnızca bir reddediş olmaktan çıktı.",
    en: "The flame side is back. The split has not closed — it has only stopped being a refusal.",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const TDR_SECTIONS = {
  dossier: {
    title: { tr: "Künye", en: "Dossier" },
    native: "戸籍",
    lede: {
      tr: "Soğuk sütunda sayılar, sıcak sütunda aidiyet. İkisi de aynı kişiye ait ve ikisi de aynı künyeden geliyor.",
      en: "Numbers in the cold column, belonging in the hot one. Both describe the same person and both come from the same record.",
    },
  },
  quirk: {
    title: { tr: "Quirk laboratuvarı", en: "Quirk laboratory" },
    native: "個性",
    lede: {
      tr: "Üç büyük kart Quirk'ün kendisini, dört küçük kart onun etrafındaki kayıtları taşıyor. Hepsi künyeden ve doğrulanmış kaynaktan; hiçbiri bu sayfada uydurulmadı.",
      en: "Three large cards carry the Quirk itself; four small ones carry the records around it. All of them come from the dossier and from a verified source; none was invented on this page.",
    },
  },
  dial: {
    title: { tr: "Bölünme oranı", en: "The split ratio" },
    native: "割合",
    lede: {
      tr: "Tek bir kontrol, sayfanın tamamı. Kaydırağı oynattığınızda yukarıdaki ve aşağıdaki her bölüm birlikte yeniden bölünüyor. İki uçta bir taraf tamamen kapanıyor.",
      en: "One control, the whole page. Move the slider and every section above and below re-splits together. At either end one side shuts down completely.",
    },
  },
  fate: {
    title: { tr: "Kader çizelgesi", en: "The fate ledger" },
    native: "経歴",
    lede: {
      tr: "Beş durak. Yaş etiketleri kaynakta yazılı olduğu yerde sayı, yazılı olmadığı yerde dönem adı.",
      en: "Five stops. The age labels are numbers where the source gives one and period names where it does not.",
    },
  },
  bonds: {
    title: { tr: "Çizginin iki yanı", en: "Both sides of the seam" },
    native: "絆",
    lede: {
      tr: "Soğuk tarafta aile, sıcak tarafta okul. Arşivde kendi dosyası olan adlar bağlantılı, olmayanlar yalnızca ad olarak duruyor.",
      en: "Family on the cold side, school on the hot one. Names with their own file in this archive are linked; the rest stand as names only.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    native: "結び",
    lede: {
      tr: "İki replik ve dört karakter. Sayfanın tamamı bu dördünün açılımı.",
      en: "Two lines and four characters. This whole page is an unfolding of those four.",
    },
  },
} as const;

/* ── 3 · KÜNYE ŞERİDİ ───────────────────────────────────────────────────── */

/** Soğuk sütun: ölçüler ve sayılar. Hepsi AniList künyesinden [A]. */
export const TDR_FACTS_ICE = [
  {
    key: "dogum",
    label: { tr: "Doğum", en: "Birthday" },
    value: { tr: "11 Ocak", en: "11 January" },
    native: "1月11日",
  },
  {
    key: "boy",
    label: { tr: "Boy", en: "Height" },
    value: { tr: "176 cm", en: "176 cm" },
    native: "176cm",
  },
  {
    key: "kan",
    label: { tr: "Kan grubu", en: "Blood type" },
    value: { tr: "O", en: "O" },
    native: "O型",
  },
  {
    key: "yas",
    label: { tr: "Yaş", en: "Age" },
    value: { tr: "15", en: "15" },
    native: "15歳",
  },
] as const;

/** Sıcak sütun: aidiyet, ad ve simge. [A] + [B]. */
export const TDR_FACTS_FLAME = [
  {
    key: "okul",
    label: { tr: "Okul", en: "School" },
    value: {
      tr: "U.A. Lisesi · Kahramanlık Bölümü 1-A",
      en: "U.A. High School · Hero Course, Class 1-A",
    },
    native: "雄英高校ヒーロー科1年A組",
  },
  {
    key: "giris",
    label: { tr: "Giriş", en: "Admission" },
    value: {
      tr: "Tavsiye kontenjanı — sınavla değil",
      en: "Recommendation slot — not by entrance exam",
    },
    native: "推薦枠",
  },
  {
    key: "quirk",
    label: { tr: "Quirk", en: "Quirk" },
    value: {
      tr: "Yarı Soğuk Yarı Sıcak",
      en: "Half-Cold Half-Hot",
    },
    native: "半冷半燃",
  },
  {
    key: "heroname",
    label: { tr: "Hero adı", en: "Hero name" },
    value: {
      tr: "Shōto — kendi adı",
      en: "Shoto — his own given name",
    },
    native: "ショート",
  },
  {
    key: "simge",
    label: { tr: "Simge", en: "Emblem" },
    value: {
      tr: "Sol gözünü çevreleyen yanık izi",
      en: "The burn scar around his left eye",
    },
    native: "火傷",
  },
  {
    key: "sevdigi",
    label: { tr: "Sevdiği şey", en: "Favourite thing" },
    value: {
      tr: "Sıcak olmayan soba",
      en: "Soba that is not warm",
    },
    native: "温かくないそば",
  },
] as const;

/** Künye şeridinin altındaki not — saçın iki rengi kaynakta yazılı. */
export const TDR_FACT_NOTE: LocalizedText = {
  tr: "Sol yarıdaki kızıl saç boya değil: kaynakta doğal olduğu ayrıca kayıtlı. Bölünme bedeninin her yerinde ve doğduğu andan beri orada.",
  en: "The red hair on the left half is not dyed: the source records it as natural. The split is everywhere on his body and has been there since he was born.",
};

/* ── 4 · QUIRK LABORATUVARI ─────────────────────────────────────────────── */

/** Üç büyük kart — Quirk'ün kendisi. */
export const TDR_QUIRK = [
  {
    key: "hanrei",
    side: "ice",
    name: "半冷半燃",
    reading: { tr: "hanrei hannen", en: "hanrei hannen" },
    title: { tr: "Yarı Soğuk Yarı Sıcak", en: "Half-Cold Half-Hot" },
    tagline: {
      tr: "İki Quirk değil. Tek bir Quirk'in iki yarısı.",
      en: "Not two Quirks. Two halves of one Quirk.",
    },
    text: {
      tr: "Sağ yarısıyla donduruyor, sol yarısıyla yakıyor. Anne ve babadan gelen iki ayrı Quirk'ü birlikte devralan tek çocuk o; kardeşlerinin hiçbirinde ikisi bir arada değil. Kayıtta güç «tek bir 個性» olarak geçiyor — yani iki yarı birbirinin yedeği değil, birbirinin şartı.",
      en: "He freezes with his right half and burns with his left. He is the only child who inherited both of his parents' separate Quirks together; none of his siblings carries the two at once. The record lists it as a single 個性 — the two halves are not each other's backup but each other's condition.",
    },
    traits: [
      { tr: "Sağ yarı — buz", en: "Right half — ice" },
      { tr: "Sol yarı — alev", en: "Left half — flame" },
      { tr: "Tek kayıt, iki miras", en: "One record, two inheritances" },
    ],
    imageKey: TDR_IMAGE_KEYS.quirkIce,
  },
  {
    key: "taion",
    side: "flame",
    name: "体温",
    reading: { tr: "taion", en: "taion" },
    title: { tr: "Vücut ısısı — bedel", en: "Body temperature — the cost" },
    tagline: {
      tr: "Tek tarafı uzun kullanmak karşıdakini değil onu vuruyor.",
      en: "Using one side for long does not hit the opponent; it hits him.",
    },
    text: {
      tr: "Yalnızca buzu kullandığında kendi bedeni donuyor, yalnızca alevi kullandığında aşırı ısınıyor. Kaynak bunu net yazıyor: iki yeteneğin işi birbirinin ısısını ayarlamak. Yani «yarım güçle savaşmak» bir tercih değil, sayaçlı bir borç — ve sayacı tutan kendi vücudu.",
      en: "Using only the ice freezes his own body; using only the flame overheats it. The source is explicit: the job of the two abilities is to regulate each other's temperature. So fighting at half power is not a preference but a debt on a meter — and the meter is his own body.",
    },
    traits: [
      { tr: "Uzun buz → donma", en: "Long ice → frostbite" },
      { tr: "Uzun alev → aşırı ısınma", en: "Long flame → overheating" },
      { tr: "Denge iki yarının işi", en: "Balance is both halves' work" },
    ],
    imageKey: TDR_IMAGE_KEYS.quirkCost,
  },
  {
    key: "kyohi",
    side: "flame",
    name: "拒絶",
    reading: { tr: "kyozetsu", en: "kyozetsu" },
    title: { tr: "Sol yarının reddi", en: "The refusal of the left half" },
    tagline: {
      tr: "Ateşin işe yarayacağı yerde bile buzu seçme alışkanlığı.",
      en: "The habit of choosing ice even where fire would work better.",
    },
    text: {
      tr: "Babasını yıllarca reddettiği için alevi kullanmamayı huy edindi; kayıtta bu, ateşi kontrol etmekte zorlanmasının da sebebi olarak geçiyor. Hedefi babasından kalan yarıyı hiç kullanmadan bir numara olmak, yani onu tamamen yok saymaktı. Bu sayfanın kaydırağı tam olarak o kararın ayarı.",
      en: "Years of rejecting his father turned not using the flame into a habit; the record names the same grudge as the reason he struggles to control the fire. His aim was to become number one without ever using his father's half — to negate him completely. The slider on this page is the setting of exactly that decision.",
    },
    traits: [
      { tr: "Buzu yeğleme alışkanlığı", en: "The habit of favouring ice" },
      { tr: "Alevi zor denetleme", en: "Trouble controlling the flame" },
      { tr: "Reddediş bir savaş biçimi", en: "Refusal as a way of fighting" },
    ],
    imageKey: TDR_IMAGE_KEYS.quirkFlame,
  },
] as const;

/**
 * Dört küçük kart — Quirk'ün ETRAFINDAKİ kayıtlar.
 *
 * Evrenin gerçek terminolojisi (Faz 2 §4): Ultimate Move, ヒーロー名,
 * kahraman sıralaması, 推薦枠. "Jutsu" ya da "teknik" kelimesi geçmiyor.
 */
export const TDR_MOVES = [
  {
    key: "ultimate",
    kind: { tr: "Ultimate Move", en: "Ultimate Move" },
    name: "大氷海嘯",
    side: "ice",
    note: {
      tr: "Buzun en büyük hâli. Kaynakta son savaşta, ağabeyinin patlamasını durdurmak için kullandığı hamle olarak kayıtlı; hemen ardından yere yığılıyor.",
      en: "The ice at its largest. The source records it as the move he used in the final battle to stop his elder brother's explosion; he collapses right after it.",
    },
    imageKey: TDR_IMAGE_KEYS.moveUltimate,
  },
  {
    key: "heroname",
    kind: { tr: "Hero adı", en: "Hero name" },
    name: "ショート",
    side: "flame",
    note: {
      tr: "Ne babasının adı ne yeni bir buluş: kendi adından alındı. Bir kahraman adı seçme fırsatını kimliğini değiştirmemek için kullandı.",
      en: "Neither his father's name nor a new invention: it is taken from his own. He used the one chance to pick a hero name on not changing who he was.",
    },
    imageKey: TDR_IMAGE_KEYS.moveName,
  },
  {
    key: "rank",
    kind: { tr: "Kahraman sıralaması", en: "Hero ranking" },
    name: "—",
    side: "ice",
    note: {
      tr: "Yok: öğrenci. Bu ailede sıralama babada — künye onu «top hero» diye anıyor, ayrıntılı kaynak ise ikinci sıradan birinci sıraya geçişini kaydediyor. Boş kalan bu kutu sayfanın en dürüst yeri.",
      en: "None: he is a student. In this family the ranking belongs to the father — the dossier calls him “top hero”, and the detailed source records his move from second place to first. This empty box is the most honest spot on the page.",
    },
    imageKey: TDR_IMAGE_KEYS.moveRank,
  },
  {
    key: "suisen",
    kind: { tr: "Giriş", en: "Admission" },
    name: "推薦枠",
    side: "flame",
    note: {
      tr: "U.A.'ya giriş sınavıyla değil tavsiye kontenjanıyla girdi. Sınıfın çoğundan farklı bir kapıdan geldi ve o kapı da babasının adıyla açıldı.",
      en: "He entered U.A. through the recommendation slot, not the entrance exam. He came through a different door from most of his class — and that door opened with his father's name.",
    },
    imageKey: TDR_IMAGE_KEYS.moveEntry,
  },
] as const;

/* ── 5 · İNTERAKTİF BÖLÜM — oran kaydırağı ─────────────────────────────── */

/**
 * Kaydırak metinleri.
 *
 * ⚠️ `bands` DÜZ DİZE DEĞİL, `LocalizedText` (Dalga 1 denetiminin 3 numaralı
 * bulgusu: Mikasa'da okuma alanı düz string'ti ve İngilizce sayfada Türkçe
 * görünüyordu). Bileşen bandı sunucuda `pick` ile seçip istemci adasına düz
 * dize olarak indiriyor.
 */
export const TDR_DIAL = {
  sliderLabel: {
    tr: "Bölünme oranı — soldaki buz yarısının genişliği, yüzde",
    en: "Split ratio — the width of the ice half on the left, per cent",
  },
  /**
   * Kaydırağın iki ucundaki etiket.
   *
   * ⚠️ 31 Ağustos 2026'da DÜZELTİLDİ. Değerler ters yazılmıştı: `iceEnd`
   * "yalnız alev" diyordu. Kaydırağın değeri BUZ sütununun genişliği, yani
   * sağ uç (100) buzun tamamı. `iceEnd` sağ uçta, `flameEnd` sol uçta duruyor
   * ve ikisi de kendi rengini okuyor — eski hâlde "yalnız alev" yazısı buz
   * renginde çıkacaktı.
   */
  iceEnd: { tr: "yalnız buz", en: "ice only" },
  flameEnd: { tr: "yalnız alev", en: "flame only" },
  /**
   * Kaydırağın `aria-valuetext`i — oran ekran okuyucuda ANLAMLI okunsun.
   * `{ice}` ve `{flame}` istemci adasında sayıyla değiştiriliyor; ham yüzde
   * ("70") tek başına hangi tarafın baskın olduğunu söylemiyordu.
   */
  valueText: {
    tr: "yüzde {ice} buz, yüzde {flame} alev",
    en: "{ice} per cent ice, {flame} per cent flame",
  },
  iceLabel: { tr: "Buz", en: "Ice" },
  flameLabel: { tr: "Alev", en: "Flame" },
  readoutLabel: { tr: "Şu anki ayar", en: "Current setting" },
  presetsLabel: { tr: "Hazır ayarlar", en: "Presets" },
  presetFlame: { tr: "Yalnız alev", en: "Flame only" },
  presetHalf: { tr: "Yarım yarım", en: "Half and half" },
  presetIce: { tr: "Yalnız buz", en: "Ice only" },
  keyboardHint: {
    tr: "Kaydırak klavyeyle de çalışıyor: ok tuşları beşer beşer, Home ve End uçlara götürür.",
    en: "The slider works from the keyboard too: arrow keys move in fives, Home and End jump to the ends.",
  },
  frameCaption: {
    tr: "Oran karesi boş: bu bölümün görseli küratör yüklemesi bekliyor.",
    en: "The ratio frame is empty: this section's image waits for a curator upload.",
  },
  /**
   * Oran bantları. `upTo` DAHİL: değer ilk eşleşen banda düşer.
   * Uçlar (0 ve 100) ayrı bantlar, çünkü orada bir sütun tamamen kapanıyor.
   */
  bands: [
    {
      upTo: 0,
      title: { tr: "Sıfır buz", en: "Zero ice" },
      text: {
        tr: "Buz yarısı kapandı ve sayfadan da düştü. Bu ayarda serinletecek hiçbir şey kalmıyor: alev karşısındakini değil, önce onu ısıtıyor. Kaynak bunu «aşırı ısınma» diye yazıyor; sayfa bunu boş bir sütun diye yazıyor.",
        en: "The ice half has shut down and dropped out of the page. At this setting there is nothing left to cool anything: the flame heats him before it heats anyone else. The source calls that overheating; this page calls it a column that is gone.",
      },
    },
    {
      upTo: 20,
      title: { tr: "Neredeyse hepsi alev", en: "Almost all flame" },
      text: {
        tr: "Buz sütunu bir şeride indi. Metin hâlâ orada ama okumak için sıkışmak gerekiyor — bir tarafı yok saymanın bedeli önce okunaklılıkta görünüyor.",
        en: "The ice column has narrowed to a strip. The text is still there but you have to squeeze to read it — the cost of ignoring one side shows up first as legibility.",
      },
    },
    {
      upTo: 40,
      title: { tr: "Alev ağır basıyor", en: "The flame leads" },
      text: {
        tr: "Sıcak taraf sayfanın çoğunu tutuyor. Bu ayar kanonda çok geç geliyor: alevi rahatça kullanmaya başlaması yıllar sürdü.",
        en: "The hot side holds most of the page. In the canon this setting arrives very late: it took years before he could use the flame freely.",
      },
    },
    {
      upTo: 59,
      title: { tr: "Yarım yarım", en: "Half and half" },
      text: {
        tr: "İki sütun da tam. Adının, Quirk'ünün ve saçının anlattığı ayar bu; kaynağın «iki yetenek birbirinin ısısını ayarlar» dediği denge de burada.",
        en: "Both columns are whole. This is the setting his name, his Quirk and his hair all describe; it is also the balance the source means when it says the two abilities regulate each other's temperature.",
      },
    },
    {
      upTo: 79,
      title: { tr: "Buz ağır basıyor", en: "The ice leads" },
      text: {
        tr: "Soğuk taraf öne geçti. On beş yaşına kadar sayfanın varsayılanı buydu ve kimse ona bunun bir tercih olduğunu söylemedi.",
        en: "The cold side has taken the lead. Until he was fifteen this was the page's default, and nobody told him it was a choice.",
      },
    },
    {
      upTo: 99,
      title: { tr: "Neredeyse hepsi buz", en: "Almost all ice" },
      text: {
        tr: "Alev sütunu bir şeride indi. Görünürde kayıp yok — kayıp, o şeridin içinde okunamayan cümlelerde.",
        en: "The flame column has narrowed to a strip. Nothing looks lost — the loss is in the sentences you can no longer read inside it.",
      },
    },
    {
      upTo: 100,
      title: { tr: "Sıfır alev", en: "Zero flame" },
      text: {
        tr: "Alev yarısı kapandı ve sayfadan da düştü. On beş yaşına kadar kendi seçtiği ayar buydu: babasından kalan yarıyı hiç kullanmadan bir numara olmak. Bedeli kaynakta yazılı — uzun buz kendi bedenini donduruyor. Yok saydığı yarı yine de onun.",
        en: "The flame half has shut down and dropped out of the page. Until he was fifteen this was the setting he chose himself: to be number one without ever using his father's half. The cost is in the record — long ice freezes his own body. The half he refuses is still his.",
      },
    },
  ],
  /** Uçlarda çıkan bedel paneli — sütunun yerini alan metin. */
  costTitle: { tr: "Kapanan tarafın bedeli", en: "The cost of the closed side" },
} as const;

/* ── 6 · KADER ÇİZELGESİ ────────────────────────────────────────────────── */

/**
 * Beş durak.
 *
 * Yaş etiketleri: 5 ve 15 kaynakta yazılı [B]. İlk ve üçüncü durakta sayı
 * yok — uydurulmuş bir yaş yazmak yerine dönem adı kullanıldı ve gerekçesi
 * `TDR_MISSING_NOTE`'ta duruyor.
 */
export const TDR_TIMELINE = [
  {
    key: "kessaku",
    age: { tr: "doğum", en: "birth" },
    side: "flame",
    title: { tr: "«En büyük eser»", en: "“The greatest work”" },
    text: {
      tr: "Babası kendi gücüyle zirveye çıkamayacağını düşündü ve güçlü bir Quirk'ü olan bir eş seçti. İki Quirk'ü birden devralan çocuk doğduğunda ona kaynakta geçen sıfatı verdi: «en büyük eser». Bir isim değil, bir teknik değerlendirme.",
      en: "His father judged that he could not reach the top on his own strength and chose a spouse with a powerful Quirk. When the child who inherited both Quirks was born, he gave him the epithet the source records: “the greatest work”. Not a name — a technical assessment.",
    },
    imageKey: TDR_IMAGE_KEYS.fateBorn,
    /* ⚠️ `quote` VE `memory` beş durakta da yazılı, boş olsa bile `null`.
       Dizi `as const`: bir alan yalnızca bazı üyelerde geçerse birleşim
       tipinde o alan HİÇ olmuyor ve `step.memory` derlemede patlıyor
       (31 Ağustos 2026'da üç durakta eksikti, tsc yakaladı). */
    quote: null,
    memory: null,
  },
  {
    key: "gosai",
    age: { tr: "5 yaş", en: "age 5" },
    side: "ice",
    title: { tr: "Kardeşlerinden ayrılma", en: "Taken from his siblings" },
    text: {
      tr: "Beş yaşındayken ablasından ve ağabeylerinden ayrıldı; babası onları «başka bir dünyanın insanları» sayıyordu. O yaştan sonra günleri ağır bir eğitim programına bağlandı. Bu sayfadaki kaydırağın en uca dayandığı yer burası: bir çocuk, tek bir amaç için ayarlanmış.",
      en: "At five he was separated from his sister and brothers; his father considered them people of a different world. From that age his days were bound to a punishing training regime. This is where the slider on this page is pushed all the way over: a child tuned for a single purpose.",
    },
    imageKey: TDR_IMAGE_KEYS.fateFive,
    quote: null,
    memory: null,
  },
  {
    key: "yakedo",
    age: { tr: "çocukluk", en: "childhood" },
    side: "flame",
    title: { tr: "Kaynar su", en: "Boiling water" },
    text: {
      tr: "Annesi çocuklarının babalarına benzemeye başladığını hissetti ve oğlunun sol yarısına bakamaz oldu. Bir gün o yarıya kaynar su döktü; yanık izi kaldı. Olaydan sonra anne hastaneye yatırıldı. Sayfanın sağ sütunu tam olarak o yarı.",
      en: "His mother felt her children starting to resemble their father and could no longer bear to look at her son's left half. One day she poured boiling water over it; the burn stayed. After the incident she was hospitalised. The right-hand column of this page is exactly that half.",
    },
    imageKey: TDR_IMAGE_KEYS.fateScald,
    quote: null,
    memory: null,
  },
  {
    key: "taiikusai",
    age: { tr: "15 yaş", en: "age 15" },
    side: "ice",
    title: { tr: "Spor Festivali", en: "The Sports Festival" },
    text: {
      tr: "Midoriya'yla maçında yalnızca buzu kullandı. Maçın doruğunda karşısındaki ona bağırdı; annesinin bir cümlesini hatırladı; ve on yıl sonra ilk kez sol yarısını yaktı. Aynı vuruşla maçı kazandı — ama sayfada kalan şey skor değil, kostümünün yanıp düşen sol yarısı.",
      en: "In his bout against Midoriya he used only the ice. At the peak of the match his opponent shouted at him; he remembered a sentence of his mother's; and for the first time in ten years he lit his left half. He won the bout with that same strike — but what stays on the page is not the score, it is the left half of his costume burning away.",
    },
    imageKey: TDR_IMAGE_KEYS.fateFestival,
    quote: {
      text: "君の力じゃないか！！",
      reading: {
        tr: "«O senin gücün, değil mi!!»",
        en: "“That's your power, isn't it!!”",
      },
      by: { tr: "Izuku Midoriya", en: "Izuku Midoriya" },
    },
    /** Aynı sahnede hatırlanan ikinci cümle — annesinin. */
    memory: {
      text: "血に囚われることなんかない。なりたい自分になっていいんだよ",
      reading: {
        tr: "«Kanına tutsak olmak zorunda değilsin. İstediğin kişi olabilirsin.»",
        en: "“You don't have to be a prisoner of your blood. You may become whoever you want to be.”",
      },
      by: { tr: "annesi Rei", en: "his mother Rei" },
    },
  },
  {
    key: "sonogo",
    age: { tr: "15 yaş", en: "age 15" },
    side: "flame",
    title: { tr: "Sonrası", en: "Afterwards" },
    text: {
      tr: "Bölünme bir maçta kapanmadı: sonraki dövüşünde yine yalnız buzu kullandı. İş deneyimi için babasının ofisini seçti ve alevi orada kullanmaya başladı. Festivalden sonraki ilk boş günde «istenmesem de kurtaracağım» diye karar verip annesini görmeye gitti. Kaydırak bir kere değil, yıllara yayılarak orta noktaya geldi.",
      en: "The split did not close in a single match: in his next fight he again used only the ice. He chose his father's agency for his work-study and began using the flame there. On the first free day after the festival he decided he would pull her out even unwanted, and went to see his mother. The slider did not snap to the middle; it took years to get there.",
    },
    imageKey: TDR_IMAGE_KEYS.fateAfter,
    quote: {
      text: "俺だってヒーローに…！！",
      reading: {
        tr: "«Ben de bir kahraman…!!»",
        en: "“I want to be a hero too…!!”",
      },
      by: { tr: "Shouto Todoroki", en: "Shouto Todoroki" },
    },
    memory: null,
  },
] as const;

/** Yaş etiketlerindeki boşluğun açıklaması — çekirdek değil, ikinci derece. */
export const TDR_MISSING_NOTE: LocalizedText = {
  tr: "İki durakta yaş sayısı yok, çünkü kaynakta yok. AniList kaydındaki yaş alanı «15-» yazıyor — açık uçlu bir işaret. Beş yaşındaki ayrılık ve on beşindeki festival kaynakta sayıyla geçiyor; kaynar su olayının yılı geçmiyor. Buraya tahmin yazmak sayfanın kendi kuralını bozardı.",
  en: "Two stops carry no age number because the source carries none. The age field on the AniList record reads “15-”, an open-ended marker. The separation at five and the festival at fifteen are given as numbers; the year of the boiling water is not. Writing a guess here would break this page's own rule.",
};

/* ── 7a · ÇİZGİNİN İKİ YANI ─────────────────────────────────────────────── */

/**
 * Yoldaşlar.
 *
 * ⚠️ Buradaki BEŞ kimliğin beşi de `EXPERIENCE_COMPANIONS[89220]` listesinde
 * (merkezde yazılı: 89028, 88892, 89224, 126378, 89225). Portresi çizilen
 * her kimliğin o listede olması Dalga 1 denetiminin 4 numaralı bulgusuydu —
 * Armin sayfası Levi'yi çiziyordu ama liste onu taşımıyordu.
 *
 * ⚠️ Babası Enji Todoroki / Endeavor (#126158) ve annesi Rei listede YOK.
 * Bu yüzden ikisinin de PORTRE KADRAJI ÇİZİLMEDİ — sayfada yalnızca anlatı
 * içinde, adla geçiyorlar. Kadraj açmak, listeye girmedikleri sürece
 * sonsuza kadar boş duracak bir kutu açmak olurdu.
 */
export const TDR_BONDS = [
  {
    characterId: 126378,
    name: "Dabi",
    nativeName: "荼毘",
    side: "ice",
    role: { tr: "Ağabeyi", en: "His elder brother" },
    note: {
      tr: "Kaynak onu Todoroki'nin ağabeyi Touya olarak kaydediyor; son savaşta karşı karşıya geliyorlar. Aynı ailenin aynı ateşi, başka bir yöne dönmüş hâli.",
      en: "The source records him as Touya, Todoroki's elder brother; they face each other in the final battle. The same family's same fire, turned the other way.",
    },
  },
  {
    characterId: 89028,
    name: "Izuku Midoriya",
    nativeName: "緑谷出久",
    side: "flame",
    role: { tr: "Bağıran kişi", en: "The one who shouted" },
    note: {
      tr: "Spor Festivali'ndeki maçta ona «o senin gücün» diye bağıran kişi. Sayfanın kaydırağını ilk oynatan el bu.",
      en: "The one who shouted “that's your power” at him in the Sports Festival bout. This is the hand that first moved the slider on this page.",
    },
  },
  {
    characterId: 88892,
    name: "Katsuki Bakugou",
    nativeName: "爆豪勝己",
    side: "flame",
    role: { tr: "Sınıf arkadaşı", en: "Classmate" },
    note: {
      tr: "Ona taktığı ad kaynakta yazılı: 半分野郎 — «yarım herif». Sayfanın bütün fikri, bir hakaretin aslında doğru bir tarif olmasında.",
      en: "The nickname he gave him is in the record: 半分野郎 — “half-bastard”. This whole page rests on an insult that happens to be an accurate description.",
    },
  },
  {
    characterId: 89224,
    name: "Toshinori Yagi",
    nativeName: "八木俊典",
    side: "flame",
    role: { tr: "Sembol", en: "The symbol" },
    note: {
      tr: "Babasının aşamadığı isim ve 1-A'nın öğretmeni. Todoroki'nin doğması için verilen kararın sebebi bu adamdı; kendisinin bundan haberi bile yoktu.",
      en: "The name his father could not surpass, and a teacher of Class 1-A. This man was the reason for the decision that produced Todoroki; he himself had no idea.",
    },
  },
  {
    characterId: 89225,
    name: "Shouta Aizawa",
    nativeName: "相澤消太",
    side: "flame",
    role: { tr: "Sınıf öğretmeni", en: "Homeroom teacher" },
    note: {
      tr: "1-A'nın sorumlusu; künyesinde mesleği «Pro Hero, öğretmen» diye kayıtlı. Tavsiyeyle gelen öğrenciye de aynı ölçütü uygulayan kişi.",
      en: "The teacher in charge of Class 1-A; his record lists his occupation as “Pro Hero, Teacher”. The person who applies the same standard to a student who arrived on a recommendation.",
    },
  },
] as const;

export const TDR_BOND_UI = {
  iceHeading: { tr: "Soğuk taraf — aile", en: "Cold side — family" },
  flameHeading: { tr: "Sıcak taraf — okul", en: "Hot side — school" },
  hasPage: { tr: "arşivde dosyası var", en: "has a file in this archive" },
  noPage: { tr: "kendi dosyası yok", en: "no file of their own" },
  parentsNote: {
    tr: "Babası Enji Todoroki (Endeavor) ve annesi Rei bu şeritte portresiz duruyor: ikisi de arşivin bu sayfaya bağladığı portre listesinde değil, boş bir kadraj açmak yerine adlarıyla anıldılar.",
    en: "His father Enji Todoroki (Endeavor) and his mother Rei stand in this strip without portraits: neither is on the portrait list the archive binds to this page, so they are named rather than given a frame that would stay empty.",
  },
} as const;

/* ── 7b · KAPANIŞ ───────────────────────────────────────────────────────── */

export const TDR_CLOSING = {
  quotes: [
    {
      text: "君の力じゃないか！！",
      side: "flame",
      reading: {
        tr: "«O senin gücün, değil mi!!»",
        en: "“That's your power, isn't it!!”",
      },
      by: { tr: "Izuku Midoriya", en: "Izuku Midoriya" },
      note: {
        tr: "Spor Festivali'ndeki maçın doruğunda. Bir teşvik değil bir düzeltme: karşısındaki, Todoroki'nin kendi bedeninin yarısını babasına ait sanmasını itiraz olarak karşılıyor.",
        en: "At the peak of the Sports Festival bout. Not encouragement but a correction: his opponent objects to Todoroki treating half of his own body as his father's property.",
      },
    },
    {
      text: "俺だってヒーローに…！！",
      side: "ice",
      reading: {
        tr: "«Ben de bir kahraman…!!»",
        en: "“I want to be a hero too…!!”",
      },
      by: { tr: "Shouto Todoroki", en: "Shouto Todoroki" },
      note: {
        tr: "Aynı maçta, alevi ilk kez yaktığı an. Cümle yarım kalıyor ve öyle kalması doğru: o an bitmiş bir karar değil, başlamış bir cümle.",
        en: "In the same bout, at the moment he first lit the flame. The sentence stops halfway, and it is right that it does: what happens there is not a finished decision but a sentence that has begun.",
      },
    },
  ],
  motto: "半冷半燃",
  mottoGloss: [
    { char: "半", side: "ice", text: { tr: "yarı", en: "half" } },
    { char: "冷", side: "ice", text: { tr: "soğuk", en: "cold" } },
    { char: "半", side: "flame", text: { tr: "yarı", en: "half" } },
    { char: "燃", side: "flame", text: { tr: "yanan", en: "burning" } },
  ],
  mottoNote: {
    tr: "Dört karakter, iki kez «yarım». Quirk'ün adı bir toplama değil bir bölme işlemi: bütünü tarif etmiyor, bütünün nasıl ikiye ayrıldığını tarif ediyor. Sayfanın kaydırağı da bunun için var — ayarı değiştirebilirsiniz, bölünmeyi kaldıramazsınız.",
    en: "Four characters, and “half” twice. The name of the Quirk is not an addition but a division: it does not describe a whole, it describes how a whole is cut in two. That is what the slider on this page is for — you can change the setting, you cannot remove the split.",
  },
  credit: {
    tr: "Künye, portre, doğum günü, boy, kan grubu ve Quirk adı AniList'ten alındı; portre karesi depoda duruyor (hotlink yok):",
    en: "Dossier, portrait, birthday, height, blood type and Quirk name come from AniList; the portrait file lives in this repository (no hotlinking):",
  },
  creditLink: {
    tr: "AniList · Shouto Todoroki #89220",
    en: "AniList · Shouto Todoroki #89220",
  },
  creditSecond: {
    tr: "Japonca özel adlar (半冷半燃, ショート, 推薦枠, 大氷海嘯), beş ve on beş yaş kayıtları, aile adları ve tırnak içindeki üç replik ja.wikipedia.org'daki «轟焦凍» maddesinden doğrulandı (31 Ağustos 2026).",
    en: "The Japanese proper names (半冷半燃, ショート, 推薦枠, 大氷海嘯), the ages five and fifteen, the family names and the three quoted lines were verified against the “轟焦凍” article on ja.wikipedia.org (31 August 2026).",
  },
  creditNote: {
    tr: "Sayfadaki bütün sahne kadrajları boş: sahne, dönem ve Quirk görselleri üretilmiyor, küratör yüklemesi bekliyor. Kar tanesi ve alev konturu elle çizilmiş SVG.",
    en: "Every scene frame on this page is empty: scene, era and Quirk images are not generated here and wait for a curator upload. The snowflake and the flame contour are hand-drawn SVGs.",
  },
} as const;

/* ── Küratör özeti ──────────────────────────────────────────────────────── */

export const TDR_GAPS = {
  title: { tr: "Boş kadrajlar", en: "Empty frames" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bütün kadrajlar dolu. Sayfada kalan tek boşluk bölünmenin kendisi.",
    en: "Every frame is filled. The only gap left on the page is the split itself.",
  },
} as const;
