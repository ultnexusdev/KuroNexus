"use client";

import { useState } from "react";
import { CageBirdMark } from "./HyugaSigils";
import styles from "./NejiExperience.module.css";

/**
 * "Kafes kırılıyor" kabuğu — sayfanın kökü ve TEK durumu.
 *
 * Kompozisyon deseni (ShadowShell emsali): çocuklar SUNUCUDA çizilmiş gelir,
 * bu bileşen onları yalnızca taşır. Sayfanın gövdesi tarayıcıya JS olarak
 * inmez; istemciye inen tek şey bu düğme ve bir boolean.
 *
 * Modun bütün görsel etkisi CSS'te (`.page[data-broken]`):
 *   · parmaklıklar ortasından ayrılır,
 *   · mühür çatlakları çizilir,
 *   · damar ağı uzar ve beyazlar,
 *   · bölüm başlıklarındaki KADER ön sözleri genişliğini kaybedip silinir.
 * JS hiçbir stil hesaplamıyor.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 * `className={styles.page}` + `data-world="neji-hyuga"` ikilisi ZORUNLU —
 * deri bloğu tam olarak o seçiciye bağlı.
 */
export function CageShell({
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
  const [broken, setBroken] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="neji-hyuga"
      data-broken={broken || undefined}
    >
      {/* Parmaklıklar: sayfanın zemini. Bütün bölümler bunların arasında
          duruyor; kafes kırıldığında ortadan bir bant açılıyor. */}
      <span className={styles.cage} aria-hidden />

      <button
        type="button"
        className={styles.cageToggle}
        aria-pressed={broken}
        onClick={() => setBroken((value) => !value)}
      >
        <CageBirdMark className={styles.cageToggleGlyph} />
        <span className={styles.cageToggleLabel}>
          {broken ? exitLabel : enterLabel}
        </span>
      </button>
      {/* Mod açıkken ne olduğunu söyleyen satır: ekran okuyucu için de canlı
          bölge — düğmenin aria-pressed'i durumu, bu satır anlamı veriyor */}
      <p className={styles.cageHint} role="status">
        {broken ? hint : ""}
      </p>

      {children}
    </div>
  );
}
