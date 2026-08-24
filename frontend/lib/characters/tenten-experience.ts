import type { LocalizedText } from "./types";

/**
 * Tenten — "Silah Parşömeni" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 3710 kaydının ABILITY yuvaları,
 * `tenten:*` anahtarlarıyla. Görsel bağlı değilse bölüm görselsiz ama
 * AYAKTA çizilir; hiçbir bölüm yükleme bekleyerek çökmez.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (9 Mart), boy (164 cm), kan grubu (B), yaş (14 / 17) ve rütbe
 * satırı AniList künyesinden birebir alındı (`anilist-detay-22.json`,
 * karakter 3710). Künyede kilo YOK, bu yüzden şeritte de yok. "Yüz atıştan
 * yüz isabet" ölçüsü de aynı künyenin açıklama metninde geçiyor ve orada
 * Might Guy'a atfediliyor — uydurma değil, kaynağı sayfada yazılı.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * BRIEF §9: emin olunmayan replik yazılmaz. Tenten'in ağzından çıkan hiçbir
 * cümlenin birebir metnine güvenmiyoruz, bu yüzden sayfada ONA ait tek bir
 * tırnak yok. Kapanıştaki tek alıntı BAŞKASINA ait ve kaynağı elimizde:
 * AniList künyesindeki Guy değerlendirmesi. Geri kalan her cümle arşivin
 * kendi anlatımı olarak, tırnaksız yazıldı.
 *
 * ── BİR DÜZELTME ─────────────────────────────────────────────────────────
 * Karaktere özel yönerge kader çizelgesinin dördüncü adımını "Sasuke
 * kurtarma" diye veriyordu. Tenten o görevde YOK: Sasuke'yi geri getirme
 * takımı beş kişilikti ve Guy Takımı'ndan kimse listede değildi. Guy Takımı
 * dördüncü adımın gerçek karşılığı olan iki işte var: Kum'a giden destek
 * kolu (Gaara'nın kaçırılması) ve II. Bölüm'de Sasuke/Itachi'nin izini süren
 * arama takımları. Adım o iki görevle yazıldı — yönergenin niyeti korundu,
 * yanlış iddia sayfaya girmedi.
 */

export const TENTEN_ID = 3710;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const TENTEN_SITE_URL = "https://anilist.co/character/3710";

/**
 * Sergi görselleri — hepsi characterId 3710 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `tenten:` önekli (kürator modu şartı).
 */
export const TENTEN_IMAGE_KEYS = {
  /** Hero: açılmış tomarın kenarı, havada dağılan silahlar (16:9) */
  hero: "tenten:hero",

  /* Cephanenin üç katmanı */
  soshoryu: "tenten:soshoryu",
  fuin: "tenten:fuin",
  bashosen: "tenten:bashosen",

  /* Elindekiler */
  precision: "tenten:precision",
  kusarigama: "tenten:kusarigama",
  armor: "tenten:armor-seal",
  teamGuy: "tenten:team-guy",

  /* Silah Parşömeni — sekiz mühür karesi */
  armKunai: "tenten:arm-kunai",
  armShuriken: "tenten:arm-shuriken",
  armSenbon: "tenten:arm-senbon",
  armNunchaku: "tenten:arm-nunchaku",
  armKusarigama: "tenten:arm-kusarigama",
  armBo: "tenten:arm-bo",
  armHoko: "tenten:arm-hoko",
  armBashosen: "tenten:arm-bashosen",

  /* İsabet */
  bullseye: "tenten:bullseye",

  /* Kader çizelgesi */
  fateTsunade: "tenten:fate-tsunade",
  fateTeam: "tenten:fate-team",
  fateChunin: "tenten:fate-chunin",
  fateHunt: "tenten:fate-hunt",
  fateWar: "tenten:fate-war",

  closing: "tenten:closing",
} as const;

/** Kürator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const TENTEN_SLOT_LABELS: Record<string, LocalizedText> = {
  [TENTEN_IMAGE_KEYS.hero]: {
    tr: "Hero — açılmış tomarın kenarı, havada dağılan silahlar (16:9)",
    en: "Hero — the edge of an open scroll, weapons scattering (16:9)",
  },
  [TENTEN_IMAGE_KEYS.soshoryu]: {
    tr: "Sōshōryū — havada spiral çizen iki tomar",
    en: "Sōshōryū — two scrolls spiralling in the air",
  },
  [TENTEN_IMAGE_KEYS.fuin]: {
    tr: "Mühür tekniği — kâğıt üstünde duman ve çıkan silah",
    en: "The sealing technique — smoke on paper, a weapon emerging",
  },
  [TENTEN_IMAGE_KEYS.bashosen]: {
    tr: "Bashōsen — kutsal yelpaze, tek savuruş",
    en: "Bashōsen — the treasured fan, a single sweep",
  },
  [TENTEN_IMAGE_KEYS.precision]: {
    tr: "Kunai ve shuriken — atış anı, el kadrajda",
    en: "Kunai and shuriken — the throw, hand in frame",
  },
  [TENTEN_IMAGE_KEYS.kusarigama]: {
    tr: "Kusarigama — zincir ve orak",
    en: "Kusarigama — chain and sickle",
  },
  [TENTEN_IMAGE_KEYS.armor]: {
    tr: "Savunma donanımı — kalkan, zincir, tuzak teli",
    en: "Defensive gear — shield, chain, trip wire",
  },
  [TENTEN_IMAGE_KEYS.teamGuy]: {
    tr: "Guy Takımı — dördü bir arada",
    en: "Team Guy — all four together",
  },
  [TENTEN_IMAGE_KEYS.armKunai]: {
    tr: "Kunai — yakın kadraj, tek bıçak",
    en: "Kunai — close crop, a single blade",
  },
  [TENTEN_IMAGE_KEYS.armShuriken]: {
    tr: "Shuriken — dönen çelik",
    en: "Shuriken — spinning steel",
  },
  [TENTEN_IMAGE_KEYS.armSenbon]: {
    tr: "Senbon — iğneler, dar kadraj",
    en: "Senbon — needles, tight crop",
  },
  [TENTEN_IMAGE_KEYS.armNunchaku]: {
    tr: "Nunchaku — yakın dövüş",
    en: "Nunchaku — close quarters",
  },
  [TENTEN_IMAGE_KEYS.armKusarigama]: {
    tr: "Kusarigama — zincirin uzandığı an",
    en: "Kusarigama — the chain at full reach",
  },
  [TENTEN_IMAGE_KEYS.armBo]: {
    tr: "Bō — uzun sopa, savunma duruşu",
    en: "Bō — the long staff, a guarding stance",
  },
  [TENTEN_IMAGE_KEYS.armHoko]: {
    tr: "Hoko/teber — tomardaki en ağır parça",
    en: "Hoko / halberd — the heaviest thing on the scroll",
  },
  [TENTEN_IMAGE_KEYS.armBashosen]: {
    tr: "Bashōsen — yelpazenin açıldığı an",
    en: "Bashōsen — the fan opening",
  },
  [TENTEN_IMAGE_KEYS.bullseye]: {
    tr: "İsabet — hedef tahtası, tam ortada küme",
    en: "The hit — a target board, the cluster dead centre",
  },
  [TENTEN_IMAGE_KEYS.fateTsunade]: {
    tr: "Tsunade — örnek alınan kunoichi",
    en: "Tsunade — the kunoichi she measured herself against",
  },
  [TENTEN_IMAGE_KEYS.fateTeam]: {
    tr: "Guy Takımı'nın kuruluşu",
    en: "Team Guy is formed",
  },
  [TENTEN_IMAGE_KEYS.fateChunin]: {
    tr: "Chūnin sınavı — Temari'nin yelpazesi ve dağılan cephane",
    en: "Chūnin exam — Temari's fan and the scattered arsenal",
  },
  [TENTEN_IMAGE_KEYS.fateHunt]: {
    tr: "Kum'a destek kolu ve Sasuke'nin izi",
    en: "Backup to the Sand, and the hunt for Sasuke",
  },
  [TENTEN_IMAGE_KEYS.fateWar]: {
    tr: "Dördüncü Savaş — kutsal silahlar cephesi",
    en: "The Fourth War — the treasured-tools front",
  },
  [TENTEN_IMAGE_KEYS.closing]: {
    tr: "Kapanış — sarılmış tomar, yerde tek kunai",
    en: "Closing — the rolled scroll, one kunai on the ground",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const TENTEN_IDENTITY = {
  name: "Tenten",
  nativeName: "テンテン",
  /** Hero filigranı — dekoratif (aria-hidden) */
  watermark: "武器",
  team: { tr: "Guy Takımı", en: "Team Guy" },
  epigraph: {
    tr: "Gücü hiç büyümedi. Sapması hiç olmadı.",
    en: "Her power never grew. Her aim never drifted.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "9 Mart", en: "9 March" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "164 cm", en: "164 cm" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "B", en: "B" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "14 (I) · 17 (II)", en: "14 (I) · 17 (II)" },
    },
    {
      label: { tr: "Rütbe", en: "Rank" },
      value: { tr: "Genin (I) → Chūnin (II)", en: "Genin (I) → Chūnin (II)" },
    },
    {
      label: { tr: "Takım", en: "Team" },
      value: {
        tr: "Guy Takımı — Might Guy, Rock Lee, Neji",
        en: "Team Guy — Might Guy, Rock Lee, Neji",
      },
    },
    {
      label: { tr: "Uzmanlık", en: "Speciality" },
      value: {
        tr: "Silah — mühürden çağırma ve atış",
        en: "Weaponry — sealing and marksmanship",
      },
    },
    {
      label: { tr: "Taşıdığı", en: "What she carries" },
      value: {
        tr: "I. Bölüm'de birçok tomar; II. Bölüm'de tek büyük tomar",
        en: "Many scrolls in Part I; one large scroll in Part II",
      },
    },
  ],
} as const;

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

/**
 * Mod adı yönergede verildiği gibi bırakıldı: **Sōryū Tensakai**, İngilizce
 * karşılığı "Rising Twin Dragons". Kanji YAZILMADI — bu adın yazımından emin
 * değiliz ve emin olunmayan bir işaret sayfaya konmaz. Kanjisinden emin
 * olduğumuz akraba teknik (双昇龍 Sōshōryū) laboratuvar kartında duruyor.
 */
export const TENTEN_MODE = {
  name: "Sōryū Tensakai",
  enter: { tr: "Yükselen İkiz Ejderha", en: "Rising Twin Dragons" },
  exit: { tr: "Ejderleri indir", en: "Lower the dragons" },
  hint: {
    tr: "İki tomar havada açılıyor: sayfanın iki kenarından ejderha şeritleri yükseliyor, aradaki boşluğa silah yağmuru iniyor.",
    en: "Two scrolls open in the air: dragon ribbons rise along both edges of the page and the gap between them fills with falling steel.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const TENTEN_HERO = {
  lede: {
    tr: "Guy Takımı'nın üç öğrencisinden biri. İkisi efsane oldu — biri sekiz kapıyı açtı, diğeri Hyūga dehası sayıldı. Üçüncüsü, hiç ıskalamayan kişi olarak kaldı.",
    en: "One of Team Guy's three students. Two became legends — one opened the eight gates, the other was called a Hyūga prodigy. The third remained the one who never missed.",
  },
  tasselCaption: {
    tr: "İki topuzdan sarkan kırmızı püskül: kadrajda onu bulmanın en kısa yolu.",
    en: "The red tassel hanging from the two buns: the quickest way to find her in a frame.",
  },
  portraitAlt: {
    tr: "Tenten — arşive yüklenmiş kadro portresi",
    en: "Tenten — cast portrait uploaded to the archive",
  },
  portraitAltFallback: {
    tr: "Tenten — AniList künye portresi",
    en: "Tenten — AniList profile portrait",
  },
} as const;

/**
 * Görsel alt metinleri — BRIEF §3.5: her alt iki dilli ve KAYNAĞINI söyler.
 * Yoldaş portrelerinin tamamı kendi veritabanımızdan geliyor (PORTRAIT
 * yuvası), bu yüzden tek bir son ek yetiyor.
 */
export const TENTEN_ALT = {
  companionSuffix: {
    tr: "— arşive yüklenmiş kadro portresi",
    en: "— cast portrait uploaded to the archive",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const TENTEN_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "Naruto Universe" },
} as const;

export const TENTEN_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "The record" },
    lede: {
      tr: "Kısa bir tutanak. İçinde tek bir olağanüstü sayı var ve o sayı güçle ilgili değil.",
      en: "A short file. It holds exactly one extraordinary number, and that number is not about power.",
    },
  },
  arsenal: {
    title: { tr: "Cephanenin üç katmanı", en: "Three layers of the arsenal" },
    lede: {
      tr: "Tenten'in tekniği tek bir silahta değil: silahı kâğıda koyma, kâğıttan çıkarma ve havada yönlendirme biçiminde.",
      en: "Her technique is not in any one weapon: it is in putting steel onto paper, taking it back off, and steering it once it is in the air.",
    },
  },
  tools: {
    title: { tr: "Elindekiler", en: "What she keeps at hand" },
    lede: {
      tr: "Tomarın dışında kalan dört şey — dördü de büyük teknik değil, alışkanlık.",
      en: "Four things that live outside the scroll. None of them is a great technique; all four are habits.",
    },
  },
  scroll: {
    title: { tr: "Silah Parşömeni", en: "The weapon scroll" },
    lede: {
      tr: "Tomarı aşağı doğru aç. Her mühür karesi bir silahı tutuyor; kare seçildiği anda o silah kâğıttan çıkıyor ve sayfada kalıyor. Tomar tamamen açıldığında arkanda bir cephanelik duruyor.",
      en: "Unroll the scroll downward. Every seal square holds one weapon; the moment a square is chosen the weapon leaves the paper and stays on the page. By the time the scroll is fully open there is an armoury standing behind you.",
    },
  },
  aim: {
    title: { tr: "İsabet", en: "The hit" },
    lede: {
      tr: "Tenten'in gerçek gücü güç değil, kesinlik.",
      en: "Her real strength was never strength. It was precision.",
    },
  },
  companions: {
    title: { tr: "Yanındakiler", en: "The people beside her" },
    lede: {
      tr: "Dört kayıt: ikisi takımdaşı, biri öğretmeni, biri de onu bir kez tamamen yenen kişi.",
      en: "Four entries: two teammates, one teacher, and the one person who beat her outright.",
    },
  },
  fate: {
    title: { tr: "Kader çizelgesi", en: "A life in five entries" },
    lede: {
      tr: "Beş kayıt. Biri özenme, biri kuruluş, biri yenilgi, biri uzun bir arama, sonuncusu bir savaş ve bir cenaze.",
      en: "Five entries. One aspiration, one formation, one defeat, one long search, and at the end a war and a funeral.",
    },
  },
} as const;

/* ── Cephanenin üç katmanı ──────────────────────────────────────────────── */

export const TENTEN_ARSENAL = [
  {
    key: "soshoryu" as const,
    imageKey: TENTEN_IMAGE_KEYS.soshoryu,
    kanji: "双昇龍",
    name: "Sōshōryū",
    turkish: { tr: "Yükselen İkiz Ejderha", en: "Twin Rising Dragons" },
    tagline: {
      tr: "İki tomar havaya atılır, spiral çizerek iki ejderhaya dönüşür; Tenten aralarına sıçrar.",
      en: "Two scrolls go up, spiral into a pair of dragons, and she leaps into the space between them.",
    },
    text: {
      tr: "Tenten'in imza tekniği bir silah değil, bir düzen: kâğıt havada açılırken cephane sırayla dışarı çıkar ve atış kesintisiz sürer. Yerde durup atmak menzili ve açıyı sınırlar; havada, iki dönen tomarın ortasında durmak her yöne aynı hızda atış demektir. Işıklanan her mühür karesi bir el dolusu çelik.",
      en: "Her signature is not a weapon but an arrangement: as the paper unwinds overhead the arsenal comes out in order and the barrage never pauses. Throwing from the ground caps both range and angle; standing in the middle of two turning scrolls means every direction is equally close. Each seal square that lights up is another handful of steel.",
    },
    traits: [
      { tr: "İki tomar", en: "Two scrolls" },
      { tr: "Kesintisiz atış", en: "An unbroken barrage" },
      { tr: "Havada konumlanma", en: "Positioned in the air" },
    ],
  },
  {
    key: "fuin" as const,
    imageKey: TENTEN_IMAGE_KEYS.fuin,
    kanji: "封印術",
    name: "Fūinjutsu",
    turkish: { tr: "Mühür tekniği — silah deposu", en: "Sealing technique — the armoury" },
    tagline: {
      tr: "Çelik, kâğıdın üstünde mürekkebe iner; el değdiği anda geri çıkar.",
      en: "Steel goes down into ink on paper, and comes back out the moment a hand touches it.",
    },
    text: {
      tr: "Tenten'i taşıyabileceğinden fazlasıyla dövüşür kılan şey bu. Bir kunai kadar yer kaplayan tomar, bir cephaneliği tutar; çağırma anı hazırlık istemez, mühre dokunmak yeter. Aynı teknik tersine de çalışır: yere düşen silah geri mühürlenip yeniden atılabilir. I. Bölüm'de bu iş için üstünde birçok tomar taşıyordu; II. Bölüm'de hepsini tek büyük tomarda topladı.",
      en: "This is what lets her fight with more than she can carry. A scroll the size of a kunai holds an armoury, and summoning takes no preparation — a hand on the seal is enough. The technique also runs backwards: a weapon that has hit the ground can be sealed again and thrown again. In Part I she carried several scrolls for this; in Part II she consolidated the whole arsenal into one large scroll.",
    },
    traits: [
      { tr: "Kâğıt üstünde depo", en: "An armoury on paper" },
      { tr: "Hazırlıksız çağırma", en: "Summoned without preparation" },
      { tr: "Tek büyük tomar (II)", en: "One large scroll (II)" },
    ],
  },
  {
    key: "bashosen" as const,
    imageKey: TENTEN_IMAGE_KEYS.bashosen,
    kanji: "芭蕉扇",
    name: "Bashōsen",
    turkish: { tr: "Kutsal yelpaze", en: "The treasured fan" },
    tagline: {
      tr: "Altı Yol Bilgesi'nin araçlarından biri: tek savuruşta beş elementten birini üretir.",
      en: "One of the Sage of Six Paths' treasured tools: one sweep produces any of the five natures.",
    },
    text: {
      tr: "Dördüncü Büyük Şinobi Savaşı'nda Tenten'e verilen silah artık çelik değildi. Bashōsen mühür gerektirmez, el işareti gerektirmez — savurulur ve ateş, su, rüzgâr, yıldırım ya da toprak çıkar. Bedeli çakradır ve bedel çok ağırdır: Tenten'in kendi çakra hacmi yelpazeyi ancak birkaç savuruş taşıyabildi. Sayfadaki tek silah bu: kullanıcısından büyük olan.",
      en: "In the Fourth Great Shinobi War the weapon handed to her was no longer steel. The Bashōsen needs no seal and no hand sign — it is swept, and fire, water, wind, lightning or earth comes out. The price is chakra, and the price is steep: her own reserves carried the fan for only a few sweeps. It is the one weapon on this page that is larger than the person holding it.",
    },
    traits: [
      { tr: "Beş element", en: "Five natures" },
      { tr: "El işareti yok", en: "No hand signs" },
      { tr: "Çakra oburu", en: "Devours chakra" },
    ],
  },
] as const;

/* ── Elindekiler ────────────────────────────────────────────────────────── */

export const TENTEN_TOOLS = [
  {
    key: "precision" as const,
    imageKey: TENTEN_IMAGE_KEYS.precision,
    name: { tr: "Kunai ve shuriken kesinliği", en: "Kunai and shuriken accuracy" },
    note: {
      tr: "Cephanenin temel birimi ve dosyanın en çok tekrarlanan cümlesi. Guy'ın ölçüsüne göre yüz atıştan yüzü tam ortaya gidiyor; ıskalayan atış değil, ıskalatılan atış var — güçlü rakipler çeliği çoğu zaman havada durduruyor.",
      en: "The base unit of the arsenal and the most repeated line in her file. By Guy's measure a hundred throws land a hundred bullseyes; nothing misses on her side — stronger opponents simply stop the steel in the air.",
    },
  },
  {
    key: "kusarigama" as const,
    imageKey: TENTEN_IMAGE_KEYS.kusarigama,
    name: { tr: "Kusarigama", en: "Kusarigama" },
    note: {
      tr: "Zincirin ucunda orak. Menzili uzatır ama asıl işi kesmek değil bağlamak: bir kolu, bir bacağı ya da bir silahı sarıp rakibi istenen yere çeker. Tomarın mantığının elle tutulur hâli — uzat, tut, geri çek.",
      en: "A sickle on the end of a chain. It stretches her reach, but its real work is binding rather than cutting: it wraps an arm, a leg or a weapon and pulls the opponent to the spot she wants. The scroll's own logic made physical — extend, hold, draw back.",
    },
  },
  {
    key: "armor" as const,
    imageKey: TENTEN_IMAGE_KEYS.armor,
    name: { tr: "Zırh mührü", en: "The armour seal" },
    note: {
      tr: "Tomar yalnızca saldırı üretmez. Aynı kâğıttan kalkan, zincir ve tuzak teli de çıkar; dövüşün ortasında donanım değiştirmek Tenten için bir çanta karıştırmak kadar kısa sürer. Cephaneliğin savunma rafı, kimsenin konuşmadığı raf.",
      en: "The scroll does not only produce attacks. Shields, chain and trip wire come off the same paper, and changing her kit mid-fight costs her about as long as reaching into a pouch. It is the armoury's defensive shelf — the shelf nobody talks about.",
    },
  },
  {
    key: "teamGuy" as const,
    imageKey: TENTEN_IMAGE_KEYS.teamGuy,
    name: { tr: "Guy Takımı desteği", en: "Team Guy support" },
    note: {
      tr: "Takımın iki yakın dövüşçüsü öne çıktığında geride kalan menzil onun. Neji'nin Byakugan'ı hedefi görür, Lee mesafeyi kapatır, Tenten aradaki boşluğu çelikle doldurur. Rol paylaşımı hiç değişmedi.",
      en: "When the team's two close-range fighters go forward, the range left behind is hers. Neji's Byakugan finds the target, Lee closes the distance, and she fills the gap between them with steel. The division of labour never changed.",
    },
  },
] as const;

/* ── Silah Parşömeni — sayfanın kalbi ───────────────────────────────────── */

export const TENTEN_SCROLL_UI = {
  listLabel: { tr: "Tomardaki mühür kareleri", en: "Seal squares on the scroll" },
  sealWord: { tr: "Mühür", en: "Seal" },
  prev: { tr: "Yukarıdaki mühür", en: "Seal above" },
  next: { tr: "Aşağıdaki mühür", en: "Seal below" },
  momentLabel: { tr: "Kullanıldığı an", en: "Where it was used" },
  openLabel: { tr: "Açılan kare", en: "Squares opened" },
  keyboardHint: {
    tr: "Yukarı/aşağı ok tuşlarıyla da gezebilirsin; seçtiğin kare tomarı oraya kadar açar.",
    en: "The up and down arrow keys work too; the square you pick unrolls the scroll down to it.",
  },
  rigAlt: {
    tr: "Dikey bir parşömen şeması: üstte ahşap silindir, aşağı doğru açılan kâğıt, altta hâlâ sarılı kalan kısım.",
    en: "A vertical scroll diagram: a wooden rod at the top, paper unrolling downward, and the still-rolled remainder at the bottom.",
  },
  armoryAlt: {
    tr: "Açılan mühürlerden çıkan silah siluetleri bölümün arka planında birikiyor.",
    en: "Weapon silhouettes released by the opened seals accumulate across the section's background.",
  },
} as const;

/** Parşömen karesi — çizim adı `TentenArms` setindeki anahtarla aynı. */
export interface TentenArm {
  key:
    | "kunai"
    | "shuriken"
    | "senbon"
    | "nunchaku"
    | "kusarigama"
    | "bo"
    | "hoko"
    | "bashosen";
  imageKey: string;
  /** Mühür karesinin yüzü — dekoratif, ekran okuyucuya inmez */
  kanji: string;
  name: string;
  turkish: LocalizedText;
  note: LocalizedText;
  moment: LocalizedText;
}

/**
 * Sekiz silah.
 *
 * ⚠️ Kanjiler yalnızca YAZIMINDAN EMİN OLUNAN sözcükler: 苦無 (kunai),
 * 手裏剣 (shuriken), 千本 (senbon), 双節棍 (nunchaku), 鎖鎌 (kusarigama),
 * 棒 (bō), 鉾 (hoko — teber/mızrak sınıfı uzun saplı silah) ve 芭蕉扇
 * (bashōsen). Yönergedeki "halberd" bu listede 鉾 olarak duruyor: Japonca
 * karşılığı olan ve yazımından emin olduğumuz sözcük bu.
 */
export const TENTEN_ARMS: TentenArm[] = [
  {
    key: "kunai",
    imageKey: TENTEN_IMAGE_KEYS.armKunai,
    kanji: "苦無",
    name: "Kunai",
    turkish: { tr: "Kunai", en: "Kunai" },
    note: {
      tr: "Cephanenin birimi",
      en: "The unit of the arsenal",
    },
    moment: {
      tr: "Chūnin sınavının ön elemesinde Temari'nin karşısına çıkan ilk şey bu oldu: elle atılan, sonra tellerle yönlendirilen bir kunai perdesi. Hepsi hedefi buldu — hedefe varmadan rüzgâra çarptılar. Tenten'in dosyasındaki asıl ders o gün yazıldı: isabet, etkiyi garanti etmiyor.",
      en: "It was the first thing Temari saw across the floor of the Chūnin preliminaries: a curtain of kunai thrown by hand and then steered on wire. Every one of them was on target — and every one met wind before it arrived. The real lesson in her file was written that day: accuracy does not guarantee effect.",
    },
  },
  {
    key: "shuriken",
    imageKey: TENTEN_IMAGE_KEYS.armShuriken,
    kanji: "手裏剣",
    name: "Shuriken",
    turkish: { tr: "Shuriken", en: "Shuriken" },
    note: {
      tr: "Dönen çelik",
      en: "Spinning steel",
    },
    moment: {
      tr: "Dönerek giden çelik, kunai'nin aksine yolu boyunca kesmeye devam eder; bir hedefi sıyırıp arkasındakini de bulabilir. Tenten bunları tek tek değil demet hâlinde bırakır ve gerektiğinde ince tellerle geri çağırır: ıskalanan bir shuriken kaybedilmiş sayılmaz, ikinci bir açıdan geri gelir.",
      en: "Spinning steel keeps cutting along its whole path, unlike a kunai; it can graze one target and still find the one behind. She releases them in fistfuls rather than one by one, and recalls them on fine wire when she needs to: a shuriken that misses is not lost, it comes back from a second angle.",
    },
  },
  {
    key: "senbon",
    imageKey: TENTEN_IMAGE_KEYS.armSenbon,
    kanji: "千本",
    name: "Senbon",
    turkish: { tr: "Senbon — iğne", en: "Senbon — needles" },
    note: {
      tr: "Kütlesiz kesinlik",
      en: "Precision without mass",
    },
    moment: {
      tr: "Kütlesi neredeyse yok; bir senbon zırhı delmez, gövdeyi durdurmaz. Değeri tam olarak burada: iğne kütleye değil noktaya gider. Bir eklem, bir sinir, bir tendon. Tenten'in yüz atıştan yüz isabet ölçüsünün en açık sınandığı silah bu, çünkü hedef bir gövde değil bir nokta.",
      en: "It has almost no mass; a senbon will not pierce armour or stop a body. That is exactly its value: a needle is aimed at a point, not at bulk. A joint, a nerve, a tendon. This is where her hundred-out-of-hundred is most plainly tested, because the target is not a body but a point.",
    },
  },
  {
    key: "nunchaku",
    imageKey: TENTEN_IMAGE_KEYS.armNunchaku,
    kanji: "双節棍",
    name: "Nunchaku",
    turkish: { tr: "Nunchaku", en: "Nunchaku" },
    note: {
      tr: "Menzil bittiğinde",
      en: "For when range runs out",
    },
    moment: {
      tr: "Tomarın yalnızca uzaktan dövüşenler için olduğu sanılır. Nunchaku bunun tersini söylüyor: mesafe kapandığında Tenten atmayı bırakıp vurmaya geçer. Zincirle bağlı iki sopa, dar alanda hem darbe hem savunma verir — ve mühürden çıkması yarım saniye sürer.",
      en: "The scroll is assumed to be a long-range instrument. The nunchaku says otherwise: when the distance closes she stops throwing and starts striking. Two batons on a chain give both blow and guard in a tight space — and it takes half a second to come off the seal.",
    },
  },
  {
    key: "kusarigama",
    imageKey: TENTEN_IMAGE_KEYS.armKusarigama,
    kanji: "鎖鎌",
    name: "Kusarigama",
    turkish: { tr: "Kusarigama — zincirli orak", en: "Kusarigama — sickle and chain" },
    note: {
      tr: "Uzat, bağla, geri çek",
      en: "Extend, bind, draw back",
    },
    moment: {
      tr: "Tomarın kendi mantığını taşıyan tek silah: uzanır, tutar, geri döner. Orak keser ama zincir karar verir — hangi uzuv bağlanacak, rakip hangi kareye çekilecek. Menzille yakın dövüş arasındaki boşluğu kapatan parça bu.",
      en: "The one weapon that carries the scroll's own logic: it extends, it holds, it returns. The sickle cuts, but the chain decides — which limb gets bound, which square the opponent is pulled onto. This is the piece that closes the gap between range and close quarters.",
    },
  },
  {
    key: "bo",
    imageKey: TENTEN_IMAGE_KEYS.armBo,
    kanji: "棒",
    name: "Bō",
    turkish: { tr: "Bō — uzun sopa", en: "Bō — the long staff" },
    note: {
      tr: "Kesmeden uzak tutmak",
      en: "Keeping distance without cutting",
    },
    moment: {
      tr: "Ağzı olmayan tek silah. İşi öldürmek değil, aradaki mesafeyi korumak: gelen bir bıçağı çevirmek, bir hamleyi kesmek, kendine iki adım açmak. Tomardaki en sade parça ve en sık gereken parça.",
      en: "The only weapon on the scroll without an edge. Its job is not to kill but to hold the gap: to turn an incoming blade, break a charge, buy herself two steps. The plainest item on the scroll, and the one most often needed.",
    },
  },
  {
    key: "hoko",
    imageKey: TENTEN_IMAGE_KEYS.armHoko,
    kanji: "鉾",
    name: "Hoko",
    turkish: { tr: "Teber — uzun saplı balta", en: "Halberd" },
    note: {
      tr: "Kesinliğin yetmediği yer",
      en: "Where accuracy is not enough",
    },
    moment: {
      tr: "Tomardaki en ağır parça ve sayfadaki en açık itiraf: bazı rakipler bir iğneyle, hatta bir kunai perdesiyle durmuyor. Teber isabet için değil kütle için var — uzun sap, ağır ağız, tek darbe. Tenten cephanesini yalnızca kesinliğe göre değil, karşısındakinin kalınlığına göre de kurmuş.",
      en: "The heaviest item on the scroll and the page's plainest admission: some opponents are not stopped by a needle, or even by a curtain of kunai. The halberd exists for mass rather than accuracy — long haft, heavy edge, one blow. She built her arsenal not only around precision but around how thick the thing in front of her was.",
    },
  },
  {
    key: "bashosen",
    imageKey: TENTEN_IMAGE_KEYS.armBashosen,
    kanji: "芭蕉扇",
    name: "Bashōsen",
    turkish: { tr: "Bashōsen — kutsal yelpaze", en: "Bashōsen — the treasured fan" },
    note: {
      tr: "Çelik olmayan tek kare",
      en: "The one square that is not steel",
    },
    moment: {
      tr: "Dördüncü Büyük Şinobi Savaşı'nda müttefik kuvvetlerin eline geçen Altı Yol Bilgesi araçlarından biri Tenten'e verildi. Tek savuruşta beş elementten biri çıkıyordu ve el işareti gerekmiyordu — ama yelpaze taşıyıcısının çakrasını içiyordu. Tomarın son karesi, Tenten'in kendi ölçüsünü aştığı yerdir.",
      en: "In the Fourth Great Shinobi War one of the Sage of Six Paths' treasured tools, recovered by the allied forces, was handed to her. A single sweep produced any of the five natures with no hand signs — but the fan drank the chakra of whoever held it. The last square on the scroll is the place where she outran her own measure.",
    },
  },
];

/* ── İsabet ─────────────────────────────────────────────────────────────── */

/**
 * Sayfanın duygusal merkezi. Yönergenin şartı: ÜÇ CÜMLE, abartma yok.
 * Aşağıdaki üçü tam olarak üç cümle ve hiçbiri iddiada bulunmuyor —
 * biri kaynaklı bir ölçü, biri gözlem, biri sonuç.
 */
export const TENTEN_AIM = {
  measure: { tr: "100 / 100", en: "100 / 100" },
  measureNote: {
    tr: "Guy'ın ölçüsü: yüz atış, yüz kez tam orta.",
    en: "Guy's measure: a hundred throws, a hundred bullseyes.",
  },
  lines: [
    {
      tr: "Tenten'in dosyasındaki tek olağanüstü sayı bu: güç değil, sapmanın hiç olmaması.",
      en: "This is the only extraordinary number in her file: not power, but the complete absence of drift.",
    },
    {
      tr: "Bu ölçü onu efsane yapmadı; aynı takımdaki iki kişi sahneyi doldururken o çoğu zaman kadrajın kenarında kaldı.",
      en: "The measure never made her a legend; while two people on the same team filled the frame she usually stayed at its edge.",
    },
    {
      tr: "Kenarda kalmak çalışmayı durdurmadı — tomarlar her sabah yeniden sarıldı.",
      en: "Standing at the edge did not stop the work: the scrolls were rolled again every morning.",
    },
  ],
  boardAlt: {
    tr: "Elle çizilmiş hedef tahtası şeması: iç içe halkalar ve tam merkezde toplanmış isabet izleri.",
    en: "A hand-drawn target board diagram: concentric rings with the hit marks clustered dead centre.",
  },
} as const;

/* ── Yanındakiler ───────────────────────────────────────────────────────── */

/**
 * `characterId` alanları `EXPERIENCE_COMPANIONS[3710]` listesiyle birebir
 * aynı: 306 Rock Lee, 1694 Neji, 307 Might Guy, 2174 Temari. Portre kaydı
 * olmayan kişi adıyla çizilir, bölüm çökmez.
 */
export const TENTEN_COMPANIONS = [
  {
    characterId: 307,
    name: "Might Guy",
    kind: "teacher" as const,
    role: { tr: "Ölçüyü koyan", en: "The one who set the measure" },
    note: {
      tr: "Öğretmeni ve dosyadaki tek sayının kaynağı. Yüz atıştan yüzünü sayan oydu; Tenten'in en çok alıntılanan özelliği bir başkasının gözlemi.",
      en: "Her teacher, and the source of the one number in her file. He is the one who counted a hundred out of a hundred; her most quoted trait is somebody else's observation.",
    },
  },
  {
    characterId: 1694,
    name: "Neji Hyūga",
    kind: "team" as const,
    role: { tr: "Hedefi gören", en: "The one who saw the target" },
    note: {
      tr: "Takımın gözü. Byakugan neyin nerede olduğunu söyler, çelik oraya gider — dörtte üçü konuşulmayan bir iş bölümü. Dördüncü Savaş'ta öldü.",
      en: "The team's eye. The Byakugan says what is where and the steel goes there — a division of labour that was three-quarters unspoken. He was killed in the Fourth War.",
    },
  },
  {
    characterId: 306,
    name: "Rock Lee",
    kind: "team" as const,
    role: { tr: "Mesafeyi kapatan", en: "The one who closed the distance" },
    note: {
      tr: "Ninjutsu ve genjutsu yapamayan takımdaşı. Lee öne koştukça arkada kalan menzil Tenten'in oluyor; ikisinin dövüş tarzı birbirinin tam tersi ve tam da bu yüzden birbirini tutuyor.",
      en: "The teammate who can use neither ninjutsu nor genjutsu. The further forward he runs, the more the range behind him belongs to her; their two styles are exact opposites, which is precisely why they hold together.",
    },
  },
  {
    characterId: 2174,
    name: "Temari",
    kind: "rival" as const,
    role: { tr: "Cephaneyi durduran", en: "The one who stopped the arsenal" },
    note: {
      tr: "Chūnin sınavında karşısındaki rakip. Tenten'in bütün cephanesini havaya bıraktığı ve hiçbirinin varamadığı tek dövüş; rüzgâr, isabetin cevabı olduğu tek şeydi.",
      en: "Her opponent in the Chūnin exam. The one fight where she emptied her entire arsenal into the air and none of it arrived; wind was the single thing that had an answer for accuracy.",
    },
  },
] as const;

/* ── Kader çizelgesi ────────────────────────────────────────────────────── */

/**
 * Çizelge satırı. `quote` opsiyonel — Tenten'in ağzından doğrulanmış replik
 * elimizde olmadığı için hiçbir satırda kullanılmıyor, ama alan duruyor:
 * ileride kaynaklı bir replik bulunursa satır tipi değişmeden eklenir.
 */
export interface TentenFateEntry {
  key: string;
  imageKey: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: LocalizedText };
}

export const TENTEN_TIMELINE: TentenFateEntry[] = [
  {
    key: "tsunade",
    imageKey: TENTEN_IMAGE_KEYS.fateTsunade,
    age: { tr: "Öncesi", en: "Before" },
    title: {
      tr: "Örnek aldığı kişi bir kunoichi'ydi",
      en: "The person she measured herself against was a kunoichi",
    },
    text: {
      tr: "Tenten'in hedefi baştan beri güçlü bir şinobi olmak değil, güçlü bir KUNOICHI olmaktı; ölçüsünü Sannin'in en güçlüsünden, Tsunade'den aldı. Bu seçim, o yıllarda kadın şinobilerin çoğunlukla destek rolüyle anıldığı bir sınıfta yapılmış bir iddiaydı. Sonuç yalnızca teknikte değil, sayfanın tamamında görünüyor: cephane, cephanenin bakımı, cephanenin taşınması — hepsi kendi işi.",
      en: "Her aim was never simply to become a strong shinobi but a strong kunoichi, and she took her measure from the strongest of the Sannin: Tsunade. In a class where female shinobi were mostly filed under support, that was a claim. The result shows across this whole page, not only in her techniques: the arsenal, its upkeep and its carrying are all her own work.",
    },
  },
  {
    key: "team",
    imageKey: TENTEN_IMAGE_KEYS.fateTeam,
    age: { tr: "14 yaş", en: "Age 14" },
    title: { tr: "Guy Takımı ve denge", en: "Team Guy, and the balance" },
    text: {
      tr: "Takımın diğer iki öğrencisi uçlardan geliyordu: biri hiç ninjutsu kullanamayan ama bedenini silaha çeviren Lee, diğeri klanın en yetenekli genci sayılan Neji. Tenten üçüncü köşeyi kurdu — menzil, cephane ve tuzak. Guy'ın eğitim düzeninde bu üç köşe birbirini tamamladı; takımın en dengeli hâli, en az konuşulan üyesi sayesinde ortaya çıktı.",
      en: "The other two students came from the extremes: Lee, who could use no ninjutsu at all and turned his body into the weapon, and Neji, held to be the most gifted young Hyūga. She built the third corner — range, arsenal and traps. Under Guy's regime those three corners completed each other; the team was at its most balanced because of its least discussed member.",
    },
  },
  {
    key: "chunin",
    imageKey: TENTEN_IMAGE_KEYS.fateChunin,
    age: { tr: "14 yaş", en: "Age 14" },
    title: { tr: "Sınavın en açık yenilgisi", en: "The most public defeat of the exam" },
    text: {
      tr: "Chūnin sınavının ön elemesinde karşısına Kum'dan Temari çıktı. Tenten bütün cephanesini kullandı: elle atılan çelik, tellerle yönlendirilen ikinci dalga, havada açılan tomarlar. Hiçbiri varmadı — dev yelpaze her atışı rüzgârla kenara aldı ve dövüş Tenten'in kapalı yelpazenin üstüne düşmesiyle bitti. Yenilen isabet değildi; isabetin karşısına ilk kez fizik çıkmıştı.",
      en: "In the preliminaries she drew Temari of the Sand. She used everything: steel thrown by hand, a second wave steered on wire, scrolls opened overhead. None of it arrived — the great fan pushed every throw aside on the wind, and the match ended with Tenten falling onto the closed fan. What lost was not her accuracy. It was the first time her accuracy had physics standing in front of it.",
    },
  },
  {
    key: "hunt",
    imageKey: TENTEN_IMAGE_KEYS.fateHunt,
    age: { tr: "II. Bölüm", en: "Part II" },
    title: { tr: "Kum'a destek, sonra uzun bir arama", en: "Backup to the Sand, then a long search" },
    text: {
      tr: "Guy Takımı, Gaara kaçırıldığında Kum'a giden destek koluydu; yolda kendi kopyalarıyla dövüşmek zorunda kaldılar — Tenten'in karşısına tam olarak kendi cephanesi çıktı. Sonrasında Sasuke ve Itachi'nin izini süren arama takımlarında görev aldı. Bu dönemde cephanesini de yeniledi: I. Bölüm'ün birçok küçük tomarı tek büyük tomarda toplandı.",
      en: "When Gaara was taken, Team Guy went to the Sand as the backup column, and on the way they had to fight copies of themselves — what stood across from her was exactly her own arsenal. Afterwards she served on the squads that searched for Sasuke and Itachi. She rebuilt her kit in the same period: the many small scrolls of Part I were consolidated into a single large one.",
    },
  },
  {
    key: "war",
    imageKey: TENTEN_IMAGE_KEYS.fateWar,
    age: { tr: "17 yaş", en: "Age 17" },
    title: { tr: "Kutsal silahlar ve Neji'nin kaybı", en: "Treasured tools, and losing Neji" },
    text: {
      tr: "Dördüncü Büyük Şinobi Savaşı'nda müttefik kuvvetlerin ele geçirdiği Altı Yol Bilgesi araçları Tenten'e emanet edildi: silah uzmanına silahların en büyüğü. Bashōsen tek savuruşta beş elementten birini üretiyordu ama taşıyıcısının çakrasını içiyordu; Tenten yelpazeyi ancak kısa süre taşıyabildi. Aynı savaşta Neji, Naruto ve Hinata'yı korurken öldü — hedefi gören göz gitti, atışı yapan el kaldı.",
      en: "In the Fourth Great Shinobi War the Sage of Six Paths' treasured tools, recovered by the allied forces, were entrusted to her: the largest weapons there were, handed to the weapons specialist. The Bashōsen produced any of the five natures in one sweep but drank its bearer's chakra, and she could carry it only briefly. In the same war Neji was killed shielding Naruto and Hinata — the eye that found the target was gone, and the hand that made the throw remained.",
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

/**
 * ⚠️ Kapanışta TEK alıntı var ve o alıntı Tenten'e ait değil: Might Guy'ın
 * değerlendirmesi, kaynağı elimizdeki AniList künye metni. İkinci blok
 * bilerek tırnaksız — arşivin kendi cümlesi, replik gibi görünmesin diye
 * bileşende de blockquote olarak DEĞİL, imzalı bir kapanış notu olarak
 * çiziliyor (BRIEF §9: emin olmadığın repliği koyma).
 */
export const TENTEN_CLOSING = {
  quote: {
    text: {
      tr: "Yüz atıştan yüzünde tam ortayı vurur.",
      en: "She can hit a bullseye 100 out of 100 times.",
    },
    by: { tr: "Might Guy", en: "Might Guy" },
    source: {
      tr: "AniList künye metninde kayıtlı değerlendirme",
      en: "As recorded in the AniList profile text",
    },
  },
  note: {
    text: {
      tr: "Takımının iki üyesi efsane oldu. Üçüncüsü, kimsenin ona vermediği bir unvanla kaldı: hiç ıskalamayan.",
      en: "Two members of her team became legends. The third kept a title nobody ever handed her: the one who never missed.",
    },
    by: { tr: "Arşivin notu", en: "The archive's note" },
  },
  motto: "百発百中",
  mottoNote: {
    tr: "hyappatsu-hyakuchū — “yüz atış, yüz isabet”",
    en: "hyappatsu-hyakuchū — “a hundred shots, a hundred hits”",
  },
  credit: {
    tr: "Künye verileri (doğum günü, boy, kan grubu, yaş, rütbe), yüz atışlık isabet ölçüsü ve yedek portre AniList'ten alınmıştır. Sayfadaki tam boy portre arşivin kendi yüklemesidir; parşömen, sekiz silah silueti, hedef tahtası, püskül ve ejderha şeritleri bu sayfa için elle çizilmiş SVG'lerdir.",
    en: "Profile data (birthday, height, blood type, age, rank), the hundred-out-of-hundred measure and the fallback portrait come from AniList. The full-size portrait is the archive's own upload; the scroll, the eight weapon silhouettes, the target board, the tassel and the dragon ribbons are SVGs drawn by hand for this page.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList profile" },
} as const;
