import { Module } from '@nestjs/common';
import { WikiController } from './wiki.controller';
import { WikiAdminController } from './wiki.admin.controller';
import { WikiService } from './wiki.service';

@Module({
  controllers: [WikiController, WikiAdminController],
  providers: [WikiService],
})
export class WikiModule {}
