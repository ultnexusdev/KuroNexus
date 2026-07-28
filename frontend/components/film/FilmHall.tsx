"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { tmdbImage } from "@/lib/api/movies";
import type { ArchiveMovie, MovieArchive } from "@/lib/api/types";
import styles from "./FilmHall.module.css";

/**
 * Salon 02 · Film — "Projeksiyon Salonu".
 *
 * Kişisel bir film arşivi: izlenenler, sırada bekleyenler, tekrar izlenecekler
 * ve favoriler. Salonun imzası "Son İzlenenler" şeridi: yatay poster sırası
 * değil, perforasyonlu bir 35 mm film şeridi. Gerisi bilinçli olarak sessiz.
 */

type ShelfKey = "watched" | "watchlist" | "rewatch" | "favorites";

const SHELVES: ShelfKey[] = ["watched", "watchlist", "rewatch", "favorites"];

// Şerit kaç kare taşır — fazlası kaydırmayı yorucu yapıyor
const STRIP_LIMIT = 8;

function belongsTo(movie: ArchiveMovie, shelf: ShelfKey): boolean {
  if (shelf === "favorites") {
    return movie.isFavorite;
  }
  if (shelf === "watched") {
    return movie.status === "WATCHED";
  }
  if (shelf === "watchlist") {
    return movie.status === "WATCHLIST";
  }
  return movie.status === "REWATCH";
}

function Poster({
  movie,
  size,
  sizes,
}: {
  movie: ArchiveMovie;
  size: "w185" | "w342" | "w500";
  sizes: string;
}) {
  const src = tmdbImage(movie.posterPath, size);
  if (!src) {
    // Künye gelmemiş film: posterin yerini başlığın kendisi tutar
    return (
      <span className={styles.posterFallback}>
        <span>{movie.title}</span>
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      className={styles.posterImg}
      unoptimized
    />
  );
}

function MovieCard({ movie }: { movie: ArchiveMovie }) {
  const t = useTranslations("film");
  const rating = movie.personalRating ?? movie.voteAverage;

  return (
    <article className={styles.card}>
      <div className={styles.posterWrap}>
        <Poster
          movie={movie}
          size="w342"
          sizes="(max-width: 640px) 45vw, (max-width: 1100px) 23vw, 15vw"
        />

        {/* Masaüstünde üzerine gelince açılan künye — dokunmatikte gizli */}
        <div className={styles.overlay}>
          <dl className={styles.overlayFacts}>
            {movie.voteAverage ? (
              <div>
                <dt>{t("tmdbScore")}</dt>
                <dd>{movie.voteAverage.toFixed(1)}</dd>
              </div>
            ) : null}
            {movie.runtime ? (
              <div>
                <dt>{t("runtime")}</dt>
                <dd>{t("minutes", { count: movie.runtime })}</dd>
              </div>
            ) : null}
          </dl>
          {movie.genres.length > 0 ? (
            <p className={styles.overlayGenres}>
              {movie.genres.slice(0, 3).join(" · ")}
            </p>
          ) : null}
          {movie.personalNote ? (
            <p className={styles.overlayNote}>{movie.personalNote}</p>
          ) : null}
        </div>

        {movie.isFavorite ? (
          <span className={styles.favoriteMark} aria-label={t("favorite")}>
            ★
          </span>
        ) : null}
      </div>

      <h3 className={styles.cardTitle}>{movie.title}</h3>
      <p className={styles.cardMeta}>
        {movie.releaseYear ? <span>{movie.releaseYear}</span> : null}
        {rating ? (
          <span className={styles.cardRating}>{rating.toFixed(1)}</span>
        ) : null}
      </p>
    </article>
  );
}

export function FilmHall({
  archive,
  locale,
}: {
  archive: MovieArchive;
  locale: string;
}) {
  const t = useTranslations("film");
  const tStories = useTranslations("stories");
  const [shelf, setShelf] = useState<ShelfKey>("watched");
  const [genre, setGenre] = useState<string | null>(null);

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }),
    [locale],
  );

  // Şerit: en son izlenenler, tarihi olanlar önce
  const recent = useMemo(
    () =>
      archive.movies
        .filter((movie) => movie.watchedAt)
        .slice(0, STRIP_LIMIT),
    [archive.movies],
  );

  const shelfMovies = useMemo(
    () =>
      archive.movies.filter(
        (movie) =>
          belongsTo(movie, shelf) &&
          (genre === null || movie.genres.includes(genre)),
      ),
    [archive.movies, shelf, genre],
  );

  const counts = useMemo(() => {
    const map = {} as Record<ShelfKey, number>;
    for (const key of SHELVES) {
      map[key] = archive.movies.filter((movie) => belongsTo(movie, key)).length;
    }
    return map;
  }, [archive.movies]);

  const { stats } = archive;
  const isEmpty = archive.movies.length === 0;

  return (
    <div data-category="film" className={styles.hall}>
      <header className={styles.head}>
        <Link href="/dark-stories" className={styles.back}>
          {tStories("backToList")}
        </Link>
        <span className={styles.eyebrow}>{t("eyebrow")}</span>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.lede}>{t("lede")}</p>

        {/* Künye şeridi: dört istatistik kartı yerine tek teknik satır */}
        <p className={styles.colophon}>
          <span>{t("statTotal", { count: stats.total })}</span>
          <span aria-hidden>·</span>
          <span>{t("statThisYear", { count: stats.watchedThisYear })}</span>
          <span aria-hidden>·</span>
          <span>
            {stats.averageRating === null
              ? t("statNoRating")
              : t("statAverage", { value: stats.averageRating.toFixed(1) })}
          </span>
          <span aria-hidden>·</span>
          <span>{t("statWatchlist", { count: stats.watchlist })}</span>
        </p>
      </header>

      {isEmpty ? (
        <p className={styles.empty}>{t("emptyArchive")}</p>
      ) : (
        <>
          {recent.length > 0 ? (
            <section className={styles.stripSection}>
              <h2 className={styles.sectionTitle}>{t("recent")}</h2>
              {/* İmza: perforasyonlu 35 mm şerit, kareler poster */}
              <div className={styles.strip}>
                <span className={styles.perforation} aria-hidden />
                <ul className={styles.stripTrack}>
                  {recent.map((movie) => (
                    <li key={movie.id} className={styles.frame}>
                      <div className={styles.framePoster}>
                        <Poster
                          movie={movie}
                          size="w185"
                          sizes="(max-width: 640px) 30vw, 140px"
                        />
                      </div>
                      <p className={styles.frameTitle}>{movie.title}</p>
                      <p className={styles.frameDate}>
                        {movie.watchedAt
                          ? dateFormatter.format(new Date(movie.watchedAt))
                          : ""}
                      </p>
                    </li>
                  ))}
                </ul>
                <span className={styles.perforation} aria-hidden />
              </div>
            </section>
          ) : null}

          <section className={styles.shelfSection}>
            <div className={styles.tabs} role="tablist">
              {SHELVES.map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={shelf === key}
                  className={shelf === key ? styles.tabActive : styles.tab}
                  onClick={() => setShelf(key)}
                >
                  {t(`shelf.${key}`)}
                  <span className={styles.tabCount}>{counts[key]}</span>
                </button>
              ))}
            </div>

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

            {shelf === "favorites" ? (
              <div className={styles.favoritesIntro}>
                <h2 className={styles.favoritesTitle}>{t("favoritesTitle")}</h2>
                <p className={styles.favoritesLede}>{t("favoritesLede")}</p>
              </div>
            ) : null}

            {shelfMovies.length === 0 ? (
              <p className={styles.empty}>{t("emptyShelf")}</p>
            ) : shelf === "favorites" ? (
              <ul className={styles.wall}>
                {shelfMovies.map((movie) => (
                  <li key={movie.id} className={styles.framed}>
                    <div className={styles.framedPoster}>
                      <Poster
                        movie={movie}
                        size="w500"
                        sizes="(max-width: 640px) 45vw, (max-width: 1100px) 30vw, 22vw"
                      />
                    </div>
                    {/* Pirinç künye levhası */}
                    <div className={styles.plaque}>
                      <p className={styles.plaqueTitle}>{movie.title}</p>
                      <p className={styles.plaqueMeta}>
                        {movie.releaseYear ? (
                          <span>{movie.releaseYear}</span>
                        ) : null}
                        {movie.personalRating ? (
                          <span className={styles.plaqueRating}>
                            ★ {movie.personalRating.toFixed(1)}
                          </span>
                        ) : null}
                      </p>
                      {movie.personalNote ? (
                        <p className={styles.plaqueNote}>{movie.personalNote}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className={styles.shelf}>
                {shelfMovies.map((movie) => (
                  <li key={movie.id}>
                    <MovieCard movie={movie} />
                  </li>
                ))}
              </ul>
            )}
          </section>

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
  );
}
