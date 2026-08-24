"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  ArmoryScatter,
  ScrollRod,
  ScrollRoll,
  WeaponGlyph,
} from "./TentenArms";
import type { TentenArm } from "@/lib/characters/tenten-experience";
import styles from "./TentenExperience.module.css";

/**
 * Silah Parşömeni — sayfanın kalbi.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * İki durum var ve ikisi birbirine bağlı:
 *   `active` → hangi silah panelde açık
 *   `open`   → tomar kaç kare aşağı açıldı (1–8)
 *
 * Bir kare seçmek tomarı ORAYA KADAR açar (`open = max(open, index + 1)`)
 * ve bir daha kapatmaz: açılan kare açık kalır. Bunun görünür sonucu iki
 * yerde:
 *   1. Kâğıdın yüksekliği `--ten-open` değişkeniyle büyür; alttaki rulo
 *      akışta kâğıdın peşinden aşağı iner (JS konum hesaplamıyor).
 *   2. Bölümün arka planındaki cephanelik BİRİKİR — sekmeli bir panelin
 *      aksine önceki silah kaybolmuyor, sayfada kalıyor (`ArmoryScatter`).
 *
 * Metin sunucuda seçilmiş düz dize olarak iniyor (BRIEF §5): bu ada
 * `LocalizedText` görmüyor.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Desen: dikey sekme listesi (`aria-orientation="vertical"`), otomatik
 * etkinleştirme. Gezinme:
 *   ↑ ↓ (ve ← →) : önceki/sonraki mühür     Home/End : ilk/son mühür
 * Roving tabindex: tab sırasında yalnızca etkin sekme var. Ayrıca iki
 * gerçek düğme (yukarı/aşağı) — ok tuşu bilmeyen ya da dokunmatik kullanan
 * ziyaretçi onlarla geziyor.
 *
 * ⚠️ Kâğıt `overflow: clip` ile kırpılıyor, `hidden` ile DEĞİL: `hidden`
 * bir kaydırma kabı üretir ve henüz açılmamış bir kareye odak gittiğinde
 * tarayıcı kabı kaydırıp kâğıdı içeriden kaydırırdı. `clip` kaydırma kabı
 * açmıyor; odak alan kare zaten aynı anda açılıyor ve görünür oluyor.
 */

export interface ArmView {
  key: TentenArm["key"];
  kanji: string;
  name: string;
  turkish: string;
  note: string;
  moment: string;
  image: string | null;
}

export function WeaponScroll({
  arms,
  listLabel,
  sealWord,
  prevLabel,
  nextLabel,
  momentLabel,
  openLabel,
  keyboardHint,
  rigAlt,
  armoryAlt,
}: {
  arms: ArmView[];
  listLabel: string;
  sealWord: string;
  prevLabel: string;
  nextLabel: string;
  momentLabel: string;
  openLabel: string;
  keyboardHint: string;
  rigAlt: string;
  armoryAlt: string;
}) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(1);
  const sealRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const current = arms[active];
  if (!current) {
    return null;
  }

  /** Kare seç: tomar oraya kadar açılır ve o kadar açık kalır. */
  const select = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), arms.length - 1);
    setActive(clamped);
    setOpen((value) => Math.max(value, clamped + 1));
  };

  /* Sekmeler arası geçişte odak da taşınır — klavye kullanıcısı seçtiği
     karenin üstünde kalmalı (roving tabindex şartı). */
  const focusSeal = (index: number) => {
    const wrapped = (index + arms.length) % arms.length;
    select(wrapped);
    sealRefs.current[wrapped]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        focusSeal(active + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        focusSeal(active - 1);
        break;
      case "Home":
        event.preventDefault();
        focusSeal(0);
        break;
      case "End":
        event.preventDefault();
        focusSeal(arms.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={styles.scroll}
      data-open={open}
      style={{ "--ten-open": open } as React.CSSProperties}
    >
      {/* Arka plan: açılan her kareyle bir silah daha ekleniyor */}
      <span className={styles.armoryWrap} role="img" aria-label={armoryAlt}>
        <ArmoryScatter
          open={open}
          className={styles.armory}
          pieceClassName={styles.armoryPiece}
        />
      </span>

      {/* ── TOMAR ───────────────────────────────────────────────────────
          ⚠️ Bu düğüme `role="img"` KONMAZ: içinde gerçek düğmeler var ve
          role="img" bütün alt ağacı sunum katmanına indirip sekmeleri
          erişilebilirlik ağacından silerdi. Şemanın tarifi bunun yerine
          görünmez bir satır olarak veriliyor. */}
      <div className={styles.rig}>
        <p className={styles.visuallyHidden}>{rigAlt}</p>
        <ScrollRod className={styles.rod} />

        <div className={styles.paper}>
          <span className={styles.paperGrain} aria-hidden />
          <div
            className={styles.seals}
            role="tablist"
            aria-orientation="vertical"
            aria-label={listLabel}
            onKeyDown={onKeyDown}
          >
            {arms.map((arm, index) => (
              <button
                key={arm.key}
                type="button"
                role="tab"
                id={`ten-seal-${arm.key}`}
                aria-selected={index === active}
                aria-controls="ten-arm-panel"
                tabIndex={index === active ? 0 : -1}
                ref={(node) => {
                  sealRefs.current[index] = node;
                }}
                className={styles.seal}
                data-drawn={index < open ? "true" : undefined}
                onClick={() => select(index)}
              >
                <span className={styles.sealSquare} aria-hidden>
                  <span className={styles.sealKanji}>{arm.kanji}</span>
                  <WeaponGlyph name={arm.key} className={styles.sealGlyph} />
                </span>
                <span className={styles.sealName}>{arm.name}</span>
              </button>
            ))}
          </div>
        </div>

        <ScrollRoll className={styles.roll} />

        <p className={styles.rigCount}>
          <span className={styles.rigCountLabel}>{openLabel}</span>
          <span className={styles.rigCountValue}>
            {open}
            <span className={styles.rigCountTotal}>/ {arms.length}</span>
          </span>
        </p>
      </div>

      {/* ── PANEL ─────────────────────────────────────────────────────── */}
      <div className={styles.panelWrap}>
        <div
          id="ten-arm-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`ten-seal-${current.key}`}
          className={styles.panel}
        >
          {current.image ? (
            <span className={styles.panelArt} aria-hidden>
              <Image src={current.image} alt="" fill sizes="720px" />
            </span>
          ) : null}

          {/* `key` bilerek: silah değişince düğüm yeniden takılıyor ve
              "kâğıttan çıkma" hareketi baştan oynuyor */}
          <span key={current.key} className={styles.panelGlyphWrap} aria-hidden>
            <WeaponGlyph name={current.key} className={styles.panelGlyph} />
          </span>

          <p className={styles.panelKanji} aria-hidden>
            {current.kanji}
          </p>
          <p className={styles.panelSeal}>
            {sealWord} {active + 1}
          </p>
          <h3 className={styles.panelName}>{current.name}</h3>
          <p className={styles.panelTurkish}>{current.turkish}</p>
          <p className={styles.panelNote}>{current.note}</p>

          <div className={styles.panelBlock}>
            <p className={styles.panelLabel}>{momentLabel}</p>
            <p className={styles.panelText}>{current.moment}</p>
          </div>
        </div>

        <div className={styles.panelNav}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => select(active - 1)}
            disabled={active === 0}
          >
            <span aria-hidden>↑</span>
            {prevLabel}
          </button>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => select(active + 1)}
            disabled={active === arms.length - 1}
          >
            {nextLabel}
            <span aria-hidden>↓</span>
          </button>
        </div>
        <p className={styles.panelHint}>{keyboardHint}</p>
      </div>
    </div>
  );
}
