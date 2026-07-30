import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  TmdbTvService,
  type TmdbCastMember,
  type TmdbShow,
  type TmdbProvider,
  type TmdbSearchResult,
} from './tmdb-tv.service';
import { slugify } from '../common/utils/slugify';
import { CreateShowEntryDto } from './dto/create-show-entry.dto';
import { UpdateShowEntryDto } from './dto/update-show-entry.dto';
import type { ShowEntry, Prisma } from '../generated/prisma/client';

/**
 * Dizi salonu servisi — `movies/movies.service.ts`'in bire bir aynısı, tek
 * kaynak farklı (TMDB'nin tv uçları). Kore Dramaları rafı için tek ek alan:
 * `originCountry` — arşiv kartına taşınır, raf süzgeci istemci tarafında
 * (film salonundaki tür süzgeciyle aynı desende) uygular.
 */

const SUGGESTION_SEEDS = 4;
const SUGGESTION_POOL = 60;
const SIMILAR_LIMIT = 12;
const DISCOVERY_QUERIES = 6;
const DISCOVERY_MAX_PAGE = 5;

/** TMDB'nin dizi tür numaraları (filmden ayrı bir liste — kimlikler farklı). */
const DISCOVERY_GENRES = [
  10759, // Aksiyon & Macera
  35, // Komedi
  80, // Suç
  99, // Belgesel
  18, // Dram
  10751, // Aile
  9648, // Gizem
  10765, // Bilim Kurgu & Fantastik
  10768, // Savaş & Politika
  37, // Western
];

const DISCOVERY_ERAS: Array<{ from?: string; to?: string } | null> = [
  null,
  { to: '1989-12-31' },
  { from: '1990-01-01', to: '1999-12-31' },
  { from: '2000-01-01', to: '2009-12-31' },
  { from: '2010-01-01', to: '2019-12-31' },
  { from: '2020-01-01' },
];

// Salon girişinin iki yanındaki afişler
const SHOWCASE_LEFT = { query: 'Game of Thrones', year: '2011' };
const SHOWCASE_RIGHT = { query: 'Spartacus', year: '2010' };
const SHOWCASE_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface ShowcasePoster {
  title: string;
  posterPath: string;
}

export interface ShowArchiveStats {
  total: number;
  watchedThisYear: number;
  averageRating: number | null;
  watchlist: number;
}

export type ShowLinkKind = 'TMDB' | 'IMDB' | 'RT' | 'HOMEPAGE';

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

const SHOW_LINK_FIELDS = [
  'rt',
  'imdb',
  'trailer',
] as const satisfies ReadonlyArray<keyof ShowCustomLinks>;

function normalizeUrl(value: string | null | undefined): string | null {
  const trimmed = (value ?? '').trim();
  if (!trimmed) {
    return null;
  }
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export interface ArchiveShow {
  id: string;
  slug: string;
  tmdbId: number;
  status: ShowEntry['status'];
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
  /** TMDB köken ülkeleri — Kore Dramaları rafı bunu süzer (`includes("KR")`) */
  originCountry: string[];
}

export interface ShowDetail {
  show: ArchiveShow;
  tagline: string | null;
  cast: TmdbCastMember[];
  trailerKey: string | null;
  providers: TmdbProvider[];
  providerLink: string | null;
  links: ShowLink[];
  customLinks: ShowCustomLinks;
  similar: Array<
    TmdbSearchResult & { inArchive: boolean; slug: string | null }
  >;
  stills: string[];
  originalTitle: string | null;
  releaseDate: string | null;
  originalLanguage: string | null;
  /** Filmdeki bütçe/hâsılatın yerini alır — dizide bu ikisinin karşılığı yok */
  airStatus: string | null;
  neighbours: {
    byDirector: ArchiveShow[];
    byGenre: ArchiveShow[];
  };
}

@Injectable()
export class ShowsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tmdb: TmdbTvService,
  ) {}

  // --- Public ---

  async getArchive(): Promise<{
    shows: ArchiveShow[];
    stats: ShowArchiveStats;
    directors: Array<{ name: string; count: number }>;
    genres: string[];
  }> {
    const entries = await this.prisma.showEntry.findMany({
      where: { isDeleted: false },
      orderBy: [{ watchedAt: 'desc' }, { createdAt: 'desc' }],
    });

    const shows = withSlugs(entries);
    return {
      shows,
      stats: buildStats(entries, shows),
      directors: topDirectors(shows),
      genres: allGenres(shows),
    };
  }

  async getDetail(slug: string): Promise<ShowDetail> {
    const entries = await this.prisma.showEntry.findMany({
      where: { isDeleted: false },
      orderBy: [{ watchedAt: 'desc' }, { createdAt: 'desc' }],
    });
    const shows = withSlugs(entries);
    const index = shows.findIndex((show) => show.slug === slug);
    if (index === -1) {
      throw new NotFoundException('SHOWS.NOT_FOUND');
    }
    const show = shows[index];
    const entry = entries[index];
    let data = (entry.externalData ?? null) as TmdbShow | null;

    if (!data || data.stills === undefined) {
      try {
        data = await this.tmdb.getShow(entry.tmdbId);
        await this.prisma.showEntry.update({
          where: { id: entry.id },
          data: {
            externalData: data as unknown as Prisma.InputJsonValue,
            externalDataFetchedAt: new Date(),
          },
        });
      } catch {
        // TMDB düşerse sayfa eski künyeyle açılır (kural 4)
      }
    }

    let similar: TmdbSearchResult[] = [];
    try {
      similar = await this.tmdb.recommendations(entry.tmdbId);
    } catch {
      // Benzerler süs; alınamazsa sayfa eksik değil sade açılır
    }
    const bySlug = new Map(shows.map((item) => [item.tmdbId, item.slug]));

    return {
      show,
      tagline: data?.tagline ?? null,
      cast: data?.cast ?? [],
      trailerKey: readCustomLinks(entry).trailer
        ? youtubeKey(readCustomLinks(entry).trailer!)
        : (data?.trailerKey ?? null),
      providers: data?.providers ?? [],
      providerLink: data?.providerLink ?? null,
      links: buildLinks(entry, data),
      customLinks: readCustomLinks(entry),
      similar: similar.slice(0, SIMILAR_LIMIT).map((item) => ({
        ...item,
        inArchive: bySlug.has(item.tmdbId),
        slug: bySlug.get(item.tmdbId) ?? null,
      })),
      stills: data?.stills ?? [],
      originalTitle: data?.originalTitle ?? null,
      releaseDate: data?.releaseDate ?? null,
      originalLanguage: data?.originalLanguage ?? null,
      airStatus: data?.airStatus ?? null,
      neighbours: buildNeighbours(show, shows),
    };
  }

  async suggestions(userId: string): Promise<TmdbSearchResult[]> {
    const [entries, dismissals] = await Promise.all([
      this.prisma.showEntry.findMany({
        select: { tmdbId: true, isFavorite: true, isDeleted: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.showSuggestionDismissal.findMany({
        where: { userId },
        select: { tmdbId: true },
      }),
    ]);
    const known = new Set([
      ...entries.map((entry) => entry.tmdbId),
      ...dismissals.map((dismissal) => dismissal.tmdbId),
    ]);

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
        return [];
      }
    };

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

    const streams: TmdbSearchResult[][] = [explore, taste, explore, buzz];
    const cursors = [0, 0, 0, 0];
    const mixed: TmdbSearchResult[] = [];
    const taken = new Set<number>();
    while (mixed.length < SUGGESTION_POOL) {
      let progressed = false;
      for (let s = 0; s < streams.length; s += 1) {
        const stream = streams[s];
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

  async dismissSuggestion(
    tmdbId: number,
    userId: string,
  ): Promise<{ tmdbId: number; dismissed: boolean }> {
    await this.prisma.showSuggestionDismissal.upsert({
      where: { userId_tmdbId: { userId, tmdbId } },
      create: { tmdbId, userId },
      update: {},
    });
    return { tmdbId, dismissed: true };
  }

  async restoreSuggestion(
    tmdbId: number,
    userId: string,
  ): Promise<{ tmdbId: number; dismissed: boolean }> {
    await this.prisma.showSuggestionDismissal.deleteMany({
      where: { userId, tmdbId },
    });
    return { tmdbId, dismissed: false };
  }

  async showcase(): Promise<{
    left: ShowcasePoster | null;
    right: ShowcasePoster | null;
  }> {
    const cacheKey = 'shows:showcase:v1';
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
    return this.prisma.showEntry.findMany({
      where: { isDeleted: false },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(dto: CreateShowEntryDto, userId: string): Promise<ShowEntry> {
    const existing = await this.prisma.showEntry.findFirst({
      where: { userId, tmdbId: dto.tmdbId, isDeleted: false },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('SHOWS.ALREADY_IN_ARCHIVE');
    }

    const snapshot = await this.snapshot(dto.tmdbId);
    return this.prisma.showEntry.upsert({
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

  async update(id: string, dto: UpdateShowEntryDto): Promise<ShowEntry> {
    const entry = await this.findByIdOrFail(id);
    const data: Prisma.ShowEntryUncheckedUpdateInput = {
      status: dto.status,
      isFavorite: dto.isFavorite,
      personalRating: dto.personalRating,
      personalNote: dto.personalNote,
      ...(dto.watchedAt !== undefined && {
        watchedAt: dto.watchedAt ? new Date(dto.watchedAt) : null,
      }),
    };
    if (dto.links !== undefined) {
      const incoming = dto.links;
      const merged: ShowCustomLinks = { ...readCustomLinks(entry) };
      for (const field of SHOW_LINK_FIELDS) {
        if (incoming[field] === undefined) {
          continue;
        }
        const url = normalizeUrl(incoming[field]);
        if (url) {
          merged[field] = url;
        } else {
          delete merged[field];
        }
      }
      data.links = merged as unknown as Prisma.InputJsonValue;
    }
    return this.prisma.showEntry.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<ShowEntry> {
    await this.findByIdOrFail(id);
    return this.prisma.showEntry.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async refresh(id: string): Promise<ShowEntry> {
    const entry = await this.findByIdOrFail(id);
    const snapshot = await this.snapshot(entry.tmdbId);
    return this.prisma.showEntry.update({
      where: { id },
      data: {
        externalData: snapshot.payload,
        externalDataFetchedAt: snapshot.fetchedAt,
      },
    });
  }

  private async findByIdOrFail(id: string): Promise<ShowEntry> {
    const entry = await this.prisma.showEntry.findFirst({
      where: { id, isDeleted: false },
    });
    if (!entry) {
      throw new NotFoundException('SHOWS.NOT_FOUND');
    }
    return entry;
  }

  private async snapshot(tmdbId: number): Promise<{
    payload: Prisma.InputJsonValue | undefined;
    fetchedAt: Date | null;
  }> {
    try {
      const show = await this.tmdb.getShow(tmdbId);
      return {
        payload: show as unknown as Prisma.InputJsonValue,
        fetchedAt: new Date(),
      };
    } catch {
      return { payload: undefined, fetchedAt: null };
    }
  }
}

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

function withSlugs(entries: ShowEntry[]): ArchiveShow[] {
  const used = new Set<string>();
  return entries.map((entry) => {
    const show = toArchiveShow(entry);
    const base = slugify(show.title) || `dizi-${entry.tmdbId}`;
    const withYear = show.releaseYear ? `${base}-${show.releaseYear}` : base;
    const slug = !used.has(base)
      ? base
      : !used.has(withYear)
        ? withYear
        : `${base}-${entry.tmdbId}`;
    used.add(slug);
    return { ...show, slug };
  });
}

const NEIGHBOUR_LIMIT = 6;

function buildNeighbours(
  current: ArchiveShow,
  all: ArchiveShow[],
): { byDirector: ArchiveShow[]; byGenre: ArchiveShow[] } {
  const others = all.filter((show) => show.id !== current.id);
  const byDirector = current.director
    ? others
        .filter((show) => show.director === current.director)
        .slice(0, NEIGHBOUR_LIMIT)
    : [];

  const picked = new Set(byDirector.map((show) => show.id));
  const genres = new Set(current.genres);
  const byGenre = others
    .filter(
      (show) =>
        !picked.has(show.id) && show.genres.some((genre) => genres.has(genre)),
    )
    .sort(
      (a, b) =>
        b.genres.filter((genre) => genres.has(genre)).length -
        a.genres.filter((genre) => genres.has(genre)).length,
    )
    .slice(0, NEIGHBOUR_LIMIT);

  return { byDirector, byGenre };
}

function readCustomLinks(entry: ShowEntry): ShowCustomLinks {
  return (entry.links ?? {}) as ShowCustomLinks;
}

function buildLinks(entry: ShowEntry, data: TmdbShow | null): ShowLink[] {
  const custom = readCustomLinks(entry);
  const title = data?.originalTitle ?? data?.title ?? '';
  const links: ShowLink[] = [
    {
      kind: 'TMDB',
      url: `https://www.themoviedb.org/tv/${entry.tmdbId}`,
      isSearch: false,
    },
  ];

  const imdb =
    custom.imdb ??
    (data?.imdbId ? `https://www.imdb.com/title/${data.imdbId}/` : null);
  if (imdb) {
    links.push({ kind: 'IMDB', url: imdb, isSearch: false });
  }

  if (custom.rt) {
    links.push({ kind: 'RT', url: custom.rt, isSearch: false });
  } else if (title) {
    links.push({
      kind: 'RT',
      url: `https://www.rottentomatoes.com/search?search=${encodeURIComponent(title)}`,
      isSearch: true,
    });
  }

  if (data?.homepage) {
    links.push({ kind: 'HOMEPAGE', url: data.homepage, isSearch: false });
  }
  return links;
}

function youtubeKey(url: string): string | null {
  const match =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/.exec(
      url,
    );
  return match?.[1] ?? null;
}

function toArchiveShow(entry: ShowEntry): ArchiveShow {
  const data = (entry.externalData ?? null) as TmdbShow | null;
  const releaseYear = data?.releaseDate
    ? Number.parseInt(data.releaseDate.slice(0, 4), 10)
    : null;
  return {
    id: entry.id,
    slug: '',
    tmdbId: entry.tmdbId,
    status: entry.status,
    isFavorite: entry.isFavorite,
    personalRating: entry.personalRating,
    personalNote: entry.personalNote,
    watchedAt: entry.watchedAt ? entry.watchedAt.toISOString() : null,
    title: data?.title ?? `#${entry.tmdbId}`,
    overview: data?.overview ?? null,
    posterPath: data?.posterPath ?? null,
    backdropPath: data?.backdropPath ?? null,
    releaseYear: Number.isFinite(releaseYear) ? releaseYear : null,
    runtime: data?.runtime ?? null,
    numberOfSeasons: data?.numberOfSeasons ?? null,
    numberOfEpisodes: data?.numberOfEpisodes ?? null,
    genres: data?.genres ?? [],
    voteAverage: data?.voteAverage ?? null,
    director: data?.director ?? null,
    originCountry: data?.originCountry ?? [],
  };
}

function buildStats(
  entries: ShowEntry[],
  shows: ArchiveShow[],
): ShowArchiveStats {
  const currentYear = new Date().getFullYear();
  const rated = entries.filter(
    (entry) => typeof entry.personalRating === 'number',
  );
  const sum = rated.reduce(
    (acc, entry) => acc + (entry.personalRating ?? 0),
    0,
  );
  return {
    total: shows.filter((show) => show.status !== 'WATCHLIST').length,
    watchedThisYear: entries.filter(
      (entry) => entry.watchedAt?.getFullYear() === currentYear,
    ).length,
    averageRating:
      rated.length > 0 ? Number((sum / rated.length).toFixed(1)) : null,
    watchlist: entries.filter((entry) => entry.status === 'WATCHLIST').length,
  };
}

function topDirectors(
  shows: ArchiveShow[],
): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();
  for (const show of shows) {
    if (!show.director) {
      continue;
    }
    const weight = show.isFavorite ? 2 : 1;
    counts.set(show.director, (counts.get(show.director) ?? 0) + weight);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'tr'))
    .slice(0, 6);
}

function allGenres(shows: ArchiveShow[]): string[] {
  const seen = new Set<string>();
  for (const show of shows) {
    for (const genre of show.genres) {
      seen.add(genre);
    }
  }
  return [...seen].sort((a, b) => a.localeCompare(b, 'tr'));
}
