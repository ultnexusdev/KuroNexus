"use client";

import { useState } from "react";
import { ControlBar, PageRig } from "./KankuroGlyphs";
import styles from "./KankuroExperience.module.css";

/**
 * "İpler sende değil" kabuğu — sayfanın kökü ve sayfanın TEK genel durumu.
 *
 * Kompozisyon deseni (`ShadowShell` emsali): çocuklar SUNUCUDA çizilmiş
 * gelir, bu bileşen onları yalnızca taşır. Sayfanın gövdesi tarayıcıya JS
 * olarak inmez; istemciye inen tek şey bu düğme, bir boolean ve ip katmanı.
 *
 * Modun bütün görsel etkisi CSS'te (`.page[data-strung]`):
 *   · yukarıdan inen ipler görünür hâle gelir ve gerilir,
 *   · her blok üst kenarından asılıymış gibi bir derece yana yatar
 *     (`transform-origin: top center` — ipin bağlandığı yer orası),
 *   · kenarlardan lake bir karartma iner ve palet koyulaşır.
 * JS hiçbir stil hesaplamıyor.
 *
 * Kök <main> DEĞİL: kök düzen zaten <main id="icerik"> çiziyor (BRIEF §2).
 */
export function StringRig({
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
  const [strung, setStrung] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="kankuro"
      data-strung={strung || undefined}
    >
      {/* Sayfanın üst kenarından inen dört ip. Ziyaretçi normalde yalnızca
          dokusunu görür (--kan-string zaten çok düşük opaklıkta); mod
          açıldığında gerilip görünür hâle gelirler. */}
      <PageRig className={styles.rig} lineClassName={styles.rigLine} />

      {/* Lake karartma: kenarlardan içeri iner, okuma sütununu açık bırakır.
          Metin token'larına dokunulmuyor — kontrast ölçüsü bozulmasın diye
          karartma bir katman, bir renk değişikliği değil. */}
      <span className={styles.gloom} aria-hidden />

      <button
        type="button"
        className={styles.modeToggle}
        aria-pressed={strung}
        onClick={() => setStrung((value) => !value)}
      >
        <ControlBar className={styles.modeGlyph} />
        <span className={styles.modeLabel}>{strung ? exitLabel : enterLabel}</span>
      </button>

      {/* Mod açıkken ne olduğunu söyleyen satır: ekran okuyucu için canlı
          bölge — düğmenin aria-pressed'i durumu, bu satır anlamı veriyor. */}
      <p className={styles.modeHint} role="status">
        {strung ? hint : ""}
      </p>

      {children}
    </div>
  );
}
