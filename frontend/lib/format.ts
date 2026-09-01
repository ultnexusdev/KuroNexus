/**
 * Yerel-duyarlı küçük biçimleyiciler — kanatlar arası ortak.
 *
 * `formatDate` ve `languageName` üç dosyada birebir kopyaydı (MovieDetail,
 * ShowDetail, SourceBook — 1 Eylül 2026 denetimi, D-F8). `BookHall`daki
 * sözlük tabanlı `languageName` varyantı BİLEREK dışarıda: o, arşivdeki dil
 * kodlarını kendi çeviri anahtarlarından okuyor ve davranışı farklı — buraya
 * çekmek onu değiştirmek olurdu.
 */

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
