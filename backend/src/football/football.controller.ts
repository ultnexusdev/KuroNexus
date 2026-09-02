import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { FootballService } from './football.service';
import { CreateSquadOverrideDto } from './dto/create-squad-override.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';

// Public uçlar: veriler yerel Transfermarkt tablolarından okunur
@Controller('football')
export class FootballController {
  constructor(private readonly football: FootballService) {}

  @Public()
  @Get('squad')
  getSquad() {
    return this.football.getSquad();
  }

  /*
   * GET /player/:id 2026-09-02'de KALDIRILDI (F-4, kullanıcı kararı): tek
   * tüketicisi `/spor/futbol/oyuncu/[id]` sayfasıydı, o da emekli edildi.
   * TmPlayer tablosu duruyor — kadro ve transfer haberleri ondan okuyor.
   *
   * GET /standings ve GET /next-match 2026-08-22'de KALDIRILDI (kullanıcı
   * onayı): kulüp sayfası puan tablosunu ve sonraki maçı artık tek istekte
   * football-live'dan alıyor ve iki ucun frontend'de tek bir tüketicisi
   * kalmamıştı. Apify lig senkronu cache'i hâlâ YAZIYOR (admin tetikli hat,
   * getLeagueSyncStatus onunla yaşıyor) — o hattın komple emekliliği ayrı
   * bir karar.
   */
}

// Transfermarkt veri seti senkronizasyonu — yalnızca admin tetikler
@Roles('ADMIN')
@Controller('admin/football')
export class FootballAdminController {
  constructor(private readonly football: FootballService) {}

  @Post('sync')
  startSync() {
    return this.football.startSquadSync();
  }

  // Kadro düzeltmeleri — veri seti transferleri geç yansıttığı için elle
  @Get('squad-overrides')
  listSquadOverrides() {
    return this.football.listSquadOverrides();
  }

  @Post('squad-overrides')
  createSquadOverride(@Body() dto: CreateSquadOverrideDto) {
    return this.football.createSquadOverride(dto);
  }

  @Delete('squad-overrides/:id')
  removeSquadOverride(@Param('id') id: string) {
    return this.football.removeSquadOverride(id);
  }

  @Get('sync')
  syncStatus() {
    return this.football.getSyncStatus();
  }

  // Forma numaraları — sezonda bir kez. Haftalık cron'a bağlı DEĞİL, gerekçesi
  // `SHIRT_NUMBERS_KEY` başlığında yazılı (~200 MB'lık dosya, yılda bir değişen veri).
  @Post('shirt-numbers')
  startShirtNumberSync() {
    return this.football.startShirtNumberSync();
  }

  @Get('shirt-numbers')
  shirtNumberStatus() {
    return this.football.getShirtNumberStatus();
  }

  // Süper Lig puan tablosu + sonraki maç (Apify)
  // ?season= ile sezon geçici olarak zorlanabilir (teşhis/ilk kurulum)
  @Post('sync-league')
  startLeagueSync(@Query('season') season?: string) {
    const s = season ? Number(season) : undefined;
    return this.football.startLeagueSync(Number.isNaN(s) ? undefined : s);
  }

  @Get('sync-league')
  leagueSyncStatus() {
    return this.football.getLeagueSyncStatus();
  }
}
