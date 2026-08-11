import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { MusicService, type ListeningRange } from './music.service';

/**
 * Salon 06 · Müzik — herkese açık okuma uçları.
 *
 * Hepsi veritabanından okuyor; Spotify'a çıkan tek satır yok. Bu bilinçli:
 * sayfa açılışında dış istek atılmıyor (kural 4) ve Spotify düşse de salon
 * eksiksiz açılıyor.
 */
@Controller('music')
export class MusicController {
  constructor(private readonly music: MusicService) {}

  /** 2a · `/muzik` — kavşak sayfası tek istekte dolar. */
  @Public()
  @Get('overview')
  getOverview() {
    return this.music.getOverview();
  }

  /** Salon üst gezinmesindeki oda listesi. */
  @Public()
  @Get('rooms')
  getRooms() {
    return this.music.getGenreRooms();
  }

  /** 2b · `/muzik/tur/:slug` */
  @Public()
  @Get('rooms/:slug')
  getRoom(@Param('slug') slug: string) {
    return this.music.getGenreRoom(slug);
  }

  /** 2d · `/muzik/dinleme` — `:slug` kalıbından ÖNCE tanımlı olmalı. */
  @Public()
  @Get('listening')
  getListening(@Query('range') range?: string) {
    return this.music.getListening(parseRange(range));
  }

  /** 2c · `/muzik/:slug` */
  @Public()
  @Get('acts/:slug')
  getAct(@Param('slug') slug: string) {
    return this.music.getAct(slug);
  }
}

const RANGES: ListeningRange[] = ['FOUR_WEEKS', 'SIX_MONTHS', 'ALL_TIME'];

/**
 * Dönem parametresi. Tanımsızsa "4 hafta" — tasarımda (2d) seçili olan o.
 * Geçersiz bir değer sessizce varsayılana düşMÜYOR: yazım hatası yüzünden
 * yanlış dönemi doğru sanmak, hata almaktan kötü.
 */
function parseRange(value: string | undefined): ListeningRange {
  if (!value) {
    return 'FOUR_WEEKS';
  }
  const upper = value.toUpperCase() as ListeningRange;
  if (!RANGES.includes(upper)) {
    throw new BadRequestException('MUSIC.RANGE_INVALID');
  }
  return upper;
}
