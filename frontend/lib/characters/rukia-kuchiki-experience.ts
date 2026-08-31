import type { LocalizedText } from "./types";

/**
 * Rukia Kuchiki — "Sode no Shirayuki" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Bileşen bu dosyadan okuyup `pick(text, locale)` ile seçiyor; istemci
 * adalarına yalnızca düz dize iniyor.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * BEYAZ ÜSTÜNE BEYAZ. Sode no Shirayuki Soul Society'nin en güzel
 * Zanpakutō'su sayılıyor ve güzelliği bir süs değil bir yöntem: kar bir
 * şeyi yok etmiyor, ÜSTÜNÜ ÖRTÜYOR. Sayfanın kalbi de bunu yapıyor —
 * üç dans art arda çağrıldıkça sayfaya üç kalıcı kar katmanı biniyor ve
 * üçüncüsünde zemin tamamen beyazlaşıp KONTRAST TERSİNE DÖNÜYOR: koyu
 * zeminde açık metin okuyan ziyaretçi, kendini açık zeminde koyu metin
 * okurken buluyor. Hiçbir şey silinmedi; her şeyin üstü örtüldü.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (14 Ocak), boy (144 cm), rütbe (13. Bölük Vekili), zanpakutō
 * ve üvey ağabey bilgisi AniList künyesinden birebir alındı (karakter 6,
 * 31 Ağustos 2026; `public/assets/anime/karakterler/rukia-kuchiki/
 * kaynak.json` aynı çekimin kopyası).
 *
 * ⚠️ YAŞ VE KAN GRUBU KAYITTA YOK. AniList kaydında `yas` ve `kanGrubu`
 * alanlarının ikisi de `null`. Künye şeridinde bu iki satır SİLİNMEDİ;
 * "kayıtta yok" cevabıyla duruyor — uydurulmuş bir sayı yazmak arşivin
 * kendi kuralını bozardı.
 *
 * ── REPLİK DİSİPLİNİ (bu sayfanın en sıkı kuralı) ────────────────────────
 * Sayfada tırnak içine alınan HER satır bir ÇAĞRI: serbest bırakma komutu,
 * üç dansın adı ve Bankai'ın adı. Beşi de tekniğin kendi adı olduğu için
 * kaynağı tartışmasız. Rukia'nın ağzından çıkmış hiçbir DİYALOG tırnağa
 * alınmadı — doğrulayamadığım bir cümleyi tırnak içinde göstermektense
 * anlatı sesiyle yazmayı seçtim. Kullanılan beş satır:
 *   「舞え、袖白雪」    mae, Sode no Shirayuki — serbest bırakma komutu
 *   「初の舞、月白」    some no mai, Tsukishiro
 *   「次の舞、白漣」    tsugi no mai, Hakuren
 *   「参の舞、白刃」    san no mai, Shirafune
 *   「白霞罸」          Hakka no Togame — Bankai
 *
 * ── TERMİNOLOJİ (Bleach; Naruto/JJK sözlüğü KULLANILMADI) ────────────────
 * 斬魄刀 (zanpakutō), 浅打 (asauchi — adsız ham kılıç), 始解 (shikai),
 * 卍解 (bankai), 鬼道 (kidō) ve iki kolu 破道 (hadō) / 縛道 (bakudō),
 * 瞬歩 (shunpo), 護廷十三隊 (Gotei 13), 副隊長 (fukutaichō — vekil),
 * 流魂街 (Rukongai), 尸魂界 (Soul Society), 死神 (shinigami).
 * Türkçe karşılıklar arşivin Bleach kanadındaki sözlükten.
 *
 * ── KRONOLOJİ ────────────────────────────────────────────────────────────
 * Bleach'in kendi takvimi yıl vermiyor ve Rukia'nın yaşı kayıtlı değil, o
 * yüzden kader çizelgesinin beş durağı YIL değil DÖNEM adıyla anılıyor:
 * Rukongai, İnsan dünyası, Soul Society, Bölük, Kan Savaşı.
 */

export const RUKIA_ID = 6;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const RUKIA_SITE_URL = "https://anilist.co/character/6";

/**
 * Depodaki resmî portre (Faz 2 kararı: hotlink yok, kare repoda).
 *
 * ⚠️ 230×345 — yani KÜÇÜK. Sayfada yalnızca dar bir madalyon kadrajında
 * kullanılıyor; büyük hero karesi küratör yuvası olarak boş bırakıldı.
 * Kendi kaynağımız olduğu için `next/image`de `unoptimized` YOK.
 */
export const RUKIA_PORTRAIT = {
  src: "/assets/anime/karakterler/rukia-kuchiki/anilist-portrait.png",
  w: 230,
  h: 345,
} as const;

/**
 * Sergi görselleri — hepsi characterId 6 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `ruk:` önekli (küratör modu şartı).
 */
export const RUKIA_IMAGE_KEYS = {
  hero: "ruk:hero",
  zanpakuto: "ruk:zanpakuto",
  shikai: "ruk:shikai",
  bankai: "ruk:bankai",
  asauchi: "ruk:asauchi",
  hado: "ruk:hado",
  bakudo: "ruk:bakudo",
  shunpo: "ruk:shunpo",
  danceFirst: "ruk:mai-tsukishiro",
  danceSecond: "ruk:mai-hakuren",
  danceThird: "ruk:mai-shirafune",
  fateRukongai: "ruk:fate-rukongai",
  fateKarakura: "ruk:fate-karakura",
  fateSoulSociety: "ruk:fate-soul-society",
  fateDivision: "ruk:fate-jusanbantai",
  fateWar: "ruk:fate-sennen",
  bonds: "ruk:bonds",
  closing: "ruk:closing",
} as const;

/** Küratör yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const RUKIA_SLOT_LABELS: Record<string, LocalizedText> = {
  [RUKIA_IMAGE_KEYS.hero]: {
    tr: "Hero — dikey portre, tam boy, karlı/boş zemin (3:4)",
    en: "Hero — vertical portrait, full figure, snowy or plain ground (3:4)",
  },
  [RUKIA_IMAGE_KEYS.zanpakuto]: {
    tr: "Zanpakutō — mühürlü kılıç, kın ve kabza yakın çekim (16:9)",
    en: "Zanpakutō — the sealed blade, close on sheath and hilt (16:9)",
  },
  [RUKIA_IMAGE_KEYS.shikai]: {
    tr: "Shikai — bembeyaz kılıç, serbest bırakma anı (16:9)",
    en: "Shikai — the wholly white blade at the moment of release (16:9)",
  },
  [RUKIA_IMAGE_KEYS.bankai]: {
    tr: "Bankai — beyaz sis ve kırağı, dondurulmuş alan (16:9)",
    en: "Bankai — white mist and rime, a frozen field (16:9)",
  },
  [RUKIA_IMAGE_KEYS.asauchi]: {
    tr: "Asauchi — adsız ham kılıç, sade zemin (3:2)",
    en: "Asauchi — the nameless blank blade on a plain ground (3:2)",
  },
  [RUKIA_IMAGE_KEYS.hado]: {
    tr: "Hadō — mavi alevin çıkışı, avuç içi (3:2)",
    en: "Hadō — blue flame leaving the palm (3:2)",
  },
  [RUKIA_IMAGE_KEYS.bakudo]: {
    tr: "Bakudō — bağlayan ışık deseni, hareketsiz hedef (3:2)",
    en: "Bakudō — a binding pattern of light around a still target (3:2)",
  },
  [RUKIA_IMAGE_KEYS.shunpo]: {
    tr: "Shunpo — tek adımda kaybolan siluet, iz çizgisi (3:2)",
    en: "Shunpo — a silhouette gone in one step, with its trail (3:2)",
  },
  [RUKIA_IMAGE_KEYS.danceFirst]: {
    tr: "İlk dans — yerden yükselen beyaz sütun (4:5)",
    en: "First dance — a white pillar rising from the ground (4:5)",
  },
  [RUKIA_IMAGE_KEYS.danceSecond]: {
    tr: "İkinci dans — ileri koşan buz dalgası (4:5)",
    en: "Second dance — a wave of ice running forward (4:5)",
  },
  [RUKIA_IMAGE_KEYS.danceThird]: {
    tr: "Üçüncü dans — kırılan ve yeniden uzayan ağız (4:5)",
    en: "Third dance — the edge that breaks and grows again (4:5)",
  },
  [RUKIA_IMAGE_KEYS.fateRukongai]: {
    tr: "Rukongai — Inuzuri sokakları, iki çocuk (16:9)",
    en: "Rukongai — the streets of Inuzuri, two children (16:9)",
  },
  [RUKIA_IMAGE_KEYS.fateKarakura]: {
    tr: "İnsan dünyası — gece, yağmurlu kaldırım (16:9)",
    en: "The human world — night, a wet pavement (16:9)",
  },
  [RUKIA_IMAGE_KEYS.fateSoulSociety]: {
    tr: "Soul Society — beyaz kule, yukarıdan bakış (16:9)",
    en: "Soul Society — the white tower seen from above (16:9)",
  },
  [RUKIA_IMAGE_KEYS.fateDivision]: {
    tr: "13. Bölük — vekil kolluğu ve bölük avlusu (16:9)",
    en: "13th Division — the lieutenant's badge and the compound (16:9)",
  },
  [RUKIA_IMAGE_KEYS.fateWar]: {
    tr: "Kan Savaşı — beyaz üstüne beyaz, sisli alan (16:9)",
    en: "The Blood War — white upon white, a field of mist (16:9)",
  },
  [RUKIA_IMAGE_KEYS.bonds]: {
    tr: "Bağlar — Rukia ve çevresi, grup kadrajı (16:9)",
    en: "Bonds — Rukia and those around her, group frame (16:9)",
  },
  [RUKIA_IMAGE_KEYS.closing]: {
    tr: "Kapanış — boş kar alanı, tek iz (21:9)",
    en: "Closing — an empty snowfield with a single trail (21:9)",
  },
};

/**
 * Beklenen kare tipi ve ölçüsü.
 *
 * ⚠️ Bu metinler ÜRETİM METADATASI. Ziyaretçi bunları görmemeli (Dalga 1
 * denetiminin birinci dersi): bileşende `isAdmin` ile kesiliyor.
 */
export const RUKIA_SLOT_SPECS: Record<string, LocalizedText> = {
  [RUKIA_IMAGE_KEYS.hero]: {
    tr: "dikey kadraj · 1200×1600 · webp",
    en: "vertical frame · 1200×1600 · webp",
  },
  [RUKIA_IMAGE_KEYS.zanpakuto]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [RUKIA_IMAGE_KEYS.shikai]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [RUKIA_IMAGE_KEYS.bankai]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [RUKIA_IMAGE_KEYS.asauchi]: {
    tr: "yatay kadraj · 1200×800 · webp",
    en: "landscape frame · 1200×800 · webp",
  },
  [RUKIA_IMAGE_KEYS.hado]: {
    tr: "yatay kadraj · 1200×800 · webp",
    en: "landscape frame · 1200×800 · webp",
  },
  [RUKIA_IMAGE_KEYS.bakudo]: {
    tr: "yatay kadraj · 1200×800 · webp",
    en: "landscape frame · 1200×800 · webp",
  },
  [RUKIA_IMAGE_KEYS.shunpo]: {
    tr: "yatay kadraj · 1200×800 · webp",
    en: "landscape frame · 1200×800 · webp",
  },
  [RUKIA_IMAGE_KEYS.danceFirst]: {
    tr: "dikey kadraj · 1000×1250 · webp",
    en: "vertical frame · 1000×1250 · webp",
  },
  [RUKIA_IMAGE_KEYS.danceSecond]: {
    tr: "dikey kadraj · 1000×1250 · webp",
    en: "vertical frame · 1000×1250 · webp",
  },
  [RUKIA_IMAGE_KEYS.danceThird]: {
    tr: "dikey kadraj · 1000×1250 · webp",
    en: "vertical frame · 1000×1250 · webp",
  },
  [RUKIA_IMAGE_KEYS.fateRukongai]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [RUKIA_IMAGE_KEYS.fateKarakura]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [RUKIA_IMAGE_KEYS.fateSoulSociety]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [RUKIA_IMAGE_KEYS.fateDivision]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [RUKIA_IMAGE_KEYS.fateWar]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [RUKIA_IMAGE_KEYS.bonds]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [RUKIA_IMAGE_KEYS.closing]: {
    tr: "bant kadraj · 1890×810 · webp",
    en: "band frame · 1890×810 · webp",
  },
};

/** `CuratorSlot`a giden önerilen piksel ölçüleri. */
export const RUKIA_SLOT_SIZES: Record<string, { w: number; h: number }> = {
  [RUKIA_IMAGE_KEYS.hero]: { w: 1200, h: 1600 },
  [RUKIA_IMAGE_KEYS.zanpakuto]: { w: 1600, h: 900 },
  [RUKIA_IMAGE_KEYS.shikai]: { w: 1600, h: 900 },
  [RUKIA_IMAGE_KEYS.bankai]: { w: 1600, h: 900 },
  [RUKIA_IMAGE_KEYS.asauchi]: { w: 1200, h: 800 },
  [RUKIA_IMAGE_KEYS.hado]: { w: 1200, h: 800 },
  [RUKIA_IMAGE_KEYS.bakudo]: { w: 1200, h: 800 },
  [RUKIA_IMAGE_KEYS.shunpo]: { w: 1200, h: 800 },
  [RUKIA_IMAGE_KEYS.danceFirst]: { w: 1000, h: 1250 },
  [RUKIA_IMAGE_KEYS.danceSecond]: { w: 1000, h: 1250 },
  [RUKIA_IMAGE_KEYS.danceThird]: { w: 1000, h: 1250 },
  [RUKIA_IMAGE_KEYS.fateRukongai]: { w: 1600, h: 900 },
  [RUKIA_IMAGE_KEYS.fateKarakura]: { w: 1600, h: 900 },
  [RUKIA_IMAGE_KEYS.fateSoulSociety]: { w: 1600, h: 900 },
  [RUKIA_IMAGE_KEYS.fateDivision]: { w: 1600, h: 900 },
  [RUKIA_IMAGE_KEYS.fateWar]: { w: 1600, h: 900 },
  [RUKIA_IMAGE_KEYS.bonds]: { w: 1600, h: 900 },
  [RUKIA_IMAGE_KEYS.closing]: { w: 1890, h: 810 },
};

/** Portre yuvasının etiketi (ABILITY değil, PORTRAIT). */
export const RUKIA_PORTRAIT_SLOT: LocalizedText = {
  tr: "Portre — dikey, tam boy, 1200×1600 (AniList karesinin yerine geçer)",
  en: "Portrait — vertical, full figure, 1200×1600 (replaces the AniList file)",
};

/** Yoldaş portresi yuvasının etiketi — kimin karesi olduğu yerine yazılır. */
export const RUKIA_COMPANION_SLOT: LocalizedText = {
  tr: "Yoldaş portresi — dikey madalyon, 600×800",
  en: "Companion portrait — vertical medallion, 600×800",
};

export const RUKIA_CRUMB = {
  series: { tr: "Bleach", en: "Bleach" },
} as const;

/** Alt metinlerinde kaynağı söyleyen ön ek (Faz 2 §3). */
export const RUKIA_ALT = {
  scenePrefix: {
    tr: "Küratörün yüklediği kare —",
    en: "Curator-uploaded frame —",
  },
  companionPrefix: {
    tr: "Arşiv portre kaydı —",
    en: "Archive portrait record —",
  },
} as const;

/** Boş kadrajın üstündeki tek kelime — YALNIZCA küratör görüyor. */
export const RUKIA_FRAME_EMPTY: LocalizedText = {
  tr: "boş kadraj",
  en: "empty frame",
};

export const RUKIA_IDENTITY = {
  name: "Rukia Kuchiki",
  nativeName: "朽木ルキア",
  /** Hane adı — hero'da adın üstünde duruyor */
  house: {
    tr: "Kuchiki hanesi · Gotei 13'ün on üçüncü bölüğü",
    en: "House of Kuchiki · Thirteenth Division of the Gotei 13",
  },
  title: "袖白雪",
  titleReading: {
    tr: "Sode no Shirayuki — «beyaz karın kolu»",
    en: "Sode no Shirayuki — “sleeve of white snow”",
  },
  epigraph: {
    tr: "Kar bir şeyi yok etmez. Üstünü örter — ve altındaki her şey olduğu yerde, olduğu gibi durur.",
    en: "Snow destroys nothing. It covers — and everything beneath stays exactly where and as it was.",
  },
  facts: [
    {
      label: { tr: "Doğum günü", en: "Birthday" },
      value: { tr: "14 Ocak", en: "14 January" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "144 cm", en: "144 cm" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "kayıtta yok", en: "not on record" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "kayıtta yok", en: "not on record" },
    },
    {
      label: { tr: "Rütbe", en: "Rank" },
      value: {
        tr: "13. Bölük Vekili (副隊長)",
        en: "Lieutenant of the 13th Division (副隊長)",
      },
    },
    {
      label: { tr: "Takım", en: "Unit" },
      value: {
        tr: "Gotei 13 · On üçüncü bölük",
        en: "Gotei 13 · Thirteenth Division",
      },
    },
    {
      label: { tr: "Hane", en: "House" },
      value: {
        tr: "Kuchiki — evlatlık; üvey ağabeyi Byakuya Kuchiki",
        en: "Kuchiki — by adoption; her adoptive brother is Byakuya Kuchiki",
      },
    },
    {
      label: { tr: "Zanpakutō", en: "Zanpakutō" },
      value: { tr: "Sode no Shirayuki (袖白雪)", en: "Sode no Shirayuki (袖白雪)" },
    },
    {
      label: { tr: "Sembolik obje", en: "Symbolic object" },
      value: {
        tr: "Bembeyaz ağız — süs değil, ölçü",
        en: "The wholly white edge — not ornament but a measure",
      },
    },
  ],
} as const;

/** Künyedeki iki boş satırın açıklaması — ikinci derece bilgi. */
export const RUKIA_MISSING_NOTE: LocalizedText = {
  tr: "AniList kaydında yaş ve kan grubu alanlarının ikisi de boş. Bu iki satır silinmedi: bir tahmin yazmaktansa kaydın kendi boşluğunu göstermek arşivin kuralı.",
  en: "Both the age and blood-type fields are blank on the AniList record. The two rows were not removed: showing the record's own gap beats writing a guess — that is the archive's rule.",
};

export const RUKIA_HERO = {
  lede: {
    tr: "Bütün hikâyeyi başlatan karar onunki. Gücünü bir insana verdi, o insan yaşadı, ve bunun cezası ölümdü. Sayfanın geri kalanı o kararın soğuk tarafını anlatıyor.",
    en: "The decision that starts the whole story is hers. She gave her power to a human, that human lived, and the sentence for it was death. The rest of this page is the cold side of that decision.",
  },
  portraitAlt: {
    tr: "Rukia Kuchiki — AniList resmî portresi (depodaki kopya)",
    en: "Rukia Kuchiki — the official AniList portrait (repository copy)",
  },
  portraitAltUploaded: {
    tr: "Rukia Kuchiki — küratörün arşive yüklediği portre",
    en: "Rukia Kuchiki — the portrait a curator uploaded to the archive",
  },
  heroCaption: {
    tr: "Buradaki büyük kare bilerek boş: bu sayfanın konusu zaten örtülmüş bir yüzey.",
    en: "The large frame here is empty on purpose: this page is about a covered surface anyway.",
  },
} as const;

export const RUKIA_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "Dossier" },
    lede: {
      tr: "Dokuz satır. İkisi bilerek boş — kayıt öyle diyor.",
      en: "Nine rows. Two are deliberately blank — because the record is.",
    },
  },
  arts: {
    title: { tr: "Üç ağırlık", en: "Three weights" },
    lede: {
      tr: "Zanpakutō, Shikai, Bankai. Aynı kılıcın üç adı: biri mühür, biri ad, biri sonuç.",
      en: "Zanpakutō, Shikai, Bankai. Three names for one blade: a seal, a name, a consequence.",
    },
  },
  craft: {
    title: { tr: "Dört el işi", en: "Four crafts" },
    lede: {
      tr: "Kılıcın dışında kalanlar. Bir shinigami'yi shinigami yapan sıradan disiplinler.",
      en: "What lies outside the blade — the ordinary disciplines that make a Shinigami one.",
    },
  },
  dances: {
    title: { tr: "Üç dans", en: "Three dances" },
    lede: {
      tr: "Her çağrı sayfaya kalıcı bir kar katmanı bırakıyor. Üçü de düştüğünde zemin beyazlaşıyor ve okuduğunuz her şey tersine dönüyor — silinmiyor, örtülüyor.",
      en: "Each call leaves a permanent layer of snow on this page. When all three have fallen the ground turns white and everything you are reading inverts — nothing is erased, everything is covered.",
    },
  },
  fate: {
    title: { tr: "Beş durak", en: "Five stops" },
    lede: {
      tr: "Bleach yıl vermiyor ve Rukia'nın yaşı kayıtlı değil; duraklar dönem adıyla anılıyor.",
      en: "Bleach gives no years and Rukia's age is not recorded; the stops are named by period instead.",
    },
  },
  bonds: {
    title: { tr: "Bağlar", en: "Bonds" },
    lede: {
      tr: "Arşivde dosyası olan adlar bağlantılı; olmayanlar düz duruyor. Byakuya bilerek düz: hanenin adı burada, sayfası henüz yok.",
      en: "Names with a file in the archive are linked; the rest stand plain. Byakuya is plain on purpose: the house is here, the page is not yet.",
    },
  },
  world: {
    title: { tr: "Evrendeki yeri", en: "Her place in the world" },
    lede: {
      tr: "Bleach evreninin kendi odalarına açılan dört kapı.",
      en: "Four doors into the rooms of the Bleach universe itself.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "İki çağrı, bir komut ve künyenin kaynağı.",
      en: "Two calls, one command, and where the dossier came from.",
    },
  },
} as const;

/** Mod düğmesi — "Ay ışığı". Bu dalgada zemini AÇAN tek sayfa. */
export const RUKIA_MOON = {
  title: { tr: "Ay ışığı", en: "Moonlight" },
  native: "月白",
  enter: { tr: "Ay ışığını aç", en: "Turn the moonlight on" },
  exit: { tr: "Ay ışığını kapat", en: "Turn the moonlight off" },
  hintOn: {
    tr: "Ay ışığı açık: zemin bir kademe aydınlandı, gölgeler maviye döndü ve kar yoğunlaştı. Kar üstünde gece böyle görünür — karanlık değil, soğuk bir aydınlık.",
    en: "Moonlight on: the ground has lifted one step, the shadows have gone blue and the snow has thickened. This is how night looks over snow — not dark but coldly bright.",
  },
  hintOff: {
    tr: "Ay ışığı kapalı: zemin koyu, kar seyrek. Düğme sayfayı aydınlatmıyor, kar üstündeki ışığı açıyor.",
    en: "Moonlight off: the ground is dark and the snow is sparse. The button does not light the page; it turns on the light that falls on snow.",
  },
} as const;

/** Üç büyük kart — Bleach terminolojisi. */
export const RUKIA_ARTS = [
  {
    key: "zanpakuto",
    name: "斬魄刀",
    reading: "zanpakutō",
    turkish: { tr: "Ruh kesen kılıç", en: "Soul-cutting blade" },
    imageKey: RUKIA_IMAGE_KEYS.zanpakuto,
    tagline: {
      tr: "Mühürlü hâlde sıradan görünüyor — ayrım serbest bırakıldığında başlıyor.",
      en: "Unremarkable while sealed — the distinction begins only on release.",
    },
    text: {
      tr: "Her shinigami'nin kılıcı kendi ruhundan doğuyor ve sahibinin adını bildiği ölçüde ona cevap veriyor. Rukia'nınki bir buz türü: dondurmuyor, sıcaklığı GERİ ALIYOR. Sode no Shirayuki Soul Society'nin en güzel Zanpakutō'su sayılır ve o güzellik bir süs değil — mühürden çıkan her parça, ağız da kabza da balçak da, bembeyaz.",
      en: "Every Shinigami's blade is born of their own soul and answers to the degree that its owner knows its name. Rukia's is a kind of ice: it does not freeze so much as take heat away. Sode no Shirayuki is held to be the most beautiful Zanpakutō in Soul Society, and that beauty is not ornament — every part that leaves the seal, edge and hilt and guard alike, comes out pure white.",
    },
    traits: [
      { tr: "Buz ve kar türü", en: "Ice-and-snow type" },
      { tr: "Beyaz ağız, beyaz kabza", en: "White edge, white hilt" },
      { tr: "Ruhun adıyla cevap veriyor", en: "Answers to the name of its spirit" },
    ],
  },
  {
    key: "shikai",
    name: "始解",
    reading: "shikai",
    turkish: { tr: "İlk çözülme", en: "First release" },
    imageKey: RUKIA_IMAGE_KEYS.shikai,
    tagline: {
      tr: "Komut iki kelime: bir fiil ve bir ad.",
      en: "The command is two words: a verb and a name.",
    },
    text: {
      tr: "Serbest bırakma komutu 「舞え、袖白雪」 — «dans et, Sode no Shirayuki». Fiilin seçimi tesadüf değil: bu kılıcın üç tekniği de birer DANS ve numaralanmışlar. Sayfanın kalbindeki bölüm tam olarak bu üç dansı çağırıyor.",
      en: "The release command is 「舞え、袖白雪」 — “dance, Sode no Shirayuki”. The verb is not incidental: all three of this blade's techniques are dances, and they are numbered. The section at the heart of this page calls exactly those three.",
    },
    traits: [
      { tr: "Komut: 舞え (mae) — dans et", en: "Command: 舞え (mae) — dance" },
      { tr: "Üç numaralı teknik", en: "Three numbered techniques" },
      { tr: "Beyaz kurdele balçaktan sarkıyor", en: "A white ribbon falls from the guard" },
    ],
  },
  {
    key: "bankai",
    name: "卍解",
    reading: "bankai",
    turkish: { tr: "Tam çözülme", en: "Full release" },
    imageKey: RUKIA_IMAGE_KEYS.bankai,
    tagline: {
      tr: "白霞罸 — Hakka no Togame. Beyaz sisin cezası.",
      en: "白霞罸 — Hakka no Togame. The censure of white mist.",
    },
    text: {
      tr: "Rukia'nın Bankai'ı bir silah değil bir SICAKLIK: çağrıldığında alanın ısısını mutlak sıfırın altına indiriyor ve dokunduğu şeyi molekülüne kadar donduruyor. Bedeli aynı ölçüde ağır — kendi bedeni de o soğuğun içinde. Bu yüzden sayfanın kar katmanları da geri alınabiliyor ama katman katman: bir defada temizlenen bir şey değil.",
      en: "Rukia's Bankai is not a weapon but a TEMPERATURE: called, it drives the heat of an area below absolute zero and freezes what it touches down to the molecule. The cost is proportionate — her own body is inside that cold too. It is why the snow layers on this page can be taken back, but only one layer at a time: this is not the kind of thing that clears at once.",
    },
    traits: [
      { tr: "Mutlak sıfırın altı", en: "Below absolute zero" },
      { tr: "Bedeli kullanan kişide", en: "The cost falls on the user" },
      { tr: "Kan Savaşı'nda görüldü", en: "Seen in the Blood War" },
    ],
  },
] as const;

/** Dört küçük kart — kılıcın dışındaki disiplinler. */
export const RUKIA_CRAFT = [
  {
    key: "asauchi",
    name: "浅打",
    reading: "asauchi",
    imageKey: RUKIA_IMAGE_KEYS.asauchi,
    turkish: { tr: "Adsız ham kılıç", en: "The nameless blank" },
    note: {
      tr: "Her Zanpakutō adsız başlar. Asauchi, sahibinin ruhunu emerek biçim ve ad kazanıyor; yani kılıcın güzelliği kılıçtan değil sahibinden geliyor.",
      en: "Every Zanpakutō begins nameless. An Asauchi takes shape and name by absorbing its owner's soul — so the blade's beauty comes from the owner, not the blade.",
    },
  },
  {
    key: "hado",
    name: "破道",
    reading: "hadō",
    imageKey: RUKIA_IMAGE_KEYS.hado,
    turkish: { tr: "Kidō'nun yıkıcı kolu", en: "The destructive arm of Kidō" },
    note: {
      tr: "Kidō'nun saldırı yolu; numaralı ve söz kalıbıyla çağrılıyor. Rukia bu kolda usta sayılıyor — akademiden beri övüldüğü alan da burası.",
      en: "The offensive path of Kidō, numbered and called with a set incantation. Rukia is reckoned skilled in this arm — it is the field she was praised for from the academy onward.",
    },
  },
  {
    key: "bakudo",
    name: "縛道",
    reading: "bakudō",
    imageKey: RUKIA_IMAGE_KEYS.bakudo,
    turkish: { tr: "Kidō'nun bağlayıcı kolu", en: "The binding arm of Kidō" },
    note: {
      tr: "Vurmayan yol: hedefi durduran, susturan, kapatan kalıplar. Bir kar tekniği için doğal kardeş — ikisi de hareketi almakla iş görüyor.",
      en: "The path that does not strike: patterns that stop, silence, or seal a target. A natural sibling to a snow technique — both work by taking movement away.",
    },
  },
  {
    key: "shunpo",
    name: "瞬歩",
    reading: "shunpo",
    imageKey: RUKIA_IMAGE_KEYS.shunpo,
    turkish: { tr: "Anlık adım", en: "Flash step" },
    note: {
      tr: "Mesafeyi adım sayısına indiren teknik. Kar üstünde bıraktığı tek şey iz — ve bu sayfanın gövde metninin neden hep biraz sola kaçık durduğunun sebebi de o iz.",
      en: "The technique that reduces distance to a count of steps. All it leaves on snow is a trail — and that trail is why the body text on this page always sits a little to the left.",
    },
  },
] as const;

/**
 * ÜÇ DANS — sayfanın kalbi.
 *
 * Sıra serbest: hangisi önce çağrılırsa o katman önce düşüyor. Geri alma
 * SON düşen katmandan başlıyor (katman katman, kullanıcı şartı).
 */
export const RUKIA_DANCES = [
  {
    key: "tsukishiro",
    call: "初の舞、月白",
    reading: "some no mai, Tsukishiro",
    name: { tr: "İlk dans — Ay Beyazı", en: "First dance — White Moon" },
    imageKey: RUKIA_IMAGE_KEYS.danceFirst,
    summary: {
      tr: "Ayağının altındaki daireyi işaretliyor ve o dairedeki her şey dikey bir buz sütununun içinde yukarı kalkıyor.",
      en: "She marks the circle beneath her foot, and everything inside it rises within a vertical pillar of ice.",
    },
    layerNote: {
      tr: "Birinci katman düştü. Zemin bir kademe açıldı; gölgeler hâlâ derin.",
      en: "The first layer has fallen. The ground lifted one step; the shadows are still deep.",
    },
  },
  {
    key: "hakuren",
    call: "次の舞、白漣",
    reading: "tsugi no mai, Hakuren",
    name: { tr: "İkinci dans — Beyaz Dalgacık", en: "Second dance — White Ripple" },
    imageKey: RUKIA_IMAGE_KEYS.danceSecond,
    summary: {
      tr: "Ağzın önünde biriken kar tek bir dalga hâlinde ileri koşuyor ve önündeki her şeyi kaplıyor.",
      en: "Snow gathers before the edge and runs forward as a single wave, sheeting over everything ahead of it.",
    },
    layerNote: {
      tr: "İkinci katman düştü. Metin hâlâ açık, zemin artık gri — sayfa eşikte.",
      en: "The second layer has fallen. The text is still light and the ground is now grey — the page is on the threshold.",
    },
  },
  {
    key: "shirafune",
    call: "参の舞、白刃",
    reading: "san no mai, Shirafune",
    name: { tr: "Üçüncü dans — Beyaz Ağız", en: "Third dance — White Sword" },
    imageKey: RUKIA_IMAGE_KEYS.danceThird,
    summary: {
      tr: "Kırılan ağız yeniden uzuyor: kılıç kırıldığı yerden dondurulmuş beyaz bir ağızla tamamlanıyor.",
      en: "The broken edge grows back: the blade completes itself from the break with a frozen white edge.",
    },
    layerNote: {
      tr: "Üçüncü katman düştü. Zemin bembeyaz, kontrast tersine döndü — hiçbir şey silinmedi, hepsinin üstü örtüldü.",
      en: "The third layer has fallen. The ground is white and the contrast has inverted — nothing was erased, everything was covered.",
    },
  },
] as const;

/** İstemci adasına inen düz dizeler — dansın arayüz metinleri. */
export const RUKIA_DANCE_UI = {
  command: { tr: "Komut", en: "Command" },
  commandText: "舞え、袖白雪",
  commandReading: {
    tr: "mae, Sode no Shirayuki — «dans et, Sode no Shirayuki»",
    en: "mae, Sode no Shirayuki — “dance, Sode no Shirayuki”",
  },
  callLabel: { tr: "Çağır", en: "Call" },
  calledLabel: { tr: "katman düştü", en: "layer fallen" },
  layerCount: { tr: "Düşen katman", en: "Layers fallen" },
  undoLabel: { tr: "Son katmanı kaldır", en: "Lift the last layer" },
  undoHint: {
    tr: "Geri alma katman katman: bir çağrıda bir katman.",
    en: "Undo comes one layer at a time: one call, one layer.",
  },
  idleHint: {
    tr: "Üç dansın hiçbiri çağrılmadı. Sıra serbest — hangisiyle başlarsanız o katman önce düşer.",
    en: "None of the three dances has been called. The order is free — whichever you start with falls first.",
  },
  invertedHint: {
    tr: "Üçü de düştü. Zemin beyaz, metin koyu; sayfa artık kendi kar manzarası.",
    en: "All three have fallen. The ground is white, the text is dark; the page is now its own snowfield.",
  },
  statusCalled: {
    tr: "Katman düştü. Toplam:",
    en: "A layer has fallen. Total:",
  },
  statusLifted: {
    tr: "Bir katman kaldırıldı. Kalan:",
    en: "One layer lifted. Remaining:",
  },
  statusInverted: {
    tr: "Üç katman tamam — zemin beyazladı, kontrast tersine döndü.",
    en: "Three layers complete — the ground turned white and the contrast inverted.",
  },
  keyboardHint: {
    tr: "Üç düğme de sekmeyle geziliyor; Enter ya da boşluk çağırıyor.",
    en: "All three buttons are reachable by Tab; Enter or Space makes the call.",
  },
} as const;

/**
 * Kader çizelgesinin bir durağı.
 *
 * ⚠️ `quote` ve `kin` OPSİYONEL ve tip bu yüzden elle yazıldı: beş durağın
 * yalnızca üçünde çağrı, dördünde akraba var. Diziyi `as const` ile
 * bırakmak beş ayrı nesne tipinden bir birleşim üretiyor ve `stop.quote`
 * okuması "bu alan bu üyede yok" diye patlıyordu.
 */
export interface RukiaStop {
  key: string;
  stamp: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  imageKey: string;
  quote?: { text: string; reading: LocalizedText; by: LocalizedText };
  kin?: { characterId: number; name: string; role: LocalizedText };
}

/** Beş durak — dönem etiketli, kilit anlarda ÇAĞRI. */
export const RUKIA_TIMELINE: readonly RukiaStop[] = [
  {
    key: "rukongai",
    stamp: { tr: "Dönem · Rukongai", en: "Period · Rukongai" },
    title: {
      tr: "Inuzuri — Güney Rukongai'nin yetmiş sekizinci bölgesi",
      en: "Inuzuri — the seventy-eighth district of South Rukongai",
    },
    text: {
      tr: "Soul Society'nin en dip mahallelerinden birinde, bir avuç çocukla birlikte hayatta kaldı. Renji Abarai o çocuklardan biriydi ve ikisi birlikte shinigami akademisine girdi. Bu sayfanın soğuğu buradan başlıyor: kar, Rukia'nın öğrendiği ilk hava.",
      en: "She survived in one of the lowest quarters of Soul Society alongside a handful of children. Renji Abarai was one of them, and the two entered the Shinigami academy together. The cold of this page starts here: snow was the first weather Rukia learned.",
    },
    imageKey: RUKIA_IMAGE_KEYS.fateRukongai,
    kin: {
      characterId: 906,
      name: "Renji Abarai",
      role: { tr: "aynı sokaktan, aynı sınıftan", en: "same street, same class" },
    },
  },
  {
    key: "karakura",
    stamp: { tr: "Dönem · İnsan dünyası", en: "Period · The human world" },
    title: {
      tr: "Gücünü bir insana verdi",
      en: "She gave her power to a human",
    },
    text: {
      tr: "Bir Hollow avında yaralandı ve gücünü Ichigo Kurosaki'ye aktardı — geçici olması gereken bir çözüm kalıcı oldu. Rukia gigai'ye kapandı, insan dünyasında kaldı ve bekledi. Bütün seri bu tek karardan açılıyor.",
      en: "Wounded during a Hollow hunt, she transferred her power to Ichigo Kurosaki — a solution meant to be temporary that became permanent. Rukia was shut inside a gigai, stayed in the human world and waited. The entire series opens out of this one decision.",
    },
    imageKey: RUKIA_IMAGE_KEYS.fateKarakura,
    quote: {
      text: "舞え、袖白雪",
      reading: {
        tr: "Mae, Sode no Shirayuki — «dans et, Sode no Shirayuki».",
        en: "Mae, Sode no Shirayuki — “dance, Sode no Shirayuki”.",
      },
      by: { tr: "Serbest bırakma komutu", en: "The release command" },
    },
    kin: {
      characterId: 5,
      name: "Ichigo Kurosaki",
      role: { tr: "gücünü verdiği kişi", en: "the one she gave her power to" },
    },
  },
  {
    key: "soul-society",
    stamp: { tr: "Dönem · Soul Society", en: "Period · Soul Society" },
    title: {
      tr: "Cezası ölümdü",
      en: "The sentence was death",
    },
    text: {
      tr: "Gücünü bir insana vermek Soul Society'nin yasasında ağır bir suç. Rukia geri götürüldü, beyaz kuleye kapatıldı ve idama mahkûm edildi. Kararı savunmadı; Ichigo'nun peşinden gelmesini de istemedi. Sayfanın en sessiz durağı bu — burada tırnağa alınacak bir çağrı yok.",
      en: "Giving one's power to a human is a grave crime in Soul Society's law. Rukia was taken back, shut in the white tower and sentenced to execution. She did not defend the decision, and she did not want Ichigo to follow her. This is the quietest stop on the page — there is no call to put in quotation marks here.",
    },
    imageKey: RUKIA_IMAGE_KEYS.fateSoulSociety,
    kin: {
      characterId: 907,
      name: "Byakuya Kuchiki",
      role: { tr: "üvey ağabeyi, onu geri götüren", en: "her adoptive brother, the one who took her back" },
    },
  },
  {
    key: "division",
    stamp: { tr: "Dönem · Bölük", en: "Period · The Division" },
    title: {
      tr: "13. Bölük Vekili",
      en: "Lieutenant of the 13th Division",
    },
    text: {
      tr: "Kurtuluştan sonra bölüğüne döndü ve rütbesi yükseldi: Gotei 13'ün on üçüncü bölüğünün vekili. Kılıcının üç dansı bu dönemde ad ad çağrılıyor — teknik artık bir savunma değil, öğretilmiş bir düzen.",
      en: "After the rescue she returned to her division and rose in rank: lieutenant of the thirteenth division of the Gotei 13. It is in this period that her blade's three dances are called by name — the technique is no longer a defence but a taught order.",
    },
    imageKey: RUKIA_IMAGE_KEYS.fateDivision,
    quote: {
      text: "次の舞、白漣",
      reading: {
        tr: "Tsugi no mai, Hakuren — «ikinci dans, Beyaz Dalgacık».",
        en: "Tsugi no mai, Hakuren — “next dance, White Ripple”.",
      },
      by: { tr: "İkinci dansın çağrısı", en: "The call of the second dance" },
    },
  },
  {
    key: "war",
    stamp: { tr: "Dönem · Kan Savaşı", en: "Period · The Blood War" },
    title: {
      tr: "Bankai — Hakka no Togame",
      en: "Bankai — Hakka no Togame",
    },
    text: {
      tr: "Bin Yıllık Kan Savaşı'nda Bankai'ını açtı: alan mutlak sıfırın altına iniyor ve dokunduğu şey molekülüne kadar donuyor. Bedeli kendi bedeninde. Rukia'nın hikâyesi burada tamamlanıyor — verdiği güç, geri aldığı ad, ödediği soğuk.",
      en: "In the Thousand-Year Blood War she opened her Bankai: the field drops below absolute zero and whatever it touches freezes down to the molecule. The cost is borne by her own body. Rukia's story completes itself here — the power she gave, the name she took back, the cold she paid.",
    },
    imageKey: RUKIA_IMAGE_KEYS.fateWar,
    quote: {
      text: "白霞罸",
      reading: {
        tr: "Hakka no Togame — «beyaz sisin cezası».",
        en: "Hakka no Togame — “the censure of white mist”.",
      },
      by: { tr: "Bankai'ın adı", en: "The name of the Bankai" },
    },
  },
];

/**
 * Bağlar — `EXPERIENCE_COMPANIONS[6]` ile BİREBİR aynı sıra ve aynı küme:
 * [5, 906, 907, 210, 1086, 908]. Dalga 1'in dördüncü dersi: sayfanın
 * çizdiği her ad o satırda olmak zorunda, yoksa portre girildiğinde bile
 * kadraj sonsuza kadar boş kalır.
 */
export const RUKIA_BONDS = [
  {
    characterId: 5,
    name: "Ichigo Kurosaki",
    role: { tr: "gücünü verdiği çocuk", en: "the boy she gave her power to" },
    line: {
      tr: "Rukia'nın kararı Ichigo'yu shinigami yaptı; Ichigo'nun kararı Rukia'yı idamdan aldı. Borç iki yönlü ve ikisi de bunu hiç saymıyor.",
      en: "Rukia's decision made Ichigo a Shinigami; Ichigo's decision took Rukia off the scaffold. The debt runs both ways and neither of them counts it.",
    },
  },
  {
    characterId: 906,
    name: "Renji Abarai",
    role: { tr: "çocukluk arkadaşı", en: "childhood friend" },
    line: {
      tr: "Inuzuri'den akademiye birlikte gittiler. Rukia asil bir haneye alındığında aralarına giren şey mesafe değil, o mesafeyi kapatmak için Renji'nin harcadığı yıllar oldu.",
      en: "They went from Inuzuri to the academy together. When Rukia was taken into a noble house, what came between them was not the distance itself but the years Renji spent closing it.",
    },
  },
  {
    characterId: 907,
    name: "Byakuya Kuchiki",
    role: { tr: "üvey ağabeyi", en: "her adoptive brother" },
    line: {
      tr: "Kuchiki hanesinin başı ve Rukia'yı eve alan kişi. Aynı zamanda onu Soul Society'ye geri götüren kılıç. Arşivde henüz kendi dosyası yok, o yüzden bu ad bağlantısız duruyor.",
      en: "Head of the House of Kuchiki and the man who took Rukia in — and also the blade that took her back to Soul Society. He has no file of his own in the archive yet, so this name stands unlinked.",
    },
  },
  {
    characterId: 210,
    name: "Kisuke Urahara",
    role: { tr: "gigai'yi veren", en: "the one who gave her the gigai" },
    line: {
      tr: "İnsan dünyasında kaldığı süre boyunca taşıdığı gigai onun elinden çıktı. Urahara'nın yardımı hiçbir zaman yalnızca yardım değildir.",
      en: "The gigai she wore throughout her time in the human world came from his hands. Urahara's help is never only help.",
    },
  },
  {
    characterId: 1086,
    name: "Sōsuke Aizen",
    role: { tr: "idamın gerçek sebebi", en: "the true reason for the execution" },
    line: {
      tr: "Rukia'nın cezasının aceleye getirilmesi bir adalet meselesi değildi. Bu sayfadaki en soğuk cümle bu: mahkûmiyet bir plandaki adımdı.",
      en: "The haste of Rukia's sentence was not a matter of justice. That is the coldest sentence on this page: the conviction was a step in someone's plan.",
    },
  },
  {
    characterId: 908,
    name: "Yoruichi Shihōin",
    role: { tr: "kurtarma harekâtının omurgası", en: "the spine of the rescue" },
    line: {
      tr: "İdamı durduran zincirin çoğu halkası onun elinde. Rukia'nın yaşaması bir tek kahramanın değil, örgütlü bir karşı çıkışın sonucu.",
      en: "Most links in the chain that stopped the execution were in her hands. Rukia lives not because of one hero but because of an organised refusal.",
    },
  },
] as const;

export const RUKIA_BOND_UI = {
  hasPage: { tr: "arşivde dosyası var", en: "has a file in the archive" },
  noPage: { tr: "arşivde dosyası yok", en: "no file in the archive" },
  noPortrait: { tr: "portre kaydı boş", en: "portrait record empty" },
} as const;

/**
 * Evren kapıları — `/anime/bleach` sayfasının GERÇEK çapaları.
 * Dördü de `lib/anime/bleach/anchors.ts` defterinde kayıtlı; ölü çapa yok.
 */
export const RUKIA_WORLD_DOORS = [
  {
    hash: "gotei",
    label: { tr: "Gotei 13 — On üçüncü bölük", en: "Gotei 13 — the Thirteenth Division" },
    note: {
      tr: "Rukia'nın bölüğü ve rütbesinin geçtiği yer.",
      en: "Rukia's division and the place her rank lives.",
    },
  },
  {
    hash: "zanpakuto",
    label: { tr: "Zanpakutō — Sode no Shirayuki", en: "Zanpakutō — Sode no Shirayuki" },
    note: {
      tr: "Kılıcın üç kademesi ve iç dünyasının kar manzarası.",
      en: "The blade's three stages and the snowfield of its inner world.",
    },
  },
  {
    hash: "bankai",
    label: { tr: "Bankai Salonu", en: "The Bankai Hall" },
    note: {
      tr: "Hakka no Togame'nin evrendeki komşuları.",
      en: "Where Hakka no Togame stands among its neighbours.",
    },
  },
  {
    hash: "houses",
    label: { tr: "Soylu haneler — Kuchiki", en: "The noble houses — Kuchiki" },
    note: {
      tr: "Rukia'nın evlatlık gittiği hane ve o hanenin kaydı.",
      en: "The house Rukia was adopted into, and that house's record.",
    },
  },
] as const;

export const RUKIA_CLOSING = {
  quotes: [
    {
      text: "初の舞、月白",
      reading: {
        tr: "Some no mai, Tsukishiro — «ilk dans, Ay Beyazı».",
        en: "Some no mai, Tsukishiro — “first dance, White Moon”.",
      },
      by: { tr: "İlk dansın çağrısı", en: "The call of the first dance" },
      note: {
        tr: "Bu sayfanın mod düğmesinin adı da buradan geliyor: 月白, ay beyazı. Düğme sayfayı aydınlatmıyor — kar üstündeki gece ışığını açıyor.",
        en: "This page's mode button takes its name from here too: 月白, moon-white. The button does not brighten the page — it turns on the night light that falls over snow.",
      },
    },
    {
      text: "参の舞、白刃",
      reading: {
        tr: "San no mai, Shirafune — «üçüncü dans, Beyaz Ağız».",
        en: "San no mai, Shirafune — “third dance, White Sword”.",
      },
      by: { tr: "Üçüncü dansın çağrısı", en: "The call of the third dance" },
      note: {
        tr: "Kırılan kılıcın kırıldığı yerden tamamlanması. Rukia'nın bütün hikâyesinin özeti sayılabilir: kayıp bir eksiklik değil, yeni ağzın başladığı yer.",
        en: "The broken blade completing itself from the break. It could stand as a summary of Rukia's whole story: loss is not a lack but the place where the new edge begins.",
      },
    },
  ],
  motto: "舞え、袖白雪",
  mottoNote: {
    tr: "Mae, Sode no Shirayuki. Sayfada tırnağa alınan her satır bir ÇAĞRI — komut, dans adı ya da Bankai adı. Kaynağı doğrulanamayan hiçbir diyalog alıntılanmadı; anlatının geri kalanı arşivin kendi sesiyle yazıldı.",
    en: "Mae, Sode no Shirayuki. Every line placed in quotation marks on this page is a CALL — a command, a dance name, or the name of a Bankai. No dialogue whose source could not be verified was quoted; the rest of the narrative is written in the archive's own voice.",
  },
  credit: {
    tr: "Künye, portre, doğum günü, boy, rütbe, zanpakutō ve üvey ağabey bilgisi AniList'ten alındı; portre karesi depoda duruyor (hotlink yok):",
    en: "The dossier, portrait, birthday, height, rank, zanpakutō and adoptive-brother line come from AniList; the portrait file lives in this repository (no hotlinking):",
  },
  creditLink: {
    tr: "AniList · Rukia Kuchiki #6",
    en: "AniList · Rukia Kuchiki #6",
  },
  creditNote: {
    tr: "Sayfadaki diğer bütün kadrajlar boş: sahne, dönem ve teknik görselleri üretilmiyor, küratör yüklemesi bekliyor. Filigrandaki hane arması ve kar kristalleri elle çizilmiş SVG. Inuzuri, bölük ve Bankai bilgileri arşivin kendi Bleach kanadındaki kayıtlarla karşılaştırıldı.",
    en: "Every other frame on this page is empty: scene, era and technique images are not generated and wait for a curator upload. The house crest in the watermark and the snow crystals are hand-drawn SVG. The Inuzuri, division and Bankai details were checked against the archive's own Bleach records.",
  },
} as const;

export const RUKIA_GAPS = {
  title: { tr: "Boş kadrajlar", en: "Empty frames" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bütün kadrajlar dolu. Sayfada kalan tek beyazlık kar.",
    en: "Every frame is filled. The only whiteness left on the page is snow.",
  },
} as const;
