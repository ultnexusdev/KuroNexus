import type { LocalizedText } from "./types";

/**
 * Sukuna & Yuuji Itadori — "KAP" deneyim sayfasının veri iskeleti.
 *
 * Bu sayfa arşivdeki diğer karakter dosyalarından yapısal olarak ayrı:
 * **iki AniList numarası tek sayfaya çıkıyor** (127212 Itadori, 133701
 * Sukuna) ve sayfa hangi adresten gelindiğine bakıp o kimlikle açılıyor.
 * Sebep tasarım değil, konunun kendisi: bu iki karakterin ayrı ayrı
 * anlatılabilecek bir hayatı yok. Biri diğerinin içinde yaşıyor.
 *
 * Bütün görünen metin burada iki dilli duruyor (kural 1); bileşen
 * `pick(text, locale)` ile seçiyor. Görseller veritabanında: characterId
 * 127212 kaydının ABILITY yuvalarında, `vessel:*` anahtarlarıyla
 * (Itachi'deki `itachi:*` deseninin kardeşi). Yuva boşken bölüm görselsiz
 * ama ayakta kalıyor.
 *
 * Kaynak: AniList künyesi (22 Ağustos 2026 önbelleği — API o gün kapalıydı)
 * + Jujutsu Kaisen anlatısı. Replik konusunda kural sert: yalnızca emin
 * olunan üç replik var, uydurma yok.
 */

export const VESSEL_IDS = {
  itadori: 127212,
  sukuna: 133701,
} as const;

/** Sayfanın iki kimliği. Kök öğedeki `data-vessel` bu değeri taşır. */
export type VesselMode = "itadori" | "sukuna";

/**
 * Adres → açılış modu.
 *
 * Sukuna'nın adresinden gelen ziyaretçi Sukuna'yı görmek istiyor; kapın
 * adresinden gelen kabı. Karar sunucuda veriliyor, istemciye yalnızca
 * başlangıç değeri iniyor — böylece ilk boyada doğru palet çiziliyor ve
 * mod bir "atlama" olarak görünmüyor.
 */
export function vesselModeFor(characterId: number): VesselMode {
  return characterId === VESSEL_IDS.sukuna ? "sukuna" : "itadori";
}

/**
 * Karşı tarafın AniList portresi.
 *
 * Hero'da İKİ portre üst üste duruyor ama `detail` yalnızca adresten
 * gelen karakterin künyesini taşıyor. Karşı taraf normalde `companions`
 * üzerinden gelirdi; Jujutsu Kaisen kadrosunun bizim veritabanımızda
 * PORTRAIT kaydı yok (22 Ağustos 2026 ölçümü), yani harita bu iki numara
 * için boş dönüyor.
 *
 * Bu yüzden AniList adresleri burada sabit: kaynak `anilist-detay.json`
 * önbelleği, yani sayfanın zaten kullandığı künyenin ta kendisi. Küratör
 * `vessel:portre-*` yuvasına tam boy bir görsel yüklerse bu sabitler
 * devre dışı kalıyor (bileşendeki sıra: yüklenen → künye portresi).
 *
 * ⚠️ AniList CDN'i `next.config.ts` remotePatterns listesinde YOK →
 * bu adresler `next/image`de her zaman `unoptimized` çizilmeli.
 */
export const VESSEL_ANILIST_PORTRAITS: Record<VesselMode, string> = {
  itadori:
    "https://s4.anilist.co/file/anilistcdn/character/large/b127212-FVm2tD0erQ5B.png",
  sukuna:
    "https://s4.anilist.co/file/anilistcdn/character/large/b133701-rCQuDpHr3UZL.png",
};

export const VESSEL_ANILIST_LINKS: Record<VesselMode, string> = {
  itadori: "https://anilist.co/character/127212",
  sukuna: "https://anilist.co/character/133701",
};

/* ── Küratör yuvaları ───────────────────────────────────────────────── */

/**
 * Bütün görsel yuvaları. Hepsi characterId 127212 kaydının ABILITY
 * yuvasında yaşıyor — Sukuna'nın adresinden girilse bile yükleme aynı
 * kayda gidiyor, çünkü sayfa tek.
 */
export const VESSEL_IMAGE_KEYS = {
  portraitItadori: "vessel:portre-itadori",
  portraitSukuna: "vessel:portre-sukuna",
  strength: "vessel:guc-fiziksel",
  blackFlash: "vessel:kara-simsek",
  soul: "vessel:ruhun-ayrilisi",
  dismantle: "vessel:kesis",
  cleave: "vessel:yarma",
  shrine: "vessel:tapinak",
  kura: "vessel:kura",
  reverse: "vessel:ters-lanet",
  cursedEnergy: "vessel:lanet-enerjisi",
  domain: "vessel:alan-genisletme",
  vow: "vessel:soz",
  finger: "vessel:parmak",
  eraGrandfather: "vessel:kader-dede",
  eraSentence: "vessel:kader-idam",
  eraShibuya: "vessel:kader-shibuya",
  eraChouso: "vessel:kader-chouso",
  eraReturn: "vessel:kader-tam-donus",
  circleGojo: "vessel:cevre-gojo",
  circleMegumi: "vessel:cevre-megumi",
  circleNobara: "vessel:cevre-nobara",
  circleNanami: "vessel:cevre-nanami",
  circleMahito: "vessel:cevre-mahito",
  circleChouso: "vessel:cevre-chouso",
} as const;

export type VesselImageKey =
  (typeof VESSEL_IMAGE_KEYS)[keyof typeof VESSEL_IMAGE_KEYS];

/** Yükleme kutusunun üstünde görünen etiket — küratör ne beklediğini bilsin. */
export const VESSEL_SLOT_LABELS: Record<string, LocalizedText> = {
  [VESSEL_IMAGE_KEYS.portraitItadori]: {
    tr: "Hero — Itadori portresi (dikey, 3:4)",
    en: "Hero — Itadori portrait (vertical, 3:4)",
  },
  [VESSEL_IMAGE_KEYS.portraitSukuna]: {
    tr: "Hero — Sukuna portresi (dikey, 3:4)",
    en: "Hero — Sukuna portrait (vertical, 3:4)",
  },
  [VESSEL_IMAGE_KEYS.strength]: {
    tr: "Fiziksel güç (16:9)",
    en: "Physical strength (16:9)",
  },
  [VESSEL_IMAGE_KEYS.blackFlash]: {
    tr: "Kara Şimşek (16:9)",
    en: "Black Flash (16:9)",
  },
  [VESSEL_IMAGE_KEYS.soul]: {
    tr: "Ruhun ayrılışı (16:9)",
    en: "Soul separation (16:9)",
  },
  [VESSEL_IMAGE_KEYS.dismantle]: { tr: "Kesiş / 解 (16:9)", en: "Dismantle / 解 (16:9)" },
  [VESSEL_IMAGE_KEYS.cleave]: { tr: "Yarma / 捌 (16:9)", en: "Cleave / 捌 (16:9)" },
  [VESSEL_IMAGE_KEYS.shrine]: {
    tr: "Malevolent Shrine (16:9)",
    en: "Malevolent Shrine (16:9)",
  },
  [VESSEL_IMAGE_KEYS.kura]: { tr: "Kura — Ateş Oku", en: "Kura — Fire Arrow" },
  [VESSEL_IMAGE_KEYS.reverse]: {
    tr: "Ters lanet tekniği",
    en: "Reverse cursed technique",
  },
  [VESSEL_IMAGE_KEYS.cursedEnergy]: { tr: "Lanet enerjisi", en: "Cursed energy" },
  [VESSEL_IMAGE_KEYS.domain]: { tr: "Alan genişletme", en: "Domain expansion" },
  [VESSEL_IMAGE_KEYS.vow]: {
    tr: "Kap anlaşması — bağlayıcı söz sahnesi (21:9)",
    en: "The vow — binding vow scene (21:9)",
  },
  [VESSEL_IMAGE_KEYS.finger]: {
    tr: "Mühürlü parmak — lanet nesnesi (1:1)",
    en: "Sealed finger — cursed object (1:1)",
  },
  [VESSEL_IMAGE_KEYS.eraGrandfather]: {
    tr: "Kader 1 — dedenin son sözü (16:9)",
    en: "Fate 1 — the grandfather's last words (16:9)",
  },
  [VESSEL_IMAGE_KEYS.eraSentence]: {
    tr: "Kader 2 — idam kararı (16:9)",
    en: "Fate 2 — the death sentence (16:9)",
  },
  [VESSEL_IMAGE_KEYS.eraShibuya]: {
    tr: "Kader 3 — Shibuya (16:9)",
    en: "Fate 3 — Shibuya (16:9)",
  },
  [VESSEL_IMAGE_KEYS.eraChouso]: {
    tr: "Kader 4 — Chouso (16:9)",
    en: "Fate 4 — Choso (16:9)",
  },
  [VESSEL_IMAGE_KEYS.eraReturn]: {
    tr: "Kader 5 — Sukuna'nın tam dönüşü (16:9)",
    en: "Fate 5 — Sukuna's full return (16:9)",
  },
  [VESSEL_IMAGE_KEYS.circleGojo]: { tr: "Çevre — Gojo", en: "Circle — Gojo" },
  [VESSEL_IMAGE_KEYS.circleMegumi]: { tr: "Çevre — Megumi", en: "Circle — Megumi" },
  [VESSEL_IMAGE_KEYS.circleNobara]: { tr: "Çevre — Nobara", en: "Circle — Nobara" },
  [VESSEL_IMAGE_KEYS.circleNanami]: { tr: "Çevre — Nanami", en: "Circle — Nanami" },
  [VESSEL_IMAGE_KEYS.circleMahito]: { tr: "Çevre — Mahito", en: "Circle — Mahito" },
  [VESSEL_IMAGE_KEYS.circleChouso]: { tr: "Çevre — Chouso", en: "Circle — Choso" },
};

/* ── Hero ───────────────────────────────────────────────────────────── */

export const VESSEL_HERO = {
  /** Sayfanın filigranı: 器 — "kap". aria-hidden çizilir. */
  watermark: "器",
  lede: {
    tr: "Bir beden, iki irade. On beş yaşında bir çocuk, bin yıl önce yenilemeyip yirmi parçaya bölünmüş bir lanetin kabı oldu. Burada iki dosya yok — aynı bedenin iki tarafı var.",
    en: "One body, two wills. A fifteen-year-old became the vessel of a curse that could not be beaten a thousand years ago, only split into twenty pieces. These are not two files — they are two sides of one body.",
  },
  scrollHint: {
    tr: "Aşağıda yirmi parmak var",
    en: "Twenty fingers are waiting below",
  },
  portraitAlt: {
    itadori: {
      uploaded: {
        tr: "Yuuji Itadori — arşiv portresi",
        en: "Yuuji Itadori — archive portrait",
      },
      anilist: {
        tr: "Yuuji Itadori — AniList künye portresi",
        en: "Yuuji Itadori — AniList profile portrait",
      },
    },
    sukuna: {
      uploaded: {
        tr: "Ryōmen Sukuna — arşiv portresi",
        en: "Ryōmen Sukuna — archive portrait",
      },
      anilist: {
        tr: "Ryōmen Sukuna — AniList künye portresi",
        en: "Ryōmen Sukuna — AniList profile portrait",
      },
    },
  },
} as const;

/* ── Mod düğmesi — sayfanın ana mekaniği ────────────────────────────── */

export const VESSEL_SWITCH = {
  question: { tr: "Kontrol kimde?", en: "Who is in control?" },
  note: {
    tr: "Seçtiğin taraf sayfanın tamamını çevirir: palet, geometri, künye, replik.",
    en: "The side you choose turns the whole page: palette, geometry, dossier, closing line.",
  },
  itadori: {
    name: "Itadori",
    native: "虎杖悠仁",
    role: { tr: "kap", en: "the vessel" },
  },
  sukuna: {
    name: "Sukuna",
    native: "宿儺",
    role: { tr: "lanet", en: "the curse" },
  },
  /** Bölüm başlıklarından düğmeye dönüş bağlantısı (kopya düğme değil, çapa). */
  backLink: { tr: "Kontrolü değiştir", en: "Change who is in control" },
} as const;

/* ── Künye şeridi: yan yana iki sütun ───────────────────────────────── */

export interface VesselFact {
  label: LocalizedText;
  value: LocalizedText;
}

export interface VesselColumn {
  mode: VesselMode;
  name: string;
  native: string;
  /** Sütunun tek cümlelik tanımı — künyenin üstünde durur */
  line: LocalizedText;
  aliases: LocalizedText;
  facts: VesselFact[];
}

export const VESSEL_COLUMNS: [VesselColumn, VesselColumn] = [
  {
    mode: "itadori",
    name: "Yuuji Itadori",
    native: "虎杖悠仁",
    line: {
      tr: "Lise birinci sınıf öğrencisi. Doğuştan lanet tekniği yok; yutkunduğu şey yüzünden dünyanın en tehlikeli bedeni oldu.",
      en: "A first-year high school student with no innate cursed technique, who became the world's most dangerous body by swallowing one thing.",
    },
    aliases: {
      tr: "Sukuna'nın Kabı · Batı Ortaokulu'nun Kaplanı",
      en: "Sukuna's Vessel · The Tiger of West Junior High",
    },
    facts: [
      { label: { tr: "Yaş", en: "Age" }, value: { tr: "15", en: "15" } },
      { label: { tr: "Boy", en: "Height" }, value: { tr: "173 cm", en: "173 cm" } },
      {
        label: { tr: "Doğum", en: "Born" },
        value: { tr: "20 Mart 2003", en: "20 March 2003" },
      },
      {
        label: { tr: "Tür", en: "Species" },
        value: { tr: "İnsan — kap", en: "Human — vessel" },
      },
      {
        label: { tr: "Bağlı olduğu yer", en: "Affiliation" },
        value: { tr: "Tokyo Jujutsu Lisesi", en: "Tokyo Jujutsu High" },
      },
      {
        label: { tr: "Doğuştan tekniği", en: "Innate technique" },
        value: { tr: "Yok — silahı beden", en: "None — the body is the weapon" },
      },
    ],
  },
  {
    mode: "sukuna",
    name: "Ryōmen Sukuna",
    native: "両面宿儺",
    line: {
      tr: "Büyücülüğün altın çağının en güçlü ismi. Yenilmedi; yok edilemediği için yirmi lanet nesnesine bölünüp çağlar boyunca saklandı.",
      en: "The strongest name of sorcery's golden age. He was never beaten; because he could not be destroyed he was split into twenty cursed objects and hidden across the ages.",
    },
    aliases: {
      tr: "Lanetlerin Kralı · İki Yüzlü Hayalet · Düşmüş Olan",
      en: "King of Curses · Double-Faced Specter · The Fallen",
    },
    facts: [
      { label: { tr: "Yaş", en: "Age" }, value: { tr: "1000+", en: "1000+" } },
      {
        label: { tr: "Unvan", en: "Title" },
        value: { tr: "Lanetlerin Kralı", en: "King of Curses" },
      },
      {
        label: { tr: "Biçim", en: "Form" },
        value: { tr: "Dört kol, iki yüz", en: "Four arms, two faces" },
      },
      {
        label: { tr: "Kalıntısı", en: "Remains" },
        value: { tr: "20 parmak", en: "20 fingers" },
      },
      {
        label: { tr: "Tür", en: "Species" },
        value: {
          tr: "İnsan — yeniden doğmuş büyücü",
          en: "Human — reincarnated sorcerer",
        },
      },
      {
        label: { tr: "Alanı", en: "Domain" },
        value: { tr: "Malevolent Shrine", en: "Malevolent Shrine" },
      },
    ],
  },
];

export const VESSEL_DOSSIER_TITLE = {
  title: { tr: "İki Künye, Tek Beden", en: "Two Dossiers, One Body" },
  lede: {
    tr: "Solda kabın künyesi, sağda lanetin. Aralarındaki çizgi bir sınır değil, bir dikiş: aynı bedenin ortasından geçiyor.",
    en: "The vessel's file on the left, the curse's on the right. The line between them is not a border but a seam — it runs down the middle of one body.",
  },
} as const;

/* ── Laboratuvar ────────────────────────────────────────────────────── */

export interface VesselTechnique {
  key: string;
  imageKey: string;
  kanji: string;
  name: string;
  tagline: LocalizedText;
  text: LocalizedText;
  traits: LocalizedText[];
}

export const VESSEL_LAB_TITLE = {
  title: { tr: "İki Ayrı Silah Kuşağı", en: "Two Separate Arsenals" },
  lede: {
    tr: "Aynı kaslar, aynı eller. Kimin kullandığına göre bambaşka iki şey oluyorlar: birinde bir yumruk, diğerinde görünmez bir kesik.",
    en: "The same muscles, the same hands. Depending on who is using them they become two entirely different things: a fist on one side, an invisible cut on the other.",
  },
  itadoriHeading: { tr: "Kapın elindekiler", en: "What the vessel has" },
  sukunaHeading: { tr: "Lanetin elindekiler", en: "What the curse has" },
} as const;

/** Itadori — ilk kart "birincil" (görsel bandı taşır), diğer ikisi sıkı satır. */
export const VESSEL_ITADORI_TECHNIQUES: VesselTechnique[] = [
  {
    key: "strength",
    imageKey: VESSEL_IMAGE_KEYS.strength,
    kanji: "身体",
    name: "Fiziksel güç",
    tagline: {
      tr: "Yeteneksiz denen çocuğun tek yeteneği.",
      en: "The only talent of the boy they called talentless.",
    },
    text: {
      tr: "Jujutsu dünyası ona baktığında bir eksik gördü: doğuştan lanet tekniği yok. Gördüğü şeyi ölçemedi — ölçüm aletini kıran, insan sınırının bir adım ötesinde çalışan bir beden. Itadori'nin savaşları teknik üstünlüğüyle değil, o bedenin taşıdığı mesafeyle kazanılıyor.",
      en: "When the jujutsu world looked at him it saw a lack: no innate cursed technique. What it failed to measure was the body — the one that broke the measuring device, that works a step past the human limit. Itadori's fights are not won by technical superiority but by the distance that body can carry.",
    },
    traits: [
      { tr: "İnsan sınırının üstünde", en: "Past the human limit" },
      { tr: "Ölçüm aletini kırdı", en: "Broke the measuring device" },
      { tr: "Silahı: bedenin kendisi", en: "Weapon: the body itself" },
    ],
  },
  {
    key: "black-flash",
    imageKey: VESSEL_IMAGE_KEYS.blackFlash,
    kanji: "黒閃",
    name: "Kuroi Senkō — Kara Şimşek",
    tagline: {
      tr: "Bir milyonda bir saniyelik hizalanma.",
      en: "An alignment of one millionth of a second.",
    },
    text: {
      tr: "Fiziksel darbeyle lanet enerjisi 0,000001 saniye içinde üst üste bindiğinde uzayın kendisi çarpılıyor: temas noktasında kara bir kıvılcım patlıyor ve vuruş 2,5 katına çıkıyor. Çoğu büyücü ömrü boyunca bir kez yakalıyor. Itadori arka arkaya dört kez yakaladı.",
      en: "When a physical blow and cursed energy overlap within 0.000001 seconds, space itself distorts: a black spark bursts at the point of contact and the hit becomes 2.5 times stronger. Most sorcerers land one in a lifetime. Itadori landed four in a row.",
    },
    traits: [
      { tr: "0,000001 saniye", en: "0.000001 seconds" },
      { tr: "Gücün 2,5 katı", en: "2.5× the power" },
      { tr: "Arka arkaya dört", en: "Four in a row" },
    ],
  },
  {
    key: "soul",
    imageKey: VESSEL_IMAGE_KEYS.soul,
    kanji: "魂",
    name: "Ruhun ayrılışı",
    tagline: {
      tr: "Önce ruh gelir, beden onun kabıdır.",
      en: "The soul comes first; the body is its vessel.",
    },
    text: {
      tr: "Mahito'nun ruha dokunan tekniği Itadori'yi kendi sorusuyla yüz yüze bıraktı: insanı insan yapan şey hangisi? Aynı kapıdan giren ikinci ders ters lanet tekniği — negatif enerjiyi ters çevirip yaraya can vermek. Sukuna bunu bir refleks gibi kullanıyor ve Itadori'nin bedeni, sahibi istemeden o refleksin izlerini taşıyor.",
      en: "Mahito's soul-touching technique left Itadori face to face with his own question: which of the two makes a person a person? A second lesson comes through the same door — the reverse cursed technique, turning negative energy inside out to give a wound life. Sukuna uses it like a reflex, and Itadori's body carries the traces of that reflex without asking for them.",
    },
    traits: [
      { tr: "Ruh, bedenden önce", en: "Soul before body" },
      { tr: "反転術式 — ters lanet tekniği", en: "反転術式 — reverse cursed technique" },
      { tr: "Mahito'nun bıraktığı ders", en: "The lesson Mahito left behind" },
    ],
  },
];

/** Sukuna — sıra bilinçli: iki sıkı satır, sonra tapınak (birincil kart). */
export const VESSEL_SUKUNA_TECHNIQUES: VesselTechnique[] = [
  {
    key: "dismantle",
    imageKey: VESSEL_IMAGE_KEYS.dismantle,
    kanji: "解",
    name: "Kai — Kesiş (Dismantle)",
    tagline: {
      tr: "Ayar yapılmadan atılan kesik.",
      en: "The cut thrown without adjustment.",
    },
    text: {
      tr: "Sukuna elini savurduğunda havada görünmez bir ızgara kuruluyor ve hedef o ızgaranın çizgileri boyunca parçalarına ayrılıyor. Dokunmaya gerek yok, mesafe fark etmiyor: bakışın ulaştığı yere kesik de ulaşıyor.",
      en: "When Sukuna swings his hand an invisible grid forms in the air, and the target comes apart along its lines. No touch is needed and distance does not matter: wherever the gaze reaches, the cut reaches.",
    },
    traits: [
      { tr: "Kesme ızgarası", en: "A grid of slashes" },
      { tr: "Uzaktan atılabilir", en: "Can be thrown at range" },
      { tr: "Ayarsız — hep aynı keskinlik", en: "Unadjusted — one fixed edge" },
    ],
  },
  {
    key: "cleave",
    imageKey: VESSEL_IMAGE_KEYS.cleave,
    kanji: "捌",
    name: "Hachi — Yarma (Cleave)",
    tagline: {
      tr: "Hedefe göre ölçülüp atılan tek kesik.",
      en: "A single cut, measured against its target.",
    },
    text: {
      tr: "Kesiş'in ikizi ama tersi: Sukuna hedefin dayanıklılığını ve lanet enerjisini tartıp kesiği tek bir hamleye indiriyor. Ne kadar sert olursan ol, o sertliğe göre ayarlanmış bir çizgi geliyor. Kesiş bir ağ atar, Yarma nişan alır.",
      en: "Dismantle's twin and its opposite: Sukuna weighs the target's durability and cursed energy, then compresses the cut into a single stroke. However hard you are, the line that comes is calibrated to that hardness. Dismantle casts a net; Cleave takes aim.",
    },
    traits: [
      { tr: "Dayanıklılığa göre ayar", en: "Calibrated to durability" },
      { tr: "Tek hamle", en: "One stroke" },
      { tr: "Kesiş'in ikizi", en: "Dismantle's twin" },
    ],
  },
  {
    key: "shrine",
    imageKey: VESSEL_IMAGE_KEYS.shrine,
    kanji: "伏魔御廚子",
    name: "Malevolent Shrine — Kötü Niyet Tapınağı",
    tagline: {
      tr: "Perdesi olmayan tek alan.",
      en: "The one domain that needs no barrier.",
    },
    text: {
      tr: "Alan genişletmesi, büyücünün iç dünyasını dışarıya sermesidir; içeride teknik ıskalamaz. Sukuna'nınki bir adım daha ileri gidiyor: perde kurmuyor. Tapınak açıldığı yerde durur, sınırını kendi çevresine çizer ve o sınırın içine giren her şey Kesiş ile Yarma arasında saniyede defalarca doğranır. Perdesiz açmanın bedeli, kaçacak yer bırakmaması.",
      en: "A domain expansion spreads a sorcerer's inner world outward; inside it, techniques cannot miss. Sukuna's goes one step further: it raises no barrier. The shrine simply stands where it opened, draws its edge around him, and everything inside is carved between Dismantle and Cleave many times per second. The price of opening it barrier-less is that it leaves nowhere to stand.",
    },
    traits: [
      { tr: "Perdesiz alan genişletmesi", en: "Barrier-less domain" },
      { tr: "Kaçınılmaz isabet", en: "Guaranteed hit" },
      { tr: "Shibuya'yı yerle bir etti", en: "It flattened part of Shibuya" },
    ],
  },
];

export interface VesselMinor {
  key: string;
  imageKey: string;
  kanji: string;
  name: string;
  owner: VesselMode;
  note: LocalizedText;
}

export const VESSEL_MINOR: VesselMinor[] = [
  {
    key: "kura",
    imageKey: VESSEL_IMAGE_KEYS.kura,
    kanji: "竈",
    name: "Kura — Ateş Oku",
    owner: "sukuna",
    note: {
      tr: "Sukuna'nın alevi. Parmak ucundan çıkan, tapınağın içinden de atılabilen bir ateş oku; değdiği yeri kavurur.",
      en: "Sukuna's flame: an arrow of fire thrown from a fingertip, and from inside the shrine as well. It scorches whatever it touches.",
    },
  },
  {
    key: "reverse",
    imageKey: VESSEL_IMAGE_KEYS.reverse,
    kanji: "反転術式",
    name: "Ters lanet tekniği",
    owner: "sukuna",
    note: {
      tr: "Negatif lanet enerjisini ters çevirip iyileştirme. Sukuna düşünmeden yapıyor: kopan geri geliyor, açılan kapanıyor.",
      en: "Turning negative cursed energy inside out to heal. Sukuna does it without thinking: what is severed returns, what is opened closes.",
    },
  },
  {
    key: "cursed-energy",
    imageKey: VESSEL_IMAGE_KEYS.cursedEnergy,
    kanji: "呪力",
    name: "Lanet enerjisi",
    owner: "itadori",
    note: {
      tr: "İnsanların negatif duygularından sızan enerji. Itadori'nin onu şekillendirecek doğuştan bir tekniği yok; ham hâlde, yumruğunda taşıyor.",
      en: "Energy that leaks out of human negative emotion. Itadori has no innate technique to shape it, so he carries it raw, in his fist.",
    },
  },
  {
    key: "domain",
    imageKey: VESSEL_IMAGE_KEYS.domain,
    kanji: "領域展開",
    name: "Alan genişletme",
    owner: "sukuna",
    note: {
      tr: "Büyücünün iç dünyasını dışarı sermesi — jujutsu'nun zirvesi. Malevolent Shrine bu sanatın perdesiz, en acımasız hâli.",
      en: "Spreading a sorcerer's inner world outward — the summit of jujutsu. Malevolent Shrine is that art at its most merciless, and without a barrier.",
    },
  },
];

/* ── Kap anlaşması: iki sütunu tek gövdede birleştiren bölüm ────────── */

export interface VesselClause {
  key: string;
  index: string;
  title: LocalizedText;
  text: LocalizedText;
}

export const VESSEL_VOW = {
  kanji: "縛り",
  title: { tr: "Kap Anlaşması", en: "The Vessel's Vow" },
  lede: {
    tr: "Jujutsu dünyasında bir söz, verildiği anda fiziksel bir kurala dönüşür: şartlar açıkça söylenir, iki taraf da bilerek kabul eder, bozan bedelini öder. Itadori ile Sukuna'yı aynı bedende tutan şey de böyle bir sözdür — ve maddeleri kabın lehine yazılmamıştır.",
    en: "In the jujutsu world a vow becomes a physical rule the moment it is made: the terms are stated aloud, both sides accept them knowingly, and whoever breaks one pays. What keeps Itadori and Sukuna in one body is a vow of exactly this kind — and its clauses were not written in the vessel's favour.",
  },
  clauses: [
    {
      key: "terms",
      index: "I",
      title: { tr: "Söz", en: "The terms" },
      text: {
        tr: "Şartlar yüksek sesle söylenir ve karşı taraf bilerek kabul eder. Bağlayıcı söz ancak o zaman kurulur; kimse kimseyi kandırarak bağlayamaz. Kontrolün el değiştirmesi bir kazadan değil, bir cümleden doğar.",
        en: "The terms are spoken aloud and the other side accepts them knowingly. Only then does the vow bind; no one can be bound by trickery. Control changes hands not through an accident but through a sentence.",
      },
    },
    {
      key: "minute",
      index: "II",
      title: { tr: "Bir dakika", en: "One minute" },
      text: {
        tr: "Sukuna bedeni bir dakikalığına alır. Süre başladığı an geri sayım da başlar; dakikanın sonunda kap geri döner. Lanetlerin Kralı'nın bin yıl boyunca kabul etmediği tek şey buydu: bir sınır.",
        en: "Sukuna takes the body for one minute. The countdown starts the instant the minute does, and at its end the vessel returns. A limit was the one thing the King of Curses had not accepted for a thousand years.",
      },
    },
    {
      key: "no-kill",
      index: "III",
      title: { tr: "Can almak yok", en: "No lives taken" },
      text: {
        tr: "O bir dakika içinde Sukuna kimseyi öldüremez, ağır yaralayamaz. Kendi ağzından çıkan söz, kendi elini bağlar — jujutsu'da bağlayıcı sözün gücü de tam olarak buradan gelir.",
        en: "Within that minute Sukuna may not kill anyone or gravely wound them. The words out of his own mouth tie his own hand — and that is precisely where a binding vow's power comes from.",
      },
    },
    {
      key: "memory",
      index: "IV",
      title: { tr: "Hafıza", en: "Memory" },
      text: {
        tr: "Sukuna'nın eklettiği madde: iş bittiğinde anlaşmanın içeriği Itadori'nin hafızasından silinir. Kap, altına imza attığı sözleşmeyi hatırlamaz. Bedelini ödediği şeyi bilmeyen bir borçlu.",
        en: "The clause Sukuna added: when it is done, the contents of the vow are erased from Itadori's memory. The vessel does not remember the contract he signed — a debtor who does not know what he is paying for.",
      },
    },
    {
      key: "shared-death",
      index: "V",
      title: { tr: "Ortak ölüm", en: "Shared death" },
      text: {
        tr: "Yirmi parmağın hepsi yutulduğunda Sukuna'yı öldürmenin tek yolu kabı öldürmek olacak. İdam kararı iptal edilmedi; sadece o güne ertelendi. Sayfanın en soğuk maddesi bu: kabın ömrü, sayacın dolmasına bağlı.",
        en: "Once all twenty fingers have been swallowed, the only way to kill Sukuna will be to kill the vessel. The death sentence was never cancelled, only deferred to that day. This is the coldest clause on the page: the vessel's life span is tied to a counter filling up.",
      },
    },
  ] as VesselClause[],
} as const;

/* ── Parmak sayacı: sayfanın kalbi ──────────────────────────────────── */

export interface VesselMilestone {
  count: number;
  key: string;
  label: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
}

export const VESSEL_RAIL = {
  kanji: "二十本",
  title: { tr: "Yirmi Parmak", en: "Twenty Fingers" },
  lede: {
    tr: "Sukuna'nın bedeni bin yıl önce yok edilemedi; yirmi parçaya bölünüp mühürlendi. Her parça bir parmak, her parmak bir lanet nesnesi. Kap her birini yuttuğunda lanet biraz daha geri geliyor — ve bu sayfa biraz daha kararıyor.",
    en: "Sukuna's body could not be destroyed a thousand years ago; it was split into twenty pieces and sealed. Each piece is a finger, each finger a cursed object. With every one the vessel swallows, the curse returns a little more — and this page darkens a little more.",
  },
  hint: {
    tr: "Rayı tıklayarak ya da ok tuşlarıyla gezin",
    en: "Move along the rail by clicking or with the arrow keys",
  },
  groupLabel: {
    tr: "Yutulan parmak sayısı",
    en: "Number of fingers swallowed",
  },
  /** `{n}` bileşende sayıyla değiştirilir. */
  fingerLabel: { tr: "{n}. parmak", en: "Finger {n}" },
  readoutLabel: { tr: "yutulan parmak", en: "fingers swallowed" },
  remainingLabel: { tr: "kalan", en: "remaining" },
  milestoneBadge: { tr: "Kilometre taşı", en: "Milestone" },
  betweenNote: {
    tr: "Son kilometre taşından bu yana {n} parmak daha.",
    en: "{n} more fingers since the last milestone.",
  },
  milestones: [
    {
      count: 1,
      key: "first",
      label: { tr: "1.", en: "1st" },
      title: { tr: "İlk parmak — bedeni ele geçirme", en: "The first finger — the body taken" },
      text: {
        tr: "Dedesinin ölümünden birkaç saat sonra, okült kulübünün açtığı mühür lanetleri okula çağırdı. Itadori arkadaşlarını kurtarmak için parmağı yuttu ve Sukuna bin yıl sonra ilk kez gözlerini açtı. Sonra olmaması gereken şey oldu: kap bedeni geri aldı. Bunu daha önce hiçbir kap başaramamıştı.",
        en: "Hours after his grandfather's death, a seal opened by the occult club drew curses to the school. Itadori swallowed the finger to save his friends, and Sukuna opened his eyes for the first time in a thousand years. Then the impossible happened: the vessel took the body back. No vessel had ever managed that.",
      },
    },
    {
      count: 2,
      key: "second",
      label: { tr: "2.", en: "2nd" },
      title: { tr: "İkinci parmak — kaza değil, karar", en: "The second — not an accident, a decision" },
      text: {
        tr: "Birincisi bir refleksti. İkincisi bir seçim: yutmayı sürdürmek, hem parmakları dünyadan toplamanın hem de idamı ertelemenin tek yolu. Itadori kendi ölüm cezasının takvimini kendi eliyle yazmaya başlıyor.",
        en: "The first was a reflex. The second is a choice: to keep swallowing is the only way both to collect the fingers out of the world and to defer the execution. Itadori begins writing the calendar of his own death sentence by hand.",
      },
    },
    {
      count: 10,
      key: "shibuya",
      label: { tr: "10.", en: "10th" },
      title: { tr: "Çift hane — Shibuya", en: "Double digits — Shibuya" },
      text: {
        tr: "Shibuya'ya gelindiğinde sayaç çoktan çift haneye çıkmıştı. O gece kap kırıldı: Gojo mühürlendi, dizginler koptu, Sukuna verdiği sözün sınırını aştı ve şehrin bir bölümü haritadan silindi. Sabah olduğunda faturanın altında Itadori'nin adı yazıyordu.",
        en: "By Shibuya the counter had long since passed into double digits. That night the vessel broke: Gojo was sealed, the reins snapped, Sukuna went past the limit of his own vow and part of the city was wiped off the map. By morning the bill carried Itadori's name.",
      },
    },
    {
      count: 15,
      key: "fifteen",
      label: { tr: "15.", en: "15th" },
      title: { tr: "On beşinci — sayaç geri sayıma dönüyor", en: "The fifteenth — the counter becomes a countdown" },
      text: {
        tr: "Kalan beş parmak artık bir toplama değil, bir geri sayım. Sukuna'nın gücü kabın taşıyabileceği sınırın üstüne çıkıyor; Itadori'nin “kontrol bende” diyebildiği aralık her yutkunmada biraz daha daralıyor.",
        en: "The five remaining fingers are no longer a collection but a countdown. Sukuna's power climbs past what the vessel can carry, and the window in which Itadori can say “I am in control” narrows with every swallow.",
      },
    },
    {
      count: 20,
      key: "twenty",
      label: { tr: "20.", en: "20th" },
      title: { tr: "Yirminci — sözleşme yürürlükte", en: "The twentieth — the contract takes effect" },
      text: {
        tr: "Bütün parçalar bir araya geldiğinde Lanetlerin Kralı eksiksiz olur. Anlaşmanın son maddesi de tam o gün yürürlüğe girer: artık Sukuna'yı öldürmek, kabı öldürmektir. Sayaç dolduğunda kazanan taraf yok — yalnızca vadesi gelmiş bir karar var.",
        en: "When every piece is gathered the King of Curses is whole. That is the day the vow's final clause takes effect: from then on, killing Sukuna means killing the vessel. A full counter has no winning side — only a sentence that has come due.",
      },
    },
  ] as VesselMilestone[],
} as const;

/* ── Kader çizelgesi: ortak kronoloji ───────────────────────────────── */

export interface VesselEra {
  key: string;
  imageKey: string;
  /** Kimin elindeydi: çubuk bunu gösteriyor */
  control: VesselMode | "split";
  when: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  quote?: { text: LocalizedText; by: LocalizedText };
}

export const VESSEL_TIMELINE_TITLE = {
  title: { tr: "Kap İlişkisinin Kaderi", en: "The Fate of a Vessel" },
  lede: {
    tr: "Beş durak, tek kronoloji. Her durağın yanındaki çubuk o gün bedenin kimin elinde olduğunu gösteriyor.",
    en: "Five stops, one chronology. The bar beside each stop shows whose hands the body was in that day.",
  },
  controlLabel: { tr: "O gün kontrol", en: "In control that day" },
} as const;

export const VESSEL_TIMELINE: VesselEra[] = [
  {
    key: "grandfather",
    imageKey: VESSEL_IMAGE_KEYS.eraGrandfather,
    control: "split",
    when: { tr: "15 yaş · 2018", en: "Age 15 · 2018" },
    title: {
      tr: "Dedenin son sözü ve ilk parmak",
      en: "The grandfather's last words, and the first finger",
    },
    text: {
      tr: "Wasuke Itadori hastane yatağında torununa iki cümle bıraktı; ikisi de bir vasiyetten çok bir talimat gibiydi. Aynı gece okulun okült kulübünde mühürlü bir lanet nesnesi açıldı, koku lanetleri çağırdı ve Itadori arkadaşlarını kurtarmak için parmağı yuttu. Dede öğüdünü verirken torununun bin yıllık bir lanetin kabı olacağını bilmiyordu — ama söylediği tam olarak buna hazırlıklı bir cümleydi.",
      en: "Wasuke Itadori left his grandson two sentences from a hospital bed; both sounded less like a will than an instruction. That same night a sealed cursed object was opened at the school's occult club, the smell called the curses in, and Itadori swallowed the finger to save his friends. His grandfather did not know he was speaking to the future vessel of a thousand-year-old curse — yet what he said was exactly the sentence for it.",
    },
    quote: {
      text: {
        tr: "Sen güçlüsün, o yüzden insanlara yardım et.",
        en: "You are strong, so help people.",
      },
      by: {
        tr: "Wasuke Itadori — hastane odası",
        en: "Wasuke Itadori — the hospital room",
      },
    },
  },
  {
    key: "sentence",
    imageKey: VESSEL_IMAGE_KEYS.eraSentence,
    control: "itadori",
    when: { tr: "Aynı hafta", en: "The same week" },
    title: {
      tr: "İdam kararı ve Gojo'nun himayesi",
      en: "The death sentence, and Gojo's protection",
    },
    text: {
      tr: "Jujutsu üst kurulunun kararı hızlı geldi: kap yok edilecek. Satoru Gojo araya girip kararı bir şarta bağlattı — Itadori önce yirmi parmağın hepsini yutacak, Sukuna eksiksiz hâle gelecek, idam ondan sonra uygulanacak. Böylece bir ölüm cezası, öğrenciliğe dönüştü. Itadori'nin okul hayatı, ertelenmiş bir infazın takvimi üzerine kuruldu.",
      en: "The higher-ups ruled quickly: destroy the vessel. Satoru Gojo stepped in and tied the ruling to a condition — Itadori would first swallow all twenty fingers, Sukuna would become whole, and only then would the sentence be carried out. A death sentence turned into an enrolment, and Itadori's school life was built on the calendar of a deferred execution.",
    },
  },
  {
    key: "shibuya",
    imageKey: VESSEL_IMAGE_KEYS.eraShibuya,
    control: "sukuna",
    when: { tr: "31 Ekim 2018 · Shibuya", en: "31 October 2018 · Shibuya" },
    title: { tr: "Shibuya Olayı — kap kırılıyor", en: "The Shibuya Incident — the vessel breaks" },
    text: {
      tr: "Halloween gecesi Shibuya bir tuzağa çevrildi. Gojo mühürlendi, kadro dağıldı ve Itadori'nin dizginleri koptu: Sukuna bedeni aldı, verdiği sözün sınırını aştı, tapınağını perdesiz açtı. O gece Nanami'yi kaybettiler, Nobara'dan haber alınamadı, şehrin bir bölümü yıkıldı. Sabah olduğunda ortada tek bir sorumlu vardı ve o sorumlunun adı, bedeni taşıyan çocuğundu.",
      en: "On Halloween night Shibuya was turned into a trap. Gojo was sealed, the class scattered, and Itadori's reins snapped: Sukuna took the body, went past the limit of his vow and opened his shrine without a barrier. That night they lost Nanami, no word came of Nobara, and part of the city fell. By morning there was exactly one name held responsible — the name of the boy carrying the body.",
    },
    quote: {
      text: { tr: "Gerisi sana emanet.", en: "I leave the rest to you." },
      by: {
        tr: "Kento Nanami'nin son sözleri",
        en: "Kento Nanami's last words",
      },
    },
  },
  {
    key: "chouso",
    imageKey: VESSEL_IMAGE_KEYS.eraChouso,
    control: "itadori",
    when: { tr: "Shibuya'dan sonra", en: "After Shibuya" },
    title: { tr: "Chouso ve kardeşlik", en: "Choso, and a brotherhood" },
    text: {
      tr: "Ölü Resim Rahimleri'nin en büyüğü Chouso, Shibuya'da Itadori'ye karşı savaşırken hiç yaşamadığı bir anıyı gördü: aynı sofra, aynı kan. Itadori'nin annesinin bedenini kullanan kişi, Chouso'yu ve kardeşlerini de yaratmıştı. Böylece düşman kardeş çıktı ve kabın en beklenmedik müttefiki, kendisi gibi yarı lanet olan biri oldu.",
      en: "Choso, eldest of the Death Painting Wombs, saw a memory he had never lived while fighting Itadori in Shibuya: the same table, the same blood. Whoever was wearing Itadori's mother's body had also made Choso and his brothers. The enemy turned out to be family, and the vessel's least likely ally turned out to be someone half-curse like the thing inside him.",
    },
  },
  {
    key: "return",
    imageKey: VESSEL_IMAGE_KEYS.eraReturn,
    control: "sukuna",
    when: { tr: "Sayaç dolduğunda", en: "When the counter fills" },
    title: { tr: "Sukuna'nın tam dönüşü", en: "Sukuna's full return" },
    text: {
      tr: "Yirmi parça bir araya geldiğinde Lanetlerin Kralı eksik kalmıyor. Sukuna artık ödünç bir bedende oturan bir konuk değil: kendi iradesiyle hareket eden, çağın en güçlü büyücülerini karşısına alan tam bir varlık. Itadori'nin sorusu da o gün değişiyor — artık “kontrol bende mi?” değil, “bu bedeni geri alabilir miyim?”",
      en: "When the twenty pieces come together, the King of Curses is no longer missing anything. Sukuna stops being a guest sitting in a borrowed body: he moves by his own will and takes the strongest sorcerers of the age head-on. Itadori's question changes that day too — no longer “am I in control?” but “can I take this body back?”",
    },
  },
];

/* ── Kapın çevresi ──────────────────────────────────────────────────── */

export interface VesselCompanion {
  characterId: number;
  imageKey: string;
  name: string;
  native: string;
  note: LocalizedText;
}

export const VESSEL_CIRCLE_TITLE = {
  title: { tr: "Kapın Çevresi", en: "The Vessel's Circle" },
  lede: {
    tr: "Bu bedenin etrafında duran altı isim. Bazıları onu ayakta tutuyor, biri onu parça parça söküyor.",
    en: "Six names standing around this body. Some of them hold it up; one takes it apart piece by piece.",
  },
  altSuffix: { tr: "arşiv portresi", en: "archive portrait" },
} as const;

export const VESSEL_CIRCLE: VesselCompanion[] = [
  {
    characterId: 127691,
    imageKey: VESSEL_IMAGE_KEYS.circleGojo,
    name: "Satoru Gojo",
    native: "五条悟",
    note: {
      tr: "Kapın öğretmeni ve kefili. İdam kararını erteleten kişi; Shibuya'da mühürlendiğinde Itadori'nin arkasındaki duvar da çöktü.",
      en: "The vessel's teacher and guarantor. The man who had the sentence deferred; when he was sealed in Shibuya, the wall behind Itadori fell with him.",
    },
  },
  {
    characterId: 126635,
    imageKey: VESSEL_IMAGE_KEYS.circleMegumi,
    name: "Megumi Fushiguro",
    native: "伏黒恵",
    note: {
      tr: "İlk parmağı Itadori'nin yoluna çıkaran kişi ve ilk arkadaşı. “Kurtarılmaya değer” listesinin en başında o duruyor.",
      en: "The one who put the first finger in Itadori's path, and his first friend. He stands at the very top of the list of people worth saving.",
    },
  },
  {
    characterId: 133700,
    imageKey: VESSEL_IMAGE_KEYS.circleNobara,
    name: "Nobara Kugisaki",
    native: "釘崎野薔薇",
    note: {
      tr: "Aynı sınıfın üçüncüsü, kadronun en keskin dili. Shibuya'ya üçü birlikte gitti; oradan üçü birlikte dönmedi.",
      en: "The third of the same class and the sharpest tongue in it. The three of them went into Shibuya together; the three of them did not come out together.",
    },
  },
  {
    characterId: 133704,
    imageKey: VESSEL_IMAGE_KEYS.circleNanami,
    name: "Kento Nanami",
    native: "七海建人",
    note: {
      tr: "Eski maaşlı çalışan, sonradan büyücü. Itadori'ye mesleğin acımasız aritmetiğini o öğretti ve son cümlesini de ona bıraktı.",
      en: "A former salaryman turned sorcerer. He taught Itadori the trade's merciless arithmetic, and left him his last sentence too.",
    },
  },
  {
    characterId: 133702,
    imageKey: VESSEL_IMAGE_KEYS.circleMahito,
    name: "Mahito",
    native: "真人",
    note: {
      tr: "Ruha dokunan lanet. Itadori'nin insan olmakla ilgili bütün varsayımlarını tek tek söktü; Junpei'yi de Nanami'yi de ondan aldı.",
      en: "The curse that touches souls. He took apart every assumption Itadori had about being human, and took Junpei and Nanami from him as well.",
    },
  },
  {
    characterId: 157116,
    imageKey: VESSEL_IMAGE_KEYS.circleChouso,
    name: "Chouso",
    native: "脹相",
    note: {
      tr: "Ölü Resim Rahimleri'nin en büyüğü. Önce düşman, sonra kardeş: kanın hatırladığı, kimsenin beklemediği bir bağ.",
      en: "Eldest of the Death Painting Wombs. First an enemy, then a brother: a bond the blood remembered and nobody expected.",
    },
  },
];

/* ── Kapanış ────────────────────────────────────────────────────────── */

export interface VesselClosingQuote {
  mode: VesselMode;
  native: string;
  text: LocalizedText;
  by: LocalizedText;
}

export const VESSEL_CLOSING = {
  title: { tr: "İki İyi Ölüm Tarifi", en: "Two Definitions of a Good Death" },
  lede: {
    tr: "Aynı bedeni paylaşan iki iradenin üzerinde anlaşamadığı tek şey ölümün nasıl olması gerektiği. İkisi de bu konuda gayet net.",
    en: "The one thing the two wills sharing this body cannot agree on is what a death should look like. Both of them are perfectly clear about it.",
  },
  watermark: "器",
  quotes: [
    {
      mode: "itadori",
      native: "正しい死",
      text: { tr: "Doğru bir ölüm istiyorum.", en: "I want a proper death." },
      by: {
        tr: "Yuuji Itadori — kendi idam kararı üzerine",
        en: "Yuuji Itadori — on his own death sentence",
      },
    },
    {
      mode: "sukuna",
      native: "強かったよ",
      text: { tr: "Sen güçlüydün, Jōgo.", en: "You were strong, Jogo." },
      by: {
        tr: "Ryōmen Sukuna — Shibuya Olayı, Jōgo'nun küllerine",
        en: "Ryōmen Sukuna — the Shibuya Incident, to Jogo's ashes",
      },
    },
  ] as VesselClosingQuote[],
  credit: {
    tr: "Künye bilgileri ve portreler AniList'ten alındı: Yuuji Itadori (127212) ve Sukuna (133701). Sayfadaki bütün grafikler — yüz işaretleri, parmak rayı, tapınak mührü, kesik motifleri — bu arşiv için elle çizilmiş SVG'lerdir; dışarıdan alınmış raster görsel kullanılmadı.",
    en: "Profile data and portraits come from AniList: Yuuji Itadori (127212) and Sukuna (133701). Every graphic on this page — the face marks, the finger rail, the shrine sigil, the slash motifs — is an SVG drawn by hand for this archive; no external raster image was used.",
  },
  creditLinkLabel: { tr: "AniList künyesi", en: "AniList profile" },
} as const;
