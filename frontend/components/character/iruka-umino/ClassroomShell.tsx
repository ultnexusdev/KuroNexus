"use client";

import { useState } from "react";
import { EraserGlyph } from "./ChalkGlyphs";
import styles from "./IrukaExperience.module.css";

/**
 * "Ders bitti" kabuğu — sayfanın kökü ve TEK durumu.
 *
 * `ShadowShell` / `GenjutsuShell` emsallerinin kardeşi (kompozisyon deseni):
 * çocuklar SUNUCUDA çizilmiş gelir, bu bileşen onları yalnızca taşır.
 * Sayfanın gövdesi tarayıcıya JS olarak inmez; istemciye inen tek şey bu
 * düğme ve bir boolean.
 *
 * Modun bütün görsel etkisi CSS'te (`.page[data-dusk]`): tahtadaki tebeşir
 * silinir, sıralardaki portreler solar, pencereden giren akşam ışığı
 * (`--iru-dusk`) kuvvetlenip aşağı iner, defter çizgileri söner. JS hiçbir
 * stil hesaplamıyor.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 */
export function ClassroomShell({
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
  const [dismissed, setDismissed] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="iruka-umino"
      data-dusk={dismissed || undefined}
    >
      {/* Defterin çizgileri: sayfanın zemini. Yatay satırlar bütün bölümlerin
          altından geçiyor, soldaki kırmızı kenar çizgisi ise sayfanın
          omurgası — hero'daki yara çizgisiyle aynı token. */}
      <span className={styles.ruling} aria-hidden />
      <span className={styles.marginRule} aria-hidden />
      {/* Pencereden giren akşam ışığı — mod açıldığında aşağı iner */}
      <span className={styles.dusk} aria-hidden />

      <button
        type="button"
        className={styles.dismissToggle}
        aria-pressed={dismissed}
        onClick={() => setDismissed((value) => !value)}
      >
        <EraserGlyph className={styles.dismissGlyph} />
        <span className={styles.dismissLabel}>
          {dismissed ? exitLabel : enterLabel}
        </span>
      </button>
      {/* Mod açıkken ne olduğunu söyleyen satır: ekran okuyucu için canlı
          bölge — düğmenin aria-pressed'i durumu, bu satır anlamı veriyor */}
      <p className={styles.dismissHint} role="status">
        {dismissed ? hint : ""}
      </p>

      {children}
    </div>
  );
}
