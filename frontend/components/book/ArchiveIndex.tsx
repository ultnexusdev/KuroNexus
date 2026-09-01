import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { BookAuthorCard, BookSeriesCard } from "@/lib/api/types";
import { BackToTop } from "@/components/BackToTop";
import { AuthorCard, SeriesCard } from "./BookCard";
import hall from "./BookHall.module.css";
import { BOOK_ARCHIVE_HREF } from "@/lib/book/routes";
import styles from "./ArchiveIndex.module.css";

/**
 * Arşivin iki dizin sayfası: **bütün yazarlar** ve **bütün seriler**.
 *
 * Salon her iki bölümü de kesiyor (yazarlar iki sıra, seriler bir şerit) ve
 * kullanıcı kesilenlerin nereye gittiğini soramaz hâldeydi — yeni kurduğu
 * serinin görünmediğini bildirdi. "Tümünü gör" artık buraya geliyor.
 *
 * İkisi aynı dosyada çünkü aynı iskeleti paylaşıyorlar: bir başlık ve altında
 * salondakiyle **aynı** kart bileşeninden bir ızgara. Kart bileşeni ortak
 * (`BookCard`), yani iki yerde iki ayrı görünüme kayamıyorlar.
 */


export function AuthorsPage({
  authors,
  hallLabel,
  hallName,
}: {
  authors: BookAuthorCard[];
  hallLabel: string;
  hallName: string;
}) {
  const t = useTranslations("book");

  return (
    <div data-category="kitap" className={styles.page}>
      <Head
        eyebrow={t("hall", { num: hallLabel, name: hallName })}
        title={t("authorsTitle")}
        count={t("authorsTotal", { count: authors.length })}
        back={t("backToArchive")}
      />

      {authors.length === 0 ? (
        <p className={styles.empty}>{t("emptyArchive")}</p>
      ) : (
        <ul className={hall.authorGrid}>
          {authors.map((author) => (
            <li key={author.name}>
              {/* Süzgeç yok: burası salon değil, dizin. İlişkisel kaydı
                  olmayan yazar düz kart olarak duruyor */}
              <AuthorCard author={author} />
            </li>
          ))}
        </ul>
      )}

      <BackToTop />
    </div>
  );
}

export function SeriesIndexPage({
  series,
  hallLabel,
  hallName,
}: {
  series: BookSeriesCard[];
  hallLabel: string;
  hallName: string;
}) {
  const t = useTranslations("book");

  return (
    <div data-category="kitap" className={styles.page}>
      <Head
        eyebrow={t("hall", { num: hallLabel, name: hallName })}
        title={t("seriesTitle")}
        count={t("seriesTotal", { count: series.length })}
        back={t("backToArchive")}
      />

      {series.length === 0 ? (
        <p className={styles.empty}>{t("emptyArchive")}</p>
      ) : (
        <ul className={hall.seriesRow}>
          {series.map((item) => (
            <li key={item.slug} className={hall.seriesCard}>
              <SeriesCard series={item} />
            </li>
          ))}
        </ul>
      )}

      <BackToTop />
    </div>
  );
}

function Head({
  eyebrow,
  title,
  count,
  back,
}: {
  eyebrow: string;
  title: string;
  count: string;
  back: string;
}) {
  return (
    <header className={styles.head}>
      <Link href={BOOK_ARCHIVE_HREF} className={styles.back}>
        {back}
      </Link>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.count}>{count}</p>
    </header>
  );
}
