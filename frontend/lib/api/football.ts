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

/*
 * fetchSuperLigStandings, fetchNextMatch ve fetchTransferNews 2026-08-22
 * denetiminde SİLİNDİ: kulüp sayfası puan tablosunu, sonraki maçı ve
 * haberleri artık tek istekte `lib/api/football-live.ts`teki
 * `fetchClubLive`ten alıyor; üçünün de repo genelinde tek referansı kendi
 * tanımıydı. Karşılık gelen backend uçları (GET /football/standings,
 * GET /football/next-match, GET /transfer-news/universe/:slug) hâlâ duruyor
 * — kaldırma kararı sahibinin (denetim raporunda listeli).
 */

export function fetchFootballPlayer(
  id: string,
): Promise<FootballPlayerDetail> {
  return apiFetch<FootballPlayerDetail>(
    `/football/player/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );
}
