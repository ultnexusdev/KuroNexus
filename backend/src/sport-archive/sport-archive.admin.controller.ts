import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { SportArchiveCuratorService } from './sport-archive-curator.service';
import {
  CreateSportMomentDto,
  FeatureF1DriverDto,
  SetFavouritePlayerImageDto,
  SetSportCoverFocusDto,
  SetSportImageDto,
  UpdateSportMomentDto,
} from './dto/curator.dto';

/**
 * Salon 06 · Spor Arşivi — küratör uçları.
 *
 * `@Roles('ADMIN')` SINIF DÜZEYİNDE ve hiçbir metot `@Public()` taşımıyor —
 * müzik kanadının deseninin aynısı. Herkese açık uçlar ayrı dosyada
 * (`sport-archive.controller.ts`) ve orası `@Public()`; iki dosyayı ayırmanın
 * asıl sebebi de bu: yanlışlıkla açık kalan bir yazma ucu, aynı sınıfa
 * eklenmiş tek bir metot kadar yakın olmasın.
 *
 * ── FAZ 1 KARARININ GERİ ALINMASI ────────────────────────────────────────
 * İlk turda "yazma uçları bilinçle yok" yazılmıştı ve gerekçesi doğruydu:
 * şemadaki künye modellerini hiçbir sayfa beslemiyordu, panelde form açmak
 * altı ay sonra "bunlar ne" sorusu üretirdi. O gerekçe artık geçerli değil —
 * zaman şeridi sayfada ve küratör ona kayıt ekleyebilmeli. Uçlar hâlâ
 * ANLATI modelleriyle sınırlı: künye tabloları (maç, sezon, kadro) yazılabilir
 * değil.
 */
@Roles('ADMIN')
@Controller('admin/sport-archive')
export class SportArchiveAdminController {
  constructor(private readonly curator: SportArchiveCuratorService) {}

  /** Panelin açılır listeleri — kulüpler + dönemler, pistler, efsaneler, adaylar */
  @Get('context')
  getContext() {
    return this.curator.context();
  }

  /** Zaman şeridine yeni kayıt */
  @Post('moments')
  createMoment(@Body() dto: CreateSportMomentDto) {
    return this.curator.createMoment(dto);
  }

  @Patch('moments/:world/:id')
  updateMoment(
    @Param('world') world: 'football' | 'f1',
    @Param('id') id: string,
    @Body() dto: UpdateSportMomentDto,
  ) {
    return this.curator.updateMoment(
      world === 'f1' ? 'f1' : 'football',
      id,
      dto,
    );
  }

  /** Yumuşak silme — satır duruyor, `isDeleted` işaretleniyor */
  @Delete('moments/:world/:id')
  deleteMoment(
    @Param('world') world: 'football' | 'f1',
    @Param('id') id: string,
  ) {
    return this.curator.deleteMoment(world === 'f1' ? 'f1' : 'football', id);
  }

  /** Görseli kayda bağla (boş `url` = kaldır) */
  @Patch('image')
  setImage(@Body() dto: SetSportImageDto) {
    return this.curator.setImage(dto);
  }

  /**
   * Favori futbolcu sayfasının bir görsel yuvasını bağla (boş `url` = kaldır).
   *
   * `image` ucundan AYRI çünkü adresleme farklı: orası bir veritabanı kaydına
   * (`target` + `ref`) bağlanıyor, burası depodaki defterin slug'ı + sayfadaki
   * yuva adına. İkisini tek uca sıkıştırmak `target` listesine hiçbir tabloya
   * karşılık gelmeyen bir değer eklemek olurdu.
   */
  @Patch('player-image')
  setPlayerImage(@Body() dto: SetFavouritePlayerImageDto) {
    return this.curator.setPlayerImage(dto);
  }

  /**
   * Kapağın odak noktası + büyütmesi. Görselden AYRI uç — gerekçesi
   * `SportArchiveCuratorService.setCoverFocus` başlığında.
   */
  @Patch('cover-focus')
  setCoverFocus(@Body() dto: SetSportCoverFocusDto) {
    return this.curator.setCoverFocus(dto);
  }

  /** F1 sürücüsünü panteona al / çıkar */
  @Patch('drivers/:slug')
  featureDriver(@Param('slug') slug: string, @Body() dto: FeatureF1DriverDto) {
    return this.curator.featureDriver(slug, dto);
  }
}
