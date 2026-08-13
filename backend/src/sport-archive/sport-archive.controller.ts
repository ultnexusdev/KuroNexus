import { Controller, Get, Param } from '@nestjs/common';
import { SportArchiveService } from './sport-archive.service';
import { Public } from '../common/decorators/public.decorator';

/**
 * Salon 06 · Spor Arşivi — genel uçlar.
 *
 * Altı uç, altı sayfa. Bire bir eşleşme kasıtlı: bir sayfanın ihtiyacı olan
 * her şey tek istekte geliyor, ön yüz parça birleştirmiyor. Mevcut
 * `SportPublicController` (`/sport/:universeSlug`) dokunulmadan duruyor —
 * GsHall/F1Hall hâlâ onunla çalışıyor.
 *
 * Yazma uçları (admin CRUD) BİLİNÇLE YOK: şemadaki künye modelleri Faz 1'de
 * hiçbir sayfa beslemiyor, panelde form açmak altı ay sonra "bunlar ne"
 * sorusunu üretirdi. Admin formları anlatı modelleriyle sınırlı olarak ayrı
 * bir turda gelecek.
 */
@Public()
@Controller('sport-archive')
export class SportArchiveController {
  constructor(private readonly archive: SportArchiveService) {}

  /** `/spor` — iki dünyanın doluluk sayımı */
  @Get('overview')
  getOverview() {
    return this.archive.getOverview();
  }

  /** `/spor/futbol` — hub */
  @Get('football')
  getFootballHub() {
    return this.archive.getFootballHub();
  }

  /** `/spor/futbol/[clubSlug]` — kulüp dünyası */
  @Get('football/clubs/:slug')
  getClub(@Param('slug') slug: string) {
    return this.archive.getClub(slug);
  }

  /** `/spor/futbol/efsaneler/[slug]` — efsane */
  @Get('football/legends/:slug')
  getLegend(@Param('slug') slug: string) {
    return this.archive.getLegend(slug);
  }

  /** `/spor/formula-1` — hub */
  @Get('f1')
  getF1Hub() {
    return this.archive.getF1Hub();
  }

  /** `/spor/formula-1/pistler/[slug]` — pist */
  @Get('f1/circuits/:slug')
  getCircuit(@Param('slug') slug: string) {
    return this.archive.getCircuit(slug);
  }

  /** `/spor/formula-1/surucular/[slug]` — sürücü (futbol efsanesinin karşılığı) */
  @Get('f1/drivers/:slug')
  getDriver(@Param('slug') slug: string) {
    return this.archive.getDriver(slug);
  }
}
