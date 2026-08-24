"use client";

import { useState } from "react";
import { CloneGlyph } from "./InuzukaGlyphs";
import styles from "./KibaExperience.module.css";

/**
 * "Beast Human Clone" kabuğu — sayfanın kökü ve TEK durumu.
 *
 * `ShadowShell` / `GenjutsuShell` emsalinin kardeşi (kompozisyon deseni):
 * çocuklar SUNUCUDA çizilmiş gelir, bu bileşen onları yalnızca taşır.
 * Sayfanın gövdesi tarayıcıya JS olarak inmez; istemciye inen tek şey bu
 * düğme ve bir boolean.
 *
 * Modun bütün görsel etkisi CSS'te (`.page[data-clone]`): başlıklar ikinci
 * bir kopya kazanır, hero portresi yanına kendi hayaletini alır, koku izi
 * çiftlenir ve kenarlar pençe rengine döner. JS hiçbir stil hesaplamıyor.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 * `className={styles.page}` + `data-world="kiba-inuzuka"` ikilisi ZORUNLU —
 * deri bloğu tam olarak o seçiciye bağlı.
 */
export function PackShell({
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
  const [cloned, setCloned] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="kiba-inuzuka"
      data-clone={cloned || undefined}
    >
      {/* Toz: sayfanın zemininde duran, çok yavaş sürüklenen katman */}
      <span className={styles.dust} aria-hidden />

      <button
        type="button"
        className={styles.cloneToggle}
        aria-pressed={cloned}
        onClick={() => setCloned((value) => !value)}
      >
        <CloneGlyph
          className={styles.cloneGlyph}
          halfClassName={styles.cloneHalf}
        />
        <span className={styles.cloneLabel}>
          {cloned ? exitLabel : enterLabel}
        </span>
      </button>

      {/* Mod açıkken ne olduğunu söyleyen satır: ekran okuyucu için canlı
          bölge — düğmenin aria-pressed'i durumu, bu satır anlamı veriyor */}
      <p className={styles.cloneHint} role="status">
        {cloned ? hint : ""}
      </p>

      {children}
    </div>
  );
}
