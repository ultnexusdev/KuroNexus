"use client";

import { useState } from "react";
import { HairFan, NineStrands } from "./UzumakiGlyphs";
import styles from "./KushinaExperience.module.css";

/**
 * "Kızıl Habanero" kabuğu — sayfanın kökü ve TEK durumu.
 *
 * Kompozisyon deseni (BRIEF §8): çocuklar SUNUCUDA çizilmiş gelir, bu
 * bileşen onları yalnızca taşır. Sayfanın gövdesi tarayıcıya JS olarak
 * inmez; istemciye inen tek şey bu düğme ve bir boolean.
 *
 * Modun bütün görsel etkisi CSS'te (`.page[data-habanero]`): dokuz saç teli
 * sayfaya yayılır, `--kus-heat` sıfırdan yüze çıkıp bütün ısı karışımlarını
 * açar, başlıkların ağırlığı ve harf aralığı bir kademe sertleşir. JS
 * hiçbir stil hesaplamıyor.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 */
export function HabaneroShell({
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
  const [angry, setAngry] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="kushina-uzumaki"
      data-habanero={angry || undefined}
    >
      {/* Dokuz tel: mod kapalıyken görünmez, açılınca sayfanın üstüne
          yayılır. Ekran boyunca sabit — kaydırdıkça saç yerinde kalır. */}
      <span className={styles.veil} aria-hidden>
        <NineStrands className={styles.veilArt} />
      </span>

      <button
        type="button"
        className={styles.moodToggle}
        aria-pressed={angry}
        onClick={() => setAngry((value) => !value)}
      >
        <HairFan className={styles.moodGlyph} strands={9} />
        <span className={styles.moodLabel}>{angry ? exitLabel : enterLabel}</span>
      </button>
      {/* Mod açıkken ne olduğunu söyleyen satır: ekran okuyucu için canlı
          bölge — düğmenin aria-pressed'i durumu, bu satır anlamı veriyor */}
      <p className={styles.moodHint} role="status">
        {angry ? hint : ""}
      </p>

      {children}
    </div>
  );
}
