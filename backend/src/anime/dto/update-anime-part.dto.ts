import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

/**
 * Bir sezonun/filmin ilerlemesi. `delta` günlük kullanım için ("+1 bölüm"),
 * `watchedEpisodes` doğrudan atama için (bölüm ızgarası, Faz B).
 */
export class UpdateAnimePartDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'VALIDATION.INVALID_EPISODE' })
  @Min(-1000, { message: 'VALIDATION.INVALID_EPISODE' })
  @Max(1000, { message: 'VALIDATION.INVALID_EPISODE' })
  delta?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'VALIDATION.INVALID_EPISODE' })
  @Min(0, { message: 'VALIDATION.INVALID_EPISODE' })
  watchedEpisodes?: number;

  @IsOptional()
  @IsBoolean({ message: 'VALIDATION.INVALID_COMPLETED_FLAG' })
  isCompleted?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'VALIDATION.INVALID_RATING' })
  @Min(0, { message: 'VALIDATION.INVALID_RATING' })
  @Max(10, { message: 'VALIDATION.INVALID_RATING' })
  personalRating?: number;

  // Faz B — "bu sezon mangada X. bölümde bitiyor"; elle girilir
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'VALIDATION.INVALID_CHAPTER' })
  @Min(0, { message: 'VALIDATION.INVALID_CHAPTER' })
  mangaChapter?: number;
}
