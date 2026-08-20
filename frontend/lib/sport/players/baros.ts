import type { FavouritePlayer } from "./types";

/** Kareler bu klasörde bekliyor; küratörün yüklediği dosyalar `/uploads/`de. */
const BASE = "/assets/players/baros";

/**
 * ⚠️ SAYILAR DOĞRULANMADI — dış bir kaynakla karşılaştırılmadı.
 * Küratör düzeltmesi bu dosyada tek satır.
 *
 * Bu kayıtta bilerek YAZILMAYAN sayılar var: hiçbir kulüpteki maç/gol/asist
 * toplamı, millî maç ve millî gol sayısı, forma numarası, boy ve kilo. Emin
 * olunmadığı için satır hiç konmadı; `career` duraklarının `matches`/`goals`
 * alanları `null` bırakıldı. Yazılan tek rakam kümesi doğrulanabilir olanlar:
 * Euro 2004'te attığı gol sayısı, kupa adetleri ve yıl aralıkları.
 *
 * Baník Ostrava'daki ilk dönemin başlangıç yılından emin olunmadığı için
 * durak "2001'e kadar" diye yazıldı — dar bir yıl uydurmak yerine geniş
 * ifade (sözleşme §5).
 */
export const milanBaros: FavouritePlayer = {
  slug: "baros",
  name: "Milan Baroš",
  firstName: "MILAN",
  lastName: "BAROŠ",
  shirt: null,
  position: "Forvet",
  club: "Galatasaray",
  clubShort: "GS",
  country: "Çekya",
  countryCode: "CZ",
  birthDate: "28 Ekim 1981",
  birthPlace: "Valašské Meziříčí, Çekoslovakya",
  height: "—",
  weight: "—",
  tagline: "Kaleyi gördüğü anda düşünmeyi bırakan forvet.",
  quote:
    "Sürat onda bir yetenek değil bir karardı: topu aldığı anda kaleye bakar, sonra kimseye sormazdı.",
  closingQuote:
    "İstanbul ona iki kez kupa verdi: birini başkasının formasıyla kaldırdı, ötekini bizimkiyle.",
  palette: {
    ink: "#0d0a09",
    accent: "#e8dcc6",
    warm: "#9c2437",
    glow: "rgba(232, 220, 198, 0.30)",
    neon: "#5e1522",
  },
  hero: {
    id: "hero",
    src: `${BASE}/hero.jpg`,
    alt: "Milan Baroš, Galatasaray forması",
    placeholder: true,
    hint: "Dikey kadraj · GS forması · sprint hâlinde ya da sakin portre · yüz net · soğuk gece ışığı",
    width: 1200,
    height: 1600,
  },
  card: {
    id: "card",
    src: `${BASE}/kart.jpg`,
    alt: "Milan Baroš",
    placeholder: true,
    hint: "Hub şeridindeki kart için · dikey · üst gövde · ifadesiz bakış tercih edilir",
    width: 900,
    height: 1200,
  },
  badges: ["Forvet", "Çekya", "Galatasaray"],
  vitals: [
    { label: "Doğum tarihi", value: "28.10.1981" },
    { label: "Uyruk", value: "Çekya" },
    { label: "Mevki", value: "Forvet" },
    { label: "Galatasaray", value: "2008 — 2013" },
  ],
  storyTitle: ["Ostrava'dan", "İstanbul'a"],
  storyLede:
    "Kuzey Moravya'nın kömür şehrinden çıktı, Avrupa'nın en büyük gecelerinden birini İstanbul'da yaşadı. Yıllar sonra aynı şehre bu kez kalmak için geldi.",
  story: [
    "Valašské Meziříčí'de doğdu, futbolu Ostrava'da öğrendi. Baník kömür işçilerinin kulübüdür; oradan çıkan bir forvetten zarafet değil, sahayı süratle kısaltması beklenir. Baroš tam olarak bunu yaptı ve yirmisinde bir kış ortasında Liverpool onu aldı.",
    "2004 yazında Portekiz'de oynanan Avrupa Şampiyonası onun turnuvası oldu. Beş gol attı, gol kralı olarak döndü; Çekya yarı finalde uzatmada bir kafa vuruşuyla elendi. O yaz kendi ülkesinde tanınan bir oyuncuyken, Avrupa'nın tamamının adını bildiği bir forvete dönüştü.",
    "Bir yıl sonra İstanbul'a geldi. Atatürk Olimpiyat Stadı'nda ilk yarısını üç gol geride kapatan takımın santrforuydu; o gece Liverpool kupayı penaltılarla aldı. Kariyerinin en büyük kupasını, sonradan yıllarca oynayacağı şehirde kazandı — bunu o gece kimse bilmiyordu.",
    "Aston Villa, kısa bir Lyon dönemi ve arada bir kiralık İngiltere durağı. 2008'de Galatasaray'a geldi ve beş yıl kaldı. Otuzuna yaklaşan bir forvetten süratini bırakıp alan bulmaya başlaması beklenir; o süratini bırakmadı. Türkiye'de üst üste iki şampiyonluk yaşadı ve İstanbul ona ikinci kez kupa verdi.",
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
        hint: "Galatasaray arması · kare ya da dikey · şeffaf zemin ideal",
        width: 800,
        height: 800,
      },
      entries: [
        { key: "years", label: "Yıl", value: "2008 — 2013" },
        { key: "titles", label: "Şampiyonluk", value: "2" },
        { key: "from", label: "Geldiği kulüp", value: "Lyon" },
        { key: "role", label: "Mevki", value: "Forvet" },
      ],
      note: "Maç ve gol sayıları burada boş: doğrulanmadan rakam yazılmadı.",
    },
    all: {
      label: "Tüm zamanlar",
      entries: [
        { key: "euro", label: "Euro 2004 · gol", value: "5" },
        { key: "goldenboot", label: "Gol krallığı", value: "Euro 2004" },
        { key: "ucl", label: "Şampiyonlar Ligi", value: "1" },
        { key: "countries", label: "Oynadığı ülke", value: "4" },
      ],
      note: "Çekya, İngiltere, Fransa ve Türkiye. Kariyer toplamları doğrulanmadı.",
    },
  },
  career: [
    {
      id: "banik",
      years: "2001'e kadar",
      club: "Baník Ostrava",
      country: "Çekya",
      note: "Kömür şehrinin kulübü; yola buradan çıktı, kariyerin sonunda da buraya döndü.",
      tone: "#7b7365",
      matches: null,
      goals: null,
      image: {
        id: "career-banik",
        src: `${BASE}/kariyer-banik.jpg`,
        alt: "Milan Baroš, Baník Ostrava formasıyla",
        placeholder: true,
        hint: "Baník forması · çok genç yüz · arşiv karesi olabilir · yatay",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "liverpool",
      years: "2001 — 2005",
      club: "Liverpool",
      country: "İngiltere",
      note: "Anfield yılları ve İstanbul'daki o final; Avrupa kupasını yirmi üçünde kaldırdı.",
      tone: "#a3202b",
      matches: null,
      goals: null,
      image: {
        id: "career-liverpool",
        src: `${BASE}/kariyer-liverpool.jpg`,
        alt: "Milan Baroš, Liverpool formasıyla",
        placeholder: true,
        hint: "Liverpool forması · kırmızı ağır bassın · koşu ya da gol sevinci · yatay",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "aston-villa",
      years: "2005 — 2007",
      club: "Aston Villa",
      country: "İngiltere",
      note: "İngiltere'deki ikinci ev; yol buradan Fransa'ya, oradan İstanbul'a çıktı.",
      tone: "#6f2032",
      matches: null,
      goals: null,
      image: {
        id: "career-aston-villa",
        src: `${BASE}/kariyer-aston-villa.jpg`,
        alt: "Milan Baroš, Aston Villa formasıyla",
        placeholder: true,
        hint: "Aston Villa forması · bordo görünsün · maç anı · yatay",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "galatasaray",
      years: "2008 — 2013",
      club: "Galatasaray",
      country: "Türkiye",
      note: "Beş yıl, iki şampiyonluk: İstanbul'un ona ikinci kez kupa verdiği dönem.",
      tone: "#d8a24a",
      matches: null,
      goals: null,
      current: true,
      image: {
        id: "career-galatasaray",
        src: `${BASE}/kariyer-galatasaray.jpg`,
        alt: "Milan Baroš, Galatasaray formasıyla",
        placeholder: true,
        hint: "GS forması · şeridin en güçlü karesi · gol sevinci ya da kupa · yatay",
        width: 1200,
        height: 800,
      },
    },
  ],
  nights: [
    {
      year: 2004,
      title: "Beş gol, bir yaz",
      meta: "Avrupa Şampiyonası · Portekiz",
      line: "Danimarka'yı eleyen çeyrek finalde aynı devrede iki gol attı ve turnuvanın gol kralı oldu. Çekya yarı finalde uzatmada elendi, ama Portekiz'den dönerken Avrupa'nın konuştuğu forvet oydu.",
      image: {
        id: "night-euro2004",
        src: `${BASE}/gece-euro2004.jpg`,
        alt: "",
        placeholder: true,
        hint: "Çekya millî forması · gol sevinci · 2004 turnuva atmosferi · yatay",
        width: 1200,
        height: 700,
      },
    },
    {
      year: 2005,
      title: "Atatürk Olimpiyat Stadı",
      meta: "Şampiyonlar Ligi finali · Liverpool — Milan",
      line: "Devre arasında skor üç sıfırdı ve maç bitmişti; ikinci yarıda bitmediği anlaşıldı. Kupa penaltılarla İstanbul'da kaldı ve o sahadaki santrfor oydu.",
      image: {
        id: "night-istanbul",
        src: `${BASE}/gece-istanbul.jpg`,
        alt: "",
        placeholder: true,
        hint: "2005 finali · Liverpool forması · stadyum ışığı arkada · yatay",
        width: 1200,
        height: 700,
      },
    },
    {
      year: 2012,
      title: "Yıllar sonra kupa",
      meta: "Süper Lig · 2011-12",
      line: "Fatih Terim'in kenarda olduğu sezonun sonunda Galatasaray yıllar sonra yeniden şampiyon oldu. Baroš o kadronun deneyimli forvetiydi; Avrupa kupası kaldırmış bir oyuncunun Türkiye'deki ilk şampiyonluğu.",
      image: {
        id: "night-sampiyonluk",
        src: `${BASE}/gece-sampiyonluk.jpg`,
        alt: "",
        placeholder: true,
        hint: "GS forması · şampiyonluk kutlaması · konfeti ya da kupa · yatay",
        width: 1200,
        height: 700,
      },
    },
    {
      year: 2013,
      title: "Üst üste",
      meta: "Süper Lig · 2012-13",
      line: "Aynı kupa arka arkaya ikinci kez. Kadro kış ortasında büyük isimlerle değişti; bu, Baroš'un İstanbul'daki son sezonuydu ve beş yılın sonunda iki kupayla ayrıldı.",
      image: {
        id: "night-veda",
        src: `${BASE}/gece-veda.jpg`,
        alt: "",
        placeholder: true,
        hint: "GS forması · maç sonu tribüne selam ya da kupa gecesi · yatay",
        width: 1200,
        height: 700,
      },
    },
  ],
  personal: [
    {
      label: "Koşu",
      title: "Düz hat",
      body: "Topu kaptığı anda kavis çizmez, kaleye doğru düz koşar. Bunu yapan forvet azdır, çünkü düz hat sahanın en kalabalık hattıdır; onda o hat sürat yüzünden kapanmıyordu. İzlerken hep aynı şeyi düşündüm: bu bir karar değil, bir refleks.",
    },
    {
      label: "Bitiriş",
      title: "Sert ve alçak",
      body: "Vuruşu üst köşeye değil kalecinin ayaklarının dibine giderdi. Tekrar izlendiğinde çirkin bir gol gibi durur, ama alçak ve sert giden top refleksle çıkarılamaz. Golün güzelliğini hiç umursamadı.",
    },
    {
      label: "Detay",
      title: "İlk dokunuş uzağa",
      body: "Topu ayağının dibinde tutmaz, bir metre öne iter ve peşinden gider. Hocaların çoğu buna kötü ilk dokunuş der; onda kasıtlıydı, çünkü stoperle arasındaki mesafeyi tek hamlede açıyordu. Kaybettiği toplar da hep aynı sebepten kayboldu — aynı hamlenin iki yüzü.",
    },
  ],
  gallery: [
    {
      id: "gallery-1",
      src: `${BASE}/galeri-1.jpg`,
      alt: "Milan Baroš",
      placeholder: true,
      hint: "Ana galeri karesi · geniş · en yüksek çözünürlük · GS forması",
      width: 1600,
      height: 900,
      caption: "Ana kare",
    },
    {
      id: "gallery-2",
      src: `${BASE}/galeri-2.jpg`,
      alt: "Maç anı",
      placeholder: true,
      hint: "Maç anı · topla kaleye giderken · yatay",
      width: 1200,
      height: 800,
      caption: "Maç anı",
    },
    {
      id: "gallery-3",
      src: `${BASE}/galeri-3.jpg`,
      alt: "Portre",
      placeholder: true,
      hint: "Portre · dikey · yüz net · sade koyu zemin",
      width: 900,
      height: 1200,
      caption: "Portre",
    },
    {
      id: "gallery-4",
      src: `${BASE}/galeri-4.jpg`,
      alt: "Gol sevinci",
      placeholder: true,
      hint: "Gol sevinci · dikey · kollar açık, koşu hâlinde",
      width: 900,
      height: 1200,
      caption: "Sevinç",
    },
    {
      id: "gallery-5",
      src: `${BASE}/galeri-5.jpg`,
      alt: "Millî forma",
      placeholder: true,
      hint: "Çekya millî forması · 2004 dönemi ideal · yatay",
      width: 1200,
      height: 800,
      caption: "Millî forma",
    },
    {
      id: "gallery-6",
      src: `${BASE}/galeri-6.jpg`,
      alt: "Kupa",
      placeholder: true,
      hint: "Kupa · şampiyonluk ya da Avrupa gecesi · yatay veya kare",
      width: 1200,
      height: 800,
      caption: "Kupa",
    },
    {
      id: "gallery-7",
      src: `${BASE}/galeri-7.jpg`,
      alt: "Tribün",
      placeholder: true,
      hint: "Taraftarla an · maç sonu tribüne selam · yatay",
      width: 1200,
      height: 800,
      caption: "Tribün",
    },
  ],

  /**
   * Baroš'un imzası TARAMA: hep aynı düz hattı tekrar eden bir forvet. Bebas'ın
   * skorboard kondansesi, kadrajı ortadan ikiye bölen split hero, arkada yatay
   * tarama çizgileri. Palet Çek mavi-beyazını değil kemik + bordo + kömürü
   * alıyor: soğuk değil, ay ışığı kadar yoğun ve sade.
   */
  design: {
    voice: "condensed",
    hero: "split",
    signature: "scan",
    rhythm: "open",
    texture: "clean",
  },
};
