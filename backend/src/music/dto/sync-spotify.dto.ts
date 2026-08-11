import { BadRequestException } from '@nestjs/common';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

/**
 * Spotify kimliği alan uçların gövdesi.
 *
 * Küratör panelden yapıştırırken elinde genelde **adres** oluyor
 * (`https://open.spotify.com/artist/6XyY86QOPPrYVGvF9ch6wz?si=…`), çıplak
 * kimlik değil. Onu elle ayıklamasını beklemek gereksiz bir sürtünme; alan
 * üç biçimi de kabul ediyor ve `extractSpotifyId` tekine indiriyor:
 *   6XyY86QOPPrYVGvF9ch6wz
 *   spotify:artist:6XyY86QOPPrYVGvF9ch6wz
 *   https://open.spotify.com/artist/6XyY86QOPPrYVGvF9ch6wz?si=abc
 *
 * ⚠️ Doğrulama gevşek TUTULMUYOR: ayıklamadan sonra kimlik base62 ve 22
 * karakter olmak zorunda (kural 6 — doğrulanmamış alan düşürülür). Bu aynı
 * zamanda `encodeURIComponent`ten önceki ikinci savunma: adres yolunun içine
 * kimlik gibi görünen bir şey enjekte edilemiyor.
 */
export class SyncSpotifyDto {
  @IsString()
  @MinLength(22)
  @MaxLength(200)
  spotifyId!: string;
}

export class SearchSpotifyDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  q!: string;
}

export class UpdateGenreDto {
  /**
   * Türü onaylar ya da onayı kaldırır.
   *
   * Hem `true` hem `"true"` kabul ediliyor: panel formu değeri dize olarak
   * gönderiyor, JSON gövde ise boolean. Tek biçime indirme servis katmanında
   * (`toBoolean`, `music-sync.service.ts`) — DTO burada yalnızca beklenmeyen
   * değeri düşürüyor (kural 6).
   */
  @IsOptional()
  @IsIn([true, false, 'true', 'false'])
  isApproved?: boolean | 'true' | 'false';

  /**
   * `globals.css` içindeki `[data-genre="…"]` anahtarı. **Renk değeri
   * kabul edilmez** — hex veritabanına girerse tema değişiminde oda rengi
   * sabit kalır ve kural 16 veritabanı üzerinden delinmiş olur.
   */
  @IsOptional()
  @IsString()
  @MaxLength(40)
  accentKey?: string;

  /** i18n anahtarı (`music.genres.<key>`); görünen metin tabloda tutulmaz. */
  @IsOptional()
  @IsString()
  @MaxLength(60)
  key?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  /** Üst tür — alt tür hiyerarşisi için. */
  @IsOptional()
  @IsString()
  @MaxLength(40)
  parentId?: string;
}

/** Spotify kimliği türleri; adres yolundaki segment adıyla aynı. */
export type SpotifyEntity = 'artist' | 'album' | 'track' | 'playlist';

const BASE62_ID = /^[A-Za-z0-9]{22}$/;

/**
 * Adres, URI ya da çıplak kimlikten Spotify kimliğini ayıklar.
 *
 * `kind` verilirse tür de doğrulanır: albüm ucuna sanatçı adresi
 * yapıştırıldığında hata anlaşılır olsun, Spotify'dan 404 dönmesini
 * beklemek yerine.
 */
export function extractSpotifyId(input: string, kind?: SpotifyEntity): string {
  const value = input.trim();

  if (BASE62_ID.test(value)) {
    return value;
  }

  // spotify:artist:ID
  const uri = /^spotify:([a-z]+):([A-Za-z0-9]{22})$/.exec(value);
  if (uri) {
    if (kind && uri[1] !== kind) {
      throw new BadRequestException('MUSIC.SPOTIFY_ID_WRONG_TYPE');
    }
    return uri[2];
  }

  // https://open.spotify.com/artist/ID?si=…  (dil önekli biçim de var:
  // /intl-tr/artist/ID)
  try {
    const url = new URL(value);
    if (!url.hostname.endsWith('spotify.com')) {
      throw new BadRequestException('MUSIC.SPOTIFY_ID_INVALID');
    }
    const segments = url.pathname.split('/').filter(Boolean);
    const idIndex = segments.findIndex((segment) => BASE62_ID.test(segment));
    if (idIndex < 1) {
      throw new BadRequestException('MUSIC.SPOTIFY_ID_INVALID');
    }
    if (kind && segments[idIndex - 1] !== kind) {
      throw new BadRequestException('MUSIC.SPOTIFY_ID_WRONG_TYPE');
    }
    return segments[idIndex];
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw error;
    }
    throw new BadRequestException('MUSIC.SPOTIFY_ID_INVALID');
  }
}

/** Küratörün elle oluşturduğu tür. */
export class CreateGenreDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  slug?: string;

  /** i18n anahtarı (`music.genres.<key>`); görünen metin tabloda tutulmaz */
  @IsOptional()
  @IsString()
  @MaxLength(60)
  key?: string;

  /**
   * `globals.css` içindeki `[data-genre="…"]` anahtarı — **renk değeri değil.**
   * Bilinen listeye karşı servis katmanında doğrulanıyor.
   */
  @IsOptional()
  @IsString()
  @MaxLength(40)
  accentKey?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  parentId?: string;
}

/** Act'in türlerinin SON HÂLİ — ekle/çıkar değil, tam liste. */
export class SetActGenresDto {
  @IsArray()
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  genreIds!: string[];
}

/**
 * Act künyesinin küratör alanları.
 *
 * ⚠️ Sync'in yazdığı alanlar (`name`, `image`, `spotifyId`, `externalData`)
 * BURADA YOK: bir sonraki tazelemede üzerine yazılırlar ve küratör
 * "değişikliğim kayboldu" derdi.
 */
export class UpdateActDto {
  @IsOptional()
  @IsIn(['UNCLASSIFIED', 'BAND', 'SOLO_PROJECT', 'DUO', 'GROUP', 'ORCHESTRA'])
  actKind?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  sortName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  bio?: string;

  @IsOptional()
  @IsInt()
  @Min(1850)
  @Max(2200)
  formedYear?: number;

  @IsOptional()
  @IsInt()
  @Min(1850)
  @Max(2200)
  disbandedYear?: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  originCity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  originCountry?: string;

  /**
   * Yalnızca kendi sunucumuzdaki yol (`/uploads/…`). Dış adres kabul edilirse
   * CSP `img-src` onu engeller ve görsel sessizce çizilmez.
   */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bannerImage?: string;
}
