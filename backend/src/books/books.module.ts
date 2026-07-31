import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BooksController } from './books.controller';
import { BooksAdminController } from './books.admin.controller';
import { BooksService } from './books.service';
import { GoogleBooksService } from './google-books.service';
import { BinKitapService } from './bin-kitap.service';
import { BookCoverService } from './book-cover.service';
import { BookCreditsService } from './book-credits.service';
import { AwardsService } from './awards.service';

@Module({
  imports: [PrismaModule],
  controllers: [BooksController, BooksAdminController],
  providers: [
    BooksService,
    GoogleBooksService,
    BinKitapService,
    BookCoverService,
    BookCreditsService,
    AwardsService,
  ],
})
export class BooksModule {}
