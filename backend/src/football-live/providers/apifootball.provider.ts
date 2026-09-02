import { Logger } from '@nestjs/common';
import {
  normalizeTeamKey,
  type FootballProvider,
  type LiveMatch,
  type LiveMatchStatus,
  type LivePlayerSeasonStats,
  type LiveSquadPlayer,
  type ProviderCapabilities,
} from './types';

/**
 * Sağlayıcı 3 — API-Football (v3.football.api-sports.io). CANLI + İSTATİSTİK.
 *
 * ── DURUM: ANAHTAR VAR, PLAN YETMİYOR ────────────────────────────────────
 * `API_FOOTBALL_KEY` 19 Ağustos 2026'da ölçüldü. Hesap geçerli (Free plan,
 * günde 100 istek, 2027-07-15'e kadar aktif) ama sezon kilitli:
 *
 *   GET /fixtures?team=645&season=2026
 *   → {"errors":{"plan":"Free plans do not have access to this season,
 *                        try from 2022 to 2024."}}
 *
 * ⚠️ `GET /leagues?id=203` YANILTICI: 2026 sezonunu `current: true` ve tam
 * kapsamlı (`events`, `lineups`, `statistics_players`) diye listeliyor. O
 * liste PLANIN DEĞİL LİGİN kapsamı. Gerçek testi her zaman `/fixtures` ile
 * yap — ilk turda `/leagues` çıktısına bakıp "çalışıyor" sanıldı.
 *
 * ── BU YÜZDEN YETENEK BİLDİRİMİ ÇALIŞMA ANINDA ÖLÇÜLÜYOR ─────────────────
 * `probe()` bir kez gerçek bir fikstür isteği atıp planın hedef sezonu verip
 * vermediğini görüyor. Vermiyorsa bütün yetenekler KAPALI kalıyor ve servis
 * bu adaptörü hiç çağırmıyor — "çağır, patlarsa yut" denemesi yok, çünkü
 * ücretsiz kota günde 100 istek ve boşa harcanacak bütçe yok.
 *
 * Plan yükseltildiği an bu dosyada DEĞİŞİKLİK GEREKMİYOR: `probe()` bir
 * sonraki senkronda 200 alır, yetenekler açılır, canlı dakika ve oyuncu
 * istatistikleri sayfaya kendiliğinden düşer.
 */

const HOST = 'https://v3.football.api-sports.io';
/** Galatasaray (TheSportsDB kaydı da bunu doğruluyor: idAPIfootball 645) */
export const AF_GALATASARAY = 645;

export interface ApiFootballOptions {
  apiKey: string;
  /** Sezon başlangıç yılı: 2026 = 2026/27 */
  season: number;
  teamId?: number;
}

export class ApiFootballProvider implements FootballProvider {
  readonly name = 'apifootball';
  private readonly logger = new Logger(ApiFootballProvider.name);

  /** null = henüz ölçülmedi, false = plan yetmiyor, true = kullanılabilir */
  private planCovers: boolean | null = null;

  constructor(private readonly options: ApiFootballOptions) {}

  capabilities(): ProviderCapabilities {
    const ok = this.planCovers === true;
    return {
      standings: ok,
      fixtures: ok,
      // Bu adaptörün asıl değeri burada: TFF ve Vikipedi'nin veremediği iki şey.
      liveScore: ok,
      squad: ok,
      playerSeasonStats: ok,
      scorers: ok,
    };
  }

  /**
   * Planın hedef sezonu kapsayıp kapsamadığını BİR KEZ ölçer.
   * Sonuç bellekte tutuluyor; süreç yeniden başlarsa yeniden ölçülüyor
   * (plan yükseltmesi ancak o zaman fark edilir — kabul edilebilir gecikme,
   * senkron zaten günde bir koşuyor).
   */
  async probe(): Promise<boolean> {
    if (this.planCovers !== null) return this.planCovers;
    if (!this.options.apiKey) {
      this.planCovers = false;
      return false;
    }

    try {
      const team = this.options.teamId ?? AF_GALATASARAY;
      const body = await this.get<unknown>(
        `/fixtures?team=${team}&season=${this.options.season}&last=1`,
      );
      const errors = (body as { errors?: unknown }).errors;
      // API hata için 200 döndürüp gövdeye `errors` koyuyor. Boş DİZİ = hata yok;
      // dolu NESNE = hata var. İkisini de aynı alanda gönderdiği için tip kontrolü şart.
      const hasError =
        errors !== undefined &&
        !Array.isArray(errors) &&
        Object.keys(errors as Record<string, unknown>).length > 0;

      if (hasError) {
        this.logger.warn(
          `API-Football planı ${this.options.season} sezonunu vermiyor: ${JSON.stringify(errors)}`,
        );
        this.planCovers = false;
      } else {
        this.planCovers = true;
        this.logger.log(
          `API-Football planı ${this.options.season} sezonunu kapsıyor — canlı ve oyuncu istatistiği açık`,
        );
      }
    } catch (error) {
      this.logger.warn(
        `API-Football yoklaması başarısız: ${error instanceof Error ? error.message : String(error)}`,
      );
      this.planCovers = false;
    }
    return this.planCovers;
  }

  /**
   * Şu an oynanan maç. Boş dizi = canlı maç yok (hata DEĞİL).
   * `live=all` + takım süzgeci: tek istekle takımın canlı maçı geliyor.
   */
  async fetchLive(clubKey: string): Promise<LiveMatch[]> {
    if (!(await this.probe())) return [];
    const team = this.options.teamId ?? AF_GALATASARAY;
    const body = await this.get<AfFixtureResponse>(
      `/fixtures?live=all&team=${team}`,
    );
    return (body.response ?? [])
      .map((f) => toLiveMatch(f))
      .filter((m) => m.home.key === clubKey || m.away.key === clubKey);
  }

  async fetchClubFixtures(clubKey: string): Promise<LiveMatch[]> {
    if (!(await this.probe())) return [];
    const team = this.options.teamId ?? AF_GALATASARAY;
    const body = await this.get<AfFixtureResponse>(
      `/fixtures?team=${team}&season=${this.options.season}`,
    );
    return (body.response ?? [])
      .map((f) => toLiveMatch(f))
      .filter((m) => m.home.key === clubKey || m.away.key === clubKey);
  }

  /**
   * Kadro + sezon istatistiği. Bu, TFF'nin veremediği ve sayfanın "oyuncu
   * kartı arka yüzü" ile "sezonun öne çıkanları" bölümlerini besleyen veri.
   */
  // Parametre almıyor ama sözleşmede var: takım kimliği yapılandırmadan
  // (`API_FOOTBALL_TEAM_ID`) geliyor, kulüp anahtarından değil. Yapısal
  // uyumluluk için imzayı daraltmak yeterli.
  async fetchSquad(): Promise<LiveSquadPlayer[]> {
    if (!(await this.probe())) return [];
    const team = this.options.teamId ?? AF_GALATASARAY;

    const out: LiveSquadPlayer[] = [];
    // Oyuncu istatistiği sayfalı geliyor; 20'şerli sayfalar, kadro ~30 kişi.
    for (let page = 1; page <= 3; page += 1) {
      const body = await this.get<AfPlayersResponse>(
        `/players?team=${team}&season=${this.options.season}&page=${page}`,
      );
      for (const row of body.response ?? []) {
        const stat = row.statistics?.[0];
        out.push({
          id: `af:${row.player.id}`,
          name: row.player.name,
          position: stat?.games?.position ?? null,
          shirtNumber: stat?.games?.number ?? null,
          photo: row.player.photo ?? null,
          nationality: row.player.nationality ?? null,
          birthDate: row.player.birth?.date ?? null,
          season: toSeasonStats(stat),
        });
      }
      const total = body.paging?.total ?? 1;
      if (page >= total) break;
    }
    return out;
  }

  private async get<T>(path: string): Promise<T> {
    const res = await fetch(`${HOST}${path}`, {
      headers: {
        'x-apisports-key': this.options.apiKey,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) throw new Error(`APIFOOTBALL.HTTP_${res.status}`);
    return (await res.json()) as T;
  }
}

// ---- Biçim çevirisi --------------------------------------------------------

/**
 * API-Football durum kodlarını ara biçime çevirir.
 * NS=başlamadı, 1H/2H/ET/P=oynanıyor, HT=devre arası, FT/AET/PEN=bitti.
 */
function toStatus(short: string | undefined): LiveMatchStatus {
  switch (short) {
    case '1H':
    case '2H':
    case 'ET':
    case 'P':
    case 'BT':
      return 'LIVE';
    case 'HT':
      return 'HALFTIME';
    case 'FT':
    case 'AET':
    case 'PEN':
      return 'FINISHED';
    case 'PST':
      return 'POSTPONED';
    case 'CANC':
    case 'ABD':
      return 'CANCELLED';
    default:
      return 'SCHEDULED';
  }
}

function toLiveMatch(f: AfFixture): LiveMatch {
  const status = toStatus(f.fixture?.status?.short);
  return {
    id: `af:${f.fixture?.id ?? ''}`,
    kickoffAt: f.fixture?.date ?? null,
    // API-Football tarihi her zaman tam zaman damgası olarak veriyor; gün
    // ondan türetiliyor. (Vikipedi'de tersi olabiliyor: gün var, saat yok.)
    kickoffDate: f.fixture?.date ? f.fixture.date.slice(0, 10) : null,
    competition: f.league?.name ?? 'Bilinmiyor',
    round: f.league?.round ?? null,
    home: {
      name: f.teams?.home?.name ?? '',
      key: normalizeTeamKey(f.teams?.home?.name ?? ''),
      crest: f.teams?.home?.logo ?? null,
    },
    away: {
      name: f.teams?.away?.name ?? '',
      key: normalizeTeamKey(f.teams?.away?.name ?? ''),
      crest: f.teams?.away?.logo ?? null,
    },
    homeGoals: f.goals?.home ?? null,
    awayGoals: f.goals?.away ?? null,
    status,
    minute:
      status === 'LIVE' || status === 'HALFTIME'
        ? (f.fixture?.status?.elapsed ?? null)
        : null,
    venue: f.fixture?.venue?.name ?? null,
    source: 'apifootball',
  };
}

function toSeasonStats(stat: AfPlayerStat | undefined): LivePlayerSeasonStats {
  return {
    appearances: stat?.games?.appearences ?? null,
    minutes: stat?.games?.minutes ?? null,
    goals: stat?.goals?.total ?? null,
    assists: stat?.goals?.assists ?? null,
    yellowCards: stat?.cards?.yellow ?? null,
    redCards: stat?.cards?.red ?? null,
    // Rating dize geliyor ("7.083333"); sayıya çevrilemiyorsa null.
    rating: stat?.games?.rating ? Number(stat.games.rating) || null : null,
  };
}

// ---- Ham yanıt tipleri (yalnızca kullandığımız alanlar) --------------------

interface AfFixtureResponse {
  response?: AfFixture[];
}

interface AfFixture {
  fixture?: {
    id?: number;
    date?: string;
    venue?: { name?: string };
    status?: { short?: string; elapsed?: number | null };
  };
  league?: { name?: string; round?: string };
  teams?: {
    home?: { name?: string; logo?: string };
    away?: { name?: string; logo?: string };
  };
  goals?: { home?: number | null; away?: number | null };
}

interface AfPlayersResponse {
  response?: Array<{
    player: {
      id: number;
      name: string;
      photo?: string;
      nationality?: string;
      birth?: { date?: string };
    };
    statistics?: AfPlayerStat[];
  }>;
  paging?: { current?: number; total?: number };
}

interface AfPlayerStat {
  games?: {
    appearences?: number | null;
    minutes?: number | null;
    number?: number | null;
    position?: string | null;
    rating?: string | null;
  };
  goals?: { total?: number | null; assists?: number | null };
  cards?: { yellow?: number | null; red?: number | null };
}
