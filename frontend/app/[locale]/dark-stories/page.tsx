import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { fetchCategories } from "@/lib/api/universes";
import type { UniverseCategory } from "@/lib/api/types";
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

export const dynamic = "force-dynamic";

async function getCategories(): Promise<UniverseCategory[]> {
  return fetchCategories();
}

export default async function DarkStoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "stories" });
  const categories = await getCategories();

  return (
    <section className={styles.page}>
      <h1 className={styles.heading}>{t("listTitle")}</h1>
      
      {categories.length === 0 ? (
        <p className={styles.empty}>{t("emptyCategory")}</p>
      ) : (
        <ul className={styles.list}>
          {categories.map((cat) => (
            <li key={cat.id}>
              <ContentCard
                href={`/dark-stories/category/${cat.slug}`}
                coverImage={cat.coverImage}
                title={cat.name}
                subtitle={cat.description}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
