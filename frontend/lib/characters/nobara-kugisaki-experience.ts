import type { LocalizedText } from "./types";

/**
 * Nobara Kugisaki — "Saman Bebek" deneyim sayfasının veri katmanı.
 *
 * Faz 2 · Dalga 5 · §26. Bu dosya 31 Ağustos 2026'da SIFIRDAN yazıldı;
 * eski `.deprecated/nobara-kugisaki/data.ts` yalnızca OKUNDU. Metinlerin bir
 * kısmı oradan taşındı, üçü düzeltildi (aşağıda), gerisi yeni — çünkü
 * sayfanın mekaniği de kimliği de değişti.
 *
 * ── ESKİ VERİDEN NE ALINDI, NE DÜZELTİLDİ ────────────────────────────────
 * Alındı: künye satırları, üç tekniğin gövde metni, dört ayrıntının üçü,
 * iki replik ve kaynakları, kapanış mottosunun açıklaması.
 *
 * Düzeltildi:
 *   1. KRONOLOJİ MEVSİM ETİKETLERİ. Eski dosya Kyoto karşılaşmasını
 *      "sonbahar", kara şimşeği "kış" diye etiketliyordu. Shibuya olayı
 *      31 EKİM'de geçiyor, yani kara şimşek "kış"ta olamaz — kış Shibuya'nın
 *      SONRASINA düşer. Üstelik Ölüm Resmi kardeşleriyle karşılaşmanın
 *      okullar arası karşılaşmaya göre sırası anlatının kendisinde
 *      iç içe geçmiş durumda. Yeni etiketler mevsim iddiası taşımıyor:
 *      olayın adıyla anılıyorlar.
 *   2. "İKİ PANO" DİLİ. Eski hero metni sayfanın o günkü mekaniğini
 *      anlatıyordu ("solda vuruyorsun, sağda oluyor"). O mekanik emekli
 *      edildi; metin de yeniden yazıldı.
 *   3. 形見 ETİKETİ. Eski dosya bağ maddesine 形見 (katami — hatıra eşyası)
 *      diyordu. Bu bir JJK terimi DEĞİL, arşivin uydurduğu bir ad.
 *      Kaynakta geçen şey "hedefin bir parçası"; bu dosya onu 一部 (ichibu)
 *      diye, yani düz Japonca bir tanım olarak yazıyor ve teknik adı gibi
 *      göstermiyor.
 *
 * ── KÜNYE SAYILARININ KAYNAĞI ────────────────────────────────────────────
 * Doğum (7 Ağustos 2002), yaş (16), boy (160 cm), derece (3. sınıf büyücü),
 * meslek ve okul: `public/assets/anime/karakterler/nobara-kugisaki/
 * kaynak.json` (AniList #133700 çekimi).
 *
 * ⚠️ AniList kaydında Nobara için TEKNİK SATIRI ve KAN GRUBU yok. Şeritte de
 * yok; uydurulmadı. Teknik adı kendi bölümünde.
 *
 * ── REPLİK DİSİPLİNİ ─────────────────────────────────────────────────────
 * Tırnak içinde iki cümle var: 「私は釘崎野薔薇だ」 ve
 * 「悪くないじゃん、私の人生」. İkisi de kaynağıyla anılıyor. Emin
 * olunmayan hiçbir cümle tırnağa alınmadı.
 *
 * ⚠️ SHIBUYA: Nobara'nın Mahito'yla karşılaşmasının sonucu anlatıda uzun
 * süre AÇIKTA bırakıldı. Arşiv anime kadar ilerliyor ve orada duruyor:
 * "öldü" ya da "kurtuldu" denmiyor.
 */

export const NOBARA_ID = 133700;

/** AniList künyesi — `detail.character.siteUrl` boş gelirse yedek. */
export const NOBARA_SITE_URL = "https://anilist.co/character/133700";

/**
 * Depodaki resmî portre. 230×345 — KÜÇÜK, o yüzden yalnızca kapaktaki
 * "manken kartı" kadrajında kullanılıyor, tam kanama hero olarak değil.
 * Kaynağı `kaynak.json`; hotlink YOK.
 */
export const NOBARA_PORTRAIT = {
  src: "/assets/anime/karakterler/nobara-kugisaki/anilist-portrait.png",
  w: 230,
  h: 345,
} as const;

/**
 * Sergi görselleri — hepsi characterId 133700 kaydında, ABILITY yuvasında.
 * Anahtarların tamamı `nob:` önekli (küratör modu şartı).
 *
 * Hepsi BOŞ. Dergi düzeni "tam kanama görsel" istiyor ama elde görsel yok:
 * bu yüzden kanamayı görsel değil RENK BLOKLARI ve tipografi taşıyor, kadraj
 * dolduğunda blok görselin altına çekiliyor. Bkz. `.plate` başlığı.
 */
export const NOBARA_IMAGE_KEYS = {
  cover: "nob:cover",
  city: "nob:tokyo",
  artDoll: "nob:surei",
  artResonance: "nob:kyomei",
  artHairpin: "nob:kanzashi",
  kitTools: "nob:kanazuchi",
  kitEnergy: "nob:juryoku",
  kitFlash: "nob:kokusen",
  kitReverse: "nob:hanten",
  field: "nob:kugiba",
  fateVillage: "nob:fate-mura",
  fateSchool: "nob:fate-kousen",
  fateExchange: "nob:fate-kouryuu",
  fatePainting: "nob:fate-shimetsu",
  fateShibuya: "nob:fate-shibuya",
  team: "nob:team",
  closing: "nob:closing",
} as const;

/** Küratör yuvalarının etiketleri — yükleyen kişi ne beklendiğini okur. */
export const NOBARA_SLOT_LABELS: Record<string, LocalizedText> = {
  [NOBARA_IMAGE_KEYS.cover]: {
    tr: "Kapak — dikey, tam boy, dergi kapağı kadrajı",
    en: "Cover — vertical, full figure, magazine-cover crop",
  },
  [NOBARA_IMAGE_KEYS.city]: {
    tr: "Tokyo — vitrinler, kalabalık, gece",
    en: "Tokyo — shop windows, a crowd, night",
  },
  [NOBARA_IMAGE_KEYS.artDoll]: {
    tr: "Saman bebek — avucunda, yakın çekim",
    en: "The straw doll — in her palm, close crop",
  },
  [NOBARA_IMAGE_KEYS.artResonance]: {
    tr: "Rezonans — çivi bebeğe girerken",
    en: "Resonance — the nail entering the doll",
  },
  [NOBARA_IMAGE_KEYS.artHairpin]: {
    tr: "Simci — içeriden dışarı patlayan çiviler",
    en: "Hairpin — the nails bursting outward from within",
  },
  [NOBARA_IMAGE_KEYS.kitTools]: {
    tr: "Çekiç ve çivi kutusu — masada, yakın çekim",
    en: "Hammer and box of nails — on a table, close crop",
  },
  [NOBARA_IMAGE_KEYS.kitEnergy]: {
    tr: "Lanet enerjisi — çivinin ucundaki yük",
    en: "Cursed energy — the charge on the nail's tip",
  },
  [NOBARA_IMAGE_KEYS.kitFlash]: {
    tr: "Kara şimşek — temas anındaki siyah kıvılcım",
    en: "Black flash — the black spark at the moment of contact",
  },
  [NOBARA_IMAGE_KEYS.kitReverse]: {
    tr: "Ters lanet tekniği — kapanan bir yara",
    en: "Reverse cursed technique — a wound closing",
  },
  [NOBARA_IMAGE_KEYS.field]: {
    tr: "Çivi alanı — altı nokta, tek düzlem",
    en: "The nail field — six points on one plane",
  },
  [NOBARA_IMAGE_KEYS.fateVillage]: {
    tr: "Köy — dar sokak, iki çocuk",
    en: "The village — a narrow lane, two children",
  },
  [NOBARA_IMAGE_KEYS.fateSchool]: {
    tr: "Okula geliş — üç birinci sınıf yan yana",
    en: "Arriving at school — three first-years side by side",
  },
  [NOBARA_IMAGE_KEYS.fateExchange]: {
    tr: "Okullar arası karşılaşma — meydan okuma anı",
    en: "The exchange event — the moment of challenge",
  },
  [NOBARA_IMAGE_KEYS.fatePainting]: {
    tr: "Ölüm Resmi — yumruk ve siyah kıvılcım",
    en: "Death Painting — the fist and the black spark",
  },
  [NOBARA_IMAGE_KEYS.fateShibuya]: {
    tr: "Shibuya — metro çıkışı, tek figür",
    en: "Shibuya — the station exit, a single figure",
  },
  [NOBARA_IMAGE_KEYS.team]: {
    tr: "Takım — üç birinci sınıf, tam boy",
    en: "The team — three first-years, full figure",
  },
  [NOBARA_IMAGE_KEYS.closing]: {
    tr: "Kapanış — boş bir sokak, düşük kontrast",
    en: "Closing — an empty street, low contrast",
  },
};

/** Beklenen kare: tip + ölçü. `CuratorGaps` bu satırı basıyor. */
export const NOBARA_SLOT_SPECS: Record<string, LocalizedText> = {
  [NOBARA_IMAGE_KEYS.cover]: {
    tr: "dikey kapak · 1200×1600 · webp",
    en: "vertical cover · 1200×1600 · webp",
  },
  [NOBARA_IMAGE_KEYS.city]: {
    tr: "panoramik bant · 2000×900 · webp",
    en: "panoramic band · 2000×900 · webp",
  },
  [NOBARA_IMAGE_KEYS.artDoll]: {
    tr: "dergi karesi · 1400×1050 · webp",
    en: "editorial frame · 1400×1050 · webp",
  },
  [NOBARA_IMAGE_KEYS.artResonance]: {
    tr: "dergi karesi · 1400×1050 · webp",
    en: "editorial frame · 1400×1050 · webp",
  },
  [NOBARA_IMAGE_KEYS.artHairpin]: {
    tr: "dergi karesi · 1400×1050 · webp",
    en: "editorial frame · 1400×1050 · webp",
  },
  [NOBARA_IMAGE_KEYS.kitTools]: {
    tr: "kare kadraj · 800×800 · webp",
    en: "square crop · 800×800 · webp",
  },
  [NOBARA_IMAGE_KEYS.kitEnergy]: {
    tr: "kare kadraj · 800×800 · webp",
    en: "square crop · 800×800 · webp",
  },
  [NOBARA_IMAGE_KEYS.kitFlash]: {
    tr: "kare kadraj · 800×800 · webp",
    en: "square crop · 800×800 · webp",
  },
  [NOBARA_IMAGE_KEYS.kitReverse]: {
    tr: "kare kadraj · 800×800 · webp",
    en: "square crop · 800×800 · webp",
  },
  [NOBARA_IMAGE_KEYS.field]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [NOBARA_IMAGE_KEYS.fateVillage]: {
    tr: "dikey kadraj · 900×1200 · webp",
    en: "vertical frame · 900×1200 · webp",
  },
  [NOBARA_IMAGE_KEYS.fateSchool]: {
    tr: "dikey kadraj · 900×1200 · webp",
    en: "vertical frame · 900×1200 · webp",
  },
  [NOBARA_IMAGE_KEYS.fateExchange]: {
    tr: "dikey kadraj · 900×1200 · webp",
    en: "vertical frame · 900×1200 · webp",
  },
  [NOBARA_IMAGE_KEYS.fatePainting]: {
    tr: "dikey kadraj · 900×1200 · webp",
    en: "vertical frame · 900×1200 · webp",
  },
  [NOBARA_IMAGE_KEYS.fateShibuya]: {
    tr: "dikey kadraj · 900×1200 · webp",
    en: "vertical frame · 900×1200 · webp",
  },
  [NOBARA_IMAGE_KEYS.team]: {
    tr: "geniş kadraj · 1600×900 · webp",
    en: "wide frame · 1600×900 · webp",
  },
  [NOBARA_IMAGE_KEYS.closing]: {
    tr: "panoramik bant · 2000×900 · webp",
    en: "panoramic band · 2000×900 · webp",
  },
};

/** `CuratorSlot`un `size` prop'u — küratör kareyi buna göre hazırlasın. */
export const NOBARA_SLOT_SIZES: Record<string, { w: number; h: number }> = {
  [NOBARA_IMAGE_KEYS.cover]: { w: 1200, h: 1600 },
  [NOBARA_IMAGE_KEYS.city]: { w: 2000, h: 900 },
  [NOBARA_IMAGE_KEYS.artDoll]: { w: 1400, h: 1050 },
  [NOBARA_IMAGE_KEYS.artResonance]: { w: 1400, h: 1050 },
  [NOBARA_IMAGE_KEYS.artHairpin]: { w: 1400, h: 1050 },
  [NOBARA_IMAGE_KEYS.kitTools]: { w: 800, h: 800 },
  [NOBARA_IMAGE_KEYS.kitEnergy]: { w: 800, h: 800 },
  [NOBARA_IMAGE_KEYS.kitFlash]: { w: 800, h: 800 },
  [NOBARA_IMAGE_KEYS.kitReverse]: { w: 800, h: 800 },
  [NOBARA_IMAGE_KEYS.field]: { w: 1600, h: 900 },
  [NOBARA_IMAGE_KEYS.fateVillage]: { w: 900, h: 1200 },
  [NOBARA_IMAGE_KEYS.fateSchool]: { w: 900, h: 1200 },
  [NOBARA_IMAGE_KEYS.fateExchange]: { w: 900, h: 1200 },
  [NOBARA_IMAGE_KEYS.fatePainting]: { w: 900, h: 1200 },
  [NOBARA_IMAGE_KEYS.fateShibuya]: { w: 900, h: 1200 },
  [NOBARA_IMAGE_KEYS.team]: { w: 1600, h: 900 },
  [NOBARA_IMAGE_KEYS.closing]: { w: 2000, h: 900 },
};

/**
 * Boş kadrajın üstünde duran tek kelime — YALNIZCA yöneticide çiziliyor.
 * Ziyaretçi hiçbir yer tutucu metin görmüyor (Dalga 1'in birinci dersi).
 */
export const NOBARA_FRAME_EMPTY: LocalizedText = {
  tr: "boş kadraj",
  en: "empty frame",
};

/** Portre yuvasının etiketi (ABILITY değil, PORTRAIT). */
export const NOBARA_PORTRAIT_SLOT: LocalizedText = {
  tr: "Portre — dikey, tam boy, 1200×1600'e kadar",
  en: "Portrait — vertical, full figure, up to 1200×1600",
};

export const NOBARA_CRUMB = {
  series: {
    tr: "Jujutsu Kaisen · Tokyo Jujutsu Lisesi",
    en: "Jujutsu Kaisen · Tokyo Jujutsu High",
  },
} as const;

/**
 * Dergi künyesi (masthead). Bir moda dergisinin kapak üstü şeridi:
 * sayı numarası, ay, bölüm adı. Sayı numarası AniList kimliği — uydurma bir
 * sayı değil, kaynağın kendi numarası.
 */
/**
 * ⚠️ HİÇBİRİ ELLE BÜYÜK HARFLE YAZILMADI. Büyütmeyi CSS yapıyor
 * (`text-transform: uppercase`), çünkü ekran okuyucuya normal yazım
 * gitmeli ve Türkçe'de "i" harfinin "İ"ye dönmesi tarayıcının
 * `lang="tr"` eşlemesine bırakılmalı ("çivi" → "ÇİVİ").
 */
export const NOBARA_MASTHEAD = {
  wordmark: { tr: "Kugisaki", en: "Kugisaki" },
  issue: { tr: "Sayı 133700", en: "Issue 133700" },
  dateline: { tr: "Tokyo · 呪術高専", en: "Tokyo · Jujutsu High" },
  strap: {
    tr: "Saman, çivi, çekiç — ve aradaki bağ",
    en: "Straw, nail, hammer — and the link between",
  },
  spine: "芻霊呪法",
} as const;

/* ── Kimlik ─────────────────────────────────────────────────────────────── */

export const NOBARA_IDENTITY = {
  name: "Nobara Kugisaki",
  nativeName: "釘崎野薔薇",
  /** Kapak filigranı — dekoratif (aria-hidden): 釘 = çivi */
  watermark: "釘",
  kicker: {
    tr: "Kasabadan Tokyo'ya · Jujutsu Lisesi birinci sınıf",
    en: "From the country to Tokyo · Jujutsu High, first year",
  },
  /** Soyadındaki ilk kanji tekniğinin adı: 釘 = çivi. */
  nameNote: {
    tr: "Soyadının ilk işareti 釘: çivi. Tekniğinin adı kendi adının içinde duruyor.",
    en: "The first character of her surname is 釘: nail. The name of her technique sits inside her own name.",
  },
  epigraph: {
    tr: "Vuruş burada iner, acı orada çıkar. Aradaki mesafeyi kapatan şey güç değil, bir bağ.",
    en: "The blow lands here, the pain comes out there. What closes the distance is not force but a link.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Born" },
      value: { tr: "7 Ağustos 2002", en: "7 August 2002" },
    },
    { label: { tr: "Yaş", en: "Age" }, value: { tr: "16", en: "16" } },
    { label: { tr: "Boy", en: "Height" }, value: { tr: "160 cm", en: "160 cm" } },
    {
      label: { tr: "Derece", en: "Grade" },
      value: { tr: "3. sınıf büyücü", en: "Grade 3 sorcerer" },
    },
    {
      label: { tr: "Okul", en: "School" },
      value: { tr: "Tokyo Jujutsu Lisesi", en: "Tokyo Jujutsu High" },
    },
    {
      label: { tr: "İşi", en: "Occupation" },
      value: { tr: "Büyücü ve öğrenci", en: "Sorcerer and student" },
    },
    {
      label: { tr: "Alan", en: "Field" },
      value: { tr: "Jujutsu · 呪術", en: "Jujutsu · 呪術" },
    },
    {
      label: { tr: "Sembolik obje", en: "Signature object" },
      value: { tr: "Çekiç ve çivi · 金槌と釘", en: "Hammer and nail · 金槌と釘" },
    },
  ],
} as const;

export const NOBARA_MISSING_NOTE: LocalizedText = {
  tr: "AniList kaydında Nobara için lanetli teknik satırı ve kan grubu YOK — bu yüzden şeritte de yok. Tekniğin adı bir alt bölümde, kendi kaynağıyla.",
  en: "Nobara's AniList record carries no cursed-technique line and no blood type, so neither appears here. The technique's name is one section below, with its own source.",
};

/* ── Mod düğmesi: Rezonans ──────────────────────────────────────────────── */

export const NOBARA_RESONANCE_UI = {
  title: { tr: "Rezonans", en: "Resonance" },
  native: "共鳴り",
  enter: { tr: "Rezonansı aç", en: "Turn resonance on" },
  exit: { tr: "Rezonansı kapat", en: "Turn resonance off" },
  hintOff: {
    tr: "Kapalı. Dergi kendi ölçüsünde duruyor ve çiviler arasındaki bağ görünmüyor — hangi üçlünün titreştiğini metinden çıkarman gerekiyor.",
    en: "Off. The magazine keeps its own measure and the links between the nails stay invisible — you have to work out which triad rings from the text alone.",
  },
  hintOn: {
    tr: "Açık. Bağ çizgileri göründü, sayfa pembeye doydu ve dergi düzeni sıkıştı: sütunlar daraldı, kenar boşlukları kapandı.",
    en: "On. The link lines have surfaced, the page has saturated to pink, and the layout has tightened: the columns narrowed and the margins closed in.",
  },
} as const;

export const NOBARA_HERO = {
  lede: {
    tr: "Nobara'nın tekniğinin tuhaflığı şu: vurduğu şeyle acıyan şey aynı yerde değil. Elindeki saman bebeğe bir çivi çakıyor ve çivi, o bebekle bağı kurulmuş olan bedende çıkıyor. Bağ yoksa çekiç boşa iniyor — teknik başlamıyor bile. Bu sayfa o kuralın üstüne kurulu: her şey tek bir düzlemde duruyor ve neyin neyle çalıştığına sen karar veriyorsun.",
    en: "The oddity of Nobara's technique is this: the thing she strikes and the thing that hurts are not in the same place. She drives a nail into the straw doll in her hand, and the nail comes out in the body that doll is linked to. With no link the hammer falls on nothing — the technique never even starts. This page is built on that rule: everything sits on one plane, and you decide what works with what.",
  },
  coverNote: {
    tr: "Kapak karesi boş. Dergi kapağı burada bir görselle değil, adın kendi ölçüsüyle taşınıyor.",
    en: "The cover frame is empty. Here the cover is carried not by a photograph but by the sheer size of the name.",
  },
  portraitAlt: {
    tr: "Nobara Kugisaki — arşivin yüklediği portre",
    en: "Nobara Kugisaki — portrait uploaded by the archive",
  },
  portraitAltFallback: {
    tr: "Nobara Kugisaki — AniList resmî künye portresi (230×345)",
    en: "Nobara Kugisaki — official AniList dossier portrait (230×345)",
  },
} as const;

/**
 * ⚠️ Her `alt` metni KAYNAĞINI söylüyor (Faz 2 §3). Sahne kadrajları
 * küratörün arşive yüklediği kareler, portre ise AniList çekimi — ikisi de
 * alt metninde adıyla anılıyor.
 */
export const NOBARA_ALT = {
  scenePrefix: {
    tr: "Nobara Kugisaki · arşive yüklenen kare —",
    en: "Nobara Kugisaki · frame uploaded to the archive —",
  },
  companionSuffix: {
    tr: "— arşivin karakter portresi",
    en: "— character portrait from the archive",
  },
} as const;

export const NOBARA_SECTIONS = {
  identity: {
    title: { tr: "Künye", en: "Colophon" },
    lede: {
      tr: "AniList kaydından birebir; boş kalan iki satır doldurulmadı.",
      en: "Taken verbatim from the AniList record; the two blank lines were left blank.",
    },
  },
  arts: {
    title: { tr: "Üç teknik", en: "Three techniques" },
    lede: {
      tr: "Bir lanetli teknik, onun mesafeyi yok eden hâli ve içeriden patlayan hâli. Üçü de aynı iki nesneye dayanıyor: bir saman bebek ve bir çivi.",
      en: "One cursed technique, its distance-erasing form, and its bursting-from-within form. All three rest on the same two objects: a straw doll and a nail.",
    },
  },
  kit: {
    title: { tr: "Dört kayıt", en: "Four entries" },
    lede: {
      tr: "Takım çantası, yakıt, bir kereye mahsus bir isabet ve kayıtta olmayan bir teknik.",
      en: "The toolbox, the fuel, a one-off accuracy, and a technique that is not in her record.",
    },
  },
  nails: {
    title: { tr: "Üç çivi", en: "Three nails" },
    lede: {
      tr: "Altı nokta var; sen üçünü seçiyorsun. Üçü belirli bir üçgen kuruyorsa rezonans oluyor ve o teknik açılıyor. Kurmuyorsa hiçbir şey olmuyor — Nobara'nın tek kuralı bu.",
      en: "There are six points; you choose three. If the three form a particular triangle, resonance happens and that technique opens. If they do not, nothing happens — that is Nobara's only rule.",
    },
  },
  fate: {
    title: { tr: "Beş durak", en: "Five stops" },
    lede: {
      tr: "Kendini küçültmeyi hiçbir yerde kabul etmemiş bir on altı yaş.",
      en: "Sixteen years that never once agreed to be made smaller.",
    },
  },
  bonds: {
    title: { tr: "Künye · kadro", en: "Masthead · cast" },
    lede: {
      tr: "Sayfada adı geçen ve arşivde karşılığı olan beş kişi. Dosyası olanın adı bağlantılı, olmayanın adı düz.",
      en: "The five people named on this page who have a counterpart in the archive. Those with a file are linked; those without are plain.",
    },
  },
  closing: {
    title: { tr: "Kapanış", en: "Closing" },
    lede: {
      tr: "Söylenen son cümle bir şikâyet değildi.",
      en: "The last sentence spoken was not a complaint.",
    },
  },
} as const;

/* ── Üç teknik (3 büyük) ────────────────────────────────────────────────── */

export interface NobaraArt {
  key: string;
  /** Romanizasyon — çeviri gerektirmeyen özel ad */
  name: string;
  kanji: string;
  reading: string;
  turkish: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
  imageKey: string;
}

export const NOBARA_ARTS: NobaraArt[] = [
  {
    key: "doll",
    name: "Sūrei Jubō",
    kanji: "芻霊呪法",
    reading: "すうれいじゅほう",
    turkish: { tr: "Saman Bebek Tekniği", en: "Straw Doll Technique" },
    tagline: {
      tr: "Bir bebeği bir bedenin yerine koyar.",
      en: "It puts a doll in place of a body.",
    },
    text: {
      tr: "Nobara'nın lanetli tekniği bir yer değiştirmeye dayanıyor: elindeki saman bebek, bağ kurulan bedenin vekili oluyor. Çekiç bebeğe iniyor, hasar bedende çıkıyor. Bu sayede Nobara hiç yaklaşmadan, hatta hedefi görmeden vurabiliyor. Karşılığında tekniğin tamamı tek bir şarta bağlı: bağın gerçekten kurulmuş olması. Kurulmadıysa çivi yalnızca samanı deliyor.",
      en: "Nobara's cursed technique rests on a substitution: the straw doll in her hand becomes the proxy of a linked body. The hammer falls on the doll, the damage surfaces on the body. This lets her strike without closing in, even without seeing her target. In exchange the whole technique rests on one condition: that the link is genuinely made. If it is not, the nail merely pierces straw.",
    },
    traits: [
      { tr: "Vekil beden", en: "Proxy body" },
      { tr: "Mesafe tanımaz", en: "Distance-agnostic" },
      { tr: "Bağa bağlı", en: "Link-dependent" },
    ],
    imageKey: NOBARA_IMAGE_KEYS.artDoll,
  },
  {
    key: "resonance",
    name: "Kyōmei",
    kanji: "共鳴り",
    reading: "きょうめい",
    turkish: { tr: "Rezonans", en: "Resonance" },
    tagline: {
      tr: "Parçadan bütüne geri döner.",
      en: "It travels back from the fragment to the whole.",
    },
    text: {
      tr: "Hedefin bir parçası — bir saç teli, bir damla kan, kopmuş bir uzuv — bebeğin içine konduğunda çivi artık bebeği değil sahibini buluyor. Menzil kavramı ortadan kalkıyor: parça neredeyse bağ oradan kuruluyor. Nobara'nın tekniğinin gerçek gücü hasarın büyüklüğünde değil, hedefin nerede olduğunu bilmek zorunda olmamasında.",
      en: "When a fragment of the target — a strand of hair, a drop of blood, a severed limb — goes into the doll, the nail no longer finds the doll but its owner. Range stops being a concept: wherever the fragment is, the link runs from there. The real strength of Nobara's technique is not the size of the damage but that she need not know where her target is.",
    },
    traits: [
      { tr: "Bir parça şart", en: "A fragment is required" },
      { tr: "Menzilsiz", en: "No range limit" },
      { tr: "Görüş gerekmez", en: "No line of sight" },
    ],
    imageKey: NOBARA_IMAGE_KEYS.artResonance,
  },
  {
    key: "hairpin",
    name: "Kanzashi",
    kanji: "簪",
    reading: "かんざし",
    turkish: { tr: "Çivi patlaması", en: "Nail detonation" },
    tagline: {
      tr: "İçeri girmiş çiviyi yerinde patlatır.",
      en: "It detonates a nail that is already inside.",
    },
    text: {
      tr: "Önce çivi hedefin içine giriyor, sonra o çivi durduğu yerde patlatılıyor. Hasar dışarıdan değil içeriden geliyor: deriyi delmek yerine dokuyu dağıtıyor. Birden fazla çivi yerleştirilmişse hepsi aynı anda boşaltılabiliyor — Nobara'nın önce yatırım yapıp sonra tahsil ettiği tek hamlesi bu.",
      en: "First the nail goes into the target, then that nail is detonated where it sits. The damage comes from within rather than without, tearing tissue instead of piercing skin. If more than one nail has been placed, all of them can be discharged at once — this is the one move where Nobara invests first and collects later.",
    },
    traits: [
      { tr: "İçeriden hasar", en: "Damage from within" },
      { tr: "Biriktirilebilir", en: "Stackable" },
      { tr: "Tek anda boşalır", en: "Discharged all at once" },
    ],
    imageKey: NOBARA_IMAGE_KEYS.artHairpin,
  },
];

/* ── Dört kayıt (4 küçük) ───────────────────────────────────────────────── */

export interface NobaraKitEntry {
  key: string;
  name: LocalizedText;
  kanji: string;
  reading: string;
  note: LocalizedText;
  imageKey: string;
}

export const NOBARA_KIT: NobaraKitEntry[] = [
  {
    key: "tools",
    name: { tr: "Çekiç ve çiviler", en: "Hammer and nails" },
    kanji: "金槌と釘",
    reading: "かなづちとくぎ",
    note: {
      tr: "Silahı bir kılıç değil bir marangoz takımı. Çiviler lanet enerjisi yüklenerek tek başlarına da atılabiliyor — o hâlde bebeğe ihtiyaç kalmıyor, yalnızca menzil kısalıyor.",
      en: "Her armament is not a blade but a carpenter's kit. Loaded with cursed energy, the nails can also be thrown on their own — no doll needed then, only a shorter reach.",
    },
    imageKey: NOBARA_IMAGE_KEYS.kitTools,
  },
  {
    key: "energy",
    name: { tr: "Lanet enerjisi", en: "Cursed energy" },
    kanji: "呪力",
    reading: "じゅりょく",
    note: {
      tr: "Bütün jujutsu'nun yakıtı. Nobara'nınki dev bir havuz değil; ölçülü ve isabetli harcanıyor. Çivinin ucundaki yük ne kadar temizse hasar o kadar büyük — bu yüzden onunki bir güç meselesi değil bir nişan meselesi.",
      en: "The fuel of all jujutsu. Nobara's is not a vast reservoir; it is spent measured and on target. The cleaner the charge on the nail's tip, the greater the damage — which makes hers a question of aim rather than of power.",
    },
    imageKey: NOBARA_IMAGE_KEYS.kitEnergy,
  },
  {
    key: "flash",
    name: { tr: "Kara şimşek", en: "Black flash" },
    kanji: "黒閃",
    reading: "こくせん",
    note: {
      tr: "Lanet enerjisiyle temas arasındaki gecikme binde bir saniyenin altına indiğinde çıkan siyah kıvılcım. Kimse isteyerek yapamıyor. ⚠️ Bu, çivi patlaması DEĞİL: 簪 bir teknik, 黒閃 bir isabet. Nobara onu bir kez indirdi ve o vuruş kendi tavanını gördüğü an oldu.",
      en: "The black spark that appears when the gap between cursed energy and contact drops below a thousandth of a second. No one can produce it on purpose. ⚠️ This is NOT the nail detonation: 簪 is a technique, 黒閃 is an accuracy. Nobara landed one, and that strike was the moment she saw her own ceiling.",
    },
    imageKey: NOBARA_IMAGE_KEYS.kitFlash,
  },
  {
    key: "reverse",
    name: { tr: "Ters lanet tekniği", en: "Reverse cursed technique" },
    kanji: "反転術式",
    reading: "はんてんじゅつしき",
    note: {
      tr: "Negatif enerjiyi tersine çevirip yara kapatan teknik. Nobara'nın kayıtlarında YOK — kullanamıyor. Bu bölüm burada tam da o yüzden duruyor: bu sayfadaki tek boş satır, bir eksikliğin adı.",
      en: "The technique that inverts negative energy and closes wounds. It is NOT in Nobara's record — she cannot use it. This entry stands here for exactly that reason: the one blank line on this page is the name of an absence.",
    },
    imageKey: NOBARA_IMAGE_KEYS.kitReverse,
  },
];

/* ── Üç çivi: sayfanın kalbi ────────────────────────────────────────────── */

/**
 * Altı sabit çivi noktası — TEK düzlemde, dergi sayfasının üstünde.
 *
 * Koordinatlar yüzde (sol/üst), çünkü alan esnek genişlikte çiziliyor.
 * Altısı bir altıgen kuruyor ve üç geçerli üçgen o altıgenin içinden
 * çıkıyor; kalan on yedi üçlü hiçbir şey yapmıyor.
 *
 * ⚠️ Noktaların adları TEKNİK ADI DEĞİL, NESNE adı. 藁人形 / 釘 / 金槌 /
 * 呪力 / 対象 kaynağın kendi sözcükleri; 一部 ("hedefin bir parçası") ise
 * düz Japonca bir tanım — eski veri dosyasındaki uydurma 形見 etiketi
 * bilerek atıldı (dosya başı, düzeltme 3).
 *
 * ⚠️ DİKEY ARALIK ÖLÇÜLDÜ. Y değerleri (8 · 30 · 30 · 70 · 70 · 92) rastgele
 * değil: iki komşu sıra arasında en az %22 var ve bu, 360 pikselde bile
 * rozetlerin üst üste binmemesi için gereken en küçük aralık. Değiştirirken
 * `.fieldPoints` insetleriyle birlikte yeniden hesapla.
 */
export interface NobaraNailPoint {
  key: string;
  /** Sekme sırasını ve rozet numarasını veren sabit sıra (01…06) */
  order: number;
  x: number;
  y: number;
  kanji: string;
  reading: string;
  label: LocalizedText;
  note: LocalizedText;
}

export const NOBARA_NAIL_POINTS: NobaraNailPoint[] = [
  {
    key: "doll",
    order: 1,
    x: 21,
    y: 30,
    kanji: "藁人形",
    reading: "わらにんぎょう",
    label: { tr: "Saman bebek", en: "Straw doll" },
    note: {
      tr: "Vekil. Bir bedenin yerine geçebilen tek nesne.",
      en: "The proxy. The one object that can stand in for a body.",
    },
  },
  {
    key: "piece",
    order: 2,
    x: 50,
    y: 8,
    kanji: "一部",
    reading: "いちぶ",
    label: { tr: "Hedefin bir parçası", en: "A fragment of the target" },
    note: {
      tr: "Saç, kan, kopmuş bir parça. Bağı kuran şey bu; ne olduğu değil kime ait olduğu önemli.",
      en: "Hair, blood, a torn-off piece. This is what makes the link; what it is matters less than whose it is.",
    },
  },
  {
    key: "nail",
    order: 3,
    x: 79,
    y: 30,
    kanji: "釘",
    reading: "くぎ",
    label: { tr: "Çivi", en: "Nail" },
    note: {
      tr: "Taşıyıcı. Soyadının ilk işareti de bu: 釘崎.",
      en: "The carrier. It is also the first character of her surname: 釘崎.",
    },
  },
  {
    key: "hammer",
    order: 4,
    x: 87,
    y: 70,
    kanji: "金槌",
    reading: "かなづち",
    label: { tr: "Çekiç", en: "Hammer" },
    note: {
      tr: "Kuvvet. Çiviyi içeri sokan tek şey; tek başına yalnızca bir alet.",
      en: "The force. The only thing that drives the nail in; on its own, only a tool.",
    },
  },
  {
    key: "energy",
    order: 5,
    x: 50,
    y: 92,
    kanji: "呪力",
    reading: "じゅりょく",
    label: { tr: "Lanet enerjisi", en: "Cursed energy" },
    note: {
      tr: "Yakıt. İçeride duran çiviyi patlatan yük; yüksüz çivi yalnızca metal.",
      en: "The fuel. The charge that detonates a nail sitting inside; an uncharged nail is only metal.",
    },
  },
  {
    key: "target",
    order: 6,
    x: 13,
    y: 70,
    kanji: "対象",
    reading: "たいしょう",
    label: { tr: "Hedef", en: "Target" },
    note: {
      tr: "Acıyan taraf. Nobara'nın hiç görmek zorunda olmadığı yer.",
      en: "The hurting side. The place Nobara never has to see.",
    },
  },
];

/** Kaç çivi seçilebilir. Üç — ve sayfanın adı bu. */
export const NOBARA_NAIL_LIMIT = 3;

/**
 * Rezonans kuran üç üçlü.
 *
 * `members` nokta anahtarları; sıra önemsiz (istemci sıralayıp
 * karşılaştırıyor). Her üçlünün içeriği tekniğin TARİFİ değil — o zaten
 * "Üç teknik" bölümünde — o kombinasyonun anlatıda GERÇEKTEN göründüğü an.
 */
export interface NobaraTriad {
  key: string;
  members: string[];
  name: string;
  kanji: string;
  reading: string;
  turkish: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
}

export const NOBARA_TRIADS: NobaraTriad[] = [
  {
    key: "surei",
    members: ["doll", "nail", "hammer"],
    name: "Sūrei Jubō",
    kanji: "芻霊呪法",
    reading: "すうれいじゅほう",
    turkish: { tr: "Saman Bebek Tekniği", en: "Straw Doll Technique" },
    title: {
      tr: "Bebek, çivi, çekiç — tekniğin çıplak hâli",
      en: "Doll, nail, hammer — the technique stripped bare",
    },
    text: {
      tr: "Üçü bir arada olduğunda teknik en yalın hâliyle çalışıyor: bebek vekil, çivi taşıyıcı, çekiç kuvvet. Nobara'nın sınıf arkadaşlarıyla çıktığı ilk görevlerde gördüğümüz şey tam olarak bu — terk edilmiş bir binada, elinde bir avuç saman ve bir kutu çiviyle, hedefi hiç görmeden vuran bir on altı yaş.",
      en: "With these three together the technique works at its plainest: the doll is the proxy, the nail the carrier, the hammer the force. This is exactly what we see on her first missions with her classmates — in an abandoned building, with a handful of straw and a box of nails, a sixteen-year-old striking a target she never sees.",
    },
  },
  {
    key: "kyomei",
    members: ["doll", "piece", "target"],
    name: "Kyōmei",
    kanji: "共鳴り",
    reading: "きょうめい",
    turkish: { tr: "Rezonans", en: "Resonance" },
    title: {
      tr: "Bebek, parça, hedef — mesafenin iptali",
      en: "Doll, fragment, target — distance cancelled",
    },
    text: {
      tr: "Bu üçlüde çekiç bile ikinci planda: belirleyici olan bebeğin içine konan parça. Nobara'nın en pahalı hamlesi buradan çıktı — bağ maddesi kendi bedenine girmiş olduğunda rezonansı KENDİ ÜSTÜNDEN kurdu. Yani hedefe ulaşmak için kendini de aynı devrenin içine soktu. Teknik ona bu seçeneği veriyor; kullanmak ayrı bir karar.",
      en: "In this triad even the hammer is secondary: what decides the outcome is the fragment placed inside the doll. Nobara's most expensive move came from here — when the linking matter was already inside her own body, she ran the resonance THROUGH HERSELF. To reach the target she put herself into the same circuit. The technique offers her that option; taking it is a separate decision.",
    },
  },
  {
    key: "kanzashi",
    members: ["nail", "energy", "target"],
    name: "Kanzashi",
    kanji: "簪",
    reading: "かんざし",
    turkish: { tr: "Çivi patlaması", en: "Nail detonation" },
    title: {
      tr: "Çivi, enerji, hedef — içeriden gelen hasar",
      en: "Nail, energy, target — damage from within",
    },
    text: {
      tr: "Bu üçlüde bebek hiç yok: çivi zaten içeride. Geriye kalan tek iş, yükü boşaltmak. Shibuya'da bir kalabalığın ortasında, tek tek yerleştirilmiş çivilerin hepsini aynı anda patlattığı sahne bu kombinasyonun kendisi — önce yatırım, sonra tahsil.",
      en: "In this triad the doll is absent altogether: the nail is already inside. The only work left is to release the charge. The scene at Shibuya, in the middle of a crowd, where every nail she had placed one by one went off at once, is this combination itself — invest first, collect later.",
    },
  },
];

/**
 * Yanlış üçlülerin geri bildirimi.
 *
 * Sırayla değerlendiriliyor: ilk eşleşen kural konuşuyor. `has` seçili
 * OLMASI gereken, `lacks` seçili OLMAMASI gereken nokta anahtarları.
 * Hiçbiri tutmazsa `NOBARA_NAIL_UI.missDefault` yazılıyor.
 *
 * ⚠️ Geri bildirim "yanlış" demiyor — NEDEN olmadığını söylüyor. Sayfanın
 * tezi bu: bağ yoksa etki yok, ama bağın neden kurulmadığı bilgi.
 */
export interface NobaraMissRule {
  key: string;
  has: string[];
  lacks: string[];
  text: LocalizedText;
}

export const NOBARA_MISSES: NobaraMissRule[] = [
  {
    key: "no-carrier",
    has: [],
    lacks: ["nail", "piece"],
    text: {
      tr: "Ne çivi var ne de bir parça. Elinde yalnızca malzeme kaldı; teknik hiç başlamıyor.",
      en: "Neither a nail nor a fragment. All you are holding is material; the technique never starts.",
    },
  },
  {
    key: "piece-no-doll",
    has: ["piece"],
    lacks: ["doll"],
    text: {
      tr: "Parça elinde ama içine koyacağın bebek yok. Bağ maddesi tek başına hiçbir yere bağlanmıyor.",
      en: "You have the fragment but no doll to put it in. On its own, the linking matter connects to nothing.",
    },
  },
  {
    key: "direct-hit",
    has: ["hammer", "target"],
    lacks: ["doll"],
    text: {
      tr: "Çekici doğrudan hedefe indiriyorsun. Bu bir kavga, teknik değil: Nobara'nın vuruşu araya her zaman bir vekil koyar.",
      en: "You are bringing the hammer straight down on the target. That is a brawl, not a technique: Nobara's blow always puts a proxy in between.",
    },
  },
  {
    key: "doll-piece-no-target",
    has: ["doll", "piece"],
    lacks: ["target"],
    text: {
      tr: "Bebek hazır, parça içinde — ama karşıda bağlanacak bir beden seçilmedi. Rezonans boşa titriyor.",
      en: "The doll is ready and the fragment is inside — but no body was chosen on the other end. The resonance rings into nothing.",
    },
  },
  {
    key: "tools-no-proxy",
    has: ["nail", "hammer"],
    lacks: ["doll"],
    text: {
      tr: "Çekiç ve çivi var, vurulacak vekil yok. Çivi samana değil havaya iniyor.",
      en: "Hammer and nail, but nothing to strike. The nail lands in air, not in straw.",
    },
  },
  {
    key: "energy-no-nail",
    has: ["energy"],
    lacks: ["nail"],
    text: {
      tr: "Lanet enerjisi yüklenecek bir çivi yok. 呪力 tek başına bir teknik değil, bir yakıt.",
      en: "There is no nail to charge. On its own, 呪力 is not a technique but a fuel.",
    },
  },
  {
    key: "nail-no-force",
    has: ["doll", "nail"],
    lacks: ["hammer", "energy"],
    text: {
      tr: "Çivi bebeğin üstünde duruyor ama onu içeri sokan hiçbir şey yok. Ne çekiç ne yük.",
      en: "The nail is resting on the doll with nothing to drive it in. No hammer, no charge.",
    },
  },
  {
    key: "charged-no-drive",
    has: ["doll", "nail", "energy"],
    lacks: [],
    text: {
      tr: "Çivi yüklü ve bebek elinde — ama onu içeri sokacak çekiç de, bağlanacak bir hedef de yok. Lanet enerjisi tek başına saman delmiyor.",
      en: "The nail is charged and the doll is in your hand — but there is no hammer to drive it in and no target to link to. On its own, cursed energy does not pierce straw.",
    },
  },
];

export const NOBARA_NAIL_UI = {
  fieldLabel: {
    tr: "Çivi alanı — altı sabit nokta",
    en: "The nail field — six fixed points",
  },
  counterLabel: { tr: "Seçili çivi", en: "Nails chosen" },
  selectHint: {
    tr: "Her nokta bir düğme. Sekmeyle gez, boşluk ya da enter ile çivi çak; aynı noktaya tekrar basmak çiviyi söker. Üç çiviyi birden taşıyamazsın: dördüncüyü seçmek için birini sökmen gerekiyor.",
    en: "Every point is a button. Tab through them and drive a nail with space or enter; pressing the same point again pulls it. You cannot carry more than three: to choose a fourth you must pull one out.",
  },
  resetLabel: { tr: "Çivileri topla", en: "Pull every nail" },
  statusIdle: {
    tr: "Alan boş. Üç çivi seç.",
    en: "The field is empty. Choose three nails.",
  },
  statusOne: {
    tr: "Bir çivi çakıldı. İki tane daha.",
    en: "One nail driven. Two to go.",
  },
  statusTwo: {
    tr: "İki çivi çakıldı. Üçüncüsü üçgeni kapatacak.",
    en: "Two nails driven. The third will close the triangle.",
  },
  statusFull: {
    tr: "Üç çivin var. Dördüncüyü çakmak için önce birini sök.",
    en: "You are holding three nails. To drive a fourth, pull one first.",
  },
  statusReset: {
    tr: "Bütün çiviler söküldü. Alan yeniden boş.",
    en: "Every nail has been pulled. The field is empty again.",
  },
  hitPrefix: { tr: "Rezonans oldu:", en: "Resonance:" },
  missPrefix: { tr: "Rezonans olmadı:", en: "No resonance:" },
  missDefault: {
    tr: "Bu üç nokta arasında bir bağ yok — ve bağ yoksa hiçbir şey olmuyor. Nobara'nın tek kuralı bu.",
    en: "There is no link between these three points — and with no link, nothing happens. That is Nobara's only rule.",
  },
  linesOn: {
    tr: "Rezonans açık: çalışan üç üçgen alanın üstünde çizili.",
    en: "Resonance on: the three working triangles are drawn over the field.",
  },
  linesOff: {
    tr: "Rezonans kapalı: bağ çizgileri görünmüyor. Hangi üçlünün çalıştığını yukarıdaki tekniklerden çıkarabilirsin.",
    en: "Resonance off: the link lines are hidden. You can work out which triad rings from the techniques above.",
  },
  foundLabel: { tr: "Bulunan üçgen", en: "Triangles found" },
  openedTitle: { tr: "Açılan kayıt", en: "Opened entry" },
} as const;

/* ── Beş durak ──────────────────────────────────────────────────────────── */

export interface NobaraStop {
  key: string;
  /** Yaş/an etiketi — MEVSİM İDDİASI TAŞIMAZ (dosya başı, düzeltme 1) */
  stamp: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: string; reading: LocalizedText; by: LocalizedText };
  kin?: { characterId: number; name: string; role: LocalizedText };
  imageKey: string;
}

export const NOBARA_TIMELINE: NobaraStop[] = [
  {
    key: "village",
    stamp: { tr: "çocukluk · kasaba", en: "childhood · the town" },
    title: { tr: "Kalınmayacak kasaba", en: "The town no one stays in" },
    text: {
      tr: "Küçük bir kasabada, herkesin herkesi izlediği bir yerde büyüdü. Şehirden gelip bir süre kalan ve sonra dönüp giden bir kız gördü; kasabanın o kıza yaptığı şey Nobara'nın oradan çıkma kararını kesinleştirdi. Sevdiği şeyleri savunmayı da orada öğrendi — çünkü orada sevdiği şeyler savunulmayı gerektiriyordu.",
      en: "She grew up in a small town where everyone watched everyone. She saw a girl arrive from the city, stay a while, and go back; what the town did to that girl settled her decision to leave. She also learned there to defend the things she liked — because there, the things she liked needed defending.",
    },
    imageKey: NOBARA_IMAGE_KEYS.fateVillage,
  },
  {
    key: "school",
    stamp: { tr: "16 yaş · okula geliş", en: "age 16 · arriving at school" },
    title: { tr: "Kendini tanıtma", en: "The introduction" },
    text: {
      tr: "Tokyo Jujutsu Lisesi'ne geldiği gün iki sınıf arkadaşıyla tanıştı ve ilk cümlesi bir selam değil bir sıralama oldu. Kaba görünen bu giriş bir poz değildi: Nobara ne olduğunu baştan söyleyip sonra sözünü tutan bir insan. Büyücü olmasının sebebi bir görev duygusu da değildi — Jujutsu Lisesi ona bir amaçtan önce bir ADRES verdi.",
      en: "The day she arrived at Tokyo Jujutsu High she met two classmates, and her first sentence was not a greeting but a ranking. The rudeness was not a pose: Nobara states what she is up front and then keeps her word. Nor was duty what made her a sorcerer — Jujutsu High gave her an ADDRESS before it gave her a purpose.",
    },
    kin: {
      characterId: 127212,
      name: "Yuuji Itadori",
      role: { tr: "Sınıf arkadaşı", en: "Classmate" },
    },
    imageKey: NOBARA_IMAGE_KEYS.fateSchool,
  },
  {
    key: "exchange",
    stamp: {
      tr: "16 yaş · okullar arası karşılaşma",
      en: "age 16 · the exchange event",
    },
    title: { tr: "Küçültülmeyi reddetmek", en: "Refusing to be made small" },
    text: {
      tr: "Kyoto'yla yapılan okullar arası karşılaşmada karşısına çıkan şey yalnızca bir rakip değildi: ona nasıl bir kız olması gerektiğini söyleyen bir ses de vardı. Nobara ikisine de aynı cevabı verdi. Hem güzel olmayı hem güçlü olmayı aynı anda istemenin bir çelişki sayılmasını hiç kabul etmedi — bu, sayfadaki en net karakter anı.",
      en: "At the inter-school event against Kyoto, what faced her was not only an opponent: there was also a voice telling her what kind of girl she ought to be. Nobara gave both the same answer. She never once accepted that wanting to be beautiful and wanting to be strong at the same time was a contradiction — this is the clearest moment of character on the page.",
    },
    quote: {
      text: "私は釘崎野薔薇だ",
      reading: {
        tr: "Ben Nobara Kugisaki'yim.",
        en: "I am Nobara Kugisaki.",
      },
      by: {
        tr: "Nobara — kendini tanıtırken",
        en: "Nobara — introducing herself",
      },
    },
    imageKey: NOBARA_IMAGE_KEYS.fateExchange,
  },
  {
    key: "painting",
    stamp: {
      tr: "16 yaş · Ölüm Resmi kardeşleri",
      en: "age 16 · the Death Painting brothers",
    },
    title: { tr: "Kara şimşek", en: "The black flash" },
    text: {
      tr: "Yanında dövüşen sınıf arkadaşıyla birlikte, kimsenin isteyerek yapamadığı vuruşu indirdi. Aynı dövüşte rezonansı kendi bedeninden geçirmeyi de göze aldı: bağ maddesi içerideyken devreyi kendi üstünden kurdu. Kara şimşek bir teknik değil bir isabet; bir kez olması bile bir büyücünün kendi tavanını görmesi demek.",
      en: "Fighting beside her classmate, she landed the strike no one can produce on purpose. In the same fight she also accepted running the resonance through her own body: with the linking matter inside her, she closed the circuit through herself. The black flash is not a technique but an accuracy; landing one even once means a sorcerer has seen their own ceiling.",
    },
    imageKey: NOBARA_IMAGE_KEYS.fatePainting,
  },
  {
    key: "shibuya",
    stamp: { tr: "16 yaş · 31 Ekim, Shibuya", en: "age 16 · 31 October, Shibuya" },
    title: { tr: "Açık bırakılan son", en: "An ending left open" },
    text: {
      tr: "Shibuya'da ruhun kendisine dokunabilen bir laneti karşısında buldu — yani tekniğinin ulaşamadığı tek yere vurabilen birini. Vekil beden orada işe yaramıyor: bağ kurulacak yer bir beden değil. Sahnenin sonucu anlatıda uzun süre AÇIKTA bırakıldı ve arşiv anime kadar ilerleyip orada duruyor. Kesin olan tek şey son cümlesinin bir şikâyet olmadığı.",
      en: "At Shibuya she came up against a curse able to touch the soul itself — someone who could strike the one place her technique could not reach. A proxy body is useless there: the thing to be linked is not a body. The outcome of that scene was left OPEN in the story for a long time, and the archive follows the anime and stops where it stops. The one certainty is that her last sentence was not a complaint.",
    },
    quote: {
      text: "悪くないじゃん、私の人生",
      reading: {
        tr: "Fena değilmiş, benim hayatım.",
        en: "Not bad at all, this life of mine.",
      },
      by: {
        tr: "Nobara — Shibuya'daki son sahnesinde",
        en: "Nobara — in her last scene at Shibuya",
      },
    },
    kin: {
      characterId: 133702,
      name: "Mahito",
      role: { tr: "Karşısındaki lanet", en: "The curse she faced" },
    },
    imageKey: NOBARA_IMAGE_KEYS.fateShibuya,
  },
];

/* ── Kadro (Nexus bağları) ──────────────────────────────────────────────── */

/**
 * ⚠️ Bu liste `EXPERIENCE_COMPANIONS[133700]` ile BİREBİR aynı olmalı —
 * Dalga 1'in dördüncü dersi (Armin sayfası listede olmayan bir portre
 * çiziyordu). Merkezdeki kayıt: `[127212, 126635, 127691, 133702, 133704]`.
 */
export interface NobaraBond {
  characterId: number;
  name: string;
  nameNative: string;
  role: LocalizedText;
  line: LocalizedText;
}

export const NOBARA_BONDS: NobaraBond[] = [
  {
    characterId: 127212,
    name: "Yuuji Itadori",
    nameNative: "虎杖悠仁",
    role: { tr: "Sınıf arkadaşı", en: "Classmate" },
    line: {
      tr: "İlk gün sıralamaya soktuğu iki kişiden biri; birkaç görev sonra ona en yakın duran kişi oldu. Kara şimşeği onun yanında indirdi.",
      en: "One of the two people she ranked on day one; a few missions later, the one standing closest to her. She landed her black flash beside him.",
    },
  },
  {
    characterId: 126635,
    name: "Megumi Fushiguro",
    nameNative: "伏黒恵",
    role: { tr: "Sınıf arkadaşı", en: "Classmate" },
    line: {
      tr: "Aynı sınıfın üçüncü kişisi ve Nobara'nın tam zıddı: o hesap yapar, Nobara vurur. İkisi de bunu bildiği için takım çalışıyor.",
      en: "The third of the same class and Nobara's exact opposite: he calculates, she strikes. The team works because both of them know it.",
    },
  },
  {
    characterId: 127691,
    name: "Satoru Gojou",
    nameNative: "五条悟",
    role: { tr: "Öğretmeni", en: "Her teacher" },
    line: {
      tr: "Üç birinci sınıfın da öğretmeni. Nobara'ya bir kalıp vermek yerine onu olduğu gibi bırakması, sayfadaki en sessiz kararlardan biri.",
      en: "Teacher to all three first-years. That he left Nobara as she was instead of handing her a mould is one of the quietest decisions on this page.",
    },
  },
  {
    characterId: 133704,
    name: "Kento Nanami",
    nameNative: "七海建人",
    role: { tr: "Kıdemli büyücü", en: "Senior sorcerer" },
    line: {
      tr: "Aynı gece Shibuya'daydı. Nobara'nın ölçülülüğü ondan gelmiyor ama ikisi de işi bir mesai gibi değil bir sorumluluk gibi taşıyor.",
      en: "He was in Shibuya the same night. Nobara's measure does not come from him, yet both carry the work as a responsibility rather than a shift.",
    },
  },
  {
    characterId: 133702,
    name: "Mahito",
    nameNative: "真人",
    role: { tr: "Karşısındaki lanet", en: "The curse she faced" },
    line: {
      tr: "Ruha dokunan lanet. Nobara'nın tekniğinin ulaşamadığı tek yere vurabilen kişi olduğu için sayfadaki tek gerçek tehdit o.",
      en: "The curse that touches the soul. He is the only real threat on this page because he can strike the one place her technique cannot reach.",
    },
  },
];

export const NOBARA_BOND_UI = {
  hasPage: { tr: "arşivde dosyası var", en: "has a file in the archive" },
  noPage: { tr: "dosyası yok", en: "no file yet" },
} as const;

/* ── Evren bağları (Lanetli Arşiv çapaları) ─────────────────────────────── */

/**
 * ⚠️ Çapa adları merkezde doğrulandı: `lib/anime/jjk/anchors.ts` içinde
 * `society`, `grades` ve `shibuya` gerçekten var. Adres elle yazılmıyor,
 * `animeHref.jjk()` ile birleşiyor.
 */
export interface NobaraAnchor {
  anchor: string;
  kanji: string;
  label: LocalizedText;
  note: LocalizedText;
}

export const NOBARA_ANCHORS: NobaraAnchor[] = [
  {
    anchor: "society",
    kanji: "高専",
    label: { tr: "Tokyo Jujutsu Lisesi", en: "Tokyo Jujutsu High" },
    note: {
      tr: "Nobara'nın adresi. Büyücülüğü bir çağrı değil, şehirde yaşamanın yolu olarak seçti.",
      en: "Nobara's address. She took up sorcery not as a calling but as the way to live in the city.",
    },
  },
  {
    anchor: "grades",
    kanji: "等級",
    label: { tr: "Derece düzeni", en: "The grade system" },
    note: {
      tr: "Kayıtta 3. sınıf. Derecesi tekniğinin tavanını değil, kaç görev gördüğünü anlatıyor.",
      en: "Grade 3 on the record. Her grade describes how many missions she has seen, not the ceiling of her technique.",
    },
  },
  {
    anchor: "shibuya",
    kanji: "渋谷",
    label: { tr: "Shibuya olayı", en: "The Shibuya Incident" },
    note: {
      tr: "31 Ekim. Sayfanın beşinci durağı orada bitiyor ve orada açık kalıyor.",
      en: "31 October. The fifth stop of this page ends there, and stays open there.",
    },
  },
];

export const NOBARA_ANCHOR_UI = {
  title: { tr: "Lanetli Arşiv'de", en: "In the Cursed Archive" },
  lede: {
    tr: "Evren sayfasının Nobara'yı ilgilendiren üç bölümü.",
    en: "The three sections of the universe page that concern Nobara.",
  },
} as const;

/* ── Kapanış ────────────────────────────────────────────────────────────── */

export const NOBARA_CLOSING = {
  quotes: [
    {
      text: "私は釘崎野薔薇だ",
      reading: { tr: "Ben Nobara Kugisaki'yim.", en: "I am Nobara Kugisaki." },
      by: { tr: "Nobara Kugisaki", en: "Nobara Kugisaki" },
      note: {
        tr: "Kendini tanıtırken — bir açıklama değil, tartışmanın kapatılması.",
        en: "Introducing herself — not an explanation but the closing of an argument.",
      },
    },
    {
      text: "悪くないじゃん、私の人生",
      reading: {
        tr: "Fena değilmiş, benim hayatım.",
        en: "Not bad at all, this life of mine.",
      },
      by: { tr: "Nobara Kugisaki", en: "Nobara Kugisaki" },
      note: {
        tr: "Shibuya'daki son sahnesinde. On altı yıl bir pişmanlıkla değil, bir onayla kapanıyor.",
        en: "In her last scene at Shibuya. Sixteen years close not on regret but on approval.",
      },
    },
  ],
  motto: "共鳴り",
  mottoNote: {
    tr: "Kyōmei — «birlikte titremek». Adı bir vuruşu değil bir BAĞI anlatıyor: iki şey aynı anda titreşiyorsa aralarındaki mesafenin bir önemi yok.",
    en: "Kyōmei — “to ring together”. The name describes not a blow but a LINK: if two things vibrate at once, the distance between them stops mattering.",
  },
  credit: {
    tr: "Künye, portre, doğum tarihi, boy ve derece bilgisi AniList'ten:",
    en: "Dossier, portrait, date of birth, height and grade from AniList:",
  },
  creditLink: {
    tr: "AniList · Nobara Kugisaki #133700",
    en: "AniList · Nobara Kugisaki #133700",
  },
  creditNote: {
    tr: "Sayfadaki bütün desenler, saman bebek silueti ve çivi işaretleri elle çizilmiş SVG — dışarıdan indirilmiş ya da bağlanmış tek bir raster yok. Portre depoda duruyor (230×345).",
    en: "Every pattern on this page, the straw-doll silhouette and the nail marks, is hand-drawn SVG — not one raster is downloaded from or linked to an outside host. The portrait lives in the repository (230×345).",
  },
} as const;

export const NOBARA_GAPS = {
  title: { tr: "Boş kadrajlar", en: "Empty frames" },
  empty: { tr: "boş", en: "empty" },
  filled: { tr: "dolu", en: "filled" },
  allFilled: {
    tr: "Bütün kadrajlar dolu. Dergi artık renk bloklarıyla değil görsellerle kanıyor.",
    en: "Every frame is filled. The magazine now bleeds with pictures rather than colour blocks.",
  },
} as const;
