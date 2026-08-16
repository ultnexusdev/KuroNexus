"use client";

import { useTranslations } from "next-intl";
import styles from "./error.module.css";

/**
 * Anime kanadının hata ekranı — müzik kanadıyla aynı desen ve gerekçe
 * (STATE.md bulgu Ö-8): boş arşiv ile ulaşılamayan arşiv aynı şey değil,
 * ayrı ekran hak ediyor. Metin paylaşılan `pageState.error` anahtarından
 * (kural 1); ziyaretçiye yalnızca `digest` kimliği gösteriliyor (kural 6).
 */
export default function AnimeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("pageState.error");

  return (
    <div className={styles.wrap} data-category="anime">
      <h1 className={styles.title}>{t("title")}</h1>
      <p className={styles.body}>{t("text")}</p>
      {error.digest ? (
        <p className={styles.digest}>{t("code", { digest: error.digest })}</p>
      ) : null}
      <button type="button" onClick={reset} className={styles.retry}>
        {t("retry")}
      </button>
    </div>
  );
}
