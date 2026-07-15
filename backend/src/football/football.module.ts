import { Module } from '@nestjs/common';
import { FootballService } from './football.service';
import {
  FootballAdminController,
  FootballController,
} from './football.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FootballController, FootballAdminController],
  providers: [FootballService],
})
export class FootballModule {}
