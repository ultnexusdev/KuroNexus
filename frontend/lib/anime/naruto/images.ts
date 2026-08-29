/**
 * Naruto Evreni — küratör görsel yuvaları.
 *
 * Akatsuki sergisindeki `EXHIBIT_IMAGE_KEYS` deseninin aynısı: görsel
 * `CharacterImage` tablosunda `slot="ABILITY"` + `abilityName=<anahtar>`
 * olarak durur, sahibi `NARUTO_OWNER_ID`dir. Böylece yeni bir tablo/migration
 * gerekmeden sayfaya istediğin kadar kadraj bağlanabiliyor.
 *
 * ── NEDEN HOTLINK YOK ────────────────────────────────────────────────────
 * Küratör bir adres yapıştırdığında backend görseli İNDİRİP kendi diskimize
 * yazıyor (`POST /admin/uploads/from-url`). İki sebep: CSP `img-src`
 * yalnızca sayılı sunucuya izin veriyor (yabancı adres tarayıcıda sessizce
 * engellenir) ve dış adres bir gün ölürse görsel de ölür.
 *
 * ── YUVA DOLU DEĞİLSE ────────────────────────────────────────────────────
 * Bölüm görselsiz çizilir; hiçbir yerde boş çerçeve durmaz (boş oda yasağı).
 * Yani sayfa görsele borçlu değil, görsel geldikçe zenginleşiyor.
 *
 * ── ⚠️ BOYUT ARTIK MANİFESTODA (29 Ağustos 2026) ─────────────────────────
 * Her yuva önerilen piksel ölçüsünü taşıyor ve yükleyici onu ekrana
 * basıyor. Sebebi kullanıcı isteği: kareler ÜRETİLİYOR ve üretmeden önce
 * hangi oranda olacağını bilmek gerekiyor. Oran ayrıca yazılmıyor,
 * boyuttan hesaplanıyor — iki alan tutmak birinin unutulması demekti.
 */

/** Kadro portresi — dikey, omuz üstü. Bütün `PORTRAIT` yuvalarının ölçüsü. */
export const NARUTO_PORTRAIT_SIZE = { w: 400, h: 600 } as const;

export const NARUTO_IMAGE_KEYS = {
  /** Açılış — tam kadraj hero fonu */
  hero: "naruto:hero",
  /** Shinobi Dünyası — harita bölümünün zemini */
  atlas: "naruto:atlas",
  /**
   * Haritanın KENDİSİ — iğnelerin üzerinde durduğu kadraj.
   *
   * ⚠️ `atlas` ile karıştırma: o bölümün arka fonu, bu harita kutusunun
   * içi. İkincisi 29 Ağustos 2026'da açıldı; iğneler bugüne kadar boş bir
   * zeminde duruyordu ve coğrafya yalnızca birbirlerine göre okunuyordu.
   */
  map: "naruto:map",
  /** Köyler şeridi — Konoha kadrajı */
  konoha: "naruto:konoha",
  /** İkonik Mekânlar — Hokage Kayalığı */
  hokageRock: "naruto:hokage-rock",
  /** Efsaneler bölümünün arka bandı */
  legends: "naruto:legends",
  /** Klanlar — Uchiha / Senju ikili bandı */
  clans: "naruto:clans",
  /** Gölgeler — Akatsuki kapısının kendi fonu (yoksa serginin
      `akatsuki:legion` kadrajı ödünç alınır, eski davranış) */
  shadows: "naruto:shadows",
  /** Chakra bölümü — doğa dönüşümleri fonu */
  chakra: "naruto:chakra",
  /** Dōjutsu bölümü — göz kadrajı */
  dojutsu: "naruto:dojutsu",
  /** Kuyruklu Canavarlar bölümünün fonu */
  bijuu: "naruto:bijuu",
  /** Hokage Salonu — salonun kendi zemini (kapıların ardındaki ışık) */
  hokageHall: "naruto:hokage-hall",
  /** Tarih bölümü — savaş bandı */
  history: "naruto:history",
  /** Efsanevi Savaşlar — Son Vadisi */
  valley: "naruto:valley",
  /** Yasak Parşömenler — kapanış bandı */
  scrolls: "naruto:scrolls",
} as const;

export type NarutoImageKey =
  (typeof NARUTO_IMAGE_KEYS)[keyof typeof NARUTO_IMAGE_KEYS];

/**
 * Doğa dönüşümü panellerinin görsel anahtarları — künyenin içindeki
 * element kadrajı (`NarutoChakra` çizer). Aynı ABILITY yuvası deseni.
 */
export function narutoElementKey(elementId: string): string {
  return `naruto:element:${elementId}`;
}

export const NARUTO_ELEMENT_IDS = [
  "fire",
  "wind",
  "lightning",
  "water",
  "earth",
] as const;

/**
 * Kuyruklu canavar sahnesinin görsel anahtarı — jinchūriki + bijuu
 * illüstrasyonu (`BijuuStage` tam kadraj çizer). Aynı ABILITY deseni.
 */
export function narutoBijuuKey(slug: string): string {
  return `naruto:bijuu:${slug}`;
}

/** Dōjutsu kartının kendi kadrajı — gözün yakın planı (29 Ağustos 2026) */
export function narutoEyeKey(eyeId: string): string {
  return `naruto:eye:${eyeId}`;
}

/** Jutsu kartının kendi kadrajı — tekniğin anı (29 Ağustos 2026) */
export function narutoJutsuKey(slug: string): string {
  return `naruto:jutsu:${slug}`;
}

/**
 * HARİTA İĞNELERİ — koordinatların yaşadığı yer.
 *
 * ── ⚠️ BU YUVA BİR GÖRSEL TAŞIMIYOR, BİR KOORDİNAT TAŞIYOR ───────────────
 * Sayfanın geri kalanı `CharacterImage` (ABILITY) mekanizmasını kullanıyor;
 * iğneler ise `CuratedImage` tablosunda duruyor. Sebep tek bir alan:
 * o tablonun `position` sütunu zaten CSS `object-position` biçiminde bir
 * koordinat çifti ("38% 42%") ve backend'de `^\d{1,3}% \d{1,3}%$` ile
 * doğrulanıyor. `url` da nullable.
 *
 * Yani iğne editörü için YENİ TABLO, YENİ UÇ ve MIGRATION GEREKMEDİ —
 * `slotId` serbest metin olduğu için backend deploy'u bile gerekmiyor
 * (gerekçesi `SetCuratedImageDto` başlığında yazılı ve tam olarak bunun
 * için alınmış bir karar).
 *
 * ⚠️ HASSASİYET TAM SAYI YÜZDE. Doğrulama ondalık kabul etmiyor, yani
 * iğneler %1'lik ızgaraya oturuyor (900px'lik haritada ~9px). Şematik bir
 * harita için fazlasıyla yeterli; bir gün daha ince gerekirse `position`
 * değil AYRI bir alan açılmalı — bu sütunun sözleşmesi CSS.
 *
 * ⚠️ Koordinat yoksa `NARUTO_NATIONS` içindeki elle yazılmış değer geçerli.
 * Yani editör kullanılmasa da harita doğru duruyor ve kayıt silinirse
 * koda geri düşüyor.
 */
export const NARUTO_MAP_SURFACE = "anime/naruto";

export function narutoPinSlotId(nationId: string): string {
  return `naruto:pin:${nationId}`;
}

/* ⚠️ HOKAGE İÇİN AYRI YUVA AÇILMADI ve bu bilinçli.
   Kapı açıldığında salona giren kare, kişinin ZATEN var olan
   `PORTRAIT` kaydı. Sayfanın sözleşmesi bu: "portre bir kez
   yüklenir, her yerde birden değişir" (takım çipi, dönem figürü,
   karakter dosyası hepsi aynı satırı okuyor). İkinci bir yuva
   küratöre aynı yüzü iki kez yükletir ve ikisi bir gün ayrışırdı. */

export interface NarutoImageSlot {
  key: string;
  label: string;
  hint: string;
  /** Önerilen piksel ölçüsü — oran bundan hesaplanıyor */
  size: { w: number; h: number };
}

/* Tekrar eden ölçüler tek yerde: bir gün panel oranı değişirse
   dokuz yuva birden değişsin, sekizi değişip biri kalmasın. */
const BAND = { w: 2560, h: 1080 } as const; /* geniş bant, 64:27 */
const SCENE = { w: 1920, h: 1080 } as const; /* bölüm fonu, 16:9 */
const PANEL = { w: 1600, h: 900 } as const; /* panel kadrajı, 16:9 */
const CARD = { w: 1280, h: 720 } as const; /* jutsu kartı, 16:9 */
const EYE = { w: 800, h: 800 } as const; /* dōjutsu kartı, 1:1 */

/** Küratör kuşağında listelenen yuvalar — sıra sayfadaki sırayla aynı */
export const NARUTO_IMAGE_SLOTS: NarutoImageSlot[] = [
  { key: NARUTO_IMAGE_KEYS.hero, label: "Açılış fonu", hint: "Tam kadraj, yatay. Metin sol üstte duruyor; kompozisyonun ağırlığı sağda olsun.", size: BAND },
  { key: NARUTO_IMAGE_KEYS.atlas, label: "Shinobi Dünyası fonu", hint: "Bölümün arka zemini — haritanın kendisi değil.", size: SCENE },
  { key: NARUTO_IMAGE_KEYS.map, label: "Harita", hint: "İğnelerin üzerinde duracağı kadraj. Kıta şeması; üstüne on iğne biniyor, o yüzden sakin ve düşük kontrastlı olsun.", size: { w: 2000, h: 1400 } },
  { key: NARUTO_IMAGE_KEYS.konoha, label: "Konohagakure", hint: "Köyler şeridindeki Konoha kadrajı.", size: PANEL },
  { key: NARUTO_IMAGE_KEYS.hokageRock, label: "Hokage Kayalığı", hint: "İkonik Mekânlar bölümü.", size: SCENE },
  { key: NARUTO_IMAGE_KEYS.legends, label: "Efsaneler bandı", hint: "Kadro duvarının arka fonu.", size: SCENE },
  { key: NARUTO_IMAGE_KEYS.clans, label: "Klanlar bandı", hint: "Uchiha / Senju ikili bandı.", size: SCENE },
  { key: NARUTO_IMAGE_KEYS.shadows, label: "Gölgeler · Akatsuki fonu", hint: "Akatsuki kapısının kendi kadrajı; boşsa sergiden ödünç alınır.", size: BAND },
  { key: NARUTO_IMAGE_KEYS.chakra, label: "Chakra fonu", hint: "Doğa dönüşümleri bölümünün fonu.", size: SCENE },
  { key: narutoElementKey("fire"), label: "Element · Ateş", hint: "Katon panelinin kadrajı.", size: PANEL },
  { key: narutoElementKey("wind"), label: "Element · Rüzgâr", hint: "Fūton panelinin kadrajı.", size: PANEL },
  { key: narutoElementKey("lightning"), label: "Element · Yıldırım", hint: "Raiton panelinin kadrajı.", size: PANEL },
  { key: narutoElementKey("water"), label: "Element · Su", hint: "Suiton panelinin kadrajı.", size: PANEL },
  { key: narutoElementKey("earth"), label: "Element · Toprak", hint: "Doton panelinin kadrajı.", size: PANEL },
  { key: NARUTO_IMAGE_KEYS.dojutsu, label: "Dōjutsu fonu", hint: "Göz bölümünün arka kadrajı.", size: SCENE },
  { key: narutoEyeKey("sharingan"), label: "Göz · Sharingan", hint: "Gözün yakın planı, kare kadraj. İris ortada.", size: EYE },
  { key: narutoEyeKey("mangekyo"), label: "Göz · Mangekyō Sharingan", hint: "Gözün yakın planı, kare kadraj. İris ortada.", size: EYE },
  { key: narutoEyeKey("eternal"), label: "Göz · Eternal Mangekyō", hint: "Gözün yakın planı, kare kadraj. İris ortada.", size: EYE },
  { key: narutoEyeKey("rinnegan"), label: "Göz · Rinnegan", hint: "Gözün yakın planı, kare kadraj. İris ortada.", size: EYE },
  { key: narutoEyeKey("byakugan"), label: "Göz · Byakugan", hint: "Gözün yakın planı, kare kadraj. İris ortada.", size: EYE },
  { key: narutoEyeKey("tenseigan"), label: "Göz · Tenseigan", hint: "Gözün yakın planı, kare kadraj. İris ortada.", size: EYE },
  { key: narutoEyeKey("rinnesharingan"), label: "Göz · Rinne Sharingan", hint: "Gözün yakın planı, kare kadraj. İris ortada.", size: EYE },
  { key: narutoEyeKey("jogan"), label: "Göz · Jōgan", hint: "Gözün yakın planı, kare kadraj. İris ortada.", size: EYE },
  { key: narutoJutsuKey("rasengan"), label: "Jutsu · Rasengan", hint: "Tekniğin anı. Kartın alt yarısına metin biniyor, ağırlık üstte olsun.", size: CARD },
  { key: narutoJutsuKey("chidori"), label: "Jutsu · Chidori", hint: "Tekniğin anı. Kartın alt yarısına metin biniyor, ağırlık üstte olsun.", size: CARD },
  { key: narutoJutsuKey("amaterasu"), label: "Jutsu · Amaterasu", hint: "Tekniğin anı. Kartın alt yarısına metin biniyor, ağırlık üstte olsun.", size: CARD },
  { key: narutoJutsuKey("susanoo"), label: "Jutsu · Susanoo", hint: "Tekniğin anı. Kartın alt yarısına metin biniyor, ağırlık üstte olsun.", size: CARD },
  { key: narutoJutsuKey("kamui"), label: "Jutsu · Kamui", hint: "Tekniğin anı. Kartın alt yarısına metin biniyor, ağırlık üstte olsun.", size: CARD },
  { key: narutoJutsuKey("hiraishin"), label: "Jutsu · Uçan Gök Gürültüsü", hint: "Tekniğin anı. Kartın alt yarısına metin biniyor, ağırlık üstte olsun.", size: CARD },
  { key: narutoJutsuKey("hachimon"), label: "Jutsu · Sekiz Kapı", hint: "Tekniğin anı. Kartın alt yarısına metin biniyor, ağırlık üstte olsun.", size: CARD },
  { key: narutoJutsuKey("edo-tensei"), label: "Jutsu · Edo Tensei", hint: "Tekniğin anı. Kartın alt yarısına metin biniyor, ağırlık üstte olsun.", size: CARD },
  { key: narutoJutsuKey("chibaku-tensei"), label: "Jutsu · Chibaku Tensei", hint: "Tekniğin anı. Kartın alt yarısına metin biniyor, ağırlık üstte olsun.", size: CARD },
  { key: NARUTO_IMAGE_KEYS.bijuu, label: "Bijuu fonu", hint: "Kuyruklu Canavarlar bölümünün fonu.", size: SCENE },
  { key: narutoBijuuKey("shukaku"), label: "Bijuu · Shukaku", hint: "Gaara + Shukaku sahnesi.", size: PANEL },
  { key: narutoBijuuKey("matatabi"), label: "Bijuu · Matatabi", hint: "Yugito + Matatabi sahnesi.", size: PANEL },
  { key: narutoBijuuKey("isobu"), label: "Bijuu · Isobu", hint: "Yagura + Isobu sahnesi.", size: PANEL },
  { key: narutoBijuuKey("son-goku"), label: "Bijuu · Son Gokū", hint: "Rōshi + Son Gokū sahnesi.", size: PANEL },
  { key: narutoBijuuKey("kokuo"), label: "Bijuu · Kokuō", hint: "Han + Kokuō sahnesi.", size: PANEL },
  { key: narutoBijuuKey("saiken"), label: "Bijuu · Saiken", hint: "Utakata + Saiken sahnesi.", size: PANEL },
  { key: narutoBijuuKey("chomei"), label: "Bijuu · Chōmei", hint: "Fū + Chōmei sahnesi.", size: PANEL },
  { key: narutoBijuuKey("gyuki"), label: "Bijuu · Gyūki", hint: "Killer B + Gyūki sahnesi.", size: PANEL },
  { key: narutoBijuuKey("kurama"), label: "Bijuu · Kurama", hint: "Naruto + Kurama sahnesi.", size: { w: 1800, h: 1200 } },
  { key: NARUTO_IMAGE_KEYS.hokageHall, label: "Hokage Salonu · zemin", hint: "Kapıların ardındaki salon. Kapılar iki yana açılınca ortada bu duruyor — merkezi sakin, kenarları koyu olsun. Hokage'nin yüzü buraya DEĞİL kendi portre kaydına yükleniyor.", size: SCENE },
  { key: NARUTO_IMAGE_KEYS.history, label: "Tarih bandı", hint: "Savaş dönemleri bandı.", size: SCENE },
  { key: NARUTO_IMAGE_KEYS.valley, label: "Son Vadisi", hint: "Efsanevi Savaşlar bölümü.", size: SCENE },
  { key: NARUTO_IMAGE_KEYS.scrolls, label: "Yasak Parşömenler", hint: "Kapanış bandı.", size: SCENE },
];

const SLOT_BY_KEY = new Map(NARUTO_IMAGE_SLOTS.map((slot) => [slot.key, slot]));

/**
 * Yuvanın etiketi, notu ve önerilen ölçüsü — TEK KAYNAK.
 *
 * ⚠️ Sayfa eskiden her çağrı yerinde kendi `slotLabel` dizesini yazıyordu
 * ve manifestodaki adla tutmuyordu (küratör panelinde "Chakra", bölümde
 * "Chakra fonu"). Etiket artık iki yerde de buradan geliyor.
 *
 * Manifestoda karşılığı olmayan anahtar `undefined` dönüyor: çağıran taraf
 * yuvayı çizmiyor. Sessiz düşmek doğru olan — yuva listeden çıkarılmış
 * olabilir ve yarım bir kutu "eksik" hissi üretirdi.
 */
export function narutoSlotSpec(key: string): NarutoImageSlot | undefined {
  return SLOT_BY_KEY.get(key);
}
