import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExternalCacheService } from '../common/cache/external-cache.service';

/**
 * Dış isteğin en fazla süresi.
 *
 * Zaman aşımı olmadan asılı kalan bir istek, çağıranı da askıda tutar ve
 * soket havuzunu doldurur — dışarıdan tetiklenebilen bir kaynak tükenmesi
 * yüzeyi. 2026-08-04'te tam olarak bu eksiklik Open Library üzerinden kitap
 * aramasını 40 saniyeye çıkardı; bu kaynak o gün ayakta olduğu için burada
 * fark edilmemişti.
 */
const REQUEST_TIMEOUT_MS = 8_000;

/**
 * TMDB erişimi. Anahtar yalnızca backend `.env`'de durur, frontend'e asla
 * verilmez (kural 4). Her yanıt `ExternalCache`e yazılır: film künyesi
 * neredeyse hiç değişmez, her sayfa açılışında dış istek atmak gereksizdir.
 */

const TMDB_BASE = 'https://api.themoviedb.org/3';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // kural 14: varsayılan 7 gün
// Popüler/trend listeleri künyeden hızlı eskiyor — bir gün yeterli
const LIST_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export interface TmdbCastMember {
  name: string;
  character: string | null;
  profilePath: string | null;
}

/** Bir izleme platformu: adı, logosu ve hangi yolla (abonelik/kira/satın alma) */
export interface TmdbProvider {
  name: string;
  logoPath: string | null;
  kind: 'FLATRATE' | 'RENT' | 'BUY';
}

export interface TmdbMovie {
  tmdbId: number;
  title: string;
  originalTitle: string | null;
  overview: string | null;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  runtime: number | null;
  genres: string[];
  voteAverage: number | null;
  director: string | null;
  /** Film sayfası için (v2 künye): liste görünümünde kullanılmaz */
  tagline: string | null;
  /** IMDb bağlantısının kaynağı — TMDB künyeyle birlikte veriyor */
  imdbId: string | null;
  homepage: string | null;
  cast: TmdbCastMember[];
  /** YouTube fragman anahtarı; gömülü oynatıcı bunu kullanır */
  trailerKey: string | null;
  /** Türkiye'de nerede izlenir (TMDB'nin JustWatch verisi) */
  providers: TmdbProvider[];
  /** JustWatch'un o filme ait sayfası — sağlayıcı rozetleri buraya bağlanır */
  providerLink: string | null;
  /** Sahne kareleri (yazısız backdrop'lar) — sol sütundaki şerit */
  stills: string[];
  /** Künye levhası alanları; TMDB künyesinde zaten geliyor, ek istek yok */
  budget: number | null;
  revenue: number | null;
  originalLanguage: string | null;
}

interface TmdbGenre {
  id: number;
  name: string;
}

interface TmdbCrewMember {
  job?: string;
  name?: string;
}

interface TmdbCastEntry {
  name?: string;
  character?: string;
  profile_path?: string | null;
  order?: number;
}

interface TmdbVideo {
  key?: string;
  site?: string;
  type?: string;
  official?: boolean;
}

interface TmdbProviderEntry {
  provider_name?: string;
  logo_path?: string | null;
}

interface TmdbMovieResponse {
  id: number;
  title?: string;
  original_title?: string;
  overview?: string;
  tagline?: string;
  homepage?: string;
  imdb_id?: string | null;
  budget?: number;
  revenue?: number;
  original_language?: string;
  images?: { backdrops?: Array<{ file_path?: string }> };
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  runtime?: number | null;
  genres?: TmdbGenre[];
  vote_average?: number;
  credits?: { crew?: TmdbCrewMember[]; cast?: TmdbCastEntry[] };
  videos?: { results?: TmdbVideo[] };
  'watch/providers'?: {
    results?: Record<
      string,
      {
        link?: string;
        flatrate?: TmdbProviderEntry[];
        rent?: TmdbProviderEntry[];
        buy?: TmdbProviderEntry[];
      }
    >;
  };
}

interface TmdbSearchResponse {
  results?: Array<{
    id: number;
    title?: string;
    original_title?: string;
    overview?: string;
    poster_path?: string | null;
    release_date?: string;
    vote_average?: number;
  }>;
}

export interface TmdbSearchResult {
  tmdbId: number;
  title: string;
  releaseDate: string | null;
  posterPath: string | null;
  voteAverage: number | null;
  overview: string | null;
}

@Injectable()
export class TmdbService {
  private readonly logger = new Logger(TmdbService.name);
  private readonly apiKey?: string;
  private readonly language: string;
  /** "Nerede izlenir" hangi ülkeye göre okunacak (TMDB bölge kodu) */
  private readonly watchRegion: string;

  constructor(
    private readonly cache: ExternalCacheService,
    config: ConfigService,
  ) {
    // UltNexus'ta jeton `TMDB_READ_ACCESS_TOKEN` adıyla duruyor olabilir;
    // iki isim de okunur, böylece hangisi doldurulmuşsa o kullanılır.
    this.apiKey =
      config.get<string>('TMDB_READ_ACCESS_TOKEN') ??
      config.get<string>('TMDB_API_KEY');
    this.language = config.get<string>('TMDB_LANGUAGE') ?? 'tr-TR';
    this.watchRegion = config.get<string>('TMDB_WATCH_REGION') ?? 'TR';
  }

  get isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  /** Arşive film eklerken kullanılan arama — cache'lenmez, sorgu her seferinde farklı. */
  async search(query: string): Promise<TmdbSearchResult[]> {
    const trimmed = query.trim();
    if (!trimmed) {
      return [];
    }
    const payload = await this.request<TmdbSearchResponse>('/search/movie', {
      query: trimmed,
      include_adult: 'false',
    });
    return (payload.results ?? []).slice(0, 20).map((item) => ({
      tmdbId: item.id,
      title: item.title ?? item.original_title ?? '',
      releaseDate: item.release_date || null,
      posterPath: item.poster_path ?? null,
      voteAverage:
        typeof item.vote_average === 'number' ? item.vote_average : null,
      overview: item.overview || null,
    }));
  }

  /**
   * Film künyesi. TTL dolmadıysa cache'ten döner; dış istek başarısız olursa
   * bayat kayıt kullanılır — kullanıcıya hata gösterilmez (kural 4/14).
   */
  async getMovie(tmdbId: number): Promise<TmdbMovie> {
    // v3: sahne kareleri, bütçe/hâsılat ve dil de künyeye girdi
    const cacheKey = `tmdb:movie:v3:${tmdbId}:${this.language}`;
    return this.cache.remember<TmdbMovie>(
      cacheKey,
      CACHE_TTL_MS,
      async () => {
        const raw = await this.request<TmdbMovieResponse>(`/movie/${tmdbId}`, {
          append_to_response: 'credits,videos,watch/providers,images',
          // Türkçe fragman çoğu filmde yok; dil kısıtı konmazsa liste boş döner
          include_video_language: 'tr,en,null',
          // Sahne kareleri yazısız olsun: dili olan görsellerde afiş yazısı var
          include_image_language: 'null',
        });
        return normalize(raw, this.watchRegion);
      },
      {
        onStale: (error) =>
          this.logger.warn(
            `TMDB ${tmdbId} yenilenemedi, bayat cache sunuluyor: ${String(error)}`,
          ),
      },
    );
  }

  /** Bu haftanın trendleri — öneri havuzunun "gündem" yarısı. */
  trending(): Promise<TmdbSearchResult[]> {
    return this.cachedList(
      `tmdb:trending:week:${this.language}`,
      '/trending/movie/week',
      {},
      LIST_CACHE_TTL_MS,
    );
  }

  /** Popüler filmler; havuzu genişletmek için birden çok sayfa çekilebilir. */
  popular(page = 1): Promise<TmdbSearchResult[]> {
    return this.cachedList(
      `tmdb:popular:${page}:${this.language}`,
      '/movie/popular',
      { page: String(page) },
      LIST_CACHE_TTL_MS,
    );
  }

  /**
   * Tür (ve istenirse dönem) taraması — öneri havuzunun "keşif" ayağı.
   *
   * Trend/popüler listeleri hep aynı bir avuç yeni gişe filmini döndürür;
   * geniş bir arşiv için işe yaramaz. Burada tür + dönem + sayfa birlikte
   * seçildiğinden havuz komediden korkuya, 80'lerden bugüne yayılabiliyor.
   * `vote_count` eşiği niş/çöp kayıtları eler, sıralama da ona göre.
   */
  discover(options: {
    genreId: number;
    page?: number;
    from?: string;
    to?: string;
    minVotes?: number;
  }): Promise<TmdbSearchResult[]> {
    const { genreId, page = 1, from, to, minVotes = 200 } = options;
    const params: Record<string, string> = {
      with_genres: String(genreId),
      sort_by: 'vote_count.desc',
      'vote_count.gte': String(minVotes),
      include_adult: 'false',
      page: String(page),
    };
    if (from) {
      params['primary_release_date.gte'] = from;
    }
    if (to) {
      params['primary_release_date.lte'] = to;
    }
    const era = from || to ? `${from ?? ''}_${to ?? ''}` : 'all';
    return this.cachedList(
      `tmdb:discover:${genreId}:${era}:${page}:${minVotes}:${this.language}`,
      '/discover/movie',
      params,
      // Tür listeleri gündemden çok daha yavaş değişir — künye TTL'i yeterli
      CACHE_TTL_MS,
    );
  }

  /** Bir filme benzeyenler — öneri havuzunun "senin zevkin" yarısı. */
  recommendations(tmdbId: number): Promise<TmdbSearchResult[]> {
    return this.cachedList(
      `tmdb:recommendations:${tmdbId}:${this.language}`,
      `/movie/${tmdbId}/recommendations`,
      {},
      CACHE_TTL_MS,
    );
  }

  /**
   * Liste uçları için ortak cache'li okuma. Künye okumasıyla aynı davranış:
   * TTL dolmadıysa cache, dış istek düşerse bayat cache (kural 4/14).
   */
  private async cachedList(
    cacheKey: string,
    path: string,
    params: Record<string, string>,
    ttlMs: number,
  ): Promise<TmdbSearchResult[]> {
    return this.cache.remember<TmdbSearchResult[]>(
      cacheKey,
      ttlMs,
      async () => {
        const payload = await this.request<TmdbSearchResponse>(path, params);
        // Postersiz film öneri duvarında boş kare bırakıyor — havuza alınmaz
        return (payload.results ?? [])
          .filter((item) => Boolean(item.poster_path))
          .map((item) => ({
            tmdbId: item.id,
            title: item.title ?? item.original_title ?? '',
            releaseDate: item.release_date || null,
            posterPath: item.poster_path ?? null,
            voteAverage:
              typeof item.vote_average === 'number' ? item.vote_average : null,
            overview: item.overview || null,
          }));
      },
      {
        onStale: (error) =>
          this.logger.warn(
            `TMDB ${path} yenilenemedi, bayat cache sunuluyor: ${String(error)}`,
          ),
      },
    );
  }

  private async request<T>(
    path: string,
    params: Record<string, string> = {},
  ): Promise<T> {
    if (!this.apiKey) {
      throw new ServiceUnavailableException('MOVIES.TMDB_NOT_CONFIGURED');
    }
    const url = new URL(`${TMDB_BASE}${path}`);
    url.searchParams.set('language', this.language);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    // TMDB iki kimlik tipi veriyor ve ikisi de "key" diye anılıyor:
    // v3 API key sorgu parametresi, v4 okuma jetonu (JWT) Bearer başlığı ister.
    // Hangisi girilirse girilsin çalışsın diye biçimden ayırt ediliyor.
    const headers: Record<string, string> = { accept: 'application/json' };
    if (isBearerToken(this.apiKey)) {
      headers.authorization = `Bearer ${this.apiKey}`;
    } else {
      url.searchParams.set('api_key', this.apiKey);
    }

    // Zaman aşımı olmadan asılı kalan bir istek çağıranı da askıda tutar.
    // 2026-08-04: aynı eksiklik Open Library'de kitap aramasını 40 saniyeye
    // çıkardı; TMDB o gün ayaktaydı diye burada görülmemişti.
    const response = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) {
      this.logger.warn(`TMDB ${path} → ${response.status}`);
      throw new ServiceUnavailableException('MOVIES.TMDB_UNAVAILABLE');
    }
    return (await response.json()) as T;
  }
}

// v4 okuma jetonu bir JWT'dir: "eyJ" ile başlar ve v3 anahtarından çok uzundur
function isBearerToken(key: string): boolean {
  return key.startsWith('eyJ');
}

// Kadro sayfada tek şeride sığsın diye başrollerle sınırlı
const CAST_LIMIT = 12;
// Sol sütundaki sahne şeridi kaç kare taşır
const STILL_LIMIT = 6;

function normalize(raw: TmdbMovieResponse, watchRegion: string): TmdbMovie {
  const director =
    raw.credits?.crew?.find((member) => member.job === 'Director')?.name ??
    null;
  return {
    tmdbId: raw.id,
    title: raw.title ?? raw.original_title ?? '',
    originalTitle: raw.original_title ?? null,
    overview: raw.overview || null,
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    releaseDate: raw.release_date || null,
    runtime: raw.runtime ?? null,
    genres: (raw.genres ?? []).map((genre) => genre.name),
    voteAverage: typeof raw.vote_average === 'number' ? raw.vote_average : null,
    director,
    tagline: raw.tagline || null,
    imdbId: raw.imdb_id || null,
    homepage: raw.homepage || null,
    cast: (raw.credits?.cast ?? []).slice(0, CAST_LIMIT).map((member) => ({
      name: member.name ?? '',
      character: member.character || null,
      profilePath: member.profile_path ?? null,
    })),
    trailerKey: pickTrailer(raw.videos?.results),
    providers: pickProviders(raw['watch/providers']?.results?.[watchRegion]),
    providerLink: raw['watch/providers']?.results?.[watchRegion]?.link ?? null,
    // Sayfanın kendi backdrop'u zaten üstte; şeride ondan sonrakiler girer
    stills: (raw.images?.backdrops ?? [])
      .map((image) => image.file_path)
      .filter((path): path is string => Boolean(path))
      .filter((path) => path !== raw.backdrop_path)
      .slice(0, STILL_LIMIT),
    budget: raw.budget ? raw.budget : null,
    revenue: raw.revenue ? raw.revenue : null,
    originalLanguage: raw.original_language ?? null,
  };
}

/**
 * Fragman seçimi: önce resmi YouTube fragmanı, sonra herhangi bir YouTube
 * fragmanı, en sonda ilk YouTube videosu (teaser/klip). Vimeo ve diğerleri
 * alınmaz — gömülü oynatıcı yalnızca YouTube ile çalışıyor.
 */
function pickTrailer(videos: TmdbVideo[] | undefined): string | null {
  const youtube = (videos ?? []).filter(
    (video) => video.site === 'YouTube' && video.key,
  );
  const official = youtube.find(
    (video) => video.type === 'Trailer' && video.official,
  );
  const trailer = youtube.find((video) => video.type === 'Trailer');
  return (official ?? trailer ?? youtube[0])?.key ?? null;
}

/**
 * Platform listesi. Aynı platform hem abonelikte hem kirada görünebiliyor;
 * abonelik önce geliyor ve tekrar edenler eleniyor — "Netflix · Netflix"
 * gibi bir rozet sırası okunmuyor.
 */
function pickProviders(
  region:
    | {
        flatrate?: TmdbProviderEntry[];
        rent?: TmdbProviderEntry[];
        buy?: TmdbProviderEntry[];
      }
    | undefined,
): TmdbProvider[] {
  const groups: Array<[TmdbProvider['kind'], TmdbProviderEntry[]]> = [
    ['FLATRATE', region?.flatrate ?? []],
    ['RENT', region?.rent ?? []],
    ['BUY', region?.buy ?? []],
  ];
  const seen = new Set<string>();
  const providers: TmdbProvider[] = [];
  for (const [kind, entries] of groups) {
    for (const entry of entries) {
      const name = entry.provider_name;
      if (!name || seen.has(name)) {
        continue;
      }
      seen.add(name);
      providers.push({ name, logoPath: entry.logo_path ?? null, kind });
    }
  }
  return providers;
}
