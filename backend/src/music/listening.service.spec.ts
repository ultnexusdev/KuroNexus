import { ListeningService } from './listening.service';
import type { PrismaService } from '../prisma/prisma.service';

/**
 * İçe aktarma tekrar koruması regresyon testleri.
 *
 * ── NEDEN VAR ─────────────────────────────────────────────────────────────
 * 30 Ağustos 2026: kullanıcının gerçek dosyası "Account data" paketinden
 * çıktı (eski `StreamingHistory` biçimi) ve o biçimde `spotify_track_uri`
 * YOK. Tekrar koruması `@@unique([userId, playedAt, spotifyTrackUri])`
 * kısıtına dayanıyordu; PostgreSQL'de NULL ≠ NULL olduğundan URI'siz
 * satırlarda kısıt hiç çalışmıyor — aynı dosya ikinci kez yüklense her
 * satır kopyalanacaktı. Küratör panelinde yükleme düğmesi olduğu için bu
 * gerçek bir kullanım yolu, varsayımsal değil.
 *
 * Koruma artık servis katmanında (aralık sorgusu + anahtar kümesi). Bu
 * testler o katmanı kilitliyor: biri bir gün "kısıt zaten var" diye ön
 * elemeyi silerse kırmızı yanar.
 */

type MusicPlayRow = {
  playedAt: Date;
  spotifyTrackUri: string | null;
  trackName: string;
};

function buildPrismaMock(existingPlays: MusicPlayRow[]) {
  const createMany = jest.fn(
    ({ data }: { data: unknown[] }): Promise<{ count: number }> =>
      Promise.resolve({ count: data.length }),
  );
  const prisma = {
    musicPlay: {
      findMany: jest.fn(() => Promise.resolve(existingPlays)),
      createMany,
    },
    musicTrack: {
      // Arşiv boş: eşleştirme bu testlerin konusu değil
      findMany: jest.fn(() => Promise.resolve([])),
    },
  };
  return { prisma: prisma as unknown as PrismaService, createMany };
}

/** Eski biçim (Account data) — URI yok, dakika hassasiyetli zaman */
const BASIC_FILE = JSON.stringify([
  {
    endTime: '2026-01-20 20:33',
    artistName: 'Tasos Pilarinos',
    trackName: "I Can't Stop - Radio Edit",
    msPlayed: 187_746,
  },
  {
    endTime: '2026-01-20 20:36',
    artistName: 'Coyot',
    trackName: 'Devil in Disguise',
    msPlayed: 169_006,
  },
  // Eşik altı: 11 sn < 30 sn, sayılmamalı
  {
    endTime: '2026-01-20 20:37',
    artistName: 'DE SOFFER',
    trackName: 'Rapture',
    msPlayed: 11_040,
  },
]);

describe('ListeningService.importHistoryFile — tekrar koruması', () => {
  const USER = 'user-1';

  it("URI'siz biçimde ilk yükleme yazar, eşik altını atlar", async () => {
    const { prisma, createMany } = buildPrismaMock([]);
    const service = new ListeningService(prisma);

    const result = await service.importHistoryFile(
      Buffer.from(BASIC_FILE, 'utf8'),
      USER,
    );

    expect(result.read).toBe(3);
    expect(result.eligible).toBe(2);
    expect(result.inserted).toBe(2);
    expect(result.duplicate).toBe(0);
    expect(result.skipped).toBe(1);
    // Yazılan satırlarda URI gerçekten NULL — kısıtın koruMAdığı durum bu
    const rows = createMany.mock.calls[0][0].data as Array<{
      spotifyTrackUri: string | null;
    }>;
    expect(rows.every((row) => row.spotifyTrackUri === null)).toBe(true);
  });

  it("AYNI URI'siz dosya ikinci kez yüklenince hiçbir satır yazılmaz", async () => {
    const { prisma, createMany } = buildPrismaMock([
      {
        playedAt: new Date('2026-01-20T20:33:00Z'),
        spotifyTrackUri: null,
        trackName: "I Can't Stop - Radio Edit",
      },
      {
        playedAt: new Date('2026-01-20T20:36:00Z'),
        spotifyTrackUri: null,
        trackName: 'Devil in Disguise',
      },
    ]);
    const service = new ListeningService(prisma);

    const result = await service.importHistoryFile(
      Buffer.from(BASIC_FILE, 'utf8'),
      USER,
    );

    expect(result.inserted).toBe(0);
    expect(result.duplicate).toBe(2);
    expect(createMany).not.toHaveBeenCalled();
  });

  it("dosya İÇİNDEKİ özdeş URI'siz satırdan yalnızca biri yazılır", async () => {
    const twin = {
      endTime: '2026-03-05 09:00',
      artistName: 'Dido',
      trackName: 'Hunter',
      msPlayed: 45_000,
    };
    const { prisma } = buildPrismaMock([]);
    const service = new ListeningService(prisma);

    const result = await service.importHistoryFile(
      Buffer.from(JSON.stringify([twin, twin]), 'utf8'),
      USER,
    );

    expect(result.inserted).toBe(1);
    expect(result.duplicate).toBe(1);
  });

  it('uzatılmış biçimde eleme URI üzerinden — aynı dakikadaki FARKLI parçalar yazılır', async () => {
    const extended = JSON.stringify([
      {
        ts: '2026-05-01T12:00:00Z',
        ms_played: 200_000,
        master_metadata_track_name: 'In the End',
        master_metadata_album_artist_name: 'Linkin Park',
        master_metadata_album_album_name: 'Hybrid Theory',
        spotify_track_uri: 'spotify:track:aaa111',
      },
      {
        ts: '2026-05-01T12:00:00Z',
        ms_played: 180_000,
        master_metadata_track_name: 'Faint',
        master_metadata_album_artist_name: 'Linkin Park',
        master_metadata_album_album_name: 'Meteora',
        spotify_track_uri: 'spotify:track:bbb222',
      },
    ]);
    const { prisma } = buildPrismaMock([
      {
        playedAt: new Date('2026-05-01T12:00:00Z'),
        spotifyTrackUri: 'spotify:track:aaa111',
        trackName: 'In the End',
      },
    ]);
    const service = new ListeningService(prisma);

    const result = await service.importHistoryFile(
      Buffer.from(extended, 'utf8'),
      USER,
    );

    // aaa111 zaten kayıtlı → tekrar; bbb222 yeni → yazılır
    expect(result.inserted).toBe(1);
    expect(result.duplicate).toBe(1);
  });
});
