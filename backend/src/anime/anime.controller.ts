import { Controller, Get } from '@nestjs/common';
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
}
