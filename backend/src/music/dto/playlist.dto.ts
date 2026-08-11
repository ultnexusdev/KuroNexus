import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

/**
 * Küratörün kendi kurduğu çalma listeleri.
 *
 * ⚠️ `spotifyId` HİÇBİR DTO'da yok ve olmayacak: yerel listeyi sync'in
 * erişemeyeceği tarafta tutan tek şey o alanın null kalması
 * (`music-playlist.service.ts` başlığı). Dışarıdan yazılabilir olsaydı bir
 * gün yanlışlıkla doldurulur ve liste bir sonraki tazelemede Spotify'ın
 * içeriğiyle ezilirdi.
 */
export class CreatePlaylistDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}

export class UpdatePlaylistDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  /** Salon kavşağındaki "favori listelerim" şeridine girsin mi */
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(9999)
  orderIndex?: number;
}

/** Listeye eklenecek parça — arşiv kimliği (cuid), Spotify kimliği değil. */
export class AddPlaylistTrackDto {
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  trackId!: string;
}

/** Listenin SON HÂLİ — sıra bu dizideki sıra. */
export class ReorderPlaylistDto {
  @IsArray()
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  trackIds!: string[];
}
