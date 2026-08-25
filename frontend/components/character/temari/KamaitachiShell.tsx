"use client";

import { useState } from "react";
import { WindGlyph } from "./TemariGlyphs";
import styles from "./TemariExperience.module.css";

/**
 * "Kamaitachi" kabuğu — sayfanın kökü ve tek durumu.
 *
 * Kompozisyon deseni (ShadowShell emsali): çocuklar SUNUCUDA çizilmiş
 * gelir, bu bileşen onları yalnızca taşır. Tarayıcıya inen JS bir düğme ve
 * bir boolean; sayfanın gövdesi sunucuda kalır.
 *
 * Modun bütün görsel etkisi CSS'te (`.page[data-kamaitachi]`): rüzgâr
 * kesikleri kenarlardan içeri girer, bölümlerin köşeleri alınır (clip-path)
 * ve palet soğur. JS hiçbir stil hesaplamıyor.
 *
 * ⚠️ Kırpma `.frame`e DEĞİL tek tek bölümlere uygulanıyor. Sebebi ölçüldü:
 * clip-path taşıyan bir ata, içindeki `position: fixed` düğümleri de
 * kırpıyor — mod düğmesi kendi açtığı kesikle birlikte kaybolurdu. Düğme ve
 * yıkama katmanı bu yüzden `.frame`in DIŞINDA duruyor.
 *
 * Kök `<main>` DEĞİL: kök düzen zaten `<main id="icerik">` çiziyor.
 */
export function KamaitachiShell({
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
  const [cutting, setCutting] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="temari"
      data-kamaitachi={cutting || undefined}
    >
      {/* Soğuk yıkama + kenarlardan giren kesikler. Sabit konumlu: kesik
          sayfayla birlikte kaymaz, kadrajın kenarında durur. */}
      <span className={styles.gustLayer} aria-hidden />

      <button
        type="button"
        className={styles.modeToggle}
        aria-pressed={cutting}
        onClick={() => setCutting((value) => !value)}
      >
        <WindGlyph className={styles.modeGlyph} />
        <span className={styles.modeLabel}>{cutting ? exitLabel : enterLabel}</span>
      </button>
      {/* Düğmenin `aria-pressed`i durumu, bu satır anlamı veriyor. */}
      <p className={styles.modeHint} role="status">
        {cutting ? hint : ""}
      </p>

      <div className={styles.frame}>{children}</div>
    </div>
  );
}
