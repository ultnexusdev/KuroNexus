/**
 * Naruto Evreni — küratör görsel yuvaları.
 *
 * Akatsuki sergisindeki `EXHIBIT_IMAGE_KEYS` deseninin aynısı: görsel
 * `CharacterImage` tablosunda `slot="ABILITY"` + `abilityName=<anahtar>`
 * olarak durur, sahibi `NARUTO_OWNER_ID`dir. Böylece yeni bir tablo/migration
 * gerekmeden sayfaya istediğin kadar kadraj bağlanabiliyor.
 *
 * ── NEDEN HOTLINK YOK ────────────────────────────────────────────────────
 * Küratör bir adres yapıştırdığında backend görseli İNDİRİP kendi diskimize
 * yazıyor (`POST /admin/uploads/from-url`). İki sebep: CSP `img-src`
 * yalnızca sayılı sunucuya izin veriyor (yabancı adres tarayıcıda sessizce
 * engellenir) ve dış adres bir gün ölürse görsel de ölür.
 *
 * ── YUVA DOLU DEĞİLSE ────────────────────────────────────────────────────
 * Bölüm görselsiz çizilir; hiçbir yerde boş çerçeve durmaz (boş oda yasağı).
 * Yani sayfa görsele borçlu değil, görsel geldikçe zenginleşiyor.
 */

export const NARUTO_IMAGE_KEYS = {
  /** Açılış — tam kadraj hero fonu */
  hero: "naruto:hero",
  /** Shinobi Dünyası — harita bölümünün zemini */
  atlas: "naruto:atlas",
  /** Köyler şeridi — Konoha kadrajı */
  konoha: "naruto:konoha",
  /** İkonik Mekânlar — Hokage Kayalığı */
  hokageRock: "naruto:hokage-rock",
  /** Efsaneler bölümünün arka bandı */
  legends: "naruto:legends",
  /** Klanlar — Uchiha / Senju ikili bandı */
  clans: "naruto:clans",
  /** Gölgeler — Akatsuki kapısının kendi fonu (yoksa serginin
      `akatsuki:legion` kadrajı ödünç alınır, eski davranış) */
  shadows: "naruto:shadows",
  /** Chakra bölümü — doğa dönüşümleri fonu */
  chakra: "naruto:chakra",
  /** Dōjutsu bölümü — göz kadrajı */
  dojutsu: "naruto:dojutsu",
  /** Kuyruklu Canavarlar bölümünün fonu */
  bijuu: "naruto:bijuu",
  /** Hokage Salonu — yedi yüz */
  hokageHall: "naruto:hokage-hall",
  /** Tarih bölümü — savaş bandı */
  history: "naruto:history",
  /** Efsanevi Savaşlar — Son Vadisi */
  valley: "naruto:valley",
  /** Yasak Parşömenler — kapanış bandı */
  scrolls: "naruto:scrolls",
} as const;

export type NarutoImageKey =
  (typeof NARUTO_IMAGE_KEYS)[keyof typeof NARUTO_IMAGE_KEYS];

/**
 * Doğa dönüşümü panellerinin görsel anahtarları — künyenin içindeki
 * element kadrajı (`NarutoChakra` çizer). Aynı ABILITY yuvası deseni.
 */
export function narutoElementKey(elementId: string): string {
  return `naruto:element:${elementId}`;
}

export const NARUTO_ELEMENT_IDS = [
  "fire",
  "wind",
  "lightning",
  "water",
  "earth",
] as const;

/**
 * Kuyruklu canavar sahnesinin görsel anahtarı — jinchūriki + bijuu
 * illüstrasyonu (`BijuuStage` tam kadraj çizer). Aynı ABILITY deseni.
 */
export function narutoBijuuKey(slug: string): string {
  return `naruto:bijuu:${slug}`;
}

/** Küratör kuşağında listelenen yuvalar — sıra sayfadaki sırayla aynı */
export const NARUTO_IMAGE_SLOTS: {
  key: string;
  label: string;
  hint: string;
}[] = [
  { key: NARUTO_IMAGE_KEYS.hero, label: "Açılış fonu", hint: "Tam kadraj, yatay. En az 2560px genişlik." },
  { key: NARUTO_IMAGE_KEYS.atlas, label: "Shinobi Dünyası", hint: "Harita bölümünün zemini." },
  { key: NARUTO_IMAGE_KEYS.konoha, label: "Konohagakure", hint: "Köyler şeridindeki Konoha kadrajı." },
  { key: NARUTO_IMAGE_KEYS.hokageRock, label: "Hokage Kayalığı", hint: "İkonik Mekânlar bölümü." },
  { key: NARUTO_IMAGE_KEYS.legends, label: "Efsaneler bandı", hint: "Kadro duvarının arka fonu." },
  { key: NARUTO_IMAGE_KEYS.clans, label: "Klanlar", hint: "Uchiha / Senju ikili bandı." },
  { key: NARUTO_IMAGE_KEYS.shadows, label: "Gölgeler · Akatsuki fonu", hint: "Akatsuki kapısının kendi kadrajı; boşsa sergiden ödünç alınır." },
  { key: NARUTO_IMAGE_KEYS.chakra, label: "Chakra", hint: "Doğa dönüşümleri bölümünün fonu." },
  { key: narutoElementKey("fire"), label: "Element · Ateş", hint: "Katon panelinin kadrajı (16:9)." },
  { key: narutoElementKey("wind"), label: "Element · Rüzgâr", hint: "Fūton panelinin kadrajı (16:9)." },
  { key: narutoElementKey("lightning"), label: "Element · Yıldırım", hint: "Raiton panelinin kadrajı (16:9)." },
  { key: narutoElementKey("water"), label: "Element · Su", hint: "Suiton panelinin kadrajı (16:9)." },
  { key: narutoElementKey("earth"), label: "Element · Toprak", hint: "Doton panelinin kadrajı (16:9)." },
  { key: NARUTO_IMAGE_KEYS.dojutsu, label: "Dōjutsu", hint: "Göz bölümünün kadrajı." },
  { key: NARUTO_IMAGE_KEYS.bijuu, label: "Kuyruklu Canavarlar", hint: "Bijuu bölümünün fonu." },
  { key: narutoBijuuKey("shukaku"), label: "Bijuu · Shukaku", hint: "Gaara + Shukaku sahnesi (16:9)." },
  { key: narutoBijuuKey("matatabi"), label: "Bijuu · Matatabi", hint: "Yugito + Matatabi sahnesi (16:9)." },
  { key: narutoBijuuKey("isobu"), label: "Bijuu · Isobu", hint: "Yagura + Isobu sahnesi (16:9)." },
  { key: narutoBijuuKey("son-goku"), label: "Bijuu · Son Gokū", hint: "Rōshi + Son Gokū sahnesi (16:9)." },
  { key: narutoBijuuKey("kokuo"), label: "Bijuu · Kokuō", hint: "Han + Kokuō sahnesi (16:9)." },
  { key: narutoBijuuKey("saiken"), label: "Bijuu · Saiken", hint: "Utakata + Saiken sahnesi (16:9)." },
  { key: narutoBijuuKey("chomei"), label: "Bijuu · Chōmei", hint: "Fū + Chōmei sahnesi (16:9)." },
  { key: narutoBijuuKey("gyuki"), label: "Bijuu · Gyūki", hint: "Killer B + Gyūki sahnesi (16:9)." },
  { key: narutoBijuuKey("kurama"), label: "Bijuu · Kurama", hint: "Naruto + Kurama sahnesi (3:2)." },
  { key: NARUTO_IMAGE_KEYS.hokageHall, label: "Hokage Salonu", hint: "Yedi Hokage bir arada." },
  { key: NARUTO_IMAGE_KEYS.history, label: "Tarih", hint: "Savaş dönemleri bandı." },
  { key: NARUTO_IMAGE_KEYS.valley, label: "Son Vadisi", hint: "Efsanevi Savaşlar bölümü." },
  { key: NARUTO_IMAGE_KEYS.scrolls, label: "Yasak Parşömenler", hint: "Kapanış bandı." },
];
