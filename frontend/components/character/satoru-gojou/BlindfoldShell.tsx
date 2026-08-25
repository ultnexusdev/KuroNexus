"use client";

import { useState } from "react";
import { BlindfoldBand, SixEyesIris } from "./LimitGlyphs";
import styles from "./SixEyesExperience.module.css";

/**
 * Gözbağı kabuğu — sayfanın kökü ve TEK modu.
 *
 * Kompozisyon deseni (BRIEF §8): çocuklar SUNUCUDA çizilmiş gelir, bu bileşen
 * onları yalnızca taşır. Sayfanın gövdesi tarayıcıya JS olarak inmiyor;
 * istemciye inen tek şey bu düğme ve bir boolean.
 *
 * ── MODUN NE YAPTIĞI ─────────────────────────────────────────────────────
 * Bant çözülünce Rikugan açılıyor ve sayfa "ölçmeye" başlıyor: her bölümde
 * sunucuda çizilmiş ama gizli duran OKUMA satırları görünür oluyor (aralık
 * kaç kere bölünüyor, teknik ne kadar tüketiyor, alan kaç saniye açık).
 * Ölçüm katmanı sayfanın kendi metniyle yarışmasın diye küçük, tek satırlık
 * ve notasyon ailesinde.
 *
 * Gizleme `display`/`visibility` ile yapılıyor (CSS'te), yani mod kapalıyken
 * o satırlar erişilebilirlik ağacında da YOK — ekran okuyucu kapalı bir
 * ölçümü okumuyor.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 */
export function BlindfoldShell({
  enterLabel,
  exitLabel,
  hint,
  children,
}: {
  enterLabel: string;
  exitLabel: string;
  hint: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="satoru-gojou"
      data-rikugan={open ? "true" : "false"}
    >
      {/* Ölçüm ızgarası: mod kapalıyken hiç görünmüyor, açılınca sayfanın
          arkasına çok soluk bir koordinat ağı iniyor. Ekranla birlikte
          sabit — kaydırdıkça ağ yerinde kalıyor. */}
      <span className={styles.grid} aria-hidden />

      <button
        type="button"
        className={styles.moodToggle}
        aria-pressed={open}
        onClick={() => setOpen((value) => !value)}
      >
        <BlindfoldBand
          className={styles.moodGlyph}
          bandClassName={styles.moodBand}
          slitClassName={styles.moodSlit}
          open={open}
        />
        <span className={styles.moodLabel}>{open ? exitLabel : enterLabel}</span>
      </button>

      {/* Mod açıkken ne olduğunu söyleyen satır: düğmenin aria-pressed'i
          durumu, bu satır anlamı taşıyor. */}
      <p className={styles.moodHint} role="status">
        {open ? hint : ""}
      </p>

      {/* İris yalnızca mod açıkken görünür; kapalıyken bandın altında. */}
      <span className={styles.irisMark} aria-hidden>
        <SixEyesIris
          className={styles.irisArt}
          ringClassName={styles.irisRing}
          pupilClassName={styles.irisPupil}
        />
      </span>

      {children}
    </div>
  );
}
