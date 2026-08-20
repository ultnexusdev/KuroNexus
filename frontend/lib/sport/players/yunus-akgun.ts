import type { FavouritePlayer } from "./types";

/** Kareler bu klasörde beklenecek; hepsi şu an boş yuva. */
const BASE = "/assets/players/yunus-akgun";

/**
 * ⚠️ SAYILAR DOĞRULANMADI — dış bir kaynakla karşılaştırılmadı.
 * Küratör düzeltmesi bu dosyada tek satır.
 *
 * Bu kayıtta maç/gol/asist toplamı BİLEREK yazılmadı. Kariyer duraklarının
 * `matches` ve `goals` alanları `null`; istatistik kümeleri sayı yerine
 * yalnızca kesin olan şeyleri taşıyor (mevki, dönüş yılı, turnuva). Eksik bir
 * satır, uydurma bir sayıdan iyidir (sözleşme §5).
 *
 * ⚠️ Ayrıca yazılmayanlar: forma numarası (`shirt: null`), boy ve kilo
 * (`weight: "—"`), doğum günü/ayı ve doğum şehri. Bunların hiçbirinden emin
 * olunmadığı için hero künyesinde ölçü yerine doğum yılı duruyor. Kariyer
 * şeridindeki yıl aralıkları da yaklaşık — kiralık pencerelerinin tam ayı
 * doğrulanmadı.
 *
 * ⚠️ `theme` alanı YOK. Tema müziği yalnızca Icardi'ye özel.
 * ⚠️ `legendEpithet` YOK. Bu kayıt yalnızca favoriler şeridinde duruyor.
 */
export const yunusAkgun: FavouritePlayer = {
  slug: "yunus-akgun",
  name: "Yunus Akgün",
  firstName: "YUNUS",
  lastName: "AKGÜN",
  shirt: null,
  position: "Kanat",
  club: "Galatasaray",
  clubShort: "GS",
  country: "Türkiye",
  countryCode: "TR",
  birthDate: "2000",
  birthPlace: "Türkiye",
  height: "2000 doğumlu",
  weight: "—",
  tagline: "Kulübeden kalkıp maçın hızını değiştiren çocuk.",
  quote:
    "Bu formayı çocukken de giyiyordu; değişen tek şey, tribünün artık adını bilmesi.",
  closingQuote:
    "Bir kulüp kendi çocuğunu sahaya sürdüğünde tribünün sesi başka çıkar.",
  /**
   * Genç ve parlak: kehribar sarısı + kızıl. Icardi'nin ağır altını yerine
   * daha yüksek, daha elektrikli bir sarı; neon turuncu hareket çizgisi
   * hissini taşıyor. Zemin siyah değil, sıcak kömür. Mavi yok.
   */
  palette: {
    ink: "#120a08",
    accent: "#ffb01f",
    warm: "#e23f2a",
    glow: "rgba(255, 176, 31, 0.42)",
    neon: "#ff5f2e",
  },
  hero: {
    id: "hero",
    src: `${BASE}/hero.jpg`,
    alt: "Yunus Akgün, Galatasaray forması",
    placeholder: true,
    hint: "Dikey kadraj · GS forması · koşu ya da top sürerken · gövde hareket hâlinde, poz değil · yüz net",
    width: 1200,
    height: 1600,
  },
  card: {
    id: "card",
    src: `${BASE}/kart.jpg`,
    alt: "Yunus Akgün",
    placeholder: true,
    hint: "Hub şeridindeki kart · dikey · üst gövde · yüz net · nötr arka plan",
    width: 900,
    height: 1200,
  },
  badges: ["Kanat", "Altyapıdan", "Galatasaray"],
  vitals: [
    { label: "Doğum yılı", value: "2000" },
    { label: "Uyruk", value: "Türkiye" },
    { label: "Mevki", value: "Kanat" },
    { label: "Altyapı", value: "Galatasaray" },
  ],
  storyTitle: ["Florya'dan", "Rams Park'a"],
  storyLede:
    "Aynı kulüpte büyüyüp aynı kulüpte oynamak Türkiye'de nadirdir. Yunus bunu yaparken arada iki kiralık, bir deniz aşırı deneme ve çok sayıda kulübe akşamı biriktirdi.",
  story: [
    "Galatasaray'ın altyapısı bir kulüpten çok bir bekleme salonudur: her yıl onlarca çocuk girer, birkaçı kapının öbür tarafına geçer. Yunus, Florya'da geçen yılların sonunda geçenlerden biri oldu. İlk takımın soyunma odasına girdiğinde adını zaten biliyorlardı; asıl mesele orada kalmaktı.",
    "Kalmak için önce gitmesi gerekti. Adana'ya kiralandı ve hayatında ilk kez her hafta doksan dakika oynadı. Alt liglerde futbol kimseye nazik davranmaz; oradaki bir sezon bir kanat oyuncusuna topu ne zaman tutacağını, daha önemlisi ne zaman bırakacağını öğretir.",
    "Dönüşü kolay olmadı. Kadronun kenarında geçen sezonlar, arada İngiltere'de ısınmadan biten kısa bir kiralık. Bu tür yıllar bir futbolcuyu ya bitirir ya sabırlı yapar; onu ikincisi yaptı. Kulübede oturmayı öğrenmek de bir iştir ve kimse bunu antrenmanda çalıştırmaz.",
    "2023'ten sonra artık kimse ondan 'altyapıdan çıkan çocuk' diye söz etmiyor. Oyuna girdiğinde tempoyu yükselten, dar alanda topu kaybetmeyen, geri koşusunu ihmal etmeyen bir kanat oldu. Milli forma da bu dönemde geldi ve bir kasım gecesi Berlin'de adı Türkiye'nin çok dışına çıktı.",
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
        hint: "Arma · kare ya da dikey · temiz zemin · kenarları kesilmemiş",
        width: 800,
        height: 800,
      },
      entries: [
        { key: "altyapi", label: "Altyapı", value: "Florya" },
        { key: "mevki", label: "Mevki", value: "Kanat" },
        { key: "donus", label: "Dönüş", value: "2021" },
      ],
      note: "Maç, gol ve asist sayıları doğrulanana kadar yazılmadı; buraya yalnızca kesin olanlar kondu.",
    },
    all: {
      label: "Tüm zamanlar",
      entries: [
        { key: "kulup", label: "Kulüp", value: "4" },
        { key: "milli", label: "Milli forma", value: "A Milli" },
        { key: "turnuva", label: "Turnuva", value: "EURO 2024" },
      ],
      note: "Sayı yerine güzergâh: Florya, Adana, kısa bir İngiltere ve geri dönüş.",
    },
  },
  career: [
    {
      id: "galatasaray-ilk",
      years: "2018 — 2019",
      club: "Galatasaray",
      country: "Türkiye",
      note: "Altyapının kapısından ilk takımın soyunma odasına geçti.",
      tone: "#b0801e",
      matches: null,
      goals: null,
      image: {
        id: "career-galatasaray-ilk",
        src: `${BASE}/kariyer-galatasaray-ilk.jpg`,
        alt: "Yunus Akgün, ilk yıllarında Galatasaray formasıyla",
        placeholder: true,
        hint: "Yatay · genç yıllar · GS forması · arşiv karesi olabilir, düşük çözünürlük kabul",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "adanaspor",
      years: "2019 — 2020",
      club: "Adanaspor",
      country: "Türkiye",
      note: "İlk kez yedek değil: her hafta doksan dakika ve her hafta bir bek.",
      tone: "#d9761f",
      matches: null,
      goals: null,
      image: {
        id: "career-adanaspor",
        src: `${BASE}/kariyer-adanaspor.jpg`,
        alt: "Yunus Akgün, Adanaspor formasıyla",
        placeholder: true,
        hint: "Yatay · Adanaspor forması (turuncu-beyaz) · aksiyon karesi · alt lig statları, kalabalık az olabilir",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "adana-demirspor",
      years: "2020 — 2021",
      club: "Adana Demirspor",
      country: "Türkiye",
      note: "Aynı şehirde ikinci kiralık, daha yüksek tempolu bir takımın kanadında.",
      tone: "#6d6455",
      matches: null,
      goals: null,
      image: {
        id: "career-adana-demirspor",
        src: `${BASE}/kariyer-adana-demirspor.jpg`,
        alt: "Yunus Akgün, Adana Demirspor formasıyla",
        placeholder: true,
        hint: "Yatay · aksiyon · forma rengini kadrajın merkezine koyma, hareketi merkeze koy",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "galatasaray",
      years: "2021 —",
      club: "Galatasaray",
      country: "Türkiye",
      note: "Kiralıklardan döndü, arada İngiltere'de kısa bir mola verdi; asıl yerini dönüşten sonra buldu.",
      tone: "#ffb01f",
      matches: null,
      goals: null,
      current: true,
      image: {
        id: "career-galatasaray",
        src: `${BASE}/kariyer-galatasaray.jpg`,
        alt: "Yunus Akgün, Galatasaray formasıyla",
        placeholder: true,
        hint: "Yatay · GS forması · sevinç ya da hızlanma anı — şeridin en güçlü karesi burası",
        width: 1400,
        height: 900,
      },
    },
  ],
  nights: [
    {
      year: 2020,
      title: "Alt ligin ışıkları",
      meta: "TFF 1. Lig · Adanaspor",
      line: "Kiralık geçen o sezon hayatında ilk kez her hafta ilk on birdeydi. Küçük stat, dar saha, sert bek — ve kimsenin kimseyi kollamadığı doksan dakika.",
      image: {
        id: "night-alt-lig",
        src: `${BASE}/gece-alt-lig.jpg`,
        alt: "",
        placeholder: true,
        hint: "Yatay · alt lig gecesi · projektör sert, tribün seyrek · yalnız bir kanat oyuncusu kadrajda",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2023,
      title: "Berlin",
      meta: "Hazırlık maçı · Almanya — Türkiye",
      line: "Almanya'yı kendi evinde deviren gecede skoru iki kez o buldu. O geceye kadar adı ülkenin dışında pek geçmiyordu; ertesi sabah her yerde geçiyordu.",
      image: {
        id: "night-berlin",
        src: `${BASE}/gece-berlin.jpg`,
        alt: "",
        placeholder: true,
        hint: "Yatay · milli forma · deplasman gecesi · gol sevinci · arkada kalabalık tribün bulanık",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2024,
      title: "Şampiyonluk",
      meta: "Süper Lig · 2023-24",
      line: "Kupa töreninde altyapıdan çıkanların yüzü diğerlerinden farklı olur. O akşam sahada durup kendi çocukluğunun tribününe bakıyordu.",
      image: {
        id: "night-sampiyonluk",
        src: `${BASE}/gece-sampiyonluk.jpg`,
        alt: "",
        placeholder: true,
        hint: "Yatay · şampiyonluk gecesi · konfeti ya da kupa · yüzünde duygu olsun, poz değil",
        width: 1400,
        height: 900,
      },
    },
    {
      year: 2024,
      title: "Almanya'da yaz",
      meta: "EURO 2024 · A Milli Takım",
      line: "Büyük turnuvada milli forma. Florya'da top süren bir çocuğun aklından geçen en uzak yer muhtemelen tam olarak burasıydı.",
      image: {
        id: "night-euro",
        src: `${BASE}/gece-euro.jpg`,
        alt: "",
        placeholder: true,
        hint: "Yatay · milli takım · turnuva karesi · yaz ışığı · forma ve arma net görünsün",
        width: 1200,
        height: 800,
      },
    },
  ],
  personal: [
    {
      label: "Giriş",
      title: "İlk otuz saniye",
      body: "Oyuna girdiği ilk otuz saniyede mutlaka bir kez topa dokunuyor. Bunu ısınmak için değil, oyuna 'buradayım' demek için yapıyor gibi. Sahaya alışması gereken kişi o değil, karşısındaki bek.",
    },
    {
      label: "Alışkanlık",
      title: "Çizgiye değil içeri",
      body: "Kanatta topu aldığında ilk hareketi geri ya da dışarı değil, içeri. Çizgiye inip ortayı denemek daha güvenli olandır; o güvenli olanı ikinci sıraya koyuyor. Bu yüzden bazen topu kaybediyor, bazen maçı açıyor.",
    },
    {
      label: "Detay",
      title: "Kaybettikten sonraki üç saniye",
      body: "Topu kaptırdığı anda durup hakeme bakmıyor, ilk üç saniye içinde geri koşuyor. Kanat oyuncularında en az rastlanan alışkanlık bu. Defterde onun adının yanında en çok bu duruyor.",
    },
  ],
  gallery: [
    {
      id: "gallery-1",
      src: `${BASE}/galeri-1.jpg`,
      alt: "Yunus Akgün",
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
      hint: "Yatay · top ayağında, bek karşısında · hareket bulanıklığı hoş karşılanır",
      width: 1200,
      height: 800,
      caption: "İkili mücadele",
    },
    {
      id: "gallery-3",
      src: `${BASE}/galeri-3.jpg`,
      alt: "Portre",
      placeholder: true,
      hint: "Dikey · portre · yüz net · nötr ya da koyu arka plan",
      width: 900,
      height: 1200,
      caption: "Portre",
    },
    {
      id: "gallery-4",
      src: `${BASE}/galeri-4.jpg`,
      alt: "Gol sevinci",
      placeholder: true,
      hint: "Dikey · gol sevinci · koşarken · tribüne dönük",
      width: 900,
      height: 1200,
      caption: "Sevinç",
    },
    {
      id: "gallery-5",
      src: `${BASE}/galeri-5.jpg`,
      alt: "Milli forma",
      placeholder: true,
      hint: "Yatay · A Milli Takım forması · maç anı ya da marş sırası",
      width: 1200,
      height: 800,
      caption: "Milli forma",
    },
    {
      id: "gallery-6",
      src: `${BASE}/galeri-6.jpg`,
      alt: "Kulübe",
      placeholder: true,
      hint: "Yatay · kulübede beklerken ya da oyuna girmeye hazırlanırken · bu kayıt için en anlamlı kare",
      width: 1200,
      height: 800,
      caption: "Kulübe",
    },
    {
      id: "gallery-7",
      src: `${BASE}/galeri-7.jpg`,
      alt: "Kupa",
      placeholder: true,
      hint: "Dikey · şampiyonluk gecesi · kupa ya da madalya · konfeti",
      width: 900,
      height: 1200,
      caption: "Kupa",
    },
  ],

  /**
   * Poster sesi + üst üste binen katmanlar: ad portrenin üstüne geliyor,
   * arkada projektör huzmeleri, sıkışık dikey ritim ve yumuşak ışık halkaları.
   * Bölüm sırası merkezden geldi; istatistik erken, geceler sonra.
   */
  design: {
    voice: "poster",
    hero: "stack",
    signature: "rays",
    rhythm: "tight",
    texture: "halo",
    order: ["hikaye", "kariyer", "istatistik", "geceler", "anlar", "galeri"],
  },
};
