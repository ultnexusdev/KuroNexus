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
import { SportModule } from './sport/sport.module';
import { FootballModule } from './football/football.module';
import { CategoriesModule } from './categories/categories.module';
import { MoviesModule } from './movies/movies.module';

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
    SportModule,
    FootballModule,
    CategoriesModule,
    MoviesModule,
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
