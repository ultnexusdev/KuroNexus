import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { sanitizeStoryContent } from '../common/utils/sanitize-story-content';
import { CreateTransferNewsDto } from './dto/create-transfer-news.dto';
import { UpdateTransferNewsDto } from './dto/update-transfer-news.dto';

// Habere bağlı oyuncunun künyesi TM tablosundan okunur — haber metnine
// kopyalanmaz, böylece sync güncellendiğinde değerler kendiliğinden tazelenir.
const PLAYER_SELECT = {
  id: true,
  name: true,
  position: true,
  subPosition: true,
  imageUrl: true,
  marketValueInEur: true,
  dateOfBirth: true,
} as const;

function age(dateOfBirth: Date | null): number | null {
  if (!dateOfBirth) return null;
  const diff = Date.now() - dateOfBirth.getTime();
  const years = Math.floor(diff / (365.25 * 24 * 3600 * 1000));
  return years > 0 && years < 120 ? years : null;
}

@Injectable()
export class TransferNewsService {
  constructor(private readonly prisma: PrismaService) {}

  private shape(item: {
    id: string;
    title: string;
    body: string;
    sourceUrl: string | null;
    publishedAt: Date;
    universeId: string;
    tmPlayerId: string | null;
    tmPlayer: {
      id: string;
      name: string;
      position: string | null;
      subPosition: string | null;
      imageUrl: string | null;
      marketValueInEur: number | null;
      dateOfBirth: Date | null;
    } | null;
  }) {
    return {
      id: item.id,
      title: item.title,
      body: item.body,
      sourceUrl: item.sourceUrl,
      publishedAt: item.publishedAt,
      universeId: item.universeId,
      tmPlayerId: item.tmPlayerId,
      player: item.tmPlayer
        ? {
            id: item.tmPlayer.id,
            name: item.tmPlayer.name,
            position: item.tmPlayer.subPosition ?? item.tmPlayer.position,
            photo: item.tmPlayer.imageUrl,
            marketValueInEur: item.tmPlayer.marketValueInEur,
            age: age(item.tmPlayer.dateOfBirth),
          }
        : null,
    };
  }

  async create(dto: CreateTransferNewsDto) {
    const created = await this.prisma.transferNews.create({
      data: {
        title: dto.title,
        body: sanitizeStoryContent(dto.body),
        universeId: dto.universeId,
        tmPlayerId: dto.tmPlayerId || null,
        sourceUrl: dto.sourceUrl || null,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : new Date(),
      },
      include: { tmPlayer: { select: PLAYER_SELECT } },
    });
    return this.shape(created);
  }

  async findAll(universeId?: string) {
    const items = await this.prisma.transferNews.findMany({
      where: universeId ? { universeId } : undefined,
      orderBy: { publishedAt: 'desc' },
      include: { tmPlayer: { select: PLAYER_SELECT } },
    });
    return items.map((i) => this.shape(i));
  }

  async findAllByUniverse(slug: string) {
    const universe = await this.prisma.wikiUniverse.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!universe) return [];
    return this.findAll(universe.id);
  }

  async findOne(id: string) {
    const item = await this.prisma.transferNews.findUnique({
      where: { id },
      include: { tmPlayer: { select: PLAYER_SELECT } },
    });
    if (!item) throw new NotFoundException('TRANSFER_NEWS.NOT_FOUND');
    return this.shape(item);
  }

  async update(id: string, dto: UpdateTransferNewsDto) {
    await this.findOne(id);
    const updated = await this.prisma.transferNews.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.body !== undefined
          ? { body: sanitizeStoryContent(dto.body) }
          : {}),
        ...(dto.universeId !== undefined ? { universeId: dto.universeId } : {}),
        ...(dto.tmPlayerId !== undefined
          ? { tmPlayerId: dto.tmPlayerId || null }
          : {}),
        ...(dto.sourceUrl !== undefined
          ? { sourceUrl: dto.sourceUrl || null }
          : {}),
        ...(dto.publishedAt !== undefined
          ? { publishedAt: new Date(dto.publishedAt) }
          : {}),
      },
      include: { tmPlayer: { select: PLAYER_SELECT } },
    });
    return this.shape(updated);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.transferNews.delete({ where: { id } });
    return { ok: true };
  }

  // Admin haber formundaki oyuncu seçici — yerel TM kadrosundan besleniyor
  async searchPlayers(query?: string) {
    const players = await this.prisma.tmPlayer.findMany({
      where: query
        ? { name: { contains: query, mode: 'insensitive' } }
        : undefined,
      orderBy: { name: 'asc' },
      take: 50,
      select: PLAYER_SELECT,
    });
    return players.map((p) => ({
      id: p.id,
      name: p.name,
      position: p.subPosition ?? p.position,
      photo: p.imageUrl,
      marketValueInEur: p.marketValueInEur,
      age: age(p.dateOfBirth),
    }));
  }
}
