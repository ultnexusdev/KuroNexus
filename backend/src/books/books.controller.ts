import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { BooksService } from './books.service';
import { AwardsService } from './awards.service';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly awardsService: AwardsService,
  ) {}

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

  // Ödül rafları (Faz B). Liste kodda, kapaklar cache'ten — dış istek
  // beklenmiyor, eksik kapak boş çerçeve olarak çiziliyor.
  @Public()
  @Get('awards')
  getAwards() {
    return this.awardsService.list();
  }

  @Public()
  @Get('awards/:key')
  getAward(@Param('key') key: string) {
    return this.awardsService.getAward(key);
  }

  /**
   * Yazar / çevirmen sayfası. Biyografi ilk ziyarette kaynaktan çekilip
   * kalıcı saklanıyor, sonraki ziyaretler tamamen kendi veritabanımızdan.
   */
  @Public()
  @Get('kisi/:slug')
  getPerson(@Param('slug') slug: string) {
    return this.booksService.getPerson(slug);
  }

  @Public()
  @Get('yayinevi/:slug')
  getPublisher(@Param('slug') slug: string) {
    return this.booksService.getPublisher(slug);
  }

  /**
   * Arşivde olmayan kitabın künye sayfası (ödül raflarından gelinir).
   * Adres 1000Kitap'ın kendi anahtarı ("oteki-isim--520400").
   */
  @Public()
  @Get('kaynak/:slug')
  getSourceBook(@Param('slug') slug: string) {
    return this.booksService.getSourceBook(slug);
  }

  // Kitap sayfası. ':slug' en sonda: 'showcase', 'awards', 'kisi',
  // 'yayinevi' ve 'kaynak' gibi sabit yollar önce eşleşsin
  @Public()
  @Get(':slug')
  getDetail(@Param('slug') slug: string) {
    return this.booksService.getDetail(slug);
  }
}
