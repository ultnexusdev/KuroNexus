import { Module } from '@nestjs/common';
import { SportService } from './sport.service';
import {
  SportAdminController,
  SportPublicController,
} from './sport.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SportPublicController, SportAdminController],
  providers: [SportService],
})
export class SportModule {}
