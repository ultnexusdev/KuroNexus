import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // Salon 02 tek istekte dolar: arşiv + künye şeridi + yönetmenler + türler
  @Public()
  @Get()
  getArchive() {
    return this.moviesService.getArchive();
  }
}
