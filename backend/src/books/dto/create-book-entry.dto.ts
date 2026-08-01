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
  ValidateIf,
} from 'class-validator';
import { BookStatus, BookTranslation } from '../../generated/prisma/client';

/**
 * Arşive kitap ekleme.
 *
 * `googleId` zorunlu DEĞİL: Google Books'un bilmediği kitap Open Library
 * anahtarıyla ya da yalnızca adıyla eklenebilmeli (kullanıcı kararı: seri
 * eksik görünmesin). Servis, hangisi geldiyse ondan künyeyi tohumluyor.
 */
export class CreateBookEntryDto {
  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_BOOK_ID' })
  @MaxLength(60, { message: 'VALIDATION.INVALID_BOOK_ID' })
  googleId?: string;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_BOOK_ID' })
  @MaxLength(120, { message: 'VALIDATION.INVALID_BOOK_ID' })
  olKey?: string;

  /**
   * 1000Kitap kitap sayfasının anahtarı ("bulbulu-oldurmek--939"). Geldiğinde
   * künye önce buradan tohumlanıyor: Türkçe ad, çevirmen, yayınevi ve gerçek
   * kapak en eksiksiz burada.
   */
  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_BOOK_ID' })
  @MaxLength(160, { message: 'VALIDATION.INVALID_BOOK_ID' })
  binKitapSlug?: string;

  // Kaynağı olmayan kayıt için tek zorunlu bilgi; kaynak varsa oradan gelen
  // adı ezer (küratör Türkçe adı elle yazmak isteyebilir)
  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_TITLE' })
  @MaxLength(300, { message: 'VALIDATION.TITLE_TOO_LONG' })
  title?: string;

  /**
   * Seçilen kaydın yazarı. Künyeye **yazılmıyor** — yalnızca doğru kitabı
   * bulmak için.
   *
   * Gerekliliği bir hatayla anlaşıldı: Open Library'den seçilen *Miras*
   * (R. A. Salvatore) eklenirken kimlik dalı olmadığı için yalnızca adla
   * arama yapılıyor, "Miras" sorgusu bambaşka bir kitabı döndürüyor ve onun
   * künyesi yazılıyordu. Yazar hem sorguyu daraltıyor hem de sonucun
   * doğrulanmasını mümkün kılıyor (bkz. `BooksService.seed`).
   */
  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_AUTHOR' })
  @MaxLength(300, { message: 'VALIDATION.INVALID_AUTHOR' })
  author?: string;

  @IsOptional()
  @IsEnum(BookStatus, { message: 'VALIDATION.INVALID_BOOK_STATUS' })
  status?: BookStatus;

  @IsOptional()
  @IsEnum(BookTranslation, { message: 'VALIDATION.INVALID_TRANSLATION_STATE' })
  translationState?: BookTranslation;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_SERIES' })
  @MaxLength(200, { message: 'VALIDATION.SERIES_TOO_LONG' })
  seriesName?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'VALIDATION.INVALID_SERIES_INDEX' })
  @Min(0, { message: 'VALIDATION.INVALID_SERIES_INDEX' })
  @Max(999, { message: 'VALIDATION.INVALID_SERIES_INDEX' })
  seriesIndex?: number;

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
  @MaxLength(1000, { message: 'VALIDATION.NOTE_TOO_LONG' })
  personalNote?: string;

  // Boş metin "tarihi temizle" demek; `@IsOptional` yalnızca null/undefined'ı
  // atlıyor, o yüzden boş metin ayrıca muaf tutuluyor (film kanadıyla aynı)
  @IsOptional()
  @ValidateIf((_, value) => value !== '')
  @IsISO8601({}, { message: 'VALIDATION.INVALID_DATE' })
  startedAt?: string;

  @IsOptional()
  @ValidateIf((_, value) => value !== '')
  @IsISO8601({}, { message: 'VALIDATION.INVALID_DATE' })
  finishedAt?: string;
}
