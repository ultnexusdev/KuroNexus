import type { Localized } from "./types";

/**
 * P11 · KIYIM OYUNU — koloni haritası + kural defteri.
 *
 * Bölümün tezi: oyun bir turnuva değil, KURAL ÜRETME MAKİNESİ. Puan
 * biriktiren oyuncu kuralın kendisini değiştirebiliyor; Kenjaku için amaç
 * kazanmak değil, sistemin yeniden yazılması.
 *
 * On koloninin dördü açık kayıt, altısı "kayıt kapalı" — Parmaklar
 * bölümündeki aynı karar: eksik, arşivin kendi dili.
 *
 * ⚠️ Canon düzeltmesi (30 Ağustos 2026, fandom doğrulandı): Sakurajima
 * kolonisinin üçüncü oyuncusu Noritoshi Kamo — mockup Higuruma yazıyordu
 * (Higuruma'nın kaydı Tokyo No. 1'de; aynı ismin iki kolonide durması
 * arşiv mantığında da çelişkiydi).
 */
export interface Colony {
  /** "01"–"10" — kayıt numarası, ÇEVRİLMEZ */
  no: string;
  /** Açık kayıtlarda yerleşik ad; kapalılarda sözlükten "kayıt kapalı" gelir */
  name: Localized | null;
  /** ÇEVRİLMEZ — kanji */
  jp: string;
  /** Harita koordinatı — yüzde, harita kutusuna göre */
  x: number;
  y: number;
  open: boolean;
  /** ÇEVRİLMEZ oyuncu adları — ayraç " · " */
  players: string | null;
  events: Localized | null;
  note: Localized;
}

const CLOSED_NOTE: Localized = {
  tr: "Koloni açıldı, oyuncu listesi arşive geçmedi.",
  en: "The colony opened; its player list never reached the archive.",
};

function closedColony(no: string, x: number, y: number): Colony {
  return {
    no,
    name: null,
    jp: "結界",
    x,
    y,
    open: false,
    players: null,
    events: null,
    note: CLOSED_NOTE,
  };
}

export const COLONIES: readonly Colony[] = [
  {
    no: "01",
    name: { tr: "Tokyo No.1" },
    jp: "東京第1結界",
    x: 62,
    y: 58,
    open: true,
    players: "Yuji Itadori · Megumi Fushiguro · Hiromi Higuruma · Hajime Kashimo",
    events: {
      tr: "Higuruma'nın alanı ilk kez sahada görülür. Yuji burada bir yargılamadan geçer.",
      en: "Higuruma's domain is seen in the field for the first time. Yuji stands trial here.",
    },
    note: {
      tr: "Oyunun en yoğun kolonisi. Puan ekonomisi hızlı, kural değişikliği talepleri en çok buradan geldi.",
      en: "The busiest colony in the game. Its point economy ran hot, and most rule-change petitions came from here.",
    },
  },
  {
    no: "02",
    name: { tr: "Tokyo No.2" },
    jp: "東京第2結界",
    x: 71,
    y: 49,
    open: true,
    players: "Kinji Hakari · Kirara Hoshi · Charles Bernard",
    events: {
      tr: "Hakari alanını tam kapasiteyle açar; jackpot süresi boyunca koloni fiilen tek kişilik olur.",
      en: "Hakari opens his domain at full tilt; for the length of a jackpot, the colony effectively has one player.",
    },
    note: {
      tr: "Hakari'nin kolonisi. Oyun kurallarını kendi lehine çeviren tek oyuncu profili burada oluştu.",
      en: "Hakari's colony. The one player profile that bent the game's rules to its own favour formed here.",
    },
  },
  {
    no: "03",
    name: { tr: "Sendai" },
    jp: "仙台結界",
    x: 74,
    y: 40,
    open: true,
    players: "Yuta Okkotsu · Takako Uro · Ryu Ishigori · Dhruv Lakdawalla",
    events: {
      tr: "Yuta kopyaladığı teknikleri sırayla test eder; antik büyücülerle ilk büyük çarpışma.",
      en: "Yuta field-tests his copied techniques one by one; the first major clash with the ancient sorcerers.",
    },
    note: {
      tr: "Bin yıl önceki büyücülerin bugünün büyücüleriyle ölçüldüğü koloni.",
      en: "The colony where sorcerers from a thousand years ago are measured against today's.",
    },
  },
  {
    no: "04",
    name: { tr: "Sakurajima" },
    jp: "桜島結界",
    x: 26,
    y: 78,
    open: true,
    players: "Maki Zenin · Naoya Zenin · Noritoshi Kamo",
    events: {
      tr: "Zenin mirasının kapanışı. Maki lanetli enerjisiz bedeninin sınırını burada gösterir.",
      en: "The closing of the Zenin inheritance. Maki shows the limit of a body without cursed energy here.",
    },
    note: {
      tr: "Coğrafi olarak en sert koloni; volkanik alan oyun kurallarına ek kısıt getirdi.",
      en: "Geographically the harshest colony; the volcanic ground added its own constraints to the rules.",
    },
  },
  closedColony("05", 44, 66),
  closedColony("06", 52, 46),
  closedColony("07", 82, 28),
  closedColony("08", 31, 74),
  closedColony("09", 56, 29),
  closedColony("10", 70, 66),
];

/** Kural defteri — numara ÇEVRİLMEZ, metin çevrilir. */
export const CULLING_RULES: readonly { no: string; text: Localized }[] = [
  {
    no: "01",
    text: {
      tr: "Oyuncu, oyuna girdikten sonra 19 gün içinde en az bir kez puan almak zorundadır. Almazsa lanetli tekniğini kaybeder.",
      en: "A player must score at least once within 19 days of entering the game. Fail, and the cursed technique is stripped.",
    },
  },
  {
    no: "02",
    text: {
      tr: "Bir oyuncuyu öldürmek 5 puan; sivil öldürmek 1 puan değerindedir.",
      en: "Killing a player is worth 5 points; killing a civilian, 1.",
    },
  },
  {
    no: "03",
    text: {
      tr: "Koloniden çıkmak 100 puan gerektirir.",
      en: "Leaving a colony costs 100 points.",
    },
  },
  {
    no: "04",
    text: {
      tr: "Yeni bir kural eklemek 100 puan gerektirir ve teklif kabul edilmelidir.",
      en: "Adding a new rule costs 100 points, and the proposal must be accepted.",
    },
  },
  {
    no: "05",
    text: {
      tr: "Oyuncular ilk girişte lanetli tekniklerini onaylatır; sonradan gizlemek mümkün değildir.",
      en: "Players register their cursed technique on entry; hiding it afterwards is impossible.",
    },
  },
];
