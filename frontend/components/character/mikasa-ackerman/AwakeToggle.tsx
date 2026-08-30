"use client";

import { ScarfKnot } from "./ScarfGlyphs";
import { useScarf } from "./ScarfShell";
import styles from "./ScarfExperience.module.css";

/**
 * "Ackerman uyanışı" — sayfanın tek mod düğmesi.
 *
 * Düğme bir ışık açmıyor. Kökteki `data-awake` değiştiğinde sayfa GERİLİYOR:
 * `.skin` üzerine `contrast(1.25) saturate(0.6)` iniyor (gri çekiliyor),
 * atkı çizgisi kalınlaşıyor, bütün kart kenarları yuvarlaklığını kaybediyor.
 * Yeni bilgi eklenmiyor — Ackerman uyanışı da böyle anlatılıyor: gelen yeni
 * bir güç değil, var olanın sınırının kalkması.
 *
 * Durum RENKLE tek başına anlatılmıyor: sağdaki okuma satırı UYANIK/SAKİN
 * diye yazıyor ve `aria-pressed` düğmenin üstünde duruyor.
 */
export function AwakeToggle({
  enterLabel,
  exitLabel,
  stateLabel,
  stateOn,
  stateOff,
  hintOn,
  hintOff,
}: {
  enterLabel: string;
  exitLabel: string;
  stateLabel: string;
  stateOn: string;
  stateOff: string;
  hintOn: string;
  hintOff: string;
}) {
  const { awake, toggleAwake } = useScarf();

  return (
    <div className={styles.modeBar}>
      <button
        type="button"
        className={styles.modeButton}
        aria-pressed={awake}
        onClick={toggleAwake}
      >
        <ScarfKnot
          className={styles.modeGlyph}
          loopClassName={styles.modeGlyphLoop}
          tailClassName={styles.modeGlyphTail}
        />
        <span className={styles.modeLabel}>{awake ? exitLabel : enterLabel}</span>
      </button>

      <p className={styles.modeState}>
        <span className={styles.modeStateLabel}>{stateLabel}</span>
        <span className={styles.modeStateValue}>{awake ? stateOn : stateOff}</span>
      </p>

      <p className={styles.modeHint} role="status">
        {awake ? hintOn : hintOff}
      </p>
    </div>
  );
}
