"use client";

import { useState } from "react";
import { HandSign } from "./ShadowFigures";
import styles from "./TenShadowsExperience.module.css";

/**
 * Gölge kabuğu — sayfanın kökü ve TEK modu.
 *
 * Kompozisyon deseni (BRIEF §8): çocuklar SUNUCUDA çizilmiş gelir, bu bileşen
 * onları yalnızca taşır. İstemciye inen tek şey bu düğme ve bir boolean.
 *
 * ── MODUN NE YAPTIĞI ─────────────────────────────────────────────────────
 * Işık alçalıyor. Sayfadaki bütün kartların gölgesi uzuyor (`--meg-cast`
 * büyüyor), zemin çizgisi kalınlaşıyor ve alt kenarlar kararıyor. Hiçbir
 * bilgi bu moda bağlı değil — mod yalnızca sayfanın SAATİNİ değiştiriyor,
 * içeriğini değil. Gojō sayfasındaki ölçüm modundan farkı bu: orada mod
 * bilgi AÇIYOR, burada mod ışık DÜŞÜRÜYOR.
 *
 * Etkinin tamamı CSS'te (`.page[data-dusk="true"]`); JS hiçbir stil
 * hesaplamıyor.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 */
export function DuskShell({
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
  const [dusk, setDusk] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="megumi-fushiguro"
      data-dusk={dusk ? "true" : "false"}
    >
      {/* Sayfanın alt kenarına oturan sabit gölge bandı: mod açıkken
          yükseliyor. Ekranla birlikte sabit — kaydırdıkça yerinde kalıyor. */}
      <span className={styles.dusk} aria-hidden />

      <button
        type="button"
        className={styles.moodToggle}
        aria-pressed={dusk}
        onClick={() => setDusk((value) => !value)}
      >
        <HandSign
          className={styles.moodGlyph}
          strokeClassName={styles.moodSignStroke}
          fillClassName={styles.moodSignFill}
          deep={dusk}
        />
        <span className={styles.moodLabel}>{dusk ? exitLabel : enterLabel}</span>
      </button>

      <p className={styles.moodHint} role="status">
        {dusk ? hint : ""}
      </p>

      {children}
    </div>
  );
}
