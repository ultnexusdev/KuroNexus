"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { MovieArchive } from "@/lib/api/types";
import {
  applyFilters,
  DEFAULT_SORT,
  isSortKey,
  PERIOD_OPTIONS,
  SORT_KEYS,
} from "@/lib/film/filters";
import { belongsTo, type ShelfKey } from "@/lib/film/shelves";
import { FilmBackdrop } from "./FilmBackdrop";
import { MovieCard } from "./MovieCard";
import styles from "./FilmHall.module.css";

/**
 * Tek bir rafın tam sayfası: /dark-stories/category/film/arsiv/<raf>
 *
 * Süzgeç, sıralama ve sayfa boyu URL'e yazılır (`?tur=&donem=&sirala=&sayfa=`)
 * — geri düğmesi çalışır, link paylaşılabilir, yenileyince seçim durur.
 * Arşivin tamamı zaten tek istekte geliyor; sayfalama istemcide yapılıyor.
 */

const CuratorBar = dynamic(
  () => import("./FilmCurator").then((mod) => mod.CuratorBar),
  { ssr: false },
);

// Bir sayfada kaç afiş; "Daha fazla" her basışta bir bu kadar daha ekler
const PAGE_SIZE = 60;

export function FilmShelfPage({
  archive,
  shelf,
  hallLabel,
  hallName,
  isAdmin = false,
}: {
  archive: MovieArchive;
  shelf: ShelfKey;
  hallLabel: string;
  hallName: string;
  isAdmin?: boolean;
}) {
  const t = useTranslations("film");
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [curating, setCurating] = useState(false);

  const genre = params.get("tur");
  const period = params.get("donem");
  const sortParam = params.get("sirala");
  const sort = isSortKey(sortParam) ? sortParam : DEFAULT_SORT;
  const pages = Math.max(1, Number.parseInt(params.get("sayfa") ?? "1", 10) || 1);

  const all = useMemo(
    () => archive.movies.filter((movie) => belongsTo(movie, shelf)),
    [archive.movies, shelf],
  );

  const filtered = useMemo(
    () => applyFilters(all, { genre, period, sort }),
    [all, genre, period, sort],
  );

  // Bu raftaki filmlerin türleri — arşivin tamamındaki türler değil
  const genres = useMemo(() => {
    const seen = new Set<string>();
    for (const movie of all) {
      for (const name of movie.genres) {
        seen.add(name);
      }
    }
    return [...seen].sort((a, b) => a.localeCompare(b, "tr"));
  }, [all]);

  const shown = filtered.slice(0, pages * PAGE_SIZE);
  const hasMore = filtered.length > shown.length;

  /** Süzgeç değişince sayfa sayacı sıfırlanır — 3. sayfada kalmak anlamsız. */
  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value === null) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    if (key !== "sayfa") {
      next.delete("sayfa");
    }
    // Yalnızca sorgu değişiyor, yol değil — düz Next router'ı doğrudan iş
    // görür; `pathname` locale önekini zaten taşıdığı için next-intl
    // sarmalayıcısına gerek yok.
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  // Duvar bu rafın posterlerinden örülür — salonun aynı hissi sürsün
  const posters = useMemo(
    () =>
      all
        .map((movie) => movie.posterPath)
        .filter((path): path is string => Boolean(path)),
    [all],
  );

  return (
    <div data-category="film" className={styles.hall}>
      <FilmBackdrop posters={posters} />

      <div className={styles.page}>
        <header className={styles.head}>
          <Link href="/dark-stories/category/film/arsiv" className={styles.back}>
            {t("backToArchive")}
          </Link>
          <span className={styles.eyebrow}>
            {t("hall", { num: hallLabel, name: hallName })}
          </span>
          <h1 className={styles.title}>{t(`shelf.${shelf}`)}</h1>
          <p className={styles.lede}>
            {t("shelfCount", { count: filtered.length })}
          </p>

          {isAdmin ? (
            <div className={styles.curatorSwitch}>
              <button
                type="button"
                className={curating ? styles.curatorOn : styles.curatorOff}
                aria-pressed={curating}
                onClick={() => setCurating((value) => !value)}
              >
                {curating ? t("curator.off") : t("curator.on")}
              </button>
            </div>
          ) : null}
        </header>

        {isAdmin && curating ? <CuratorBar /> : null}

        {genres.length > 0 ? (
          <div className={styles.chips}>
            <button
              type="button"
              className={genre === null ? styles.chipActive : styles.chip}
              onClick={() => setParam("tur", null)}
            >
              {t("allGenres")}
            </button>
            {genres.map((name) => (
              <button
                key={name}
                type="button"
                className={genre === name ? styles.chipActive : styles.chip}
                onClick={() => setParam("tur", genre === name ? null : name)}
              >
                {name}
              </button>
            ))}
          </div>
        ) : null}

        <div className={styles.filterBar}>
          <label className={styles.filterField}>
            <span>{t("sortLabel")}</span>
            <select
              value={sort}
              onChange={(event) => setParam("sirala", event.target.value)}
            >
              {SORT_KEYS.map((key) => (
                <option key={key} value={key}>
                  {t(`sort.${key}`)}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.filterField}>
            <span>{t("periodLabel")}</span>
            <select
              value={period ?? ""}
              onChange={(event) =>
                setParam("donem", event.target.value || null)
              }
            >
              <option value="">{t("allPeriods")}</option>
              {PERIOD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.kind === "year"
                    ? option.year
                    : option.kind === "decade"
                      ? t("decade", { decade: option.decade! })
                      : t("older")}
                </option>
              ))}
            </select>
          </label>
        </div>

        {shown.length === 0 ? (
          <p className={styles.emptyShelf}>{t("emptyShelf")}</p>
        ) : (
          <ul className={styles.shelf}>
            {shown.map((movie) => (
              <li key={movie.id}>
                <MovieCard movie={movie} curating={curating} />
              </li>
            ))}
          </ul>
        )}

        {hasMore ? (
          <div className={styles.shelfFooter}>
            <button
              type="button"
              className={styles.showAll}
              onClick={() => setParam("sayfa", String(pages + 1))}
            >
              {t("loadMore")}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
