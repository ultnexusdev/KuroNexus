import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { fetchUniverses } from "@/lib/api/universes";
import type { WikiUniverseSummary } from "@/lib/api/types";
import { ContentCard } from "@/components/ContentCard";
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

async function getUniverses(): Promise<WikiUniverseSummary[]> {
  try {
    return await fetchUniverses();
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
  const universes = await getUniverses();

  return (
    <section className={styles.page}>
      <h1 className={styles.heading}>{t("listTitle")}</h1>
      {universes.length === 0 ? (
        <p className={styles.empty}>{t("emptyUniverses")}</p>
      ) : (
        <ul className={styles.list}>
          {universes.map((universe) => (
            <li key={universe.id}>
              <ContentCard
                href={`/dark-stories/${universe.slug}`}
                coverImage={universe.coverImage}
                title={universe.name}
                subtitle={universe.description}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
