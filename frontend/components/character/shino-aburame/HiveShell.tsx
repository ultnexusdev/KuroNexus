"use client";

import { useState } from "react";
import { HiveLattice, HiveMark } from "./HiveGlyphs";
import styles from "./ShinoExperience.module.css";

/**
 * "Kovan modu" kabuğu — sayfanın kökü ve TEK durumu.
 *
 * Kompozisyon deseni (BRIEF §8): çocuklar SUNUCUDA çizilmiş gelir, bu
 * bileşen onları yalnızca taşır. Sayfanın gövdesi tarayıcıya JS olarak
 * inmiyor; istemciye inen tek şey bu düğme ve bir boolean.
 *
 * Modun bütün görsel etkisi CSS'te (`.page[data-hive]`): zemin peteği
 * belirginleşiyor, kenarlardaki böcekler içeri sürükleniyor ve sayfanın
 * dekoratif katmanları bir perdenin altında matlaşıyor. JS hiçbir stil
 * hesaplamıyor.
 *
 * ⚠️ Perde YALNIZCA dekor katmanlarının üstünde (z-index 0); metin ve
 * kartlar z-index 1'de duruyor. "Renk çekiliyor" hissi metnin kontrastına
 * dokunmadan elde ediliyor — sayfanın en sessiz sayfa olması metnin
 * okunmasını zorlaştırmak anlamına gelmiyor.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 */
export function HiveShell({
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
  const [swarming, setSwarming] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="shino-aburame"
      data-hive={swarming || undefined}
    >
      {/* Zemin dokusu: sayfanın altında duran petek */}
      <span className={styles.lattice} aria-hidden>
        <HiveLattice className={styles.latticeArt} />
      </span>
      {/* Kenarlardan içeri sürüklenen böcek şeritleri — mod açıkken */}
      <span className={styles.margins} aria-hidden>
        <span className={styles.marginBand} data-edge="left" />
        <span className={styles.marginBand} data-edge="right" />
      </span>
      {/* Dekoru matlaştıran perde; metnin ALTINDA kalır */}
      <span className={styles.veil} aria-hidden />

      <button
        type="button"
        className={styles.hiveToggle}
        aria-pressed={swarming}
        onClick={() => setSwarming((value) => !value)}
      >
        <HiveMark className={styles.hiveToggleGlyph} />
        <span className={styles.hiveToggleLabel}>
          {swarming ? exitLabel : enterLabel}
        </span>
      </button>
      {/* Mod açıkken ne olduğunu söyleyen satır: ekran okuyucu için de canlı
          bölge — düğmenin aria-pressed'i durumu, bu satır anlamı veriyor */}
      <p className={styles.hiveHint} role="status">
        {swarming ? hint : ""}
      </p>

      {children}
    </div>
  );
}
