import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchCategories, fetchUniverses } from "@/lib/api/universes";
import { ContentCard } from "@/components/ContentCard";
import { apiUrl } from "@/lib/api/client";
import { Link } from "@/lib/i18n/navigation";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  try {
    const categories = await fetchCategories();
    const category = categories.find((c) => c.slug === categorySlug);
    if (!category) return {};
    return { title: category.name };
  } catch {
    return {};
  }
}

export const dynamic = "force-dynamic";

export default async function CategoryUniversesPage({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string }>;
}) {
  const { locale, categorySlug } = await params;
  const t = await getTranslations({ locale, namespace: "stories" });

  const [categories, allUniverses] = await Promise.all([
    fetchCategories(),
    fetchUniverses(),
  ]);

  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) {
    notFound();
  }

  const universes = allUniverses.filter((u) => u.categoryId === category.id);

  return (
    <section className={styles.page}>
      <Link href="/dark-stories" className={styles.backLink}>
        {t("backToList")}
      </Link>

      {category.coverImage && (
        <div className={styles.bannerWrapper}>
          <Image
            src={apiUrl(category.coverImage)}
            alt={category.name}
            fill
            className={styles.bannerImage}
            priority
          />
          <div className={styles.bannerOverlay}>
            <h1 className={styles.bannerTitle}>{category.name}</h1>
            {category.description && (
              <p className={styles.bannerDesc}>{category.description}</p>
            )}
          </div>
        </div>
      )}

      {!category.coverImage && (
        <h1 className={styles.heading}>{category.name}</h1>
      )}

      {universes.length === 0 ? (
        <p className={styles.empty}>{t("emptyCategory")}</p>
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
