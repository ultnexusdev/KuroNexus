"use client";

import { useState } from "react";
import { ByakuganEye, VeinCorner } from "./HyugaGlyphs";
import styles from "./HinataExperience.module.css";

/**
 * Byakugan modu kabuğu — sayfanın TEK durumu.
 *
 * İnce bir istemci sarmalayıcı: kökü çizer ve `data-byakugan` niteliğini
 * taşır. Modun bütün görsel etkisi CSS'te:
 *   · damar ağı sayfanın dört köşesine yayılır,
 *   · çevresel görüş vinyeti belirir (kenarlar Byakugan'ın gördüğü gibi
 *     aydınlanır, merkez sakin kalır),
 *   · gizli katman görünür olur — kartların üstündeki tenketsu noktaları.
 *
 * Çocuklar sunucuda çizilmiş gelir; bu bileşen onları yalnızca taşır
 * (kompozisyon deseni — sayfanın gövdesi tarayıcıya JS olarak inmez).
 */
export function ByakuganShell({
  enterLabel,
  exitLabel,
  description,
  children,
}: {
  enterLabel: string;
  exitLabel: string;
  description: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  /* <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor — ikinci
     bir main geçersiz iç içe landmark olurdu (Itachi incelemesi). */
  return (
    <div
      className={styles.page}
      data-world="hinata-hyuuga"
      data-byakugan={open || undefined}
    >
      {/* Çevresel görüş: kenarlarda soluk bir halka + ay ışığı yıkaması */}
      <span className={styles.periphery} aria-hidden />
      {/* Dört köşe AYNI çizimi kullanır; yerleşim ve döndürme CSS'te
          (`[data-corner]`) — desen dört kez elle yazılmıyor. */}
      <span className={styles.veinEdges} aria-hidden>
        {["tl", "tr", "br", "bl"].map((corner) => (
          <span key={corner} className={styles.veinCorner} data-corner={corner}>
            <VeinCorner />
          </span>
        ))}
      </span>

      <button
        type="button"
        className={styles.modeToggle}
        aria-pressed={open}
        aria-describedby="hinata-mode-note"
        onClick={() => setOpen((value) => !value)}
      >
        <ByakuganEye className={styles.modeIcon} veined={open} />
        <span>{open ? exitLabel : enterLabel}</span>
      </button>
      <span id="hinata-mode-note" className={styles.visuallyHidden}>
        {description}
      </span>

      {children}
    </div>
  );
}
