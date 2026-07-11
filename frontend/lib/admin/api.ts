import { apiFetch, apiUrl, ApiError } from "../api/client";
import type {
  AdminWikiEntrySummary,
  AuthenticatedUser,
  LoginResult,
  Story,
  StorySummary,
  UploadResult,
  WikiCategory,
  WikiEntryDetail,
  WikiUniverseSummary,
} from "../api/types";
import { getToken } from "./auth";

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function login(email: string, password: string): Promise<LoginResult> {
  return apiFetch<LoginResult>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export function fetchMe(): Promise<AuthenticatedUser> {
  return apiFetch<AuthenticatedUser>("/auth/me", {
    headers: authHeaders(),
  });
}

export function fetchAdminStories(): Promise<StorySummary[]> {
  return apiFetch<StorySummary[]>("/admin/stories", {
    headers: authHeaders(),
  });
}

export function fetchAdminStory(id: string): Promise<Story> {
  return apiFetch<Story>(`/admin/stories/${id}`, { headers: authHeaders() });
}

export interface StoryInput {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  universeId?: string;
  isPublished?: boolean;
}

export function createStory(input: StoryInput): Promise<Story> {
  return apiFetch<Story>("/admin/stories", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
}

export function updateStory(
  id: string,
  input: Partial<StoryInput>,
): Promise<Story> {
  return apiFetch<Story>(`/admin/stories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
}

export function deleteStory(id: string): Promise<Story> {
  return apiFetch<Story>(`/admin/stories/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

export interface UniverseInput {
  name: string;
  description?: string;
  coverImage?: string;
}

export function fetchAdminUniverses(): Promise<WikiUniverseSummary[]> {
  return apiFetch<WikiUniverseSummary[]>("/admin/universes", {
    headers: authHeaders(),
  });
}

export function fetchAdminUniverse(id: string): Promise<WikiUniverseSummary> {
  return apiFetch<WikiUniverseSummary>(`/admin/universes/${id}`, {
    headers: authHeaders(),
  });
}

export function createUniverse(
  input: UniverseInput,
): Promise<WikiUniverseSummary> {
  return apiFetch<WikiUniverseSummary>("/admin/universes", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
}

export function updateUniverse(
  id: string,
  input: Partial<UniverseInput>,
): Promise<WikiUniverseSummary> {
  return apiFetch<WikiUniverseSummary>(`/admin/universes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
}

export function deleteUniverse(id: string): Promise<WikiUniverseSummary> {
  return apiFetch<WikiUniverseSummary>(`/admin/universes/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

export interface WikiEntryInput {
  title: string;
  content: string;
  category: WikiCategory;
  universeId: string;
  coverImage?: string;
  spoilerTier?: number;
}

export function fetchAdminWikiEntries(
  universeId?: string,
): Promise<AdminWikiEntrySummary[]> {
  const query = universeId
    ? `?universeId=${encodeURIComponent(universeId)}`
    : "";
  return apiFetch<AdminWikiEntrySummary[]>(`/admin/wiki-entries${query}`, {
    headers: authHeaders(),
  });
}

export function fetchAdminWikiEntry(id: string): Promise<WikiEntryDetail> {
  return apiFetch<WikiEntryDetail>(`/admin/wiki-entries/${id}`, {
    headers: authHeaders(),
  });
}

export function createWikiEntry(
  input: WikiEntryInput,
): Promise<WikiEntryDetail> {
  return apiFetch<WikiEntryDetail>("/admin/wiki-entries", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
}

export function updateWikiEntry(
  id: string,
  input: Partial<WikiEntryInput>,
): Promise<WikiEntryDetail> {
  return apiFetch<WikiEntryDetail>(`/admin/wiki-entries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
}

export function deleteWikiEntry(id: string): Promise<WikiEntryDetail> {
  return apiFetch<WikiEntryDetail>(`/admin/wiki-entries/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

export async function uploadImage(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(apiUrl("/admin/uploads"), {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  if (!response.ok) {
    let messageKey = "API.REQUEST_FAILED";
    try {
      const body = (await response.json()) as { message?: string };
      if (typeof body.message === "string") {
        messageKey = body.message;
      }
    } catch {
      // gövde JSON değilse varsayılan anahtar kullanılır
    }
    throw new ApiError(response.status, messageKey);
  }
  return response.json() as Promise<UploadResult>;
}
