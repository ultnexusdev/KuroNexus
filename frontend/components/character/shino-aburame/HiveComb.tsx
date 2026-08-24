"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { CombDiagram, ringDistance } from "./HiveGlyphs";
import styles from "./ShinoExperience.module.css";

/**
 * Petek — sayfanın kalbi.
 *
 * Altı hücre bir HALKA kuruyor: 0'dan 5'e saat yönünde, 5'ten sonra yine 0.
 * Bir hücre seçilince komşuları da kımıldıyor; uyanma dalgası halka
 * mesafesine göre (`ringDistance`) 0 → 1 → 2 → 3 kademesinde yayılıyor.
 * JS'in yaptığı tek şey her düğüme `data-dist` yazmak; parlaklık, gecikme
 * ve ölçek CSS'te (`--shi-spread` gecikme merdiveni).
 *
 * Metin sunucuda seçilmiş düz dize olarak iniyor (BRIEF §5): bu ada
 * `LocalizedText` görmüyor.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Desen: tek panelli tab listesi, otomatik etkinleştirme. Gezinme:
 *   ← ↑ : önceki hücre        → ↓ : sonraki hücre
 *   Home / End : ilk / son hücre
 * Halka olduğu için ok tuşları uçlarda SARIYOR — mekaniğin kendisi bunu
 * söylüyor, klavye de aynı şeyi söylemeli. İki gerçek düğme (önceki/sonraki)
 * ok tuşu bilmeyen ve dokunmatik kullanan ziyaretçi için; onlar da sarıyor,
 * bu yüzden hiçbir zaman devre dışı kalmıyorlar.
 * Roving tabindex: yalnızca etkin hücre tab sırasında.
 */

export interface CombCellView {
  key: string;
  short: string;
  title: string;
  latin: string;
  text: string;
  use: string;
  image: string | null;
}

/** Hücre numarası iki haneli: 01…06 — künye numarası gibi okunsun. */
function designation(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function HiveComb({
  cells,
  listLabel,
  cellWord,
  coreGlyph,
  coreLabel,
  prevLabel,
  nextLabel,
  useLabel,
  keyboardHint,
  combAlt,
}: {
  cells: CombCellView[];
  listLabel: string;
  cellWord: string;
  coreGlyph: string;
  coreLabel: string;
  prevLabel: string;
  nextLabel: string;
  useLabel: string;
  keyboardHint: string;
  combAlt: string;
}) {
  const [index, setIndex] = useState(0);
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = cells[index];
  if (!active) {
    return null;
  }

  /** Halka üzerinde sararak dolaş; klavye kullanıcısının odağı da taşınır. */
  const focusCell = (next: number) => {
    const wrapped = (next + cells.length) % cells.length;
    setIndex(wrapped);
    cellRefs.current[wrapped]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusCell(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusCell(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusCell(0);
        break;
      case "End":
        event.preventDefault();
        focusCell(cells.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.comb}>
      <div className={styles.combStage}>
        <CombDiagram
          selected={index}
          title={combAlt}
          className={styles.combArt}
          cellClassName={styles.combCellEdge}
          outerClassName={styles.combOuter}
          linkClassName={styles.combLink}
          spokeClassName={styles.combSpoke}
          dotClassName={styles.combDot}
          coreClassName={styles.combCoreShape}
        />

        <div
          className={styles.combRing}
          role="tablist"
          aria-label={listLabel}
          onKeyDown={onKeyDown}
        >
          {cells.map((cell, position) => (
            <button
              key={cell.key}
              type="button"
              role="tab"
              id={`shi-cell-tab-${cell.key}`}
              aria-selected={position === index}
              aria-controls="shi-cell-panel"
              tabIndex={position === index ? 0 : -1}
              data-cell={position}
              data-dist={ringDistance(position, index)}
              ref={(node) => {
                cellRefs.current[position] = node;
              }}
              className={styles.combCell}
              onClick={() => setIndex(position)}
            >
              <span className={styles.combCellIndex} aria-hidden>
                {designation(position)}
              </span>
              <span className={styles.combCellName} aria-hidden>
                {cell.short}
              </span>
              <span className={styles.visuallyHidden}>
                {`${position + 1}. ${cellWord} — ${cell.title}`}
              </span>
            </button>
          ))}
        </div>

        {/* Kovan çekirdeği: seçili hücrenin numarasını taşır */}
        <p className={styles.combCore} aria-hidden>
          <span className={styles.combCoreGlyph}>{coreGlyph}</span>
          <span className={styles.combCoreLabel}>{coreLabel}</span>
          <span className={styles.combCoreNumber}>{designation(index)}</span>
        </p>
      </div>

      <div className={styles.combSide}>
        <div
          id="shi-cell-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`shi-cell-tab-${active.key}`}
          className={styles.combPanel}
        >
          {active.image ? (
            <span className={styles.combPanelArt} aria-hidden>
              <Image src={active.image} alt="" fill sizes="640px" />
            </span>
          ) : null}
          <h3 className={styles.combTitle}>{active.title}</h3>
          <p className={styles.combLatin}>{active.latin}</p>
          <p className={styles.combText}>{active.text}</p>
          <p className={styles.combUse}>
            <span className={styles.combUseLabel}>{useLabel}</span>
            {active.use}
          </p>
        </div>

        <div className={styles.combNav}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => focusCell(index - 1)}
          >
            <span aria-hidden>←</span>
            {prevLabel}
          </button>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => focusCell(index + 1)}
          >
            {nextLabel}
            <span aria-hidden>→</span>
          </button>
        </div>
        <p className={styles.combHint}>{keyboardHint}</p>
      </div>
    </div>
  );
}
