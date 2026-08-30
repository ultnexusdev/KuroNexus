"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { AnimeArchive, ArchiveAnime } from "@/lib/api/types";
import Image from "next/image";
import {
  belongsTo,
  shelfHref,
  SHELF_KEYS,
  SHELF_SLUGS,
  type ShelfKey,
} from "@/lib/anime/shelves";
import { ShelfIcon } from "./ShelfIcon";
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
import { ArchiveUnavailable } from "@/components/hall/ArchiveUnavailable";
import { CuratorDock } from "@/components/curated/CuratorDock";

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

/** Raf bölümünün DOM kimliği — şerit buraya kaydırıyor. */
function shelfDomId(key: ShelfKey): string {
  return `raf-${SHELF_SLUGS[key]}`;
}

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

  /* Şeritte yalnızca sayfada gerçekten çizilen raflar var — boş bir rafa
     kaydırmak kullanıcıyı boşluğa götürürdü. Koşul `renderShelf`inkiyle
     birebir aynı: "izliyorum" boşken de duruyor, çünkü salonun kalbi o. */
  const railKeys = useMemo(
    () => SHELF_KEYS.filter((key) => shelves[key].length > 0 || key === "watching"),
    [shelves],
  );

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
      <section className={styles.shelfSection} key={key} id={shelfDomId(key)}>
        <div className={styles.shelfHead}>
          <Link href={shelfHref(key)} className={styles.shelfLink}>
            <h2 className={styles.shelfTitle}>
              <ShelfIcon shelf={key} className={styles.shelfIcon} />
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
      {/* Salonun yüzü: kimlik ve "kaldığın yer" tek perdede */}
      <Curtain
        anime={hero}
        hallLabel={hallLabel}
        hallName={hallName}
        backLabel={tStories("backToList")}
      />

      <div className={styles.page}>
        {isAdmin ? (
          <div className={styles.curatorSwitch}>
            {/* Anahtar sağ alttaki sabit hapa taşındı (30 Ağustos 2026) —
                sarmalayıcı duruyor, artık yalnızca paneli tutuyor. */}
            <CuratorDock
              on={curating}
              onToggle={() => setCurating((current) => !current)}
              label={curating ? t("curator.on") : t("curator.off")}
              hint={t("curator.hint")}
            />
          </div>
        ) : null}

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

        {/* Gerekce FilmHall'da yazili */}
        {archive.unavailable ? (
          <ArchiveUnavailable />
        ) : isEmpty ? (
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

            {railKeys.length > 1 ? (
              <ShelfRail keys={railKeys} shelves={shelves} />
            ) : null}

            {SHELF_KEYS.map((key) => renderShelf(key))}
          </>
        )}
      </div>

      <BackToTop />
    </div>
  );
}

/**
 * Perde — salonun girişi.
 *
 * Eskiden burada yalnızca "izlediğin seri + kaldığın bölüm + devam et" duran
 * bir bant vardı; salonun adı perdenin **altında**, sayfa sütununda
 * başlıyordu. İki baş vardı ve ikisi de yarım kalıyordu.
 *
 * Perde artık ikisini birlikte taşıyor: arkada izlediğin serinin afişi çok
 * yavaş yaklaşıyor, ön planda salonun kimliği, sağ altta ise aynı "kaldığın
 * yer" kartı. İşlevden hiçbir şey eksilmedi.
 *
 * Sayfanın `<h1>`'i de buraya taşındı. Eskiden bu bandın içindeki başlık
 * bilerek `<p>` yapılmıştı: gerçek `<h1>` aşağıda olduğu için burada bir
 * `<h2>` başlık ağacını ters çeviriyordu. O kısıt artık yok — başlık
 * gerçekten sayfanın ilk başlığı, dolayısıyla `<h1>` olarak duruyor.
 *
 * İzlenen seri yoksa (arşiv boş ya da hiçbir şey izlenmiyor) perde çökmez:
 * afiş katmanı çizilmez, kimlik kendi başına durur.
 */
function Curtain({
  anime,
  hallLabel,
  hallName,
  backLabel,
}: {
  /** Şu an izlenen seri; yoksa perde yalnızca kimliği taşır */
  anime: ArchiveAnime | null;
  hallLabel: string;
  hallName: string;
  /** "← Listeye dön" — metin çağıranın sözlüğünden geliyor */
  backLabel: string;
}) {
  const t = useTranslations("anime");
  const part = anime?.currentPart ?? null;
  const total = part?.episodes ?? null;
  const watched = part?.watchedEpisodes ?? 0;
  const percent =
    total && total > 0 ? Math.min(100, Math.round((watched / total) * 100)) : 0;
  const days = anime ? daysUntil(anime.nextAiringAt) : null;
  const image = anime ? (anime.bannerImage ?? anime.coverImage) : null;

  return (
    <section className={styles.curtain}>
      {image ? (
        <span className={styles.curtainStage}>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.curtainImg}
            unoptimized
          />
        </span>
      ) : null}
      <span className={styles.curtainShade} />
      <span className={styles.curtainGrain} />

      <div className={styles.curtainInner}>
        <Link href="/dark-stories/category/anime" className={styles.curtainBack}>
          {backLabel}
        </Link>

        <div className={styles.curtainIdentity}>
          <span className={styles.curtainHall}>
            {t("hall", { num: hallLabel, name: hallName })}
          </span>
          <h1 className={styles.curtainTitle}>
            {t("archiveTitle")}
            {/* Japonca karşılık görsel bir eşlik; ekran okuyucu başlığı iki
                kez, ikincisini de hecelenmiş hâlde okumasın diye gizli */}
            <span className={styles.curtainNative} aria-hidden>
              {t("archiveNative")}
            </span>
          </h1>
          <p className={styles.curtainLede}>{t("archiveLede")}</p>
        </div>

        {anime ? (
          <div className={styles.resume}>
            <span className={styles.resumeLabel}>{t("hero.eyebrow")}</span>
            <p className={styles.resumeTitle}>{anime.title}</p>

            {part ? (
              <p className={styles.resumeLine}>
                <span>{part.title}</span>
                <span className={styles.resumeCount}>
                  {total
                    ? t("episodeOf", { watched, total })
                    : t("episodeCount", { watched })}
                </span>
                {days !== null ? (
                  <span className={styles.countdown}>
                    {t("nextInDays", {
                      count: days,
                      episode: anime.nextEpisode ?? 0,
                    })}
                  </span>
                ) : null}
              </p>
            ) : null}

            {total ? (
              <span className={styles.resumeBar} aria-hidden>
                <span
                  className={styles.resumeBarFill}
                  style={{ width: `${percent}%` }}
                />
              </span>
            ) : null}

            <Link
              href={`/dark-stories/category/anime/${anime.slug}`}
              className={styles.resumeCta}
            >
              {t("hero.resume")}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/**
 * Raf şeridi — raflar arası kısayol.
 *
 * Rafları sekmeye çevirmek gündeme geldi ve **reddedildi**: her rafın kendi
 * adresi var (`/izliyorum`, `/bitirdiklerim` …) ve sekme o altı sayfayı
 * salondan koparırdı. Bunun yerine şerit yalnızca bir kaydırma kısayolu:
 * düğmeye basmak sayfayı o rafa götürüyor, sayfa kaydıkça da hangi rafın
 * önünde olduğun işaretleniyor. Raflar yerinde, adresler yerinde.
 *
 * Rafın **tamamına** gitmek isteyen için yol yine raf başlığının kendisi —
 * o bir bağlantı, bu ise bir düğme. İkisi karışmasın diye şeritteki
 * elemanlar `<button>`.
 */
function ShelfRail({
  keys,
  shelves,
}: {
  /** Sayfada gerçekten çizilen raflar, sayfadaki sırayla */
  keys: ShelfKey[];
  shelves: Record<ShelfKey, ArchiveAnime[]>;
}) {
  const t = useTranslations("anime");
  const [active, setActive] = useState<ShelfKey | null>(keys[0] ?? null);

  /* Hangi rafın önündeyiz. Bleach'teki derinlik şeridiyle aynı desen:
     görünür alanın üst çeyreğinde sıfır yüksekliğinde bir bant, o bandı
     geçen bölüm etkin sayılıyor. Bant üstte çünkü şeridin kendisi de
     yapışkan: kullanıcının okuduğu yer ekranın ortası değil, şeridin
     hemen altı. */
  useEffect(() => {
    const pairs = keys
      .map((key) => [key, document.getElementById(shelfDomId(key))] as const)
      .filter(
        (pair): pair is readonly [ShelfKey, HTMLElement] => pair[1] !== null,
      );
    if (pairs.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }
          const found = pairs.find((pair) => pair[1] === entry.target);
          if (found) {
            setActive(found[0]);
          }
        }
      },
      { rootMargin: "-22% 0px -62% 0px", threshold: 0 },
    );
    for (const [, node] of pairs) {
      observer.observe(node);
    }
    return () => observer.disconnect();
  }, [keys]);

  function goTo(key: ShelfKey) {
    const node = document.getElementById(shelfDomId(key));
    if (!node) {
      return;
    }
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    node.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
    /* İşaret hemen geçiyor: yumuşak kaydırma bitene kadar beklemek şeridi
       bir saniye boyunca yanlış rafta gösterirdi. Gözlemci yolun sonunda
       zaten aynı sonuca varıyor. */
    setActive(key);
  }

  return (
    <nav className={styles.rail} aria-label={t("shelfNav")}>
      <ul className={styles.railTrack}>
        {keys.map((key) => (
          <li key={key}>
            <button
              type="button"
              className={active === key ? styles.railItemOn : styles.railItem}
              aria-current={active === key ? "true" : undefined}
              onClick={() => goTo(key)}
            >
              {t(`shelf.${key}`)}
              <span className={styles.railCount}>{shelves[key].length}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
