import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AnimeController } from './anime.controller';
import { AnimeAdminController } from './anime.admin.controller';
import { AnimeService } from './anime.service';
import { AnilistService } from './anilist.service';
import { JikanService } from './jikan.service';
import { AnimeCron } from './anime.cron';
import { CharacterImagesService } from './character-images.service';
import { CharacterImagesAdminController } from './character-images.admin.controller';

@Module({
  imports: [PrismaModule],
  controllers: [
    AnimeController,
    AnimeAdminController,
    CharacterImagesAdminController,
  ],
  providers: [
    AnimeService,
    AnilistService,
    JikanService,
    AnimeCron,
    CharacterImagesService,
  ],
})
export class AnimeModule {}
