import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import type { Response } from 'express';
import { PrismaService } from './prisma/prisma.service';
import { Public } from './common/decorators/public.decorator';

interface HealthResult {
  status: 'ok' | 'error';
  db: 'up' | 'down';
}

/*
 * İskeleden kalma `GET /` ("Hello World!") ve AppService 2026-08-22'de
 * KALDIRILDI (kullanıcı onayı). Güvenli olduğu ölçüldü: rota @Public()
 * DEĞİLDİ, yani anonim istek zaten 401 alıyordu — hiçbir dış sağlık
 * yoklaması ona bağlı olamazdı. Gerçek sağlık ucu aşağıdaki /health.
 */
@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Sağlık ucu — veritabanına GERÇEKTEN dokunur.
   *
   * Boş bir "ok" dönmek bu projede işe yaramazdı: veritabanına ulaşılamadığında
   * site zaten HTTP 200 dönüyor ve sayfalar açılıyor, yalnızca raflar sessizce
   * boş geliyor (`lib/api/*.ts` içindeki `catch { return [] }`, inceleme raporu
   * bulgu Ö-8). Yani "sayfa açılıyor" ile "çalışıyor" bu sistemde aynı şey
   * değil. `SELECT 1` o farkı ölçülebilir hale getiriyor.
   *
   * `@Public()`: izleme aracı giriş yapamaz. `@SkipThrottle()`: düzenli aralıkla
   * yoklanacak, rate limit'i tüketmemeli.
   */
  @Public()
  @SkipThrottle()
  @Get('health')
  @HttpCode(HttpStatus.OK)
  async health(
    @Res({ passthrough: true }) response: Response,
  ): Promise<HealthResult> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', db: 'up' };
    } catch {
      // 503: "ayaktayım ama hizmet veremiyorum". İzleme araçlarının ve
      // yük dengeleyicilerin anladığı dil bu.
      response.status(HttpStatus.SERVICE_UNAVAILABLE);
      return { status: 'error', db: 'down' };
    }
  }
}
