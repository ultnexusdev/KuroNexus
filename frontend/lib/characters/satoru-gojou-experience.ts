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
    {
      keys: "D",
      action: {
        tr: "Alan genişlemesi sekansını oynatır",
        en: "Plays the domain expansion sequence",
      },
    },
  ],
} as const;

/**
 * GÖRSEL YUVALARI HER BÖLÜMÜN KENDİ BLOĞUNDA.
 *
 * Her fazın yuvası o fazın sözlüğüyle birlikte duruyor (`GOJO_S01_SLOT`,
 * `GOJO_S02_SLOT`, …) ve üç şeyi birden taşıyor: anahtar, oran ve kadraj
 * tarifi. Merkezî bir oran haritası P00'da denendi ve BIRAKILDI — yuvayı
 * çizen bölüm ile oranı tanımlayan yer ayrı düştüğünde biri değişip
 * diğeri kalıyor, sonuç sessiz bir layout kayması oluyor.
 *
 * Manifesto (`content/gojo/asset-manifest.json`) bu blokların türevi:
 * her faz kendi yuvalarını faz sonunda oraya ekliyor.
 */

/* ══════════════════════════════════════════════════════════════════════════
   P01 · HERO

   Kompozisyon radyal ve merkezkaç: Gojō tam merkezde sabit, diğer HER ŞEY
   devasa bir negatif alanla köşelere itilmiş. Katman sırası derinden yüzeye
   — boşluk, bükülmüş tipografi, en üstte tamamen net Gojō.

   ⚠️ Metinlerin hiçbiri dekoratif değil. Dev başlık, Japonca satır ve
   tarama paneli sayfanın ilk ekranında OKUNAN içerik; bükülme yalnızca
   görsel katmanda oluyor, DOM karşılıkları düz duruyor.
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Dev display başlığı.
 *
 * Karakterin adı künyeden de geliyor (`detail.character.name`) ama hero'daki
 * dev yazı ONDAN BAĞIMSIZ: künye adı "Satoru Gojou" (AniList yazımı), buradaki
 * ise kompozisyonun parçası olan poster yazımı. İkisini ayırmak bilinçli —
 * künye değişirse poster bozulmasın.
 */
export const GOJO_S01_DISPLAY = "GOJO SATORU";

/**
 * Japonca atmosfer satırı: "O göz, her şeyi görüyor."
 *
 * ⚠️ ÇEVRİLMİYOR. Her iki dilde de aynı kalıyor ve `lang="ja"` ile
 * işaretleniyor (BRIEF · i18n). Çeviri değil, dokunun parçası.
 * Okunabilir karşılığı `sr-only` olarak ayrıca veriliyor — ekran okuyucu
 * kullanıcısı satırın ne dediğini bilmeli.
 */
export const GOJO_S01_JA = "その眼は、すべてを見ている。";

export const GOJO_S01 = {
  /** Japonca satırın okunabilir karşılığı — yalnızca ekran okuyucuya */
  jaGloss: {
    tr: "O göz, her şeyi görüyor.",
    en: "That eye sees everything.",
  },
  /** Display'in küçük kademesi */
  strongest: {
    tr: "EN GÜÇLÜ OLAN",
    en: "THE STRONGEST",
  },
  /**
   * Sağ üst köşedeki tarama çıktısı — ekran kenarına yapışık, JetBrains Mono.
   * Koordinat Shinjuku: hero yuvası o dönemin kadrajını istiyor.
   */
  coords: {
    line1: "35.6938°N 139.7034°E",
    line2: {
      tr: "SHINJUKU · GECE",
      en: "SHINJUKU · NIGHT",
    },
  },
} as const;

/**
 * Sağdaki veri paneli — kart DEĞİL, tarama çıktısı.
 *
 * Değerlerin tamamı AniList künyesinden (karakter 127691) ya da serinin
 * kendi terminolojisinden; uydurulan tek satır yok. Kan grubu künyede boş
 * olduğu için panelde de yok (`GOJO_MISSING_NOTE`).
 *
 * ⚠️ DURUM satırı kasıtlı olarak ARŞİV KAYDINI anlatıyor, karakterin
 * akıbetini değil: hero sayfanın ilk ekranı ve spoiler taşımamalı.
 */
export const GOJO_S01_SCAN = {
  title: {
    tr: "TARAMA",
    en: "SCAN",
  },
  rows: [
    {
      label: { tr: "DERECE", en: "GRADE" },
      value: { tr: "ÖZEL SINIF", en: "SPECIAL GRADE" },
    },
    {
      label: { tr: "BAĞLI", en: "AFFILIATION" },
      value: { tr: "TOKYO JUJUTSU LİSESİ", en: "TOKYO JUJUTSU HIGH" },
    },
    {
      label: { tr: "DOĞUM", en: "BIRTHDAY" },
      value: { tr: "07.12.1989", en: "07.12.1989" },
    },
    {
      label: { tr: "BOY", en: "HEIGHT" },
      value: { tr: "190 CM", en: "190 CM" },
    },
    {
      label: { tr: "TEKNİK", en: "CURSED TECHNIQUE" },
      value: { tr: "MUGEGEN · RIKUGAN", en: "LIMITLESS · SIX EYES" },
    },
    {
      label: { tr: "DURUM", en: "STATUS" },
      value: { tr: "KAYIT ETKİN", en: "RECORD ACTIVE" },
    },
  ],
  /**
   * Gizli katman — Six Eyes açılınca okunuyor.
   * BRIEF P01: "Bunlardan CURSED ENERGY EFFICIENCY alanı RevealedData ile
   * gizli katmanda."
   */
  hidden: {
    label: { tr: "LANETLİ ENERJİ VERİMİ", en: "CURSED ENERGY EFFICIENCY" },
    value: { tr: "İSRAF YOK", en: "ZERO WASTE" },
  },
} as const;

/**
 * Hero'nun görsel yuvası.
 *
 * ⚠️ Anahtar EV SÖZLEŞMESİNE göre `goj:` önekli: küratörün yüklediği görsel
 * karakter kaydının ABILITY yuvasına bu adla yazılıyor. Brief'in kendi
 * kimliği (`gojo.hero.primary`) manifestoda `brief` alanında kayıtlı —
 * ikisi arasındaki köprü orada, iki ad da izlenebilir kalıyor.
 */
export const GOJO_S01_SLOT = {
  key: "goj:hero",
  aspect: "3 / 4",
  spec: {
    tr: "Shinjuku dönemi · siyah gözbağlı · ön cepheden tam göğüs portresi · yüz hafif gölgeli · maskelenmiş şeffaf PNG · 4K+",
    en: "Shinjuku era · black blindfold · front-facing chest-up portrait · face lightly shadowed · masked transparent PNG · 4K+",
  },
  alt: {
    tr: "Satoru Gojō — gözbağlı, ön cepheden portre",
    en: "Satoru Gojō — blindfolded, front-facing portrait",
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   P02 · THE STRONGEST

   Asimetrik kompozisyon: solda masif metin bloğu, sağda Gojō'nun kadrajı.
   Aralarında GÖRÜNMEZ DİKEY DUVAR — INFINITY kuralının dikey varyantı.
   Hiçbir harf sağdaki kadraja giremiyor; duvara yaklaşan tipografi
   saydamlaşarak kesiliyor.

   ⚠️ Metin kesilse de OKUNUYOR: kesme yalnızca maske katmanında,
   DOM'daki paragraf bütün. Kaydırılan hiçbir cümle yarım değil.
   ══════════════════════════════════════════════════════════════════════════ */

export const GOJO_S02 = {
  /** Sağdan hizalı dev display başlığı */
  title: {
    tr: "EN GÜÇLÜ",
    en: "THE STRONGEST",
  },
  /**
   * Sayfa kenarında dikey (döndürülmüş) etiket, aşağıdan yukarıya.
   * JetBrains Mono; dekoratif değil, bölümün numarası ve adı.
   */
  edgeLabel: {
    tr: "02 · GENEL BAKIŞ",
    en: "02 · OVERVIEW",
  },
  /**
   * Karakter genel bakışı — üç paragraf.
   *
   * Kaynak disiplini dosyanın geri kalanıyla aynı: tırnak içine yalnızca
   * doğrulanmış replikler alınıyor, kalan her şey arşivin kendi anlatımı.
   * Burada tırnak YOK.
   */
  body: [
    {
      tr: "Gojō'yu en güçlü yapan şey bir vuruşun büyüklüğü değil, iki yeteneğin aynı kişide bulunması. Mugegen ona uzanan her şeyin arasına sonsuz bölünebilen bir aralık koyuyor; Rikugan ise o aralığı ve dünyanın geri kalanını sayı olarak okuyor. İkisi dört yüz yıldır ilk kez tek bir bedende birleşti ve bu, bir güç artışı değil bir KATEGORİ değişimi.",
      en: "What makes Gojō the strongest is not the size of a blow but the fact that two gifts landed in the same person. Limitless puts an infinitely divisible gap between him and anything reaching for him; Six Eyes reads that gap — and the rest of the world — as numbers. For the first time in four hundred years the two met in one body, and that is not an increase in power but a change of CATEGORY.",
    },
    {
      tr: "Sonucu şu: Gojō dövüşleri kazanmıyor, dövüşün mümkün olup olmadığı sorusunu kapatıyor. Gözbağı da bu yüzden bir engel değil bir kısıtlama — sürekli açık bir Rikugan'ın yorduğu şey göz değil, adamın kendisi. Bandı takan biri zayıflamıyor; kendini yavaşlatıyor.",
      en: "The consequence: Gojō does not win fights, he closes the question of whether a fight was ever possible. That is why the blindfold is a restraint and not a handicap — what a permanently open Six Eyes exhausts is not the eye but the man. Wearing the band does not weaken him; it slows him down on purpose.",
    },
    {
      tr: "Ve tam da bu yüzden yalnız. Bir düzenin tek bir kişiye bu kadar dayanması, o kişinin gücünden değil düzenin zayıflığından geliyor. Gojō'nun öğretmenliği bir yan iş değil, gördüğü sorunun kendi çözümü: kendisi kadar güçlü olmayan ama birlikte yeten bir kuşak yetiştirmek.",
      en: "And precisely because of that, he is alone. A system leaning this hard on one person says less about his strength than about the system's weakness. Gojō's teaching is not a side job but his own answer to the problem he sees: raise a generation that is not as strong as he is, yet together is enough.",
    },
  ],
  /**
   * Six Eyes açıldığında bu bölümde açılan ölçümler.
   * BRIEF P02: "en az 3 gizli veri alanı".
   *
   * ⚠️ Değerler NİTEL. Uydurma sayısal istatistik yazılmadı — serinin
   * hiçbir yerinde bu ölçüler sayıyla verilmiyor ve arşivin kuralı
   * emin olunmayanı yazmamak.
   */
  readings: [
    {
      label: { tr: "MUGEGEN DURUMU", en: "LIMITLESS STATE" },
      value: { tr: "SÜREKLİ ETKİN", en: "ALWAYS ON" },
    },
    {
      label: { tr: "TEKNİK GECİKMESİ", en: "TECHNIQUE LATENCY" },
      value: { tr: "YOK · PASİF SAVUNMA", en: "NONE · PASSIVE DEFENCE" },
    },
    {
      label: { tr: "RİKUGAN YÜKÜ", en: "SIX EYES LOAD" },
      value: { tr: "SÜREKLİ · BU YÜZDEN BANT", en: "CONSTANT · HENCE THE BAND" },
    },
  ],
} as const;

/**
 * P02'nin görsel yuvası.
 *
 * Kadraj sağdaki sütunun tamamını kaplıyor; dikey duvar bu kadrajın sol
 * kenarı. Oran bilerek dikey (2/3): duvarın yüksek olması gerekiyor.
 */
export const GOJO_S02_SLOT = {
  key: "goj:rikugan",
  aspect: "2 / 3",
  spec: {
    tr: "Hidden Inventory sonrası yetişkin dönem · 3/4 açı · kibirli gülümseme · yarım boy · keskin fokus · 4K",
    en: "Adult era after Hidden Inventory · three-quarter angle · arrogant smile · half body · sharp focus · 4K",
  },
  alt: {
    tr: "Satoru Gojō — yetişkin dönem, 3/4 açıdan yarım boy portre",
    en: "Satoru Gojō — adult era, three-quarter half-body portrait",
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   P03 · LIMITLESS

   Izgara tabanlı topoğrafik zemin. Halkalar merkeze yaklaştıkça sıklaşıyor
   ama merkeze ASLA ulaşmıyor — kalan mesafeyi her adımda yarıya bölen bir
   Zeno dizisi. Odak tamamen bu negatif alan tünelinde.

   ⚠️ Bu bölümde SCROLL HİJACK var. Hareket sözleşmesi kural 3 harfiyen
   uygulanıyor; güvenlik listesi `InfinityScroll.tsx` dosya başında.
   ══════════════════════════════════════════════════════════════════════════ */

export const GOJO_S03 = {
  title: {
    tr: "MUGEGEN",
    en: "LIMITLESS",
  },
  /** Başlığın altındaki tek satır — ızgaranın üstünde duruyor */
  subtitle: {
    tr: "Aradaki mesafe kapanmıyor",
    en: "The distance never closes",
  },
  /**
   * Gövde metni ızgara kutucuklarına DAĞITILIYOR (brief).
   *
   * ⚠️ Dağıtılmış hâli görsel; okunabilir karşılığı `srText` alanında tek
   * parça duruyor ve `sr-only` olarak basılıyor. BRIEF · erişilebilirlik:
   * "Gövde metni grid kutucuklarına dağıtılmış — `sr-only` düz metin
   * karşılığı ZORUNLU."
   */
  cells: [
    { tr: "Bir el uzanıyor.", en: "A hand reaches out." },
    { tr: "Aradaki mesafeyi yarıya böl.", en: "Halve the distance between." },
    { tr: "Sonra kalanı tekrar yarıya böl.", en: "Then halve what is left." },
    { tr: "Ve tekrar.", en: "And again." },
    { tr: "El hâlâ yaklaşıyor.", en: "The hand is still closing in." },
    { tr: "Sonsuz adım kaldı.", en: "Infinite steps remain." },
    { tr: "Hiç değmiyor.", en: "It never lands." },
  ],
  /** Dağıtılmış metnin düz karşılığı — ekran okuyucu ve arama motoru için */
  srText: {
    tr: "Bir el uzanıyor. Aradaki mesafeyi yarıya böl, sonra kalanı tekrar yarıya böl, ve tekrar. El hâlâ yaklaşıyor ama önünde her zaman sonsuz sayıda adım kalıyor. Hiç değmiyor. Mugegen bir kalkan değil; Gojō ile ona uzanan şey arasına sonsuz bölünebilen bir aralık koyan bir yakınsama. Duran şey saldırı değil, mesafenin kendisi.",
    en: "A hand reaches out. Halve the distance between, then halve what is left, and again. The hand keeps closing in, yet an infinite number of steps always remains ahead of it. It never lands. Limitless is not a shield; it is a convergence that places an infinitely divisible gap between Gojō and whatever reaches for him. What stops is not the attack but the distance itself.",
  },
  /**
   * Halka kesişimlerine düşen 9pt formüller.
   *
   * Gerçek matematik: geometrik seri ve limit gösterimi. Dekoratif bir
   * sözde-formül yazılmadı — sayfanın tezi zaten bu yakınsamanın kendisi.
   * Çevrilmiyor (matematik gösterimi, dil değil).
   */
  formulas: [
    "d₀ / 2ⁿ",
    "Σ 2⁻ⁿ = 1",
    "lim d → 0",
    "d > 0  ∀n",
    "1/2 + 1/4 + 1/8 …",
    "∄ n : d(n) = 0",
  ],
  /** Scroll kilidi sırasında ekranda beliren tek cümle */
  lockLine: {
    tr: "Gerçekten bana ulaşabileceğini mi sandın?",
    en: "Did you really think you could reach me?",
  },
  /** Kilit sırasında görünen çıkış ipucu — klavye kullanıcısı için */
  lockEscape: {
    tr: "Çıkmak için Esc",
    en: "Press Esc to break",
  },
} as const;

/**
 * P03'ün görsel yuvası — ızgaranın merkezinde, negatif alanın kenarında.
 *
 * ⚠️ Merkez BOŞ kalmak zorunda (Infinity kuralı). Bu kadraj merkeze
 * konmuyor; tünelin ağzında, halkaların dışında duruyor.
 */
export const GOJO_S03_SLOT = {
  key: "goj:mugegen",
  aspect: "1 / 1",
  spec: {
    tr: "İşaret ve orta parmağın uzatıldığı durdurma pozunun makro yakın çekimi · yalnızca eller · şeffaf zemin · 4K+",
    en: "Macro close-up of the stopping pose with index and middle finger extended · hands only · transparent background · 4K+",
  },
  alt: {
    tr: "Uzatılmış iki parmak — durdurma pozunun makro çekimi",
    en: "Two extended fingers — macro shot of the stopping pose",
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   P04 · CURSED TECHNIQUES

   Sayfa yatay üç şeride ayrılıyor: 蒼 Mavi / 赫 Kırmızı / 茈 Mor. Şeritler
   birbirine binmeye çalışıyor ama aradaki itici güç yüzünden yırtık siyah
   boşluklar kalıyor.

   ⚠️ ANLATININ TAMAMI `GOJO_POLES` ve `GOJO_MERGE` bloklarından geliyor
   (bu dosyanın üst yarısı) — orada ölçülerek yazılmış, terminolojisi
   serinin kendi yazımıyla. P04 onları DEVRALIYOR, yeniden yazmıyor.
   Buradaki blok yalnızca bölümün kendi kabuğunu ekliyor: teknik özellik
   matrisi ve etkileşim etiketleri.

   ── AÇIKLAMA METNİ HER ZAMAN AÇIK ────────────────────────────────────────
   Hiçbir açıklama etkileşimin arkasına saklanmıyor. Hover/tap/drag yalnızca
   bir gösteri; metin sunucudan tam geliyor. Reduced-motion şartı ("üç teknik
   de statik kart olarak sunulur, tüm açıklama metni açık") böylece
   VARSAYILAN durum oluyor, özel bir dal değil.
   ══════════════════════════════════════════════════════════════════════════ */

export const GOJO_S04 = {
  title: {
    tr: "LANETLİ TEKNİKLER",
    en: "CURSED TECHNIQUES",
  },
  /**
   * Teknik özellik matrisi — paragraf değil, kolonlu okuma.
   *
   * ⚠️ UYDURMA GÜÇ İSTATİSTİĞİ YOK. Seride bu tekniklerin çıktısı sayıyla
   * verilmiyor; buradaki "sayılar" ilişkisel gösterim: çeken uç −1, iten uç
   * +1, ikisinin çarpışması hayalî bir üçüncü teknik. Hem doğru hem de
   * bölümün tezini (zıtlık) taşıyor.
   */
  matrixLabels: {
    vector: { tr: "VEKTÖR", en: "VECTOR" },
    output: { tr: "ÇIKTI", en: "OUTPUT" },
    range: { tr: "MENZİL", en: "RANGE" },
    base: { tr: "TEMEL", en: "BASE" },
  },
  matrix: {
    blue: {
      vector: "−1",
      output: { tr: "çekim", en: "attraction" },
      range: { tr: "nokta", en: "point" },
      base: "無下限",
    },
    red: {
      vector: "+1",
      output: { tr: "itme", en: "repulsion" },
      range: { tr: "koni", en: "cone" },
      base: "無下限",
    },
    purple: {
      vector: "−1 ⊕ +1",
      output: { tr: "silme", en: "erasure" },
      range: { tr: "hat", en: "line" },
      base: "蒼 + 赫",
    },
  },
  /**
   * Şeritlerin outline dev başlıkları.
   *
   * `GOJO_POLES[].turkish` ("Düz akış — Mavi") künye satırı olarak doğru
   * ama ekranı kaplayan bir kontur başlık için fazla uzun. Bunlar onun
   * kısa hâli; ikisi de aynı şeritte, farklı ölçekte duruyor.
   */
  displays: {
    blue: { tr: "MAVİ", en: "BLUE" },
    red: { tr: "KIRMIZI", en: "RED" },
    purple: { tr: "MOR", en: "PURPLE" },
  },
  /** Etkileşim kabuğu — hiçbiri bilgi taşımıyor, hepsi yönlendirme */
  ui: {
    chargeLabel: { tr: "BİRLEŞİM", en: "FUSION" },
    /** Fare yolu: önce mavi, sonra kırmızı */
    chargeHint: {
      tr: "Önce 蒼, sonra 赫 üzerine gel — birleşim dolar.",
      en: "Hover 蒼 then 赫 — the fusion charges.",
    },
    /** Dokunmatik ve fare için ortak yol: iki küreyi birleştir */
    dragHint: {
      tr: "İki küreyi birbirine sürükle.",
      en: "Drag the two spheres together.",
    },
    /** Klavye yolu — etkileşim klavyeyle de keşfedilebilir olmak zorunda */
    keyHint: {
      tr: "Klavyeyle: küreleri ok tuşlarıyla yaklaştır.",
      en: "With a keyboard: move the spheres closer with the arrow keys.",
    },
    fired: {
      tr: "茈 — çarpışma gerçekleşti.",
      en: "茈 — the collision happened.",
    },
    reset: { tr: "Sıfırla", en: "Reset" },
    spherePull: { tr: "Çeken uç", en: "Attracting pole" },
    spherePush: { tr: "İten uç", en: "Repelling pole" },
  },
} as const;

/**
 * P04'ün iki görsel yuvası.
 *
 * Kutup görselleri (`goj:ao`, `goj:aka`, `goj:murasaki`) ZATEN tanımlı ve
 * şeritlerin içinde kullanılıyor; buradaki ikisi brief'in ayrıca istediği
 * makro kadrajlar.
 */
export const GOJO_S04_SLOTS = {
  handseal: {
    key: "goj:handseal",
    aspect: "16 / 9",
    spec: {
      tr: "Hollow Purple el mührünü birleştiren parmakların makro çekimi · 4K",
      en: "Macro shot of the fingers forming the Hollow Purple hand seal · 4K",
    },
    alt: {
      tr: "Hollow Purple el mührünü birleştiren parmaklar",
      en: "Fingers forming the Hollow Purple hand seal",
    },
  },
  silhouette: {
    key: "goj:silhouette",
    aspect: "3 / 4",
    spec: {
      tr: "İçinden ışık fışkıran karanlık silüet · yetişkin Gojō · 4K",
      en: "Dark silhouette with light bursting through · adult Gojō · 4K",
    },
    alt: {
      tr: "İçinden ışık fışkıran karanlık Gojō silüeti",
      en: "Dark Gojō silhouette with light bursting through",
    },
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   P05 · DOMAIN EXPANSION / UNLIMITED VOID

   Tam ekran sinematik sekans. Sayfanın ikinci imza bileşeni burada doğuyor.

   ⚠️ OTOMATİK TETİKLENMİYOR. Sayfadaki düğme ya da `D` kısayolu açıyor;
   tekrar tekrar oynatılabiliyor.

   ⚠️ İÇERİK SEKANSIN İÇİNDE HAPSEDİLMİYOR. Aşağıdaki her şey bölümün
   STATİK panosunda da duruyor. Sekans o panonun oynatılmış hâli —
   reduced-motion'da sekans hiç açılmıyor ve hiçbir bilgi kaybolmuyor.
   ══════════════════════════════════════════════════════════════════════════ */

/** 領域展開 — çevrilmiyor, `lang="ja"` ile işaretleniyor (atmosfer öğesi). */
export const GOJO_S05_KANJI = "領域展開";

/** 無量空処 — alanın adı. */
export const GOJO_S05_DOMAIN_KANJI = "無量空処";

export const GOJO_S05 = {
  title: {
    tr: "ALAN GENİŞLEMESİ",
    en: "DOMAIN EXPANSION",
  },
  /** 領域展開'in okunabilir karşılığı — ekran okuyucu için */
  kanjiGloss: {
    tr: "Alan genişlemesi",
    en: "Domain expansion",
  },
  domainName: {
    tr: "Muryōkūsho — Sınırsız Boşluk",
    en: "Muryōkūsho — Unlimited Void",
  },
  /** Bölümün gövde metni — panoda ve sekansta aynı anlatı */
  body: {
    tr: "Alan genişlemesi bir saldırı değil, bir mekân dayatması. Gojō kendi tekniğini bir hacme çeviriyor ve içine giren herkes o hacmin kurallarına tabi oluyor. Muryōkūsho'nun yaptığı şey acı vermek değil: hedefin beynine yapılması gereken her şeyin bilgisini aynı anda veriyor. Yürümek, nefes almak, göz kırpmak — hepsinin talimatı sonsuz ayrıntıda ve aynı anda geliyor. Beden komutları alıyor ama hiçbirini tamamlayamıyor; kişi ayakta, uyanık ve tamamen durmuş hâlde kalıyor.",
    en: "A domain expansion is not an attack but an imposition of place. Gojō turns his own technique into a volume, and everyone inside it falls under that volume's rules. What Unlimited Void does is not to inflict pain: it hands the target's brain the information for everything that must be done, all at once. Walking, breathing, blinking — the instructions for each arrive in infinite detail and simultaneously. The body receives the commands and can complete none of them; the person remains standing, awake, and completely stopped.",
  },
  /** Donma anında ekranda kalan tek satır */
  freezeLine: {
    tr: "SONSUZ BİLGİ.",
    en: "INFINITE INFORMATION.",
  },
  /**
   * Boşluğa akan bilgi parçaları.
   *
   * Brief: "teknik isimleri, karakter bilgileri, Japonca semboller,
   * koordinatlar, cursed energy verileri, manga paneli tarzı metin
   * parçaları". Hepsi sayfanın kendi veri kümesinden ya da serinin
   * terminolojisinden; uydurma sayı yok.
   *
   * ⚠️ Bu liste hem sekansta akıyor hem de statik panoda liste olarak
   * duruyor. Tek kaynak, iki sunum.
   */
  fragments: [
    { text: "無下限呪術", lang: "ja" },
    { text: "六眼", lang: "ja" },
    { text: "術式順転「蒼」", lang: "ja" },
    { text: "術式反転「赫」", lang: "ja" },
    { text: "虚式「茈」", lang: "ja" },
    { text: "反転術式", lang: "ja" },
    { text: "領域展開", lang: "ja" },
    { text: "無量空処", lang: "ja" },
    { text: "35.6938°N 139.7034°E", lang: null },
    { text: "d₀ / 2ⁿ", lang: null },
    { text: "lim d → 0", lang: null },
    { text: "Σ 2⁻ⁿ = 1", lang: null },
    { text: "1989.12.07", lang: null },
    { text: "190 cm", lang: null },
    { text: "SPECIAL GRADE", lang: null },
    { text: "∞", lang: null },
  ],
  ui: {
    /** Tetikleyici düğme */
    trigger: {
      tr: "ALAN GENİŞLEMESİ",
      en: "DOMAIN EXPANSION",
    },
    triggerHint: {
      tr: "veya D tuşu",
      en: "or press D",
    },
    /** ⚠️ Sekans boyunca HER ZAMAN görünür */
    skip: {
      tr: "Geç",
      en: "Skip",
    },
    escape: {
      tr: "Esc ile çık",
      en: "Esc to exit",
    },
    /** Reduced-motion panosunun başlığı */
    staticLabel: {
      tr: "Alanın içinde ne var",
      en: "What is inside the domain",
    },
  },
} as const;

/** P05'in görsel yuvası. */
export const GOJO_S05_SLOT = {
  key: "goj:muryokusho",
  aspect: "16 / 9",
  spec: {
    tr: "Çaprazlanmış parmaklar ve yüzün yarısı · tek buz mavisi göz bebeğine odaklı ultra-makro göz hizası kadraj · gözbebeği içi nebula dokulu · 8K",
    en: "Crossed fingers and half the face · ultra-macro eye-level framing focused on a single ice-blue iris · nebula texture inside the pupil · 8K",
  },
  alt: {
    tr: "Çaprazlanmış parmaklar ve tek bir buz mavisi göz — ultra makro",
    en: "Crossed fingers and a single ice-blue eye — ultra macro",
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   P06 · THE MAKING OF THE STRONGEST

   Zaman çizelgesi. ⚠️ DURAKLARIN TAMAMI `GOJO_TIMELINE`den geliyor
   (bu dosyanın üst yarısı): beş durak, yaş etiketleri, kaynaklı replik ve
   akraba bağlantılarıyla 25 Ağustos 2026'da yazıldı. P06 onu DEVRALIYOR.

   Brief yedi durak sayıyor (Hidden Inventory → Riko → Toji → Awakening →
   Getō → öğretmenlik → Shibuya). Mevcut beşli aynı anlatıyı taşıyor:
   Riko durağı Toji karşılaşmasını ve 天上天下唯我独尊 ile uyanışı TEK
   durakta birleştiriyor — çünkü üçü aynı görevde, aynı gün oluyor. Üçe
   bölmek kronolojiyi doğru ama anlatıyı yanlış gösterirdi.

   Buradaki blok yalnızca bölümün kabuğu: başlık, yıl damgaları ve
   paletin kayma noktaları.
   ══════════════════════════════════════════════════════════════════════════ */

export const GOJO_S06 = {
  title: {
    tr: "EN GÜÇLÜ NASIL OLDU",
    en: "THE MAKING OF THE STRONGEST",
  },
  lede: {
    tr: "Beş durak. Hiçbiri bir zafer değil; hepsi bir bedel.",
    en: "Five stops. None of them a victory; all of them a price.",
  },
  /**
   * Fotoğrafların arkasında duran dev, saydam yıl damgaları.
   *
   * ⚠️ Bunlar `GOJO_TIMELINE`deki yaş etiketlerinin YERİNE geçmiyor,
   * arkasında duruyor. Yaş etiketi künye bilgisi, bu ise dokunun parçası.
   * Değerler kaynaklı: doğum 1989 (AniList), Yıldız Kabı görevi 2006
   * (Hidden Inventory yayı), Getō'nun ayrılışı 2007, öğretmenlik ve
   * Shibuya 2018.
   */
  stamps: {
    born: "1989",
    riko: "2006",
    geto: "2007",
    teacher: "2018",
    seal: "2018",
  } as Record<string, string>,
  /** Bölümün kapanış satırı — palet kızıla döndükten sonra */
  outro: {
    tr: "Ölçen göz kapandığında dünya ilk kez kendi ölçüsüne kaldı.",
    en: "When the measuring eye closed, the world was left to its own measure for the first time.",
  },
} as const;

/**
 * P06'nın iki görsel yuvası.
 *
 * Durakların kendi yuvaları (`goj:fate-*`) `GOJO_TIMELINE`de zaten
 * tanımlı ve her durakta çiziliyor. Buradaki ikisi brief'in ayrıca
 * istediği Hidden Inventory dönemi kadrajları.
 */
export const GOJO_S06_SLOTS = {
  full: {
    key: "goj:young-full",
    aspect: "2 / 3",
    spec: {
      tr: "Hidden Inventory dönemi genç Gojō · yuvarlak siyah güneş gözlüklü · gevşek yakalı üniforma · tam boy · 4K",
      en: "Hidden Inventory era young Gojō · round black sunglasses · loose-collared uniform · full body · 4K",
    },
    alt: {
      tr: "Genç Satoru Gojō — yuvarlak siyah gözlük, tam boy",
      en: "Young Satoru Gojō — round black glasses, full body",
    },
  },
  portrait: {
    key: "goj:young-portrait",
    aspect: "1 / 1",
    spec: {
      tr: "Hidden Inventory dönemi genç Gojō portresi · yakın kadraj · 4K",
      en: "Hidden Inventory era young Gojō portrait · close crop · 4K",
    },
    alt: {
      tr: "Genç Satoru Gojō portresi",
      en: "Young Satoru Gojō portrait",
    },
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   P07 · GOJŌ × GETŌ

   Split-screen, yin & yang. Sol taraf (Gojō) devasa negatif alanla nefes
   alıyor; sağ taraf (Getō) dar, sıkışık, kalabalık. Ortadaki ayrım düz bir
   çizgi değil ÇATLAK.

   ⚠️ Bu bölüm bir dostluk anlatısı değil, bir SİMETRİ anlatısı: ikisi de
   aynı sonuca bakıp zıt yönlere yürüdü. Metin bu yüzden iki sütun ve
   sütunlar birbirine cevap veriyor.
   ══════════════════════════════════════════════════════════════════════════ */

export const GOJO_S07 = {
  title: {
    tr: "GOJŌ × GETŌ",
    en: "GOJŌ × GETŌ",
  },
  /** Çatlağın iki yakasındaki isimler */
  leftName: { tr: "SATORU", en: "SATORU" },
  rightName: { tr: "SUGURU", en: "SUGURU" },
  /**
   * Sol sütun — Gojō. Hafif, seyrek, boşluklu.
   * ⚠️ İki sütun BİRBİRİNE CEVAP VERİYOR; sırayla okunduğunda diyalog
   * gibi ilerliyor. Ekran okuyucu da bu sırayla duyuyor.
   */
  left: [
    {
      tr: "İkisi de aynı şeyi gördü: zayıfları koruyan sistem çürümüştü ve o sistemi ayakta tutan şey kendi güçleriydi.",
      en: "They both saw the same thing: the system that protected the weak had rotted, and what held it up was their own strength.",
    },
    {
      tr: "Gojō yukarıyı devirmek yerine aşağıyı büyütmeyi seçti. Öğretmen oldu. Çözümü zaman aldı ve kendisi kadar güçlü olmayan insanlara güvenmeyi gerektirdi.",
      en: "Gojō chose to raise the bottom instead of toppling the top. He became a teacher. His answer took time, and it required trusting people who were not as strong as he was.",
    },
  ],
  /** Sağ sütun — Getō. Ağır, sıkışık, kalın. */
  right: [
    {
      tr: "Getō aynı çürümeye baktı ve kusurun sistemde değil insanlarda olduğuna karar verdi. Yuttuğu her lanet onu biraz daha daralttı.",
      en: "Getō looked at the same rot and decided the flaw was not in the system but in people. Every curse he swallowed narrowed him a little further.",
    },
    {
      tr: "Çözümü hızlıydı ve kimseye güvenmeyi gerektirmiyordu. Bedeli de buydu: yalnız kalmayı seçen, yalnız kalmaktan korkmayan tarafın kaybettiği şey seçenekti.",
      en: "His answer was fast and required trusting no one. That was its price: what the side unafraid of being alone lost was the possibility of another answer.",
    },
  ],
  /** Instrument Serif italik — bölümün duygusal ekseni */
  emotional: {
    tr: "Aralarındaki mesafe bir kavgayla açılmadı. İkisi de haklı olduğuna inandığı yönde yürüdü ve yön farkı yıllar içinde bir uçuruma dönüştü.",
    en: "The distance between them did not open with a fight. Each walked in the direction he believed was right, and the difference of direction became a chasm over the years.",
  },
  /** Çatlağın kırıldığı andaki dev satır */
  finale: {
    tr: "EN GÜÇLÜ BİZDİK.",
    en: "WE WERE THE STRONGEST.",
  },
  /**
   * Çarpışan dev tipografinin okunabilir karşılığı.
   * BRIEF · erişilebilirlik: "orta çatlakta harfler birbirine çarpar/
   * kesilir — `sr-only` düz karşılığı zorunlu."
   */
  srSummary: {
    tr: "Sayfanın bu bölümü ikiye ayrılıyor: solda Satoru Gojō, sağda Suguru Getō. Ortadaki çatlak scroll ilerledikçe genişliyor ve sonunda kırılıyor. Kapanış satırı: EN GÜÇLÜ BİZDİK.",
    en: "This section splits in two: Satoru Gojō on the left, Suguru Getō on the right. The crack between them widens as you scroll and finally breaks. The closing line reads: WE WERE THE STRONGEST.",
  },
} as const;

/** P07'nin görsel yuvası. */
export const GOJO_S07_SLOT = {
  key: "goj:geto-pair",
  aspect: "16 / 9",
  spec: {
    tr: "Genç Gojō ve Getō · sırt sırta ya da karşılıklı profil · gökyüzü arka planı (Gojō yaz mavisi / Getō gün batımı turuncusu) · 4K yüksek kontrast",
    en: "Young Gojō and Getō · back to back or facing profiles · sky background (Gojō summer blue / Getō sunset orange) · 4K high contrast",
  },
  alt: {
    tr: "Genç Satoru Gojō ve Suguru Getō — karşılıklı",
    en: "Young Satoru Gojō and Suguru Getō — facing each other",
  },
} as const;
