"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { fetchAdminWikiEntry } from "@/lib/admin/api";
import type { WikiEntryDetail } from "@/lib/api/types";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { WikiEntryForm } from "@/components/admin/WikiEntryForm";
import styles from "../page.module.css";

function EditWikiEntry() {
  const t = useTranslations("admin.wiki");
  const params = useParams<{ id: string }>();
  const [entry, setEntry] = useState<WikiEntryDetail | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchAdminWikiEntry(params.id)
      .then(setEntry)
      .catch(() => setError(true));
  }, [params.id]);

  return (
    <>
      <section className={styles.page}>
        <h1 className={styles.heading}>{t("editTitle")}</h1>
        {error ? <p className={styles.error}>{t("loadError")}</p> : null}
      </section>
      {entry ? <WikiEntryForm entry={entry} /> : null}
    </>
  );
}

export default function EditWikiEntryPage() {
  return (
    <AdminGuard>
      <EditWikiEntry />
    </AdminGuard>
  );
}
