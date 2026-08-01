"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import type {
  ArchiveBook,
  BookAuthorCard,
  BookSeriesCard,
} from "@/lib/api/types";
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

/**
 * Arşivde **olmayan** kitabın künye sayfası. Adres 1000Kitap'ın kendi
 * anahtarı ("oteki-isim--520400"); arşiv adresleriyle karışmasın diye ayrı
 * bir yol altında duruyor.
 */
export function sourceBookHref(slug: string): string {
  return `/dark-stories/category/kitap/kaynak/${slug}`;
}

/**
 * Yazar / çevirmen sayfası. Adres "kisi", "yazar" değil: aynı sayfa çevirmen
 * ve editör için de kullanılıyor.
 */
export function personHref(slug: string): string {
  return `/dark-stories/category/kitap/kisi/${slug}`;
}

/** Serinin kendi sayfası — ciltler sırayla, eksikleriyle birlikte. */
export function seriesHref(slug: string): string {
  return `/dark-stories/category/kitap/seri/${slug}`;
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
 * Yazar kartı. Salonun yazar panelinde ve yazarlar sayfasında **aynı** bileşen
 * kullanılıyor; iki kopya kart iki ayrı görünüme kayardı.
 *
 * İlişkisel kaydı olan yazar kendi sayfasına gider. Olmayan — Google/Open
 * Library'den eklenmiş ya da Faz 2a öncesi kitapların yazarı — sayfa açamaz
 * (404 verirdi): salonda arşivi o adla süzer, `onFilter` verilmeyen yerde ise
 * düz kart olarak durur.
 */
export function AuthorCard({
  author,
  onFilter,
}: {
  author: BookAuthorCard;
  onFilter?: (name: string) => void;
}) {
  const t = useTranslations("book");
  const photo = author.photo ? apiUrl(author.photo) : null;

  const body = (
    <>
      <span className={styles.authorPortrait}>
        {photo ? (
          <Image
            src={photo}
            alt=""
            fill
            sizes="56px"
            className={styles.authorPortraitImg}
            unoptimized
          />
        ) : (
          /* Portre henüz inmemiş yazar boş daire değil: baş harfleri duruyor
             (kapaksız kitapta adın kapağın yerini tutmasıyla aynı karar) */
          <span className={styles.authorMonogram} aria-hidden>
            {initials(author.name)}
          </span>
        )}
      </span>
      <span className={styles.authorText}>
        <span className={styles.authorName}>{author.name}</span>
        <span className={styles.authorMeta}>
          {t("authorCount", { count: author.count })}
        </span>
        {author.averageRating !== null ? (
          <span className={styles.authorRating}>
            <Stars value={author.averageRating} />
          </span>
        ) : null}
      </span>
    </>
  );

  if (author.slug) {
    return (
      <Link href={personHref(author.slug)} className={styles.authorCard}>
        {body}
      </Link>
    );
  }
  if (onFilter) {
    return (
      <button
        type="button"
        className={styles.authorCard}
        onClick={() => onFilter(author.name)}
      >
        {body}
      </button>
    );
  }
  return <span className={styles.authorCard}>{body}</span>;
}

/** Adın baş harfleri — portresi olmayan yazarın madalyonu. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toLocaleUpperCase("tr") ?? "")
    .join("");
}

/**
 * Seri kartı. Salonun seri şeridinde ve seriler sayfasında aynı bileşen.
 * Kart serinin **kendi sayfasına** gidiyor; Kadim Dünyalar bağı ayrı satır
 * olarak altında duruyor (iç içe bağ geçersiz HTML olurdu).
 */
export function SeriesCard({ series }: { series: BookSeriesCard }) {
  const t = useTranslations("book");
  const cover = coverSrc(series);

  return (
    <>
      <Link href={seriesHref(series.slug)} className={styles.seriesButton}>
        <span className={styles.seriesCover}>
          {cover ? (
            <Image
              src={cover}
              alt=""
              fill
              sizes="120px"
              className={styles.coverImg}
              unoptimized
            />
          ) : null}
        </span>
        <span className={styles.seriesName}>{series.name}</span>
        <span className={styles.seriesMeta}>
          {t("seriesCount", { count: series.count })}
        </span>
        {/* "5 kitaptan 3'ü Türkçe" — serinin eksiğini söyleyen tek satır */}
        {series.untranslatedCount > 0 ? (
          <span className={styles.seriesTranslation}>
            {t("seriesTranslated", {
              translated: series.translatedCount,
              total: series.count,
            })}
          </span>
        ) : null}
      </Link>
      {series.universeSlug ? (
        <Link
          href={`/dark-stories/${series.universeSlug}`}
          className={styles.seriesUniverse}
        >
          {t("openUniverse")}
        </Link>
      ) : null}
    </>
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
