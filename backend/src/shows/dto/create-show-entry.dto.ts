import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ValidateIf, ValidateNested } from 'class-validator';
import { ShowStatus } from '../../generated/prisma/client';

/**
 * Elle girilen dış bağlantılar. Boş metin göndermek o bağlantıyı temizler;
 * alan hiç gönderilmezse mevcut değeri korunur (film arşivindeki aynı desen).
 */
export class ShowLinksDto {
  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_URL' })
  @MaxLength(500, { message: 'VALIDATION.URL_TOO_LONG' })
  rt?: string;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_URL' })
  @MaxLength(500, { message: 'VALIDATION.URL_TOO_LONG' })
  imdb?: string;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_URL' })
  @MaxLength(500, { message: 'VALIDATION.URL_TOO_LONG' })
  trailer?: string;
}

export class CreateShowEntryDto {
  @Type(() => Number)
  @IsInt({ message: 'VALIDATION.INVALID_TMDB_ID' })
  @Min(1, { message: 'VALIDATION.INVALID_TMDB_ID' })
  tmdbId: number;

  @IsOptional()
  @IsEnum(ShowStatus, { message: 'VALIDATION.INVALID_SHOW_STATUS' })
  status?: ShowStatus;

  @IsOptional()
  @IsBoolean({ message: 'VALIDATION.INVALID_FAVORITE_FLAG' })
  isFavorite?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'VALIDATION.INVALID_RATING' })
  @Min(0, { message: 'VALIDATION.INVALID_RATING' })
  @Max(10, { message: 'VALIDATION.INVALID_RATING' })
  personalRating?: number;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_NOTE' })
  @MaxLength(500, { message: 'VALIDATION.NOTE_TOO_LONG' })
  personalNote?: string;

  @IsOptional()
  @ValidateIf((_, value) => value !== '')
  @IsISO8601({}, { message: 'VALIDATION.INVALID_DATE' })
  watchedAt?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ShowLinksDto)
  links?: ShowLinksDto;
}
