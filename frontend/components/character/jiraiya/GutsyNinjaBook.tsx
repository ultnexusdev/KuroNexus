"use client";

import { useState } from "react";
import Image from "next/image";
import { InkBlot, RippleMark } from "./JiraiyaMarks";
import styles from "./JiraiyaExperience.module.css";

/**
 * Dokonjō Ninden — çevrilen sayfalar. Sayfanın KALBİ.
 *
 * ── NEDEN BÜTÜN YAPRAKLAR DOM'DA ──────────────────────────────────────
 * Yapraklar bir ızgaranın AYNI hücresinde üst üste duruyor (`grid-area:
 * 1 / 1`), yani kutunun yüksekliği en uzun yaprağa göre sabit ve sayfa
 * çevrilirken zıplama olmuyor. Okunan yaprak sol kenarından `rotateY` ile
 * devriliyor; `backface-visibility: hidden` onu 90 dereceden sonra
 * gizliyor ve ALTINDAKİ yaprak ortaya çıkıyor — gerçek bir kitabın
 * hareketi bu, ayrı bir "gelen sayfa" animasyonu gerekmiyor.
 *
 * Hareketin tamamı CSS'te (`.leaf[data-state]`); burada yalnızca sıra
 * numarası tutuluyor. `prefers-reduced-motion: reduce` altında dönüş
 * kapanıyor ve yaprak sönerek değişiyor (BRIEF madde 7 + karakter yönergesi).
 *
 * ── ERİŞİLEBİLİRLİK ───────────────────────────────────────────────────
 * Görünmeyen yapraklar `aria-hidden`; yığın odaklanabilir ve ok tuşlarıyla
 * geziliyor; ayrıca gerçek `<button>`lar var (önceki/sonraki + her yaprağın
 * kendi düğmesi). Durum satırı `aria-live="polite"` ile okunuyor.
 *
 * Metinler sunucuda `pick()` ile seçilip düz dize olarak iniyor
 * (BRIEF madde 5) — bu ada `LocalizedText` geçmiyor.
 */

export interface BookLeafView {
  key: string;
  /** Bölüm rakamı — dekoratif */
  folio: string;
  /** Bölüm başlığının Japonca karşılığı — dekoratif */
  folioKanji: string;
  age: string;
  title: string;
  text: string;
  margin: string;
  quote: { text: string; by: string } | null;
  cipher: { glyphs: string; reading: string } | null;
  image: string | null;
  imageAlt: string;
}

export interface BookLabels {
  prev: string;
  next: string;
  pageWord: string;
  stackLabel: string;
  marginLabel: string;
  goTo: string;
}

export function GutsyNinjaBook({
  leaves,
  labels,
}: {
  leaves: BookLeafView[];
  labels: BookLabels;
}) {
  const [index, setIndex] = useState(0);
  const last = leaves.length - 1;

  const go = (next: number) => {
    setIndex(Math.min(Math.max(next, 0), last));
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    /* Ok tuşları yalnızca yığın odaktayken ya da içindeki bir düğmedeyken
       çalışır; sayfanın genel kaydırmasına karışmasın diye yerel dinleyici */
    if (event.key === "ArrowRight" || event.key === "PageDown") {
      event.preventDefault();
      go(index + 1);
    } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      go(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      go(0);
    } else if (event.key === "End") {
      event.preventDefault();
      go(last);
    }
  };

  return (
    /* Dinleyici dış kapta: ok tuşları yığın odaktayken de, çevirme
       düğmeleri odaktayken de çalışsın (olay yukarı kabarır) */
    <div className={styles.book} onKeyDown={onKeyDown}>
      <div
        className={styles.leafStack}
        role="group"
        aria-label={labels.stackLabel}
        tabIndex={0}
      >
        {/* Dikiş payı: yaprakların devrildiği omurga */}
        <span className={styles.spine} aria-hidden />
        {leaves.map((leaf, position) => {
          const state =
            position < index ? "past" : position === index ? "now" : "next";
          return (
            <article
              key={leaf.key}
              className={styles.leaf}
              data-state={state}
              /* Üstteki yaprak en yüksek katman: alttakiler onun arkasında
                 bekler, o devrildiğinde sıradaki görünür */
              style={{ zIndex: leaves.length - position }}
              aria-hidden={state === "now" ? undefined : true}
            >
              <span className={styles.leafFolio} aria-hidden>
                <span className={styles.leafFolioNumber}>{leaf.folio}</span>
                <span className={styles.leafFolioKanji}>{leaf.folioKanji}</span>
              </span>

              <div className={styles.leafBody}>
                <p className={styles.leafAge}>{leaf.age}</p>
                <h3 className={styles.leafTitle}>{leaf.title}</h3>
                <p className={styles.leafText}>{leaf.text}</p>

                {leaf.quote ? (
                  <figure className={styles.leafQuote}>
                    <blockquote>&ldquo;{leaf.quote.text}&rdquo;</blockquote>
                    <figcaption>{leaf.quote.by}</figcaption>
                  </figure>
                ) : null}

                {leaf.cipher ? (
                  <p className={styles.leafCipher}>
                    <span className={styles.leafCipherGlyphs}>
                      {leaf.cipher.glyphs}
                    </span>
                    <span className={styles.leafCipherReading}>
                      {leaf.cipher.reading}
                    </span>
                  </p>
                ) : null}

                <p className={styles.leafMargin}>
                  <span className={styles.leafMarginLabel}>
                    {labels.marginLabel}
                  </span>
                  {leaf.margin}
                </p>
              </div>

              <div className={styles.leafPlate}>
                {leaf.image ? (
                  <Image
                    src={leaf.image}
                    alt={leaf.imageAlt}
                    fill
                    sizes="(max-width: 900px) 92vw, 460px"
                  />
                ) : (
                  /* Görsel bağlanmadan önce: yaprağın kendi mürekkebi */
                  <InkBlot
                    className={styles.leafPlateBlot}
                    variant={((position % 3) + 1) as 1 | 2 | 3}
                  />
                )}
              </div>

              {/* Son yaprakta suyun halkaları — batışın izi */}
              {leaf.cipher ? (
                <RippleMark className={styles.leafRipple} />
              ) : null}

              <span className={styles.leafShade} aria-hidden />
            </article>
          );
        })}
      </div>

      <div className={styles.bookBar}>
        <button
          type="button"
          className={styles.bookStep}
          onClick={() => go(index - 1)}
          disabled={index === 0}
        >
          <span className={styles.bookStepArrow} aria-hidden>
            &#8592;
          </span>
          <span className={styles.bookStepLabel}>{labels.prev}</span>
        </button>

        <ol className={styles.folioRow}>
          {leaves.map((leaf, position) => (
            <li key={leaf.key}>
              <button
                type="button"
                className={styles.folioDot}
                data-active={position === index || undefined}
                aria-current={position === index ? "true" : undefined}
                onClick={() => go(position)}
              >
                <span aria-hidden>{leaf.folio}</span>
                <span className={styles.visuallyHidden}>
                  {labels.goTo} {position + 1}
                </span>
              </button>
            </li>
          ))}
        </ol>

        <button
          type="button"
          className={styles.bookStep}
          onClick={() => go(index + 1)}
          disabled={index === last}
        >
          <span className={styles.bookStepLabel}>{labels.next}</span>
          <span className={styles.bookStepArrow} aria-hidden>
            &#8594;
          </span>
        </button>
      </div>

      <p className={styles.bookStatus} aria-live="polite">
        {labels.pageWord} {index + 1} / {leaves.length}
      </p>
    </div>
  );
}
