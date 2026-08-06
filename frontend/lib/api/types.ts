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

/**
 * Token bilinçli olarak YOK: giriş yanıtı artık onu gövdede döndürmüyor,
 * yalnızca HttpOnly çereze yazıyor. Arayüzün ihtiyacı olan tek şey kullanıcı.
 */
export interface LoginResult {
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

/** "Nexus'u Keşfet" sayfasının tek yanıtı (`GET /pulse`) */
export interface PulseHall {
  slug: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  universeCount: number;
  /** Kapının altındaki canlı satırın ham değeri (salona göre değişir) */
  line: string | null;
  count: number | null;
}

export interface PulseEntry {
  kind: "FILM" | "DIZI" | "ANIME" | "CHAPTER" | "WIKI";
  title: string;
  subtitle: string | null;
  href: string;
  image: string | null;
  at: string | null;
}

export interface PulseFeatured {
  slug: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  chapterCount: number;
  entryCount: number;
  latestChapter: { title: string; slug: string; at: string | null } | null;
}

export interface PulseUniverse {
  slug: string;
  name: string;
  coverImage: string | null;
  categorySlug: string | null;
  storyCount: number;
}

export interface Pulse {
  featured: PulseFeatured | null;
  halls: PulseHall[];
  recent: PulseEntry[];
  universes: PulseUniverse[];
  totals: {
    universes: number;
    chapters: number;
    films: number;
    animeEpisodes: number;
    wikiEntries: number;
  };
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
  /** Sol sütundaki sahne şeridi (TMDB backdrop yolları) */
  stills: string[];
  originalTitle: string | null;
  releaseDate: string | null;
  originalLanguage: string | null;
  budget: number | null;
  revenue: number | null;
  /** Kendi arşivinden komşular — TMDB önerisi değil */
  neighbours: {
    byDirector: ArchiveMovie[];
    byGenre: ArchiveMovie[];
  };
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

// ---- Salon 02 · Dizi arşivi (film arşivinin bire bir aynısı, kaynak TMDB tv) ----

// Dizide filmden bir durum fazlası var: bir dizi haftalarca "izleniyor"
// halinde kalabilir (film ya izlendi ya sırada)
export type ShowStatus = "WATCHING" | "WATCHED" | "WATCHLIST" | "REWATCH";

/** Bir sezonun arşiv görünümü — ilerleme burada tutulur */
export interface ArchiveShowSeason {
  id: string;
  seasonNumber: number;
  name: string;
  episodes: number | null;
  watchedEpisodes: number;
  isCompleted: boolean;
  personalRating: number | null;
  airDate: string | null;
  posterPath: string | null;
  orderIndex: number;
}

/** Bölüm ızgarasının bir karesi */
export interface SeasonEpisode {
  number: number;
  title: string | null;
  airDate: string | null;
  stillPath: string | null;
  state: "WATCHED" | "SKIPPED" | "UNWATCHED";
}

export interface SeasonEpisodes {
  seasonId: string;
  seasonNumber: number;
  episodes: SeasonEpisode[];
}

export interface ArchiveShow {
  id: string;
  /** Dizi sayfasının adresi — backend başlıktan türetir */
  slug: string;
  tmdbId: number;
  status: ShowStatus;
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
  numberOfSeasons: number | null;
  numberOfEpisodes: number | null;
  genres: string[];
  voteAverage: number | null;
  director: string | null;
  /** TMDB köken ülkeleri — Kore Dramaları rafı `includes("KR")` ile süzer */
  originCountry: string[];
  /** Yapımın kendi durumu ("Ended"/"Returning Series"), benimkinden bağımsız */
  airStatus: string | null;
  /** Sezonlardan türetilen toplam ilerleme */
  watchedEpisodes: number;
  /** Takip edilen sezonların bölüm toplamı (özel bölümler hariç) */
  trackedEpisodes: number;
  /** Şu an hangi sezondayım — "S2 · 4/10" satırı bundan yazılır */
  currentSeason: ArchiveShowSeason | null;
  seasons: ArchiveShowSeason[];
}

export interface ShowArchive {
  shows: ArchiveShow[];
  stats: {
    total: number;
    watchedThisYear: number;
    averageRating: number | null;
    watchlist: number;
  };
  directors: Array<{ name: string; count: number }>;
  genres: string[];
}

export type ShowLinkKind = "TMDB" | "IMDB" | "RT" | "HOMEPAGE";

export interface ShowLink {
  kind: ShowLinkKind;
  url: string;
  isSearch: boolean;
}

export interface ShowCustomLinks {
  rt?: string;
  imdb?: string;
  trailer?: string;
}

export interface ShowCastMember {
  name: string;
  character: string | null;
  profilePath: string | null;
}

export interface ShowProvider {
  name: string;
  logoPath: string | null;
  kind: "FLATRATE" | "RENT" | "BUY";
}

export interface SimilarShow extends TmdbSearchResult {
  inArchive: boolean;
  slug: string | null;
}

export interface ShowDetail {
  show: ArchiveShow;
  tagline: string | null;
  cast: ShowCastMember[];
  trailerKey: string | null;
  providers: ShowProvider[];
  providerLink: string | null;
  links: ShowLink[];
  customLinks: ShowCustomLinks;
  similar: SimilarShow[];
  stills: string[];
  originalTitle: string | null;
  releaseDate: string | null;
  originalLanguage: string | null;
  /** Filmdeki bütçe/hâsılatın yerini alır — TMDB durumu: devam ediyor/bitti */
  airStatus: string | null;
  neighbours: {
    byDirector: ArchiveShow[];
    byGenre: ArchiveShow[];
  };
}

export interface ShowShowcase {
  left: ShowcasePoster | null;
  right: ShowcasePoster | null;
}

export interface ShowEntryRecord {
  id: string;
  tmdbId: number;
  status: ShowStatus;
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
  /** AniList karakter numarası — karakter dosyasının adresi */
  characterId: number;
  name: string;
  nameNative: string | null;
  /** Büyük portre (karakter dizinindeki levhalar) */
  image: string | null;
  /** Küçük portre (anime sayfasındaki 42px yüzler) */
  imageSmall: string | null;
  role: string | null;
  voiceActor: string | null;
  voiceActorImage: string | null;
  favourites: number | null;
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

// ---- Salon 05 · Kitap arşivi ----

export type BookStatus = "READ" | "READING" | "TO_READ" | "ABANDONED";

/**
 * Çeviri durumu. Film/dizi kanadında karşılığı yok: beş kitaplık bir serinin
 * üçü Türkçe çıkmışsa kalan ciltler de arşivde durur, "henüz çevrilmedi"
 * notuyla (kullanıcı kararı).
 */
export type BookTranslation =
  | "TRANSLATED"
  | "UNTRANSLATED"
  | "IN_PROGRESS"
  | "ORIGINAL";

/**
 * Kitap künyesi. Film/dizi/animeden farkı: bütün alanlar **kendi
 * tablomuzdan** gelir, dış kaynağın anlık görüntüsünden değil — Google Books
 * yalnızca kayıt açılırken bunları tohumlar (kullanıcı kararı).
 */
export interface ArchiveBook {
  id: string;
  /** Kitap sayfasının adresi — backend başlıktan türetir */
  slug: string;
  googleId: string | null;
  olKey: string | null;
  /** 1000Kitap sayfa anahtarı — kaynak sayfasıyla eşleşme için, gösterilmez */
  binKitapSlug: string | null;
  isbn13: string | null;
  title: string;
  originalTitle: string | null;
  authors: string[];
  translator: string | null;
  publisher: string | null;
  publishedYear: number | null;
  firstPublishedYear: number | null;
  pageCount: number | null;
  language: string | null;
  coverImage: string | null;
  description: string | null;
  genres: string[];
  seriesName: string | null;
  seriesIndex: number | null;
  status: BookStatus;
  translationState: BookTranslation;
  isFavorite: boolean;
  personalRating: number | null;
  personalNote: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  currentPage: number;
  /** Okuma yüzdesi; sayfa sayısı bilinmiyorsa null (çubuk çizilmez) */
  progress: number | null;
  universeId: string | null;
  /**
   * Tıklanabilir künye. Düz metin alanlarının (`authors`, `publisher`,
   * `seriesName`) yanında duruyor: ilişkisi olan kayıtta bağ kurulur,
   * olmayanda düz metin gösterilir — Google/Open Library'den eklenmiş
   * kitaplar da eksiksiz görünmeye devam etsin.
   */
  credits: BookCredits;
}

export type BookPersonRole = "AUTHOR" | "TRANSLATOR" | "EDITOR";

export interface BookCreditPerson {
  slug: string;
  name: string;
  role: BookPersonRole;
}

export interface BookCredits {
  people: BookCreditPerson[];
  publisher: { slug: string; name: string } | null;
  series: { slug: string; name: string } | null;
}

/** Kişi sayfasındaki ödül satırı — kaynağı kod içi ödül listesi. */
export interface BookPersonAward {
  /** Ödül rafının adresi (`/kitap/oduller/<key>`) */
  key: string;
  name: string;
  year: number;
  /** Ödülü getiren eser; yazara verilen ödülde temsilci eseri, yoksa null */
  title: string | null;
}

/** Yazar / çevirmen sayfası. */
export interface BookPersonPage {
  slug: string;
  name: string;
  photo: string | null;
  biography: string | null;
  roles: BookPersonRole[];
  books: ArchiveBook[];
  /** Ödül listesinde geçtiği yerler; arşivde olmayan yazarın tek bağlamı */
  awards: BookPersonAward[];
  /**
   * Kişinin arşivde ilişkisel kaydı var mı. `false` ise sayfa tamamen
   * kaynaktan çizilmiştir — kitap rafının boş olması bir eksiklik değil.
   */
  inArchive: boolean;
}

/**
 * Seri sayfası (`/kitap/seri/<slug>`). Ciltler sırasıyla ve çevrilmemişler de
 * listede: serinin eksiğini görmek bu sayfanın asıl işi.
 */
export interface BookSeriesPage {
  slug: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  universeSlug: string | null;
  count: number;
  readCount: number;
  translatedCount: number;
  untranslatedCount: number;
  books: ArchiveBook[];
}

export interface BookPublisherPage {
  slug: string;
  name: string;
  books: ArchiveBook[];
}

/** Kaynak künyesindeki kişi; `slug` yalnızca arşivde kaydı varsa dolu. */
export interface SourceBookCredit {
  name: string;
  role: BookPersonRole;
  slug: string | null;
}

/**
 * Arşivde olmayan kitabın künye sayfası (`/kitap/kaynak/<slug>`). Ödül
 * raflarındaki kartlar buraya gidiyor; veri tamamen 1000Kitap'tan, arşive
 * hiçbir kayıt açılmıyor.
 */
export interface SourceBookPage {
  slug: string;
  title: string;
  subtitle: string | null;
  originalTitle: string | null;
  authors: string[];
  translator: string | null;
  editor: string | null;
  publisher: string | null;
  publisherSlug: string | null;
  publishedYear: number | null;
  firstPublishedYear: number | null;
  pageCount: number | null;
  language: string | null;
  isbn13: string | null;
  coverImage: string | null;
  description: string | null;
  genres: string[];
  seriesName: string | null;
  seriesIndex: number | null;
  people: SourceBookCredit[];
  inArchive: boolean;
  archiveSlug: string | null;
}

/**
 * Okuma sırası — bir evreni hangi kitaptan başlayıp nasıl takip etmeli.
 * Liste backend'de kod içi küratörlü; arşiv eşleşmesi canlı hesaplanıyor.
 */
export interface ReadingOrderEntry {
  /** Okuma sırasındaki yeri */
  order: number;
  /** Yayım yılı — okuma sırasıyla kasten uyuşmuyor */
  year: number;
  position: {
    /** "Vakıf Serisi", "Robot Serisi", "Ara Kitap"… */
    track: string;
    /** Seri içindeki cilt sırası; ara kitapta null */
    index: number | null;
  };
  originalTitle: string;
  /** Türkçe yayımlanmış ad(lar); birden çoksa farklı baskılar */
  titles: string[];
  /**
   * 1000Kitap sayfa anahtarı — her biri ölçüldü. Arşivde olmayan durak bu
   * sayede künye sayfasına gidebiliyor ve küratör tek tıkla ekleyebiliyor.
   */
  sourceSlug: string | null;
  inArchive: boolean;
  archiveSlug: string | null;
  coverImage: string | null;
  status: BookStatus | null;
}

export interface ReadingOrderSummary {
  key: string;
  name: string;
  blurb: string;
  author: { name: string; slug: string };
  total: number;
  inArchive: number;
  readCount: number;
  coverImage: string | null;
  /** "1950–1993" — listenin kapsadığı yayım yılları */
  years: string;
  tracks: Array<{ name: string; count: number }>;
}

export interface ReadingOrderDetail extends ReadingOrderSummary {
  notes: string[];
  author: {
    name: string;
    slug: string;
    photo: string | null;
    biography: string | null;
  };
  /** "Buradayım" imi: kaçıncı durak. 0 = im konmamış */
  currentOrder: number;
  entries: ReadingOrderEntry[];
}

/** Bir kitabın geçtiği okuma sırası — kitap sayfasındaki geri bağ. */
export interface BookReadingOrderLink {
  key: string;
  name: string;
  order: number;
  total: number;
}

export interface BookQuote {
  id: string;
  text: string;
  page: number | null;
  context: string | null;
  isFavorite: boolean;
}

export interface BookSeriesCard {
  name: string;
  slug: string;
  count: number;
  readCount: number;
  translatedCount: number;
  untranslatedCount: number;
  coverImage: string | null;
  /** Kadim Dünyalar bağı — evren sayfasının adresi bununla kurulur */
  universeSlug: string | null;
}

export interface BookAuthorCard {
  name: string;
  /**
   * Yazar sayfasının adresi — kişinin arşivde ilişkisel kaydı varsa dolu.
   * Yoksa null ve kart sayfa açmak yerine arşivi o adla süzer.
   */
  slug: string | null;
  /**
   * Yazarın portresi. Kişi sayfası ilk açıldığında kaynaktan inip saklanıyor;
   * hiç açılmamış yazarda null ve kart baş harflerden madalyon çiziyor.
   */
  photo: string | null;
  count: number;
  readCount: number;
  averageRating: number | null;
  coverImage: string | null;
}

export interface BookArchiveStats {
  read: number;
  readThisYear: number;
  toRead: number;
  reading: number;
  abandoned: number;
  favorites: number;
  totalPages: number;
  pagesThisYear: number;
  averageRating: number | null;
  longest: { title: string; pageCount: number } | null;
  shortest: { title: string; pageCount: number } | null;
  topGenre: string | null;
  topAuthor: string | null;
  goal: {
    year: number;
    targetBooks: number;
    targetPages: number | null;
    doneBooks: number;
    donePages: number;
  } | null;
}

export interface BookArchive {
  books: ArchiveBook[];
  stats: BookArchiveStats;
  series: BookSeriesCard[];
  authors: BookAuthorCard[];
  genres: Array<{ name: string; count: number }>;
  recent: ArchiveBook[];
  quoteOfTheDay:
    | (BookQuote & { bookTitle: string; bookSlug: string })
    | null;
}

/**
 * Ödül rafları (Faz B). Liste backend'de kod içi küratörlü; kapak ve kimlik
 * Google eşleşmesinden geliyor ve **gecikmeli dolabiliyor** — `coverImage`
 * ile `googleId` null gelebilir, arayüz boş çerçeve çizer.
 */
export interface AwardWinnerCard {
  year: number;
  title: string;
  author: string;
  /** Eşleşen cilt Türkçeyse onun adı; tahmin DEĞİL, yoksa null */
  titleTr: string | null;
  /** O yıl ödülü paylaşan birden çok kitap var */
  shared: boolean;
  /** Nobel'de yazarın temsilci eseri; kitap ödüllerinde null */
  notableWork: string | null;
  googleId: string | null;
  coverImage: string | null;
  pageCount: number | null;
  inArchive: boolean;
  archiveSlug: string | null;
  /**
   * 1000Kitap künye sayfasının anahtarı. Arşivde olmayan kart bu sayede
   * tıklanabiliyor; eşleşme Google'dan geldiyse null kalır ve kart tıklanmaz.
   */
  sourceSlug: string | null;
  /**
   * Yazar sayfasının adresi. Kitap çevrilmemiş, hatta hiç eşleşmemiş olsa
   * bile dolu geliyor: kişi sayfası arşivde kaydı olmayan yazarı kaynaktan
   * çiziyor (kullanıcı isteği).
   */
  authorSlug: string | null;
}

export interface AwardSummary {
  key: string;
  name: string;
  shortName: string;
  grantedTo: "BOOK" | "AUTHOR";
  /** "1990–2024" gibi; listenin hangi yılları kapsadığı dipnot olarak yazılır */
  coverage: string;
  blurb: string;
  total: number;
  inArchive: number;
  coverImage: string | null;
}

export interface AwardDetail extends AwardSummary {
  winners: AwardWinnerCard[];
  /**
   * Henüz hiç denenmemiş kazanan sayısı. Sayfa bunu görünce kendini
   * tazeliyor: eşleşme arkada dilim dilim doluyor. Sıfırsa tazeleme durur.
   */
  pending: number;
}

export type BookLinkKind =
  | "GOODREADS"
  | "GOOGLE_BOOKS"
  | "OPEN_LIBRARY"
  | "DR"
  | "IDEFIX"
  | "OFFICIAL";

export interface BookLink {
  kind: BookLinkKind;
  url: string;
  /** Adres doğrudan kitaba mı gidiyor yoksa arama sayfasına mı */
  isSearch: boolean;
}

export interface BookCustomLinks {
  goodreads?: string;
  dr?: string;
  idefix?: string;
  official?: string;
}

export interface BookDetail {
  book: ArchiveBook;
  quotes: BookQuote[];
  links: BookLink[];
  customLinks: BookCustomLinks;
  series: ArchiveBook[];
  seriesName: string | null;
  byAuthor: ArchiveBook[];
  byGenre: ArchiveBook[];
  universe: { id: string; name: string; slug: string } | null;
  /** Bu kitap hangi okuma sıralarında, kaçıncı durak olarak geçiyor */
  readingOrders: BookReadingOrderLink[];
}

/** Küratör aramasının bir sonucu — arşivde olanlar işaretli gelir. */
export interface BookSearchResult {
  googleId: string | null;
  olKey: string | null;
  isbn13: string | null;
  title: string;
  subtitle: string | null;
  authors: string[];
  publisher: string | null;
  publishedYear: number | null;
  firstPublishedYear: number | null;
  pageCount: number | null;
  language: string | null;
  coverImage: string | null;
  description: string | null;
  genres: string[];
  seriesName: string | null;
  seriesIndex: number | null;
  originalTitle: string | null;
  provider: "GOOGLE" | "OPENLIBRARY" | "BINKITAP";
  /**
   * 1000Kitap kitap sayfasının anahtarı. Eklerken geri gönderilir; künyenin
   * tamamı (çevirmen, yayınevi, ISBN) ancak o zaman çekilir — arama sonucu
   * yalnızca ad, yazar ve kapak taşıyor.
   */
  binKitapSlug: string | null;
  /**
   * "Ne kadar biliniyor": Open Library'de baskı sayısı, Google'da
   * değerlendirme sayısı, 1000Kitap'ta okunma sayısı. **Sıralamada
   * kullanılmıyor** — ölçümde puanla sıralamanın alakayı bozduğu görüldü;
   * küratöre iki kayıt arasında seçim yaparken ipucu olarak gösteriliyor.
   */
  popularity: number;
  inArchive: boolean;
}

export interface BookEntryRecord {
  id: string;
  title: string;
  authors: string[];
  coverImage: string | null;
  status: BookStatus;
  translationState: BookTranslation;
  isFavorite: boolean;
  personalRating: number | null;
  pageCount: number | null;
  currentPage: number;
  seriesName: string | null;
  seriesIndex: number | null;
  updatedAt: string;
}

export interface BookShowcase {
  left: { title: string; coverImage: string } | null;
  right: { title: string; coverImage: string } | null;
}

export interface ReadingGoalRecord {
  id: string;
  year: number;
  targetBooks: number;
  targetPages: number | null;
}

/* ============================================================
   Karakterler (Salon 04 - anime kadrosu)

   Alan adlarinda bilincli olarak "anilist" gecmiyor: ayni sekli
   ileride TMDB `credits`inden (film/dizi karakterleri) doldurmak
   mumkun olsun. Bilesenler kaynagi bilmiyor.
   ============================================================ */

/** Karakterin gorundugu serilerden biri - arsivimizdeki adresiyle. */
export interface CharacterSeriesRef {
  slug: string;
  title: string;
}

/** MAIN | SUPPORTING | BACKGROUND - AniList rol adlari. */
export type CharacterRole = "MAIN" | "SUPPORTING" | "BACKGROUND";

/** Dizindeki bir kart. */
export interface ArchiveCharacter {
  characterId: number;
  name: string;
  nameNative: string | null;
  image: string | null;
  role: CharacterRole | string | null;
  voiceActor: string | null;
  favourites: number | null;
  series: CharacterSeriesRef[];
}

/**
 * Kucuk karakter kunyesi - yalnizca ad ve portre.
 * Savas ve iliski satirlarinda adi gecen karakterler icin.
 */
export interface CharacterCard {
  characterId: number;
  name: string;
  nameNative: string | null;
  image: string | null;
}

/** Dizin suzgecindeki seri secenegi. */
export interface CharacterSeriesFacet {
  slug: string;
  title: string;
  coverImage: string | null;
  count: number;
}

export interface CharacterIndex {
  characters: ArchiveCharacter[];
  series: CharacterSeriesFacet[];
  stats: { characters: number; series: number; main: number };
}

/**
 * Aciklama metninin bir parcasi. `spoiler` isaretli parca ekranda
 * dokunarak acilan kapinin ardinda durur (AGENTS.md kural 2/5).
 */
export interface CharacterTextSegment {
  text: string;
  spoiler: boolean;
}

/** Kunye tablosunun bir satiri (`__Boy:__ 202 cm` gibi kaynaklardan). */
export interface CharacterTrait {
  label: string;
  value: string;
  spoiler: boolean;
}

/** Karakterin gorundugu yapim; arsivde karsiligi varsa `archiveSlug` dolu. */
export interface CharacterAppearance {
  anilistId: number;
  title: string;
  mediaType: string | null;
  format: string | null;
  seasonYear: number | null;
  coverImage: string | null;
  role: CharacterRole | string | null;
  voiceActor: string | null;
  voiceActorImage: string | null;
  archiveSlug: string | null;
}

export interface CharacterProfile {
  characterId: number;
  name: string;
  nameNative: string | null;
  alternativeNames: string[];
  image: string | null;
  description: CharacterTextSegment[];
  traits: CharacterTrait[];
  gender: string | null;
  age: string | null;
  bloodType: string | null;
  dateOfBirth: {
    year: number | null;
    month: number | null;
    day: number | null;
  } | null;
  favourites: number | null;
  siteUrl: string | null;
  appearances: CharacterAppearance[];
}

export interface CharacterDetail {
  character: CharacterProfile;
  appearances: CharacterAppearance[];
  related: ArchiveCharacter[];
}
