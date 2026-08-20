import type { MediaCredit } from "../football-media";

/**
 * Salon 06 · Futbol — FUTBOLCU DEFTERİNİN TİP SÖZLEŞMESİ.
 *
 * ── NEDEN AYRI DOSYA (20 Ağustos 2026) ───────────────────────────────────
 * Defter tek dosyayken (`favourite-players.ts`) tip sözleşmesi ve tek kayıt
 * yan yana duruyordu ve bu, bir kayıt varken doğru karardı. Yirmi iki kayıt
 * eklenirken aynı düzen iki ayrı şeyi birden bozuyor:
 *
 *   1. BOYUT — Icardi'nin tek kaydı 310 satır. Yirmi üç kayıt tek dosyada
 *      6.500 satır eder; bir oyuncunun tek cümlesini değiştirmek için o
 *      dosyanın tamamını açmak gerekir.
 *   2. ÇAKIŞMA — kayıtlar aynı dizinin içindeyken iki kişi (ya da iki ajan)
 *      iki farklı oyuncuya aynı anda yazamaz; aynı satır aralığına düşerler.
 *
 * Bu yüzden defter bölündü: her oyuncu `players/<slug>.ts` içinde KENDİ
 * dosyasında, sözleşme burada, kayıt defteri `players/index.ts` içinde.
 * `favourite-players.ts` hâlâ dışarıya bakan yüz — hiçbir bileşenin import
 * satırı değişmedi.
 *
 * ── YENİ FUTBOLCU EKLERKEN ───────────────────────────────────────────────
 *   1. `public/assets/players/<slug>/` klasörünü aç (boş olabilir).
 *   2. `players/<slug>.ts` dosyasını aç, bir `FavouritePlayer` dışa aktar.
 *   3. `players/index.ts` içindeki listeye ekle.
 *   4. Görseli olmayan her yuvayı `placeholder: true` bırak.
 *   5. Başka hiçbir yere dokunma. Rota, kart, profil, renk, küratör yuvaları
 *      kendiliğinden geliyor.
 *
 * ── GÖRSEL YUVALARI (SLOT) ───────────────────────────────────────────────
 * Her görsel bir `PlayerImageSlot` ve her yuvanın KARARLI bir `id`si var.
 * Küratör modu bu id üzerinden çalışıyor: yüklenen dosya id'ye bağlanıyor.
 * id'yi değiştirmek küratörün o yuvaya yaptığı yüklemeyi koparır — yeniden
 * adlandırma yapma.
 */

// ---------------------------------------------------------------------------
// Görsel yuvası
// ---------------------------------------------------------------------------

export interface PlayerImageSlot {
  /**
   * Kararlı kimlik. Küratör düzenlemesinin ve kalıcı kod parçacığının
   * anahtarı. Sayfada benzersiz olmalı.
   */
  id: string;
  /**
   * Yuvanın SAHİBİ — veritabanındaki `playerSlug` sütunu.
   *
   * Yazılmazsa sayfanın varsayılan sahibi geçerli. Hub sayfasında ikisi bir
   * arada duruyor: sayfanın kendi yuvaları (`futbol-hub`) ve defterdeki
   * futbolcuların kart yuvaları (her biri kendi slug değeriyle).
   */
  owner?: string;
  /**
   * Dosyanın olması GEREKEN yer. Yuva `placeholder` iken bu adres yalnızca
   * küratöre "dosyayı buraya koy" demek için duruyor, ağ isteği yapılmıyor.
   */
  src: string;
  alt: string;
  /**
   * ⚠️ `true` iken görsel İSTENMİYOR. Ziyaretçi TASARLANMIŞ BİR BOŞLUK
   * görüyor (kulüp renginde ışık + doku, tek harf yazı yok); küratör modunda
   * ise kadraj notu + dosya yolu + "FOTO EKLENECEK" iskelesi çiziliyor.
   * İkisinin ayrımı `PlayerImage` içinde, gerekçesi orada yazılı.
   *
   * Neden ağ isteği yapılmıyor: her sayfa açılışında 8-10 adet 404 üretmek
   * hem konsolu kirletir hem de tarayıcının bağlantı havuzunu boşa harcar.
   */
  placeholder?: boolean;
  /** Küratöre ne konacağını söyleyen kadraj notu — YALNIZCA küratör modunda görünür */
  hint?: string;
  width?: number;
  height?: number;
  credit?: MediaCredit | null;
  /** Işık kutusunda ve ızgarada görünen kısa künye */
  caption?: string;
}

/** Bölümün ışığını kuran renkler — kulübe göre değişiyor. */
export interface PlayerPalette {
  /** Sahnenin zemini — saf siyah DEĞİL, renkli bir gece */
  ink: string;
  /** Ana vurgu: isim, rakam, çizgi */
  accent: string;
  /** İkinci vurgu — kulüp renginin sıcak/koyu tarafı */
  warm: string;
  /** Spot ışığının rengi */
  glow: string;
  /** Neon kenar — az kullanılır */
  neon: string;
}

// ---------------------------------------------------------------------------
// Tasarım DNA'sı
// ---------------------------------------------------------------------------

/**
 * ══════════════════════════════════════════════════════════════════════════
 * TASARIM DNA'SI — SAYFALAR NEDEN BİRBİRİNE BENZEMİYOR
 *
 * Yirmi üç oyuncuya yirmi üç ayrı bileşen ağacı yazmak (bir ajan başına bir
 * tasarım) ölçüldü ve REDDEDİLDİ: küratör modu, yuva sistemi, `/en` rotası ve
 * erişilebilirlik yirmi üç kez yeniden yazılmak zorunda kalırdı ve hiçbiri
 * birleştirilemezdi. Tek bir düzeltmenin yirmi üç dosyaya elle taşınması
 * gerekirdi.
 *
 * Ama tek bileşen ağacı + tek palet de yetmiyor: yalnızca rengi değiştirmek
 * sayfaları "aynı şablonun renkli kopyaları" yapar. Kullanıcının istediği
 * şey açıkça bu değil.
 *
 * ÇÖZÜM: kompozisyonun kendisi de VERİ. Aşağıdaki beş eksen sayfanın
 * iskeletini değiştiriyor — hangi tipografi ailesi konuşuyor, hero nasıl
 * kuruluyor, bölümlerin arkasında hangi motif var, dikey ritim ne kadar
 * açık, zemin hangi dokuyu taşıyor ve bölümler hangi sırada geliyor.
 *
 * Kombinasyon sayısı 4 × 6 × 6 × 3 × 4 = 1.728. Yirmi üç oyuncuya benzersiz
 * bileşim düşüyor ve iki sayfa yan yana konduğunda aynı sayfanın iki hâli
 * gibi durmuyor.
 *
 * ⚠️ EKSEN EKLERKEN: önce buraya alan ekle, sonra bileşeni yaz. Ters sıra
 * defteri tutarsız bırakıyor (devir notu §3.4).
 * ══════════════════════════════════════════════════════════════════════════
 */

/**
 * Tipografik ses — sayfanın display ailesi.
 *
 * ⚠️ HİÇBİRİ YENİ FONT DOSYASI GETİRMİYOR. Dördü de `app/[locale]/layout.tsx`
 * içinde ZATEN tanımlı ve self-host: yeni bir aile eklemek her ziyaretçiye
 * fazladan indirme yazardı. Ses farkı ailenin kendisinden geliyor.
 *
 * - `poster`    Anton — stadyum tabelası ağırlığı, sıkışık kapital. Modern,
 *               golcü, patlayıcı oyuncular.
 * - `monument`  Cinzel — kitabe/anıt sesi, geniş harf aralığı. Efsaneler.
 * - `condensed` Bebas Neue — skorboard kondansesi, hız ve tempo.
 * - `editorial` Petrona — arşiv serifi, sakin otorite. Düşünen oyuncular.
 */
export type PlayerVoice = "poster" | "monument" | "condensed" | "editorial";

/**
 * Hero kompozisyonu — ilk ekranın iskeleti.
 *
 * - `sash`    Kadrajı çapraz kesen bant + taşan forma numarası (Icardi'nin
 *             imzası; formanın kendi geometrisi).
 * - `column`  Ortalanmış anıtsal sütun; ad üstte, portre altta, simetrik.
 * - `split`   Kadraj tam ortadan ikiye; solda tipografi bloğu, sağda portre.
 * - `frame`   Portre arşiv çerçevesi içinde, etrafında künye şeridi.
 * - `kinetic` Portre kadrajı yararak çıkıyor, arkada yön çizgileri/oklar.
 * - `stack`   Ad portrenin ÜSTÜNE biniyor; katmanlı poster dizilimi.
 */
export type PlayerHeroForm =
  | "sash"
  | "column"
  | "split"
  | "frame"
  | "kinetic"
  | "stack";

/**
 * İmza motifi — bölüm başlıklarının ve zeminin arkasındaki çizim.
 *
 * - `sash`  çapraz bant      - `arc`   parabol/yörünge yayı
 * - `grid`  teknik ızgara    - `rays`  projektör huzmeleri
 * - `scan`  yatay tarama     - `wave`  akışkan dalga
 */
export type PlayerSignature = "sash" | "arc" | "grid" | "rays" | "scan" | "wave";

/**
 * Dikey ritim — bölümler arası nefes.
 *
 * - `tight`     sıkışık, yoğun, savaşçı
 * - `open`      dengeli
 * - `cinematic` geniş nefes, sinematik boşluk
 */
export type PlayerRhythm = "tight" | "open" | "cinematic";

/**
 * Zemin dokusu.
 *
 * - `grain`   film graini (varsayılan gece)
 * - `archive` arşiv/sepya lekesi + tarama izi — efsaneler
 * - `clean`   dokusuz, keskin, modern
 * - `halo`    yumuşak ışık halkaları
 */
export type PlayerTexture = "grain" | "archive" | "clean" | "halo";

/** Sayfadaki bölümler. Sıra `design.order` ile değişiyor. */
export type PlayerSection =
  | "hikaye"
  | "kariyer"
  | "geceler"
  | "anlar"
  | "istatistik"
  | "galeri";

/** Bölüm sırası yazılmazsa bu geçerli. */
export const DEFAULT_SECTION_ORDER: PlayerSection[] = [
  "hikaye",
  "kariyer",
  "geceler",
  "anlar",
  "istatistik",
  "galeri",
];

export interface PlayerDesign {
  voice: PlayerVoice;
  hero: PlayerHeroForm;
  signature: PlayerSignature;
  rhythm: PlayerRhythm;
  texture: PlayerTexture;
  /**
   * Bölüm sırası. Yazılmazsa `DEFAULT_SECTION_ORDER`.
   *
   * ⚠️ Sağ kenardaki dikey bölüm rayı (`PlayerRoute`) bu diziden üretiliyor;
   * elle ikinci bir sıra tutulmuyor.
   */
  order?: PlayerSection[];
}

// ---------------------------------------------------------------------------
// Kayıt parçaları
// ---------------------------------------------------------------------------

/**
 * Kariyer durağı.
 *
 * `tone` durağın kendi ışığı: şerit ilerledikçe hat o renge dönüyor ve
 * parlaklığı artıyor. Sonuncu durak (`current`) hattın zirvesi.
 *
 * ⚠️ LACİVERT / KOYU MAVİ YASAK (devir notu §3.2). Rakip kulübün rengi ve
 * burası bir Galatasaray arşivi. Mavi formalı kulüpler (Inter, Chelsea,
 * Sampdoria, Napoli...) nötr taş tonuyla temsil ediliyor: `#8d8778`,
 * `#6d6455`, `#7b7365`. Bu kural kariyer duraklarının tamamı için geçerli.
 */
export interface CareerStop {
  id: string;
  years: string;
  club: string;
  country: string;
  /** Bu duraktan geriye kalan tek cümle */
  note: string;
  tone: string;
  matches: number | null;
  goals: number | null;
  image: PlayerImageSlot;
  /** Şeridin bu noktada zirveye çıkması (mevcut/son kulüp) */
  current?: boolean;
}

/** Unutulmaz gece. */
export interface UnforgettableNight {
  year: number;
  title: string;
  meta: string;
  line: string;
  image: PlayerImageSlot;
}

/** Küratörün kişisel notu. */
export interface PersonalNote {
  label: string;
  title: string;
  body: string;
}

/** İstatistik satırı — Bebas/Anton ile basılıyor. */
export interface StatEntry {
  key: string;
  label: string;
  value: string;
}

/**
 * İki istatistik kümesi.
 *
 * ── NEDEN İKİ KÜME ───────────────────────────────────────────────────────
 * "297 maç" bir kariyer toplamı, "98 maç" bir kulüp hikâyesi. İkisini aynı
 * satırda göstermek ikisini de anlamsızlaştırıyor. Sayfa varsayılan olarak
 * KULÜP kümesini açıyor (bu bir Galatasaray arşivi), armaya basınca kulüp
 * kümesi ışığını açıyor, "tüm zamanlar"a basınca kariyer toplamına geçiyor.
 */
export interface PlayerStats {
  club: {
    key: string;
    label: string;
    /** Kulüp arması — armaya tıklamak kulüp kümesini açıyor */
    crest: PlayerImageSlot;
    entries: StatEntry[];
    /** Kümenin altındaki tek cümle */
    note: string;
  };
  all: {
    label: string;
    entries: StatEntry[];
    note: string;
  };
}

// ---------------------------------------------------------------------------
// Kayıt
// ---------------------------------------------------------------------------

export interface FavouritePlayer {
  slug: string;
  name: string;
  /** Dev tipografi iki satıra bölünüyor */
  firstName: string;
  lastName: string;
  shirt: number | null;
  position: string;
  club: string;
  clubShort: string;
  country: string;
  countryCode: string;
  birthDate: string;
  birthPlace: string;
  height: string;
  weight: string;
  /** Kartın altındaki tek satır */
  tagline: string;
  /**
   * EFSANELER salonundaki lakap ("Aşk adamı").
   *
   * Favori futbolcu kartındaki `tagline` küratörün gözlemi; bu ise efsane
   * salonunun sesi — Hagi'nin "Karpatların Maradonası"nın karşılığı. Dolu
   * olan futbolcu efsaneler salonunda DA görünüyor ve iki kart da AYNI
   * sayfaya gidiyor; boş bırakılan yalnızca favori şeridinde kalıyor.
   */
  legendEpithet?: string;
  /**
   * Yalnızca efsaneler salonunda kullanılan dönem ("1955 — 1969").
   * Boşsa kart `career` dizisinin ilk ve son yılından üretiyor.
   */
  legendEra?: string;
  quote: string;
  /** Sayfanın sonundaki büyük alıntı */
  closingQuote: string;
  palette: PlayerPalette;
  /** Sayfanın iskeletini kuran eksenler — iki oyuncuda aynı bileşim yok */
  design: PlayerDesign;
  /**
   * Sayfanın tema müziği — `public/audio/...` altında.
   *
   * ⚠️ YAZILMAZSA SES DÜĞMESİ HİÇ BASILMIYOR. Kullanıcı kararı (20 Ağustos
   * 2026): müzik Icardi'ye özel; başka oyuncuya tema müziği eklenmeyecek.
   * Boş bir ses düğmesi çizmek "boş oda yasağını" (devir notu §7.5) ihlal
   * ederdi.
   */
  theme?: string;
  /** Hero'nun taşıyıcı görseli — dikey kadraj */
  hero: PlayerImageSlot;
  /** Hub sayfasındaki kart için (yatay/dikey fark etmez) */
  card: PlayerImageSlot;
  /** Hero künye şeridi: "FORVET / 9 / GALATASARAY" */
  badges: string[];
  /** Hero'nun alt künyesi */
  vitals: Array<{ label: string; value: string }>;
  storyTitle: [string, string];
  storyLede: string;
  story: string[];
  stats: PlayerStats;
  career: CareerStop[];
  nights: UnforgettableNight[];
  personal: PersonalNote[];
  gallery: PlayerImageSlot[];
}
