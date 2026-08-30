import type { LocalizedText } from "./types";

/**
 * Mikasa Ackerman — "Atkı" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Sahne görselleri veritabanında — characterId 40881 kaydının ABILITY
 * yuvaları, `mks:*` anahtarlarıyla.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * Kırmızı atkı sayfanın tek renk aksanı VE tek sürekli çizgisi. Sol kenarda
 * yukarıdan aşağı inen o çizgiye bütün bölümler asılı. Sayfanın kalbindeki
 * tek kontrol (kanca açısı: 0° / 22° / 45°) çizgiyi koparmıyor, ondan çıkan
 * bağlantıların AÇISINI değiştiriyor — ve o açı sayfadaki bütün kartların
 * dizilim eğimini birlikte döndürüyor.
 *
 * ⚠️ Kushina'nın "kopan zincir halkaları" mekaniğiyle karıştırılmasın:
 * buradaki çizgi hiç kopmuyor. Tek değişken bir AÇI.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (10 Şubat), boy aralığı (170 cm → 176 cm), yaş işareti ("15-"),
 * birlik satırı (104. Eğitim Birliği · Keşif Birliği) ve akrabalık listesi
 * AniList künyesinden birebir alındı (karakter 40881, depodaki
 * `public/assets/anime/karakterler/mikasa-ackerman/kaynak.json`).
 *
 * ⚠️ KAN GRUBU YOK. AniList kaydında `bloodType` boş. Künye şeridinde
 * uydurulmadı; satır "kayıtlı değil" diyerek duruyor.
 *
 * ⚠️ DOĞUM YILI YOK. `dateOfBirth.year` boş; yalnızca gün ve ay var. Yaştan
 * yıl TÜRETİLMEDİ. Kader çizelgesi yaş etiketiyle ilerliyor; yalnızca iki
 * takvim yılı yazıldı (845 ve 850) çünkü ikisi de serinin kendi anlatısında
 * açıkça geçen tarihler.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Sayfada beş replik tırnak içinde ve hepsinin kaynağı yazılı:
 *   「戦え！ 戦わなければ勝てない！」   Eren — kulübe (Mikasa 9 yaşında)
 *   「この世界は残酷だ。そして、とても美しい」 Mikasa — Trost
 *   「行ってらっしゃい、エレン」        Mikasa — veda
 *   「温かいだろ？」                    Eren — atkıyı doladığı an
 *   「マフラーを巻いてくれて、ありがとう」 Mikasa — Eren'e döndüğünde
 * Emin olunmayan hiçbir cümle tırnağa alınmadı.
 *
 * ── TERMİNOLOJİ ──────────────────────────────────────────────────────────
 * 立体機動装置 (rittai kidō sōchi — üç boyutlu manevra donanımı),
 * 超硬質ブレード (chōkōshitsu burēdo — ultra sert bıçaklar),
 * うなじ (unaji — ense), 対人立体機動装置 (taijin rittai kidō sōchi —
 * insana karşı manevra donanımı), 雷槍 (raisō — yıldırım mızrakları),
 * 調査兵団 (chōsa heidan — Keşif Birliği), 第104期訓練兵団 (104. Eğitim
 * Birliği), 憲兵団 (kenpeidan — İç Kuvvetler), アッカーマン一族 (Ackerman
 * soyu). Türkçe karşılıklar arşivin kendi sözlüğünden.
 *
 * ⚠️ Bölüm 5'teki üç açı BİR TEKNİK ADI DEĞİL. Uydurma teknik adı yazmamak
 * için üçü de "okuma" olarak sunuluyor ve her birinin altında gerçek bir
 * sahne duruyor (Trost / 57. Keşif Harekâtı / Stohess).
 */

export const MIKASA_ID = 40881;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const MIKASA_SITE_URL = "https://anilist.co/character/40881";

/**
 * Depodaki resmî portre.
 *
 * `kaynak.json` `png` diyor ve ölçüyü de veriyor: 230×345. Bu kare tam
 * kanama bir hero için KÜÇÜK — sayfada yalnızca künye madalyonunda, orta
 * boy bir kadrajda kullanılıyor. Büyük hero karesi küratör yuvası olarak
 * boş bırakıldı (`mks:hero`).
 */
export const MIKASA_PORTRAIT = {
  src: "/assets/anime/karakterler/mikasa-ackerman/anilist-portrait.png",
  w: 230,
  h: 345,
} as const;

/**
 * Sergi görselleri — hepsi characterId 40881 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `mks:` önekli (kurator modu şartı).
 */
export const MIKASA_IMAGE_KEYS = {
  hero: "mks:hero",
  gearOdm: "mks:odm",
  gearAckerman: "mks:ackerman",
  gearBlade: "mks:blade",
  noteNape: "mks:unaji",
  noteAntiPersonnel: "mks:taijin",
  noteThunder: "mks:raiso",
  noteHeadache: "mks:zutsu",
  angleDrop: "mks:angle-00",
  angleTrack: "mks:angle-22",
  angleCut: "mks:angle-45",
  knotCabin: "mks:knot-cabin",
  knotWall: "mks:knot-wall",
  knotFirst: "mks:knot-first",
  knotTrost: "mks:knot-trost",
  knotFarewell: "mks:knot-farewell",
  scarf: "mks:scarf",
  closing: "mks:closing",
} as const;

/** Kurator yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const MIKASA_SLOT_LABELS: Record<string, LocalizedText> = {
  [MIKASA_IMAGE_KEYS.hero]: {
    tr: "Hero — geniş bant, soğuk gri sahne; kırmızı atkı tek renk (16:9)",
    en: "Hero — wide band, cold grey scene; the red scarf the only colour (16:9)",
  },
  [MIKASA_IMAGE_KEYS.gearOdm]: {
    tr: "Manevra donanımı — havada, iki kanca gergin (yatay)",
    en: "ODM gear — mid-air, both hooks taut (landscape)",
  },
  [MIKASA_IMAGE_KEYS.gearAckerman]: {
    tr: "Uyanış — kulübedeki an, bakışın değiştiği kare (yatay)",
    en: "The awakening — the cabin, the frame where the gaze changes (landscape)",
  },
  [MIKASA_IMAGE_KEYS.gearBlade]: {
    tr: "Ultra sert bıçak — kabza ve ağız, yakın çekim (yatay)",
    en: "Ultrahard blade — grip and edge, close crop (landscape)",
  },
  [MIKASA_IMAGE_KEYS.noteNape]: {
    tr: "Ense — kesim anı, buhar (kare)",
    en: "The nape — the cut, steam rising (square)",
  },
  [MIKASA_IMAGE_KEYS.noteAntiPersonnel]: {
    tr: "İnsana karşı donanım — dar alan, kısa kanca (kare)",
    en: "Anti-personnel gear — tight quarters, short hook (square)",
  },
  [MIKASA_IMAGE_KEYS.noteThunder]: {
    tr: "Yıldırım mızrağı — saplanma ya da patlama (kare)",
    en: "Thunder spear — the strike or the blast (square)",
  },
  [MIKASA_IMAGE_KEYS.noteHeadache]: {
    tr: "Baş ağrısı — elin şakağa gittiği kare (kare)",
    en: "The headache — a hand going to the temple (square)",
  },
  [MIKASA_IMAGE_KEYS.angleDrop]: {
    tr: "0° — Trost, gazsız düşüş; tel yok (yatay)",
    en: "0° — Trost, the gasless fall; no wire (landscape)",
  },
  [MIKASA_IMAGE_KEYS.angleTrack]: {
    tr: "22° — orman, Dişi Titan'ın peşinde sabit mesafe (yatay)",
    en: "22° — the forest, holding distance behind the Female Titan (landscape)",
  },
  [MIKASA_IMAGE_KEYS.angleCut]: {
    tr: "45° — Stohess, duvara tırmanan ele yapılan kesim (yatay)",
    en: "45° — Stohess, the cut across the hand on the wall (landscape)",
  },
  [MIKASA_IMAGE_KEYS.knotCabin]: {
    tr: "Kulübe — kar, ahşap duvar, açılan kapı (yatay)",
    en: "The cabin — snow, a timber wall, the door opening (landscape)",
  },
  [MIKASA_IMAGE_KEYS.knotWall]: {
    tr: "845 — Shiganshina'nın delinen kapısı (yatay)",
    en: "845 — the breached gate of Shiganshina (landscape)",
  },
  [MIKASA_IMAGE_KEYS.knotFirst]: {
    tr: "Mezuniyet — 104. dönem sırası, üniformalar (yatay)",
    en: "Graduation — the 104th in line, uniforms (landscape)",
  },
  [MIKASA_IMAGE_KEYS.knotTrost]: {
    tr: "850 — Trost'un çatıları, düşen figür (yatay)",
    en: "850 — the rooftops of Trost, a falling figure (landscape)",
  },
  [MIKASA_IMAGE_KEYS.knotFarewell]: {
    tr: "Veda — ağaç, mezar, atkı (yatay)",
    en: "The farewell — a tree, a grave, the scarf (landscape)",
  },
  [MIKASA_IMAGE_KEYS.scarf]: {
    tr: "Atkı — yalnızca kumaş; doku ve düğüm, yakın çekim (kare)",
    en: "The scarf — cloth only; weave and knot, close crop (square)",
  },
  [MIKASA_IMAGE_KEYS.closing]: {
    tr: "Kapanış — geniş bant, boş manzara, düşük kontrast (16:9)",
    en: "Closing — a wide band, an empty landscape, low contrast (16:9)",
  },
};

/** Önerilen piksel ölçüleri — `CuratorSlot` bunu `size` olarak yazıyor. */
export const MIKASA_SLOT_SIZES: Record<string, { w: number; h: number }> = {
  [MIKASA_IMAGE_KEYS.hero]: { w: 1920, h: 1080 },
  [MIKASA_IMAGE_KEYS.gearOdm]: { w: 1200, h: 800 },
  [MIKASA_IMAGE_KEYS.gearAckerman]: { w: 1200, h: 800 },
  [MIKASA_IMAGE_KEYS.gearBlade]: { w: 1200, h: 800 },
  [MIKASA_IMAGE_KEYS.noteNape]: { w: 800, h: 800 },
  [MIKASA_IMAGE_KEYS.noteAntiPersonnel]: { w: 800, h: 800 },
  [MIKASA_IMAGE_KEYS.noteThunder]: { w: 800, h: 800 },
  [MIKASA_IMAGE_KEYS.noteHeadache]: { w: 800, h: 800 },
  [MIKASA_IMAGE_KEYS.angleDrop]: { w: 1400, h: 900 },
  [MIKASA_IMAGE_KEYS.angleTrack]: { w: 1400, h: 900 },
  [MIKASA_IMAGE_KEYS.angleCut]: { w: 1400, h: 900 },
  [MIKASA_IMAGE_KEYS.knotCabin]: { w: 1400, h: 800 },
  [MIKASA_IMAGE_KEYS.knotWall]: { w: 1400, h: 800 },
  [MIKASA_IMAGE_KEYS.knotFirst]: { w: 1400, h: 800 },
  [MIKASA_IMAGE_KEYS.knotTrost]: { w: 1400, h: 800 },
  [MIKASA_IMAGE_KEYS.knotFarewell]: { w: 1400, h: 800 },
  [MIKASA_IMAGE_KEYS.scarf]: { w: 900, h: 900 },
  [MIKASA_IMAGE_KEYS.closing]: { w: 1920, h: 1080 },
};

/** `CuratorGaps` satırındaki "beklenen kare" metni. */
export const MIKASA_SLOT_SPECS: Record<string, LocalizedText> = {
  [MIKASA_IMAGE_KEYS.hero]: {
    tr: "geniş bant · 1920×1080 · webp",
    en: "wide band · 1920×1080 · webp",
  },
  [MIKASA_IMAGE_KEYS.gearOdm]: {
    tr: "yatay kart · 1200×800 · webp",
    en: "landscape card · 1200×800 · webp",
  },
  [MIKASA_IMAGE_KEYS.gearAckerman]: {
    tr: "yatay kart · 1200×800 · webp",
    en: "landscape card · 1200×800 · webp",
  },
  [MIKASA_IMAGE_KEYS.gearBlade]: {
    tr: "yatay kart · 1200×800 · webp",
    en: "landscape card · 1200×800 · webp",
  },
  [MIKASA_IMAGE_KEYS.noteNape]: {
    tr: "kare rozet · 800×800 · webp",
    en: "square badge · 800×800 · webp",
  },
  [MIKASA_IMAGE_KEYS.noteAntiPersonnel]: {
    tr: "kare rozet · 800×800 · webp",
    en: "square badge · 800×800 · webp",
  },
  [MIKASA_IMAGE_KEYS.noteThunder]: {
    tr: "kare rozet · 800×800 · webp",
    en: "square badge · 800×800 · webp",
  },
  [MIKASA_IMAGE_KEYS.noteHeadache]: {
    tr: "kare rozet · 800×800 · webp",
    en: "square badge · 800×800 · webp",
  },
  [MIKASA_IMAGE_KEYS.angleDrop]: {
    tr: "sahne · 1400×900 · webp",
    en: "scene · 1400×900 · webp",
  },
  [MIKASA_IMAGE_KEYS.angleTrack]: {
    tr: "sahne · 1400×900 · webp",
    en: "scene · 1400×900 · webp",
  },
  [MIKASA_IMAGE_KEYS.angleCut]: {
    tr: "sahne · 1400×900 · webp",
    en: "scene · 1400×900 · webp",
  },
  [MIKASA_IMAGE_KEYS.knotCabin]: {
    tr: "çizelge karesi · 1400×800 · webp",
    en: "timeline frame · 1400×800 · webp",
  },
  [MIKASA_IMAGE_KEYS.knotWall]: {
    tr: "çizelge karesi · 1400×800 · webp",
    en: "timeline frame · 1400×800 · webp",
  },
  [MIKASA_IMAGE_KEYS.knotFirst]: {
    tr: "çizelge karesi · 1400×800 · webp",
    en: "timeline frame · 1400×800 · webp",
  },
  [MIKASA_IMAGE_KEYS.knotTrost]: {
    tr: "çizelge karesi · 1400×800 · webp",
    en: "timeline frame · 1400×800 · webp",
  },
  [MIKASA_IMAGE_KEYS.knotFarewell]: {
    tr: "çizelge karesi · 1400×800 · webp",
    en: "timeline frame · 1400×800 · webp",
  },
  [MIKASA_IMAGE_KEYS.scarf]: {
    tr: "kare detay · 900×900 · webp",
    en: "square detail · 900×900 · webp",
  },
  [MIKASA_IMAGE_KEYS.closing]: {
    tr: "geniş bant · 1920×1080 · webp",
    en: "wide band · 1920×1080 · webp",
  },
};

/* ── Üst şerit ──────────────────────────────────────────────────────────── */

export const MIKASA_CRUMB = {
  series: { tr: "Attack on Titan", en: "Attack on Titan" },
} as const;

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const MIKASA_IDENTITY = {
  name: "Mikasa Ackerman",
  nativeName: "ミカサ・アッカーマン",
  /** Hero filigranı — dekoratif (aria-hidden): 家族 = aile */
  watermark: "家族",
  house: {
    tr: "104. Eğitim Birliği birincisi · Keşif Birliği · Ackerman soyu",
    en: "First of the 104th Training Corps · Survey Corps · Ackerman line",
  },
  epigraph: {
    tr: "Hayatı boyunca tek bir çizgiyi izledi. Çizgi hiç kopmadı — yalnızca açısı değişti.",
    en: "She followed one line her whole life. The line never broke — only its angle changed.",
  },
  facts: [
    {
      label: { tr: "Doğum günü", en: "Birthday" },
      value: { tr: "10 Şubat", en: "10 February" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: {
        tr: "170 cm → 176 cm (künyede aralık olarak veriliyor)",
        en: "170 cm → 176 cm (recorded as a range)",
      },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: {
        tr: "AniList künyesinde kayıtlı değil",
        en: "Not recorded on the AniList profile",
      },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: {
        tr: "Künyede “15-”; anlatı on beşinden on dokuzuna kadar sürüyor",
        en: "Profile says “15-”; the story runs from fifteen to nineteen",
      },
    },
    {
      label: { tr: "Soy", en: "Line" },
      value: { tr: "Ackerman — アッカーマン一族", en: "Ackerman — アッカーマン一族" },
    },
    {
      label: { tr: "Birlik", en: "Corps" },
      value: {
        tr: "104. Eğitim Birliği → Keşif Birliği (調査兵団)",
        en: "104th Training Corps → Survey Corps (調査兵団)",
      },
    },
    {
      label: { tr: "Derece", en: "Standing" },
      value: {
        tr: "Dönem birincisi; ilk on İç Kuvvetler hakkı kazanıyordu, kullanmadı",
        en: "Top of her class; the top ten earned the Military Police, she declined",
      },
    },
    {
      label: { tr: "Müfreze", en: "Squad" },
      value: { tr: "Levi Müfrezesi (特別作戦班)", en: "Levi Squad (特別作戦班)" },
    },
    {
      label: { tr: "Aile", en: "Family" },
      value: {
        tr: "Öz anne ve babası (öldürüldü) · Grisha ve Carla Yeager (evlat edinen) · Eren Yeager (üvey kardeş)",
        en: "Birth mother and father (killed) · Grisha and Carla Yeager (adoptive) · Eren Yeager (foster brother)",
      },
    },
    {
      label: { tr: "Sembolik obje", en: "Token" },
      value: {
        tr: "Kırmızı atkı (マフラー) — dokuz yaşında Eren'in boynuna doladığı",
        en: "The red scarf (マフラー) — wrapped around her by Eren when she was nine",
      },
    },
  ],
} as const;

/** Künye şeridinin altındaki dürüstlük notu. */
export const MIKASA_MISSING_NOTE: LocalizedText = {
  tr: "AniList kaydında doğum yılı ve kan grubu boş. Yaştan yıl türetilmedi; aşağıdaki çizelge yaş etiketiyle ilerliyor ve yalnızca serinin kendi anlatısında geçen iki takvim yılını (845, 850) yazıyor.",
  en: "The AniList record leaves birth year and blood type empty. No year was inferred from her age; the timeline below runs on ages and names only the two calendar years the series states itself (845, 850).",
};

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const MIKASA_HERO = {
  lede: {
    tr: "Duvarların en yetenekli askeri, bir yetenek olarak değil bir bağ olarak anlatılır. Bu sayfa o bağı geometri gibi ele alıyor: solda aşağı inen tek bir kırmızı çizgi ve o çizgiden çıkan her kancanın açısı.",
    en: "The most gifted soldier inside the walls is never told as a talent; she is told as a bond. This page treats that bond as geometry: one red line running down the left edge, and the angle of every hook that leaves it.",
  },
  railLabel: {
    tr: "Atkı — sayfanın sol kenarında sonuna kadar inen tek çizgi",
    en: "The scarf — one line running down the left edge of the page",
  },
  portraitAlt: {
    tr: "Mikasa Ackerman — AniList resmî portresi",
    en: "Mikasa Ackerman — official AniList portrait",
  },
  portraitAltUploaded: {
    tr: "Mikasa Ackerman — arşive yüklenmiş portre",
    en: "Mikasa Ackerman — portrait uploaded to the archive",
  },
  heroFrameNote: {
    tr: "Geniş hero karesi boş. Resmî portre 230×345 piksel — bu ölçü tam kanama bir kadraja yetmiyor, o yüzden portre madalyonda duruyor ve bant küratör yuvası olarak bekliyor.",
    en: "The wide hero frame is empty. The official portrait is 230×345 px — too small to bleed across a full band, so it sits in the medallion and the band waits as a curator slot.",
  },
  bandAlt: {
    tr: "Mikasa Ackerman — arşive yüklenmiş geniş sahne karesi",
    en: "Mikasa Ackerman — wide scene frame uploaded to the archive",
  },
} as const;

/**
 * Sahne kadrajlarının `alt` metni.
 *
 * ⚠️ Yuva ETİKETİ alt metin DEĞİL: etiket küratöre "ne yüklemeli" diyor
 * ("… (yatay)", "… webp"), ziyaretçiye hiçbir şey anlatmıyor. Görselin alt
 * metni bölümün kendi başlığından türetiliyor ve sonuna karakterin adı
 * ekleniyor.
 */
export function mikasaSceneAlt(label: string, characterName: string): string {
  return `${label} — ${characterName}`;
}

/* ── Mod düğmesi ────────────────────────────────────────────────────────── */

export const MIKASA_AWAKE = {
  title: { tr: "Ackerman uyanışı", en: "The Ackerman waking" },
  enter: { tr: "Uyanışı aç", en: "Wake it" },
  exit: { tr: "Uyanışı kapat", en: "Let it rest" },
  stateLabel: { tr: "Durum", en: "State" },
  stateOn: { tr: "UYANIK", en: "AWAKE" },
  stateOff: { tr: "SAKİN", en: "AT REST" },
  lede: {
    tr: "Ackerman uyanışı yeni bir güç getirmiyor; var olan her şeyi sertleştiriyor. Düğme sayfada tam olarak bunu yapıyor.",
    en: "The Ackerman waking brings no new power; it hardens what is already there. The switch does exactly that to this page.",
  },
  hintOn: {
    tr: "Gri çekildi, atkı kalınlaştı, bütün kenarlar keskinleşti. Hiçbir bilgi eklenmedi — yalnızca sayfa gerildi.",
    en: "The grey has been pulled, the scarf has thickened, every edge has sharpened. Nothing was added — the page simply went taut.",
  },
  hintOff: {
    tr: "Sayfa gevşek: kenarlar yumuşak, atkı ince, renk doygun.",
    en: "The page is slack: soft edges, a thin scarf, saturated colour.",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const MIKASA_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "The record" },
    lede: {
      tr: "AniList künyesinden gelen satırlar ve arşivin kendi eklediği bağlam. Eksik olan alanlar eksik yazıldı.",
      en: "Rows from the AniList profile plus context the archive adds. Missing fields are written as missing.",
    },
  },
  bonds: {
    title: { tr: "Üç bağ", en: "Three bonds" },
    lede: {
      tr: "Arşivde kendi sayfası olan üç isim. Kartlar o sayfalara açılıyor.",
      en: "Three names with their own page in this archive. The cards open onto them.",
    },
  },
  gear: {
    title: { tr: "Donanım", en: "The gear" },
    lede: {
      tr: "Üç ana parça ve dört ayrıntı. Hepsi serinin kendi terminolojisiyle; uydurulmuş tek bir ad yok.",
      en: "Three main pieces and four details. All in the series' own terminology; not one invented name.",
    },
  },
  angle: {
    title: { tr: "Kanca açısı", en: "The hook angle" },
    lede: {
      tr: "Aşağıdaki üç açı bir teknik adı değil, bir okuma. Aynı donanım, aynı çizgi; değişen tek şey kancanın çıkış açısı. Seçtiğin açı sayfadaki bütün kartların dizilim eğimini de döndürüyor — çizgi kopmuyor, eğiliyor.",
      en: "The three angles below are not the name of a technique; they are a reading. Same gear, same line — only the angle the hook leaves at. The one you pick also rotates the slope of every card on this page: the line does not break, it bends.",
    },
  },
  knots: {
    title: { tr: "Beş düğüm", en: "Five knots" },
    lede: {
      tr: "Bir atkının üstüne atılabilecek beş düğüm. Yaş etiketli; iki tanesinde takvim yılı da var.",
      en: "Five knots you could tie into one scarf. Labelled by age; two of them carry a calendar year as well.",
    },
  },
  closing: {
    title: { tr: "Atkı", en: "The scarf" },
    lede: {
      tr: "Sol kenardaki çizgi burada bitiyor. Bir düğümle değil, bir bağla.",
      en: "The line on the left edge ends here. Not with a knot — with a bond.",
    },
  },
} as const;

/* ── Bağlar ─────────────────────────────────────────────────────────────── */

export interface MikasaBond {
  key: string;
  characterId: number;
  name: string;
  native: string;
  role: LocalizedText;
  note: LocalizedText;
}

export const MIKASA_BONDS: MikasaBond[] = [
  {
    key: "eren",
    characterId: 40882,
    name: "Eren Yeager",
    native: "エレン・イェーガー",
    role: { tr: "Üvey kardeş", en: "Foster brother" },
    note: {
      tr: "Atkıyı veren kişi ve Mikasa'nın bütün kararlarının ortak paydası. Onunla aynı evde büyüdüler; onun için Keşif Birliği'ne yazıldı.",
      en: "The one who gave her the scarf, and the common denominator of every decision she makes. They grew up in the same house; she joined the Survey Corps because he did.",
    },
  },
  {
    key: "armin",
    characterId: 46494,
    name: "Armin Arlert",
    native: "アルミン・アルレルト",
    role: { tr: "Çocukluk üçlüsünün üçüncüsü", en: "The third of the childhood trio" },
    note: {
      tr: "Shiganshina'da beraber büyüdükleri üçüncü isim. Mikasa'nın gücünün karşılığı olan akıl; üçlünün kararları çoğu zaman onun ağzından çıkıyor.",
      en: "The third name they grew up with in Shiganshina. The mind that answers her strength; most of the trio's decisions come out of his mouth.",
    },
  },
  {
    key: "levi",
    characterId: 45627,
    name: "Levi Ackerman",
    native: "リヴァイ・アッカーマン",
    role: { tr: "Aynı soy", en: "The same line" },
    note: {
      tr: "Aynı soyadı taşıyan tek asker. İkisi de duvarların en iyi savaşçısı sayılıyor ve ikisi de aynı sebeple: Ackerman uyanışı.",
      en: "The only other soldier carrying the name. Both are counted the best fighter inside the walls, and both for the same reason: the Ackerman waking.",
    },
  },
];

/** Yoldaş portresinin alt metnine eklenen sonek. */
export const MIKASA_COMPANION_SUFFIX: LocalizedText = {
  tr: "— arşivdeki portresi",
  en: "— portrait from this archive",
};

/* ── Donanım: üç büyük kart ─────────────────────────────────────────────── */

export interface MikasaGearCard {
  key: string;
  imageKey: string;
  /** Japonca terim — çeviri gerektirmeyen özel ad */
  name: string;
  reading: string;
  turkish: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
}

export const MIKASA_GEAR: MikasaGearCard[] = [
  {
    key: "odm",
    imageKey: MIKASA_IMAGE_KEYS.gearOdm,
    name: "立体機動装置",
    reading: "rittai kidō sōchi",
    turkish: {
      tr: "Üç boyutlu manevra donanımı",
      en: "Omni-directional mobility gear",
    },
    tagline: {
      tr: "İki kanca, basınçlı gaz, çelik tel.",
      en: "Two hooks, pressurised gas, steel wire.",
    },
    text: {
      tr: "Kalça hizasındaki iki fırlatıcı çelik teli hedefe saplıyor, sırttaki basınçlı gaz gövdeyi telin üstünde taşıyor. Donanım hız üretmiyor; düşüşü yöne çeviriyor. Mikasa'yı ayıran şey donanımın kendisi değil, iki kanca arasındaki açıyı sürekli yeniden hesaplaması: ağırlık merkezini hiç kaybetmiyor, o yüzden gazı da en az harcayan o oluyor.",
      en: "Two launchers at the hips drive steel wire into the target while the pressurised gas on her back carries her body along it. The gear produces no speed of its own; it turns a fall into a direction. What sets Mikasa apart is not the gear but the fact that she recomputes the angle between the two hooks without pause: she never loses her centre of mass, which is also why she burns the least gas.",
    },
    traits: [
      { tr: "İki kanca", en: "Two hooks" },
      { tr: "Basınçlı gaz", en: "Pressurised gas" },
      { tr: "Çelik tel", en: "Steel wire" },
    ],
  },
  {
    key: "ackerman",
    imageKey: MIKASA_IMAGE_KEYS.gearAckerman,
    name: "アッカーマン一族",
    reading: "akkāman ichizoku",
    turkish: { tr: "Ackerman soyu", en: "The Ackerman line" },
    tagline: {
      tr: "Bir eşiği geçtiği anda bedenin tamamı açılıyor.",
      en: "Cross one threshold and the whole body opens.",
    },
    text: {
      tr: "Ackermanlar titan biliminin bir yan ürünü olarak anlatılıyor: titana dönüşmüyorlar, ama bir eşiği geçtiklerinde bedenin sınırı olağanüstü yükseliyor. Aynı soy Kurucu'nun hafıza müdahalesinin de dışında kalıyor — duvarların içindeki unutuş onlara işlemiyor. Mikasa dokuz yaşında, karlı bir kulübede uyandı; o günden sonra kimse ona bir daha çocuk demedi.",
      en: "The Ackermans are described as a by-product of titan science: they do not become titans, but once they cross a threshold the limit of the body rises extraordinarily. The same line also falls outside the Founder's tampering with memory — the forgetting inside the walls does not take on them. Mikasa woke at nine, in a snowbound cabin; nobody called her a child again after that day.",
    },
    traits: [
      { tr: "Titana dönüşmez", en: "Never a titan" },
      { tr: "Hafıza müdahalesinin dışında", en: "Outside the memory tampering" },
      { tr: "Uyanış geri alınmıyor", en: "The waking does not reverse" },
    ],
  },
  {
    key: "blade",
    imageKey: MIKASA_IMAGE_KEYS.gearBlade,
    name: "超硬質ブレード",
    reading: "chōkōshitsu burēdo",
    turkish: { tr: "Ultra sert bıçaklar", en: "Ultrahard blades" },
    tagline: {
      tr: "Tek hedef, tek ölçü.",
      en: "One target, one measurement.",
    },
    text: {
      tr: "Donanımın kabzalarına takılan, değiştirilebilir çelik ağızlar. Titan gövdesi ne kadar büyük olursa olsun işe yarayan tek yer var: ensedeki yaklaşık bir metre boyunda, on santim genişliğindeki dilim. Ağız körelince atılıyor, yenisi takılıyor. Yani savaş bir kesme meselesi olduğu kadar bir stok meselesi: kaç kesim kaldığını bilmeyen asker, hedefi bilse de bitiremiyor.",
      en: "Replaceable steel edges that clip into the grips of the gear. However large the titan body, only one place counts: the strip at the nape, roughly one metre long and ten centimetres wide. A dulled edge is thrown away and a fresh one clipped in. Which makes the fight as much a question of stock as of cutting: a soldier who has lost count of her remaining edges cannot finish, even knowing exactly where to strike.",
    },
    traits: [
      { tr: "Değiştirilebilir ağız", en: "Replaceable edge" },
      { tr: "Yaklaşık 1 m × 10 cm", en: "About 1 m × 10 cm" },
      { tr: "Körelen atılır", en: "Dull is discarded" },
    ],
  },
];

/* ── Donanım: dört ayrıntı ──────────────────────────────────────────────── */

export interface MikasaNote {
  key: string;
  imageKey: string;
  name: string;
  reading: string;
  turkish: LocalizedText;
  note: LocalizedText;
}

export const MIKASA_NOTES: MikasaNote[] = [
  {
    key: "nape",
    imageKey: MIKASA_IMAGE_KEYS.noteNape,
    name: "うなじ",
    reading: "unaji",
    turkish: { tr: "Ense", en: "The nape" },
    note: {
      tr: "Bütün savaşın indirgendiği tek dikdörtgen. Kesildiğinde gövde buhara dönüşüyor; kesilmediği sürece gövdenin geri kalanına verilen her hasar geri geliyor.",
      en: "The single rectangle the whole war reduces to. Cut it and the body turns to steam; leave it and every wound dealt anywhere else simply grows back.",
    },
  },
  {
    key: "antiPersonnel",
    imageKey: MIKASA_IMAGE_KEYS.noteAntiPersonnel,
    name: "対人立体機動装置",
    reading: "taijin rittai kidō sōchi",
    turkish: {
      tr: "İnsana karşı manevra donanımı",
      en: "Anti-personnel ODM gear",
    },
    note: {
      tr: "İlk kez Kenny Ackerman'ın birliğinde görüldü: kısa menzilli kanca, dar alan, ateşli silah yuvaları. Hedefin titan olmadığı her çatışmanın donanımı.",
      en: "First seen with Kenny Ackerman's unit: short-range hooks, tight quarters, mounts for firearms. The gear for every fight where the target is not a titan.",
    },
  },
  {
    key: "thunder",
    imageKey: MIKASA_IMAGE_KEYS.noteThunder,
    name: "雷槍",
    reading: "raisō",
    turkish: { tr: "Yıldırım mızrakları", en: "Thunder spears" },
    note: {
      tr: "Zırhlı gövdeye çelik ağız işlemediği için geliştirildi: saplanıp içeride patlayan mızraklar. Shiganshina'nın geri alınmasında toplu hâlde kullanıldı.",
      en: "Developed because a steel edge does nothing to armoured flesh: spears that lodge and then detonate inside. Fielded in numbers during the retaking of Shiganshina.",
    },
  },
  {
    key: "headache",
    imageKey: MIKASA_IMAGE_KEYS.noteHeadache,
    name: "頭痛",
    reading: "zutsū",
    turkish: { tr: "Baş ağrısı", en: "The headache" },
    note: {
      tr: "Uyanışın karşılığı olarak anlatılan şey bir güç değil bir ağrı. Mikasa'nın en kritik anlarda gelen şiddetli baş ağrıları serinin sonuna kadar açıklanmadan taşınıyor.",
      en: "What the story gives back for the waking is not a power but a pain. The severe headaches that arrive at her most critical moments are carried, unexplained, almost to the end of the series.",
    },
  },
];

/* ── Kanca açısı: sayfanın kalbi ────────────────────────────────────────── */

export interface MikasaAngle {
  key: string;
  imageKey: string;
  /** Derece — hem etikette hem `--mks-angle` değerinde kullanılıyor */
  deg: number;
  /** Kartların dizilim eğimini süren katsayı (0 = düz istif) */
  shift: number;
  name: LocalizedText;
  /** Mono okuma satırı — çeviri gerektirmeyen teknik dize */
  readout: string;
  geometry: LocalizedText;
  scene: LocalizedText;
  note: LocalizedText;
}

export const MIKASA_ANGLES: MikasaAngle[] = [
  {
    key: "drop",
    imageKey: MIKASA_IMAGE_KEYS.angleDrop,
    deg: 0,
    shift: 0,
    name: { tr: "Dikey iniş", en: "Vertical drop" },
    readout: "00° · 0.00 → düz",
    geometry: {
      tr: "Kanca yok, açı yok. Hareketin tamamı yerçekimi; sayfadaki kartlar da üst üste, eğimsiz duruyor.",
      en: "No hook, no angle. The whole movement is gravity; the cards on this page stack straight, without slope.",
    },
    scene: {
      tr: "Trost. Gaz bitti, tel kalmadı, düşüş düz. Mikasa o düşüşün ortasında vazgeçmeyi düşündü — sıfır derece bir tercih değil, donanımın bittiği yer.",
      en: "Trost. The gas ran out, no wire left, the fall straight down. In the middle of it she considered giving up — zero degrees is not a choice, it is where the gear ends.",
    },
    note: {
      tr: "Bu açıda hiçbir şey seçilmiyor. Sayfa da bunu söylüyor: eğim sıfır.",
      en: "Nothing is chosen at this angle. The page says the same thing: slope zero.",
    },
  },
  {
    key: "track",
    imageKey: MIKASA_IMAGE_KEYS.angleTrack,
    deg: 22,
    shift: 0.42,
    name: { tr: "Takip", en: "Tracking" },
    readout: "22° · 0.42 → sabit mesafe",
    geometry: {
      tr: "Dar açı, sabit mesafe. Kartlar hafifçe sağa kayıyor ama hiçbiri çizgiden kopmuyor — takip tam olarak budur.",
      en: "A narrow angle, a constant distance. The cards drift right a little but none leaves the line — that is exactly what tracking is.",
    },
    scene: {
      tr: "57. Duvar Dışı Keşif Harekâtı. Dişi Titan'ın peşinde, ormanın içinde, Levi'nin yanında. Amaç yetişmek değil, hedefi kaybetmemek.",
      en: "The 57th Exterior Scouting Mission. Behind the Female Titan, inside the forest, alongside Levi. The aim is not to catch up; it is to not lose the target.",
    },
    note: {
      tr: "Mikasa'nın sekiz yıllık varsayılan açısı: Eren'in bir adım arkası.",
      en: "Mikasa's default angle for eight years: one step behind Eren.",
    },
  },
  {
    key: "cut",
    imageKey: MIKASA_IMAGE_KEYS.angleCut,
    deg: 45,
    shift: 1,
    name: { tr: "Kesişim", en: "Interception" },
    readout: "45° · 1.00 → önünü kes",
    geometry: {
      tr: "Geniş açı, kesişen yol. Kartlar art arda kayıyor ve dizilim belirgin bir eğime dönüşüyor; çizgi hâlâ solda, hâlâ tek parça.",
      en: "A wide angle, an intersecting path. The cards step out one after another and the arrangement becomes a visible slope; the line is still on the left, still one piece.",
    },
    scene: {
      tr: "Stohess. Dişi Titan duvara tırmanırken Mikasa hedefe değil, hedefin gideceği yere gidiyor ve tırmanan eli kesiyor.",
      en: "Stohess. As the Female Titan climbs the wall, Mikasa goes not to the target but to where the target will be, and cuts the climbing hand.",
    },
    note: {
      tr: "Kırk beş derece bir hız değil bir tahmin: kancanın gittiği yer hedefin şu anki yeri değil.",
      en: "Forty-five degrees is not speed, it is a prediction: the hook goes where the target is not yet.",
    },
  },
];

/** Açı seçicinin arayüz metinleri — istemci adasına düz dize olarak iner. */
export const MIKASA_DIAL_UI = {
  groupLabel: { tr: "Kanca açısı seçici", en: "Hook angle selector" },
  anchorLabel: { tr: "Çıkış noktası", en: "Anchor" },
  anchorValue: { tr: "atkı çizgisi", en: "the scarf line" },
  slopeLabel: { tr: "Dizilim eğimi", en: "Arrangement slope" },
  activeLabel: { tr: "Seçili açı", en: "Selected angle" },
  keyboardHint: {
    tr: "Üç düğme de sekmeyle geziliyor; seçim sayfanın tamamındaki eğimi değiştiriyor.",
    en: "All three buttons are reachable by keyboard; the selection changes the slope across the whole page.",
  },
  diagramAlt: {
    tr: "Atkı çizgisinden çıkan üç kanca yolunun şeması: 0, 22 ve 45 derece",
    en: "Diagram of three hook paths leaving the scarf line at 0, 22 and 45 degrees",
  },
} as const;

/* ── Kader çizelgesi: beş düğüm ─────────────────────────────────────────── */

export interface MikasaKnot {
  key: string;
  imageKey: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: {
    /** Orijinal Japonca — iki dilde de aynı satır */
    ja: string;
    reading: string;
    meaning: LocalizedText;
    by: LocalizedText;
    where: LocalizedText;
  };
  kin?: { characterId: number; name: string; role: LocalizedText };
}

export const MIKASA_TIMELINE: MikasaKnot[] = [
  {
    key: "cabin",
    imageKey: MIKASA_IMAGE_KEYS.knotCabin,
    age: { tr: "9 yaşında", en: "Age nine" },
    title: { tr: "Kulübe", en: "The cabin" },
    text: {
      tr: "Öz annesi ve babası insan tüccarları tarafından öldürüldü, Mikasa kaçırıldı. Eren kapıyı açtığında iki adam yerdeydi ve üçüncüsü ayaktaydı. O gün Mikasa ilk kez kendi elini kendi kararıyla kaldırdı — ve bir daha indirmedi. Aynı gün, dönüş yolunda, Eren üşüdüğünü görüp atkısını boynuna doladı.",
      en: "Her mother and father were killed by traffickers and Mikasa was taken. When Eren opened the door two men were already down and the third was still standing. That day she raised her own hand by her own decision for the first time — and never lowered it again. On the walk back, seeing her cold, Eren wound his scarf around her neck.",
    },
    quote: {
      ja: "戦え！ 戦わなければ勝てない！",
      reading: "tatakae! tatakawanakereba katenai!",
      meaning: {
        tr: "Savaş! Savaşmazsan kazanamazsın!",
        en: "Fight! If you don't fight, you can't win!",
      },
      by: { tr: "Eren Yeager", en: "Eren Yeager" },
      where: {
        tr: "Kulübede, üçüncü adam ayaktayken",
        en: "In the cabin, with the third man still standing",
      },
    },
    kin: {
      characterId: 40882,
      name: "Eren Yeager",
      role: { tr: "Kapıyı açan", en: "The one who opened the door" },
    },
  },
  {
    key: "wall",
    imageKey: MIKASA_IMAGE_KEYS.knotWall,
    age: { tr: "10 yaşında · yıl 845", en: "Age ten · year 845" },
    title: { tr: "Duvar delindi", en: "The wall was breached" },
    text: {
      tr: "Kolosal Titan Shiganshina'nın dış kapısını yıktı, Zırhlı Titan iç kapıyı deldi. Carla Yeager evin enkazının altında kaldı ve çıkarılamadı. Mikasa bir yıl içinde ikinci ailesini de kaybetti; Wall Rose'a giden tahliye teknelerinden birindeydi ve o teknede kimseye bir şey söylemedi.",
      en: "The Colossal Titan brought down the outer gate of Shiganshina; the Armoured Titan broke the inner one. Carla Yeager was pinned under the wreckage of the house and could not be pulled free. Within a single year Mikasa lost a second family; she was on one of the evacuation boats to Wall Rose, and on that boat she said nothing to anyone.",
    },
  },
  {
    key: "first",
    imageKey: MIKASA_IMAGE_KEYS.knotFirst,
    age: { tr: "15 yaşında", en: "Age fifteen" },
    title: { tr: "Birinci", en: "First" },
    text: {
      tr: "104. Eğitim Birliği'nden birinci sırada mezun oldu. İlk on, duvarların en güvenli işini — İç Kuvvetler'i — seçme hakkı kazanıyordu. Mikasa Keşif Birliği'ni seçti. Gerekçesi bir cümleye sığıyordu ve o cümlede kendi adı geçmiyordu.",
      en: "She graduated first in the 104th Training Corps. The top ten earned the right to the safest posting inside the walls — the Military Police. Mikasa chose the Survey Corps. Her reason fit into one sentence, and her own name did not appear in it.",
    },
    kin: {
      characterId: 46494,
      name: "Armin Arlert",
      role: { tr: "Aynı dönem, aynı seçim", en: "Same class, same choice" },
    },
  },
  {
    key: "trost",
    imageKey: MIKASA_IMAGE_KEYS.knotTrost,
    age: { tr: "15 yaşında · yıl 850", en: "Age fifteen · year 850" },
    title: { tr: "Trost", en: "Trost" },
    text: {
      tr: "Gaz bitti, düşüş başladı, çatılar yaklaştı. Mikasa o an bırakmayı düşündü ve dokuz yaşında duyduğu cümleyi hatırladı. Ayağa kalktığında dünya hakkında verdiği hüküm değişmişti: zalim olduğu kadar güzel de.",
      en: "The gas ran out, the fall began, the rooftops came up. In that moment she thought about letting go — and remembered a sentence she had heard at nine. By the time she stood up her verdict on the world had changed: as cruel as it is, it is also beautiful.",
    },
    quote: {
      ja: "この世界は残酷だ。そして、とても美しい",
      reading: "kono sekai wa zankoku da. soshite, totemo utsukushii",
      meaning: {
        tr: "Bu dünya zalim. Ve çok güzel.",
        en: "This world is cruel. And very beautiful.",
      },
      by: { tr: "Mikasa Ackerman", en: "Mikasa Ackerman" },
      where: { tr: "Trost'ta, düşüşten sonra", en: "At Trost, after the fall" },
    },
  },
  {
    key: "farewell",
    imageKey: MIKASA_IMAGE_KEYS.knotFarewell,
    age: { tr: "19 yaşında", en: "Age nineteen" },
    title: { tr: "Veda", en: "The farewell" },
    text: {
      tr: "Yürüyüş'ün sonunda Mikasa'nın seçimi bir tarafı desteklemek olmadı; kendi çizgisini kendi eliyle kesti — hayatı boyunca yaptığı en zor kesim ve tek isabetli olanı. Sonrasında yaptığı tek şey, bir ağacın altındaki mezarın başında atkıyı bir kez daha bağlamaktı.",
      en: "At the end of the Rumbling her choice was not to take a side; she cut her own line with her own hand — the hardest cut of her life and the only one that had to land. Afterwards all she did was tie the scarf once more, at a grave under a tree.",
    },
    quote: {
      ja: "行ってらっしゃい、エレン",
      reading: "itterasshai, eren",
      meaning: {
        tr: "Güle güle, Eren. (Gidip dönecek birine söylenen söz.)",
        en: "See you later, Eren. (What you say to someone leaving who is meant to return.)",
      },
      by: { tr: "Mikasa Ackerman", en: "Mikasa Ackerman" },
      where: { tr: "Mezarın başında", en: "At the grave" },
    },
    kin: {
      characterId: 40882,
      name: "Eren Yeager",
      role: { tr: "Çizginin öteki ucu", en: "The other end of the line" },
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const MIKASA_CLOSING = {
  quotes: [
    {
      ja: "温かいだろ？",
      reading: "atatakai daro?",
      meaning: { tr: "Sıcak, değil mi?", en: "It's warm, isn't it?" },
      by: { tr: "Eren Yeager", en: "Eren Yeager" },
      note: {
        tr: "Kulübeden dönerken, atkıyı Mikasa'nın boynuna doladığı an. Sayfanın sol kenarındaki çizgi burada başlıyor.",
        en: "On the walk back from the cabin, the moment he wound the scarf around her neck. The line down the left edge of this page starts here.",
      },
    },
    {
      ja: "マフラーを巻いてくれて、ありがとう",
      reading: "mafurā o maite kurete, arigatō",
      meaning: {
        tr: "Atkıyı boynuma doladığın için teşekkür ederim.",
        en: "Thank you for wrapping this scarf around me.",
      },
      by: { tr: "Mikasa Ackerman", en: "Mikasa Ackerman" },
      note: {
        tr: "Eren'e döndüğünde, aynı atkıyla. Altı yıl sonra söylenen bir teşekkür.",
        en: "When she found Eren again, wearing the same scarf. A thank-you spoken six years late.",
      },
    },
  ],
  scarfAlt: {
    tr: "Kırmızı atkı — yakın çekim, kumaş ve düğüm",
    en: "The red scarf — close crop of cloth and knot",
  },
  bandAlt: {
    tr: "Kapanış karesi — Mikasa Ackerman",
    en: "Closing frame — Mikasa Ackerman",
  },
  bandNote: {
    tr: "Kapanış bandı boş. Küratör bir kare yüklediğinde sayfa buradan kapanacak; yüklenene kadar kadraj kendi çizgisiyle duruyor.",
    en: "The closing band is empty. Once the curator uploads a frame the page will close on it; until then the frame stands on its own outline.",
  },
  motto: "家族",
  mottoNote: {
    tr: "Sayfanın filigranı: aile. Mikasa'nın peşinden koştuğu tek kelime iki kez kuruldu, iki kez yıkıldı — üçüncüsü bir atkıya sığdı.",
    en: "The page's watermark: family. The single word she chased was built twice and destroyed twice — the third one fit inside a scarf.",
  },
  credit: {
    tr: "Künye ve resmî portre AniList'ten alındı:",
    en: "Profile data and the official portrait come from AniList:",
  },
  creditLink: {
    tr: "AniList — Mikasa Ackerman (#40881)",
    en: "AniList — Mikasa Ackerman (#40881)",
  },
  sourceNote: {
    tr: "Sayfadaki portre AniList'in resmî karesi (230×345 piksel), depoya indirilmiş hâliyle sunuluyor — hotlink yok. Diğer bütün kadrajlar küratör yuvası: doldurulmadıkları sürece boş çizilirler ve sayfa onlarsız da ayakta durur. Filigran, dokuma deseni ve kanca şeması elle çizilmiş SVG'dir; dışarıdan indirilmiş hiçbir raster yok.",
    en: "The portrait on this page is AniList's official frame (230×345 px), served from a copy in our own repository — no hotlinking. Every other frame is a curator slot: until filled they render empty, and the page stands without them. The watermark, the weave pattern and the hook diagram are hand-drawn SVG; no raster was downloaded from anywhere.",
  },
} as const;

/* ── Küratör özeti ──────────────────────────────────────────────────────── */

export const MIKASA_GAPS = {
  title: { tr: "Boş kadrajlar", en: "Empty frames" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bütün kadrajlar dolu — bu sayfada yüklenecek görsel kalmadı.",
    en: "Every frame is filled — nothing left to upload on this page.",
  },
} as const;

/** Sayfadaki bütün ABILITY anahtarları, `CuratorGaps` sırasıyla. */
export const MIKASA_GAP_ORDER: string[] = [
  MIKASA_IMAGE_KEYS.hero,
  MIKASA_IMAGE_KEYS.gearOdm,
  MIKASA_IMAGE_KEYS.gearAckerman,
  MIKASA_IMAGE_KEYS.gearBlade,
  MIKASA_IMAGE_KEYS.noteNape,
  MIKASA_IMAGE_KEYS.noteAntiPersonnel,
  MIKASA_IMAGE_KEYS.noteThunder,
  MIKASA_IMAGE_KEYS.noteHeadache,
  MIKASA_IMAGE_KEYS.angleDrop,
  MIKASA_IMAGE_KEYS.angleTrack,
  MIKASA_IMAGE_KEYS.angleCut,
  MIKASA_IMAGE_KEYS.knotCabin,
  MIKASA_IMAGE_KEYS.knotWall,
  MIKASA_IMAGE_KEYS.knotFirst,
  MIKASA_IMAGE_KEYS.knotTrost,
  MIKASA_IMAGE_KEYS.knotFarewell,
  MIKASA_IMAGE_KEYS.scarf,
  MIKASA_IMAGE_KEYS.closing,
];
