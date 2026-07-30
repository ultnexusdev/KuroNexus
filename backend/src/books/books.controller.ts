import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // Salon 05 tek istekte dolar: arşiv + istatistik + seriler + yazarlar
  @Public()
  @Get()
  getArchive() {
    return this.booksService.getArchive();
  }

  // Salon girişinin iki yanındaki kapaklar
  @Public()
  @Get('showcase')
  getShowcase() {
    return this.booksService.showcase();
  }

  // Kitap sayfası. ':slug' en sonda: 'showcase' gibi sabit yollar önce eşleşsin
  @Public()
  @Get(':slug')
  getDetail(@Param('slug') slug: string) {
    return this.booksService.getDetail(slug);
  }
}
