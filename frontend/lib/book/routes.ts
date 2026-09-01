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

/**
 * Kanadın kökü. Bu sabit 1 Eylül 2026 denetiminde buraya taşındı (bulgu
 * H-F3): `KITAP_HREF` adıyla ÜÇ bileşende tanımlıydı ve **iki farklı değer**
 * taşıyordu — `SourceBook`/`PersonHall` salonu, `ArchiveIndex` ise arşiv
 * dizinini gösteriyordu. Her dosya kendi içinde tutarlıydı, yani bugün kırık
 * bir bağlantı yoktu; ama aynı adın iki anlamı olması, birinden kopyalayan
 * bir sonraki dosyanın sessizce yanlış yere gitmesi demekti.
 *
 * Adres kurucular da buraya alındı: `personHref` üç ayrı yerde tanımlıydı ve
 * tüketiciler rastgele birinden import ediyordu (D-F8).
 */
export const BOOK_HALL_HREF = "/dark-stories/category/kitap";

/** Arşiv dizini — salonun kendisi DEĞİL. İkisi ayrı sayfalar. */
export const BOOK_ARCHIVE_HREF = `${BOOK_HALL_HREF}/arsiv`;

export const AWARDS_HREF = `${BOOK_HALL_HREF}/oduller`;
export const READING_ORDERS_HREF = `${BOOK_HALL_HREF}/okuma-sirasi`;

/** Ödül sayfasının kendi adresi; liste ve raf görünümleri de buradan kurulur. */
export function awardHref(key: string): string {
  return `${AWARDS_HREF}/${key}`;
}

/** Arşivdeki kitabın sayfası. */
export function bookHref(slug: string): string {
  return `${BOOK_HALL_HREF}/${slug}`;
}

/**
 * Arşivde **olmayan** kitabın künye sayfası. Adres 1000Kitap'ın kendi
 * anahtarı ("oteki-isim--520400"); arşiv adresleriyle karışmasın diye ayrı
 * bir yol altında duruyor.
 */
export function sourceBookHref(slug: string): string {
  return `${BOOK_HALL_HREF}/kaynak/${slug}`;
}

/**
 * Yazar / çevirmen sayfası. Adres "kisi", "yazar" değil: aynı sayfa çevirmen
 * ve editör için de kullanılıyor.
 */
export function personHref(slug: string): string {
  return `${BOOK_HALL_HREF}/kisi/${slug}`;
}

export function publisherHref(slug: string): string {
  return `${BOOK_HALL_HREF}/yayinevi/${slug}`;
}

/** Serinin kendi sayfası — ciltler sırayla, eksikleriyle birlikte. */
export function seriesHref(slug: string): string {
  return `${BOOK_HALL_HREF}/seri/${slug}`;
}
