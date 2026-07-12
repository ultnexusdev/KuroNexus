"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { deleteCategory, fetchAdminCategories } from "@/lib/admin/api";
import type { UniverseCategory } from "@/lib/api/types";
import { AdminGuard } from "@/components/admin/AdminGuard";
import styles from "../universes/page.module.css";

function AdminCategoriesList() {
  const t = useTranslations("admin.universeCategories");
  const [categories, setCategories] = useState<UniverseCategory[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setError(false);
    try {
      setCategories(await fetchAdminCategories());
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete(category: UniverseCategory) {
    if (!window.confirm(t("confirmDelete", { name: category.name }))) {
      return;
    }
    try {
      await deleteCategory(category.id);
      await load();
    } catch {
      setError(true);
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>{t("title")}</h1>
        <Link href="/admin/universe-categories/new" className="btn">
          {t("new")}
        </Link>
      </div>

      {error ? <p className={styles.error}>{t("loadError")}</p> : null}
      {categories !== null && categories.length === 0 ? (
        <p className={styles.empty}>{t("empty")}</p>
      ) : null}

      {categories !== null && categories.length > 0 ? (
        <ul className={styles.list}>
          {categories.map((category) => (
            <li key={category.id} className={styles.item}>
              <div className={styles.itemInfo}>
                <span className={styles.itemTitle}>{category.name}</span>
              </div>
              <div className={styles.itemActions}>
                <Link href={`/admin/universe-categories/${category.id}`} className="btn">
                  {t("edit")}
                </Link>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => void handleDelete(category)}
                >
                  {t("delete")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default function AdminCategoriesPage() {
  return (
    <AdminGuard>
      <AdminCategoriesList />
    </AdminGuard>
  );
}
