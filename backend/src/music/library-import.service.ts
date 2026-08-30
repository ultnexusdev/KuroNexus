import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ListeningService } from './listening.service';

/**
 * Spotify "Account data" paketindeki `YourLibrary.json` içe aktarımı.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * NE YAPIYOR (kullanıcı kararı, 30 Ağustos 2026)
 *
 * 1. **Beğenilen parçalar → "Beğenilenler" yerel listesi.** Dosyadaki 800+
 *    beğeniden yalnızca arşivde karşılığı OLAN parçalar listeye bağlanıyor —
 *    `MusicPlaylistTrack.trackId` zorunlu FK, kayıtsız parça bağlanamaz.
 *    Dosyayı yeniden yüklemek güvenli: bileşik anahtar tekrarları eler,
 *    yeni eşleşenler sona eklenir. Yani sanatçı ekledikçe aynı dosya tekrar
 *    yüklenir ve liste kendiliğinden dolar (dinlemedeki `backfill` deseni).
 *
 * 2. **Takip edilen sanatçılar → aday listesi.** Dosyadaki `artists[]`
 *    `spotify:artist:ID` taşıyor; arşivdeki `MusicalAct.spotifyId` ile KESİN
 *    karşılaştırma yapılıyor (isim tahmini yok). Arşivde olmayanlar, kaç
 *    beğenilen parçası olduğuna göre sıralanmış aday listesi olarak dönüyor;
 *    panel her adayın yanına tek tuşluk "ekle" koyuyor.
 *
 * Aday listesi VERİTABANINA YAZILMIYOR. Sebep: liste dosyadan her yüklemede
 * yeniden hesaplanabiliyor; kalıcı tablo migration + "eklendi/vazgeçildi"
 * durum yönetimi getirirdi ve tek kullanıcılı arşivde karşılığı yok
 * (çok kullanıcılı yapı ölçülüp reddedildi, bkz. hafıza kaydı).
 * ══════════════════════════════════════════════════════════════════════════
 */

/** "Beğenilenler" listesinin sabit slug'ı — yeniden yükleme aynı listeyi bulur. */
const LIKED_PLAYLIST_SLUG = 'begenilenler';
const LIKED_PLAYLIST_NAME = 'Beğenilenler';

/** `music-playlist.service.ts` ile aynı üst sınır. */
const MAX_TRACKS = 1000;

/** Tek sorguya giren kimlik sayısı — parametre sınırına dayanmamak için. */
const CHUNK = 1_000;

interface LibraryTrackEntry {
  artist?: string;
  album?: string;
  track?: string;
  uri?: string;
}

interface LibraryArtistEntry {
  name?: string;
  uri?: string;
}

export interface LibraryImportResult {
  liked: {
    /** Dosyadaki beğenilen parça sayısı */
    total: number;
    /** Arşivde karşılığı bulunan */
    inArchive: number;
    /** Bu yüklemede listeye eklenen */
    added: number;
    /** Zaten listede olduğu için atlanan */
    alreadyInPlaylist: number;
    /** Arşivde karşılığı olmayan (sanatçı eklendikçe sonraki yüklemede bağlanır) */
    unmatched: number;
    playlist: { id: string; slug: string; name: string };
  };
  artists: {
    /** Dosyadaki takip edilen sanatçı sayısı */
    total: number;
    /** Arşivde zaten olan */
    inArchive: number;
    /** Arşivde olmayanlar — beğenilen parça sayısına göre sıralı */
    candidates: Array<{ name: string; spotifyId: string; likedTracks: number }>;
  };
}

@Injectable()
export class LibraryImportService {
  private readonly logger = new Logger(LibraryImportService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly listening: ListeningService,
  ) {}

  async importLibraryFile(buffer: Buffer): Promise<LibraryImportResult> {
    const { tracks, artists } = this.parse(buffer);

    const liked = await this.importLikedTracks(tracks);
    const artistReport = await this.reportArtists(artists, tracks);

    this.logger.log(
      `Kütüphane içe aktarımı: ${liked.added} parça listeye eklendi, ` +
        `${liked.unmatched} arşiv dışı; ${artistReport.candidates.length} sanatçı adayı`,
    );
    return { liked, artists: artistReport };
  }

  /* ── Beğenilenler ────────────────────────────────────────────────────── */

  private async importLikedTracks(
    tracks: LibraryTrackEntry[],
  ): Promise<LibraryImportResult['liked']> {
    const uris = [
      ...new Set(
        tracks
          .map((entry) => entry.uri?.trim())
          .filter((uri): uri is string => Boolean(uri)),
      ),
    ];
    const trackIdByUri = await this.listening.mapUrisToTracks(uris);

    const playlist = await this.findOrCreatePlaylist();
    const existing = await this.prisma.musicPlaylistTrack.findMany({
      where: { playlistId: playlist.id },
      select: { trackId: true, position: true },
    });
    const inPlaylist = new Set(existing.map((entry) => entry.trackId));
    let position =
      existing.reduce((max, entry) => Math.max(max, entry.position), -1) + 1;

    let added = 0;
    let alreadyInPlaylist = 0;
    let inArchive = 0;
    const rows: Array<{
      playlistId: string;
      trackId: string;
      position: number;
      addedAt: null;
    }> = [];
    // Dosya sırası korunuyor; beğeni tarihi dosyada YOK, `addedAt` boş kalıyor
    for (const entry of tracks) {
      const uri = entry.uri?.trim();
      if (!uri) {
        continue;
      }
      const trackId = trackIdByUri.get(uri);
      if (!trackId) {
        continue;
      }
      inArchive += 1;
      if (inPlaylist.has(trackId)) {
        alreadyInPlaylist += 1;
        continue;
      }
      if (existing.length + rows.length >= MAX_TRACKS) {
        // Sınıra dayanınca sessiz kalma — sayı raporda görünür
        break;
      }
      inPlaylist.add(trackId);
      rows.push({
        playlistId: playlist.id,
        trackId,
        position,
        addedAt: null,
      });
      position += 1;
    }

    if (rows.length > 0) {
      const written = await this.prisma.musicPlaylistTrack.createMany({
        data: rows,
        skipDuplicates: true,
      });
      added = written.count;
    }

    return {
      total: tracks.length,
      inArchive,
      added,
      alreadyInPlaylist,
      unmatched: tracks.length - inArchive,
      playlist,
    };
  }

  /**
   * "Beğenilenler" listesini bulur; yoksa kurar, yumuşak silinmişse geri
   * getirir. Geri getirme bilinçli: kullanıcı listeyi silmiş de olsa dosyayı
   * yeniden yüklemesi "listeyi istiyorum" demek — slug'ı `begenilenler-2`
   * diye çoğaltmak eski adresi öksüz bırakırdı.
   */
  private async findOrCreatePlaylist(): Promise<{
    id: string;
    slug: string;
    name: string;
  }> {
    const existing = await this.prisma.musicPlaylist.findUnique({
      where: { slug: LIKED_PLAYLIST_SLUG },
      select: { id: true, slug: true, name: true, isDeleted: true },
    });
    if (existing) {
      if (existing.isDeleted) {
        await this.prisma.musicPlaylist.update({
          where: { id: existing.id },
          data: { isDeleted: false },
        });
      }
      return { id: existing.id, slug: existing.slug, name: existing.name };
    }
    return this.prisma.musicPlaylist.create({
      data: {
        slug: LIKED_PLAYLIST_SLUG,
        name: LIKED_PLAYLIST_NAME,
        // Yerel liste: `spotifyId` yazılMIYOR — sync erişemesin (bkz.
        // `music-playlist.service.ts` başındaki gerekçe)
        trackCount: null,
        durationMs: null,
      },
      select: { id: true, slug: true, name: true },
    });
  }

  /* ── Sanatçı adayları ────────────────────────────────────────────────── */

  private async reportArtists(
    artists: LibraryArtistEntry[],
    tracks: LibraryTrackEntry[],
  ): Promise<LibraryImportResult['artists']> {
    const entries = artists
      .map((entry) => ({
        name: entry.name?.trim() ?? '',
        spotifyId: artistIdFromUri(entry.uri ?? ''),
      }))
      .filter(
        (entry): entry is { name: string; spotifyId: string } =>
          entry.name.length > 0 && entry.spotifyId !== null,
      );

    const knownIds = new Set<string>();
    const ids = entries.map((entry) => entry.spotifyId);
    for (let index = 0; index < ids.length; index += CHUNK) {
      const slice = ids.slice(index, index + CHUNK);
      const acts = await this.prisma.musicalAct.findMany({
        where: { spotifyId: { in: slice } },
        select: { spotifyId: true },
      });
      for (const act of acts) {
        if (act.spotifyId) {
          knownIds.add(act.spotifyId);
        }
      }
    }

    /**
     * Adayın önem sırası = dosyadaki beğenilen parça sayısı. Parça satırında
     * sanatçı URI'si YOK, yalnızca adı var — bu sayım gösterim sıralaması
     * için isim üzerinden yapılıyor; eşleştirmenin kendisi kimlikle.
     */
    const likedByArtistName = new Map<string, number>();
    for (const entry of tracks) {
      const name = entry.artist?.trim().toLocaleLowerCase('en');
      if (!name) {
        continue;
      }
      likedByArtistName.set(name, (likedByArtistName.get(name) ?? 0) + 1);
    }

    const candidates = entries
      .filter((entry) => !knownIds.has(entry.spotifyId))
      .map((entry) => ({
        name: entry.name,
        spotifyId: entry.spotifyId,
        likedTracks:
          likedByArtistName.get(entry.name.toLocaleLowerCase('en')) ?? 0,
      }))
      .sort(
        (a, b) => b.likedTracks - a.likedTracks || a.name.localeCompare(b.name),
      );

    return {
      total: entries.length,
      inArchive: entries.length - candidates.length,
      candidates,
    };
  }

  /* ── Ayrıştırma ──────────────────────────────────────────────────────── */

  private parse(buffer: Buffer): {
    tracks: LibraryTrackEntry[];
    artists: LibraryArtistEntry[];
  } {
    let parsed: unknown;
    try {
      parsed = JSON.parse(buffer.toString('utf8')) as unknown;
    } catch {
      throw new BadRequestException('MUSIC.LIBRARY_INVALID_JSON');
    }
    if (
      parsed === null ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed)
    ) {
      throw new BadRequestException('MUSIC.LIBRARY_NOT_AN_OBJECT');
    }
    const record = parsed as Record<string, unknown>;
    const tracks = Array.isArray(record.tracks)
      ? (record.tracks as LibraryTrackEntry[])
      : [];
    const artists = Array.isArray(record.artists)
      ? (record.artists as LibraryArtistEntry[])
      : [];
    if (tracks.length === 0 && artists.length === 0) {
      // Yanlış dosya (ör. StreamingHistory) sessizce "0 eklendi" demesin
      throw new BadRequestException('MUSIC.LIBRARY_EMPTY');
    }
    return { tracks, artists };
  }
}

/** "spotify:artist:0LcJLqbBmaGUft1e9Mm8HV" → kimlik; uymuyorsa null. */
function artistIdFromUri(uri: string): string | null {
  const match = /^spotify:artist:([A-Za-z0-9]+)$/.exec(uri.trim());
  return match ? match[1] : null;
}
