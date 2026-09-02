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
import { ArchiveUnavailable } from "@/components/hall/ArchiveUnavailable";
import { ScrollStrip } from "@/components/hall/ScrollStrip";
import { CuratorDock } from "@/components/curated/CuratorDock";
import { showHref } from "@/lib/show/routes";

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

/*
 * Şerit kaç kare taşır.
 *
 * 8'di, kullanıcı isteğiyle 21'e çıktı (7 Ağustos 2026). Kaydırma zaten
 * vardı ama kullanıcının göremediği bir kaydırmaydı: kenarda hiçbir işaret
 * yoktu, son kare ekranın kenarında düz kesiliyordu. Sayıyı artırmak tek
 * başına yetmezdi — kenar solması ve klavye erişimi onunla birlikte geldi
 * (bkz. ShowHall.module.css .stripTrack).
 */
const STRIP_LIMIT = 21;
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
  // Gerekçe FilmHall'da yazılı: yön sözcükleri komşu sözlükte hazır duruyor
  const tNav = useTranslations("player");
  const [genre, setGenre] = useState<string | null>(null);
  const [curating, setCurating] = useState(false);
  const [tonight, setTonight] = useState<ArchiveShow | null>(null);

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }),
    [locale],
  );

  /* Şerit: arşive EN SON GİRENLER — film salonundaki gerekçenin aynısı.
   * `watchedAt` süzülüp sıralandığında şerit "İzlediğim Diziler" rafının
   * kopyası oluyordu. Durum süzülmüyor: "izleyeceğim" diye eklenen dizi de
   * arşive yeni girmiştir. `sort` yerinde değiştirdiği için önce kopya. */
  const recent = useMemo(() => {
    // Eski backend `addedAt` göndermiyor: o zaman eski davranışa düşülüyor
    const key = (show: ArchiveShow) => show.addedAt ?? show.watchedAt ?? "";
    return [...archive.shows]
      .sort((a, b) => key(b).localeCompare(key(a)))
      .slice(0, STRIP_LIMIT);
  }, [archive.shows]);

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
      watching: pick("watching"),
      watched: pick("watched"),
      watchlist: pick("watchlist"),
      rewatch: pick("rewatch"),
      favorites: pick("favorites"),
      korean: pick("korean"),
    };
  }, [visible]);

  const cards = useMemo(() => {
    // Bölüm sayısı artık gerçek ilerlemeden geliyor: dizinin toplam bölümü
    // değil, benim izlediğim bölüm sayısı (sezon sayaçlarının toplamı)
    const episodes = archive.shows.reduce(
      (total, show) => total + show.watchedEpisodes,
      0,
    );
    return {
      watching: archive.shows.filter((show) => show.status === "WATCHING")
        .length,
      watched: archive.shows.filter((show) => show.status === "WATCHED")
        .length,
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
                  href={showHref.show(show.slug)}
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
          <Link href={showHref.hall()} className={styles.back}>
            {tStories("backToUniverse", { name: hallName })}
          </Link>
          <span className={styles.eyebrow}>
            {t("hall", { num: hallLabel, name: hallName })}
          </span>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.lede}>{t("lede")}</p>

          {isAdmin ? (
            <div className={styles.curatorSwitch}>
              <CuratorDock
                on={curating}
                onToggle={() => setCurating((value) => !value)}
                label={curating ? t("curator.off") : t("curator.on")}
              />
              {curating ? (
                <span className={styles.curatorHint}>{t("curator.hint")}</span>
              ) : null}
            </div>
          ) : null}
        </header>

        <section className={styles.statCards}>
          {/* Dizide baş sayı "izliyorum": film salonunda böyle bir durum yok,
              burada haftalarca süren asıl hal bu */}
          <article className={styles.statCard}>
            <span className={styles.statLabel}>{t("statCard.watching")}</span>
            <span className={styles.statValue}>{cards.watching}</span>
            <span className={styles.statSub}>{t("statCard.watchingSub")}</span>
          </article>
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

        {/* Gerekce FilmHall'da yazili */}
        {archive.unavailable ? (
          <ArchiveUnavailable />
        ) : isEmpty ? (
          <p className={styles.empty}>{t("emptyArchive")}</p>
        ) : (
          <>
            {recent.length > 0 ? (
              <section className={styles.stripSection}>
                <h2 className={styles.sectionTitle}>{t("recent")}</h2>
                {/* Kabuğun gerekçesi FilmHall'da: gizli kaydırma çubuğu
                    yüzünden masaüstünde şeridi fareyle kaydırmanın yolu yoktu */}
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
                      {recent.map((show) => (
                        <li key={show.id} className={styles.frame}>
                          <Link
                            href={showHref.show(show.slug)}
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
                              href={showHref.show(show.slug)}
                              className={styles.titleLink}
                            >
                              {show.title}
                            </Link>
                          </p>
                          {/* Şerit "en son eklenenler": tarih de EKLENME
                              tarihi, yoksa sıralamayla çelişir */}
                          <p className={styles.frameDate}>
                            {show.addedAt
                              ? dateFormatter.format(new Date(show.addedAt))
                              : show.watchedAt
                                ? dateFormatter.format(new Date(show.watchedAt))
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

            {/* İzliyorum en üstte: dizide en sık dönülen raf burası —
                "nerede kaldım" sorusunun cevabı */}
            {shelves.watching.length > 0
              ? renderShelf("watching", shelves.watching)
              : null}
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
