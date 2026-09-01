import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl, isLocalUpload } from "@/lib/api/client";
import type {
  BookPersonRole,
  SourceBookCredit,
  SourceBookPage,
} from "@/lib/api/types";
import { BackToTop } from "@/components/BackToTop";
import {
  BOOK_HALL_HREF,
  bookHref,
  personHref,
  publisherHref,
} from "@/lib/book/routes";
import styles from "./SourceBook.module.css";

/**
 * Arşivde **olmayan** kitabın künye sayfası (`/kitap/kaynak/<slug>`).
 *
 * Ödül raflarındaki kartların gidecek bir yeri olsun diye var: liste 235
 * kitap, arşivde ise bir avuç — eskiden kartların neredeyse tamamı
 * tıklanmıyordu.
 *
 * Kitap sayfasının kopyası **değil** ve olmamalı: burada kişisel hiçbir şey
 * yok (puan, not, alıntı, okuma durumu), çünkü bu kitap okunmuş bir kitap
 * değil. Sayfa yalnızca künyeyi ve arka kapağı gösteriyor; arşive kayıt da
 * açmıyor. Bu ayrımın görünür olması için üstte bir bilgi şeridi duruyor.
 */


/**
/**
 * Künyedeki adlar. Bağ **yalnızca** o kişinin arşivde kaydı varsa kuruluyor;
 * yoksa düz metin — olmayan kişinin sayfası 404 verirdi. Kitap sayfasındaki
 * `CreditNames` ile aynı karar, tek farkı `slug`un burada null olabilmesi.
 */
function CreditNames({
  people,
  role,
  fallback,
}: {
  people: SourceBookCredit[];
  role: BookPersonRole;
  fallback: string | null;
}) {
  const matching = people.filter((person) => person.role === role);
  if (matching.length === 0) {
    return <>{fallback}</>;
  }
  return (
    <>
      {matching.map((person, index) => (
        <span key={`${person.name}-${index}`}>
          {index > 0 ? ", " : null}
          {person.slug ? (
            <Link href={personHref(person.slug)} className={styles.creditLink}>
              {person.name}
            </Link>
          ) : (
            person.name
          )}
        </span>
      ))}
    </>
  );
}

export function SourceBook({
  book,
  hallLabel,
  hallName,
}: {
  book: SourceBookPage;
  hallLabel: string;
  hallName: string;
}) {
  const t = useTranslations("book");
  const locale = useLocale();
  const cover = book.coverImage ? apiUrl(book.coverImage) : null;
  const hasAuthor = book.authors.length > 0 || book.people.length > 0;

  return (
    <div data-category="kitap" className={styles.page}>
      <header className={styles.head}>
        <Link href={BOOK_HALL_HREF} className={styles.back}>
          {t("person.backToHall")}
        </Link>
        <span className={styles.eyebrow}>
          {t("hall", { num: hallLabel, name: hallName })}
          <span className={styles.dot}>·</span>
          {t("source.eyebrow")}
        </span>

        <div className={styles.identity}>
          <span className={styles.coverFrame}>
            {cover ? (
              <Image
                src={cover}
                alt=""
                fill
                /* `.coverFrame` sabit 150px, ≤640px'te 108px — ikisi de sabit
                   px, o yüzden vw değil px yazılı (eski 40vw/180px kutudan
                   belirgin büyüktü) */
                sizes="(max-width: 640px) 108px, 150px"
                className={styles.coverImg}
                /**
                 * ÖLÇÜMLE koşullu (2026-08-09). Eski yorum "kapak kaynağın
                 * CDN'inden geliyor" diyordu; kural olarak doğru ama pratikte
                 * kapağı backend bir kez indirip `/uploads/books/` altına
                 * kopyalıyor ve `next.config.ts` içindeki `remotePatterns` o
                 * yolu kapsıyor. `unoptimized` verildiğinde `sizes` **tamamen
                 * yok sayılıyordu**: 150 px'lik kutuya 249–600 px'lik ham JPEG.
                 * Dışarıda kalan adres eskisi gibi ham iniyor.
                 *
                 * ⚠️ Karar `apiUrl()`den GEÇMEMİŞ ham yoldan veriliyor:
                 * `isLocalUpload` "/uploads/" önekine bakıyor, mutlak adres
                 * verilseydi her zaman `false` derdi (sessiz başarısızlık).
                 */
                unoptimized={!isLocalUpload(book.coverImage)}
              />
            ) : (
              <span className={styles.coverFallback}>{book.title}</span>
            )}
          </span>

          <div className={styles.identityText}>
            <h1 className={styles.title}>{book.title}</h1>
            {book.subtitle ? (
              <p className={styles.subtitle}>{book.subtitle}</p>
            ) : null}
            {book.originalTitle && book.originalTitle !== book.title ? (
              <p className={styles.originalTitle}>{book.originalTitle}</p>
            ) : null}
            {hasAuthor ? (
              <p className={styles.authors}>
                <CreditNames
                  people={book.people}
                  role="AUTHOR"
                  fallback={book.authors.join(", ")}
                />
              </p>
            ) : null}

            {/* Bu sayfanın ne OLMADIĞINI söyleyen şerit: okur ödül rafından
                geliyor ve buranın kendi arşivi olmadığını bilmeli */}
            {book.inArchive && book.archiveSlug ? (
              <p className={styles.archiveNote}>
                {t("source.inArchive")}{" "}
                <Link
                  href={bookHref(book.archiveSlug)}
                  className={styles.archiveLink}
                >
                  {t("source.openInArchive")}
                </Link>
              </p>
            ) : (
              <p className={styles.sourceNote}>{t("source.notInArchive")}</p>
            )}
          </div>
        </div>
      </header>

      {book.description ? (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("detail.synopsis")}</h2>
          <p className={styles.synopsis}>{book.description}</p>
        </section>
      ) : null}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t("detail.dossier")}</h2>
        <dl className={styles.dossierList}>
          {hasAuthor ? (
            <div>
              <dt>{t("detail.author")}</dt>
              <dd>
                <CreditNames
                  people={book.people}
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
                  people={book.people}
                  role="TRANSLATOR"
                  fallback={book.translator}
                />
              </dd>
            </div>
          ) : null}
          {book.editor ? (
            <div>
              <dt>{t("source.editor")}</dt>
              <dd>
                <CreditNames
                  people={book.people}
                  role="EDITOR"
                  fallback={book.editor}
                />
              </dd>
            </div>
          ) : null}
          {book.publisher ? (
            <div>
              <dt>{t("detail.publisher")}</dt>
              <dd>
                {book.publisherSlug ? (
                  <Link
                    href={publisherHref(book.publisherSlug)}
                    className={styles.creditLink}
                  >
                    {book.publisher}
                  </Link>
                ) : (
                  book.publisher
                )}
              </dd>
            </div>
          ) : null}
          {book.seriesName ? (
            <div>
              <dt>{t("detail.series")}</dt>
              <dd>
                {book.seriesIndex
                  ? t("seriesVolume", {
                      name: book.seriesName,
                      index: book.seriesIndex,
                    })
                  : book.seriesName}
              </dd>
            </div>
          ) : null}
          {book.firstPublishedYear ? (
            <div>
              <dt>{t("detail.firstPublished")}</dt>
              <dd>{book.firstPublishedYear}</dd>
            </div>
          ) : null}
          {book.publishedYear ? (
            <div>
              <dt>{t("detail.edition")}</dt>
              <dd>{book.publishedYear}</dd>
            </div>
          ) : null}
          {book.pageCount ? (
            <div>
              <dt>{t("detail.pages")}</dt>
              <dd>{t("pageCount", { count: book.pageCount })}</dd>
            </div>
          ) : null}
          {book.language ? (
            <div>
              <dt>{t("source.language")}</dt>
              <dd>{languageName(book.language, locale)}</dd>
            </div>
          ) : null}
          {book.isbn13 ? (
            <div>
              <dt>{t("detail.isbn")}</dt>
              <dd>{book.isbn13}</dd>
            </div>
          ) : null}
          {book.genres.length > 0 ? (
            <div>
              <dt>{t("source.genres")}</dt>
              <dd>{book.genres.join(", ")}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      <BackToTop />
    </div>
  );
}

/** Dil kodunu okunur ada çevirir; tarayıcı bilmiyorsa kod kalır (film
    kanadındaki `MovieDetail` ile aynı yardımcı). */
function languageName(code: string, locale: string): string {
  try {
    return (
      new Intl.DisplayNames([locale], { type: "language" }).of(code) ?? code
    );
  } catch {
    return code;
  }
}
