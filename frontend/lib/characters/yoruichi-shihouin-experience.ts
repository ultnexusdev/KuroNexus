import type { LocalizedText } from "./types";

/**
 * Yoruichi Shihōin — "İki beden, tek künye" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali): karaktere ait BÜTÜN anlatı kodda, iki dilli
 * `LocalizedText` çiftleri olarak. Bileşen `pick(text, locale)` ile seçiyor;
 * istemci adalarına yalnızca düz dize iniyor.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * İKİ BEDEN, TEK KİŞİ. Yoruichi uzun süre kara bir kediye dönüşebiliyor ve
 * bu sayfanın esprisi tam olarak orada: künye tablosu insan gövdesi için
 * tutulmuş. Form değiştiğinde satırların bir kısmı çevriliyor (gövde, ses,
 * hız), bir kısmı hiç kıpırdamıyor (doğum günü, hane, makam) ve BEŞ SATIR
 * ANLAMINI YİTİRİYOR — boy, kıyafet bedeni, kılıç ölçüsü, Shunkō, el.
 * Veri tablosunun geçerliliğini kaybetmesi. Aynı kişi, ölçülemeyen yarısı.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (1 Ocak), boy (156 cm), makamlar (四楓院家'nın 22. reisi,
 * 2. Bölük kaptanı, Onmitsukidō başkomutanı, 刑軍 kumandanı) ve ortağı
 * (Kisuke Urahara) AniList künyesinden birebir alındı — karakter 908,
 * 31 Ağustos 2026; çekimin kopyası
 * `public/assets/anime/karakterler/yoruichi-shihouin/kaynak.json`.
 *
 * ⚠️ YAŞ YOK, KAN GRUBU YOK. AniList kaydında ikisi de boş ve seri de
 * vermiyor. Künye şeridinde yaş bir eksiklik olarak DEĞİL, İKİ GÖVDEDE DE
 * BOŞ bir satır olarak duruyor: bu sayfada boşluğun kendisi konu. Uydurma
 * sayı yazılmadı.
 *
 * ── TERMİNOLOJİ (Bleach; Naruto/JJK sözlüğü KULLANILMADI) ────────────────
 * 瞬歩 Shunpo, 瞬閧 Shunkō, 白打 Hakuda, 隠密機動 Onmitsukidō, 鬼道 Kidō,
 * 空蝉 Utsusemi, 斬術 Zanjutsu, 二番隊 İkinci Bölük, 総司令官 başkomutan,
 * 刑軍 Ceza Birliği, 四楓院家 Shihōin hanesi, 瞬神 Shunshin.
 *
 * Bunların çoğu arşivin KENDİ Bleach defterinden doğrulandı:
 * `lib/anime/bleach/powers.ts` (斬術 · 白打 · 歩法/瞬歩 · 鬼道),
 * `lib/anime/bleach/hierarchy.ts` (隠密機動 · 総司令官 · 刑軍),
 * `lib/anime/bleach/houses.ts` (四楓院家). 瞬神 dalga briefinden geldi.
 *
 * ── REPLİK DİSİPLİNİ — ⚠️ BU SAYFADA DİYALOG TIRNAĞA ALINMADI ────────────
 * Dalga kuralı: "emin olmadığın cümleyi tırnağa alma." Yoruichi'nin
 * doğrulanabilir tek bir Japonca replik kaydı bu turda elde edilemedi
 * (AniList künyesi replik taşımıyor, arşivin Bleach defterinde de yok).
 * Uydurulmuş bir cümleyi tırnak içinde göstermek bir kanon hatası olurdu.
 *
 * Bu yüzden "orijinal dil" durakları DİYALOG değil KAYIT: her kader
 * durağında ve kapanışta tırnağa alınan şey doğrulanmış bir terim ya da
 * adın kendisi, ve her birinin altında nereden geldiği yazılı. Kapanıştaki
 * not bunu açıkça söylüyor — okuyucu eksiği görmeli, uydurmayı değil.
 */

export const YOR_ID = 908;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const YOR_SITE_URL = "https://anilist.co/character/908";

/**
 * Depodaki resmî portre (Faz 2 §3: hotlink yok, kare repoda).
 *
 * ⚠️ 230×345 — KÜÇÜK. Yalnızca dar bir madalyon kadrajında kullanılıyor;
 * iki büyük hero karesi (insan ve kedi) küratör yuvası olarak boş duruyor.
 * Kendi kaynağımız olduğu için `next/image`de `unoptimized` YOK.
 */
export const YOR_PORTRAIT = {
  src: "/assets/anime/karakterler/yoruichi-shihouin/anilist-portrait.png",
  w: 230,
  h: 345,
} as const;

/**
 * Sergi görselleri — hepsi characterId 908 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `yor:` önekli.
 *
 * ⚠️ İKİ AYRI HERO ANAHTARI. İnsan ve kedi kadrajı aynı yuvayı PAYLAŞMIYOR:
 * paylaşsalardı küratör bir formu yüklediğinde ötekini eziyor olurdu ve
 * sayfanın tek mekaniği (form değişince kadraj da değişir) yalan olurdu.
 */
export const YOR_IMAGE_KEYS = {
  heroHuman: "yor:hero-human",
  heroCat: "yor:hero-cat",
  ledger: "yor:ledger",
  powerShunko: "yor:shunko",
  powerShunpo: "yor:shunpo",
  powerHakuda: "yor:hakuda",
  kitOnmitsu: "yor:onmitsukido",
  kitKido: "yor:kido",
  kitUtsusemi: "yor:utsusemi",
  kitZanjutsu: "yor:zanjutsu",
  bodies: "yor:two-bodies",
  fateHouse: "yor:fate-shihoin",
  fateCommand: "yor:fate-nibantai",
  fateExile: "yor:fate-exile",
  fateKarakura: "yor:fate-karakura",
  fateWar: "yor:fate-tybw",
  closing: "yor:closing",
} as const;

/** Küratör yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const YOR_SLOT_LABELS: Record<string, LocalizedText> = {
  [YOR_IMAGE_KEYS.heroHuman]: {
    tr: "Hero · insan formu — dikey portre, tam boy (3:4)",
    en: "Hero · human form — vertical portrait, full figure (3:4)",
  },
  [YOR_IMAGE_KEYS.heroCat]: {
    tr: "Hero · kedi formu — kara kedi, aynı kadrajın karşılığı (3:4)",
    en: "Hero · cat form — the black cat, the same frame's counterpart (3:4)",
  },
  [YOR_IMAGE_KEYS.ledger]: {
    tr: "Künye şeridi — dönüşümün ortası, iki gövde bir arada (16:9)",
    en: "Ledger band — mid-transformation, both bodies at once (16:9)",
  },
  [YOR_IMAGE_KEYS.powerShunko]: {
    tr: "瞬閧 Shunkō — sırtta ve omuzlarda beyaz şimşek (16:9)",
    en: "瞬閧 Shunkō — white lightning across back and shoulders (16:9)",
  },
  [YOR_IMAGE_KEYS.powerShunpo]: {
    tr: "瞬歩 Shunpo — art-görüntü, başlangıç ve bitiş aynı karede (16:9)",
    en: "瞬歩 Shunpo — afterimage, start and finish in one frame (16:9)",
  },
  [YOR_IMAGE_KEYS.powerHakuda]: {
    tr: "白打 Hakuda — çıplak el, kılıçsız duruş (16:9)",
    en: "白打 Hakuda — bare hands, a stance without a blade (16:9)",
  },
  [YOR_IMAGE_KEYS.kitOnmitsu]: {
    tr: "隠密機動 — gizli harekât, gece damları (3:2)",
    en: "隠密機動 — covert ops, rooftops at night (3:2)",
  },
  [YOR_IMAGE_KEYS.kitKido]: {
    tr: "鬼道 — büyünün açıldığı an (3:2)",
    en: "鬼道 — the instant a spell opens (3:2)",
  },
  [YOR_IMAGE_KEYS.kitUtsusemi]: {
    tr: "空蝉 — vuruşun bulduğu boş kabuk (3:2)",
    en: "空蝉 — the empty shell the blow finds (3:2)",
  },
  [YOR_IMAGE_KEYS.kitZanjutsu]: {
    tr: "斬術 — kayıtta neredeyse yok; boş kalabilir (3:2)",
    en: "斬術 — almost absent from the record; may stay empty (3:2)",
  },
  [YOR_IMAGE_KEYS.bodies]: {
    tr: "İki beden — insan ve kedi aynı kadrajda (16:9)",
    en: "Two bodies — human and cat in one frame (16:9)",
  },
  [YOR_IMAGE_KEYS.fateHouse]: {
    tr: "四楓院家 — hanenin konağı, akçaağaç arması (3:2)",
    en: "四楓院家 — the house's manor, the maple crest (3:2)",
  },
  [YOR_IMAGE_KEYS.fateCommand]: {
    tr: "二番隊 — kaptan haorisi ve Onmitsukidō üniforması (3:2)",
    en: "二番隊 — captain's haori and the Onmitsukidō uniform (3:2)",
  },
  [YOR_IMAGE_KEYS.fateExile]: {
    tr: "Sürgün gecesi — Seireitei'den çıkış, karanlık (3:2)",
    en: "The night of exile — leaving the Seireitei, in the dark (3:2)",
  },
  [YOR_IMAGE_KEYS.fateKarakura]: {
    tr: "Karakura — yeraltı talim odası, eğitim (3:2)",
    en: "Karakura — the underground training room (3:2)",
  },
  [YOR_IMAGE_KEYS.fateWar]: {
    tr: "Bin Yıllık Kan Savaşı — cephede Shunkō (3:2)",
    en: "The Thousand-Year Blood War — Shunkō at the front (3:2)",
  },
  [YOR_IMAGE_KEYS.closing]: {
    tr: "Kapanış — geride kalan kabuk, geniş bant (21:9)",
    en: "Closing — the shell left behind, wide band (21:9)",
  },
};

/** Küratör yuvalarının beklenen kare tipi + ölçüsü (CuratorGaps satırları). */
export const YOR_SLOT_SPECS: Record<string, LocalizedText> = {
  [YOR_IMAGE_KEYS.heroHuman]: {
    tr: "dikey portre · 1200×1600 · webp",
    en: "vertical portrait · 1200×1600 · webp",
  },
  [YOR_IMAGE_KEYS.heroCat]: {
    tr: "dikey portre · 1200×1600 · webp",
    en: "vertical portrait · 1200×1600 · webp",
  },
  [YOR_IMAGE_KEYS.ledger]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [YOR_IMAGE_KEYS.powerShunko]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [YOR_IMAGE_KEYS.powerShunpo]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [YOR_IMAGE_KEYS.powerHakuda]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [YOR_IMAGE_KEYS.kitOnmitsu]: {
    tr: "yatay kare · 1200×800 · webp",
    en: "landscape · 1200×800 · webp",
  },
  [YOR_IMAGE_KEYS.kitKido]: {
    tr: "yatay kare · 1200×800 · webp",
    en: "landscape · 1200×800 · webp",
  },
  [YOR_IMAGE_KEYS.kitUtsusemi]: {
    tr: "yatay kare · 1200×800 · webp",
    en: "landscape · 1200×800 · webp",
  },
  [YOR_IMAGE_KEYS.kitZanjutsu]: {
    tr: "yatay kare · 1200×800 · webp",
    en: "landscape · 1200×800 · webp",
  },
  [YOR_IMAGE_KEYS.bodies]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [YOR_IMAGE_KEYS.fateHouse]: {
    tr: "yatay kare · 1200×800 · webp",
    en: "landscape · 1200×800 · webp",
  },
  [YOR_IMAGE_KEYS.fateCommand]: {
    tr: "yatay kare · 1200×800 · webp",
    en: "landscape · 1200×800 · webp",
  },
  [YOR_IMAGE_KEYS.fateExile]: {
    tr: "yatay kare · 1200×800 · webp",
    en: "landscape · 1200×800 · webp",
  },
  [YOR_IMAGE_KEYS.fateKarakura]: {
    tr: "yatay kare · 1200×800 · webp",
    en: "landscape · 1200×800 · webp",
  },
  [YOR_IMAGE_KEYS.fateWar]: {
    tr: "yatay kare · 1200×800 · webp",
    en: "landscape · 1200×800 · webp",
  },
  [YOR_IMAGE_KEYS.closing]: {
    tr: "geniş bant · 1920×820 · webp",
    en: "wide band · 1920×820 · webp",
  },
};

/** `CuratorSlot`un `size` propu — yükleyici oranı kendisi yazıyor. */
export const YOR_SLOT_SIZES: Record<string, { w: number; h: number }> = {
  [YOR_IMAGE_KEYS.heroHuman]: { w: 1200, h: 1600 },
  [YOR_IMAGE_KEYS.heroCat]: { w: 1200, h: 1600 },
  [YOR_IMAGE_KEYS.ledger]: { w: 1600, h: 900 },
  [YOR_IMAGE_KEYS.powerShunko]: { w: 1600, h: 900 },
  [YOR_IMAGE_KEYS.powerShunpo]: { w: 1600, h: 900 },
  [YOR_IMAGE_KEYS.powerHakuda]: { w: 1600, h: 900 },
  [YOR_IMAGE_KEYS.kitOnmitsu]: { w: 1200, h: 800 },
  [YOR_IMAGE_KEYS.kitKido]: { w: 1200, h: 800 },
  [YOR_IMAGE_KEYS.kitUtsusemi]: { w: 1200, h: 800 },
  [YOR_IMAGE_KEYS.kitZanjutsu]: { w: 1200, h: 800 },
  [YOR_IMAGE_KEYS.bodies]: { w: 1600, h: 900 },
  [YOR_IMAGE_KEYS.fateHouse]: { w: 1200, h: 800 },
  [YOR_IMAGE_KEYS.fateCommand]: { w: 1200, h: 800 },
  [YOR_IMAGE_KEYS.fateExile]: { w: 1200, h: 800 },
  [YOR_IMAGE_KEYS.fateKarakura]: { w: 1200, h: 800 },
  [YOR_IMAGE_KEYS.fateWar]: { w: 1200, h: 800 },
  [YOR_IMAGE_KEYS.closing]: { w: 1920, h: 820 },
};

/** Kapak portresi yuvasının etiketi. */
export const YOR_PORTRAIT_SLOT: LocalizedText = {
  tr: "Kapak portresi — dikey, 1200×1600, webp",
  en: "Cover portrait — vertical, 1200×1600, webp",
};

/** Boş kadrajın küratöre görünen notu (ziyaretçi bunu GÖRMÜYOR). */
export const YOR_FRAME_EMPTY: LocalizedText = {
  tr: "Boş kadraj",
  en: "Empty frame",
};

/** `alt` metinlerinin ortak öneki — her görselde kaynak bilgisi olsun. */
export const YOR_ALT = {
  scenePrefix: {
    tr: "Yoruichi Shihōin · arşive yüklenen kare —",
    en: "Yoruichi Shihōin · frame uploaded to the archive —",
  },
} as const;

export const YOR_CRUMB = {
  series: { tr: "Bleach", en: "Bleach" },
} as const;

/** Hero künyesi — hepsi AniList kaydından. */
export const YOR_IDENTITY = {
  name: "Yoruichi Shihōin",
  nativeName: "四楓院夜一",
  house: {
    tr: "Shihōin hanesi · 四楓院家",
    en: "House of Shihōin · 四楓院家",
  },
  title: "瞬神",
  titleReading: {
    tr: "shunshin — “şimşek tanrıçası”, Soul Society'nin ona taktığı ad",
    en: "shunshin — “Goddess of Flash”, the name Soul Society gave her",
  },
  epigraph: {
    tr: "Aynı kişi iki gövdeye sığıyor. Künye yalnız birine göre yazılmış.",
    en: "One person fits into two bodies. The record was written for only one of them.",
  },
} as const;

export const YOR_HERO = {
  lede: {
    tr: "İkinci Bölük'ün eski kaptanı, Onmitsukidō'nun eski başkomutanı ve Shihōin hanesinin yirmi ikinci reisi. Uzun süre kara bir kediye dönüşebiliyor — ve dönüştüğü anda bu sayfadaki tablonun yarısı ölçülemez hâle geliyor.",
    en: "Former captain of the Second Division, former Commander-in-Chief of the Onmitsukidō, and twenty-second head of the House of Shihōin. She can hold the shape of a black cat for long stretches — and the moment she does, half the table on this page stops being measurable.",
  },
  portraitAlt: {
    tr: "Yoruichi Shihōin — AniList resmî portresi (230×345, depodaki kopya)",
    en: "Yoruichi Shihōin — official AniList portrait (230×345, repository copy)",
  },
  portraitAltUploaded: {
    tr: "Yoruichi Shihōin — arşive yüklenen kapak portresi",
    en: "Yoruichi Shihōin — cover portrait uploaded to the archive",
  },
  humanFrameNote: {
    tr: "İnsan formunun büyük kadrajı boş. Depodaki portre 230 piksel geniş; bu ölçü tam kanama bir kare için yetmiyor, o yüzden kadraj küratöre bırakıldı.",
    en: "The large frame for the human form is empty. The portrait in the repository is 230 pixels wide, which is not enough for a full-bleed frame, so the frame was left to the curator.",
  },
  catFrameNote: {
    tr: "Kedi formunun kadrajı AYRI bir yuva: iki gövde aynı kareyi paylaşmıyor.",
    en: "The cat form has its own separate slot: the two bodies do not share one frame.",
  },
  railLabel: {
    tr: "Hero kadrajları — yatay kaydırılabilir",
    en: "Hero frames — horizontally scrollable",
  },
} as const;

/** Mod düğmesi — sayfanın tek durumu. */
export const YOR_FORM_UI = {
  title: { tr: "Kedi formu", en: "Cat form" },
  native: "猫",
  enter: { tr: "Kedi formuna geç", en: "Switch to cat form" },
  exit: { tr: "İnsan formuna dön", en: "Return to human form" },
  hintHuman: {
    tr: "İnsan formu. Künyenin on üç satırının hepsi okunuyor.",
    en: "Human form. All thirteen rows of the record are readable.",
  },
  hintCat: {
    tr: "Kedi formu. Beş satır ölçülemez hâle geldi ve “—” gösteriyor.",
    en: "Cat form. Five rows have become unmeasurable and now show “—”.",
  },
  markLabel: { tr: "Form işareti", en: "Form mark" },
} as const;

/** Bölüm başlıkları ve girişleri. */
export const YOR_SECTIONS = {
  ledger: {
    title: { tr: "Künye şeridi", en: "The record band" },
    lede: {
      tr: "On üç satır, tek gövdeye göre yazılmış. Yukarıdaki düğmeye bastığında satırlar tek tek çevriliyor: bazıları aynı kalıyor, bazıları başka bir değer veriyor, beşi ölçülemez hâle düşüp “—” gösteriyor. Şeridi yatay kaydırarak oku.",
      en: "Thirteen rows, written for a single body. Press the button above and the rows turn over one by one: some stay the same, some report a different value, and five drop out of measurement and show “—”. Scroll the band sideways to read it.",
    },
  },
  powers: {
    title: { tr: "Güç laboratuvarı", en: "The power lab" },
    lede: {
      tr: "Üç büyük kayıt. Yoruichi'nin dövüş dili Onmitsukidō'nun dili: kılıç değil el, kuvvet değil mesafe.",
      en: "Three large entries. Yoruichi's fighting language is the Onmitsukidō's: not the blade but the hand, not force but distance.",
    },
  },
  kit: {
    title: { tr: "Dört küçük kayıt", en: "Four smaller entries" },
    lede: {
      tr: "Komuta, büyü, art-görüntü — ve kayıtta neredeyse hiç görünmeyen dördüncü sanat.",
      en: "Command, demon arts, the afterimage — and the fourth art that barely appears in the record at all.",
    },
  },
  bodies: {
    title: { tr: "İki beden", en: "Two bodies" },
    lede: {
      tr: "Aynı on üç satır, bu sefer tek tek. Bir satır seç: iki gövdenin okumaları yan yana geliyor, ölçülemeyenlerin nedeni yazılı.",
      en: "The same thirteen rows, this time one at a time. Pick a row: the two bodies' readings appear side by side, and the reason is written out for the ones that cannot be measured.",
    },
  },
  fate: {
    title: { tr: "Kader çizelgesi", en: "The line of fate" },
    lede: {
      tr: "Beş durak, dönem etiketli. Her durağın altında o dönemin orijinal dildeki kaydı duruyor.",
      en: "Five stops, each labelled by era. Under every stop sits that era's record in the original language.",
    },
  },
  bonds: {
    title: { tr: "Bağlar", en: "Bonds" },
    lede: {
      tr: "Beş ad. Arşivde kendi dosyası olanlar bağlantılı; olmayanlar yalnızca adla duruyor.",
      en: "Five names. The ones with their own file in the archive are linked; the rest stand as names only.",
    },
  },
  world: {
    title: { tr: "Bleach evrenine dön", en: "Back into the Bleach universe" },
    lede: {
      tr: "Bu künyenin bağlı olduğu dört bölüm, evren sayfasında.",
      en: "The four sections this record hangs from, over on the universe page.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "İki satır, bir motto ve künyenin kendisi.",
      en: "Two lines, one motto, and the record itself.",
    },
  },
} as const;

/** Yatay şeritlerin ortak yardım metni — klavye kullanıcısı için. */
export const YOR_RAIL_UI = {
  hint: {
    tr: "Yatay şerit: sekmeyle odaklan, ok tuşlarıyla kaydır.",
    en: "Horizontal band: focus with Tab, scroll with the arrow keys.",
  },
  ledgerLabel: {
    tr: "Künye şeridi — yatay kaydırılabilir",
    en: "Record band — horizontally scrollable",
  },
  powersLabel: {
    tr: "Üç büyük kayıt — yatay kaydırılabilir",
    en: "Three large entries — horizontally scrollable",
  },
  kitLabel: {
    tr: "Dört küçük kayıt — yatay kaydırılabilir",
    en: "Four smaller entries — horizontally scrollable",
  },
  fateLabel: {
    tr: "Kader çizelgesi — yatay kaydırılabilir",
    en: "The line of fate — horizontally scrollable",
  },
  bondsLabel: {
    tr: "Bağlar — yatay kaydırılabilir",
    en: "Bonds — horizontally scrollable",
  },
  worldLabel: {
    tr: "Evren bağlantıları — yatay kaydırılabilir",
    en: "Universe links — horizontally scrollable",
  },
} as const;

/**
 * KÜNYE SATIRI — sayfanın mekaniği bu tipin üstünde duruyor.
 *
 * `cat === null` demek "bu satır kedi formunda ölçülemiyor" demek; o zaman
 * `voidReason` ZORUNLU, çünkü ekran okuyucuya çıplak bir tire bırakmak
 * yasak (erişilebilirlik şartı). Bileşen tireyi `aria-hidden` yazıyor ve
 * gerçek cevabı bu metinden veriyor.
 */
export interface YoruichiLedgerRow {
  key: string;
  /** Satırın orijinal dildeki başlığı — şeritteki mono etiket */
  kanji: string;
  label: LocalizedText;
  human: LocalizedText;
  /** Kedi formundaki okuma; `null` ise satır geçerliliğini kaybediyor */
  cat: LocalizedText | null;
  /** `cat === null` iken neden ölçülemediği */
  voidReason?: LocalizedText;
  /** İki okumayı birlikte açıklayan not (durak 5'te okunuyor) */
  note: LocalizedText;
}

/**
 * ON ÜÇ SATIR. Beşi kedi formunda düşüyor: boy, kıyafet bedeni, kılıç
 * ölçüsü, Shunkō, el. Dördü hiç kıpırdamıyor (doğum, hane, makam, yaş),
 * dördü başka bir değer veriyor (gövde, göz, ses, hız).
 *
 * ⚠️ Sıra bilinçli: değişmeyenle başlıyor, çevrilenle devam ediyor,
 * düşenlerle bitiyor. Kedi formuna geçildiğinde şeridin sağ ucu topluca
 * griye düşüyor ve tablonun geçerliliğini kaybettiği gözle görülüyor.
 */
export const YOR_LEDGER: readonly YoruichiLedgerRow[] = [
  {
    key: "birth",
    kanji: "生",
    label: { tr: "Doğum günü", en: "Birthday" },
    human: { tr: "1 Ocak", en: "1 January" },
    cat: { tr: "1 Ocak", en: "1 January" },
    note: {
      tr: "Takvim gövdeye bakmıyor. Bu satır dönüşümden hiç etkilenmeyen dört satırdan biri.",
      en: "The calendar does not care which body you are in. This is one of the four rows the transformation never touches.",
    },
  },
  {
    key: "house",
    kanji: "家",
    label: { tr: "Hane", en: "House" },
    human: {
      tr: "四楓院家 · yirmi ikinci reis (eski)",
      en: "四楓院家 · twenty-second head (former)",
    },
    cat: {
      tr: "四楓院家 · yirmi ikinci reis (eski)",
      en: "四楓院家 · twenty-second head (former)",
    },
    note: {
      tr: "Asalet bir gövde özelliği değil bir kayıt. Hanenin başı bugün kardeşi Yūshirō.",
      en: "Nobility is not a property of a body; it is an entry in a book. The head of the house today is her brother Yūshirō.",
    },
  },
  {
    key: "office",
    kanji: "位",
    label: { tr: "Makam", en: "Office" },
    human: {
      tr: "二番隊隊長 · 隠密機動 総司令官 · 刑軍 kumandanı (hepsi eski)",
      en: "二番隊隊長 · 隠密機動 総司令官 · commander of the 刑軍 (all former)",
    },
    cat: {
      tr: "二番隊隊長 · 隠密機動 総司令官 · 刑軍 kumandanı (hepsi eski)",
      en: "二番隊隊長 · 隠密機動 総司令官 · commander of the 刑軍 (all former)",
    },
    note: {
      tr: "İki makamı aynı anda tutan tek isim. Onmitsukidō ile İkinci Bölük yüz on yılı aşkın süredir tek gövde sayılıyor ve bunun sebebi bu satır.",
      en: "The only name to hold both offices at once. The Onmitsukidō and the Second Division have been counted as one body for over a hundred and ten years, and this row is the reason.",
    },
  },
  {
    key: "body",
    kanji: "体",
    label: { tr: "Gövde", en: "Body" },
    human: {
      tr: "İki ayak üstünde, koyu tenli bir kadın",
      en: "A dark-skinned woman on two feet",
    },
    cat: {
      tr: "Dört ayak üstünde, kara bir kedi",
      en: "A black cat on four legs",
    },
    note: {
      tr: "Sayfanın çevirdiği ilk satır. Geri kalan on iki satırın hepsi bunun sonucu.",
      en: "The first row the page turns over. All twelve of the others are consequences of it.",
    },
  },
  {
    key: "eyes",
    kanji: "眼",
    label: { tr: "Göz", en: "Eyes" },
    human: { tr: "Altın sarısı", en: "Golden yellow" },
    cat: { tr: "Altın sarısı", en: "Golden yellow" },
    note: {
      tr: "Gövde değişiyor, göz değişmiyor. Kediyi tanıyanlar buradan tanıyor.",
      en: "The body changes; the eyes do not. Those who recognise the cat recognise it here.",
    },
  },
  {
    key: "voice",
    kanji: "声",
    label: { tr: "Ses", en: "Voice" },
    human: {
      tr: "Kendinden 「俺」 diye söz ediyor — bir asilzade kadın için alışılmadık bir zamir",
      en: "She refers to herself as 「俺」 — an unusual pronoun for a noblewoman",
    },
    cat: {
      tr: "Aynı zamir, başka bir tını: kedi gövdesinde ses kalınlaşıyor ve onu ilk duyan çoğu kişi bir erkek sanıyor",
      en: "The same pronoun, a different timbre: in the cat body the voice drops, and most people hearing it first assume a man",
    },
    note: {
      tr: "Konuşan aynı kişi. Değişen tek şey sesin çıktığı gövde — ve bu yanılgı serinin en bilinen şakalarından biri.",
      en: "The same person is speaking. The only thing that changes is the body the voice comes out of — and that misreading is one of the series' best-known jokes.",
    },
  },
  {
    key: "speed",
    kanji: "速",
    label: { tr: "Hız", en: "Speed" },
    human: {
      tr: "瞬歩 · ölçü sayıyla değil rakiple veriliyor",
      en: "瞬歩 · measured against opponents, never in numbers",
    },
    cat: {
      tr: "Kedi formunda da hızlı; kayıt yine sayı vermiyor",
      en: "Fast in the cat form too; the record still refuses a number",
    },
    note: {
      tr: "İki gövdede de dolu, iki gövdede de belirsiz. 瞬神 adı bu satırdan geliyor ama satırın kendisinde ölçü yok.",
      en: "Filled in both bodies, vague in both. The name 瞬神 comes from this row, yet the row itself carries no measurement.",
    },
  },
  {
    key: "age",
    kanji: "齢",
    label: { tr: "Yaş", en: "Age" },
    human: { tr: "Kayıtta yok", en: "Not in the record" },
    cat: { tr: "Kayıtta yok", en: "Not in the record" },
    note: {
      tr: "Bu satır iki gövdede de boş. Eksik olan beden değil kaydın kendisi — AniList künyesinde yaş da kan grubu da girilmemiş ve bu sayfa oraya sayı uydurmuyor.",
      en: "This row is empty in both bodies. What is missing is not a body but the record itself — the AniList entry has neither age nor blood type, and this page will not invent one.",
    },
  },
  {
    key: "height",
    kanji: "身長",
    label: { tr: "Boy", en: "Height" },
    human: { tr: "156 cm", en: "156 cm" },
    cat: null,
    voidReason: {
      tr: "Kedi gövdesinde bu ölçünün karşılığı yok: kayıt ayakta duran bir insan için tutulmuş.",
      en: "There is no counterpart to this measurement in a cat's body: the record was kept for a human standing upright.",
    },
    note: {
      tr: "Tablonun düşen ilk satırı. Sayı yanlış olmuyor — sorulacak yeri kalmıyor.",
      en: "The first row of the table to fall. The number does not become wrong; there is simply nothing left to ask it of.",
    },
  },
  {
    key: "clothing",
    kanji: "衣",
    label: { tr: "Kıyafet bedeni", en: "Clothing size" },
    human: { tr: "Ölçülebilir, kayda geçer", en: "Measurable, goes on file" },
    cat: null,
    voidReason: {
      tr: "Kedi formunda kıyafet yok; dönüş de kıyafetsiz oluyor. Ölçüye konu olacak bir beden kalmıyor.",
      en: "There is no clothing in the cat form, and the way back out of it has none either. No garment is left to size.",
    },
    note: {
      tr: "Serinin şakaya çevirdiği ayrıntı burada bir veri sorunu: dönüşüm kıyafeti taşımıyor.",
      en: "A detail the series plays for comedy is a data problem here: the transformation does not carry clothing across.",
    },
  },
  {
    key: "blade",
    kanji: "刀",
    label: { tr: "Kılıç ölçüsü", en: "Blade measurement" },
    human: {
      tr: "Kayıtta kılıç yok: 白打 ile dövüşüyor",
      en: "No blade on file: she fights with 白打",
    },
    cat: null,
    voidReason: {
      tr: "Tutacak el yok. Kabza ölçüsü pençede anlamını yitiriyor.",
      en: "There is no hand to hold it with. A grip measurement means nothing on a paw.",
    },
    note: {
      tr: "Bu satır insan formunda da yarı boş. Yoruichi'nin dövüş dili kılıç değil el — ve o el kedi formunda da yok.",
      en: "This row is half empty even in the human form. Yoruichi's fighting language is the hand, not the blade — and that hand is gone in the cat form too.",
    },
  },
  {
    key: "shunko",
    kanji: "瞬閧",
    label: { tr: "Shunkō", en: "Shunkō" },
    human: { tr: "Uygulanabilir", en: "Available" },
    cat: null,
    voidReason: {
      tr: "Teknik sırtı ve omuzları açarak kuruluyor; kedi gövdesinde açılacak bir sırt yok.",
      en: "The technique is set up by baring the back and shoulders; a cat's body has no back to bare.",
    },
    note: {
      tr: "Sayfanın adını taşıyan satır kedi formunda düşüyor. Bileşenin adı ShunkoExperience ve mekanik tam olarak bunun kaybı üzerine kurulu.",
      en: "The row that gives the page its name is the one that falls in cat form. The component is called ShunkoExperience, and the mechanic is built precisely on that loss.",
    },
  },
  {
    key: "hand",
    kanji: "手",
    label: { tr: "El", en: "Hand" },
    human: { tr: "Beş parmak, kavrama var", en: "Five fingers, a grip" },
    cat: null,
    voidReason: {
      tr: "Pençe var, kavrama yok: aynı satır iki gövdede aynı şeyi ölçmüyor.",
      en: "There is a paw but no grip: the same row does not measure the same thing in the two bodies.",
    },
    note: {
      tr: "On üçüncü satır ve düşenlerin sonuncusu. Tablonun sorunu eksik veri değil — soru yanlış gövdeye soruluyor.",
      en: "The thirteenth row and the last of the fallen. The table's problem is not missing data — the question is being asked of the wrong body.",
    },
  },
];

/** Şerit ve interaktif bölümün ortak arayüz metinleri. */
export const YOR_LEDGER_UI = {
  humanColumn: { tr: "İnsan formu", en: "Human form" },
  catColumn: { tr: "Kedi formu", en: "Cat form" },
  humanKanji: "人",
  catKanji: "猫",
  /** `—` işaretinin ekran okuyucudaki gerçek karşılığı */
  voidLabel: {
    tr: "Bu formda ölçülemiyor",
    en: "Cannot be measured in this form",
  },
  voidBadge: { tr: "ölçülemez", en: "unmeasurable" },
  sameBadge: { tr: "değişmiyor", en: "unchanged" },
  turnedBadge: { tr: "çevrildi", en: "turned over" },
  pickHint: {
    tr: "Bir satır seç — iki gövdenin okumaları yan yana gelsin.",
    en: "Pick a row to bring the two bodies' readings side by side.",
  },
  selectedLabel: { tr: "Seçili satır", en: "Selected row" },
  noteLabel: { tr: "Not", en: "Note" },
  reasonLabel: { tr: "Neden ölçülemiyor", en: "Why it cannot be measured" },
  tally: {
    tr: "On üç satırdan sekizi iki gövdede de okunuyor, beşi yalnızca insan formunda.",
    en: "Eight of thirteen rows read in both bodies; five only in the human form.",
  },
} as const;

/** Künye şeridinin altındaki not — tabloyu okuyan kişiye. */
export const YOR_MISSING_NOTE: LocalizedText = {
  tr: "Yaş ve kan grubu satırları AniList kaydında boş; bu sayfa oraya sayı yazmıyor. Griye düşen beş satır ise eksik değil: o ölçüler kedi gövdesinde bir şeye karşılık gelmiyor.",
  en: "The age and blood-type rows are empty in the AniList entry, and this page will not fill them in. The five greyed rows are not missing data: those measurements simply have nothing to correspond to in a cat's body.",
};

/** Güç kartının tipi — üç büyük ve dört küçük aynı şekli paylaşıyor. */
export interface YoruichiPower {
  key: string;
  /** Orijinal dildeki ad — kanji */
  name: string;
  reading: string;
  turkish: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
  imageKey: string;
}

/** ÜÇ BÜYÜK — Bleach terminolojisi (Naruto/JJK sözlüğü kullanılmadı). */
export const YOR_POWERS: readonly YoruichiPower[] = [
  {
    key: "shunko",
    name: "瞬閧",
    reading: "Shunkō",
    turkish: { tr: "Şimşek çığlığı", en: "Flash cry" },
    tagline: {
      tr: "Kidō'yu gövdenin üstünde tutmak.",
      en: "Holding Kidō on the body itself.",
    },
    text: {
      tr: "Sırtta ve omuzlarda yoğunlaştırılan Kidō, çıplak elin vuruşuyla aynı hareketin içinde birleşiyor. Yoruichi'nin hâli beyaz şimşek olarak görünüyor. Teknik açık sırt istiyor; bu sayfanın künye şeridinde 瞬閧 satırının kedi formunda düşmesinin sebebi de o.",
      en: "Kidō gathered across the back and shoulders, folded into the same motion as a bare-handed strike. Yoruichi's version reads as white lightning. The technique needs a bared back — which is exactly why the 瞬閧 row of this page's record falls in the cat form.",
    },
    traits: [
      { tr: "白打 ile 鬼道'nun aynı vuruşta birleşmesi", en: "白打 and 鬼道 in a single strike" },
      { tr: "Onmitsukidō'nun en üst kademesine ait", en: "Belongs to the Onmitsukidō's highest tier" },
      { tr: "Açık sırt gerektiriyor", en: "Requires a bared back" },
    ],
    imageKey: YOR_IMAGE_KEYS.powerShunko,
  },
  {
    key: "shunpo",
    name: "瞬歩",
    reading: "Shunpo",
    turkish: { tr: "Şimşek adımı", en: "Flash step" },
    tagline: {
      tr: "Mesafeyi bir adımda yok etmek.",
      en: "Erasing distance in a single step.",
    },
    text: {
      tr: "歩法'nın zirvesi. Soul Society'de bu adımın en hızlısı Yoruichi sayılıyor ve 瞬神 adı buradan geliyor. Bu sayfanın hareket dili de bundan türedi: hareket eden her öğe arkasında iki üç soluk kopya bırakıyor — başlangıç ve bitiş görünüyor, ara görünmüyor.",
      en: "The peak of 歩法. Yoruichi is held to be the fastest of this step in Soul Society, and the name 瞬神 comes from it. The page's whole motion language grows out of it: every moving element leaves two or three faint copies behind — the start and the finish are visible, the middle is not.",
    },
    traits: [
      { tr: "歩法'nın en üst basamağı", en: "The topmost rung of 歩法" },
      { tr: "Ölçüsü sayıyla değil rakiple veriliyor", en: "Measured against opponents, not in numbers" },
      { tr: "瞬神 adının kaynağı", en: "The source of the name 瞬神" },
    ],
    imageKey: YOR_IMAGE_KEYS.powerShunpo,
  },
  {
    key: "hakuda",
    name: "白打",
    reading: "Hakuda",
    turkish: { tr: "Çıplak el", en: "Bare hand" },
    tagline: {
      tr: "Onmitsukidō'nun asıl dili.",
      en: "The Onmitsukidō's true language.",
    },
    text: {
      tr: "Kelimenin karşılığı “beyaz vuruş”. Shinigami'nin dört temel sanatından biri ve gizli harekâtın kullandığı asıl sanat: kılıç ses çıkarır, el çıkarmaz. Yoruichi'nin künyesinde kılıç kaydı yok denecek kadar az; dövüştüğü her sahnenin ortak paydası bu satır.",
      en: "The word means “white hits”. One of the Shinigami's four fundamental arts, and the one covert operations actually use: a blade makes noise, a hand does not. Yoruichi's record carries almost nothing about a sword; this row is the common denominator of every fight she is in.",
    },
    traits: [
      { tr: "Dört temel sanattan biri", en: "One of the four fundamental arts" },
      { tr: "Kılıç yerine el", en: "The hand in place of the blade" },
      { tr: "Kedi formunda düşen satırlardan biri", en: "One of the rows that falls in cat form" },
    ],
    imageKey: YOR_IMAGE_KEYS.powerHakuda,
  },
];

/** DÖRT KÜÇÜK. */
export const YOR_KIT: readonly YoruichiPower[] = [
  {
    key: "onmitsukido",
    name: "隠密機動",
    reading: "Onmitsukidō",
    turkish: { tr: "Gizli harekât", en: "Stealth Force" },
    tagline: { tr: "Ordunun görünmeyen eli.", en: "The army's unseen hand." },
    text: {
      tr: "Gözetleme, suikast ve yasayı çiğneyen Shinigami'nin infazı. Beş birlik: 刑軍 · 警邏隊 · 檻理隊 · 飛諜隊 · 裏廷隊. Komuta nesiller boyu Shihōin hanesinde kaldı; Yoruichi 総司令官 iken aynı anda İkinci Bölük kaptanıydı.",
      en: "Surveillance, assassination, and the execution of Shinigami who break the law. Five corps: 刑軍 · 警邏隊 · 檻理隊 · 飛諜隊 · 裏廷隊. Command stayed with the House of Shihōin for generations; while Yoruichi was 総司令官 she was captain of the Second Division at the same time.",
    },
    traits: [{ tr: "Beş birlik", en: "Five corps" }],
    imageKey: YOR_IMAGE_KEYS.kitOnmitsu,
  },
  {
    key: "kido",
    name: "鬼道",
    reading: "Kidō",
    turkish: { tr: "Şeytan yolu", en: "Demon arts" },
    tagline: { tr: "İki dal, numaralı büyüler.", en: "Two branches, numbered spells." },
    text: {
      tr: "破道 yıkım yolu ve 縛道 bağlama yolu. Yoruichi'nin künyesinde Kidō tek başına değil, 瞬閧'nün içinde duruyor: büyü bir mermi gibi atılmıyor, gövdenin üstünde tutuluyor.",
      en: "破道, the way of destruction, and 縛道, the way of binding. In Yoruichi's record Kidō does not stand alone; it sits inside 瞬閧 — the spell is not thrown like a shot, it is held on the body.",
    },
    traits: [{ tr: "破道 · 縛道", en: "破道 · 縛道" }],
    imageKey: YOR_IMAGE_KEYS.kitKido,
  },
  {
    key: "utsusemi",
    name: "空蝉",
    reading: "Utsusemi",
    turkish: { tr: "Boş kabuk", en: "Cicada shell" },
    tagline: { tr: "Vuruş kabuğu buluyor.", en: "The blow finds the shell." },
    text: {
      tr: "瞬歩'nun art-görüntü tekniği: geride bırakılan siluet vuruşu üstlenirken asıl gövde çoktan başka yerde. Bu sayfanın bütün hareketi buradan alındı — kopyalar metnin ARKASINDA duruyor, üstüne düşmüyor.",
      en: "The afterimage technique of 瞬歩: the silhouette left behind takes the blow while the real body is already elsewhere. Every movement on this page is borrowed from it — the copies sit behind the text, never on top of it.",
    },
    traits: [{ tr: "Sayfanın hareket dili", en: "The page's motion language" }],
    imageKey: YOR_IMAGE_KEYS.kitUtsusemi,
  },
  {
    key: "zanjutsu",
    name: "斬術",
    reading: "Zanjutsu",
    turkish: { tr: "Kılıç sanatı", en: "Swordsmanship" },
    tagline: { tr: "Kayıttaki boşluk.", en: "The gap in the record." },
    text: {
      tr: "Dört temel sanatın ilki ve Akademi'de en çok çalışılanı — ama Yoruichi'nin künyesinde neredeyse hiç yok. Bu kart bilerek en zayıf kart: bir eksiği doldurmak yerine göstermek, bu sayfanın tuttuğu tavır.",
      en: "The first of the four fundamental arts and the one drilled hardest at the Academy — and almost entirely absent from Yoruichi's record. This card is deliberately the weakest one: showing a gap instead of filling it is the stance this page takes.",
    },
    traits: [{ tr: "Bilerek boş bırakıldı", en: "Deliberately left thin" }],
    imageKey: YOR_IMAGE_KEYS.kitZanjutsu,
  },
];

/**
 * KADER ÇİZELGESİ — beş durak, dönem etiketli.
 *
 * ⚠️ `record` bir REPLİK DEĞİL: doğrulanmış bir terim ya da adın kendisi
 * (dosya başındaki replik disiplinine bak). Her birinin `source` alanı
 * nereden geldiğini yazıyor ve sayfa bunu ziyaretçiye de gösteriyor.
 */
export interface YoruichiStop {
  key: string;
  stamp: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  record: {
    text: string;
    reading: LocalizedText;
    source: LocalizedText;
  };
  kin?: { name: string; characterId: number; role: LocalizedText };
  imageKey: string;
}

export const YOR_TIMELINE: readonly YoruichiStop[] = [
  {
    key: "house",
    stamp: { tr: "Hane dönemi", en: "The house years" },
    title: { tr: "Yirmi ikinci reis", en: "The twenty-second head" },
    text: {
      tr: "Dört Büyük Asil Hane'den birinin başına geçiyor. Geleneğe göre Onmitsukidō'nun başı bu haneden çıkar, yani makam doğumla geliyor. Asil doğmuş olmasına rağmen diğer asillerden farklı davranıyor: kendisine unvanla hitap edilmesini istemiyor.",
      en: "She takes the head of one of the Four Great Noble Families. By tradition the head of the Onmitsukidō comes from this house, so the office arrives with birth. Noble-born, she behaves unlike other nobles: she does not want to be addressed with honorifics.",
    },
    record: {
      text: "四楓院家",
      reading: {
        tr: "Shihōin-ke — Shihōin hanesi",
        en: "Shihōin-ke — the House of Shihōin",
      },
      source: {
        tr: "Arşivin Bleach defteri · asil haneler",
        en: "The archive's Bleach ledger · noble houses",
      },
    },
    imageKey: YOR_IMAGE_KEYS.fateHouse,
  },
  {
    key: "command",
    stamp: { tr: "Komuta dönemi", en: "The command years" },
    title: { tr: "İki makam, tek kişi", en: "Two offices, one person" },
    text: {
      tr: "İkinci Bölük kaptanlığı ile Onmitsukidō başkomutanlığını aynı anda tutuyor. O günden sonra gizli harekât hep bu kapıdan yürütülüyor: iki kurumun tek gövde sayılmasının sebebi bu kişi. Bu sayfanın künye şeridinde “makam” satırı iki gövdede de aynı kalıyor — makam gövdeye bağlı değil.",
      en: "She holds the captaincy of the Second Division and command of the Onmitsukidō at the same time. Ever since, covert operations have run through that one gate: this person is the reason two institutions count as one body. In the record band on this page the “office” row stays identical in both bodies — office is not attached to a body.",
    },
    record: {
      text: "隠密機動",
      reading: {
        tr: "Onmitsukidō — gizli harekât",
        en: "Onmitsukidō — the Stealth Force",
      },
      source: {
        tr: "Arşivin Bleach defteri · hiyerarşi",
        en: "The archive's Bleach ledger · hierarchy",
      },
    },
    kin: {
      name: "Suì-Fēng",
      characterId: 905,
      role: {
        tr: "ondan sonraki başkomutan; arşivde kendi dosyası yok",
        en: "the Commander-in-Chief who followed her; no file of her own in the archive",
      },
    },
    imageKey: YOR_IMAGE_KEYS.fateCommand,
  },
  {
    key: "exile",
    stamp: { tr: "Sürgün gecesi", en: "The night of exile" },
    title: { tr: "İkisini de çıkardı", en: "She got them both out" },
    text: {
      tr: "Merkez 46 aynı gece iki karar veriyor: Tessai Tsukabishi'ye hapis, Kisuke Urahara'ya sürgün. Yoruichi ikisini de kaçırıyor ve makamını, hanesini ve ordusunu arkasında bırakıyor. Bu satır künyedeki bütün “eski” ibarelerinin sebebi.",
      en: "Central 46 hands down two sentences the same night: imprisonment for Tessai Tsukabishi, exile for Kisuke Urahara. Yoruichi gets both of them out and leaves her office, her house and her army behind. This is the line that makes every “former” in the record a “former”.",
    },
    record: {
      text: "瞬歩",
      reading: {
        tr: "Shunpo — bir adımda yok olan mesafe",
        en: "Shunpo — distance erased in one step",
      },
      source: {
        tr: "Arşivin Bleach defteri · dört temel sanat",
        en: "The archive's Bleach ledger · the four fundamental arts",
      },
    },
    kin: {
      name: "Kisuke Urahara",
      characterId: 210,
      role: { tr: "ortağı", en: "her partner" },
    },
    imageKey: YOR_IMAGE_KEYS.fateExile,
  },
  {
    key: "karakura",
    stamp: { tr: "Karakura dönemi", en: "The Karakura years" },
    title: { tr: "Kedi olarak yaşamak", en: "Living as the cat" },
    text: {
      tr: "İnsan dünyasında uzun süre kedi formunda kalıyor. Chad ile Orihime'yi Soul Society'ye girmeden önce o çalıştırıyor, Ichigo'nun son serbest bırakma talimini de Urahara'nın yöntemleriyle o denetliyor. İnsan formuna dönüşünü çoğu zaman karşısındakinin tepkisini görmek için seçiyor.",
      en: "In the world of the living she spends long stretches as the cat. She is the one who drills Chad and Orihime before they enter Soul Society, and she supervises Ichigo's final release training using Urahara's methods. She usually times the return to her human form to watch the reaction it gets.",
    },
    record: {
      text: "白打",
      reading: {
        tr: "Hakuda — çıplak el, “beyaz vuruş”",
        en: "Hakuda — the bare hand, “white hits”",
      },
      source: {
        tr: "Arşivin Bleach defteri · dört temel sanat",
        en: "The archive's Bleach ledger · the four fundamental arts",
      },
    },
    kin: {
      name: "Ichigo Kurosaki",
      characterId: 5,
      role: { tr: "çalıştırdığı çocuk", en: "the boy she drilled" },
    },
    imageKey: YOR_IMAGE_KEYS.fateKarakura,
  },
  {
    key: "war",
    stamp: { tr: "Bin Yıllık Kan Savaşı", en: "The Thousand-Year Blood War" },
    title: { tr: "Kavgadan kaçmayan kaçamak", en: "The evasion that does not evade" },
    text: {
      tr: "Yoruichi dövüşten kaçınmayı, iş bittikten sonra yardım etmeyi tercih ediyor; ama kendi tarafının kazanamayacağını düşündüğü anda araya giriyor. Savaşın son bölümlerinde 瞬閧 cephede açık açık kullanılıyor.",
      en: "Yoruichi prefers to avoid a fight and step in after it is over — but she moves the moment she thinks her side cannot win. In the war's later chapters 瞬閧 is used openly at the front.",
    },
    record: {
      text: "瞬閧",
      reading: {
        tr: "Shunkō — sırtta tutulan Kidō",
        en: "Shunkō — Kidō held across the back",
      },
      source: {
        tr: "Bu sayfanın kendi kaydı; bileşen adı buradan geliyor",
        en: "This page's own entry; the component takes its name from it",
      },
    },
    kin: {
      name: "Sōsuke Aizen",
      characterId: 1086,
      role: {
        tr: "sürgünün arkasındaki el",
        en: "the hand behind the exile",
      },
    },
    imageKey: YOR_IMAGE_KEYS.fateWar,
  },
];

/** Bağlar — `EXPERIENCE_COMPANIONS[908]` ile birebir aynı beş numara. */
export interface YoruichiBond {
  characterId: number;
  name: string;
  native: string;
  role: LocalizedText;
  line: LocalizedText;
}

export const YOR_BONDS: readonly YoruichiBond[] = [
  {
    characterId: 210,
    name: "Kisuke Urahara",
    native: "浦原喜助",
    role: { tr: "ortağı", en: "her partner" },
    line: {
      tr: "Künyede “partner” diye geçen tek ad. Sürgün gecesinde onu ve Tessai'yi çıkaran el Yoruichi'nin eli.",
      en: "The one name the record files under “partner”. On the night of the exile, the hand that got him and Tessai out was hers.",
    },
  },
  {
    characterId: 5,
    name: "Ichigo Kurosaki",
    native: "黒崎一護",
    role: { tr: "çalıştırdığı çocuk", en: "the boy she drilled" },
    line: {
      tr: "Son serbest bırakma talimini Urahara'nın yöntemleriyle o denetledi. İnsan formuna dönüşünü de birkaç kez tepkisini görmek için onun önünde seçti.",
      en: "She supervised his final release training with Urahara's methods — and more than once timed her return to human form in front of him just to see the reaction.",
    },
  },
  {
    characterId: 905,
    name: "Suì-Fēng",
    native: "砕蜂",
    role: { tr: "halefi", en: "her successor" },
    line: {
      tr: "İkinci Bölük ve Onmitsukidō ondan sonra bu ada geçti. Yoruichi ona kendisine unvansız hitap etmesini söylemişti.",
      en: "The Second Division and the Onmitsukidō passed to this name after her. Yoruichi told her to drop the honorifics.",
    },
  },
  {
    characterId: 1086,
    name: "Sōsuke Aizen",
    native: "藍染惣右介",
    role: { tr: "sürgünün arkasındaki el", en: "the hand behind the exile" },
    line: {
      tr: "Merkez 46'nın o geceki iki kararının arkasındaki düzen. Yoruichi'nin künyesindeki bütün “eski” ibareleri o düzenin sonucu.",
      en: "The design behind Central 46's two sentences that night. Every “former” in Yoruichi's record is a consequence of it.",
    },
  },
  {
    characterId: 6,
    name: "Rukia Kuchiki",
    native: "朽木ルキア",
    role: { tr: "infazdan aldığı kişi", en: "the one she took off the stand" },
    line: {
      tr: "Sōkyoku tepesinde infaz durdurulduğunda onu alıp götüren el yine Yoruichi'nin eliydi.",
      en: "When the execution on Sōkyoku Hill was stopped, it was Yoruichi's hand again that carried her away.",
    },
  },
];

export const YOR_BOND_UI = {
  hasPage: { tr: "arşivde dosyası var", en: "has a file in the archive" },
  noPage: { tr: "dosyası yok — adla anılıyor", en: "no file — cited by name" },
  portraitAlt: {
    tr: "arşivdeki portresi",
    en: "portrait from the archive",
  },
} as const;

/**
 * Evren bağlantıları — `/anime/bleach` altındaki GERÇEK çapalar.
 *
 * Çapa adları `lib/anime/bleach/anchors.ts` defterinden alındı; ölü çapa
 * yasak (o dosyanın başlığındaki kural). Adresi burada elle yazmıyoruz:
 * bileşen `animeHref.bleach()` ile birleştiriyor.
 */
export const YOR_WORLD_LINKS: readonly {
  anchor: string;
  label: LocalizedText;
  note: LocalizedText;
}[] = [
  {
    anchor: "gotei",
    label: { tr: "Gotei 13 · İkinci Bölük", en: "Gotei 13 · Second Division" },
    note: {
      tr: "Onmitsukidō ile tek gövde sayılan kapı",
      en: "The gate counted as one body with the Onmitsukidō",
    },
  },
  {
    anchor: "houses",
    label: { tr: "Asil haneler · 四楓院家", en: "Noble houses · 四楓院家" },
    note: {
      tr: "Hanenin kaydı ve akçaağaç arması",
      en: "The house's entry and its maple crest",
    },
  },
  {
    anchor: "powers",
    label: { tr: "Dört temel sanat", en: "The four fundamental arts" },
    note: {
      tr: "斬術 · 白打 · 歩法 · 鬼道",
      en: "斬術 · 白打 · 歩法 · 鬼道",
    },
  },
  {
    anchor: "legends",
    label: { tr: "Efsaneler", en: "Legends" },
    note: {
      tr: "Soul Society'nin adı geçen isimleri",
      en: "The names Soul Society keeps repeating",
    },
  },
];

/**
 * KAPANIŞ.
 *
 * ⚠️ İki satır da DİYALOG DEĞİL: birincisi Soul Society'nin ona taktığı ad,
 * ikincisi kendi adı. İkisi de doğrulanabilir kayıt — `note` alanı bunu
 * ziyaretçiye de söylüyor. Gerekçe dosya başındaki replik disiplininde.
 */
export const YOR_CLOSING = {
  lines: [
    {
      text: "瞬神",
      reading: { tr: "shunshin", en: "shunshin" },
      note: {
        tr: "Dünyanın ona taktığı ad — “şimşek tanrıçası”. Bir cümle değil bir sıfat; künyesinde “Goddess of Flash” diye kayıtlı.",
        en: "The name the world gave her — “Goddess of Flash”. Not a sentence but an epithet; it is on file in her own entry.",
      },
      by: {
        tr: "AniList künyesi · diğer adlar",
        en: "AniList entry · alternative names",
      },
    },
    {
      text: "四楓院夜一",
      reading: { tr: "Shihōin Yoruichi", en: "Shihōin Yoruichi" },
      note: {
        tr: "Kendi adı. Bu sayfadaki on üç satır içinde iki gövdede de aynı kalan, ölçü istemeyen tek kayıt.",
        en: "Her own name. Of the thirteen rows on this page it is the one entry that stays identical in both bodies and asks for no measurement.",
      },
      by: { tr: "AniList künyesi · ana dildeki ad", en: "AniList entry · native name" },
    },
  ],
  quoteDiscipline: {
    tr: "Bu sayfada tırnak içinde tek bir diyalog yok. Yoruichi'nin doğrulanabilir bir Japonca replik kaydı bu turda elde edilemedi ve uydurulmuş bir cümleyi tırnağa almak bir kanon hatası olurdu. Tırnağa alınan her şey bir terim ya da bir ad — ve her birinin altında kaynağı yazılı.",
    en: "There is not one line of dialogue in quotation marks on this page. No verifiable Japanese line of Yoruichi's could be sourced this round, and putting an invented sentence in quotes would be a canon error. Everything quoted here is a term or a name — and each one carries its source underneath.",
  },
  motto: "空蝉",
  mottoReading: { tr: "utsusemi", en: "utsusemi" },
  mottoNote: {
    tr: "Boşalmış kabuk. Vuruş kabuğu buluyor, gövde çoktan başka yerde — ve ölçülebilen hep geride kalan yarı oluyor.",
    en: "The empty shell. The blow finds the shell while the body is already elsewhere — and the half that can be measured is always the one left behind.",
  },
  credit: {
    tr: "Künye ve portre AniList'ten (karakter 908, 31 Ağustos 2026 çekimi; kopyası depoda). Bleach terminolojisi arşivin kendi defterinden.",
    en: "Record and portrait from AniList (character 908, captured 31 August 2026; a copy lives in the repository). Bleach terminology from the archive's own ledger.",
  },
  creditLink: { tr: "AniList · Yoruichi Shihōin", en: "AniList · Yoruichi Shihōin" },
  creditNote: {
    tr: "Sahne, teknik ve dönem görselleri üretilmedi: on yedi kadraj boş küratör yuvası olarak duruyor ve sayfa görselsiz de ayakta. Sayfadaki tek grafik motif elle çizilmiş SVG.",
    en: "No scene, technique or era images were generated: seventeen frames stand as empty curator slots and the page works without them. The only graphic motif here is hand-drawn SVG.",
  },
} as const;

/** `CuratorGaps` başlıkları — yalnızca küratör görüyor. */
export const YOR_GAPS = {
  title: { tr: "Yoruichi · boş kadrajlar", en: "Yoruichi · empty frames" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "On yedi kadrajın hepsi dolu.",
    en: "All seventeen frames are filled.",
  },
} as const;
