import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSportLegendDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  era?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  story: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  achievements?: string;

  @IsInt()
  @IsOptional()
  order?: number;

  @IsString()
  @IsNotEmpty()
  universeId: string;
}
