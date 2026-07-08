"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { deleteStory, fetchAdminStories } from "@/lib/admin/api";
import type { StorySummary } from "@/lib/api/types";
import { AdminGuard } from "@/components/admin/AdminGuard";
import styles from "./page.module.css";

function AdminStoriesList() {
  const t = useTranslations("admin.stories");
  const locale = useLocale();
  const [stories, setStories] = useState<StorySummary[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setError(false);
    try {
      setStories(await fetchAdminStories());
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete(story: StorySummary) {
    if (!window.confirm(t("confirmDelete", { title: story.title }))) {
      return;
    }
    try {
      await deleteStory(story.id);
      await load();
    } catch {
      setError(true);
    }
  }

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  });

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>{t("title")}</h1>
        <Link href="/admin/stories/new" className="btn">
          {t("new")}
        </Link>
      </div>

      {error ? <p className={styles.error}>{t("loadError")}</p> : null}
      {stories !== null && stories.length === 0 ? (
        <p className={styles.empty}>{t("empty")}</p>
      ) : null}

      {stories !== null && stories.length > 0 ? (
        <ul className={styles.list}>
          {stories.map((story) => (
            <li key={story.id} className={styles.item}>
              <div className={styles.itemInfo}>
                <span className={styles.itemTitle}>{story.title}</span>
                <span className={styles.itemMeta}>
                  {story.isPublished ? (
                    <span className={styles.published}>{t("published")}</span>
                  ) : (
                    <span className={styles.draft}>{t("draft")}</span>
                  )}
                  {" · "}
                  {dateFormatter.format(new Date(story.updatedAt))}
                </span>
              </div>
              <div className={styles.itemActions}>
                <Link href={`/admin/stories/${story.id}`} className="btn">
                  {t("edit")}
                </Link>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => void handleDelete(story)}
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

export default function AdminStoriesPage() {
  return (
    <AdminGuard>
      <AdminStoriesList />
    </AdminGuard>
  );
}
