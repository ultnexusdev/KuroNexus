import { apiFetch, apiFetchUrl, ApiError } from "../api/client";
import type {
  AdminWikiEntrySummary,
  AmbientTrack,
  AnilistSearchResult,
  AnimeCustomLinks,
  AnimeWatchStatus,
  AuthenticatedUser,
  LoginResult,
  MovieCustomLinks,
  MovieEntryRecord,
  MovieStatus,
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
import { getToken } from "./auth";

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function login(email: string, password: string): Promise<LoginResult> {
  return apiFetch<LoginResult>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export function fetchMe(): Promise<AuthenticatedUser> {
  return apiFetch<AuthenticatedUser>("/auth/me", {
    headers: authHeaders(),
  });
}

// universeId verilirse liste el yazması sırasına (orderIndex) göre döner
export function fetchAdminStories(
  universeId?: string,
): Promise<StorySummary[]> {
  const query = universeId
    ? `?universeId=${encodeURIComponent(universeId)}`
    : "";
  return apiFetch<StorySummary[]>(`/admin/stories${query}`, {
    headers: authHeaders(),
  });
}

export function fetchAdminStory(id: string): Promise<Story> {
  return apiFetch<Story>(`/admin/stories/${id}`, { headers: authHeaders() });
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
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
}

export function updateStory(
  id: string,
  input: Partial<StoryInput>,
): Promise<Story> {
  return apiFetch<Story>(`/admin/stories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
}

// Bölüm sırası: dizideki konum orderIndex olur (1'den başlar)
export function reorderStories(ids: string[]): Promise<{ updated: number }> {
  return apiFetch<{ updated: number }>("/admin/stories/reorder", {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ ids }),
  });
}

export function deleteStory(id: string): Promise<Story> {
  return apiFetch<Story>(`/admin/stories/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

export interface UniverseInput {
  name: string;
  description?: string;
  coverImage?: string;
  categoryId?: string | null;
}

export function fetchAdminUniverses(): Promise<WikiUniverseSummary[]> {
  return apiFetch<WikiUniverseSummary[]>("/admin/universes", {
    headers: authHeaders(),
  });
}

export function fetchAdminUniverse(id: string): Promise<WikiUniverseSummary> {
  return apiFetch<WikiUniverseSummary>(`/admin/universes/${id}`, {
    headers: authHeaders(),
  });
}

export function createUniverse(
  input: UniverseInput,
): Promise<WikiUniverseSummary> {
  return apiFetch<WikiUniverseSummary>("/admin/universes", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
}

export function updateUniverse(
  id: string,
  input: Partial<UniverseInput>,
): Promise<WikiUniverseSummary> {
  return apiFetch<WikiUniverseSummary>(`/admin/universes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
}

export function deleteUniverse(id: string): Promise<WikiUniverseSummary> {
  return apiFetch<WikiUniverseSummary>(`/admin/universes/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
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
  return apiFetch<AdminWikiEntrySummary[]>(`/admin/wiki-entries${query}`, {
    headers: authHeaders(),
  });
}

export function fetchAdminWikiEntry(id: string): Promise<WikiEntryDetail> {
  return apiFetch<WikiEntryDetail>(`/admin/wiki-entries/${id}`, {
    headers: authHeaders(),
  });
}

export function createWikiEntry(
  input: WikiEntryInput,
): Promise<WikiEntryDetail> {
  return apiFetch<WikiEntryDetail>("/admin/wiki-entries", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
}

export function updateWikiEntry(
  id: string,
  input: Partial<WikiEntryInput>,
): Promise<WikiEntryDetail> {
  return apiFetch<WikiEntryDetail>(`/admin/wiki-entries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
}

export function deleteWikiEntry(id: string): Promise<WikiEntryDetail> {
  return apiFetch<WikiEntryDetail>(`/admin/wiki-entries/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

export interface AmbientTrackInput {
  title: string;
  universeId: string;
  audioUrl: string;
  order?: number;
}

export function fetchAdminAmbientTracks(): Promise<AmbientTrack[]> {
  return apiFetch<AmbientTrack[]>("/ambient-tracks", {
    headers: authHeaders(),
  });
}

export function createAmbientTrack(
  input: AmbientTrackInput,
): Promise<AmbientTrack> {
  return apiFetch<AmbientTrack>("/ambient-tracks", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
}

export function updateAmbientTrack(
  id: string,
  input: { title?: string; universeId?: string },
): Promise<AmbientTrack> {
  return apiFetch<AmbientTrack>(`/admin/ambient-tracks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
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
  return apiFetch<SquadOverride[]>("/admin/football/squad-overrides", {
    headers: authHeaders(),
  });
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
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
}

export function deleteSquadOverride(id: string): Promise<void> {
  return apiFetch<void>(`/admin/football/squad-overrides/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
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
  return apiFetch<TransferNewsItem[]>(`/transfer-news${qs}`, {
    headers: authHeaders(),
  });
}

// Haber formundaki oyuncu seçici — yerel TM kadrosundan
export function searchTransferNewsPlayers(
  query?: string,
): Promise<TransferNewsPlayer[]> {
  const qs = query ? `?q=${encodeURIComponent(query)}` : "";
  return apiFetch<TransferNewsPlayer[]>(`/transfer-news/players${qs}`, {
    headers: authHeaders(),
  });
}

export function createTransferNews(
  input: TransferNewsInput,
): Promise<TransferNewsItem> {
  return apiFetch<TransferNewsItem>("/transfer-news", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
}

export function deleteTransferNews(id: string): Promise<void> {
  return apiFetch<void>(`/transfer-news/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
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
    { headers: authHeaders() },
  );
}

/**
 * Küratör modundaki öneri havuzu (~60 film; tür ve dönem taramasıyla geniş).
 * Onluk seçim istemcide yapılır — "Yenile" her basışta TMDB'ye gitmesin diye.
 */
export function fetchMovieSuggestions(): Promise<TmdbSearchResult[]> {
  return apiFetch<TmdbSearchResult[]>("/admin/movies/suggestions", {
    headers: authHeaders(),
  });
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
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ tmdbId }),
  });
}

/** Yanlışlıkla elenen filmi havuza geri alır. */
export function restoreMovieSuggestion(
  tmdbId: number,
): Promise<SuggestionDismissal> {
  return apiFetch<SuggestionDismissal>(
    `/admin/movies/suggestions/dismiss/${tmdbId}`,
    { method: "DELETE", headers: authHeaders() },
  );
}

export interface SuggestionDismissal {
  tmdbId: number;
  dismissed: boolean;
}

export function fetchAdminMovies(): Promise<MovieEntryRecord[]> {
  return apiFetch<MovieEntryRecord[]>("/admin/movies", {
    headers: authHeaders(),
  });
}

export function createMovieEntry(
  input: MovieEntryInput,
): Promise<MovieEntryRecord> {
  return apiFetch<MovieEntryRecord>("/admin/movies", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
}

export function updateMovieEntry(
  id: string,
  input: Partial<Omit<MovieEntryInput, "tmdbId">>,
): Promise<MovieEntryRecord> {
  return apiFetch<MovieEntryRecord>(`/admin/movies/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
}

export function deleteMovieEntry(id: string): Promise<MovieEntryRecord> {
  return apiFetch<MovieEntryRecord>(`/admin/movies/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

export interface CategoryInput {
  name: string;
  description?: string;
  coverImage?: string;
}

export function fetchAdminCategories(): Promise<UniverseCategory[]> {
  return apiFetch<UniverseCategory[]>("/admin/universe-categories", {
    headers: authHeaders(),
  });
}

export function fetchAdminCategory(id: string): Promise<UniverseCategory> {
  return apiFetch<UniverseCategory>(`/admin/universe-categories/${id}`, {
    headers: authHeaders(),
  });
}

export function createCategory(input: CategoryInput): Promise<UniverseCategory> {
  return apiFetch<UniverseCategory>("/admin/universe-categories", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
}

export function updateCategory(
  id: string,
  input: Partial<CategoryInput>,
): Promise<UniverseCategory> {
  return apiFetch<UniverseCategory>(`/admin/universe-categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
}

export function deleteCategory(id: string): Promise<UniverseCategory> {
  return apiFetch<UniverseCategory>(`/admin/universe-categories/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

export function deleteAmbientTrack(id: string): Promise<AmbientTrack> {
  return apiFetch<AmbientTrack>(`/ambient-tracks/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

export async function uploadImage(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(apiFetchUrl("/admin/uploads"), {
    method: "POST",
    headers: authHeaders(),
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
    { headers: authHeaders() },
  );
}

/** Seriyi arşive alır; sezon zinciri backend'de kurulur. */
export function createAnimeEntry(input: AnimeEntryInput): Promise<unknown> {
  return apiFetch<unknown>("/admin/anime", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
}

export function updateAnimeEntry(
  id: string,
  input: Omit<Partial<AnimeEntryInput>, "anilistId">,
): Promise<unknown> {
  return apiFetch<unknown>(`/admin/anime/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
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
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
}

export function deleteAnimeEntry(id: string): Promise<unknown> {
  return apiFetch<unknown>(`/admin/anime/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

/** "Buraya kadar hepsini izledim": bu parça ve öncekiler tamamlanır. */
export function completeAnimeThrough(partId: string): Promise<unknown> {
  return apiFetch<unknown>(`/admin/anime/parts/${partId}/complete-through`, {
    method: "PATCH",
    headers: authHeaders(),
  });
}

/** Künyeyi ve sezon zincirini AniList'ten tazeler; ilerleme korunur. */
export function refreshAnimeEntry(id: string): Promise<unknown> {
  return apiFetch<unknown>(`/admin/anime/${id}/refresh`, {
    method: "PATCH",
    headers: authHeaders(),
  });
}
