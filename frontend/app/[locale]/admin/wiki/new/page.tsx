"use client";

import { useTranslations } from "next-intl";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { WikiEntryForm } from "@/components/admin/WikiEntryForm";
import styles from "../page.module.css";

export default function NewWikiEntryPage() {
  const t = useTranslations("admin.wiki");

  return (
    <AdminGuard>
      <section className={styles.page}>
        <h1 className={styles.heading}>{t("newTitle")}</h1>
      </section>
      <WikiEntryForm />
    </AdminGuard>
  );
}
