"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { tmdbImage } from "@/lib/api/movies";
import type { ArchiveMovie } from "@/lib/api/types";
import styles from "./FilmHall.module.css";

// Salon sayfası ve raf sayfaları aynı kartı kullanır — tek yerde durur
const CuratorCardTools = dynamic(
  () => import("./FilmCurator").then((mod) => mod.CuratorCardTools),
  { ssr: false },
);

export function Poster({
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

export function MovieCard({
  movie,
  curating,
}: {
  movie: ArchiveMovie;
  curating: boolean;
}) {
  const t = useTranslations("film");
  const rating = movie.personalRating ?? movie.voteAverage;
  const href = `/dark-stories/category/film/${movie.slug}`;

  return (
    <article className={styles.card}>
      {/* Afiş filmin kendi sayfasına açılır; künye örtüsü bağlantının içinde
          kalıyor ki üstüne gelince hem künye görünsün hem tıklanabilsin */}
      <Link href={href} className={styles.posterWrap}>
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
      </Link>

      <h3 className={styles.cardTitle}>
        <Link href={href} className={styles.titleLink}>
          {movie.title}
        </Link>
      </h3>
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
