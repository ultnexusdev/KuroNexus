import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateStoryDto {
  @IsString({ message: 'VALIDATION.INVALID_TITLE' })
  @MinLength(1, { message: 'VALIDATION.TITLE_REQUIRED' })
  @MaxLength(200, { message: 'VALIDATION.TITLE_TOO_LONG' })
  title: string;

  @IsString({ message: 'VALIDATION.INVALID_CONTENT' })
  @MinLength(1, { message: 'VALIDATION.CONTENT_REQUIRED' })
  content: string;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_EXCERPT' })
  @MaxLength(500, { message: 'VALIDATION.EXCERPT_TOO_LONG' })
  excerpt?: string;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_COVER_IMAGE' })
  @MaxLength(500, { message: 'VALIDATION.COVER_IMAGE_TOO_LONG' })
  coverImage?: string;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_UNIVERSE_ID' })
  universeId?: string;

  @IsOptional()
  @IsBoolean({ message: 'VALIDATION.INVALID_PUBLISH_FLAG' })
  isPublished?: boolean;
}
