/**
 * Kitap kanadının adres yardımcıları.
 *
 * Neden ayrı dosya (2026-08-22): `awardHref` eskiden `AwardHall.tsx` içinde
 * duruyordu ama o dosya `"use client"` — bir istemci modülünün fonksiyon
 * export'ları sunucu tarafında ÇAĞRILAMAZ (istemci referansına dönüşürler).
 * Sırf bu iki satırlık saf fonksiyon yüzünden, onu kullanan 261 satırlık
 * PersonHall de istemci paketine gömülü kalıyordu. Adres kurucular artık
 * tarafsız bir modülde; iki taraf da içeri alabiliyor.
 */

/** Ödül sayfasının kendi adresi; liste ve raf görünümleri de buradan kurulur. */
export function awardHref(key: string): string {
  return `/dark-stories/category/kitap/oduller/${key}`;
}

export const AWARDS_HREF = "/dark-stories/category/kitap/oduller";
