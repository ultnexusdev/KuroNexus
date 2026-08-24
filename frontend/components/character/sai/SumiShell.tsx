"use client";

import { useState } from "react";
import { BrushTip } from "./InkFigures";
import styles from "./SaiExperience.module.css";

/**
 * "Sumi modu" kabuğu — sayfanın kökü ve TEK durumu.
 *
 * Kompozisyon deseni (ev emsali `ShadowShell` / `GenjutsuShell`): çocuklar
 * SUNUCUDA çizilmiş gelir, bu bileşen onları yalnızca taşır. Tarayıcıya
 * inen tek JS bu düğme ve bir boolean; sayfanın gövdesi sunucuda kalıyor.
 *
 * Modun bütün etkisi CSS'te (`.page[data-sumi]`): mürekkep yıkaması
 * sayfaya yayılır, hatlar kalınlaşır, kâğıt ısısını kaybeder ve mühür
 * kızılı griye düşer. Sai'nin Kök'teki hâli tam olarak bu: kontrast var,
 * renk yok. JS hiçbir stil hesaplamıyor.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor (BRIEF §2).
 */
export function SumiShell({
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
  const [sumi, setSumi] = useState(false);

  return (
    <div className={styles.page} data-world="sai" data-sumi={sumi || undefined}>
      {/* Mürekkep yıkaması: sayfanın üst ve alt kenarından içeri sızan iki
          leke. Mod açıkken büyüyüp koyulaşıyor — "mürekkep yayıldı". */}
      <span className={styles.wash} aria-hidden />

      <button
        type="button"
        className={styles.sumiToggle}
        aria-pressed={sumi}
        onClick={() => setSumi((value) => !value)}
      >
        <BrushTip className={styles.sumiToggleGlyph} />
        <span className={styles.sumiToggleLabel}>
          {sumi ? exitLabel : enterLabel}
        </span>
      </button>
      {/* Düğmenin `aria-pressed`i durumu, bu satır anlamı veriyor */}
      <p className={styles.sumiHint} role="status">
        {sumi ? hint : ""}
      </p>

      {children}
    </div>
  );
}
