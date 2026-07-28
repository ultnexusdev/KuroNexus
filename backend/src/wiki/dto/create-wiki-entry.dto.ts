import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { WikiCategory } from '../../generated/prisma/client';

export class CreateWikiEntryDto {
  @IsString({ message: 'VALIDATION.INVALID_TITLE' })
  @MinLength(1, { message: 'VALIDATION.TITLE_REQUIRED' })
  @MaxLength(200, { message: 'VALIDATION.TITLE_TOO_LONG' })
  title: string;

  @IsString({ message: 'VALIDATION.INVALID_CONTENT' })
  @MinLength(1, { message: 'VALIDATION.CONTENT_REQUIRED' })
  content: string;

  @IsEnum(WikiCategory, { message: 'VALIDATION.INVALID_CATEGORY' })
  category: WikiCategory;

  @IsString({ message: 'VALIDATION.INVALID_UNIVERSE_ID' })
  universeId: string;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_COVER_IMAGE' })
  @MaxLength(500, { message: 'VALIDATION.COVER_IMAGE_TOO_LONG' })
  coverImage?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'VALIDATION.INVALID_SPOILER_TIER' })
  @Min(0, { message: 'VALIDATION.INVALID_SPOILER_TIER' })
  spoilerTier?: number;

  // El yazmasında geçen takma adlar ("Kağan" → "Temür Kağan")
  @IsOptional()
  @IsArray({ message: 'VALIDATION.INVALID_ALIASES' })
  @ArrayMaxSize(20, { message: 'VALIDATION.INVALID_ALIASES' })
  @IsString({ each: true, message: 'VALIDATION.INVALID_ALIASES' })
  @MaxLength(100, { each: true, message: 'VALIDATION.INVALID_ALIASES' })
  aliases?: string[];
}
