import type { LocalizedText } from "./types";

/**
 * Orochimaru — "Deri Değiştirme" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 2455 kaydının ABILITY yuvaları,
 * `orochimaru:*` anahtarlarıyla. Görsel bağlı değilse bölüm görselsiz ama
 * AYAKTA çizilir; hiçbir bölüm yükleme bekleyerek çökmez.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * Orochimaru'nun ömrü yıllarla değil BEDENLERLE ölçülüyor. Sayfanın kalbi
 * üst üste binmiş beş deri: en üstteki en yeni beden, altındakiler bırakılmış
 * kabuklar. Bir deri seçilince üstündekiler baştan tutturulmuş bir menteşeden
 * GERİYE açılıyor (yılan derisini baştan çıkarır) ve o bedenin kaydı okunuyor.
 * İkinci yapısal fikir laboratuvar camı: beş deney tüpü, beş merak. Sayfanın
 * tezi tek cümle — onu tehlikeli yapan zulüm değil, hiçbir cevapta durmayan
 * merak.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (27 Ekim), boy (179,4 cm / 172 cm), kan grubu (B), yaş (50-51),
 * cinsiyet (ikili dışı), sınıf ve bağlılık satırları AniList künyesinden
 * birebir alındı (`anilist-detay-22.json`, karakter 2455, 24 Ağustos 2026).
 * Künyede İKİ boy yazması bir hata değil, bu sayfanın konusu: ölçülen beden
 * bir tane değil. Kilo AniList kaydında YOK, künye şeridinde de yok.
 *
 * ⚠️ AniList "Otagakure" yazıyor; köyün adı Otogakure (音隠れ, Ses). Özel adın
 * bariz yazım hatası düzeltildi, veri değiştirilmedi.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada üç replik var, üçü de Orochimaru'ya ait ve seride defalarca
 * tekrarlanan, kaynaklarda tutarlı aktarılan cümleler. Metinler arşivin
 * kendi Türkçesi/İngilizcesi — birebir dublaj tutanağı DEĞİL, bu yüzden
 * hiçbiri "şu bölümde şöyle dedi" diye numaralanmadı. Emin olunmayan hiçbir
 * cümle tırnak içine alınmadı; dövüşlerin ve dönemlerin ayrıntıları düz
 * anlatı olarak yazıldı.
 */

export const OROCHIMARU_ID = 2455;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const OROCHIMARU_SITE_URL = "https://anilist.co/character/2455";

/**
 * Sergi görselleri — hepsi characterId 2455 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `orochimaru:` önekli (kurator modu şartı).
 */
export const OROCHIMARU_IMAGE_KEYS = {
  /** Hero: sığınağın loş koridoru ya da kıvrılan yılan gövdesi (16:9) */
  hero: "orochimaru:hero",
  fushiTensei: "orochimaru:fushi-tensei",
  edoTensei: "orochimaru:edo-tensei",
  kusanagi: "orochimaru:kusanagi",
  curseMark: "orochimaru:curse-mark",
  seneiJashu: "orochimaru:senei-jashu",
  sannin: "orochimaru:sannin",
  hideout: "orochimaru:hideout",
  skinSelf: "orochimaru:skin-self",
  skinGenyumaru: "orochimaru:skin-genyumaru",
  skinSasuke: "orochimaru:skin-sasuke",
  skinKabuto: "orochimaru:skin-kabuto",
  skinReturn: "orochimaru:skin-return",
  fateChild: "orochimaru:fate-child",
  fateSannin: "orochimaru:fate-sannin",
  fateFlight: "orochimaru:fate-flight",
  fateSound: "orochimaru:fate-sound",
  fateWar: "orochimaru:fate-war",
  closing: "orochimaru:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const OROCHIMARU_SLOT_LABELS: Record<string, LocalizedText> = {
  [OROCHIMARU_IMAGE_KEYS.hero]: {
    tr: "Hero — sığınağın loş koridoru, figür küçük (16:9)",
    en: "Hero — the dim corridor of the hideout, small figure (16:9)",
  },
  [OROCHIMARU_IMAGE_KEYS.fushiTensei]: {
    tr: "Fushi Tensei — ruhun kaba geçtiği an",
    en: "Fushi Tensei — the moment the soul crosses into the vessel",
  },
  [OROCHIMARU_IMAGE_KEYS.edoTensei]: {
    tr: "Edo Tensei — topraktan kalkan tabutlar",
    en: "Edo Tensei — the coffins rising from the ground",
  },
  [OROCHIMARU_IMAGE_KEYS.kusanagi]: {
    tr: "Kusanagi ve Yamata — boğazdan çekilen kılıç, sekiz baş",
    en: "Kusanagi and Yamata — the blade from the throat, the eight heads",
  },
  [OROCHIMARU_IMAGE_KEYS.curseMark]: {
    tr: "Juin — boyna vurulan lanet mührü",
    en: "Juin — the cursed seal struck into the neck",
  },
  [OROCHIMARU_IMAGE_KEYS.seneiJashu]: {
    tr: "Sen'ei Jashu — koldan çıkan yılanlar",
    en: "Sen'ei Jashu — the snakes leaving the sleeve",
  },
  [OROCHIMARU_IMAGE_KEYS.sannin]: {
    tr: "Sannin — üç öğrenci, tek öğretmen",
    en: "The Sannin — three students, one teacher",
  },
  [OROCHIMARU_IMAGE_KEYS.hideout]: {
    tr: "Sığınak — numaralı kapılar, tanklar, koridor",
    en: "The hideout — numbered doors, tanks, a corridor",
  },
  [OROCHIMARU_IMAGE_KEYS.skinSelf]: {
    tr: "Birinci deri — Konoha yıllarındaki kendi bedeni",
    en: "First skin — his own body in the Konoha years",
  },
  [OROCHIMARU_IMAGE_KEYS.skinGenyumaru]: {
    tr: "İkinci deri — mühürlü kolların ardından giyilen beden",
    en: "Second skin — the body worn after the arms were sealed",
  },
  [OROCHIMARU_IMAGE_KEYS.skinSasuke]: {
    tr: "Üçüncü deri — hiç giyilemeyen beden, nakil anı",
    en: "Third skin — the body never worn, the transfer itself",
  },
  [OROCHIMARU_IMAGE_KEYS.skinKabuto]: {
    tr: "Dördüncü deri — Kabuto'nun içindeki kalıntı",
    en: "Fourth skin — the residue inside Kabuto",
  },
  [OROCHIMARU_IMAGE_KEYS.skinReturn]: {
    tr: "Beşinci deri — geri dönen kendi bedeni",
    en: "Fifth skin — his own body, returned",
  },
  [OROCHIMARU_IMAGE_KEYS.fateChild]: {
    tr: "Mezar başındaki beyaz yılan ve bıraktığı deri",
    en: "The white snake at the grave and the skin it left",
  },
  [OROCHIMARU_IMAGE_KEYS.fateSannin]: {
    tr: "Sannin unvanının verildiği savaş alanı",
    en: "The battlefield where the Sannin title was given",
  },
  [OROCHIMARU_IMAGE_KEYS.fateFlight]: {
    tr: "Açığa çıkan deney odası, köyden kaçış",
    en: "The exposed laboratory, the flight from the village",
  },
  [OROCHIMARU_IMAGE_KEYS.fateSound]: {
    tr: "Konoha'nın yıkımı — Üçüncü Hokage'nin son tekniği",
    en: "The Konoha Crush — the Third Hokage's last technique",
  },
  [OROCHIMARU_IMAGE_KEYS.fateWar]: {
    tr: "Dördüncü savaş — müttefik saflarda dört Hokage",
    en: "The Fourth War — four Hokage on the allied side",
  },
  [OROCHIMARU_IMAGE_KEYS.closing]: {
    tr: "Kapanış — boş bir deri ve sönmeyen iki göz",
    en: "Closing — an empty skin and two eyes that do not go out",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const OROCHIMARU_IDENTITY = {
  name: "Orochimaru",
  nativeName: "大蛇丸",
  /** Hero filigranı — dikey sütun, dekoratif (aria-hidden) */
  watermark: "大蛇丸",
  affiliation: { tr: "Otogakure · Sannin", en: "Otogakure · Sannin" },
  epigraph: {
    tr: "Onu tehlikeli yapan şey zulüm değildi. Meraktı — ve merakın durma noktası yok.",
    en: "It was never cruelty that made him dangerous. It was curiosity, and curiosity has no stopping point.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "27 Ekim", en: "27 October" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "179,4 cm → 172 cm", en: "179.4 cm → 172 cm" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "B", en: "B" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "50–51", en: "50–51" },
    },
    {
      label: { tr: "Cinsiyet", en: "Gender" },
      value: { tr: "İkili dışı", en: "Non-binary" },
    },
    {
      label: { tr: "Sınıf", en: "Classification" },
      value: {
        tr: "Sannin · Sage · S sınıfı · kaçak nin",
        en: "Sannin · Sage · S-rank · missing-nin",
      },
    },
    {
      label: { tr: "Bağlılık", en: "Affiliations" },
      value: {
        tr: "Konohagakure → Kök → Akatsuki → Otogakure",
        en: "Konohagakure → Root → Akatsuki → Otogakure",
      },
    },
    {
      label: { tr: "Yanında taşıdığı", en: "What he carries" },
      value: {
        tr: "Kusanagi no Tsurugi — boğazdan çekilen kılıç",
        en: "Kusanagi no Tsurugi — the blade drawn from the throat",
      },
    },
  ],
} as const;

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

export const OROCHIMARU_SERPENT_TEXT = {
  enter: { tr: "Yılan modu", en: "Serpent mode" },
  exit: { tr: "Yılanı geri çek", en: "Withdraw the serpent" },
  hint: {
    tr: "Sayfanın yüzeyine pullar çıkıyor, zemin soğuk yeşile kayıyor ve kenarlar kıvrılıyor.",
    en: "Scales rise to the surface of the page, the ground cools toward green and the edges curl.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const OROCHIMARU_HERO = {
  lede: {
    tr: "Ana babasının mezarı başında bir çocuk, beyaz bir yılanın derisini bırakıp gittiğini gördü. Deri boştu, yılan yaşıyordu. Sonraki elli yılı aynı numarayı bedenlerle denemekle geçti.",
    en: "At his parents' grave a child watched a white snake leave its skin behind and go on. The skin was empty; the snake was alive. He spent the next fifty years trying the same trick with bodies.",
  },
  eyesCaption: {
    tr: "Sayfadaki tek renk noktası: iki sarı göz. Beden değişiyor, bakış değişmiyor.",
    en: "The only point of colour on this page: two yellow eyes. The body changes; the gaze does not.",
  },
  portraitAlt: {
    tr: "Orochimaru — arşive yüklenmiş kadro portresi",
    en: "Orochimaru — cast portrait uploaded to the archive",
  },
  portraitAltFallback: {
    tr: "Orochimaru — AniList künye portresi",
    en: "Orochimaru — AniList profile portrait",
  },
} as const;

/**
 * Görsel alt metinleri — BRIEF §3.5: her alt iki dilli ve KAYNAĞINI söyler.
 * Yoldaş portrelerinin tamamı kendi veritabanımızdan geliyor (PORTRAIT
 * yuvası), bu yüzden tek bir son ek yetiyor.
 */
export const OROCHIMARU_ALT = {
  companionSuffix: {
    tr: "— arşive yüklenmiş kadro portresi",
    en: "— cast portrait uploaded to the archive",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const OROCHIMARU_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "Naruto Universe" },
} as const;

export const OROCHIMARU_SECTIONS = {
  record: {
    title: { tr: "Kayıt", en: "The record" },
    lede: {
      tr: "Künyede iki boy yazıyor. Yanlış girilmiş değil: ölçülen beden bir tane değil.",
      en: "The record lists two heights. It is not a mistake: the body being measured is not one body.",
    },
  },
  shelf: {
    title: { tr: "Raftaki beş merak", en: "Five curiosities on the shelf" },
    lede: {
      tr: "Sığınaklarında binlerce tüp vardı; hepsi beş sorunun ayrı ayrı denemesiydi. En dolusu ölümsüzlük, en boşu hakikat — ve onu durdurmayan da o boşluk.",
      en: "There were thousands of tubes in his hideouts, and every one of them was another attempt at five questions. The fullest is immortality; the emptiest is the truth — and it is that emptiness that never let him stop.",
    },
  },
  lab: {
    title: { tr: "Üç teknik, üç ihlal", en: "Three techniques, three transgressions" },
    lede: {
      tr: "Üçü de bir sınırı geçmek için yazıldı: biri ölümün, biri mezarın, biri insan biçiminin. Orochimaru'nun elindeki hiçbir teknik yalnızca dövüş tekniği değil.",
      en: "All three were written to cross a line: one crosses death, one the grave, one the human shape. Nothing in his hands is only a combat technique.",
    },
  },
  margin: {
    title: { tr: "Defterin kenarı", en: "The margin of the notebook" },
    lede: {
      tr: "Büyük çalışmaların yanında dört küçük kayıt: biri bir mühür, biri bir refleks, biri bir unvan, biri bir adres listesi.",
      en: "Beside the great works, four smaller entries: a seal, a reflex, a title, and a list of addresses.",
    },
  },
  shed: {
    title: { tr: "Dökülen deriler", en: "The skins he shed" },
    lede: {
      tr: "Beş beden, üst üste duruyor; en üstteki en yeni. Bir deri seç: üstündekiler baştan açılıp geriye devrilsin, altta kalan kayıt okunsun.",
      en: "Five bodies, stacked one on another, the newest on top. Choose a skin: the ones above it hinge open from the head and fall back, and the record beneath becomes readable.",
    },
  },
  fate: {
    title: { tr: "Beş dönemeç", en: "Five turns" },
    lede: {
      tr: "Bir mezar, bir unvan, bir kaçış, bir yıkım ve bir taraf değiştirme. Beşinin altında da aynı çocuk duruyor.",
      en: "A grave, a title, a flight, a ruin and a change of sides. The same child stands under all five.",
    },
  },
} as const;

/* ── Laboratuvar camı: beş merak ────────────────────────────────────────── */

/**
 * `level` tüpteki sıvının yüksekliği (0-100) — "bu meraktan ne kadarını
 * gerçekten ele geçirdi" demek, "ne kadar istiyor" değil. Sıralama bilinçli:
 * en dolu tüp ölümsüzlük, en boş tüp hakikat. Sayı hiçbir yerde YAZILMIYOR;
 * yalnızca camdaki seviyeyi belirliyor, çünkü kesin bir ölçüm iddiası
 * uydurma olurdu.
 */
export const OROCHIMARU_TUBES = [
  {
    key: "immortality" as const,
    level: 74,
    name: { tr: "Ölümsüzlük", en: "Immortality" },
    note: {
      tr: "Fushi Tensei ölümü yendi mi? Hayır — erteledi. Her üç yılda bir yeni bir kap gerekiyor, kap her seferinde biraz daha zor bulunuyor. Elde ettiği şey ölümsüzlük değil, kirası ödenen bir mühlet.",
      en: "Did Fushi Tensei defeat death? No — it postponed it. Every three years a new vessel is needed, and every time the vessel is harder to find. What he got is not immortality but a lease with rent due.",
    },
  },
  {
    key: "jutsu" as const,
    level: 56,
    name: { tr: "Bütün jutsular", en: "Every jutsu" },
    note: {
      tr: "Dünyadaki her tekniği öğrenmek istedi. Bir insan ömrünün buna yetmeyeceğini erken fark etti; ölümsüzlük saplantısı aslında bu isteğin faturasıydı. Öğrendikleri bir kütüphane doldurur, öğrenemedikleri iki kütüphane.",
      en: "He wanted to learn every technique in the world, and worked out early that one lifetime would not cover it; the obsession with immortality was really the invoice for this wish. What he learned would fill a library. What he did not would fill two.",
    },
  },
  {
    key: "kekkei" as const,
    level: 38,
    name: { tr: "Kekkei genkai", en: "Kekkei genkai" },
    note: {
      tr: "Kan yoluyla geçen yetenekler öğrenilemez, yalnızca doğuştan gelir. Orochimaru bunu bir kural olarak değil, bir kilit olarak gördü — ve kilidi insan denekler üzerinde açmaya çalıştı. Yamato o denemelerden sağ çıkan tek çocuktur.",
      en: "Bloodline abilities cannot be learned; they are only inherited. He read that not as a rule but as a lock, and tried to pick it on human subjects. Yamato is the only child who came out of those trials alive.",
    },
  },
  {
    key: "uchiha" as const,
    level: 16,
    name: { tr: "Uchiha", en: "The Uchiha" },
    note: {
      tr: "Sharingan'ı bir müttefikte değil, kendi göz çukurunda istedi. Itachi reddetti ve elini kesti; Sasuke üç yıl bekletildi ve nakil son anda ters döndü. Rafın en az dolan tüpü bu — ve en pahalıya mal olanı.",
      en: "He wanted the Sharingan not in an ally but in his own eye socket. Itachi refused and took his hand off; Sasuke was kept waiting three years and the transfer reversed at the last moment. This is the least full tube on the shelf, and the one that cost the most.",
    },
  },
  {
    key: "truth" as const,
    level: 8,
    name: { tr: "Hakikat", en: "The truth" },
    note: {
      tr: "Dördünün altında tek bir istek var: dünyanın nasıl işlediğini görmek. Bu tüp hiçbir zaman dolmadı, çünkü her cevap yeni bir soru bıraktı. Orochimaru'yu tehlikeli yapan hedefleri değil, hiçbir hedefte durmamasıdır.",
      en: "Under the other four lies a single wish: to see how the world works. This tube never filled, because every answer left a new question. What makes him dangerous is not his goals but that he never stops at one.",
    },
  },
] as const;

export const OROCHIMARU_SHELF_UI = {
  rackAlt: {
    tr: "Deney tüpü rafı şeması: beş cam tüp, her birinde farklı yükseklikte bir sıvı.",
    en: "Diagram of a test-tube rack: five glass tubes, each holding liquid at a different level.",
  },
} as const;

/* ── Üç teknik ──────────────────────────────────────────────────────────── */

export const OROCHIMARU_JUTSU = [
  {
    key: "fushiTensei" as const,
    imageKey: OROCHIMARU_IMAGE_KEYS.fushiTensei,
    kanji: "不死転生",
    name: "Fushi Tensei",
    turkish: { tr: "Ölümsüz Yeniden Doğuş", en: "Living Corpse Reincarnation" },
    tagline: {
      tr: "Ölümü yenmiyor, taşıyor: ruhu bir bedenden alıp bir başkasına geçiriyor.",
      en: "It does not beat death, it carries it: the soul is lifted out of one body and set down in another.",
    },
    text: {
      tr: "Tekniğin kendisi bir cinayet değil, bir taşınma. Orochimaru hedefin bedenine kendi ruhunu sürer; ev sahibi direnmezse beden onun olur, yetenekleriyle birlikte. Bedelin üç ayrı kalemi var: nakil üç yılda bir yapılabiliyor, kap uyumlu olmak zorunda ve devre dolmadan beden çürümeye başlıyor. Bu yüzden onun ömrü yıllarla değil bedenlerle ölçülür — bu sayfadaki çizelge de zaten o.",
      en: "The technique is not a murder but a move. He drives his own soul into the target's body; if the owner does not resist, the body becomes his, abilities included. The cost has three separate lines: the transfer works once every three years, the vessel has to be compatible, and the body starts to rot before the cycle is out. That is why his life is measured in bodies rather than years — and why the chart on this page is what it is.",
    },
    traits: [
      { tr: "Üç yılda bir", en: "Once every three years" },
      { tr: "Kap uyumu şart", en: "The vessel must match" },
      { tr: "Ölümü erteler", en: "Postpones death" },
    ],
  },
  {
    key: "edoTensei" as const,
    imageKey: OROCHIMARU_IMAGE_KEYS.edoTensei,
    kanji: "穢土転生",
    name: "Edo Tensei",
    turkish: { tr: "Kirli Toprak Yeniden Doğuşu", en: "Impure World Reincarnation" },
    tagline: {
      tr: "Yasak sınıf: ölüyü ölmeyen bir bedende geri çağırır ve bunun için canlı bir kurban ister.",
      en: "Forbidden rank: it calls the dead back in a body that cannot die, and it asks for a living sacrifice to do it.",
    },
    text: {
      tr: "Tekniği İkinci Hokage Tobirama Senju yazdı ve yasakladı; Orochimaru onu bulup tamamladı. Ölünün ruhu çağrılır, bir canlının bedeni kalıp olarak kullanılır ve ortaya yorulmayan, yaşlanmayan, ölmeyen bir asker çıkar. Aynı jutsu iki kez sahneye geldi ve iki kez farklı tarafta durdu: bir kere Konoha'nın çatısında iki Hokage'yi öğretmenlerine karşı çıkardı, bir kere savaşın ortasında dört Hokage'yi müttefik saflara getirdi. Teknik değişmedi, kullanan değişti.",
      en: "The Second Hokage, Tobirama Senju, wrote it and then banned it; Orochimaru found it and finished it. The soul of a dead person is summoned, a living body is used as the mould, and out comes a soldier who does not tire, age or die. The same jutsu came on stage twice and stood on a different side each time: once on a Konoha rooftop it set two Hokage against their own student, once in the middle of a war it brought four Hokage to the allied line. The technique did not change. The hand did.",
    },
    traits: [
      { tr: "Yasak sınıf (kinjutsu)", en: "Forbidden rank (kinjutsu)" },
      { tr: "Canlı bir kurban ister", en: "Requires a living sacrifice" },
      { tr: "İki kez, iki tarafta", en: "Twice, on two sides" },
    ],
  },
  {
    key: "kusanagi" as const,
    imageKey: OROCHIMARU_IMAGE_KEYS.kusanagi,
    kanji: "草薙の剣・八岐の術",
    name: "Kusanagi no Tsurugi · Yamata no Jutsu",
    turkish: { tr: "Kusanagi Kılıcı · Sekiz Başlı Yılan", en: "The Kusanagi Blade · Eight-Branched Serpent" },
    tagline: {
      tr: "Biri boğazından çıkan bir kılıç, diğeri gövdesinden çıkan sekiz baş. İkisi de tek bir cümlenin iki yarısı.",
      en: "One is a blade that comes out of his throat, the other eight heads that come out of his body. Both are halves of the same sentence.",
    },
    text: {
      tr: "Kusanagi mitolojiden ödünç alınmış bir addır: efsanede kılıç, sekiz başlı yılan Yamata no Orochi'nin kuyruğundan çıkar. Orochimaru ikisini birden üstlenmiş: hem kılıcı yutup ağzından çeken adam, hem de o kılıcın çıktığı yılan. Yamata no Jutsu ise devasa, sekiz başlı gövdenin kendisi — bir dönüşüm değil, asıl biçime dönüş. Sayfanın söylemek istediği fark burada: Orochimaru yılan besleyen bir insan değil, insan giymiş bir yılandır.",
      en: "Kusanagi is a name borrowed from myth: in the legend the blade comes out of the tail of Yamata no Orochi, the eight-headed serpent. He has taken on both halves — the man who swallows the sword and draws it from his mouth, and the snake the sword came out of. Yamata no Jutsu is that enormous eight-headed body itself: not a transformation but a return to the original shape. This is the distinction the page is after — he is not a man who keeps snakes, he is a snake wearing a man.",
    },
    traits: [
      { tr: "Boğazdan çekilen kılıç", en: "A blade drawn from the throat" },
      { tr: "Sekiz baş", en: "Eight heads" },
      { tr: "Mitolojiden ödünç", en: "Borrowed from myth" },
    ],
  },
] as const;

/* ── Defterin kenarı: dört küçük kayıt ──────────────────────────────────── */

/**
 * `companions` alanı yalnızca Sannin kaydında dolu: o kayıt zaten üç kişilik
 * bir kayıt, ikisinin portresi bizde var (Jiraiya 2423, Tsunade 2767).
 * Diğer üç kaydın portresi olmadığı için alan opsiyonel yazıldı — `as const`
 * bir birleşim tipi üretip opsiyonel alanı gizlediğinden satır tipi açıkça
 * tanımlandı.
 */
export interface OrochimaruMarginNote {
  key: string;
  imageKey: string;
  kanji?: string;
  name: LocalizedText;
  note: LocalizedText;
  companions?: { characterId: number; name: string }[];
}

export const OROCHIMARU_MARGIN: OrochimaruMarginNote[] = [
  {
    key: "curseMark",
    imageKey: OROCHIMARU_IMAGE_KEYS.curseMark,
    kanji: "呪印",
    name: { tr: "Juin — Lanet mührü", en: "Juin — the cursed seal" },
    note: {
      tr: "Boyna geçirilen bir ısırık, karşılığında ödünç güç. Mühür acıyı susturuyor, iradeyi faiz olarak istiyor. On kişiye vurulduğunda ondan yalnızca biri hayatta kalıyor — yani mühür bir armağan değil, açık uçlu bir kumar.",
      en: "A bite at the neck, and borrowed power in return. The seal quiets the pain and takes the will as interest. Struck into ten people, only one of them survives — which makes it not a gift but an open bet.",
    },
  },
  {
    key: "seneiJashu",
    imageKey: OROCHIMARU_IMAGE_KEYS.seneiJashu,
    kanji: "潜影蛇手",
    name: { tr: "Sen'ei Jashu — Yılan eli", en: "Sen'ei Jashu — the shadow snake hand" },
    note: {
      tr: "Kolun içinden çıkan yılanlar: tutar, sarar, zehirler, gerekirse ağızlarından kılıç uzatır. Orochimaru'nun dövüş dilbilgisi bu tek hamlenin çekimlerinden ibarettir; her şeyi ona ekleyerek kurar.",
      en: "Snakes out of the sleeve: they hold, coil, poison, and if needed pass a blade out of their mouths. His whole combat grammar is a set of conjugations of this one move; everything else is built on top of it.",
    },
  },
  {
    key: "sannin",
    imageKey: OROCHIMARU_IMAGE_KEYS.sannin,
    name: { tr: "Sannin unvanı", en: "The Sannin title" },
    note: {
      tr: "Unvanı düşman verdi: İkinci Büyük Şinobi Savaşı'nda Hanzō, öldüremediği üç genç için “efsanevi” dedi. Aynı öğretmenin üç öğrencisi üç ayrı yola çıktı — biri münzevi, biri şifacı, biri araştırmacı oldu. Üçünden yalnızca biri kendi ölümünü kabul etmedi.",
      en: "The title came from an enemy: in the Second Great Shinobi War, Hanzō called three young ninja he could not kill legendary. Three students of one teacher took three roads — one became a hermit, one a healer, one a researcher. Only one of the three refused to accept his own death.",
    },
    companions: [
      { characterId: 2423, name: "Jiraiya" },
      { characterId: 2767, name: "Tsunade" },
    ],
  },
  {
    key: "hideout",
    imageKey: OROCHIMARU_IMAGE_KEYS.hideout,
    name: { tr: "Sığınaklar", en: "The hideouts" },
    note: {
      tr: "Ülkelere dağılmış, birbirinin kopyası laboratuvarlar: aynı koridor, numaralı kapılar, aynı tanklar. Biri basılınca diğerine geçiliyor. Kabuto listeyi tutuyor; Orochimaru yalnızca hangi odada ne kaldığını hatırlıyor.",
      en: "Laboratories scattered across the countries, each a copy of the last: the same corridor, numbered doors, the same tanks. When one is raided he moves to the next. Kabuto keeps the list; Orochimaru only remembers what was left in which room.",
    },
  },
];

/* ── Dökülen deriler — sayfanın kalbi ───────────────────────────────────── */

export const OROCHIMARU_SHED_UI = {
  listLabel: { tr: "Dökülen deriler", en: "The skins he shed" },
  stackAlt: {
    tr: "Üst üste binmiş beş deri şeması: en üstteki en yeni beden, seçilen derinin üstündekiler baştan açılıp geriye devriliyor.",
    en: "Diagram of five stacked skins: the newest body on top; the skins above the selected one hinge open from the head and fall back.",
  },
  heldLabel: { tr: "Ne kadar dayandı", en: "How long it held" },
  shedLabel: { tr: "Neden bırakıldı", en: "Why it was shed" },
  witnessLabel: { tr: "Tanık", en: "Witness" },
  prev: { tr: "Üstteki deri", en: "The skin above" },
  next: { tr: "Alttaki deri", en: "The skin below" },
  newest: { tr: "En yeni", en: "Newest" },
  oldest: { tr: "En eski", en: "Oldest" },
  keyboardHint: {
    tr: "Yukarı ve aşağı ok tuşlarıyla da gezebilirsin; Home ile End listenin iki ucuna gider.",
    en: "The up and down arrow keys work too; Home and End jump to the two ends of the list.",
  },
} as const;

/**
 * Bir deri kaydı. `witness` opsiyonel — beşinci deriye kimse tanıklık etmedi,
 * onu ona kimse giydirmedi (`as const` opsiyonel alanı gizlediği için satır
 * tipi burada açıkça yazıldı).
 *
 * ⚠️ Sıra ESKİDEN YENİYE. Bileşen yığını ters çiziyor: dizinin son öğesi en
 * üstteki (en yeni) deri. Veri sırasını değiştirme, yığın buna bağlı.
 */
export interface OrochimaruSkin {
  key: string;
  imageKey: string;
  ordinal: LocalizedText;
  name: LocalizedText;
  held: LocalizedText;
  shed: LocalizedText;
  text: LocalizedText;
  witness?: { characterId: number; name: string; note: LocalizedText };
}

export const OROCHIMARU_SKINS: OrochimaruSkin[] = [
  {
    key: "self",
    imageKey: OROCHIMARU_IMAGE_KEYS.skinSelf,
    ordinal: { tr: "Birinci deri", en: "First skin" },
    name: { tr: "Kendi bedeni", en: "His own body" },
    held: {
      tr: "Doğumundan Konoha'nın yıkımına kadar — elli yıla yakın",
      en: "From birth to the Konoha Crush — close to fifty years",
    },
    shed: {
      tr: "Bırakılmadı, elinden alındı: Shiki Fūjin iki kolunu mühürledi ve jutsu yapamayan bir beden ona hiçbir işe yaramıyordu.",
      en: "It was not shed but taken: Shiki Fūjin sealed both his arms, and a body that cannot form a jutsu was no use to him.",
    },
    text: {
      tr: "Her şeyi öğrenen beden bu. Savaşta öksüz kaldı, Hiruzen Sarutobi'nin öğrencisi oldu, Sannin unvanını aldı, Hokage'lik için düşünüldü ve o koltuk başkasına verildi. Deneyler de bu bedenin elleriyle yapıldı. Sonunu yaşlılık değil, öğretmeninin son tekniği getirdi: Üçüncü Hokage öleceğini bilerek onun ruhunun kollarını çekip aldı. Beden hayatta kaldı, ama artık boş bir kabuktu.",
      en: "This is the body that learned everything. It was orphaned in the war, became Hiruzen Sarutobi's student, took the Sannin title, was considered for Hokage and watched the seat go to someone else. The experiments were done with these hands too. What ended it was not age but his teacher's last technique: knowing he would die for it, the Third Hokage pulled the soul out of its arms. The body survived — but it was a husk from then on.",
    },
    witness: {
      characterId: 7571,
      name: "Hiruzen Sarutobi",
      note: {
        tr: "Öğretmeni. Onu yıllar önce öldürebilecekken öldüremedi; sonunda yalnızca ellerini alabildi.",
        en: "His teacher. He could have killed him years earlier and did not; in the end he could only take the hands.",
      },
    },
  },
  {
    key: "genyumaru",
    imageKey: OROCHIMARU_IMAGE_KEYS.skinGenyumaru,
    ordinal: { tr: "İkinci deri", en: "Second skin" },
    name: { tr: "Gen'yūmaru", en: "Gen'yūmaru" },
    held: {
      tr: "Bir Fushi Tensei devri — üç yıla yakın",
      en: "One Fushi Tensei cycle — close to three years",
    },
    shed: {
      tr: "Devre doldu ve beden çürümeye başladı; Sasuke'nin olgunlaşmasını bekleyecek zaman kalmamıştı.",
      en: "The cycle ran out and the body began to rot; there was no time left to wait for Sasuke to ripen.",
    },
    text: {
      tr: "Mühürlü kolların ardından girdiği beden. Adı yalnızca anime kanadında geçiyor — manga bu bedene ad vermedi, bu yüzden bu satır bir dolgu bölümün kaydıdır ve öyle yazılmıştır. Bu deri Orochimaru'nun en sabırsız yıllarını taşıdı: Ses Köyü kuruldu, dört muhafız yetiştirildi, Sasuke sığınağa indi ve üç yıl boyunca beklendi. Sonuna doğru beden sargılarla ayakta duruyordu; her hareket bir sonraki naklin ne kadar yaklaştığını hatırlatıyordu.",
      en: "The body he entered after his arms were sealed. Its name appears only in the anime — the manga never named this body, so this entry is the record of a filler episode and is written as one. This skin carried his most impatient years: Otogakure was founded, four guards were raised, Sasuke came down into the hideout, and three years were spent waiting. Toward the end the body was held together with bandages, and every movement was a reminder of how close the next transfer had come.",
    },
    witness: {
      characterId: 2405,
      name: "Kabuto Yakushi",
      note: {
        tr: "Kapları o buluyor, bedeni o onarıyordu. Bu yıllarda Orochimaru'nun elinden çok Kabuto'nun elleri çalıştı.",
        en: "He found the vessels and patched up the body. In these years Kabuto's hands did more of the work than Orochimaru's.",
      },
    },
  },
  {
    key: "sasuke",
    imageKey: OROCHIMARU_IMAGE_KEYS.skinSasuke,
    ordinal: { tr: "Üçüncü deri", en: "Third skin" },
    name: {
      tr: "Sasuke — hiç giyilemeyen deri",
      en: "Sasuke — the skin never worn",
    },
    held: {
      tr: "Üç yıllık hazırlık, birkaç saniyelik nakil. Hiç giyilemedi.",
      en: "Three years of preparation, a few seconds of transfer. It was never worn.",
    },
    shed: {
      tr: "Bırakılmadı — geri itildi. Nakil başladığında Sasuke ruhu kendi zihninde karşıladı ve kap sahibini yuttu.",
      en: "It was not shed but pushed back. When the transfer began, Sasuke met the incoming soul inside his own mind, and the vessel swallowed its owner.",
    },
    text: {
      tr: "Bu deri bir bedenden çok bir plandı. Orochimaru'nun asıl istediği Sasuke değil, Sharingan'dı; Itachi'yi denemiş, karşılığında bir elini kaybetmişti. Sasuke'yi ormanda mühürledi, üç yıl besledi, eğitti ve olgunlaşmasını bekledi. Nakil günü geldiğinde çocuk hazırdı — ama beklendiği yönde değil. Yığındaki tek boş katman bu: sahibi hiç içine girmedi ve o günden sonra hesabın yönü değişti.",
      en: "This skin was less a body than a plan. What he wanted was not Sasuke but the Sharingan; he had tried it on Itachi and lost a hand for it. He sealed Sasuke in the forest, fed him for three years, trained him and waited for him to ripen. When the day came the boy was ready — just not in the expected direction. This is the one empty layer in the stack: its owner never got inside it, and from that day the arithmetic ran the other way.",
    },
    witness: {
      characterId: 13,
      name: "Sasuke Uchiha",
      note: {
        tr: "Üç yıl kap olarak hazırlandı ve nakli tersine çevirdi. Aynı çocuk yıllar sonra onu geri getirecekti.",
        en: "Prepared for three years as a vessel, he reversed the transfer instead. The same boy would bring him back years later.",
      },
    },
  },
  {
    key: "kabuto",
    imageKey: OROCHIMARU_IMAGE_KEYS.skinKabuto,
    ordinal: { tr: "Dördüncü deri", en: "Fourth skin" },
    name: {
      tr: "Kabuto'nun içindeki kalıntı",
      en: "The residue inside Kabuto",
    },
    held: {
      tr: "Sasuke'nin onu devirmesinden savaşın ortasına kadar — bir beden değil, birinin içindeki pay",
      en: "From the day Sasuke put him down to the middle of the war — not a body but a share of someone else's",
    },
    shed: {
      tr: "Sasuke, Anko'nun üzerindeki lanet mühründen onu geri çağırdı; kalıntı kabuğu bırakıp dışarı çıktı.",
      en: "Sasuke called him back out of the cursed seal on Anko's neck; the residue left the husk and stepped out.",
    },
    text: {
      tr: "Yığındaki en tuhaf katman: bir beden değil, bir başkasının hücrelerine karışmış bir artık. Kabuto, efendisinden geriye kalanı kendi bedenine kattı ve iki kimlik yıllarca aynı derinin içinde yaşadı. Orochimaru'nun bu dönemde ne eli vardı ne sesi — yalnızca bakışı. Kabuto'yu durduran şey de onun iradesi olmadı: Itachi'nin Izanami'si döngüyü kapattı, ve ancak ondan sonra kalıntı dışarı çıkarılabildi.",
      en: "The strangest layer in the stack: not a body but a remainder mixed into someone else's cells. Kabuto took what was left of his master into himself, and two identities lived inside the same skin for years. In this period Orochimaru had neither hand nor voice — only a gaze. What stopped Kabuto was not his master's will either: Itachi's Izanami closed the loop, and only after that could the residue be drawn out.",
    },
    witness: {
      characterId: 14,
      name: "Itachi Uchiha",
      note: {
        tr: "Bir kez elini kesip Akatsuki'den attı, bir kez de Izanami ile Kabuto'yu durdurdu. Orochimaru'nun iki büyük planını da aynı adam bozdu.",
        en: "Once he took his hand off and threw him out of Akatsuki; once Izanami stopped Kabuto. The same man broke both of his great plans.",
      },
    },
  },
  {
    key: "return",
    imageKey: OROCHIMARU_IMAGE_KEYS.skinReturn,
    ordinal: { tr: "Beşinci deri", en: "Fifth skin" },
    name: {
      tr: "Geri dönen kendi bedeni",
      en: "His own body, returned",
    },
    held: {
      tr: "Savaşın ortasından bugüne — hâlâ üstünde",
      en: "From the middle of the war to today — still on him",
    },
    shed: {
      tr: "Bırakılmadı. Yığının en üstünde duran en yeni deri, aynı zamanda en eskisi: daire kapandı.",
      en: "It has not been shed. The newest skin at the top of the stack is also the oldest one: the circle closed.",
    },
    text: {
      tr: "Sasuke onu geri getirdi ve Orochimaru doğduğu bedende uyandı. Savaşta müttefik saflarda durdu, Edo Tensei ile dört Hokage'yi cepheye taşıdı ve kimseyi yıkmaya çalışmadı. Savaştan sonra köyün gözetiminde çalışmayı kabul etti; laboratuvar hâlâ açık, kapılar artık numaralı değil. Bu sayfanın söylediği son şey de bu: merak hedefini kaybedince bitmiyor, yalnızca yön değiştiriyor. Yeni merakı bir çocuk oldu — Mitsuki.",
      en: "Sasuke brought him back, and Orochimaru woke in the body he was born in. In the war he stood on the allied side, carried four Hokage to the front with Edo Tensei, and tried to bring nothing down. Afterwards he agreed to work under the village's watch; the laboratory is still open, the doors are no longer numbered. That is the last thing this page has to say: curiosity does not end when it loses its target, it only turns. His new curiosity became a child — Mitsuki.",
    },
  },
];

/* ── Beş dönemeç ────────────────────────────────────────────────────────── */

/**
 * Çizelge satırı. `quote` opsiyonel — beş kaydın yalnızca birinde replik var.
 *
 * ⚠️ YAŞ ETİKETLERİ: AniList künyesi tek bir yaş veriyor (50-51) ve o da
 * bugünkü hâli. Geçmiş kayıtların yaşı kaynakta YOK, bu yüzden uydurulmadı:
 * dört satır dönem etiketi taşıyor, yalnızca sonuncusunda gerçek sayı var.
 */
export interface OrochimaruFateEntry {
  key: string;
  imageKey: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: LocalizedText };
}

export const OROCHIMARU_TIMELINE: OrochimaruFateEntry[] = [
  {
    key: "child",
    imageKey: OROCHIMARU_IMAGE_KEYS.fateChild,
    age: { tr: "Çocukluk", en: "Childhood" },
    title: { tr: "Mezar başındaki beyaz yılan", en: "The white snake at the grave" },
    text: {
      tr: "Ana babası savaşta öldü. Mezarlarının başında bir beyaz yılan gördü: hayvan derisini çıkarıp bırakmış, kendisi çekip gitmişti. Öğretmeni Hiruzen ona yılanların deri değiştirdiğini, her seferinde yeniden başladıklarını anlattı — bir teselli olsun diye. Çocuk teselli değil, bir yöntem duydu. Ölümsüzlük saplantısı o cümlenin üstüne kuruldu.",
      en: "His parents died in the war. At their grave he found a white snake: the animal had stepped out of its skin and left it there. His teacher Hiruzen told him that snakes shed and begin again each time — meant as consolation. The child did not hear consolation, he heard a method. The obsession with immortality was built on that one sentence.",
    },
  },
  {
    key: "sannin",
    imageKey: OROCHIMARU_IMAGE_KEYS.fateSannin,
    age: { tr: "Sannin yılları", en: "The Sannin years" },
    title: { tr: "Unvan geldi, koltuk gelmedi", en: "The title came, the seat did not" },
    text: {
      tr: "İkinci Büyük Şinobi Savaşı'nda Hanzō, karşısındaki üç genci öldüremeyince onlara “efsanevi üçlü” dedi. Orochimaru üçünün en yeteneklisi sayılıyordu ve Hokage'lik için ilk akla gelen isimdi. Hiruzen o görevi Minato Namikaze'ye verdi. Reddedilme onu köyden hemen koparmadı; ama o günden sonra köyün ona verebileceği hiçbir şey kalmamıştı.",
      en: "In the Second Great Shinobi War, Hanzō failed to kill the three young ninja in front of him and called them legendary. Orochimaru was considered the most gifted of the three and the obvious name for Hokage. Hiruzen gave the office to Minato Namikaze. The refusal did not tear him from the village at once — but from that day there was nothing left the village could offer him.",
    },
  },
  {
    key: "flight",
    imageKey: OROCHIMARU_IMAGE_KEYS.fateFlight,
    age: { tr: "Kaçış", en: "The flight" },
    title: { tr: "Deney odası açılıyor", en: "The laboratory is opened" },
    text: {
      tr: "Köyün altındaki odalar bulunduğunda içeride kaçırılmış çocuklar ve yarım kalmış nakiller vardı. Hiruzen onu bizzat yakaladı ve öldüremedi; Orochimaru gecenin içinde köyden çıktı. Akatsuki'ye girdi, orada Itachi Uchiha'nın bedenini istedi ve karşılığında bir elini kaybetti. Örgütten de ayrıldı: kimseyle çalışamıyordu, çünkü kimseyi kap olmaktan başka bir şey olarak görmüyordu.",
      en: "When the rooms under the village were found, they held abducted children and half-finished transfers. Hiruzen caught him himself and could not kill him; Orochimaru walked out into the night. He joined Akatsuki, asked there for Itachi Uchiha's body, and lost a hand for asking. Then he left that too: he could work with no one, because he saw no one as anything but a vessel.",
    },
  },
  {
    key: "sound",
    imageKey: OROCHIMARU_IMAGE_KEYS.fateSound,
    age: { tr: "Ses Köyü", en: "The Sound" },
    title: { tr: "Kendi köyü, öğretmeninin sonu", en: "His own village, his teacher's end" },
    text: {
      tr: "Otogakure'yi kurdu: bir köy değil, çalışan bir laboratuvar ağı. Chūnin sınavı sırasında Sasuke'ye lanet mührünü vurdu, sonra Konoha'ya saldırdı ve öğretmenini çatıda karşıladı. Hiruzen kazanamayacağını bilerek Shiki Fūjin'i çağırdı; kendi canı karşılığında öğrencisinin kollarını mühürledi. Orochimaru o gün köyü yıkamadı, öğretmenini kaybetti ve bedenini kullanamaz hâlde bıraktı.",
      en: "He founded Otogakure: not a village but a working network of laboratories. During the Chūnin exams he struck the cursed seal into Sasuke, then attacked Konoha and met his teacher on a rooftop. Knowing he could not win, Hiruzen called Shiki Fūjin and, at the cost of his own life, sealed his student's arms. That day Orochimaru failed to level the village, lost his teacher, and left with a body he could no longer use.",
    },
    quote: {
      text: {
        tr: "Neden mi? Çünkü köy oradaydı.",
        en: "Why? Because the village was there.",
      },
      by: { tr: "Orochimaru", en: "Orochimaru" },
    },
  },
  {
    key: "war",
    imageKey: OROCHIMARU_IMAGE_KEYS.fateWar,
    age: { tr: "50–51 yaş", en: "Age 50–51" },
    title: { tr: "Taraf değiştirme ve yeni bir merak", en: "A change of sides, and a new curiosity" },
    text: {
      tr: "Dördüncü Büyük Şinobi Savaşı'nın ortasında Sasuke onu geri çağırdı ve Orochimaru hiç beklenmedik bir yerde durdu: müttefik saflarda. Dört Hokage'yi Edo Tensei ile cepheye getirdi, savaşın kaderini o kadro değiştirdi. Savaştan sonra köy onu öldürmedi, gözetim altına aldı. Bugün hâlâ çalışıyor — ve laboratuvarından çıkan son şey bir silah değil, bir çocuk oldu: Mitsuki.",
      en: "In the middle of the Fourth Great Shinobi War, Sasuke called him back, and Orochimaru turned up somewhere nobody expected: on the allied line. He brought four Hokage to the front with Edo Tensei, and that roster changed the course of the war. Afterwards the village did not kill him; it put him under watch. He is still working — and the last thing to come out of his laboratory was not a weapon but a child: Mitsuki.",
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const OROCHIMARU_CLOSING = {
  quotes: [
    {
      text: {
        tr: "Sasuke bana kendi ayaklarıyla gelecek. Güç için.",
        en: "Sasuke will come to me on his own. For power.",
      },
      by: { tr: "Orochimaru", en: "Orochimaru" },
      note: {
        tr: "Ormanda mührü vurduktan sonra söylediği cümle. Üç yıl boyunca haklıydı; üçüncü yılın sonunda yanıldı.",
        en: "The line he left behind in the forest after striking the seal. For three years he was right; at the end of the third he was not.",
      },
    },
    {
      text: {
        tr: "Bu dünyadaki bütün jutsuları öğrenmek istiyorum.",
        en: "I want to learn every jutsu in this world.",
      },
      by: { tr: "Orochimaru", en: "Orochimaru" },
      note: {
        tr: "Ömrünün amacı bu tek cümle. Ölümsüzlük bile bir hedef değil, bu cümlenin faturasıydı.",
        en: "The whole purpose of his life is this one sentence. Even immortality was not a goal but the invoice for it.",
      },
    },
  ],
  motto: "脱皮",
  mottoNote: {
    tr: "dappi — deri değiştirme",
    en: "dappi — the shedding of the skin",
  },
  credit: {
    tr: "Künye verileri (doğum, boy, kan grubu, yaş, cinsiyet, sınıf, bağlılıklar) ve yedek portre AniList'ten alınmıştır. Sayfadaki tam boy portre arşivin kendi yüklemesidir; kıvrılan yılan gövdesi, sarı gözler, deney tüpleri ve dökülen deriler bu sayfa için elle çizilmiş SVG'lerdir.",
    en: "Profile data (birthday, height, blood type, age, gender, classification, affiliations) and the fallback portrait come from AniList. The full-size portrait is the archive's own upload; the coiling serpent, the yellow eyes, the test tubes and the shed skins are SVGs drawn by hand for this page.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList profile" },
} as const;
