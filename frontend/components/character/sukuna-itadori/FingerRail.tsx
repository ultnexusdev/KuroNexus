"use client";

import { useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { FingerGlyph } from "./VesselGlyphs";
import styles from "./VesselExperience.module.css";

/**
 * Parmak sayacı — sayfanın kalbi.
 *
 * Yirmi mühürlü parmaklık bir ray. Kaç tanesi yutulduysa lanet o kadar
 * geri gelmiş demek: seçim kabuğa çıkıyor (`--vsl-count`) ve oradan bütün
 * sayfaya iniyor. Yani bu bileşen bir "widget" değil, sayfanın ışık
 * ayarı.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────
 * Ray bir DEĞER SEÇİCİ, o yüzden `radiogroup`: yirmi düğme, biri seçili,
 * gezinme ok tuşlarında (WAI-ARIA radio deseni — gruba tek Tab durağı
 * düşer, yirmi değil). Home/End uçlara gider. Her düğme gerçek bir
 * `<button>`; dokunma hedefi 44 pikselin altına inmiyor (dar ekranda ray
 * beş sütuna sarıyor, sıkışmıyor).
 *
 * Metinler sunucuda seçilip düz dize olarak iniyor (BRIEF kural 5).
 */

export interface FingerRailMilestone {
  count: number;
  key: string;
  label: string;
  title: string;
  text: string;
}

export interface FingerRailProps {
  kanji: string;
  title: string;
  lede: string;
  hint: string;
  groupLabel: string;
  /** "{n}. parmak" — `{n}` sayıyla değişir */
  fingerLabel: string;
  readoutLabel: string;
  remainingLabel: string;
  milestoneBadge: string;
  /** "Son kilometre taşından bu yana {n} parmak daha." */
  betweenNote: string;
  milestones: FingerRailMilestone[];
  /** Küratör yuvası — sunucuda çizilip buraya düğüm olarak iniyor */
  slot?: ReactNode;
  count: number;
  onSelect: (count: number) => void;
}

const TOTAL = 20;
const FINGERS = Array.from({ length: TOTAL }, (_, index) => index + 1);

export function FingerRail({
  kanji,
  title,
  lede,
  hint,
  groupLabel,
  fingerLabel,
  readoutLabel,
  remainingLabel,
  milestoneBadge,
  betweenNote,
  milestones,
  slot,
  count,
  onSelect,
}: FingerRailProps) {
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const milestoneAt = new Map(milestones.map((stone) => [stone.count, stone]));
  /* Anlatı, geçilmiş SON kilometre taşınındır: arada duran parmaklar
     hikâyeyi ilerletiyor ama kendi sahneleri yok. */
  const reached = milestones.filter((stone) => stone.count <= count);
  const active = reached.length > 0 ? reached[reached.length - 1] : milestones[0];
  const gap = count - active.count;

  const move = (next: number) => {
    const clamped = Math.min(TOTAL, Math.max(1, next));
    onSelect(clamped);
    /* Odak yalnızca KLAVYE hareketinde taşınıyor: tıklamada tarayıcı
       zaten odağı düğmeye veriyor, ikinci bir focus() çağrısı gereksiz. */
    buttons.current[clamped - 1]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        move(count + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        move(count - 1);
        break;
      case "Home":
        event.preventDefault();
        move(1);
        break;
      case "End":
        event.preventDefault();
        move(TOTAL);
        break;
      default:
        break;
    }
  };

  return (
    <section className={styles.rail} aria-labelledby="vessel-rail-title">
      <header className={styles.railHead}>
        <p className={styles.railKanji} aria-hidden>
          {kanji}
        </p>
        <h2 id="vessel-rail-title" className={styles.sectionTitle}>
          {title}
        </h2>
        <p className={styles.sectionLede}>{lede}</p>
      </header>

      <div className={styles.gauge}>
        <p className={styles.gaugeReadout}>
          <span className={styles.gaugeNumber}>{count}</span>
          <span className={styles.gaugeTotal} aria-hidden>
            / {TOTAL}
          </span>
          <span className={styles.gaugeCaption}>{readoutLabel}</span>
          <span className={styles.gaugeRemaining}>
            {TOTAL - count} {remainingLabel}
          </span>
        </p>

        <div className={styles.railTrack}>
          <span className={styles.railFill} aria-hidden />
          <div
            className={styles.railGrid}
            role="radiogroup"
            aria-label={groupLabel}
            onKeyDown={onKeyDown}
          >
            {FINGERS.map((index) => {
              const stone = milestoneAt.get(index);
              const label = fingerLabel.replace("{n}", String(index));
              return (
                <button
                  key={index}
                  type="button"
                  role="radio"
                  aria-checked={index === count}
                  aria-label={stone ? `${label} — ${milestoneBadge}` : label}
                  tabIndex={index === count ? 0 : -1}
                  ref={(node) => {
                    buttons.current[index - 1] = node;
                  }}
                  className={styles.finger}
                  data-eaten={index <= count ? "" : undefined}
                  data-stone={stone ? "" : undefined}
                  onClick={() => onSelect(index)}
                >
                  <FingerGlyph className={styles.fingerGlyph} />
                  <span className={styles.fingerIndex} aria-hidden>
                    {stone ? stone.label : index}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <p className={styles.railHint}>{hint}</p>
      </div>

      <article className={styles.stone} aria-live="polite">
        <p className={styles.stoneBadge}>
          <span className={styles.stoneNumber} aria-hidden>
            {active.label}
          </span>
          {milestoneBadge}
        </p>
        <h3 className={styles.stoneTitle}>{active.title}</h3>
        <p className={styles.stoneText}>{active.text}</p>
        {gap > 0 ? (
          <p className={styles.stoneGap}>
            {betweenNote.replace("{n}", String(gap))}
          </p>
        ) : null}
      </article>

      {slot}
    </section>
  );
}
