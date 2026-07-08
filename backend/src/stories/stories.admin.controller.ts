import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user';
import { StoriesService } from './stories.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';

@Roles('ADMIN')
@Controller('admin/stories')
export class StoriesAdminController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get()
  findAll() {
    return this.storiesService.findAllForAdmin();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.storiesService.findByIdForAdmin(id);
  }

  @Post()
  create(@Body() dto: CreateStoryDto, @CurrentUser() user: AuthenticatedUser) {
    return this.storiesService.create(dto, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStoryDto) {
    return this.storiesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storiesService.softDelete(id);
  }
}
