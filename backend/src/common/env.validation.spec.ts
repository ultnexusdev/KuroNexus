import { Logger } from '@nestjs/common';
import { validateEnv } from './env.validation';

/** Uygulamanın gerçek üretim ayarlarının küçük bir kopyası. */
const PRODUCTION_ENV = {
  NODE_ENV: 'production',
  DATABASE_URL: 'postgresql://user:pass@db:5432/kuronexus',
  JWT_SECRET: 'x'.repeat(48),
  JWT_EXPIRES_IN: '1d',
  CORS_ORIGIN: 'https://kuronexus.com,https://www.kuronexus.com',
  MAX_UPLOAD_BYTES: '10485760',
  TMDB_READ_ACCESS_TOKEN: 'token',
  SPOTIFY_CLIENT_ID: 'id',
  SPOTIFY_CLIENT_SECRET: 'secret',
  GOOGLE_BOOKS_API_KEY: 'key',
  APIFY_TOKEN: 'token',
};

describe('validateEnv', () => {
  let warn: jest.SpyInstance;

  beforeEach(() => {
    warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
  });

  /** Verilen anahtarları çıkarılmış bir kopya döndürür. */
  function envWithout(...keys: string[]): Record<string, unknown> {
    const copy: Record<string, unknown> = { ...PRODUCTION_ENV };
    for (const key of keys) {
      delete copy[key];
    }
    return copy;
  }

  it('canlıdaki ayarlarla sorunsuz geçer ve uyarı üretmez', () => {
    expect(() => validateEnv({ ...PRODUCTION_ENV })).not.toThrow();
    expect(warn).not.toHaveBeenCalled();
  });

  it('üretimde CORS_ORIGIN eksikse boot durur', () => {
    expect(() => validateEnv(envWithout('CORS_ORIGIN'))).toThrow(/CORS_ORIGIN/);
  });

  it('üretimde CORS_ORIGIN boş dizeyse de durur', () => {
    expect(() =>
      validateEnv({ ...PRODUCTION_ENV, CORS_ORIGIN: '   ' }),
    ).toThrow(/CORS_ORIGIN/);
  });

  it('geliştirmede CORS_ORIGIN olmadan çalışır', () => {
    expect(() =>
      validateEnv({ ...envWithout('CORS_ORIGIN'), NODE_ENV: 'development' }),
    ).not.toThrow();
  });

  it('DATABASE_URL ve JWT_SECRET her ortamda zorunlu', () => {
    expect(() =>
      validateEnv({
        ...envWithout('DATABASE_URL', 'JWT_SECRET'),
        NODE_ENV: 'development',
      }),
    ).toThrow(/DATABASE_URL, JWT_SECRET/);
  });

  it('çözümlenemeyen JWT_EXPIRES_IN boot durdurur', () => {
    expect(() =>
      validateEnv({ ...PRODUCTION_ENV, JWT_EXPIRES_IN: '7 gün' }),
    ).toThrow(/JWT_EXPIRES_IN/);
  });

  it('sayı olmayan MAX_UPLOAD_BYTES boot durdurur', () => {
    expect(() =>
      validateEnv({ ...PRODUCTION_ENV, MAX_UPLOAD_BYTES: '10 MB' }),
    ).toThrow(/MAX_UPLOAD_BYTES/);
  });

  it('eksik özellik anahtarı uygulamayı DURDURMAZ, yalnızca uyarır', () => {
    expect(() =>
      validateEnv(envWithout('SPOTIFY_CLIENT_SECRET')),
    ).not.toThrow();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('SPOTIFY_CLIENT_SECRET'),
    );
  });

  it('TMDB için iki anahtardan biri yeterli', () => {
    validateEnv({
      ...envWithout('TMDB_READ_ACCESS_TOKEN'),
      TMDB_API_KEY: 'v3-key',
    });
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('TMDB'));
  });
});
