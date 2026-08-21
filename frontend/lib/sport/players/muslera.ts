import type { FavouritePlayer } from "./types";

/** Kareler bu klasörde beklenecek; hepsi şu an boş yuva. */
const BASE = "/assets/players/muslera";

/**
 * ⚠️ SAYILAR DOĞRULANMADI — dış bir kaynakla karşılaştırılmadı.
 * Küratör düzeltmesi bu dosyada tek satır.
 *
 * Bu kayıtta maç/gol/kupa toplamı BİLEREK yazılmadı. Emin olunmayan hiçbir
 * rakam konmadı: kariyer duraklarının `matches` ve `goals` alanları `null`,
 * istatistik kümeleri yalnızca tarih ve forma numarası taşıyor. Eksik bir
 * satır, uydurma bir sayıdan iyidir (sözleşme §5).
 *
 * ⚠️ `theme` alanı YOK. Tema müziği yalnızca Icardi'ye özel.
 */
export const fernandoMuslera: FavouritePlayer = {
  slug: "muslera",
  name: "Fernando Muslera",
  firstName: "FERNANDO",
  lastName: "MUSLERA",
  shirt: 1,
  position: "Kaleci",
  club: "Galatasaray",
  clubShort: "GS",
  country: "Uruguay",
  countryCode: "UY",
  birthDate: "16 Haziran 1986",
  birthPlace: "Buenos Aires, Arjantin",
  height: "190 cm",
  weight: "—",
  tagline: "On dört yıl boyunca arkana bakmak zorunda kalmadığın adam.",
  legendEpithet: "Güvenin ta kendisi",
  legendEra: "2011 — 2025",
  quote:
    "Bir takımın arkasında duran adam, o takımın en sessiz kaptanıdır.",
  closingQuote:
    "Aynı kaleyi on dört yıl bekleyen bir adam, bir süre sonra kulübün hafızası olur.",
  palette: {
    ink: "#0f0e0b",
    accent: "#e6dcc4",
    warm: "#c69122",
    glow: "rgba(230, 220, 196, 0.26)",
    neon: "#7d6a44",
  },
  hero: {
    id: "hero",
    src: `${BASE}/hero.jpg`,
    alt: "Fernando Muslera, Galatasaray kalesinde",
    placeholder: true,
    hint: "Dikey kadraj · GS kaleci forması · eldivenler görünsün · sakin bakış, kutlama değil · kale çizgisi arkada",
    width: 1200,
    height: 1600,
  },
  card: {
    id: "card",
    src: `${BASE}/kart.jpg`,
    alt: "Fernando Muslera",
    placeholder: true,
    hint: "Hub şeridindeki kart ve efsaneler portresi · dikey · üst gövde · yüz net · nötr arka plan",
    width: 900,
    height: 1200,
  },
  badges: ["Kaleci", "No. 1", "Galatasaray"],
  vitals: [
    { label: "Doğum tarihi", value: "16.06.1986" },
    { label: "Uyruk", value: "Uruguay" },
    { label: "Boy", value: "190 cm" },
    { label: "Forma", value: "1" },
  ],
  storyTitle: ["On dört yıl", "aynı çizgide"],
  storyLede:
    "Montevideo'dan Roma'ya, oradan on dört yıllık bir kale çizgisine. Bir futbolcunun tek bir kulüpte bu kadar uzun kalması artık neredeyse imkânsız.",
  story: [
    "Buenos Aires'te doğdu ama Uruguaylı. Aile Montevideo'ya döndüğünde kaleye geçti ve Wanderers'ta ilk takıma çıktı. Uruguay küçük bir ülkedir; orada kaleci olmak, ülkenin bütün ağırlığını yedi metrelik bir çizginin arkasında taşımayı öğrenmek demektir.",
    "2007'de Lazio'ya gitti, Roma'da dört yıl kaldı ve kupayı orada kaldırdı. Adını asıl 2010 yazında duyurdu: Güney Afrika'da Uruguay'ın kalesindeydi ve takım kırk yıldır göremediği bir sıraya çıktı. Bir yıl sonra Copa América'yı kazandılar.",
    "2011 yazında İstanbul'a geldi. Yirmi beş yaşındaydı ve bir kulübün on dört yılını devraldığını bilmiyordu. Galatasaray o süre içinde teknik direktör değiştirdi, kaptan değiştirdi, stadının adı bile değişti; kalede aynı adam duruyordu.",
    "2019'da bacağı kırıldı ve sedyeyle çıkarılışını izleyen herkes aynı şeyi düşündü. Geri döndü. Vedasına kadar geçen yıllarda hatalar da yaptı — büyük hatalar, herkesin gördüğü hatalar — ama ertesi hafta yine oradaydı. Bir kalecinin efsane olması kurtarışlarıyla değil, hatasından sonra aynı çizgiye dönmesiyle ölçülür.",
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
        { key: "years", label: "Yıl", value: "14" },
        { key: "shirt", label: "Forma", value: "1" },
      ],
      note: "Maç ve kupa toplamları doğrulanana kadar yazılmadı; buraya yalnızca kesin olan iki şey kondu.",
    },
    all: {
      label: "Tüm zamanlar",
      entries: [
        { key: "coppa", label: "Coppa Italia", value: "2009" },
        { key: "worldcup", label: "Dünya Kupası", value: "2010 · 4." },
        { key: "copa", label: "Copa América", value: "2011" },
      ],
      note: "Sayı yerine tarih: Montevideo, Roma, İstanbul — ve arada Uruguay kalesi.",
    },
  },
  career: [
    {
      id: "wanderers",
      years: "2006 — 2007",
      club: "Montevideo Wanderers",
      country: "Uruguay",
      note: "İlk takım, ilk çizgi. Uruguay'da kaleci olmak burada öğrenilir.",
      tone: "#a89c84",
      matches: null,
      goals: null,
      image: {
        id: "career-wanderers",
        src: `${BASE}/kariyer-wanderers.jpg`,
        alt: "Muslera, Montevideo Wanderers formasıyla",
        placeholder: true,
        hint: "Yatay · Wanderers forması · genç yıllar · arşiv karesi olabilir, düşük çözünürlük kabul",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "lazio",
      years: "2007 — 2011",
      club: "Lazio",
      country: "İtalya",
      note: "Roma'da dört yıl ve bir kupa; Avrupa'yı burada tanıdı.",
      tone: "#8d8778",
      matches: null,
      goals: null,
      image: {
        id: "career-lazio",
        src: `${BASE}/kariyer-lazio.jpg`,
        alt: "Muslera, Lazio kalesinde",
        placeholder: true,
        hint: "Yatay · Lazio kaleci forması · aksiyon (çıkış ya da kurtarış) · forma rengini kadrajın merkezine koyma",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "galatasaray",
      years: "2011 — 2025",
      club: "Galatasaray",
      country: "Türkiye",
      note: "On dört yıl. Kulübün mobilyası değil, temeli oldu.",
      tone: "#c69122",
      matches: null,
      goals: null,
      current: true,
      image: {
        id: "career-galatasaray",
        src: `${BASE}/kariyer-galatasaray.jpg`,
        alt: "Muslera, Galatasaray kalesinde",
        placeholder: true,
        hint: "Yatay · GS kaleci forması · uçarak kurtarış ya da yumrukla çıkış — şeridin en güçlü karesi burası",
        width: 1400,
        height: 900,
      },
    },
  ],
  nights: [
    {
      year: 2010,
      title: "Penaltılar",
      meta: "Dünya Kupası çeyrek finali · Uruguay — Gana",
      line: "Uzatmanın son saniyesi geçtikten sonra maç penaltılara kaldı ve o kurtardı. Uruguay kırk yıl sonra yarı finaldeydi; o gece ülkede kimse uyumadı.",
      image: {
        id: "night-penaltilar",
        src: `${BASE}/gece-penaltilar.jpg`,
        alt: "Muslera, Dünya Kupası'nda Uruguay kalesinde",
        placeholder: true,
        hint: "Yatay · Uruguay kalecisi · penaltı kurtarışı ya da hemen sonrası · 2010 karesi",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2011,
      title: "Kupanın yazı",
      meta: "Copa América · Uruguay",
      line: "Çeyrek finalde ev sahibini penaltılarda elediler, turnuvayı kazandılar. Aynı yaz İstanbul'a geldi ve Türkiye bunu birkaç sezon sonra anladı.",
      image: {
        id: "night-copa",
        src: `${BASE}/gece-copa.jpg`,
        alt: "Muslera, Copa América kutlamasında",
        placeholder: true,
        hint: "Yatay · Uruguay millî takımı · kupa kutlaması · kalabalık kare olabilir, yüz seçilsin",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2013,
      title: "Avrupa'da bir bahar",
      meta: "Şampiyonlar Ligi · 2012-13",
      line: "Galatasaray son sekize çıktı ve kalede o vardı. Avrupa'nın büyük stadyumlarında sakin duran bir kaleci, bir kulübün kendine bakışını değiştirir.",
      image: {
        id: "night-avrupa",
        src: `${BASE}/gece-avrupa.jpg`,
        alt: "Muslera, Şampiyonlar Ligi gecesinde",
        placeholder: true,
        hint: "Yatay · Avrupa gecesi · projektör ışığı · GS kaleci forması · tribün arkada bulanık",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2025,
      title: "Veda",
      meta: "İstanbul · son perde",
      line: "On dört yıl sonra eldivenleri çıkardı ve stat ayağa kalktı. Bir yabancının bu kulüpte bu kadar uzun kalması bir daha kolay olmayacak.",
      image: {
        id: "night-veda",
        src: `${BASE}/gece-veda.jpg`,
        alt: "Muslera'nın veda gecesi",
        placeholder: true,
        hint: "Yatay · veda anı · alkışlayan tribün · yüzünde duygu olsun, poz değil",
        width: 1400,
        height: 900,
      },
    },
  ],
  personal: [
    {
      label: "Alışkanlık",
      title: "Geç yatan adam",
      body: "Penaltıda son ana kadar ayakta durur; vurucunun ayağına bakar, topa değil. Erken yatan kaleci golü kendi seçer, o seçtirmez. Bu yüzden penaltıda ona bakmak, topa bakmaktan daha bilgilendiricidir.",
    },
    {
      label: "Detay",
      title: "Ceza sahasının dışı",
      body: "Stoperlerin arkasındaki boşluğu kendi arazisi sayar. Arka boşluğa atılan topa kaleci gibi değil, son adam gibi çıkar — bazen kırk metre ileride, ayağıyla. Kalesinde durmayı seven bir kaleci değildi, sahayı büyütmeyi seven bir kaleciydi.",
    },
    {
      label: "Hafıza",
      title: "Kırıktan sonra",
      body: "2019'daki kırıktan sonra ilk maçında tereddüt aradım. Yoktu. Bacağını kıran bir kalecinin ilk çıkışta ayağını yere aynı sertlikte basması, o sezonun bende kalan tek görüntüsü.",
    },
  ],
  gallery: [
    {
      id: "gallery-1",
      src: `${BASE}/galeri-1.jpg`,
      alt: "Fernando Muslera",
      placeholder: true,
      hint: "Ana galeri karesi · geniş · en yüksek çözünürlük · GS kaleci forması",
      width: 1600,
      height: 900,
      caption: "Ana kare",
    },
    {
      id: "gallery-2",
      src: `${BASE}/galeri-2.jpg`,
      alt: "Kurtarış anı",
      placeholder: true,
      hint: "Yatay · uçarak kurtarış · top kadrajda görünsün",
      width: 1400,
      height: 933,
      caption: "Kurtarış",
    },
    {
      id: "gallery-3",
      src: `${BASE}/galeri-3.jpg`,
      alt: "Portre",
      placeholder: true,
      hint: "Dikey · yakın portre · yüz net · nötr zemin",
      width: 900,
      height: 1200,
      caption: "Portre",
    },
    {
      id: "gallery-4",
      src: `${BASE}/galeri-4.jpg`,
      alt: "Eldivenler",
      placeholder: true,
      hint: "Kare ya da dikey · eller ve eldivenler · detay kadrajı",
      width: 1000,
      height: 1000,
      caption: "Eldivenler",
    },
    {
      id: "gallery-5",
      src: `${BASE}/galeri-5.jpg`,
      alt: "Kale çizgisi",
      placeholder: true,
      hint: "Yatay · geniş plan · kaleci çizgide yalnız · boşluk bırakan kadraj",
      width: 1600,
      height: 900,
      caption: "Çizgi",
    },
    {
      id: "gallery-6",
      src: `${BASE}/galeri-6.jpg`,
      alt: "Uruguay forması",
      placeholder: true,
      hint: "Yatay ya da dikey · millî takım karesi · forma rengini kadrajın merkezine koyma",
      width: 1200,
      height: 800,
      caption: "Uruguay",
    },
    {
      id: "gallery-7",
      src: `${BASE}/galeri-7.jpg`,
      alt: "Kupa gecesi",
      placeholder: true,
      hint: "Dikey · şampiyonluk gecesi · kupa ve konfeti · gece ışığı",
      width: 900,
      height: 1350,
      caption: "Kupa",
    },
  ],

  /**
   * Muslera'nın imzası SÜTUN: anıtsal, simetrik, ortada duran tek figür —
   * kalecinin sahadaki duruşu zaten budur. Cinzel'in kitabe sesi, teknik
   * ızgara (kale ağı ve çizgiler), sinematik nefes ve yumuşak ışık halkaları.
   */
  design: {
    voice: "monument",
    hero: "column",
    signature: "grid",
    rhythm: "cinematic",
    texture: "halo",
  },
};
