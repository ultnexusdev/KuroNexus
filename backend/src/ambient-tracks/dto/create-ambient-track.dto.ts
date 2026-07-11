import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAmbientTrackDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  audioUrl: string;

  @IsString()
  @IsNotEmpty()
  universeId: string;

  @IsNumber()
  @IsOptional()
  order?: number;
}
