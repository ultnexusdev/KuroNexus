import type { ArchiveAnime } from "@/lib/api/types";

/**
 * Anime salonunun rafları. Film salonundaki desen: raf anahtarı ile URL
 * parçası tek yerde eşleşir.
 *
 * Filmden farkı "izliyorum" rafının varlığı ve **"yeni sezon bekleyenler"**:
 * bitirdiğin ama devamı duyurulmuş seriler ne "bitti" rafına ne "izliyorum"a
 * ait — anime arşivinin en sık sorusu bu ("hangisinin devamı gelecek?").
 */

export const SHELF_KEYS = [
  "watching",
  "upcoming",
  "completed",
  "planned",
  "paused",
  "favorites",
] as const;

export type ShelfKey = (typeof SHELF_KEYS)[number];

export const SHELF_SLUGS: Record<ShelfKey, string> = {
  watching: "izliyorum",
  upcoming: "devami-gelecek",
  completed: "bitirdiklerim",
  planned: "izleyeceklerim",
  paused: "ara-verdiklerim",
  favorites: "favorilerim",
};

/** URL parçasından raf anahtarı; tanınmayan yol için null (sayfa 404 verir). */
export function shelfFromSlug(slug: string): ShelfKey | null {
  return SHELF_KEYS.find((key) => SHELF_SLUGS[key] === slug) ?? null;
}

export function shelfHref(key: ShelfKey): string {
  return `/dark-stories/category/anime/arsiv/${SHELF_SLUGS[key]}`;
}

/**
 * Rafların kesiştiği yerler bilinçli: favori bir bayrak, "devamı gelecek" ise
 * yapımın durumundan okunur — ikisi de benim durumumla çakışabilir.
 */
export function belongsTo(anime: ArchiveAnime, shelf: ShelfKey): boolean {
  switch (shelf) {
    case "favorites":
      return anime.isFavorite;
    case "watching":
      return anime.status === "WATCHING" || anime.status === "REWATCHING";
    case "upcoming":
      // Bitirdim ama yeni sezon yolda — asıl anlatılmak istenen durum bu
      return (
        anime.status !== "DROPPED" &&
        (anime.airingState === "UPCOMING" ||
          (anime.airingState === "RELEASING" && anime.status === "COMPLETED"))
      );
    case "completed":
      return anime.status === "COMPLETED";
    case "planned":
      return anime.status === "PLANNED";
    case "paused":
      return anime.status === "ON_HOLD" || anime.status === "DROPPED";
  }
}
