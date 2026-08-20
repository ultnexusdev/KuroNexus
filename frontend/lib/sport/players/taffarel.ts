import type { FavouritePlayer } from "./types";

/** Kareler bu klasörde beklenecek; hepsi şu an boş yuva. */
const BASE = "/assets/players/taffarel";

/**
 * ⚠️ SAYILAR DOĞRULANMADI — dış bir kaynakla karşılaştırılmadı.
 * Küratör düzeltmesi bu dosyada tek satır.
 *
 * Bu kayıtta maç/gol toplamı BİLEREK yazılmadı: kariyer duraklarının
 * `matches` ve `goals` alanları `null`, istatistik kümeleri sayı yerine
 * tarih taşıyor. Eksik bir satır, uydurma bir sayıdan iyidir (sözleşme §5).
 *
 * ⚠️ AÇIK İKİ NOKTA — küratör doldursun:
 *   1. `shirt` boş bırakıldı. Galatasaray'daki forma numarasından emin
 *      olunmadığı için sayı yazılmadı; `badges` numarasız kuruldu.
 *   2. İstanbul yıllarının bitişi "2001" olarak yazıldı. Bu tarihten sonra
 *      İtalya'ya kısa bir dönüş ve ardından yeniden İstanbul anlatılıyor;
 *      doğrulanamadığı için kayda geçirilmedi, dar tarih yerine emin
 *      olunan aralık bırakıldı.
 *
 * ⚠️ `theme` alanı YOK. Tema müziği yalnızca Icardi'ye özel.
 */
export const claudioTaffarel: FavouritePlayer = {
  slug: "taffarel",
  name: "Cláudio Taffarel",
  firstName: "CLÁUDIO",
  lastName: "TAFFAREL",
  shirt: null,
  position: "Kaleci",
  club: "Galatasaray",
  clubShort: "GS",
  country: "Brezilya",
  countryCode: "BR",
  birthDate: "8 Mayıs 1966",
  birthPlace: "Santa Rosa, Brezilya",
  height: "—",
  weight: "—",
  tagline: "İki kupa da penaltılarda geldi; ikisinde de kalede aynı adam vardı.",
  legendEpithet: "Kurtaran eller",
  quote:
    "On bir metre, bir kalecinin kaybedecek hiçbir şeyinin olmadığı tek mesafedir.",
  closingQuote:
    "Brezilya'nın dördüncü yıldızı da, Türkiye'nin ilk Avrupa kupası da aynı çizginin arkasında beklendi.",
  palette: {
    ink: "#0a0e0a",
    accent: "#d9b23c",
    warm: "#1d6b3c",
    glow: "rgba(217, 178, 60, 0.28)",
    neon: "#0e7d45",
  },
  hero: {
    id: "hero",
    src: `${BASE}/hero.jpg`,
    alt: "Cláudio Taffarel, Galatasaray kalesinde",
    placeholder: true,
    hint: "Dikey kadraj · GS kaleci forması · eldivenler görünsün · sakin bakış · arşiv karesi, düşük çözünürlük kabul",
    width: 1200,
    height: 1600,
  },
  card: {
    id: "card",
    src: `${BASE}/kart.jpg`,
    alt: "Cláudio Taffarel",
    placeholder: true,
    hint: "Hub şeridindeki kart ve efsaneler portresi · dikey · üst gövde · yüz net · nötr zemin · 90'lar karesi tercih",
    width: 900,
    height: 1200,
  },
  badges: ["Kaleci", "Galatasaray", "Brezilya"],
  vitals: [
    { label: "Doğum tarihi", value: "08.05.1966" },
    { label: "Uyruk", value: "Brezilya" },
    { label: "Mevki", value: "Kaleci" },
    { label: "İstanbul", value: "1998 — 2001" },
  ],
  storyTitle: ["Santa Rosa'dan", "Kopenhag'a"],
  storyLede:
    "Brezilya'nın güneyinden İtalya'ya, oradan İstanbul'a. Bir kalecinin kariyeri boyunca hep aynı yerde sınandığı hikâye: on bir metrede.",
  story: [
    "Rio Grande do Sul'un küçük bir kentinde, Santa Rosa'da doğdu. Kaleciliği Porto Alegre'de, Internacional'in altyapısında öğrendi. Brezilya kaleci yetiştirmekle değil, kaleciyi affetmemekle tanınan bir ülkedir; orada kalede büyümek, ilk günden itibaren suçlanmaya alışmak demektir.",
    "Yirmili yaşlarının başında milli takımın kalesine geçti ve kariyeri boyunca oradan inmedi. Avrupa'ya İtalya üzerinden açıldı: önce Parma, sonra Reggiana. Serie A o yıllarda dünyanın en zor ligiydi ve bir Brezilyalı kaleciden en çok istenen şey golü kurtarmak değil, sakin görünmekti.",
    "Kariyerinin ortası penaltılarla geçti. Önce Pasadena'da, ülkesinin yirmi dört yıllık beklemesini bitiren gecede; dört yıl sonra Marsilya'da, aynı turnuvanın yarı finalinde. İki seferinde de kalede o vardı ve iki seferinde de kimse ondan bir kurtarış beklemiyordu — beklenmeyen kurtarış, kalecinin tek gerçek sermayesidir.",
    "1998 yazında İstanbul'a geldi ve otuz iki yaşında bir kalecinin kariyerinin en görünür işini burada yaptı. Kulüp ard arda şampiyon oldu, ardından Kopenhag'da Türkiye'nin ilk Avrupa kupası geldi. Yıllar sonra aynı kulübe kaleci antrenörü olarak döndü; bu arşivde onun iki kaydı var, ikisi de aynı çizginin arkasında.",
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
        { key: "years", label: "Yıl", value: "1998 — 2001" },
        { key: "uefa", label: "UEFA Kupası", value: "2000" },
        { key: "supercup", label: "UEFA Süper Kupası", value: "2000" },
        { key: "league", label: "Süper Lig", value: "1999 · 2000" },
      ],
      note: "Maç toplamı doğrulanana kadar yazılmadı; buraya yalnızca kesin olan başlıklar kondu.",
    },
    all: {
      label: "Tüm zamanlar",
      entries: [
        { key: "worldcup", label: "Dünya Kupası", value: "1994" },
        { key: "final", label: "Dünya Kupası finali", value: "1994 · 1998" },
        { key: "copa", label: "Copa América", value: "1989 · 1997" },
        { key: "cwc", label: "Kupa Galipleri Kupası", value: "1993" },
      ],
      note: "Sayı yerine tarih: Porto Alegre, Parma, Belo Horizonte ve İstanbul.",
    },
  },
  career: [
    {
      id: "internacional",
      years: "1985 — 1990",
      club: "Internacional",
      country: "Brezilya",
      note: "Kalede büyüdüğü yer; milli takıma buradan çağrıldı.",
      tone: "#a5322a",
      matches: null,
      goals: null,
      image: {
        id: "career-internacional",
        src: `${BASE}/kariyer-internacional.jpg`,
        alt: "Taffarel, Internacional formasıyla",
        placeholder: true,
        hint: "Yatay · Internacional kaleci forması · 80'ler arşivi · düşük çözünürlük kabul, tarihi doğru olsun",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "parma",
      years: "1990 — 1993",
      club: "Parma",
      country: "İtalya",
      note: "Avrupa'yı burada tanıdı; Wembley'de bir kupa kaldırdı.",
      tone: "#8d8778",
      matches: null,
      goals: null,
      image: {
        id: "career-parma",
        src: `${BASE}/kariyer-parma.jpg`,
        alt: "Taffarel, Parma kalesinde",
        placeholder: true,
        hint: "Yatay · Parma kaleci forması · kurtarış ya da çıkış · forma rengini kadrajın merkezine koyma",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "reggiana",
      years: "1993 — 1995",
      club: "Reggiana",
      country: "İtalya",
      note: "Dünya kupasını kazanmış bir kalecinin küçük kulüpte geçen iki sezonu.",
      tone: "#6f3129",
      matches: null,
      goals: null,
      image: {
        id: "career-reggiana",
        src: `${BASE}/kariyer-reggiana.jpg`,
        alt: "Taffarel, Reggiana kalesinde",
        placeholder: true,
        hint: "Yatay · Reggiana forması · bulması zor olabilir · maç anı yoksa yedek kulübesi/ısınma karesi de olur",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "atletico-mineiro",
      years: "1995 — 1998",
      club: "Atlético Mineiro",
      country: "Brezilya",
      note: "Ülkesine dönüş; İstanbul'a buradan geldi.",
      tone: "#4b4740",
      matches: null,
      goals: null,
      image: {
        id: "career-atletico-mineiro",
        src: `${BASE}/kariyer-atletico-mineiro.jpg`,
        alt: "Taffarel, Atlético Mineiro kalesinde",
        placeholder: true,
        hint: "Yatay · Atlético Mineiro kaleci forması · Belo Horizonte · 90'ların ikinci yarısı",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "galatasaray",
      years: "1998 — 2001",
      club: "Galatasaray",
      country: "Türkiye",
      note: "Üç yıl, iki şampiyonluk ve bir kupanın penaltılarda kalındığı gece.",
      tone: "#d9b23c",
      matches: null,
      goals: null,
      current: true,
      image: {
        id: "career-galatasaray",
        src: `${BASE}/kariyer-galatasaray.jpg`,
        alt: "Taffarel, Galatasaray kalesinde",
        placeholder: true,
        hint: "Yatay · GS kaleci forması · kurtarış ya da kupa anı — şeridin en güçlü karesi burası",
        width: 1400,
        height: 900,
      },
    },
  ],
  nights: [
    {
      year: 1994,
      title: "Pasadena",
      meta: "Dünya Kupası finali · Brezilya — İtalya",
      line: "Doksan dakika ve uzatma golsüz bitti, kupa penaltılara kaldı. Bir vuruşu çıkardı, sonuncusu üstten auta gitti ve Brezilya yirmi dört yıl sonra kupayı aldı.",
      image: {
        id: "night-pasadena",
        src: `${BASE}/gece-pasadena.jpg`,
        alt: "Taffarel, 1994 Dünya Kupası finalinde",
        placeholder: true,
        hint: "Yatay · sarı Brezilya kaleci forması değil, kaleci kitinin kendi rengi · penaltı anı ya da hemen sonrası · 1994 karesi",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 1998,
      title: "Marsilya",
      meta: "Dünya Kupası yarı finali · Brezilya — Hollanda",
      line: "Dört yıl sonra aynı sınav, aynı adam. Yarı final penaltılara gitti ve iki vuruşu çıkardı; ülkesini ikinci kez üst üste finale taşıdı.",
      image: {
        id: "night-marsilya",
        src: `${BASE}/gece-marsilya.jpg`,
        alt: "Taffarel, 1998 Dünya Kupası yarı finalinde",
        placeholder: true,
        hint: "Yatay · Brezilya kalesi · penaltı kurtarışı ya da takım arkadaşlarıyla koşusu · 1998 karesi",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2000,
      title: "Kopenhag",
      meta: "UEFA Kupası finali · Galatasaray — Arsenal",
      line: "Yağmurlu bir gecede yine penaltılar. Türkiye'nin bir kulübü ilk kez Avrupa kupası kaldırdı ve kalede otuz dört yaşında bir Brezilyalı duruyordu.",
      image: {
        id: "night-kopenhag",
        src: `${BASE}/gece-kopenhag.jpg`,
        alt: "Taffarel, 2000 UEFA Kupası finalinde",
        placeholder: true,
        hint: "Yatay · Kopenhag · penaltı serisi ya da kupa kutlaması · GS kaleci forması · gecenin ıslak ışığı görünsün",
        width: 1400,
        height: 900,
      },
    },
    {
      year: 2000,
      title: "Monako",
      meta: "UEFA Süper Kupası · Galatasaray — Real Madrid",
      line: "Aynı yılın sonbaharında Avrupa'nın en büyük kulübünün karşısına çıktılar ve kazandılar. Bir kupa şans sayılabilir; iki kupa sayılmaz.",
      image: {
        id: "night-monako",
        src: `${BASE}/gece-monako.jpg`,
        alt: "Taffarel, 2000 UEFA Süper Kupası gecesinde",
        placeholder: true,
        hint: "Yatay · Monako · maç anı ya da kupa · GS kaleci forması · kalabalık kare olabilir, yüz seçilsin",
        width: 1200,
        height: 800,
      },
    },
  ],
  personal: [
    {
      label: "Duruş",
      title: "Geç karar veren adam",
      body: "Penaltıda erken yatmaz, son ana kadar ayaktadır ve gövdesini kapatarak bekler. Bu, kurtarış sayısını değil kurtarış ihtimalini artıran bir alışkanlıktır. İki turnuvanın penaltı serisinde de aynı duruşu tekrar ettiğini görmek, o gecelerin şansla açıklanmasını zorlaştırıyor.",
    },
    {
      label: "Alışkanlık",
      title: "Diz çöküş",
      body: "Kupa gecelerinde ilk yaptığı şey kutlamak değil, olduğu yerde diz çökmek. Sahanın ortasına koşan on kişi ve kale çizgisinin önünde tek başına duran bir adam — 1994'ün bende kalan görüntüsü bu. Sevincini herkesten sonra göstermesi, kaleci olmanın kendisi gibi geliyor.",
    },
    {
      label: "Detay",
      title: "Yer seçimi",
      body: "Modern ölçülere göre uzun bir kaleci değildi ve bunu uçarak değil, doğru yerde durarak kapattı. Kurtarışlarının çoğu televizyonda sıradan görünür; çünkü topa ulaşmak için hamle yapmaz, top zaten onun durduğu yere gelir. Arşivde en zor bulunan kare bu adamın kurtarışı, çünkü kolay göründüğü için kimse fotoğrafını çekmemiş.",
    },
  ],
  gallery: [
    {
      id: "gallery-1",
      src: `${BASE}/galeri-1.jpg`,
      alt: "Cláudio Taffarel",
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
      hint: "Yatay · kurtarış · top kadrajda görünsün · 90'lar arşivi kabul",
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
      alt: "Brezilya kalesi",
      placeholder: true,
      hint: "Yatay · milli takım karesi · Dünya Kupası dönemi · kaleci kiti belirgin",
      width: 1400,
      height: 900,
      caption: "Milli takım",
    },
    {
      id: "gallery-5",
      src: `${BASE}/galeri-5.jpg`,
      alt: "Kupa gecesi",
      placeholder: true,
      hint: "Yatay · kupa kaldırma ya da kutlama · 1994 veya 2000 · konfeti/ışık olsun",
      width: 1600,
      height: 900,
      caption: "Kupa",
    },
    {
      id: "gallery-6",
      src: `${BASE}/galeri-6.jpg`,
      alt: "Eldivenler",
      placeholder: true,
      hint: "Kare ya da dikey · eller ve eldivenler · detay kadrajı · dönemin eldiven modeli görünsün",
      width: 1000,
      height: 1000,
      caption: "Eldivenler",
    },
    {
      id: "gallery-7",
      src: `${BASE}/galeri-7.jpg`,
      alt: "Kale çizgisi",
      placeholder: true,
      hint: "Yatay · geniş plan · kaleci çizgide yalnız · boşluk bırakan kadraj · penaltı bekleyişi ideal",
      width: 1600,
      height: 900,
      caption: "Çizgi",
    },
  ],

  /**
   * Taffarel'in imzası MONUMENT + COLUMN: efsaneler salonunun kitabe sesi,
   * ortalanmış anıtsal sütun ve arkada projektör huzmeleri. Sinematik ritim
   * ile arşiv dokusu, 90'ların granülü karelerine sayfanın kendi zeminini
   * hazırlıyor. Değerler merkezden dağıtıldı; bu blok değiştirilmez.
   */
  design: {
    voice: "monument",
    hero: "column",
    signature: "rays",
    rhythm: "cinematic",
    texture: "archive",
  },
};
