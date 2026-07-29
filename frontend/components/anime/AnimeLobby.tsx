import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { ANIME_SECTIONS } from "@/lib/anime/sections";
import type { AnimeArchive, AnimeShowcase } from "@/lib/api/types";
import { LobbyPosters } from "./LobbyPosters";
import styles from "./AnimeLobby.module.css";

/**
 * Salon girişi: anime kapısının hemen arkası (film lobisiyle aynı desen).
 *
 * Tek bölümle bile boş görünmesin diye kapı kendi canlı sayısını taşır —
 * "Anime Arşivim · 12 seri, 3 izleniyor" gerçek bir eşik gibi okunur.
 */
export async function AnimeLobby({
  locale,
  hallLabel,
  categoryName,
  archive,
  showcase,
}: {
  locale: string;
  hallLabel: string;
  categoryName: string;
  archive: AnimeArchive;
  showcase: AnimeShowcase;
}) {
  const t = await getTranslations({ locale, namespace: "anime" });
  const tStories = await getTranslations({ locale, namespace: "stories" });

  function meterFor(key: string): string {
    if (key === "archive") {
      return archive.entries.length === 0
        ? t("lobbyArchiveEmpty")
        : t("lobbyArchiveMeter", {
            count: archive.entries.length,
            watching: archive.stats.watching,
          });
    }
    return "";
  }

  return (
    <div data-category="anime" className={styles.lobby}>
      <LobbyPosters showcase={showcase} />
      <header className={styles.head}>
        <Link href="/dark-stories" className={styles.back}>
          {tStories("backToList")}
        </Link>
        <span className={styles.eyebrow}>
          {t("hall", { num: hallLabel, name: categoryName })}
        </span>
        <h1 className={styles.title}>
          {categoryName.toLocaleUpperCase(locale)}
        </h1>
        <span className={styles.rule}>
          <span className={styles.diamond}>❖</span>
        </span>
        <p className={styles.lede}>{t("lobbyLede")}</p>
      </header>

      <nav className={styles.sections} aria-label={t("lobbySectionsAria")}>
        {ANIME_SECTIONS.map((section) => (
          <Link
            key={section.slug}
            href={section.href}
            className={styles.section}
          >
            <span className={styles.sectionTitle}>
              {t(`sections.${section.key}.title`)}
            </span>
            <span className={styles.sectionDesc}>
              {t(`sections.${section.key}.desc`)}
            </span>
            <span className={styles.sectionMeter}>{meterFor(section.key)}</span>
            <span className={styles.sectionArrow} aria-hidden>
              →
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
