import { Module } from '@nestjs/common';
import { SportArchiveService } from './sport-archive.service';
import { SportArchiveController } from './sport-archive.controller';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * Salon 06 · Spor Arşivi. Mevcut `SportModule`den ayrı tutuldu: o evren
 * tabanlı eski veriyi sunuyor ve canlıda çalışıyor, bu yeni arşiv modellerini.
 * İkisi bir süre yan yana yaşayacak; ayrı modül, göç günü birini kaldırmayı
 * tek dosyalık bir iş yapıyor.
 */
@Module({
  imports: [PrismaModule],
  controllers: [SportArchiveController],
  providers: [SportArchiveService],
})
export class SportArchiveModule {}
