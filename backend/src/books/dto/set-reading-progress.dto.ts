import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

/**
 * "Buradayım" imi: okuma sırasında kaçıncı duraktayım.
 *
 * `0` imi **kaldırır** — o yüzden alt sınır sıfır. Üst sınır servis tarafında
 * listenin uzunluğuna göre ayrıca kırpılıyor; buradaki 999 yalnızca saçma
 * büyüklükteki değerleri kapıda tutuyor.
 */
export class SetReadingProgressDto {
  @Type(() => Number)
  @IsInt({ message: 'VALIDATION.INVALID_READING_PROGRESS' })
  @Min(0, { message: 'VALIDATION.INVALID_READING_PROGRESS' })
  @Max(999, { message: 'VALIDATION.INVALID_READING_PROGRESS' })
  currentOrder!: number;
}
