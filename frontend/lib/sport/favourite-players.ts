import { FOOTBALL_MEDIA, type MediaAsset } from "./football-media";

/**
 * Salon 06 · Futbol — FAVORİ FUTBOLCULAR DEFTERİ.
 *
 * ── NEDEN BURADA, VERİTABANINDA DEĞİL ────────────────────────────────────
 * Kulüp, efsane ve dönem kayıtları backend'de çünkü küratör panelinden
 * yazılıyorlar ve iki dilli. Favori futbolcu BAŞKA bir şey: bu bir liste
 * değil, bir SEÇKİ — her girdi kendi renk atmosferini, kendi görsellerini ve
 * kendi anlatı ritmini taşıyor. Bunu veri tabanına koymak yeni bir tablo, yeni
 * bir migration, yeni bir admin ekranı ve iki servisin birlikte deploy
 * edilmesi demekti; kazancı ise sıfırdı, çünkü kayıtları yazan tek kişi zaten
 * bu depoya yazan kişi.
 *
 * Yani bu dosya bilinçli olarak "kod biçiminde içerik". Yeni futbolcu eklemek
 * için tek yapılacak: aşağıdaki diziye bir nesne daha koymak. Rota, kart,
 * profil sayfası, renk atmosferi ve künye kendiliğinden geliyor.
 *
 * ── YENİ FUTBOLCU EKLERKEN ───────────────────────────────────────────────
 *   1. Görselleri `public/spor/futbol/` altına webp olarak koy ve
 *      `football-media.ts`e künyesiyle birlikte yaz (CC BY / BY-SA ise künye
 *      ZORUNLU).
 *   2. Buraya bir `FavouritePlayer` nesnesi ekle. `slug` benzersiz olmalı.
 *   3. Başka hiçbir yere dokunma. `/spor/futbol/futbolcular/<slug>` açılır,
 *      hub sayfasındaki şeritte kartı belirir.
 *
 * ── METİNLER KÜRATÖRÜNDÜR ────────────────────────────────────────────────
 * `story`, `personal` ve `nights[].line` alanları arşivin SESİ — istatistik
 * değil, hatırlama. İlk sürümü ben yazdım; değiştirilmek için yazıldılar.
 */

/** Bölümün ışığını kuran renkler. Her futbolcunun kendi atmosferi var. */
export interface PlayerPalette {
  /** Sahnenin zemini — saf siyah DEĞİL, renkli bir gece */
  ink: string;
  /** Ana vurgu: isim, rakam, çizgi */
  accent: string;
  /** İkinci vurgu — genelde kulüp renginin sıcak tarafı */
  warm: string;
  /** Spot ışığının rengi (arkadan gelen huzme) */
  glow: string;
  /** Neon kenar — az kullanılır, yalnızca kırılma anlarında */
  neon: string;
}

/** Kariyer durağı. Sinematik şeritte her biri bir sahne. */
export interface CareerStop {
  years: string;
  club: string;
  country: string;
  /** Bu duraktan geriye kalan tek cümle */
  note: string;
  /** Durağın ışık rengi — şerit ilerledikçe sahnenin sıcaklığı değişiyor */
  tone: string;
  media?: MediaAsset;
}

/** Unutulmaz gece. Kart hover/odakta açılıyor. */
export interface UnforgettableNight {
  year: number;
  title: string;
  /** Kartın kapalı hâlinde görünen kısa künye ("Old Trafford · 2023") */
  meta: string;
  line: string;
  media?: MediaAsset;
}

/** Küratörün kişisel notu — sayfanın en özel alanı. */
export interface PersonalNote {
  label: string;
  title: string;
  body: string;
}

export interface FavouritePlayer {
  slug: string;
  /** Kart ve hero'da tam ad */
  name: string;
  /** Dev tipografi iki satıra bölünüyor */
  firstName: string;
  lastName: string;
  shirt: number | null;
  position: string;
  club: string;
  country: string;
  countryCode: string;
  birthYear: number;
  /** Kartın altındaki tek satır — küratörün cümlesi */
  tagline: string;
  /** Hero'daki büyük alıntı */
  quote: string;
  quoteBy: string | null;
  palette: PlayerPalette;
  /** Tercihen saydam zeminli kesim — kart ve hero bunun üstüne kuruluyor */
  figure: MediaAsset;
  /** Hero'nun arka plakası. Yoksa CSS atmosferi tek başına çalışıyor. */
  backdrop?: MediaAsset;
  /** Hero künye şeridi: "FORVET / GOLCÜ / FAVORİLER" */
  badges: string[];
  /** Sayısal künye — Bebas ile basılıyor */
  figures: Array<{ label: string; value: string }>;
  story: string[];
  career: CareerStop[];
  nights: UnforgettableNight[];
  personal: PersonalNote[];
  gallery: MediaAsset[];
}

/**
 * ⚠️ SIRA ÖNEMLİ. Şeritteki dizilim bu dizinin sırası; ilk kayıt aynı zamanda
 * hub sayfasındaki en geniş karttır.
 */
export const FAVOURITE_PLAYERS: FavouritePlayer[] = [
  {
    slug: "mauro-icardi",
    name: "Mauro Icardi",
    firstName: "MAURO",
    lastName: "ICARDI",
    shirt: 9,
    position: "Santrfor",
    club: "Galatasaray",
    country: "Arjantin",
    countryCode: "AR",
    birthYear: 1993,
    tagline: "Ceza sahasının içinde zamanı yavaşlatan adam.",
    quote:
      "Kalabalık bir ceza sahasında herkes topa bakar. O, topun birazdan olacağı yere bakar.",
    quoteBy: null,
    palette: {
      ink: "#0a1226",
      accent: "#ffc72c",
      warm: "#c8102e",
      glow: "rgba(255, 199, 44, 0.34)",
      neon: "#7b3fe4",
    },
    figure: FOOTBALL_MEDIA.icardiFigure,
    backdrop: FOOTBALL_MEDIA.stadiumNight,
    badges: ["Forvet", "Golcü", "Favoriler"],
    figures: [
      { label: "Forma", value: "9" },
      { label: "Doğum", value: "1993" },
      { label: "Ülke", value: "Arjantin" },
      { label: "Mevki", value: "Santrfor" },
    ],
    story: [
      "Rosario'da doğdu, ama futbolu Kanarya Adaları'nda öğrendi. Ailesi İspanya'ya taşındığında çocuk yaşta Vecindario'nun altyapısındaydı; oradan Barcelona'nın La Masia'sına geçti. Dünyanın en çok pas veren okulunda, en az pas veren mevkiyi seçti.",
      "Barcelona'da kalmadı. İtalya'ya, Sampdoria'ya gitti ve Serie A'ya orada çıktı. Genç bir santrforun İtalya'ya gitmesi genelde bir gerileme sayılır; onun için bir uzmanlaşmaydı. İtalya, ceza sahası içinde durmayı öğreten ülkedir.",
      "2013'te Inter'e geçti ve iki kez Serie A'nın gol kralı oldu — 2014-15 ve 2017-18. Yirmi iki yaşında kaptanlık pazubendini taktı. Bir forvet için kaptanlık alışılmadıktır: takımın en bencil mevkisine takımın sorumluluğunu vermek demektir.",
      "Paris'te iki lig şampiyonluğu, sonra İstanbul. Galatasaray'a geldiğinde otuz yaşındaydı ve kariyerinin en yüksek gol ortalamasını burada tutturdu. Üst üste gelen şampiyonlukların ortasında, kulübün on numarası değil dokuz numarası oldu — ve bu şehirde dokuz numara olmak, on numara olmaktan zordur.",
    ],
    career: [
      {
        years: "2008 — 2011",
        club: "Barcelona altyapısı",
        country: "İspanya",
        note: "Dünyanın en çok pas veren okulunda bitiriciliği öğrendi.",
        tone: "#2f4a8c",
        media: FOOTBALL_MEDIA.icardiYoung,
      },
      {
        years: "2011 — 2013",
        club: "Sampdoria",
        country: "İtalya",
        note: "Serie A'ya çıkış. Ceza sahasında durmayı burada öğrendi.",
        tone: "#1f5fa8",
        media: FOOTBALL_MEDIA.icardiSampdoria,
      },
      {
        years: "2013 — 2020",
        club: "Internazionale",
        country: "İtalya",
        note: "İki kez gol kralı, yirmi iki yaşında kaptan.",
        tone: "#1b2f6b",
        media: FOOTBALL_MEDIA.icardiInter,
      },
      {
        years: "2019 — 2022",
        club: "Paris Saint-Germain",
        country: "Fransa",
        note: "Yıldızlarla dolu bir hücumda dokuz numaranın işini yaptı.",
        tone: "#141d4a",
        media: FOOTBALL_MEDIA.icardiPsg,
      },
      {
        years: "2022 —",
        club: "Galatasaray",
        country: "Türkiye",
        note: "Kariyerinin en yüksek gol ortalaması. Ve bir tribün.",
        tone: "#c8102e",
        media: FOOTBALL_MEDIA.icardiFigure,
      },
    ],
    nights: [
      {
        year: 2017,
        title: "Milano derbisi",
        meta: "San Siro · Inter — Milan",
        line: "Derbide hat-trick. Sonuncusu doksanı geçtikten sonra geldi ve stadyumun sesi bir anda tek bir sese düştü.",
        media: FOOTBALL_MEDIA.icardiInter,
      },
      {
        year: 2018,
        title: "İkinci gol kralı",
        meta: "Serie A · 2017-18",
        line: "Bir sezonda ikinci kez ligin en golcüsü. İtalya'da bunu yapan yabancı sayısı azdır; iki kez yapan daha da az.",
        media: FOOTBALL_MEDIA.icardiField,
      },
      {
        year: 2023,
        title: "Old Trafford",
        meta: "Şampiyonlar Ligi · Manchester United — Galatasaray",
        line: "Avrupa'nın en tanıdık stadyumunda, seksen birinci dakikada. Sarı-kırmızı bir deplasman tribünü ve bir gol.",
        media: FOOTBALL_MEDIA.icardiFigure,
      },
      {
        year: 2024,
        title: "Gol kralı, üçüncü ülke",
        meta: "Süper Lig · 2023-24",
        line: "İtalya'dan sonra Türkiye. Aynı işi üç farklı ligde yapan bir forvetin listesi kısadır.",
        media: FOOTBALL_MEDIA.icardiRecent,
      },
    ],
    personal: [
      {
        label: "Sevinç",
        title: "El kulakta",
        body: "Gol attıktan sonra elini kulağına götürüyor. Bu bir kutlama değil, bir cevap — sesin nereden geldiğini bildiğini gösteriyor. Arşivdeki en sevdiğim sevinç bu; çünkü karşı tribüne değil, kendi tribününe dönük.",
      },
      {
        label: "Alışkanlık",
        title: "İlk direk",
        body: "Ortanın nereden geleceğini beklemez, ilk direğe koşar ve orada durur. Golün yarısı bu koşu, yarısı bekleyiş. İkincisi öğretilemez.",
      },
      {
        label: "Detay",
        title: "Kafa vuruşunun açısı",
        body: "Kafa golü atarken topu aşağı indirir. Kalecinin ayaklarının dibine düşen top, en zor kurtarılan toptur — bunu bilerek yapan çok az forvet var.",
      },
    ],
    gallery: [
      FOOTBALL_MEDIA.icardiFigure,
      FOOTBALL_MEDIA.icardiInter,
      FOOTBALL_MEDIA.icardiSampdoria,
      FOOTBALL_MEDIA.icardiPsg,
      FOOTBALL_MEDIA.icardiYoung,
      FOOTBALL_MEDIA.icardiField,
      FOOTBALL_MEDIA.icardiRecent,
      FOOTBALL_MEDIA.stadiumNight,
    ],
  },
];

export function findFavouritePlayer(slug: string): FavouritePlayer | undefined {
  return FAVOURITE_PLAYERS.find((player) => player.slug === slug);
}
