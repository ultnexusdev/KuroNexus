import { Logger } from '@nestjs/common';
import { parseDurationMs } from './duration';

/**
 * Boot kapısı — 1 Eylül 2026 denetiminde eklendi (bulgu H-B1 + H-B4).
 *
 * Öncesinde tek bir unutulmuş ortam değişkeni sessiz bir üretim arızasına
 * dönüşebiliyordu; en ağırı `CORS_ORIGIN`di: tanımsızsa `main.ts` her origin'e
 * `credentials: true` ile izin veriyordu, yani oturum çerezi tüm internete
 * açılıyordu ve hiçbir yerde uyarı çıkmıyordu. Bu dosyanın işi o sınıfı
 * gürültülü hâle getirmek: eksiklik ya boot'ta anlaşılır bir hatayla durur ya
 * da log'a hangi salonun kapalı açılacağını yazar.
 *
 * AYRIM ÖNEMLİ:
 * - Zorunlu değişken eksikse uygulama AÇILMAZ (yanlış çalışmaktansa açılmasın).
 * - Özellik anahtarı eksikse uygulama AÇILIR, yalnızca o salon boş kalır —
 *   projenin baştan beri uyguladığı davranış ("anahtar yoksa salon boş açılır,
 *   çökmez") korunuyor, üstüne yalnızca görünürlük ekleniyor.
 */

/** Bunlarsız uygulama zaten çalışamaz; ortamdan bağımsız zorunlu. */
const REQUIRED_ALWAYS = ['DATABASE_URL', 'JWT_SECRET'] as const;

/**
 * Yalnızca üretimde zorunlu. Geliştirmede `CORS_ORIGIN` yoksa `main.ts`
 * localhost'a izin verir; üretimde böyle bir güvenli varsayılan yok.
 */
const REQUIRED_IN_PRODUCTION = ['CORS_ORIGIN'] as const;

/**
 * Eksikliği ölümcül değil ama sessiz kalmamalı: yeni bir ortam kurulduğunda
 * "salon neden boş" sorusunun cevabı log'un ilk satırlarında dursun.
 */
const FEATURE_KEYS: ReadonlyArray<{
  feature: string;
  keys: readonly string[];
  need: 'any' | 'all';
}> = [
  {
    feature: 'Film ve dizi salonları (TMDB)',
    keys: ['TMDB_READ_ACCESS_TOKEN', 'TMDB_API_KEY'],
    need: 'any',
  },
  {
    feature: 'Müzik salonu Spotify eşlemesi',
    keys: ['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET'],
    need: 'all',
  },
  {
    feature: 'Kitap künyesi zenginleştirme (Google Books)',
    keys: ['GOOGLE_BOOKS_API_KEY'],
    need: 'all',
  },
  {
    feature: 'Süper Lig fikstür/puan senkronu (Apify)',
    keys: ['APIFY_TOKEN'],
    need: 'all',
  },
];

function isSet(config: Record<string, unknown>, key: string): boolean {
  const value = config[key];
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateEnv(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const problems: string[] = [];

  const missing = [
    ...REQUIRED_ALWAYS,
    ...(config.NODE_ENV === 'production' ? REQUIRED_IN_PRODUCTION : []),
  ].filter((key) => !isSet(config, key));
  if (missing.length > 0) {
    problems.push(`Zorunlu değişken eksik: ${missing.join(', ')}`);
  }

  // Çerez ömrü bu değerden türetiliyor (`auth-cookie.ts`); çözümlenemeyen bir
  // biçim, oturumun sessizce yanlış sürede ölmesi demek.
  const expiresIn = config.JWT_EXPIRES_IN;
  if (
    typeof expiresIn === 'string' &&
    expiresIn.trim().length > 0 &&
    parseDurationMs(expiresIn) === null
  ) {
    problems.push(
      `JWT_EXPIRES_IN çözümlenemedi: "${expiresIn}" (beklenen biçim: 1d, 12h, 30m, 900)`,
    );
  }

  const maxUpload = config.MAX_UPLOAD_BYTES;
  if (
    typeof maxUpload === 'string' &&
    maxUpload.trim().length > 0 &&
    !Number.isFinite(Number(maxUpload))
  ) {
    // `Number("10 MB")` = NaN; sınır sessizce NaN olursa her yükleme reddedilir.
    problems.push(`MAX_UPLOAD_BYTES sayı değil: "${maxUpload}"`);
  }

  if (problems.length > 0) {
    throw new Error(
      ['Ortam değişkeni doğrulaması başarısız:', ...problems].join('\n  - '),
    );
  }

  const logger = new Logger('Env');
  for (const entry of FEATURE_KEYS) {
    const present = entry.keys.filter((key) => isSet(config, key));
    const satisfied =
      entry.need === 'any'
        ? present.length > 0
        : present.length === entry.keys.length;
    if (!satisfied) {
      const eksik = entry.keys.filter((key) => !isSet(config, key));
      logger.warn(`${entry.feature} devre dışı — eksik: ${eksik.join(', ')}`);
    }
  }

  return config;
}
