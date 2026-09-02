import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { Prisma } from '../../generated/prisma/client';

/**
 * `ExternalCache` tablosunun TEK kapısı (D-B7, 2 Eylül 2026).
 *
 * Dış kaynak anlık görüntüleri (TMDB, AniList, Jikan, Google Books, Spotify,
 * MusicBrainz, TFF…) tek tabloda `cacheKey → payload + fetchedAt` olarak
 * duruyor. 1 Eylül denetimine kadar her servis kendi okuma/yazma kopyasını
 * taşıyordu: `writeCache` 5 kopya, `Date.now() - fetchedAt < ttl` 22 yerde —
 * ve bir kopyada `create` bloğunda `fetchedAt` unutulmuştu. Davranış burada
 * tek: TTL penceresi `fetchedAt` üzerinden, yazma her zaman `fetchedAt: now`.
 *
 * Üç temel işlem + bir kalıp:
 *  - `read`      → kayıt (yaşı ne olursa olsun) ya da null
 *  - `readFresh` → yalnız TTL içindeyse
 *  - `write`     → upsert, `fetchedAt` şimdi
 *  - `remember`  → "taze ise dön; değilse çek, yaz, dön; çekemezsen bayatı
 *                   sun (varsa), yoksa hatayı yükselt" — kural 4/14'ün kodu.
 *
 * Kasıtlı olarak SADE: anahtar adlandırması, TTL değerleri ve dönüşüm
 * çağıranın işi; burası ne ne zaman tazelenir bilmez. Liste/sayaç gibi özel
 * okumalar (`findMany`, `count`, `deleteMany`) Prisma'da kalır — onlar
 * "cache kalıbı" değil tablo sorgusu.
 */

export interface CacheHit<T> {
  payload: T;
  fetchedAt: Date;
  /** `now - fetchedAt`, ms */
  ageMs: number;
}

export interface RememberOptions<T> {
  /**
   * Dış istek düştü ve bayat kayıt var: kayıt sunulmadan önce çağrılır
   * (uyarı logu için). Verilmezse bayat kayıt sessizce sunulur.
   */
  onStale?: (error: unknown, hit: CacheHit<T>) => void;
  /**
   * `false` verilirse bayat kayıt SUNULMAZ, hata yükselir (varsayılan `true`:
   * dış kaynak düşünce eski veri hatadan iyidir — kural 4).
   */
  staleOnError?: boolean;
}

@Injectable()
export class ExternalCacheService {
  constructor(private readonly prisma: PrismaService) {}

  /** Kayıt, yaşına bakılmaksızın. */
  async read<T>(cacheKey: string): Promise<CacheHit<T> | null> {
    const row = await this.prisma.externalCache.findUnique({
      where: { cacheKey },
    });
    if (!row) {
      return null;
    }
    return {
      payload: row.payload as unknown as T,
      fetchedAt: row.fetchedAt,
      ageMs: Date.now() - row.fetchedAt.getTime(),
    };
  }

  /** Yalnız TTL penceresi içindeyse (`age < ttlMs`); değilse null. */
  async readFresh<T>(cacheKey: string, ttlMs: number): Promise<T | null> {
    const hit = await this.read<T>(cacheKey);
    return hit && isFresh(hit, ttlMs) ? hit.payload : null;
  }

  /** Upsert; `fetchedAt` her iki dalda da şimdi (eski kopyaların tuzağı). */
  async write<T>(cacheKey: string, payload: T): Promise<void> {
    const json = payload as unknown as Prisma.InputJsonValue;
    const fetchedAt = new Date();
    await this.prisma.externalCache.upsert({
      where: { cacheKey },
      create: { cacheKey, payload: json, fetchedAt },
      update: { payload: json, fetchedAt },
    });
  }

  /**
   * Taze → dön. Değilse `fetcher` → yaz → dön. `fetcher` düşerse: bayat kayıt
   * varsa (ve `staleOnError !== false`) `onStale` çağrılıp o sunulur; yoksa
   * hata olduğu gibi yükselir — çağıran kendi yedeğine karar verir.
   */
  async remember<T>(
    cacheKey: string,
    ttlMs: number,
    fetcher: () => Promise<T>,
    options: RememberOptions<T> = {},
  ): Promise<T> {
    const hit = await this.read<T>(cacheKey);
    if (hit && isFresh(hit, ttlMs)) {
      return hit.payload;
    }
    try {
      const payload = await fetcher();
      await this.write(cacheKey, payload);
      return payload;
    } catch (error) {
      if (hit && options.staleOnError !== false) {
        options.onStale?.(error, hit);
        return hit.payload;
      }
      throw error;
    }
  }
}

function isFresh<T>(hit: CacheHit<T>, ttlMs: number): boolean {
  return hit.ageMs < ttlMs;
}
