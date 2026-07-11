import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user';
import { WikiService } from './wiki.service';
import { CreateWikiEntryDto } from './dto/create-wiki-entry.dto';
import { UpdateWikiEntryDto } from './dto/update-wiki-entry.dto';

@Roles('ADMIN')
@Controller('admin/wiki-entries')
export class WikiAdminController {
  constructor(private readonly wikiService: WikiService) {}

  @Get()
  findAll(@Query('universeId') universeId?: string) {
    return this.wikiService.findAllForAdmin(universeId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.wikiService.findByIdForAdmin(id);
  }

  @Post()
  create(
    @Body() dto: CreateWikiEntryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.wikiService.create(dto, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWikiEntryDto) {
    return this.wikiService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wikiService.softDelete(id);
  }
}
