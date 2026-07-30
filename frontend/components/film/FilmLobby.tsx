import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { FILM_SECTIONS } from "@/lib/film/sections";
import { tmdbImage } from "@/lib/api/movies";
import type { MovieArchive, MovieShowcase } from "@/lib/api/types";
import { LobbyBanner } from "@/components/hall/LobbyBanner";
import { LobbyPosters } from "./LobbyPosters";
import styles from "./FilmLobby.module.css";

/**
 * Salon girişi: film kapısının hemen arkası.
 *
 * Tek bölümle bile boş görünmesin diye her kapı kendi canlı sayısını taşır —
 * "Film Arşivi · 12 film" bir yer tutucu değil, gerçek bir eşik gibi okunur.
 */
export async function FilmLobby({
  locale,
  hallLabel,
  categoryName,
  archive,
  showcase,
}: {
  locale: string;
  hallLabel: string;
  categoryName: string;
  archive: MovieArchive;
  showcase: MovieShowcase;
}) {
  const t = await getTranslations({ locale, namespace: "film" });
  const tStories = await getTranslations({ locale, namespace: "stories" });

  // Bölüm başına eşik satırı; yeni bölüm eklenirse burada bir dal açılır
  function meterFor(key: string): string {
    if (key === "archive") {
      return archive.movies.length === 0
        ? t("lobbyArchiveEmpty")
        : t("lobbyArchiveMeter", {
            count: archive.movies.length,
            watchlist: archive.stats.watchlist,
          });
    }
    return "";
  }

  return (
    <div data-category="film" className={styles.lobby}>
      <LobbyPosters showcase={showcase} />

      {/* Dar ekranda yan paneller çizilmiyor; aynı afişler bant olarak üstte.
          Boyut masaüstü paneliyle aynı (w780) — ikinci bir istek doğmasın */}
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
        {FILM_SECTIONS.map((section) => (
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
