"use client";

import { useState } from "react";
import { SharinganDisc } from "./SharinganEyes";
import styles from "./ItachiExperience.module.css";

/**
 * Genjutsu modu kabuğu.
 *
 * İnce bir istemci sarmalayıcı: sayfanın kökünü (<main data-world="itachi">)
 * çizer ve tek bir durum tutar — `data-genjutsu`. Modun bütün görsel
 * etkisi CSS'te (tema sertleşir, başlıklara kromatik sapma, hafif
 * distorsiyon katmanı). Çocuklar sunucuda çizilmiş gelir; bu bileşen
 * onları yalnızca taşır (kompozisyon — istemciye ek yük inmez).
 */
export function GenjutsuShell({
  enterLabel,
  exitLabel,
  children,
}: {
  enterLabel: string;
  exitLabel: string;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(false);

  /* <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor — ikinci
     main geçersiz iç içe landmark olurdu (inceleme bulgusu) */
  return (
    <div
      className={styles.page}
      data-world="itachi"
      data-genjutsu={active || undefined}
    >
      <button
        type="button"
        className={styles.genjutsuToggle}
        aria-pressed={active}
        onClick={() => setActive((value) => !value)}
      >
        <SharinganDisc
          glyph={active ? "mangekyoItachi" : "tomoe3"}
          className={styles.genjutsuIcon}
          spinClassName={styles.eyeSpinSlow}
        />
        <span>{active ? exitLabel : enterLabel}</span>
      </button>
      {/* Distorsiyon örtüsü: yalnızca genjutsu modunda görünür, tıklama geçirmez */}
      <span className={styles.genjutsuVeil} aria-hidden />
      {children}
    </div>
  );
}
