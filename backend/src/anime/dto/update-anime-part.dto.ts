import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
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

  // "Bu sezon mangada X. bölümde bitiyor"; hiçbir API vermiyor, elle girilir
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'VALIDATION.INVALID_CHAPTER' })
  @Min(0, { message: 'VALIDATION.INVALID_CHAPTER' })
  mangaChapter?: number;

  // Tek bir bölümü işaretlemek/işareti kaldırmak (bölüm ızgarası)
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'VALIDATION.INVALID_EPISODE' })
  @Min(1, { message: 'VALIDATION.INVALID_EPISODE' })
  markEpisode?: number;

  @IsOptional()
  @IsIn(['SKIPPED', 'NONE'], { message: 'VALIDATION.INVALID_EPISODE_MARK' })
  markState?: 'SKIPPED' | 'NONE';

  /** Filler bölümlerin hepsini "geçildi" say — kanon ilerlemesi bozulmasın. */
  @IsOptional()
  @IsBoolean({ message: 'VALIDATION.INVALID_SKIP_FLAG' })
  skipFillers?: boolean;
}
