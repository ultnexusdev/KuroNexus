"use client";

import { ScaleField } from "./KabutoGlyphs";
import { useState } from "react";
import styles from "./KabutoExperience.module.css";

/**
 * "Sennin modu — yılan" kabuğu: sayfanın kökü ve TEK sayfa durumu.
 *
 * Kompozisyon deseni (BRIEF §8): çocuklar SUNUCUDA çizilmiş gelir, bu bileşen
 * onları yalnızca taşır. Tarayıcıya inen tek şey bir düğme ve bir boolean;
 * sayfanın gövdesi JS olarak inmiyor.
 *
 * Modun bütün görsel etkisi CSS'te (`.page[data-sage]`): pullar portreyi
 * kaplar, camdaki yansıma söner ve ardındaki yılan gözü açılır, çizgiler
 * yeşile kayar, başlıkların altındaki ikinci gölge (yanlış kimliğin baskı
 * kayması) üst üste oturur. JS hiçbir stil hesaplamıyor.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor. `styles.page`
 * + `data-world` ikilisi ZORUNLU — dünya derisi tam olarak o seçiciye bağlı.
 */
export function SageShell({
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
  const [sage, setSage] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="kabuto-yakushi"
      data-sage={sage || undefined}
    >
      <button
        type="button"
        className={styles.sageToggle}
        aria-pressed={sage}
        onClick={() => setSage((value) => !value)}
      >
        <span className={styles.sageGlyph} aria-hidden>
          <ScaleField className={styles.sageGlyphScales} rows={5} cols={3} />
        </span>
        <span className={styles.sageLabel}>{sage ? exitLabel : enterLabel}</span>
      </button>
      {/* Durum satırı: düğmenin aria-pressed'i durumu, bu satır ANLAMI verir */}
      <p className={styles.sageHint} role="status">
        {sage ? hint : ""}
      </p>

      {children}
    </div>
  );
}
