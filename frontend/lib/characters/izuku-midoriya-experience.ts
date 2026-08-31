import type { LocalizedText } from "./types";

/**
 * Izuku Midoriya — "Analiz Defteri" deneyim sayfasının veri iskeleti.
 *
 * Ev deseni (Itachi emsali, 18 Ağustos 2026): karaktere özel BÜTÜN anlatı
 * kodda, iki dilli `LocalizedText` çiftleri olarak (AGENTS.md kural 1).
 * Sahne görselleri veritabanında — characterId 89028 kaydının ABILITY
 * yuvaları, `mid:*` anahtarlarıyla.
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * Midoriya'nın gücü yumruğu değil, NOT TUTMASI. Doğuştan quirk'siz bir
 * çocuk kahramanları izleyip defterlere yazdı; devraldığı güç de zaten
 * biriktirilmiş bir kayıt — sekiz kişinin üst üste yazdığı tek bir defter.
 * Sayfa bu yüzden kareli bir defter kağıdı ve tek modu "Analiz": açıldığında
 * DÜZEN değişmiyor, kenar boşluğuna el yazısı notlar EKLENİYOR.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum günü (15 Temmuz), boy (166 cm), kan grubu (O), yaş kaydı ("14-"),
 * quirk adı (One For All), okul ve sınıf (U.A. Lisesi, Sınıf 1-A) ve takma
 * ad (Deku / デク) AniList künyesinden birebir alındı — arşivin kendi
 * kopyası: `public/assets/anime/karakterler/izuku-midoriya/kaynak.json`
 * (30 Ağustos 2026). Doğum YILI kayıtta boş (`dogum.year: null`), bu yüzden
 * hiçbir yerde takvim yılı yazılmadı.
 *
 * ⚠️ KAHRAMAN SIRALAMASI YOK. Midoriya bu kayıtta bir öğrenci; profesyonel
 * sıralaması kaynakta geçmiyor ve TÜRETİLMEDİ. Künye şeridinde satır duruyor
 * ama değeri "kayıtta yok" (Eren sayfasındaki boş kan grubu emsali).
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Tırnağa alınan Japonca yalnızca iki cümle ve ikisi de serinin ilk
 * bölümünden (Boku no Hero Academia, 1. bölüm — Midoriya'nın All Might'a
 * sorduğu soru ve All Might'ın cevabı):
 *   「無個性でも、ヒーローになれますか」 — Midoriya'nın sorusu
 *   「君はヒーローになれる」             — All Might'ın cevabı
 * Üçüncü bir Japonca dize var ama replik DEĞİL, okulun sloganı:
 *   プルス・ウルトラ (Plus Ultra) — U.A. Lisesi'nin bağırışı, kişiye ait değil.
 * Emin olunmayan hiçbir cümle tırnağa alınmadı: Uraraka'nın "Deku" adını
 * çevirdiği replik düz anlatı olarak yazıldı, alıntı olarak DEĞİL.
 *
 * ── TERMİNOLOJİ (MHA evreni — "jutsu" / "teknik" YOK) ────────────────────
 * 個性 (Kosei — Quirk), ワン・フォー・オール (One For All), フルカウル
 * (Full Cowling), シュートスタイル (Shoot Style), 発勁 (Fa Jin), 黒鞭
 * (Blackwhip), 煙幕 (Smokescreen), 浮遊 (Float), 危険感知 (Danger Sense),
 * 一代目〜九代目 (One For All'ın sahiplerinin sıra sayıları), Ultimate Move
 * (Smash ailesi), Hero Adı (Deku / デク), U.A. Lisesi Sınıf 1-A.
 *
 * ⚠️ ÜÇÜNCÜ SAHİBİN QUIRK'İ KAYITTA ADSIZ. Uydurulmadı: kartı "adı
 * geçmiyor" diye duruyor ve mekanik de onu adsız sayıyor (sekiz siluet,
 * BEŞ adlı quirk).
 */

export const MID_ID = 89028;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const MID_SITE_URL = "https://anilist.co/character/89028";

/**
 * Depodaki resmî portre (Faz 2 §3: hotlink YOK, dosya repoda).
 * Ölçüsü `kaynak.json`'dan: 230×345 — yani KÜÇÜK. Sayfada deftere
 * iliştirilmiş bir vesikalık boyunda kullanılıyor; büyük kadraj
 * `mid:hero` yuvasında bekliyor.
 */
export const MID_PORTRAIT = {
  src: "/assets/anime/karakterler/izuku-midoriya/anilist-portrait.png",
  w: 230,
  h: 345,
} as const;

/**
 * Sahne görselleri — hepsi characterId 89028 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `mid:` önekli (küratör modu şartı).
 */
export const MID_IMAGE_KEYS = {
  hero: "mid:hero",
  notebook: "mid:defter",
  oneForAll: "mid:one-for-all",
  fullCowling: "mid:full-cowl",
  shootStyle: "mid:shoot-style",
  moveDetroit: "mid:detroit",
  moveDelaware: "mid:delaware",
  moveManchester: "mid:manchester",
  moveStLouis: "mid:st-louis",
  vestiges: "mid:vestige",
  fateDiagnosis: "mid:kader-teshis",
  fateSludge: "mid:kader-yapiskan",
  fateBeach: "mid:kader-plaj",
  fateSchool: "mid:kader-ua",
  fateBlackwhip: "mid:kader-kurbagcik",
  closing: "mid:closing",
} as const;

/** Portre yuvası ABILITY değil PORTRAIT — yüklenen kare 230×345'i EZER. */
export const MID_PORTRAIT_SLOT_KEY = "PORTRAIT";

/** Küratör yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const MID_SLOT_LABELS: Record<string, LocalizedText> = {
  [MID_PORTRAIT_SLOT_KEY]: {
    tr: "Portre — dikey kare; yüklenen görsel AniList'in 230×345'ini ezer (2:3, webp)",
    en: "Portrait — a vertical frame; an upload overrides AniList's 230×345 (2:3, webp)",
  },
  [MID_IMAGE_KEYS.hero]: {
    tr: "Hero — yatay kare: yeşil şimşekle koşan figür, geniş kadraj (16:9, webp)",
    en: "Hero — a horizontal plate: the figure running wrapped in green lightning (16:9, webp)",
  },
  [MID_IMAGE_KEYS.notebook]: {
    tr: "Defter — açık bir analiz defteri sayfası, el yazısı ve çizimler (1:1, webp)",
    en: "The notebook — an open page of hero analysis, handwriting and sketches (1:1, webp)",
  },
  [MID_IMAGE_KEYS.oneForAll]: {
    tr: "One For All — biriken gücün ilk salınışı, tüm gövde (4:3, webp)",
    en: "One For All — the first release of the stockpiled power, full body (4:3, webp)",
  },
  [MID_IMAGE_KEYS.fullCowling]: {
    tr: "Full Cowling — gövdeyi saran ince şimşek ağı, yakın plan (4:3, webp)",
    en: "Full Cowling — the fine lightning net over the whole body, close crop (4:3, webp)",
  },
  [MID_IMAGE_KEYS.shootStyle]: {
    tr: "Shoot Style — havada dönen tekme, kollar geride (4:3, webp)",
    en: "Shoot Style — a turning kick in mid-air, arms held back (4:3, webp)",
  },
  [MID_IMAGE_KEYS.moveDetroit]: {
    tr: "Detroit Smash — yukarı doğru yumruk, hava dalgası (1:1, webp)",
    en: "Detroit Smash — the upward punch, the shock of displaced air (1:1, webp)",
  },
  [MID_IMAGE_KEYS.moveDelaware]: {
    tr: "Delaware Smash — tek parmak fiskesi, yakın çekim el (1:1, webp)",
    en: "Delaware Smash — the single-finger flick, close crop on the hand (1:1, webp)",
  },
  [MID_IMAGE_KEYS.moveManchester]: {
    tr: "Manchester Smash — havadan inen balta tekme (1:1, webp)",
    en: "Manchester Smash — the axe kick coming down from the air (1:1, webp)",
  },
  [MID_IMAGE_KEYS.moveStLouis]: {
    tr: "St. Louis Smash — yandan gelen düz tekme (1:1, webp)",
    en: "St. Louis Smash — the straight kick coming in from the side (1:1, webp)",
  },
  [MID_IMAGE_KEYS.vestiges]: {
    tr: "Vestige'ler — karanlıkta duran sekiz figür, yüzler seçilmiyor (16:9, webp)",
    en: "The vestiges — eight figures standing in the dark, faces unresolved (16:9, webp)",
  },
  [MID_IMAGE_KEYS.fateDiagnosis]: {
    tr: "Teşhis — muayene odası, röntgen ve iki ayak parmağı kemiği (16:9, webp)",
    en: "The diagnosis — an examination room, an X-ray and a toe joint (16:9, webp)",
  },
  [MID_IMAGE_KEYS.fateSludge]: {
    tr: "Yapışkan düşman — tünel ağzı, kalabalık, koşan çocuk (16:9, webp)",
    en: "The sludge villain — a tunnel mouth, a crowd, a running boy (16:9, webp)",
  },
  [MID_IMAGE_KEYS.fateBeach]: {
    tr: "Dagobah Plajı — çöp yığınları ve temizlenmiş kum (16:9, webp)",
    en: "Dagobah Beach — heaps of refuse and the cleared sand (16:9, webp)",
  },
  [MID_IMAGE_KEYS.fateSchool]: {
    tr: "U.A. — sınıf 1-A koridoru ya da spor festivali sahası (16:9, webp)",
    en: "U.A. — the corridor of Class 1-A, or the sports festival ground (16:9, webp)",
  },
  [MID_IMAGE_KEYS.fateBlackwhip]: {
    tr: "Kara Kırbaç — koldan fırlayan karanlık şeritler (16:9, webp)",
    en: "Blackwhip — the dark bands bursting out of an arm (16:9, webp)",
  },
  [MID_IMAGE_KEYS.closing]: {
    tr: "Kapanış — kapatılmış bir defter ve kalem; insansız (2:1, webp)",
    en: "Closing — a closed notebook and a pencil; no people (2:1, webp)",
  },
};

/** Küratör özetindeki "beklenen kare" satırları. */
export const MID_SLOT_SPECS: Record<string, LocalizedText> = {
  [MID_PORTRAIT_SLOT_KEY]: {
    tr: "dikey portre · 1200×1600 · webp",
    en: "vertical portrait · 1200×1600 · webp",
  },
  [MID_IMAGE_KEYS.hero]: {
    tr: "yatay hero karesi · 1600×900 · webp",
    en: "horizontal hero plate · 1600×900 · webp",
  },
  [MID_IMAGE_KEYS.notebook]: {
    tr: "kare detay · 1000×1000 · webp",
    en: "square detail · 1000×1000 · webp",
  },
  [MID_IMAGE_KEYS.oneForAll]: {
    tr: "güç kartı · 1200×900 · webp",
    en: "power card · 1200×900 · webp",
  },
  [MID_IMAGE_KEYS.fullCowling]: {
    tr: "güç kartı · 1200×900 · webp",
    en: "power card · 1200×900 · webp",
  },
  [MID_IMAGE_KEYS.shootStyle]: {
    tr: "güç kartı · 1200×900 · webp",
    en: "power card · 1200×900 · webp",
  },
  [MID_IMAGE_KEYS.moveDetroit]: {
    tr: "kare detay · 800×800 · webp",
    en: "square detail · 800×800 · webp",
  },
  [MID_IMAGE_KEYS.moveDelaware]: {
    tr: "kare detay · 800×800 · webp",
    en: "square detail · 800×800 · webp",
  },
  [MID_IMAGE_KEYS.moveManchester]: {
    tr: "kare detay · 800×800 · webp",
    en: "square detail · 800×800 · webp",
  },
  [MID_IMAGE_KEYS.moveStLouis]: {
    tr: "kare detay · 800×800 · webp",
    en: "square detail · 800×800 · webp",
  },
  [MID_IMAGE_KEYS.vestiges]: {
    tr: "geniş sahne · 1600×900 · webp",
    en: "wide scene · 1600×900 · webp",
  },
  [MID_IMAGE_KEYS.fateDiagnosis]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [MID_IMAGE_KEYS.fateSludge]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [MID_IMAGE_KEYS.fateBeach]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [MID_IMAGE_KEYS.fateSchool]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [MID_IMAGE_KEYS.fateBlackwhip]: {
    tr: "sahne · 1440×810 · webp",
    en: "scene · 1440×810 · webp",
  },
  [MID_IMAGE_KEYS.closing]: {
    tr: "geniş şerit · 1600×800 · webp",
    en: "wide strip · 1600×800 · webp",
  },
};

/**
 * Yüklenmiş sahne karelerinin `alt` metinleri.
 *
 * Neden yuva etiketinden AYRI: etiket küratöre "ne yükleyeceğini" söylüyor
 * ve içinde üretim ölçüsü var ("16:9, webp"). `alt` ise ekran okuyucuya
 * gidiyor — orada piksel ölçüsünün işi yok (Dalga 1 dersi: üretim
 * metadatası ziyaretçiye sızmayacak). Bu yüzden aynı kadraj için iki ayrı
 * metin var ve `alt` yalnızca sahnenin NE OLDUĞUNU söylüyor.
 */
export const MID_SCENE_ALT: Record<string, LocalizedText> = {
  [MID_IMAGE_KEYS.hero]: {
    tr: "Izuku Midoriya — yeşil şimşekle koşarken; arşive yüklenmiş sahne karesi",
    en: "Izuku Midoriya running wrapped in green lightning; scene uploaded to the archive",
  },
  [MID_IMAGE_KEYS.notebook]: {
    tr: "Açık bir analiz defteri sayfası; arşive yüklenmiş sahne karesi",
    en: "An open page of the analysis notebook; scene uploaded to the archive",
  },
  [MID_IMAGE_KEYS.oneForAll]: {
    tr: "One For All'ın salınışı; arşive yüklenmiş sahne karesi",
    en: "One For All released; scene uploaded to the archive",
  },
  [MID_IMAGE_KEYS.fullCowling]: {
    tr: "Full Cowling — gövdeyi saran şimşek ağı; arşive yüklenmiş sahne karesi",
    en: "Full Cowling — the lightning net over the body; scene uploaded to the archive",
  },
  [MID_IMAGE_KEYS.shootStyle]: {
    tr: "Shoot Style — havada dönen tekme; arşive yüklenmiş sahne karesi",
    en: "Shoot Style — a turning kick in mid-air; scene uploaded to the archive",
  },
  [MID_IMAGE_KEYS.moveDetroit]: {
    tr: "Detroit Smash; arşive yüklenmiş sahne karesi",
    en: "Detroit Smash; scene uploaded to the archive",
  },
  [MID_IMAGE_KEYS.moveDelaware]: {
    tr: "Delaware Smash; arşive yüklenmiş sahne karesi",
    en: "Delaware Smash; scene uploaded to the archive",
  },
  [MID_IMAGE_KEYS.moveManchester]: {
    tr: "Manchester Smash; arşive yüklenmiş sahne karesi",
    en: "Manchester Smash; scene uploaded to the archive",
  },
  [MID_IMAGE_KEYS.moveStLouis]: {
    tr: "St. Louis Smash; arşive yüklenmiş sahne karesi",
    en: "St. Louis Smash; scene uploaded to the archive",
  },
  [MID_IMAGE_KEYS.vestiges]: {
    tr: "One For All'ın önceki sahipleri; arşive yüklenmiş sahne karesi",
    en: "The previous holders of One For All; scene uploaded to the archive",
  },
  [MID_IMAGE_KEYS.fateDiagnosis]: {
    tr: "Muayene odası ve röntgen; arşive yüklenmiş sahne karesi",
    en: "An examination room and an X-ray; scene uploaded to the archive",
  },
  [MID_IMAGE_KEYS.fateSludge]: {
    tr: "Yapışkan düşman olayı; arşive yüklenmiş sahne karesi",
    en: "The sludge villain incident; scene uploaded to the archive",
  },
  [MID_IMAGE_KEYS.fateBeach]: {
    tr: "Dagobah Plajı ve çöp yığınları; arşive yüklenmiş sahne karesi",
    en: "Dagobah Beach and the heaps of refuse; scene uploaded to the archive",
  },
  [MID_IMAGE_KEYS.fateSchool]: {
    tr: "U.A. Lisesi ve Sınıf 1-A; arşive yüklenmiş sahne karesi",
    en: "U.A. High School and Class 1-A; scene uploaded to the archive",
  },
  [MID_IMAGE_KEYS.fateBlackwhip]: {
    tr: "Koldan fırlayan Kara Kırbaç şeritleri; arşive yüklenmiş sahne karesi",
    en: "The Blackwhip bands bursting from an arm; scene uploaded to the archive",
  },
  [MID_IMAGE_KEYS.closing]: {
    tr: "Kapatılmış bir defter ve kalem; arşive yüklenmiş sahne karesi",
    en: "A closed notebook and a pencil; scene uploaded to the archive",
  },
};

/** Yuvaların önerilen piksel ölçüleri — `CuratorSlot size` propu. */
export const MID_SLOT_SIZES: Record<string, { w: number; h: number }> = {
  [MID_PORTRAIT_SLOT_KEY]: { w: 1200, h: 1600 },
  [MID_IMAGE_KEYS.hero]: { w: 1600, h: 900 },
  [MID_IMAGE_KEYS.notebook]: { w: 1000, h: 1000 },
  [MID_IMAGE_KEYS.oneForAll]: { w: 1200, h: 900 },
  [MID_IMAGE_KEYS.fullCowling]: { w: 1200, h: 900 },
  [MID_IMAGE_KEYS.shootStyle]: { w: 1200, h: 900 },
  [MID_IMAGE_KEYS.moveDetroit]: { w: 800, h: 800 },
  [MID_IMAGE_KEYS.moveDelaware]: { w: 800, h: 800 },
  [MID_IMAGE_KEYS.moveManchester]: { w: 800, h: 800 },
  [MID_IMAGE_KEYS.moveStLouis]: { w: 800, h: 800 },
  [MID_IMAGE_KEYS.vestiges]: { w: 1600, h: 900 },
  [MID_IMAGE_KEYS.fateDiagnosis]: { w: 1440, h: 810 },
  [MID_IMAGE_KEYS.fateSludge]: { w: 1440, h: 810 },
  [MID_IMAGE_KEYS.fateBeach]: { w: 1440, h: 810 },
  [MID_IMAGE_KEYS.fateSchool]: { w: 1440, h: 810 },
  [MID_IMAGE_KEYS.fateBlackwhip]: { w: 1440, h: 810 },
  [MID_IMAGE_KEYS.closing]: { w: 1600, h: 800 },
};

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const MID_IDENTITY = {
  name: "Izuku Midoriya",
  nativeName: "緑谷出久",
  /** Filigran — dekoratif (aria-hidden): 個性 = quirk */
  watermark: "個性",
  /**
   * Defterin kapağındaki başlık. Serideki adı 「未来へのヒーロー分析」
   * ("Gelecek için Kahraman Analizi") ve ilk bölümde yakılan cilt 13.
   * numaralı olan — kaynak: Boku no Hero Academia, 1. bölüm.
   */
  notebookTitle: "未来へのヒーロー分析",
  notebookVolume: "No. 13",
  house: {
    tr: "U.A. Lisesi · Sınıf 1-A · Hero adı: Deku",
    en: "U.A. High School · Class 1-A · hero name: Deku",
  },
  epigraph: {
    tr: "Quirk'siz doğdu ve elindeki tek alet bir defterdi. Kahramanları izledi, ölçtü, yazdı; kimse okumadı, kimse ciddiye almadı. Sonra dünyanın en güçlü quirk'i ona verildi ve o gücün ne olduğu ortaya çıktı: biriktirilmiş bir kayıt. Sekiz kişinin üst üste yazdığı tek bir defter.",
    en: "He was born quirkless and the only tool he had was a notebook. He watched heroes, measured them, wrote them down; nobody read it, nobody took it seriously. Then the world's strongest quirk was handed to him, and what that power actually is came out: an accumulated record. One notebook, written over by eight people in turn.",
  },
  facts: [
    {
      label: { tr: "Doğum günü", en: "Birthday" },
      value: { tr: "15 Temmuz", en: "15 July" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "166 cm", en: "166 cm" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "O", en: "O" },
    },
    {
      label: { tr: "Künyedeki yaş", en: "Age in the record" },
      value: { tr: "14-", en: "14-" },
    },
    {
      label: { tr: "Quirk", en: "Quirk" },
      value: {
        tr: "One For All — ワン・フォー・オール",
        en: "One For All — ワン・フォー・オール",
      },
    },
    {
      label: { tr: "Okul", en: "School" },
      value: {
        tr: "U.A. Lisesi · Sınıf 1-A",
        en: "U.A. High School · Class 1-A",
      },
    },
    {
      label: { tr: "Hero adı", en: "Hero name" },
      value: { tr: "Deku — デク", en: "Deku — デク" },
    },
    {
      label: { tr: "Kahraman sıralaması", en: "Hero ranking" },
      value: { tr: "künyede yok", en: "not in the record" },
    },
    {
      label: { tr: "Sembolik obje", en: "Symbolic object" },
      value: {
        tr: "analiz defteri — 未来へのヒーロー分析",
        en: "the analysis notebook — 未来へのヒーロー分析",
      },
    },
  ],
} as const;

export const MID_MISSING_NOTE: LocalizedText = {
  tr: "Künyede doğum YILI boş ve profesyonel bir kahraman sıralaması yok — ikisi de türetilmedi. Kader çizelgesi bu yüzden takvimle değil yaşla ve okul yılıyla ilerliyor.",
  en: "The record has no birth YEAR and no professional hero ranking — neither has been derived. That is why the fate chart runs on age and school year, not the calendar.",
};

export const MID_ALT = {
  companionSuffix: { tr: "portresi", en: "portrait" },
  portraitUploaded: {
    tr: "Izuku Midoriya — arşivin yüklediği portre",
    en: "Izuku Midoriya — portrait uploaded by the archive",
  },
  portraitLocal: {
    tr: "Izuku Midoriya — AniList resmî portresi (depodaki kopya, 230×345)",
    en: "Izuku Midoriya — official AniList portrait (repository copy, 230×345)",
  },
} as const;

export const MID_CRUMB = {
  series: { tr: "My Hero Academia", en: "My Hero Academia" },
} as const;

/* ── Mod düğmesi: Analiz ────────────────────────────────────────────────── */

/**
 * Düğme DÜZENİ değiştirmiyor — kenar sütunu, kareli zemin ve kartların
 * yerleşimi iki durumda da aynı. Değişen tek şey İÇERİK: kenar boşluğuna
 * el yazısı notlar, ok işaretleri ve ölçüm etiketleri ekleniyor.
 * (Dalga 1 dersi: kilitli ızgara VARSAYILAN durumda da görünmeli.)
 */
export const MID_ANALYSIS = {
  label: { tr: "Analiz", en: "Analysis" },
  native: "分析",
  on: { tr: "Defteri kapat", en: "Close the notebook" },
  off: { tr: "Defteri aç", en: "Open the notebook" },
  stateOn: { tr: "分析 ON — kenar notları açık", en: "分析 ON — margin notes open" },
  stateOff: { tr: "分析 OFF — kenar notları kapalı", en: "分析 OFF — margin notes closed" },
  hintOff: {
    tr: "Sayfa şu an temiz: kareli zemin, kenar çizgisi ve kartlar yerinde ama kimse üstüne yazmamış. Düğmeye bas — Midoriya'nın kendi kenar notları, ok işaretleri ve ölçüleri eklenecek. Düzen değişmeyecek, sadece sayfa dolacak.",
    en: "The page is clean right now: the ruled ground, the margin rule and the cards are all in place, but nobody has written on them. Press the button — Midoriya's own margin notes, arrows and measurements get added. The layout will not change; the page will only fill up.",
  },
  hintOn: {
    tr: "Defter açık. Her bölümün kenarında el yazısı bir not, çizilen bir ok ve bir ölçü var. Hiçbir kutu yer değiştirmedi: analiz bir düzen değil, bir KATMAN.",
    en: "The notebook is open. Every section now carries a handwritten note, a drawn arrow and a measurement in its margin. Not one box has moved: analysis is not a layout, it is a LAYER.",
  },
  note: {
    tr: "Bu düğme sayfanın tek durumu. Kapalıyken de ızgara, kenar çizgisi ve iki kolonluk asimetri yerinde duruyor — kapatmak sayfayı boş bir yığına çevirmiyor.",
    en: "This button is the page's only state. With it closed the grid, the margin rule and the asymmetric two columns all remain — closing it does not collapse the page into a plain stack.",
  },
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const MID_HERO = {
  lede: {
    tr: "Bu sayfa bir defter. Zemini kareli, sağ kenarında bir marj çizgisi var ve bütün bölümler o kağıda iğnelenmiş kartlar hâlinde duruyor. Sebebi basit: Midoriya'nın kahramanlığı bir güçle başlamadı, bir alışkanlıkla başladı — izlemek, ölçmek, yazmak. Quirk'siz geçen on dört yıl boyunca elinde yalnızca bu vardı ve devraldığı güç bile aynı biçimde çalışıyor: One For All bir yetenek değil, sekiz kişinin üst üste yazdığı bir birikim.",
    en: "This page is a notebook. Its ground is ruled into squares, a margin rule runs down its right-hand side, and every section sits on that paper as a pinned card. The reason is simple: Midoriya's heroism did not begin with a power, it began with a habit — watch, measure, write it down. For fourteen quirkless years that was all he had, and even the power he inherited works the same way: One For All is not a talent but an accumulation, written over by eight people in turn.",
  },
  heroFrameCaption: {
    tr: "Büyük kare küratör yuvası olarak bekliyor; portre defterin üstüne iliştirilmiş bir vesikalık boyunda duruyor, çünkü kaynaktaki dosya 230×345 — büyütülürse bozulur.",
    en: "The large plate waits as a curator slot; the portrait sits at the size of a photo clipped onto the page, because the source file is 230×345 and would break if enlarged.",
  },
  notebookCaption: {
    tr: "Defterin kapağındaki başlık ve cilt numarası seride geçtiği hâliyle yazıldı; kayıt dışına çıkan bir ayrıntı eklenmedi.",
    en: "The title and volume number on the notebook's cover are written as they appear in the series; no detail outside the record has been added.",
  },
} as const;

/* ── Bölüm başlıkları ───────────────────────────────────────────────────── */

export const MID_SECTIONS = {
  identity: {
    index: "01",
    tab: "記録",
    title: { tr: "Künye", en: "Dossier" },
    lede: {
      tr: "AniList kaydından birebir; boş olan alanlar boş bırakıldı.",
      en: "Verbatim from the AniList record; empty fields left empty.",
    },
  },
  quirk: {
    index: "02",
    tab: "個性",
    title: { tr: "Güç laboratuvarı", en: "The power lab" },
    lede: {
      tr: "Üç büyük kayıt ve dört Ultimate Move. Hepsi tek bir soruyu farklı yerden cevaplıyor: taşıyamadığın bir gücü nasıl kullanırsın?",
      en: "Three large entries and four Ultimate Moves. All of them answer one question from a different angle: how do you use a power your body cannot hold?",
    },
  },
  vestiges: {
    index: "03",
    tab: "継承",
    title: { tr: "Vestige'ler", en: "The vestiges" },
    lede: {
      tr: "One For All'ın sekiz önceki sahibi. Her seçtiğinde portrenin arkasında bir katman daha beliriyor ve devraldığın liste büyüyor — güç bir yetenek değil, üst üste binen bir kayıt.",
      en: "The eight who held One For All before him. Every one you select adds another layer behind the portrait and grows the inherited list — the power is not a talent but a record written over and over.",
    },
  },
  fate: {
    index: "04",
    tab: "経歴",
    title: { tr: "Beş durak", en: "Five stops" },
    lede: {
      tr: "Dördüncü yaşındaki tek cümlelik teşhisten, gücün içinden başka birinin sesinin çıktığı güne kadar.",
      en: "From a one-sentence diagnosis in his fourth year to the day another person's voice came out of the power.",
    },
  },
  bonds: {
    index: "05",
    tab: "関係",
    title: { tr: "Bağlar", en: "Bonds" },
    lede: {
      tr: "Ona gücü veren, onu iten, adını çeviren ve karşısına dikilen. Dördünün kendi dosyası var; beşincinin yok.",
      en: "The one who gave him the power, the one who pushed him, the one who redefined his name, and the one who stood against him. Four have their own file; the fifth does not.",
    },
  },
  closing: {
    index: "06",
    tab: "結",
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "Bir soru ve bir cevap. Aradaki her şey defterde yazılı.",
      en: "One question and one answer. Everything in between is written in the notebook.",
    },
  },
} as const;

/**
 * Kenar sütunundaki EL YAZISI notlar — yalnızca Analiz açıkken çiziliyor.
 * Metin, defterin sahibinin kendi kenar notu gibi kısa ve dolaysız.
 */
export const MID_MARGIN: Record<string, { hand: LocalizedText; measure: LocalizedText }> = {
  hero: {
    hand: {
      tr: "kapak: cilt 13. yakıldığında içindekiler kaybolmadı — yeniden yazıldı.",
      en: "cover: volume 13. when it burned the contents were not lost — they were rewritten.",
    },
    measure: { tr: "kaynak · 230×345 px", en: "source · 230×345 px" },
  },
  identity: {
    hand: {
      tr: "iki alan boş: doğum yılı ve sıralama. boş kalsın, uydurma.",
      en: "two fields blank: birth year and ranking. leave them blank, do not invent.",
    },
    measure: { tr: "166 cm · 0 kg kayıt yok", en: "166 cm · no weight on record" },
  },
  quirk: {
    hand: {
      tr: "yüzde yükseldikçe kırılan yer değişmiyor: hep kendi kemiği.",
      en: "as the percentage climbs the thing that breaks does not change: always his own bone.",
    },
    measure: { tr: "%5 → %20 → %100", en: "5% → 20% → 100%" },
  },
  vestiges: {
    hand: {
      tr: "sekiz siluet, beş adlı quirk, bir adsız, iki tane hiç. eksik olan da kayıt.",
      en: "eight silhouettes, five named quirks, one unnamed, two with none. the gap is also a record.",
    },
    measure: { tr: "8 katman · 5 ad", en: "8 layers · 5 names" },
  },
  fate: {
    hand: {
      tr: "hepsinde aynı hareket var: düşünmeden önce koşmuş.",
      en: "the same movement in all of them: he ran before he thought.",
    },
    measure: { tr: "4 yaş → 1. yıl", en: "age 4 → year one" },
  },
  bonds: {
    hand: {
      tr: "beşincinin dosyası yok. bağ yerine yalnız ad yazıldı.",
      en: "the fifth has no file. a name written instead of a link.",
    },
    measure: { tr: "4 bağ · 1 ad", en: "4 links · 1 name" },
  },
  closing: {
    hand: {
      tr: "soru dört yaşında soruldu, cevap on dördünde geldi. arada on yıl defter var.",
      en: "the question was asked at four, the answer came at fourteen. ten years of notebooks in between.",
    },
    measure: { tr: "2 replik · 1 slogan", en: "2 quotes · 1 motto" },
  },
};

/* ── Güç laboratuvarı: üç büyük kayıt ───────────────────────────────────── */

export interface MidPower {
  key: string;
  name: string;
  kana: string;
  turkish: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
  /** Analiz açıkken kartın altına düşen ölçüm etiketi */
  measure: LocalizedText;
  /** Analiz açıkken kartın kenarına düşen el yazısı */
  pencil: LocalizedText;
  imageKey: string;
}

export const MID_POWERS: MidPower[] = [
  {
    key: "ofa",
    name: "One For All",
    kana: "ワン・フォー・オール",
    turkish: { tr: "Devralınan güç", en: "The inherited power" },
    tagline: {
      tr: "Bir yetenek değil, elden ele geçen bir birikim.",
      en: "Not a talent but an accumulation passed hand to hand.",
    },
    text: {
      tr: "One For All tek bir quirk gibi görünüyor ama aslında iki quirk'in birleşmesinden doğdu ve o günden beri her sahibinde biraz daha büyüdü: taşıyan kişi gücü biriktiriyor, sonrakine devrediyor, sonraki onun üstüne kendi payını yazıyor. Midoriya dokuzuncu sahibi — yani eline geçen şey All Might'ın gücü değil, sekiz kişinin toplamı. Devrin yolu da olağandışı: güç, taşıyıcının DNA'sını taşıyan bir şeyin yutulmasıyla geçiyor. Midoriya'nın ilk gününde en zor kısım gücü kullanmak değil, o kadar büyük bir birikimi taşıyacak bir bedeni hiç olmamasıydı.",
      en: "One For All looks like a single quirk, but it was born from two quirks merging and has grown a little inside every holder since: the bearer stockpiles the power, hands it on, and the next writes their own share over it. Midoriya is the ninth holder — so what he received is not All Might's power but the sum of eight people. The manner of transfer is unusual too: the power passes when something carrying the holder's DNA is ingested. On Midoriya's first day the hard part was not using the power but that he had never had a body able to carry a stockpile that size.",
    },
    traits: [
      { tr: "Dokuzuncu sahibi", en: "The ninth holder" },
      { tr: "Devir DNA yoluyla", en: "Transfer by DNA" },
      { tr: "Her sahipte büyüyor", en: "Grows in every holder" },
    ],
    measure: { tr: "sahip 9/9 · sekizi kayıtta", en: "holder 9 of 9 · eight on record" },
    pencil: {
      tr: "gücü almak bir dakika sürdü. taşımayı öğrenmek yıllar.",
      en: "receiving it took a minute. learning to carry it took years.",
    },
    imageKey: MID_IMAGE_KEYS.oneForAll,
  },
  {
    key: "cowl",
    name: "Full Cowling",
    kana: "フルカウル",
    turkish: { tr: "Gücü gövdeye yayma", en: "Spreading the power over the body" },
    tagline: {
      tr: "Tek bir uzva %100 değil, bütün bedene ince bir yüzde.",
      en: "Not 100% into one limb but a thin percentage across the whole body.",
    },
    text: {
      tr: "İlk aylarda Midoriya gücü tek bir noktaya, çoğu zaman bir kola topluyordu; her vuruş bir kemik kırıyordu. Full Cowling bu hatanın düzeltilmesi: gücü gövdenin tamamına eşit ve DÜŞÜK bir yüzdeyle yayıyor. Kolun kırılmıyor, ama karşılığında tek bir darbede yıkıcı olmuyorsun — kazandığın şey hız, sıçrama ve dayanıklılık oluyor. Yüzde bir ayar düğmesi gibi çalışıyor: yüzde beşle başlıyor, ilerledikçe yükseliyor, yüzde yüzde yine aynı yere geliyorsun — kırılan şey her zaman kendi kemiğin.",
      en: "In the first months Midoriya gathered the power into a single point, usually one arm; every strike broke a bone. Full Cowling is the correction of that mistake: the power is spread evenly and at a LOW percentage across the whole body. Your arm stays whole, but in exchange no single blow is devastating any more — what you gain is speed, leaping and endurance. The percentage works like a dial: it starts at five, climbs as he does, and at a hundred you arrive back at the same place — the thing that breaks is always your own bone.",
    },
    traits: [
      { tr: "%5 ile başlıyor", en: "Begins at 5%" },
      { tr: "Hız ve sıçrama", en: "Speed and leaping" },
      { tr: "Bedel hâlâ kemik", en: "The price is still bone" },
    ],
    measure: { tr: "%5 · %20 · %100", en: "5% · 20% · 100%" },
    pencil: {
      tr: "yayarsan kırılmıyorsun. yaymazsan kazanamıyorsun. ikisi de doğru.",
      en: "spread it and you do not break. do not spread it and you do not win. both are true.",
    },
    imageKey: MID_IMAGE_KEYS.fullCowling,
  },
  {
    key: "shoot",
    name: "Shoot Style",
    kana: "シュートスタイル",
    turkish: { tr: "Tekmeye dayalı dövüş", en: "A kicking style" },
    tagline: {
      tr: "Kolları harcandığı için ağırlık bacaklara geçti.",
      en: "The arms were spent, so the weight moved to the legs.",
    },
    text: {
      tr: "Sürekli kırılan parmaklar ve kollar bir noktadan sonra kalıcı hasara döndü: sinir yolları zarar gördü ve doktorun cümlesi netti — aynı hızda devam ederse elleri işe yaramaz hâle gelecekti. Midoriya'nın cevabı gücü azaltmak olmadı, GÖVDEYİ değiştirmek oldu. Vuruşların çoğunu bacaklara taşıdı; kollar tutmak, savurmak ve yön vermek için kaldı. Bu kartın asıl anlamı teknik değil: sayfadaki her şeyin özeti burada — kaybettiği aleti değiştirerek devam ediyor, tıpkı quirk'siz geçen yıllarda defterle devam ettiği gibi.",
      en: "Fingers and arms that broke again and again eventually turned into permanent damage: the nerve pathways were harmed and the doctor's sentence was plain — at that rate his hands would stop working. Midoriya's answer was not to use less power but to change the BODY doing the work. He moved most of his striking to his legs; the arms were left for holding, throwing and steering. The real meaning of this card is not technical: it is the summary of the whole page — he goes on by changing the tool he lost, exactly as he went on with a notebook through the quirkless years.",
    },
    traits: [
      { tr: "Kalıcı el hasarı", en: "Permanent damage to the hands" },
      { tr: "Vuruş bacaklara geçti", en: "Striking moved to the legs" },
      { tr: "Alet değişti, iş değişmedi", en: "The tool changed, the work did not" },
    ],
    measure: { tr: "kol → bacak · aynı %", en: "arm → leg · same %" },
    pencil: {
      tr: "aleti kaybettiğinde işi bırakmıyor. sadece başka bir aletle yazıyor.",
      en: "when he loses the tool he does not stop the work. he writes with another one.",
    },
    imageKey: MID_IMAGE_KEYS.shootStyle,
  },
];

/* ── Güç laboratuvarı: dört Ultimate Move ───────────────────────────────── */

export interface MidMove {
  key: string;
  name: string;
  kana: string;
  note: LocalizedText;
  measure: LocalizedText;
  imageKey: string;
}

/**
 * Ultimate Move adlarının hepsi Amerikan yer adlarından türüyor — All
 * Might'ın kendi adlandırma alışkanlığı ve Midoriya onu da devraldı.
 * Dördü de seride geçen adlar; uydurma bir "Smash" eklenmedi.
 */
export const MID_MOVES: MidMove[] = [
  {
    key: "detroit",
    name: "Detroit Smash",
    kana: "デトロイトスマッシュ",
    note: {
      tr: "All Might'ın imza vuruşu; yukarı doğru bir yumruk ve arkasından gelen hava. Midoriya'nın ilk kez kendi iradesiyle kullandığı ad da bu — devraldığı yalnızca güç değil, sözlük.",
      en: "All Might's signature blow; an upward punch and the air that follows it. It is also the first name Midoriya used by his own will — what he inherited is not only the power but the vocabulary.",
    },
    measure: { tr: "yumruk · yukarı", en: "punch · upward" },
    imageKey: MID_IMAGE_KEYS.moveDetroit,
  },
  {
    key: "delaware",
    name: "Delaware Smash",
    kana: "デラウェアスマッシュ",
    note: {
      tr: "Tek parmakla atılan fiske. Bütün gövdeyi riske atmadan gücün küçük bir payını fırlatmanın yolu — bedeli o parmağın kırılması. Midoriya'nın en çok kullandığı hesap kısıtlı kaynak hesabı: elinde kaç parmak varsa o kadar hamlesi var.",
      en: "A flick thrown with a single finger. It is the way to launch a small share of the power without risking the whole body — the price is that finger. The arithmetic Midoriya uses most is the arithmetic of a limited resource: he has as many moves as he has fingers.",
    },
    measure: { tr: "parmak · 1", en: "finger · 1" },
    imageKey: MID_IMAGE_KEYS.moveDelaware,
  },
  {
    key: "manchester",
    name: "Manchester Smash",
    kana: "マンチェスタースマッシュ",
    note: {
      tr: "Havadan inen balta tekme. Yer değil YÜKSEKLİK kullanan ilk hamlesi: kendisinden büyük ve daha güçlü birinin karşısında tek avantajı, düşme yönünü seçebilmek.",
      en: "An axe kick coming down out of the air. His first move that uses HEIGHT rather than the ground: against someone larger and stronger, his one advantage is being able to choose the direction he falls from.",
    },
    measure: { tr: "havadan · aşağı", en: "airborne · downward" },
    imageKey: MID_IMAGE_KEYS.moveManchester,
  },
  {
    key: "stlouis",
    name: "St. Louis Smash",
    kana: "セントルイススマッシュ",
    note: {
      tr: "Shoot Style'ın düz tekmesi; yandan gelir ve kolları hiç kullanmaz. Ad ailesinin devam etmesi tesadüf değil: gövde değişse de defterin başlığı aynı kalıyor.",
      en: "The straight kick of Shoot Style; it comes in from the side and uses no arms at all. That the family of names continues is not accidental: the body changed but the notebook keeps its title.",
    },
    measure: { tr: "tekme · yandan", en: "kick · lateral" },
    imageKey: MID_IMAGE_KEYS.moveStLouis,
  },
];

/* ── Vestige'ler: sayfanın kalbi ────────────────────────────────────────── */

/**
 * One For All'ın sekiz önceki sahibi.
 *
 * ⚠️ KAYIT DÜRÜSTLÜĞÜ: sekiz sahibin BEŞİNİN quirk adı seride geçiyor
 * (二代目 発勁, 四代目 危険感知, 五代目 黒鞭, 六代目 煙幕, 七代目 浮遊).
 * Üçüncü sahibin quirk'i hiç adlandırılmadı; birinci ve sekizinci sahip
 * ise devralınacak ikinci bir quirk taşımıyor. Uydurulmadı — mekanikte de
 * bu asimetri var: sekiz katman, beş ad.
 *
 * `silhouette` alanı elle çizilen siluetin biçim numarası (0–7):
 * boy, omuz genişliği ve etek payı ondan geliyor. Portre DEĞİL — yüz yok.
 */
export interface MidVestige {
  key: string;
  /** 一代目 … 八代目 */
  ordinal: string;
  order: number;
  name: string;
  /** Devralınabilir quirk'in adı — yoksa null */
  quirk: { name: string; kanji: string } | null;
  role: LocalizedText;
  note: LocalizedText;
  silhouette: number;
}

export const MID_VESTIGES: MidVestige[] = [
  {
    key: "first",
    ordinal: "一代目",
    order: 1,
    name: "Yoichi Shigaraki",
    quirk: null,
    role: { tr: "İlk sahip", en: "The first holder" },
    note: {
      tr: "Kardeşi ona kullanamayacağı bir gücü zorla verdi; onun kendi quirk'i ise gücü başkasına geçirebilmekti. İki quirk birleşti ve One For All doğdu. Yani bu zincir bir armağanla değil, reddedilemeyen bir dayatmayla başlıyor.",
      en: "His brother forced on him a power he could not use; his own quirk was the ability to pass a power to someone else. The two merged and One For All was born. So this chain does not begin with a gift but with an imposition that could not be refused.",
    },
    silhouette: 0,
  },
  {
    key: "second",
    ordinal: "二代目",
    order: 2,
    name: "Kudō",
    quirk: { name: "Fa Jin", kanji: "発勁" },
    role: { tr: "İkinci sahip", en: "The second holder" },
    note: {
      tr: "Biriktirilen kinetik enerjiyi tek seferde salan quirk. Midoriya'nın elindeki en \"defter\" quirk bu: önce tekrarla biriktiriyorsun, sonra doğru anda harcıyorsun. Hazırlık olmadan hiçbir işe yaramıyor.",
      en: "A quirk that stores kinetic energy and releases it in one go. It is the most \"notebook\" of the quirks he holds: first you accumulate by repetition, then you spend at the right moment. Without preparation it does nothing at all.",
    },
    silhouette: 1,
  },
  {
    key: "third",
    ordinal: "三代目",
    order: 3,
    name: "Bruce",
    quirk: null,
    role: { tr: "Üçüncü sahip", en: "The third holder" },
    note: {
      tr: "Kayıttaki boşluk. Quirk'inin adı seride hiç geçmiyor ve bu sayfa da bir ad uydurmuyor. Bir arşivde en zor duran satır budur: bilinmiyor yazıp geçmek.",
      en: "The gap in the record. His quirk is never named in the series, and this page does not invent one. That is the hardest line to leave standing in an archive: writing “unknown” and moving on.",
    },
    silhouette: 2,
  },
  {
    key: "fourth",
    ordinal: "四代目",
    order: 4,
    name: "Hikage Shinomori",
    quirk: { name: "Danger Sense", kanji: "危険感知" },
    role: { tr: "Dördüncü sahip", en: "The fourth holder" },
    note: {
      tr: "Yaklaşan tehlikeyi bedende bir uyarı olarak hissettiren quirk. Sekizi arasında gücü en uzun süre taşıyan kişi de o — ve tam bu yüzden en erken tükenen. Biriken güç taşıyanı da yiyor: One For All'ın büyümesi bedava değil.",
      en: "A quirk that registers approaching danger as a warning in the body. He is also the one who carried the power longest of the eight — and precisely for that reason the one it consumed soonest. The accumulation eats its bearer too: One For All does not grow for free.",
    },
    silhouette: 3,
  },
  {
    key: "fifth",
    ordinal: "五代目",
    order: 5,
    name: "Daigorō Banjō",
    quirk: { name: "Blackwhip", kanji: "黒鞭" },
    role: { tr: "Beşinci sahip", en: "The fifth holder" },
    note: {
      tr: "Koldan fırlayan, tutan ve çeken karanlık şeritler. Midoriya'da kendiliğinden uyanan ilk devralınmış quirk bu oldu ve kontrolsüz çıktı — çünkü ilk defa güç ona ait bir şey değildi, BAŞKASININ sesi de birlikte geldi.",
      en: "Dark bands that burst from the arm to catch and pull. It was the first inherited quirk to wake in Midoriya on its own, and it came out uncontrolled — because for the first time the power was not his alone: someone else's voice arrived with it.",
    },
    silhouette: 4,
  },
  {
    key: "sixth",
    ordinal: "六代目",
    order: 6,
    name: "En",
    quirk: { name: "Smokescreen", kanji: "煙幕" },
    role: { tr: "Altıncı sahip", en: "The sixth holder" },
    note: {
      tr: "Görüşü kapatan yoğun duman. Sekiz quirk'in en gösterişsizi ve tam da bu yüzden en Midoriya'ya benzeyeni: vurmak için değil, ZAMAN kazanmak için. Bir analistin en çok ihtiyaç duyduğu şey birkaç saniyedir.",
      en: "A dense smoke that closes off sight. The least showy of the eight quirks, and exactly for that reason the most like Midoriya: not for hitting but for buying TIME. What an analyst needs most is a few seconds.",
    },
    silhouette: 5,
  },
  {
    key: "seventh",
    ordinal: "七代目",
    order: 7,
    name: "Nana Shimura",
    quirk: { name: "Float", kanji: "浮遊" },
    role: { tr: "Yedinci sahip", en: "The seventh holder" },
    note: {
      tr: "Havada durabilme. All Might'ın ustası ve gücü ona veren kişi. Sekiz siluet arasında zincirin insani tarafını en açık taşıyan o: devraldığı öğrencisi, kaybettiği ailesi ve bu sayfanın son bölümündeki düşman aynı hikâyenin üç ucu.",
      en: "The ability to hold still in the air. All Might's mentor and the person who gave him the power. Of the eight silhouettes she carries the human side of the chain most plainly: the student she handed it to, the family she lost and the enemy in this page's last section are three ends of one story.",
    },
    silhouette: 6,
  },
  {
    key: "eighth",
    ordinal: "八代目",
    order: 8,
    name: "Toshinori Yagi — All Might",
    quirk: null,
    role: { tr: "Sekizinci sahip", en: "The eighth holder" },
    note: {
      tr: "Doğuştan quirk'siz olan ikinci sahip — birincisi de öyleydi, dokuzuncusu da. Barışın Sembolü olarak taşıdığı yükü bırakırken gücü kendisine en çok benzeyen kişiye verdi: kimsenin seçmeyeceği çocuğa. Bu sayfadaki bütün devir fikri onun tek cümlesinden çıkıyor.",
      en: "The second holder born quirkless — so was the first, and so is the ninth. When he set down the weight he carried as the Symbol of Peace he gave the power to the person most like himself: the boy nobody would have chosen. Every idea of inheritance on this page comes out of one sentence of his.",
    },
    silhouette: 7,
  },
];

export const MID_VESTIGE_UI = {
  stageLabel: {
    tr: "Portrenin arkasında biriken vestige katmanları",
    en: "The vestige layers accumulating behind the portrait",
  },
  listLabel: { tr: "Sekiz önceki sahip", en: "The eight previous holders" },
  layersLabel: { tr: "Katman", en: "Layers" },
  namedLabel: { tr: "Adı geçen quirk", en: "Named quirks" },
  inheritedTitle: { tr: "Devralınan", en: "Inherited" },
  emptyInherited: {
    tr: "Henüz hiçbir katman yok. Sağdaki sekiz isimden birine bas: silueti portrenin arkasına biner ve varsa quirk'i bu listeye düşer.",
    en: "No layers yet. Press one of the eight names: its silhouette settles behind the portrait and, where there is one, its quirk drops into this list.",
  },
  unnamedQuirk: { tr: "quirk adı kayıtta yok", en: "quirk not named in the record" },
  noQuirk: { tr: "devralınacak ikinci quirk yok", en: "no second quirk to inherit" },
  selectAll: { tr: "Sekizini de yığ", en: "Stack all eight" },
  clear: { tr: "Katmanları kaldır", en: "Remove the layers" },
  status: { tr: "katman yığıldı", en: "layers stacked" },
  fullLine: {
    tr: "Sekizi de üst üste. Portrenin arkasında duran şey artık bir kişi değil bir SIRA — ve dokuzuncusu önde duruyor.",
    en: "All eight, one over the other. What stands behind the portrait is no longer a person but a LINE — and the ninth stands in front of it.",
  },
  keyboardHint: {
    tr: "Sekiz sahip de sekmeyle geziliyor; her biri açılıp kapanan gerçek bir düğme. Katmanlar eklenir ve geri alınabilir.",
    en: "All eight holders are reachable by tab; each is a real toggle button. Layers are added and can be taken back.",
  },
  note: {
    tr: "Katmanlar birikiyor, soyulmuyor: bir sahibi kaldırdığında yalnızca onun katmanı gidiyor, sıradaki hiçbir şey değişmiyor. One For All da böyle çalışıyor — üstüne yazılan bir defter, çevrilen bir sayfa değil.",
    en: "The layers accumulate rather than peel: removing one holder removes only that layer and changes nothing else in the line. One For All works the same way — a notebook written over, not a page turned.",
  },
} as const;

/* ── Beş durak ──────────────────────────────────────────────────────────── */

export interface MidFate {
  key: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: string; reading: LocalizedText; by: LocalizedText };
  measure: LocalizedText;
  pencil: LocalizedText;
  imageKey: string;
}

export const MID_TIMELINE: MidFate[] = [
  {
    key: "diagnosis",
    age: { tr: "4 yaş", en: "age four" },
    title: { tr: "Teşhis", en: "The diagnosis" },
    text: {
      tr: "Bu dünyada çocukların neredeyse tamamı dört yaşına gelmeden bir quirk gösteriyor. Midoriya göstermedi. Doktorun kanıtı bir röntgendi: ayak parmağındaki fazladan eklem, quirk taşımayan bir bedenin işareti sayılıyor. Tek cümlelik bir cevaptı ve bir çocuğun bütün geleceğini kapatıyordu. O gün kapanan kapı, sayfadaki defterin neden var olduğunu açıklıyor — elinde başka hiçbir alet kalmamıştı.",
      en: "In this world almost every child shows a quirk before the age of four. Midoriya did not. The doctor's evidence was an X-ray: the extra joint in the little toe, taken as the mark of a body that carries no quirk. It was a one-sentence answer and it closed off a child's entire future. The door that shut that day explains why the notebook on this page exists at all — he had no other tool left.",
    },
    measure: { tr: "quirk · 0", en: "quirk · 0" },
    pencil: {
      tr: "kanıt bir röntgen. karar bir cümle. itiraz yok.",
      en: "the evidence an x-ray. the verdict a sentence. no appeal.",
    },
    imageKey: MID_IMAGE_KEYS.fateDiagnosis,
  },
  {
    key: "sludge",
    age: { tr: "14 yaş", en: "age fourteen" },
    title: { tr: "Yapışkan düşman", en: "The sludge villain" },
    text: {
      tr: "Ortaokulun son yılında, kalabalığın ve profesyonel kahramanların hiçbir şey yapamadığı bir olayda, quirk'siz bir çocuk koşarak öne çıktı. Kurtarmaya çalıştığı kişi onu yıllardır aşağılayan çocuktu; elinde bir plan da yoktu. Sonradan bunu açıklarken tek söylediği, bedeninin kendiliğinden hareket ettiğiydi. All Might'ın onu seçmesinin sebebi gücü değil, tam olarak bu cümle: bir kahramanın hesap yapmadan önce hareket etmesi.",
      en: "In his last year of middle school, in an incident where neither the crowd nor the professional heroes could do anything, a quirkless boy ran forward. The person he was trying to save was the boy who had belittled him for years; he had no plan either. Explaining it afterwards, all he could say was that his body had moved on its own. What made All Might choose him was not power but exactly that sentence: a hero moving before doing the arithmetic.",
    },
    quote: {
      /* Boku no Hero Academia, 1. bölüm — Midoriya'nın All Might'a sorduğu
         soru ve All Might'ın günün sonundaki cevabı. */
      text: "君はヒーローになれる",
      reading: {
        tr: "«Sen bir kahraman olabilirsin.»",
        en: "“You can become a hero.”",
      },
      by: {
        tr: "All Might — o günün sonunda, Midoriya'ya",
        en: "All Might — to Midoriya, at the end of that day",
      },
    },
    measure: { tr: "plan · yok", en: "plan · none" },
    pencil: {
      tr: "düşünmeden koşmuş. bütün dosyanın tek satırlık özeti bu.",
      en: "ran without thinking. that is the whole file in one line.",
    },
    imageKey: MID_IMAGE_KEYS.fateSludge,
  },
  {
    key: "beach",
    age: { tr: "14 yaş · on ay", en: "age fourteen · ten months" },
    title: { tr: "Dagobah Plajı", en: "Dagobah Beach" },
    text: {
      tr: "One For All hemen verilmedi. Önce onu taşıyabilecek bir beden gerekiyordu ve eğitim yeri yıllardır çöp yığılan bir sahildi: on ay boyunca her sabah oradaki hurdayı taşıdı. Bu bölüm sayfadaki en sessiz bölüm ama en belirleyici olanı — devralınan güç bir hediye değil, önceden ödenmiş bir bedelin karşılığı. Kum ortaya çıktığında güç el değiştirdi.",
      en: "One For All was not handed over at once. First a body able to carry it was needed, and the training ground was a shore where refuse had been piling up for years: for ten months he hauled that scrap away every morning. This is the quietest stop on the page and the decisive one — the inherited power is not a gift but the return on a price already paid. When the sand came back into view, the power changed hands.",
    },
    measure: { tr: "on ay · bir sahil", en: "ten months · one shore" },
    pencil: {
      tr: "gücü kazanmadan önce taşıyacak bedeni kazandı. sıra doğru.",
      en: "he earned the body before he earned the power. the order is correct.",
    },
    imageKey: MID_IMAGE_KEYS.fateBeach,
  },
  {
    key: "ua",
    age: { tr: "15 yaş · U.A. birinci yıl", en: "age fifteen · first year at U.A." },
    title: { tr: "U.A. ve Sınıf 1-A", en: "U.A. and Class 1-A" },
    text: {
      tr: "Giriş sınavını kazandığı hamle bir puan hamlesi değildi: sıralamada geride kalmayı göze alıp altta kalan birini kurtardı ve okula tam olarak bu yüzden alındı. Sınıf 1-A'da güç en alt sırada, hazırlık en üst sırada olan öğrenci oldu — dövüşleri kazandığı yer çoğu zaman kolu değil, karşısındakinin quirk'i hakkında önceden yazdığı sayfa. Kırılan parmaklar da bu dönemin kaydı: hesap doğruydu, beden değildi.",
      en: "The move that won him the entrance exam was not a scoring move: he accepted falling behind in the ranking in order to pull someone out, and that is exactly why he was admitted. In Class 1-A he became the student lowest in raw power and highest in preparation — the place he won his fights was usually not his arm but the page he had written earlier about his opponent's quirk. The broken fingers are the record of this period too: the arithmetic was right, the body was not.",
    },
    quote: {
      /* Replik değil, U.A. Lisesi'nin sloganı — kişiye ait değil. */
      text: "プルス・ウルトラ",
      reading: {
        tr: "«Plus Ultra» — okulun bağırışı: daha ötesine.",
        en: "“Plus Ultra” — the school's cry: beyond, further.",
      },
      by: {
        tr: "U.A. Lisesi'nin sloganı",
        en: "The motto of U.A. High School",
      },
    },
    measure: { tr: "1-A · hazırlık 1.", en: "1-A · first in preparation" },
    pencil: {
      tr: "en zayıf quirk, en kalın defter. sınıfın dengesi böyle kuruldu.",
      en: "weakest quirk, thickest notebook. that is how the class balanced out.",
    },
    imageKey: MID_IMAGE_KEYS.fateSchool,
  },
  {
    key: "blackwhip",
    age: { tr: "15 yaş · birinci yılın sonrası", en: "age fifteen · after the first year" },
    title: { tr: "Gücün içinden çıkan ses", en: "The voice inside the power" },
    text: {
      tr: "Bir gün One For All beklenmedik bir şey yaptı: kolundan karanlık şeritler fırladı ve Midoriya onları durduramadı. O quirk ona ait değildi — beşinci sahibinden geliyordu. Arkasından ötekiler de göründü. Devraldığı şeyin bir kuvvet değil bir TOPLULUK olduğu bu noktada anlaşıldı ve sayfanın kalbindeki mekanik tam olarak bunu gösteriyor: portrenin arkasında biriken sekiz katman. O günden sonra Midoriya'nın işi güçlenmek değil, sekiz kişinin bıraktığı kaydı okumak oldu.",
      en: "One day One For All did something unexpected: dark bands burst from his arm and he could not stop them. That quirk was not his — it came from the fifth holder. The others surfaced after it. This is where it becomes clear that what he inherited is not a force but a COMPANY, and the mechanic at the heart of this page shows exactly that: eight layers accumulating behind the portrait. From that day Midoriya's work was no longer to get stronger but to read the record eight people had left him.",
    },
    measure: { tr: "sahip 9 · ses 8", en: "holder 9 · voices 8" },
    pencil: {
      tr: "güç konuşmaya başladığında analiz artık bir alışkanlık değil, zorunluluk.",
      en: "once the power started speaking, analysis stopped being a habit and became a requirement.",
    },
    imageKey: MID_IMAGE_KEYS.fateBlackwhip,
  },
];

/* ── Bağlar ─────────────────────────────────────────────────────────────── */

export interface MidBond {
  characterId: number;
  name: string;
  nativeName: string;
  role: LocalizedText;
  note: LocalizedText;
}

/**
 * ⚠️ Portresi çizilen HER kimlik `EXPERIENCE_COMPANIONS[89028]` listesinde
 * olmak zorunda (Dalga 1 dersi: Armin sayfası Levi'yi çiziyordu ama liste
 * onu taşımıyordu, yani kadraj sonsuza kadar boş kalacaktı). Bu beşi
 * merkezdeki listede DOĞRULANDI: [89224, 88892, 89220, 89221, 89226].
 *
 * Beşincinin (Tomura Shigaraki #89226) kendi sayfası yok —
 * `isExperienceCharacter` false döner ve bağ verilmez, yalnız ad yazılır.
 */
export const MID_BONDS: MidBond[] = [
  {
    characterId: 89224,
    name: "Toshinori Yagi — All Might",
    nativeName: "八木俊典",
    role: { tr: "Sekizinci sahip · ustası", en: "The eighth holder · his mentor" },
    note: {
      tr: "Gücü ona veren kişi ve sayfanın karşılıklı tek bağı: Midoriya'nın dosyası All Might olmadan, All Might'ın dosyası Midoriya olmadan tamamlanmıyor. Devir bir tören değildi — on ay çöp taşındıktan sonra, bir sahilde gerçekleşti.",
      en: "The person who gave him the power, and the page's one two-way bond: Midoriya's file is incomplete without All Might, and All Might's without Midoriya. The handover was not a ceremony — it happened on a shore, after ten months of hauling refuse.",
    },
  },
  {
    characterId: 88892,
    name: "Katsuki Bakugō",
    nativeName: "爆豪勝己",
    role: { tr: "Rakibi", en: "His rival" },
    note: {
      tr: "Çocukken ona \"Deku\" diyen ve o adı bir hakaret olarak kullanan kişi. Sayfanın ilk durağındaki teşhisin bedelini Midoriya'ya yıllarca ödeten de o oldu; ikinci durakta kurtarmak için koştuğu kişi de. İkisi arasındaki mesafe hiç kapanmadı, yalnızca yön değiştirdi.",
      en: "The boy who called him “Deku” as a child and used the name as an insult. He is the one who made Midoriya pay for the first stop's diagnosis for years — and the one Midoriya ran to save at the second stop. The distance between them never closed; it only changed direction.",
    },
  },
  {
    characterId: 89221,
    name: "Ochako Uraraka",
    nativeName: "麗日お茶子",
    role: { tr: "Sınıf arkadaşı", en: "His classmate" },
    note: {
      tr: "\"Deku\" adını tersine çeviren kişi. Aynı hece Bakugō'nun ağzında \"işe yaramaz\" demekti; Uraraka onu bir cesaretlendirme gibi duyduğunu söyleyince Midoriya adı hero adı olarak seçti. Sayfadaki tek gerçek dönüşüm bu: kelime değişmedi, okuyan değişti.",
      en: "The person who turned the name “Deku” inside out. The same syllables meant “useless” in Bakugō's mouth; when Uraraka said she heard them as encouragement, Midoriya took the name as his hero name. It is the only real transformation on this page: the word did not change, the reader did.",
    },
  },
  {
    characterId: 89220,
    name: "Shōto Todoroki",
    nativeName: "轟焦凍",
    role: { tr: "Sınıf arkadaşı", en: "His classmate" },
    note: {
      tr: "Sınıf 1-A'nın en güçlü öğrencisi ve Midoriya'nın analiz alışkanlığının en görünür sonucu: onu yenmek için değil, gücünün yarısını neden kullanmadığını sormak için hazırlandı. Kazanmayı hedeflemeyen tek dövüşü.",
      en: "The strongest student in Class 1-A and the clearest result of Midoriya's habit of analysis: he prepared not to beat him but to ask why he refused to use half his power. The only fight in which winning was not the goal.",
    },
  },
  {
    characterId: 89226,
    name: "Tomura Shigaraki",
    nativeName: "死柄木弔",
    role: { tr: "Karşısındaki", en: "The one against him" },
    note: {
      tr: "Sayfanın karşı ucu. Midoriya devralınan bir gücün dokuzuncu halkası; karşısındaki de bir devrin ürünü ve yedinci sahiple aile bağı taşıyor. Arşivde kendi dosyası yok, o yüzden burada yalnızca adı yazılı — bağ verilmedi.",
      en: "The far end of the page. Midoriya is the ninth link of an inherited power; the one facing him is the product of an inheritance too, and carries a family tie to the seventh holder. He has no file of his own in the archive, so only his name stands here — no link was made.",
    },
  },
];

export const MID_BOND_UI = {
  hasPage: { tr: "dosyası var", en: "has a file" },
  noPage: { tr: "dosyası yok", en: "no file" },
} as const;

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const MID_CLOSING = {
  quotes: [
    {
      /* Boku no Hero Academia, 1. bölüm — Midoriya'nın All Might'a sorduğu
         soru. Sayfada tırnağa alınan iki Japonca cümleden ilki. */
      text: "無個性でも、ヒーローになれますか",
      reading: {
        tr: "«Quirk'im olmasa bile bir kahraman olabilir miyim?»",
        en: "“Even without a quirk, can I become a hero?”",
      },
      by: { tr: "Izuku Midoriya", en: "Izuku Midoriya" },
      note: {
        tr: "İlk bölümde, hayatı boyunca ilk kez cevap verebilecek birine sorulmuş soru. Dikkat: soru \"güçlü olabilir miyim\" değil. Ölçü baştan doğru seçilmiş.",
        en: "Asked in the first chapter, for the first time in his life to someone who could actually answer. Note that the question is not “can I be strong”. The measure was chosen correctly from the start.",
      },
    },
    {
      text: "君はヒーローになれる",
      reading: {
        tr: "«Sen bir kahraman olabilirsin.»",
        en: "“You can become a hero.”",
      },
      by: { tr: "All Might", en: "All Might" },
      note: {
        tr: "Aynı günün sonundaki cevap. Bu sayfadaki her bölüm o iki cümlenin arasına giriyor: teşhis, defterler, sahil, sınıf ve arkada biriken sekiz katman.",
        en: "The answer at the end of the same day. Every section on this page fits between those two sentences: the diagnosis, the notebooks, the shore, the classroom and the eight layers stacking up behind him.",
      },
    },
  ],
  motto: "デク",
  mottoNote: {
    tr: "Deku. Kökeni 木偶 — \"kukla, işe yaramaz\"; Bakugō'nun ağzında yıllarca tam bu anlamda kullanıldı. Uraraka aynı heceleri bir cesaretlendirme gibi duyduğunu söylediğinde Midoriya adı reddetmedi, hero adı olarak seçti. Sayfanın filigranı 個性 (quirk) ama motto bu: bir kelimenin anlamını değiştirmenin yolu onu bırakmak değil, üstüne yazmak.",
    en: "Deku. Its root is 木偶 — “puppet, useless thing”; in Bakugō's mouth it carried exactly that meaning for years. When Uraraka said she heard the same syllables as encouragement, Midoriya did not refuse the name — he took it as his hero name. The page's watermark is 個性 (quirk), but this is the motto: the way to change what a word means is not to drop it but to write over it.",
  },
  credit: {
    tr: "Künye, portre, doğum, boy, kan grubu ve ad bilgileri AniList'ten; portre dosyası depoya indirildi (hotlink yok). Sayfadaki bütün grafikler — kareli zemin, kenar çizgisi, şimşek işaretleri, ok ve alt çizgiler ve sekiz vestige silueti — elle çizilmiş SVG ya da CSS.",
    en: "Dossier, portrait, birth, height, blood type and name data from AniList; the portrait file was downloaded into the repository (no hotlinking). Every graphic on this page — the ruled ground, the margin rule, the lightning marks, the arrows and underlines, and the eight vestige silhouettes — is hand-drawn SVG or CSS.",
  },
  creditLink: {
    tr: "AniList · Izuku Midoriya #89028",
    en: "AniList · Izuku Midoriya #89028",
  },
  creditNote: {
    tr: "Vestige adları, devralınan quirk adları ve Ultimate Move adları serinin kendi terminolojisinden; adı seride geçmeyen hiçbir quirk uydurulmadı (üçüncü sahibin quirk'i \"kayıtta yok\" olarak duruyor).",
    en: "The vestige names, the inherited quirk names and the Ultimate Move names come from the series' own terminology; no quirk that the series does not name has been invented (the third holder's quirk stands as “not in the record”).",
  },
} as const;

/* ── Küratör boşluk özeti ───────────────────────────────────────────────── */

export const MID_GAPS = {
  title: {
    tr: "Izuku Midoriya — görsel yuvaları",
    en: "Izuku Midoriya — image slots",
  },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bütün yuvalar dolu. Sayfada eksik kadraj kalmadı.",
    en: "Every slot is filled. No frame on this page is missing.",
  },
} as const;
