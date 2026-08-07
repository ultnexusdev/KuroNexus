"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { ArchiveMovie, MovieArchive } from "@/lib/api/types";
import { belongsTo, shelfHref, type ShelfKey } from "@/lib/film/shelves";
import { BackToTop } from "@/components/BackToTop";
import { FilmBackdrop } from "./FilmBackdrop";
import { MovieCard, Poster } from "./MovieCard";
import styles from "./FilmHall.module.css";
import { ArchiveUnavailable } from "@/components/hall/ArchiveUnavailable";
import { ScrollStrip } from "@/components/hall/ScrollStrip";

/**
 * Salon 02 · Film — "Projeksiyon Salonu".
 *
 * Düzen üç katman: geniş ekranda içeriğin iki yanını dolduran dekoratif sinema
 * duvarı (FilmBackdrop), ortada sabit genişlikte içerik sütunu, sütun içinde
 * üst üste raflar. Her raf burada YALNIZCA ilk satırı gösterir; tamamı kendi
 * sayfasında (süzgeç + sıralama + sayfalama orada).
 *
 * Salonun imzası "Son İzlenenler" şeridi: yatay poster sırası değil,
 * perforasyonlu bir 35 mm film şeridi.
 */

// Küratör kontrolleri yalnızca mod açılınca indirilir — ziyaretçi bu JS'i almaz
const CuratorBar = dynamic(
  () => import("./FilmCurator").then((mod) => mod.CuratorBar),
  { ssr: false },
);
const SuggestionShelf = dynamic(
  () => import("./FilmCurator").then((mod) => mod.SuggestionShelf),
  { ssr: false },
);

/*
 * Şerit kaç kare taşır.
 *
 * 8'di, kullanıcı isteğiyle 21'e çıktı (6 Ağustos 2026). Kaydırma zaten
 * vardı ama kullanıcının göremediği bir kaydırmaydı: kenarda hiçbir işaret
 * yoktu, son kare ekranın kenarında düz kesiliyordu. Sayıyı artırmak tek
 * başına yetmezdi — aşağıdaki kenar solması ve klavye erişimi onunla
 * birlikte geldi.
 */
const STRIP_LIMIT = 21;
// Salonda her raf tek satır: geniş ekrandaki sütun sayısı kadar
const ROW_LIMIT = 6;

export function FilmHall({
  archive,
  locale,
  hallLabel,
  hallName,
  isAdmin = false,
}: {
  archive: MovieArchive;
  locale: string;
  /** Salon numarası ana sayfayla aynı kaynaktan gelir ("01", "02"…) */
  hallLabel: string;
  /** Salon adı da aynı kaynaktan: kategori kaydı (kod içinde sabit yok) */
  hallName: string;
  /** Küratör modu anahtarını gösterir — yetki her istekte backend'de doğrulanır */
  isAdmin?: boolean;
}) {
  const t = useTranslations("film");
  const tStories = useTranslations("stories");
  /* Şerit oklarının etiketi komşu sözlükten geliyor: "Önceki/Sonraki" salt
     yön sözcüğü, alanla ilgisi yok ve çalar sözlüğünde iki dilde de hazır
     duruyor. Aynı iki kelimeyi ikinci bir anahtar çiftinde tekrarlamak
     çevirinin iki yerde ayrışmasına açık kapı bırakırdı. */
  const tNav = useTranslations("player");
  const [genre, setGenre] = useState<string | null>(null);
  const [curating, setCurating] = useState(false);
  const [tonight, setTonight] = useState<ArchiveMovie | null>(null);

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }),
    [locale],
  );

  // Şerit: en son izlenenler, tarihi olanlar önce
  const recent = useMemo(
    () => archive.movies.filter((movie) => movie.watchedAt).slice(0, STRIP_LIMIT),
    [archive.movies],
  );

  // Tür süzgeci bütün raflara birden uygulanır
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

  function pickTonight() {
    const pool = shelves.watchlist;
    if (pool.length === 0) {
      return;
    }
    setTonight(pool[Math.floor(Math.random() * pool.length)]);
  }

  function renderShelf(key: ShelfKey, movies: ArchiveMovie[]) {
    const row = movies.slice(0, ROW_LIMIT);
    const hasMore = movies.length > row.length;

    return (
      <section className={styles.shelfSection} key={key}>
        <div className={styles.shelfHead}>
          {/* Başlık rafın kendi sayfasına açılır */}
          <Link href={shelfHref(key)} className={styles.shelfLink}>
            <h2 className={styles.shelfTitle}>{t(`shelf.${key}`)}</h2>
          </Link>
          <span className={styles.shelfCount}>
            {t("shelfCount", { count: movies.length })}
          </span>
        </div>

        {key === "watchlist" && movies.length > 0 ? (
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

        {movies.length === 0 ? (
          <p className={styles.emptyShelf}>{t("emptyShelf")}</p>
        ) : key === "favorites" ? (
          <ul className={styles.wall}>
            {row.map((movie) => (
              <li key={movie.id} className={styles.framed}>
                {/* Çerçeveli afiş de filmin sayfasına açılır */}
                <Link
                  href={`/dark-stories/category/film/${movie.slug}`}
                  className={styles.framedPoster}
                >
                  <Poster
                    movie={movie}
                    size="w500"
                    sizes="(max-width: 640px) 45vw, (max-width: 1100px) 30vw, 22vw"
                  />
                </Link>
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
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className={styles.shelf}>
            {row.map((movie) => (
              <li key={movie.id}>
                <MovieCard movie={movie} curating={curating} />
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
    <div data-category="film" className={styles.hall}>
      <FilmBackdrop posters={posters} />

      <div className={styles.page}>
        <header className={styles.head}>
          {/* Geri: bir üst kapı olan salon girişine döner */}
          <Link href="/dark-stories/category/film" className={styles.back}>
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

        {/* Küratör araçları: öneriler (aramadan ekle) + arama şeridi */}
        {isAdmin && curating ? (
          <>
            <SuggestionShelf />
            <CuratorBar />
          </>
        ) : null}

        {/* Baglanti hatasi ile gercek bosluk AYRI ekranlar: boş yanit
            "arsivin bos" diye gosterilirse kullanici dolu bir arsivin onunde
            yanlis bilgi okur ve yenileme yolu bulamaz. */}
        {archive.unavailable ? (
          <ArchiveUnavailable />
        ) : isEmpty ? (
          <p className={styles.empty}>{t("emptyArchive")}</p>
        ) : (
          <>
            {recent.length > 0 ? (
              <section className={styles.stripSection}>
                <h2 className={styles.sectionTitle}>{t("recent")}</h2>
                {/* İmza: perforasyonlu 35 mm şerit, kareler poster.
                    Kabuk şeride fareyle kaydırma yolu ekliyor (ok, tekerlek,
                    sürükleme) — kaydırma çubuğu gizli olduğu için masaüstünde
                    hiçbiri yoktu. Bkz. `components/hall/ScrollStrip.tsx`. */}
                <ScrollStrip
                  className={styles.strip}
                  prevLabel={tNav("previous")}
                  nextLabel={tNav("next")}
                >
                  {(trackRef) => (
                    <ul
                      ref={trackRef}
                      className={styles.stripTrack}
                      /* Klavyeyle kaydırılabilsin: odaklanabilir olmayan bir
                         kaydırma kutusu fare olmadan erişilemez kalıyordu */
                      tabIndex={0}
                      aria-label={t("recent")}
                    >
                      {recent.map((movie) => (
                        <li key={movie.id} className={styles.frame}>
                          {/* Şeritteki kareler de tıklanabilir */}
                          <Link
                            href={`/dark-stories/category/film/${movie.slug}`}
                            className={styles.framePoster}
                          >
                            <Poster
                              movie={movie}
                              size="w185"
                              sizes="(max-width: 640px) 30vw, 140px"
                            />
                          </Link>
                          <p className={styles.frameTitle}>
                            <Link
                              href={`/dark-stories/category/film/${movie.slug}`}
                              className={styles.titleLink}
                            >
                              {movie.title}
                            </Link>
                          </p>
                          <p className={styles.frameDate}>
                            {movie.watchedAt
                              ? dateFormatter.format(new Date(movie.watchedAt))
                              : ""}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </ScrollStrip>
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

      <BackToTop />
    </div>
  );
}
