"use client";

import { useState } from "react";
import Image from "next/image";
import { youtubeEmbedUrl, youtubeThumbUrl } from "@/lib/youtube";
import styles from "./Media.module.css";

/**
 * Fragman — film ve dizi sayfalarının ortak parçası (D-F3; iki kanatta
 * birebir kopyaydı).
 *
 * iframe sayfa açılışında İNMEZ: önce YouTube'un kapak görseli gösterilir,
 * oynat düğmesine basınca gömülü oynatıcı yüklenir. Böylece her detay sayfası
 * açılışında YouTube'a istek gitmiyor.
 *
 * Metinler prop: iki kanat farklı sözlük ad alanı kullanıyor (`film.detail` /
 * `show.detail`), ad alanını buraya gömmek kanatlardan birine bağlanmak
 * olurdu. Çağıran `t("trailerOf", { title })` ve `t("playTrailer")` verir.
 */
export function Trailer({
  videoKey,
  iframeTitle,
  playLabel,
}: {
  videoKey: string;
  /** "X fragmanı" — iframe'in erişilebilirlik başlığı, çevrilmiş hâli. */
  iframeTitle: string;
  /** Oynat düğmesinin alt yazısı, çevrilmiş hâli. */
  playLabel: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className={styles.trailerFrame}>
        <iframe
          className={styles.trailerVideo}
          src={youtubeEmbedUrl(videoKey, "autoplay=1&rel=0")}
          title={iframeTitle}
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
        src={youtubeThumbUrl(videoKey)}
        alt=""
        fill
        sizes="(max-width: 900px) 100vw, 640px"
        className={styles.trailerThumb}
        unoptimized
      />
      <span className={styles.trailerPlay} aria-hidden>
        ▶
      </span>
      <span className={styles.trailerLabel}>{playLabel}</span>
    </button>
  );
}
