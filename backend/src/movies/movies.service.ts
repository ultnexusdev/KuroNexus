import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  TmdbService,
  type TmdbMovie,
  type TmdbSearchResult,
} from './tmdb.service';
import { CreateMovieEntryDto } from './dto/create-movie-entry.dto';
import { UpdateMovieEntryDto } from './dto/update-movie-entry.dto';
import type { MovieEntry, Prisma } from '../generated/prisma/client';

// Öneri havuzu: kaç kaynak filmden benzer istenir, havuz kaç film taşır
const SUGGESTION_SEEDS = 3;
const SUGGESTION_POOL = 40;

// Salon girişinin iki yanındaki afişler — başlık burada, yol TMDB'den gelir
const SHOWCASE_LEFT = { query: 'The Matrix', year: '1999' };
const SHOWCASE_RIGHT = {
  query: 'The Lord of the Rings: The Fellowship of the Ring',
  year: '2001',
};
const SHOWCASE_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface ShowcasePoster {
  title: string;
  posterPath: string;
}

// Salonun künye şeridi: arşivin özeti
export interface MovieArchiveStats {
  total: number;
  watchedThisYear: number;
  averageRating: number | null;
  watchlist: number;
}

export interface ArchiveMovie {
  id: string;
  tmdbId: number;
  status: MovieEntry['status'];
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

@Injectable()
export class MoviesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tmdb: TmdbService,
  ) {}

  // --- Public ---

  /**
   * Salonun tamamı tek istekte döner: arşiv küçük (yüzlerce kayıt), sayfalama
   * yerine istemci tarafı sekme/filtre çok daha akıcı bir okuma sağlıyor.
   */
  async getArchive(): Promise<{
    movies: ArchiveMovie[];
    stats: MovieArchiveStats;
    directors: Array<{ name: string; count: number }>;
    genres: string[];
  }> {
    const entries = await this.prisma.movieEntry.findMany({
      where: { isDeleted: false },
      orderBy: [{ watchedAt: 'desc' }, { createdAt: 'desc' }],
    });

    const movies = entries.map((entry) => toArchiveMovie(entry));
    return {
      movies,
      stats: buildStats(entries, movies),
      directors: topDirectors(movies),
      genres: allGenres(movies),
    };
  }

  /**
   * Küratör modundaki "Öneriler" havuzu.
   *
   * Yarısı gündem (trend + popüler), yarısı zevk (favorilerine benzeyenler);
   * ikisi dönüşümlü diziliyor, böylece liste ne tamamen gişe ne tamamen
   * kendi kuyruğunu kovalayan bir şey oluyor. **Arşivde bir kez yer almış
   * her tmdbId elenir** — silinmişler dahil: arşivden çıkardığın bir filmi
   * öneri olarak geri getirmek istemezsin.
   *
   * Havuz olduğu gibi döner (~40); onluk seçim ve "ilgilenmiyorum" istemcide
   * tutulur, böylece "Yenile" her seferinde TMDB'ye gitmez.
   */
  async suggestions(): Promise<TmdbSearchResult[]> {
    const entries = await this.prisma.movieEntry.findMany({
      select: { tmdbId: true, isFavorite: true, isDeleted: true },
      orderBy: { createdAt: 'desc' },
    });
    const known = new Set(entries.map((entry) => entry.tmdbId));

    // Zevk kaynağı: önce favoriler, yoksa arşivdeki en yeni kayıtlar
    const favorites = entries.filter(
      (entry) => entry.isFavorite && !entry.isDeleted,
    );
    const seeds = (favorites.length > 0
      ? favorites
      : entries.filter((entry) => !entry.isDeleted)
    ).slice(0, SUGGESTION_SEEDS);

    const safe = async (
      promise: Promise<TmdbSearchResult[]>,
    ): Promise<TmdbSearchResult[]> => {
      try {
        return await promise;
      } catch {
        // Bir kaynak düşerse öneri hiç gelmesin diye değil, eksik gelsin diye
        return [];
      }
    };

    const [trending, popular1, popular2, ...tasteLists] = await Promise.all([
      safe(this.tmdb.trending()),
      safe(this.tmdb.popular(1)),
      safe(this.tmdb.popular(2)),
      ...seeds.map((seed) => safe(this.tmdb.recommendations(seed.tmdbId))),
    ]);

    const buzz = shuffle(dedupe([...trending, ...popular1, ...popular2], known));
    const taste = shuffle(dedupe(tasteLists.flat(), known));

    // Dönüşümlü dizim: bir gündem, bir zevk
    const mixed: TmdbSearchResult[] = [];
    for (let i = 0; i < Math.max(buzz.length, taste.length); i += 1) {
      if (i < buzz.length) {
        mixed.push(buzz[i]);
      }
      if (i < taste.length) {
        mixed.push(taste[i]);
      }
      if (mixed.length >= SUGGESTION_POOL) {
        break;
      }
    }
    return mixed.slice(0, SUGGESTION_POOL);
  }

  /**
   * Salon girişinin iki yanındaki afişler.
   *
   * Poster yolları koda GÖMÜLMEZ (TMDB yolları değişebilir): başlıkla aranır,
   * yıl doğrulanır ve sonuç cache'lenir. Anahtar tanımsızsa ya da arama
   * düşerse boş döner — lobi CSS sahnesiyle açılır, hata göstermez.
   */
  async showcase(): Promise<{
    left: ShowcasePoster | null;
    right: ShowcasePoster | null;
  }> {
    const cacheKey = 'movies:showcase:v1';
    const cached = await this.prisma.externalCache.findUnique({
      where: { cacheKey },
    });
    if (
      cached &&
      Date.now() - cached.fetchedAt.getTime() < SHOWCASE_CACHE_TTL_MS
    ) {
      return cached.payload as unknown as {
        left: ShowcasePoster | null;
        right: ShowcasePoster | null;
      };
    }

    const resolve = async (
      query: string,
      year: string,
    ): Promise<ShowcasePoster | null> => {
      try {
        const results = await this.tmdb.search(query);
        const match =
          results.find((item) => item.releaseDate?.startsWith(year)) ??
          results[0];
        if (!match?.posterPath) {
          return null;
        }
        return { title: match.title, posterPath: match.posterPath };
      } catch {
        return null;
      }
    };

    const [left, right] = await Promise.all([
      resolve(SHOWCASE_LEFT.query, SHOWCASE_LEFT.year),
      resolve(SHOWCASE_RIGHT.query, SHOWCASE_RIGHT.year),
    ]);
    const payload = { left, right };

    // İkisi de boşsa cache'leme: anahtar sonradan tanımlanınca hemen dolsun
    if (left || right) {
      await this.prisma.externalCache.upsert({
        where: { cacheKey },
        create: {
          cacheKey,
          payload: payload as unknown as object,
          fetchedAt: new Date(),
        },
        update: {
          payload: payload as unknown as object,
          fetchedAt: new Date(),
        },
      });
    } else if (cached) {
      return cached.payload as unknown as {
        left: ShowcasePoster | null;
        right: ShowcasePoster | null;
      };
    }
    return payload;
  }

  // --- Admin ---

  search(query: string) {
    return this.tmdb.search(query);
  }

  findAllForAdmin() {
    return this.prisma.movieEntry.findMany({
      where: { isDeleted: false },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(dto: CreateMovieEntryDto, userId: string): Promise<MovieEntry> {
    const existing = await this.prisma.movieEntry.findFirst({
      where: { userId, tmdbId: dto.tmdbId, isDeleted: false },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('MOVIES.ALREADY_IN_ARCHIVE');
    }

    const snapshot = await this.snapshot(dto.tmdbId);
    return this.prisma.movieEntry.upsert({
      // Soft-delete edilmiş bir kayıt varsa unique kısıt yüzünden create patlar;
      // aynı film yeniden eklendiğinde o kayıt canlandırılır.
      where: { userId_tmdbId: { userId, tmdbId: dto.tmdbId } },
      create: {
        tmdbId: dto.tmdbId,
        status: dto.status ?? 'WATCHED',
        isFavorite: dto.isFavorite ?? false,
        personalRating: dto.personalRating,
        personalNote: dto.personalNote,
        watchedAt: dto.watchedAt ? new Date(dto.watchedAt) : null,
        externalData: snapshot.payload,
        externalDataFetchedAt: snapshot.fetchedAt,
        userId,
      },
      update: {
        status: dto.status ?? 'WATCHED',
        isFavorite: dto.isFavorite ?? false,
        personalRating: dto.personalRating ?? null,
        personalNote: dto.personalNote ?? null,
        watchedAt: dto.watchedAt ? new Date(dto.watchedAt) : null,
        externalData: snapshot.payload,
        externalDataFetchedAt: snapshot.fetchedAt,
        isDeleted: false,
      },
    });
  }

  async update(id: string, dto: UpdateMovieEntryDto): Promise<MovieEntry> {
    await this.findByIdOrFail(id);
    const data: Prisma.MovieEntryUncheckedUpdateInput = {
      status: dto.status,
      isFavorite: dto.isFavorite,
      personalRating: dto.personalRating,
      personalNote: dto.personalNote,
      ...(dto.watchedAt !== undefined && {
        watchedAt: dto.watchedAt ? new Date(dto.watchedAt) : null,
      }),
    };
    return this.prisma.movieEntry.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<MovieEntry> {
    await this.findByIdOrFail(id);
    return this.prisma.movieEntry.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  /** Künyeyi TMDB'den tazeler — kişisel puan ve not değişmez (kural 4). */
  async refresh(id: string): Promise<MovieEntry> {
    const entry = await this.findByIdOrFail(id);
    const snapshot = await this.snapshot(entry.tmdbId);
    return this.prisma.movieEntry.update({
      where: { id },
      data: {
        externalData: snapshot.payload,
        externalDataFetchedAt: snapshot.fetchedAt,
      },
    });
  }

  private async findByIdOrFail(id: string): Promise<MovieEntry> {
    const entry = await this.prisma.movieEntry.findFirst({
      where: { id, isDeleted: false },
    });
    if (!entry) {
      throw new NotFoundException('MOVIES.NOT_FOUND');
    }
    return entry;
  }

  // TMDB erişilemezse kayıt yine de açılır; künye bir sonraki tazelemede dolar
  private async snapshot(tmdbId: number): Promise<{
    payload: Prisma.InputJsonValue | undefined;
    fetchedAt: Date | null;
  }> {
    try {
      const movie = await this.tmdb.getMovie(tmdbId);
      return {
        payload: movie as unknown as Prisma.InputJsonValue,
        fetchedAt: new Date(),
      };
    } catch {
      return { payload: undefined, fetchedAt: null };
    }
  }
}

/** Arşivde olanları ve tekrarları eler. */
function dedupe(
  items: TmdbSearchResult[],
  known: Set<number>,
): TmdbSearchResult[] {
  const seen = new Set<number>();
  return items.filter((item) => {
    if (known.has(item.tmdbId) || seen.has(item.tmdbId)) {
      return false;
    }
    seen.add(item.tmdbId);
    return true;
  });
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function toArchiveMovie(entry: MovieEntry): ArchiveMovie {
  const data = (entry.externalData ?? null) as TmdbMovie | null;
  const releaseYear = data?.releaseDate
    ? Number.parseInt(data.releaseDate.slice(0, 4), 10)
    : null;
  return {
    id: entry.id,
    tmdbId: entry.tmdbId,
    status: entry.status,
    isFavorite: entry.isFavorite,
    personalRating: entry.personalRating,
    personalNote: entry.personalNote,
    watchedAt: entry.watchedAt ? entry.watchedAt.toISOString() : null,
    // Künye alınamamışsa başlık yerine TMDB numarası gösterilir, sayfa çökmez
    title: data?.title ?? `#${entry.tmdbId}`,
    overview: data?.overview ?? null,
    posterPath: data?.posterPath ?? null,
    backdropPath: data?.backdropPath ?? null,
    releaseYear: Number.isFinite(releaseYear) ? releaseYear : null,
    runtime: data?.runtime ?? null,
    genres: data?.genres ?? [],
    voteAverage: data?.voteAverage ?? null,
    director: data?.director ?? null,
  };
}

function buildStats(
  entries: MovieEntry[],
  movies: ArchiveMovie[],
): MovieArchiveStats {
  const currentYear = new Date().getFullYear();
  const rated = entries.filter(
    (entry) => typeof entry.personalRating === 'number',
  );
  const sum = rated.reduce((acc, entry) => acc + (entry.personalRating ?? 0), 0);
  return {
    total: movies.filter((movie) => movie.status !== 'WATCHLIST').length,
    watchedThisYear: entries.filter(
      (entry) => entry.watchedAt?.getFullYear() === currentYear,
    ).length,
    averageRating: rated.length > 0 ? Number((sum / rated.length).toFixed(1)) : null,
    watchlist: entries.filter((entry) => entry.status === 'WATCHLIST').length,
  };
}

// Salon altındaki "Favori Yönetmenler" şeridi arşivden türetilir — elle yazılmaz
function topDirectors(
  movies: ArchiveMovie[],
): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();
  for (const movie of movies) {
    if (!movie.director) {
      continue;
    }
    // Favoriler iki kat ağırlık taşır: sevdiğin yönetmen öne çıksın
    const weight = movie.isFavorite ? 2 : 1;
    counts.set(movie.director, (counts.get(movie.director) ?? 0) + weight);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'tr'))
    .slice(0, 6);
}

function allGenres(movies: ArchiveMovie[]): string[] {
  const seen = new Set<string>();
  for (const movie of movies) {
    for (const genre of movie.genres) {
      seen.add(genre);
    }
  }
  return [...seen].sort((a, b) => a.localeCompare(b, 'tr'));
}
