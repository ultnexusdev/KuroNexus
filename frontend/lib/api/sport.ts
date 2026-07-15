import { apiFetch } from "./client";
import type { SportBundle } from "./types";

export function fetchSportBundle(universeSlug: string): Promise<SportBundle> {
  return apiFetch<SportBundle>(
    `/sport/${encodeURIComponent(universeSlug)}`,
    { next: { revalidate: 60 } },
  );
}
