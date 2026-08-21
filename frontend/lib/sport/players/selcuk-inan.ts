import type { FavouritePlayer } from "./types";

/** Kareler bu klasörde bekleniyor; hepsi şimdilik boş yuva. */
const BASE = "/assets/players/selcuk-inan";

/**
 * SELÇUK İNAN — orta saha, frikik.
 *
 * ⚠️ SAYILAR DOĞRULANMADI — dış bir kaynakla karşılaştırılmadı.
 * Küratör düzeltmesi bu dosyada tek satır.
 *
 * ⚠️ BİLEREK YAZILMAYANLAR. Emin olunmadığı için hiç konmadı:
 * forma numarası (`shirt: null`), boy/kilo, doğum günü ve ayı (yalnızca yıl
 * yazıldı), her kariyer durağının maç ve gol sayısı (`null`), kariyer toplamı
 * maç/gol/asist. Manisaspor'a giriş yılı da dar değil geniş yazıldı.
 * Uydurma bir sayı yerine boş satır tercih edildi.
 */
export const selcukInan: FavouritePlayer = {
  slug: "selcuk-inan",
  name: "Selçuk İnan",
  firstName: "SELÇUK",
  lastName: "İNAN",
  shirt: null,
  position: "Orta saha",
  club: "Galatasaray",
  clubShort: "GS",
  country: "Türkiye",
  countryCode: "TR",
  birthDate: "1985",
  birthPlace: "İskenderun, Hatay",
  height: "—",
  weight: "—",
  tagline: "Topu vurmadan önce duvarın nereye kayacağını bilen adam.",
  quote:
    "Frikik kullanacağı zaman stadyum susmazdı; sadece nefesini tutardı.",
  closingQuote:
    "Bir ülkeyi Avrupa'ya gönderen tek bir vuruştu; ve o vuruşu kimin atacağı sahada zaten belliydi.",
  palette: {
    ink: "#100c07",
    accent: "#dea63b",
    warm: "#a85a2b",
    glow: "rgba(222, 166, 59, 0.30)",
    neon: "#b8541f",
  },
  hero: {
    id: "hero",
    src: `${BASE}/hero.jpg`,
    alt: "Selçuk İnan, Galatasaray forması",
    placeholder: true,
    hint: "Dikey kadraj · GS forması · frikik öncesi topun başında ya da vuruş anı · yüz net",
    width: 1200,
    height: 1600,
  },
  card: {
    id: "card",
    src: `${BASE}/kart.jpg`,
    alt: "Selçuk İnan",
    placeholder: true,
    hint: "Hub şeridindeki kart için · dikey · üst gövde · sakin bakış, kutlama değil",
    width: 900,
    height: 1200,
  },
  badges: ["Orta saha", "Kaptan", "Galatasaray"],
  vitals: [
    { label: "Doğum yılı", value: "1985" },
    { label: "Doğum yeri", value: "İskenderun" },
    { label: "Uyruk", value: "Türkiye" },
    { label: "Ayak", value: "Sağ" },
  ],
  storyTitle: ["İskenderun'dan", "Konya'ya"],
  storyLede:
    "Hatay'dan çıkıp Manisa'da adını duyurdu, Trabzon'da metronom oldu, İstanbul'da sekiz yıl kaldı. Hepsini tek bir vuruş özetliyor.",
  story: [
    "İskenderun'da büyüdü, futbolu Anadolu'nun küçük sahalarında öğrendi. Manisaspor'da Süper Lig'e çıktı ve orada bir şey fark edildi: topu hızlı oynamıyordu, doğru oynuyordu. Henüz frikik kullanan çocuk değildi; frikiği bekleyen çocuktu.",
    "2007'de Trabzonspor'a gitti ve dört yıl kaldı. Orta sahanın metronomu oldu; tempoyu ayağıyla değil kafasıyla kuruyordu. 2010-11 sezonu o şehirde hâlâ konuşulur — puanlar eşitlendi, şampiyonluk averajla gitti. O sezon takımın en çok koşan adamı değildi, en çok bakan adamıydı.",
    "2011'de Galatasaray'a geçti ve bu transfer uzun süre affedilmedi. Trabzon'a her gidişinde ıslıklandı, hiçbirine cevap vermedi. İstanbul'da sekiz sezon kaldı, pazubendi taktı, kupaları üst üste kaldırdı. Bir orta sahanın kulübe verebileceği en pahalı şey süredir; o süreyi verdi.",
    "Millî formada asıl işi 2015 sonbaharında yaptı. Konya'da, İzlanda maçının son dakikasında topu duvarın üstünden aşırdı ve bir ülkeyi Avrupa Şampiyonası'na gönderdi. O geceden sonra Türkiye'de frikik kelimesi tek bir ismi çağırır oldu. Vuruşun kendisi bile sakindi: koşu kısa, gövde dik, ayak temiz.",
  ],
  stats: {
    club: {
      key: "galatasaray",
      label: "Galatasaray",
      crest: {
        id: "crest-gs",
        src: `${BASE}/arma.png`,
        alt: "Galatasaray arması",
        placeholder: true,
        hint: "Galatasaray arması · kare ya da dikey · zemin temiz, kenar boşluğu az",
        width: 800,
        height: 800,
      },
      entries: [
        { key: "years", label: "Yıl", value: "2011 — 2019" },
        { key: "titles", label: "Şampiyonluk", value: "5" },
        { key: "armband", label: "Pazubent", value: "Kaptan" },
      ],
      note: "Sekiz sezon aynı formada; orta sahanın sabit noktası.",
    },
    all: {
      label: "Tüm zamanlar",
      entries: [
        { key: "position", label: "Mevki", value: "Orta saha" },
        { key: "foot", label: "Ayak", value: "Sağ" },
        { key: "league", label: "Lig", value: "Süper Lig" },
        { key: "tournament", label: "Turnuva", value: "EURO 2016" },
      ],
      note: "Maç, gol ve asist toplamları doğrulanamadığı için bu kümeye hiç yazılmadı.",
    },
  },
  career: [
    {
      id: "manisaspor",
      years: "2000'lerin ortası — 2007",
      club: "Manisaspor",
      country: "Türkiye",
      note: "Süper Lig'e burada çıktı; oyunu kurma işini burada üstlendi.",
      tone: "#9a8452",
      matches: null,
      goals: null,
      image: {
        id: "career-manisaspor",
        src: `${BASE}/kariyer-manisaspor.jpg`,
        alt: "Selçuk İnan, Manisaspor formasıyla",
        placeholder: true,
        hint: "Manisaspor forması · genç yıllar · aksiyon ya da portre · eski arşiv karesi olabilir",
        width: 1000,
        height: 600,
      },
    },
    {
      id: "trabzonspor",
      years: "2007 — 2011",
      club: "Trabzonspor",
      country: "Türkiye",
      note: "Dört yıl, orta sahanın metronomu; averajla kaçan bir şampiyonluk.",
      tone: "#7b7365",
      matches: null,
      goals: null,
      image: {
        id: "career-trabzonspor",
        src: `${BASE}/kariyer-trabzonspor.jpg`,
        alt: "Selçuk İnan, Trabzonspor formasıyla",
        placeholder: true,
        hint: "Trabzonspor forması · top ayağında, oyunu kurarken · yatay",
        width: 1000,
        height: 600,
      },
    },
    {
      id: "galatasaray",
      years: "2011 — 2019",
      club: "Galatasaray",
      country: "Türkiye",
      note: "Sekiz sezon, pazubent ve üst üste kaldırılan kupalar.",
      tone: "#dea63b",
      matches: null,
      goals: null,
      current: true,
      image: {
        id: "career-galatasaray",
        src: `${BASE}/kariyer-galatasaray.jpg`,
        alt: "Selçuk İnan, Galatasaray formasıyla",
        placeholder: true,
        hint: "GS forması · frikik vuruşu ya da kupa · şeridin en güçlü karesi burası",
        width: 1000,
        height: 600,
      },
    },
  ],
  nights: [
    {
      year: 2012,
      title: "İlk sezon, ilk kupa",
      meta: "Süper Lig · 2011-12",
      line: "Geldiği sezon şampiyonluk geldi. Islıkların en yüksek olduğu yıldı; cevabı sahada verdi.",
      image: {
        id: "night-ilk-kupa",
        src: `${BASE}/gece-ilk-kupa.jpg`,
        alt: "",
        placeholder: true,
        hint: "2011-12 şampiyonluk kutlaması · GS forması · yatay · konfeti/kupa görünsün",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2013,
      title: "Türk Telekom Arena'da Real Madrid",
      meta: "Şampiyonlar Ligi · çeyrek final rövanşı",
      line: "Madrid'de farklı yenilmişlerdi, İstanbul'da o farkı geri almaya az kaldı. Orta saha o gece Avrupa'nın en pahalı hücumuyla göğüs göğüse durdu.",
      image: {
        id: "night-real-madrid",
        src: `${BASE}/gece-real-madrid.jpg`,
        alt: "",
        placeholder: true,
        hint: "Türk Telekom Arena · Şampiyonlar Ligi gecesi · projektör ışığı · yatay",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2015,
      title: "Konya'da bir frikik",
      meta: "EURO 2016 elemeleri · Türkiye — İzlanda",
      line: "Son dakikada, duvarın üstünden. Top ağlara girdiğinde bir ülkenin Avrupa bileti cebindeydi; stadyumun sesi o vuruştan sonra bir daha eski seviyesine inmedi.",
      image: {
        id: "night-izlanda",
        src: `${BASE}/gece-izlanda.jpg`,
        alt: "",
        placeholder: true,
        hint: "Konya · A Millî Takım forması · frikik anı ya da vuruştan sonraki koşu · defterin en önemli karesi",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2019,
      title: "Kaptanın son sezonu",
      meta: "Süper Lig ve Türkiye Kupası · 2018-19",
      line: "Ayrıldığı sezon iki kupa birden kaldırdı. Sekiz yılın sonunda pazubent hâlâ onun kolundaydı.",
      image: {
        id: "night-veda",
        src: `${BASE}/gece-veda.jpg`,
        alt: "",
        placeholder: true,
        hint: "2018-19 kupa gecesi · pazubent kolda · kupayla · yatay",
        width: 1200,
        height: 800,
      },
    },
  ],
  personal: [
    {
      label: "Alışkanlık",
      title: "Topu yerleştirmesi",
      body: "Frikik noktasında topu koyup çekilmez; iki adım geri gider, bir kez daha bakar. O ikinci bakış vuruşun kendisinden uzun sürer. Sonra koşusu kısadır — üç adım, en fazla dört.",
    },
    {
      label: "Hareket",
      title: "Omzunun üstünden bakış",
      body: "Top ona gelmeden önce iki kez omzunun üstünden bakar. Topu aldığında sahayı çoktan görmüştür, o yüzden ilk dokunuşu hep doğru tarafa gider. Orta sahanın en zor işi bu bakıştır ve kimse alkışlamaz.",
    },
    {
      label: "Detay",
      title: "Kornerin yörüngesi",
      body: "Kornerleri ilk direğe değil, kalecinin çıkamayacağı o dar banda bırakır. Top yükselmez, kavis çizer. Ceza sahasında kimin nereye koşacağını bilerek atılan bir toptur bu.",
    },
  ],
  gallery: [
    {
      id: "gallery-1",
      src: `${BASE}/galeri-1.jpg`,
      alt: "Selçuk İnan",
      placeholder: true,
      hint: "Ana galeri karesi · geniş · en yüksek çözünürlük · GS forması",
      width: 1600,
      height: 900,
      caption: "Ana kare",
    },
    {
      id: "gallery-2",
      src: `${BASE}/galeri-2.jpg`,
      alt: "Frikik vuruşu",
      placeholder: true,
      hint: "Frikik vuruş anı · yan profil · topun ayaktan ayrıldığı kare",
      width: 1400,
      height: 900,
      caption: "Frikik",
    },
    {
      id: "gallery-3",
      src: `${BASE}/galeri-3.jpg`,
      alt: "Portre",
      placeholder: true,
      hint: "Portre · dikey · sakin bakış · omuz üstü kadraj",
      width: 900,
      height: 1200,
      caption: "Portre",
    },
    {
      id: "gallery-4",
      src: `${BASE}/galeri-4.jpg`,
      alt: "Millî forma",
      placeholder: true,
      hint: "A Millî Takım forması · maç anı · yatay",
      width: 1200,
      height: 800,
      caption: "Millî forma",
    },
    {
      id: "gallery-5",
      src: `${BASE}/galeri-5.jpg`,
      alt: "Kaptanlık anı",
      placeholder: true,
      hint: "Pazubent kolda · takım arkadaşlarına işaret verirken · yatay",
      width: 1200,
      height: 800,
      caption: "Kaptan",
    },
    {
      id: "gallery-6",
      src: `${BASE}/galeri-6.jpg`,
      alt: "Trabzon yılları",
      placeholder: true,
      hint: "Trabzonspor forması · arşiv karesi · yatay",
      width: 1200,
      height: 800,
      caption: "Trabzon yılları",
    },
    {
      id: "gallery-7",
      src: `${BASE}/galeri-7.jpg`,
      alt: "Kupa",
      placeholder: true,
      hint: "Kupa gecesi · dikey ya da kare · kupa elde",
      width: 900,
      height: 1200,
      caption: "Kupa",
    },
  ],

  /**
   * İmza motifi ARC: frikiğin yörüngesi. Petrona'nın arşiv serifi (editorial),
   * ortalanmış anıtsal sütun ve sinematik nefes — sayfanın kendisi de aceleci
   * değil, tıpkı vuruş öncesi o ikinci bakış gibi.
   */
  design: {
    voice: "editorial",
    hero: "column",
    signature: "arc",
    rhythm: "cinematic",
    texture: "grain",
  },
};
