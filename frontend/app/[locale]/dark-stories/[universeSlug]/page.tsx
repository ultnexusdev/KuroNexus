import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl, ApiError } from "@/lib/api/client";
import { fetchUniverseBySlug } from "@/lib/api/universes";
import { fetchWikiEntries } from "@/lib/api/wiki";
import type { WikiEntrySummary, WikiUniverse } from "@/lib/api/types";
import { ContentCard } from "@/components/ContentCard";
import { WikiSection } from "@/components/wiki/WikiSection";
import {
  CornerFiligree,
  RunicMargin,
} from "@/components/kadim/CodexOrnaments";
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

async function getWikiEntries(slug: string): Promise<WikiEntrySummary[]> {
  try {
    return await fetchWikiEntries(slug);
  } catch {
    // Wiki listesi alınamazsa evren sayfası çökmez (kural 4 ruhu)
    return [];
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
  const [universe, wikiEntries] = await Promise.all([
    getUniverse(universeSlug),
    getWikiEntries(universeSlug),
  ]);
  if (!universe) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "stories" });
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  });

  const title = universe.name.toLocaleUpperCase(locale);

  return (
    <div data-category="kadim-dunyalar" className={styles.wing}>
      {universe.coverImage ? (
        <header className={styles.hero}>
          <Image
            src={apiUrl(universe.coverImage)}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.heroImg}
          />
          <div className={styles.heroOverlay} />
          <div className={styles.heroInner}>
            <Link href="/dark-stories" className={styles.back}>
              {t("backToList")}
            </Link>
            <span className={styles.eyebrow}>{t("wingAncient")}</span>
            <h1 className={styles.title}>{title}</h1>
            <span className={styles.rule}>
              <span className={styles.diamond}>❖</span>
            </span>
          </div>
        </header>
      ) : (
        <header className={`${styles.hero} ${styles.heroPlain}`}>
          <div className={styles.heroInner}>
            <Link href="/dark-stories" className={styles.back}>
              {t("backToList")}
            </Link>
            <span className={styles.eyebrow}>{t("wingAncient")}</span>
            <h1 className={styles.title}>{title}</h1>
            <span className={styles.rule}>
              <span className={styles.diamond}>❖</span>
            </span>
          </div>
        </header>
      )}

      <section className={styles.codex}>
        <RunicMargin side="left" />
        <RunicMargin side="right" />
        <CornerFiligree corner="tl" />
        <CornerFiligree corner="tr" />
        <CornerFiligree corner="bl" />
        <CornerFiligree corner="br" />

        {universe.description ? (
          <p className={styles.description}>{universe.description}</p>
        ) : null}

        {universe.stories.length === 0 ? (
          <p className={styles.empty}>{t("empty")}</p>
        ) : (
          <>
            <h2 className={styles.sectionLabel}>{t("volumes")}</h2>
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
                    variant="vertical"
                  />
                </li>
              ))}
            </ul>
          </>
        )}

        <WikiSection universeSlug={universeSlug} entries={wikiEntries} />
      </section>
    </div>
  );
}
