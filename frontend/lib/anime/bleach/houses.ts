import type { Localized } from "./types";

/**
 * ASİL HANELER — P14'ün verisi.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Naruto Evreni'ndeki "Klanlar"ın karşılığı ama **bilinçli olarak daha
 * küçük**. Bleach'te klanlar Naruto'daki kadar merkezi değil ve bölüm
 * bunu tasarımla itiraf ediyor: kompakt, sıkı ve gizemli. Büyük bir soy
 * ağacı YOK.
 *
 * ── HEPSİ FANDOM'DAN DOĞRULANDI (23 Ağustos 2026) ────────────────────────
 * `Noble Houses` ve her hanenin kendi sayfası.
 *
 * ⚠️ **BRIEF'İN ALT BLOĞU İKİ YERDE YANLIŞTI VE DÜZELTMESİ HİKÂYEYİ
 * DAHA İYİ YAPTI:**
 *
 *   1. Canon'da **五大貴族 değil 四大貴族** — Beş değil DÖRT Büyük Asil
 *      Hane.
 *   2. Brief üçünü adlandırıp ikisini redakte ediyor. Canon yalnızca
 *      **İKİSİNİ** adlandırıyor: Kuchiki ve Shihōin. Üçüncü ve dördüncü
 *      için wiki'nin tek cümlesi var: *"No information about this house
 *      has been revealed."* Yani redakte edilen iki hane bir üslup değil,
 *      kaydın gerçek hâli.
 *
 * Ve sayı meselesinin canon'daki çözümü brief'in sezgisini haklı
 * çıkarıyor: **Shiba hanesi bir zamanlar BEŞİNCİ büyük haneydi** ve
 * Kaien Shiba'nın ölümünden sonra düştü. Yani beş vardı, dördü kaldı,
 * o dördün ikisinin adı arşivde yok.
 *
 * ⚠️ Tsunayashiro'nun kanji'si 津奈木代 değil **綱彌代**. Ayrıca hane
 * ana seride değil yan eserlerde geçiyor; kayıt bunu söylüyor.
 *
 * ── ⚠️ ARMALAR CANON DEĞİL, TASARIM ─────────────────────────────────────
 * Canon bu hanelerin çoğu için bir *mon* yayımlamıyor. Çizilen altı işaret
 * uydurulmuş bir "gerçek arma" değil, her hanenin **canon'daki
 * uzmanlığından** türetilmiş birer işaret: Kuchiki'nin kayıt tutuculuğu,
 * Shiba'nın havai fişekleri, Ise'nin şinto ayinleri… Arayüz bunu
 * söylüyor, arşiv uydurmuyor.
 */

export interface HouseRecord {
  id: string;
  /** ÇEVRİLMEZ */
  kanji: string;
  /** ÇEVRİLMEZ */
  name: string;
  /** Tek cümle — canon'daki uzmanlık */
  role: Localized;
  /** Hane reisi; canon söylemiyorsa `null` */
  head: string | null;
  /** Bilinen üyeler — ÇEVRİLMEZ özel adlar */
  members: string[];
  /** Ana seride geçmiyorsa vb. */
  note?: Localized;
  /** `NobleHouses` içindeki işaret çizimi */
  mon: string;
}

export const HOUSES: readonly HouseRecord[] = [
  {
    id: "kuchiki",
    kanji: "朽木家",
    name: "KUCHIKI",
    role: {
      tr: "Soul Society'nin tarihini derleyip koruyan hane; Dört Büyük Asil Hane'den biri.",
      en: "The house that compiles and protects Soul Society's history; one of the Four Great Noble Families.",
    },
    head: "Byakuya Kuchiki",
    members: ["Byakuya Kuchiki", "Rukia Kuchiki", "Hisana Kuchiki", "Ginrei Kuchiki"],
    mon: "blossom",
  },
  {
    id: "shihoin",
    kanji: "四楓院家",
    name: "SHIHŌIN",
    role: {
      tr: "Geleneğe göre Onmitsukidō'nun başı bu haneden çıkar; tanrıların bahşettiği söylenen 宝具 ve 武具'nun bekçileri.",
      en: "By tradition the head of the Onmitsukidō comes from this house; keepers of the 宝具 and 武具 said to have been bestowed by the gods.",
    },
    head: "Yūshirō Shihōin",
    members: ["Yoruichi Shihōin", "Yūshirō Shihōin"],
    mon: "maple",
  },
  {
    id: "shiba",
    kanji: "志波家",
    name: "SHIBA",
    role: {
      tr: "Bir zamanlar beşinci büyük haneydi; Kaien Shiba'nın ölümünden sonra sebebi açıklanmayan bir şekilde düştü. Uzmanlığı havai fişek.",
      en: "Once the fifth great noble family; after Kaien Shiba's death it fell from that place for reasons never explained. Its specialty is fireworks.",
    },
    head: "Kūkaku Shiba",
    members: ["Kūkaku Shiba", "Kaien Shiba", "Ganju Shiba", "Isshin Shiba"],
    mon: "burst",
  },
  {
    id: "tsunayashiro",
    kanji: "綱彌代家",
    name: "TSUNAYASHIRO",
    role: {
      tr: "Gözetleme ile anılan hane; Dört Büyük Asil Hane'nin en nüfuzlusu sayılıyor.",
      en: "The house associated with surveillance, reckoned the most influential of the Four Great Noble Families.",
    },
    head: null,
    members: ["Tokinada Tsunayashiro"],
    note: {
      tr: "Ana seride değil, yan eserlerde geçiyor.",
      en: "Appears in the side works, not the main series.",
    },
    mon: "scroll",
  },
  {
    id: "omaeda",
    kanji: "大前田家",
    name: "ŌMAEDA",
    role: {
      tr: "Varlıklı bir aristokrat aile; kuşaklar boyu Onmitsukidō'da görev almış. Büyük hanelerden biri değil.",
      en: "A wealthy aristocratic family with generations of service in the Onmitsukidō. Not one of the great houses.",
    },
    head: "Marenoshin Ōmaeda",
    members: ["Marechiyo Ōmaeda", "Marenoshin Ōmaeda"],
    mon: "coin",
  },
  {
    id: "ise",
    kanji: "伊勢家",
    name: "ISE",
    role: {
      tr: "Asil değil ama saygın: Soul Society'nin şinto rahipleri, ayin ve ritüellerin sorumlusu.",
      en: "Not noble but revered: Soul Society's Shinto priests, responsible for rites and rituals.",
    },
    head: "Nanao Ise",
    members: ["Nanao Ise", "Lisa Yadōmaru"],
    mon: "torii",
  },
];

/**
 * DÖRT BÜYÜK ASİL HANE — ve arşivin en dürüst yeri.
 *
 * ⚠️ İki hanenin adı canon'da HİÇ açıklanmadı. Bunu bir eksiklik gibi
 * saklamak yerine redakte edilmiş bir kayıt olarak göstermek hem canon'a
 * sadık hem de bu sitenin kimliğine uygun: arşiv bilmediğini söyler.
 */
export const GREAT_HOUSES = {
  kanji: "四大貴族",
  romaji: "Yondai Kizoku",
  /** Canon'da adı olan iki hane */
  named: ["Kuchiki", "Shihōin"],
  /** Canon'da adı OLMAYAN hane sayısı */
  redacted: 2,
};
