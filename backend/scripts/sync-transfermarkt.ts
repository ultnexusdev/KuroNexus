import { PrismaClient } from '../src/generated/prisma';
import * as https from 'https';
import * as csv from 'csv-parser';

const prisma = new PrismaClient();

const DATASETS = {
  competitions: 'https://raw.githubusercontent.com/dcaribou/transfermarkt-datasets/master/data/prep/competitions.csv',
  clubs: 'https://raw.githubusercontent.com/dcaribou/transfermarkt-datasets/master/data/prep/clubs.csv',
  players: 'https://raw.githubusercontent.com/dcaribou/transfermarkt-datasets/master/data/prep/players.csv',
  games: 'https://raw.githubusercontent.com/dcaribou/transfermarkt-datasets/master/data/prep/games.csv',
};

function parseDate(dateStr: string): Date | null {
  if (!dateStr || dateStr === '') return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function parseNumber(numStr: string): number | null {
  if (!numStr || numStr === '') return null;
  const num = Number(numStr);
  return isNaN(num) ? null : num;
}

/**
 * Streams a CSV file from URL, parses it, and writes to DB in batches using createMany (skipDuplicates: true)
 */
async function syncTable(
  url: string,
  batchSize: number,
  mapper: (row: any) => any,
  writer: (batch: any[]) => Promise<void>
) {
  return new Promise<void>((resolve, reject) => {
    let batch: any[] = [];
    let count = 0;

    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
      }

      res
        .pipe(csv())
        .on('data', async (data) => {
          try {
            const mapped = mapper(data);
            if (mapped) {
              batch.push(mapped);
            }
          } catch (e) {
            console.error("Mapping error for row:", data, e);
          }

          if (batch.length >= batchSize) {
            res.pause();
            const currentBatch = [...batch];
            batch = [];
            writer(currentBatch).then(() => {
              count += currentBatch.length;
              console.log(`Inserted ${count} rows from ${url}...`);
              res.resume();
            }).catch(reject);
          }
        })
        .on('end', async () => {
          if (batch.length > 0) {
            try {
              await writer(batch);
              count += batch.length;
              console.log(`Inserted ${count} rows from ${url}...`);
            } catch (e) {
              return reject(e);
            }
          }
          resolve();
        })
        .on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  console.log("Starting Transfermarkt Sync...");

  // 1. Sync Competitions
  console.log("Syncing competitions...");
  await syncTable(
    DATASETS.competitions,
    1000,
    (row) => {
      if (!row.competition_id) return null;
      return {
        id: row.competition_id,
        name: row.name,
        type: row.type || null,
        countryName: row.country_name || null,
        domesticLeagueCode: row.domestic_league_code || null,
        confederation: row.confederation || null,
        url: row.url || null,
      };
    },
    async (batch) => {
      await prisma.tmCompetition.createMany({
        data: batch,
        skipDuplicates: true,
      });
    }
  );

  // 2. Sync Clubs
  console.log("Syncing clubs...");
  await syncTable(
    DATASETS.clubs,
    2000,
    (row) => {
      if (!row.club_id) return null;
      return {
        id: row.club_id,
        name: row.name,
        clubCode: row.club_code || null,
        squadSize: parseNumber(row.squad_size),
        averageAge: parseNumber(row.average_age),
        stadiumName: row.stadium_name || null,
        stadiumSeats: parseNumber(row.stadium_seats),
        url: row.url || null,
        domesticCompetitionId: row.domestic_competition_id || null,
      };
    },
    async (batch) => {
      await prisma.tmClub.createMany({
        data: batch,
        skipDuplicates: true,
      });
    }
  );

  // 3. Sync Players
  console.log("Syncing players...");
  await syncTable(
    DATASETS.players,
    5000,
    (row) => {
      if (!row.player_id) return null;
      return {
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
        currentClubId: row.current_club_id || null,
      };
    },
    async (batch) => {
      await prisma.tmPlayer.createMany({
        data: batch,
        skipDuplicates: true,
      });
    }
  );

  // 4. Sync Games
  console.log("Syncing games...");
  await syncTable(
    DATASETS.games,
    5000,
    (row) => {
      if (!row.game_id) return null;
      return {
        id: row.game_id,
        season: row.season || null,
        round: row.round || null,
        date: parseDate(row.date),
        homeClubGoals: parseNumber(row.home_club_goals),
        awayClubGoals: parseNumber(row.away_club_goals),
        stadium: row.stadium || null,
        attendance: parseNumber(row.attendance),
        referee: row.referee || null,
        url: row.url || null,
        competitionId: row.competition_id || null,
        homeClubId: row.home_club_id || null,
        awayClubId: row.away_club_id || null,
      };
    },
    async (batch) => {
      await prisma.tmGame.createMany({
        data: batch,
        skipDuplicates: true,
      });
    }
  );

  console.log("Transfermarkt Sync Completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
