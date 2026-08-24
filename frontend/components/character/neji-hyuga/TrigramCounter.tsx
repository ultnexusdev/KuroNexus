"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  TENKETSU_GROUP,
  TENKETSU_TOTAL,
  TRIGRAMS,
  TenketsuFigure,
  TrigramBars,
} from "./HyugaSigils";
import styles from "./NejiExperience.module.css";

/**
 * Sekiz trigram sayacı — sayfanın kalbi.
 *
 * Kademeler yatay bir rayda duruyor (mobilde dikey): 2 · 4 · 8 · 16 · 32 · 64,
 * ve dizinin dışında, ayrı duran 128. Bir kademeye basıldığında vuruşlar
 * SIFIRDAN o kademeye kadar ARDI ARDINA işaretleniyor: her vuruş şemadaki bir
 * tenketsu'yu kapatıyor, tempo ilerledikçe hızlanıyor (148 ms → 16 ms), sekiz
 * nokta tamamlandıkça o gruba ait trigram çubuğu yanıyor.
 *
 * 64'te dizi bitince sayfa bir an DURUYOR: `stillVeil` bütün görüntüyü
 * renginden ve ışığından arındırıp geri veriyor (1,15 sn).
 * 128'de aynı altmış dört nokta ikinci kez vuruluyor — `data-second`.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Ray gerçek düğmelerden oluşuyor; hepsi tab sırasında, seçili olan
 * `aria-pressed="true"`. Ok tuşları yalnızca ODAĞI taşıyor (kendiliğinden
 * diziyi başlatmıyor), Home/End uçlara gidiyor. Dizinin sonucu bir canlı
 * bölgeden okunuyor — sayım sırasında değil, bittiğinde.
 *
 * ── REDUCED MOTION ───────────────────────────────────────────────────────
 * `prefers-reduced-motion: reduce` olduğunda ardışık işaretleme HİÇ
 * çalışmıyor: sonuç doğrudan yazılıyor, sayfa durmuyor. Karar burada JS'te
 * veriliyor çünkü mesele bir geçişin süresi değil, işin kendisi.
 */

export interface StageView {
  key: string;
  strikes: number;
  separate: boolean;
  label: string;
  note: string;
}

/** Vuruş temposu: dizi ilerledikçe hızlanır, 16 ms'de dibe oturur. */
function beat(index: number): number {
  return Math.max(16, 148 - index * 7);
}

export function TrigramCounter({
  stages,
  railLabel,
  strikeWord,
  sealedLabel,
  emptyNote,
  hint,
  figureLabel,
  scene,
}: {
  stages: StageView[];
  railLabel: string;
  strikeWord: string;
  sealedLabel: string;
  emptyNote: string;
  hint: string;
  figureLabel: string;
  scene: string | null;
}) {
  /** `run` alanı aynı kademeye tekrar basıldığında diziyi baştan aldırıyor. */
  const [pick, setPick] = useState<{ index: number; run: number } | null>(null);
  const [strikes, setStrikes] = useState(0);
  const [running, setRunning] = useState(false);
  const [still, setStill] = useState(false);

  const strikeTimer = useRef<number | null>(null);
  const stillTimer = useRef<number | null>(null);
  const railRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(
    () => () => {
      if (strikeTimer.current !== null) {
        window.clearTimeout(strikeTimer.current);
      }
      if (stillTimer.current !== null) {
        window.clearTimeout(stillTimer.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!pick) {
      return undefined;
    }
    const target = stages[pick.index]?.strikes ?? 0;

    if (stillTimer.current !== null) {
      window.clearTimeout(stillTimer.current);
      stillTimer.current = null;
    }
    setStill(false);

    /* Ardışık işaretleme bir SÜSLEME değil, bilginin kendisi — ama hareket
       istemeyen ziyaretçiye sonucu doğrudan vermek daha dürüst. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStrikes(target);
      setRunning(false);
      return undefined;
    }

    let current = 0;
    setStrikes(0);
    setRunning(true);

    const step = () => {
      current += 1;
      setStrikes(current);
      if (current < target) {
        strikeTimer.current = window.setTimeout(step, beat(current));
        return;
      }
      strikeTimer.current = null;
      setRunning(false);
      if (target === TENKETSU_TOTAL) {
        setStill(true);
        stillTimer.current = window.setTimeout(() => {
          setStill(false);
          stillTimer.current = null;
        }, 1150);
      }
    };

    strikeTimer.current = window.setTimeout(step, 110);

    return () => {
      if (strikeTimer.current !== null) {
        window.clearTimeout(strikeTimer.current);
        strikeTimer.current = null;
      }
    };
  }, [pick, stages]);

  const moveFocus = (from: number, delta: number) => {
    const next = (from + delta + stages.length) % stages.length;
    railRefs.current[next]?.focus();
  };

  const onRailKeyDown = (event: React.KeyboardEvent<HTMLOListElement>) => {
    const from = railRefs.current.findIndex(
      (node) => node === document.activeElement,
    );
    if (from < 0) {
      return;
    }
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        moveFocus(from, 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        moveFocus(from, -1);
        break;
      case "Home":
        event.preventDefault();
        railRefs.current[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        railRefs.current[stages.length - 1]?.focus();
        break;
      default:
        break;
    }
  };

  const active = pick ? stages[pick.index] : undefined;
  const points = Math.min(strikes, TENKETSU_TOTAL);
  const second = Math.max(0, strikes - TENKETSU_TOTAL);

  return (
    <div
      className={styles.counter}
      data-run={running || undefined}
      data-still={still || undefined}
    >
      <ol
        className={styles.rail}
        aria-label={railLabel}
        onKeyDown={onRailKeyDown}
      >
        {stages.map((stage, index) => (
          <li
            key={stage.key}
            className={styles.railItem}
            data-step={index}
            data-separate={stage.separate || undefined}
          >
            <button
              type="button"
              className={styles.railButton}
              aria-pressed={pick?.index === index}
              data-reached={strikes >= stage.strikes || undefined}
              ref={(node) => {
                railRefs.current[index] = node;
              }}
              onClick={() =>
                setPick((value) => ({
                  index,
                  run: (value?.run ?? 0) + 1,
                }))
              }
            >
              <span className={styles.railNumber} aria-hidden>
                {stage.strikes}
              </span>
              <span className={styles.railLabel}>{stage.label}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className={styles.counterBody}>
        <div className={styles.counterStage}>
          {scene ? (
            <span className={styles.counterScene} aria-hidden>
              <Image src={scene} alt="" fill sizes="560px" />
            </span>
          ) : null}
          <TenketsuFigure
            struck={points}
            second={second}
            label={figureLabel}
            className={styles.figure}
            outlineClassName={styles.figureOutline}
            pathClassName={styles.figurePath}
            pointClassName={styles.point}
          />
          {/* Sekiz trigram: her grup sekiz nokta, grup dolunca çubuklar yanar */}
          <ol className={styles.trigramRow} aria-hidden>
            {TRIGRAMS.map((pattern, index) => (
              <li
                key={pattern.join("")}
                className={styles.trigram}
                data-on={
                  points >= (index + 1) * TENKETSU_GROUP || undefined
                }
              >
                <TrigramBars pattern={pattern} className={styles.trigramBars} />
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.counterReadout}>
          <p className={styles.counterNumber}>
            <span className={styles.counterDigits}>{strikes}</span>
            <span className={styles.counterUnit}>{strikeWord}</span>
          </p>
          <p className={styles.counterSealed}>
            <span className={styles.counterSealedValue}>{points}</span>
            <span className={styles.counterSealedLabel}>{sealedLabel}</span>
          </p>
          <p className={styles.counterNote}>{active ? active.note : emptyNote}</p>
          <p className={styles.counterHint}>{hint}</p>
          {/* Sayım sürerken susuyor: her vuruşu okumak bir gürültü olurdu */}
          <p className={styles.visuallyHidden} role="status">
            {running || !active
              ? ""
              : `${strikes} ${strikeWord} · ${points} ${sealedLabel}`}
          </p>
        </div>
      </div>

      {/* 64'te sayfanın durduğu an — rengi ve ışığı bir soluk boyunca çekilir */}
      {still ? <span className={styles.stillVeil} aria-hidden /> : null}
    </div>
  );
}
