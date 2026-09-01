import { Injectable, NotFoundException } from '@nestjs/common';
import { buildUniqueSlug } from '../common/utils/unique-slug';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { Prisma } from '../generated/prisma/client';

const LIST_SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  coverImage: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UniverseCategorySelect;

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Public ---

  findAll() {
    return this.prisma.universeCategory.findMany({
      where: { isDeleted: false },
      orderBy: { name: 'asc' },
      select: LIST_SELECT,
    });
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.universeCategory.findFirst({
      where: { slug, isDeleted: false },
      select: LIST_SELECT,
    });
    if (!category) {
      throw new NotFoundException('CATEGORIES.NOT_FOUND');
    }
    return category;
  }

  // --- Admin ---

  findAllForAdmin() {
    return this.prisma.universeCategory.findMany({
      where: { isDeleted: false },
      orderBy: { name: 'asc' },
      select: LIST_SELECT,
    });
  }

  async findByIdForAdmin(id: string) {
    const category = await this.prisma.universeCategory.findFirst({
      where: { id, isDeleted: false },
    });
    if (!category) {
      throw new NotFoundException('CATEGORIES.NOT_FOUND');
    }
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const slug = await this.buildUniqueSlug(dto.name);
    return this.prisma.universeCategory.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        coverImage: dto.coverImage,
      },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const existing = await this.findByIdForAdmin(id);

    let slug = existing.slug;
    if (dto.name && dto.name !== existing.name) {
      slug = await this.buildUniqueSlug(dto.name, existing.id);
    }

    return this.prisma.universeCategory.update({
      where: { id },
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        coverImage: dto.coverImage,
      },
    });
  }

  async remove(id: string) {
    const existing = await this.findByIdForAdmin(id);
    // Soft delete
    return this.prisma.universeCategory.update({
      where: { id: existing.id },
      data: {
        isDeleted: true,
        slug: `${existing.slug}-deleted-${Date.now()}`,
      },
    });
  }

  // --- Helpers ---

  /**
   * ⚠️ DAVRANIŞ DEĞİŞTİ (1 Eylül 2026 denetimi, D-B5). Bu kopya iki yerde
   * ayrışmıştı: sayaç 1'den başlıyordu (ötekiler 2 — yani aynı çakışmada
   * `ad-1` üretiyordu) ve `slugify()` boş dönerse yedek ad olmadığı için
   * BOŞ slug kaydediliyordu. Artık ortak kuralı kullanıyor; mevcut kayıtların
   * slug'ları veritabanında durduğu için etkilenmiyor, değişen yalnızca
   * bundan sonra üretilecekler.
   */
  private buildUniqueSlug(name: string, excludeId?: string): Promise<string> {
    return buildUniqueSlug(name, 'category', async (candidate) => {
      const clash = await this.prisma.universeCategory.findFirst({
        where: {
          slug: candidate,
          ...(excludeId ? { id: { not: excludeId } } : {}),
        },
        select: { id: true },
      });
      return clash !== null;
    });
  }
}
