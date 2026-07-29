"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { AnimeArchive, ArchiveAnime } from "@/lib/api/types";
import { belongsTo, shelfHref, SHELF_KEYS, type ShelfKey } from "@/lib/anime/shelves";
import { buildChips, CHIP_LIMIT, matchesFilter } from "@/lib/anime/filters";
import { AnimeCard } from "./AnimeCard";
import styles from "./AnimeHall.module.css";

/**
 * Salon 04 · Anime — "Anime Arşivim".
 *
 * Film salonuyla aynı iskelet (üst üste raflar, her rafın ilk satırı burada,
 * tamamı kendi sayfasında) ama sıralama başka: **İzliyorum en üstte**, hemen
 * altında "devamı gelecek". Anime arşivinde en sık sorulan iki soru bunlar.
 *
 * Kartın kendisi ilerleme taşır; "+1 bölüm" küratör modunda kartın altında.
 */

// Küratör kontrolleri yalnızca mod açılınca indirilir — ziyaretçi bu JS'i almaz
const CuratorBar = dynamic(
  () => import("./AnimeCurator").then((mod) => mod.CuratorBar),
  { ssr: false },
);

// Salonda her raf tek satır: geniş ekrandaki sütun sayısı kadar
const ROW_LIMIT = 6;

export function AnimeHall({
  archive,
  hallLabel,
  hallName,
  isAdmin = false,
}: {
  archive: AnimeArchive;
  /** Salon numarası ana sayfayla aynı kaynaktan gelir ("01", "02"…) */
  hallLabel: string;
  /** Salon adı da aynı kaynaktan: kategori kaydı (kod içinde sabit yok) */
  hallName: string;
  /** Küratör modu anahtarını gösterir — yetki her istekte backend'de doğrulanır */
  isAdmin?: boolean;
}) {
  const t = useTranslations("anime");
  const tStories = useTranslations("stories");
  const [filter, setFilter] = useState<string | null>(null);
  const [showAllChips, setShowAllChips] = useState(false);
  const [curating, setCurating] = useState(false);

  const chips = useMemo(() => buildChips(archive.entries), [archive.entries]);
  const visibleChips = showAllChips ? chips : chips.slice(0, CHIP_LIMIT);

  // Süzgeç bütün raflara birden uygulanır (film salonundaki davranış)
  const visible = useMemo(
    () => archive.entries.filter((anime) => matchesFilter(anime, filter)),
    [archive.entries, filter],
  );

  const shelves = useMemo(() => {
    const map = {} as Record<ShelfKey, ArchiveAnime[]>;
    for (const key of SHELF_KEYS) {
      map[key] = visible.filter((anime) => belongsTo(anime, key));
    }
    return map;
  }, [visible]);

  const { stats } = archive;
  const isEmpty = archive.entries.length === 0;

  function renderShelf(key: ShelfKey) {
    const entries = shelves[key];
    // Boş raf sayfayı uzatmasın — "izliyorum" hariç, o salonun kalbi
    if (entries.length === 0 && key !== "watching") {
      return null;
    }
    const row = entries.slice(0, ROW_LIMIT);

    return (
      <section className={styles.shelfSection} key={key}>
        <div className={styles.shelfHead}>
          <Link href={shelfHref(key)} className={styles.shelfLink}>
            <h2 className={styles.shelfTitle}>{t(`shelf.${key}`)}</h2>
          </Link>
          <span className={styles.shelfCount}>
            {t("shelfCount", { count: entries.length })}
          </span>
        </div>

        {row.length === 0 ? (
          <p className={styles.empty}>{t(`shelfEmpty.${key}`)}</p>
        ) : (
          <ul className={styles.grid}>
            {row.map((anime) => (
              <li key={anime.id}>
                <AnimeCard anime={anime} curating={curating} />
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }

  return (
    <div data-category="anime" className={styles.hall}>
      <div className={styles.page}>
        <header className={styles.head}>
          <Link href="/dark-stories/category/anime" className={styles.back}>
            {tStories("backToList")}
          </Link>
          <span className={styles.eyebrow}>
            {t("hall", { num: hallLabel, name: hallName })}
          </span>
          <h1 className={styles.title}>{t("archiveTitle")}</h1>
          <p className={styles.lede}>{t("archiveLede")}</p>

          {isAdmin ? (
            <div className={styles.curatorSwitch}>
              <button
                type="button"
                className={curating ? styles.curatorOn : styles.curatorOff}
                aria-pressed={curating}
                onClick={() => setCurating((current) => !current)}
              >
                {curating ? t("curator.on") : t("curator.off")}
              </button>
              <span className={styles.muted}>{t("curator.hint")}</span>
            </div>
          ) : null}
        </header>

        {curating ? <CuratorBar /> : null}

        {/* Künye şeridi: süzgeçten etkilenmez, arşivin tamamını anlatır */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>{t("stats.series")}</span>
            <span className={styles.statValue}>{stats.series}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>{t("stats.episodes")}</span>
            <span className={styles.statValue}>
              {stats.watchedEpisodes.toLocaleString("tr-TR")}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>{t("stats.completed")}</span>
            <span className={styles.statValue}>{stats.completedSeries}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>{t("stats.topTag")}</span>
            <span className={styles.statValue}>{stats.topTag ?? "—"}</span>
          </div>
        </div>

        {isEmpty ? (
          <p className={styles.empty}>{t("empty")}</p>
        ) : (
          <>
            {chips.length > 0 ? (
              <div className={styles.filters}>
                <button
                  type="button"
                  className={filter === null ? styles.chipOn : styles.chip}
                  onClick={() => setFilter(null)}
                >
                  {t("allGenres")}
                </button>
                {visibleChips.map((chip) => (
                  <button
                    key={chip.value}
                    type="button"
                    className={
                      filter === chip.value ? styles.chipOn : styles.chip
                    }
                    onClick={() =>
                      setFilter(filter === chip.value ? null : chip.value)
                    }
                  >
                    {chip.value}
                  </button>
                ))}
                {/* Tür + etiket sayısı kabarık: gerisi burada açılır */}
                {chips.length > CHIP_LIMIT ? (
                  <button
                    type="button"
                    className={styles.moreChips}
                    aria-expanded={showAllChips}
                    onClick={() => setShowAllChips((current) => !current)}
                  >
                    {showAllChips
                      ? t("fewerGenres")
                      : t("moreGenres", { count: chips.length - CHIP_LIMIT })}
                  </button>
                ) : null}
              </div>
            ) : null}

            {SHELF_KEYS.map((key) => renderShelf(key))}

            {archive.studios.length > 0 ? (
              <section className={styles.shelfSection}>
                <div className={styles.shelfHead}>
                  <h2 className={styles.shelfTitle}>{t("studios")}</h2>
                </div>
                <ul className={styles.studios}>
                  {archive.studios.map((studio) => (
                    <li key={studio.name} className={styles.studio}>
                      {studio.name}
                      <span className={styles.studioCount}>{studio.count}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
