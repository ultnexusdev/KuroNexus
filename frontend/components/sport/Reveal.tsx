"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./Reveal.module.css";

/**
 * Kaydırdıkça beliren blok — spor kanadının TEK hareket türü.
 *
 * ── NEDEN TEK BİLEŞEN ─────────────────────────────────────────────────────
 * Depoda ~20 CSS modülü kendi IntersectionObserver'ını ayrı ayrı kuruyor.
 * Aynı işi 20 kez yazmak yalnızca tekrar değil, **tutarsızlık** üretiyor:
 * eşikler, süreler ve reduced-motion davranışı birbirini tutmuyor. Brief
 * "aynı ekranda birden fazla animasyon türü çalışmasın" diyor; bunun
 * uygulanabilir tek yolu kanatta tek bir belirme yolu olması.
 *
 * ── NEDEN BİR KEZ ─────────────────────────────────────────────────────────
 * Gözlemci ilk kesişmede kendini söküyor. Yukarı kaydırınca bölümlerin
 * yeniden solup belirmesi "sinematik" değil huzursuz; brief'in istediği şey
 * sayfanın kendini bir kez açması.
 *
 * ── HAREKETİ AZALT ────────────────────────────────────────────────────────
 * `prefers-reduced-motion` açıksa gözlemci HİÇ kurulmuyor ve içerik ilk
 * karede görünür geliyor. CSS'te de ayrıca kapatılıyor — JS gelmeden önce
 * (ya da hiç gelmezse) içeriğin görünmez kalmaması için başlangıç durumu
 * `opacity: 1`; görünmezlik yalnızca `data-armed` konduktan sonra başlıyor.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
}: {
  children: ReactNode;
  /** Kardeş bloklar arasında kademeli açılma (ms). 3'ten fazla kademe kullanma. */
  delay?: number;
  as?: "div" | "section" | "article" | "li";
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(true);
      return;
    }

    // JS çalıştığı ANDA gizle — öncesinde içerik görünür durumda, çünkü JS
    // hiç gelmezse (hata, eski tarayıcı) sayfa boş kalmamalı.
    setArmed(true);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      // Blok ekranın altından biraz girdiğinde tetiklensin: tam kenarda
      // tetiklemek, hareketi kullanıcı göremeden bitiriyor.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={[styles.reveal, className].filter(Boolean).join(" ")}
      data-armed={armed ? "" : undefined}
      data-shown={shown ? "" : undefined}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
