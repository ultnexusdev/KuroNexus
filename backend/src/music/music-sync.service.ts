import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slugify';
import { MusicArtworkService } from './music-artwork.service';
import {
  SpotifyService,
  type SpotifyAlbumSummary,
  type SpotifyImage,
  type SpotifyTrack,
} from './spotify.service';
import type {
  MusicAlbumType,
  MusicEntityKind,
} from '../generated/prisma/enums';

/**
 * Katalog senkronizasyonu — Spotify'dan gelen veriyi kendi tablolarımıza
 * yazar. Sayfalar bu servisi çağırmaz; onlar veritabanından okur.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * YAZMA İZNİ — DEĞİŞMEZ KURAL
 *
 * Bu servis YALNIZCA şu tablolara yazar:
 *   MusicalAct, MusicPerson, MusicAlbum, MusicTrack, MusicTrackCredit,
 *   MusicGenre (yalnızca `isApproved: false` ile OLUŞTURUR),
 *   MusicGenreOnAct, MusicPlaylist, MusicPlaylistTrack, MusicExternalRef,
 *   MusicSyncState
 *
 * Şu tablolara HİÇBİR kod yolundan dokunmaz:
 *   MusicRating, MusicNote, MusicFavorite, MusicPersonalEra  (kişisel katman)
 *   MusicPlay                                                (dinleme kaydı)
 *   MusicEra                                                 (küratör verisi)
 *   MusicRole                                                (kontrollü sözlük)
 *
 * Kişisel alanların ayrı tablolarda olmasının bütün sebebi bu: burada bir gün
 * `data: { ...spotifyPayload }` biçiminde bir yazma yazılsa, aynı tabloda
 * duran puan/not sessizce silinirdi. Ayrı tabloda bu imkânsız.
 * ══════════════════════════════════════════════════════════════════════════
 */

/** Başarısız kaydın bir sonraki denemesi: 2^deneme saat, en fazla 24 saat. */
const RETRY_BASE_MS = 60 * 60 * 1000;
const RETRY_MAX_MS = 24 * 60 * 60 * 1000;

/**
 * `album_type: 'single'` gelen ama 4+ parça taşıyan kayıtlar EP sayılır.
 *
 * Spotify'da EP diye bir tür YOK — EP'ler ya "single" ya "album" olarak
 * geliyor. Eşik olmadan bir sanatçının EP'leri single rafına düşer ve
 * tasarımın (2b/2c) albüm/single ayrımı anlamını yitirir. Eşik bir tahmin
 * değil sınır: Spotify'ın kendi tanımı da single'ı en çok 3 parça sayıyor.
 */
const EP_MIN_TRACKS = 4;

export interface ArtistSyncResult {
  actId: string;
  slug: string;
  name: string;
  albumsCreated: number;
  albumsUpdated: number;
  tracks: number;
  genresPending: number;
  artworkDownloaded: number;
  artworkFailed: number;
}

export interface PlaylistSyncResult {
  playlistId: string;
  name: string;
  tracksLinked: number;
  tracksMissing: number;
}

@Injectable()
export class MusicSyncService {
  private readonly logger = new Logger(MusicSyncService.name);
  /** Eksik rol sözlüğü uyarısı tur başına bir kez düşsün. */
  private warnedMissingRoles = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly spotify: SpotifyService,
    private readonly artwork: MusicArtworkService,
  ) {}

  /**
   * Bir sanatçıyı ve tüm diskografisini senkronize eder.
   *
   * Spotify'ın modelinde kişi/grup ayrımı olmadığı için gelen her "artist"
   * `MusicalAct` olarak açılır ve `actKind` UNCLASSIFIED kalır. `MusicPerson`
   * burada ASLA otomatik açılmaz — sınıflandırma küratörün işi (Hans Zimmer
   * varsayılan BAND olarak yerleşirse kimse fark etmez).
   */
  async syncArtist(spotifyId: string): Promise<ArtistSyncResult> {
    await this.markRunning('ACT', spotifyId);
    try {
      const result = await this.doSyncArtist(spotifyId);
      await this.markDone('ACT', spotifyId);
      return result;
    } catch (error) {
      await this.markFailed('ACT', spotifyId, error);
      throw error;
    }
  }

  private async doSyncArtist(spotifyId: string): Promise<ArtistSyncResult> {
    const artist = await this.spotify.getArtist(spotifyId);

    const existing = await this.prisma.musicalAct.findUnique({
      where: { spotifyId },
      select: { id: true, slug: true, image: true, imageSourceUrl: true },
    });

    const imageUrl = pickSquareImage(artist.images);
    // Kaynak adresi değişmediyse görsel yeniden indirilmez
    const needsImage =
      Boolean(imageUrl) &&
      (!existing?.image || existing.imageSourceUrl !== imageUrl);
    let localImage = existing?.image ?? null;
    let artworkDownloaded = 0;
    let artworkFailed = 0;
    if (needsImage) {
      const downloaded = await this.artwork.download(imageUrl);
      if (downloaded) {
        localImage = downloaded;
        artworkDownloaded += 1;
      } else {
        artworkFailed += 1;
      }
    }

    const slug =
      existing?.slug ?? (await this.uniqueActSlug(artist.name || spotifyId));

    const act = await this.prisma.musicalAct.upsert({
      where: { spotifyId },
      create: {
        spotifyId,
        slug,
        name: artist.name || slug,
        sortName: sortableName(artist.name),
        popularity: artist.popularity,
        followers: artist.followers,
        image: localImage,
        imageSourceUrl: imageUrl,
        imageFetchedAt: localImage ? new Date() : null,
        externalData: artist as never,
        externalDataFetchedAt: new Date(),
      },
      update: {
        name: artist.name || slug,
        sortName: sortableName(artist.name),
        popularity: artist.popularity,
        followers: artist.followers,
        // `actKind`, `bio`, `formedYear` ve banner GÜNCELLENMEZ: küratör verisi
        ...(needsImage && localImage
          ? {
              image: localImage,
              imageSourceUrl: imageUrl,
              imageFetchedAt: new Date(),
            }
          : {}),
        externalData: artist as never,
        externalDataFetchedAt: new Date(),
      },
      select: { id: true, slug: true, name: true },
    });

    await this.upsertExternalRef('ACT', act.id, spotifyId, artist.externalUrl);
    const genresPending = await this.linkGenres(act.id, artist.genres);

    /* ── Diskografi ─────────────────────────────────────────────────────── */

    const summaries = dedupeAlbums(
      await this.spotify.getArtistAlbums(spotifyId),
    );
    let albumsCreated = 0;
    let albumsUpdated = 0;
    let trackCount = 0;

    for (const summary of summaries) {
      try {
        const outcome = await this.syncAlbumFromSummary(act.id, summary);
        if (outcome.created) {
          albumsCreated += 1;
        } else {
          albumsUpdated += 1;
        }
        trackCount += outcome.tracks;
        artworkDownloaded += outcome.artworkDownloaded;
        artworkFailed += outcome.artworkFailed;
      } catch (error) {
        // Bir albüm düşerse tur devam eder; sonraki turda yeniden denenir
        this.logger.warn(
          `Albüm senkronize edilemedi (${summary.title}): ${String(error)}`,
        );
      }
    }

    return {
      actId: act.id,
      slug: act.slug,
      name: act.name,
      albumsCreated,
      albumsUpdated,
      tracks: trackCount,
      genresPending,
      artworkDownloaded,
      artworkFailed,
    };
  }

  /** Tek albümü kimliğinden tazeler (admin "⟳" düğmesi). */
  async syncAlbum(spotifyId: string): Promise<{ tracks: number }> {
    const album = await this.prisma.musicAlbum.findUnique({
      where: { spotifyId },
      select: { actId: true },
    });
    if (!album) {
      throw new NotFoundException('MUSIC.ALBUM_NOT_FOUND');
    }
    await this.markRunning('ALBUM', spotifyId);
    try {
      const detail = await this.spotify.getAlbum(spotifyId);
      const outcome = await this.syncAlbumFromSummary(album.actId, detail);
      await this.markDone('ALBUM', spotifyId);
      return { tracks: outcome.tracks };
    } catch (error) {
      await this.markFailed('ALBUM', spotifyId, error);
      throw error;
    }
  }

  private async syncAlbumFromSummary(
    actId: string,
    summary: SpotifyAlbumSummary,
  ): Promise<{
    created: boolean;
    tracks: number;
    artworkDownloaded: number;
    artworkFailed: number;
  }> {
    const existing = await this.prisma.musicAlbum.findUnique({
      where: { spotifyId: summary.spotifyId },
      select: { id: true, slug: true, artwork: true, artworkSourceUrl: true },
    });

    const artworkUrl = pickSquareImage(summary.images);
    const needsArtwork =
      Boolean(artworkUrl) &&
      (!existing?.artwork || existing.artworkSourceUrl !== artworkUrl);
    let localArtwork = existing?.artwork ?? null;
    let artworkDownloaded = 0;
    let artworkFailed = 0;
    if (needsArtwork) {
      const downloaded = await this.artwork.download(artworkUrl);
      if (downloaded) {
        localArtwork = downloaded;
        artworkDownloaded += 1;
      } else {
        artworkFailed += 1;
      }
    }

    const released = parseReleaseDate(
      summary.releaseDate,
      summary.releaseDatePrecision,
    );
    const slug =
      existing?.slug ??
      (await this.uniqueAlbumSlug(summary.title, released?.getUTCFullYear()));

    const albumData = {
      title: summary.title || slug,
      albumType: mapAlbumType(summary.albumType, summary.totalTracks),
      releaseDate: released,
      releaseDatePrecision: summary.releaseDatePrecision,
      totalTracks: summary.totalTracks,
      label:
        'label' in summary
          ? ((summary as { label?: string | null }).label ?? null)
          : null,
      popularity:
        'popularity' in summary
          ? ((summary as { popularity?: number | null }).popularity ?? null)
          : null,
      externalData: summary as never,
      externalDataFetchedAt: new Date(),
    };

    const album = await this.prisma.musicAlbum.upsert({
      where: { spotifyId: summary.spotifyId },
      create: {
        ...albumData,
        spotifyId: summary.spotifyId,
        slug,
        actId,
        artwork: localArtwork,
        artworkSourceUrl: artworkUrl,
        artworkFetchedAt: localArtwork ? new Date() : null,
      },
      update: {
        ...albumData,
        // `eraId` GÜNCELLENMEZ: küratörün kurduğu bağ
        ...(needsArtwork && localArtwork
          ? {
              artwork: localArtwork,
              artworkSourceUrl: artworkUrl,
              artworkFetchedAt: new Date(),
            }
          : {}),
      },
      select: { id: true },
    });

    await this.upsertExternalRef(
      'ALBUM',
      album.id,
      summary.spotifyId,
      summary.externalUrl,
    );

    const tracks = await this.spotify.getAlbumTracks(summary.spotifyId);
    let linked = 0;
    for (const track of tracks) {
      try {
        await this.upsertTrack(album.id, track);
        linked += 1;
      } catch (error) {
        this.logger.warn(
          `Parça senkronize edilemedi (${track.title}): ${String(error)}`,
        );
      }
    }

    return {
      created: !existing,
      tracks: linked,
      artworkDownloaded,
      artworkFailed,
    };
  }

  private async upsertTrack(
    albumId: string,
    track: SpotifyTrack,
  ): Promise<string> {
    const existing = await this.prisma.musicTrack.findUnique({
      where: { spotifyId: track.spotifyId },
      select: { id: true, slug: true },
    });
    const slug = existing?.slug ?? (await this.uniqueTrackSlug(track.title));

    const data = {
      title: track.title || slug,
      discNumber: track.discNumber,
      trackNumber: track.trackNumber,
      durationMs: track.durationMs,
      isExplicit: track.isExplicit,
      externalData: track as never,
      externalDataFetchedAt: new Date(),
    };

    const row = await this.prisma.musicTrack.upsert({
      where: { spotifyId: track.spotifyId },
      create: { ...data, spotifyId: track.spotifyId, slug, albumId },
      update: { ...data, albumId },
      select: { id: true },
    });

    await this.upsertExternalRef(
      'TRACK',
      row.id,
      track.spotifyId,
      track.externalUrl,
    );
    await this.linkTrackCredits(row.id, track);
    return row.id;
  }

  /**
   * Parça künyesi: ilk sanatçı `primary_artist`, kalanlar `featured_artist`.
   *
   * Rol sözlüğü bu servis tarafından YAZILMAZ (yazma izni kuralı). Sözlük
   * kurulmamışsa künye sessizce atlanır ve bir uyarı düşer — albümün arşive
   * girmemesi kabul edilemez. Sözlüğü kurmak için: `prisma/seed.ts` ya da
   * `POST /admin/music/roles/seed`.
   */
  private async linkTrackCredits(
    trackId: string,
    track: SpotifyTrack,
  ): Promise<void> {
    if (track.artists.length === 0) {
      return;
    }
    const roles = await this.prisma.musicRole.findMany({
      where: { key: { in: ['primary_artist', 'featured_artist'] } },
      select: { id: true, key: true },
    });
    const primaryRole = roles.find((role) => role.key === 'primary_artist');
    const featuredRole = roles.find((role) => role.key === 'featured_artist');
    if (!primaryRole || !featuredRole) {
      if (!this.warnedMissingRoles) {
        this.warnedMissingRoles = true;
        this.logger.warn(
          'Rol sözlüğü eksik (primary_artist/featured_artist) — parça künyeleri atlanıyor. Kurmak için: POST /admin/music/roles/seed',
        );
      }
      return;
    }

    for (const [index, ref] of track.artists.entries()) {
      // Künye yalnızca arşivde act kaydı olan sanatçılar için kurulur:
      // Spotify her konuk için bir kimlik veriyor ama hepsini act olarak
      // açmak arşivi tanımadığımız yüzlerce kayıtla doldurur.
      const act = await this.prisma.musicalAct.findUnique({
        where: { spotifyId: ref.spotifyId },
        select: { id: true },
      });
      if (!act) {
        continue;
      }
      const roleId = index === 0 ? primaryRole.id : featuredRole.id;
      const existing = await this.prisma.musicTrackCredit.findFirst({
        where: { trackId, actId: act.id, roleId },
        select: { id: true },
      });
      if (existing) {
        await this.prisma.musicTrackCredit.update({
          where: { id: existing.id },
          data: { orderIndex: index },
        });
        continue;
      }
      await this.prisma.musicTrackCredit.create({
        data: { trackId, actId: act.id, roleId, orderIndex: index },
      });
    }
  }

  /**
   * Spotify türlerini bağlar. **Hiçbiri otomatik onaylanmaz.**
   *
   * `BookGenre` deseni: kaynaktan gelen tür `isApproved: false` ile açılır,
   * süzgeçte görünmez, admin panelde onay bekler. Gerekçe şemada yazılı —
   * otomatik kabul edilseydi liste aynı kavramın varyantlarıyla dolardı
   * ("rock", "hard rock", "album rock", "classic rock"…). Spotify'ın `genres`
   * alanı tam olarak böyle davranıyor.
   *
   * Var olan bir tür GÜNCELLENMEZ: onaylanmış bir tür ikinci sync'te
   * `false`a düşerse süzgeçten sessizce kaybolurdu.
   */
  private async linkGenres(actId: string, genres: string[]): Promise<number> {
    let pending = 0;
    for (const label of genres) {
      const name = label.trim();
      if (!name) {
        continue;
      }
      const slug = slugify(name);
      if (!slug) {
        continue;
      }
      const genre = await this.prisma.musicGenre.upsert({
        where: { slug },
        create: { slug, name, isApproved: false },
        update: {},
        select: { id: true, isApproved: true },
      });
      if (!genre.isApproved) {
        pending += 1;
      }
      await this.prisma.musicGenreOnAct.upsert({
        where: { actId_genreId: { actId, genreId: genre.id } },
        create: { actId, genreId: genre.id },
        update: {},
      });
    }
    return pending;
  }

  /* ── Çalma listeleri ─────────────────────────────────────────────────── */

  /**
   * Herkese açık bir çalma listesini senkronize eder.
   *
   * Kullanıcı kararı (11 Ağustos 2026): listeler herkese açık, yani Client
   * Credentials yeterli. ⚠️ Spotify'ın KENDİ editoryal/algoritmik listeleri
   * (Discover Weekly vb.) yeni uygulamalara kapalı — o kimlikler 404 döner.
   *
   * Parçalar YALNIZCA arşivde karşılığı olanlarla bağlanır. Eksik parçaları
   * buradan açmak, listedeki her yabancı sanatçının albümünü de açmayı
   * gerektirirdi; sayım `tracksMissing` ile bildiriliyor.
   */
  async syncPlaylist(spotifyId: string): Promise<PlaylistSyncResult> {
    const meta = await this.spotify.getPlaylist(spotifyId);
    const items = await this.spotify.getPlaylistTracks(spotifyId);

    const existing = await this.prisma.musicPlaylist.findUnique({
      where: { spotifyId },
      select: { id: true, slug: true, artwork: true, artworkSourceUrl: true },
    });

    const artworkUrl = pickSquareImage(meta.images);
    const needsArtwork =
      Boolean(artworkUrl) &&
      (!existing?.artwork || existing.artworkSourceUrl !== artworkUrl);
    let localArtwork = existing?.artwork ?? null;
    if (needsArtwork) {
      localArtwork = (await this.artwork.download(artworkUrl)) ?? localArtwork;
    }

    const slug =
      existing?.slug ?? (await this.uniquePlaylistSlug(meta.name || spotifyId));

    // Süre toplamı parçalardan; Spotify liste künyesinde vermiyor
    const durationMs = items.reduce(
      (total, item) => total + (item.track.durationMs ?? 0),
      0,
    );

    const playlist = await this.prisma.musicPlaylist.upsert({
      where: { spotifyId },
      create: {
        spotifyId,
        slug,
        name: meta.name || slug,
        description: meta.description,
        trackCount: meta.totalTracks ?? items.length,
        durationMs: durationMs > 0 ? durationMs : null,
        artwork: localArtwork,
        artworkSourceUrl: artworkUrl,
        artworkFetchedAt: localArtwork ? new Date() : null,
        externalData: meta as never,
        externalDataFetchedAt: new Date(),
      },
      update: {
        name: meta.name || slug,
        description: meta.description,
        trackCount: meta.totalTracks ?? items.length,
        durationMs: durationMs > 0 ? durationMs : null,
        // `isFavorite` ve `orderIndex` GÜNCELLENMEZ: küratör kararı
        ...(needsArtwork && localArtwork
          ? {
              artwork: localArtwork,
              artworkSourceUrl: artworkUrl,
              artworkFetchedAt: new Date(),
            }
          : {}),
        externalData: meta as never,
        externalDataFetchedAt: new Date(),
      },
      select: { id: true, name: true },
    });

    let tracksLinked = 0;
    let tracksMissing = 0;
    for (const [index, item] of items.entries()) {
      const track = await this.prisma.musicTrack.findUnique({
        where: { spotifyId: item.track.spotifyId },
        select: { id: true },
      });
      if (!track) {
        tracksMissing += 1;
        continue;
      }
      await this.prisma.musicPlaylistTrack.upsert({
        where: {
          playlistId_trackId: { playlistId: playlist.id, trackId: track.id },
        },
        create: {
          playlistId: playlist.id,
          trackId: track.id,
          position: index,
          addedAt: item.addedAt ? new Date(item.addedAt) : null,
        },
        update: { position: index },
      });
      tracksLinked += 1;
    }

    return {
      playlistId: playlist.id,
      name: playlist.name,
      tracksLinked,
      tracksMissing,
    };
  }

  /* ── Görsel geri doldurma ────────────────────────────────────────────── */

  /**
   * Kapağı inmemiş kayıtları toplar ve yeniden dener.
   *
   * Ayrı bir retry kuyruğu tablosuna gerek yok: `artworkFetchedAt` `null`
   * olan her satır zaten bekleyen iş demek. Kitap kanadındaki
   * `/admin/books/covers/localize` ucuyla aynı desen.
   */
  async localizeMissingArtwork(limit = 60): Promise<{
    albums: number;
    acts: number;
    failed: number;
  }> {
    let albums = 0;
    let acts = 0;
    let failed = 0;

    const pendingAlbums = await this.prisma.musicAlbum.findMany({
      where: {
        isDeleted: false,
        artworkFetchedAt: null,
        artworkSourceUrl: { not: null },
      },
      select: { id: true, artworkSourceUrl: true },
      take: limit,
    });
    for (const album of pendingAlbums) {
      const local = await this.artwork.download(album.artworkSourceUrl);
      if (!local) {
        failed += 1;
        continue;
      }
      await this.prisma.musicAlbum.update({
        where: { id: album.id },
        data: { artwork: local, artworkFetchedAt: new Date() },
      });
      albums += 1;
    }

    const pendingActs = await this.prisma.musicalAct.findMany({
      where: {
        isDeleted: false,
        imageFetchedAt: null,
        imageSourceUrl: { not: null },
      },
      select: { id: true, imageSourceUrl: true },
      take: limit,
    });
    for (const act of pendingActs) {
      const local = await this.artwork.download(act.imageSourceUrl);
      if (!local) {
        failed += 1;
        continue;
      }
      await this.prisma.musicalAct.update({
        where: { id: act.id },
        data: { image: local, imageFetchedAt: new Date() },
      });
      acts += 1;
    }

    return { albums, acts, failed };
  }

  /* ── Tür sözlüğü (küratör) ───────────────────────────────────────────── */

  /**
   * Onay bekleyen türler. Spotify'ın `genres` alanı tutarsız olduğu için bu
   * liste dolu olur ve dolu olması normaldir — küratör hangisinin gerçek bir
   * oda olduğuna karar verir.
   */
  async pendingGenres() {
    return this.prisma.musicGenre.findMany({
      where: { isApproved: false },
      orderBy: [{ acts: { _count: 'desc' } }, { name: 'asc' }],
      select: {
        id: true,
        slug: true,
        name: true,
        key: true,
        accentKey: true,
        _count: { select: { acts: true } },
      },
    });
  }

  /**
   * Türü onaylar / adını, i18n anahtarını, oda rengini ve üst türünü ayarlar.
   *
   * ⚠️ `accentKey` bir **token anahtarı**, renk değeri DEĞİL. Hex girilirse
   * reddedilir: veritabanına renk yazmak kural 16'yı veritabanı üzerinden
   * delmek ve tema değiştiğinde oda rengini sabit bırakmak olurdu.
   */
  async updateGenre(
    id: string,
    dto: {
      /** Panel formu dize gönderiyor, JSON gövde boolean — ikisi de kabul */
      isApproved?: boolean | 'true' | 'false';
      accentKey?: string;
      key?: string;
      name?: string;
      parentId?: string;
    },
  ) {
    const genre = await this.prisma.musicGenre.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!genre) {
      throw new NotFoundException('MUSIC.GENRE_NOT_FOUND');
    }

    if (dto.accentKey !== undefined && !isTokenKey(dto.accentKey)) {
      throw new BadRequestException('MUSIC.ACCENT_KEY_INVALID');
    }
    if (dto.key !== undefined && dto.key !== '' && !isTokenKey(dto.key)) {
      throw new BadRequestException('MUSIC.GENRE_KEY_INVALID');
    }
    if (dto.parentId === id) {
      throw new BadRequestException('MUSIC.GENRE_PARENT_SELF');
    }

    return this.prisma.musicGenre.update({
      where: { id },
      data: {
        ...(dto.isApproved !== undefined
          ? { isApproved: toBoolean(dto.isApproved) }
          : {}),
        ...(dto.accentKey !== undefined
          ? { accentKey: dto.accentKey || null }
          : {}),
        ...(dto.key !== undefined ? { key: dto.key || null } : {}),
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.parentId !== undefined
          ? { parentId: dto.parentId || null }
          : {}),
      },
      select: {
        id: true,
        slug: true,
        name: true,
        key: true,
        accentKey: true,
        isApproved: true,
        parentId: true,
      },
    });
  }

  /** Admin panelinin "son senkronizasyon" tablosu. */
  async recentSyncState() {
    return this.prisma.musicSyncState.findMany({
      orderBy: { lastRunAt: 'desc' },
      take: 20,
      select: {
        entityKind: true,
        entityId: true,
        status: true,
        attempts: true,
        lastError: true,
        lastRunAt: true,
        nextRunAt: true,
      },
    });
  }

  /* ── Senkronizasyon defteri ──────────────────────────────────────────── */

  private async markRunning(
    entityKind: MusicEntityKind,
    entityId: string,
  ): Promise<void> {
    await this.prisma.musicSyncState.upsert({
      where: { entityKind_entityId: { entityKind, entityId } },
      create: {
        entityKind,
        entityId,
        status: 'RUNNING',
        lastRunAt: new Date(),
      },
      update: { status: 'RUNNING', lastRunAt: new Date() },
    });
  }

  private async markDone(
    entityKind: MusicEntityKind,
    entityId: string,
  ): Promise<void> {
    await this.prisma.musicSyncState.update({
      where: { entityKind_entityId: { entityKind, entityId } },
      data: {
        status: 'OK',
        attempts: 0,
        lastError: null,
        lastRunAt: new Date(),
        nextRunAt: null,
      },
    });
  }

  private async markFailed(
    entityKind: MusicEntityKind,
    entityId: string,
    error: unknown,
  ): Promise<void> {
    const current = await this.prisma.musicSyncState.findUnique({
      where: { entityKind_entityId: { entityKind, entityId } },
      select: { attempts: true },
    });
    const attempts = (current?.attempts ?? 0) + 1;
    const delay = Math.min(RETRY_BASE_MS * 2 ** (attempts - 1), RETRY_MAX_MS);
    await this.prisma.musicSyncState.upsert({
      where: { entityKind_entityId: { entityKind, entityId } },
      create: {
        entityKind,
        entityId,
        status: 'FAILED',
        attempts,
        // Kural 6: kullanıcıya temiz mesaj, deftere ayrıntı
        lastError: String(error).slice(0, 500),
        lastRunAt: new Date(),
        nextRunAt: new Date(Date.now() + delay),
      },
      update: {
        status: 'FAILED',
        attempts,
        lastError: String(error).slice(0, 500),
        lastRunAt: new Date(),
        nextRunAt: new Date(Date.now() + delay),
      },
    });
  }

  private async upsertExternalRef(
    entityKind: MusicEntityKind,
    id: string,
    externalId: string,
    url: string | null,
  ): Promise<void> {
    const link =
      entityKind === 'ACT'
        ? { actId: id }
        : entityKind === 'ALBUM'
          ? { albumId: id }
          : entityKind === 'TRACK'
            ? { trackId: id }
            : { personId: id };

    await this.prisma.musicExternalRef.upsert({
      where: {
        provider_entityKind_externalId: {
          provider: 'SPOTIFY',
          entityKind,
          externalId,
        },
      },
      create: {
        provider: 'SPOTIFY',
        entityKind,
        externalId,
        url,
        lastSyncedAt: new Date(),
        ...link,
      },
      update: { url, lastSyncedAt: new Date(), ...link },
    });
  }

  /* ── Slug üretimi (kural 14) ─────────────────────────────────────────── */

  private uniqueActSlug(name: string): Promise<string> {
    return this.uniqueSlug(slugify(name) || 'sanatci', async (slug) => {
      const row = await this.prisma.musicalAct.findUnique({
        where: { slug },
        select: { id: true },
      });
      return Boolean(row);
    });
  }

  private uniqueAlbumSlug(title: string, year?: number): Promise<string> {
    // Yıl slug'a giriyor: aynı adı taşıyan yeniden basımlar ("Greatest Hits")
    // tek bir kuyruk numarasıyla ayrılmaktan daha okunur bir adres alsın
    const base = [slugify(title) || 'album', year ? String(year) : '']
      .filter(Boolean)
      .join('-');
    return this.uniqueSlug(base, async (slug) => {
      const row = await this.prisma.musicAlbum.findUnique({
        where: { slug },
        select: { id: true },
      });
      return Boolean(row);
    });
  }

  private uniqueTrackSlug(title: string): Promise<string> {
    return this.uniqueSlug(slugify(title) || 'parca', async (slug) => {
      const row = await this.prisma.musicTrack.findUnique({
        where: { slug },
        select: { id: true },
      });
      return Boolean(row);
    });
  }

  private uniquePlaylistSlug(name: string): Promise<string> {
    return this.uniqueSlug(slugify(name) || 'liste', async (slug) => {
      const row = await this.prisma.musicPlaylist.findUnique({
        where: { slug },
        select: { id: true },
      });
      return Boolean(row);
    });
  }

  /**
   * Çakışmada `-2`, `-3` … ekler.
   *
   * Yumuşak silinmiş kayıtların slug'ı `-deleted-{timestamp}` soneki aldığı
   * için (kural 14) onlar bu döngüyü tıkamaz — o yüzden `isDeleted` süzgeci
   * KOYMUYORUM: `slug` sütunu veritabanı düzeyinde tekil ve silinmiş kayıt da
   * o tekilliği tutuyor.
   */
  private async uniqueSlug(
    base: string,
    exists: (slug: string) => Promise<boolean>,
  ): Promise<string> {
    const root = base.slice(0, 90) || 'kayit';
    if (!(await exists(root))) {
      return root;
    }
    for (let suffix = 2; suffix < 500; suffix++) {
      const candidate = `${root}-${suffix}`;
      if (!(await exists(candidate))) {
        return candidate;
      }
    }
    // 500 çakışma gerçek bir veri sorunudur; rastgele son ek en azından
    // işlemin sessizce durmasını engeller
    return `${root}-${Date.now().toString(36)}`;
  }
}

/* ── Yardımcılar ─────────────────────────────────────────────────────────── */

/**
 * Kare görselden en büyüğünü seçer.
 *
 * Spotify listeyi büyükten küçüğe veriyor ama sıraya güvenmek gerekmiyor.
 * En büyüğü seçmek bilinçli: `next/image` küçültmeyi bizim tarafta yapıyor
 * (`imageSizes` merdiveni, bkz. `next.config.ts`) ve büyük kaynak bir kez
 * inip sonsuza kadar duruyor.
 */
function pickSquareImage(images: SpotifyImage[]): string | null {
  if (images.length === 0) {
    return null;
  }
  const sorted = [...images].sort(
    (a, b) =>
      (b.width ?? 0) * (b.height ?? 0) - (a.width ?? 0) * (a.height ?? 0),
  );
  return sorted[0]?.url ?? null;
}

/**
 * "Linkin Park" → "linkin park"; "The Weeknd" → "weeknd, the".
 *
 * Listeleme sırası için: İngilizce artikeller başta kalırsa favori sanatçı
 * listesinin yarısı "T" harfinde toplanır.
 */
function sortableName(name: string | null | undefined): string | null {
  if (!name) {
    return null;
  }
  const match = /^(the|a|an|el|la|los|las)\s+(.*)$/i.exec(name.trim());
  if (!match) {
    return name.trim().toLocaleLowerCase('tr-TR');
  }
  return `${match[2]}, ${match[1]}`.toLocaleLowerCase('tr-TR');
}

/**
 * Spotify tarihi üç hassasiyette veriyor: "2003", "2003-03", "2003-03-25".
 * Eksik parçalar 01 ile tamamlanıyor ama **hassasiyet ayrıca saklanıyor**
 * (`releaseDatePrecision`) — sayfa "1 Ocak 2003" diye uydurulmuş bir gün
 * göstermesin, yalnızca yılı yazsın.
 */
function parseReleaseDate(
  value: string | null,
  precision: string | null,
): Date | null {
  if (!value) {
    return null;
  }
  const parts = value.split('-');
  const year = Number.parseInt(parts[0] ?? '', 10);
  if (!Number.isFinite(year) || year < 1500 || year > 2200) {
    return null;
  }
  const month = precision === 'year' ? 1 : Number.parseInt(parts[1] ?? '1', 10);
  const day =
    precision === 'year' || precision === 'month'
      ? 1
      : Number.parseInt(parts[2] ?? '1', 10);
  const date = new Date(
    Date.UTC(
      year,
      (Number.isFinite(month) ? month : 1) - 1,
      Number.isFinite(day) ? day : 1,
    ),
  );
  return Number.isNaN(date.getTime()) ? null : date;
}

function mapAlbumType(raw: string, totalTracks: number | null): MusicAlbumType {
  const value = raw.toLowerCase();
  if (value === 'compilation') {
    return 'COMPILATION';
  }
  if (value === 'single') {
    // Spotify'da EP diye bir tür yok; 4+ parçalı "single" EP'dir
    return (totalTracks ?? 0) >= EP_MIN_TRACKS ? 'EP' : 'SINGLE';
  }
  // LIVE ve SOUNDTRACK Spotify'da ayrılmıyor; başlıktan tahmin etmek
  // ("Live at…") kırılgan olurdu — küratör düzeltir
  return 'ALBUM';
}

/**
 * Aynı albümün ülke baskılarını teke indirir.
 *
 * `market` süzgeci kullanmamanın bedeli bu: "Meteora" hem `4Y...` hem `7c...`
 * kimliğiyle, aynı ad ve yılla iki kez gelebiliyor. Süzgeç kullanmak ise
 * albümleri tamamen kaybettiriyordu (bkz. `getArtistAlbums` yorumu).
 *
 * Eleme ölçütü parça sayısı: deluxe/genişletilmiş baskı daha çok parça
 * taşıyor ve arşivde durması gereken o.
 */
/**
 * Token anahtarı biçimi: küçük harf, rakam, tire, alt çizgi.
 *
 * Renk değerini reddetmenin yolu bu — `#a6564f`, `oklch(…)` ve `rgb(…)`
 * hiçbiri bu kalıba uymuyor. Kural 16 bileşende hex yasaklıyor; veritabanı da
 * hex taşımamalı, yoksa yasak veritabanı üzerinden delinir.
 */
function isTokenKey(value: string): boolean {
  return value === '' || /^[a-z0-9][a-z0-9_-]{0,38}$/.test(value);
}

/**
 * DTO'dan gelen `isApproved` hem boolean hem dize olabiliyor (form gönderimi
 * "true" yazar). `class-validator` ikisini de geçiriyor; karar burada tekleşiyor.
 */
function toBoolean(value: boolean | string): boolean {
  return value === true || value === 'true';
}

function dedupeAlbums(items: SpotifyAlbumSummary[]): SpotifyAlbumSummary[] {
  const best = new Map<string, SpotifyAlbumSummary>();
  for (const item of items) {
    const year = item.releaseDate?.slice(0, 4) ?? '';
    const key = `${slugify(item.title)}|${year}|${item.albumType.toLowerCase()}`;
    const current = best.get(key);
    if (!current || (item.totalTracks ?? 0) > (current.totalTracks ?? 0)) {
      best.set(key, item);
    }
  }
  return [...best.values()];
}
