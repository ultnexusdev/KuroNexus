import type { ArchiveBook } from "@/lib/api/types";

/**
 * Salonun rafları. Raf anahtarı ile URL parçası tek yerde eşleşir; hem salon
 * sayfası hem raf sayfaları buradan okur (film/dizi kanadındaki desen).
 */

export const SHELF_KEYS = [
  "read",
  "toRead",
  "reading",
  "abandoned",
  "favorites",
] as const;

export type ShelfKey = (typeof SHELF_KEYS)[number];

export const SHELF_SLUGS: Record<ShelfKey, string> = {
  read: "okuduklarim",
  toRead: "okuyacaklarim",
  reading: "su-an-okuyorum",
  abandoned: "yarim-biraktiklarim",
  favorites: "favorilerim",
};

/** URL parçasından raf anahtarı; tanınmayan yol için null (sayfa 404 verir). */
export function shelfFromSlug(slug: string): ShelfKey | null {
  const found = SHELF_KEYS.find((key) => SHELF_SLUGS[key] === slug);
  return found ?? null;
}

export function shelfHref(key: ShelfKey): string {
  return `/dark-stories/category/kitap/arsiv/${SHELF_SLUGS[key]}`;
}

/**
 * Favori bir DURUM değil bayrak: okunmuş bir kitap aynı anda favori olabilir,
 * bu yüzden favoriler rafı diğerleriyle kesişir (bilinçli — film kanadıyla
 * aynı karar).
 */
export function belongsTo(book: ArchiveBook, shelf: ShelfKey): boolean {
  if (shelf === "favorites") {
    return book.isFavorite;
  }
  if (shelf === "read") {
    return book.status === "READ";
  }
  if (shelf === "toRead") {
    return book.status === "TO_READ";
  }
  if (shelf === "reading") {
    return book.status === "READING";
  }
  return book.status === "ABANDONED";
}
