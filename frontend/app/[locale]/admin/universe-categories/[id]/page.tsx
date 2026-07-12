"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { fetchAdminCategory } from "@/lib/admin/api";
import type { UniverseCategory } from "@/lib/api/types";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { UniverseCategoryForm } from "@/components/admin/UniverseCategoryForm";
import styles from "../../universes/page.module.css";

function EditCategoryContent({ id }: { id: string }) {
  const t = useTranslations("admin.universeCategories");
  const [category, setCategory] = useState<UniverseCategory | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setError(false);
    try {
      setCategory(await fetchAdminCategory(id));
    } catch {
      setError(true);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (error) {
    return <p className={styles.error}>{t("loadError")}</p>;
  }

  if (!category) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className={styles.header}>
        <Link href="/admin/universe-categories" className={styles.backLink}>
          ←
        </Link>
        <h1 className={styles.heading}>{t("editTitle")}</h1>
      </div>
      <UniverseCategoryForm category={category} />
    </>
  );
}

export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <AdminGuard>
      <section className={styles.page}>
        <EditCategoryContent id={id} />
      </section>
    </AdminGuard>
  );
}
