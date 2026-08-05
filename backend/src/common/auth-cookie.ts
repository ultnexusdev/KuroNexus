import type { CookieOptions } from 'express';

/**
 * Oturum çerezi — tek tanım yeri.
 *
 * Token'ı tarayıcıya bu çerez taşır ve `httpOnly` sayesinde sayfadaki hiçbir
 * JavaScript onu okuyamaz. (Eski yöntemde `document.cookie` ile yazılıyordu;
 * 4 Ağustos 2026'da admin token'ının konsoldan okunup API çağrısı
 * yapılabildiği canlı olarak gözlendi — bu değişikliğin sebebi o.)
 *
 * Sunucu tarafı okuma etkilenmez: Next `cookies()` ile aynı çerezi görür ve
 * `/auth/me` çağrısını onunla yapar. Kısıtlanan yalnızca tarayıcıdaki JS.
 *
 * ⚠️ Ad bilinçli olarak eskisinden (`kuronexus-token`) FARKLI. Aynı ad
 * kullanılsaydı geçiş sırasında tarayıcıda iki ayrı çerez aynı adı taşır
 * (biri JS'in yazdığı host-only, biri sunucunun yazdığı alan adı geneli) ve
 * hangisinin okunacağı belirsizleşirdi. Süresi dolmuş olanın öne geçmesi,
 * sebebi zor bulunan "bazen oturum düşüyor" arızası üretirdi.
 */
export const AUTH_COOKIE_NAME = 'kuronexus-session';

// JWT'nin kendi ömrüyle aynı olmalı (JWT_EXPIRES_IN varsayılanı '1d').
// Çerez daha uzun yaşarsa kullanıcı "girişli" görünür ama her istek 401 alır.
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

/**
 * `domain` üretimde `.kuronexus.com` olmalı (`AUTH_COOKIE_DOMAIN`): çerezi
 * `api.kuronexus.com` yazar, ama `kuronexus.com` üzerindeki Next sunucusunun
 * da okuması gerekir. Tanımsız bırakılırsa çerez yalnızca API alan adına
 * yazılır ve arayüz girişi hiç görmez. Geliştirmede iki taraf da `localhost`
 * olduğu için değişken boş bırakılır.
 *
 * `sameSite: 'lax'` yeterli: iki alan adı aynı sitede (kuronexus.com), yani
 * kendi isteklerimiz çerezi taşır; başka bir siteden gelen POST isteğine
 * tarayıcı çerezi eklemez — CSRF'e karşı asıl koruma bu.
 *
 * `secure` yalnızca üretimde: lokalde HTTP kullanılıyor, açık bırakılsa
 * tarayıcı çerezi hiç kaydetmezdi.
 */
export function authCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    domain: process.env.AUTH_COOKIE_DOMAIN || undefined,
    path: '/',
    maxAge: MAX_AGE_MS,
  };
}

/**
 * Silme yalnızca ad + domain + path üçlüsü birebir aynıysa çalışır; farklı bir
 * domain ile gönderilen silme başlığı tarayıcıda hiçbir şey yapmaz. Ayarların
 * tek dosyada durmasının sebebi tam olarak bu.
 */
export function clearAuthCookieOptions(): CookieOptions {
  const options = authCookieOptions();
  delete options.maxAge;
  return options;
}

/** Çerez başlığından token'ı okur — `cookie-parser` bağımlılığına gerek yok. */
export function readAuthCookie(header: string | undefined): string | undefined {
  if (!header) {
    return undefined;
  }
  for (const part of header.split(';')) {
    const separator = part.indexOf('=');
    if (separator === -1) {
      continue;
    }
    if (part.slice(0, separator).trim() === AUTH_COOKIE_NAME) {
      return decodeURIComponent(part.slice(separator + 1).trim());
    }
  }
  return undefined;
}
