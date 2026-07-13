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
}: {
  href: string;
  coverImage?: string | null;
  title: string;
  subtitle?: string | null;
}) {
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.coverWrap}>
        {coverImage ? (
          <Image
            src={apiUrl(coverImage)}
            alt=""
            width={640}
            height={360}
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
