"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl, isLocalUpload } from "@/lib/api/client";
import type {
  BookPersonPage,
  BookPublisherPage,
  BookSeriesPage,
} from "@/lib/api/types";
import { BookCard } from "./BookCard";
import { awardHref } from "./AwardHall";
import styles from "./PersonHall.module.css";

/**
 * Yazar / çevirmen, yayınevi ve seri sayfaları.
 *
 * Üçü aynı dosyada çünkü aynı düzeni paylaşıyorlar: bir başlık bloğu ve
 * altında ilgili kitapların ızgarası. Ayrı bileşen olsalardı üç kopya CSS ve
 * üç kopya raf kodu olurdu.
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
    <div data-category="kitap" className={styles.page}>
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
              {/**
               * Portre artık `next/image` optimizasyonundan geçiyor — ÖLÇÜMLE
               * (2026-08-09). `unoptimized` verildiğinde `sizes` tamamen yok
               * sayılıyor: 84 px'lik madalyona 249–600 px'lik ham JPEG iniyordu.
               * Fotoğrafı backend bir kez indirip `/uploads/` altına kopyalıyor,
               * `next.config.ts` içindeki `remotePatterns` o yolu kapsıyor.
               *
               * ⚠️ Karar `apiUrl()`den GEÇMEMİŞ ham yoldan veriliyor:
               * `isLocalUpload` "/uploads/" önekine bakıyor, mutlak adres
               * verilirse her zaman `false` derdi (sessiz başarısızlık).
               *
               * `sizes`: `.portrait` sabit 84px, ≤640px'te 64px — vw yanlış olur.
               */}
              <Image
                src={photo}
                alt=""
                fill
                sizes="84px"
                className={styles.portraitImg}
                unoptimized={!isLocalUpload(person.photo)}
              />
            </span>
          ) : null}
          <div className={styles.identityText}>
            <h1 className={styles.title}>{person.name}</h1>
            {/* Roller kaynağın değil ARŞİVİN gerçeği: bu kişi senin
                arşivinde hangi rollerde geçiyorsa o yazıyor. Arşivde kaydı
                olmayan yazarda yalnızca ödül listesi rol kanıtlıyor, o da
                yoksa satır hiç çizilmiyor — uydurulmuyor */}
            {person.roles.length > 0 ? (
              <p className={styles.roles}>
                {person.roles
                  .map((role) => t(`person.role.${role}`))
                  .join(" · ")}
              </p>
            ) : null}
            <p className={styles.count}>
              {person.inArchive
                ? t("person.bookCount", { count: person.books.length })
                : t("person.notInArchive")}
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

      {/* Ödüller: okur buraya çoğunlukla ödül rafından geliyor. Arşivde kaydı
          olmayan yazarın sayfası bu olmadan yalnızca biyografiden ibaret
          kalırdı — bağlam orada kalsın */}
      {person.awards.length > 0 ? (
        <section className={styles.block}>
          <h2 className={styles.blockTitle}>{t("person.awardsTitle")}</h2>
          <ul className={styles.awardList}>
            {person.awards.map((award) => (
              <li key={`${award.key}-${award.year}-${award.title ?? ""}`}>
                <Link href={awardHref(award.key)} className={styles.awardRow}>
                  <span className={styles.awardYear}>{award.year}</span>
                  <span className={styles.awardName}>{award.name}</span>
                  {award.title ? (
                    <span className={styles.awardWork}>{award.title}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Kaynaktan çizilen sayfada boş raf bir eksiklik değil: o kişinin
          arşivde kitabı yok demek. Mesaj bunu açıkça söylüyor */}
      <BookShelf
        books={person.books}
        empty={
          person.inArchive ? t("person.noBooks") : t("person.noBooksInArchive")
        }
      />
    </div>
  );
}

/**
 * Seri sayfası (`/kitap/seri/zaman-carki`).
 *
 * Seri kartı eskiden arşivi seri adıyla **süzüyordu**; kullanıcı serinin kendi
 * sayfasını istedi. Ciltler sıraya dizili geliyor ve çevrilmemiş olanlar da
 * listede — serinin eksiğini görmek bu sayfanın asıl işi.
 */
export function SeriesPage({
  series,
  hallLabel,
  hallName,
}: {
  series: BookSeriesPage;
  hallLabel: string;
  hallName: string;
}) {
  const t = useTranslations("book");

  return (
    <div data-category="kitap" className={styles.page}>
      <header className={styles.head}>
        <Link href={KITAP_HREF} className={styles.back}>
          {t("person.backToHall")}
        </Link>
        <span className={styles.eyebrow}>
          {t("hall", { num: hallLabel, name: hallName })}
        </span>
        <h1 className={styles.title}>{series.name}</h1>
        <p className={styles.count}>
          {t("seriesCount", { count: series.count })}
          {series.readCount > 0 ? (
            <span className={styles.countSub}>
              {t("series.readCount", { count: series.readCount })}
            </span>
          ) : null}
        </p>
        {/* "5 kitaptan 3'ü Türkçe" — seri kartındaki satırın aynısı */}
        {series.untranslatedCount > 0 ? (
          <p className={styles.seriesTranslation}>
            {t("seriesTranslated", {
              translated: series.translatedCount,
              total: series.count,
            })}
          </p>
        ) : null}

        {series.description ? (
          <div className={styles.biography}>
            <p>{series.description}</p>
          </div>
        ) : null}

        {series.universeSlug ? (
          <Link
            href={`/dark-stories/${series.universeSlug}`}
            className={styles.universeLink}
          >
            {t("openUniverse")}
          </Link>
        ) : null}
      </header>

      <BookShelf books={series.books} empty={t("series.empty")} />
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
    <div data-category="kitap" className={styles.page}>
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
  /** Raf boşken yazılacak satır — kişi/seri sayfasında farklı anlama geliyor */
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
