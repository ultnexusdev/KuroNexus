import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

/**
 * TMDB erişimi. Anahtar yalnızca backend `.env`'de durur, frontend'e asla
 * verilmez (kural 4). Her yanıt `ExternalCache`e yazılır: film künyesi
 * neredeyse hiç değişmez, her sayfa açılışında dış istek atmak gereksizdir.
 */

const TMDB_BASE = 'https://api.themoviedb.org/3';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // kural 14: varsayılan 7 gün

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
}

interface TmdbGenre {
  id: number;
  name: string;
}

interface TmdbCrewMember {
  job?: string;
  name?: string;
}

interface TmdbMovieResponse {
  id: number;
  title?: string;
  original_title?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  runtime?: number | null;
  genres?: TmdbGenre[];
  vote_average?: number;
  credits?: { crew?: TmdbCrewMember[] };
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

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService,
  ) {
    // UltNexus'ta jeton `TMDB_READ_ACCESS_TOKEN` adıyla duruyor olabilir;
    // iki isim de okunur, böylece hangisi doldurulmuşsa o kullanılır.
    this.apiKey =
      config.get<string>('TMDB_READ_ACCESS_TOKEN') ??
      config.get<string>('TMDB_API_KEY');
    this.language = config.get<string>('TMDB_LANGUAGE') ?? 'tr-TR';
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
      voteAverage: typeof item.vote_average === 'number' ? item.vote_average : null,
      overview: item.overview || null,
    }));
  }

  /**
   * Film künyesi. TTL dolmadıysa cache'ten döner; dış istek başarısız olursa
   * bayat kayıt kullanılır — kullanıcıya hata gösterilmez (kural 4/14).
   */
  async getMovie(tmdbId: number): Promise<TmdbMovie> {
    const cacheKey = `tmdb:movie:${tmdbId}:${this.language}`;
    const cached = await this.prisma.externalCache.findUnique({
      where: { cacheKey },
    });
    const isFresh =
      cached && Date.now() - cached.fetchedAt.getTime() < CACHE_TTL_MS;
    if (cached && isFresh) {
      return cached.payload as unknown as TmdbMovie;
    }

    try {
      const raw = await this.request<TmdbMovieResponse>(`/movie/${tmdbId}`, {
        append_to_response: 'credits',
      });
      const movie = normalize(raw);
      await this.prisma.externalCache.upsert({
        where: { cacheKey },
        create: {
          cacheKey,
          payload: movie as unknown as object,
          fetchedAt: new Date(),
        },
        update: {
          payload: movie as unknown as object,
          fetchedAt: new Date(),
        },
      });
      return movie;
    } catch (error) {
      if (cached) {
        this.logger.warn(
          `TMDB ${tmdbId} yenilenemedi, bayat cache sunuluyor: ${String(error)}`,
        );
        return cached.payload as unknown as TmdbMovie;
      }
      throw error;
    }
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

    const response = await fetch(url, { headers });
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

function normalize(raw: TmdbMovieResponse): TmdbMovie {
  const director =
    raw.credits?.crew?.find((member) => member.job === 'Director')?.name ?? null;
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
  };
}
