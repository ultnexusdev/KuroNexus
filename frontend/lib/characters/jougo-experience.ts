import type { LocalizedText } from "./types";

/**
 * Jōgo (漏瑚) — AniList #156991, Jujutsu Kaisen.
 *
 * Sayfanın BÜTÜN metni burada. Bileşen tarafında görünen tek bir düz dize
 * yok (Faz 2 §1): her şey `LocalizedText` ve `pick(text, locale)` ile
 * çözülüyor, istemci adalarına yalnızca çözülmüş düz dize iniyor.
 *
 * ── KÜNYE KAYNAĞI ────────────────────────────────────────────────────────
 * `public/assets/anime/karakterler/jougo/kaynak.json` (AniList çekimi).
 * Oradan gelen doğrulanmış alanlar: ad "Jougo", yerel ad 漏瑚, diğer ad
 * "Jogo", derece "Special Grade Cursed Spirit", KAYITSIZ olduğu,
 * Mahito/Hanami/Dagon ile hizalandığı, volkanlardan ve ateşli doğal
 * afetlerden duyulan korkudan doğduğu, özel derece için bile aşırı lanet
 * enerjisi taşıdığı ve "gerçek insanlar lanetlerdir" görüşü.
 *
 * ⚠️ YAŞ, DOĞUM ve KAN GRUBU künyede `null` — ve bu sayfada boş satır
 * olarak DEĞİL, karakterizasyon olarak duruyor (`JOUGO_IDENTITY.facts`
 * içindeki "takvim" satırı): bir lanetli ruhun doğum günü yoktur, çünkü
 * doğmaz — korkudan çöker. Uydurma bir tarih ya da yaş yok.
 *
 * ── TIRNAK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Tırnak içine YALNIZCA belgeli orijinal diziler alındı: teknik çağrısı
 * 「領域展開」, alan adı 蓋棺鉄囲山, en büyük darbe 極ノ番「隕」 ve
 * Sukuna'nın unvanı 呪いの王. Jōgo'nun konuşma replikleri Japonca olarak
 * YAZILMADI — eldeki kaynakta birebir dizeleri doğrulanamıyor ve yanlış
 * bir tırnak, doğru bir cümleden daha kötüdür. Sahneler anlatı sesinde,
 * tırnaksız anlatılıyor; `JOUGO_CLOSING.quoteNote` bunu okura da söylüyor.
 */

export const JOUGO_ID = 156991;

/** Künyedeki resmî adres — `detail.character.siteUrl` boşsa buraya düşülür. */
export const JOUGO_SITE_URL = "https://anilist.co/character/156991";

/**
 * Depodaki resmî portre. 230×345 — KÜÇÜK: tam kanama bir hero olarak
 * kullanılamaz (Faz 2 §3), yalnızca künye şeridindeki dar bir çekirdek
 * kadrajında duruyor. Büyük hero karesi boş bir küratör yuvası.
 */
export const JOUGO_PORTRAIT = {
  src: "/assets/anime/karakterler/jougo/anilist-portrait.png",
  w: 230,
  h: 345,
} as const;

/**
 * ABILITY yuva anahtarları — önek `jgo:`.
 *
 * Sahne/teknik görseli ÜRETİLMİYOR (Faz 2 §3). Her kadraj boş duruyor,
 * hemen altında kendi yükleme yuvası var ve bölüm görselsiz de ayakta:
 * boş kadrajın içinde elle çizilmiş bir çatlak motifi kalıyor.
 *
 * ⚠️ Kül mekaniğinin okuma listesinde kadraj YOK ve bu bilinçli: kül
 * perdesi o panelin üstüne düşüyor, oraya bir yükleme yuvası koymak
 * küratörün kutusunu külün altında bırakırdı (görev şartı 6). Bölümün tek
 * kadrajı perdenin DIŞINDA, listenin altında duruyor (`kul`).
 */
export const JOUGO_IMAGE_KEYS = {
  hero: "jgo:hero",

  /* Lanet laboratuvarı — üç büyük */
  teknik: "jgo:teknik",
  alan: "jgo:alan",
  meteor: "jgo:meteor",

  /* Lanet laboratuvarı — dört küçük */
  enerji: "jgo:lanet-enerjisi",
  soz: "jgo:baglayici-soz",
  alet: "jgo:lanetli-alet",
  ters: "jgo:ters-teknik",

  /* Kül mekaniği — perdenin DIŞINDAKİ tek kadraj */
  kul: "jgo:kul",

  /* Kader çizelgesi — beş katman */
  katman1: "jgo:katman-1",
  katman2: "jgo:katman-2",
  katman3: "jgo:katman-3",
  katman4: "jgo:katman-4",
  katman5: "jgo:katman-5",

  closing: "jgo:kapanis",
} as const;

export type JougoImageKey =
  (typeof JOUGO_IMAGE_KEYS)[keyof typeof JOUGO_IMAGE_KEYS];

/** Yuvanın sayfadaki adı — `CuratorSlot` etiketi ve `CuratorGaps` satırı. */
export const JOUGO_SLOT_LABELS: Record<string, LocalizedText> = {
  [JOUGO_IMAGE_KEYS.hero]: {
    tr: "Hero — dikey portre",
    en: "Hero — vertical portrait",
  },
  [JOUGO_IMAGE_KEYS.teknik]: {
    tr: "Lanetli Teknik — ateş ve magma",
    en: "Cursed Technique — fire and magma",
  },
  [JOUGO_IMAGE_KEYS.alan]: {
    tr: "Alan Genişletme — 蓋棺鉄囲山",
    en: "Domain Expansion — 蓋棺鉄囲山",
  },
  [JOUGO_IMAGE_KEYS.meteor]: {
    tr: "極ノ番「隕」 — inen taş",
    en: "極ノ番「隕」 — the falling stone",
  },
  [JOUGO_IMAGE_KEYS.enerji]: {
    tr: "Lanet Enerjisi — hacim",
    en: "Cursed Energy — the volume",
  },
  [JOUGO_IMAGE_KEYS.soz]: {
    tr: "Bağlayıcı Söz — boş satır",
    en: "Binding Vow — the blank line",
  },
  [JOUGO_IMAGE_KEYS.alet]: {
    tr: "Lanetli Alet — taşımadığı şey",
    en: "Cursed Tool — what he does not carry",
  },
  [JOUGO_IMAGE_KEYS.ters]: {
    tr: "Ters Lanet Tekniği — kayıt yok",
    en: "Reverse Cursed Technique — no record",
  },
  [JOUGO_IMAGE_KEYS.kul]: {
    tr: "Kül — külün altında kalan sayfa",
    en: "Ash — the page beneath the ash",
  },
  [JOUGO_IMAGE_KEYS.katman1]: {
    tr: "Katman 1 — korkudan çöken şey",
    en: "Stratum 1 — what settles out of fear",
  },
  [JOUGO_IMAGE_KEYS.katman2]: {
    tr: "Katman 2 — cephe",
    en: "Stratum 2 — the front",
  },
  [JOUGO_IMAGE_KEYS.katman3]: {
    tr: "Katman 3 — efendi",
    en: "Stratum 3 — the master",
  },
  [JOUGO_IMAGE_KEYS.katman4]: {
    tr: "Katman 4 — duvar",
    en: "Stratum 4 — the wall",
  },
  [JOUGO_IMAGE_KEYS.katman5]: {
    tr: "Katman 5 — kül",
    en: "Stratum 5 — ash",
  },
  [JOUGO_IMAGE_KEYS.closing]: {
    tr: "Kapanış bandı",
    en: "Closing band",
  },
};

/** Beklenen kare: tip + ölçü + biçim. `CuratorGaps` bunu ikinci satıra yazıyor. */
export const JOUGO_SLOT_SPECS: Record<string, LocalizedText> = {
  [JOUGO_IMAGE_KEYS.hero]: {
    tr: "dikey kadraj · 1200×1600 · webp",
    en: "vertical frame · 1200×1600 · webp",
  },
  [JOUGO_IMAGE_KEYS.teknik]: {
    tr: "geniş kadraj · 1400×900 · webp",
    en: "wide frame · 1400×900 · webp",
  },
  [JOUGO_IMAGE_KEYS.alan]: {
    tr: "geniş kadraj · 1400×900 · webp",
    en: "wide frame · 1400×900 · webp",
  },
  [JOUGO_IMAGE_KEYS.meteor]: {
    tr: "geniş kadraj · 1400×900 · webp",
    en: "wide frame · 1400×900 · webp",
  },
  [JOUGO_IMAGE_KEYS.enerji]: {
    tr: "kare kadraj · 800×800 · webp",
    en: "square frame · 800×800 · webp",
  },
  [JOUGO_IMAGE_KEYS.soz]: {
    tr: "kare kadraj · 800×800 · webp",
    en: "square frame · 800×800 · webp",
  },
  [JOUGO_IMAGE_KEYS.alet]: {
    tr: "kare kadraj · 800×800 · webp",
    en: "square frame · 800×800 · webp",
  },
  [JOUGO_IMAGE_KEYS.ters]: {
    tr: "kare kadraj · 800×800 · webp",
    en: "square frame · 800×800 · webp",
  },
  [JOUGO_IMAGE_KEYS.kul]: {
    tr: "geniş kadraj · 1400×900 · webp",
    en: "wide frame · 1400×900 · webp",
  },
  [JOUGO_IMAGE_KEYS.katman1]: {
    tr: "yatay bant · 1400×620 · webp",
    en: "horizontal band · 1400×620 · webp",
  },
  [JOUGO_IMAGE_KEYS.katman2]: {
    tr: "yatay bant · 1400×620 · webp",
    en: "horizontal band · 1400×620 · webp",
  },
  [JOUGO_IMAGE_KEYS.katman3]: {
    tr: "yatay bant · 1400×620 · webp",
    en: "horizontal band · 1400×620 · webp",
  },
  [JOUGO_IMAGE_KEYS.katman4]: {
    tr: "yatay bant · 1400×620 · webp",
    en: "horizontal band · 1400×620 · webp",
  },
  [JOUGO_IMAGE_KEYS.katman5]: {
    tr: "yatay bant · 1400×620 · webp",
    en: "horizontal band · 1400×620 · webp",
  },
  [JOUGO_IMAGE_KEYS.closing]: {
    tr: "geniş bant · 1600×700 · webp",
    en: "wide band · 1600×700 · webp",
  },
};

/** `CuratorUpload` önerilen pikseli buradan okuyor. */
export const JOUGO_SLOT_SIZES: Record<string, { w: number; h: number }> = {
  [JOUGO_IMAGE_KEYS.hero]: { w: 1200, h: 1600 },
  [JOUGO_IMAGE_KEYS.teknik]: { w: 1400, h: 900 },
  [JOUGO_IMAGE_KEYS.alan]: { w: 1400, h: 900 },
  [JOUGO_IMAGE_KEYS.meteor]: { w: 1400, h: 900 },
  [JOUGO_IMAGE_KEYS.enerji]: { w: 800, h: 800 },
  [JOUGO_IMAGE_KEYS.soz]: { w: 800, h: 800 },
  [JOUGO_IMAGE_KEYS.alet]: { w: 800, h: 800 },
  [JOUGO_IMAGE_KEYS.ters]: { w: 800, h: 800 },
  [JOUGO_IMAGE_KEYS.kul]: { w: 1400, h: 900 },
  [JOUGO_IMAGE_KEYS.katman1]: { w: 1400, h: 620 },
  [JOUGO_IMAGE_KEYS.katman2]: { w: 1400, h: 620 },
  [JOUGO_IMAGE_KEYS.katman3]: { w: 1400, h: 620 },
  [JOUGO_IMAGE_KEYS.katman4]: { w: 1400, h: 620 },
  [JOUGO_IMAGE_KEYS.katman5]: { w: 1400, h: 620 },
  [JOUGO_IMAGE_KEYS.closing]: { w: 1600, h: 700 },
};

/** Portre yuvasının etiketi (PORTRAIT — ABILITY değil). */
export const JOUGO_PORTRAIT_SLOT: LocalizedText = {
  tr: "Portre — tam boy dikey kare",
  en: "Portrait — full-size vertical frame",
};

/** Sayfanın en altındaki düzenleyicisiz özet. */
export const JOUGO_GAPS = {
  title: { tr: "Boş kadrajlar", en: "Empty frames" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bütün kadrajlar dolu. Bu sayfada yüklenecek kare kalmadı.",
    en: "Every frame is filled. Nothing left to upload on this page.",
  },
} as const;

/** Breadcrumb'ın ikinci halkası. */
export const JOUGO_CRUMB = {
  series: { tr: "Jujutsu Kaisen", en: "Jujutsu Kaisen" },
} as const;

/** `alt` metinleri — kaynak bilgisi HER birinde yazılı (Faz 2 §3). */
export const JOUGO_ALT = {
  scenePrefix: {
    tr: "Jōgo — küratör yüklemesi:",
    en: "Jōgo — curator upload:",
  },
  portrait: {
    tr: "Jōgo (漏瑚) — AniList resmî portresi, depodaki kopya",
    en: "Jōgo (漏瑚) — official AniList portrait, repository copy",
  },
  portraitUploaded: {
    tr: "Jōgo (漏瑚) — küratörün yüklediği portre",
    en: "Jōgo (漏瑚) — portrait uploaded by the curator",
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════
   1 · HERO
   ══════════════════════════════════════════════════════════════════════ */

export const JOUGO_HERO = {
  house: { tr: "Jujutsu Kaisen · Lanetli Ruhlar", en: "Jujutsu Kaisen · Cursed Spirits" },
  lede: {
    tr: "Bu sayfa yukarıdan aşağı bir yer kesiti. Üstteki katman yüzey: soğumuş, okunabilir, sakin. Aşağı indikçe katmanlar koyulaşıyor ve ısınıyor; aralarındaki çatlaklardan magma görünüyor. En dipte bir tabut var ve adı yazılı.",
    en: "This page is a cross-section read from the top down. The first stratum is the surface: cooled, legible, calm. The deeper you go the darker and hotter the strata get, and magma shows through the cracks between them. At the very bottom there is a coffin, and it has a name.",
  },
  watermarkNote: {
    tr: "Filigrandaki işaret tek bir göz ve 漏瑚 — Jōgo'nun adı. İkisi de süs; taşıdıkları bilgi bu satırda yazıyla da duruyor.",
    en: "The watermark is a single eye and 漏瑚 — Jōgo's name. Both are decorative; the information they carry is also written out in this line.",
  },
  /**
   * ⚠️ Bu not ziyaretçiye görünüyor, o yüzden içinde ÜRETİM METADATASI
   * yok: piksel ölçüsü, dosya biçimi ya da "yüklenecek" ifadesi geçmiyor
   * (Dalga 1'in Levi dersi). Ölçü metni yalnızca küratör dalında.
   */
  heroCaption: {
    tr: "Bu büyük kadraj bilerek boş. Resmî portre bu ölçekte durmayacak kadar küçük; kesit burada bir boşlukla başlıyor.",
    en: "This large frame is intentionally empty. The official portrait is too small to stand at this scale; the section begins with a gap.",
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════
   2 · MOD DÜĞMESİ — "Erime noktası"
   ══════════════════════════════════════════════════════════════════════ */

export const JOUGO_MELT = {
  title: { tr: "Erime noktası", en: "Melting point" },
  native: "融点",
  toMolten: { tr: "Erime noktasını geç", en: "Cross the melting point" },
  toCool: { tr: "Kabuğu soğut", en: "Cool the crust" },
  hintCool: {
    tr: "Kabuk soğuk. Katmanlar duruyor, çatlaklar ince, kül açık düşüyor.",
    en: "The crust is cold. The strata hold, the cracks are thin, the ash falls pale.",
  },
  hintMolten: {
    tr: "Kabuk erime noktasının üstünde. Çatlaklar genişledi, obsidyen zemin kızardı, kül daha koyu düşüyor. Katmanlar aynı katmanlar — yalnızca sıcaklıkları değişti.",
    en: "The crust is past its melting point. The cracks have widened, the obsidian ground has reddened, the ash falls darker. The strata are the same strata — only their heat changed.",
  },
  markLabel: {
    tr: "Sıcaklık göstergesi: üç katmanlı kesit",
    en: "Heat gauge: a three-layer section",
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════
   BÖLÜM BAŞLIKLARI
   ══════════════════════════════════════════════════════════════════════ */

export const JOUGO_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "Record" },
    lede: {
      tr: "AniList künyesinden gelen doğrulanmış satırlar. Üç alan boş geliyor ve o boşluk burada bir eksiklik değil, bir tanım.",
      en: "Verified lines from the AniList record. Three fields come back empty, and here that emptiness is not a gap but a definition.",
    },
  },
  techniques: {
    title: { tr: "Lanet laboratuvarı", en: "Curse laboratory" },
    lede: {
      tr: "Üç büyük okuma: 術式, 領域展開 ve elindeki en büyük darbe. Terminoloji jujutsu'nun kendi terminolojisi.",
      en: "Three large readings: 術式, 領域展開 and the heaviest blow he owns. The terminology is jujutsu's own.",
    },
  },
  kit: {
    title: { tr: "Dört küçük ölçüm", en: "Four small measurements" },
    lede: {
      tr: "Dördünün ikisi bilerek boş. Bir arşivde kayıt yoksa satır uydurulmaz, boş bırakılır ve boşluğun kendisi yazılır.",
      en: "Two of the four are intentionally blank. When an archive has no record, the line is not invented — it is left empty, and the emptiness itself is written down.",
    },
  },
  ash: {
    title: { tr: "Kül", en: "Ash" },
    lede: {
      tr: "Sayfanın kalbi. Aşağıdaki katmanları açtıkça yukarıdan kül birikiyor ve okuduğun metnin üstünü kısmen kapatıyor. Üfleyip temizleyebilirsin — ama her temizlemeden sonra kül daha hızlı geri geliyor.",
      en: "The heart of the page. As you open the strata below, ash gathers from above and partly covers the text you are reading. You can blow it away — but after every clearing it comes back faster.",
    },
  },
  strata: {
    title: { tr: "Kader kesiti", en: "Fate section" },
    lede: {
      tr: "Beş katman, yukarıdan aşağı. Bir lanetli ruhun yaşı olmadığı için bu çizelgede yaş yok; onun yerine derinlik var.",
      en: "Five strata, from top to bottom. A cursed spirit has no age, so this chart has no ages — it has depth instead.",
    },
  },
  bonds: {
    title: { tr: "Aynı kesitte duranlar", en: "Standing in the same section" },
    lede: {
      tr: "Dördünün de kendi sayfası var; kartlar oraya açılıyor. Cephenin geri kalanı yalnızca adla anılıyor — arşivde kadrajları yok.",
      en: "All four have their own pages; the cards open onto them. The rest of the front is named in plain text — the archive has no frames for them.",
    },
  },
  nexus: {
    title: { tr: "Lanetli Arşiv'e açılan çatlaklar", en: "Cracks into the Cursed Archive" },
    lede: {
      tr: "Bu dört bağ Jujutsu Kaisen evren sayfasının bölümlerine iniyor.",
      en: "These four links descend into the sections of the Jujutsu Kaisen universe page.",
    },
  },
  closing: {
    title: { tr: "Tabutun kapağı", en: "The coffin lid" },
    lede: {
      tr: "Kesitin dibi. Burada yalnızca belgeli iki çağrı, alanın adı ve kaynak künyesi var.",
      en: "The bottom of the section. Only two documented invocations, the name of the domain, and the source credit.",
    },
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════
   3 · KÜNYE ŞERİDİ
   ══════════════════════════════════════════════════════════════════════ */

export const JOUGO_IDENTITY = {
  /**
   * Sayfa başlığında kullanılan yazım — uzun ünlü işaretli.
   *
   * ⚠️ `detail.character.name` DEĞİL: AniList kaydı "Jougo" yazıyor
   * (romanizasyon tercihi, ad ayrışması değil) ve `roster.ts` satırı
   * "Jōgo" kullanıyor. Başlıkla raf kartı aynı adı göstermek zorunda,
   * o yüzden `<h1>` bu sabiti okuyor; AniList'in kendi yazımı künye
   * şeridindeki "AniList adı" satırında duruyor.
   */
  display: "Jōgo",
  name: "Jougo",
  nativeName: "漏瑚",
  /** Derece — künyedeki "Special Grade Cursed Spirit" satırının Japoncası */
  title: "特級呪霊",
  titleReading: {
    tr: "Özel derece lanetli ruh — kayıt dışı",
    en: "Special grade cursed spirit — unregistered",
  },
  epigraph: {
    tr: "İnsanlar yeryüzünden korktu. Korku bir yerde birikti ve o birikinti gözünü açtı.",
    en: "People were afraid of the earth. The fear collected somewhere, and the collection opened an eye.",
  },
  facts: [
    {
      label: { tr: "Tür", en: "Kind" },
      value: {
        tr: "Lanetli ruh (呪霊) — insan değil, insanın artığı",
        en: "Cursed spirit (呪霊) — not a human, a human residue",
      },
    },
    {
      label: { tr: "Derece", en: "Grade" },
      value: {
        tr: "Özel derece (特級), kayıt dışı",
        en: "Special grade (特級), unregistered",
      },
    },
    {
      label: { tr: "Doğuş", en: "Origin" },
      value: {
        tr: "İnsanların yeryüzüne duyduğu korku: volkanlar ve ateşli doğal afetler",
        en: "Humanity's fear of the earth: volcanoes and fire-borne natural disasters",
      },
    },
    {
      label: { tr: "Takvim", en: "Calendar" },
      value: {
        tr: "Yok. Yaş, doğum günü, kan grubu — üçü de künyede boş, çünkü bir lanetli ruh doğmaz: korkudan çöker. Boş satırların doldurulacak bir karşılığı yok.",
        en: "None. Age, birthday, blood type — all three are blank in the record, because a cursed spirit is not born: it settles out of fear. The blank lines have nothing to fill them with.",
      },
    },
    {
      label: { tr: "Lanetli Teknik", en: "Cursed Technique" },
      value: {
        tr: "Ateş ve magma (術式)",
        en: "Fire and magma (術式)",
      },
    },
    {
      label: { tr: "Alan Genişletme", en: "Domain Expansion" },
      value: {
        tr: "蓋棺鉄囲山 — Demir Dağın Tabutu",
        en: "蓋棺鉄囲山 — Coffin of the Iron Mountain",
      },
    },
    {
      label: { tr: "Cephe", en: "Front" },
      value: {
        tr: "Mahito, Hanami ve Dagon ile hizalı; Getō'nun etrafında toplanan grubun içinde",
        en: "Aligned with Mahito, Hanami and Dagon; inside the group gathered around Getō",
      },
    },
    {
      label: { tr: "Amaç", en: "Aim" },
      value: {
        tr: "Lanetlerin hüküm sürdüğü bir yeryüzü. Ona göre gerçek insanlar lanetlerdir.",
        en: "An earth ruled by curses. In his view, curses are the true humans.",
      },
    },
    {
      label: { tr: "Sembolik obje", en: "Symbolic object" },
      value: {
        tr: "Başındaki koni — taşıdığı volkan. Kafası kraterdir; öfkelendiğinde tepesi tüter.",
        en: "The cone on his head — the volcano he carries. His head is the crater; when he is angry, the summit smokes.",
      },
    },
    {
      label: { tr: "AniList adı", en: "AniList name" },
      value: {
        tr: "Jougo (漏瑚) · diğer yazım: Jogo",
        en: "Jougo (漏瑚) · alternate spelling: Jogo",
      },
    },
    {
      label: { tr: "Göründüğü yapımlar", en: "Appears in" },
      value: {
        tr: "Jujutsu Kaisen ve Jujutsu Kaisen 2. Sezon — yardımcı rol (künyedeki beş kayıtta da aynı)",
        en: "Jujutsu Kaisen and Jujutsu Kaisen Season 2 — supporting role (identical across all five records)",
      },
    },
  ],
  portraitNote: {
    tr: "Yandaki kare AniList'in resmî portresi. Küçük bir kare ve bu sayfada bilerek küçük tutuldu — kesitten alınmış bir sondaj örneği kadar. Büyük kadraj yukarıda ve boş.",
    en: "The plate beside this is AniList's official portrait. It is a small plate, and it is kept deliberately small here — the size of a core sample taken out of the section. The large frame is above, and empty.",
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════
   4a · LANET LABORATUVARI — ÜÇ BÜYÜK
   ══════════════════════════════════════════════════════════════════════ */

export const JOUGO_TECHNIQUES = [
  {
    key: "teknik",
    native: "術式",
    reading: { tr: "Lanetli Teknik", en: "Cursed Technique" },
    title: { tr: "Ateş ve magma", en: "Fire and magma" },
    text: {
      tr: "Jōgo'nun tekniği ateşi ve erimiş kayayı doğrudan üretiyor. Bir aleti ya da bir aracı yok: ısı bedeninin içinden çıkıyor, bu yüzden gövdesi bir silahtan çok bir bacaya benziyor. Volkanın ne yaptığını yapıyor — basıncı biriktiriyor ve bir yerden boşaltıyor.",
      en: "Jōgo's technique produces fire and molten rock directly. There is no tool and no medium: the heat comes out of his own body, which makes his frame less a weapon than a flue. He does what a volcano does — he accumulates pressure and releases it somewhere.",
    },
    traits: [
      { tr: "Isı doğrudan bedenden", en: "Heat straight from the body" },
      { tr: "Erimiş kaya ve alev", en: "Molten rock and flame" },
      { tr: "Basınç birikip boşalıyor", en: "Pressure gathers, then vents" },
    ],
    imageKey: JOUGO_IMAGE_KEYS.teknik,
  },
  {
    key: "alan",
    native: "領域展開",
    reading: { tr: "Alan Genişletme · 蓋棺鉄囲山", en: "Domain Expansion · 蓋棺鉄囲山" },
    title: { tr: "Demir Dağın Tabutu", en: "Coffin of the Iron Mountain" },
    text: {
      tr: "Alan Genişletme jujutsu'nun en pahalı hamlesi: kullanıcı kendi iç dünyasını dışarı çeviriyor ve içeride tekniği kaçınılmaz hâle geliyor. Jōgo'nun açtığı dünya bir volkanın içi — kapanan bir tabut ve adı zaten kapağın üstünde yazılı.",
      en: "Domain Expansion is jujutsu's most expensive move: the caster turns his inner world outward, and inside it his technique becomes unavoidable. The world Jōgo opens is the inside of a volcano — a closing coffin, with its name already written on the lid.",
    },
    traits: [
      { tr: "İçeride teknik ıskalamıyor", en: "Inside, the technique does not miss" },
      { tr: "Kapalı bir volkan iç mekânı", en: "An enclosed volcanic interior" },
      { tr: "Adı bir tabut adı", en: "Its name is the name of a coffin" },
    ],
    imageKey: JOUGO_IMAGE_KEYS.alan,
  },
  {
    key: "meteor",
    native: "極ノ番「隕」",
    reading: { tr: "En büyük darbe", en: "The maximum blow" },
    title: { tr: "İnen taş", en: "The falling stone" },
    text: {
      tr: "Elindeki en ağır şey. Bir alevden ya da bir akıntıdan değil, gökten inen bir kütleden söz ediyoruz: Jōgo bunu Shibuya'da, karşısındaki duvara — Gojō'ya — indirdi. Sayfanın en dibindeki katmanı açan darbe bu.",
      en: "The heaviest thing he owns. Not a flame and not a flow but a mass coming down out of the sky: Jōgo brought it down in Shibuya, onto the wall in front of him — onto Gojō. This is the blow that opens the deepest stratum of this page.",
    },
    traits: [
      { tr: "Gökten inen kütle", en: "A mass descending from the sky" },
      { tr: "Shibuya'da kullanıldı", en: "Used in Shibuya" },
      { tr: "Karşısındaki duvarı yıkmadı", en: "It did not bring the wall down" },
    ],
    imageKey: JOUGO_IMAGE_KEYS.meteor,
  },
] as const;

/* ══════════════════════════════════════════════════════════════════════
   4b · LANET LABORATUVARI — DÖRT KÜÇÜK
   ══════════════════════════════════════════════════════════════════════ */

export const JOUGO_KIT = [
  {
    key: "enerji",
    native: "呪力",
    reading: { tr: "Lanet Enerjisi", en: "Cursed Energy" },
    note: {
      tr: "Künyenin kendi cümlesi: özel derece için bile aşırı hacimde lanet enerjisi. Jōgo'nun sorunu hiçbir zaman yakıt olmadı.",
      en: "The record's own sentence: massive cursed energy even for a special grade. Fuel was never Jōgo's problem.",
    },
    imageKey: JOUGO_IMAGE_KEYS.enerji,
  },
  {
    key: "soz",
    native: "束縛",
    reading: { tr: "Bağlayıcı Söz", en: "Binding Vow" },
    note: {
      tr: "Jujutsu'nun pazarlığı: bir şeyden vazgeçip karşılığında güç almak. Jōgo'ya ait kayıtlı bir söz arşivde yok — bu satır bilerek boş.",
      en: "Jujutsu's bargain: give something up, take power in return. The archive holds no recorded vow of Jōgo's — this line is deliberately blank.",
    },
    imageKey: JOUGO_IMAGE_KEYS.soz,
  },
  {
    key: "alet",
    native: "呪具",
    reading: { tr: "Lanetli Alet", en: "Cursed Tool" },
    note: {
      tr: "Taşımıyor. Bir kılıcı, bir çekici, bir zinciri yok; ısıyı üreten şey bedeninin kendisi olduğu için alet taşımak ona bir şey katmıyor.",
      en: "He carries none. No blade, no hammer, no chain; since the thing producing the heat is his own body, carrying a tool would add nothing.",
    },
    imageKey: JOUGO_IMAGE_KEYS.alet,
  },
  {
    key: "ters",
    native: "反転術式",
    reading: { tr: "Ters Lanet Tekniği", en: "Reverse Cursed Technique" },
    note: {
      tr: "Lanet enerjisini iyileştirmeye çeviren ters işlem. Jōgo'nun bunu kullandığına dair bir kayıt arşivde yok; satır uydurulmadı, boş bırakıldı.",
      en: "The inverted operation that turns cursed energy into healing. The archive has no record of Jōgo using it; the line was not invented, it was left empty.",
    },
    imageKey: JOUGO_IMAGE_KEYS.ters,
  },
] as const;

/* ══════════════════════════════════════════════════════════════════════
   5 · KÜL — SAYFANIN KALBİ
   ══════════════════════════════════════════════════════════════════════ */

/**
 * Altı okuma. Her açılış külü `hız` kadar artırıyor; "üfle" külü sıfırlıyor
 * ama hızı bir kademe yükseltiyor. Dördüncü temizleme mümkün değil ve
 * `JOUGO_ASH.sealed` metni orada açılıyor.
 *
 * ⚠️ Bu listede kadraj YOK — gerekçe `JOUGO_IMAGE_KEYS` başlığında.
 */
export const JOUGO_ASH_READINGS = [
  {
    key: "dogus",
    native: "火",
    title: { tr: "Korkudan çöken şey", en: "What settles out of fear" },
    text: {
      tr: "Lanetli ruhlar insanların ürettiği olumsuzluktan biçim alıyor. Jōgo'nunki tek bir kişinin korkusu değil: bir dağın altında yaşamanın, yerin bir gün açılacağını bilmenin ortak korkusu. Yani onu yapan şey bir kötülük değil, bir coğrafya.",
      en: "Cursed spirits take shape out of the negativity people produce. Jōgo's is not one person's fear: it is the shared fear of living under a mountain, of knowing the ground will open one day. What made him is not a wickedness but a geography.",
    },
  },
  {
    key: "cephe",
    native: "呪霊",
    title: { tr: "Cephe", en: "The front" },
    text: {
      tr: "Yalnız çalışmıyor. Hanami, Dagon ve Mahito ile aynı masada oturuyor; masa Getō'nun etrafında kuruluyor. Dördü de aynı şeyi istiyor: insanların çekildiği, lanetlerin kaldığı bir yeryüzü. Jōgo bu masanın en sabırsızı.",
      en: "He does not work alone. He sits at the same table as Hanami, Dagon and Mahito; the table is set around Getō. All four want the same thing: an earth the humans have withdrawn from and the curses have kept. Jōgo is the least patient one at that table.",
    },
  },
  {
    key: "efendi",
    native: "呪いの王",
    title: { tr: "Efendi", en: "The master" },
    text: {
      tr: "Sukuna'ya hayranlık duyuyor ve onu cepheye çağırıyor: lanetlerin kralı yanlarında olursa iş biter diye düşünüyor. Sukuna onu yanına almıyor — eziyor. Jōgo bu muameleden sonra bile hayranlığından vazgeçmiyor; sayfanın en acıtan yeri burası.",
      en: "He admires Sukuna and calls him to the front: with the king of curses beside them, he thinks, the work is done. Sukuna does not take him in — he crushes him. Even after that treatment Jōgo does not give up the admiration; this is the place on the page that hurts.",
    },
  },
  {
    key: "duvar",
    native: "六眼",
    title: { tr: "Duvar", en: "The wall" },
    text: {
      tr: "Planın önünde tek bir isim duruyor: Gojō Satoru. Cephe bütün hazırlığını o ismin etrafında yapıyor, Jōgo da karşısına en büyük darbesiyle çıkıyor. Duvar yıkılmıyor. Jōgo'nun kaybettiği ilk şey savaş değil, ölçü duygusu.",
      en: "One name stands in front of the plan: Satoru Gojō. The front builds its whole preparation around that name, and Jōgo goes at him with his heaviest blow. The wall does not come down. The first thing Jōgo loses is not the fight — it is his sense of scale.",
    },
  },
  {
    key: "shibuya",
    native: "渋谷",
    title: { tr: "Shibuya", en: "Shibuya" },
    text: {
      tr: "Cephe kalabalığın ortasında bir perde kuruyor ve şehri kapatıyor. Jōgo için bu, uğruna beklediği gün: yeryüzünün insanlardan geri alınacağı akşam. Aynı akşam onun da sonu olacak, ama bunu henüz bilmiyor.",
      en: "The front raises a veil in the middle of the crowd and closes the city off. For Jōgo this is the day he waited for: the evening the earth would be taken back from the humans. The same evening will end him too, but he does not know that yet.",
    },
  },
  {
    key: "meteor",
    native: "極ノ番「隕」",
    title: { tr: "En büyük taş", en: "The heaviest stone" },
    text: {
      tr: "Elinde ne varsa çıkarıyor: gökten bir kütle indiriyor. Bu, bir lanetli ruhun verebileceği en ağır cevap ve Jōgo'nun bütün hikâyesi o kütlenin inişinde toplanıyor. İndikten sonra geriye kalan şeyin adı bu bölümün adı.",
      en: "He brings out everything he has: he drops a mass out of the sky. It is the heaviest answer a cursed spirit can give, and Jōgo's whole story gathers into that descent. What is left after it lands is the thing this section is named after.",
    },
  },
] as const;

export const JOUGO_ASH = {
  /* Düğmeler ve göstergeler */
  openLabel: { tr: "Bir katman daha aç", en: "Open one more stratum" },
  openDoneLabel: { tr: "Bütün katmanlar açık", en: "Every stratum is open" },
  blowLabel: { tr: "Üfle", en: "Blow it off" },
  blowNothingLabel: { tr: "Üflenecek kül yok", en: "No ash to blow" },
  blowDeadLabel: { tr: "Üfleyemiyorsun", en: "You cannot blow" },
  counterLabel: { tr: "Açılan katman", en: "Strata opened" },
  rateLabel: { tr: "Birikme hızı", en: "Settling rate" },
  depthLabel: { tr: "Kül yoğunluğu", en: "Ash density" },

  /* Durum satırı — `aria-live="polite"` ile duyuruluyor */
  lead: {
    tr: "Kül henüz yok. Aşağıdaki katmanlardan birini aç.",
    en: "There is no ash yet. Open one of the strata below.",
  },
  statusOpened: { tr: "Katman açıldı:", en: "Stratum opened:" },
  statusAsh: { tr: "Kül birikti. Yoğunluk", en: "Ash has gathered. Density" },
  statusBlown: {
    tr: "Külü üfledin. Sayfa temiz — ama birikme hızı bir kademe arttı.",
    en: "You blew the ash away. The page is clear — but the settling rate went up a step.",
  },
  statusBackAtOnce: {
    tr: "Külü üfledin ve kül aynı anda geri çöktü. Bütün katmanlar açık; artık üflemek onu geciktirmiyor.",
    en: "You blew the ash away and it settled back at once. Every stratum is open; blowing no longer delays it.",
  },
  statusNothing: {
    tr: "Ortada üflenecek kül yok.",
    en: "There is no ash to blow away.",
  },
  statusSealed: {
    tr: "Kül gitmedi. Bu dördüncüsüydü ve dördüncüsü kalkmıyor.",
    en: "The ash did not move. That was the fourth, and the fourth does not lift.",
  },
  statusFull: {
    tr: "Bütün katmanlar açık.",
    en: "Every stratum is open.",
  },

  /* Düğme açıklamaları — `aria-describedby` ile bağlanıyor */
  blowHint: {
    tr: "Üflemek külü tamamen kaldırıyor ama her seferinde birikme hızını artırıyor. Üç kez işe yarıyor.",
    en: "Blowing removes the ash entirely, but each time it raises the settling rate. It works three times.",
  },
  blowDeadHint: {
    tr: "Dördüncü üfleme çalışmıyor: kül artık üflenmeyecek kadar hızlı geri geliyor. Düğme yerinde duruyor ve odaklanabiliyor, ama bir şey yapmıyor.",
    en: "The fourth blow does not work: the ash now returns faster than it can be blown away. The button stays in place and remains focusable, but it does nothing.",
  },
  keyboardHint: {
    tr: "İki düğme de klavyeyle geziliyor. Kül yalnızca görsel bir örtü: ekran okuyucu metnin tamamını her zaman okuyor, ve hareketi kapalı bir tarayıcıda kül hiç birikmiyor.",
    en: "Both buttons are keyboard reachable. The ash is a visual layer only: a screen reader always reads the full text, and in a browser with motion turned off no ash gathers at all.",
  },

  /* Dördüncü aşamada açılan yenilgi metni */
  sealed: {
    kicker: { tr: "Dördüncü kül", en: "The fourth ash" },
    title: { tr: "Kalkmayan katman", en: "The stratum that does not lift" },
    body: [
      {
        tr: "Shibuya'da Jōgo elindeki her şeyi çıkardı ve hiçbiri yetmedi. Sonunda karşısına aldığı şey Gojō değildi: hayran olduğu efendinin kendisiydi. Sukuna onu bitirdi.",
        en: "In Shibuya, Jōgo brought out everything he had and none of it was enough. In the end the thing across from him was not Gojō: it was the master he admired. Sukuna finished him.",
      },
      {
        tr: "Son anında sorduğu şey güç değildi. Yeryüzünü lanetlere bırakmak isteyen, insanları küçümseyen, bir dağın öfkesinden çökmüş olan şeyin son sorusu şuydu: arkadaş mıydılar. Bu sayfanın anlattığı kaybediş savaşın kaybedilmesi değil — sorunun bu kadar geç sorulması.",
        en: "What he asked at the end was not about power. The thing that wanted the earth left to curses, that looked down on humans, that had settled out of a mountain's anger, asked one last question: were they friends. The loss this page is about is not the losing of a fight — it is how late that question came.",
      },
      {
        tr: "Kül bunun için geri geliyor. Kaldırdığın her seferinde daha hızlı çöküyor, çünkü Jōgo'nun hikâyesinde de her temizlik bir sonrakini yaklaştırdı. Dördüncüde artık kaldıracak bir şey kalmıyor.",
        en: "That is why the ash returns. Each time you lift it, it settles faster, because in Jōgo's story too every clearing brought the next one closer. By the fourth there is nothing left to lift.",
      },
    ],
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════
   6 · KADER KESİTİ — BEŞ KATMAN
   ══════════════════════════════════════════════════════════════════════ */

export const JOUGO_STRATA = [
  {
    key: "katman-1",
    native: "火",
    depth: { tr: "Katman 1 · yüzey", en: "Stratum 1 · surface" },
    title: { tr: "Korku birikiyor", en: "Fear accumulates" },
    text: {
      tr: "Jōgo insanların yeryüzünden, volkanlardan ve ateşli afetlerden duyduğu korkudan biçim alıyor. Özel derece için bile aşırı bir lanet enerjisiyle geliyor ve daha ilk günden akıllı: ne olduğunu ve ne istediğini biliyor.",
      en: "Jōgo takes shape out of humanity's fear of the earth, of volcanoes, of fire-borne disasters. He arrives with cursed energy excessive even for a special grade, and he is intelligent from the first day: he knows what he is and what he wants.",
    },
    line: null,
    imageKey: JOUGO_IMAGE_KEYS.katman1,
  },
  {
    key: "katman-2",
    native: "呪霊",
    depth: { tr: "Katman 2 · kabuk", en: "Stratum 2 · crust" },
    title: { tr: "Cephe kuruluyor", en: "A front is formed" },
    text: {
      tr: "Mahito, Hanami ve Dagon ile hizalanıyor; grup Getō'nun etrafında toplanıyor. Jōgo'nun bu masadaki rolü sabırsızlık: planı bekleyen değil, planı öne çeken taraf o.",
      en: "He aligns with Mahito, Hanami and Dagon; the group gathers around Getō. Jōgo's role at that table is impatience: he is not the one waiting for the plan, he is the one pulling it forward.",
    },
    line: null,
    imageKey: JOUGO_IMAGE_KEYS.katman2,
  },
  {
    key: "katman-3",
    native: "呪いの王",
    depth: { tr: "Katman 3 · derin kabuk", en: "Stratum 3 · deep crust" },
    title: { tr: "Efendiye gidiyor", en: "He goes to the master" },
    text: {
      tr: "Lanetlerin kralını cepheye katmak istiyor. Sukuna'ya ulaşmak için önce onun kabını buluyor — Yūji Itadori'yi. Karşılaştıklarında Sukuna ona ortak muamelesi yapmıyor: eziyor ve gönderiyor.",
      en: "He wants the king of curses on the front. To reach Sukuna he first finds his vessel — Yūji Itadori. When they meet, Sukuna does not treat him as a partner: he crushes him and sends him off.",
    },
    line: "呪いの王",
    imageKey: JOUGO_IMAGE_KEYS.katman3,
  },
  {
    key: "katman-4",
    native: "六眼",
    depth: { tr: "Katman 4 · manto", en: "Stratum 4 · mantle" },
    title: { tr: "Duvara çarpıyor", en: "He hits the wall" },
    text: {
      tr: "Gojō Satoru'nun karşısına çıkıyor ve elindeki en ağır şeyi kullanıyor: alanını açıyor, sonra gökten bir kütle indiriyor. İkisi de yetmiyor. Jōgo'nun aritmetiği burada kırılıyor — güç sıralaması onun sandığı gibi değil.",
      en: "He steps in front of Satoru Gojō and uses the heaviest thing he owns: he opens his domain, then brings a mass down from the sky. Neither is enough. Jōgo's arithmetic breaks here — the ranking of power is not what he thought it was.",
    },
    line: "領域展開",
    imageKey: JOUGO_IMAGE_KEYS.katman4,
  },
  {
    key: "katman-5",
    native: "灰",
    depth: { tr: "Katman 5 · magma odası", en: "Stratum 5 · magma chamber" },
    title: { tr: "Kül kalıyor", en: "Ash remains" },
    text: {
      tr: "Shibuya'da her şey aynı akşama sığıyor. Jōgo'yu bitiren şey insanlar ya da Gojō değil, hayran olduğu efendi oluyor. Son anında sorduğu soru bir güç sorusu değil, bir arkadaşlık sorusu — ve bu sayfanın kesiti orada bitiyor.",
      en: "In Shibuya everything fits into one evening. What ends Jōgo is neither the humans nor Gojō but the master he admired. The question he asks at the end is not a question about power but about friendship — and this page's section ends there.",
    },
    line: null,
    imageKey: JOUGO_IMAGE_KEYS.katman5,
  },
] as const;

/** Çizelgenin altındaki tırnak disiplini notu. */
export const JOUGO_STRATA_NOTE: LocalizedText = {
  tr: "Çizelgedeki iki orijinal dize belgeli: 呪いの王 Sukuna'nın unvanı, 領域展開 alan açılırken söylenen çağrı. Jōgo'nun konuşma replikleri Japonca yazılmadı — birebir dizeleri doğrulanamadığı için sahneler anlatı sesinde duruyor.",
  en: "The two original strings in this chart are documented: 呪いの王 is Sukuna's title, 領域展開 the invocation spoken as a domain opens. Jōgo's spoken lines are not written in Japanese — their exact wording could not be verified, so the scenes are told in narrative voice.",
};

/* ══════════════════════════════════════════════════════════════════════
   7a · AYNI KESİTTE DURANLAR
   ══════════════════════════════════════════════════════════════════════ */

/**
 * ⚠️ Yalnızca `EXPERIENCE_COMPANIONS[156991]` listesindeki dört kimlik
 * portre kadrajı açıyor (merkezde yazılı liste: 133701, 133702, 127691,
 * 127212). Listede olmayan biri için kadraj açmak, o kadrajı sonsuza kadar
 * boş bırakmak demek (Armin↔Levi emsali) — o yüzden Getō, Hanami ve Dagon
 * aşağıda `JOUGO_PLAIN_NAMES` içinde, kadrajsız ve düz adla duruyor.
 */
export const JOUGO_BONDS = [
  {
    key: "sukuna",
    characterId: 133701,
    name: "Ryōmen Sukuna",
    native: "両面宿儺",
    role: { tr: "Efendi saydığı", en: "The one he called master" },
    text: {
      tr: "Cepheye katmak istediği kral. Jōgo ona hayranlıkla yaklaşıyor, Sukuna onu eziyor; buna rağmen hayranlık bitmiyor. Shibuya'daki sonu da onun elinden geliyor.",
      en: "The king he wanted on the front. Jōgo approaches him with admiration and Sukuna crushes him; the admiration survives it anyway. His end in Shibuya comes from that same hand.",
    },
  },
  {
    key: "gojo",
    characterId: 127691,
    name: "Satoru Gojō",
    native: "五条悟",
    role: { tr: "Duvar", en: "The wall" },
    text: {
      tr: "Planın önündeki tek isim. Jōgo en ağır darbesini ona indiriyor ve duvar yıkılmıyor; sayfadaki ölçü duygusu ilk burada kırılıyor.",
      en: "The single name in front of the plan. Jōgo lands his heaviest blow on him and the wall does not fall; this is where the page's sense of scale first breaks.",
    },
  },
  {
    key: "mahito",
    characterId: 133702,
    name: "Mahito",
    native: "真人",
    role: { tr: "Ortak", en: "The partner" },
    text: {
      tr: "Aynı masanın diğer ucundaki lanetli ruh. İkisi aynı amacı paylaşıyor ama Mahito oyunla, Jōgo öfkeyle çalışıyor — ve Jōgo'nun cepheye yakınlık kurduğu tek yer bu masa.",
      en: "The cursed spirit at the other end of the same table. They share an aim, but Mahito works through play and Jōgo through anger — and that table is the only place Jōgo builds any closeness.",
    },
  },
  {
    key: "yuuji",
    characterId: 127212,
    name: "Yūji Itadori",
    native: "虎杖悠仁",
    role: { tr: "Efendinin kabı", en: "The master's vessel" },
    text: {
      tr: "Sukuna'ya giden yol. Jōgo krala ulaşmak için önce kabı buluyor; onun için Yūji bir insan değil, bir kapı.",
      en: "The road to Sukuna. To reach the king, Jōgo first finds the vessel; to him Yūji is not a person but a door.",
    },
  },
] as const;

/** Kadrajı olmayan, yalnızca adla anılan cephe. */
export const JOUGO_PLAIN_NAMES = {
  title: { tr: "Kadrajsız anılanlar", en: "Named without a frame" },
  note: {
    tr: "Bu üç ad arşivde bu sayfanın açabileceği bir portre kadrajına bağlı değil; o yüzden burada yalnızca adla duruyorlar.",
    en: "These three names are not tied to any portrait frame this page can open in the archive, so they stand here as names only.",
  },
  rows: [
    {
      key: "getou",
      name: "Suguru Getō",
      native: "夏油傑",
      text: {
        tr: "Grubun etrafında toplandığı isim. Kendi sayfası yayında, ama bu sayfanın portre listesinde yok — bu yüzden kadraj açılmadı.",
        en: "The name the group gathers around. His own page is live, but he is not on this page's portrait list — so no frame was opened.",
      },
    },
    {
      key: "hanami",
      name: "Hanami",
      native: "花御",
      text: {
        tr: "Cephenin ormanı. Künyedeki hizalanma satırında Jōgo ile birlikte anılıyor.",
        en: "The forest of the front. The record's alignment line names him alongside Jōgo.",
      },
    },
    {
      key: "dagon",
      name: "Dagon",
      native: "ダゴン",
      text: {
        tr: "Cephenin suyu. Künyedeki aynı satırda, aynı hizada.",
        en: "The water of the front. On the same line of the record, in the same alignment.",
      },
    },
  ],
} as const;

/* ══════════════════════════════════════════════════════════════════════
   7b · LANETLİ ARŞİV'E AÇILAN ÇATLAKLAR
   ══════════════════════════════════════════════════════════════════════ */

export const JOUGO_NEXUS = [
  {
    key: "spirits",
    anchor: "spirits",
    title: { tr: "Lanetli Ruhlar", en: "Cursed Spirits" },
    text: {
      tr: "Jōgo'nun ait olduğu tür: korkunun biçim alması ve derecelendirilmesi.",
      en: "The kind Jōgo belongs to: fear taking shape, and being graded.",
    },
  },
  {
    key: "domain",
    anchor: "domain",
    title: { tr: "Alan Genişletme", en: "Domain Expansion" },
    text: {
      tr: "蓋棺鉄囲山'ın bağlı olduğu kural: iç dünyanın dışarı çevrilmesi.",
      en: "The rule 蓋棺鉄囲山 obeys: an inner world turned outward.",
    },
  },
  {
    key: "grades",
    anchor: "grades",
    title: { tr: "Dereceler", en: "Grades" },
    text: {
      tr: "Özel derecenin ne demek olduğu — ve Jōgo'nun neden kayıt dışı kaldığı.",
      en: "What special grade means — and why Jōgo stayed off the register.",
    },
  },
  {
    key: "shibuya",
    anchor: "shibuya",
    title: { tr: "Shibuya", en: "Shibuya" },
    text: {
      tr: "Cephenin perdeyi indirdiği akşam; Jōgo'nun son katmanı orada.",
      en: "The evening the front drew the veil; Jōgo's final stratum is there.",
    },
  },
] as const;

/* ══════════════════════════════════════════════════════════════════════
   7c · KAPANIŞ
   ══════════════════════════════════════════════════════════════════════ */

export const JOUGO_CLOSING = {
  quotes: [
    {
      text: "領域展開",
      reading: { tr: "Alan Genişletme", en: "Domain Expansion" },
      note: {
        tr: "Alan açılırken söylenen çağrı. Jōgo bunu Gojō'nun karşısında kullanıyor; ardından gelen ad 蓋棺鉄囲山.",
        en: "The invocation spoken as a domain opens. Jōgo uses it facing Gojō; the name that follows is 蓋棺鉄囲山.",
      },
      by: { tr: "Jujutsu'nun ortak çağrısı", en: "Jujutsu's shared invocation" },
    },
    {
      text: "極ノ番「隕」",
      reading: { tr: "En büyük darbe — inen taş", en: "The maximum blow — the falling stone" },
      note: {
        tr: "Elindeki en ağır şeyin adı. Shibuya'da kullanıldı ve karşısındaki duvarı yıkmadı.",
        en: "The name of the heaviest thing he owns. Used in Shibuya, and it did not bring the wall down.",
      },
      by: { tr: "Jōgo'nun en büyük darbesi", en: "Jōgo's maximum blow" },
    },
  ],
  quoteNote: {
    tr: "Bu sayfada tırnak içine yalnızca belgeli orijinal diziler alındı. Jōgo'nun konuşma replikleri Japonca olarak yazılmadı: elimizdeki kaynakta birebir dizeleri doğrulanamıyor ve yanlış bir tırnak, doğru bir cümleden daha kötüdür.",
    en: "Only documented original strings are quoted on this page. Jōgo's spoken lines are not written in Japanese: our source cannot verify their exact wording, and a wrong quotation is worse than a correct sentence.",
  },
  motto: "蓋棺鉄囲山",
  mottoNote: {
    tr: "Demir Dağın Tabutu — Jōgo'nun Alan Genişletmesi ve bu sayfanın en dip katmanı. Bir volkanın içi, kapağı kapanan bir tabut olarak adlandırılmış.",
    en: "Coffin of the Iron Mountain — Jōgo's Domain Expansion and the deepest stratum of this page. The inside of a volcano, named as a coffin with the lid coming down.",
  },
  credit: {
    tr: "Künye ve portre: AniList karakter kaydı #156991 (Jougo · 漏瑚). Sayfadaki diğer bütün görseller küratör yüklemesi ya da elle çizilmiş SVG; dışarıdan görsel bağlanmıyor.",
    en: "Record and portrait: AniList character entry #156991 (Jougo · 漏瑚). Every other image on this page is a curator upload or a hand-drawn SVG; nothing is hotlinked.",
  },
  creditLink: { tr: "AniList #156991", en: "AniList #156991" },
  creditNote: {
    tr: "Anlatı metinleri arşivin kendi yazısı; kanon iddiası yalnızca künyede ve Jujutsu Kaisen'in kendi terminolojisinde doğrulanabilen satırlarla sınırlı tutuldu.",
    en: "The narrative text is the archive's own writing; canon claims were kept to lines verifiable from the record and from Jujutsu Kaisen's own terminology.",
  },
} as const;
