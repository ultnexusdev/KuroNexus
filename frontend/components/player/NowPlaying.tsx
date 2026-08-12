"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl, isLocalUpload } from "@/lib/api/client";
import { spotifyOpenUrl } from "@/lib/music/routes";
import { useMusicQueue, type QueueTrack } from "./MusicQueue";
import styles from "./NowPlaying.module.css";

/**
 * "Şu an çalan + sıradakiler" paneli — sanatçı, albüm ve liste sayfalarının
 * sağ sütunu.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * NEDEN BURADA ARTIK SPOTIFY GÖMÜSÜ YOK
 *
 * Bu sütunda eskiden `SpotifyEmbed` vardı: sayfanın KENDİ albümünü/listesini
 * gösteren ayrı bir Spotify çaları. Alt şeritte de ikinci bir çalar vardı ve
 * ikisi birbirinden habersizdi. Sonuç kullanıcı tarafından bildirildi
 * (13 Ağustos 2026): *"gömülü çalarda What I've Done çalarken aşağıdaki
 * playerda The Catalyst görünüyor."* İki çalar aynı anda ses de verebiliyordu.
 *
 * Artık **tek çalar** var: ses karantina iframe'inde (`/api/music-player`),
 * kuyruk kök düzende (`MusicQueue`). Bu panel o kuyruğun GÖRÜNÜMÜ — kendi
 * durumu yok, dolayısıyla şeritle ayrışması da mümkün değil.
 *
 * Yan kazanç kullanıcının ikinci isteğiydi: Spotify gömüsü 352 piksel yükseklikte
 * yalnızca 3 parça gösteriyordu. Bu panel kendi listemiz olduğu için
 * istediğimiz kadar uzun — `--now-rows` ile 10 satır açılıyor.
 * ══════════════════════════════════════════════════════════════════════════
 */

/** Kuyruk boşken "bu sayfayı çal" düğmesinin yükleyeceği parçalar. */
export interface NowPlayingSeed {
  tracks: QueueTrack[];
  /** Şeritte ve panelde görünen kaynak adı — albüm ya da liste adı */
  context: string;
  /** Varsa kaynağın adresi; şeritten geri dönmek için */
  contextHref?: string;
}

function Cover({ src, size }: { src: string | null; size: number }) {
  if (!isLocalUpload(src)) {
    return (
      <span
        className={styles.coverEmpty}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={styles.cover}
      src={apiUrl(src as string)}
      alt=""
      width={size}
      height={size}
    />
  );
}

export function NowPlaying({ seed }: { seed?: NowPlayingSeed }) {
  const t = useTranslations("player");
  const { current, tracks, index, context, contextHref, jumpTo, play, isPlaying } =
    useMusicQueue();

  /* Kuyruk boş: panel boş durmuyor, sayfanın kendi parçalarını çalmayı öneriyor */
  if (!current) {
    const playable = seed?.tracks.filter((track) => track.spotifyId) ?? [];
    return (
      <div className={styles.panel}>
        <span className={styles.label}>{t("nowPlaying")}</span>
        <p className={styles.idle}>{t("idle")}</p>
        {playable.length > 0 && seed ? (
          <button
            type="button"
            className={styles.seedButton}
            onClick={() => play(playable, 0, seed.context, seed.contextHref)}
          >
            {t("playThisPage", { count: playable.length })}
          </button>
        ) : null}
      </div>
    );
  }

  /**
   * Sıradakiler listesi kuyruğun TAMAMI, çalan parça dahil. Yalnızca kalanı
   * göstermek daha "temiz" görünüyordu ama son parçada liste bomboş kalıyor ve
   * panel "hiçbir şey çalmıyor" gibi okunuyordu.
   */
  return (
    <div className={styles.panel}>
      <span className={styles.label}>{t("nowPlaying")}</span>

      <div className={styles.head}>
        <Cover src={current.artwork} size={64} />
        <div className={styles.headText}>
          <span className={styles.title} data-playing={isPlaying ? "true" : "false"}>
            {current.title}
          </span>
          <span className={styles.artist}>{current.artist}</span>
          {context ? (
            contextHref ? (
              <Link href={contextHref} className={styles.context}>
                {context}
              </Link>
            ) : (
              <span className={styles.context}>{context}</span>
            )
          ) : null}
          {current.spotifyId ? (
            <a
              className={styles.spotifyLink}
              href={spotifyOpenUrl("track", current.spotifyId)}
              target="_blank"
              rel="noreferrer noopener"
            >
              {t("openInSpotify")}
            </a>
          ) : null}
        </div>
      </div>

      <span className={styles.label}>
        {t("queue")} · {t("queueCount", { done: index + 1, total: tracks.length })}
      </span>

      <ol className={styles.list}>
        {tracks.map((track, position) => (
          <li key={`${track.spotifyId}-${position}`}>
            <button
              type="button"
              className={position === index ? styles.rowOn : styles.row}
              aria-current={position === index ? "true" : undefined}
              onClick={() => jumpTo(position)}
            >
              <span className={styles.no}>
                {position === index ? "▶" : String(position + 1).padStart(2, "0")}
              </span>
              <Cover src={track.artwork} size={28} />
              <span className={styles.rowText}>
                <span className={styles.rowTitle}>{track.title}</span>
                <span className={styles.rowArtist}>{track.artist}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
