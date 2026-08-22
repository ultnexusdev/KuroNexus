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
  bookHref,
  coverSrc,
  coverUnoptimized,
  SeriesCard,
  TranslationBadge,
} from "./BookCard";
import { AWARDS_HREF } from "@/lib/book/routes";
import styles from "./BookHall.module.css";
import { ArchiveUnavailable } from "@/components/hall/ArchiveUnavailable";

/**
 * Salon 05 · Kitap — "Kitap Arşivim".
 *
 * Düzen üç sütun (kullanıcı isteği: "her şeyi ortada birleştirmeyelim, tüm
 * alanı doldursun"): solda süzgeç rayı, ortada raflar, sağda okuma
 * istatistikleri.
 *
 * Ortadaki bölümler film salonundaki gibi **alt alta raflar** — sekme değil.
 * Ama film salonundan bir fark var: burası bir kitaplık. Her rafın altında
 * gerçek bir raf tahtası var ve ciltlerin sol kenarında sırt çizgisi duruyor.
 * Bir sinema salonunda afişler asılıdır, bir kitaplıkta ciltler **durur** —
 * salonun imzası bu.
 *
 * Ciltlerin boyu bir ara bilerek farklıydı (gerçek bir kitaplık gibi);
 * kullanıcı bunu düzensizlik olarak bildirdi ve raf hizalandı.
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
 * Salonda her raf tek sıra: rafa sığan cilt sayısı.
 *
 * 7'den 9'a çıkarıldı — geniş ekranda rafın sağı boş kalıyordu (kullanıcı
 * bildirimi). Sıradaki cilt sayısı CSS'teki sütun sayısıyla eşleşiyor.
 */
const SHELF_ROW = 9;

// Tek rafın kendi sayfasında ızgara kaç kitapla açılır
const PAGE_SIZE = 24;

/** Seri şeridi tek sıra; kalanı seriler sayfasında (kullanıcı isteği) */
const SERIES_LIMIT = 9;

/** Yazar paneli iki sıra (8 × 2); kalanı yazarlar sayfasında */
const AUTHOR_ROW = 16;

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
      <div className={styles.layout}>
        {/* ---- Sol ray: süzgeçler ---- */}
        <aside className={styles.railLeft}>
          <div className={styles.railInner}>
            <h2 className={styles.railTitle}>{t("filters.title")}</h2>

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
        <div className={styles.column}>
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

          {/* Gerekce FilmHall'da yazili */}
          {archive.unavailable ? (
            <ArchiveUnavailable />
          ) : isEmpty ? (
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
                    curating={isAdmin && curating}
                  />
                ))
              )}

              {/* Seriler: tek şerit, kalanı kendi sayfasında. Eskiden altı
                  seri gösterip kesiyordu ve kullanıcı yeni kurduğu serinin
                  görünmediğini bildirdi — artık kesildiği de söyleniyor */}
              {!shelf && archive.series.length > 0 ? (
                <section className={styles.block}>
                  <div className={styles.blockHead}>
                    <Link href={SERIES_HREF} className={styles.blockLink}>
                      <h2 className={styles.blockTitle}>{t("seriesTitle")}</h2>
                    </Link>
                    <span className={styles.blockCount}>
                      {t("seriesTotal", { count: archive.series.length })}
                    </span>
                  </div>
                  <ul className={styles.seriesRow}>
                    {archive.series.slice(0, SERIES_LIMIT).map((series) => (
                      <li key={series.slug} className={styles.seriesCard}>
                        <SeriesCard series={series} />
                      </li>
                    ))}
                  </ul>
                  {archive.series.length > SERIES_LIMIT ? (
                    <div className={styles.shelfFooter}>
                      <Link href={SERIES_HREF} className={styles.showAll}>
                        {t("showAll")}
                      </Link>
                    </div>
                  ) : null}
                </section>
              ) : null}

              {/* Yazarlar: iki sıra, kalanı kendi sayfasında. İlişkisel kaydı
                  olan yazar sayfasına gider; olmayan arşivi o adla süzer —
                  olmayan kişinin sayfası 404 verirdi */}
              {!shelf && archive.authors.length > 0 ? (
                <section className={styles.block}>
                  <div className={styles.blockHead}>
                    <Link href={AUTHORS_HREF} className={styles.blockLink}>
                      <h2 className={styles.blockTitle}>{t("authorsTitle")}</h2>
                    </Link>
                    <span className={styles.blockCount}>
                      {t("authorsTotal", { count: archive.authors.length })}
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
                  {archive.authors.length > AUTHOR_ROW ? (
                    <div className={styles.shelfFooter}>
                      <Link href={AUTHORS_HREF} className={styles.showAll}>
                        {t("showAll")}
                      </Link>
                    </div>
                  ) : null}
                </section>
              ) : null}
            </>
          )}
        </div>

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
                              /* Bu kutu her ekran genişliğinde SABİT 32px
                                 (`.recentCover`, BookHall.module.css:1162 —
                                 375/768/1280/1920'de ölçüldü, hepsinde 32).
                                 `unoptimized` yüzünden buraya 600px genişlikte
                                 JPEG iniyordu: ~19 kat genişlik, ~360 kat
                                 piksel. Arşivin en israflı noktası burasıydı. */
                              sizes="32px"
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
 * Bir raf. Ciltler ortak bir zemine basar ve altlarında bir raf tahtası
 * vardır — salonun imzası bu.
 *
 * **Hizalama CSS'te sabit** (kullanıcı isteği): kapak boyu her ciltte aynı ve
 * kitabın adı iki satıra kilitli. İkisi birlikte olmadan yetmiyordu — tek
 * satırlık adı olan cilt yazar satırını yukarı çekiyor, raf kayıyordu.
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
  /** Küratör modu: cildin altına silme/durum araçları iner */
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
                      /* `.volumes` ızgarası 3 / 5 / 9 kolon (640 ve 1100
                         kırılımları, BookHall.module.css:427-457). Kolon
                         sayısı ekranla arttığı için cilt sırtı her genişlikte
                         ~110–150 px bandında kalıyor — 375px'te 3 kolon ≈109,
                         1280'de 9 kolon ≈110, 1920'de ≈145. Sabit üst sınır
                         hem doğru hem de `vw` yazınca Next'in 211 px altındaki
                         basamakları elemesini önlüyor (bkz. `next.config.ts`). */
                      sizes="150px"
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

                {/* Küratör araçları rafta da: yanlışlıkla eklenen kitabı
                    silmek için raf alt sayfasına gitmek gerekiyordu — salon
                    rafları `BookCard` kullanmadığı için araçlar buraya hiç
                    inmiyordu (kullanıcı geri bildirimi) */}
                {curating ? <CuratorCardTools book={book} /> : null}
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
