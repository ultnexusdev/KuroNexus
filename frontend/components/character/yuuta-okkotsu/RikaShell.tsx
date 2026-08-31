"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import styles from "./RikaExperience.module.css";

/**
 * Yūta Okkotsu — sayfanın kökü ve İKİ durumu taşıyan tek ada.
 *
 * Kompozisyon deseni: çocuklar SUNUCUDA çizilmiş gelir, bu bileşen onları
 * yalnızca taşır. İstemciye inen tek şey bir boolean ve bir küme.
 *
 * ── İKİ EKSEN, TEK KÖK ───────────────────────────────────────────────────
 *   data-rika="alone|bound"  → Rika sayfada mı. `alone` iken sayfa baştan
 *                              sona monokrom ve sağ şerit BOŞ bir kontur.
 *                              `bound` iken şerit doluyor ve renk sızıyor.
 *   --yut-take               → destedeki kaynak oranı (0…1). Kopyalama
 *                              geri alınabilir olduğu için bu sayı hem
 *                              artıyor hem azalıyor.
 *
 * İkisi CSS'te tek bir katsayıda birleşiyor (`--yut-spread`, modül dosyası):
 * renk yalnızca Rika bağlıyken ve deste doldukça yayılıyor.
 *
 * ⚠️ ŞERİT DÜĞMENİN ESERİ DEĞİL. Şerit her iki durumda da sayfada duruyor;
 * düğme onu YARATMIYOR, DOLDURUYOR (Onizuka dersi: mod düğmesi yapıyı açıp
 * kapatmaz, derecesini değiştirir).
 *
 * ⚠️ MONOKROM BİR FİLTREYLE KURULMADI. Kökte `filter: grayscale()` YOK:
 * hem küçük metnin okunabilirliğini düşürürdü hem de küratörün yüklediği
 * kareyi gri gösterip yanlış karar verdirirdi. Sayfanın griliği paletin
 * nötr ailesini KULLANMAKTAN geliyor; `--accent` yalnızca Rika'nın olduğu
 * yerlerde açılıyor. Bu yüzden kökte içerme bloğu yaratan bir özellik de
 * yok ve `CuratorFrame`in sağ alta sabitlenmiş hapı sayfaya göre
 * konumlanmaya devam ediyor.
 *
 * ⚠️ Kök `<main>` DEĞİL: kök layout zaten `<main id="icerik">` çiziyor.
 */

interface RikaState {
  /** Rika sayfada mı */
  bound: boolean;
  toggleBound: () => void;
  /** Destedeki kaynakların anahtarları */
  taken: ReadonlySet<string>;
  toggleTake: (key: string) => void;
  /** Destenin kapasitesi değil, kaynak sayısı — kapasite kavramı YOK */
  total: number;
}

/**
 * Varsayılan DEĞER var, `null` yok: bir ada bir gün sarmalayıcının dışında
 * çizilirse sayfa çökmesin, yalnızca kontrol etkisiz kalsın (emsal:
 * `CuratorFrame`in üç durumlu context'i).
 */
const FALLBACK: RikaState = {
  bound: false,
  toggleBound: () => undefined,
  taken: new Set<string>(),
  toggleTake: () => undefined,
  total: 0,
};

const RikaContext = createContext<RikaState | null>(null);

export function useRika(): RikaState {
  return useContext(RikaContext) ?? FALLBACK;
}

export function RikaShell({
  total,
  children,
}: {
  /** Destedeki kaynak sayısı — `--yut-take` bunun üstünden hesaplanıyor */
  total: number;
  children: ReactNode;
}) {
  const [bound, setBound] = useState(false);
  const [taken, setTaken] = useState<ReadonlySet<string>>(
    () => new Set<string>(),
  );

  const value = useMemo<RikaState>(
    () => ({
      bound,
      toggleBound: () => setBound((on) => !on),
      taken,
      /* Geri alınabilirlik burada: aynı çağrı hem ekliyor hem çıkarıyor.
         Getō'nun tek yönlü haznesinden ayrımın kod tarafındaki karşılığı
         tam olarak bu iki satır. */
      toggleTake: (key: string) =>
        setTaken((current) => {
          const next = new Set(current);
          if (next.has(key)) next.delete(key);
          else next.add(key);
          return next;
        }),
      total,
    }),
    [bound, taken, total],
  );

  const take = total > 0 ? taken.size / total : 0;

  return (
    <RikaContext.Provider value={value}>
      <div
        className={styles.page}
        data-world="yuuta-okkotsu"
        data-rika={bound ? "bound" : "alone"}
        style={
          {
            "--yut-take": String(take),
            "--yut-count": String(taken.size),
          } as CSSProperties
        }
      >
        {children}
      </div>
    </RikaContext.Provider>
  );
}
