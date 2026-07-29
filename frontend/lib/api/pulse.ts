import { apiFetch } from "./client";
import type { Pulse } from "./types";

const EMPTY_PULSE: Pulse = {
  featured: null,
  halls: [],
  recent: [],
  universes: [],
  totals: {
    universes: 0,
    chapters: 0,
    films: 0,
    animeEpisodes: 0,
    wikiEntries: 0,
  },
};

/**
 * "Nexus'u Keşfet" sayfasının tamamı tek istekte gelir. Alınamazsa sayfa boş
 * ama çökmeden açılır (kural 4 ruhu) — kapılar yine de kategorilerden çizilir.
 */
export async function getPulse(): Promise<Pulse> {
  try {
    return await apiFetch<Pulse>("/pulse", { cache: "no-store" });
  } catch {
    return EMPTY_PULSE;
  }
}
