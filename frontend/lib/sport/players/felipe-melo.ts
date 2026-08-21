import type { FavouritePlayer } from "./types";

/** Küratörün yükleyeceği kareler bu klasörde bekliyor. */
const BASE = "/assets/players/felipe-melo";

/**
 * ⚠️ SAYILAR DOĞRULANMADI — dış bir kaynakla karşılaştırılmadı.
 * Küratör düzeltmesi bu dosyada tek satır.
 *
 * FELIPE MELO — orta sahanın kavgacısı.
 *
 * ── BU DOSYADA NE YAZILMADI ──────────────────────────────────────────────
 * Maç, gol ve asist sayısı BİLEREK yazılmadı. Sözleşmenin §5 kuralı gereği
 * emin olunmayan bir rakam yazmaktansa satırı hiç koymamak tercih edildi:
 *
 *   - `career[].matches` ve `career[].goals` alanlarının hepsi `null`.
 *   - İki istatistik kümesi de rakam değil DÖNEM ve KUPA üzerinden kuruldu.
 *   - `shirt` `null` — Galatasaray'daki forma numarası doğrulanamadı, bu
 *     yüzden hero künyesinde numara rozeti hiç basılmıyor.
 *   - `weight` yazılmadı ("—"), `height` doğrulanmamış bir kayıt.
 *   - Gecelerin hiçbirinde skor yok; sahne anlatılıyor, rakam değil.
 *
 * Kupa ve dönem satırları (2011 — 2015 arası Galatasaray, üç Süper Lig, iki
 * Türkiye Kupası, 2012-13'te Avrupa'da çeyrek final) küratörün doğrulaması
 * için bırakıldı; yanlışsa düzeltilecek yer `stats` bloğu.
 */
export const felipeMelo: FavouritePlayer = {
  slug: "felipe-melo",
  name: "Felipe Melo",
  firstName: "FELIPE",
  lastName: "MELO",
  shirt: null,
  position: "Defansif orta saha",
  club: "Galatasaray",
  clubShort: "GS",
  country: "Brezilya",
  countryCode: "BR",
  birthDate: "26 Haziran 1983",
  birthPlace: "Volta Redonda, Brezilya",
  height: "185 cm",
  weight: "—",
  tagline: "Topu kazanmayı gol gibi kutlayan adam.",
  quote: "Sahada yarım adım yoktu; tribün de ondan zaten bunu istiyordu.",
  closingQuote:
    "Bir orta saha oyuncusunun adı, gol atmadan da tezahürat olabiliyor. Onunki oldu.",

  /**
   * Kart kırmızısı + kömür + sıcak kül. Icardi'nin altın-kırmızısının tam
   * karşısında duruyor: burada ışık sarıdan değil, hakemin kaldırdığı karttan
   * geliyor; ikinci ton ise sönmüş bir kül. Mavi hiçbir değerde yok.
   */
  palette: {
    ink: "#0e0a09",
    accent: "#e5372a",
    warm: "#c9b6a4",
    glow: "rgba(229, 55, 42, 0.30)",
    neon: "#6b1a10",
  },

  hero: {
    id: "hero",
    src: `${BASE}/hero.jpg`,
    alt: "Felipe Melo, Galatasaray forması",
    placeholder: true,
    hint: "Dikey kadraj · GS forması · mücadele anı ya da tribüne dönük sevinç · yüz net, kollar açık",
    width: 1200,
    height: 1600,
  },
  card: {
    id: "card",
    src: `${BASE}/kart.jpg`,
    alt: "Felipe Melo",
    placeholder: true,
    hint: "Hub şeridindeki kart · dikey · üst gövde · bakış kameraya, ifade sert",
    width: 900,
    height: 1200,
  },

  badges: ["Defansif orta saha", "Brezilya", "Galatasaray"],
  vitals: [
    { label: "Doğum tarihi", value: "26.06.1983" },
    { label: "Uyruk", value: "Brezilya" },
    { label: "Mevki", value: "Defansif orta saha" },
    { label: "Galatasaray", value: "2011 — 2015" },
  ],

  storyTitle: ["Topu kazanan", "adam"],
  storyLede:
    "Gol atmadan sevilen futbolcu azdır. Felipe Melo İstanbul'da dört yıl kaldı ve o dört yıl boyunca tribünün öfkesini de neşesini de aynı anda taşıdı.",
  story: [
    "Volta Redonda'da doğdu, futbolu Rio'da öğrendi. Flamengo'nun altyapısından çıkan çocukların çoğu topla ne yapacağını öğrenir; o, top kimdeyse onunla ne yapacağını öğrendi. Dünyanın en çok süsleyen ülkesinden, süslemeyi hiç denemeyen bir orta saha çıktı.",
    "Avrupa'ya İspanya üzerinden geldi, adını İtalya'da duyurdu. Floransa'da geçen tek sezon onu Torino'ya taşıdı ve orada alkışlanmayan işi yaptı: pas hatasını kesen ayak, kontratağı doğmadan bitiren faul. 2010'da Brezilya formasıyla çıktığı bir çeyrek final akşamında her şey ters gitti ve o akşam yıllarca üstüne yapıştı. Ne saklandı ne de küçüldü; ertesi hafta yine aynı yerde duruyordu.",
    "2011 yazında Juventus'tan kiralık olarak İstanbul'a geldi ve dört yıl kaldı. Bu dört yılda üç kez lig şampiyonu oldu, Avrupa'da son sekize kadar çıkan bir kadronun tam ortasında durdu. Gol atmadan sevilmek zordur; o, topu kazanmayı bir gol gibi kutlayarak bunu başardı. Tribün ona bir futbolcuya değil, kendi öfkesine bakar gibi baktı.",
    "İstanbul'dan sonra Milano'ya, oradan Brezilya'ya döndü ve kariyerinin son bölümünde Palmeiras'la Güney Amerika'nın en büyük kupasını iki kez kaldırdı. Ama konuşurken adı hep aynı yere döndü. Bir futbolcunun hangi kulübe ait olduğunu giydiği formaların sayısı değil, yıllar sonra hangi armadan bahsettiği söyler.",
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
        { key: "period", label: "Dönem", value: "2011 — 2015" },
        { key: "titles", label: "Süper Lig", value: "3" },
        { key: "cup", label: "Türkiye Kupası", value: "2" },
        { key: "europe", label: "Avrupa", value: "Çeyrek final" },
      ],
      note: "Maç ve gol sayıları doğrulanmadığı için bu kümeye hiç yazılmadı; buradaki dört satır dönem ve kupa.",
    },
    all: {
      label: "Tüm zamanlar",
      entries: [
        { key: "countries", label: "Ülke", value: "4" },
        { key: "national", label: "Millî takım", value: "Brezilya" },
        { key: "worldcup", label: "Dünya Kupası", value: "2010" },
        { key: "libertadores", label: "Libertadores", value: "2" },
      ],
      note: "Rio'dan Palma'ya, Floransa'dan Torino'ya, İstanbul'dan São Paulo'ya. Toplam maç sayısı bu dosyada bilerek boş.",
    },
  },

  career: [
    {
      id: "flamengo",
      years: "2000'lerin başı",
      club: "Flamengo",
      country: "Brezilya",
      note: "Rio'da başladı; oyunun süslü tarafını değil, kazanılan tarafını seçti.",
      tone: "#9b2f26",
      matches: null,
      goals: null,
      image: {
        id: "career-flamengo",
        src: `${BASE}/kariyer-flamengo.jpg`,
        alt: "Felipe Melo, Brezilya'daki ilk yıllarında",
        placeholder: true,
        hint: "Yatay · genç yıllar · Brezilya · arşiv karesi olabilir, çözünürlük düşükse sorun değil",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "fiorentina",
      years: "2008 — 2009",
      club: "Fiorentina",
      country: "İtalya",
      note: "İspanya'da geçen yılların ardından İtalya; asıl adını burada duyurdu.",
      tone: "#6d2f47",
      matches: null,
      goals: null,
      image: {
        id: "career-fiorentina",
        src: `${BASE}/kariyer-fiorentina.jpg`,
        alt: "Felipe Melo, Fiorentina formasıyla",
        placeholder: true,
        hint: "Yatay · mor forma · aksiyon karesi tercih edilir",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "juventus",
      years: "2009 — 2011",
      club: "Juventus",
      country: "İtalya",
      note: "Büyük bir kulübün orta sahasında, alkışlanmayan işi yapan adam.",
      tone: "#4b453c",
      matches: null,
      goals: null,
      image: {
        id: "career-juventus",
        src: `${BASE}/kariyer-juventus.jpg`,
        alt: "Felipe Melo, Juventus formasıyla",
        placeholder: true,
        hint: "Yatay · siyah-beyaz çizgili forma · ikili mücadele anı",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "galatasaray",
      years: "2011 — 2015",
      club: "Galatasaray",
      country: "Türkiye",
      note: "Dört yıl, üç şampiyonluk ve gol atmadan sevilmenin nadir bir örneği.",
      tone: "#e5372a",
      matches: null,
      goals: null,
      current: true,
      image: {
        id: "career-galatasaray",
        src: `${BASE}/kariyer-galatasaray.jpg`,
        alt: "Felipe Melo, Galatasaray formasıyla",
        placeholder: true,
        hint: "Yatay · GS forması · tribüne dönük sevinç — şeridin en güçlü karesi burası",
        width: 1200,
        height: 800,
      },
    },
  ],

  nights: [
    {
      year: 2012,
      title: "İlk şampiyonluk",
      meta: "Süper Lig · 2011-12",
      line: "İstanbul'a geldiği ilk sezonun sonunda kupa kalktı. Ligin ortasında oynayan bir adamın ligin en gürültülü tribününü kendine bağlaması bir sezon bile sürmedi.",
      image: {
        id: "night-ilk-sampiyonluk",
        src: `${BASE}/gece-ilk-sampiyonluk.jpg`,
        alt: "Şampiyonluk kutlaması",
        placeholder: true,
        hint: "Yatay · kupa ya da sahada kutlama · kalabalık tribün arkada",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2013,
      title: "Bernabéu'dan dönüş",
      meta: "Şampiyonlar Ligi · çeyrek final · Real Madrid",
      line: "Deplasmanda ağır geçen bir akşamdan sonra İstanbul'da bambaşka bir maç. O gece Avrupa devinin nefesini kesen şey, orta sahada kimin durduğuyla ilgiliydi.",
      image: {
        id: "night-bernabeu",
        src: `${BASE}/gece-real-madrid.jpg`,
        alt: "Şampiyonlar Ligi gecesi",
        placeholder: true,
        hint: "Yatay · Şampiyonlar Ligi karesi · mücadele anı, tercihen İstanbul'daki maç",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2013,
      title: "Kar",
      meta: "Şampiyonlar Ligi · Galatasaray — Juventus · Aralık",
      line: "Kar maçı durdurdu, ertesi gün kaldığı yerden devam etti. Eski kulübünün karşısında, beyaza kesmiş bir sahada, gruptan çıkan takımın tam ortasında duruyordu.",
      image: {
        id: "night-kar",
        src: `${BASE}/gece-kar.jpg`,
        alt: "Kar altında oynanan maç",
        placeholder: true,
        hint: "Yatay · kar yağarken çekilmiş kare · beyaz zemin, kırmızı-sarı forma kontrastı",
        width: 1200,
        height: 800,
      },
    },
    {
      year: 2014,
      title: "Kupa",
      meta: "Türkiye Kupası finali",
      line: "Ligin dışında kalan bir sezonu kupayla kapatmak, tribünün o yıl en çok ihtiyaç duyduğu şeydi. Final akşamı en çok koşan adam yine oydu.",
      image: {
        id: "night-kupa",
        src: `${BASE}/gece-kupa.jpg`,
        alt: "Türkiye Kupası kutlaması",
        placeholder: true,
        hint: "Yatay ya da kare · kupa elde · takım kutlaması",
        width: 1200,
        height: 800,
      },
    },
  ],

  personal: [
    {
      label: "Sertlik",
      title: "Kabul edilen kart",
      body: "Kontratağın ilk adımında araya girer ve kartı da kabul eder. Bu bir öfke değil, bir hesap: takımın on saniyesini kendi cezasıyla satın alır. Tribün o faulü çoğu golden önce alkışlıyordu.",
    },
    {
      label: "Sevinç",
      title: "Müdahalenin kutlaması",
      body: "Topu kazandığı yerde ayağa kalkar, tribüne döner, iki kolunu yana açar. Gol atmayan bir adamın gol sevinci bu. Stadyumun sesi golden sonra değil de top kazanıldıktan sonra yükseliyorsa sebebi genelde odur.",
    },
    {
      label: "Alışkanlık",
      title: "Susmaz",
      body: "Doksan dakika boyunca konuşur; arkadaşını eliyle iki adım sağa çeker, sonra dönüp arkasını kontrol eder. Kamera onu çoğunlukla topsuzken yakalar ve asıl işi tam orada görünür.",
    },
  ],

  gallery: [
    {
      id: "gallery-1",
      src: `${BASE}/galeri-1.jpg`,
      alt: "Felipe Melo, Galatasaray forması",
      placeholder: true,
      hint: "Ana galeri karesi · geniş yatay · en yüksek çözünürlük buraya",
      width: 1600,
      height: 900,
      caption: "Ana kare",
    },
    {
      id: "gallery-2",
      src: `${BASE}/galeri-2.jpg`,
      alt: "İkili mücadele",
      placeholder: true,
      hint: "Yatay · ikili mücadele · ayak ya da omuz teması net görünsün",
      width: 1200,
      height: 800,
      caption: "Mücadele",
    },
    {
      id: "gallery-3",
      src: `${BASE}/galeri-3.jpg`,
      alt: "Portre",
      placeholder: true,
      hint: "Dikey portre · yüz ifadesi sert · yakın plan",
      width: 900,
      height: 1200,
      caption: "Portre",
    },
    {
      id: "gallery-4",
      src: `${BASE}/galeri-4.jpg`,
      alt: "Tribüne dönük an",
      placeholder: true,
      hint: "Dikey · kollar açık · tribüne dönük · bu kayıttaki en karakteristik hareket",
      width: 900,
      height: 1350,
      caption: "Tribün",
    },
    {
      id: "gallery-5",
      src: `${BASE}/galeri-5.jpg`,
      alt: "Takım arkadaşlarıyla",
      placeholder: true,
      hint: "Yatay · takım arkadaşlarını yönlendirirken · konuşma anı",
      width: 1200,
      height: 900,
      caption: "Orta saha",
    },
    {
      id: "gallery-6",
      src: `${BASE}/galeri-6.jpg`,
      alt: "Antrenman",
      placeholder: true,
      hint: "Kare ya da yatay · antrenman · gündüz ışığı",
      width: 1000,
      height: 1000,
      caption: "Antrenman",
    },
    {
      id: "gallery-7",
      src: `${BASE}/galeri-7.jpg`,
      alt: "Kupa gecesi",
      placeholder: true,
      hint: "Dikey · kupa gecesi · konfeti ya da meşale ışığı",
      width: 1000,
      height: 1400,
      caption: "Kupa",
    },
  ],

  /**
   * Bebas'ın skorboard kondansesi, kadrajı yaran kinetik hero ve yatay tarama
   * imzası. Ritim sıkışık, zemin dokusuz: bu sayfa nefes almıyor, tempo tutuyor.
   * Bölüm sırası kariyerle açılıyor — hikâyeden önce nereden geçtiği geliyor.
   */
  design: {
    voice: "condensed",
    hero: "kinetic",
    signature: "scan",
    rhythm: "tight",
    texture: "clean",
    order: ["kariyer", "hikaye", "istatistik", "geceler", "anlar", "galeri"],
  },
};
