/**
 * Salon 02 · Film — TEK ADRES KAYNAĞI (anime/müzik/spor deseninin aynısı).
 *
 * Kural: hiçbir bileşen `/dark-stories/category/film/...` dizesini elle
 * yazmaz; adres buradan okunur. 1 Eylül 2026 denetimi (H-F3) film kanadında
 * 11 dosyada 18 elle yazılmış adres saydı; 2 Eylül gecesi hepsi buraya
 * süpürüldü. Salon bir gün kendi ağacına taşınırsa (anime gibi) yalnızca
 * `TREE` değişir.
 *
 * Bilinçli istisnalar: `app/sitemap.ts` ve `next.config.ts` adresleri
 * kendileri yazar (merkezler); bu dosyaya bağımlı olmamaları kasıtlı.
 */

const TREE = "/dark-stories/category/film";

export const filmHref = {
  /** Salon girişi */
  hall: () => TREE,
  /** Arşiv dizini */
  archive: () => `${TREE}/arsiv`,
  /** Raf sayfası (`lib/film/shelves.ts` anahtarından slug) */
  shelf: (slug: string) => `${TREE}/arsiv/${slug}`,
  /** Film sayfası — slug backend'den gelir, burada türetilmez */
  movie: (slug: string) => `${TREE}/${slug}`,
} as const;
