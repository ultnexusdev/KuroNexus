import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class DismissSuggestionDto {
  @Type(() => Number)
  @IsInt({ message: 'VALIDATION.INVALID_TMDB_ID' })
  @Min(1, { message: 'VALIDATION.INVALID_TMDB_ID' })
  tmdbId: number;
}
