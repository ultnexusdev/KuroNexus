import { apiFetch } from "./client";
import type { WikiUniverse, WikiUniverseSummary, UniverseCategory } from "./types";

export function fetchUniverses(): Promise<WikiUniverseSummary[]> {
  return apiFetch<WikiUniverseSummary[]>("/universes", {
    next: { revalidate: 60 },
  });
}

export function fetchUniverseBySlug(slug: string): Promise<WikiUniverse> {
  return apiFetch<WikiUniverse>(`/universes/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60 },
  });
}

export function fetchCategories(): Promise<UniverseCategory[]> {
  return apiFetch<UniverseCategory[]>("/universe-categories", {
    next: { revalidate: 60 },
  });
}
