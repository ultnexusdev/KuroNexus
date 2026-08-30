"use client";

import { useState } from "react";
import { BellMark } from "./OnizukaGlyphs";
import styles from "./TrackingExperience.module.css";

/**
 * Ders zili — sayfanın kökü ve TEK modu.
 *
 * Kompozisyon deseni (SÖZLEŞME §1): çocuklar SUNUCUDA çizilmiş gelir, bu
 * bileşen onları yalnızca taşır. İstemciye inen tek şey bu düğme ve bir
 * boolean; sayfanın geri kalanı sunucu bileşeni olarak kalıyor.
 *
 * ── ZİLİN NE YAPTIĞI (renk değil, YAPI) ──────────────────────────────────
 * Kök öğedeki `data-bell` niteliği beş CSS değişkenini birden çeviriyor:
 *
 *   class  → --onz-tilt-scale: 0     paneller düzleşir (kolaj hizaya gelir)
 *            --onz-lap: 0            üst üste binme kalkar
 *            --onz-gap küçülür       aralar eşitlenir
 *            --onz-grain / --onz-dot-size kısılır
 *
 *   street → --onz-tilt-scale: 1.6   eğim artar
 *            --onz-lap: -1.5rem      paneller birbirine biner
 *            --onz-gap büyür         ritim dağılır
 *            gren ve halftone kabarır, asfalt yıkaması zemine basar
 *
 * Yani aynı içerik iki ayrı DÜZENDE duruyor. Nanami'nin oran modundan,
 * Gojō'nun ölçüm modundan ve Getō'nun hazne modundan farkı bu: burada
 * değişen şey sayfanın geometrisi ve panellerin birbirine göre yeri.
 *
 * ⚠️ Eğim üçüncü bir çarpanla da sınırlanıyor: `--onz-tilt-mob`. Dar
 * ekranda 0.3'e, 26rem altında 0.15'e iniyor — döndürülmüş bir panelin
 * yatayda taşırdığı payı 360 px'te kesen tek şey o (SÖZLEŞME §1).
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 */
export function BellShell({
  label,
  classState,
  streetState,
  toClass,
  toStreet,
  classHint,
  streetHint,
  children,
}: {
  label: string;
  classState: string;
  streetState: string;
  toClass: string;
  toStreet: string;
  classHint: string;
  streetHint: string;
  children: React.ReactNode;
}) {
  const [street, setStreet] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="eikichi-onizuka"
      data-bell={street ? "street" : "class"}
    >
      {/* Modun zemine inen tek rengi — hiçbir metnin üstünde değil */}
      <span className={styles.wash} aria-hidden />
      {/* VHS greni: tarama çizgisi + halftone. Dekoratif, tıklanamaz. */}
      <span className={styles.grain} aria-hidden />

      <div className={styles.bellBar}>
        <button
          type="button"
          className={styles.bellButton}
          aria-pressed={street}
          onClick={() => setStreet((value) => !value)}
        >
          <BellMark
            className={styles.bellGlyph}
            bodyClassName={styles.bellBody}
            clapperClassName={styles.bellClapper}
          />
          <span className={styles.bellLabel}>{label}</span>
          <span className={styles.bellState}>
            {street ? streetState : classState}
          </span>
          {/* Düğmenin ne YAPACAĞI erişilebilir ada giriyor; ekranda
              görünen kısım durumu, bu kısım eylemi söylüyor. */}
          <span className={styles.srOnly}>{street ? toClass : toStreet}</span>
        </button>

        {/* Durum ayrıca YAZIYLA duruyor: düzen değişikliği yalnızca
            görsel bir ipucu olarak kalmasın. */}
        <p className={styles.bellHint} role="status">
          {street ? streetHint : classHint}
        </p>
      </div>

      {children}
    </div>
  );
}
