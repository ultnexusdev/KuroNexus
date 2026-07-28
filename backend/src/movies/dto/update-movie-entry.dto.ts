import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateMovieEntryDto } from './create-movie-entry.dto';

// tmdbId değiştirilemez: başka bir film artık başka bir kayıttır.
export class UpdateMovieEntryDto extends PartialType(
  OmitType(CreateMovieEntryDto, ['tmdbId'] as const),
) {}
