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
 * Küratör görsel yuvası — yazma sözleşmesi.
 *
 * ── BACKEND YUVA LİSTESİNİ BİLMİYOR, BİLMEMELİ ───────────────────────────
 * `surface` ve `slotId` serbest metin (biçim doğrulaması var, üyelik
 * doğrulaması yok). Sebebi `SetFavouritePlayerImageDto`daki ile aynı ve
 * ölçülmüş bir tercih: yuva manifestosu ön yüzde bir TypeScript dosyası
 * (`lib/anime/bleach/slots.ts`) ve oraya yeni bir yuva eklemek **backend
 * deploy'u gerektirmemeli.** Bleach sayfasında 60'tan fazla yuva var ve
 * bölümler ayrı ayrı üretilecek; her yuva için iki servisi birden deploy
 * etmek işi durdururdu.
 *
 * Bunun bedeli: yanlış yazılmış bir `slotId` sessizce yetim bir satır
 * bırakır. Karşılığı: yetim satır hiçbir şeyi kırmıyor (çizim manifestoyu
 * okuyor, veritabanını değil) ve küratör panelinde "manifestoda karşılığı
 * yok" olarak listeleniyor.
 *
 * ── HER ALAN İSTEĞE BAĞLI, ÇÜNKÜ UÇ KISMİ GÜNCELLEME ──────────────────────
 * Küratör tek bir sekmeyi değiştiriyor (yalnız odak, yalnız alt metin).
 * Gönderilmeyen alan DEĞİŞMEDEN kalıyor; `null` göndermek ise "temizle"
 * demek. İkisini ayırt edebilmek için servis `undefined` ve `null`'ı farklı
 * ele alıyor — bkz. `CuratedImagesService.set`.
 */

/** Ön yüzün çizebildiği işlem biçimleri. Listeye ekleme yapılırsa CSS de değişir. */
export const CURATED_TREATMENTS = ['photo', 'silhouette', 'duotone'] as const;

/**
 * İzin verilen `mix-blend-mode` değerleri.
 *
 * Serbest metin BİLİNÇLİ olarak değil: değer doğrudan `style` niteliğine
 * basılıyor ve sayılı liste, oraya beklenmedik bir dize düşmesini yazma
 * anında kapatıyor. CSS'in tamamı değil, tasarımda karşılığı olan yedi tanesi.
 */
export const CURATED_BLENDS = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'soft-light',
  'hard-light',
  'luminosity',
] as const;

/**
 * ⚠️ GÖRSEL ADRESİ YALNIZCA `/uploads/` İLE BAŞLAYABİLİR — spor kanadındaki
 * `LOCAL_UPLOAD` kuralının aynısı, aynı iki gerekçeyle: CSP `img-src`
 * yabancı sunucuya izin vermiyor (görsel hiç çizilmez) ve dış adres bir gün
 * ölüyor. Yükleme ucu görseli zaten kendi sunucumuza indiriyor.
 *
 * Boş dize de geçerli ve "görseli kaldır" anlamına geliyor.
 */
const LOCAL_UPLOAD = /^(\/uploads\/[\w./-]+)?$/;

/** CSS `object-position` — "50% 30%". Boş dize = ortaya dön. */
const POSITION = /^(\d{1,3}% \d{1,3}%)?$/;

/** "16:9", "3:2" — oranın kendisi ön yüzde doğrulanıyor, burada yalnız biçim */
const RATIO = /^(\d{1,2}:\d{1,2})?$/;

export class SetCuratedImageDto {
  /**
   * Hangi sayfa — "anime/bleach". Eğik çizgi kasıtlı: kanat/sayfa hiyerarşisi
   * okunabilir kalsın diye.
   */
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  @Matches(/^[a-z0-9][a-z0-9/-]*$/, {
    message: 'CURATED_IMAGE.SURFACE_FORMAT',
  })
  surface!: string;

  /**
   * Yuvanın kararlı kimliği ("bleach:gotei:8"). İki nokta üst üste, yuva
   * adlarının doğal ayracı (`CharacterImage.abilityName` deseni:
   * "naruto:element:fire").
   */
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  @Matches(/^[a-z0-9][a-z0-9:-]*$/, {
    message: 'CURATED_IMAGE.SLOT_ID_FORMAT',
  })
  slotId!: string;

  /** Boş dize = görseli kaldır (yuvanın diğer ayarları yerinde kalır) */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Matches(LOCAL_UPLOAD, { message: 'CURATED_IMAGE.URL_MUST_BE_LOCAL' })
  url?: string;

  /** Odak noktası, "50% 30%". Boş dize = ortaya dön. */
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(POSITION, { message: 'CURATED_IMAGE.POSITION_FORMAT' })
  position?: string;

  /**
   * Büyütme yüzdesi. Alt sınır 100: altına inen değer kırpma kutusunda boşluk
   * bırakır ve altındaki zemin görünür (spor kanadında ölçüldü).
   */
  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(300)
  scale?: number | null;

  /** Boş dize = yuvanın varsayılan oranına dön */
  @IsOptional()
  @IsString()
  @MaxLength(12)
  @Matches(RATIO, { message: 'CURATED_IMAGE.RATIO_FORMAT' })
  ratio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  altTr?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  altEn?: string;

  /** "Getty Images", "Shueisha resmî arşiv" — çevrilmez */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  credit?: string;

  @IsOptional()
  @IsIn([...CURATED_TREATMENTS, ''], {
    message: 'CURATED_IMAGE.TREATMENT_UNKNOWN',
  })
  treatment?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  opacity?: number | null;

  @IsOptional()
  @IsIn([...CURATED_BLENDS, ''], { message: 'CURATED_IMAGE.BLEND_UNKNOWN' })
  blend?: string;

  /** "Geçici gizle" — satır durur, çizim yuvanın yedeğine düşer */
  @IsOptional()
  @IsBoolean()
  isHidden?: boolean;

  /**
   * Yuvayı tamamen unut (kural 3: fiziksel silme yok, `isDeleted` işaretlenir).
   *
   * `url: ""` ile karıştırılmamalı: o "görseli kaldır, ayarları bırak" demek,
   * bu ise "bu yuvanın kaydını tümden sıfırla". Küratör panelindeki iki ayrı
   * düğme.
   */
  @IsOptional()
  @IsBoolean()
  reset?: boolean;
}
