"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type VisiblePhase = "hidden" | "visible" | "leaving";

/**
 * TITREME KALKANI — bir gostergenin ne zaman gorunecegini ve ne zaman
 * gidecegini yoneten zamanlama.
 *
 * ── COZDUGU IKI AYRI ARIZA ───────────────────────────────────────────────
 *   1. SIYAH PARLAMA. Katman aninda gorunurse hizli gecislerde ekran bir
 *      kare siyaha donup geri geliyor. `delay` boyunca hicbir sey
 *      cizilmiyor: sayfa daha erken gelirse gosterge HIC dogmuyor.
 *   2. YANIP SONME. Katman 40ms gorunup kaybolursa goz onu "hata" olarak
 *      okuyor. Bir kez gorundugu anda `minVisible` boyunca ekranda
 *      kaliyor, sonra `fadeOut` boyunca soluyor.
 *
 * Ucuncu bir durum (`leaving`) sirf bunun icin var: React'e "dugumu
 * hemen sokme, once solsun" demenin baska yolu yok.
 *
 * ── ⚠️ ETKI YALNIZCA `active`E BAGLI ─────────────────────────────────────
 * Bagimlilik listesinde `phase` YOK ve bu kasitli. Faz da listede olsaydi
 * `setPhase("leaving")` etkiyi yeniden kosturur, temizlik de hemen
 * ardindan zincirin ikinci zamanlayicisini (`leaving` → `hidden`)
 * iptal ederdi: gosterge sonsuza kadar yariya solmus hâlde asili kalirdi.
 * Faz bu yuzden bir ref'te de tutuluyor -- okumak icin, tetiklemek icin
 * degil.
 *
 * @param active   Gosterge SEBEBI su an var mi (gecis suruyor mu)
 * @param delay    Gorunmeden once beklenecek sure
 * @param minVisible Bir kez gorunduyse ekranda kalacagi en az sure
 * @param fadeOut  Cikis gecisinin suresi — CSS'teki degerle AYNI olmali
 */
export function useDelayedVisible(
  active: boolean,
  delay = 180,
  minVisible = 400,
  fadeOut = 250,
): VisiblePhase {
  const [phase, setPhase] = useState<VisiblePhase>("hidden");
  const phaseRef = useRef<VisiblePhase>("hidden");
  const shownAt = useRef(0);

  const set = useCallback((next: VisiblePhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    const after = (ms: number, run: () => void) => {
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) run();
        }, ms),
      );
    };

    if (active) {
      /* Zaten ekranda: yeni bir gecis basladi diye yeniden acilmiyor. */
      if (phaseRef.current === "visible") return;

      /* Solarken geri donduysek gecikme YOK -- dugum hâlâ ekranda ve
         180ms daha beklemek onu bir kez daha yanip sondururdu. */
      after(phaseRef.current === "leaving" ? 0 : delay, () => {
        shownAt.current = Date.now();
        set("visible");
      });
    } else {
      /* Hic gorunmediyse yapacak bir sey yok: bekleyen gosterme
         zamanlayicisini asagidaki temizlik zaten iptal ediyor. */
      if (phaseRef.current === "hidden") return;

      const rest = Math.max(0, minVisible - (Date.now() - shownAt.current));
      after(rest, () => {
        set("leaving");
        after(fadeOut, () => set("hidden"));
      });
    }

    return () => {
      cancelled = true;
      for (const id of timers) window.clearTimeout(id);
    };
  }, [active, delay, minVisible, fadeOut, set]);

  return phase;
}
