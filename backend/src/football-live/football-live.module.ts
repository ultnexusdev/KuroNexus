import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadsModule } from '../uploads/uploads.module';
import { FootballModule } from '../football/football.module';
import { FootballLiveService } from './football-live.service';
import { FootballLiveController } from './football-live.controller';
import { FootballLiveAdminController } from './football-live.admin.controller';

/**
 * Salon 06 · Futbol · CANLI VERİ.
 *
 * ── NEDEN `FootballModule`UN İÇİNE DEĞİL ─────────────────────────────────
 * Mevcut `FootballModule` iki eski hattı taşıyor: Kaggle/Transfermarkt kadro
 * senkronu ve artık ölü Apify aktörü. O modülün biçimleri sağlayıcıya gömülü
 * (`ApifyMatchRow` doğrudan public uçtan dönüyor) ve düzeltmek onu baştan
 * yazmak demek. Ayrı modül tutmanın karşılığı `sport-archive` deneyinde
 * ölçüldü: eski modülü kaldırmak gerçekten `app.module.ts`ten iki satırlık
 * iş oldu. Aynı kapı burada da açık bırakılıyor.
 *
 * `UploadsModule` içe alınıyor çünkü arma/atmosfer görselleri indirilip
 * `/uploads/football/` altına yazılıyor — dış adres saklanmıyor (CSP ve
 * "dış adres bir gün ölür" gerekçeleri uploads modülünde yazılı).
 *
 * Yeni Prisma modeli YOK: durum `ExternalCache`te anahtar-değer olarak
 * duruyor, yani bu modül MİGRATION GEREKTİRMİYOR.
 */
/**
 * ── KADRO NEREDEN GELİYOR (19 Ağustos 2026 eki) ──────────────────────────
 * `FootballModule` içe alınıyor çünkü kadro ZATEN orada çözülmüş bir iş:
 * Kaggle/Transfermarkt tabloları + küratörün `SquadOverride` düzeltmeleri.
 * Aynı sorguyu burada tekrar yazmak, düzeltmelerin iki yerden birinde
 * unutulmasının en kısa yolu olurdu.
 *
 * Ölçüm bu kararı destekliyor: veri seti (5 Ağustos anlık görüntüsü) 36
 * oyuncu, 36 fotoğraf ve 34 forma numarası veriyor; eksik olan yalnızca son
 * iki haftanın transferleri ve admin paneli tam da onun için var.
 */
@Module({
  imports: [PrismaModule, UploadsModule, FootballModule],
  controllers: [FootballLiveController, FootballLiveAdminController],
  providers: [FootballLiveService],
})
export class FootballLiveModule {}
