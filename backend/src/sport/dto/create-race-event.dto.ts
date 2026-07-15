import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRaceEventDto {
  @IsInt()
  round: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  circuit: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsDateString()
  @IsOptional()
  raceDate?: string;

  @IsString()
  @IsOptional()
  trackSvgPath?: string;

  @IsString()
  @IsNotEmpty()
  universeId: string;
}
