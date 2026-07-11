import { PartialType } from '@nestjs/mapped-types';
import { CreateWikiEntryDto } from './create-wiki-entry.dto';

export class UpdateWikiEntryDto extends PartialType(CreateWikiEntryDto) {}
