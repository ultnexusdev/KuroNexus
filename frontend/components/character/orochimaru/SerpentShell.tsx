"use client";

import { useState } from "react";
import { SerpentMark } from "./OrochimaruGlyphs";
import styles from "./OrochimaruExperience.module.css";

/**
 * "Yılan modu" kabuğu — sayfanın kökü ve TEK durumu.
 *
 * Kompozisyon deseni (ShadowShell emsali): çocuklar SUNUCUDA çizilmiş
 * gelir, bu bileşen onları yalnızca taşır. Böylece sayfanın gövdesi
 * tarayıcıya JS olarak inmez; istemciye inen tek şey bu düğme ve bir
 * boolean.
 *
 * Modun bütün görsel etkisi CSS'te (`.page[data-serpent]`): sayfanın
 * yüzeyine pul deseni çıkar, zemin soğuk yeşile kayar ve kutuların
 * kenarları kıvrılır. JS hiçbir stil hesaplamıyor.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 * `className={styles.page}` + `data-world="orochimaru"` ikilisi zorunlu —
 * deri bloğu tam olarak o seçiciye bağlı.
 */
export function SerpentShell({
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
  const [shed, setShed] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="orochimaru"
      data-serpent={shed || undefined}
    >
      {/* Pul yüzeyi: mod kapalıyken tamamen görünmez, açıkken sayfanın
          üstüne ince bir doku olarak çıkıyor. Tıklamaları geçirir. */}
      <span className={styles.scaleField} aria-hidden />

      <button
        type="button"
        className={styles.modeToggle}
        aria-pressed={shed}
        onClick={() => setShed((value) => !value)}
      >
        <SerpentMark className={styles.modeGlyph} />
        <span className={styles.modeLabel}>{shed ? exitLabel : enterLabel}</span>
      </button>
      {/* Mod açıkken ne olduğunu söyleyen satır: ekran okuyucu için canlı
          bölge — düğmenin aria-pressed'i durumu, bu satır anlamı veriyor */}
      <p className={styles.modeHint} role="status">
        {shed ? hint : ""}
      </p>

      {children}
    </div>
  );
}
