"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * İMLEÇ PARALAKSI — hero'nun tek istemci adası.
 *
 * İmleç hero üzerinde gezdikçe dört şerit farklı hızlarda kayıyor (en çok
 * 12px). Kırık ayna hissi böylece "duran bir tasarım" olmaktan çıkıp
 * kullanıcının hareketine cevap veren bir şeye dönüşüyor.
 *
 * ── NE ZAMAN HİÇ KURULMUYOR ──────────────────────────────────────────────
 *   • `prefers-reduced-motion: reduce`
 *   • kaba işaretçi (dokunmatik) — imleç yok, olay hiç gelmiyor
 * İkisinde de gözlemci bağlanmıyor: boşa çalışan bir dinleyici bile
 * bırakılmıyor.
 *
 * ── NEDEN CSS DEĞİŞKENİ, STATE DEĞİL ─────────────────────────────────────
 * React state'i her `pointermove`da yeniden çizim tetiklerdi ve hero'nun
 * altında dört `<Image>` var. Bunun yerine kök öğeye iki custom property
 * yazılıyor; React ağacı hiç dokunulmadan kalıyor ve iş kompozisyon
 * katmanında bitiyor.
 *
 * ⚠️ `requestAnimationFrame` ile kısılıyor: `pointermove` saniyede yüzlerce
 * kez geliyor ve her birinde stil yazmak ana iş parçacığını meşgul eder.
 */
export function HeroParallax({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    // Hero'nun tamamı dinleniyor, şerit kutusu değil: imleç kenardan
    // girerken de hareket başlasın.
    const host = el.closest("header") ?? el;
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const box = host.getBoundingClientRect();
        // -1 … +1 aralığına indirgeniyor; kuvvet CSS'te belirleniyor.
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        el.style.setProperty("--px", x.toFixed(3));
        el.style.setProperty("--py", y.toFixed(3));
      });
    };

    const onLeave = () => {
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
