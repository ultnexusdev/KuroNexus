"use client";

import { useState } from "react";
import { SteamMark } from "./HorizonGlyphs";
import styles from "./HorizonExperience.module.css";

/**
 * "Kolosal buhar" kabuğu — sayfanın kökü ve TEK modu.
 *
 * Kompozisyon deseni: `header` ve `children` SUNUCUDA çizilmiş gelir, bu
 * bileşen onları yalnızca taşır. İstemciye inen tek şey bu düğme ve bir
 * boolean.
 *
 * ── MODUN NE YAPTIĞI (eksen 5: ışık değil YAPI) ──────────────────────────
 *   analysis → iki kolon. Solda yapışkan defter sütunu, sağda olay. Zemin
 *              soğuk, harita konturları görünür.
 *   ruin     → buhar basıyor. Izgara TEK KOLONA çöküyor (`--arm-rail: 0`),
 *              defter sütunu DOM'dan çıkıyor, konturlar sönüyor, palet
 *              ısınıyor.
 *
 * Yani düğme sayfanın rengini değil ÖLÇÜSÜNÜ değiştiriyor: satır uzunluğu,
 * kolon sayısı ve okunan metnin genişliği hepsi kayıyor.
 *
 * ⚠️ Defter sütunu kaldırıldığında HİÇBİR KAYIT kaybolmuyor — o sütunda
 * yalnızca yorum var, veri değil (gerekçe: `ARMIN_NOTES` başlığı). Erişilebilirlik
 * açısından da bu şart: mod bir bilgi kapısı değil.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 */
export function SteamShell({
  enterLabel,
  exitLabel,
  stateLabel,
  stateAnalysis,
  stateRuin,
  hint,
  header,
  children,
}: {
  enterLabel: string;
  exitLabel: string;
  stateLabel: string;
  stateAnalysis: string;
  stateRuin: string;
  hint: string;
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  const [ruin, setRuin] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="armin-arlert"
      data-mode={ruin ? "ruin" : "analysis"}
    >
      {/* Dekor katmanları: deniz kayması ve kum tanesi. İkisi de metnin
          ALTINDA (`z-index: 0`) ve `pointer-events: none`. */}
      <span className={styles.sea} aria-hidden />
      <span className={styles.grain} aria-hidden />

      {header}

      <div className={styles.modeBar}>
        <button
          type="button"
          className={styles.modeToggle}
          aria-pressed={ruin}
          onClick={() => setRuin((value) => !value)}
        >
          <SteamMark hot={ruin} />
          <span className={styles.modeLabel}>{ruin ? exitLabel : enterLabel}</span>
        </button>

        {/* Durum renk ile değil YAZIYLA da veriliyor. */}
        <p className={styles.modeState}>
          <span className={styles.modeStateLabel}>{stateLabel}</span>
          <span className={styles.modeStateValue}>
            {ruin ? stateRuin : stateAnalysis}
          </span>
        </p>
      </div>

      <p className={styles.modeHint} role="status">
        {ruin ? hint : ""}
      </p>

      {children}
    </div>
  );
}
