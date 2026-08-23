import type { Localized } from "./types";

/**
 * RUHSAL GÜÇ SİSTEMİ — P10'un verisi.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Naruto Evreni'ndeki karşılığı "Chakra ve Doğa Dönüşümü": tek bir sistem,
 * tek bir şema. Bleach'te üç ırk var ve **üç güç sistemi birbirine
 * benzemiyor** — bölümün tezi tam olarak bu. Aynı bölümde üç ayrı görsel
 * gramer olması bir kaos değil, kaydın kendisi.
 *
 * ── HEPSİ FANDOM'DAN DOĞRULANDI (23 Ağustos 2026) ────────────────────────
 * `bleach.fandom.com/api.php?action=parse&page=<AD>&prop=wikitext`.
 *
 * ⚠️ Doğrulama iki şey düzeltti ve bir şey kazandırdı:
 *   1. **Blut Arterie 滅血装 DEĞİL 動血装.** Hafızadan yazılsaydı yanlış
 *      kanji girecekti.
 *   2. Brief birinci sütunda 斬魄刀'yu "güç" diye listeliyor; oysa
 *      Zanpakutō bir **silah**, dört temel sanatın biri değil. Dördü
 *      斬術 · 白打 · 歩法 · 鬼道 ve kılıç ayrı duruyor.
 *   3. Kazanç: dört sanatın canon'da toplu bir adı var —
 *      **「斬」「拳」「走」「鬼」 Zankensoki** (kes-yumruk-koş-ruh).
 *
 * ── ⚠️ ÜÇ SÖZCÜK BÖLÜMÜN OMURGASI ───────────────────────────────────────
 * Bölümün adı "ruhsal güç" ve canon bunu üçe ayırıyor: 霊力 gücün kendisi,
 * 霊子 o gücün maddesi, 霊圧 dışarı vuran ağırlığı. Üçü karıştırıldığında
 * geri kalan her şey bulanıklaşıyor, o yüzden sütunlardan ÖNCE geliyorlar.
 */

export interface PowerEntry {
  /** ÇEVRİLMEZ */
  kanji: string;
  /** ÇEVRİLMEZ */
  romaji: string;
  /** Tek cümle */
  text: Localized;
}

/** Üç sözcük — bölümün omurgası */
export const CORE_TRIO: readonly PowerEntry[] = [
  {
    kanji: "霊力",
    romaji: "Reiryoku",
    text: {
      tr: "Bir varlığın taşıdığı ruhsal gücün kendisi. Ne kadar olduğu, ne yapabildiğini belirliyor.",
      en: "The spiritual power a being carries. How much of it there is decides what it can do.",
    },
  },
  {
    kanji: "霊子",
    romaji: "Reishi",
    text: {
      tr: "O gücün maddesi: ruh parçacığı. Soul Society'de hava bile bundan yapılmış.",
      en: "The matter that power is made of: spirit particles. In Soul Society even the air is made of it.",
    },
  },
  {
    kanji: "霊圧",
    romaji: "Reiatsu",
    text: {
      tr: "Gücün dışarı vuran ağırlığı. Yakındaki herkes onu bir basınç olarak hissediyor — saklanamayan tek şey.",
      en: "The weight that power presses outward. Everyone nearby feels it as pressure — the one thing that cannot be hidden.",
    },
  },
];

/* ══════════════════════════════════════════════════════════════════
   死神 SHINIGAMI — mürekkep
   ══════════════════════════════════════════════════════════════════ */

/** Kılıç ayrı duruyor: bir sanat değil, bir silah. */
export const SHINIGAMI_BLADE: PowerEntry = {
  kanji: "斬魄刀",
  romaji: "Zanpakutō",
  text: {
    tr: "Ruh kesen kılıç. Her Shinigami'nin tek silahı ve o silahın bir adı, bir ruhu ve bir iç dünyası var.",
    en: "The soul-cutting sword. Every Shinigami's only weapon — and that weapon has a name, a spirit and an inner world.",
  },
};

/** Dört temel sanat — canon'da toplu adı 「斬」「拳」「走」「鬼」 */
export const SHINIGAMI_ARTS: readonly PowerEntry[] = [
  {
    kanji: "斬術",
    romaji: "Zanjutsu",
    text: {
      tr: "Kılıç sanatı. Dördün ilki ve Akademi'de en çok çalışılanı.",
      en: "Swordsmanship. The first of the four, and the one drilled hardest at the Academy.",
    },
  },
  {
    kanji: "白打",
    romaji: "Hakuda",
    text: {
      tr: "Çıplak el. Kelimenin karşılığı “beyaz vuruş”; Onmitsukidō'nun asıl dili.",
      en: "Bare hands. The word means “white hits”; it is the Onmitsukidō's true language.",
    },
  },
  {
    kanji: "歩法",
    romaji: "Hohō",
    text: {
      tr: "Adım yöntemi. Zirvesi 瞬歩 Shunpo: bir adımda mesafeyi yok etmek.",
      en: "Step method. Its peak is 瞬歩 Shunpo: erasing distance in a single step.",
    },
  },
  {
    kanji: "鬼道",
    romaji: "Kidō",
    text: {
      tr: "Büyü. İki dala ayrılıyor: 破道 yıkım yolu ve 縛道 bağlama yolu, her biri numaralı.",
      en: "Demon arts. It splits in two: 破道, the way of destruction, and 縛道, the way of binding — each spell numbered.",
    },
  },
];

export interface KidoSpell {
  branch: "hado" | "bakudo";
  number: number;
  kanji: string;
  romaji: string;
  meaning: Localized;
}

/** Numaralı örnekler — büyünün bir formül olduğunu gösteren üç satır */
export const KIDO_SPELLS: readonly KidoSpell[] = [
  {
    branch: "hado",
    number: 33,
    kanji: "蒼火墜",
    romaji: "Sōkatsui",
    meaning: { tr: "Mavi ateş, düşerek", en: "Blue fire, crash down" },
  },
  {
    branch: "hado",
    number: 90,
    kanji: "黒棺",
    romaji: "Kurohitsugi",
    meaning: { tr: "Kara tabut", en: "Black coffin" },
  },
  {
    branch: "bakudo",
    number: 61,
    kanji: "六杖光牢",
    romaji: "Rikujōkōrō",
    meaning: { tr: "Altı çubuk ışık zindanı", en: "Six rods prison of light" },
  },
];

/* ══════════════════════════════════════════════════════════════════
   虚 HOLLOW / ARRANCAR — boşluk
   ══════════════════════════════════════════════════════════════════ */

export const HOLLOW_POWERS: readonly PowerEntry[] = [
  {
    kanji: "虚閃",
    romaji: "Cero",
    text: {
      tr: "Ağızdan çıkan yoğunlaştırılmış patlama. İspanyolca adı “sıfır”, Japoncası “boşluk şimşeği”.",
      en: "A concentrated blast fired from the mouth. Its Spanish name means “zero”, its Japanese one “hollow flash”.",
    },
  },
  {
    kanji: "虚弾",
    romaji: "Bala",
    text: {
      tr: "Cero'dan zayıf ama yirmi kat hızlı: sertleştirilmiş reiryoku mermisi.",
      en: "Weaker than a cero but twenty times faster: a bullet of hardened reiryoku.",
    },
  },
  {
    kanji: "響転",
    romaji: "Sonído",
    text: {
      tr: "Shunpo'nun karşılığı. Arkasında sessizlik değil bir çatlama bırakıyor — adı zaten “ses”.",
      en: "The counterpart of Shunpo. It leaves not silence behind but a crack — its name is simply “sound”.",
    },
  },
  {
    kanji: "鋼皮",
    romaji: "Hierro",
    text: {
      tr: "Çelik deri. Yoğunlaşmış reiatsu'nun kendiliğinden ördüğü zırh; kullanmak için düşünmek gerekmiyor.",
      en: "Steel skin. Armour that condensed reiatsu weaves by itself; using it takes no thought.",
    },
  },
  {
    kanji: "帰刃",
    romaji: "Resurrección",
    text: {
      tr: "“Dönen bıçak”. Arrancar maskesini söküp gücünü kılıca kapatmıştı; salıverince gerçek Hollow biçimine geri dönüyor.",
      en: "“Returning blade”. An Arrancar sealed its power into a sword when it tore off the mask; releasing it returns the true Hollow form.",
    },
  },
];

/* ══════════════════════════════════════════════════════════════════
   滅却師 QUINCY — geometri
   ══════════════════════════════════════════════════════════════════ */

export interface QuincyNode extends PowerEntry {
  id: string;
  /** Pentagram üzerindeki yeri — yüzde (`PowerSystems.module.css` okuyor) */
  x: number;
  y: number;
}

/**
 * Beş düğüm, bir pentagram.
 *
 * ⚠️ Konumlar burada duruyor çünkü şema ile veri aynı şey: düğüm sayısı
 * değişirse yıldız da değişmeli. Değerler birim çemberden hesaplandı
 * (merkez 50, yarıçap 40, tepeden başlayıp 72°'de bir).
 */
export const QUINCY_NODES: readonly QuincyNode[] = [
  {
    id: "heilig-pfeil",
    kanji: "神聖滅矢",
    romaji: "Heilig Pfeil",
    x: 50,
    y: 10,
    text: {
      tr: "Kutsal ok. Havadaki reishi toplanıp 神聖弓 ile fırlatılıyor: Quincy silahını taşımıyor, yerinde kuruyor.",
      en: "Holy arrow. Ambient reishi is gathered and loosed from a 神聖弓: a Quincy does not carry a weapon, they build one on the spot.",
    },
  },
  {
    id: "blut",
    kanji: "血装",
    romaji: "Blut",
    x: 88,
    y: 37.6,
    text: {
      tr: "Reishi'yi kendi damarlarından geçirmek. İki ayrı sistem var ve Urahara'nın söylediği gibi ikisi aynı anda açılamıyor.",
      en: "Running reishi through one's own blood vessels. There are two separate systems and, as Urahara puts it, both cannot be active at once.",
    },
  },
  {
    id: "vollstandig",
    kanji: "滅却師完聖体",
    romaji: "Vollständig",
    x: 73.5,
    y: 82.4,
    text: {
      tr: "Tam tezahür. Quincy'nin son biçimi: başının üstünde bir 光輪, sırtında 光翼.",
      en: "Complete manifestation. A Quincy's final form: a 光輪 above the head, 光翼 at the back.",
    },
  },
  {
    id: "schrift",
    kanji: "聖文字",
    romaji: "Schrift",
    x: 26.5,
    y: 82.4,
    text: {
      tr: "İmparatorun kazıdığı tek harf. Bir yetenek değil bir pay: Yhwach kendi gücünden veriyor.",
      en: "A single letter engraved by the emperor. Not a talent but a share: Yhwach gives away a piece of his own power.",
    },
  },
  {
    id: "reishi",
    kanji: "霊子",
    romaji: "Reishi",
    x: 12,
    y: 37.6,
    text: {
      tr: "Ayrımın tam merkezi: Shinigami gücü içinden üretiyor, Quincy dışarıdan topluyor. İki ırkın uzlaşamamasının sebebi bu.",
      en: "The heart of the difference: a Shinigami produces power from within, a Quincy gathers it from without. This is why the two races cannot be reconciled.",
    },
  },
];

/** Blut'un iki dalı — canon kuralı: aynı anda açılamaz */
export const BLUT_MODES: readonly {
  id: "vene" | "arterie";
  kanji: string;
  romaji: string;
  role: Localized;
}[] = [
  {
    id: "vene",
    kanji: "静血装",
    romaji: "Blut Vene",
    role: { tr: "savunma", en: "defence" },
  },
  {
    id: "arterie",
    kanji: "動血装",
    romaji: "Blut Arterie",
    role: { tr: "saldırı", en: "offence" },
  },
];
