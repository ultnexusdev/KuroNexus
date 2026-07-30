import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

/** Yıllık okuma hedefi. Yıl verilmezse içinde bulunulan yıl kullanılır. */
export class UpsertReadingGoalDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'VALIDATION.INVALID_YEAR' })
  @Min(2000, { message: 'VALIDATION.INVALID_YEAR' })
  @Max(2200, { message: 'VALIDATION.INVALID_YEAR' })
  year?: number;

  @Type(() => Number)
  @IsInt({ message: 'VALIDATION.INVALID_GOAL' })
  @Min(1, { message: 'VALIDATION.INVALID_GOAL' })
  @Max(1000, { message: 'VALIDATION.INVALID_GOAL' })
  targetBooks: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'VALIDATION.INVALID_GOAL' })
  @Min(1, { message: 'VALIDATION.INVALID_GOAL' })
  @Max(1000000, { message: 'VALIDATION.INVALID_GOAL' })
  targetPages?: number;
}
