import type { MediaCredit } from "./football-media";

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
 * ── YENİ FUTBOLCU EKLERKEN ───────────────────────────────────────────────
 *   1. `public/assets/players/<slug>/` klasörünü aç.
 *   2. Buraya bir `FavouritePlayer` nesnesi ekle. Görseli olmayan her yuvayı
 *      `placeholder: true` bırak — sayfa "FOTO EKLENECEK" çerçevesi çiziyor,
 *      kırık görsel kutusu DEĞİL.
 *   3. Başka hiçbir yere dokunma. `/spor/futbol/futbolcular/<slug>` açılır,
 *      hub sayfasındaki şeritte kartı belirir, sayfa `accent` rengini giyer.
 *
 * ── GÖRSEL YUVALARI (SLOT) ───────────────────────────────────────────────
 * Her görsel bir `PlayerImageSlot` ve her yuvanın KARARLI bir `id`si var.
 * Küratör modu bu id üzerinden çalışıyor: yüklenen dosya id'ye bağlanıyor,
 * kalıcı kod parçacığı da id ile üretiliyor. id'yi değiştirmek küratörün o
 * yuvaya yaptığı düzenlemeyi koparır — yeniden adlandırma yapma.
 */

// ---------------------------------------------------------------------------
// Görsel yuvası
// ---------------------------------------------------------------------------

export interface PlayerImageSlot {
  /**
   * Kararlı kimlik. Küratör düzenlemesinin ve kalıcı kod parçacığının
   * anahtarı. Sayfada benzersiz olmalı.
   */
  id: string;
  /**
   * Dosyanın olması GEREKEN yer. Yuva `placeholder` iken bu adres yalnızca
   * küratöre "dosyayı buraya koy" demek için duruyor, ağ isteği yapılmıyor.
   */
  src: string;
  alt: string;
  /**
   * ⚠️ `true` iken görsel İSTENMİYOR: bileşen tasarlanmış bir yer tutucu
   * çerçeve + "FOTO EKLENECEK" etiketi çiziyor ve `data-placeholder`
   * özniteliği basıyor. Gerçek fotoğraf `src` yoluna konduktan sonra bu
   * bayrağı `false` yap (ya da küratör modundan yükle — o anında geçersiz
   * kılıyor).
   *
   * Neden ağ isteği yapılmıyor: her sayfa açılışında 8-10 adet 404 üretmek
   * hem konsolu kirletir hem de tarayıcının bağlantı havuzunu boşa harcar.
   */
  placeholder?: boolean;
  /** Küratöre ne konacağını söyleyen kadraj notu — yer tutucunun içinde yazılı */
  hint?: string;
  width?: number;
  height?: number;
  credit?: MediaCredit | null;
  /** Işık kutusunda ve ızgarada görünen kısa künye */
  caption?: string;
}

/** Bölümün ışığını kuran renkler — kulübe göre değişiyor. */
export interface PlayerPalette {
  /** Sahnenin zemini — saf siyah DEĞİL, renkli bir gece */
  ink: string;
  /** Ana vurgu: isim, rakam, çizgi */
  accent: string;
  /** İkinci vurgu — kulüp renginin sıcak/koyu tarafı */
  warm: string;
  /** Spot ışığının rengi */
  glow: string;
  /** Neon kenar — az kullanılır */
  neon: string;
}

/**
 * Kariyer durağı.
 *
 * `tone` durağın kendi ışığı: şerit ilerledikçe hat o renge dönüyor ve
 * parlaklığı artıyor. Sonuncu durak (`current`) hattın zirvesi.
 */
export interface CareerStop {
  id: string;
  years: string;
  club: string;
  country: string;
  /** Bu duraktan geriye kalan tek cümle */
  note: string;
  tone: string;
  matches: number | null;
  goals: number | null;
  image: PlayerImageSlot;
  /** Şeridin bu noktada zirveye çıkması (mevcut kulüp) */
  current?: boolean;
}

/** Unutulmaz gece. */
export interface UnforgettableNight {
  year: number;
  title: string;
  meta: string;
  line: string;
  image: PlayerImageSlot;
}

/** Küratörün kişisel notu. */
export interface PersonalNote {
  label: string;
  title: string;
  body: string;
}

/** İstatistik satırı — Bebas/Anton ile basılıyor. */
export interface StatEntry {
  key: string;
  label: string;
  value: string;
}

/**
 * İki istatistik kümesi.
 *
 * ── NEDEN İKİ KÜME ───────────────────────────────────────────────────────
 * "297 maç" bir kariyer toplamı, "98 maç" bir kulüp hikâyesi. İkisini aynı
 * satırda göstermek ikisini de anlamsızlaştırıyor. Sayfa varsayılan olarak
 * KULÜP kümesini açıyor (bu bir Galatasaray arşivi), armaya basınca kulüp
 * kümesi ışığını açıyor, "tüm zamanlar"a basınca kariyer toplamına geçiyor.
 */
export interface PlayerStats {
  club: {
    key: string;
    label: string;
    /** Kulüp arması — armaya tıklamak kulüp kümesini açıyor */
    crest: PlayerImageSlot;
    entries: StatEntry[];
    /** Kümenin altındaki tek cümle */
    note: string;
  };
  all: {
    label: string;
    entries: StatEntry[];
    note: string;
  };
}

export interface FavouritePlayer {
  slug: string;
  name: string;
  /** Dev tipografi iki satıra bölünüyor */
  firstName: string;
  lastName: string;
  shirt: number | null;
  position: string;
  club: string;
  clubShort: string;
  country: string;
  countryCode: string;
  birthDate: string;
  birthPlace: string;
  height: string;
  weight: string;
  /** Kartın altındaki tek satır */
  tagline: string;
  quote: string;
  /** Sayfanın sonundaki büyük alıntı */
  closingQuote: string;
  palette: PlayerPalette;
  /** Hero'nun taşıyıcı görseli — dikey kadraj */
  hero: PlayerImageSlot;
  /** Hub sayfasındaki kart için (yatay/dikey fark etmez) */
  card: PlayerImageSlot;
  /** Hero künye şeridi: "FORVET / 9 / GALATASARAY" */
  badges: string[];
  /** Hero'nun alt künyesi */
  vitals: Array<{ label: string; value: string }>;
  storyTitle: [string, string];
  storyLede: string;
  story: string[];
  stats: PlayerStats;
  career: CareerStop[];
  nights: UnforgettableNight[];
  personal: PersonalNote[];
  gallery: PlayerImageSlot[];
}

const ICARDI = "/assets/players/icardi";

/**
 * ⚠️ SAYILAR KÜRATÖRÜN — DOĞRULANMADI.
 *
 * Aşağıdaki maç/gol/asist/kupa değerleri kullanıcının tasarım referansından
 * alındı ve dış bir kaynakla karşılaştırılmadı. İçlerinde bilinen bir
 * tutarsızlık var: kulüp kırılımı (Sampdoria + Inter + PSG + Galatasaray)
 * toplanınca maç sayısı "tüm zamanlar" satırındaki 297'yi aşıyor. İkisini
 * uydurma bir sayıyla hizalamak yerine ikisi de olduğu gibi bırakıldı —
 * düzeltmesi bu dosyada tek satır.
 */
export const FAVOURITE_PLAYERS: FavouritePlayer[] = [
  {
    slug: "mauro-icardi",
    name: "Mauro Icardi",
    firstName: "MAURO",
    lastName: "ICARDI",
    shirt: 9,
    position: "Forvet",
    club: "Galatasaray",
    clubShort: "GS",
    country: "Arjantin",
    countryCode: "AR",
    birthDate: "19 Şubat 1993",
    birthPlace: "Rosario, Arjantin",
    height: "181 cm",
    weight: "75 kg",
    tagline: "Ceza sahasının içinde zamanı yavaşlatan adam.",
    quote: "Kafamdaki tek şey gol atmak ve Galatasaray için savaşmak.",
    closingQuote:
      "Ben buraya para için değil, sevgi için geldim. Galatasaray benim evim.",
    palette: {
      ink: "#0c0b0e",
      accent: "#f6c94a",
      warm: "#c21f31",
      glow: "rgba(246, 201, 74, 0.34)",
      neon: "#8f1224",
    },
    hero: {
      id: "hero",
      src: `${ICARDI}/hero.jpg`,
      alt: "Mauro Icardi, Galatasaray forması",
      placeholder: true,
      hint: "Dikey kadraj · GS forması · yüz net · gol sevinci ya da stüdyo",
      width: 1200,
      height: 1600,
    },
    card: {
      id: "card",
      src: `${ICARDI}/kart.jpg`,
      alt: "Mauro Icardi",
      placeholder: true,
      hint: "Hub şeridindeki kart için · dikey · üst gövde",
      width: 900,
      height: 1200,
    },
    badges: ["Forvet", "No. 9", "Galatasaray"],
    vitals: [
      { label: "Doğum tarihi", value: "19.02.1993" },
      { label: "Uyruk", value: "Arjantin" },
      { label: "Boy", value: "181 cm" },
      { label: "Kilo", value: "75 kg" },
    ],
    storyTitle: ["Rosario'dan", "İstanbul'a"],
    storyLede:
      "Arjantin'in Rosario kentinden Serie A'ya, Paris'ten İstanbul'a: bir forvetin kulüpten kulübe attığı imza — sadece skor değil, her formada bıraktığı iz.",
    story: [
      "Rosario'da doğdu, ama futbolu Kanarya Adaları'nda öğrendi. Ailesi İspanya'ya taşındığında çocuk yaşta Vecindario'nun altyapısındaydı; oradan Barcelona'nın La Masia'sına geçti. Dünyanın en çok pas veren okulunda, en az pas veren mevkiyi seçti.",
      "Barcelona'da kalmadı. İtalya'ya, Sampdoria'ya gitti ve Serie A'ya orada çıktı. Genç bir santrforun İtalya'ya gitmesi genelde bir gerileme sayılır; onun için bir uzmanlaşmaydı. İtalya, ceza sahası içinde durmayı öğreten ülkedir.",
      "2013'te Inter'e geçti ve iki kez Serie A'nın gol kralı oldu. Yirmi iki yaşında kaptanlık pazubendini taktı. Bir forvet için kaptanlık alışılmadıktır: takımın en bencil mevkisine takımın sorumluluğunu vermek demektir.",
      "Paris'te iki lig şampiyonluğu, sonra İstanbul. Galatasaray'a geldiğinde otuz yaşındaydı ve kariyerinin en yüksek gol ortalamasını burada tutturdu. Üst üste gelen şampiyonlukların ortasında, kulübün on numarası değil dokuz numarası oldu — ve bu şehirde dokuz numara olmak, on numara olmaktan zordur.",
    ],
    stats: {
      club: {
        key: "galatasaray",
        label: "Galatasaray",
        crest: {
          id: "crest-gs",
          src: "/uploads/1787248180873-8732a3cc81b69945.jpg",
          alt: "Galatasaray arması",
          width: 1200,
          height: 1492,
          credit: null,
        },
        entries: [
          { key: "matches", label: "Maç", value: "98" },
          { key: "goals", label: "Gol", value: "69" },
          { key: "perMatch", label: "Maç başı gol", value: "0.70" },
          { key: "titles", label: "Şampiyonluk", value: "3" },
        ],
        note: "Kariyerinin en yüksek gol ortalaması bu formada tutuldu.",
      },
      all: {
        label: "Tüm zamanlar",
        entries: [
          { key: "matches", label: "Maç", value: "297" },
          { key: "goals", label: "Gol", value: "231" },
          { key: "assists", label: "Asist", value: "48" },
          { key: "trophies", label: "Kupa", value: "10" },
        ],
        note: "Sampdoria, Inter, Paris Saint-Germain ve Galatasaray toplamı.",
      },
    },
    career: [
      {
        id: "sampdoria",
        years: "2011 — 2013",
        club: "Sampdoria",
        country: "İtalya",
        note: "Serie A'ya çıkış. Ceza sahasında durmayı burada öğrendi.",
        tone: "#2f6fbf",
        matches: 41,
        goals: 11,
        image: {
          id: "career-sampdoria",
          src: "/uploads/1787246970694-a58420ddaf7fb628.jpg",
          alt: "Icardi, Sampdoria formasıyla",
          hint: "Sampdoria forması · aksiyon ya da portre",
          width: 672,
          height: 351,
        },
      },
      {
        id: "inter",
        years: "2013 — 2019",
        club: "Inter",
        country: "İtalya",
        note: "İki kez gol kralı, yirmi iki yaşında kaptan.",
        tone: "#1b3a8f",
        matches: 188,
        goals: 124,
        image: {
          id: "career-inter",
          src: "/uploads/1787246934666-7defb2ff442dc6a7.jpg",
          alt: "Icardi, Inter formasıyla",
          hint: "Inter forması · kaptanlık pazubendi görünürse ideal",
          width: 800,
          height: 450,
        },
      },
      {
        id: "psg",
        years: "2019 — 2022",
        club: "Paris Saint-Germain",
        country: "Fransa",
        note: "Yıldızlarla dolu bir hücumda dokuz numaranın işini yaptı.",
        tone: "#8e2740",
        matches: 92,
        goals: 38,
        image: {
          id: "career-psg",
          src: "/uploads/1787246880850-ed40bfe723e6d895.jpg",
          alt: "Icardi, Paris Saint-Germain formasıyla",
          hint: "PSG forması · yüksek çözünürlük (mevcut kare bulanık)",
          width: 1002,
          height: 560,
        },
      },
      {
        id: "galatasaray",
        years: "2022 —",
        club: "Galatasaray",
        country: "Türkiye",
        note: "Kariyerinin en yüksek gol ortalaması. Ve bir tribün.",
        tone: "#f6c94a",
        matches: 98,
        goals: 69,
        current: true,
        image: {
          id: "career-galatasaray",
          src: "/uploads/1787246835628-d83451adacff5faf.jpg",
          alt: "Icardi, Galatasaray formasıyla",
          hint: "GS forması · gol sevinci — şeridin en güçlü karesi burası",
          width: 1052,
          height: 661,
        },
      },
    ],
    nights: [
      {
        year: 2017,
        title: "Milano derbisi",
        meta: "San Siro · Inter — Milan",
        line: "Derbide hat-trick. Sonuncusu doksanı geçtikten sonra geldi ve stadyumun sesi bir anda tek bir sese düştü.",
        image: {
          id: "night-derbi",
          src: "/uploads/1787247041965-a46c3674199ee13c.jpg",
          alt: "",
          hint: "San Siro · Inter forması · gol sevinci",
          width: 615,
          height: 410,
        },
      },
      {
        year: 2018,
        title: "İkinci gol kralı",
        meta: "Serie A · 2017-18",
        line: "Bir sezonda ikinci kez ligin en golcüsü. İtalya'da bunu yapan yabancı sayısı azdır; iki kez yapan daha da az.",
        image: {
          id: "night-capocannoniere",
          src: "/uploads/1787247279133-983e5fe9c0423ff0.jpg",
          alt: "",
          hint: "Ödül ya da sezon kutlaması karesi",
          width: 640,
          height: 480,
        },
      },
      {
        year: 2023,
        title: "Old Trafford",
        meta: "Şampiyonlar Ligi · Manchester United — Galatasaray",
        line: "Avrupa'nın en tanıdık stadyumunda, seksen birinci dakikada. Sarı-kırmızı bir deplasman tribünü ve bir gol.",
        image: {
          id: "night-oldtrafford",
          src: "/uploads/1787247358737-fa0f031b35f12363.webp",
          alt: "",
          hint: "Old Trafford · GS deplasman forması",
          width: 650,
          height: 344,
        },
      },
      {
        year: 2024,
        title: "Gol kralı, üçüncü ülke",
        meta: "Süper Lig · 2023-24",
        line: "İtalya'dan sonra Türkiye. Aynı işi üç farklı ligde yapan bir forvetin listesi kısadır.",
        image: {
          id: "night-superlig",
          src: "/uploads/1787247400891-403744344002304c.jpg",
          alt: "",
          hint: "Süper Lig · GS forması · gol sevinci",
          width: 1200,
          height: 670,
        },
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
      {
        id: "gallery-1",
        src: "/uploads/1787247556483-9b79c4bebbc4445e.webp",
        alt: "Mauro Icardi",
        hint: "Ana galeri karesi · geniş · en yüksek çözünürlük",
        width: 1280,
        height: 720,
        caption: "Ana kare",
      },
      {
        id: "gallery-2",
        src: "/uploads/1787247806285-3b46650a7a53c762.jpg",
        alt: "Maç anı",
        hint: "Maç anı · yatay",
        width: 1200,
        height: 838,
        caption: "Maç anı",
      },
      {
        id: "gallery-3",
        src: "/uploads/1787247663523-3f8ddb4be2606d47.jpg",
        alt: "Portre",
        hint: "Portre · dikey",
        width: 716,
        height: 716,
        caption: "Portre",
      },
      {
        id: "gallery-4",
        src: `${ICARDI}/galeri-04.jpg`,
        alt: "Kutlama",
        placeholder: true,
        hint: "Gol sevinci · dikey",
        width: 800,
        height: 1100,
        caption: "Kutlama",
      },
      {
        id: "gallery-5",
        src: "/uploads/1787247957295-d707b1198186e23c.jpg",
        alt: "Taraftarla an",
        hint: "Tribün / taraftar · yatay",
        width: 736,
        height: 1308,
        caption: "Tribün",
      },
      {
        id: "gallery-6",
        src: "/uploads/1787247863488-ba856ed752457733.jpg",
        alt: "Antrenman",
        hint: "Antrenman · yatay ya da kare",
        width: 966,
        height: 644,
        caption: "Antrenman",
      },
      {
        id: "gallery-7",
        src: `${ICARDI}/galeri-07.jpg`,
        alt: "Kupa",
        placeholder: true,
        hint: "Kupa · şampiyonluk gecesi",
        width: 1000,
        height: 1000,
        caption: "Kupa",
      },
    ],
  },
];

export function findFavouritePlayer(slug: string): FavouritePlayer | undefined {
  return FAVOURITE_PLAYERS.find((player) => player.slug === slug);
}

/**
 * Sayfadaki BÜTÜN görsel yuvaları, tek düz liste.
 *
 * Küratör paneli ve künye toplayıcı bunu okuyor; yuva eklendiğinde iki yerde
 * birden güncellemek gerekmesin diye burada türetiliyor.
 */
export function allSlotsOf(player: FavouritePlayer): PlayerImageSlot[] {
  return [
    player.hero,
    player.card,
    player.stats.club.crest,
    ...player.career.map((stop) => stop.image),
    ...player.nights.map((night) => night.image),
    ...player.gallery,
  ];
}
