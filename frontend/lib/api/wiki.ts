import { apiFetch } from "./client";
import type { WikiEntryDetail, WikiEntrySummary } from "./types";

export function fetchWikiEntries(
  universeSlug: string,
): Promise<WikiEntrySummary[]> {
  return apiFetch<WikiEntrySummary[]>(
    `/universes/${encodeURIComponent(universeSlug)}/wiki`,
    { next: { revalidate: 60 } },
  );
}

export function fetchWikiEntry(
  universeSlug: string,
  entrySlug: string,
): Promise<WikiEntryDetail> {
  return apiFetch<WikiEntryDetail>(
    `/universes/${encodeURIComponent(universeSlug)}/wiki/${encodeURIComponent(entrySlug)}`,
    { next: { revalidate: 60 } },
  );
}
