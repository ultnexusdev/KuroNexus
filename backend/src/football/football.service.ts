import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { Readable } from 'stream';
import csv = require('csv-parser');
import * as unzipper from 'unzipper';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '../generated/prisma/client';

// transfermarkt-datasets'in resmî yayın kanalı Kaggle'dır (CSV'ler git'te değil).
// Tek dosya indirmesi ZIP olarak döner; stream edilerek açılır.
const KAGGLE_PLAYERS_URL =
  'https://www.kaggle.com/api/v1/datasets/download/davidcariboo/player-scores/players.csv';
const SYNC_STATUS_KEY = 'football:sync:last';

// Apify actor: Türkiye Süper Lig maçları + puan tablosu (kullanıcı seçimi).
// Actor her istekte koşarsa yavaş/pahalı — sonuç ExternalCache'e yazılır,
// public uçlar cache'ten okur (kural 4/14).
const APIFY_ACTOR = 'trovevault~turkey-football-results-tables';
const STANDINGS_KEY = 'football:standings';
const NEXTMATCH_KEY = 'football:nextmatch';
const LEAGUE_SYNC_KEY = 'football:league:sync:last';
const GS_NAME = 'Galatasaray';

interface ApifyMatchRow {
  matchDate?: string;
  homeTeam?: string;
  awayTeam?: string;
  homeScore?: number | null;
  awayScore?: number | null;
  status?: string;
  round?: number | string | null;
  leagueName?: string;
}
// Public getStandings() dönüş tipinde göründüğü için export edilmeli (TS4053).
export interface ApifyStandingRow {
  position?: number;
  teamName?: string;
  points?: number;
  played?: number;
  won?: number;
  drawn?: number;
  lost?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  goalDifference?: number;
}

// Tamamlanmış maçlardan puan tablosu üretir. Sıralama: puan, averaj, atılan gol.
// Not: TFF'nin resmî eşitlik bozma kuralı ikili averajdır; burada genel averaj
// kullanılıyor, eşit puanlı takımlarda sıra resmî tablodan ayrılabilir.
function computeStandings(matches: ApifyMatchRow[]): ApifyStandingRow[] {
  type Row = Required<Omit<ApifyStandingRow, 'position'>>;
  const rows = new Map<string, Row>();
  const rowFor = (team: string): Row => {
    const existing = rows.get(team);
    if (existing) return existing;
    const fresh: Row = {
      teamName: team,
      points: 0,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
    };
    rows.set(team, fresh);
    return fresh;
  };

  for (const m of matches) {
    if ((m.status ?? '').toLowerCase() !== 'finished') continue;
    if (!m.homeTeam || !m.awayTeam) continue;
    if (typeof m.homeScore !== 'number' || typeof m.awayScore !== 'number') {
      continue;
    }

    const home = rowFor(m.homeTeam);
    const away = rowFor(m.awayTeam);
    home.played += 1;
    away.played += 1;
    home.goalsFor += m.homeScore;
    home.goalsAgainst += m.awayScore;
    away.goalsFor += m.awayScore;
    away.goalsAgainst += m.homeScore;

    if (m.homeScore > m.awayScore) {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
    } else if (m.homeScore < m.awayScore) {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
    }
  }

  return [...rows.values()]
    .map((r) => ({ ...r, goalDifference: r.goalsFor - r.goalsAgainst }))
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDifference - a.goalDifference ||
        b.goalsFor - a.goalsFor ||
        a.teamName.localeCompare(b.teamName, 'tr'),
    )
    .map((r, i): ApifyStandingRow => ({ ...r, position: i + 1 }));
}

export interface SquadPlayer {
  id: string; // TM IDs are strings
  name: string;
  age: number | null;
  number: number | null;
  position: string | null;
  photo: string | null;
}

@Injectable()
export class FootballService {
  private readonly logger = new Logger(FootballService.name);
  private readonly teamId: string;
  private readonly season: string;
  private readonly apifyToken?: string;
  private readonly apifySeason: number;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.teamId = this.config.get<string>('TM_TEAM_ID', '141'); // 141 = Galatasaray in TM
    this.season = this.config.get<string>('TM_SEASON', '2024');
    this.apifyToken = this.config.get<string>('APIFY_TOKEN');
    // Sezon başlangıç yılı (2025 = 2025/2026). Coolify'da APIFY_TR_SEASON ile
    // güncellenebilir; verilmezse takvimden mevcut sezon türetilir.
    const now = new Date();
    const derived = now.getUTCMonth() >= 6 ? now.getUTCFullYear() : now.getUTCFullYear() - 1;
    this.apifySeason = Number(
      this.config.get<string>('APIFY_TR_SEASON', String(derived)),
    );
  }

  async getSquad() {
    const players = await this.prisma.tmPlayer.findMany({
      where: { currentClubId: this.teamId },
    });

    const mapped: SquadPlayer[] = players.map(p => {
      let age: number | null = null;
      if (p.dateOfBirth) {
        const ageDifMs = Date.now() - p.dateOfBirth.getTime();
        const ageDate = new Date(ageDifMs);
        age = Math.abs(ageDate.getUTCFullYear() - 1970);
      }

      return {
        id: p.id,
        name: p.name,
        age,
        number: null, // Transfermarkt veri setinde forma numarası yok
        position: p.position ?? p.subPosition ?? null,
        photo: p.imageUrl ?? null,
      };
    });

    return { teamId: this.teamId, players: mapped };
  }

  async getPlayer(playerId: string) {
    const p = await this.prisma.tmPlayer.findUnique({
      where: { id: playerId },
      include: { currentClub: true },
    });

    if (!p) {
      return { season: this.season, player: null, statistics: [] };
    }

    let age: number | null = null;
    if (p.dateOfBirth) {
      const ageDifMs = Date.now() - p.dateOfBirth.getTime();
      const ageDate = new Date(ageDifMs);
      age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    return {
      season: this.season,
      player: {
        id: p.id,
        name: p.name,
        firstname: p.firstName ?? null,
        lastname: p.lastName ?? null,
        age,
        birthDate: p.dateOfBirth ? p.dateOfBirth.toISOString().split('T')[0] : null,
        birthCountry: null, // TM datasetinde birthCountry eksik
        nationality: null, 
        height: p.heightInCm ? `${p.heightInCm} cm` : null,
        weight: null,
        photo: p.imageUrl ?? null,
      },
      // Kapsamlı istatistikler TM games tablosundan türetilebilir
      // Ancak performans için şimdilik temel boş tablo dönüyoruz.
      statistics: [],
    };
  }

  // ---- Transfermarkt veri seti senkronizasyonu ----
  // players.csv stream edilir, yalnızca takımın oyuncuları süzülüp upsert
  // edilir (tam veri seti ~100k satır — hepsini içeri almak gereksiz).
  // İstek-yanıt döngüsünü bloklamasın diye arka planda koşar; sonuç
  // ExternalCache'e yazılır (kural 4/14 ruhu: durum kalıcı ve gözlemlenebilir).

  private syncRunning = false;

  // Haftalık otomatik kadro senkronizasyonu (Pazartesi 04:00 UTC).
  // Kaggle veri seti haftalık güncellendiği için bu aralık yeterli.
  // Kimlik bilgisi yoksa sessizce atlanır (env kurulu değilse patlamaz).
  @Cron('0 4 * * 1', { name: 'football-squad-sync', timeZone: 'UTC' })
  handleWeeklySync() {
    const hasCreds =
      !!this.config.get<string>('KAGGLE_API_TOKEN') ||
      (!!this.config.get<string>('KAGGLE_USERNAME') &&
        !!this.config.get<string>('KAGGLE_KEY'));
    if (!hasCreds) {
      this.logger.warn(
        'Haftalık kadro sync atlandı: Kaggle kimlik bilgisi yok',
      );
      return;
    }
    this.logger.log('Haftalık kadro sync tetikleniyor');
    this.startSquadSync();
  }

  // Puan tablosu + sonraki maç: her gün 05:00 UTC tazelenir (tablo maç günü
  // değişir, sayaç günlük güncel kalmalı). Apify token yoksa sessizce atlanır.
  @Cron('0 5 * * *', { name: 'football-league-sync', timeZone: 'UTC' })
  handleDailyLeagueSync() {
    if (!this.apifyToken) return;
    this.logger.log('Günlük Süper Lig sync tetikleniyor');
    this.startLeagueSync();
  }

  async getSyncStatus() {
    const last = await this.prisma.externalCache.findUnique({
      where: { cacheKey: SYNC_STATUS_KEY },
    });
    return {
      running: this.syncRunning,
      last: last?.payload ?? null,
      lastAt: last?.fetchedAt ?? null,
    };
  }

  // ---- Süper Lig: puan tablosu + sonraki maç (Apify) ----

  async getStandings() {
    const row = await this.prisma.externalCache.findUnique({
      where: { cacheKey: STANDINGS_KEY },
    });
    const payload = row?.payload as {
      season?: number;
      table?: ApifyStandingRow[];
    } | null;
    return {
      season: payload?.season ?? null,
      table: payload?.table ?? [],
      updatedAt: row?.fetchedAt ?? null,
    };
  }

  async getNextMatch() {
    const row = await this.prisma.externalCache.findUnique({
      where: { cacheKey: NEXTMATCH_KEY },
    });
    return {
      match: row?.payload ?? null,
      updatedAt: row?.fetchedAt ?? null,
    };
  }

  private leagueSyncRunning = false;

  async getLeagueSyncStatus() {
    const last = await this.prisma.externalCache.findUnique({
      where: { cacheKey: LEAGUE_SYNC_KEY },
    });
    return {
      running: this.leagueSyncRunning,
      last: last?.payload ?? null,
      lastAt: last?.fetchedAt ?? null,
    };
  }

  startLeagueSync(seasonOverride?: number) {
    if (this.leagueSyncRunning) return { status: 'ALREADY_RUNNING' };
    if (!this.apifyToken) return { status: 'NO_APIFY_TOKEN' };
    this.leagueSyncRunning = true;
    void this.runLeagueSync(seasonOverride)
      .catch(async (error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.error(`Süper Lig sync hatası: ${message}`);
        await this.upsertCache(LEAGUE_SYNC_KEY, { ok: false, error: message });
      })
      .finally(() => {
        this.leagueSyncRunning = false;
      });
    return { status: 'STARTED' };
  }

  private async runLeagueSync(seasonOverride?: number) {
    const season = seasonOverride ?? this.apifySeason;
    this.logger.log(`Süper Lig sync başladı (sezon ${season})`);
    let items = await this.runApifyActor(season);
    let usedSeason = season;

    // Sezon arası boşluk: istenen sezon hiç veri döndürmüyorsa bir öncekini dene
    // (ör. Temmuz'da 2026/27 fikstürü henüz yayımlanmamış olur).
    if (items.length === 0 && seasonOverride === undefined) {
      this.logger.warn(`Sezon ${season} boş, ${season - 1} deneniyor`);
      items = await this.runApifyActor(season - 1);
      usedSeason = season - 1;
    }

    // Teşhis: ham veri şeklini kayda al (frontend'i doğru kurmak için)
    const diag = {
      usedSeason,
      totalItems: items.length,
      sampleKeys: items[0] ? Object.keys(items[0]) : [],
      sample: items.slice(0, 2),
    };

    const matches = items.filter(
      (i): i is ApifyMatchRow => 'matchDate' in i && !!(i as ApifyMatchRow).matchDate,
    );
    // Actor "Matches" ve "Standings" diye İKİ ayrı çıktı tablosu üretir;
    // run-sync-get-dataset-items yalnızca default (Matches) dataset'ini döndürür.
    // Bu yüzden puan tablosunu maç sonuçlarından kendimiz hesaplıyoruz
    // (actor'ın kendi tablosu da aynı şekilde tamamlanmış maçlardan üretiliyor).
    // Standings satırları ileride default dataset'e düşerse onları tercih ederiz.
    const actorStandings = items
      .filter(
        (i): i is ApifyStandingRow =>
          'teamName' in i && typeof (i as ApifyStandingRow).position === 'number',
      )
      .sort((a, b) => (a.position ?? 99) - (b.position ?? 99));
    const standings =
      actorStandings.length > 0 ? actorStandings : computeStandings(matches);

    // Sonraki GS maçı: bugünden sonraki, henüz oynanmamış en yakın maç
    const now = Date.now();
    const gsUpcoming = matches
      .filter((m) => m.homeTeam === GS_NAME || m.awayTeam === GS_NAME)
      .filter((m) => {
        const t = new Date(m.matchDate as string).getTime();
        const unplayed =
          m.homeScore == null ||
          m.awayScore == null ||
          (m.status ?? '').toLowerCase() !== 'finished';
        return t >= now - 3 * 3600_000 && unplayed; // 3s tolerans (canlı maç)
      })
      .sort(
        (a, b) =>
          new Date(a.matchDate as string).getTime() -
          new Date(b.matchDate as string).getTime(),
      );
    const nextMatch = gsUpcoming[0]
      ? {
          date: gsUpcoming[0].matchDate,
          home: gsUpcoming[0].homeTeam,
          away: gsUpcoming[0].awayTeam,
          round: gsUpcoming[0].round ?? null,
          league: gsUpcoming[0].leagueName ?? 'Süper Lig',
        }
      : null;

    if (standings.length > 0) {
      await this.upsertCache(STANDINGS_KEY, { season: usedSeason, table: standings });
    }
    await this.upsertCache(NEXTMATCH_KEY, nextMatch);
    await this.upsertCache(LEAGUE_SYNC_KEY, {
      ok: true,
      standings: standings.length,
      nextMatch: !!nextMatch,
      diag,
    });
    this.logger.log(
      `Süper Lig sync bitti: ${standings.length} takım, sonraki maç ${nextMatch ? 'var' : 'yok'}`,
    );
  }

  private async runApifyActor(
    season: number,
  ): Promise<Array<ApifyMatchRow | ApifyStandingRow>> {
    // run-sync-get-dataset-items: actor'ı çalıştırıp dataset satırlarını döndürür
    const url = `https://api.apify.com/v2/acts/${APIFY_ACTOR}/run-sync-get-dataset-items?token=${this.apifyToken}&timeout=180`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leagues: ['super-lig'],
        season,
        includeMatches: true,
        includeStandings: true,
        maxMatches: 600,
      }),
      signal: AbortSignal.timeout(190_000),
    });
    if (!res.ok) {
      throw new Error(`APIFY.HTTP_${res.status}`);
    }
    return (await res.json()) as Array<ApifyMatchRow | ApifyStandingRow>;
  }

  private async upsertCache(key: string, payload: unknown) {
    await this.prisma.externalCache.upsert({
      where: { cacheKey: key },
      create: { cacheKey: key, payload: payload as Prisma.InputJsonValue },
      update: {
        payload: payload as Prisma.InputJsonValue,
        fetchedAt: new Date(),
      },
    });
  }

  startSquadSync() {
    if (this.syncRunning) {
      return { status: 'ALREADY_RUNNING' };
    }
    this.syncRunning = true;
    void this.runSquadSync()
      .catch(async (error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.error(`Transfermarkt sync hatası: ${message}`);
        await this.writeSyncStatus({ ok: false, error: message });
      })
      .finally(() => {
        this.syncRunning = false;
      });
    return { status: 'STARTED' };
  }

  private async runSquadSync() {
    this.logger.log(`Transfermarkt sync başladı (takım ${this.teamId})`);
    const rows = await this.collectSquadRows();
    if (rows.length === 0) {
      throw new Error('SYNC.NO_ROWS_FOR_TEAM');
    }

    // FK için önce kulüp kaydı — adı veri setindeki güncel adla yazılır
    const clubName = rows[0].currentClubName ?? 'Galatasaray';
    await this.prisma.tmClub.upsert({
      where: { id: this.teamId },
      create: { id: this.teamId, name: clubName },
      update: { name: clubName },
    });

    for (const row of rows) {
      const { currentClubName: _ignored, ...player } = row;
      await this.prisma.tmPlayer.upsert({
        where: { id: player.id },
        create: player,
        update: player,
      });
    }

    // Kadrodan ayrılanlar: veri setinde artık bu kulüpte görünmeyenler temizlenir
    const ids = rows.map((r) => r.id);
    await this.prisma.tmPlayer.updateMany({
      where: { currentClubId: this.teamId, id: { notIn: ids } },
      data: { currentClubId: null },
    });

    await this.writeSyncStatus({ ok: true, imported: rows.length });
    this.logger.log(`Transfermarkt sync bitti: ${rows.length} oyuncu`);
  }

  private async collectSquadRows(): Promise<
    Array<{
      id: string;
      name: string;
      firstName: string | null;
      lastName: string | null;
      dateOfBirth: Date | null;
      position: string | null;
      subPosition: string | null;
      foot: string | null;
      heightInCm: number | null;
      marketValueInEur: number | null;
      imageUrl: string | null;
      url: string | null;
      lastSeason: string | null;
      currentClubId: string;
      currentClubName: string | null;
    }>
  > {
    // Yeni tip Kaggle erişim token'ı (KGAT_..., Bearer) tercih edilir;
    // eski kullanıcıadı+key ikilisi de desteklenir (Basic)
    const accessToken = this.config.get<string>('KAGGLE_API_TOKEN');
    const username = this.config.get<string>('KAGGLE_USERNAME');
    const key = this.config.get<string>('KAGGLE_KEY');
    let authHeader: string;
    if (accessToken) {
      authHeader = `Bearer ${accessToken}`;
    } else if (username && key) {
      authHeader =
        'Basic ' + Buffer.from(`${username}:${key}`).toString('base64');
    } else {
      throw new Error('SYNC.KAGGLE_CREDENTIALS_MISSING');
    }

    // fetch yönlendirmeleri izler (Kaggle -> imzalı depolama URL'i)
    const res = await fetch(KAGGLE_PLAYERS_URL, {
      headers: { Authorization: authHeader },
      signal: AbortSignal.timeout(180_000),
    });
    if (!res.ok || !res.body) {
      throw new Error(`SYNC.HTTP_${res.status}`);
    }

    const teamId = this.teamId;
    const rows: Awaited<ReturnType<FootballService['collectSquadRows']>> = [];

    await new Promise<void>((resolve, reject) => {
      const nodeStream = Readable.fromWeb(
        res.body as import('stream/web').ReadableStream,
      );
      // Endpoint auth tipine göre ZIP ya da düz CSV dönebiliyor — ilk
      // baytlardan ("PK") biçim koklanır
      peekStream(nodeStream, 4)
        .then((head) => {
          const isZip = head[0] === 0x50 && head[1] === 0x4b;
          const source = isZip
            ? nodeStream.pipe(unzipper.ParseOne(/\.csv$/))
            : nodeStream;
          source
            .pipe(csv())
            .on('data', (row: Record<string, string>) => {
              if (!row.player_id || row.current_club_id !== teamId) return;
              rows.push({
                id: row.player_id,
                name: row.name,
                firstName: row.first_name || null,
                lastName: row.last_name || null,
                dateOfBirth: parseDate(row.date_of_birth),
                position: row.position || null,
                subPosition: row.sub_position || null,
                foot: row.foot || null,
                heightInCm: parseNumber(row.height_in_cm),
                marketValueInEur: parseNumber(row.market_value_in_eur),
                imageUrl: row.image_url || null,
                url: row.url || null,
                lastSeason: row.last_season || null,
                currentClubId: teamId,
                currentClubName: row.current_club_name || null,
              });
            })
            .on('end', () => resolve())
            .on('error', reject);
        })
        .catch(reject);
    });

    // Veri seti eski oyuncuları da "son kulübüyle" tutar (ör. yıllar önce
    // ayrılanlar). Gerçek kadro = en güncel last_season değerine sahip olanlar.
    const maxSeason = rows.reduce(
      (max, r) => Math.max(max, parseNumber(r.lastSeason ?? '') ?? 0),
      0,
    );
    return rows.filter(
      (r) => (parseNumber(r.lastSeason ?? '') ?? 0) === maxSeason,
    );
  }

  private async writeSyncStatus(payload: Record<string, unknown>) {
    await this.prisma.externalCache.upsert({
      where: { cacheKey: SYNC_STATUS_KEY },
      create: {
        cacheKey: SYNC_STATUS_KEY,
        payload: payload as Prisma.InputJsonValue,
      },
      update: {
        payload: payload as Prisma.InputJsonValue,
        fetchedAt: new Date(),
      },
    });
  }
}

// Akışın başından n baytı tüketmeden okur (biçim koklama için)
function peekStream(stream: Readable, n: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const tryRead = () => {
      const chunk = stream.read(n) as Buffer | null;
      if (chunk) {
        stream.unshift(chunk);
        resolve(chunk);
      } else {
        stream.once('readable', tryRead);
      }
    };
    stream.once('error', reject);
    tryRead();
  });
}

function parseDate(value: string | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function parseNumber(value: string | undefined): number | null {
  if (!value) return null;
  const n = Number(value);
  return isNaN(n) ? null : n;
}
