import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateShowEntryDto } from './create-show-entry.dto';

// tmdbId değiştirilemez: başka bir dizi artık başka bir kayıttır.
export class UpdateShowEntryDto extends PartialType(
  OmitType(CreateShowEntryDto, ['tmdbId'] as const),
) {}
