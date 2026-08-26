import type { LocalizedText } from "./types";

/**
 * Satoru Gojō — "İki Uç" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Görseller veritabanında — characterId 127691 kaydının ABILITY yuvaları,
 * `goj:*` anahtarlarıyla. Görsel bağlı değilse bölüm görselsiz ama AYAKTA
 * çizilir.
 *
 * ⚠️ 25 Ağustos 2026 itibarıyla JJK kadrosunun hiçbirinin veritabanımızda
 * görseli YOK (ölçüldü: `/anime/characters/images?ids=…` boş dizi). Yani bu
 * sayfa bugün AniList'in ~230 piksellik portresi dışında görselsiz çiziliyor
 * ve öyle tasarlandı: hiçbir bölüm görsele bağlı değil, yuvalar dolduğunda
 * bölümler kendiliğinden zenginleşir.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum (7 Aralık 1989), yaş (28), boy (190 cm), derece (özel sınıf), meslek
 * (jujutsu büyücüsü + öğretmen), bağlı olduğu yer (Tokyo Jujutsu Lisesi,
 * Gojō ailesi) ve teknik satırı (Rikugan + Muge­gen) AniList künyesinden
 * birebir alındı (karakter 127691, 25 Ağustos 2026). Kan grubu AniList'te
 * BOŞ — künye şeridinde de yok, uydurulmadı.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada iki replik tırnak içinde: 「天上天下唯我独尊」 (Toji'yle dövüşünde,
 * yeniden ayağa kalkarken) ve 「僕は最強だから」 (öğrencilerine söylediği,
 * serinin en çok dolaşan cümlesi). İkisi de kaynağıyla anılıyor. Emin
 * olunmayan hiçbir cümle tırnağa alınmadı — kalan her şey arşivin kendi
 * anlatımı olarak düz metin.
 *
 * ── TERMİNOLOJİ ──────────────────────────────────────────────────────────
 * Teknik adları serinin kendi yazımıyla: 無下限呪術 (Mugegen Jujutsu),
 * 六眼 (Rikugan), 術式順転「蒼」(Jun'ten "Ao"), 術式反転「赫」(Hanten "Aka"),
 * 虚式「茈」(Kyoshiki "Murasaki"), 領域展開 無量空処 (Muryōkūsho),
 * 反転術式 (Hanten Jujutsu). Türkçeleri arşivin kendi karşılıkları.
 */

export const GOJO_ID = 127691;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const GOJO_SITE_URL = "https://anilist.co/character/127691";

/**
 * Sergi görselleri — hepsi characterId 127691 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `goj:` önekli (kurator modu şartı).
 */
export const GOJO_IMAGE_KEYS = {
  hero: "goj:hero",
  limitless: "goj:mugegen",
  sixEyes: "goj:rikugan",
  domain: "goj:muryokusho",
  smallReverse: "goj:hanten",
  smallCurtain: "goj:tobari",
  smallStep: "goj:shunkan",
  smallBlindfold: "goj:megakushi",
  poleBlue: "goj:ao",
  poleRed: "goj:aka",
  polePurple: "goj:murasaki",
  fateBorn: "goj:fate-born",
  fateRiko: "goj:fate-riko",
  fateGeto: "goj:fate-geto",
  fateTeacher: "goj:fate-teacher",
  fateSeal: "goj:fate-seal",
  closing: "goj:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const GOJO_SLOT_LABELS: Record<string, LocalizedText> = {
  [GOJO_IMAGE_KEYS.hero]: {
    tr: "Hero — gözbağlı Gojō, figür sağda, kadrajın çoğu boşluk (16:9)",
    en: "Hero — blindfolded Gojō, figure right, mostly empty frame (16:9)",
  },
  [GOJO_IMAGE_KEYS.limitless]: {
    tr: "Mugegen — uzanan elin durduğu nokta, aradaki boşluk görünür",
    en: "Limitless — the hand stopping short, the gap visible",
  },
  [GOJO_IMAGE_KEYS.sixEyes]: {
    tr: "Rikugan — açık mavi gözler, yakın çekim",
    en: "Six Eyes — the open blue eyes, close crop",
  },
  [GOJO_IMAGE_KEYS.domain]: {
    tr: "Muryōkūsho — alan açılırken, beyaz boşluk ve akan bilgi",
    en: "Unlimited Void — the domain opening, white space and streaming data",
  },
  [GOJO_IMAGE_KEYS.smallReverse]: {
    tr: "Ters akış — kendi üstünde iyileşme anı",
    en: "Reversed technique — the moment of self-healing",
  },
  [GOJO_IMAGE_KEYS.smallCurtain]: {
    tr: "Perde inerken — mor gökyüzü, şehrin üstü",
    en: "The curtain descending — purple sky over the city",
  },
  [GOJO_IMAGE_KEYS.smallStep]: {
    tr: "Anlık yer değiştirme — iki kare arasındaki boşluk",
    en: "Instant movement — the gap between two frames",
  },
  [GOJO_IMAGE_KEYS.smallBlindfold]: {
    tr: "Gözbağı — bant, yakın çekim",
    en: "The blindfold — the band, close crop",
  },
  [GOJO_IMAGE_KEYS.poleBlue]: {
    tr: "蒼 — çeken uç, her şeyin merkeze düştüğü an",
    en: "Blue — the attracting pole, everything falling inward",
  },
  [GOJO_IMAGE_KEYS.poleRed]: {
    tr: "赫 — iten uç, patlamanın ilk karesi",
    en: "Red — the repelling pole, the first frame of the blast",
  },
  [GOJO_IMAGE_KEYS.polePurple]: {
    tr: "茈 — iki ucun çarpıştığı yerdeki mor iz",
    en: "Purple — the violet trace where the two poles collide",
  },
  [GOJO_IMAGE_KEYS.fateBorn]: {
    tr: "1989 — doğumuyla dünyanın dengesini bozan çocuk",
    en: "1989 — the child whose birth shifted the balance",
  },
  [GOJO_IMAGE_KEYS.fateRiko]: {
    tr: "Yıldız Kabı görevi — Toji'nin karşısında, on altı yaşında",
    en: "The Star Plasma Vessel mission — facing Toji, at sixteen",
  },
  [GOJO_IMAGE_KEYS.fateGeto]: {
    tr: "Getō'nun ayrılışı — geceleyin karşı karşıya iki silüet",
    en: "Getō's departure — two silhouettes facing each other at night",
  },
  [GOJO_IMAGE_KEYS.fateTeacher]: {
    tr: "Öğretmen yılları — sınıfın önünde, üç öğrenci",
    en: "The teaching years — in front of the class, three students",
  },
  [GOJO_IMAGE_KEYS.fateSeal]: {
    tr: "Shibuya — kapanan küp, mühürlenme anı",
    en: "Shibuya — the closing cube, the moment of sealing",
  },
  [GOJO_IMAGE_KEYS.closing]: {
    tr: "Kapanış — boş bir gök, tek bir figür, düşük kontrast",
    en: "Closing — an empty sky, a single figure, low contrast",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const GOJO_IDENTITY = {
  name: "Satoru Gojō",
  nativeName: "五条悟",
  /** Hero filigranı — dekoratif (aria-hidden): 無下限 = sınırsız */
  watermark: "無下限",
  house: {
    tr: "Gojō Ailesi · Tokyo Jujutsu Lisesi",
    en: "The Gojō Family · Tokyo Jujutsu High",
  },
  epigraph: {
    tr: "Dört yüz yıldır ikisini birden taşıyan ilk kişi: gören göz ve durduran el.",
    en: "The first in four hundred years to carry both: the eye that sees and the hand that stops.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Born" },
      value: { tr: "7 Aralık 1989", en: "7 December 1989" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "28", en: "28" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "190 cm", en: "190 cm" },
    },
    {
      label: { tr: "Derece", en: "Grade" },
      value: { tr: "Özel sınıf büyücü", en: "Special grade sorcerer" },
    },
    {
      label: { tr: "Teknik", en: "Cursed technique" },
      value: { tr: "Mugegen · Rikugan", en: "Limitless · Six Eyes" },
    },
    {
      label: { tr: "İşi", en: "Occupation" },
      value: { tr: "Büyücü ve öğretmen", en: "Sorcerer and teacher" },
    },
  ],
} as const;

/** Kan grubu AniList künyesinde BOŞ — bilerek listeye alınmadı. */
export const GOJO_MISSING_NOTE: LocalizedText = {
  tr: "Kan grubu künyede kayıtlı değil; bu yüzden şeritte de yok.",
  en: "Blood type is not recorded in the dossier, so it is absent here too.",
};

/* ── Mod düğmesi: gözbağı ───────────────────────────────────────────────── */

export const GOJO_BLINDFOLD_TEXT = {
  enter: { tr: "Gözbağını çöz", en: "Remove the blindfold" },
  exit: { tr: "Gözbağını tak", en: "Put the blindfold back" },
  hint: {
    tr: "Rikugan açık: sayfadaki her ölçü artık okunuyor.",
    en: "Six Eyes open: every measurement on the page is now legible.",
  },
  readoutLabel: { tr: "Okuma", en: "Readout" },
} as const;

export const GOJO_HERO = {
  lede: {
    tr: "Gojō'nun gücü bir vuruşta değil, bir MESAFEDE duruyor. Mugegen ona ulaşmak isteyen her şeyin arasına sonsuz sayıda bölünebilen bir aralık koyuyor; el uzanıyor, yaklaşıyor, hiç değmiyor. Rikugan ise o aralığı ölçüyor: dünyayı sayı olarak görüyor ve bir tekniği israfsız çalıştırmasını sağlıyor. Sayfanın tamamı bu iki şeyin üstüne kurulu — ölçen göz ve değdirmeyen boşluk.",
    en: "Gojō's power sits not in a blow but in a DISTANCE. Limitless places an infinitely divisible gap between him and anything reaching for him; the hand extends, closes in, never lands. Six Eyes measures that gap: it renders the world as numbers and lets him run a technique with no waste. This page is built on those two things — the measuring eye and the untouchable space.",
  },
  portraitAlt: {
    tr: "Satoru Gojō — arşivin yüklediği portre",
    en: "Satoru Gojō — portrait uploaded by the archive",
  },
  portraitAltFallback: {
    tr: "Satoru Gojō — AniList künye portresi",
    en: "Satoru Gojō — AniList dossier portrait",
  },
  bandCaption: {
    tr: "Bant bir engel değil bir kısıtlama: Rikugan sürekli açık kaldığında yorulan şey göz değil, adamın kendisi.",
    en: "The band is not a barrier but a restraint: what tires under a constantly open Six Eyes is not the eye but the man.",
  },
} as const;

export const GOJO_ALT = {
  companionSuffix: { tr: "portresi", en: "portrait" },
} as const;

export const GOJO_CRUMB = {
  series: { tr: "Jujutsu Kaisen", en: "Jujutsu Kaisen" },
} as const;

export const GOJO_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "Dossier" },
    lede: {
      tr: "AniList kaydından birebir; boşları doldurulmadı.",
      en: "Taken verbatim from the AniList record; blanks left blank.",
    },
  },
  arts: {
    title: { tr: "Üç sütun", en: "Three pillars" },
    lede: {
      tr: "Gojō'nun elindeki her şey bu üçünden birinin sonucudur.",
      en: "Everything in Gojō's hands follows from one of these three.",
    },
  },
  tools: {
    title: { tr: "Dört ayrıntı", en: "Four details" },
    lede: {
      tr: "Büyük tekniklerin gölgesinde kalan, ama sahneyi belirleyen şeyler.",
      en: "Overshadowed by the big techniques, yet they decide the scene.",
    },
  },
  poles: {
    title: { tr: "İki uç", en: "Two poles" },
    lede: {
      tr: "Yuvaları doldur ve çarpıştır. Aynı uç iki kez hiçbir şey yapmaz; ancak zıt iki uç bir üçüncüsünü doğurur.",
      en: "Fill the slots and collide them. The same pole twice does nothing; only two opposite poles give birth to a third.",
    },
  },
  fate: {
    title: { tr: "Beş durak", en: "Five stops" },
    lede: {
      tr: "En güçlü olmak bir başlangıç değil, taşınan bir yük.",
      en: "Being the strongest is not a starting point but a weight carried.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "Ölçmeyi bırakınca geriye kalan.",
      en: "What remains once the measuring stops.",
    },
  },
} as const;

/* ── Üç sütun ───────────────────────────────────────────────────────────── */

export interface GojoArt {
  key: string;
  name: string;
  kanji: string;
  reading: string;
  /** Rikugan modunda görünen ölçü satırı — sayfanın "okuma" katmanı */
  readout: LocalizedText;
  turkish: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
  imageKey: string;
}

export const GOJO_ARTS: GojoArt[] = [
  {
    key: "limitless",
    name: "Mugegen Jujutsu",
    kanji: "無下限呪術",
    reading: "むげんじゅじゅつ",
    readout: {
      tr: "aralık → 1/2 → 1/4 → 1/8 → … → 0'a varmaz",
      en: "gap → 1/2 → 1/4 → 1/8 → … → never reaches 0",
    },
    turkish: { tr: "Sınırsız", en: "Limitless" },
    tagline: {
      tr: "Aradaki mesafeyi sonsuza böler.",
      en: "It divides the intervening distance forever.",
    },
    text: {
      tr: "Gojō'nun bedeniyle ona yaklaşan şey arasındaki uzaklığı sürekli ikiye bölen bir alan. Yumruk yolun yarısını alır, kalanın yarısını alır, kalanın yarısını alır — adım sayısı sonsuz olduğu için temas hiç gerçekleşmez. Saldıran taraf bunu bir duvara çarpmak gibi değil, hiç varmamak gibi yaşar. Ailenin dört yüz yıldır aktardığı miras budur.",
      en: "A field that keeps halving the distance between Gojō's body and whatever approaches it. The fist covers half the way, then half of what is left, then half again — the number of steps is infinite, so contact never occurs. The attacker experiences it not as hitting a wall but as never arriving. This is the inheritance the family has passed down for four hundred years.",
    },
    traits: [
      { tr: "Sürekli açık", en: "Always on" },
      { tr: "Nötr hâl: değdirmez", en: "Neutral state: no contact" },
      { tr: "Miras teknik", en: "Inherited technique" },
    ],
    imageKey: GOJO_IMAGE_KEYS.limitless,
  },
  {
    key: "sixeyes",
    name: "Rikugan",
    kanji: "六眼",
    reading: "りくがん",
    readout: {
      tr: "israf → 0 · her lanet enerjisi zerresi sayılıyor",
      en: "waste → 0 · every mote of cursed energy counted",
    },
    turkish: { tr: "Altı Göz", en: "Six Eyes" },
    tagline: {
      tr: "Dünyayı miktar olarak görür.",
      en: "It sees the world as quantity.",
    },
    text: {
      tr: "Rikugan bir güç değil bir ölçü aleti. Taşıyıcısı lanet enerjisini bir bulut olarak değil, sayılabilir bir madde olarak görür: kimin ne kadarı var, hangi teknik ne kadar tüketiyor, bir hamlenin bedeli tam olarak ne. Mugegen'in devamlı açık kalabilmesinin sebebi bu — tekniğin maliyeti sıfıra yakın tutuluyor. Bir kişide iki kabiliyetin birden bulunması dört asırda bir görülüyor.",
      en: "Six Eyes is not a power but an instrument. Its bearer sees cursed energy not as a haze but as countable matter: who holds how much, what a technique consumes, the exact price of a move. This is why Limitless can stay permanently open — the technique's cost is held near zero. Both abilities appearing in one person happens once in four centuries.",
    },
    traits: [
      { tr: "Dört yüz yılda bir", en: "Once in four centuries" },
      { tr: "Sıfıra yakın maliyet", en: "Near-zero cost" },
      { tr: "Yorulan göz, bantla dinlenir", en: "A tiring eye, rested by the band" },
    ],
    imageKey: GOJO_IMAGE_KEYS.sixEyes,
  },
  {
    key: "domain",
    name: "Muryōkūsho",
    kanji: "無量空処",
    reading: "むりょうくうしょ",
    readout: {
      tr: "girenin beyni: sonsuz bilgi · süre 0.2 sn · hareket yok",
      en: "the entrant's mind: infinite information · 0.2 s · no motion",
    },
    turkish: { tr: "Ölçüsüz Boşluk", en: "Unlimited Void" },
    tagline: {
      tr: "Kimseyi öldürmez; herkesi durdurur.",
      en: "It kills no one; it stops everyone.",
    },
    text: {
      tr: "Alan açılımı bir tekniği kapalı bir mekâna dönüştürüyor. Muryōkūsho içeri gireni yaralamaz — ona sonsuz miktarda bilgi verir. Zihin bir adım atmak için gereken kararı bile veremez hâle gelir; dışarıda saniyenin küçük bir kesri geçerken içeride sonsuz bir şimdi yaşanır. Alanın açık kaldığı süre kısadır, ama bir dövüşü bitirmeye fazlasıyla yeter.",
      en: "A domain expansion turns a technique into a sealed space. Unlimited Void does not wound whoever enters — it hands them infinite information. The mind can no longer even reach the decision to take a step; outside, a fraction of a second passes, inside an endless present is lived. The domain holds only briefly, but that is more than enough to end a fight.",
    },
    traits: [
      { tr: "Hasarsız", en: "Non-damaging" },
      { tr: "Toplu etki", en: "Affects a crowd" },
      { tr: "Yeniden açılabilir", en: "Can be redeployed" },
    ],
    imageKey: GOJO_IMAGE_KEYS.domain,
  },
];

/* ── Dört ayrıntı ───────────────────────────────────────────────────────── */

export interface GojoDetail {
  key: string;
  name: LocalizedText;
  kanji: string;
  note: LocalizedText;
  readout: LocalizedText;
  imageKey: string;
  companionId?: number;
  companionName?: string;
  companionRole?: LocalizedText;
}

export const GOJO_DETAILS: GojoDetail[] = [
  {
    key: "reverse",
    name: { tr: "Ters akış", en: "Reversed technique" },
    kanji: "反転術式",
    note: {
      tr: "Lanet enerjisinin iki akımını çarpıştırıp pozitif enerji üretmek. Gojō bunu on altı yaşında, öldükten sonra kendi bedeninde çözdü; o günden sonra kendini iyileştirebiliyor.",
      en: "Colliding two currents of cursed energy to produce positive energy. Gojō worked it out at sixteen, in his own body, after dying; from that day he can heal himself.",
    },
    readout: { tr: "negatif × negatif = pozitif", en: "negative × negative = positive" },
    imageKey: GOJO_IMAGE_KEYS.smallReverse,
  },
  {
    key: "curtain",
    name: { tr: "Perde", en: "The curtain" },
    kanji: "帳",
    note: {
      tr: "Bir bölgeyi sıradan insanların gözünden ve ayağından ayıran mor kubbe. Gojō'nun kendisi kadar, onu tuzağa düşürmek isteyenlerin de aleti — Shibuya'da perde ona karşı kuruldu.",
      en: "A violet dome that cuts a district off from ordinary eyes and feet. As much a tool of Gojō's as of those who would trap him — at Shibuya the curtain was raised against him.",
    },
    readout: { tr: "içerisi kapalı · dışarısı habersiz", en: "inside sealed · outside unaware" },
    imageKey: GOJO_IMAGE_KEYS.smallCurtain,
  },
  {
    key: "step",
    name: { tr: "Anlık yer değiştirme", en: "Instant movement" },
    kanji: "瞬間移動",
    note: {
      tr: "Mugegen kendi üstüne uygulandığında mesafe kalkıyor. Rakip iki kare arasında adamın yer değiştirdiğini görüyor; arada bir yürüyüş yok, yalnızca bir eksik kare var.",
      en: "Applied to himself, Limitless removes the distance. The opponent sees the man relocate between two frames; there is no walk in between, only a missing frame.",
    },
    readout: { tr: "kat edilen yol = tanımsız", en: "distance travelled = undefined" },
    imageKey: GOJO_IMAGE_KEYS.smallStep,
  },
  {
    key: "blindfold",
    name: { tr: "Gözbağı", en: "The blindfold" },
    kanji: "目隠し",
    note: {
      tr: "Sürekli ölçen bir göz sürekli yorulur. Bant, Rikugan'ın gelen bilgi akışını kısıyor ve adama gün boyu dayanabileceği bir dinlenme veriyor. Yani bir zayıflık değil, bir bakım.",
      en: "An eye that measures without pause tires without pause. The band throttles the inbound stream of Six Eyes and gives the man a rest he can sustain all day. Not a weakness — maintenance.",
    },
    readout: { tr: "gelen veri kısılmış · yorgunluk düşüyor", en: "input throttled · fatigue falling" },
    imageKey: GOJO_IMAGE_KEYS.smallBlindfold,
  },
];

/* ── İki uç: sayfanın kalbi ─────────────────────────────────────────────── */

export type GojoPoleKey = "blue" | "red";

export interface GojoPole {
  key: GojoPoleKey;
  kanji: string;
  name: string;
  reading: string;
  turkish: LocalizedText;
  sign: LocalizedText;
  text: LocalizedText;
  imageKey: string;
}

export const GOJO_POLES: GojoPole[] = [
  {
    key: "blue",
    kanji: "蒼",
    name: "Jun'ten «Ao»",
    reading: "じゅんてん・あお",
    turkish: { tr: "Düz akış — Mavi", en: "Forward flow — Blue" },
    sign: { tr: "çeker", en: "attracts" },
    text: {
      tr: "Mugegen'i düz yönde zorlamak bir eksiklik noktası yaratıyor: o noktadaki boşluk kapanmak istiyor ve çevresindeki her şeyi kendine çekiyor. Duvarlar, hava, insanlar — hepsi tek bir yere doğru düşüyor.",
      en: "Forcing Limitless forward creates a point of deficit: the void there wants to close and pulls everything around it inward. Walls, air, people — all of it falls toward a single place.",
    },
    imageKey: GOJO_IMAGE_KEYS.poleBlue,
  },
  {
    key: "red",
    kanji: "赫",
    name: "Hanten «Aka»",
    reading: "はんてん・あか",
    turkish: { tr: "Ters akış — Kırmızı", en: "Reversed flow — Red" },
    sign: { tr: "iter", en: "repels" },
    text: {
      tr: "Aynı tekniğin tersi bir fazlalık noktası yaratıyor: boşluk taşıyor ve çevresine boşalıyor. Mavi'nin topladığı şeyi Kırmızı dağıtıyor; ikisi aynı tekniğin iki yönü.",
      en: "The same technique reversed creates a point of surplus: the void overflows and discharges outward. What Blue gathers, Red disperses; both are directions of a single technique.",
    },
    imageKey: GOJO_IMAGE_KEYS.poleRed,
  },
];

export const GOJO_MERGE = {
  kanji: "茈",
  name: "Kyoshiki «Murasaki»",
  reading: "きょしき・むらさき",
  turkish: { tr: "Hayalî teknik — Mor", en: "Imaginary technique — Purple" },
  text: {
    tr: "Çeken uçla iten ucu aynı noktada buluşturmak var olmayan bir şeyi doğuruyor: iki teknik birbirini yok etmiyor, aradaki çarpışma üçüncü bir teknik hâline geliyor. Yolu üstünde kalan hiçbir şey yok olmuyor — silinip gidiyor.",
    en: "Bringing the attracting pole and the repelling pole together at one point gives birth to something that does not exist: the two techniques do not cancel, their collision becomes a third technique. Nothing on its path is destroyed — it is erased.",
  },
  imageKey: GOJO_IMAGE_KEYS.polePurple,
} as const;

export const GOJO_POLE_UI = {
  slotsLabel: { tr: "Yuvalar", en: "Slots" },
  slotA: { tr: "Birinci yuva", en: "First slot" },
  slotB: { tr: "İkinci yuva", en: "Second slot" },
  empty: { tr: "boş", en: "empty" },
  pickLabel: { tr: "Uç seç", en: "Pick a pole" },
  clear: { tr: "Yuvaları boşalt", en: "Clear the slots" },
  collide: { tr: "Çarpıştır", en: "Collide" },
  fieldLabel: {
    tr: "Ölçüm alanı — seçilen uçlar burada buluşuyor",
    en: "The measuring field — the chosen poles meet here",
  },
  keyboardHint: {
    tr: "Uçları düğmelerle yerleştir; iki yuva dolduğunda çarpıştır düğmesi açılır.",
    en: "Place the poles with the buttons; the collide button unlocks when both slots are full.",
  },
  statusIdle: {
    tr: "Yuvalar bekliyor.",
    en: "The slots are waiting.",
  },
  statusHalf: {
    tr: "Tek uç yüklü. İkinci yuva boş olduğu sürece alanda yalnızca bir yön var.",
    en: "One pole loaded. While the second slot is empty the field has only one direction.",
  },
  statusSame: {
    tr: "Aynı uç iki kez. İki yön de aynı olduğu için alan dengede kalıyor ve hiçbir şey doğmuyor.",
    en: "The same pole twice. Both directions match, so the field stays balanced and nothing is born.",
  },
  statusReady: {
    tr: "Zıt iki uç yüklü. Çarpıştırılabilir.",
    en: "Two opposite poles loaded. Ready to collide.",
  },
  statusDone: {
    tr: "Çarpışma gerçekleşti: ortada üçüncü teknik var.",
    en: "The collision happened: a third technique stands at the centre.",
  },
  again: { tr: "Yeniden kur", en: "Set it up again" },
  resultLabel: { tr: "Sonuç", en: "Result" },
} as const;

/* ── Beş durak ──────────────────────────────────────────────────────────── */

export interface GojoFate {
  key: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: LocalizedText };
  /**
   * O durakta yanında duran kişi. Portresi VARSA çiziliyor; yoksa çip adla
   * kalıyor — bugün ikinci durum geçerli (JJK kadrosunun görseli yok).
   */
  kin?: { characterId: number; name: string; role: LocalizedText };
  imageKey: string;
}

export const GOJO_TIMELINE: GojoFate[] = [
  {
    key: "born",
    age: { tr: "1989 · doğum", en: "1989 · birth" },
    title: { tr: "Dengeyi bozan doğum", en: "The birth that broke the balance" },
    text: {
      tr: "Rikugan'la Mugegen'in aynı bedende buluşması dört yüz yıldır olmamıştı. Gojō'nun doğumu jujutsu dünyasının dengesini tek başına değiştirdi: o güne kadar üst kademeleri elinde tutan yapı, artık hesaba katmak zorunda olduğu bir çocukla uyanmıştı.",
      en: "Six Eyes and Limitless had not met in one body for four hundred years. Gojō's birth shifted the balance of the jujutsu world by itself: the structure that had held the upper rungs until then woke to a child it now had to account for.",
    },
    imageKey: GOJO_IMAGE_KEYS.fateBorn,
  },
  {
    key: "riko",
    age: { tr: "16 yaş", en: "age 16" },
    title: { tr: "Yıldız Kabı görevi", en: "The Star Plasma Vessel mission" },
    text: {
      tr: "Bir kızı korumakla görevlendirildi ve koruyamadı. Aynı görevde tekniği olmayan bir adam tarafından öldürüldü, sonra ters akışı kendi bedeninde çözüp ayağa kalktı. O gün iki şey birden öğrendi: ölebileceğini ve ölmeyi reddedebileceğini.",
      en: "He was assigned to protect a girl and failed. On the same mission he was killed by a man with no technique, then worked out the reversed flow in his own body and stood back up. He learned two things that day: that he could die, and that he could refuse to.",
    },
    quote: {
      text: { tr: "天上天下唯我独尊", en: "天上天下唯我独尊" },
      by: {
        tr: "Gojō — yeniden ayağa kalkarken",
        en: "Gojō — as he stands back up",
      },
    },
    kin: {
      characterId: 203015,
      name: "Riko Amanai",
      role: { tr: "Korumakla görevlendirildiği kız", en: "The girl he was assigned to protect" },
    },
    imageKey: GOJO_IMAGE_KEYS.fateRiko,
  },
  {
    key: "geto",
    age: { tr: "17 yaş", en: "age 17" },
    title: { tr: "Tek arkadaşın gidişi", en: "The only friend leaves" },
    text: {
      tr: "Aynı sınıftaki Suguru Getō, sıradan insanlara duyduğu nefretle okuldan koptu. Gojō onu durdurmadı. En güçlü olmanın ilk gerçek bedeli bu oldu: kendisiyle aynı ölçekte konuşabilen tek kişiyi kaybetti ve yerine kimse gelmedi.",
      en: "Suguru Getō, from the same class, broke with the school over his hatred of ordinary people. Gojō did not stop him. This was the first real price of being the strongest: he lost the one person who could speak at his scale, and no one replaced him.",
    },
    kin: {
      characterId: 133699,
      name: "Suguru Getou",
      role: { tr: "Sınıf arkadaşı ve tek dostu", en: "Classmate and only friend" },
    },
    imageKey: GOJO_IMAGE_KEYS.fateGeto,
  },
  {
    key: "teacher",
    age: { tr: "27–28 yaş", en: "age 27–28" },
    title: { tr: "Öğretmenliğe geçiş", en: "Turning teacher" },
    text: {
      tr: "Tek başına en güçlü olmanın bir şeyi düzeltmediğini görünce yöntemini değiştirdi: yukarıyı devirmek yerine aşağıyı büyütmeye başladı. Tokyo Jujutsu Lisesi'nde ders vermesinin sebebi bu — güçlü ve akıllı gençler yetiştirip yalnız kalmamak.",
      en: "Seeing that being the strongest alone fixed nothing, he changed method: instead of toppling the top he began raising the bottom. That is why he teaches at Tokyo Jujutsu High — to grow strong, clever young allies and stop being alone.",
    },
    kin: {
      characterId: 127212,
      name: "Yuuji Itadori",
      role: { tr: "Kanadı altına aldığı öğrenci", en: "The student he took under his wing" },
    },
    imageKey: GOJO_IMAGE_KEYS.fateTeacher,
  },
  {
    key: "seal",
    age: { tr: "28 yaş · Shibuya", en: "age 28 · Shibuya" },
    title: { tr: "Yenilmeden kaybetmek", en: "Losing without being beaten" },
    text: {
      tr: "Shibuya'da onu durduran şey daha güçlü bir rakip değildi; perde, rehineler ve doğru anda açılan bir kutu oldu. Dövüşerek alt edilemeyen adam, dövüşün dışına çıkarılarak devre dışı bırakıldı. Ölçen göz kapandığında dünyanın geri kalanı ilk kez kendi ölçüsüne kaldı.",
      en: "What stopped him at Shibuya was not a stronger opponent; it was a curtain, hostages and a box opened at the right moment. The man who could not be beaten in a fight was removed from the fight altogether. When the measuring eye closed, the rest of the world was left to its own measure for the first time.",
    },
    kin: {
      characterId: 126635,
      name: "Megumi Fushiguro",
      role: { tr: "Geride kalan öğrencisi", en: "The student left behind" },
    },
    imageKey: GOJO_IMAGE_KEYS.fateSeal,
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const GOJO_CLOSING = {
  quotes: [
    {
      text: { tr: "天上天下唯我独尊", en: "天上天下唯我独尊" },
      reading: {
        tr: "Göğün altında, yerin üstünde; yalnızca ben yüceyim.",
        en: "Throughout heaven and earth, I alone am the honoured one.",
      },
      by: { tr: "Satoru Gojō", en: "Satoru Gojō" },
      note: {
        tr: "On altı yaşında, öldükten sonra ayağa kalktığı anda.",
        en: "At sixteen, in the moment he stood up after dying.",
      },
    },
    {
      text: { tr: "僕は最強だから", en: "僕は最強だから" },
      reading: {
        tr: "Çünkü ben en güçlüyüm.",
        en: "Because I am the strongest.",
      },
      by: { tr: "Satoru Gojō", en: "Satoru Gojō" },
      note: {
        tr: "Öğrencilerine, defalarca — bir övünme değil, bir teminat olarak.",
        en: "To his students, again and again — not a boast but a guarantee.",
      },
    },
  ],
  motto: "無下限",
  mottoNote: {
    tr: "Mugegen — «alt sınırı olmayan». Adı bir büyüklük değil, bir bölünme anlatıyor: hiçbir mesafe sıfıra inmiyor.",
    en: "Mugegen — “without a lower limit”. The name describes not a magnitude but a division: no distance ever reaches zero.",
  },
  credit: {
    tr: "Künye, portre ve doğum bilgileri AniList'ten:",
    en: "Dossier, portrait and birth data from AniList:",
  },
  creditLink: {
    tr: "AniList · Satoru Gojou #127691",
    en: "AniList · Satoru Gojou #127691",
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   P00 · TEMELLER — "UNTOUCHABLE" sayfasının kabuk sözlüğü
   ══════════════════════════════════════════════════════════════════════════

   ⚠️ YUKARIDAKİ BLOKLARIN DURUMU. Bu dosyanın 39–662 satırları "İki Uç"
   kompozisyonunun (蒼+赫→茈 birleştirici) metni. O kompozisyon 26 Ağustos
   2026'da yerini "UNTOUCHABLE" sayfasına bırakmaya başladı ve bileşenleri
   kaldırıldı. Metin SİLİNMEDİ: künye (`GOJO_IDENTITY`), kader çizelgesi
   (`GOJO_TIMELINE`), teknik anlatımları (`GOJO_ARTS`) ve yuva etiketleri
   (`GOJO_SLOT_LABELS`) ölçülerek yazılmış, kaynaklı ve iki dilli — yeni
   bölümler bunları faz faz devralacak. Devralınmayanlar ilgili fazın
   sonunda temizlenir. Bir fazın işini yapmadan buradan bir şey silme.

   Bu bölümdeki metinler yalnızca KABUĞA ait: mod düğmesi, küratör yuvası
   ve klavye kısayolları. Bölüm metinleri kendi fazlarında eklenecek.

   Sözlük NEDEN JSON DEĞİL: BRIEF P00/11 `content/gojo/tr.json` + `en.json`
   istiyor, ama aynı brief "Itachi sayfasının i18n çözümünü incele ve aynı
   sözleşmeye uy" diyor ve ev sözleşmesi JSON kullanmıyor — 42 karakter
   sayfasının tamamı metni kodda, iki dilli `LocalizedText` çiftleri olarak
   tutuyor (AGENTS.md kural 1). Çakışmada brief'in kendi öncelik kuralı
   uygulandı: Itachi kazanır. Şema aynı şema, taşıyıcı farklı.
   ══════════════════════════════════════════════════════════════════════════ */

/** Sayfa kökündeki iki mod. Değer DOM'a `data-mode` olarak iniyor. */
export type GojoPageMode = "blindfold" | "sixeyes";

/**
 * Kabuk metinleri.
 *
 * Hiçbir dize bileşenin içine gömülmüyor (BRIEF · i18n): istemci adaları
 * bile bunları prop olarak, sunucuda `pick()` ile TEK dile indirilmiş
 * hâlde alıyor. Adaya sözlük göndermek gereksiz bayt olurdu.
 */
export const GOJO_UI = {
  /** Düğmenin sabit adı — moda göre DEĞİŞMEZ, yalnızca basılılığı değişir */
  modeLabel: {
    tr: "Altı Göz",
    en: "Six Eyes",
  },
  /** Yalnızca görsel durum yazısı; `aria-pressed` aynı bilgiyi taşıyor */
  modeOn: {
    tr: "açık",
    en: "on",
  },
  modeOff: {
    tr: "kapalı",
    en: "off",
  },
  /** Dokunmatikte CSS gizliyor */
  modeKeyHint: {
    tr: "S",
    en: "S",
  },
  /** Six Eyes kapalıyken gizli veri alanlarının maskesi */
  mask: {
    tr: "???",
    en: "???",
  },
} as const;

/** Küratör moduna ait yazılar — ziyaretçi bunları hiç görmüyor. */
export const GOJO_CURATOR = {
  /** Yükleme düğmesinin etiketi */
  upload: {
    tr: "Görsel bağla",
    en: "Attach image",
  },
  /** Manifesto panelinin durum satırı */
  missing: {
    tr: "EKSİK VARLIK",
    en: "MISSING ASSET",
  },
} as const;

/**
 * Klavye kısayolları — `sr-only` bir listede sunuluyor.
 *
 * BRIEF · erişilebilirlik: "Easter egg'lerin klavye ile keşfedilebilir bir
 * yolu var" ve "kısayollar `sr-only` bir listede tanımlıdır — ekran okuyucu
 * kullanıcısı için erişilemez içerik kalmaz."
 *
 * ⚠️ Liste sayfayla birlikte BÜYÜYECEK. Bir faz yeni bir kısayol eklerse
 * aynı fazda buraya da satırını ekler; kısayol var ama listede yoksa
 * erişilebilirlik şartı çiğnenmiş olur. Bugün yalnızca `S` var (P00);
 * `D` P05'te, `P` P11'de eklenecek.
 */
export const GOJO_SHORTCUTS = {
  title: {
    tr: "Bu sayfadaki klavye kısayolları",
    en: "Keyboard shortcuts on this page",
  },
  items: [
    {
      keys: "S",
      action: {
        tr: "Altı Göz modunu açar ve kapatır",
        en: "Toggles Six Eyes mode",
      },
    },
  ],
} as const;

/**
 * P00 temel panosunun metni.
 *
 * ⚠️ GEÇİCİ. P01 bu bölümün yerine hero'yu koyacak ve bu blok silinecek.
 * Sayfanın "boş ama hatasız" durduğu aşamada ziyaretçiye ve küratöre ne
 * olduğunu söylemek için var — sessiz bir boş sayfa, bozuk bir sayfadan
 * ayırt edilemez.
 */
export const GOJO_FOUNDATION = {
  title: {
    tr: "Temeller",
    en: "Foundations",
  },
  note: {
    tr: "Bu sayfa yeniden kuruluyor. Şu an yalnızca altyapı yerinde: iki modlu token sistemi, gizli veri katmanı ve küratör yuvası. Bölümler sırayla eklenecek.",
    en: "This page is being rebuilt. Only the foundations are in place: the dual-mode token system, the hidden data layer, and the curated image slot. Sections will be added in order.",
  },
  /** Gizli veri katmanının çalıştığını gösteren tek örnek alan */
  sampleLabel: {
    tr: "Lanetli enerji verimi",
    en: "Cursed energy efficiency",
  },
  sampleValue: {
    tr: "sınırsız",
    en: "limitless",
  },
} as const;

/**
 * P00'da TANIMLANAN GÖRSEL YUVASI YOK.
 *
 * `content/gojo/asset-manifest.json` bu yüzden boş dizi. Temel panosundaki
 * tek kadraj mevcut `goj:hero` anahtarını ödünç alıyor (kayıt zaten var,
 * yenisi açılmadı). Yuva kaydı P01'de `gojo.hero.primary` ile başlıyor;
 * her faz kendi yuvalarını manifestoya kendi sonunda ekliyor.
 *
 * Oranlar burada, tek yerde: `CuratedImage` oranı CSS'e `--slot-ratio`
 * olarak indiriyor ve yuva boşken de yer kaplıyor (CLS ≈ 0).
 */
export const GOJO_SLOT_ASPECT: Record<string, string> = {
  "goj:hero": "16 / 9",
};
