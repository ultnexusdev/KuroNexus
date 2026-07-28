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
import { MovieStatus } from '../../generated/prisma/client';

export class CreateMovieEntryDto {
  @Type(() => Number)
  @IsInt({ message: 'VALIDATION.INVALID_TMDB_ID' })
  @Min(1, { message: 'VALIDATION.INVALID_TMDB_ID' })
  tmdbId: number;

  @IsOptional()
  @IsEnum(MovieStatus, { message: 'VALIDATION.INVALID_MOVIE_STATUS' })
  status?: MovieStatus;

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
  @IsISO8601({}, { message: 'VALIDATION.INVALID_DATE' })
  watchedAt?: string;
}
