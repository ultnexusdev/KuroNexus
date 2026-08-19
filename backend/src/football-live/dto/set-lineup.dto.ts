import {
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

/**
 * Küratörün favori ilk 11'i.
 *
 * ── DOĞRULAMA NEDEN BURADA ───────────────────────────────────────────────
 * `main.ts` global `ValidationPipe({ whitelist, forbidNonWhitelisted })`
 * kuruyor; kural tek yerde, serviste TEKRARLANMIYOR. ⚠️ Bu sınıfı `@Body()`
 * yerine satır içi bir TS tipiyle değiştirmek doğrulamayı TAMAMEN kaldırır
 * (aynı tuzak `create-squad-override.dto.ts` başlığında da yazılı).
 */

/**
 * Tanınan diziliş yuvaları — 4-2-3-1.
 *
 * Liste KAPALI ve bilinçli: serbest anahtar kabul etseydik ön yüz bilmediği
 * bir yuvayı çizemez, küratör de yazdığı şeyin neden görünmediğini anlamazdı.
 * Yeni diziliş eklemek bu listeyi ve ön yüzdeki koordinat tablosunu birlikte
 * güncellemeyi gerektiriyor — ikisi ayrı düşmesin diye tek kaynak burası.
 */
export const LINEUP_SLOTS = [
  'GK',
  'LB',
  'LCB',
  'RCB',
  'RB',
  'LDM',
  'RDM',
  'LAM',
  'CAM',
  'RAM',
  'ST',
] as const;

export type LineupSlot = (typeof LINEUP_SLOTS)[number];

export const LINEUP_FORMATIONS = ['4-2-3-1'] as const;

export class SetLineupDto {
  @IsIn(LINEUP_FORMATIONS)
  formation!: (typeof LINEUP_FORMATIONS)[number];

  /**
   * { "GK": "gs:3548", "ST": "gs:3314", … }
   *
   * Boş yuva anahtarı GÖNDERİLMEZ (null yazmak yerine anahtarı hiç koymamak).
   * Değerler oyuncu kimliği; hangi kaynaktan geldiği önekte yazılı.
   * Servis anahtarları `LINEUP_SLOTS`e göre süzüyor ve bilinmeyen anahtarı
   * sessizce atıyor — bozuk bir gövde yüzünden kayıt reddedilmesin.
   */
  @IsObject()
  slots!: Record<string, string>;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  noteTr?: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  noteEn?: string;
}
