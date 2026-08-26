"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionSafe } from "./useMotionSafe";
import { useSharedTicker } from "./useSharedTicker";
import styles from "./GojoExperience.module.css";

/**
 * P09 · ALTI HALKA — sayaçlar ve detaylar.
 *
 * ══ SAYAÇ KISITI ══════════════════════════════════════════════════════
 * BRIEF: "aynı anda en fazla 3 aktif sayaç; her biri ~2sn'de hedef
 * değerine oturur ve DURUR. Sonsuz döngü yok."
 *
 * Kod bunu kuyrukla uyguluyor: altı halka üçerli iki dalga hâlinde
 * çalışıyor. Bir halka oturunca kuyruktaki sıradaki başlıyor; hiçbir anda
 * üçten fazla sayaç ilerlemiyor. Hepsi oturduğunda ticker aboneliği
 * DÜŞÜYOR — sayfa arka planda tek bir kare bile harcamıyor.
 *
 * ══ VARSAYILAN YÖN ════════════════════════════════════════════════════
 * ⚠️ Sunucu halkaları DOLU çiziyor (`--fill` tavan değerinde) ve taşma
 * işaretleri yerinde. JS inince sayaç sıfıra dönüp yukarı tırmanıyor.
 * Ters kurulum (sunucuda boş başlatmak) JS inmeyen ziyarette bomboş
 * halkalar bırakırdı. Reduced-motion'da da bu yüzden hiçbir şey
 * yapılmıyor: değerler zaten son hâllerinde.
 *
 * ══ SAYAÇ NEYİ GÖSTERİYOR ═════════════════════════════════════════════
 * Bir puanı değil, ölçüm aygıtının nereye kadar gidebildiğini. Halka
 * tavana dayanıyor ve bir sayıyla değil `∞` ya da `ERR` ile duruyor.
 * Gerekçe veri dosyasında: seride bu nitelikler sayıyla verilmiyor,
 * uydurma istatistik yazılmadı.
 */

export interface RingView {
  key: string;
  label: string;
  readout: string;
  ceiling: number;
  detail: string;
}

/** Aynı anda en fazla kaç sayaç ilerleyebilir (BRIEF: 3). */
const MAX_ACTIVE = 3;

/** Bir sayacın hedefe oturma süresi (BRIEF: ~2sn). */
const SETTLE_MS = 2000;

export function PowerRings({
  rings,
  overflowLabel,
  statusIdle,
}: {
  rings: RingView[];
  overflowLabel: string;
  /** Sayaç henüz tırmanırken görünen etiket */
  statusIdle: string;
}) {
  const { reducedMotion } = useMotionSafe();
  const [open, setOpen] = useState<string | null>(null);
  const [settled, setSettled] = useState<boolean[]>(() =>
    rings.map(() => true),
  );
  const [running, setRunning] = useState(false);

  const nodes = useRef<Array<HTMLButtonElement | null>>([]);
  const progress = useRef<number[]>(rings.map(() => 1));
  const queue = useRef<number[]>([]);
  const active = useRef<number[]>([]);

  /* Bölüm görünür olduğunda sayaçları sıfırlayıp kuyruğa al. */
  useEffect(() => {
    if (reducedMotion) return;
    const host = document.querySelector<HTMLElement>("[data-gojo-hud]");
    if (!host || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          progress.current = rings.map(() => 0);
          queue.current = rings.map((_, index) => index);
          active.current = queue.current.splice(0, MAX_ACTIVE);
          setSettled(rings.map(() => false));
          setRunning(true);
          for (const [index, node] of nodes.current.entries()) {
            if (node) node.style.setProperty("--fill", "0");
            void index;
          }
          return;
        }
      },
      { rootMargin: "-15% 0px -15% 0px" },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, [reducedMotion, rings]);

  useSharedTicker(
    (delta) => {
      if (active.current.length === 0) {
        /* Hepsi oturdu: aboneliği düşür, bir daha kare harcama. */
        setRunning(false);
        return;
      }
      const step = delta / SETTLE_MS;
      const finished: number[] = [];

      for (const index of active.current) {
        const next = Math.min(1, progress.current[index] + step);
        progress.current[index] = next;
        const node = nodes.current[index];
        if (node) {
          node.style.setProperty(
            "--fill",
            (next * (rings[index].ceiling / 100)).toFixed(3),
          );
        }
        if (next >= 1) finished.push(index);
      }

      if (finished.length === 0) return;

      active.current = active.current.filter((i) => !finished.includes(i));
      /* Biri oturdu → kuyruktan yenisi giriyor. Böylece aynı anda
         aktif sayaç sayısı hiçbir zaman üçü geçmiyor. */
      while (active.current.length < MAX_ACTIVE && queue.current.length > 0) {
        const next = queue.current.shift();
        if (next !== undefined) active.current.push(next);
      }
      setSettled((prev) => {
        const copy = [...prev];
        for (const index of finished) copy[index] = true;
        return copy;
      });
    },
    running && !reducedMotion,
  );

  const toggle = useCallback((key: string) => {
    setOpen((current) => (current === key ? null : key));
  }, []);

  return (
    <>
      {rings.map((ring, index) => {
        const isOpen = open === ring.key;
        const isSettled = settled[index] ?? true;
        /* Yerleşim: ilk üçü sol sütuna, son üçü sağ sütuna. Orta sütun
           (merkez alan) hiçbir halkaya verilmiyor. */
        const col = index < 3 ? 1 : 3;
        const row = index < 3 ? index + 1 : index - 2;
        return (
          <div
            key={ring.key}
            className={styles.hudCell}
            style={{ "--col": col, "--row": row } as React.CSSProperties}
          >
            <button
              type="button"
              ref={(el) => {
                nodes.current[index] = el;
              }}
              className={styles.hudMeter}
              data-overflow={isSettled ? "1" : undefined}
              aria-expanded={isOpen}
              onClick={() => toggle(ring.key)}
              style={
                { "--fill": (ring.ceiling / 100).toFixed(3) } as React.CSSProperties
              }
            >
              <svg
                className={styles.hudDial}
                viewBox="0 0 40 40"
                aria-hidden="true"
                focusable="false"
              >
                <circle
                  className={styles.hudDialTrack}
                  cx="20"
                  cy="20"
                  r="15.915"
                />
                <circle
                  className={styles.hudDialFill}
                  cx="20"
                  cy="20"
                  r="15.915"
                  transform="rotate(-90 20 20)"
                />
              </svg>

              <span>
                <span className={styles.hudLabel}>{ring.label}</span>
                {/* Tavana dayanana kadar tırmanma etiketi, sonra taşma
                    işareti. Sayı hiç gösterilmiyor — çünkü yok. */}
                <span className={styles.hudReadout}>
                  {isSettled ? ring.readout : "…"}
                </span>
                <span className={styles.hudStatus}>
                  {isSettled ? overflowLabel : statusIdle}
                </span>
              </span>
            </button>

            {isOpen ? (
              <p className={styles.hudDetail}>{ring.detail}</p>
            ) : null}
          </div>
        );
      })}
    </>
  );
}
