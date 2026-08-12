import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { fetchMusicPlaylist, type MusicPlaylistDetail } from "@/lib/api/music";
import { readIsAdmin } from "@/lib/auth/session";
import { musicHref, spotifyOpenUrl } from "@/lib/music/routes";
import { CoverArt } from "@/components/music/CoverArt";
import { TrackList } from "@/components/music/TrackList";
import { NowPlaying } from "@/components/player/NowPlaying";
import shell from "../../layout.module.css";
import styles from "./page.module.css";

/**
 * Çalma listesi sayfası — `/muzik/liste/[slug]`.
 *
 * Listenin tamamı tek düğmeyle kuyruğa giriyor ve şerit çalar sayfalar arası
 * gezinmede susmuyor: kuyruk kök düzende yaşıyor (kullanıcı isteği).
 *
 * ⚠️ Yalnızca `spotifyId`i olan parçalar kuyruğa giriyor — gömülü çalar
 * Spotify kimliğiyle çalışıyor. Kimliksiz parça listede görünüyor ama çal
 * düğmesi kapalı; sessizce hiçbir şey yapan bir düğmeden iyidir.
 */

export const dynamic = "force-dynamic";

async function getPlaylist(
  slug: string,
  fresh?: boolean,
): Promise<MusicPlaylistDetail> {
  try {
    return await fetchMusicPlaylist(slug, fresh);
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
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "music" });
  try {
    const playlist = await fetchMusicPlaylist(slug);
    return {
      title: `${playlist.name} · ${t("name")}`,
      description: playlist.description ?? undefined,
    };
  } catch {
    return { title: t("name") };
  }
}

function formatDuration(ms: number | null): string {
  if (!ms || ms <= 0) {
    return "";
  }
  const minutes = Math.round(ms / 60_000);
  const hours = Math.floor(minutes / 60);
  return hours > 0 ? `${hours} sa ${minutes % 60} dk` : `${minutes} dk`;
}

export default async function MusicPlaylistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isAdmin = await readIsAdmin();
  const [playlist, t] = await Promise.all([
    getPlaylist(slug, isAdmin),
    getTranslations("music"),
  ]);

  return (
    <div className={styles.page}>
      <nav className={styles.crumbs} aria-label={t("name")}>
        <Link href={musicHref.root()}>{t("name")}</Link>
        <span aria-hidden="true"> / </span>
        <Link href={musicHref.playlists()}>{t("paths.playlistsTitle")}</Link>
        <span aria-hidden="true"> / </span>
        <span className={styles.crumbCurrent}>{playlist.name}</span>
      </nav>

      <header className={styles.hero}>
        <CoverArt src={playlist.artwork} alt={playlist.name} size={160} />
        <div className={styles.heroBody}>
          <span className={shell.label}>
            {playlist.isLocal ? t("playlists.localBadge") : t("playlists.spotifyBadge")}
          </span>
          <h1 className={`${shell.carved} ${styles.title}`}>{playlist.name}</h1>
          {playlist.description ? (
            <p className={`${shell.prose} ${styles.desc}`}>
              {playlist.description}
            </p>
          ) : null}
          <span className={shell.label}>
            {t("playlists.trackCount", { count: playlist.trackCount })}
            {playlist.durationMs
              ? ` · ${formatDuration(playlist.durationMs)}`
              : ""}
          </span>
          {playlist.spotifyId ? (
            <a
              className={styles.spotifyLink}
              href={spotifyOpenUrl("playlist", playlist.spotifyId)}
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
          {playlist.tracks.length === 0 ? (
            <p className={styles.empty}>
              {isAdmin ? t("playlists.emptyAdmin") : t("playlists.emptyTracks")}
            </p>
          ) : (
            <TrackList
              tracks={playlist.tracks.map((track) => ({
                id: track.id,
                title: track.title,
                spotifyId: track.spotifyId,
                durationMs: track.durationMs,
                artist: track.album.act.name,
                album: { title: track.album.title, artwork: track.album.artwork },
              }))}
              context={playlist.name}
              isAdmin={isAdmin}
              showAlbum
              /* Çıkarma yalnızca YEREL listede: Spotify'dan gelen listeden
                 çıkarılan parça bir sonraki tazelemede geri gelirdi */
              playlistId={playlist.isLocal ? playlist.id : null}
            />
          )}
        </section>

        {/* Yerel listenin Spotify karşılığı yok, yani gömülecek bir adres de
            yoktu ve bu sütun bir uyarı metniyle duruyordu. Artık iki liste
            türü de aynı şeyi gösteriyor: kuyruğun kendisi. */}
        <aside className={styles.side}>
          <NowPlaying
            seed={{
              tracks: playlist.tracks.map((track) => ({
                spotifyId: track.spotifyId ?? "",
                title: track.title,
                artist: track.album.act.name,
                album: track.album.title,
                artwork: track.album.artwork,
              })),
              context: playlist.name,
              contextHref: musicHref.playlist(playlist.slug),
            }}
          />
        </aside>
      </div>
    </div>
  );
}
