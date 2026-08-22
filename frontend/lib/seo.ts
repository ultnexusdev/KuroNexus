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
 */
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
}): Pick<Metadata, "openGraph" | "twitter"> {
  const url =
    locale === "en" ? `${SITE_URL}/en${path}` : `${SITE_URL}${path}`;
  const img = image ?? "/brand/og.png";
  return {
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
