import { apiFetch } from "./client";
import type { WikiUniverse, WikiUniverseSummary, UniverseCategory } from "./types";

export function fetchUniverses(): Promise<WikiUniverseSummary[]> {
  return apiFetch<WikiUniverseSummary[]>("/universes", {
    cache: "no-store",
  });
}

export function fetchUniverseBySlug(slug: string): Promise<WikiUniverse> {
  return apiFetch<WikiUniverse>(`/universes/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
}

export function fetchCategories(): Promise<UniverseCategory[]> {
  return apiFetch<UniverseCategory[]>("/universe-categories", {
    cache: "no-store",
  });
}
