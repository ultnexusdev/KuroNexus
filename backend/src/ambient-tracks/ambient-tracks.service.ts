import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAmbientTrackDto } from './dto/create-ambient-track.dto';
import { UpdateAmbientTrackDto } from './dto/update-ambient-track.dto';

@Injectable()
export class AmbientTracksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAmbientTrackDto: CreateAmbientTrackDto) {
    return this.prisma.ambientTrack.create({
      data: createAmbientTrackDto,
    });
  }

  async findAll() {
    return this.prisma.ambientTrack.findMany({
      orderBy: [{ universeId: 'asc' }, { order: 'asc' }],
      include: {
        universe: { select: { name: true, slug: true } },
      },
    });
  }

  // İçinde en az bir parça olan evrenler — player'ın çalma listesi seçicisi için
  async findPlaylists() {
    return this.prisma.wikiUniverse.findMany({
      where: { isDeleted: false, ambientTracks: { some: {} } },
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
    });
  }

  async findAllByUniverse(universeSlug: string) {
    return this.prisma.ambientTrack.findMany({
      where: { universe: { slug: universeSlug } },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const track = await this.prisma.ambientTrack.findUnique({
      where: { id },
      include: {
        universe: { select: { name: true, slug: true } },
      },
    });
    if (!track) {
      throw new NotFoundException('AMBIENT_TRACK.NOT_FOUND');
    }
    return track;
  }

  async update(id: string, updateAmbientTrackDto: UpdateAmbientTrackDto) {
    await this.findOne(id); // Ensure exists
    return this.prisma.ambientTrack.update({
      where: { id },
      data: updateAmbientTrackDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure exists
    return this.prisma.ambientTrack.delete({
      where: { id },
    });
  }
}
