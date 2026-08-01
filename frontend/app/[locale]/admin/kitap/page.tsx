"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminGuard } from "@/components/admin/AdminGuard";
import {
  approveGenre,
  backfillBookCredits,
  backfillPersonPhotos,
  getPendingGenres,
  localizeBookCovers,
  rejectGenre,
  type BookMaintenanceResult,
  type PendingGenre,
} from "@/lib/admin/api";
import styles from "./page.module.css";

/**
 * Kitap arşivinin bakım ekranı.
 *
 * Buradaki iki düğme daha önce yalnızca komut satırından çalıştırılabiliyordu;
 * kullanıcı isteği üzerine arayüze alındı. İkisi de **tekrar çalıştırılabilir**
 * (idempotent): zaten yerelleşmiş kapağa ya da kurulmuş bağa dokunmuyorlar.
 *
 * Onay bekleyen türler: kaynaktan gelip sözlükte karşılığı olmayan adlar.
 * Otomatik kabul edilselerdi tür süzgeci aynı kavramın varyantlarıyla dolardı,
 * o yüzden burada elle geçiyorlar.
 */
export default function BookAdminPage() {
  const t = useTranslations("admin.books");
  const [genres, setGenres] = useState<PendingGenre[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadGenres = useCallback(async () => {
    try {
      setGenres(await getPendingGenres());
    } catch {
      setError(t("loadFailed"));
    }
  }, [t]);

  useEffect(() => {
    void loadGenres();
  }, [loadGenres]);

  /** Bakım işlerinin hepsi aynı kalıpta: kilitle, çalıştır, sonucu yaz. */
  async function run(
    key: string,
    task: () => Promise<BookMaintenanceResult>,
    format: (result: BookMaintenanceResult) => string,
  ) {
    setBusy(key);
    setMessage(null);
    setError(null);
    try {
      setMessage(format(await task()));
    } catch {
      setError(t("taskFailed"));
    } finally {
      setBusy(null);
    }
  }

  async function review(id: string, approve: boolean) {
    setBusy(id);
    setError(null);
    try {
      await (approve ? approveGenre(id) : rejectGenre(id));
      // Listeyi yeniden çekmek yerine yerinde düşür: tek satırlık değişiklik
      // için sunucuya gitmek gereksiz
      setGenres((current) => current.filter((genre) => genre.id !== id));
    } catch {
      setError(t("taskFailed"));
    } finally {
      setBusy(null);
    }
  }

  return (
    <AdminGuard>
      <section className={styles.page}>
        <h1 className={styles.title}>{t("title")}</h1>

        <section className={styles.block}>
          <h2 className={styles.blockTitle}>{t("maintenance")}</h2>
          <p className={styles.hint}>{t("maintenanceHint")}</p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.action}
              disabled={busy !== null}
              onClick={() =>
                run("covers", localizeBookCovers, (result) =>
                  t("coversDone", {
                    scanned: result.scanned,
                    done: result.localized ?? 0,
                  }),
                )
              }
            >
              {busy === "covers" ? t("running") : t("localizeCovers")}
            </button>
            <button
              type="button"
              className={styles.action}
              disabled={busy !== null}
              onClick={() =>
                run("credits", backfillBookCredits, (result) =>
                  t("creditsDone", {
                    scanned: result.scanned,
                    done: result.linked ?? 0,
                  }),
                )
              }
            >
              {busy === "credits" ? t("running") : t("backfillCredits")}
            </button>
            {/* Portre normalde kişi sayfası ilk açıldığında iniyor; salonun
                yazar paneli de onları gösterdiği için tek seferde kapatmak
                gerekiyor. Kaynağın kuyruğu saniyede bir istek geçiriyor,
                onlarca yazarda bu iş uzun sürebilir */}
            <button
              type="button"
              className={styles.action}
              disabled={busy !== null}
              onClick={() =>
                run("photos", backfillPersonPhotos, (result) =>
                  t("photosDone", {
                    scanned: result.scanned,
                    done: result.filled ?? 0,
                  }),
                )
              }
            >
              {busy === "photos" ? t("running") : t("backfillPhotos")}
            </button>
          </div>
          {message ? <p className={styles.ok}>{message}</p> : null}
          {error ? <p className={styles.error}>{error}</p> : null}
        </section>

        <section className={styles.block}>
          <h2 className={styles.blockTitle}>{t("pendingGenres")}</h2>
          <p className={styles.hint}>{t("pendingGenresHint")}</p>
          {genres.length === 0 ? (
            <p className={styles.empty}>{t("noPendingGenres")}</p>
          ) : (
            <ul className={styles.genreList}>
              {genres.map((genre) => (
                <li key={genre.id} className={styles.genreRow}>
                  <span className={styles.genreName}>{genre.name}</span>
                  <span className={styles.genreCount}>
                    {t("genreBookCount", { count: genre.bookCount })}
                  </span>
                  <button
                    type="button"
                    className={styles.approve}
                    disabled={busy !== null}
                    onClick={() => void review(genre.id, true)}
                  >
                    {t("approve")}
                  </button>
                  <button
                    type="button"
                    className={styles.reject}
                    disabled={busy !== null}
                    onClick={() => void review(genre.id, false)}
                  >
                    {t("reject")}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </AdminGuard>
  );
}
