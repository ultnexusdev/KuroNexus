"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import {
  deleteWikiEntry,
  fetchAdminUniverses,
  fetchAdminWikiEntries,
} from "@/lib/admin/api";
import type {
  AdminWikiEntrySummary,
  WikiUniverseSummary,
} from "@/lib/api/types";
import { AdminGuard } from "@/components/admin/AdminGuard";
import styles from "./page.module.css";

function AdminWikiList() {
  const t = useTranslations("admin.wiki");
  const tWiki = useTranslations("wiki");
  const [entries, setEntries] = useState<AdminWikiEntrySummary[] | null>(null);
  const [universes, setUniverses] = useState<WikiUniverseSummary[]>([]);
  const [universeFilter, setUniverseFilter] = useState("");
  const [error, setError] = useState(false);

  const load = useCallback(async (universeId: string) => {
    setError(false);
    try {
      setEntries(await fetchAdminWikiEntries(universeId || undefined));
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    void load(universeFilter);
  }, [load, universeFilter]);

  useEffect(() => {
    fetchAdminUniverses()
      .then(setUniverses)
      .catch(() => undefined);
  }, []);

  async function handleDelete(entry: AdminWikiEntrySummary) {
    if (!window.confirm(t("confirmDelete", { title: entry.title }))) {
      return;
    }
    try {
      await deleteWikiEntry(entry.id);
      await load(universeFilter);
    } catch {
      setError(true);
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>{t("title")}</h1>
        <Link href="/admin/wiki/new" className="btn">
          {t("new")}
        </Link>
      </div>

      <label className={styles.filter}>
        <span>{t("universeFilter")}</span>
        <select
          value={universeFilter}
          onChange={(event) => setUniverseFilter(event.target.value)}
        >
          <option value="">{t("allUniverses")}</option>
          {universes.map((universe) => (
            <option key={universe.id} value={universe.id}>
              {universe.name}
            </option>
          ))}
        </select>
      </label>

      {error ? <p className={styles.error}>{t("loadError")}</p> : null}
      {entries !== null && entries.length === 0 ? (
        <p className={styles.empty}>{t("empty")}</p>
      ) : null}

      {entries !== null && entries.length > 0 ? (
        <ul className={styles.list}>
          {entries.map((entry) => (
            <li key={entry.id} className={styles.item}>
              <div className={styles.itemInfo}>
                <span className={styles.itemTitle}>{entry.title}</span>
                <span className={styles.itemMeta}>
                  {entry.universe.name}
                  {" · "}
                  {tWiki(`categories.${entry.category}`)}
                </span>
              </div>
              <div className={styles.itemActions}>
                <Link href={`/admin/wiki/${entry.id}`} className="btn">
                  {t("edit")}
                </Link>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => void handleDelete(entry)}
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

export default function AdminWikiPage() {
  return (
    <AdminGuard>
      <AdminWikiList />
    </AdminGuard>
  );
}
