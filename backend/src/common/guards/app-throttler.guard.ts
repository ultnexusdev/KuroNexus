import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';

/**
 * Özel ağ aralıkları (RFC 1918 + loopback), IPv6'ya eşlenmiş biçimleriyle.
 * Docker'ın köprü ağı bunların içinden adres dağıtır.
 */
const PRIVATE_IP =
  /^(?:::ffff:)?(?:10\.|127\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)|^::1$/;

/**
 * İstek Docker iç ağından mı geldi?
 *
 * İKİ KOŞUL BİRDEN aranıyor ve bu bilinçli:
 * 1. `X-Forwarded-For` YOK — dışarıdan gelen her istek Traefik'ten geçiyor ve
 *    Traefik bu başlığı istisnasız ekliyor. Başlığın yokluğu "bu istek ters
 *    proxy'ye hiç uğramadı" demek.
 * 2. Kaynak IP özel aralıkta.
 *
 * Tek başına IP kontrolü yetmezdi: `trust proxy` açık olduğu için Express
 * dışarıdan gelen isteklerde `req.ip`'yi zaten başlıktan türetiyor. Tek başına
 * başlık kontrolü de yetmezdi. İkisi birlikte, dışarıdan taklit edilemeyecek
 * bir imza veriyor — saldırgan Docker ağına paket sokamaz, soktuğu başlık da
 * Traefik tarafından listeye eklenir.
 */
export function isInternalRequest(request: {
  ip?: string;
  ips?: string[];
  headers?: Record<string, unknown>;
}): boolean {
  const forwarded = request.headers?.['x-forwarded-for'];
  if (forwarded || (request.ips && request.ips.length > 0)) {
    return false;
  }
  return typeof request.ip === 'string' && PRIVATE_IP.test(request.ip);
}

/**
 * Global throttle IP başına 100 istek/dakika. Ama SSR çağrıları tarayıcıdan
 * değil Next konteynerinden çıkıyor (üretimde `API_INTERNAL_URL` ile Docker iç
 * ağından), yani BÜTÜN ziyaretçilerin sunucu tarafı istekleri tek kovaya
 * yazılıyordu: tek sayfa render'ı 2-5 çağrı yaptığı için dakikada ~20-30 sayfa
 * görüntülemede sınır doluyor, backend 429 dönmeye başlıyordu. Ön yüzdeki
 * yaygın `catch { return [] }` deseni de 429'u sessizce boş rafa çeviriyordu —
 * site "çalışıyor" görünüp içerik kayboluyordu (1 Eylül 2026 denetimi, API-02).
 *
 * Bu guard yalnızca iç ağ isteklerini muaf tutar. Tarayıcıdan gelen gerçek
 * trafik için brute-force/kötüye kullanım koruması aynen sürüyor; auth'taki
 * sıkı `@Throttle` sınırları da etkilenmiyor (onlar ayrı kovada ve dışarıdan
 * geliyor).
 */
@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    // Önce @SkipThrottle dekoratörü (ör. /health) işlensin.
    if (await super.shouldSkip(context)) {
      return true;
    }
    if (context.getType() !== 'http') {
      return false;
    }
    return isInternalRequest(context.switchToHttp().getRequest<Request>());
  }
}
