import { apiFetch } from "./client";
import type { ShowArchive, ShowDetail, ShowShowcase } from "./types";

const EMPTY_SHOWCASE: ShowShowcase = { left: null, right: null };

const EMPTY_ARCHIVE: ShowArchive = {
  shows: [],
  stats: { total: 0, watchedThisYear: 0, averageRating: null, watchlist: 0 },
  directors: [],
  genres: [],
};

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

/** TMDB görsel yolu → tam URL. Yol yoksa null döner, çağıran boşluğu doldurur. */
export function tmdbImage(
  path: string | null | undefined,
  size: "w185" | "w342" | "w500" | "w780" = "w342",
): string | null {
  if (!path) {
    return null;
  }
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

/** Salon tek istekte dolar; künye TMDB'den değil kendi cache'imizden gelir. */
export function fetchShowArchive(): Promise<ShowArchive> {
  return apiFetch<ShowArchive>("/shows", { cache: "no-store" });
}

/** Salon girişinin iki yanındaki afişler. Alınamazsa lobi CSS sahnesiyle açılır. */
export async function getShowShowcase(): Promise<ShowShowcase> {
  try {
    return await apiFetch<ShowShowcase>("/shows/showcase", {
      next: { revalidate: 86400 },
    });
  } catch {
    return EMPTY_SHOWCASE;
  }
}

/** Arşiv alınamazsa salon boş açılır, sayfa çökmez (kural 4 ruhu). */
export async function getShowArchive(): Promise<ShowArchive> {
  try {
    return await fetchShowArchive();
  } catch {
    return EMPTY_ARCHIVE;
  }
}

/** Dizi sayfası: künye + kadro + fragman + platformlar. Yoksa null (404). */
export async function getShowDetail(
  slug: string,
): Promise<ShowDetail | null> {
  try {
    return await apiFetch<ShowDetail>(`/shows/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
  } catch {
    return null;
  }
}
