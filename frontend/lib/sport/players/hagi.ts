import { FOOTBALL_MEDIA } from "../football-media";
import type { FavouritePlayer } from "./types";

/** Kareler bu klasörde bekliyor; küratörün yüklediği `/uploads/`de. */
const BASE = "/assets/players/hagi";

/**
 * ══════════════════════════════════════════════════════════════════════════
 * GHEORGHE HAGİ — DEFTERE TAŞINDI (21 Ağustos 2026)
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ── NEDEN BURADA, BACKEND'DE DEĞİL ───────────────────────────────────────
 * Hagi'nin bir backend kaydı vardı (`FootballLegend`) ve sayfası
 * `/spor/futbol/efsaneler/hagi` adresindeki "uzun belge" düzenini
 * kullanıyordu: sürekli metin, kutu yok, fotoğraf yok. Yirmi üç futbolcunun
 * poster sayfaları yazıldıktan sonra o sayfa salonun tek yabancısı hâline
 * geldi — kullanıcı bunu bildirdi ve "diğer efsanelerde uyguladığımız
 * karakter sayfa tasarımı Hagi'de de olsun" dedi.
 *
 * İki yol vardı:
 *   ① Backend belge sayfasını yeniden tasarlamak. Reddedildi: o rota
 *      BÜTÜN arşiv efsanelerine hizmet ediyor ve tasarım eksenleri
 *      (`design`) backend şemasında yok — poster düzeni oradan beslenemez.
 *   ② Hagi'yi deftere bir kayıt olarak yazmak. Seçilen bu: tek dosya,
 *      sıfır yeni bileşen, yirmi üç sayfayla AYNI sistem.
 *
 * ⚠️ BACKEND KAYDI SİLİNMEDİ. Duruyor ve efsaneler salonu iki kaynağı da
 * okumaya devam ediyor; salon aynı slug'ı iki kaynakta görürse DEFTERİ
 * seçiyor (gerekçe `efsaneler/page.tsx` içinde). Eski adres de ölmedi:
 * `/spor/futbol/efsaneler/hagi` artık bu sayfaya yönlendiriyor.
 *
 * ── SAYILAR ──────────────────────────────────────────────────────────────
 * Kariyer duraklarının maç/gol sayıları BİLEREK boş: kaynaktan kaynağa
 * değişiyorlar ve uydurma bir rakam boş bir satırdan kötüdür — Metin Oktay
 * kaydındaki kararın aynısı. Yazılı olan tek sayı seti millî takım künyesi
 * ve Galatasaray'ın unvanları; ikisi de tek bir cümleye sığacak kadar
 * tartışmasız.
 *
 * ── GÖRSELLER ────────────────────────────────────────────────────────────
 * Üç kare DEPODA hazır (`football-media.ts`, Commons'tan indirilmiş, künyeli)
 * ve bu kayıt onları doğrudan kullanıyor: hero, kart ve galerinin açılışı.
 * Yani Hagi'nin sayfası ilk günden fotoğraflı açılıyor — kalan yuvalar
 * küratörü bekliyor.
 *
 * ⚠️ KÜNYE ZORUNLU. Üç karenin üçü de CC BY / CC BY-SA; `credit` alanları
 * `football-media.ts`ten OLDUĞU GİBİ taşınıyor ve sayfanın altındaki
 * `MediaCredits` şeridi onları basıyor. Künyeyi düşürmek telif ihlali.
 */
export const gheorgheHagi: FavouritePlayer = {
  slug: "hagi",
  name: "Gheorghe Hagi",
  firstName: "GHEORGHE",
  lastName: "HAGI",
  shirt: 10,
  position: "Ofansif orta saha",
  club: "Galatasaray",
  clubShort: "GS",
  country: "Romanya",
  countryCode: "RO",
  birthDate: "5 Şubat 1965",
  birthPlace: "Săcele, Köstence",
  height: "1,74 m",
  weight: "—",
  tagline: "Topu aldığı yerde değil, bırakacağı yerde düşünen adam.",
  legendEpithet: "Karpatlar'ın Maradonası",
  legendEra: "1996 — 2001",
  quote: "Sol ayağı bir teknik değil, bir bakış açısıydı.",
  closingQuote:
    "Beş yıl kaldı ve gidişinden yirmi yıl sonra hâlâ bir on numara geldiğinde ilk sorulan şey aynı: Hagi gibi mi?",
  palette: {
    ink: "#0a0806",
    accent: "#c8912b",
    warm: "#a5232c",
    glow: "rgba(200, 145, 43, 0.30)",
    neon: "#63431a",
  },

  /**
   * Sayfanın iskeleti: ANIT sesi (Cinzel — efsaneler salonuyla aynı kitabe
   * tonu) ama KİNETİK bir hero. İkisi bilinçli bir gerilim: adı taşa
   * kazınmış, oyunu ise hep ileri gidiyordu. İmza motifi `arc` — 1994'te
   * Kolombiya kalecisinin üstünden aşırdığı topun yörüngesi.
   *
   * ⚠️ Bu bileşim defterde tek: başka hiçbir kayıt `monument` sesini
   * `kinetic` hero ile kullanmıyor (21 Ağustos 2026'da tarandı).
   */
  design: {
    voice: "monument",
    hero: "kinetic",
    signature: "arc",
    rhythm: "cinematic",
    texture: "archive",
    /* Sıra kullanıcının isteğini merkeze alıyor: geceler okunuyor, hemen
       ardından o gecelerin görüntüsü açılıyor. Film bir ek değil, anlatının
       doruğu. */
    order: [
      "hikaye",
      "kariyer",
      "geceler",
      "film",
      "anlar",
      "istatistik",
      "galeri",
    ],
  },

  /**
   * Unutulmaz gollerin derlemesi — kullanıcının verdiği bağlantı.
   * Kimlikten adresi `PlayerFilm` kuruyor; gerekçesi orada.
   */
  film: {
    youtubeId: "xhxkRpvGbSE",
    title: ["Sol ayağın", "arşivi"],
    lede: "Anlatması zor olan şeyin tek kanıtı görüntüsüdür. Perdeye dokun: Hagi'nin unutulmaz golleri, arka arkaya.",
    meta: "1996 — 2001 · Galatasaray · derleme",
    label: "Gheorghe Hagi — unutulmaz goller derlemesi",
  },

  hero: {
    id: "hero",
    src: FOOTBALL_MEDIA.hagiPortrait.src,
    alt: "Gheorghe Hagi",
    width: FOOTBALL_MEDIA.hagiPortrait.width,
    height: FOOTBALL_MEDIA.hagiPortrait.height,
    credit: FOOTBALL_MEDIA.hagiPortrait.credit,
  },
  card: {
    id: "card",
    src: FOOTBALL_MEDIA.hagiClose.src,
    alt: "Gheorghe Hagi",
    width: FOOTBALL_MEDIA.hagiClose.width,
    height: FOOTBALL_MEDIA.hagiClose.height,
    credit: FOOTBALL_MEDIA.hagiClose.credit,
  },

  badges: ["On numara", "Karpatlar'ın Maradonası", "Galatasaray"],
  vitals: [
    { label: "Doğum", value: "5 Şubat 1965" },
    { label: "Uyruk", value: "Romanya" },
    { label: "Boy", value: "1,74 m" },
    { label: "Forma", value: "10" },
  ],

  storyTitle: ["Köstence'den", "Ali Sami Yen'e"],
  storyLede:
    "Karadeniz'in öbür kıyısındaki bir kasabadan çıktı, Avrupa'nın iki büyük kulübünden geçti ve kariyerini kimsenin beklemediği yerde — İstanbul'da — taçlandırdı.",
  story: [
    "1965'te Köstence yakınlarındaki Săcele'de doğdu. Futbolu Farul Constanța'da öğrendi, Bükreş'e Sportul Studențesc ile geldi ve asıl adını Steaua București'te duyurdu. Seksenlerin sonunda Romanya futbolu Avrupa'nın dikkatini çekiyordu ve o dikkatin merkezinde bir sol ayak vardı.",
    "1990'da Real Madrid'e, 1994'te Barcelona'ya gitti. İki kulüpte de sevildi, ikisinde de kalıcı olamadı. Bugün geriye dönüp bakıldığında o dört yıl bir başarısızlık gibi anlatılıyor; oysa aynı dönemde millî takımıyla üç Dünya Kupası oynadı ve 1994'te Romanya'yı çeyrek finale taşıdı.",
    "1996'da Galatasaray'a geldiğinde otuz bir yaşındaydı ve Avrupa onu bitmiş sayıyordu. Beş yıl kaldı. O beş yılda kulüp üst üste şampiyonluklar kazandı, 2000'de UEFA Kupası'nı ve ardından Avrupa Süper Kupası'nı aldı. Türkiye'nin Avrupa'daki tek büyük kupası o kadronun elinde.",
    "2001'de, otuz altı yaşında bıraktı. Veda maçında Ali Sami Yen tribünlerinde tek bir boş koltuk yoktu. Sonrasında teknik direktörlük yaptı, Romanya'da kendi akademisini kurdu ve bir kuşak futbolcu yetiştirdi — ama Türkiye'de adı hâlâ tek bir şeyi anlatıyor: sol ayak.",
  ],

  stats: {
    club: {
      key: "galatasaray",
      label: "Galatasaray",
      crest: {
        id: "crest-gs",
        src: "/spor/futbol/gs-arma.webp",
        alt: "Galatasaray arması",
        width: 320,
        height: 397,
        credit: null,
      },
      entries: [
        { key: "era", label: "Galatasaray yılları", value: "1996 — 2001" },
        { key: "shirt", label: "Forma", value: "10" },
        { key: "uefa", label: "UEFA Kupası", value: "2000" },
        { key: "super", label: "Avrupa Süper Kupası", value: "2000" },
      ],
      note: "Maç ve gol toplamı bu deftere yazılmadı: kaynaklar birbirini tutmuyor ve uydurma bir rakam boş bir satırdan kötüdür.",
    },
    all: {
      label: "Tüm zamanlar",
      entries: [
        {
          key: "clubs",
          label: "Kulüpler",
          value: "Farul · Sportul · Steaua · Real Madrid · Brescia · Barcelona · Galatasaray",
        },
        { key: "nt", label: "Millî takım", value: "Romanya" },
        { key: "wc", label: "Dünya Kupası", value: "1990 · 1994 · 1998" },
        { key: "euro", label: "Avrupa Şampiyonası", value: "1984 · 1996 · 2000" },
      ],
      note: "Turnuva listesi tartışmasız olan tek küme; kalan sayıları küratör dolduracak.",
    },
  },

  career: [
    {
      id: "farul",
      years: "1982 — 1983",
      club: "Farul Constanța",
      country: "Romanya",
      note: "Doğduğu şehrin takımı. İlk profesyonel forma burada.",
      tone: "#6f6a5e",
      matches: null,
      goals: null,
      image: {
        id: "career-farul",
        src: `${BASE}/kariyer-farul.jpg`,
        alt: "Gheorghe Hagi, Farul Constanța yılları",
        placeholder: true,
        hint: "En erken kare · Köstence dönemi · takım fotoğrafı olabilir · yatay · grenli arşiv",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "sportul",
      years: "1983 — 1987",
      club: "Sportul Studențesc",
      country: "Romanya",
      note: "Bükreş'e geldi ve ligin gol yükünü bir orta saha olarak taşıdı.",
      tone: "#7a7263",
      matches: null,
      goals: null,
      image: {
        id: "career-sportul",
        src: `${BASE}/kariyer-sportul.jpg`,
        alt: "Gheorghe Hagi, Sportul Studențesc formasıyla",
        placeholder: true,
        hint: "Gençlik dönemi · aksiyon karesi · yatay · seksenlerin renk paleti",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "steaua",
      years: "1987 — 1990",
      club: "Steaua București",
      country: "Romanya",
      note: "Avrupa onu burada gördü: üç lig, bir Avrupa Kupası finali.",
      tone: "#8a6f4a",
      matches: null,
      goals: null,
      image: {
        id: "career-steaua",
        src: `${BASE}/kariyer-steaua.jpg`,
        alt: "Gheorghe Hagi, Steaua București formasıyla",
        placeholder: true,
        hint: "Steaua dönemi · Avrupa maçı tercih · yatay",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "real-madrid",
      years: "1990 — 1992",
      club: "Real Madrid",
      country: "İspanya",
      note: "İtalya'daki Dünya Kupası'nın ardından Bernabéu. İki sezon.",
      tone: "#9a9a94",
      matches: null,
      goals: null,
      image: {
        id: "career-real",
        src: `${BASE}/kariyer-real.jpg`,
        alt: "Gheorghe Hagi, Real Madrid formasıyla",
        placeholder: true,
        hint: "Beyaz forma · Bernabéu · yatay · en tanınan yabancı kare",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "brescia",
      years: "1992 — 1994",
      club: "Brescia",
      country: "İtalya",
      note: "Serie A'ya düşüş ve çıkış; bir kulübü tek başına taşıdığı iki yıl.",
      tone: "#7d8390",
      matches: null,
      goals: null,
      image: {
        id: "career-brescia",
        src: `${BASE}/kariyer-brescia.jpg`,
        alt: "Gheorghe Hagi, Brescia formasıyla",
        placeholder: true,
        hint: "İtalya dönemi · mavi forma · yatay · bulunması en zor kare",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "barcelona",
      years: "1994 — 1996",
      club: "Barcelona",
      country: "İspanya",
      note: "Dünya Kupası'ndan sonra Camp Nou. İki sezon, sonra İstanbul.",
      tone: "#8d6a7c",
      matches: null,
      goals: null,
      image: {
        id: "career-barcelona",
        src: `${BASE}/kariyer-barcelona.jpg`,
        alt: "Gheorghe Hagi, Barcelona formasıyla",
        placeholder: true,
        hint: "Camp Nou · blaugrana forma · yatay",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "galatasaray",
      years: "1996 — 2001",
      club: "Galatasaray",
      country: "Türkiye",
      note: "Avrupa'nın bitmiş saydığı yerde başladı; kulübün en büyük beş yılı.",
      tone: "#c8912b",
      matches: null,
      goals: null,
      current: true,
      image: {
        id: "career-galatasaray",
        src: FOOTBALL_MEDIA.hagiPitch.src,
        alt: "Gheorghe Hagi, Galatasaray döneminden bir kare",
        width: FOOTBALL_MEDIA.hagiPitch.width,
        height: FOOTBALL_MEDIA.hagiPitch.height,
        credit: FOOTBALL_MEDIA.hagiPitch.credit,
      },
    },
  ],

  nights: [
    {
      year: 1994,
      title: "Kolombiya'nın üstünden",
      meta: "Dünya Kupası · ABD",
      line: "Kaleciyi kalesinden uzakta gördü ve topu köşeye aşırdı. O yörünge bugün bile bir futbolcunun neyi görüp neyi göremediğini anlatmak için gösteriliyor.",
      image: {
        id: "night-kolombiya",
        src: `${BASE}/gece-kolombiya.jpg`,
        alt: "",
        placeholder: true,
        hint: "1994 Dünya Kupası · Romanya forması · vuruş anı ya da sevinç · yatay",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 1996,
      title: "İstanbul'a geliş",
      meta: "Transfer · Barcelona'dan Galatasaray'a",
      line: "Otuz bir yaşında, Avrupa onu bitmiş sayarken geldi. Beş yıl sonra çıktığında kulübün tarihi ikiye ayrılmıştı.",
      image: {
        id: "night-gelis",
        src: `${BASE}/gece-gelis.jpg`,
        alt: "",
        placeholder: true,
        hint: "İmza ya da ilk forma karesi · 1996 · yatay",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2000,
      title: "Kopenhag",
      meta: "UEFA Kupası finali · Parken",
      line: "Türkiye'nin Avrupa'daki tek büyük kupası o gece kaldırıldı. Hagi sahada değildi — kırmızı kart görmüştü — ama o kadronun aklı hâlâ oydu.",
      image: {
        id: "night-kopenhag",
        src: `${BASE}/gece-kopenhag.jpg`,
        alt: "",
        placeholder: true,
        hint: "2000 UEFA Kupası · kupa anı · yatay · tribün görünsün",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2000,
      title: "Monako",
      meta: "Avrupa Süper Kupası · Real Madrid karşısında",
      line: "Kupayı bir yıl önce bıraktığı Avrupa'nın en büyük kulübünden aldı. Aynı sezonda ikinci Avrupa kupası.",
      image: {
        id: "night-monako",
        src: `${BASE}/gece-monako.jpg`,
        alt: "",
        placeholder: true,
        hint: "Süper Kupa · Monako · kupa ya da maç anı · yatay",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2001,
      title: "Veda",
      meta: "Ali Sami Yen · son maç",
      line: "Tribünlerde tek bir boş koltuk yoktu. Bir futbolcunun vedasında bütün bir stadın ayakta durması, o futbolcunun artık kulübün kendisi olduğu anlamına gelir.",
      image: {
        id: "night-veda",
        src: `${BASE}/gece-veda.jpg`,
        alt: "",
        placeholder: true,
        hint: "Veda maçı · Ali Sami Yen · tribün ve oyuncu birlikte · yatay",
        width: 1200,
        height: 800,
      },
    },
  ],

  personal: [
    {
      label: "Kadraj",
      title: "İlk bakışta görünmeyen",
      body: "Onu izlerken dikkat topa gidiyordu; oysa asıl olay top ayağına gelmeden önce oluyordu. Pasın nereye gideceğini, topu almadan önce çoktan seçmiş oluyordu. Bunu fark etmek için maçı ikinci kez, kameranın onu takip etmediği anlara bakarak izlemek gerekiyor.",
    },
    {
      label: "Alışkanlık",
      title: "Kaleciye bakmak",
      body: "Ceza sahasına yaklaşırken önce kaleye değil KALECİYE bakıyordu. 1994'teki o gol bir tesadüf değildi; aynı bakışı yüzlerce kez yaptı, karşılığını birkaç kez aldı. Bir futbolcunun imzası, denediği şeyin tuttuğu anlarda değil denemeye devam ettiği anlarda görünür.",
    },
    {
      label: "Zamanlama",
      title: "Otuz bir yaşında gelmek",
      body: "Buraya geldiğinde kariyerinin bittiği yazılıyordu. Sonraki beş yıl, bir futbolcunun en iyi döneminin hangi yaşta olduğu sorusunun cevabının kişiye göre değiştiğini gösterdi. Kulübün Avrupa'daki en büyük gecesi, onun 'bitmiş' sayıldığı yılların içinde.",
    },
  ],

  gallery: [
    {
      id: "gallery-1",
      src: FOOTBALL_MEDIA.hagiPitch.src,
      alt: "Gheorghe Hagi, sahada",
      width: FOOTBALL_MEDIA.hagiPitch.width,
      height: FOOTBALL_MEDIA.hagiPitch.height,
      credit: FOOTBALL_MEDIA.hagiPitch.credit,
      caption: "Sahada",
    },
    {
      id: "gallery-2",
      src: FOOTBALL_MEDIA.hagiPortrait.src,
      alt: "Gheorghe Hagi, portre",
      width: FOOTBALL_MEDIA.hagiPortrait.width,
      height: FOOTBALL_MEDIA.hagiPortrait.height,
      credit: FOOTBALL_MEDIA.hagiPortrait.credit,
      caption: "Portre",
    },
    {
      id: "gallery-3",
      src: FOOTBALL_MEDIA.hagiClose.src,
      alt: "Gheorghe Hagi, yakın plan",
      width: FOOTBALL_MEDIA.hagiClose.width,
      height: FOOTBALL_MEDIA.hagiClose.height,
      credit: FOOTBALL_MEDIA.hagiClose.credit,
      caption: "Yakın plan",
    },
    {
      id: "gallery-4",
      src: `${BASE}/galeri-4.jpg`,
      alt: "Sol ayak",
      placeholder: true,
      hint: "Vuruş anı · sol ayak net görünsün · yatay · sayfanın imza karesi",
      width: 1200,
      height: 800,
      caption: "Sol ayak",
    },
    {
      id: "gallery-5",
      src: `${BASE}/galeri-5.jpg`,
      alt: "Romanya forması",
      placeholder: true,
      hint: "Millî takım karesi · sarı forma · yatay ya da dikey",
      width: 1200,
      height: 800,
      caption: "Romanya",
    },
    {
      id: "gallery-6",
      src: `${BASE}/galeri-6.jpg`,
      alt: "Kupa",
      placeholder: true,
      hint: "2000 UEFA Kupası ya da Süper Kupa · kupa elinde · dikey tercih",
      width: 900,
      height: 1200,
      caption: "Kupa",
    },
    {
      id: "gallery-7",
      src: `${BASE}/galeri-7.jpg`,
      alt: "Tribün",
      placeholder: true,
      hint: "Ali Sami Yen tribünü · veda gecesi tercih · yatay · geniş açı",
      width: 1400,
      height: 900,
      caption: "Tribün",
    },
  ],
};
