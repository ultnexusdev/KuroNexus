import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadsModule } from '../uploads/uploads.module';
import { AnimeController } from './anime.controller';
import { AnimeAdminController } from './anime.admin.controller';
import { AnimeService } from './anime.service';
import { AnilistService } from './anilist.service';
import { JikanService } from './jikan.service';
import { AnimeCron } from './anime.cron';
import { AkatsukiSetupService } from './akatsuki-setup.service';
import { CharacterImagesService } from './character-images.service';
import { CharacterImagesAdminController } from './character-images.admin.controller';
import { HiddenCharactersService } from './hidden-characters.service';
import { HiddenCharactersAdminController } from './hidden-characters.admin.controller';

@Module({
  imports: [PrismaModule, UploadsModule],
  controllers: [
    AnimeController,
    AnimeAdminController,
    CharacterImagesAdminController,
    HiddenCharactersAdminController,
  ],
  providers: [
    AnimeService,
    AnilistService,
    JikanService,
    AnimeCron,
    AkatsukiSetupService,
    CharacterImagesService,
    HiddenCharactersService,
  ],
})
export class AnimeModule {}
