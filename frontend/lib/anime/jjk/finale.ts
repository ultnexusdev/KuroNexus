import type { Localized } from "./types";

/**
 * P12 · SON KAYIT — yaylar ↔ kayıplar.
 *
 * Bölümün tezi: solda hikâyenin geçtiği yollar, sağda kayda geçen kayıplar;
 * iki liste yan yana durduğunda serinin asıl konusu görünür hâle gelir.
 *
 * ── KAPSAM KARARI (kullanıcı, 30 Ağustos 2026) ───────────────────────────
 * Sayfa "tasarımdaki kapsam"la açılıyor: son büyük bölüm Kıyım Oyunu.
 * Yay listesi yine de Shinjuku'yu SAYIYOR (yedinci satır) ve kayıplar
 * sicili Shinjuku kayıtlarını taşıyor — mockup'ın bilinçli kararı: arşiv
 * kapanış satırının VARLIĞINI biliyor, ayrıntısını anlatmıyor. Shinjuku'yu
 * kendi bölümüne genişletmek ayrı bir tur (bkz. docs devir notu).
 *
 * "Liste eksiktir." kapanış cümlesi tasarımın kendisi — tamamlamaya çalışma.
 */
export interface StoryArc {
  /** ÇEVRİLMEZ — yayın kanjisi */
  jp: string;
  name: Localized;
  body: Localized;
}

export const STORY_ARCS: readonly StoryArc[] = [
  {
    jp: "虎杖悠仁",
    name: { tr: "Yuji Itadori'nin İnfazı", en: "The Execution of Yuji Itadori" },
    body: {
      tr: "Kap bulunur, idam kararı ertelenir. Arşivin başlangıç kaydı.",
      en: "A vessel is found; the execution is deferred. The archive's opening record.",
    },
  },
  {
    jp: "呪胎九相図",
    name: { tr: "Lanetli Rahim: Ölüm Resmi", en: "Cursed Womb: Death Paintings" },
    body: {
      tr: "Islahevi görevi ve ikinci parmak. Junpei'nin dosyası burada kapanır.",
      en: "The detention centre assignment and the second finger. Junpei's file closes here.",
    },
  },
  {
    jp: "交流会",
    name: { tr: "Kyoto Kardeş Okul Etkinliği", en: "The Kyoto Goodwill Event" },
    body: {
      tr: "İki okul karşı karşıya gelirken lanetler perdeyi içeriden yırtar.",
      en: "While the two schools face off, the curses tear the curtain from inside.",
    },
  },
  {
    jp: "渋谷事変",
    name: { tr: "Shibuya Olayı — 31 Ekim", en: "The Shibuya Incident — October 31" },
    body: {
      tr: "Gojo mühürlenir, kayıplar başlar, suç okula yazılır.",
      en: "Gojo is sealed, the losses begin, and the blame is written to the school.",
    },
  },
  {
    jp: "禪院家",
    name: { tr: "Kusursuz Hazırlık", en: "Perfect Preparation" },
    body: {
      tr: "Maki, Zenin ailesini tek başına siler. Mai'nin bıraktığı tek kurşun.",
      en: "Maki erases the Zenin clan alone. The single bullet Mai left behind.",
    },
  },
  {
    jp: "死滅回游",
    name: { tr: "Kıyım Oyunu", en: "The Culling Game" },
    body: {
      tr: "Kenjaku planı sahaya sürer; Japonya on koloniye bölünür.",
      en: "Kenjaku puts the plan on the board; Japan is split into ten colonies.",
    },
  },
  {
    jp: "新宿決戦",
    name: { tr: "Shinjuku Hesaplaşması", en: "The Shinjuku Showdown" },
    body: {
      tr: "Yirminci parmak tamamlanır. Arşivin son kaydı burada yazılır.",
      en: "The twentieth finger is complete. The archive's final record is written here.",
    },
  },
];

/** Kayıplar sicili — adlar ÇEVRİLMEZ, yer/koşul çevrilir. */
export interface LossRecord {
  name: string;
  where: Localized;
}

export const LOSSES: readonly LossRecord[] = [
  { name: "Kento Nanami", where: { tr: "Shibuya Olayı", en: "the Shibuya Incident" } },
  { name: "Naobito Zenin", where: { tr: "Shibuya Olayı", en: "the Shibuya Incident" } },
  {
    name: "Nobara Kugisaki",
    where: { tr: "Shibuya — durum belirsiz", en: "Shibuya — status unknown" },
  },
  {
    name: "Kokichi Muta",
    where: {
      tr: "Kardeş Okul Etkinliği sonrası",
      en: "after the Goodwill Event",
    },
  },
  { name: "Mai Zenin", where: { tr: "Kusursuz Hazırlık", en: "Perfect Preparation" } },
  {
    name: "Masamichi Yaga",
    where: { tr: "Shibuya sonrası infaz", en: "executed after Shibuya" },
  },
  {
    name: "Suguru Geto",
    where: { tr: "beden gasp edildi", en: "body stolen" },
  },
  {
    name: "Yuki Tsukumo",
    where: { tr: "Kenjaku ile karşılaşma", en: "the encounter with Kenjaku" },
  },
  {
    name: "Satoru Gojo",
    where: { tr: "Shinjuku Hesaplaşması", en: "the Shinjuku Showdown" },
  },
  {
    name: "Kinji Hakari",
    where: { tr: "Shinjuku — ağır kayıp", en: "Shinjuku — grave injury" },
  },
  {
    name: "Hiromi Higuruma",
    where: { tr: "Shinjuku Hesaplaşması", en: "the Shinjuku Showdown" },
  },
  {
    name: "Ryomen Sukuna",
    where: { tr: "Shinjuku Hesaplaşması", en: "the Shinjuku Showdown" },
  },
];
