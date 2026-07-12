"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { UniverseCategoryForm } from "@/components/admin/UniverseCategoryForm";
import styles from "../../universes/page.module.css";

export default function NewCategoryPage() {
  const t = useTranslations("admin.universeCategories");

  return (
    <AdminGuard>
      <section className={styles.page}>
        <div className={styles.header}>
          <Link href="/admin/universe-categories" className={styles.backLink}>
            ←
          </Link>
          <h1 className={styles.heading}>{t("newTitle")}</h1>
        </div>
        <UniverseCategoryForm />
      </section>
    </AdminGuard>
  );
}
