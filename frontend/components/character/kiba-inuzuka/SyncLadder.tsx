"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { PackDiagram } from "./InuzukaGlyphs";
import styles from "./KibaExperience.module.css";

/**
 * Eş zamanlama merdiveni — sayfanın kalbi.
 *
 * ── NEDEN BU BÖLÜM VAR ───────────────────────────────────────────────────
 * Sayfanın tezi "iki beden, tek sürü". Burada tez bir metin iddiası değil,
 * DÜZENİN kendisi: iki sütun (solda Kiba, sağda Akamaru) kademe yükseldikçe
 * birbirine yaklaşıyor ve son kademede tek bir gövdeye kilitleniyor. Bütün
 * yakınlaşma CSS'te (`.duet[data-stage]`); bu ada yalnızca sayıyı tutuyor.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Desen: WAI-ARIA **radiogroup** (sekme listesi DEĞİL). Kademe, beş
 * seçenekten birinin seçilmesi — sekmelerin "aynı anda birden çok panel"
 * yapısı burada yanlış olurdu. Gezinme:
 *   ← ↑ : bir kademe geri     → ↓ : bir kademe ileri
 *   Home : ilk kademe         End : son kademe
 * Seçim odakla birlikte taşınır (radiogroup kuralı) ve roving tabindex
 * uygulanır: yalnızca seçili kademe tab sırasında.
 *
 * ⚠️ Oklar BİLEREK sarmıyor (radiogroup deseninin varsayılanı sarmaktır):
 * "kademe" sıralı bir merdiven, döngüsel bir seçim değil. Son kademeden
 * birinciye atlamak bölümün bütün anlatısını tersine çevirirdi. İki gerçek
 * düğme (geri/ileri) uçlarda pasifleşerek aynı sınırı gösteriyor.
 *
 * Metinler sunucuda seçilmiş düz dize olarak iniyor (BRIEF §5): bu ada
 * `LocalizedText` görmüyor.
 */

export interface SyncStageView {
  key: string;
  kanji: string;
  romaji: string;
  title: string;
  kiba: string;
  akamaru: string;
  bond: string;
  image: string | null;
}

export function SyncLadder({
  stages,
  groupLabel,
  stageWord,
  prevLabel,
  nextLabel,
  kibaColumn,
  akamaruColumn,
  kibaRole,
  akamaruRole,
  bondLabel,
  keyboardHint,
  diagramAlt,
}: {
  stages: SyncStageView[];
  groupLabel: string;
  stageWord: string;
  prevLabel: string;
  nextLabel: string;
  kibaColumn: string;
  akamaruColumn: string;
  kibaRole: string;
  akamaruRole: string;
  bondLabel: string;
  keyboardHint: string;
  diagramAlt: string;
}) {
  const [index, setIndex] = useState(0);
  const rungRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = stages[index];
  if (!active) {
    return null;
  }

  const last = stages.length - 1;

  /* Kademeler arası geçişte odak da taşınır — klavye kullanıcısı seçtiği
     kademenin üstünde kalmalı (roving tabindex şartı). */
  const focusRung = (next: number) => {
    const clamped = Math.min(Math.max(next, 0), last);
    setIndex(clamped);
    rungRefs.current[clamped]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusRung(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusRung(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusRung(0);
        break;
      case "End":
        event.preventDefault();
        focusRung(last);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.sync}>
      <div
        className={styles.ladder}
        role="radiogroup"
        aria-label={groupLabel}
        onKeyDown={onKeyDown}
      >
        {stages.map((stage, position) => (
          <button
            key={stage.key}
            type="button"
            role="radio"
            aria-checked={position === index}
            aria-controls="kib-sync-panel"
            tabIndex={position === index ? 0 : -1}
            ref={(node) => {
              rungRefs.current[position] = node;
            }}
            className={styles.rung}
            onClick={() => setIndex(position)}
          >
            <span className={styles.rungNumber} aria-hidden>
              {position + 1}
            </span>
            <span className={styles.rungTitle}>{stage.title}</span>
            <span className={styles.rungKanji} aria-hidden>
              {stage.kanji}
            </span>
          </button>
        ))}
      </div>

      <div id="kib-sync-panel" className={styles.stagePanel}>
        <header className={styles.stageHead}>
          <p className={styles.stageCount}>
            <span className={styles.stageCountNumber}>{index + 1}</span>
            <span className={styles.stageCountTotal}>
              / {stages.length} {stageWord}
            </span>
          </p>
          <h3 className={styles.stageTitle}>{active.title}</h3>
          <p className={styles.stageKanji} aria-hidden>
            {active.kanji}
          </p>
          <p className={styles.stageRomaji}>{active.romaji}</p>
        </header>

        {/* ── İKİ SÜTUN ────────────────────────────────────────────────
            Sıralama DOM'da mantıksal: Kiba, omurga, Akamaru. Kademe
            niteliği ızgarayı sürüyor; son kademede iki gövde tek bir
            çerçevenin içine giriyor. */}
        <div className={styles.duet} data-stage={index}>
          {active.image ? (
            <span className={styles.stageArt} aria-hidden>
              <Image src={active.image} alt="" fill sizes="960px" />
            </span>
          ) : null}

          <article className={styles.duetBody} data-who="kiba">
            <p className={styles.duetRole}>{kibaRole}</p>
            <p className={styles.duetName}>{kibaColumn}</p>
            <p className={styles.duetText}>{active.kiba}</p>
          </article>

          <div className={styles.spine}>
            <span className={styles.spineInner}>
              <PackDiagram
                stage={index}
                title={diagramAlt}
                className={styles.spineArt}
                cordClassName={styles.cord}
                stitchClassName={styles.stitch}
                bodyClassName={styles.spineBody}
                groundClassName={styles.spineGround}
              />
            </span>
          </div>

          <article className={styles.duetBody} data-who="akamaru">
            <p className={styles.duetRole}>{akamaruRole}</p>
            <p className={styles.duetName}>{akamaruColumn}</p>
            <p className={styles.duetText}>{active.akamaru}</p>
          </article>
        </div>

        {/* Kademenin özeti: kısa olduğu için canlı bölge olmayı hak ediyor —
            ekran okuyucu seçim değişince ne değiştiğini tek cümlede alır. */}
        <p className={styles.bond} role="status">
          <span className={styles.bondLabel}>{bondLabel}</span>
          <span className={styles.bondText}>{active.bond}</span>
        </p>
      </div>

      <div className={styles.stageNav}>
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
          onClick={() => setIndex((value) => Math.min(value + 1, last))}
          disabled={index === last}
        >
          {nextLabel}
          <span aria-hidden>→</span>
        </button>
      </div>

      <p className={styles.syncHint}>{keyboardHint}</p>
    </div>
  );
}
