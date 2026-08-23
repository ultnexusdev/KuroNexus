import type { LocalizedText } from "./types";

/**
 * Shikamaru Nara — "200 Hamlelik Tahta" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 2007 kaydının ABILITY yuvaları,
 * `shikamaru:*` anahtarlarıyla. Görsel bağlı değilse bölüm görselsiz ama
 * AYAKTA çizilir; hiçbir bölüm yükleme bekleyerek çökmez.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Boy (170 cm), kan grubu (AB), doğum günü (22 Eylül), yaş (13 / 16) ve
 * rütbe satırı AniList künyesinden birebir alındı (22 Ağustos 2026'da
 * önbellekten çekilen `anilist-detay.json`, karakter 2007). 200 üstü IQ
 * ölçümü de aynı künyenin açıklama metninde geçiyor — uydurma değil.
 * Kilo AniList kaydında YOK, bu yüzden künye şeridinde de yok.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada yalnızca iki replik var ve ikisi de konuşanına atfedilmiş.
 * Emin olunmayan hiçbir cümle tırnak içine alınmadı: dövüşün ayrıntıları
 * arşivin kendi anlatımı olarak, düz metin hâlinde yazıldı.
 */

export const SHIKAMARU_ID = 2007;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const SHIKAMARU_SITE_URL = "https://anilist.co/character/2007";

/**
 * Sergi görselleri — hepsi characterId 2007 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `shikamaru:` önekli (kurator modu şartı).
 */
export const SHIKAMARU_IMAGE_KEYS = {
  /** Hero: geniş, çoğu boş gökyüzü; sağ altta duman ve kor (16:9) */
  hero: "shikamaru:hero",
  kagemane: "shikamaru:kagemane",
  kageNui: "shikamaru:kage-nui",
  kageKubi: "shikamaru:kage-kubi",
  pouchTags: "shikamaru:pouch-tags",
  pouchBlades: "shikamaru:pouch-blades",
  pouchMind: "shikamaru:pouch-mind",
  pouchTrio: "shikamaru:pouch-trio",
  move1: "shikamaru:move-1",
  move2: "shikamaru:move-2",
  move3: "shikamaru:move-3",
  move4: "shikamaru:move-4",
  move5: "shikamaru:move-5",
  fateChunin: "shikamaru:fate-chunin",
  fateCommand: "shikamaru:fate-command",
  fateAsuma: "shikamaru:fate-asuma",
  fateRevenge: "shikamaru:fate-revenge",
  fateWar: "shikamaru:fate-war",
  closing: "shikamaru:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const SHIKAMARU_SLOT_LABELS: Record<string, LocalizedText> = {
  [SHIKAMARU_IMAGE_KEYS.hero]: {
    tr: "Hero — geniş gökyüzü kadrajı, figür küçük (16:9)",
    en: "Hero — wide empty sky, small figure (16:9)",
  },
  [SHIKAMARU_IMAGE_KEYS.kagemane]: {
    tr: "Kagemane no Jutsu — uzayan gölge bağı",
    en: "Kagemane no Jutsu — the stretching shadow",
  },
  [SHIKAMARU_IMAGE_KEYS.kageNui]: {
    tr: "Kage Nui no Jutsu — gölge dikişleri",
    en: "Kage Nui no Jutsu — shadow stitches",
  },
  [SHIKAMARU_IMAGE_KEYS.kageKubi]: {
    tr: "Kage Kubi Shibari — gölgenin boyna dolanışı",
    en: "Kage Kubi Shibari — the shadow at the throat",
  },
  [SHIKAMARU_IMAGE_KEYS.pouchTags]: {
    tr: "Yanıcı etiketler ve sigara dumanı",
    en: "Explosive tags and cigarette smoke",
  },
  [SHIKAMARU_IMAGE_KEYS.pouchBlades]: {
    tr: "Asuma'nın çakra bıçakları",
    en: "Asuma's chakra blades",
  },
  [SHIKAMARU_IMAGE_KEYS.pouchMind]: {
    tr: "Parmaklar birleşik, gözler kapalı — düşünme duruşu",
    en: "Fingers joined, eyes shut — the thinking stance",
  },
  [SHIKAMARU_IMAGE_KEYS.pouchTrio]: {
    tr: "Ino-Shika-Chō üçlü formasyonu",
    en: "The Ino-Shika-Chō formation",
  },
  [SHIKAMARU_IMAGE_KEYS.move1]: {
    tr: "1. hamle — ikilinin ayrılması",
    en: "Move 1 — splitting the pair",
  },
  [SHIKAMARU_IMAGE_KEYS.move2]: {
    tr: "2. hamle — kan ve tören dairesi",
    en: "Move 2 — blood and the ritual circle",
  },
  [SHIKAMARU_IMAGE_KEYS.move3]: {
    tr: "3. hamle — gölge, daireden çıkarır",
    en: "Move 3 — the shadow drags him out",
  },
  [SHIKAMARU_IMAGE_KEYS.move4]: {
    tr: "4. hamle — Nara ormanındaki patlama",
    en: "Move 4 — the blast in the Nara forest",
  },
  [SHIKAMARU_IMAGE_KEYS.move5]: {
    tr: "5. hamle — çukur ve kapanan toprak",
    en: "Move 5 — the pit and the closing earth",
  },
  [SHIKAMARU_IMAGE_KEYS.fateChunin]: {
    tr: "Chūnin sınavı — pes eden el",
    en: "Chūnin exam — the raised hand",
  },
  [SHIKAMARU_IMAGE_KEYS.fateCommand]: {
    tr: "İlk komutanlık — Sasuke'yi geri getirme takımı",
    en: "First command — the Sasuke retrieval squad",
  },
  [SHIKAMARU_IMAGE_KEYS.fateAsuma]: {
    tr: "Asuma'nın son sigarası",
    en: "Asuma's last cigarette",
  },
  [SHIKAMARU_IMAGE_KEYS.fateRevenge]: {
    tr: "İntikam planının uygulandığı orman",
    en: "The forest where the plan was executed",
  },
  [SHIKAMARU_IMAGE_KEYS.fateWar]: {
    tr: "Savaş karargâhı — masadaki harita",
    en: "War headquarters — the map on the table",
  },
  [SHIKAMARU_IMAGE_KEYS.closing]: {
    tr: "Kapanış — boş tahta ve sönen kor",
    en: "Closing — the empty board and the dying ember",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const SHIKAMARU_IDENTITY = {
  name: "Shikamaru Nara",
  nativeName: "奈良シカマル",
  /** Hero filigranı — dikey sütun, dekoratif (aria-hidden) */
  watermark: "影縛りの術",
  clan: { tr: "Nara Klanı", en: "Nara Clan" },
  epigraph: {
    tr: "Bir hamlede kazanmayı hiç denemedi. İki yüz hamle sonrasını görmeyi denedi.",
    en: "He never tried to win in one move. He tried to see two hundred moves ahead.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "22 Eylül", en: "22 September" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "170 cm", en: "170 cm" },
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
      value: {
        tr: "Genin (I) → Chūnin (II) → Hokage danışmanı (III)",
        en: "Genin (I) → Chūnin (II) → advisor to the Hokage (III)",
      },
    },
    {
      label: { tr: "Takım", en: "Team" },
      value: {
        tr: "10. Takım — Asuma, Chōji, Ino",
        en: "Team 10 — Asuma, Chōji, Ino",
      },
    },
    {
      label: { tr: "Ölçülen zekâ", en: "Measured intellect" },
      value: {
        tr: "200 üstü IQ — ölçen: Asuma",
        en: "IQ above 200 — measured by Asuma",
      },
    },
    {
      label: { tr: "Yanında taşıdığı", en: "What he carries" },
      value: {
        tr: "Bir çakmak, bir shogi taşı",
        en: "A lighter and a shogi piece",
      },
    },
  ],
} as const;

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

export const SHIKAMARU_SHADOW_TEXT = {
  enter: { tr: "Gölge modu", en: "Shadow mode" },
  exit: { tr: "Gölgeyi çöz", en: "Release the shadow" },
  hint: {
    tr: "Sayfadaki her şeyin gölgesi uzar ve birbirine bağlanır.",
    en: "Every shadow on the page stretches out and joins the rest.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const SHIKAMARU_HERO = {
  lede: {
    tr: "Bulut seyretmeyi iş edinmiş bir çocuk. Aynı çocuk, on altı yaşında bir savaşın en soğukkanlı planını kurdu.",
    en: "A boy whose occupation was watching clouds. The same boy, at sixteen, drew up the coldest plan of a war.",
  },
  emberCaption: {
    tr: "Sayfadaki tek sıcak nokta: bir sigaranın koru.",
    en: "The only warm point on this page: the ember of a cigarette.",
  },
  portraitAlt: {
    tr: "Shikamaru Nara — arşive yüklenmiş kadro portresi",
    en: "Shikamaru Nara — cast portrait uploaded to the archive",
  },
  portraitAltFallback: {
    tr: "Shikamaru Nara — AniList künye portresi",
    en: "Shikamaru Nara — AniList profile portrait",
  },
} as const;

/**
 * Görsel alt metinleri — BRIEF §3.5: her alt iki dilli ve KAYNAĞINI söyler.
 * Yoldaş portrelerinin tamamı kendi veritabanımızdan geliyor (PORTRAIT
 * yuvası), bu yüzden tek bir son ek yetiyor.
 */
export const SHIKAMARU_ALT = {
  pieceSuffix: {
    tr: "— arşive yüklenmiş kadro portresi",
    en: "— cast portrait uploaded to the archive",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const SHIKAMARU_CRUMB = {
  naruto: { tr: "Naruto Evreni", en: "Naruto Universe" },
} as const;

export const SHIKAMARU_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "The record" },
    lede: {
      tr: "Tembel diye anılan bir tutanak. Rakamlar ise başka bir şey söylüyor.",
      en: "A file filed under lazy. The numbers say something else.",
    },
  },
  pieces: {
    title: { tr: "Tahtadaki taşlar", en: "Pieces on the board" },
    lede: {
      tr: "Shikamaru'nun hesabı hiçbir zaman tek kişilik olmadı: her taşın hareket biçimi ayrı, her taşın bedeli ayrı.",
      en: "His arithmetic was never solitary: every piece moves differently, and every piece costs something different.",
    },
  },
  jutsu: {
    title: { tr: "Gölgenin üç biçimi", en: "Three shapes of the shadow" },
    lede: {
      tr: "Nara klanının tekniği tek bir fikrin üç ayarı: gölgeyi uzat, bağla, karar anını elinden al.",
      en: "The Nara clan technique is one idea at three settings: stretch the shadow, bind with it, take away the moment of choice.",
    },
  },
  pouch: {
    title: { tr: "Çantadakiler", en: "In the pouch" },
    lede: {
      tr: "Gölge tek başına yeterli değil. Onu işe yarar kılan dört şey.",
      en: "The shadow alone is not enough. Four things make it work.",
    },
  },
  chain: {
    title: { tr: "İki yüz hamlelik tahta", en: "The two-hundred-move board" },
    lede: {
      tr: "Asuma'nın ölümünden sonra kurduğu plan beş hamleydi ve hiçbiri öfkeli değildi. Hamleleri sırayla aç: tahtada taş ilerler, gölge bağı uzar.",
      en: "The plan he built after Asuma's death was five moves long, and not one of them was angry. Step through them: the piece advances, the shadow lengthens.",
    },
  },
  fate: {
    title: { tr: "Ömür çizelgesi", en: "A life in five entries" },
    lede: {
      tr: "Beş kayıt. İkisi yenilgi, biri cenaze, biri hesaplaşma, sonuncusu bir masa başı.",
      en: "Five entries. Two defeats, one funeral, one reckoning, and a desk at the end.",
    },
  },
} as const;

/* ── Tahtadaki taşlar (yoldaş portreleri) ───────────────────────────────── */

/**
 * `characterId` alanları `EXPERIENCE_COMPANIONS[2007]` listesiyle birebir
 * aynı: 4775 Asuma, 2008 Chōji, 2009 Ino, 2174 Temari, 17 Naruto,
 * 3178 Kakuzu. Portre kaydı olmayan taş adıyla çizilir, bölüm çökmez.
 *
 * `side: "enemy"` olan taş shogi tahtasındaki karşı taraf taşı gibi ters
 * yönde çizilir (bileşende `data-side`).
 */
export const SHIKAMARU_PIECES = [
  {
    characterId: 4775,
    name: "Asuma Sarutobi",
    side: "ally" as const,
    role: { tr: "Tahtayı kuran", en: "The one who set the board" },
    note: {
      tr: "Öğretmeni. Shogi oynarken sordu: bu tahtada kral kimdir? Cevabı Shikamaru yıllar sonra buldu.",
      en: "His teacher. Over a shogi board he asked: who is the king here? Shikamaru found the answer years later.",
    },
  },
  {
    characterId: 2008,
    name: "Chōji Akimichi",
    side: "ally" as const,
    role: { tr: "Kanat", en: "The wing" },
    note: {
      tr: "En eski arkadaşı. Shikamaru'nun planlarında her zaman ilk güvendiği ağırlık.",
      en: "His oldest friend, and the weight he leans on first in every plan.",
    },
  },
  {
    characterId: 2009,
    name: "Ino Yamanaka",
    side: "ally" as const,
    role: { tr: "Kanat", en: "The wing" },
    note: {
      tr: "Zihinden zihne geçen taş. Üçlünün konuşan tarafı, Shikamaru'nun susan tarafını tamamlar.",
      en: "The piece that moves mind to mind. The talker of the trio, completing the one who stays quiet.",
    },
  },
  {
    characterId: 2174,
    name: "Temari",
    side: "ally" as const,
    role: { tr: "Karşı taraftan gelen", en: "The one who came from the other side" },
    note: {
      tr: "Chūnin sınavında karşısındaki rakipti. Sonraki yılların çoğunda aynı tarafta durdular.",
      en: "She was the opponent across the Chūnin exam floor. For most of the years after, she stood on his side.",
    },
  },
  {
    characterId: 17,
    name: "Naruto Uzumaki",
    side: "ally" as const,
    role: { tr: "Kral", en: "The king" },
    note: {
      tr: "Korunacak taş. Sonunda köyün başına geçti; Shikamaru masanın yanındaki sandalyeyi seçti.",
      en: "The piece to be protected. He ended up leading the village; Shikamaru chose the chair beside the desk.",
    },
  },
  {
    characterId: 3178,
    name: "Kakuzu",
    side: "enemy" as const,
    role: { tr: "Karşı taş", en: "The opposing piece" },
    note: {
      tr: "Asuma'yı öldüren ikilinin diğer yarısı. Planın ilk hamlesi onu sahnenin dışına almaktı.",
      en: "The other half of the pair that killed Asuma. The plan's first move was to take him off the stage.",
    },
  },
] as const;

/* ── Gölgenin üç biçimi ─────────────────────────────────────────────────── */

export const SHIKAMARU_JUTSU = [
  {
    key: "kagemane" as const,
    kanji: "影真似の術",
    name: "Kagemane no Jutsu",
    turkish: { tr: "Gölge Taklidi", en: "Shadow Imitation" },
    tagline: {
      tr: "Klanın imzası: gölgeni uzat, onunkine değ, hareketini ele geçir.",
      en: "The clan signature: stretch your shadow, touch theirs, take their movement.",
    },
    text: {
      tr: "Bağ kurulduğu anda iki beden tek irade olur — ama o irade Shikamaru'nunki değildir, ortak bir kilittir: rakip ne yaparsa Shikamaru da onu yapar. Menzil ışığa bağlıdır; gölge uzadıkça çakra erir, o yüzden bu teknik bir kazanma yolu değil, kazanmak için gereken saniyeleri satın alma yoludur.",
      en: "The instant the link takes, two bodies share one motion — but that motion is not his; it is a mutual lock, and he must move too. Range depends on light, and chakra burns as the shadow stretches. This is not a way to win: it is a way to buy the seconds winning requires.",
    },
    traits: [
      { tr: "Menzil ışığa bağlı", en: "Range depends on light" },
      { tr: "Çift taraflı kilit", en: "A lock that binds both" },
      { tr: "Saniye satın alır", en: "Buys seconds" },
    ],
  },
  {
    key: "kageNui" as const,
    kanji: "影縫いの術",
    name: "Kage Nui no Jutsu",
    turkish: { tr: "Gölge Dikişi", en: "Shadow Sewing" },
    tagline: {
      tr: "Tek bağ yetmediğinde: gölge inceltilip birden çok mızrağa bölünür.",
      en: "When one tether is not enough: the shadow thins out into many spears.",
    },
    text: {
      tr: "Gölge burada tutmak için değil, saplamak ve taşımak için kullanılır. Aynı anda birden fazla hedefe uzanır, bir cismi havada tutar, bir düşmanı istenen kareye sürükler. Shikamaru'nun en çok işine yarayan tarafı budur: gölge artık yalnızca bir kelepçe değil, bir el.",
      en: "Here the shadow is not for holding but for piercing and carrying. It reaches several targets at once, suspends an object in the air, drags an enemy onto the square he wants. That is its real value to him: the shadow stops being a handcuff and becomes a hand.",
    },
    traits: [
      { tr: "Çok hedefli", en: "Multiple targets" },
      { tr: "Taşır ve sürükler", en: "Carries and drags" },
      { tr: "Kilit değil, el", en: "A hand, not a lock" },
    ],
  },
  {
    key: "kageKubi" as const,
    kanji: "影首縛りの術",
    name: "Kage Kubi Shibari no Jutsu",
    turkish: { tr: "Gölge Boyun Bağı", en: "Shadow Neck Bind" },
    tagline: {
      tr: "Bağın son ayarı: gölge yerden kalkar ve boğaza dolanır.",
      en: "The final setting: the shadow leaves the ground and closes on the throat.",
    },
    text: {
      tr: "Gölge taklidinin devamı — tutulan bedene yükselen bir el şekli verir ve boynuna kilitlenir. Shikamaru bunu neredeyse hiç sonuna kadar götürmedi; tekniğin asıl işlevi, karşı tarafa bir sonraki hamlenin ne olacağını göstermekti. Tehdit uygulanmadan da çalışır, yeter ki inandırıcı olsun.",
      en: "The continuation of the imitation: the held shadow rises into the shape of a hand and closes on the neck. He almost never carried it through. The technique's real function was to show the opponent what the next move would be — a threat works unexecuted, as long as it is credible.",
    },
    traits: [
      { tr: "Yerden yükselir", en: "Rises off the ground" },
      { tr: "Nadiren tamamlanır", en: "Rarely completed" },
      { tr: "Asıl işi ikna", en: "Its real work is persuasion" },
    ],
  },
] as const;

/* ── Çantadakiler ───────────────────────────────────────────────────────── */

export const SHIKAMARU_POUCH = [
  {
    key: "tags" as const,
    imageKey: SHIKAMARU_IMAGE_KEYS.pouchTags,
    name: { tr: "Yanıcı etiketler ve sigara", en: "Explosive tags and a cigarette" },
    note: {
      tr: "Etiketler tuzağı kurar, sigara ise ölçü aletidir: dumanın nereye gittiğini gören, rüzgârı ve gölgenin uzayacağı yönü de görür.",
      en: "The tags set the trap; the cigarette is a measuring instrument. Whoever watches where the smoke drifts also reads the wind — and the direction the shadow will take.",
    },
  },
  {
    key: "blades" as const,
    imageKey: SHIKAMARU_IMAGE_KEYS.pouchBlades,
    name: { tr: "Asuma'nın çakra bıçakları", en: "Asuma's chakra blades" },
    note: {
      tr: "Öğretmeninden kalan iki bıçak. Chakra ile keskinleşen ağızları Shikamaru'nun elinde gölgeyle birlikte çalışır: bağ tutar, bıçak çalışır.",
      en: "Two blades left by his teacher. Their chakra-sharpened edges work together with the shadow in his hands: the tether holds, the blade does the rest.",
    },
  },
  {
    key: "mind" as const,
    imageKey: SHIKAMARU_IMAGE_KEYS.pouchMind,
    name: { tr: "Taktik zekâ — 200 üstü", en: "Tactical mind — above 200" },
    note: {
      tr: "Asuma öğrencisinin zekâsını ölçtüğünde 200'ün üstünü buldu; kötü notlarının sebebi kalemi kaldırmayı zahmetli bulmasıydı. Gözler kapalı, parmaklar birleşik: düşünme duruşu.",
      en: "When Asuma measured his student he found an IQ above 200; the poor grades came from finding a pencil too heavy to lift. Eyes shut, fingertips joined: the thinking stance.",
    },
  },
  {
    key: "trio" as const,
    imageKey: SHIKAMARU_IMAGE_KEYS.pouchTrio,
    name: { tr: "Ino-Shika-Chō üçgeni", en: "The Ino-Shika-Chō triangle" },
    note: {
      tr: "Babalarının kurduğu formasyon, çocuklarında tekrarlandı: zihin, gölge ve ağırlık. Üçü ayrı ayrı orta hâlli, birlikte tek bir kıskaç.",
      en: "The formation their fathers ran, repeated by the children: mind, shadow and weight. Ordinary apart; a single pincer together.",
    },
  },
] as const;

/* ── Hamle zinciri — sayfanın kalbi ─────────────────────────────────────── */

export const SHIKAMARU_CHAIN_UI = {
  listLabel: { tr: "Planın hamleleri", en: "Moves of the plan" },
  moveWord: { tr: "hamle", en: "move" },
  prev: { tr: "Önceki hamle", en: "Previous move" },
  next: { tr: "Sonraki hamle", en: "Next move" },
  readLabel: { tr: "Okuma", en: "Reading" },
  answerLabel: { tr: "Karşı hamle", en: "Reply" },
  keyboardHint: {
    tr: "Sol/sağ ok tuşlarıyla da gezebilirsin.",
    en: "The left and right arrow keys work too.",
  },
  boardAlt: {
    tr: "Shogi tahtası şeması: Shikamaru'nun taşı ilerledikçe gölge bağı uzar ve dallanır.",
    en: "Shogi board diagram: as Shikamaru's piece advances, the shadow tether lengthens and branches.",
  },
} as const;

/**
 * Beş hamle.
 *
 * ⚠️ Doğruluk notu: Asuma'yı öldüren ikili Hidan ve Kakuzu'ydu. Shikamaru
 * kendi hesabını HİDAN'la gördü; Kakuzu aynı gün Naruto ve Kakashi'nin
 * takımına kaldı. Sayfa bu ayrımı gizlemiyor — planın birinci hamlesi
 * zaten ikiliyi ayırmaktı.
 *
 * `piece` / `enemy`: tahta şemasındaki kare koordinatları (0-8 aralığında
 * sütun ve satır; 0 üstte). Şemanın geometrisi ShadowBoard.tsx'te.
 */
export const SHIKAMARU_MOVES = [
  {
    key: "split" as const,
    imageKey: SHIKAMARU_IMAGE_KEYS.move1,
    piece: { col: 4, row: 7 },
    title: { tr: "İkiliyi ayır", en: "Split the pair" },
    read: {
      tr: "Yan yana durdukları sürece tahtada iki kral var: biri ölmüyor, diğeri beş ayrı kalple beş ayrı yönden biçiyor. Hesap ancak teke inince tutar.",
      en: "Side by side they are two kings: one that cannot die, one that cuts from five directions with five hearts. The arithmetic only closes when the board holds a single target.",
    },
    answer: {
      tr: "Shikamaru tek başına, açıkta çekilir. Hidan kurbanını bırakmaz ve peşinden gelir; Kakuzu geride, Kakashi'nin takımına kalır.",
      en: "Shikamaru withdraws alone and in the open. Hidan never leaves a sacrifice behind and follows; Kakuzu stays back, left to Kakashi's team.",
    },
  },
  {
    key: "blood" as const,
    imageKey: SHIKAMARU_IMAGE_KEYS.move2,
    piece: { col: 4, row: 6 },
    title: { tr: "Kanı ver", en: "Give up the blood" },
    read: {
      tr: "Hidan'ın laneti kurbanın kanını ve zemine çizilmiş bir daireyi şart koşar. Shikamaru bu şartı bozmaya çalışmaz; kabul eder. Çünkü lanet kurulduğu anda Hidan da o dairenin içine çivilenir.",
      en: "Hidan's curse requires the victim's blood and a circle drawn on the ground. Shikamaru does not try to deny it — he grants it. The moment the curse takes hold, Hidan is nailed inside that circle too.",
    },
    answer: {
      tr: "Kan alınır, daire çizilir, mızrak kendi bedenine iner. Acı Shikamaru'ya geçer — ama karşı taraf artık tek bir kareden ibarettir.",
      en: "The blood is taken, the circle is drawn, the spear goes into his own body. The pain crosses over to Shikamaru — and the opponent is now no larger than a single square.",
    },
  },
  {
    key: "drag" as const,
    imageKey: SHIKAMARU_IMAGE_KEYS.move3,
    piece: { col: 4, row: 5 },
    title: { tr: "Daireden çıkar", en: "Drag him out of the circle" },
    read: {
      tr: "Lanetin tek bir açığı var: yalnızca dairenin içinde işliyor. Yani asıl hedef Hidan'ın canı değil, ayağının bastığı yer.",
      en: "The curse has exactly one flaw: it only works inside the circle. So the target was never Hidan's life — it was the ground under his feet.",
    },
    answer: {
      tr: "Kagemane no Jutsu. Gölge uzar, karşı gölgeye değer ve Hidan'a tek bir adım attırır. Bir adım yeter: bağ kopar, Shikamaru serbesttir.",
      en: "Kagemane no Jutsu. The shadow stretches, touches its twin, and makes Hidan take one step. One step is enough: the link snaps and Shikamaru is free.",
    },
  },
  {
    key: "forest" as const,
    imageKey: SHIKAMARU_IMAGE_KEYS.move4,
    piece: { col: 5, row: 4 },
    title: { tr: "Ormana çek", en: "Pull him into the forest" },
    read: {
      tr: "Kalan sorun ölümsüz bir bedeni parçalara ayırmak. Bunu bir şinobi tek başına yapamaz; ama arazi yapabilir. Nara ormanı klanın toprağı — ve günler önce döşenmişti.",
      en: "The remaining problem is tearing apart a body that cannot die. No single shinobi can do that; terrain can. The Nara forest is clan ground — and it had been rigged days earlier.",
    },
    answer: {
      tr: "Ağaç gövdelerindeki yanıcı etiketler aynı anda tutuşur. Hidan ölmez — ölemez — ama patlama onu bir arada tutan her şeyi dağıtır.",
      en: "Every explosive tag on every trunk goes off at once. Hidan does not die — he cannot — but the blast scatters whatever was holding him together.",
    },
  },
  {
    key: "burial" as const,
    imageKey: SHIKAMARU_IMAGE_KEYS.move5,
    piece: { col: 4, row: 3 },
    title: { tr: "Tahtadan kaldır", en: "Take him off the board" },
    read: {
      tr: "Ölümsüz bir düşman öldürülmez, kaldırılır. Ceza ölüm değil: kimsenin duymayacağı, sonu olmayan bir sessizliktir.",
      en: "An immortal enemy is not killed; he is removed. The sentence is not death — it is a silence with no end and no listener.",
    },
    answer: {
      tr: "Gölge dikişleri parçaları derin bir çukura indirir, toprak üstüne kapanır. Sonra Shikamaru öğretmeninden kalan paketten bir sigara yakar ve dumanın ağaçların arasından yükselişini izler.",
      en: "Shadow stitches lower the pieces into a deep pit and the earth closes over them. Then Shikamaru lights a cigarette from his teacher's pack and watches the smoke climb through the trees.",
    },
  },
] as const;

/* ── Ömür çizelgesi ─────────────────────────────────────────────────────── */

/**
 * Çizelge satırı. `quote` opsiyonel — beş kaydın yalnızca birinde replik
 * var (`as const` bir birleşim tipi üretip opsiyonel alanı gizlediği için
 * satır tipi burada açıkça yazıldı).
 */
export interface ShikamaruFateEntry {
  key: string;
  imageKey: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: LocalizedText };
}

export const SHIKAMARU_TIMELINE: ShikamaruFateEntry[] = [
  {
    key: "chunin" as const,
    imageKey: SHIKAMARU_IMAGE_KEYS.fateChunin,
    age: { tr: "13 yaş", en: "Age 13" },
    title: {
      tr: "Pes eden tek kişi — terfi eden tek kişi",
      en: "The only one who quit — the only one promoted",
    },
    text: {
      tr: "Chūnin sınavının finalinde rakibini gölgesine almıştı; kazanmasına bir hamle kalmışken çakrası bittiği için elini kaldırıp çekildi. O turnuvadan chūnin rütbesiyle çıkan tek aday oydu: jüri kazanana değil, durumu doğru okuyana baktı.",
      en: "In the Chūnin exam final he had his opponent inside his shadow; one move from winning, out of chakra, he raised his hand and withdrew. He was the only candidate promoted from that tournament: the judges were not looking for a winner, but for someone who read the situation correctly.",
    },
  },
  {
    key: "command" as const,
    imageKey: SHIKAMARU_IMAGE_KEYS.fateCommand,
    age: { tr: "13 yaş", en: "Age 13" },
    title: { tr: "İlk komutanlık, ilk başarısızlık", en: "First command, first failure" },
    text: {
      tr: "Sasuke'yi geri getirme görevinde beş kişilik takımın komutanı yapıldı. Sasuke geri gelmedi; takımın tamamı ağır yaralı döndü. Shikamaru bir daha kimseyi yönetmek istemediğini söyledi — sonra fikrini değiştirip daha iyi bir komutan olmaya karar verdi.",
      en: "On the mission to bring Sasuke back he was made commander of a five-man team. Sasuke did not come back, and every member returned badly wounded. Shikamaru said he never wanted to lead anyone again — then changed his mind and decided to become a better commander instead.",
    },
  },
  {
    key: "asuma" as const,
    imageKey: SHIKAMARU_IMAGE_KEYS.fateAsuma,
    age: { tr: "16 yaş", en: "Age 16" },
    title: { tr: "Asuma'nın ölümü", en: "Asuma's death" },
    text: {
      tr: "Öğretmeni Akatsuki'nin ölümsüz ikilisiyle karşılaşmada öldürüldü. Son sözleri bir shogi dersinin devamıydı: korunacak olan kral, köyün henüz doğmamış çocuklarıdır. Shikamaru cenazenin ardından ağlamadı; bir sigara yaktı ve hesabı yapmaya oturdu.",
      en: "His teacher was killed in the encounter with Akatsuki's immortal pair. His last words continued an old shogi lesson: the king to be protected is the village's unborn children. Shikamaru did not weep after the funeral. He lit a cigarette and sat down to do the arithmetic.",
    },
    quote: {
      text: {
        tr: "Bu tahtada kral kimdir, biliyor musun?",
        en: "Do you know who the king on this board is?",
      },
      by: { tr: "Asuma Sarutobi", en: "Asuma Sarutobi" },
    },
  },
  {
    key: "revenge" as const,
    imageKey: SHIKAMARU_IMAGE_KEYS.fateRevenge,
    age: { tr: "16 yaş", en: "Age 16" },
    title: { tr: "Hesabın kapatılması", en: "Closing the account" },
    text: {
      tr: "Beş hamlelik plan uygulandı: ikili ayrıldı, lanet kendi dairesine hapsedildi, orman patladı, çukur kapandı. Kakuzu'yu aynı gün başkaları durdurdu — Shikamaru'nun payına düşen, intikamın en sessiz kısmıydı.",
      en: "The five-move plan was executed: the pair was split, the curse was trapped inside its own circle, the forest went up, the pit closed. Kakuzu was stopped the same day by others — Shikamaru's share was the quietest part of the revenge.",
    },
  },
  {
    key: "war" as const,
    imageKey: SHIKAMARU_IMAGE_KEYS.fateWar,
    age: { tr: "Sonrası", en: "After" },
    title: { tr: "Savaş masası, sonra Hokage'nin yanı", en: "The war table, then the chair beside the Hokage" },
    text: {
      tr: "Dördüncü Büyük Şinobi Savaşı'nda müttefik kuvvetlerin karargâhında stratejist olarak görev aldı; babasının yanında, sonra onun yerine. Savaştan sonra ön safa değil masaya döndü: Yedinci Hokage'nin danışmanı — kralı koruyan taş.",
      en: "In the Fourth Great Shinobi War he served as a strategist at the allied headquarters, beside his father and then in his place. After the war he returned not to the front but to the desk: advisor to the Seventh Hokage — the piece that guards the king.",
    },
  },
] as const;

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const SHIKAMARU_CLOSING = {
  quotes: [
    {
      text: { tr: "Ne zahmet ya…", en: "What a drag…" },
      by: { tr: "Shikamaru Nara", en: "Shikamaru Nara" },
      note: {
        tr: "Bir ömür boyu tekrarladığı cümle — ve her seferinde işi yine de yaptı.",
        en: "The line he repeated his whole life — and he did the work anyway, every time.",
      },
    },
    {
      text: {
        tr: "Bu tahtada kral kimdir, biliyor musun?",
        en: "Do you know who the king on this board is?",
      },
      by: { tr: "Asuma Sarutobi", en: "Asuma Sarutobi" },
      note: {
        tr: "Cevabı öğretmeni öldükten sonra verdi: kral, henüz doğmamış olandır.",
        en: "He answered it only after his teacher was gone: the king is the one not yet born.",
      },
    },
  ],
  motto: "めんどくせー",
  mottoNote: {
    tr: "mendokusē — “ne zahmet”",
    en: "mendokusē — “what a drag”",
  },
  credit: {
    tr: "Künye verileri (doğum, boy, kan grubu, yaş, rütbe) ve yedek portre AniList'ten alınmıştır. Sayfadaki tam boy portre arşivin kendi yüklemesidir; tahta, gölge bağı ve duman bu sayfa için elle çizilmiş SVG'lerdir.",
    en: "Profile data (birthday, height, blood type, age, rank) and the fallback portrait come from AniList. The full-size portrait is the archive's own upload; the board, the shadow tether and the smoke are SVGs drawn by hand for this page.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList profile" },
} as const;
