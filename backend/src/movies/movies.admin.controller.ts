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
import { MoviesService } from './movies.service';
import { CreateMovieEntryDto } from './dto/create-movie-entry.dto';
import { UpdateMovieEntryDto } from './dto/update-movie-entry.dto';
import { DismissSuggestionDto } from './dto/dismiss-suggestion.dto';

@Roles('ADMIN')
@Controller('admin/movies')
export class MoviesAdminController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  findAll() {
    return this.moviesService.findAllForAdmin();
  }

  // ':id' rotalarından ÖNCE tanımlı olmalı
  @Get('search')
  search(@Query('q') query?: string) {
    return this.moviesService.search(query ?? '');
  }

  @Get('suggestions')
  suggestions(@CurrentUser() user: AuthenticatedUser) {
    return this.moviesService.suggestions(user.id);
  }

  // "İlgilenmiyorum" kalıcıdır: elenen film öneri havuzuna bir daha girmez
  @Post('suggestions/dismiss')
  dismissSuggestion(
    @Body() dto: DismissSuggestionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.moviesService.dismissSuggestion(dto.tmdbId, user.id);
  }

  @Delete('suggestions/dismiss/:tmdbId')
  restoreSuggestion(
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.moviesService.restoreSuggestion(tmdbId, user.id);
  }

  @Post()
  create(
    @Body() dto: CreateMovieEntryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.moviesService.create(dto, user.id);
  }

  @Patch(':id/refresh')
  refresh(@Param('id') id: string) {
    return this.moviesService.refresh(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMovieEntryDto) {
    return this.moviesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesService.softDelete(id);
  }
}
