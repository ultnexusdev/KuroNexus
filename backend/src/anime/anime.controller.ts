import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { AnimeService } from './anime.service';

@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  // Anime salonu tek istekte dolar: seriler + künye şeridi + stüdyo/tür/etiket
  @Public()
  @Get()
  getArchive() {
    return this.animeService.getArchive();
  }

  // Salon girişinin dekoratif afişleri; ':slug' rotasından ÖNCE
  @Public()
  @Get('showcase')
  getShowcase() {
    return this.animeService.showcase();
  }

  // ':slug' rotasından ÖNCE tanımlı olmalı
  @Public()
  @Get('parts/:partId/episodes')
  getPartEpisodes(@Param('partId') partId: string) {
    return this.animeService.getPartEpisodes(partId);
  }

  @Public()
  @Get(':slug')
  getDetail(@Param('slug') slug: string) {
    return this.animeService.getDetail(slug);
  }
}
