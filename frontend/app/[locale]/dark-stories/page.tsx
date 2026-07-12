import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { fetchUniverses, fetchCategories } from "@/lib/api/universes";
import type { WikiUniverseSummary, UniverseCategory } from "@/lib/api/types";
import { CategoryTabs } from "@/components/story/CategoryTabs";
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
    return [];
  }
}

async function getCategories(): Promise<UniverseCategory[]> {
  try {
    return await fetchCategories();
  } catch {
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
  const [universes, categories] = await Promise.all([
    getUniverses(),
    getCategories(),
  ]);

  return (
    <section className={styles.page}>
      <CategoryTabs universes={universes} categories={categories} />
    </section>
  );
}
