import type { FavouritePlayer } from "./types";

/** Kareler bu klasörde bekliyor; küratörün yüklediği dosyalar `/uploads/`de. */
const BASE = "/assets/players/sane";

/**
 * LEROY SANÉ — Alman kanat.
 *
 * ⚠️ SAYILAR DOĞRULANMADI — dış bir kaynakla karşılaştırılmadı.
 * Küratör düzeltmesi bu dosyada tek satır.
 *
 * ⚠️ Emin olunmayan maç/gol/asist değerleri BİLEREK YAZILMADI. Kariyer
 * duraklarının `matches` ve `goals` alanları `null`; kulüp istatistik kümesi
 * sayı yerine doğrulanabilir künye satırları taşıyor. Forma numarası da
 * doğrulanamadığı için `shirt` boş bırakıldı — uydurma bir rakam yerine
 * eksik bir satır tercih edildi.
 *
 * ⚠️ Palet: kemik + altın + kömür. Schalke ve Manchester City mavi taşıdığı
 * için nötr taş tonuyla temsil ediliyor (sözleşme §3).
 */
export const leroySane: FavouritePlayer = {
  slug: "sane",
  name: "Leroy Sané",
  firstName: "LEROY",
  lastName: "SANÉ",
  shirt: null,
  position: "Kanat",
  club: "Galatasaray",
  clubShort: "GS",
  country: "Almanya",
  countryCode: "DE",
  birthDate: "11 Ocak 1996",
  birthPlace: "Essen, Almanya",
  height: "183 cm",
  weight: "—",
  tagline: "Koşarken telaşlı görünmeyen tek adam; telaşlanan hep karşısındaki bek.",
  quote:
    "Hızı gösteriye çevirmez; ilk adımı atar, geri kalanı karşısındakinin sorunudur.",
  closingQuote:
    "Bir kanat oyuncusunun yaşı, ilk adımının hâlâ kaç kişiyi geride bıraktığıyla ölçülür.",
  palette: {
    ink: "#100f0c",
    accent: "#ece3d2",
    warm: "#c8a54a",
    glow: "rgba(236, 227, 210, 0.26)",
    neon: "#a8862f",
  },
  hero: {
    id: "hero",
    src: `${BASE}/hero.jpg`,
    alt: "Leroy Sané, Galatasaray forması",
    placeholder: true,
    hint: "Dikey kadraj · GS forması · sakin yüz · tercihen koşu anı, gövde dik",
    width: 1200,
    height: 1600,
  },
  card: {
    id: "card",
    src: `${BASE}/kart.jpg`,
    alt: "Leroy Sané",
    placeholder: true,
    hint: "Hub şeridindeki kart · dikey · üst gövde · temiz zemin, sade ışık",
    width: 900,
    height: 1200,
  },
  badges: ["Kanat", "Almanya", "Galatasaray"],
  vitals: [
    { label: "Doğum tarihi", value: "11.01.1996" },
    { label: "Uyruk", value: "Almanya" },
    { label: "Boy", value: "183 cm" },
    { label: "Ayak", value: "Sol" },
  ],
  storyTitle: ["Essen'den", "İstanbul'a"],
  storyLede:
    "Ruhr havzasında doğdu, Almanya'nın en gürültülü tribününde büyüdü, Manchester ve Münih'ten geçti. İstanbul'a geldiğinde ilk adımı hâlâ ilk günkü gibiydi.",
  story: [
    "Essen'de doğdu; Ruhr havzasında, futbolun madenci şehirlerinde. Babası Souleymane Sané Senegal millî takımında forvetti ve kariyerini Almanya'da geçirdi; annesi Regina Weber ritmik cimnastikte olimpiyat madalyası kazandı. İki ayrı disiplinden gelen bu miras onda güç ile denge olarak ayrı ayrı durmuyor — koşu biçiminin kendisi oluyor.",
    "Schalke'de büyüdü ve profesyonelliğe orada çıktı. Yirmi yaşında Bernabéu'da Real Madrid'e gol attı; Schalke o gece sahadan kazanarak ayrıldı ama tur Madrid'in oldu. O gol Avrupa'ya tek bir şey söyledi: bu çocuk büyük sahalarda küçülmüyor.",
    "Manchester City'de Guardiola'nın kanadı oldu. İngiltere'de bir sezonda yüz puan toplayan takımın içindeydi ve o sezonun genç oyuncu ödülünü aldı — aynı baharın sonunda Almanya'nın Dünya Kupası kadrosundan çıkarıldı. Bir ülkenin en iyi genci seçilip diğer ülkenin listesine alınmamak, bir futbolcunun kariyerinde nadir görülen bir cümledir. Ertesi sezonun daha ilk maçında dizinin bağı koptu ve bir yılını orada bıraktı.",
    "Bayern Münih'te beş yıl kaldı. Bundesliga bir kulübün alışkanlığıdır; o alışkanlığın içinde sağdan içeri kesip sol ayağıyla vurmayı sezon sezon tekrarladı. 2025 yazında sözleşmesi bitti ve bonservissiz kaldı. Otuzuna aylar kalmış, Avrupa'nın en büyük iki ligini de görmüş bir kanat oyuncusunun İstanbul'u seçmesi bir emeklilik değil; burada hâlâ koşulacak alan olduğunu bilmesi.",
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
        hint: "Kulüp arması · kare ya da dikey · temiz zemin · gölgesiz",
        width: 900,
        height: 900,
      },
      entries: [
        { key: "gelis", label: "Geliş", value: "2025" },
        { key: "bonservis", label: "Bonservis", value: "Serbest" },
        { key: "mevki", label: "Mevki", value: "Kanat" },
      ],
      note:
        "Maç ve gol dökümü doğrulanmadığı için buraya yazılmadı; küratör düzeltmesi bu satırda.",
    },
    all: {
      label: "Tüm zamanlar",
      entries: [
        { key: "premier", label: "Premier Lig", value: "2" },
        { key: "bundesliga", label: "Bundesliga", value: "4" },
        { key: "konfederasyon", label: "Konfederasyon Kupası", value: "2017" },
      ],
      note:
        "Schalke, Manchester City, Bayern Münih ve Galatasaray. Maç ve gol toplamları doğrulanmadığı için yazılmadı.",
    },
  },
  career: [
    {
      id: "schalke",
      years: "2014 — 2016",
      club: "Schalke 04",
      country: "Almanya",
      note: "Çıktığı yer. Bernabéu'daki gol bu formayla atıldı.",
      tone: "#6d6455",
      matches: null,
      goals: null,
      image: {
        id: "career-schalke",
        src: `${BASE}/kariyer-schalke.jpg`,
        alt: "Leroy Sané, Schalke 04 formasıyla",
        placeholder: true,
        hint: "Yatay · Schalke forması · genç yüz · aksiyon karesi tercih",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "manchester-city",
      years: "2016 — 2020",
      club: "Manchester City",
      country: "İngiltere",
      note: "Guardiola'nın kanadı; yüz puanlı sezonun içindeki hız.",
      tone: "#8d8778",
      matches: null,
      goals: null,
      image: {
        id: "career-manchester-city",
        src: `${BASE}/kariyer-city.jpg`,
        alt: "Leroy Sané, Manchester City formasıyla",
        placeholder: true,
        hint: "Yatay · City forması · kanattan içeri kesme anı · yüksek çözünürlük",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "bayern",
      years: "2020 — 2025",
      club: "Bayern Münih",
      /* Türkçeleşmiş ad: "Münih" Türkçe bir sözcük, İngilizce kuralla
         MÜNIH olurdu. Gerekçe `CareerStop.clubLang`. */
      clubLang: "tr",
      country: "Almanya",
      note: "Beş yıl, üst üste ligler ve sağdan içeri kesen aynı hareket.",
      tone: "#9b2430",
      matches: null,
      goals: null,
      image: {
        id: "career-bayern",
        src: `${BASE}/kariyer-bayern.jpg`,
        alt: "Leroy Sané, Bayern Münih formasıyla",
        placeholder: true,
        hint: "Yatay · Bayern forması · vuruş ya da gol sonrası · gece maçı ışığı",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "galatasaray",
      years: "2025 —",
      club: "Galatasaray",
      country: "Türkiye",
      note: "Serbest kaldığı yaz İstanbul'u seçti.",
      tone: "#c8a54a",
      matches: null,
      goals: null,
      current: true,
      image: {
        id: "career-galatasaray",
        src: `${BASE}/kariyer-galatasaray.jpg`,
        alt: "Leroy Sané, Galatasaray formasıyla",
        placeholder: true,
        hint: "Yatay · GS forması · şeridin en güçlü karesi burası · tribün arkada olsun",
        width: 1200,
        height: 800,
      },
    },
  ],
  nights: [
    {
      year: 2016,
      title: "Bernabéu",
      meta: "Şampiyonlar Ligi · Real Madrid — Schalke",
      line: "Yirmi yaşındaydı ve Avrupa'nın en ağır sahasında topu ceza sahasının dışında aldı. Schalke o gece sahadan kazanarak ayrıldı; tur yine de Madrid'in oldu.",
      image: {
        id: "night-bernabeu",
        src: `${BASE}/gece-bernabeu.jpg`,
        alt: "Sané, Bernabéu'da Schalke formasıyla",
        placeholder: true,
        hint: "Yatay · Bernabéu · Schalke deplasman forması · gol anı ya da hemen sonrası",
        width: 1200,
        height: 675,
      },
    },
    {
      year: 2017,
      title: "Konfederasyon Kupası",
      meta: "Rusya · Almanya millî takımı",
      line: "Almanya turnuvaya genç bir kadroyla gitti ve kupayı aldı. O kadronun kanadıydı; bir yıl sonra aynı ülkenin Dünya Kupası listesinde adı yoktu.",
      image: {
        id: "night-konfederasyon",
        src: `${BASE}/gece-konfederasyon.jpg`,
        alt: "Sané, Almanya millî takım formasıyla",
        placeholder: true,
        hint: "Yatay · beyaz Almanya forması · kupa ya da takım kutlaması",
        width: 1200,
        height: 675,
      },
    },
    {
      year: 2018,
      title: "Yüz puan",
      meta: "Premier Lig · 2017-18 · Manchester City",
      line: "İngiltere'de bir sezonda yüz puan toplayan takımın kanadıydı ve o sezonun genç oyuncu ödülü ona verildi. Aynı baharın sonunda Dünya Kupası kadrosundan çıkarıldı.",
      image: {
        id: "night-yuz-puan",
        src: `${BASE}/gece-yuz-puan.jpg`,
        alt: "Sané, Manchester City'de şampiyonluk kutlamasında",
        placeholder: true,
        hint: "Yatay · City forması · kupa ya da ödül karesi · kalabalık zemin",
        width: 1200,
        height: 675,
      },
    },
    {
      year: 2025,
      title: "İstanbul",
      meta: "Galatasaray · serbest transfer",
      line: "Bayern'le sözleşmesi bitti ve bonservissiz kaldı. Avrupa'nın büyük listelerinde adı dolaşırken İstanbul'u seçti.",
      image: {
        id: "night-istanbul",
        src: `${BASE}/gece-istanbul.jpg`,
        alt: "Sané, Galatasaray'a katıldığı gün",
        placeholder: true,
        hint: "Yatay · imza ya da forma giyme anı · sarı-kırmızı zemin",
        width: 1200,
        height: 675,
      },
    },
  ],
  personal: [
    {
      label: "Alışkanlık",
      title: "Sağdan içeri",
      body: "Sağ kanattan alır, içeri keser, sol ayağıyla vurur. Karşısındaki bek bunu maçtan önce biliyor, devre arasında hatırlatılıyor, yine de duramıyor. Çünkü kesme hareketinin kendisi değil, o hareketten önceki iki adımın sessizliği hızlı.",
    },
    {
      label: "Duruş",
      title: "Yüksek omuz",
      body: "Koşarken omuzları düşmüyor, gövdesi dik kalıyor. Bu yüzden en hızlı gittiği anda bile acele ediyormuş gibi görünmüyor. Yanındaki oyuncunun kollarını savurduğu karelerde onun elleri hâlâ aşağıda duruyor.",
    },
    {
      label: "Detay",
      title: "Kenar çizgisi",
      body: "Oyun diğer kanatta dönerken sahanın kendi tarafında, çizgiye yapışmış hâlde bekliyor. Topa yaklaşmıyor, topsuz alanı büyütüyor. Uzun aktarma geldiğinde önündeki boşluğu o bekleyiş açmış oluyor.",
    },
  ],
  gallery: [
    {
      id: "gallery-1",
      src: `${BASE}/galeri-1.jpg`,
      alt: "Leroy Sané, Galatasaray forması",
      placeholder: true,
      hint: "Ana galeri karesi · geniş yatay · en yüksek çözünürlük · GS forması",
      width: 1280,
      height: 720,
      caption: "Ana kare",
    },
    {
      id: "gallery-2",
      src: `${BASE}/galeri-2.jpg`,
      alt: "Maç anı",
      placeholder: true,
      hint: "Maç anı · yatay · topla birlikte, kanattan hücum",
      width: 1200,
      height: 800,
      caption: "Maç anı",
    },
    {
      id: "gallery-3",
      src: `${BASE}/galeri-3.jpg`,
      alt: "Portre",
      placeholder: true,
      hint: "Portre · dikey · yüz net · sade zemin, yumuşak ışık",
      width: 900,
      height: 1200,
      caption: "Portre",
    },
    {
      id: "gallery-4",
      src: `${BASE}/galeri-4.jpg`,
      alt: "Gol sevinci",
      placeholder: true,
      hint: "Gol sevinci · dikey · kollar aşağıda kaldığı bir kare tercih",
      width: 900,
      height: 1200,
      caption: "Sevinç",
    },
    {
      id: "gallery-5",
      src: `${BASE}/galeri-5.jpg`,
      alt: "Tribünle an",
      placeholder: true,
      hint: "Tribün / taraftar · yatay · sarı-kırmızı kalabalık arkada",
      width: 1200,
      height: 800,
      caption: "Tribün",
    },
    {
      id: "gallery-6",
      src: `${BASE}/galeri-6.jpg`,
      alt: "Antrenman",
      placeholder: true,
      hint: "Antrenman · yatay ya da kare · gündüz ışığı · topla temas",
      width: 1200,
      height: 900,
      caption: "Antrenman",
    },
    {
      id: "gallery-7",
      src: `${BASE}/galeri-7.jpg`,
      alt: "Millî formayla",
      placeholder: true,
      hint: "Almanya millî forması · dikey ya da kare · marş anı olabilir",
      width: 900,
      height: 1200,
      caption: "Millî forma",
    },
  ],

  /**
   * Sané'nin iskeleti FRAME: portre arşiv çerçevesinin içinde, etrafında künye
   * şeridi. Petrona'nın sakin arşiv serifi, teknik ızgara motifi, sinematik
   * nefes ve dokusuz zemin — Alman hassasiyetinin sayfadaki karşılığı.
   */
  design: {
    voice: "editorial",
    hero: "frame",
    signature: "grid",
    rhythm: "cinematic",
    texture: "clean",
  },
};
