import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

/**
 * Adresten görsel indirme (yalnızca yönetici).
 *
 * `book-cover.service.ts`teki indiriciden farkı **beyaz liste olmaması**:
 * orada kaynaklar belli (Open Library, Google Books, 1000Kitap), burada ise
 * kürator beğendiği herhangi bir görselin adresini yapıştırıyor. Sabit bir
 * liste bu işi baştan imkânsız kılardı.
 *
 * Beyaz liste yoksa SSRF savunması nereden geliyor:
 *  1. Yalnızca http/https — `file://`, `gopher://` gibi şemalar reddediliyor
 *  2. Ad çözümlemesi ÖNCE yapılıyor ve çıkan IP **özel/iç ağ** aralıklarında
 *     ise istek hiç atılmıyor (127.x, 10.x, 172.16–31.x, 192.168.x, 169.254.x
 *     — bulut sağlayıcıların meta veri ucu dahil, ::1 ve fc00::/7)
 *  3. Yönlendirme elle takip ediliyor (`redirect: 'manual'`), en fazla iki
 *     sıçrama, her sıçrama aynı süzgeçten yeniden geçiyor
 *  4. Yanıtın içerik tipi `image/*` değilse atılıyor
 *  5. Boyut sınırı, zaman aşımı
 *  6. Uç `@Roles('ADMIN')` arkasında
 *
 * ⚠️ KABUL EDİLMİŞ ARTIK RİSK — DNS rebinding.
 * Ad çözümlemesiyle asıl isteğin arasında, alan adının işaret ettiği IP
 * değişebilir (TTL 0 ile). Bunu tam kapatmak için isteği IP'ye atıp `Host`
 * başlığını elle vermek gerekir; o da TLS/SNI'yı bozar. Uç yalnızca yönetici
 * oturumuna açık olduğu için risk orantılı bulundu: bu saldırıyı kurabilen
 * birinin zaten yönetici oturumu var demektir.
 */

const REQUEST_TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 2;
const MAX_BYTES = 15 * 1024 * 1024;

const ALLOWED_CONTENT_TYPES = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
  ['image/avif', '.avif'],
]);

export interface RemoteImage {
  buffer: Buffer;
  mimeType: string;
  extension: string;
  originalName: string;
}

@Injectable()
export class RemoteImageService {
  private readonly logger = new Logger(RemoteImageService.name);

  async fetchImage(rawUrl: string): Promise<RemoteImage> {
    let url: URL;
    try {
      url = new URL(rawUrl.trim());
    } catch {
      throw new BadRequestException('UPLOADS.INVALID_URL');
    }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new BadRequestException('UPLOADS.INVALID_URL');
    }

    const response = await this.request(url);
    const contentType = (response.headers.get('content-type') ?? '')
      .split(';')[0]
      .trim()
      .toLowerCase();
    const extension = ALLOWED_CONTENT_TYPES.get(contentType);
    if (!extension) {
      throw new BadRequestException('UPLOADS.INVALID_FILE_TYPE');
    }

    // Content-Length yalanabilir; gövde okunduktan sonra da ölçülüyor
    const declared = Number(response.headers.get('content-length') ?? '0');
    if (declared > MAX_BYTES) {
      throw new BadRequestException('UPLOADS.FILE_TOO_LARGE');
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength === 0) {
      throw new BadRequestException('UPLOADS.EMPTY_RESPONSE');
    }
    if (buffer.byteLength > MAX_BYTES) {
      throw new BadRequestException('UPLOADS.FILE_TOO_LARGE');
    }

    const name = decodeURIComponent(url.pathname.split('/').pop() ?? '');
    return {
      buffer,
      mimeType: contentType,
      extension,
      originalName: name || `remote${extension}`,
    };
  }

  /** İsteği atar, yönlendirmeleri elle ve süzgeçten geçirerek takip eder. */
  private async request(start: URL): Promise<Response> {
    let target = start;
    for (let hop = 0; ; hop++) {
      await this.assertPublicHost(target);
      const response = await fetch(target, {
        redirect: 'manual',
        headers: { accept: 'image/*' },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (response.status < 300 || response.status > 399) {
        if (!response.ok) {
          throw new BadRequestException('UPLOADS.REMOTE_FAILED');
        }
        return response;
      }

      const location = response.headers.get('location');
      if (!location || hop >= MAX_REDIRECTS) {
        throw new BadRequestException('UPLOADS.REMOTE_FAILED');
      }
      try {
        target = new URL(location, target);
      } catch {
        throw new BadRequestException('UPLOADS.REMOTE_FAILED');
      }
      if (target.protocol !== 'http:' && target.protocol !== 'https:') {
        throw new BadRequestException('UPLOADS.INVALID_URL');
      }
    }
  }

  /** Adı çözer ve iç ağa bakan her adresi reddeder. */
  private async assertPublicHost(url: URL): Promise<void> {
    const host = url.hostname.replace(/^\[|\]$/g, '');
    let addresses: string[];

    if (isIP(host)) {
      addresses = [host];
    } else {
      try {
        const resolved = await lookup(host, { all: true });
        addresses = resolved.map((entry) => entry.address);
      } catch {
        throw new BadRequestException('UPLOADS.INVALID_URL');
      }
    }

    if (addresses.length === 0) {
      throw new BadRequestException('UPLOADS.INVALID_URL');
    }
    // HEPSİ genel olmalı: bir alan adı hem genel hem iç adres döndürüyorsa
    // hangisine bağlanılacağı bize kalmıyor
    for (const address of addresses) {
      if (isPrivateAddress(address)) {
        this.logger.warn(`Ic aga bakan adres reddedildi: ${host} -> ${address}`);
        throw new BadRequestException('UPLOADS.BLOCKED_HOST');
      }
    }
  }
}

/** Özel, geri döngü, bağlantı-yerel ve ayrılmış aralıklar. */
function isPrivateAddress(address: string): boolean {
  const version = isIP(address);

  if (version === 4) {
    const parts = address.split('.').map(Number);
    if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
      return true;
    }
    const [a, b] = parts;
    return (
      a === 0 || // "bu ağ"
      a === 10 || // özel
      a === 127 || // geri döngü
      (a === 100 && b >= 64 && b <= 127) || // CGNAT
      (a === 169 && b === 254) || // bağlantı-yerel + bulut meta veri ucu
      (a === 172 && b >= 16 && b <= 31) || // özel
      (a === 192 && b === 168) || // özel
      (a === 192 && b === 0) || // IETF protokol atamaları
      a >= 224 // çoklu yayın ve ayrılmış
    );
  }

  if (version === 6) {
    const value = address.toLowerCase();
    if (value === '::' || value === '::1') {
      return true;
    }
    // IPv4 eşlemeli adresler (::ffff:10.0.0.1) IPv4 kurallarıyla ölçülür
    const mapped = value.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) {
      return isPrivateAddress(mapped[1]);
    }
    return (
      value.startsWith('fe80') || // bağlantı-yerel
      value.startsWith('fc') || // benzersiz yerel
      value.startsWith('fd') ||
      value.startsWith('ff') // çoklu yayın
    );
  }

  // Çözülemeyen bir şey geldiyse güvenli taraf: reddet
  return true;
}
