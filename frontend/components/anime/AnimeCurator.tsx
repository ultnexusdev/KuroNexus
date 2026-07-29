"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import {
  createAnimeEntry,
  deleteAnimeEntry,
  refreshAnimeEntry,
  searchAnilist,
  updateAnimeEntry,
  updateAnimePart,
} from "@/lib/admin/api";
import type {
  AnilistSearchResult,
  AnimeWatchStatus,
  ArchiveAnime,
  ArchiveAnimePart,
} from "@/lib/api/types";
import styles from "./AnimeHall.module.css";

/**
 * Anime salonunun küratör kontrolleri — yalnızca admin için, yalnızca mod
 * açıkken yüklenir (AnimeHall'da next/dynamic ile).
 *
 * Film küratöründen ayrılan yeri: günlük eylem "ekleme" değil **ilerleme**.
 * Bu yüzden kartın üstündeki asıl düğme "+1 bölüm"; durum/favori/çıkarma
 * ondan sonra gelir.
 */

const STATUSES: AnimeWatchStatus[] = [
  "WATCHING",
  "COMPLETED",
  "PLANNED",
  "ON_HOLD",
  "DROPPED",
  "REWATCHING",
];

export function CuratorBar() {
  const t = useTranslations("anime.curator");
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnilistSearchResult[] | null>(null);
  const [picked, setPicked] = useState<AnilistSearchResult | null>(null);
  const [status, setStatus] = useState<AnimeWatchStatus>("WATCHING");
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState("");
  const [note, setNote] = useState("");
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
      setResults(await searchAnilist(query));
    } catch {
      setError(t("searchError"));
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setPicked(null);
    setStatus("WATCHING");
    setIsFavorite(false);
    setRating("");
    setNote("");
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
      await createAnimeEntry({
        anilistId: picked.anilistId,
        status,
        isFavorite,
        personalRating: Number.isFinite(parsedRating) ? parsedRating : undefined,
        personalNote: note.trim() || undefined,
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
      {/* Sezon zinciri backend'de kurulduğu için ekleme tek adım */}
      <p className={styles.barLede}>{t("addLede")}</p>

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
            {results.slice(0, 8).map((result) => (
              <li key={result.anilistId}>
                <button
                  type="button"
                  className={styles.result}
                  onClick={() => {
                    setPicked(result);
                    setResults(null);
                  }}
                >
                  <span className={styles.resultPoster}>
                    {result.coverImage ? (
                      <Image
                        src={result.coverImage}
                        alt=""
                        fill
                        sizes="48px"
                        className={styles.resultImg}
                        unoptimized
                      />
                    ) : null}
                  </span>
                  <span className={styles.resultText}>
                    <span className={styles.resultTitle}>{result.title}</span>
                    <span className={styles.resultMeta}>
                      {[
                        result.seasonYear ?? null,
                        result.format,
                        result.episodes
                          ? t("episodes", { count: result.episodes })
                          : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )
      ) : null}

      {picked ? (
        <form className={styles.addForm} onSubmit={handleAdd}>
          <p className={styles.picked}>
            <strong>{picked.title}</strong>
            <button
              type="button"
              className={styles.link}
              onClick={() => setPicked(null)}
            >
              {t("changePick")}
            </button>
          </p>

          <div className={styles.addRow}>
            <label>
              <span>{t("status")}</span>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as AnimeWatchStatus)
                }
              >
                {STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {t(`statusName.${value}`)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>{t("rating")}</span>
              <input
                type="text"
                inputMode="decimal"
                value={rating}
                placeholder="8.5"
                onChange={(event) => setRating(event.target.value)}
              />
            </label>

            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(event) => setIsFavorite(event.target.checked)}
              />
              <span>{t("favorite")}</span>
            </label>
          </div>

          <label className={styles.noteField}>
            <span>{t("note")}</span>
            <input
              type="text"
              value={note}
              maxLength={500}
              onChange={(event) => setNote(event.target.value)}
            />
          </label>

          <div className={styles.addActions}>
            <button type="submit" className={styles.primary} disabled={busy}>
              {busy ? t("adding") : t("add")}
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}

/**
 * Bölüm sayacının elle girilebilen hâli: "14/23" yazısına tıklayınca kutuya
 * dönüşür, sayıyı yazıp Enter'a basınca ilerleme oraya atlar.
 *
 * Neden: 220 bölümlük bir seriyi "+1 bölüm" ile ilerletmek işkence — zaten
 * izlenmiş uzun seriler tek hamlede işaretlenebilmeli (kullanıcı geri
 * bildirimi). Sayıyı düşürmek de aynı yoldan yapılıyor.
 */
export function EpisodeInput({ part }: { part: ArchiveAnimePart }) {
  const t = useTranslations("anime");
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(part.watchedEpisodes));
  const [busy, setBusy] = useState(false);

  async function commit() {
    const parsed = Number.parseInt(value, 10);
    setEditing(false);
    if (!Number.isFinite(parsed) || parsed === part.watchedEpisodes) {
      setValue(String(part.watchedEpisodes));
      return;
    }
    setBusy(true);
    try {
      await updateAnimePart(part.id, { watchedEpisodes: Math.max(0, parsed) });
      router.refresh();
    } catch {
      setValue(String(part.watchedEpisodes));
    } finally {
      setBusy(false);
    }
  }

  if (!editing) {
    return (
      <button
        type="button"
        className={styles.countButton}
        disabled={busy}
        title={t("curator.editCount")}
        onClick={() => {
          setValue(String(part.watchedEpisodes));
          setEditing(true);
        }}
      >
        {part.episodes
          ? t("episodeOf", {
              watched: part.watchedEpisodes,
              total: part.episodes,
            })
          : t("episodeCount", { watched: part.watchedEpisodes })}
      </button>
    );
  }

  return (
    <span className={styles.countEdit}>
      <input
        type="number"
        min={0}
        max={part.episodes ?? undefined}
        value={value}
        autoFocus
        aria-label={t("curator.editCount")}
        className={styles.countInput}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => void commit()}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            void commit();
          }
          if (event.key === "Escape") {
            setValue(String(part.watchedEpisodes));
            setEditing(false);
          }
        }}
      />
      {part.episodes ? (
        <span className={styles.countTotal}>/{part.episodes}</span>
      ) : null}
    </span>
  );
}

/**
 * Kartın altındaki hızlı kontroller.
 *
 * "+1 bölüm" sıradaki parçaya işler; bölüm sayısı bilinen yapımda sınırı
 * backend uygular. Sayfa her işlemden sonra tazelenir — ilerleme, raf ve
 * künye şeridi tek kaynaktan (arşiv) yeniden hesaplansın diye.
 */
export function CuratorCardTools({ anime }: { anime: ArchiveAnime }) {
  const t = useTranslations("anime.curator");
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const part = anime.currentPart;
  const atEnd =
    part?.episodes !== null &&
    part !== null &&
    part.watchedEpisodes >= (part.episodes ?? 0);

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
      {part ? (
        <button
          type="button"
          className={styles.episodeButton}
          disabled={busy || atEnd}
          title={t("plusOneTitle", { part: part.title })}
          onClick={() => void run(() => updateAnimePart(part.id, { delta: 1 }))}
        >
          {atEnd ? t("partDone") : t("plusOne")}
        </button>
      ) : null}

      <div className={styles.toolRow}>
        <button
          type="button"
          className={anime.isFavorite ? styles.starOn : styles.star}
          disabled={busy}
          aria-pressed={anime.isFavorite}
          title={t("favorite")}
          onClick={() =>
            void run(() =>
              updateAnimeEntry(anime.id, { isFavorite: !anime.isFavorite }),
            )
          }
        >
          ★
        </button>

        <select
          className={styles.statusSelect}
          value={anime.status}
          disabled={busy}
          aria-label={t("status")}
          onChange={(event) =>
            void run(() =>
              updateAnimeEntry(anime.id, {
                status: event.target.value as AnimeWatchStatus,
              }),
            )
          }
        >
          {STATUSES.map((value) => (
            <option key={value} value={value}>
              {t(`statusName.${value}`)}
            </option>
          ))}
        </select>

        {/* Yeni sezon duyurulduğunda zinciri tazelemek gerekir */}
        <button
          type="button"
          className={styles.iconButton}
          disabled={busy}
          title={t("refresh")}
          aria-label={t("refresh")}
          onClick={() => void run(() => refreshAnimeEntry(anime.id))}
        >
          ⟳
        </button>

        <button
          type="button"
          className={styles.remove}
          disabled={busy}
          title={t("remove")}
          aria-label={t("remove")}
          onClick={() => {
            if (window.confirm(t("removeConfirm", { title: anime.title }))) {
              void run(() => deleteAnimeEntry(anime.id));
            }
          }}
        >
          ✕
        </button>
      </div>

      {failed ? <span className={styles.toolError}>{t("error")}</span> : null}
    </div>
  );
}
