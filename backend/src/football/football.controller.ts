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

  // Kadro düzeltmeleri — veri seti transferleri geç yansıttığı için elle
  @Get('squad-overrides')
  listSquadOverrides() {
    return this.football.listSquadOverrides();
  }

  @Post('squad-overrides')
  createSquadOverride(
    @Body()
    body: {
      tmPlayerId?: string;
      name?: string;
      position?: string;
      age?: number;
      photo?: string;
    },
  ) {
    return this.football.createSquadOverride(body);
  }

  @Delete('squad-overrides/:id')
  removeSquadOverride(@Param('id') id: string) {
    return this.football.removeSquadOverride(id);
  }

  @Get('sync')
  syncStatus() {
    return this.football.getSyncStatus();
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
