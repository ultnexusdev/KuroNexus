import Image from "next/image";
import { tmdbImage } from "@/lib/api/shows";
import styles from "./ShowBackdrop.module.css";

/**
 * Salonun yan duvarları — film salonundaki `FilmBackdrop`ın aynısı, kaynak
 * arşivin kendi poster'ları (dizi salonunun kendi diziler koleksiyonu).
 */

const TILES_PER_SIDE = 12;

function buildTiles(posters: string[], offset: number): string[] {
  if (posters.length === 0) {
    return [];
  }
  return Array.from(
    { length: TILES_PER_SIDE },
    (_, index) => posters[(index + offset) % posters.length],
  );
}

function Panel({
  side,
  tiles,
}: {
  side: "left" | "right";
  tiles: string[];
}) {
  return (
    <div
      className={`${styles.side} ${side === "left" ? styles.left : styles.right}`}
    >
      {tiles.length > 0 ? (
        <ul className={styles.mosaic}>
          {tiles.map((path, index) => {
            const src = tmdbImage(path, "w185");
            return (
              <li key={`${path}-${index}`} className={styles.tile}>
                {src ? (
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="200px"
                    className={styles.tileImg}
                    unoptimized
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}

      <span className={styles.curtain} />
      <span className={styles.beam} />
      <span className={styles.rail} />
      <span className={styles.vignette} />
      <span className={styles.grain} />
    </div>
  );
}

export function ShowBackdrop({ posters }: { posters: string[] }) {
  const useMosaic = posters.length >= 4;
  const left = useMosaic ? buildTiles(posters, 0) : [];
  const right = useMosaic
    ? buildTiles(posters, Math.ceil(posters.length / 2))
    : [];

  return (
    <div className={styles.backdrop} aria-hidden>
      <Panel side="left" tiles={left} />
      <Panel side="right" tiles={right} />
    </div>
  );
}
