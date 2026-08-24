"use client";

import { useRef, useState } from "react";
import { ChalkTray, ChalkUnderline, LessonDrawing } from "./ChalkGlyphs";
import styles from "./IrukaExperience.module.css";

/**
 * Kara tahta — sayfanın kalbi.
 *
 * Beş ders tahtada alt alta duruyor. Bir ders seçilince o dersin tebeşir
 * çizimi ÇİZİLİR (SVG stroke animasyonu) ve altındaki panelde dersin sınıf
 * dışındaki karşılığı açılır. Beşinci satırın yazısı yok: tahtada yeri var,
 * üstü boş.
 *
 * ── NEDEN BEŞ ÇİZİM DE MONTE ─────────────────────────────────────────────
 * Yalnızca etkin çizim monte edilseydi, ders değişince React yeni bir düğüm
 * takardı ve CSS geçişi ilk çizimde HİÇ koşmazdı (yeni eklenen düğümde
 * geçiş tetiklenmez) — yazı belirir, yazılmazdı. Beşi de duruyor, `data-on`
 * yalnızca etkin olanda: nitelik değiştiği için geçiş gerçekten koşuyor ve
 * bir yan etki bedava geliyor — eski çizim geri çekilirken yenisi yazılıyor,
 * yani tahta kendini siliyor.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Desen: dikey tab listesi, otomatik etkinleştirme. Gezinme:
 *   ↑ ↓ (ve ← →) : önceki/sonraki ders      Home/End : ilk/son ders
 * Ayrıca iki gerçek düğme var; ok tuşu bilmeyen ya da dokunmatik kullanan
 * ziyaretçi onlarla geziyor. Roving tabindex: yalnızca etkin satır tab
 * sırasında. Metin sunucuda seçilmiş düz dize olarak iniyor (BRIEF §5).
 */

export interface LessonView {
  key: string;
  chalk: string;
  taught: string;
  real: string;
  glyphAlt: string;
  blank: boolean;
}

export function Blackboard({
  lessons,
  listLabel,
  lessonWord,
  taughtLabel,
  realLabel,
  prevLabel,
  nextLabel,
  keyboardHint,
  blankRowLabel,
  trayLabel,
}: {
  lessons: LessonView[];
  listLabel: string;
  lessonWord: string;
  taughtLabel: string;
  realLabel: string;
  prevLabel: string;
  nextLabel: string;
  keyboardHint: string;
  blankRowLabel: string;
  trayLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = lessons[index];
  if (!active) {
    return null;
  }

  /* Satırlar arası geçişte odak da taşınır — klavye kullanıcısı seçtiği
     satırın üstünde kalmalı (roving tabindex şartı). */
  const focusRow = (next: number) => {
    const clamped = (next + lessons.length) % lessons.length;
    setIndex(clamped);
    rowRefs.current[clamped]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        focusRow(index + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        focusRow(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusRow(0);
        break;
      case "End":
        event.preventDefault();
        focusRow(lessons.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.board} data-lesson={index}>
      {/* ── Tahtanın kendisi ─────────────────────────────────────────── */}
      <div className={styles.slate}>
        <div
          className={styles.slateList}
          role="tablist"
          aria-orientation="vertical"
          aria-label={listLabel}
          onKeyDown={onKeyDown}
        >
          {lessons.map((lesson, position) => (
            <button
              key={lesson.key}
              type="button"
              role="tab"
              id={`iru-lesson-tab-${lesson.key}`}
              aria-selected={position === index}
              aria-controls="iru-lesson-panel"
              tabIndex={position === index ? 0 : -1}
              ref={(node) => {
                rowRefs.current[position] = node;
              }}
              className={styles.slateRow}
              data-blank={lesson.blank ? "true" : undefined}
              onClick={() => setIndex(position)}
            >
              <span className={styles.rowNumber} aria-hidden>
                {position + 1}
              </span>
              {lesson.blank ? (
                <>
                  <span className={styles.rowBlank} aria-hidden />
                  <span className={styles.visuallyHidden}>
                    {`${position + 1}. ${lessonWord} — ${blankRowLabel}`}
                  </span>
                </>
              ) : (
                <span className={styles.rowChalk}>{lesson.chalk}</span>
              )}
              <ChalkUnderline
                drawn={position === index}
                className={styles.rowUnderline}
                strokeClassName={styles.chalkStroke}
              />
            </button>
          ))}
        </div>

        {/* Beşi de monte; yalnızca etkin olanda `data-on` var (bkz. dosya başı) */}
        <div className={styles.slateArt}>
          {lessons.map((lesson, position) => (
            <span
              key={lesson.key}
              className={styles.slateArtLayer}
              data-on={position === index ? "true" : undefined}
            >
              <LessonDrawing
                lesson={lesson.key}
                drawn={position === index}
                className={styles.lessonDrawing}
                strokeClassName={styles.chalkStroke}
                title={position === index ? lesson.glyphAlt : undefined}
              />
            </span>
          ))}
        </div>
      </div>

      {/* ── Tebeşir oluğu: tahtanın altındaki ahşap raf ──────────────── */}
      <div className={styles.tray}>
        <ChalkTray className={styles.trayArt} />
        <p className={styles.trayNote}>{trayLabel}</p>
      </div>

      {/* ── Dersin altı: sınıfın içi ve dışı ─────────────────────────── */}
      <div
        id="iru-lesson-panel"
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`iru-lesson-tab-${active.key}`}
        className={styles.lessonPanel}
      >
        <p className={styles.lessonCount}>
          <span className={styles.lessonCountNumber} aria-hidden>
            {index + 1}
          </span>
          <span className={styles.lessonCountWord}>
            {`${lessonWord} · ${index + 1} / ${lessons.length}`}
          </span>
        </p>
        <div className={styles.lessonBlock}>
          <p className={styles.lessonLabel}>{taughtLabel}</p>
          <p className={styles.lessonText}>{active.taught}</p>
        </div>
        <div className={styles.lessonBlock} data-kind="real">
          <p className={styles.lessonLabel}>{realLabel}</p>
          <p className={styles.lessonText}>{active.real}</p>
        </div>
      </div>

      <div className={styles.lessonNav}>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => setIndex((value) => Math.max(value - 1, 0))}
          disabled={index === 0}
        >
          <span aria-hidden>↑</span>
          {prevLabel}
        </button>
        <button
          type="button"
          className={styles.navButton}
          onClick={() =>
            setIndex((value) => Math.min(value + 1, lessons.length - 1))
          }
          disabled={index === lessons.length - 1}
        >
          {nextLabel}
          <span aria-hidden>↓</span>
        </button>
      </div>
      <p className={styles.boardHint}>{keyboardHint}</p>
    </div>
  );
}
