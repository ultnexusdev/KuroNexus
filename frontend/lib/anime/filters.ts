import type { ArchiveAnime } from "@/lib/api/types";

/**
 * Üç katmanlı süzgeç (kullanıcı kararı).
 *
 * Tek sıra hâlinde genre ve tag'i karıştırmak listeyi kalabalıklaştırıyordu.
 * Veri zaten üç katmanlı geliyor:
 *  - **Tür**: AniList `genres` — 19 sabit kalem.
 *  - **Kitle**: Shounen/Seinen/Shoujo/Josei — AniList'te bunlar *tag*'tir,
 *    genre değil; kendi satırına alınınca arşivin en gerçek ayrımı oluyor.
 *  - **Tema**: kalan tag'ler (Isekai, Time Travel, Curses…), sıklığa göre.
 *
 * Üç katman **birlikte** uygulanır: "Action + Seinen + Cyberpunk" gibi.
 */

/** İlk bakışta kaç tema çipi görünür; gerisi "daha fazla" ile açılır. */
export const CHIP_LIMIT = 8;

/** Kitle etiketleri — AniList tag adlarıyla birebir eşleşir. */
export const AUDIENCE_TAGS = ["Shounen", "Seinen", "Shoujo", "Josei", "Kids"];

export interface FilterChip {
  value: string;
  count: number;
}

export interface AnimeTaxonomy {
  genres: FilterChip[];
  audience: FilterChip[];
  themes: FilterChip[];
}

export interface AnimeFilter {
  genre: string | null;
  audience: string | null;
  theme: string | null;
}

export const EMPTY_FILTER: AnimeFilter = {
  genre: null,
  audience: null,
  theme: null,
};

/** Çipler arşivdeki kullanım sıklığına göre sıralı: en çok izlediğin başta. */
export function buildTaxonomy(entries: ArchiveAnime[]): AnimeTaxonomy {
  const genres = new Map<string, number>();
  const audience = new Map<string, number>();
  const themes = new Map<string, number>();

  for (const entry of entries) {
    for (const genre of new Set(entry.genres)) {
      genres.set(genre, (genres.get(genre) ?? 0) + 1);
    }
    for (const tag of new Set(entry.tags)) {
      // Kitle etiketleri tema listesini şişirmesin: kendi satırına gider
      const bucket = AUDIENCE_TAGS.includes(tag) ? audience : themes;
      bucket.set(tag, (bucket.get(tag) ?? 0) + 1);
    }
  }

  return {
    genres: toChips(genres),
    audience: toChips(audience),
    themes: toChips(themes),
  };
}

function toChips(counts: Map<string, number>): FilterChip[] {
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value, "tr"));
}

export function matchesFilter(
  anime: ArchiveAnime,
  filter: AnimeFilter,
): boolean {
  if (filter.genre && !anime.genres.includes(filter.genre)) {
    return false;
  }
  if (filter.audience && !anime.tags.includes(filter.audience)) {
    return false;
  }
  if (filter.theme && !anime.tags.includes(filter.theme)) {
    return false;
  }
  return true;
}

export function isFilterEmpty(filter: AnimeFilter): boolean {
  return !filter.genre && !filter.audience && !filter.theme;
}

/**
 * "Sonraki bölüme kalan süre" — devam eden serilerde kartın altındaki satır.
 * Saniye cinsinden unix zamanı alır; geçmişse null döner (yayın anı geçmiş,
 * AniList henüz güncellememiş olabilir).
 */
export function daysUntil(airingAt: number | null): number | null {
  if (!airingAt) {
    return null;
  }
  const diff = airingAt * 1000 - Date.now();
  if (diff <= 0) {
    return null;
  }
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}
