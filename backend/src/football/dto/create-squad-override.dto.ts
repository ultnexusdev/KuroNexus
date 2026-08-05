import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

/**
 * Kadro düzeltmesi girdisi.
 *
 * Bu uç önceden `@Body()`i satır içi bir TypeScript tipiyle işaretliyordu.
 * TS tipleri derlemede yok olduğu için `ValidationPipe`in doğrulayacağı bir
 * sınıf kalmıyordu — yani gövde **hiç denetlenmiyordu**: `age: "abc"` Prisma
 * seviyesinde 500'e dönüşüyor, hiçbir alan gönderilmezse de her alanı boş bir
 * kadro kaydı sessizce oluşuyordu.
 *
 * Ucun iki kullanımı var (`football.service.ts` → `createSquadOverride`):
 *   tmPlayerId verilirse → o oyuncu kadrodan gizlenir
 *   name verilirse       → kadroya elle oyuncu eklenir
 * Aşağıdaki `@ValidateIf` bu kuralı doğrulama katmanına taşıyor: ikisinden
 * biri mutlaka gelmeli.
 */
export class CreateSquadOverrideDto {
  /** Gizlenecek oyuncunun Transfermarkt id'si. */
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @IsOptional()
  tmPlayerId?: string;

  /**
   * Elle eklenen oyuncunun adı. `tmPlayerId` yoksa ZORUNLU — aksi hâlde
   * hiçbir alanı olmayan bir kayıt oluşurdu.
   */
  @ValidateIf((dto: CreateSquadOverrideDto) => !dto.tmPlayerId)
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  @IsOptional()
  position?: string;

  // Makul bir akıl sağlığı aralığı; kadroya 14–60 dışında yaş girilmesi
  // gerekirse burası genişletilir.
  @IsInt()
  @Min(14)
  @Max(60)
  @IsOptional()
  age?: number;

  /**
   * Yalnızca tam adres ya da kendi yüklediğimiz dosya kabul edilir.
   * Bu değer doğrudan `<img src>` içine giriyor; `javascript:` ve `data:`
   * gibi şemalar baştan reddedilsin.
   *
   * 📌 Not: dış bir adres verilirse görsel CSP'ye takılıp görünmeyebilir —
   * `img-src` beyaz listesi dar (bkz. frontend/next.config.ts). Güvenilir yol
   * görseli yükleyip `/uploads/...` yolunu kullanmak.
   */
  @IsString()
  @MaxLength(500)
  @Matches(/^(https?:\/\/|\/uploads\/)/, {
    message: 'photo must be an http(s) URL or an /uploads/ path',
  })
  @IsOptional()
  photo?: string;
}
