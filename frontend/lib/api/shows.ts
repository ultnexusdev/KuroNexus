import { cache } from "react";
import { apiFetch } from "./client";
import { freshness } from "./freshness";
import type {
  SeasonEpisodes,
  ShowArchive,
  ShowDetail,
  ShowShowcase,
} from "./types";

const EMPTY_SHOWCASE: ShowShowcase = { left: null, right: null };

const EMPTY_ARCHIVE: ShowArchive = {
  shows: [],
  stats: { total: 0, watchedThisYear: 0, averageRating: null, watchlist: 0 },
  directors: [],
  genres: [],
};

// Gövde `lib/api/tmdb.ts`te — film kanadıyla ortak (D-F6). Bu dosyanın eski
// yorumu kopyayı zaten itiraf ediyordu ("ikizinde yazılı").
export { tmdbImage } from "./tmdb";

/** Salon tek istekte dolar; künye TMDB'den değil kendi cache'imizden gelir.
    Tazelik `fresh`e bağlı — gerekçe `lib/api/freshness.ts`. */
export function fetchShowArchive(fresh?: boolean): Promise<ShowArchive> {
  return apiFetch<ShowArchive>("/shows", freshness(fresh));
}

/** Salon girişinin iki yanındaki afişler. Alınamazsa lobi CSS sahnesiyle açılır. */
export const getShowShowcase = cache(async (): Promise<ShowShowcase> => {
  try {
    return await apiFetch<ShowShowcase>("/shows/showcase", {
      next: { revalidate: 86400 },
    });
  } catch {
    return EMPTY_SHOWCASE;
  }
});

/**
 * Arşiv alınamazsa salon boş açılır, sayfa çökmez (kural 4 ruhu).
 * `unavailable` bayrağının gerekçesi `movies.ts`te yazılı.
 */
const cachedShowArchive = cache(async (fresh: boolean): Promise<ShowArchive> => {
  try {
    return await fetchShowArchive(fresh);
  } catch {
    return { ...EMPTY_ARCHIVE, unavailable: true };
  }
});
/** `fresh === true` normalizasyonunun gerekçesi `books.ts`te. */
export function getShowArchive(fresh?: boolean): Promise<ShowArchive> {
  return cachedShowArchive(fresh === true);
}

/** Dizi sayfası: künye + kadro + fragman + platformlar. Yoksa null (404). */
const cachedShowDetail = cache(
  async (slug: string, fresh: boolean): Promise<ShowDetail | null> => {
    try {
      return await apiFetch<ShowDetail>(
        `/shows/${encodeURIComponent(slug)}`,
        freshness(fresh),
      );
    } catch {
      return null;
    }
  },
);
export function getShowDetail(
  slug: string,
  fresh?: boolean,
): Promise<ShowDetail | null> {
  return cachedShowDetail(slug, fresh === true);
}

/**
 * Bir sezonun bölüm ızgarası. Sayfa açılışında inmiyor: ızgara açılınca
 * isteniyor — her dizi sayfası her sezonun bölüm listesini çekmesin diye.
 */
export function fetchSeasonEpisodes(
  seasonId: string,
): Promise<SeasonEpisodes> {
  return apiFetch<SeasonEpisodes>(
    `/shows/seasons/${encodeURIComponent(seasonId)}/episodes`,
    { cache: "no-store" },
  );
}
