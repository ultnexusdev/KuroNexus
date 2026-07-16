import { Controller, Get, Param, Post } from '@nestjs/common';
import { FootballService } from './football.service';
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

  @Public()
  @Get('player/:id')
  getPlayer(@Param('id') id: string) {
    return this.football.getPlayer(id);
  }

  @Public()
  @Get('standings')
  getStandings() {
    return this.football.getStandings();
  }

  @Public()
  @Get('next-match')
  getNextMatch() {
    return this.football.getNextMatch();
  }
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

  @Get('sync')
  syncStatus() {
    return this.football.getSyncStatus();
  }

  // Süper Lig puan tablosu + sonraki maç (Apify)
  @Post('sync-league')
  startLeagueSync() {
    return this.football.startLeagueSync();
  }

  @Get('sync-league')
  leagueSyncStatus() {
    return this.football.getLeagueSyncStatus();
  }
}
