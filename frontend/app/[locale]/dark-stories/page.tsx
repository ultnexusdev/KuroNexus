import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { apiFetch, apiUrl } from "@/lib/api/client";
import type { StorySummary } from "@/lib/api/types";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "stories" });
  return { title: t("listTitle") };
}

async function getStories(): Promise<StorySummary[]> {
  try {
    return await apiFetch<StorySummary[]>("/stories", {
      next: { revalidate: 60 },
    });
  } catch {
    // Backend erişilemezse sayfa çökmez, boş durum gösterilir (kural 4 ruhu)
    return [];
  }
}

export default async function DarkStoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "stories" });
  const stories = await getStories();
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  });

  return (
    <section className={styles.page}>
      <h1 className={styles.heading}>{t("listTitle")}</h1>
      {stories.length === 0 ? (
        <p className={styles.empty}>{t("empty")}</p>
      ) : (
        <ul className={styles.list}>
          {stories.map((story) => (
            <li key={story.id}>
              <Link
                href={`/dark-stories/${story.slug}`}
                className={styles.card}
              >
                {story.coverImage ? (
                  <Image
                    src={apiUrl(story.coverImage)}
                    alt=""
                    width={640}
                    height={360}
                    className={styles.cover}
                  />
                ) : null}
                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>{story.title}</h2>
                  {story.excerpt ? (
                    <p className={styles.cardExcerpt}>{story.excerpt}</p>
                  ) : null}
                  {story.publishedAt ? (
                    <time
                      className={styles.cardDate}
                      dateTime={story.publishedAt}
                    >
                      {dateFormatter.format(new Date(story.publishedAt))}
                    </time>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
