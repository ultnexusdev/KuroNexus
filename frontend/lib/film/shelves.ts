import type { ArchiveMovie } from "@/lib/api/types";

/**
 * Salonun rafları. Raf anahtarı ile URL parçası tek yerde eşleşir; hem salon
 * sayfası hem raf sayfaları buradan okur (salon numarasında yaşanan
 * "iki yerde ayrı hesaplama" hatası tekrarlanmasın diye).
 */

export const SHELF_KEYS = [
  "watched",
  "watchlist",
  "rewatch",
  "favorites",
] as const;

export type ShelfKey = (typeof SHELF_KEYS)[number];

export const SHELF_SLUGS: Record<ShelfKey, string> = {
  watched: "izlediklerim",
  watchlist: "izleyeceklerim",
  rewatch: "tekrar-izlenecekler",
  favorites: "favorilerim",
};

/** URL parçasından raf anahtarı; tanınmayan yol için null (sayfa 404 verir). */
export function shelfFromSlug(slug: string): ShelfKey | null {
  const found = SHELF_KEYS.find((key) => SHELF_SLUGS[key] === slug);
  return found ?? null;
}

export function shelfHref(key: ShelfKey): string {
  return `/dark-stories/category/film/arsiv/${SHELF_SLUGS[key]}`;
}

/**
 * Favori bir DURUM değil bayrak: izlenmiş bir film aynı anda favori olabilir,
 * bu yüzden favoriler rafı diğer üçüyle kesişir (bilinçli).
 */
export function belongsTo(movie: ArchiveMovie, shelf: ShelfKey): boolean {
  if (shelf === "favorites") {
    return movie.isFavorite;
  }
  if (shelf === "watched") {
    return movie.status === "WATCHED";
  }
  if (shelf === "watchlist") {
    return movie.status === "WATCHLIST";
  }
  return movie.status === "REWATCH";
}
