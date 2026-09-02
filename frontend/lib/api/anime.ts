import { cache } from "react";
import { apiFetch } from "./client";
import { freshness } from "./freshness";
import type {
  AnimeArchive,
  AnimeDetail,
  AnimeShowcase,
  PartEpisodes,
} from "./types";

const EMPTY_ARCHIVE: AnimeArchive = {
  entries: [],
  stats: {
    series: 0,
    watching: 0,
    completedSeries: 0,
    watchedEpisodes: 0,
    topTag: null,
  },
  genres: [],
  tags: [],
};

/**
 * Anime salonu tek istekte dolar; künye AniList'ten değil kendi cache'imizden
 * gelir. Tazelik `fresh`e bağlı (`lib/api/freshness.ts`): "+1 bölüm"den
 * sonra ilerlemeyi anında görmesi gereken KÜRATÖR, ziyaretçi değil.
 */
export function fetchAnimeArchive(fresh?: boolean): Promise<AnimeArchive> {
  return apiFetch<AnimeArchive>("/anime", freshness(fresh));
}

/**
 * Arşiv alınamazsa salon boş açılır, sayfa çökmez (kural 4 ruhu).
 * `unavailable` bayrağının gerekçesi `movies.ts`te yazılı. `fresh === true`
 * normalizasyonunun gerekçesi `books.ts`te.
 */
const cachedAnimeArchive = cache(async (fresh: boolean): Promise<AnimeArchive> => {
  try {
    return await fetchAnimeArchive(fresh);
  } catch {
    return { ...EMPTY_ARCHIVE, unavailable: true };
  }
});
export function getAnimeArchive(fresh?: boolean): Promise<AnimeArchive> {
  return cachedAnimeArchive(fresh === true);
}

/** Anime sayfası: künye + sezonlar + kadro. Bulunamazsa null (sayfa 404). */
const cachedAnimeDetail = cache(
  async (slug: string, fresh: boolean): Promise<AnimeDetail | null> => {
    try {
      return await apiFetch<AnimeDetail>(
        `/anime/${encodeURIComponent(slug)}`,
        freshness(fresh),
      );
    } catch {
      return null;
    }
  },
);
export function getAnimeDetail(
  slug: string,
  fresh?: boolean,
): Promise<AnimeDetail | null> {
  return cachedAnimeDetail(slug, fresh === true);
}

/**
 * Bir sezonun bölüm listesi. Tarayıcıdan çağrılır (sezon açıldığında) —
 * bütün sezonların listesini sayfa açılışında çekmek gereksiz yavaşlık olurdu;
 * kaynak (Jikan) hem yavaş hem kırılgan.
 */
export function fetchPartEpisodes(partId: string): Promise<PartEpisodes> {
  return apiFetch<PartEpisodes>(`/anime/parts/${partId}/episodes`, {
    cache: "no-store",
  });
}

const EMPTY_SHOWCASE: AnimeShowcase = { left: null, right: null };

/**
 * Salon girişinin iki yanındaki afişler. Alınamazsa lobi afişsiz açılır.
 * Günlük önbellek yeterli: afişler ayda bir bile değişmiyor.
 */
export const getAnimeShowcase = cache(async (): Promise<AnimeShowcase> => {
  try {
    return await apiFetch<AnimeShowcase>("/anime/showcase", {
      next: { revalidate: 86400 },
    });
  } catch {
    return EMPTY_SHOWCASE;
  }
});
