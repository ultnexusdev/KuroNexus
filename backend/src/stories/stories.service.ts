import { Injectable, NotFoundException } from '@nestjs/common';
import { buildUniqueSlug } from '../common/utils/unique-slug';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slugify';
import { sanitizeStoryContent } from '../common/utils/sanitize-story-content';
import {
  buildPlainExcerpt,
  extractEntryIds,
} from '../common/utils/lore-links';
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
  orderIndex: true,
  universeId: true,
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
        // Okuma ekranındaki künye paneli tek istekte dolsun: bölümde geçen
        // kayıtların özeti metinle birlikte gelir, tıklayınca beklenmez.
        entryLinks: {
          where: { entry: { isDeleted: false } },
          select: {
            entry: {
              select: {
                id: true,
                title: true,
                slug: true,
                category: true,
                coverImage: true,
                spoilerTier: true,
                content: true,
              },
            },
          },
        },
      },
    });
    if (!story) {
      throw new NotFoundException('STORIES.NOT_FOUND');
    }

    const { entryLinks, ...rest } = story;
    return {
      ...rest,
      entries: entryLinks
        .map(({ entry }) => ({
          id: entry.id,
          title: entry.title,
          slug: entry.slug,
          category: entry.category,
          coverImage: entry.coverImage,
          spoilerTier: entry.spoilerTier,
          excerpt: buildPlainExcerpt(entry.content),
        }))
        .sort((a, b) => a.title.localeCompare(b.title)),
    };
  }

  // --- Admin ---

  // Evren süzgeci verildiğinde liste el yazması sırasına (orderIndex) düşer;
  // genel admin listesi eskisi gibi son düzenlenen üstte kalır.
  findAllForAdmin(universeId?: string) {
    return this.prisma.story.findMany({
      where: { isDeleted: false, ...(universeId ? { universeId } : {}) },
      orderBy: universeId
        ? [{ orderIndex: 'asc' }, { createdAt: 'asc' }]
        : { updatedAt: 'desc' },
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
    const content = sanitizeStoryContent(dto.content);
    const story = await this.prisma.story.create({
      data: {
        title: dto.title,
        slug,
        content,
        excerpt: dto.excerpt,
        coverImage: dto.coverImage,
        universeId: dto.universeId,
        isPublished: dto.isPublished ?? false,
        publishedAt: dto.isPublished ? new Date() : null,
        orderIndex: dto.orderIndex ?? (await this.nextOrderIndex(dto.universeId)),
        userId,
      },
    });
    await this.syncEntryLinks(story.id, story.universeId, content);
    return story;
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
      orderIndex: dto.orderIndex,
    };

    // Başlık değiştiyse slug yeniden üretilir
    if (dto.title && dto.title !== existing.title) {
      data.slug = await this.buildUniqueSlug(dto.title, id);
    }

    // İlk kez yayınlanıyorsa publishedAt set edilir
    if (dto.isPublished === true && !existing.publishedAt) {
      data.publishedAt = new Date();
    }

    const story = await this.prisma.story.update({ where: { id }, data });

    // İçerik ya da evren değiştiyse lore bağları yeniden türetilir
    if (dto.content !== undefined || dto.universeId !== undefined) {
      await this.syncEntryLinks(story.id, story.universeId, story.content);
    }
    return story;
  }

  // El yazması ağacında sürükle-bırak: dizideki konum yeni orderIndex olur.
  // Tek transaction — yarım kalmış sıra bırakmaz.
  async reorder(ids: string[]): Promise<{ updated: number }> {
    const existing = await this.prisma.story.findMany({
      where: { id: { in: ids }, isDeleted: false },
      select: { id: true },
    });
    const known = new Set(existing.map((story) => story.id));
    const updates = ids
      .filter((id) => known.has(id))
      .map((id, index) =>
        this.prisma.story.update({
          where: { id },
          data: { orderIndex: index + 1 },
        }),
      );
    if (updates.length === 0) {
      throw new NotFoundException('STORIES.NOT_FOUND');
    }
    await this.prisma.$transaction(updates);
    return { updated: updates.length };
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

  // Bölüm ↔ wiki kaydı bağları içerikten türetilir: metindeki her lore işareti
  // aynı evrende yaşayan bir kayda bakıyorsa bağ kurulur, kalanlar silinir.
  // Başka evrenin kaydına yapılan işaret bağ üretmez (kural 6 — veri izolasyonu).
  private async syncEntryLinks(
    storyId: string,
    universeId: string | null,
    content: string,
  ): Promise<void> {
    const referenced = extractEntryIds(content);
    const valid =
      universeId && referenced.length > 0
        ? await this.prisma.wikiEntry.findMany({
            where: { id: { in: referenced }, universeId, isDeleted: false },
            select: { id: true },
          })
        : [];
    const validIds = valid.map((entry) => entry.id);

    await this.prisma.$transaction([
      this.prisma.storyEntryLink.deleteMany({
        where: {
          storyId,
          ...(validIds.length > 0 ? { entryId: { notIn: validIds } } : {}),
        },
      }),
      ...validIds.map((entryId) =>
        this.prisma.storyEntryLink.upsert({
          where: { storyId_entryId: { storyId, entryId } },
          create: { storyId, entryId },
          update: {},
        }),
      ),
    ]);
  }

  // Yeni bölüm evrenin sonuna eklenir (evrensiz hikâyelerde sıra anlamsız).
  private async nextOrderIndex(universeId?: string): Promise<number> {
    if (!universeId) {
      return 0;
    }
    const last = await this.prisma.story.findFirst({
      where: { universeId, isDeleted: false },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    });
    return (last?.orderIndex ?? 0) + 1;
  }

  private buildUniqueSlug(title: string, excludeId?: string): Promise<string> {
    return buildUniqueSlug(title, 'story', async (candidate) => {
      const clash = await this.prisma.story.findFirst({
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
