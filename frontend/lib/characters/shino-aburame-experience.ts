import type { LocalizedText } from "./types";

/**
 * Shino Aburame — "Kovan" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 3428 kaydının ABILITY yuvaları,
 * `shino:*` anahtarlarıyla. Görsel bağlı değilse bölüm görselsiz ama
 * AYAKTA çizilir; hiçbir bölüm yükleme bekleyerek çökmez.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (23 Ocak), boy (161,1 cm / 175,1 cm), kan grubu (AB), yaş
 * (13 / 16) ve rütbe satırı AniList künyesinden birebir alındı
 * (`anilist-detay-22.json`, karakter 3428). Kilo AniList kaydında YOK, bu
 * yüzden künye şeridinde de yok. "Akademi öğretmenliği" AniList'in rütbe
 * satırında geçmiyor; ayrı bir satır olarak, sonraki görev diye yazıldı.
 *
 * ── REPLİK VE TERİM DİSİPLİNİ ────────────────────────────────────────────
 * Sayfada iki replik var ve ikisi de konuşanına atfedilmiş. İkincisi tek
 * bir sahnenin cümlesi değil, Shino'nun KONUŞMA ALIŞKANLIĞI — açıklamasına
 * hep bu kalıpla başlar; künyesi de bunu böyle söylüyor.
 *
 * Kanji yalnızca DOĞRULANABİLDİĞİ yerde kullanıldı: 油女シノ (AniList'in
 * ana dildeki adı), 蟲 (böceğin eski biçimi; Aburame tekniklerinin adında
 * geçen karakter) ve 巣 (yuva/kovan). Rinkaichū, Kidaichū gibi terimlerin
 * yazımı doğrulanamadığı için o adlar SADECE romanize yazıldı — uydurulmuş
 * bir kanji, uydurulmuş bir replik kadar kötüdür.
 */

export const SHINO_ID = 3428;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const SHINO_SITE_URL = "https://anilist.co/character/3428";

/**
 * Sergi görselleri — hepsi characterId 3428 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `shino:` önekli (kurator modu şartı).
 *
 * ⚠️ "Beni unutuyorlar" bölümünün yuvası YOK ve bu bilinçli: o bölümde
 * gösterilecek bir şey olmaması bölümün kendi konusu.
 */
export const SHINO_IMAGE_KEYS = {
  /** Hero: geniş, karanlık, dağılan böcek bulutu (16:9) */
  hero: "shino:hero",
  kikaichu: "shino:kikaichu",
  mushiKame: "shino:mushi-kame",
  rinkaichu: "shino:rinkaichu",
  toolTrace: "shino:tool-trace",
  toolMark: "shino:tool-mark",
  toolShell: "shino:tool-shell",
  toolPact: "shino:tool-pact",
  cellKikaichu: "shino:cell-kikaichu",
  cellKidaichu: "shino:cell-kidaichu",
  cellRinkaichu: "shino:cell-rinkaichu",
  cellNano: "shino:cell-nano",
  cellPair: "shino:cell-pair",
  cellBody: "shino:cell-body",
  fateBirth: "shino:fate-birth",
  fateTeam: "shino:fate-team",
  fateChunin: "shino:fate-chunin",
  fateReturn: "shino:fate-return",
  fateTeacher: "shino:fate-teacher",
  closing: "shino:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const SHINO_SLOT_LABELS: Record<string, LocalizedText> = {
  [SHINO_IMAGE_KEYS.hero]: {
    tr: "Hero — karanlık kadraj, dağılan böcek bulutu (16:9)",
    en: "Hero — dark frame, a dispersing cloud of insects (16:9)",
  },
  [SHINO_IMAGE_KEYS.kikaichu]: {
    tr: "Kikaichū — kolun yeninden çıkan böcek akışı",
    en: "Kikaichū — the stream of insects leaving his sleeve",
  },
  [SHINO_IMAGE_KEYS.mushiKame]: {
    tr: "Mushi Kame no Jutsu — hedefi saran böcek küresi",
    en: "Mushi Kame no Jutsu — the sphere of insects closing on a target",
  },
  [SHINO_IMAGE_KEYS.rinkaichu]: {
    tr: "Rinkaichū — gözle görülmeyen zehirli sürü",
    en: "Rinkaichū — the poison swarm too small to see",
  },
  [SHINO_IMAGE_KEYS.toolTrace]: {
    tr: "İz sürme — kokuyu takip eden erkek böcekler",
    en: "Tracking — the male insects following the scent",
  },
  [SHINO_IMAGE_KEYS.toolMark]: {
    tr: "İşaretleme — fark edilmeden bırakılan tek böcek",
    en: "Marking — a single insect left unnoticed",
  },
  [SHINO_IMAGE_KEYS.toolShell]: {
    tr: "Böcek kabuğu — darbeyi emen kolektif duvar",
    en: "Insect shell — the collective wall that absorbs the blow",
  },
  [SHINO_IMAGE_KEYS.toolPact]: {
    tr: "Aburame anlaşması — klanın yaka ve gözlük siluetleri",
    en: "The Aburame pact — the clan's collars and dark glasses",
  },
  [SHINO_IMAGE_KEYS.cellKikaichu]: {
    tr: "Hücre — Kikaichū sürüsü, yakın kadraj",
    en: "Cell — the Kikaichū swarm, close frame",
  },
  [SHINO_IMAGE_KEYS.cellKidaichu]: {
    tr: "Hücre — Kidaichū, iri gövdeli böcekler",
    en: "Cell — Kidaichū, the large-bodied insects",
  },
  [SHINO_IMAGE_KEYS.cellRinkaichu]: {
    tr: "Hücre — Rinkaichū, zehirli bulut",
    en: "Cell — Rinkaichū, the poison cloud",
  },
  [SHINO_IMAGE_KEYS.cellNano]: {
    tr: "Hücre — nano boyuttaki böcekler, mikroskobik ölçek",
    en: "Cell — the nano-scale insects, microscopic",
  },
  [SHINO_IMAGE_KEYS.cellPair]: {
    tr: "Hücre — dişi ve erkek böcek çifti",
    en: "Cell — the female and male insect pair",
  },
  [SHINO_IMAGE_KEYS.cellBody]: {
    tr: "Hücre — kovan olarak beden, silüet",
    en: "Cell — the body as hive, silhouette",
  },
  [SHINO_IMAGE_KEYS.fateBirth]: {
    tr: "Doğum — bebeğe yapılan yerleştirme",
    en: "Birth — the infusion performed on an infant",
  },
  [SHINO_IMAGE_KEYS.fateTeam]: {
    tr: "8. Takım — Kurenai, Hinata, Kiba ve Shino",
    en: "Team 8 — Kurenai, Hinata, Kiba and Shino",
  },
  [SHINO_IMAGE_KEYS.fateChunin]: {
    tr: "Chūnin sınavı — boş kalan arena",
    en: "Chūnin exam — the arena left empty",
  },
  [SHINO_IMAGE_KEYS.fateReturn]: {
    tr: "Naruto'nun dönüşü — tanınmayan yüz",
    en: "Naruto's return — the face that went unrecognised",
  },
  [SHINO_IMAGE_KEYS.fateTeacher]: {
    tr: "Akademi — sınıfın önündeki öğretmen",
    en: "The Academy — the teacher in front of the class",
  },
  [SHINO_IMAGE_KEYS.closing]: {
    tr: "Kapanış — dağılan ve geri dönen sürü",
    en: "Closing — the swarm that scatters and returns",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const SHINO_IDENTITY = {
  name: "Shino Aburame",
  nativeName: "油女シノ",
  /** Hero filigranı — klan adı, dekoratif (aria-hidden) */
  watermark: "油女",
  clan: { tr: "Aburame Klanı", en: "Aburame Clan" },
  epigraph: {
    tr: "Konuşmadığı için sessiz sanılıyor. Oysa içinde binlerce şey var ve hepsi onu dinliyor.",
    en: "He is taken for silent because he rarely speaks. Inside him there are thousands, and every one of them listens.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "23 Ocak", en: "23 January" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: {
        tr: "161,1 cm (I) · 175,1 cm (II)",
        en: "161.1 cm (I) · 175.1 cm (II)",
      },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "AB", en: "AB" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "13 (I) · 16 (II)", en: "13 (I) · 16 (II)" },
    },
    {
      label: { tr: "Rütbe", en: "Rank" },
      value: { tr: "Genin (I) → Chūnin (II)", en: "Genin (I) → Chūnin (II)" },
    },
    {
      label: { tr: "Sonraki görev", en: "Later post" },
      value: {
        tr: "Konoha Akademisi öğretmeni",
        en: "Instructor at the Konoha Academy",
      },
    },
    {
      label: { tr: "Takım", en: "Team" },
      value: {
        tr: "8. Takım — Kurenai, Hinata, Kiba",
        en: "Team 8 — Kurenai, Hinata, Kiba",
      },
    },
    {
      label: { tr: "Bedeninde taşıdığı", en: "What his body carries" },
      value: {
        tr: "Bir koloni — doğumdan beri",
        en: "A colony — since the day he was born",
      },
    },
  ],
} as const;

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

export const SHINO_HIVE_TEXT = {
  enter: { tr: "Kovan modu", en: "Hive mode" },
  exit: { tr: "Kovanı dağıt", en: "Disperse the hive" },
  hint: {
    tr: "Böcekler kenarlardan içeri yayılıyor, petek belirginleşiyor ve sayfanın rengi çekiliyor.",
    en: "The insects spread inward from the edges, the comb surfaces, and the colour drains out of the page.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const SHINO_HERO = {
  lede: {
    tr: "Aburame çocukları doğdukları gün bir anlaşmanın içine doğar: beden bir kovana açılır, karşılığında binlerce böcek o bedenin emrine girer. Shino bu anlaşmadan hiç şikâyet etmedi. Şikâyet ettiği tek şey, insanların adını unutmasıydı.",
    en: "An Aburame child is born into a bargain: the body is opened as a hive, and in return thousands of insects answer to it. Shino never complained about the bargain. The only thing he ever complained about was people forgetting his name.",
  },
  swarmCaption: {
    tr: "Arkasındaki noktaların her biri ayrı bir canlı. Hepsi tek bir kişiyi bekliyor.",
    en: "Every dot behind him is a separate living thing. All of them are waiting on one person.",
  },
  portraitAlt: {
    tr: "Shino Aburame — arşive yüklenmiş kadro portresi; yüzünün alt yarısı yakasında, üst yarısı gözlüğünde kayıp",
    en: "Shino Aburame — cast portrait uploaded to the archive; the lower half of his face lost in his collar, the upper half behind dark glasses",
  },
  portraitAltFallback: {
    tr: "Shino Aburame — AniList künye portresi",
    en: "Shino Aburame — AniList profile portrait",
  },
} as const;

/**
 * Görsel alt metinleri — BRIEF §3.5: her alt iki dilli ve KAYNAĞINI söyler.
 * Takım portrelerinin tamamı kendi veritabanımızdan geliyor (PORTRAIT
 * yuvası), bu yüzden tek bir son ek yetiyor.
 */
export const SHINO_ALT = {
  faceSuffix: {
    tr: "— arşive yüklenmiş kadro portresi",
    en: "— cast portrait uploaded to the archive",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const SHINO_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "Naruto Universe" },
} as const;

export const SHINO_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "The record" },
    lede: {
      tr: "İki ölçü arasında üç yıl var: bir çocuk büyüdü. Aradaki her şey aynı kaldı.",
      en: "Three years separate the two measurements: a boy grew up. Everything between them stayed the same.",
    },
  },
  team: {
    title: { tr: "8. Takım, bir de fazladan biri", en: "Team 8, and one more" },
    lede: {
      tr: "Shino'nun çevresi hiç kalabalık olmadı. Bu dört kişi, adını bilen dört kişiydi.",
      en: "His circle was never crowded. These four are the four who knew his name.",
    },
  },
  jutsu: {
    title: { tr: "Kovandan çıkan üç şey", en: "Three things the hive puts out" },
    lede: {
      tr: "Aburame tekniklerinin hiçbiri el mührüyle başlamaz. Hepsi bir emirle başlar ve emri alan şey Shino'nun kendi bedeninde yaşar.",
      en: "No Aburame technique begins with a hand seal. Each one begins with an order, and the thing that receives it lives inside his own body.",
    },
  },
  tools: {
    title: { tr: "Kovanın dört sessiz işi", en: "Four quiet jobs of the hive" },
    lede: {
      tr: "Bunların hiçbiri bir dövüşü bitirmez. Dördü de dövüş başlamadan önce yapılır.",
      en: "None of these ends a fight. All four happen before one begins.",
    },
  },
  comb: {
    title: { tr: "Petek", en: "The comb" },
    lede: {
      tr: "Altı hücre, altı ayrı tür ve altı ayrı iş. Bir hücreye dokun: komşuları da kımıldar, çünkü kovanda hiçbir hücre tek başına uyanmaz.",
      en: "Six cells, six breeds, six kinds of work. Touch one and its neighbours stir too, because nothing in a hive ever wakes alone.",
    },
  },
  forgotten: {
    title: { tr: "Beni unutuyorlar", en: "They keep forgetting me" },
    lede: {
      tr: "Shino'nun en çok gülünen tarafı aslında en hazin tarafı. Aşağıdaki dört kayıtta da adı anılmıyor; dördünde de geri dönüyor.",
      en: "The thing people laugh at most about him is the saddest thing about him. In each of the four entries below his name goes unsaid; in each of them he comes back anyway.",
    },
  },
  fate: {
    title: { tr: "Ömür çizelgesi", en: "A life in five entries" },
    lede: {
      tr: "Beş kayıt. Biri doğum, biri iptal edilmiş bir maç, biri tanınmamak — sonuncusu adları öğreten bir iş.",
      en: "Five entries. One is a birth, one is a cancelled match, one is going unrecognised — and the last is a job that consists of learning names.",
    },
  },
} as const;

/* ── 8. Takım (yoldaş portreleri) ───────────────────────────────────────── */

/**
 * `characterId` alanları `EXPERIENCE_COMPANIONS[3428]` listesiyle birebir
 * aynı: 1555 Hinata, 3495 Kiba, 4773 Kurenai, 17 Naruto. Portre kaydı
 * olmayan kişi adıyla çizilir, bölüm çökmez.
 */
export const SHINO_TEAM = [
  {
    characterId: 4773,
    name: "Kurenai Yūhi",
    role: { tr: "Takımı kuran", en: "The one who formed the team" },
    note: {
      tr: "8. Takımı takip ve keşif üstüne kurdu. Üç öğrencisinden ikisi burnuyla, biri gözüyle arıyordu; Shino ise bulduğunu hiç kaybetmiyordu.",
      en: "She built Team 8 around tracking and reconnaissance. Two of her students searched with a nose and an eye; Shino simply never lost what he had once found.",
    },
  },
  {
    characterId: 1555,
    name: "Hinata Hyūga",
    role: { tr: "Sessiz olan diğer kişi", en: "The other quiet one" },
    note: {
      tr: "Takımın öbür suskunu. İkisi de kendini anlatmakta zorlanır; aralarında hiç açıklama gerekmedi.",
      en: "The team's other silence. Neither of them is good at explaining themselves, and between the two of them no explanation was ever needed.",
    },
  },
  {
    characterId: 3495,
    name: "Kiba Inuzuka",
    role: { tr: "Yüksek sesli olan", en: "The loud one" },
    note: {
      tr: "Shino'yla sürekli atışır, sözünü keser, adını unutur. Buna rağmen tehlike anında sırtını dayadığı ilk kişi odur.",
      en: "He bickers with Shino, cuts him off, forgets he is there. He is also the first person Shino puts his back against when something goes wrong.",
    },
  },
  {
    characterId: 17,
    name: "Naruto Uzumaki",
    role: { tr: "Onu fark etmeyen", en: "The one who did not notice" },
    note: {
      tr: "İki buçuk yıl sonra köye döndüğünde Shino'yu tanımadı. Shino bunu açıkça söyledi — sonra aynı savaşta onun yanında durdu.",
      en: "When he came back to the village after two and a half years he did not recognise Shino. Shino said so out loud — and then stood beside him in the same war.",
    },
  },
] as const;

/* ── Kovandan çıkan üç şey ──────────────────────────────────────────────── */

export const SHINO_JUTSU = [
  {
    key: "kikaichu" as const,
    name: "Kikaichū",
    turkish: { tr: "Asalak Yıkım Böcekleri", en: "Parasitic Destruction Insects" },
    tagline: {
      tr: "Klanın anlaşması: beden yem olur, koloni asker olur.",
      en: "The clan's bargain: the body becomes feed, the colony becomes soldiers.",
    },
    text: {
      tr: "Bu böcekler chakra ile beslenir ve doğduğu gün Shino'nun bedenine yerleştirilir. Kalacak yer ve yiyecek karşılığında emir alırlar: hedefe geçerler, temas ettikleri anda chakrayı emmeye başlarlar ve düşman farkına vardığında elinde kalan şey yalnızca yorgunluktur. Sürünün maliyeti de aynı yerden çıkar — Shino'nun kendi chakrası. Kovan büyüdükçe ev sahibi zayıflar; bu yüzden Aburame'ler asla gereğinden fazla salmaz.",
      en: "These insects feed on chakra, and they are placed inside Shino's body on the day he is born. In exchange for shelter and food they take orders: they cross to the target, begin draining on contact, and by the time the opponent notices, all that is left to him is exhaustion. The swarm's cost comes from the same account — Shino's own chakra. The larger the hive, the weaker the host, which is why an Aburame never releases more than the job needs.",
    },
    traits: [
      { tr: "Chakra ile beslenir", en: "Feeds on chakra" },
      { tr: "Temasla emer", en: "Drains on contact" },
      { tr: "Bedeli ev sahibinden", en: "Billed to the host" },
    ],
  },
  {
    key: "mushiKame" as const,
    name: "Mushi Kame no Jutsu",
    kanji: "蟲甕の術",
    turkish: { tr: "Böcek Küpü", en: "Insect Jar Technique" },
    tagline: {
      tr: "Bir kavanoz kapanır: içerideki kişi ne görür ne de kaçar.",
      en: "A jar closes: the one inside can neither see out nor leave.",
    },
    text: {
      tr: "Koloni hedefin çevresinde toplanıp kapalı bir küre kurar. İçeride ışık yok, yön yok, boşluk yok; dışarıdan bakan biri yalnızca uğuldayan koyu bir küre görür. Teknik bir darbe değil bir kaptır: kavgayı bitirmez, kavganın devam edip etmeyeceğine Shino'nun karar vermesini sağlar. Aburame'lerin dövüş anlayışı da tam olarak budur — kazanmak değil, karşı tarafın seçeneklerini teker teker kapatmak.",
      en: "The colony gathers around the target and closes into a sealed sphere. Inside there is no light, no direction, no room; from outside all anyone sees is a dark humming ball. The technique is a container, not a blow: it does not end the fight, it hands Shino the decision of whether the fight continues. That is the whole Aburame idea of combat — not winning, but closing the other side's options one by one.",
    },
    traits: [
      { tr: "Kuşatır, vurmaz", en: "Encloses, does not strike" },
      { tr: "Görüşü keser", en: "Cuts off sight" },
      { tr: "Kararı Shino'ya bırakır", en: "Leaves the decision to Shino" },
    ],
  },
  {
    key: "rinkaichu" as const,
    name: "Rinkaichū",
    turkish: { tr: "Zehirli Sürü", en: "The Poison Swarm" },
    tagline: {
      tr: "Görülmeyecek kadar küçük, durdurulamayacak kadar çok.",
      en: "Too small to see, too many to stop.",
    },
    text: {
      tr: "İkinci bir tür: Kikaichū'dan çok daha küçük, chakra yerine zehir taşıyan böcekler. Bulut hâlinde salındığında gözle seçilmez; solunan havayla birlikte içeri girer ve chakra dolaşımını içeriden bozar. Shino bu sürüyü nadiren kullanır ve bu tercih tekniğin gücüyle değil karakteriyle ilgilidir: görünmeyen bir zehir, karşı tarafa savunma şansı bırakmaz — Shino ise rakibine her zaman bir kapı bırakmayı yeğler.",
      en: "A second breed: far smaller than the Kikaichū, carrying poison instead of feeding on chakra. Released as a cloud it cannot be picked out by eye; it enters with the air being breathed and ruins the flow of chakra from within. Shino uses this swarm rarely, and the restraint is about character rather than power: an invisible poison leaves the other side no defence, and he prefers to leave an opponent a door.",
    },
    traits: [
      { tr: "Gözle görülmez", en: "Invisible to the eye" },
      { tr: "İçeriden bozar", en: "Ruins from within" },
      { tr: "Nadiren salınır", en: "Rarely released" },
    ],
  },
] as const;

/* ── Kovanın dört sessiz işi ────────────────────────────────────────────── */

export const SHINO_TOOLS = [
  {
    key: "trace" as const,
    imageKey: SHINO_IMAGE_KEYS.toolTrace,
    name: { tr: "İz sürme", en: "Tracking" },
    note: {
      tr: "Dişi böcek hedefe bir koku bırakır, erkekler o kokuyu kilometrelerce takip eder. Shino'nun takip yöntemi burnu değil, sabrıdır: işaret bir kez konduktan sonra hedefin nereye gittiği artık bir bilgi meselesidir.",
      en: "A female insect leaves a scent on the target and the males follow it for kilometres. His tracking is not a matter of a nose but of patience: once the mark is set, where the target goes becomes a question of information rather than pursuit.",
    },
  },
  {
    key: "mark" as const,
    imageKey: SHINO_IMAGE_KEYS.toolMark,
    name: { tr: "Fark edilmeyen böcek", en: "The insect nobody notices" },
    note: {
      tr: "Bir tokalaşma, bir omuz teması, kısa bir çarpışma — tek bir böcek bırakmak için yeterli. Shino'yla karşılaşmış birçok kişi, o karşılaşmanın asıl sonucunun ne olduğunu hiç öğrenmedi.",
      en: "A handshake, a shoulder brushing past, a brief exchange of blows — enough to leave a single insect behind. Plenty of people who met him never learned what that meeting had actually accomplished.",
    },
  },
  {
    key: "shell" as const,
    imageKey: SHINO_IMAGE_KEYS.toolShell,
    name: { tr: "Kolektif kabuk", en: "The collective shell" },
    note: {
      tr: "Koloni Shino'nun önünde toplanıp bir duvara dönüşür; gelen darbeyi tek bir beden değil binlerce beden paylaşır. Savunma burada bir kalkan değil, bir aritmetik: yük yeterince çok parçaya bölünürse hiçbir parça kırılmaz.",
      en: "The colony gathers in front of him and becomes a wall; the incoming blow is shared not by one body but by thousands. The defence is not a shield but an arithmetic: split the load into enough pieces and no single piece breaks.",
    },
  },
  {
    key: "pact" as const,
    imageKey: SHINO_IMAGE_KEYS.toolPact,
    name: { tr: "Aburame anlaşması", en: "The Aburame pact" },
    note: {
      tr: "Yüksek yaka ve koyu gözlük klanın modası değil, sözleşmenin şartı: böceklerin giriş çıkışı görünmemeli, gözler okunmamalı. Aburame'ler kapalı giyinir çünkü bedenleri onlara ait olan tek şey değildir.",
      en: "The high collar and the dark glasses are not the clan's fashion but a term of the contract: the insects' comings and goings must not be seen, and the eyes must not be read. The Aburame dress closed because their bodies are not the only thing living in them.",
    },
  },
] as const;

/* ── Petek — sayfanın kalbi ─────────────────────────────────────────────── */

export const SHINO_COMB_UI = {
  listLabel: { tr: "Peteğin hücreleri", en: "Cells of the comb" },
  cellWord: { tr: "hücre", en: "cell" },
  /** Petek çekirdeğindeki kanji — 巣 (su): yuva, kovan */
  coreGlyph: "巣",
  coreLabel: { tr: "Kovan", en: "Hive" },
  prev: { tr: "Önceki hücre", en: "Previous cell" },
  next: { tr: "Sonraki hücre", en: "Next cell" },
  useLabel: { tr: "Ne işe yarar", en: "What it does" },
  keyboardHint: {
    tr: "Ok tuşlarıyla petekte dönebilirsin; halka olduğu için son hücreden sonra ilk hücre gelir.",
    en: "The arrow keys walk you around the comb; it is a ring, so the last cell is followed by the first.",
  },
  combAlt: {
    tr: "Altıgen petek şeması: ortada kovan çekirdeği, çevresinde altı hücre. Seçilen hücreden komşularına doğru bir uyanma dalgası yayılıyor.",
    en: "Hexagonal comb diagram: the hive core at the centre with six cells around it. A wave of waking spreads from the selected cell to its neighbours.",
  },
} as const;

/**
 * Altı hücre. Sıra HALKA sırası: 0 üst sol, saat yönünde ilerler ve 5'ten
 * sonra 0'a döner. Komşuluk bu sıradan hesaplanıyor (bkz. HiveComb), yani
 * dizinin sırası bir tasarım kararı: "Kovan olarak beden" ile "Kikaichū"
 * halkanın kapandığı yerde yan yana durmalı — beden koloniyi barındıran şey.
 */
export const SHINO_CELLS = [
  {
    key: "kikaichu" as const,
    imageKey: SHINO_IMAGE_KEYS.cellKikaichu,
    short: { tr: "Kikaichū", en: "Kikaichū" },
    title: { tr: "Kikaichū — asıl koloni", en: "Kikaichū — the main colony" },
    latin: { tr: "chakra ile beslenen tür", en: "the chakra-feeding breed" },
    text: {
      tr: "Kovanın gövdesi. Küçük, siyah, sayısız. Emir alır, hedefe geçer, chakrayı emer ve geri döner. Shino'nun yaptığı hemen her şeyin altında bu tür var; diğer beş hücre bu hücrenin ne yapamadığıyla ilgili.",
      en: "The body of the hive. Small, black, countless. They take an order, cross to the target, drain chakra and come back. Almost everything Shino does rests on this breed; the other five cells exist because of what this one cannot do.",
    },
    use: {
      tr: "Chakra emmek, düşmanı yormak, sürüyü taşımak.",
      en: "Draining chakra, wearing an enemy down, carrying the swarm.",
    },
  },
  {
    key: "kidaichu" as const,
    imageKey: SHINO_IMAGE_KEYS.cellKidaichu,
    short: { tr: "Kidaichū", en: "Kidaichū" },
    title: { tr: "Kidaichū — iri gövdeliler", en: "Kidaichū — the large-bodied" },
    latin: { tr: "yetişkinlikte edinilen tür", en: "a breed acquired in adulthood" },
    text: {
      tr: "Kikaichū'nun tersine tek tek iş görecek kadar iri böcekler. Sayı azalır, ağırlık artar: bir bulut yerine birkaç gövde. Shino'nun büyürken kovanına eklediği türlerden biri — Aburame'ler bir koloniyle doğar ama o koloniyle ölmez.",
      en: "Unlike the Kikaichū these are large enough to matter one at a time. The count drops and the weight rises: a few bodies instead of a cloud. One of the breeds he added to his hive as he grew — an Aburame is born with a colony but does not die with the same one.",
    },
    use: {
      tr: "Tek tek iş gören, ağırlığı olan böcekler.",
      en: "Insects that work singly and have weight behind them.",
    },
  },
  {
    key: "rinkaichu" as const,
    imageKey: SHINO_IMAGE_KEYS.cellRinkaichu,
    short: { tr: "Rinkaichū", en: "Rinkaichū" },
    title: { tr: "Rinkaichū — zehirli olanlar", en: "Rinkaichū — the poisonous ones" },
    latin: { tr: "zehir taşıyan tür", en: "the poison-bearing breed" },
    text: {
      tr: "Chakra emmezler, zehir taşırlar. Bir bulut hâlinde salındıklarında hedef ne ısırıldığını ne de ne zaman ısırıldığını anlar. Kovanın en tehlikeli hücresi ve Shino'nun en az açtığı hücre.",
      en: "They do not drain chakra; they carry poison. Released as a cloud, the target learns neither what bit him nor when. The most dangerous cell in the comb, and the one Shino opens least.",
    },
    use: {
      tr: "Zehirlemek, chakra dolaşımını içeriden bozmak.",
      en: "Poisoning, ruining the flow of chakra from within.",
    },
  },
  {
    key: "nano" as const,
    imageKey: SHINO_IMAGE_KEYS.cellNano,
    short: { tr: "Nano", en: "Nano" },
    title: {
      tr: "Nano boyuttakiler — görülmeyen ölçek",
      en: "The nano-scale — the size nobody sees",
    },
    latin: { tr: "gözle seçilemeyen tür", en: "the breed the eye cannot resolve" },
    text: {
      tr: "Bir tozun içinde kaybolacak kadar küçük böcekler. Bu ölçekte bir sürü artık bir silah değil bir ortam olur: odanın havasında, giysinin dokusunda, düşmanın nefesinde durur ve orada beklemeye başlar. Beklemek Aburame'lerin en iyi yaptığı şeydir.",
      en: "Insects small enough to be lost inside a speck of dust. At this scale a swarm stops being a weapon and becomes an environment: it sits in the air of a room, in the weave of a coat, in an enemy's breath, and waits. Waiting is what an Aburame does best.",
    },
    use: {
      tr: "Fark edilmeden yayılmak, bir ortamı sessizce doldurmak.",
      en: "Spreading unnoticed, filling a space without a sound.",
    },
  },
  {
    key: "pair" as const,
    imageKey: SHINO_IMAGE_KEYS.cellPair,
    short: { tr: "Çift", en: "Pair" },
    title: {
      tr: "Dişi ve erkek — takibin mekaniği",
      en: "Female and male — the mechanics of tracking",
    },
    latin: { tr: "koku ile eşleşen çift", en: "a pair matched by scent" },
    text: {
      tr: "Dişi böcek hedefin üstüne bir koku bırakır; erkekler o kokuyu şaşmadan takip eder. Kovanın en zarif fikri bu: takip etmek için hedefi görmek gerekmiyor, hedefe bir kere dokunmak yetiyor. Shino bunu bir kez yapar ve gerisini bekler.",
      en: "The female leaves a scent on the target; the males follow it without deviation. It is the most elegant idea in the hive: to follow something you do not need to see it, you only need to have touched it once. Shino touches once and then waits.",
    },
    use: {
      tr: "İşaretlemek, uzaktan iz sürmek, kaçanı bulmak.",
      en: "Marking, tracking at distance, finding whoever ran.",
    },
  },
  {
    key: "body" as const,
    imageKey: SHINO_IMAGE_KEYS.cellBody,
    short: { tr: "Beden", en: "Body" },
    title: { tr: "Kovan olarak beden", en: "The body as hive" },
    latin: { tr: "ev sahibinin kendisi", en: "the host himself" },
    text: {
      tr: "Peteğin kapandığı hücre. Bütün türler aynı yerde yaşıyor: Shino'nun içinde. Bu yüzden yorulduğunda koloni de yavaşlar, koloni beslendiğinde o zayıflar. Aburame'lerin gücü ile bedeli aynı organda duruyor ve ikisi hiçbir zaman ayrılmıyor.",
      en: "The cell where the comb closes. Every breed lives in the same place: inside Shino. So when he tires the colony slows, and when the colony feeds he weakens. For an Aburame the power and the price sit in the same organ, and the two are never separated.",
    },
    use: {
      tr: "Barındırmak, beslemek, ödemek.",
      en: "Housing them, feeding them, paying for them.",
    },
  },
] as const;

/* ── Beni unutuyorlar — sayfanın duygusal merkezi ───────────────────────── */

/**
 * Bu bölümde görsel YOK ve kurator yuvası da yok: gösterilecek bir şeyin
 * olmaması bölümün kendi konusu. Metinler arşivin kendi anlatımı; tek
 * tırnak içi cümle kapanış bölümünde ve konuşanına atfedilmiş.
 */
export const SHINO_FORGOTTEN = [
  {
    key: "retrieval" as const,
    when: { tr: "Sasuke'nin peşine düşülürken", en: "When the squad went after Sasuke" },
    text: {
      tr: "Köyün en aceleci gecesinde beş kişilik bir takım kuruldu ve Shino o takımda değildi; o sırada babasıyla başka bir görevdeydi. Döndüğünde herkes yaralıydı ve kimse ona neden çağrılmadığını açıklamadı. Bunu kendisi sordu — kimseyi suçlayarak değil, bir eksiklik bildirir gibi.",
      en: "On the village's most hurried night a five-man team was assembled and Shino was not on it; he was away on another mission with his father. When he came back everyone was wounded and nobody explained why he had not been called. He asked himself — not accusing anyone, more like filing a discrepancy.",
    },
  },
  {
    key: "arena" as const,
    when: { tr: "Chūnin sınavının finalinde", en: "At the Chūnin exam final" },
    text: {
      tr: "Arenada sırası geldi ve rakibi Kankurō maça çıkmadan çekildi. Tribün başka maçları konuşurken Shino kum zeminin ortasında tek başına kaldı: kazandı, ama kimse onun kazandığı bir şey izlemedi. Sayfaya yazılabilecek en sessiz zafer bu.",
      en: "His turn came in the arena and his opponent, Kankurō, withdrew before the match began. While the stands talked about other bouts he was left standing alone on the sand: he won, and nobody watched him win anything. It may be the quietest victory in the record.",
    },
  },
  {
    key: "return" as const,
    when: { tr: "Naruto köye döndüğünde", en: "When Naruto came back to the village" },
    text: {
      tr: "İki buçuk yıllık ayrılığın ardından karşılaştılar ve Naruto onu tanımadı. Shino bunu içine atmadı; kırıldığını açıkça söyledi, hem de o günden aylar sonra bile. Kovanla konuşan biri için insanların dilini kullanmak zor iş — yine de denedi.",
      en: "They met again after two and a half years apart and Naruto did not recognise him. Shino did not swallow it; he said plainly that it had hurt, and he was still saying so months later. For someone who speaks to a hive, using the language of people is hard work — he tried anyway.",
    },
  },
  {
    key: "classroom" as const,
    when: { tr: "Ve sonunda", en: "And in the end" },
    text: {
      tr: "Savaştan sonra Akademi'ye öğretmen olarak girdi. Bütün işi, her sabah bir sınıf dolusu çocuğun adını tek tek söylemek. Unutulmayı en iyi bilen kişi, kimsenin unutulmadığı tek odayı seçti.",
      en: "After the war he took a post at the Academy as a teacher. The entire job is saying a roomful of children's names out loud, one by one, every morning. The person who knew being forgotten best chose the one room where nobody is.",
    },
  },
] as const;

/* ── Ömür çizelgesi ─────────────────────────────────────────────────────── */

/**
 * Çizelge satırı. `quote` opsiyonel — beş kaydın yalnızca birinde replik
 * var (`as const` bir birleşim tipi üretip opsiyonel alanı gizlediği için
 * satır tipi burada açıkça yazıldı; Shikamaru dosyasındaki emsalin aynısı).
 */
export interface ShinoFateEntry {
  key: string;
  imageKey: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: LocalizedText };
}

export const SHINO_TIMELINE: ShinoFateEntry[] = [
  {
    key: "birth",
    imageKey: SHINO_IMAGE_KEYS.fateBirth,
    age: { tr: "Doğum", en: "Birth" },
    title: { tr: "Bedene açılan kapı", en: "A door opened in a body" },
    text: {
      tr: "Aburame çocuklarına doğdukları gün chakra ile beslenen özel bir böcek türü yerleştirilir. Rıza sorulmaz, sorulamaz da: anlaşma çocuk konuşmaya başlamadan önce yapılır. Shino'nun sonraki bütün gücü ve bütün yalnızlığı bu tek işlemden çıkıyor.",
      en: "An Aburame child is infused at birth with a special breed of insects that feeds on chakra. Consent is not asked and cannot be: the bargain is struck before the child can speak. Everything Shino later becomes — the strength and the solitude both — comes out of that single procedure.",
    },
  },
  {
    key: "team",
    imageKey: SHINO_IMAGE_KEYS.fateTeam,
    age: { tr: "13 yaş (I)", en: "Age 13 (I)" },
    title: { tr: "8. Takım — takip birimi", en: "Team 8 — the tracking unit" },
    text: {
      tr: "Kurenai Yūhi'nin komutasında Hinata ve Kiba ile aynı takıma verildi. Üçü de arama işine ayrı bir duyu getiriyordu ve takım köyün en iyi iz sürücüsü oldu. Shino bu takımda hiçbir zaman en gürültülü kişi olmadı; en çok bilgi taşıyan kişi hep oydu.",
      en: "Placed under Kurenai Yūhi alongside Hinata and Kiba. Each of the three brought a different sense to the work of searching, and the squad became the village's best at finding things. He was never the loudest member of that team; he was consistently the one carrying the most information.",
    },
  },
  {
    key: "chunin",
    imageKey: SHINO_IMAGE_KEYS.fateChunin,
    age: { tr: "13 yaş (I)", en: "Age 13 (I)" },
    title: { tr: "Çıkmayan rakip", en: "The opponent who never came out" },
    text: {
      tr: "Chūnin sınavının finalinde karşısına Kankurō çıkacaktı. Kankurō maça çıkmadan çekildi ve sıra bir sonrakine geçti. Shino için hazırlanılmış tek büyük sahne, hiç oynanmadan kapandı.",
      en: "In the Chūnin exam final he was to face Kankurō. Kankurō withdrew before the match started and the schedule moved on. The one big stage prepared for him closed without ever being played.",
    },
  },
  {
    key: "return",
    imageKey: SHINO_IMAGE_KEYS.fateReturn,
    age: { tr: "16 yaş (II)", en: "Age 16 (II)" },
    title: { tr: "Tanınmamak", en: "Going unrecognised" },
    text: {
      tr: "Naruto köye döndüğünde eski sınıf arkadaşlarıyla teker teker karşılaştı. Shino'yu hatırlamadı. Shino bunu bir kırgınlık olarak taşıdı ve — kendisinden beklenmeyecek biçimde — dile getirdi. Aynı yıl aynı cephede, aynı kişinin yanında savaştı.",
      en: "When Naruto returned to the village he met his old classmates one at a time. He did not remember Shino. Shino carried it as a grievance and — uncharacteristically — said it out loud. That same year he fought on the same front, beside the same person.",
    },
    quote: {
      text: {
        tr: "Beni fark etmedin. Bu bana dokundu.",
        en: "You didn't notice me. That hurt.",
      },
      by: { tr: "Shino Aburame", en: "Shino Aburame" },
    },
  },
  {
    key: "teacher",
    imageKey: SHINO_IMAGE_KEYS.fateTeacher,
    age: { tr: "Sonrası", en: "After" },
    title: { tr: "Savaş, sonra sınıf", en: "The war, then a classroom" },
    text: {
      tr: "Dördüncü Büyük Şinobi Savaşı'nda kolonisiyle birlikte cephede görev aldı. Savaştan sonra ön safı bırakıp Konoha Akademisi'ne öğretmen olarak girdi. Sessiz çocuğun seçtiği iş, her sabah bir sınıfın karşısına geçip konuşmak oldu.",
      en: "He served at the front with his colony through the Fourth Great Shinobi War. Afterwards he left the front line for a teaching post at the Konoha Academy. The quiet boy's chosen job turned out to be standing in front of a room every morning and speaking.",
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const SHINO_CLOSING = {
  quotes: [
    {
      text: {
        tr: "Beni fark etmedin. Bu bana dokundu.",
        en: "You didn't notice me. That hurt.",
      },
      by: { tr: "Shino Aburame", en: "Shino Aburame" },
      note: {
        tr: "Naruto köye döndüğünde söyledi. Bu sayfadaki en açık cümle, aynı zamanda en kırılgan olanı.",
        en: "Said when Naruto came back to the village. The plainest sentence on this page, and also the most fragile.",
      },
    },
    {
      text: { tr: "Neden mi? Çünkü…", en: "Why? Because…" },
      by: { tr: "Shino Aburame", en: "Shino Aburame" },
      note: {
        tr: "Tek bir sahnenin cümlesi değil, bir alışkanlık: Shino açıklamalarına hep böyle başlar. Kimse sormamış olsa bile cevabı verir — susturulan biri değil, dinlenmeyen biridir.",
        en: "Not a line from one scene but a habit: this is how he opens his explanations. He gives the answer even when nobody asked — he is not a person who was silenced, he is a person who was not listened to.",
      },
    },
  ],
  motto: "蟲",
  mottoNote: {
    tr: "mushi — “böcek”. Aburame tekniklerinin adında karakterin bu eski biçimi geçer.",
    en: "mushi — “insect”. Aburame technique names use this older form of the character.",
  },
  credit: {
    tr: "Künye verileri (doğum, boy, kan grubu, yaş, rütbe) ve yedek portre AniList'ten alınmıştır. Sayfadaki tam boy portre arşivin kendi yüklemesidir; petek, böcek bulutu ve bütün altıgen dokular bu sayfa için elle çizilmiş SVG'lerdir.",
    en: "Profile data (birthday, height, blood type, age, rank) and the fallback portrait come from AniList. The full-size portrait is the archive's own upload; the comb, the insect cloud and every hexagonal texture are SVGs drawn by hand for this page.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList profile" },
} as const;
