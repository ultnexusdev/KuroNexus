"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import type { BookPersonPage, BookPublisherPage } from "@/lib/api/types";
import { BookCard } from "./BookCard";
import styles from "./PersonHall.module.css";

/**
 * Yazar / çevirmen ve yayınevi sayfaları.
 *
 * İkisi aynı dosyada çünkü aynı düzeni paylaşıyorlar: bir başlık ve altında
 * o kişiye/yayınevine ait kitapların rafı. Ayrı bileşen olsalardı iki kopya
 * CSS ve iki kopya raf kodu olurdu.
 *
 * Biyografi ve fotoğraf backend'de kaynaktan bir kez çekilip saklanıyor;
 * gelmezse sayfa onlarsız çiziliyor — kişi ve kitapları zaten bizde (kural 4).
 */

const KITAP_HREF = "/dark-stories/category/kitap";

export function PersonPage({
  person,
  hallLabel,
  hallName,
}: {
  person: BookPersonPage;
  hallLabel: string;
  hallName: string;
}) {
  const t = useTranslations("book");
  const photo = person.photo ? apiUrl(person.photo) : null;

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <Link href={KITAP_HREF} className={styles.back}>
          {t("person.backToHall")}
        </Link>
        <span className={styles.eyebrow}>
          {t("hall", { num: hallLabel, name: hallName })}
        </span>

        <div className={styles.identity}>
          {photo ? (
            <span className={styles.portrait}>
              <Image
                src={photo}
                alt=""
                fill
                sizes="120px"
                className={styles.portraitImg}
                unoptimized
              />
            </span>
          ) : null}
          <div className={styles.identityText}>
            <h1 className={styles.title}>{person.name}</h1>
            {/* Roller kaynağın değil ARŞİVİN gerçeği: bu kişi senin
                arşivinde hangi rollerde geçiyorsa o yazıyor */}
            <p className={styles.roles}>
              {person.roles.map((role) => t(`person.role.${role}`)).join(" · ")}
            </p>
            <p className={styles.count}>
              {t("person.bookCount", { count: person.books.length })}
            </p>
          </div>
        </div>

        {person.biography ? (
          <div className={styles.biography}>
            {person.biography.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : null}
      </header>

      <BookShelf books={person.books} empty={t("person.noBooks")} />
    </div>
  );
}

export function PublisherPage({
  publisher,
  hallLabel,
  hallName,
}: {
  publisher: BookPublisherPage;
  hallLabel: string;
  hallName: string;
}) {
  const t = useTranslations("book");

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <Link href={KITAP_HREF} className={styles.back}>
          {t("person.backToHall")}
        </Link>
        <span className={styles.eyebrow}>
          {t("hall", { num: hallLabel, name: hallName })}
        </span>
        <h1 className={styles.title}>{publisher.name}</h1>
        <p className={styles.count}>
          {t("person.bookCount", { count: publisher.books.length })}
        </p>
      </header>

      <BookShelf books={publisher.books} empty={t("person.noBooks")} />
    </div>
  );
}

function BookShelf({
  books,
  empty,
}: {
  books: BookPersonPage["books"];
  empty: string;
}) {
  if (books.length === 0) {
    return <p className={styles.empty}>{empty}</p>;
  }
  return (
    <ul className={styles.grid}>
      {books.map((book) => (
        <li key={book.id}>
          {/* Küratör araçları burada kapalı: yazar sayfası okuma sayfası,
              düzenleme salonda ve kitap sayfasında yapılıyor */}
          <BookCard book={book} curating={false} />
        </li>
      ))}
    </ul>
  );
}
