import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { WikiService } from './wiki.service';

@Controller('universes/:universeSlug/wiki')
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  @Public()
  @Get()
  findByUniverse(@Param('universeSlug') universeSlug: string) {
    return this.wikiService.findByUniverseSlug(universeSlug);
  }

  @Public()
  @Get(':entrySlug')
  findBySlug(
    @Param('universeSlug') universeSlug: string,
    @Param('entrySlug') entrySlug: string,
  ) {
    return this.wikiService.findBySlug(universeSlug, entrySlug);
  }
}
