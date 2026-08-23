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
      { name: "Yhwach", epithet: "The Almighty" },
      { name: "Uryū Ishida", epithet: "Antithesis", note: gone },
    ],
  },
  { letter: "B", bearers: [{ name: "Jugram Haschwalth", epithet: "The Balance" }] },
  { letter: "C", bearers: [{ name: "Pernida Parnkgjas", epithet: "The Compulsory" }] },
  { letter: "D", bearers: [{ name: "Askin Nakk Le Vaar", epithet: "The Deathdealing" }] },
  { letter: "E", bearers: [{ name: "Bambietta Basterbine", epithet: "The Explode" }] },
  { letter: "F", bearers: [{ name: "Äs Nödt", epithet: "The Fear" }] },
  {
    letter: "G",
    bearers: [{ name: "Liltotto Lamperd", epithet: "The Glutton", note: gone }],
  },
  { letter: "H", bearers: [{ name: "Bazz-B", epithet: "The Heat", note: gone }] },
  { letter: "I", bearers: [{ name: "Cang Du", epithet: "The Iron" }] },
  { letter: "J", bearers: [{ name: "Quilge Opie", epithet: "The Jail" }] },
  /* ⚠️ Taşıyıcı biliniyor, Schrift adı canon'da HİÇ açıklanmadı. */
  { letter: "K", bearers: [{ name: "BG9", epithet: null }] },
  { letter: "L", bearers: [{ name: "PePe Waccabrada", epithet: "The Love" }] },
  { letter: "M", bearers: [{ name: "Gerard Valkyrie", epithet: "The Miracle" }] },
  { letter: "N", bearers: [{ name: "Robert Accutrone", epithet: null }] },
  { letter: "O", bearers: [{ name: "Driscoll Berci", epithet: "The Overkill" }] },
  { letter: "P", bearers: [{ name: "Meninas McAllon", epithet: "The Power" }] },
  { letter: "Q", bearers: [{ name: "Berenice Gabrielli", epithet: "The Question" }] },
  { letter: "R", bearers: [{ name: "Jerome Guizbatt", epithet: "The Roar" }] },
  {
    letter: "S",
    bearers: [
      { name: "Mask De Masculine", epithet: "The Superstar" },
      {
        name: "James",
        epithet: "The Superstar",
        note: { tr: "aynı harfin ikinci taşıyıcısı", en: "the letter's second bearer" },
      },
    ],
  },
  { letter: "T", bearers: [{ name: "Candice Catnipp", epithet: "The Thunderbolt" }] },
  { letter: "U", bearers: [{ name: "NaNaNa Najahkoop", epithet: "The Underbelly" }] },
  {
    letter: "V",
    bearers: [
      { name: "Gremmy Thoumeaux", epithet: "The Visionary" },
      {
        name: "Guenael Lee",
        epithet: "Vanishing Point",
        note: { tr: "Gremmy'nin yarattığı", en: "created by Gremmy" },
      },
    ],
  },
  { letter: "W", bearers: [{ name: "Nianzol Weizol", epithet: "The Wind" }] },
  { letter: "X", bearers: [{ name: "Lille Barro", epithet: "The X-Axis" }] },
  {
    letter: "Y",
    bearers: [
      { name: "Loyd Lloyd", epithet: "The Yourself" },
      {
        name: "Royd Lloyd",
        epithet: "The Yourself",
        note: { tr: "ikizi, aynı harf", en: "his twin, the same letter" },
      },
    ],
  },
  {
    letter: "Z",
    bearers: [{ name: "Giselle Gewelle", epithet: "The Zombie", note: gone }],
  },
];
