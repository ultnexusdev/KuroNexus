import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TmdbService, type TmdbMovie } from './tmdb.service';
import { CreateMovieEntryDto } from './dto/create-movie-entry.dto';
import { UpdateMovieEntryDto } from './dto/update-movie-entry.dto';
import type { MovieEntry, Prisma } from '../generated/prisma/client';

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
