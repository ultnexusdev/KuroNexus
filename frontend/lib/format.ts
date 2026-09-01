/**
 * Yerel-duyarlı küçük biçimleyiciler — kanatlar arası ortak.
 *
 * `formatDate` ve `languageName` üç dosyada birebir kopyaydı (MovieDetail,
 * ShowDetail, SourceBook — 1 Eylül 2026 denetimi, D-F8). `BookHall`daki
 * sözlük tabanlı `languageName` varyantı BİLEREK dışarıda: o, arşivdeki dil
 * kodlarını kendi çeviri anahtarlarından okuyor ve davranışı farklı — buraya
 * çekmek onu değiştirmek olurdu.
 */

/** Bugünün tarihi, form alanlarının beklediği YYYY-AA-GG biçiminde.
    Dört küratör yüzeyinde birebir kopyaydı (D-F8). */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Addan monogram: en fazla iki kelimenin baş harfi. `tr` yereli bilinçli —
 * "ismail" → "İ" olmalı, "I" değil. İki kitap bileşeninde kopyaydı (D-F8).
 */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toLocaleUpperCase("tr") ?? "")
    .join("");
}

/** Tarihi okunur biçime çevirir; geçersizse ham metni döndürür. */
export function formatDate(value: string, locale: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(date);
}

/** Dil kodunu (en, ja…) okunur ada çevirir; tarayıcı bilmiyorsa kod kalır. */
export function languageName(code: string, locale: string): string {
  try {
    return (
      new Intl.DisplayNames([locale], { type: "language" }).of(code) ?? code
    );
  } catch {
    return code;
  }
}
