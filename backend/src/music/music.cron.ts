import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { ListeningService } from './listening.service';
import { MusicSyncService } from './music-sync.service';
import { SpotifyService } from './spotify.service';

/**
 * Haftalık katalog tazelemesi + eksik iş toplama.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * NEDEN REDIS/BULL YOK
 *
 * Plan Bull öneriyordu ama o desen başka bir projeden (ultnexus) geliyor. Bu
 * repoda Redis servisi ve `bull`/`ioredis` bağımlılığı YOK; `docker-compose.yml`
 * yalnızca Postgres taşıyor. Mevcut ve çalışan iki sync (`anime/anime.cron.ts`,
 * `football/football.service.ts`) `@nestjs/schedule` + yeniden girişi
 * engelleyen bir `running` bayrağıyla yürüyor; bu sınıf onların kardeşi.
 *
 * Bull'un buradaki tek gerçek üstünlüğü kalıcı kuyruk ve retry sayacıydı;
 * ikisi de `MusicSyncState` tablosunda var. Üstelik kuyruk veritabanında
 * olduğu için `pg_dump` yedeğine giriyor (kural 15) — Redis girmezdi.
 * ══════════════════════════════════════════════════════════════════════════
 */

/** Tek turda en fazla kaç act tazelenir. Spotify kotasını korumak için. */
const MAX_ACTS_PER_RUN = 25;
/** Tek turda kaç başarısız kayıt yeniden denenir. */
const MAX_RETRIES_PER_RUN = 10;

@Injectable()
export class MusicCron {
  private readonly logger = new Logger(MusicCron.name);
  /**
   * Yeniden girişi engeller. Anime cron'unda aynı bayrak var ve sebebi somut:
   * bir tur bir saatten uzun sürerse ikinci tur devreye girip aynı kayıtları
   * paralel yazmaya başlardı.
   */
  private running = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly sync: MusicSyncService,
    private readonly spotify: SpotifyService,
    private readonly listening: ListeningService,
  ) {}

  /**
   * Pazartesi 06:00 UTC — futbol (04:00) ve anime (05:00) turlarının ardında.
   * Üçü aynı saate denk gelirse tek konteynerde üç dış kaynağa birden
   * yüklenirdi.
   */
  @Cron('0 6 * * 1', { name: 'music-catalog-sync', timeZone: 'UTC' })
  async refreshCatalog(): Promise<void> {
    if (!this.spotify.isConfigured()) {
      this.logger.warn(
        'Spotify anahtarları tanımsız, müzik tazelemesi atlandı (SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET)',
      );
      return;
    }
    if (this.running) {
      this.logger.warn('Müzik tazelemesi zaten çalışıyor, bu tur atlandı');
      return;
    }
    this.running = true;
    try {
      const refreshed = await this.refreshStaleActs();
      const retried = await this.retryFailed();
      const artwork = await this.sync.localizeMissingArtwork();
      const linked = await this.listening.backfillTrackLinks();

      this.logger.log(
        `Haftalık müzik turu: ${refreshed} act tazelendi, ${retried} yeniden denendi, ` +
          `${artwork.albums + artwork.acts} görsel indi (${artwork.failed} başarısız), ` +
          `${linked.linked} dinleme parçaya bağlandı`,
      );
    } finally {
      this.running = false;
    }
  }

  /**
   * En bayat act'ler önce. Bütün arşivi her hafta Spotify'a sormak gereksiz
   * yük — popülerlik ve takipçi sayısı dışında act künyesi neredeyse hiç
   * değişmiyor, ama yeni albüm çıkışını yakalamak için sıra dönmeli.
   */
  private async refreshStaleActs(): Promise<number> {
    const acts = await this.prisma.musicalAct.findMany({
      where: { isDeleted: false, spotifyId: { not: null } },
      orderBy: [{ externalDataFetchedAt: { sort: 'asc', nulls: 'first' } }],
      take: MAX_ACTS_PER_RUN,
      select: { spotifyId: true, name: true },
    });

    let done = 0;
    for (const act of acts) {
      if (!act.spotifyId) {
        continue;
      }
      try {
        await this.sync.syncArtist(act.spotifyId);
        done += 1;
      } catch (error) {
        // Bir act düşerse tur devam eder; `MusicSyncState` geri çekilmeyi
        // zaten kaydetti, ertesi turda sırası gelir
        this.logger.warn(`Act tazelenemedi (${act.name}): ${String(error)}`);
      }
    }
    return done;
  }

  /** Sırası gelmiş başarısız kayıtlar (`nextRunAt` geçmiş). */
  private async retryFailed(): Promise<number> {
    const pending = await this.prisma.musicSyncState.findMany({
      where: {
        status: 'FAILED',
        nextRunAt: { lte: new Date() },
        entityKind: { in: ['ACT', 'ALBUM'] },
      },
      orderBy: { nextRunAt: 'asc' },
      take: MAX_RETRIES_PER_RUN,
      select: { entityKind: true, entityId: true },
    });

    let done = 0;
    for (const row of pending) {
      try {
        if (row.entityKind === 'ACT') {
          await this.sync.syncArtist(row.entityId);
        } else {
          await this.sync.syncAlbum(row.entityId);
        }
        done += 1;
      } catch {
        // Geri çekilme sayacı `markFailed` içinde arttı; sessiz geç
      }
    }
    return done;
  }
}
