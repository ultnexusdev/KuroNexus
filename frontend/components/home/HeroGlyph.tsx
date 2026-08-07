"use client";

import { useEffect, useRef } from "react";
import styles from "./HeroGlyph.module.css";

/**
 * Holün mührü (黒 + nexus). İmleç sayfada gezindikçe glif hafifçe ona doğru
 * eğilir (3B parallax) ve arkasındaki altın ışık imleci takip eder. Hareket
 * requestAnimationFrame ile yumuşatılır; prefers-reduced-motion'da kapalıdır.
 */
export function HeroGlyph({ word = "nexus" }: { word?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const glyphRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const glyph = glyphRef.current;
    if (!wrap || !glyph) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    // hedef (tx,ty) imleç yönü [-1,1]; (cx,cy) yumuşatılmış anlık değer
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const apply = () => {
      raf = 0;
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      glyph.style.transform =
        `perspective(620px) rotateY(${cx * 8}deg) rotateX(${-cy * 8}deg) ` +
        `translate3d(${cx * 7}px, ${cy * 6}px, 0)`;
      if (Math.abs(tx - cx) > 0.0005 || Math.abs(ty - cy) > 0.0005) {
        raf = requestAnimationFrame(apply);
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = glyph.getBoundingClientRect();
      const gx = r.left + r.width / 2;
      const gy = r.top + r.height / 2;
      tx = Math.max(-1, Math.min(1, (e.clientX - gx) / (window.innerWidth * 0.5)));
      ty = Math.max(-1, Math.min(1, (e.clientY - gy) / (window.innerHeight * 0.55)));
      // ışık pozisyonu: glif kutusuna göre yüzde
      wrap.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
      wrap.style.setProperty("--gy", `${((e.clientY - r.top) / r.height) * 100}%`);
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
      wrap.style.removeProperty("--gx");
      wrap.style.removeProperty("--gy");
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className={styles.glyphCol} role="img" aria-label="KuroNexus">
      <span className={styles.aura} aria-hidden />

      <span className={styles.glyphWrap}>
        <span ref={glyphRef} className={styles.glyph} aria-hidden>
          黒
        </span>

        {/* ── KÜNYE MÜHRÜ (落款印) ────────────────────────────────────────
            Kodda logo üç yerde "mühür" diye anılıyordu ama fiilen yalnızca
            bir kontur çiziliyordu. Bu onu gerçek bir mühre çeviriyor.

            Salon 07'deki BALMUMU damlası bilerek taklit edilmedi: o damla
            "burası kilitli" demek. Kare damga ise imza demek — arşivin kendi
            işareti. İki ayrı mühür türü, iki ayrı anlam; yan yana geldiklerinde
            karışmıyorlar.

            Kare biçim 黒'nin kültürel karşılığı: hanko/落款印 kare basılır,
            balmumu ise damlar. Damga glifin DIŞINDA duruyor, yani imleçle
            eğilen 黒'nin arkasında sabit kalıyor — mühür kâğıda basılmıştır,
            levhaya değil. */}
        <svg
          className={styles.chop}
          viewBox="0 0 40 40"
          aria-hidden
          focusable="false"
        >
          {/* Baskı yüzeyi: kenarları hafif düzensiz — makine kesimi değil,
              elle basılmış bir damga izlenimi */}
          <path
            d="M3.4 4.2c0-.6.5-1.1 1.1-1.2C11 2.4 29.4 2.5 35.6 3c.6.1 1.1.6 1.1 1.2.4 6.2.5 25.4 0 31.5-.1.6-.5 1.1-1.1 1.2-6.3.5-24.8.5-31.1 0-.6-.1-1.1-.6-1.1-1.2-.5-6-.5-25.3 0-31.5Z"
            fill="currentColor"
          />
          {/* Oyulmuş işaret: mühür yazısı tavrında bir "N" — iki dikey sütun
              ve onları bağlayan köşeli bir çapraz. Uçlar kesik, çünkü mühür
              kazınır, çizilmez. Zemin rengiyle boşaltılıyor. */}
          <g className={styles.chopMark}>
            <rect x="11.5" y="10" width="3.4" height="20" />
            <rect x="25.1" y="10" width="3.4" height="20" />
            <path d="M14.9 10h3.3l7 12.4V10h3.3v20h-3.3l-7-12.4V30h-3.3z" />
          </g>
        </svg>
      </span>

      {/* Künye levhası mantığı: işaret üstte, ince altın çizgi, adı altında */}
      <span className={styles.rule} aria-hidden />

      <span className={styles.glyphWord} aria-hidden>
        {word}
      </span>
    </div>
  );
}
