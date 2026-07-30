import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { ShowsService } from './shows.service';

@Controller('shows')
export class ShowsController {
  constructor(private readonly showsService: ShowsService) {}

  // Salon tek istekte dolar: arşiv + künye şeridi + yaratıcılar + türler
  @Public()
  @Get()
  getArchive() {
    return this.showsService.getArchive();
  }

  // Salon girişinin dekoratif afişleri
  @Public()
  @Get('showcase')
  getShowcase() {
    return this.showsService.showcase();
  }

  // Dizi sayfası. ':slug' en sonda: 'showcase' gibi sabit yollar önce eşleşsin
  @Public()
  @Get(':slug')
  getDetail(@Param('slug') slug: string) {
    return this.showsService.getDetail(slug);
  }
}
