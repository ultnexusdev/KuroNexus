"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
// Salon ve rafları çizen her şey `BookListItem` üzerinden çalışıyor: künye
// metni bu sayfalara hiç gelmiyor (bkz. `types.ts`, ölçüm notu orada).
import type { BookArchive, BookListItem } from "@/lib/api/types";
import {
  applyFilters,
  EMPTY_FILTERS,
  PERIOD_OPTIONS,
  SORT_KEYS,
  type BookFilterState,
  type PeriodValue,
  type SortKey,
} from "@/lib/book/filters";
import {
  belongsTo,
  shelfHref,
  SHELF_KEYS,
  type ShelfKey,
} from "@/lib/book/shelves";
import { BOOK_GENRES, genreCounts } from "@/lib/book/genres";
import { BackToTop } from "@/components/BackToTop";
import {
  AuthorCard,
  BookCard,
  coverSrc,
  coverUnoptimized,
  SeriesCard,
  TranslationBadge,
} from "./BookCard";
import {
  AWARDS_HREF,
  BOOK_ARCHIVE_HREF,
  BOOK_HALL_HREF,
  bookHref,
} from "@/lib/book/routes";
import styles from "./BookHall.module.css";
import { ArchiveUnavailable } from "@/components/hall/ArchiveUnavailable";
import { CuratorDock } from "@/components/curated/CuratorDock";

/**
 * Salon 05 · Kitap — "Kitap Arşivim".
 *
 * 2026-08-30: kullanıcının verdiği tasarıma göre yeniden kuruldu. Düzen
 * 1400px'lik ortalanmış çerçevede üç sütun (3-6-3): solda süzgeç paneli,
 * ortada raflar, sağda istatistik panelleri. Başlık çerçevenin tamamına
 * yayılıyor; iki ray da yapışkan.
 *
 * O tasarımla birlikte verilen kararlar:
 * - Raf tahtası ve cilt sırtı KALDIRILDI — kartlar düz ızgarada, hover'da
 *   yukarı kalkıp "İncele" örtüsü açılıyor. Salonun imzası artık cam panel
 *   + yaldız (ve onaylı glow istisnası, bkz. BookHall.module.css).
 * - "Şu an okuyorum" rafı sıradan bir raf değil: ilerleme çubuklu yatay
 *   bir vitrin kartı (`ReadingNow`).
 * - Kapsam kırpılmadı: beş raf, seriler, yazarlar, hedef halkası ve günün
 *   alıntısı yeni dile çevrilerek kaldı.
 */

// Küratör kontrolleri yalnızca mod açılınca indirilir — ziyaretçi bu JS'i almaz
const CuratorBar = dynamic(
  () => import("./BookCurator").then((mod) => mod.CuratorBar),
  { ssr: false },
);
const GoalEditor = dynamic(
  () => import("./BookCurator").then((mod) => mod.GoalEditor),
  { ssr: false },
);
const CuratorCardTools = dynamic(
  () => import("./BookCurator").then((mod) => mod.CuratorCardTools),
  { ssr: false },
);

/**
 * Salonda her rafta gösterilen kart sayısı.
 *
 * 10 = geniş ekranda TAM İKİ SIRA (kullanıcı isteği, 2026-08-30): ızgara
 * 1100px üstünde beş kolon, tek sıra raf çok seyrek kalıyordu. 5'in katı
 * olmayan bir değer son sırayı yarım bırakır.
 */
const SHELF_ROW = 10;

// Tek rafın kendi sayfasında ızgara kaç kitapla açılır
const PAGE_SIZE = 24;

/** Seri şeridi tek sıra; kalanı seriler sayfasında (kullanıcı isteği) */
const SERIES_LIMIT = 5;

/** Yazar paneli iki sıra (4 × 2); kalanı yazarlar sayfasında */
const AUTHOR_ROW = 8;

const SERIES_HREF = "/dark-stories/category/kitap/seriler";
const AUTHORS_HREF = "/dark-stories/category/kitap/yazarlar";

export function BookHall({
  archive,
  hallLabel,
  hallName,
  shelf,
  isAdmin = false,
}: {
  archive: BookArchive;
  /** Salon numarası ana sayfayla aynı kaynaktan gelir ("01", "05"…) */
  hallLabel: string;
  /** Salon adı da aynı kaynaktan: kategori kaydı (kod içinde sabit yok) */
  hallName: string;
  /**
   * Verilirse sayfa **tek rafın** kendi sayfasıdır: bütün raflar yerine o rafın
   * tamamı ızgara olarak çizilir. Verilmezse salonun kendisi — raflar alt alta.
   */
  shelf?: ShelfKey;
  /** Küratör modu anahtarını gösterir — yetki her istekte backend'de doğrulanır */
  isAdmin?: boolean;
}) {
  const t = useTranslations("book");
  const tStories = useTranslations("stories");
  const [filters, setFilters] = useState<BookFilterState>(EMPTY_FILTERS);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [curating, setCurating] = useState(false);

  const { books, stats } = archive;

  // Süzgeçler bütün raflara birden uygulanır
  const visible = useMemo(
    () => applyFilters(books, filters),
    [books, filters],
  );

  // Raf sayaçları süzgeçten ETKİLENMEZ: "Okuduklarım 158" hep arşivin gerçeği
  // olsun, seçili türe göre değişip kafa karıştırmasın
  const shelfCounts = useMemo(() => {
    const counts = {} as Record<ShelfKey, number>;
    for (const key of SHELF_KEYS) {
      counts[key] = books.filter((book) => belongsTo(book, key)).length;
    }
    return counts;
  }, [books]);

  const languages = useMemo(() => {
    const counts = new Map<string, number>();
    for (const book of books) {
      if (book.language) {
        counts.set(book.language, (counts.get(book.language) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count);
  }, [books]);

  /**
   * Tür sayaçları. Arşivin `genres` özetinden DEĞİL kitapların kendisinden
   * hesaplanıyor: sabit tür listesi takma adlarla eşleşiyor, "Fiction /
   * Science Fiction" ile "Bilimkurgu" aynı kovaya düşmeli.
   */
  const genreTally = useMemo(() => genreCounts(books), [books]);

  const isEmpty = books.length === 0;
  const hasFilters =
    filters.genres.length > 0 ||
    filters.period !== null ||
    filters.languages.length > 0 ||
    filters.translation !== null ||
    filters.search.trim() !== "";

  function patch(next: Partial<BookFilterState>) {
    setFilters((current) => ({ ...current, ...next }));
    // Süzgeç değişince listenin başına dön: 60 kitap açıkken tür değiştirip
    // hâlâ 60 kitap görmek "süzgeç çalışmadı" hissi veriyordu
    setLimit(PAGE_SIZE);
  }

  function toggleInList<T>(list: T[], value: T): T[] {
    return list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value];
  }

  return (
    <div data-category="kitap" className={styles.hall}>
      <div className={styles.frame}>
        {/* ---- Başlık: çerçevenin tamamına yayılır (tasarım) ---- */}
        <header className={styles.head}>
          <Link
            href={shelf ? BOOK_ARCHIVE_HREF : BOOK_HALL_HREF}
            className={styles.back}
          >
            {shelf
              ? t("backToArchive")
              : tStories("backToUniverse", { name: hallName })}
          </Link>
          <span className={styles.eyebrow}>
            {t("hall", { num: hallLabel, name: hallName })}
          </span>
          <h1 className={styles.title}>
            {shelf ? t(`shelf.${shelf}`) : t("archiveTitle")}
          </h1>
          <p className={styles.epigraph}>{t("epigraph")}</p>

          {isAdmin ? (
            <div className={styles.curatorSwitch}>
              <CuratorDock
                on={curating}
                onToggle={() => setCurating((value) => !value)}
                label={curating ? t("curator.off") : t("curator.on")}
              />
            </div>
          ) : null}
        </header>

        {isAdmin && curating ? <CuratorBar /> : null}

        <div className={styles.layout}>
          {/* ---- Sol ray: süzgeç paneli + ödüller kartı ---- */}
          <aside className={styles.railLeft}>
            <div className={styles.railStack}>
              <div className={styles.panel}>
                <h2 className={styles.railTitle}>
                  <IconSliders className={styles.panelIcon} />
                  {t("filters.title")}
                </h2>

                {/* Dönem: film salonundaki seçkinin kitap ölçeğindeki karşılığı */}
                <label className={styles.selectField}>
                  <span className={styles.filterHead}>
                    {t("filters.period")}
                  </span>
                  <span className={styles.selectWrap}>
                    <select
                      value={filters.period ?? ""}
                      onChange={(event) =>
                        patch({
                          period: event.target.value
                            ? (event.target.value as PeriodValue)
                            : null,
                        })
                      }
                    >
                      <option value="">{t("filters.allYears")}</option>
                      {PERIOD_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {t(`filters.periodName.${option.value}`)}
                        </option>
                      ))}
                    </select>
                  </span>
                </label>

                {/* Tür — Dönem'in hemen altında ve **her zaman** çizili (kullanıcı
                    isteği). Liste arşivden değil koddan geliyor: arşivdeki
                    kitapların `genres` alanı boş olduğunda eski hâli hiç
                    görünmüyordu. Tıklanınca alt alta iniyor; `details` sayesinde
                    JavaScript'siz de açılıp kapanır */}
                <details className={styles.filterFold}>
                  <summary className={styles.filterSummary}>
                    <span>{t("filters.genre")}</span>
                    <span className={styles.summaryMeta}>
                      {filters.genres.length > 0
                        ? t("filters.selected", { count: filters.genres.length })
                        : t("filters.all")}
                    </span>
                  </summary>
                  <ul className={styles.filterList}>
                    {BOOK_GENRES.map((genre) => {
                      const count = genreTally.get(genre.key) ?? 0;
                      return (
                        <li key={genre.key}>
                          <button
                            type="button"
                            className={
                              filters.genres.includes(genre.key)
                                ? styles.filterRowOn
                                : styles.filterRow
                            }
                            aria-pressed={filters.genres.includes(genre.key)}
                            onClick={() =>
                              patch({
                                genres: toggleInList(filters.genres, genre.key),
                              })
                            }
                          >
                            <span className={styles.tick} aria-hidden />
                            <span className={styles.filterLabel}>
                              {t(`genreName.${genre.key}`)}
                            </span>
                            {/* Sayı yalnızca doluysa: sıfırlar sütunu gürültüye
                                boğuyordu, tür yine seçilebilir durumda kalıyor */}
                            {count > 0 ? (
                              <span className={styles.filterCount}>{count}</span>
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </details>

                {languages.length > 0 ? (
                  <details className={styles.filterFold}>
                    <summary className={styles.filterSummary}>
                      <span>{t("filters.language")}</span>
                      <span className={styles.summaryMeta}>
                        {filters.languages.length > 0
                          ? t("filters.selected", {
                              count: filters.languages.length,
                            })
                          : t("filters.all")}
                      </span>
                    </summary>
                    <ul className={styles.filterList}>
                      {languages.map((item) => (
                        <li key={item.code}>
                          <button
                            type="button"
                            className={
                              filters.languages.includes(item.code)
                                ? styles.filterRowOn
                                : styles.filterRow
                            }
                            aria-pressed={filters.languages.includes(item.code)}
                            onClick={() =>
                              patch({
                                languages: toggleInList(
                                  filters.languages,
                                  item.code,
                                ),
                              })
                            }
                          >
                            <span className={styles.tick} aria-hidden />
                            <span className={styles.filterLabel}>
                              {languageName(item.code, t)}
                            </span>
                            <span className={styles.filterCount}>
                              {item.count}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : null}

                <section className={styles.filterBlock}>
                  <h3 className={styles.filterHead}>
                    {t("filters.translation")}
                  </h3>
                  <ul className={styles.filterList}>
                    {(["TRANSLATED", "UNTRANSLATED", "IN_PROGRESS"] as const).map(
                      (state) => (
                        <li key={state}>
                          <button
                            type="button"
                            className={
                              filters.translation === state
                                ? styles.filterRowOn
                                : styles.filterRow
                            }
                            aria-pressed={filters.translation === state}
                            onClick={() =>
                              patch({
                                translation:
                                  filters.translation === state ? null : state,
                              })
                            }
                          >
                            <span className={styles.tick} aria-hidden />
                            <span className={styles.filterLabel}>
                              {t(`translation.${state}`)}
                            </span>
                          </button>
                        </li>
                      ),
                    )}
                  </ul>
                </section>

                {hasFilters ? (
                  <button
                    type="button"
                    className={styles.clearFilters}
                    onClick={() => {
                      setFilters(EMPTY_FILTERS);
                      setLimit(PAGE_SIZE);
                    }}
                  >
                    {t("filters.clear")}
                  </button>
                ) : null}
              </div>

              {/* Ödüller kartı süzgeçlerin altında: arşive bakarken "bunlardan
                  kaçı ödüllü" sorusu buradan bir tık uzakta olsun */}
              <Link href={AWARDS_HREF} className={styles.awardsCard}>
                <span className={styles.awardsCardBody}>
                  <IconAward className={styles.panelIcon} />
                  <span className={styles.awardsCardText}>
                    {t("awards.title")}
                  </span>
                </span>
                <IconArrowRight className={styles.awardsArrow} />
              </Link>
            </div>
          </aside>

          {/* ---- Orta sütun ---- */}
          <div className={styles.column}>
            {/* Gerekce FilmHall'da yazili */}
            {archive.unavailable ? (
              <ArchiveUnavailable />
            ) : isEmpty ? (
              <p className={styles.empty}>{t("emptyArchive")}</p>
            ) : (
              <>
                {/* Arama ve sıralama tek cam barda (tasarım) */}
                <div className={styles.toolbar}>
                  <IconSearch className={styles.searchIcon} />
                  <label className={styles.searchField}>
                    <span className={styles.srOnly}>{t("searchLabel")}</span>
                    <input
                      type="search"
                      value={filters.search}
                      placeholder={t("searchPlaceholder")}
                      onChange={(event) =>
                        patch({ search: event.target.value })
                      }
                    />
                  </label>

                  <label className={styles.sortField}>
                    <span className={styles.srOnly}>{t("sortLabel")}</span>
                    <span className={styles.selectWrap}>
                      <select
                        value={filters.sort}
                        onChange={(event) =>
                          patch({ sort: event.target.value as SortKey })
                        }
                      >
                        {SORT_KEYS.map((key) => (
                          <option key={key} value={key}>
                            {t(`sort.${key}`)}
                          </option>
                        ))}
                      </select>
                    </span>
                  </label>
                </div>

                {shelf ? (
                  <SingleShelf
                    books={visible.filter((book) => belongsTo(book, shelf))}
                    limit={limit}
                    curating={curating}
                    onMore={() => setLimit((value) => value + PAGE_SIZE)}
                  />
                ) : (
                  SHELF_KEYS.map((key) =>
                    key === "reading" ? (
                      // "Şu an okuyorum" sıradan raf değil, vitrin kartı
                      <ReadingNow
                        key={key}
                        books={visible.filter((book) =>
                          belongsTo(book, "reading"),
                        )}
                        total={shelfCounts.reading}
                        curating={isAdmin && curating}
                      />
                    ) : (
                      <Shelf
                        key={key}
                        shelf={key}
                        books={visible.filter((book) => belongsTo(book, key))}
                        total={shelfCounts[key]}
                        curating={isAdmin && curating}
                      />
                    ),
                  )
                )}

                {/* Seriler: tek şerit, kalanı kendi sayfasında. Eskiden altı
                    seri gösterip kesiyordu ve kullanıcı yeni kurduğu serinin
                    görünmediğini bildirdi — artık kesildiği de söyleniyor */}
                {!shelf && archive.series.length > 0 ? (
                  <section className={styles.block}>
                    <div className={styles.blockHead}>
                      <Link href={SERIES_HREF} className={styles.blockLink}>
                        <h2 className={styles.blockTitle}>
                          {t("seriesTitle")}
                        </h2>
                      </Link>
                      <span className={styles.shelfMeta}>
                        <span className={styles.blockCount}>
                          {t("seriesTotal", { count: archive.series.length })}
                        </span>
                        {archive.series.length > SERIES_LIMIT ? (
                          <Link href={SERIES_HREF} className={styles.showAll}>
                            {t("showAll")}
                          </Link>
                        ) : null}
                      </span>
                    </div>
                    <ul className={styles.seriesRow}>
                      {archive.series.slice(0, SERIES_LIMIT).map((series) => (
                        <li key={series.slug} className={styles.seriesCard}>
                          <SeriesCard series={series} />
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {/* Yazarlar: iki sıra, kalanı kendi sayfasında. İlişkisel kaydı
                    olan yazar sayfasına gider; olmayan arşivi o adla süzer —
                    olmayan kişinin sayfası 404 verirdi */}
                {!shelf && archive.authors.length > 0 ? (
                  <section className={styles.block}>
                    <div className={styles.blockHead}>
                      <Link href={AUTHORS_HREF} className={styles.blockLink}>
                        <h2 className={styles.blockTitle}>
                          {t("authorsTitle")}
                        </h2>
                      </Link>
                      <span className={styles.shelfMeta}>
                        <span className={styles.blockCount}>
                          {t("authorsTotal", {
                            count: archive.authors.length,
                          })}
                        </span>
                        {archive.authors.length > AUTHOR_ROW ? (
                          <Link href={AUTHORS_HREF} className={styles.showAll}>
                            {t("showAll")}
                          </Link>
                        ) : null}
                      </span>
                    </div>
                    <ul className={styles.authorGrid}>
                      {archive.authors.slice(0, AUTHOR_ROW).map((author) => (
                        <li key={author.name}>
                          <AuthorCard
                            author={author}
                            onFilter={(name) => patch({ search: name })}
                          />
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </>
            )}
          </div>

          {/* ---- Sağ ray: istatistik panelleri ---- */}
          <aside className={styles.railRight}>
            <div className={styles.railStack}>
              <section className={`${styles.panel} ${styles.statBlock}`}>
                <h2 className={styles.railTitle}>
                  <IconChart className={styles.panelIcon} />
                  {t("stats.title")}
                </h2>

                {/* Tasarımdaki iki sayısal kutu; kalan satırlar liste */}
                <div className={styles.statTiles}>
                  <div className={styles.statTile}>
                    <span className={styles.statTileValue}>{stats.read}</span>
                    <span className={styles.statTileLabel}>
                      {t("stats.read")}
                    </span>
                  </div>
                  <div className={styles.statTile}>
                    <span
                      className={`${styles.statTileValue} ${styles.statTileGold}`}
                    >
                      {stats.totalPages.toLocaleString("tr-TR")}
                    </span>
                    <span className={styles.statTileLabel}>
                      {t("stats.pages")}
                    </span>
                  </div>
                </div>

                <dl className={styles.statList}>
                  <div>
                    <dt>{t("stats.thisYear")}</dt>
                    <dd>{stats.readThisYear}</dd>
                  </div>
                  {stats.longest ? (
                    <div>
                      <dt>{t("stats.longest")}</dt>
                      <dd>
                        {t("pageCount", { count: stats.longest.pageCount })}
                        <span className={styles.statSub}>
                          {stats.longest.title}
                        </span>
                      </dd>
                    </div>
                  ) : null}
                  {stats.shortest ? (
                    <div>
                      <dt>{t("stats.shortest")}</dt>
                      <dd>
                        {t("pageCount", { count: stats.shortest.pageCount })}
                        <span className={styles.statSub}>
                          {stats.shortest.title}
                        </span>
                      </dd>
                    </div>
                  ) : null}
                  {stats.topGenre ? (
                    <div>
                      <dt>{t("stats.topGenre")}</dt>
                      <dd>{stats.topGenre}</dd>
                    </div>
                  ) : null}
                  {stats.topAuthor ? (
                    <div>
                      <dt>{t("stats.topAuthor")}</dt>
                      <dd>{stats.topAuthor}</dd>
                    </div>
                  ) : null}
                  {stats.averageRating !== null ? (
                    <div>
                      <dt>{t("stats.average")}</dt>
                      <dd>{stats.averageRating.toFixed(1)}</dd>
                    </div>
                  ) : null}
                </dl>
              </section>

              {/* Yıllık hedef halkası; hedef kurulmamışsa çizilmez */}
              {stats.goal ? (
                <section className={`${styles.panel} ${styles.statBlock}`}>
                  <h2 className={styles.railTitle}>
                    {t("goal.title", { year: stats.goal.year })}
                  </h2>
                  <GoalRing
                    done={stats.goal.doneBooks}
                    target={stats.goal.targetBooks}
                    label={t("goal.progress", {
                      done: stats.goal.doneBooks,
                      target: stats.goal.targetBooks,
                    })}
                  />
                  {stats.goal.targetPages ? (
                    <p className={styles.goalPages}>
                      {t("goal.pages", {
                        done: stats.goal.donePages,
                        target: stats.goal.targetPages,
                      })}
                    </p>
                  ) : null}
                </section>
              ) : null}

              {isAdmin && curating ? (
                <div className={styles.panel}>
                  <GoalEditor goal={stats.goal} />
                </div>
              ) : null}

              {archive.recent.length > 0 ? (
                <section className={`${styles.panel} ${styles.statBlock}`}>
                  <h2 className={styles.railTitle}>
                    <IconClock className={styles.panelIcon} />
                    {t("recentTitle")}
                  </h2>
                  <ul className={styles.recentList}>
                    {archive.recent.map((book) => (
                      <li key={book.id}>
                        <Link
                          href={bookHref(book.slug)}
                          className={styles.recentRow}
                        >
                          <span className={styles.recentCover}>
                            {coverSrc(book) ? (
                              <Image
                                src={coverSrc(book)!}
                                alt=""
                                fill
                                /* Bu kutu her ekran genişliğinde SABİT ~38px;
                                   `unoptimized` yüzünden buraya 600px genişlikte
                                   JPEG iniyordu — arşivin en israflı noktası
                                   burasıydı (2026-08-09 ölçümü). */
                                sizes="38px"
                                className={styles.coverImg}
                                unoptimized={coverUnoptimized(book)}
                              />
                            ) : null}
                          </span>
                          <span className={styles.recentText}>
                            <span className={styles.recentTitle}>
                              {book.title}
                            </span>
                            <span className={styles.recentAuthor}>
                              {book.authors[0] ?? ""}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {/* Günün alıntısı: gün numarasından seçilir, sayfa yenilenince
                  değişmez (backend kararı) */}
              {archive.quoteOfTheDay ? (
                <section className={`${styles.panel} ${styles.quoteBlock}`}>
                  <h2 className={styles.railTitle}>{t("quoteTitle")}</h2>
                  <blockquote className={styles.quoteText}>
                    {archive.quoteOfTheDay.text}
                  </blockquote>
                  <p className={styles.quoteSource}>
                    <Link
                      href={`/dark-stories/category/kitap/${archive.quoteOfTheDay.bookSlug}`}
                      className={styles.titleLink}
                    >
                      {archive.quoteOfTheDay.bookTitle}
                    </Link>
                    {archive.quoteOfTheDay.page ? (
                      <span className={styles.quotePage}>
                        {t("quotePage", { page: archive.quoteOfTheDay.page })}
                      </span>
                    ) : null}
                  </p>
                </section>
              ) : null}
            </div>
          </aside>
        </div>
      </div>

      <BackToTop />
    </div>
  );
}

/**
 * "Şu an okuyorum" vitrini — tasarımın merkez parçası. Raf ızgarası yerine
 * ilerleme çubuklu yatay kart(lar): kapak, ad, yazar, "%18 tamamlandı" ve
 * sayfa sayacı. Elde birden çok açık kitap varsa kartlar alt alta iner.
 */
function ReadingNow({
  books,
  total,
  curating,
}: {
  books: BookListItem[];
  total: number;
  curating: boolean;
}) {
  const t = useTranslations("book");

  return (
    <section className={styles.shelfSection}>
      <div className={styles.shelfHead}>
        <Link href={shelfHref("reading")} className={styles.shelfLink}>
          <h2 className={styles.shelfTitle}>{t("shelf.reading")}</h2>
        </Link>
        <span className={styles.shelfMeta}>
          <span className={styles.shelfCount}>
            {t("shelfCount", { count: total })}
          </span>
        </span>
      </div>

      {books.length === 0 ? (
        <p className={styles.emptyShelf}>{t("emptyShelf")}</p>
      ) : (
        <div className={styles.heroList}>
          {books.map((book) => (
            <article key={book.id} className={styles.heroCard}>
              <span className={styles.heroOrb} aria-hidden />

              {/* Kapak bağlantısı erişilebilirlik ağacında YOK — karttaki
                  başlık bağlantısıyla aynı yere gidiyor (2026-08-22 denetim
                  kararıyla aynı gerekçe) */}
              <Link
                href={bookHref(book.slug)}
                className={styles.heroCover}
                aria-hidden="true"
                tabIndex={-1}
              >
                {coverSrc(book) ? (
                  <Image
                    src={coverSrc(book)!}
                    alt=""
                    fill
                    sizes="92px"
                    className={styles.coverImg}
                    unoptimized={coverUnoptimized(book)}
                  />
                ) : (
                  <span className={styles.coverFallback}>
                    <span className={styles.coverFallbackTitle}>
                      {book.title}
                    </span>
                  </span>
                )}
              </Link>

              <div className={styles.heroBody}>
                <h3 className={styles.heroTitle}>
                  <Link href={bookHref(book.slug)} className={styles.titleLink}>
                    {book.title}
                  </Link>
                </h3>
                {book.authors[0] ? (
                  <p className={styles.heroAuthor}>{book.authors[0]}</p>
                ) : null}

                {/* Çubuk yalnızca yüzde biliniyorsa: sayfa sayısı olmayan
                    kitapta `progress` null gelir ve satır hiç çizilmez */}
                {book.progress !== null ? (
                  <>
                    <div className={styles.heroMetaRow}>
                      <span>
                        {t("progressPercent", { percent: book.progress })}
                      </span>
                      {book.pageCount ? (
                        <span>
                          {book.currentPage} / {book.pageCount}
                        </span>
                      ) : null}
                    </div>
                    <div
                      className={styles.heroBar}
                      role="img"
                      aria-label={t("progressPercent", {
                        percent: book.progress,
                      })}
                    >
                      <span
                        className={styles.heroBarFill}
                        style={{ width: `${book.progress}%` }}
                      />
                    </div>
                  </>
                ) : null}

                {curating ? <CuratorCardTools book={book} /> : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * Bir raf: yaldızlı başlık çizgisi + beşli kart sırası. Hover'da kart
 * yukarı kalkar ve kapağa "İncele" örtüsü iner (tasarım).
 *
 * Hizalama CSS'te sabit (kullanıcı isteği): kapak oranı her kartta aynı ve
 * kitabın adı tek satıra kilitli — raf satır satır hizalı kalır.
 */
function Shelf({
  shelf,
  books,
  total,
  curating,
}: {
  shelf: ShelfKey;
  books: BookListItem[];
  total: number;
  /** Küratör modu: kartın altına silme/durum araçları iner */
  curating: boolean;
}) {
  const t = useTranslations("book");
  const row = books.slice(0, SHELF_ROW);

  return (
    <section className={styles.shelfSection}>
      <div className={styles.shelfHead}>
        <Link href={shelfHref(shelf)} className={styles.shelfLink}>
          <h2 className={styles.shelfTitle}>{t(`shelf.${shelf}`)}</h2>
        </Link>
        <span className={styles.shelfMeta}>
          <span className={styles.shelfCount}>
            {t("shelfCount", { count: total })}
          </span>
          {total > row.length ? (
            <Link href={shelfHref(shelf)} className={styles.showAll}>
              {t("showAll")}
            </Link>
          ) : null}
        </span>
      </div>

      {row.length === 0 ? (
        <p className={styles.emptyShelf}>{t("emptyShelf")}</p>
      ) : (
        <ul className={styles.volumes}>
          {row.map((book) => (
            <li key={book.id} className={styles.volume}>
              {/* Kapak bağlantısı erişilebilirlik ağacında YOK: alttaki başlık
                  bağlantısıyla aynı yere gidiyor — ekran okuyucuya kart başına
                  tek durak (2026-08-22 denetim kararı raflara da uygulandı) */}
              <Link
                href={bookHref(book.slug)}
                className={styles.spine}
                aria-hidden="true"
                tabIndex={-1}
              >
                {coverSrc(book) ? (
                  <Image
                    src={coverSrc(book)!}
                    alt=""
                    fill
                    /* Orta sütun 1400px çerçevenin 6/12'si; beş kolonlu
                       ızgarada kapak her genişlikte ~100–125px bandında.
                       `vw` BİLEREK yok: yüzde görünürse Next 211px altındaki
                       basamakları eler (bkz. next.config.ts). */
                    sizes="130px"
                    className={styles.coverImg}
                    unoptimized={coverUnoptimized(book)}
                  />
                ) : (
                  <span className={styles.coverFallback}>
                    <span className={styles.coverFallbackTitle}>
                      {book.title}
                    </span>
                  </span>
                )}

                {book.isFavorite ? (
                  <span className={styles.favoriteMark} aria-hidden>
                    ★
                  </span>
                ) : null}
                {book.seriesIndex !== null && book.seriesName ? (
                  <span className={styles.seriesMark}>{book.seriesIndex}</span>
                ) : null}
                <TranslationBadge book={book} />
                {book.status === "READING" && book.progress !== null ? (
                  <span className={styles.cardProgress} aria-hidden>
                    <span
                      className={styles.cardProgressFill}
                      style={{ width: `${book.progress}%` }}
                    />
                  </span>
                ) : null}

                {/* Hover/odakta kapağa inen "İncele" örtüsü (tasarım) */}
                <span className={styles.inspect} aria-hidden>
                  <span className={styles.inspectChip}>{t("inspect")}</span>
                </span>
              </Link>

              <span className={styles.volumeText}>
                <Link href={bookHref(book.slug)} className={styles.titleLink}>
                  {book.title}
                </Link>
                {book.authors[0] ? (
                  <span className={styles.volumeAuthor}>
                    {book.authors[0]}
                  </span>
                ) : null}
              </span>

              {/* Küratör araçları rafta da: yanlışlıkla eklenen kitabı
                  silmek için raf alt sayfasına gitmek gerekmesin */}
              {curating ? <CuratorCardTools book={book} /> : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Rafın kendi sayfası: tek raf, ızgara olarak ve sayfalanarak. */
function SingleShelf({
  books,
  limit,
  curating,
  onMore,
}: {
  books: BookListItem[];
  limit: number;
  curating: boolean;
  onMore: () => void;
}) {
  const t = useTranslations("book");
  const shown = books.slice(0, limit);

  if (books.length === 0) {
    return <p className={styles.empty}>{t("noMatch")}</p>;
  }

  return (
    <>
      <p className={styles.resultCount}>
        {t("resultCount", { count: books.length })}
      </p>
      <ul className={styles.grid}>
        {shown.map((book) => (
          <li key={book.id}>
            <BookCard book={book} curating={curating} />
          </li>
        ))}
      </ul>
      {books.length > shown.length ? (
        <div className={styles.loadMoreRow}>
          <button type="button" className={styles.loadMore} onClick={onMore}>
            {t("loadMore")}
          </button>
        </div>
      ) : null}
    </>
  );
}

/**
 * Hedef halkası. `conic-gradient` ile çiziliyor: SVG'siz, tek elemanla ve
 * tema token'larıyla — kural 16 gereği bileşende hex renk yok.
 */
function GoalRing({
  done,
  target,
  label,
}: {
  done: number;
  target: number;
  label: string;
}) {
  const percent =
    target > 0 ? Math.min(100, Math.round((done / target) * 100)) : 0;
  return (
    <div className={styles.goalRow}>
      <span
        className={styles.goalRing}
        style={{ ["--goal-percent" as string]: `${percent}%` }}
        role="img"
        aria-label={label}
      >
        <span className={styles.goalValue}>{percent}%</span>
      </span>
      <span className={styles.goalLabel}>{label}</span>
    </div>
  );
}

/*
 * Panel ikonları. Tasarım Font Awesome CDN'i kullanıyordu — CSP dış istek
 * yasağı yüzünden ikonlar elle çizilmiş SVG: hepsi 24'lük ızgarada, aynı
 * 1.8'lik konturla (tutarlı ağırlık). Renk `currentColor`dan gelir.
 */

function svgProps(className?: string) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    className,
  };
}

function IconSliders({ className }: { className?: string }) {
  return (
    <svg {...svgProps(className)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
      <circle cx="9" cy="7" r="2" />
      <circle cx="15" cy="12" r="2" />
      <circle cx="7" cy="17" r="2" />
    </svg>
  );
}

function IconAward({ className }: { className?: string }) {
  return (
    <svg {...svgProps(className)}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.7 13.6 7 21l5-2.8L17 21l-1.7-7.4" />
    </svg>
  );
}

function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg {...svgProps(className)}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg {...svgProps(className)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m16.6 16.6 4.4 4.4" />
    </svg>
  );
}

function IconChart({ className }: { className?: string }) {
  return (
    <svg {...svgProps(className)}>
      <path d="M4 20h16" />
      <path d="M7 20v-6M12 20V5M17 20v-9" />
    </svg>
  );
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg {...svgProps(className)}>
      <path d="M3.5 8A9 9 0 1 1 3 12" />
      <path d="M3 4v4h4" />
      <path d="M12 8v4.5l3 1.8" />
    </svg>
  );
}

/**
 * Dil kodunun okunur karşılığı. Çeviri dosyasında yalnızca sık geçen diller
 * var; bilinmeyen kod olduğu gibi (büyük harfle) gösterilir — Google Books
 * ara sıra "mul" gibi kodlar veriyor ve o satır boş kalmasın.
 */
const KNOWN_LANGUAGES = ["tr", "en", "de", "fr", "es", "ru", "ja"];

function languageName(code: string, t: (key: string) => string): string {
  return KNOWN_LANGUAGES.includes(code)
    ? t(`languageName.${code}`)
    : code.toLocaleUpperCase("tr");
}
