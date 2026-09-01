/**
 * Dışa açık: `gs-official.provider` aynı haritayı kendi katlama mantığıyla
 * kullanıyor (oradaki fonksiyon BİLEREK ayrı — NFKD/kesme farkı yüzünden
 * kanonik slugify'a geçirmek mevcut eşleşme anahtarlarını değiştirirdi;
 * 1 Eylül 2026 denetimi, D-B8).
 */
export const TURKISH_CHAR_MAP: Record<string, string> = {
  ç: 'c',
  Ç: 'c',
  ğ: 'g',
  Ğ: 'g',
  ı: 'i',
  I: 'i',
  İ: 'i',
  ö: 'o',
  Ö: 'o',
  ş: 's',
  Ş: 's',
  ü: 'u',
  Ü: 'u',
};

export function slugify(input: string): string {
  return input
    .replace(/[çÇğĞıIİöÖşŞüÜ]/g, (char) => TURKISH_CHAR_MAP[char] ?? char)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

/**
 * `ExternalCache` anahtarı için kısaltılmış slug. İki kitap kaynağında
 * birebir kopyaydı (bin-kitap, google-books — D-B8); 60 karakter sınırı
 * anahtarın öngörülebilir kalması için.
 */
export function slugKey(value: string): string {
  return slugify(value).slice(0, 60);
}
