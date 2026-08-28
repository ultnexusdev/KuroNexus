"use client";

import { useEffect, useRef } from "react";
import { CourtLines } from "./CourtLines";
import styles from "./ReactiveCourt.module.css";

/**
 * İMLECİN ALTINDA YANAN SAHA.
 *
 * ── NASIL ÇALIŞIYOR ──────────────────────────────────────────────────────
 * Saha İKİ KEZ çiziliyor. Alttaki sönük, üstteki neon. Üsttekinin maskesi
 * imlecin konumunda bir ışık havuzu — yani parlaklık imlecin altında
 * "açılıyor". Bütün iş iki CSS özel değerinde (`--mx`, `--my`); React durum
 * tutmuyor, hiçbir şey yeniden çizilmiyor.
 *
 * ⚠️ `setState` KULLANILMADI ve bilerek: fare hareketi saniyede onlarca olay
 * üretiyor ve her biri bir React çizimi tetikleseydi sayfa takılırdı.
 * Özel değer doğrudan DOM'a yazılıyor, bileşen bir kez çiziliyor.
 *
 * ── OLAYLAR NEDEN `pointer` ──────────────────────────────────────────────
 * `mousemove` dokunmatik cihazda hiç ateşlenmiyor, `touchmove` farede.
 * `pointermove` ikisini birden veriyor ve dokunmatikte de doğru davranıyor:
 * parmağın değdiği yer parlıyor.
 *
 * ── AZALTILMIŞ HAREKET ───────────────────────────────────────────────────
 * `prefers-reduced-motion` açıksa dinleyici HİÇ kurulmuyor — CSS'te
 * gizlemek yetmezdi, olay işleyicisi yine de çalışırdı. Sönük saha yerinde
 * kalıyor, yalnızca imleç takibi yok.
 */
export function ReactiveCourt({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* Yazma `requestAnimationFrame`e bağlanıyor: bir karede kaç olay gelirse
       gelsin DOM'a bir kez yazılıyor. */
    let frame = 0;
    let x = 0;
    let y = 0;

    const write = () => {
      frame = 0;
      host.style.setProperty("--mx", `${x}%`);
      host.style.setProperty("--my", `${y}%`);
    };

    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      x = ((event.clientX - rect.left) / rect.width) * 100;
      y = ((event.clientY - rect.top) / rect.height) * 100;
      host.dataset.lit = "";
      if (!frame) frame = requestAnimationFrame(write);
    };

    const onLeave = () => {
      delete host.dataset.lit;
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={hostRef} className={[styles.host, className].filter(Boolean).join(" ")}>
      <CourtLines className={styles.base} />
      <CourtLines className={styles.lit} />
    </div>
  );
}
