import { randomBytes } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
 * ── SSRF SAVUNMASI ────────────────────────────────────────────────────────
 * Adresler bize Spotify'ın yanıtından geliyor, yani "güvenilir" görünüyor —
 * ama yanıtı doğrulamadan izlemek, kaynağın bizi iç ağa yönlendirmesine
 * kapı bırakır. Savunma `book-cover.service.ts`teki ile birebir:
 *   1. yalnızca http/https
 *   2. host beyaz listesi
 *   3. yönlendirme elle takip ediliyor ve HER sıçrama listeden yeniden geçiyor
 *   4. uzantı içerik imzasından seçiliyor (adres uydurulabilir, imza uydurulamaz)
 *   5. boyut sınırı ve zaman aşımı
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

/** Kapaklar küçük; bu sınır kötü niyetli bir "sonsuz gövde"ye karşı. */
const MAX_BYTES = 8 * 1024 * 1024;

const REQUEST_TIMEOUT_MS = 15_000;

/**
 * Spotify kapakları doğrudan dosyayı gösteriyor, zincir beklemiyoruz. Sınır
 * yine de var: dönüp duran bir yönlendirme isteği sonsuza dek tutmasın.
 */
const MAX_REDIRECTS = 2;

/** Uzantı **içeriğe** göre seçilir, adrese göre değil. */
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
    ext: '.webp',
    test: (b) =>
      b.length > 12 &&
      b.toString('ascii', 0, 4) === 'RIFF' &&
      b.toString('ascii', 8, 12) === 'WEBP',
  },
];

@Injectable()
export class MusicArtworkService implements OnModuleInit {
  private readonly logger = new Logger(MusicArtworkService.name);
  private readonly artworkDir: string;
  /**
   * Yerelleştirme kapatılabilir olsun diye bayrak var (varsayılan açık).
   * Gerekçe: Spotify'ın geliştirici şartları görselin süresiz yerel
   * kopyalanmasına sıcak bakmıyor; karar bir gün değişirse okuma yolu
   * `artworkSourceUrl`e döner ve bu tek değişkenle geçiş yapılır — kod
   * değişikliği gerekmez.
   */
  private readonly localizeEnabled: boolean;

  constructor(config: ConfigService) {
    this.artworkDir = join(
      config.get<string>('UPLOAD_DIR', './uploads'),
      'music',
    );
    this.localizeEnabled =
      config.get<string>('MUSIC_ARTWORK_LOCALIZE', '1') !== '0';
  }

  async onModuleInit(): Promise<void> {
    await mkdir(this.artworkDir, { recursive: true });
  }

  isLocalizeEnabled(): boolean {
    return this.localizeEnabled;
  }

  /**
   * Uzak görseli indirir ve yerel yolunu döndürür ("/uploads/music/…").
   *
   * **Asla fırlatmaz.** Kapak inmediği için albümün arşive girememesi kabul
   * edilemez (kural 4: eksik alan sayfayı bozmaz). Başarısızlıkta `null`
   * döner; çağıran `artworkFetchedAt`i `null` bırakır ve bir sonraki cron
   * turu eksiği yeniden dener — ayrı bir retry kuyruğu tablosuna gerek yok.
   *
   * Zaten yerel olan bir adres dokunulmadan geri döner: geri doldurma aynı
   * kapağı ikinci kez indirmesin.
   */
  async download(remoteUrl: string | null | undefined): Promise<string | null> {
    if (!remoteUrl) {
      return null;
    }
    if (remoteUrl.startsWith('/uploads/')) {
      return remoteUrl;
    }
    if (!this.localizeEnabled) {
      return null;
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
      this.logger.warn(`Görsel indirilmedi, izinsiz sunucu: ${url.hostname}`);
      return null;
    }

    try {
      const response = await this.request(url);
      if (!response) {
        return null;
      }
      if (!response.ok) {
        this.logger.warn(
          `Görsel indirilemedi (${response.status}): ${url.href}`,
        );
        return null;
      }

      // Sunucunun bildirdiği uzunluğa güvenilmiyor; gövde okunduktan sonra
      // gerçek boyut da sınanıyor
      const declared = Number(response.headers.get('content-length') ?? '0');
      if (declared > MAX_BYTES) {
        this.logger.warn(`Görsel çok büyük (${declared} bayt): ${url.href}`);
        return null;
      }
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.byteLength === 0 || bytes.byteLength > MAX_BYTES) {
        return null;
      }

      const extension = detectExtension(bytes);
      if (!extension) {
        this.logger.warn(`Görsel değil, atlandı: ${url.href}`);
        return null;
      }

      /**
       * Dosya adı her indirmede yeni. `app.module.ts` `/uploads/*` yolunu bir
       * yıllık `immutable` önbellekle sunuyor ve o sözün geçerlilik şartı tam
       * olarak bu: var olan bir ada ASLA üzerine yazılmaz.
       */
      const filename = `${Date.now()}-${randomBytes(8).toString('hex')}${extension}`;
      await writeFile(join(this.artworkDir, filename), bytes);
      return `/uploads/music/${filename}`;
    } catch (error) {
      this.logger.warn(`Görsel indirilemedi: ${url.href} — ${String(error)}`);
      return null;
    }
  }

  /**
   * Kayıt silinirken ya da görsel değişirken eski dosyayı temizler. Dosya
   * yoksa sessiz geçer — yetim kayıt yüzünden işlem durmamalı.
   */
  async remove(localPath: string | null | undefined): Promise<void> {
    if (!localPath?.startsWith('/uploads/music/')) {
      return;
    }
    const filename = localPath.slice('/uploads/music/'.length);
    // Yol kaçışına ("../") karşı: dosya adı düz olmalı
    if (!/^[A-Za-z0-9._-]+$/.test(filename)) {
      return;
    }
    await unlink(join(this.artworkDir, filename)).catch(() => undefined);
  }

  /** İsteği atar, yönlendirmeleri elle ve süzgeçten geçirerek takip eder. */
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
        this.logger.warn(`Görsel yönlendirmesi çok uzun: ${url.href}`);
        return null;
      }

      const location = response.headers.get('location');
      if (!location) {
        this.logger.warn(`Görsel yönlendirmesi adressiz: ${target.href}`);
        return null;
      }

      let next: URL;
      try {
        next = new URL(location, target);
      } catch {
        return null;
      }
      if (next.protocol !== 'https:' && next.protocol !== 'http:') {
        return null;
      }
      /* Asıl savunma bu satır: her sıçrama beyaz listeden yeniden geçiyor,
         yani zincirin ortasındaki bir sunucu isteği iç ağa (169.254.169.254
         gibi) yönlendiremiyor. */
      if (!isAllowedHost(next.hostname)) {
        this.logger.warn(
          `Görsel yönlendirmesi izinsiz sunucuya: ${next.hostname}`,
        );
        return null;
      }
      target = next;
    }
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
