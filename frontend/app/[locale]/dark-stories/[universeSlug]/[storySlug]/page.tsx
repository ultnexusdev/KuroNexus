import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { apiFetch, apiUrl, ApiError } from "@/lib/api/client";
import type { Story } from "@/lib/api/types";
import { legacyPlainTextToHtml } from "@/lib/content/legacyPlainTextToHtml";
import styles from "./page.module.css";
import { PaginatedReader } from "@/components/story/PaginatedReader";

async function getStory(slug: string): Promise<Story | null> {
  try {
    return await apiFetch<Story>(`/stories/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; universeSlug: string; storySlug: string }>;
}): Promise<Metadata> {
  const { storySlug } = await params;
  const story = await getStory(storySlug);
  return { title: story?.title ?? "KuroNexus" };
}

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; universeSlug: string; storySlug: string }>;
}) {
  const { locale, universeSlug, storySlug } = await params;
  const story = await getStory(storySlug);
  if (!story || story.universe?.slug !== universeSlug) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "stories" });
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  });

  const coverImageUrl = story.coverImage ? apiUrl(story.coverImage) : undefined;
  const dateFormatted = story.publishedAt
    ? dateFormatter.format(new Date(story.publishedAt))
    : undefined;

  return (
    <article className={styles.page}>
      <Link href={`/dark-stories/${universeSlug}`} className={styles.back}>
        {t("backToUniverse", { name: story.universe.name })}
      </Link>
      
      <PaginatedReader
        title={story.title}
        content={legacyPlainTextToHtml(story.content)}
        coverImage={coverImageUrl}
        date={dateFormatted}
        prevLabel={t("prevPage")}
        nextLabel={t("nextPage")}
      />
    </article>
  );
}
