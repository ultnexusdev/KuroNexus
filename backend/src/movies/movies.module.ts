import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MoviesController } from './movies.controller';
import { MoviesAdminController } from './movies.admin.controller';
import { MoviesService } from './movies.service';
import { TmdbService } from './tmdb.service';

@Module({
  imports: [PrismaModule],
  controllers: [MoviesController, MoviesAdminController],
  providers: [MoviesService, TmdbService],
})
export class MoviesModule {}
