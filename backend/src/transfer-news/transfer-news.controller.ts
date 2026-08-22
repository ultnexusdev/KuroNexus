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
import { TransferNewsService } from './transfer-news.service';
import { CreateTransferNewsDto } from './dto/create-transfer-news.dto';
import { UpdateTransferNewsDto } from './dto/update-transfer-news.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('transfer-news')
export class TransferNewsController {
  constructor(private readonly transferNews: TransferNewsService) {}

  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateTransferNewsDto) {
    return this.transferNews.create(dto);
  }

  @Roles('ADMIN')
  @Get()
  findAll(@Query('universeId') universeId?: string) {
    return this.transferNews.findAll(universeId);
  }

  // Parametrik ':id' route'undan ÖNCE tanımlanmalı (bkz. ambient-tracks deseni)
  @Roles('ADMIN')
  @Get('players')
  searchPlayers(@Query('q') q?: string) {
    return this.transferNews.searchPlayers(q);
  }

  /* GET /universe/:slug 2026-08-22'de KALDIRILDI (kullanıcı onayı): tek
     tüketicisi olan fetchTransferNews frontend'den silindi — kulüp sayfası
     haberleri football-live yanıtının içinde alıyor. */

  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transferNews.findOne(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransferNewsDto) {
    return this.transferNews.update(id, dto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transferNews.remove(id);
  }
}
