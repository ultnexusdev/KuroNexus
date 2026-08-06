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
