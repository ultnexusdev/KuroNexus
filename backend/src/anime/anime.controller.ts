import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
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

  // Karakter dizini: arşivdeki bütün serilerin kadroları tek listede.
  // ':slug' rotasından ÖNCE — aksi hâlde "characters" bir seri adı sanılır.
  @Public()
  @Get('characters')
  getCharacterIndex() {
    return this.animeService.getCharacterIndex();
  }

  /**
   * Adı geçen karakterlerin küçük künyeleri (portre + ad).
   *
   * ':characterId' rotasından ÖNCE tanımlı olmalı: 'cards' sayı olmadığı için
   * oradaki `ParseIntPipe` 400 döndürürdü.
   */
  @Public()
  @Get('characters/cards')
  getCharacterCards(@Query('ids') ids?: string) {
    const parsed = (ids ?? '')
      .split(',')
      .map((value) => Number.parseInt(value.trim(), 10))
      .filter((value) => Number.isInteger(value) && value > 0)
      // Üst sınır: adres çubuğundan gelen liste sınırsız uzayabilir, tek
      // AniList sayfası da zaten 50 kayıt veriyor
      .slice(0, 50);
    return this.animeService.getCharacterCards(parsed);
  }

  /**
   * Karakter sayfası. Kimlik AniList karakter numarası; `ParseIntPipe`
   * sayı olmayan her şeyi 400 ile keser — sayısal olmayan bir değer
   * `Number()` ile `NaN`'a düşer ve AniList'e anlamsız sorgu giderdi.
   */
  @Public()
  @Get('characters/:characterId')
  getCharacterDetail(@Param('characterId', ParseIntPipe) characterId: number) {
    return this.animeService.getCharacterDetail(characterId);
  }

  @Public()
  @Get(':slug')
  getDetail(@Param('slug') slug: string) {
    return this.animeService.getDetail(slug);
  }
}
