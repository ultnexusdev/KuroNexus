import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { AnimeWatchStatus } from '../../generated/prisma/client';

/**
 * Elle girilen dış bağlantılar. Boş metin göndermek o bağlantıyı temizler;
 * alan hiç gönderilmezse mevcut değeri korunur.
 */
export class AnimeLinksDto {
  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_URL' })
  @MaxLength(500, { message: 'VALIDATION.URL_TOO_LONG' })
  manga?: string;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_URL' })
  @MaxLength(500, { message: 'VALIDATION.URL_TOO_LONG' })
  trailer?: string;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_URL' })
  @MaxLength(500, { message: 'VALIDATION.URL_TOO_LONG' })
  opening?: string;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_URL' })
  @MaxLength(500, { message: 'VALIDATION.URL_TOO_LONG' })
  ending?: string;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_URL' })
  @MaxLength(500, { message: 'VALIDATION.URL_TOO_LONG' })
  official?: string;
}

export class UpdateAnimeEntryDto {
  @IsOptional()
  @IsEnum(AnimeWatchStatus, { message: 'VALIDATION.INVALID_ANIME_STATUS' })
  status?: AnimeWatchStatus;

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

  /** Sabit banner: tam adres ya da `/uploads/...`. Boş metin AniList'e döner. */
  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_URL' })
  @MaxLength(500, { message: 'VALIDATION.URL_TOO_LONG' })
  bannerImage?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AnimeLinksDto)
  links?: AnimeLinksDto;
}
