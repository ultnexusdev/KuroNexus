import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slugify';
import { sanitizeStoryContent } from '../common/utils/sanitize-story-content';
import { CreateWikiEntryDto } from './dto/create-wiki-entry.dto';
import { UpdateWikiEntryDto } from './dto/update-wiki-entry.dto';
import type { Prisma } from '../generated/prisma/client';

const LIST_SELECT = {
  id: true,
  title: true,
  slug: true,
  category: true,
  coverImage: true,
  spoilerTier: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.WikiEntrySelect;

@Injectable()
export class WikiService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Public ---

  findByUniverseSlug(universeSlug: string) {
    return this.prisma.wikiEntry.findMany({
      where: {
        isDeleted: false,
        universe: { slug: universeSlug, isDeleted: false },
      },
      orderBy: { title: 'asc' },
      select: LIST_SELECT,
    });
  }

  async findBySlug(universeSlug: string, entrySlug: string) {
    const entry = await this.prisma.wikiEntry.findFirst({
      where: {
        slug: entrySlug,
        isDeleted: false,
        universe: { slug: universeSlug, isDeleted: false },
      },
      include: {
        universe: { select: { slug: true, name: true } },
      },
    });
    if (!entry) {
      throw new NotFoundException('WIKI.NOT_FOUND');
    }
    return entry;
  }

  // --- Admin ---

  findAllForAdmin(universeId?: string) {
    return this.prisma.wikiEntry.findMany({
      where: {
        isDeleted: false,
        ...(universeId ? { universeId } : {}),
      },
      orderBy: { updatedAt: 'desc' },
      select: {
        ...LIST_SELECT,
        universe: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async findByIdForAdmin(id: string) {
    const entry = await this.prisma.wikiEntry.findFirst({
      where: { id, isDeleted: false },
    });
    if (!entry) {
      throw new NotFoundException('WIKI.NOT_FOUND');
    }
    return entry;
  }

  async create(dto: CreateWikiEntryDto, userId: string) {
    const slug = await this.buildUniqueSlug(dto.title, dto.universeId);
    return this.prisma.wikiEntry.create({
      data: {
        title: dto.title,
        slug,
        content: sanitizeStoryContent(dto.content),
        category: dto.category,
        coverImage: dto.coverImage,
        spoilerTier: dto.spoilerTier,
        universeId: dto.universeId,
        userId,
      },
    });
  }

  async update(id: string, dto: UpdateWikiEntryDto) {
    const existing = await this.findByIdForAdmin(id);
    const universeId = dto.universeId ?? existing.universeId;

    const data: Prisma.WikiEntryUncheckedUpdateInput = {
      title: dto.title,
      content: dto.content ? sanitizeStoryContent(dto.content) : undefined,
      category: dto.category,
      coverImage: dto.coverImage,
      spoilerTier: dto.spoilerTier,
      universeId: dto.universeId,
    };

    // Başlık veya evren değiştiyse slug hedef evrende yeniden üretilir
    if (
      (dto.title && dto.title !== existing.title) ||
      universeId !== existing.universeId
    ) {
      data.slug = await this.buildUniqueSlug(
        dto.title ?? existing.title,
        universeId,
        id,
      );
    }

    return this.prisma.wikiEntry.update({ where: { id }, data });
  }

  // Soft delete + slug serbest bırakma (AGENTS.md kural 3 + 14)
  async softDelete(id: string) {
    const existing = await this.findByIdForAdmin(id);
    return this.prisma.wikiEntry.update({
      where: { id },
      data: {
        isDeleted: true,
        slug: `${existing.slug}-deleted-${Date.now()}`,
      },
    });
  }

  // Slug evren başına benzersizdir (@@unique([universeId, slug]))
  private async buildUniqueSlug(
    title: string,
    universeId: string,
    excludeId?: string,
  ): Promise<string> {
    const base = slugify(title) || 'entry';
    let candidate = base;
    let counter = 2;
    for (;;) {
      const clash = await this.prisma.wikiEntry.findFirst({
        where: {
          universeId,
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
