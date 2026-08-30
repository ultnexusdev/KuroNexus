import { LibraryImportService } from './library-import.service';
import type { ListeningService } from './listening.service';
import type { PrismaService } from '../prisma/prisma.service';

/**
 * `YourLibrary.json` içe aktarımı — iki iddia kilitleniyor:
 *
 * 1. Beğenilenler listesi: yalnızca arşivde karşılığı olan parçalar bağlanır,
 *    yeniden yükleme mevcutları atlar ve SONA ekler (backfill deseni).
 * 2. Sanatçı adayları: eşleştirme İSİMLE DEĞİL `spotify:artist:ID` ile;
 *    sıralama beğenilen parça sayısına göre.
 */

const LIBRARY = JSON.stringify({
  tracks: [
    { artist: 'Linkin Park', track: 'In the End', uri: 'spotify:track:aaa' },
    { artist: 'Linkin Park', track: 'Faint', uri: 'spotify:track:bbb' },
    { artist: 'Moby', track: 'Porcelain', uri: 'spotify:track:ccc' },
  ],
  artists: [
    { name: 'Linkin Park', uri: 'spotify:artist:LP1' },
    { name: 'Moby', uri: 'spotify:artist:MB1' },
    { name: 'INNA', uri: 'spotify:artist:IN1' },
  ],
});

function buildMocks(options: {
  uriMap: Map<string, string>;
  playlist: {
    id: string;
    slug: string;
    name: string;
    isDeleted: boolean;
  } | null;
  playlistTracks: Array<{ trackId: string; position: number }>;
  knownArtistIds: string[];
}) {
  const createMany = jest.fn(
    ({ data }: { data: unknown[] }): Promise<{ count: number }> =>
      Promise.resolve({ count: data.length }),
  );
  const prisma = {
    musicPlaylist: {
      findUnique: jest.fn(() => Promise.resolve(options.playlist)),
      create: jest.fn(() =>
        Promise.resolve({
          id: 'pl-1',
          slug: 'begenilenler',
          name: 'Beğenilenler',
        }),
      ),
      update: jest.fn(() => Promise.resolve({})),
    },
    musicPlaylistTrack: {
      findMany: jest.fn(() => Promise.resolve(options.playlistTracks)),
      createMany,
    },
    musicalAct: {
      findMany: jest.fn(() =>
        Promise.resolve(
          options.knownArtistIds.map((id) => ({ spotifyId: id })),
        ),
      ),
    },
  };
  const listening = {
    mapUrisToTracks: jest.fn(() => Promise.resolve(options.uriMap)),
  };
  return {
    service: new LibraryImportService(
      prisma as unknown as PrismaService,
      listening as unknown as ListeningService,
    ),
    createMany,
  };
}

describe('LibraryImportService.importLibraryFile', () => {
  it('yalnızca arşivdeki parçaları bağlar, adayları beğeni sayısına göre sıralar', async () => {
    const { service, createMany } = buildMocks({
      // Arşivde yalnızca iki Linkin Park parçası var; Moby parçası yok
      uriMap: new Map([
        ['spotify:track:aaa', 'track-a'],
        ['spotify:track:bbb', 'track-b'],
      ]),
      playlist: null,
      playlistTracks: [],
      knownArtistIds: ['LP1'],
    });

    const result = await service.importLibraryFile(
      Buffer.from(LIBRARY, 'utf8'),
    );

    expect(result.liked.total).toBe(3);
    expect(result.liked.inArchive).toBe(2);
    expect(result.liked.added).toBe(2);
    expect(result.liked.unmatched).toBe(1);
    // Sıra dosya sırası, pozisyon 0'dan başlıyor
    const rows = createMany.mock.calls[0][0].data as Array<{
      trackId: string;
      position: number;
    }>;
    expect(rows.map((row) => row.trackId)).toEqual(['track-a', 'track-b']);
    expect(rows.map((row) => row.position)).toEqual([0, 1]);

    // Linkin Park arşivde → aday değil; Moby (1 beğeni) INNA'dan (0) önce
    expect(result.artists.inArchive).toBe(1);
    expect(result.artists.candidates.map((c) => c.name)).toEqual([
      'Moby',
      'INNA',
    ]);
    expect(result.artists.candidates[0].likedTracks).toBe(1);
  });

  it('yeniden yükleme mevcut parçaları atlar ve SONA ekler', async () => {
    const { service, createMany } = buildMocks({
      uriMap: new Map([
        ['spotify:track:aaa', 'track-a'],
        ['spotify:track:bbb', 'track-b'],
        // Sanatçı eklendi, Moby parçası artık arşivde
        ['spotify:track:ccc', 'track-c'],
      ]),
      playlist: {
        id: 'pl-1',
        slug: 'begenilenler',
        name: 'Beğenilenler',
        isDeleted: false,
      },
      playlistTracks: [
        { trackId: 'track-a', position: 0 },
        { trackId: 'track-b', position: 1 },
      ],
      knownArtistIds: ['LP1', 'MB1', 'IN1'],
    });

    const result = await service.importLibraryFile(
      Buffer.from(LIBRARY, 'utf8'),
    );

    expect(result.liked.added).toBe(1);
    expect(result.liked.alreadyInPlaylist).toBe(2);
    const rows = createMany.mock.calls[0][0].data as Array<{
      trackId: string;
      position: number;
    }>;
    expect(rows).toHaveLength(1);
    expect(rows[0].trackId).toBe('track-c');
    expect(rows[0].position).toBe(2);
    expect(result.artists.candidates).toHaveLength(0);
  });

  it('yanlış dosyayı (StreamingHistory gibi) sessizce kabul etmez', async () => {
    const { service } = buildMocks({
      uriMap: new Map(),
      playlist: null,
      playlistTracks: [],
      knownArtistIds: [],
    });
    await expect(
      service.importLibraryFile(Buffer.from('[{"endTime":"x"}]', 'utf8')),
    ).rejects.toMatchObject({ message: 'MUSIC.LIBRARY_NOT_AN_OBJECT' });
  });
});
