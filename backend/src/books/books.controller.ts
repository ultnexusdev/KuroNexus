import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { BooksService } from './books.service';
import { AwardsService } from './awards.service';
import { ReadingOrdersService } from './reading-orders.service';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly awardsService: AwardsService,
    private readonly readingOrders: ReadingOrdersService,
  ) {}

  // Salon 05 tek istekte dolar: arşiv + istatistik + seriler + yazarlar
  @Public()
  @Get()
  getArchive() {
    return this.booksService.getArchive();
  }

  /* GET /showcase 2026-08-22'de KALDIRILDI (kullanıcı onayı): kitap lobisi
     vitrin kapaklarını bu uçtan almayı bırakmıştı, frontend'deki
     getBookShowcase de silindi. Film/dizi/anime showcase uçları KULLANIMDA
     ve duruyor. */

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
   * Seri sayfası. Seri kartı eskiden arşivi o adla süzüyordu; kullanıcı
   * serinin kendi sayfasını istedi (ciltler sırayla, eksikleriyle birlikte).
   */
  @Public()
  @Get('seri/:slug')
  getSeries(@Param('slug') slug: string) {
    return this.booksService.getSeriesPage(slug);
  }

  /**
   * Okuma sıraları: bir evreni hangi kitaptan başlayıp nasıl takip etmeli.
   * Liste kod içinde küratörlü; servis onu arşivle buluşturuyor.
   */
  @Public()
  @Get('okuma-sirasi')
  listReadingOrders() {
    return this.readingOrders.list();
  }

  @Public()
  @Get('okuma-sirasi/:key')
  getReadingOrder(@Param('key') key: string) {
    return this.readingOrders.getOrder(key);
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
  // 'yayinevi', 'seri', 'kaynak' ve 'okuma-sirasi' gibi sabit yollar
  // önce eşleşsin
  @Public()
  @Get(':slug')
  async getDetail(@Param('slug') slug: string) {
    const detail = await this.booksService.getDetail(slug);
    /**
     * Okuma sırası bağı burada ekleniyor, `BooksService`in içinde DEĞİL:
     * kitap servisi okuma sıralarını bilmiyor ve bilmesi de gerekmiyor —
     * bağımlılık tek yönlü kalsın (okuma sıraları kitapları biliyor).
     */
    return {
      ...detail,
      readingOrders: this.readingOrders.forBook(detail.book),
    };
  }
}
