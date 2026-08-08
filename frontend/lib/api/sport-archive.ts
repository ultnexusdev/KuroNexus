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

export interface SportOverview {
  footballClubs: number;
  f1Circuits: number;
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

export interface F1Hub {
  circuits: Array<
    Pick<F1Circuit, "slug" | "name" | "countryCode" | "lengthMeters" | "cornerCount" | "firstGrandPrixYear"> & {
      personalRank: number | null;
    }
  >;
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
