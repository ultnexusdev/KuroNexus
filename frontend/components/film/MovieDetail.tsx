"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/lib/i18n/navigation";
import { tmdbImage } from "@/lib/api/movies";
import { ApiError } from "@/lib/api/client";
import { createMovieEntry, updateMovieEntry } from "@/lib/admin/api";
import type {
  ArchiveMovie,
  MovieCastMember,
  MovieDetail as MovieDetailData,
  MovieLink,
  MovieLinkKind,
  MovieProvider,
  SimilarMovie,
} from "@/lib/api/types";
import styles from "./MovieDetail.module.css";
import { Lightbox } from "@/components/hall/Lightbox";
import { ArchiveAddButtons } from "@/components/hall/ArchiveAddButtons";

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
  const locale = useLocale();
  const [curating, setCurating] = useState(false);
  /* Açık sahne karesinin sırası; `null` ise pencere kapalı.
     Sıra tutuluyor, görselin kendisi değil — ileri/geri o sıradan yürüyor. */
  const [openStill, setOpenStill] = useState<number | null>(null);
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
        <div className={styles.topBar}>
          <Link
            href="/dark-stories/category/film/arsiv"
            className={styles.back}
          >
            {tFilm("backToArchive")}
          </Link>

          {isAdmin ? (
            <button
              type="button"
              className={curating ? styles.curatorOn : styles.curatorOff}
              aria-pressed={curating}
              onClick={() => setCurating((value) => !value)}
            >
              {curating ? tFilm("curator.off") : tFilm("curator.on")}
            </button>
          ) : null}
        </div>

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

            {/* Hızlı işaretleme: küratör modunda afişin üstünde durur —
                durumu değiştirmek için arşive dönmek gerekmesin */}
            {isAdmin && curating ? <QuickActions movie={movie} /> : null}
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
          {/* Sol sütun: geniş ekranda boş kalan yeri dolduruyor; dar ekranda
              sağ rayın altına iniyor (CSS grid alanlarıyla) */}
          <aside className={styles.railLeft}>
            <section className={styles.railBlock}>
              <h2 className={styles.railTitle}>{t("dossier")}</h2>
              <dl className={styles.dossierList}>
                {detail.originalTitle &&
                detail.originalTitle !== movie.title ? (
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
                {movie.director ? (
                  <div>
                    <dt>{t("director")}</dt>
                    <dd>{movie.director}</dd>
                  </div>
                ) : null}
                {detail.budget ? (
                  <div>
                    <dt>{t("budget")}</dt>
                    <dd>{formatMoney(detail.budget, locale)}</dd>
                  </div>
                ) : null}
                {detail.revenue ? (
                  <div>
                    <dt>{t("revenue")}</dt>
                    <dd>{formatMoney(detail.revenue, locale)}</dd>
                  </div>
                ) : null}
                {movie.watchedAt ? (
                  <div>
                    <dt>{t("watchedAt")}</dt>
                    <dd>{formatDate(movie.watchedAt, locale)}</dd>
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
                      {t("sameDirector", { name: movie.director ?? "" })}
                    </p>
                    <ul className={styles.similar}>
                      {detail.neighbours.byDirector.map((item) => (
                        <ArchiveRow key={item.id} movie={item} />
                      ))}
                    </ul>
                  </>
                ) : null}
                {detail.neighbours.byGenre.length > 0 ? (
                  <>
                    <p className={styles.railLabel}>{t("sameGenre")}</p>
                    <ul className={styles.similar}>
                      {detail.neighbours.byGenre.map((item) => (
                        <ArchiveRow key={item.id} movie={item} />
                      ))}
                    </ul>
                  </>
                ) : null}
              </section>
            ) : null}

            {/* Sahne kareleri: salonun 35mm şerit kimliğinin sütuna inmiş
                hâli — perforasyon çizgileri arasında dikey bir şerit */}
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

            {/* Adres alanları yalnızca küratör modunda: sayfa normalde temiz
                kalsın ama Rotten Tomatoes'u düzeltme imkânı kaybolmasın */}
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
                      movie={item}
                      curating={isAdmin && curating}
                    />
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>
        </div>
      </div>

      {/* Pencere sayfanın EN DIŞINDA: sol rayın içinde kalsaydı o sütunun
          `overflow` ve `z-index` bağlamına hapsolur, tam ekranı kaplayamazdı. */}
      <Lightbox
        items={detail.stills.map((path, index) => ({
          // Büyütülen görsel w500 değil: küçük hâl şeritte yeterliydi ama
          // tam ekranda büyütülüp bulanıklaşırdı
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
 * Afişin üstündeki hızlı işaretleme düğmeleri (yalnızca küratör modunda).
 *
 * Üçü de tek tıkla kaydeder: "İzledim" tarihi bugüne yazar, "İzleyeceğim"
 * tarihi temizler (sırada bekleyen film henüz izlenmedi), "Favori" bayrağı
 * çevirir. Seçili olan düğme dolu görünür.
 */
function QuickActions({ movie }: { movie: ArchiveMovie }) {
  const t = useTranslations("film.detail");
  const tFilm = useTranslations("film");
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function apply(input: Parameters<typeof updateMovieEntry>[1]) {
    setBusy(true);
    try {
      await updateMovieEntry(movie.id, input);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.quick}>
      <button
        type="button"
        className={movie.status === "WATCHED" ? styles.quickOn : styles.quickBtn}
        disabled={busy}
        onClick={() =>
          void apply({
            status: "WATCHED",
            watchedAt: new Date().toISOString(),
          })
        }
      >
        {tFilm("statusName.WATCHED")}
      </button>
      <button
        type="button"
        className={
          movie.status === "WATCHLIST" ? styles.quickOn : styles.quickBtn
        }
        disabled={busy}
        onClick={() => void apply({ status: "WATCHLIST", watchedAt: "" })}
      >
        {tFilm("statusName.WATCHLIST")}
      </button>
      <button
        type="button"
        className={movie.isFavorite ? styles.quickOn : styles.quickBtn}
        disabled={busy}
        title={t("toggleFavorite")}
        onClick={() => void apply({ isFavorite: !movie.isFavorite })}
      >
        ★ {tFilm("favorite")}
      </button>
    </div>
  );
}

/** Arşivdeki bir filme giden küçük satır (sol sütundaki komşu listeleri). */
function ArchiveRow({ movie }: { movie: ArchiveMovie }) {
  const poster = tmdbImage(movie.posterPath, "w185");
  return (
    <li>
      <Link
        href={`/dark-stories/category/film/${movie.slug}`}
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
          <span className={styles.similarTitle}>{movie.title}</span>
          <span className={styles.similarMeta}>
            {[
              movie.releaseYear,
              movie.personalRating ? movie.personalRating.toFixed(1) : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </span>
      </Link>
    </li>
  );
}

/** Tarihi okunur biçime çevirir; geçersizse ham metni döndürür. */
function formatDate(value: string, locale: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(date);
}

/** Bütçe/hâsılat: dolar, kısaltmasız ama okunur (1.500.000 $ gibi). */
function formatMoney(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Dil kodunu (en, ja…) okunur ada çevirir; tarayıcı bilmiyorsa kod kalır. */
function languageName(code: string, locale: string): string {
  try {
    return (
      new Intl.DisplayNames([locale], { type: "language" }).of(code) ?? code
    );
  } catch {
    return code;
  }
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

/**
 * Ray'daki benzer film satırı.
 *
 * Küratör modunda arşivde OLMAYAN filmin yanında iki simge çıkıyor: aramaya
 * gitmeden buradan "izledim" ya da "izleyeceğim" olarak eklenebiliyor
 * (kullanıcı isteği). Öneriler TMDB'den geliyor, arşivden değil; backend her
 * satırı arşivle karşılaştırıp `inArchive` işaretini koyuyor.
 */
function SimilarRow({
  movie,
  curating,
}: {
  movie: SimilarMovie;
  /** Küratör modu açık mı — yetki her istekte backend'de ayrıca doğrulanıyor */
  curating: boolean;
}) {
  const t = useTranslations("film.detail");
  const tCurator = useTranslations("film.curator");
  const router = useRouter();
  /* Eklenen film ANINDA arşivde sayılıyor: `router.refresh()` sunucuya bir tur
     ve o dönene kadar düğmeler ekranda kalırsa küratör aynı filmi ikinci kez
     ekleyebilir (backend "zaten arşivde" der, ama kullanıcı hata görür). */
  const [added, setAdded] = useState(false);
  const inArchive = movie.inArchive || added;
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
      {inArchive ? (
        <span className={styles.similarMark} title={t("inArchive")}>
          ✓
        </span>
      ) : null}
    </>
  );

  /* Arşivdeki film kendi sayfasına, olmayan TMDB'ye gider.
     `movie.slug` şartı duruyor: yeni eklenen filmin adresi ancak tazeleme
     dönünce geliyor, o ana kadar satır TMDB'ye gitmeye devam ediyor —
     olmayan bir adrese bağlamak 404 verirdi. */
  const row =
    movie.inArchive && movie.slug ? (
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
    );

  return (
    <li className={styles.similarItem}>
      {row}
      {/* Düğmeler bağlantının DIŞINDA: `<a>` içinde etkileşimli öğe geçersiz
          işaretleme olurdu (aynı karar karakter kartında da alınmıştı) */}
      {curating && !inArchive ? (
        <ArchiveAddButtons
          labels={{
            watched: tCurator("addWatched", { title: movie.title }),
            watchlist: tCurator("addWatchlist", { title: movie.title }),
            failed: tCurator("addFailed", { title: movie.title }),
          }}
          onAdd={async (status) => {
            try {
              await createMovieEntry({
                tmdbId: movie.tmdbId,
                status,
                /* Tarih damgası ŞART. Yazılmazsa backend kaydı
                   `watchedAt: null` ile açıyor ve film: "Son İzlenenler"
                   şeridine hiç girmiyor (şerit `watchedAt` olanları süzüyor),
                   "bu yıl izlenen" sayacına katılmıyor, kendi sayfasında
                   izleme tarihi çıkmıyor ve arşiv sıralaması `watchedAt desc`
                   olduğu için Postgres'te NULL'lar başa geldiğinden dün
                   izlenen filmlerin de ÜSTÜNE çıkıyor.
                   Sırada bekleyen film henüz izlenmedi — ona tarih yazmak
                   yanlış olur (arşivdeki bütün ekleme yolları böyle). */
                watchedAt:
                  status === "WATCHLIST"
                    ? undefined
                    : new Date().toISOString(),
              });
            } catch (error) {
              /* 409 = "zaten arşivde". Bu bir hata değil, istenen sonuç zaten
                 gerçekleşmiş demek — küratöre kırmızı ünlem göstermek onu
                 çıkışsız bir tekrar denemeye sokardı. Satır arşivdeymiş gibi
                 kapanıyor, tazeleme de rozeti ve kendi adresini getiriyor. */
              if (!(error instanceof ApiError) || error.status !== 409) {
                throw error;
              }
            }
            setAdded(true);
            /* Tazeleme şart: eklenen film artık arşivde ve satırın kendi
               sayfasına bağlanabilmesi için `slug`a ihtiyacı var. */
            router.refresh();
          }}
        />
      ) : null}
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
