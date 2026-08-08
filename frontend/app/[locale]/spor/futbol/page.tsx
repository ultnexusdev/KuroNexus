import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { fetchFootballHub, pick } from "@/lib/api/sport-archive";
import { sportHref } from "@/lib/sport/routes";
import { Reveal } from "@/components/sport/Reveal";
import shell from "../layout.module.css";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sportArchive" });
  return { title: t("football.name"), description: t("football.lede") };
}

/**
 * Sayfa 2 — `/spor/futbol`.
 *
 * Makro-yapı: Ecosystem Index. Tek bir liste değil, birkaç farklı keşif
 * yüzeyi; her yüzeyin kendi biçimi var ve dolu olmayan yüzey HİÇ çizilmiyor.
 *
 * Galatasaray burada "öne çıkan dünya" — Spor'un kardeşi değil, Futbol'un
 * içinde bir kapı. Hiyerarşi boyutla kuruluyor, rozetle değil.
 */
export default async function FootballHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sportArchive" });

  let hub;
  try {
    hub = await fetchFootballHub();
  } catch {
    notFound();
  }

  const { featuredClub, clubs, legends, moments } = hub;
  const otherClubs = clubs.filter((c) => c.slug !== featuredClub?.slug);

  // Kanadın tamamı boşsa sayfa hiç açılmasın — brief'in boş oda yasağı
  if (!featuredClub && clubs.length === 0 && legends.length === 0) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <nav className={shell.crumb} aria-label="breadcrumb">
        <Link href={sportHref.root()}>{t("backToSport")}</Link>
      </nav>

      <header className={styles.head}>
        <h1 className={`${shell.display} ${shell.title}`}>
          {t("football.name")}
        </h1>
        <p className={shell.lede}>{t("football.lede")}</p>
      </header>

      {/* ── Yüzey 1: öne çıkan dünya. Kart değil, kapı. ── */}
      {featuredClub ? (
        <Reveal as="section" className={styles.featured}>
          <Link
            href={sportHref.club(featuredClub.slug)}
            className={styles.featuredLink}
          >
            <span className={shell.eyebrow}>{t("hub.featured")}</span>
            <h2 className={`${shell.display} ${shell.world} ${styles.featuredName}`}>
              {featuredClub.name}
            </h2>
            <p className={`${shell.lede} ${styles.featuredLede}`}>
              {pick(locale, featuredClub.taglineTr, featuredClub.taglineEn)}
            </p>
            <span className={shell.data}>
              {featuredClub.foundedYear ? `${featuredClub.foundedYear} — ` : null}
              {featuredClub.cityName}
            </span>
          </Link>
        </Reveal>
      ) : null}

      {/* ── Yüzey 2: efsaneler ──
          Tek efsane yazılıyken 4 sütunluk ızgarada YALNIZ BİR KART "burası
          boş" der. O yüzden tek kayıtta geniş editoryal blok, ikinci kayıtla
          birlikte ızgaraya dönüşüyor. */}
      {legends.length > 0 ? (
        <Reveal as="section" className={styles.block} delay={60}>
          <h2 className={`${shell.display} ${shell.section}`}>
            {t("hub.legends")}
          </h2>
          <ul
            className={
              legends.length === 1 ? styles.legendSolo : styles.legendGrid
            }
          >
            {legends.map((legend) => (
              <li key={legend.slug}>
                <Link
                  href={sportHref.legend(legend.slug)}
                  className={styles.legendLink}
                >
                  <span
                    className={`${shell.display} ${styles.legendName}`}
                  >
                    {legend.name}
                  </span>
                  {pick(locale, legend.epithetTr, legend.epithetEn) ? (
                    <span className={styles.legendEpithet}>
                      {pick(locale, legend.epithetTr, legend.epithetEn)}
                    </span>
                  ) : null}
                  <span className={shell.data}>
                    {[
                      legend.countryCode,
                      legend.yearsFrom
                        ? `${legend.yearsFrom}–${legend.yearsTo ?? ""}`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}

      {/* ── Yüzey 3: tarih — tipografik dizin, görsel yok ── */}
      {moments.length > 0 ? (
        <Reveal as="section" className={styles.block} delay={120}>
          <h2 className={`${shell.display} ${shell.section}`}>
            {t("hub.history")}
          </h2>
          <ul className={styles.timeline}>
            {moments.map((moment, i) => (
              <li key={`${moment.era.slug}-${moment.year}-${i}`}>
                <Link
                  href={`${sportHref.club(moment.era.club.slug)}#${moment.era.slug}`}
                  className={styles.timelineLink}
                >
                  <span className={`${shell.figure} ${styles.year}`}>
                    {moment.year}
                  </span>
                  <span className={styles.momentTitle}>
                    {pick(locale, moment.titleTr, moment.titleEn)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}

      {/* Öne çıkan dışında kulüp varsa sade bir liste; yoksa hiç yok */}
      {otherClubs.length > 0 ? (
        <Reveal as="section" className={styles.block} delay={180}>
          <h2 className={`${shell.display} ${shell.section}`}>
            {t("hub.clubs")}
          </h2>
          <ul className={styles.clubList}>
            {otherClubs.map((club) => (
              <li key={club.slug}>
                <Link href={sportHref.club(club.slug)} className={styles.clubLink}>
                  <span className={styles.clubName}>{club.name}</span>
                  {club.foundedYear ? (
                    <span className={shell.data}>{club.foundedYear}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}
    </main>
  );
}
