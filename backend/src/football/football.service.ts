import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '../generated/prisma/client';

/**
 * API-Sports (API-Football) entegrasyonu — kural 4:
 * - Anahtar yalnızca backend .env'de (FOOTBALL_API_KEY), asla frontend'e sızmaz
 * - Her yanıt ExternalCache'e yazılır; TTL dolmadan dış istek atılmaz
 *   (ücretsiz plan 100 istek/gün — cache zorunlu)
 * - Dış API hata verirse eldeki bayat cache sunulur; hiç veri yoksa sayfa
 *   çökmez, çeviri anahtarlı hata döner
 */

const DAY_MS = 24 * 60 * 60 * 1000;

interface SquadPlayer {
  id: number;
  name: string;
  age: number | null;
  number: number | null;
  position: string | null;
  photo: string | null;
}

@Injectable()
export class FootballService {
  private readonly logger = new Logger(FootballService.name);
  private readonly host: string;
  private readonly teamId: string;
  private readonly season: string;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.host = this.config.get<string>(
      'FOOTBALL_API_HOST',
      'v3.football.api-sports.io',
    );
    this.teamId = this.config.get<string>('FOOTBALL_TEAM_ID', '496');
    // Ücretsiz plan 2022–2024 sezonlarıyla sınırlı; plan yükseltilince
    // Coolify'da FOOTBALL_SEASON güncellenmesi yeterli
    this.season = this.config.get<string>('FOOTBALL_SEASON', '2024');
  }

  async getSquad() {
    const key = `football:squad:${this.teamId}`;
    const payload = await this.cached(key, DAY_MS, async () => {
      const data = await this.fetchFromApi(
        `/players/squads?team=${this.teamId}`,
      );
      const players: SquadPlayer[] = (data.response?.[0]?.players ?? []).map(
        (p: Record<string, unknown>) => ({
          id: p.id,
          name: p.name,
          age: p.age ?? null,
          number: p.number ?? null,
          position: p.position ?? null,
          photo: p.photo ?? null,
        }),
      );
      return { teamId: this.teamId, players };
    });
    return payload;
  }

  async getPlayer(playerId: string) {
    const key = `football:player:${playerId}:${this.season}`;
    const payload = await this.cached(key, DAY_MS, async () => {
      const data = await this.fetchFromApi(
        `/players?id=${encodeURIComponent(playerId)}&season=${this.season}`,
      );
      const entry = data.response?.[0];
      if (!entry) {
        return { season: this.season, player: null, statistics: [] };
      }
      const p = entry.player ?? {};
      const stats = (entry.statistics ?? []).map(
        (s: Record<string, any>) => ({
          league: s.league?.name ?? null,
          leagueLogo: s.league?.logo ?? null,
          team: s.team?.name ?? null,
          appearances: s.games?.appearences ?? 0,
          lineups: s.games?.lineups ?? 0,
          minutes: s.games?.minutes ?? 0,
          position: s.games?.position ?? null,
          rating: s.games?.rating ?? null,
          shotsTotal: s.shots?.total ?? null,
          shotsOn: s.shots?.on ?? null,
          goals: s.goals?.total ?? 0,
          assists: s.goals?.assists ?? 0,
          conceded: s.goals?.conceded ?? null,
          saves: s.goals?.saves ?? null,
          passesTotal: s.passes?.total ?? null,
          passesKey: s.passes?.key ?? null,
          passAccuracy: s.passes?.accuracy ?? null,
          cardsYellow: s.cards?.yellow ?? 0,
          cardsRed: (s.cards?.red ?? 0) + (s.cards?.yellowred ?? 0),
        }),
      );
      return {
        season: this.season,
        player: {
          id: p.id,
          name: p.name,
          firstname: p.firstname ?? null,
          lastname: p.lastname ?? null,
          age: p.age ?? null,
          birthDate: p.birth?.date ?? null,
          birthCountry: p.birth?.country ?? null,
          nationality: p.nationality ?? null,
          height: p.height ?? null,
          weight: p.weight ?? null,
          photo: p.photo ?? null,
        },
        statistics: stats,
      };
    });
    return payload;
  }

  // ---- cache + fetch altyapısı ----

  private async cached(
    key: string,
    ttlMs: number,
    fetcher: () => Promise<unknown>,
  ): Promise<unknown> {
    const existing = await this.prisma.externalCache.findUnique({
      where: { cacheKey: key },
    });
    const fresh =
      existing && Date.now() - existing.fetchedAt.getTime() < ttlMs;
    if (existing && fresh) {
      return existing.payload;
    }
    try {
      const payload = await fetcher();
      await this.prisma.externalCache.upsert({
        where: { cacheKey: key },
        create: {
          cacheKey: key,
          payload: payload as Prisma.InputJsonValue,
        },
        update: {
          payload: payload as Prisma.InputJsonValue,
          fetchedAt: new Date(),
        },
      });
      return payload;
    } catch (error) {
      this.logger.error(
        `Dış API hatası (${key}): ${error instanceof Error ? error.message : error}`,
      );
      if (existing) {
        // Bayat da olsa eldeki veri, hatadan iyidir (kural 14)
        return existing.payload;
      }
      throw new ServiceUnavailableException('FOOTBALL.UPSTREAM_ERROR');
    }
  }

  private async fetchFromApi(path: string): Promise<any> {
    const apiKey = this.config.get<string>('FOOTBALL_API_KEY');
    if (!apiKey) {
      throw new Error('FOOTBALL.API_KEY_MISSING');
    }
    const res = await fetch(`https://${this.host}${path}`, {
      headers: { 'x-apisports-key': apiKey },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      throw new Error(`FOOTBALL.HTTP_${res.status}`);
    }
    const data = (await res.json()) as {
      errors?: unknown;
      response?: any;
    };
    // API-Sports hataları 200 gövdesinde "errors" alanıyla döndürür
    if (
      data.errors &&
      ((Array.isArray(data.errors) && data.errors.length > 0) ||
        (typeof data.errors === 'object' &&
          Object.keys(data.errors as object).length > 0))
    ) {
      throw new Error(`FOOTBALL.API_ERROR: ${JSON.stringify(data.errors)}`);
    }
    return data;
  }
}
