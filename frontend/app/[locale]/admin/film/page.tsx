"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { tmdbImage } from "@/lib/api/movies";
import {
  createMovieEntry,
  deleteMovieEntry,
  fetchAdminMovies,
  searchTmdbMovies,
  updateMovieEntry,
} from "@/lib/admin/api";
import type {
  MovieEntryRecord,
  MovieStatus,
  TmdbSearchResult,
} from "@/lib/api/types";
import { today } from "@/lib/format";
import styles from "./page.module.css";

const STATUSES: MovieStatus[] = ["WATCHED", "WATCHLIST", "REWATCH"];

// Bugünün tarihi, date input'unun beklediği biçimde
function FilmArchiveAdmin() {
  const t = useTranslations("admin.film");
  const tFilm = useTranslations("film");

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbSearchResult[] | null>(null);
  const [picked, setPicked] = useState<TmdbSearchResult | null>(null);
  const [status, setStatus] = useState<MovieStatus>("WATCHED");
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState("");
  const [note, setNote] = useState("");
  const [watchedAt, setWatchedAt] = useState(today());

  const [entries, setEntries] = useState<MovieEntryRecord[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setEntries(await fetchAdminMovies());
    } catch {
      setError(t("loadError"));
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSearch(event: FormEvent) {
    event.preventDefault();
    if (!query.trim()) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      setResults(await searchTmdbMovies(query));
    } catch {
      setError(t("searchError"));
    } finally {
      setBusy(false);
    }
  }

  function pick(result: TmdbSearchResult) {
    setPicked(result);
    setResults(null);
    setQuery("");
  }

  function resetForm() {
    setPicked(null);
    setStatus("WATCHED");
    setIsFavorite(false);
    setRating("");
    setNote("");
    setWatchedAt(today());
  }

  async function handleAdd(event: FormEvent) {
    event.preventDefault();
    if (!picked) {
      return;
    }
    setBusy(true);
    setError(null);
    const parsedRating = Number.parseFloat(rating.replace(",", "."));
    try {
      await createMovieEntry({
        tmdbId: picked.tmdbId,
        status,
        isFavorite,
        personalRating: Number.isFinite(parsedRating) ? parsedRating : undefined,
        personalNote: note.trim() || undefined,
        // Sırada bekleyen film henüz izlenmedi — tarih yazmak yanlış olur
        watchedAt:
          status === "WATCHLIST" || !watchedAt
            ? undefined
            : new Date(watchedAt).toISOString(),
      });
      resetForm();
      await load();
    } catch {
      setError(t("saveError"));
    } finally {
      setBusy(false);
    }
  }

  async function toggleFavorite(entry: MovieEntryRecord) {
    try {
      await updateMovieEntry(entry.id, { isFavorite: !entry.isFavorite });
      await load();
    } catch {
      setError(t("saveError"));
    }
  }

  async function changeStatus(entry: MovieEntryRecord, next: MovieStatus) {
    try {
      await updateMovieEntry(entry.id, { status: next });
      await load();
    } catch {
      setError(t("saveError"));
    }
  }

  async function handleDelete(entry: MovieEntryRecord) {
    const title = entry.externalData?.title ?? `#${entry.tmdbId}`;
    if (!window.confirm(t("confirmDelete", { title }))) {
      return;
    }
    try {
      await deleteMovieEntry(entry.id);
      await load();
    } catch {
      setError(t("deleteError"));
    }
  }

  return (
    <section className={styles.page}>
      <h1 className={styles.heading}>{t("title")}</h1>
      <p className={styles.intro}>{t("intro")}</p>

      {error ? <p className={styles.error}>{error}</p> : null}

      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input
          type="search"
          value={query}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchLabel")}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="submit" className="btn" disabled={busy}>
          {busy ? t("searching") : t("search")}
        </button>
      </form>

      {results !== null ? (
        results.length === 0 ? (
          <p className={styles.empty}>{t("noResults")}</p>
        ) : (
          <ul className={styles.results}>
            {results.map((result) => {
              const poster = tmdbImage(result.posterPath, "w185");
              return (
                <li key={result.tmdbId}>
                  <button
                    type="button"
                    className={styles.result}
                    onClick={() => pick(result)}
                  >
                    <span className={styles.resultPoster}>
                      {poster ? (
                        <Image
                          src={poster}
                          alt=""
                          fill
                          sizes="64px"
                          className={styles.resultImg}
                          unoptimized
                        />
                      ) : null}
                    </span>
                    <span className={styles.resultInfo}>
                      <span className={styles.resultTitle}>{result.title}</span>
                      <span className={styles.resultMeta}>
                        {result.releaseDate?.slice(0, 4) ?? "—"}
                        {result.voteAverage
                          ? ` · TMDB ${result.voteAverage.toFixed(1)}`
                          : ""}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )
      ) : null}

      {picked ? (
        <form className={styles.addForm} onSubmit={handleAdd}>
          <p className={styles.pickedTitle}>
            {picked.title}
            {picked.releaseDate ? ` (${picked.releaseDate.slice(0, 4)})` : ""}
          </p>

          <label className={styles.field}>
            <span>{t("status")}</span>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as MovieStatus)
              }
            >
              {STATUSES.map((value) => (
                <option key={value} value={value}>
                  {t(`statusLabel.${value}`)}
                </option>
              ))}
            </select>
          </label>

          {status !== "WATCHLIST" ? (
            <label className={styles.field}>
              <span>{t("watchedAt")}</span>
              <input
                type="date"
                value={watchedAt}
                onChange={(event) => setWatchedAt(event.target.value)}
              />
            </label>
          ) : null}

          <label className={styles.field}>
            <span>{t("rating")}</span>
            <input
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={rating}
              onChange={(event) => setRating(event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>{t("note")}</span>
            <textarea
              value={note}
              rows={2}
              maxLength={500}
              placeholder={t("notePlaceholder")}
              onChange={(event) => setNote(event.target.value)}
            />
          </label>

          <label className={styles.checkField}>
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={(event) => setIsFavorite(event.target.checked)}
            />
            <span>{t("markFavorite")}</span>
          </label>

          <div className={styles.addActions}>
            <button type="submit" className="btn" disabled={busy}>
              {busy ? t("saving") : t("add")}
            </button>
            <button
              type="button"
              className={styles.cancel}
              onClick={resetForm}
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      ) : null}

      <h2 className={styles.subheading}>
        {t("archive", { count: entries?.length ?? 0 })}
      </h2>

      {entries !== null && entries.length === 0 ? (
        <p className={styles.empty}>{t("emptyArchive")}</p>
      ) : null}

      {entries && entries.length > 0 ? (
        <ul className={styles.entries}>
          {entries.map((entry) => {
            const poster = tmdbImage(
              entry.externalData?.posterPath ?? null,
              "w185",
            );
            return (
              <li key={entry.id} className={styles.entry}>
                <span className={styles.entryPoster}>
                  {poster ? (
                    <Image
                      src={poster}
                      alt=""
                      fill
                      sizes="48px"
                      className={styles.resultImg}
                      unoptimized
                    />
                  ) : null}
                </span>
                <span className={styles.entryInfo}>
                  <span className={styles.resultTitle}>
                    {entry.externalData?.title ?? `#${entry.tmdbId}`}
                  </span>
                  <span className={styles.resultMeta}>
                    {entry.personalRating
                      ? `★ ${entry.personalRating.toFixed(1)}`
                      : t("noRating")}
                    {entry.personalNote ? ` · ${entry.personalNote}` : ""}
                  </span>
                </span>
                <span className={styles.entryActions}>
                  <select
                    value={entry.status}
                    aria-label={t("status")}
                    onChange={(event) =>
                      void changeStatus(
                        entry,
                        event.target.value as MovieStatus,
                      )
                    }
                  >
                    {STATUSES.map((value) => (
                      <option key={value} value={value}>
                        {t(`statusLabel.${value}`)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className={
                      entry.isFavorite ? styles.favoriteOn : styles.favoriteOff
                    }
                    aria-pressed={entry.isFavorite}
                    title={tFilm("favorite")}
                    onClick={() => void toggleFavorite(entry)}
                  >
                    ★
                  </button>
                  <button
                    type="button"
                    className={styles.delete}
                    onClick={() => void handleDelete(entry)}
                  >
                    {t("delete")}
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}

export default function AdminFilmPage() {
  return (
    <AdminGuard>
      <FilmArchiveAdmin />
    </AdminGuard>
  );
}
