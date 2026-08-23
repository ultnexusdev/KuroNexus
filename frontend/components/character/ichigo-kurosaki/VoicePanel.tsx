"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";
import { HollowMask } from "./MaskCrack";
import styles from "./IchigoExperience.module.css";

/**
 * "KİM KONUŞUYOR?" denetimi — sayfanın kalbi.
 *
 * Beş kademe: İnsan → Shinigami → Vizard → Tam Hollowlaşma → Son Getsuga
 * Tenshō. Kademe seçildikçe portrenin üstündeki MASKE ÖRTÜSÜ büyür,
 * katmanın reiatsu rengi döner ve künye satırları başka birinin ağzından
 * konuşur.
 *
 * ── ERİŞİLEBİLİRLİK ─────────────────────────────────────────────────────
 * Desen sekme (tab) deseni: `role="tablist"` + beş `role="tab"` + tek
 * `role="tabpanel"`. Gezinme klavyeyle tam: ok tuşları (dikey rayda ↑↓,
 * dar ekranda yatay olduğu için ←→ de kabul edilir), Home/End uçlara
 * gider. **Gezinen odak (roving tabindex)**: listede yalnızca seçili
 * sekme sekme-sırasında; ok tuşu hem seçimi hem odağı taşır — sekme
 * deseninin şartı bu, aksi hâlde beş düğme sekme sırasını doldururdu.
 *
 * ── SUNUCU/İSTEMCİ SINIRI ───────────────────────────────────────────────
 * Portre ve zemin görselleri SUNUCUDA çizilip `children` olarak iniyor
 * (`next/image` istemciye taşınmıyor). Buraya yalnızca kademe metinleri
 * DÜZ DİZE olarak geçiyor — `LocalizedText` istemciye hiç inmiyor.
 *
 * Örtünün büyümesi tek bir CSS değişkeniyle: `--cover` 0 → 1. Maskenin
 * kırpma çokgeni onunla ilerliyor, yani örtü yüzü tırtıklı bir kenarla
 * yiyor — çatlağın kendisi gibi.
 */

export interface StageView {
  key: string;
  name: string;
  kanji: string;
  cover: number;
  who: string;
  text: string;
  lines: { label: string; value: string }[];
}

const clampIndex = (value: number, length: number) =>
  ((value % length) + length) % length;

export function VoicePanel({
  stages,
  railLabel,
  hint,
  coverLabel,
  children,
}: {
  stages: StageView[];
  railLabel: string;
  hint: string;
  coverLabel: string;
  children: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = useCallback(
    (next: number) => {
      const target = clampIndex(next, stages.length);
      setIndex(target);
      /* Seçim ve odak birlikte taşınır — gezinen odak deseninin şartı */
      tabRefs.current[target]?.focus();
    },
    [stages.length],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      /* Dar ekranda ray yataya dönüyor: ok tuşlarının iki ekseni de kabul */
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        move(index + 1);
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        move(index - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        move(0);
      } else if (event.key === "End") {
        event.preventDefault();
        move(stages.length - 1);
      }
    },
    [index, move, stages.length],
  );

  const active = stages[index];
  const coverPercent = Math.round(active.cover * 100);

  return (
    <div className={styles.voice}>
      <div
        className={styles.voiceRail}
        role="tablist"
        aria-label={railLabel}
        aria-orientation="vertical"
      >
        {stages.map((stage, position) => {
          const selected = position === index;
          return (
            <button
              key={stage.key}
              type="button"
              role="tab"
              id={`ich-stage-tab-${stage.key}`}
              aria-selected={selected}
              aria-controls="ich-stage-panel"
              tabIndex={selected ? 0 : -1}
              ref={(node) => {
                tabRefs.current[position] = node;
              }}
              className={styles.voiceStop}
              data-stage={stage.key}
              data-selected={selected || undefined}
              onClick={() => setIndex(position)}
              onKeyDown={onKeyDown}
            >
              <span className={styles.voiceStopKanji} aria-hidden>
                {stage.kanji}
              </span>
              <span className={styles.voiceStopName}>{stage.name}</span>
              {/* Kademenin örtü payı — rayda ince bir ölçek çubuğu */}
              <span
                className={styles.voiceStopMeter}
                aria-hidden
                style={{ "--cover": stage.cover } as CSSProperties}
              />
            </button>
          );
        })}
        <p className={styles.voiceHint} aria-hidden>
          {hint}
        </p>
      </div>

      <div
        className={styles.voiceStage}
        role="tabpanel"
        id="ich-stage-panel"
        aria-labelledby={`ich-stage-tab-${active.key}`}
        tabIndex={-1}
        data-stage={active.key}
        style={{ "--cover": active.cover } as CSSProperties}
      >
        <div className={styles.stageBox}>
          {/* Portre + zemin sunucuda çizildi, buradan sadece geçiyor */}
          {children}
          <span className={styles.maskLayer} aria-hidden>
            <HollowMask />
          </span>
        </div>

        <div className={styles.stageBody}>
          <p className={styles.stageWho}>{active.who}</p>
          <h3 className={styles.stageName}>
            <span className={styles.stageNameKanji} aria-hidden>
              {active.kanji}
            </span>
            {active.name}
          </h3>
          <p className={styles.stageText}>{active.text}</p>
          <dl className={styles.stageLines}>
            {active.lines.map((line) => (
              <div key={line.label} className={styles.stageLine}>
                <dt>{line.label}</dt>
                <dd>{line.value}</dd>
              </div>
            ))}
            <div className={styles.stageLine} data-meter="">
              <dt>{coverLabel}</dt>
              <dd>
                <span className={styles.coverTrack} aria-hidden />
                <span className={styles.coverValue}>%{coverPercent}</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
