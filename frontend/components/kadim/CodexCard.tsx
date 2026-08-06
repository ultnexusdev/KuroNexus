import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import styles from "./CodexCard.module.css";

/**
 * Kadim Dünyalar kanadına özel "cilt" kartı: manzara kapağı + altın çerçeve
 * hover'ı + oyulmuş Cinzel başlık. LOTR "Fate of Middle-earth" referansındaki
 * ornate kart hissini token'lardan alarak verir (kural 16).
 */
export function CodexCard({
  href,
  coverImage,
  title,
  subtitle,
  /**
   * Kapak dikey mi (kitap kapağı) yatay mı (evren manzarası).
   *
   * Kart aslen 16/9 manzara için yazılmıştı. Kitap serisi ciltleri aynı
   * kartla çizilince 2/3 oranındaki kapaklar üstten alttan kırpılıyor ve
   * kitabın adı görünmüyordu. Oran dışında hiçbir şey değişmiyor — altın
   * çizgi, ❖ işareti, Cinzel başlık ve hover aynı kalıyor ki kanadın
   * dokusu bozulmasın.
   */
  portrait = false,
}: {
  href: string;
  coverImage?: string | null;
  title: string;
  subtitle?: string | null;
  portrait?: boolean;
}) {
  return (
    <Link href={href} className={styles.card}>
      <div
        className={`${styles.coverWrap} ${portrait ? styles.coverPortrait : ""}`}
      >
        {coverImage ? (
          <Image
            src={apiUrl(coverImage)}
            alt=""
            width={portrait ? 400 : 640}
            height={portrait ? 600 : 360}
            className={styles.cover}
          />
        ) : (
          <div className={styles.coverFallback} aria-hidden>
            ❖
          </div>
        )}
        <div className={styles.vignette} />
      </div>
      <div className={styles.body}>
        <h2 className={styles.title}>
          <span className={styles.mark} aria-hidden>
            ❖
          </span>
          {title}
        </h2>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
    </Link>
  );
}
