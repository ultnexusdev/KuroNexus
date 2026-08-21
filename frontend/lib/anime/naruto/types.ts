/**
 * Naruto Evreni sayfasının veri iskeleti.
 *
 * Akatsuki sergisinin (`lib/anime/akatsuki.ts`) kardeşi ve aynı sözleşmede:
 * YAPI ve kimlikler kodda, görseller veritabanında (`CharacterImage`),
 * özel adlar/kanji burada durur.
 *
 * ⚠️ Akatsuki'den bir fark var ve bilinçli: oradaki bütün görünür metin
 * i18n'e taşınmıştı. Burada anlatı metinleri veriyle BİRLİKTE duruyor —
 * çünkü bu bir ansiklopedi gövdesi (11 dönem, 9 bijuu, 8 dōjutsu, 13 klan…)
 * ve her cümleyi iki dilde ayrı anahtara bölmek kaydı okunamaz hale
 * getiriyordu. Sayfa çerçevesi (başlıklar, etiketler) i18n'de; kayıtların
 * kendi anlatısı burada. İngilizce çeviri istenirse bu dosyanın yanına
 * `data.en.ts` gelir, tip aynı kalır.
 */

/** Beş büyük ulus + yan köyler — haritadaki iğne ve künye */
export interface NarutoNation {
  id: string;
  /** Kanji + ülke adı, künye satırı */
  code: string;
  country: string;
  village: string;
  villageEn: string;
  kage: string;
  clans: string;
  places: string;
  note: string;
  /** Harita üzerindeki konum (yüzde) */
  x: string;
  y: string;
  accent: string;
  dot: string;
}

export interface NarutoVillage {
  name: string;
  en: string;
  kanji: string;
  tint: string;
}

export interface NarutoMinorVillage {
  name: string;
  tag: string;
  color: string;
}

export interface NarutoPlace {
  region: string;
  name: string;
  desc: string;
}

/** Efsane kadrosu — kart açılışında künye */
export interface NarutoLegend {
  no: string;
  name: string;
  title: string;
  power: string;
  accent: string;
  glow: string;
  /** AniList karakter numarası — küratör portresi buraya bağlanır */
  characterId?: number;
}

export interface NarutoTeam {
  name: string;
  tag: string;
  color: string;
  members: string[];
  sensei: string;
}

export interface NarutoClan {
  name: string;
  trait: string;
  /** Konoha'nın dört soylu klanı (Fandom: Aburame, Akimichi, Hyūga, Uchiha) */
  noble?: boolean;
}

export interface NarutoElement {
  id: string;
  tr: string;
  en: string;
  kanji: string;
  release: string;
  bar: string;
  desc: string;
  users: string[];
  jutsu: string[];
}

export interface NarutoEye {
  id: string;
  name: string;
  owner: string;
  iris: string;
  mid: string;
  desc: string;
}

export interface NarutoJutsu {
  rank: string;
  name: string;
  desc: string;
  color: string;
}

export interface NarutoBijuu {
  n: number;
  tails: string;
  name: string;
  jin: string;
  power: string;
  desc: string;
}

export interface NarutoHokage {
  ord: string;
  name: string;
  epithet: string;
  /** Görevin nasıl bittiği — Fandom denetimi sonrası eklendi */
  end: string;
  characterId?: number;
}

export interface NarutoKage {
  village: string;
  title: string;
  names: string;
}

export interface NarutoEra {
  name: string;
  desc: string;
  figures: string[];
}

export interface NarutoBattle {
  place: string;
  title: string;
  note: string;
  left: string;
  right: string;
}

export interface NarutoRank {
  lvl: string;
  name: string;
  note: string;
  bar: string;
}

export interface NarutoMission {
  letter: string;
  desc: string;
  bar: string;
}

export interface NarutoArchive {
  seal: string;
  name: string;
  desc: string;
}
