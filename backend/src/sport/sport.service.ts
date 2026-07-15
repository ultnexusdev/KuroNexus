import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSportPlayerDto } from './dto/create-sport-player.dto';
import { CreateSportLegendDto } from './dto/create-sport-legend.dto';
import { CreateRaceEventDto } from './dto/create-race-event.dto';
import { CreateDriverStandingDto } from './dto/create-driver-standing.dto';
import {
  UpdateDriverStandingDto,
  UpdateRaceEventDto,
  UpdateSportLegendDto,
  UpdateSportPlayerDto,
} from './dto/update-dtos';

@Injectable()
export class SportService {
  constructor(private readonly prisma: PrismaService) {}

  // ---- Public: bir evrenin tüm spor verisi tek pakette ----
  async findBundleBySlug(universeSlug: string) {
    const universe = await this.prisma.wikiUniverse.findFirst({
      where: { slug: universeSlug, isDeleted: false },
      select: { id: true },
    });
    if (!universe) {
      throw new NotFoundException('SPORT.UNIVERSE_NOT_FOUND');
    }
    const where = { universeId: universe.id, isDeleted: false };
    const [players, legends, races, standings] = await Promise.all([
      this.prisma.sportPlayer.findMany({
        where,
        orderBy: [{ order: 'asc' }, { shirtNumber: 'asc' }],
      }),
      this.prisma.sportLegend.findMany({
        where,
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      }),
      this.prisma.raceEvent.findMany({
        where,
        orderBy: { round: 'asc' },
      }),
      this.prisma.driverStanding.findMany({
        where,
        orderBy: { position: 'asc' },
      }),
    ]);
    return { players, legends, races, standings };
  }

  // ---- Admin: SportPlayer ----
  findPlayers(universeId?: string) {
    return this.prisma.sportPlayer.findMany({
      where: { isDeleted: false, ...(universeId && { universeId }) },
      orderBy: [{ order: 'asc' }, { shirtNumber: 'asc' }],
      include: { universe: { select: { name: true, slug: true } } },
    });
  }

  createPlayer(dto: CreateSportPlayerDto) {
    return this.prisma.sportPlayer.create({ data: dto });
  }

  async updatePlayer(id: string, dto: UpdateSportPlayerDto) {
    await this.ensureExists('sportPlayer', id);
    return this.prisma.sportPlayer.update({ where: { id }, data: dto });
  }

  async removePlayer(id: string) {
    await this.ensureExists('sportPlayer', id);
    return this.prisma.sportPlayer.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  // ---- Admin: SportLegend ----
  findLegends(universeId?: string) {
    return this.prisma.sportLegend.findMany({
      where: { isDeleted: false, ...(universeId && { universeId }) },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      include: { universe: { select: { name: true, slug: true } } },
    });
  }

  createLegend(dto: CreateSportLegendDto) {
    return this.prisma.sportLegend.create({ data: dto });
  }

  async updateLegend(id: string, dto: UpdateSportLegendDto) {
    await this.ensureExists('sportLegend', id);
    return this.prisma.sportLegend.update({ where: { id }, data: dto });
  }

  async removeLegend(id: string) {
    await this.ensureExists('sportLegend', id);
    return this.prisma.sportLegend.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  // ---- Admin: RaceEvent ----
  findRaces(universeId?: string) {
    return this.prisma.raceEvent.findMany({
      where: { isDeleted: false, ...(universeId && { universeId }) },
      orderBy: { round: 'asc' },
      include: { universe: { select: { name: true, slug: true } } },
    });
  }

  createRace(dto: CreateRaceEventDto) {
    return this.prisma.raceEvent.create({ data: dto });
  }

  async updateRace(id: string, dto: UpdateRaceEventDto) {
    await this.ensureExists('raceEvent', id);
    return this.prisma.raceEvent.update({ where: { id }, data: dto });
  }

  async removeRace(id: string) {
    await this.ensureExists('raceEvent', id);
    return this.prisma.raceEvent.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  // ---- Admin: DriverStanding ----
  findStandings(universeId?: string) {
    return this.prisma.driverStanding.findMany({
      where: { isDeleted: false, ...(universeId && { universeId }) },
      orderBy: { position: 'asc' },
      include: { universe: { select: { name: true, slug: true } } },
    });
  }

  createStanding(dto: CreateDriverStandingDto) {
    return this.prisma.driverStanding.create({ data: dto });
  }

  async updateStanding(id: string, dto: UpdateDriverStandingDto) {
    await this.ensureExists('driverStanding', id);
    return this.prisma.driverStanding.update({ where: { id }, data: dto });
  }

  async removeStanding(id: string) {
    await this.ensureExists('driverStanding', id);
    return this.prisma.driverStanding.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  private async ensureExists(
    model: 'sportPlayer' | 'sportLegend' | 'raceEvent' | 'driverStanding',
    id: string,
  ) {
    // Prisma delegate'leri union olarak çağrılamadığı için tek tek ele alınır
    let found: { id: string } | null = null;
    if (model === 'sportPlayer') {
      found = await this.prisma.sportPlayer.findFirst({
        where: { id, isDeleted: false },
        select: { id: true },
      });
    } else if (model === 'sportLegend') {
      found = await this.prisma.sportLegend.findFirst({
        where: { id, isDeleted: false },
        select: { id: true },
      });
    } else if (model === 'raceEvent') {
      found = await this.prisma.raceEvent.findFirst({
        where: { id, isDeleted: false },
        select: { id: true },
      });
    } else {
      found = await this.prisma.driverStanding.findFirst({
        where: { id, isDeleted: false },
        select: { id: true },
      });
    }
    if (!found) {
      throw new NotFoundException('SPORT.RECORD_NOT_FOUND');
    }
  }
}
