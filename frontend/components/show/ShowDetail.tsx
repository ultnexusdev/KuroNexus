"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/lib/i18n/navigation";
import { fetchSeasonEpisodes, tmdbImage } from "@/lib/api/shows";
import { ApiError } from "@/lib/api/client";
import type {
  ArchiveShow,
  ArchiveShowSeason,
  SeasonEpisodes,
  ShowCastMember,
  ShowDetail as ShowDetailData,
  ShowLink,
  ShowLinkKind,
  ShowProvider,
  SimilarShow,
} from "@/lib/api/types";
import styles from "./ShowDetail.module.css";
import { Lightbox } from "@/components/hall/Lightbox";
import { ArchiveAddButtons } from "@/components/hall/ArchiveAddButtons";
import { CuratorDock } from "@/components/curated/CuratorDock";

/**
 * Dizi sayfası — film salonundaki `MovieDetail`ın aynısı. Künye levhasında
 * bütçe/hâsılat yerine sezon/bölüm sayısı ve yayın durumu durur (dizide
 * bunların TMDB karşılığı yok).
 */

/* Küratör panelleri yalnızca admin görürken iniyor (BookDetail deseni,
   2026-09-01 denetimi P-02): statik import edilselerdi `lib/admin/api` ile
   birlikte her ziyaretçinin chunk'ına girerlerdi. */
const QuickActions = dynamic(
  () => import("./ShowDetailCurator").then((mod) => mod.QuickActions),
  { ssr: false },
);
const SeasonTools = dynamic(
  () => import("./ShowDetailCurator").then((mod) => mod.SeasonTools),
  { ssr: false },
);
const CuratorLinks = dynamic(
  () => import("./ShowDetailCurator").then((mod) => mod.CuratorLinks),
  { ssr: false },
);

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
  /* Açık sahne karesinin sırası; `null` ise pencere kapalı. */
  const [openStill, setOpenStill] = useState<number | null>(null);
  const { show } = detail;
  const backdrop = tmdbImage(show.backdropPath, "w780");
  // Sayfa açılınca kaldığım sezon açık gelir — "nerede kaldım" aranmasın
  const [openSeason, setOpenSeason] = useState<string | null>(
    show.currentSeason?.id ?? null,
  );

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
            <CuratorDock
              on={curating}
              onToggle={() => setCurating((value) => !value)}
              label={curating ? tShow("curator.off") : tShow("curator.on")}
            />
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
                    {detail.stills.map((path, index) => (
                      <li key={path}>
                        {/* Kare artık bir düğme: tıklayınca tam boyu
                            aynı sayfada açılıyor. Erişilebilir ad burada,
                            o yüzden görselin alt'ı boş kalabiliyor. */}
                        <button
                          type="button"
                          className={styles.still}
                          onClick={() => setOpenStill(index)}
                          aria-label={t("openStill", {
                            index: index + 1,
                            total: detail.stills.length,
                          })}
                        >
                          <Image
                            src={tmdbImage(path, "w500")!}
                            alt=""
                            fill
                            sizes="(max-width: 900px) 90vw, 276px"
                            className={styles.stillImg}
                            unoptimized
                          />
                        </button>
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

            {/* Sezonlar ve bölüm ilerlemesi — dizi sayfasının filmden asıl
                ayrıldığı yer. Konudan hemen sonra: en sık dönülen bölüm bu */}
            {show.seasons.length > 0 ? (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  {t("seasonsTitle")}
                  <span className={styles.episodesMeta}>
                    {"  "}
                    {show.trackedEpisodes
                      ? t("totalProgress", {
                          watched: show.watchedEpisodes,
                          total: show.trackedEpisodes,
                        })
                      : t("totalProgressOpen", {
                          watched: show.watchedEpisodes,
                        })}
                  </span>
                </h2>
                <ul className={styles.seasons}>
                  {show.seasons.map((season, index) => (
                    <SeasonRow
                      key={season.id}
                      season={season}
                      index={index + 1}
                      isOpen={openSeason === season.id}
                      isAdmin={isAdmin}
                      onToggle={() =>
                        setOpenSeason(
                          openSeason === season.id ? null : season.id,
                        )
                      }
                    />
                  ))}
                </ul>
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
                    <SimilarRow
                      key={item.tmdbId}
                      show={item}
                      curating={isAdmin && curating}
                    />
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>
        </div>
      </div>

      {/* Pencere sayfanın EN DIŞINDA — gerekçesi MovieDetail'de yazılı */}
      <Lightbox
        items={detail.stills.map((path, index) => ({
          src: tmdbImage(path, "w1280")!,
          alt: t("openStill", { index: index + 1, total: detail.stills.length }),
        }))}
        index={openStill}
        onClose={() => setOpenStill(null)}
        onMove={setOpenStill}
      />
    </div>
  );
}

/**
 * Bir sezon satırı: afiş, "4/10" sayacı, ilerleme çubuğu ve açılınca bölüm
 * ızgarası. Anime kanadındaki `PartRow`un dizi karşılığı — tek fark sezon
 * listesinin elle değil TMDB künyesinden gelmesi.
 */
function SeasonRow({
  season,
  index,
  isOpen,
  isAdmin,
  onToggle,
}: {
  season: ArchiveShowSeason;
  index: number;
  isOpen: boolean;
  isAdmin: boolean;
  onToggle: () => void;
}) {
  const t = useTranslations("show");
  const percent =
    season.episodes && season.episodes > 0
      ? Math.min(
          100,
          Math.round((season.watchedEpisodes / season.episodes) * 100),
        )
      : 0;
  const poster = tmdbImage(season.posterPath, "w185");

  return (
    <li className={isOpen ? styles.seasonOpen : styles.season}>
      <div className={styles.seasonHead}>
        <span className={styles.seasonIndex}>
          {String(index).padStart(2, "0")}
        </span>

        <span className={styles.seasonCover}>
          {poster ? (
            <Image
              src={poster}
              alt=""
              fill
              sizes="60px"
              className={styles.seasonCoverImg}
              unoptimized
            />
          ) : null}
        </span>

        <span className={styles.seasonInfo}>
          <button
            type="button"
            className={styles.seasonToggle}
            onClick={onToggle}
          >
            {season.name || t("seasonShort", { number: season.seasonNumber })}
          </button>
          <span className={styles.seasonMeta}>
            {[
              season.airDate ? season.airDate.slice(0, 4) : null,
              season.episodes
                ? t("episodeOf", {
                    watched: season.watchedEpisodes,
                    total: season.episodes,
                  })
                : t("episodeCount", { watched: season.watchedEpisodes }),
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
          {season.episodes ? (
            <span className={styles.seasonBar} aria-hidden>
              <span
                className={styles.seasonBarFill}
                style={{ width: `${percent}%` }}
              />
            </span>
          ) : null}
        </span>

        <button
          type="button"
          className={styles.seasonChevron}
          aria-expanded={isOpen}
          aria-label={season.name}
          onClick={onToggle}
        >
          {isOpen ? "▾" : "▸"}
        </button>
      </div>

      {isOpen ? (
        <>
          {isAdmin ? <SeasonTools season={season} /> : null}
          <EpisodeGrid season={season} isAdmin={isAdmin} />
        </>
      ) : null}
    </li>
  );
}

/**
 * Bölüm ızgarası. Sayfa açılışında inmez: sezon açılınca istenir. Bir kareye
 * tıklamak "buraya kadar izledim" demektir (izlenmiş kareye tıklamak bir
 * öncesine geri alır) — anime kanadındaki davranışın aynısı.
 */
function EpisodeGrid({
  season,
  isAdmin,
}: {
  season: ArchiveShowSeason;
  isAdmin: boolean;
}) {
  const t = useTranslations("show.detail");
  const router = useRouter();
  const [data, setData] = useState<SeasonEpisodes | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const result = await fetchSeasonEpisodes(season.id);
        if (!cancelled) {
          setData(result);
        }
      } catch {
        // Izgara süs: alınamazsa sezon sayaçla kalır
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [season.id]);

  async function markThrough(episodeNumber: number, isWatched: boolean) {
    setBusy(true);
    try {
      // Izgara ziyaretçiye de çiziliyor; admin API'si tıklama ANINDA yüklenir
      // ki `lib/admin/api` ziyaretçi chunk'ına girmesin (P-02)
      const { updateShowSeason } = await import("@/lib/admin/api");
      await updateShowSeason(season.id, {
        watchedEpisodes: isWatched ? episodeNumber - 1 : episodeNumber,
      });
      setData(await fetchSeasonEpisodes(season.id));
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className={styles.episodesLoading}>{t("loadingEpisodes")}</p>;
  }
  if (!data || data.episodes.length === 0) {
    return <p className={styles.episodesLoading}>{t("noEpisodes")}</p>;
  }

  // Kaldığım yer: bir sonraki izlenecek bölüm vurgulanır
  const nextUp = data.episodes.find(
    (episode) => episode.state === "UNWATCHED",
  )?.number;

  return (
    <div className={styles.episodes}>
      <div className={styles.episodesHead}>
        <span className={styles.episodesMeta}>
          {t("episodeGridCount", { count: data.episodes.length })}
        </span>
      </div>

      <ol className={styles.episodeGrid}>
        {data.episodes.map((episode) => {
          const isWatched = episode.state === "WATCHED";
          const className = [
            isWatched
              ? styles.epWatched
              : episode.state === "SKIPPED"
                ? styles.epSkipped
                : styles.ep,
            episode.number === nextUp ? styles.epCurrent : "",
          ]
            .filter(Boolean)
            .join(" ");

          const label = [
            `${episode.number}. ${episode.title ?? ""}`.trim(),
            episode.airDate ? episode.airDate.slice(0, 10) : "",
          ]
            .filter(Boolean)
            .join(" · ");

          return (
            <li key={episode.number}>
              <button
                type="button"
                className={className}
                title={label}
                aria-label={label}
                disabled={!isAdmin || busy}
                onClick={() => void markThrough(episode.number, isWatched)}
              >
                {episode.number}
              </button>
            </li>
          );
        })}
      </ol>

      {isAdmin ? (
        <p className={styles.episodesHint}>{t("gridHint")}</p>
      ) : null}
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

/**
 * Ray'daki benzer dizi satırı — film salonundaki `SimilarRow`ın aynısı.
 *
 * Küratör modunda arşivde OLMAYAN dizinin yanında iki simge çıkıyor
 * (kullanıcı isteği: "yanında da izledim/izleyeceğim butonları olsun").
 * Diziye özel `WATCHING` durumu bilerek YOK: buradan eklenen dizinin henüz
 * sezon ilerlemesi girilmemiş oluyor, "izliyorum" demek kaçıncı bölümde
 * olduğu bilgisini uydurmak olurdu. İlerleme dizinin kendi sayfasından
 * giriliyor.
 */
function SimilarRow({
  show,
  curating,
}: {
  show: SimilarShow;
  /** Küratör modu açık mı — yetki her istekte backend'de ayrıca doğrulanıyor */
  curating: boolean;
}) {
  const t = useTranslations("show.detail");
  const tCurator = useTranslations("show.curator");
  const router = useRouter();
  /* Eklenen dizi ANINDA arşivde sayılıyor: tazeleme sunucuya bir tur ve o
     dönene kadar düğmeler dursa küratör aynı diziyi ikinci kez ekleyebilir. */
  const [added, setAdded] = useState(false);
  const inArchive = show.inArchive || added;
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
      {inArchive ? (
        <span className={styles.similarMark} title={t("inArchive")}>
          ✓
        </span>
      ) : null}
    </>
  );

  /* `show.slug` şartı duruyor: yeni eklenen dizinin adresi ancak tazeleme
     dönünce geliyor, o ana kadar satır TMDB'ye gitmeye devam ediyor. */
  const row =
    show.inArchive && show.slug ? (
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
    );

  return (
    <li className={styles.similarItem}>
      {row}
      {/* Düğmeler bağlantının DIŞINDA: `<a>` içinde etkileşimli öğe geçersiz
          işaretleme olurdu */}
      {curating && !inArchive ? (
        <ArchiveAddButtons
          labels={{
            watched: tCurator("addWatched", { title: show.title }),
            watchlist: tCurator("addWatchlist", { title: show.title }),
            failed: tCurator("addFailed", { title: show.title }),
          }}
          onAdd={async (status) => {
            try {
              // Yalnızca küratör modunda çizilen düğme: admin API'si tıklama
              // anında yüklenir (P-02)
              const { createShowEntry } = await import("@/lib/admin/api");
              await createShowEntry({
                tmdbId: show.tmdbId,
                status,
                /* Tarih damgası şart — film tarafındaki gerekçenin aynısı.
                   Dizide fazladan bir tuhaflık var: backend WATCHED gelince
                   bütün sezonları izlenmiş işaretliyor, yani kayıt "bitirdim"
                   diyor; tarihsiz bırakılırsa küratör bitirdiği diziyi
                   "Son İzlenenler" şeridinde göremiyor. */
                watchedAt:
                  status === "WATCHLIST"
                    ? undefined
                    : new Date().toISOString(),
              });
            } catch (error) {
              // 409 = "zaten arşivde": hata değil, istenen sonuç zaten olmuş
              if (!(error instanceof ApiError) || error.status !== 409) {
                throw error;
              }
            }
            setAdded(true);
            router.refresh();
          }}
        />
      ) : null}
    </li>
  );
}

/* CuratorLinks artık ShowDetailCurator.tsx'te — dosya başındaki dynamic()
   tanımına bakın (P-02). */
