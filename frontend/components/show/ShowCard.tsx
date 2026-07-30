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
  const rating = show.personalRating ?? show.voteAverage;
  const href = `/dark-stories/category/dizi/${show.slug}`;

  return (
    <article className={styles.card}>
      {/* Afiş dizinin kendi sayfasına açılır; künye örtüsü bağlantının
          içinde kalıyor ki üstüne gelince hem künye görünsün hem tıklanabilsin */}
      <Link href={href} className={styles.posterWrap}>
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
      <p className={styles.cardMeta}>
        {show.releaseYear ? <span>{show.releaseYear}</span> : null}
        {rating ? (
          <span className={styles.cardRating}>{rating.toFixed(1)}</span>
        ) : null}
      </p>
      {curating ? <CuratorCardTools show={show} /> : null}
    </article>
  );
}
