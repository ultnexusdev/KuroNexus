"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { fetchAdminStory } from "@/lib/admin/api";
import type { Story } from "@/lib/api/types";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { StoryForm } from "@/components/admin/StoryForm";
import styles from "../page.module.css";

function EditStory() {
  const t = useTranslations("admin.stories");
  const params = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchAdminStory(params.id)
      .then(setStory)
      .catch(() => setError(true));
  }, [params.id]);

  return (
    <>
      <section className={styles.page}>
        <h1 className={styles.heading}>{t("editTitle")}</h1>
        {error ? <p className={styles.error}>{t("loadError")}</p> : null}
      </section>
      {story ? <StoryForm story={story} /> : null}
    </>
  );
}

export default function EditStoryPage() {
  return (
    <AdminGuard>
      <EditStory />
    </AdminGuard>
  );
}
