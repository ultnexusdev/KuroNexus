import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { FootballLiveService } from './football-live.service';
import { SetLineupDto } from './dto/set-lineup.dto';
import { AddClubImageDto } from './dto/club-image.dto';

/**
 * Salon 06 · Futbol · CANLI VERİ — küratör uçları.
 *
 * `@Roles('ADMIN')` SINIF DÜZEYİNDE ve hiçbir metot `@Public()` taşımıyor;
 * genel uçlar ayrı dosyada. Kanadın kuralı: yanlışlıkla açık kalan bir yazma
 * ucu, aynı sınıfa eklenmiş tek bir metot kadar yakın olmasın.
 *
 * Senkron elle tetiklenebiliyor çünkü sezon başında fikstür ve puan tablosu
 * gün içinde değişiyor; ertesi sabahki cron'u beklemek yerine panelden
 * tazelenebilsin.
 */
@Roles('ADMIN')
@Controller('admin/football-live')
export class FootballLiveAdminController {
  constructor(private readonly live: FootballLiveService) {}

  @Get('sync')
  getStatus() {
    return this.live.getSyncStatus();
  }

  @Post('sync')
  startSync() {
    return this.live.startSync();
  }

  /**
   * Küratörün favori 11'i.
   *
   * GET kayıtlı seçimi VE seçilebilecek kadroyu birlikte döndürüyor: panel
   * tek istekte kuruluyor, "önce kadroyu çek sonra 11'i çek" turu yok.
   */
  @Get('lineup')
  getLineup() {
    return this.live.getLineupForCurator();
  }

  @Put('lineup')
  setLineup(@Body() dto: SetLineupDto) {
    return this.live.setLineup(dto);
  }

  /**
   * Küratör görselleri — hero arka planı ve stadyum sahneleri.
   *
   * Yükleme AYRI bir uçta (`/admin/uploads`): dosyanın diske yazılması ve
   * hangi yuvaya bağlandığı iki farklı iş. Buraya yalnızca `/uploads/...`
   * yolu geliyor; dış adres reddediliyor (CSP gerekçesi serviste yazılı).
   */
  @Get('images')
  listImages() {
    return this.live.listClubImages();
  }

  @Post('images')
  addImage(@Body() dto: AddClubImageDto) {
    return this.live.addClubImage(dto);
  }

  @Delete('images/:id')
  removeImage(@Param('id') id: string) {
    return this.live.removeClubImage(id);
  }
}
