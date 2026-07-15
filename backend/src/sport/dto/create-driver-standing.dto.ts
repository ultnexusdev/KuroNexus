import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateDriverStandingDto {
  @IsInt()
  @Min(1)
  position: number;

  @IsString()
  @IsNotEmpty()
  driver: string;

  @IsString()
  @IsOptional()
  team?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  points?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  wins?: number;

  @IsString()
  @IsOptional()
  teamColor?: string;

  @IsString()
  @IsNotEmpty()
  universeId: string;
}
