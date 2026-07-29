"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/lib/i18n/navigation";
import { tmdbImage } from "@/lib/api/movies";
import { updateMovieEntry } from "@/lib/admin/api";
import type {
  MovieCastMember,
  MovieDetail as MovieDetailData,
  MovieLink,
  MovieLinkKind,
  MovieProvider,
  SimilarMovie,
} from "@/lib/api/types";
import styles from "./MovieDetail.module.css";

/**
 * Film sayfası.
 *
 * Düzen iki sütun (kullanıcı kararı: "her şey alt alta gelmesin"): solda
 * filmin kendisi — künye, kendi notun, fragman, kadro; sağda sabit kalan
 * bir ray — nerede izlenir, dış bağlantılar, benzer filmler. Dar ekranda ray
 * içeriğin altına iniyor.
 *
 * Sayfanın üstü afiş değil **backdrop**: TMDB'nin geniş sahne görseli
 * başlığın arkasına serilir, aşağı doğru zemine karışır.
 */
export function MovieDetail({
  detail,
  isAdmin = false,
}: {
  detail: MovieDetailData;
  isAdmin?: boolean;
}) {
  const t = useTranslations("film.detail");
  const tFilm = useTranslations("film");
  const { movie } = detail;
  const backdrop = tmdbImage(movie.backdropPath, "w780");

  return (
    <div data-category="film" className={styles.page}>
      {backdrop ? (
        <div className={styles.backdrop}>
          <Image
            src={backdrop}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.backdropImg}
            unoptimized
          />
          <div className={styles.backdropFade} />
        </div>
      ) : null}

      <div className={styles.inner}>
        <Link
          href="/dark-stories/category/film/arsiv"
          className={styles.back}
        >
          {tFilm("backToArchive")}
        </Link>

        <header className={styles.head}>
          <div className={styles.posterFrame}>
            {tmdbImage(movie.posterPath, "w500") ? (
              <Image
                src={tmdbImage(movie.posterPath, "w500")!}
                alt=""
                fill
                sizes="220px"
                className={styles.posterImg}
                unoptimized
              />
            ) : (
              <span className={styles.posterFallback}>{movie.title}</span>
            )}
          </div>

          <div className={styles.headText}>
            <h1 className={styles.title}>
              {movie.title}
              {movie.releaseYear ? (
                <span className={styles.year}>{movie.releaseYear}</span>
              ) : null}
            </h1>

            {/* Slogan filmin kendi cümlesi — özet değil, bir sesleniş */}
            {detail.tagline ? (
              <p className={styles.tagline}>{detail.tagline}</p>
            ) : null}

            <p className={styles.facts}>
              {movie.runtime ? (
                <span>{tFilm("minutes", { count: movie.runtime })}</span>
              ) : null}
              {movie.genres.length > 0 ? (
                <span>{movie.genres.join(" · ")}</span>
              ) : null}
              {movie.director ? (
                <span>{t("directedBy", { name: movie.director })}</span>
              ) : null}
            </p>

            <div className={styles.scores}>
              {movie.personalRating !== null ? (
                <span className={styles.myScore}>
                  <span className={styles.scoreValue}>
                    {movie.personalRating.toFixed(1)}
                  </span>
                  <span className={styles.scoreLabel}>{t("myScore")}</span>
                </span>
              ) : null}
              {movie.voteAverage ? (
                <span className={styles.tmdbScore}>
                  <span className={styles.scoreValue}>
                    {movie.voteAverage.toFixed(1)}
                  </span>
                  <span className={styles.scoreLabel}>{t("tmdbScore")}</span>
                </span>
              ) : null}
              {movie.isFavorite ? (
                <span className={styles.favorite}>★ {tFilm("favorite")}</span>
              ) : null}
              <span className={styles.status}>
                {tFilm(`statusName.${movie.status}`)}
              </span>
            </div>
          </div>
        </header>

        <div className={styles.columns}>
          <div className={styles.main}>
            {/* Kendi notun TMDB özetinden ÖNCE: burası senin arşivin */}
            {movie.personalNote ? (
              <section className={styles.noteBlock}>
                <h2 className={styles.noteTitle}>{t("myNote")}</h2>
                <p className={styles.note}>{movie.personalNote}</p>
              </section>
            ) : null}

            {movie.overview ? (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t("overview")}</h2>
                <p className={styles.overview}>{movie.overview}</p>
              </section>
            ) : null}

            {detail.trailerKey ? (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t("trailer")}</h2>
                <Trailer videoKey={detail.trailerKey} movieTitle={movie.title} />
              </section>
            ) : null}

            {detail.cast.length > 0 ? (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t("cast")}</h2>
                <ul className={styles.cast}>
                  {detail.cast.map((member) => (
                    <CastCard key={`${member.name}-${member.character}`} member={member} />
                  ))}
                </ul>
              </section>
            ) : null}

            {isAdmin ? <CuratorLinks detail={detail} /> : null}
          </div>

          <aside className={styles.rail}>
            {detail.providers.length > 0 ? (
              <section className={styles.railBlock}>
                <h2 className={styles.railTitle}>{t("whereToWatch")}</h2>
                <ul className={styles.providers}>
                  {detail.providers.map((provider) => (
                    <ProviderChip
                      key={provider.name}
                      provider={provider}
                      href={detail.providerLink}
                    />
                  ))}
                </ul>
                <p className={styles.railNote}>{t("providerSource")}</p>
              </section>
            ) : null}

            {detail.links.length > 0 ? (
              <section className={styles.railBlock}>
                <h2 className={styles.railTitle}>{t("links")}</h2>
                <ul className={styles.links}>
                  {detail.links.map((link) => (
                    <li key={link.kind}>
                      <LinkRow link={link} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {detail.similar.length > 0 ? (
              <section className={styles.railBlock}>
                <h2 className={styles.railTitle}>{t("similar")}</h2>
                <ul className={styles.similar}>
                  {detail.similar.map((item) => (
                    <SimilarRow key={item.tmdbId} movie={item} />
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}

/**
 * Fragman. iframe sayfa açılışında İNMEZ: önce YouTube'un kapak görseli
 * gösterilir, oynat düğmesine basınca gömülü oynatıcı yüklenir. Böylece her
 * film sayfası açılışında YouTube'a istek gitmiyor.
 */
function Trailer({
  videoKey,
  movieTitle,
}: {
  videoKey: string;
  movieTitle: string;
}) {
  const t = useTranslations("film.detail");
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className={styles.trailerFrame}>
        <iframe
          className={styles.trailerVideo}
          src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0`}
          title={t("trailerOf", { title: movieTitle })}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className={styles.trailerFrame}
      onClick={() => setPlaying(true)}
    >
      <Image
        src={`https://i.ytimg.com/vi/${videoKey}/hqdefault.jpg`}
        alt=""
        fill
        sizes="(max-width: 900px) 100vw, 640px"
        className={styles.trailerThumb}
        unoptimized
      />
      <span className={styles.trailerPlay} aria-hidden>
        ▶
      </span>
      <span className={styles.trailerLabel}>{t("playTrailer")}</span>
    </button>
  );
}

function CastCard({ member }: { member: MovieCastMember }) {
  const photo = tmdbImage(member.profilePath, "w185");
  return (
    <li className={styles.castCard}>
      <span className={styles.castPhoto}>
        {photo ? (
          <Image
            src={photo}
            alt=""
            fill
            sizes="88px"
            className={styles.castImg}
            unoptimized
          />
        ) : (
          <span className={styles.castInitial} aria-hidden>
            {member.name.slice(0, 1)}
          </span>
        )}
      </span>
      <span className={styles.castName}>{member.name}</span>
      {member.character ? (
        <span className={styles.castRole}>{member.character}</span>
      ) : null}
    </li>
  );
}

function ProviderChip({
  provider,
  href,
}: {
  provider: MovieProvider;
  href: string | null;
}) {
  const t = useTranslations("film.detail");
  const logo = tmdbImage(provider.logoPath, "w185");
  const body = (
    <>
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={28}
          height={28}
          className={styles.providerLogo}
          unoptimized
        />
      ) : null}
      <span className={styles.providerName}>{provider.name}</span>
      <span className={styles.providerKind}>
        {t(`providerKind.${provider.kind}`)}
      </span>
    </>
  );

  return (
    <li className={styles.provider}>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.providerLink}
        >
          {body}
        </a>
      ) : (
        <span className={styles.providerLink}>{body}</span>
      )}
    </li>
  );
}

const LINK_LABELS: Record<MovieLinkKind, string> = {
  TMDB: "TMDB",
  IMDB: "IMDb",
  RT: "Rotten Tomatoes",
  HOMEPAGE: "",
};

function LinkRow({ link }: { link: MovieLink }) {
  const t = useTranslations("film.detail");
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.linkRow}
    >
      <span className={styles.linkName}>
        {LINK_LABELS[link.kind] || t("linkName.HOMEPAGE")}
      </span>
      {/* Arama adresi olduğunu saklamıyoruz: tıklayan doğrudan filme
          gideceğini sanmasın (Rotten Tomatoes'un kaynağı yok) */}
      {link.isSearch ? (
        <span className={styles.linkSearch}>{t("searchLink")}</span>
      ) : null}
      <span className={styles.linkArrow} aria-hidden>
        ↗
      </span>
    </a>
  );
}

function SimilarRow({ movie }: { movie: SimilarMovie }) {
  const t = useTranslations("film.detail");
  const poster = tmdbImage(movie.posterPath, "w185");
  const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : null;

  const body = (
    <>
      <span className={styles.similarPoster}>
        {poster ? (
          <Image
            src={poster}
            alt=""
            fill
            sizes="48px"
            className={styles.similarImg}
            unoptimized
          />
        ) : null}
      </span>
      <span className={styles.similarText}>
        <span className={styles.similarTitle}>{movie.title}</span>
        <span className={styles.similarMeta}>
          {[year, movie.voteAverage ? movie.voteAverage.toFixed(1) : null]
            .filter(Boolean)
            .join(" · ")}
        </span>
      </span>
      {movie.inArchive ? (
        <span className={styles.similarMark} title={t("inArchive")}>
          ✓
        </span>
      ) : null}
    </>
  );

  // Arşivdeki film kendi sayfasına, olmayan TMDB'ye gider
  return (
    <li>
      {movie.inArchive && movie.slug ? (
        <Link
          href={`/dark-stories/category/film/${movie.slug}`}
          className={styles.similarRow}
        >
          {body}
        </Link>
      ) : (
        <a
          href={`https://www.themoviedb.org/movie/${movie.tmdbId}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.similarRow}
        >
          {body}
        </a>
      )}
    </li>
  );
}

/** Küratörün elle girebildiği alanlar — form durumunun anahtarları. */
const LINK_FIELDS = ["rt", "imdb", "trailer"] as const;

type LinkField = (typeof LINK_FIELDS)[number];

/**
 * Küratör künyesi (yalnızca admin): Rotten Tomatoes adresi, IMDb ve fragman.
 * Üçü de TMDB'den gelenin yerine geçer; alan boşaltılınca yeniden TMDB'ye
 * (RT'de ise arama adresine) dönülür.
 */
function CuratorLinks({ detail }: { detail: MovieDetailData }) {
  const t = useTranslations("film.detail");
  const router = useRouter();
  const [links, setLinks] = useState<Record<LinkField, string>>(() => ({
    rt: detail.customLinks?.rt ?? "",
    imdb: detail.customLinks?.imdb ?? "",
    trailer: detail.customLinks?.trailer ?? "",
  }));
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<"idle" | "saved" | "error">("idle");

  async function save() {
    setBusy(true);
    setState("idle");
    try {
      await updateMovieEntry(detail.movie.id, { links });
      setState("saved");
      router.refresh();
    } catch {
      setState("error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{t("curatorTitle")}</h2>
      <p className={styles.curatorLede}>{t("curatorLede")}</p>

      <div className={styles.curatorGrid}>
        {LINK_FIELDS.map((field) => (
          <label key={field} className={styles.curatorField}>
            <span>{t(`linkField.${field}`)}</span>
            <input
              type="url"
              value={links[field]}
              disabled={busy}
              placeholder="https://…"
              onChange={(event) =>
                setLinks({ ...links, [field]: event.target.value })
              }
            />
          </label>
        ))}
      </div>

      <div className={styles.curatorActions}>
        <button
          type="button"
          className={styles.curatorSave}
          disabled={busy}
          onClick={() => void save()}
        >
          {busy ? t("saving") : t("save")}
        </button>
        {state === "saved" ? (
          <span className={styles.curatorNote}>{t("saved")}</span>
        ) : null}
        {state === "error" ? (
          <span className={styles.curatorError}>{t("saveError")}</span>
        ) : null}
      </div>
    </section>
  );
}
