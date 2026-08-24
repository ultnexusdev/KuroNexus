"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { BalanceDiagram, ButterflyWings, Flatline } from "./ChojiGlyphs";
import styles from "./ChojiExperience.module.css";

/**
 * Hap terazisi — sayfanın kalbi.
 *
 * Üç hap, üç kademe. Bir hap seçilince İKİ şey birden değişiyor: sol kefede
 * kazanılan çakra büyüyor, sağ kefeye bir bedel taşı daha biniyor. Kiriş
 * kademe kademe sağa yatıyor, çünkü bedel her seferinde kazançtan daha hızlı
 * artıyor — sayfanın bütün tezi bu tek harekette.
 *
 * Kırmızı hapta iki şey daha oluyor: `role="alert"` taşıyan açık bir uyarı
 * beliriyor ("bu hap öldürür") ve terazinin arkasında kelebek kanatları
 * açılıyor. Kanatlar BAŞKA HİÇBİR KADEMEDE açılmıyor.
 *
 * Metin sunucuda seçilmiş düz dize olarak iniyor (BRIEF §5): bu ada
 * `LocalizedText` görmüyor.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Desen: WAI-ARIA radio group. Bir doz SEÇİLİYOR, sekme değiştirilmiyor —
 * anlamı doğru taşıyan rol bu. Gezinme:
 *   ← ↑ : önceki hap        → ↓ : sonraki hap       Home/End : ilk/son
 * Roving tabindex: yalnızca seçili hap tab sırasında; ok tuşu hem seçimi
 * hem odağı taşıyor (otomatik etkinleştirme, radio grubunun ev deseni).
 * Hapların erişilebilir adı yalnızca renk değil, kademenin tamamı:
 * "Kırmızı hap · kırmızı biber — çakra ×100".
 */

export interface PillView {
  key: string;
  /** Renk kanjisi: 緑 / 黄 / 赤 — dekoratif, ada girmiyor */
  mark: string;
  /** Japonca hap adı (çevrilmez) */
  name: string;
  title: string;
  multiplier: string;
  gain: string;
  cost: string;
  /** Yalnızca kırmızı hapta dolu */
  danger: string | null;
  image: string | null;
}

export function PillBalance({
  pills,
  listLabel,
  doseWord,
  gainLabel,
  costLabel,
  chakraLabel,
  dangerLabel,
  keyboardHint,
  balanceAlt,
  wingNote,
  coda,
}: {
  pills: PillView[];
  listLabel: string;
  doseWord: string;
  gainLabel: string;
  costLabel: string;
  chakraLabel: string;
  dangerLabel: string;
  keyboardHint: string;
  balanceAlt: string;
  wingNote: string;
  coda: string;
}) {
  const [index, setIndex] = useState(0);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = pills[index];
  if (!active) {
    return null;
  }

  /* Seçim değişince odak da taşınır — klavye kullanıcısı seçtiği hapın
     üstünde kalmalı (roving tabindex şartı). */
  const focusPill = (next: number) => {
    const clamped = (next + pills.length) % pills.length;
    setIndex(clamped);
    pillRefs.current[clamped]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusPill(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusPill(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusPill(0);
        break;
      case "End":
        event.preventDefault();
        focusPill(pills.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.scale} data-step={index}>
      <div className={styles.scaleStage}>
        {/* Kanatlar yalnızca kırmızı hapta açılıyor — data-step="2" */}
        <span className={styles.stageWings} aria-hidden>
          <ButterflyWings
            className={styles.stageWingsArt}
            veinClassName={styles.stageWingsVein}
          />
        </span>

        <BalanceDiagram
          step={index}
          title={balanceAlt}
          className={styles.balance}
          frameClassName={styles.balanceFrame}
          beamClassName={styles.beam}
          panClassName={styles.pan}
          gainClassName={styles.gainOrb}
          costClassName={styles.costWeight}
        />

        <div
          className={styles.pillRow}
          role="radiogroup"
          aria-label={listLabel}
          onKeyDown={onKeyDown}
        >
          {pills.map((pill, position) => (
            <button
              key={pill.key}
              type="button"
              role="radio"
              aria-checked={position === index}
              tabIndex={position === index ? 0 : -1}
              ref={(node) => {
                pillRefs.current[position] = node;
              }}
              className={styles.pill}
              data-tone={pill.key}
              onClick={() => setIndex(position)}
            >
              <span className={styles.pillBody} aria-hidden>
                <span className={styles.pillMark}>{pill.mark}</span>
              </span>
              <span className={styles.visuallyHidden}>
                {`${position + 1}. ${doseWord} — ${pill.title}, ${chakraLabel} ${pill.multiplier}`}
              </span>
            </button>
          ))}
        </div>

        <p className={styles.pillHint}>{keyboardHint}</p>
      </div>

      <div className={styles.scalePanel}>
        {active.image ? (
          <span className={styles.scaleArt} aria-hidden>
            <Image src={active.image} alt="" fill sizes="720px" />
          </span>
        ) : null}

        <p className={styles.scaleReading}>
          <span className={styles.scaleReadingLabel}>{chakraLabel}</span>
          <span className={styles.scaleReadingValue}>{active.multiplier}</span>
        </p>

        <h3 className={styles.scaleName}>{active.name}</h3>
        <p className={styles.scaleTitle}>{active.title}</p>

        <div className={styles.panText} data-side="gain">
          <p className={styles.panLabel}>{gainLabel}</p>
          <p className={styles.panBody}>{active.gain}</p>
        </div>

        <div className={styles.panText} data-side="cost">
          <p className={styles.panLabel}>{costLabel}</p>
          <p className={styles.panBody}>{active.cost}</p>
        </div>

        {active.danger ? (
          <div className={styles.danger} role="alert">
            <Flatline className={styles.dangerGlyph} />
            <p className={styles.dangerLabel}>{dangerLabel}</p>
            <p className={styles.dangerText}>{active.danger}</p>
            <p className={styles.dangerWing}>{wingNote}</p>
          </div>
        ) : null}

        {active.danger ? <p className={styles.coda}>{coda}</p> : null}
      </div>
    </div>
  );
}
