import { Module } from '@nestjs/common';
import { RemoteImageService } from './remote-image.service';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, RemoteImageService],
  // Anime kanadının Akatsuki kurulum ucu aynı indirme/depolama yolunu
  // kullanıyor — ikinci bir indirme yolu doğmasın diye buradan veriliyor
  exports: [UploadsService, RemoteImageService],
})
export class UploadsModule {}
