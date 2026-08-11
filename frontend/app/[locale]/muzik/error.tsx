"use client";

import { useTranslations } from "next-intl";
import styles from "./error.module.css";

/**
 * Müzik kanadının hata ekranı.
 *
 * ── NEDEN VAR ─────────────────────────────────────────────────────────────
 * `lib/api/music.ts`teki dört getirici hatayı YAKALAMIYOR ve bilinçli olarak
 * buraya bırakıyor. Gerekçe STATE.md bulgu Ö-8: bu projede getiriciler bir
 * dönem `catch` içinde boş dizi döndürüyordu ve salon "arşiv boş" yazısı
 * gösteriyordu — ziyaretçi gerçek boşlukla arızayı ayırt edemiyordu. İki
 * durum AYNI ŞEY DEĞİL ve ayrı ekran hak ediyor.
 *
 * Metin `messages/*.json` içindeki paylaşılan `pageState.error` anahtarından
 * (kural 1) — kanada özel bir metin yazmak aynı cümleyi yedinci kez
 * çevirmek olurdu.
 *
 * Hata ayrıntısı ziyaretçiye gösterilMİYOR (kural 6); yalnızca `digest`
 * kimliği görünüyor ki kullanıcı bildirirken hangi hata olduğunu
 * söyleyebilsin.
 */
export default function MusicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("pageState.error");

  return (
    <div className={styles.wrap} data-category="muzik">
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
