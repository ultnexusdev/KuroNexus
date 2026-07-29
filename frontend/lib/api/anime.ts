import { apiFetch } from "./client";
import type { AnimeArchive } from "./types";

const EMPTY_ARCHIVE: AnimeArchive = {
  entries: [],
  stats: {
    series: 0,
    watching: 0,
    completedSeries: 0,
    watchedEpisodes: 0,
    topTag: null,
  },
  studios: [],
  genres: [],
  tags: [],
};

/**
 * Anime salonu tek istekte dolar; künye AniList'ten değil kendi cache'imizden
 * gelir. Sayfa önbelleği yok: "+1 bölüm"den sonra ilerlemeyi anında görmek
 * gerekiyor (film arşivinde de aynı karar).
 */
export function fetchAnimeArchive(): Promise<AnimeArchive> {
  return apiFetch<AnimeArchive>("/anime", { cache: "no-store" });
}

/** Arşiv alınamazsa salon boş açılır, sayfa çökmez (kural 4 ruhu). */
export async function getAnimeArchive(): Promise<AnimeArchive> {
  try {
    return await fetchAnimeArchive();
  } catch {
    return EMPTY_ARCHIVE;
  }
}
