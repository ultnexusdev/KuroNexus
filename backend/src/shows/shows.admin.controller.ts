import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user';
import { ShowsService } from './shows.service';
import { CreateShowEntryDto } from './dto/create-show-entry.dto';
import { UpdateShowEntryDto } from './dto/update-show-entry.dto';
import { UpdateShowSeasonDto } from './dto/update-show-season.dto';
import { DismissSuggestionDto } from './dto/dismiss-suggestion.dto';

@Roles('ADMIN')
@Controller('admin/shows')
export class ShowsAdminController {
  constructor(private readonly showsService: ShowsService) {}

  @Get()
  findAll() {
    return this.showsService.findAllForAdmin();
  }

  // ':id' rotalarından ÖNCE tanımlı olmalı
  @Get('search')
  search(@Query('q') query?: string) {
    return this.showsService.search(query ?? '');
  }

  @Get('suggestions')
  suggestions(@CurrentUser() user: AuthenticatedUser) {
    return this.showsService.suggestions(user.id);
  }

  @Post('suggestions/dismiss')
  dismissSuggestion(
    @Body() dto: DismissSuggestionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.showsService.dismissSuggestion(dto.tmdbId, user.id);
  }

  @Delete('suggestions/dismiss/:tmdbId')
  restoreSuggestion(
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.showsService.restoreSuggestion(tmdbId, user.id);
  }

  @Post()
  create(
    @Body() dto: CreateShowEntryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.showsService.create(dto, user.id);
  }

  // Sezon ilerlemesi. 'seasons/…' yolları ':id' rotalarından ÖNCE tanımlı
  @Patch('seasons/:seasonId')
  updateSeason(
    @Param('seasonId') seasonId: string,
    @Body() dto: UpdateShowSeasonDto,
  ) {
    return this.showsService.updateSeason(seasonId, dto);
  }

  /** "Buraya kadar hepsini izledim" — seçilen sezon ve öncekiler tamamlanır */
  @Post('seasons/:seasonId/complete-through')
  completeThrough(@Param('seasonId') seasonId: string) {
    return this.showsService.completeThrough(seasonId);
  }

  @Patch(':id/refresh')
  refresh(@Param('id') id: string) {
    return this.showsService.refresh(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateShowEntryDto) {
    return this.showsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.showsService.softDelete(id);
  }
}
