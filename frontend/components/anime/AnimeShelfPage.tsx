"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { AnimeArchive } from "@/lib/api/types";
import { belongsTo, type ShelfKey } from "@/lib/anime/shelves";
import { buildChips, CHIP_LIMIT, matchesFilter } from "@/lib/anime/filters";
import { AnimeCard } from "./AnimeCard";
import styles from "./AnimeHall.module.css";

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
  const [filter, setFilter] = useState<string | null>(null);
  const [showAllChips, setShowAllChips] = useState(false);
  const [curating, setCurating] = useState(false);

  const shelfEntries = useMemo(
    () => archive.entries.filter((anime) => belongsTo(anime, shelf)),
    [archive.entries, shelf],
  );

  const chips = useMemo(() => buildChips(shelfEntries), [shelfEntries]);
  const visibleChips = showAllChips ? chips : chips.slice(0, CHIP_LIMIT);

  const entries = useMemo(
    () => shelfEntries.filter((anime) => matchesFilter(anime, filter)),
    [shelfEntries, filter],
  );

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
          <h1 className={styles.title}>{t(`shelf.${shelf}`)}</h1>
          <p className={styles.lede}>
            {t("shelfCount", { count: shelfEntries.length })}
          </p>

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
            </div>
          ) : null}
        </header>

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
                className={filter === chip.value ? styles.chipOn : styles.chip}
                onClick={() => setFilter(filter === chip.value ? null : chip.value)}
              >
                {chip.value}
              </button>
            ))}
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
    </div>
  );
}
