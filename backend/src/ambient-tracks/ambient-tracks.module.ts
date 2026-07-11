import { Module } from '@nestjs/common';
import { AmbientTracksService } from './ambient-tracks.service';
import { AmbientTracksController } from './ambient-tracks.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AmbientTracksController],
  providers: [AmbientTracksService],
})
export class AmbientTracksModule {}
