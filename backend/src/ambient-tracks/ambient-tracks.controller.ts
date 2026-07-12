import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AmbientTracksService } from './ambient-tracks.service';
import { CreateAmbientTrackDto } from './dto/create-ambient-track.dto';
import { UpdateAmbientTrackDto } from './dto/update-ambient-track.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('ambient-tracks')
export class AmbientTracksController {
  constructor(private readonly ambientTracksService: AmbientTracksService) {}

  @Roles('ADMIN')
  @Post()
  create(@Body() createAmbientTrackDto: CreateAmbientTrackDto) {
    return this.ambientTracksService.create(createAmbientTrackDto);
  }

  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.ambientTracksService.findAll();
  }

  // Parametrik ':id' route'undan ÖNCE tanımlanmalı; aksi halde 'playlists' id sanılır
  @Public()
  @Get('playlists')
  findPlaylists() {
    return this.ambientTracksService.findPlaylists();
  }

  @Public()
  @Get('universe/:slug')
  findAllByUniverse(@Param('slug') slug: string) {
    return this.ambientTracksService.findAllByUniverse(slug);
  }

  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ambientTracksService.findOne(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAmbientTrackDto: UpdateAmbientTrackDto,
  ) {
    return this.ambientTracksService.update(id, updateAmbientTrackDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ambientTracksService.remove(id);
  }
}
