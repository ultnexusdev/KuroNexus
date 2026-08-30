import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LibraryImportService } from './library-import.service';
import { ListeningService } from './listening.service';
import { MusicAdminController } from './music.admin.controller';
import { MusicArtworkService } from './music-artwork.service';
import { MusicBrainzService } from './musicbrainz.service';
import { MusicCuratorService } from './music-curator.service';
import { MusicPlaylistService } from './music-playlist.service';
import { MusicController } from './music.controller';
import { MusicCron } from './music.cron';
import { MusicRolesService } from './music-roles.service';
import { MusicService } from './music.service';
import { MusicSyncService } from './music-sync.service';
import { SpotifyService } from './spotify.service';

/**
 * Salon 06 · Müzik Arşivi.
 *
 * Katman ayrımı bilinçli:
 *   MusicService        sayfaların okuduğu tek yer — Spotify'a HİÇ çıkmaz
 *   MusicSyncService    dışarıya çıkan tek yer (cron + admin yolundan)
 *   ListeningService    dinleme kaydı; MusicPlay'e yazan tek servis
 *
 * `MusicArtworkService` `OnModuleInit`te `UPLOAD_DIR/music/` klasörünü açıyor;
 * dosyalar `/uploads/music/…` olarak `ServeStaticModule` üzerinden sunuluyor
 * (bkz. `app.module.ts`).
 */
@Module({
  imports: [PrismaModule],
  controllers: [MusicController, MusicAdminController],
  providers: [
    MusicService,
    MusicSyncService,
    MusicArtworkService,
    MusicBrainzService,
    MusicCuratorService,
    MusicPlaylistService,
    MusicRolesService,
    ListeningService,
    LibraryImportService,
    SpotifyService,
    MusicCron,
  ],
  exports: [MusicService],
})
export class MusicModule {}
