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
const SUGGESTION_SEEDS = 4;
const SUGGESTION_POOL = 60;

// Keşif ayağı: her istekte bu türlerden kaçı taranır ve hangi sayfaya kadar
const DISCOVERY_QUERIES = 6;
const DISCOVERY_MAX_PAGE = 5;

/**
 * Keşif taramasının tür listesi (TMDB tür numaraları). Amaç arşivin
 * kendi türlerini tekrarlamak değil, listeyi bilinçli olarak genişletmek:
 * her istekte buradan rastgele birkaçı seçilir.
 */
const DISCOVERY_GENRES = [
  28, // Aksiyon
  12, // Macera
  16, // Animasyon
  35, // Komedi
  80, // Suç
  99, // Belgesel
  18, // Dram
  14, // Fantastik
  36, // Tarih
  27, // Korku
  9648, // Gizem
  10749, // Romantik
  878, // Bilim Kurgu
  53, // Gerilim
  10752, // Savaş
  37, // Western
];

/**
 * Dönem kovaları. `null` = tüm zamanlar; kalanlar havuza eski filmleri de
 * sokar — yalnız son yılların gişesi önerilmesin diye.
 */
const DISCOVERY_ERAS: Array<{ from?: string; to?: string } | null> = [
  null,
  { to: '1979-12-31' },
  { from: '1980-01-01', to: '1989-12-31' },
  { from: '1990-01-01', to: '1999-12-31' },
  { from: '2000-01-01', to: '2009-12-31' },
  { from: '2010-01-01', to: '2019-12-31' },
  { from: '2020-01-01' },
];

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
   * Üç ayaktan beslenir ve üçü dönüşümlü diziler:
   *  - **keşif**: rastgele tür + dönem taraması (havuzun ağırlığı burada —
   *    komedi/korku/macera, 80'ler ya da 2010'lar hep birlikte gelsin diye),
   *  - **zevk**: favorilere benzeyenler,
   *  - **gündem**: trend + popüler.
   *
   * **Arşivde bir kez yer almış her tmdbId elenir** (silinmişler dahil:
   * arşivden çıkardığın filmi öneri olarak geri getirmek istemezsin) ve
   * **"ilgilenmiyorum" denenler kalıcı olarak elenir** — o kayıt veritabanında
   * durur, öneri bir daha hiç gelmez; istenirse arama ile eklenebilir.
   *
   * Havuz olduğu gibi döner (~60); onluk seçim istemcide yapılır, böylece
   * "Yenile" her seferinde TMDB'ye gitmez.
   */
  async suggestions(userId: string): Promise<TmdbSearchResult[]> {
    const [entries, dismissals] = await Promise.all([
      this.prisma.movieEntry.findMany({
        select: { tmdbId: true, isFavorite: true, isDeleted: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.movieSuggestionDismissal.findMany({
        where: { userId },
        select: { tmdbId: true },
      }),
    ]);
    const known = new Set([
      ...entries.map((entry) => entry.tmdbId),
      ...dismissals.map((dismissal) => dismissal.tmdbId),
    ]);

    // Zevk kaynağı: önce favoriler, yoksa arşivdeki kayıtlar. Karıştırılıyor —
    // hep aynı üç favoriden beslenmesin, her istekte başka filmlere baksın.
    const favorites = entries.filter(
      (entry) => entry.isFavorite && !entry.isDeleted,
    );
    const seeds = shuffle(
      favorites.length > 0
        ? favorites
        : entries.filter((entry) => !entry.isDeleted),
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

    // Her istekte başka tür/dönem/sayfa üçlüsü: liste tur tur genişler
    const picks = shuffle(DISCOVERY_GENRES).slice(0, DISCOVERY_QUERIES);
    const discoveries = picks.map((genreId) => {
      const era =
        DISCOVERY_ERAS[Math.floor(Math.random() * DISCOVERY_ERAS.length)];
      return safe(
        this.tmdb.discover({
          genreId,
          page: 1 + Math.floor(Math.random() * DISCOVERY_MAX_PAGE),
          from: era?.from,
          to: era?.to,
        }),
      );
    });

    const [trending, popular1, ...rest] = await Promise.all([
      safe(this.tmdb.trending()),
      safe(this.tmdb.popular(1)),
      ...discoveries,
      ...seeds.map((seed) => safe(this.tmdb.recommendations(seed.tmdbId))),
    ]);
    const discovered = rest.slice(0, discoveries.length);
    const tasteLists = rest.slice(discoveries.length);

    const explore = shuffle(dedupe(discovered.flat(), known));
    const taste = shuffle(dedupe(tasteLists.flat(), known));
    const buzz = shuffle(dedupe([...trending, ...popular1], known));

    // Dönüşümlü dizim: iki keşif, bir zevk, bir gündem. Keşif ağır basıyor —
    // havuz gündemin dar penceresine sıkışmasın.
    const streams: TmdbSearchResult[][] = [explore, taste, explore, buzz];
    const cursors = [0, 0, 0, 0];
    const mixed: TmdbSearchResult[] = [];
    const taken = new Set<number>();
    while (mixed.length < SUGGESTION_POOL) {
      let progressed = false;
      for (let s = 0; s < streams.length; s += 1) {
        const stream = streams[s];
        // explore iki kez listede: aynı elemanı iki kez almamak için işaretli
        while (
          cursors[s] < stream.length &&
          taken.has(stream[cursors[s]].tmdbId)
        ) {
          cursors[s] += 1;
        }
        if (cursors[s] >= stream.length) {
          continue;
        }
        const item = stream[cursors[s]];
        cursors[s] += 1;
        taken.add(item.tmdbId);
        mixed.push(item);
        progressed = true;
        if (mixed.length >= SUGGESTION_POOL) {
          break;
        }
      }
      if (!progressed) {
        break;
      }
    }
    return mixed;
  }

  /**
   * "İlgilenmiyorum": film öneri havuzundan kalıcı olarak düşer. Arşive
   * dokunmaz — aynı film arama ile her zaman eklenebilir.
   */
  async dismissSuggestion(
    tmdbId: number,
    userId: string,
  ): Promise<{ tmdbId: number; dismissed: boolean }> {
    await this.prisma.movieSuggestionDismissal.upsert({
      where: { userId_tmdbId: { userId, tmdbId } },
      create: { tmdbId, userId },
      update: {},
    });
    return { tmdbId, dismissed: true };
  }

  /** Yanlışlıkla elenen filmi havuza geri alır. */
  async restoreSuggestion(
    tmdbId: number,
    userId: string,
  ): Promise<{ tmdbId: number; dismissed: boolean }> {
    await this.prisma.movieSuggestionDismissal.deleteMany({
      where: { userId, tmdbId },
    });
    return { tmdbId, dismissed: false };
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
  const sum = rated.reduce(
    (acc, entry) => acc + (entry.personalRating ?? 0),
    0,
  );
  return {
    total: movies.filter((movie) => movie.status !== 'WATCHLIST').length,
    watchedThisYear: entries.filter(
      (entry) => entry.watchedAt?.getFullYear() === currentYear,
    ).length,
    averageRating:
      rated.length > 0 ? Number((sum / rated.length).toFixed(1)) : null,
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
