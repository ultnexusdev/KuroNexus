import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

/**
 * Okuma ucunun sorgu sözleşmesi.
 *
 * Ayrı bir DTO, çünkü global `ValidationPipe` `forbidNonWhitelisted: true`
 * ile kurulu: sınıfta tanımlı olmayan her sorgu alanı 400 üretiyor. Yazma
 * DTO'sunu burada yeniden kullanmak, okuma ucuna `url`/`opacity` gibi
 * alanların sızmasına izin vermek olurdu.
 */
export class ReadCuratedImagesDto {
  /** "anime/bleach" — sayfa başına tek ad */
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  @Matches(/^[a-z0-9][a-z0-9/-]*$/, {
    message: 'CURATED_IMAGE.SURFACE_FORMAT',
  })
  surface!: string;
}
