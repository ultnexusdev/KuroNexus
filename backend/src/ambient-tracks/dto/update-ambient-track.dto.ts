import { PartialType } from '@nestjs/mapped-types';
import { CreateAmbientTrackDto } from './create-ambient-track.dto';

export class UpdateAmbientTrackDto extends PartialType(CreateAmbientTrackDto) {}
