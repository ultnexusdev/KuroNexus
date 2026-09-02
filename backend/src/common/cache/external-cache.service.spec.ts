import { ExternalCacheService } from './external-cache.service';
import type { PrismaService } from '../../prisma/prisma.service';

/** Tek tablolu sahte Prisma: `externalCache.findUnique/upsert` yeter. */
function fakePrisma(
  rows: Record<string, { payload: unknown; fetchedAt: Date }>,
) {
  const upserts: Array<{
    cacheKey: string;
    payload: unknown;
    fetchedAt: Date;
  }> = [];
  const prisma = {
    externalCache: {
      findUnique: ({ where }: { where: { cacheKey: string } }) =>
        Promise.resolve(
          rows[where.cacheKey]
            ? { cacheKey: where.cacheKey, ...rows[where.cacheKey] }
            : null,
        ),
      upsert: (args: {
        where: { cacheKey: string };
        create: { cacheKey: string; payload: unknown; fetchedAt: Date };
        update: { payload: unknown; fetchedAt: Date };
      }) => {
        upserts.push({ cacheKey: args.where.cacheKey, ...args.update });
        rows[args.where.cacheKey] = { ...args.update };
        return Promise.resolve({
          cacheKey: args.where.cacheKey,
          ...args.update,
        });
      },
    },
  };
  return { prisma: prisma as unknown as PrismaService, upserts, rows };
}

const MIN = 60_000;
const ago = (ms: number) => new Date(Date.now() - ms);

describe('ExternalCacheService', () => {
  it('readFresh: TTL icindeyse payload, disindaysa null', async () => {
    const { prisma } = fakePrisma({
      taze: { payload: { a: 1 }, fetchedAt: ago(MIN) },
      bayat: { payload: { a: 2 }, fetchedAt: ago(10 * MIN) },
    });
    const cache = new ExternalCacheService(prisma);
    expect(await cache.readFresh('taze', 5 * MIN)).toEqual({ a: 1 });
    expect(await cache.readFresh('bayat', 5 * MIN)).toBeNull();
    expect(await cache.readFresh('yok', 5 * MIN)).toBeNull();
  });

  it('write: create ve update dallarinda fetchedAt simdi (eski kopyanin tuzagi)', async () => {
    const { prisma, upserts } = fakePrisma({});
    const cache = new ExternalCacheService(prisma);
    const before = Date.now();
    await cache.write('k', { x: 1 });
    expect(upserts).toHaveLength(1);
    expect(upserts[0].payload).toEqual({ x: 1 });
    expect(upserts[0].fetchedAt.getTime()).toBeGreaterThanOrEqual(before);
  });

  it('remember: taze kayit varsa fetcher HIC cagrilmaz', async () => {
    const { prisma } = fakePrisma({
      k: { payload: 'eski', fetchedAt: ago(MIN) },
    });
    const cache = new ExternalCacheService(prisma);
    const fetcher = jest.fn(() => Promise.resolve('yeni'));
    expect(await cache.remember('k', 5 * MIN, fetcher)).toBe('eski');
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('remember: bayatsa ceker, yazar, yeniyi doner', async () => {
    const { prisma, upserts } = fakePrisma({
      k: { payload: 'eski', fetchedAt: ago(10 * MIN) },
    });
    const cache = new ExternalCacheService(prisma);
    expect(
      await cache.remember('k', 5 * MIN, () => Promise.resolve('yeni')),
    ).toBe('yeni');
    expect(upserts.map((u) => u.payload)).toEqual(['yeni']);
  });

  it('remember: cekim duser + bayat var → onStale cagrilir, bayat sunulur', async () => {
    const { prisma, upserts } = fakePrisma({
      k: { payload: 'eski', fetchedAt: ago(10 * MIN) },
    });
    const cache = new ExternalCacheService(prisma);
    const onStale = jest.fn();
    const boom = new Error('TMDB 503');
    const result = await cache.remember(
      'k',
      5 * MIN,
      () => Promise.reject(boom),
      { onStale },
    );
    expect(result).toBe('eski');
    expect(onStale).toHaveBeenCalledWith(
      boom,
      expect.objectContaining({ payload: 'eski' }),
    );
    expect(upserts).toHaveLength(0);
  });

  it('remember: cekim duser + kayit yok → hata yukselir', async () => {
    const { prisma } = fakePrisma({});
    const cache = new ExternalCacheService(prisma);
    await expect(
      cache.remember('k', 5 * MIN, () => Promise.reject(new Error('yok'))),
    ).rejects.toThrow('yok');
  });

  it('remember: staleOnError=false ise bayat sunulmaz, hata yukselir', async () => {
    const { prisma } = fakePrisma({
      k: { payload: 'eski', fetchedAt: ago(10 * MIN) },
    });
    const cache = new ExternalCacheService(prisma);
    await expect(
      cache.remember('k', 5 * MIN, () => Promise.reject(new Error('dustu')), {
        staleOnError: false,
      }),
    ).rejects.toThrow('dustu');
  });
});
