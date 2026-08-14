import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

/**
 * Salon 06 · Spor Arşivi — küratör DTO'ları.
 *
 * Bu dosyanın var olma sebebi tek bir cümle: **zaman şeridine bir kayıt
 * eklemek için konteyner terminaline girmek gerekmiyor.** Faz 1'de yazma
 * uçları bilinçle yoktu (bkz. `sport-archive.controller.ts` başlığı) ve
 * sonuç, her yeni anın bir `ts-node` çağrısı olmasıydı.
 *
 * ⚠️ İKİ DÜNYA İKİ TABLO. Futbol anı `FootballMoment` (bir DÖNEME bağlı),
 * F1 anı `F1Moment` (bir PİSTE bağlı). Ortak bir "moment" tablosu yok ve
 * uydurulmuyor: dönem kavramının F1'de, pist kavramının futbolda karşılığı
 * yok. `world` alanı hangi tabloya yazılacağını söylüyor; eksik olan bağ
 * servis katmanında reddediliyor.
 */

export const MOMENT_KINDS = [
  'MILESTONE',
  'MATCH',
  'TROPHY',
  'ARRIVAL',
  'DEPARTURE',
  'TURNING_POINT',
  'OTHER',
] as const;

/** Ana sayfadaki şeridin makul sınırları — yazım hatasını yazma anında yakalar */
const YEAR_MIN = 1800;
const YEAR_MAX = 2200;

/**
 * ⚠️ GÖRSEL ADRESİ YALNIZCA `/uploads/` İLE BAŞLAYABİLİR. Boş dize de geçerli
 * ve "görseli kaldır" anlamına geliyor.
 *
 * Dış adres iki yerden kırılıyor: CSP `img-src` yabancı sunucuya izin vermiyor
 * (görsel hiç çizilmez) ve dış adres bir gün ölüyor. Yükleme ucu görseli zaten
 * kendi sunucumuza indiriyor; buraya gelen değer onun çıktısı.
 */
const LOCAL_UPLOAD = /^(\/uploads\/[\w./-]+)?$/;

export class CreateSportMomentDto {
  @IsIn(['football', 'f1'])
  world!: 'football' | 'f1';

  /** `world = football` iken ZORUNLU — an bir dönemin içinde yaşar */
  @IsOptional()
  @IsString()
  @MaxLength(40)
  eraId?: string;

  /** `world = f1` iken ZORUNLU */
  @IsOptional()
  @IsString()
  @MaxLength(40)
  circuitId?: string;

  @IsInt()
  @Min(YEAR_MIN)
  @Max(YEAR_MAX)
  year!: number;

  @IsString()
  @MinLength(1)
  @MaxLength(160)
  titleTr!: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  titleEn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8000)
  narrativeTr?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8000)
  narrativeEn?: string;

  /** Yalnızca futbolda anlamlı; F1 tarafında sessizce yok sayılır */
  @IsOptional()
  @IsIn(MOMENT_KINDS)
  kind?: string;

  /** Ana sayfadaki şerit YALNIZCA öne çıkanları okuyor — varsayılan açık */
  @IsOptional()
  @IsBoolean()
  isHighlight?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  /**
   * Kartın üstündeki arşiv fotoğrafı. Yükleme ucundan (`POST /admin/uploads`)
   * dönen yerel adres; dış adres kabul edilmiyor (bkz. `SetSportImageDto`).
   */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Matches(LOCAL_UPLOAD, { message: 'SPORT_ARCHIVE.IMAGE_URL_MUST_BE_LOCAL' })
  imageUrl?: string;
}

export class UpdateSportMomentDto {
  @IsOptional()
  @IsInt()
  @Min(YEAR_MIN)
  @Max(YEAR_MAX)
  year?: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  titleTr?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  titleEn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8000)
  narrativeTr?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8000)
  narrativeEn?: string;

  @IsOptional()
  @IsIn(MOMENT_KINDS)
  kind?: string;

  @IsOptional()
  @IsBoolean()
  isHighlight?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export const IMAGE_TARGETS = [
  'CLUB_COVER',
  'CLUB_CREST',
  'CIRCUIT_COVER',
  'LEGEND_PORTRAIT',
  'DRIVER_PORTRAIT',
  'MOMENT_FOOTBALL',
  'MOMENT_F1',
] as const;

export type SportImageTarget = (typeof IMAGE_TARGETS)[number];

/**
 * Görsel bağlama. Adres kuralı için bkz. `LOCAL_UPLOAD`.
 */
export class SetSportImageDto {
  @IsIn(IMAGE_TARGETS)
  target!: SportImageTarget;

  /**
   * Kaydın kimliği.
   *
   * ⚠️ `slug` DEĞİL `ref`: kulüp/pist/efsane/sürücü slug taşıyor ama ANIN
   * slug'ı yok — o `cuid`. Alanı "slug" diye adlandırmak, an hedefleri
   * eklendiğinde yalan söyleyen bir isim olurdu.
   */
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  ref!: string;

  /** Boş dize = görseli KALDIR. Silme ayrı bir uç olmasın diye tek alan. */
  @IsString()
  @MaxLength(500)
  @Matches(LOCAL_UPLOAD, { message: 'SPORT_ARCHIVE.IMAGE_URL_MUST_BE_LOCAL' })
  url!: string;
}

/**
 * F1 sürücüsünü panteona alma.
 *
 * Sürücü kayıtlarının hepsi senkronizasyonun getirdiği OLGU ve `isPublished`
 * varsayılanı `false` — yani 96 sürücü veritabanında duruyor ama hiçbiri
 * "efsane" değil. Küratörlük tam olarak bu: hangisinin sayfaya çıkacağına
 * karar vermek. Bu uç o kararı yazıyor.
 */
export class FeatureF1DriverDto {
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  /** "Sıralamamda 1." — boşsa küratör düzenine (orderIndex) düşer */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(999)
  personalRank?: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  nicknameTr?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  nicknameEn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  narrativeTr?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  narrativeEn?: string;
}

/**
 * Kapağın ODAK NOKTASI ve BÜYÜTMESİ — /spor sayfasındaki iki bant için.
 *
 * ⚠️ NEDEN VAR: bant kapağı geniş bir orana kırpıyor ve görselin neresinin
 * görüneceğine tarayıcı karar veriyordu (varsayılan ortası). Kadro
 * fotoğraflarında yüzler üstte olduğu için ortadan kırpmak yüzleri
 * kesiyordu (kullanıcı bildirimi, 14 Ağustos 2026).
 *
 * Müzik kanadındaki `UpdateMusicalActDto.bannerPosition` ile AYNI kalıp ve
 * aynı doğrulama — iki salon aynı işi iki farklı sözleşmeyle yapmasın.
 *
 * Hedef yalnızca KAPAK taşıyan iki tablo. Efsane portresi bilerek dışarıda:
 * o kare bir çerçevede duruyor ve odak sorunu yok.
 */
export const COVER_TARGETS = ['CLUB_COVER', 'CIRCUIT_COVER'] as const;

export type SportCoverTarget = (typeof COVER_TARGETS)[number];

export class SetSportCoverFocusDto {
  @IsIn(COVER_TARGETS)
  target!: SportCoverTarget;

  /** Kulüp ya da pist slug'ı (bkz. `SetSportImageDto.ref`) */
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  ref!: string;

  /**
   * CSS `background-position` — "50% 30%". Boş dize = ORTAYA DÖN (null
   * yazılır, CSS varsayılanı geçerli olur).
   *
   * ⚠️ SERBEST METİN DEĞİL, KALIP ZORUNLU. Doğrulanmadan geçen bir dize
   * doğrudan `style` niteliğine yazılıyor; kalıp hem CSS'i bozacak değeri
   * hem de niteliğe sızacak içeriği daha yazma anında reddediyor.
   */
  @IsOptional()
  @IsString()
  @Matches(/^(\d{1,3}% \d{1,3}%)?$/, {
    message: 'SPORT_ARCHIVE.COVER_POSITION_FORMAT',
  })
  position?: string;

  /**
   * Büyütme yüzdesi. 100 = kırpma kutusunu tam doldur.
   *
   * Alt sınır 100 çünkü daha küçüğü kutuda boşluk bırakır ve bandın
   * altındaki zemin görünür — küratörün isteyerek yapacağı bir şey değil,
   * kaydırıcıyı sonuna kadar çekince oluşan bir kaza olurdu.
   */
  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(300)
  scale?: number;
}
