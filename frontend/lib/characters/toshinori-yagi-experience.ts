import type { LocalizedText } from "./types";

/**
 * Toshinori Yagi / All Might — "Plus Ultra" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Sahne görselleri veritabanında — characterId 89224 kaydının ABILITY
 * yuvaları, `alm:*` anahtarlarıyla.
 *
 * ── SAYFANIN TEK CÜMLESİ ─────────────────────────────────────────────────
 * ALL MIGHT BİR FORM DEĞİL, BİR BÜTÇE. Sayfa bir Amerikan çizgi roman
 * posteri gibi açılıyor; posterin arkasında günde birkaç saatlik bir süreyi
 * harcayan tükenmiş bir adam var ve sayfanın mekaniği tam olarak o harcama.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (10 Haziran), boy (220 cm / 7'2"), Quirk adı (One For All),
 * "No. 1 Hero" ve "Symbol of Peace" sıfatları ile diğer adlar (All Might /
 * オールマイト, Toshi) AniList künyesinden birebir alındı — arşivin kendi
 * kopyası: `public/assets/anime/karakterler/toshinori-yagi/kaynak.json`
 * (30 Ağustos 2026). Ana dildeki ad da oradan: 八木俊典.
 *
 * ⚠️ YAŞ VE KAN GRUBU KAYITTA YOK (`yas: null`, `kanGrubu: null`), doğum
 * YILI da yok. Künye şeridinde üçü de BOŞ bırakıldı ve hiçbiri türetilmedi.
 *
 * ⚠️ KADER ÇİZELGESİ NEDEN YAŞ KULLANMIYOR. Sözleşme §4 çizelgeyi "yaş
 * etiketli" istiyor; ama künyede yaş YOK ve arşivin bir başka kuralı
 * "emin olmadığın ölçüyü yazma" diyor. Eren sayfası aynı çelişkiyi bir
 * kademe aşağıda çözmüştü: doğum yılı olmadığı için çizelge takvimle değil
 * yaşla ilerledi. Burada yaş da olmadığı için çizelge SAYFANIN KENDİ
 * SAATİYLE ilerliyor — her durakta "günde ne kadar All Might olabiliyordu"
 * yazıyor. Bu, uydurulmuş bir sayı değil sayfanın omurgası ve tek NİCEL
 * değeri ("günde üç saat") karakterin kendi cümlesinden geliyor. Karar
 * ziyaretçiye de yazılı olarak söyleniyor (`ALM_MISSING_NOTE`).
 *
 * ── SÜRE MEKANİĞİNİN DÜRÜSTLÜĞÜ ──────────────────────────────────────────
 * Toplam 180 dakika = üç saat; bu, All Might'ın halefine söylediği kanonik
 * sınır. Beş harcamanın DAKİKA BÖLÜŞÜMÜ ise kanon değil, sayfanın kendi
 * muhasebesi — bu, hem ekranda (`ALM_METER_UI.ledger`) hem burada açıkça
 * yazılı. Kanon olmayan hiçbir sayı kanonmuş gibi sunulmuyor.
 *
 * ── TERMİNOLOJİ (uydurma yok, MHA evreninin kendi sözcükleri) ────────────
 * 個性 (Quirk), ワン・フォー・オール (One For All), Ultimate Move,
 * Hero Adı, Kahraman Sıralaması (No. 1), 平和の象徴 (barışın sembolü),
 * 雄英高校 (Yūei Lisesi), プルス・ウルトラ (Plus Ultra).
 * Adı geçen Ultimate Move ve Smash türevlerinin hepsi gerçek:
 * Detroit / Texas / Carolina / Oklahoma Smash ve United States of Smash.
 * "Jutsu" ya da "teknik" sözcüğü sayfada HİÇ geçmiyor.
 *
 * ⚠️ EMİN OLUNMAYAN KANJİ YAZILMADI. Nana Shimura, Kamino, Nōmu ve USJ
 * yalnızca romanizasyonla anılıyor; yazımından emin olunmayan hiçbir özel
 * adın kanjisi uydurulmadı (Onizuka emsali, Dalga 1 denetimi §5).
 */

export const ALM_ID = 89224;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const ALM_SITE_URL = "https://anilist.co/character/89224";

/**
 * Depodaki resmî portre (Faz 2 §3: hotlink YOK, dosya repoda).
 * Ölçüsü `kaynak.json`'dan: 230×345 — yani KÜÇÜK. Sayfada poster
 * madalyonu boyunda kullanılıyor; büyük hero kareleri `alm:hero-*`
 * yuvalarında bekliyor.
 */
export const ALM_PORTRAIT = {
  src: "/assets/anime/karakterler/toshinori-yagi/anilist-portrait.jpg",
  w: 230,
  h: 345,
} as const;

/**
 * Sahne görselleri — hepsi characterId 89224 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `alm:` önekli (küratör modu şartı).
 *
 * İKİ hero anahtarı var, çünkü mod düğmesi hero görselini DEĞİŞTİRİYOR
 * (brief §Düğme): altın formda `heroGolden`, gerçek formda `heroTrue`.
 */
export const ALM_IMAGE_KEYS = {
  heroGolden: "alm:hero-golden",
  heroTrue: "alm:hero-true",
  ofa: "alm:one-for-all",
  ultimate: "alm:united-states",
  symbol: "alm:symbol",
  detroit: "alm:detroit",
  texas: "alm:texas",
  carolina: "alm:carolina",
  oklahoma: "alm:oklahoma",
  meter: "alm:kalan-sure",
  fateNana: "alm:fate-nana",
  fateNumberOne: "alm:fate-birnumara",
  fateWound: "alm:fate-yara",
  fateSuccessor: "alm:fate-halef",
  fateKamino: "alm:fate-kamino",
  bonds: "alm:bonds",
  closing: "alm:closing",
} as const;

/** Portre yuvası ABILITY değil PORTRAIT — yüklenen kare 230×345'i EZER. */
export const ALM_PORTRAIT_SLOT_KEY = "PORTRAIT";

/**
 * Küratör yuvalarının etiketleri.
 *
 * ⚠️ Bu metinler YALNIZCA `isAdmin` dalında çiziliyor. Ziyaretçi boş bir
 * kadraj görür ve o kadrajda TEK KELİME yazmaz (Dalga 1 denetimi §1:
 * Levi sayfasında üretim metadatası ziyaretçiye sızmıştı).
 */
export const ALM_SLOT_LABELS: Record<string, LocalizedText> = {
  [ALM_PORTRAIT_SLOT_KEY]: {
    tr: "Portre — dikey kare; yüklenen görsel AniList'in 230×345'ini ezer (2:3, webp)",
    en: "Portrait — a vertical frame; an upload overrides AniList's 230×345 (2:3, webp)",
  },
  [ALM_IMAGE_KEYS.heroGolden]: {
    tr: "Hero · altın form — geniş poster karesi: kaslı siluet, ışın demeti (16:9, webp)",
    en: "Hero · golden form — a wide poster plate: the muscled silhouette, a beam of speed lines (16:9, webp)",
  },
  [ALM_IMAGE_KEYS.heroTrue]: {
    tr: "Hero · gerçek form — aynı kadraj, zayıf gövde; düşük kontrast (16:9, webp)",
    en: "Hero · true form — the same crop, the gaunt body; low contrast (16:9, webp)",
  },
  [ALM_IMAGE_KEYS.ofa]: {
    tr: "One For All — devredilen gücün kartı: yumruk ve ışık (4:3, webp)",
    en: "One For All — the card of the handed-down power: a fist and light (4:3, webp)",
  },
  [ALM_IMAGE_KEYS.ultimate]: {
    tr: "United States of Smash — Ultimate Move: son yumruk, dumanı tüten kol (4:3, webp)",
    en: "United States of Smash — the Ultimate Move: the last punch, a smoking arm (4:3, webp)",
  },
  [ALM_IMAGE_KEYS.symbol]: {
    tr: "Barışın sembolü — kalabalık ve tek bir gülümseme; geniş kadraj (4:3, webp)",
    en: "The Symbol of Peace — a crowd and a single smile; wide crop (4:3, webp)",
  },
  [ALM_IMAGE_KEYS.detroit]: {
    tr: "Detroit Smash — yukarı doğru yumruk, hava dalgası (1:1, webp)",
    en: "Detroit Smash — an upward fist, a wave of air (1:1, webp)",
  },
  [ALM_IMAGE_KEYS.texas]: {
    tr: "Texas Smash — düz ileri yumruk, basınç konisi (1:1, webp)",
    en: "Texas Smash — a straight forward punch, a cone of pressure (1:1, webp)",
  },
  [ALM_IMAGE_KEYS.carolina]: {
    tr: "Carolina Smash — iki kolla aşağı inen çapraz darbe (1:1, webp)",
    en: "Carolina Smash — a two-armed cross coming down (1:1, webp)",
  },
  [ALM_IMAGE_KEYS.oklahoma]: {
    tr: "Oklahoma Smash — dönerek yaratılan kasırga; havadaki toz (1:1, webp)",
    en: "Oklahoma Smash — a spin-made whirlwind; dust in the air (1:1, webp)",
  },
  [ALM_IMAGE_KEYS.meter]: {
    tr: "Kalan süre — çok geniş şerit: saatin dolduğu an, buharlaşan siluet (21:9, webp)",
    en: "Time remaining — an ultra-wide strip: the moment the clock runs out, a silhouette steaming away (21:9, webp)",
  },
  [ALM_IMAGE_KEYS.fateNana]: {
    tr: "Devir — ustası ile genç Toshinori; iç mekân (16:9, webp)",
    en: "The handover — his master and a young Toshinori; interior (16:9, webp)",
  },
  [ALM_IMAGE_KEYS.fateNumberOne]: {
    tr: "Bir numara — şehir, kalabalık, tabelalar; parlak (16:9, webp)",
    en: "Number one — a city, a crowd, billboards; bright (16:9, webp)",
  },
  [ALM_IMAGE_KEYS.fateWound]: {
    tr: "Yara — gece, harabe, tek figür; çok karanlık (16:9, webp)",
    en: "The wound — night, rubble, a single figure; very dark (16:9, webp)",
  },
  [ALM_IMAGE_KEYS.fateSuccessor]: {
    tr: "Halef — kumsal, iki figür, sabah ışığı (16:9, webp)",
    en: "The successor — a beach, two figures, morning light (16:9, webp)",
  },
  [ALM_IMAGE_KEYS.fateKamino]: {
    tr: "Kamino — yıkılmış mahalle, kameralar, incelen gövde (16:9, webp)",
    en: "Kamino — a levelled district, cameras, a thinning body (16:9, webp)",
  },
  [ALM_IMAGE_KEYS.bonds]: {
    tr: "Kadro — halefi ve karşısındakiler; geniş şerit (2:1, webp)",
    en: "The cast — his successor and those against him; wide strip (2:1, webp)",
  },
  [ALM_IMAGE_KEYS.closing]: {
    tr: "Kapanış — boş bir kürsü ya da uzaklaşan sırt; insansız tercih edilir (2:1, webp)",
    en: "Closing — an empty podium or a back walking away; no people preferred (2:1, webp)",
  },
};

/** Küratör özetindeki "beklenen kare" satırları. */
export const ALM_SLOT_SPECS: Record<string, LocalizedText> = {
  [ALM_PORTRAIT_SLOT_KEY]: {
    tr: "dikey portre · 1200×1600 · webp",
    en: "vertical portrait · 1200×1600 · webp",
  },
  [ALM_IMAGE_KEYS.heroGolden]: {
    tr: "poster karesi · 1920×1080 · webp",
    en: "poster plate · 1920×1080 · webp",
  },
  [ALM_IMAGE_KEYS.heroTrue]: {
    tr: "poster karesi · 1920×1080 · webp",
    en: "poster plate · 1920×1080 · webp",
  },
  [ALM_IMAGE_KEYS.ofa]: {
    tr: "güç kartı · 1200×900 · webp",
    en: "power card · 1200×900 · webp",
  },
  [ALM_IMAGE_KEYS.ultimate]: {
    tr: "güç kartı · 1200×900 · webp",
    en: "power card · 1200×900 · webp",
  },
  [ALM_IMAGE_KEYS.symbol]: {
    tr: "güç kartı · 1200×900 · webp",
    en: "power card · 1200×900 · webp",
  },
  [ALM_IMAGE_KEYS.detroit]: {
    tr: "kare detay · 800×800 · webp",
    en: "square detail · 800×800 · webp",
  },
  [ALM_IMAGE_KEYS.texas]: {
    tr: "kare detay · 800×800 · webp",
    en: "square detail · 800×800 · webp",
  },
  [ALM_IMAGE_KEYS.carolina]: {
    tr: "kare detay · 800×800 · webp",
    en: "square detail · 800×800 · webp",
  },
  [ALM_IMAGE_KEYS.oklahoma]: {
    tr: "kare detay · 800×800 · webp",
    en: "square detail · 800×800 · webp",
  },
  [ALM_IMAGE_KEYS.meter]: {
    tr: "çok geniş sahne · 2100×900 · webp",
    en: "ultra-wide scene · 2100×900 · webp",
  },
  [ALM_IMAGE_KEYS.fateNana]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [ALM_IMAGE_KEYS.fateNumberOne]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [ALM_IMAGE_KEYS.fateWound]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [ALM_IMAGE_KEYS.fateSuccessor]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [ALM_IMAGE_KEYS.fateKamino]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [ALM_IMAGE_KEYS.bonds]: {
    tr: "geniş şerit · 1600×800 · webp",
    en: "wide strip · 1600×800 · webp",
  },
  [ALM_IMAGE_KEYS.closing]: {
    tr: "geniş şerit · 1600×800 · webp",
    en: "wide strip · 1600×800 · webp",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const ALM_IDENTITY = {
  name: "Toshinori Yagi",
  nativeName: "八木俊典",
  heroName: "All Might",
  heroNameNative: "オールマイト",
  /** Filigranın kanji yarısı — dekoratif (aria-hidden): barışın sembolü */
  watermark: "平和の象徴",
  house: {
    tr: "Kahraman Sıralaması No. 1 · Barışın Sembolü · Yūei Lisesi öğretmeni",
    en: "Hero Ranking No. 1 · the Symbol of Peace · teacher at U.A. High",
  },
  epigraph: {
    tr: "Kahramanlığın kaslarda olduğunu sanırsın; oysa bu adamın taşıdığı şey bir güç değil bir BÜTÇE. Günün belli bir kısmında All Might olabiliyor, gerisinde Toshinori Yagi. Poster ne kadar parlaksa arkasındaki hesap o kadar acımasız.",
    en: "You think heroism lives in the muscle; what this man actually carries is not a power but a BUDGET. For a certain part of the day he can be All Might, and for the rest he is Toshinori Yagi. The brighter the poster, the crueller the arithmetic behind it.",
  },
  facts: [
    {
      label: { tr: "Doğum günü", en: "Birthday" },
      value: { tr: "10 Haziran", en: "10 June" },
    },
    {
      label: { tr: "Ana dildeki adı", en: "Name in Japanese" },
      value: { tr: "八木俊典", en: "八木俊典" },
    },
    {
      label: { tr: "Hero Adı", en: "Hero Name" },
      value: { tr: "All Might — オールマイト", en: "All Might — オールマイト" },
    },
    {
      label: { tr: "Kahraman Sıralaması", en: "Hero Ranking" },
      value: { tr: "No. 1", en: "No. 1" },
    },
    {
      label: { tr: "Quirk (個性)", en: "Quirk (個性)" },
      value: {
        tr: "One For All — ワン・フォー・オール",
        en: "One For All — ワン・フォー・オール",
      },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "220 cm (7'2\")", en: "220 cm (7'2\")" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "künyede yok", en: "not in the record" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "künyede yok", en: "not in the record" },
    },
    {
      label: { tr: "Görev yeri", en: "Posting" },
      value: {
        tr: "Yūei Lisesi (雄英高校) · Kahramanlık Temelleri",
        en: "U.A. High (雄英高校) · Foundational Hero Studies",
      },
    },
    {
      label: { tr: "Diğer adları", en: "Also known as" },
      value: {
        tr: "Toshi · Barışın Sembolü (平和の象徴)",
        en: "Toshi · the Symbol of Peace (平和の象徴)",
      },
    },
  ],
} as const;

export const ALM_SYMBOL = {
  title: { tr: "Sembolik işaret", en: "The symbolic mark" },
  kanji: "笑顔",
  reading: { tr: "egao — «gülümseme»", en: "egao — “the smile”" },
  text: {
    tr: "Sayfadaki tek sembolik nesne bir kılıç ya da pelerin değil, bir yüz ifadesi. All Might her göründüğünde gülümsüyor ve bunun sebebini kendisi söylüyor: korkmuş bir Barış Sembolü, sembol olmaktan çıkar. Yani gülümseme bir huy değil bir GÖREV — ve bu sayfadaki bütün maliyetin en pahalısı.",
    en: "The one symbolic object on this page is neither a sword nor a cape but a facial expression. All Might smiles every time he appears, and he says why himself: a Symbol of Peace who looks afraid stops being a symbol. So the smile is not a temperament but a DUTY — and the most expensive line item on this page.",
  },
} as const;

export const ALM_MISSING_NOTE: LocalizedText = {
  tr: "Künyede yaş, kan grubu ve doğum yılı BOŞ. Hiçbiri türetilmedi; bu yüzden aşağıdaki kader çizelgesi de yaşla değil sayfanın kendi saatiyle ilerliyor — her durakta «günde ne kadar All Might olabiliyordu» yazıyor. Oradaki tek nicel değer («günde üç saat») karakterin halefine söylediği cümleden geliyor.",
  en: "Age, blood type and birth year are BLANK in the record. None of them has been derived; that is why the fate chart below runs not on age but on this page's own clock — each stop says how much of the day he could still be All Might. The single quantity there (“three hours a day”) comes from what he tells his successor.",
};

export const ALM_ALT = {
  companionSuffix: { tr: "portresi", en: "portrait" },
  portraitUploaded: {
    tr: "Toshinori Yagi — arşivin yüklediği portre",
    en: "Toshinori Yagi — portrait uploaded by the archive",
  },
  portraitLocal: {
    tr: "Toshinori Yagi — AniList resmî portresi (depodaki kopya, 230×345)",
    en: "Toshinori Yagi — official AniList portrait (repository copy, 230×345)",
  },
} as const;

export const ALM_CRUMB = {
  series: { tr: "My Hero Academia", en: "My Hero Academia" },
} as const;

/* ── Mod düğmesi: Plus Ultra ────────────────────────────────────────────── */

/**
 * Düğme sayfanın YAPISINI çeviriyor, ışığını değil (brief §Düğme):
 *   `golden` → kalın kontur, ben-day noktaları açık, geniş paneller,
 *              altın palet, hero karesi `alm:hero-golden`
 *   `true`   → kontur incelir, ben-day kaybolur, paneller daralır,
 *              palet soğuk maviye kayar, hero karesi `alm:hero-true`
 *
 * ⚠️ Kilitli ızgara (çizgi roman paneli düzeni) İKİ DURUMDA DA duruyor —
 * düğme onu açıp kapatmıyor, DERECESİNİ değiştiriyor (Dalga 1 denetimi §2:
 * Onizuka sayfasında mod kapalıyken ızgara tamamen kayboluyordu).
 */
export const ALM_FORM_TEXT = {
  label: { tr: "Plus Ultra", en: "Plus Ultra" },
  native: "プルス・ウルトラ",
  toGolden: { tr: "Altın forma geç", en: "Go to the golden form" },
  toTrue: { tr: "Gerçek forma dön", en: "Back to the true form" },
  stateGolden: { tr: "Altın form — All Might", en: "Golden form — All Might" },
  stateTrue: { tr: "Gerçek form — Toshinori Yagi", en: "True form — Toshinori Yagi" },
  hintGolden: {
    tr: "Kontur kalın, ben-day noktaları açık, paneller geniş. Poster çalışıyor: bakan kişi korkmuyor.",
    en: "The contour is thick, the ben-day dots are on, the panels are wide. The poster is working: whoever looks at it is not afraid.",
  },
  hintTrue: {
    tr: "Kontur inceldi, noktalar gitti, paneller daraldı, renk soğudu. Aynı adam — yalnızca posteri kapalı.",
    en: "The contour has thinned, the dots are gone, the panels have narrowed, the colour has cooled. The same man — only with the poster switched off.",
  },
  lockedTitle: { tr: "Süre bitti", en: "Time is up" },
  locked: {
    tr: "Günün süresi bitti; altın forma bu sayfada bir daha geçilemiyor. Sayfayı yenilemek saati sıfırlar — All Might'ın gerçek hayatında böyle bir düğme yok.",
    en: "The day's time is spent; the golden form cannot be entered again on this page. Reloading the page resets the clock — in All Might's actual life there is no such button.",
  },
  sectionTitle: { tr: "Poster ve adam", en: "The poster and the man" },
  sectionLede: {
    tr: "Sayfanın tek modu bu. Bir düğmeye basmak rengi değil YAPIYI çeviriyor: panel konturu, nokta deseni, panel genişliği ve hero karesi birlikte değişiyor. Aşağıdaki sayaç düştükçe aynı değişim kendiliğinden de oluyor.",
    en: "This is the page's only mode. Pressing it turns not the colour but the STRUCTURE: the panel contour, the dot pattern, the panel width and the hero plate all change together. As the counter below drops, the same change happens on its own.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const ALM_HERO = {
  eyebrow: { tr: "Barışın Sembolü", en: "The Symbol of Peace" },
  lede: {
    tr: "Bu sayfa bir Amerikan çizgi roman sayfası gibi kurulu: kalın konturlu paneller, aralarında kâğıt oluğu, panel içinde ben-day noktaları. Ama posterin taşıdığı adam sınırsız değil — günün yalnızca bir kısmında All Might olabiliyor, gerisinde zayıf, kanlı öksüren bir öğretmen. Aşağıdaki sayaç o kısmı ölçüyor ve harcadıkça sayfa kendiliğinden gerçek forma dönüyor. Geri alma yok.",
    en: "This page is built like an American comic page: thick-contoured panels, a paper gutter between them, ben-day dots inside. But the man the poster carries is not limitless — for only part of the day can he be All Might, and for the rest he is a gaunt teacher who coughs blood. The counter below measures that part, and as you spend it the page turns into the true form on its own. There is no undo.",
  },
  frameCaption: {
    tr: "Büyük hero karesi küratör yuvası olarak bekliyor ve moda göre değişiyor: altın formda bir kare, gerçek formda başka bir kare.",
    en: "The large hero plate waits as a curator slot and changes with the mode: one plate for the golden form, another for the true one.",
  },
  portraitCaption: {
    tr: "AniList portresi 230×345 — poster boyunda değil, madalyon boyunda. Bilerek küçük duruyor.",
    en: "The AniList portrait is 230×345 — medallion size, not poster size. It is deliberately kept small.",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const ALM_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "Dossier" },
    lede: {
      tr: "AniList kaydından birebir; boşları boş bırakıldı.",
      en: "Verbatim from the AniList record; blanks left blank.",
    },
  },
  lab: {
    title: { tr: "Güç künyesi", en: "The power record" },
    lede: {
      tr: "Üç büyük başlık ve dört Smash. Hepsi evrenin kendi terminolojisiyle: Quirk (個性), Ultimate Move, Hero Adı, Kahraman Sıralaması.",
      en: "Three headline entries and four Smashes, all in the universe's own terminology: Quirk (個性), Ultimate Move, Hero Name, Hero Ranking.",
    },
  },
  meter: {
    title: { tr: "Kalan süre", en: "Time remaining" },
    lede: {
      tr: "Sayfanın kalbi. Beş harcama, tek bütçe, geri dönüş yok.",
      en: "The heart of the page. Five expenditures, one budget, no way back.",
    },
  },
  fate: {
    title: { tr: "Beş durak", en: "Five stops" },
    lede: {
      tr: "Yaşla değil sayfanın saatiyle ilerliyor: her durakta günde ne kadar All Might olabildiği yazıyor.",
      en: "It runs on this page's clock rather than on age: each stop says how much of the day he could be All Might.",
    },
  },
  bonds: {
    title: { tr: "Devraldıklar ve karşısındakiler", en: "Heirs and adversaries" },
    lede: {
      tr: "Bu sayfada gücü de düşmanı da DEVREDİLİYOR. Beş kimliğin ikisinin kendi dosyası var.",
      en: "On this page both the power and the enemy get HANDED DOWN. Two of these five have files of their own.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "Girerken söylediği cümle ile çıkarken söylediği cümle aynı işi yapıyor: birinde o geliyor, ötekinde sıra sende.",
      en: "The line he says on the way in and the line he says on the way out do the same job: in one he arrives, in the other it is your turn.",
    },
  },
} as const;

/* ── Güç künyesi: üç büyük ──────────────────────────────────────────────── */

export interface AlmPower {
  key: string;
  /** Çeviri gerektirmeyen özel ad */
  name: string;
  native: string;
  /** Evrenin kendi terim etiketi — Quirk / Ultimate Move / Hero Adı… */
  kind: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
  imageKey: string;
}

export const ALM_POWERS: AlmPower[] = [
  {
    key: "ofa",
    name: "One For All",
    native: "ワン・フォー・オール",
    kind: { tr: "Quirk (個性)", en: "Quirk (個性)" },
    tagline: {
      tr: "Doğuştan gelmeyen tek Quirk: biriktirilip elden ele veriliyor.",
      en: "The one Quirk nobody is born with: it is stockpiled and handed on.",
    },
    text: {
      tr: "One For All bir yetenek değil bir MİRAS. Her taşıyıcı gücü bir süre biriktiriyor ve sonra bir sonrakine devrediyor; devir gönüllü ve fiziksel — devralacak kişinin taşıyıcının DNA'sından bir parça alması gerekiyor. Toshinori bu zincirin sekizinci halkası; dokuzuncusu Izuku Midoriya. Sayfanın bütün trajedisi bu tanımın içinde saklı: biriktirilen bir gücü taşımak, onu bir gün bırakmak zorunda olmak demek. All Might'ın gücünü kaybetmesi bir yenilgi değil, tanımın kendisi.",
      en: "One For All is not an ability but an INHERITANCE. Each holder stockpiles the power for a while and then passes it on; the handover is willing and physical — the heir has to take a piece of the holder's DNA. Toshinori is the eighth link in that chain; the ninth is Izuku Midoriya. The whole tragedy of this page hides inside that definition: to carry a stockpiled power is to be obliged to put it down one day. All Might losing his power is not a defeat but the definition itself.",
    },
    traits: [
      { tr: "Sekizinci taşıyıcı", en: "The eighth holder" },
      { tr: "Devir gönüllü ve fiziksel", en: "The handover is willing and physical" },
      { tr: "Halefi: Izuku Midoriya", en: "Successor: Izuku Midoriya" },
    ],
    imageKey: ALM_IMAGE_KEYS.ofa,
  },
  {
    key: "ultimate",
    name: "United States of Smash",
    native: "ユナイテッド・ステイツ・オブ・スマッシュ",
    kind: { tr: "Ultimate Move", en: "Ultimate Move" },
    tagline: {
      tr: "Kalanın tamamını tek bir yumruğa koymak.",
      en: "Putting everything that is left into a single punch.",
    },
    text: {
      tr: "Ultimate Move, bu evrende bir kahramanın kendi Quirk'ünden çıkardığı imza hareketin adı. All Might'ınki bir teknik incelikten ibaret değil: elinde kalan ne varsa hepsini tek bir darbeye yüklemek. Kamino'da bunu yaparken gövdesi kameraların önünde küçülüyor ve yumruğu bittiğinde geriye All Might değil Toshinori Yagi kalıyor. Yani bu hareketin gerçek maliyeti rakip değil, hareketin sahibi. Sayfadaki sayaç tam olarak bu yüzden var.",
      en: "In this universe an Ultimate Move is the signature strike a hero derives from their own Quirk. All Might's is not a matter of technique: it is loading everything he has left into one blow. At Kamino his body shrinks in front of the cameras while he does it, and when the punch is over what remains is not All Might but Toshinori Yagi. The real cost of this move is not the opponent but its owner. That is exactly why the counter on this page exists.",
    },
    traits: [
      { tr: "Kalan gücün tamamı", en: "Everything that is left" },
      { tr: "Kamino'daki son darbe", en: "The final blow at Kamino" },
      { tr: "Bedelini rakip değil sahibi ödüyor", en: "Its owner pays, not the opponent" },
    ],
    imageKey: ALM_IMAGE_KEYS.ultimate,
  },
  {
    key: "symbol",
    name: "Symbol of Peace",
    native: "平和の象徴",
    kind: {
      tr: "Hero Adı ve Kahraman Sıralaması",
      en: "Hero Name and Hero Ranking",
    },
    tagline: {
      tr: "Sıralamanın birinciliği bir ödül değil bir görev tanımı.",
      en: "Being number one is not a prize but a job description.",
    },
    text: {
      tr: "All Might yalnızca en güçlü kahraman değil, varlığıyla suç oranını düşüren bir kurum. Toplumun ona yüklediği iş şu: ortada dururken kimse kötü bir şey yapmaya cesaret etmesin. Bu işin bir yan şartı var ve bütün sayfa onun üzerine kurulu — sembolün yorulduğu, korktuğu ya da kanadığı görülmemeli. Bu yüzden gülümsüyor, bu yüzden yarasını yıllarca sakladı, bu yüzden süresi dolarken bile poz vermeye devam etti.",
      en: "All Might is not merely the strongest hero but an institution that lowers the crime rate by existing. The job society hands him is this: while he stands there, let no one dare do anything bad. That job has a side condition, and this entire page is built on it — the symbol must never be seen tired, afraid or bleeding. That is why he smiles, why he hid his wound for years, and why he kept posing even as his time ran out.",
    },
    traits: [
      { tr: "Kahraman Sıralaması No. 1", en: "Hero Ranking No. 1" },
      { tr: "Varlığıyla caydırıyor", en: "Deters by existing" },
      { tr: "Yorgunluğu görünmemeli", en: "Must never look tired" },
    ],
    imageKey: ALM_IMAGE_KEYS.symbol,
  },
];

/* ── Güç künyesi: dört Smash ────────────────────────────────────────────── */

export interface AlmSmash {
  key: string;
  name: string;
  native: string;
  note: LocalizedText;
  imageKey: string;
}

export const ALM_SMASHES: AlmSmash[] = [
  {
    key: "detroit",
    name: "Detroit Smash",
    native: "デトロイト・スマッシュ",
    note: {
      tr: "Yukarı doğru savrulan yumruk. Sonucu bir rakip değil bir HAVA OLAYI: darbenin kendisi yağmur bulutlarını dağıtıyor. Sayfanın ilk cümlesi burada — bu adam bir dövüşçü değil, bir doğa gücü gibi tanıtılıyor.",
      en: "A fist thrown upward. Its result is not an opponent but a WEATHER EVENT: the blow itself scatters the rain clouds. The page's first sentence lives here — this man is introduced not as a fighter but as a force of nature.",
    },
    imageKey: ALM_IMAGE_KEYS.detroit,
  },
  {
    key: "texas",
    name: "Texas Smash",
    native: "テキサス・スマッシュ",
    note: {
      tr: "Düz ileri, tek kollu. Vurduğu şey çoğu zaman rakip bile değil, rakibin arkasındaki hava: basınç dalgası hedefi süpürüyor. Kurtarma işlerinde tercih ettiği darbe, çünkü temas etmeden iş görüyor.",
      en: "Straight ahead, one arm. What it hits is often not even the opponent but the air behind them: the pressure wave sweeps the target away. His preferred blow on rescues, because it works without touching.",
    },
    imageKey: ALM_IMAGE_KEYS.texas,
  },
  {
    key: "carolina",
    name: "Carolina Smash",
    native: "カロライナ・スマッシュ",
    note: {
      tr: "İki kolun çapraz inişi. Tek yumruğun yetmediği anlarda çıkıyor ve gövdenin tamamını işin içine katıyor — yani daha çok güç değil, daha çok BEDEN demek. Yaralı bir adam için bu sıradan bir ayrıntı değil.",
      en: "A crossing descent of both arms. It comes out when one fist is not enough and puts the whole torso into the work — which means not more power but more BODY. For an injured man that is not a small detail.",
    },
    imageKey: ALM_IMAGE_KEYS.carolina,
  },
  {
    key: "oklahoma",
    name: "Oklahoma Smash",
    native: "オクラホマ・スマッシュ",
    note: {
      tr: "Dönerek yaratılan kasırga. Diğer üçü tek bir noktaya vururken bu darbe ÇEVREYE vuruyor: kalabalık bir alanı bir hamlede temizlemek için var. Bir kahramanın en pahalı hamlesi hep alanı temizleyen hamledir.",
      en: "A whirlwind made by spinning. Where the other three strike a single point, this one strikes the SURROUNDINGS: it exists to clear a crowded area in one motion. A hero's most expensive move is always the one that clears the field.",
    },
    imageKey: ALM_IMAGE_KEYS.oklahoma,
  },
];

/* ── Sayfanın kalbi: kalan süre ─────────────────────────────────────────── */

/**
 * Beş harcama, tek bütçe.
 *
 * `ALM_METER_TOTAL` = 180 dakika = üç saat. Bu sayı KANON: All Might
 * halefine günde yaklaşık üç saat All Might kalabildiğini söylüyor.
 *
 * ⚠️ Harcamaların dakika bölüşümü kanon DEĞİL — sayfanın kendi muhasebesi
 * ve bu ekranda da yazılı (`ALM_METER_UI.ledger`). Beş kalem toplamı tam
 * 180 olsun diye seçildi: 40 + 25 + 45 + 50 + 20.
 *
 * Anlatılan beş anın hepsi gerçek. Sıra serbest: kullanıcı hangisini
 * isterse önce harcayabilir. Kalan süre bir kalemin maliyetinden AZSA
 * kalem yine de kullanılabiliyor — sayaç sıfıra iniyor ve satır "sınır
 * aşıldı" olarak işaretleniyor. Bu bir hata durumu değil, karakterin
 * kendisi: All Might sınırını defalarca aştı.
 */
export const ALM_METER_TOTAL = 180;

export interface AlmSpend {
  key: string;
  cost: number;
  native: string;
  title: LocalizedText;
  text: LocalizedText;
  /** Harcandıktan sonra düşen tek satır */
  after: LocalizedText;
}

export const ALM_SPENDS: AlmSpend[] = [
  {
    key: "rescue",
    cost: 40,
    native: "救助",
    title: { tr: "Kurtarma", en: "The rescue" },
    text: {
      tr: "Sıradan bir öğleden sonra, sıradan bir kötü adam ve içine hapsolmuş bir çocuk. All Might o gün limitini çoktan doldurmuştu; yine de dönüştü. Bu sayfanın en ucuz görünen kalemi aslında en öğreticisi — kurtarma bir plan değil bir refleks ve refleksin de faturası var.",
      en: "An ordinary afternoon, an ordinary villain and a boy trapped inside it. All Might had already used up his limit that day; he transformed anyway. The cheapest-looking item on this page is the most instructive — a rescue is not a plan but a reflex, and reflexes get billed too.",
    },
    after: {
      tr: "Çocuk kurtuldu. Ceketin altındaki gövde bir kademe daha inceldi.",
      en: "The boy was saved. The body under the coat thinned by one more notch.",
    },
  },
  {
    key: "class",
    cost: 25,
    native: "雄英高校",
    title: { tr: "Ders", en: "The lesson" },
    text: {
      tr: "Yūei Lisesi'nde Kahramanlık Temelleri dersi. Öğrencilerin karşısına All Might olarak çıkıyor, çünkü onlara öğrettiği şey bir müfredat değil bir DURUŞ. Ama ders saatinin uzunluğu artık pedagojiyle değil sayaçla belirleniyor: zil çalmadan formu bitebilir.",
      en: "Foundational Hero Studies at U.A. High. He faces the students as All Might, because what he teaches them is not a syllabus but a STANCE. Yet the length of a class period is no longer set by pedagogy but by a counter: his form can run out before the bell.",
    },
    after: {
      tr: "Ders bitti. Koridorda kimse yokken duvara yaslandı.",
      en: "The class ended. With nobody in the corridor he leaned on the wall.",
    },
  },
  {
    key: "usj",
    cost: 45,
    native: "USJ",
    title: { tr: "USJ", en: "USJ" },
    text: {
      tr: "Öğrencilerin eğitim tesisi basılıyor ve karşısına özel olarak ona karşı yapılmış bir yaratık, Nōmu, çıkıyor. Kavganın ortasında kendi kendine söylediği hesap sayfanın tezini tek cümlede özetliyor: en iyi günlerinde beş vuruşta bitirdiği bir işi o gün üç yüzün üstünde vuruşla ancak bitirebiliyor. Güç aynı görünüyor; süre aynı değil.",
      en: "The students' training facility is attacked and he faces a creature built specifically against him, a Nōmu. Mid-fight, the sum he does in his head states this page's thesis in one line: a job that in his best days took five hits takes over three hundred that day. The power looks the same; the time does not.",
    },
    after: {
      tr: "Yaratık düştü. Ağzından çıkan ilk şey söz değildi.",
      en: "The creature went down. The first thing out of his mouth was not a word.",
    },
  },
  {
    key: "kamino",
    cost: 50,
    native: "Kamino",
    title: { tr: "Kamino", en: "Kamino" },
    text: {
      tr: "Bütün ülkenin canlı yayında izlediği kavga. Karşısında yıllar önce onu sakatlayan adam var ve bu sefer saklanacak yer yok: gövde kameraların önünde küçülüyor, kaslar çekiliyor, ceket boşalıyor. Sayfanın en pahalı kalemi bu, çünkü burada harcanan yalnızca süre değil — SIR da harcanıyor.",
      en: "The fight the entire country watches live. Facing him is the man who crippled him years earlier, and this time there is nowhere to hide: the body shrinks in front of the cameras, the muscle recedes, the coat empties. This is the page's most expensive item, because what is spent here is not only time — the SECRET is spent too.",
    },
    after: {
      tr: "Kazandı. Ve ülkenin tamamı gerçek gövdeyi gördü.",
      en: "He won. And the whole country saw the real body.",
    },
  },
  {
    key: "smile",
    cost: 20,
    native: "笑顔",
    title: { tr: "Gülümseme", en: "The smile" },
    text: {
      tr: "Kavga yok, kurtarma yok — yalnızca kalabalığın önünde durup gülümsemek. Bu kalemin en ucuz görünmesi bir yanılsama: ötekiler yılda birkaç kez oluyor, bu HER GÜN oluyor. Barışın sembolü olmanın gerçek maliyeti kahramanlık anlarında değil, aradaki sıradan günlerde ödeniyor.",
      en: "No fight, no rescue — just standing in front of a crowd and smiling. That this item looks cheapest is an illusion: the others happen a few times a year, this happens EVERY DAY. The real cost of being the Symbol of Peace is paid not in the heroic moments but on the ordinary days in between.",
    },
    after: {
      tr: "Kimse korkmadı. Sayaç yine de aynı hızla indi.",
      en: "Nobody was afraid. The counter went down at the same rate all the same.",
    },
  },
];

export const ALM_METER_UI = {
  budgetLabel: { tr: "Günün bütçesi", en: "The day's budget" },
  remainingLabel: { tr: "Kalan", en: "Remaining" },
  unit: { tr: "dakika", en: "minutes" },
  costLabel: { tr: "Maliyet", en: "Cost" },
  spendLabel: { tr: "Harca", en: "Spend" },
  spentLabel: { tr: "Harcandı", en: "Spent" },
  overLabel: { tr: "Sınır aşıldı", en: "Limit exceeded" },
  ledgerTitle: { tr: "Defter", en: "The ledger" },
  ledgerEmpty: {
    tr: "Defter boş. Bütçenin tamamı duruyor ve sayfa hâlâ altın formda.",
    en: "The ledger is empty. The whole budget is intact and the page is still in its golden form.",
  },
  ledger: {
    tr: "Toplam üç saat, yani 180 dakika: bu sayı All Might'ın halefine söylediği sınır. Beş kalemin dakika bölüşümü ise kanon değil, bu sayfanın kendi muhasebesi — toplamı tam olarak 180 etsin diye seçildi.",
    en: "Three hours in total, that is 180 minutes: that figure is the limit All Might states to his successor. The split of those minutes across five items is not canon but this page's own accounting — chosen so that the total lands exactly on 180.",
  },
  keyboardHint: {
    tr: "Beş kalem de sekmeyle geziliyor; her kalem bir kez harcanabiliyor ve geri alınamıyor.",
    en: "All five items are reachable by tab; each can be spent once and cannot be undone.",
  },
  emptyTitle: { tr: "Süre bitti", en: "The time is up" },
  emptyText: {
    tr: "Bütçe tükendi. Sayfa gerçek formda kilitlendi: kontur inceldi, noktalar gitti, renk soğudu. Bu düğmeye basmadan önce vazgeçebilirdin — All Might vazgeçemedi.",
    en: "The budget is exhausted. The page is locked in the true form: the contour has thinned, the dots are gone, the colour has cooled. You could have stopped before pressing that button — All Might could not.",
  },
  statusPrefix: { tr: "Kalan süre", en: "Time remaining" },
  gaugeLabel: {
    tr: "Kalan süre göstergesi — ışın demeti",
    en: "The remaining-time gauge — a beam of speed lines",
  },
  closingNote: {
    tr: "Sayaç düştükçe sayfa kendiliğinden gerçek forma dönüyor: her kademede kontur inceliyor, ben-day noktaları soluyor, paneller daralıyor. Mekanik bunun için var — All Might'ın gücü azalmıyor, SÜRESİ azalıyor.",
    en: "As the counter falls the page turns into the true form by itself: at every notch the contour thins, the ben-day dots fade, the panels narrow. That is what the mechanic is for — All Might's power does not shrink, his TIME does.",
  },
} as const;

/* ── Beş durak ──────────────────────────────────────────────────────────── */

export interface AlmFate {
  key: string;
  /** Sayfanın saati — "günde ne kadar All Might" (gerekçe dosya başında) */
  clock: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: string; reading: LocalizedText; by: LocalizedText };
  imageKey: string;
}

export const ALM_TIMELINE: AlmFate[] = [
  {
    key: "nana",
    clock: { tr: "sınır yok", en: "no limit" },
    title: { tr: "Devir", en: "The handover" },
    text: {
      tr: "Toshinori Yagi Quirk'süz doğmadı — hiçbir Quirk'ü YOKTU ve One For All'ı ustası Nana Shimura'dan devraldı. Yani sayfanın en güçlü adamı, hikâyesine tam olarak halefiyle aynı yerden başlıyor: elinde hiçbir şey olmayan biri olarak. Bu, sonraki bütün seçimlerinin sebebi; Midoriya'ya inanabilmesinin sebebi de bu.",
      en: "Toshinori Yagi was not born with a weak Quirk — he had NONE, and inherited One For All from his master, Nana Shimura. So the strongest man on this page starts his story from exactly where his successor starts: as someone holding nothing. That is the reason for every later choice, and the reason he can believe in Midoriya.",
    },
    imageKey: ALM_IMAGE_KEYS.fateNana,
  },
  {
    key: "numberone",
    clock: { tr: "sınır yok", en: "no limit" },
    title: { tr: "Bir numara", en: "Number one" },
    text: {
      tr: "Sıralamanın tepesine çıkıyor ve orada bir kurum hâline geliyor. Bu dönemde yaptığı iş kavga etmek değil, kavgayı gereksiz kılmak: All Might ortalıkta olduğu sürece kimse denemiyor. Bir toplumun güvenliğini tek bir kişiye bağlaması burada iyi bir fikir gibi görünüyor — sonraki durak neden olmadığını gösteriyor.",
      en: "He rises to the top of the rankings and becomes an institution there. His work in this period is not fighting but making fighting unnecessary: as long as All Might is around, nobody tries. Pinning a society's safety to a single person looks like a good idea here — the next stop shows why it is not.",
    },
    imageKey: ALM_IMAGE_KEYS.fateNumberOne,
  },
  {
    key: "wound",
    clock: { tr: "sınır kondu", en: "a limit is set" },
    title: { tr: "Yara", en: "The wound" },
    text: {
      tr: "One For All'ı yaratan gücün sahibiyle karşılaşıyor ve o kavgadan sağ çıkıyor ama bedeni artık eskisi gibi değil: mide bölgesinin bir kısmını ve solunum sisteminin bir bölümünü kaybediyor, ameliyatlar bunu geri getirmiyor. Yarayı yıllarca herkesten saklıyor. Sayfanın bütün sayacı bu duraktan doğuyor — sınırsız bir adam sınırlı bir adama dönüşüyor ve kimseye söylemiyor.",
      en: "He meets the owner of the power that created One For All and survives that fight, but his body is not what it was: he loses part of his stomach and part of his respiratory system, and surgery does not bring them back. He hides the wound from everyone for years. This page's whole counter is born at this stop — a limitless man becomes a limited one and tells no one.",
    },
    imageKey: ALM_IMAGE_KEYS.fateWound,
  },
  {
    key: "successor",
    clock: { tr: "günde üç saat", en: "three hours a day" },
    title: { tr: "Halef", en: "The successor" },
    text: {
      tr: "Quirk'süz bir çocuk, hiç düşünmeden bir arkadaşını kurtarmaya koşuyor ve All Might o an bir halef bulduğunu anlıyor. Kumsalda gövdesini gösteriyor, günde ne kadar All Might kalabildiğini söylüyor ve gücü devrediyor. Sayfanın açtığı üç saatlik bütçe tam olarak bu konuşmadan geliyor.",
      en: "A Quirkless boy runs to save a friend without thinking, and in that instant All Might knows he has found a successor. On the beach he shows the boy his body, tells him how much of the day he can still be All Might, and hands the power on. The three-hour budget this page opens with comes precisely from that conversation.",
    },
    quote: {
      text: "君はヒーローになれる",
      reading: {
        tr: "«Sen bir kahraman olabilirsin.»",
        en: "“You can become a hero.”",
      },
      by: {
        tr: "All Might — Midoriya'ya, kumsalda",
        en: "All Might — to Midoriya, on the beach",
      },
    },
    imageKey: ALM_IMAGE_KEYS.fateSuccessor,
  },
  {
    key: "kamino",
    clock: { tr: "sıfır", en: "zero" },
    title: { tr: "Son yumruk ve emeklilik", en: "The last punch and the retirement" },
    text: {
      tr: "Kamino'da eski düşmanıyla son kez karşılaşıyor. Kavganın ortasında gövdesi canlı yayında küçülüyor ve elinde kalanı United States of Smash'e koyup bitiriyor. Kazanıyor — ve kazandığı anda All Might olmayı bırakıyor. Kameraya dönüp parmağıyla izleyenleri gösteriyor: sıra artık onlarda. Barışın sembolü bir kişi olmaktan çıkıp bir GÖREV hâline geliyor.",
      en: "At Kamino he meets his old enemy for the last time. Mid-fight his body shrinks on live television, and he ends it by pouring what is left into United States of Smash. He wins — and at the moment he wins he stops being All Might. He turns to the camera and points at the people watching: it is their turn now. The Symbol of Peace stops being a person and becomes a DUTY.",
    },
    quote: {
      text: "次は君だ",
      reading: {
        tr: "«Sıra sende.»",
        en: "“Now it's your turn.”",
      },
      by: {
        tr: "All Might — Kamino'dan sonra, kameraya",
        en: "All Might — after Kamino, to the camera",
      },
    },
    imageKey: ALM_IMAGE_KEYS.fateKamino,
  },
];

/* ── Devraldıklar ve karşısındakiler ────────────────────────────────────── */

/**
 * ⚠️ Buradaki beş kimliğin hepsi `EXPERIENCE_COMPANIONS[89224]` listesinde
 * (`lib/characters/experiences.ts`) KAYITLI — doğrulandı, 31 Ağustos 2026.
 * Liste: 89028 · 125956 · 88892 · 89225 · 89226. Bu eşleşme olmadan portre
 * kadrajları görsel yüklense bile sonsuza kadar boş kalırdı (Armin emsali,
 * Dalga 1 denetimi §4).
 *
 * `isExperienceCharacter` yalnızca Midoriya (89028) ve Bakugō (88892) için
 * `true` dönüyor; kalan üçüne bağ verilmiyor, yalnızca ad yazılıyor.
 */
export interface AlmBond {
  characterId: number;
  name: string;
  nativeName: string;
  role: LocalizedText;
  note: LocalizedText;
}

export const ALM_BONDS: AlmBond[] = [
  {
    characterId: 89028,
    name: "Izuku Midoriya",
    nativeName: "緑谷出久",
    role: { tr: "Halefi — dokuzuncu taşıyıcı", en: "His successor — the ninth holder" },
    note: {
      tr: "Quirk'süz doğdu ve All Might ona ilk karşılaşmalarında kahraman olamayacağını söyledi. Aynı gün fikrini değiştiren şey bir güç gösterisi değil, çocuğun düşünmeden koşması oldu. One For All'ın dokuzuncu halkası; bu sayfanın sayacı sıfıra indiğinde devam eden şey o.",
      en: "He was born Quirkless, and at their first meeting All Might told him he could not be a hero. What changed his mind the same day was not a display of power but the boy running without thinking. He is the ninth link of One For All; when this page's counter hits zero, he is what continues.",
    },
  },
  {
    characterId: 125956,
    name: "All For One",
    nativeName: "オール・フォー・ワン",
    role: { tr: "Karşısındaki", en: "His adversary" },
    note: {
      tr: "Quirk'leri alıp başkasına verebilen adam; One For All da onun gücünden doğdu. Bu sayfadaki yaranın sahibi o ve iki kez karşılaştılar: birincisinde All Might'ın süresini, ikincisinde kendi özgürlüğünü kaybetti. Sayacın var olma sebebi tek bir kişi.",
      en: "The man who can take Quirks and give them to others; One For All itself was born out of his power. He is the author of the wound on this page, and they met twice: the first time All Might lost his time, the second time he lost his freedom. The counter exists because of one person.",
    },
  },
  {
    characterId: 89226,
    name: "Tomura Shigaraki",
    nativeName: "死柄木弔",
    role: { tr: "Karşı tarafın halefi", en: "The successor on the other side" },
    note: {
      tr: "Bu sayfada güç devrediliyor — ama yalnızca iyi taraf devretmiyor. All Might One For All'ı bir öğrenciye bıraktı; karşı taraf da kendi mirasını bir başkasına bıraktı. İki devir aynı hikâyenin iki yarısı ve sayfanın sonunda ikisi de tamamlanmış oluyor.",
      en: "Power gets handed down on this page — but not only on the good side. All Might left One For All to a student; the other side left its own inheritance to someone as well. The two handovers are two halves of the same story, and by the end of this page both are complete.",
    },
  },
  {
    characterId: 88892,
    name: "Katsuki Bakugou",
    nativeName: "爆豪勝己",
    role: { tr: "Öğrencisi", en: "His student" },
    note: {
      tr: "İlk harcama kaleminde kurtardığı çocuk. Yıllar boyunca All Might'ı bir kez bile kaybetmemiş bir kahraman olarak gördü ve kaybettiğini gördüğü gün asıl sarsılan o oldu. Sınıf 1-A'da öğrettiği duruşun en sert sınavı.",
      en: "The boy he saves in the first item of the ledger. For years he saw All Might as a hero who had never once lost, and the day he saw him lose it was he who was shaken. The hardest test of the stance he teaches in Class 1-A.",
    },
  },
  {
    characterId: 89225,
    name: "Shouta Aizawa",
    nativeName: "相澤消太",
    role: { tr: "Meslektaşı", en: "His colleague" },
    note: {
      tr: "Yūei'de aynı sınıfın sorumlusu ve All Might'ın tam zıddı: gösterişten nefret eden, öğrencilerini korkutarak koruyan bir öğretmen. Sayfanın tezine dışarıdan bakan tek ses — bir sembolün kalabalığa iyi gelmesi, o sembolü taşıyana iyi geldiği anlamına gelmiyor.",
      en: "In charge of the same class at U.A. and All Might's exact opposite: a teacher who loathes spectacle and protects his students by frightening them. The one voice that looks at this page's thesis from outside — a symbol being good for the crowd does not mean it is good for whoever carries it.",
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const ALM_CLOSING = {
  quotes: [
    {
      text: "私が来た！",
      reading: {
        tr: "«Ben geldim!»",
        en: "“I am here!”",
      },
      by: { tr: "All Might", en: "All Might" },
      note: {
        tr: "Göründüğü hemen her sahnenin ilk cümlesi. Bir tehdit değil bir teminat: bu cümleyi duyan kişinin artık korkmasına gerek yok. Sayfanın altın formu tam olarak bu cümlenin görsel karşılığı.",
        en: "The first line of almost every scene he appears in. Not a threat but a guarantee: whoever hears it no longer needs to be afraid. This page's golden form is exactly that sentence made visible.",
      },
    },
    {
      text: "次は君だ",
      reading: {
        tr: "«Sıra sende.»",
        en: "“Now it's your turn.”",
      },
      by: { tr: "All Might", en: "All Might" },
      note: {
        tr: "Kamino'dan sonra, kameraya bakıp parmağıyla gösterirken. İlk cümlenin tam tersi gibi duruyor ama aynı işi yapıyor: birincisinde güvenliği o taşıyordu, ikincisinde taşımayı bırakıp devretti. Sayfanın sayacı sıfıra indiğinde geriye kalan cümle bu.",
        en: "After Kamino, looking into the camera and pointing. It reads as the opposite of the first line but does the same job: in the first he carried the safety, in the second he put it down and passed it on. When this page's counter hits zero, this is the sentence that is left.",
      },
    },
  ],
  motto: "プルス・ウルトラ",
  mottoNote: {
    tr: "Plus Ultra — «daha da öteye». Yūei'nin sloganı, ama All Might'ın ağzında bir okul marşı değil bir yöntem: sınırın bittiği yerde bir adım daha atmak. Bu sayfanın sayacı da tam olarak o adımın faturası — bütçeyi aştığın kalem yine de harcanıyor, çünkü o adamın sözlüğünde «yetmiyor» diye bir cevap yok.",
    en: "Plus Ultra — “further beyond”. It is U.A.'s motto, but in All Might's mouth it is not a school chant but a method: taking one more step where the limit ends. This page's counter is the bill for that step — an item that exceeds the budget still gets spent, because “not enough” is not an answer in that man's vocabulary.",
  },
  credit: {
    tr: "Künye, portre, doğum günü, boy, Quirk adı ve diğer adlar AniList'ten; portre dosyası depoya indirildi (hotlink yok). Sayfadaki bütün grafikler — konuşma balonu, ışın demeti, ben-day nokta deseni, sayaç göstergesi — elle çizilmiş SVG ya da CSS.",
    en: "Dossier, portrait, birthday, height, Quirk name and alternative names from AniList; the portrait file was downloaded into the repository (no hotlinking). Every graphic on this page — the speech balloon, the beam of speed lines, the ben-day dot pattern, the gauge — is hand-drawn SVG or CSS.",
  },
  creditLink: {
    tr: "AniList · Toshinori Yagi #89224",
    en: "AniList · Toshinori Yagi #89224",
  },
} as const;

/* ── Küratör boşluk özeti ───────────────────────────────────────────────── */

export const ALM_GAPS = {
  title: { tr: "Toshinori Yagi — görsel yuvaları", en: "Toshinori Yagi — image slots" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bütün yuvalar dolu. Sayfada eksik kadraj kalmadı.",
    en: "Every slot is filled. No frame on this page is missing.",
  },
} as const;
