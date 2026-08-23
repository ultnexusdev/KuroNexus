import type { LocalizedText } from "./types";

/**
 * Sasuke Uchiha — deneyim sayfasının veri iskeleti.
 *
 * Sayfanın tek fikri var: **iki göz, iki yol.** Sayfa boydan boya dikey bir
 * "yarık" ile ikiye bölünür — solda intikam (Sharingan kızılı), sağda
 * kefaret (Rinnegan moru). Bölümler bu eksenin iki yanına asimetrik
 * yerleşir; okuyucu çift göz diskinden bir yol seçtiğinde yarık kayar ve
 * paletin ağırlığı o yana döner.
 *
 * Bütün görünen metin burada, iki dilli `LocalizedText` çiftleri olarak
 * (AGENTS.md kural 1; Itachi ve Zaraki emsali). Bileşenler `pick()` ile
 * sunucuda dili seçip istemci adalarına düz dize indirir.
 *
 * Künye sayıları `anilist-detay.json`daki AniList kaydından (karakter 13,
 * 22 Ağustos 2026 önbelleği) — uydurulmuş rakam yok. Replikler yalnızca
 * emin olunanlar: üç tane, hepsi kaynağıyla birlikte.
 *
 * Görseller veritabanında: characterId 13 kaydının ABILITY yuvaları,
 * `sasuke:*` anahtarlarıyla. Hiçbir bölüm görsele bağımlı değil — yuva
 * boşken kart kendi elle çizilmiş işaretiyle ayakta kalır.
 */

export const SASUKE_ID = 13;

/** AniList künye adresi — kapanıştaki kaynak satırı buraya bağlanır. */
export const SASUKE_ANILIST_URL = "https://anilist.co/character/13";

/* ── Kürator yuvaları ───────────────────────────────────────────────────
   Her anahtar characterId 13 kaydında bir ABILITY satırına karşılık gelir.
   Görsel üretilmiyor: kullanıcı kürator modunda tek tek yükleyecek. */

export const SASUKE_IMAGE_KEYS = {
  /** Hero'nun arkasındaki geniş sahne (16:9) — portrenin ardına düşer */
  hero: "sasuke:hero",
  chidori: "sasuke:chidori",
  amaterasu: "sasuke:amaterasu",
  rinnegan: "sasuke:rinnegan",
  kirin: "sasuke:kirin",
  katon: "sasuke:katon",
  kusanagi: "sasuke:kusanagi",
  curse: "sasuke:curse",
  eraMassacre: "sasuke:era-massacre",
  eraOrochimaru: "sasuke:era-orochimaru",
  eraTaka: "sasuke:era-taka",
  eraWar: "sasuke:era-war",
  eraShadow: "sasuke:era-shadow",
} as const;

/** Yükleme kutusunun üstünde görünen etiketler — kürator ne beklendiğini bilsin. */
export const SASUKE_SLOT_LABELS: Record<string, LocalizedText> = {
  [SASUKE_IMAGE_KEYS.hero]: {
    tr: "Hero sahnesi — geniş kadraj (16:9)",
    en: "Hero scene — wide frame (16:9)",
  },
  [SASUKE_IMAGE_KEYS.chidori]: {
    tr: "Chidori — avuçta toplanan yıldırım",
    en: "Chidori — lightning gathered in the palm",
  },
  [SASUKE_IMAGE_KEYS.amaterasu]: {
    tr: "Amaterasu · Susanoo — kara alev ve mor zırh",
    en: "Amaterasu · Susanoo — black flame and violet armour",
  },
  [SASUKE_IMAGE_KEYS.rinnegan]: {
    tr: "Rinnegan — halkalı göz, Amenotejikara",
    en: "Rinnegan — the ringed eye, Amenotejikara",
  },
  [SASUKE_IMAGE_KEYS.kirin]: {
    tr: "Kirin — gökten inen yıldırım",
    en: "Kirin — lightning brought down from the sky",
  },
  [SASUKE_IMAGE_KEYS.katon]: {
    tr: "Katon: Gōkakyū — ateş topu",
    en: "Katon: Gōkakyū — the great fireball",
  },
  [SASUKE_IMAGE_KEYS.kusanagi]: {
    tr: "Kusanagi — çakra taşıyan çelik",
    en: "Kusanagi — steel that carries chakra",
  },
  [SASUKE_IMAGE_KEYS.curse]: {
    tr: "Lanet Mührü — boyundaki üç tomoe",
    en: "Cursed Seal — three tomoe on the neck",
  },
  [SASUKE_IMAGE_KEYS.eraMassacre]: {
    tr: "Kader 1 — klanın gecesi",
    en: "Fate 1 — the night of the clan",
  },
  [SASUKE_IMAGE_KEYS.eraOrochimaru]: {
    tr: "Kader 2 — yılanın altındaki yıllar",
    en: "Fate 2 — the years under the snake",
  },
  [SASUKE_IMAGE_KEYS.eraTaka]: {
    tr: "Kader 3 — Taka ve ağabeyin gerçeği",
    en: "Fate 3 — Taka and his brother's truth",
  },
  [SASUKE_IMAGE_KEYS.eraWar]: {
    tr: "Kader 4 — savaş ve vadideki son dövüş",
    en: "Fate 4 — the war and the last duel",
  },
  [SASUKE_IMAGE_KEYS.eraShadow]: {
    tr: "Kader 5 — gölgedeki Hokage",
    en: "Fate 5 — the shadow Hokage",
  },
};

/* ── Hero ───────────────────────────────────────────────────────────── */

export const SASUKE_HERO = {
  name: "Sasuke Uchiha",
  nativeName: "うちはサスケ",
  /** Sayfanın iki kelimesi: intikam ve kefaret — hero'nun üstünde filigran */
  axisKanji: "復讐 ／ 贖罪",
  portraitAlt: {
    tr: "Sasuke Uchiha — arşive yüklenen tam boy portre",
    en: "Sasuke Uchiha — full-size portrait uploaded to the archive",
  },
  epigraph: {
    tr: "Bir gözü geriye bakıyor, öteki ileriye. Sasuke Uchiha ömrünü bu iki bakışın arasındaki çizgide yürüyerek geçirdi.",
    en: "One eye looks back, the other ahead. Sasuke Uchiha spent his life walking the line between the two.",
  },
  /** Etiketler AniList'in `alternativeNames` alanından + arşivin bir notu */
  tags: [
    { tr: "Son Uchiha", en: "The Last Uchiha" },
    { tr: "Sharingan'ın Sasuke'si", en: "Sasuke of the Sharingan" },
    { tr: "Klanın hayatta kalanı", en: "The Uchiha Survivor" },
    { tr: "Gölgedeki Hokage", en: "The Shadow Hokage" },
  ] as LocalizedText[],
} as const;

/** Sayfayı mora çeviren mod düğmesi — tek durum, etkinin tamamı CSS'te. */
export const SASUKE_MODE_TEXT = {
  enter: { tr: "Rinnegan modu", en: "Rinnegan mode" },
  exit: { tr: "Rinnegan'ı kapat", en: "Close the Rinnegan" },
} as const;

/* ── Künye şeridi ───────────────────────────────────────────────────── */

export const SASUKE_IDENTITY = {
  title: { tr: "Künye", en: "The record" },
  lede: {
    tr: "AniList kaydındaki rakamlar ve arşivin kendi notları. Boy aralığı çocukluktan yetişkinliğe uzanıyor — bu sayfa da öyle.",
    en: "The figures on the AniList record, plus the archive's own notes. The height range runs from childhood to adulthood — so does this page.",
  },
  facts: [
    {
      label: { tr: "Doğum", en: "Birthday" },
      value: { tr: "23 Temmuz", en: "July 23" },
    },
    {
      label: { tr: "Boy", en: "Height" },
      value: { tr: "153,2 – 182 cm", en: "153.2 – 182 cm" },
    },
    {
      label: { tr: "Kan grubu", en: "Blood type" },
      value: { tr: "AB", en: "AB" },
    },
    {
      label: { tr: "Yaş", en: "Age" },
      value: {
        tr: "12–17 (Naruto) · 27+ (Boruto)",
        en: "12–17 (Naruto) · 27+ (Boruto)",
      },
    },
    {
      label: { tr: "Klan", en: "Clan" },
      value: { tr: "Uchiha — son iki kişiden biri", en: "Uchiha — one of the last two" },
    },
    {
      label: { tr: "Unvan", en: "Standing" },
      value: {
        tr: "Genin → köy kaçkını → gölgedeki Hokage",
        en: "Genin → village fugitive → shadow Hokage",
      },
    },
    {
      label: { tr: "Takım", en: "Team" },
      value: { tr: "Takım 7 · sonra Hebi / Taka", en: "Team 7 · later Hebi / Taka" },
    },
    {
      label: { tr: "Kılıcı", en: "Blade" },
      value: { tr: "Kusanagi — çakra ileten çelik", en: "Kusanagi — chakra-conducting steel" },
    },
  ],
} as const;

/* ── Teknik laboratuvarı ────────────────────────────────────────────── */

/** Büyük kartın hangi kanada yaslandığı — yarığın sol/sağ/ortası. */
export type SasukeWing = "vengeance" | "redemption" | "rift";

/** Elle çizilmiş işaret seti (SasukeSigils.tsx) ile eşleşen anahtar. */
export type SasukeSigil =
  | "bolt"
  | "blackflame"
  | "rings"
  | "kirin"
  | "flame"
  | "blade"
  | "seal";

export interface SasukeTechnique {
  key: "chidori" | "amaterasu" | "rinnegan";
  kanji: string;
  name: string;
  sigil: SasukeSigil;
  wing: SasukeWing;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
  imageKey: string;
}

export const SASUKE_LAB = {
  title: { tr: "Yıldırım, kara alev ve boşluk", en: "Lightning, black flame, and void" },
  lede: {
    tr: "Sasuke'nin cephaneliği kendi icadı değil, aldığı armağanların listesidir: Chidori'yi ustası verdi, kara alevi ağabeyi, halkalı gözü Altı Yol'un kendisi. Her armağanın bir bedeli var.",
    en: "Sasuke's arsenal is not an invention but a list of gifts: his teacher gave him the Chidori, his brother the black flame, the Sage himself the ringed eye. Every gift came with a price.",
  },
} as const;

export const SASUKE_TECHNIQUES: SasukeTechnique[] = [
  {
    key: "chidori",
    kanji: "千鳥",
    name: "Chidori",
    sigil: "bolt",
    wing: "vengeance",
    tagline: {
      tr: "Bin kuşun sesi, tek bir doğrultuda.",
      en: "The cry of a thousand birds, along a single line.",
    },
    text: {
      tr: "Kakashi'nin ona öğrettiği tek teknik. Yıldırım avuçta toplanır, ses cıvıldayan bir kuş sürüsüne benzer ve el düz bir çizgide gider — geri dönüşü yoktur, bu yüzden bir suikast tekniğidir. Sasuke onu ince bir kalkana (Chidori Nagashi), uzun bir mızrağa ve sonunda gökten indirilen bir yıldırıma dönüştürdü.",
      en: "The only technique Kakashi taught him. Lightning gathers in the palm, the sound resembles a flock of chirping birds, and the hand travels in a straight line — there is no turning back, which is why it is an assassination technique. Sasuke thinned it into a shield, stretched it into a spear, and finally called it down from the sky.",
    },
    traits: [
      { tr: "Yıldırım doğası", en: "Lightning nature" },
      { tr: "Kakashi'nin mirası", en: "Kakashi's legacy" },
      { tr: "Dönüşü olmayan hamle", en: "A move with no return" },
    ],
    imageKey: SASUKE_IMAGE_KEYS.chidori,
  },
  {
    key: "amaterasu",
    kanji: "天照 ／ 須佐能乎",
    name: "Amaterasu · Susanoo",
    sigil: "blackflame",
    wing: "rift",
    tagline: {
      tr: "Sönmeyen ateş ve onu taşıyacak zırh.",
      en: "Fire that will not die, and the armour built to carry it.",
    },
    text: {
      tr: "Ağabeyinin son armağanı bir gözde kara alev olarak uyandı: bakışın değdiği yer yanar, alev söndürülemez. Öteki göz Susanoo'yu çağırır — Sasuke'nin devi bir okçudur, kaburgalardan başlar, kanatlanır ve okunun ucunda Amaterasu'yu taşır. Bu kart yarığın iki yanına birden basar: alev intikamdan, zırh koruma isteğinden gelir.",
      en: "His brother's final gift woke in one eye as black fire: whatever the gaze touches burns, and the flame cannot be put out. The other eye calls Susanoo — Sasuke's colossus is an archer, born from ribs, later winged, carrying Amaterasu on the tip of its arrow. This card straddles the rift: the flame comes from vengeance, the armour from the wish to shield.",
    },
    traits: [
      { tr: "Mangekyō çifti", en: "The Mangekyō pair" },
      { tr: "Kara alev · mor zırh", en: "Black flame · violet armour" },
      { tr: "Kanatlı okçu", en: "The winged archer" },
    ],
    imageKey: SASUKE_IMAGE_KEYS.amaterasu,
  },
  {
    key: "rinnegan",
    kanji: "輪廻眼",
    name: "Rinnegan — Amenotejikara",
    sigil: "rings",
    wing: "redemption",
    tagline: { tr: "Mesafeyi iptal eder.", en: "It cancels distance." },
    text: {
      tr: "Altı Yol'un işareti halkalı bir gözde açıldı; halkaların üstünde altı tomoe döner. Amenotejikara Sasuke'yi gördüğü bir noktayla anında değiştirir — dövüş artık mesafeyle değil bakışla ölçülür. Aynı göz boyutlar arasına kapı açar; kefaret yolculuğunun asıl aleti bu kapılardır.",
      en: "The Sage's mark opened in a ringed eye, six tomoe turning on the rings. Amenotejikara swaps Sasuke instantly with a point he can see — a fight is no longer measured in distance but in line of sight. The same eye opens doors between dimensions; those doors are the real instrument of his atonement.",
    },
    traits: [
      { tr: "Altı Yol'un armağanı", en: "The Sage's gift" },
      { tr: "Anlık yer değiştirme", en: "Instant displacement" },
      { tr: "Boyut kapıları", en: "Doors between worlds" },
    ],
    imageKey: SASUKE_IMAGE_KEYS.rinnegan,
  },
];

export interface SasukeMinorTechnique {
  name: string;
  kanji: string;
  sigil: SasukeSigil;
  note: LocalizedText;
  imageKey: string;
}

export const SASUKE_MINOR_TECHNIQUES: SasukeMinorTechnique[] = [
  {
    name: "Kirin",
    kanji: "麒麟",
    sigil: "kirin",
    note: {
      tr: "Isıtılmış havadan bulut, buluttan gerçek yıldırım. Ağabeyi için sakladı.",
      en: "Heated air becomes cloud, cloud becomes real lightning. He saved it for his brother.",
    },
    imageKey: SASUKE_IMAGE_KEYS.kirin,
  },
  {
    name: "Katon: Gōkakyū",
    kanji: "豪火球",
    sigil: "flame",
    note: {
      tr: "Uchiha çocuğunun sınavı. Yedi yaşında geçti; babasının onu ilk kez gördüğü an.",
      en: "The Uchiha child's examination. He passed it at seven — the first time his father truly saw him.",
    },
    imageKey: SASUKE_IMAGE_KEYS.katon,
  },
  {
    name: "Kusanagi",
    kanji: "草薙の剣",
    sigil: "blade",
    note: {
      tr: "Çakrayı ileten çelik: yıldırımla yüklendiğinde kestiği şeyi ayrıca felç eder.",
      en: "Steel that conducts chakra: charged with lightning, it also paralyses whatever it cuts.",
    },
    imageKey: SASUKE_IMAGE_KEYS.kusanagi,
  },
  {
    name: "Juin — Lanet Mührü",
    kanji: "呪印",
    sigil: "seal",
    note: {
      tr: "Orochimaru'nun ödünç verdiği güç. Faizi iradeydi; Sasuke mührü sonunda üstünden söktü.",
      en: "Power lent by Orochimaru. The interest was his will — Sasuke eventually tore the seal off.",
    },
    imageKey: SASUKE_IMAGE_KEYS.curse,
  },
];

/* ── Sayfanın kalbi: çift göz diski ─────────────────────────────────── */

export type SasukePathKey = "vengeance" | "redemption";

export interface SasukeMoment {
  key: string;
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
}

/** Yolun üstünde yürüyen kişiler — portreleri `companions` prop'undan gelir. */
export interface SasukeWalker {
  characterId: number;
  name: string;
  note: LocalizedText;
}

export interface SasukePath {
  key: SasukePathKey;
  /** Yolun tek kelimesi, ana dilde — göz diskinin altında durur */
  word: string;
  reading: string;
  label: LocalizedText;
  /** Göz düğmesinin erişilebilir adı */
  eyeLabel: LocalizedText;
  tagline: LocalizedText;
  lede: LocalizedText;
  moments: SasukeMoment[];
  walkersTitle: LocalizedText;
  walkers: SasukeWalker[];
}

export const SASUKE_PATHS_TEXT = {
  title: { tr: "İki göz, iki yol", en: "Two eyes, two paths" },
  lede: {
    tr: "Soldaki disk üç tomoe'den Ebedi Mangekyō'ya kadar açılan intikam gözü; sağdaki halkalı disk kefaret gözü. Birini seç: yarık o yana kayar, sayfanın rengi döner ve o yolun beş kilit anı açılır.",
    en: "The disc on the left is the eye of vengeance, opening from three tomoe to the Eternal Mangekyō; the ringed disc on the right is the eye of atonement. Choose one: the rift slides that way, the page's colour turns, and five key moments of that road open.",
  },
  /** Hiçbir yol seçili değilken diskin altındaki satır */
  idleHint: {
    tr: "Bir göz seç — sayfa o yolun ağırlığına döner",
    en: "Choose an eye — the page leans into that road",
  },
  activeHint: {
    tr: "Aynı göze yeniden bas: sayfa dengeye döner",
    en: "Press the same eye again to return the page to balance",
  },
  /** Yol seçilmeden önce panelin yerinde duran metin */
  idleBody: {
    tr: "Aynı yüzde iki farklı göz taşımak bir istisna değil, bu karakterin özeti: biri klanının küllerine, öteki geride kalanlara bakıyor. Sayfa ikisini aynı anda savunmuyor — seçmeni istiyor.",
    en: "Carrying two different eyes in one face is not an anomaly; it is the summary of this character. One looks at the ashes of his clan, the other at the people left behind. This page will not defend both at once — it asks you to choose.",
  },
} as const;

export const SASUKE_PATHS: SasukePath[] = [
  {
    key: "vengeance",
    word: "復讐",
    reading: "fukushū",
    label: { tr: "İntikam", en: "Vengeance" },
    eyeLabel: {
      tr: "İntikam yolunu aç — Sharingan",
      en: "Open the path of vengeance — Sharingan",
    },
    tagline: {
      tr: "Yedi yaşında başladı, dokuz yıl sürdü.",
      en: "It began at seven and lasted nine years.",
    },
    lede: {
      tr: "Bu yolda Sasuke elindeki her şeyi araca çevirdi: takımını, ustasını, kendi bedenini. Beş durak.",
      en: "On this road Sasuke turned everything he had into a tool: his team, his teacher, his own body. Five stops.",
    },
    moments: [
      {
        key: "night",
        age: { tr: "7 yaşında", en: "Age 7" },
        title: { tr: "Sokak sessizdi", en: "The street was silent" },
        text: {
          tr: "Eve dönerken kimse yoktu. O gece hem ailesini hem gözlerinin ilk kızılını buldu — Sharingan dehşetle uyanır ve bir daha kapanmaz.",
          en: "There was no one on the way home. That night he found both his family and the first red in his eyes — the Sharingan wakes through terror and never fully closes again.",
        },
      },
      {
        key: "seal",
        age: { tr: "12 yaşında", en: "Age 12" },
        title: { tr: "Boyundaki üç tomoe", en: "Three tomoe on the neck" },
        text: {
          tr: "Orochimaru dişlerini geçirdiğinde Sasuke ilk kez ödünç güç tattı. Mühür acıyı susturuyor, karşılığında iradeyi istiyordu — ve o yaşta bu takas ucuz göründü.",
          en: "When Orochimaru sank his teeth in, Sasuke tasted borrowed power for the first time. The seal quieted the pain and asked for his will in return — at that age the trade looked cheap.",
        },
      },
      {
        key: "valley",
        age: { tr: "12 yaşında", en: "Age 12" },
        title: { tr: "Kader Vadisi", en: "The Valley of the End" },
        text: {
          tr: "Naruto'yu suyun üstünde bıraktı, köyün kapısından çıktı. Geride bıraktığı tek şey bağlarıydı; onları hâlâ zayıflık sanıyordu.",
          en: "He left Naruto lying on the water and walked out through the village gate. The only thing he left behind was his bonds — he still mistook them for weakness.",
        },
      },
      {
        key: "snake",
        age: { tr: "15–16 yaşında", en: "Ages 15–16" },
        title: { tr: "Yılanı yutmak", en: "Devouring the snake" },
        text: {
          tr: "Üç yıl Orochimaru'nun yeni bedeni olarak beklendi, sonra kabı devirdi. Hebi'yi kurup Taka'ya çevirdi: artık kimsenin öğrencisi değildi, kendi ekibinin borcuydu.",
          en: "For three years he was kept as Orochimaru's next body, then he turned the vessel over. He founded Hebi and renamed it Taka: no longer anyone's student, only his own crew's debt.",
        },
      },
      {
        key: "truth",
        age: { tr: "16 yaşında", en: "Age 16" },
        title: { tr: "Ağabeyin gerçeği", en: "His brother's truth" },
        text: {
          tr: "Itachi'yi yendi ve ödülü öğrendi: katliam bir emirdi, ağabeyi köyü kurtarmak için ona kendisinden nefret etmeyi öğretmişti. İntikamın bittiği an hedef Konoha'ya döndü.",
          en: "He beat Itachi and learned his prize: the massacre had been an order, and his brother had taught him that hatred to save the village. The moment vengeance ended, the target turned toward Konoha.",
        },
      },
    ],
    walkersTitle: { tr: "Bu yolda yanındakiler", en: "Who walked beside him" },
    walkers: [
      {
        characterId: 14,
        name: "Itachi Uchiha",
        note: {
          tr: "Ona nefret etmeyi öğreten ağabey",
          en: "The brother who taught him to hate",
        },
      },
      {
        characterId: 2455,
        name: "Orochimaru",
        note: { tr: "Gücü ödünç veren", en: "The one who lent him power" },
      },
      {
        characterId: 1903,
        name: "Suigetsu Hōzuki",
        note: { tr: "Taka'nın kılıcı", en: "Taka's blade" },
      },
      {
        characterId: 53901,
        name: "Madara Uchiha",
        note: { tr: "Klanın hayaleti", en: "The clan's ghost" },
      },
    ],
  },
  {
    key: "redemption",
    word: "贖罪",
    reading: "shokuzai",
    label: { tr: "Kefaret", en: "Atonement" },
    eyeLabel: {
      tr: "Kefaret yolunu aç — Rinnegan",
      en: "Open the path of atonement — Rinnegan",
    },
    tagline: {
      tr: "Savaşın son gününde başladı, hâlâ sürüyor.",
      en: "It began on the last day of the war and has not ended.",
    },
    lede: {
      tr: "Bu yolda hiçbir şey affedilmedi; yalnızca taşınmaya başlandı. Beş durak.",
      en: "On this road nothing was forgiven; it was simply picked up and carried. Five stops.",
    },
    moments: [
      {
        key: "eternal",
        age: { tr: "17 yaşında", en: "Age 17" },
        title: { tr: "Ebedi Mangekyō", en: "The Eternal Mangekyō" },
        text: {
          tr: "Ağabeyinin gözlerini kendi çukurlarına aldı. Körleşme durdu, ama asıl değişen bakıştı: artık her şeyi Itachi'nin durduğu yerden görüyordu.",
          en: "He took his brother's eyes into his own sockets. The blindness stopped, but the real change was the view: from then on he saw everything from where Itachi had stood.",
        },
      },
      {
        key: "hokage",
        age: { tr: "17 yaşında", en: "Age 17" },
        title: { tr: "Dört Hokage'nin masası", en: "The table of four Hokage" },
        text: {
          tr: "Edo Tensei'yle çağrılan dört Hokage'ye tek bir soru sordu: bu köy tam olarak nedir? Aldığı cevap intikamı silmedi — yönünü çevirdi.",
          en: "He asked the four Hokage raised by Edo Tensei a single question: what exactly is this village? The answer did not erase his revenge — it turned it around.",
        },
      },
      {
        key: "rinnegan",
        age: { tr: "17 yaşında", en: "Age 17" },
        title: { tr: "Altı Yol'un eli", en: "The hand of the Sage" },
        text: {
          tr: "Hagoromo iki çocuğa iki işaret verdi: Naruto'ya güneş, Sasuke'ye ay. O gün ilk kez kendisi için değil, geride kalanlar için ayakta durdu.",
          en: "Hagoromo gave two marks to two boys: the sun to Naruto, the moon to Sasuke. That day he stood up for the first time not for himself but for the people left behind.",
        },
      },
      {
        key: "duel",
        age: { tr: "17 yaşında", en: "Age 17" },
        title: { tr: "Vadiye dönüş", en: "Back to the valley" },
        text: {
          tr: "Aynı vadi, aynı iki çocuk. Bu sefer dövüş bir şey kanıtlamak için değil bitirmek içindi: iki kol koptu, iki inat aynı anda tükendi.",
          en: "The same valley, the same two boys. This time the fight was not to prove something but to end it: two arms were lost and two stubborn wills ran out at once.",
        },
      },
      {
        key: "shadow",
        age: { tr: "17 yaşından sonra", en: "Age 17 onward" },
        title: { tr: "Gölgedeki Hokage", en: "The shadow Hokage" },
        text: {
          tr: "Köye döndü ama içinde kalmadı. Karanlığı dışarıdan gözlemeyi seçti: kefaret onun için bir tören değil, ömür boyu süren bir nöbet.",
          en: "He came back to the village but did not stay inside it. He chose to watch the darkness from the outside: for him atonement is not a ceremony but a lifelong watch.",
        },
      },
    ],
    walkersTitle: { tr: "Bu yolda yanındakiler", en: "Who walked beside him" },
    walkers: [
      {
        characterId: 17,
        name: "Naruto Uzumaki",
        note: { tr: "Bırakmayan rakip", en: "The rival who would not let go" },
      },
      {
        characterId: 145,
        name: "Sakura Haruno",
        note: { tr: "Beklemeyi seçen", en: "The one who chose to wait" },
      },
      {
        characterId: 85,
        name: "Kakashi Hatake",
        note: { tr: "Ona ilk yıldırımı veren", en: "Who gave him his first lightning" },
      },
      {
        characterId: 3149,
        name: "Obito Uchiha",
        note: {
          tr: "Aynı yolun sonundaki uyarı",
          en: "The warning at the end of the same road",
        },
      },
    ],
  },
];

/* ── Kader çizelgesi ────────────────────────────────────────────────── */

export interface SasukeEra {
  key: "massacre" | "orochimaru" | "taka" | "war" | "shadow";
  age: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; source: LocalizedText };
  /** Yarığın hangi yanına düştüğü — çizelge iki kanat arasında salınır */
  wing: SasukeWing;
  imageKey: string;
}

export const SASUKE_TIMELINE_TEXT = {
  title: { tr: "Kader çizelgesi", en: "The line of fate" },
  lede: {
    tr: "Beş durak, yarığın iki yanında. Çizgi intikam kanadında başlıyor ve kefaret kanadında bitiyor — sayfanın kendisi gibi.",
    en: "Five stops, on both sides of the rift. The line starts on the wing of vengeance and ends on the wing of atonement — like the page itself.",
  },
} as const;

export const SASUKE_TIMELINE: SasukeEra[] = [
  {
    key: "massacre",
    age: { tr: "7 yaşında", en: "Age 7" },
    title: { tr: "Klanın gecesi", en: "The night of the clan" },
    text: {
      tr: "Uchiha mahallesi bir gecede boşaldı. Sasuke'yi ayakta tutan tek şey ağabeyinin ona bıraktığı cümleydi: yaşa, benden nefret et, güçlen ve gel beni bul. O cümle dokuz yıl boyunca hem yakıt hem zincir oldu.",
      en: "The Uchiha district emptied in a single night. The only thing keeping Sasuke upright was the sentence his brother left him: live, hate me, grow strong and come find me. For nine years that sentence was both fuel and chain.",
    },
    wing: "vengeance",
    imageKey: SASUKE_IMAGE_KEYS.eraMassacre,
  },
  {
    key: "orochimaru",
    age: { tr: "12 – 15 yaşında", en: "Ages 12 – 15" },
    title: { tr: "Yılanın altındaki yıllar", en: "The years under the snake" },
    text: {
      tr: "Sınav ormanında lanet mührünü aldı, Kader Vadisi'nde Naruto'yu geride bıraktı ve Orochimaru'nun sığınağına indi. Üç yıl orada, bir başkasının bedeni olmak üzere hazırlanarak eğitildi.",
      en: "He took the cursed seal in the Forest of Death, left Naruto behind at the Valley of the End, and descended into Orochimaru's hideout. For three years he trained there, groomed to become someone else's body.",
    },
    quote: {
      text: { tr: "Sakura… Teşekkür ederim.", en: "Sakura… Thank you." },
      source: {
        tr: "Konoha'nın kapısında, ayrılırken",
        en: "At the gate of Konoha, as he left",
      },
    },
    wing: "redemption",
    imageKey: SASUKE_IMAGE_KEYS.eraOrochimaru,
  },
  {
    key: "taka",
    age: { tr: "16 yaşında", en: "Age 16" },
    title: { tr: "Taka ve gerçek", en: "Taka and the truth" },
    text: {
      tr: "Ustasını yuttu, kendi ekibini topladı ve ağabeyini yendi. Ödülü zafer değil, gerçekti: katliam bir emirdi. Sasuke o gün nefretin yönünü değiştirdi — hedef artık köyün kendisiydi.",
      en: "He devoured his teacher, gathered his own crew, and defeated his brother. His prize was not victory but the truth: the massacre had been an order. That day Sasuke turned his hatred around — the target became the village itself.",
    },
    wing: "vengeance",
    imageKey: SASUKE_IMAGE_KEYS.eraTaka,
  },
  {
    key: "war",
    age: { tr: "17 yaşında", en: "Age 17" },
    title: { tr: "Savaş ve son dövüş", en: "The war and the last duel" },
    text: {
      tr: "Dördüncü Büyük Ninja Savaşı'na köyü yıkmak için girdi, Kaguya'yı mühürleyerek çıktı. Sonra aynı vadide Naruto'yla hesabını kapattı: iki kol, iki inat ve nihayet susan bir sessizlik.",
      en: "He entered the Fourth Great Ninja War intending to tear the village down and left it having sealed Kaguya. Then, in the same valley, he closed his account with Naruto: two arms, two stubborn wills, and at last a silence that held.",
    },
    wing: "redemption",
    imageKey: SASUKE_IMAGE_KEYS.eraWar,
  },
  {
    key: "shadow",
    age: { tr: "17 yaşından sonra", en: "Age 17 onward" },
    title: { tr: "Gölgedeki Hokage", en: "The shadow Hokage" },
    text: {
      tr: "Kefaret onun için özür dilemek değil, nöbet tutmak oldu. Köyün ışığını Naruto taşırken Sasuke karanlığı dışarıdan gözlüyor: aynı görevin iki yarısı, aynı iki göz gibi.",
      en: "For him atonement did not mean apologising but standing watch. While Naruto carries the village's light, Sasuke watches the dark from outside: two halves of one duty, like the two eyes.",
    },
    wing: "redemption",
    imageKey: SASUKE_IMAGE_KEYS.eraShadow,
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────── */

export const SASUKE_CLOSING = {
  /** Sayfada tek başlık `<h1>` hero'da; kapanışın başlığı gizli */
  headingSr: { tr: "Sasuke Uchiha — kapanış", en: "Sasuke Uchiha — closing" },
  quotes: [
    {
      text: {
        tr: "Adım Sasuke Uchiha. Sevdiğim pek bir şey yok, nefret ettiğim çok şey var. Bir hayalim de yok — çünkü onu hayal olarak bırakmayacağım. Bir klanı diriltmek ve belli bir adamı öldürmek istiyorum.",
        en: "My name is Sasuke Uchiha. There are many things I hate, and there is not much that I like. And I do not have a dream — because I will not leave it as a dream. I want to restore my clan, and to kill a certain man.",
      },
      source: { tr: "Akademi — kendini tanıtma", en: "The Academy — introducing himself" },
    },
    {
      text: {
        tr: "Ben çoktan gözlerimi kapadım. Benim hedefim yalnızca karanlığın içinde.",
        en: "I have long since closed my eyes. My only goal lies in the darkness.",
      },
      source: {
        tr: "Naruto'yla ilk hesaplaşma",
        en: "The first reckoning with Naruto",
      },
    },
  ],
  motto: {
    words: ["復讐", "贖罪"] as const,
    note: {
      tr: "fukushū · shokuzai — intikam ve kefaret. Aynı yüzdeki iki göz, aynı ömrün iki yarısı.",
      en: "fukushū · shokuzai — vengeance and atonement. Two eyes in one face, two halves of one life.",
    },
  },
  credit: {
    tr: "Künye bilgileri ve portre AniList karakter kaydından (#13). Sayfadaki bütün göz diskleri, Uchiha yelpazesi ve teknik işaretleri bu arşiv için elle çizilmiş SVG'lerdir — dışarıdan alınmış grafik yok.",
    en: "Record data and portrait come from the AniList character entry (#13). Every eye disc, the Uchiha fan, and the technique sigils on this page are SVGs drawn by hand for this archive — no third-party artwork is used.",
  },
  creditLink: { tr: "AniList künyesi", en: "AniList entry" },
} as const;

/** Yoldaş portresi yoksa kartın altına düşen erişilebilir ad kalıbı. */
export function walkerAlt(name: string, locale: string): string {
  return locale === "en"
    ? `${name} — archive portrait`
    : `${name} — arşiv portresi`;
}
