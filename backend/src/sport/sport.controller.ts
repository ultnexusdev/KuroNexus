import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SportService } from './sport.service';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateSportPlayerDto } from './dto/create-sport-player.dto';
import { CreateSportLegendDto } from './dto/create-sport-legend.dto';
import { CreateRaceEventDto } from './dto/create-race-event.dto';
import { CreateDriverStandingDto } from './dto/create-driver-standing.dto';
import {
  UpdateDriverStandingDto,
  UpdateRaceEventDto,
  UpdateSportLegendDto,
  UpdateSportPlayerDto,
} from './dto/update-dtos';

// Public: evrenin spor verisi tek pakette
@Controller('sport')
export class SportPublicController {
  constructor(private readonly sport: SportService) {}

  @Public()
  @Get(':universeSlug')
  findBundle(@Param('universeSlug') universeSlug: string) {
    return this.sport.findBundleBySlug(universeSlug);
  }
}

// Admin CRUD — dört veri kümesi
@Roles('ADMIN')
@Controller('admin/sport')
export class SportAdminController {
  constructor(private readonly sport: SportService) {}

  // Players
  @Get('players')
  findPlayers(@Query('universeId') universeId?: string) {
    return this.sport.findPlayers(universeId);
  }
  @Post('players')
  createPlayer(@Body() dto: CreateSportPlayerDto) {
    return this.sport.createPlayer(dto);
  }
  @Patch('players/:id')
  updatePlayer(@Param('id') id: string, @Body() dto: UpdateSportPlayerDto) {
    return this.sport.updatePlayer(id, dto);
  }
  @Delete('players/:id')
  removePlayer(@Param('id') id: string) {
    return this.sport.removePlayer(id);
  }

  // Legends
  @Get('legends')
  findLegends(@Query('universeId') universeId?: string) {
    return this.sport.findLegends(universeId);
  }
  @Post('legends')
  createLegend(@Body() dto: CreateSportLegendDto) {
    return this.sport.createLegend(dto);
  }
  @Patch('legends/:id')
  updateLegend(@Param('id') id: string, @Body() dto: UpdateSportLegendDto) {
    return this.sport.updateLegend(id, dto);
  }
  @Delete('legends/:id')
  removeLegend(@Param('id') id: string) {
    return this.sport.removeLegend(id);
  }

  // Races
  @Get('races')
  findRaces(@Query('universeId') universeId?: string) {
    return this.sport.findRaces(universeId);
  }
  @Post('races')
  createRace(@Body() dto: CreateRaceEventDto) {
    return this.sport.createRace(dto);
  }
  @Patch('races/:id')
  updateRace(@Param('id') id: string, @Body() dto: UpdateRaceEventDto) {
    return this.sport.updateRace(id, dto);
  }
  @Delete('races/:id')
  removeRace(@Param('id') id: string) {
    return this.sport.removeRace(id);
  }

  // Standings
  @Get('standings')
  findStandings(@Query('universeId') universeId?: string) {
    return this.sport.findStandings(universeId);
  }
  @Post('standings')
  createStanding(@Body() dto: CreateDriverStandingDto) {
    return this.sport.createStanding(dto);
  }
  @Patch('standings/:id')
  updateStanding(
    @Param('id') id: string,
    @Body() dto: UpdateDriverStandingDto,
  ) {
    return this.sport.updateStanding(id, dto);
  }
  @Delete('standings/:id')
  removeStanding(@Param('id') id: string) {
    return this.sport.removeStanding(id);
  }
}
