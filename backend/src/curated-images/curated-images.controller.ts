import { Controller, Get, Query } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { CuratedImagesService } from './curated-images.service';
import { ReadCuratedImagesDto } from './dto/read-curated-images.dto';

/**
 * Küratör görsel yuvaları — HERKESE AÇIK okuma ucu.
 *
 * Yazma tarafı ayrı dosyada (`curated-images.admin.controller.ts`) ve
 * `@Roles('ADMIN')` arkasında. İki dosyayı ayırmak spor kanadının kuralı ve
 * gerekçesi orada yazılı: yanlışlıkla açık kalan bir yazma ucu, aynı sınıfa
 * eklenmiş tek bir metot kadar yakın olmasın.
 *
 * ── NEDEN QUERY, `:surface` DEĞİL ────────────────────────────────────────
 * Yüzey adı eğik çizgi taşıyor ("anime/bleach") ve bir rota parametresi eğik
 * çizgiyi bölüm ayracı sayar. Yüzeyi `anime%2Fbleach` diye kaçırmak
 * çalışırdı ama her çağıranın bunu hatırlamasına bağlı olurdu; sorgu
 * parametresi bu tuzağı tümden kapatıyor.
 */
@Controller('curated-images')
export class CuratedImagesController {
  constructor(private readonly service: CuratedImagesService) {}

  /**
   * Bir yüzeyin bütün yuvaları, tek istekte:
   * `GET /curated-images?surface=anime/bleach`
   *
   * Yanıt: `{ "bleach:hero": { url, position, ratio, … } }`. Kayıt yoksa `{}`
   * — hata değil; sayfa yuvaların tasarlanmış yedekleriyle açılır.
   */
  @Public()
  @Get()
  bySurface(@Query() query: ReadCuratedImagesDto) {
    return this.service.bySurface(query.surface.trim());
  }
}
