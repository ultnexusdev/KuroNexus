import type { Localized } from "./types";

/**
 * P10 · SHIBUYA OLAYI — operasyon odası.
 *
 * Bölümün tezi: bu gece kronolojik bir liste olarak okunmaz, bir OPERASYON
 * HATTI olarak okunur. Saat seçilince haritadaki aktör iğneleri o âna göre
 * konum değiştirir (kullanıcı kararı, 30 Ağustos 2026: zaman hattı ile
 * harita tek odada) — iki ayrı grafik değil, tek kayıt.
 *
 * ── KOORDİNAT SÖZLEŞMESİ ─────────────────────────────────────────────────
 * `x/y` yüzde (0–100), haritanın kendi kutusuna göre. Kaynak: mockup'ın
 * ölçülmüş değerleri. Aktör başına saat karesi `POSITIONS[stopIndex]`;
 * `null` o saatte sahnede olmadığı anlamına gelir (Gojo 20:31'den sonra
 * `null` — mühürlendi; iğnesi haritadan DÜŞER, soluklaşmaz).
 *
 * Saatler arşiv kaydına göre YAKLAŞIKTIR — bölüm girişi bunu açıkça söylüyor.
 */
export interface ShibuyaStop {
  /** ÇEVRİLMEZ — saat etiketi */
  t: string;
  /** Zaman hattındaki kısa durak adı */
  st: Localized;
  place: Localized;
  title: Localized;
  body: Localized;
  /** Kayıttaki fail/özne satırı — adlar çevrilmez, bağlaçlar çevrilir */
  who: string;
}

export const SHIBUYA_STOPS: readonly ShibuyaStop[] = [
  {
    t: "18:00",
    st: { tr: "Shibuya İstasyonu", en: "Shibuya Station" },
    place: { tr: "Shibuya İstasyonu — çevre hat", en: "Shibuya Station — perimeter" },
    title: { tr: "Perde iner", en: "The curtain falls" },
    body: {
      tr: "Kenjaku iki katmanlı bir perde kurar: siviller içeride kalır, büyücüler dışarıda tutulur. Amaç tek bir kişiyi belirli bir noktaya çekmektir.",
      en: "Kenjaku raises a two-layer curtain: civilians are kept in, sorcerers are kept out. The goal is to draw one person to one point.",
    },
    who: "Kenjaku",
  },
  {
    t: "19:00",
    st: { tr: "B5F", en: "B5F" },
    place: { tr: "Yer altı — 5. bodrum katı", en: "Underground — basement level 5" },
    title: { tr: "Gojo iner", en: "Gojo descends" },
    body: {
      tr: "Gojo yer altına indiğinde binden fazla değişim geçirmiş insanla karşılaşır. Sivilleri koruma zorunluluğu, gücünü ilk kez ciddi biçimde sınırlayan şey olur.",
      en: "Underground, Gojo meets more than a thousand transfigured humans. The duty to protect civilians becomes the first real limit on his power.",
    },
    who: "Satoru Gojo",
  },
  {
    t: "19:30",
    st: { tr: "Dagon'un Alanı", en: "Dagon's Domain" },
    place: { tr: "Dagon'un alanı", en: "Inside Dagon's domain" },
    title: { tr: "Alan içinde kalanlar", en: "Trapped in the domain" },
    body: {
      tr: "Nanami, Maki ve Naobito Dagon'un alanına kapanır. Kesin isabet kuralı devreye girdiğinde hayatta kalmak savaşmakla ilgili olmayı bırakır.",
      en: "Nanami, Maki and Naobito are shut inside Dagon's domain. Once the sure-hit rule engages, survival stops being about fighting.",
    },
    who: "Nanami · Maki · Naobito",
  },
  {
    t: "20:00",
    st: { tr: "Toji Fushiguro", en: "Toji Fushiguro" },
    place: { tr: "Alanın kıyısı", en: "The domain's shore" },
    title: { tr: "Toji ortaya çıkar", en: "Toji appears" },
    body: {
      tr: "Lanetli enerjisiz beden alana dışarıdan girer ve Dagon'u tek hamlede keser. Ardından Megumi ile karşılaşır — kayıt bu satırda kesilir.",
      en: "A body with no cursed energy enters the domain from outside and cuts Dagon down in one motion. Then he meets Megumi — the record cuts here.",
    },
    who: "Toji Fushiguro",
  },
  {
    t: "20:31",
    st: { tr: "Zindan Diyarı", en: "Prison Realm" },
    place: { tr: "Shibuya İstasyonu — ana hol", en: "Shibuya Station — main concourse" },
    title: { tr: "Gojo mühürlenir", en: "Gojo is sealed" },
    body: {
      tr: "Zindan Diyarı açılır. Shibuya bir savaş değildi; tek bir mühürleme işleminin etrafına kurulmuş bir tuzaktı. Dengeyi tutan adam bu saatte listeden düşer.",
      en: "The Prison Realm opens. Shibuya was never a war; it was a trap built around a single sealing. At this hour, the man holding the balance drops off the board.",
    },
    who: "Kenjaku",
  },
  {
    t: "21:00",
    st: { tr: "Mahito", en: "Mahito" },
    place: { tr: "Yer üstü — cadde", en: "Street level" },
    title: { tr: "Nanami ve Nobara", en: "Nanami and Nobara" },
    body: {
      tr: "Mahito iki kaybı arka arkaya kayda geçirir. Nanami'nin son cümlesi Yuji'ye bırakılmış bir görevdir; Nobara'nın durumu bugün hâlâ belirsiz.",
      en: "Mahito enters two losses into the record back to back. Nanami's last sentence is a task left to Yuji; Nobara's status is still unresolved.",
    },
    who: "Mahito",
  },
  {
    t: "22:00",
    st: { tr: "Mahoraga", en: "Mahoraga" },
    place: { tr: "Yer altı — çöken hat", en: "Underground — the collapsed line" },
    title: { tr: "Mahoraga çağrılır", en: "Mahoraga is summoned" },
    body: {
      tr: "Megumi, öleceğini bilerek Mahoraga'yı çağırır. Sukuna devralır, adaptasyonu kırar ve yıkım Shibuya'nın büyük kısmını siler.",
      en: "Knowing it will kill him, Megumi summons Mahoraga. Sukuna takes over, breaks the adaptation, and the destruction erases most of Shibuya.",
    },
    who: "Megumi · Sukuna",
  },
  {
    t: "22:30",
    st: { tr: "Siyah Şimşek", en: "Black Flash" },
    place: { tr: "Yer üstü — kesişme", en: "Street level — the crossing" },
    title: { tr: "Yuji ve Todo", en: "Yuji and Todo" },
    body: {
      tr: "Kopyalanmış teknik ve kardeşlik anlaşması. Zincirleme siyah şimşekler Mahito'nun ruhunu ilk kez gerçekten hedef alır.",
      en: "A borrowed technique and a brotherhood pact. Chained black flashes target Mahito's soul for the first time in earnest.",
    },
    who: "Yuji · Aoi Todo",
  },
  {
    t: "23:00",
    st: { tr: "Kenjaku", en: "Kenjaku" },
    place: { tr: "Perde sınırı", en: "The curtain's edge" },
    title: { tr: "Kenjaku görünür", en: "Kenjaku steps out" },
    body: {
      tr: "Geto'nun bedeniyle sahaya çıkar ve planın Shibuya'yla bitmediğini duyurur. Karargâh ertesi gün suçluyu bulur: Yuji Itadori ve okulun kendisi.",
      en: "He takes the field in Geto's body and announces the plan does not end with Shibuya. By morning, headquarters has found its culprits: Yuji Itadori and the school itself.",
    },
    who: "Kenjaku",
  },
];

/** Haritadaki sabit duraklar — adlar Japonca yer adı, ÇEVRİLMEZ olanlar kanji taşıyor. */
export interface ShibuyaStation {
  name: Localized;
  x: number;
  y: number;
}

export const SHIBUYA_STATIONS: readonly ShibuyaStation[] = [
  { name: { tr: "Shibuya İstasyonu", en: "Shibuya Station" }, x: 50, y: 58 },
  { name: { tr: "B5 — yer altı", en: "B5 — underground" }, x: 44, y: 82 },
  { name: { tr: "Meiji Caddesi", en: "Meiji Avenue" }, x: 26, y: 40 },
  { name: { tr: "Yer altı geçidi", en: "Underground passage" }, x: 64, y: 74 },
  { name: { tr: "Miyamasuzaka Yokuşu", en: "Miyamasuzaka slope" }, x: 76, y: 46 },
  { name: { tr: "Dış çember — Perde", en: "Outer ring — the curtain" }, x: 16, y: 18 },
];

/**
 * Aktörler. Renkler globals.css `[data-world="jjk"]` bloğundaki
 * `--actor-*` token'larından okunur (kural 16) — burada yalnızca kimlik.
 */
export const SHIBUYA_ACTORS = [
  { key: "gojo", name: "Gojo" },
  { key: "yuji", name: "Yuji" },
  { key: "sukuna", name: "Sukuna" },
  { key: "mahito", name: "Mahito" },
  { key: "kenjaku", name: "Kenjaku" },
] as const;
export type ShibuyaActorKey = (typeof SHIBUYA_ACTORS)[number]["key"];

/**
 * Durak başına aktör konumları — `SHIBUYA_STOPS` ile AYNI uzunlukta olmak
 * zorunda (denetim: `check-jjk-i18n` değil, tip düzeyinde uzunluk kontrolü
 * yapılamadığı için `ShibuyaMap` çiziminde `POSITIONS[stopIndex] ?? {}`
 * savunması var). `null` = o saatte sahnede değil.
 */
export type StopPositions = Record<ShibuyaActorKey, readonly [number, number] | null>;

export const SHIBUYA_POSITIONS: readonly StopPositions[] = [
  { gojo: [16, 20], yuji: [80, 24], mahito: [64, 74], kenjaku: [16, 18], sukuna: null },
  { gojo: [44, 82], yuji: [72, 30], mahito: [62, 72], kenjaku: [22, 26], sukuna: null },
  { gojo: [46, 76], yuji: [66, 44], mahito: [60, 70], kenjaku: [26, 30], sukuna: null },
  { gojo: [48, 70], yuji: [60, 56], mahito: [58, 68], kenjaku: [30, 34], sukuna: null },
  { gojo: [50, 58], yuji: [58, 60], mahito: [56, 66], kenjaku: [50, 56], sukuna: null },
  { gojo: null, yuji: [62, 52], mahito: [64, 50], kenjaku: [46, 44], sukuna: null },
  { gojo: null, yuji: [58, 66], mahito: [70, 44], kenjaku: [40, 38], sukuna: [56, 70] },
  { gojo: null, yuji: [74, 44], mahito: [76, 46], kenjaku: [34, 30], sukuna: [58, 72] },
  { gojo: null, yuji: [70, 50], mahito: null, kenjaku: [16, 18], sukuna: [60, 66] },
];
