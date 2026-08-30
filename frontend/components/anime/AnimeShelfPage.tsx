"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { AnimeArchive } from "@/lib/api/types";
import { belongsTo, type ShelfKey } from "@/lib/anime/shelves";
import { ShelfIcon } from "./ShelfIcon";
import {
  buildTaxonomy,
  CHIP_LIMIT,
  EMPTY_FILTER,
  isFilterEmpty,
  matchesFilter,
  type AnimeFilter,
  type FilterChip,
} from "@/lib/anime/filters";
import { BackToTop } from "@/components/BackToTop";
import { AnimeCard } from "./AnimeCard";
import styles from "./AnimeHall.module.css";
import { CuratorDock } from "@/components/curated/CuratorDock";

/**
 * Bir rafın tamamı. Salon sayfası her raftan yalnızca ilk satırı gösterir,
 * "tümü" buraya düşer.
 *
 * Filmdeki raf sayfasından farkı sayfalama olmaması: anime arşivi seri
 * bazlı olduğu için kayıt sayısı düşük (yüzlerce film ↔ onlarca seri).
 *
 * NOT (film salonundan çıkan ders): burada `<Suspense>` sınırı YOK. Fallback'siz
 * bir sınır alt ağacın hidrasyonunu tamamen engelliyor, sayfa görünüyor ama
 * hiçbir düğme çalışmıyordu.
 */
export function AnimeShelfPage({
  archive,
  shelf,
  hallLabel,
  hallName,
  isAdmin = false,
}: {
  archive: AnimeArchive;
  shelf: ShelfKey;
  hallLabel: string;
  hallName: string;
  isAdmin?: boolean;
}) {
  const t = useTranslations("anime");
  const [filter, setFilter] = useState<AnimeFilter>(EMPTY_FILTER);
  const [showAllThemes, setShowAllThemes] = useState(false);
  const [curating, setCurating] = useState(false);

  const shelfEntries = useMemo(
    () => archive.entries.filter((anime) => belongsTo(anime, shelf)),
    [archive.entries, shelf],
  );

  // Süzgeç katmanları rafın kendi içeriğinden türetilir: "izleyeceklerim"de
  // olmayan bir tür çip olarak görünmesin
  const taxonomy = useMemo(() => buildTaxonomy(shelfEntries), [shelfEntries]);
  const themes = showAllThemes
    ? taxonomy.themes
    : taxonomy.themes.slice(0, CHIP_LIMIT);

  const entries = useMemo(
    () => shelfEntries.filter((anime) => matchesFilter(anime, filter)),
    [shelfEntries, filter],
  );

  function chipRow(
    label: string,
    chips: FilterChip[],
    current: string | null,
    onPick: (value: string | null) => void,
    extra?: React.ReactNode,
  ) {
    if (chips.length === 0) {
      return null;
    }
    return (
      <div className={styles.filterRow}>
        <span className={styles.filterLabel}>{label}</span>
        <div className={styles.filters}>
          {chips.map((chip) => (
            <button
              key={chip.value}
              type="button"
              className={current === chip.value ? styles.chipOn : styles.chip}
              onClick={() => onPick(current === chip.value ? null : chip.value)}
            >
              {chip.value}
            </button>
          ))}
          {extra}
        </div>
      </div>
    );
  }

  return (
    <div data-category="anime" className={styles.hall}>
      <div className={styles.page}>
        <header className={styles.head}>
          <Link
            href="/dark-stories/category/anime/arsiv"
            className={styles.back}
          >
            {t("backToHall")}
          </Link>
          <span className={styles.eyebrow}>
            {t("hall", { num: hallLabel, name: hallName })}
          </span>
          <h1 className={styles.title}>
            <ShelfIcon shelf={shelf} className={styles.shelfIcon} />
            {t(`shelf.${shelf}`)}
          </h1>
          <p className={styles.lede}>
            {t("shelfCount", { count: shelfEntries.length })}
          </p>

          {isAdmin ? (
            <div className={styles.curatorSwitch}>
              <CuratorDock
                on={curating}
                onToggle={() => setCurating((current) => !current)}
                label={curating ? t("curator.on") : t("curator.off")}
              />
            </div>
          ) : null}
        </header>

        <div className={styles.filterBlock}>
          {chipRow(t("filters.genre"), taxonomy.genres, filter.genre, (genre) =>
            setFilter({ ...filter, genre }),
          )}
          {chipRow(
            t("filters.audience"),
            taxonomy.audience,
            filter.audience,
            (audience) => setFilter({ ...filter, audience }),
          )}
          {chipRow(
            t("filters.theme"),
            themes,
            filter.theme,
            (theme) => setFilter({ ...filter, theme }),
            taxonomy.themes.length > CHIP_LIMIT ? (
              <button
                type="button"
                className={styles.moreChips}
                aria-expanded={showAllThemes}
                onClick={() => setShowAllThemes((current) => !current)}
              >
                {showAllThemes
                  ? t("fewerGenres")
                  : t("moreGenres", {
                      count: taxonomy.themes.length - CHIP_LIMIT,
                    })}
              </button>
            ) : null,
          )}
          {!isFilterEmpty(filter) ? (
            <button
              type="button"
              className={styles.clearFilter}
              onClick={() => setFilter(EMPTY_FILTER)}
            >
              {t("filters.clear")}
            </button>
          ) : null}
        </div>

        {entries.length === 0 ? (
          <p className={styles.empty}>{t(`shelfEmpty.${shelf}`)}</p>
        ) : (
          <ul className={styles.grid}>
            {entries.map((anime) => (
              <li key={anime.id}>
                <AnimeCard anime={anime} curating={curating} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <BackToTop />
    </div>
  );
}
