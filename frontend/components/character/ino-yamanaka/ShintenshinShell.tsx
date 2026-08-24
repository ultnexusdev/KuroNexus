"use client";

import { useState } from "react";
import { SwitchGlyph } from "./InoGlyphs";
import styles from "./InoExperience.module.css";

/**
 * "Shintenshin" kabuğu — sayfanın kökü ve TEK durumu.
 *
 * Kompozisyon deseni (`ShadowShell` / `ByakuganShell` emsali): çocuklar
 * SUNUCUDA çizilmiş gelir, bu bileşen onları yalnızca taşır. Sayfanın
 * gövdesi tarayıcıya JS olarak inmez; inen tek şey bu düğme ve bir sayaç.
 *
 * ── NEDEN SAYAÇ, NEDEN BOOLEAN DEĞİL ─────────────────────────────────────
 * Mod açılıp kapanırken sayfanın BİR AN ters dönmesi gerekiyor ve bu
 * dönüş iki yönde de koşmalı. CSS bir animasyonu ancak SEÇİCİ değişince
 * baştan başlatır; tek bir `data-shinten` niteliği açılırken tetikler,
 * kapanırken tetiklemez. Bu yüzden sayaç `data-turn` niteliğini "a" ile
 * "b" arasında gezdiriyor: her basışta uygulanan animasyonun ADI değişir
 * ve dönüş yeniden koşar. İlk çizimde nitelik hiç yok — sayfa açılır
 * açılmaz kendi kendine dönmesin diye.
 *
 * Modun geri kalan bütün görsel etkisi CSS'te (`.page[data-shinten]`):
 * renk sıcaklığı kayar, kenarlarda mor bir çerçeve kapanır, zemine
 * başkasının zihninin ışığı düşer. JS hiçbir stil hesaplamıyor.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 */
export function ShintenshinShell({
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
  const [turns, setTurns] = useState(0);
  const inside = turns % 2 === 1;

  return (
    <div
      className={styles.page}
      data-world="ino-yamanaka"
      data-shinten={inside || undefined}
      data-turn={turns === 0 ? undefined : inside ? "a" : "b"}
    >
      {/* Renk sıcaklığının kayması ve mor çerçeve: iki dekoratif katman,
          ikisi de yalnızca opaklıkla açılıp kapanıyor. */}
      <span className={styles.switchWash} aria-hidden />
      <span className={styles.switchFrame} aria-hidden />

      <button
        type="button"
        className={styles.switchToggle}
        aria-pressed={inside}
        onClick={() => setTurns((value) => value + 1)}
      >
        <SwitchGlyph className={styles.switchGlyph} />
        <span className={styles.switchLabel}>
          {inside ? exitLabel : enterLabel}
        </span>
      </button>
      {/* Mod açıkken ne olduğunu söyleyen satır. Düğmenin `aria-pressed`i
          durumu veriyor, bu canlı bölge anlamı. */}
      <p className={styles.switchHint} role="status">
        {inside ? hint : ""}
      </p>

      {children}
    </div>
  );
}
