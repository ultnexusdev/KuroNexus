import type { FavouritePlayer } from "./types";

/** Depodaki kareler bu klasörde bekliyor; küratörün yüklediği `/uploads/`de. */
const BASE = "/assets/players/bulent-korkmaz";

/**
 * BÜLENT KORKMAZ — altın neslin kaptanı.
 *
 * ⚠️ SAYILAR DOĞRULANMADI — dış bir kaynakla karşılaştırılmadı.
 * Küratör düzeltmesi bu dosyada tek satır.
 *
 * ⚠️ BİLEREK YAZILMAYAN SAYILAR. Bu gerçek bir insan, o yüzden emin olunmayan
 * hiçbir rakam konmadı:
 *   · forma numarası  → `shirt: null`
 *   · boy / kilo      → `height` ve `weight` tire; hero künyesinde de tire
 *                        görünür, bozuk değil — doldurulmayı bekleyen alan
 *   · doğum günü/ayı  → yalnızca yıl yazıldı
 *   · maç / gol       → kariyer duraklarında `matches` ve `goals` null,
 *                        istatistik kümelerine maç-gol satırı hiç konmadı
 *   · şampiyonluk adedi ve millî takım maç sayısı → satır hiç açılmadı
 * Uydurma bir rakam yerine boşluk bırakıldı. Dört yerine üç istatistik satırı,
 * yanlış bir sayıdan iyidir.
 *
 * ⚠️ Kariyer şeridi dört durak taşıyor ama dördü de aynı kulüp. Bu bir hata
 * değil, kaydın ta kendisi: Bülent Korkmaz tek forma giydi, bu yüzden şerit
 * kulüpleri değil DÖNEMLERİ diziyor. Yuva kimlikleri (`career-gs-*`) buna
 * göre kararlı tutuldu.
 */
export const bulentKorkmaz: FavouritePlayer = {
  slug: "bulent-korkmaz",
  name: "Bülent Korkmaz",
  firstName: "BÜLENT",
  lastName: "KORKMAZ",
  shirt: null,
  position: "Stoper",
  club: "Galatasaray",
  clubShort: "GS",
  country: "Türkiye",
  countryCode: "TR",
  birthDate: "1968",
  birthPlace: "İstanbul, Türkiye",
  height: "—",
  weight: "—",
  tagline: "Sertlikle değil, doğru yerde durarak savunan bir stoper.",
  legendEpithet: "Altın neslin kaptanı",
  legendEra: "1980'lerin sonu — 2005",
  quote: "Kaptanlık ona verilmedi; sahada zaten yaptığı işin adı kondu.",
  closingQuote:
    "Bir kulübün tarihini anlatmanın en kısa yolu bazen tek bir adamın tek bir formasıdır.",
  palette: {
    ink: "#100c07",
    accent: "#d8b26a",
    warm: "#9d3b2a",
    glow: "rgba(216, 178, 106, 0.30)",
    neon: "#6f4a1e",
  },
  hero: {
    id: "hero",
    src: `${BASE}/hero.jpg`,
    alt: "Bülent Korkmaz, Galatasaray forması",
    placeholder: true,
    hint: "Dikey kadraj · GS forması · kaptanlık pazubendi görünsün · sakin duruş, kutlama değil · arşiv karesi tercih edilir",
    width: 1200,
    height: 1600,
  },
  card: {
    id: "card",
    src: `${BASE}/kart.jpg`,
    alt: "Bülent Korkmaz",
    placeholder: true,
    hint: "Hub şeridindeki kart + efsaneler salonundaki portre · dikey · üst gövde · yüz net · ciddi ifade",
    width: 900,
    height: 1200,
  },
  badges: ["Stoper", "Kaptan", "Galatasaray"],
  vitals: [
    { label: "Doğum", value: "1968" },
    { label: "Doğum yeri", value: "İstanbul" },
    { label: "Mevki", value: "Stoper" },
    { label: "Kulüp", value: "Galatasaray" },
  ],
  storyTitle: ["Tek forma,", "bir ömür"],
  storyLede:
    "İstanbul'da doğdu, Galatasaray altyapısında büyüdü ve profesyonel kariyeri boyunca başka bir kulübün formasını giymedi. Arşivde bunu yapabilmiş çok az isim var.",
  story: [
    "Altyapıdan geldi ve gitmedi. Türk futbolunda bir oyuncunun tek kulüpte kalması bir sadakat hikâyesinden çok bir dayanma hikâyesidir: her transfer döneminde aynı soru yeniden sorulur ve her seferinde aynı cevabı vermek gerekir. O soruyu yıllarca duydu, hep aynı yerde kaldı.",
    "Stoperliğini sertlik üzerine kurmadı. Kayarak top kesen değil, kesmesi gerekmeyen yerde duran adamdı; ikili mücadeleye girmeden önce rakibin gideceği yeri kapatırdı. Bu, tribünde alkış toplamayan bir savunma biçimidir. Ama arkasında boşluk bırakmaz.",
    "Pazubent yıllarca onda kaldı. Kaptanlık burada bir unvan değil, bir iş tarifiydi: hattı yukarı çekmek, genç oyuncuyu yerine oturtmak, hakemle kavga etmeden konuşmak. Kulübün en çok kupa kaldıran neslinin ortasında, en az konuşan adamlardan biriydi.",
    "2000 yılında Kopenhag'da UEFA Kupası'nı, aynı yıl Monako'da Süper Kupa'yı kaldırdı. Türk futbolunun en çok basılan iki karesi; ikisinde de kupayı tutan el aynı. Sonra, başladığı sahada bıraktı.",
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
        hint: "Galatasaray arması · kare ya da dikey oturur · şeffaf zemin ideal · dönem armasıyla eskitilmiş bir versiyon da olur",
        width: 800,
        height: 800,
      },
      entries: [
        { key: "clubs", label: "Kulüp", value: "1" },
        { key: "uefa", label: "UEFA Kupası", value: "2000" },
        { key: "supercup", label: "UEFA Süper Kupası", value: "2000" },
        { key: "armband", label: "Pazubent", value: "Kaptan" },
      ],
      note: "Maç, gol ve şampiyonluk sayıları doğrulanmadığı için buraya hiç yazılmadı.",
    },
    all: {
      label: "Tüm zamanlar",
      entries: [
        { key: "clubs", label: "Kulüp", value: "1" },
        { key: "national", label: "Millî takım", value: "Türkiye" },
        { key: "wc2002", label: "2002 Dünya Kupası", value: "3." },
      ],
      note: "Kariyerin tamamı tek kulüpte geçti; toplamlar küratör doğrulamasını bekliyor.",
    },
  },
  career: [
    {
      id: "gs-altyapi",
      years: "1980'lerin sonu",
      club: "Galatasaray",
      country: "Türkiye",
      note: "Altyapıdan A takıma. Hattın en genç adamı olarak başladı.",
      tone: "#6d6455",
      matches: null,
      goals: null,
      image: {
        id: "career-gs-altyapi",
        src: `${BASE}/kariyer-altyapi.jpg`,
        alt: "Bülent Korkmaz, ilk yıllar",
        placeholder: true,
        hint: "Yatay · dönem karesi · genç hâli · siyah-beyaz ya da solmuş renk en iyisi",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "gs-doksanlar",
      years: "1990'lar",
      club: "Galatasaray",
      country: "Türkiye",
      note: "Üst üste gelen şampiyonlukların ortasında savunmanın sabit noktası.",
      tone: "#8a6f3f",
      matches: null,
      goals: null,
      image: {
        id: "career-gs-doksanlar",
        src: `${BASE}/kariyer-doksanlar.jpg`,
        alt: "Bülent Korkmaz, 1990'lar",
        placeholder: true,
        hint: "Yatay · maç anı · ikili mücadele ya da hattı yönetirken · dönem forması",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "gs-avrupa",
      years: "1999 — 2001",
      club: "Galatasaray",
      country: "Türkiye",
      note: "Kopenhag ve Monako. Kupayı kaldıran el.",
      tone: "#c0913f",
      matches: null,
      goals: null,
      image: {
        id: "career-gs-avrupa",
        src: `${BASE}/kariyer-avrupa.jpg`,
        alt: "Bülent Korkmaz, Avrupa geceleri",
        placeholder: true,
        hint: "Yatay · kupa kaldırma anı · şeridin en güçlü karesi burası olmalı",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "gs-veda",
      years: "2000'lerin başı — 2005",
      club: "Galatasaray",
      country: "Türkiye",
      note: "Aynı sahada başladı, aynı sahada bıraktı.",
      tone: "#d8b26a",
      matches: null,
      goals: null,
      current: true,
      image: {
        id: "career-gs-veda",
        src: `${BASE}/kariyer-veda.jpg`,
        alt: "Bülent Korkmaz, son yıllar",
        placeholder: true,
        hint: "Yatay · son dönem · tribüne dönük ya da sahadan çıkarken · veda tonu",
        width: 1200,
        height: 800,
      },
    },
  ],
  nights: [
    {
      year: 1993,
      title: "Ali Sami Yen",
      meta: "Şampiyonlar Ligi · Galatasaray — Manchester United",
      line: "Avrupa'nın en gürültülü gecelerinden biri. Doksan dakika boyunca kale önünde tek bir boşluk açılmadı ve United turnuvadan elendi.",
      image: {
        id: "night-alisamiyen",
        src: `${BASE}/gece-alisamiyen.jpg`,
        alt: "",
        placeholder: true,
        hint: "Yatay · Ali Sami Yen · meşale ve tribün ışığı · gece karesi",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2000,
      title: "Kopenhag",
      meta: "UEFA Kupası finali · Parken · Galatasaray — Arsenal",
      line: "Penaltılara kadar giden bir final. Kupayı kaldıran kaptan oydu ve Türk futbolunun Avrupa'daki ilk büyük kupası o gece geldi.",
      image: {
        id: "night-kopenhag",
        src: `${BASE}/gece-kopenhag.jpg`,
        alt: "",
        placeholder: true,
        hint: "Yatay · kupayı kaldırırken · konfeti · arşivin en tanıdık karesi",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2000,
      title: "Monako",
      meta: "UEFA Süper Kupası · Galatasaray — Real Madrid",
      line: "Altın golle biten bir maç. Avrupa'nın en büyük kulübünün karşısında savunma ayakta kaldı ve ikinci kupa da aynı yıla sığdı.",
      image: {
        id: "night-monako",
        src: `${BASE}/gece-monako.jpg`,
        alt: "",
        placeholder: true,
        hint: "Yatay · Monako · kupa ya da maç anı · gece ışığı",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2002,
      title: "Dünya Kupası",
      meta: "Türkiye millî takımı · 2002",
      line: "Türkiye'nin üçüncü olduğu turnuvada o kadronun içindeydi. Bir kuşağın kulüpteki ve millî takımdaki karşılığı aynı yıllara denk geldi.",
      image: {
        id: "night-dunyakupasi",
        src: `${BASE}/gece-dunyakupasi.jpg`,
        alt: "",
        placeholder: true,
        hint: "Yatay · millî takım forması · 2002 karesi · takım hâlinde de olur",
        width: 1200,
        height: 800,
      },
    },
  ],
  personal: [
    {
      label: "Duruş",
      title: "Kolunu kaldırması",
      body: "Top rakip yarı sahadayken kolunu havaya kaldırıp hattı yukarı çekerdi. Kimse ona bakmıyormuş gibi görünürdü ama savunma her seferinde birlikte yürürdü. Arşivde en sevdiğim hareket bu: bir adamın kolu, dört kişiyi aynı çizgiye diziyor.",
    },
    {
      label: "Alışkanlık",
      title: "Ayağını en sona uzatırdı",
      body: "Kaymayı hep son çare olarak tutardı. Rakibin gövdesini omzuyla kapatır, topu ayağıyla değil pozisyonuyla alırdı. Bu yüzden temiz oynadı; sertlikle değil, doğru durmakla anıldı.",
    },
    {
      label: "Kaptanlık",
      title: "Elleri arkada konuşurdu",
      body: "Hakemle konuşurken ellerini arkasında tutardı. İtiraz gibi değil, açıklama gibi dururdu ve genelde dinlenirdi. Pazubendin ne işe yaradığını gösteren en sessiz detay bu.",
    },
  ],
  gallery: [
    {
      id: "gallery-1",
      src: `${BASE}/galeri-1.jpg`,
      alt: "Bülent Korkmaz",
      placeholder: true,
      hint: "Ana galeri karesi · geniş yatay · en yüksek çözünürlük · pazubent görünsün",
      width: 1280,
      height: 720,
      caption: "Ana kare",
    },
    {
      id: "gallery-2",
      src: `${BASE}/galeri-2.jpg`,
      alt: "Kupa gecesi",
      placeholder: true,
      hint: "Yatay · 2000 kupa gecesi · takımla birlikte",
      width: 1200,
      height: 800,
      caption: "Kupa gecesi",
    },
    {
      id: "gallery-3",
      src: `${BASE}/galeri-3.jpg`,
      alt: "Portre",
      placeholder: true,
      hint: "Dikey portre · yüz net · sakin ifade · anıtsal kadraj",
      width: 900,
      height: 1200,
      caption: "Portre",
    },
    {
      id: "gallery-4",
      src: `${BASE}/galeri-4.jpg`,
      alt: "İkili mücadele",
      placeholder: true,
      hint: "Yatay · savunma anı · kafa topu ya da omuz omuza mücadele",
      width: 1200,
      height: 800,
      caption: "Mücadele",
    },
    {
      id: "gallery-5",
      src: `${BASE}/galeri-5.jpg`,
      alt: "Millî takım",
      placeholder: true,
      hint: "Millî takım forması · yatay ya da dikey · 1990'lar-2000'ler arası",
      width: 1000,
      height: 1000,
      caption: "Millî forma",
    },
    {
      id: "gallery-6",
      src: `${BASE}/galeri-6.jpg`,
      alt: "Takım arkadaşlarıyla",
      placeholder: true,
      hint: "Yatay · altın nesil kadrosu · soyunma odası ya da saha içi grup karesi",
      width: 1200,
      height: 800,
      caption: "Altın nesil",
    },
    {
      id: "gallery-7",
      src: `${BASE}/galeri-7.jpg`,
      alt: "Veda",
      placeholder: true,
      hint: "Dikey · son maç ya da tribüne el sallarken · arşivin kapanış karesi",
      width: 900,
      height: 1200,
      caption: "Veda",
    },
  ],

  /**
   * Anıt sesi: Cinzel'in kitabe kapitali, arşiv çerçevesi içinde bir portre,
   * arkada yatay tarama izi ve sepya lekesi. Sinematik ritim sayfayı
   * yavaşlatıyor — bu kayıt koşmuyor, duruyor.
   */
  design: {
    voice: "monument",
    hero: "frame",
    signature: "scan",
    rhythm: "cinematic",
    texture: "archive",
  },
};
