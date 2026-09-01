import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ImageDownloader } from '../common/media/image-downloader';

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
 *
 * İNDİRME HATTI ORTAK: gövde 1 Eylül 2026 denetiminde
 * `common/media/image-downloader.ts`e taşındı (bulgu D-B2). Bu dosya ile
 * `music-artwork.service.ts` 268'er satırlık iki tam kopyaydı; SSRF
 * savunmasında yapılan bir yamanın yalnızca birine gitmesi gerçek bir riskti.
 * Burada kalan şey kitaba ÖZGÜ olan: hangi sunuculara izin verildiği ve kaç
 * yönlendirmenin izleneceği.
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

/**
 * En fazla kaç yönlendirme izlenir. Ölçülen en uzun zincir iki adım
 * (Open Library → archive.org → numaralı archive.org sunucusu); üçüncü adım
 * bir pay. Sınır, dönüp duran bir zincirin isteği sonsuza dek tutmasına karşı.
 */
const MAX_REDIRECTS = 3;

@Injectable()
export class BookCoverService implements OnModuleInit {
  private readonly downloader: ImageDownloader;

  constructor(config: ConfigService) {
    this.downloader = new ImageDownloader({
      uploadDir: config.get<string>('UPLOAD_DIR', './uploads'),
      subdir: 'books',
      allowedHosts: ALLOWED_HOSTS,
      maxRedirects: MAX_REDIRECTS,
      label: 'Kapak',
    });
  }

  async onModuleInit(): Promise<void> {
    await this.downloader.ensureDir();
  }

  /**
   * Uzak kapağı indirir ve yerel yolunu döndürür ("/uploads/books/…").
   * Başarısızlıkta `null` — asla fırlatmaz (gerekçe ortak hatta yazılı).
   */
  download(remoteUrl: string | null | undefined): Promise<string | null> {
    return this.downloader.download(remoteUrl);
  }

  /** Kayıt silinirken ya da kapak değişirken eski dosyayı temizler. */
  remove(localPath: string | null | undefined): Promise<void> {
    return this.downloader.remove(localPath);
  }
}
