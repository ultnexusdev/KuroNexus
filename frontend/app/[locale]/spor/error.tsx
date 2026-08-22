"use client";

import { useTranslations } from "next-intl";
import styles from "./error.module.css";

/**
 * Spor kanadının hata ekranı — müzik/anime kanatlarıyla aynı desen ve gerekçe
 * (STATE.md bulgu Ö-8): boş arşiv ile ulaşılamayan arşiv aynı şey değil,
 * ayrı ekran hak ediyor.
 *
 * ⚠️ Bu dosya yokken spor sayfaları hatayı "Next'in hata sınırına" fırlatıyordu
 * ama ağaçta hiçbir error.tsx YOKTU — ziyaretçi Next'in çıplak İngilizce hata
 * ekranına düşüyordu (2026-08-22 denetim bulgusu). Sayfalardaki fırlatma
 * yorumları bu dosyanın varlığını varsayıyor; artık gerçekten var.
 *
 * Metin paylaşılan `pageState.error` anahtarından (kural 1); ziyaretçiye
 * yalnızca `digest` kimliği gösteriliyor (kural 6).
 */
export default function SportError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("pageState.error");

  return (
    <div className={styles.wrap} data-category="spor">
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
