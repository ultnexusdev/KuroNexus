import { apiFetch } from "./client";
import type { Pulse } from "./types";

const EMPTY_PULSE: Pulse = {
  featured: null,
  halls: [],
  recent: [],
  universes: [],
  additions: [],
  totals: {
    universes: 0,
    chapters: 0,
    films: 0,
    animeEpisodes: 0,
    wikiEntries: 0,
  },
};

/**
 * Ziyaretçi önbelleğinin alt sınırı. Nabız ucu backend'de ~9 Prisma sorgusu
 * koşturuyor ve sitenin EN yüksek trafikli iki sayfası (ana sayfa +
 * /dark-stories) onu çağırıyor — eskiden `no-store` ile her ziyaretçi hepsini
 * yeniden koşturuyordu, üstelik yazılı bir gerekçesi yoktu (2026-08-22
 * denetimi; karar kullanıcıya soruldu ve onaylandı). Beş dakika müzik
 * kanadıyla aynı denge.
 */
const REVALIDATE = 300;

/**
 * "Nexus'u Keşfet" sayfasının tamamı tek istekte gelir. Alınamazsa sayfa boş
 * ama çökmeden açılır (kural 4 ruhu) — kapılar yine de kategorilerden çizilir.
 *
 * `fresh` müzik kanadındaki desenin aynısı (`lib/api/music.ts · freshness`):
 * yalnızca KÜRATÖR taze okur — sayfalar `readIsAdmin()` sonucunu geçirir.
 * Arşive yeni giren kayıt sahibine anında, ziyaretçiye en geç beş dakikada
 * görünür.
 */
export async function getPulse(fresh?: boolean): Promise<Pulse> {
  try {
    return await apiFetch<Pulse>(
      "/pulse",
      fresh ? { cache: "no-store" } : { next: { revalidate: REVALIDATE } },
    );
  } catch {
    return EMPTY_PULSE;
  }
}
