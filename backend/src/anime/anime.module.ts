import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AnimeController } from './anime.controller';
import { AnimeAdminController } from './anime.admin.controller';
import { AnimeService } from './anime.service';
import { AnilistService } from './anilist.service';

@Module({
  imports: [PrismaModule],
  controllers: [AnimeController, AnimeAdminController],
  providers: [AnimeService, AnilistService],
})
export class AnimeModule {}
