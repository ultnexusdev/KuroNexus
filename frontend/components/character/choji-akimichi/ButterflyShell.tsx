"use client";

import { useState } from "react";
import { ButterflyWings } from "./ChojiGlyphs";
import styles from "./ChojiExperience.module.css";

/**
 * "Kelebek Modu" kabuğu — sayfanın kökü ve TEK durumu.
 *
 * Kompozisyon deseni (BRIEF §8): çocuklar SUNUCUDA çizilmiş gelir, bu
 * bileşen onları yalnızca taşır. Sayfanın gövdesi tarayıcıya JS olarak
 * inmez; istemciye inen tek şey bu düğme, bir boolean ve kanat geometrisi.
 *
 * Modun bütün görsel etkisi CSS'te (`.page[data-butterfly]`): hero'daki
 * kanatlar açılır ve damarları çizilir, klan spirali canlanır, sayfa
 * altın-turuncu bir ışıkla dolar, display tipografisi bir kademe büyür
 * (`--cho-swell`). JS hiçbir stil hesaplamıyor.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor. Kök öğe
 * `styles.page` + `data-world="choji-akimichi"` ikilisini taşıyor — deri
 * bloğu tam olarak o seçiciye bağlı.
 */
export function ButterflyShell({
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
  const [open, setOpen] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="choji-akimichi"
      data-butterfly={open || undefined}
    >
      {/* Sayfayı dolduran sıcak ışık. Mod kapalıyken de var ama çok soluk:
          Chōji'nin dünyası hiçbir zaman soğuk değil, yalnızca kısık. */}
      <span className={styles.warmth} aria-hidden />

      <button
        type="button"
        className={styles.modeToggle}
        aria-pressed={open}
        onClick={() => setOpen((value) => !value)}
      >
        <ButterflyWings
          className={styles.modeGlyph}
          veinClassName={styles.modeGlyphVein}
        />
        <span className={styles.modeLabel}>{open ? exitLabel : enterLabel}</span>
      </button>
      {/* Mod açıkken ne olduğunu söyleyen satır: ekran okuyucu için de canlı
          bölge — düğmenin aria-pressed'i durumu, bu satır anlamı veriyor */}
      <p className={styles.modeHint} role="status">
        {open ? hint : ""}
      </p>

      {children}
    </div>
  );
}
