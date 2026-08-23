import type { Localized } from "./types";

/**
 * GOTEI 13 — ON ÜÇ BÖLÜK.
 *
 * ── ÇİÇEKLER FANDOM'DAN DOĞRULANDI ───────────────────────────────────────
 * Brief'in kuralı: "Tüm isim/kanji/Zanpakutō/Schrift verilerini
 * bleach.fandom.com üzerinden doğrula. Emin olmadığın alanı uydurma."
 *
 * Çiçekler ve anlamları 23 Ağustos 2026'da `bleach.fandom.com/wiki/Gotei_13`
 * sayfasının wikitext'inden okundu (MediaWiki API; sayfanın HTML'i 403
 * veriyor, `api.php?action=parse&prop=wikitext` vermiyor).
 *
 * ⚠️ Doğrulama işe yaradı: hafızadan yazılsaydı en az üçü yanlış olurdu.
 * 11. bölüğün çiçeği porsuk ağacı DEĞİL civanperçemi (yarrow), 2. bölüğünki
 * mor erik değil dağ lalesi (pasque flower), 9. bölüğün anlamı "boşluk"
 * değil "unutuş" (oblivion).
 *
 * ── ZANPAKUTŌ / BANKAI: BİLİNMEYEN `null` ────────────────────────────────
 * Bazı kaptanların Zanpakutō'su ya da Bankai'ı canon'da hiç açıklanmadı
 * (Aizen'in Bankai'ı, Ukitake'nin Bankai'ı, Kenpachi'nin Bankai adı, Iba'nın
 * kılıcı…). Bunlar `null` bırakıldı ve arayüz "kayıt yok" durumunu zarifçe
 * gösteriyor — brief'in kendi kuralı: "bir arşivin en güvenilir yanı,
 * bilmediğini söylemesidir."
 *
 * ── İKİ ZAMAN KİPİ ───────────────────────────────────────────────────────
 * Kadro TYBW'den önce ve sonra köklü biçimde değişiyor. Hiçbir wiki bu iki
 * tabloyu yan yana göstermiyor; sayfanın "arşivci" kimliğini kanıtlayan şey
 * bu. TYBW kadrosu fandom'dan; klasik kadro Soul Society yayı düzeni.
 *
 * ── REIATSU RENGİ ────────────────────────────────────────────────────────
 * ⚠️ Kural 16 istisnası, kasıtlı: bu renkler TEMA token'ı değil VERİ —
 * karakterin canon'daki reiatsu rengi. `DriverStanding.teamColor` ve
 * `NARUTO_BIJUU.accent` ile aynı sınıf. Tema değişse de bu renk değişmez.
 */

export interface DivisionOfficer {
  name: string;
  /** Canon'da açıklanmamışsa `null` — arayüz "kayıt yok" çiziyor */
  zanpakuto: string | null;
  bankai: string | null;
}

export interface DivisionRecord {
  n: number;
  /** 一 … 十三 */
  kanji: string;
  /** Bölüğün çiçeği — fandom'dan doğrulandı */
  flower: {
    /** Japonca ad (Shippori ile diziliyor) */
    ja: string;
    /** Latin ad; çevrilmez, botanik adı */
    en: string;
    meaning: Localized;
    /** Line-art çiziminin biçim ailesi (`DivisionFlower`) */
    shape: FlowerShape;
  };
  /** Canon'da açıkça yazılıysa; yoksa `null` (panelde "—") */
  specialty: Localized | null;
  /** Kaptanın reiatsu rengi — VERİ, token değil */
  reiatsu: string;
  classic: { captain: DivisionOfficer; lieutenant: string | null };
  tybw: { captain: DivisionOfficer; lieutenant: string | null };
}

export type FlowerShape =
  | "chrysanthemum"
  | "pasque"
  | "marigold"
  | "bellflower"
  | "lily"
  | "camellia"
  | "iris"
  | "strelitzia"
  | "poppy"
  | "daffodil"
  | "yarrow"
  | "thistle"
  | "snowdrop";

export const DIVISIONS: readonly DivisionRecord[] = [
  {
    n: 1,
    kanji: "一",
    flower: {
      ja: "菊",
      en: "Chrysanthemum",
      meaning: { tr: "Hakikat ve masumiyet", en: "Truth and innocence" },
      shape: "chrysanthemum",
    },
    specialty: { tr: "Komuta", en: "Command" },
    reiatsu: "#C4341A",
    classic: {
      captain: {
        name: "Genryūsai Shigekuni Yamamoto",
        zanpakuto: "流刃若火 Ryūjin Jakka",
        bankai: "残火の太刀 Zanka no Tachi",
      },
      lieutenant: "Chōjirō Sasakibe",
    },
    tybw: {
      captain: {
        name: "Shunsui Kyōraku",
        zanpakuto: "花天狂骨 Katen Kyōkotsu",
        bankai: "花天狂骨枯松心中 Katen Kyōkotsu: Karamatsu Shinjū",
      },
      lieutenant: "Nanao Ise · Genshirō Okikiba",
    },
  },
  {
    n: 2,
    kanji: "二",
    flower: {
      ja: "翁草",
      en: "Pasque flower",
      meaning: { tr: "Hiçbir şey arama", en: "Seek nothing" },
      shape: "pasque",
    },
    specialty: { tr: "Onmitsukidō — gizli harekât", en: "Onmitsukidō — covert ops" },
    reiatsu: "#D8B94A",
    classic: {
      captain: {
        name: "Suì-Fēng",
        zanpakuto: "雀蜂 Suzumebachi",
        bankai: "雀蜂雷公鞭 Jakuhō Raikōben",
      },
      lieutenant: "Marechiyo Ōmaeda",
    },
    tybw: {
      captain: {
        name: "Suì-Fēng",
        zanpakuto: "雀蜂 Suzumebachi",
        bankai: "雀蜂雷公鞭 Jakuhō Raikōben",
      },
      lieutenant: "Marechiyo Ōmaeda",
    },
  },
  {
    n: 3,
    kanji: "三",
    flower: {
      ja: "金盞花",
      en: "Marigold",
      meaning: { tr: "Umutsuzluk", en: "Despair" },
      shape: "marigold",
    },
    specialty: null,
    reiatsu: "#8FB8D6",
    classic: {
      captain: {
        name: "Gin Ichimaru",
        zanpakuto: "神鎗 Shinsō",
        bankai: "神殺鎗 Kamishini no Yari",
      },
      lieutenant: "Izuru Kira",
    },
    tybw: {
      captain: {
        name: "Rōjūrō Ōtoribashi",
        zanpakuto: "金沙羅 Kinshara",
        bankai: "金沙羅舞踏団 Kinshara Butōdan",
      },
      lieutenant: "Izuru Kira",
    },
  },
  {
    n: 4,
    kanji: "四",
    flower: {
      ja: "桔梗",
      en: "Bellflower",
      meaning: {
        tr: "Yas tutanlar sevilenlerdir",
        en: "Those who grieve are loved",
      },
      shape: "bellflower",
    },
    specialty: { tr: "Tıp ve ikmal", en: "Medicine and supply" },
    reiatsu: "#C9C4BA",
    classic: {
      captain: {
        name: "Retsu Unohana",
        zanpakuto: "肉雫唼 Minazuki",
        bankai: "皆尽 Minazuki",
      },
      lieutenant: "Isane Kotetsu",
    },
    tybw: {
      captain: { name: "Isane Kotetsu", zanpakuto: "凍雲 Itegumo", bankai: null },
      lieutenant: "Kiyone Kotetsu",
    },
  },
  {
    n: 5,
    kanji: "五",
    flower: {
      ja: "鈴蘭",
      en: "Lily of the valley",
      meaning: {
        tr: "Fedakârlık, tehlike, saf sevgi",
        en: "Sacrifice, danger, pure love",
      },
      shape: "lily",
    },
    specialty: null,
    reiatsu: "#6B4E9E",
    classic: {
      captain: {
        name: "Sōsuke Aizen",
        zanpakuto: "鏡花水月 Kyōka Suigetsu",
        bankai: null,
      },
      lieutenant: "Momo Hinamori",
    },
    tybw: {
      captain: {
        name: "Shinji Hirako",
        zanpakuto: "逆撫 Sakanade",
        bankai: "逆さ邪八宝塞 Sakashima Yokoshima Happōfusagari",
      },
      lieutenant: "Momo Hinamori",
    },
  },
  {
    n: 6,
    kanji: "六",
    flower: {
      ja: "椿",
      en: "Camellia",
      meaning: { tr: "Soylu akıl", en: "Noble reason" },
      shape: "camellia",
    },
    specialty: null,
    reiatsu: "#C2536B",
    classic: {
      captain: {
        name: "Byakuya Kuchiki",
        zanpakuto: "千本桜 Senbonzakura",
        bankai: "千本桜景厳 Senbonzakura Kageyoshi",
      },
      lieutenant: "Renji Abarai",
    },
    tybw: {
      captain: {
        name: "Byakuya Kuchiki",
        zanpakuto: "千本桜 Senbonzakura",
        bankai: "千本桜景厳 Senbonzakura Kageyoshi",
      },
      lieutenant: "Renji Abarai",
    },
  },
  {
    n: 7,
    kanji: "七",
    flower: {
      ja: "菖蒲",
      en: "Iris",
      meaning: { tr: "Cesaret", en: "Courage" },
      shape: "iris",
    },
    specialty: null,
    reiatsu: "#8A5A2B",
    classic: {
      captain: {
        name: "Sajin Komamura",
        zanpakuto: "天譴 Tenken",
        bankai: "黒縄天譴明王 Kokujō Tengen Myō'ō",
      },
      lieutenant: "Tetsuzaemon Iba",
    },
    tybw: {
      captain: { name: "Tetsuzaemon Iba", zanpakuto: null, bankai: null },
      lieutenant: "Atau Rindō",
    },
  },
  {
    n: 8,
    kanji: "八",
    flower: {
      ja: "極楽鳥花",
      en: "Bird of paradise",
      meaning: { tr: "Her şey elde edilir", en: "Everything is obtained" },
      shape: "strelitzia",
    },
    specialty: null,
    reiatsu: "#C88A2E",
    classic: {
      captain: {
        name: "Shunsui Kyōraku",
        zanpakuto: "花天狂骨 Katen Kyōkotsu",
        bankai: "花天狂骨枯松心中 Katen Kyōkotsu: Karamatsu Shinjū",
      },
      lieutenant: "Nanao Ise",
    },
    tybw: {
      captain: {
        name: "Lisa Yadōmaru",
        zanpakuto: "羽黒蜻蛉 Haguro Tonbo",
        bankai: null,
      },
      lieutenant: "Yuyu Yayahara",
    },
  },
  {
    n: 9,
    kanji: "九",
    flower: {
      ja: "白罌粟",
      en: "White poppy",
      meaning: { tr: "Unutuş", en: "Oblivion" },
      shape: "poppy",
    },
    specialty: null,
    reiatsu: "#4A7C59",
    classic: {
      captain: {
        name: "Kaname Tōsen",
        zanpakuto: "鈴虫 Suzumushi",
        bankai: "鈴虫終式 閻魔蟋蟀 Suzumushi Tsuishiki: Enma Kōrogi",
      },
      lieutenant: "Shūhei Hisagi",
    },
    tybw: {
      captain: {
        name: "Kensei Muguruma",
        zanpakuto: "風死 Tachikaze",
        bankai: "鉄拳風死 Tekken Tachikaze",
      },
      lieutenant: "Shūhei Hisagi · Mashiro Kuna",
    },
  },
  {
    n: 10,
    kanji: "十",
    flower: {
      ja: "水仙",
      en: "Daffodil",
      meaning: { tr: "Gizem, benmerkezcilik", en: "Mystery, egoism" },
      shape: "daffodil",
    },
    specialty: null,
    reiatsu: "#7FC7D9",
    classic: {
      captain: {
        name: "Tōshirō Hitsugaya",
        zanpakuto: "氷輪丸 Hyōrinmaru",
        bankai: "大紅蓮氷輪丸 Daiguren Hyōrinmaru",
      },
      lieutenant: "Rangiku Matsumoto",
    },
    tybw: {
      captain: {
        name: "Tōshirō Hitsugaya",
        zanpakuto: "氷輪丸 Hyōrinmaru",
        bankai: "大紅蓮氷輪丸 Daiguren Hyōrinmaru",
      },
      lieutenant: "Rangiku Matsumoto",
    },
  },
  {
    n: 11,
    kanji: "十一",
    flower: {
      ja: "鋸草",
      en: "Yarrow",
      meaning: { tr: "Dövüş", en: "Fight" },
      shape: "yarrow",
    },
    specialty: { tr: "Yakın dövüş", en: "Direct combat" },
    reiatsu: "#D9C89A",
    classic: {
      captain: { name: "Kenpachi Zaraki", zanpakuto: "野晒 Nozarashi", bankai: null },
      lieutenant: "Yachiru Kusajishi",
    },
    tybw: {
      captain: { name: "Kenpachi Zaraki", zanpakuto: "野晒 Nozarashi", bankai: null },
      lieutenant: "Ikkaku Madarame",
    },
  },
  {
    n: 12,
    kanji: "十二",
    flower: {
      ja: "薊",
      en: "Thistle",
      meaning: {
        tr: "İntikam, katılık, bağımsızlık",
        en: "Vengeance, strictness, independence",
      },
      shape: "thistle",
    },
    specialty: {
      tr: "Teknoloji Geliştirme Bürosu",
      en: "Shinigami Research Institute",
    },
    reiatsu: "#9BC53D",
    classic: {
      captain: {
        name: "Mayuri Kurotsuchi",
        zanpakuto: "疋殺地蔵 Ashisogi Jizō",
        bankai: "金色疋殺地蔵 Konjiki Ashisogi Jizō",
      },
      lieutenant: "Nemu Kurotsuchi",
    },
    tybw: {
      captain: {
        name: "Mayuri Kurotsuchi",
        zanpakuto: "疋殺地蔵 Ashisogi Jizō",
        bankai: "金色疋殺地蔵 Konjiki Ashisogi Jizō",
      },
      lieutenant: "Akon",
    },
  },
  {
    n: 13,
    kanji: "十三",
    flower: {
      ja: "待雪草",
      en: "Snowdrop",
      meaning: { tr: "Umut", en: "Hope" },
      shape: "snowdrop",
    },
    specialty: null,
    reiatsu: "#DCEAF2",
    classic: {
      captain: {
        name: "Jūshirō Ukitake",
        zanpakuto: "双魚理 Sōgyo no Kotowari",
        bankai: null,
      },
      lieutenant: null,
    },
    tybw: {
      captain: {
        name: "Rukia Kuchiki",
        zanpakuto: "袖白雪 Sode no Shirayuki",
        bankai: "白霞罰 Hakka no Togame",
      },
      lieutenant: "Sentarō Kotsubaki",
    },
  },
];

/** İki zaman kipi — brief'in "hiçbir wiki'de olmayan" UX kararı */
export const ERAS = ["classic", "tybw"] as const;
export type Era = (typeof ERAS)[number];

/**
 * Kapının daire üzerindeki yeri.
 *
 * ⚠️ SVG DEĞİL, HTML. Kapılar gerçek `<button>` — klavye gezinmesi, odak
 * halkası ve semantik kendiliğinden geliyor. SVG içinde etkileşimli öğe
 * kurmak üçünü de elle yeniden yazmak demekti.
 *
 * Açı tepeden başlıyor (−90°) ve saat yönünde ilerliyor: 一 en üstte,
 * 十三 solda — brief'in şemasıyla aynı sıra.
 */
export function gateAngle(index: number): number {
  return -90 + (index * 360) / DIVISIONS.length;
}

/** Birim çember üzerindeki konum, yüzde olarak (CSS `--x` / `--y`) */
export function gatePosition(index: number): { x: number; y: number } {
  const rad = (gateAngle(index) * Math.PI) / 180;
  return {
    x: Number((50 + Math.cos(rad) * 40).toFixed(3)),
    y: Number((50 + Math.sin(rad) * 40).toFixed(3)),
  };
}
