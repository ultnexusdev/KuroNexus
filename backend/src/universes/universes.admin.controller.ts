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
import { UniversesService } from './universes.service';
import { CreateUniverseDto } from './dto/create-universe.dto';
import { UpdateUniverseDto } from './dto/update-universe.dto';

@Roles('ADMIN')
@Controller('admin/universes')
export class UniversesAdminController {
  constructor(private readonly universesService: UniversesService) {}

  @Get()
  findAll() {
    return this.universesService.findAllForAdmin();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.universesService.findByIdForAdmin(id);
  }

  @Post()
  create(@Body() dto: CreateUniverseDto) {
    return this.universesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUniverseDto) {
    return this.universesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.universesService.softDelete(id);
  }
}
