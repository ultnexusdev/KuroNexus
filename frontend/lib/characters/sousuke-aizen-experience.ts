import type { LocalizedText } from "./types";

/**
 * Sōsuke Aizen — deneyim sayfasının veri iskeleti.
 *
 * Sayfanın konsepti: **iki gerçeklik katmanı.** Aynı bölümler, aynı
 * yerlerde, iki ayrı metinle duruyor —
 *
 *   `record`     → Resmî Kayıt: Gotei 13'ün bildiği Aizen (nazik, gözlüklü,
 *                  Beşinci Bölük kaptanı). Ölçülü, resmî, soğuk.
 *   `reflection` → Kırılan Yansıma: olanın kendisi.
 *
 * ⚠️ DÜRÜSTLÜK ŞARTI (kullanıcı komutu, 22 Ağustos 2026): iki katman da
 * sayfada ETİKETLİ. Okuyucu hangi katmanı okuduğunu her an görüyor ve
 * `AIZEN_LAYERS.disclosure` satırı bunun bir anlatı oyunu olduğunu açıkça
 * söylüyor. Bu bir tuzak değil; yanlış bilgi verilmiyor, iki okuma yan yana
 * konuyor.
 *
 * Metinlerin tamamı iki dilli (`LocalizedText`, AGENTS.md kural 1).
 * Görseller veritabanında: characterId 1086, ABILITY yuvası, `aizen:*`
 * anahtarları (Itachi'deki `itachi:*` deseninin kardeşi). Görsel inmemişse
 * ilgili bölüm görselsiz ama ayakta kalır.
 *
 * Künye sayıları `anilist-detay.json`dan: doğum 29 Mayıs, boy 186 cm,
 * rütbe "Captain of the 5th Division", zanpakutō "Kyouka Suigetsu";
 * yaş ve kan grubu kaynakta BOŞ — uydurulmadı, "kayıtta yok" yazıldı.
 */

export const AIZEN_ID = 1086;

/** Sayfanın iki gerçeklik katmanı. */
export type LayerKey = "record" | "reflection";

/**
 * İki katmanlı satır: aynı yer, iki okuma.
 *
 * Bileşen ikisini de çiziyor ve kapalı olanı `visibility: hidden` ile
 * kapatıyor — `opacity: 0` yetmezdi: görünmez metin ekran okuyucuda
 * okunmaya devam ederdi ve iki katman birbirine karışırdı.
 */
export interface LayeredText {
  record: LocalizedText;
  reflection: LocalizedText;
}

/* ── Küratör yuvaları ──────────────────────────────────────────────────
   Hepsi characterId 1086 kaydında, ABILITY yuvasında. Sayfa bu görsellerin
   HİÇBİRİ olmadan da tam çiziliyor; görsel geldikçe sahneler doluyor. */

export const AIZEN_IMAGE_KEYS = {
  /** Hero fonu — Beşinci Bölük koridoru, soğuk cam (16:9) */
  hero: "aizen:hero",
  /** Hero'nun ikinci katmanı — Kırılan Yansıma modunda çapraz geçer (16:9) */
  heroReflection: "aizen:hero-reflection",
  /** Ayna panelinin arkasındaki sahne (1:1 ya da 4:3) */
  mirrorScene: "aizen:mirror-scene",
  kyokaSuigetsu: "aizen:kyoka-suigetsu",
  hogyoku: "aizen:hogyoku",
  kido: "aizen:kido",
  shikai: "aizen:shikai",
  hakufuku: "aizen:hakufuku",
  hollowfication: "aizen:hollowfication",
  bala: "aizen:bala",
  eraExperiments: "aizen:era-experiments",
  eraBetrayal: "aizen:era-betrayal",
  eraHuecoMundo: "aizen:era-hueco-mundo",
  eraKarakura: "aizen:era-karakura",
  eraMuken: "aizen:era-muken",
} as const;

export type AizenImageKey =
  (typeof AIZEN_IMAGE_KEYS)[keyof typeof AIZEN_IMAGE_KEYS];

/** Yükleme kutusunun üstünde görünen açıklama — küratör ne yükleyecek? */
export const AIZEN_SLOT_LABELS: Record<string, LocalizedText> = {
  [AIZEN_IMAGE_KEYS.hero]: {
    tr: "Hero — kaptan üniformasıyla, soğuk koridor (16:9)",
    en: "Hero — in captain's uniform, cold corridor (16:9)",
  },
  [AIZEN_IMAGE_KEYS.heroReflection]: {
    tr: "Hero · yansıma — gözlüksüz, saçı geriye taranmış (16:9)",
    en: "Hero · reflection — no glasses, hair swept back (16:9)",
  },
  [AIZEN_IMAGE_KEYS.mirrorScene]: {
    tr: "Ayna paneli fonu — kırık cam yüzey (kare kadraj)",
    en: "Mirror panel backdrop — shattered glass surface (square crop)",
  },
  [AIZEN_IMAGE_KEYS.kyokaSuigetsu]: {
    tr: "Kyōka Suigetsu — serbest bırakılan zanpakutō (16:9)",
    en: "Kyōka Suigetsu — the released zanpakutō (16:9)",
  },
  [AIZEN_IMAGE_KEYS.hogyoku]: {
    tr: "Hōgyoku — mor küre (16:9)",
    en: "Hōgyoku — the violet orb (16:9)",
  },
  [AIZEN_IMAGE_KEYS.kido]: {
    tr: "Kidō — Kurohitsugi'nin kara sütunu (16:9)",
    en: "Kidō — the black pillar of Kurohitsugi (16:9)",
  },
  [AIZEN_IMAGE_KEYS.shikai]: {
    tr: "Serbest bırakma — “Kudake” anı (16:9)",
    en: "The release — the moment of “Kudake” (16:9)",
  },
  [AIZEN_IMAGE_KEYS.hakufuku]: {
    tr: "Hakufuku — bilinci dağıtan beyaz kidō (16:9)",
    en: "Hakufuku — the white kidō that scatters awareness (16:9)",
  },
  [AIZEN_IMAGE_KEYS.hollowfication]: {
    tr: "Hollowlaşma — Hōgyoku ile kaynaşma evreleri (16:9)",
    en: "Hollowfication — the stages of fusing with the Hōgyoku (16:9)",
  },
  [AIZEN_IMAGE_KEYS.bala]: {
    tr: "Bala — sertleştirilmiş reiatsu mermisi (16:9)",
    en: "Bala — the hardened reiatsu round (16:9)",
  },
  [AIZEN_IMAGE_KEYS.eraExperiments]: {
    tr: "Dönem — hollowlaşma deneyleri, gece Rukongai (16:9)",
    en: "Era — the hollowfication experiments, Rukongai at night (16:9)",
  },
  [AIZEN_IMAGE_KEYS.eraBetrayal]: {
    tr: "Dönem — Sōkyoku Tepesi, ihanetin açıldığı an (16:9)",
    en: "Era — Sōkyoku Hill, the moment the betrayal opens (16:9)",
  },
  [AIZEN_IMAGE_KEYS.eraHuecoMundo]: {
    tr: "Dönem — Las Noches ve Espada masası (16:9)",
    en: "Era — Las Noches and the Espada table (16:9)",
  },
  [AIZEN_IMAGE_KEYS.eraKarakura]: {
    tr: "Dönem — Sahte Karakura'nın üstündeki gökyüzü (16:9)",
    en: "Era — the sky above Fake Karakura (16:9)",
  },
  [AIZEN_IMAGE_KEYS.eraMuken]: {
    tr: "Dönem — Muken'in en alt katı, bağlı sandalye (16:9)",
    en: "Era — the lowest level of Muken, the bound chair (16:9)",
  },
};

/* ── Katman etiketleri ve mod düğmesi ──────────────────────────────────── */

export const AIZEN_LAYERS = {
  record: {
    name: { tr: "Resmî Kayıt", en: "Official Record" },
    note: {
      tr: "Gotei 13'ün bildiği Aizen.",
      en: "The Aizen the Gotei 13 knew.",
    },
  },
  reflection: {
    name: { tr: "Kırılan Yansıma", en: "Broken Reflection" },
    note: {
      tr: "Kaydın altında kalan.",
      en: "What the record was written over.",
    },
  },
  /** Mod düğmesinin üstündeki durum satırının etiketi */
  nowReading: { tr: "Okunan katman", en: "Layer in view" },
  /** Resmî Kayıt'tayken düğmenin yazdığı */
  toReflection: { tr: "Yansımayı kır", en: "Break the reflection" },
  /** Kırılan Yansıma'dayken düğmenin yazdığı */
  toRecord: { tr: "Kyōka Suigetsu", en: "Kyōka Suigetsu" },
  /** Şeritteki sabit açıklama — oyunun kuralını okuyucuya söyleyen satır */
  disclosure: {
    tr: "Bu dosya iki katman taşır ve ikisi de etiketlidir. Sağ alttaki düğme sayfanın tamamını çevirir; hangi katmanı okuduğunu her zaman burada görürsün.",
    en: "This file carries two layers, and both are labelled. The control at the bottom right turns the whole page; the layer you are reading is always named here.",
  },
  /** Ekran okuyucuya inen durum bildirimi */
  liveRecord: {
    tr: "Resmî Kayıt katmanı açık.",
    en: "Official Record layer is open.",
  },
  liveReflection: {
    tr: "Kırılan Yansıma katmanı açık.",
    en: "Broken Reflection layer is open.",
  },
} as const;

/* ── 1 · Hero ──────────────────────────────────────────────────────────── */

export const AIZEN_HERO = {
  name: "Sōsuke Aizen",
  nativeName: "藍染惣右介",
  /** Zanpakutō'nun adı: "ayna çiçeği, su ayı" — filigran, aria-hidden */
  watermark: "鏡花水月",
  reading: "kyōka suigetsu",
  role: {
    record: {
      tr: "Gotei 13 · Beşinci Bölük Kaptanı",
      en: "Gotei 13 · Captain of the Fifth Division",
    },
    reflection: {
      tr: "Firari · Las Noches'in sahibi · Muken tutuklusu",
      en: "Deserter · master of Las Noches · prisoner of Muken",
    },
  },
  epigraph: {
    record: {
      tr: "Sesini hiç yükseltmez. Astlarını adlarıyla çağırır. Herkes ona güvenir.",
      en: "He never raises his voice. He calls his subordinates by their given names. Everyone trusts him.",
    },
    reflection: {
      tr: "Bir yalanın en iyi saklandığı yer, herkesin baktığı yerdir.",
      en: "A lie hides best exactly where everyone is already looking.",
    },
  },
  portraitAlt: {
    tr: "Sōsuke Aizen — AniList künye portresi",
    en: "Sōsuke Aizen — AniList profile portrait",
  },
  heroAlt: {
    tr: "Sōsuke Aizen — küratörün yüklediği sahne görseli",
    en: "Sōsuke Aizen — scene image uploaded by the curator",
  },
} as const;

/* ── 2 · Künye şeridi ───────────────────────────────────────────────────
   Sayılar AniList künyesinden; kaynakta boş olan alanlar "kayıtta yok"
   diye yazıldı — bir Shinigami siciline yaş uydurmak arşivin işi değil. */

export interface RegistryRow {
  label: LocalizedText;
  value: LayeredText;
}

export const AIZEN_REGISTRY_TITLE = {
  title: {
    record: { tr: "Sicil", en: "Service File" },
    reflection: { tr: "Sicilin Altındaki", en: "Underneath the File" },
  },
  lede: {
    record: {
      tr: "Beşinci Bölük'ün kayıt defterinden. Bilgiler eksiksiz, imzalar yerinde, hiçbir satır tartışmalı değil.",
      en: "From the Fifth Division's register. Complete entries, signatures in place, not one contested line.",
    },
    reflection: {
      tr: "Aynı defter, aynı satırlar. Yalnızca kimin yazdığı değişiyor.",
      en: "The same register, the same lines. Only the hand that wrote them changes.",
    },
  },
} as const;

export const AIZEN_REGISTRY: RegistryRow[] = [
  {
    label: { tr: "Doğum", en: "Birthday" },
    value: {
      record: { tr: "29 Mayıs", en: "29 May" },
      reflection: {
        tr: "29 Mayıs — dosyada değişmeyen tek satır.",
        en: "29 May — the only line in the file that never changed.",
      },
    },
  },
  {
    label: { tr: "Boy", en: "Height" },
    value: {
      record: { tr: "186 cm", en: "186 cm" },
      reflection: {
        tr: "186 cm — kalabalıkta hep bir baş yukarısı.",
        en: "186 cm — always a head above the room.",
      },
    },
  },
  {
    label: { tr: "Kan grubu", en: "Blood type" },
    value: {
      record: { tr: "Kayıtta yok", en: "Not on file" },
      reflection: {
        tr: "Kayıtta hiç olmadı. Kimse de sormadı.",
        en: "It was never on file. No one ever asked.",
      },
    },
  },
  {
    label: { tr: "Yaş", en: "Age" },
    value: {
      record: {
        tr: "Sicil yaş tutmaz — Shinigami yüzyıl saymaz",
        en: "The register keeps no age — Shinigami do not count centuries",
      },
      reflection: {
        tr: "Yüzyıllar. Sayacak kimse kalmadı.",
        en: "Centuries. No one is left who was counting.",
      },
    },
  },
  {
    label: { tr: "Rütbe", en: "Rank" },
    value: {
      record: {
        tr: "Beşinci Bölük Kaptanı",
        en: "Captain of the Fifth Division",
      },
      reflection: {
        tr: "Teğmen → kaptan → firari → Muken tutuklusu",
        en: "Lieutenant → captain → deserter → prisoner of Muken",
      },
    },
  },
  {
    label: { tr: "Bağlı olduğu birlik", en: "Unit" },
    value: {
      record: { tr: "Gotei 13 · Beşinci Bölük", en: "Gotei 13 · Fifth Division" },
      reflection: { tr: "Las Noches · Espada", en: "Las Noches · the Espada" },
    },
  },
  {
    label: { tr: "Zanpakutō", en: "Zanpakutō" },
    value: {
      record: { tr: "Kyōka Suigetsu", en: "Kyōka Suigetsu" },
      reflection: {
        tr: "Kyōka Suigetsu — Kanzen Saimin",
        en: "Kyōka Suigetsu — Kanzen Saimin",
      },
    },
  },
  {
    label: { tr: "Teğmeni", en: "Lieutenant" },
    value: {
      record: {
        tr: "Momo Hinamori — kaptanına hayran",
        en: "Momo Hinamori — devoted to her captain",
      },
      reflection: {
        tr: "Momo Hinamori — hayranlığı en uzun süre işleyen zincir",
        en: "Momo Hinamori — the chain that held longest",
      },
    },
  },
  {
    label: { tr: "Sembolik obje", en: "Signature object" },
    value: {
      record: {
        tr: "Gözlük — kaptanın en tanıdık ayrıntısı",
        en: "Glasses — the captain's most familiar detail",
      },
      reflection: {
        tr: "Gözlük — ihanet açıldığı an düştü ve bir daha takılmadı",
        en: "Glasses — dropped the instant the betrayal opened, never worn again",
      },
    },
  },
];

/* ── 3 · Kırılan ayna paneli ────────────────────────────────────────────
   Sayfanın kalbi. Beş cam parçası, beş yalan/gerçek çifti. Parçaların
   GEOMETRİSİ bileşen tarafında (AizenGlyphs.tsx, MIRROR_SHARDS) — burada
   yalnızca metin var; kimliklerin sırası ikisinde de aynı. */

export type ShardKey =
  | "rank"
  | "death"
  | "hogyoku"
  | "allies"
  | "purpose";

export interface MirrorShard {
  key: ShardKey;
  /** Parçanın konusu — düğmenin erişilebilir adı da bu */
  subject: LocalizedText;
  /** Kaydın yazdığı */
  record: LocalizedText;
  /** Yüzey kırıldığında görünen */
  reflection: LocalizedText;
}

export const AIZEN_MIRROR_TITLE = {
  title: {
    record: { tr: "Gördüğün Doğru mu?", en: "Is What You See True?" },
    reflection: { tr: "Yüzey Kırıldı", en: "The Surface Is Broken" },
  },
  lede: {
    record: {
      tr: "Beş parça, beş kabul edilmiş doğru. Bir parçaya dokun; kaydın üstünü örttüğü satır açılsın. Kırılan parça kırık kalır.",
      en: "Five shards, five accepted truths. Touch one and the line the record was written over comes up. A broken shard stays broken.",
    },
    reflection: {
      tr: "Beş parça, beş yalan. Hepsi aynı elden çıktı ve hepsi yıllarca tuttu.",
      en: "Five shards, five lies. All from the same hand, and all of them held for years.",
    },
  },
  /** Parça kırılmadan önce okunan satır */
  sealed: {
    tr: "Yüzey henüz kırılmadı.",
    en: "The surface has not been broken yet.",
  },
  /** Kırılmış parçanın erişilebilir adına eklenen durum */
  brokenSuffix: { tr: "yüzey kırık", en: "surface broken" },
  breakAll: { tr: "Bütün yüzeyi kır", en: "Break the whole surface" },
  breakAllDone: { tr: "Yüzeyin tamamı kırık", en: "The whole surface is broken" },
  /** Ekran okuyucuya inen sayaç şablonu — %s yerine sayı geçer */
  counter: {
    tr: "Kırılan parça: %s / 5",
    en: "Shards broken: %s of 5",
  },
  hint: {
    tr: "Parçalar klavyeyle de gezilir: Sekme ile dolaş, Boşluk ya da Enter ile kır.",
    en: "The shards are keyboard reachable: Tab through them, break one with Space or Enter.",
  },
  sceneAlt: {
    tr: "Kırık ayna yüzeyi — küratörün yüklediği sahne görseli",
    en: "Shattered mirror surface — scene image uploaded by the curator",
  },
} as const;

export const AIZEN_MIRROR_SHARDS: MirrorShard[] = [
  {
    key: "rank",
    subject: { tr: "Rütbesi", en: "His rank" },
    record: {
      tr: "Beşinci Bölük'ün kaptanı. Nazik, ölçülü, sesini yükseltmeyen adam; kaptanlar arasında en az korkulanı.",
      en: "Captain of the Fifth Division. Courteous, measured, never raising his voice; the least feared man in the room.",
    },
    reflection: {
      tr: "Kaptanlık bir mevki değil, bir saklanma yeriydi. Rütbe onu korumadı — görünmez kıldı. Kimse kaptanın kendisinden şüphelenmez.",
      en: "The captaincy was not a post but a hiding place. The rank did not protect him — it made him invisible. Nobody suspects the captain.",
    },
  },
  {
    key: "death",
    subject: { tr: "Ölümü", en: "His death" },
    record: {
      tr: "Kaptan Aizen kendi karargâhının duvarına çivilenmiş hâlde bulundu. Ruh Toplumu bir kaptanını gömdü ve katilini aramaya başladı.",
      en: "Captain Aizen was found impaled against the wall of his own barracks. Soul Society buried a captain and went looking for his killer.",
    },
    reflection: {
      tr: "Duvardaki ceset bir sahneydi — Kyōka Suigetsu'nun kurduğu bir sahne. Aizen o sırada aynı binadaydı ve teğmeninin çığlığını duyacak kadar yakındı.",
      en: "The body on the wall was a stage — one Kyōka Suigetsu had set. Aizen was in the same building, close enough to hear his lieutenant scream.",
    },
  },
  {
    key: "hogyoku",
    subject: { tr: "Hōgyoku'nun yeri", en: "Where the Hōgyoku was" },
    record: {
      tr: "Kisuke Urahara'nın yasak küresi kayıp. Dosya, sürgün kararıyla birlikte kapatıldı: küre bulunamadı, arayan da kalmadı.",
      en: "Kisuke Urahara's forbidden orb is missing. The file was closed alongside the exile order: never recovered, and no one still looking.",
    },
    reflection: {
      tr: "Küre kaybolmadı. Urahara onu Rukia Kuchiki'nin ruhuna gömdü. Aizen bunu biliyordu ve Rukia'nın infaz emrini bekledi: Sōkyoku ruhu yakacak, küre açıkta kalacaktı.",
      en: "The orb was never lost. Urahara buried it inside Rukia Kuchiki's soul. Aizen knew, and waited for her execution order: the Sōkyoku would burn the soul away and leave the orb exposed.",
    },
  },
  {
    key: "allies",
    subject: { tr: "Müttefikleri", en: "His allies" },
    record: {
      tr: "Gin Ichimaru ve Kaname Tōsen kaptan meslektaşlarıydı; teğmeni Momo Hinamori ona hayrandı. Üç kaptan, tek saf.",
      en: "Gin Ichimaru and Kaname Tōsen were fellow captains; his lieutenant Momo Hinamori adored him. Three captains, one side.",
    },
    reflection: {
      tr: "Gin en baştan kendi hesabını taşıyordu ve o hesabın sonunda Aizen'in kendisi vardı. Tōsen kendi adaletinin peşindeydi. Aizen'in hiç müttefiki olmadı — yalnızca sırası gelmemiş taşlar.",
      en: "Gin carried his own account from the very start, and Aizen was the figure at the end of it. Tōsen was chasing a justice of his own. Aizen never had allies — only pieces whose turn had not come.",
    },
  },
  {
    key: "purpose",
    subject: { tr: "Amacı", en: "His purpose" },
    record: {
      tr: "Kayıtta amaç hanesi yok. Bir kaptanın amacı sorulmaz; görevi vardır, o kadar.",
      en: "The register has no field for purpose. A captain is not asked what he wants; he has duties, and that is all.",
    },
    reflection: {
      tr: "Göğün tepesindeki taht boştu ve Aizen o boşluğa dayanamadı. Kral Anahtarı'nı dökmek için yüz bin ruh gerekiyordu; o yüzden haritada Karakura'yı işaretledi.",
      en: "The throne at the top of the sky stood empty, and Aizen could not bear the vacancy. Forging the King's Key demanded a hundred thousand souls; that is why he circled Karakura on the map.",
    },
  },
];

/* ── 4 · Aynayı görenler ────────────────────────────────────────────────
   Bleach kadrosunun portreleri veritabanımızda YOK (22 Ağustos 2026
   ölçümü) — kartlar adla çiziliyor, portre gelirse kendiliğinden doluyor. */

export interface Witness {
  characterId: number;
  name: string;
  nativeName: string;
  role: LayeredText;
}

export const AIZEN_WITNESS_TITLE = {
  title: {
    record: { tr: "Çevresi", en: "His Circle" },
    reflection: { tr: "Kullandıkları", en: "The Ones He Used" },
  },
  lede: {
    record: {
      tr: "Aynı dönemin kayıtlarında adı Aizen'le birlikte geçen altı isim.",
      en: "Six names that appear beside Aizen's in the records of the same era.",
    },
    reflection: {
      tr: "Kyōka Suigetsu yalnızca serbest bırakılışını GÖREN üzerinde işler. Bu listede o kuralın tek istisnası da var.",
      en: "Kyōka Suigetsu only works on someone who has SEEN it released. This list holds the one exception to that rule.",
    },
  },
  portraitAltPattern: {
    tr: "%s — arşivimizdeki portre",
    en: "%s — portrait from our archive",
  },
} as const;

export const AIZEN_WITNESSES: Witness[] = [
  {
    characterId: 5,
    name: "Ichigo Kurosaki",
    nativeName: "黒崎一護",
    role: {
      record: {
        tr: "Karakura'nın izinsiz Shinigami'si; Ruh Toplumu'na Rukia için girdi.",
        en: "Karakura's unlicensed Shinigami; he walked into Soul Society for Rukia.",
      },
      reflection: {
        tr: "Kyōka Suigetsu'nun serbest bırakılışını hiç görmedi. Hipnozun tek kör noktası.",
        en: "He never saw Kyōka Suigetsu released. The one blind spot in the hypnosis.",
      },
    },
  },
  {
    characterId: 210,
    name: "Kisuke Urahara",
    nativeName: "浦原喜助",
    role: {
      record: {
        tr: "On İkinci Bölük'ün eski kaptanı, Ruh Toplumu'ndan sürüldü.",
        en: "Former captain of the Twelfth Division, exiled from Soul Society.",
      },
      reflection: {
        tr: "Hōgyoku'yu o yaptı, yok edemeyince o mühürledi — ve Aizen'in işlediği suçun bedelini o ödedi.",
        en: "He made the Hōgyoku, sealed it when he could not destroy it — and paid the price for Aizen's crime.",
      },
    },
  },
  {
    characterId: 908,
    name: "Yoruichi Shihōin",
    nativeName: "四楓院夜一",
    role: {
      record: {
        tr: "İkinci Bölük'ün eski kaptanı; kayıtlarda aynı gece kayboldu.",
        en: "Former captain of the Second Division; the records lose her the same night.",
      },
      reflection: {
        tr: "Kaçışı örgütleyen oydu. Urahara'yı ve hollowlaştırılan yoldaşları Ruh Toplumu'ndan çıkardı.",
        en: "She organised the escape, carrying Urahara and the hollowfied out of Soul Society.",
      },
    },
  },
  {
    characterId: 6,
    name: "Rukia Kuchiki",
    nativeName: "朽木ルキア",
    role: {
      record: {
        tr: "On Üçüncü Bölük neferi; güçlerini bir insana aktardığı için yargılandı.",
        en: "Thirteenth Division officer, tried for giving her powers to a human.",
      },
      reflection: {
        tr: "Hōgyoku yıllarca onun ruhunda durdu. İnfaz emri de bu yüzden çıktı; ceza değil, ameliyattı.",
        en: "The Hōgyoku sat inside her soul for years. The execution order was not a punishment but a surgery.",
      },
    },
  },
  {
    characterId: 1081,
    name: "Ulquiorra Cifer",
    nativeName: "ウルキオラ・シファー",
    role: {
      record: {
        tr: "Las Noches'in dördüncü Espada'sı: Cuatro.",
        en: "The fourth Espada of Las Noches: Cuatro.",
      },
      reflection: {
        tr: "Hōgyoku'nun elinden çıkma. Aizen'in gözü olarak insan dünyasına o gönderildi.",
        en: "Shaped by the Hōgyoku. Sent into the human world to serve as Aizen's eye.",
      },
    },
  },
  {
    characterId: 1080,
    name: "Grimmjow Jaegerjaquez",
    nativeName: "グリムジョー・ジャガージャック",
    role: {
      record: {
        tr: "Las Noches'in altıncı Espada'sı: Sexta.",
        en: "The sixth Espada of Las Noches: Sexta.",
      },
      reflection: {
        tr: "Emir dinlemediği için rütbesi düşürüldü. Aizen'in düzeninde tek gerçek gürültü oydu.",
        en: "Demoted for refusing orders. In Aizen's arrangement he was the only real noise.",
      },
    },
  },
];

/* ── 5 · Laboratuvar ────────────────────────────────────────────────────
   Üç büyük + dört küçük. Uydurma teknik yok; numarası kesin olmayan
   kidō'ya numara yazılmadı (Hakufuku). */

export interface MajorPower {
  key: "kyokaSuigetsu" | "hogyoku" | "kido";
  name: string;
  kanji: string;
  imageKey: string;
  tagline: LayeredText;
  text: LayeredText;
  traits: LocalizedText[];
}

export interface MinorPower {
  key: "shikai" | "hakufuku" | "hollowfication" | "bala";
  /**
   * Özel adlar çevrilmez (BRIEF kural 5) — ama "hollowlaşma" bir özel ad
   * değil, bir SÜREÇ adı; Türkçe sayfada İngilizce kalması dilin sırıtması
   * olurdu. Bu yüzden alan iki dilli: Kudake/Hakufuku/Bala her iki dilde de
   * aynı yazılıyor, yalnızca 虚化 çevriliyor.
   */
  name: LocalizedText;
  kanji: string;
  imageKey: string;
  note: LocalizedText;
}

export const AIZEN_LAB_TITLE = {
  title: {
    record: { tr: "Kayıtlı Yetkinlikler", en: "Recorded Proficiencies" },
    reflection: { tr: "Gerçek Cephanelik", en: "The Actual Arsenal" },
  },
  lede: {
    record: {
      tr: "Kaptanlık sınavının istediği üç başlık: zanpakutō, kidō, taktik. Üçünde de değerlendirme aynı — üst düzey.",
      en: "The three headings a captaincy examination asks for: zanpakutō, kidō, tactics. The same assessment under all three — exceptional.",
    },
    reflection: {
      tr: "Sınavın ölçmediği tek şey, bu üçünün birlikte ne yapabildiğiydi.",
      en: "The one thing the examination never measured was what these three could do together.",
    },
  },
  minorTitle: {
    record: { tr: "Sicile geçmemiş satırlar", en: "Lines that never reached the file" },
    reflection: { tr: "Sicile geçmesi istenmemiş satırlar", en: "Lines that were never meant to reach the file" },
  },
} as const;

export const AIZEN_MAJOR: MajorPower[] = [
  {
    key: "kyokaSuigetsu",
    name: "Kyōka Suigetsu · Kanzen Saimin",
    kanji: "鏡花水月",
    imageKey: AIZEN_IMAGE_KEYS.kyokaSuigetsu,
    tagline: {
      record: {
        tr: "Ayna çiçeği, su ayı — dokunulamayan güzellik.",
        en: "Mirror flower, water moon — the beauty that cannot be touched.",
      },
      reflection: {
        tr: "Tam Hipnoz. Gördüğünü sen seçmiyorsun.",
        en: "Complete Hypnosis. You do not choose what you see.",
      },
    },
    text: {
      record: {
        tr: "Serbest bırakma komutu “Kudake”. Beşinci Bölük'ün kayıtlarında zanpakutō'nun yeteneği “ileri düzey yanılsama” diye geçer — kaptan bunu bir kez, kaptanlar toplantısında göstermiştir.",
        en: "The release command is “Kudake”. In the Fifth Division's register the zanpakutō's ability is filed as “advanced illusion” — the captain demonstrated it once, at a captains' assembly.",
      },
      reflection: {
        tr: "Yanılsama değil. Kanzen Saimin, serbest bırakılışını gören herkesin BEŞ DUYUSUNU birden Aizen'e bağlar: ne gördüğünü, ne duyduğunu, kime dokunduğunu artık o söyler. Bir kere görmek ömür boyu yeter, iptali yoktur ve bu yüzden kaptanlar toplantısındaki o tek gösteri aslında bir tuzaktı.",
        en: "It is not illusion. Kanzen Saimin binds all FIVE SENSES of anyone who saw the release: what you see, what you hear, who you are touching is now his to declare. Seeing it once is enough for life, there is no undoing it — which is why that single demonstration at the captains' assembly was the trap itself.",
      },
    },
    traits: [
      { tr: "Beş duyu birden", en: "All five senses" },
      { tr: "Yalnızca göreni bağlar", en: "Binds only those who saw" },
      { tr: "İptali yok", en: "No undoing" },
    ],
  },
  {
    key: "hogyoku",
    name: "Hōgyoku",
    kanji: "崩玉",
    imageKey: AIZEN_IMAGE_KEYS.hogyoku,
    tagline: {
      record: {
        tr: "Yasak araştırma. Dosya kapalı.",
        en: "Forbidden research. File closed.",
      },
      reflection: {
        tr: "Etrafındaki kalplerin dilediğini gerçek yapar.",
        en: "It makes real what the hearts around it desire.",
      },
    },
    text: {
      record: {
        tr: "Kisuke Urahara'nın Shinigami ile Hollow arasındaki sınırı silmeye çalışan küresi. Merkez 46 çalışmayı yasakladı, kaptanı sürdü, küreyi kayıp ilan etti.",
        en: "Kisuke Urahara's orb, built to erase the border between Shinigami and Hollow. Central 46 banned the research, exiled the captain and declared the orb lost.",
      },
      reflection: {
        tr: "Urahara onu yok etmeye çalıştı, başaramadı ve Rukia'nın ruhuna mühürledi. Aizen küreyi geri aldığında Arrancar'ları ve Espada'yı onunla yaptı, sonunda küreyle kaynaştı. Mühürlenebilmesinin sebebi de oydu: küre, artık hiçbir şey dilemeyen bir kalbi tanımadı.",
        en: "Urahara tried to destroy it, failed, and sealed it inside Rukia's soul. When Aizen took it back he built the Arrancar and the Espada with it, and finally fused with it himself. That fusion is also why he could be sealed: the orb no longer recognised a heart that desired nothing.",
      },
    },
    traits: [
      { tr: "Urahara'nın eseri", en: "Urahara's making" },
      { tr: "Rukia'nın ruhunda saklandı", en: "Hidden in Rukia's soul" },
      { tr: "Arrancar ve Espada", en: "Arrancar and Espada" },
    ],
  },
  {
    key: "kido",
    name: "Kidō",
    kanji: "鬼道",
    imageKey: AIZEN_IMAGE_KEYS.kido,
    tagline: {
      record: {
        tr: "Kidō değerlendirmesi: üst düzey.",
        en: "Kidō assessment: exceptional.",
      },
      reflection: {
        tr: "Yetersiz okuma yok. Adsız Hadō 90.",
        en: "No incomplete incantation. An unnamed Hadō 90.",
      },
    },
    text: {
      record: {
        tr: "Kidō sözlü bir sanattır: okuma ne kadar tamsa etki o kadar büyük olur. Kayıt, kaptanın okumalarının kusursuz olduğunu yazar.",
        en: "Kidō is a spoken art: the fuller the incantation, the greater the effect. The register notes that the captain's incantations were flawless.",
      },
      reflection: {
        tr: "Aizen okumayı tamamen bıraktı. Hadō 90 Kurohitsugi'yi tek kelime etmeden kurdu ve kendi ifadesiyle, okumasız doksanı bir kaptanın tam okunmuş doksanından güçlüydü. Hiçbir listede adı olmayan kidō'lar da kullandı — sözü kaldırınca geriye ölçülemeyen bir şey kalıyor.",
        en: "Aizen dropped the incantation entirely. He raised Hadō 90, Kurohitsugi, without a word, and by his own account his uncanted ninety outmatched a captain's fully canted one. He also used kidō that appear on no list at all — take the speech away and what is left cannot be measured.",
      },
    },
    traits: [
      { tr: "Hadō 90 · Kurohitsugi", en: "Hadō 90 · Kurohitsugi" },
      { tr: "Okumasız", en: "Without incantation" },
      { tr: "Adsız kidō", en: "Unnamed kidō" },
    ],
  },
];

export const AIZEN_MINOR: MinorPower[] = [
  {
    key: "shikai",
    name: { tr: "“Kudake”", en: "“Kudake”" },
    kanji: "砕けろ",
    imageKey: AIZEN_IMAGE_KEYS.shikai,
    note: {
      tr: "Serbest bırakma komutu. Hipnozun şartı görmektir, o yüzden Aizen bu anı yalnızca kaçınılmaz olduğunda gösterdi — bir kez göstermek yetiyordu.",
      en: "The release command. The hypnosis requires being seen, so Aizen showed this moment only when he had to — once was enough.",
    },
  },
  {
    key: "hakufuku",
    name: { tr: "Hakufuku", en: "Hakufuku" },
    kanji: "白伏",
    imageKey: AIZEN_IMAGE_KEYS.hakufuku,
    note: {
      tr: "Bilinci bulandıran beyaz kidō: hedef ne yaptığını, biraz sonra kim olduğunu şaşırır. Zanpakutō'ya hiç ihtiyaç duymayan bir susturma yöntemi.",
      en: "A white kidō that clouds awareness: the target loses track of what they were doing, then of who they are. A way to silence someone without touching the zanpakutō.",
    },
  },
  {
    key: "hollowfication",
    name: { tr: "Hollowlaşma", en: "Hollowfication" },
    kanji: "虚化",
    imageKey: AIZEN_IMAGE_KEYS.hollowfication,
    note: {
      tr: "Hōgyoku ile kaynaşmanın evreleri: koza, kanat, tek göz. Her evrede Shinigami tarafından biraz daha uzaklaştı ve Hollow tarafına da hiç varmadı — ikisinin de dışına çıktı.",
      en: "The stages of fusing with the Hōgyoku: cocoon, wings, a single eye. Each stage carried him further from the Shinigami side without ever arriving at the Hollow one — he stepped outside both.",
    },
  },
  {
    key: "bala",
    name: { tr: "Bala", en: "Bala" },
    kanji: "虚弾",
    imageKey: AIZEN_IMAGE_KEYS.bala,
    note: {
      tr: "Hollow'ların sertleştirilmiş reiatsu mermisi: cero'dan hızlı, ondan zayıf. Bir Shinigami kaptanının cephaneliğinde bu tekniğin bulunması, sınırın çoktan silindiğinin işaretiydi.",
      en: "The Hollows' hardened reiatsu round: faster than a cero and weaker than one. Its presence in a Shinigami captain's arsenal was the sign that the border had already been erased.",
    },
  },
];

/* ── 6 · Kader çizelgesi ────────────────────────────────────────────────
   Beş durak. Yaş yerine DÖNEM etiketi: AniList'te yaş boş ve bir
   Shinigami'nin yaşını uydurmak kaynağa saygısızlık olurdu. */

export interface Era {
  key: "experiments" | "betrayal" | "huecoMundo" | "karakura" | "muken";
  imageKey: string;
  /** Sol taraftaki dönem işareti */
  mark: LocalizedText;
  title: LayeredText;
  text: LayeredText;
}

export const AIZEN_TIMELINE_TITLE = {
  title: {
    record: { tr: "Hizmet Geçmişi", en: "Service History" },
    reflection: { tr: "Planın Basamakları", en: "The Steps of the Plan" },
  },
  lede: {
    record: {
      tr: "Beş kayıt, kronolojik sırada. Her biri ayrı bir dosyada duruyor ve aralarında bir bağ kurulmamış.",
      en: "Five entries in chronological order. Each sits in a separate file, and no line was ever drawn between them.",
    },
    reflection: {
      tr: "Beş kayıt, tek bir çizgi. Bağ hep vardı; kimse iki dosyayı yan yana koymadı.",
      en: "Five entries, one line. The connection was always there; no one ever laid two files side by side.",
    },
  },
} as const;

export const AIZEN_TIMELINE: Era[] = [
  {
    key: "experiments",
    imageKey: AIZEN_IMAGE_KEYS.eraExperiments,
    mark: { tr: "Yaklaşık 110 yıl önce", en: "About 110 years ago" },
    title: {
      record: { tr: "Beşinci Bölük'ün Teğmeni", en: "Lieutenant of the Fifth" },
      reflection: { tr: "İlk Deney Kaydı", en: "The First Experiment" },
    },
    text: {
      record: {
        tr: "Kaptan Shinji Hirako'nun teğmeniydi. Rukongai'de ruhlar kayboldu, ardından bir gece bölüğün kendi subayları tanınmaz hâlde bulundu. Soruşturma On İkinci Bölük'ün kaptanına çıktı; Kisuke Urahara suçlandı ve sürgün edildi.",
        en: "He served as lieutenant under Captain Shinji Hirako. Souls went missing in Rukongai, and one night the division's own officers were found unrecognisable. The investigation led to the captain of the Twelfth; Kisuke Urahara was blamed and exiled.",
      },
      reflection: {
        tr: "Deneyi yapan teğmendi. Kendi kaptanını ve arkadaşlarını hollowlaştırdı, sonra suçun izini kaçmak zorunda kalan adamın üstünde bıraktı. Kaptanlık koltuğu o gece boşaldı ve bir sonraki isim hazır bekliyordu.",
        en: "The lieutenant ran the experiment. He hollowfied his own captain and their friends, then left the trail of the crime on the man who had to run. The captain's seat emptied that night, and the next name was already waiting.",
      },
    },
  },
  {
    key: "betrayal",
    imageKey: AIZEN_IMAGE_KEYS.eraBetrayal,
    mark: { tr: "Ruh Toplumu arkı", en: "The Soul Society arc" },
    title: {
      record: { tr: "Bir Kaptanın Ölümü", en: "The Death of a Captain" },
      reflection: { tr: "Sahnenin Kurulması", en: "Setting the Stage" },
    },
    text: {
      record: {
        tr: "Kaptan Aizen öldürüldü; ceset duvarda bulundu, Ruh Toplumu yas tuttu, şüpheliler sıraya dizildi. Sōkyoku Tepesi'nde infaz hazırlıkları sürüyordu.",
        en: "Captain Aizen was murdered; the body was found on the wall, Soul Society mourned, and suspects were lined up. On Sōkyoku Hill the execution went ahead as planned.",
      },
      reflection: {
        tr: "Ölüm sahnesini kendisi kurdu, kendi cenazesini izledi ve bütün soruşturmayı istediği yöne sürdü. İnfaz anında ortaya çıktı, Hōgyoku'yu Rukia'nın ruhundan çıkardı ve üç kaptan Menos'un ışığında göğe yükseldi.",
        en: "He staged his own death, watched his own funeral and steered the entire investigation where he wanted it. At the execution he stepped back into view, drew the Hōgyoku out of Rukia's soul, and three captains rose into the light of the Menos.",
      },
    },
  },
  {
    key: "huecoMundo",
    imageKey: AIZEN_IMAGE_KEYS.eraHuecoMundo,
    mark: { tr: "Hueco Mundo", en: "Hueco Mundo" },
    title: {
      record: { tr: "Yeni Görev Yeri", en: "A New Posting" },
      reflection: { tr: "Las Noches", en: "Las Noches" },
    },
    text: {
      record: {
        tr: "Firari kaptanların izi Hueco Mundo'ya çıktı. Beyaz bir kale, altında düzenli bir ordu; Ruh Toplumu bunu bir isyan dosyası olarak açtı.",
        en: "The deserting captains were traced to Hueco Mundo. A white fortress, an ordered army beneath it; Soul Society opened the file as an insurrection.",
      },
      reflection: {
        tr: "İsyan değildi, üretimdi. Hōgyoku Hollow'lardan Arrancar yaptı, Arrancar'lardan on numaralı Espada. Ulquiorra dördüncü, Grimmjow altıncı; masadaki her sandalyenin bir işlevi vardı ve hiçbiri Aizen'in yanında değildi.",
        en: "It was not an insurrection, it was manufacture. The Hōgyoku made Arrancar out of Hollows and ten numbered Espada out of Arrancar. Ulquiorra fourth, Grimmjow sixth; every chair at the table had a function, and not one of them stood beside him.",
      },
    },
  },
  {
    key: "karakura",
    imageKey: AIZEN_IMAGE_KEYS.eraKarakura,
    mark: { tr: "Kış Savaşı", en: "The Winter War" },
    title: {
      record: { tr: "Kış Savaşı", en: "The Winter War" },
      reflection: { tr: "Sahte Karakura", en: "Fake Karakura" },
    },
    text: {
      record: {
        tr: "Gotei 13 kasabayı boşalttı, gerçek Karakura'yı Ruh Toplumu'na taşıdı ve yerine bir kopya bıraktı. Savaş o kopyanın üstünde verildi.",
        en: "The Gotei 13 evacuated the town, moved the real Karakura into Soul Society and left a copy in its place. The battle was fought above that copy.",
      },
      reflection: {
        tr: "Kopya da hesabın içindeydi. Aizen kaptanları tek tek geçti, Hōgyoku ile kaynaştı, Gin'in bıçağını yedi ve o bıçaktan da kalktı. Onu durduran şey bir plan değil, Ichigo'nun kendi gücünü bırakmayı göze alması oldu.",
        en: "The copy was part of the arithmetic too. Aizen went through the captains one by one, fused with the Hōgyoku, took Gin's blade and rose from it. What stopped him was not a plan but Ichigo's willingness to give up his own power.",
      },
    },
  },
  {
    key: "muken",
    imageKey: AIZEN_IMAGE_KEYS.eraMuken,
    mark: { tr: "Sonrası", en: "Afterwards" },
    title: {
      record: { tr: "Dava Kapandı", en: "Case Closed" },
      reflection: { tr: "Muken — 18.800 Yıl", en: "Muken — 18,800 Years" },
    },
    text: {
      record: {
        tr: "Merkez 46 kararı verdi: Muken'in en alt katında hapis. Dosya mühürlendi, adı kayıtlardan düşürüldü, konu kapandı.",
        en: "Central 46 handed down its ruling: imprisonment on the lowest level of Muken. The file was sealed, the name struck from the register, the matter closed.",
      },
      reflection: {
        tr: "Ceza 18.800 yıl. Gözleri bağlandı, ağzı kapatıldı, kolları sandalyeye alındı — çünkü tehlikeli olan kılıcı değil, bakışı ve sesiydi. Ruh Toplumu Yhwach'ın savaşında o sandalyeyi kendi eliyle yukarı taşımak zorunda kaldı.",
        en: "The sentence is 18,800 years. His eyes were bound, his mouth covered, his arms taken into the chair — because the danger was never the sword but the gaze and the voice. In the war against Yhwach, Soul Society had to carry that chair upstairs itself.",
      },
    },
  },
];

/* ── 7 · Kapanış ────────────────────────────────────────────────────────
   BRIEF kural 9: uydurma replik yok. Aşağıdaki iki replik Aizen'in en
   bilinen iki sözü; emin olunmayan hiçbir replik sayfaya girmedi. */

export const AIZEN_CLOSING = {
  quotes: [
    {
      text: {
        tr: "Hayranlık, anlamaktan en uzak duygudur.",
        en: "Admiration is the emotion furthest from understanding.",
      },
      native: "憧れは理解から最も遠い感情だよ",
    },
    {
      text: {
        tr: "Başlangıçtan beri kimse göğün tepesinde durmuyordu — ne sen, ne ben, ne de tanrılar. Ama o tahtın dayanılmaz boşluğu artık son buluyor.",
        en: "From the beginning, no one stood at the top of the sky — not you, not me, not even the gods. But that unbearable vacancy on the throne ends now.",
      },
      native: null,
    },
  ],
  motto: {
    kanji: "鏡花水月",
    reading: "kyōka suigetsu",
    gloss: {
      tr: "Aynadaki çiçek, sudaki ay: görülebilen ama asla dokunulamayan şey.",
      en: "A flower in a mirror, a moon on the water: visible, and never within reach.",
    },
  },
  /** Kaynak künyesi — BRIEF kural 6 */
  credit: {
    tr: "Künye bilgileri (doğum günü, boy, rütbe, zanpakutō) ve kapak portresi AniList'ten alınmıştır; arşivimizde saklanır. Sayfadaki diğer bütün grafikler — gözlük motifi, kırık ayna, parça işaretleri — bu sayfa için elle çizilmiş SVG'dir. Anlatı metni arşivin kendi kalemidir; iki katman da etiketlidir.",
    en: "The profile data (birthday, height, rank, zanpakutō) and the cover portrait come from AniList and are cached in our archive. Every other graphic on this page — the spectacles motif, the shattered mirror, the shard marks — is SVG drawn by hand for this page. The narrative text is the archive's own; both layers are labelled.",
  },
  sourceLabel: { tr: "AniList künyesi", en: "AniList profile" },
  sourceHref: "https://anilist.co/character/1086",
} as const;
