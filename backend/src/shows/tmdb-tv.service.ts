import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

/**
 * TMDB dizi (tv) erişimi — `movies/tmdb.service.ts`'in TV karşılığı. Anahtar
 * ikisi arasında paylaşılır (aynı TMDB hesabı), o yüzden burada da yalnızca
 * backend `.env`'de durur (kural 4). Her yanıt `ExternalCache`e yazılır.
 *
 * Film servisinden iki fark: (1) alan adları TMDB'nin dizi şemasına göre
 * (name/first_air_date/created_by, bütçe-hâsılat yok, sezon/bölüm sayısı
 * var), (2) her liste yanıtı **anime elemesinden** geçer — bkz. `isAnime`.
 */

const TMDB_BASE = 'https://api.themoviedb.org/3';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // kural 14: varsayılan 7 gün
const LIST_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

// TMDB'nin "Animation" tür numarası. Anime salonu (Salon 04) zaten AniList
// ile beslendiğinden, dizi salonunun arama/keşif sonuçlarında Animasyon +
// Japonya kökenli kayıtlar elenir — aynı içerik iki salonda birden çıkmasın.
const ANIME_GENRE_ID = 16;
const ANIME_ORIGIN = 'JP';

export interface TmdbCastMember {
  name: string;
  character: string | null;
  profilePath: string | null;
}

export interface TmdbProvider {
  name: string;
  logoPath: string | null;
  kind: 'FLATRATE' | 'RENT' | 'BUY';
}

export interface TmdbShow {
  tmdbId: number;
  title: string;
  originalTitle: string | null;
  overview: string | null;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  /** Ortalama bölüm süresi (dakika) — filmin `runtime` alanının karşılığı */
  runtime: number | null;
  numberOfSeasons: number | null;
  numberOfEpisodes: number | null;
  /** TMDB durumu: "Returning Series" / "Ended" / "Canceled" vb. */
  airStatus: string | null;
  genres: string[];
  voteAverage: number | null;
  /** created_by — filmin tek yönetmenine karşılık, dizide birden çok olabilir */
  director: string | null;
  tagline: string | null;
  imdbId: string | null;
  homepage: string | null;
  cast: TmdbCastMember[];
  trailerKey: string | null;
  providers: TmdbProvider[];
  providerLink: string | null;
  stills: string[];
  originalLanguage: string | null;
  /** Kökeni Kore olan dizileri işaretlemek için (Kore Dramaları rafı) */
  originCountry: string[];
}

interface TmdbGenre {
  id: number;
  name: string;
}

interface TmdbCastEntry {
  name?: string;
  character?: string;
  profile_path?: string | null;
}

interface TmdbCreator {
  name?: string;
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

interface TmdbShowResponse {
  id: number;
  name?: string;
  original_name?: string;
  overview?: string;
  tagline?: string;
  homepage?: string;
  original_language?: string;
  status?: string;
  images?: { backdrops?: Array<{ file_path?: string }> };
  poster_path?: string | null;
  backdrop_path?: string | null;
  first_air_date?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  episode_run_time?: number[];
  last_episode_to_air?: { runtime?: number | null } | null;
  genres?: TmdbGenre[];
  vote_average?: number;
  created_by?: TmdbCreator[];
  origin_country?: string[];
  credits?: { cast?: TmdbCastEntry[] };
  videos?: { results?: TmdbVideo[] };
  external_ids?: { imdb_id?: string | null };
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

interface TmdbSearchItem {
  id: number;
  name?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string | null;
  first_air_date?: string;
  vote_average?: number;
  genre_ids?: number[];
  origin_country?: string[];
}

interface TmdbSearchResponse {
  results?: TmdbSearchItem[];
}

export interface TmdbSearchResult {
  tmdbId: number;
  title: string;
  releaseDate: string | null;
  posterPath: string | null;
  voteAverage: number | null;
  overview: string | null;
}

/** Animasyon + Japonya kökenli kayıtlar dizi salonuna hiç girmesin. */
function isAnime(item: TmdbSearchItem): boolean {
  return (
    (item.genre_ids ?? []).includes(ANIME_GENRE_ID) &&
    (item.origin_country ?? []).includes(ANIME_ORIGIN)
  );
}

@Injectable()
export class TmdbTvService {
  private readonly logger = new Logger(TmdbTvService.name);
  private readonly apiKey?: string;
  private readonly language: string;
  private readonly watchRegion: string;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService,
  ) {
    this.apiKey =
      config.get<string>('TMDB_READ_ACCESS_TOKEN') ??
      config.get<string>('TMDB_API_KEY');
    this.language = config.get<string>('TMDB_LANGUAGE') ?? 'tr-TR';
    this.watchRegion = config.get<string>('TMDB_WATCH_REGION') ?? 'TR';
  }

  get isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  /** Arşive dizi eklerken kullanılan arama — cache'lenmez. */
  async search(query: string): Promise<TmdbSearchResult[]> {
    const trimmed = query.trim();
    if (!trimmed) {
      return [];
    }
    const payload = await this.request<TmdbSearchResponse>('/search/tv', {
      query: trimmed,
      include_adult: 'false',
    });
    return (payload.results ?? [])
      .filter((item) => !isAnime(item))
      .slice(0, 20)
      .map(toSearchResult);
  }

  /** Dizi künyesi. TTL dolmadıysa cache'ten döner (kural 4/14). */
  async getShow(tmdbId: number): Promise<TmdbShow> {
    const cacheKey = `tmdb:show:v1:${tmdbId}:${this.language}`;
    const cached = await this.prisma.externalCache.findUnique({
      where: { cacheKey },
    });
    const isFresh =
      cached && Date.now() - cached.fetchedAt.getTime() < CACHE_TTL_MS;
    if (cached && isFresh) {
      return cached.payload as unknown as TmdbShow;
    }

    try {
      const raw = await this.request<TmdbShowResponse>(`/tv/${tmdbId}`, {
        append_to_response:
          'credits,videos,watch/providers,images,external_ids',
        include_video_language: 'tr,en,null',
        include_image_language: 'null',
      });
      const show = normalize(raw, this.watchRegion);
      await this.prisma.externalCache.upsert({
        where: { cacheKey },
        create: {
          cacheKey,
          payload: show as unknown as object,
          fetchedAt: new Date(),
        },
        update: { payload: show as unknown as object, fetchedAt: new Date() },
      });
      return show;
    } catch (error) {
      if (cached) {
        this.logger.warn(
          `TMDB tv/${tmdbId} yenilenemedi, bayat cache sunuluyor: ${String(error)}`,
        );
        return cached.payload as unknown as TmdbShow;
      }
      throw error;
    }
  }

  trending(): Promise<TmdbSearchResult[]> {
    return this.cachedList(
      `tmdb:show:trending:week:${this.language}`,
      '/trending/tv/week',
      {},
      LIST_CACHE_TTL_MS,
    );
  }

  popular(page = 1): Promise<TmdbSearchResult[]> {
    return this.cachedList(
      `tmdb:show:popular:${page}:${this.language}`,
      '/tv/popular',
      { page: String(page) },
      LIST_CACHE_TTL_MS,
    );
  }

  discover(options: {
    genreId: number;
    page?: number;
    from?: string;
    to?: string;
    minVotes?: number;
  }): Promise<TmdbSearchResult[]> {
    const { genreId, page = 1, from, to, minVotes = 100 } = options;
    const params: Record<string, string> = {
      with_genres: String(genreId),
      sort_by: 'vote_count.desc',
      'vote_count.gte': String(minVotes),
      page: String(page),
    };
    if (from) {
      params['first_air_date.gte'] = from;
    }
    if (to) {
      params['first_air_date.lte'] = to;
    }
    const era = from || to ? `${from ?? ''}_${to ?? ''}` : 'all';
    return this.cachedList(
      `tmdb:show:discover:${genreId}:${era}:${page}:${minVotes}:${this.language}`,
      '/discover/tv',
      params,
      CACHE_TTL_MS,
    );
  }

  recommendations(tmdbId: number): Promise<TmdbSearchResult[]> {
    return this.cachedList(
      `tmdb:show:recommendations:${tmdbId}:${this.language}`,
      `/tv/${tmdbId}/recommendations`,
      {},
      CACHE_TTL_MS,
    );
  }

  private async cachedList(
    cacheKey: string,
    path: string,
    params: Record<string, string>,
    ttlMs: number,
  ): Promise<TmdbSearchResult[]> {
    const cached = await this.prisma.externalCache.findUnique({
      where: { cacheKey },
    });
    if (cached && Date.now() - cached.fetchedAt.getTime() < ttlMs) {
      return cached.payload as unknown as TmdbSearchResult[];
    }

    try {
      const payload = await this.request<TmdbSearchResponse>(path, params);
      const items = (payload.results ?? [])
        .filter((item) => Boolean(item.poster_path) && !isAnime(item))
        .map(toSearchResult);
      await this.prisma.externalCache.upsert({
        where: { cacheKey },
        create: {
          cacheKey,
          payload: items as unknown as object,
          fetchedAt: new Date(),
        },
        update: { payload: items as unknown as object, fetchedAt: new Date() },
      });
      return items;
    } catch (error) {
      if (cached) {
        this.logger.warn(
          `TMDB ${path} yenilenemedi, bayat cache sunuluyor: ${String(error)}`,
        );
        return cached.payload as unknown as TmdbSearchResult[];
      }
      throw error;
    }
  }

  private async request<T>(
    path: string,
    params: Record<string, string> = {},
  ): Promise<T> {
    if (!this.apiKey) {
      throw new ServiceUnavailableException('SHOWS.TMDB_NOT_CONFIGURED');
    }
    const url = new URL(`${TMDB_BASE}${path}`);
    url.searchParams.set('language', this.language);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    const headers: Record<string, string> = { accept: 'application/json' };
    if (isBearerToken(this.apiKey)) {
      headers.authorization = `Bearer ${this.apiKey}`;
    } else {
      url.searchParams.set('api_key', this.apiKey);
    }

    const response = await fetch(url, { headers });
    if (!response.ok) {
      this.logger.warn(`TMDB ${path} → ${response.status}`);
      throw new ServiceUnavailableException('SHOWS.TMDB_UNAVAILABLE');
    }
    return (await response.json()) as T;
  }
}

function isBearerToken(key: string): boolean {
  return key.startsWith('eyJ');
}

const CAST_LIMIT = 12;
const STILL_LIMIT = 6;

function toSearchResult(item: TmdbSearchItem): TmdbSearchResult {
  return {
    tmdbId: item.id,
    title: item.name ?? item.original_name ?? '',
    releaseDate: item.first_air_date || null,
    posterPath: item.poster_path ?? null,
    voteAverage:
      typeof item.vote_average === 'number' ? item.vote_average : null,
    overview: item.overview || null,
  };
}

function normalize(raw: TmdbShowResponse, watchRegion: string): TmdbShow {
  const creators = (raw.created_by ?? [])
    .map((creator) => creator.name)
    .filter((name): name is string => Boolean(name));
  const runtime =
    raw.episode_run_time?.[0] ?? raw.last_episode_to_air?.runtime ?? null;
  return {
    tmdbId: raw.id,
    title: raw.name ?? raw.original_name ?? '',
    originalTitle: raw.original_name ?? null,
    overview: raw.overview || null,
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    releaseDate: raw.first_air_date || null,
    runtime: runtime ?? null,
    numberOfSeasons: raw.number_of_seasons ?? null,
    numberOfEpisodes: raw.number_of_episodes ?? null,
    airStatus: raw.status || null,
    genres: (raw.genres ?? []).map((genre) => genre.name),
    voteAverage: typeof raw.vote_average === 'number' ? raw.vote_average : null,
    director: creators.length > 0 ? creators.join(', ') : null,
    tagline: raw.tagline || null,
    imdbId: raw.external_ids?.imdb_id || null,
    homepage: raw.homepage || null,
    cast: (raw.credits?.cast ?? []).slice(0, CAST_LIMIT).map((member) => ({
      name: member.name ?? '',
      character: member.character || null,
      profilePath: member.profile_path ?? null,
    })),
    trailerKey: pickTrailer(raw.videos?.results),
    providers: pickProviders(raw['watch/providers']?.results?.[watchRegion]),
    providerLink: raw['watch/providers']?.results?.[watchRegion]?.link ?? null,
    stills: (raw.images?.backdrops ?? [])
      .map((image) => image.file_path)
      .filter((path): path is string => Boolean(path))
      .filter((path) => path !== raw.backdrop_path)
      .slice(0, STILL_LIMIT),
    originalLanguage: raw.original_language ?? null,
    originCountry: raw.origin_country ?? [],
  };
}

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
