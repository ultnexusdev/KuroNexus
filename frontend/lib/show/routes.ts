/**
 * Salon 03 · Dizi — TEK ADRES KAYNAĞI (film kanadının ikizi).
 *
 * Kural: hiçbir bileşen `/dark-stories/category/dizi/...` dizesini elle
 * yazmaz; adres buradan okunur. 1 Eylül 2026 denetimi (H-F3) dizi kanadında
 * 10 dosyada 16 elle yazılmış adres saydı; 2 Eylül gecesi hepsi buraya
 * süpürüldü. Salon taşınırsa yalnızca `TREE` değişir.
 *
 * Bilinçli istisnalar: `app/sitemap.ts` ve `next.config.ts` adresleri
 * kendileri yazar (merkezler).
 */

const TREE = "/dark-stories/category/dizi";

export const showHref = {
  /** Salon girişi */
  hall: () => TREE,
  /** Arşiv dizini */
  archive: () => `${TREE}/arsiv`,
  /** Raf sayfası (`lib/show/shelves.ts` anahtarından slug) */
  shelf: (slug: string) => `${TREE}/arsiv/${slug}`,
  /** Dizi sayfası — slug backend'den gelir, burada türetilmez */
  show: (slug: string) => `${TREE}/${slug}`,
} as const;
