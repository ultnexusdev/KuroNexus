import { Controller, Get, Param } from '@nestjs/common';
import { SportArchiveService } from './sport-archive.service';
import { Public } from '../common/decorators/public.decorator';

/**
 * Salon 06 · Spor Arşivi — genel uçlar.
 *
 * Altı uç, altı sayfa. Bire bir eşleşme kasıtlı: bir sayfanın ihtiyacı olan
 * her şey tek istekte geliyor, ön yüz parça birleştirmiyor. Kanadın tek genel
 * denetleyicisi: eski `SportPublicController` (`/sport/:universeSlug`) ve
 * `SportAdminController` (`/admin/sport/*`) 15 Ağustos'ta silindi — son
 * tüketicileri GsHall/F1Hall'du, onlar da 8 Ağustos'ta gitmişti.
 *
 * Yazma uçları (admin CRUD) BİLİNÇLE YOK: şemadaki künye modelleri Faz 1'de
 * hiçbir sayfa beslemiyor, panelde form açmak altı ay sonra "bunlar ne"
 * sorusunu üretirdi. Admin formları anlatı modelleriyle sınırlı olarak ayrı
 * bir turda gelecek.
 */
@Public()
@Controller('sport-archive')
export class SportArchiveController {
  constructor(private readonly archive: SportArchiveService) {}

  /** `/spor` — iki dünyanın doluluk sayımı */
  @Get('overview')
  getOverview() {
    return this.archive.getOverview();
  }

  /** `/spor/futbol` — hub */
  @Get('football')
  getFootballHub() {
    return this.archive.getFootballHub();
  }

  /** `/spor/futbol/[clubSlug]` — kulüp dünyası */
  @Get('football/clubs/:slug')
  getClub(@Param('slug') slug: string) {
    return this.archive.getClub(slug);
  }

  /**
   * `/spor/futbol/futbolcular/[slug]` — küratörün yüklediği görsel yuvaları.
   *
   * Sayfanın metni, paleti ve bölüm sırası depodaki defterden geliyor; bu uç
   * yalnızca FOTOĞRAFLARI taşıyor. İkisi ayrı çünkü biri tasarım, diğeri veri.
   *
   * Yanıt düz bir harita: `{ "hero": "/uploads/…", "gallery-4": "/uploads/…" }`.
   * Boşsa `{}` döner — futbolcunun defterde olup olmadığını backend bilmiyor
   * ve bilmesi gerekmiyor, o yüzden 404 YOK.
   */
  @Get('football/players/:slug/images')
  getPlayerImages(@Param('slug') slug: string) {
    return this.archive.getPlayerImages(slug);
  }

  /**
   * `/spor/futbol` ve `/spor/futbol/efsaneler` — BÜTÜN futbolcuların yuvaları.
   *
   * ── NEDEN TOPLU BİR UÇ GEREKTİ (20 Ağustos 2026) ────────────────────────
   * Hub sayfası defterdeki her futbolcunun kart yuvasını çiziyor ve eskiden
   * her biri için AYRI bir istek atıyordu. Defterde tek kayıt varken (Icardi)
   * bu iki istek demekti; yirmi üç kayda çıkınca yirmi dört istek olacaktı ve
   * her yeni futbolcu hub'ı bir istek daha yavaşlatacaktı.
   *
   * Bu uç aynı işi tek sorguyla yapıyor. Yanıt iki katlı bir harita:
   *   { "mauro-icardi": { "hero": "/uploads/…" }, "osimhen": { … } }
   *
   * ⚠️ ROTA SIRASI ÇAKIŞMIYOR: bu yol üç segment (`football/players/images`),
   * tekil uç dört (`football/players/:slug/images`). Nest ikisini ayrı
   * eşleştiriyor, `images` bir slug sanılmıyor.
   *
   * Boşsa `{}` döner — 404 yok, tekil uçtaki gerekçenin aynısı.
   */
  @Get('football/players/images')
  getAllPlayerImages() {
    return this.archive.getAllPlayerImages();
  }

  /** `/spor/futbol/efsaneler/[slug]` — efsane */
  @Get('football/legends/:slug')
  getLegend(@Param('slug') slug: string) {
    return this.archive.getLegend(slug);
  }

  /** `/spor/formula-1` — hub */
  @Get('f1')
  getF1Hub() {
    return this.archive.getF1Hub();
  }

  /** `/spor/formula-1/pistler/[slug]` — pist */
  @Get('f1/circuits/:slug')
  getCircuit(@Param('slug') slug: string) {
    return this.archive.getCircuit(slug);
  }

  /** `/spor/formula-1/surucular/[slug]` — sürücü (futbol efsanesinin karşılığı) */
  @Get('f1/drivers/:slug')
  getDriver(@Param('slug') slug: string) {
    return this.archive.getDriver(slug);
  }
}
