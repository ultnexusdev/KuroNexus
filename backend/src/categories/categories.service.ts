import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slugify';
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

  private async buildUniqueSlug(name: string, excludeId?: string): Promise<string> {
    const baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await this.prisma.universeCategory.findFirst({
        where: {
          slug,
          ...(excludeId ? { id: { not: excludeId } } : {}),
        },
      });
      if (!existing) break;

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}
