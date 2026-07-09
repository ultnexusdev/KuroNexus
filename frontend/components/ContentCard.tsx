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
}: {
  href: string;
  coverImage?: string | null;
  title: string;
  subtitle?: string | null;
  dateTime?: string | null;
  dateLabel?: string | null;
}) {
  return (
    <Link href={href} className={styles.card}>
      {coverImage ? (
        <Image
          src={apiUrl(coverImage)}
          alt=""
          width={640}
          height={360}
          className={styles.cover}
        />
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
