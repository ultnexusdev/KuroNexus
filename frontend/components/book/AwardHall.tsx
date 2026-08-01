"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import type { AwardDetail, AwardSummary, AwardWinnerCard } from "@/lib/api/types";
import { BackToTop } from "@/components/BackToTop";
import { sourceBookHref } from "./BookCard";
import styles from "./AwardHall.module.css";

/**
 * Salon 05 · Kitap — Ödüller (Faz B).
 *
 * İki görünüm, tek dosya: ödüllerin listesi (`AwardHall`) ve tek bir ödülün
 * rafı (`AwardShelf`). Ayrı bileşen değiller çünkü kart, rozet ve boş çerçeve
 * mantığı ikisinde de aynı.
 *
 * **Kapak gelmemesi normaldir.** Eşleşme backend'de arka planda doluyor
 * (`awards.service.ts`); ilk açılışta ciltlerin çoğu kapaksız gelir, ikinci
 * açılışta yerine oturur. Bu yüzden kapaksız kart bir hata hâli değil,
 * beklenen bir hâl — arşivdeki kapaksız kitapla aynı boş çerçeve çiziliyor.
 */

/** Ödül sayfasının kendi adresi; iki görünüm de buradan kuruluyor. */
export function awardHref(key: string): string {
  return `/dark-stories/category/kitap/oduller/${key}`;
}

export const AWARDS_HREF = "/dark-stories/category/kitap/oduller";

function coverFor(cover: string | null): string | null {
  return cover ? apiUrl(cover) : null;
}

/** Ödül listesi: her ödül bir kart, arşiv payı çubukla gösteriliyor. */
export function AwardHall({
  awards,
  hallLabel,
  hallName,
}: {
  awards: AwardSummary[];
  hallLabel: string;
  hallName: string;
}) {
  const t = useTranslations("book");

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <Link href="/dark-stories/category/kitap/arsiv" className={styles.back}>
          {t("backToArchive")}
        </Link>
        <span className={styles.eyebrow}>
          {t("hall", { num: hallLabel, name: hallName })}
        </span>
        <h1 className={styles.title}>{t("awards.title")}</h1>
        <p className={styles.epigraph}>{t("awards.lede")}</p>
      </header>

      {awards.length === 0 ? (
        <p className={styles.empty}>{t("awards.unavailable")}</p>
      ) : (
        <ul className={styles.awardList}>
          {awards.map((award) => {
            const cover = coverFor(award.coverImage);
            // Sıfıra bölme: liste boş gelirse çubuk çizilmesin
            const ratio =
              award.total > 0 ? (award.inArchive / award.total) * 100 : 0;
            return (
              <li key={award.key} className={styles.awardItem}>
                <Link href={awardHref(award.key)} className={styles.awardCard}>
                  <span className={styles.awardCover}>
                    {cover ? (
                      <Image
                        src={cover}
                        alt=""
                        fill
                        sizes="84px"
                        className={styles.awardCoverImg}
                        /* Kapaklar Google/Open Library gibi keyfi host'lardan
                           geliyor; kitap kanadında da bu yüzden optimize
                           edilmiyor (bkz. BookCard.Cover) */
                        unoptimized
                      />
                    ) : (
                      <span className={styles.awardCoverEmpty} aria-hidden />
                    )}
                  </span>

                  <span className={styles.awardBody}>
                    <span className={styles.awardName}>{award.name}</span>
                    <span className={styles.awardBlurb}>{award.blurb}</span>

                    <span className={styles.awardMeter}>
                      <span
                        className={styles.awardMeterFill}
                        style={{ width: `${ratio}%` }}
                      />
                    </span>
                    <span className={styles.awardCount}>
                      {t("awards.owned", {
                        owned: award.inArchive,
                        total: award.total,
                      })}
                    </span>
                    <span className={styles.awardCoverage}>
                      {t("awards.coverage", { range: award.coverage })}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <BackToTop />
    </div>
  );
}

/** Tek ödülün rafı: kazananlar yeni yıldan eskiye. */
export function AwardShelf({
  award,
  hallLabel,
  hallName,
}: {
  award: AwardDetail;
  hallLabel: string;
  hallName: string;
}) {
  const t = useTranslations("book");
  // Yıl sırası backend'de zaten yeniden eskiye; burada tekrar sıralamıyoruz ki
  // aynı yılı paylaşan iki kitabın kendi arasındaki sırası korunsun
  const winners = award.winners;

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <Link href={AWARDS_HREF} className={styles.back}>
          {t("awards.backToAwards")}
        </Link>
        <span className={styles.eyebrow}>
          {t("hall", { num: hallLabel, name: hallName })}
        </span>
        <h1 className={styles.title}>{award.name}</h1>
        <p className={styles.epigraph}>{award.blurb}</p>
        <p className={styles.shelfMeta}>
          {t("awards.owned", { owned: award.inArchive, total: award.total })}
          <span className={styles.dot}>·</span>
          {t("awards.coverage", { range: award.coverage })}
        </p>
      </header>

      {winners.length === 0 ? (
        <p className={styles.empty}>{t("awards.unavailable")}</p>
      ) : (
        <ul className={styles.grid}>
          {winners.map((winner) => (
            <WinnerCard
              // Aynı yıl iki kitap olabiliyor (Booker 1992, Hugo 2010):
              // anahtar yıl+ad, yalnızca yıl DEĞİL
              key={`${winner.year}-${winner.title}`}
              winner={winner}
              grantedToAuthor={award.grantedTo === "AUTHOR"}
            />
          ))}
        </ul>
      )}

      <BackToTop />
    </div>
  );
}

function WinnerCard({
  winner,
  grantedToAuthor,
}: {
  winner: AwardWinnerCard;
  grantedToAuthor: boolean;
}) {
  const t = useTranslations("book");
  const cover = coverFor(winner.coverImage);

  /**
   * Nobel yazara verilir: kartın başlığı **yazar**, altındaki eser onun
   * temsilci kitabı. Kitap ödüllerinde tam tersi. Aynı kartı iki anlamda
   * kullanmak yerine hangi bilginin başlık olduğunu burada ayırıyoruz.
   *
   * Alt satırlar sırayla dizilip boşlar eleniyor — yazar adı Türkçe ad
   * varken düşmesin (ilk hâlde düşüyordu).
   */
  const heading = grantedToAuthor ? winner.author : winner.title;
  const subLines = (
    grantedToAuthor
      ? [winner.notableWork, winner.titleTr]
      : [winner.titleTr, winner.author]
  ).filter((line): line is string => Boolean(line));

  const body = (
    <>
      <span className={styles.coverWrap}>
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            sizes="(max-width: 639px) 32vw, 150px"
            className={styles.coverImg}
            unoptimized
          />
        ) : (
          /**
           * Kapağı henüz eşleşmemiş cilt boş kare değil: adı kapağın yerini
           * tutuyor (arşivdeki `BookCard.Cover` ile aynı karar). Ödül
           * rafında bu daha da önemli — ilk açılışta ciltlerin çoğu
           * kapaksız gelir, boş kareler duvarı okunmaz olurdu.
           */
          <span className={styles.coverFallback}>
            <span className={styles.coverFallbackTitle}>{heading}</span>
            {!grantedToAuthor ? (
              <span className={styles.coverFallbackAuthor}>
                {winner.author}
              </span>
            ) : null}
          </span>
        )}
        <span className={styles.year}>{winner.year}</span>
        {winner.inArchive ? (
          <span className={styles.owned} title={t("awards.inArchive")}>
            ✓
          </span>
        ) : null}
        {winner.shared ? (
          <span className={styles.shared}>{t("awards.shared")}</span>
        ) : null}
      </span>

      <span className={styles.cardTitle}>{heading}</span>
      {subLines.map((line) => (
        <span key={line} className={styles.cardSub}>
          {line}
        </span>
      ))}
    </>
  );

  /**
   * Üç hâl, bu sırayla:
   *  1. **Arşivde** → kendi kitap sayfası (senin notların, alıntıların orada).
   *  2. **Arşivde değil ama kaynakta var** → `/kitap/kaynak/<slug>` künye
   *     sayfası. Liste 235 kitap, arşivde bir avuç: eskiden kartların
   *     neredeyse tamamı tıklanmıyordu ve okurun gidecek yeri yoktu.
   *  3. **Hiç eşleşmemiş** → kart tıklanmaz. Dışarı 1000Kitap'a atmak bilerek
   *     yapılmıyor: burası arşiv, mağaza değil.
   */
  const href =
    winner.inArchive && winner.archiveSlug
      ? `/dark-stories/category/kitap/${winner.archiveSlug}`
      : winner.sourceSlug
        ? sourceBookHref(winner.sourceSlug)
        : null;

  return (
    <li className={styles.card}>
      {href ? (
        <Link href={href} className={styles.cardLink}>
          {body}
        </Link>
      ) : (
        <span className={styles.cardStatic}>{body}</span>
      )}
    </li>
  );
}
