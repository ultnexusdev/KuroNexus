"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import {
  completeThroughShowSeason,
  updateShowEntry,
  updateShowSeason,
} from "@/lib/admin/api";
import type {
  ArchiveShow,
  ArchiveShowSeason,
  ShowDetail as ShowDetailData,
} from "@/lib/api/types";
import styles from "./ShowDetail.module.css";

/*
 * ShowDetail'in küratör panelleri — AYRI DOSYADA bilerek (2026-09-01 denetimi,
 * P-02): yalnızca admin görürken çizilen bu bileşenler ShowDetail'in içinde
 * durdukça `lib/admin/api` her ziyaretçinin chunk'ına giriyordu. ShowDetail
 * bunları `next/dynamic` + `ssr: false` ile indiriyor (BookDetail deseni).
 */

export function QuickActions({ show }: { show: ArchiveShow }) {
  const t = useTranslations("show.detail");
  const tShow = useTranslations("show");
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function apply(input: Parameters<typeof updateShowEntry>[1]) {
    setBusy(true);
    try {
      await updateShowEntry(show.id, input);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.quick}>
      {/* Dizide filmden fazla olan durum: haftalarca sürebilen "izliyorum" */}
      <button
        type="button"
        className={show.status === "WATCHING" ? styles.quickOn : styles.quickBtn}
        disabled={busy}
        onClick={() => void apply({ status: "WATCHING" })}
      >
        {tShow("statusName.WATCHING")}
      </button>
      <button
        type="button"
        className={show.status === "WATCHED" ? styles.quickOn : styles.quickBtn}
        disabled={busy}
        onClick={() =>
          void apply({
            status: "WATCHED",
            watchedAt: new Date().toISOString(),
          })
        }
      >
        {tShow("statusName.WATCHED")}
      </button>
      <button
        type="button"
        className={
          show.status === "WATCHLIST" ? styles.quickOn : styles.quickBtn
        }
        disabled={busy}
        onClick={() => void apply({ status: "WATCHLIST", watchedAt: "" })}
      >
        {tShow("statusName.WATCHLIST")}
      </button>
      <button
        type="button"
        className={show.isFavorite ? styles.quickOn : styles.quickBtn}
        disabled={busy}
        title={t("toggleFavorite")}
        onClick={() => void apply({ isFavorite: !show.isFavorite })}
      >
        ★ {tShow("favorite")}
      </button>
    </div>
  );
}

/**
 * Sezon satırının küratör kontrolleri: tek tıkla bitirme, "buraya kadar
 * hepsini izledim" ve ±1 sayacı. Uzun dizilerde bölüm bölüm işaretlemekten
 * kurtarıyor.
 */
export function SeasonTools({ season }: { season: ArchiveShowSeason }) {
  const t = useTranslations("show.detail");
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    try {
      await action();
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const atStart = season.watchedEpisodes <= 0;
  const atEnd =
    season.episodes !== null && season.watchedEpisodes >= season.episodes;

  return (
    <div className={styles.seasonTools}>
      {season.episodes ? (
        <button
          type="button"
          className={styles.seasonTool}
          disabled={busy || season.isCompleted}
          onClick={() =>
            void run(() =>
              updateShowSeason(season.id, {
                watchedEpisodes: season.episodes ?? 0,
                isCompleted: true,
              }),
            )
          }
        >
          {season.isCompleted ? t("seasonDone") : t("finishSeason")}
        </button>
      ) : null}

      <button
        type="button"
        className={styles.seasonTool}
        disabled={busy}
        title={t("completeThroughHint")}
        onClick={() => void run(() => completeThroughShowSeason(season.id))}
      >
        {t("completeThrough")}
      </button>

      {/* Günlük kullanım: bir bölüm izledim, +1 */}
      <div className={styles.stepper}>
        <button
          type="button"
          className={styles.stepBtn}
          aria-label={t("minusEpisode")}
          disabled={busy || atStart}
          onClick={() => void run(() => updateShowSeason(season.id, { delta: -1 }))}
        >
          −
        </button>
        <span className={styles.stepValue}>
          {season.episodes
            ? `${season.watchedEpisodes}/${season.episodes}`
            : season.watchedEpisodes}
        </span>
        <button
          type="button"
          className={styles.stepBtn}
          aria-label={t("plusEpisode")}
          disabled={busy || atEnd}
          onClick={() => void run(() => updateShowSeason(season.id, { delta: 1 }))}
        >
          +
        </button>
      </div>
    </div>
  );
}

const LINK_FIELDS = ["rt", "imdb", "trailer"] as const;

type LinkField = (typeof LINK_FIELDS)[number];

export function CuratorLinks({ detail }: { detail: ShowDetailData }) {
  const t = useTranslations("show.detail");
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
      await updateShowEntry(detail.show.id, { links });
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
