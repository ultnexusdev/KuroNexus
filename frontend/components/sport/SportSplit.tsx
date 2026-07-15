"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import styles from "./SportSplit.module.css";

/**
 * Salon 03 · Spor — "Stadyum Gecesi & Gece Yarışı".
 * Salon diyagonal olarak ikiye bölünür: solda futbol (Galatasaray,
 * geceye çekilmiş altın/bordo), sağda Formula 1 (karbon + yarış kırmızısı).
 * Hover'daki yarı genişler, o dünyanın ışığı yanar ve varsa kapak görseli
 * belirir. prefers-reduced-motion'da hareket kapalı (CSS).
 */
export function SportSplit({
  footballHref,
  footballImage,
  f1Href,
  f1Image,
}: {
  footballHref: string;
  footballImage?: string | null;
  f1Href: string;
  f1Image?: string | null;
}) {
  const t = useTranslations("sport");

  return (
    <div className={styles.split}>
      {/* SOL — Futbol: Stadyum Gecesi */}
      <Link href={footballHref} className={`${styles.half} ${styles.football}`}>
        {footballImage ? (
          <Image
            src={apiUrl(footballImage)}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 55vw"
            className={styles.halfImg}
          />
        ) : null}
        <span className={styles.floodlight} aria-hidden />
        <span className={styles.pitchLines} aria-hidden />
        <div className={styles.content}>
          <span className={styles.sub}>{t("footballSub")}</span>
          <span className={styles.title}>{t("footballTitle")}</span>
          <span className={styles.line}>{t("footballLine")}</span>
          <span className={styles.chips}>{t("footballChips")}</span>
          <span className={styles.enter}>
            {t("enter")} <span aria-hidden>→</span>
          </span>
        </div>
      </Link>

      {/* SAĞ — Formula 1: Gece Yarışı */}
      <Link href={f1Href} className={`${styles.half} ${styles.f1}`}>
        {f1Image ? (
          <Image
            src={apiUrl(f1Image)}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 55vw"
            className={styles.halfImg}
          />
        ) : null}
        <span className={styles.carbon} aria-hidden />
        <span className={styles.raceStripe} aria-hidden />
        <div className={styles.content}>
          <span className={styles.sub}>{t("f1Sub")}</span>
          <span className={styles.title}>{t("f1Title")}</span>
          <span className={styles.line}>{t("f1Line")}</span>
          <span className={styles.chips}>{t("f1Chips")}</span>
          <span className={styles.enter}>
            {t("enter")} <span aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </div>
  );
}
