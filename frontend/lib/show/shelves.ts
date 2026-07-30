import type { ArchiveShow } from "@/lib/api/types";

/**
 * Salonun rafları — film salonundaki dört rafın (izlediklerim/izleyeceklerim/
 * tekrar izlenecekler/favoriler) aynısı, artı bir beşincisi: **Kore
 * Dramaları**. Bu raf bir durum değil köken: TMDB'nin `originCountry`
 * alanında "KR" geçen her dizi otomatik olarak burada da görünür — elle
 * etiketleme yok, diğer raflarla serbestçe kesişir (favori bir Kore dizisi
 * hem favoriler hem Kore Dramaları rafında birden çıkar).
 */

export const SHELF_KEYS = [
  "watched",
  "watchlist",
  "rewatch",
  "favorites",
  "korean",
] as const;

export type ShelfKey = (typeof SHELF_KEYS)[number];

export const SHELF_SLUGS: Record<ShelfKey, string> = {
  watched: "izlediklerim",
  watchlist: "izleyeceklerim",
  rewatch: "tekrar-izlenecekler",
  favorites: "favorilerim",
  korean: "kore-dramalari",
};

/** URL parçasından raf anahtarı; tanınmayan yol için null (sayfa 404 verir). */
export function shelfFromSlug(slug: string): ShelfKey | null {
  const found = SHELF_KEYS.find((key) => SHELF_SLUGS[key] === slug);
  return found ?? null;
}

export function shelfHref(key: ShelfKey): string {
  return `/dark-stories/category/dizi/arsiv/${SHELF_SLUGS[key]}`;
}

/**
 * Favori ve Kore Dramaları birer DURUM değil bayrak/köken: izlenmiş bir dizi
 * aynı anda favori ve Kore kökenli de olabilir — bu yüzden ikisi de diğer
 * raflarla kesişir (bilinçli).
 */
export function belongsTo(show: ArchiveShow, shelf: ShelfKey): boolean {
  if (shelf === "favorites") {
    return show.isFavorite;
  }
  if (shelf === "korean") {
    return show.originCountry.includes("KR");
  }
  if (shelf === "watched") {
    return show.status === "WATCHED";
  }
  if (shelf === "watchlist") {
    return show.status === "WATCHLIST";
  }
  return show.status === "REWATCH";
}
