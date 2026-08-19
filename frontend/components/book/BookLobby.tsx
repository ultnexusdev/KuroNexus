"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { BookListItem } from "@/lib/api/types";
import { bookHref, coverSrc, coverUnoptimized } from "./BookCard";
import { LOBBY_GLYPHS } from "./BookLobbyGlyphs";
import styles from "./BookLobby.module.css";

/**
 * Salon 05 · Kitap — salon girişi.
 *
 * İki yakalı editorial düzen: SOLDA salonun dizini (başlık + dört bölüm
 * levhası), SAĞDA **okuma masası** — elimdeki kitap bir kürsüde, altında
 * ilerleme çizgisi, altında da son eklenen ciltlerin rafı.
 *
 * Sayfanın imzası o masa: kapı görselinden gelen lamba huzmesi sayfanın
 * üstünden inip kürsünün üstüne düşüyor, kapak da ışığın içinde duruyor.
 * Gerisi bilinçli olarak sessiz (tek yerde cesaret).
 *
 * `LobbyBanner` bu salondan ÇIKARILDI: dar ekranda girişin çıplak kalmasını
 * engellemek için konmuştu, o boşluğu artık okuma masası gerçek içerikle
 * dolduruyor — bant orada kürsüyle yarışıyordu.
 *
 * İstemci bileşeni: kart yardımcıları (`coverSrc`, `bookHref`) `BookCard`ta
 * duruyor ve o dosya `"use client"`. Etkileşim gerektirmiyor, sunucuda
 * çiziliyor; hareketin tamamı CSS.
 */

/** `href` dolu olan bölüm tıklanabilir; boş olan "yakında" rozetiyle durur. */
const SECTIONS = [
  { key: "archive", href: "/dark-stories/category/kitap/arsiv" },
  { key: "awards", href: "/dark-stories/category/kitap/oduller" },
  { key: "readingOrders", href: "/dark-stories/category/kitap/okuma-sirasi" },
  { key: "notes", href: null },
] as const;

export interface LobbyQuote {
  text: string;
  /**
   * Alıntının kitabı. Arşivde işaretli alıntı yoksa salonun epigrafı
   * gösteriliyor ve onun künyesi metnin İÇİNDE ("… — Franz Kafka") — o
   * durumda bu iki alan null, künye satırı hiç çizilmez.
   */
  bookTitle: string | null;
  bookSlug: string | null;
}

export function BookLobby({
  hallLabel,
  hallName,
  reading,
  recent,
  quote,
}: {
  hallLabel: string;
  hallName: string;
  /** Elimdeki kitap; yoksa kürsü boş durur (uydurma kitap konmaz) */
  reading: BookListItem | null;
  /** Son eklenen ciltler — dört tane, elimdeki kitap ayıklanmış */
  recent: BookListItem[];
  /** Günün alıntısı; arşivde işaretli alıntı yoksa null → salon epigrafı */
  quote: LobbyQuote | null;
}) {
  const t = useTranslations("book");
  const tStories = useTranslations("stories");

  // Masa yalnızca gösterecek bir şey varsa çizilir; yoksa dizin tek başına
  // ortalanır (arşiv alınamadığında da bu dal çalışır, sayfa çökmez)
  const hasDesk = reading !== null || quote !== null;
  const hasShelf = recent.length > 0;

  return (
    <div
      data-category="kitap"
      className={styles.lobby}
      data-rail={hasDesk || hasShelf ? "on" : "off"}
    >
      <div className={styles.wall} aria-hidden>
        <Image
          src="/halls/kitap.svg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.wallImg}
        />
      </div>
      {/* Perde dokusu + tepeden inen okuma lambası: ikisi de saf CSS, kapak
          görselinin üstünde duruyor ve tıklamayı yemesin diye pointer'sız */}
      <div className={styles.drape} aria-hidden />
      <div className={styles.beam} aria-hidden />

      <div className={styles.inner}>
        <header className={styles.head}>
          <span className={styles.eyebrow}>
            {t("lobby.hallEyebrow", { num: hallLabel })}
          </span>
          <h1 className={styles.title}>{hallName}</h1>
          <Link href="/dark-stories" className={styles.back}>
            {tStories("backToList")}
          </Link>
          <span className={styles.rule} aria-hidden>
            <span className={styles.diamond}>❖</span>
          </span>
          <p className={styles.lede}>{t("lobbyLede")}</p>
        </header>

        {hasDesk ? (
          <section className={styles.desk} aria-labelledby="lobby-desk">
            <h2 id="lobby-desk" className={styles.railTitle}>
              {t("lobby.nowReading")}
            </h2>

            {reading ? (
              <ReadingLectern book={reading} />
            ) : (
              <p className={styles.deskEmpty}>{t("lobby.noneReading")}</p>
            )}

            {quote ? (
              <figure className={styles.quote}>
                <blockquote className={styles.quoteText}>
                  {quote.text}
                </blockquote>
                {quote.bookSlug && quote.bookTitle ? (
                  <figcaption className={styles.quoteFrom}>
                    <Link
                      href={`/dark-stories/category/kitap/${quote.bookSlug}`}
                      className={styles.quoteLink}
                    >
                      {quote.bookTitle}
                    </Link>
                  </figcaption>
                ) : null}
              </figure>
            ) : null}
          </section>
        ) : null}

        <nav className={styles.doors} aria-label={hallName}>
          {SECTIONS.map((section) => {
            const Glyph = LOBBY_GLYPHS[section.key];
            const body = (
              <>
                <span className={styles.plate} aria-hidden>
                  {Glyph ? <Glyph /> : null}
                </span>
                <span className={styles.doorText}>
                  <span className={styles.doorTitle}>
                    {t(`sections.${section.key}.title`)}
                  </span>
                  <span className={styles.doorDesc}>
                    {t(`sections.${section.key}.desc`)}
                  </span>
                </span>
              </>
            );

            return section.href ? (
              <Link
                key={section.key}
                href={section.href}
                className={styles.doorOpen}
              >
                {body}
                <span className={styles.enter}>{t("enter")}</span>
              </Link>
            ) : (
              <article key={section.key} className={styles.door}>
                {body}
                <span className={styles.soon}>{t("soon")}</span>
              </article>
            );
          })}
        </nav>

        {hasShelf ? (
          <section className={styles.shelf} aria-labelledby="lobby-shelf">
            <h2 id="lobby-shelf" className={styles.railTitle}>
              {t("recentTitle")}
            </h2>
            <ul className={styles.shelfRow}>
              {recent.map((book) => (
                <li key={book.id} className={styles.shelfItem}>
                  <Link href={bookHref(book)} className={styles.shelfLink}>
                    <span className={styles.shelfFrame}>
                      <span className={styles.shelfCover}>
                        <ShelfCover book={book} />
                      </span>
                    </span>
                    <span className={styles.ledge} aria-hidden />
                    <span className={styles.shelfTitle}>{book.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className={styles.note}>{t("note")}</p>
      </div>
    </div>
  );
}

/**
 * Okuma kürsüsü: ışık havuzunun içinde duran kapak, altında ilerleme.
 *
 * İlerleme çubuğu ELDEKİ değeri olduğu gibi çiziyor. Yüzde sıfırsa dolgu
 * görünmez ama **iğne** çubuğun başında durur: "başındayım" ile "hiç
 * başlamadım" ekranda ayırt edilebilsin diye (arşiv kartındaki çubuk yalnız
 * dolguyla çiziliyor, orada kapak zaten küçük).
 */
function ReadingLectern({ book }: { book: BookListItem }) {
  const t = useTranslations("book");
  const src = coverSrc(book);
  const percent = book.progress === null ? null : Math.round(book.progress);

  return (
    <div className={styles.lectern}>
      <span className={styles.lamp} aria-hidden />

      <Link href={bookHref(book)} className={styles.volume}>
        <span className={styles.volumeInner}>
          {src ? (
            <Image
              src={src}
              alt=""
              fill
              /* Kutu CSS'te clamp(148px, 42vw, 208px) — üst sınır 208,
                 retinada 2x için tek sabit istek yeterli. `vw` bilerek yok
                 (bkz. BookCard.tsx: yüzde görünce Next küçük basamakları
                 aday listesinden eliyor). */
              sizes="208px"
              className={styles.volumeImg}
              priority
              unoptimized={coverUnoptimized(book)}
            />
          ) : (
            <span className={styles.volumeFallback}>{book.title}</span>
          )}
          <span className={styles.spine} aria-hidden />
          <span className={styles.pages} aria-hidden />
        </span>
        <span className={styles.ribbon} aria-hidden />
      </Link>

      <span className={styles.shadow} aria-hidden />

      <p className={styles.volumeTitle}>
        <Link href={bookHref(book)} className={styles.volumeTitleLink}>
          {book.title}
        </Link>
      </p>
      {book.authors.length > 0 ? (
        <p className={styles.volumeAuthor}>{book.authors.join(", ")}</p>
      ) : null}

      {percent !== null ? (
        <div className={styles.progress}>
          <div className={styles.progressHead}>
            <span className={styles.progressLabel}>
              {t("lobby.progress", { percent })}
            </span>
            {book.pageCount ? (
              <span className={styles.progressPages}>
                {t("pageOf", {
                  current: book.currentPage,
                  total: book.pageCount,
                })}
              </span>
            ) : null}
          </div>
          <div
            className={styles.track}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-label={t("lobby.nowReading")}
          >
            <span
              className={styles.fill}
              style={{ width: `${percent}%` }}
              aria-hidden
            />
            <span
              className={styles.nib}
              style={{ left: `${percent}%` }}
              aria-hidden
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Raftaki cilt. Kapağı yoksa adı kapağın yerini tutar (arşivdeki karar). */
function ShelfCover({ book }: { book: BookListItem }) {
  const src = coverSrc(book);
  if (!src) {
    return <span className={styles.shelfFallback}>{book.title}</span>;
  }
  return (
    <Image
      src={src}
      alt=""
      fill
      /* Raf 420px altında 2, üstünde 4 kolon; kutu her iki durumda da
         ~92-132px bandında kalıyor, tek sabit üst sınır yetiyor. */
      sizes="132px"
      className={styles.shelfImg}
      unoptimized={coverUnoptimized(book)}
    />
  );
}
