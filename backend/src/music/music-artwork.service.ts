import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ImageDownloader } from '../common/media/image-downloader';

/**
 * Albüm kapağı ve sanatçı görselini **kendi diskimize** indirir.
 *
 * Kullanıcı kararı: Spotify CDN'ine hotlink YAPILMAZ. Gerekçe kitap
 * kapaklarındakiyle aynı (`books/book-cover.service.ts`): dış adres bir gün
 * ölüyor, CDN referer kontrolü ekleyebiliyor, arşiv kalıcı olsun isteniyorsa
 * görselin de bizde durması gerekiyor. Ayrıca `next.config.ts` içindeki CSP
 * `img-src` listesine Spotify CDN'i eklenmediği için hotlink zaten çizilmezdi.
 *
 * Orijinal adres yine de saklanıyor (`artworkSourceUrl` / `imageSourceUrl`):
 * yerelleştirmeden vazgeçilirse tek dayanak o olur.
 *
 * ── NEDEN `UploadsService` DEĞİL ──────────────────────────────────────────
 * O servis her dosya için `MediaAsset` kaydı açıyor ve `userId` ZORUNLU
 * (`schema.prisma`, `MediaAsset.userId`). Arka plan senkronizasyonunda oturum
 * açmış bir kullanıcı YOK — o yolu kullanmak sahte bir kullanıcı kimliği
 * uydurmayı ya da şemayı gevşetmeyi gerektirirdi. Kapak zaten albümün
 * türetilmiş verisi: ömrü kayda bağlı, ayrı bir sahiplik taşımıyor.
 *
 * ── SSRF SAVUNMASI ORTAK HATTA ────────────────────────────────────────────
 * Adresler bize Spotify'ın yanıtından geliyor, yani "güvenilir" görünüyor —
 * ama yanıtı doğrulamadan izlemek, kaynağın bizi iç ağa yönlendirmesine kapı
 * bırakır. Beş katmanlı savunma `common/media/image-downloader.ts` içinde ve
 * kitap kanadıyla PAYLAŞILIYOR: 1 Eylül 2026 denetimine kadar bu dosya ile
 * `book-cover.service.ts` 268'er satırlık iki tam kopyaydı ve bir yamanın
 * yalnız birine gitmesi gerçek bir riskti (bulgu D-B2). Burada kalan şey
 * müziğe ÖZGÜ olan: izinli sunucular, yönlendirme sayısı ve yerelleştirme
 * bayrağı.
 */

/**
 * **SSRF savunmasının birinci hattı.** Spotify görsellerini üç alan adından
 * sunuyor; `image-cdn-*.spotifycdn.com` numaralı alt sunucular üretiyor, o
 * yüzden sonek eşleşmesi var (`isAllowedHost`).
 */
const ALLOWED_HOSTS = new Set([
  'i.scdn.co',
  'mosaic.scdn.co',
  'scdn.co',
  'spotifycdn.com',
]);

/** Spotify tek sıçramayla yetiniyor; iki adım rahat bir pay. */
const MAX_REDIRECTS = 2;

@Injectable()
export class MusicArtworkService implements OnModuleInit {
  private readonly downloader: ImageDownloader;

  /**
   * Yerelleştirme kapatılabilir olsun diye bayrak var (varsayılan açık).
   * Gerekçe: Spotify'ın geliştirici şartları görselin süresiz yerel
   * kopyalanmasına sıcak bakmıyor; karar bir gün değişirse okuma yolu
   * `artworkSourceUrl`e döner ve bu tek değişkenle geçiş yapılır — kod
   * değişikliği gerekmez.
   */
  private readonly localizeEnabled: boolean;

  constructor(config: ConfigService) {
    this.downloader = new ImageDownloader({
      uploadDir: config.get<string>('UPLOAD_DIR', './uploads'),
      subdir: 'music',
      allowedHosts: ALLOWED_HOSTS,
      maxRedirects: MAX_REDIRECTS,
      label: 'Görsel',
    });
    this.localizeEnabled =
      config.get<string>('MUSIC_ARTWORK_LOCALIZE', '1') !== '0';
  }

  async onModuleInit(): Promise<void> {
    await this.downloader.ensureDir();
  }

  isLocalizeEnabled(): boolean {
    return this.localizeEnabled;
  }

  /**
   * Uzak görseli indirir ve yerel yolunu döndürür ("/uploads/music/…").
   * Başarısızlıkta `null` — asla fırlatmaz (gerekçe ortak hatta yazılı).
   *
   * Bayrak kapalıysa indirme HİÇ denenmiyor; ama zaten yerel olan bir adres
   * yine olduğu gibi dönüyor, yoksa bayrağı kapatmak mevcut kayıtların
   * görsellerini de kaybettirirdi.
   */
  download(remoteUrl: string | null | undefined): Promise<string | null> {
    if (remoteUrl?.startsWith('/uploads/')) {
      return Promise.resolve(remoteUrl);
    }
    if (!this.localizeEnabled) {
      return Promise.resolve(null);
    }
    return this.downloader.download(remoteUrl);
  }

  /** Kayıt silinirken ya da görsel değişirken eski dosyayı temizler. */
  remove(localPath: string | null | undefined): Promise<void> {
    return this.downloader.remove(localPath);
  }
}
