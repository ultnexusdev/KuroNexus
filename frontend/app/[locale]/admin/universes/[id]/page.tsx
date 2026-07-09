"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { fetchAdminUniverse } from "@/lib/admin/api";
import type { WikiUniverseSummary } from "@/lib/api/types";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { UniverseForm } from "@/components/admin/UniverseForm";
import styles from "../page.module.css";

function EditUniverse() {
  const t = useTranslations("admin.universes");
  const params = useParams<{ id: string }>();
  const [universe, setUniverse] = useState<WikiUniverseSummary | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchAdminUniverse(params.id)
      .then(setUniverse)
      .catch(() => setError(true));
  }, [params.id]);

  return (
    <>
      <section className={styles.page}>
        <h1 className={styles.heading}>{t("editTitle")}</h1>
        {error ? <p className={styles.error}>{t("loadError")}</p> : null}
      </section>
      {universe ? <UniverseForm universe={universe} /> : null}
    </>
  );
}

export default function EditUniversePage() {
  return (
    <AdminGuard>
      <EditUniverse />
    </AdminGuard>
  );
}
