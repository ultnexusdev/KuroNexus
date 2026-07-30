import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
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
  ValidateNested,
} from 'class-validator';
import { BookStatus, BookTranslation } from '../../generated/prisma/client';

/**
 * Elle girilen dış adresler. Boş metin göndermek o bağlantıyı temizler;
 * alan hiç gönderilmezse mevcut değeri korunur (film kanadıyla aynı sözleşme).
 */
export class BookLinksDto {
  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_URL' })
  @MaxLength(500, { message: 'VALIDATION.URL_TOO_LONG' })
  goodreads?: string;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_URL' })
  @MaxLength(500, { message: 'VALIDATION.URL_TOO_LONG' })
  dr?: string;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_URL' })
  @MaxLength(500, { message: 'VALIDATION.URL_TOO_LONG' })
  idefix?: string;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_URL' })
  @MaxLength(500, { message: 'VALIDATION.URL_TOO_LONG' })
  official?: string;
}

/**
 * Künye düzeltme + okuma durumu. Kitap kanadında künye alanları da
 * güncellenebilir (film/dizide güncellenemez): kullanıcı kararı gereği
 * gösterilen künyenin sahibi arşiv, dış kaynak değil.
 */
export class UpdateBookEntryDto {
  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_TITLE' })
  @MaxLength(300, { message: 'VALIDATION.TITLE_TOO_LONG' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_TITLE' })
  @MaxLength(300, { message: 'VALIDATION.TITLE_TOO_LONG' })
  originalTitle?: string;

  @IsOptional()
  @IsArray({ message: 'VALIDATION.INVALID_AUTHORS' })
  @ArrayMaxSize(10, { message: 'VALIDATION.INVALID_AUTHORS' })
  @IsString({ each: true, message: 'VALIDATION.INVALID_AUTHORS' })
  authors?: string[];

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_TRANSLATOR' })
  @MaxLength(200, { message: 'VALIDATION.TRANSLATOR_TOO_LONG' })
  translator?: string;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_PUBLISHER' })
  @MaxLength(200, { message: 'VALIDATION.PUBLISHER_TOO_LONG' })
  publisher?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'VALIDATION.INVALID_YEAR' })
  @Min(-3000, { message: 'VALIDATION.INVALID_YEAR' })
  @Max(2200, { message: 'VALIDATION.INVALID_YEAR' })
  publishedYear?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'VALIDATION.INVALID_YEAR' })
  @Min(-3000, { message: 'VALIDATION.INVALID_YEAR' })
  @Max(2200, { message: 'VALIDATION.INVALID_YEAR' })
  firstPublishedYear?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'VALIDATION.INVALID_PAGE_COUNT' })
  @Min(1, { message: 'VALIDATION.INVALID_PAGE_COUNT' })
  @Max(20000, { message: 'VALIDATION.INVALID_PAGE_COUNT' })
  pageCount?: number;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_LANGUAGE' })
  @MaxLength(10, { message: 'VALIDATION.INVALID_LANGUAGE' })
  language?: string;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_URL' })
  @MaxLength(500, { message: 'VALIDATION.URL_TOO_LONG' })
  coverImage?: string;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_NOTE' })
  @MaxLength(5000, { message: 'VALIDATION.NOTE_TOO_LONG' })
  description?: string;

  @IsOptional()
  @IsArray({ message: 'VALIDATION.INVALID_GENRES' })
  @ArrayMaxSize(20, { message: 'VALIDATION.INVALID_GENRES' })
  @IsString({ each: true, message: 'VALIDATION.INVALID_GENRES' })
  genres?: string[];

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
  @IsEnum(BookStatus, { message: 'VALIDATION.INVALID_BOOK_STATUS' })
  status?: BookStatus;

  @IsOptional()
  @IsEnum(BookTranslation, { message: 'VALIDATION.INVALID_TRANSLATION_STATE' })
  translationState?: BookTranslation;

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

  // Okuma ilerlemesi; üst sınır servis tarafında sayfa sayısına kırpılıyor
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'VALIDATION.INVALID_PAGE_COUNT' })
  @Min(0, { message: 'VALIDATION.INVALID_PAGE_COUNT' })
  currentPage?: number;

  @IsOptional()
  @ValidateIf((_, value) => value !== '')
  @IsISO8601({}, { message: 'VALIDATION.INVALID_DATE' })
  startedAt?: string;

  @IsOptional()
  @ValidateIf((_, value) => value !== '')
  @IsISO8601({}, { message: 'VALIDATION.INVALID_DATE' })
  finishedAt?: string;

  // Kadim Dünyalar bağı; boş metin bağı koparır
  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_UNIVERSE' })
  @MaxLength(40, { message: 'VALIDATION.INVALID_UNIVERSE' })
  universeId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => BookLinksDto)
  links?: BookLinksDto;
}
