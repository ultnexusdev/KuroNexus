"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { tmdbImage } from "@/lib/api/shows";
import type { ArchiveShow } from "@/lib/api/types";
import styles from "./ShowHall.module.css";

// Salon sayfası ve raf sayfaları aynı kartı kullanır — tek yerde durur
const CuratorCardTools = dynamic(
  () => import("./ShowCurator").then((mod) => mod.CuratorCardTools),
  { ssr: false },
);

export function Poster({
  show,
  size,
  sizes,
}: {
  show: ArchiveShow;
  size: "w185" | "w342" | "w500";
  sizes: string;
}) {
  const src = tmdbImage(show.posterPath, size);
  if (!src) {
    return (
      <span className={styles.posterFallback}>
        <span>{show.title}</span>
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

export function ShowCard({
  show,
  curating,
}: {
  show: ArchiveShow;
  curating: boolean;
}) {
  const t = useTranslations("show");
  // TMDB puanı, kişisel puan değil — gerekçesi MovieCard'da yazılı
  const rating = show.voteAverage;
  const href = `/dark-stories/category/dizi/${show.slug}`;
  const season = show.currentSeason;
  const percent =
    season?.episodes && season.episodes > 0
      ? Math.min(
          100,
          Math.round((season.watchedEpisodes / season.episodes) * 100),
        )
      : 0;

  return (
    <article className={styles.card}>
      {/* Afiş dizinin kendi sayfasına açılır; künye örtüsü bağlantının
          içinde kalıyor ki üstüne gelince hem künye görünsün hem tıklanabilsin.
          Erişilebilirlik ağacında YOK: adı yoktu (örtü metni gürültü üretiyordu)
          ve başlık bağlantısıyla aynı yere gidiyor (2026-08-22 denetim). */}
      <Link href={href} className={styles.posterWrap} aria-hidden="true" tabIndex={-1}>
        <Poster
          show={show}
          size="w342"
          sizes="(max-width: 640px) 45vw, (max-width: 1100px) 23vw, 15vw"
        />

        <div className={styles.overlay}>
          <dl className={styles.overlayFacts}>
            {show.voteAverage ? (
              <div>
                <dt>{t("tmdbScore")}</dt>
                <dd>{show.voteAverage.toFixed(1)}</dd>
              </div>
            ) : null}
            {show.numberOfSeasons ? (
              <div>
                <dt>{t("seasons")}</dt>
                <dd>{t("seasonCount", { count: show.numberOfSeasons })}</dd>
              </div>
            ) : null}
          </dl>
          {show.genres.length > 0 ? (
            <p className={styles.overlayGenres}>
              {show.genres.slice(0, 3).join(" · ")}
            </p>
          ) : null}
          {show.personalNote ? (
            <p className={styles.overlayNote}>{show.personalNote}</p>
          ) : null}
        </div>

        {show.isFavorite ? (
          <span className={styles.favoriteMark} aria-label={t("favorite")}>
            ★
          </span>
        ) : null}
      </Link>

      <h3 className={styles.cardTitle}>
        <Link href={href} className={styles.titleLink}>
          {show.title}
        </Link>
      </h3>

      {/* "Nerede kaldım": devam eden dizide en çok bakılan satır. Sırada
          bekleyen dizide anlamsız — henüz başlanmadı */}
      {season && show.status !== "WATCHLIST" ? (
        <>
          <p className={styles.cardProgress}>
            <span className={styles.seasonName}>
              {t("seasonShort", { number: season.seasonNumber })}
            </span>
            <span className={styles.seasonCount}>
              {season.episodes
                ? t("episodeOf", {
                    watched: season.watchedEpisodes,
                    total: season.episodes,
                  })
                : t("episodeCount", { watched: season.watchedEpisodes })}
            </span>
          </p>
          {/* Çubuk yalnızca bölüm sayısı bilinen sezonda anlamlı */}
          {season.episodes ? (
            <span className={styles.progressBar} aria-hidden>
              <span
                className={styles.progressFill}
                style={{ width: `${percent}%` }}
              />
            </span>
          ) : null}
        </>
      ) : null}

      <p className={styles.cardMeta}>
        {show.releaseYear ? <span>{show.releaseYear}</span> : null}
        {rating !== null ? (
          <span className={styles.cardRating} title={t("tmdbScore")}>
            <span className={styles.ratingSource} aria-hidden>
              TMDB
            </span>
            {rating.toFixed(1)}
          </span>
        ) : null}
      </p>
      {curating ? <CuratorCardTools show={show} /> : null}
    </article>
  );
}
