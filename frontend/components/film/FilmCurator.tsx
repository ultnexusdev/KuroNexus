"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { tmdbImage } from "@/lib/api/movies";
import {
  createMovieEntry,
  deleteMovieEntry,
  searchTmdbMovies,
  updateMovieEntry,
} from "@/lib/admin/api";
import type {
  ArchiveMovie,
  MovieStatus,
  TmdbSearchResult,
} from "@/lib/api/types";
import styles from "./FilmCurator.module.css";

/**
 * Salonun küratör kontrolleri — yalnızca admin için, yalnızca küratör modu
 * açıkken yüklenir (FilmHall'da next/dynamic ile). Ziyaretçinin tarayıcısına
 * bu dosyadan tek satır inmez.
 *
 * Kaydettikten sonra yerel durum güncellenmez, sayfa tazelenir: arşiv sunucudan
 * yeniden gelir, böylece raf sayaçları/istatistikler tek kaynaktan doğru kalır.
 */

const STATUSES: MovieStatus[] = ["WATCHED", "WATCHLIST", "REWATCH"];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Arşive film ekleme şeridi: TMDB'de ara → seç → künyeyi gir. */
export function CuratorBar() {
  const t = useTranslations("film.curator");
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbSearchResult[] | null>(null);
  const [picked, setPicked] = useState<TmdbSearchResult | null>(null);
  const [status, setStatus] = useState<MovieStatus>("WATCHED");
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState("");
  const [note, setNote] = useState("");
  const [watchedAt, setWatchedAt] = useState(today());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  function reset() {
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
      reset();
      setQuery("");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 409
          ? t("duplicate")
          : t("error"),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={styles.bar}>
      <h2 className={styles.barTitle}>{t("addTitle")}</h2>

      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input
          type="search"
          value={query}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchLabel")}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="submit" className={styles.primary} disabled={busy}>
          {busy ? t("searching") : t("search")}
        </button>
      </form>

      {error ? <p className={styles.error}>{error}</p> : null}

      {results !== null && !picked ? (
        results.length === 0 ? (
          <p className={styles.muted}>{t("noResults")}</p>
        ) : (
          <ul className={styles.results}>
            {results.slice(0, 8).map((result) => {
              const poster = tmdbImage(result.posterPath, "w185");
              return (
                <li key={result.tmdbId}>
                  <button
                    type="button"
                    className={styles.result}
                    onClick={() => {
                      setPicked(result);
                      setResults(null);
                    }}
                  >
                    <span className={styles.resultPoster}>
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
          <p className={styles.picked}>
            {picked.title}
            {picked.releaseDate ? ` (${picked.releaseDate.slice(0, 4)})` : ""}
          </p>

          <div className={styles.fields}>
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
          </div>

          <label className={styles.field}>
            <span>{t("note")}</span>
            <textarea
              value={note}
              rows={2}
              maxLength={500}
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
            <button type="submit" className={styles.primary} disabled={busy}>
              {busy ? t("saving") : t("add")}
            </button>
            <button type="button" className={styles.ghost} onClick={reset}>
              {t("cancel")}
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}

/** Poster altındaki hızlı kontroller: favori, durum, arşivden çıkarma. */
export function CuratorCardTools({ movie }: { movie: ArchiveMovie }) {
  const t = useTranslations("film.curator");
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    setFailed(false);
    try {
      await action();
      router.refresh();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.tools}>
      <button
        type="button"
        className={movie.isFavorite ? styles.favOn : styles.favOff}
        aria-pressed={movie.isFavorite}
        title={movie.isFavorite ? t("favoriteOn") : t("favoriteOff")}
        disabled={busy}
        onClick={() =>
          void run(() =>
            updateMovieEntry(movie.id, { isFavorite: !movie.isFavorite }),
          )
        }
      >
        ★
      </button>

      <select
        className={styles.statusSelect}
        value={movie.status}
        aria-label={t("status")}
        disabled={busy}
        onChange={(event) =>
          void run(() =>
            updateMovieEntry(movie.id, {
              status: event.target.value as MovieStatus,
            }),
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
        className={styles.remove}
        title={t("remove")}
        disabled={busy}
        onClick={() => {
          if (!window.confirm(t("confirmRemove", { title: movie.title }))) {
            return;
          }
          void run(() => deleteMovieEntry(movie.id));
        }}
      >
        ✕
      </button>

      {failed ? <span className={styles.toolError}>{t("error")}</span> : null}
    </div>
  );
}
