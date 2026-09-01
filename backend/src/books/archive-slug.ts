import { slugify } from '../common/utils/slugify';

/**
 * Arşiv slug'ının TEK doğruluk kaynağı.
 *
 * Slug bir sütun değil, liste sırasından üretiliyor (gerekçe
 * `books.service.ts` içinde). Bu yüzden aynı listeyi okuyan her sorgunun aynı
 * `where` + `orderBy` ile çalışması ve slug'ı AYNI kuralla türetmesi şart —
 * bugün iki yol var: `withSlugs` (tam arşiv okumaları) ve `getArchiveIndex`
 * (ödül/okuma-sırası rozetleri). Kural ikinci kez elle yazılsaydı iki yol
 * zamanla ayrışır ve "ödül rafındaki rozet yanlış kitaba bağlanıyor" gibi
 * sessiz bir hataya dönerdi; depoda bunun emsali var (`buildUniqueSlug`ın
 * dört farklı davranışı, 1 Eylül 2026 denetimi D-B5).
 *
 * Ayrı dosyada durmasının sebebi test edilebilirlik: `books.service.ts`
 * import zinciri `sanitize-html`e kadar iniyor ve Jest onu ESM olarak
 * çözemiyor, yani servisten import eden bir test hiç çalışamıyor.
 *
 * `used` kümesi çağıran tarafından tutulur: aynı liste boyunca paylaşılması
 * gerekiyor, çünkü çakışma çözümü önceki satırlara bakıyor.
 */
export function deriveArchiveSlug(
  title: string,
  firstPublishedYear: number | null,
  index: number,
  used: Set<string>,
): string {
  const base = slugify(title) || `kitap-${index + 1}`;
  const withYear = firstPublishedYear ? `${base}-${firstPublishedYear}` : base;
  const slug = !used.has(base)
    ? base
    : !used.has(withYear)
      ? withYear
      : `${base}-${index + 1}`;
  used.add(slug);
  return slug;
}
