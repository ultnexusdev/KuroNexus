import { Controller, Get, Post } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { FootballLiveService } from './football-live.service';

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
}
