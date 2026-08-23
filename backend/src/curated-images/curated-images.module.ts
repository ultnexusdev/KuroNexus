import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CuratedImagesController } from './curated-images.controller';
import { CuratedImagesAdminController } from './curated-images.admin.controller';
import { CuratedImagesService } from './curated-images.service';

/**
 * Küratör görsel yuvaları — kanattan BAĞIMSIZ modül.
 *
 * Anime modülünün içine konmadı ve konmamalı: tablonun adresleme birimi
 * `surface` ("anime/bleach", yarın "anime/one-piece", öbür gün
 * "kitap/zaman-carki"). Modülü bir kanadın altına koymak, ikinci kanat
 * kullanmak istediğinde ya çapraz bağımlılık ya kopya üretirdi.
 *
 * İki controller, tek servis: okuma `@Public()`, yazma `@Roles('ADMIN')`,
 * ayrı dosyalarda.
 */
@Module({
  imports: [PrismaModule],
  controllers: [CuratedImagesController, CuratedImagesAdminController],
  providers: [CuratedImagesService],
})
export class CuratedImagesModule {}
