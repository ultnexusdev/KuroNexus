import type { LocalizedText } from "./types";

/**
 * Eren Yeager — "Yer Gürültüsü" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Sahne görselleri veritabanında — characterId 40882 kaydının ABILITY
 * yuvaları, `ern:*` anahtarlarıyla.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (30 Mart), boy aralığı (170 cm → 183 cm), bağlı olduğu birlikler
 * (104. Eğitim Birliği, Keşif Birliği), doğduğu yer (Shiganshina, Duvar
 * Maria), yaş kaydı ("15-") ve takma adları (死に急ぎ野郎, Attack Titan,
 * Founding Titan) AniList künyesinden birebir alındı — arşivin kendi
 * kopyası: `public/assets/anime/karakterler/eren-yeager/kaynak.json`
 * (30 Ağustos 2026).
 *
 * ⚠️ KAN GRUBU VE DOĞUM YILI KAYITTA YOK. `kanGrubu: null`, `dogum.year:
 * null`. Künye şeridinde ikisi de BOŞ bırakıldı; yaştan bir yıl TÜRETİLMEDİ.
 * Takvim yılları (845 · 850 · 854) kader çizelgesinde YAZILMADI, çünkü
 * arşivin doğrulayabildiği tek kaynak AniList künyesi ve orada yıl yok —
 * çizelge yalnızca YAŞLA ilerliyor, kılavuzun "emin olmadığın ölçüyü yazma"
 * kuralı gereği.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada tırnak içine alınan Japonca yalnızca iki cümle:
 *   「駆逐してやる…この世から一匹残らず！」 — Shiganshina'dan sonraki yemini
 *   「戦え！戦え！」                        — Trost'ta kendine bağırdığı
 * İkisi de kaynağıyla anılıyor. Emin olunmayan hiçbir cümle tırnağa
 * alınmadı: denizin kıyısındaki konuşma ve Yollar'daki karşılaşma, Japonca
 * replik olarak DEĞİL, düz anlatı olarak yazıldı.
 *
 * ── TERMİNOLOJİ (uydurma yok) ────────────────────────────────────────────
 * 進撃の巨人 (Shingeki no Kyojin — Saldıran Titan), 始祖の巨人 (Shiso no
 * Kyojin — Kurucu Titan), 戦鎚の巨人 (Sentsui no Kyojin — Savaş Çekici
 * Titanı), 立体機動装置 (Rittai Kidō Sōchi — üç boyutlu manevra donanımı),
 * 硬質化 (Kōshitsuka — sertleştirme), 座標 (Zahyō — Koordinat), 道 (Michi —
 * Yollar), ユミルの民 (Yumiru no Tami — Ymir'in halkı), ユミルの呪い
 * (Ymir'in laneti — on üç yıl), 地鳴らし (Jinarashi — Yer Gürültüsü).
 * Türkçe karşılıklar arşivin kendi sözlüğünden.
 */

export const EREN_ID = 40882;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const EREN_SITE_URL = "https://anilist.co/character/40882";

/**
 * Depodaki resmî portre (Faz 2 kararı: hotlink YOK, dosya repoda).
 * Ölçüsü `kaynak.json`'dan: 230×345 — yani KÜÇÜK. Sayfada madalyon
 * boyunda kullanılıyor; büyük kadraj `ern:hero` yuvasında bekliyor.
 */
export const EREN_PORTRAIT = {
  src: "/assets/anime/karakterler/eren-yeager/anilist-portrait.jpg",
  w: 230,
  h: 345,
} as const;

/**
 * Sahne görselleri — hepsi characterId 40882 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `ern:` önekli (küratör modu şartı).
 */
export const EREN_IMAGE_KEYS = {
  hero: "ern:hero",
  attack: "ern:shingeki",
  founding: "ern:shiso",
  warhammer: "ern:sentsui",
  gearOdm: "ern:rittai",
  gearHarden: "ern:koushitsuka",
  gearPaths: "ern:michi",
  gearCurse: "ern:noroi",
  march: "ern:jinarashi",
  fateWall: "ern:fate-shiganshina",
  fateTrost: "ern:fate-trost",
  fateBasement: "ern:fate-bodrum",
  fateLiberio: "ern:fate-liberio",
  fateRumbling: "ern:fate-yeruultusu",
  trio: "ern:trio",
  closing: "ern:closing",
} as const;

/** Portre yuvası ABILITY değil PORTRAIT — yüklenen kare 230×345'i EZER. */
export const EREN_PORTRAIT_SLOT_KEY = "PORTRAIT";

/** Küratör yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const EREN_SLOT_LABELS: Record<string, LocalizedText> = {
  [EREN_IMAGE_KEYS.hero]: {
    tr: "Hero — yatay ufuk karesi: duvar üstü, uzakta silüetler (16:9, webp)",
    en: "Hero — a horizontal horizon plate: the wall top, silhouettes far off (16:9, webp)",
  },
  [EREN_PORTRAIT_SLOT_KEY]: {
    tr: "Portre — dikey kare; yüklenen görsel AniList'in 230×345'ini ezer (2:3, webp)",
    en: "Portrait — a vertical frame; an upload overrides AniList's 230×345 (2:3, webp)",
  },
  [EREN_IMAGE_KEYS.attack]: {
    tr: "Saldıran Titan — 15 metre, buhar tüten omuzlar, koşarken (4:3)",
    en: "The Attack Titan — fifteen metres, steaming shoulders, mid-stride (4:3)",
  },
  [EREN_IMAGE_KEYS.founding]: {
    tr: "Kurucu Titan — omurgadan büyüyen dev iskelet gövde (4:3)",
    en: "The Founding Titan — the vast skeletal body growing out of a spine (4:3)",
  },
  [EREN_IMAGE_KEYS.warhammer]: {
    tr: "Savaş Çekici Titanı — yerden yükselen sertleşmiş yapı (4:3)",
    en: "The War Hammer Titan — a hardened structure rising from the ground (4:3)",
  },
  [EREN_IMAGE_KEYS.gearOdm]: {
    tr: "Manevra donanımı — kanca, tel, gaz; yakın çekim (1:1)",
    en: "The ODM gear — anchor, wire, gas; close crop (1:1)",
  },
  [EREN_IMAGE_KEYS.gearHarden]: {
    tr: "Sertleştirme — kristalleşen kabuk, ışığı geçiren kenar (1:1)",
    en: "Hardening — a crystallising shell, an edge that lets light through (1:1)",
  },
  [EREN_IMAGE_KEYS.gearPaths]: {
    tr: "Yollar — kumlu beyaz düzlük, tek ağaç, sonsuz ufuk (1:1)",
    en: "The Paths — a sanded white flat, a single tree, an endless horizon (1:1)",
  },
  [EREN_IMAGE_KEYS.gearCurse]: {
    tr: "On üç yıl — kum saati ya da yıpranmış takvim; soyut (1:1)",
    en: "Thirteen years — an hourglass or a worn calendar; abstract (1:1)",
  },
  [EREN_IMAGE_KEYS.march]: {
    tr: "Yürüyüş — ufku dolduran duvar titanları, çok geniş kadraj (21:9)",
    en: "The march — Wall Titans filling the horizon, ultra-wide (21:9)",
  },
  [EREN_IMAGE_KEYS.fateWall]: {
    tr: "Shiganshina — delinen kapı, kaçan kalabalık, enkaz (16:9)",
    en: "Shiganshina — the breached gate, a fleeing crowd, rubble (16:9)",
  },
  [EREN_IMAGE_KEYS.fateTrost]: {
    tr: "Trost — kayayı taşıyan titan, arkada kapı (16:9)",
    en: "Trost — the Titan carrying the boulder, the gate behind (16:9)",
  },
  [EREN_IMAGE_KEYS.fateBasement]: {
    tr: "Bodrum — masa, üç defter, tek lamba (16:9)",
    en: "The basement — a desk, three notebooks, one lamp (16:9)",
  },
  [EREN_IMAGE_KEYS.fateLiberio]: {
    tr: "Liberio — kalabalık festival meydanı, uzun saçlı bir figür (16:9)",
    en: "Liberio — a crowded festival square, a long-haired figure (16:9)",
  },
  [EREN_IMAGE_KEYS.fateRumbling]: {
    tr: "Yer Gürültüsü — yürüyen duvar titanları, buhar ve toz (16:9)",
    en: "The Rumbling — Wall Titans walking, steam and dust (16:9)",
  },
  [EREN_IMAGE_KEYS.trio]: {
    tr: "Üçlü — üç çocuk, arkada duvar; geniş kadraj (2:1)",
    en: "The trio — three children, the wall behind; wide crop (2:1)",
  },
  [EREN_IMAGE_KEYS.closing]: {
    tr: "Kapanış — ağaç ve rüzgâr, insansız; düşük kontrast (2:1)",
    en: "Closing — a tree and wind, no people; low contrast (2:1)",
  },
};

/** Küratör özetindeki "beklenen kare" satırları. */
export const EREN_SLOT_SPECS: Record<string, LocalizedText> = {
  [EREN_IMAGE_KEYS.hero]: {
    tr: "yatay ufuk karesi · 1920×1080 · webp",
    en: "horizontal horizon plate · 1920×1080 · webp",
  },
  [EREN_PORTRAIT_SLOT_KEY]: {
    tr: "dikey portre · 1200×1600 · webp",
    en: "vertical portrait · 1200×1600 · webp",
  },
  [EREN_IMAGE_KEYS.attack]: {
    tr: "titan kartı · 1200×900 · webp",
    en: "titan card · 1200×900 · webp",
  },
  [EREN_IMAGE_KEYS.founding]: {
    tr: "titan kartı · 1200×900 · webp",
    en: "titan card · 1200×900 · webp",
  },
  [EREN_IMAGE_KEYS.warhammer]: {
    tr: "titan kartı · 1200×900 · webp",
    en: "titan card · 1200×900 · webp",
  },
  [EREN_IMAGE_KEYS.gearOdm]: {
    tr: "kare detay · 800×800 · webp",
    en: "square detail · 800×800 · webp",
  },
  [EREN_IMAGE_KEYS.gearHarden]: {
    tr: "kare detay · 800×800 · webp",
    en: "square detail · 800×800 · webp",
  },
  [EREN_IMAGE_KEYS.gearPaths]: {
    tr: "kare detay · 800×800 · webp",
    en: "square detail · 800×800 · webp",
  },
  [EREN_IMAGE_KEYS.gearCurse]: {
    tr: "kare detay · 800×800 · webp",
    en: "square detail · 800×800 · webp",
  },
  [EREN_IMAGE_KEYS.march]: {
    tr: "çok geniş sahne · 2100×900 · webp",
    en: "ultra-wide scene · 2100×900 · webp",
  },
  [EREN_IMAGE_KEYS.fateWall]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [EREN_IMAGE_KEYS.fateTrost]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [EREN_IMAGE_KEYS.fateBasement]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [EREN_IMAGE_KEYS.fateLiberio]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [EREN_IMAGE_KEYS.fateRumbling]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [EREN_IMAGE_KEYS.trio]: {
    tr: "geniş şerit · 1600×800 · webp",
    en: "wide strip · 1600×800 · webp",
  },
  [EREN_IMAGE_KEYS.closing]: {
    tr: "geniş şerit · 1600×800 · webp",
    en: "wide strip · 1600×800 · webp",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const EREN_IDENTITY = {
  name: "Eren Yeager",
  nativeName: "エレン・イェーガー",
  /** Hero filigranı — dekoratif (aria-hidden): 進撃 = saldırı / ileri yürüyüş */
  watermark: "進撃",
  house: {
    tr: "104. Eğitim Birliği · Keşif Birliği · Shiganshina doğumlu",
    en: "104th Training Corps · Survey Corps · born in Shiganshina",
  },
  epigraph: {
    tr: "Duvarın içinde büyüyen bir çocuk için özgürlük, dışarısının nasıl olduğunu bilmek demekti. Dışarıyı gördüğünde özgürlüğün adı değişmedi — bedeli değişti.",
    en: "For a child raised inside the wall, freedom meant knowing what the outside looked like. When he finally saw it, the word did not change — the price did.",
  },
  facts: [
    {
      label: { tr: "Doğum günü", en: "Birthday" },
      value: { tr: "30 Mart", en: "30 March" },
    },
    {
      label: { tr: "Doğduğu yer", en: "Born in" },
      value: {
        tr: "Shiganshina Bölgesi · Duvar Maria",
        en: "Shiganshina District · Wall Maria",
      },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "170 cm → 183 cm", en: "170 cm → 183 cm" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "künyede yok", en: "not in the record" },
    },
    {
      label: { tr: "Birlik", en: "Affiliation" },
      value: {
        tr: "104. Eğitim Birliği · Keşif Birliği",
        en: "104th Training Corps · Survey Corps",
      },
    },
    {
      label: { tr: "Devraldığı güçler", en: "Inherited powers" },
      value: {
        tr: "Saldıran · Kurucu · Savaş Çekici",
        en: "Attack · Founding · War Hammer",
      },
    },
    {
      label: { tr: "Sembolik obje", en: "Symbolic object" },
      value: {
        tr: "babasının bodrum anahtarı",
        en: "his father's basement key",
      },
    },
    {
      label: { tr: "Künyedeki takma adı", en: "Alias in the record" },
      value: {
        tr: "死に急ぎ野郎 — «ölmeye acele eden»",
        en: "死に急ぎ野郎 — “the one in a hurry to die”",
      },
    },
  ],
} as const;

export const EREN_MISSING_NOTE: LocalizedText = {
  tr: "Künyede kan grubu ve doğum YILI boş. Yaşla birleştirip bir yıl türetilmedi; kader çizelgesi de takvim yılı değil YAŞ kullanıyor.",
  en: "Blood type and birth YEAR are blank in the record. No year has been derived by combining them with the age; the fate chart runs on AGE, not calendar years.",
};

export const EREN_ALT = {
  companionSuffix: { tr: "portresi", en: "portrait" },
  portraitUploaded: {
    tr: "Eren Yeager — arşivin yüklediği portre",
    en: "Eren Yeager — portrait uploaded by the archive",
  },
  portraitLocal: {
    tr: "Eren Yeager — AniList resmî portresi (depodaki kopya, 230×345)",
    en: "Eren Yeager — official AniList portrait (repository copy, 230×345)",
  },
} as const;

export const EREN_CRUMB = {
  series: { tr: "Attack on Titan", en: "Attack on Titan" },
} as const;

/* ── Mod düğmesi: duvarın ardı ──────────────────────────────────────────── */

export const EREN_BEYOND_TEXT = {
  toSea: { tr: "Duvarın ardına geç", en: "Go beyond the wall" },
  toWall: { tr: "Duvarın içine dön", en: "Back inside the wall" },
  stateWall: { tr: "壁の中 — duvarın içi", en: "壁の中 — inside the wall" },
  stateSea: { tr: "壁の外 — duvarın dışı", en: "壁の外 — outside the wall" },
  hintWall: {
    tr: "Ölçü dar, ufuk yüksek, renk sepya. İçeriden bakınca dünya bu kadar.",
    en: "The measure is narrow, the horizon high, the colour sepia. Seen from inside, the world is this big.",
  },
  hintSea: {
    tr: "Ufuk yukarı kaydı, ölçü genişledi, sayfa kızıla döndü. Genişlik bedavaya gelmiyor.",
    en: "The horizon has ridden up, the measure has widened, the page has turned red. The width is not free.",
  },
  label: { tr: "Duvarın ardı", en: "Beyond the wall" },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const EREN_HERO = {
  lede: {
    tr: "Eren'in hikâyesi bir güçlenme hikâyesi değil, bir GENİŞLEME hikâyesi. Duvarın içinde doğdu ve dışarısını yalnızca bir kitaptan biliyordu; dışarıyı gördüğünde dünyanın kendisinden nefret etmeyi öğrendi. Sayfa da aynı yolu izliyor: duvarın içindeyken dar, sepya ve alçak tavanlı; duvarın ardına geçtiğinde ölçüsü açılıyor, ufku yukarı kayıyor ve rengi kızıla dönüyor. Genişlik bedelsiz gelmiyor — sayfanın kalbindeki yürüyüşte bunu adım adım göreceksin.",
    en: "Eren's story is not one of growing stronger but of growing WIDER. He was born inside the wall and knew the outside only from a book; when he finally saw it, he learned to hate the world itself. This page walks the same road: inside the wall it is narrow, sepia and low-ceilinged; beyond the wall its measure opens, its horizon rides up and its colour turns red. The width does not come free — the march at the heart of this page shows the cost, one step at a time.",
  },
  horizonCaption: {
    tr: "Sayfanın her bölümü aynı yükseklikteki bir ufuk çizgisine asılı: kimi bölüm çizginin üstünde, kimi altında duruyor. Duvarın üstü tam olarak budur — bir manzara değil, bir SINIR.",
    en: "Every section on this page hangs off a horizon line at the same height: some sit above it, some below. That is exactly what the top of a wall is — not a view but a LIMIT.",
  },
  heroFrameCaption: {
    tr: "Büyük ufuk karesi küratör yuvası olarak bekliyor. Yüklenene kadar kadraj boş ama ayakta — duvarın üstü de öyle.",
    en: "The large horizon plate waits as a curator slot. Until one is uploaded the frame stays empty but standing — so does the top of a wall.",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const EREN_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "Dossier" },
    lede: {
      tr: "AniList kaydından birebir; boşları boş bırakıldı.",
      en: "Verbatim from the AniList record; blanks left blank.",
    },
  },
  titans: {
    title: { tr: "Üç titan", en: "Three titans" },
    lede: {
      tr: "Devraldığı üç güç. Üçü de ayrı bir soruyu cevaplıyor: nasıl savaşılır, kim emreder, ne inşa edilir.",
      en: "The three powers he inherited. Each answers a different question: how to fight, who commands, what gets built.",
    },
  },
  gear: {
    title: { tr: "Dört donanım", en: "Four fittings" },
    lede: {
      tr: "Titan olmayan taraf: bir kayış takımı, bir kabuk, bir düzlük ve bir son tarih.",
      en: "The part of him that is not a Titan: a harness, a shell, a flat plain and a deadline.",
    },
  },
  march: {
    title: { tr: "Yürüyüş", en: "The march" },
    lede: {
      tr: "Beş adım. Her adımda arkadaki kalabalık katlanıyor ve söz azalıyor. Sonunda söz hiç kalmıyor.",
      en: "Five steps. At every step the crowd behind multiplies and the words shrink. At the end there are no words left.",
    },
  },
  fate: {
    title: { tr: "Beş durak", en: "Five stops" },
    lede: {
      tr: "Yaşla ilerliyor, takvimle değil: künyede doğum yılı yok ve arşiv olmayan bir sayıyı yazmıyor.",
      en: "It runs on age, not the calendar: the record has no birth year and the archive does not write a number it does not have.",
    },
  },
  bonds: {
    title: { tr: "Üçlü ve kaptan", en: "The trio and the captain" },
    lede: {
      tr: "Aynı sokakta büyüyen iki kişi ve onları taşıyan bir asker. Üçünün de kendi dosyası var.",
      en: "Two people who grew up on the same street, and a soldier who carried them. All three have their own file.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "İlk yemini ve son yürüyüşü aynı cümlenin iki ucu.",
      en: "His first vow and his last march are two ends of the same sentence.",
    },
  },
} as const;

/* ── Üç titan ───────────────────────────────────────────────────────────── */

export interface ErenTitan {
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

export const EREN_TITANS: ErenTitan[] = [
  {
    key: "attack",
    name: "Shingeki no Kyojin",
    kanji: "進撃の巨人",
    reading: "しんげきのきょじん",
    turkish: { tr: "Saldıran Titan", en: "The Attack Titan" },
    tagline: {
      tr: "On beş metre; hiçbir zaman kimsenin emrine girmemiş olan.",
      en: "Fifteen metres; the one that never served anyone.",
    },
    text: {
      tr: "Babası Grisha'dan devraldığı güç. Dokuz titanın en dövüşçüsü: gövdesi ince, kasları sırım gibi, ağzı ve dişleri açıkta. Ayırt edici özelliği bir kabiliyet değil bir HUY — bu titan tarih boyunca hiçbir kralın, hiçbir düzenin altına girmemiş, her seferinde özgürlük için yürümüş. Eren'in kendi karakteriyle bu kadar örtüşen bir mirası devralması hikâyenin en acı şakası: hangisinin hangisini şekillendirdiği hiçbir zaman tam olarak ayrılamıyor.",
      en: "The power he inherited from his father Grisha. The most combat-shaped of the nine: a lean frame, wiry muscle, mouth and teeth exposed. What sets it apart is not an ability but a DISPOSITION — through all of history this Titan bowed to no king and no order, and marched every time for freedom. That Eren inherits a legacy that matches his own character so exactly is the story's cruellest joke: which one shaped the other never fully separates.",
    },
    traits: [
      { tr: "15 metre", en: "Fifteen metres" },
      { tr: "Grisha'dan devralındı", en: "Inherited from Grisha" },
      { tr: "Kimseye hizmet etmedi", en: "Served no one" },
    ],
    imageKey: EREN_IMAGE_KEYS.attack,
  },
  {
    key: "founding",
    name: "Shiso no Kyojin",
    kanji: "始祖の巨人",
    reading: "しそのきょじん",
    turkish: { tr: "Kurucu Titan", en: "The Founding Titan" },
    tagline: {
      tr: "Emri veren güç — ama tek başına konuşamayan.",
      en: "The power that gives the order — and cannot speak on its own.",
    },
    text: {
      tr: "Ymir'in halkının tamamına ulaşan güç: bütün titanlara emir verebilir, o halkın bedenlerini ve hafızalarını değiştirebilir. Kilidi kraliyet kanında: gücü taşıyan kişi kral soyundan değilse, komutu ancak o kandan biriyle temas ederek açabiliyor. Eren'in yıllarca elinde tuttuğu hâlde kullanamamasının sebebi bu — sahip olmakla kullanabilmek arasındaki mesafe, bu sayfadaki her şeyin sebebi.",
      en: "The power that reaches every Subject of Ymir: it can command all Titans and alter that people's bodies and memories. Its lock is royal blood — if the holder is not of the king's line, the command opens only through contact with someone who is. That is why Eren held it for years without being able to use it; the distance between owning a thing and being able to use it is the cause of everything on this page.",
    },
    traits: [
      { tr: "Bütün titanlara emir", en: "Command over every Titan" },
      { tr: "Kraliyet kanı şartı", en: "Requires royal blood" },
      { tr: "Hafıza değiştirebilir", en: "Can alter memory" },
    ],
    imageKey: EREN_IMAGE_KEYS.founding,
  },
  {
    key: "warhammer",
    name: "Sentsui no Kyojin",
    kanji: "戦鎚の巨人",
    reading: "せんついのきょじん",
    turkish: { tr: "Savaş Çekici Titanı", en: "The War Hammer Titan" },
    tagline: {
      tr: "Sertleşmiş maddeden silah ve yapı üreten el.",
      en: "The hand that builds weapons and structures out of hardened matter.",
    },
    text: {
      tr: "Liberio'da Tybur ailesinden alınan üçüncü güç. Sertleştirilmiş maddeyi istediği biçimde üretiyor: mızrak, çekiç, kafes, duvar. İkinci bir özelliği daha var ki avantajın kendisi orada — taşıyıcının gerçek bedeni titanın ensesinde durmak zorunda değil, kabloyla bağlı ayrı bir kristalin içinde de durabiliyor. Yani ensesine vurmak yetmiyor; önce gerçek yerini bulman gerekiyor.",
      en: "The third power, taken from the Tybur family at Liberio. It produces hardened matter in any shape it likes: spears, hammers, cages, walls. It has a second property, and that is where the real advantage sits — the holder's true body need not stay in the Titan's nape; it can sit in a separate crystal joined by a cable. Striking the nape is not enough; you first have to find where the body actually is.",
    },
    traits: [
      { tr: "Liberio'da alındı", en: "Taken at Liberio" },
      { tr: "Sertleşmiş yapı üretir", en: "Builds hardened structures" },
      { tr: "Gövde enseden ayrı durabilir", en: "The body can sit off the nape" },
    ],
    imageKey: EREN_IMAGE_KEYS.warhammer,
  },
];

/* ── Dört donanım ───────────────────────────────────────────────────────── */

export interface ErenGear {
  key: string;
  name: LocalizedText;
  kanji: string;
  note: LocalizedText;
  imageKey: string;
}

export const EREN_GEAR: ErenGear[] = [
  {
    key: "odm",
    name: {
      tr: "Üç boyutlu manevra donanımı",
      en: "Three-dimensional manoeuvre gear",
    },
    kanji: "立体機動装置",
    note: {
      tr: "İki kanca, çelik teller, sıkıştırılmış gaz ve bir kayış takımı. İnsanın titana karşı tek gerçek üstünlüğü: yükseklik ve hız. Eren bu donanımla sıradan bir askerdi — titan gücünü kaybettiği anlarda da geri döndüğü şey bu oldu.",
      en: "Two anchors, steel wire, compressed gas and a harness. The only genuine human advantage over a Titan: height and speed. With this gear Eren was an ordinary soldier — and it is what he fell back on whenever the Titan power failed him.",
    },
    imageKey: EREN_IMAGE_KEYS.gearOdm,
  },
  {
    key: "harden",
    name: { tr: "Sertleştirme", en: "Hardening" },
    kanji: "硬質化",
    note: {
      tr: "Titan maddesini kristal sertliğinde bir kabuğa çevirme. Eren bunu bir serumla kazandı ve ilk büyük işi bir saldırı değil bir TAMİRAT oldu: Shiganshina'daki deliği kendi bedeninden çıkan maddeyle kapattı. Yıkmak için verilmiş bir güçle duvar örmek, karakterin bütün çelişkisi.",
      en: "Turning Titan matter into a shell as hard as crystal. Eren gained it through a serum, and its first great use was not an attack but a REPAIR: he sealed the breach at Shiganshina with matter from his own body. Building a wall with a power meant for breaking one is the character's whole contradiction.",
    },
    imageKey: EREN_IMAGE_KEYS.gearHarden,
  },
  {
    key: "paths",
    name: { tr: "Yollar ve Koordinat", en: "The Paths and the Coordinate" },
    kanji: "道・座標",
    note: {
      tr: "Ymir'in halkının bütün bireylerini birbirine bağlayan, zamanın dışında duran bir alan. Kurucu Titan bu ağın kesişme noktasında, yani Koordinat'ta duruyor. Sayfadaki en tuhaf gerçek burada: Eren'in geçmişte gördüğü bazı sahneler geleceğin kendisinden geliyor — hafıza ile kehanet aynı yerde birleşiyor.",
      en: "A field standing outside time that joins every Subject of Ymir to every other. The Founding Titan sits at the crossing point of that network — the Coordinate. Here is the strangest fact on this page: some of the scenes Eren sees in the past arrive from the future itself — memory and prophecy meet in the same place.",
    },
    imageKey: EREN_IMAGE_KEYS.gearPaths,
  },
  {
    key: "curse",
    name: { tr: "Ymir'in laneti", en: "The Curse of Ymir" },
    kanji: "ユミルの呪い",
    note: {
      tr: "Bir titan gücünü devralan kişi, devraldığı andan itibaren on üç yıldan fazla yaşayamıyor. Eren bunu öğrendiğinde kendisine kalan süreyi de öğrenmiş oldu. Sayfadaki aceleyi açıklayan tek sayı bu: künyedeki takma adı «ölmeye acele eden» boşuna değil.",
      en: "Anyone who inherits a Titan power cannot live more than thirteen years from the moment of inheritance. When Eren learned this, he also learned how long he had left. It is the one number that explains the haste on this page: the alias in his record — “the one in a hurry to die” — is not an accident.",
    },
    imageKey: EREN_IMAGE_KEYS.gearCurse,
  },
];

/* ── Yürüyüş: sayfanın kalbi ────────────────────────────────────────────── */

/**
 * Beş adım. Üç şey aynı anda değişiyor:
 *   `count`         → arkadaki siluet SAYISI (1 → 10 → 100 → 1000 → sayısız)
 *   `tileW`/`tileH` → SVG deseninin karo ölçüsü; küçüldükçe kalabalık artar
 *   `measure`       → metin sütununun genişliği (ch); ilerledikçe DARALIYOR
 *
 * Karo ölçüleri sahnenin 1200×320'lik kullanıcı uzayına göre HESAPLANDI,
 * göz kararı seçilmedi: görünen siluet sayısı ≈ (1200/tileW) × (320/tileH).
 *   120×320 → 10 · 48×80 → 100 · 17×22 → ~1015 · 6×8 → ~8000 (sayısız)
 * İlk adımda karo yok: tek bir büyük siluet çiziliyor (`tileW = 0`).
 *
 * `text` uzunlukları da bilerek azalan sırada yazıldı: mekanik yalnızca
 * bir CSS numarası değil, metnin kendisi de tükeniyor.
 */
export interface ErenMarchStep {
  key: string;
  kanji: string;
  count: LocalizedText;
  /** Ekranda okunan sayı — dilden bağımsız */
  numeral: string;
  /** Desen karosunun genişliği (kullanıcı birimi). 0 → tek büyük siluet */
  tileW: number;
  /** Desen karosunun yüksekliği (kullanıcı birimi) */
  tileH: number;
  /** Metin sütununun genişliği (ch) */
  measure: number;
  title: LocalizedText;
  text: LocalizedText;
}

export const EREN_MARCH: ErenMarchStep[] = [
  {
    key: "one",
    kanji: "一",
    numeral: "1",
    count: { tr: "bir tane", en: "one" },
    tileW: 0,
    tileH: 0,
    measure: 64,
    title: { tr: "Karar", en: "The decision" },
    text: {
      tr: "Yer Gürültüsü bir kaza değil, bir karar. Duvarların içinde uyuyan titanlar yüzyıllardır oradaydı ve onları uyandırmak için tek bir emir yetiyordu; o emri verebilmek için Eren'in yıllarca beklemesi, kaçırılması, kandırılması ve sonunda kardeşiyle temas etmesi gerekti. İlk titan duvardan çıkıp buharını salıverdiğinde ortada hâlâ tek bir figür var: bir tane. Bu adımda söz de en uzun hâlinde, çünkü karar hâlâ açıklanabilir bir şey — birinin niye böyle yaptığını anlatmaya vaktin var. Sonraki adımlarda o vakit kalmayacak.",
      en: "The Rumbling is not an accident but a decision. The Titans sleeping inside the walls had been there for centuries, and one order was enough to wake them; to be able to give that order Eren had to wait for years, be taken, be deceived, and finally touch his brother. When the first Titan steps out of the wall and lets its steam go, there is still a single figure out there: one. The words are at their longest here too, because the decision can still be explained — you have time to say why someone did this. In the steps that follow there will be no such time.",
    },
  },
  {
    key: "ten",
    kanji: "十",
    numeral: "10",
    count: { tr: "on", en: "ten" },
    tileW: 120,
    tileH: 320,
    measure: 46,
    title: { tr: "Kıyı", en: "The shore" },
    text: {
      tr: "Duvarlar dökülüyor ve içlerinden çıkanlar denize doğru yürüyor. Adanın kıyısı Eren'in yıllarca hayalini kurduğu yerdi; şimdi oradan bakan tek şey sıra sıra yürüyen gövdeler. Aynı manzarayı çocukken bir kitapta görmüştü ve o kitabın adı özgürlüktü.",
      en: "The walls come apart and what steps out of them walks towards the sea. That shore was the place Eren had dreamed of for years; now the only thing looking out from it is rank upon rank of bodies. He had seen the same view as a child in a book, and the name of that book was freedom.",
    },
  },
  {
    key: "hundred",
    kanji: "百",
    numeral: "100",
    count: { tr: "yüz", en: "a hundred" },
    tileW: 48,
    tileH: 80,
    measure: 32,
    title: { tr: "Adım", en: "The step" },
    text: {
      tr: "Adı tam olarak duyduğu şeyden geliyor: yer gürültüsü. Yürüyüş bir savaş değil, bir zemin olayı — arkalarında şehir kalmıyor, iz kalıyor.",
      en: "The name comes from exactly what you hear: the ground, rumbling. The march is not a battle but an event of the earth — behind it no city is left, only a trace.",
    },
  },
  {
    key: "thousand",
    kanji: "千",
    numeral: "1000",
    count: { tr: "bin", en: "a thousand" },
    tileW: 17,
    tileH: 22,
    measure: 22,
    title: { tr: "Sessizlik", en: "The silence" },
    text: {
      tr: "Pazarlık kalmadı. Karşısında duran ilk grup, onunla aynı sokakta büyüyenler.",
      en: "There is nothing left to bargain with. The first group standing against him grew up on his street.",
    },
  },
  {
    key: "countless",
    kanji: "無数",
    numeral: "∞",
    count: { tr: "sayısız", en: "countless" },
    tileW: 6,
    tileH: 8,
    measure: 13,
    title: { tr: "Söz bitti", en: "No words left" },
    text: {
      tr: "Geriye yalnızca yürüyüş kaldı.",
      en: "Only the march is left.",
    },
  },
];

export const EREN_MARCH_UI = {
  stageLabel: {
    tr: "Yürüyüş sahnesi — arkadaki duvar titanı silüetleri",
    en: "The march stage — Wall Titan silhouettes behind",
  },
  stepsLabel: { tr: "Yürüyüşün beş adımı", en: "The five steps of the march" },
  advance: { tr: "Yürü", en: "Walk on" },
  back: { tr: "Bir adım geri", en: "One step back" },
  reset: { tr: "Duvara dön", en: "Back to the wall" },
  countLabel: { tr: "Silüet", en: "Silhouettes" },
  wordsLabel: { tr: "Söz genişliği", en: "Word width" },
  stepLabel: { tr: "Adım", en: "Step" },
  keyboardHint: {
    tr: "Beş adımın hepsi sekmeyle geziliyor; «Yürü» düğmesi sırayı ilerletiyor.",
    en: "All five steps are reachable by tab; the “Walk on” button advances the sequence.",
  },
  closingNote: {
    tr: "Sayı katlandıkça sütun daralıyor. Mekanik bunun için var: kalabalık büyürken açıklama küçülüyor ve sonunda hiç kalmıyor.",
    en: "As the number multiplies the column narrows. That is what the mechanic is for: while the crowd grows the explanation shrinks, and in the end there is none.",
  },
  status: {
    tr: "adımda silüet sayısı",
    en: "silhouettes at this step",
  },
} as const;

/* ── Beş durak ──────────────────────────────────────────────────────────── */

export interface ErenFate {
  key: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: string; reading: LocalizedText; by: LocalizedText };
  imageKey: string;
  /** Ufuk çizgisinin hangi tarafında duracak */
  side: "above" | "below";
}

export const EREN_TIMELINE: ErenFate[] = [
  {
    key: "wall",
    age: { tr: "10 yaş", en: "age ten" },
    title: { tr: "Duvar Maria düşüyor", en: "Wall Maria falls" },
    text: {
      tr: "Shiganshina'nın kapısı deliniyor ve içeri titanlar giriyor. Eren annesi Carla'yı evin enkazının altında bırakmak zorunda kalıyor ve onun yenilişini gözünün önünde izliyor. O günden sonra Eren'in bütün cümleleri tek bir yöne bakıyor: dışarı. Kaybettiği yalnızca annesi değil, dünyanın güvenli olduğu fikri.",
      en: "The gate at Shiganshina is breached and the Titans come in. Eren has to leave his mother Carla under the wreckage of their house, and watches her eaten in front of him. From that day every sentence of his points one way: outwards. What he lost was not only his mother but the idea that the world was safe.",
    },
    quote: {
      text: "駆逐してやる…この世から一匹残らず！",
      reading: {
        tr: "«Hepsini yok edeceğim… bu dünyadan bir tanesini bile bırakmadan!»",
        en: "“I will wipe them out… every last one of them from this world!”",
      },
      by: {
        tr: "Eren — Shiganshina düştükten sonraki yemini",
        en: "Eren — his vow after the fall of Shiganshina",
      },
    },
    imageKey: EREN_IMAGE_KEYS.fateWall,
    side: "below",
  },
  {
    key: "trost",
    age: { tr: "15 yaş", en: "age fifteen" },
    title: { tr: "Trost: yutulan asker", en: "Trost: the soldier who was swallowed" },
    text: {
      tr: "104. Eğitim Birliği'nden mezun olduktan kısa süre sonra Trost saldırısında bir titan tarafından yutuluyor ve öldü sanılıyor. Yutulmanın içinde titan gücü uyanıyor: Eren titan olarak geri çıkıyor, dev bir kaya taşını sırtlayıp kırılan kapıyı tıkıyor. İnsanlığın ilk kez bir titanı yanında gördüğü an bu — ve aynı gün Eren'in kendi tarafından tutuklandığı gün.",
      en: "Shortly after graduating from the 104th, he is swallowed by a Titan during the assault on Trost and presumed dead. Inside that swallowing the Titan power wakes: Eren comes back out as a Titan, hauls an enormous boulder onto his back and plugs the broken gate. It is the first time humanity sees a Titan on its own side — and the same day Eren is arrested by his own.",
    },
    quote: {
      text: "戦え！戦え！",
      reading: {
        tr: "«Savaş! Savaş!»",
        en: "“Fight! Fight!”",
      },
      by: {
        tr: "Eren — Trost'ta kendini ayağa kaldırırken",
        en: "Eren — hauling himself back up at Trost",
      },
    },
    imageKey: EREN_IMAGE_KEYS.fateTrost,
    side: "above",
  },
  {
    key: "basement",
    age: { tr: "15 yaş", en: "age fifteen" },
    title: { tr: "Bodrum ve deniz", en: "The basement and the sea" },
    text: {
      tr: "Keşif Birliği Shiganshina'yı geri alıyor; Eren sertleştirme ile duvardaki deliği kapatıyor ve babasının bodrumuna nihayet giriyor. Orada bulduğu üç defter, duvarın ardında boş bir çöl değil bir DÜNYA olduğunu yazıyor: denizler, ülkeler, ordular ve Eren'in halkından nefret eden milyonlarca insan. Çocukken hayalini kurduğu kıyıya vardığında sorduğu soru bir keşif sorusu değil, bir hesap sorusu oluyor — denizin ötesindekiler yok edilirse özgür olunur mu?",
      en: "The Survey Corps retakes Shiganshina; Eren seals the breach with hardening and finally goes down into his father's basement. The three notebooks he finds there say that beyond the wall lies not an empty desert but a WORLD: seas, nations, armies, and millions of people who hate his own. When he reaches the shore he dreamed of as a child, the question he asks is no longer one of discovery but of arithmetic — if everything beyond the sea were destroyed, would that be freedom?",
    },
    imageKey: EREN_IMAGE_KEYS.fateBasement,
    side: "below",
  },
  {
    key: "liberio",
    age: { tr: "19 yaş", en: "age nineteen" },
    title: { tr: "Liberio: tek başına", en: "Liberio: alone" },
    text: {
      tr: "Yıllar sonra Eren adadan çıkıp düşman ülkeye tek başına giriyor; savaş yaralılarının arasında adını gizleyerek yaşıyor, sokakta karşılaştığı bir çocuğa yardım ediyor ve aynı şehirde topluluğun karşısına çıkıp savaş ilan ediyor. Aynı gün Savaş Çekici Titanı'nı da alıyor. Bu duraktan sonra Eren'i arkadaşları bile okuyamıyor: kimseye danışmadan hareket eden biri, artık kendi tarafı için de bir bilinmeyen.",
      en: "Years later Eren leaves the island and walks into the enemy nation alone; he lives among war casualties under a false name, helps a boy he meets in the street, and in that same city stands up in front of a gathering and declares war. On the same day he takes the War Hammer Titan. After this stop even his friends can no longer read him: someone who acts without consulting anyone has become an unknown to his own side as well.",
    },
    imageKey: EREN_IMAGE_KEYS.fateLiberio,
    side: "above",
  },
  {
    key: "rumbling",
    age: { tr: "19 yaş", en: "age nineteen" },
    title: { tr: "Yer Gürültüsü", en: "The Rumbling" },
    text: {
      tr: "Kraliyet kanıyla temas sonunda gerçekleşiyor ve Kurucu Titan'ın kilidi açılıyor. Duvarların içindeki sayısız titan yürüyüşe geçiyor; Eren dünyanın büyük kısmını ezmeyi seçiyor ve bunu adanın hayatta kalması olarak açıklıyor. Onu durduran şey bir ordu değil, aynı sokakta büyüdüğü insanlar oluyor — ve son darbeyi, hayatı boyunca onu koruyan kişi vuruyor. Sayfanın başındaki dar ölçü burada tamamen açılıyor; açıldığı yerde de kimse kalmıyor.",
      en: "Contact with royal blood finally happens and the lock on the Founding Titan opens. The countless Titans inside the walls begin to walk; Eren chooses to trample most of the world and explains it as the island's survival. What stops him is not an army but the people he grew up beside — and the final blow comes from the person who protected him all his life. The narrow measure from the top of this page opens completely here; and where it opens, no one is left.",
    },
    imageKey: EREN_IMAGE_KEYS.fateRumbling,
    side: "below",
  },
];

/* ── Üçlü ve kaptan ─────────────────────────────────────────────────────── */

export interface ErenBond {
  characterId: number;
  name: string;
  nativeName: string;
  role: LocalizedText;
  note: LocalizedText;
}

export const EREN_BONDS: ErenBond[] = [
  {
    characterId: 40881,
    name: "Mikasa Ackerman",
    nativeName: "ミカサ・アッカーマン",
    role: { tr: "Evlatlık kız kardeşi", en: "His foster sister" },
    note: {
      tr: "Çocukken Yeager evine geldi ve o günden sonra Eren'in yanından ayrılmadı. Sayfanın son durağındaki eli o taşıyor: onu en çok koruyan kişi, onu durduran kişi oluyor.",
      en: "She came to the Yeager house as a child and never left his side after. Hers is the hand at this page's last stop: the person who protected him most is the one who stops him.",
    },
  },
  {
    characterId: 46494,
    name: "Armin Arlert",
    nativeName: "アルミン・アルレルト",
    role: { tr: "En yakın arkadaşı", en: "His closest friend" },
    note: {
      tr: "Duvarın dışını anlatan kitabı Eren'e gösteren kişi. Bu sayfadaki bütün genişleme fikri aslında Armin'in: deniz, kum, alev alan su. Eren o hayali alıp bir plana çevirdi.",
      en: "The one who showed Eren the book about the outside. Every idea of widening on this page is originally Armin's: the sea, the sand, the water that burns. Eren took that dream and turned it into a plan.",
    },
  },
  {
    characterId: 45627,
    name: "Levi Ackerman",
    nativeName: "リヴァイ・アッカーマン",
    role: { tr: "Bağlı olduğu kaptan", en: "The captain he served under" },
    note: {
      tr: "Eren'i mahkemede döverek insanlığın yanında tuttu ve sonrasında sorumluluğunu üstlendi. Sayfadaki tek yetişkin ölçü: Eren genişledikçe Levi hep aynı dar hatta kaldı.",
      en: "He beat Eren in court to keep him on humanity's side and then took responsibility for him. The only adult measure on this page: as Eren widened, Levi stayed on the same narrow line.",
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const EREN_CLOSING = {
  quotes: [
    {
      text: "駆逐してやる…この世から一匹残らず！",
      reading: {
        tr: "«Hepsini yok edeceğim… bu dünyadan bir tanesini bile bırakmadan!»",
        en: "“I will wipe them out… every last one of them from this world!”",
      },
      by: { tr: "Eren Yeager", en: "Eren Yeager" },
      note: {
        tr: "Shiganshina düştükten sonra, henüz on yaşındayken. Cümlenin hedefi titanlardı; on yıl sonra aynı cümle insanlara döndü ve hiçbir kelimesi değişmedi.",
        en: "After the fall of Shiganshina, when he was still ten. The sentence was aimed at Titans; ten years later the same sentence turned on people, and not one word of it changed.",
      },
    },
    {
      text: "戦え！戦え！",
      reading: {
        tr: "«Savaş! Savaş!»",
        en: "“Fight! Fight!”",
      },
      by: { tr: "Eren Yeager", en: "Eren Yeager" },
      note: {
        tr: "Trost'ta, gücünü ilk kez kendi iradesiyle çağırırken. İki kelime; Eren'in bütün yöntemi bu ikisinin arasında duruyor.",
        en: "At Trost, calling his power up by his own will for the first time. Two words; his entire method lives between them.",
      },
    },
  ],
  motto: "自由",
  mottoNote: {
    tr: "Jiyū — «özgürlük». Sayfanın filigranı 進撃 (ileri yürüyüş) ama motto bu: Eren için ikisi hiçbir zaman ayrı iki şey olmadı, ve hikâyenin bütün trajedisi tam olarak burada.",
    en: "Jiyū — “freedom”. The page's watermark is 進撃 (the advance), but the motto is this: for Eren the two were never separate things, and the whole tragedy of the story sits exactly there.",
  },
  credit: {
    tr: "Künye, portre, doğum ve ad bilgileri AniList'ten; portre dosyası depoya indirildi (hotlink yok). Sayfadaki bütün grafikler — duvar dişleri, buhar katmanı, titan silüetleri — elle çizilmiş SVG.",
    en: "Dossier, portrait, birth and name data from AniList; the portrait file was downloaded into the repository (no hotlinking). Every graphic on this page — the wall crenellations, the steam layer, the Titan silhouettes — is hand-drawn SVG.",
  },
  creditLink: {
    tr: "AniList · Eren Yeager #40882",
    en: "AniList · Eren Yeager #40882",
  },
} as const;

/* ── Küratör boşluk özeti ───────────────────────────────────────────────── */

export const EREN_GAPS = {
  title: { tr: "Eren Yeager — görsel yuvaları", en: "Eren Yeager — image slots" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bütün yuvalar dolu. Sayfada eksik kadraj kalmadı.",
    en: "Every slot is filled. No frame on this page is missing.",
  },
} as const;
