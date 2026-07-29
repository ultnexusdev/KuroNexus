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
  // El yazması ağacındaki bölüm sırası (atölye sürükle-bırak ile yazar)
  orderIndex: number;
  universeId?: string | null;
}

export interface Story extends StorySummary {
  content: string;
  universe?: { slug: string; name: string } | null;
  // Yalnızca yayınlanmış bölümün genel ucunda dolu gelir
  entries?: StoryLoreEntry[];
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
  // Metinde adı geçtiğinde tanınsın diye takma adlar
  aliases: string[];
  createdAt: string;
  updatedAt: string;
}

// Okuma ekranındaki künye paneli — bölümle birlikte tek istekte gelir
export interface StoryLoreEntry {
  id: string;
  title: string;
  slug: string;
  category: WikiCategory;
  coverImage: string | null;
  spoilerTier: number | null;
  excerpt: string;
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

// Oyuncu künyesi — Transfermarkt kaydından. Sezon istatistiği YOK: TM veri
// setindeki maç tablosu (TmGame) senkronize edilmiyor, o gelene kadar sayfa
// yalnızca elimizdeki gerçek veriyi gösterir.
export interface FootballPlayerDetail {
  player: {
    id: string;
    name: string;
    firstname: string | null;
    lastname: string | null;
    age: number | null;
    birthDate: string | null;
    heightInCm: number | null;
    foot: string | null;
    position: string | null;
    marketValueInEur: number | null;
    clubName: string | null;
    photo: string | null;
    tmUrl: string | null;
  } | null;
}

// Transfer haberi — künye alanları (fotoğraf/mevki/piyasa değeri/yaş) haberin
// içine kopyalanmaz, backend TM tablosundan okuyup `player` olarak döner.
// TM kaydı varsa alanlar oradan; yoksa elle girilen künye (`facts` serbest
// metin, ör. "Santrfor · 24 yaş · 12 M €"). `id` yalnızca TM oyuncularında var.
export interface TransferNewsPlayer {
  id: string | null;
  name: string;
  position: string | null;
  photo: string | null;
  marketValueInEur: number | null;
  age: number | null;
  facts: string | null;
}

export interface TransferNewsItem {
  id: string;
  title: string;
  body: string; // sanitize edilmiş HTML
  sourceUrl: string | null;
  publishedAt: string;
  universeId: string;
  tmPlayerId: string | null;
  player: TransferNewsPlayer | null;
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

// ---- Salon 02 · Film arşivi ----

export type MovieStatus = "WATCHED" | "WATCHLIST" | "REWATCH";

// Kişisel alanlar bizim, künye alanları TMDB anlık görüntüsünden gelir
export interface ArchiveMovie {
  id: string;
  /** Film sayfasının adresi — backend başlıktan türetir */
  slug: string;
  tmdbId: number;
  status: MovieStatus;
  isFavorite: boolean;
  personalRating: number | null;
  personalNote: string | null;
  watchedAt: string | null;
  title: string;
  overview: string | null;
  posterPath: string | null;
  backdropPath: string | null;
  releaseYear: number | null;
  runtime: number | null;
  genres: string[];
  voteAverage: number | null;
  director: string | null;
}

export interface MovieArchive {
  movies: ArchiveMovie[];
  stats: {
    total: number;
    watchedThisYear: number;
    averageRating: number | null;
    watchlist: number;
  };
  directors: Array<{ name: string; count: number }>;
  genres: string[];
}

/** Film sayfasının bağlantı kartları */
export type MovieLinkKind = "TMDB" | "IMDB" | "RT" | "HOMEPAGE";

export interface MovieLink {
  kind: MovieLinkKind;
  url: string;
  /** Doğrudan filme değil arama sayfasına gidiyorsa true (Rotten Tomatoes) */
  isSearch: boolean;
}

/** Yalnızca küratörün elle girdiği adresler (form bunları doldurur) */
export interface MovieCustomLinks {
  rt?: string;
  imdb?: string;
  trailer?: string;
}

export interface MovieCastMember {
  name: string;
  character: string | null;
  profilePath: string | null;
}

export interface MovieProvider {
  name: string;
  logoPath: string | null;
  kind: "FLATRATE" | "RENT" | "BUY";
}

export interface SimilarMovie extends TmdbSearchResult {
  /** Arşivde var mı — varsa kart doğrudan o filmin sayfasına gider */
  inArchive: boolean;
  slug: string | null;
}

export interface MovieDetail {
  movie: ArchiveMovie;
  tagline: string | null;
  cast: MovieCastMember[];
  trailerKey: string | null;
  providers: MovieProvider[];
  providerLink: string | null;
  links: MovieLink[];
  customLinks: MovieCustomLinks;
  similar: SimilarMovie[];
}

export interface ShowcasePoster {
  title: string;
  posterPath: string;
}

export interface MovieShowcase {
  left: ShowcasePoster | null;
  right: ShowcasePoster | null;
}

export interface MovieEntryRecord {
  id: string;
  tmdbId: number;
  status: MovieStatus;
  isFavorite: boolean;
  personalRating: number | null;
  personalNote: string | null;
  watchedAt: string | null;
  externalData: {
    title?: string;
    posterPath?: string | null;
    releaseDate?: string | null;
  } | null;
  updatedAt: string;
}

export interface TmdbSearchResult {
  tmdbId: number;
  title: string;
  releaseDate: string | null;
  posterPath: string | null;
  voteAverage: number | null;
  overview: string | null;
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

// ---- Salon 04 · Anime arşivi ----

/** Benim durumum. Yapımın kendi yayın durumu ayrı eksen (`AiringState`). */
export type AnimeWatchStatus =
  | "WATCHING"
  | "COMPLETED"
  | "PLANNED"
  | "ON_HOLD"
  | "DROPPED"
  | "REWATCHING";

/** Yapımın durumu — AniList'ten türetilir, ben işaretlemem. */
export type AiringState =
  | "RELEASING"
  | "UPCOMING"
  | "FINISHED"
  | "HIATUS"
  | "CANCELLED";

/** Serinin bir parçası: sezon, film, OVA. İlerleme burada tutulur. */
export interface ArchiveAnimePart {
  id: string;
  anilistId: number;
  malId: number | null;
  title: string;
  format: string | null;
  airingStatus: string | null;
  episodes: number | null;
  watchedEpisodes: number;
  isCompleted: boolean;
  personalRating: number | null;
  seasonYear: number | null;
  coverImage: string | null;
  orderIndex: number;
  nextEpisode: number | null;
  nextAiringAt: number | null;
  mangaChapter: number | null;
}

export interface ArchiveAnime {
  id: string;
  /** Anime sayfasının adresi — backend başlıktan türetir */
  slug: string;
  anilistId: number;
  malId: number | null;
  status: AnimeWatchStatus;
  isFavorite: boolean;
  personalRating: number | null;
  personalNote: string | null;
  title: string;
  titleNative: string | null;
  description: string | null;
  coverImage: string | null;
  bannerImage: string | null;
  /** Yalnızca küratörün seçtiği banner; boşsa AniList'ten geleni gösteriliyor */
  customBanner: string | null;
  genres: string[];
  tags: string[];
  averageScore: number | null;
  startYear: number | null;
  airingState: AiringState;
  totalEpisodes: number | null;
  watchedEpisodes: number;
  currentPart: ArchiveAnimePart | null;
  nextEpisode: number | null;
  nextAiringAt: number | null;
  parts: ArchiveAnimePart[];
  manga: {
    anilistId: number;
    title: string;
    chapters: number | null;
    volumes: number | null;
    status: string | null;
  } | null;
  links: AnimeLink[];
  customLinks: AnimeCustomLinks;
}

/** Anime sayfasının altındaki küçük bağlantı kartları */
export type AnimeLinkKind =
  | "MANGA"
  | "TRAILER"
  | "OPENING"
  | "ENDING"
  | "OFFICIAL"
  | "ANILIST"
  | "MAL";

export interface AnimeLink {
  kind: AnimeLinkKind;
  url: string;
}

/** Yalnızca küratörün elle girdiği adresler (form bunları doldurur) */
export interface AnimeCustomLinks {
  manga?: string;
  trailer?: string;
  opening?: string;
  ending?: string;
  official?: string;
}

export interface AnimeArchive {
  entries: ArchiveAnime[];
  stats: {
    series: number;
    watching: number;
    completedSeries: number;
    watchedEpisodes: number;
    topTag: string | null;
  };
  genres: string[];
  tags: string[];
}

export interface AnilistSearchResult {
  anilistId: number;
  title: string;
  format: string | null;
  status: string | null;
  episodes: number | null;
  seasonYear: number | null;
  coverImage: string | null;
  averageScore: number | null;
}

export interface AnimeCharacter {
  name: string;
  image: string | null;
  role: string | null;
  voiceActor: string | null;
  voiceActorImage: string | null;
}

export interface AnimeDetail {
  anime: ArchiveAnime;
  characters: AnimeCharacter[];
}

/** Bölüm ızgarasının bir karesi. `filler`/`recap` Jikan'dan, `state` bizden. */
export interface PartEpisode {
  number: number;
  title: string | null;
  filler: boolean;
  recap: boolean;
  state: "WATCHED" | "SKIPPED" | "UNWATCHED";
}

export interface PartEpisodes {
  episodes: PartEpisode[];
  fillerCount: number;
  /** Jikan'dan liste gelmediyse false — ızgara çizilir ama filler bilinmez */
  hasSourceData: boolean;
}

/** Anime salonu girişinin iki yanındaki afişler (film lobisiyle aynı desen) */
export interface AnimeShowcase {
  left: { title: string; posterPath: string } | null;
  right: { title: string; posterPath: string } | null;
}
