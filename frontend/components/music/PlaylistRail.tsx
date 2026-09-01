"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl, isLocalUpload } from "@/lib/api/client";
import type { MusicPlaylistSummary } from "@/lib/api/music";
import { musicHref } from "@/lib/music/routes";
import styles from "./PlaylistRail.module.css";

/**
 * Salonun sol rayı — çalma listeleri, Spotify'daki gibi.
 *
 * ⚠️ **Bir listeye tıklamak müziği DURDURMUYOR.** Kullanıcının açıkça
 * istediği davranış bu: *"doğrudan bir çalma listesi açınca müzik durmamalı,
 * mevcut çalan liste çalmaya devam etmeli."* Ray yalnızca sayfa değiştiriyor;
 * kuyruk kök düzende yaşadığı için gezinme sesi kesmiyor. Çalmayı başlatmanın
 * tek yolu bir parçaya ya da "Listeyi çal"a basmak — yani gezinmek ile
 * çalmak burada bilinçli olarak AYRI iki eylem.
 *
 * Veri sunucudan prop olarak geliyor (kanat düzeni çekiyor); ray yalnızca
 * hangi satırın açık olduğunu bilmek için istemci — `usePathname`.
 */
export function PlaylistRail({
  playlists,
}: {
  playlists: MusicPlaylistSummary[];
}) {
  const t = useTranslations("music");
  const pathname = usePathname();

  return (
    <nav className={styles.rail} aria-label={t("paths.playlistsTitle")}>
      <div className={styles.inner}>
        <ul className={styles.links}>
          <li>
            <Link
              href={musicHref.rooms()}
              className={
                pathname.includes("/muzik/tur") ? styles.navOn : styles.nav
              }
            >
              {t("paths.roomsTitle")}
            </Link>
          </li>
          <li>
            <Link
              href={musicHref.acts()}
              className={
                pathname.endsWith("/muzik/sanatcilar") ? styles.navOn : styles.nav
              }
            >
              {t("paths.actsTitle")}
            </Link>
          </li>
          <li>
            <Link
              href={musicHref.listening()}
              className={
                pathname.endsWith("/muzik/dinleme") ? styles.navOn : styles.nav
              }
            >
              {t("paths.listeningTitle")}
            </Link>
          </li>
        </ul>

        <div className={styles.head}>
          <Link href={musicHref.playlists()} className={styles.headLink}>
            {t("paths.playlistsTitle")}
          </Link>
        </div>

        {playlists.length === 0 ? (
          <p className={styles.empty}>{t("playlists.empty")}</p>
        ) : (
          <ul className={styles.list}>
            {playlists.map((playlist) => {
              const href = musicHref.playlist(playlist.slug);
              const active = pathname.endsWith(`/liste/${playlist.slug}`);
              return (
                <li key={playlist.id}>
                  <Link
                    href={href}
                    className={active ? styles.rowOn : styles.row}
                    aria-current={active ? "page" : undefined}
                  >
                    {isLocalUpload(playlist.artwork) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className={styles.cover}
                        src={apiUrl(playlist.artwork as string)}
                        alt=""
                        width={36}
                        height={36}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span className={styles.coverEmpty} aria-hidden="true" />
                    )}
                    <span className={styles.text}>
                      <span className={styles.name}>{playlist.name}</span>
                      <span className={styles.meta}>
                        {t("playlists.trackCount", {
                          count: playlist.trackCount,
                        })}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </nav>
  );
}
