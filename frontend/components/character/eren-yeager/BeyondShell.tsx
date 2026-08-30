"use client";

import { useState } from "react";
import { WallTeeth } from "./ErenGlyphs";
import styles from "./RumblingExperience.module.css";

/**
 * "Duvarın ardı" kabuğu — sayfanın kökü ve TEK modu.
 *
 * Kompozisyon deseni: çocuklar SUNUCUDA çizilmiş gelir, bu bileşen onları
 * yalnızca taşır. İstemciye inen tek şey bu düğme, bir boolean ve filigran.
 *
 * ── MODUN NE YAPTIĞI (renk DEĞİL, YAPI) ──────────────────────────────────
 * Brief'in şartı açık: düğme sayfanın rengini değil GENİŞLİĞİNİ ve ORANINI
 * değiştirecek. `data-beyond` üç değişkeni birden çeviriyor ve üçü de
 * ölçü:
 *
 *   --ern-measure → içerik sütununun genişliği   46rem → 76rem
 *   --ern-sky     → ufuk çizgisinin bant içindeki yüksekliği (yukarı kayar)
 *   --ern-cols    → titan kartlarının minimum sütun ölçüsü (dizilim değişir)
 *
 * Yani duvarın içinde sayfa dar bir koridor, dışında geniş bir ova. Renk
 * (sepya → kızıl) bu değişimin YANINDA duruyor, yerine değil: mod açıkken
 * ekran okuyucuya da bir durum satırı düşüyor, çünkü renk tek gösterge
 * olamaz.
 *
 * Kök `<main>` DEĞİL: kök layout zaten `<main id="icerik">` çiziyor.
 */
export function BeyondShell({
  toSea,
  toWall,
  stateWall,
  stateSea,
  hintWall,
  hintSea,
  label,
  watermark,
  children,
}: {
  toSea: string;
  toWall: string;
  stateWall: string;
  stateSea: string;
  hintWall: string;
  hintSea: string;
  label: string;
  /** Filigranın kanji yarısı — dekoratif, dikey yazılıyor */
  watermark: string;
  children: React.ReactNode;
}) {
  const [beyond, setBeyond] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="eren-yeager"
      data-beyond={beyond ? "sea" : "wall"}
    >
      {/* Zemin yıkaması: duvarın içinde sepya, dışında kızıl. Hiçbir metnin
          üstünde değil — kontrast ölçümü bozulmasın diye yalnızca zeminde. */}
      <span className={styles.wash} aria-hidden />

      {/* Filigran: dikey 進撃 + dolgusuz duvar dişleri (brief §Filigran) */}
      <span className={styles.watermark} aria-hidden>
        {watermark}
      </span>
      <WallTeeth className={styles.watermarkTeeth} />

      <div className={styles.beyondBar}>
        <p className={styles.beyondLabel}>{label}</p>
        <button
          type="button"
          className={styles.beyondToggle}
          aria-pressed={beyond}
          onClick={() => setBeyond((value) => !value)}
        >
          <span className={styles.beyondGate} aria-hidden>
            <span className={styles.beyondGateLeaf} />
            <span className={styles.beyondGateLeaf} />
          </span>
          <span className={styles.beyondToggleText}>
            {beyond ? toWall : toSea}
          </span>
        </button>
        <p className={styles.beyondState}>{beyond ? stateSea : stateWall}</p>
      </div>

      {/* Durum satırı: modun etkisini YAZIYLA da söylüyor */}
      <p className={styles.beyondHint} role="status">
        {beyond ? hintSea : hintWall}
      </p>

      {children}
    </div>
  );
}
