import type { Localized } from "./types";

/**
 * WANDENREICH — P09'un verisi.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Sayfanın geri kalanı Japon estetiği; burası Avrupa gotiği. Kültürel
 * çarpışmanın kendisi tasarım kararı: sivri kemer, altın hairline, buz
 * mavisi ve soldan sağa uzayan sert gölgeler (Schatten Bereich).
 *
 * Quincy de bir imparatorluk: kayıt yatay bir kadro değil DİKEY bir
 * hiyerarşi. Tepede tek bir ad, altında beş kişilik muhafız, en altta
 * yirmi altı harflik alfabe.
 *
 * ── HEPSİ FANDOM'DAN DOĞRULANDI (23 Ağustos 2026) ────────────────────────
 * `Template:SternRitterMembers` tablosunun tamamı okundu.
 *
 * ⚠️ **BRIEF'İN LİSTESİ DÖRT YERDE YANLIŞTI** — hafızadan yazılsaydı hepsi
 * sayfaya girecekti:
 *   1. **C · The Compulsory** PePe Waccabrada değil **Pernida Parnkgjas**.
 *   2. **L · The Love** NaNaNa Najahkoop değil **PePe Waccabrada**.
 *   3. **U · The Underbelly** brief'te hiç yok; taşıyıcısı **NaNaNa
 *      Najahkoop** — yani ikisi yer değiştirmiş.
 *   4. Berenike değil **Berenice** Gabrielli.
 *
 * ⚠️ Brief "canon'da açıklanmamış harfler boş kalır" diyor ve boş
 * kalacağını varsaydığı harfler için R ve W'yi de sayıyor. Oysa **yirmi
 * altı harfin hepsinin taşıyıcısı biliniyor**; açıklanmamış olan yalnızca
 * **K ve N'nin Schrift ADI**. Yani hücre boş değil: taşıyıcı var, mührün
 * adı yok. Arayüz bunu "mühür açılmadı" olarak çiziyor — eksiklik değil,
 * kaydın kendisi.
 *
 * ⚠️ Alfabe bir eşleme DEĞİL: dört harfin iki taşıyıcısı var.
 *   A — Yhwach (The Almighty) **ve** Uryū Ishida (Antithesis)
 *   S — Mask De Masculine ve James
 *   V — Gremmy Thoumeaux (The Visionary) ve Guenael Lee (Vanishing Point)
 *   Y — Loyd ve Royd Lloyd (ikiz)
 * Yhwach'ın A'yı Uryū'ya da vermesi bir tasarım kazası değil, olay
 * örgüsünün kendisi; kayıt bunu düzeltmiyor, gösteriyor.
 *
 * ── ⚠️ GOTİK AİLE ────────────────────────────────────────────────────────
 * UnifrakturMaguntia'nın Türkçe diyakritiği YOK. Bu dosyadaki hiçbir dize
 * o aileye geçmiyor: aileye yalnızca **tek harfler** ve "Wandenreich"
 * wordmark'ı basılıyor. `scripts/check-bleach-fonts.mjs` denetliyor.
 */

export interface SchriftBearer {
  /** ÇEVRİLMEZ — özel ad */
  name: string;
  /** Schrift adı; canon açıklamadıysa `null` */
  epithet: string | null;
  /**
   * Gücün tek cümlelik kaydı (P18-c) — plakada epithet'in altına iniyor.
   *
   * Canon çapası: fandom `Schrift` sayfasının Ability sütunu (23 Ağustos
   * 2026). ⚠️ K ve N'de bilerek YOK: o iki mühürde epithet gibi güç de
   * hiç açıklanmadı; cümle uydurmak "mühür açılmadı" kaydını yalanlardı.
   */
  power?: Localized;
  /** Kadro dışı durumlar (ayrıldı, ikiz, yaratılmış…) */
  note?: Localized;
}

export interface SternritterLetter {
  /** A–Z. ⚠️ Gotik aileye basılan TEK şey bu. */
  letter: string;
  bearers: SchriftBearer[];
}

/** İmparator — hiyerarşinin tepesi, tek başına */
export const EMPEROR = {
  name: "Yhwach",
  letter: "A",
  epithet: "The Almighty",
  kanji: "見えざる帝国",
  title: {
    tr: "Wandenreich İmparatoru",
    en: "Emperor of the Wandenreich",
  } satisfies Localized,
  text: {
    tr: "Bin yıl önce yenildi ve yenilgiyi kabul etmek yerine Soul Society'nin kendi gölgesine çekildi. Harfleri o dağıtıyor: Schrift 聖文字, bir Quincy'nin bedenine kazınan tek harflik bir güç. A'yı kendinde tuttu — ve sonra bir kez daha verdi.",
    en: "A thousand years ago he lost, and instead of accepting it he withdrew into Soul Society's own shadow. He is the one who hands out the letters: the Schrift 聖文字, a single-letter power engraved into a Quincy's body. He kept A for himself — and then gave it away once more.",
  } satisfies Localized,
};

/** Muhafız — beş kişi, hepsi Sternritter */
export const SCHUTZSTAFFEL: readonly {
  letter: string;
  name: string;
  role: Localized;
}[] = [
  {
    letter: "X",
    name: "Lille Barro",
    role: { tr: "muhafızın başı", en: "leader of the guard" },
  },
  {
    letter: "M",
    name: "Gerard Valkyrie",
    role: { tr: "Ruh Kralı'nın kalbi", en: "the Soul King's heart" },
  },
  {
    letter: "C",
    name: "Pernida Parnkgjas",
    role: { tr: "Ruh Kralı'nın sol kolu", en: "the Soul King's left arm" },
  },
  {
    letter: "D",
    name: "Askin Nakk Le Vaar",
    role: { tr: "sonradan yükseltildi", en: "promoted later" },
  },
  {
    letter: "A",
    name: "Uryū Ishida",
    role: { tr: "veliaht — sonra saf değiştirdi", en: "crown prince — later defected" },
  },
];

const gone: Localized = { tr: "saf değiştirdi", en: "defected" };

export const STERNRITTER: readonly SternritterLetter[] = [
  {
    letter: "A",
    bearers: [
      { name: "Yhwach", epithet: "The Almighty", power: {
        tr: "Olabilecek her geleceği aynı anda görür — ve gördüğü geleceği değiştirebilir. İmparatorluğun bütün planı bu iki fiilin üstüne kurulu.",
        en: "Sees every possible future at once — and can rewrite the future he sees. The empire's entire design rests on those two verbs.",
      } },
      { name: "Uryū Ishida", epithet: "Antithesis", power: {
        tr: "Seçtiği iki hedef arasında olmuş olanı tersine çevirir: alınan yara ile açan el yer değiştirir.",
        en: "Reverses what has already happened between two chosen targets: the wound taken and the hand that dealt it trade places.",
      }, note: gone },
    ],
  },
  { letter: "B", bearers: [{ name: "Jugram Haschwalth", epithet: "The Balance", power: {
        tr: "Dünyanın dengesini elinde tutar: kendine dokunan talihsizliği alır ve talihin kayırdıklarına geri dağıtır.",
        en: "Holds the world's balance: takes the misfortune that touches him and deals it back to those fortune has favored.",
      } }] },
  { letter: "C", bearers: [{ name: "Pernida Parnkgjas", epithet: "The Compulsory", power: {
        tr: "Sinir uçlarını uzatıp dokunduğu bedeni içeriden ele geçirir. Bu güç Yhwach'tan gelmedi: Pernida, Ruh Kralı'nın sol koludur ve harfi, zaten olduğu şeyin adıdır.",
        en: "Extends its nerves into whatever it touches and seizes the body from within. This power did not come from Yhwach: Pernida is the Soul King's left arm, and the letter merely names what it already was.",
      } }] },
  { letter: "D", bearers: [{ name: "Askin Nakk Le Vaar", epithet: "The Deathdealing", power: {
        tr: "Herhangi bir maddenin öldürücü dozunu hesaplar ve oynar: bir bedene giren her şey için ölüm eşiğini kendisi belirler.",
        en: "Calculates and adjusts the lethal dose of any substance: for anything that enters a body, he sets the threshold of death himself.",
      } }] },
  { letter: "E", bearers: [{ name: "Bambietta Basterbine", epithet: "The Explode", power: {
        tr: "Fırlattığı reishi dokunduğu şeyi bombaya çevirir — patlayan onun saldırısı değil, hedefin kendisidir.",
        en: "The reishi she fires turns whatever it touches into a bomb — what explodes is not her attack but the target itself.",
      } }] },
  { letter: "F", bearers: [{ name: "Äs Nödt", epithet: "The Fear", power: {
        tr: "Dikenleri korkuyu bir yara gibi işler: mantığın reddedemediği, kapalı gözlerin dışarıda tutamadığı mutlak korku.",
        en: "Its thorns inflict fear like a wound: absolute fear that reason cannot refuse and closed eyes cannot keep out.",
      } }] },
  {
    letter: "G",
    bearers: [{ name: "Liltotto Lamperd", epithet: "The Glutton", power: {
        tr: "Ağzı bir kapıdır: her orandan büyük açılır ve önüne geleni — reishi, Hollow ya da Quincy — yutar.",
        en: "Her mouth is a gate: it opens past all proportion and devours whatever stands before it — reishi, Hollow or Quincy alike.",
      }, note: gone }],
  },
  { letter: "H", bearers: [{ name: "Bazz-B", epithet: "The Heat", power: {
        tr: "Ateşi bir basınç gibi kullanır: tek parmağından çıkan alev, bir kaptanın Bankai'ını delip geçti.",
        en: "Wields heat like pressure: the flame from a single finger once punched through a captain's Bankai.",
      }, note: gone }] },
  { letter: "I", bearers: [{ name: "Cang Du", epithet: "The Iron", power: {
        tr: "Derisi demirdir: bir saldırıyı kırmak için kılıcına değil, bedeninin kendisine güvenir.",
        en: "His skin is iron: to break an attack he trusts not his blade but his body itself.",
      } }] },
  { letter: "J", bearers: [{ name: "Quilge Opie", epithet: "The Jail", power: {
        tr: "Reishi'den bir hapishane örer — savaşın açılışında Ichigo'yu tutan parmaklıklar onundu.",
        en: "Weaves a prison of reishi — the bars that held Ichigo at the war's opening were his.",
      } }] },
  /* ⚠️ Taşıyıcı biliniyor, Schrift adı canon'da HİÇ açıklanmadı. */
  { letter: "K", bearers: [{ name: "BG9", epithet: null }] },
  { letter: "L", bearers: [{ name: "PePe Waccabrada", epithet: "The Love", power: {
        tr: "Vurduğunu kendine âşık eder: sevgi bir tasmaya döner, düşman PePe için savaşan bir köleye.",
        en: "Makes whatever he strikes fall in love with him: love becomes a leash, and the enemy a slave who fights for PePe.",
      } }] },
  { letter: "M", bearers: [{ name: "Gerard Valkyrie", epithet: "The Miracle", power: {
        tr: "Aldığı her yara onu büyütür: umutsuzluk mucizeye, hasar bedene dönüşür. Bu güç de Yhwach'ın armağanı değil — Gerard, Ruh Kralı'nın kalbidir.",
        en: "Every wound he takes makes him larger: despair turns to miracle, damage to body. This power was no gift of Yhwach's either — Gerard is the heart of the Soul King.",
      } }] },
  { letter: "N", bearers: [{ name: "Robert Accutrone", epithet: null }] },
  { letter: "O", bearers: [{ name: "Driscoll Berci", epithet: "The Overkill", power: {
        tr: "Öldürdükçe güçlenir: her ölüm, bir sonraki vuruşun ağırlığına eklenir.",
        en: "Grows stronger with every kill: each death adds its weight to the next blow.",
      } }] },
  { letter: "P", bearers: [{ name: "Meninas McAllon", epithet: "The Power", power: {
        tr: "Yalın kaba kuvvet — açıklaması, gösterisi ve pazarlığı olmayan tek Schrift.",
        en: "Sheer brute strength — the one Schrift with no explanation, no spectacle and no terms.",
      } }] },
  { letter: "Q", bearers: [{ name: "Berenice Gabrielli", epithet: "The Question", power: {
        tr: "Varlığın kendisine itiraz eder: soruları, hasmına ne olduğunu sorgulatır. Sahada neredeyse hiç görülmedi — Zaraki onu tartışma açılamadan susturdu.",
        en: "Objects to existence itself: her questions make the enemy doubt what they are. It was barely seen in the field — Zaraki silenced her before the argument could open.",
      } }] },
  { letter: "R", bearers: [{ name: "Jerome Guizbatt", epithet: "The Roar", power: {
        tr: "Kükremesi silahın kendisidir: eti ve taşı sesle parçalar. O da Zaraki'nin önünde bir kayıttan ibaret kaldı.",
        en: "His roar is the weapon itself: it tears flesh and stone with sound. He too remains only an entry in Zaraki's record.",
      } }] },
  {
    letter: "S",
    /* ⚠️ SIRA CANON DÜZELTMESİ (P18-c): önce Mask yazılıydı. Kubo'nun
       Klub Outside cevabı (Q&A #185) ve Schrift tablosu tersini söylüyor —
       gerçek taşıyıcı James; Mask, James'in "ideal kahraman" tasavvurunun
       ete kemiğe bürünmüş hâli. */
    bearers: [
      { name: "James", epithet: "The Superstar", power: {
        tr: "Gerçek taşıyıcı odur: tezahürat güç dağıtır — alkışladığı kahraman, alkış sürdükçe güçlenir. Mask De Masculine bile onun eseridir.",
        en: "He is the true bearer: cheering bestows power — the hero he applauds grows stronger for as long as the applause lasts. Even Mask De Masculine is his creation.",
      } },
      {
        name: "Mask De Masculine",
        epithet: "The Superstar",
        note: {
          tr: "James'in tasavvuru — etten kemikten bir 'ideal kahraman'",
          en: "James's conception — an 'ideal hero' given flesh",
        },
      },
    ],
  },
  { letter: "T", bearers: [{ name: "Candice Catnipp", epithet: "The Thunderbolt", power: {
        tr: "Yıldırım onun elindedir — gücü, adının söylediğinden ne bir eksik ne bir fazla.",
        en: "The thunderbolt is hers to throw — the power is exactly what the name says, no more and no less.",
      } }] },
  { letter: "U", bearers: [{ name: "NaNaNa Najahkoop", epithet: "The Underbelly", power: {
        tr: "Reiatsu'daki savunmasız noktayı görür: bir gücü yeterince izlerse, sahibini tek dokunuşta kilitleyeceği yeri bulur.",
        en: "Sees the defenseless point in reiatsu: watch a power long enough and he finds the spot where one touch locks its owner still.",
      } }] },
  {
    letter: "V",
    bearers: [
      { name: "Gremmy Thoumeaux", epithet: "The Visionary", power: {
        tr: "Hayal ettiği şey gerçek olur: çelikten bir beden, gökten indirilen bir göktaşı, kendisinin ikizi. Sınır yalnızca hayalinin cesaretidir.",
        en: "What he imagines becomes real: a body of steel, a meteor pulled from the sky, a second self. The only limit is the nerve of the imagining.",
      } },
      {
        name: "Guenael Lee",
        epithet: "Vanishing Point", power: {
        tr: "Üç adımda silinir: önce gözden, sonra algıdan, en sonunda hafızadan. Onu unutmanız, gücün ta kendisidir.",
        en: "Vanishes in three steps: first from sight, then from perception, finally from memory. Forgetting him is the power itself.",
      },
        note: { tr: "Gremmy'nin yarattığı", en: "created by Gremmy" },
      },
    ],
  },
  { letter: "W", bearers: [{ name: "Nianzol Weizol", epithet: "The Wind", power: {
        tr: "Ona uzanan her şey yolundan sapar: kılıç, ok, bina — dokunamadan bükülür. Savunması, savunmaya hiç ihtiyaç duymamaktır.",
        en: "Whatever reaches for him bends aside: sword, arrow, building — deflected before it can touch. His defense is never needing one.",
      } }] },
  { letter: "X", bearers: [{ name: "Lille Barro", epithet: "The X-Axis", power: {
        tr: "Namlusuyla hedefi arasındaki her şeyi deler; tetik düştüğünde mesafe ve siper diye bir şey kalmaz. Yhwach'ın mührünü alan ilk Quincy oydu.",
        en: "Pierces everything on the line between muzzle and target; when the trigger falls, distance and cover cease to exist. He was the first Quincy ever to receive a Schrift.",
      } }] },
  {
    letter: "Y",
    bearers: [
      { name: "Loyd Lloyd", epithet: "The Yourself", power: {
        tr: "Dokunduğunun biçimini ve gücünü kopyalar — kılıcına ve kasına kadar.",
        en: "Copies the shape and strength of whoever he touches — down to the blade and the muscle.",
      } },
      {
        name: "Royd Lloyd",
        epithet: "The Yourself", power: {
        tr: "İkizinin tersini kopyalar: biçimle birlikte hafızayı ve benliği alır. Yamamoto'nun karşısında Yhwach olarak ölen oydu.",
        en: "Copies the other half: with the shape he takes the memories and the self. It was he who died as Yhwach before Yamamoto.",
      },
        note: { tr: "ikizi, aynı harf", en: "his twin, the same letter" },
      },
    ],
  },
  {
    letter: "Z",
    bearers: [{ name: "Giselle Gewelle", epithet: "The Zombie", power: {
        tr: "Kanına bulanan onun olur: ölüler ayağa kalkar, diriler iradesini teslim eder. Ordusu, düşmanlarının kendisidir.",
        en: "Whoever is soaked in her blood belongs to her: the dead rise, the living surrender their will. Her army is her enemies.",
      }, note: gone }],
  },
];
