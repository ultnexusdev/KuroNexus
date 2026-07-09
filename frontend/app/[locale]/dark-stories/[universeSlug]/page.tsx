import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { fetchUniverseBySlug } from "@/lib/api/universes";
import type { WikiUniverse } from "@/lib/api/types";
import { ContentCard } from "@/components/ContentCard";
import styles from "./page.module.css";

async function getUniverse(slug: string): Promise<WikiUniverse | null> {
  try {
    return await fetchUniverseBySlug(slug);
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
  params: Promise<{ locale: string; universeSlug: string }>;
}): Promise<Metadata> {
  const { universeSlug } = await params;
  const universe = await getUniverse(universeSlug);
  return { title: universe?.name ?? "KuroNexus" };
}

export default async function UniverseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; universeSlug: string }>;
}) {
  const { locale, universeSlug } = await params;
  const universe = await getUniverse(universeSlug);
  if (!universe) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "stories" });
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  });

  return (
    <section className={styles.page}>
      <Link href="/dark-stories" className={styles.back}>
        {t("backToList")}
      </Link>
      <h1 className={styles.heading}>{universe.name}</h1>
      {universe.description ? (
        <p className={styles.description}>{universe.description}</p>
      ) : null}
      {universe.stories.length === 0 ? (
        <p className={styles.empty}>{t("empty")}</p>
      ) : (
        <ul className={styles.list}>
          {universe.stories.map((story) => (
            <li key={story.id}>
              <ContentCard
                href={`/dark-stories/${universeSlug}/${story.slug}`}
                coverImage={story.coverImage}
                title={story.title}
                subtitle={story.excerpt}
                dateTime={story.publishedAt}
                dateLabel={
                  story.publishedAt
                    ? dateFormatter.format(new Date(story.publishedAt))
                    : null
                }
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
