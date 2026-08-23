import type { LocalizedText } from "./types";

/**
 * Ichigo Kurosaki — deneyim sayfasının veri iskeleti.
 *
 * Konsept: **MASKENİN ÇATLAĞI**. Sayfayı baştan aşağı kırık bir çatlak
 * iner; solu Shinigami (siyah/kızıl), sağı Hollow (kemik beyazı). Bölümler
 * çatlağın iki yanına kayar. Sayfanın kalbi "Kim konuşuyor?" denetimi:
 * beş kademe, her kademede maske örtüsü büyür.
 *
 * Kural 1 (AGENTS.md): görünen her metin iki dilli `LocalizedText`.
 * Özel adlar (zanpakutō, teknik, ark) çevrilmez; açıklaması çevrilir.
 *
 * Künye sayıları `anilist-detay.json`daki AniList kaydından (karakter #5,
 * 22 Ağustos 2026 önbelleği). Uydurma yok: emin olunmayan replik sayfaya
 * girmedi — kapanışta iki replik var, ikisi de tartışmasız.
 *
 * Görseller veritabanında: characterId 5 kaydının ABILITY yuvaları,
 * `ichigo:*` anahtarlarıyla (Itachi'deki `itachi:*` deseninin kardeşi).
 * Yuva boşken bölüm görselsiz ama ayakta kalır.
 */

export const ICHIGO_ID = 5;

/* ── Görsel yuvaları ────────────────────────────────────────────────── */

export const ICHIGO_IMAGE_KEYS = {
  /** Hero'nun arkasındaki geniş sahne (16:9) — portre onun üstünde durur */
  hero: "ichigo:hero",
  /** "Kim konuşuyor?" sahnesinin zemini (16:9) */
  voiceBackdrop: "ichigo:voice-backdrop",
  /** Vizard maskesi yakın plan (kare) — laboratuvarın üçüncü kartı */
  mask: "ichigo:mask",
  zangetsu: "ichigo:zangetsu",
  tensaZangetsu: "ichigo:tensa-zangetsu",
  hollowfication: "ichigo:hollowfication",
  getsuga: "ichigo:getsuga",
  shunpo: "ichigo:shunpo",
  blut: "ichigo:blut",
  fullbring: "ichigo:fullbring",
  fateRukia: "ichigo:fate-rukia",
  fateSoulSociety: "ichigo:fate-soul-society",
  fateHuecoMundo: "ichigo:fate-hueco-mundo",
  fateAizen: "ichigo:fate-aizen",
  fateTybw: "ichigo:fate-tybw",
} as const;

/** Küratör yuvasının üstünde görünen etiket — ne beklendiğini söyler. */
export const ICHIGO_SLOT_LABELS: Record<string, LocalizedText> = {
  [ICHIGO_IMAGE_KEYS.hero]: {
    tr: "Hero sahnesi — geniş kadraj (16:9)",
    en: "Hero scene — wide crop (16:9)",
  },
  [ICHIGO_IMAGE_KEYS.voiceBackdrop]: {
    tr: "“Kim konuşuyor?” zemini (16:9)",
    en: "“Who is speaking?” backdrop (16:9)",
  },
  [ICHIGO_IMAGE_KEYS.mask]: {
    tr: "Vizard maskesi — yakın plan (kare)",
    en: "Vizard mask — close-up (square)",
  },
  [ICHIGO_IMAGE_KEYS.zangetsu]: {
    tr: "Zangetsu — shikai (16:9)",
    en: "Zangetsu — shikai (16:9)",
  },
  [ICHIGO_IMAGE_KEYS.tensaZangetsu]: {
    tr: "Tensa Zangetsu — bankai (16:9)",
    en: "Tensa Zangetsu — bankai (16:9)",
  },
  [ICHIGO_IMAGE_KEYS.hollowfication]: {
    tr: "Hollowlaşma — maske takılırken (16:9)",
    en: "Hollowfication — the mask forming (16:9)",
  },
  [ICHIGO_IMAGE_KEYS.getsuga]: {
    tr: "Getsuga Tenshō — kesik (16:9)",
    en: "Getsuga Tenshō — the arc (16:9)",
  },
  [ICHIGO_IMAGE_KEYS.shunpo]: {
    tr: "Shunpo — adım izi (16:9)",
    en: "Shunpo — the step (16:9)",
  },
  [ICHIGO_IMAGE_KEYS.blut]: {
    tr: "Blut — Quincy damarları (16:9)",
    en: "Blut — Quincy veins (16:9)",
  },
  [ICHIGO_IMAGE_KEYS.fullbring]: {
    tr: "Fullbring — rozetin dönüşümü (16:9)",
    en: "Fullbring — the badge transformed (16:9)",
  },
  [ICHIGO_IMAGE_KEYS.fateRukia]: {
    tr: "Kader 1 — Rukia'nın kılıcı (16:9)",
    en: "Fate 1 — Rukia's blade (16:9)",
  },
  [ICHIGO_IMAGE_KEYS.fateSoulSociety]: {
    tr: "Kader 2 — Ruh Toplumu, Byakuya (16:9)",
    en: "Fate 2 — Soul Society, Byakuya (16:9)",
  },
  [ICHIGO_IMAGE_KEYS.fateHuecoMundo]: {
    tr: "Kader 3 — Hueco Mundo, Ulquiorra (16:9)",
    en: "Fate 3 — Hueco Mundo, Ulquiorra (16:9)",
  },
  [ICHIGO_IMAGE_KEYS.fateAizen]: {
    tr: "Kader 4 — Aizen, Son Getsuga (16:9)",
    en: "Fate 4 — Aizen, Final Getsuga (16:9)",
  },
  [ICHIGO_IMAGE_KEYS.fateTybw]: {
    tr: "Kader 5 — Bin Yıllık Kan Savaşı (16:9)",
    en: "Fate 5 — Thousand-Year Blood War (16:9)",
  },
};

/* ── Hero ───────────────────────────────────────────────────────────── */

export const ICHIGO_HERO = {
  name: "Ichigo Kurosaki",
  nativeName: "黒崎一護",
  /** Filigran — dev boyutta, `aria-hidden` (vekil shinigami unvanı) */
  watermark: "死神代行",
  /** Filigranın okunuşu, küçük punto */
  watermarkRomaji: "shinigami daikō",
  title: {
    tr: "Vekil Shinigami",
    en: "Substitute Soul Reaper",
  },
  epigraph: {
    tr: "Bir bedende dört miras: insan, shinigami, hollow, quincy. Sayfanın tek sorusu bu — konuşan hangisi?",
    en: "Four inheritances in one body: human, Soul Reaper, Hollow, Quincy. This page asks one question — which one is speaking?",
  },
  portraitAlt: {
    tr: "Ichigo Kurosaki — AniList künye portresi",
    en: "Ichigo Kurosaki — AniList profile portrait",
  },
  /** Portrenin altındaki kadraj etiketi */
  frameNote: {
    tr: "künye portresi · AniList #5",
    en: "profile portrait · AniList #5",
  },
} as const;

/** Reiatsu modu düğmesi — sayfanın tamamını çeviren tek durum. */
export const ICHIGO_REIATSU_TEXT = {
  enter: { tr: "Reiatsu modu", en: "Reiatsu mode" },
  exit: { tr: "Reiatsu iniyor", en: "Reiatsu receding" },
  /** Düğmenin yanındaki tek satırlık açıklama (ekran okuyucuya da iner) */
  note: {
    tr: "Basınç dalgası: kenarlar kızıla yıkanır, çatlak parlar.",
    en: "Pressure wave: the edges wash red, the crack lights up.",
  },
} as const;

/* ── Künye şeridi ───────────────────────────────────────────────────── */

export const ICHIGO_IDENTITY_TITLE = {
  title: { tr: "Künye", en: "Dossier" },
  lede: {
    tr: "AniList kaydından gelen satırlar ve arşivin kendi notları. Sağ sütun çatlağın Hollow tarafında duruyor.",
    en: "Lines from the AniList record and the archive's own notes. The right column stands on the Hollow side of the crack.",
  },
} as const;

export const ICHIGO_FACTS: { label: LocalizedText; value: LocalizedText }[] = [
  {
    label: { tr: "Doğum", en: "Birthday" },
    value: { tr: "15 Temmuz", en: "15 July" },
  },
  {
    label: { tr: "Boy", en: "Height" },
    value: { tr: "181 cm", en: "181 cm" },
  },
  {
    label: { tr: "Kan grubu", en: "Blood type" },
    value: { tr: "A", en: "A" },
  },
  {
    label: { tr: "Yaş", en: "Age" },
    value: { tr: "15 → 29 (seri boyunca)", en: "15 → 29 (across the series)" },
  },
  {
    label: { tr: "Unvan", en: "Title" },
    value: { tr: "死神代行 — vekil shinigami", en: "死神代行 — substitute Soul Reaper" },
  },
  {
    label: { tr: "Zanpakutō", en: "Zanpakutō" },
    value: { tr: "Zangetsu — 斬月", en: "Zangetsu — 斬月" },
  },
  {
    label: { tr: "Damarındakiler", en: "What runs in him" },
    value: {
      tr: "İnsan · Shinigami · Hollow · Quincy",
      en: "Human · Soul Reaper · Hollow · Quincy",
    },
  },
  {
    label: { tr: "Ev", en: "Home" },
    value: {
      tr: "Karakura Kasabası — Kurosaki Kliniği",
      en: "Karakura Town — Kurosaki Clinic",
    },
  },
  {
    label: { tr: "Sembolü", en: "Token" },
    value: { tr: "Vekillik rozeti — 代行証", en: "Substitute badge — 代行証" },
  },
  {
    label: { tr: "Ailesi", en: "Family" },
    value: {
      tr: "Isshin · Masaki † · Karin · Yuzu",
      en: "Isshin · Masaki † · Karin · Yuzu",
    },
  },
  {
    label: { tr: "Adının anlamı", en: "What his name means" },
    value: {
      tr: "一護 — “koruyan bir kişi”",
      en: "一護 — “one who protects”",
    },
  },
  {
    label: { tr: "Anıldığı adlar", en: "Also called" },
    value: { tr: "Ichi-nii · Ryoka Boy", en: "Ichi-nii · Ryoka Boy" },
  },
];

/* ── Laboratuvar ────────────────────────────────────────────────────── */

export const ICHIGO_LAB_TITLE = {
  title: { tr: "Üç Kılıç, Tek El", en: "Three Blades, One Hand" },
  lede: {
    tr: "Ichigo'nun gücü büyümüyor, katmanlanıyor. Her katman bir öncekinin üstünü örtüyor ve altındakini hiç susturmuyor.",
    en: "Ichigo's power does not grow, it layers. Each layer covers the one before it and never silences what lies beneath.",
  },
} as const;

export interface IchigoArt {
  key: "zangetsu" | "tensaZangetsu" | "hollowfication";
  name: string;
  kanji: string;
  /** Serbest bırakma komutu — yoksa neden yok, o da bilgi */
  release: LocalizedText;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
  imageKey: string;
}

export const ICHIGO_ARTS: IchigoArt[] = [
  {
    key: "zangetsu",
    name: "Zangetsu",
    kanji: "斬月",
    release: {
      tr: "Komut yok — kılıç kalıcı olarak serbest",
      en: "No command — the blade is permanently released",
    },
    tagline: { tr: "Kesen ay", en: "The slaying moon" },
    text: {
      tr: "Sırtında taşıdığı devasa kılıç bir shikai; çoğu shinigami'nin aksine Ichigo onu hiç mühürlemez. Kılıfı yok, sargısı var — savaş bitince sargı kendiliğinden kılıcı sarar. Boyu Ichigo'nun reiatsu'suyla ölçülür: gücü ne kadarsa bıçak o kadar.",
      en: "The oversized blade on his back is already a shikai; unlike most Soul Reapers, Ichigo never seals it. It has no scabbard, only wrapping that closes over the blade once the fight ends. Its size is a reading of his reiatsu: as much power, as much steel.",
    },
    traits: [
      { tr: "Kalıcı shikai", en: "Permanent shikai" },
      { tr: "Kılıfsız — sargılı", en: "No scabbard — wrapped" },
      { tr: "Reiatsu kesici", en: "Cuts reiatsu itself" },
    ],
    imageKey: ICHIGO_IMAGE_KEYS.zangetsu,
  },
  {
    key: "tensaZangetsu",
    name: "Tensa Zangetsu",
    kanji: "天鎖斬月",
    release: { tr: "“Bankai.”", en: "“Bankai.”" },
    tagline: { tr: "Gök zincirli kesen ay", en: "Heaven-chained slaying moon" },
    text: {
      tr: "Bankai'lerin çoğu büyür; bu küçülür. Dev bıçak siyah bir katana'ya iner, manto zincirlenir ve bütün kütle hıza çevrilir. Bleach'in en temiz tasarım fikri burada: güç, elindeki şeyin boyutuyla değil, onu ne kadar hızlı yerinde tutabildiğinle ölçülüyor.",
      en: "Most bankai grow; this one shrinks. The great blade collapses into a black katana, the coat chains shut, and every gram of mass is converted into speed. Bleach's cleanest design idea lives here: power measured not by the size of the thing in your hand but by how fast you can keep it where it belongs.",
    },
    traits: [
      { tr: "Hız — kütle değil", en: "Speed, not mass" },
      { tr: "Siyah bıçak", en: "Black blade" },
      { tr: "Üç günde öğrenildi", en: "Learned in three days" },
    ],
    imageKey: ICHIGO_IMAGE_KEYS.tensaZangetsu,
  },
  {
    key: "hollowfication",
    name: "Hollowfication",
    kanji: "虚化",
    release: {
      tr: "Komut yok — maske yüze elle çekilir",
      en: "No command — the mask is dragged over the face by hand",
    },
    tagline: { tr: "İçerideki beyaz", en: "The white one inside" },
    text: {
      tr: "Vizard maskesi bir teknik değil, bir pazarlık. İçerideki Hollow'un gücü ödünç alınıyor ve ödünç süreli: ilk zamanlar on bir saniyede maske çatlıyor. Süre uzadıkça soru büyüyor — maskeyi Ichigo mu takıyor, yoksa maske mi Ichigo'yu?",
      en: "The Vizard mask is not a technique, it is a bargain. The Hollow inside lends its strength, and the loan has a clock: early on the mask cracks at eleven seconds. As the clock stretches, the question grows — is Ichigo wearing the mask, or the mask wearing Ichigo?",
    },
    traits: [
      { tr: "11 saniye → dakikalar", en: "11 seconds → minutes" },
      { tr: "Reiatsu ikiye katlanır", en: "Reiatsu doubles" },
      { tr: "İçerideki sesle pazarlık", en: "A bargain with the voice inside" },
    ],
    imageKey: ICHIGO_IMAGE_KEYS.hollowfication,
  },
];

export interface IchigoMinorArt {
  name: string;
  kanji: string;
  note: LocalizedText;
  imageKey: string;
  /** Çatlağın hangi yanına ait: shinigami mirası mı, başka bir kan mı */
  side: "left" | "right";
}

export const ICHIGO_MINOR_ARTS: IchigoMinorArt[] = [
  {
    name: "Getsuga Tenshō",
    kanji: "月牙天衝",
    note: {
      tr: "Bıçağın ucundan fırlayan sıkıştırılmış reiatsu. Shikai'de mavi, bankai'de siyah — renk değişimi gücün değil, sahibin değişimi.",
      en: "Compressed reiatsu thrown from the blade's edge. Blue in shikai, black in bankai — the colour change marks a change of owner, not of power.",
    },
    imageKey: ICHIGO_IMAGE_KEYS.getsuga,
    side: "left",
  },
  {
    name: "Shunpo",
    kanji: "瞬歩",
    note: {
      tr: "Tek adımda mesafeyi silme. Ichigo'nunki kaba ve öğretilmemiş: adımı kimse çalıştırmadı, o sadece yetişmek zorunda kaldı.",
      en: "Erasing distance in a single step. Ichigo's is coarse and untaught: nobody drilled him, he simply had to keep up.",
    },
    imageKey: ICHIGO_IMAGE_KEYS.shunpo,
    side: "left",
  },
  {
    name: "Blut",
    kanji: "血装",
    note: {
      tr: "Annesinden gelen Quincy kanı. Reishi damardan akar; savunma ile saldırı asla aynı anda açılamaz — miras bile bir seçim dayatıyor.",
      en: "The Quincy blood from his mother. Reishi flows through the veins; defence and offence can never be open at once — even the inheritance forces a choice.",
    },
    imageKey: ICHIGO_IMAGE_KEYS.blut,
    side: "right",
  },
  {
    name: "Fullbring",
    kanji: "完現術",
    note: {
      tr: "Ruhun eşyada bıraktığı izi çekip çıkarma. Gücünü kaybettiği aylarda öğrendiği tek şey ve öğrendiği anda geri verdiği tek şey.",
      en: "Pulling out the trace a soul leaves in an object. The only thing he learned in the months without power, and the only thing he gave back the moment he learned it.",
    },
    imageKey: ICHIGO_IMAGE_KEYS.fullbring,
    side: "right",
  },
];

/* ── Sayfanın kalbi: "Kim konuşuyor?" ───────────────────────────────── */

export const ICHIGO_VOICE_TITLE = {
  /** Sayfanın merkezî sorusu — bölüm başlığı */
  title: { tr: "Kim konuşuyor?", en: "Who is speaking?" },
  question: {
    tr: "Bedenimde kaç kişi var?",
    en: "How many people are there in my body?",
  },
  lede: {
    tr: "Beş kademe. Kademe değiştikçe maske yüzü daha çok kaplar, reiatsu rengi döner ve künye satırları başka birinin ağzından konuşur. Ok tuşlarıyla gezilebilir.",
    en: "Five stages. As the stage changes the mask takes more of the face, the reiatsu colour turns, and the dossier lines start speaking in someone else's mouth. Navigable with the arrow keys.",
  },
  /** Denetimin erişilebilir adı */
  railLabel: { tr: "Kademeler", en: "Stages" },
  /** Kademe listesinin üstündeki mikro-yönerge */
  hint: {
    tr: "↑ ↓ ok tuşları — kademeler arasında gez",
    en: "↑ ↓ arrow keys — move between stages",
  },
  /** Maskenin ne kadarını kapladığını söyleyen ölçü satırı */
  coverLabel: { tr: "Maske örtüsü", en: "Mask coverage" },
} as const;

export type IchigoStageKey =
  | "human"
  | "shinigami"
  | "vizard"
  | "hollow"
  | "final";

export interface IchigoStage {
  key: IchigoStageKey;
  name: LocalizedText;
  kanji: string;
  /** Yüzün ne kadarını maske kaplıyor: 0 → 1 (CSS `--cover`) */
  cover: number;
  /** Kademenin başına iliştirilen tek satırlık kimlik */
  who: LocalizedText;
  text: LocalizedText;
  /** Kademeyle birlikte değişen künye satırları (etiket → değer) */
  lines: { label: LocalizedText; value: LocalizedText }[];
}

export const ICHIGO_STAGES: IchigoStage[] = [
  {
    key: "human",
    name: { tr: "İnsan", en: "Human" },
    kanji: "人間",
    cover: 0,
    who: {
      tr: "Karakura'da bir lise öğrencisi",
      en: "A high-school student in Karakura",
    },
    text: {
      tr: "Küçüklüğünden beri ruhları görüyor ve uzun süre yaşayanla öleni birbirinden ayıramıyor. Sayfanın başladığı yer burası: henüz hiçbir gücü yok, yalnızca kimsenin görmediğini görme huzursuzluğu var.",
      en: "He has seen spirits since childhood, and for a long time he cannot tell the living from the dead. This is where the page starts: no power yet, only the unease of seeing what nobody else does.",
    },
    lines: [
      { label: { tr: "Konuşan", en: "Speaking" }, value: { tr: "Kendi sesi", en: "His own voice" } },
      {
        label: { tr: "Reiatsu", en: "Reiatsu" },
        value: { tr: "Görünmez — ama ölüleri çekiyor", en: "Invisible — yet it draws the dead" },
      },
      { label: { tr: "Bedel", en: "The price" }, value: { tr: "Henüz yok", en: "None yet" } },
    ],
  },
  {
    key: "shinigami",
    name: { tr: "Shinigami", en: "Soul Reaper" },
    kanji: "死神",
    cover: 0.08,
    who: {
      tr: "Rukia'nın gücünü ödünç alan vekil",
      en: "The substitute who borrowed Rukia's power",
    },
    text: {
      tr: "Rukia Kuchiki kılıcını göğsüne saplıyor ve gücünün yarısını veriyor. Ichigo'nun aldığı şey bir yetenek değil, bir görev: Rukia iyileşene kadar onun işini yapacak. Yüzde henüz maske yok — ama beyazın ilk kılcal çatlağı orada.",
      en: "Rukia Kuchiki drives her sword into his chest and hands over half her power. What Ichigo receives is not a talent but a duty: he will do her job until she recovers. There is no mask on the face yet — but the first hairline fracture of the white is already there.",
    },
    lines: [
      {
        label: { tr: "Konuşan", en: "Speaking" },
        value: { tr: "Zangetsu — içerideki yaşlı adam", en: "Zangetsu — the old man inside" },
      },
      {
        label: { tr: "Reiatsu", en: "Reiatsu" },
        value: { tr: "Kesici mavi — getsuga rengi", en: "Cutting blue — the getsuga colour" },
      },
      {
        label: { tr: "Bedel", en: "The price" },
        value: { tr: "Rukia'nın gücünün yarısı", en: "Half of Rukia's power" },
      },
    ],
  },
  {
    key: "vizard",
    name: { tr: "Vizard", en: "Vizard" },
    kanji: "仮面の軍勢",
    cover: 0.55,
    who: { tr: "Maskeyi eliyle çeken shinigami", en: "The Soul Reaper who pulls the mask down" },
    text: {
      tr: "Maske yüzün yarısını alıyor ve ses ikiye bölünüyor. İçerideki beyaz artık pazarlık masasında: gücü veriyor, karşılığında yer istiyor. İlk maske on bir saniye dayanıyor; sonraki her savaş o sayacı biraz daha uzatıyor.",
      en: "The mask takes half the face and the voice splits in two. The white one inside is at the bargaining table now: it lends the strength and asks for ground in return. The first mask holds eleven seconds; every later fight stretches that counter a little further.",
    },
    lines: [
      {
        label: { tr: "Konuşan", en: "Speaking" },
        value: { tr: "İkisi birden — üst üste", en: "Both at once — overlaid" },
      },
      {
        label: { tr: "Reiatsu", en: "Reiatsu" },
        value: { tr: "Kızıl-siyah, dengesiz", en: "Crimson-black, unstable" },
      },
      {
        label: { tr: "Bedel", en: "The price" },
        value: { tr: "On bir saniye. Sonra maske kırılıyor.", en: "Eleven seconds. Then the mask breaks." },
      },
    ],
  },
  {
    key: "hollow",
    name: { tr: "Tam Hollowlaşma", en: "Full Hollowfication" },
    kanji: "完全虚化",
    cover: 1,
    who: { tr: "Artık Ichigo değil", en: "No longer Ichigo" },
    text: {
      tr: "Hueco Mundo'da, Ulquiorra'nın önünde ölmüş bir bedenden ayağa kalkan şey Ichigo değil. Maske tamamlanıyor, boynuzlar çıkıyor, göğüste bir Hollow deliği açılıyor. Savaş kazanılıyor — ama kazananın kim olduğu sorusu sayfanın geri kalanını zehirliyor.",
      en: "In Hueco Mundo, in front of Ulquiorra, the thing that rises from a dead body is not Ichigo. The mask completes itself, horns appear, a Hollow hole opens in the chest. The fight is won — but the question of who won it poisons the rest of the page.",
    },
    lines: [
      {
        label: { tr: "Konuşan", en: "Speaking" },
        value: { tr: "Hiçbiri. Bu form konuşmuyor.", en: "Neither. This form does not speak." },
      },
      {
        label: { tr: "Reiatsu", en: "Reiatsu" },
        value: { tr: "Kemik beyazı bir sütun", en: "A pillar of bone white" },
      },
      {
        label: { tr: "Bedel", en: "The price" },
        value: {
          tr: "Yanındakini deldi ve hatırlamıyor.",
          en: "It ran a friend through, and remembers nothing.",
        },
      },
    ],
  },
  {
    key: "final",
    name: { tr: "Son Getsuga Tenshō", en: "Final Getsuga Tenshō" },
    kanji: "最後の月牙天衝",
    cover: 1,
    who: { tr: "Getsuga'nın kendisi", en: "The Getsuga itself" },
    text: {
      tr: "Maske düşüyor, yerine siyah sargılar geliyor: tekniği kullanmıyor, tekniğin kendisi oluyor. Aizen'i durduran darbe aynı zamanda Ichigo'nun bütün gücünü yakıyor. Çatlağın iki yanı bu kademede tek renge iniyor — ışığı yutan siyaha.",
      en: "The mask falls away and black wrappings take its place: he does not use the technique, he becomes it. The blow that stops Aizen burns every ounce of his power. Here the two sides of the crack collapse into one colour — the black that swallows light.",
    },
    lines: [
      {
        label: { tr: "Konuşan", en: "Speaking" },
        value: { tr: "Zangetsu — çünkü artık o, Ichigo", en: "Zangetsu — because it is Ichigo now" },
      },
      {
        label: { tr: "Reiatsu", en: "Reiatsu" },
        value: { tr: "Siyah. Işığı yutan tek renk.", en: "Black. The one colour that swallows light." },
      },
      {
        label: { tr: "Bedel", en: "The price" },
        value: { tr: "Gücünün tamamı ve on yedi ay sessizlik", en: "All of his power, and seventeen months of silence" },
      },
    ],
  },
];

/* ── Kader çizelgesi ────────────────────────────────────────────────── */

export const ICHIGO_FATE_TITLE = {
  title: { tr: "Kader Çizelgesi", en: "The Line of Fate" },
  lede: {
    tr: "Beş durak. Her durakta çatlak bir kez daha kırılıyor ve Ichigo'nun içinden başka biri cevap veriyor.",
    en: "Five stops. At each one the crack breaks again, and someone else answers from inside Ichigo.",
  },
} as const;

export interface IchigoFateStep {
  key: string;
  age: LocalizedText;
  /** Adımın orijinal dildeki işareti — replik değil, teknik/unvan adı */
  mark: string;
  title: LocalizedText;
  text: LocalizedText;
  imageKey: string;
  /** Çatlağın hangi yanında duruyor */
  side: "left" | "right";
}

export const ICHIGO_FATE: IchigoFateStep[] = [
  {
    key: "rukia",
    age: { tr: "15 yaşında", en: "Age 15" },
    mark: "死神代行",
    title: {
      tr: "Yağmurun altındaki kılıç",
      en: "The blade under the rain",
    },
    text: {
      tr: "Ichigo dokuz yaşındayken bir nehir kenarında annesini kaybediyor; o günden sonra yağmur bu sayfanın hava durumu oluyor. Altı yıl sonra bir Hollow evin kapısını kırıyor, Rukia Kuchiki araya giriyor ve Ichigo — kurtarmak için hiçbir yolu kalmayınca — kılıcın kendi göğsüne saplanmasına izin veriyor. Vekillik burada başlıyor.",
      en: "At nine, by a riverbank, Ichigo loses his mother; from that day the rain becomes this page's weather. Six years later a Hollow tears the front door open, Rukia Kuchiki steps in, and Ichigo — out of every other way to save them — lets the sword be driven into his own chest. The substitution starts here.",
    },
    imageKey: ICHIGO_IMAGE_KEYS.fateRukia,
    side: "left",
  },
  {
    key: "soul-society",
    age: { tr: "15 yaşında", en: "Age 15" },
    mark: "卍解",
    title: { tr: "Ruh Toplumu — ve Byakuya", en: "Soul Society — and Byakuya" },
    text: {
      tr: "Rukia idama gönderiliyor, Ichigo peşinden Ruh Toplumu'na giriyor. Kendisinden yüzyıllarca kıdemli bir kaptanı yenmesi için elinde üç gün var; o üç günde bankai öğreniyor. Ama Byakuya'nın karşısında yüzünde beliren ilk beyaz parça, kazandığı savaşı bir uyarıya çeviriyor.",
      en: "Rukia is sentenced, and Ichigo walks into Soul Society after her. He has three days to beat a captain centuries his senior; in those three days he learns bankai. But the first white shard that surfaces on his face against Byakuya turns the fight he wins into a warning.",
    },
    imageKey: ICHIGO_IMAGE_KEYS.fateSoulSociety,
    side: "right",
  },
  {
    key: "hueco-mundo",
    age: { tr: "16 yaşında", en: "Age 16" },
    mark: "完全虚化",
    title: { tr: "Hueco Mundo — Ulquiorra'nın önünde", en: "Hueco Mundo — before Ulquiorra" },
    text: {
      tr: "Orihime'yi geri almak için çölün altındaki saraya iniyor ve orada kendisini hiç tanımayan bir rakiple karşılaşıyor: Ulquiorra kalbi sormuyor, kalbin nerede olduğunu soruyor. Ichigo'nun cevabı sözle değil, tam hollowlaşmayla geliyor — ve bu cevap kendisini de dehşete düşürüyor.",
      en: "He descends into the palace under the desert to take Orihime back, and meets an opponent who does not recognise him at all: Ulquiorra does not ask about the heart, he asks where it is kept. Ichigo's answer arrives not in words but in full hollowfication — and the answer horrifies him too.",
    },
    imageKey: ICHIGO_IMAGE_KEYS.fateHuecoMundo,
    side: "left",
  },
  {
    key: "aizen",
    age: { tr: "17 yaşında", en: "Age 17" },
    mark: "最後の月牙天衝",
    title: { tr: "Aizen — ve Son Getsuga Tenshō", en: "Aizen — and the Final Getsuga Tenshō" },
    text: {
      tr: "Karakura gökyüzünün altında herkes yeniliyor. Ichigo babasıyla birlikte çekildiği eğitimden bir teknikle dönüyor: kullanana bedelini peşin ödeten bir teknik. Aizen duruyor, kılıç kırılıyor, güç sönüyor. Sonraki on yedi ay boyunca Ichigo yeniden yalnızca bir lise öğrencisi.",
      en: "Under the Karakura sky everyone else has already lost. Ichigo comes back from the training he took with his father carrying a technique that charges its price up front. Aizen stops, the sword breaks, the power goes out. For the next seventeen months Ichigo is only a high-school student again.",
    },
    imageKey: ICHIGO_IMAGE_KEYS.fateAizen,
    side: "right",
  },
  {
    key: "tybw",
    age: { tr: "17 yaşında", en: "Age 17" },
    mark: "斬月",
    title: {
      tr: "Bin Yıllık Kan Savaşı — gerçek Zangetsu",
      en: "Thousand-Year Blood War — the real Zangetsu",
    },
    text: {
      tr: "Sayfanın bütün sorusu burada cevabını buluyor. Yıllardır “Zangetsu” diye konuştuğu yaşlı adam annesinden gelen Quincy gücünün yüzüydü; kılıcın gerçek ruhu, bastırdığı beyaz olandı. Ichigo o güne kadar kendi bıçağının adını yanlış biliyordu — ve kimse ona yalan söylememişti, herkes onu korumaya çalışmıştı.",
      en: "Every question this page asks is answered here. The old man he has called “Zangetsu” for years was the face of the Quincy power inherited from his mother; the sword's true spirit was the white one he had been suppressing. Until that day Ichigo had the name of his own blade wrong — and nobody had lied to him, everybody had been trying to protect him.",
    },
    imageKey: ICHIGO_IMAGE_KEYS.fateTybw,
    side: "left",
  },
];

/* ── Bağlar — çatlağın iki yanı ─────────────────────────────────────── */

export const ICHIGO_BONDS_TITLE = {
  title: { tr: "Çatlağın İki Yanı", en: "Both Sides of the Crack" },
  lede: {
    tr: "Solda onu insan tutanlar, sağda içindeki beyazı büyütenler. Portre kaydımız henüz boş — bölüm adla ayakta duruyor.",
    en: "On the left the ones who keep him human, on the right the ones who feed the white inside him. Our portrait records are still empty — the section stands on names alone.",
  },
  leftLabel: { tr: "Shinigami tarafı", en: "Soul Reaper side" },
  rightLabel: { tr: "Hollow tarafı", en: "Hollow side" },
} as const;

export interface IchigoBond {
  name: string;
  characterId: number;
  side: "left" | "right";
  note: LocalizedText;
}

export const ICHIGO_BONDS: IchigoBond[] = [
  {
    name: "Rukia Kuchiki",
    characterId: 6,
    side: "left",
    note: {
      tr: "Kılıcı göğsüne saplayan el. Ichigo'nun yağmurunu durduran ilk kişi.",
      en: "The hand that drove the sword into his chest. The first person to stop Ichigo's rain.",
    },
  },
  {
    name: "Orihime Inoue",
    characterId: 7,
    side: "left",
    note: {
      tr: "Olanı reddedip geri çeviren güç. Ichigo'nun kırıldığı her yeri o kapatıyor.",
      en: "The power that rejects what happened and turns it back. She closes every place he breaks.",
    },
  },
  {
    name: "Uryū Ishida",
    characterId: 564,
    side: "left",
    note: {
      tr: "Quincy okçu. Rekabetle başladı; Ichigo'ya insan kalan yanını en çok o hatırlatıyor.",
      en: "The Quincy archer. It started as rivalry; he is the one who most reminds Ichigo of the human left in him.",
    },
  },
  {
    name: "Renji Abarai",
    characterId: 906,
    side: "left",
    note: {
      tr: "Aynı yıl, aynı zorlukta bankai öğrenen ikinci kişi. Rakiplikten omuz omuza.",
      en: "The other one who learned bankai that same year, the same hard way. From rivalry to shoulder to shoulder.",
    },
  },
  {
    name: "Kisuke Urahara",
    characterId: 210,
    side: "right",
    note: {
      tr: "Maskeyi mümkün kılan adam. Hem kurtarıcı hem suç ortağı — hiçbir zaman tek başına biri değil.",
      en: "The man who made the mask possible. Both rescuer and accomplice — never only one of the two.",
    },
  },
  {
    name: "Sōsuke Aizen",
    characterId: 1086,
    side: "right",
    note: {
      tr: "Her şeyi “planımdı” diye anlatan ses. Ichigo'nun bütün seçimlerine gölge düşürüyor.",
      en: "The voice that narrates everything as “my design”. It casts a shadow over every choice Ichigo makes.",
    },
  },
  {
    name: "Kenpachi Zaraki",
    characterId: 909,
    side: "right",
    note: {
      tr: "Savaşmayı sevmeyi öğreten bıçak. İçerideki beyazın en çok sevdiği karşılaşma.",
      en: "The blade that teaches him to enjoy fighting. The white one inside likes this match-up best.",
    },
  },
  {
    name: "Ulquiorra Cifer",
    characterId: 1081,
    side: "right",
    note: {
      tr: "Kalbin nerede olduğunu soran Espada. Cevabı Ichigo değil, Orihime verdi.",
      en: "The Espada who asks where the heart is kept. The answer came from Orihime, not from Ichigo.",
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────── */

export const ICHIGO_CLOSING = {
  title: { tr: "Kapanış", en: "Closing" },
  quotes: [
    {
      text: {
        tr: "Kazanmak istediğim için savaşmıyorum. Kazanmak zorunda olduğum için savaşıyorum.",
        en: "I don't fight because I want to win. I fight because I have to win.",
      },
      note: {
        tr: "Bleach — Ichigo Kurosaki",
        en: "Bleach — Ichigo Kurosaki",
      },
    },
    {
      text: { tr: "Yo.", en: "Yo." },
      note: {
        tr: "Ruh Toplumu'nda, Rukia'nın hücresine vardığında söylediği tek kelime. Serinin en kısa ve en pahalı repliği.",
        en: "The single word he says when he finally reaches Rukia's cell in Soul Society. The shortest and most expensive line in the series.",
      },
    },
  ],
  /** Orijinal dilde motto — ad kanjisinin kendi anlamı */
  motto: "一護",
  mottoGloss: {
    tr: "ichigo — “koruyan bir kişi”. Sayfanın başından beri tek yaptığı şey.",
    en: "ichigo — “one who protects”. The only thing he has done since page one.",
  },
  credit: {
    tr: "Künye ve kapak portresi: AniList karakter kaydı #5 (22 Ağustos 2026 önbelleği). Portre AniList CDN'inden geliyor; Bleach ve Ichigo Kurosaki üzerindeki haklar Tite Kubo / Shueisha'ya aittir. Sayfadaki çatlak, maske ve ay çizimlerinin tamamı bu arşiv için elle çizilmiş SVG'dir.",
    en: "Profile data and cover portrait: AniList character record #5 (cached 22 August 2026). The portrait is served from the AniList CDN; rights to Bleach and Ichigo Kurosaki belong to Tite Kubo / Shueisha. Every crack, mask and moon drawing on this page is hand-authored SVG made for this archive.",
  },
  creditLink: {
    tr: "AniList kaydı",
    en: "AniList record",
  },
  creditHref: "https://anilist.co/character/5",
} as const;
