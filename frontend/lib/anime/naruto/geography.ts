import type {
  NarutoMinorVillage,
  NarutoNation,
  NarutoPlace,
  NarutoVillage,
} from "./types";

/**
 * Naruto Evreni — coğrafya kaydı (uluslar, köyler, mekânlar).
 *
 * ── KAYNAK ───────────────────────────────────────────────────────────────
 * Olgular Narutopedia'nın Türkçe sürümünden denetlendi (Konohagakure ve
 * Hokage maddeleri; CC-BY-SA). Metinler KOPYALANMADI: her kayıt bu arşivin
 * kendi sesiyle yeniden yazıldı — kaynak doğruluk için, üslup için değil.
 *
 * ── RENKLER VE KURAL 16 ──────────────────────────────────────────────────
 * Kayıtlardaki `accent`/`dot`/`tint` alanları token DEĞİL, çünkü token
 * olamazlar: ateş kırmızı, rüzgâr sarıdır — bu bir tema kararı değil
 * içeriğin kendisi (bayrak rengi gibi). Akatsuki sergisindeki `--aka-*`
 * ailesiyle aynı gerekçe. Sayfanın KABUĞU (zemin, kenarlık, metin) tamamen
 * token okur; buradaki renkler yalnızca kayda ait vurgudur.
 */

/** Sayfanın sahibi karakter — küratör görselleri bu kimliğe bağlanır.
    AniList numarası; `lib/anime/akatsuki.ts` içindeki kayıtla aynı (17). */
export const NARUTO_OWNER_ID = 17;

export const NARUTO_NATIONS: NarutoNation[] = [
  {
    id: "konoha",
    code: "火 · ATEŞ ÜLKESİ",
    country: "Ateş Ülkesi",
    village: "Konohagakure",
    villageEn: "The Village Hidden in the Leaves",
    kage: "Hokage",
    clans: "Uchiha · Senju · Hyūga · Nara · Akimichi · Yamanaka · Aburame",
    places: "Hokage Kayalığı · Ichiraku Ramen · Ölüm Ormanı · Naka Tapınağı",
    note:
      "Shinobi dünyasının ilk gizli köyü. Hashirama Senju ile Madara Uchiha'nın " +
      "kan davasını bitiren anlaşmasıyla kuruldu; adını Madara koydu. Köyün " +
      "altyapısının büyük kısmını Hashirama, Ahşap Salım'la yükseltti.",
    x: "58%",
    y: "46%",
    accent: "#ef4b4b",
    dot: "#d32f2f",
  },
  {
    id: "suna",
    code: "風 · RÜZGÂR ÜLKESİ",
    country: "Rüzgâr Ülkesi",
    village: "Sunagakure",
    villageEn: "The Village Hidden in the Sand",
    kage: "Kazekage",
    clans: "Çöl klanları · Kugutsu (kukla) ustaları",
    places: "Kazekage Konağı · Çöl Vadisi · Kukla Atölyesi",
    note:
      "Çölün ortasında, kaynakları kısıtlı bir köy. Kukla ustalığı ve rüzgâr " +
      "doğası burada olgunlaştı; Shukaku'nun jinchūriki'si de bu köyden.",
    x: "27%",
    y: "62%",
    accent: "#e6b84c",
    dot: "oklch(0.78 0.11 85)",
  },
  {
    id: "kumo",
    code: "雷 · YILDIRIM ÜLKESİ",
    country: "Yıldırım Ülkesi",
    village: "Kumogakure",
    villageEn: "The Village Hidden in the Clouds",
    kage: "Raikage",
    clans: "Yotsuki · Bulut samuray hattı",
    places: "Şimşek Kaya Sırtı · Gyūki Tapınağı · Raikage Kulesi",
    note:
      "Dağların tepesinde, bulutların içinde kurulu. Ham güç ve yıldırım " +
      "zırhıyla anılır. Byakugan'ı ele geçirme girişimi Hyūga Olayı'nı doğurdu.",
    x: "79%",
    y: "28%",
    accent: "oklch(0.82 0.12 95)",
    dot: "oklch(0.8 0.13 95)",
  },
  {
    id: "iwa",
    code: "土 · TOPRAK ÜLKESİ",
    country: "Toprak Ülkesi",
    village: "Iwagakure",
    villageEn: "The Village Hidden in the Stones",
    kage: "Tsuchikage",
    clans: "Kamizuru · Patlama Salımı hattı",
    places: "Kaya Sütunları · Tsuchikage Kalesi · Maden Ocakları",
    note:
      "Sarp kayalıklara oyulmuş köy. Toprak doğası ve patlama kekkei genkai'si " +
      "buradan çıktı. Üçüncü Savaş'ta Konoha ile Kusagakure topraklarında çarpıştı.",
    x: "38%",
    y: "24%",
    accent: "oklch(0.72 0.07 60)",
    dot: "oklch(0.68 0.08 60)",
  },
  {
    id: "kiri",
    code: "水 · SU ÜLKESİ",
    country: "Su Ülkesi",
    village: "Kirigakure",
    villageEn: "The Village Hidden in the Mist",
    kage: "Mizukage",
    clans: "Hōzuki · Kaguya · Yuki · Terumī",
    places: "Kanlı Sis Sınavı Alanı · Yedi Kılıç Salonu · Mercan Mağaraları",
    note:
      "Kanlı sis dönemiyle anılan sert köy. Yedi Kılıç Ustası geleneği ve " +
      "kekkei genkai avı bu köyün tarihine kazındı.",
    x: "14%",
    y: "33%",
    accent: "oklch(0.7 0.09 220)",
    dot: "oklch(0.66 0.1 220)",
  },
  {
    id: "ame",
    code: "雨 · YAĞMUR ÜLKESİ",
    country: "Yağmur Ülkesi",
    village: "Amegakure",
    villageEn: "The Village Hidden in the Rain",
    kage: "Pain / Akatsuki",
    clans: "—",
    places: "Merkez Kule · Sonsuz Yağmur Sokakları",
    note:
      "Üç büyük savaşın arasında ezilen, yağmuru hiç dinmeyen çelik şehir. " +
      "İkinci Savaş'ta Hanzō üç Konoha gencine burada 'Sannin' adını verdi; " +
      "yıllar sonra Akatsuki'nin üssü oldu.",
    x: "46%",
    y: "38%",
    accent: "#ef4444",
    dot: "oklch(0.6 0.18 28)",
  },
  {
    id: "oto",
    code: "音 · SES",
    country: "Ses Ülkesi",
    village: "Otogakure",
    villageEn: "The Village Hidden in the Sound",
    kage: "Orochimaru",
    clans: "—",
    places: "Gizli Laboratuvarlar · Kuzey Sığınağı",
    note:
      "Orochimaru'nun deney köyü. Sabit bir coğrafyası yok; sığınaklardan " +
      "oluşur ve gerektiğinde yer değiştirir.",
    x: "66%",
    y: "62%",
    accent: "oklch(0.7 0.12 300)",
    dot: "oklch(0.62 0.13 300)",
  },
];

/** Beş büyük köy — künye şeridi */
export const NARUTO_VILLAGES: NarutoVillage[] = [
  {
    name: "Konohagakure",
    en: "Village Hidden in the Leaves",
    kanji: "木ノ葉 · 火",
    tint: "rgba(120,170,90,.13)",
  },
  {
    name: "Sunagakure",
    en: "Village Hidden in the Sand",
    kanji: "砂 · 風",
    tint: "rgba(226,180,90,.13)",
  },
  {
    name: "Kirigakure",
    en: "Village Hidden in the Mist",
    kanji: "霧 · 水",
    tint: "rgba(120,160,200,.13)",
  },
  {
    name: "Kumogakure",
    en: "Village Hidden in the Clouds",
    kanji: "雲 · 雷",
    tint: "rgba(226,210,120,.12)",
  },
  {
    name: "Iwagakure",
    en: "Village Hidden in the Stones",
    kanji: "岩 · 土",
    tint: "rgba(180,150,110,.13)",
  },
];

/** Yan köyler — beş büyüğün dışında kalan, hikâyeyi taşıyanlar */
export const NARUTO_MINOR_VILLAGES: NarutoMinorVillage[] = [
  {
    name: "Amegakure",
    tag: "AKATSUKI ÜSSÜ · SONSUZ YAĞMUR",
    color: "oklch(0.7 0.15 30)",
  },
  {
    name: "Otogakure",
    tag: "OROCHIMARU'NUN LABORATUVARLARI",
    color: "oklch(0.7 0.12 300)",
  },
  {
    name: "Takigakure",
    tag: "KAHRAMAN SUYU · CHŌMEI",
    color: "oklch(0.74 0.1 165)",
  },
  {
    name: "Kusagakure",
    tag: "TAMPON BÖLGE · CENNET KÖPRÜSÜ",
    color: "oklch(0.76 0.1 140)",
  },
  {
    name: "Yugakure",
    tag: "SICAK SU · HIDAN'IN MEMLEKETİ",
    color: "oklch(0.78 0.09 60)",
  },
  {
    name: "Uzushiogakure",
    tag: "YIKILDI · UZUMAKI KLANI · FUINJUTSU",
    color: "oklch(0.62 0.16 22)",
  },
];

/** İkonik mekânlar — bölgeye göre gruplanır */
export const NARUTO_PLACES: NarutoPlace[] = [
  {
    region: "KONOHAGAKURE",
    name: "Hokage Kayalığı",
    desc:
      "Göreve gelen her Hokage'nin yüzü kayaya oyulur. Köy yerle bir olduğunda " +
      "halk aynı yere yeniden inşa etmeyi seçti: onlara göre kayalık neredeyse, " +
      "Konoha orasıydı.",
  },
  {
    region: "KONOHAGAKURE",
    name: "Ichiraku Ramen",
    desc:
      "Evrenin en çok konuşulan tezgâhı. Iruka'nın Naruto'ya ilk kez sıradan " +
      "bir çocuk gibi davrandığı yer.",
  },
  {
    region: "KONOHAGAKURE",
    name: "Ölüm Ormanı",
    desc:
      "44. Eğitim Alanı. Chūnin Sınavı'nın ikinci aşaması ve Orochimaru'nun " +
      "Sasuke'yi damgaladığı yer.",
  },
  {
    region: "KONOHAGAKURE",
    name: "Uchiha Bölgesi",
    desc:
      "Katliamdan sonra kapatılan mahalle. Duvarlarda hâlâ klanın yelpaze " +
      "arması duruyor.",
  },
  {
    region: "KONOHAGAKURE",
    name: "Naka Tapınağı",
    desc:
      "Uchiha'nın gizli toplantı yeri. Klanın taş tabletinin saklandığı " +
      "yeraltı odası buraya açılır.",
  },
  {
    region: "KONOHAGAKURE",
    name: "Anıt Taş",
    desc:
      "Görevde ölen shinobi'lerin adları. Kakashi'nin sabahlarını geçirdiği taş.",
  },
  {
    region: "KUTSAL DAĞLAR",
    name: "Myōboku Dağı",
    desc: "Kurbağaların diyarı. Jiraiya ve Naruto'nun senjutsu eğitimi burada geçti.",
  },
  {
    region: "KUTSAL DAĞLAR",
    name: "Ryūchi Mağarası",
    desc: "Yılanların beyaz mağarası; Sasuke ve Kabuto'nun sage yolu buradan geçer.",
  },
  {
    region: "KUTSAL DAĞLAR",
    name: "Shikkotsu Ormanı",
    desc: "Salyangozların ormanı. Tsunade'nin tıbbi hattının kaynağı.",
  },
  {
    region: "SINIR",
    name: "Son Vadisi",
    desc:
      "Hashirama ve Madara'nın heykelleri. Aynı kavga burada iki kez, iki " +
      "kuşakla yaşandı.",
  },
  {
    region: "AMEGAKURE",
    name: "Yağmur Köyü",
    desc:
      "Çelik kuleler, hiç dinmeyen yağmur ve gökyüzünde kendini tanrı ilan " +
      "eden bir adam.",
  },
  {
    region: "GÖLGELER",
    name: "Akatsuki Sığınakları",
    desc: "Gedo heykelinin durduğu mağaralar; her ülkede bir tanesi gizli.",
  },
];
