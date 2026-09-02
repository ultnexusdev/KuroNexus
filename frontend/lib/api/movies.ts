import { cache } from "react";
import { apiFetch } from "./client";
import { freshness } from "./freshness";
import type { MovieArchive, MovieDetail, MovieShowcase } from "./types";

const EMPTY_SHOWCASE: MovieShowcase = { left: null, right: null };

const EMPTY_ARCHIVE: MovieArchive = {
  movies: [],
  stats: { total: 0, watchedThisYear: 0, averageRating: null, watchlist: 0 },
  directors: [],
  genres: [],
};

// Gövde ve `w1280` gerekçesi `lib/api/tmdb.ts`te — dizi kanadıyla ortak
// (1 Eylül 2026 denetimi, D-F6). Yeniden dışa aktarım geri uyumluluk için:
// 10+ tüketici bu adresten import ediyor.
export { tmdbImage } from "./tmdb";

/**
 * Salon tek istekte dolar; künye TMDB'den değil kendi cache'imizden gelir.
 *
 * Tazelik `fresh`e bağlı (`lib/api/freshness.ts`). "Eklendi ama görünmüyor"
 * hissi — bu dosyanın eski `no-store` gerekçesi — KÜRATÖRÜN yaşadığı şeydi;
 * artık o taze okuyor, ziyaretçi beş dakikalık önbellekten.
 */
export function fetchMovieArchive(fresh?: boolean): Promise<MovieArchive> {
  return apiFetch<MovieArchive>("/movies", freshness(fresh));
}

/**
 * Salon girişinin iki yanındaki afişler. Alınamazsa lobi CSS sahnesiyle açılır.
 * Günlük önbellek yeterli: afişler ayda bir bile değişmiyor.
 */
export const getMovieShowcase = cache(async (): Promise<MovieShowcase> => {
  try {
    return await apiFetch<MovieShowcase>("/movies/showcase", {
      next: { revalidate: 86400 },
    });
  } catch {
    return EMPTY_SHOWCASE;
  }
});

/**
 * Arşiv alınamazsa salon boş açılır, sayfa çökmez (kural 4 ruhu).
 *
 * `unavailable: true` şart: bu bayrak olmadan salon, boş yanıtı "arşivin
 * gerçekten boş" sanıp öyle yazıyordu. Kullanıcı dolu bir arşivin önünde
 * "arşiv boş" mesajı görüyor ve yenilemenin yolunu bulamıyordu.
 */
const cachedMovieArchive = cache(async (fresh: boolean): Promise<MovieArchive> => {
  try {
    return await fetchMovieArchive(fresh);
  } catch {
    return { ...EMPTY_ARCHIVE, unavailable: true };
  }
});
/** `fresh === true` normalizasyonunun gerekçesi `books.ts`te. */
export function getMovieArchive(fresh?: boolean): Promise<MovieArchive> {
  return cachedMovieArchive(fresh === true);
}

/** Film sayfası: künye + kadro + fragman + platformlar. Yoksa null (404). */
const cachedMovieDetail = cache(
  async (slug: string, fresh: boolean): Promise<MovieDetail | null> => {
    try {
      return await apiFetch<MovieDetail>(
        `/movies/${encodeURIComponent(slug)}`,
        freshness(fresh),
      );
    } catch {
      return null;
    }
  },
);
export function getMovieDetail(
  slug: string,
  fresh?: boolean,
): Promise<MovieDetail | null> {
  return cachedMovieDetail(slug, fresh === true);
}
