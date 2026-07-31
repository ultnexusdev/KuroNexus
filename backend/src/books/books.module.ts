import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BooksController } from './books.controller';
import { BooksAdminController } from './books.admin.controller';
import { BooksService } from './books.service';
import { GoogleBooksService } from './google-books.service';
import { AwardsService } from './awards.service';

@Module({
  imports: [PrismaModule],
  controllers: [BooksController, BooksAdminController],
  providers: [BooksService, GoogleBooksService, AwardsService],
})
export class BooksModule {}
