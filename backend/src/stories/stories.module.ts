import { Module } from '@nestjs/common';
import { StoriesController } from './stories.controller';
import { StoriesAdminController } from './stories.admin.controller';
import { StoriesService } from './stories.service';

@Module({
  controllers: [StoriesController, StoriesAdminController],
  providers: [StoriesService],
})
export class StoriesModule {}
