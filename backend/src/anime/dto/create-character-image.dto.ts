import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { CharacterImageSlot } from '../../generated/prisma/enums';

/**
 * Karakter görseli ekleme.
 *
 * `url` yalnızca **kendi sunucumuzdaki** bir yol olabilir (`/uploads/…`).
 * Dış adres bilinçli olarak reddediliyor: görseller `/admin/uploads` ya da
 * `/admin/uploads/from-url` üzerinden indirilip yerelleştiriliyor, bu uç da
 * yalnızca o sonucu kaydediyor. Aksi hâlde CSP'nin engelleyeceği bir adres
 * veritabanına girer ve sayfada sessizce boş bir kutu olarak görünürdü.
 */
export class CreateCharacterImageDto {
  @IsInt()
  @IsPositive()
  characterId!: number;

  @IsEnum(CharacterImageSlot)
  slot!: CharacterImageSlot;

  /** `ABILITY` yuvasında hangi yetenek kartı — koddaki katmandan gelen ad */
  @IsOptional()
  @IsString()
  @MaxLength(120)
  abilityName?: string;

  @IsString()
  @MaxLength(500)
  @Matches(/^\/uploads\/[A-Za-z0-9._-]+$/, {
    message: 'CHARACTER_IMAGES.LOCAL_URL_REQUIRED',
  })
  url!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  altText?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  caption?: string;
}
