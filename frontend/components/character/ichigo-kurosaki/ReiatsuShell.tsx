"use client";

import { useState } from "react";
import { MoonSlash } from "./MaskCrack";
import styles from "./IchigoExperience.module.css";

/**
 * Reiatsu modu kabuğu — sayfanın TEK durumu.
 *
 * İnce bir istemci sarmalayıcı: sayfanın kökünü çizer, `data-reiatsu`
 * niteliğini taşır ve düğmeyi tutar. Modun bütün görsel etkisi CSS'te —
 * basınç dalgası kenarlardan kızıla yıkanır, tipografi bir tık ağırlaşır,
 * çatlak parlar. Çocuklar SUNUCUDA çizilmiş gelir; bu bileşen onları
 * yalnızca taşır, yani sayfanın gövdesi tarayıcıya JS olarak inmez
 * (kompozisyon deseni).
 *
 * Kök öğe `<main>` DEĞİL: kök layout zaten `<main id="icerik">` çiziyor,
 * ikincisi geçersiz iç içe landmark olurdu.
 */
export function ReiatsuShell({
  enterLabel,
  exitLabel,
  note,
  children,
}: {
  enterLabel: string;
  exitLabel: string;
  note: string;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="ichigo-kurosaki"
      data-reiatsu={active || undefined}
    >
      <button
        type="button"
        className={styles.reiatsuToggle}
        aria-pressed={active}
        aria-describedby="ich-reiatsu-note"
        onClick={() => setActive((value) => !value)}
      >
        <MoonSlash className={styles.reiatsuIcon} />
        <span>{active ? exitLabel : enterLabel}</span>
      </button>
      <span id="ich-reiatsu-note" className={styles.visuallyHidden}>
        {note}
      </span>
      {/* Basınç dalgası: mod kapalıyken tamamen saydam, tıklama geçirmez */}
      <span className={styles.reiatsuWash} aria-hidden />
      {children}
    </div>
  );
}
