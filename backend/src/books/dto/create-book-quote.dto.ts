import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

/** Altını çizdiğim satır. Sayfa ve bağlam isteğe bağlı — alıntının kendisi değil. */
export class CreateBookQuoteDto {
  @IsString({ message: 'VALIDATION.INVALID_QUOTE' })
  @MinLength(2, { message: 'VALIDATION.INVALID_QUOTE' })
  @MaxLength(2000, { message: 'VALIDATION.QUOTE_TOO_LONG' })
  text: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'VALIDATION.INVALID_PAGE_COUNT' })
  @Min(1, { message: 'VALIDATION.INVALID_PAGE_COUNT' })
  @Max(20000, { message: 'VALIDATION.INVALID_PAGE_COUNT' })
  page?: number;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_NOTE' })
  @MaxLength(300, { message: 'VALIDATION.NOTE_TOO_LONG' })
  context?: string;

  @IsOptional()
  @IsBoolean({ message: 'VALIDATION.INVALID_FAVORITE_FLAG' })
  isFavorite?: boolean;
}
