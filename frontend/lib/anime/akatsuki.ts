/**
 * Akatsuki sergisinin veri iskeleti.
 *
 * Zaraki emsalinin (lib/characters/) devamı: sergi sayfasının YAPISI ve
 * kimlikleri kodda, bütün görünür metin i18n'de (`akatsuki` namespace),
 * görseller veritabanında (`CharacterImage`, kurulum:
 * `POST /admin/anime/akatsuki/setup`).
 *
 * Özel adlar ve kanji çevrilmez — burada dururlar. Unvan, rol, anlatı gibi
 * her şey `messages/{tr,en}.json`dan okunur (kural 1).
 *
 * ── HİYERARŞİ KURALI (komut §4a) ─────────────────────────────────────────
 * Pain üye listesinde DEĞİL: sayfanın ana karakteri ve anlatı merkezi.
 * Diğer herkes onun etrafında açılan arşiv. Pain'i AKATSUKI_MEMBERS'a
 * eklemek bu kuralı bozar.
 */

/** AniList karakter numaraları. Nagato "Pain" kaydının, Obito "Tobi"nin içinde. */
export const AKATSUKI_IDS = {
  pain: 3180,
  konan: 3179,
  itachi: 14,
  kisame: 2672,
  deidara: 1902,
  sasori: 1900,
  kakuzu: 3178,
  hidan: 2792,
  tobi: 3149,
  zetsu: 3150,
  madara: 53901,
  yahiko: 23050,
} as const;

/**
 * Güç profili (0-100) — databook ruhunda küratör tahmini, "resmî ölçüm"
 * iddiası yok. Eksen adları i18n'de (`akatsuki.stats.*`).
 */
export interface AkatsukiMemberStats {
  nin: number;
  gen: number;
  tai: number;
  int: number;
}

export const AKATSUKI_STAT_KEYS = ["nin", "gen", "tai", "int"] as const;

export interface AkatsukiMember {
  /** i18n anahtarı: `akatsuki.members.<key>.*` */
  key: string;
  /** Özel ad — çevrilmez */
  name: string;
  /** Ana dildeki ad */
  nativeName: string;
  characterId: number;
  /** Akatsuki yüzüğü: kanji + okunuşu (canon) */
  ring: { kanji: string; romaji: string } | null;
  /** İkili ekip eşleşmesi (`partners` bölümü buradan türetilir) */
  partnerKey: string | null;
  stats: AkatsukiMemberStats;
}

/**
 * v7: Pain artık üyeler duvarında da var (kullanıcı kararı — v1'in "Pain
 * listede olmaz" kuralını bu komut bilinçli olarak değiştirdi). Ayrı sabit:
 * partners/ilişki mantığı AKATSUKI_MEMBERS'a dokunmadan çalışmayı sürdürür;
 * duvar [LEADER, ...MEMBERS] dizer ve lider kartı kendi çerçevesini taşır.
 */
export const AKATSUKI_LEADER: AkatsukiMember = {
  key: "pain",
  name: "Pain",
  nativeName: "ペイン",
  characterId: AKATSUKI_IDS.pain,
  ring: { kanji: "零", romaji: "rei" },
  partnerKey: "konan",
  stats: { nin: 99, gen: 90, tai: 88, int: 94 },
};

/** Komut §4d sırası — canon'a sadık dokuz üye. */
export const AKATSUKI_MEMBERS: AkatsukiMember[] = [
  {
    key: "itachi",
    name: "Itachi Uchiha",
    nativeName: "うちはイタチ",
    characterId: AKATSUKI_IDS.itachi,
    ring: { kanji: "朱", romaji: "shu" },
    partnerKey: "kisame",
    stats: { nin: 96, gen: 99, tai: 82, int: 95 },
  },
  {
    key: "kisame",
    name: "Kisame Hoshigaki",
    nativeName: "干柿鬼鮫",
    characterId: AKATSUKI_IDS.kisame,
    ring: { kanji: "南", romaji: "nan" },
    partnerKey: "itachi",
    stats: { nin: 92, gen: 60, tai: 88, int: 74 },
  },
  {
    key: "deidara",
    name: "Deidara",
    nativeName: "デイダラ",
    characterId: AKATSUKI_IDS.deidara,
    ring: { kanji: "青", romaji: "ao" },
    partnerKey: "sasori",
    stats: { nin: 90, gen: 50, tai: 70, int: 78 },
  },
  {
    key: "sasori",
    name: "Sasori",
    nativeName: "サソリ",
    characterId: AKATSUKI_IDS.sasori,
    ring: { kanji: "玉", romaji: "gyoku" },
    partnerKey: "deidara",
    stats: { nin: 88, gen: 62, tai: 65, int: 90 },
  },
  {
    key: "kakuzu",
    name: "Kakuzu",
    nativeName: "角都",
    characterId: AKATSUKI_IDS.kakuzu,
    ring: { kanji: "北", romaji: "hoku" },
    partnerKey: "hidan",
    stats: { nin: 91, gen: 55, tai: 84, int: 85 },
  },
  {
    key: "hidan",
    name: "Hidan",
    nativeName: "飛段",
    characterId: AKATSUKI_IDS.hidan,
    ring: { kanji: "三", romaji: "san" },
    partnerKey: "kakuzu",
    stats: { nin: 60, gen: 40, tai: 90, int: 55 },
  },
  {
    key: "konan",
    name: "Konan",
    nativeName: "小南",
    characterId: AKATSUKI_IDS.konan,
    ring: { kanji: "白", romaji: "byaku" },
    partnerKey: "pain",
    stats: { nin: 85, gen: 55, tai: 70, int: 82 },
  },
  {
    key: "tobi",
    name: "Tobi / Obito Uchiha",
    nativeName: "トビ",
    characterId: AKATSUKI_IDS.tobi,
    // Sasori'nin ölümünden sonra onun yüzüğünü taşıdı
    ring: { kanji: "玉", romaji: "gyoku" },
    partnerKey: null,
    stats: { nin: 97, gen: 92, tai: 80, int: 96 },
  },
  {
    key: "zetsu",
    name: "Zetsu",
    nativeName: "ゼツ",
    characterId: AKATSUKI_IDS.zetsu,
    ring: { kanji: "亥", romaji: "gai" },
    partnerKey: null,
    stats: { nin: 75, gen: 50, tai: 55, int: 88 },
  },
];

/** İkili ekipler (komut §4e). Pain↔Konan çifti hero ile üye arasında köprü. */
export const AKATSUKI_PARTNERS: Array<{
  key: string;
  aKey: "pain" | (typeof AKATSUKI_MEMBERS)[number]["key"];
  bKey: (typeof AKATSUKI_MEMBERS)[number]["key"];
}> = [
  { key: "itachi-kisame", aKey: "itachi", bKey: "kisame" },
  { key: "deidara-sasori", aKey: "deidara", bKey: "sasori" },
  { key: "hidan-kakuzu", aKey: "hidan", bKey: "kakuzu" },
  { key: "pain-konan", aKey: "pain", bKey: "konan" },
];

export interface SixPath {
  /** i18n anahtarı: `akatsuki.paths.<key>.*` */
  key: "deva" | "asura" | "human" | "animal" | "preta" | "naraka";
  kanji: string;
  romaji: string;
  /** `CharacterImage` ABILITY yuvasındaki sergi anahtarı */
  imageKey: string;
}

export const SIX_PATHS: SixPath[] = [
  { key: "deva", kanji: "天道", romaji: "Tendō", imageKey: "path:deva" },
  { key: "asura", kanji: "修羅道", romaji: "Shuradō", imageKey: "path:asura" },
  { key: "human", kanji: "人間道", romaji: "Ningendō", imageKey: "path:human" },
  { key: "animal", kanji: "畜生道", romaji: "Chikushōdō", imageKey: "path:animal" },
  { key: "preta", kanji: "餓鬼道", romaji: "Gakidō", imageKey: "path:preta" },
  { key: "naraka", kanji: "地獄道", romaji: "Jigokudō", imageKey: "path:naraka" },
];

/**
 * Sayfa düzeyindeki sergi görselleri — hepsi Pain (3180) kaydında,
 * ABILITY yuvasında bu anahtarlarla durur.
 */
export const EXHIBIT_IMAGE_KEYS = {
  /** Hero arka planı: Pain Konoha semalarında */
  sky: "akatsuki:sky",
  /** Six Paths bölüm girişi: altı Path bir arada */
  six: "akatsuki:six",
  /** Tarih bölümü: kuruluş üçlüsü (Yahiko, Nagato, Konan) */
  origins: "akatsuki:origins",
  /** İlişkiler: Pain'in ardındaki gerçek Nagato */
  nagato: "akatsuki:nagato",
  /** İlişkiler: maskenin ardındaki Obito */
  obito: "akatsuki:obito",
  /** v2 · Üyeler bölümünün arka bandı: kadro bir arada (3840×2151) */
  legion: "akatsuki:legion",
  /** v2 · Partnerler bandı: ikililer harekâtta, Konan'ın kanatları (3424×1572) */
  horror: "akatsuki:horror",
  /** v2 · Miras kapanışı: yağmurun altında Nagato (2560×1440) */
  dawn: "akatsuki:dawn",
  /** v6 · Hakkında tam-şerit sahnesi (üretilmiş: taş kabartma + tomar + fener) */
  about: "akatsuki:about",
  /** v6 · Salon girişi hero fonu (üretilmiş özgün kadraj) */
  hallHero: "akatsuki:hall-hero",
  /** v7 · Çerçeve süsleme şeridi: siyah zemin üstüne kızıl bulut frizi
      (screen blend ile çerçeveye işlenir; siyah görünmez olur) */
  ornament: "akatsuki:ornament",
  /** v8 · Üye duvarı fonu: portreleri ÖNE çıkaran loş galeri sahnesi */
  wall: "akatsuki:wall",
  /** v8 · Anime Dünyaları — Naruto Evreni kartının fonu */
  worldNaruto: "world:naruto",
  /** v8 · Anime Dünyaları — Anime Arşivi kartının fonu */
  worldArchive: "world:archive",
} as const;

/** v6 · Dönem illüstrasyon anahtarı — zigzag kartının tepe paneli */
export function eraImageKey(era: AkatsukiEra["key"]): string {
  return `era:${era}`;
}

/**
 * Nexus düğümü — "İlgili İçerik" paneli (kullanıcı fikri, 16 Ağustos v2).
 * Sergi bir son durak değil, arşivin içinde bir düğüm: Akatsuki anlatısının
 * iki ucundaki isimler dosyalarına bağlanır.
 */
export const AKATSUKI_NEXUS_PEOPLE = [
  /** Üç yetimin hocası */
  { key: "jiraiya", name: "Jiraiya", characterId: 2423 },
  /** Nagato'nun sorusunun cevabı */
  { key: "naruto", name: "Naruto Uzumaki", characterId: 17 },
] as const;

/**
 * Sergi fon müziği (kullanıcının sağladığı parça, v2 §5). Adres koda
 * gömülmesin diye tek sabit — dosya `frontend/public/audio/` altında.
 */
export const AKATSUKI_THEME_SRC = "/audio/akatsuki-theme.mp3";

export interface AkatsukiRelation {
  /** i18n anahtarı: `akatsuki.relations.<key>.*` */
  key: string;
  /** Özel ad — çevrilmez */
  name: string;
  characterId: number;
  /** Portre yerine sergi görseli kullanılacaksa ABILITY anahtarı */
  imageKey?: string;
  /** Sergi anahtarı hangi karakterin kaydında duruyor */
  imageOwnerId?: number;
}

/** Komut §4g: Pain/Nagato, Konan, Obito, Madara, Yahiko ilişki ağı. */
export const AKATSUKI_RELATIONS: AkatsukiRelation[] = [
  {
    key: "nagato",
    name: "Nagato",
    characterId: AKATSUKI_IDS.pain,
    imageKey: EXHIBIT_IMAGE_KEYS.nagato,
    imageOwnerId: AKATSUKI_IDS.pain,
  },
  {
    key: "konan",
    name: "Konan",
    characterId: AKATSUKI_IDS.konan,
  },
  {
    key: "obito",
    name: "Obito Uchiha",
    characterId: AKATSUKI_IDS.tobi,
    /* v8: sabit sergi karesi yerine PORTRE — üretilen Tobi portresi
       (son-kazanır) burada da kullanılsın (kullanıcı isteği) */
  },
  {
    key: "madara",
    name: "Madara Uchiha",
    characterId: AKATSUKI_IDS.madara,
  },
  {
    key: "yahiko",
    name: "Yahiko",
    characterId: AKATSUKI_IDS.yahiko,
  },
];

/**
 * Komut §4f + v3-B2: kuruluş → Yahiko → Nagato → savaş → son.
 * Her dönem kendi görsel kimliğini (doku CSS'te, `data-era` ile), küçük
 * dairesel portrelerini ve 2-3 glifini taşır. Glif adları
 * `AkatsukiGlyphs.tsx` setinden.
 */
export interface AkatsukiEra {
  key: "founding" | "yahiko" | "nagato" | "war" | "end";
  /** Dairesel avatarlar — AniList kimlikleri, portre çözümlemesi sayfada */
  faces: number[];
  icons: string[];
}

export const AKATSUKI_TIMELINE: AkatsukiEra[] = [
  {
    key: "founding",
    faces: [AKATSUKI_IDS.yahiko, AKATSUKI_IDS.pain, AKATSUKI_IDS.konan],
    icons: ["droplet", "scroll", "cloud"],
  },
  {
    key: "yahiko",
    faces: [AKATSUKI_IDS.yahiko, AKATSUKI_IDS.konan],
    icons: ["flag", "droplet"],
  },
  {
    key: "nagato",
    faces: [AKATSUKI_IDS.pain, AKATSUKI_IDS.konan, AKATSUKI_IDS.tobi],
    icons: ["rinnegan", "ring", "cloud"],
  },
  {
    key: "war",
    faces: [AKATSUKI_IDS.tobi, AKATSUKI_IDS.madara, AKATSUKI_IDS.itachi],
    icons: ["mask", "flame"],
  },
  {
    key: "end",
    faces: [AKATSUKI_IDS.pain, AKATSUKI_IDS.konan],
    icons: ["butterfly", "droplet", "dawn"],
  },
];

/** Komut §4h: bulut, yüzükler, pelerin. */
export const AKATSUKI_SYMBOL_KEYS = ["cloud", "rings", "cloak"] as const;

/** Sayfanın tek görsel isteği için bütün kadro kimlikleri. */
export function akatsukiCharacterIds(): number[] {
  return [
    ...new Set([
      AKATSUKI_IDS.pain,
      ...AKATSUKI_MEMBERS.map((member) => member.characterId),
      ...AKATSUKI_RELATIONS.map((relation) => relation.characterId),
      ...AKATSUKI_NEXUS_PEOPLE.map((person) => person.characterId),
    ]),
  ];
}
