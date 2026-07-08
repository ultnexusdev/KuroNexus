"use client";

import { useTranslations } from "next-intl";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { StoryForm } from "@/components/admin/StoryForm";
import styles from "../page.module.css";

export default function NewStoryPage() {
  const t = useTranslations("admin.stories");

  return (
    <AdminGuard>
      <section className={styles.page}>
        <h1 className={styles.heading}>{t("newTitle")}</h1>
      </section>
      <StoryForm />
    </AdminGuard>
  );
}
