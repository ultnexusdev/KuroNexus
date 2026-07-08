import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { apiFetch, apiUrl, ApiError } from "@/lib/api/client";
import type { Story } from "@/lib/api/types";
import styles from "./page.module.css";

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
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(slug);
  return { title: story?.title ?? "KuroNexus" };
}

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const story = await getStory(slug);
  if (!story) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "stories" });
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  });

  return (
    <article className={styles.page}>
      <Link href="/dark-stories" className={styles.back}>
        {t("backToList")}
      </Link>
      <h1 className={styles.title}>{story.title}</h1>
      {story.publishedAt ? (
        <time className={styles.date} dateTime={story.publishedAt}>
          {dateFormatter.format(new Date(story.publishedAt))}
        </time>
      ) : null}
      {story.coverImage ? (
        <Image
          src={apiUrl(story.coverImage)}
          alt=""
          width={960}
          height={540}
          className={styles.cover}
          priority
        />
      ) : null}
      <div className={styles.content}>{story.content}</div>
    </article>
  );
}
