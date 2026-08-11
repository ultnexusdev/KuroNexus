import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user';
import { ListeningService } from './listening.service';
import { MusicCuratorService } from './music-curator.service';
import { MusicRolesService } from './music-roles.service';
import { MusicSyncService } from './music-sync.service';
import { SpotifyService } from './spotify.service';
import {
  CreateGenreDto,
  extractSpotifyId,
  SetActGenresDto,
  SyncSpotifyDto,
  UpdateActDto,
  UpdateGenreDto,
} from './dto/sync-spotify.dto';

/** Geçmiş dosyası sınırı. Uzatılmış geçmiş yıl başına ~5-15 MB. */
const MAX_HISTORY_BYTES = 64 * 1024 * 1024;

/**
 * Küratör uçları. `@Roles('ADMIN')` sınıf düzeyinde — hiçbiri herkese açık
 * değil ve `@Public()` taşımıyor.
 */
@Roles('ADMIN')
@Controller('admin/music')
export class MusicAdminController {
  constructor(
    private readonly sync: MusicSyncService,
    private readonly spotify: SpotifyService,
    private readonly listening: ListeningService,
    private readonly roles: MusicRolesService,
    private readonly curator: MusicCuratorService,
  ) {}

  /** Panelin "Spotify bağlı mı" göstergesi. Anahtar DEĞERİ dönmez. */
  @Get('status')
  async status() {
    return {
      spotifyConfigured: this.spotify.isConfigured(),
      roleVocabulary: await this.roles.count(),
      syncState: await this.sync.recentSyncState(),
    };
  }

  /**
   * Rol sözlüğünü kurar (`primary_artist`, `vocalist`, `composer`…).
   *
   * Neden ayrı bir uç: sözlük kontrollü ve **sync tarafından yazılMIYOR**
   * (yazma izni kuralı). `prisma/seed.ts` de aynı listeyi kuruyor; bu uç
   * seed'i çalıştırmadan kurulmuş bir veritabanı için. Tekrar çalıştırmak
   * güvenli — var olan anahtarlara dokunmuyor.
   */
  @Post('roles/seed')
  seedRoles() {
    return this.roles.seed();
  }

  /* ── Katalog ─────────────────────────────────────────────────────────── */

  /** Spotify'da sanatçı arar. ':id' kalıplarından ÖNCE tanımlı. */
  @Get('search')
  search(@Query('q') query?: string) {
    return this.spotify.searchArtists(query ?? '');
  }

  /** Onay bekleyen türler — ':id' kalıbından önce. */
  @Get('genres/pending')
  pendingGenres() {
    return this.curator.pendingGenres();
  }

  /**
   * Arşive yeni sanatçı ekler ve diskografisini senkronize eder.
   *
   * Gövde ham kimlik, `spotify:artist:…` URI'si ya da tarayıcı adresi kabul
   * ediyor — küratörün elinde genelde adres oluyor.
   */
  @Post('acts')
  addAct(@Body() dto: SyncSpotifyDto) {
    return this.sync.syncArtist(extractSpotifyId(dto.spotifyId, 'artist'));
  }

  @Post('acts/:spotifyId/refresh')
  refreshAct(@Param('spotifyId') spotifyId: string) {
    return this.sync.syncArtist(extractSpotifyId(spotifyId, 'artist'));
  }

  /**
   * Act künyesinin küratör alanları — `actKind`, kuruluş yılı, köken, bio,
   * banner.
   *
   * ⚠️ `:id` burada **arşiv kimliği** (cuid), Spotify kimliği DEĞİL. Kardeş
   * uçlar (`refresh`, `enrich`) Spotify kimliği alıyor; ikisi karışırsa hata
   * 404 olarak görünür ve teşhis bir tur uzar. Ayrım servis katmanında da
   * duruyor: `updateAct` `musicalAct.findFirst({ id })` ile bakıyor.
   */
  @Patch('acts/:id')
  updateAct(@Param('id') id: string, @Body() dto: UpdateActDto) {
    return this.curator.updateAct(id, dto);
  }

  /**
   * Act'in türlerini **tümüyle değiştirir** — gönderilen liste son hâl.
   *
   * `PUT` bilinçli: gövde kaynağın yeni tam hâli, kısmi yama değil. Küratör
   * arayüzünde tür seçimi bir çoklu kutu, yani kullanıcının kafasındaki model
   * zaten "şu anda seçili olanlar" (gerekçenin uzunu serviste).
   */
  @Put('acts/:id/genres')
  setActGenres(@Param('id') id: string, @Body() dto: SetActGenresDto) {
    return this.curator.setActGenres(id, dto.genreIds);
  }

  /**
   * MusicBrainz ile zenginleştirme: tür, grup/solo, kuruluş yılı, köken.
   * Spotify bunları vermiyor (11 Ağustos 2026 ölçümü).
   * ⚠️ Yalnızca BOŞ alanları doldurur; küratörün yazdığına dokunmaz.
   * ⚠️ MusicBrainz saniyede bir istek kabul ediyor — üç istek, ~3 sn.
   */
  @Post('acts/:id/enrich')
  enrichAct(@Param('id') id: string) {
    return this.sync.enrichFromMusicBrainz(id);
  }

  @Post('albums/:spotifyId/refresh')
  refreshAlbum(@Param('spotifyId') spotifyId: string) {
    return this.sync.syncAlbum(extractSpotifyId(spotifyId, 'album'));
  }

  /** Herkese açık bir çalma listesini senkronize eder. */
  @Post('playlists')
  addPlaylist(@Body() dto: SyncSpotifyDto) {
    return this.sync.syncPlaylist(extractSpotifyId(dto.spotifyId, 'playlist'));
  }

  /**
   * Kapağı inmemiş kayıtları toplar. Sayfa açılışı bunu yapmıyor (kural 4:
   * dış istek sayfa yolunda yok); cron zaten tur başına topluyor, bu uç
   * sabırsız olan için.
   */
  @Post('artwork/localize')
  localizeArtwork(@Query('limit') limit?: string) {
    const parsed = Number.parseInt(limit ?? '', 10);
    return this.sync.localizeMissingArtwork(
      Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 500) : 60,
    );
  }

  /* ── Tür sözlüğü ─────────────────────────────────────────────────────── */

  /**
   * Bütün türler — küratör panelinin tür kutusu bunu okuyor.
   *
   * `genres/pending`den ayrı duruyor çünkü iki farklı soruya cevap veriyorlar:
   * "onay bekleyen var mı" (bildirim) ve "act'e hangi türü atayabilirim"
   * (seçim kutusu). İkincisi onaylıları da görmek zorunda.
   */
  @Get('genres')
  listGenres() {
    return this.curator.listGenres();
  }

  /**
   * Küratörün eliyle tür oluşturur — **onaylı olarak** (gerekçe serviste).
   *
   * Bu uç olmadan tür sözlüğüne hiçbir şey EKLENEMİYORDU: 11 Ağustos ölçümü
   * Spotify'ın `genres` alanını hiç göndermediğini gösterdi, yani onay
   * kuyruğuna düşen bir şey de oluşmuyor. Oda kurmanın tek yolu burası.
   */
  @Post('genres')
  createGenre(@Body() dto: CreateGenreDto) {
    return this.curator.createGenre(dto);
  }

  /**
   * Türü onaylar, adını/anahtarını düzeltir, oda rengini bağlar.
   *
   * ⚠️ `accentKey` bir **token anahtarı** ("rock", "pop"), renk değeri değil.
   * Hex kabul edilirse kural 16 veritabanı üzerinden delinir ve tema
   * değiştiğinde oda rengi sabit kalır.
   */
  @Patch('genres/:id')
  updateGenre(@Param('id') id: string, @Body() dto: UpdateGenreDto) {
    return this.curator.updateGenre(id, dto);
  }

  /** Türü reddeder (yumuşak: bağları kalkar, kayıt onaysız kalır). */
  @Delete('genres/:id')
  rejectGenre(@Param('id') id: string) {
    return this.curator.updateGenre(id, { isApproved: false });
  }

  /* ── Dinleme kaydı ───────────────────────────────────────────────────── */

  /**
   * Spotify "Extended streaming history" dosyasını içe aktarır.
   *
   * Zip içindeki JSON dosyaları tek tek yüklenir; **tekrar tekrar çalıştırmak
   * güvenli** (`@@unique([userId, playedAt, spotifyTrackUri])` kopyayı
   * engelliyor), yani yanlışlıkla aynı dosyayı iki kez yüklemek zararsız.
   *
   * Dosyayı istemek için: hesap ayarları → Gizlilik → "Extended streaming
   * history" (yalnızca "Account data" DEĞİL; o son bir yılı ve az alan verir).
   */
  @Post('listening/import')
  @UseInterceptors(FileInterceptor('file'))
  importHistory(
    @UploadedFile() file: Express.Multer.File | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!file) {
      throw new BadRequestException('MUSIC.HISTORY_FILE_REQUIRED');
    }
    if (file.size > MAX_HISTORY_BYTES) {
      throw new BadRequestException('MUSIC.HISTORY_TOO_LARGE');
    }
    return this.listening.importHistoryFile(file.buffer, user.id);
  }

  /**
   * İçe aktarılmış dinlemeleri arşivdeki parçalara yeniden bağlar.
   *
   * Geçmiş dosyası genelde katalogdan ÖNCE aktarılıyor, yani o anda eşleşecek
   * parça yok. Yeni sanatçı eklendikçe bu uç boşluğu kapatıyor.
   */
  @Post('listening/backfill')
  backfillListening(@Query('limit') limit?: string) {
    const parsed = Number.parseInt(limit ?? '', 10);
    return this.listening.backfillTrackLinks(
      Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 50_000) : 5_000,
    );
  }
}
