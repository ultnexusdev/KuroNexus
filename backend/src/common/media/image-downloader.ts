import { randomBytes } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Logger } from '@nestjs/common';

/**
 * Uzak görselleri kendi diskimize indiren ortak hat.
 *
 * ── NEDEN TEK DOSYA ───────────────────────────────────────────────────────
 * Bu kod `BookCoverService` ve `MusicArtworkService` içinde 268'er satırlık
 * İKİ TAM KOPYA hâlinde duruyordu; `isAllowedHost` ve `detectExtension`
 * birebir aynıydı, `download`/`request` yalnızca log metinlerinde ayrılıyordu
 * (1 Eylul 2026 denetimi, bulgu D-B2). Sıradan bir tekrar olsa beklerdi — ama
 * burası SSRF savunma hattı: birine yapılan bir yamanın diğerine geçmemesi
 * doğrudan güvenlik açığı demek. Aynı denetimde bunun gerçekleştiği başka bir
 * yer de bulundu (`normalizeUrl`, D-B6): düzeltme dört kopyadan yalnız birine
 * yazılmıştı.
 *
 * ── SSRF SAVUNMASI (beş katman, sırası önemli) ────────────────────────────
 *   1. yalnızca http/https
 *   2. host beyaz listesi
 *   3. yönlendirme ELLE takip ediliyor ve HER sıçrama listeden yeniden geçiyor
 *   4. uzantı içerik imzasından seçiliyor (adres uydurulabilir, imza uydurulamaz)
 *   5. boyut sınırı ve zaman aşımı
 */

/** Kapaklar küçük; bu sınır kötü niyetli bir "sonsuz gövde"ye karşı. */
const MAX_BYTES = 8 * 1024 * 1024;

const REQUEST_TIMEOUT_MS = 15_000;

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

/** İçerik imzasından uzantı. Görsel değilse `null`. */
export function detectExtension(bytes: Buffer): string | null {
  if (bytes.length < 12) {
    return null;
  }
  return SIGNATURES.find((entry) => entry.test(bytes))?.ext ?? null;
}

/** Tam eşleşme ya da izinli bir alan adının alt sunucusu. */
export function isAllowedHost(
  hostname: string,
  allowedHosts: ReadonlySet<string>,
): boolean {
  const host = hostname.toLowerCase();
  for (const allowed of allowedHosts) {
    if (host === allowed || host.endsWith(`.${allowed}`)) {
      return true;
    }
  }
  return false;
}

export interface ImageDownloaderOptions {
  /** `UPLOAD_DIR` altındaki klasör ve `/uploads/<subdir>/…` yol öneki. */
  subdir: string;
  uploadDir: string;
  /** SSRF savunmasının birinci hattı; kaynak eklenirse buraya eklenir. */
  allowedHosts: ReadonlySet<string>;
  /**
   * İzin verilen yönlendirme sayısı. Kitap kanadında 3, çünkü Open Library
   * kapağı iki sıçrama sonrası geliyor (canlıda ölçüldü); Spotify tek
   * sıçramayla yetiniyor.
   */
  maxRedirects: number;
  /** Log metinlerindeki ad ("Kapak" / "Görsel"). */
  label: string;
}

export class ImageDownloader {
  private readonly logger: Logger;
  private readonly dir: string;
  private readonly publicPrefix: string;

  constructor(private readonly options: ImageDownloaderOptions) {
    this.logger = new Logger(`ImageDownloader:${options.subdir}`);
    this.dir = join(options.uploadDir, options.subdir);
    this.publicPrefix = `/uploads/${options.subdir}/`;
  }

  async ensureDir(): Promise<void> {
    await mkdir(this.dir, { recursive: true });
  }

  /**
   * Uzak görseli indirir ve yerel yolunu döndürür.
   *
   * **Asla fırlatmaz.** Görsel inmediği için kaydın arşive girememesi kabul
   * edilemez (kural 4: eksik alan sayfayı bozmaz); başarısızlıkta `null`
   * döner ve çağıran isterse dış adresi olduğu gibi saklar.
   *
   * Zaten yerel olan bir adres dokunulmadan geri döner — geri doldurma aynı
   * görseli ikinci kez indirmesin.
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
    if (!isAllowedHost(url.hostname, this.options.allowedHosts)) {
      this.logger.warn(
        `${this.options.label} indirilmedi, izinsiz sunucu: ${url.hostname}`,
      );
      return null;
    }

    try {
      const response = await this.request(url);
      if (!response) {
        return null;
      }
      if (!response.ok) {
        this.logger.warn(
          `${this.options.label} indirilemedi (${response.status}): ${url.href}`,
        );
        return null;
      }

      // Sunucunun bildirdiği uzunluğa güvenilmiyor; gövde okunduktan sonra
      // gerçek boyut da sınanıyor.
      const declared = Number(response.headers.get('content-length') ?? '0');
      if (declared > MAX_BYTES) {
        this.logger.warn(
          `${this.options.label} çok büyük (${declared} bayt): ${url.href}`,
        );
        return null;
      }
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.byteLength === 0 || bytes.byteLength > MAX_BYTES) {
        return null;
      }

      const extension = detectExtension(bytes);
      if (!extension) {
        this.logger.warn(
          `${this.options.label} görsel değil, atlandı: ${url.href}`,
        );
        return null;
      }

      const filename = `${Date.now()}-${randomBytes(8).toString('hex')}${extension}`;
      await writeFile(join(this.dir, filename), bytes);
      return `${this.publicPrefix}${filename}`;
    } catch (error) {
      this.logger.warn(
        `${this.options.label} indirilemedi: ${url.href} — ${String(error)}`,
      );
      return null;
    }
  }

  /**
   * İsteği atar ve sınırlı sayıda yönlendirmeyi takip eder.
   *
   * Yönlendirme fetch'e bırakılMIYOR (`redirect: 'manual'`): izin verilen bir
   * sunucu isteği iç ağdaki bir adrese (169.254.169.254 gibi) yönlendirerek
   * beyaz listeyi delebilirdi. Onun yerine hedef **elle okunuyor ve aynı
   * süzgeçten yeniden geçiriliyor** — beyaz liste her sıçramada geçerli.
   *
   * Neden hiç takip etmemek yetmedi: Open Library kapağı kendi sunmuyor.
   * Canlıda ölçülen zincir iki adım:
   *   `covers.openlibrary.org/b/id/966041-L.jpg`
   *     → `archive.org/download/olcovers96/olcovers96-L.zip/966041-L.jpg`
   *     → `ia801009.us.archive.org/view_archive.php?…`
   * Son adımın numaralı alt sunucusunu `.archive.org` soneki karşılıyor.
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
      if (hop >= this.options.maxRedirects) {
        this.logger.warn(
          `${this.options.label} yönlendirmesi çok uzun: ${url.href}`,
        );
        return null;
      }

      const location = response.headers.get('location');
      if (!location) {
        this.logger.warn(
          `${this.options.label} yönlendirmesi adressiz: ${target.href}`,
        );
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
         yönlendiremiyor. */
      if (!isAllowedHost(next.hostname, this.options.allowedHosts)) {
        this.logger.warn(
          `${this.options.label} yönlendirmesi izinsiz sunucuya: ${next.hostname}`,
        );
        return null;
      }
      target = next;
    }
  }

  /**
   * Kayıt silinirken ya da görsel değişirken eski dosyayı temizler. Dosya
   * yoksa sessiz geçer — yetim kayıt yüzünden işlem durmamalı.
   */
  async remove(localPath: string | null | undefined): Promise<void> {
    if (!localPath?.startsWith(this.publicPrefix)) {
      return;
    }
    const filename = localPath.slice(this.publicPrefix.length);
    // Yol kaçışına ("../") karşı: dosya adı düz olmalı
    if (!/^[A-Za-z0-9._-]+$/.test(filename)) {
      return;
    }
    await unlink(join(this.dir, filename)).catch(() => undefined);
  }
}
