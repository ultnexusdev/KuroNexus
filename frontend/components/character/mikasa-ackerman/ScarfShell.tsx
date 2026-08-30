"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import styles from "./ScarfExperience.module.css";

/**
 * Mikasa Ackerman — sayfanın kökü ve İKİ durumu taşıyan tek ada.
 *
 * Kompozisyon deseni: çocuklar SUNUCUDA çizilmiş gelir, bu bileşen onları
 * yalnızca taşır. İstemciye inen tek şey iki sayı ve bir boolean.
 *
 * ── NEDEN İKİ DURUM AYNI YERDE ───────────────────────────────────────────
 * İkisi de sayfanın TAMAMINI etkiliyor ve ikisi de köke yazılıyor:
 *
 *   data-awake     → "Ackerman uyanışı". Açıkken gri çekiliyor, atkı
 *                    kalınlaşıyor, bütün kenarlar keskinleşiyor. Yeni bilgi
 *                    gelmiyor; var olan sertleşiyor.
 *   --mks-angle    → kanca açısı (0° / 22° / 45°). Sayfadaki BÜTÜN ODM
 *   --mks-shift      kabloları bu açıyla dönüyor ve kartların dizilim eğimi
 *                    bu katsayıyla kayıyor.
 *
 * Durumu bölümlerin içindeki iki küçük ada (AwakeToggle, AngleDial) okuyup
 * yazıyor; ikisi de context üzerinden bağlanıyor. Context olmadan düğmeyi
 * kökle konuşturmanın tek yolu sayfanın tamamını istemciye çekmekti.
 *
 * ⚠️ Kök `<main>` DEĞİL: kök layout zaten `<main id="icerik">` çiziyor.
 *
 * ⚠️ FİLTRE KÖKTE DEĞİL `.skin`'DE. `filter` bir içerme bloğu (containing
 * block) yaratıyor ve kökte olsaydı `CuratorFrame`in sağ alta sabitlenmiş
 * küratör hapı sayfaya göre değil bu kutuya göre konumlanırdı. Bu yüzden
 * sıralama şu: ScarfShell(.page) → CuratorFrame(.frame + hap) → div.skin.
 * Filtre yalnızca `.skin`e uygulanıyor, hap dışarıda kalıyor.
 */

export interface ScarfAngleGeometry {
  /** Dikeyden sapma — 0 / 22 / 45 */
  deg: number;
  /** Dizilim eğimi katsayısı — 0 düz istif, 1 en geniş kayma */
  shift: number;
}

interface ScarfState {
  awake: boolean;
  toggleAwake: () => void;
  angleIndex: number;
  selectAngle: (index: number) => void;
}

/**
 * Varsayılan DEĞER var, `null` yok: bir ada bir gün sarmalayıcının dışında
 * çizilirse sayfa çökmesin, yalnızca kontrol etkisiz kalsın. (Emsal:
 * `CuratorFrame`in üç durumlu context'i — orada da sessiz düşüş tercih
 * edildi.)
 */
const FALLBACK: ScarfState = {
  awake: false,
  toggleAwake: () => undefined,
  angleIndex: 1,
  selectAngle: () => undefined,
};

const ScarfContext = createContext<ScarfState | null>(null);

export function useScarf(): ScarfState {
  return useContext(ScarfContext) ?? FALLBACK;
}

export function ScarfShell({
  angles,
  initialIndex,
  children,
}: {
  angles: ScarfAngleGeometry[];
  /** Açılışta seçili açı — 22°, yani Mikasa'nın varsayılanı */
  initialIndex: number;
  children: ReactNode;
}) {
  const [awake, setAwake] = useState(false);
  const [angleIndex, setAngleIndex] = useState(initialIndex);

  const current = angles[angleIndex] ?? angles[0] ?? { deg: 0, shift: 0 };

  const value = useMemo<ScarfState>(
    () => ({
      awake,
      toggleAwake: () => setAwake((on) => !on),
      angleIndex,
      selectAngle: (index: number) => setAngleIndex(index),
    }),
    [awake, angleIndex],
  );

  return (
    <ScarfContext.Provider value={value}>
      <div
        className={styles.page}
        data-world="mikasa-ackerman"
        data-awake={awake ? "true" : "false"}
        style={
          {
            "--mks-angle": `${current.deg}deg`,
            "--mks-shift": String(current.shift),
          } as CSSProperties
        }
      >
        {children}
      </div>
    </ScarfContext.Provider>
  );
}
