"use client";

import { useState } from "react";
import { RootFan, Sprout } from "./WoodGlyphs";
import styles from "./YamatoExperience.module.css";

/**
 * "Mokuton modu" kabuğu — sayfanın kökü ve TEK global durumu.
 *
 * Kompozisyon deseni (BRIEF §8): çocuklar SUNUCUDA çizilmiş gelir, bu bileşen
 * onları yalnızca taşır. Sayfanın gövdesi tarayıcıya JS olarak inmez;
 * istemciye inen tek şey bu düğme, bir boolean ve iki SVG.
 *
 * Modun bütün görsel etkisi CSS'te (`.page[data-mokuton]`): köşeler
 * organikleşir (`--yam-round` 0'dan çıkar), ahşap kenarlardan içeri sızar,
 * gövdenin damarı belirginleşir ve yeşil derinleşir. JS hiçbir stil
 * hesaplamıyor.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 * `className={styles.page}` + `data-world="yamato"` ikilisi ZORUNLU —
 * deri bloğu tam olarak o seçiciye bağlı.
 */
export function MokutonShell({
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
  const [grown, setGrown] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="yamato"
      data-mokuton={grown || undefined}
    >
      {/* Sayfanın omurgası: içerik sütununun sol kenarında yükselen gövde.
          Damar CSS'te (tekrarlayan degrade), canlı kısım `.spineLive` —
          büyüme bölümündeki kademe yükseldikçe yukarı tırmanıyor. */}
      <span className={styles.spine} aria-hidden>
        <span className={styles.spineLive} />
      </span>

      <button
        type="button"
        className={styles.modeToggle}
        aria-pressed={grown}
        onClick={() => setGrown((value) => !value)}
      >
        <Sprout className={styles.modeGlyph} />
        <span className={styles.modeLabel}>{grown ? exitLabel : enterLabel}</span>
      </button>
      {/* Mod açıkken ne olduğunu söyleyen satır: ekran okuyucu için de canlı
          bölge — düğmenin aria-pressed'i durumu, bu satır anlamı veriyor */}
      <p className={styles.modeHint} role="status">
        {grown ? hint : ""}
      </p>

      {children}

      {/* Gövdenin dibi: sayfanın en altında kökler yelpazeleniyor */}
      <span className={styles.rootFanWrap} aria-hidden>
        <RootFan className={styles.rootFan} />
      </span>
    </div>
  );
}
