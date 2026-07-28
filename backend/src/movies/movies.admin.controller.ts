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
import { MoviesService } from './movies.service';
import { CreateMovieEntryDto } from './dto/create-movie-entry.dto';
import { UpdateMovieEntryDto } from './dto/update-movie-entry.dto';

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
