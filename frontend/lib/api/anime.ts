import { apiFetch } from "./client";
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
 * gelir. Sayfa önbelleği yok: "+1 bölüm"den sonra ilerlemeyi anında görmek
 * gerekiyor (film arşivinde de aynı karar).
 */
export function fetchAnimeArchive(): Promise<AnimeArchive> {
  return apiFetch<AnimeArchive>("/anime", { cache: "no-store" });
}

/**
 * Arşiv alınamazsa salon boş açılır, sayfa çökmez (kural 4 ruhu).
 * `unavailable` bayrağının gerekçesi `movies.ts`te yazılı.
 */
export async function getAnimeArchive(): Promise<AnimeArchive> {
  try {
    return await fetchAnimeArchive();
  } catch {
    return { ...EMPTY_ARCHIVE, unavailable: true };
  }
}

/** Anime sayfası: künye + sezonlar + kadro. Bulunamazsa null (sayfa 404). */
export async function getAnimeDetail(
  slug: string,
): Promise<AnimeDetail | null> {
  try {
    return await apiFetch<AnimeDetail>(`/anime/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
  } catch {
    return null;
  }
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
export async function getAnimeShowcase(): Promise<AnimeShowcase> {
  try {
    return await apiFetch<AnimeShowcase>("/anime/showcase", {
      next: { revalidate: 86400 },
    });
  } catch {
    return EMPTY_SHOWCASE;
  }
}
