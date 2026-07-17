import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateTransferNewsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  // Zengin metin (RichTextEditor); serviste sanitize edilir
  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsNotEmpty()
  universeId: string;

  // TM oyuncusu — fotoğraf/mevki/piyasa değeri bu kayıttan okunur
  @IsString()
  @IsOptional()
  tmPlayerId?: string;

  // Kulüpte olmayan oyuncu (transfer hedefi) — TM kadromuzda yok, künye elle
  @IsString()
  @IsOptional()
  manualPlayerName?: string;

  @IsString()
  @IsOptional()
  manualPlayerPhoto?: string;

  @IsString()
  @IsOptional()
  manualPlayerFacts?: string;

  @IsUrl()
  @IsOptional()
  sourceUrl?: string;

  @IsDateString()
  @IsOptional()
  publishedAt?: string;
}
