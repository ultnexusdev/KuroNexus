import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl, ApiError } from "@/lib/api/client";
import { fetchWikiEntry } from "@/lib/api/wiki";
import type { WikiEntryDetail } from "@/lib/api/types";
import { legacyPlainTextToHtml } from "@/lib/content/legacyPlainTextToHtml";
import { SpoilerGate } from "@/components/wiki/SpoilerGate";
import { shareCard } from "@/lib/seo";
import styles from "./page.module.css";
import { universeHref } from "@/lib/sport/routes";

async function getEntry(
  universeSlug: string,
  entrySlug: string,
): Promise<WikiEntryDetail | null> {
  try {
    return await fetchWikiEntry(universeSlug, entrySlug);
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
  params: Promise<{ locale: string; universeSlug: string; entrySlug: string }>;
}): Promise<Metadata> {
  const { locale, universeSlug, entrySlug } = await params;
  const entry = await getEntry(universeSlug, entrySlug);
  const title = entry?.title ?? "KuroNexus";
  return {
    title,
    // Künye yoksa jenerik başlık kalır; spoiler kapılı kapak karta sızmaz
    ...(entry
      ? shareCard({
          title,
          locale,
          path: `/dark-stories/${universeSlug}/wiki/${entrySlug}`,
          image:
            entry.coverImage && entry.spoilerTier === null
              ? apiUrl(entry.coverImage)
              : undefined,
        })
      : {}),
  };
}

export default async function WikiEntryPage({
  params,
}: {
  params: Promise<{ locale: string; universeSlug: string; entrySlug: string }>;
}) {
  const { locale, universeSlug, entrySlug } = await params;
  const entry = await getEntry(universeSlug, entrySlug);
  if (!entry) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "wiki" });
  const tStories = await getTranslations({ locale, namespace: "stories" });

  return (
    <article className={styles.page}>
      <Link href={universeHref(universeSlug)} className={styles.back}>
        {tStories("backToUniverse", { name: entry.universe?.name ?? "" })}
      </Link>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{entry.title}</h1>
        <span className={styles.category}>
          {t(`categories.${entry.category}`)}
        </span>
      </div>
      <SpoilerGate universeSlug={universeSlug} spoilerTier={entry.spoilerTier}>
        {entry.coverImage ? (
          <Image
            src={apiUrl(entry.coverImage)}
            alt=""
            width={960}
            height={540}
            className={styles.cover}
            priority
          />
        ) : null}
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{
            __html: legacyPlainTextToHtml(entry.content),
          }}
        />
      </SpoilerGate>
    </article>
  );
}
