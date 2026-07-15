import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';
import csv = require('csv-parser');
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '../generated/prisma/client';

const PLAYERS_CSV_URL =
  'https://raw.githubusercontent.com/dcaribou/transfermarkt-datasets/master/data/prep/players.csv';
const SYNC_STATUS_KEY = 'football:sync:last';

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

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.teamId = this.config.get<string>('TM_TEAM_ID', '141'); // 141 = Galatasaray in TM
    this.season = this.config.get<string>('TM_SEASON', '2024');
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

  private collectSquadRows(): Promise<
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
    const teamId = this.teamId;
    return new Promise((resolve, reject) => {
      const rows: Awaited<ReturnType<FootballService['collectSquadRows']>> =
        [];
      const request = https.get(PLAYERS_CSV_URL, (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`SYNC.HTTP_${res.statusCode}`));
        }
        res
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
          .on('end', () => resolve(rows))
          .on('error', reject);
      });
      request.on('error', reject);
      request.setTimeout(120_000, () => {
        request.destroy(new Error('SYNC.TIMEOUT'));
      });
    });
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
