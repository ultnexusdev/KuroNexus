import type { FavouritePlayer } from "./types";

/** Kareler bu klasörde bekliyor; küratörün yüklediği dosyalar `/uploads/`de. */
const BASE = "/assets/players/bardakci";

/**
 * ⚠️ SAYILAR DOĞRULANMADI — dış bir kaynakla karşılaştırılmadı.
 * Küratör düzeltmesi bu dosyada tek satır.
 *
 * Bu kayıtta bilerek EKSİK bırakılan yerler var:
 *  · Maç, gol ve asist sayıları elde yok; uydurmak yerine hiç yazılmadı.
 *    Kariyer duraklarının `matches`/`goals` alanları bu yüzden `null`.
 *  · Forma numarası doğrulanamadı, `shirt` alanı `null` bırakıldı; künye
 *    şeridi numara yerine mevki ve ayak bilgisini taşıyor.
 *  · Boy ve kilo doğrulanamadı, ikisi de "—".
 *  · Doğum günü dar değil geniş yazıldı (yalnızca yıl), doğum yeri ülke
 *    düzeyinde bırakıldı.
 *  · Süper Lig'e çıkmadan önceki kulüplerin adları doğrulanamadı. Alt lig
 *    yıllarının gerçek olduğu kesin, hangi künyelerle geçtiği değil; bu
 *    yüzden ilk iki kariyer durağı kulüp adı taşımıyor.
 *
 * Küratöre not: yukarıdaki maddelerin hepsi tek satırlık düzeltmeyle dolar.
 */
export const abdulkerimBardakci: FavouritePlayer = {
  slug: "bardakci",
  name: "Abdülkerim Bardakçı",
  firstName: "ABDÜLKERİM",
  lastName: "BARDAKÇI",
  shirt: null,
  position: "Stoper",
  club: "Galatasaray",
  clubShort: "GS",
  country: "Türkiye",
  countryCode: "TR",
  birthDate: "1994",
  birthPlace: "Türkiye",
  height: "—",
  weight: "—",
  tagline: "Alkışı en az alan yerde durur; maç biter, orada bir sorun çıkmamıştır.",
  quote:
    "Alt ligden gelen bir stoper, üst üste gelen şampiyonlukların ortasında hep aynı yerde duruyordu.",
  closingQuote:
    "Güvenilirlik bir yetenek sayılmaz; oysa on ay süren bir sezonda en zor tekrarlanan şey odur.",
  palette: {
    ink: "#0d100b",
    accent: "#d8d1b6",
    warm: "#7a9c5c",
    glow: "rgba(122, 156, 92, 0.30)",
    neon: "#3f5a2c",
  },
  hero: {
    id: "hero",
    src: `${BASE}/hero.jpg`,
    alt: "Abdülkerim Bardakçı, Galatasaray forması",
    placeholder: true,
    hint: "Dikey kadraj · GS forması · sakin duruş, sevinç değil · yüz net · omuzdan yukarı ışık",
    width: 1200,
    height: 1600,
  },
  card: {
    id: "card",
    src: `${BASE}/kart.jpg`,
    alt: "Abdülkerim Bardakçı",
    placeholder: true,
    hint: "Hub şeridindeki kart için · dikey · üst gövde · nötr ifade, gösterişsiz kare",
    width: 900,
    height: 1200,
  },
  badges: ["Stoper", "Sol ayak", "Galatasaray"],
  vitals: [
    { label: "Doğum yılı", value: "1994" },
    { label: "Uyruk", value: "Türkiye" },
    { label: "Mevki", value: "Stoper" },
    { label: "Ayak", value: "Sol" },
  ],
  storyTitle: ["Alt ligden", "Şampiyonluğa"],
  storyLede:
    "Büyük bir altyapının vitrininden gelmedi. Süper Lig'e aşağıdan yürüdü, Konya'da yerini aldı ve bir kış transferi olarak geldiği İstanbul'da savunmanın direği oldu.",
  story: [
    "Türk futbolunda bir stoperin adı genelde yirmi yaşında duyulur; onunki duyulmadı. Alt liglerde geçen sezonlar bir kariyerin başlangıcı değil, çoğu zaman sonudur — yukarı çıkan azdır. O çıktı ve çıkarken acele etmedi. Geç gelen oyuncuların ortak yanı şudur: sahaya çıktıklarında ne yapacaklarını çoktan bilirler.",
    "Konyaspor'da Süper Lig'e yerleşti. Sol ayaklı stoper bu ülkede az bulunur; bulunduğunda takımın sol tarafı bir tempo kazanır, çünkü top çıkarken fazladan bir dokunuş gerekmez. Konya'da bunun ne demek olduğu bir sezon boyunca görüldü ve kulüp Avrupa'ya gitti.",
    "2023 kışında Galatasaray'a geldi. Kış transferleri genelde bir eksiği kapatmak için alınır ve çoğu o eksiği kapatamadan sezonu bitirir. O, geldiği sezonun sonunda kupa kaldırdı. Altı ay önce başka bir şehirde başka bir formayla oynayan bir adam için bu kısa bir süredir.",
    "Sonrası tekrardır. Üst üste gelen şampiyonlukların ortasında savunmanın merkezinde aynı isim vardı ve o isim hiç bağırmadı. Bir stoperin en zor işi tek bir müdahaleyi doğru yapmak değil, aynı işi otuz dört hafta boyunca aynı seviyede yapmaktır. Bu defterdeki yeri tam olarak orası.",
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
        hint: "Arma · kare kadraj · zemin temiz, gölge yok",
        width: 800,
        height: 800,
      },
      entries: [
        { key: "arrival", label: "Geliş", value: "2023 kışı" },
        { key: "position", label: "Mevki", value: "Stoper" },
        { key: "foot", label: "Ayak", value: "Sol" },
        { key: "titles", label: "Süper Lig", value: "3" },
      ],
      note: "Şampiyonluklar 2023, 2024 ve 2025; maç ve gol sayıları doğrulanmadığı için bu kümede yok.",
    },
    all: {
      label: "Tüm zamanlar",
      entries: [
        { key: "country", label: "Ülke", value: "Türkiye" },
        { key: "clubs", label: "Süper Lig kulübü", value: "2" },
        { key: "route", label: "Çıkış", value: "Alt lig" },
      ],
      note: "Toplam maç ve gol sayısı doğrulanmadığı için yazılmadı — küratör dokunacak.",
    },
  },
  career: [
    {
      id: "altyapi",
      years: "2010'ların başı",
      club: "Altyapı yılları",
      country: "Türkiye",
      note: "Hiçbir büyük kulübün vitrinine girmedi; ilk yıllar sessiz geçti.",
      tone: "#5f584b",
      matches: null,
      goals: null,
      image: {
        id: "career-altyapi",
        src: `${BASE}/kariyer-altyapi.jpg`,
        alt: "Abdülkerim Bardakçı, ilk yıllarında",
        placeholder: true,
        hint: "Yatay · genç yaş karesi · takım fotoğrafı ya da antrenman · arşiv kalitesi kabul",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "alt-lig",
      years: "2010'ların ortası",
      club: "Alt lig yılları",
      country: "Türkiye",
      note: "Aşağıda bir stoperin hatası affedilmez, çünkü arkasını toparlayan kimse yoktur.",
      tone: "#6d6455",
      matches: null,
      goals: null,
      image: {
        id: "career-alt-lig",
        src: `${BASE}/kariyer-alt-lig.jpg`,
        alt: "Abdülkerim Bardakçı, alt lig yıllarında",
        placeholder: true,
        hint: "Yatay · alt lig sahası · tribün seyrek · kadraj dokulu, soğuk gün olsun",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "konyaspor",
      years: "2010'ların sonu — 2023 kışı",
      club: "Konyaspor",
      country: "Türkiye",
      note: "Süper Lig'deki yerini burada aldı; savunmanın merkezi bir sezon boyunca tartışılmadı.",
      tone: "#4e7b3f",
      matches: null,
      goals: null,
      image: {
        id: "career-konyaspor",
        src: `${BASE}/kariyer-konyaspor.jpg`,
        alt: "Abdülkerim Bardakçı, Konyaspor formasıyla",
        placeholder: true,
        hint: "Yatay · Konyaspor forması · ikili mücadele ya da hava topu · yeşil baskın kare",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "galatasaray",
      years: "2023 —",
      club: "Galatasaray",
      country: "Türkiye",
      note: "Kışın gelen bir transferin baharda kupa kaldırması nadirdir.",
      tone: "#d8d1b6",
      matches: null,
      goals: null,
      current: true,
      image: {
        id: "career-galatasaray",
        src: `${BASE}/kariyer-galatasaray.jpg`,
        alt: "Abdülkerim Bardakçı, Galatasaray formasıyla",
        placeholder: true,
        hint: "Yatay · GS forması · hattı yönetirken · şeridin en güçlü karesi burası",
        width: 1200,
        height: 800,
      },
    },
  ],
  nights: [
    {
      year: 2022,
      title: "Konya'nın Avrupa sezonu",
      meta: "Süper Lig · Konyaspor",
      line: "Bir Anadolu kulübünün Avrupa'ya gittiği sezon. O sezonun sebebi hücumda değil, gol yemeyen bir savunmanın ortasındaydı.",
      image: {
        id: "night-konya",
        src: `${BASE}/gece-konya.jpg`,
        alt: "Konyaspor sezon kutlaması",
        placeholder: true,
        hint: "Yatay · Konyaspor forması · saha içi kutlama ya da tribüne selam · yeşil ışık",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2023,
      title: "Kışın gelen kupa",
      meta: "Süper Lig · Galatasaray",
      line: "Ocak ayında imza attı, mayısta şampiyon oldu. Yarım sezonda bir savunmanın merkezine yerleşmek, alışmak için verilen süreden kısadır.",
      image: {
        id: "night-ilk-kupa",
        src: `${BASE}/gece-ilk-kupa.jpg`,
        alt: "Galatasaray şampiyonluk kutlaması",
        placeholder: true,
        hint: "Yatay · şampiyonluk gecesi · konfeti ve tribün · GS forması",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2023,
      title: "Old Trafford",
      meta: "Şampiyonlar Ligi · Manchester United — Galatasaray",
      line: "Galatasaray o gece Old Trafford'dan üç puanla döndü. Bir savunma için oradaki iş topu değil dakikayı korumaktı; son yirmi dakika bunu ölçtü.",
      image: {
        id: "night-old-trafford",
        src: `${BASE}/gece-old-trafford.jpg`,
        alt: "Old Trafford, Galatasaray deplasman gecesi",
        placeholder: true,
        hint: "Yatay · Old Trafford · GS deplasman forması · gece projektörü",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2025,
      title: "Üst üste üçüncü",
      meta: "Süper Lig · Galatasaray",
      line: "Üçüncü şampiyonluk. Bir kulüp arka arkaya kazanırken kadro değişir, teknik plan değişir; savunmanın ortasındaki isim değişmedi.",
      image: {
        id: "night-uclu",
        src: `${BASE}/gece-uclu.jpg`,
        alt: "Galatasaray şampiyonluk gecesi",
        placeholder: true,
        hint: "Yatay · kupa anı · takım halinde · Bardakçı kadrajın içinde olsun",
        width: 1200,
        height: 800,
      },
    },
  ],
  personal: [
    {
      label: "Ayak",
      title: "Sol ayağın kazandırdığı tempo",
      body: "Savunmanın solunda sol ayakla durunca top çıkarken vücudunu çevirmesi gerekmiyor; ilk dokunuş zaten pas oluyor. Bir maçta belki on kez tekrarlanan yarım saniye. Tribünden görünmez, ama oyunun hızını değiştiren şey tam olarak bu.",
    },
    {
      label: "Duran top",
      title: "Kalkar ve geri döner",
      body: "Köşe vuruşunda ceza sahasına çıkanlardan biri o; asıl dikkat çeken vuruştan sonrası. Top uzaklaşır uzaklaşmaz ileri koşuya kalkmıyor, dönüp hattın toparlanmasını bekliyor. Takımların en çok gol yediği an tam orasıdır ve o anı bilerek bekleyen çok az oyuncu var.",
    },
    {
      label: "Sessizlik",
      title: "Kolunu kaldırmıyor",
      body: "Ofsayt için el kaldırmaz, hakeme dönmez, faul sonrası tartışmaya girmez. Hattı sesle değil kendi adımıyla yönetiyor: bir adım öne çıkıyor, arkasındaki üç kişi de çıkıyor. Sessiz liderliğin sahadaki karşılığı bu — konuşma değil, zamanlama.",
    },
  ],
  gallery: [
    {
      id: "gallery-1",
      src: `${BASE}/galeri-1.jpg`,
      alt: "Abdülkerim Bardakçı, hava topu mücadelesi",
      placeholder: true,
      hint: "Ana galeri karesi · geniş · hava topu · en yüksek çözünürlük",
      width: 1280,
      height: 720,
      caption: "Ana kare",
    },
    {
      id: "gallery-2",
      src: `${BASE}/galeri-2.jpg`,
      alt: "Abdülkerim Bardakçı portresi",
      placeholder: true,
      hint: "Portre · dikey · yüz net · sakin ifade, gülümseme yok",
      width: 900,
      height: 1200,
      caption: "Portre",
    },
    {
      id: "gallery-3",
      src: `${BASE}/galeri-3.jpg`,
      alt: "Savunma hattını yönetirken",
      placeholder: true,
      hint: "Yatay · hattı işaret ederken · arkada üç savunmacı görünsün",
      width: 1200,
      height: 800,
      caption: "Hat",
    },
    {
      id: "gallery-4",
      src: `${BASE}/galeri-4.jpg`,
      alt: "Sol ayakla top çıkarırken",
      placeholder: true,
      hint: "Yatay · sol ayakla pas anı · ayak ve top aynı karede",
      width: 1200,
      height: 800,
      caption: "Sol ayak",
    },
    {
      id: "gallery-5",
      src: `${BASE}/galeri-5.jpg`,
      alt: "Ceza sahasında müdahale",
      placeholder: true,
      hint: "Yatay · müdahale ya da uzaklaştırma anı · gövde dili net",
      width: 1200,
      height: 800,
      caption: "Müdahale",
    },
    {
      id: "gallery-6",
      src: `${BASE}/galeri-6.jpg`,
      alt: "Antrenman",
      placeholder: true,
      hint: "Antrenman · yatay ya da kare · gündüz ışığı · gösterişsiz kare",
      width: 1000,
      height: 1000,
      caption: "Antrenman",
    },
    {
      id: "gallery-7",
      src: `${BASE}/galeri-7.jpg`,
      alt: "Şampiyonluk gecesi",
      placeholder: true,
      hint: "Kupa · şampiyonluk gecesi · dikey kadraj · kalabalığın içinde",
      width: 900,
      height: 1200,
      caption: "Kupa",
    },
  ],

  /**
   * İmza GRID + hero SPLIT: stoper mevkisi bir hat mevkisi — çizgi tutmak,
   * aralık ölçmek, kadrajı ikiye bölmek. Cinzel'in anıt sesi (`monument`)
   * gösterişi değil dayanıklılığı anlatıyor; açık ritim ve film graini
   * gürültüsüz bir sayfa bırakıyor.
   *
   * Renk yeşil-taş-kömür: Konya'nın yeşili, alt lig yıllarının taş tonu ve
   * üstünde kemik beyazı bir tipografi. Sarı-kırmızıya hiç girilmedi; bu
   * sayfanın karakteri gösteriş değil güven.
   */
  design: {
    voice: "monument",
    hero: "split",
    signature: "grid",
    rhythm: "open",
    texture: "grain",
  },
};
