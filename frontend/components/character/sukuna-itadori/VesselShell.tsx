"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { VesselMode } from "@/lib/characters/sukuna-itadori-experience";
import { VesselSigil } from "./VesselGlyphs";
import { FingerRail, type FingerRailProps } from "./FingerRail";
import styles from "./VesselExperience.module.css";

/**
 * Kap kabuğu — sayfanın TEK durum sahibi.
 *
 * İki şey tutuyor:
 *   1. `vessel` — kontrol kimde. Kök öğedeki `data-vessel` niteliğine
 *      dönüşüyor; `globals.css` o niteliği görünce bütün paleti çeviriyor.
 *      Yani mod değişimi burada bir satır, geri kalanı deri işi.
 *   2. `fingers` — yutulan parmak sayısı. Kök öğeye `--vsl-count` olarak
 *      iniyor ve sayfanın her yerinden okunabiliyor: lanet arttıkça dikiş
 *      parlıyor, örtü koyulaşıyor, başlıklar kızıla çalıyor.
 *
 * İkisi de burada duruyor çünkü ikisini de birden okuyan yer sayfanın
 * KÖKÜ. Durumu rayın içine koysaydık kökteki niteliği güncelleyemezdik;
 * context açsaydık bütün gövde istemciye inerdi.
 *
 * Gövde sunucuda çizilip üç yuvadan geçiyor (`hero`, `dossier`,
 * `chronicle`) — GenjutsuShell'deki kompozisyon desenin aynısı, yalnız
 * tek `children` yerine üç yuva: ray ikisinin ARASINA giriyor ve orası
 * sayfanın kalbi.
 */

export interface VesselSwitchLabels {
  question: string;
  note: string;
  itadori: { name: string; native: string; role: string };
  sukuna: { name: string; native: string; role: string };
}

export function VesselShell({
  initialVessel,
  labels,
  rail,
  hero,
  dossier,
  chronicle,
}: {
  /** Adresten gelen açılış modu (127212 → itadori, 133701 → sukuna) */
  initialVessel: VesselMode;
  labels: VesselSwitchLabels;
  rail: Omit<FingerRailProps, "count" | "onSelect">;
  hero: ReactNode;
  dossier: ReactNode;
  chronicle: ReactNode;
}) {
  const [vessel, setVessel] = useState<VesselMode>(initialVessel);
  /* Hikâye ilk parmakta başlıyor: sıfır bir "henüz olmamış" hâli anlatırdı,
     oysa sayfanın ön kabulü kapın çoktan yutmuş olması. */
  const [fingers, setFingers] = useState(1);

  const sides: VesselMode[] = ["itadori", "sukuna"];

  return (
    /* <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor. */
    <div
      className={styles.page}
      data-world="sukuna-itadori"
      data-vessel={vessel}
      style={{ "--vsl-count": fingers } as CSSProperties}
    >
      {/* Sayfanın ortasından geçen dikiş — sukuna modunda kesiğe dönüşür */}
      <span className={styles.seam} aria-hidden />
      {/* Lanet örtüsü: yoğunluğu --vsl-count'a bağlı */}
      <span className={styles.curseVeil} aria-hidden />

      {hero}

      <section
        id="kontrol"
        className={styles.control}
        aria-labelledby="vessel-control-title"
      >
        <h2 id="vessel-control-title" className={styles.controlTitle}>
          {labels.question}
        </h2>
        <div
          className={styles.switch}
          role="group"
          aria-labelledby="vessel-control-title"
        >
          {/* Kayan "sahiplik" paneli — hangi taraftaysa orayı doldurur */}
          <span className={styles.switchPane} aria-hidden />
          {sides.map((side) => {
            const text = labels[side];
            const active = vessel === side;
            return (
              <button
                key={side}
                type="button"
                className={styles.switchHalf}
                data-side={side}
                aria-pressed={active}
                onClick={() => setVessel(side)}
              >
                <VesselSigil mode={side} className={styles.switchSigil} />
                <span className={styles.switchNative} aria-hidden>
                  {text.native}
                </span>
                <span className={styles.switchName}>{text.name}</span>
                <span className={styles.switchRole}>{text.role}</span>
              </button>
            );
          })}
        </div>
        <p className={styles.controlNote}>{labels.note}</p>
      </section>

      {dossier}

      <FingerRail {...rail} count={fingers} onSelect={setFingers} />

      {chronicle}
    </div>
  );
}
