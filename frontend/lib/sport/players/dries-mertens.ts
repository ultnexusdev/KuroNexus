import type { FavouritePlayer } from "./types";

/** Küratör yükleyene kadar bütün kareler burada bekliyor. */
const BASE = "/assets/players/dries-mertens";

/**
 * DRIES MERTENS — "Ciro".
 *
 * ⚠️ SAYILAR DOĞRULANMADI — dış bir kaynakla karşılaştırılmadı.
 * Küratör düzeltmesi bu dosyada tek satır.
 *
 * Bu kayıtta maç / gol / asist toplamı BİLEREK yazılmadı. Napoli'nin tarihindeki
 * en golcü oyuncu olduğu ve Galatasaray'da üst üste şampiyonluklar aldığı
 * yazıldı; rakamların kendisi doğrulanmadığı için ne kariyer duraklarına
 * (`matches` / `goals` hepsi `null`) ne de istatistik kümesine kondu. Forma
 * numarasından da emin olunmadığı için `shirt` boş bırakıldı.
 *
 * On dokuz görsel yuvasının tamamı `placeholder`; hiçbir dosya yolu gerçek
 * değil, her biri küratöre "buraya şu kareyi koy" diyen bir adres.
 */
export const driesMertens: FavouritePlayer = {
  slug: "dries-mertens",
  name: "Dries Mertens",
  firstName: "DRIES",
  lastName: "MERTENS",
  shirt: null,
  position: "Kanat forveti",
  club: "Galatasaray",
  clubShort: "GS",
  country: "Belçika",
  countryCode: "BE",
  birthDate: "6 Mayıs 1987",
  birthPlace: "Leuven, Belçika",
  height: "169 cm",
  weight: "61 kg",
  tagline: "Sahadaki en küçük adam, kalenin uzak köşesini herkesten önce görür.",
  quote:
    "Boyu yüzünden geri çevrilen çocuk, iki ülkenin gol defterine adını yazdırdı.",
  closingQuote: "Napoli ona bir isim verdi; o, oğluna o ismi verdi.",

  /**
   * Belçika kırmızısı + amber + sıcak karanlık. Icardi'nin ağır sarı-kırmızısına
   * göre bir ton daha açık ve daha hızlı: Mertens'in oyunu ağırlık değil çeviklik.
   * Napoli mavisi burada YOK — kariyer şeridinde nötr taş tonuyla temsil ediliyor.
   */
  palette: {
    ink: "#100b09",
    accent: "#f0a832",
    warm: "#d1362f",
    glow: "rgba(240, 168, 50, 0.32)",
    neon: "#ff6a3d",
  },

  hero: {
    id: "hero",
    src: `${BASE}/hero.jpg`,
    alt: "Dries Mertens, Galatasaray forması",
    placeholder: true,
    hint: "Dikey kadraj · GS forması · yüz net · koşarken ya da vuruş anı · alt gövde boşluklu (ad üstüne binecek)",
    width: 1200,
    height: 1600,
  },
  card: {
    id: "card",
    src: `${BASE}/kart.jpg`,
    alt: "Dries Mertens",
    placeholder: true,
    hint: "Hub şeridindeki kart · dikey · üst gövde · sakin bakış, aksiyon değil",
    width: 900,
    height: 1200,
  },

  badges: ["Kanat forveti", "Belçika", "Galatasaray"],
  vitals: [
    { label: "Doğum tarihi", value: "06.05.1987" },
    { label: "Uyruk", value: "Belçika" },
    { label: "Boy", value: "169 cm" },
    { label: "Kilo", value: "61 kg" },
  ],

  storyTitle: ["Leuven'den", "İstanbul'a"],
  storyLede:
    "Belçika'da boyu yüzünden geri çevrildi, Hollanda'nın ikinci liginden başladı ve bir İtalyan şehrinin tarihindeki en golcü adam olarak çıktı.",
  story: [
    "Leuven'de doğdu ve futbolu Belçika'da öğrendi, ama altyapılar onu tuttukları listeye yazmadı. Gerekçe hep aynıydı: çok küçük. On dokuz yaşında Hollanda'nın ikinci liginde, Apeldoorn'da bir takım buldu — kimsenin bakmadığı bir sahada, kimsenin göremediği oyunu oynadı.",
    "Utrecht onu Eredivisie'ye çıkardı, PSV ise Hollanda'nın en çok konuşulan kanadı yaptı. Küçük olmanın bir dezavantaj değil bir tarif olduğunu orada gösterdi: dar alanda dönebiliyor, savunmanın göremediği yerde duruyordu. 2013'te Napoli kapıyı çaldı.",
    "Napoli'de dokuz yıl kaldı. Milik sakatlanınca kanattan santrfora çekildi ve kariyerinin ikinci yarısı o kararla başladı; bir orta saha boyundaki adam, ceza sahasının içine taşındı. Napoli'nin tarihindeki en golcü oyuncu olarak ayrıldı ve şehir ona kendi adını verdi: Ciro.",
    "2022 yazında otuz beş yaşında İstanbul'a geldi. Yaşının bir yavaşlama sayılacağı bir dönemde üst üste gelen şampiyonlukların içinde durdu — bu kez gol atan değil, çoğu zaman golü kuran adam olarak. Sahadaki en küçük oyuncunun oyunun en son karar veren adamı olması, bu şehirde alışılmış bir şey değil.",
  ],

  stats: {
    club: {
      key: "galatasaray",
      label: "Galatasaray",
      crest: {
        id: "crest-gs",
        src: `${BASE}/arma-gs.png`,
        alt: "Galatasaray arması",
        placeholder: true,
        hint: "Galatasaray arması · kare oturur · şeffaf zemin ideal · tek renk baskı olmasın",
        width: 800,
        height: 800,
      },
      entries: [
        { key: "arrival", label: "Geliş yılı", value: "2022" },
        { key: "arrivalAge", label: "Geliş yaşı", value: "35" },
        { key: "titles", label: "Şampiyonluk", value: "3" },
      ],
      note: "2022 yazında geldi; 2023, 2024 ve 2025 şampiyonluklarının kadrosunda. Maç ve gol sayıları doğrulanmadığı için bu kümeye yazılmadı.",
    },
    all: {
      label: "Tüm zamanlar",
      entries: [
        { key: "clubs", label: "Kulüp", value: "5" },
        { key: "countries", label: "Ülke", value: "3" },
        { key: "napoliSeasons", label: "Napoli'de sezon", value: "9" },
        { key: "worldcups", label: "Dünya Kupası", value: "3" },
      ],
      note: "AGOVV, Utrecht, PSV, Napoli ve Galatasaray. Napoli'nin tarihindeki en golcü oyuncu — sayı doğrulanmadığı için yazılmadı.",
    },
  },

  career: [
    {
      id: "agovv",
      years: "2006 — 2009",
      club: "AGOVV Apeldoorn",
      country: "Hollanda",
      note: "Kimsenin bakmadığı ikinci ligde, kimsenin göremediği oyunu oynadı.",
      tone: "#7b7365",
      matches: null,
      goals: null,
      image: {
        id: "career-agovv",
        src: `${BASE}/kariyer-agovv.jpg`,
        alt: "Dries Mertens, AGOVV Apeldoorn formasıyla",
        placeholder: true,
        hint: "AGOVV forması · yatay · genç Mertens · arşiv karesi olabilir, çözünürlük düşük olsa da olur",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "utrecht",
      years: "2009 — 2011",
      club: "Utrecht",
      country: "Hollanda",
      note: "Eredivisie'ye çıkışı; kanadın dar tarafında oynamayı burada bıraktı.",
      tone: "#8f3a2c",
      matches: null,
      goals: null,
      image: {
        id: "career-utrecht",
        src: `${BASE}/kariyer-utrecht.jpg`,
        alt: "Dries Mertens, Utrecht formasıyla",
        placeholder: true,
        hint: "Utrecht kırmızı-beyaz forması · yatay · topla aksiyon",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "psv",
      years: "2011 — 2013",
      club: "PSV Eindhoven",
      country: "Hollanda",
      note: "Hollanda'da adı büyüdü; İtalya kapıyı buradan çaldı.",
      tone: "#c0442c",
      matches: null,
      goals: null,
      image: {
        id: "career-psv",
        src: `${BASE}/kariyer-psv.jpg`,
        alt: "Dries Mertens, PSV formasıyla",
        placeholder: true,
        hint: "PSV kırmızı forması · yatay · kanatta koşu ya da gol sevinci",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "napoli",
      years: "2013 — 2022",
      club: "Napoli",
      country: "İtalya",
      note: "Dokuz yıl ve bir rekor: kulübün tarihindeki en golcü adam.",
      tone: "#6d6455",
      matches: null,
      goals: null,
      image: {
        id: "career-napoli",
        src: `${BASE}/kariyer-napoli.jpg`,
        alt: "Dries Mertens, Napoli formasıyla",
        placeholder: true,
        hint: "Napoli forması · yatay · şeridin en duygulu karesi burası, tercihen tribüne dönük bir an",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "galatasaray",
      years: "2022 —",
      club: "Galatasaray",
      country: "Türkiye",
      note: "Otuz beş yaşında yeni bir şehir ve üst üste gelen kupalar.",
      tone: "#f0a832",
      matches: null,
      goals: null,
      current: true,
      image: {
        id: "career-galatasaray",
        src: `${BASE}/kariyer-galatasaray.jpg`,
        alt: "Dries Mertens, Galatasaray formasıyla",
        placeholder: true,
        hint: "GS forması · yatay · şeridin zirvesi · kupa ya da gol sevinci, yüksek çözünürlük",
        width: 1200,
        height: 800,
      },
    },
  ],

  nights: [
    {
      year: 2016,
      title: "Torino'ya dört",
      meta: "Serie A · Napoli — Torino",
      line: "Milik sakatlanınca kanattan santrfora çekildi ve o akşam tek başına dört gol attı. Napoli'nin sonraki altı yılı, o zorunlu kararın içinden çıktı.",
      image: {
        id: "night-torino",
        src: `${BASE}/gece-torino.jpg`,
        alt: "",
        placeholder: true,
        hint: "Napoli forması · gol sevinci · yatay · kalabalık tribün arka planda",
        width: 1600,
        height: 900,
      },
    },
    {
      year: 2018,
      title: "Panama'ya vole",
      meta: "Dünya Kupası · Belçika — Panama",
      line: "Ceza sahasının dışında topu yere indirmeden vurdu ve top üst köşeye gitti. Belçika'nın o turnuvadaki en iyi jenerasyonu, açılışını bu vuruşla yaptı.",
      image: {
        id: "night-panama",
        src: `${BASE}/gece-panama.jpg`,
        alt: "",
        placeholder: true,
        hint: "Belçika milli forması · vuruş anı ya da hemen sonrası · yatay",
        width: 1600,
        height: 900,
      },
    },
    {
      year: 2020,
      title: "Napoli'nin rekoru",
      meta: "Coppa Italia yarı finali · Napoli — Inter",
      line: "O gece attığı golle kulübün tarihindeki en golcü adam oldu; Hamsik'in adı listenin ikinci sırasına indi. Boş tribünlerin önünde kırılan bir rekordu.",
      image: {
        id: "night-rekor",
        src: `${BASE}/gece-rekor.jpg`,
        alt: "",
        placeholder: true,
        hint: "Napoli forması · rekor gecesi · yatay · boş stadyum karesi ideal",
        width: 1600,
        height: 900,
      },
    },
    {
      year: 2025,
      title: "Üçüncüsü",
      meta: "Süper Lig · 2024-25",
      line: "Otuz sekiz yaşında üçüncü şampiyonluk. On dokuz yaşında Hollanda'nın ikinci ligine gitmek zorunda kalan bir çocuk için fazlasıyla iyi bir cevap.",
      image: {
        id: "night-sampiyonluk",
        src: `${BASE}/gece-sampiyonluk.jpg`,
        alt: "",
        placeholder: true,
        hint: "GS forması · kupa töreni · yatay · konfeti / sarı-kırmızı ışık",
        width: 1600,
        height: 900,
      },
    },
  ],

  personal: [
    {
      label: "Vuruş",
      title: "Fazladan dokunuş yok",
      body: "Topu ayağına yatırıp kendini hazırlamaz; geldiği gibi vurur. Bunun bedeli daha çok ıskadır, karşılığı ise kalecinin hiç beklemediği bir zamanlamadır. Attığı golleri seyrederken çoğunda kalecinin ağırlığı hâlâ yanlış ayağındadır.",
    },
    {
      label: "Konum",
      title: "Stoperin göremediği yer",
      body: "Boyu yüzünden havada hiç ısrar etmez, onun yerine stoperle beki ayıran boşluğa girer ve orada durur. Kendisinden yirmi santim uzun iki adamın arasında kaybolmayı bir eksiklik değil bir yöntem hâline getirmiş. Kimse onu göstermez, top gelir.",
    },
    {
      label: "İsim",
      title: "Ciro",
      body: "Napoli ona kendi sokak adını verdi: Ciro. Bir yabancının bir şehirden alabileceği en büyük şey bu; kupa değil, isim. Oğlunun adını da Ciro koyunca o isim artık şehrin değil ailenin oldu — arşivdeki en sevdiğim ayrıntı bu.",
    },
  ],

  gallery: [
    {
      id: "gallery-1",
      src: `${BASE}/galeri-1.jpg`,
      alt: "Dries Mertens",
      placeholder: true,
      hint: "Ana galeri karesi · geniş yatay · en yüksek çözünürlük · GS forması",
      width: 1600,
      height: 900,
      caption: "Ana kare",
    },
    {
      id: "gallery-2",
      src: `${BASE}/galeri-2.jpg`,
      alt: "Maç anı",
      placeholder: true,
      hint: "Maç anı · yatay · topla temas",
      width: 1200,
      height: 800,
      caption: "Maç anı",
    },
    {
      id: "gallery-3",
      src: `${BASE}/galeri-3.jpg`,
      alt: "Portre",
      placeholder: true,
      hint: "Portre · dikey · yakın kadraj · gülümseme serbest",
      width: 900,
      height: 1200,
      caption: "Portre",
    },
    {
      id: "gallery-4",
      src: `${BASE}/galeri-4.jpg`,
      alt: "Gol sevinci",
      placeholder: true,
      hint: "Gol sevinci · dikey · kollar açık, korner direğine koşu",
      width: 900,
      height: 1200,
      caption: "Sevinç",
    },
    {
      id: "gallery-5",
      src: `${BASE}/galeri-5.jpg`,
      alt: "Tribün",
      placeholder: true,
      hint: "Tribünle an · yatay · maç sonu selamı",
      width: 1400,
      height: 900,
      caption: "Tribün",
    },
    {
      id: "gallery-6",
      src: `${BASE}/galeri-6.jpg`,
      alt: "Antrenman",
      placeholder: true,
      hint: "Antrenman · yatay ya da kare · sabah ışığı",
      width: 1200,
      height: 900,
      caption: "Antrenman",
    },
    {
      id: "gallery-7",
      src: `${BASE}/galeri-7.jpg`,
      alt: "Kupa",
      placeholder: true,
      hint: "Kupa · şampiyonluk gecesi · dikey",
      width: 900,
      height: 1300,
      caption: "Kupa",
    },
  ],

  /**
   * Bebas'ın skorboard kondansesi + adın portrenin üstüne bindiği katmanlı
   * poster dizilimi. İmza motifi dalga: Mertens'in oyunu düz çizgi değil, dar
   * alanda kıvrılan bir hat. Ritim açık, zemin dokusuz — hız ve hafiflik.
   */
  design: {
    voice: "condensed",
    hero: "stack",
    signature: "wave",
    rhythm: "open",
    texture: "clean",
  },
};
