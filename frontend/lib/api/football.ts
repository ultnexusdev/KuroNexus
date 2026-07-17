import { apiFetch } from "./client";
import type {
  FootballPlayerDetail,
  FootballSquad,
  NextMatchResponse,
  SuperLigStandings,
  TransferNewsItem,
} from "./types";

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

// Puan tablosu + sonraki maç: backend günlük cron'la tazeler, cache'ten okur.
// Frontend cache'lemez ki bir sync sonrası değişiklik anında görünsün.
export function fetchSuperLigStandings(): Promise<SuperLigStandings> {
  return apiFetch<SuperLigStandings>("/football/standings", {
    cache: "no-store",
  });
}

export function fetchNextMatch(): Promise<NextMatchResponse> {
  return apiFetch<NextMatchResponse>("/football/next-match", {
    cache: "no-store",
  });
}

// Transfer haberleri admin panelinden girilir; yeni haber anında görünsün diye
// cache'lenmez.
export function fetchTransferNews(
  universeSlug: string,
): Promise<TransferNewsItem[]> {
  return apiFetch<TransferNewsItem[]>(
    `/transfer-news/universe/${encodeURIComponent(universeSlug)}`,
    { cache: "no-store" },
  );
}

export function fetchFootballPlayer(
  id: string,
): Promise<FootballPlayerDetail> {
  return apiFetch<FootballPlayerDetail>(
    `/football/player/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );
}
