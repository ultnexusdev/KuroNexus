import type { Localized } from "./types";
import type { LayerId } from "@/components/anime/bleach/WorldSection";

/**
 * BEŞ KATMAN — P02'nin verisi.
 *
 * ── NEDEN GRID DEĞİL ─────────────────────────────────────────────────────
 * Naruto Evreni'nde bunun karşılığı "Köyler ve Bölgeler" ızgarası: yan yana
 * kartlar, hepsi eşit, hepsi aynı anda görünür. Bleach'te dünyalar eşit
 * DEĞİL ve aynı anda görünmemeliler — üst üste istiflenmiş beş katman ve
 * kullanıcı aralarından geçerek iniyor.
 *
 * ── GEÇİTLER ─────────────────────────────────────────────────────────────
 * ⚠️ Brief'in şemasında Garganta, Hueco Mundo ile Reiōkyū ARASINDA duruyor.
 * Canon'da Garganta Hollow geçididir ve Hueco Mundo'ya GİRERKEN kullanılır;
 * Reiōkyū'ya Ōken ile çıkılır. Şema bir kaydırma yapmış. Burada canon
 * geçerli:
 *
 *   現世 →[senkaimon]→ 尸魂界 →[garganta]→ 虚圏 →[ōken]→ 霊王宮
 *        →[schatten bereich]→ 見えざる帝国
 *
 * ── "DÜNYAYA GİR" BAĞLANTISI ─────────────────────────────────────────────
 * Katman, kendi derin bölümüne kapı açıyor (Soul Society → Gotei 13 gibi).
 * O bölümler henüz yok; `enter` alanı dolu olsa bile bağlantı yalnızca
 * hedef sayfada VARSA çiziliyor (`READY_SECTIONS`). Ölü bir sayfa içi
 * çapası, olmayan bir bağlantıdan kötüdür.
 */

export interface WorldPlace {
  kanji?: string;
  name: Localized;
}

export interface WorldRecord {
  id: LayerId;
  kanji: string;
  /** ÇEVRİLMEZ — sayfanın imza sesi İngilizce (Jost caps) */
  eyebrow: string;
  /** Mekânın özel adı; çevrilmez */
  name: string;
  /** 2–3 cümle atmosferik metin, arşivci sesi */
  description: Localized;
  places: WorldPlace[];
  /** Derin bölümün sayfa içi çapası — hazır olduğunda çiziliyor */
  enter?: { anchor: string; label: Localized };
}

/**
 * Sayfada GERÇEKTEN bulunan derin bölümler.
 *
 * ⚠️ Bir bölüm yayına girdiğinde kimliği buraya eklenecek; o ana kadar
 * ilgili katmanın "dünyaya gir" bağlantısı hiç çizilmiyor. Tek satırlık
 * bir liste, beş katmanda beş ölü çapaya bedel.
 */
export const READY_SECTIONS = new Set<string>([
  /* P03 · Gotei 13 — 23 Ağustos 2026 */
  "gotei",
  /* P04 · Zanpakutō arşivi, P05 · Bankai salonu — 23 Ağustos 2026.
     Bugün hiçbir katman bunlara kapı açmıyor ama defter "sayfada
     gerçekten bulunan bölümler" defteri; eksik tutmak onu yalancı
     yapardı. `SoulHierarchy` de aynı listeye soruyor. */
  "zanpakuto",
  "bankai",
  /* P06 · Ruh hiyerarşisi — 23 Ağustos 2026 */
  "hierarchy",
  /* P07 · Hueco Mundo, maskenin kırılışı — 23 Ağustos 2026 */
  "hueco",
]);

export const BLEACH_WORLDS: readonly WorldRecord[] = [
  {
    id: "living",
    kanji: "現世",
    eyebrow: "WORLD OF THE LIVING",
    name: "Karakura",
    description: {
      tr: "Yaşayanların dünyası, savaşın olduğunu bilmeyen tek katman. Karakura sıradan bir taşra kasabası gibi görünür; oysa ruhsal yoğunluğu yüzünden hem Hollow'ları hem de onları avlayanları kendine çeker. Burada ölüm bir son değil, bir geçiş noktasıdır — ve çoğu insan geçişi hiç görmez.",
      en: "The world of the living, the only layer unaware that a war is going on. Karakura looks like an ordinary provincial town; its spiritual density draws both Hollows and the ones who hunt them. Here death is not an end but a crossing point — and most people never see the crossing.",
    },
    places: [
      { name: { tr: "Kurosaki Kliniği", en: "Kurosaki Clinic" } },
      { name: { tr: "Urahara Dükkânı", en: "Urahara Shop" } },
      { name: { tr: "Vekil Shinigami", en: "Substitute Soul Reaper" } },
      {
        name: {
          tr: "Ruhsal farkındalığı olan insanlar",
          en: "Humans with spiritual awareness",
        },
      },
    ],
  },
  {
    id: "soul-society",
    kanji: "尸魂界",
    eyebrow: "SOUL SOCIETY",
    name: "Seireitei",
    description: {
      tr: "Ruhların gittiği yer, ama huzur değil düzen vaat eder. Beyaz duvarların içinde on üç bölük ve bir bürokrasi; dışında, seksen bölgeye ayrılmış bir yoksulluk. Soul Society bir öbür dünya değil — yalnızca aynı eşitsizliğin ölümden sonraki hâli.",
      en: "Where souls go, though it promises order rather than peace. Inside the white walls: thirteen divisions and a bureaucracy. Outside them: poverty sorted into eighty districts. Soul Society is not an afterlife — only the same inequality, continued after death.",
    },
    places: [
      { kanji: "瀞霊廷", name: { tr: "Seireitei", en: "Seireitei" } },
      { kanji: "流魂街", name: { tr: "Rukongai", en: "Rukongai" } },
      { kanji: "双殛の丘", name: { tr: "Sōkyoku Tepesi", en: "Sōkyoku Hill" } },
      { kanji: "中央四十六室", name: { tr: "Central 46", en: "Central 46" } },
    ],
    enter: {
      anchor: "#gotei",
      label: { tr: "On üç kapıya gir", en: "Enter the thirteen gates" },
    },
  },
  {
    id: "hueco-mundo",
    kanji: "虚圏",
    eyebrow: "THE WORLD OF THE HOLLOW",
    name: "Las Noches",
    description: {
      tr: "Ne yaşayanların ne ölülerin dünyası: aradaki boşluk. Sonsuz beyaz kum, hiç doğmayan bir gece ve kırılmayan bir ay. Buraya düşen ruhlar birbirini yiyerek yükselir; Hueco Mundo'nun tek yasası açlıktır.",
      en: "Neither the world of the living nor of the dead: the void between. Endless white sand, a night that never breaks, a moon that never sets. Souls that fall here rise by devouring one another; hunger is the only law Hueco Mundo has.",
    },
    places: [
      { name: { tr: "Las Noches", en: "Las Noches" } },
      { name: { tr: "Menos Ormanı", en: "Forest of Menos" } },
      { kanji: "黒腔", name: { tr: "Garganta", en: "Garganta" } },
      { name: { tr: "Beyaz Çöl", en: "The white desert" } },
    ],
    enter: {
      anchor: "#hueco",
      label: { tr: "Boşluğa in", en: "Descend into the void" },
    },
  },
  {
    id: "royal",
    kanji: "霊王宮",
    eyebrow: "THE ROYAL REALM",
    name: "Reiōkyū",
    description: {
      tr: "Soul Society'nin üzerinde, kimsenin göremediği bir kat daha var. Ruh Kralı orada bir taht üzerinde değil, bir mühür olarak duruyor: dünyaları birbirinden ayıran şey onun varlığı. Bu katman hakkında bilinenler bir elin parmaklarını geçmez ve arşiv bunu gizlemeyecek.",
      en: "Above Soul Society there is one more floor, and no one can see it. The Soul King sits there not on a throne but as a seal: what keeps the worlds apart is his existence. What is known about this layer fits on one hand, and this archive will not pretend otherwise.",
    },
    places: [
      { kanji: "零番隊", name: { tr: "Sıfırıncı Bölük", en: "Zero Division" } },
      { kanji: "霊王鍵", name: { tr: "Ōken", en: "Ōken" } },
    ],
    /* İniş buradan başlıyor: hiyerarşi sütununun tepesi Reiōkyū'dur ve
       kullanıcı oradan Rukongai'ye kadar düşüyor (P06). */
    enter: {
      anchor: "#hierarchy",
      label: { tr: "İktidar sütununa in", en: "Descend the column of power" },
    },
  },
  {
    id: "wandenreich",
    kanji: "見えざる帝国",
    eyebrow: "THE INVISIBLE EMPIRE",
    name: "Silbern",
    description: {
      tr: "Bin yıl önce yenildiler ve yenilgiyi kabul etmek yerine gölgeye çekildiler. Wandenreich, Soul Society'nin kendi gölgesinin içinde kuruldu — yani düşman hep oradaydı, yalnızca görünmüyordu. Quincy'ler için bu bir intikam değil, ertelenmiş bir hesap.",
      en: "A thousand years ago they lost, and instead of accepting it they withdrew into shadow. The Wandenreich was built inside Soul Society's own shadow — the enemy was always there, merely unseen. For the Quincy this is not revenge but a deferred reckoning.",
    },
    places: [
      { name: { tr: "Silbern", en: "Silbern" } },
      { name: { tr: "Schatten Bereich", en: "Schatten Bereich" } },
      { name: { tr: "Wahrwelt", en: "Wahrwelt" } },
    ],
    enter: {
      anchor: "#wandenreich",
      label: { tr: "İmparatorluğa gir", en: "Enter the empire" },
    },
  },
];

/**
 * Katmanlar arası geçitler — hangi dünyaya GİRERKEN hangi kapı.
 *
 * İlk katmanın geçidi yok: oraya hero'dan iniliyor.
 */
export const WORLD_GATES: Partial<
  Record<LayerId, { kind: "senkaimon" | "garganta" | "schatten"; label: string }>
> = {
  "soul-society": { kind: "senkaimon", label: "SENKAIMON" },
  "hueco-mundo": { kind: "garganta", label: "GARGANTA" },
  royal: { kind: "senkaimon", label: "ŌKEN" },
  wandenreich: { kind: "schatten", label: "SCHATTEN BEREICH" },
};
