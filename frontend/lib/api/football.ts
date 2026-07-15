import { apiFetch } from "./client";
import type { FootballPlayerDetail, FootballSquad } from "./types";

// Kadro backend cache'inden gelir (TTL 24s) — SSR'da 5 dk revalidate yeterli
export function fetchFootballSquad(): Promise<FootballSquad> {
  return apiFetch<FootballSquad>("/football/squad", {
    next: { revalidate: 300 },
  });
}

export function fetchFootballPlayer(
  id: string,
): Promise<FootballPlayerDetail> {
  return apiFetch<FootballPlayerDetail>(
    `/football/player/${encodeURIComponent(id)}`,
    { next: { revalidate: 300 } },
  );
}
