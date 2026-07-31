"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { ArchiveBook, BookArchive } from "@/lib/api/types";
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
import { BackToTop } from "@/components/BackToTop";
import {
  BookCard,
  bookHref,
  coverSrc,
  Stars,
  TranslationBadge,
} from "./BookCard";
import { AWARDS_HREF } from "./AwardHall";
import styles from "./BookHall.module.css";

/**
 * Salon 05 · Kitap — "Kitap Arşivim".
 *
 * Düzen üç sütun (kullanıcı isteği: "her şeyi ortada birleştirmeyelim, tüm
 * alanı doldursun"): solda süzgeç rayı, ortada raflar, sağda okuma
 * istatistikleri.
 *
 * Ortadaki bölümler film salonundaki gibi **alt alta raflar** — sekme değil.
 * Ama film salonundan bir fark var: burası bir kitaplık. Her rafın kitapları
 * ortak bir zemine basıyor, boyları birbirini tutmuyor ve altlarında gerçek
 * bir raf tahtası var. Bir sinema salonunda afişler asılıdır, bir kitaplıkta
 * ciltler **durur** — salonun imzası bu.
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

// Salonda her raf tek sıra: rafa sığan cilt sayısı
const SHELF_ROW = 7;

// Tek rafın kendi sayfasında ızgara kaç kitapla açılır
const PAGE_SIZE = 24;

// Orta sütunun altındaki seri şeridi kaç kart taşır
const SERIES_LIMIT = 6;

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
      <div className={styles.layout}>
        {/* ---- Sol ray: süzgeçler ---- */}
        <aside className={styles.railLeft}>
          <div className={styles.railInner}>
            <h2 className={styles.railTitle}>{t("filters.title")}</h2>

            {/* Tür listesi uzun: kapalı açılır bir bölüm olarak duruyor,
                tıklanınca alt alta iniyor (kullanıcı isteği). `details`
                kullanılıyor — JavaScript'siz de açılıp kapanır */}
            {archive.genres.length > 0 ? (
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
                  {archive.genres.map((genre) => (
                    <li key={genre.name}>
                      <button
                        type="button"
                        className={
                          filters.genres.includes(genre.name)
                            ? styles.filterRowOn
                            : styles.filterRow
                        }
                        aria-pressed={filters.genres.includes(genre.name)}
                        onClick={() =>
                          patch({
                            genres: toggleInList(filters.genres, genre.name),
                          })
                        }
                      >
                        <span className={styles.filterLabel}>{genre.name}</span>
                        <span className={styles.filterCount}>
                          {genre.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            ) : null}

            {/* Dönem: film salonundaki seçkinin kitap ölçeğindeki karşılığı */}
            <label className={styles.selectField}>
              <span className={styles.filterHead}>{t("filters.period")}</span>
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
            </label>

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
                        <span className={styles.filterLabel}>
                          {languageName(item.code, t)}
                        </span>
                        <span className={styles.filterCount}>{item.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            ) : null}

            <section className={styles.filterBlock}>
              <h3 className={styles.filterHead}>{t("filters.translation")}</h3>
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

            {/* Ödüller rafı süzgeçlerin altında: arşive bakarken "bunlardan
                kaçı ödüllü" sorusu buradan bir tık uzakta olsun */}
            <Link href={AWARDS_HREF} className={styles.awardsLink}>
              {t("awards.railLink")}
            </Link>
          </div>
        </aside>

        {/* ---- Orta sütun ---- */}
        <main className={styles.column}>
          <header className={styles.head}>
            <Link
              href={
                shelf
                  ? "/dark-stories/category/kitap/arsiv"
                  : "/dark-stories/category/kitap"
              }
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
                <button
                  type="button"
                  className={curating ? styles.curatorOn : styles.curatorOff}
                  aria-pressed={curating}
                  onClick={() => setCurating((value) => !value)}
                >
                  {curating ? t("curator.off") : t("curator.on")}
                </button>
              </div>
            ) : null}
          </header>

          {isAdmin && curating ? <CuratorBar /> : null}

          {isEmpty ? (
            <p className={styles.empty}>{t("emptyArchive")}</p>
          ) : (
            <>
              <div className={styles.toolbar}>
                <label className={styles.searchField}>
                  <span className={styles.srOnly}>{t("searchLabel")}</span>
                  <input
                    type="search"
                    value={filters.search}
                    placeholder={t("searchPlaceholder")}
                    onChange={(event) => patch({ search: event.target.value })}
                  />
                </label>

                <label className={styles.sortField}>
                  <span>{t("sortLabel")}</span>
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
                SHELF_KEYS.map((key) => (
                  <Shelf
                    key={key}
                    shelf={key}
                    books={visible.filter((book) => belongsTo(book, key))}
                    total={shelfCounts[key]}
                  />
                ))
              )}

              {/* Seriler: Kadim Dünyalar'a bağlı olan kart evren sayfasına
                  açılır (kullanıcı isteği), bağlı olmayan seri kendi
                  süzgecini kurar */}
              {!shelf && archive.series.length > 0 ? (
                <section className={styles.block}>
                  <h2 className={styles.blockTitle}>{t("seriesTitle")}</h2>
                  <ul className={styles.seriesRow}>
                    {archive.series.slice(0, SERIES_LIMIT).map((series) => (
                      <li key={series.slug} className={styles.seriesCard}>
                        <button
                          type="button"
                          className={styles.seriesButton}
                          onClick={() =>
                            patch({ search: series.name, sort: "series" })
                          }
                        >
                          <span className={styles.seriesCover}>
                            {coverSrc(series) ? (
                              <Image
                                src={coverSrc(series)!}
                                alt=""
                                fill
                                sizes="120px"
                                className={styles.coverImg}
                                unoptimized
                              />
                            ) : null}
                          </span>
                          <span className={styles.seriesName}>
                            {series.name}
                          </span>
                          <span className={styles.seriesMeta}>
                            {t("seriesCount", { count: series.count })}
                          </span>
                          {/* "5 kitaptan 3'ü Türkçe" — kullanıcının istediği satır */}
                          {series.untranslatedCount > 0 ? (
                            <span className={styles.seriesTranslation}>
                              {t("seriesTranslated", {
                                translated: series.translatedCount,
                                total: series.count,
                              })}
                            </span>
                          ) : null}
                        </button>
                        {series.universeSlug ? (
                          <Link
                            href={`/dark-stories/${series.universeSlug}`}
                            className={styles.seriesUniverse}
                          >
                            {t("openUniverse")}
                          </Link>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {!shelf && archive.authors.length > 0 ? (
                <section className={styles.block}>
                  <h2 className={styles.blockTitle}>{t("authorsTitle")}</h2>
                  <ul className={styles.authorGrid}>
                    {archive.authors.map((author) => (
                      <li key={author.name}>
                        <button
                          type="button"
                          className={styles.authorCard}
                          onClick={() => patch({ search: author.name })}
                        >
                          <span className={styles.authorName}>
                            {author.name}
                          </span>
                          <span className={styles.authorMeta}>
                            {t("authorCount", { count: author.count })}
                          </span>
                          {author.averageRating !== null ? (
                            <span className={styles.authorRating}>
                              <Stars value={author.averageRating} />
                            </span>
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </>
          )}
        </main>

        {/* ---- Sağ ray: istatistikler ---- */}
        <aside className={styles.railRight}>
          <div className={styles.railInner}>
            <section className={styles.statBlock}>
              <h2 className={styles.railTitle}>{t("stats.title")}</h2>
              <dl className={styles.statList}>
                <div>
                  <dt>{t("stats.read")}</dt>
                  <dd>{stats.read}</dd>
                </div>
                <div>
                  <dt>{t("stats.thisYear")}</dt>
                  <dd>{stats.readThisYear}</dd>
                </div>
                <div>
                  <dt>{t("stats.pages")}</dt>
                  <dd>{stats.totalPages.toLocaleString("tr-TR")}</dd>
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
              <section className={styles.statBlock}>
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

            {isAdmin && curating ? <GoalEditor goal={stats.goal} /> : null}

            {archive.recent.length > 0 ? (
              <section className={styles.statBlock}>
                <h2 className={styles.railTitle}>{t("recentTitle")}</h2>
                <ul className={styles.recentList}>
                  {archive.recent.map((book) => (
                    <li key={book.id}>
                      <Link href={bookHref(book)} className={styles.recentRow}>
                        <span className={styles.recentCover}>
                          {coverSrc(book) ? (
                            <Image
                              src={coverSrc(book)!}
                              alt=""
                              fill
                              sizes="40px"
                              className={styles.coverImg}
                              unoptimized
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
              <section className={styles.quoteBlock}>
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

      <BackToTop />
    </div>
  );
}

/**
 * Bir raf. Ciltler ortak bir zemine basar, boyları birbirini tutmaz ve
 * altlarında bir raf tahtası vardır — salonun imzası bu.
 *
 * Boy farkı rastgele DEĞİL, sıradan türetiliyor (CSS'te `nth-child`): sunucu
 * ile istemci aynı boyu çizsin, sayfa açılışında kitaplar zıplamasın.
 */
function Shelf({
  shelf,
  books,
  total,
}: {
  shelf: ShelfKey;
  books: ArchiveBook[];
  total: number;
}) {
  const t = useTranslations("book");
  const row = books.slice(0, SHELF_ROW);

  return (
    <section className={styles.shelfSection}>
      <div className={styles.shelfHead}>
        <Link href={shelfHref(shelf)} className={styles.shelfLink}>
          <h2 className={styles.shelfTitle}>{t(`shelf.${shelf}`)}</h2>
        </Link>
        <span className={styles.shelfCount}>
          {t("shelfCount", { count: total })}
        </span>
      </div>

      {row.length === 0 ? (
        <p className={styles.emptyShelf}>{t("emptyShelf")}</p>
      ) : (
        <div className={styles.board}>
          <ul className={styles.volumes}>
            {row.map((book) => (
              <li key={book.id} className={styles.volume}>
                <Link href={bookHref(book)} className={styles.spine}>
                  {coverSrc(book) ? (
                    <Image
                      src={coverSrc(book)!}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 30vw, 150px"
                      className={styles.coverImg}
                      unoptimized
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
                    <span className={styles.seriesMark}>
                      {book.seriesIndex}
                    </span>
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
                </Link>

                <span className={styles.volumeText}>
                  <Link href={bookHref(book)} className={styles.titleLink}>
                    {book.title}
                  </Link>
                  {book.authors[0] ? (
                    <span className={styles.volumeAuthor}>
                      {book.authors[0]}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
          {/* Raf tahtası: ciltlerin bastığı zemin */}
          <span className={styles.plank} aria-hidden />
        </div>
      )}

      {total > row.length ? (
        <div className={styles.shelfFooter}>
          <Link href={shelfHref(shelf)} className={styles.showAll}>
            {t("showAll")}
          </Link>
        </div>
      ) : null}
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
  books: ArchiveBook[];
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
