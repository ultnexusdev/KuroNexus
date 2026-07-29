import type { ArchiveAnime } from "@/lib/api/types";

/**
 * Tür süzgeci.
 *
 * AniList'te "Shounen" bir tür (genre) değil **etiket** (tag): genre listesi
 * 19 kalemle sınırlı, asıl ayrım tag'lerde. Süzgeç ikisini birlikte kullanır —
 * bu yüzden çip sayısı hızla kabarıyor ve ilk kaçı gösterilip gerisi
 * "daha fazla" ile açılıyor.
 */

/** İlk bakışta kaç çip görünür; gerisi "daha fazla" ile açılır. */
export const CHIP_LIMIT = 8;

export interface FilterChip {
  value: string;
  count: number;
}

/**
 * Çipler arşivdeki kullanım sıklığına göre sıralanır: en çok izlediğin tür
 * başa gelir. Tek seride geçen etiket listeyi şişirmesin diye en sona düşer.
 */
export function buildChips(entries: ArchiveAnime[]): FilterChip[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    // Aynı ad hem tür hem etiket olarak geçebiliyor — bir kez sayılır
    for (const value of new Set([...entry.genres, ...entry.tags])) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value, "tr"));
}

export function matchesFilter(anime: ArchiveAnime, filter: string | null): boolean {
  if (filter === null) {
    return true;
  }
  return anime.genres.includes(filter) || anime.tags.includes(filter);
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
