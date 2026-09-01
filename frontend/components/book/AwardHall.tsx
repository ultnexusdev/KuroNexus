"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/lib/i18n/navigation";
import { apiUrl, isLocalUpload } from "@/lib/api/client";
import type { AwardDetail, AwardSummary, AwardWinnerCard } from "@/lib/api/types";
import { BackToTop } from "@/components/BackToTop";
import { personHref, sourceBookHref } from "@/lib/book/routes";
import { awardHref, AWARDS_HREF } from "@/lib/book/routes";
import styles from "./AwardHall.module.css";

/**
 * Salon 05 · Kitap — Ödüller (Faz B).
 *
 * İki görünüm, tek dosya: ödüllerin listesi (`AwardHall`) ve tek bir ödülün
 * rafı (`AwardShelf`). Ayrı bileşen değiller çünkü kart, rozet ve boş çerçeve
 * mantığı ikisinde de aynı.
 *
 * **Kapak gelmemesi normaldir.** Eşleşme backend'de arka planda doluyor
 * (`awards.service.ts`); ilk açılışta ciltlerin çoğu kapaksız gelir. Bu
 * yüzden kapaksız kart bir hata hâli değil, beklenen bir hâl — arşivdeki
 * kapaksız kitapla aynı boş çerçeve çiziliyor.
 *
 * Eskiden dolması için sayfayı **elle** yenilemek gerekiyordu (kullanıcı
 * bildirimi: "görseller sayfayı yeniledikçe yükleniyor"); artık raf, doldurulacak
 * kayıt kaldığı sürece kendini tazeliyor (`AutoFill`).
 */

// Adres yardımcıları `lib/book/routes.ts`e taşındı (2026-08-22): bu dosya
// "use client" olduğu için buradaki fonksiyon export'ları sunucu bileşenlerince
// çağrılamıyordu ve PersonHall'u gereksiz yere istemci paketinde tutuyordu.

function coverFor(cover: string | null): string | null {
  return cover ? apiUrl(cover) : null;
}

/**
 * Kapak `next/image` optimizasyonundan geçebilir mi? — ÖLÇÜMLE koşullu hâle
 * geldi (2026-08-09).
 *
 * Eskiden buradaki her kapak koşulsuz `unoptimized` idi ve gerekçe olarak
 * "kapaklar keyfi host'lardan geliyor" yazıyordu. Kural olarak doğru ama BU
 * sayfa için değil: eşleşen kapağı `awards.service.ts` bir kez indirip
 * `/uploads/books/` altına kopyalıyor, `next.config.ts` içindeki
 * `remotePatterns` de o yolu zaten kapsıyor. `unoptimized` verildiğinde `sizes`
 * tamamen yok sayılıyordu — ölçüm: 84 px'lik kutuya 249–600 px'lik ham JPEG.
 *
 * ⚠️ Karar **`apiUrl()`den geçmemiş ham yoldan** veriliyor: `isLocalUpload`
 * "/uploads/" önekine bakıyor, mutlak adres verilirse her zaman `false` derdi
 * ve hiçbir kapak optimize edilmezdi (sessiz başarısızlık). Aynı tuzak
 * `BookCard.coverUnoptimized` ve `CharacterSections`ta da not düşülmüş.
 */
function coverOptimizable(cover: string | null): boolean {
  return isLocalUpload(cover);
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
    <div data-category="kitap" className={styles.page}>
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
                        /* `.awardCard` kolonu 72px, ≥640px'te 84px
                           (AwardHall.module.css) — kutu sabit, vw yanlış olur */
                        sizes="84px"
                        className={styles.awardCoverImg}
                        /* Bizim yüklememizse optimize ediliyor; dışarıda kalan
                           adres `remotePatterns`ta yok, o ham iniyor
                           (bkz. coverOptimizable) */
                        unoptimized={!coverOptimizable(award.coverImage)}
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
    <div data-category="kitap" className={styles.page}>
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
        <AutoFill pending={award.pending} />
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

/**
 * Doldurulacak kayıt kaldığı sürece sayfayı tazeler.
 *
 * Eşleştirme her istekte yalnızca birkaç kaydı dolduruyor — kaynak saniyede
 * bir isteğin üstünde 429 dönüyor ve bu sınır ölçüldü, aşılmıyor. Eskiden
 * kalanın gelmesi için sayfayı elle yenilemek gerekiyordu; artık raf kendi
 * tazeliyor ve ne olduğunu da yazıyor.
 *
 * `pending` **sıfırlanınca duruyor**: eşleşmesi bulunamamış kitap da cache'e
 * yazılıyor, yani "hiç kapak gelmedi" sonsuz tazelemeye dönüşmüyor.
 */
function AutoFill({ pending }: { pending: number }) {
  const t = useTranslations("book");
  const router = useRouter();
  /**
   * Tur sayacı sadece süre ölçmek için değil, döngüyü **ayakta tutmak** için
   * de gerekli: `pending` bir turda hiç azalmayabiliyor (kaynak 429 verince
   * tur boş biter) ve yalnızca ona bakan bir etki o noktada sessizce dururdu.
   */
  const [rounds, setRounds] = useState(0);
  const done = pending <= 0 || rounds >= MAX_ROUNDS;

  useEffect(() => {
    if (done) {
      return;
    }
    const timer = setTimeout(() => {
      setRounds((value) => value + 1);
      router.refresh();
    }, REFRESH_MS);
    return () => clearTimeout(timer);
  }, [done, rounds, router]);

  if (done) {
    return null;
  }
  return (
    <p className={styles.filling} aria-live="polite">
      {t("awards.filling", { count: pending })}
    </p>
  );
}

/**
 * Bir tur ne kadar sürede tazeleniyor.
 *
 * Backend bir istekte üç kazanan dolduruyor, bir kazanan 2–4 sayfa açıyor ve
 * sayfalar arasında en az bir saniye boşluk var — yani bir tur 12 saniyeye
 * kadar sürebiliyor.
 *
 * Önce 20 saniyeydi ve **az geldi**: kaynağın istek kuyruğu paylaşımlı, tur
 * bitmeden yenisi eklenince küratör araması o sıranın arkasına düşüp askıda
 * kalıyordu (kullanıcı bildirimi). Asıl koruma backend'de — soğumadayken tur
 * hiç başlamıyor — ama tazelemeyi de seyreltmek doğru: bu sayfanın işi arka
 * planda dolmak, kaynağı meşgul etmek değil.
 */
const REFRESH_MS = 45_000;

/**
 * En fazla kaç tur. 235 kazananın tamamı tek ziyarette dolmuyor ve dolması da
 * gerekmiyor — sayfa açık unutulunca saatlerce istek atmasın diye üst sınır
 * var (20 tur ≈ 15 dakika). Kaldığı yerden bir sonraki ziyarette devam eder.
 */
const MAX_ROUNDS = 20;

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
   */
  const heading = grantedToAuthor ? winner.author : winner.title;

  /**
   * Kitap satırları. Yazar adı buraya GİRMİYOR: o artık kendi bağını taşıyan
   * ayrı bir satır (kullanıcı isteği — çevrilmemiş kitapta bile yazara
   * tıklanabilsin) ve iç içe bağ geçersiz HTML olurdu.
   */
  const bookLines = (
    grantedToAuthor
      ? [winner.notableWork, winner.titleTr]
      : [winner.titleTr]
  ).filter((line): line is string => Boolean(line));

  /**
   * Kapağın gittiği yer, üç hâl bu sırayla:
   *  1. **Arşivde** → kendi kitap sayfası (senin notların, alıntıların orada).
   *  2. **Arşivde değil ama kaynakta var** → `/kitap/kaynak/<slug>` künye
   *     sayfası. Liste 235 kitap, arşivde bir avuç: eskiden kartların
   *     neredeyse tamamı tıklanmıyordu ve okurun gidecek yeri yoktu.
   *  3. **Hiç eşleşmemiş** → kapak tıklanmaz. Dışarı 1000Kitap'a atmak bilerek
   *     yapılmıyor: burası arşiv, mağaza değil.
   */
  const href =
    winner.inArchive && winner.archiveSlug
      ? `/dark-stories/category/kitap/${winner.archiveSlug}`
      : winner.sourceSlug
        ? sourceBookHref(winner.sourceSlug)
        : null;

  const coverBlock = (
    <span className={styles.coverWrap}>
      {cover ? (
        <Image
          src={cover}
          alt=""
          fill
          /* `.grid`: 640px altında üç sabit kolon (≈30vw ≈ 112px), üstünde
             `repeat(auto-fill, minmax(140px, 1fr))` — kolon 143 px ile 178 px
             arasında kalıyor, en genişi ~780 px ekranda. 150px az geliyordu.

             `vw` kaldırıldı: `sizes` içinde yüzde geçince Next 211 px
             altındaki basamakları aday listesinden eliyor ve 176 seçilemez
             hâle geliyordu — tam da kazanmak istediğimiz basamak
             (bkz. `next.config.ts`). Kutu zaten 112–178 px bandında. */
          sizes="176px"
          className={styles.coverImg}
          unoptimized={!coverOptimizable(winner.coverImage)}
        />
      ) : (
        /**
         * Kapağı henüz eşleşmemiş cilt boş kare değil: adı kapağın yerini
         * tutuyor (arşivdeki `BookCard.Cover` ile aynı karar). Ödül rafında
         * bu daha da önemli — ilk açılışta ciltlerin çoğu kapaksız gelir,
         * boş kareler duvarı okunmaz olurdu.
         */
        <span className={styles.coverFallback}>
          <span className={styles.coverFallbackTitle}>{heading}</span>
          {!grantedToAuthor ? (
            <span className={styles.coverFallbackAuthor}>{winner.author}</span>
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
  );

  /**
   * Yazar satırı. Bağ **her zaman** kuruluyor: backend arşivdeki kişi kaydı
   * yoksa kaynağın adres anahtarını, o da yoksa adın katlanmış hâlini
   * veriyor ve kişi sayfası arşivde olmayan yazarı kaynaktan çiziyor.
   */
  const authorLine = winner.authorSlug ? (
    <Link
      href={personHref(winner.authorSlug)}
      className={grantedToAuthor ? styles.cardTitleLink : styles.cardSubLink}
    >
      {winner.author}
    </Link>
  ) : (
    <span className={grantedToAuthor ? styles.cardTitle : styles.cardSub}>
      {winner.author}
    </span>
  );

  return (
    <li className={styles.card}>
      {href ? (
        <Link href={href} className={styles.cardLink}>
          {coverBlock}
          {grantedToAuthor ? null : (
            <span className={styles.cardTitle}>{heading}</span>
          )}
        </Link>
      ) : (
        <span className={styles.cardStatic}>
          {coverBlock}
          {grantedToAuthor ? null : (
            <span className={styles.cardTitle}>{heading}</span>
          )}
        </span>
      )}

      {/* Nobel'de başlık zaten yazar: satır kartın en üstünde duruyor */}
      {grantedToAuthor ? authorLine : null}
      {bookLines.map((line) => (
        <span key={line} className={styles.cardSub}>
          {line}
        </span>
      ))}
      {grantedToAuthor ? null : authorLine}
    </li>
  );
}
