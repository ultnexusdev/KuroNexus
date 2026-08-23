import type { LocalizedText } from "./types";

/**
 * Sakura Haruno — deneyim sayfasının veri iskeleti.
 *
 * Konsept: **Byakugō — Üç Yıllık Birikim.** Sayfanın iddiası tek cümlede
 * duruyor: Sakura'nın gücü bir anda gelmedi, alnındaki bir noktaya üç yıl
 * boyunca damla damla yatırıldı. Onun için sayfanın omurgası bir DOLUM
 * ÖLÇEĞİ — beş kademeli bir mühür — ve her bölüm o ölçeğin bir okuması.
 *
 * ⚠️ SAYFA "PEMBE KIZ" KLİŞESİNİ REDDEDER. Palet yeşil ağırlıklı
 * (`--accent` şifa chakrası), pembe yalnızca mührün ve taçyaprağının
 * vurgusu. Metinlerde de aynı disiplin: bekleyen değil çalışan bir
 * karakter yazılıyor — aşk üçgeni bu sayfanın konusu değil.
 *
 * Itachi emsalinin devamı: bütün anlatı burada, iki dilli `LocalizedText`
 * çiftleri olarak (AGENTS.md kural 1). Görseller veritabanında
 * (`CharacterImage`, characterId 145, ABILITY yuvası `sakura:*`
 * anahtarları). Görsel inmemişse bölüm görselsiz ama ayakta kalır.
 *
 * Künye sayıları `anilist-detay.json` önbelleğinden (22 Ağustos 2026;
 * AniList GraphQL o gün kapalıydı). Jutsu adları, kronoloji ve replikler
 * Naruto/Naruto Shippūden künyesinden. Emin olunmayan replik yazılmadı:
 * sayfada dört replik var, dördü de sahnesiyle birlikte anılıyor.
 */

export const SAKURA_ID = 145;

/**
 * Sergi görselleri — hepsi characterId 145 kaydında ABILITY yuvasında.
 *
 * Bilinçli olarak AZ: bu sayfanın grafiği üretilmiş görsele değil, elle
 * çizilmiş SVG mühre dayanıyor (bkz. `SakuraGlyphs.tsx`). Kürator bu
 * yuvaları doldurmasa bile sayfa eksik görünmez; dolarsa mühür görselin
 * üstüne biner.
 */
export const SAKURA_IMAGE_KEYS = {
  /** Hero'nun arkasındaki geniş sahne (16:9) — portrenin ardına iner */
  hero: "sakura:hero",
  /** Ölçek bölümünün arka planı: alın ve mühür yakın kadraj */
  seal: "sakura:seal",
  shosen: "sakura:shosen",
  okasho: "sakura:okasho",
  byakugo: "sakura:byakugo",
  katsuyu: "sakura:katsuyu",
  poison: "sakura:poison",
  sensing: "sakura:sensing",
  fubuki: "sakura:fubuki",
  eraAcademy: "sakura:era-academy",
  eraForest: "sakura:era-forest",
  eraTsunade: "sakura:era-tsunade",
  eraSasori: "sakura:era-sasori",
  eraWar: "sakura:era-war",
} as const;

/** Kürator modundaki yükleme kutularının etiketleri. */
export const SAKURA_SLOT_LABELS: Record<string, LocalizedText> = {
  [SAKURA_IMAGE_KEYS.hero]: {
    tr: "Hero sahnesi (16:9) — portrenin ardındaki geniş kadraj",
    en: "Hero scene (16:9) — wide frame behind the portrait",
  },
  [SAKURA_IMAGE_KEYS.seal]: {
    tr: "Mühür yakın kadrajı — alın ve eşkenar dörtgen",
    en: "Seal close-up — forehead and rhombus",
  },
  [SAKURA_IMAGE_KEYS.shosen]: {
    tr: "Shōsen Jutsu — şifa avucu",
    en: "Shōsen Jutsu — mystical palm",
  },
  [SAKURA_IMAGE_KEYS.okasho]: {
    tr: "Ōkashō — yeri yaran vuruş",
    en: "Ōkashō — the strike that splits the ground",
  },
  [SAKURA_IMAGE_KEYS.byakugo]: {
    tr: "Byakugō no Jutsu — Sōzō Saisei",
    en: "Byakugō no Jutsu — Creation Rebirth",
  },
  [SAKURA_IMAGE_KEYS.katsuyu]: {
    tr: "Kuchiyose — Katsuyu",
    en: "Kuchiyose — Katsuyu",
  },
  [SAKURA_IMAGE_KEYS.poison]: {
    tr: "Zehir çözümü ve panzehir — hastane masası",
    en: "Poison analysis and antidote — the hospital bench",
  },
  [SAKURA_IMAGE_KEYS.sensing]: {
    tr: "Chakra gözlemi — akışı okuyan el",
    en: "Chakra sensing — the hand that reads the flow",
  },
  [SAKURA_IMAGE_KEYS.fubuki]: {
    tr: "Sakura Fubuki — taçyaprağı fırtınası",
    en: "Sakura Fubuki — blossom storm",
  },
  [SAKURA_IMAGE_KEYS.eraAcademy]: {
    tr: "Dönem — akademi ve kıskançlık",
    en: "Era — the academy and the envy",
  },
  [SAKURA_IMAGE_KEYS.eraForest]: {
    tr: "Dönem — Ölüm Ormanı, kesilen saç",
    en: "Era — Forest of Death, the cut hair",
  },
  [SAKURA_IMAGE_KEYS.eraTsunade]: {
    tr: "Dönem — Tsunade çıraklığı",
    en: "Era — apprenticeship under Tsunade",
  },
  [SAKURA_IMAGE_KEYS.eraSasori]: {
    tr: "Dönem — Sasori zaferi",
    en: "Era — the victory over Sasori",
  },
  [SAKURA_IMAGE_KEYS.eraWar]: {
    tr: "Dönem — Dördüncü Savaş, mührün açılışı",
    en: "Era — Fourth War, the seal opens",
  },
};

/* ── Hero ve künye ─────────────────────────────────────────────────── */

export const SAKURA_IDENTITY = {
  name: "Sakura Haruno",
  nativeName: "春野サクラ",
  /** Hero filigranı — `aria-hidden`, yalnızca grafik */
  watermark: "百豪の印",
  /**
   * Hero'nun altındaki cümle. Replik DEĞİL, arşivin kendi kalemi —
   * tırnak içine alınmıyor ki uydurma bir alıntı sanılmasın.
   */
  epigraph: {
    tr: "Üç yıl boyunca her gün, chakrasının bir kısmını harcamayıp alnındaki tek bir noktaya yatırdı. Yirmi yaşına gelmeden o nokta bir orduyu ayağa kaldırdı.",
    en: "For three years she withheld a share of her chakra every single day and deposited it into one point on her forehead. Before she turned twenty, that point put an army back on its feet.",
  },
  tags: [
    { tr: "Tıp ninjası", en: "Medical-nin" },
    { tr: "Takım 7", en: "Team 7" },
    { tr: "Tsunade'nin çırağı", en: "Tsunade's apprentice" },
  ] satisfies LocalizedText[],
  factsTitle: {
    tr: "Künye",
    en: "Dossier",
  },
  factsLede: {
    tr: "Künye satırları AniList kaydından; rütbe, takım ve sembol arşivin kendi notu.",
    en: "Dossier rows come from the AniList record; rank, team and emblem are the archive's own notes.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "28 Mart", en: "March 28" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: {
        tr: "149 cm → 161 cm (Bölüm I → II)",
        en: "149 cm → 161 cm (Part I → II)",
      },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "O", en: "O" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: { tr: "12 → 17", en: "12 → 17" },
    },
    {
      label: { tr: "Rütbe", en: "Rank" },
      value: { tr: "Chūnin · tıp ninjası", en: "Chūnin · medical-nin" },
    },
    {
      label: { tr: "Takım", en: "Team" },
      value: {
        tr: "Takım 7 — Kakashi, Naruto, Sasuke",
        en: "Team 7 — Kakashi, Naruto, Sasuke",
      },
    },
    {
      label: { tr: "Ustası", en: "Master" },
      value: {
        tr: "Tsunade — Beşinci Hokage",
        en: "Tsunade — the Fifth Hokage",
      },
    },
    {
      label: { tr: "Doğa türü", en: "Nature type" },
      value: { tr: "Toprak · Su · Yin", en: "Earth · Water · Yin" },
    },
    {
      label: { tr: "Sembol", en: "Emblem" },
      value: {
        tr: "百豪の印 — alnındaki eşkenar dörtgen",
        en: "百豪の印 — the rhombus on her forehead",
      },
    },
  ],
} as const;

/** Sayfayı çeviren mod — Byakugō. */
export const SAKURA_MODE_TEXT = {
  enter: { tr: "Byakugō modu", en: "Byakugō mode" },
  exit: { tr: "Mührü kapat", en: "Close the seal" },
} as const;

/* ── Dolum ölçeği: sayfanın kalbi ──────────────────────────────────── */

export type SakuraStageKey =
  | "control"
  | "medical"
  | "storage"
  | "release"
  | "katsuyu";

export interface SakuraStage {
  key: SakuraStageKey;
  /** Ana dildeki ad — `lang="ja"` ile çizilir */
  native: string;
  name: LocalizedText;
  /** Merdivendeki kısa etiket: hangi yaşlarda oldu */
  span: LocalizedText;
  lede: LocalizedText;
  text: LocalizedText;
  /** Bu kademenin kazandırdıkları — üçer satır */
  gains: LocalizedText[];
  /** Bedeli. Her kazancın bir faturası var; sayfanın tonu bunu saklamıyor. */
  cost: LocalizedText;
}

export const SAKURA_GAUGE_TITLE = {
  title: { tr: "Dolum Ölçeği", en: "The Filling Gauge" },
  lede: {
    tr: "Mühür bir hediye değil, bir hesap. Beş kademe: her biri bir öncekinin üstüne biriktiği için sıra bozulamaz. Kademeyi seç, mühür büyüsün.",
    en: "The seal is not a gift, it is an account. Five stages, each stacked on the one before it, so the order cannot be broken. Pick a stage and watch the mark grow.",
  },
  /** Merdivenin erişilebilir adı (görsel olarak gizli) */
  ladderLabel: { tr: "Mühür kademeleri", en: "Seal stages" },
  /** Ölçeğin sayısal okuması: "3 / 5" biçiminde çizilir */
  readoutLabel: { tr: "Dolum", en: "Fill" },
  gainsLabel: { tr: "Kazandırdığı", en: "What it buys" },
  costLabel: { tr: "Bedeli", en: "What it costs" },
} as const;

export const SAKURA_STAGES: SakuraStage[] = [
  {
    key: "control",
    native: "チャクラコントロール",
    name: { tr: "Chakra Kontrolü", en: "Chakra Control" },
    span: { tr: "6 → 12 yaş", en: "ages 6 → 12" },
    lede: {
      tr: "Takım 7'nin en küçük chakra havuzu ona en pahalı alışkanlığı öğretti: israf etmemek.",
      en: "The smallest chakra pool in Team 7 taught her the most expensive habit of all: never waste a drop.",
    },
    text: {
      tr: "Naruto'nun rezervi devasaydı, Sasuke'nin kanı yetenekliydi. Sakura'nın elinde yalnızca ölçü vardı. Ağaca tırmanma denemesini ilk seferde geçen tek kişi oydu — çünkü ayağına gönderdiği chakra ne bir zerre fazla ne bir zerre eksikti. Sayfanın geri kalanındaki her şey bu tek beceriden türüyor.",
      en: "Naruto's reserve was enormous, Sasuke's blood was gifted. Sakura had only precision. She was the one who cleared the tree-climbing exercise on the first attempt, because the chakra she sent to her feet was neither a grain too much nor a grain too little. Everything else on this page grows out of that single skill.",
    },
    gains: [
      {
        tr: "Ağaç tırmanma ve su üstünde yürüme — ilk denemede",
        en: "Tree climbing and water walking — on the first try",
      },
      {
        tr: "Sıfır israf: her jutsu tam gerektiği kadar chakra yakar",
        en: "Zero waste: every jutsu burns exactly what it needs",
      },
      {
        tr: "Genjutsu'yu akıştaki bozulmadan tanıyıp kendi kendine çözme",
        en: "Spotting genjutsu in the disturbed flow and breaking it alone",
      },
    ],
    cost: {
      tr: "Yıllarca süren, kimsenin izlemediği tekrar. Kontrol bir sahne jutsusu değil; kimse alkışlamaz.",
      en: "Years of repetition nobody watched. Control is not a stage jutsu; nobody applauds it.",
    },
  },
  {
    key: "medical",
    native: "医療忍術",
    name: { tr: "Tıbbi Ninjutsu", en: "Medical Ninjutsu" },
    span: { tr: "13 → 15 yaş", en: "ages 13 → 15" },
    lede: {
      tr: "Yaralı dokuyu iyileşmeye ikna etmek değil — hücreleri bölünmeye zorlamak.",
      en: "Not coaxing wounded tissue into healing — forcing its cells to divide.",
    },
    text: {
      tr: "Tıbbi ninjutsu chakrayı hücre düzeyinde yönetmeyi ister; Konoha'da bunu yapabilecek eli olan üç kişi vardı. Sakura üçüncüsü oldu. Kanjūrō'nun zehri gibi kimsenin çözemediği bileşikleri masada ayrıştırdı, panzehri kendi eliyle üretti. Bu kademede eli artık bir silah değil, bir alet.",
      en: "Medical ninjutsu demands chakra handled at the level of a single cell; Konoha had three pairs of hands capable of it. Sakura became the third. She broke down compounds nobody else could resolve and built the antidote herself. At this stage her hand stops being a weapon and becomes an instrument.",
    },
    gains: [
      {
        tr: "Shōsen Jutsu — açık yarayı sahada kapatma",
        en: "Shōsen Jutsu — closing an open wound in the field",
      },
      {
        tr: "Zehir analizi ve panzehir: Kankurō'yu masada geri getirdi",
        en: "Poison analysis and antidote: she brought Kankurō back on the table",
      },
      {
        tr: "Chakra iplikleriyle ameliyat — dokuyu açmadan onarma",
        en: "Chakra-scalpel surgery — repairing tissue without opening it",
      },
    ],
    cost: {
      tr: "Bir tıp ninjasının elleri savaşta doludur. İyileştirirken kendini savunamaz; arkasını birinin tutması gerekir.",
      en: "A medic's hands are full in a battle. While healing she cannot defend herself; somebody has to hold her back.",
    },
  },
  {
    key: "storage",
    native: "陰封印",
    name: { tr: "Yüz Mühür · Birikim", en: "The Hundred Seal · Storage" },
    span: { tr: "13 → 16 yaş (üç yıl)", en: "ages 13 → 16 (three years)" },
    lede: {
      tr: "Günün chakrasının bir kısmını harcamamak ve onu alnındaki tek bir noktada biriktirmek.",
      en: "Withholding a share of the day's chakra and banking it in one point on the forehead.",
    },
    text: {
      tr: "Sayfanın adı buradan geliyor. Yin Mührü bir teknik değil, bir alışkanlık: üç yıl boyunca her gün, hiçbir savaş olmadan, hiçbir seyirci olmadan, chakranın bir dilimi kesilip alına yatırılır. Kontrol kademesi olmadan bu imkânsızdır — bir zerre şaşan yatırım mührü bozar. Tsunade bunu ancak elli yaşında tamamladı; Sakura on yedisinde tamamladı.",
      en: "This is where the page gets its title. The Yin Seal is not a technique but a habit: for three years, every day, with no battle and no audience, a slice of chakra is cut away and deposited in the forehead. Without the control stage it is impossible — a deposit off by a grain corrupts the seal. Tsunade only completed hers in her fifties; Sakura completed hers at seventeen.",
    },
    gains: [
      {
        tr: "Alnında görünür hâle gelen eşkenar dörtgen — hesabın bakiyesi",
        en: "The rhombus surfacing on her forehead — the balance of the account",
      },
      {
        tr: "Savaşta harcanmayan, savaş dışında biriken bir chakra kaynağı",
        en: "A chakra reserve that is never spent in battle, only built outside it",
      },
      {
        tr: "Sōzō Saisei'nin ön şartı: mühür dolmadan teknik yok",
        en: "The prerequisite for Sōzō Saisei: no seal, no technique",
      },
    ],
    cost: {
      tr: "Üç yıl boyunca her gün kendi gücünden kesmek. Biriken chakra o gün kullanılamaz — bugünün Sakura'sı, yarınınki için zayıf kalır.",
      en: "Three years of cutting into her own strength daily. Banked chakra cannot be spent today — today's Sakura stays weaker for tomorrow's.",
    },
  },
  {
    key: "release",
    native: "百豪の印",
    name: { tr: "Byakugō no In · Açılış", en: "Byakugō no In · Release" },
    span: { tr: "17 yaş", en: "age 17" },
    lede: {
      tr: "Mühür yarılır, üç yılın tamamı bir anda geri döner: Sōzō Saisei.",
      en: "The seal splits and three years come back at once: Sōzō Saisei.",
    },
    text: {
      tr: "Açılan mühürden yayılan çizgiler yüzü ve gövdeyi sarar. Sōzō Saisei — Yaratıcı Yeniden Doğuş — hücre bölünmesini yaranın açılma hızının önüne geçirir: kesik kapanmaz, kesik olmamış olur. Aynı kaynak Ōkashō'yu da besler; mühür açıkken Sakura hem kırılmayan hem de kıran taraftır. Dördüncü Shinobi Savaşı'nda bu mühür, Katsuyu üzerinden bütün ittifaka dağıtıldı.",
      en: "Lines spread from the split seal across her face and body. Sōzō Saisei — Creation Rebirth — pushes cell division ahead of the speed at which a wound can open: the cut does not close, the cut never happened. The same reserve feeds Ōkashō; with the seal open Sakura is both the side that does not break and the side that breaks things. In the Fourth Shinobi World War this seal was distributed to the entire allied army through Katsuyu.",
    },
    gains: [
      {
        tr: "Sōzō Saisei — yara açılmadan kapanan gövde",
        en: "Sōzō Saisei — a body that closes before the wound opens",
      },
      {
        tr: "Ōkashō'yu besleyen yakıt: aynı depo, ters yön",
        en: "The fuel behind Ōkashō: same store, opposite direction",
      },
      {
        tr: "Ön saftaki tıp ninjası — iyileştirirken savaşabilme",
        en: "A medic on the front line — able to fight while healing",
      },
    ],
    cost: {
      tr: "Depo boşalınca geriye hiçbir şey kalmaz. Mührün ne kadar dayanacağını yalnızca üç yıl önceki disiplin belirler.",
      en: "When the store empties, nothing is left. How long the seal holds was decided by discipline three years earlier.",
    },
  },
  {
    key: "katsuyu",
    native: "口寄せ・蛞蝓",
    name: { tr: "Katsuyu Ortaklığı", en: "The Katsuyu Partnership" },
    span: { tr: "17 yaş", en: "age 17" },
    lede: {
      tr: "Tek bir tıp ninjasının elleri iki kişiye yeter. Katsuyu'nunkiler yüz bin kişiye yetti.",
      en: "One medic's hands reach two people. Katsuyu's reached a hundred thousand.",
    },
    text: {
      tr: "Katsuyu binlerce küçük parçaya bölünebilir; her parça bağımsız hareket eder ve taşıdığı chakrayı bulunduğu yerde bırakır. Sakura açık mührünü Katsuyu'ya bağladı, Katsuyu da kendini savaş alanına dağıttı. Sonuç: Shinobi İttifakı'nın tamamı, tek bir kişinin üç yıllık birikimiyle aynı anda iyileştirildi. Bu, serinin hiçbir yerinde bir başkasının yapamadığı şey.",
      en: "Katsuyu can divide into thousands of fragments; each moves independently and leaves the chakra it carries where it lands. Sakura linked her open seal to Katsuyu, and Katsuyu scattered herself across the battlefield. The result: the entire Shinobi Alliance healed at once out of one person's three-year savings. Nobody else in the series does this.",
    },
    gains: [
      {
        tr: "Bütün cepheyi tek seferde iyileştirme",
        en: "Healing an entire front in a single pass",
      },
      {
        tr: "Katsuyu'nun parçaları üzerinden savaş alanını okuma",
        en: "Reading the battlefield through Katsuyu's fragments",
      },
      {
        tr: "Tsunade'nin kontratının Sakura'ya devri — sözleşme ustadan çırağa geçer",
        en: "Tsunade's contract passing to Sakura — the pact moves from master to apprentice",
      },
    ],
    cost: {
      tr: "Kendi chakrasını binlerce parçaya bölmek. Ölçeğin en üst kademesi aynı zamanda en hızlı boşalan kademesi.",
      en: "Splitting her own chakra into thousands of pieces. The highest stage of the gauge is also the one that empties fastest.",
    },
  },
];

/* ── İki kefe: laboratuvar ─────────────────────────────────────────── */

export interface SakuraTechnique {
  name: string;
  native: string;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
  imageKey: string;
}

export interface SakuraMinorTechnique {
  name: string;
  native: string;
  note: LocalizedText;
  imageKey: string;
}

export const SAKURA_SCALE_TITLE = {
  title: { tr: "İki Kefe", en: "Two Pans" },
  lede: {
    tr: "Aynı el. Bir tarafta hücreyi bölünmeye ikna eden avuç, diğer tarafta zemini yaran yumruk. İkisi de aynı chakra kontrolünden çıkıyor — bu bölüm terazinin iki kefesini yan yana koyuyor ve hangisinin daha ağır bastığını söylemeyi reddediyor.",
    en: "One hand. On one side the palm that persuades a cell to divide, on the other the fist that splits the ground. Both come out of the same chakra control — this section sets the two pans side by side and refuses to say which one weighs more.",
  },
  healTitle: { tr: "Şifa kefesi", en: "The healing pan" },
  breakTitle: { tr: "Yıkım kefesi", en: "The breaking pan" },
  /** Terazinin ortası: mühür + Sakura'nın kendi cümlesi */
  fulcrumQuote: {
    tr: "Bu sefer koruma sırası bende.",
    en: "This time it is my turn to protect them.",
  },
  fulcrumSource: {
    tr: "Sakura Haruno — Ölüm Ormanı, Chūnin Sınavı",
    en: "Sakura Haruno — Forest of Death, Chūnin Exams",
  },
  keystoneTitle: {
    tr: "İki kefeyi de ödeyen mühür",
    en: "The seal that pays for both pans",
  },
} as const;

export const SAKURA_HEAL_MAJOR: SakuraTechnique = {
  name: "Shōsen Jutsu",
  native: "掌仙術",
  tagline: {
    tr: "Şifa avucu — yaranın üstünde duran yeşil ışık",
    en: "The mystical palm — green light held over the wound",
  },
  text: {
    tr: "Avuçtan çıkan chakra yaralı dokuya girer ve hücre bölünmesini hızlandırır. Teknik basit görünür; zor olan doz. Fazlası dokuyu yakar, azı hiçbir şey yapmaz. Sakura'nın bu jutsuyu ilk kademeden getirdiği şey tam olarak bu: doğru doz.",
    en: "Chakra leaves the palm, enters the wounded tissue and accelerates cell division. The technique looks simple; the dose is the hard part. Too much burns the tissue, too little does nothing. What Sakura brings to it from the first stage is exactly that: the right dose.",
  },
  traits: [
    { tr: "Sahada, ameliyathanesiz", en: "In the field, no operating room" },
    { tr: "Hücre düzeyinde kontrol", en: "Cell-level control" },
    { tr: "Tsunade okulu", en: "The Tsunade school" },
  ],
  imageKey: SAKURA_IMAGE_KEYS.shosen,
};

export const SAKURA_BREAK_MAJOR: SakuraTechnique = {
  name: "Ōkashō",
  native: "桜花衝",
  tagline: {
    tr: "Yüz Güç Yumruğu — biriken chakranın temas anında boşalması",
    en: "The Hundred-Strength strike — the store emptied at the point of contact",
  },
  text: {
    tr: "Vuruş anında, tam temas noktasında, biriktirilmiş chakra bir anda salınır. Kas gücü değil zamanlama: chakra bir milisaniye erken bırakılırsa dağılır, geç bırakılırsa hiç çıkmaz. Yerin yarılması bir gösteri değil, dozun kanıtı — aynı ölçü, ters yön.",
    en: "At the moment of impact, precisely at the point of contact, the banked chakra is released all at once. Not muscle but timing: released a millisecond early it disperses, a millisecond late it never leaves. The ground splitting is not a spectacle but proof of dose — the same measure, the opposite direction.",
  },
  traits: [
    { tr: "Zemini yaran temas", en: "Contact that splits the ground" },
    { tr: "Kas değil zamanlama", en: "Timing, not muscle" },
    { tr: "Aynı depodan beslenir", en: "Fed from the same store" },
  ],
  imageKey: SAKURA_IMAGE_KEYS.okasho,
};

export const SAKURA_KEYSTONE: SakuraTechnique = {
  name: "Byakugō no Jutsu — Sōzō Saisei",
  native: "百豪の術・創造再生",
  tagline: {
    tr: "Terazinin dayandığı nokta",
    en: "The point the scale rests on",
  },
  text: {
    tr: "İki kefe de aynı hesaptan çekiyor. Mühür açıldığında Sōzō Saisei gövdeyi yaranın önüne geçirir; aynı anda aynı depo yumruğu besler. Bu yüzden terazi hiç eşitlenmez ve hiç devrilmez: her iki kefenin ağırlığı da tek bir yerden geliyor — üç yıl önce başlamış bir alışkanlıktan.",
    en: "Both pans draw on the same account. When the seal opens, Sōzō Saisei puts the body ahead of the wound; at the same moment the same store feeds the fist. That is why the scale never balances and never tips over: the weight in both pans comes from one place — a habit that started three years earlier.",
  },
  traits: [
    { tr: "Tek kaynak, iki yön", en: "One source, two directions" },
    { tr: "Üç yıllık bakiye", en: "A three-year balance" },
    { tr: "Boşalınca biter", en: "It ends when it empties" },
  ],
  imageKey: SAKURA_IMAGE_KEYS.byakugo,
};

export const SAKURA_HEAL_MINOR: SakuraMinorTechnique[] = [
  {
    name: "Kuchiyose no Jutsu — Katsuyu",
    native: "口寄せの術・蛞蝓",
    note: {
      tr: "Bölünebilen yoldaş. Sakura'nın chakrasını taşıyıp savaş alanının her noktasına bırakır.",
      en: "The companion that divides. She carries Sakura's chakra and drops it at every point of the battlefield.",
    },
    imageKey: SAKURA_IMAGE_KEYS.katsuyu,
  },
  {
    name: "Zehir çözümü ve panzehir",
    native: "毒の解析",
    note: {
      tr: "Sasori'nin zehrini Suna'nın tıp bölümü çözemedi; Sakura masada ayrıştırdı ve panzehri üretti.",
      en: "Suna's medical corps could not resolve Sasori's poison; Sakura broke it down on the bench and produced the antidote.",
    },
    imageKey: SAKURA_IMAGE_KEYS.poison,
  },
];

export const SAKURA_BREAK_MINOR: SakuraMinorTechnique[] = [
  {
    name: "Sakura Fubuki",
    native: "桜吹雪",
    note: {
      tr: "Taçyaprağı fırtınası: görüşü kapatan, hedefi kaybettiren örtü. Sayfanın adını taşıyan tek teknik.",
      en: "A blossom storm: a veil that closes vision and loses the target. The one technique that carries her name.",
    },
    imageKey: SAKURA_IMAGE_KEYS.fubuki,
  },
  {
    name: "Chakra gözlemi",
    native: "チャクラ感知",
    note: {
      tr: "Akışı okuyan el hangi noktanın onarılacağını söyler. Aynı el, hangi noktanın kırılacağını da söyler.",
      en: "The hand that reads the flow says which point to repair. The same hand says which point will break.",
    },
    imageKey: SAKURA_IMAGE_KEYS.sensing,
  },
];

/* ── Bağlar: elinin altından geçenler ──────────────────────────────── */

export interface SakuraBond {
  characterId: number;
  name: string;
  role: LocalizedText;
  note: LocalizedText;
}

export const SAKURA_BONDS_TITLE = {
  title: { tr: "Elinin Altından Geçenler", en: "Those Her Hands Passed Over" },
  lede: {
    tr: "Bir tıp ninjasının dosyası hastalarıyla yazılır. Portreler arşivin kendi kayıtlarından; kayıt yoksa satır adla ayakta kalır.",
    en: "A medic's file is written by her patients. Portraits come from the archive's own records; where there is no record, the row stands on the name alone.",
  },
} as const;

export const SAKURA_BONDS: SakuraBond[] = [
  {
    characterId: 2767,
    name: "Tsunade",
    role: { tr: "Ustası", en: "Master" },
    note: {
      tr: "Yüz Mühür'ü ondan öğrendi ve ondan önce tamamladı. Katsuyu sözleşmesi de aynı elden geçti.",
      en: "She learned the Hundred Seal from her and completed it earlier than she did. The Katsuyu contract passed through the same hand.",
    },
  },
  {
    characterId: 17,
    name: "Naruto Uzumaki",
    role: { tr: "Takım arkadaşı", en: "Teammate" },
    note: {
      tr: "Yıllarca sırtına baktığı iki kişiden biri. Dördüncü Savaş'ta ilk kez onun yanında, arkasında değil.",
      en: "One of the two backs she spent years watching. In the Fourth War she stands beside him for the first time, not behind him.",
    },
  },
  {
    characterId: 13,
    name: "Sasuke Uchiha",
    role: { tr: "Takım arkadaşı", en: "Teammate" },
    note: {
      tr: "Onu geri getirme sözü verdiği kişi. Sözünü tutmak için değişmesi gereken kişi ise kendisiydi.",
      en: "The one she promised to bring back. To keep that promise, the person who had to change was herself.",
    },
  },
  {
    characterId: 85,
    name: "Kakashi Hatake",
    role: { tr: "Takım lideri", en: "Squad leader" },
    note: {
      tr: "Ağaca tırmanma dersini veren adam. Sakura'nın kontrolünü ilk fark eden de o oldu.",
      en: "The man who set the tree-climbing lesson. He was also the first to notice her control.",
    },
  },
  {
    characterId: 2009,
    name: "Ino Yamanaka",
    role: { tr: "Rakip ve arkadaş", en: "Rival and friend" },
    note: {
      tr: "Önce arkadaş, sonra rakip, sonunda ikisi birden. Chūnin Sınavı'nda ikisi de aynı anda yere düştü.",
      en: "First a friend, then a rival, in the end both at once. In the Chūnin Exams the two of them hit the ground at the same moment.",
    },
  },
  {
    characterId: 1662,
    name: "Gaara",
    role: { tr: "Müttefik", en: "Ally" },
    note: {
      tr: "Kankurō'yu Suna'nın hastanesinde Sakura kurtardı; Kazekage'nin köyüne borcu o gün başladı.",
      en: "Sakura saved Kankurō in Suna's own hospital; the Kazekage's village owed her from that day.",
    },
  },
];

/* ── Kader çizelgesi ───────────────────────────────────────────────── */

export interface SakuraEra {
  key: string;
  /** Ölçeğin hangi kademesine denk geliyor — çizelgedeki mühür o kadar büyür */
  stage: number;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: LocalizedText;
  quoteSource?: LocalizedText;
  imageKey: string;
}

export const SAKURA_TIMELINE_TITLE = {
  title: { tr: "Kader Çizelgesi", en: "The Ledger of Her Fate" },
  lede: {
    tr: "Beş durak, beş yaş. Her durağın yanındaki mühür o gün ne kadar dolmuşsa o kadar çizilir.",
    en: "Five stops, five ages. The seal beside each stop is drawn exactly as full as it was that day.",
  },
} as const;

export const SAKURA_TIMELINE: SakuraEra[] = [
  {
    key: "academy",
    stage: 0,
    age: { tr: "12 yaş", en: "age 12" },
    title: { tr: "Akademi ve kıskançlık", en: "The academy and the envy" },
    text: {
      tr: "Sınıfın en zekisi. Yazılıda kimse ona yetişemiyor, sahada kimse onu saymıyor. Ino ile arkadaşlığı bir saç kurdelesiyle başladı, bir isim yüzünden rekabete döndü. Bu dönemin Sakura'sı hâlâ birinin arkasında duruyor.",
      en: "Top of the class. Nobody catches her on paper, nobody counts her in the field. Her friendship with Ino began with a hair ribbon and turned into rivalry over a name. The Sakura of this era is still standing behind somebody.",
    },
    imageKey: SAKURA_IMAGE_KEYS.eraAcademy,
  },
  {
    key: "forest",
    stage: 1,
    age: { tr: "12 yaş", en: "age 12" },
    title: { tr: "Ölüm Ormanı — kesilen saç", en: "Forest of Death — the cut hair" },
    text: {
      tr: "İki takım arkadaşı da baygın. Ses köyünün ninjaları geliyor ve ayakta tek o var. Saçından tutulunca kunaiyi kaldırıp kendi saçını kesti — uğruna uzattığı şeyi, uğruna savaşacağı şey için bıraktı. Sayfanın gerçek başlangıcı burası.",
      en: "Both teammates unconscious. The Sound ninja are coming and she is the only one standing. Seized by the hair, she raised the kunai and cut it off herself — she gave up the thing she had grown for someone in order to fight for them. This is where the page really begins.",
    },
    imageKey: SAKURA_IMAGE_KEYS.eraForest,
  },
  {
    key: "tsunade",
    stage: 2,
    age: { tr: "13 → 15 yaş", en: "ages 13 → 15" },
    title: { tr: "Tsunade çıraklığı", en: "Apprenticeship under Tsunade" },
    text: {
      tr: "Naruto Jiraiya ile, Sasuke Orochimaru ile gitti. Sakura kendi ustasını kendi istedi — Beşinci Hokage'nin kapısını çalıp öğrencisi olmayı o talep etti. Bu üç yıl hem tıbbi ninjutsu hem de sessiz birikim yılları: her gün kesilen chakra alına yatırılıyor.",
      en: "Naruto left with Jiraiya, Sasuke with Orochimaru. Sakura chose her own master — she knocked on the Fifth Hokage's door and asked to be her student. These three years are both medical ninjutsu and silent accumulation: the chakra cut each day is deposited in the forehead.",
    },
    imageKey: SAKURA_IMAGE_KEYS.eraTsunade,
  },
  {
    key: "sasori",
    stage: 3,
    age: { tr: "15 yaş", en: "age 15" },
    title: { tr: "Sasori zaferi", en: "The victory over Sasori" },
    text: {
      tr: "Akatsuki'nin bir üyesi ilk kez düştü ve düşüren kişi bir tıp ninjasıydı. Sakura, Chiyo ile birlikte üç yüz kuklanın karşısına çıktı; zehri önceden çözdüğü için hayatta kaldı, kontrolü sayesinde kazandı. Bu bir güç zaferi değil, hazırlık zaferi.",
      en: "An Akatsuki member fell for the first time, and the person who felled him was a medic. Alongside Chiyo, Sakura faced three hundred puppets; she survived because she had already resolved the poison and won because of her control. This is not a victory of power but of preparation.",
    },
    imageKey: SAKURA_IMAGE_KEYS.eraSasori,
  },
  {
    key: "war",
    stage: 4,
    age: { tr: "17 yaş", en: "age 17" },
    title: {
      tr: "Dördüncü Savaş — mührün açılışı",
      en: "The Fourth War — the seal opens",
    },
    text: {
      tr: "Alındaki eşkenar dörtgen yarıldı, çizgiler yüze yayıldı. Sōzō Saisei açıkken Sakura ne yaralanır ne durur; aynı depo Ōkashō'yu besler. Katsuyu üzerinden aynı chakra bütün ittifaka dağıtılır. Üç yıl önce hiç kimsenin görmediği alışkanlık, o gün bir orduyu ayakta tutar.",
      en: "The rhombus on her forehead split and the lines spread across her face. With Sōzō Saisei open Sakura neither wounds nor stops; the same store feeds Ōkashō. Through Katsuyu the same chakra is distributed to the whole alliance. A habit nobody witnessed three years earlier holds an army upright that day.",
    },
    quote: {
      tr: "Üç yıl boyunca azar azar biriktirdiğim chakra — hepsi bu.",
      en: "Three years of chakra, saved little by little — this is all of it.",
    },
    quoteSource: {
      tr: "Sakura Haruno — Dördüncü Shinobi Savaşı",
      en: "Sakura Haruno — Fourth Shinobi World War",
    },
    imageKey: SAKURA_IMAGE_KEYS.eraWar,
  },
];

/* ── Kapanış ───────────────────────────────────────────────────────── */

export const SAKURA_CLOSING = {
  /** İki büyük replik: biri 12 yaşından, biri 17'den — sayfanın tamamı */
  quotes: [
    {
      text: {
        tr: "Hep ikinizin sırtına bakıyordum.",
        en: "I was always looking at the backs of you two.",
      },
      source: {
        tr: "Ölüm Ormanı — saçını kesmeden önce",
        en: "Forest of Death — before she cut her hair",
      },
    },
    {
      text: {
        tr: "Ben de Beşinci Hokage'nin öğrencisiyim.",
        en: "I too am the Fifth Hokage's apprentice.",
      },
      source: {
        tr: "Dördüncü Shinobi Savaşı",
        en: "Fourth Shinobi World War",
      },
    },
  ],
  motto: {
    native: "しゃんなろー",
    reading: "Shannarō",
    note: {
      tr: "Çevrilmeyen nara. Sözlükte karşılığı yok; öfkenin ve kararın aynı anda çıktığı ses.",
      en: "An untranslatable battle cry. It has no dictionary entry; it is the sound of anger and resolve leaving at once.",
    },
  },
  credit: {
    tr: "Künye bilgileri ve yedek portre AniList'ten alınmıştır. Sayfadaki mühür, taçyaprakları ve çatlaklar arşiv için elle çizilmiş SVG'lerdir; dışarıdan görsel kullanılmamıştır.",
    en: "Dossier data and the fallback portrait come from AniList. The seal, petals and cracks on this page are SVGs drawn by hand for the archive; no external imagery is used.",
  },
  creditLink: {
    tr: "AniList künyesi — Sakura Haruno",
    en: "AniList entry — Sakura Haruno",
  },
} as const;
