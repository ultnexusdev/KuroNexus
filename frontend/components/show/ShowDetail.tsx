"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/lib/i18n/navigation";
import { tmdbImage } from "@/lib/api/shows";
import { updateShowEntry } from "@/lib/admin/api";
import type {
  ArchiveShow,
  ShowCastMember,
  ShowDetail as ShowDetailData,
  ShowLink,
  ShowLinkKind,
  ShowProvider,
  SimilarShow,
} from "@/lib/api/types";
import styles from "./ShowDetail.module.css";

/**
 * Dizi sayfası — film salonundaki `MovieDetail`ın aynısı. Künye levhasında
 * bütçe/hâsılat yerine sezon/bölüm sayısı ve yayın durumu durur (dizide
 * bunların TMDB karşılığı yok).
 */
export function ShowDetail({
  detail,
  isAdmin = false,
}: {
  detail: ShowDetailData;
  isAdmin?: boolean;
}) {
  const t = useTranslations("show.detail");
  const tShow = useTranslations("show");
  const locale = useLocale();
  const [curating, setCurating] = useState(false);
  const { show } = detail;
  const backdrop = tmdbImage(show.backdropPath, "w780");

  return (
    <div data-category="dizi" className={styles.page}>
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
        <div className={styles.topBar}>
          <Link
            href="/dark-stories/category/dizi/arsiv"
            className={styles.back}
          >
            {tShow("backToArchive")}
          </Link>

          {isAdmin ? (
            <button
              type="button"
              className={curating ? styles.curatorOn : styles.curatorOff}
              aria-pressed={curating}
              onClick={() => setCurating((value) => !value)}
            >
              {curating ? tShow("curator.off") : tShow("curator.on")}
            </button>
          ) : null}
        </div>

        <header className={styles.head}>
          <div className={styles.posterFrame}>
            {tmdbImage(show.posterPath, "w500") ? (
              <Image
                src={tmdbImage(show.posterPath, "w500")!}
                alt=""
                fill
                sizes="220px"
                className={styles.posterImg}
                unoptimized
              />
            ) : (
              <span className={styles.posterFallback}>{show.title}</span>
            )}

            {isAdmin && curating ? <QuickActions show={show} /> : null}
          </div>

          <div className={styles.headText}>
            <h1 className={styles.title}>
              {show.title}
              {show.releaseYear ? (
                <span className={styles.year}>{show.releaseYear}</span>
              ) : null}
            </h1>

            {detail.tagline ? (
              <p className={styles.tagline}>{detail.tagline}</p>
            ) : null}

            <p className={styles.facts}>
              {show.runtime ? (
                <span>{tShow("minutes", { count: show.runtime })}</span>
              ) : null}
              {show.genres.length > 0 ? (
                <span>{show.genres.join(" · ")}</span>
              ) : null}
              {show.director ? (
                <span>{t("createdBy", { name: show.director })}</span>
              ) : null}
            </p>

            <div className={styles.scores}>
              {show.personalRating !== null ? (
                <span className={styles.myScore}>
                  <span className={styles.scoreValue}>
                    {show.personalRating.toFixed(1)}
                  </span>
                  <span className={styles.scoreLabel}>{t("myScore")}</span>
                </span>
              ) : null}
              {show.voteAverage ? (
                <span className={styles.tmdbScore}>
                  <span className={styles.scoreValue}>
                    {show.voteAverage.toFixed(1)}
                  </span>
                  <span className={styles.scoreLabel}>{t("tmdbScore")}</span>
                </span>
              ) : null}
              {show.isFavorite ? (
                <span className={styles.favorite}>★ {tShow("favorite")}</span>
              ) : null}
              <span className={styles.status}>
                {tShow(`statusName.${show.status}`)}
              </span>
            </div>
          </div>
        </header>

        <div className={styles.columns}>
          <aside className={styles.railLeft}>
            <section className={styles.railBlock}>
              <h2 className={styles.railTitle}>{t("dossier")}</h2>
              <dl className={styles.dossierList}>
                {detail.originalTitle &&
                detail.originalTitle !== show.title ? (
                  <div>
                    <dt>{t("originalTitle")}</dt>
                    <dd>{detail.originalTitle}</dd>
                  </div>
                ) : null}
                {detail.releaseDate ? (
                  <div>
                    <dt>{t("releaseDate")}</dt>
                    <dd>{formatDate(detail.releaseDate, locale)}</dd>
                  </div>
                ) : null}
                {detail.originalLanguage ? (
                  <div>
                    <dt>{t("language")}</dt>
                    <dd>{languageName(detail.originalLanguage, locale)}</dd>
                  </div>
                ) : null}
                {show.director ? (
                  <div>
                    <dt>{t("director")}</dt>
                    <dd>{show.director}</dd>
                  </div>
                ) : null}
                {show.numberOfSeasons ? (
                  <div>
                    <dt>{t("seasons")}</dt>
                    <dd>{t("seasonCount", { count: show.numberOfSeasons })}</dd>
                  </div>
                ) : null}
                {show.numberOfEpisodes ? (
                  <div>
                    <dt>{t("episodes")}</dt>
                    <dd>{t("episodeCount", { count: show.numberOfEpisodes })}</dd>
                  </div>
                ) : null}
                {detail.airStatus ? (
                  <div>
                    <dt>{t("airStatus")}</dt>
                    <dd>{detail.airStatus}</dd>
                  </div>
                ) : null}
                {show.watchedAt ? (
                  <div>
                    <dt>{t("watchedAt")}</dt>
                    <dd>{formatDate(show.watchedAt, locale)}</dd>
                  </div>
                ) : null}
              </dl>
            </section>

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

            {detail.neighbours.byDirector.length > 0 ||
            detail.neighbours.byGenre.length > 0 ? (
              <section className={styles.railBlock}>
                <h2 className={styles.railTitle}>{t("neighbours")}</h2>
                {detail.neighbours.byDirector.length > 0 ? (
                  <>
                    <p className={styles.railLabel}>
                      {t("sameDirector", { name: show.director ?? "" })}
                    </p>
                    <ul className={styles.similar}>
                      {detail.neighbours.byDirector.map((item) => (
                        <ArchiveRow key={item.id} show={item} />
                      ))}
                    </ul>
                  </>
                ) : null}
                {detail.neighbours.byGenre.length > 0 ? (
                  <>
                    <p className={styles.railLabel}>{t("sameGenre")}</p>
                    <ul className={styles.similar}>
                      {detail.neighbours.byGenre.map((item) => (
                        <ArchiveRow key={item.id} show={item} />
                      ))}
                    </ul>
                  </>
                ) : null}
              </section>
            ) : null}

            {detail.stills.length > 0 ? (
              <section className={styles.railBlock}>
                <h2 className={styles.railTitle}>{t("stills")}</h2>
                <div className={styles.stillStrip}>
                  <span className={styles.perforation} aria-hidden />
                  <ul className={styles.stills}>
                    {detail.stills.map((path) => (
                      <li key={path} className={styles.still}>
                        <Image
                          src={tmdbImage(path, "w500")!}
                          alt=""
                          fill
                          sizes="260px"
                          className={styles.stillImg}
                          unoptimized
                        />
                      </li>
                    ))}
                  </ul>
                  <span className={styles.perforation} aria-hidden />
                </div>
              </section>
            ) : null}
          </aside>

          <div className={styles.main}>
            {show.personalNote ? (
              <section className={styles.noteBlock}>
                <h2 className={styles.noteTitle}>{t("myNote")}</h2>
                <p className={styles.note}>{show.personalNote}</p>
              </section>
            ) : null}

            {show.overview ? (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t("overview")}</h2>
                <p className={styles.overview}>{show.overview}</p>
              </section>
            ) : null}

            {detail.trailerKey ? (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t("trailer")}</h2>
                <Trailer videoKey={detail.trailerKey} showTitle={show.title} />
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

            {isAdmin && curating ? <CuratorLinks detail={detail} /> : null}
          </div>

          <aside className={styles.rail}>
            {detail.similar.length > 0 ? (
              <section className={styles.railBlock}>
                <h2 className={styles.railTitle}>{t("similar")}</h2>
                <ul className={styles.similar}>
                  {detail.similar.map((item) => (
                    <SimilarRow key={item.tmdbId} show={item} />
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

function QuickActions({ show }: { show: ArchiveShow }) {
  const t = useTranslations("show.detail");
  const tShow = useTranslations("show");
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function apply(input: Parameters<typeof updateShowEntry>[1]) {
    setBusy(true);
    try {
      await updateShowEntry(show.id, input);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.quick}>
      <button
        type="button"
        className={show.status === "WATCHED" ? styles.quickOn : styles.quickBtn}
        disabled={busy}
        onClick={() =>
          void apply({
            status: "WATCHED",
            watchedAt: new Date().toISOString(),
          })
        }
      >
        {tShow("statusName.WATCHED")}
      </button>
      <button
        type="button"
        className={
          show.status === "WATCHLIST" ? styles.quickOn : styles.quickBtn
        }
        disabled={busy}
        onClick={() => void apply({ status: "WATCHLIST", watchedAt: "" })}
      >
        {tShow("statusName.WATCHLIST")}
      </button>
      <button
        type="button"
        className={show.isFavorite ? styles.quickOn : styles.quickBtn}
        disabled={busy}
        title={t("toggleFavorite")}
        onClick={() => void apply({ isFavorite: !show.isFavorite })}
      >
        ★ {tShow("favorite")}
      </button>
    </div>
  );
}

function ArchiveRow({ show }: { show: ArchiveShow }) {
  const poster = tmdbImage(show.posterPath, "w185");
  return (
    <li>
      <Link
        href={`/dark-stories/category/dizi/${show.slug}`}
        className={styles.similarRow}
      >
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
          <span className={styles.similarTitle}>{show.title}</span>
          <span className={styles.similarMeta}>
            {[
              show.releaseYear,
              show.personalRating ? show.personalRating.toFixed(1) : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </span>
      </Link>
    </li>
  );
}

function formatDate(value: string, locale: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(date);
}

function languageName(code: string, locale: string): string {
  try {
    return (
      new Intl.DisplayNames([locale], { type: "language" }).of(code) ?? code
    );
  } catch {
    return code;
  }
}

function Trailer({
  videoKey,
  showTitle,
}: {
  videoKey: string;
  showTitle: string;
}) {
  const t = useTranslations("show.detail");
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className={styles.trailerFrame}>
        <iframe
          className={styles.trailerVideo}
          src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0`}
          title={t("trailerOf", { title: showTitle })}
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

function CastCard({ member }: { member: ShowCastMember }) {
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
  provider: ShowProvider;
  href: string | null;
}) {
  const t = useTranslations("show.detail");
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

const LINK_LABELS: Record<ShowLinkKind, string> = {
  TMDB: "TMDB",
  IMDB: "IMDb",
  RT: "Rotten Tomatoes",
  HOMEPAGE: "",
};

function LinkRow({ link }: { link: ShowLink }) {
  const t = useTranslations("show.detail");
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
      {link.isSearch ? (
        <span className={styles.linkSearch}>{t("searchLink")}</span>
      ) : null}
      <span className={styles.linkArrow} aria-hidden>
        ↗
      </span>
    </a>
  );
}

function SimilarRow({ show }: { show: SimilarShow }) {
  const t = useTranslations("show.detail");
  const poster = tmdbImage(show.posterPath, "w185");
  const year = show.releaseDate ? show.releaseDate.slice(0, 4) : null;

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
        <span className={styles.similarTitle}>{show.title}</span>
        <span className={styles.similarMeta}>
          {[year, show.voteAverage ? show.voteAverage.toFixed(1) : null]
            .filter(Boolean)
            .join(" · ")}
        </span>
      </span>
      {show.inArchive ? (
        <span className={styles.similarMark} title={t("inArchive")}>
          ✓
        </span>
      ) : null}
    </>
  );

  return (
    <li>
      {show.inArchive && show.slug ? (
        <Link
          href={`/dark-stories/category/dizi/${show.slug}`}
          className={styles.similarRow}
        >
          {body}
        </Link>
      ) : (
        <a
          href={`https://www.themoviedb.org/tv/${show.tmdbId}`}
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

const LINK_FIELDS = ["rt", "imdb", "trailer"] as const;

type LinkField = (typeof LINK_FIELDS)[number];

function CuratorLinks({ detail }: { detail: ShowDetailData }) {
  const t = useTranslations("show.detail");
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
      await updateShowEntry(detail.show.id, { links });
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
