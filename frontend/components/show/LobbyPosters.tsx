import Image from "next/image";
import { tmdbImage } from "@/lib/api/shows";
import type { ShowShowcase } from "@/lib/api/types";
import styles from "./LobbyPosters.module.css";

/**
 * Salon girişinin iki yanındaki tam boy afişler — film salonundaki
 * `LobbyPosters`in aynısı. Solda Game of Thrones, sağda Spartacus: afiş
 * yolları koda gömülü değil, `GET /shows/showcase`ten (TMDB arama + cache)
 * geliyor. Afiş gelmezse panel yine de boş kalmaz.
 */
function Panel({
  side,
  poster,
}: {
  side: "left" | "right";
  poster: ShowShowcase["left"];
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

export function LobbyPosters({ showcase }: { showcase: ShowShowcase }) {
  return (
    <div className={styles.backdrop} aria-hidden>
      <Panel side="left" poster={showcase.left} />
      <Panel side="right" poster={showcase.right} />
    </div>
  );
}
