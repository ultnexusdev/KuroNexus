"use client";

import { useState } from "react";
import { ShadowKnot } from "./ShadowGlyphs";
import styles from "./ShikamaruExperience.module.css";

/**
 * "Gölge modu" kabuğu — sayfanın kökü ve TEK durumu.
 *
 * `GenjutsuShell` emsalinin kardeşi (kompozisyon deseni): çocuklar
 * SUNUCUDA çizilmiş gelir, bu bileşen onları yalnızca taşır. Böylece
 * sayfanın gövdesi tarayıcıya JS olarak inmez; istemciye inen tek şey bu
 * düğme ve bir boolean.
 *
 * Modun bütün görsel etkisi CSS'te (`.page[data-shadow]`): öğe gölgeleri
 * uzar, kartlar birbirine gölge bağıyla bağlanır, tahta ızgarası
 * belirginleşir. JS hiçbir stil hesaplamıyor.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 */
export function ShadowShell({
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
  const [bound, setBound] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="shikamaru-nara"
      data-shadow={bound || undefined}
    >
      {/* Tahta: 9 sütunluk ızgara + yıldız noktaları. Sayfanın zemini,
          bütün bölümler bunun karelerine oturuyor. */}
      <span className={styles.board} aria-hidden />

      <button
        type="button"
        className={styles.shadowToggle}
        aria-pressed={bound}
        onClick={() => setBound((value) => !value)}
      >
        <ShadowKnot className={styles.shadowToggleGlyph} />
        <span className={styles.shadowToggleLabel}>
          {bound ? exitLabel : enterLabel}
        </span>
      </button>
      {/* Mod açıkken ne olduğunu söyleyen satır: ekran okuyucu için de
          canlı bölge — düğmenin aria-pressed'i durumu, bu satır anlamı
          veriyor */}
      <p className={styles.shadowHint} role="status">
        {bound ? hint : ""}
      </p>

      {children}
    </div>
  );
}
