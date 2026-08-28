import type { SlotRatio, SlotTreatment } from "@/lib/curated/contract";
import { BANKAI_HALL } from "./bankai";
import { DIVISIONS, hasSecondCaptain } from "./divisions";
import { ESPADA } from "./espada";
import type { BleachSlotWorld, Localized } from "./types";

/**
 * BLEACH EVRENİ — KÜRATÖR YUVA MANİFESTOSU.
 *
 * Sayfadaki HER görsel alanı burada tanımlı. Çıplak `<Image>` kullanılmıyor;
 * her kadraj `<CuratedImage slotId="…" />` üzerinden çiziliyor ve küratör
 * modunda tek tek düzenlenebiliyor (kullanıcı komutu, 23 Ağustos 2026).
 *
 * ── MANİFESTO NE İŞE YARIYOR ─────────────────────────────────────────────
 * İki iş birden:
 *   1. ÇİZİM — `CuratedImage` yuvanın oranını, dünyasını, işlem biçimini ve
 *      görsel yokken ne çizeceğini buradan okuyor.
 *   2. EKSİK GÖRSELLER PANELİ — küratör "hangi fotoğrafı bulmam gerek"
 *      sorusunu tek ekrandan cevaplıyor: bölüm, önerilen boyut, oran ve
 *      kadraj notu her satırda yazılı.
 *
 * ── ⚠️ KİMLİK DEĞİŞTİRME ─────────────────────────────────────────────────
 * `id` veritabanındaki satırın anahtarı (`CuratedImage.slotId`). Yeniden
 * adlandırmak küratörün o yuvaya yüklediği kareyi KOPARIR. Yuva artık
 * kullanılmıyorsa kimliği bırak, listeden çıkar — kayıt yetim kalır ama
 * hiçbir şey kırılmaz.
 *
 * ── BÖLÜMLER KENDİ YUVALARINI EKLER ──────────────────────────────────────
 * Aşağıdaki liste altyapı turunda (23 Ağustos 2026) kuruldu ve brief'ten
 * KESİN olan yuvaları taşıyor. Her bölüm promptu (P03, P05, P08…) kendi
 * bölümünü inşa ederken buraya kendi yuvalarını ekliyor. Tek dosya, tek
 * doğruluk kaynağı — Naruto'daki `NARUTO_IMAGE_SLOTS` deseninin genişletilmiş
 * hâli.
 */

/** Veritabanındaki `surface` sütununun değeri. ⚠️ Değiştirme: bütün kayıtlar buna bağlı. */
export const BLEACH_SURFACE = "anime/bleach";

// ---------------------------------------------------------------------------
// Sözleşme
// ---------------------------------------------------------------------------

/**
 * İzin verilen oranlar, işlem biçimleri ve karışım kipleri ARTIK BURADA
 * TANIMLI DEĞİL.
 *
 * Üçü de bir evrene ait değil (backend DTO'suyla birebir eşleşiyorlar) ve
 * Slam Dunk evreni aynı düzenleyiciyi kullanınca `lib/curated/contract.ts`e
 * taşındılar — gerekçe o dosyanın başlığında. Buradan RE-EXPORT ediliyorlar:
 * on altı Bleach bölümü bu dosyadan import ediyor ve hiçbirine dokunulmadı.
 */
export {
  SLOT_RATIOS,
  SLOT_TREATMENTS,
  SLOT_BLENDS,
} from "@/lib/curated/contract";
export type {
  SlotRatio,
  SlotTreatment,
  SlotBlend,
} from "@/lib/curated/contract";

/**
 * Görsel yokken (ya da "geçici gizle" açıkken) ne çizilecek.
 *
 * ⚠️ HİÇBİRİ BOŞ KUTU DEĞİL. Yuvanın boş olması tasarımın çökmesi anlamına
 * gelmiyor — futbol kanadındaki `.veil` kararının aynısı, aynı gerekçeyle:
 * yirmi iki futbolcu sayfası fotoğrafsız yayına girdi ve hiçbiri "eksik"
 * görünmedi.
 *
 *   silhouette   → bölümün kendi SVG silüeti (kapı, maske, kılıç…)
 *   typographic  → dev kanji + Jost eyebrow; boşluk tasarımın kendisi
 *   void         → tasarlanmış boşluk: dünya renginde ışık + doku, yazı yok
 */
export const SLOT_FALLBACKS = ["silhouette", "typographic", "void"] as const;
export type SlotFallback = (typeof SLOT_FALLBACKS)[number];

/** Manifestodaki bölüm başlıkları — panel bunlara göre gruplanıyor */
export const BLEACH_SECTIONS = [
  "hero",
  "worlds",
  "gotei",
  "zanpakuto",
  "bankai",
  "hierarchy",
  "hueco",
  "espada",
  "wandenreich",
  "powers",
  "masks",
  "houses",
  "locations",
  "war",
  "legends",
  "timeline",
] as const;
export type BleachSectionId = (typeof BLEACH_SECTIONS)[number];

/** Panelde bölüm başlığı olarak yazılan ad (P numarasıyla — brief'le eşleşsin) */
export const SECTION_LABELS: Record<BleachSectionId, Localized> = {
  hero: { tr: "P01 · Ruhların Dengesi", en: "P01 · The Balance of Souls" },
  worlds: { tr: "P02 · Üç Dünya", en: "P02 · The Three Worlds" },
  gotei: { tr: "P03 · Gotei 13", en: "P03 · Gotei 13" },
  zanpakuto: { tr: "P04 · Zanpakutō Arşivi", en: "P04 · Zanpakutō Archives" },
  bankai: { tr: "P05 · Bankai Salonu", en: "P05 · Bankai Hall" },
  hierarchy: { tr: "P06 · Ruh Hiyerarşisi", en: "P06 · The Soul Hierarchy" },
  hueco: { tr: "P07 · Hueco Mundo", en: "P07 · Hueco Mundo" },
  espada: { tr: "P08 · Espada", en: "P08 · Espada" },
  wandenreich: { tr: "P09 · Wandenreich", en: "P09 · Wandenreich" },
  powers: { tr: "P10 · Ruhsal Güç Sistemi", en: "P10 · Spiritual Power System" },
  masks: { tr: "P11 · Maskeler", en: "P11 · The Masks" },
  houses: { tr: "P14 · Asil Haneler", en: "P14 · The Noble Houses" },
  locations: { tr: "P15 · Mekânlar", en: "P15 · Key Locations" },
  war: { tr: "P12 · Bin Yıllık Kan Savaşı", en: "P12 · Thousand-Year Blood War" },
  legends: { tr: "P13 · Bleach Efsaneleri", en: "P13 · Bleach Legends" },
  timeline: { tr: "P16 · Hikâye Çizelgesi", en: "P16 · The Story Timeline" },
};

/** TASARIMIN yuva hakkında bildiği her şey — kodda, veritabanında değil. */
export interface CuratedSlotDef {
  /** ⚠️ KARARLI kimlik. Backend biçimi: `^[a-z0-9][a-z0-9:-]*$` */
  id: string;
  section: BleachSectionId;
  /** Küratör panelinde görünen ad */
  label: Localized;
  /** "Ne bulmam gerek" notu — YALNIZCA küratör modunda görünür */
  hint: Localized;
  /** Önerilen piksel boyutu — panelde yazılı */
  size: { w: number; h: number };
  /** İzin verilen oranlar; İLK eleman varsayılan */
  ratios: readonly [SlotRatio, ...SlotRatio[]];
  /** Duotone rengini ve atmosferi veren dünya */
  world: BleachSlotWorld;
  /** Varsayılan işlem biçimi — küratör ezebilir */
  treatment: SlotTreatment;
  /** Görsel yokken devreye giren tasarım */
  fallback: SlotFallback;
  /**
   * DEPODAKİ varsayılan kare (`/assets/…`).
   *
   * Futbol defterindeki `PlayerImageSlot.src` deseni: sayfa ilk günden
   * görselli açılabiliyor. Küratörün yüklediği kayıt DAİMA bunu eziyor —
   * varsayılan bir kilit değil, bir başlangıç.
   */
  src?: string;
  /**
   * `src` için künye. Kayıt kendi künyesini taşımıyorsa bu basılıyor.
   *
   * ⚠️ Depoya konan her serbest lisanslı kare için ZORUNLU: CC BY-SA
   * atıf istiyor ve atfın görselle birlikte seyahat etmesi gerekiyor.
   */
  srcCredit?: string;
  /** İlk kıvrım: `priority` + `fetchPriority="high"` */
  eager?: boolean;
}

// ---------------------------------------------------------------------------
// Yuva aileleri
//
// Tekrar eden yuvalar (13 bölük, 10 Espada…) elle yazılmıyor: kimlik bir
// yardımcıdan türetiliyor. `narutoElementKey` / `narutoBijuuKey` deseninin
// aynısı — iki kopya tutulsaydı biri güncellenip diğeri unutulurdu.
// ---------------------------------------------------------------------------

/**
 * Kapının KLASİK dizilimdeki kaptanı.
 *
 * ⚠️ Kimlik era eki TAŞIMIYOR ve taşımayacak: `bleach:gotei:1` küratörün
 * Yamamoto'yu yüklediği satırın anahtarı. `…:classic` yapmak o kareyi
 * koparırdı (manifesto başlığındaki kural).
 */
export const gateSlotId = (division: number) => `bleach:gotei:${division}`;

/**
 * Kapının TYBW SONRASI kaptanı — yalnızca kaptanın DEĞİŞTİĞİ bölüklerde.
 *
 * Sekiz bölükte kadro değişiyor (1, 3, 4, 5, 7, 8, 9, 13): 1. bölüğün başında
 * klasik dizilimde Yamamoto, TYBW sonrası Shunsui Kyōraku duruyor. Zaman kipi
 * anahtarı adı zaten değiştiriyordu; kare değişmeyince anahtar yarım
 * çalışıyordu — Kyōraku'nun kapısında Yamamoto'nun fotoğrafı kalıyordu
 * (kullanıcı bildirimi, 27 Ağustos 2026).
 *
 * ⚠️ Kaptanı DEĞİŞMEYEN beş bölükte (2, 6, 10, 11, 12) ikinci yuva YOK: aynı
 * kişi için iki kez kare istemek küratöre gereksiz iş ve manifestoda beş
 * sahte "eksik" satırı demekti. Liste elle yazılmıyor, `DIVISIONS`ten
 * karşılaştırmayla çıkıyor.
 */
export const gateTybwSlotId = (division: number) =>
  `bleach:gotei:${division}:tybw`;
export const innerWorldSlotId = (zanpakuto: string) => `bleach:inner:${zanpakuto}`;
export const bankaiSlotId = (slug: string) => `bleach:bankai:${slug}`;
export const espadaSlotId = (rank: number) => `bleach:espada:${rank}`;
export const maskSlotId = (slug: string) => `bleach:mask:${slug}`;
export const legendSlotId = (slug: string) => `bleach:legend:${slug}`;
export const worldSlotId = (world: string) => `bleach:world:${world}`;

/**
 * On üç kapının yuva künyesi — `DIVISIONS`ten TÜRETİLİYOR.
 *
 * Kanji listesi burada elle yazılıydı ve kaptan adları hiç yoktu; küratör
 * manifestoda "3. Bölük kaptanı" görüyor ama KİMİN karesini araması
 * gerektiğini bilmiyordu. Artık ad da, kanji de tek kaynaktan geliyor —
 * Bankai nişlerinde iki kopyanın nasıl kaydığı `BANKAI_NICHES` başlığında
 * yazılı, aynı hataya ikinci kez yer yok.
 *
 * `tybwCaptain` yalnızca kaptan DEĞİŞİYORSA dolu; doluysa o bölük iki yuva
 * üretiyor.
 */
const GATES = DIVISIONS.map((division) => ({
  n: division.n,
  kanji: division.kanji,
  captain: division.classic.captain.name,
  tybwCaptain: hasSecondCaptain(division) ? division.tybw.captain.name : null,
}));

/**
 * Tek bir kapı yuvasının künyesi.
 *
 * Yirmi bir yuvanın (13 + 8) etiketi ve kadraj notu tek kalıptan çıkıyor.
 * Küratörün bu ekranda cevaplaması gereken soru "kimin karesini arıyorum" ve
 * cevabı `captain`; zaman kipi de yazılı, çünkü iki yuvalı bölüklerde iki
 * satır yan yana duruyor ve hangisinin hangi dizilim olduğu ayırt edilmeli.
 */
function gateSlot(gate: {
  id: string;
  kanji: string;
  n: number;
  captain: string;
  /** Kaptanı değişmeyen bölüklerde `null`: etiketin era eki olmuyor */
  era: "classic" | "tybw" | null;
  /** Öbür dizilimin kaptanı — notta "onun karesi ayrı yuvada" demek için */
  other: string | null;
}): CuratedSlotDef {
  /* ⚠️ Niteleme parçaları da `Localized` — düz `string` olsalardı Türkçesi
     İngilizce sayfada aynen çıkardı. `check-bleach-i18n` tam olarak bu
     sınıf kaçağı için yazılmıştı (betiğin başlığındaki `bladeNote` olayı). */
  const eraTag: Localized =
    gate.era === "classic"
      ? { tr: " · klasik dizilim", en: " · classic era" }
      : gate.era === "tybw"
        ? { tr: " · TYBW sonrası", en: " · post-TYBW" }
        : { tr: "", en: "" };

  const also: Localized = gate.other
    ? {
        tr: ` Bu bölüğün öbür dizilimdeki kaptanı ${gate.other}; onun karesi AYRI bir yuvada.`,
        en: ` In the other era this division is led by ${gate.other}; that frame lives in a separate slot.`,
      }
    : {
        tr: " Kaptan iki dizilimde de aynı; tek kare yetiyor.",
        en: " The captain is the same in both eras; one frame is enough.",
      };

  return {
    id: gate.id,
    section: "gotei",
    label: {
      tr: `${gate.kanji} · ${gate.n}. Bölük · ${gate.captain}${eraTag.tr}`,
      en: `${gate.kanji} · Division ${gate.n} · ${gate.captain}${eraTag.en}`,
    },
    hint: {
      tr: `${gate.captain}. Kapı açılınca aralıktan görünen kare: dikey kadraj, tek figür, göğüs hizasından yukarısı. Yüz kadrajın üst yarısında kalsın — alt kenara kaptanın adı biniyor.${also.tr}`,
      en: `${gate.captain}. The frame seen through the opening gate: vertical crop, a single figure, chest up. Keep the face in the upper half — the captain's name sits over the lower edge.${also.en}`,
    },
    size: { w: 720, h: 960 },
    ratios: ["3:4", "4:5"],
    world: "soul-society",
    /* ⚠️ `photo`, `silhouette` DEĞİL (27 Ağustos 2026). Silüet işlemi
       `brightness(0.3)` uyguluyor ve küratör kaptan portresi yüklediğinde
       ekranda koyu bir blok görüyordu (kullanıcı bildirimi). Kapının
       karanlığı zaten kanatlardan ve zeminden geliyor; fotoğrafın kendisi
       kendi parlaklığında kalmalı. Küratör isterse GÖRÜNÜM sekmesinden
       silüete çevirebiliyor. */
    treatment: "photo",
    fallback: "silhouette",
  };
}

/** İç dünyası olan altı Zanpakutō (brief P04: "20 yarım yerine 6 mükemmel") */
const INNER_WORLDS: { slug: string; name: string }[] = [
  { slug: "zangetsu", name: "Zangetsu 斬月" },
  { slug: "senbonzakura", name: "Senbonzakura 千本桜" },
  { slug: "hyorinmaru", name: "Hyōrinmaru 氷輪丸" },
  { slug: "nozarashi", name: "Nozarashi 野晒" },
  { slug: "sode-no-shirayuki", name: "Sode no Shirayuki 袖白雪" },
  { slug: "benihime", name: "Benihime 紅姫" },
];

/**
 * Bankai Salonu nişleri — koridordaki sıra bu (Tensa Zangetsu en sonda).
 *
 * ⚠️ ELLE YAZILMIYOR, `BANKAI_HALL`den TÜRETİLİYOR (27 Ağustos 2026).
 * İki kopya tutuluyordu ve biri kaydı: koridor `bleach:bankai:${niche.id}`
 * çiziyordu, manifesto `katen-kyokotsu` tanımlıyordu ama koridordaki kimlik
 * `katen-kyokotsu-karamatsu`ydu. Sonuç: `slotDef()` o nişte `undefined`
 * dönüyor, `CuratedImage` sessizce `null` basıyor ve küratörün yüklediği
 * kare HİÇBİR YERDE görünmüyordu (kullanıcı bildirimi). Tek kaynağa
 * bağlamak bu sınıf hatayı bir daha mümkün kılmıyor.
 */
const BANKAI_NICHES = BANKAI_HALL.map((niche) => ({
  slug: niche.id,
  name: niche.name,
  owner: niche.owner,
}));

/*
 * ⚠️ ESPADA ADLARININ ELLE YAZILMIŞ İKİNCİ KOPYASI KALDIRILDI
 * (28 Ağustos 2026).
 *
 * Liste burada `["Yammy Llargo", "Coyote Starrk", …]` olarak duruyordu ve
 * yuva kimliği dizinin İNDEKSİNDEN üretiliyordu (`(name, rank) =>`). Oysa
 * `espada.ts` rütbeleri **1–10** olarak tutuyor ve Yammy 10 numara. Sonuç
 * ölçüldü: manifesto `bleach:espada:0…9` üretiyordu, bölüm ise
 * `bleach:espada:1…10` çiziyordu — Yammy'nin kadrajı `slotDef()` bulamadığı
 * için SESSİZCE hiç basılmıyordu (on portrenin dokuzu görünüyordu), üstelik
 * `…:0` kimliği hiçbir yerde çizilmeyen yetim bir yuvaydı.
 *
 * Tam olarak manifesto başlığındaki kural: yuva listesini VERİ DOSYASINDAN
 * türet, elle ikinci kopya yazma. Artık `ESPADA` kaydından geliyor.
 */

/** Maske duvarı — sonuncusu bilinçli olarak isimsiz */
const MASKS: { slug: string; name: Localized }[] = [
  { slug: "ichigo", name: { tr: "Ichigo Hollow maskesi", en: "Ichigo's Hollow mask" } },
  { slug: "shinji", name: { tr: "Shinji Hirako", en: "Shinji Hirako" } },
  { slug: "kensei", name: { tr: "Kensei Muguruma", en: "Kensei Muguruma" } },
  { slug: "hiyori", name: { tr: "Hiyori Sarugaki", en: "Hiyori Sarugaki" } },
  { slug: "ulquiorra", name: { tr: "Ulquiorra · kalan parça", en: "Ulquiorra · remnant" } },
  { slug: "grimmjow", name: { tr: "Grimmjow · çene", en: "Grimmjow · jaw" } },
  { slug: "nelliel", name: { tr: "Nelliel · kafatası", en: "Nelliel · skull" } },
  { slug: "nameless", name: { tr: "Adı olmayanlar", en: "The nameless" } },
];

/** On isim — P13'ün sağ sütununda beliren portreler */
const LEGENDS: { slug: string; name: string }[] = [
  { slug: "ichigo-kurosaki", name: "Ichigo Kurosaki" },
  { slug: "sousuke-aizen", name: "Sōsuke Aizen" },
  { slug: "genryusai-yamamoto", name: "Genryūsai Yamamoto" },
  { slug: "yhwach", name: "Yhwach" },
  { slug: "kisuke-urahara", name: "Kisuke Urahara" },
  { slug: "kenpachi-zaraki", name: "Kenpachi Zaraki" },
  { slug: "byakuya-kuchiki", name: "Byakuya Kuchiki" },
  { slug: "rukia-kuchiki", name: "Rukia Kuchiki" },
  { slug: "shunsui-kyoraku", name: "Shunsui Kyōraku" },
  { slug: "ichibe-hyosube", name: "Ichibē Hyōsube" },
];

/**
 * Beş katman — P02'nin dünya sırası.
 *
 * ── DEPODAKİ GEÇİCİ KARELER (23 Ağustos 2026) ────────────────────────────
 * Dördünde serbest lisanslı bir Commons fotoğrafı duruyor. Bunlar YER
 * TUTUCU: küratör kendi karesini yükleyince kayıt bunları eziyor. Depoya
 * konmalarının sebebi hotlink'in imkânsız olması (CSP `img-src` beyaz
 * liste) ve iki görsel üreticisinin de o gün kapalı olması (Gemini kotası
 * doldu, fal hesabı kilitli).
 *
 * ⚠️ REİŌKYŪ BİLİNÇLİ OLARAK BOŞ. Brief'te "renksiz, en sessiz katman —
 * kasıtlı olarak" yazıyor. Uygun bir fotoğraf bulunamadı ve zorlamak
 * yerine yuvanın tasarlanmış boşluğu bırakıldı; zaten istenen o.
 */
const WORLD_LAYERS: {
  id: BleachSlotWorld;
  kanji: string;
  name: Localized;
  src?: string;
  /**
   * Künye satırı — ÇEVRİLMEZ, ve dili İNGİLİZCE.
   *
   * ⚠️ P18-b: iki künyede Türkçe vardı ("Himeji Kalesi", "kamu malı") ve
   * alan çevrilmediği için İngilizce sayfada aynen çıkıyorlardı. Lisans
   * atfının tek dilde durması gerekiyor; İngilizce seçildi çünkü lisans
   * adları (CC BY-SA, public domain) ve kaynak adları zaten İngilizce.
   * `check-bleach-i18n.mjs` bu alanı da tarıyor.
   */
  srcCredit?: string;
}[] = [
  {
    id: "living",
    kanji: "現世",
    name: { tr: "Karakura", en: "Karakura" },
    src: "/assets/bleach/world-living.webp",
    srcCredit: "Tokyo · imuttoo · CC BY-SA 2.0 · Wikimedia Commons",
  },
  {
    id: "soul-society",
    kanji: "尸魂界",
    name: { tr: "Seireitei", en: "Seireitei" },
    src: "/assets/bleach/world-soul-society.webp",
    srcCredit: "Himeji Castle · Lowell Silverman · CC BY-SA 3.0 · Wikimedia Commons",
  },
  {
    id: "hueco-mundo",
    kanji: "虚圏",
    name: { tr: "Las Noches", en: "Las Noches" },
    src: "/assets/bleach/world-hueco-mundo.webp",
    srcCredit: "Little Sahara · BLM Utah · public domain · Wikimedia Commons",
  },
  { id: "royal", kanji: "霊王宮", name: { tr: "Reiōkyū", en: "Reiōkyū" } },
  {
    id: "wandenreich",
    kanji: "見えざる帝国",
    name: { tr: "Silbern", en: "Silbern" },
    src: "/assets/bleach/world-wandenreich.webp",
    srcCredit: "St.-Paulus-Dom, Münster · Dietmar Rabich · CC BY-SA 4.0 · Wikimedia Commons",
  },
];

// ---------------------------------------------------------------------------
// Manifesto
// ---------------------------------------------------------------------------

export const BLEACH_SLOTS: readonly CuratedSlotDef[] = [
  /* ══ P01 · HERO ══════════════════════════════════════════════════════ */
  {
    id: "bleach:hero:ichigo",
    section: "hero",
    label: { tr: "Açılış · Ichigo figürü", en: "Opening · Ichigo figure" },
    hint: {
      tr: "Tam boy, ortalanmış, arka planı sade. CSS dört dikey şeride bölecek — yüz ve gövde kadrajın ortasında kalsın.",
      en: "Full body, centred, plain background. CSS splits it into four vertical strips — keep face and torso centred.",
    },
    size: { w: 1600, h: 2000 },
    ratios: ["4:5", "3:4", "9:16"],
    world: "neutral",
    treatment: "photo",
    fallback: "silhouette",
    eager: true,
  },
  {
    id: "bleach:hero:rift",
    section: "hero",
    label: { tr: "Açılış · dikey yarık", en: "Opening · vertical rift" },
    hint: {
      tr: "Dikey Garganta/Dangai çatlağı. Fotoğraf değil doku: siyah zemin üzerinde düzensiz ışık yarığı. Boşsa SVG çatlak çizilir.",
      en: "Vertical Garganta/Dangai crack. Texture, not photo: an irregular light fissure on black. Falls back to an SVG crack.",
    },
    size: { w: 1200, h: 2400 },
    ratios: ["9:16"],
    world: "neutral",
    treatment: "duotone",
    fallback: "silhouette",
  },

  /* ══ P02 · BEŞ KATMAN ════════════════════════════════════════════════ */
  ...WORLD_LAYERS.map<CuratedSlotDef>((layer) => ({
    id: worldSlotId(layer.id),
    section: "worlds",
    label: {
      tr: `Katman · ${layer.kanji} ${layer.name.tr}`,
      en: `Layer · ${layer.kanji} ${layer.name.en ?? layer.name.tr}`,
    },
    hint: {
      tr: "Katmanın uzak fonu — mimari silüet, geniş yatay. Atmosfer (yağmur, kar, kum) CSS'ten geliyor; burada yalnızca ufuk çizgisi lazım.",
      en: "The layer's distant backdrop — architectural silhouette, wide horizontal. Atmosphere (rain, snow, sand) comes from CSS; only the skyline is needed here.",
    },
    size: { w: 2560, h: 1200 },
    ratios: ["21:9", "2:1", "16:9"],
    world: layer.id,
    /* ⚠️ `photo`, `silhouette` DEGIL (23 Agustos 2026). Katman fonu gercek
       bir manzara: Karakura'nin gece silueti, Seireitei'nin duvarlari.
       Siluete cevirmek onlari tanınmaz kiliyordu ve kurator bir kare
       yukledigi anda ekranda koyu bir blok goruyordu. Katmanin atmosferi
       zaten CSS'ten geliyor (yagmur, kar, kum); fotografin kendisi
       okunabilir kalmali. Kurator isterse GORUNUM sekmesinden siluete
       cevirebiliyor. */
    treatment: "photo",
    fallback: "silhouette",
    src: layer.src,
    srcCredit: layer.srcCredit,
  })),

  /* ══ P03 · GOTEI 13 ══════════════════════════════════════════════════
     Kapı başına BİR yuva, kaptanı değişen sekiz bölükte İKİ. Zaman kipi
     anahtarı hangi kareyi çizeceğini `Gotei13Section` seçiyor. */
  ...GATES.flatMap<CuratedSlotDef>((gate) => [
    gateSlot({
      id: gateSlotId(gate.n),
      kanji: gate.kanji,
      n: gate.n,
      captain: gate.captain,
      /* Kaptan değişiyorsa bu yuva artık "klasik dizilimin kaptanı";
         değişmiyorsa era ayrımı yok, etiket sade kalıyor. */
      era: gate.tybwCaptain ? "classic" : null,
      other: gate.tybwCaptain,
    }),
    ...(gate.tybwCaptain
      ? [
          gateSlot({
            id: gateTybwSlotId(gate.n),
            kanji: gate.kanji,
            n: gate.n,
            captain: gate.tybwCaptain,
            era: "tybw",
            other: gate.captain,
          }),
        ]
      : []),
  ]),

  /* ══ P04 · İÇ DÜNYALAR ═══════════════════════════════════════════════ */
  ...INNER_WORLDS.map<CuratedSlotDef>((zan) => ({
    id: innerWorldSlotId(zan.slug),
    section: "zanpakuto",
    label: { tr: `İç dünya · ${zan.name}`, en: `Inner world · ${zan.name}` },
    hint: {
      tr: "Tam ekran manzara. Figür yok, yazı yok — yalnızca mekân. Kendi paletiyle boyanacağı için düşük doygunluk tercih edilir.",
      en: "Full-screen landscape. No figures, no text — the place alone. Low saturation preferred; it gets tinted by its own palette.",
    },
    size: { w: 2560, h: 1440 },
    ratios: ["16:9", "2:1"],
    world: "soul-society",
    treatment: "duotone",
    fallback: "void",
  })),

  /* ══ P05 · BANKAI SALONU ═════════════════════════════════════════════ */
  ...BANKAI_NICHES.map<CuratedSlotDef>((niche) => ({
    id: bankaiSlotId(niche.slug),
    section: "bankai",
    label: {
      tr: `Niş · ${niche.name} · ${niche.owner}`,
      en: `Niche · ${niche.name} · ${niche.owner}`,
    },
    hint: {
      tr: `Dar dikey niş. ${niche.name} — sahibi ${niche.owner}. Karanlıkta duran tek figür, tam boy; nişin arkasından reiatsu ışığı vuruyor, o yüzden kenarları net olsun.`,
      en: `Narrow vertical niche. ${niche.name} — wielded by ${niche.owner}. A single full-length figure in the dark; reiatsu light strikes from behind the niche, so keep edges crisp.`,
    },
    size: { w: 600, h: 1200 },
    ratios: ["9:16", "3:4"],
    world: "soul-society",
    /* ⚠️ `photo`, `silhouette` DEĞİL — gerekçe Gotei 13 yuvalarıyla aynı
       (27 Ağustos 2026). Nişin karanlığı zeminden ve ışığın yokluğundan
       geliyor; karenin kendisini `brightness(0.3)` ile ezmek küratöre
       yüklediği görseli göstermiyordu. */
    treatment: "photo",
    fallback: "silhouette",
  })),

  /* ══ P07 · HUECO MUNDO ═══════════════════════════════════════════════ */
  {
    id: "bleach:hueco:desert",
    section: "hueco",
    label: { tr: "Beyaz çöl", en: "The white desert" },
    hint: {
      tr: "Neredeyse boş bir kare: kum çizgisi, tek kırık kemik ağacı, ay. BEYAZ zemin — bu bölümde sayfa negatife dönüyor.",
      en: "An almost empty frame: a sand line, one broken bone tree, the moon. WHITE ground — the page inverts in this section.",
    },
    size: { w: 2560, h: 1200 },
    ratios: ["21:9", "2:1"],
    world: "hueco-mundo",
    treatment: "silhouette",
    fallback: "void",
  },

  /* ══ P08 · ESPADA ════════════════════════════════════════════════════ */
  ...ESPADA.map<CuratedSlotDef>((record) => ({
    id: espadaSlotId(record.rank),
    section: "espada",
    label: {
      tr: `${record.rank} · ${record.name}`,
      en: `${record.rank} · ${record.name}`,
    },
    hint: {
      tr: "Karakterin portresi — numaranın önünde görünecek. Şeffaf zemin (PNG/WebP) tavsiye edilir, tam beden portre.",
      en: "Character portrait — appears in front of the numeral. Transparent background (PNG/WebP) recommended, full body portrait.",
    },
    size: { w: 600, h: 900 },
    ratios: ["2:3"],
    world: "hueco-mundo",
    /* ⚠️ `"normal"` DEĞİL — o bir KARIŞIM kipi (`SLOT_BLENDS`), işlem biçimi
       değil. Tasarımın istediği "filtre uygulama, kareyi olduğu gibi bas" ve
       bunun adı `photo`: üç işlem biçiminden filtre UYGULAMAYAN tek olanı.
       Karar değişmedi, yalnızca doğru sözcükle yazıldı (28 Ağustos 2026). */
    treatment: "photo",
    fallback: "silhouette",
  })),

  /* ══ P11 · MASKELER ══════════════════════════════════════════════════ */
  ...MASKS.map<CuratedSlotDef>((mask) => ({
    id: maskSlotId(mask.slug),
    section: "masks",
    label: {
      tr: `Maske · ${mask.name.tr}`,
      en: `Mask · ${mask.name.en ?? mask.name.tr}`,
    },
    hint: {
      tr: "Tek katmanlı line-art maske, şeffaf zemin. Fotoğraf DEĞİL — duvara asılı obje gibi çizilecek.",
      en: "Single-layer line-art mask, transparent background. NOT a photo — it hangs on a wall like an object.",
    },
    size: { w: 512, h: 512 },
    ratios: ["1:1"],
    world: "neutral",
    treatment: "silhouette",
    fallback: "silhouette",
  })),

  /* ══ P13 · EFSANELER ═════════════════════════════════════════════════ */
  ...LEGENDS.map<CuratedSlotDef>((legend) => ({
    id: legendSlotId(legend.slug),
    section: "legends",
    label: { tr: `Portre · ${legend.name}`, en: `Portrait · ${legend.name}` },
    hint: {
      tr: "Dikey portre, omuz üstü. Satıra hover edilince sağda beliriyor — arka plan sade, yüz üst üçte birde.",
      en: "Vertical portrait, head and shoulders. Appears on the right when the row is hovered — plain background, face in the upper third.",
    },
    size: { w: 900, h: 1200 },
    ratios: ["3:4", "4:5"],
    world: "neutral",
    treatment: "photo",
    fallback: "typographic",
  })),
];

// ---------------------------------------------------------------------------
// Yardımcılar
// ---------------------------------------------------------------------------

/** Kimlik → tanım. Sayfa çiziminde her yuva için bir kez okunuyor. */
const BY_ID = new Map(BLEACH_SLOTS.map((slot) => [slot.id, slot]));

export function slotDef(id: string): CuratedSlotDef | undefined {
  return BY_ID.get(id);
}

/**
 * Bölüm bölüm gruplanmış manifesto — "eksik görseller" paneli bunu okuyor.
 * Sıra `BLEACH_SECTIONS` sırası, yani sayfadaki sırayla aynı.
 */
export function slotsBySection(): { section: BleachSectionId; slots: CuratedSlotDef[] }[] {
  return BLEACH_SECTIONS.map((section) => ({
    section,
    slots: BLEACH_SLOTS.filter((slot) => slot.section === section),
  })).filter((group) => group.slots.length > 0);
}

/** Yuvanın varsayılan oranı — kayıt bir şey söylemediyse bu geçerli */
export function defaultRatio(slot: CuratedSlotDef): SlotRatio {
  return slot.ratios[0];
}

/**
 * Kayıttaki oran geçerli mi?
 *
 * Doğrulama BACKEND'DE DEĞİL burada: hangi oranların geçerli olduğunu yalnızca
 * manifesto biliyor ve manifesto kodda duruyor (uç yuva listesini bilmiyor,
 * bilmemeli — `SetCuratedImageDto` başlığı). Tanınmayan değer sessizce
 * varsayılana düşüyor; kayıt bozulmuyor, çizim kırılmıyor.
 */
export function resolveRatio(
  slot: CuratedSlotDef,
  stored: string | null | undefined,
): SlotRatio {
  const allowed = slot.ratios as readonly string[];
  return stored && allowed.includes(stored)
    ? (stored as SlotRatio)
    : defaultRatio(slot);
}
