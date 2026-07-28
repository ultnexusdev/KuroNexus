import Image from "next/image";
import { tmdbImage } from "@/lib/api/movies";
import type { MovieShowcase } from "@/lib/api/types";
import styles from "./LobbyPosters.module.css";

/**
 * Salon girişinin iki yanındaki tam boy afişler.
 *
 * Arşiv sayfasının duvarlarından bilinçli olarak DAHA CANLI: tek büyük afiş,
 * mozaik yok, opaklık yüksek, bulanıklık minimum. Giriş bir eşik — orada
 * sahne öne çıkar; arşivde ise okuma öne çıktığı için duvar geri çekilir.
 *
 * Afiş yolları koda gömülü değil, `GET /movies/showcase`ten geliyor. Afiş
 * gelmezse panel yine de boş kalmaz: altındaki perde/huzme sahnesi çizilir.
 */
function Panel({
  side,
  poster,
}: {
  side: "left" | "right";
  poster: MovieShowcase["left"];
}) {
  const src = tmdbImage(poster?.posterPath, "w780");
  return (
    <div
      className={`${styles.side} ${side === "left" ? styles.left : styles.right}`}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes="40vw"
          className={styles.poster}
          priority
          unoptimized
        />
      ) : null}
      <span className={styles.tint} />
      <span className={styles.beam} />
      <span className={styles.vignette} />
      <span className={styles.grain} />
    </div>
  );
}

export function LobbyPosters({ showcase }: { showcase: MovieShowcase }) {
  return (
    <div className={styles.backdrop} aria-hidden>
      <Panel side="left" poster={showcase.left} />
      <Panel side="right" poster={showcase.right} />
    </div>
  );
}
