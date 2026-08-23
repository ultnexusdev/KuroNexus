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
  /**
   * Bölüğün KAYDI — panelde adların üstünde duran iki-üç cümle (P18-c).
   *
   * ⚠️ `specialty` etiketinin tekrarı değil: etiket "ne"yi, bu alan
   * "neden hatırlanıyor"u söylüyor. Canon çapaları bölük sayfalarının
   * "Special Duties" bölümlerinden (fandom, 23 Ağustos 2026); özel görevi
   * olmayan bölüklerde cümle, kadro kayıtlarındaki DOĞRULANMIŞ olaylara
   * yaslanıyor (Gin'in gidişi, Kyōraku'nun yükselişi, Rukia'nın ihlali).
   */
  about: Localized;
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
    about: {
      tr: "Başkomutanın bölüğü ve ordunun ölçütü: sıradan üyeleri bile örnek Shinigami sayılır. Gerçek değeri kayıtlara şöyle geçti — emir daha verilmeden durumu okur ve harekete geçer.",
      en: "The Head-Captain's own division and the army's measure: even its rank and file are held up as model Shinigami. Its true worth is on record — it reads a crisis and moves before the order is ever given.",
    },
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
    about: {
      tr: "Yüz on yılı aşkın süredir Onmitsukidō ile tek gövde: Yoruichi Shihōin iki makamı birden tuttuğundan beri gizli harekât bu kapıdan yürütülüyor. Ordunun görünen yüzü değil, görünmeyen eli.",
      en: "One body with the Onmitsukidō for over a hundred and ten years — ever since Yoruichi Shihōin held both offices at once, covert operations have run through this gate. Not the army's visible face; its unseen hand.",
    },
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
    about: {
      tr: "Kayıtlı bir özel görevi yok; kayda geçen şey bir gece. Kaptanı Gin Ichimaru'nun Aizen'le birlikte çekip gittiği, üç bölüğün aynı anda kaptansız kaldığı gece. Bölük kendini o geceden sonra yeniden kurdu.",
      en: "No special duty on record; what the record keeps is a single night. The night its captain, Gin Ichimaru, walked out with Aizen and three divisions lost their captains at once. The division rebuilt itself from that night on.",
    },
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
    about: {
      tr: "Herkes ruhsal gücünü savaşmak için kullanır; bu bölük iyileştirmek için. Yaralıları o taşır, Seireitei'nin görünmeyen emeğini o çeker. Savaş herkes için bittiğinde, bu bölük için daha yeni başlamıştır.",
      en: "Everyone else spends their spiritual power on fighting; this division spends it on healing. It carries the wounded and does the Seireitei's invisible labor. When the fighting is over for everyone else, its work has only begun.",
    },
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
    about: {
      tr: "Üyeleri her alanda ustalaşmış bir kaptanın elinde yetişti — kayıt bunu övgüyle yazmıştı. Sonra o kusursuz kaptanın adı Sōsuke Aizen çıktı ve bölük, en büyük ihanetin doğduğu yer olarak anılır oldu.",
      en: "Its members were trained by a captain who excelled at everything — the record wrote that down as praise. Then the flawless captain turned out to be Sōsuke Aizen, and the division became known as the birthplace of the greatest betrayal.",
    },
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
    about: {
      tr: "Her Shinigami'nin örnek gösterdiği bölük: kural neyse o. Kuchiki hanesinin reisi tarafından yönetilir ve yasaya bağlılığı, kaptanının kendi kız kardeşinin idamına karşı çıkmayışına kadar vardı.",
      en: "The division every Shinigami points to as the model: the rule is the rule. Led by the head of the Kuchiki house, its devotion to law once went as far as its captain refusing to oppose his own sister's execution.",
    },
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
    about: {
      tr: "Gösterişsiz ve sözünün eri insanların bölüğü. Komamura'dan Iba'ya geçen şey bir teknik değil bir ahlak: vefa borcu ve merhamet, bu kapıda kılıçtan önce gelir.",
      en: "A division of plain, sincere people who mean what they say. What passed from Komamura to Iba was not a technique but an ethic: obligation and compassion come before the sword at this gate.",
    },
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
    about: {
      tr: "Kayıtlı bir özel görevi yok; kaydı taşıyan şey kaptanları. Shunsui Kyōraku bin yıllık savaşın ortasında başkomutanlığa çağrıldı ve koltuk, yüzyılı sürgünde geçirmiş bir Visored'a — Lisa Yadōmaru'ya — kaldı.",
      en: "No special duty on record; its captains carry the record. Shunsui Kyōraku was called to Head-Captain in the middle of the thousand-year war, and the seat passed to Lisa Yadōmaru — a Visored who had spent the century in exile.",
    },
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
    about: {
      tr: "Seireitei'nin güvenlik gücü: sürekli savaşa hazır bekleyen bölük. Aynı zamanda sanatın ve kültürün geleneksel bekçisi — Seireitei dergisini o çıkarır. Kılıç ve kalem bu kapıda aynı çekmecede durur.",
      en: "The Seireitei's security force, on permanent standby for combat. Also the traditional keeper of arts and culture — it publishes the Seireitei journal. Sword and pen share a drawer at this gate.",
    },
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
    about: {
      tr: "Yaşayanlar dünyasındaki yetki alanı Naruki şehri; kayıttaki asıl istisna kaptanı. Tōshirō Hitsugaya bu koltuğa tarihin en genç kaptanı olarak oturdu.",
      en: "Its jurisdiction in the living world is Naruki City; the real exception in its record is its captain. Tōshirō Hitsugaya took the seat as the youngest captain in history.",
    },
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
    about: {
      tr: "Yalnızca kılıç: Kidō'yu ve öteki sanatları bilerek dışarıda bırakan tek bölük. Üyeleri Zanpakutō'larını her an yanında taşır ve doktrin tek cümledir — savaşmak, yaşamayı değerli kılan şeydir.",
      en: "The sword and nothing else: the only division that deliberately forgoes Kidō and the other arts. Its members carry their Zanpakutō at all times, and the doctrine is a single sentence — fighting is what makes life worth living.",
    },
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
    about: {
      tr: "Yüz yılı aşkın süredir Shinigami Araştırma-Geliştirme Enstitüsü'nün evi; kapıyı bilime Kisuke Urahara açtı. O günden beri bölüğün ölçüsü kılıç değil veri — toplanan, ayrıştırılan ve bazen yaratılan.",
      en: "Home of the Shinigami Research and Development Institute for over a century; it was Kisuke Urahara who opened this gate to science. Since then the division's measure has not been the sword but data — gathered, dissected, and sometimes created.",
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
    about: {
      tr: "Karakura kasabası bu bölüğün yetki alanı. Oraya gönderilen bir asker — Rukia Kuchiki — gücünü bir insana devretti ve bu arşivdeki her şey o ihlalle başladı.",
      en: "Karakura Town falls under this division's jurisdiction. A soldier sent there — Rukia Kuchiki — handed her power to a human, and everything in this archive began with that violation.",
    },
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
