"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { RhombusMark, SealVeins } from "./SakuraGlyphs";
import { SealGauge, type SealGaugeContent } from "./SealGauge";
import styles from "./SakuraExperience.module.css";

/**
 * Sayfanın kabuğu — sayfadaki TEK istemci sınırı.
 *
 * İki durum tutuyor:
 *   1. `byakugo` — mod düğmesi. Mühür çizgileri yüzden sayfanın
 *      kenarlarına yayılır, şifa parlaklığı artar. Etkinin tamamı CSS'te.
 *   2. `stage` — dolum ölçeğinin kademesi (0–4). Kök öğeye sayı olarak
 *      iniyor (`--seal-fill`), sayfanın yeşilden pembeye kayan ağırlığı
 *      oradan türüyor.
 *
 * ── NEDEN `head` AYRI BİR PROP ───────────────────────────────────────
 * Ölçek kademesi sayfanın KÖKÜNDE yaşamak zorunda: rengin kayması
 * ölçeğin altındaki bütün bölümleri kapsıyor. Durumu kökte tutup ölçeği
 * sayfanın ortasına çizebilmek için gövde ikiye ayrıldı — `head` ölçeğin
 * üstündeki (hero + künye), `children` ise altındaki bölümler. İkisi de
 * SUNUCUDA çizilmiş düğüm olarak geliyor; bu bileşen onları yalnızca
 * taşıyor, yani sayfanın gövdesi tarayıcıya JS olarak inmiyor
 * (GenjutsuShell'in kompozisyon deseni, iki yuvalı hâli).
 *
 * Kürator çerçevesi kabuğun İÇİNDE: anahtar çubuğu da dünyanın derisini
 * (`data-world`) miras alsın diye.
 */
export function ByakugoShell({
  isAdmin,
  enterLabel,
  exitLabel,
  gauge,
  head,
  children,
}: {
  isAdmin: boolean;
  enterLabel: string;
  exitLabel: string;
  gauge: SealGaugeContent;
  head: ReactNode;
  children: ReactNode;
}) {
  const [byakugo, setByakugo] = useState(false);
  const [stage, setStage] = useState(0);

  /* Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor. */
  return (
    <div
      className={styles.page}
      data-world="sakura-haruno"
      data-byakugo={byakugo || undefined}
      style={
        { "--seal-fill": stage / (gauge.stages.length - 1) } as CSSProperties
      }
    >
      <SealVeins className={styles.veins} />
      <button
        type="button"
        className={styles.modeToggle}
        aria-pressed={byakugo}
        onClick={() => setByakugo((value) => !value)}
      >
        <RhombusMark className={styles.modeIcon} />
        <span>{byakugo ? exitLabel : enterLabel}</span>
      </button>
      <CuratorFrame isAdmin={isAdmin}>
        {head}
        <SealGauge {...gauge} stage={stage} onStage={setStage} />
        {children}
      </CuratorFrame>
    </div>
  );
}
