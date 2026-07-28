import { apiFetch } from "./client";
import type { MovieArchive, MovieShowcase } from "./types";

const EMPTY_SHOWCASE: MovieShowcase = { left: null, right: null };

const EMPTY_ARCHIVE: MovieArchive = {
  movies: [],
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

/**
 * Salon tek istekte dolar; künye TMDB'den değil kendi cache'imizden gelir.
 *
 * Sayfa önbelleği yok: arşive film ekledikten hemen sonra salonda görmek
 * gerekiyor, beş dakika beklemek "eklendi ama görünmüyor" hissi veriyordu.
 * Dış API maliyeti yok — bu istek kendi veritabanımıza gidiyor.
 */
export function fetchMovieArchive(): Promise<MovieArchive> {
  return apiFetch<MovieArchive>("/movies", { cache: "no-store" });
}

/**
 * Salon girişinin iki yanındaki afişler. Alınamazsa lobi CSS sahnesiyle açılır.
 * Günlük önbellek yeterli: afişler ayda bir bile değişmiyor.
 */
export async function getMovieShowcase(): Promise<MovieShowcase> {
  try {
    return await apiFetch<MovieShowcase>("/movies/showcase", {
      next: { revalidate: 86400 },
    });
  } catch {
    return EMPTY_SHOWCASE;
  }
}

/** Arşiv alınamazsa salon boş açılır, sayfa çökmez (kural 4 ruhu). */
export async function getMovieArchive(): Promise<MovieArchive> {
  try {
    return await fetchMovieArchive();
  } catch {
    return EMPTY_ARCHIVE;
  }
}
