"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { SaiFigureKey } from "@/lib/characters/sai-experience";
import { BrushSeal, InkBeast } from "./InkFigures";
import styles from "./SaiExperience.module.css";

/**
 * Canlanan çizim tomarı — sayfanın kalbi.
 *
 * Yatay KAYDIRMALI değil, adım adım açılan bir tomar: parşömen şeridi her
 * durakta bir figür genişliği kayıyor (`.track`, `data-step` ile), etkin
 * figür de tam ortada çiziliyor. Çizim sırası `InkFigures` dosyasında
 * anlatıldı: çizgi → mürekkep → mühür.
 *
 * Metin sunucuda `pick` ile seçilmiş DÜZ DİZE olarak iniyor (BRIEF §5):
 * bu ada `LocalizedText` görmüyor.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Şerit tek bir `role="img"`: içindeki beş figür ekran okuyucuya ayrı ayrı
 * inmez, yalnızca etkin figürün tarifi (`alt`) okunur — kaydırılmış dört
 * çizim görsel bir artık, içerik değil.
 *
 * Duraklar WAI-ARIA sekme deseni (otomatik etkinleştirme, roving tabindex):
 *   ← ↑ / → ↓ : önceki/sonraki çizim      Home / End : ilk/son çizim
 * Ok tuşu kullanmayan ziyaretçi için iki gerçek düğme var; hepsi
 * `--touch-min` yüksekliğinde.
 */

export interface FigureView {
  key: SaiFigureKey;
  glyph: string;
  name: string;
  alt: string;
  drew: string;
  purpose: string;
  image: string | null;
}

export function InkScroll({
  figures,
  listLabel,
  stepWord,
  prevLabel,
  nextLabel,
  drewLabel,
  purposeLabel,
  keyboardHint,
  sealLabel,
}: {
  figures: FigureView[];
  listLabel: string;
  stepWord: string;
  prevLabel: string;
  nextLabel: string;
  drewLabel: string;
  purposeLabel: string;
  keyboardHint: string;
  sealLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = figures[index];
  if (!active) {
    return null;
  }

  /* Durak değişince odak da taşınır — klavye kullanıcısı seçtiği durağın
     üstünde kalmalı (roving tabindex şartı). */
  const focusTab = (next: number) => {
    const clamped = (next + figures.length) % figures.length;
    setIndex(clamped);
    tabRefs.current[clamped]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusTab(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusTab(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(figures.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.scroll} data-step={index}>
      {/* ── Tomar ── */}
      <div className={styles.paper} role="img" aria-label={active.alt}>
        <span className={styles.rollStart} aria-hidden />
        <span className={styles.rollEnd} aria-hidden />
        <div className={styles.track}>
          {figures.map((figure, position) => (
            <div
              key={figure.key}
              className={styles.slide}
              data-on={position === index ? "true" : undefined}
            >
              {figure.image ? (
                <span className={styles.slideGhost}>
                  <Image src={figure.image} alt="" fill sizes="720px" />
                </span>
              ) : null}
              <span className={styles.slideGlyph}>{figure.glyph}</span>
              <InkBeast
                figure={figure.key}
                active={position === index}
                className={styles.beast}
                strokeClassName={styles.beastStroke}
                fillClassName={styles.beastFill}
                eyeClassName={styles.beastEye}
              />
              <span className={styles.slideSeal}>
                <BrushSeal className={styles.slideSealStone} />
                <span className={styles.slideSealLabel}>{sealLabel}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Duraklar ── */}
      <div className={styles.scrollBar}>
        <div
          className={styles.stops}
          role="tablist"
          aria-label={listLabel}
          onKeyDown={onKeyDown}
        >
          {figures.map((figure, position) => (
            <button
              key={figure.key}
              type="button"
              role="tab"
              id={`sai-stop-${figure.key}`}
              aria-selected={position === index}
              aria-controls="sai-scroll-panel"
              tabIndex={position === index ? 0 : -1}
              ref={(node) => {
                tabRefs.current[position] = node;
              }}
              className={styles.stop}
              onClick={() => setIndex(position)}
            >
              <span className={styles.stopGlyph} aria-hidden>
                {figure.glyph}
              </span>
              <span className={styles.visuallyHidden}>
                {`${position + 1}. ${stepWord} — ${figure.name}`}
              </span>
            </button>
          ))}
        </div>
        <p className={styles.count}>
          <span className={styles.countNumber}>{index + 1}</span>
          <span className={styles.countTotal}>/ {figures.length}</span>
        </p>
      </div>

      {/* ── Çizimin metni ── */}
      <div
        id="sai-scroll-panel"
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`sai-stop-${active.key}`}
        className={styles.panel}
      >
        <h3 className={styles.panelTitle}>{active.name}</h3>
        <div className={styles.panelBlock}>
          <p className={styles.panelLabel}>{drewLabel}</p>
          <p className={styles.panelText}>{active.drew}</p>
        </div>
        <div className={styles.panelBlock} data-kind="purpose">
          <p className={styles.panelLabel}>{purposeLabel}</p>
          <p className={styles.panelText}>{active.purpose}</p>
        </div>

        <div className={styles.panelNav}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => setIndex((value) => Math.max(value - 1, 0))}
            disabled={index === 0}
          >
            <span aria-hidden>←</span>
            {prevLabel}
          </button>
          <button
            type="button"
            className={styles.navButton}
            onClick={() =>
              setIndex((value) => Math.min(value + 1, figures.length - 1))
            }
            disabled={index === figures.length - 1}
          >
            {nextLabel}
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      <p className={styles.scrollHint}>{keyboardHint}</p>
    </div>
  );
}
