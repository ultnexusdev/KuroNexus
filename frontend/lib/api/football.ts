import { apiFetch } from "./client";
import type { FootballPlayerDetail, FootballSquad } from "./types";

// Kadro/oyuncu verisi backend'in yerel Transfermarkt tablolarından gelir ve
// yalnızca admin sync'inde değişir. Kaynak-doğruluk backend'de olduğundan
// frontend cache'lemez (no-store) — bir sync sonrası değişiklik anında görünür.
// (Bu fetch yalnızca galatasaray render yolunda çağrılır; diğer evren
// sayfaları etkilenmez, cache'li kalır.)
export function fetchFootballSquad(): Promise<FootballSquad> {
  return apiFetch<FootballSquad>("/football/squad", {
    cache: "no-store",
  });
}

export function fetchFootballPlayer(
  id: string,
): Promise<FootballPlayerDetail> {
  return apiFetch<FootballPlayerDetail>(
    `/football/player/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );
}
