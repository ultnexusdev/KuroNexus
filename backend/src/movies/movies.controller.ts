import { Controller, Get, Param } from '@nestjs/common';
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

  // Salon girişinin dekoratif afişleri
  @Public()
  @Get('showcase')
  getShowcase() {
    return this.moviesService.showcase();
  }

  // Film sayfası. ':slug' en sonda: 'showcase' gibi sabit yollar önce eşleşsin
  @Public()
  @Get(':slug')
  getDetail(@Param('slug') slug: string) {
    return this.moviesService.getDetail(slug);
  }
}
