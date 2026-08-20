import { apiFetch, apiFetchUrl, ApiError } from "../api/client";
import type {
  AdminWikiEntrySummary,
  AmbientTrack,
  AnilistSearchResult,
  AnimeCustomLinks,
  AnimeWatchStatus,
  AuthenticatedUser,
  BookCustomLinks,
  BookEntryRecord,
  BookQuote,
  BookSearchResult,
  BookStatus,
  BookTranslation,
  LoginResult,
  ReadingGoalRecord,
  MovieCustomLinks,
  MovieEntryRecord,
  MovieStatus,
  ShowCustomLinks,
  ShowEntryRecord,
  ShowStatus,
  Story,
  StorySummary,
  TmdbSearchResult,
  TransferNewsItem,
  TransferNewsPlayer,
  UploadResult,
  WikiCategory,
  WikiEntryDetail,
  WikiUniverseSummary,
  UniverseCategory,
} from "../api/types";

/**
 * Kimlik artık isteklere elle eklenmiyor.
 *
 * Token HttpOnly çerezde duruyor ve tarayıcı onu her isteğe kendisi ekliyor
 * (`apiFetch` içindeki `credentials: "include"`). JavaScript çerezi okuyamadığı
 * için zaten `Authorization` başlığı kuramaz — eski `authHeaders()` yardımcısı
 * ve `document.cookie` erişimi bu yüzden tamamen kaldırıldı.
 */
export function login(email: string, password: string): Promise<LoginResult> {
  return apiFetch<LoginResult>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

/** Çerezi sunucu yazdı, silmesi de onun işi. */
export function logout(): Promise<void> {
  return apiFetch<void>("/auth/logout", { method: "POST" });
}

export function fetchMe(): Promise<AuthenticatedUser> {
  return apiFetch<AuthenticatedUser>("/auth/me");
}

// universeId verilirse liste el yazması sırasına (orderIndex) göre döner
export function fetchAdminStories(
  universeId?: string,
): Promise<StorySummary[]> {
  const query = universeId
    ? `?universeId=${encodeURIComponent(universeId)}`
    : "";
  return apiFetch<StorySummary[]>(`/admin/stories${query}`);
}

export function fetchAdminStory(id: string): Promise<Story> {
  return apiFetch<Story>(`/admin/stories/${id}`);
}

export interface StoryInput {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  universeId?: string;
  isPublished?: boolean;
  orderIndex?: number;
}

export function createStory(input: StoryInput): Promise<Story> {
  return apiFetch<Story>("/admin/stories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function updateStory(
  id: string,
  input: Partial<StoryInput>,
): Promise<Story> {
  return apiFetch<Story>(`/admin/stories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

// Bölüm sırası: dizideki konum orderIndex olur (1'den başlar)
export function reorderStories(ids: string[]): Promise<{ updated: number }> {
  return apiFetch<{ updated: number }>("/admin/stories/reorder", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
}

export function deleteStory(id: string): Promise<Story> {
  return apiFetch<Story>(`/admin/stories/${id}`, {
    method: "DELETE",
  });
}

export interface UniverseInput {
  name: string;
  description?: string;
  coverImage?: string;
  categoryId?: string | null;
}

export function fetchAdminUniverses(): Promise<WikiUniverseSummary[]> {
  return apiFetch<WikiUniverseSummary[]>("/admin/universes");
}

export function fetchAdminUniverse(id: string): Promise<WikiUniverseSummary> {
  return apiFetch<WikiUniverseSummary>(`/admin/universes/${id}`);
}

export function createUniverse(
  input: UniverseInput,
): Promise<WikiUniverseSummary> {
  return apiFetch<WikiUniverseSummary>("/admin/universes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function updateUniverse(
  id: string,
  input: Partial<UniverseInput>,
): Promise<WikiUniverseSummary> {
  return apiFetch<WikiUniverseSummary>(`/admin/universes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function deleteUniverse(id: string): Promise<WikiUniverseSummary> {
  return apiFetch<WikiUniverseSummary>(`/admin/universes/${id}`, {
    method: "DELETE",
  });
}

export interface WikiEntryInput {
  title: string;
  content: string;
  category: WikiCategory;
  universeId: string;
  coverImage?: string;
  spoilerTier?: number;
  aliases?: string[];
}

export function fetchAdminWikiEntries(
  universeId?: string,
): Promise<AdminWikiEntrySummary[]> {
  const query = universeId
    ? `?universeId=${encodeURIComponent(universeId)}`
    : "";
  return apiFetch<AdminWikiEntrySummary[]>(`/admin/wiki-entries${query}`);
}

export function fetchAdminWikiEntry(id: string): Promise<WikiEntryDetail> {
  return apiFetch<WikiEntryDetail>(`/admin/wiki-entries/${id}`);
}

export function createWikiEntry(
  input: WikiEntryInput,
): Promise<WikiEntryDetail> {
  return apiFetch<WikiEntryDetail>("/admin/wiki-entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function updateWikiEntry(
  id: string,
  input: Partial<WikiEntryInput>,
): Promise<WikiEntryDetail> {
  return apiFetch<WikiEntryDetail>(`/admin/wiki-entries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function deleteWikiEntry(id: string): Promise<WikiEntryDetail> {
  return apiFetch<WikiEntryDetail>(`/admin/wiki-entries/${id}`, {
    method: "DELETE",
  });
}

export interface AmbientTrackInput {
  title: string;
  universeId: string;
  audioUrl: string;
  order?: number;
}

export function fetchAdminAmbientTracks(): Promise<AmbientTrack[]> {
  return apiFetch<AmbientTrack[]>("/ambient-tracks");
}

export function createAmbientTrack(
  input: AmbientTrackInput,
): Promise<AmbientTrack> {
  return apiFetch<AmbientTrack>("/ambient-tracks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function updateAmbientTrack(
  id: string,
  input: { title?: string; universeId?: string },
): Promise<AmbientTrack> {
  return apiFetch<AmbientTrack>(`/admin/ambient-tracks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

// ---- Kadro düzeltmeleri ----
// TM veri seti transferleri geç yansıtıyor; ayrılanlar gizlenir, yeni
// transferler elle eklenir. Sync bunları ezmez.

export interface SquadOverride {
  id: string;
  teamId: string;
  tmPlayerId: string | null;
  name: string | null;
  position: string | null;
  age: number | null;
  photo: string | null;
}

export function fetchSquadOverrides(): Promise<SquadOverride[]> {
  return apiFetch<SquadOverride[]>("/admin/football/squad-overrides");
}

export function createSquadOverride(input: {
  tmPlayerId?: string;
  name?: string;
  position?: string;
  age?: number;
  photo?: string;
}): Promise<SquadOverride> {
  return apiFetch<SquadOverride>("/admin/football/squad-overrides", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function deleteSquadOverride(id: string): Promise<void> {
  return apiFetch<void>(`/admin/football/squad-overrides/${id}`, {
    method: "DELETE",
  });
}

// ---- Transfer haberleri ----

export interface TransferNewsInput {
  title: string;
  body: string;
  universeId: string;
  tmPlayerId?: string;
  // Kulüpte olmayan oyuncu (transfer hedefi) — TM kadrosunda bulunmaz
  manualPlayerName?: string;
  manualPlayerPhoto?: string;
  manualPlayerFacts?: string;
  sourceUrl?: string;
  publishedAt?: string;
}

export function fetchAdminTransferNews(
  universeId?: string,
): Promise<TransferNewsItem[]> {
  const qs = universeId
    ? `?universeId=${encodeURIComponent(universeId)}`
    : "";
  return apiFetch<TransferNewsItem[]>(`/transfer-news${qs}`);
}

// Haber formundaki oyuncu seçici — yerel TM kadrosundan
export function searchTransferNewsPlayers(
  query?: string,
): Promise<TransferNewsPlayer[]> {
  const qs = query ? `?q=${encodeURIComponent(query)}` : "";
  return apiFetch<TransferNewsPlayer[]>(`/transfer-news/players${qs}`);
}

export function createTransferNews(
  input: TransferNewsInput,
): Promise<TransferNewsItem> {
  return apiFetch<TransferNewsItem>("/transfer-news", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function deleteTransferNews(id: string): Promise<void> {
  return apiFetch<void>(`/transfer-news/${id}`, {
    method: "DELETE",
  });
}

// ---- Salon 02 · Film arşivi ----

export interface MovieEntryInput {
  tmdbId: number;
  status?: MovieStatus;
  isFavorite?: boolean;
  personalRating?: number;
  personalNote?: string;
  watchedAt?: string;
  /** Elle girilen adresler (RT, IMDb, fragman); boş metin o bağlantıyı siler */
  links?: MovieCustomLinks;
}

export function searchTmdbMovies(query: string): Promise<TmdbSearchResult[]> {
  return apiFetch<TmdbSearchResult[]>(
    `/admin/movies/search?q=${encodeURIComponent(query)}`,
  );
}

/**
 * Küratör modundaki öneri havuzu (~60 film; tür ve dönem taramasıyla geniş).
 * Onluk seçim istemcide yapılır — "Yenile" her basışta TMDB'ye gitmesin diye.
 */
export function fetchMovieSuggestions(): Promise<TmdbSearchResult[]> {
  return apiFetch<TmdbSearchResult[]>("/admin/movies/suggestions");
}

/**
 * "İlgilenmiyorum" — film öneri havuzundan kalıcı olarak düşer (sayfa
 * yenilense de geri gelmez). Arşive dokunmaz: aranıp elle eklenebilir.
 */
export function dismissMovieSuggestion(
  tmdbId: number,
): Promise<SuggestionDismissal> {
  return apiFetch<SuggestionDismissal>("/admin/movies/suggestions/dismiss", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tmdbId }),
  });
}

/** Yanlışlıkla elenen filmi havuza geri alır. */
export function restoreMovieSuggestion(
  tmdbId: number,
): Promise<SuggestionDismissal> {
  return apiFetch<SuggestionDismissal>(
    `/admin/movies/suggestions/dismiss/${tmdbId}`,
    { method: "DELETE" },
  );
}

export interface SuggestionDismissal {
  tmdbId: number;
  dismissed: boolean;
}

export function fetchAdminMovies(): Promise<MovieEntryRecord[]> {
  return apiFetch<MovieEntryRecord[]>("/admin/movies");
}

export function createMovieEntry(
  input: MovieEntryInput,
): Promise<MovieEntryRecord> {
  return apiFetch<MovieEntryRecord>("/admin/movies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function updateMovieEntry(
  id: string,
  input: Partial<Omit<MovieEntryInput, "tmdbId">>,
): Promise<MovieEntryRecord> {
  return apiFetch<MovieEntryRecord>(`/admin/movies/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function deleteMovieEntry(id: string): Promise<MovieEntryRecord> {
  return apiFetch<MovieEntryRecord>(`/admin/movies/${id}`, {
    method: "DELETE",
  });
}

// ---- Salon 02 · Dizi arşivi (film arşivinin bire bir aynısı) ----

export interface ShowEntryInput {
  tmdbId: number;
  status?: ShowStatus;
  isFavorite?: boolean;
  personalRating?: number;
  personalNote?: string;
  watchedAt?: string;
  /** Elle girilen adresler (RT, IMDb, fragman); boş metin o bağlantıyı siler */
  links?: ShowCustomLinks;
}

export function searchTmdbShows(query: string): Promise<TmdbSearchResult[]> {
  return apiFetch<TmdbSearchResult[]>(
    `/admin/shows/search?q=${encodeURIComponent(query)}`,
  );
}

export function fetchShowSuggestions(): Promise<TmdbSearchResult[]> {
  return apiFetch<TmdbSearchResult[]>("/admin/shows/suggestions");
}

export function dismissShowSuggestion(
  tmdbId: number,
): Promise<SuggestionDismissal> {
  return apiFetch<SuggestionDismissal>("/admin/shows/suggestions/dismiss", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tmdbId }),
  });
}

export function restoreShowSuggestion(
  tmdbId: number,
): Promise<SuggestionDismissal> {
  return apiFetch<SuggestionDismissal>(
    `/admin/shows/suggestions/dismiss/${tmdbId}`,
    { method: "DELETE" },
  );
}

export function fetchAdminShows(): Promise<ShowEntryRecord[]> {
  return apiFetch<ShowEntryRecord[]>("/admin/shows");
}

export function createShowEntry(
  input: ShowEntryInput,
): Promise<ShowEntryRecord> {
  return apiFetch<ShowEntryRecord>("/admin/shows", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function updateShowEntry(
  id: string,
  input: Partial<Omit<ShowEntryInput, "tmdbId">>,
): Promise<ShowEntryRecord> {
  return apiFetch<ShowEntryRecord>(`/admin/shows/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function deleteShowEntry(id: string): Promise<ShowEntryRecord> {
  return apiFetch<ShowEntryRecord>(`/admin/shows/${id}`, {
    method: "DELETE",
  });
}

/**
 * Sezon ilerlemesi. `delta` günlük kullanım ("+1 bölüm"), `watchedEpisodes`
 * doğrudan atama (ızgaradan işaretleme) içindir.
 */
export interface ShowSeasonInput {
  delta?: number;
  watchedEpisodes?: number;
  isCompleted?: boolean;
  personalRating?: number;
  markEpisode?: number;
  markState?: "SKIPPED" | "CLEAR";
}

export function updateShowSeason(
  seasonId: string,
  input: ShowSeasonInput,
): Promise<ShowEntryRecord> {
  return apiFetch<ShowEntryRecord>(`/admin/shows/seasons/${seasonId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

/** "Buraya kadar hepsini izledim" — seçilen sezon ve öncekiler tamamlanır. */
export function completeThroughShowSeason(
  seasonId: string,
): Promise<ShowEntryRecord> {
  return apiFetch<ShowEntryRecord>(
    `/admin/shows/seasons/${seasonId}/complete-through`,
    { method: "POST" },
  );
}

export interface CategoryInput {
  name: string;
  description?: string;
  coverImage?: string;
}

export function fetchAdminCategories(): Promise<UniverseCategory[]> {
  return apiFetch<UniverseCategory[]>("/admin/universe-categories");
}

export function fetchAdminCategory(id: string): Promise<UniverseCategory> {
  return apiFetch<UniverseCategory>(`/admin/universe-categories/${id}`);
}

export function createCategory(input: CategoryInput): Promise<UniverseCategory> {
  return apiFetch<UniverseCategory>("/admin/universe-categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function updateCategory(
  id: string,
  input: Partial<CategoryInput>,
): Promise<UniverseCategory> {
  return apiFetch<UniverseCategory>(`/admin/universe-categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function deleteCategory(id: string): Promise<UniverseCategory> {
  return apiFetch<UniverseCategory>(`/admin/universe-categories/${id}`, {
    method: "DELETE",
  });
}

export function deleteAmbientTrack(id: string): Promise<AmbientTrack> {
  return apiFetch<AmbientTrack>(`/ambient-tracks/${id}`, {
    method: "DELETE",
  });
}

export async function uploadImage(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  // `apiFetch` kullanılmıyor (gövde FormData), o yüzden çerez izni burada elle
  // veriliyor — yoksa yükleme 401 döner.
  const response = await fetch(apiFetchUrl("/admin/uploads"), {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!response.ok) {
    let messageKey = "API.REQUEST_FAILED";
    try {
      const body = (await response.json()) as { message?: string };
      if (typeof body.message === "string") {
        messageKey = body.message;
      }
    } catch {
      // gövde JSON değilse varsayılan anahtar kullanılır
    }
    throw new ApiError(response.status, messageKey);
  }
  return response.json() as Promise<UploadResult>;
}

/**
 * Adresten görsel alma.
 *
 * Görsel **indirilip kendi sunucumuza yazılıyor**, adres olduğu gibi
 * saklanmıyor: CSP `img-src` yalnızca sayılı sunucuya izin verdiği için
 * yabancı bir adres tarayıcıda engellenirdi, üstelik dış adres bir gün ölürse
 * görsel de ölürdü. Dönen değer bizim `/uploads/…` adresimiz.
 */
export function uploadImageFromUrl(url: string): Promise<UploadResult> {
  return apiFetch<UploadResult>("/admin/uploads/from-url", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url }),
  });
}

// ---- Akatsuki sergisi ----

/** Kurulum ucunun satır raporu — sebep taşınır (devir dersi §4.5). */
export interface AkatsukiSetupResult {
  characterId: number;
  slot: string;
  abilityName: string | null;
  status: "created" | "exists" | "failed";
  reason?: string;
  url?: string;
}

export interface AkatsukiSetupSummary {
  created: number;
  exists: number;
  failed: number;
  results: AkatsukiSetupResult[];
}

/**
 * Akatsuki sergisinin görsel kurulumu. İdempotent: var olan yuva backend'de
 * atlanır, küratörün elle yüklediği ezilmez — yeniden basmak güvenli
 * (müzik taksonomi kurulumunun kardeşi).
 */
export function setupAkatsukiImages(): Promise<AkatsukiSetupSummary> {
  return apiFetch<AkatsukiSetupSummary>("/admin/anime/akatsuki/setup", {
    method: "POST",
  });
}

// ---- Karakter görselleri ----

/**
 * Yüklenmiş bir görseli karaktere bağlar.
 *
 * İki adımlı akışın ikinci adımı: önce `uploadImage` / `uploadImageFromUrl`
 * dosyayı sunucuya koyup adresini verir, sonra bu çağrı o adresi karakterin
 * ilgili yuvasına yazar. Ayrı olmalarının sebebi yükleme mantığının
 * (SSRF savunması, mime/boyut denetimi) tek yerde durması.
 */
export function addCharacterImage(input: {
  characterId: number;
  slot: "PORTRAIT" | "GALLERY" | "ABILITY";
  abilityName?: string;
  url: string;
  altText?: string;
}): Promise<{ id: string }> {
  return apiFetch<{ id: string }>("/admin/character-images", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
}

/** Yumuşak silme — diskteki dosyaya dokunulmaz. */
export function deleteCharacterImage(id: string): Promise<{ id: string }> {
  return apiFetch<{ id: string }>(`/admin/character-images/${id}`, {
    method: "DELETE",
  });
}

/**
 * Karakteri dizinden çıkarır.
 *
 * "Silmek" değil **gizlemek**: dizin arşivdeki serilerin AniList
 * kadrolarından türetiliyor, yani kaynağı silme yetkimiz yok. Kalıcı olan
 * bizim dışlama listemiz. Geri alınabilir.
 */
export function hideCharacter(
  characterId: number,
): Promise<{ characterId: number }> {
  return apiFetch<{ characterId: number }>("/admin/hidden-characters", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ characterId }),
  });
}

/** Gizlemeyi geri alır. */
export function revealCharacter(
  characterId: number,
): Promise<{ characterId: number }> {
  return apiFetch<{ characterId: number }>(
    `/admin/hidden-characters/${characterId}`,
    { method: "DELETE" },
  );
}

// ---- Salon 04 · Anime arşivi ----

export interface AnimeEntryInput {
  anilistId: number;
  status?: AnimeWatchStatus;
  isFavorite?: boolean;
  personalRating?: number;
  personalNote?: string;
  /** Sabit banner: tam adres ya da yüklenen dosyanın yolu; boş metin temizler */
  bannerImage?: string;
  /** Elle girilen dış bağlantılar; boş metin o bağlantıyı temizler */
  links?: AnimeCustomLinks;
}

/** Sezon ilerlemesi: `delta` günlük kullanım, `watchedEpisodes` doğrudan atama. */
export interface AnimePartInput {
  delta?: number;
  watchedEpisodes?: number;
  isCompleted?: boolean;
  personalRating?: number;
  mangaChapter?: number;
  /** Bölüm ızgarasından tek bölüm işaretleme */
  markEpisode?: number;
  markState?: "SKIPPED" | "NONE";
  /** Filler bölümlerin hepsini "geçildi" say */
  skipFillers?: boolean;
}

export function searchAnilist(query: string): Promise<AnilistSearchResult[]> {
  return apiFetch<AnilistSearchResult[]>(
    `/admin/anime/search?q=${encodeURIComponent(query)}`,
  );
}

/** Seriyi arşive alır; sezon zinciri backend'de kurulur. */
export function createAnimeEntry(input: AnimeEntryInput): Promise<unknown> {
  return apiFetch<unknown>("/admin/anime", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function updateAnimeEntry(
  id: string,
  input: Omit<Partial<AnimeEntryInput>, "anilistId">,
): Promise<unknown> {
  return apiFetch<unknown>(`/admin/anime/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

/** "+1 bölüm" ve ızgaradan işaretleme aynı ucu kullanır. */
export function updateAnimePart(
  partId: string,
  input: AnimePartInput,
): Promise<unknown> {
  return apiFetch<unknown>(`/admin/anime/parts/${partId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function deleteAnimeEntry(id: string): Promise<unknown> {
  return apiFetch<unknown>(`/admin/anime/${id}`, {
    method: "DELETE",
  });
}

/** "Buraya kadar hepsini izledim": bu parça ve öncekiler tamamlanır. */
export function completeAnimeThrough(partId: string): Promise<unknown> {
  return apiFetch<unknown>(`/admin/anime/parts/${partId}/complete-through`, {
    method: "PATCH",
  });
}

/** Künyeyi ve sezon zincirini AniList'ten tazeler; ilerleme korunur. */
export function refreshAnimeEntry(id: string): Promise<unknown> {
  return apiFetch<unknown>(`/admin/anime/${id}/refresh`, {
    method: "PATCH",
  });
}

// ---- Salon 05 · Kitap arşivi ----

/**
 * Arşive kitap ekleme. `googleId` zorunlu değil: Google Books'un bilmediği
 * kitap Open Library anahtarıyla ya da yalnızca adıyla eklenebilir.
 */
export interface BookEntryInput {
  googleId?: string;
  olKey?: string;
  /** 1000Kitap sayfa anahtarı — künye öncelikle bundan tohumlanır */
  binKitapSlug?: string;
  title?: string;
  /**
   * Seçilen kaydın yazarı. Künyeye yazılmıyor — backend doğru kitabı bulmak
   * için kullanıyor: Open Library kaydının tek kayıt ucu yok ve künye ada
   * göre aranarak tohumlanıyor, yalnızca ad ise yetmiyor.
   */
  author?: string;
  status?: BookStatus;
  translationState?: BookTranslation;
  seriesName?: string;
  seriesIndex?: number;
  isFavorite?: boolean;
  personalRating?: number;
  personalNote?: string;
  startedAt?: string;
  finishedAt?: string;
}

/**
 * Künye düzeltme. Film/dizi kanadında künye alanları güncellenemez; kitapta
 * güncellenir — gösterilen künyenin sahibi arşiv, dış kaynak değil.
 */
export interface BookEntryUpdate {
  title?: string;
  originalTitle?: string;
  authors?: string[];
  translator?: string;
  publisher?: string;
  publishedYear?: number;
  firstPublishedYear?: number;
  pageCount?: number;
  language?: string;
  coverImage?: string;
  description?: string;
  genres?: string[];
  seriesName?: string;
  seriesIndex?: number;
  status?: BookStatus;
  translationState?: BookTranslation;
  isFavorite?: boolean;
  personalRating?: number;
  personalNote?: string;
  currentPage?: number;
  startedAt?: string;
  finishedAt?: string;
  universeId?: string;
  /** Elle girilen adresler; boş metin o bağlantıyı siler */
  links?: BookCustomLinks;
}

/**
 * Küratör araması. `signal` canlı arama için şart: kullanıcı yazmaya devam
 * ettikçe önceki istek iptal edilmezse geç dönen eski yanıt yenisinin üstüne
 * yazıyor ve liste yanlış sonuçla donuyor.
 */
export function searchBooks(
  query: string,
  signal?: AbortSignal,
): Promise<BookSearchResult[]> {
  return apiFetch<BookSearchResult[]>(
    `/admin/books/search?q=${encodeURIComponent(query)}`,
    { signal },
  );
}

export function fetchAdminBooks(): Promise<BookEntryRecord[]> {
  return apiFetch<BookEntryRecord[]>("/admin/books");
}

export function createBookEntry(
  input: BookEntryInput,
): Promise<BookEntryRecord> {
  return apiFetch<BookEntryRecord>("/admin/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function updateBookEntry(
  id: string,
  input: BookEntryUpdate,
): Promise<BookEntryRecord> {
  return apiFetch<BookEntryRecord>(`/admin/books/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function deleteBookEntry(id: string): Promise<BookEntryRecord> {
  return apiFetch<BookEntryRecord>(`/admin/books/${id}`, {
    method: "DELETE",
  });
}

/**
 * Künyeyi dış kaynaktan tazeler — ama yalnızca BOŞ alanları doldurur.
 * Elle düzeltilmiş Türkçe ad, çevirmen ve sayfa sayısı asla ezilmez.
 */
export function refreshBookEntry(id: string): Promise<BookEntryRecord> {
  return apiFetch<BookEntryRecord>(`/admin/books/${id}/refresh`, {
    method: "PATCH",
  });
}

// ---- Kitap bakımı ----

export interface BookMaintenanceResult {
  scanned: number;
  localized?: number;
  linked?: number;
  /** Portre indirmede kaç kişinin fotoğrafı doldu */
  filled?: number;
}

/** Dış adresle duran kapakları kendi sunucumuza indirir (hotlink yok). */
export function localizeBookCovers(): Promise<BookMaintenanceResult> {
  return apiFetch<BookMaintenanceResult>("/admin/books/covers/localize", {
    method: "POST",
  });
}

/** Eski kayıtların düz metin künyesinden yazar/yayınevi/tür bağlarını kurar. */
export function backfillBookCredits(): Promise<BookMaintenanceResult> {
  return apiFetch<BookMaintenanceResult>("/admin/books/credits/backfill", {
    method: "POST",
  });
}

/**
 * "Buradayım" imi: okuma sırasında kaçıncı duraktayım. `0` imi kaldırır.
 */
export function setReadingOrderProgress(
  key: string,
  currentOrder: number,
): Promise<{ currentOrder: number }> {
  return apiFetch<{ currentOrder: number }>(
    `/admin/books/okuma-sirasi/${encodeURIComponent(key)}/progress`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentOrder }),
    },
  );
}

/**
 * Fotoğrafı olmayan yazar/çevirmenlerin portrelerini kaynaktan indirir.
 * Portre normalde kişi sayfası açıldığında iniyor; salonun yazar paneli de
 * onları gösterdiği için tek seferde kapatmak gerekiyor.
 */
export function backfillPersonPhotos(): Promise<BookMaintenanceResult> {
  return apiFetch<BookMaintenanceResult>("/admin/books/people/photos", {
    method: "POST",
  });
}

export interface PendingGenre {
  id: string;
  name: string;
  slug: string;
  bookCount: number;
}

/** Kaynaktan gelip sözlükte karşılığı olmayan, onay bekleyen türler. */
export function getPendingGenres(): Promise<PendingGenre[]> {
  return apiFetch<PendingGenre[]>("/admin/books/genres/pending");
}

export function approveGenre(id: string): Promise<{ id: string }> {
  return apiFetch<{ id: string }>(`/admin/books/genres/${id}/approve`, {
    method: "PATCH",
  });
}

export function rejectGenre(id: string): Promise<{ id: string }> {
  return apiFetch<{ id: string }>(`/admin/books/genres/${id}`, {
    method: "DELETE",
  });
}

// ---- Alıntı defteri ----

export interface BookQuoteInput {
  text: string;
  page?: number;
  context?: string;
  isFavorite?: boolean;
}

export function addBookQuote(
  entryId: string,
  input: BookQuoteInput,
): Promise<BookQuote> {
  return apiFetch<BookQuote>(`/admin/books/${entryId}/quotes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function updateBookQuote(
  quoteId: string,
  input: Partial<BookQuoteInput>,
): Promise<BookQuote> {
  return apiFetch<BookQuote>(`/admin/books/quotes/${quoteId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function deleteBookQuote(quoteId: string): Promise<BookQuote> {
  return apiFetch<BookQuote>(`/admin/books/quotes/${quoteId}`, {
    method: "DELETE",
  });
}

/** Yıllık okuma hedefi; yıl verilmezse içinde bulunulan yıl kullanılır. */
export function upsertReadingGoal(input: {
  year?: number;
  targetBooks: number;
  targetPages?: number;
}): Promise<ReadingGoalRecord> {
  return apiFetch<ReadingGoalRecord>("/admin/books/goal", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   SALON 06 · MÜZİK — küratör uçları

   Hepsi `@Roles('ADMIN')` arkasında. Kimlik elle eklenmiyor: token HttpOnly
   çerezde ve `apiFetch` `credentials: "include"` gönderiyor.

   ⚠️ Bu uçlar Spotify'a ÇIKAR (sayfa okuma yolları çıkmaz). O yüzden
   çağıranın beklemeye hazır olması gerekiyor: bir sanatçının diskografisini
   senkronize etmek albüm başına bir istek + kapak indirmesi demek, gerçek
   sanatçılarda 30 saniyeyi aşabiliyor.
   ══════════════════════════════════════════════════════════════════════════ */

export interface MusicAdminStatus {
  spotifyConfigured: boolean;
  roleVocabulary: number;
  syncState: Array<{
    entityKind: string;
    entityId: string;
    status: string;
    attempts: number;
    lastError: string | null;
    lastRunAt: string | null;
    nextRunAt: string | null;
  }>;
}

export interface SpotifyArtistResult {
  spotifyId: string;
  name: string;
  genres: string[];
  popularity: number | null;
  followers: number | null;
  images: Array<{ url: string; width: number | null; height: number | null }>;
  externalUrl: string | null;
}

export interface ArtistSyncResult {
  actId: string;
  slug: string;
  name: string;
  albumsCreated: number;
  albumsUpdated: number;
  tracks: number;
  genresPending: number;
  artworkDownloaded: number;
  artworkFailed: number;
}

export interface PendingGenre {
  id: string;
  slug: string;
  name: string;
  key: string | null;
  accentKey: string | null;
  _count: { acts: number };
}

/** Panelin "Spotify bağlı mı" göstergesi. Anahtar DEĞERİ dönmez. */
export function musicStatus(): Promise<MusicAdminStatus> {
  return apiFetch<MusicAdminStatus>("/admin/music/status", {
    cache: "no-store",
  });
}

/**
 * Künye rolü sözlüğünü kurar (16 anahtar). Tekrar çalıştırmak güvenli.
 * Sözlük kurulmazsa sync parça künyelerini sessizce atlar.
 */
export function seedMusicRoles(): Promise<{
  created: number;
  existing: number;
}> {
  return apiFetch("/admin/music/roles/seed", { method: "POST" });
}

/** Spotify'da sanatçı arar. Sonuç `ExternalCache`ten de gelebilir. */
export function searchSpotifyArtists(
  query: string,
): Promise<SpotifyArtistResult[]> {
  return apiFetch<SpotifyArtistResult[]>(
    `/admin/music/search?q=${encodeURIComponent(query)}`,
    { cache: "no-store" },
  );
}

/**
 * Sanatçıyı arşive ekler ve diskografisini senkronize eder.
 * `spotifyId` ham kimlik, `spotify:artist:…` URI'si ya da tarayıcı adresi olabilir.
 */
export function addMusicAct(spotifyId: string): Promise<ArtistSyncResult> {
  return apiFetch<ArtistSyncResult>("/admin/music/acts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ spotifyId }),
  });
}

export function refreshMusicAct(spotifyId: string): Promise<ArtistSyncResult> {
  return apiFetch<ArtistSyncResult>(
    `/admin/music/acts/${encodeURIComponent(spotifyId)}/refresh`,
    { method: "POST" },
  );
}

/** Herkese açık çalma listesini senkronize eder (adres yapıştırılabilir). */
export function addMusicPlaylist(spotifyId: string): Promise<{
  playlistId: string;
  name: string;
  tracksLinked: number;
  tracksMissing: number;
}> {
  return apiFetch("/admin/music/playlists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ spotifyId }),
  });
}

/** Onay bekleyen türler — Spotify'ın `genres` alanı tutarsız, liste dolu olur. */
export function pendingMusicGenres(): Promise<PendingGenre[]> {
  return apiFetch<PendingGenre[]>("/admin/music/genres/pending", {
    cache: "no-store",
  });
}

/**
 * Türü onaylar / adını, i18n anahtarını, oda rengini ayarlar.
 * ⚠️ `accentKey` bir TOKEN ANAHTARI ("rock", "pop"), renk değeri değil —
 * backend hex girişini reddeder (kural 16).
 */
export function updateMusicGenre(
  id: string,
  input: {
    isApproved?: boolean;
    accentKey?: string;
    key?: string;
    name?: string;
  },
): Promise<PendingGenre & { isApproved: boolean }> {
  return apiFetch(`/admin/music/genres/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function rejectMusicGenre(id: string): Promise<unknown> {
  return apiFetch(`/admin/music/genres/${id}`, { method: "DELETE" });
}

/**
 * Sabit tür taksonomisini kurar (17 oda + alt türler).
 *
 * ⚠️ Tekrar çalıştırmak güvenli (slug üzerinden upsert). Var olan türler
 * taksonomiye katılıyor, sözlük ikiye bölünmüyor.
 */
export function seedMusicTaxonomy(): Promise<{
  rooms: number;
  subgenres: number;
  skipped: number;
}> {
  return apiFetch("/admin/music/genres/seed-taxonomy", { method: "POST" });
}

/** Kapağı inmemiş kayıtları toplar. Cron da yapıyor; bu uç sabırsız olan için. */
export function localizeMusicArtwork(limit = 60): Promise<{
  albums: number;
  acts: number;
  failed: number;
}> {
  return apiFetch(`/admin/music/artwork/localize?limit=${limit}`, {
    method: "POST",
  });
}

/** İçe aktarılmış dinlemeleri arşivdeki parçalara yeniden bağlar. */
export function backfillListening(): Promise<{ linked: number }> {
  return apiFetch("/admin/music/listening/backfill", { method: "POST" });
}

/**
 * Spotify "Extended streaming history" dosyasını içe aktarır.
 *
 * Gövde FormData olduğu için `apiFetch` kullanılmıyor; çerez izni elle
 * veriliyor (yükleme uçlarındaki desen, bkz. `uploadImage`).
 *
 * Tekrar tekrar yüklemek güvenli: `@@unique([userId, playedAt,
 * spotifyTrackUri])` kopyayı engelliyor. Zip içindeki dosyalar tek tek
 * yüklenir.
 */
export async function importListeningHistory(file: File): Promise<{
  read: number;
  eligible: number;
  inserted: number;
  duplicate: number;
  skipped: number;
  matched: number;
}> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(apiFetchUrl("/admin/music/listening/import"), {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!response.ok) {
    let messageKey = "API.REQUEST_FAILED";
    try {
      const body = (await response.json()) as { message?: string };
      if (typeof body.message === "string") {
        messageKey = body.message;
      }
    } catch {
      // gövde JSON değilse varsayılan anahtar
    }
    throw new ApiError(response.status, messageKey);
  }
  return response.json() as Promise<{
    read: number;
    eligible: number;
    inserted: number;
    duplicate: number;
    skipped: number;
    matched: number;
  }>;
}

/* ── Tür sözlüğü ve act künyesi ─────────────────────────────────────────────
   Bu dört uç, salonun Spotify'dan ALAMADIĞI her şeyi küratörün eline veriyor:
   11 Ağustos ölçümüne göre sanatçı nesnesi `genres` alanını hiç göndermiyor,
   `actKind`/kuruluş yılı/köken de yok. MusicBrainz çoğunu getiriyor ama
   yalnızca BOŞ alanları dolduruyor — son söz küratörde.
   ─────────────────────────────────────────────────────────────────────────── */

export interface MusicGenreRecord {
  id: string;
  slug: string;
  name: string;
  key: string | null;
  /** `globals.css` içindeki `[data-genre="…"]` anahtarı; renk DEĞİL */
  accentKey: string | null;
  isApproved: boolean;
  parentId: string | null;
  _count?: { acts: number };
}

/** Bütün türler (onaylı + bekleyen). Act'in tür kutusu bunu okuyor. */
export function listMusicGenres(): Promise<MusicGenreRecord[]> {
  return apiFetch<MusicGenreRecord[]>("/admin/music/genres", {
    cache: "no-store",
  });
}

/**
 * Küratörün eliyle tür oluşturur — **onaylı olarak** doğar (dış kaynaktan
 * gelen türler için olan onay kapısı kendi yazdığına uygulanmıyor).
 *
 * ⚠️ `accentKey` bir TOKEN ANAHTARI: yalnızca `rock`, `pop`, `rnb`,
 * `electronic`. Backend bilinmeyen anahtarı reddediyor — `globals.css`te
 * karşılığı olmayan bir değer yazılsa oda sessizce salonun varsayılan
 * rengiyle çizilirdi.
 */
export function createMusicGenre(input: {
  name: string;
  slug?: string;
  key?: string;
  accentKey?: string;
  parentId?: string;
}): Promise<MusicGenreRecord> {
  return apiFetch<MusicGenreRecord>("/admin/music/genres", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

/**
 * Act'in türlerini **tümüyle değiştirir** — gönderilen liste son hâl, ekle/
 * çıkar değil. Boş dizi göndermek act'i türsüz bırakır (ve odalardan düşürür).
 *
 * ⚠️ `actId` arşiv kimliği (cuid), Spotify kimliği değil.
 */
export function setMusicActGenres(
  actId: string,
  genreIds: string[],
): Promise<{
  id: string;
  slug: string;
  name: string;
  genres: Array<{ genre: { id: string; slug: string; name: string } }>;
}> {
  return apiFetch(`/admin/music/acts/${encodeURIComponent(actId)}/genres`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ genreIds }),
  });
}

/**
 * Act künyesinin küratör alanları.
 *
 * ⚠️ Sync'in yazdığı alanlar (`name`, `image`, `spotifyId`) BURADA YOK: bir
 * sonraki tazelemede üzerine yazılırlardı ve küratör "değişikliğim kayboldu"
 * derdi. `bannerImage` yalnızca kendi sunucumuzdaki bir yol olabilir
 * (`/uploads/…`) — dış adresi CSP `img-src` engeller ve görsel sessizce
 * çizilmez.
 */
export function updateMusicAct(
  actId: string,
  input: {
    actKind?: string;
    sortName?: string;
    bio?: string;
    formedYear?: number;
    disbandedYear?: number;
    originCity?: string;
    originCountry?: string;
    bannerImage?: string;
    /**
     * Bandın odak noktası — CSS `background-position` ("50% 30%").
     * Backend kalıbı doğruluyor; serbest dize CSS enjeksiyonu olurdu.
     */
    bannerPosition?: string;
  },
): Promise<{
  id: string;
  slug: string;
  name: string;
  actKind: string;
  bio: string | null;
  formedYear: number | null;
  disbandedYear: number | null;
  originCity: string | null;
  originCountry: string | null;
  bannerImage: string | null;
}> {
  return apiFetch(`/admin/music/acts/${encodeURIComponent(actId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

/**
 * MusicBrainz ile zenginleştirme: tür, grup/solo, kuruluş yılı, köken.
 * ⚠️ Yalnızca BOŞ alanları doldurur; küratörün yazdığına dokunmaz.
 * ⚠️ Yavaş: MusicBrainz istekleri 1500 ms arayla gidiyor (paylaşımlı IP'de
 * 1100 ms 503 aldı), yani üç istek ~5 saniye.
 */
/* ── Kendi çalma listelerimiz ───────────────────────────────────────────────
   Spotify'dan gelen listelerle aynı tabloda duruyorlar; ayıran tek şey
   `spotifyId`in null olması. `isLocal` bayrağı arayüzde onu gösteriyor:
   Spotify'dan gelen bir listeye parça eklemek çalışır ama bir sonraki
   tazelemede kaybolur, o yüzden ekleme yalnızca yerel listelerde açık.
   ─────────────────────────────────────────────────────────────────────────── */

export interface PlaylistRecord {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  orderIndex: number;
  isLocal: boolean;
  trackCount: number;
  genre: { id: string; slug: string; name: string } | null;
}

export function listMusicPlaylists(): Promise<PlaylistRecord[]> {
  return apiFetch<PlaylistRecord[]>("/admin/music/playlists", {
    cache: "no-store",
  });
}

/** Sıfırdan yerel liste. `spotifyId` YAZILMIYOR — sync'ten ayrı kalmasının şartı. */
export function createMusicPlaylist(input: {
  name: string;
  description?: string;
  /** Listenin odası — hangi tür odasında görüneceğine küratör karar verir */
  genreId?: string;
}): Promise<{
  id: string;
  slug: string;
  name: string;
  description: string | null;
}> {
  return apiFetch("/admin/music/playlists/local", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function updateMusicPlaylist(
  id: string,
  input: {
    name?: string;
    description?: string;
    isFavorite?: boolean;
    orderIndex?: number;
    /** Boş dize odadan ÇIKARIR; `undefined` "dokunma" demek */
    genreId?: string;
    /** Kapak — yalnızca `/uploads/…`; dış adresi CSP engeller */
    artwork?: string;
  },
): Promise<PlaylistRecord> {
  return apiFetch(`/admin/music/playlists/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

/** Yumuşak silme: parçalar ve adres korunuyor. */
export function deleteMusicPlaylist(id: string): Promise<unknown> {
  return apiFetch(`/admin/music/playlists/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

/**
 * Parçayı listenin sonuna ekler. `trackId` **arşiv kimliği**, Spotify kimliği
 * değil. Aynı parça iki kez eklenemez; ikinci istek hata değil
 * `added: false` döner.
 */
export function addTrackToPlaylist(
  playlistId: string,
  trackId: string,
): Promise<{ position: number; added: boolean }> {
  return apiFetch(
    `/admin/music/playlists/${encodeURIComponent(playlistId)}/tracks`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId }),
    },
  );
}

export function removeTrackFromPlaylist(
  playlistId: string,
  trackId: string,
): Promise<unknown> {
  return apiFetch(
    `/admin/music/playlists/${encodeURIComponent(playlistId)}/tracks/${encodeURIComponent(trackId)}`,
    { method: "DELETE" },
  );
}

/** Sıranın SON HÂLİ — dizi listenin yeni sırası. */
export function reorderPlaylist(
  playlistId: string,
  trackIds: string[],
): Promise<{ count: number }> {
  return apiFetch(
    `/admin/music/playlists/${encodeURIComponent(playlistId)}/tracks`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackIds }),
    },
  );
}

export function enrichMusicAct(actId: string): Promise<{
  matched: boolean;
  mbid: string | null;
  /** Doldurulan alan adları — hiçbiri boş değilse dizi boş döner */
  filled: string[];
  genresLinked: number;
  /** Eşleşmediyse SEBEBİ; `null` ise sorun yok (11 Ağustos dersi) */
  reason: string | null;
}> {
  return apiFetch(`/admin/music/acts/${encodeURIComponent(actId)}/enrich`, {
    method: "POST",
  });
}

// ============================================================
// Salon 06 · Spor Arşivi — küratör
//
// Bütün uçlar `@Roles('ADMIN')` arkasında; token HttpOnly çerezde ve
// `apiFetch` onu `credentials: "include"` ile taşıyor (bkz. dosya başlığı).
// ============================================================

export interface SportCuratorContext {
  clubs: Array<{
    id: string;
    slug: string;
    name: string;
    coverImage: string | null;
    /** Kırpma odağı ("50% 30%") ve büyütme yüzdesi — küratör yazıyor */
    coverPosition: string | null;
    coverScale: number | null;
    eras: Array<{
      id: string;
      slug: string;
      titleTr: string;
      startYear: number;
      endYear: number | null;
    }>;
  }>;
  circuits: Array<{
    id: string;
    slug: string;
    name: string;
    coverImage: string | null;
    /** Kırpma odağı ("50% 30%") ve büyütme yüzdesi — küratör yazıyor */
    coverPosition: string | null;
    coverScale: number | null;
  }>;
  legends: Array<{
    id: string;
    slug: string;
    name: string;
    portraitImage: string | null;
    personalRank: number | null;
    isPublished: boolean;
  }>;
  /** Panteon adayları — podyum sayısına göre ilk 40 sürücü */
  drivers: Array<{
    id: string;
    slug: string;
    name: string;
    photo: string | null;
    portraitLicense: string | null;
    portraitAuthor: string | null;
    personalRank: number | null;
    isPublished: boolean;
    championships: number;
    podiums: number;
  }>;
  /** Zaman şeridindeki mevcut kayıtlar — taslaklar DA burada */
  moments: Array<{
    id: string;
    world: "football" | "f1";
    year: number;
    month: number | null;
    day: number | null;
    titleTr: string;
    /** Küratörün yazdığı serbest satır (türetilmiş DEĞİL) */
    label: string | null;
    imageUrl: string | null;
    isPublished: boolean;
    isHighlight: boolean;
  }>;
  /**
   * Etiket ÖNERİLERİ — daha önce kullanılmış değerlerden türetiliyor.
   * Ayrı bir sözlük tablosu yok: yazılan etiket anında öneri oluyor,
   * son kayıt silinince kendiliğinden kayboluyor.
   */
  labels: string[];
}

export interface CreateSportMomentBody {
  /** Kaydın gireceği ŞERİT. Artık dönem/pist seçmek gerekmiyor. */
  world: "football" | "f1";
  /** İsteğe bağlı bağ — ileride sayfaya bağlamak için (bkz. DTO notu) */
  eraId?: string;
  circuitId?: string;
  year: number;
  /** İsteğe bağlı; aynı yıla düşen iki kaydı ayırmak için */
  month?: number;
  day?: number;
  titleTr: string;
  titleEn?: string;
  /** Açıklamanın altındaki serbest satır — boşsa çizilmiyor */
  labelTr?: string;
  labelEn?: string;
  narrativeTr?: string;
  kind?: string;
  isHighlight?: boolean;
  isPublished?: boolean;
  /** Kartın arşiv fotoğrafı — yükleme ucundan dönen yerel adres */
  imageUrl?: string;
}

export function fetchSportCuratorContext(): Promise<SportCuratorContext> {
  return apiFetch("/admin/sport-archive/context");
}

export function createSportMoment(
  body: CreateSportMomentBody,
): Promise<{ id: string }> {
  return apiFetch("/admin/sport-archive/moments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function deleteSportMoment(
  world: "football" | "f1",
  id: string,
): Promise<{ ok: boolean }> {
  return apiFetch(
    `/admin/sport-archive/moments/${world}/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
}

/**
 * Görseli kayda bağla. `url` boş dize ise görsel KALDIRILIR — silme için ayrı
 * bir uç açmamak kasıtlı: küratör panelinde "kaldır" düğmesi aynı formu boş
 * değerle gönderiyor.
 */
export type SportImageTarget =
  | "CLUB_COVER"
  | "CLUB_CREST"
  | "CIRCUIT_COVER"
  | "LEGEND_PORTRAIT"
  | "DRIVER_PORTRAIT"
  | "MOMENT_FOOTBALL"
  | "MOMENT_F1";

export function setSportImage(body: {
  target: SportImageTarget;
  /** Kulüp/pist/efsane/sürücüde slug, ANDA `cuid` — anın slug'ı yok */
  ref: string;
  url: string;
}): Promise<unknown> {
  return apiFetch("/admin/sport-archive/image", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/**
 * Bant kapağının odak noktası ve büyütmesi.
 *
 * ⚠️ `setSportImage`ten AYRI uç — görsel bir kez yükleniyor, odak noktası
 * kaydırıcı oynatıldıkça defalarca kaydediliyor. Tek uç olsaydı her odak
 * kaydında görsel adresi de gönderilmek zorunda kalırdı ve boş gönderilen
 * bir istek görseli SİLERDİ.
 *
 * `position` boş dize = ortaya dön.
 */
export function setSportCoverFocus(body: {
  target: "CLUB_COVER" | "CIRCUIT_COVER";
  ref: string;
  position?: string;
  scale?: number;
}): Promise<unknown> {
  return apiFetch("/admin/sport-archive/cover-focus", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** F1 sürücüsünü panteona al / çıkar. */
export function featureF1Driver(
  slug: string,
  body: {
    isPublished?: boolean;
    personalRank?: number;
    nicknameTr?: string;
    narrativeTr?: string;
  },
): Promise<{ slug: string; isPublished: boolean; personalRank: number | null }> {
  return apiFetch(`/admin/sport-archive/drivers/${encodeURIComponent(slug)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/**
 * Favori futbolcu sayfasının bir görsel yuvasını bağla / kaldır.
 *
 * İki adımlı akışın ikinci adımı: önce `uploadImage` ya da
 * `uploadImageFromUrl` dosyayı sunucumuza yazıyor, sonra bu çağrı dönen
 * `/uploads/…` adresini yuvaya bağlıyor. Boş `url` = yuvayı kaldır.
 */
export function setFavouritePlayerImage(input: {
  playerSlug: string;
  slotId: string;
  url: string;
}): Promise<{ playerSlug: string; slotId: string; url: string | null }> {
  return apiFetch("/admin/sport-archive/player-image", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
}
