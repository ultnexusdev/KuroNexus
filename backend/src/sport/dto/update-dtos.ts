import { PartialType } from '@nestjs/mapped-types';
import { CreateSportPlayerDto } from './create-sport-player.dto';
import { CreateSportLegendDto } from './create-sport-legend.dto';
import { CreateRaceEventDto } from './create-race-event.dto';
import { CreateDriverStandingDto } from './create-driver-standing.dto';

export class UpdateSportPlayerDto extends PartialType(CreateSportPlayerDto) {}
export class UpdateSportLegendDto extends PartialType(CreateSportLegendDto) {}
export class UpdateRaceEventDto extends PartialType(CreateRaceEventDto) {}
export class UpdateDriverStandingDto extends PartialType(
  CreateDriverStandingDto,
) {}
