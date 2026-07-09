"use client";

import { useTranslations } from "next-intl";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { UniverseForm } from "@/components/admin/UniverseForm";
import styles from "../page.module.css";

export default function NewUniversePage() {
  const t = useTranslations("admin.universes");

  return (
    <AdminGuard>
      <section className={styles.page}>
        <h1 className={styles.heading}>{t("newTitle")}</h1>
      </section>
      <UniverseForm />
    </AdminGuard>
  );
}
