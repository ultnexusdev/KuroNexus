"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { updateMovieEntry } from "@/lib/admin/api";
import type {
  ArchiveMovie,
  MovieDetail as MovieDetailData,
} from "@/lib/api/types";
import styles from "./MovieDetail.module.css";

/*
 * MovieDetail'in küratör panelleri — AYRI DOSYADA bilerek (2026-09-01
 * denetimi, P-02): yalnızca `isAdmin && curating` iken çizilen bu bileşenler
 * MovieDetail'in içinde durdukça `lib/admin/api` her ziyaretçinin chunk'ına
 * giriyordu. MovieDetail bunları `next/dynamic` + `ssr: false` ile indiriyor
 * (BookDetail deseni).
 */

export function QuickActions({ movie }: { movie: ArchiveMovie }) {
  const t = useTranslations("film.detail");
  const tFilm = useTranslations("film");
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function apply(input: Parameters<typeof updateMovieEntry>[1]) {
    setBusy(true);
    try {
      await updateMovieEntry(movie.id, input);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.quick}>
      <button
        type="button"
        className={movie.status === "WATCHED" ? styles.quickOn : styles.quickBtn}
        disabled={busy}
        onClick={() =>
          void apply({
            status: "WATCHED",
            watchedAt: new Date().toISOString(),
          })
        }
      >
        {tFilm("statusName.WATCHED")}
      </button>
      <button
        type="button"
        className={
          movie.status === "WATCHLIST" ? styles.quickOn : styles.quickBtn
        }
        disabled={busy}
        onClick={() => void apply({ status: "WATCHLIST", watchedAt: "" })}
      >
        {tFilm("statusName.WATCHLIST")}
      </button>
      <button
        type="button"
        className={movie.isFavorite ? styles.quickOn : styles.quickBtn}
        disabled={busy}
        title={t("toggleFavorite")}
        onClick={() => void apply({ isFavorite: !movie.isFavorite })}
      >
        ★ {tFilm("favorite")}
      </button>
    </div>
  );
}

/** Küratörün elle girebildiği alanlar — form durumunun anahtarları. */
const LINK_FIELDS = ["rt", "imdb", "trailer"] as const;

type LinkField = (typeof LINK_FIELDS)[number];

/**
 * Küratör künyesi (yalnızca admin): Rotten Tomatoes adresi, IMDb ve fragman.
 * Üçü de TMDB'den gelenin yerine geçer; alan boşaltılınca yeniden TMDB'ye
 * (RT'de ise arama adresine) dönülür.
 */
export function CuratorLinks({ detail }: { detail: MovieDetailData }) {
  const t = useTranslations("film.detail");
  const router = useRouter();
  const [links, setLinks] = useState<Record<LinkField, string>>(() => ({
    rt: detail.customLinks?.rt ?? "",
    imdb: detail.customLinks?.imdb ?? "",
    trailer: detail.customLinks?.trailer ?? "",
  }));
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<"idle" | "saved" | "error">("idle");

  async function save() {
    setBusy(true);
    setState("idle");
    try {
      await updateMovieEntry(detail.movie.id, { links });
      setState("saved");
      router.refresh();
    } catch {
      setState("error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{t("curatorTitle")}</h2>
      <p className={styles.curatorLede}>{t("curatorLede")}</p>

      <div className={styles.curatorGrid}>
        {LINK_FIELDS.map((field) => (
          <label key={field} className={styles.curatorField}>
            <span>{t(`linkField.${field}`)}</span>
            <input
              type="url"
              value={links[field]}
              disabled={busy}
              placeholder="https://…"
              onChange={(event) =>
                setLinks({ ...links, [field]: event.target.value })
              }
            />
          </label>
        ))}
      </div>

      <div className={styles.curatorActions}>
        <button
          type="button"
          className={styles.curatorSave}
          disabled={busy}
          onClick={() => void save()}
        >
          {busy ? t("saving") : t("save")}
        </button>
        {state === "saved" ? (
          <span className={styles.curatorNote}>{t("saved")}</span>
        ) : null}
        {state === "error" ? (
          <span className={styles.curatorError}>{t("saveError")}</span>
        ) : null}
      </div>
    </section>
  );
}
