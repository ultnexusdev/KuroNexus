import { Body, Controller, Patch } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { CuratedImagesService } from './curated-images.service';
import { SetCuratedImageDto } from './dto/curated-image.dto';

/**
 * Küratör görsel yuvaları — YAZMA ucu.
 *
 * `@Roles('ADMIN')` SINIF düzeyinde ve hiçbir metot `@Public()` taşımıyor —
 * spor ve müzik kanatlarının deseninin aynısı.
 *
 * ── TEK UÇ, KISMİ GÜNCELLEME ─────────────────────────────────────────────
 * Küratör paneli beş sekmeli (görsel, odak, kadraj, metin, görünüm) ama uç
 * tek: her sekme yalnızca kendi alanlarını gönderiyor, gönderilmeyen alan
 * değişmeden kalıyor (`CuratedImagesService.set` gerekçesi). Sekme başına
 * ayrı uç açmak beş DTO, beş rota ve beş kez tekrarlanan yetki kontrolü
 * demekti; kazancı yoktu çünkü hepsi aynı satırı yazıyor.
 *
 * Spor kanadında odak ayrı bir uçta (`cover-focus`) ve orada DOĞRU: oradaki
 * odak bir görsel yuvasına değil, bir veritabanı KAYDINA (kulüp, pist) ait.
 * Burada odak yuvanın kendi alanı, yani aynı satır.
 */
@Roles('ADMIN')
@Controller('admin/curated-images')
export class CuratedImagesAdminController {
  constructor(private readonly service: CuratedImagesService) {}

  /**
   * Yuvayı yaz.
   *
   * `url: ""`      → görseli kaldır, yuvanın diğer ayarları yerinde kalır
   * `reset: true`  → yuvayı tümden sıfırla (satır soft-delete)
   */
  @Patch()
  set(@Body() dto: SetCuratedImageDto) {
    return this.service.set(dto);
  }
}
