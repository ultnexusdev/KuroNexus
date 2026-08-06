"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type {
  ArchiveBook,
  BookCreditPerson,
  BookDetail as BookDetailData,
  BookLinkKind,
  BookPersonRole,
} from "@/lib/api/types";
import { Cover, Stars, TranslationBadge, bookHref, coverSrc } from "./BookCard";
import styles from "./BookDetail.module.css";

export function personHref(slug: string): string {
  return `/dark-stories/category/kitap/kisi/${slug}`;
}

export function publisherHref(slug: string): string {
  return `/dark-stories/category/kitap/yayinevi/${slug}`;
}

/**
 * Künyedeki adları **bağ olarak** çizer; ilişkisi olmayan kayıtta düz metne
 * düşer.
 *
 * Neden iki yol birden: Google/Open Library'den eklenmiş ya da ilişkisel
 * künye gelmeden önce kaydedilmiş kitaplarda yalnızca düz metin var. Bağ
 * zorlansaydı o kitapların yazarı hiç görünmezdi; düz metinde kalınsaydı da
 * 1000Kitap'tan gelen kayıtların yazar sayfası açılamazdı.
 */
function CreditNames({
  people,
  role,
  fallback,
}: {
  people: BookCreditPerson[];
  role: BookPersonRole;
  fallback: string;
}) {
  const linked = people.filter((person) => person.role === role);
  if (linked.length === 0) {
    return <>{fallback}</>;
  }
  return (
    <>
      {linked.map((person, index) => (
        <span key={person.slug}>
          {index > 0 ? ", " : null}
          <Link href={personHref(person.slug)} className={styles.creditLink}>
            {person.name}
          </Link>
        </span>
      ))}
    </>
  );
}

/**
 * Kitap sayfası.
 *
 * Düzen film sayfasıyla aynı ruhta iki sütun: solda kitabın kendisi (künye,
 * kendi notun, alıntılar), sağda sabit kalan bir ray (seri, komşular, dış
 * bağlantılar, evren). Dar ekranda ray içeriğin altına iniyor.
 *
 * Sayfanın üstünde backdrop yok: kitabın geniş sahne görseli diye bir şey yok
 * ve kapağı bulanıklaştırıp arkaya sermek her kitapta çirkin duruyordu —
 * onun yerine kapak büyük ve keskin duruyor.
 */

const CuratorDossier = dynamic(
  () => import("./BookCurator").then((mod) => mod.DossierEditor),
  { ssr: false },
);
const QuoteEditor = dynamic(
  () => import("./BookCurator").then((mod) => mod.QuoteEditor),
  { ssr: false },
);
const ProgressTools = dynamic(
  () => import("./BookCurator").then((mod) => mod.ProgressTools),
  { ssr: false },
);

const LINK_ICONS: Record<BookLinkKind, string> = {
  GOODREADS: "📕",
  GOOGLE_BOOKS: "🔎",
  OPEN_LIBRARY: "🏛️",
  DR: "🛒",
  IDEFIX: "🛒",
  OFFICIAL: "🌐",
};

export function BookDetail({
  detail,
  isAdmin = false,
}: {
  detail: BookDetailData;
  isAdmin?: boolean;
}) {
  const t = useTranslations("book");
  const locale = useLocale();
  const [curating, setCurating] = useState(false);
  const { book } = detail;
  const editing = isAdmin && curating;
  const showProgress = book.status === "READING" && book.progress !== null;

  return (
    <div data-category="kitap" className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.topBar}>
          <Link href="/dark-stories/category/kitap/arsiv" className={styles.back}>
            {t("backToArchive")}
          </Link>

          {isAdmin ? (
            <button
              type="button"
              className={curating ? styles.curatorOn : styles.curatorOff}
              aria-pressed={curating}
              onClick={() => setCurating((value) => !value)}
            >
              {curating ? t("curator.off") : t("curator.on")}
            </button>
          ) : null}
        </div>

        <header className={styles.head}>
          <div className={styles.coverFrame}>
            <Cover book={book} sizes="220px" />
            <TranslationBadge book={book} />
          </div>

          <div className={styles.headText}>
            <h1 className={styles.title}>{book.title}</h1>
            {book.originalTitle && book.originalTitle !== book.title ? (
              <p className={styles.originalTitle}>{book.originalTitle}</p>
            ) : null}

            {book.authors.length > 0 || book.credits.people.length > 0 ? (
              <p className={styles.authors}>
                <CreditNames
                  people={book.credits.people}
                  role="AUTHOR"
                  fallback={book.authors.join(", ")}
                />
              </p>
            ) : null}

            <div className={styles.badges}>
              <span className={styles.status}>
                {t(`statusName.${book.status}`)}
              </span>
              {book.isFavorite ? (
                <span className={styles.favorite}>★ {t("favorite")}</span>
              ) : null}
              {book.seriesName ? (
                <span className={styles.seriesBadge}>
                  {book.seriesIndex !== null
                    ? t("seriesVolume", {
                        name: book.seriesName,
                        index: book.seriesIndex,
                      })
                    : book.seriesName}
                </span>
              ) : null}
              {/* Okuma sırası bağı: bu kitap bir evrenin yolunda kaçıncı
                  durak. Rozet tıklanabilir — okur oradan yolun tamamını
                  görebilsin (kullanıcı isteği) */}
              {detail.readingOrders.map((entry) => (
                <Link
                  key={entry.key}
                  href={`/dark-stories/category/kitap/okuma-sirasi/${entry.key}`}
                  className={styles.orderBadge}
                >
                  {t("detail.readingOrderStop", {
                    name: entry.name,
                    order: entry.order,
                    total: entry.total,
                  })}
                </Link>
              ))}
            </div>

            {book.personalRating !== null ? (
              <p className={styles.rating}>
                <Stars value={book.personalRating} />
                <span className={styles.ratingValue}>
                  {book.personalRating.toFixed(1)}
                </span>
                <span className={styles.ratingLabel}>{t("detail.myScore")}</span>
              </p>
            ) : null}

            {/* "Nerede kaldım" — okunan kitabın en çok bakılan satırı */}
            {showProgress ? (
              <div className={styles.progress}>
                <span className={styles.progressBar} aria-hidden>
                  <span
                    className={styles.progressFill}
                    style={{ width: `${book.progress}%` }}
                  />
                </span>
                <span className={styles.progressText}>
                  {t("pageOf", {
                    current: book.currentPage,
                    total: book.pageCount ?? 0,
                  })}
                </span>
              </div>
            ) : null}

            {editing ? <ProgressTools book={book} /> : null}

            {book.personalNote ? (
              <p className={styles.note}>{book.personalNote}</p>
            ) : null}
          </div>
        </header>

        <div className={styles.columns}>
          <div className={styles.main}>
            {book.description ? (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t("detail.synopsis")}</h2>
                {/* Google Books açıklaması düz metin istendi ama yine de
                    HTML etiketi içerebiliyor */}
                <p className={styles.synopsis}>
                  {book.description.replace(/<[^>]+>/g, " ")}
                </p>
              </section>
            ) : null}

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t("detail.dossier")}</h2>
              <dl className={styles.dossierList}>
                {book.authors.length > 0 || book.credits.people.length > 0 ? (
                  <div>
                    <dt>{t("detail.author")}</dt>
                    <dd>
                      <CreditNames
                        people={book.credits.people}
                        role="AUTHOR"
                        fallback={book.authors.join(", ")}
                      />
                    </dd>
                  </div>
                ) : null}
                {book.translator ? (
                  <div>
                    <dt>{t("detail.translator")}</dt>
                    <dd>
                      <CreditNames
                        people={book.credits.people}
                        role="TRANSLATOR"
                        fallback={book.translator}
                      />
                    </dd>
                  </div>
                ) : null}
                {book.publisher ? (
                  <div>
                    <dt>{t("detail.publisher")}</dt>
                    <dd>
                      {book.credits.publisher ? (
                        <Link
                          href={publisherHref(book.credits.publisher.slug)}
                          className={styles.creditLink}
                        >
                          {book.credits.publisher.name}
                        </Link>
                      ) : (
                        book.publisher
                      )}
                    </dd>
                  </div>
                ) : null}
                {book.isbn13 ? (
                  <div>
                    <dt>{t("detail.isbn")}</dt>
                    <dd>{book.isbn13}</dd>
                  </div>
                ) : null}
                {book.pageCount ? (
                  <div>
                    <dt>{t("detail.pages")}</dt>
                    <dd>{t("pageCount", { count: book.pageCount })}</dd>
                  </div>
                ) : null}
                {book.seriesName ? (
                  <div>
                    <dt>{t("detail.series")}</dt>
                    <dd>{book.seriesName}</dd>
                  </div>
                ) : null}
                {book.seriesIndex !== null ? (
                  <div>
                    <dt>{t("detail.seriesIndex")}</dt>
                    <dd>{book.seriesIndex}</dd>
                  </div>
                ) : null}
                {book.firstPublishedYear ? (
                  <div>
                    <dt>{t("detail.firstPublished")}</dt>
                    <dd>{book.firstPublishedYear}</dd>
                  </div>
                ) : null}
                {book.publishedYear &&
                book.publishedYear !== book.firstPublishedYear ? (
                  <div>
                    <dt>{t("detail.edition")}</dt>
                    <dd>{book.publishedYear}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>{t("detail.translationState")}</dt>
                  <dd>{t(`translation.${book.translationState}`)}</dd>
                </div>
                {book.finishedAt ? (
                  <div>
                    <dt>{t("detail.finishedAt")}</dt>
                    <dd>{formatDate(book.finishedAt, locale)}</dd>
                  </div>
                ) : null}
              </dl>

              {book.genres.length > 0 ? (
                <p className={styles.genres}>{book.genres.join(" · ")}</p>
              ) : null}
            </section>

            {editing ? (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t("detail.editTitle")}</h2>
                <p className={styles.sectionLede}>{t("detail.editLede")}</p>
                <CuratorDossier book={book} />
              </section>
            ) : null}

            {/* Favori alıntılar: sayfa numarasıyla, bağlamıyla */}
            {detail.quotes.length > 0 || editing ? (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t("detail.quotes")}</h2>
                {detail.quotes.length > 0 ? (
                  <ul className={styles.quoteList}>
                    {detail.quotes.map((quote) => (
                      <li key={quote.id} className={styles.quote}>
                        <blockquote className={styles.quoteText}>
                          {quote.text}
                        </blockquote>
                        <p className={styles.quoteMeta}>
                          {quote.page ? (
                            <span>{t("quotePage", { page: quote.page })}</span>
                          ) : null}
                          {quote.context ? <span>{quote.context}</span> : null}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.muted}>{t("detail.noQuotes")}</p>
                )}
                {editing ? (
                  <QuoteEditor entryId={book.id} quotes={detail.quotes} />
                ) : null}
              </section>
            ) : null}

            {/* Serinin tamamı: çevrilmemiş ciltler de burada, soluk ve rozetli */}
            {detail.series.length > 1 ? (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  {t("detail.seriesTitle", { name: detail.seriesName ?? "" })}
                </h2>
                <ol className={styles.seriesList}>
                  {detail.series.map((volume) => (
                    <li
                      key={volume.id}
                      className={
                        volume.id === book.id
                          ? styles.seriesRowCurrent
                          : styles.seriesRow
                      }
                    >
                      <span className={styles.seriesIndex}>
                        {volume.seriesIndex ?? "—"}
                      </span>
                      <Link
                        href={bookHref(volume)}
                        className={styles.seriesLink}
                      >
                        {volume.title}
                      </Link>
                      <span className={styles.seriesState}>
                        {volume.translationState === "UNTRANSLATED" ||
                        volume.translationState === "IN_PROGRESS"
                          ? t(`translation.${volume.translationState}`)
                          : t(`statusName.${volume.status}`)}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
          </div>

          <aside className={styles.rail}>
            {detail.universe ? (
              <section className={styles.railBlock}>
                <h2 className={styles.railTitle}>{t("detail.universe")}</h2>
                <Link
                  href={`/dark-stories/${detail.universe.slug}`}
                  className={styles.universeLink}
                >
                  {detail.universe.name}
                </Link>
              </section>
            ) : null}

            {detail.links.length > 0 ? (
              <section className={styles.railBlock}>
                <h2 className={styles.railTitle}>{t("detail.links")}</h2>
                <ul className={styles.linkList}>
                  {detail.links.map((link) => (
                    <li key={link.kind}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.linkRow}
                      >
                        <span aria-hidden>{LINK_ICONS[link.kind]}</span>
                        <span>{t(`detail.linkName.${link.kind}`)}</span>
                        {/* Adres kitabın kendisine değil aramaya gidiyorsa
                            söylenir — tıklayan boşa gitmesin */}
                        {link.isSearch ? (
                          <span className={styles.searchMark}>
                            {t("detail.searchLink")}
                          </span>
                        ) : null}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {detail.byAuthor.length > 0 ? (
              <NeighbourBlock
                title={t("detail.byAuthor")}
                books={detail.byAuthor}
              />
            ) : null}

            {detail.byGenre.length > 0 ? (
              <NeighbourBlock
                title={t("detail.byGenre")}
                books={detail.byGenre}
              />
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}

/** Sağ raydaki komşu listeleri — aynı yazardan ve aynı türden. */
function NeighbourBlock({
  title,
  books,
}: {
  title: string;
  books: ArchiveBook[];
}) {
  return (
    <section className={styles.railBlock}>
      <h2 className={styles.railTitle}>{title}</h2>
      <ul className={styles.neighbourList}>
        {books.map((book) => (
          <li key={book.id}>
            <Link href={bookHref(book)} className={styles.neighbourRow}>
              <span className={styles.neighbourCover}>
                {coverSrc(book) ? (
                  <Image
                    src={coverSrc(book)!}
                    alt=""
                    fill
                    sizes="40px"
                    className={styles.neighbourImg}
                    unoptimized
                  />
                ) : null}
              </span>
              <span className={styles.neighbourText}>
                <span className={styles.neighbourTitle}>{book.title}</span>
                <span className={styles.neighbourAuthor}>
                  {book.authors[0] ?? ""}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function formatDate(value: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
      new Date(value),
    );
  } catch {
    // Geçersiz tarih sayfayı düşürmesin
    return value.slice(0, 10);
  }
}
