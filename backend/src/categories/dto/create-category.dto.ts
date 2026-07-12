import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'VALIDATION.INVALID_NAME' })
  @MinLength(1, { message: 'VALIDATION.NAME_REQUIRED' })
  @MaxLength(200, { message: 'VALIDATION.NAME_TOO_LONG' })
  name: string;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_DESCRIPTION' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'VALIDATION.INVALID_COVER_IMAGE' })
  @MaxLength(500, { message: 'VALIDATION.COVER_IMAGE_TOO_LONG' })
  coverImage?: string;
}
