import { Module } from '@nestjs/common';
import { RemoteImageService } from './remote-image.service';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, RemoteImageService],
})
export class UploadsModule {}
