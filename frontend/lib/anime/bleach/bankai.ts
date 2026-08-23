import type { Localized } from "./types";

/**
 * BANKAI SALONU — P05.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Karanlık bir koridor. Duvarlarda kapalı silüetler, isimsiz. Sayfanın en
 * sinematik ve en SESSİZ yeri: az eleman, çok gerilim.
 *
 * **Bankai bir sırdır** ve bölüm bunu bilgi mimarisiyle söylüyor — niş
 * kapalıyken kimin durduğu belli değil. Ad ancak ışık düşünce beliriyor.
 *
 * ── ADLAR FANDOM'DAN DOĞRULANDI ──────────────────────────────────────────
 * 23 Ağustos 2026, sahiplerinin sayfalarından. Doğrulama yine bir şey
 * yakaladı:
 *
 * ⚠️ **RENJİ'NİN BANKAI'I İKİ ADLI.** Brief "Hihiō Zabimaru" diyor; canon'un
 * şu anki hâlinde 双王蛇尾丸 **Sōō Zabimaru**. İkisi de doğru, farklı
 * dönemler: Zabimaru TYBW'de yeniden dövüldü ve adı değişti. Koridorda
 * serinin çoğunda geçerli olan form duruyor, ikinci ad not olarak yanında.
 *
 * Ayrıca romanizasyon düzeltildi: Kokujō Tengen **Myō'ō** (kesme işaretiyle).
 *
 * ── SIRA ─────────────────────────────────────────────────────────────────
 * Brief'in öncelik sırası korundu. Tensa Zangetsu **en sonda ve tek başına**:
 * koridorun sonunda, diğerlerinin iki katı bir niş.
 */

export interface BankaiNiche {
  id: string;
  /** Romaji ad — çevrilmez */
  name: string;
  kanji: string;
  owner: string;
  /**
   * Sahibinin reiatsu rengi — nişi içeriden aydınlatan ışık.
   *
   * ⚠️ Kural 16 istisnası, kasıtlı: bu renk tema token'ı değil VERİ.
   * Karakterin canon'daki reiatsu rengi; site teması değişse de değişmez.
   */
  reiatsu: string;
  /** Yalnızca gerektiğinde — canon'daki ikinci ad, dönem farkı vb. */
  note?: Localized;
  /** Koridorun sonundaki tek büyük niş */
  final?: boolean;
}

export const BANKAI_HALL: readonly BankaiNiche[] = [
  {
    id: "senbonzakura-kageyoshi",
    name: "Senbonzakura Kageyoshi",
    kanji: "千本桜景厳",
    owner: "Byakuya Kuchiki",
    reiatsu: "#C2536B",
  },
  {
    id: "zanka-no-tachi",
    name: "Zanka no Tachi",
    kanji: "残火の太刀",
    owner: "Genryūsai Shigekuni Yamamoto",
    reiatsu: "#C4341A",
  },
  {
    id: "daiguren-hyorinmaru",
    name: "Daiguren Hyōrinmaru",
    kanji: "大紅蓮氷輪丸",
    owner: "Tōshirō Hitsugaya",
    reiatsu: "#7FC7D9",
  },
  {
    id: "kannonbiraki-benihime",
    name: "Kannonbiraki Benihime Aratame",
    kanji: "観音開紅姫改メ",
    owner: "Kisuke Urahara",
    reiatsu: "#8E1F2B",
  },
  {
    id: "minazuki",
    name: "Minazuki",
    kanji: "皆尽",
    owner: "Retsu Unohana",
    reiatsu: "#C9C4BA",
    note: {
      tr: "Shikai ile aynı adı taşıyan tek Bankai; kanji başka.",
      en: "The only Bankai sharing its Shikai's name; the kanji differ.",
    },
  },
  {
    id: "katen-kyokotsu-karamatsu",
    name: "Katen Kyōkotsu: Karamatsu Shinjū",
    kanji: "花天狂骨枯松心中",
    owner: "Shunsui Kyōraku",
    reiatsu: "#C88A2E",
  },
  {
    id: "hihio-zabimaru",
    name: "Hihiō Zabimaru",
    kanji: "狒狒王蛇尾丸",
    owner: "Renji Abarai",
    reiatsu: "#A8342C",
    note: {
      tr: "TYBW'de yeniden dövüldü; sonraki adı 双王蛇尾丸 Sōō Zabimaru.",
      en: "Reforged during TYBW; its later name is 双王蛇尾丸 Sōō Zabimaru.",
    },
  },
  {
    id: "kokujo-tengen-myoo",
    name: "Kokujō Tengen Myō'ō",
    kanji: "黒縄天譴明王",
    owner: "Sajin Komamura",
    reiatsu: "#8A5A2B",
  },
  {
    id: "jakuho-raikoben",
    name: "Jakuhō Raikōben",
    kanji: "雀蜂雷公鞭",
    owner: "Suì-Fēng",
    reiatsu: "#D8B94A",
    note: {
      tr: "Sahibinin nefret ettiği Bankai: gizli harekâtın tersi, dev bir füze.",
      en: "The Bankai its owner hates: the opposite of covert work, an enormous missile.",
    },
  },
  {
    id: "tensa-zangetsu",
    name: "Tensa Zangetsu",
    kanji: "天鎖斬月",
    owner: "Ichigo Kurosaki",
    reiatsu: "#1E4C8A",
    final: true,
  },
];
