"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ContentCard } from "@/components/ContentCard";
import { apiUrl } from "@/lib/api/client";
import type { WikiUniverseSummary, UniverseCategory } from "@/lib/api/types";
import styles from "./CategoryTabs.module.css";

export function CategoryTabs({
  universes,
  categories,
}: {
  universes: WikiUniverseSummary[];
  categories: UniverseCategory[];
}) {
  const t = useTranslations("admin.universeCategories.form");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  const filteredUniverses =
    activeCategoryId === null
      ? universes
      : universes.filter((u) => u.categoryId === activeCategoryId);

  return (
    <div className={styles.container}>
      <div className={styles.tabs} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeCategoryId === null}
          className={styles.tab}
          onClick={() => setActiveCategoryId(null)}
        >
          {/* We can use a generic 'All' text here */}
          Tümü
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={activeCategoryId === cat.id}
            className={styles.tab}
            onClick={() => setActiveCategoryId(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {activeCategory && activeCategory.coverImage && (
        <div className={styles.bannerWrapper}>
          <Image
            src={apiUrl(activeCategory.coverImage)}
            alt={activeCategory.name}
            fill
            className={styles.bannerImage}
            priority
          />
          <div className={styles.bannerOverlay}>
            <h2 className={styles.bannerTitle}>{activeCategory.name}</h2>
            {activeCategory.description && (
              <p className={styles.bannerDesc}>{activeCategory.description}</p>
            )}
          </div>
        </div>
      )}

      {filteredUniverses.length === 0 ? (
        <p className={styles.empty}>Bu kategoride henüz içerik yok.</p>
      ) : (
        <ul className={styles.grid}>
          {filteredUniverses.map((universe) => (
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
    </div>
  );
}
