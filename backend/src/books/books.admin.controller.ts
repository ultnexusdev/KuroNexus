import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user';
import { BooksService } from './books.service';
import { CreateBookEntryDto } from './dto/create-book-entry.dto';
import { UpdateBookEntryDto } from './dto/update-book-entry.dto';
import { CreateBookQuoteDto } from './dto/create-book-quote.dto';
import { UpdateBookQuoteDto } from './dto/update-book-quote.dto';
import { UpsertReadingGoalDto } from './dto/upsert-reading-goal.dto';

@Roles('ADMIN')
@Controller('admin/books')
export class BooksAdminController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll() {
    return this.booksService.findAllForAdmin();
  }

  // ':id' rotalarından ÖNCE tanımlı olmalı
  @Get('search')
  search(@Query('q') query?: string) {
    return this.booksService.search(query ?? '');
  }

  /**
   * Arşivde dış adresle duran kapakları tek seferde kendi diskimize indirir.
   * 1000Kitap öncesi eklenen kayıtlar için; yeni kayıtlarda indirme zaten
   * ekleme anında oluyor.
   */
  @Post('covers/localize')
  localizeCovers() {
    return this.booksService.localizeCovers();
  }

  /**
   * Mevcut kayıtların düz metin künyesinden ilişkisel künyeyi kurar
   * (Faz 2a geçişi). Tekrar çalıştırmak güvenli — bağlar yeniden kurulur.
   */
  @Post('credits/backfill')
  backfillCredits() {
    return this.booksService.backfillCredits();
  }

  /** Kaynaktan gelip sözlükte karşılığı olmayan, onay bekleyen türler */
  @Get('genres/pending')
  pendingGenres() {
    return this.booksService.pendingGenres();
  }

  @Patch('genres/:genreId/approve')
  approveGenre(@Param('genreId') genreId: string) {
    return this.booksService.reviewGenre(genreId, true);
  }

  @Delete('genres/:genreId')
  rejectGenre(@Param('genreId') genreId: string) {
    return this.booksService.reviewGenre(genreId, false);
  }

  @Put('goal')
  upsertGoal(
    @Body() dto: UpsertReadingGoalDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.booksService.upsertGoal(dto, user.id);
  }

  // Alıntı yolları da ':id' kalıbından önce: 'quotes' bir kitap kimliği değil
  @Patch('quotes/:quoteId')
  updateQuote(
    @Param('quoteId') quoteId: string,
    @Body() dto: UpdateBookQuoteDto,
  ) {
    return this.booksService.updateQuote(quoteId, dto);
  }

  @Delete('quotes/:quoteId')
  deleteQuote(@Param('quoteId') quoteId: string) {
    return this.booksService.deleteQuote(quoteId);
  }

  @Post()
  create(
    @Body() dto: CreateBookEntryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.booksService.create(dto, user.id);
  }

  @Post(':id/quotes')
  addQuote(@Param('id') id: string, @Body() dto: CreateBookQuoteDto) {
    return this.booksService.addQuote(id, dto);
  }

  @Patch(':id/refresh')
  refresh(@Param('id') id: string) {
    return this.booksService.refresh(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookEntryDto) {
    return this.booksService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.softDelete(id);
  }
}
