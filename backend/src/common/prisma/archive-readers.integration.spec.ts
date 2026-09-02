/**
 * API-08 arşiv okuyucularının eski `findMany` sorgusuyla BİREBİR aynı
 * satırları döndürdüğünü gerçek bir Postgres'te sınar: aynı süzgeç, aynı sıra,
 * aynı skalerler (tarihler `Date` olarak), JSON ise yalnız okunan anahtarlar.
 *
 * `TEST_DATABASE_URL` yoksa atlanır — Docker build'inde ve `pnpm test`in
 * sıradan koşusunda çalışmaz. Yerelde (portatif PG, bkz. hafıza notu):
 *
 *   prisma db push --url "<test-db-url>"
 *   TEST_DATABASE_URL="<test-db-url>" pnpm exec jest archive-readers
 *
 * Test kendi tohum satırlarını açar ve sonunda siler; başka satır varsa
 * onlar da karşılaştırmaya girer (zarar vermez, sadece kapsamı büyütür).
 */
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '../../generated/prisma/client';
import * as movies from '../../movies/movies.service';
import * as shows from '../../shows/shows.service';
import * as anime from '../../anime/anime.service';

const url = process.env.TEST_DATABASE_URL;
const describeWithDb = url ? describe : describe.skip;

/** `jsonb_build_object`un yaptığı: istenen anahtarlar, eksikler `null`. */
function pick(value: unknown, keys: readonly string[]) {
  if (value === null || value === undefined) {
    return null;
  }
  const source = value as Record<string, unknown>;
  return Object.fromEntries(keys.map((key) => [key, source[key] ?? null]));
}

function withoutJson<T extends { externalData: unknown }>(
  row: T,
): Omit<T, 'externalData'> {
  const { externalData, ...rest } = row;
  void externalData;
  return rest;
}

const BIG_MOVIE = {
  title: 'Heat',
  overview: 'Los Angeles.',
  posterPath: '/heat.jpg',
  backdropPath: null,
  releaseDate: '1995-12-15',
  runtime: 170,
  genres: ['Crime', 'Drama'],
  voteAverage: 8.2,
  director: 'Michael Mann',
  tagline: 'A Los Angeles crime saga',
  cast: Array.from({ length: 30 }, (_, i) => ({
    name: `Actor ${i}`,
    character: `Role ${i}`,
    profilePath: `/p${i}.jpg`,
  })),
  stills: Array.from({ length: 12 }, (_, i) => `/still${i}.jpg`),
  providers: [{ name: 'Netflix', logoPath: '/n.png', kind: 'FLATRATE' }],
  budget: 60_000_000,
};

const BIG_SHOW = {
  title: 'The Wire',
  overview: 'Baltimore.',
  posterPath: '/wire.jpg',
  releaseDate: '2002-06-02',
  numberOfSeasons: 5,
  numberOfEpisodes: 60,
  airStatus: 'Ended',
  genres: ['Crime'],
  director: 'David Simon',
  originCountry: ['US'],
  cast: Array.from({ length: 25 }, (_, i) => ({ name: `Actor ${i}` })),
  stills: ['/a.jpg', '/b.jpg'],
  seasons: [{ seasonNumber: 1, name: 'S1', episodeCount: 13 }],
};

const SEASON = (n: number) => ({
  seasonNumber: n,
  name: `Season ${n}`,
  episodeCount: 10 + n,
  airDate: `200${n}-01-01`,
  posterPath: `/s${n}.jpg`,
  overview: 'x'.repeat(800),
});

const MEDIA = (id: number, format = 'TV') => ({
  anilistId: id,
  malId: id * 10,
  title: `Media ${id}`,
  format,
  status: 'FINISHED',
  episodes: 12,
  seasonYear: 2010,
  startYear: 2010,
  coverImage: `/c${id}.jpg`,
  bannerImage: null,
  genres: ['Action'],
  tags: ['Shounen'],
  studios: ['Bones'],
  averageScore: 80,
  description: 'y'.repeat(1500),
  trailerUrl: null,
  officialSite: null,
  manga: null,
});

describeWithDb('arsiv okuyuculari — gercek Postgres (API-08)', () => {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: url ?? '' }),
  });
  let userId = '';

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        email: `api08-${Date.now()}@test.local`,
        passwordHash: 'x',
        name: 'api08',
      },
    });
    userId = user.id;

    await prisma.movieEntry.createMany({
      data: [
        {
          userId,
          tmdbId: 949,
          watchedAt: new Date('2026-01-05T00:00:00Z'),
          externalData: BIG_MOVIE,
          personalRating: 9.5,
        },
        // Sırada bekleyen: watchedAt NULL → Postgres DESC'te en üste gelir
        // SQL NULL — künye hiç alınmamış
        {
          userId,
          tmdbId: 950,
          status: 'WATCHLIST',
          externalData: Prisma.DbNull,
        },
        {
          userId,
          tmdbId: 951,
          watchedAt: new Date('2025-06-01T00:00:00Z'),
          externalData: { title: 'Sadece baslik' },
        },
        // Silinmiş: hiçbir okuyucuda görünmemeli
        {
          userId,
          tmdbId: 952,
          isDeleted: true,
          externalData: BIG_MOVIE,
        },
      ],
    });

    const show = await prisma.showEntry.create({
      data: {
        userId,
        tmdbId: 1438,
        watchedAt: new Date('2026-02-01T00:00:00Z'),
        externalData: BIG_SHOW,
        seasons: {
          create: [
            // orderIndex sırası kasıtlı ters: okuyucu orderIndex ASC vermeli
            { seasonNumber: 2, orderIndex: 1, externalData: SEASON(2) },
            { seasonNumber: 1, orderIndex: 0, externalData: SEASON(1) },
          ],
        },
      },
    });
    void show;
    await prisma.showEntry.create({
      data: {
        userId,
        tmdbId: 1439,
        isDeleted: true,
        externalData: BIG_SHOW,
        seasons: { create: [{ seasonNumber: 1, externalData: SEASON(1) }] },
      },
    });
    // Sezonsuz dizi: `seasons: []` dönmeli (attachChildren'ın boş kolu).
    // Künye JSON `null` (Prisma düz `null` yazınca ürettiği şey) — SQL NULL
    // değil; projeksiyon bunu da `null` olarak vermeli, boş nesne değil.
    await prisma.showEntry.create({
      data: { userId, tmdbId: 1440, externalData: Prisma.JsonNull },
    });

    await prisma.animeEntry.create({
      data: {
        userId,
        anilistId: 21,
        externalData: MEDIA(21),
        parts: {
          create: [
            { anilistId: 22, orderIndex: 1, externalData: MEDIA(22, 'MOVIE') },
            { anilistId: 21, orderIndex: 0, externalData: MEDIA(21) },
            { anilistId: 23, orderIndex: 2, externalData: Prisma.DbNull },
          ],
        },
      },
    });
    await prisma.animeEntry.create({
      data: {
        userId,
        anilistId: 99,
        isDeleted: true,
        externalData: MEDIA(99),
        parts: { create: [{ anilistId: 99, externalData: MEDIA(99) }] },
      },
    });
  });

  afterAll(async () => {
    await prisma.movieEntry.deleteMany({ where: { userId } });
    await prisma.showEntry.deleteMany({ where: { userId } });
    await prisma.animeEntry.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  it('film: findMany ile ayni satirlar, ayni sira, JSON daraltilmis', async () => {
    const rows = await movies.readArchiveEntries(prisma);
    const base = await prisma.movieEntry.findMany({
      where: { isDeleted: false },
      orderBy: [{ watchedAt: 'desc' }, { createdAt: 'desc' }],
    });

    expect(rows.length).toBeGreaterThanOrEqual(3);
    expect(rows.map(withoutJson)).toEqual(base.map(withoutJson));
    expect(rows.map((row) => row.externalData)).toEqual(
      base.map((row) => pick(row.externalData, movies.ARCHIVE_JSON_KEYS)),
    );

    const heat = rows.find((row) => row.tmdbId === 949);
    expect(heat?.createdAt).toBeInstanceOf(Date);
    expect(heat?.watchedAt).toBeInstanceOf(Date);
    expect(heat?.externalData).not.toHaveProperty('cast');
    expect(heat?.externalData).not.toHaveProperty('stills');
    expect(heat?.externalData).toMatchObject({
      title: 'Heat',
      runtime: 170,
      genres: ['Crime', 'Drama'],
    });
    // watchedAt NULL olan kayıt en üstte (Postgres DESC → NULLS FIRST)
    expect(rows[0]?.watchedAt).toBeNull();
    // Künyesi hiç olmayan kayıt `null` kalır, boş nesneye dönmez
    expect(rows.find((row) => row.tmdbId === 950)?.externalData).toBeNull();
    // Silinmiş kayıt gelmez
    expect(rows.some((row) => row.tmdbId === 952)).toBe(false);
  });

  it('dizi: sezonlar orderIndex sirasiyla bagli, silinmis dizinin sezonu gelmez', async () => {
    const rows = await shows.readArchiveEntries(prisma);
    const base = await prisma.showEntry.findMany({
      where: { isDeleted: false },
      include: { seasons: { orderBy: { orderIndex: 'asc' } } },
      orderBy: [{ watchedAt: 'desc' }, { createdAt: 'desc' }],
    });

    const strip = (entry: (typeof base)[number]) => ({
      ...withoutJson(entry),
      seasons: entry.seasons.map(withoutJson),
    });
    expect(rows.map(strip)).toEqual(base.map(strip));
    expect(rows.map((row) => row.externalData)).toEqual(
      base.map((row) => pick(row.externalData, shows.ARCHIVE_JSON_KEYS)),
    );
    expect(
      rows.flatMap((row) => row.seasons.map((s) => s.externalData)),
    ).toEqual(
      base.flatMap((row) =>
        row.seasons.map((s) => pick(s.externalData, shows.SEASON_JSON_KEYS)),
      ),
    );

    const wire = rows.find((row) => row.tmdbId === 1438);
    expect(wire?.seasons.map((s) => s.seasonNumber)).toEqual([1, 2]);
    expect(wire?.externalData).not.toHaveProperty('cast');
    expect(wire?.externalData).not.toHaveProperty('seasons');
    expect(wire?.seasons[0]?.externalData).not.toHaveProperty('overview');
    expect(wire?.seasons[0]?.externalData).toMatchObject({
      name: 'Season 1',
      episodeCount: 11,
    });
    expect(rows.find((row) => row.tmdbId === 1440)?.seasons).toEqual([]);
    expect(rows.some((row) => row.tmdbId === 1439)).toBe(false);
  });

  it('anime: parcalar orderIndex sirasiyla bagli, description atilmis', async () => {
    const rows = await anime.readArchiveEntries(prisma);
    const base = await prisma.animeEntry.findMany({
      where: { isDeleted: false },
      include: { parts: { orderBy: { orderIndex: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
    });

    const strip = (entry: (typeof base)[number]) => ({
      ...withoutJson(entry),
      parts: entry.parts.map(withoutJson),
    });
    expect(rows.map(strip)).toEqual(base.map(strip));
    expect(rows.map((row) => row.externalData)).toEqual(
      base.map((row) => pick(row.externalData, anime.ARCHIVE_JSON_KEYS)),
    );
    expect(rows.flatMap((row) => row.parts.map((p) => p.externalData))).toEqual(
      base.flatMap((row) =>
        row.parts.map((p) => pick(p.externalData, anime.PART_JSON_KEYS)),
      ),
    );

    const series = rows.find((row) => row.anilistId === 21);
    expect(series?.parts.map((p) => p.anilistId)).toEqual([21, 22, 23]);
    expect(series?.parts[0]?.externalData).not.toHaveProperty('description');
    expect(series?.parts[0]?.externalData).toMatchObject({
      title: 'Media 21',
      format: 'TV',
      episodes: 12,
    });
    expect(series?.parts[2]?.externalData).toBeNull();
    // Kökte description kalır (kart onu gösteriyor), studios atılır
    expect(series?.externalData).toHaveProperty('description');
    expect(series?.externalData).not.toHaveProperty('studios');
    expect(rows.some((row) => row.anilistId === 99)).toBe(false);
  });
});
