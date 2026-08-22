import { AKATSUKI_IDS } from "@/lib/anime/akatsuki";
import type {
  NarutoClan,
  NarutoFigureRef,
  NarutoHokage,
  NarutoKage,
  NarutoLegend,
  NarutoPerson,
  NarutoTeam,
} from "./types";

/**
 * Naruto Evreni — insan kaydı (efsaneler, takımlar, klanlar, Kage'ler).
 *
 * Hokage sırası ve görevlerin nasıl bittiği Narutopedia'nın Türkçe Hokage
 * maddesinden denetlendi; cümleler yeniden yazıldı.
 *
 * ── KADRO KAYDI (22 Ağustos 2026) ────────────────────────────────────────
 * Sayfada adı geçen HERKES `NARUTO_PEOPLE` altında bir kez kayıtlı; takım
 * çipi, chakra kullanıcısı, dönem figürü, soy hattı hepsi bu kayda `slug`
 * ile bağlanır. Portre `CharacterImage` tablosunda `PORTRAIT` yuvasında,
 * AniList numarasının adresinde durur — bir kez yüklenir, her yerde görünür
 * ve karakterin kendi dosya sayfası (`/dark-stories/.../karakterler/<id>`)
 * aynı görseli okur. Numaralar AniList GraphQL'den 22 Ağustos 2026'da
 * doğrulandı (medya listesinde Naruto/Boruto araması ile).
 */
export const NARUTO_PEOPLE = {
  "naruto-uzumaki": { name: "Naruto Uzumaki", characterId: 17 },
  "sasuke-uchiha": { name: "Sasuke Uchiha", characterId: 13 },
  "sakura-haruno": { name: "Sakura Haruno", characterId: 145 },
  "kakashi-hatake": { name: "Kakashi Hatake", characterId: 85 },
  "itachi-uchiha": { name: "Itachi Uchiha", characterId: AKATSUKI_IDS.itachi },
  "madara-uchiha": { name: "Madara Uchiha", characterId: AKATSUKI_IDS.madara },
  pain: { name: "Pain", characterId: AKATSUKI_IDS.pain },
  konan: { name: "Konan", characterId: AKATSUKI_IDS.konan },
  "obito-uchiha": { name: "Obito Uchiha", characterId: AKATSUKI_IDS.tobi },
  "kisame-hoshigaki": { name: "Kisame Hoshigaki", characterId: AKATSUKI_IDS.kisame },
  kakuzu: { name: "Kakuzu", characterId: AKATSUKI_IDS.kakuzu },
  "hashirama-senju": { name: "Hashirama Senju", characterId: 12464 },
  "tobirama-senju": { name: "Tobirama Senju", characterId: 12465 },
  "hiruzen-sarutobi": { name: "Hiruzen Sarutobi", characterId: 7571 },
  "minato-namikaze": { name: "Minato Namikaze", characterId: 2535 },
  tsunade: { name: "Tsunade Senju", characterId: 2767 },
  jiraiya: { name: "Jiraiya", characterId: 2423 },
  orochimaru: { name: "Orochimaru", characterId: 2455 },
  "might-guy": { name: "Might Guy", characterId: 307 },
  "kurenai-yuhi": { name: "Kurenai Yūhi", characterId: 4773 },
  "asuma-sarutobi": { name: "Asuma Sarutobi", characterId: 4775 },
  "kiba-inuzuka": { name: "Kiba Inuzuka", characterId: 3495 },
  "shino-aburame": { name: "Shino Aburame", characterId: 3428 },
  "hinata-hyuga": { name: "Hinata Hyūga", characterId: 1555 },
  "shikamaru-nara": { name: "Shikamaru Nara", characterId: 2007 },
  "ino-yamanaka": { name: "Ino Yamanaka", characterId: 2009 },
  "choji-akimichi": { name: "Chōji Akimichi", characterId: 2008 },
  "neji-hyuga": { name: "Neji Hyūga", characterId: 1694 },
  "rock-lee": { name: "Rock Lee", characterId: 306 },
  tenten: { name: "Tenten", characterId: 3710 },
  sai: { name: "Sai", characterId: 1901 },
  yamato: { name: "Yamato", characterId: 2006 },
  "rin-nohara": { name: "Rin Nohara", characterId: 14082 },
  "suigetsu-hozuki": { name: "Suigetsu Hōzuki", characterId: 1903 },
  karin: { name: "Karin", characterId: 3151 },
  jugo: { name: "Jūgo", characterId: 3152 },
  jigen: { name: "Jigen", characterId: 130418 },
  delta: { name: "Delta", characterId: 130415 },
  "kashin-koji": { name: "Kashin Koji", characterId: 130421 },
  code: { name: "Code", characterId: 189949 },
  temari: { name: "Temari", characterId: 2174 },
  "danzo-shimura": { name: "Danzō Shimura", characterId: 23424 },
  "zabuza-momochi": { name: "Zabuza Momochi", characterId: 728 },
  onoki: { name: "Ōnoki", characterId: 23475 },
  "a-raikage": { name: "A (Dördüncü Raikage)", characterId: 22894 },
  darui: { name: "Darui", characterId: 23476 },
  rasa: { name: "Rasa", characterId: 22920 },
  gaara: { name: "Gaara", characterId: 1662 },
  kurotsuchi: { name: "Kurotsuchi", characterId: 23474 },
  yagura: { name: "Yagura Karatachi", characterId: 23222 },
  "mei-terumi": { name: "Mei Terumī", characterId: 23478 },
  chojuro: { name: "Chōjūrō", characterId: 23418 },
  hanzo: { name: "Hanzō", characterId: 23055 },
  "kushina-uzumaki": { name: "Kushina Uzumaki", characterId: 7302 },
  "kaguya-otsutsuki": { name: "Kaguya Ōtsutsuki", characterId: 126069 },
  "hagoromo-otsutsuki": { name: "Hagoromo Ōtsutsuki", characterId: 57883 },
  "hamura-otsutsuki": { name: "Hamura Ōtsutsuki", characterId: 165868 },
  "indra-otsutsuki": { name: "Indra Ōtsutsuki", characterId: 197843 },
  "ashura-otsutsuki": { name: "Ashura Ōtsutsuki", characterId: 269851 },
  "izuna-uchiha": { name: "Izuna Uchiha", characterId: 16406 },
  kurama: { name: "Kurama", characterId: 7407 },
} as const satisfies Record<string, NarutoPerson>;

export type NarutoPersonSlug = keyof typeof NARUTO_PEOPLE;

/** Kayıttaki kişi — bilinmeyen slug'da null (çip harfe düşer, sayfa kırılmaz) */
export function narutoPerson(slug: string): NarutoPerson | null {
  return (NARUTO_PEOPLE as Record<string, NarutoPerson>)[slug] ?? null;
}

/** Sayfanın tek görsel isteği için bütün kadro kimlikleri */
export function narutoPeopleIds(): number[] {
  return [
    ...new Set(Object.values(NARUTO_PEOPLE).map((p) => p.characterId)),
  ];
}

/** Kısa yol: ref dizisi kurarken tekrarı azaltır */
const ref = (person: NarutoPersonSlug, label?: string): NarutoFigureRef => ({
  label: label ?? NARUTO_PEOPLE[person].name,
  person,
});

/** Kadro — kart açıldığında künye. Sıra anlatı sırası, güç sırası değil. */
export const NARUTO_LEGENDS: NarutoLegend[] = [
  {
    no: "01",
    name: "Naruto Uzumaki",
    title: "Yedinci Hokage",
    power: "Kurama Chakra Modu · Rasenshuriken · Altı Yol Sage",
    accent: "#e6b84c",
    glow: "rgba(240,180,50,.34)",
    characterId: 17,
  },
  {
    no: "02",
    name: "Sasuke Uchiha",
    title: "Gölge Hokage",
    power: "Rinnegan + EMS · Amenotejikara · Indra Oku",
    accent: "oklch(0.7 0.12 300)",
    glow: "rgba(150,90,220,.3)",
    characterId: 13,
  },
  {
    no: "03",
    name: "Sakura Haruno",
    title: "Tıbbi Ninja",
    power: "Byakugō Mührü · Yüz Kuvvet · Kalp Nakli",
    accent: "oklch(0.78 0.1 350)",
    glow: "rgba(220,120,160,.26)",
    characterId: 145,
  },
  {
    no: "04",
    name: "Kakashi Hatake",
    title: "Altıncı Hokage",
    power: "Kamui · Chidori · Kopyalanmış bin jutsu",
    accent: "#ef4b4b",
    glow: "rgba(200,60,60,.28)",
    characterId: 85,
  },
  {
    no: "05",
    name: "Madara Uchiha",
    title: "Uchiha'nın Efendisi",
    power: "Susanoo · Ahşap Salım · Rinnegan",
    accent: "#ef4444",
    glow: "rgba(170,30,40,.34)",
    characterId: AKATSUKI_IDS.madara,
  },
  {
    no: "06",
    name: "Hashirama Senju",
    title: "Shinobi Tanrısı",
    power: "Ahşap Salım · Sage Modu · Budist Heykeli",
    accent: "oklch(0.76 0.1 145)",
    glow: "rgba(90,190,120,.24)",
    characterId: NARUTO_PEOPLE["hashirama-senju"].characterId,
  },
  {
    no: "07",
    name: "Itachi Uchiha",
    title: "Uchiha'nın Gölgesi",
    power: "Tsukuyomi · Amaterasu · Susanoo · Totsuka",
    accent: "#ef4444",
    glow: "rgba(190,30,40,.38)",
    characterId: AKATSUKI_IDS.itachi,
  },
  {
    no: "08",
    name: "Pain",
    title: "Altı Yol",
    power: "Shinra Tensei · Chibaku Tensei · Rinnegan",
    accent: "oklch(0.7 0.11 300)",
    glow: "rgba(140,110,200,.28)",
    characterId: AKATSUKI_IDS.pain,
  },
  {
    no: "09",
    name: "Obito Uchiha",
    title: "Maskeli Adam",
    power: "Kamui · Ten-Tails Jinchūriki · Uzay-zaman",
    accent: "oklch(0.68 0.17 26)",
    glow: "rgba(170,40,40,.3)",
    characterId: AKATSUKI_IDS.tobi,
  },
];

/**
 * Takımlar. Üyeler kadro kaydına bağlı — kart, çipin yanına küçük portreyi
 * kendisi çizer. `sensei` satırı serbest metin olarak kaldı (anlatı orada),
 * `senseiRefs` o satırdaki adların portre bağları.
 */
export const NARUTO_TEAMS: NarutoTeam[] = [
  {
    name: "Team 7",
    tag: "KAKASHI HAN",
    color: "#e6b84c",
    members: [
      ref("naruto-uzumaki", "Naruto"),
      ref("sasuke-uchiha", "Sasuke"),
      ref("sakura-haruno", "Sakura"),
    ],
    sensei: "Sensei: Kakashi Hatake · Sonradan: Sai, Yamato",
    senseiRefs: [ref("kakashi-hatake"), ref("sai"), ref("yamato")],
  },
  {
    name: "Team 8",
    tag: "TAKİP TAKIMI",
    color: "oklch(0.72 0.1 220)",
    members: [
      ref("kiba-inuzuka", "Kiba"),
      ref("shino-aburame", "Shino"),
      ref("hinata-hyuga", "Hinata"),
    ],
    sensei: "Sensei: Kurenai Yūhi",
    senseiRefs: [ref("kurenai-yuhi")],
  },
  {
    name: "Team 10",
    tag: "INO-SHIKA-CHO",
    color: "oklch(0.76 0.1 140)",
    members: [
      ref("shikamaru-nara", "Shikamaru"),
      ref("ino-yamanaka", "Ino"),
      ref("choji-akimichi", "Chōji"),
    ],
    sensei: "Sensei: Asuma Sarutobi",
    senseiRefs: [ref("asuma-sarutobi")],
  },
  {
    name: "Team Guy",
    tag: "TAIJUTSU",
    color: "oklch(0.78 0.11 60)",
    members: [
      ref("neji-hyuga", "Neji"),
      ref("rock-lee", "Lee"),
      ref("tenten", "Tenten"),
    ],
    sensei: "Sensei: Might Guy",
    senseiRefs: [ref("might-guy")],
  },
  {
    name: "Sannin",
    tag: "EFSANE ÜÇLÜ",
    color: "oklch(0.7 0.13 30)",
    members: [ref("jiraiya"), ref("tsunade", "Tsunade"), ref("orochimaru")],
    sensei: "Sensei: Hiruzen Sarutobi · Adı Amegakure'de Hanzō'dan geldi",
    senseiRefs: [ref("hiruzen-sarutobi"), ref("hanzo")],
  },
  {
    name: "Minato'nun Takımı",
    tag: "ÜÇÜNCÜ SAVAŞ",
    color: "oklch(0.8 0.12 90)",
    members: [
      ref("kakashi-hatake", "Kakashi"),
      ref("obito-uchiha", "Obito"),
      ref("rin-nohara", "Rin"),
    ],
    sensei: "Sensei: Minato Namikaze",
    senseiRefs: [ref("minato-namikaze")],
  },
  {
    name: "Taka / Hebi",
    tag: "SASUKE'NİN TAKIMI",
    color: "oklch(0.68 0.14 300)",
    members: [
      ref("sasuke-uchiha", "Sasuke"),
      ref("suigetsu-hozuki", "Suigetsu"),
      ref("karin", "Karin"),
      ref("jugo", "Jūgo"),
    ],
    sensei: "Kuruluş: Sasuke Uchiha",
  },
  {
    name: "Kara",
    tag: "BORUTO DÖNEMİ",
    color: "oklch(0.64 0.16 28)",
    members: [
      ref("jigen"),
      ref("delta"),
      ref("kashin-koji", "Koji"),
      ref("code"),
    ],
    sensei: "Ōtsutsuki kültü",
  },
];

/**
 * Klanlar. `noble` işareti Konoha'nın dört soylu klanı için — Narutopedia
 * Aburame, Akimichi, Hyūga ve Uchiha'yı bu başlık altında sayıyor.
 * `id` amblem anahtarı (`ClanEmblem`) — kullanıcının verdiği referans
 * levhadan stilize SVG çizimler.
 */
export const NARUTO_CLANS: NarutoClan[] = [
  { id: "uchiha", name: "Uchiha", trait: "Sharingan · Ateş", noble: true },
  { id: "senju", name: "Senju", trait: "Ahşap Salım · Yaşam gücü" },
  { id: "uzumaki", name: "Uzumaki", trait: "Fūinjutsu · Uzun ömür" },
  { id: "hyuga", name: "Hyūga", trait: "Byakugan · Yumuşak Yumruk", noble: true },
  { id: "aburame", name: "Aburame", trait: "Kikaichū böcekleri", noble: true },
  { id: "akimichi", name: "Akimichi", trait: "Vücut genişletme", noble: true },
  { id: "nara", name: "Nara", trait: "Gölge kontrolü · Strateji" },
  { id: "yamanaka", name: "Yamanaka", trait: "Zihin transferi" },
  { id: "inuzuka", name: "Inuzuka", trait: "Ninken ortaklığı" },
  { id: "sarutobi", name: "Sarutobi", trait: "Ateş · Maymun sözleşmesi" },
  { id: "hatake", name: "Hatake", trait: "Beyaz Işık Bıçağı · Yıldırım" },
  { id: "shimura", name: "Shimura", trait: "Kök · Fūton" },
  { id: "kaguya", name: "Kaguya", trait: "Buz Salımı · Kemik Salımı" },
  { id: "hozuki", name: "Hōzuki", trait: "Sıvılaşma" },
];

/** Uchiha ve Senju soy hatları — aynı köke çıkan iki dal */
export const NARUTO_UCHIHA_LINE: NarutoFigureRef[] = [
  ref("indra-otsutsuki"),
  ref("madara-uchiha"),
  ref("izuna-uchiha"),
  ref("obito-uchiha"),
  ref("itachi-uchiha"),
  ref("sasuke-uchiha"),
];

export const NARUTO_SENJU_LINE: NarutoFigureRef[] = [
  ref("ashura-otsutsuki"),
  ref("hashirama-senju"),
  ref("tobirama-senju"),
  ref("tsunade"),
  ref("naruto-uzumaki", "Naruto Uzumaki (chakra hattı)"),
];

/**
 * Yedi Hokage. `end` alanı Narutopedia denetiminden sonra eklendi: sıra
 * listesi tek başına "neden değişti" sorusunu cevaplamıyordu.
 */
export const NARUTO_HOKAGE: NarutoHokage[] = [
  {
    ord: "BİRİNCİ",
    name: "Hashirama Senju",
    epithet: "Shinobi Tanrısı",
    end: "Birinci Shinobi Dünya Savaşı sırasında öldü; unvan kardeşine geçti.",
    characterId: NARUTO_PEOPLE["hashirama-senju"].characterId,
  },
  {
    ord: "İKİNCİ",
    name: "Tobirama Senju",
    epithet: "Su ve mühür ustası",
    end: "Aynı savaşta Kinkaku tarafından öldürüldü; ölmeden önce Hiruzen'i seçti.",
    characterId: NARUTO_PEOPLE["tobirama-senju"].characterId,
  },
  {
    ord: "ÜÇÜNCÜ",
    name: "Hiruzen Sarutobi",
    epithet: "Profesör",
    end: "Konoha'nın işgalinde, Orochimaru'yu durdurmak için hayatını verdi.",
    characterId: NARUTO_PEOPLE["hiruzen-sarutobi"].characterId,
  },
  {
    ord: "DÖRDÜNCÜ",
    name: "Minato Namikaze",
    epithet: "Konoha'nın Sarı Şimşeği",
    end: "Kurama'yı yeni doğan oğluna mühürlerken canını verdi.",
    characterId: NARUTO_PEOPLE["minato-namikaze"].characterId,
  },
  {
    ord: "BEŞİNCİ",
    name: "Tsunade Senju",
    epithet: "Efsanevi Sannin",
    end: "Pain'in saldırısında kendini zorlayıp komaya girdi; savaştan sonra çekildi.",
    characterId: NARUTO_PEOPLE.tsunade.characterId,
  },
  {
    ord: "ALTINCI",
    name: "Kakashi Hatake",
    epithet: "Kopyalayan Ninja",
    end: "Dördüncü Savaş sonrası göreve geldi, köyü yeniden kurup görevi devretti.",
    characterId: 85,
  },
  {
    ord: "YEDİNCİ",
    name: "Naruto Uzumaki",
    epithet: "Saklı Yaprağın Kahramanı",
    end: "Görevde.",
    characterId: 17,
  },
];

/**
 * Göreve hiç başlayamayan aday — Narutopedia'nın ayrı başlığı. Sıraya
 * katılmıyor ama listeyi eksik bırakmak tarihi yanlış anlatmak olurdu.
 */
export const NARUTO_HOKAGE_CANDIDATE: NarutoHokage = {
  ord: "ALTINCI ADAY",
  name: "Danzō Shimura",
  epithet: "Karanlık Shinobi",
  end: "Beş Kage Zirvesi'nden kaçtı, Samuray Köprüsü'nde Sasuke'ye yenilip öldü — resmen göreve başlayamadı.",
  characterId: NARUTO_PEOPLE["danzo-shimura"].characterId,
};

/** Diğer dört büyük köyün gölgeleri */
export const NARUTO_OTHER_KAGE: NarutoKage[] = [
  {
    village: "SUNAGAKURE",
    title: "Kazekage",
    people: [ref("rasa"), ref("gaara")],
  },
  {
    village: "KUMOGAKURE",
    title: "Raikage",
    people: [ref("a-raikage", "A"), ref("darui")],
  },
  {
    village: "IWAGAKURE",
    title: "Tsuchikage",
    people: [ref("onoki"), ref("kurotsuchi")],
  },
  {
    village: "KIRIGAKURE",
    title: "Mizukage",
    people: [ref("yagura", "Yagura"), ref("mei-terumi"), ref("chojuro")],
  },
];
