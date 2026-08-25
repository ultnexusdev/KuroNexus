"use client";

import { useState } from "react";
import { ClockMark } from "./RatioGlyphs";
import styles from "./RatioExperience.module.css";

/**
 * Mesai kabuğu — sayfanın kökü ve TEK modu.
 *
 * Kompozisyon deseni (BRIEF §8): çocuklar SUNUCUDA çizilmiş gelir, bu bileşen
 * onları yalnızca taşır. İstemciye inen tek şey bu düğme ve bir boolean.
 *
 * ── MODUN NE YAPTIĞI ─────────────────────────────────────────────────────
 * Nanami'nin bağlayıcı yemini saate bağlı: mesai içinde kendini tutuyor,
 * saat geçtikten sonra bırakıyor. Sayfa da aynı şeyi yapıyor ve bunu TEK bir
 * değişkenle anlatıyor: `--nan-major`.
 *
 *   mesai içinde  → --nan-major: 70%   → sayfadaki HER çizgi yüzde 70'te
 *                                        kırılıyor (başlık altları, kenarlar,
 *                                        şeritler; hepsi aynı gradyanı okuyor)
 *   mesai dışında → --nan-major: 100%  → çizgiler kırılmayı bırakıyor
 *
 * İkinci değişken `--nan-tint`: mesai bittiğinde sayfaya çok soluk bir deniz
 * rengi iniyor — Nanami'nin emeklilikte gitmek istediği yerin rengi. Renk
 * hiçbir metnin üstünde değil, yalnızca zeminde.
 *
 * Gojō'nun ölçüm modundan, Megumi'nin ışık modundan ve Nobara'nın ses
 * modundan farkı: burada mod sayfanın ORANINI değiştiriyor.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 */
export function OvertimeShell({
  enterLabel,
  exitLabel,
  hint,
  clockLabel,
  clockOn,
  clockOff,
  children,
}: {
  enterLabel: string;
  exitLabel: string;
  hint: string;
  clockLabel: string;
  clockOn: string;
  clockOff: string;
  children: React.ReactNode;
}) {
  const [after, setAfter] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="kento-nanami"
      data-overtime={after ? "true" : "false"}
    >
      {/* Deniz yıkaması: mesai bittiğinde sayfanın zemine inen tek renk */}
      <span className={styles.tint} aria-hidden />

      <div className={styles.moodBar}>
        <button
          type="button"
          className={styles.moodToggle}
          aria-pressed={after}
          onClick={() => setAfter((value) => !value)}
        >
          <ClockMark
            className={styles.moodGlyph}
            ringClassName={styles.moodClockRing}
            handClassName={styles.moodClockHand}
            wedgeClassName={styles.moodClockWedge}
            off={after}
          />
          <span className={styles.moodLabel}>
            {after ? exitLabel : enterLabel}
          </span>
        </button>

        {/* Saat: modun sayısal karşılığı. Renk tek gösterge olmasın diye
            durum ayrıca YAZIYLA duruyor. */}
        <p className={styles.clock}>
          <span className={styles.clockLabel}>{clockLabel}</span>
          <span className={styles.clockValue}>{after ? clockOff : clockOn}</span>
        </p>
      </div>

      <p className={styles.moodHint} role="status">
        {after ? hint : ""}
      </p>

      {children}
    </div>
  );
}
