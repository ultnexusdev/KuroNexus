import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { AnimeWatchStatus } from '../../generated/prisma/client';

export class CreateAnimeEntryDto {
  @Type(() => Number)
  @IsInt({ message: 'VALIDATION.INVALID_ANILIST_ID' })
  @Min(1, { message: 'VALIDATION.INVALID_ANILIST_ID' })
  anilistId: number;

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
}
