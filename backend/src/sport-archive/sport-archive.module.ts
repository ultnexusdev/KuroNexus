import { Module } from '@nestjs/common';
import { SportArchiveService } from './sport-archive.service';
import { SportArchiveCuratorService } from './sport-archive-curator.service';
import { SportArchiveController } from './sport-archive.controller';
import { SportArchiveAdminController } from './sport-archive.admin.controller';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * Salon 06 · Spor Arşivi. Mevcut `SportModule`den ayrı tutuldu: o evren
 * tabanlı eski veriyi sunuyor ve canlıda çalışıyor, bu yeni arşiv modellerini.
 * İkisi bir süre yan yana yaşayacak; ayrı modül, göç günü birini kaldırmayı
 * tek dosyalık bir iş yapıyor.
 *
 * İki controller, iki servis ve ayrımları KURAL: okuma tarafı yalnızca
 * yayınlanmışı görür ve `@Public()`; küratör tarafı taslakları da görür ve
 * `@Roles('ADMIN')` arkasındadır. İki kuralı aynı dosyada tutmak, bir gün
 * yanlış yerde süzgeç unutup taslakları herkese açmanın en kısa yolu.
 */
@Module({
  imports: [PrismaModule],
  controllers: [SportArchiveController, SportArchiveAdminController],
  providers: [SportArchiveService, SportArchiveCuratorService],
})
export class SportArchiveModule {}
