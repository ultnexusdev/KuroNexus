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
  // Salon 06 kulup sayfasi kadroyu buradan okuyor (football-live modulu).
  // Ayni sorguyu ikinci kez yazmak yerine servis paylasiliyor: kadro
  // duzeltmeleri (SquadOverride) tek yerde uygulaniyor.
  exports: [FootballService],
})
export class FootballModule {}
