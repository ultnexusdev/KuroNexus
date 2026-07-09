"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { deleteUniverse, fetchAdminUniverses } from "@/lib/admin/api";
import type { WikiUniverseSummary } from "@/lib/api/types";
import { AdminGuard } from "@/components/admin/AdminGuard";
import styles from "./page.module.css";

function AdminUniversesList() {
  const t = useTranslations("admin.universes");
  const [universes, setUniverses] = useState<WikiUniverseSummary[] | null>(
    null,
  );
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setError(false);
    try {
      setUniverses(await fetchAdminUniverses());
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete(universe: WikiUniverseSummary) {
    if (!window.confirm(t("confirmDelete", { name: universe.name }))) {
      return;
    }
    try {
      await deleteUniverse(universe.id);
      await load();
    } catch {
      setError(true);
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>{t("title")}</h1>
        <Link href="/admin/universes/new" className="btn">
          {t("new")}
        </Link>
      </div>

      {error ? <p className={styles.error}>{t("loadError")}</p> : null}
      {universes !== null && universes.length === 0 ? (
        <p className={styles.empty}>{t("empty")}</p>
      ) : null}

      {universes !== null && universes.length > 0 ? (
        <ul className={styles.list}>
          {universes.map((universe) => (
            <li key={universe.id} className={styles.item}>
              <div className={styles.itemInfo}>
                <span className={styles.itemTitle}>{universe.name}</span>
              </div>
              <div className={styles.itemActions}>
                <Link href={`/admin/universes/${universe.id}`} className="btn">
                  {t("edit")}
                </Link>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => void handleDelete(universe)}
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

export default function AdminUniversesPage() {
  return (
    <AdminGuard>
      <AdminUniversesList />
    </AdminGuard>
  );
}
