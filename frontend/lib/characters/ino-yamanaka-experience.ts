import type { LocalizedText } from "./types";

/**
 * Ino Yamanaka — "Zihinden Zihne" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 2009 kaydının ABILITY yuvaları,
 * `ino:*` anahtarlarıyla. Görsel bağlı değilse bölüm görselsiz ama AYAKTA
 * çizilir; hiçbir bölüm yükleme bekleyerek çökmez.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (23 Eylül), boy (149,3 cm / 162,2 cm), kan grubu (B), yaş
 * aralıkları (12–13 / 16–19) ve baba satırı AniList künyesinden birebir
 * alındı (24 Ağustos 2026'da önbelleğe alınan `anilist-detay-22.json`,
 * karakter 2009). Kilo AniList kaydında YOK, bu yüzden künye şeridinde de
 * yok. Rütbe satırı AniList'te olmadığı için yalnızca kesin bilinen iki
 * kademeyle sınırlı tutuldu (genin → chūnin); sonrası "istihbarat" olarak
 * yazıldı, uydurma bir rütbe konmadı.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada tırnak içinde YALNIZCA iki söz var ve ikisi de replik değil, AD:
 * Ino'nun Sakura'ya, Sakura'nın Ino'ya taktığı adlar. İkisi de seriyi
 * baştan sona kat ediyor ve doğrulanabiliyor. Sahnelerin geri kalanı —
 * kurdele, kesilen saç, karargâhın susması — arşivin kendi anlatımı olarak
 * DÜZ METİN yazıldı; emin olunmayan hiçbir cümle tırnağa alınmadı.
 *
 * ── HANAKOTOBA NOTU ──────────────────────────────────────────────────────
 * Çiçeklerin anlamları geleneksel Japon çiçek dilinden (hanakotoba).
 * Çiçek–kişi EŞLEŞTİRMELERİ arşivin okuması; bölümün girişinde bu açıkça
 * yazıyor, sayfa onları kaynağa mal etmiyor.
 */

export const INO_ID = 2009;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const INO_SITE_URL = "https://anilist.co/character/2009";

/**
 * Sergi görselleri — hepsi characterId 2009 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `ino:` önekli (kurator modu şartı).
 */
export const INO_IMAGE_KEYS = {
  /** Hero: geniş kadraj, çiçek tarlası ya da dükkân vitrini (16:9) */
  hero: "ino:hero",
  shintenshin: "ino:shintenshin",
  shinranshin: "ino:shinranshin",
  kokoroTensou: "ino:kokoro-tensou",
  sensor: "ino:sensor",
  kumite: "ino:kumite",
  ikebana: "ino:ikebana",
  trio: "ino:trio",
  webSakura: "ino:web-sakura",
  webTeam: "ino:web-team",
  webEnemy: "ino:web-enemy",
  webRelay: "ino:web-relay",
  webFather: "ino:web-father",
  webArmy: "ino:web-army",
  fateRibbon: "ino:fate-ribbon",
  fateChunin: "ino:fate-chunin",
  fateAsuma: "ino:fate-asuma",
  fateWar: "ino:fate-war",
  fateInoichi: "ino:fate-inoichi",
  closing: "ino:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const INO_SLOT_LABELS: Record<string, LocalizedText> = {
  [INO_IMAGE_KEYS.hero]: {
    tr: "Hero — geniş kadraj, çiçek tarlası ya da dükkân vitrini (16:9)",
    en: "Hero — wide frame, flower field or shop window (16:9)",
  },
  [INO_IMAGE_KEYS.shintenshin]: {
    tr: "Shintenshin no Jutsu — mühür anı, beden geriye düşerken",
    en: "Shintenshin no Jutsu — the seal, as the body falls back",
  },
  [INO_IMAGE_KEYS.shinranshin]: {
    tr: "Shinranshin no Jutsu — iradesi alınmış beden",
    en: "Shinranshin no Jutsu — a body with its will taken",
  },
  [INO_IMAGE_KEYS.kokoroTensou]: {
    tr: "Kokoro Tensou no Jutsu — parmaklar şakakta, gözler kapalı",
    en: "Kokoro Tensou no Jutsu — fingers at the temple, eyes shut",
  },
  [INO_IMAGE_KEYS.sensor]: {
    tr: "Duyu algısı — uzaktaki çakrayı okuma duruşu",
    en: "Sensory perception — reading chakra at distance",
  },
  [INO_IMAGE_KEYS.kumite]: {
    tr: "Shinranshin: Kumite — ele geçirilmiş bedenin dövüşü",
    en: "Shinranshin: Kumite — a seized body fighting",
  },
  [INO_IMAGE_KEYS.ikebana]: {
    tr: "Yamanaka Çiçekçisi — tezgâh, kova, makas",
    en: "Yamanaka Flower Shop — counter, bucket, shears",
  },
  [INO_IMAGE_KEYS.trio]: {
    tr: "Ino-Shika-Chō — üçlü formasyon",
    en: "Ino-Shika-Chō — the trio formation",
  },
  [INO_IMAGE_KEYS.webSakura]: {
    tr: "Ağ · Sakura — Chūnin sınavı, kesilen saç",
    en: "Web · Sakura — the Chūnin exam, the cut hair",
  },
  [INO_IMAGE_KEYS.webTeam]: {
    tr: "Ağ · 10. Takım — üçlünün duruşu",
    en: "Web · Team 10 — the trio in formation",
  },
  [INO_IMAGE_KEYS.webEnemy]: {
    tr: "Ağ · Düşman zihni — sorgu odası",
    en: "Web · An enemy mind — the interrogation room",
  },
  [INO_IMAGE_KEYS.webRelay]: {
    tr: "Ağ · Komuta hattı — karargâh ve cephe",
    en: "Web · The command line — headquarters and front",
  },
  [INO_IMAGE_KEYS.webFather]: {
    tr: "Ağ · Inoichi — son iletim",
    en: "Web · Inoichi — the last transmission",
  },
  [INO_IMAGE_KEYS.webArmy]: {
    tr: "Ağ · İttifak — cephenin tamamı",
    en: "Web · The alliance — the whole front",
  },
  [INO_IMAGE_KEYS.fateRibbon]: {
    tr: "Çizelge — kırmızı kurdele",
    en: "Timeline — the red ribbon",
  },
  [INO_IMAGE_KEYS.fateChunin]: {
    tr: "Çizelge — ön eleme arenası",
    en: "Timeline — the preliminary arena",
  },
  [INO_IMAGE_KEYS.fateAsuma]: {
    tr: "Çizelge — Asuma'nın son sahnesi",
    en: "Timeline — Asuma's last scene",
  },
  [INO_IMAGE_KEYS.fateWar]: {
    tr: "Çizelge — savaş cephesi, ittifak",
    en: "Timeline — the war front, the alliance",
  },
  [INO_IMAGE_KEYS.fateInoichi]: {
    tr: "Çizelge — vurulan karargâh",
    en: "Timeline — the shattered headquarters",
  },
  [INO_IMAGE_KEYS.closing]: {
    tr: "Kapanış — dağılmış bir buket ya da boş tezgâh",
    en: "Closing — a scattered bouquet or an empty counter",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const INO_IDENTITY = {
  name: "Ino Yamanaka",
  nativeName: "山中いの",
  /** Hero filigranı — dekoratif (aria-hidden) */
  watermark: "山中",
  clan: { tr: "Yamanaka Klanı", en: "Yamanaka Clan" },
  epigraph: {
    tr: "Bir çiçekçinin kızı. Savaşın ortasında seksen bin kişinin aynı anda duyduğu tek ses.",
    en: "A florist's daughter. In the middle of a war, the single voice eighty thousand people heard at once.",
  },
  lede: {
    tr: "On iki yaşındaki en büyük derdi saçının uzunluğuydu. Dört yıl sonra aynı kız bir ordunun her bir üyesinin kafasına girip aynı cümleyi bıraktı. Bu sayfa aradaki mesafeyi bir bağlantı olarak okuyor: tek zihinden bir takıma, bir takımdan bir cepheye.",
    en: "At twelve her largest problem was the length of her hair. Four years later the same girl reached into every mind in an army and left the same sentence there. This page reads the distance between those two facts as a single connection: one mind, then a team, then a front.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "23 Eylül", en: "23 September" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: {
        tr: "149,3 cm (I) · 162,2 cm (II)",
        en: "149.3 cm (I) · 162.2 cm (II)",
      },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "B", en: "B" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "12–13 (I) · 16–19 (II)", en: "12–13 (I) · 16–19 (II)" },
    },
    {
      label: { tr: "Rütbe", en: "Rank" },
      value: {
        tr: "Genin (I) → Chūnin (II) → istihbarat (sonrası)",
        en: "Genin (I) → Chūnin (II) → intelligence (after)",
      },
    },
    {
      label: { tr: "Takım", en: "Team" },
      value: {
        tr: "10. Takım — Asuma, Shikamaru, Chōji",
        en: "Team 10 — Asuma, Shikamaru, Chōji",
      },
    },
    {
      label: { tr: "Aile", en: "Family" },
      value: {
        tr: "Inoichi Yamanaka — baba",
        en: "Inoichi Yamanaka — father",
      },
    },
    {
      label: { tr: "Dükkân", en: "The shop" },
      value: {
        tr: "Yamanaka Çiçekçisi",
        en: "Yamanaka Flower Shop",
      },
    },
    {
      label: { tr: "Verdiği tek şey", en: "The one thing she gave away" },
      value: {
        tr: "Kırmızı bir kurdele",
        en: "A red ribbon",
      },
    },
  ],
} as const;

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

export const INO_SWITCH_TEXT = {
  enter: { tr: "Shintenshin", en: "Mind Body Switch" },
  exit: { tr: "Kendi zihnine dön", en: "Return to your own mind" },
  hint: {
    tr: "Sayfa bir başkasının zihninden okunuyor: renkler kayıyor, başlıklar bir an ters dönüyor, kenarda mor bir çerçeve var.",
    en: "The page is being read from somebody else's mind: the colours drift, the headings turn over for a moment, a violet frame closes on the edges.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const INO_HERO = {
  portraitAlt: {
    tr: "Ino Yamanaka — arşive yüklenmiş kadro portresi",
    en: "Ino Yamanaka — cast portrait uploaded to the archive",
  },
  portraitAltFallback: {
    tr: "Ino Yamanaka — AniList künye portresi",
    en: "Ino Yamanaka — AniList profile portrait",
  },
} as const;

/**
 * Görsel alt metinleri — BRIEF §3.5: her alt iki dilli ve KAYNAĞINI söyler.
 * Yoldaş portrelerinin tamamı kendi veritabanımızdan geliyor (PORTRAIT
 * yuvası), bu yüzden tek bir son ek yetiyor.
 */
export const INO_ALT = {
  companionSuffix: {
    tr: "— arşive yüklenmiş kadro portresi",
    en: "— cast portrait uploaded to the archive",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const INO_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "Naruto Universe" },
} as const;

export const INO_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "The record" },
    lede: {
      tr: "İki boy, iki yaş aralığı, tek bir dükkân adresi. Bu satırların hepsi AniList künyesinden geliyor; eksik olanlar bilerek boş bırakıldı.",
      en: "Two heights, two age ranges, one shop address. Every line here comes from the AniList record; what the record does not carry was left out on purpose.",
    },
  },
  lab: {
    title: { tr: "Klanın üç ayarı", en: "Three settings of one clan" },
    lede: {
      tr: "Yamanaka tekniği tek bir fikrin üç ayarı: zihni ele geçir, iradeyi al, düşünceyi taşı. Yanlarındaki küçük şemalar üçünün farkını çizerek anlatıyor — dolu daire bilinç, ince iplik bağ.",
      en: "The Yamanaka technique is one idea at three settings: take the mind, take the will, carry the thought. The small diagrams beside them draw the difference — a filled circle is a consciousness, a thin thread is a link.",
    },
  },
  bench: {
    title: { tr: "Tezgâhın altındakiler", en: "Under the counter" },
    lede: {
      tr: "Üç büyük teknik tek başına bir şinobi etmiyor. Ino'yu ayakta tutan dört küçük şey.",
      en: "Three great techniques do not make a shinobi. Four smaller things keep her standing.",
    },
  },
  web: {
    title: { tr: "Zihin ağı", en: "The mind network" },
    lede: {
      tr: "Ino'nun ömrü boyunca kurduğu bağlar tek tek burada. Bir düğüme bas: çizgi merkezden dışarı akar, bağ kurulur ve kurulu kalır. Ağ büyüdükçe dıştaki halka — ittifakın kendisi — aydınlanır.",
      en: "Every link she made across her life sits here, one by one. Press a node: the line flows outward from the centre, the link takes, and it stays. As the web grows the outer ring — the alliance itself — lights up.",
    },
  },
  flowers: {
    title: { tr: "Çiçek dili", en: "The language of flowers" },
    lede: {
      tr: "Hanakotoba: Japon çiçek dilinde her çiçeğin sözlükte yazılı bir anlamı var ve Yamanaka'lar o sözlüğü meslek olarak biliyor. Aşağıdaki anlamlar geleneksel sözlükten; çiçek–kişi eşleştirmeleri arşivin kendi okuması.",
      en: "Hanakotoba: in the Japanese language of flowers every bloom carries a written meaning, and the Yamanaka know that dictionary professionally. The meanings below are traditional; pairing each flower with a person is this archive's own reading.",
    },
  },
  fate: {
    title: { tr: "Ömür çizelgesi", en: "A life in five entries" },
    lede: {
      tr: "Beş kayıt. Biri kurdele, biri bir tutam saç, üçü cenaze.",
      en: "Five entries. One is a ribbon, one is a lock of hair, three are funerals.",
    },
  },
} as const;

/* ── Klanın üç ayarı — üç büyük teknik ──────────────────────────────────── */

/**
 * `diagram`: `InoGlyphs`teki zihin şemasının anahtarı. Şemalar üçünün
 * FARKINI çiziyor, süs değil — bu yüzden teknik adıyla aynı yerde duruyor.
 */
export const INO_JUTSU = [
  {
    key: "shintenshin" as const,
    imageKey: INO_IMAGE_KEYS.shintenshin,
    diagram: "switch" as const,
    kanji: "心転身の術",
    name: "Shintenshin no Jutsu",
    turkish: { tr: "Zihin Beden Değişimi", en: "Mind Body Switch" },
    tagline: {
      tr: "Ruhunu bedeninden çıkarıp hedefin bedenine yollar. Yollarken kendi bedenini yere bırakır.",
      en: "It sends her spirit out of her own body and into the target's. On the way out, her body drops where she stood.",
    },
    text: {
      tr: "Klanın imzası ve klanın kumarı. Teknik düz bir çizgide gider, dönemeç almaz: hedef bir adım kenara çekilirse ruh boşluğa uçar ve geri dönene kadar Ino'nun bedeni yerde savunmasız kalır — bu yüzden Ino hiçbir zaman yalnız çalışmaz, birileri o bedenin başında bekler. Ele geçirilen bedenin gördüğünü Ino görür, duyduğunu duyar; çıkarken de hepsini yanında getirir. Bu tekniğin asıl bedeli oradadır: geri dönen kişi, gitmeden önceki kişiden biraz farklıdır.",
      en: "The clan's signature and the clan's gamble. It travels in a straight line and does not turn: if the target steps aside the spirit flies into empty air, and until it returns her body lies defenceless where it fell — which is why she never works alone; somebody always stands over that body. Whatever the seized body sees she sees, whatever it hears she hears, and on the way out she carries all of it back with her. That is the real price: the person who returns is not quite the person who left.",
    },
    traits: [
      { tr: "Düz çizgi, dönemeç yok", en: "A straight line, no turns" },
      { tr: "Kendi bedeni savunmasız", en: "Her own body left open" },
      { tr: "Gördüğünü geri getirir", en: "Brings back what it saw" },
    ],
  },
  {
    key: "shinranshin" as const,
    imageKey: INO_IMAGE_KEYS.shinranshin,
    diagram: "puppet" as const,
    kanji: "心乱身の術",
    name: "Shinranshin no Jutsu",
    turkish: { tr: "Zihin Beden Karıştırma", en: "Mind Body Disturbance" },
    tagline: {
      tr: "Bedeni değil sinir sistemini ele geçirir. Hedef kendi kafasının içinde kalır; iradeyi Ino verir.",
      en: "It seizes the nervous system, not the body. The target stays inside their own head; the will comes from Ino.",
    },
    text: {
      tr: "Shintenshin'in açığını kapatan ayar: Ino kendi bedeninden çıkmaz, yani savunmasız da kalmaz. Karşı taraf yerinde durur, bilinci sonuna kadar açıktır ve kolunun kime doğru kalktığını gördüğü hâlde durduramaz. Klanın en rahatsız edici tekniği budur — acı vermiyor, sakat bırakmıyor, yalnızca iradeyi geri alıyor. Kalabalık bir alanda tek bir düşmanı kendi safının ortasına dönderdiğinde kazanılan şey bir vuruş değil, bir güvensizliktir.",
      en: "The setting that closes the gap in Shintenshin: she never leaves her own body, so she is never left open. The target stands where they stood, fully conscious, watching their own arm rise toward an ally they cannot warn. It is the clan's most uncomfortable technique — no pain, no wound, only the will taken back. Turning one enemy against their own line does not buy a hit; it buys distrust.",
    },
    traits: [
      { tr: "Ino bedeninde kalır", en: "She stays in her body" },
      { tr: "Bilinç açık, irade yok", en: "Conscious, but without will" },
      { tr: "Safları birbirine kırdırır", en: "Turns a line against itself" },
    ],
  },
  {
    key: "kokoroTensou" as const,
    imageKey: INO_IMAGE_KEYS.kokoroTensou,
    diagram: "broadcast" as const,
    kanji: "心転送の術",
    name: "Kokoro Tensou no Jutsu",
    turkish: { tr: "Zihin İletimi", en: "Mind Transmission" },
    tagline: {
      tr: "Tek bir zihne değil, bir ağa. Savaşın telsizi bir kızın kafasının içinde.",
      en: "Not one mind but a network. A war's radio set, running inside a girl's head.",
    },
    text: {
      tr: "Ele geçirme yok, taşıma var: Ino bir cümleyi istediği kadar zihne bırakır ve dönen cevabı toplar. Bir savaşın komuta zinciri bu teknikle tek bir Yamanaka'nın kafasından geçer — emir de oradan geçer, kayıp haberi de. Menzil ve kişi sayısı büyüdükçe yük dağılmaz, tek bir yerde birikir: ağı kuran, ağın taşıdığı her şeyi tek başına duyar. Sayfanın kalbindeki bölüm bu tekniğin kaç kademeden geçtiğini anlatıyor.",
      en: "No seizing, only carrying: she leaves a sentence in as many minds as she chooses and gathers the answers coming back. A war's chain of command runs through one Yamanaka's head — the orders travel that way, and so do the casualty reports. As range and headcount grow the load does not spread out; it collects in one place. Whoever builds the network hears everything the network carries, alone. The section at the heart of this page walks through the stages of exactly that.",
    },
    traits: [
      { tr: "Çok hedefli", en: "Many targets at once" },
      { tr: "Ele geçirmez, taşır", en: "Carries, never seizes" },
      { tr: "Yükü tek kişi duyar", en: "One person hears the load" },
    ],
  },
] as const;

/* ── Tezgâhın altındakiler — dört küçük ─────────────────────────────────── */

export const INO_BENCH = [
  {
    key: "sensor" as const,
    imageKey: INO_IMAGE_KEYS.sensor,
    glyph: "sensor" as const,
    name: { tr: "Duyu algısı", en: "Sensory perception" },
    note: {
      tr: "Uzaktaki çakrayı okur ve hangi imzanın kime ait olduğunu ayırır. Savaşta duyu biriminin işi görmekten önce saymaktır: kaç kişi, ne kadar uzakta, hangisi tanıdık.",
      en: "She reads chakra at distance and tells one signature from another. In a war the sensor's job comes before seeing — it is counting: how many, how far, which of them is familiar.",
    },
  },
  {
    key: "kumite" as const,
    imageKey: INO_IMAGE_KEYS.kumite,
    glyph: "kumite" as const,
    name: {
      tr: "Shinranshin no Jutsu: Kumite",
      en: "Shinranshin no Jutsu: Kumite",
    },
    note: {
      tr: "Karıştırma tekniğinin dövüş ayarı. Ele geçirilen bedene yalnızca hareket verilmiyor: dövüşme biçimi de veriliyor, yani hedef kendi safına Ino'nun bildiği kadar iyi vuruyor.",
      en: "The sparring setting of the disturbance technique. The seized body is not only moved, it is taught how to fight — so the target strikes their own side as well as Ino knows how.",
    },
  },
  {
    key: "ikebana" as const,
    imageKey: INO_IMAGE_KEYS.ikebana,
    glyph: "shears" as const,
    name: { tr: "Çiçek düzenleme", en: "Flower arrangement" },
    note: {
      tr: "Yamanaka Çiçekçisi'nin tezgâhı. Hangi çiçeğin ne anlama geldiğini, hangisinin yarayı kapattığını, hangisinin zehir olduğunu bilmek bu ailede süs değil meslek dalı — tıbbi çakrasının temeli de orada.",
      en: "The counter of the Yamanaka flower shop. Knowing what each bloom means, which one closes a wound and which one is poison, is a trade in this family rather than a decoration — and it is where her medical chakra begins.",
    },
  },
  {
    key: "trio" as const,
    imageKey: INO_IMAGE_KEYS.trio,
    glyph: "trio" as const,
    name: { tr: "Ino-Shika-Chō", en: "Ino-Shika-Chō" },
    note: {
      tr: "Babalarından kalan üçlü: zihin, gölge, ağırlık. Ino'nun payı ilk temas — kimin nerede durduğunu ve ne düşündüğünü söyleyen o. Gölge ondan sonra uzuyor, ağırlık en sona kalıyor.",
      en: "The trio their fathers ran: mind, shadow, weight. Ino's share is first contact — she says who stands where and what they intend. The shadow stretches after that; the weight comes last.",
    },
  },
] as const;

/* ── Zihin ağı — sayfanın kalbi ─────────────────────────────────────────── */

export const INO_WEB_UI = {
  groupLabel: { tr: "Zihin ağının düğümleri", en: "Nodes of the mind network" },
  counterLabel: { tr: "Kurulan bağ", en: "Links made" },
  reset: { tr: "Bağları çöz", en: "Release the links" },
  linkedBadge: { tr: "Bağlı", en: "Linked" },
  eyesLabel: { tr: "Kimin gözünden", en: "Through whose eyes" },
  learnedLabel: { tr: "Ne öğrendi", en: "What she learned" },
  idleTitle: { tr: "Ağ boş", en: "The network is empty" },
  idleText: {
    tr: "Merkezdeki çiçek Ino. Bir düğüme bastığında çizgi merkezden dışarı akar ve o zihinle kurulan bağ burada anlatılır. Bağlar birikir: kurduğun hiçbiri kendiliğinden çözülmez.",
    en: "The bloom at the centre is Ino. Press a node and the line flows outward from it; the link with that mind is described here. Links accumulate — none of them come undone on their own.",
  },
  hint: {
    tr: "Ok tuşlarıyla düğümler arasında gez, boşluk ya da Enter ile bağı kur veya çöz.",
    en: "Move between the nodes with the arrow keys; space or Enter makes or releases a link.",
  },
  ringNote: {
    tr: "Dıştaki halka ittifakın kendisi: her yeni bağ onun bir bölümünü aydınlatıyor.",
    en: "The outer ring is the alliance: every new link lights another part of it.",
  },
  complete: {
    tr: "Ağ tamamlandı. Dıştaki halkanın tamamı yanıyor — seksen bin kişi, tek bir hat, tek bir kişinin kafasında.",
    en: "The network is complete. The whole outer ring is lit — eighty thousand people, one channel, inside one person's head.",
  },
  webAlt: {
    tr: "Zihin ağı şeması: merkezde Ino'nun çiçeği, çevresinde altı düğüm ve onları birbirine bağlayan ince hatlar.",
    en: "Mind network diagram: Ino's bloom at the centre, six nodes around it and the thin lines that join them.",
  },
  /** Ekran okuyucuya bağ durumunu bildiren canlı satır. */
  linkedAnnounce: {
    tr: "bağ kuruldu",
    en: "link made",
  },
  releasedAnnounce: {
    tr: "bağ çözüldü",
    en: "link released",
  },
} as const;

/**
 * Ağın altı düğümü — sıra ANLATININ sırası, geometrinin değil.
 *
 * Şemadaki konumlar `InoGlyphs.tsx`teki `INO_WEB_GEOMETRY` kaydında ve bu
 * dizinin sırasıyla birebir aynı yayı çiziyor (soldan sağa bir taç, altta
 * ittifak düğümü). Böylece ok tuşuyla gezinme hem uzamsal hem anlatısal
 * olarak ileri gidiyor: tek zihin → takım → düşman → hat → baba → ordu.
 */
export interface InoWebNode {
  key: string;
  imageKey: string;
  kanji: string;
  /**
   * Düğümün altındaki kısa ad. Özel adlarda iki dil de aynı dizeyi taşır
   * (jutsu/klan/kişi adları çevrilmez); yalnızca "Düşman", "Komuta hattı"
   * gibi tanım satırları gerçekten çevriliyor.
   */
  who: LocalizedText;
  title: LocalizedText;
  eyes: LocalizedText;
  body: LocalizedText;
  learned: LocalizedText;
  /** İttifak düğümü: daha büyük çiziliyor ve halkayı tamamlıyor */
  finale?: boolean;
}

export const INO_WEB_NODES: InoWebNode[] = [
  {
    key: "sakura",
    imageKey: INO_IMAGE_KEYS.webSakura,
    kanji: "桜",
    who: { tr: "Sakura Haruno", en: "Sakura Haruno" },
    title: {
      tr: "Girdiğim ilk zihin beni kovdu",
      en: "The first mind I entered threw me out",
    },
    eyes: {
      tr: "Sakura Haruno'nun gözünden — Chūnin sınavı, ön eleme",
      en: "Through Sakura Haruno's eyes — Chūnin exam, preliminaries",
    },
    body: {
      tr: "Ino kunaiyle kestiği saçını yere serdi, o tutamdan Shintenshin'in ıskalamayacağı bir hat kurdu ve Sakura'nın bedenine girdi. İçeride beklediği boş oda yoktu: Sakura'nın yıllardır kendi kendine konuşan iç sesi bu sefer bir irade hâline gelmişti ve Ino'yu dışarı itti.",
      en: "She cut her hair with a kunai, laid the lock on the ground, built from it a line Shintenshin could not miss, and stepped into Sakura's body. The empty room she expected was not there: the inner voice Sakura had been talking to for years had become a will of its own, and it pushed her out.",
    },
    learned: {
      tr: "Bir zihni ele geçirmek onu tanımak değil. Ino o gün, kendi eliyle cesaret verdiği kızın artık kendi ayakları üstünde durduğunu içeriden gördü — ve bunu görebilen dünyada tek kişiydi.",
      en: "Seizing a mind is not knowing it. That day she saw from the inside that the girl she had once handed courage to was standing on her own — and she was the only person alive who could see it from there.",
    },
  },
  {
    key: "team",
    imageKey: INO_IMAGE_KEYS.webTeam,
    kanji: "十班",
    who: { tr: "Shikamaru · Chōji", en: "Shikamaru · Chōji" },
    title: {
      tr: "Jutsu gerektirmeyen bağ",
      en: "The link that needs no jutsu",
    },
    eyes: {
      tr: "Kimsenin gözünden — 10. Takım'ın formasyonu",
      en: "Through nobody's eyes — the formation of Team 10",
    },
    body: {
      tr: "Ino-Shika-Chō'nun üç parçası çocukluktan beri aynı sırada oturuyor. Ino'nun bu ikisinin kafasına girmesi gerekmiyor: gölge nereye uzayacaksa oraya bakıyor, ağırlık ne zaman inecekse o an kenara çekiliyor. Formasyonun hızı buradan geliyor — üçü arasında hiç emir konuşulmuyor.",
      en: "The three parts of Ino-Shika-Chō have shared a bench since childhood. She does not need to enter these two heads: she looks where the shadow is about to stretch and steps aside the moment the weight is about to fall. That is where the formation's speed comes from — no order is ever spoken between them.",
    },
    learned: {
      tr: "En sağlam bağ teknikle kurulan değil, tekrar ede ede aşınmış olan. Ino bunu ancak kaybettikten sonra, ikisiyle bir cenazede yan yana dururken anladı.",
      en: "The sturdiest link is not the one a technique makes but the one repetition wears smooth. She understood that only after a loss, standing beside the two of them at a funeral.",
    },
  },
  {
    key: "enemy",
    imageKey: INO_IMAGE_KEYS.webEnemy,
    kanji: "敵",
    who: { tr: "Düşman", en: "The enemy" },
    title: {
      tr: "Düşmanın zihni — ve bedeli",
      en: "An enemy's mind — and its price",
    },
    eyes: {
      tr: "Bir tutsağın gözünden — klanın sorgu odası",
      en: "Through a prisoner's eyes — the clan's interrogation room",
    },
    body: {
      tr: "Yamanaka'ların köydeki asıl işi cephe değil sorgu odası: bir tutsağın kafasındaki bilgiyi almak. Ama teknik iki yönlü çalışır — girdiğin zihnin gördüğü her şeyi sen de görürsün, ve o zihin sen içerideyken sönerse bedelini sen ödersin. Klanın kayıtlarında en çok tekrarlanan cümle bu uyarıdır.",
      en: "The Yamanaka's real work in the village is not the front but the interrogation room: taking what a prisoner's head is holding. The technique runs both ways, though — you see everything that mind sees, and if it goes out while you are inside it, you pay. That warning is the most repeated sentence in the clan's records.",
    },
    learned: {
      tr: "Bir zihne girmek onu okumak değil, onunla aynı odaya kapanmaktır. Ino'nun babasından devraldığı iş tam olarak bu odanın anahtarıdır.",
      en: "To enter a mind is not to read it but to be shut in a room with it. The work she inherited from her father is, precisely, the key to that room.",
    },
  },
  {
    key: "relay",
    imageKey: INO_IMAGE_KEYS.webRelay,
    kanji: "心転送",
    who: { tr: "Komuta hattı", en: "The command line" },
    title: {
      tr: "Bir hat olmak",
      en: "Becoming a line",
    },
    eyes: {
      tr: "Herkesin gözünden aynı anda — karargâh ve cephe",
      en: "Through everyone's eyes at once — headquarters and front",
    },
    body: {
      tr: "Kokoro Tensou'nun ilk gerçek işi bir avuç insanı birbirine bağlamaktı: karargâhtaki emir cepheye, cephedeki durum karargâha bu hattan gitti. Ino artık bir zihne girmiyordu, hattın kendisiydi — ve bir hattın kesilmeyi göze alma lüksü yoktur.",
      en: "The first real task of Kokoro Tensou was joining a handful of people: the order from headquarters to the front, the situation at the front back to headquarters, all along this line. She was no longer entering a mind; she was the line — and a line cannot afford to be cut.",
    },
    learned: {
      tr: "Bağlantı kurmak taraf tutmaktır. Hattı kuran kişi, o hattan geçen her cümlenin sorumluluğunu da alır.",
      en: "To connect is to take a side. Whoever builds the line also carries every sentence that runs along it.",
    },
  },
  {
    key: "father",
    imageKey: INO_IMAGE_KEYS.webFather,
    kanji: "父",
    who: { tr: "Inoichi Yamanaka", en: "Inoichi Yamanaka" },
    title: {
      tr: "Babadan kıza, son iletim",
      en: "Father to daughter, the last transmission",
    },
    eyes: {
      tr: "Babasının gözünden — vurulan müttefik karargâhı",
      en: "Through her father's eyes — the shattered allied headquarters",
    },
    body: {
      tr: "Dördüncü Büyük Şinobi Savaşı'nda müttefik karargâhı vuruldu. Inoichi Yamanaka ile Shikaku Nara, ölmeden önceki son dakikalarını plan yapmakla geçirdiler ve planı kendi çocuklarına bıraktılar: biri oğluna hesabı, öbürü kızına hattı. Ino babasının sesini kendi kafasının içinde duydu.",
      en: "In the Fourth Great Shinobi War the allied headquarters was destroyed. Inoichi Yamanaka and Shikaku Nara spent their last minutes making a plan and left it to their own children: one gave his son the arithmetic, the other gave his daughter the line. Ino heard her father's voice inside her own head.",
    },
    learned: {
      tr: "Bu sayfadaki en ağır cümle şu: bağı kuran kişi, hattın öbür ucunun ne zaman sustuğunu herkesten önce bilir. Ino o sessizliği duydu ve hattı kapatmadı.",
      en: "The heaviest sentence on this page: whoever makes the link is the first to know when the far end goes quiet. She heard that silence and did not close the line.",
    },
  },
  {
    key: "army",
    imageKey: INO_IMAGE_KEYS.webArmy,
    kanji: "連合軍",
    who: { tr: "Şinobi İttifakı", en: "The Shinobi Alliance" },
    finale: true,
    title: {
      tr: "Seksen bin zihin, tek cümle",
      en: "Eighty thousand minds, one sentence",
    },
    eyes: {
      tr: "Bütün cephenin gözünden — beş tümen birden",
      en: "Through the whole front's eyes — five divisions at once",
    },
    body: {
      tr: "Ino o ana kadar bir kişiye, sonra bir takıma, sonra bir komuta hattına bağlanmıştı. Karargâh yok olduğunda geriye kalan tek iletişim yolu kendisiydi ve ittifakın tamamını — bütün tümenleri, bütün köyleri — aynı anda birbirine bağladı. Savaşın kaderini değiştiren plan cepheye böyle ulaştı.",
      en: "Until then she had linked to one person, then to a team, then to a chain of command. When headquarters was gone the only remaining channel was her, and she joined the whole alliance — every division, every village — at once. That is how the plan that turned the war reached the front.",
    },
    learned: {
      tr: "Savaşın en büyük tekniği bir jutsu değildi: bir kızın seksen bin kafaya aynı cümleyi bırakmasıydı. Ve o cümleyi taşıyabilmesinin sebebi, önceki beş bağın hepsini tek tek kurmuş olmasıydı.",
      en: "The war's greatest technique was not a jutsu. It was a girl leaving the same sentence in eighty thousand heads — and she could carry that sentence only because she had made each of the five links before it, one at a time.",
    },
  },
];

/* ── Çiçek dili ─────────────────────────────────────────────────────────── */

/**
 * Bir hanakotoba kaydı.
 *
 * `characterId` opsiyonel: Inoichi'nin portresi yoldaş listesinde YOK
 * (bkz. `EXPERIENCE_COMPANIONS[2009]`), o satır portresiz çiziliyor ve
 * bölüm bundan etkilenmiyor.
 */
export interface InoFlowerEntry {
  key: string;
  /** `InoGlyphs`teki elle çizilmiş çiçeğin anahtarı */
  glyph: "kikyo" | "botan" | "kosumosu" | "shiragiku" | "sumire" | "rindo";
  kanji: string;
  romaji: string;
  flower: LocalizedText;
  /** Geleneksel hanakotoba anlamı */
  meaning: LocalizedText;
  person: string;
  characterId?: number;
  /** Arşivin okuması — eşleştirmenin gerekçesi */
  reading: LocalizedText;
}

export const INO_FLOWERS: InoFlowerEntry[] = [
  {
    key: "kikyo",
    glyph: "kikyo",
    kanji: "桔梗",
    romaji: "Kikyō",
    flower: { tr: "Çan çiçeği", en: "Bellflower" },
    meaning: {
      tr: "değişmeyen bağlılık · dürüstlük",
      en: "unchanging devotion · honesty",
    },
    person: "Shikamaru Nara",
    characterId: 2007,
    reading: {
      tr: "Değişmeyen. Ino'nun on iki yaşında yanında oturan çocuk, savaşın sonunda da aynı yerde oturuyordu; arada ne rütbe ne ölüm bu sırayı bozdu.",
      en: "The one that does not change. The boy sitting beside her at twelve was sitting in the same place at the end of the war; neither rank nor death moved that bench.",
    },
  },
  {
    key: "botan",
    glyph: "botan",
    kanji: "牡丹",
    romaji: "Botan",
    flower: { tr: "Şakayık", en: "Peony" },
    meaning: { tr: "cesaret · ağırbaşlılık", en: "courage · dignity" },
    person: "Chōji Akimichi",
    characterId: 2008,
    reading: {
      tr: "Cesaret, Chōji'de en geç ortaya çıkan ve en pahalıya mal olan özellikti. Ino onu yıllarca kilosuyla değil, kararsızlığıyla savundu.",
      en: "Courage was the last thing to surface in Chōji and the most expensive. For years she defended him not against his weight but against his hesitation.",
    },
  },
  {
    key: "kosumosu",
    glyph: "kosumosu",
    kanji: "コスモス",
    romaji: "Kosumosu",
    flower: { tr: "Kozmos çiçeği", en: "Cosmos" },
    meaning: {
      tr: "bir genç kızın saf yüreği",
      en: "the pure heart of a young girl",
    },
    person: "Sakura Haruno",
    characterId: 145,
    reading: {
      tr: "Rekabet ve dostluk. Aynı çiçeğin iki tarafı ve Ino ikisini de aynı kişiye verdi: önce kurdeleyi, sonra rakipliği. İkisi de hediyeydi.",
      en: "Rivalry and friendship — two faces of one flower, and she gave both to the same person: first the ribbon, then the rivalry. Both were gifts.",
    },
  },
  {
    key: "shiragiku",
    glyph: "shiragiku",
    kanji: "白菊",
    romaji: "Shiragiku",
    flower: { tr: "Beyaz kasımpatı", en: "White chrysanthemum" },
    meaning: { tr: "gerçek · yas", en: "truth · mourning" },
    person: "Asuma Sarutobi",
    characterId: 4775,
    reading: {
      tr: "Veda. Japonya'da mezara götürülen çiçek budur ve Ino'nun on altı yaşında öğrendiği ilk gerçek ders de bu oldu: bazı yaraları tıbbi çakra kapatmıyor.",
      en: "Farewell. This is the flower Japan carries to a grave, and it was the first true lesson of her sixteenth year: medical chakra does not close every wound.",
    },
  },
  {
    key: "sumire",
    glyph: "sumire",
    kanji: "菫",
    romaji: "Sumire",
    flower: { tr: "Menekşe", en: "Violet" },
    meaning: {
      tr: "içtenlik · küçük mutluluk",
      en: "sincerity · small happiness",
    },
    person: "Sai",
    characterId: 1901,
    reading: {
      tr: "Kelimesi olmayan zihin. Zihin okumayı meslek edinmiş kişinin okumakta en çok zorlandığı insan, sonunda yanında kalan insan oldu.",
      en: "The mind without words. The person hardest to read, for someone who reads minds professionally, turned out to be the person who stayed.",
    },
  },
  {
    key: "rindo",
    glyph: "rindo",
    kanji: "竜胆",
    romaji: "Rindō",
    flower: { tr: "Centiyane", en: "Gentian" },
    meaning: {
      tr: "üzgün olduğunda seni seven · adalet",
      en: "loving you when you are sorrowing · justice",
    },
    person: "Inoichi Yamanaka",
    reading: {
      tr: "Baba. Sözlükteki anlam bu sayfada birebir karşılığını buluyor: hattın öbür ucundaki adam, kızı ağlamaya başlamadan önce konuşmayı bitirdi.",
      en: "The father. The dictionary meaning lands literally here: the man at the far end of the line finished speaking before his daughter began to cry.",
    },
  },
];

/* ── Ömür çizelgesi ─────────────────────────────────────────────────────── */

export interface InoFateEntry {
  key: string;
  imageKey: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
}

export const INO_TIMELINE: InoFateEntry[] = [
  {
    key: "ribbon",
    imageKey: INO_IMAGE_KEYS.fateRibbon,
    age: { tr: "Akademiden önce", en: "Before the academy" },
    title: { tr: "Kurdele", en: "The ribbon" },
    text: {
      tr: "Sakura Haruno alnı yüzünden dalga geçilen bir çocuktu ve saçını öne tarayıp saklanıyordu. Ino onu o çemberin içinden çekip aldı, arkadaş oldu ve kendi kurdelesini verdi: saçını topla, alnını göster. Sakura'nın kendine ait bir kimliği o kurdeleyle başladı — ve yıllar sonra aynı kurdele geri verildi, çünkü artık rakiptiler. Ino kurdeleyi geri almayı reddetmedi; bunu bir hakaret değil, bir mezuniyet saydı.",
      en: "Sakura Haruno was a child mocked for her forehead, hiding behind hair combed forward. Ino pulled her out of that circle, befriended her, and handed over her own ribbon: tie your hair up, show your forehead. Sakura's separate identity began with that ribbon — and years later the same ribbon came back, because they were rivals now. Ino did not refuse it. She treated it as a graduation, not an insult.",
    },
  },
  {
    key: "chunin",
    imageKey: INO_IMAGE_KEYS.fateChunin,
    age: { tr: "12 yaş", en: "Age 12" },
    title: { tr: "Chūnin sınavı: kesilen saç", en: "Chūnin exam: the cut hair" },
    text: {
      tr: "Ön elemede karşısına Sakura çıktı. Ino saçını yıllarca uzatmıştı; o gün kunaiyle kesti, kestiği tutamı yere serip Shintenshin'in ıskalamayacağı bir hat kurdu. Teknik tuttu — ama içeride Sakura'nın kendi sesi onu dışarı attı. İkisi de aynı anda yere serildi ve maç berabere bitti. Ino o gün iki şeyi birden bıraktı: saçını ve karşısındakini küçümsemeyi.",
      en: "In the preliminaries she drew Sakura. Ino had spent years growing that hair; that day she cut it with a kunai, laid the lock on the ground and built from it a line Shintenshin could not miss. The technique landed — and inside, Sakura's own voice threw her out. They dropped at the same moment and the match was called a draw. She gave up two things that day: her hair, and the habit of underestimating the girl across from her.",
    },
  },
  {
    key: "asuma",
    imageKey: INO_IMAGE_KEYS.fateAsuma,
    age: { tr: "16 yaş", en: "Age 16" },
    title: { tr: "Asuma", en: "Asuma" },
    text: {
      tr: "10. Takım'ın öğretmeni Akatsuki'nin ölümsüz ikilisiyle karşılaşmada öldürüldü. Ino elindeki tıbbi çakrayla yetişmeye çalıştı; o yara kapanacak cinsten değildi. Shikamaru hesabı yapmaya oturdu, Chōji sustu, Ino ağladı — ve üçü aynı günün akşamında yetişkin oldu. Klanının tekniği ölüyü geri getirmiyor: bu, bir Yamanaka'nın öğrenmesi gereken ilk sınır.",
      en: "Team 10's teacher was killed in the encounter with Akatsuki's immortal pair. Ino tried to reach him with what medical chakra she had; that wound was not the closing kind. Shikamaru sat down to do the arithmetic, Chōji went quiet, Ino wept — and by that evening all three were adults. Her clan's technique does not bring the dead back: it is the first boundary a Yamanaka has to learn.",
    },
  },
  {
    key: "war",
    imageKey: INO_IMAGE_KEYS.fateWar,
    age: { tr: "16 yaş", en: "Age 16" },
    title: { tr: "Ağın kurulması", en: "The network goes up" },
    text: {
      tr: "Dördüncü Büyük Şinobi Savaşı'nda müttefik karargâhı vuruldu ve ittifakın tümenleri birbirinden koptu. Kokoro Tensou o güne kadar bir avuç kişilik bir hat için kullanılmıştı; Ino tekniği hiç denenmemiş bir ölçeğe çıkardı ve cephenin tamamını tek bir hatta bağladı. Savaşın kaderini değiştiren plan cepheye böyle ulaştı — bir telsiz kulesiyle değil, on altı yaşında bir kızın konsantrasyonuyla.",
      en: "In the Fourth Great Shinobi War the allied headquarters was hit and the divisions were cut off from one another. Kokoro Tensou had until then been used for a line of a handful of people; Ino took it to a scale nobody had tried and put the entire front on one channel. That is how the plan that turned the war reached the field — not through a radio tower but through the concentration of a sixteen-year-old.",
    },
  },
  {
    key: "inoichi",
    imageKey: INO_IMAGE_KEYS.fateInoichi,
    age: { tr: "16 yaş", en: "Age 16" },
    title: {
      tr: "Baba, ve devralınan iş",
      en: "The father, and the work she inherited",
    },
    text: {
      tr: "O hattın öbür ucunda Inoichi Yamanaka vardı ve ölmek üzereydi. Son emrini kızına verdi, sonra hat sustu. Ino ağlamayı savaştan sonraya bıraktı; klanın istihbarat işi ve babasının koltuğu ona kaldı. Zihin okumak o günden sonra bir teknik değil, bir görev oldu: kendi kafasına giren her şeyi taşıyabilen tek kişi olmak.",
      en: "At the far end of that line stood Inoichi Yamanaka, and he was dying. He gave his daughter her last order, and then the line went quiet. Ino postponed her crying until after the war; the clan's intelligence work and her father's chair fell to her. From that day reading minds stopped being a technique and became a duty: being the one person able to carry everything that enters her head.",
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

/**
 * İki söz — ve ikisi de sahne repliği değil, AD.
 *
 * Bir sahnenin cümlesini hatırlamakla o cümleyi bilmek aynı şey değil
 * (BRIEF §9). Bu iki ad ise seriyi baştan sona kat ediyor ve doğrulanabilir
 * olduğu için tırnak içine alınabildi. Sayfanın tezine de tam oturuyorlar:
 * bu arşivin bulduğu en sağlam bağ, iki küçültücü kelimenin arasında.
 */
export const INO_CLOSING = {
  names: [
    {
      text: { tr: "Alnı geniş", en: "Billboard Brow" },
      by: { tr: "Ino Yamanaka", en: "Ino Yamanaka" },
      note: {
        tr: "Alnı yüzünden küçümsenen çocuğa taktığı ad. Aynı Ino, o alnı saklamasın diye kendi kurdelesini vermişti.",
        en: "The name she gave the child who was mocked for her forehead. The same Ino handed over her own ribbon so that forehead would stop hiding.",
      },
    },
    {
      text: { tr: "İnobuta", en: "Ino-pig" },
      by: { tr: "Sakura Haruno", en: "Sakura Haruno" },
      note: {
        tr: "Karşılık: 「イノブタ」 — domuz Ino. İki ad da yıllar boyunca bırakılmadı; arşivin okuması şu, bu iki kelimenin arası bir kavga değil bir bağ.",
        en: "The answer: 「イノブタ」 — Ino-pig. Neither name was ever dropped; this archive reads the space between those two words as a link, not a quarrel.",
      },
    },
  ],
  motto: "花言葉",
  mottoNote: {
    tr: "hanakotoba — çiçeklerin dili",
    en: "hanakotoba — the language of flowers",
  },
  credit: {
    tr: "Künye verileri (doğum, boy, kan grubu, yaş, aile) ve yedek portre AniList'ten alınmıştır. Sayfadaki tam boy portre arşivin kendi yüklemesidir; zihin ağı, altı çiçek ve teknik şemaları bu sayfa için elle çizilmiş SVG'lerdir. Hanakotoba anlamları geleneksel Japon çiçek dilinden, çiçek–kişi eşleştirmeleri arşivin okumasıdır.",
    en: "Profile data (birthday, height, blood type, age, family) and the fallback portrait come from AniList. The full-size portrait is the archive's own upload; the mind network, the six flowers and the technique diagrams are SVGs drawn by hand for this page. The hanakotoba meanings are traditional; pairing each flower with a person is the archive's own reading.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList profile" },
} as const;
