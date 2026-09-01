import { Injectable, NotFoundException } from '@nestjs/common';
import { buildUniqueSlug } from '../common/utils/unique-slug';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUniverseDto } from './dto/create-universe.dto';
import { UpdateUniverseDto } from './dto/update-universe.dto';
import type { Prisma } from '../generated/prisma/client';

const LIST_SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  coverImage: true,
  createdAt: true,
  updatedAt: true,
  categoryId: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
} satisfies Prisma.WikiUniverseSelect;

const STORY_SUMMARY_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImage: true,
  isPublished: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  orderIndex: true,
} satisfies Prisma.StorySelect;

@Injectable()
export class UniversesService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Public ---

  findAll() {
    return this.prisma.wikiUniverse.findMany({
      where: { isDeleted: false },
      orderBy: { name: 'asc' },
      select: LIST_SELECT,
    });
  }

  async findPublishedBySlug(slug: string) {
    const universe = await this.prisma.wikiUniverse.findFirst({
      where: { slug, isDeleted: false },
      select: {
        ...LIST_SELECT,
        stories: {
          where: {
            isPublished: true,
            isDeleted: false,
            isCommunitySubmission: false,
          },
          // Kitap bölümleri okuma sırasına göre listelenir; sırası verilmemiş
          // eski kayıtlar (orderIndex = 0) yayın tarihine düşer.
          orderBy: [{ orderIndex: 'asc' }, { publishedAt: 'asc' }],
          select: STORY_SUMMARY_SELECT,
        },
      },
    });
    if (!universe) {
      throw new NotFoundException('UNIVERSES.NOT_FOUND');
    }
    return universe;
  }

  // --- Admin ---

  findAllForAdmin() {
    return this.prisma.wikiUniverse.findMany({
      where: { isDeleted: false },
      orderBy: { name: 'asc' },
      select: LIST_SELECT,
    });
  }

  async findByIdForAdmin(id: string) {
    const universe = await this.prisma.wikiUniverse.findFirst({
      where: { id, isDeleted: false },
    });
    if (!universe) {
      throw new NotFoundException('UNIVERSES.NOT_FOUND');
    }
    return universe;
  }

  async create(dto: CreateUniverseDto) {
    const slug = await this.buildUniqueSlug(dto.name);
    return this.prisma.wikiUniverse.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        coverImage: dto.coverImage,
        categoryId: dto.categoryId,
      },
    });
  }

  async update(id: string, dto: UpdateUniverseDto) {
    const existing = await this.findByIdForAdmin(id);

    const data: Prisma.WikiUniverseUpdateInput = {
      name: dto.name,
      description: dto.description,
      coverImage: dto.coverImage,
      ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
    };

    // İsim değiştiyse slug yeniden üretilir (AGENTS.md kural 14 — slug serbestliği)
    if (dto.name && dto.name !== existing.name) {
      data.slug = await this.buildUniqueSlug(dto.name, id);
    }

    return this.prisma.wikiUniverse.update({ where: { id }, data });
  }

  // Soft delete + slug serbest bırakma (AGENTS.md kural 3 + 14)
  async softDelete(id: string) {
    const existing = await this.findByIdForAdmin(id);
    return this.prisma.wikiUniverse.update({
      where: { id },
      data: {
        isDeleted: true,
        slug: `${existing.slug}-deleted-${Date.now()}`,
      },
    });
  }

  private buildUniqueSlug(name: string, excludeId?: string): Promise<string> {
    return buildUniqueSlug(name, 'universe', async (candidate) => {
      const clash = await this.prisma.wikiUniverse.findFirst({
        where: {
          slug: candidate,
          ...(excludeId ? { NOT: { id: excludeId } } : {}),
        },
        select: { id: true },
      });
      return clash !== null;
    });
  }
}
