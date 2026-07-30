import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ShowsController } from './shows.controller';
import { ShowsAdminController } from './shows.admin.controller';
import { ShowsService } from './shows.service';
import { TmdbTvService } from './tmdb-tv.service';

@Module({
  imports: [PrismaModule],
  controllers: [ShowsController, ShowsAdminController],
  providers: [ShowsService, TmdbTvService],
})
export class ShowsModule {}
