import { Module } from '@nestjs/common';
import { UniversesController } from './universes.controller';
import { UniversesAdminController } from './universes.admin.controller';
import { UniversesService } from './universes.service';

@Module({
  controllers: [UniversesController, UniversesAdminController],
  providers: [UniversesService],
})
export class UniversesModule {}
