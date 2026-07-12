import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { CategoriesService } from './categories.service';

@Controller('universe-categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }
}
