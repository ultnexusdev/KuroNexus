import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { fetchMusicPlaylists } from "@/lib/api/music";
import { readIsAdmin } from "@/lib/auth/session";
import { musicHref } from "@/lib/music/routes";
import { shareCard } from "@/lib/seo";
import { CoverArt } from "@/components/music/CoverArt";
import { GenreMixBar } from "@/components/music/GenreMixBar";
import { PlaylistCreator } from "@/components/music/PlaylistCreator";
import shell from "../layout.module.css";
import styles from "./page.module.css";

/**
 * Çalma listesi dizini — `/muzik/listeler`.
 *
 * Salon kavşağındaki şerit yalnızca favorileri gösteriyor ve tek sıra
 * taşıyor; hepsi burada. İki tür liste var ve rozet ayırıyor:
 *   - **bizim listelerimiz** (`isLocal`): küratör elle kurdu, parça ekleyip
 *     çıkarabiliyor,
 *   - **Spotify'dan gelenler**: senkronizasyon yazıyor, elle değiştirilse bir
 *     sonraki tazelemede geri gelir.
 */

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "music" });
  const title = t("paths.playlistsTitle");
  return {
    title,
    ...shareCard({ title, locale, path: musicHref.playlists() }),
  };
}

function formatDuration(ms: number | null): string {
  if (!ms || ms <= 0) {
    return "";
  }
  const minutes = Math.round(ms / 60_000);
  const hours = Math.floor(minutes / 60);
  return hours > 0 ? `${hours} sa ${minutes % 60} dk` : `${minutes} dk`;
}

export default async function MusicPlaylistsPage() {
  const isAdmin = await readIsAdmin();
  const [playlists, t] = await Promise.all([
    fetchMusicPlaylists(isAdmin),
    getTranslations("music"),
  ]);

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <Link href={musicHref.root()} className={styles.back}>
          ← {t("name")}
        </Link>
        {/* Başlık "Favori listelerim" DEĞİL: o etiket salon kavşağındaki tek
            sıralık favori şeridinin adı. Burası listelerin hepsi. */}
        <h1 className={`${shell.carved} ${styles.title}`}>
          {t("paths.playlistsTitle")}
        </h1>
        <p className={`${shell.prose} ${styles.lede}`}>
          {t("playlists.lede")}
        </p>
      </header>

      {isAdmin ? <PlaylistCreator /> : null}

      {playlists.length === 0 ? (
        <p className={styles.empty}>{t("playlists.empty")}</p>
      ) : (
        <ul className={styles.grid}>
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              <Link
                href={musicHref.playlist(playlist.slug)}
                className={`${shell.panel} ${styles.card}`}
              >
                <CoverArt src={playlist.artwork} alt={playlist.name} size={64} />
                <span className={styles.cardBody}>
                  <span className={styles.name}>{playlist.name}</span>
                  <span className={shell.label}>
                    {t("playlists.trackCount", { count: playlist.trackCount })}
                    {playlist.durationMs
                      ? ` · ${formatDuration(playlist.durationMs)}`
                      : ""}
                  </span>
                  {playlist.description ? (
                    <span className={styles.desc}>{playlist.description}</span>
                  ) : null}
                  <GenreMixBar mix={playlist.genreMix} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
