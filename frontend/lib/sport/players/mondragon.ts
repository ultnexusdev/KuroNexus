import type { FavouritePlayer } from "./types";

/** Kareler bu klasörde bekliyor; küratörün yüklediği `/uploads/`de. */
const BASE = "/assets/players/mondragon";

/**
 * FARYD MONDRAGÓN — Kolombiyalı kaleci, Galatasaray'ın 2000'li yılları.
 *
 * ⚠️ SAYILAR DOĞRULANMADI — dış bir kaynakla karşılaştırılmadı.
 * Küratör düzeltmesi bu dosyada tek satır.
 *
 * Bu kayıtta bilerek YAZILMAYAN sayılar var: maç, kurtarış, kalesini gole
 * kapattığı maç, milli maç sayısı ve kulüp kırılımlarının hiçbiri yok. Uzun
 * ve çok ülkeli bir kariyerin toplamlarını hafızadan yazmak, uydurmakla aynı
 * şey olurdu; `matches` ve `goals` alanları bu yüzden `null` bırakıldı.
 * Boy değeri (190 cm) yaygın künyelerden alındı, doğrulanmadı.
 *
 * Zaragoza, Metz, Argentinos Juniors ve Philadelphia Union kariyer şeridinde
 * ayrı durak değil; şerit dört noktaya indirildi ve kalanlar durak notlarında
 * anıldı (sözleşme §2 · "4-5 durak").
 */
export const farydMondragon: FavouritePlayer = {
  slug: "mondragon",
  name: "Faryd Mondragón",
  firstName: "FARYD",
  lastName: "MONDRAGÓN",
  shirt: null,
  position: "Kaleci",
  club: "Galatasaray",
  clubShort: "GS",
  country: "Kolombiya",
  countryCode: "CO",
  birthDate: "21 Haziran 1971",
  birthPlace: "Cali, Kolombiya",
  height: "190 cm",
  weight: "—",
  tagline: "Kalede gürültü yapmadan yirmi beş yıl duran adam.",
  legendEpithet: "Sakin tecrübe",
  legendEra: "1990'lar — 2014",
  quote: "Kalede bağıran değil, bağırmayı gereksiz kılan adamdı.",
  closingQuote:
    "Kırk üç yaşında sahaya çıkabilmek, kırk üç yaşına kadar hazır kalmakla olur. Asıl iş orada, kimsenin bakmadığı yerdeydi.",
  palette: {
    ink: "#100c08",
    accent: "#e0a92e",
    warm: "#a34a26",
    glow: "rgba(224, 169, 46, 0.28)",
    neon: "#c8641f",
  },
  hero: {
    id: "hero",
    src: `${BASE}/hero.jpg`,
    alt: "Faryd Mondragón, Galatasaray kalesinde",
    placeholder: true,
    hint: "Dikey kadraj · GS kaleci forması · eldivenler görünsün · sakin bakış, kutlama değil",
    width: 1200,
    height: 1600,
  },
  card: {
    id: "card",
    src: `${BASE}/kart.jpg`,
    alt: "Faryd Mondragón",
    placeholder: true,
    hint: "Hub şeridindeki kart ve efsaneler salonundaki portre · dikey · üst gövde · yüz net",
    width: 900,
    height: 1200,
  },
  badges: ["Kaleci", "Kolombiya", "Galatasaray"],
  vitals: [
    { label: "Doğum tarihi", value: "21.06.1971" },
    { label: "Doğum yeri", value: "Cali" },
    { label: "Uyruk", value: "Kolombiya" },
    { label: "Mevki", value: "Kaleci" },
  ],
  storyTitle: ["Cali'den", "İstanbul'a"],
  storyLede:
    "Cali'de başlayan, üç kıtaya yayılan ve kırk üç yaşında bir Dünya Kupası sahasında kapanan kariyer. Ortasındaki altı yıl Galatasaray'ın kalesinde geçti.",
  story: [
    "Cali'de doğdu ve kaleyi orada seçti. Kolombiya futbolunun en gürültülü yıllarında büyüdü; sahada gürültünün tersini yapmayı öğrendi. Deportivo Cali'nin kalesinde geçen ilk yıllar ona tek bir şeyi öğretti: kaleci, on kişinin paniğini üstlenmeyen tek adamdır.",
    "Yirmili yaşlarında Arjantin'e gitti. Önce Argentinos Juniors, sonra Independiente — Güney Amerika'nın en sabırsız tribünlerinin önünde kale beklemek bir çıraklıktı. Oradan Avrupa'ya açıldı; İspanya ve Fransa üzerinden İstanbul'a geldi.",
    "2001'de Galatasaray'a imza attı ve altı yıl kaldı. Otuzuna yaklaşan bir kalecinin aynı kulüpte altı yıl kalması, o kulübün ona güvendiği anlamına gelir; kalecide güven formdan önce gelir. Bu altı yılın içinde iki Süper Lig şampiyonluğu var ve ikisinde de kaleyi bekleyen aynı adamdı.",
    "İstanbul'dan sonra Almanya, sonra Amerika, sonra başladığı yer. Kolombiya'ya, Deportivo Cali'ye döndü ve kariyerini oradan bir Dünya Kupası'na taşıdı. Rekorun kendisinden çok, o rekora giden çeyrek asırlık hazır bulunuşluk şaşırtıcı: bir kaleci yirmi beş yıl boyunca sıradaki maça hazır kalmayı sürdürmüş.",
  ],
  stats: {
    club: {
      key: "galatasaray",
      label: "Galatasaray",
      crest: {
        id: "crest-gs",
        src: `${BASE}/arma.jpg`,
        alt: "Galatasaray arması",
        placeholder: true,
        hint: "Galatasaray arması · kare ya da dikey · zemin sade, kenarlar temiz",
        width: 800,
        height: 800,
        credit: null,
      },
      entries: [
        { key: "years", label: "Yıllar", value: "2001 — 2007" },
        { key: "seasons", label: "Sezon", value: "6" },
        { key: "titles", label: "Süper Lig", value: "2" },
      ],
      note: "Maç ve kurtarış sayıları doğrulanmadığı için bu kümeye yazılmadı.",
    },
    all: {
      label: "Tüm zamanlar",
      entries: [
        { key: "worldcups", label: "Dünya Kupası kadrosu", value: "3" },
        { key: "oldest", label: "Dünya Kupası'nda en yaşlı", value: "43 yaş" },
        { key: "continents", label: "Kıta", value: "3" },
        { key: "career", label: "Kariyer", value: "1990'lar — 2014" },
      ],
      note: "Kolombiya, Arjantin, İspanya, Fransa, Türkiye, Almanya ve Amerika Birleşik Devletleri'nde kale bekledi.",
    },
  },
  career: [
    {
      id: "cali",
      years: "1990'ların başı",
      club: "Deportivo Cali",
      country: "Kolombiya",
      note: "Kaleyi seçtiği yer; ilk maçlar, ilk gürültü, ilk sessizlik.",
      tone: "#4a6b45",
      matches: null,
      goals: null,
      image: {
        id: "career-cali",
        src: `${BASE}/kariyer-cali.jpg`,
        alt: "Mondragón, Deportivo Cali kalesinde",
        placeholder: true,
        hint: "Deportivo Cali kaleci forması · genç yıllar · arşiv karesi, grenli olması sorun değil",
        width: 1000,
        height: 640,
      },
    },
    {
      id: "independiente",
      years: "1990'ların ortası",
      club: "Independiente",
      country: "Arjantin",
      note: "Arjantin çıraklığı: önce Argentinos Juniors, sonra Avellaneda.",
      tone: "#9b2b26",
      matches: null,
      goals: null,
      image: {
        id: "career-independiente",
        src: `${BASE}/kariyer-independiente.jpg`,
        alt: "Mondragón, Independiente kalesinde",
        placeholder: true,
        hint: "Independiente forması · aksiyon ya da portre · yatay",
        width: 1000,
        height: 640,
      },
    },
    {
      id: "galatasaray",
      years: "2001 — 2007",
      club: "Galatasaray",
      country: "Türkiye",
      note: "Zaragoza ve Metz'den sonra İstanbul: altı yıl, iki şampiyonluk.",
      tone: "#e0a92e",
      matches: null,
      goals: null,
      image: {
        id: "career-galatasaray",
        src: `${BASE}/kariyer-galatasaray.jpg`,
        alt: "Mondragón, Galatasaray kalesinde",
        placeholder: true,
        hint: "GS kaleci forması · kurtarış ya da ceza sahasını yönetirken · şeridin en güçlü karesi burası",
        width: 1200,
        height: 760,
      },
    },
    {
      id: "cali-donus",
      years: "2010'ların başı — 2014",
      club: "Deportivo Cali",
      country: "Kolombiya",
      note: "Köln ve Philadelphia'dan sonra başladığı kaleye döndü; Dünya Kupası'na oradan gitti.",
      tone: "#7d9a5a",
      matches: null,
      goals: null,
      current: true,
      image: {
        id: "career-cali-donus",
        src: `${BASE}/kariyer-cali-donus.jpg`,
        alt: "Mondragón, kariyerinin son yıllarında Deportivo Cali kalesinde",
        placeholder: true,
        hint: "Son yıllar · Deportivo Cali · yüzdeki yaş görünsün · yatay",
        width: 1200,
        height: 760,
      },
    },
  ],
  nights: [
    {
      year: 2002,
      title: "İlk sezon, ilk kupa",
      meta: "Süper Lig · 2001-02",
      line: "İstanbul'daki ilk yılının sonunda şampiyonluk geldi. Yeni gelen bir kalecinin ilk sezonunda kupa kaldırması, kaleye bir daha soru sorulmaması demektir.",
      image: {
        id: "night-sampiyonluk-2002",
        src: `${BASE}/gece-sampiyonluk-2002.jpg`,
        alt: "2002 şampiyonluk kutlaması",
        placeholder: true,
        hint: "2001-02 şampiyonluk kutlaması · kadro ya da Mondragón yakın plan · yatay",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2006,
      title: "Dört sezon sonra, yine",
      meta: "Süper Lig · 2005-06",
      line: "Aradan dört sezon geçti, kadro iki kez değişti, kale değişmedi. Bir kulübün aynı kaleciyle iki şampiyonluk yaşaması artık nadir olan şeydir.",
      image: {
        id: "night-sampiyonluk-2006",
        src: `${BASE}/gece-sampiyonluk-2006.jpg`,
        alt: "2006 şampiyonluk gecesi",
        placeholder: true,
        hint: "2005-06 şampiyonluk gecesi · kupa ya da tribün · yatay",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2011,
      title: "Kırkına birkaç ay",
      meta: "Bundesliga · 1. FC Köln",
      line: "Otuz altısında Almanya'ya gitti ve kırkına birkaç ay kalana kadar Bundesliga'da kale bekledi. Kaleci olmanın tek ayrıcalığı budur: zamanın hesabı burada başka tutulur.",
      image: {
        id: "night-koln",
        src: `${BASE}/gece-koln.jpg`,
        alt: "Mondragón, 1. FC Köln kalesinde",
        placeholder: true,
        hint: "Köln forması · maç anı · yatay",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2014,
      title: "Cuiabá",
      meta: "Dünya Kupası · Kolombiya — Japonya",
      line: "Doğum gününden üç gün sonra oyuna girdi ve Dünya Kupası tarihinin en yaşlı futbolcusu oldu. Rekoru kıran hamle bir kurtarış değil, sadece çizgiye yürümekti.",
      image: {
        id: "night-cuiaba",
        src: `${BASE}/gece-cuiaba.jpg`,
        alt: "Mondragón, 2014 Dünya Kupası'nda Kolombiya forması ile",
        placeholder: true,
        hint: "2014 Dünya Kupası · Kolombiya forması · oyuna girerken ya da sahada · yatay",
        width: 1200,
        height: 800,
      },
    },
  ],
  personal: [
    {
      label: "Alışkanlık",
      title: "Ceza sahasının önünde durmak",
      body: "Kaleciler çizgide durmayı sever; o, tehlikeyi kendi sahasının önünde karşılamayı seçerdi. Arkaya atılan topun düşeceği yeri, forvet koşmaya başlamadan hesaplamış olurdu. Bu cesaret değil aritmetikti, ve öğrenilmesi yıllar alır.",
    },
    {
      label: "Hareket",
      title: "Eller önce yukarı",
      body: "Köşe vuruşu gelmeden önce iki elini kaldırıp savunmayı iki adım geri iterdi. Kalabalık ceza sahasında kaleci sesini kullanmazsa kaybolur; o çoğu zaman elini konuşturuyordu. Kamera nadiren oraya bakar, sonuç hep oradan çıkar.",
    },
    {
      label: "Detay",
      title: "Yaşın görünmediği yer",
      body: "Kırkından sonra bile ısınmaya herkesten önce çıkıyordu. Bir kalecinin kariyerini uzatan şey refleks değil, o refleksi ayakta tutan disiplindir. Ondan geriye kalan asıl ders bu; kurtarışlar değil, yirmi beş yıl boyunca hazır kalmış olması.",
    },
  ],
  gallery: [
    {
      id: "gallery-1",
      src: `${BASE}/galeri-1.jpg`,
      alt: "Faryd Mondragón",
      placeholder: true,
      hint: "Ana galeri karesi · geniş · en yüksek çözünürlük · GS kaleci forması",
      width: 1280,
      height: 720,
      caption: "Ana kare",
    },
    {
      id: "gallery-2",
      src: `${BASE}/galeri-2.jpg`,
      alt: "Kurtarış anı",
      placeholder: true,
      hint: "Kurtarış · havada ya da yerde · yatay aksiyon karesi",
      width: 1200,
      height: 800,
      caption: "Kurtarış",
    },
    {
      id: "gallery-3",
      src: `${BASE}/galeri-3.jpg`,
      alt: "Portre",
      placeholder: true,
      hint: "Portre · dikey · yüz net · sakin ifade",
      width: 800,
      height: 1000,
      caption: "Portre",
    },
    {
      id: "gallery-4",
      src: `${BASE}/galeri-4.jpg`,
      alt: "Kolombiya milli forması",
      placeholder: true,
      hint: "Kolombiya milli forması · sarı belirgin · yatay ya da dikey",
      width: 900,
      height: 1200,
      caption: "Milli forma",
    },
    {
      id: "gallery-5",
      src: `${BASE}/galeri-5.jpg`,
      alt: "Kale arkası tribün",
      placeholder: true,
      hint: "Kale arkası tribün ile aynı karede · taraftarla an · yatay",
      width: 1200,
      height: 800,
      caption: "Kale arkası",
    },
    {
      id: "gallery-6",
      src: `${BASE}/galeri-6.jpg`,
      alt: "Şampiyonluk gecesi",
      placeholder: true,
      hint: "Kupa · şampiyonluk gecesi · kadro içinde olabilir",
      width: 1200,
      height: 800,
      caption: "Kupa",
    },
    {
      id: "gallery-7",
      src: `${BASE}/galeri-7.jpg`,
      alt: "Antrenman",
      placeholder: true,
      hint: "Antrenman · eldiven, top, ısınma · kare ya da yatay",
      width: 1000,
      height: 1000,
      caption: "Antrenman",
    },
  ],

  /**
   * Mondragón'un iskeleti EDITORIAL + SPLIT: Petrona'nın arşiv serifi ile
   * ikiye bölünmüş bir hero — solda künye, sağda portre. İmza motifi ARC,
   * çünkü bu kariyer bir yay: Cali'de açılıyor, Avrupa'nın tepesinden geçiyor,
   * yine Cali'de kapanıyor. Zemin ARCHIVE dokusunda; bu kayıt bir efsane
   * kaydı ve sepya lekesi onun dilidir.
   */
  design: {
    voice: "editorial",
    hero: "split",
    signature: "arc",
    rhythm: "open",
    texture: "archive",
  },
};
