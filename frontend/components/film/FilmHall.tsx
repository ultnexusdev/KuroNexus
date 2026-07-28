"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { tmdbImage } from "@/lib/api/movies";
import type { ArchiveMovie, MovieArchive } from "@/lib/api/types";
import { FilmBackdrop } from "./FilmBackdrop";
import styles from "./FilmHall.module.css";

/**
 * Salon 02 · Film — "Projeksiyon Salonu".
 *
 * Kişisel bir film arşivi. Düzen üç katman: geniş ekranda içeriğin iki yanını
 * dolduran dekoratif sinema duvarı (FilmBackdrop), ortada sabit genişlikte
 * içerik sütunu, ve sütun içinde üst üste dizilmiş raflar. Raflar sekme
 * değil bölüm — sayfayı aşağı kaydırırken arşiv bir kerede görünüyor.
 *
 * Salonun imzası "Son İzlenenler" şeridi: yatay poster sırası değil,
 * perforasyonlu bir 35 mm film şeridi.
 */

// Küratör kontrolleri yalnızca mod açılınca indirilir — ziyaretçi bu JS'i almaz
const CuratorBar = dynamic(
  () => import("./FilmCurator").then((mod) => mod.CuratorBar),
  { ssr: false },
);
const CuratorCardTools = dynamic(
  () => import("./FilmCurator").then((mod) => mod.CuratorCardTools),
  { ssr: false },
);

type ShelfKey = "watched" | "watchlist" | "rewatch" | "favorites";

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

function MovieCard({
  movie,
  curating,
}: {
  movie: ArchiveMovie;
  curating: boolean;
}) {
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
      {curating ? <CuratorCardTools movie={movie} /> : null}
    </article>
  );
}

export function FilmHall({
  archive,
  locale,
  hallLabel,
  isAdmin = false,
}: {
  archive: MovieArchive;
  locale: string;
  /** Salon numarası ana sayfayla aynı kaynaktan gelir ("01", "02"…) */
  hallLabel: string;
  /** Küratör modu anahtarını gösterir — yetki her istekte backend'de doğrulanır */
  isAdmin?: boolean;
}) {
  const t = useTranslations("film");
  const tStories = useTranslations("stories");
  const [genre, setGenre] = useState<string | null>(null);
  const [curating, setCurating] = useState(false);

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

  // Tür süzgeci bütün bölümlere birden uygulanır
  const visible = useMemo(
    () =>
      genre === null
        ? archive.movies
        : archive.movies.filter((movie) => movie.genres.includes(genre)),
    [archive.movies, genre],
  );

  const shelves = useMemo(() => {
    const pick = (key: ShelfKey) =>
      visible.filter((movie) => belongsTo(movie, key));
    return {
      watched: pick("watched"),
      watchlist: pick("watchlist"),
      rewatch: pick("rewatch"),
      favorites: pick("favorites"),
    };
  }, [visible]);

  // Künye kartları arşivin tamamından hesaplanır, süzgeçten etkilenmez
  const cards = useMemo(() => {
    const favorites = archive.movies.filter((movie) => movie.isFavorite).length;
    // "İzlendi" sayılan her şeyin süresi: bir kez izlenen de, tekrar izlenen de
    const watchedMinutes = archive.movies
      .filter((movie) => movie.status !== "WATCHLIST")
      .reduce((total, movie) => total + (movie.runtime ?? 0), 0);
    return {
      watched: archive.movies.filter((movie) => movie.status === "WATCHED")
        .length,
      favorites,
      hours: Math.round(watchedMinutes / 60),
    };
  }, [archive.movies]);

  const { stats } = archive;
  const isEmpty = archive.movies.length === 0;

  // Yan duvarlar arşivin kendi posterlerinden örülür
  const posters = useMemo(
    () =>
      archive.movies
        .map((movie) => movie.posterPath)
        .filter((path): path is string => Boolean(path)),
    [archive.movies],
  );

  function renderShelf(key: ShelfKey, movies: ArchiveMovie[]) {
    return (
      <section className={styles.shelfSection} key={key}>
        <div className={styles.shelfHead}>
          <h2 className={styles.shelfTitle}>{t(`shelf.${key}`)}</h2>
          <span className={styles.shelfCount}>
            {t("shelfCount", { count: movies.length })}
          </span>
        </div>

        {movies.length === 0 ? (
          <p className={styles.emptyShelf}>{t("emptyShelf")}</p>
        ) : key === "favorites" ? (
          <ul className={styles.wall}>
            {movies.map((movie) => (
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
                    {movie.releaseYear ? <span>{movie.releaseYear}</span> : null}
                    {movie.personalRating ? (
                      <span className={styles.plaqueRating}>
                        ★ {movie.personalRating.toFixed(1)}
                      </span>
                    ) : null}
                  </p>
                  {movie.personalNote ? (
                    <p className={styles.plaqueNote}>{movie.personalNote}</p>
                  ) : null}
                  {curating ? <CuratorCardTools movie={movie} /> : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className={styles.shelf}>
            {movies.map((movie) => (
              <li key={movie.id}>
                <MovieCard movie={movie} curating={curating} />
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }

  return (
    <div data-category="film" className={styles.hall}>
      <FilmBackdrop posters={posters} />

      <div className={styles.page}>
        <header className={styles.head}>
          {/* Geri: bir üst kapı olan salon girişine döner */}
          <Link href="/dark-stories/category/film" className={styles.back}>
            {tStories("backToUniverse", { name: t("hallName") })}
          </Link>
          <span className={styles.eyebrow}>{t("hall", { num: hallLabel })}</span>
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

        {/* Künye kartları: salonun tek bakışta özeti */}
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
            <span className={styles.statLabel}>{t("statCard.runtime")}</span>
            <span className={styles.statValue}>{cards.hours}</span>
            <span className={styles.statSub}>{t("statCard.runtimeSub")}</span>
          </article>
        </section>

        {/* Boş salonda da görünür: ilk film buradan eklenir */}
        {isAdmin && curating ? <CuratorBar /> : null}

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
            {/* Tekrar izlenecekler istenen bölüm listesinde yok; boşken hiç
                çizilmiyor ama doluyken filmler kaybolmasın diye duruyor */}
            {shelves.rewatch.length > 0
              ? renderShelf("rewatch", shelves.rewatch)
              : null}

            <div className={styles.favoritesIntro}>
              <p className={styles.favoritesLede}>{t("favoritesLede")}</p>
            </div>
            {renderShelf("favorites", shelves.favorites)}

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
    </div>
  );
}
