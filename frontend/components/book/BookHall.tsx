"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { BookArchive } from "@/lib/api/types";
import {
  applyFilters,
  EMPTY_FILTERS,
  PAGE_BUCKETS,
  RATING_THRESHOLDS,
  SORT_KEYS,
  type BookFilterState,
  type PageBucket,
  type SortKey,
} from "@/lib/book/filters";
import { belongsTo, shelfHref, SHELF_KEYS, type ShelfKey } from "@/lib/book/shelves";
import { BackToTop } from "@/components/BackToTop";
import { BookCard, bookHref, Stars } from "./BookCard";
import styles from "./BookHall.module.css";

/**
 * Salon 05 · Kitap — "Kitap Arşivim".
 *
 * Düzen film/dizi salonundan **bilinçli olarak ayrılıyor** (kullanıcı isteği:
 * "her şeyi ortada birleştirmeyelim, tüm alanı doldursun"): sabit genişlikte
 * tek sütun yerine ekranın tamamını kaplayan üç sütun —
 *  - **sol ray**: süzgeçler (tür, puan, yıl, sayfa, dil, çeviri),
 *  - **orta**: durum sekmeleri + kapak ızgarası + seriler + yazarlar,
 *  - **sağ ray**: okuma istatistikleri, yıllık hedef, son eklenenler, alıntı.
 *
 * Sebebi kitaba özgü: bir film arşivinde süzgeç birkaç tür, kitapta ise tür +
 * sayfa + dil + çeviri + yıl birlikte kullanılıyor ve bunlar şerit hâlinde
 * üstte durunca ızgarayı ekrandan aşağı itiyordu.
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

// Izgara kaç kitapla açılır; "daha fazlasını yükle" bu kadar daha ekler
const PAGE_SIZE = 20;

// Orta sütunun altındaki seri şeridi kaç kart taşır
const SERIES_LIMIT = 6;

export function BookHall({
  archive,
  hallLabel,
  hallName,
  initialShelf = "read",
  isAdmin = false,
}: {
  archive: BookArchive;
  /** Salon numarası ana sayfayla aynı kaynaktan gelir ("01", "05"…) */
  hallLabel: string;
  /** Salon adı da aynı kaynaktan: kategori kaydı (kod içinde sabit yok) */
  hallName: string;
  /**
   * Açılışta seçili raf. Raf sayfaları (`/arsiv/okuduklarim` gibi) ayrı bir
   * bileşen değil, bu salonun o rafla açılmış hâli: film kanadında iki ayrı
   * bileşen tutmak süzgeç davranışının iki yerde ayrışmasına yol açmıştı.
   */
  initialShelf?: ShelfKey;
  /** Küratör modu anahtarını gösterir — yetki her istekte backend'de doğrulanır */
  isAdmin?: boolean;
}) {
  const t = useTranslations("book");
  const tStories = useTranslations("stories");
  const [shelf, setShelf] = useState<ShelfKey>(initialShelf);
  const [filters, setFilters] = useState<BookFilterState>(EMPTY_FILTERS);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [curating, setCurating] = useState(false);

  const { books, stats } = archive;

  // Sekme sayıları süzgeçten ETKİLENMEZ: "Okuduklarım 158" hep arşivin
  // gerçeği olsun, seçili türe göre değişip kafa karıştırmasın
  const shelfCounts = useMemo(() => {
    const counts = {} as Record<ShelfKey, number>;
    for (const key of SHELF_KEYS) {
      counts[key] = books.filter((book) => belongsTo(book, key)).length;
    }
    return counts;
  }, [books]);

  const visible = useMemo(
    () => applyFilters(books.filter((book) => belongsTo(book, shelf)), filters),
    [books, shelf, filters],
  );

  const shown = visible.slice(0, limit);
  const isEmpty = books.length === 0;

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

  return (
    <div data-category="kitap" className={styles.hall}>
      <div className={styles.layout}>
        {/* ---- Sol ray: süzgeçler ---- */}
        <aside className={styles.railLeft}>
          <div className={styles.railInner}>
            <h2 className={styles.railTitle}>{t("filters.title")}</h2>

            {archive.genres.length > 0 ? (
              <section className={styles.filterBlock}>
                <h3 className={styles.filterHead}>{t("filters.genre")}</h3>
                <ul className={styles.filterList}>
                  {archive.genres.slice(0, 12).map((genre) => (
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
                        <span className={styles.filterCount}>{genre.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className={styles.filterBlock}>
              <h3 className={styles.filterHead}>{t("filters.rating")}</h3>
              <ul className={styles.filterList}>
                {RATING_THRESHOLDS.map((item) => (
                  <li key={item.value}>
                    <button
                      type="button"
                      className={
                        filters.rating === item.value
                          ? styles.filterRowOn
                          : styles.filterRow
                      }
                      aria-pressed={filters.rating === item.value}
                      onClick={() =>
                        patch({
                          rating:
                            filters.rating === item.value ? null : item.value,
                        })
                      }
                    >
                      <span className={styles.filterStars}>
                        <Stars value={Number(item.value) * 2} />
                      </span>
                      <span className={styles.filterCount}>
                        {t("filters.ratingMin", { value: item.min.toFixed(1) })}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.filterBlock}>
              <h3 className={styles.filterHead}>{t("filters.year")}</h3>
              {/* İki sayı kutusu: kaydırıcı dokunmatikte yıl seçimini
                  imkânsızlaştırıyor, 1954 ile 1955 arasını tutturmak zor */}
              <div className={styles.yearRange}>
                <label className={styles.yearField}>
                  <span>{t("filters.yearFrom")}</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={filters.yearFrom ?? ""}
                    placeholder="1900"
                    onChange={(event) =>
                      patch({
                        yearFrom: event.target.value
                          ? Number.parseInt(event.target.value, 10)
                          : null,
                      })
                    }
                  />
                </label>
                <label className={styles.yearField}>
                  <span>{t("filters.yearTo")}</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={filters.yearTo ?? ""}
                    placeholder={String(new Date().getFullYear())}
                    onChange={(event) =>
                      patch({
                        yearTo: event.target.value
                          ? Number.parseInt(event.target.value, 10)
                          : null,
                      })
                    }
                  />
                </label>
              </div>
            </section>

            <section className={styles.filterBlock}>
              <h3 className={styles.filterHead}>{t("filters.pages")}</h3>
              <ul className={styles.filterList}>
                {PAGE_BUCKETS.map((bucket) => (
                  <li key={bucket.value}>
                    <button
                      type="button"
                      className={
                        filters.pages.includes(bucket.value)
                          ? styles.filterRowOn
                          : styles.filterRow
                      }
                      aria-pressed={filters.pages.includes(bucket.value)}
                      onClick={() =>
                        patch({
                          pages: toggleInList<PageBucket>(
                            filters.pages,
                            bucket.value,
                          ),
                        })
                      }
                    >
                      <span className={styles.filterLabel}>
                        {t(`filters.pageBucket.${bucket.value}`)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            {languages.length > 0 ? (
              <section className={styles.filterBlock}>
                <h3 className={styles.filterHead}>{t("filters.language")}</h3>
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
              </section>
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
          </div>
        </aside>

        {/* ---- Orta sütun ---- */}
        <main className={styles.column}>
          <header className={styles.head}>
            <Link href="/dark-stories/category/kitap" className={styles.back}>
              {tStories("backToUniverse", { name: hallName })}
            </Link>
            <span className={styles.eyebrow}>
              {t("hall", { num: hallLabel, name: hallName })}
            </span>
            <h1 className={styles.title}>{t("archiveTitle")}</h1>
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

          {/* Durum sekmeleri: raf sayfalarının kısayolu da onlar */}
          <nav className={styles.tabs}>
            {SHELF_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                className={shelf === key ? styles.tabOn : styles.tab}
                aria-pressed={shelf === key}
                onClick={() => {
                  setShelf(key);
                  setLimit(PAGE_SIZE);
                }}
              >
                <span className={styles.tabLabel}>{t(`shelf.${key}`)}</span>
                <span className={styles.tabCount}>{shelfCounts[key]}</span>
              </button>
            ))}
          </nav>

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

                <span className={styles.resultCount}>
                  {t("resultCount", { count: visible.length })}
                </span>
              </div>

              {visible.length === 0 ? (
                <p className={styles.empty}>{t("noMatch")}</p>
              ) : (
                <ul className={styles.grid}>
                  {shown.map((book) => (
                    <li key={book.id}>
                      <BookCard book={book} curating={curating} />
                    </li>
                  ))}
                </ul>
              )}

              {visible.length > shown.length ? (
                <div className={styles.loadMoreRow}>
                  <button
                    type="button"
                    className={styles.loadMore}
                    onClick={() => setLimit((value) => value + PAGE_SIZE)}
                  >
                    {t("loadMore")}
                  </button>
                </div>
              ) : null}

              {/* Seriler: Kadim Dünyalar'a bağlı olan kart evren sayfasına
                  açılır (kullanıcı isteği), bağlı olmayan seri kendi süzgecini
                  kurar */}
              {archive.series.length > 0 ? (
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
                            {series.coverImage ? (
                              <Image
                                src={series.coverImage}
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

              {archive.authors.length > 0 ? (
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

            {/* Yıllık hedef halkası; hedef kurulmamışsa küratöre kurma yolu */}
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
                          {book.coverImage ? (
                            <Image
                              src={book.coverImage}
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
                <Link href={shelfHref("read")} className={styles.railLink}>
                  {t("showAll")}
                </Link>
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
  const percent = target > 0 ? Math.min(100, Math.round((done / target) * 100)) : 0;
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

function languageName(
  code: string,
  t: (key: string) => string,
): string {
  return KNOWN_LANGUAGES.includes(code)
    ? t(`languageName.${code}`)
    : code.toLocaleUpperCase("tr");
}
