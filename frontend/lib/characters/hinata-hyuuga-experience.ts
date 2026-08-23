import type { LocalizedText } from "./types";

/**
 * Hinata Hyūga — "360 derece ve bir kör nokta" deneyim sayfasının veri
 * iskeleti.
 *
 * Sayfanın BÜTÜN metni burada, iki dilli `LocalizedText` çiftleri olarak
 * (kural 1'in belgelenmiş uygulanışı, 6 Ağustos 2026 kararı). Bileşen
 * yalnızca `pick(text, locale)` çağırır; istemci adalarına düz dize iner.
 *
 * Görseller veritabanında: characterId 1555 kaydının ABILITY yuvaları,
 * `hinata:*` anahtarlarıyla (Itachi'deki `itachi:*` deseninin kardeşi).
 * Hiçbir bölüm görsele bağımlı değil — yuva boşken bölüm çizimle ayakta
 * kalır, çünkü sayfadaki bütün grafikler elle yazılmış SVG.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * Byakugan neredeyse tam bir küre görür; neredeyse. Ensede, kürenin
 * kapanmadığı bir derece vardır. Sayfanın kalbi olan görüş halkası bu
 * geometriyi birebir kullanıyor: eşit aralıklı tenketsu noktaları
 * çevreye dizilmiş, alt ortadaki nokta ise işaretli. Orası hem
 * Byakugan'ın anatomik kör noktası hem de klanın kendi yarası — yan dal
 * mührü, Hizashi, Neji.
 *
 * ── KÜNYE KAYNAĞI ────────────────────────────────────────────────────────
 * Doğum günü, boy, kan grubu, yaş aralığı, rütbe ve "Byakugan Prensesi"
 * lakabı AniList künyesinden (22 Ağustos 2026 önbelleği, karakter 1555).
 * Uydurulmuş künye satırı yok; databook'ta olup künyede olmayan değerler
 * (ör. kilo) bilerek yazılmadı.
 */

export const HINATA_ID = 1555;

/** Sayfada portresi görünen karakterler — `companions` propundan gelir. */
export const HINATA_COMPANION_IDS = {
  naruto: 17,
  neji: 1694,
  kiba: 3495,
  shino: 3428,
  kurenai: 4773,
} as const;

/** Portre alt metni ve etiket için ad tablosu (çeviri istemeyen özel adlar). */
export const HINATA_COMPANION_NAMES: Record<number, string> = {
  [HINATA_COMPANION_IDS.naruto]: "Naruto Uzumaki",
  [HINATA_COMPANION_IDS.neji]: "Neji Hyūga",
  [HINATA_COMPANION_IDS.kiba]: "Kiba Inuzuka",
  [HINATA_COMPANION_IDS.shino]: "Shino Aburame",
  [HINATA_COMPANION_IDS.kurenai]: "Kurenai Yūhi",
};

/**
 * Küratör yuvaları — hepsi characterId 1555 kaydının ABILITY satırında.
 *
 * Anahtar biçimi `hinata:<konu>`; aynı anahtara ikinci bir görsel
 * yüklenirse son yazan kazanır (`collectAbilityImages`).
 */
export const HINATA_IMAGE_KEYS = {
  /** Hero'nun arkasındaki geniş gece sahnesi (16:9) — portrenin ARKASINA gider */
  hero: "hinata:hero",
  juken: "hinata:juken",
  hakke64: "hinata:hakke64",
  shugohakke: "hinata:shugohakke",
  soshiken: "hinata:soshiken",
  kaiten: "hinata:kaiten",
  range: "hinata:byakugan-range",
  ointment: "hinata:ointment",
  blindSpot: "hinata:blind-spot",
  eraHeiress: "hinata:era-heiress",
  eraExam: "hinata:era-exam",
  eraPain: "hinata:era-pain",
  eraNeji: "hinata:era-neji",
  eraPath: "hinata:era-path",
} as const;

/** Küratör kutularının etiketleri — yöneticinin ne yükleyeceğini söyler. */
export const HINATA_SLOT_LABELS: Record<string, LocalizedText> = {
  [HINATA_IMAGE_KEYS.hero]: {
    tr: "Hero fonu — gece, ay ışığı, Hyūga konağı (16:9)",
    en: "Hero backdrop — night, moonlight, the Hyūga compound (16:9)",
  },
  [HINATA_IMAGE_KEYS.juken]: {
    tr: "Jūken — açık avuç vuruşu",
    en: "Jūken — the open-palm strike",
  },
  [HINATA_IMAGE_KEYS.hakke64]: {
    tr: "Hakke Rokujūyon Shō — altmış dört avuç dizisi",
    en: "Hakke Rokujūyon Shō — the sixty-four palm sequence",
  },
  [HINATA_IMAGE_KEYS.shugohakke]: {
    tr: "Shugohakke Rokujūyon Shō — koruyucu bıçak kubbesi",
    en: "Shugohakke Rokujūyon Shō — the protective dome",
  },
  [HINATA_IMAGE_KEYS.soshiken]: {
    tr: "Jūho Sōshiken — chakradan iki aslan başı",
    en: "Jūho Sōshiken — twin chakra lion heads",
  },
  [HINATA_IMAGE_KEYS.kaiten]: {
    tr: "Kaiten — dönen chakra kalkanı",
    en: "Kaiten — the spinning chakra shield",
  },
  [HINATA_IMAGE_KEYS.range]: {
    tr: "Byakugan menzili — damarlar kabarmış göz yakın kadraj",
    en: "Byakugan range — close crop of the veined eye",
  },
  [HINATA_IMAGE_KEYS.ointment]: {
    tr: "Merhem ve şifalı otlar",
    en: "Ointment and medicinal herbs",
  },
  [HINATA_IMAGE_KEYS.blindSpot]: {
    tr: "Kör nokta — yan dal mührü / kafesteki kuş",
    en: "The blind spot — the branch seal / caged bird",
  },
  [HINATA_IMAGE_KEYS.eraHeiress]: {
    tr: "Çizelge 1 — konakta eğitim, çocukluk",
    en: "Timeline 1 — training at the compound, childhood",
  },
  [HINATA_IMAGE_KEYS.eraExam]: {
    tr: "Çizelge 2 — Chūnin sınavı elemesi, Neji karşısında",
    en: "Timeline 2 — Chūnin exam prelims, facing Neji",
  },
  [HINATA_IMAGE_KEYS.eraPain]: {
    tr: "Çizelge 3 — Pain'in karşısında",
    en: "Timeline 3 — standing before Pain",
  },
  [HINATA_IMAGE_KEYS.eraNeji]: {
    tr: "Çizelge 4 — savaş alanı, Neji'nin fedakârlığı",
    en: "Timeline 4 — the battlefield, Neji's sacrifice",
  },
  [HINATA_IMAGE_KEYS.eraPath]: {
    tr: "Çizelge 5 — kendi yolu",
    en: "Timeline 5 — her own path",
  },
};

/* ── Hero ve kimlik ─────────────────────────────────────────────────── */

export const HINATA_IDENTITY = {
  /** Verilen ad yumuşak, soyad oyulmuş: tipografi ikisini ayrı sesle yazar */
  givenName: "Hinata",
  clanName: "Hyūga",
  nativeName: "日向ヒナタ",
  /** Hero filigranı — "beyaz göz" */
  watermark: "白眼",
  /** AniList künyesindeki lakap — ana dilde ve açıklamasıyla ayrı ayrı,
      çünkü `lang="ja"` yalnızca Japonca parçaya konmalı */
  aliasNative: "白眼の姫",
  alias: {
    tr: "Byakugan Prensesi",
    en: "the Byakugan Princess",
  },
  epigraph: {
    tr: "Neredeyse her yeri gören bir klanın kızı; ve o klanın göremediği tek noktanın adı.",
    en: "A daughter of the clan that sees almost everything — and the name of the one point they cannot see.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "27 Aralık", en: "December 27" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: {
        tr: "147 cm → 160 cm (I → II)",
        en: "147 cm → 160 cm (Part I → II)",
      },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "A", en: "A" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "13 – 16 (künye aralığı)", en: "13 – 16 (profile range)" },
    },
    {
      label: { tr: "Rütbe", en: "Rank" },
      value: { tr: "Genin (I) · Chūnin (II)", en: "Genin (I) · Chūnin (II)" },
    },
    {
      label: { tr: "Takım", en: "Team" },
      value: {
        tr: "Takım 8 — Kurenai, Kiba, Shino",
        en: "Team 8 — Kurenai, Kiba, Shino",
      },
    },
    {
      label: { tr: "Klan", en: "Clan" },
      value: {
        tr: "Hyūga — ana dal (宗家), en büyük kız",
        en: "Hyūga — main branch (宗家), eldest daughter",
      },
    },
    {
      label: { tr: "Lakap", en: "Alias" },
      value: { tr: "白眼の姫", en: "白眼の姫" },
    },
    {
      label: { tr: "Sembolü", en: "Token" },
      value: {
        tr: "Elde örülmüş kırmızı atkı",
        en: "A hand-knitted red scarf",
      },
    },
  ],
} as const;

/**
 * Alt metinlerin kaynak kısmı — her görsel nereden geldiğini söylüyor
 * (BRIEF §3.5). Sahne görselleri küratörün yüklemesi, portreler ya
 * arşivin ya AniList'in.
 */
export const HINATA_PORTRAIT_ALT = {
  uploaded: { tr: "arşiv portresi", en: "archive portrait" },
  anilist: { tr: "AniList künye portresi", en: "AniList profile portrait" },
  scene: { tr: "arşiv görseli", en: "archive image" },
} as const;

/** Görsel başlığı olmayan bölümlerin ekran okuyucu başlıkları. */
export const HINATA_SECTION_LABELS = {
  identity: { tr: "Künye", en: "Profile" },
} as const;

/** Byakugan modu düğmesi — sayfanın tamamını çeviren tek durum. */
export const HINATA_MODE_TEXT = {
  enter: { tr: "Byakugan modu", en: "Byakugan mode" },
  exit: { tr: "Byakugan'ı kapat", en: "Close the Byakugan" },
  /** Modun ne yaptığını söyleyen görünmez açıklama (ekran okuyucu) */
  description: {
    tr: "Sayfanın kenarlarına damar ağı yayılır, çevresel görüş halkası belirir ve gizli chakra noktaları görünür olur.",
    en: "Veins spread to the edges of the page, the peripheral vision ring appears, and hidden chakra points become visible.",
  },
} as const;

/* ── Güç laboratuvarı ───────────────────────────────────────────────── */

export type HinataMark =
  | "palm"
  | "trigram"
  | "dome"
  | "lion"
  | "kaiten"
  | "range"
  | "herb";

export interface HinataTechnique {
  key: keyof typeof HINATA_IMAGE_KEYS;
  mark: HinataMark;
  name: string;
  kanji: string;
  turkishName: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
  /** Hinata'nın kendi geliştirdiği teknik — sayfada ayrı ağırlıkta çizilir */
  signature?: true;
}

export const HINATA_LAB_TITLE = {
  title: { tr: "Elin öğrendikleri", en: "What the hand learned" },
  lede: {
    tr: "Hyūga dövüşü görmekle başlar: önce kapıyı görürsün, sonra kapatırsın. Aşağıdaki üç biçim aynı cümlenin üç hâli — ve sonuncusu Hinata'nın kendi cümlesi.",
    en: "Hyūga combat begins with sight: first you see the gate, then you close it. The three forms below are one sentence in three tenses — and the last one is Hinata's own.",
  },
} as const;

export const HINATA_TECHNIQUES: HinataTechnique[] = [
  {
    key: "juken",
    mark: "palm",
    name: "Jūken",
    kanji: "柔拳",
    turkishName: { tr: "Nazik Yumruk", en: "Gentle Fist" },
    tagline: {
      tr: "Sert olan kemiği kırar; nazik olan içeriyi durdurur.",
      en: "The hard style breaks bone; the gentle one stops what is inside.",
    },
    text: {
      tr: "Klanın imza dövüş biçimi. Avuçtan salınan chakra deriyi geçer, kasla hiç uğraşmaz ve doğrudan chakra yollarına ya da organın kendisine iner. Dışarıda mor bir iz bile kalmayabilir; içeride bir kapı kapanmıştır. Bu yüzden Jūken öğrenmek önce Byakugan'la doğru yeri görmeyi öğrenmektir: göremeyen el, nazik de olsa boşa vurur.",
      en: "The clan's signature style. Chakra released from the palm passes through the skin, ignores muscle entirely and lands on the chakra pathways — or on the organ itself. There may not even be a bruise outside; inside, a gate has closed. Which is why learning Jūken means first learning to see the right spot with the Byakugan: a hand that cannot see strikes nothing, however gentle it is.",
    },
    traits: [
      { tr: "Avuç içinden salınan chakra", en: "Chakra released from the palm" },
      { tr: "Kası ve kemiği atlar", en: "Bypasses muscle and bone" },
      { tr: "Byakugan olmadan işe yaramaz", en: "Useless without the Byakugan" },
    ],
  },
  {
    key: "hakke64",
    mark: "trigram",
    name: "Hakke Rokujūyon Shō",
    kanji: "八卦六十四掌",
    turkishName: {
      tr: "Sekiz Trigram Altmış Dört Avuç",
      en: "Eight Trigrams Sixty-Four Palms",
    },
    tagline: {
      tr: "İki, dört, sekiz, on altı, otuz iki, altmış dört.",
      en: "Two, four, eight, sixteen, thirty-two, sixty-four.",
    },
    text: {
      tr: "Rakip sekiz trigramın merkezine alınır ve vuruş sayısı her turda ikiye katlanır. Dizinin sonunda altmış dört tenketsu kapanmıştır: hedef ayakta kalsa bile chakrasını kullanamaz, yani ninja olmaktan geçici olarak çıkar. Ana dalın gururu sayılan bu diziyi Hinata da öğrendi — kimsenin ondan beklemediği bir zamanda.",
      en: "The opponent is taken into the centre of the eight trigrams and the number of strikes doubles each round. By the end of the sequence sixty-four tenketsu are shut: even standing, the target cannot use their chakra — they stop being a shinobi for a while. Hinata learned this sequence, the pride of the main branch, at a time when nobody expected it of her.",
    },
    traits: [
      { tr: "2 · 4 · 8 · 16 · 32 · 64", en: "2 · 4 · 8 · 16 · 32 · 64" },
      { tr: "64 tenketsu kapanır", en: "Sixty-four tenketsu shut" },
      { tr: "Ana dalın dizisi", en: "The main branch's sequence" },
    ],
  },
  {
    key: "shugohakke",
    mark: "dome",
    name: "Shugohakke Rokujūyon Shō",
    kanji: "守護八卦六十四掌",
    turkishName: {
      tr: "Koruyucu Sekiz Trigram Altmış Dört Avuç",
      en: "Protective Eight Trigrams Sixty-Four Palms",
    },
    tagline: {
      tr: "Aynı altmış dört nokta — ama bu kez dışarı doğru.",
      en: "The same sixty-four points — only this time facing outward.",
    },
    text: {
      tr: "Hinata'nın kendi geliştirdiği teknik ve klanın envanterindeki en sıra dışı satır: saldırı dizisi tersine çevrilir. Chakra tenketsu'lardan dışarı salınır, gövdenin çevresinde dönen bir bıçak kubbesi kurar ve gelen şeyi kesip savurur. Hakke Rokujūyon Shō karşıdakini kapatır; Shugohakke arkadaki insanı ayakta tutar. Vâris olamayacağı söylenen kız, ailenin saldırı sanatına savunmayı öğretti.",
      en: "Hinata's own creation, and the strangest line in the clan's inventory: the attacking sequence turned inside out. Chakra is released outward through the tenketsu, builds a rotating dome of blades around the body and cuts down whatever arrives. Hakke Rokujūyon Shō shuts the person in front of you; Shugohakke keeps the person behind you standing. The girl declared unfit to inherit taught her family's art of attack how to defend.",
    },
    traits: [
      { tr: "Hinata'nın kendi tekniği", en: "Hinata's own technique" },
      { tr: "360° bıçak kubbesi", en: "A 360° dome of blades" },
      { tr: "Korumak için tasarlandı", en: "Designed to protect" },
    ],
    signature: true,
  },
];

export interface HinataMinor {
  key: keyof typeof HINATA_IMAGE_KEYS;
  mark: HinataMark;
  name: string;
  kanji: string;
  note: LocalizedText;
}

export const HINATA_MINOR: HinataMinor[] = [
  {
    key: "soshiken",
    mark: "lion",
    name: "Jūho Sōshiken",
    kanji: "柔歩双獅拳",
    note: {
      tr: "İki elin çevresinde chakradan aslan başları belirir. Artık tek tek nokta aranmaz: aslanın kapadığı yer bir bölgedir. Pain'in karşısına bununla çıktı.",
      en: "Lion heads of chakra form around both hands. No more hunting single points: what the lion closes is a whole region. This is what she brought out against Pain.",
    },
  },
  {
    key: "kaiten",
    mark: "kaiten",
    name: "Kaiten",
    kanji: "回天",
    note: {
      tr: "Bütün gözeneklerden chakra salıp kendi ekseninde dönmek — gelen her şeyi savuran bir kalkan. Neji'nin ve ana dalın imzası; Hinata bu savunmayı da çalıştı.",
      en: "Release chakra from every pore and spin: a shield that throws off anything that arrives. Neji's signature and the main branch's; Hinata trained this defence too.",
    },
  },
  {
    key: "range",
    mark: "range",
    name: "Byakugan · 白眼",
    kanji: "視界",
    note: {
      tr: "Neredeyse küresel görüş, chakra ağını okuma, kilometrelerce uzağı tarama. Tek eksiği ensedeki bir derece — yukarıdaki halkada işaretli duran nokta.",
      en: "Near-spherical vision, reading the chakra network, scanning kilometres of ground. Its only gap is one degree at the nape — the marked point on the ring above.",
    },
  },
  {
    key: "ointment",
    mark: "herb",
    name: "Nankō",
    kanji: "軟膏",
    note: {
      tr: "Şifalı otlardan merhem. Bedenin nerede kırıldığını gören göz, onu nerede onaracağını da biliyor: kapıları kapatmayı bilen elin ikinci mesleği.",
      en: "An ointment made from medicinal herbs. An eye that sees where a body breaks knows where to mend it: the second trade of a hand trained to close gates.",
    },
  },
];

/* ── Görüş halkası — sayfanın kalbi ─────────────────────────────────── */

export interface HinataRingNode {
  key: string;
  /** Halkadaki açı: 0° tepe, saat yönünde artar. 180° = alt orta = kör nokta */
  angle: number;
  kanji: string;
  romaji: string;
  title: LocalizedText;
  /** Mono okuma satırı — ölçüm, mesafe, sayı */
  readout: LocalizedText;
  body: LocalizedText[];
  quote?: { text: LocalizedText; by: string };
  companionIds?: number[];
  imageKey?: string;
  /** Klanın yarası: halkanın arkasındaki işaretli nokta */
  blind?: true;
}

export const HINATA_RING_TITLE = {
  title: { tr: "360 derece — ve bir kör nokta", en: "360 degrees — and one blind spot" },
  lede: {
    tr: "Halka Hinata'nın görüş alanı; noktalar tenketsu. Her nokta gördüğü bir şeyi açar. Alt ortadaki işaretli nokta ise göremediği tek yer — klanın yarası da tam orada duruyor.",
    en: "The ring is Hinata's field of vision; the points are tenketsu. Each one opens something she sees. The marked point at the bottom is the only place she cannot — and the clan's wound sits exactly there.",
  },
  hint: {
    tr: "Bir nokta seç · ok tuşlarıyla gez",
    en: "Choose a point · move with the arrow keys",
  },
  eyeLabel: {
    tr: "Byakugan — damarları kabarmış göz çizimi",
    en: "Byakugan — drawing of the veined eye",
  },
  blindBadge: { tr: "Kör nokta", en: "Blind spot" },
  ringLabel: {
    tr: "Görüş halkası — sekiz nokta",
    en: "Field of vision — eight points",
  },
} as const;

export const HINATA_RING_NODES: HinataRingNode[] = [
  {
    key: "byakugan",
    angle: 0,
    kanji: "白眼",
    romaji: "Byakugan",
    title: { tr: "Açılan göz", en: "The eye opens" },
    readout: { tr: "359°", en: "359°" },
    body: [
      {
        tr: "Şakaklarda damarlar kabarır ve görüş bir küreye dönüşür: ön, yan ve arka aynı anda. Chakra artık görünür bir şeydir — akar, toplanır, tükenir. Neredeyse tam daire. Neredeyse. Hyūga'nın hem gücü hem laneti o kelimede saklı.",
        en: "The veins rise at her temples and sight becomes a sphere: front, side and back at once. Chakra turns into something visible — it flows, it gathers, it runs out. Almost a full circle. Almost. Both the power and the curse of the Hyūga hide in that word.",
      },
    ],
  },
  {
    key: "network",
    angle: 45,
    kanji: "経絡系",
    romaji: "Keirakukei",
    title: { tr: "Üç yüz altmış bir nokta", en: "Three hundred sixty-one points" },
    readout: { tr: "361 tenketsu", en: "361 tenketsu" },
    body: [
      {
        tr: "Byakugan bedeni bir harita gibi açar: chakra yolları ve o yolların üstüne dizilmiş üç yüz altmış bir kapı. Hyūga dövüşü kas ya da kemik aramaz, kapı arar. Bir Hyūga'nın gördüğü şey karşısındakinin görünüşü değil, nasıl çalıştığıdır.",
        en: "The Byakugan lays a body open like a map: the chakra pathways and the three hundred sixty-one gates set along them. A Hyūga does not look for muscle or bone, they look for gates. What a Hyūga sees is not how someone appears but how they work.",
      },
    ],
  },
  {
    key: "scout",
    angle: 90,
    kanji: "索敵",
    romaji: "Sakuteki",
    title: { tr: "Takım Sekiz'in menzili", en: "The range of Team Eight" },
    readout: { tr: "kilometrelerce", en: "kilometres out" },
    companionIds: [
      HINATA_COMPANION_IDS.kurenai,
      HINATA_COMPANION_IDS.kiba,
      HINATA_COMPANION_IDS.shino,
    ],
    body: [
      {
        tr: "Kurenai Yūhi'nin takımı bir arama takımıdır: Kiba'nın burnu, Shino'nun böcekleri, Hinata'nın gözü. Eğitimli bir Hyūga'nın menzili kilometrelerle ölçülür ve müfrezenin ne kadar uzağı bildiğini o belirler. Babasının vâris olarak yetersiz bulup Kurenai'ye bıraktığı kız, bir takımın en uzağa bakan uzvu oldu.",
        en: "Kurenai Yūhi's squad is a tracking team: Kiba's nose, Shino's insects, Hinata's eyes. A trained Hyūga's range is measured in kilometres, and she decides how far the unit can know. The girl her father judged unfit and handed over to Kurenai became the part of a team that looks farthest.",
      },
    ],
  },
  {
    key: "watch",
    angle: 135,
    kanji: "見守り",
    romaji: "Mimamori",
    title: { tr: "Görülmeden bakmak", en: "Watching without being seen" },
    readout: { tr: "Akademi — Bölüm I", en: "The Academy — Part I" },
    companionIds: [HINATA_COMPANION_IDS.naruto],
    body: [
      {
        tr: "Akademi yıllarında herkesin başını çevirdiği çocuğa bakan tek kişi oydu. Yıllarca görülmeden baktı: ne seslendi, ne yaklaştı. O bakış henüz cesaret değildi — ama cesaretin nereden besleneceğini biliyordu. Sonradan öne çıkacak olan kız, önce uzun uzun bakmayı öğrendi.",
        en: "In the Academy years she was the only one still looking at the boy everyone turned away from. She watched for years without being seen: never calling out, never coming closer. That looking was not courage yet — but it knew where courage would be fed from. The girl who would later step forward first learned how to keep looking.",
      },
    ],
  },
  {
    key: "blindspot",
    angle: 180,
    kanji: "死角",
    romaji: "Shikaku",
    title: { tr: "Kör nokta", en: "The blind spot" },
    readout: { tr: "1° — ense", en: "1° — the nape" },
    blind: true,
    companionIds: [HINATA_COMPANION_IDS.neji],
    imageKey: HINATA_IMAGE_KEYS.blindSpot,
    body: [
      {
        tr: "Byakugan'ın göremediği tek yer sahibinin kendi ensesidir: boynun bittiği, ilk sırt omurunun hemen üstündeki bir avuç kadar alan. Küre orada kapanmaz. Bir Hyūga'yı yenmek isteyen herkes önce o bir dereceyi arar.",
        en: "The one place the Byakugan cannot see is the bearer's own nape: a palm-sized patch just above the first thoracic vertebra, where the neck ends. The sphere does not close there. Anyone who wants to beat a Hyūga looks for that single degree first.",
      },
      {
        tr: "Klanın kör noktası da tam olarak arkasındadır. Hyūga ikiye ayrılmıştır: ana dal (sōke) ve yan dal (bunke). Yan dala doğduğun gün alnına bir mühür konur — kafesteki kuş. Mühür, taşıyanı öldüğünde Byakugan'ı yok eder ki klanın sırrı düşman eline geçmesin; ana dalın bir sözüyle de taşıyanı acıyla yere serer. Bir sırrı korumak için icat edilmiş bu şey, aynı zamanda bir tasmadır.",
        en: "The clan's blind spot sits exactly behind it as well. The Hyūga are split in two: the main house (sōke) and the branch house (bunke). The day you are born into the branch, a seal is set on your forehead — the caged bird. When its bearer dies the seal destroys the Byakugan so the clan's secret cannot be taken; and at a word from the main house it drops the bearer in pain. A thing invented to guard a secret is also a collar.",
      },
      {
        tr: "Neji'nin babası Hizashi, Hiashi'nin ikiziydi; kardeşinin yerine ölmesi istendiğinde bunu yaptı. Neji yıllarca bunun bir emir olduğunu sandı ve öfkesini Hinata'ya yöneltti — kaderin asla değişmediğine dair kanıtı oydu. Sonunda babasının kendi seçtiğini öğrendi. Ve on yedi yaşında, Naruto'yla Hinata'nın önüne geçip aynı seçimi kendisi yaptı.",
        en: "Neji's father Hizashi was Hiashi's twin; when he was asked to die in his brother's place, he did. For years Neji believed that had been an order, and he turned his anger on Hinata — she was his proof that fate never changes. In the end he learned that his father had chosen it. And at seventeen he stepped in front of Naruto and Hinata and made the same choice himself.",
      },
    ],
    quote: {
      text: {
        tr: "Senin canın artık yalnızca senin değil.",
        en: "Your life is no longer yours alone.",
      },
      by: "Neji Hyūga",
    },
  },
  {
    key: "palm",
    angle: 225,
    kanji: "掌",
    romaji: "Shō",
    title: { tr: "Avucun içi", en: "Inside the palm" },
    readout: { tr: "柔拳 — Jūken", en: "柔拳 — Jūken" },
    body: [
      {
        tr: "Hyūga'nın silahı yumruk değil, açık avuçtur. Vuruş yüzeyde neredeyse iz bırakmaz; chakra deriden geçip içeride kapanır. 'Nazik' denmesinin sebebi bu: dışarıdan bakan yalnızca bir dokunuş görür. Sayfanın en sessiz cümlesi de burada — bir eli bu kadar hassas yapan şey, öfke değil dikkat.",
        en: "The Hyūga weapon is not a fist but an open palm. The strike leaves almost no mark on the surface; the chakra passes through skin and closes something inside. That is why it is called gentle: from outside you only see a touch. The quietest sentence on this page is here too — what makes a hand this precise is not rage, it is attention.",
      },
    ],
  },
  {
    key: "mend",
    angle: 270,
    kanji: "手当て",
    romaji: "Teate",
    title: { tr: "Yaranın yeri", en: "Where the wound is" },
    readout: { tr: "薬草 — şifalı ot", en: "薬草 — medicinal herb" },
    body: [
      {
        tr: "Bedenin nerede kırıldığını görebilen bir göz, onu nerede onaracağını da bilir. Hinata şifalı otlardan merhem yapmayı öğrendi. Klanın sanatı yıkmak üzerine kurulu; onun elinde bir de onarma tarafı var — aynı görüş, ters yöne çevrilmiş hâli.",
        en: "An eye that can see where a body breaks also knows where to mend it. Hinata learned to make ointment from medicinal herbs. The clan's art is built on breaking; in her hands it has a mending side as well — the same sight, turned the other way.",
      },
    ],
  },
  {
    key: "resolve",
    angle: 315,
    kanji: "決意",
    romaji: "Ketsui",
    title: { tr: "Kaçmamak", en: "Not running" },
    readout: { tr: "Bölüm I → Bölüm II", en: "Part I → Part II" },
    body: [
      {
        tr: "Görmek bir seçim değil; bakmaya devam etmek öyle. Neji'nin karşısında ayakta kalırken de, Pain'in gölgesinde öne çıkarken de tek bildiği buydu: kazanacağını sanmıyordu, yalnızca geri adım atmayacaktı. Bu sayfanın 'yumuşak ama zayıf değil' dediği şey tam olarak bu cümledir.",
        en: "Seeing is not a choice; continuing to look is. Standing in front of Neji and stepping out of Pain's shadow, she knew only this: she did not think she would win, she simply would not step back. What this page means by gentle but not weak is exactly that sentence.",
      },
    ],
  },
];

/* ── Kader çizelgesi ────────────────────────────────────────────────── */

export interface HinataEra {
  key: string;
  imageKey: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: string };
  /** Çizelgenin kırıldığı durak — omurga orada parlar */
  pivot?: true;
}

export const HINATA_TIMELINE_TITLE = {
  title: { tr: "Değişmez denilen şey", en: "The thing they called unchangeable" },
  lede: {
    tr: "Neji ona kaderin asla değişmediğini söyledi. Aşağıdaki beş durak bunun tersini anlatıyor — hem de Neji'nin kendi eliyle.",
    en: "Neji told her that fate never changes. The five stops below say the opposite — and Neji himself writes the last of them.",
  },
} as const;

export const HINATA_TIMELINE: HinataEra[] = [
  {
    key: "heiress",
    imageKey: HINATA_IMAGE_KEYS.eraHeiress,
    age: { tr: "3 – 12 yaş", en: "ages 3 – 12" },
    title: {
      tr: "Vâris olarak yetersiz bulunma",
      en: "Judged unfit to inherit",
    },
    text: {
      tr: "Hyūga ana dalının en büyük kızı olarak doğdu ve klanın vârisi olsun diye babası Hiashi tarafından çalıştırıldı. Yumuşaklığı bir kusur sayıldı. Küçük kardeşi Hanabi onu geçince baba eğitimi kesti: Takım 8'e verilirken, başına ne geleceğinin umurunda olmadığını söyleyip onu Kurenai Yūhi'ye bıraktı. Bir çocuğun duyabileceği en ağır cümlelerden biri, künyesine böyle geçti.",
      en: "Born the eldest daughter of the Hyūga main house, she was drilled by her father Hiashi to become the clan's heiress. Her gentleness was counted as a flaw. When her younger sister Hanabi overtook her, her father ended the training: as she was assigned to Team 8, he left her to Kurenai Yūhi, saying he did not care what happened to her. One of the heaviest sentences a child can hear went into her file exactly like that.",
    },
  },
  {
    key: "exam",
    imageKey: HINATA_IMAGE_KEYS.eraExam,
    age: { tr: "12 yaş", en: "age 12" },
    title: {
      tr: "Naruto'nun sözü ve Neji'yle sınav",
      en: "Naruto's promise and the exam against Neji",
    },
    text: {
      tr: "Chūnin sınavının elemesinde karşısına Neji çıktı. Neji ona çekilmesini söyledi: kader belliydi, kaybedecekti, kaybetmesi gerekiyordu. Çekilmedi. Ayakta duramayacak hâle geldiğinde bile ayağa kalktı — ve kaybetti. Naruto o gün onun kanına parmağını batırıp Neji'yi yeneceğine söz verdi. Hinata'nın kaybettiği maç, Naruto'nun ilk kez bir başkası adına söz verdiği maç oldu.",
      en: "In the Chūnin exam preliminaries she drew Neji. He told her to withdraw: fate was settled, she would lose, she was supposed to lose. She did not withdraw. Even when she could no longer stand she got up — and she lost. That day Naruto dipped his fingers in her blood and swore he would beat Neji. The match Hinata lost was the first time Naruto gave his word on someone else's behalf.",
    },
    quote: {
      text: { tr: "Neji'yi yeneceğim. Söz.", en: "I'll beat Neji. That's a promise." },
      by: "Naruto Uzumaki",
    },
  },
  {
    key: "pain",
    imageKey: HINATA_IMAGE_KEYS.eraPain,
    age: { tr: "16 yaş", en: "age 16" },
    title: { tr: "Pain'in karşısına çıkma", en: "Standing before Pain" },
    text: {
      tr: "Naruto yere çivilenmiş hâldeyken, kimsenin cesaret edemediğini yaptı: aradaki farkı bilerek öne çıktı. Kazanma ihtimali yoktu ve bunu kendisi de söyledi. Jūho Sōshiken'i çıkardı, vurdu, savruldu. Bütün sayfanın üstünde duran cümle o sahnede söylendi — kaybederken.",
      en: "With Naruto pinned to the ground she did what nobody else dared: she stepped forward knowing exactly how wide the gap was. She had no chance of winning, and she said so herself. She brought out Jūho Sōshiken, struck, and was thrown aside. The sentence that stands over this whole page was spoken in that scene — while losing.",
    },
    quote: {
      text: { tr: "Bu benim ninja yolum.", en: "This is my ninja way." },
      by: "Hinata Hyūga",
    },
  },
  {
    key: "neji",
    imageKey: HINATA_IMAGE_KEYS.eraNeji,
    age: { tr: "17 yaş", en: "age 17" },
    title: {
      tr: "Neji'nin fedakârlığı ve elini bırakmama",
      en: "Neji's sacrifice, and not letting go",
    },
    text: {
      tr: "Dördüncü Büyük Ninja Savaşı'nda Hinata Naruto'nun önüne atıldı; Neji ikisinin birden önüne geçti ve saldırıyı gövdesine aldı. Kader diye bir şeyin olmadığını, ömrü boyunca en çok ona inanmış olan adam kanıtladı. Naruto'nun içindeki ışık sönmeye başladığında Hinata onu tokatladı ve elini tuttu — bırakmadı. Ana dal ile yan dal arasındaki mesafe klan tarihinde ilk kez o el sıkışında kapandı.",
      en: "In the Fourth Great Ninja War Hinata threw herself in front of Naruto; Neji stepped in front of them both and took the attack in his body. The man who had believed in fate more than anyone proved there was no such thing. When the light in Naruto started to go out, Hinata slapped him and took his hand — and did not let go. For the first time in the clan's history the distance between main house and branch house closed in that grip.",
    },
    quote: {
      text: {
        tr: "Senin canın artık yalnızca senin değil.",
        en: "Your life is no longer yours alone.",
      },
      by: "Neji Hyūga",
    },
    pivot: true,
  },
  {
    key: "path",
    imageKey: HINATA_IMAGE_KEYS.eraPath,
    age: { tr: "sonrası", en: "after" },
    title: { tr: "Kendi yolunu seçme", en: "Choosing her own way" },
    text: {
      tr: "Hinata ne babasının istediği vâris oldu, ne de Neji'nin dediği gibi kaderine razı. Klanın kör noktasına bakmayı seçti: ana dalla yan dalın arasındaki çizgiyi kapatmayı, mührün sona ermesini isteyen kuşağın içinde durmayı. Yumuşaklığı hiç değişmedi — değişen, o yumuşaklığın bir kusur sayılması oldu.",
      en: "Hinata became neither the heiress her father wanted nor the girl resigned to fate that Neji described. She chose to look at the clan's blind spot: to close the line between main house and branch house, to stand with the generation that wants the seal ended. Her gentleness never changed — what changed was its being counted as a flaw.",
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────── */

export const HINATA_CLOSING = {
  quotes: [
    {
      text: { tr: "Bu benim ninja yolum.", en: "This is my ninja way." },
      source: {
        tr: "Pain'in karşısında, Bölüm II",
        en: "Facing Pain, Part II",
      },
    },
    {
      text: { tr: "Çünkü seni seviyorum.", en: "Because I love you." },
      source: {
        tr: "Naruto'ya, aynı sahnede",
        en: "To Naruto, in the same scene",
      },
    },
  ],
  motto: "これが私の忍道です",
  mottoNote: {
    tr: "Kore ga watashi no nindō desu — “Bu benim ninja yolum.”",
    en: "Kore ga watashi no nindō desu — “This is my ninja way.”",
  },
  credit: {
    tr: "Künye bilgileri (doğum günü, boy, kan grubu, yaş aralığı, rütbe ve “白眼の姫” lakabı) AniList'ten alınmış ve arşivimizde saklanmıştır. Kapak portresi arşivin kendi yüklemesidir; yoldaş portreleri de öyle. Sayfadaki bütün çizimler — damar ağı, görüş halkası, göz, sekiz trigram, koruyucu kubbe ve kafesteki kuş mührü — bu sayfa için elle yazılmış SVG'lerdir; dışarıdan alınmış tek bir görsel yok.",
    en: "Profile data (birthday, height, blood type, age range, rank and the “白眼の姫” alias) comes from AniList and is stored in our archive. The cover portrait is our own upload, as are the companion portraits. Every drawing on this page — the vein network, the field-of-vision ring, the eye, the eight trigrams, the protective dome and the caged-bird seal — is SVG written by hand for this page; not a single image was taken from elsewhere.",
  },
  creditLink: {
    tr: "AniList künyesi — karakter 1555",
    en: "AniList profile — character 1555",
  },
  creditHref: "https://anilist.co/character/1555",
} as const;
