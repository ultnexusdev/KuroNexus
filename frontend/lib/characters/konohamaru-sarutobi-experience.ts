import type { LocalizedText } from "./types";

/**
 * Konohamaru Sarutobi — "Devralınan Ateş" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 3889 kaydının ABILITY yuvaları,
 * `konohamaru:*` anahtarlarıyla. Görsel bağlı değilse bölüm görselsiz ama
 * AYAKTA çizilir; hiçbir bölüm yükleme bekleyerek çökmez.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (30 Aralık) ve yaş (8-9 (I), 11 (II)) AniList künyesinden
 * birebir alındı (`anilist-detay-22.json`, karakter 3889).
 * ⚠️ O kayıtta BOY ve KAN GRUBU yok (`bloodType: null`, `traits: []`) —
 * bu yüzden künye şeridinde de yok. Uydurulmadı.
 * Rütbe, takım ve klan satırları serinin kendisinden geliyor; hiçbiri
 * AniList künyesine mal edilmedi.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada tırnak içinde YALNIZCA üç cümle var ve üçü de konuşanına
 * atfedilmiş: Üçüncü'nün Ateşin İradesi benzetmesi, Asuma'nın "kral"
 * dersi, Naruto'nun ninja yolu. Asuma'nın cümlesi yeğenine değil
 * öğrencisine söylendi — bu, zincirde açıkça yazıyor, gizlenmiyor.
 * Konohamaru'nun kendi halkasında tırnak YOK: emin olunmayan hiçbir
 * replik konmadı, o satır arşivin kendi cümlesi olarak duruyor.
 *
 * ── TEKNİK DOĞRULUĞU ─────────────────────────────────────────────────────
 * Katon: Hai Sekishō kartı bilerek "dedesinin imzası" diye yazıldı.
 * Konohamaru'nun devraldığı şey tek bir mühür dizisi değil, Sarutobi
 * hattının ateş doğası; kart bu ayrımı saklamıyor.
 */

export const KONOHAMARU_ID = 3889;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const KONOHAMARU_SITE_URL = "https://anilist.co/character/3889";

/**
 * Sergi görselleri — hepsi characterId 3889 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `konohamaru:` önekli (kurator modu şartı).
 */
export const KONOHAMARU_IMAGE_KEYS = {
  /** Hero: Konoha çatıları ve gökyüzü; figür küçük ve kenarda (16:9) */
  hero: "konohamaru:hero",
  name: "konohamaru:name",
  rasengan: "konohamaru:rasengan",
  katon: "konohamaru:katon",
  oiroke: "konohamaru:oiroke",
  keepBunshin: "konohamaru:kage-bunshin",
  keepNisei: "konohamaru:nisei",
  keepEbisu: "konohamaru:ebisu",
  keepScarf: "konohamaru:scarf",
  linkHiruzen: "konohamaru:link-hiruzen",
  linkAsuma: "konohamaru:link-asuma",
  linkNaruto: "konohamaru:link-naruto",
  linkSelf: "konohamaru:link-konohamaru",
  linkNext: "konohamaru:link-next",
  fateGrandfather: "konohamaru:fate-grandfather",
  fateFuneral: "konohamaru:fate-funeral",
  fateApprentice: "konohamaru:fate-apprentice",
  fateJonin: "konohamaru:fate-jonin",
  fateBoruto: "konohamaru:fate-boruto",
  closing: "konohamaru:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const KONOHAMARU_SLOT_LABELS: Record<string, LocalizedText> = {
  [KONOHAMARU_IMAGE_KEYS.hero]: {
    tr: "Hero — Konoha çatıları ve açık gökyüzü, figür küçük (16:9)",
    en: "Hero — Konoha rooftops and open sky, small figure (16:9)",
  },
  [KONOHAMARU_IMAGE_KEYS.name]: {
    tr: "Adın yükü — anıt taşı, tabela ya da ad yazısı",
    en: "The weight of a name — a monument, a sign, the written name",
  },
  [KONOHAMARU_IMAGE_KEYS.rasengan]: {
    tr: "Rasengan — Konohamaru'nun avucunda dönen küre",
    en: "Rasengan — the sphere spinning in Konohamaru's palm",
  },
  [KONOHAMARU_IMAGE_KEYS.katon]: {
    tr: "Sarutobi ateşi — Katon mührü ve kül",
    en: "The Sarutobi fire — a Katon seal and ash",
  },
  [KONOHAMARU_IMAGE_KEYS.oiroke]: {
    tr: "Oiroke no Jutsu — duman ve kahkaha",
    en: "Oiroke no Jutsu — smoke and laughter",
  },
  [KONOHAMARU_IMAGE_KEYS.keepBunshin]: {
    tr: "Kage Bunshin — çoğalan siluetler",
    en: "Kage Bunshin — multiplying silhouettes",
  },
  [KONOHAMARU_IMAGE_KEYS.keepNisei]: {
    tr: "Hokage hedefi — kayadaki yüzlere bakan çocuk",
    en: "The Hokage aim — a boy looking up at the stone faces",
  },
  [KONOHAMARU_IMAGE_KEYS.keepEbisu]: {
    tr: "Ebisu'nun dersi — özel öğretmen ve öğrencisi",
    en: "Ebisu's lesson — the private tutor and his student",
  },
  [KONOHAMARU_IMAGE_KEYS.keepScarf]: {
    tr: "Mavi atkı — rüzgârda arkada kalan uzun şerit",
    en: "The blue scarf — the long band trailing in the wind",
  },
  [KONOHAMARU_IMAGE_KEYS.linkHiruzen]: {
    tr: "Zincir · Üçüncü — dede ve torun",
    en: "Chain · the Third — grandfather and grandson",
  },
  [KONOHAMARU_IMAGE_KEYS.linkAsuma]: {
    tr: "Zincir · Asuma — amcanın sigarası",
    en: "Chain · Asuma — the uncle's cigarette",
  },
  [KONOHAMARU_IMAGE_KEYS.linkNaruto]: {
    tr: "Zincir · Naruto — usta ve çırak",
    en: "Chain · Naruto — master and apprentice",
  },
  [KONOHAMARU_IMAGE_KEYS.linkSelf]: {
    tr: "Zincir · Konohamaru — meşaleyi tutan el",
    en: "Chain · Konohamaru — the hand on the torch",
  },
  [KONOHAMARU_IMAGE_KEYS.linkNext]: {
    tr: "Zincir · boş halka — yalnızca doku ya da boşluk, yüz YOK",
    en: "Chain · the empty link — texture or emptiness only, no face",
  },
  [KONOHAMARU_IMAGE_KEYS.fateGrandfather]: {
    tr: "Dedeyle son günler — Hokage odası",
    en: "The last days with his grandfather — the Hokage's office",
  },
  [KONOHAMARU_IMAGE_KEYS.fateFuneral]: {
    tr: "Cenaze — yağmur ve beyaz çiçek",
    en: "The funeral — rain and a white flower",
  },
  [KONOHAMARU_IMAGE_KEYS.fateApprentice]: {
    tr: "Çıraklık — Rasengan çalışması",
    en: "Apprenticeship — training the Rasengan",
  },
  [KONOHAMARU_IMAGE_KEYS.fateJonin]: {
    tr: "Jōnin — yeni neslin Takım 7'si",
    en: "Jōnin — the new generation's Team 7",
  },
  [KONOHAMARU_IMAGE_KEYS.fateBoruto]: {
    tr: "Boruto'nun ustası — öğretmen ve öğrenci",
    en: "Boruto's teacher — the teacher and his student",
  },
  [KONOHAMARU_IMAGE_KEYS.closing]: {
    tr: "Kapanış — sönmeyen bir meşale ya da boş bir el",
    en: "Closing — a torch that will not go out, or an empty hand",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const KONOHAMARU_IDENTITY = {
  name: "Konohamaru Sarutobi",
  nativeName: "猿飛木ノ葉丸",
  /** Hero filigranı — dikey sütun, dekoratif (aria-hidden) */
  watermark: "木ノ葉丸",
  /** Varsayılan üst satır: kendi evi */
  house: { tr: "Sarutobi Klanı · Konoha", en: "Sarutobi Clan · Konoha" },
  /** Resmî modda aynı satırın yerine geçen unvan */
  title: {
    tr: "Üçüncü Hokage'nin torunu",
    en: "Grandson of the Third Hokage",
  },
  epigraph: {
    tr: "Ateş elden ele geçer. Bu sayfa, o ellerin sırasıdır.",
    en: "Fire moves from hand to hand. This page is the order of those hands.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "30 Aralık", en: "30 December" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "8-9 (I) · 11 (II)", en: "8-9 (I) · 11 (II)" },
    },
    {
      label: { tr: "Rütbe", en: "Rank" },
      value: {
        tr: "Akademi öğrencisi (I) → Genin (II) → Jōnin (Boruto)",
        en: "Academy student (I) → Genin (II) → Jōnin (Boruto)",
      },
    },
    {
      label: { tr: "Takım", en: "Team" },
      value: {
        tr: "Konohamaru Birliği — Udon, Moegi; ustaları Ebisu",
        en: "The Konohamaru Corps — Udon, Moegi; under Ebisu",
      },
    },
    {
      label: { tr: "Ev", en: "House" },
      value: {
        tr: "Sarutobi — Hiruzen'in torunu, Asuma'nın yeğeni",
        en: "Sarutobi — Hiruzen's grandson, Asuma's nephew",
      },
    },
    {
      label: { tr: "Devraldığı", en: "What he inherited" },
      value: {
        tr: "Sarutobi'nin ateşi, Naruto'nun Rasengan'ı",
        en: "The Sarutobi fire, Naruto's Rasengan",
      },
    },
    {
      label: { tr: "Yanından ayırmadığı", en: "What he never takes off" },
      value: { tr: "Uzun mavi atkı", en: "The long blue scarf" },
    },
    {
      label: { tr: "Adının anlamı", en: "What his name means" },
      value: {
        tr: "Köyün adı — 木ノ葉 (Konoha) + 丸 (maru)",
        en: "The village's name — 木ノ葉 (Konoha) + 丸 (maru)",
      },
    },
  ],
} as const;

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

export const KONOHAMARU_TORCH_TEXT = {
  enter: { tr: "Hokage'nin torunu", en: "The Hokage's grandson" },
  exit: { tr: "Adıyla oku", en: "Read him by his name" },
  hint: {
    tr: "Sayfa resmîleşti: unvanlar öne geçti, ışık meşaleye döndü, atkının mavisi soldu. Ona yıllarca böyle seslenildi.",
    en: "The page has gone official: titles first, the light turned to torchlight, the scarf's blue drained. This is how he was addressed for years.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const KONOHAMARU_HERO = {
  lede: {
    tr: "Sekiz yaşındaydı ve her gün dedesini devirmeye çalışıyordu. Peşinde olduğu şey aslında şapka değildi: kendi adıyla çağrılmaktı. Köyün adını taşıyordu, ama kimse ona o adla seslenmiyordu.",
    en: "He was eight, and every day he tried to knock his grandfather down. What he was after was never the hat: it was to be called by his own name. He carried the village's name, and no one used it.",
  },
  scarfCaption: {
    tr: "Uzun mavi atkı: koştuğunda arkada kalır, kadrajın dışına sarkar. Konohamaru'nun kimseden devralmadığı tek şey.",
    en: "The long blue scarf: it trails when he runs and slips out of the frame. The one thing he inherited from no one.",
  },
  portraitAlt: {
    tr: "Konohamaru Sarutobi — arşive yüklenmiş kadro portresi",
    en: "Konohamaru Sarutobi — cast portrait uploaded to the archive",
  },
  portraitAltFallback: {
    tr: "Konohamaru Sarutobi — AniList künye portresi",
    en: "Konohamaru Sarutobi — AniList profile portrait",
  },
} as const;

/**
 * Görsel alt metinleri — BRIEF §3.5: her alt iki dilli ve KAYNAĞINI söyler.
 * Zincirdeki ve çizelgedeki yüzlerin tamamı kendi veritabanımızdan geliyor
 * (PORTRAIT yuvası), bu yüzden tek bir son ek yetiyor.
 */
export const KONOHAMARU_ALT = {
  faceSuffix: {
    tr: "— arşive yüklenmiş kadro portresi",
    en: "— cast portrait uploaded to the archive",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const KONOHAMARU_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "Naruto Universe" },
} as const;

export const KONOHAMARU_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "The record" },
    lede: {
      tr: "AniList kaydı bu çocuk hakkında az şey söylüyor: bir doğum günü, iki yaş ve köyün adını taşıyan bir ad. Boy ve kan grubu satırı o kayıtta yok — bu yüzden burada da yok.",
      en: "The AniList entry says little about this boy: one birthday, two ages, and a name that belongs to the village. It carries no height or blood type — so neither does this record.",
    },
  },
  name: {
    title: { tr: "Adın yükü", en: "The weight of a name" },
    lede: {
      tr: "Bu sayfanın duygusal merkezi burası. Konohamaru bir köyün adını taşıyor; yıllarca o adla değil, dedesinin unvanıyla çağrıldı.",
      en: "This is the emotional centre of the page. Konohamaru carries a village's name, and for years he was called by his grandfather's title instead.",
    },
  },
  lab: {
    title: { tr: "Devraldıkları", en: "What he was handed" },
    lede: {
      tr: "Üç teknik, üç ayrı el. Konohamaru'nun elindeki hiçbir şey kendi icadı değil — ve sayfanın iddiası tam olarak bu: miras, kimden geldiği yazılırsa miras olur.",
      en: "Three techniques, three different hands. Nothing he holds is his own invention — and that is exactly the claim of this page: an inheritance only counts once you name who it came from.",
    },
  },
  keepsakes: {
    title: { tr: "Yanında taşıdıkları", en: "What he keeps beside them" },
    lede: {
      tr: "Büyük tekniklerin yanında dört küçük şey: biri teknik, biri hedef, biri öğretmen, biri kumaş.",
      en: "Beside the big techniques, four small things: a technique, an aim, a teacher, and a piece of cloth.",
    },
  },
  chain: {
    title: { tr: "Meşale zinciri", en: "The torch chain" },
    lede: {
      tr: "Zincir aşağıdan yukarı okunur: en altta Üçüncü, en üstte henüz yazılmamış halka. Bir halkaya bas, o elden ne devraldığı açılsın; ateş bir kademe yükselir ve sayfanın ışığı onunla birlikte çıkar.",
      en: "The chain reads from the bottom up: the Third at the base, the unwritten link at the top. Press a link to open what came from that hand; the fire climbs one step and the page's light rises with it.",
    },
  },
  fate: {
    title: { tr: "Ömrün beş durağı", en: "Five stations of a life" },
    lede: {
      tr: "Beş kayıt. İkisi cenaze değil ama ikisi de bir kaybın etrafında dönüyor; sonuncusunda Konohamaru zincirin öbür ucuna geçiyor.",
      en: "Five entries. Two of them are not funerals but both turn around a loss; in the last one he crosses to the other end of the chain.",
    },
  },
} as const;

/* ── Adın yükü — sayfanın duygusal merkezi ──────────────────────────────── */

/**
 * Ad, kanjileriyle birlikte parçalanıyor: 木ノ葉 (Konoha) + 丸 (maru).
 * İkinci parça çocuk adlarına, gemilere ve kılıçlara verilen ektir —
 * yani ad kelimenin tam anlamıyla "köyün adı + bir çocuk eki".
 */
export const KONOHAMARU_NAME_BLOCK = {
  glyphs: [
    {
      glyph: "木ノ葉",
      reading: "Konoha",
      gloss: {
        tr: "Yaprak. Köyün kendi adı; kayadaki yüzler de bu adın altında duruyor.",
        en: "Leaf. The village's own name; the faces in the cliff stand under it too.",
      },
    },
    {
      glyph: "丸",
      reading: "maru",
      gloss: {
        tr: "Çocuk adlarının sonuna gelen ek. Aynı ek gemilere ve kılıçlara da verilir: sahiplenilen şeylerin eki.",
        en: "The suffix at the end of a boy's name. Ships and swords carry it too: the suffix of things one claims.",
      },
    },
  ],
  namedBy: {
    tr: "Adı dedesi koydu. Bir armağandı, ama Konohamaru onu bir ödev gibi taşıdı: köyün adını taşıyan çocuk, köye borçlu doğar.",
    en: "His grandfather chose the name. It was a gift, and he carried it like an assignment: a boy who bears the village's name is born owing the village.",
  },
  addressedLabel: {
    tr: "Ona böyle seslenirlerdi",
    en: "This is how they addressed him",
  },
  addressed: [
    {
      phrase: { tr: "Üçüncü'nün torunu", en: "The Third's grandson" },
      by: { tr: "Köy", en: "The village" },
    },
    {
      phrase: { tr: "Onursal torun", en: "The honourable grandson" },
      by: { tr: "Ebisu — özel öğretmeni", en: "Ebisu — his private tutor" },
    },
    {
      phrase: { tr: "Hokage'nin çocuğu", en: "The Hokage's boy" },
      by: { tr: "Akademi", en: "The Academy" },
    },
  ],
  turnLabel: {
    tr: "Ona ilk kez adıyla seslenen",
    en: "The first one to use his name",
  },
  turnName: "Naruto Uzumaki",
  turnText: {
    tr: "Naruto onda ne torun ne de unvan gördü; sırtına vurup adını söyledi. Köyün en az saygı gören çocuğu, en fazla çekinilen çocuğa ilk kez insan gibi davranan kişi oldu. Konohamaru o günden sonra onun peşine takıldı — ve bir daha bırakmadı.",
    en: "Naruto saw neither a grandson nor a title; he clapped him on the back and said his name. The least respected boy in the village became the first person to treat the most deferred-to boy like a person. Konohamaru trailed after him from that day on, and never stopped.",
  },
  note: {
    tr: "Sayfanın geri kalanındaki her devir bu ana bağlı: teknik sonra geldi, ad önce.",
    en: "Every handover on this page hangs on that moment: the techniques came later, the name came first.",
  },
} as const;

/* ── Devraldıkları — üç büyük ───────────────────────────────────────────── */

export const KONOHAMARU_JUTSU = [
  {
    key: "rasengan",
    imageKey: KONOHAMARU_IMAGE_KEYS.rasengan,
    kanji: "螺旋丸",
    name: "Rasengan",
    from: { tr: "Naruto Uzumaki'den", en: "From Naruto Uzumaki" },
    turkish: { tr: "Spiral Küre", en: "Spiralling Sphere" },
    tagline: {
      tr: "Ustasının imzası, çırağının elinde: mühürsüz, tek avuçta toplanan çakra.",
      en: "The master's signature in the apprentice's hand: no seals, chakra gathered in a single palm.",
    },
    text: {
      tr: "Rasengan bir yetenek değil, bir sabır ölçüsüdür: çakrayı döndür, bir arada tut, elinde patlatma. Konohamaru bunu Naruto'dan öğrendi ve öğrendiğini köyün en kötü gününde gösterdi — Pain'in saldırısında yollardan birini bu küreyle devirdi. O gün köy ona ilk kez dedesinin torunu olarak değil, Naruto'nun çırağı olarak baktı.",
      en: "The Rasengan is not a talent but a measure of patience: spin the chakra, hold it together, and do not let it burst in your own hand. Konohamaru learned it from Naruto and showed what he had learned on the village's worst day — during Pain's assault he brought down one of the Paths with that sphere. That was the day the village first looked at him as Naruto's apprentice rather than the Third's grandson.",
    },
    footnote: {
      tr: "Küçük tesadüf, büyük denk düşme: 螺旋丸 de 木ノ葉丸 da aynı ekle bitiyor — 丸.",
      en: "A small coincidence that lands hard: 螺旋丸 and 木ノ葉丸 end with the same character — 丸.",
    },
    traits: [
      { tr: "El mührü yok", en: "No hand seals" },
      { tr: "Saf şekil dönüşümü", en: "Pure shape transformation" },
      { tr: "Ustadan çırağa", en: "Master to apprentice" },
    ],
  },
  {
    key: "katon",
    imageKey: KONOHAMARU_IMAGE_KEYS.katon,
    kanji: "火遁・灰積焼",
    name: "Katon: Hai Sekishō",
    from: { tr: "Sarutobi hattından", en: "From the Sarutobi line" },
    turkish: { tr: "Ateş Stili: Kül Yığını Yakma", en: "Fire Style: Ash Pile Burning" },
    tagline: {
      tr: "Dedesinin imzası: önce kül, sonra tek bir kıvılcım.",
      en: "His grandfather's signature: ash first, then a single spark.",
    },
    text: {
      tr: "Bu teknik Hiruzen'indir: ağızdan çıkan yoğun kül bulutu hedefi sarar, dişlerin arasındaki tek kıvılcım bulutu tutuşturur. Konohamaru'nun devraldığı şey bu mühür dizisi değil — Sarutobi evinin ateş doğası. Bu evde ateş bir teknik değil, bir soyadıdır: aynı doğa dönüşümü dedede, amcada ve torunda tekrarlanır.",
      en: "The technique belongs to Hiruzen: a dense cloud of ash leaves the mouth and wraps the target, then one spark struck between the teeth sets it alight. What Konohamaru inherited is not that sequence of seals but the fire nature of the Sarutobi house. Here fire is not a technique but a surname: the same nature repeats in the grandfather, the uncle and the grandson.",
    },
    traits: [
      { tr: "Sarutobi doğası", en: "The Sarutobi nature" },
      { tr: "Üçüncü'nün imzası", en: "The Third's signature" },
      { tr: "Kül önce gelir", en: "The ash comes first" },
    ],
  },
  {
    key: "oiroke",
    imageKey: KONOHAMARU_IMAGE_KEYS.oiroke,
    kanji: "お色気の術",
    name: "Oiroke no Jutsu",
    from: { tr: "Naruto Uzumaki'den — ilk devir", en: "From Naruto Uzumaki — the first handover" },
    turkish: { tr: "Cazibe Tekniği", en: "Sexy Technique" },
    tagline: {
      tr: "Mizah kartı; ama Naruto'dan devraldığı ilk şey buydu.",
      en: "The joke card — and yet the first thing Naruto ever handed him.",
    },
    text: {
      tr: "Sayfanın en ciddiyetsiz kutusu, sırayla bakıldığında en ciddi olanı: Konohamaru'nun bir yetişkinden öğrendiği ilk teknik bir savaş tekniği değil, bir şakaydı. Ondan önceki bütün dersler unvanına saygıdan yumuşatılmıştı; ilk kez biri ona ciddiye alınacak bir çocukmuş gibi davrandı ve saçma bir şey öğretti. Konohamaru sonra bunu kendi çeşitlemelerine dönüştürdü — devraldığı şeyin üstüne bir şey koyduğu ilk yer.",
      en: "The least serious box on this page is, read in order, the most serious one: the first technique he learned from an adult was not a combat jutsu but a joke. Every lesson before it had been softened out of deference to his title; here, for once, someone treated him as a boy worth taking seriously and taught him something ridiculous. He later turned it into variations of his own — the first place he added anything to what he was given.",
    },
    traits: [
      { tr: "İlk devir", en: "The first handover" },
      { tr: "Ciddiyetin tersi", en: "The opposite of deference" },
      { tr: "Üstüne koyduğu ilk şey", en: "The first thing he built on" },
    ],
  },
] as const;

/* ── Yanında taşıdıkları — dört küçük ───────────────────────────────────── */

export const KONOHAMARU_KEEPSAKES = [
  {
    key: "bunshin",
    imageKey: KONOHAMARU_IMAGE_KEYS.keepBunshin,
    name: { tr: "Kage Bunshin no Jutsu", en: "Kage Bunshin no Jutsu" },
    note: {
      tr: "Ustasının en çok kullandığı teknik, çırağının elinde Rasengan'ın ön şartı: küreyi tek başına toplamak zorsa, bir gölge yardım eder.",
      en: "His master's most-used technique becomes, in the apprentice's hands, the precondition for the Rasengan: if the sphere is hard to gather alone, a shadow lends a hand.",
    },
  },
  {
    key: "nisei",
    imageKey: KONOHAMARU_IMAGE_KEYS.keepNisei,
    name: {
      tr: "İkinci Uzumaki Naruto olma hedefi",
      en: "The aim to become the second Naruto Uzumaki",
    },
    note: {
      tr: "Hokage olmak istedi — ama dedesinin torunu olarak değil, ustasının izinden. Ölçüyü kendisi değiştirdi: aşılacak isim kayadaki yüz değil, önünde koşan çocuktu.",
      en: "He wanted the hat — not as his grandfather's grandson, but by his master's road. He changed the measure himself: the name to beat was not the face in the cliff but the boy running ahead of him.",
    },
  },
  {
    key: "ebisu",
    imageKey: KONOHAMARU_IMAGE_KEYS.keepEbisu,
    name: { tr: "Ebisu'nun özel eğitimi", en: "Ebisu's private tuition" },
    note: {
      tr: "Önce özel öğretmeni, sonra jōnin ustası. Ona tekniği elit bir program gibi öğretmeye çalıştı; Konohamaru'nun aradığı şeyse programın tam tersiydi. Yine de yıllarca yanında duran tek yetişkin oydu.",
      en: "First his private tutor, later his jōnin instructor. He tried to teach the boy like an elite curriculum; what the boy wanted was the opposite of a curriculum. He was still the one adult who stayed for years.",
    },
  },
  {
    key: "scarf",
    imageKey: KONOHAMARU_IMAGE_KEYS.keepScarf,
    name: { tr: "Mavi atkı", en: "The blue scarf" },
    note: {
      tr: "Boynundaki uzun mavi şerit; koştuğunda arkasında kalır ve onu her kalabalıkta görünür kılar. Sayfadaki tek eşya: kimseden devralmadı, kimseye devretmeyecek.",
      en: "The long blue band at his neck; it trails behind him when he runs and makes him visible in any crowd. The only object on this page he inherited from no one and will hand to no one.",
    },
  },
] as const;

/* ── Meşale zinciri — sayfanın kalbi ────────────────────────────────────── */

export const KONOHAMARU_CHAIN_UI = {
  listLabel: { tr: "Meşale zinciri — devir sırası", en: "The torch chain — the order of the relay" },
  ringWord: { tr: "halka", en: "link" },
  emptyRingLabel: { tr: "Boş halka — sonraki", en: "The empty link — next" },
  prev: { tr: "Önceki el", en: "Previous hand" },
  next: { tr: "Sonraki el", en: "Next hand" },
  keyboardHint: {
    tr: "Yukarı ve aşağı ok tuşları zincirde gezdirir; ateş her seferinde bir halka yükselir.",
    en: "The up and down arrows walk the chain; the fire climbs one link at a time.",
  },
  giftLabels: {
    name: { tr: "Devraldığı ad", en: "The name handed down" },
    technique: { tr: "Teknik", en: "Technique" },
    word: { tr: "Söz", en: "The word" },
    burden: { tr: "Yük", en: "The burden" },
  },
} as const;

/**
 * Zincirin bir halkası.
 *
 * `characterId` alanları `EXPERIENCE_COMPANIONS[3889]` listesiyle birebir
 * aynı: 7571 Hiruzen, 4775 Asuma, 17 Naruto. Dördüncü halka Konohamaru'nun
 * kendisi — orada yoldaş portresi değil, sayfanın kendi künye portresi
 * kullanılıyor (`ownPortrait`). Beşinci halka BOŞ: ne yüz var ne armağan,
 * yalnızca `empty` metni.
 *
 * `gifts.wordBy` varsa satır replik olarak çizilir (tırnak + kaynak);
 * yoksa düz metin kalır — emin olunmayan cümle tırnağa girmez.
 */
export interface KonohamaruRelayLink {
  key: string;
  imageKey: string;
  characterId: number | null;
  ownPortrait?: boolean;
  name: string;
  role: LocalizedText;
  rank: LocalizedText;
  lede: LocalizedText;
  gifts?: {
    name: LocalizedText;
    technique: LocalizedText;
    word: LocalizedText;
    wordBy?: LocalizedText;
    wordNote?: LocalizedText;
    burden: LocalizedText;
  };
  empty?: {
    title: LocalizedText;
    text: LocalizedText;
  };
}

export const KONOHAMARU_CHAIN: KonohamaruRelayLink[] = [
  {
    key: "hiruzen",
    imageKey: KONOHAMARU_IMAGE_KEYS.linkHiruzen,
    characterId: 7571,
    name: "Hiruzen Sarutobi",
    role: { tr: "Dede", en: "Grandfather" },
    rank: { tr: "Üçüncü Hokage", en: "Third Hokage" },
    lede: {
      tr: "Adı o koydu, ateşi o yaktı. Torununa bakan herkesin gözünde önce o vardı — çocuğun bütün derdi de buydu.",
      en: "He gave the name and he lit the fire. Everyone who looked at the grandson saw him first — and that was the whole of the boy's grievance.",
    },
    gifts: {
      name: {
        tr: "Konohamaru — bir köyün adı, bir çocuğa verildi",
        en: "Konohamaru — a village's name, handed to a child",
      },
      technique: {
        tr: "Sarutobi'nin ateşi; imzası Katon: Hai Sekishō",
        en: "The Sarutobi fire; his signature was Katon: Hai Sekishō",
      },
      word: {
        tr: "Yapraklar dans ettiğinde ateş yanar; ateşin gölgesi köyü aydınlatır ve yeni yapraklar filizlenir.",
        en: "When the leaves dance, fire is born; the fire's shadow lights the village, and new leaves bud again.",
      },
      wordBy: { tr: "Hiruzen Sarutobi", en: "Hiruzen Sarutobi" },
      wordNote: {
        tr: "Üçüncü'nün Ateşin İradesi'ni anlatırken kurduğu benzetme.",
        en: "The Third's own image for what he called the Will of Fire.",
      },
      burden: {
        tr: "Unvanın gölgesi: torun, adıyla değil dedesiyle anıldı.",
        en: "The shadow of a title: the grandson was known by his grandfather, never by his name.",
      },
    },
  },
  {
    key: "asuma",
    imageKey: KONOHAMARU_IMAGE_KEYS.linkAsuma,
    characterId: 4775,
    name: "Asuma Sarutobi",
    role: { tr: "Amca", en: "Uncle" },
    rank: { tr: "Jōnin · 10. Takım", en: "Jōnin · Team 10" },
    lede: {
      tr: "Aynı adı taşıyan ikinci el. Konohamaru'nun öğretmeni hiç olmadı; ona yalnızca bu adın neye mal olduğunu gösterdi.",
      en: "The second hand to carry the same name. He was never the boy's teacher; all he showed him was what the name costs.",
    },
    gifts: {
      name: {
        tr: "Sarutobi soyadı — ve o soyadın faturası",
        en: "The Sarutobi surname — and the bill that comes with it",
      },
      technique: {
        tr: "Ateşi evde tutan ikinci kuşak: Katon bu evde babadan öğrenilir",
        en: "The second generation keeping the fire at home: in this house Katon is learned from the father",
      },
      word: {
        tr: "Korunacak olan kral, köyün henüz doğmamış çocuklarıdır.",
        en: "The king to be protected is the village's unborn children.",
      },
      wordBy: { tr: "Asuma Sarutobi", en: "Asuma Sarutobi" },
      wordNote: {
        tr: "Bu dersi yeğenine değil öğrencisi Shikamaru'ya verdi; ama konuşan aynı ateşti.",
        en: "He taught this to his student Shikamaru, not to his nephew; but it was the same fire speaking.",
      },
      burden: {
        tr: "Ateş ikinci kez aldı: Konohamaru önce dedesini, birkaç yıl sonra amcasını gömdü.",
        en: "The fire took a second time: he buried his grandfather first, then a few years later his uncle.",
      },
    },
  },
  {
    key: "naruto",
    imageKey: KONOHAMARU_IMAGE_KEYS.linkNaruto,
    characterId: 17,
    name: "Naruto Uzumaki",
    role: { tr: "Usta", en: "Master" },
    rank: { tr: "Yedinci Hokage", en: "Seventh Hokage" },
    lede: {
      tr: "Zincirin kan bağı olmayan tek halkası — ve Konohamaru'nun kendi seçtiği tek el.",
      en: "The only link in the chain with no blood in it — and the only hand Konohamaru chose himself.",
    },
    gifts: {
      name: {
        tr: "Konohamaru — unvan değil, ad",
        en: "Konohamaru — a name, not a title",
      },
      technique: {
        tr: "Önce Oiroke no Jutsu, sonra Rasengan",
        en: "First Oiroke no Jutsu, then the Rasengan",
      },
      word: {
        tr: "Sözümden asla dönmem. Bu benim ninja yolum.",
        en: "I never go back on my word. That is my ninja way.",
      },
      wordBy: { tr: "Naruto Uzumaki", en: "Naruto Uzumaki" },
      burden: {
        tr: "Yeni ölçü: aşılacak isim artık kayadaki yüz değil, önünde koşan çocuk.",
        en: "A new measure: the name to beat is no longer the face in the cliff but the boy running ahead.",
      },
    },
  },
  {
    key: "konohamaru",
    imageKey: KONOHAMARU_IMAGE_KEYS.linkSelf,
    characterId: null,
    ownPortrait: true,
    name: "Konohamaru Sarutobi",
    role: { tr: "Ateşi şimdi taşıyan el", en: "The hand holding the fire now" },
    rank: { tr: "Jōnin · Takım 7'nin öğretmeni", en: "Jōnin · teacher of Team 7" },
    lede: {
      tr: "Zincirin ortasında duruyor: devraldı, sırası gelince devredecek. Sayfadaki tek halka hem alan hem veren.",
      en: "He stands in the middle of the chain: he received, and when his turn comes he will hand it on. The only link here that both takes and gives.",
    },
    gifts: {
      name: {
        tr: "Konohamaru-sensei — adının önüne ilk kez unvan değil, iş geldi",
        en: "Konohamaru-sensei — for once the word before his name is a job, not a title",
      },
      technique: {
        tr: "Rasengan, Kage Bunshin ve Sarutobi'nin ateşi — üçü de birinden kaldı",
        en: "Rasengan, Kage Bunshin and the Sarutobi fire — every one came from someone",
      },
      word: {
        tr: "Öğrencilerine dedesinin cümlesini değil, ustasının cümlesini öğretiyor.",
        en: "He teaches his students his master's sentence, not his grandfather's.",
      },
      burden: {
        tr: "Aynı yük, ters yönden: bu kez adıyla çağrılmayan çocuk onun öğrencisi.",
        en: "The same burden from the other side: this time the boy nobody calls by name is his student.",
      },
    },
  },
  {
    key: "next",
    imageKey: KONOHAMARU_IMAGE_KEYS.linkNext,
    characterId: null,
    name: "",
    role: { tr: "Sonraki", en: "Next" },
    rank: { tr: "Yazılmadı", en: "Unwritten" },
    lede: {
      tr: "Zincirin son halkası boş ve boş kalmayı sürdürüyor.",
      en: "The last link of the chain is empty, and stays empty.",
    },
    empty: {
      title: { tr: "Burası henüz yazılmadı.", en: "This one has not been written yet." },
      text: {
        tr: "Konohamaru'nun elindeki ateşin kime geçeceği belli değil: hangi çocuğun adı bir köyün adı olacak, kim ilk kez birinin adıyla seslenmesini bekleyecek, bilinmiyor. Arşiv bu halkayı kapatmıyor. Bu sayfa bir sonuç değil, sırası gelmemiş bir devir.",
        en: "Where the fire in his hands goes next is not settled: which child's name will be a village's name, who will be waiting for someone to use it for the first time — none of it is written. The archive leaves this link open. This page is not a conclusion; it is a handover whose turn has not come.",
      },
    },
  },
];

/* ── Ömrün beş durağı ───────────────────────────────────────────────────── */

/**
 * Çizelge satırı. `quote` ve `faceId` opsiyonel: beş kaydın yalnızca
 * birinde replik var, üçünde de o durağa ait bir yüz duruyor.
 */
export interface KonohamaruFateEntry {
  key: string;
  imageKey: string;
  faceId?: number;
  faceName?: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: LocalizedText };
}

export const KONOHAMARU_TIMELINE: KonohamaruFateEntry[] = [
  {
    key: "grandfather",
    imageKey: KONOHAMARU_IMAGE_KEYS.fateGrandfather,
    faceId: 7571,
    faceName: "Hiruzen Sarutobi",
    age: { tr: "8 yaş", en: "Age 8" },
    title: {
      tr: "Dedeyle son günler",
      en: "The last days with his grandfather",
    },
    text: {
      tr: "Hokage odasına her gün yeni bir tuzakla giriyordu: dedesini bir kez devirse unvan da tanınma da kendiliğinden gelecekti. Kimse ona vurmuyor, kimse onu yenmiyordu — herkes torunu koruyordu ve tam da bu yüzden hiç kimse onu görmüyordu. O günlerde köyün en gürültülü, en az sevilen çocuğuyla tanıştı ve ilk kez adıyla çağrıldı.",
      en: "He walked into the Hokage's office with a new trap every day: knock the old man down once, and both the hat and the recognition would follow. Nobody hit him, nobody beat him — everyone was protecting the grandson, and that was exactly why nobody saw him. In those same days he met the loudest, least-liked boy in the village, and heard his own name used for the first time.",
    },
  },
  {
    key: "funeral",
    imageKey: KONOHAMARU_IMAGE_KEYS.fateFuneral,
    age: { tr: "8 yaş — Chūnin sınavı", en: "Age 8 — the Chūnin exam" },
    title: { tr: "Dedenin ölümü", en: "His grandfather's death" },
    text: {
      tr: "Chūnin sınavının ortasında Orochimaru köye saldırdı. Üçüncü Hokage kendi öğrencisini durdurmak için bedelini bilerek bir mühür seçti ve o mühürden geri dönmedi. Konohamaru o gün yalnızca dedesini kaybetmedi: ona sürekli 'torun' diyen sesi de kaybetti. Unvan yerinde kaldı, unvanı taşıyan adam gitti.",
      en: "Orochimaru struck the village in the middle of the Chūnin exam. To stop his own student the Third chose a seal whose price he knew, and he did not come back from it. That day Konohamaru lost more than his grandfather: he lost the voice that kept calling him the grandson. The title stayed where it was; the man who carried it was gone.",
    },
  },
  {
    key: "apprentice",
    imageKey: KONOHAMARU_IMAGE_KEYS.fateApprentice,
    faceId: 17,
    faceName: "Naruto Uzumaki",
    age: { tr: "11 yaş", en: "Age 11" },
    title: { tr: "Naruto'nun çırağı", en: "Naruto's apprentice" },
    text: {
      tr: "Naruto köye döndüğünde Konohamaru onu bir teknikle karşıladı — kendi geliştirdiği bir çeşitlemeyle. Ustalık ilişkisi orada kuruldu ve Rasengan'la sürdü. Pain saldırısında Konohamaru o küreyi bir yolun üzerinde kullandı; köyün ona ilk kez torun olarak değil, birinin çırağı olarak baktığı gün oydu.",
      en: "When Naruto came back to the village, Konohamaru met him with a technique — a variation of his own. The apprenticeship began there and carried on into the Rasengan. During Pain's assault he used that sphere against one of the Paths; that was the day the village first looked at him not as a grandson but as somebody's apprentice.",
    },
  },
  {
    key: "jonin",
    imageKey: KONOHAMARU_IMAGE_KEYS.fateJonin,
    age: { tr: "Savaştan sonra", en: "After the war" },
    title: { tr: "Jōnin ve yeni Takım 7", en: "Jōnin, and a new Team 7" },
    text: {
      tr: "Dördüncü Büyük Şinobi Savaşı'ndan sonra rütbe rütbe yükseldi ve jōnin oldu. Boruto çağında yeni neslin Takım 7'si ona verildi: Boruto, Sarada, Mitsuki. Ebisu'nun on yıl önce durduğu yerde artık o duruyor — bu kez öğretmen tarafında.",
      en: "After the Fourth Great Shinobi War he climbed rank by rank and made jōnin. In the Boruto years the new generation's Team 7 was handed to him: Boruto, Sarada, Mitsuki. He now stands exactly where Ebisu stood a decade earlier — this time on the teacher's side.",
    },
  },
  {
    key: "boruto",
    imageKey: KONOHAMARU_IMAGE_KEYS.fateBoruto,
    faceId: 13,
    faceName: "Sasuke Uchiha",
    age: { tr: "Boruto çağı", en: "The Boruto years" },
    title: { tr: "Boruto'nun öğretmeni", en: "Boruto's teacher" },
    text: {
      tr: "Öğrencisi Hokage'nin oğlu. Ona da adıyla değil babasının unvanıyla sesleniyorlar ve Konohamaru bu cümleyi ezbere biliyor. Boruto ayrıca kendine ayrı bir usta buldu — Sasuke. Konohamaru öğrencisini bir başkasının eline verdi ve itiraz etmedi: zincirin doğası bu, hiçbir el ateşi sonuna kadar kendinde tutmuyor.",
      en: "His student is the Hokage's son. They call that boy by his father's title instead of his name too, and Konohamaru knows the sentence by heart. Boruto also found a separate master of his own — Sasuke. Konohamaru handed his student into someone else's care without protest: that is the nature of the chain, no hand keeps the fire to the end.",
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const KONOHAMARU_CLOSING = {
  quotes: [
    {
      text: {
        tr: "Yapraklar dans ettiğinde ateş yanar; ateşin gölgesi köyü aydınlatır ve yeni yapraklar filizlenir.",
        en: "When the leaves dance, fire is born; the fire's shadow lights the village, and new leaves bud again.",
      },
      by: { tr: "Hiruzen Sarutobi", en: "Hiruzen Sarutobi" },
      note: {
        tr: "Üçüncü'nün Ateşin İradesi'ni anlatma biçimi. Torununun adı da bu cümlenin ilk kelimesinden geliyor.",
        en: "The Third's way of explaining the Will of Fire. His grandson's name comes from the first word of that sentence.",
      },
    },
    {
      text: {
        tr: "Sözümden asla dönmem. Bu benim ninja yolum.",
        en: "I never go back on my word. That is my ninja way.",
      },
      by: { tr: "Naruto Uzumaki", en: "Naruto Uzumaki" },
      note: {
        tr: "Konohamaru'nun ustasından devraldığı ilk şey bir teknik değil, bu cümleydi.",
        en: "The first thing Konohamaru took from his master was not a technique but this sentence.",
      },
    },
  ],
  motto: "火の意志",
  mottoNote: {
    tr: "Hi no Ishi — “Ateşin İradesi”. Köyü bir arada tutan şeyin adı.",
    en: "Hi no Ishi — “the Will of Fire”. The name for whatever holds the village together.",
  },
  credit: {
    tr: "Künye verileri (doğum günü, yaş) ve sayfadaki portre AniList'ten alınmıştır; kayıtta boy ve kan grubu yok, bu yüzden künye şeridinde de yok. Atkı, düşen yapraklar, meşale halkaları ve zincirin ateşi bu sayfa için elle çizilmiş SVG'lerdir.",
    en: "The profile data (birthday, age) and the portrait come from AniList; that record carries no height or blood type, so neither does this one. The scarf, the falling leaves, the torch links and the fire on the chain are SVGs drawn by hand for this page.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList profile" },
} as const;
