import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Coolify/Traefik arkasında çalışıyor: X-Forwarded-For güvenilmezse
  // ThrottlerGuard tüm istekleri tek IP (proxy'nin kendisi) sanır ve
  // rate limit tüm kullanıcılar arasında paylaşılır.
  app.set('trust proxy', 1);

  /**
   * Güvenlik başlıkları.
   *
   * Bu uygulama iki şey sunuyor: JSON API ve `/uploads/*` altındaki statik
   * dosyalar (kitap kapakları, ambient ses dosyaları). İkisinin ihtiyaçları
   * farklı, ayarlar ona göre:
   *
   * - `crossOriginResourcePolicy: cross-origin` — **kritik.** Helmet'in
   *   varsayılanı `same-origin` ve frontend ayrı bir alan adında çalışıyor;
   *   varsayılan bırakılırsa tarayıcı `/uploads/*` görsellerini engeller ve
   *   bütün kapaklar kaybolur.
   *
   * - `contentSecurityPolicy` kapalı — CSP'nin asıl işi HTML sayfalarında;
   *   burası JSON ve görsel sunuyor. Helmet'in varsayılan CSP'si statik
   *   dosya sunumunu gereksiz yere kısıtlıyor. Sayfa CSP'si frontend
   *   tarafında (`next.config.ts`) tanımlı.
   *
   * - `nosniff` (varsayılan açık) burada özellikle değerli: yüklenen bir
   *   dosyanın tarayıcı tarafından "aslında script'miş" diye yorumlanmasını
   *   engelliyor.
   */
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
      // HSTS: tarayıcı bu alan adına bir yıl boyunca yalnızca HTTPS ile bağlanır.
      // Traefik TLS'i sonlandırıyor, uygulamaya HTTP geliyor — bu yüzden
      // başlığı uygulama katmanında göndermek doğru yer.
      hsts: { maxAge: 31_536_000, includeSubDomains: true, preload: false },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  );
  // "Bu bir Express uygulaması" bilgisini vermeye gerek yok
  app.disable('x-powered-by');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // `credentials: true` olmadan tarayıcı oturum çerezini API'ye göndermez —
  // giriş yapılır ama sonraki her istek 401 döner. Bu yüzden kaynak listesi de
  // üretimde mutlaka `CORS_ORIGIN` ile daraltılmış olmalı.
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? true,
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
