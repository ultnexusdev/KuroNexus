"use client";

import { useState } from "react";
import { TwinDragon, TwinScrollKnot } from "./TentenArms";
import styles from "./TentenExperience.module.css";

/**
 * "Sōryū Tensakai" kabuğu — sayfanın kökü ve iki durumundan biri.
 *
 * Kompozisyon deseni (ev emsali `ShadowShell`): çocuklar SUNUCUDA çizilmiş
 * gelir, bu bileşen onları yalnızca taşır. Böylece sayfanın gövdesi
 * tarayıcıya JS olarak inmez; istemciye inen tek şey bu düğme, iki ejderha
 * şeridi ve bir boolean.
 *
 * Modun bütün görsel etkisi CSS'te (`.page[data-dragons]`): iki şerit
 * sayfanın kenarlarından yukarı çizilir, aradaki boşluğa silah yağmuru
 * dokusu iner, çelik yüzeyler parlar. JS hiçbir stil hesaplamıyor.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 * `className={styles.page}` + `data-world="tenten"` ikilisi ZORUNLU —
 * deri bloğu tam olarak o seçiciye bağlı.
 */
export function ScrollShell({
  modeName,
  enterLabel,
  exitLabel,
  hint,
  children,
}: {
  modeName: string;
  enterLabel: string;
  exitLabel: string;
  hint: string;
  children: React.ReactNode;
}) {
  const [risen, setRisen] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="tenten"
      data-dragons={risen || undefined}
    >
      {/* Silah yağmuru: ince diyagonal çelik izleri. Mod kapalıyken
          tamamen şeffaf, açıkken sayfanın orta koridoruna iniyor. */}
      <span className={styles.rain} aria-hidden />

      {/* İki tomar, iki ejderha — sayfanın iki kenarında */}
      <span className={styles.dragons} aria-hidden>
        <TwinDragon
          side="left"
          className={styles.dragon}
          bodyClassName={styles.dragonPart}
        />
        <TwinDragon
          side="right"
          className={styles.dragon}
          bodyClassName={styles.dragonPart}
        />
      </span>

      <button
        type="button"
        className={styles.modeToggle}
        aria-pressed={risen}
        onClick={() => setRisen((value) => !value)}
      >
        <TwinScrollKnot className={styles.modeGlyph} />
        <span className={styles.modeText}>
          <span className={styles.modeName}>{modeName}</span>
          <span className={styles.modeGloss}>
            {risen ? exitLabel : enterLabel}
          </span>
        </span>
      </button>

      {/* Mod açıkken ne olduğunu söyleyen satır: ekran okuyucu için canlı
          bölge — düğmenin aria-pressed'i durumu, bu satır anlamı veriyor */}
      <p className={styles.modeHint} role="status">
        {risen ? hint : ""}
      </p>

      {children}
    </div>
  );
}
