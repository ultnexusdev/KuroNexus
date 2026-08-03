import { randomBytes } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Kapak görsellerini **kendi diskimize** indirir (kullanıcı kararı: "kesinlikle
 * hotlink kullanılmayacak").
 *
 * Neden: dış adresler kırılıyor. 1000Kitap'ın CDN'i referer kontrolü
 * ekleyebilir, Google'ın `books.google.com` bağlantıları cilt kaydı
 * değişince ölüyor, Open Library kapak numaraları taşınabiliyor. Arşiv
 * kalıcı olsun isteniyorsa görselin de bizde durması gerekiyor.
 *
 * Dosyalar `UPLOAD_DIR/books/` altına yazılır ve `/uploads/books/…` olarak
 * sunulur (`ServeStaticModule`, bkz. `app.module.ts`).
 *
 * `MediaAsset` kaydı **açılmıyor**: o model kullanıcının elle yüklediği
 * dosyaların defteri (sahibi, özgün adı, kotası var). Kapak ise kitabın
 * türetilmiş verisi — ömrü kayda bağlı, ayrı bir sahiplik taşımıyor.
 */

/**
 * **SSRF savunmasının birinci hattı.** İndirme yalnızca bu sunuculardan
 * yapılır; künyeden gelen adres başka bir yeri gösteriyorsa istek hiç
 * atılmaz. Bir kaynak eklenirse buraya da eklenmeli.
 */
const ALLOWED_HOSTS = new Set([
  '1k-cdn.com',
  'covers.openlibrary.org',
  'books.google.com',
  'books.googleusercontent.com',
  /**
   * Open Library kapağı **kendi sunmuyor**: `covers.openlibrary.org/b/id/…`
   * 302 ile `archive.org/download/olcovers…zip/…jpg` adresine gönderiyor
   * (canlıda ölçüldü — üç Nobel kapağı tam bu yüzden inmiyordu).
   */
  'archive.org',
]);

/** Kapak görselleri küçük; bu sınır kötü niyetli bir "sonsuz gövde"ye karşı. */
const MAX_COVER_BYTES = 8 * 1024 * 1024;

const REQUEST_TIMEOUT_MS = 15_000;

/**
 * En fazla kaç yönlendirme izlenir. Ölçülen en uzun zincir iki adım
 * (Open Library → archive.org → numaralı archive.org sunucusu); üçüncü adım
 * bir pay. Sınır, dönüp duran bir zincirin isteği sonsuza dek tutmasına karşı.
 */
const MAX_REDIRECTS = 3;

/**
 * Dosya uzantısı **içeriğe** göre seçiliyor, adrese göre değil: uzantı
 * uydurulabilir, imza uydurulamaz.
 */
const SIGNATURES: Array<{ ext: string; test: (bytes: Buffer) => boolean }> = [
  {
    ext: '.jpg',
    test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    ext: '.png',
    test: (b) =>
      b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  },
  {
    ext: '.gif',
    test: (b) =>
      b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38,
  },
  {
    ext: '.webp',
    test: (b) =>
      b.length > 12 &&
      b.toString('ascii', 0, 4) === 'RIFF' &&
      b.toString('ascii', 8, 12) === 'WEBP',
  },
];

@Injectable()
export class BookCoverService implements OnModuleInit {
  private readonly logger = new Logger(BookCoverService.name);
  private readonly coverDir: string;

  constructor(config: ConfigService) {
    this.coverDir = join(
      config.get<string>('UPLOAD_DIR', './uploads'),
      'books',
    );
  }

  async onModuleInit(): Promise<void> {
    await mkdir(this.coverDir, { recursive: true });
  }

  /**
   * Uzak kapağı indirir ve yerel yolunu döndürür ("/uploads/books/…").
   *
   * **Asla fırlatmaz.** Kapak indirilemediği için kitap eklenememesi kabul
   * edilemez (kural 4: eksik alan sayfayı bozmaz); başarısızlıkta `null`
   * döner, çağıran isterse dış adresi olduğu gibi saklar.
   *
   * Zaten yerel olan bir adres (`/uploads/…`) dokunulmadan geri döner —
   * geri doldurma işlemi aynı kapağı ikinci kez indirmesin.
   */
  async download(remoteUrl: string | null | undefined): Promise<string | null> {
    if (!remoteUrl) {
      return null;
    }
    if (remoteUrl.startsWith('/uploads/')) {
      return remoteUrl;
    }

    let url: URL;
    try {
      url = new URL(remoteUrl);
    } catch {
      return null;
    }

    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return null;
    }
    if (!isAllowedHost(url.hostname)) {
      this.logger.warn(`Kapak indirilmedi, izinsiz sunucu: ${url.hostname}`);
      return null;
    }

    try {
      const response = await this.request(url);
      if (!response) {
        return null;
      }
      if (!response.ok) {
        this.logger.warn(
          `Kapak indirilemedi (${response.status}): ${url.href}`,
        );
        return null;
      }

      // Sunucunun bildirdiği uzunluğa güvenilmiyor; gövde okunduktan sonra
      // gerçek boyut da sınanıyor.
      const declared = Number(response.headers.get('content-length') ?? '0');
      if (declared > MAX_COVER_BYTES) {
        this.logger.warn(`Kapak çok büyük (${declared} bayt): ${url.href}`);
        return null;
      }
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.byteLength === 0 || bytes.byteLength > MAX_COVER_BYTES) {
        return null;
      }

      const extension = detectExtension(bytes);
      if (!extension) {
        this.logger.warn(`Kapak görsel değil, atlandı: ${url.href}`);
        return null;
      }

      const filename = `${Date.now()}-${randomBytes(8).toString('hex')}${extension}`;
      await writeFile(join(this.coverDir, filename), bytes);
      return `/uploads/books/${filename}`;
    } catch (error) {
      this.logger.warn(`Kapak indirilemedi: ${url.href} — ${String(error)}`);
      return null;
    }
  }

  /**
   * İsteği atar ve **en fazla bir yönlendirmeyi** takip eder.
   *
   * Yönlendirme tarayıcıya bırakılMIYOR (`redirect: 'manual'`): izin verilen
   * bir sunucu isteği iç ağdaki bir adrese (169.254.169.254 gibi)
   * yönlendirerek beyaz listeyi delebilirdi. Onun yerine hedef **elle
   * okunuyor ve aynı süzgeçten yeniden geçiriliyor** — yani beyaz liste her
   * sıçramada geçerli, SSRF savunması aynen duruyor.
   *
   * Neden hiç takip etmemek yetmedi: Open Library kapağı kendi sunmuyor.
   * Canlıda ölçülen zincir **iki adım** — "kapak adresleri zaten doğrudan
   * dosyayı gösteriyor" varsayımı yanlış çıktı:
   *
   *   `covers.openlibrary.org/b/id/966041-L.jpg`
   *     → `archive.org/download/olcovers96/olcovers96-L.zip/966041-L.jpg`
   *     → `ia801009.us.archive.org/view_archive.php?…`   (sunucu numarası değişken)
   *
   * Son adımın numaralı alt sunucusunu `.archive.org` soneki karşılıyor;
   * `isAllowedHost` zaten alt sunucuya izin veriyor.
   */
  private async request(url: URL): Promise<Response | null> {
    let target = url;
    for (let hop = 0; ; hop++) {
      const response = await fetch(target, {
        redirect: 'manual',
        headers: { accept: 'image/*' },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (response.status < 300 || response.status > 399) {
        return response;
      }
      if (hop >= MAX_REDIRECTS) {
        this.logger.warn(`Kapak yönlendirmesi çok uzun: ${url.href}`);
        return null;
      }

      const location = response.headers.get('location');
      if (!location) {
        this.logger.warn(`Kapak yönlendirmesi adressiz: ${target.href}`);
        return null;
      }

      let next: URL;
      try {
        // Göreli adres olabilir; içinde bulunduğumuz adrese göre çözülüyor
        next = new URL(location, target);
      } catch {
        return null;
      }
      if (next.protocol !== 'https:' && next.protocol !== 'http:') {
        return null;
      }
      /* Asıl savunma bu satır: **her** sıçrama beyaz listeden yeniden
         geçiyor, yani zincirin ortasındaki bir sunucu isteği iç ağa
         (169.254.169.254 gibi) yönlendiremiyor. */
      if (!isAllowedHost(next.hostname)) {
        this.logger.warn(
          `Kapak yönlendirmesi izinsiz sunucuya: ${next.hostname}`,
        );
        return null;
      }
      target = next;
    }
  }

  /**
   * Kayıt silinirken ya da kapak değişirken eski dosyayı temizler. Dosya
   * yoksa sessiz geçer — yetim kayıt yüzünden işlem durmamalı.
   */
  async remove(localPath: string | null | undefined): Promise<void> {
    if (!localPath?.startsWith('/uploads/books/')) {
      return;
    }
    const filename = localPath.slice('/uploads/books/'.length);
    // Yol kaçışına ("../") karşı: dosya adı düz olmalı
    if (!/^[A-Za-z0-9._-]+$/.test(filename)) {
      return;
    }
    await unlink(join(this.coverDir, filename)).catch(() => undefined);
  }
}

/** Tam eşleşme ya da izinli bir alan adının alt sunucusu. */
function isAllowedHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  for (const allowed of ALLOWED_HOSTS) {
    if (host === allowed || host.endsWith(`.${allowed}`)) {
      return true;
    }
  }
  return false;
}

function detectExtension(bytes: Buffer): string | null {
  if (bytes.length < 12) {
    return null;
  }
  return SIGNATURES.find((entry) => entry.test(bytes))?.ext ?? null;
}
