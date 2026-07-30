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
 * Bir sezonun ilerlemesi. `delta` günlük kullanım ("+1 bölüm"),
 * `watchedEpisodes` doğrudan atama (ızgaradan işaretleme) içindir; ikisi
 * birden gönderilirse `watchedEpisodes` kazanır.
 */
export class UpdateShowSeasonDto {
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

  /** Tek bir bölümü atlanmış işaretlemek (ya da işareti kaldırmak) için */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'VALIDATION.INVALID_EPISODE' })
  @Min(1, { message: 'VALIDATION.INVALID_EPISODE' })
  markEpisode?: number;

  @IsOptional()
  @IsIn(['SKIPPED', 'CLEAR'], { message: 'VALIDATION.INVALID_MARK_STATE' })
  markState?: 'SKIPPED' | 'CLEAR';
}
