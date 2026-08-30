import type { LocalizedText } from "./types";

/**
 * Armin Arlert — "Ufuk" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Sahne görselleri veritabanında — characterId 46494 kaydının ABILITY
 * yuvaları, `arm:*` anahtarlarıyla.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * AYNI OLAY, BEŞ OKUMA. Armin'in serideki işi savaşmak değil OKUMAK: elindeki
 * veri herkesle aynı, farkı yorumu. Sayfa da bunu yapıyor — sol sütun bir
 * defter (yorum), sağ sütun olay. Sayfanın kalbindeki tezgâhta veri satırı
 * hiç değişmiyor, yalnızca okuma değişiyor.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (3 Kasım), boy (163 cm), birlik ("104th Trainees Squad, Survey
 * Corps"), yakını ("Grandfather") ve yaş ("15-") AniList kaydından birebir
 * alındı (karakter 46494, 30 Ağustos 2026). Seslendiren (Marina Inoue) aynı
 * kaydın `appearances` satırlarından.
 *
 * ⚠️ KAN GRUBU VE DOĞUM YILI YOK. AniList kaydında `bloodType: null` ve
 * `dateOfBirth.year: null`. İkisi de UYDURULMADI — künye şeridinde "kayıtta
 * yok" olarak duruyor ve bu bilinçli: boşluk da bir veridir.
 *
 * ── YIL DİSİPLİNİ ────────────────────────────────────────────────────────
 * Sayfadaki dört yıl serinin kendi takvimi: 845 (Shiganshina'nın düşüşü),
 * 847 (104. Eğitim Birliği), 850 (Trost, 57. sefer, Shiganshina'ya dönüş,
 * deniz), 854 (Liberio). Yaşlar bu takvimden türetildi: AniList "15-" diyor
 * ve mezuniyet 850'de, yani 845'te 10, 847'de 12, 854'te 19. Bu dördü
 * dışında sayfada TEK BİR TARİH YOK — emin olunmayan hiçbir ölçü yazılmadı.
 *
 * ── TERMİNOLOJİ ──────────────────────────────────────────────────────────
 * 超大型巨人 (Chōkyodai Kyojin — Kolosal Titan), 九つの巨人 (Kokonotsu no
 * Kyojin — Dokuz Titan), 立体機動装置 (Rittai Kidō Sōchi — üç boyutlu manevra
 * donanımı), 調査兵団 (Chōsa Heidan — Keşif Birliği), 作戦 (sakusen —
 * harekât), 蒸気 (jōki — buhar), ユミルの呪い (Yumiru no Noroi — Ymir'in
 * Laneti), 記憶 (kioku — bellek), 囮 (otori — yem). Türkçeleri arşivin kendi
 * karşılıkları.
 *
 * ── AD YAZIMI ────────────────────────────────────────────────────────────
 * Sayfada geçen bütün özel adlar AniList'in yazımıyla, tek tek doğrulandı
 * (30 Ağustos 2026, GraphQL): Bertolt Hoover (#46488 — "Bertholdt" DEĞİL),
 * Annie Leonhart (#46490), Dot Pixis (#62485), Hange Zoe (#71121 — kayıtta
 * "Zoë" değil "Zoe"), Erwin Smith (#46496), Reiner Braun (#46484).
 * Arşivin tek ad kaynağı AniList; yaygın hayran yazımları kullanılmadı.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada tırnağa alınan iki cümle var: 「海だ」 (denizi ilk gördüğünde) ve
 * 「何かを捨てることができない人には、何も変えることはできない」 (kendi
 * cümlesi, bir şeyi değiştirmenin bedeli üzerine). Bir de dedesinin
 * kitabındaki üç satır: 炎の水・氷の大地・砂の雪原. Emin olunmayan hiçbir
 * cümle tırnağa alınmadı; sahne tarifi yerine genel atıf yazıldı.
 */

export const ARMIN_ID = 46494;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const ARMIN_SITE_URL = "https://anilist.co/character/46494";

/**
 * Depodaki resmî portre (Faz 2 §3): AniList'ten indirildi, künyesi
 * `public/assets/anime/karakterler/armin-arlert/kaynak.json` içinde.
 *
 * ⚠️ 230×345 — yani KÜÇÜK. Tam kanama bir hero olarak kullanılamaz; sayfada
 * madalyon ölçüsünde duruyor. Büyük kadraj `arm:hero` yuvasında bekliyor.
 */
export const ARMIN_PORTRAIT = {
  src: "/assets/anime/karakterler/armin-arlert/anilist-portrait.png",
  width: 230,
  height: 345,
} as const;

/**
 * Sergi görselleri — hepsi characterId 46494 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `arm:` önekli (küratör modu şartı).
 */
export const ARMIN_IMAGE_KEYS = {
  hero: "arm:hero",
  portrait: "arm:portre",
  colossal: "arm:chokyodai",
  gear: "arm:rittai",
  plan: "arm:sakusen",
  smallSteam: "arm:jouki",
  smallCurse: "arm:noroi",
  smallMemory: "arm:kioku",
  smallDecoy: "arm:otori",
  desk: "arm:mori",
  fateBook: "arm:fate-hon",
  fateCorps: "arm:fate-104",
  fateTrost: "arm:fate-trost",
  fateShiganshina: "arm:fate-shiganshina",
  fateSea: "arm:fate-umi",
  closing: "arm:closing",
} as const;

/**
 * Yuva künyesi — TEK kaynak.
 *
 * `label` yükleyicinin üstünde duruyor (ne beklendiğini söyler), `spec`
 * sayfanın altındaki `CuratorGaps` özetinde, `w`/`h` ikisinde de.
 * İkisini ayrı yerde tutmak, ölçünün sessizce ayrışması demekti.
 */
export interface ArminSlotSpec {
  label: LocalizedText;
  spec: LocalizedText;
  w: number;
  h: number;
}

export const ARMIN_SLOTS: Record<string, ArminSlotSpec> = {
  [ARMIN_IMAGE_KEYS.hero]: {
    label: {
      tr: "Hero — geniş yatay kadraj: duvar üstünden ufuk, tek figür (16:9)",
      en: "Hero — wide landscape: the horizon from atop the wall, one figure (16:9)",
    },
    spec: { tr: "yatay hero · webp", en: "landscape hero · webp" },
    w: 1920,
    h: 1080,
  },
  [ARMIN_IMAGE_KEYS.portrait]: {
    label: {
      tr: "Portre — dikey büyük kadraj; AniList'in 230 pikselinin yerine geçer",
      en: "Portrait — large vertical crop; replaces the 230 px AniList frame",
    },
    spec: { tr: "dikey portre · webp", en: "vertical portrait · webp" },
    w: 1200,
    h: 1600,
  },
  [ARMIN_IMAGE_KEYS.colossal]: {
    label: {
      tr: "超大型巨人 — buhar patlaması, gövde henüz belirsiz",
      en: "Colossal Titan — the steam blast, the body still unresolved",
    },
    spec: { tr: "yatay sahne · webp", en: "landscape scene · webp" },
    w: 1440,
    h: 810,
  },
  [ARMIN_IMAGE_KEYS.gear]: {
    label: {
      tr: "立体機動装置 — donanımın kendisi, yakın çekim; figür yok",
      en: "ODM gear — the equipment itself, close crop; no figure",
    },
    spec: { tr: "yatay sahne · webp", en: "landscape scene · webp" },
    w: 1440,
    h: 810,
  },
  [ARMIN_IMAGE_KEYS.plan]: {
    label: {
      tr: "作戦 — harita, taş, eğilmiş bir sırt; plan anlatılırken",
      en: "The operation — a map, a boulder, a bent back mid-briefing",
    },
    spec: { tr: "yatay sahne · webp", en: "landscape scene · webp" },
    w: 1440,
    h: 810,
  },
  [ARMIN_IMAGE_KEYS.smallSteam]: {
    label: {
      tr: "蒸気 — yalnız buhar; ne figür ne ufuk",
      en: "Steam — steam only; no figure, no horizon",
    },
    spec: { tr: "kare ayrıntı · webp", en: "square detail · webp" },
    w: 800,
    h: 800,
  },
  [ARMIN_IMAGE_KEYS.smallCurse]: {
    label: {
      tr: "ユミルの呪い — kum saati değil: bir takvim, bir çizik",
      en: "Curse of Ymir — not an hourglass: a calendar, a scratch",
    },
    spec: { tr: "kare ayrıntı · webp", en: "square detail · webp" },
    w: 800,
    h: 800,
  },
  [ARMIN_IMAGE_KEYS.smallMemory]: {
    label: {
      tr: "記憶 — başkasının anısı; bulanık, ikinci elden bir kare",
      en: "Memory — someone else's; blurred, a second-hand frame",
    },
    spec: { tr: "kare ayrıntı · webp", en: "square detail · webp" },
    w: 800,
    h: 800,
  },
  [ARMIN_IMAGE_KEYS.smallDecoy]: {
    label: {
      tr: "囮 — açık alanda tek başına duran küçük figür",
      en: "Decoy — a small figure standing alone in the open",
    },
    spec: { tr: "kare ayrıntı · webp", en: "square detail · webp" },
    w: 800,
    h: 800,
  },
  [ARMIN_IMAGE_KEYS.desk]: {
    label: {
      tr: "Dev Ağaçlar Ormanı — 57. sefer; yukarıdan, kablolar ve gövdeler",
      en: "Forest of Giant Trees — the 57th expedition; from above, cables and trunks",
    },
    spec: { tr: "geniş sahne · webp", en: "wide scene · webp" },
    w: 1600,
    h: 700,
  },
  [ARMIN_IMAGE_KEYS.fateBook]: {
    label: {
      tr: "845 — dedesinin yasak kitabı; sayfalar açık, eller çocuk eli",
      en: "845 — the grandfather's forbidden book; pages open, a child's hands",
    },
    spec: { tr: "yatay sahne · webp", en: "landscape scene · webp" },
    w: 1200,
    h: 675,
  },
  [ARMIN_IMAGE_KEYS.fateCorps]: {
    label: {
      tr: "847 — eğitim alanı; sıradaki en küçük gövde",
      en: "847 — the training ground; the smallest body in the line",
    },
    spec: { tr: "yatay sahne · webp", en: "landscape scene · webp" },
    w: 1200,
    h: 675,
  },
  [ARMIN_IMAGE_KEYS.fateTrost]: {
    label: {
      tr: "850 — Trost; kaya, kapı, kalabalık",
      en: "850 — Trost; the boulder, the gate, the crowd",
    },
    spec: { tr: "yatay sahne · webp", en: "landscape scene · webp" },
    w: 1200,
    h: 675,
  },
  [ARMIN_IMAGE_KEYS.fateShiganshina]: {
    label: {
      tr: "850 — Shiganshina; duman, çatı, iki yaralı",
      en: "850 — Shiganshina; smoke, a rooftop, two wounded men",
    },
    spec: { tr: "yatay sahne · webp", en: "landscape scene · webp" },
    w: 1200,
    h: 675,
  },
  [ARMIN_IMAGE_KEYS.fateSea]: {
    label: {
      tr: "850 — kıyı; su, kum, sırtı dönük figürler",
      en: "850 — the shore; water, sand, figures with their backs turned",
    },
    spec: { tr: "yatay sahne · webp", en: "landscape scene · webp" },
    w: 1200,
    h: 675,
  },
  [ARMIN_IMAGE_KEYS.closing]: {
    label: {
      tr: "Kapanış — boş ufuk çizgisi, düşük kontrast, figürsüz",
      en: "Closing — an empty horizon line, low contrast, no figure",
    },
    spec: { tr: "geniş kapanış · webp", en: "wide closing · webp" },
    w: 1600,
    h: 620,
  },
};

/* ── Breadcrumb ─────────────────────────────────────────────────────────── */

export const ARMIN_CRUMB = {
  series: {
    tr: "Shingeki no Kyojin · Attack on Titan",
    en: "Shingeki no Kyojin · Attack on Titan",
  },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const ARMIN_IDENTITY = {
  name: "Armin Arlert",
  nativeName: "アルミン・アルレルト",
  /** Hero filigranı — dekoratif (aria-hidden): 海 = deniz */
  watermark: "海",
  house: {
    tr: "104. Eğitim Birliği → Keşif Birliği · Shiganshina Bölgesi",
    en: "104th Training Corps → Survey Corps · Shiganshina District",
  },
  epigraph: {
    tr: "Duvarın dışında ne olduğunu bilen tek çocuk, dövüşmeyi bilmeyen çocuktu.",
    en: "The only child who knew what lay outside the wall was the child who did not know how to fight.",
  },
  facts: [
    {
      label: { tr: "Doğum günü", en: "Birthday" },
      value: { tr: "3 Kasım", en: "3 November" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "163 cm", en: "163 cm" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "Kayıtta yok", en: "Not on record" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "15 (AniList: “15-”)", en: "15 (AniList: “15-”)" },
    },
    {
      label: { tr: "Birlik", en: "Corps" },
      value: {
        tr: "104. Eğitim Birliği · Keşif Birliği",
        en: "104th Trainees Squad · Survey Corps",
      },
    },
    {
      label: { tr: "Unvan", en: "Title" },
      value: {
        tr: "超大型巨人'ın taşıyıcısı (850'den beri)",
        en: "Inheritor of the Colossal Titan (since 850)",
      },
    },
    {
      label: { tr: "Yakını", en: "Relative" },
      value: { tr: "Dedesi", en: "His grandfather" },
    },
    {
      label: { tr: "Sembolik obje", en: "Symbolic object" },
      value: {
        tr: "Dedesinin yasak kitabı",
        en: "His grandfather's forbidden book",
      },
    },
    {
      label: { tr: "Seslendiren", en: "Voice" },
      value: { tr: "Marina Inoue", en: "Marina Inoue" },
    },
  ],
};

export const ARMIN_HERO = {
  lede: {
    tr: "Aynı duvar, aynı gün, aynı kırk saniye. Armin'in serideki işi savaşmak değil okumaktı: elindeki veri herkesle aynıydı, farkı yorumuydu. Bu sayfa onun yöntemine göre kuruldu — solda defter, sağda olay.",
    en: "The same wall, the same day, the same forty seconds. Armin's work in this story was never fighting but reading: his data was everyone's data, only his interpretation differed. This page is built the way he worked — the notebook on the left, the event on the right.",
  },
  bandCaption: {
    tr: "Ufuk kadrajı — küratör yuvası. Kare yüklenene kadar çizgi elle çiziliyor.",
    en: "The horizon frame — a curator slot. Until an image lands, the line is drawn by hand.",
  },
  portraitAlt: {
    tr: "Armin Arlert — arşive yüklenmiş portre",
    en: "Armin Arlert — portrait uploaded to the archive",
  },
  portraitAltFallback: {
    tr: "Armin Arlert — AniList resmî portresi (230×345)",
    en: "Armin Arlert — official AniList portrait (230×345)",
  },
};

export const ARMIN_MISSING_NOTE = {
  tr: "AniList kaydında kan grubu ve doğum yılı yok (bloodType: null, dateOfBirth.year: null). İkisi de türetilmedi — bir künyede boşluk da veridir.",
  en: "The AniList record carries no blood type and no birth year (bloodType: null, dateOfBirth.year: null). Neither was inferred — in a dossier, a gap is data too.",
};

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const ARMIN_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "The record" },
    lede: {
      tr: "AniList kaydının verdiği kadarı, eksikleri dâhil.",
      en: "As much as the AniList record gives, gaps included.",
    },
  },
  lab: {
    title: { tr: "Elindekiler", en: "What he has" },
    lede: {
      tr: "Üç büyük kalem ve dört küçük ayrıntı. Üçünden ikisi bedene ait ve Armin'in bedeni zayıf; üçüncüsü kafaya ait ve tek gerçek silahı o.",
      en: "Three large entries and four small details. Two of the three belong to the body, and his body is weak; the third belongs to the head, and that is his only real weapon.",
    },
  },
  desk: {
    title: { tr: "Aynı olay, beş okuma", en: "One event, five readings" },
    lede: {
      tr: "Üstteki veri satırı hiç değişmiyor. Değişen tek şey onu kimin, nasıl okuduğu. Beş okumayı da aç; beşi bitince “hangisi doğruydu” satırı açılır.",
      en: "The data line at the top never changes. The only thing that changes is who reads it and how. Open all five; when the fifth is read, the “which one was right” line opens.",
    },
  },
  fate: {
    title: { tr: "Beş durak", en: "Five stops" },
    lede: {
      tr: "Dört yıl, beş durak. Yaşlar serinin kendi takviminden türetildi; başka hiçbir tarih yazılmadı.",
      en: "Four years, five stops. The ages come from the story's own calendar; no other date was written.",
    },
  },
  witness: {
    title: { tr: "Aynı olayların diğer okuyucuları", en: "The other readers of the same events" },
    lede: {
      tr: "Hepsi aynı yerde, aynı gündeydi. Kimse aynı şeyi okumadı.",
      en: "All of them were in the same place on the same day. None of them read the same thing.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "Denizi görmek ile denizin ötesini görmek aynı güne düştü.",
      en: "Seeing the sea and seeing what lay beyond it fell on the same day.",
    },
  },
};

/* ── Sol sütun: defter ──────────────────────────────────────────────────── */

/**
 * Yapışkan not sütunu. Her satır sayfadaki bir bölüme çıpalı gerçek bir
 * bağlantı — dekor değil, sayfanın ikinci gezinme yolu.
 *
 * ⚠️ Buradaki hiçbir satır TEK BAŞINA bilgi taşımıyor. Buhar modu sütunu
 * kaldırıyor ve kaldırdığında hiçbir veri kaybolmamalı (erişilebilirlik):
 * bunlar yorum, kayıt değil.
 */
export const ARMIN_NOTES = {
  title: { tr: "Defter", en: "Notebook" },
  hint: {
    tr: "Satırlar bölümlere çıpalı. Buhar bastığında bu sütun kalkar.",
    en: "Each line is anchored to a section. When the steam hits, this column goes.",
  },
  rows: [
    {
      id: "arm-identity",
      num: "01",
      text: {
        tr: "Önce kaydı yaz. Yorum sonra gelir.",
        en: "Write the record first. Interpretation comes after.",
      },
    },
    {
      id: "arm-lab",
      num: "02",
      text: {
        tr: "Devralınan güç, kazanılmış güç değildir.",
        en: "Inherited power is not earned power.",
      },
    },
    {
      id: "arm-desk",
      num: "03",
      text: {
        tr: "Yanlışı elemek, doğruyu bulmaktan ucuzdur.",
        en: "Eliminating the wrong is cheaper than finding the right.",
      },
    },
    {
      id: "arm-fate",
      num: "04",
      text: {
        tr: "Bir plan, en zayıf halkasının adıdır.",
        en: "A plan is the name of its weakest link.",
      },
    },
    {
      id: "arm-witness",
      num: "05",
      text: {
        tr: "Aynı odadaki beş kişi, beş ayrı olay görür.",
        en: "Five people in one room see five different events.",
      },
    },
    {
      id: "arm-closing",
      num: "06",
      text: {
        tr: "Ufuk bir sınır değil, bir soru işaretidir.",
        en: "A horizon is not a border; it is a question mark.",
      },
    },
  ],
};

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

/**
 * "Kolosal buhar" — sayfanın TEK modu ve tek yapı değişikliği.
 *
 *   analysis → iki kolon. Defter sütunu ayakta, harita konturları görünür,
 *              zemin soğuk mavi.
 *   ruin     → buhar basıyor. Izgara TEK KOLONA çöküyor, defter sütunu
 *              kayboluyor, konturların yerini buhar bantları alıyor, palet
 *              ısınıyor.
 *
 * Yani düğme ışığı değil DÜZENİ değiştiriyor (Faz 2, eksen 5 şartı).
 */
export const ARMIN_MODE_TEXT = {
  label: { tr: "Kolosal buhar", en: "Colossal steam" },
  enter: { tr: "Buharı bas", en: "Release the steam" },
  exit: { tr: "Buharı çek", en: "Pull the steam back" },
  stateLabel: { tr: "Sayfa", en: "Page" },
  stateAnalysis: { tr: "çözümleme · iki kolon", en: "analysis · two columns" },
  stateRuin: { tr: "yıkım · tek kolon", en: "ruin · one column" },
  hint: {
    tr: "Buhar bastı: defter sütunu kalktı, sayfa tek kolona indi. Hiçbir kayıt kaybolmadı — yalnızca yorum sustu.",
    en: "The steam is out: the notebook column is gone and the page has dropped to one column. No record was lost — only the commentary went quiet.",
  },
};

/* ── Üç büyük kart ──────────────────────────────────────────────────────── */

export interface ArminArt {
  key: string;
  kanji: string;
  reading: string;
  name: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
  imageKey: string;
}

export const ARMIN_ARTS: ArminArt[] = [
  {
    key: "colossal",
    kanji: "超大型巨人",
    reading: "Chōkyodai Kyojin",
    name: { tr: "Kolosal Titan", en: "Colossal Titan" },
    tagline: {
      tr: "Devraldığı güç — yandıktan sonra, 850'de.",
      en: "The power he inherited — in 850, after he burned.",
    },
    text: {
      tr: "Dokuz Titan'dan (九つの巨人) biri ve en büyüğü. Dönüşümü bir dövüş değil bir patlama: gövde belirmeden önce ısı ve buhar geliyor, çevredeki her şeyi o dalga hallediyor. Armin bu gücü kazanmadı, devraldı — Shiganshina'ya dönüşte Bertolt Hoover'dan. Sayfanın en acı ayrıntısı da bu: kitabı okuyan çocuk, sonunda duvarları yıkan şeyin içine girdi.",
      en: "One of the Nine Titans (九つの巨人), and the largest of them. Its transformation is not a fight but a detonation: heat and steam arrive before the body does, and that wave settles most of what is nearby. Armin did not earn this power, he inherited it — from Bertolt Hoover, on the return to Shiganshina. That is the page's bitterest detail: the boy who read the book ended up inside the thing that breaks walls.",
    },
    traits: [
      { tr: "Dokuz Titan'dan biri", en: "One of the Nine Titans" },
      { tr: "Dönüşüm = patlama", en: "Transformation = detonation" },
      { tr: "850'den beri", en: "Since 850" },
    ],
    imageKey: ARMIN_IMAGE_KEYS.colossal,
  },
  {
    key: "gear",
    kanji: "立体機動装置",
    reading: "Rittai Kidō Sōchi",
    name: {
      tr: "Üç boyutlu manevra donanımı",
      en: "Omni-directional mobility gear",
    },
    tagline: {
      tr: "Herkesin taşıdığı donanım — ve onun en zayıf olduğu yer.",
      en: "The gear everyone carries — and the place where he is weakest.",
    },
    text: {
      tr: "Kanca, tel, gaz ve iki bıçak: Keşif Birliği'nin tamamı bu donanımla uçuyor. Armin 104. Eğitim Birliği'nin fiziksel olarak en zayıflarındandı ve mezuniyette ilk ona giremedi. Donanımı kullanmayı öğrendi ama onunla kimseyi geçemedi; bunun yerine nereye asılacağını seçmeyi öğrendi. Sayfa bu ayrımın üstünde duruyor: hız bir yetenek, konum bir karar.",
      en: "Hooks, cable, gas and two blades: the entire Survey Corps flies on this gear. Armin was among the physically weakest of the 104th and did not place in the top ten at graduation. He learned to use the gear but never outflew anyone with it; instead he learned to choose where to anchor. The page stands on that distinction: speed is a talent, position is a decision.",
    },
    traits: [
      { tr: "Kanca · tel · gaz", en: "Hooks · cable · gas" },
      { tr: "İlk ona giremedi", en: "Not in the top ten" },
      { tr: "Hız değil konum", en: "Position, not speed" },
    ],
    imageKey: ARMIN_IMAGE_KEYS.gear,
  },
  {
    key: "plan",
    kanji: "作戦",
    reading: "Sakusen",
    name: { tr: "Harekât", en: "The operation" },
    tagline: {
      tr: "Tek gerçek silahı. İki kez bir bölgeyi kurtardı.",
      en: "His only real weapon. It saved a district twice.",
    },
    text: {
      tr: "Trost'ta kapı delindiğinde deliği kapatacak şeyin bir kaya olduğunu ve o kayayı taşıyabilecek tek şeyin Eren'in Titan'ı olduğunu söyleyen oydu; Komutan Dot Pixis on beş yaşındaki bir eri dinledi ve planı uyguladı. Stohess'te Kadın Titan'ı yakalayan tuzağı da o kurdu ve tuzaktaki yem yine kendisiydi. İkisinde de Armin'in katkısı bir hamle değil bir SIRA: hangi bilgiyi ne zaman kullanacağını bilmek.",
      en: "At Trost, when the gate was breached, it was Armin who said the hole needed a boulder and that the only thing able to carry it was Eren's Titan; Commander Dot Pixis listened to a fifteen-year-old cadet and ran the plan. At Stohess it was Armin who set the trap that caught the Female Titan — and he was the bait in it. In both cases his contribution was not a move but an ORDER: knowing which piece of information to spend, and when.",
    },
    traits: [
      { tr: "Trost · 850", en: "Trost · 850" },
      { tr: "Stohess · 850", en: "Stohess · 850" },
      { tr: "Hamle değil sıra", en: "Order, not the move" },
    ],
    imageKey: ARMIN_IMAGE_KEYS.plan,
  },
];

/* ── Dört küçük kart ────────────────────────────────────────────────────── */

export interface ArminDetail {
  key: string;
  kanji: string;
  reading: string;
  name: LocalizedText;
  note: LocalizedText;
  imageKey: string;
}

export const ARMIN_DETAILS: ArminDetail[] = [
  {
    key: "steam",
    kanji: "蒸気",
    reading: "Jōki",
    name: { tr: "Buhar", en: "Steam" },
    note: {
      tr: "Kolosal'ın dönüşümünde çıkan ısı ve buhar hem silah hem perde: yaktığı kadar da gizliyor. Sayfanın mod düğmesi tam olarak bunu taklit ediyor.",
      en: "The heat and steam of the Colossal's transformation are both weapon and screen: it hides as much as it burns. The page's mode button imitates exactly this.",
    },
    imageKey: ARMIN_IMAGE_KEYS.smallSteam,
  },
  {
    key: "curse",
    kanji: "ユミルの呪い",
    reading: "Yumiru no Noroi",
    name: { tr: "Ymir'in Laneti", en: "The Curse of Ymir" },
    note: {
      tr: "Dokuz Titan'dan birini devralan kişi, devraldığı andan sonra on üç yıldan fazla yaşamıyor. Armin'in sayacı 850'de başladı; kurtuluşuyla birlikte kendisine bir son tarih de verildi.",
      en: "Whoever inherits one of the Nine Titans does not live more than thirteen years past the moment of inheritance. Armin's clock started in 850; his rescue came with an expiry date attached.",
    },
    imageKey: ARMIN_IMAGE_KEYS.smallCurse,
  },
  {
    key: "memory",
    kanji: "記憶",
    reading: "Kioku",
    name: { tr: "Bellek", en: "Memory" },
    note: {
      tr: "Güçle birlikte önceki taşıyıcının anıları da geçiyor. Armin'in kafasındaki veri artık yalnızca kendi gözlemi değil; içinde başkasının gördükleri de var ve bunun hangisi olduğunu ayırmak zorunda.",
      en: "The previous holder's memories travel with the power. The data in Armin's head is no longer only his own observation; someone else's sights are in there too, and he has to tell them apart.",
    },
    imageKey: ARMIN_IMAGE_KEYS.smallMemory,
  },
  {
    key: "decoy",
    kanji: "囮",
    reading: "Otori",
    name: { tr: "Yem", en: "The decoy" },
    note: {
      tr: "Armin'in tekrar eden rolü: kendini düşmanın önüne koyup bakışı üstüne çekmek, böylece başka biri ensesine ulaşabilsin. Stohess'te de, Shiganshina'da da yemi o oynadı — ikincisinde bunun bedelini gövdesiyle ödedi.",
      en: "Armin's recurring role: put himself in front of the enemy and hold its gaze so somebody else can reach the nape. He played the bait at Stohess and again at Shiganshina — the second time he paid for it with his body.",
    },
    imageKey: ARMIN_IMAGE_KEYS.smallDecoy,
  },
];

/* ── Sayfanın kalbi: beş okuma ──────────────────────────────────────────── */

/**
 * Değişmeyen veri satırı. Beş okumanın hepsi BUNU okuyor; tezgâhta bu
 * satırın tek bir harfi bile değişmiyor — sayfanın bütün iddiası bu.
 */
export const ARMIN_EVENT = {
  where: {
    tr: "850 · 57. Duvar Dışı Keşif Seferi · Dev Ağaçlar Ormanı",
    en: "850 · The 57th Expedition Beyond the Walls · Forest of Giant Trees",
  },
  dataLabel: { tr: "Veri", en: "Data" },
  data: {
    tr: "Kadın Titan bir askeri yakaladı. Kapüşonunu geri çekti. Yüzüne baktı. Ve bıraktı.",
    en: "The Female Titan caught a soldier. She pulled back his hood. She looked at his face. And she let him go.",
  },
  dataNote: {
    tr: "Bu dört cümle hiçbir okumada değişmiyor. Aşağıdaki satırların hepsi bu dördünün üstüne kuruluyor.",
    en: "These four sentences do not change under any reading. Every line below is built on top of them.",
  },
};

export interface ArminReading {
  key: string;
  index: string;
  title: LocalizedText;
  /** Aynı kırk saniye, bu okumanın diliyle yeniden yazılmış hâli */
  retell: LocalizedText;
  /** Okumanın çıkarımı */
  means: LocalizedText;
  /** Okumanın eledikleri */
  drops: LocalizedText;
  /** Okumanın açtığı bir sonraki soru */
  next: LocalizedText;
}

export const ARMIN_READINGS: ArminReading[] = [
  {
    key: "abnormal",
    index: "01",
    title: { tr: "Sapkın bir Titan", en: "An Abnormal" },
    retell: {
      tr: "Bir Titan bir insanı kaldırdı, işine yaramadığına karar verdi ve bıraktı. Kapüşonun geri çekilmesi bir el hareketinin sonucu, bir kararın değil. Titan doymuştu; asker şanslıydı.",
      en: "A Titan picked up a human, decided it had no use for him, and dropped him. The hood came back as the result of a hand's motion, not of a decision. The Titan was sated; the soldier was lucky.",
    },
    means: {
      tr: "Olay bir kazadır. Açıklanacak bir şey yoktur; yalnızca not edilir.",
      en: "The event is an accident. There is nothing to explain, only something to log.",
    },
    drops: {
      tr: "Hiçbir şeyi elemiyor — en ucuz okuma her zaman en az bilgi veren okumadır.",
      en: "It eliminates nothing — the cheapest reading is always the one that yields the least.",
    },
    next: {
      tr: "Peki o gün Kadın Titan neden kimseyi yemedi de yalnızca öldürüp yürüdü?",
      en: "Then why, that day, did the Female Titan eat no one and simply kill and keep walking?",
    },
  },
  {
    key: "human",
    index: "02",
    title: { tr: "İçeride bir insan var", en: "There is a human inside" },
    retell: {
      tr: "Aynı kırk saniye, bu kez bir insanın kırk saniyesi. El durdu. Kapüşon geri çekildi. Bir bakış, bir tereddüt, bir karar. Sonra el açıldı.",
      en: "The same forty seconds, only now they are a human being's forty seconds. The hand stopped. The hood came back. A look, a hesitation, a decision. Then the hand opened.",
    },
    means: {
      tr: "Titanlar tereddüt etmez. Tereddüt eden şey insandır — yani bu gövdenin içinde biri var.",
      en: "Titans do not hesitate. The thing that hesitates is a person — so there is someone inside this body.",
    },
    drops: {
      tr: "Birinci okumayı eliyor: kaza açıklaması artık fazladan varsayım gerektiriyor.",
      en: "It eliminates the first reading: the accident explanation now needs extra assumptions.",
    },
    next: {
      tr: "İçerideki insan burada ne arıyor? Titanların bir işi olmaz; insanların olur.",
      en: "What is the person inside looking for? Titans have no errand; people do.",
    },
  },
  {
    key: "target",
    index: "03",
    title: {
      tr: "Beni değil, Eren'i arıyor",
      en: "She isn't looking for me — she's looking for Eren",
    },
    retell: {
      tr: "Aynı kırk saniye, bu kez bir aramanın kırk saniyesi. El, sıradaki yüzü kaldırdı. Kapüşon bir engeldi, kaldırıldı. Bakış bir kontroldü. Yüz aranan yüz değildi, el açıldı ve sıra bir sonrakine geldi.",
      en: "The same forty seconds, only now they are a search's forty seconds. The hand lifted the next face. The hood was an obstacle, so it was removed. The look was a check. The face was not the face being sought, so the hand opened and the queue moved on.",
    },
    means: {
      tr: "Bir hedefi var ve hedefi tanıyor. Sefer düzenini biliyor, yüzleri tek tek eliyor. Bu bir avlanma değil, bir arama.",
      en: "She has a target and she can recognise it. She knows the formation and is eliminating faces one by one. This is not a hunt; it is a search.",
    },
    drops: {
      tr: "Açlığı, rastlantıyı ve “sapkın davranış”ı eliyor. Geriye istihbarat kalıyor.",
      en: "It eliminates hunger, coincidence and “abnormal behaviour”. What remains is intelligence.",
    },
    next: {
      tr: "Aradığı yüzü bilecek kadar yakınsa, bakıp bıraktığı yüzü de biliyor olabilir mi?",
      en: "If she is close enough to know the face she wants, might she also know the face she looked at and released?",
    },
  },
  {
    key: "known",
    index: "04",
    title: { tr: "Yüzümü tanıdı", en: "She recognised my face" },
    retell: {
      tr: "Aynı kırk saniye, bu kez bir tanımanın kırk saniyesi. Kapüşon geri çekildi çünkü altında kimin olduğunun bir önemi vardı. Bakış bir doğrulamaydı. Ve bırakma bir seçimdi: bu yüzü öldürmemeyi seçti.",
      en: "The same forty seconds, only now they are a recognition's forty seconds. The hood came back because it mattered who was underneath. The look was a confirmation. And the release was a choice: she chose not to kill this face.",
    },
    means: {
      tr: "Beni tanıyor. Yalnızca tanımıyor — tanıdığı için öldürmedi. Yani aramızda bir geçmiş var.",
      en: "She knows me. Not only knows me — she spared me because she knows me. So there is a history between us.",
    },
    drops: {
      tr: "Yabancı bir düşmanı eliyor. Bu kişi duvarların içinden.",
      en: "It eliminates a stranger enemy. This person is from inside the walls.",
    },
    next: {
      tr: "Beni tanıyan, Eren'i de tanıyan, duvarların içinde eğitim almış kaç kişi var?",
      en: "How many people know me, know Eren, and trained inside the walls?",
    },
  },
  {
    key: "classmate",
    index: "05",
    title: { tr: "Sınıf arkadaşım", en: "She is my classmate" },
    retell: {
      tr: "Aynı kırk saniye, bu kez bir sınıfın kırk saniyesi. Kapüşonun altındaki yüz, üç yıl aynı sıraları paylaştığı bir yüzdü. Onu kaldıran el, aynı eğitim alanında yemek kuyruğunda beklemiş bir eldi. Ve bırakma, bu yüzden bir seçim olabildi.",
      en: "The same forty seconds, only now they are a classroom's forty seconds. The face under the hood was a face that had shared the same benches for three years. The hand that lifted him was a hand that had queued for food on the same training ground. And that is why the release could be a choice at all.",
    },
    means: {
      tr: "Liste kısaldı: 104. Eğitim Birliği. Beni tanıyan, Eren'in yüzünü bilen, duvarların içinde eğitilmiş biri.",
      en: "The list is short now: the 104th Training Corps. Someone who knows me, knows Eren's face, and was trained inside the walls.",
    },
    drops: {
      tr: "Elemede tek bir isim kalıyor: Annie Leonhart.",
      en: "The elimination leaves a single name: Annie Leonhart.",
    },
    next: {
      tr: "İsim biliniyorsa soru artık “kim” değil: “nasıl tutulur”.",
      en: "Once the name is known, the question is no longer “who” but “how do we hold her”.",
    },
  },
];

export const ARMIN_VERDICT = {
  title: { tr: "Hangisi doğruydu?", en: "Which one was right?" },
  text: {
    tr: "Hiçbiri tek başına. Beşi de aynı kırk saniyeye bakıyor ve doğru cevabı yalnızca SIRA veriyor: gövde tereddüt etti (02), çünkü bir yüz arıyordu (03), çünkü benim yüzümü tanıyordu (04), çünkü aynı sıraları paylaşmıştık (05). Birinci okuma yanlış değildi, gereksizdi — ve bir okumanın işe yaradığı tek yer, elendiği yerdir. Armin'in yaptığı iş doğru hipotezi bulmak değil, yanlışları sırayla düşürmekti.",
    en: "None of them alone. All five look at the same forty seconds, and only the ORDER yields the answer: the body hesitated (02) because it was searching for a face (03), because it knew my face (04), because we had shared the same benches (05). The first reading was not wrong, it was unnecessary — and the only place a reading earns its keep is the place where it gets dropped. Armin's work was never finding the right hypothesis; it was knocking the wrong ones down in order.",
  },
  stamp: {
    tr: "Stohess Bölgesi, 850 — plan tutar; Kadın Titan kristale çekilir.",
    en: "Stohess District, 850 — the plan holds; the Female Titan withdraws into crystal.",
  },
};

export const ARMIN_DESK_UI = {
  listLabel: { tr: "Beş okuma", en: "Five readings" },
  listHint: {
    tr: "Bir okuma seç; sağdaki dört satır yerinde yeniden yazılır. Düzen sabit kalır.",
    en: "Pick a reading; the four lines on the right are rewritten in place. The layout stays fixed.",
  },
  activeLabel: { tr: "Okunan", en: "Reading" },
  retellLabel: { tr: "Aynı kırk saniye", en: "The same forty seconds" },
  meansLabel: { tr: "Ne demek", en: "What it means" },
  dropsLabel: { tr: "Ne eleniyor", en: "What it drops" },
  nextLabel: { tr: "Sonraki soru", en: "The next question" },
  counterLabel: { tr: "okunan", en: "read" },
  lockedLabel: {
    tr: "Beş okumanın hepsi açılınca kapanış satırı gelir.",
    en: "The closing line arrives once all five readings are open.",
  },
  seenLabel: { tr: "okundu", en: "read" },
  resetLabel: { tr: "Defteri temizle", en: "Clear the notebook" },
  emptyTitle: { tr: "Henüz okuma yok", en: "No reading yet" },
  emptyText: {
    tr: "Soldan bir okuma seç. Bu satır yerinde değişir; kutu aynı kalır.",
    en: "Pick a reading on the left. This line changes in place; the box stays the same.",
  },
  keyboardHint: {
    tr: "Sekme ile okumalar arasında gez, Enter ya da boşluk ile aç.",
    en: "Tab between the readings, open with Enter or Space.",
  },
};

/* ── Beş durak ──────────────────────────────────────────────────────────── */

export interface ArminStop {
  key: string;
  year: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: {
    text: string;
    reading: LocalizedText;
    by: LocalizedText;
    note: LocalizedText;
  };
  imageKey: string;
}

export const ARMIN_TIMELINE: ArminStop[] = [
  {
    key: "book",
    year: "845",
    age: { tr: "10 yaşında", en: "aged 10" },
    title: {
      tr: "Duvar kırıldığında elinde bir kitap vardı",
      en: "When the wall broke, he was holding a book",
    },
    text: {
      tr: "Shiganshina'da, dedesinin yasak kitabını okuyan bir çocuktu: alev alan su, buzdan bir kara, kumdan bir kar tarlası, tuzlu bir deniz. Duvarların dışıyla ilgilenmek o günlerde sapkınlıktı ve Armin bunun bedelini dayakla ödüyordu. 845'te duvar delindi ve kitabın dünyası, kapıdan içeri girerek geldi. Dedesi de o düşüşten sonraki dışarı harekâtına gönderilenlerden biriydi; dönmedi.",
      en: "In Shiganshina he was a child reading his grandfather's forbidden book: water that catches fire, a land of ice, a snowfield made of sand, a sea of salt. Caring about the outside was heresy in those days, and Armin paid for it with beatings. In 845 the wall was breached and the book's world came in through the gate. His grandfather was among those sent out on the operation that followed the fall; he did not come back.",
    },
    quote: {
      text: "炎の水　氷の大地　砂の雪原",
      reading: {
        tr: "Alev alan su · buzdan kara · kumdan kar tarlası",
        en: "Water that burns · a land of ice · a snowfield of sand",
      },
      by: { tr: "Dedesinin kitabından", en: "From his grandfather's book" },
      note: {
        tr: "Armin'in Eren'e anlattığı üç şey; dördüncüsü tuzlu suydu.",
        en: "The three things Armin described to Eren; the fourth was salt water.",
      },
    },
    imageKey: ARMIN_IMAGE_KEYS.fateBook,
  },
  {
    key: "corps",
    year: "847",
    age: { tr: "12 yaşında", en: "aged 12" },
    title: {
      tr: "En zayıf beden, sınıfın en iyi kafası",
      en: "The weakest body, the best head in the class",
    },
    text: {
      tr: "Eren ve Mikasa ile birlikte 104. Eğitim Birliği'ne yazıldı. Fiziksel değerlendirmelerde sürekli sonlarda kaldı ve mezuniyette ilk ona giremedi; teorik derslerde ise sınıfın önündeydi. Bu iki cümlenin arasındaki boşluk Armin'in bütün karakteri: birlikte kalabilmek için kendini sürekli kanıtlamak zorunda hissetti ve bir işe yaramadığı düşüncesi hiç geçmedi.",
      en: "He enlisted in the 104th Training Corps alongside Eren and Mikasa. He stayed near the bottom of every physical assessment and did not make the top ten at graduation; in the theoretical courses he was at the front of the class. The gap between those two sentences is his whole character: to stay with them he felt he had to keep proving himself, and the thought that he was dead weight never left.",
    },
    imageKey: ARMIN_IMAGE_KEYS.fateCorps,
  },
  {
    key: "trost",
    year: "850",
    age: { tr: "15 yaşında", en: "aged 15" },
    title: {
      tr: "Trost — deliği kapatan plan",
      en: "Trost — the plan that plugged the hole",
    },
    text: {
      tr: "Trost'un kapısı delindi ve bölge tahliye edilemedi. Armin, deliği kapatabilecek tek şeyin oradaki dev kaya, o kayayı taşıyabilecek tek şeyin de Eren'in Titan'ı olduğunu söyledi. Söylerken sesi titriyordu; planı ağzından zar zor çıkardı. Komutan Dot Pixis on beş yaşındaki bir eri sonuna kadar dinledi ve harekâtı onun cümlesi üzerine kurdu. Trost geri alındı. O günden sonra Armin'in ne yaptığı belliydi: konuşuyordu ve konuşması bir bölgeyi kurtarmıştı.",
      en: "The gate of Trost was breached and the district could not be evacuated. Armin said the only thing that could plug the hole was the great boulder standing there, and the only thing that could carry it was Eren's Titan. His voice shook as he said it; the plan barely made it out of his mouth. Commander Dot Pixis heard a fifteen-year-old cadet out to the end and built the operation on his sentence. Trost was retaken. From that day it was clear what Armin did: he talked, and his talking had saved a district.",
    },
    imageKey: ARMIN_IMAGE_KEYS.fateTrost,
  },
  {
    key: "shiganshina",
    year: "850",
    age: { tr: "15 yaşında", en: "aged 15" },
    title: {
      tr: "Shiganshina — yem oldu, yandı, seçildi",
      en: "Shiganshina — he was the bait, he burned, he was chosen",
    },
    text: {
      tr: "Shiganshina'ya dönüşte Kolosal Titan'ın karşısında planı yine Armin kurdu ve plandaki yem yine kendisiydi: bakışı üstüne çekecek, Eren enseye ulaşacaktı. Plan tuttu ve Armin ısının içinde kaldı. Elde bir Titan serumu, önünde ölmek üzere iki kişi vardı: Komutan Erwin Smith ve Armin Arlert. Levi seçti — Armin'i. Devraldığı güç, o gün kaybettikleri adamın yerine geçmedi; yalnızca yükü değiştirdi.",
      en: "On the return to Shiganshina, the plan against the Colossal Titan was again Armin's, and the bait in it was again Armin: he would hold its gaze so Eren could reach the nape. The plan held and Armin was left inside the heat. There was one Titan serum and two dying men in front of it: Commander Erwin Smith and Armin Arlert. Levi chose — Armin. The power he inherited did not replace the man they lost that day; it only moved the weight.",
    },
    quote: {
      text: "何かを捨てることができない人には、何も変えることはできない",
      reading: {
        tr: "Bir şeyi elden çıkaramayan kimse, hiçbir şeyi değiştiremez.",
        en: "Anyone unable to give something up can change nothing.",
      },
      by: { tr: "Armin Arlert", en: "Armin Arlert" },
      note: {
        tr: "Armin'in kendi cümlesi; bir şeyi değiştirmenin bedeli üzerine.",
        en: "Armin's own line, on the price of changing anything.",
      },
    },
    imageKey: ARMIN_IMAGE_KEYS.fateShiganshina,
  },
  {
    key: "sea",
    year: "850 → 854",
    age: { tr: "15 → 19 yaşında", en: "aged 15 → 19" },
    title: {
      tr: "Deniz — ve denizin ötesi",
      en: "The sea — and what lies beyond it",
    },
    text: {
      tr: "Shiganshina'dan sonra kıyıya vardılar: kitaptaki tuzlu su gerçekti. Aynı dakika içinde manzara döndü — denizin ötesinde de insanlar vardı ve onlar için duvarların içindekiler düşmandı. 854'te Armin, Liberio'da devraldığı gücü kullandı; yani hayatının hedefi olan yeri, o yeri yıkan şeyin içinden gördü. Aynı yıllarda Hange Zoe, Keşif Birliği'nin kendinden sonraki komutanı olarak onu işaret etti.",
      en: "After Shiganshina they reached the shore: the salt water from the book was real. Within the same minute the view turned — there were people beyond the sea too, and to them the people inside the walls were the enemy. In 854 Armin used the inherited power at Liberio; that is, he saw the place he had spent his life wanting to see from inside the thing that destroys it. In those same years Hange Zoe named him as the Survey Corps' next commander.",
    },
    quote: {
      text: "海だ",
      reading: { tr: "Deniz.", en: "The sea." },
      by: { tr: "Armin Arlert", en: "Armin Arlert" },
      note: {
        tr: "Denizi ilk gördüğü an.",
        en: "The moment he first saw the sea.",
      },
    },
    imageKey: ARMIN_IMAGE_KEYS.fateSea,
  },
];

/* ── Aynı olayların diğer okuyucuları ───────────────────────────────────── */

export interface ArminWitness {
  characterId: number;
  name: string;
  nameNative: string;
  role: LocalizedText;
  reading: LocalizedText;
}

export const ARMIN_WITNESSES: ArminWitness[] = [
  {
    characterId: 40882,
    name: "Eren Yeager",
    nameNative: "エレン・イェーガー",
    role: { tr: "Çocukluk üçlüsü", en: "The childhood trio" },
    reading: {
      tr: "Aynı kitabı okudu, aynı denizi gördü. Onun okumasında ufuk bir soru değil bir hedefti.",
      en: "He read the same book and saw the same sea. In his reading the horizon was not a question but a target.",
    },
  },
  {
    characterId: 40881,
    name: "Mikasa Ackerman",
    nameNative: "ミカサ・アッカーマン",
    role: { tr: "Çocukluk üçlüsü", en: "The childhood trio" },
    reading: {
      tr: "Aynı olayları tek satırda okudu ve o satır hiç değişmedi: yanında kal.",
      en: "She read the same events in a single line, and that line never changed: stay beside him.",
    },
  },
  {
    characterId: 45627,
    name: "Levi",
    nameNative: "リヴァイ",
    role: { tr: "Serumu elinde tutan", en: "The man holding the serum" },
    reading: {
      tr: "Shiganshina'da iki ölmek üzere olan adam ve tek bir serum gördü. Okumasını kimseye açıklamadı; yalnızca uyguladı.",
      en: "At Shiganshina he saw two dying men and one serum. He explained his reading to no one; he simply carried it out.",
    },
  },
  {
    characterId: 46496,
    name: "Erwin Smith",
    nameNative: "エルヴィン・スミス",
    role: {
      tr: "Keşif Birliği'nin 13. Komutanı (AniList künyesi)",
      en: "13th Commander of the Survey Corps (AniList record)",
    },
    reading: {
      tr: "Aynı sahada, aynı anda, aynı serumun karşısındaydı. Onun okumasının sonuna kimse ulaşamadı.",
      en: "He was on the same ground, at the same moment, in front of the same serum. No one reached the end of his reading.",
    },
  },
  {
    characterId: 71121,
    name: "Hange Zoe",
    nameNative: "ハンジ・ゾエ",
    role: { tr: "14. Komutan", en: "14th Commander" },
    reading: {
      tr: "Titanları veri olarak okuyan ilk kişiydi ve kendinden sonrasını Armin'e bıraktı.",
      en: "She was the first to read Titans as data, and she left what came after her to Armin.",
    },
  },
  {
    characterId: 46484,
    name: "Reiner Braun",
    nameNative: "ライナー・ブラウン",
    role: { tr: "Aynı sıraları paylaştıkları", en: "One of the same benches" },
    reading: {
      tr: "Üç yıl aynı eğitim alanındaydılar. Shiganshina'nın iç kapısını delen Zırhlı Titan oydu; Armin bunu ancak yıllar sonra doğru okudu.",
      en: "They spent three years on the same training ground. He was the Armoured Titan that broke Shiganshina's inner gate; Armin only read that correctly years later.",
    },
  },
];

export const ARMIN_WITNESS_UI = {
  linked: { tr: "Dosyaya git", en: "Open the file" },
  unlinked: {
    tr: "Elle tasarlanmış dosyası yok",
    en: "No hand-built file yet",
  },
  portraitSuffix: {
    tr: "— arşivdeki portre",
    en: "— portrait held in the archive",
  },
};

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const ARMIN_CLOSING = {
  quotes: [
    {
      text: "海だ",
      reading: { tr: "Deniz.", en: "The sea." },
      by: { tr: "Armin Arlert", en: "Armin Arlert" },
      note: {
        tr: "Kitaptaki tuzlu suyu ilk gördüğü an; 850.",
        en: "The moment he first saw the salt water from the book; 850.",
      },
    },
    {
      text: "何かを捨てることができない人には、何も変えることはできない",
      reading: {
        tr: "Bir şeyi elden çıkaramayan kimse, hiçbir şeyi değiştiremez.",
        en: "Anyone unable to give something up can change nothing.",
      },
      by: { tr: "Armin Arlert", en: "Armin Arlert" },
      note: {
        tr: "Kendi cümlesi; bedelsiz değişimin olmadığı üzerine.",
        en: "His own line, on there being no change without a price.",
      },
    },
  ],
  motto: "炎の水　氷の大地　砂の雪原　塩の水",
  mottoNote: {
    tr: "Dedesinin kitabındaki dört şey. Armin duvarın içindeyken bunları ezberledi; dördüncüsünü kıyıda gördü.",
    en: "The four things in his grandfather's book. Armin memorised them inside the walls; he saw the fourth one at the shore.",
  },
  credit: {
    tr: "Künye, portre ve numara AniList'ten:",
    en: "Record, portrait and id from AniList:",
  },
  creditLink: { tr: "AniList · karakter 46494", en: "AniList · character 46494" },
  creditNote: {
    tr: "Sayfadaki tek raster kaynak, depoya indirilmiş AniList portresidir (230×345, PNG; künyesi kaynak.json içinde). Harita konturları, ufuk çizgisi ve buhar bantları elle çizilmiş SVG'dir.",
    en: "The only raster source on this page is the AniList portrait downloaded into the repository (230×345, PNG; its record is in kaynak.json). The map contours, the horizon line and the steam bands are hand-drawn SVG.",
  },
};

/* ── Küratör boşluk özeti ───────────────────────────────────────────────── */

export const ARMIN_GAPS = {
  title: { tr: "Boş kadrajlar", en: "Empty frames" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bütün kadrajlar dolu — bu sayfada yüklenecek görsel kalmadı.",
    en: "Every frame is filled — there is nothing left to upload on this page.",
  },
};
