"use client";

import { useEffect, useRef } from "react";
import { useMotionSafe } from "./useMotionSafe";
import { useSharedTicker } from "./useSharedTicker";

/**
 * P07 · AYRILMA — scroll'a bağlı tek değişken.
 *
 * Bölümün `--split` değerini (0 → 1) scroll konumundan türetiyor:
 * bölüm ekrana girerken iki figür bitişik, çıkarken tamamen ayrılmış.
 *
 * ⚠️ SCROLL HIJACK DEĞİL. Hiçbir olay engellenmiyor, hiçbir şey
 * kilitlenmiyor; yalnızca pasif bir `scroll` dinleyicisi okuyor ve bir
 * CSS değişkeni yazıyor. Sayfadaki tek hijack P03'te ve hareket
 * sözleşmesi sayfa başına bir tane diyor.
 *
 * ⚠️ VARSAYILAN AYRIK. CSS'te `--split: 1`, yani bu ada hiç inmezse ya da
 * hareket azaltılmışsa bölüm ayrılmış ve çatlak kırılmış hâlde duruyor.
 * Anlatının SONUCU her koşulda görünür; ada yalnızca oraya nasıl
 * gelindiğini gösteriyor.
 */
export function SplitDrift() {
  const { reducedMotion } = useMotionSafe();
  const state = useRef({ el: null as HTMLElement | null, target: 1, value: 1 });

  useEffect(() => {
    if (reducedMotion) return;

    const el = document.querySelector<HTMLElement>("[data-gojo-pair]");
    if (!el) return;

    const s = state.current;
    s.el = el;
    /* Başlangıçta bitişik: ada devraldığı anda anlatı sıfırdan
       başlıyor. */
    s.value = 0;
    s.target = 0;

    const read = () => {
      const box = el.getBoundingClientRect();
      /* Bölümün üstü ekranın altına değdiğinde 0, bölüm ortalandığında
         1. Aradaki her şey doğrusal. */
      const span = window.innerHeight + box.height * 0.35;
      const travelled = window.innerHeight - box.top;
      s.target = Math.max(0, Math.min(1, travelled / span));
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);

    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
      /* Sökülürken yazdığını geri alıyor: bileşen kalkıp değer donmuş
         bir ara konumda kalmasın. CSS varsayılanı (1) devralıyor. */
      el.style.removeProperty("--split");
      s.el = null;
    };
  }, [reducedMotion]);

  useSharedTicker(() => {
    const s = state.current;
    if (!s.el) return;
    const delta = s.target - s.value;
    if (Math.abs(delta) < 0.002) {
      if (s.value !== s.target) {
        s.value = s.target;
        s.el.style.setProperty("--split", s.value.toFixed(3));
      }
      return;
    }
    s.value += delta * 0.12;
    s.el.style.setProperty("--split", s.value.toFixed(3));
  }, !reducedMotion);

  return null;
}
