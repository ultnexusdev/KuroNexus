"use client";

import { useState } from "react";
import { ShukakuEye, ShukakuWatcher } from "./SandGlyphs";
import styles from "./GaaraExperience.module.css";

/**
 * "Shukaku" kabuğu — sayfanın kökü ve TEK durumu.
 *
 * Kompozisyon deseni (BRIEF §8): çocuklar SUNUCUDA çizilmiş gelir, bu
 * bileşen onları yalnızca taşır. Sayfanın gövdesi tarayıcıya JS olarak
 * inmez; istemciye inen tek şey bu düğme ve bir boolean.
 *
 * Modun bütün görsel etkisi CSS'te (`.page[data-shukaku]`): kum sertleşir
 * (yumuşak kenarlar keskinleşir), palet tek bir karışım oranı üzerinden
 * sarıya kayar (`--gaa-mix`), tipografi çatlar ve kenarlardaki tek gözlü
 * siluet görünür hâle gelir. JS hiçbir stil hesaplamıyor.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 */
export function ShukakuShell({
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
  const [loose, setLoose] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="gaara"
      data-shukaku={loose || undefined}
    >
      {/* Kenardan bakan tek göz. İki kopya: soldaki olduğu gibi, sağdaki
          CSS'te aynalanıyor. Mod kapalıyken ikisi de görünmez. */}
      <span className={styles.watchers} aria-hidden>
        <ShukakuWatcher
          className={styles.watcher}
          eyeClassName={styles.watcherEye}
        />
        <ShukakuWatcher
          className={styles.watcher}
          eyeClassName={styles.watcherEye}
        />
      </span>

      <button
        type="button"
        className={styles.modeToggle}
        aria-pressed={loose}
        onClick={() => setLoose((value) => !value)}
      >
        <ShukakuEye className={styles.modeGlyph} />
        <span className={styles.modeLabel}>{loose ? exitLabel : enterLabel}</span>
      </button>
      {/* Mod açıkken ne olduğunu söyleyen satır: ekran okuyucu için canlı
          bölge — düğmenin aria-pressed'i durumu, bu satır anlamı veriyor */}
      <p className={styles.modeHint} role="status">
        {loose ? hint : ""}
      </p>

      {children}
    </div>
  );
}
