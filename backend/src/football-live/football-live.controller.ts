import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { FootballLiveService } from './football-live.service';

/**
 * Salon 06 · Futbol · CANLI VERİ — genel uçlar.
 *
 * İki uç, iki farklı yaşam süresi:
 *
 * `club/:slug` — sayfanın tamamı, tek istek. Günde bir tazeleniyor.
 * `live`       — yalnızca canlı skor. Maç saatinde ön yüz bunu yokluyor;
 *                sayfanın tamamını yeniden çekmesin diye ayrı ve küçük.
 *
 * İkisi de YALNIZCA ExternalCache'ten okuyor — dış kaynağa çıkan tek yer
 * cron (kural 4/14). Bir ziyaretçi dalgası TFF'ye yansımıyor.
 */
@Public()
@Controller('football-live')
export class FootballLiveController {
  constructor(private readonly live: FootballLiveService) {}

  @Get('club/:slug')
  getClub(@Param('slug') slug: string) {
    return this.live.getClubOverview(slug);
  }

  @Get('live')
  getLive() {
    return this.live.getLive();
  }
}
