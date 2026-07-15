import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

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
}
