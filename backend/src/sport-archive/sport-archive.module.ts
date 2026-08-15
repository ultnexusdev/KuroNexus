import { Module } from '@nestjs/common';
import { SportArchiveService } from './sport-archive.service';
import { SportArchiveCuratorService } from './sport-archive-curator.service';
import { SportArchiveController } from './sport-archive.controller';
import { SportArchiveAdminController } from './sport-archive.admin.controller';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * Salon 06 · Spor Arşivi — kanadın TEK modülü. Kurulurken eski `SportModule`
 * (evren tabanlı veri) ile yan yana yaşasın diye AYRI tutulmuştu; ayrım işe
 * yaradı: 15 Ağustos'ta eskisini kaldırmak gerçekten tek dosyalık bir iş oldu
 * (`app.module.ts`ten iki satır). Bu, ayrı modül tutmanın karşılığıydı.
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
