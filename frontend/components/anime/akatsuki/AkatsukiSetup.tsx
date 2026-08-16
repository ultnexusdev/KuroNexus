"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import {
  setupAkatsukiImages,
  type AkatsukiSetupSummary,
} from "@/lib/admin/api";
import styles from "./AkatsukiSetup.module.css";

/**
 * Küratör kuşağı — sergi görsellerinin tek tuşla kurulumu.
 *
 * Yalnızca admin'e sunucu tarafında çizilir (ziyaretçi bu adayı hiç
 * indirmez); yetkinin gerçek kapısı backend'de. Kurulum idempotent olduğu
 * için düğme "tehlikeli" değil: var olan yuva atlanır.
 */
export function AkatsukiSetup() {
  const t = useTranslations("akatsuki.curator");
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState<AkatsukiSetupSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const result = await setupAkatsukiImages();
      setSummary(result);
      // Yeni görseller sunucu bileşenlerine ansızın insin
      router.refresh();
    } catch (cause) {
      // Hata sebebi çağırana kadar taşınır — anahtar çevrilemiyorsa kendisi
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.panel}>
      <p className={styles.title}>{t("title")}</p>
      <p className={styles.hint}>{t("hint")}</p>
      <button
        type="button"
        className={styles.run}
        onClick={run}
        disabled={busy}
      >
        {busy ? t("running") : t("run")}
      </button>

      {summary ? (
        <p className={styles.result}>
          {t("done", {
            created: summary.created,
            exists: summary.exists,
            failed: summary.failed,
          })}
        </p>
      ) : null}

      {summary && summary.failed > 0 ? (
        <ul className={styles.failures}>
          {summary.results
            .filter((row) => row.status === "failed")
            .map((row) => (
              <li key={`${row.characterId}-${row.slot}-${row.abilityName}`}>
                {row.characterId}/{row.slot}
                {row.abilityName ? `/${row.abilityName}` : ""} — {row.reason}
              </li>
            ))}
        </ul>
      ) : null}

      {error ? (
        <p className={styles.error}>{t("error", { reason: error })}</p>
      ) : null}
    </div>
  );
}
