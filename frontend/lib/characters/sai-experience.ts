import type { LocalizedText } from "./types";

/**
 * Sai — "Mürekkep ve Duygu" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 1901 kaydının ABILITY yuvaları,
 * `sai:*` anahtarlarıyla. Yuva boşken bölüm görselsiz ama AYAKTA çizilir.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (25 Kasım), boy (172,1 cm), kan grubu (A) ve yaş (17) AniList
 * künyesinden birebir alındı (`anilist-detay-22.json`, karakter 1901,
 * 24 Ağustos 2026). "Sai" adının takıma girebilmek için verilmiş bir kod ad
 * olduğu ve bütün resimlerinin adsız kaldığı da aynı künyenin açıklama
 * metninde geçiyor — uydurma değil, alıntılanabilir kayıt.
 * Kilo ve resmî rütbe AniList kaydında YOK; künye şeridinde de yok.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada karaktere atfedilmiş TEK BİR replik yok. Sebebi ilkeli: Sai'nin
 * çokça dolaşan cümlelerinin çeviri sürümleri birbirini tutmuyor ve
 * BRIEF §9 emin olunmayan repliği yasaklıyor. Tırnak içindeki iki metin
 * de kaynağını söylüyor: biri AniList künyesinin kendi cümlesi, öbürü
 * açıkça "arşivin notu" olarak imzalanmış. Geri kalan her şey düz anlatı.
 *
 * ── DUYGU SÖZLÜĞÜ HAKKINDA ───────────────────────────────────────────────
 * Sözlük kartlarındaki "kitabın öğrettiği" satırları evren içi bir kitaptan
 * ALINTI DEĞİL: Kök'ün öğrettiği tarifin arşiv tarafından yazılmış özeti.
 * Bu yüzden hiçbirinde tırnak yok — tırnak, olmayan bir kaynağa atıf
 * uydurmak olurdu.
 */

export const SAI_ID = 1901;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const SAI_SITE_URL = "https://anilist.co/character/1901";

/**
 * Sergi görselleri — hepsi characterId 1901 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `sai:` önekli (kurator modu şartı).
 */
export const SAI_IMAGE_KEYS = {
  /** Hero: geniş kadraj, mürekkep lekesinin arkasına giren sahne (16:9) */
  hero: "sai:hero",
  chojuGiga: "sai:choju-giga",
  yamataiko: "sai:yamataiko",
  birdFlight: "sai:bird-flight",
  sumiBunshin: "sai:sumi-bunshin",
  tanto: "sai:tanto",
  silenceSeal: "sai:silence-seal",
  sketchbook: "sai:sketchbook",
  drawLion: "sai:draw-lion",
  drawBirds: "sai:draw-birds",
  drawSnake: "sai:draw-snake",
  drawMouse: "sai:draw-mouse",
  drawDragon: "sai:draw-dragon",
  fateRoot: "sai:fate-root",
  fateShin: "sai:fate-shin",
  fateTeam: "sai:fate-team",
  fateSearch: "sai:fate-search",
  fateName: "sai:fate-name",
  closing: "sai:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const SAI_SLOT_LABELS: Record<string, LocalizedText> = {
  [SAI_IMAGE_KEYS.hero]: {
    tr: "Hero — geniş kadraj, koyu zemin; figür sağda küçük (16:9)",
    en: "Hero — wide frame, dark ground, small figure at right (16:9)",
  },
  [SAI_IMAGE_KEYS.chojuGiga]: {
    tr: "Chōjū Giga — tomardan ayağa kalkan mürekkep hayvanı",
    en: "Chōjū Giga — the ink beast rising off the scroll",
  },
  [SAI_IMAGE_KEYS.yamataiko]: {
    tr: "Shin: Yamataikō — cepheyi saran dev mürekkep yılanları",
    en: "Shin: Yamataikō — giant ink serpents across the front",
  },
  [SAI_IMAGE_KEYS.birdFlight]: {
    tr: "Mürekkep kuşu — takımı sırtında taşırken",
    en: "The ink bird — carrying the squad on its back",
  },
  [SAI_IMAGE_KEYS.sumiBunshin]: {
    tr: "Sumi Bunshin — dağılırken mürekkebe dönen klon",
    en: "Sumi Bunshin — the clone collapsing back into ink",
  },
  [SAI_IMAGE_KEYS.tanto]: {
    tr: "Sırttaki tantō — kını ve kabzası",
    en: "The tantō on his back — sheath and grip",
  },
  [SAI_IMAGE_KEYS.silenceSeal]: {
    tr: "Kök'ün dilsizlik mührü — dilin üstündeki işaret",
    en: "Root's silencing seal — the mark on the tongue",
  },
  [SAI_IMAGE_KEYS.sketchbook]: {
    tr: "Resim defteri — adsız sayfalar",
    en: "The picture book — the untitled pages",
  },
  [SAI_IMAGE_KEYS.drawLion]: {
    tr: "Tomar 1 — aslan çizimi",
    en: "Scroll 1 — the lion",
  },
  [SAI_IMAGE_KEYS.drawBirds]: {
    tr: "Tomar 2 — kuş sürüsü",
    en: "Scroll 2 — the flock of birds",
  },
  [SAI_IMAGE_KEYS.drawSnake]: {
    tr: "Tomar 3 — bağlayan yılan",
    en: "Scroll 3 — the binding serpent",
  },
  [SAI_IMAGE_KEYS.drawMouse]: {
    tr: "Tomar 4 — patlayan fareler",
    en: "Scroll 4 — the exploding mice",
  },
  [SAI_IMAGE_KEYS.drawDragon]: {
    tr: "Tomar 5 — ejderha ölçeği",
    en: "Scroll 5 — the dragon, at scale",
  },
  [SAI_IMAGE_KEYS.fateRoot]: {
    tr: "Kök'ün eğitim salonu — isimsiz çocuklar",
    en: "Root's training hall — the nameless children",
  },
  [SAI_IMAGE_KEYS.fateShin]: {
    tr: "Shin ve yarım kalmış resim defteri",
    en: "Shin and the unfinished picture book",
  },
  [SAI_IMAGE_KEYS.fateTeam]: {
    tr: "Takım Kakashi'ye ilk katılış",
    en: "Joining Team Kakashi for the first time",
  },
  [SAI_IMAGE_KEYS.fateSearch]: {
    tr: "Sasuke'yi arayış — Sai'nin taraf seçtiği an",
    en: "The search for Sasuke — the moment Sai picks a side",
  },
  [SAI_IMAGE_KEYS.fateName]: {
    tr: "Savaş sonrası — deftere yazılan ilk ad",
    en: "After the war — the first title written in the book",
  },
  [SAI_IMAGE_KEYS.closing]: {
    tr: "Kapanış — kurumuş fırça ve boş tomar",
    en: "Closing — the dry brush and the empty scroll",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const SAI_IDENTITY = {
  name: "Sai",
  nativeName: "サイ",
  /** Hero filigranı: 根 — "kök". Dekoratif, aria-hidden. */
  watermark: "根",
  division: { tr: "Kök — Konoha'nın gölge birimi", en: "Root — Konoha's shadow division" },
  epigraph: {
    tr: "Binlerce resim çizdi, hiçbirine ad veremedi. Adı olmayan bir adamın verecek adı da yoktu.",
    en: "He drew thousands of pictures and could title none of them. A man without a name had no name to give.",
  },
  lede: {
    tr: "Kök onu çocukken aldı ve duyguyu bir arıza gibi kazıdı: ne geçmiş, ne ad, ne tereddüt. Geriye kusursuz bir araç kaldı — sessiz, itaatkâr, olağanüstü yetenekli bir ressam. Sonra Takım Kakashi'ye yerleştirildi ve elindeki fırça ilk kez bir emri değil bir insanı çizmeye çalıştı.",
    en: "Root took him as a child and scraped emotion out of him like a fault: no past, no name, no hesitation. What was left was a flawless instrument — silent, obedient, an extraordinary painter. Then he was placed in Team Kakashi, and for the first time the brush in his hand tried to draw a person instead of an order.",
  },
  facts: [
    {
      label: { tr: "Ad", en: "Name" },
      value: {
        tr: "\"Sai\" — takıma girebilmesi için verilmiş kod ad",
        en: "\"Sai\" — a codename given so he could join the team",
      },
    },
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "25 Kasım", en: "25 November" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "172,1 cm", en: "172.1 cm" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "A", en: "A" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "17 (II. Bölüm)", en: "17 (Part II)" },
    },
    {
      label: { tr: "Bağlı olduğu birim", en: "Assignment" },
      value: {
        tr: "Kök ajanı → Takım Kakashi'nin altıncı üyesi",
        en: "Root operative → sixth member of Team Kakashi",
      },
    },
    {
      label: { tr: "Takım", en: "Team" },
      value: {
        tr: "Takım Kakashi — Naruto, Sakura, Yamato",
        en: "Team Kakashi — Naruto, Sakura, Yamato",
      },
    },
    {
      label: { tr: "Yanından ayırmadığı", en: "Always carried" },
      value: {
        tr: "Mürekkep şişesi, tomar ve adsız resimlerle dolu bir defter",
        en: "An ink bottle, a scroll, and a book of untitled pictures",
      },
    },
  ],
} satisfies {
  name: string;
  nativeName: string;
  watermark: string;
  division: LocalizedText;
  epigraph: LocalizedText;
  lede: LocalizedText;
  facts: { label: LocalizedText; value: LocalizedText }[];
};

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const SAI_SECTIONS = {
  identity: {
    /** Bölüm başlığının yanındaki dikey fırça işareti (dekoratif) */
    glyph: "録",
    title: { tr: "Kayıt", en: "The Record" },
    lede: {
      tr: "Kök bir ajanın künyesini tutmaz; bu satırların çoğu Sai takıma girdikten sonra yazıldı.",
      en: "Root keeps no file on an operative; most of these lines were written only after Sai joined the team.",
    },
  },
  names: {
    glyph: "名",
    title: { tr: "Adlarını Öğrendiği Yüzler", en: "The Faces Whose Names He Learned" },
    lede: {
      tr: "Sai insanları önce işlevleriyle tanıdı, sonra takma adlarla, en son adlarıyla. Sıra hep bu yönde ilerledi.",
      en: "Sai knew people first by their function, then by nicknames, and only last by their names. The order never ran the other way.",
    },
  },
  jutsu: {
    glyph: "墨",
    title: { tr: "Mürekkebin Üç Ölçeği", en: "Three Scales of Ink" },
    lede: {
      tr: "Aynı teknik: kâğıda çizilen şey kâğıdı bırakır. Değişen tek şey ölçek — bir hayvan, bir sürü, bir arazi.",
      en: "One technique: what is drawn on paper leaves the paper. The only variable is scale — a beast, a flock, a landscape.",
    },
  },
  kit: {
    glyph: "具",
    title: { tr: "Çantanın İçi", en: "What He Carries" },
    lede: {
      tr: "Dördü de Kök'ten kalma. Üçü iş için, biri hiçbir işe yaramadığı hâlde yıllarca yanında.",
      en: "All four are left over from Root. Three are for the work; the fourth served no purpose and he carried it for years anyway.",
    },
  },
  scroll: {
    glyph: "画",
    title: { tr: "Canlanan Çizim", en: "The Drawing That Wakes" },
    lede: {
      tr: "Tomarı adım adım açın. Her durakta figür önce çizgi olarak iniyor, sonra mürekkebini alıyor ve mühür vuruluyor — Sai'nin tekniği tam olarak bu sırayla işliyor.",
      en: "Unroll the scroll one step at a time. At each stop the figure lands as line first, then takes its ink, then the seal falls — Sai's technique works in exactly that order.",
    },
  },
  lexicon: {
    glyph: "心",
    title: { tr: "Duygu Sözlüğü", en: "The Lexicon of Feeling" },
    lede: {
      tr: "Kök duyguyu silerken yerine bir tarif listesi bıraktı. Sai yıllarca o listeyle idare etti; her maddenin karşılığını ise tek tek, yaşayarak öğrendi.",
      en: "When Root cut out the feelings it left a list of definitions in their place. Sai ran on that list for years, and learned what each entry actually meant one at a time, by living it.",
    },
  },
  fate: {
    glyph: "生",
    title: { tr: "Kader Çizelgesi", en: "The Line of His Life" },
    lede: {
      tr: "Beş durak. İlk üçünde adı ona verildi, son ikisinde adını kendisi taşımaya başladı.",
      en: "Five stops. In the first three his name was given to him; in the last two he began to carry it himself.",
    },
  },
} satisfies Record<
  string,
  { glyph: string; title: LocalizedText; lede: LocalizedText }
>;

/* ── Sumi modu ──────────────────────────────────────────────────────────── */

export const SAI_SUMI_TEXT = {
  enter: { tr: "Sumi modu", en: "Sumi mode" },
  exit: { tr: "Sumi modu · açık", en: "Sumi mode · on" },
  hint: {
    tr: "Mürekkep sayfaya yayıldı: kontrastlar sertleşti, mühür kızılı çekildi. Kök'ün gördüğü sayfa bu.",
    en: "The ink has spread across the page: contrast hardened, the seal red drained. This is the page Root sees.",
  },
} satisfies Record<string, LocalizedText>;

export const SAI_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "Naruto Universe" },
} satisfies Record<string, LocalizedText>;

/* ── Adlarını öğrendiği yüzler ──────────────────────────────────────────── */

export interface SaiPerson {
  characterId: number;
  name: string;
  /** Sai'nin o kişiyi başta ne diye tanıdığı — künye satırı */
  callsign: LocalizedText;
  note: LocalizedText;
  /** Kök tarafı mı, takım tarafı mı — kart tonunu belirliyor */
  side: "root" | "team";
}

export const SAI_PEOPLE: SaiPerson[] = [
  {
    characterId: 17,
    name: "Naruto Uzumaki",
    callsign: { tr: "Takım arkadaşı", en: "Teammate" },
    note: {
      tr: "Sai'nin ilk gerçek ölçüsü. Naruto'nun Sasuke için gösterdiği inat, Kök'te okuduğu hiçbir tarife uymuyordu; sözlükteki maddeler ilk kez orada yanlış çıktı.",
      en: "Sai's first real measuring stick. Naruto's stubbornness over Sasuke matched none of the definitions Root had taught him; that was where the entries first proved wrong.",
    },
    side: "team",
  },
  {
    characterId: 13,
    name: "Sasuke Uchiha",
    callsign: { tr: "Doldurduğu boşluk", en: "The gap he filled" },
    note: {
      tr: "Sai takıma onun yerine kondu. İlk görevi, hiç tanımadığı birinin bıraktığı boşluğu doldurmaktı — ve o boşluğun neden bu kadar büyük olduğunu anlamak.",
      en: "Sai was placed in the team in his stead. His first assignment was to fill the space left by a stranger — and to work out why that space was so large.",
    },
    side: "team",
  },
  {
    characterId: 145,
    name: "Sakura Haruno",
    callsign: { tr: "İlk denemenin kurbanı", en: "The first experiment" },
    note: {
      tr: "Kitaptan öğrendiği \"iltifat\" tarifini ilk onun üzerinde denedi ve tam tersini söyledi. Ona taktığı ad (busu — çirkin) yıllarca değişmedi; değiştiğinde bunu ikisi de fark etti.",
      en: "He tried the book's recipe for a compliment on her first, and said the exact opposite. The name he gave her (busu — ugly) stuck for years; when it finally changed, both of them noticed.",
    },
    side: "team",
  },
  {
    characterId: 2006,
    name: "Yamato",
    callsign: { tr: "Takımın geçici komutanı", en: "The team's interim captain" },
    note: {
      tr: "Kendisi de ANBU'dan geliyordu, yani Sai'nin sessizliğini okuyabilen tek kişiydi. Sai'nin hâlâ Kök'e mi rapor verdiğini en uzun süre o tarttı.",
      en: "He came out of the ANBU himself, so he was the one person who could read Sai's silences. He weighed the question of whether Sai still reported to Root longer than anyone.",
    },
    side: "team",
  },
  {
    characterId: 85,
    name: "Kakashi Hatake",
    callsign: { tr: "Takımın asıl komutanı", en: "The team's true captain" },
    note: {
      tr: "Döndüğünde takımın başına geçti. Sai'ye hiçbir zaman Kök'ün diliyle konuşmadı; emir vermek yerine soru sordu, bu da bir tarif değildi.",
      en: "He took the squad back when he returned. He never spoke to Sai in Root's language: he asked questions instead of giving orders, and that was not in the book either.",
    },
    side: "team",
  },
  {
    characterId: 23424,
    name: "Danzō Shimura",
    callsign: { tr: "Kök'ün başı", en: "The head of Root" },
    note: {
      tr: "Onu alan, adını silen ve diline mühür vuran adam. Sai yıllarca konuşurken, cümlenin arkasında hep onun izni vardı.",
      en: "The man who took him, erased his name and sealed his tongue. For years, every sentence Sai spoke carried his permission behind it.",
    },
    side: "root",
  },
];

/* ── Mürekkebin üç ölçeği ───────────────────────────────────────────────── */

export interface SaiJutsu {
  key: "chojuGiga" | "yamataiko" | "birdFlight";
  name: string;
  /** Kart kenarındaki dikey fırça işareti — tek karakter, dekoratif */
  glyph: string;
  turkish: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
}

export const SAI_JUTSU: SaiJutsu[] = [
  {
    key: "chojuGiga",
    name: "Chōjū Giga — 超獣偽画",
    glyph: "獣",
    turkish: {
      tr: "Süper Canavarı Taklit Eden Çizim",
      en: "Super Beast Imitating Drawing",
    },
    tagline: {
      tr: "Kâğıda inen her şey kâğıdı bırakabilir.",
      en: "Whatever lands on the paper can leave the paper.",
    },
    text: {
      tr: "Sai tomara mürekkeple bir hayvan çizer, mühür işaretini yapar ve çizim kâğıttan kalkar. Tekniğin gücü çakra miktarında değil, elin sabrındadır: acele edilmiş bir çizgi ilk darbede mürekkebe döner, sabırla çizilmiş bir hayvan dakikalarca ayakta kalır. Bu yüzden Sai'nin hızı bir zayıflık değil, ölçülmüş bir tercih — ne kadar hızlı çizerse o kadar kısa yaşayan bir şey yaratır.",
      en: "Sai draws an animal on the scroll in ink, forms the seal, and the drawing lifts off the page. The strength of the technique is not in chakra but in the patience of the hand: a rushed line turns back to ink at the first blow, a patiently drawn beast stays on its feet for minutes. So Sai's speed is not a weakness but a measured trade — the faster he draws, the shorter-lived the thing he makes.",
    },
    traits: [
      { tr: "Ninjutsu", en: "Ninjutsu" },
      { tr: "Mürekkep + tomar", en: "Ink and scroll" },
      { tr: "Yakın–orta menzil", en: "Close to mid range" },
    ],
  },
  {
    key: "yamataiko",
    name: "Shin: Yamataikō",
    glyph: "蛇",
    turkish: { tr: "Devasa mürekkep yılanları", en: "Colossal ink serpents" },
    tagline: {
      tr: "Bu ölçekte çizim artık bir hayvan değil, bir arazi.",
      en: "At this scale a drawing is no longer a beast; it is terrain.",
    },
    text: {
      tr: "Aynı tekniğin ölçek büyütülmüş hâli: tek bir hayvan yerine cepheyi boydan boya saran mürekkep yılanları. Dördüncü Büyük Ninja Savaşı'nda Sai'nin işi artık dövüşmek değil, alanı yönetmekti — düşen müttefikleri kavramak, hatları kapatmak, birlikleri taşımak. Bir ressamın savaş meydanında yapabileceği en tuhaf şey: haritayı çizmek yerine haritanın kendisi olmak.",
      en: "The same technique with the scale opened up: instead of one beast, ink serpents laid the length of the front. In the Fourth Great Ninja War Sai's job stopped being combat and became control of ground — catching falling allies, closing lines, carrying units. The strangest thing a painter can do on a battlefield: instead of drawing the map, becoming it.",
    },
    traits: [
      { tr: "Geniş alan", en: "Wide area" },
      { tr: "Savaş ölçeği", en: "War scale" },
      { tr: "Bağlama ve taşıma", en: "Binding and transport" },
    ],
  },
  {
    key: "birdFlight",
    name: "Ninpō: Chōjū Giga — 鳥",
    glyph: "鳥",
    turkish: { tr: "Mürekkep kuşuyla uçuş", en: "Flight on the ink bird" },
    tagline: {
      tr: "Takımın en sık kullandığı ulaşım tek bir fırça darbesidir.",
      en: "The squad's most-used transport is a single brush stroke.",
    },
    text: {
      tr: "Tek çırpıda çizilen dev bir kuş. Sai ekibi sırtına alır, düşman hattının üstünden geçer, kimsenin göremediği bir açıdan iner. Kuş aynı zamanda Sai'nin gözüdür: küçük bir sürü hâlinde çizildiğinde keşif yapar, mesaj taşır, dağılıp yeniden toplanır. Takım Kakashi'nin harita bilgisinin büyük kısmı bu kanatların altından geldi.",
      en: "One giant bird, drawn in a single sweep. Sai takes the squad onto its back, crosses above the enemy line and comes down at an angle nobody was watching. The bird is also Sai's eye: drawn as a small flock it scouts, carries messages, scatters and regroups. Most of what Team Kakashi knew about the ground came from under these wings.",
    },
    traits: [
      { tr: "Nakil", en: "Transport" },
      { tr: "Keşif", en: "Reconnaissance" },
      { tr: "Grup taşıma", en: "Carries the squad" },
    ],
  },
];

/* ── Çantanın içi ───────────────────────────────────────────────────────── */

export interface SaiKitItem {
  key: string;
  glyph: string;
  name: LocalizedText;
  note: LocalizedText;
  imageKey: string;
}

export const SAI_KIT: SaiKitItem[] = [
  {
    key: "sumiBunshin",
    glyph: "墨",
    name: { tr: "Sumi Bunshin no Jutsu", en: "Sumi Bunshin no Jutsu" },
    note: {
      tr: "Mürekkepten bir kopya. Dağıldığında geriye ceset değil leke kalır: düşman kimi yendiğini, hatta birini yenip yenmediğini bilemez.",
      en: "A copy made of ink. When it breaks it leaves a stain, not a body: the enemy cannot tell whom he beat, or whether he beat anyone.",
    },
    imageKey: SAI_IMAGE_KEYS.sumiBunshin,
  },
  {
    key: "tanto",
    glyph: "刀",
    name: { tr: "Sırttaki tantō", en: "The tantō on his back" },
    note: {
      tr: "Kısa kılıç, Kök'ün alışkanlığı: sessiz, yakın, tek hamlelik. Sai onu bir silahtan çok bir alet gibi taşır — fırçanın olmadığı yerde eline aldığı şey.",
      en: "A short blade, a Root habit: quiet, close, one motion. Sai carries it less like a weapon than like a tool — the thing he picks up where the brush will not reach.",
    },
    imageKey: SAI_IMAGE_KEYS.tanto,
  },
  {
    key: "silenceSeal",
    glyph: "印",
    name: { tr: "Kök'ün dilsizlik mührü", en: "Root's silencing seal" },
    note: {
      tr: "Dilinin üstüne kazınmış işaret. Kök'e dair tek kelime etmeye kalksa beden kilitlenir. Sai'nin sessizliğinin bir kısmı huy değil, mühürdü.",
      en: "A mark cut into his tongue. Try to say one word about Root and the body locks. Part of Sai's silence was never temperament; it was a seal.",
    },
    imageKey: SAI_IMAGE_KEYS.silenceSeal,
  },
  {
    key: "sketchbook",
    glyph: "絵",
    name: { tr: "Resim defteri", en: "The picture book" },
    note: {
      tr: "Yüzlerce resim, tek bir ad yok. Ad koymak için bir sebep gerekir; Sai'de o sebep yıllarca eksikti. Defterin son sayfası da yıllarca yarım kaldı.",
      en: "Hundreds of pictures and not one title. Titling a thing takes a reason, and for years Sai had none. The last page of the book stayed unfinished just as long.",
    },
    imageKey: SAI_IMAGE_KEYS.sketchbook,
  },
];

/* ── Canlanan çizim tomarı — sayfanın kalbi ─────────────────────────────── */

export type SaiFigureKey = "lion" | "birds" | "snake" | "mouse" | "dragon";

export interface SaiFigure {
  key: SaiFigureKey;
  /** Tomar sekmesinde basılan tek karakter */
  glyph: string;
  name: LocalizedText;
  /** Ekran okuyucuya inen figür tarifi */
  alt: LocalizedText;
  drew: LocalizedText;
  purpose: LocalizedText;
  imageKey: string;
}

export const SAI_FIGURES: SaiFigure[] = [
  {
    key: "lion",
    glyph: "獅",
    name: { tr: "Aslan", en: "Lion" },
    alt: {
      tr: "Mürekkeple çizilmiş, çömelmiş bir aslan — kalın yele darbeleri, kıvrık kuyruk",
      en: "A crouching lion drawn in ink — heavy mane strokes, a curled tail",
    },
    drew: {
      tr: "Birkaç geniş darbeyle omuz ve yele, sonra yüzü hiç ayrıntılandırmadan bir baş. Aslanın gözü çizilmez; mühür vurulunca kendiliğinden açılır.",
      en: "A few broad strokes for the shoulder and mane, then a head with no detail in the face. The eye is never drawn; it opens by itself when the seal falls.",
    },
    purpose: {
      tr: "Darbeyi yiyen şey. Sai'nin öne sürdüğü ilk figür hep budur: bir kalkan gibi kullanılır, dağılırsa yalnızca mürekkep dağılmış olur.",
      en: "The thing that takes the hit. This is always the first figure Sai sends forward: used as a shield, and if it comes apart, only ink has come apart.",
    },
    imageKey: SAI_IMAGE_KEYS.drawLion,
  },
  {
    key: "birds",
    glyph: "鳥",
    name: { tr: "Kuş sürüsü", en: "Flock of birds" },
    alt: {
      tr: "Mürekkeple çizilmiş bir kuş sürüsü — önde büyük bir kuş, arkasında küçülerek dağılan kanat işaretleri",
      en: "A flock of birds in ink — one large bird in front, wing marks scattering and shrinking behind it",
    },
    drew: {
      tr: "Tek fırça hareketiyle onlarca çift kanat. Sürünün hiçbir üyesi ayrıntılı değildir; uzaklık, çizginin incelmesiyle veriliyor.",
      en: "Dozens of pairs of wings in one motion of the brush. No member of the flock is detailed; distance is carried by the thinning of the line.",
    },
    purpose: {
      tr: "Gözle görülmeyeni görmek. Sürü dağılır, ayrı yönlere gider ve Sai bakmadan ne gördüklerini bilir; mesaj taşımak da aynı sürünün işi.",
      en: "Seeing what cannot be seen. The flock scatters, goes separate ways, and Sai knows what they saw without looking; carrying messages is the same flock's work.",
    },
    imageKey: SAI_IMAGE_KEYS.drawBirds,
  },
  {
    key: "snake",
    glyph: "蛇",
    name: { tr: "Yılan", en: "Serpent" },
    alt: {
      tr: "Mürekkeple çizilmiş uzun bir yılan — tek kıvrımlı darbe ve ucunda bir baş",
      en: "A long serpent in ink — one winding stroke with a head at its end",
    },
    drew: {
      tr: "Fırça kâğıttan hiç kalkmadan çizilen tek bir kıvrım. Yılan, tekniğin en ucuz ve en hızlı figürü: bir çizgi, bir baş, bitti.",
      en: "A single winding line drawn without lifting the brush. The serpent is the technique's cheapest, fastest figure: one line, one head, done.",
    },
    purpose: {
      tr: "Bağlamak. Öldürmek için değil, tutmak için çizilir — bir kolu, bir bacağı, bir kapıyı. Savaş ölçeğine çıkarıldığında aynı kıvrım cepheyi kapatır.",
      en: "Binding. It is drawn to hold, not to kill — an arm, a leg, a doorway. Taken up to war scale, the same curve closes a whole front.",
    },
    imageKey: SAI_IMAGE_KEYS.drawSnake,
  },
  {
    key: "mouse",
    glyph: "鼠",
    name: { tr: "Fareler", en: "Mice" },
    alt: {
      tr: "Mürekkeple çizilmiş küçük bir fare — yuvarlak gövde, iki kulak, uzun kuyruk",
      en: "A small mouse in ink — round body, two ears, a long tail",
    },
    drew: {
      tr: "En küçük figür ve en çok sayıda çizileni. Bir farenin çizilmesi birkaç saniye sürer; onlarcası aynı tomarın kenarına sığar.",
      en: "The smallest figure and the one drawn most often. A mouse takes a few seconds; dozens of them fit along the edge of one scroll.",
    },
    purpose: {
      tr: "Sızmak, sonra patlamak. Fareler kimsenin bakmadığı deliklerden girer, yerlerini alır ve mürekkep bir anda dağılır — Sai'nin en sessiz saldırısı en gürültülü biten saldırısıdır.",
      en: "To slip in, then detonate. The mice enter through holes nobody watches, take their positions, and the ink comes apart all at once — Sai's quietest attack is the one that ends loudest.",
    },
    imageKey: SAI_IMAGE_KEYS.drawMouse,
  },
  {
    key: "dragon",
    glyph: "龍",
    name: { tr: "Ejderha", en: "Dragon" },
    alt: {
      tr: "Mürekkeple çizilmiş uzun bir ejderha — dalgalı gövde, boynuzlar ve bıyıklar",
      en: "A long dragon in ink — an undulating body, horns and whiskers",
    },
    drew: {
      tr: "Tomarın bir ucundan öbür ucuna uzanan tek gövde. Bu figürde sabır artık bir tercih değil şart: aceleyle çizilmiş bir ejderha ayağa bile kalkmaz.",
      en: "A single body running from one end of the scroll to the other. Here patience stops being a trade-off and becomes a requirement: a rushed dragon never even gets up.",
    },
    purpose: {
      tr: "Ölçeğin sınırını göstermek. Sai bunu nadiren çizer; çizdiğinde artık bir hayvan değil, bir hava durumu gibi davranır ve etraftaki herkesin planını değiştirir.",
      en: "To show where the scale ends. Sai rarely draws it; when he does it behaves less like an animal than like weather, and everyone nearby changes their plan.",
    },
    imageKey: SAI_IMAGE_KEYS.drawDragon,
  },
];

export const SAI_SCROLL_UI = {
  listLabel: { tr: "Tomardaki çizimler", en: "Drawings on the scroll" },
  stepWord: { tr: "Çizim", en: "Drawing" },
  prev: { tr: "Önceki", en: "Previous" },
  next: { tr: "Sonraki", en: "Next" },
  drewLabel: { tr: "Ne çizdi", en: "What he drew" },
  purposeLabel: { tr: "Ne için", en: "What it is for" },
  keyboardHint: {
    tr: "Ok tuşlarıyla tomarda gezinebilirsiniz; Home ve End ilk ile son çizime gider.",
    en: "Use the arrow keys to move along the scroll; Home and End jump to the first and last drawing.",
  },
  sealLabel: { tr: "Mühür vuruldu", en: "Sealed" },
} satisfies Record<string, LocalizedText>;

/* ── Duygu sözlüğü ──────────────────────────────────────────────────────── */

export interface SaiLexiconEntry {
  key: string;
  glyph: string;
  name: LocalizedText;
  reading: string;
  /** Kök'ün öğrettiği tarif — arşiv özeti, alıntı DEĞİL (bkz. dosya başı) */
  taught: LocalizedText;
  /** Karşılığının gerçekte ne çıktığı */
  learned: LocalizedText;
}

export const SAI_LEXICON: SaiLexiconEntry[] = [
  {
    key: "smile",
    glyph: "笑",
    name: { tr: "Gülümseme", en: "Smile" },
    reading: "warai",
    taught: {
      tr: "Gergin bir ortamda yüzü gülümsemeye zorlamak karşındakini yatıştırır; en ucuz yatıştırma aracıdır.",
      en: "Forcing the face into a smile calms the person across from you; it is the cheapest calming device there is.",
    },
    learned: {
      tr: "Zorlanmış gülümseme bir yalan gibi görünür. Sai'nin gülümsemesi yıllarca takımı yatıştırmak yerine ürküttü — çünkü tarif doğruydu, eksik olan kaynağıydı.",
      en: "A forced smile reads as a lie. For years Sai's smile unsettled the team instead of calming it — the recipe was right, what was missing was where it came from.",
    },
  },
  {
    key: "bond",
    glyph: "絆",
    name: { tr: "Bağ", en: "Bond" },
    reading: "kizuna",
    taught: {
      tr: "Bağ, iki kişinin birbirini kollamayı seçmesidir; seçim olduğuna göre gerektiğinde geri alınabilir.",
      en: "A bond is two people choosing to look out for each other; being a choice, it can be withdrawn when required.",
    },
    learned: {
      tr: "Tarif doğruydu ama tersten yazılmıştı: bağ seçilmiyor, fark ediliyor. Sai onu Naruto'nun bir türlü vazgeçemeyişinde fark etti.",
      en: "The definition was correct but written backwards: a bond is not chosen, it is noticed. Sai noticed it in Naruto's plain inability to let go.",
    },
  },
  {
    key: "brother",
    glyph: "兄",
    name: { tr: "Ağabey", en: "Elder brother" },
    reading: "ani",
    taught: {
      tr: "Kök'te kardeşlik yoktur; aynı eğitimden geçen iki ajan birbirinin yedeğidir, o kadar.",
      en: "There are no brothers in Root; two operatives from the same training are each other's replacements, nothing more.",
    },
    learned: {
      tr: "Shin ne kan bağıydı ne görev ortağı. Sai'nin ona ağabey demesi, Kök'ün eğitim planında hiç öngörülmemiş tek şeydi.",
      en: "Shin was neither blood nor a mission partner. Sai calling him a brother was the one thing Root's training plan never accounted for.",
    },
  },
  {
    key: "anger",
    glyph: "怒",
    name: { tr: "Öfke", en: "Anger" },
    reading: "ikari",
    taught: {
      tr: "Öfke muhakemeyi bozan bir arızadır; ajanın görevi onu fark etmeden bastırmaktır.",
      en: "Anger is a fault that spoils judgement; the operative's task is to suppress it before it registers.",
    },
    learned: {
      tr: "Arıza değil, ölçüydü. Bir bağın çiğnendiğini gördüğünde yükselen o şeyin bir adı olduğunu öğrenmesi, sözlükteki en geç dolan maddeydi.",
      en: "Not a fault but a gauge. Learning that the thing rising in him when a bond was trampled had a name was the last entry in the lexicon to fill in.",
    },
  },
  {
    key: "name",
    glyph: "名",
    name: { tr: "Ad", en: "Name" },
    reading: "na",
    taught: {
      tr: "Ad, bir kişiyi diğerlerinden ayırmaya yarayan bir işarettir; birimde işaret gerekmez, numara yeter.",
      en: "A name is a mark that separates one person from the rest; inside the division no mark is needed, a number is enough.",
    },
    learned: {
      tr: "Ad bir işaret değil, bir sahiplik. Kök adını sildiğinde Sai'den bir harf değil, bir hak almış oldu — ve o hakkı geri almak yıllar sürdü.",
      en: "A name is not a mark but a claim. When Root erased his, it took from Sai not a word but a right — and taking that right back took years.",
    },
  },
  {
    key: "heart",
    glyph: "心",
    name: { tr: "Kalp", en: "Heart" },
    reading: "kokoro",
    taught: {
      tr: "Duygu, kararı bulandıran bir gürültüdür. Temiz karar, gürültüsüz karardır.",
      en: "Feeling is noise that muddies a decision. A clean decision is a decision without noise.",
    },
    learned: {
      tr: "Gürültü değil, ölçüydü. Sai bunu ancak elindeki resmin neden yıllardır bitmediğini anlayınca gördü: eksik olan fırça değildi.",
      en: "Not noise but a measure. Sai only saw it when he worked out why the picture in his hands had gone unfinished for years: what was missing was never the brush.",
    },
  },
];

export const SAI_LEXICON_UI = {
  taughtLabel: { tr: "Kitabın öğrettiği", en: "What the book taught" },
  learnedLabel: { tr: "Yaşayarak öğrendiği", en: "What living taught" },
} satisfies Record<string, LocalizedText>;

/* ── Kader çizelgesi ────────────────────────────────────────────────────── */

export interface SaiFateEntry {
  key: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: LocalizedText };
  imageKey: string;
}

export const SAI_TIMELINE: SaiFateEntry[] = [
  {
    key: "root",
    age: { tr: "Çocuk yaşta", en: "As a child" },
    title: { tr: "Kök alır, ad silinir", en: "Root takes him, the name is erased" },
    text: {
      tr: "Danzō Shimura'nın birimi onu küçük yaşta alır ve duygusuz olacak biçimde eğitir — görevleri kolaylaştırmak için. Geçmiş, aile, ad: üçü de kayıttan düşülür. Kök'ün mantığı basittir; hatırlayacak bir şeyi olmayan ajan tereddüt etmez.",
      en: "Danzō Shimura's division takes him young and trains him to have no emotions, so that missions come easier. Past, family, name: all three are struck from the record. Root's logic is simple — an operative with nothing to remember does not hesitate.",
    },
    imageKey: SAI_IMAGE_KEYS.fateRoot,
  },
  {
    key: "shin",
    age: { tr: "Kök yılları", en: "The Root years" },
    title: { tr: "Shin ve yarım kalan resim", en: "Shin, and the picture left unfinished" },
    text: {
      tr: "Aynı eğitimden geçen bir çocukla arasında birimin adını koymadığı bir şey oluşur. Sai ona ağabey der. Birlikte bir resim defteri doldururlar ve son sayfa boş kalır — Sai o sayfayı yıllarca ne bitirebilir ne de atabilir.",
      en: "Between him and another child from the same training, something forms that the division has no word for. Sai calls him a brother. They fill a picture book together and the last page stays empty — for years Sai can neither finish it nor throw it away.",
    },
    imageKey: SAI_IMAGE_KEYS.fateShin,
  },
  {
    key: "team",
    age: { tr: "17 · II. Bölüm", en: "17 · Part II" },
    title: { tr: "Takım Kakashi'ye yerleştirilme", en: "Placement in Team Kakashi" },
    text: {
      tr: "Sasuke'nin boşluğunu doldurmak üzere Takım 7'ye verilir; \"Sai\" adı da tam olarak bu iş için uydurulmuştur. İlk günler felakettir: sosyal görünmeye çalışırken herkesi tek tek kırar, sonra gülümsemeyi dener ve gülümseme de tutmaz.",
      en: "He is assigned to Team 7 to fill the space Sasuke left; the name \"Sai\" is invented for exactly that purpose. The first days are a disaster: trying to appear sociable he insults every member in turn, then tries smiling, and the smile does not hold either.",
    },
    quote: {
      text: {
        tr: "\"Sai\" adı, takıma katılabilmesi için ona verilmiştir.",
        en: "The name \"Sai\" is given to him for the purposes of joining the team.",
      },
      by: { tr: "AniList künyesi · #1901", en: "AniList entry · #1901" },
    },
    imageKey: SAI_IMAGE_KEYS.fateTeam,
  },
  {
    key: "search",
    age: { tr: "17 · Sasuke arayışı", en: "17 · The search for Sasuke" },
    title: { tr: "Duygunun geri gelmesi", en: "The feeling comes back" },
    text: {
      tr: "Sasuke'yi arayan takımla birlikte yola çıkarken emirleri Kök'ten alıyordur. Yolun sonunda emri değil takımı seçer. Bu, Sai'nin hayatında ilk kez bir tarife değil kendi ölçüsüne göre verdiği karardır — ve yarım kalan resim ilk kez anlam kazanır.",
      en: "He sets out with the squad hunting Sasuke while still taking his orders from Root. By the end of that road he chooses the squad over the order. It is the first decision of Sai's life made against his own measure rather than a definition — and the unfinished picture means something for the first time.",
    },
    imageKey: SAI_IMAGE_KEYS.fateSearch,
  },
  {
    key: "name",
    age: { tr: "17 · Dördüncü Savaş", en: "17 · The Fourth War" },
    title: { tr: "Kendi adını taşımak", en: "Carrying his own name" },
    text: {
      tr: "Savaşta artık ölçek işini yapar: cepheyi mürekkeple bağlar, birlikleri taşır, düşenleri toplar. Ama asıl değişim tomarda değil defterdedir. \"Sai\" artık Kök'ün bir işlem için uydurduğu kod değil, sahibinin taşımayı seçtiği bir addır — ve ancak o zaman bir resme ad koyabilir.",
      en: "In the war he does the work of scale: binding the front with ink, carrying units, gathering the fallen. But the real change is not on the scroll, it is in the book. \"Sai\" is no longer a code Root invented for one operation but a name its owner chooses to carry — and only then can he title a picture.",
    },
    imageKey: SAI_IMAGE_KEYS.fateName,
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const SAI_CLOSING = {
  quotes: [
    {
      text: {
        tr: "Duygudan yoksun oluşu, çizdiği hiçbir şeye ad verecek ilhamı bulmasını imkânsız kılar; bu yüzden bütün eserleri adsızdır.",
        en: "His lack of emotion makes it impossible for him to be inspired to give something a title, and thus all of his works are nameless.",
      },
      by: { tr: "AniList künyesi · #1901", en: "AniList entry · #1901" },
      note: {
        tr: "Sayfadaki bütün künye sayıları da aynı kayıttan alındı.",
        en: "Every figure in this page's record comes from the same entry.",
      },
    },
    {
      text: {
        tr: "Bir resmin bitmesi için son fırça darbesi yetmez; ona bir ad vermek gerekir.",
        en: "A picture is not finished by its last brush stroke; it is finished by being given a name.",
      },
      by: { tr: "Arşivin notu", en: "The archive's note" },
      note: {
        tr: "Karaktere atfedilmiş replik değil: sayfa boyunca Sai'ye ait tek bir cümle tırnak içine alınmadı.",
        en: "Not a line attributed to the character: nowhere on this page is a sentence put in Sai's mouth.",
      },
    },
  ],
  motto: "無題",
  mottoNote: {
    tr: "Mudai — \"Adsız\". Sai'nin bütün resimlerinin ortak başlığı.",
    en: "Mudai — \"Untitled\". The shared title of every picture Sai drew.",
  },
  credit: {
    tr: "Künye verileri AniList'ten alındı; sayfadaki mürekkep figürlerinin, lekenin ve mührün tamamı bu arşiv için elle çizildi (SVG).",
    en: "Record data comes from AniList; every ink figure, blot and seal on this page was drawn by hand for this archive (SVG).",
  },
  creditLink: { tr: "AniList kaydı", en: "AniList entry" },
} satisfies {
  quotes: { text: LocalizedText; by: LocalizedText; note: LocalizedText }[];
  motto: string;
  mottoNote: LocalizedText;
  credit: LocalizedText;
  creditLink: LocalizedText;
};

/* ── Alternatif metinler ────────────────────────────────────────────────── */

export const SAI_ALT = {
  portrait: {
    tr: "Sai'nin tam boy portresi — arşive yüklenmiş görsel",
    en: "Full-length portrait of Sai — image uploaded to this archive",
  },
  portraitFallback: {
    tr: "Sai'nin AniList künyesindeki portresi",
    en: "Sai's portrait from his AniList entry",
  },
  personSuffix: {
    tr: "— arşive yüklenmiş portre",
    en: "— portrait uploaded to this archive",
  },
} satisfies Record<string, LocalizedText>;
