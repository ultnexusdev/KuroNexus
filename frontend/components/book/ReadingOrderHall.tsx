"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import { createBookEntry, setReadingOrderProgress } from "@/lib/admin/api";
import type {
  ReadingOrderDetail,
  ReadingOrderEntry,
  ReadingOrderSummary,
} from "@/lib/api/types";
import { BackToTop } from "@/components/BackToTop";
import { personHref, sourceBookHref } from "./BookCard";
import styles from "./ReadingOrderHall.module.css";

/**
 * Salon 05 · Kitap — Okuma Sıraları.
 *
 * İki görünüm, tek dosya: sıraların listesi (`ReadingOrderHall`) ve tek bir
 * sıranın yolu (`ReadingOrderPage`). Ayrı bileşen değiller çünkü kart, ilerleme
 * çubuğu ve seri rozeti mantığı ikisinde de aynı.
 *
 * **Tablo bir yol olarak çiziliyor, ızgara olarak değil.** Okuma sırasının
 * anlamı "önce bu, sonra şu"; numaralı duraklar bunu bir tablo satırından çok
 * daha iyi anlatıyor. Duraklar arasındaki çizgi de o yüzden var.
 *
 * Sayfanın asıl sorusu tabloda değil **arşivle kesişiminde**: hangi durak
 * sende var, hangisini okudun. Liste kod içinde küratörlü, kesişim canlı.
 */

export const READING_ORDERS_HREF = "/dark-stories/category/kitap/okuma-sirasi";

export function readingOrderHref(key: string): string {
  return `${READING_ORDERS_HREF}/${key}`;
}

/**
 * Seri renkleri. Dört kova var ve tanımdaki **ilk görünme sırasına** göre
 * dağıtılıyor: aynı liste her açılışta aynı rengi alsın. Renkler tema
 * token'larından — bileşende hex yok (kural 16).
 */
const TRACK_TONES = [
  styles.toneAccent,
  styles.toneGold,
  styles.toneWarn,
  styles.toneMuted,
] as const;

function toneFor(tracks: Array<{ name: string }>, track: string): string {
  const index = tracks.findIndex((item) => item.name === track);
  return TRACK_TONES[(index < 0 ? 0 : index) % TRACK_TONES.length];
}

/** Sıraların listesi. Şimdilik tek kayıt var; yenisi veri dosyasından gelir. */
export function ReadingOrderHall({
  orders,
  hallLabel,
  hallName,
}: {
  orders: ReadingOrderSummary[];
  hallLabel: string;
  hallName: string;
}) {
  const t = useTranslations("book");

  return (
    <div data-category="kitap" className={styles.page}>
      <header className={styles.head}>
        <Link href="/dark-stories/category/kitap" className={styles.back}>
          {t("readingOrder.backToHall")}
        </Link>
        <span className={styles.eyebrow}>
          {t("hall", { num: hallLabel, name: hallName })}
        </span>
        <h1 className={styles.title}>{t("readingOrder.title")}</h1>
        <p className={styles.epigraph}>{t("readingOrder.lede")}</p>
      </header>

      {orders.length === 0 ? (
        <p className={styles.empty}>{t("readingOrder.unavailable")}</p>
      ) : (
        <ul className={styles.orderList}>
          {orders.map((order) => (
            <li key={order.key}>
              <Link
                href={readingOrderHref(order.key)}
                className={styles.orderCard}
              >
                <span className={styles.orderCover}>
                  {order.coverImage ? (
                    <Image
                      src={apiUrl(order.coverImage)}
                      alt=""
                      fill
                      sizes="84px"
                      className={styles.orderCoverImg}
                      unoptimized
                    />
                  ) : (
                    <span className={styles.orderCoverEmpty} aria-hidden />
                  )}
                </span>
                <span className={styles.orderBody}>
                  <span className={styles.orderName}>{order.name}</span>
                  <span className={styles.orderBlurb}>{order.blurb}</span>
                  <span className={styles.orderMeta}>
                    {order.author.name}
                    <span className={styles.dot}>·</span>
                    {t("readingOrder.stops", { count: order.total })}
                    <span className={styles.dot}>·</span>
                    {order.years}
                  </span>
                  <Meter owned={order.inArchive} total={order.total} />
                  <span className={styles.orderCount}>
                    {t("readingOrder.owned", {
                      owned: order.inArchive,
                      total: order.total,
                    })}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <BackToTop />
    </div>
  );
}

type SortMode = "order" | "year";

/** Tek bir okuma sırası: solda yazar rayı, ortada yol. */
export function ReadingOrderPage({
  order,
  hallLabel,
  hallName,
  isAdmin = false,
}: {
  order: ReadingOrderDetail;
  hallLabel: string;
  hallName: string;
  /** Küratör araçları: "buradayım" imi ve eksik durağı arşive ekleme */
  isAdmin?: boolean;
}) {
  const t = useTranslations("book");
  const router = useRouter();
  const [sort, setSort] = useState<SortMode>("order");
  /** Seçili seri süzgeci; null = hepsi */
  const [track, setTrack] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  /**
   * Küratör işleri aynı kalıpta: kilitle, çalıştır, sayfayı tazele. Yerel
   * durum güncellenmiyor — im ve arşiv eşleşmesi sunucuda hesaplanıyor ve
   * tek kaynaktan doğru kalsın (salon kanadıyla aynı karar).
   */
  async function run(key: number, task: () => Promise<unknown>) {
    setBusy(key);
    setFailed(false);
    try {
      await task();
      router.refresh();
    } catch {
      setFailed(true);
    } finally {
      setBusy(null);
    }
  }

  const entries = useMemo(() => {
    const list = track
      ? order.entries.filter((entry) => entry.position.track === track)
      : order.entries;
    if (sort === "order") {
      return list;
    }
    /**
     * Yayım sırasına geçiş listenin **asıl iddiasını** görünür kılıyor: okuma
     * sırası yayım sırası değil. Aynı yıla düşen kitaplarda okuma sırası
     * korunuyor, yoksa iki kitabın yeri her açılışta değişirdi.
     */
    return [...list].sort((a, b) => a.year - b.year || a.order - b.order);
  }, [order.entries, sort, track]);

  const photo = order.author.photo ? apiUrl(order.author.photo) : null;

  return (
    <div data-category="kitap" className={styles.page}>
      <header className={styles.head}>
        <Link href={READING_ORDERS_HREF} className={styles.back}>
          {t("readingOrder.backToOrders")}
        </Link>
        <span className={styles.eyebrow}>
          {t("hall", { num: hallLabel, name: hallName })}
        </span>
        <h1 className={styles.title}>{order.name}</h1>
        <p className={styles.epigraph}>{order.blurb}</p>
      </header>

      <div className={styles.layout}>
        {/* ---- Sol ray: yazar ---- */}
        <aside className={styles.rail}>
          <div className={styles.railInner}>
            <div className={styles.portrait}>
              {photo ? (
                <Image
                  src={photo}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 40vw, 240px"
                  className={styles.portraitImg}
                  unoptimized
                />
              ) : (
                /* Portresi olmayan yazar boş çerçeve değil: baş harfleri
                   duruyor (arşivdeki kapaksız kitapla aynı karar) */
                <span className={styles.portraitEmpty} aria-hidden>
                  {initials(order.author.name)}
                </span>
              )}
            </div>

            <Link
              href={personHref(order.author.slug)}
              className={styles.authorLink}
            >
              <h2 className={styles.authorName}>{order.author.name}</h2>
            </Link>

            {order.author.biography ? (
              <div className={styles.biography}>
                {order.author.biography
                  .split("\n\n")
                  .slice(0, BIO_PARAGRAPHS)
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            ) : null}

            {order.notes.length > 0 ? (
              <section className={styles.notes}>
                <h3 className={styles.notesTitle}>
                  {t("readingOrder.notesTitle")}
                </h3>
                <ul className={styles.noteList}>
                  {order.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </aside>

        {/* ---- Orta: yol ---- */}
        <div className={styles.main}>
          <section className={styles.progress}>
            <div className={styles.progressHead}>
              <span className={styles.progressLabel}>
                {t("readingOrder.owned", {
                  owned: order.inArchive,
                  total: order.total,
                })}
              </span>
              <span className={styles.progressSub}>
                {t("readingOrder.readCount", { count: order.readCount })}
                <span className={styles.dot}>·</span>
                {order.years}
              </span>
            </div>
            <Meter owned={order.inArchive} total={order.total} />
            {/* "Buradayım": yolun neresinde olduğunu tek satırda söylüyor */}
            {order.currentOrder > 0 ? (
              <p className={styles.hereLine}>
                {t("readingOrder.hereAt", {
                  order: order.currentOrder,
                  total: order.total,
                })}
              </p>
            ) : null}
          </section>

          <div className={styles.controls}>
            {/* Sıralama: listenin asıl iddiası burada görünür oluyor */}
            <div className={styles.sortGroup} role="group">
              {(["order", "year"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={sort === mode ? styles.sortOn : styles.sortOff}
                  aria-pressed={sort === mode}
                  onClick={() => setSort(mode)}
                >
                  {t(`readingOrder.sort.${mode}`)}
                </button>
              ))}
            </div>

            <div className={styles.trackChips}>
              <button
                type="button"
                className={track === null ? styles.chipOn : styles.chip}
                aria-pressed={track === null}
                onClick={() => setTrack(null)}
              >
                {t("readingOrder.allTracks")}
              </button>
              {order.tracks.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className={`${
                    track === item.name ? styles.chipOn : styles.chip
                  } ${toneFor(order.tracks, item.name)}`}
                  aria-pressed={track === item.name}
                  onClick={() =>
                    setTrack(track === item.name ? null : item.name)
                  }
                >
                  <span className={styles.chipDot} aria-hidden />
                  {item.name}
                  <span className={styles.chipCount}>{item.count}</span>
                </button>
              ))}
            </div>
          </div>

          <ol className={styles.road}>
            {entries.map((entry) => (
              <Stop
                key={entry.order}
                entry={entry}
                tone={toneFor(order.tracks, entry.position.track)}
                /* Yayım sırasındayken büyük rakam yıl oluyor: o görünümde
                   okuma sırası numarası yanıltıcı olurdu */
                lead={
                  sort === "order" ? String(entry.order) : String(entry.year)
                }
                /* İm yalnızca okuma sırası görünümünde anlamlı: yayım
                   sırasında "geçilmiş duraklar" diye bir şey yok */
                passed={sort === "order" && entry.order < order.currentOrder}
                here={sort === "order" && entry.order === order.currentOrder}
                isAdmin={isAdmin}
                busy={busy === entry.order}
                onHere={() =>
                  void run(entry.order, () =>
                    setReadingOrderProgress(
                      order.key,
                      // Aynı durağa tekrar basmak imi kaldırıyor
                      entry.order === order.currentOrder ? 0 : entry.order,
                    ),
                  )
                }
                onAdd={
                  entry.sourceSlug
                    ? () =>
                        void run(entry.order, () =>
                          createBookEntry({
                            binKitapSlug: entry.sourceSlug ?? undefined,
                            /* Sıradaki kitap "okudum" olarak eklenmemeli:
                               liste okunacakları gösteriyor */
                            status: "TO_READ",
                          }),
                        )
                    : undefined
                }
              />
            ))}
          </ol>

          {failed ? (
            <p className={styles.error}>{t("readingOrder.actionFailed")}</p>
          ) : null}

          {entries.length === 0 ? (
            <p className={styles.empty}>{t("readingOrder.noMatch")}</p>
          ) : null}
        </div>
      </div>

      <BackToTop />
    </div>
  );
}

/** Sol raydaki biyografiden kaç paragraf gösterilir — ray uzayıp gitmesin. */
const BIO_PARAGRAPHS = 3;

function Stop({
  entry,
  tone,
  lead,
  passed,
  here,
  isAdmin,
  busy,
  onHere,
  onAdd,
}: {
  entry: ReadingOrderEntry;
  tone: string;
  lead: string;
  /** İmden önceki durak — geride kalmış */
  passed: boolean;
  /** İmin kendisi */
  here: boolean;
  isAdmin: boolean;
  busy: boolean;
  onHere: () => void;
  /** Kaynak anahtarı yoksa ekleme yapılamaz; o zaman undefined */
  onAdd?: () => void;
}) {
  const t = useTranslations("book");

  const body = (
    <>
      <span className={styles.stopCover}>
        {entry.coverImage ? (
          <Image
            src={apiUrl(entry.coverImage)}
            alt=""
            fill
            sizes="64px"
            className={styles.stopCoverImg}
            unoptimized
          />
        ) : (
          <span className={styles.stopCoverEmpty} aria-hidden />
        )}
      </span>

      <span className={styles.stopBody}>
        <span className={styles.stopTop}>
          <span className={`${styles.trackBadge} ${tone}`}>
            {entry.position.track}
            {entry.position.index !== null ? (
              <span className={styles.trackIndex}>
                {String(entry.position.index).padStart(2, "0")}
              </span>
            ) : null}
          </span>
          <span className={styles.stopYear}>{entry.year}</span>
        </span>

        {/* Orijinal ad başlık: liste orijinal adlar üzerinden kurulu ve
            Türkçe adların hangisi hangi baskı olduğu bilinmiyor */}
        <span className={styles.stopTitle}>{entry.originalTitle}</span>

        <span className={styles.stopNames}>
          {entry.titles.map((name) => (
            <span key={name} className={styles.stopName}>
              {name}
            </span>
          ))}
        </span>
      </span>

      <span className={styles.stopState}>
        {entry.status === "READ" ? (
          <span className={styles.stateRead} title={t("readingOrder.read")}>
            ★
          </span>
        ) : entry.inArchive ? (
          <span className={styles.stateOwned} title={t("readingOrder.inArchive")}>
            ✓
          </span>
        ) : (
          <span className={styles.stateMissing} aria-hidden />
        )}
      </span>
    </>
  );

  /**
   * Durağın gittiği yer, iki hâl:
   *  1. **Arşivde** → kendi kitap sayfası (notların, alıntıların orada).
   *  2. **Arşivde değil** → `/kitap/kaynak/<slug>` künye sayfası. Anahtarlar
   *     tek tek ölçüldü, o yüzden burada tahmin yok.
   *
   * Dışarı mağazaya atmak bilerek yapılmıyor (ödül rafıyla aynı karar).
   */
  const href = entry.archiveSlug
    ? `/dark-stories/category/kitap/${entry.archiveSlug}`
    : entry.sourceSlug
      ? sourceBookHref(entry.sourceSlug)
      : null;

  const classes = [styles.stop, tone];
  if (passed) {
    classes.push(styles.stopPassed);
  }
  if (here) {
    classes.push(styles.stopHere);
  }

  return (
    <li className={classes.join(" ")}>
      <span className={styles.stopLead} aria-hidden>
        {lead}
      </span>

      <div className={styles.stopMain}>
        {href ? (
          <Link href={href} className={styles.stopLink}>
            {body}
          </Link>
        ) : (
          <span className={styles.stopStatic}>{body}</span>
        )}

        {isAdmin ? (
          <div className={styles.stopTools}>
            <button
              type="button"
              className={here ? styles.hereOn : styles.hereOff}
              aria-pressed={here}
              disabled={busy}
              onClick={onHere}
            >
              {here ? t("readingOrder.hereRemove") : t("readingOrder.hereSet")}
            </button>
            {/* Arşivde olmayan durağı tek tıkla ekler: künye kaynağın
                ölçülmüş anahtarından geliyor, arama yapmaya gerek yok */}
            {!entry.inArchive && onAdd ? (
              <button
                type="button"
                className={styles.addStop}
                disabled={busy}
                onClick={onAdd}
              >
                {busy
                  ? t("readingOrder.adding")
                  : t("readingOrder.addToArchive")}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  );
}

/** Arşiv payı çubuğu — ödül kartındaki ölçünün aynısı. */
function Meter({ owned, total }: { owned: number; total: number }) {
  const ratio = total > 0 ? (owned / total) * 100 : 0;
  return (
    <span className={styles.meter} aria-hidden>
      <span className={styles.meterFill} style={{ width: `${ratio}%` }} />
    </span>
  );
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
