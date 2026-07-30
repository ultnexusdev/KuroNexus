import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { SHOW_SECTIONS } from "@/lib/show/sections";
import { tmdbImage } from "@/lib/api/shows";
import type { ShowArchive, ShowShowcase } from "@/lib/api/types";
import { LobbyBanner } from "@/components/hall/LobbyBanner";
import { LobbyPosters } from "./LobbyPosters";
import styles from "./ShowLobby.module.css";

/**
 * Salon girişi — film salonundaki `FilmLobby`ın aynısı.
 */
export async function ShowLobby({
  locale,
  hallLabel,
  categoryName,
  archive,
  showcase,
}: {
  locale: string;
  hallLabel: string;
  categoryName: string;
  archive: ShowArchive;
  showcase: ShowShowcase;
}) {
  const t = await getTranslations({ locale, namespace: "show" });
  const tStories = await getTranslations({ locale, namespace: "stories" });

  function meterFor(key: string): string {
    if (key === "archive") {
      return archive.shows.length === 0
        ? t("lobbyArchiveEmpty")
        : t("lobbyArchiveMeter", {
            count: archive.shows.length,
            watchlist: archive.stats.watchlist,
          });
    }
    return "";
  }

  return (
    <div data-category="dizi" className={styles.lobby}>
      <LobbyPosters showcase={showcase} />

      {/* Dar ekranda yan paneller çizilmiyor; aynı afişler bant olarak üstte */}
      <LobbyBanner
        images={[
          tmdbImage(showcase.left?.posterPath, "w780"),
          tmdbImage(showcase.right?.posterPath, "w780"),
        ]}
      />

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
        {SHOW_SECTIONS.map((section) => (
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
