import { AKATSUKI_IDS } from "@/lib/anime/akatsuki";
import type {
  NarutoClan,
  NarutoHokage,
  NarutoKage,
  NarutoLegend,
  NarutoTeam,
} from "./types";

/**
 * Naruto Evreni — insan kaydı (efsaneler, takımlar, klanlar, Kage'ler).
 *
 * Hokage sırası ve görevlerin nasıl bittiği Narutopedia'nın Türkçe Hokage
 * maddesinden denetlendi; cümleler yeniden yazıldı. `characterId` alanı
 * dolu olan kayıtlara küratör portre bağlayabilir — boşsa bölüm portresiz,
 * yalnızca künyeyle çizilir (boş oda yasağı: olmayan görsel için yer
 * açılmaz).
 */

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

export const NARUTO_TEAMS: NarutoTeam[] = [
  {
    name: "Team 7",
    tag: "KAKASHI HAN",
    color: "#e6b84c",
    members: ["Naruto", "Sasuke", "Sakura"],
    sensei: "Sensei: Kakashi Hatake · Sonradan: Sai, Yamato",
  },
  {
    name: "Team 8",
    tag: "TAKİP TAKIMI",
    color: "oklch(0.72 0.1 220)",
    members: ["Kiba", "Shino", "Hinata"],
    sensei: "Sensei: Kurenai Yūhi",
  },
  {
    name: "Team 10",
    tag: "INO-SHIKA-CHO",
    color: "oklch(0.76 0.1 140)",
    members: ["Shikamaru", "Ino", "Chōji"],
    sensei: "Sensei: Asuma Sarutobi",
  },
  {
    name: "Team Guy",
    tag: "TAIJUTSU",
    color: "oklch(0.78 0.11 60)",
    members: ["Neji", "Lee", "Tenten"],
    sensei: "Sensei: Might Guy",
  },
  {
    name: "Sannin",
    tag: "EFSANE ÜÇLÜ",
    color: "oklch(0.7 0.13 30)",
    members: ["Jiraiya", "Tsunade", "Orochimaru"],
    sensei: "Sensei: Hiruzen Sarutobi · Adı Amegakure'de Hanzō'dan geldi",
  },
  {
    name: "Minato'nun Takımı",
    tag: "ÜÇÜNCÜ SAVAŞ",
    color: "oklch(0.8 0.12 90)",
    members: ["Kakashi", "Obito", "Rin"],
    sensei: "Sensei: Minato Namikaze",
  },
  {
    name: "Taka / Hebi",
    tag: "SASUKE'NİN TAKIMI",
    color: "oklch(0.68 0.14 300)",
    members: ["Sasuke", "Suigetsu", "Karin", "Jūgo"],
    sensei: "Kuruluş: Sasuke Uchiha",
  },
  {
    name: "Kara",
    tag: "BORUTO DÖNEMİ",
    color: "oklch(0.64 0.16 28)",
    members: ["Jigen", "Delta", "Koji", "Code"],
    sensei: "Ōtsutsuki kültü",
  },
];

/**
 * Klanlar. `noble` işareti Konoha'nın dört soylu klanı için — Narutopedia
 * Aburame, Akimichi, Hyūga ve Uchiha'yı bu başlık altında sayıyor.
 */
export const NARUTO_CLANS: NarutoClan[] = [
  { name: "Uchiha", trait: "Sharingan · Ateş", noble: true },
  { name: "Senju", trait: "Ahşap Salım · Yaşam gücü" },
  { name: "Uzumaki", trait: "Fūinjutsu · Uzun ömür" },
  { name: "Hyūga", trait: "Byakugan · Yumuşak Yumruk", noble: true },
  { name: "Aburame", trait: "Kikaichū böcekleri", noble: true },
  { name: "Akimichi", trait: "Vücut genişletme", noble: true },
  { name: "Nara", trait: "Gölge kontrolü · Strateji" },
  { name: "Yamanaka", trait: "Zihin transferi" },
  { name: "Inuzuka", trait: "Ninken ortaklığı" },
  { name: "Sarutobi", trait: "Ateş · Maymun sözleşmesi" },
  { name: "Hatake", trait: "Beyaz Işık Bıçağı · Yıldırım" },
  { name: "Shimura", trait: "Kök · Fūton" },
  { name: "Kaguya", trait: "Buz Salımı · Kemik Salımı" },
  { name: "Hōzuki", trait: "Sıvılaşma" },
];

/** Uchiha ve Senju soy hatları — aynı köke çıkan iki dal */
export const NARUTO_UCHIHA_LINE = [
  "Indra Ōtsutsuki",
  "Madara Uchiha",
  "Izuna Uchiha",
  "Obito Uchiha",
  "Itachi Uchiha",
  "Sasuke Uchiha",
];

export const NARUTO_SENJU_LINE = [
  "Ashura Ōtsutsuki",
  "Hashirama Senju",
  "Tobirama Senju",
  "Tsunade Senju",
  "Naruto Uzumaki (chakra hattı)",
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
  },
  {
    ord: "İKİNCİ",
    name: "Tobirama Senju",
    epithet: "Su ve mühür ustası",
    end: "Aynı savaşta Kinkaku tarafından öldürüldü; ölmeden önce Hiruzen'i seçti.",
  },
  {
    ord: "ÜÇÜNCÜ",
    name: "Hiruzen Sarutobi",
    epithet: "Profesör",
    end: "Konoha'nın işgalinde, Orochimaru'yu durdurmak için hayatını verdi.",
  },
  {
    ord: "DÖRDÜNCÜ",
    name: "Minato Namikaze",
    epithet: "Konoha'nın Sarı Şimşeği",
    end: "Kurama'yı yeni doğan oğluna mühürlerken canını verdi.",
  },
  {
    ord: "BEŞİNCİ",
    name: "Tsunade Senju",
    epithet: "Efsanevi Sannin",
    end: "Pain'in saldırısında kendini zorlayıp komaya girdi; savaştan sonra çekildi.",
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
export const NARUTO_HOKAGE_CANDIDATE = {
  ord: "ALTINCI ADAY",
  name: "Danzō Shimura",
  epithet: "Karanlık Shinobi",
  end: "Beş Kage Zirvesi'nden kaçtı, Samuray Köprüsü'nde Sasuke'ye yenilip öldü — resmen göreve başlayamadı.",
};

/** Diğer dört büyük köyün gölgeleri */
export const NARUTO_OTHER_KAGE: NarutoKage[] = [
  { village: "SUNAGAKURE", title: "Kazekage", names: "Rasa · Gaara" },
  { village: "KUMOGAKURE", title: "Raikage", names: "A · Darui" },
  { village: "IWAGAKURE", title: "Tsuchikage", names: "Ōnoki · Kurotsuchi" },
  { village: "KIRIGAKURE", title: "Mizukage", names: "Yagura · Mei Terumī · Chōjūrō" },
];
