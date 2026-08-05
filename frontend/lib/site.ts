/**
 * Sitenin kendi adresi.
 *
 * `NEXT_PUBLIC_API_URL` API'yi gösteriyor; sitemap ve robots ise **sitenin**
 * mutlak adresini istiyor (arama motorları göreli adres kabul etmiyor).
 * Varsayılan canlı adres, böylece Coolify'da yeni bir değişken tanımlamak
 * gerekmiyor; başka bir alan adına taşınırsa `NEXT_PUBLIC_SITE_URL` ile
 * geçersiz kılınır.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://kuronexus.com"
).replace(/\/$/, "");
