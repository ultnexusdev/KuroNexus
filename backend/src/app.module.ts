import { resolve } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StoriesModule } from './stories/stories.module';
import { UniversesModule } from './universes/universes.module';
import { WikiModule } from './wiki/wiki.module';
import { UploadsModule } from './uploads/uploads.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AmbientTracksModule } from './ambient-tracks/ambient-tracks.module';
import { TransferNewsModule } from './transfer-news/transfer-news.module';
import { SportArchiveModule } from './sport-archive/sport-archive.module';
import { FootballModule } from './football/football.module';
import { CategoriesModule } from './categories/categories.module';
import { MoviesModule } from './movies/movies.module';
import { AnimeModule } from './anime/anime.module';
import { ShowsModule } from './shows/shows.module';
import { BooksModule } from './books/books.module';
import { MusicModule } from './music/music.module';
import { PulseModule } from './pulse/pulse.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    // Yüklenen görseller /uploads/* altından public servis edilir
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          rootPath: resolve(
            configService.get<string>('UPLOAD_DIR', './uploads'),
          ),
          serveRoot: '/uploads',
          /**
           * Bir yıllık, değişmez önbellek — ÖLÇÜMLE eklendi (2026-08-09).
           *
           * Varsayılan `Cache-Control: public, max-age=0` idi. "public" kulağa
           * önbelleklenir gibi geliyor ama `max-age=0` tarayıcıya "her açılışta
           * bana tekrar sor" dedirtiyor. Ölçüm: kitap rafında 30 kapak için
           * HER ziyarette 30 koşullu istek gidiyor, hepsi 304 dönüyor —
           * tek bayt veri inmiyor ama tarayıcıda kapak başına 336–539 ms
           * bekleniyor. Kullanıcının gördüğü "kapaklar geç geliyor" tam bu.
           *
           * `immutable` NEDEN GÜVENLİ: bu klasördeki her dosya
           * `${Date.now()}-${randomBytes(8)}${uzantı}` ile adlandırılıyor
           * (`uploads.service.ts:93`, `book-cover.service.ts:161`) ve var olan
           * bir ada ASLA üzerine yazılmıyor. İçerik değişince yeni dosya, yeni
           * ad, yeni URL oluşuyor; kayıt eski adı bırakıyor. Yani "bu adres
           * artık hiç değişmeyecek" sözü doğru. Adlandırma bu kuralı bozarsa
           * (sabit ada üzerine yazma) bu satır da geri alınmalı.
           */
          serveStaticOptions: {
            maxAge: '365d',
            immutable: true,
          },
        },
      ],
    }),
    PrismaModule,
    AuthModule,
    StoriesModule,
    UniversesModule,
    WikiModule,
    UploadsModule,
    AmbientTracksModule,
    TransferNewsModule,
    SportArchiveModule,
    FootballModule,
    CategoriesModule,
    MoviesModule,
    AnimeModule,
    ShowsModule,
    BooksModule,
    MusicModule,
    PulseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Guard sırası önemli: önce rate limit, sonra kimlik, sonra rol.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
