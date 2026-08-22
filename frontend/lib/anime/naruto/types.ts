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

/**
 * Kadro kaydındaki bir kişi. Portresi `CharacterImage` tablosunda
 * `PORTRAIT` yuvasında, `characterId` (AniList numarası) adresinde durur —
 * efsane kartı, takım çipi, chakra kullanıcısı, dönem figürü hepsi AYNI
 * kaydı okur: portre bir kez yüklenir, her yerde görünür.
 */
export interface NarutoPerson {
  name: string;
  /** AniList karakter numarası — PORTRAIT yuvasının adresi */
  characterId: number;
}

/**
 * Kişi/klan çipi: `label` ekranda görünen metin (eski serbest metinlerle
 * birebir aynı kalabilsin diye ayrı), `person` kadro kaydına, `clan` klan
 * amblemine bağlar. İkisi de yoksa çip harfle çizilir — kayıt dışı adlar
 * (Shinju, Ten-Tails) sayfayı kırmaz.
 */
export interface NarutoFigureRef {
  label: string;
  person?: string;
  clan?: string;
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
  members: NarutoFigureRef[];
  sensei: string;
  /** Sensei satırındaki adların kadro bağları — küçük portreler */
  senseiRefs?: NarutoFigureRef[];
}

export interface NarutoClan {
  /** Amblem anahtarı (`ClanEmblem` bileşeni bu kimlikle çizer) */
  id: string;
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
  users: NarutoFigureRef[];
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
  people: NarutoFigureRef[];
}

export interface NarutoEra {
  name: string;
  desc: string;
  figures: NarutoFigureRef[];
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
  /** Rütbenin mühür kanjisi — merdiven görünümündeki fırça işareti */
  kanji: string;
  /** Yol üzerindeki konum (0-100) — merdiven çubuğunun doluluk yüzdesi */
  climb: number;
}

export interface NarutoMission {
  letter: string;
  desc: string;
  bar: string;
  /** Görevin risk yüzdesi (0-100) — derece kartındaki ölçek çubuğu */
  risk: number;
}

export interface NarutoArchive {
  seal: string;
  name: string;
  desc: string;
}
