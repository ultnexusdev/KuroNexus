/**
 * Pist hero'sundaki ülke şeridi.
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
  GB: { colors: ["#012169", "#FFFFFF", "#C8102E"], direction: "vertical" },
  US: { colors: ["#3C3B6E", "#FFFFFF", "#B22234"], direction: "vertical" },
  AU: { colors: ["#012169", "#FFFFFF", "#E4002B"], direction: "vertical" },
  TR: { colors: ["#E30A17", "#FFFFFF", "#E30A17"], direction: "vertical" },
};

export function flagBands(countryCode: string | null | undefined): FlagBands | null {
  if (!countryCode) return null;
  return FLAGS[countryCode.toUpperCase()] ?? null;
}
