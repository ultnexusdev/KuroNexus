import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Coolify/Traefik arkasında çalışıyor: X-Forwarded-For güvenilmezse
  // ThrottlerGuard tüm istekleri tek IP (proxy'nin kendisi) sanır ve
  // rate limit tüm kullanıcılar arasında paylaşılır.
  app.set('trust proxy', 1);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({ origin: process.env.CORS_ORIGIN?.split(',') ?? true });
  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
