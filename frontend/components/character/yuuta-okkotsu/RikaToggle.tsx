"use client";

import { RingSeal } from "./YuutaGlyphs";
import { useRika } from "./RikaShell";
import styles from "./RikaExperience.module.css";

/**
 * "Rika" — sayfanın tek mod düğmesi.
 *
 * Düğme bir ışık açmıyor ve bir bölüm de yaratmıyor. Sağ kenardaki şerit
 * sayfada ZATEN var; `alone` hâlinde altı çentiği boş bir kontur olarak
 * duruyor. Düğme o şeridi DOLDURUYOR: Rika içeri girince renk şeritten
 * sayfaya sızmaya başlıyor ve üç okuma yükseliyor.
 *
 * Durum RENKLE tek başına anlatılmıyor: sağdaki okuma satırı YALNIZ/BAĞLI
 * diye yazıyor, `aria-pressed` düğmenin üstünde duruyor ve ipucu satırı
 * `role="status"` ile değişikliği duyuruyor.
 *
 * Bütün metinler düz dize olarak iniyor — `LocalizedText` istemci adasına
 * geçmiyor (sözleşme).
 */
export function RikaToggle({
  enterLabel,
  exitLabel,
  stateLabel,
  stateAlone,
  stateBound,
  hintAlone,
  hintBound,
  kanji,
}: {
  enterLabel: string;
  exitLabel: string;
  stateLabel: string;
  stateAlone: string;
  stateBound: string;
  hintAlone: string;
  hintBound: string;
  kanji: string;
}) {
  const { bound, toggleBound } = useRika();

  return (
    <div className={styles.modeBar}>
      <button
        type="button"
        className={styles.modeButton}
        aria-pressed={bound}
        onClick={toggleBound}
      >
        <RingSeal
          className={styles.modeSeal}
          outerClassName={styles.modeSealOuter}
          innerClassName={styles.modeSealInner}
        />
        <span className={styles.modeButtonText}>
          <span className={styles.modeKanji} lang="ja" aria-hidden>
            {kanji}
          </span>
          <span className={styles.modeLabel}>
            {bound ? exitLabel : enterLabel}
          </span>
        </span>
      </button>

      <p className={styles.modeState}>
        <span className={styles.modeStateLabel}>{stateLabel}</span>
        <span className={styles.modeStateValue}>
          {bound ? stateBound : stateAlone}
        </span>
      </p>

      <p className={styles.modeHint} role="status">
        {bound ? hintBound : hintAlone}
      </p>
    </div>
  );
}
