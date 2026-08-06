"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { AnimeArchive, ArchiveAnime } from "@/lib/api/types";
import Image from "next/image";
import {
  belongsTo,
  shelfHref,
  SHELF_ICONS,
  SHELF_KEYS,
  type ShelfKey,
} from "@/lib/anime/shelves";
import {
  buildTaxonomy,
  CHIP_LIMIT,
  EMPTY_FILTER,
  isFilterEmpty,
  matchesFilter,
  daysUntil,
  type AnimeFilter,
  type FilterChip,
} from "@/lib/anime/filters";
import { BackToTop } from "@/components/BackToTop";
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
  const [filter, setFilter] = useState<AnimeFilter>(EMPTY_FILTER);
  const [showAllThemes, setShowAllThemes] = useState(false);
  const [curating, setCurating] = useState(false);

  const taxonomy = useMemo(
    () => buildTaxonomy(archive.entries),
    [archive.entries],
  );
  const themes = showAllThemes
    ? taxonomy.themes
    : taxonomy.themes.slice(0, CHIP_LIMIT);

  // Süzgeç bütün raflara birden uygulanır (film salonundaki davranış)
  const visible = useMemo(
    () => archive.entries.filter((anime) => matchesFilter(anime, filter)),
    [archive.entries, filter],
  );

  // Hero: şu an izlediğim seri. Dekoratif değil — "devam et" düğmesiyle
  // salona girer girmez kaldığın yere dönmek için (kullanıcı kararı).
  const hero = useMemo(
    () =>
      archive.entries.find(
        (anime) => anime.status === "WATCHING" && anime.currentPart,
      ) ??
      archive.entries.find((anime) => anime.status === "WATCHING") ??
      null,
    [archive.entries],
  );

  /** Bir katmanın çip satırı; aynı çipe tekrar basmak seçimi kaldırır. */
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
            <h2 className={styles.shelfTitle}>
              <span className={styles.shelfIcon} aria-hidden>
                {SHELF_ICONS[key]}
              </span>
              {t(`shelf.${key}`)}
            </h2>
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
      {/* Salonun yüzü: şu an izlediğin seri, kaldığın yer ve "devam et" */}
      {hero ? <Hero anime={hero} /> : null}

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
                // Tema sayısı kabarık: gerisi burada açılır
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

            {SHELF_KEYS.map((key) => renderShelf(key))}
          </>
        )}
      </div>

      <BackToTop />
    </div>
  );
}

/**
 * Salonun hero alanı: izlemekte olduğun serinin banner'ı.
 *
 * İşlevsel olması bilinçli — banner + başlık + "S2 · 18/23" + "devam et".
 * Salona girer girmez ilk yapacağın şey zaten kaldığın yere dönmek.
 */
function Hero({ anime }: { anime: ArchiveAnime }) {
  const t = useTranslations("anime");
  const part = anime.currentPart;
  const total = part?.episodes ?? null;
  const watched = part?.watchedEpisodes ?? 0;
  const percent =
    total && total > 0 ? Math.min(100, Math.round((watched / total) * 100)) : 0;
  const days = daysUntil(anime.nextAiringAt);
  const image = anime.bannerImage ?? anime.coverImage;

  return (
    <section className={styles.hero}>
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroImg}
          unoptimized
        />
      ) : null}
      <div className={styles.heroShade} />

      <div className={styles.heroInner}>
        <span className={styles.heroEyebrow}>{t("hero.eyebrow")}</span>
        {/* <h2> DEGIL: bu bant sayfanin gercek <h1>'inden (arsiv basligi)
            ONCE ciziliyordu, yani baslik agacinda h2 -> h1 sirasi olusuyor
            ve ekran okuyucuda salonun adi ikinci sirada kaliyordu. Bant
            zaten dekoratif bir "devam et" seridi, baslik olmasi sart degil.
            Gorsel olcu degismedi (ayni .heroTitle sinifi). */}
        <p className={styles.heroTitle}>{anime.title}</p>

        {part ? (
          <p className={styles.heroLine}>
            <span>{part.title}</span>
            <span className={styles.heroCount}>
              {total
                ? t("episodeOf", { watched, total })
                : t("episodeCount", { watched })}
            </span>
            {days !== null ? (
              <span className={styles.countdown}>
                {t("nextInDays", { count: days, episode: anime.nextEpisode ?? 0 })}
              </span>
            ) : null}
          </p>
        ) : null}

        {total ? (
          <span className={styles.heroBar} aria-hidden>
            <span className={styles.heroBarFill} style={{ width: `${percent}%` }} />
          </span>
        ) : null}

        <Link
          href={`/dark-stories/category/anime/${anime.slug}`}
          className={styles.heroCta}
        >
          {t("hero.resume")}
        </Link>
      </div>
    </section>
  );
}
