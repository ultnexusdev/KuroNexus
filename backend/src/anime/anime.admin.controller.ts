import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user';
import { AnimeService } from './anime.service';
import { CreateAnimeEntryDto } from './dto/create-anime-entry.dto';
import { UpdateAnimeEntryDto } from './dto/update-anime-entry.dto';
import { UpdateAnimePartDto } from './dto/update-anime-part.dto';

@Roles('ADMIN')
@Controller('admin/anime')
export class AnimeAdminController {
  constructor(private readonly animeService: AnimeService) {}

  @Get()
  findAll() {
    return this.animeService.findAllForAdmin();
  }

  // ':id' rotalarından ÖNCE tanımlı olmalı
  @Get('search')
  search(@Query('q') query?: string) {
    return this.animeService.search(query ?? '');
  }

  @Post()
  create(
    @Body() dto: CreateAnimeEntryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.animeService.create(dto, user.id);
  }

  // Sezon ilerlemesi ("+1 bölüm"); ':id' rotalarından önce
  @Patch('parts/:partId')
  updatePart(@Param('partId') partId: string, @Body() dto: UpdateAnimePartDto) {
    return this.animeService.updatePart(partId, dto);
  }

  // "Buraya kadar hepsini izledim" — bu parça ve öncekiler tamamlanır
  @Patch('parts/:partId/complete-through')
  completeThrough(@Param('partId') partId: string) {
    return this.animeService.completeThrough(partId);
  }

  @Patch(':id/refresh')
  refresh(@Param('id') id: string) {
    return this.animeService.refresh(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAnimeEntryDto) {
    return this.animeService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.animeService.softDelete(id);
  }
}
