import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { fetchMusicAlbum, type MusicAlbum } from "@/lib/api/music";
import { readIsAdmin } from "@/lib/auth/session";
import { musicHref, spotifyOpenUrl } from "@/lib/music/routes";
import { CoverArt, CoverTile } from "@/components/music/CoverArt";
import { SpotifyEmbed } from "@/components/music/SpotifyEmbed";
import { TrackList } from "@/components/music/TrackList";
import shell from "../../layout.module.css";
import styles from "./page.module.css";

/**
 * Albüm sayfası — `/muzik/[actSlug]/[albumSlug]`.
 *
 * ⚠️ NEDEN VAR: sanatçı sayfasındaki diskografi ızgarası bu adrese ZATEN
 * bağlıydı (`musicHref.album`) ama rota dosyası yoktu — her kapak tıklaması
 * 404'e gidiyordu (kullanıcı bildirimi, 12 Ağustos 2026). `routes.ts`in
 * başındaki "rota dosyaları bu adreslerle birebir eşleşir" sözü tutulmamıştı.
 *
 * Sanatçı slug'ı adreste zorunlu: albüm slug'ı tekil olduğu için tek başına
 * da bulunurdu, ama o zaman `/muzik/adele/meteora` Meteora'yı açardı.
 */

export const dynamic = "force-dynamic";

async function getAlbum(
  actSlug: string,
  albumSlug: string,
  fresh?: boolean,
): Promise<MusicAlbum> {
  try {
    return await fetchMusicAlbum(actSlug, albumSlug, fresh);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; actSlug: string; albumSlug: string }>;
}): Promise<Metadata> {
  const { locale, actSlug, albumSlug } = await params;
  const t = await getTranslations({ locale, namespace: "music" });
  try {
    const album = await fetchMusicAlbum(actSlug, albumSlug);
    return { title: `${album.title} · ${album.act.name}` };
  } catch {
    return { title: t("name") };
  }
}

function releaseLabel(
  date: string | null,
  precision: string | null,
  locale: string,
): string {
  if (!date) {
    return "";
  }
  const value = new Date(date);
  // Hassasiyet yılsa uydurulmuş gün/ay gösterilmiyor: Spotify "2003" derken
  // bizim "1 Ocak 2003" yazmamız olmayan bir kesinlik iddia ederdi
  if (precision === "year") {
    return String(value.getUTCFullYear());
  }
  if (precision === "month") {
    return value.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      timeZone: "UTC",
    });
  }
  return value.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function totalLength(ms: number): string {
  const minutes = Math.round(ms / 60_000);
  const hours = Math.floor(minutes / 60);
  return hours > 0 ? `${hours} sa ${minutes % 60} dk` : `${minutes} dk`;
}

export default async function MusicAlbumPage({
  params,
}: {
  params: Promise<{ locale: string; actSlug: string; albumSlug: string }>;
}) {
  const { locale, actSlug, albumSlug } = await params;
  const isAdmin = await readIsAdmin();
  const [album, t] = await Promise.all([
    getAlbum(actSlug, albumSlug, isAdmin),
    getTranslations("music"),
  ]);

  const primaryGenre = album.act.genres[0] ?? null;
  const duration = album.tracks.reduce(
    (total, track) => total + (track.durationMs ?? 0),
    0,
  );

  return (
    <div
      className={styles.page}
      data-genre={primaryGenre?.accentKey ?? undefined}
    >
      <nav className={styles.crumbs} aria-label={t("name")}>
        <Link href={musicHref.root()}>{t("name")}</Link>
        <span aria-hidden="true"> / </span>
        <Link href={musicHref.act(album.act.slug)}>{album.act.name}</Link>
        <span aria-hidden="true"> / </span>
        <span className={styles.crumbCurrent}>{album.title}</span>
      </nav>

      <header className={styles.hero}>
        <CoverArt src={album.artwork} alt={album.title} size={220} priority />
        <div className={styles.heroBody}>
          <span className={shell.label}>{t(`albumType.${album.albumType}`)}</span>
          <h1 className={`${shell.carved} ${styles.title}`}>{album.title}</h1>
          {album.originalTitle && album.originalTitle !== album.title ? (
            <p className={styles.originalTitle}>{album.originalTitle}</p>
          ) : null}

          <p className={styles.byline}>
            <Link href={musicHref.act(album.act.slug)} className={styles.actLink}>
              {album.act.name}
            </Link>
            {album.releaseDate
              ? ` · ${releaseLabel(album.releaseDate, album.releaseDatePrecision, locale)}`
              : ""}
          </p>

          <dl className={styles.facts}>
            <div>
              <dt className={shell.label}>{t("counts.tracks")}</dt>
              <dd>{album.tracks.length}</dd>
            </div>
            {duration > 0 ? (
              <div>
                <dt className={shell.label}>{t("album.duration")}</dt>
                <dd>{totalLength(duration)}</dd>
              </div>
            ) : null}
            {album.label ? (
              <div>
                <dt className={shell.label}>{t("album.label")}</dt>
                <dd>{album.label}</dd>
              </div>
            ) : null}
            {album.era ? (
              <div>
                <dt className={shell.label}>{t("act.eras")}</dt>
                <dd>{album.era.name}</dd>
              </div>
            ) : null}
          </dl>

          <ul className={styles.chips}>
            {album.act.genres.slice(0, 3).map((genre) => (
              <li key={genre.slug}>
                <Link href={musicHref.room(genre.slug)} className={styles.chip}>
                  {genre.name.toLocaleUpperCase("tr-TR")}
                </Link>
              </li>
            ))}
          </ul>

          {album.spotifyId ? (
            <a
              className={styles.spotifyLink}
              href={spotifyOpenUrl("album", album.spotifyId)}
              target="_blank"
              rel="noreferrer noopener"
            >
              {t("openInSpotify")}
            </a>
          ) : null}
        </div>
      </header>

      <div className={styles.split}>
        <section className={styles.section}>
          <h2 className={shell.label}>{t("album.tracks")}</h2>
          {album.tracks.length === 0 ? (
            <p className={styles.empty}>{t("album.noTracks")}</p>
          ) : (
            <TrackList
              tracks={album.tracks.map((track) => ({
                id: track.id,
                title: track.title,
                spotifyId: track.spotifyId,
                durationMs: track.durationMs,
                artist: album.act.name,
                album: { title: album.title, artwork: album.artwork },
                playCount: track.playCount,
              }))}
              context={album.title}
              isAdmin={isAdmin}
              /* Dinleme kaydı aktarılmadıysa sütun hiç çizilmiyor: sıfır dolu
                 bir sütun "hiç dinlemedim" der, oysa doğrusu "ölçüm yok" */
              showPlays={album.measured}
            />
          )}
        </section>

        <aside className={styles.side}>
          <span className={shell.label}>{t("act.player")}</span>
          <SpotifyEmbed kind="album" spotifyId={album.spotifyId} height={352} note />
        </aside>
      </div>

      {album.otherAlbums.length > 0 ? (
        <section className={styles.section}>
          <h2 className={shell.label}>
            {t("album.more", { name: album.act.name })}
          </h2>
          <ul className={styles.otherGrid}>
            {album.otherAlbums.map((other) => (
              <li key={other.slug} className={styles.otherCell}>
                <Link
                  href={musicHref.album(album.act.slug, other.slug)}
                  className={styles.otherLink}
                >
                  <CoverTile src={other.artwork} alt={other.title} cellPx={200} />
                  <span className={styles.otherTitle}>{other.title}</span>
                  <span className={shell.mono}>
                    {other.releaseDate
                      ? new Date(other.releaseDate).getUTCFullYear()
                      : ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
