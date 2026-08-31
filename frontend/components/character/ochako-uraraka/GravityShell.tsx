"use client";

import { useState } from "react";
import { PadMark } from "./UrarakaGlyphs";
import styles from "./ZeroGravityExperience.module.css";

/**
 * "Zero Gravity" kabuğu — sayfanın kökü ve TEK modu.
 *
 * Kompozisyon deseni: çocuklar SUNUCUDA çizilmiş gelir, bu bileşen onları
 * yalnızca taşır. İstemciye inen tek şey bu düğme, bir boolean ve filigran.
 *
 * ── MODUN NE YAPTIĞI (renk DEĞİL, DÜZEN) ─────────────────────────────────
 * Brief'in şartı: düğme YAPIYI çevirecek. `data-gravity` beş ölçüyü birden
 * çeviriyor ve beşi de yerleşim:
 *
 *   --urk-lift-1…5 → kartların yer çizgisinden yüksekliği   → hepsi 0
 *   --urk-overlap  → kartların üst üste binmesi        0 → negatif
 *   --urk-gap      → alan içindeki boşluk            geniş → dar
 *   --urk-display  → başlık ölçeği                  büyük → bir kademe küçük
 *   --urk-ground-w → yer çizgisinin kalınlığı        ince → kalın
 *
 * ⚠️ SERBEST YÜZEN KART ALANI İKİ DURUMDA DA DURUYOR (Dalga 1 dersi).
 * Düğme ızgarayı açıp kapatmıyor, DERECESİNİ değiştiriyor: `off`ta kartlar
 * farklı yüksekliklerde asılı ve salınıyor, `on`da aynı kartlar yer
 * çizgisine inip üst üste biniyor. Hiçbir durumda düz tek kolon yığın
 * ortaya çıkmıyor — Faz 2'nin yok etmek için yazıldığı görünüm tam olarak
 * oydu.
 *
 * Varsayılan `off`: karakterin kendi hâli ağırlıksızlık; sayfa açıldığında
 * görünen ilk şey havada asılı duran kartlar oluyor.
 *
 * Kök `<main>` DEĞİL: kök layout zaten `<main id="icerik">` çiziyor.
 */
export function GravityShell({
  label,
  toOn,
  toOff,
  stateOff,
  stateOn,
  hintOff,
  hintOn,
  watermark,
  children,
}: {
  label: string;
  toOn: string;
  toOff: string;
  stateOff: string;
  stateOn: string;
  hintOff: string;
  hintOn: string;
  /** Filigranın kanji yarısı — dekoratif, dikey yazılıyor */
  watermark: string;
  children: React.ReactNode;
}) {
  const [heavy, setHeavy] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="ochako-uraraka"
      data-gravity={heavy ? "on" : "off"}
    >
      {/* Zemin yıkaması: hiçbir metnin üstünde değil, yalnızca zeminde —
          kontrast ölçümü bozulmasın diye. */}
      <span className={styles.wash} aria-hidden />

      {/* Filigran: dikey 無重力 + parmak ucu pedi (brief §Filigran) */}
      <span className={styles.watermark} aria-hidden>
        {watermark}
      </span>
      <PadMark index={0} className={styles.watermarkPad} />

      <div className={styles.gravityBar}>
        <p className={styles.gravityLabel}>{label}</p>
        <button
          type="button"
          className={styles.gravityToggle}
          aria-pressed={heavy}
          onClick={() => setHeavy((value) => !value)}
        >
          <span className={styles.gravityDial} aria-hidden>
            <span className={styles.gravityBead} />
          </span>
          <span className={styles.gravityToggleText}>
            {heavy ? toOff : toOn}
          </span>
        </button>
        <p className={styles.gravityState}>{heavy ? stateOn : stateOff}</p>
      </div>

      {/* Durum satırı: modun etkisini YAZIYLA da söylüyor — renk tek
          gösterge olamaz. */}
      <p className={styles.gravityHint} role="status">
        {heavy ? hintOn : hintOff}
      </p>

      {children}
    </div>
  );
}
