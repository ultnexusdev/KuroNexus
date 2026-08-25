"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { WarFan } from "./TemariGlyphs";
import styles from "./TemariExperience.module.css";

/**
 * Üç Yıldız — açılan yelpaze. Sayfanın kalbi ve tek yazılmış hareketi.
 *
 * Her kademede yay genişler (24° → 48° → 72°), bir mor yıldız daha görünür,
 * yelpazenin dışındaki rüzgâr kesiklerinden biri daha ÇİZİLİR ve bölümü
 * boydan boya geçen yatay şeritler çoğalır. Metin bloğu da her kademede bir
 * tık sağa kayar: sayfa, yelpazenin savurduğu yöne doğru itilir.
 *
 * Hareketin tamamı CSS'te; bu ada yalnızca `data-stars` niteliğini çeviriyor
 * (geometri `TemariGlyphs`te, açılar `transform` niteliğinde). Metinler
 * sunucuda `pick` ile seçilmiş düz dize olarak iniyor — bu adaya
 * `LocalizedText` girmiyor (BRIEF §5).
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Kademeler bir tab listesi: üç yıldız düğmesi, tek panel. Gezinme
 *   ← → ↑ ↓ : bir kademe geri/ileri     Home / End : bir yıldız / üç yıldız
 * Roving tabindex: yalnızca etkin kademe tab sırasında. Ok tuşu kullanmayan
 * ziyaretçi için iki gerçek düğme var (aç / kapat). Yelpazenin şemasının
 * kendisi `role="img"` ve açıklamalı; kaç yıldızın açıldığını ayrıca bir
 * `role="status"` satırı söylüyor.
 */

export interface StarView {
  key: string;
  stars: 1 | 2 | 3;
  title: string;
  call: string;
  opens: string;
  measure: string;
  image: string | null;
}

/** Bölümü boydan boya geçen yatay rüzgâr şeritleri — tamamen dekoratif. */
const SLASHES = [0, 1, 2, 3, 4, 5, 6];

export function FanArc({
  stages,
  listLabel,
  starWord,
  openLabel,
  foldLabel,
  opensLabel,
  measureLabel,
  callLabel,
  keyboardHint,
  fanAlt,
}: {
  stages: StarView[];
  listLabel: string;
  starWord: string;
  openLabel: string;
  foldLabel: string;
  opensLabel: string;
  measureLabel: string;
  callLabel: string;
  keyboardHint: string;
  fanAlt: string;
}) {
  const [index, setIndex] = useState(0);
  const notchRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = stages[index];
  if (!active) {
    return null;
  }

  /* Kademe değişince odak da taşınır — klavye kullanıcısı seçtiği yıldızın
     üstünde kalmalı (roving tabindex şartı). */
  const focusNotch = (next: number) => {
    const clamped = Math.min(Math.max(next, 0), stages.length - 1);
    setIndex(clamped);
    notchRefs.current[clamped]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        event.preventDefault();
        focusNotch(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        event.preventDefault();
        focusNotch(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusNotch(0);
        break;
      case "End":
        event.preventDefault();
        focusNotch(stages.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.fanStage} data-stars={active.stars}>
      {/* Yatay rüzgâr şeritleri: kademe büyüdükçe uzuyor ve çoğalıyor */}
      <span className={styles.fanSlashes} aria-hidden>
        {SLASHES.map((line) => (
          <span key={line} className={styles.slash} data-line={line} />
        ))}
      </span>

      <div className={styles.fanArt}>
        <WarFan
          stars={active.stars}
          title={fanAlt}
          className={styles.fanSvg}
          segmentClassName={styles.fanSegment}
          ribClassName={styles.fanRib}
          starClassName={styles.fanStar}
          cutClassName={styles.fanCut}
        />

        {/* Kademe düğmeleri sapın hizasında: elin yelpazeyi tuttuğu yer */}
        <div
          className={styles.notches}
          role="tablist"
          aria-label={listLabel}
          onKeyDown={onKeyDown}
        >
          {stages.map((stage, position) => (
            <button
              key={stage.key}
              type="button"
              role="tab"
              id={`tem-notch-${stage.key}`}
              aria-selected={position === index}
              aria-controls="tem-star-panel"
              tabIndex={position === index ? 0 : -1}
              ref={(node) => {
                notchRefs.current[position] = node;
              }}
              className={styles.notch}
              data-on={position <= index ? "true" : undefined}
              onClick={() => setIndex(position)}
            >
              <svg
                className={styles.notchGlyph}
                viewBox="0 0 24 24"
                aria-hidden
                focusable="false"
              >
                <circle className={styles.notchRing} cx="12" cy="12" r="10" />
                <circle className={styles.notchCore} cx="12" cy="12" r="5.4" />
              </svg>
              <span className={styles.visuallyHidden}>
                {`${position + 1} / ${stages.length} ${starWord} — ${stage.title}`}
              </span>
            </button>
          ))}
        </div>

        <p className={styles.fanCount} role="status">
          <span className={styles.fanCountNumber}>{active.stars}</span>
          <span className={styles.fanCountTotal}>{`/ ${stages.length} ${starWord}`}</span>
        </p>
      </div>

      <div
        id="tem-star-panel"
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`tem-notch-${active.key}`}
        className={styles.fanPanel}
      >
        {active.image ? (
          <span className={styles.fanPanelArt} aria-hidden>
            <Image src={active.image} alt="" fill sizes="900px" />
          </span>
        ) : null}

        <h3 className={styles.fanTitle}>{active.title}</h3>
        <p className={styles.fanCall}>
          <span className={styles.fanCallLabel}>{callLabel}</span>
          <span className={styles.fanCallName}>{active.call}</span>
        </p>

        <div className={styles.fanGrid}>
          <div className={styles.fanBlock}>
            <p className={styles.fanLabel}>{opensLabel}</p>
            <p className={styles.fanText}>{active.opens}</p>
          </div>
          <div className={styles.fanBlock} data-kind="measure">
            <p className={styles.fanLabel}>{measureLabel}</p>
            <p className={styles.fanText}>{active.measure}</p>
          </div>
        </div>

        <div className={styles.fanNav}>
          <button
            type="button"
            className={styles.navButton}
            data-kind="open"
            onClick={() => setIndex((value) => Math.min(value + 1, stages.length - 1))}
            disabled={index === stages.length - 1}
          >
            {openLabel}
            <span aria-hidden>→</span>
          </button>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => setIndex(0)}
            disabled={index === 0}
          >
            {foldLabel}
          </button>
        </div>
        <p className={styles.fanHint}>{keyboardHint}</p>
      </div>
    </div>
  );
}
