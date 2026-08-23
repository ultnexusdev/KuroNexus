"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ShadowBoard } from "./ShadowGlyphs";
import styles from "./ShikamaruExperience.module.css";

/**
 * Hamle zinciri — sayfanın kalbi.
 *
 * Beş hamle; her hamlede tahtadaki taş ilerler ve gölge bağı bir kademe
 * daha uzayıp dallanır (`ShadowBoard`). Metin sunucuda seçilmiş düz dize
 * olarak iniyor (BRIEF §5): bu ada `LocalizedText` görmüyor.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Desen: tek panelli tab listesi (WAI-ARIA "tabs with manual activation"
 * yerine otomatik etkinleştirme — her hamle bir sekme, panel tek ve
 * etkin sekmeye bağlanıyor). Gezinme:
 *   ← → : önceki/sonraki hamle      Home/End : ilk/son hamle
 * Ayrıca iki gerçek düğme (ileri/geri) var; ok tuşu bilmeyen ya da
 * dokunmatik kullanan ziyaretçi onlarla geziyor. Roving tabindex: yalnızca
 * etkin sekme tab sırasında.
 */

export interface MoveView {
  key: string;
  title: string;
  read: string;
  answer: string;
  image: string | null;
}

export function MoveChain({
  moves,
  listLabel,
  moveWord,
  prevLabel,
  nextLabel,
  readLabel,
  answerLabel,
  keyboardHint,
  boardAlt,
}: {
  moves: MoveView[];
  listLabel: string;
  moveWord: string;
  prevLabel: string;
  nextLabel: string;
  readLabel: string;
  answerLabel: string;
  keyboardHint: string;
  boardAlt: string;
}) {
  const [index, setIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = moves[index];
  if (!active) {
    return null;
  }

  /* Sekmeler arası geçişte odak da taşınır — klavye kullanıcısı seçtiği
     sekmenin üstünde kalmalı (roving tabindex şartı). */
  const focusTab = (next: number) => {
    const clamped = (next + moves.length) % moves.length;
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
        focusTab(moves.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.chain} data-move={index}>
      <div className={styles.chainBoard}>
        <ShadowBoard
          move={index}
          title={boardAlt}
          className={styles.boardArt}
          gridClassName={styles.boardGrid}
          strandClassName={styles.strand}
          pieceClassName={styles.koma}
          emberClassName={styles.boardEmber}
        />
        <p className={styles.chainCount}>
          <span className={styles.chainCountNumber}>{index + 1}</span>
          <span className={styles.chainCountTotal}>/ {moves.length}</span>
        </p>
      </div>

      <div className={styles.chainPanel}>
        <div
          className={styles.moveTabs}
          role="tablist"
          aria-label={listLabel}
          onKeyDown={onKeyDown}
        >
          {moves.map((move, position) => (
            <button
              key={move.key}
              type="button"
              role="tab"
              id={`shk-move-tab-${move.key}`}
              aria-selected={position === index}
              aria-controls="shk-move-panel"
              tabIndex={position === index ? 0 : -1}
              ref={(node) => {
                tabRefs.current[position] = node;
              }}
              className={styles.moveTab}
              onClick={() => setIndex(position)}
            >
              <span aria-hidden>{position + 1}</span>
              <span className={styles.visuallyHidden}>
                {`${position + 1}. ${moveWord} — ${move.title}`}
              </span>
            </button>
          ))}
        </div>

        <div
          id="shk-move-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`shk-move-tab-${active.key}`}
          className={styles.movePanel}
        >
          {active.image ? (
            <span className={styles.moveArt} aria-hidden>
              <Image src={active.image} alt="" fill sizes="720px" />
            </span>
          ) : null}
          <p className={styles.moveNumber}>
            <span aria-hidden>{index + 1}</span>
            <span className={styles.moveWord}>{moveWord}</span>
          </p>
          <h3 className={styles.moveTitle}>{active.title}</h3>
          <div className={styles.moveBlock}>
            <p className={styles.moveLabel}>{readLabel}</p>
            <p className={styles.moveText}>{active.read}</p>
          </div>
          <div className={styles.moveBlock} data-kind="answer">
            <p className={styles.moveLabel}>{answerLabel}</p>
            <p className={styles.moveText}>{active.answer}</p>
          </div>
        </div>

        <div className={styles.moveNav}>
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
              setIndex((value) => Math.min(value + 1, moves.length - 1))
            }
            disabled={index === moves.length - 1}
          >
            {nextLabel}
            <span aria-hidden>→</span>
          </button>
        </div>
        <p className={styles.chainHint}>{keyboardHint}</p>
      </div>
    </div>
  );
}
