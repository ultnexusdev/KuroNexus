export interface StorySummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Story extends StorySummary {
  content: string;
  universeId?: string | null;
  universe?: { slug: string; name: string } | null;
}

export interface UniverseCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WikiUniverseSummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  categoryId?: string | null;
  category?: { id: string; name: string; slug: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface WikiUniverse extends WikiUniverseSummary {
  stories: StorySummary[];
}

export type WikiCategory =
  | "CHARACTER"
  | "LOCATION"
  | "TERM"
  | "EVENT"
  | "ITEM"
  | "ORGANIZATION"
  | "MAGIC_SYSTEM";

export interface WikiEntrySummary {
  id: string;
  title: string;
  slug: string;
  category: WikiCategory;
  coverImage: string | null;
  spoilerTier: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface WikiEntryDetail extends WikiEntrySummary {
  content: string;
  universeId: string;
  universe?: { slug: string; name: string };
}

export interface AdminWikiEntrySummary extends WikiEntrySummary {
  universe: { id: string; name: string; slug: string };
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
}

export interface LoginResult {
  accessToken: string;
  user: AuthenticatedUser;
}

export interface UploadResult {
  id: string;
  url: string;
}

export interface SportPlayer {
  id: string;
  name: string;
  shirtNumber: number | null;
  position: string;
  nationality: string | null;
  imageUrl: string | null;
  appearances: number;
  goals: number;
  assists: number;
  note: string | null;
  order: number;
  universeId: string;
}

export interface SportLegend {
  id: string;
  name: string;
  era: string | null;
  title: string | null;
  story: string;
  imageUrl: string | null;
  achievements: string | null;
  order: number;
  universeId: string;
}

export interface RaceEvent {
  id: string;
  round: number;
  name: string;
  circuit: string;
  country: string | null;
  raceDate: string | null;
  trackSvgPath: string | null;
  universeId: string;
}

export interface DriverStanding {
  id: string;
  position: number;
  driver: string;
  team: string | null;
  points: number;
  wins: number;
  teamColor: string | null;
  universeId: string;
}

// ---- API-Football (backend cache üzerinden) ----
export interface FootballSquadPlayer {
  id: string;
  name: string;
  age: number | null;
  number: number | null;
  position: string | null;
  photo: string | null;
}

export interface FootballSquad {
  teamId: string;
  players: FootballSquadPlayer[];
}

export interface FootballStatBlock {
  league: string | null;
  leagueLogo: string | null;
  team: string | null;
  appearances: number;
  lineups: number;
  minutes: number;
  position: string | null;
  rating: string | null;
  shotsTotal: number | null;
  shotsOn: number | null;
  goals: number;
  assists: number;
  conceded: number | null;
  saves: number | null;
  passesTotal: number | null;
  passesKey: number | null;
  passAccuracy: number | null;
  cardsYellow: number;
  cardsRed: number;
}

export interface FootballPlayerDetail {
  season: string;
  player: {
    id: string;
    name: string;
    firstname: string | null;
    lastname: string | null;
    age: number | null;
    birthDate: string | null;
    birthCountry: string | null;
    nationality: string | null;
    height: string | null;
    weight: string | null;
    photo: string | null;
  } | null;
  statistics: FootballStatBlock[];
}

// Süper Lig puan tablosu — backend maç sonuçlarından hesaplayıp cache'ler.
// `season` sezon başlangıç yılıdır (2025 = 2025/26).
export interface SuperLigRow {
  position: number;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface SuperLigStandings {
  season: number | null;
  table: SuperLigRow[];
  updatedAt: string | null;
}

export interface NextMatch {
  date: string;
  home: string;
  away: string;
  round: number | string | null;
  league: string;
}

export interface NextMatchResponse {
  match: NextMatch | null;
  updatedAt: string | null;
}

export interface SportBundle {
  players: SportPlayer[];
  legends: SportLegend[];
  races: RaceEvent[];
  standings: DriverStanding[];
}

export interface AmbientTrack {
  id: string;
  title: string;
  audioUrl: string;
  order: number;
  universeId: string;
  createdAt: string;
  updatedAt: string;
  universe?: { name: string; slug: string };
}
