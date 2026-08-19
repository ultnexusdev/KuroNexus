import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Kulüp sayfasının küratör görselleri.
 *
 * ── NEDEN AYRI BİR UÇ, MEVCUT `setSportImage` DEĞİL ──────────────────────
 * Arşivdeki `PATCH /admin/sport-archive/image` TEK yuvalı: bir kulübe bir
 * kapak, bir arma yazıyor ve ikincisi birincisini eziyor. Buradaki ihtiyaç
 * ÇOK KAYITLI — stadyum bölümü kaç fotoğraf varsa o kadar sahne çiziyor.
 * Aynı ucu "bazen ez, bazen ekle" hâline getirmek, iki farklı davranışı tek
 * imzaya sıkıştırmak olurdu.
 *
 * Kayıtlar `SportImage` tablosuna GALLERY yuvasıyla yazılıyor — o tablo zaten
 * çok kayıtlı, sıralı (`orderIndex`) ve iki dilli alt yazı taşıyor.
 */

/** Görselin sayfada nerede kullanılacağı. */
export const CLUB_IMAGE_KINDS = ['HERO', 'STADIUM'] as const;
export type ClubImageKind = (typeof CLUB_IMAGE_KINDS)[number];

export class AddClubImageDto {
  /**
   * HERO   — maç günü hero'sunun arka planı (tek görsel kullanılıyor, ilki)
   * STADIUM — RAMS Park bölümünün sahneleri (kaç tane varsa o kadar)
   */
  @IsIn(CLUB_IMAGE_KINDS)
  kind!: ClubImageKind;

  /**
   * `/uploads/...` — YÜKLENMİŞ dosyanın yolu.
   *
   * ⚠️ DIŞ ADRES KABUL EDİLMİYOR. Küratör önce `/admin/uploads` ya da
   * `/admin/uploads/from-url` ile dosyayı sunucumuza koyuyor, sonra buraya
   * dönen yolu veriyor. Sebebi deponun uploads modülünde yazılı: CSP
   * `img-src` yabancı origin'i engelliyor ve dış adres bir gün ölüyor.
   */
  @IsString()
  @MinLength(1)
  @MaxLength(400)
  url!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  altTr?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  captionTr?: string;

  /** "kaynak: kulüp arşivi" — künye satırı, çevrilmiyor. */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  sourceNote?: string;
}
