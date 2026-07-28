import Image from "next/image";
import { tmdbImage } from "@/lib/api/movies";
import styles from "./FilmBackdrop.module.css";

/**
 * Salonun yan duvarları — geniş ekranda içeriğin solunda ve sağında kalan
 * boşluğu dolduran dekoratif sinema katmanı.
 *
 * Görseller dışarıdan getirilmiyor: arşivin KENDİ posterleri kullanılıyor.
 * Böylece duvar zamanla senin filmlerinle doluyor, telifsiz bir stok
 * görsel yığını olmuyor. Arşiv henüz küçükken (dörtten az poster) mozaik
 * hiç basılmıyor; geriye tamamen CSS ile kurulmuş sahne kalıyor: perde
 * kıvrımları, projeksiyon huzmesi, kenardaki perforasyon rayı ve film grenі.
 *
 * Tamamen dekoratif: `aria-hidden`, tıklama almaz, mobilde hiç render edilmez
 * (CSS ile gizlenir — ölçüyü sunucu bilemez).
 */

// Duvar başına kare sayısı. Fazlası dar şeritte fark edilmiyor, boşuna istek.
const TILES_PER_SIDE = 12;

/** Poster listesini tekrar ederek duvarı doldurur; sağ duvar kaydırılmış başlar. */
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

export function FilmBackdrop({ posters }: { posters: string[] }) {
  // Tek bir poster on iki kez tekrar edince duvar değil duvar kâğıdı oluyor
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
