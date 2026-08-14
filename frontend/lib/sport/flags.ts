/**
 * Ülke şeridi — pist hero'su ve efsane levhası.
 *
 * NEDEN BAYRAK GÖRSELİ DEĞİL: bayrak dosyası yapıştırmak sticker etkisi
 * yapardı ve F1 kanadının dili "teknik, geometrik". Bayrağın kendisi zaten
 * geometri — dikey/yatay alanlar. O yüzden görsel değil, **alan** olarak
 * çiziliyor: koyu zemine düşük yoğunlukta üç şerit. İtalya'yı tanımak için
 * yeterli, pano hissi vermeden.
 *
 * Genel tutuldu: Monza'ya özel bir yama değil. Spa eklendiğinde Belçika,
 * Silverstone eklendiğinde Birleşik Krallık kendiliğinden gelir. Listede
 * olmayan ülke için `null` döner ve hero şeritsiz açılır (boş oda yasağı:
 * yarım bir şey göstermektense hiç göstermemek).
 */

export interface FlagBands {
  /** Şerit renkleri, bayraktaki sırayla */
  colors: string[];
  /** Şeritler dikey mi yatay mı — bayrağın kendi yönü */
  direction: "vertical" | "horizontal";
  /**
   * Bant payları. Verilmezse renkler EŞİT bölünür — üç renkli bayrakların
   * çoğu için doğru olan bu. Yalnızca eşit olmayan bayraklar yazar (bkz. GB).
   */
  weights?: number[];
}

const FLAGS: Record<string, FlagBands> = {
  IT: { colors: ["#008C45", "#F4F5F0", "#CD212A"], direction: "vertical" },
  FR: { colors: ["#002395", "#FFFFFF", "#ED2939"], direction: "vertical" },
  BE: { colors: ["#000000", "#FAE042", "#ED2939"], direction: "vertical" },
  DE: { colors: ["#000000", "#DD0000", "#FFCE00"], direction: "horizontal" },
  ES: { colors: ["#AA151B", "#F1BF00", "#AA151B"], direction: "horizontal" },
  AT: { colors: ["#ED2939", "#FFFFFF", "#ED2939"], direction: "horizontal" },
  NL: { colors: ["#AE1C28", "#FFFFFF", "#21468B"], direction: "horizontal" },
  HU: { colors: ["#436F4D", "#FFFFFF", "#CD2A3E"], direction: "horizontal" },
  MC: { colors: ["#CE1126", "#FFFFFF"], direction: "horizontal" },
  BR: { colors: ["#009C3B", "#FFDF00", "#002776"], direction: "vertical" },
  MX: { colors: ["#006847", "#FFFFFF", "#CE1126"], direction: "vertical" },
  CA: { colors: ["#D80621", "#FFFFFF", "#D80621"], direction: "vertical" },
  JP: { colors: ["#FFFFFF", "#BC002D", "#FFFFFF"], direction: "vertical" },
  /**
   * ⚠️ UNION JACK ÜÇ EŞİT BANT DEĞİL. Öyle yazılıydı ve ekranda Hollanda/
   * Fransa deseni çıkıyordu: aynı sayfada Hagi'nin Romanya şeridiyle BİRE BİR
   * aynı biçim, yalnızca renkleri başka. Kullanıcı "İngiliz ama renkler
   * uyumsuz" diye bildirdi (14 Ağustos 2026) — şikâyet biçime dairdi.
   *
   * Bu beş bant bayrağın ORTASINDAN alınan yatay kesit: lacivert alan, beyaz
   * kenarlık, St George haçının kırmızı dikmesi, beyaz, lacivert. Ağırlıklar
   * eşit değil çünkü dikme dar. Kesit bir kısaltmadır ama uydurma değil —
   * bayrakta gerçekten o sırayla o renkler var.
   */
  GB: {
    colors: ["#012169", "#FFFFFF", "#C8102E", "#FFFFFF", "#012169"],
    weights: [3, 1, 2, 1, 3],
    direction: "vertical",
  },
  US: { colors: ["#3C3B6E", "#FFFFFF", "#B22234"], direction: "vertical" },
  AU: { colors: ["#012169", "#FFFFFF", "#E4002B"], direction: "vertical" },
  TR: { colors: ["#E30A17", "#FFFFFF", "#E30A17"], direction: "vertical" },
  /* Futbol tarafı da bu tabloyu okuyor: efsanenin ülkesi (Hagi → RO).
     Tablo pistlerle sınırlı değil, "spor kanadının ülke alfabesi". */
  RO: { colors: ["#002B7F", "#FCD116", "#CE1126"], direction: "vertical" },
  AR: { colors: ["#75AADB", "#FFFFFF", "#75AADB"], direction: "horizontal" },
  PT: { colors: ["#046A38", "#DA291C"], direction: "vertical" },
  RS: { colors: ["#C6363C", "#0C4076", "#FFFFFF"], direction: "horizontal" },
};

export function flagBands(countryCode: string | null | undefined): FlagBands | null {
  if (!countryCode) return null;
  return FLAGS[countryCode.toUpperCase()] ?? null;
}

/**
 * Uyruk SÖZCÜĞÜ → ülke kodu.
 *
 * NEDEN GEREKLİ: `sync-f1-results.ts` sürücü satırına `countryCode` yazmıyor
 * (yalnızca ad, slug, portre). Ama podyum kayıtları Ergast'ın `driverNationality`
 * alanını taşıyor: "German", "Brazilian", "British". Bu aynı bilginin başka
 * yazımı — çevirmek uydurmak değil.
 *
 * Yalnızca YUKARIDAKİ TABLODA KARŞILIĞI OLAN uyruklar burada. Karşılığı
 * olmayan uyruk `null` döner ve şerit hiç çizilmez (boş oda yasağı);
 * yaklaşık bir bayrak göstermektense hiç göstermemek doğru.
 */
const NATIONALITY_TO_CODE: Record<string, string> = {
  British: "GB",
  German: "DE",
  Brazilian: "BR",
  Italian: "IT",
  French: "FR",
  Spanish: "ES",
  Dutch: "NL",
  Austrian: "AT",
  Belgian: "BE",
  Hungarian: "HU",
  Monegasque: "MC",
  Mexican: "MX",
  Canadian: "CA",
  Japanese: "JP",
  American: "US",
  Australian: "AU",
  Turkish: "TR",
  Romanian: "RO",
  Argentine: "AR",
  Argentinian: "AR",
  Portuguese: "PT",
  Serbian: "RS",
};

/**
 * Spor kanadının bayrak kapısı: önce küratörün yazdığı ülke kodu, o yoksa
 * senkronizasyonun getirdiği uyruk sözcüğü. Sıra önemli — küratör bir gün
 * kodu doldurursa yedek devreden çıkmalı.
 */
export function sportFlag(
  countryCode: string | null | undefined,
  nationality?: string | null,
): FlagBands | null {
  const direct = flagBands(countryCode);
  if (direct) return direct;
  if (!nationality) return null;
  return flagBands(NATIONALITY_TO_CODE[nationality.trim()]);
}

/**
 * Şeridi CSS gradient'ine çevirir.
 *
 * ⚠️ SERT DURAKLAR ZORUNLU. Renkler `linear-gradient(a, b, c)` diye
 * yazılırsa tarayıcı aralarını YUMUŞATIR ve İtalya bayrağı yeşilden kırmızıya
 * geçen bir bulanıklık olur. Her renk kendi diliminin iki ucunda da
 * tekrarlanınca kenar keskin kalıyor — bayrak "alan" olur, degrade olmaz.
 *
 * Bu hesap pist hero'sunda satır içi yazılıydı; efsane levhası da aynı şeridi
 * kullanınca tek yere alındı. İki ayrı kopya, bir gün birinde yumuşak
 * gradient bırakma riskiydi.
 */
export function flagGradient(
  bands: FlagBands,
  axis: "own" | "across" = "own",
): string {
  const weights = bands.weights ?? bands.colors.map(() => 1);
  const total = weights.reduce((sum, w) => sum + w, 0);

  let acc = 0;
  const stops = bands.colors
    .map((color, i) => {
      const from = (acc / total) * 100;
      acc += weights[i] ?? 1;
      const to = (acc / total) * 100;
      return `${color} ${from}%, ${color} ${to}%`;
    })
    .join(", ");

  /**
   * `axis: "across"` — şeridi bayrağın kendi yönüne DEĞİL kabın uzun kenarına
   * çizer. Panteon levhasındaki şerit **3 piksel** yüksekliğinde; orada
   * `to bottom` çizilen Almanya bayrağı üç bandı 1'er piksele eziyor ve
   * okunmaz bir çamura dönüşüyordu (kullanıcı bildirimi, 14 Ağustos 2026).
   *
   * 3 pikselde bayrağın YÖNÜ zaten temsil edilemez, RENKLERİ edilebilir; o
   * yüzden ince şeritte yön feda ediliyor, renk sırası korunuyor. Yüksekliği
   * olan yerler (pist hero'su) varsayılan `"own"` ile kendi yönünü çizmeye
   * devam eder — bu yüzden parametre, kalıcı değişiklik değil.
   */
  const direction =
    axis === "across" || bands.direction === "vertical"
      ? "to right"
      : "to bottom";

  return `linear-gradient(${direction}, ${stops})`;
}
