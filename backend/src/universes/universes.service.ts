import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slugify';
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
          orderBy: { publishedAt: 'desc' },
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

  private async buildUniqueSlug(
    name: string,
    excludeId?: string,
  ): Promise<string> {
    const base = slugify(name) || 'universe';
    let candidate = base;
    let counter = 2;
    for (;;) {
      const clash = await this.prisma.wikiUniverse.findFirst({
        where: {
          slug: candidate,
          ...(excludeId ? { NOT: { id: excludeId } } : {}),
        },
        select: { id: true },
      });
      if (!clash) {
        return candidate;
      }
      candidate = `${base}-${counter}`;
      counter += 1;
    }
  }
}
