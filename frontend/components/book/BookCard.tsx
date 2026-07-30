"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import type { ArchiveBook } from "@/lib/api/types";
import styles from "./BookHall.module.css";

/**
 * Kapak adresi. Google Books ve Open Library mutlak adres veriyor; küratörün
 * yüklediği görsel ise `/uploads/…` göreli yoluyla geliyor ve onun kendi
 * sunucumuza bağlanması gerekiyor. `apiUrl` mutlak adrese dokunmadan geçirir,
 * o yüzden ikisi de aynı yoldan çizilebiliyor.
 */
export function coverSrc(book: {
  coverImage: string | null;
}): string | null {
  return book.coverImage ? apiUrl(book.coverImage) : null;
}

// Salon sayfası ve raf sayfaları aynı kartı kullanır — tek yerde durur
const CuratorCardTools = dynamic(
  () => import("./BookCurator").then((mod) => mod.CuratorCardTools),
  { ssr: false },
);

export function bookHref(book: ArchiveBook): string {
  return `/dark-stories/category/kitap/${book.slug}`;
}

export function Cover({
  book,
  sizes,
}: {
  book: ArchiveBook;
  sizes: string;
}) {
  const src = coverSrc(book);
  if (!src) {
    // Kapağı olmayan kitap: kapağın yerini adın kendisi tutar (boş kare değil)
    return (
      <span className={styles.coverFallback}>
        <span className={styles.coverFallbackTitle}>{book.title}</span>
        {book.authors[0] ? (
          <span className={styles.coverFallbackAuthor}>{book.authors[0]}</span>
        ) : null}
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      className={styles.coverImg}
      unoptimized
    />
  );
}

/**
 * Çeviri rozeti. Yalnızca "henüz çevrilmedi" ve "çevriliyor" durumlarında
 * çizilir: çevrilmiş kitaba rozet takmak arşivin tamamını rozetle doldururdu.
 */
export function TranslationBadge({ book }: { book: ArchiveBook }) {
  const t = useTranslations("book");
  if (
    book.translationState !== "UNTRANSLATED" &&
    book.translationState !== "IN_PROGRESS"
  ) {
    return null;
  }
  return (
    <span
      className={
        book.translationState === "UNTRANSLATED"
          ? styles.badgeUntranslated
          : styles.badgeInProgress
      }
    >
      {t(`translation.${book.translationState}`)}
    </span>
  );
}

export function BookCard({
  book,
  curating,
}: {
  book: ArchiveBook;
  curating: boolean;
}) {
  const t = useTranslations("book");
  const href = bookHref(book);
  // Okuma çubuğu yalnızca elde kalan kitapta: bitmiş kitapta %100 çubuk
  // gereksiz gürültü, sıradaki kitapta zaten sıfır
  const showProgress = book.status === "READING" && book.progress !== null;

  return (
    <article className={styles.card}>
      <Link href={href} className={styles.coverWrap}>
        <Cover
          book={book}
          sizes="(max-width: 640px) 40vw, (max-width: 1100px) 22vw, 12vw"
        />

        {/* Seri cildi kapağın köşesinde: "Zaman Çarkı 14" tek bakışta okunsun */}
        {book.seriesIndex !== null && book.seriesName ? (
          <span className={styles.seriesMark}>{book.seriesIndex}</span>
        ) : null}

        {book.isFavorite ? (
          <span className={styles.favoriteMark} aria-label={t("favorite")}>
            ★
          </span>
        ) : null}

        <TranslationBadge book={book} />

        {showProgress ? (
          <span className={styles.cardProgress} aria-hidden>
            <span
              className={styles.cardProgressFill}
              style={{ width: `${book.progress}%` }}
            />
          </span>
        ) : null}
      </Link>

      <h3 className={styles.cardTitle}>
        <Link href={href} className={styles.titleLink}>
          {book.title}
        </Link>
      </h3>
      {book.authors.length > 0 ? (
        <p className={styles.cardAuthor}>{book.authors.join(", ")}</p>
      ) : null}

      <p className={styles.cardMeta}>
        {book.personalRating !== null ? (
          <span className={styles.cardStars}>
            <Stars value={book.personalRating} />
            <span className={styles.cardRating}>
              {book.personalRating.toFixed(1)}
            </span>
          </span>
        ) : null}
        {showProgress ? (
          <span className={styles.cardPages}>
            {t("pageOf", {
              current: book.currentPage,
              total: book.pageCount ?? 0,
            })}
          </span>
        ) : null}
      </p>

      {curating ? <CuratorCardTools book={book} /> : null}
    </article>
  );
}

/**
 * On üzerinden puanı beş yıldıza indirir. Yarım yıldız yok: yarım karakteri
 * yazı tipine göre farklı genişlikte çiziliyor ve ızgara sallanıyordu —
 * sayısal değer zaten yıldızın yanında duruyor.
 */
export function Stars({ value }: { value: number }) {
  const filled = Math.round(value / 2);
  return (
    <span className={styles.stars} aria-hidden>
      {"★".repeat(filled)}
      <span className={styles.starsEmpty}>{"★".repeat(5 - filled)}</span>
    </span>
  );
}
