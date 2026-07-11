import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import styles from "./ContentCard.module.css";

export function ContentCard({
  href,
  coverImage,
  title,
  subtitle,
  dateTime,
  dateLabel,
  variant = "horizontal",
}: {
  href: string;
  coverImage?: string | null;
  title: string;
  subtitle?: string | null;
  dateTime?: string | null;
  dateLabel?: string | null;
  variant?: "horizontal" | "vertical";
}) {
  return (
    <Link href={href} className={styles.card}>
      {coverImage ? (
        <div className={`${styles.coverWrap} ${styles[variant]}`}>
          <Image
            src={apiUrl(coverImage)}
            alt=""
            width={variant === "vertical" ? 400 : 640}
            height={variant === "vertical" ? 600 : 360}
            className={styles.cover}
          />
        </div>
      ) : null}
      <div className={styles.body}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        {dateLabel ? (
          <time className={styles.date} dateTime={dateTime ?? undefined}>
            {dateLabel}
          </time>
        ) : null}
      </div>
    </Link>
  );
}
