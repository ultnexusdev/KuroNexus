"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import styles from "./VeilHero.module.css";

/**
 * PERDE DURUMU — sahne + anahtar, tek istemci dosyası.
 *
 * ── NEDEN SARMALAYICI + CONTEXT ──────────────────────────────────────────
 * Perdenin parçaları bölüm KÖKÜNDEN (`data-veil`) süzülüyor ama görsel
 * katmanların hepsi sunucuda çiziliyor (`CuratedImage` istemciye import
 * edilemez — Bleach'in RSC dersi). Kök istemcide, içerik sunucudan
 * `children` olarak geliyor; düğme aynı durumu context'ten okuyor.
 * Adaya inen şey yalnızca bir boolean.
 *
 * Varsayılan: perde İNİK (`down`) — SSR ile ilk kare aynı, hidrasyon
 * sıçraması yok. Durum bilinçli olarak KALICI DEĞİL: perde her ziyarette
 * yeniden iner; onu kaldırmak sayfanın açılış jesti.
 */
const VeilContext = createContext<{
  raised: boolean;
  toggle: () => void;
} | null>(null);

export function VeilStage({
  labelledBy,
  children,
}: {
  labelledBy: string;
  children: ReactNode;
}) {
  const [raised, setRaised] = useState(false);
  // Memo'suz inline value her render'da yeni obje üretip bütün tüketicileri
  // yeniden çiziyordu — repodaki 19 context'in memo'suz iki istisnasından
  // biriydi (1 Eylül 2026 denetimi, P-09).
  const veil = useMemo(
    () => ({ raised, toggle: () => setRaised((v) => !v) }),
    [raised],
  );
  return (
    <VeilContext.Provider value={veil}>
      <section
        id="veil"
        aria-labelledby={labelledBy}
        className={styles.stage}
        data-veil={raised ? "up" : "down"}
        tabIndex={-1}
      >
        {children}
      </section>
    </VeilContext.Provider>
  );
}

export function VeilToggle({
  labels,
}: {
  labels: { raise: string; lower: string; sealed: string; open: string };
}) {
  const veil = useContext(VeilContext);
  /* Sarmalayıcı dışında çizilirse sessizce hiçbir şey basma — yarım bir
     düğme, kırık bir düğmeden iyi değil. */
  if (!veil) return null;

  return (
    <div className={styles.control}>
      <button
        type="button"
        className={styles.cta}
        aria-pressed={veil.raised}
        onClick={veil.toggle}
      >
        {veil.raised ? labels.lower : labels.raise}
      </button>
      {/* role="status": durum değişimi ekran okuyucuya da söylenir */}
      <p className={styles.status} role="status">
        <span aria-hidden="true" lang="ja">帳</span>{" "}
        {veil.raised ? labels.open : labels.sealed}
      </p>
    </div>
  );
}
