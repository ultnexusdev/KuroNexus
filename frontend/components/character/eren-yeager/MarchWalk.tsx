"use client";

import { useState } from "react";
import Image from "next/image";
import { TitanCrowd } from "./ErenGlyphs";
import styles from "./RumblingExperience.module.css";

/**
 * "Yürüyüş" — sayfanın kalbi.
 *
 * ── MEKANİK (brief §Mekanik) ─────────────────────────────────────────────
 * Beş adım. Her adımda arkadaki duvar titanı siluetlerinin SAYISI katlanıyor
 * (1 → 10 → 100 → 1000 → sayısız) ve METİN SÜTUNU daralıyor. Yani ziyaretçi
 * ilerledikçe kalabalık büyüyor, açıklama küçülüyor; son adımda tek cümle
 * kalıyor. Ekseni yoğunluk: ne ölçek (Madara), ne sıcaklık (Naruto), ne
 * kademe sayacı (Neji).
 *
 * Sütun daralması gerçek bir ölçü değişimi: `--ern-say` inline olarak
 * `ch` biriminde iniyor ve metin kabı `max-width: min(100%, var(--ern-say))`
 * okuyor. `min(100%, …)` 360 pikselde taşmayı imkânsız kılıyor.
 *
 * Silüetler `TitanCrowd` içinde tek bir SVG deseniyle çiziliyor — gerekçe
 * ve karo hesabı orada.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Beş adım gerçek `<button>`; hepsi sekmeyle geziliyor ve `aria-pressed`
 * taşıyor. Sahne dekoratif (`aria-hidden`), yani bütün bilgi metinde: sayı,
 * adım numarası ve sütun genişliği yazıyla da okunuyor ve `role="status"`
 * satırı değişimi bildiriyor.
 */
export interface MarchStepView {
  key: string;
  kanji: string;
  numeral: string;
  count: string;
  tileW: number;
  tileH: number;
  measure: number;
  title: string;
  text: string;
}

export function MarchWalk({
  steps,
  scene,
  sceneAlt,
  slot,
  stageLabel,
  stepsLabel,
  advance,
  back,
  reset,
  countLabel,
  wordsLabel,
  stepLabel,
  statusSuffix,
  keyboardHint,
  closingNote,
}: {
  steps: MarchStepView[];
  /** `ern:jinarashi` yuvasındaki sahne — yoksa sahne yalnızca SVG */
  scene: string | null;
  sceneAlt: string;
  /** Sahnenin HEMEN ALTINDAKİ küratör yuvası (sunucudan geliyor) */
  slot: React.ReactNode;
  stageLabel: string;
  stepsLabel: string;
  advance: string;
  back: string;
  reset: string;
  countLabel: string;
  wordsLabel: string;
  stepLabel: string;
  statusSuffix: string;
  keyboardHint: string;
  closingNote: string;
}) {
  const [index, setIndex] = useState(0);
  const step = steps[index] ?? steps[0];
  const last = steps.length - 1;

  return (
    <div className={styles.march} data-step={index}>
      {/* ── Sahne ───────────────────────────────────────────────────── */}
      <div className={styles.crowdStage}>
        {scene ? (
          <Image
            className={styles.crowdScene}
            src={scene}
            alt={sceneAlt}
            fill
            sizes="(max-width: 900px) 100vw, 1100px"
          />
        ) : null}
        <TitanCrowd
          className={styles.crowdArt}
          tileW={step.tileW}
          tileH={step.tileH}
        />
        <span className={styles.crowdNumeral} aria-hidden>
          {step.numeral}
        </span>
        <span className={styles.crowdKanji} aria-hidden>
          {step.kanji}
        </span>
        <p className={styles.crowdCaption}>{stageLabel}</p>
      </div>

      {/* Yuva sahnenin HEMEN ALTINDA (kullanıcı şartı) */}
      {slot}

      {/* ── Beş adım ────────────────────────────────────────────────── */}
      <ol className={styles.marchSteps} aria-label={stepsLabel}>
        {steps.map((item, i) => (
          <li key={item.key} className={styles.marchStep}>
            <button
              type="button"
              className={styles.marchStepButton}
              aria-pressed={i === index}
              data-passed={i <= index ? "true" : "false"}
              onClick={() => setIndex(i)}
            >
              <span className={styles.marchStepKanji} aria-hidden>
                {item.kanji}
              </span>
              <span className={styles.marchStepCount}>{item.count}</span>
              <span className={styles.marchStepNumeral} aria-hidden>
                {item.numeral}
              </span>
            </button>
          </li>
        ))}
      </ol>

      {/* ── Kumanda ─────────────────────────────────────────────────── */}
      <div className={styles.marchControls}>
        <button
          type="button"
          className={styles.marchGhost}
          onClick={() => setIndex((v) => Math.max(0, v - 1))}
          disabled={index === 0}
        >
          {back}
        </button>
        <button
          type="button"
          className={styles.marchWalk}
          onClick={() => setIndex((v) => Math.min(last, v + 1))}
          disabled={index === last}
        >
          {advance}
        </button>
        <button
          type="button"
          className={styles.marchGhost}
          onClick={() => setIndex(0)}
          disabled={index === 0}
        >
          {reset}
        </button>
      </div>

      {/* ── Okuma satırı ────────────────────────────────────────────── */}
      <dl className={styles.marchReadout}>
        <div className={styles.marchReadItem}>
          <dt>{stepLabel}</dt>
          <dd>
            {index + 1} / {steps.length}
          </dd>
        </div>
        <div className={styles.marchReadItem}>
          <dt>{countLabel}</dt>
          <dd>{step.count}</dd>
        </div>
        <div className={styles.marchReadItem}>
          <dt>{wordsLabel}</dt>
          <dd>{step.measure} ch</dd>
        </div>
      </dl>

      <p className={styles.marchStatus} role="status">
        {`${index + 1}. ${stepLabel} — ${step.count} ${statusSuffix}`}
      </p>

      {/* ── Daralan sütun ───────────────────────────────────────────── */}
      <div
        className={styles.sayBody}
        style={{ "--ern-say": `${step.measure}ch` } as React.CSSProperties}
      >
        <h3 className={styles.sayTitle}>{step.title}</h3>
        <p className={styles.sayText}>{step.text}</p>
      </div>

      <p className={styles.marchNote}>{closingNote}</p>
      <p className={styles.marchHint}>{keyboardHint}</p>
    </div>
  );
}
