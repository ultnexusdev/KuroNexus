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
}

/** Komut §4d sırası — canon'a sadık dokuz üye. */
export const AKATSUKI_MEMBERS: AkatsukiMember[] = [
  {
    key: "itachi",
    name: "Itachi Uchiha",
    nativeName: "うちはイタチ",
    characterId: AKATSUKI_IDS.itachi,
    ring: { kanji: "朱", romaji: "shu" },
    partnerKey: "kisame",
  },
  {
    key: "kisame",
    name: "Kisame Hoshigaki",
    nativeName: "干柿鬼鮫",
    characterId: AKATSUKI_IDS.kisame,
    ring: { kanji: "南", romaji: "nan" },
    partnerKey: "itachi",
  },
  {
    key: "deidara",
    name: "Deidara",
    nativeName: "デイダラ",
    characterId: AKATSUKI_IDS.deidara,
    ring: { kanji: "青", romaji: "ao" },
    partnerKey: "sasori",
  },
  {
    key: "sasori",
    name: "Sasori",
    nativeName: "サソリ",
    characterId: AKATSUKI_IDS.sasori,
    ring: { kanji: "玉", romaji: "gyoku" },
    partnerKey: "deidara",
  },
  {
    key: "kakuzu",
    name: "Kakuzu",
    nativeName: "角都",
    characterId: AKATSUKI_IDS.kakuzu,
    ring: { kanji: "北", romaji: "hoku" },
    partnerKey: "hidan",
  },
  {
    key: "hidan",
    name: "Hidan",
    nativeName: "飛段",
    characterId: AKATSUKI_IDS.hidan,
    ring: { kanji: "三", romaji: "san" },
    partnerKey: "kakuzu",
  },
  {
    key: "konan",
    name: "Konan",
    nativeName: "小南",
    characterId: AKATSUKI_IDS.konan,
    ring: { kanji: "白", romaji: "byaku" },
    partnerKey: "pain",
  },
  {
    key: "tobi",
    name: "Tobi / Obito Uchiha",
    nativeName: "トビ",
    characterId: AKATSUKI_IDS.tobi,
    // Sasori'nin ölümünden sonra onun yüzüğünü taşıdı
    ring: { kanji: "玉", romaji: "gyoku" },
    partnerKey: null,
  },
  {
    key: "zetsu",
    name: "Zetsu",
    nativeName: "ゼツ",
    characterId: AKATSUKI_IDS.zetsu,
    ring: { kanji: "亥", romaji: "gai" },
    partnerKey: null,
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
} as const;

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
    imageKey: EXHIBIT_IMAGE_KEYS.obito,
    imageOwnerId: AKATSUKI_IDS.tobi,
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

/** Komut §4f: kuruluş → Yahiko → Nagato → savaş → son. */
export const AKATSUKI_TIMELINE_KEYS = [
  "founding",
  "yahiko",
  "nagato",
  "war",
  "end",
] as const;

/** Komut §4h: bulut, yüzükler, pelerin. */
export const AKATSUKI_SYMBOL_KEYS = ["cloud", "rings", "cloak"] as const;

/** Sayfanın tek görsel isteği için bütün kadro kimlikleri. */
export function akatsukiCharacterIds(): number[] {
  return [
    ...new Set([
      AKATSUKI_IDS.pain,
      ...AKATSUKI_MEMBERS.map((member) => member.characterId),
      ...AKATSUKI_RELATIONS.map((relation) => relation.characterId),
    ]),
  ];
}
