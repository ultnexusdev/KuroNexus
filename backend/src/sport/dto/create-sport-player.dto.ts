import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateSportPlayerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsOptional()
  shirtNumber?: number;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsString()
  @IsOptional()
  nationality?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  appearances?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  goals?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  assists?: number;

  @IsString()
  @IsOptional()
  note?: string;

  @IsInt()
  @IsOptional()
  order?: number;

  @IsString()
  @IsNotEmpty()
  universeId: string;
}
