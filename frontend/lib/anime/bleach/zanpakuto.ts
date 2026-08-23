import type { Localized } from "./types";

/**
 * ZANPAKUTŌ ARŞİVİ — P04.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Naruto Evreni'nde bunun karşılığı "Jutsu Arşivi": bir teknik listesi.
 * Burada tez tamamen farklı — **Zanpakutō bir silah değil, yaşayan bir
 * ruhtur.** Arşiv bunu ispatlamalı, o yüzden bir teknik listesi gibi değil
 * bir CANLILAR KATALOĞU gibi kuruldu: her kılıcın bir dönüşüm hattı ve
 * altısının kendi iç dünyası var.
 *
 * ── KOMUTLAR FANDOM'DAN DOĞRULANDI ───────────────────────────────────────
 * Serbest bırakma komutları 23 Ağustos 2026'da sahiplerinin fandom
 * sayfalarından okundu (`api.php?action=parse&prop=wikitext`; Zanpakutō
 * sayfaları sahibe yönleniyor, veri `===Zanpakutō===` bölümünde
 * `{{translation|"..."|kanji|romaji}}` biçiminde).
 *
 * Onunun onu da hafızadakiyle birebir uyuştu — ama Gotei 13 turunda üç
 * hata çıkmıştı, o yüzden doğrulama atlanmadı.
 *
 * ⚠️ ZANGETSU'NUN KOMUTU YOK ve bu bir eksiklik değil: Ichigo'nun kılıcı
 * sürekli serbest hâlde. Brief'in şemasında bu noktada 「月牙天衝」 yazıyor
 * ama o bir SALDIRI adı (Getsuga Tenshō), serbest bırakma komutu değil.
 * `command: null` bırakıldı, arayüz o durağı komutsuz çiziyor.
 *
 * ── SİLÜET ŞEMATİK, İLLÜSTRASYON DEĞİL ───────────────────────────────────
 * Her aşamanın kılıç silüeti PARAMETREDEN üretiliyor (`blade.ts`). Sebebi
 * teknik: morph için iki path'in aynı düğüm sayısına sahip olması şart.
 * Kırk ayrı path elle çizilseydi hiçbiri diğerine dönüşemezdi. Bedeli:
 * Senbonzakura'nın bin bıçağı ya da Ryūjin Jakka'nın alevi burada soyut
 * bir biçim değişimi olarak görünüyor — anlatıyı ad, komut ve not taşıyor.
 */

/** Silüetin biçim parametreleri — hepsi 0..1 arası */
export interface BladeForm {
  /** Namlu boyu */
  len: number;
  /** Namlu kalınlığı */
  width: number;
  /** Eğrilik (0 = düz, 1 = kılıç gibi kavisli) */
  curve: number;
  /** Uç sivriliği (0 = küt, 1 = iğne) */
  tip: number;
  /** Balçak (tsuba) yarıçapı */
  guard: number;
  /** Kabza boyu */
  hilt: number;
}

export type StageKind = "sealed" | "shikai" | "bankai" | "true";

export interface ZanpakutoStage {
  kind: StageKind;
  /**
   * Aşamanın adı — çevrilmez.
   *
   * ⚠️ `null` olabilir: Kenpachi'nin Bankai'ının adı canon'da hiç
   * söylenmedi. Uydurmak yerine boş bırakılıyor ve arayüz "kayıt yok"
   * çiziyor (brief'in kuralı).
   */
  name: string | null;
  kanji: string;
  /** Tek cümlelik not */
  note: Localized;
  form: BladeForm;
}

export interface InnerWorld {
  /** Ruhun kendi adı, varsa */
  spirit: string | null;
  title: Localized;
  /** 2–3 cümle */
  description: Localized;
  /**
   * İç dünyanın kendi paleti — zemin / vurgu / metin.
   *
   * ⚠️ Kural 16 istisnası, kasıtlı: bunlar tema token'ı değil VERİ. Her iç
   * dünya canon'da kendi rengine sahip ve site teması değişse de o renk
   * değişmez (`DriverStanding.teamColor` ile aynı sınıf).
   */
  palette: { ink: string; accent: string; paper: string };
  /** Sahnenin biçimi — `InnerWorldScene` bunu çiziyor */
  scene: "city" | "petals" | "ice" | "ruins" | "snow" | "curtain";
}

export interface ZanpakutoRecord {
  id: string;
  name: string;
  kanji: string;
  owner: string;
  /** Serbest bırakma komutu (kaikō). Canon'da yoksa `null`. */
  command: { en: string; kanji: string; romaji: string } | null;
  stages: ZanpakutoStage[];
  innerWorld?: InnerWorld;
}

/* Sık kullanılan biçimler — okunurluk için adlandırıldı */
const KATANA: BladeForm = { len: 0.58, width: 0.05, curve: 0.18, tip: 0.55, guard: 0.1, hilt: 0.2 };
const WAKIZASHI: BladeForm = { len: 0.44, width: 0.05, curve: 0.14, tip: 0.5, guard: 0.09, hilt: 0.18 };

export const ZANPAKUTO: readonly ZanpakutoRecord[] = [
  {
    id: "zangetsu",
    name: "Zangetsu",
    kanji: "斬月",
    owner: "Ichigo Kurosaki",
    command: null,
    stages: [
      {
        kind: "sealed",
        name: "Zangetsu",
        kanji: "斬月",
        note: {
          tr: "Mühürlü hâli yok denecek kadar kısa sürdü: Ichigo kılıcı neredeyse hep serbest taşıdı.",
          en: "Its sealed state barely existed: Ichigo carried the blade released almost from the start.",
        },
        form: { len: 0.6, width: 0.055, curve: 0.16, tip: 0.55, guard: 0.1, hilt: 0.2 },
      },
      {
        kind: "shikai",
        name: "Zangetsu",
        kanji: "斬月",
        note: {
          tr: "Balçaksız, sargılı, devasa bir satır — bir zanaat değil, bir irade biçimi.",
          en: "Guardless, bandaged, an oversized cleaver — not a craft but a shape of will.",
        },
        form: { len: 0.8, width: 0.17, curve: 0.03, tip: 0.85, guard: 0, hilt: 0.16 },
      },
      {
        kind: "bankai",
        name: "Tensa Zangetsu",
        kanji: "天鎖斬月",
        note: {
          tr: "Bankai büyütmez, KÜÇÜLTÜR: bütün güç ince ve siyah bir bıçakta toplanır.",
          en: "The Bankai does not enlarge, it SHRINKS: all the power gathers into one thin black blade.",
        },
        form: { len: 0.72, width: 0.03, curve: 0.05, tip: 0.3, guard: 0.04, hilt: 0.15 },
      },
      {
        kind: "true",
        name: "Zangetsu",
        kanji: "斬月",
        note: {
          tr: "Gerçek hâli iki kılıç: Shinigami yanı ve Hollow yanı artık ayrı ayrı görünüyor.",
          en: "Its true form is two blades: the Shinigami half and the Hollow half, finally visible apart.",
        },
        form: { len: 0.86, width: 0.11, curve: 0.08, tip: 0.7, guard: 0.02, hilt: 0.18 },
      },
    ],
    innerWorld: {
      spirit: "Zangetsu",
      title: { tr: "Yan yatmış şehir", en: "The city turned on its side" },
      description: {
        tr: "Sonsuz gökdelenler, ama ufuk dikey. Ichigo'nun iç dünyasında yerçekimi doksan derece dönmüştür ve o bunu tuhaf bulmaz. Yağmur yağdığında ruhu çöker; kılıcı ona bunu söyler.",
        en: "Endless skyscrapers, but the horizon runs vertical. In Ichigo's inner world gravity is turned ninety degrees and he does not find it strange. When it rains there, his spirit is collapsing; the blade tells him so.",
      },
      palette: { ink: "#0B0B10", accent: "#1E4C8A", paper: "#C8CDD6" },
      scene: "city",
    },
  },
  {
    id: "senbonzakura",
    name: "Senbonzakura",
    kanji: "千本桜",
    owner: "Byakuya Kuchiki",
    command: { en: "Scatter", kanji: "散れ", romaji: "chire" },
    stages: [
      {
        kind: "sealed",
        name: "Senbonzakura",
        kanji: "千本桜",
        note: {
          tr: "Dört pencereli balçağı olan sıradan bir katana — soyluluğun gösterişsiz hâli.",
          en: "An ordinary katana with a four-pane guard — nobility without display.",
        },
        form: KATANA,
      },
      {
        kind: "shikai",
        name: "Senbonzakura",
        kanji: "千本桜",
        note: {
          tr: "Namlu bin ince bıçağa ayrılır; uzaktan sakura yaprağı, yakından ölüm.",
          en: "The blade separates into a thousand slender blades: cherry petals from afar, death up close.",
        },
        form: { len: 0.66, width: 0.02, curve: 0.1, tip: 0.9, guard: 0.08, hilt: 0.19 },
      },
      {
        kind: "bankai",
        name: "Senbonzakura Kageyoshi",
        kanji: "千本桜景厳",
        note: {
          tr: "Bin bıçak bir milyona çıkar ve savaş alanı bir çiçek tarlasına dönüşür.",
          en: "A thousand blades become a million and the battlefield turns into a field of blossom.",
        },
        form: { len: 0.9, width: 0.012, curve: 0.04, tip: 0.95, guard: 0.03, hilt: 0.14 },
      },
    ],
    innerWorld: {
      spirit: "Senbonzakura",
      title: { tr: "Beyaz boşlukta düşen bıçaklar", en: "Blades falling through white" },
      description: {
        tr: "Beyaz bir boşlukta yapraklar düşüyor. Her yaprak aslında bir bıçak; güzellik ile öldürücülük burada aynı şeyin iki adı. Byakuya'nın dünyası sessizdir çünkü orada tartışılacak bir şey kalmamıştır.",
        en: "Petals fall through a white void. Every petal is a blade; here beauty and lethality are two names for the same thing. Byakuya's world is silent because nothing is left to argue about.",
      },
      palette: { ink: "#F4EDEF", accent: "#C2536B", paper: "#2A2A2E" },
      scene: "petals",
    },
  },
  {
    id: "hyorinmaru",
    name: "Hyōrinmaru",
    kanji: "氷輪丸",
    owner: "Tōshirō Hitsugaya",
    command: {
      en: "Sit Upon the Frozen Heavens",
      kanji: "霜天に坐せ",
      romaji: "sōten ni zase",
    },
    stages: [
      {
        kind: "sealed",
        name: "Hyōrinmaru",
        kanji: "氷輪丸",
        note: {
          tr: "Sırtında taşınan, yaşına göre fazlasıyla uzun bir kılıç.",
          en: "Worn across the back — a blade far too long for its owner's age.",
        },
        form: { len: 0.64, width: 0.05, curve: 0.2, tip: 0.5, guard: 0.11, hilt: 0.22 },
      },
      {
        kind: "shikai",
        name: "Hyōrinmaru",
        kanji: "氷輪丸",
        note: {
          tr: "Kabzaya zincirle bağlı hilal bir bıçak ve arkasından gelen bir buz ejderhası.",
          en: "A crescent blade chained to the hilt, and an ice dragon following behind it.",
        },
        form: { len: 0.7, width: 0.07, curve: 0.34, tip: 0.6, guard: 0.09, hilt: 0.2 },
      },
      {
        kind: "bankai",
        name: "Daiguren Hyōrinmaru",
        kanji: "大紅蓮氷輪丸",
        note: {
          tr: "Buz kanatlar, buz kuyruk, arkada açılan on iki çiçek — her biri bir dakika.",
          en: "Ice wings, an ice tail, and twelve flowers opening behind: each one a minute.",
        },
        form: { len: 0.78, width: 0.09, curve: 0.26, tip: 0.55, guard: 0.14, hilt: 0.18 },
      },
    ],
    innerWorld: {
      spirit: "Hyōrinmaru",
      title: { tr: "Donmuş gökyüzü", en: "The frozen sky" },
      description: {
        tr: "Buz sütunları yerden göğe uzanıyor ve gökyüzü kırılmış bir cam gibi. Hyōrinmaru bütün Zanpakutō'ların en güçlü buz-kar tipidir; Hitsugaya onu tam olarak duyabilmek için büyümeyi beklemek zorunda kaldı.",
        en: "Pillars of ice run from ground to sky, and the sky itself is like cracked glass. Hyōrinmaru is the strongest ice-type of all Zanpakutō; Hitsugaya had to wait to grow up before he could hear it properly.",
      },
      palette: { ink: "#DCEAF2", accent: "#4E8FB5", paper: "#0E1A22" },
      scene: "ice",
    },
  },
  {
    id: "sode-no-shirayuki",
    name: "Sode no Shirayuki",
    kanji: "袖白雪",
    owner: "Rukia Kuchiki",
    command: { en: "Dance", kanji: "舞え", romaji: "mae" },
    stages: [
      {
        kind: "sealed",
        name: "Sode no Shirayuki",
        kanji: "袖白雪",
        note: {
          tr: "Mühürlü hâli sıradan; asıl ayrım serbest bırakıldığında başlıyor.",
          en: "Unremarkable while sealed; the distinction begins only on release.",
        },
        form: WAKIZASHI,
      },
      {
        kind: "shikai",
        name: "Sode no Shirayuki",
        kanji: "袖白雪",
        note: {
          tr: "Namlu, kabza, balçak — hepsi bembeyaz. Soul Society'nin en güzel Zanpakutō'su sayılır.",
          en: "Blade, hilt and guard turn pure white. It is held to be the most beautiful Zanpakutō in Soul Society.",
        },
        form: { len: 0.68, width: 0.04, curve: 0.08, tip: 0.45, guard: 0.13, hilt: 0.2 },
      },
      {
        kind: "bankai",
        name: "Hakka no Togame",
        kanji: "白霞罰",
        note: {
          tr: "Mutlak sıfırın altı: dokunduğu her şeyi molekülüne kadar dondurur.",
          en: "Below absolute zero: it freezes whatever it touches down to the molecule.",
        },
        form: { len: 0.74, width: 0.028, curve: 0.03, tip: 0.35, guard: 0.16, hilt: 0.18 },
      },
    ],
    innerWorld: {
      spirit: "Sode no Shirayuki",
      title: { tr: "Kar tutan sessizlik", en: "A silence that holds snow" },
      description: {
        tr: "Rukia'nın dünyası bir kar manzarası: beyaz, düz, sessiz. Sode no Shirayuki nazik görünür ama nezaket burada bir merhamet değil bir disiplindir — soğuk, tereddüt etmez.",
        en: "Rukia's world is a snowfield: white, flat, silent. Sode no Shirayuki appears gentle, but gentleness here is discipline rather than mercy — cold does not hesitate.",
      },
      palette: { ink: "#EDF3F7", accent: "#7FA9C4", paper: "#1B2A33" },
      scene: "snow",
    },
  },
  {
    id: "nozarashi",
    name: "Nozarashi",
    kanji: "野晒",
    owner: "Kenpachi Zaraki",
    command: { en: "Drink", kanji: "呑め", romaji: "nome" },
    stages: [
      {
        kind: "sealed",
        name: "Nozarashi",
        kanji: "野晒",
        note: {
          tr: "Çentikli, bakımsız, ucu kırık. Kenpachi yüz yıl kılıcının adını bile bilmedi.",
          en: "Notched, neglected, broken at the tip. For a century Kenpachi did not even know its name.",
        },
        form: { len: 0.66, width: 0.06, curve: 0.12, tip: 0.25, guard: 0.06, hilt: 0.2 },
      },
      {
        kind: "shikai",
        name: "Nozarashi",
        kanji: "野晒",
        note: {
          tr: "Dev bir balta-satır: zarafet yok, teknik yok, yalnızca ağırlık.",
          en: "A giant axe-cleaver: no elegance, no technique, only weight.",
        },
        form: { len: 0.84, width: 0.24, curve: 0.02, tip: 0.9, guard: 0, hilt: 0.22 },
      },
      {
        kind: "bankai",
        name: null,
        kanji: "—",
        note: {
          tr: "Bankai'ının adı canon'da hiç söylenmedi; arşiv burada boş bırakmayı tercih ediyor.",
          en: "The name of his Bankai was never spoken in canon; the archive prefers to leave it blank.",
        },
        form: { len: 0.92, width: 0.2, curve: 0.06, tip: 0.75, guard: 0.05, hilt: 0.2 },
      },
    ],
    innerWorld: {
      spirit: null,
      title: { tr: "Yıkık savaş alanı", en: "A ruined battlefield" },
      description: {
        tr: "Kırmızı bir gökyüzünün altında yıkıntı ve tek bir dev figür. Kenpachi'nin iç dünyası bir manzara değil bir kavga alanı; kılıcı onunla konuşmak için yüz yıl beklemek zorunda kaldı çünkü o hiç dinlemedi.",
        en: "Rubble under a red sky, and one giant figure. Kenpachi's inner world is not a landscape but a fighting ground; his blade had to wait a century to speak, because he never listened.",
      },
      palette: { ink: "#2A1416", accent: "#8E2020", paper: "#D9CDBE" },
      scene: "ruins",
    },
  },
  {
    id: "benihime",
    name: "Benihime",
    kanji: "紅姫",
    owner: "Kisuke Urahara",
    command: { en: "Awaken", kanji: "起きろ", romaji: "okiro" },
    stages: [
      {
        kind: "sealed",
        name: "Benihime",
        kanji: "紅姫",
        note: {
          tr: "Bir bastonun içinde saklı: Urahara silahını da niyetini de göstermez.",
          en: "Hidden inside a cane: Urahara shows neither his weapon nor his intent.",
        },
        form: { len: 0.56, width: 0.04, curve: 0.06, tip: 0.4, guard: 0.03, hilt: 0.24 },
      },
      {
        kind: "shikai",
        name: "Benihime",
        kanji: "紅姫",
        note: {
          tr: "Öne kıvrılan kabzası ve kancalı ucuyla ince bir kılıç; kan kırmızısı bir kalkan çizer.",
          en: "A slim blade with a forward-bending hilt and hooked tip; it draws a crimson shield.",
        },
        form: { len: 0.7, width: 0.045, curve: 0.1, tip: 0.5, guard: 0.05, hilt: 0.2 },
      },
      {
        kind: "bankai",
        name: "Kannonbiraki Benihime Aratame",
        kanji: "観音開紅姫改メ",
        note: {
          tr: "Bir kılıç değil bir ameliyat: dokunduğu şeyi söker, yeniden kurar.",
          en: "Not a sword but a surgery: it takes what it touches apart and rebuilds it.",
        },
        form: { len: 0.8, width: 0.07, curve: 0.14, tip: 0.6, guard: 0.18, hilt: 0.18 },
      },
    ],
    innerWorld: {
      spirit: "Benihime",
      title: { tr: "Kırmızı perde", en: "The crimson curtain" },
      description: {
        tr: "Kırmızı perdeler ve arkalarında duran gölgeler. Urahara'nın dünyası bir sahne: her şey gösterilmek üzere düzenlenmiş, ama perdenin ardında ne olduğunu yalnızca o biliyor.",
        en: "Crimson curtains and the shadows standing behind them. Urahara's world is a stage: everything arranged to be shown, and only he knows what waits behind the drape.",
      },
      palette: { ink: "#1A0A0E", accent: "#B01C3A", paper: "#E8D8DC" },
      scene: "curtain",
    },
  },
  {
    id: "suzumebachi",
    name: "Suzumebachi",
    kanji: "雀蜂",
    owner: "Suì-Fēng",
    command: {
      en: "Sting all Enemies to Death",
      kanji: "尽敵螫殺",
      romaji: "jinteki shakusetsu",
    },
    stages: [
      {
        kind: "sealed",
        name: "Suzumebachi",
        kanji: "雀蜂",
        note: {
          tr: "Kısa bir wakizashi — Onmitsukidō'nun gizli hareketine uygun boy.",
          en: "A short wakizashi — sized for the covert movement of the Onmitsukidō.",
        },
        form: WAKIZASHI,
      },
      {
        kind: "shikai",
        name: "Suzumebachi",
        kanji: "雀蜂",
        note: {
          tr: "Orta parmağa geçen altın bir eldiven ve tek bir iğne: iki dokunuş ölüm demek.",
          en: "A golden gauntlet over the middle finger and a single stinger: two touches mean death.",
        },
        form: { len: 0.3, width: 0.035, curve: 0.02, tip: 0.95, guard: 0.14, hilt: 0.12 },
      },
      {
        kind: "bankai",
        name: "Jakuhō Raikōben",
        kanji: "雀蜂雷公鞭",
        note: {
          tr: "Sahibinin bütün estetiğine aykırı: dev bir füze. Suì-Fēng'in nefret ettiği Bankai.",
          en: "Everything its owner's aesthetic is not: an enormous missile. The Bankai Suì-Fēng hates.",
        },
        form: { len: 0.7, width: 0.3, curve: 0.02, tip: 0.5, guard: 0.2, hilt: 0.16 },
      },
    ],
  },
  {
    id: "ryujin-jakka",
    name: "Ryūjin Jakka",
    kanji: "流刃若火",
    owner: "Genryūsai Shigekuni Yamamoto",
    command: {
      en: "Reduce All Creation to Ash",
      kanji: "万象一切灰燼と為せ",
      romaji: "banshō issai kaijin to nase",
    },
    stages: [
      {
        kind: "sealed",
        name: "Ryūjin Jakka",
        kanji: "流刃若火",
        note: {
          tr: "Bir bastonun içinde bin yıl beklemiş uzun bir katana.",
          en: "A long katana that waited a thousand years inside a walking cane.",
        },
        form: { len: 0.7, width: 0.045, curve: 0.16, tip: 0.5, guard: 0.05, hilt: 0.22 },
      },
      {
        kind: "shikai",
        name: "Ryūjin Jakka",
        kanji: "流刃若火",
        note: {
          tr: "Bütün Zanpakutō'ların en güçlü ateş tipi; serbest kaldığında gökyüzü kararır.",
          en: "The strongest fire-type of all Zanpakutō; when released, the sky darkens.",
        },
        form: { len: 0.88, width: 0.08, curve: 0.22, tip: 0.7, guard: 0.04, hilt: 0.2 },
      },
      {
        kind: "bankai",
        name: "Zanka no Tachi",
        kanji: "残火の太刀",
        note: {
          tr: "Alev geri çekilir ve tek bir kömürleşmiş bıçakta toplanır — dokunduğu şey iz bırakmaz.",
          en: "The flame withdraws into one charred blade — whatever it touches leaves no trace.",
        },
        form: { len: 0.76, width: 0.055, curve: 0.1, tip: 0.4, guard: 0.03, hilt: 0.18 },
      },
    ],
  },
  {
    id: "katen-kyokotsu",
    name: "Katen Kyōkotsu",
    kanji: "花天狂骨",
    owner: "Shunsui Kyōraku",
    command: {
      en: "The flowery winds become disturbed, the god of flowers sings; the heavenly winds become disturbed, the devil of heaven sneers",
      kanji: "花風紊れて花神啼き 天風紊れて天魔嗤う",
      romaji: "hana kaze midarete kashin naki, ten pū midarete tenma warau",
    },
    stages: [
      {
        kind: "sealed",
        name: "Katen Kyōkotsu",
        kanji: "花天狂骨",
        note: {
          tr: "İki kılıç — Gotei'nin bilinen tek çift Zanpakutō'su.",
          en: "Two blades — the only known dual Zanpakutō in the Gotei.",
        },
        form: { len: 0.6, width: 0.055, curve: 0.2, tip: 0.5, guard: 0.1, hilt: 0.2 },
      },
      {
        kind: "shikai",
        name: "Katen Kyōkotsu",
        kanji: "花天狂骨",
        note: {
          tr: "Çocuk oyunlarını gerçeğe çevirir: kaybeden gerçekten kaybeder.",
          en: "It turns children's games real: whoever loses, loses for good.",
        },
        form: { len: 0.72, width: 0.09, curve: 0.3, tip: 0.65, guard: 0.08, hilt: 0.2 },
      },
      {
        kind: "bankai",
        name: "Katen Kyōkotsu: Karamatsu Shinjū",
        kanji: "花天狂骨枯松心中",
        note: {
          tr: "Bir intihar oyunu: dört perde boyunca hem düşmanı hem sahibini öldürür.",
          en: "A suicide play: across four acts it kills the enemy and its own wielder alike.",
        },
        form: { len: 0.82, width: 0.07, curve: 0.36, tip: 0.55, guard: 0.06, hilt: 0.18 },
      },
    ],
  },
  {
    id: "ashisogi-jizo",
    name: "Ashisogi Jizō",
    kanji: "疋殺地蔵",
    owner: "Mayuri Kurotsuchi",
    command: { en: "Rip", kanji: "掻き毟れ", romaji: "kakimushire" },
    stages: [
      {
        kind: "sealed",
        name: "Ashisogi Jizō",
        kanji: "疋殺地蔵",
        note: {
          tr: "Sıradan bir katana — Mayuri'nin en az ilgilendiği hâli.",
          en: "An ordinary katana — the state Mayuri cares about least.",
        },
        form: KATANA,
      },
      {
        kind: "shikai",
        name: "Ashisogi Jizō",
        kanji: "疋殺地蔵",
        note: {
          tr: "Üç ağızlı bir mızrak: kestiği yeri öldürmez, yalnızca felç eder. Acı kalır.",
          en: "A three-pronged trident: it does not kill what it cuts, only paralyses. The pain stays.",
        },
        form: { len: 0.68, width: 0.13, curve: 0.06, tip: 0.8, guard: 0.07, hilt: 0.19 },
      },
      {
        kind: "bankai",
        name: "Konjiki Ashisogi Jizō",
        kanji: "金色疋殺地蔵",
        note: {
          tr: "Altın bir tırtıl-bebek: zehri havadan yayılır ve Mayuri kendi panzehrini önceden içmiştir.",
          en: "A golden caterpillar-infant: its poison spreads through the air, and Mayuri has already taken the antidote.",
        },
        form: { len: 0.64, width: 0.28, curve: 0.04, tip: 0.6, guard: 0.22, hilt: 0.16 },
      },
    ],
  },
];

/** İç dünyası olan altı kılıç — brief: "20 yarım yamalak yerine 6 mükemmel" */
export const INNER_WORLD_IDS = ZANPAKUTO.filter((z) => z.innerWorld).map((z) => z.id);
