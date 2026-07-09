import { PartialType } from '@nestjs/mapped-types';
import { CreateUniverseDto } from './create-universe.dto';

export class UpdateUniverseDto extends PartialType(CreateUniverseDto) {}
