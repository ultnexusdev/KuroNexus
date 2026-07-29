import Image from "next/image";
import type { AnimeShowcase } from "@/lib/api/types";
import styles from "./LobbyPosters.module.css";

/**
 * Anime salonu girişinin iki yanındaki tam boy afişler — film lobisiyle aynı
 * desen, kullanıcı isteği: solda One Piece, sağda Naruto.
 *
 * Filmdeki panelden iki farkı var, ikisi de kaynağın gereği: AniList tam URL
 * veriyor (TMDB'deki gibi göreli yol değil), ve projeksiyon huzmesi yerine
 * salonun kendi mürekkep moru halesi kullanılıyor — anime kanadının ışığı
 * projektör değil.
 *
 * Afiş yolları koda gömülü değil, `GET /anime/showcase`ten geliyor. Afiş
 * gelmezse panel çizilmez, lobi kendi zeminiyle açılır.
 */
function Panel({
  side,
  poster,
}: {
  side: "left" | "right";
  poster: AnimeShowcase["left"];
}) {
  return (
    <div
      className={`${styles.side} ${side === "left" ? styles.left : styles.right}`}
    >
      {poster?.posterPath ? (
        <Image
          src={poster.posterPath}
          alt=""
          fill
          sizes="40vw"
          className={styles.poster}
          priority
          unoptimized
        />
      ) : null}
      <span className={styles.tint} />
      <span className={styles.halo} />
      <span className={styles.vignette} />
      <span className={styles.grain} />
    </div>
  );
}

export function LobbyPosters({ showcase }: { showcase: AnimeShowcase }) {
  if (!showcase.left && !showcase.right) {
    return null;
  }
  return (
    <div className={styles.backdrop} aria-hidden>
      <Panel side="left" poster={showcase.left} />
      <Panel side="right" poster={showcase.right} />
    </div>
  );
}
