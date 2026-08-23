"use client";

import { useState } from "react";
import { ToadMark } from "./JiraiyaMarks";
import styles from "./JiraiyaExperience.module.css";

/**
 * Sennin modu kabuğu — sayfanın tek durum tutan dış katmanı.
 *
 * Kompozisyon deseni (GenjutsuShell emsali, BRIEF madde 8): bu bileşen
 * yalnızca kökü ve düğmeyi çiziyor, `children` SUNUCUDA çizilmiş olarak
 * geçiyor. Böylece sayfanın gövdesi tarayıcıya JS olarak inmiyor; istemciye
 * inen tek şey bu düğme ve bir boolean.
 *
 * Modun bütün görsel etkisi CSS'te (`.page[data-sennin]`): parşömen altına
 * döner, kurbağa yağı dokusu yayılır, tipografi bir tık büyür. Buradaki
 * durum sadece niteliği çeviriyor.
 *
 * Kök öğe `<main>` DEĞİL: kök layout zaten `<main id="icerik">` çiziyor,
 * ikincisi geçersiz iç içe landmark olurdu (Itachi incelemesinin bulgusu).
 */
export function SenninShell({
  enterLabel,
  exitLabel,
  children,
}: {
  enterLabel: string;
  exitLabel: string;
  children: React.ReactNode;
}) {
  const [sage, setSage] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="jiraiya"
      data-sennin={sage || undefined}
    >
      <button
        type="button"
        className={styles.sageToggle}
        aria-pressed={sage}
        onClick={() => setSage((value) => !value)}
      >
        <ToadMark className={styles.sageIcon} />
        <span>{sage ? exitLabel : enterLabel}</span>
      </button>
      {/* Kurbağa yağı örtüsü: yalnızca sennin modunda görünür, tıklama geçirmez */}
      <span className={styles.oilVeil} aria-hidden />
      {children}
    </div>
  );
}
