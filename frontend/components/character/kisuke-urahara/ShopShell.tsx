"use client";

import { createContext, useContext, useState } from "react";
import { ShopGlyphMark } from "./ShopGlyphs";
import styles from "./UraharaExperience.module.css";

/**
 * Dükkânın kabuğu — "Benihime modu" anahtarı.
 *
 * İnce bir istemci sarmalayıcı (GenjutsuShell emsali): sayfanın kökünü
 * çizer ve TEK bir durum tutar. Modun bütün görsel etkisi CSS'te —
 * fener söner, ahşap kararır, her şey Benihime'nin kızılına döner.
 * Çocuklar SUNUCUDA çizilmiş gelir; bu bileşen onları yalnızca taşır,
 * yani sayfanın gövdesi tarayıcıya JS olarak inmez.
 *
 * Durumu ayrıca bir context'le aşağı veriyor. Neden: çekmece dolabı
 * kendi durumunu tutan AYRI bir ada ve mod açıldığında bütün çekmeceler
 * gerçekten kapanmalı — yalnız görünürde değil, `aria-expanded` de
 * doğruyu söylemeli. Context bir istemci bileşeninden geçtiği için
 * aradaki sunucu çocukları bozulmuyor: `children` opak bir düğüm olarak
 * taşınıyor, içindeki istemci adaları değeri okuyabiliyor.
 */

const BenihimeContext = createContext(false);

/** Dükkânın ışıkları sönük mü? (çekmece dolabı bunu okur) */
export function useBenihime(): boolean {
  return useContext(BenihimeContext);
}

export function ShopShell({
  enterLabel,
  exitLabel,
  bannerLabel,
  children,
}: {
  enterLabel: string;
  exitLabel: string;
  bannerLabel: string;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(false);

  /* <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor (BRIEF §4) */
  return (
    <BenihimeContext.Provider value={active}>
      <div
        className={styles.page}
        data-world="kisuke-urahara"
        data-benihime={active || undefined}
      >
        <div className={styles.modeDock}>
          <button
            type="button"
            className={styles.modeToggle}
            aria-pressed={active}
            onClick={() => setActive((value) => !value)}
          >
            <ShopGlyphMark
              name={active ? "blade" : "hat"}
              className={styles.modeIcon}
            />
            <span>{active ? exitLabel : enterLabel}</span>
          </button>
          {/* Kapıya asılan levha — yalnız mod açıkken */}
          <p className={styles.modePlate} hidden={!active}>
            {bannerLabel}
          </p>
        </div>
        {/* Kepenk: mod kapalıyken tamamen saydam, tıklama geçirmez */}
        <span className={styles.shutter} aria-hidden />
        {children}
      </div>
    </BenihimeContext.Provider>
  );
}
