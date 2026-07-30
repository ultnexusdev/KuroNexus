"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { ArchiveShow, ShowArchive } from "@/lib/api/types";
import { belongsTo, shelfHref, type ShelfKey } from "@/lib/show/shelves";
import { BackToTop } from "@/components/BackToTop";
import { ShowBackdrop } from "./ShowBackdrop";
import { ShowCard, Poster } from "./ShowCard";
import styles from "./ShowHall.module.css";

/**
 * Salon 02 · Dizi — film salonundaki `FilmHall`ın aynısı. Rafların yanına
 * beşinci bir raf eklendi: **Kore Dramaları** — bir durum değil köken süzgeci,
 * diğer raflarla serbestçe kesişir (bkz. `lib/show/shelves.ts`).
 *
 * Filmin "Toplam Süre" künye kartı burada anlamsız (dizide izlenen bölüm
 * sayısı takip edilmiyor, yalnızca ortalama bölüm süresi cache'li) — onun
 * yerine "Toplam Bölüm" durur.
 */

const CuratorBar = dynamic(
  () => import("./ShowCurator").then((mod) => mod.CuratorBar),
  { ssr: false },
);
const SuggestionShelf = dynamic(
  () => import("./ShowCurator").then((mod) => mod.SuggestionShelf),
  { ssr: false },
);

const STRIP_LIMIT = 8;
const ROW_LIMIT = 6;

export function ShowHall({
  archive,
  locale,
  hallLabel,
  hallName,
  isAdmin = false,
}: {
  archive: ShowArchive;
  locale: string;
  hallLabel: string;
  hallName: string;
  isAdmin?: boolean;
}) {
  const t = useTranslations("show");
  const tStories = useTranslations("stories");
  const [genre, setGenre] = useState<string | null>(null);
  const [curating, setCurating] = useState(false);
  const [tonight, setTonight] = useState<ArchiveShow | null>(null);

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }),
    [locale],
  );

  const recent = useMemo(
    () => archive.shows.filter((show) => show.watchedAt).slice(0, STRIP_LIMIT),
    [archive.shows],
  );

  const visible = useMemo(
    () =>
      genre === null
        ? archive.shows
        : archive.shows.filter((show) => show.genres.includes(genre)),
    [archive.shows, genre],
  );

  const shelves = useMemo(() => {
    const pick = (key: ShelfKey) =>
      visible.filter((show) => belongsTo(show, key));
    return {
      watched: pick("watched"),
      watchlist: pick("watchlist"),
      rewatch: pick("rewatch"),
      favorites: pick("favorites"),
      korean: pick("korean"),
    };
  }, [visible]);

  const cards = useMemo(() => {
    const favorites = archive.shows.filter((show) => show.isFavorite).length;
    const episodes = archive.shows
      .filter((show) => show.status !== "WATCHLIST")
      .reduce((total, show) => total + (show.numberOfEpisodes ?? 0), 0);
    return {
      watched: archive.shows.filter((show) => show.status === "WATCHED")
        .length,
      favorites,
      episodes,
    };
  }, [archive.shows]);

  const { stats } = archive;
  const isEmpty = archive.shows.length === 0;

  const posters = useMemo(
    () =>
      archive.shows
        .map((show) => show.posterPath)
        .filter((path): path is string => Boolean(path)),
    [archive.shows],
  );

  function pickTonight() {
    const pool = shelves.watchlist;
    if (pool.length === 0) {
      return;
    }
    setTonight(pool[Math.floor(Math.random() * pool.length)]);
  }

  function renderShelf(key: ShelfKey, shows: ArchiveShow[]) {
    const row = shows.slice(0, ROW_LIMIT);
    const hasMore = shows.length > row.length;

    return (
      <section className={styles.shelfSection} key={key}>
        <div className={styles.shelfHead}>
          <Link href={shelfHref(key)} className={styles.shelfLink}>
            <h2 className={styles.shelfTitle}>{t(`shelf.${key}`)}</h2>
          </Link>
          <span className={styles.shelfCount}>
            {t("shelfCount", { count: shows.length })}
          </span>
        </div>

        {key === "watchlist" && shows.length > 0 ? (
          <div className={styles.tonight}>
            <button
              type="button"
              className={styles.tonightButton}
              onClick={pickTonight}
            >
              {t("tonight.button")}
            </button>
            {tonight ? (
              <p className={styles.tonightPick}>
                {t("tonight.pick", { title: tonight.title })}
              </p>
            ) : null}
          </div>
        ) : null}

        {shows.length === 0 ? (
          <p className={styles.emptyShelf}>{t("emptyShelf")}</p>
        ) : key === "favorites" ? (
          <ul className={styles.wall}>
            {row.map((show) => (
              <li key={show.id} className={styles.framed}>
                <Link
                  href={`/dark-stories/category/dizi/${show.slug}`}
                  className={styles.framedPoster}
                >
                  <Poster
                    show={show}
                    size="w500"
                    sizes="(max-width: 640px) 45vw, (max-width: 1100px) 30vw, 22vw"
                  />
                </Link>
                <div className={styles.plaque}>
                  <p className={styles.plaqueTitle}>{show.title}</p>
                  <p className={styles.plaqueMeta}>
                    {show.releaseYear ? <span>{show.releaseYear}</span> : null}
                    {show.personalRating ? (
                      <span className={styles.plaqueRating}>
                        ★ {show.personalRating.toFixed(1)}
                      </span>
                    ) : null}
                  </p>
                  {show.personalNote ? (
                    <p className={styles.plaqueNote}>{show.personalNote}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className={styles.shelf}>
            {row.map((show) => (
              <li key={show.id}>
                <ShowCard show={show} curating={curating} />
              </li>
            ))}
          </ul>
        )}

        {hasMore ? (
          <div className={styles.shelfFooter}>
            <Link href={shelfHref(key)} className={styles.showAll}>
              {t("showAll")}
            </Link>
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <div data-category="dizi" className={styles.hall}>
      <ShowBackdrop posters={posters} />

      <div className={styles.page}>
        <header className={styles.head}>
          <Link href="/dark-stories/category/dizi" className={styles.back}>
            {tStories("backToUniverse", { name: hallName })}
          </Link>
          <span className={styles.eyebrow}>
            {t("hall", { num: hallLabel, name: hallName })}
          </span>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.lede}>{t("lede")}</p>

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
              {curating ? (
                <span className={styles.curatorHint}>{t("curator.hint")}</span>
              ) : null}
            </div>
          ) : null}
        </header>

        <section className={styles.statCards}>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>{t("statCard.watched")}</span>
            <span className={styles.statValue}>{cards.watched}</span>
            <span className={styles.statSub}>
              {stats.averageRating === null
                ? t("statCard.watchedSub")
                : t("statCard.watchedAvg", {
                    value: stats.averageRating.toFixed(1),
                  })}
            </span>
          </article>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>{t("statCard.watchlist")}</span>
            <span className={styles.statValue}>{stats.watchlist}</span>
            <span className={styles.statSub}>{t("statCard.watchlistSub")}</span>
          </article>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>{t("statCard.favorites")}</span>
            <span className={styles.statValue}>{cards.favorites}</span>
            <span className={styles.statSub}>{t("statCard.favoritesSub")}</span>
          </article>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>{t("statCard.episodes")}</span>
            <span className={styles.statValue}>{cards.episodes}</span>
            <span className={styles.statSub}>{t("statCard.episodesSub")}</span>
          </article>
        </section>

        {isAdmin && curating ? (
          <>
            <SuggestionShelf />
            <CuratorBar />
          </>
        ) : null}

        {isEmpty ? (
          <p className={styles.empty}>{t("emptyArchive")}</p>
        ) : (
          <>
            {recent.length > 0 ? (
              <section className={styles.stripSection}>
                <h2 className={styles.sectionTitle}>{t("recent")}</h2>
                <div className={styles.strip}>
                  <span className={styles.perforation} aria-hidden />
                  <ul className={styles.stripTrack}>
                    {recent.map((show) => (
                      <li key={show.id} className={styles.frame}>
                        <Link
                          href={`/dark-stories/category/dizi/${show.slug}`}
                          className={styles.framePoster}
                        >
                          <Poster
                            show={show}
                            size="w185"
                            sizes="(max-width: 640px) 30vw, 140px"
                          />
                        </Link>
                        <p className={styles.frameTitle}>
                          <Link
                            href={`/dark-stories/category/dizi/${show.slug}`}
                            className={styles.titleLink}
                          >
                            {show.title}
                          </Link>
                        </p>
                        <p className={styles.frameDate}>
                          {show.watchedAt
                            ? dateFormatter.format(new Date(show.watchedAt))
                            : ""}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <span className={styles.perforation} aria-hidden />
                </div>
              </section>
            ) : null}

            {archive.genres.length > 0 ? (
              <div className={styles.chips}>
                <button
                  type="button"
                  className={genre === null ? styles.chipActive : styles.chip}
                  onClick={() => setGenre(null)}
                >
                  {t("allGenres")}
                </button>
                {archive.genres.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className={genre === name ? styles.chipActive : styles.chip}
                    onClick={() => setGenre(genre === name ? null : name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            ) : null}

            {renderShelf("watched", shelves.watched)}
            {renderShelf("watchlist", shelves.watchlist)}
            {shelves.rewatch.length > 0
              ? renderShelf("rewatch", shelves.rewatch)
              : null}

            <div className={styles.favoritesIntro}>
              <p className={styles.favoritesLede}>{t("favoritesLede")}</p>
            </div>
            {renderShelf("favorites", shelves.favorites)}

            {shelves.korean.length > 0 ? (
              <>
                <div className={styles.favoritesIntro}>
                  <p className={styles.favoritesLede}>{t("koreanLede")}</p>
                </div>
                {renderShelf("korean", shelves.korean)}
              </>
            ) : null}

            {archive.directors.length > 0 ? (
              <footer className={styles.directors}>
                <h2 className={styles.directorsTitle}>{t("directors")}</h2>
                <ul className={styles.directorList}>
                  {archive.directors.map((director) => (
                    <li key={director.name} className={styles.directorChip}>
                      {director.name}
                    </li>
                  ))}
                </ul>
              </footer>
            ) : null}
          </>
        )}
      </div>

      <BackToTop />
    </div>
  );
}
