import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { AnimeService } from './anime.service';
import { JikanService } from './jikan.service';
import type { AnilistMedia } from './anilist.service';

/**
 * Haftalık arşiv tazelemesi.
 *
 * Neden gerekli: "devam ediyor / yeni sezon bekleniyor" rozeti ve sıradaki
 * bölümün geri sayımı dış veriden okunuyor. Elle ⟳ basmayı beklersek yeni
 * sezon duyurulduğunda arşiv bunu haftalarca fark etmez.
 *
 * Yalnızca **hareketli** kayıtlar tazelenir: yayını süren ya da devamı
 * duyurulmuş seriler. Biten seriler zaten değişmiyor, onlara dokunulmaz —
 * her Pazartesi bütün arşivi AniList'e sormak gereksiz yük olurdu.
 */
@Injectable()
export class AnimeCron {
  private readonly logger = new Logger(AnimeCron.name);
  private running = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly anime: AnimeService,
    private readonly jikan: JikanService,
  ) {}

  // Pazartesi 05:00 UTC — futbol sync'inin (04:00) hemen ardında
  @Cron('0 5 * * 1', { timeZone: 'UTC' })
  async refreshActive(): Promise<void> {
    if (this.running) {
      this.logger.warn('Anime tazelemesi zaten çalışıyor, bu tur atlandı');
      return;
    }
    this.running = true;
    try {
      const archive = await this.anime.getArchive();
      const active = archive.entries.filter(
        (entry) =>
          entry.airingState === 'RELEASING' ||
          entry.airingState === 'UPCOMING' ||
          entry.status === 'WATCHING',
      );

      let refreshed = 0;
      for (const entry of active) {
        try {
          await this.anime.refresh(entry.id);
          refreshed += 1;
        } catch (error) {
          // Bir seri düşerse tur devam eder; ertesi hafta tekrar denenir
          this.logger.warn(
            `Anime tazelenemedi (${entry.title}): ${String(error)}`,
          );
        }
      }

      const episodes = await this.fillMissingEpisodeLists();
      this.logger.log(
        `Haftalık anime tazelemesi: ${refreshed}/${active.length} seri, ${episodes} bölüm listesi`,
      );
    } finally {
      this.running = false;
    }
  }

  /**
   * Jikan kırılgan bir kaynak (MAL'a bağlı, 504 verebiliyor). Sayfa açılışında
   * boş dönen bölüm listelerini burada sessizce doldurmayı deniyoruz — böylece
   * filler bilgisi ilk denemede gelmese de bir hafta içinde yerine oturuyor.
   */
  private async fillMissingEpisodeLists(): Promise<number> {
    const parts = await this.prisma.animePart.findMany({
      where: { malId: { not: null } },
      select: { malId: true, externalData: true, entry: { select: { status: true } } },
    });

    let filled = 0;
    for (const part of parts) {
      if (!part.malId) {
        continue;
      }
      const cached = await this.prisma.externalCache.findUnique({
        where: { cacheKey: `jikan:episodes:${part.malId}` },
        select: { cacheKey: true },
      });
      if (cached) {
        continue;
      }
      const media = (part.externalData ?? null) as AnilistMedia | null;
      const episodes = await this.jikan.episodes(
        part.malId,
        media?.status === 'RELEASING',
      );
      if (episodes.length > 0) {
        filled += 1;
      }
    }
    return filled;
  }
}
