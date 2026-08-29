import type {
  NarutoBijuu,
  NarutoElement,
  NarutoEye,
  NarutoFigureRef,
  NarutoJutsu,
} from "./types";
import { NARUTO_PEOPLE, type NarutoPersonSlug } from "./people";

/** Kullanıcı çipi — ad kadro kaydından, portresi sayfada çözülür */
const user = (person: NarutoPersonSlug, label?: string): NarutoFigureRef => ({
  label: label ?? NARUTO_PEOPLE[person].name,
  person,
});

/**
 * Naruto Evreni — güç kaydı (doğa dönüşümleri, dōjutsu, jutsu, bijuu).
 *
 * `bar`/`iris`/`color` alanları içeriğe ait vurgu renkleri, tema token'ı
 * değil — gerekçe `geography.ts` başındaki notta.
 */

/** Beş temel doğa dönüşümü */
export const NARUTO_ELEMENTS: NarutoElement[] = [
  {
    id: "fire",
    tr: "Ateş",
    en: "KATON",
    kanji: "火",
    release: "FIRE RELEASE",
    bar: "#d32f2f",
    desc:
      "Uchiha klanının damgası. Nefesle şekillenen, geniş bir alanı bir anda " +
      "yakan doğa dönüşümü. Konoha shinobi'lerinin çoğu bu hattı kullanır.",
    users: [
      user("sasuke-uchiha"),
      user("itachi-uchiha"),
      user("madara-uchiha"),
      user("hiruzen-sarutobi"),
      user("asuma-sarutobi"),
    ],
    jutsu: ["Büyük Ateş Topu", "Amaterasu", "Ateş Ejderi Mermisi"],
  },
  {
    id: "wind",
    tr: "Rüzgâr",
    en: "FŪTON",
    kanji: "風",
    release: "WIND RELEASE",
    bar: "oklch(0.78 0.11 150)",
    desc:
      "Chakrayı keskinleştirip kesici hâle getirir. Rüzgâr Ülkesi'nin ve " +
      "Naruto'nun doğası; yıldırıma karşı üstün, ateşi besler.",
    users: [
      user("naruto-uzumaki"),
      user("temari"),
      user("asuma-sarutobi"),
      user("danzo-shimura"),
    ],
    jutsu: ["Rasenshuriken", "Rüzgâr Tırpanı", "Vakum Küresi"],
  },
  {
    id: "lightning",
    tr: "Yıldırım",
    en: "RAITON",
    kanji: "雷",
    release: "LIGHTNING RELEASE",
    bar: "oklch(0.84 0.13 95)",
    desc:
      "Delici, hızlı ve doğrudan. Kumogakure'nin imzası ve Kakashi hattının " +
      "temeli; toprağa karşı üstün, rüzgâra karşı zayıf.",
    users: [
      user("kakashi-hatake"),
      user("sasuke-uchiha"),
      user("a-raikage"),
      user("darui"),
    ],
    jutsu: ["Chidori", "Kirin", "Yıldırım Zırhı"],
  },
  {
    id: "water",
    tr: "Su",
    en: "SUITON",
    kanji: "水",
    release: "WATER RELEASE",
    bar: "oklch(0.7 0.1 225)",
    desc:
      "Kirigakure'nin doğası. Kaynak olmadan da chakradan üretilebilen en " +
      "akışkan element; ateşi söndürür, yıldırıma karşı savunmasız.",
    users: [
      user("tobirama-senju"),
      user("zabuza-momochi"),
      user("kisame-hoshigaki"),
      user("suigetsu-hozuki"),
    ],
    jutsu: ["Su Ejderi Mermisi", "Büyük Şelale", "Su Hapishanesi"],
  },
  {
    id: "earth",
    tr: "Toprak",
    en: "DOTON",
    kanji: "土",
    release: "EARTH RELEASE",
    bar: "oklch(0.72 0.08 60)",
    desc:
      "Savunmanın temeli. Iwagakure'nin hattı ve Hashirama'nın Ahşap " +
      "Salım'ını doğuran iki yarımdan biri (diğeri su).",
    users: [
      user("hashirama-senju"),
      user("onoki"),
      user("kakuzu"),
      user("jiraiya"),
    ],
    jutsu: ["Çamur Duvarı", "Toprak Kubbe", "Kaya Golemi"],
  },
];

/** Dōjutsu — göz teknikleri */
export const NARUTO_EYES: NarutoEye[] = [
  {
    id: "sharingan",
    name: "Sharingan",
    owner: "UCHIHA",
    iris: "oklch(0.55 0.2 28)",
    mid: "oklch(0.42 0.18 28)",
    desc:
      "Uchiha klanının kopyalayan gözü. Hareketi okur, genjutsu kurar, bir " +
      "jutsu'yu tek bakışta öğrenir. Güçlü bir duygusal sarsıntıyla uyanır.",
  },
  {
    id: "mangekyo",
    name: "Mangekyō Sharingan",
    owner: "ITACHI · OBITO",
    iris: "oklch(0.5 0.21 25)",
    mid: "oklch(0.34 0.17 25)",
    desc:
      "En yakınını kaybetme acısıyla açılır. Amaterasu, Tsukuyomi, Kamui gibi " +
      "kişiye özel teknikler getirir; bedeli görme yetisidir.",
  },
  {
    id: "eternal",
    name: "Eternal Mangekyō",
    owner: "MADARA · SASUKE",
    iris: "oklch(0.52 0.22 22)",
    mid: "oklch(0.36 0.18 22)",
    desc: "Kardeş gözlerin birleşmesi. Körlüğü durdurur, Susanoo'yu tamamlar.",
  },
  {
    id: "rinnegan",
    name: "Rinnegan",
    owner: "HAGOROMO · PAIN",
    iris: "oklch(0.6 0.11 300)",
    mid: "oklch(0.42 0.1 300)",
    desc:
      "Altı Yol'un gözü. Yaşamı ve ölümü, çekimi ve itmeyi, bütün doğa " +
      "dönüşümlerini birden görür.",
  },
  {
    id: "byakugan",
    name: "Byakugan",
    owner: "HYŪGA",
    iris: "oklch(0.86 0.03 250)",
    mid: "oklch(0.7 0.03 250)",
    desc:
      "Neredeyse tam çevresel görüş ve chakra ağını okuma. Yumuşak Yumruk " +
      "stilinin gözü; Kumogakure bir kez bu göz için savaşı bahane etti.",
  },
  {
    id: "tenseigan",
    name: "Tenseigan",
    owner: "HAMURA HATTI",
    iris: "oklch(0.72 0.11 235)",
    mid: "oklch(0.55 0.1 235)",
    desc: "Ōtsutsuki chakrasıyla evrilen Byakugan. Çekim kontrolü ve Tenseigan Chakra Modu.",
  },
  {
    id: "rinnesharingan",
    name: "Rinne Sharingan",
    owner: "KAGUYA",
    iris: "oklch(0.5 0.2 20)",
    mid: "oklch(0.3 0.15 20)",
    desc: "Kaguya'nın alnındaki göz. Infinite Tsukuyomi'yi ayın yüzeyine yansıtan kaynak.",
  },
  {
    id: "jogan",
    name: "Jōgan",
    owner: "BORUTO",
    iris: "oklch(0.68 0.12 235)",
    mid: "oklch(0.5 0.11 235)",
    desc: "Boruto'nun sol gözünde uyanan saf göz. Chakra yollarını ve boyut çatlaklarını görür.",
  },
];

/** Jutsu kategorileri — arşiv başlığındaki şerit */
export const NARUTO_JUTSU_CATEGORIES = [
  "NINJUTSU",
  "GENJUTSU",
  "TAIJUTSU",
  "SENJUTSU",
  "FŪINJUTSU",
  "KEKKEI GENKAI",
  "KEKKEI TŌTA",
  "DŌJUTSU",
];

export const NARUTO_JUTSU: NarutoJutsu[] = [
  {
    slug: "rasengan",
    rank: "A · NINJUTSU",
    name: "Rasengan",
    desc: "Minato'nun icadı; şekil dönüşümünün zirvesi, doğa dönüşümü içermez.",
    color: "oklch(0.78 0.11 220)",
  },
  {
    slug: "chidori",
    rank: "A · RAITON",
    name: "Chidori",
    desc: "Kakashi'nin bin kuşu. Tek noktaya toplanan delici saldırı.",
    color: "oklch(0.84 0.13 95)",
  },
  {
    slug: "amaterasu",
    rank: "S · DŌJUTSU",
    name: "Amaterasu",
    desc: "Sönmeyen kara alev. Itachi'nin sağ gözünden çıkar.",
    color: "#ef4444",
  },
  {
    slug: "susanoo",
    rank: "S · DŌJUTSU",
    name: "Susanoo",
    desc: "Chakradan örülen dev muhafız; Mangekyō'nun son basamağı.",
    color: "#ef4444",
  },
  {
    slug: "kamui",
    rank: "S · UZAY-ZAMAN",
    name: "Kamui",
    desc: "Hedefi başka bir boyuta çeken girdap. Obito ile Kakashi aynı gözü paylaşır.",
    color: "oklch(0.7 0.12 300)",
  },
  {
    slug: "hiraishin",
    rank: "S · FŪINJUTSU",
    name: "Uçan Gök Gürültüsü",
    desc: "Tobirama'nın bulduğu, Minato'nun mükemmelleştirdiği ışınlanma mührü.",
    color: "oklch(0.82 0.12 90)",
  },
  {
    slug: "hachimon",
    rank: "— · TAIJUTSU",
    name: "Sekiz Kapı",
    desc: "Bedenin sekiz kapısı. Sekizincisi açılırsa bedel ölümdür.",
    color: "oklch(0.78 0.11 60)",
  },
  {
    slug: "edo-tensei",
    rank: "YASAK · KINJUTSU",
    name: "Edo Tensei",
    desc: "Ölüleri savaş alanına geri çağıran diriltme; Tobirama'nın icadı, Orochimaru'nun silahı.",
    color: "oklch(0.72 0.09 150)",
  },
  {
    slug: "chibaku-tensei",
    rank: "S · RINNEGAN",
    name: "Chibaku Tensei",
    desc: "Çekim çekirdeğiyle kurulan yapay uydu. Ay bu teknikle doğdu.",
    color: "oklch(0.7 0.11 300)",
  },
];

/**
 * Dokuz kuyruklu canavar ve jinchūriki'leri.
 *
 * `accent` her canavarın chakra rengi — sahne seçiliyken bütün bölümün
 * accent'i buna döner (22 Ağustos sinematik turu). `focus` üretilen
 * illüstrasyonun kadraj odağı: karakter ile bijuu'nun İKİSİ de görünür
 * kalacak nokta, görsel tek tek denetlenerek yazıldı.
 */
export const NARUTO_BIJUU: NarutoBijuu[] = [
  {
    n: 1,
    slug: "shukaku",
    tails: "01 TAILS",
    name: "Shukaku",
    jin: "Gaara",
    power: "Kum · Manyetik Salım",
    desc: "Uykusuz, tetikte ve kavgacı. Kum kalkanının ve Manyetik Salım'ın kaynağı.",
    accent: "#C9A660",
    focus: "center 30%",
  },
  {
    n: 2,
    slug: "matatabi",
    tails: "02 TAILS",
    name: "Matatabi",
    jin: "Yugito Nii",
    power: "Mavi ateş",
    desc: "İki kuyruklu kedi. Sönmeyen mavi alevle savaşır.",
    accent: "#3FA9F5",
    focus: "center 32%",
  },
  {
    n: 3,
    slug: "isobu",
    tails: "03 TAILS",
    name: "Isobu",
    jin: "Yagura Karatachi",
    power: "Mercan · Su",
    desc: "Kabuğuna çekilen dev kaplumbağa. Mercan hastalığı yayar.",
    accent: "#7C6FCB",
    focus: "center 35%",
  },
  {
    n: 4,
    slug: "son-goku",
    tails: "04 TAILS",
    name: "Son Gokū",
    jin: "Rōshi",
    power: "Lav Salımı",
    desc: "Maymun kral. Kızgın lavı püskürtür; adını Naruto'ya kendi söyler.",
    accent: "#E8542A",
    focus: "center 30%",
  },
  {
    n: 5,
    slug: "kokuo",
    tails: "05 TAILS",
    name: "Kokuō",
    jin: "Han",
    power: "Buhar · Yōton",
    desc: "Beş kuyruklu delfin-at. Kaynayan buharla ham güç üretir.",
    accent: "#A8A9C8",
    focus: "center 32%",
  },
  {
    n: 6,
    slug: "saiken",
    tails: "06 TAILS",
    name: "Saiken",
    jin: "Utakata",
    power: "Asit · Sabun",
    desc: "Sümüklü böcek. Eriten asit ve zehirli sis salar.",
    accent: "#A8D8B9",
    focus: "center 35%",
  },
  {
    n: 7,
    slug: "chomei",
    tails: "07 TAILS",
    name: "Chōmei",
    jin: "Fū",
    power: "Uçuş · Toz",
    desc: "Yedi kuyruklu böcek. Kanatlarıyla havada süzülür.",
    accent: "#D4B24C",
    focus: "center 35%",
  },
  {
    n: 8,
    slug: "gyuki",
    tails: "08 TAILS",
    name: "Gyūki",
    jin: "Killer B",
    power: "Mürekkep · Boğa gücü",
    desc: "Ahtapot-boğa. Jinchūriki'siyle tam uyum kuran ilk bijuu'lardan.",
    accent: "#6B4FA0",
    focus: "center 28%",
  },
  {
    n: 9,
    slug: "kurama",
    tails: "09 TAILS",
    name: "Kurama",
    jin: "Naruto Uzumaki",
    power: "Bijuudama · Chakra Modu",
    desc:
      "Dokuz kuyruklu tilki. Kaguya'nın gücünün en büyük parçası ve " +
      "nefretten dostluğa dönen bağın adı.",
    accent: "#F0A030",
    focus: "center 38%",
  },
];
