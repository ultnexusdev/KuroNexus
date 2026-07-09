import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slugify';
import { sanitizeStoryContent } from '../common/utils/sanitize-story-content';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import type { Prisma } from '../generated/prisma/client';

const LIST_SELECT = {
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
export class StoriesService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Public ---

  findPublished() {
    return this.prisma.story.findMany({
      where: {
        isPublished: true,
        isDeleted: false,
        isCommunitySubmission: false,
      },
      orderBy: { publishedAt: 'desc' },
      select: LIST_SELECT,
    });
  }

  async findPublishedBySlug(slug: string) {
    const story = await this.prisma.story.findFirst({
      where: {
        slug,
        isPublished: true,
        isDeleted: false,
        isCommunitySubmission: false,
      },
      include: {
        universe: { select: { slug: true, name: true } },
      },
    });
    if (!story) {
      throw new NotFoundException('STORIES.NOT_FOUND');
    }
    return story;
  }

  // --- Admin ---

  findAllForAdmin() {
    return this.prisma.story.findMany({
      where: { isDeleted: false },
      orderBy: { updatedAt: 'desc' },
      select: LIST_SELECT,
    });
  }

  async findByIdForAdmin(id: string) {
    const story = await this.prisma.story.findFirst({
      where: { id, isDeleted: false },
    });
    if (!story) {
      throw new NotFoundException('STORIES.NOT_FOUND');
    }
    return story;
  }

  async create(dto: CreateStoryDto, userId: string) {
    const slug = await this.buildUniqueSlug(dto.title);
    return this.prisma.story.create({
      data: {
        title: dto.title,
        slug,
        content: sanitizeStoryContent(dto.content),
        excerpt: dto.excerpt,
        coverImage: dto.coverImage,
        universeId: dto.universeId,
        isPublished: dto.isPublished ?? false,
        publishedAt: dto.isPublished ? new Date() : null,
        userId,
      },
    });
  }

  async update(id: string, dto: UpdateStoryDto) {
    const existing = await this.findByIdForAdmin(id);

    const data: Prisma.StoryUncheckedUpdateInput = {
      title: dto.title,
      content: dto.content ? sanitizeStoryContent(dto.content) : undefined,
      excerpt: dto.excerpt,
      coverImage: dto.coverImage,
      universeId: dto.universeId,
      isPublished: dto.isPublished,
    };

    // Başlık değiştiyse slug yeniden üretilir
    if (dto.title && dto.title !== existing.title) {
      data.slug = await this.buildUniqueSlug(dto.title, id);
    }

    // İlk kez yayınlanıyorsa publishedAt set edilir
    if (dto.isPublished === true && !existing.publishedAt) {
      data.publishedAt = new Date();
    }

    return this.prisma.story.update({ where: { id }, data });
  }

  // Soft delete + slug serbest bırakma (AGENTS.md kural 3 + 14)
  async softDelete(id: string) {
    const existing = await this.findByIdForAdmin(id);
    return this.prisma.story.update({
      where: { id },
      data: {
        isDeleted: true,
        slug: `${existing.slug}-deleted-${Date.now()}`,
      },
    });
  }

  private async buildUniqueSlug(
    title: string,
    excludeId?: string,
  ): Promise<string> {
    const base = slugify(title) || 'story';
    let candidate = base;
    let counter = 2;
    for (;;) {
      const clash = await this.prisma.story.findFirst({
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
