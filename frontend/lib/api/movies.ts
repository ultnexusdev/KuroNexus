import { apiFetch } from "./client";
import type { MovieArchive } from "./types";

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

// Salon tek istekte dolar; künye TMDB'den değil kendi cache'imizden gelir
export function fetchMovieArchive(): Promise<MovieArchive> {
  return apiFetch<MovieArchive>("/movies", { next: { revalidate: 300 } });
}
