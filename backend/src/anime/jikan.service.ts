import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Jikan (MyAnimeList'in resmi olmayan API'si) — **yalnızca bölüm listesi**.
 *
 * Neden ayrı kaynak: AniList bölüm bölüm veri vermiyor; filler/recap bayrağı
 * yalnızca MAL tarafında var ve anime arşivinde en çok istenen şeylerden biri.
 *
 * **Kırılgan kaynak**: MAL'a bağlı olduğu için zaman zaman 504/429 dönüyor
 * (denemede bir kez görüldü). Bu yüzden her şey cache'lenir, hata yutulur ve
 * sayfa filler bilgisi olmadan açılır — bölüm ızgarası yine çalışır.
 */

const JIKAN_BASE = 'https://api.jikan.moe/v4';
// Biten yapımın bölüm listesi değişmez; devam edende yeni bölüm eklenir
const EPISODES_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const AIRING_EPISODES_TTL_MS = 12 * 60 * 60 * 1000;
// Jikan sayfa başına 100 bölüm veriyor; 500 bölümlük seride 5 sayfa eder
const MAX_PAGES = 12;
// Rate limit (3 istek/sn) — sayfalar arası küçük bir nefes
const PAGE_DELAY_MS = 400;

export interface JikanEpisode {
  number: number;
  title: string | null;
  filler: boolean;
  recap: boolean;
}

interface JikanEpisodesResponse {
  data?: Array<{
    mal_id?: number;
    title?: string;
    filler?: boolean;
    recap?: boolean;
  }>;
  pagination?: { last_visible_page?: number; has_next_page?: boolean };
}

@Injectable()
export class JikanService {
  private readonly logger = new Logger(JikanService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Bir yapımın bütün bölümleri (filler/recap bayraklarıyla).
   *
   * `isAiring` yalnızca cache ömrünü belirler: devam eden yapımda liste
   * haftalık büyüdüğü için kısa tutulur.
   */
  async episodes(malId: number, isAiring = false): Promise<JikanEpisode[]> {
    const cacheKey = `jikan:episodes:${malId}`;
    const cached = await this.prisma.externalCache.findUnique({
      where: { cacheKey },
    });
    const ttl = isAiring ? AIRING_EPISODES_TTL_MS : EPISODES_TTL_MS;
    if (cached && Date.now() - cached.fetchedAt.getTime() < ttl) {
      return cached.payload as unknown as JikanEpisode[];
    }

    try {
      const episodes = await this.fetchAllPages(malId);
      // Boş liste cache'lenmez: kaynak geçici düşmüş olabilir, bir dahakine
      // gerçekten dolu gelsin (bölümsüz yapımlarda maliyet zaten düşük)
      if (episodes.length > 0) {
        const payload = episodes as unknown as object;
        await this.prisma.externalCache.upsert({
          where: { cacheKey },
          create: { cacheKey, payload, fetchedAt: new Date() },
          update: { payload, fetchedAt: new Date() },
        });
      }
      return episodes;
    } catch (error) {
      if (cached) {
        this.logger.warn(
          `Jikan ${malId} yenilenemedi, bayat cache sunuluyor: ${String(error)}`,
        );
        return cached.payload as unknown as JikanEpisode[];
      }
      this.logger.warn(
        `Jikan ${malId} bölüm listesi alınamadı: ${String(error)}`,
      );
      return [];
    }
  }

  private async fetchAllPages(malId: number): Promise<JikanEpisode[]> {
    const episodes: JikanEpisode[] = [];
    let page = 1;
    let lastPage = 1;

    while (page <= lastPage && page <= MAX_PAGES) {
      const response = await fetch(
        `${JIKAN_BASE}/anime/${malId}/episodes?page=${page}`,
        { headers: { accept: 'application/json' } },
      );
      if (!response.ok) {
        // İlk sayfa düşerse hiç veri yok; sonrakilerde eldekiyle yetinilir
        if (page === 1) {
          throw new Error(`Jikan ${response.status}`);
        }
        break;
      }
      const payload = (await response.json()) as JikanEpisodesResponse;
      for (const item of payload.data ?? []) {
        episodes.push({
          number: item.mal_id ?? episodes.length + 1,
          title: item.title ?? null,
          filler: Boolean(item.filler),
          recap: Boolean(item.recap),
        });
      }
      lastPage = payload.pagination?.last_visible_page ?? page;
      page += 1;
      if (page <= lastPage && page <= MAX_PAGES) {
        await sleep(PAGE_DELAY_MS);
      }
    }

    return episodes.sort((a, b) => a.number - b.number);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
