"use client";

import { useState } from "react";
import { CrackOverlay, EyePatchMark } from "./KenpachiMarks";
import styles from "./KenpachiExperience.module.css";

/**
 * Kenpachi modu kabuğu — sayfanın tek durum tutan dış katmanı.
 *
 * Tek `useState`: `data-kenpachi`. Etkinin tamamı CSS'te (göz bandı düşer,
 * reiatsu sarısı taşar, kenarlar çatlar, tipografi ağırlaşır). Çocuklar
 * SUNUCUDA çizilmiş olarak geliyor; bu bileşen onları yalnızca taşıyor —
 * yani sayfanın gövdesi tarayıcıya JS olarak inmiyor (GenjutsuShell
 * emsalindeki kompozisyon deseni).
 *
 * Kök `<main>` DEĞİL: kök layout zaten `<main id="icerik">` çiziyor.
 */
export function KenpachiShell({
  enterLabel,
  exitLabel,
  children,
}: {
  enterLabel: string;
  exitLabel: string;
  children: React.ReactNode;
}) {
  const [unleashed, setUnleashed] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="kenpachi-zaraki"
      data-kenpachi={unleashed || undefined}
    >
      <button
        type="button"
        className={styles.modeToggle}
        aria-pressed={unleashed}
        onClick={() => setUnleashed((value) => !value)}
      >
        <EyePatchMark className={styles.modeIcon} />
        <span className={styles.modeLabel}>
          {unleashed ? exitLabel : enterLabel}
        </span>
      </button>
      {/* Çatlaklar — yalnızca mod açıkken görünür, tıklama geçirmez */}
      <CrackOverlay className={styles.crackLayer} />
      {children}
    </div>
  );
}
