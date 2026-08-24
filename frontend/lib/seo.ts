import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Detay/salon sayfalarının paylaşım kartı (2026-08-22 denetimi).
 *
 * ── NEDEN VAR ────────────────────────────────────────────────────────────
 * Kök layout tam bir `openGraph` bloğu tanımlıyor ve Next'in metadata
 * birleştirmesi ÜST ANAHTAR bazında sığ: çocuk sayfa `openGraph`ı hiç
 * yazmayınca layout'unki OLDUĞU GİBİ kalıyor. Sonuç: her hikâye, kitap,
 * film ve albüm sayfası WhatsApp/X/Discord'da "KuroNexus" başlığı, ana sayfa
 * adresi ve jenerik marka görseliyle paylaşılıyordu — kapak görseli sayfada
 * metadata anında elimizdeyken.
 *
 * ── NEDEN HER ALAN YENİDEN YAZILIYOR ─────────────────────────────────────
 * Aynı sığ birleştirme yüzünden: çocuk `openGraph` yazarsa layout'unki
 * TAMAMEN düşer, derin birleştirme YOK. `siteName`/`type`/`locale` burada
 * tekrar verilmezse karttan silinir. Tek kaynak bu yardımcı — sayfalar
 * `...shareCard({...})` ile yayar, alan unutma sınıfı kapanır.
 *
 * `image` mutlak URL (API kapakları) ya da site-göreli yol olabilir —
 * göreliyi layout'taki `metadataBase` mutlaklaştırır.
 *
 * ── NEDEN `alternates` DE BURADA (2026-08-23) ────────────────────────────
 * hreflang/canonical sitede tek sayfada (bleach, elle) vardı; sitemap
 * doğru bildirse de sayfa `<head>`'leri boştu. Kural sitemap'takiyle aynı:
 * her adres KENDİSİ DAHİL bütün dil eşlerini bildirir, `x-default`
 * varsayılan dile — öneksiz TR adresine — gider. Yol zaten parametre
 * olarak elimizde; tek kaynak yine bu yardımcı, sayfa başına elle yazım
 * sınıfı kapanır.
 */
/**
 * Yalnızca `alternates`: canonical + hreflang üçlüsü.
 *
 * `shareCard` bunu içeriden çağırıyor, yani adres kuralı tek yerde. Ayrıca
 * dışa açık, çünkü paylaşım kartını KENDİ yazan sayfalar var ve onlara
 * `shareCard`ı dayatmak kartı bozardı: site kökünün `openGraph`ı kök
 * düzende tanımlı ve görsel ölçülerini (1200×630) taşıyor; `shareCard`
 * onu yeniden yazsaydı o ölçüler düşerdi (sığ birleşme).
 *
 * ⚠️ Yol locale ÖNEKSİZ. Site kökü için boş dize geç.
 */
export function localeAlternates(
  locale: string,
  path: string,
): NonNullable<Metadata["alternates"]> {
  const tr = `${SITE_URL}${path}`;
  const en = `${SITE_URL}/en${path}`;
  return {
    canonical: locale === "en" ? en : tr,
    languages: { tr, en, "x-default": tr },
  };
}

export function shareCard({
  title,
  description,
  locale,
  path,
  image,
}: {
  title: string;
  description?: string | null;
  /** Sayfanın kendi dili — `og:locale` ve adres öneki buradan. */
  locale: string;
  /** Locale ÖNEKSİZ yol, örn. `/muzik/sanatcilar` ya da `/spor/futbol`. */
  path: string;
  image?: string | null;
}): Pick<Metadata, "openGraph" | "twitter" | "alternates"> {
  const tr = `${SITE_URL}${path}`;
  const en = `${SITE_URL}/en${path}`;
  const url = locale === "en" ? en : tr;
  const img = image ?? "/brand/og.png";
  return {
    alternates: localeAlternates(locale, path),
    openGraph: {
      type: "website",
      siteName: "KuroNexus",
      title,
      ...(description ? { description } : {}),
      locale: locale === "en" ? "en_US" : "tr_TR",
      url,
      images: [{ url: img }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      ...(description ? { description } : {}),
      images: [img],
    },
  };
}
