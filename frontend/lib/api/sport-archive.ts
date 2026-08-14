import { apiFetch } from "./client";

/**
 * Salon 06 · Spor Arşivi — okuma istemcisi.
 *
 * Altı uç, altı sayfa. Bire bir eşleşme kasıtlı: bir sayfanın ihtiyacı olan
 * her şey tek istekte geliyor.
 *
 * ── İKİ DİLLİLİK ──────────────────────────────────────────────────────────
 * Çevrilebilir her alan `*Tr` / `*En` çifti hâlinde geliyor. Ön yüz `pick()`
 * ile `en ?? tr` okuyor: İngilizce ziyaretçi boş duvar değil, Türkçe metin
 * görüyor. Bu bilinçli — dile göre ayrı yayın bayrağı ölçülüp reddedildi
 * (ikisi de kapalı doğduğu için lansman günü kanadın tamamı kapalı olurdu).
 */

// ---- İki dilli alan okuyucu ------------------------------------------------

/**
 * Dile göre metin seç. Boş dize de "yok" sayılıyor — yarım çevrilmiş bir
 * kayıtta `titleEn: ""` görünseydi başlık kaybolurdu.
 */
export function pick(
  locale: string,
  tr: string | null | undefined,
  en: string | null | undefined,
): string {
  if (locale === "en") {
    const value = en?.trim();
    if (value) return value;
  }
  return tr?.trim() ?? "";
}

// ---- Ortak parçalar --------------------------------------------------------

export interface SportQuote {
  id: string;
  textTr: string;
  textEn: string | null;
  attribution: string | null;
  contextTr: string | null;
  contextEn: string | null;
  year: number | null;
  isFavorite: boolean;
}

export interface SportImage {
  id: string;
  slot: "HERO" | "PORTRAIT" | "GALLERY" | "TRACK";
  url: string;
  altTr: string | null;
  altEn: string | null;
  captionTr: string | null;
  captionEn: string | null;
  sourceNote: string | null;
}

// ---- Futbol ----------------------------------------------------------------

export interface FootballMatchBrief {
  playedAt: string | null;
  seasonStartYear: number | null;
  stage: string | null;
  homeGoals: number | null;
  awayGoals: number | null;
  homePenalties: number | null;
  awayPenalties: number | null;
  venueName: string | null;
  homeName: string | null;
  awayName: string | null;
}

export interface FootballMoment {
  id: string;
  kind: string;
  year: number;
  titleTr: string;
  titleEn: string | null;
  narrativeTr: string | null;
  narrativeEn: string | null;
  imageUrl: string | null;
  captionTr: string | null;
  captionEn: string | null;
  legend?: { slug: string; name: string } | null;
  match?: FootballMatchBrief | null;
}

export interface FootballEraFigure {
  roleTr: string | null;
  roleEn: string | null;
  noteTr: string | null;
  noteEn: string | null;
  legend: {
    slug: string;
    name: string;
    epithetTr: string | null;
    epithetEn: string | null;
    portraitImage: string | null;
    countryCode: string | null;
  };
}

export interface FootballEra {
  id: string;
  slug: string;
  startYear: number;
  endYear: number | null;
  titleTr: string;
  titleEn: string | null;
  subtitleTr: string | null;
  subtitleEn: string | null;
  narrativeTr: string | null;
  narrativeEn: string | null;
  contextTr: string | null;
  contextEn: string | null;
  personalNoteTr: string | null;
  personalNoteEn: string | null;
  accentColor: string | null;
  moments: FootballMoment[];
  figures: FootballEraFigure[];
  quotes: SportQuote[];
  images: SportImage[];
}

export interface FootballClub {
  id: string;
  slug: string;
  name: string;
  officialName: string | null;
  nicknameTr: string | null;
  nicknameEn: string | null;
  foundedYear: number | null;
  cityName: string | null;
  stadiumName: string | null;
  stadiumCapacity: number | null;
  crestImage: string | null;
  coverImage: string | null;
  taglineTr: string | null;
  taglineEn: string | null;
  narrativeTr: string | null;
  narrativeEn: string | null;
}

export interface FootballLegend {
  id: string;
  slug: string;
  name: string;
  fullName: string | null;
  epithetTr: string | null;
  epithetEn: string | null;
  role: string;
  countryCode: string | null;
  birthYear: number | null;
  deathYear: number | null;
  yearsFrom: number | null;
  yearsTo: number | null;
  shirtNumber: number | null;
  portraitImage: string | null;
  narrativeTr: string | null;
  narrativeEn: string | null;
  contextTr: string | null;
  contextEn: string | null;
  personalNoteTr: string | null;
  personalNoteEn: string | null;
  achievementsTr: string | null;
  achievementsEn: string | null;
  personalRank: number | null;
  club?: { slug: string; name: string; crestImage: string | null } | null;
}

// ---- Formula 1 -------------------------------------------------------------

export interface F1Corner {
  id: string;
  number: number | null;
  name: string | null;
  nicknameTr: string | null;
  nicknameEn: string | null;
  noteTr: string | null;
  noteEn: string | null;
  markerX: number | null;
  markerY: number | null;
}

export interface F1Moment {
  id: string;
  seasonYear: number;
  titleTr: string;
  titleEn: string | null;
  narrativeTr: string | null;
  narrativeEn: string | null;
  driver?: { slug: string; name: string } | null;
  season?: { slug: string; year: number } | null;
}

export interface F1Circuit {
  id: string;
  slug: string;
  name: string;
  officialName: string | null;
  nicknameTr: string | null;
  nicknameEn: string | null;
  countryCode: string | null;
  cityName: string | null;
  firstGrandPrixYear: number | null;
  lengthMeters: number | null;
  cornerCount: number | null;
  drsZones: number | null;
  isClockwise: boolean | null;
  lapRecordTime: string | null;
  lapRecordYear: number | null;
  lapRecordDriver: { slug: string; name: string } | null;
  trackSvgPath: string | null;
  trackSvgViewBox: string | null;
  startLineOffset: number | null;
  narrativeTr: string | null;
  narrativeEn: string | null;
  contextTr: string | null;
  contextEn: string | null;
  personalNoteTr: string | null;
  personalNoteEn: string | null;
  corners: F1Corner[];
}

// ---- Uç yanıtları ----------------------------------------------------------

/**
 * Kronoloji satırı — İKİ DÜNYA TEK ŞERİTTE.
 *
 * Adres burada kurulmuyor: backend slug taşıyor, ön yüz `sportHref` ile
 * çeviriyor. `/spor/...` dizesinin tek kaynağı `lib/sport/routes.ts` olmalı.
 */
export interface SportChronologyEntry {
  year: number;
  world: "football" | "f1";
  kind: string;
  titleTr: string;
  titleEn: string | null;
  /**
   * Kaydın SAHİBİ — kulüp ya da pist adı. "1905 · Kuruluş" kimin kuruluşu
   * olduğunu söylemiyordu; ayrı alan olmasının sebebi ön yüzün onu başlıktan
   * farklı bir tipografiyle yazması ve süzgecin de buradan okuyabilmesi.
   * Eski backend yanıtında YOK olabilir.
   */
  subject?: string | null;
  /**
   * Kartın üstündeki arşiv fotoğrafı şeridi. Boşsa şerit çizilmiyor ve kart
   * kısalıyor — kartlar eksene yaslandığı için farklı yükseklikler tırtıklı
   * bir kenar üretmiyor. Eski backend yanıtında YOK olabilir.
   */
  imageUrl?: string | null;
  clubSlug: string | null;
  eraSlug: string | null;
  circuitSlug: string | null;
}

/**
 * Panteon kartı — iki tablodan (FootballLegend / F1Driver) tek biçime
 * indirgenmiş efsane.
 *
 * ⚠️ PORTRE KÜNYESİ. `portraitLicense` + `portraitAuthor` + `portraitSourceUrl`
 * üçü birden doluysa görselin ALTINDA gösterilmek ZORUNDA (Commons görselleri
 * CC BY / CC BY-SA). Küratörün kendi yüklediği portrede üçü de boş gelir ve
 * künye çizilmez — o görselin sahibi arşivin kendisi.
 */
export interface SportLegendCard {
  world: "football" | "f1";
  slug: string;
  name: string;
  epithetTr: string | null;
  epithetEn: string | null;
  countryCode: string | null;
  /**
   * Ülke kodu boşken bayrağın aranacağı uyruk sözcüğü ("German").
   * Senkronizasyon sürücüye `countryCode` yazmıyor; bu alan o boşluğun
   * yarış kaydından gelen karşılığı. Eski backend yanıtında YOK olabilir.
   */
  nationality?: string | null;
  yearsFrom: number | null;
  yearsTo: number | null;
  personalRank: number | null;
  /** Futbolda kulüp adı, F1'de boş */
  subject: string | null;
  /** F1'de şampiyonluk sayısı, futbolda boş */
  championships: number | null;
  portrait: string | null;
  portraitLicense: string | null;
  portraitAuthor: string | null;
  portraitSourceUrl: string | null;
}

/**
 * ⚠️ `counts` VE ALTINDAKİ HER ŞEY İSTEĞE BAĞLI.
 *
 * Backend ve frontend ayrı servisler ve `main`'e tek push ikisini birden
 * deploy ediyor — yani yeni frontend, eski backend yanıtına bakacağı bir
 * pencere HER ZAMAN var. Alanlar zorunlu yazılsaydı o pencerede sayfa
 * `undefined.worlds` ile çökerdi. İsteğe bağlı yazıldıklarında ise yeni
 * bölümler yalnızca veri geldiğinde çiziliyor — boş oda yasağının tip
 * katmanındaki karşılığı.
 */
export interface SportOverview {
  footballClubs: number;
  f1Circuits: number;

  counts?: {
    worlds: number;
    clubs: number;
    legends: number;
    circuits: number;
    moments: number;
  };
  football?: {
    featuredClub: {
      slug: string;
      name: string;
      foundedYear: number | null;
      cityName: string | null;
      taglineTr: string | null;
      taglineEn: string | null;
      coverImage: string | null;
      /**
       * Kırpmanın odağı ("50% 30%") ve büyütmesi (yüzde). Küratör yazıyor.
       * `null` ise ön yüz dokunmuyor ve CSS varsayılanı geçerli oluyor —
       * yani eski backend'e bakan yeni ön yüz de doğru çalışıyor.
       */
      coverPosition?: string | null;
      coverScale?: number | null;
    } | null;
    featuredLegend: {
      slug: string;
      name: string;
      epithetTr: string | null;
      epithetEn: string | null;
      countryCode: string | null;
      yearsFrom: number | null;
      yearsTo: number | null;
      personalRank: number | null;
      club: { slug: string; name: string } | null;
    } | null;
  };
  f1?: {
    featuredCircuit: {
      slug: string;
      name: string;
      countryCode: string | null;
      cityName: string | null;
      nicknameTr: string | null;
      nicknameEn: string | null;
      lengthMeters: number | null;
      cornerCount: number | null;
      firstGrandPrixYear: number | null;
      coverImage: string | null;
      /**
       * Kırpmanın odağı ("50% 30%") ve büyütmesi (yüzde). Küratör yazıyor.
       * `null` ise ön yüz dokunmuyor ve CSS varsayılanı geçerli oluyor —
       * yani eski backend'e bakan yeni ön yüz de doğru çalışıyor.
       */
      coverPosition?: string | null;
      coverScale?: number | null;
    } | null;
    raceCount: number;
    seasonFrom: number | null;
    seasonTo: number | null;
  };
  legends?: SportLegendCard[];
  chronology?: SportChronologyEntry[];
}

export interface FootballHub {
  featuredClub: FootballClub | null;
  clubs: Array<Pick<FootballClub, "slug" | "name" | "foundedYear" | "crestImage" | "taglineTr" | "taglineEn">>;
  legends: Array<
    Pick<
      FootballLegend,
      "slug" | "name" | "epithetTr" | "epithetEn" | "portraitImage" | "countryCode" | "yearsFrom" | "yearsTo" | "personalRank"
    >
  >;
  moments: Array<{
    year: number;
    titleTr: string;
    titleEn: string | null;
    kind: string;
    era: { slug: string; club: { slug: string } };
  }>;
}

export interface ClubWorld {
  club: FootballClub;
  eras: FootballEra[];
  quotes: SportQuote[];
  images: SportImage[];
}

export interface LegendPage {
  legend: FootballLegend;
  moments: Array<FootballMoment & { era: { slug: string; titleTr: string; titleEn: string | null } }>;
  eraFigures: Array<{
    roleTr: string | null;
    roleEn: string | null;
    noteTr: string | null;
    noteEn: string | null;
    era: { slug: string; titleTr: string; titleEn: string | null; startYear: number; endYear: number | null };
  }>;
  quotes: SportQuote[];
  images: SportImage[];
}

/**
 * Defter satırı — `F1RaceResult`ten TÜRETİLMİŞ, elle yazılmamış.
 * `wins` yalnızca `position: 1` sayıyor; podyum sayısı başka bir şeydir ve
 * başlığın söylediğiyle sorgunun saydığı aynı olmak zorunda.
 */
export interface F1LedgerRow {
  name: string;
  nationality?: string | null;
  wins: number;
  firstYear: number | null;
  lastYear: number | null;
}

export interface F1Hub {
  circuits: Array<
    Pick<
      F1Circuit,
      | "slug"
      | "name"
      | "countryCode"
      | "lengthMeters"
      | "cornerCount"
      | "firstGrandPrixYear"
    > & {
      personalRank: number | null;
      /** Backend'e sonradan eklendi — eski yanıtta YOK olabilir. */
      cityName?: string | null;
      nicknameTr?: string | null;
      nicknameEn?: string | null;
      lapRecordTime?: string | null;
      lapRecordYear?: number | null;
    }
  >;
  /** Backend'e sonradan eklendi — eski yanıtta YOK olabilir (bkz. SportOverview). */
  ledger?: {
    raceCount: number;
    seasonFrom: number | null;
    seasonTo: number | null;
    podiumNameCount: number;
    winners: F1LedgerRow[];
    constructors: F1LedgerRow[];
  };
}

/**
 * Podyum satırı — VERİ katmanı (Jolpica/Ergast'tan senkronize).
 * Portre künyesi ZORUNLU taşınıyor: Commons görsellerinin çoğu CC BY / CC BY-SA
 * ve atıfsız gösterim telif ihlali. Üçü birden dolu değilse görsel çizilmez.
 */
export interface F1RaceResult {
  id: string;
  seasonYear: number;
  position: number;
  raceName: string | null;
  raceDate: string | null;
  driverName: string;
  driverNationality: string | null;
  constructorName: string | null;
  timeText: string | null;
  driver: {
    slug: string;
    photo: string | null;
    portraitLicense: string | null;
    portraitAuthor: string | null;
    portraitSourceUrl: string | null;
  } | null;
}

export interface CircuitPage {
  circuit: F1Circuit;
  moments: F1Moment[];
  quotes: SportQuote[];
  images: SportImage[];
  /** Backend'e sonradan eklendi — eski önbellek yanıtlarında YOK olabilir. */
  results?: F1RaceResult[];
}

// ---- Çağrılar --------------------------------------------------------------
//
// `revalidate: 300` — arşiv kayıtları elle yazılıyor, dakikada bir değişmiyor.
// Kural 4/14 deseni: sayfa render'ında dış API yok, yalnızca kendi backend'imiz.

const opts = { next: { revalidate: 300 } } as const;

export function fetchSportOverview(): Promise<SportOverview> {
  return apiFetch<SportOverview>("/sport-archive/overview", opts);
}

export function fetchFootballHub(): Promise<FootballHub> {
  return apiFetch<FootballHub>("/sport-archive/football", opts);
}

export function fetchClub(slug: string): Promise<ClubWorld> {
  return apiFetch<ClubWorld>(
    `/sport-archive/football/clubs/${encodeURIComponent(slug)}`,
    opts,
  );
}

export function fetchLegend(slug: string): Promise<LegendPage> {
  return apiFetch<LegendPage>(
    `/sport-archive/football/legends/${encodeURIComponent(slug)}`,
    opts,
  );
}

export function fetchF1Hub(): Promise<F1Hub> {
  return apiFetch<F1Hub>("/sport-archive/f1", opts);
}

export function fetchCircuit(slug: string): Promise<CircuitPage> {
  return apiFetch<CircuitPage>(
    `/sport-archive/f1/circuits/${encodeURIComponent(slug)}`,
    opts,
  );
}

// ---- Sürücü sayfası ---------------------------------------------------------

export interface F1Driver {
  id: string;
  slug: string;
  name: string;
  fullName: string | null;
  nicknameTr: string | null;
  nicknameEn: string | null;
  countryCode: string | null;
  birthYear: number | null;
  deathYear: number | null;
  activeFrom: number | null;
  activeTo: number | null;
  permanentNumber: number | null;
  championships: number;
  wins: number;
  poles: number;
  photo: string | null;
  portraitLicense: string | null;
  portraitAuthor: string | null;
  portraitSourceUrl: string | null;
  narrativeTr: string | null;
  narrativeEn: string | null;
  personalNoteTr: string | null;
  personalNoteEn: string | null;
  personalRank: number | null;
}

export interface DriverPage {
  driver: F1Driver;
  results: Array<{
    id: string;
    seasonYear: number;
    position: number;
    raceName: string | null;
    constructorName: string | null;
    timeText: string | null;
    /** Sürücünün `countryCode`u boşken bayrağın türetildiği alan */
    driverNationality: string | null;
    circuit: { slug: string; name: string; countryCode: string | null };
  }>;
  moments: Array<{
    id: string;
    seasonYear: number;
    titleTr: string;
    titleEn: string | null;
    narrativeTr: string | null;
    narrativeEn: string | null;
    circuit: { slug: string; name: string } | null;
  }>;
  lapRecords: Array<{
    slug: string;
    name: string;
    lapRecordTime: string | null;
    lapRecordYear: number | null;
  }>;
  quotes: SportQuote[];
}

export function fetchDriver(slug: string): Promise<DriverPage> {
  return apiFetch<DriverPage>(
    `/sport-archive/f1/drivers/${encodeURIComponent(slug)}`,
    opts,
  );
}
