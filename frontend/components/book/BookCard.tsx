"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl, isLocalUpload } from "@/lib/api/client";
// Kartlar künye metnini çizmiyor, o yüzden sözleşme `BookListItem`
// (bkz. `types.ts`). `ArchiveBook` bu tipe atanabilir olduğundan künye
// sayfası aynı kartları tam kayıtla kullanmaya devam ediyor.
import type {
  BookListItem,
  BookAuthorCard,
  BookSeriesCard,
} from "@/lib/api/types";
import { bookHref, personHref, seriesHref } from "@/lib/book/routes";
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

/**
 * Bu kapak `next/image` optimizasyonundan geçebilir mi? — ÖLÇÜMLE eklendi
 * (2026-08-09).
 *
 * Kitap kanadındaki her kapak `unoptimized` idi; gerekçe olarak "kapaklar
 * Google/Open Library gibi keyfi host'lardan geliyor" yazıyordu. Bu, kural
 * olarak doğru ama BU arşiv için değil: canlıdaki 253 kitabın 253'ünün de
 * kapağı `/uploads/books/` altında duruyor — `book-cover.service.ts` dış
 * adresi bir kez indirip bize kopyalıyor, tam da kapak linkleri ölmesin diye.
 * `next.config.ts` içindeki `remotePatterns` bu yolu zaten kapsıyor.
 *
 * Ham `unoptimized`ın ölçülen maliyeti (canlı, `okuduklarim` rafı, 1280 px):
 * kapaklar CSS'te **32 px** ve **124 px** genişlikte çiziliyor ama diskten
 * **249–600 px** genişlikte JPEG olarak iniyor. Ortanca fazlalık 12 kat
 * genişlik, en kötüsü 19 kat — piksel sayısında ~140–360 kat. Tek rafın
 * kapak yükü 1.69 MB.
 *
 * Karar `apiUrl`den GEÇMEMİŞ ham yoldan veriliyor: `isLocalUpload` "/uploads/"
 * önekine bakıyor, mutlak adres verilirse her zaman `false` derdi
 * (`CharacterSections.tsx`te aynı tuzak not düşülmüş).
 */
export function coverUnoptimized(book: {
  coverImage: string | null;
}): boolean {
  return !isLocalUpload(book.coverImage);
}

// Salon sayfası ve raf sayfaları aynı kartı kullanır — tek yerde durur
const CuratorCardTools = dynamic(
  () => import("./BookCurator").then((mod) => mod.CuratorCardTools),
  { ssr: false },
);


export function Cover({
  book,
  sizes,
}: {
  book: BookListItem;
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
      unoptimized={coverUnoptimized(book)}
    />
  );
}

/**
 * Çeviri rozeti. Yalnızca "henüz çevrilmedi" ve "çevriliyor" durumlarında
 * çizilir: çevrilmiş kitaba rozet takmak arşivin tamamını rozetle doldururdu.
 */
export function TranslationBadge({ book }: { book: BookListItem }) {
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
  book: BookListItem;
  curating: boolean;
}) {
  const t = useTranslations("book");
  const href = bookHref(book.slug);
  // Okuma çubuğu yalnızca elde kalan kitapta: bitmiş kitapta %100 çubuk
  // gereksiz gürültü, sıradaki kitapta zaten sıfır
  const showProgress = book.status === "READING" && book.progress !== null;

  return (
    <article className={styles.card}>
      {/* Kapak bağlantısı erişilebilirlik ağacında YOK: erişilebilir adı boştu
          (görselin alt=""), üstelik aşağıdaki başlık bağlantısıyla aynı yere
          gidiyor — ekran okuyucuya kart başına tek durak (2026-08-22 denetim). */}
      <Link href={href} className={styles.coverWrap} aria-hidden="true" tabIndex={-1}>
        {/* `sizes` CANLIDA ÖLÇÜLDÜ (2026-08-09), hesaplanmadı: `.coverWrap`
            kutusunun gerçek genişliği 375px'te 106, 768'de 135, 1280'de 128,
            1920'de 130 px. Kart ızgarası `repeat(auto-fill, minmax(126px,1fr))`
            olduğu için geniş ekranda kart BÜYÜMÜYOR, sayısı artıyor — eski
            "12vw" değeri 1920'de 230 px istiyordu, yani gerçeğin ~1.8 katı.

            Kutu her ekranda 106–135 px bandında kaldığı için tek sabit değer
            yetiyor. `vw` BİLEREK kullanılmadı: `sizes` içinde bir yüzde
            görünürse Next 211 px altındaki bütün basamakları aday listesinden
            eliyor ve 144'ü seçemez hâle geliyor (bkz. `next.config.ts`). */}
        <Cover book={book} sizes="136px" />

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

        {/* Hover/odakta kapağa inen "İncele" örtüsü (2026-08-30 tasarımı) */}
        <span className={styles.inspect} aria-hidden>
          <span className={styles.inspectChip}>{t("inspect")}</span>
        </span>
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
            /* `.authorPortrait` CSS'te sabit 42px (BookHall.module.css:1008);
               "56px" bu kutunun üstünde bir istekti. Karar `apiUrl`den
               geçmemiş HAM yoldan veriliyor — mutlak adres verilseydi
               `isLocalUpload` her zaman false derdi. */
            sizes="42px"
            className={styles.authorPortraitImg}
            unoptimized={!isLocalUpload(author.photo)}
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
              /* `.seriesRow` ızgarası 3 / 5 / 9 kolon (640 ve 1100
                 kırılımları, BookHall.module.css:858-877). Kolon sayısı
                 ekranla birlikte arttığı için kutu ~110–150 px bandında
                 kalıyor; tek sabit üst sınır yetiyor ve `vw` yazmanın
                 basamak eleme cezasından kaçınıyor (bkz. `next.config.ts`). */
              sizes="150px"
              className={styles.coverImg}
              unoptimized={coverUnoptimized(series)}
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
