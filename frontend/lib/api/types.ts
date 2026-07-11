export interface StorySummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Story extends StorySummary {
  content: string;
  universeId?: string | null;
  universe?: { slug: string; name: string } | null;
}

export interface WikiUniverseSummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WikiUniverse extends WikiUniverseSummary {
  stories: StorySummary[];
}

export type WikiCategory =
  | "CHARACTER"
  | "LOCATION"
  | "TERM"
  | "EVENT"
  | "ITEM"
  | "ORGANIZATION"
  | "MAGIC_SYSTEM";

export interface WikiEntrySummary {
  id: string;
  title: string;
  slug: string;
  category: WikiCategory;
  coverImage: string | null;
  spoilerTier: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface WikiEntryDetail extends WikiEntrySummary {
  content: string;
  universeId: string;
  universe?: { slug: string; name: string };
}

export interface AdminWikiEntrySummary extends WikiEntrySummary {
  universe: { id: string; name: string; slug: string };
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
}

export interface LoginResult {
  accessToken: string;
  user: AuthenticatedUser;
}

export interface UploadResult {
  id: string;
  url: string;
}
