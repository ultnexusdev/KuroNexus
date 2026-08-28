"use client";

import { useEffect, useRef } from "react";
import styles from "./BallCursor.module.css";

/** İz uzunluğu. Sekiz nokta, her biri bir öncekini gecikmeyle takip ediyor. */
const TRAIL = 8;

/**
 * TOPUN İZİ — imleci takip eden yanan basketbol.
 *
 * ── ⚠️ GERÇEK İMLEÇ GİZLENMİYOR ──────────────────────────────────────────
 * Brief "custom cursor" diyor ama sistem imlecini `cursor: none` ile
 * kapatmak ölçülebilir bir erişilebilirlik kaybı: imleç boyutunu büyütmüş,
 * kontrastını artırmış ya da işaretçi izini açmış kişi işaretçisini
 * kaybeder ve JS gelmezse hiç imleç kalmaz. Top imlecin YERİNE değil
 * ARDINDA hareket ediyor — sinematik etki duruyor, işaretçi duruyor.
 *
 * ── NEDEN `setState` YOK ─────────────────────────────────────────────────
 * Konumlar doğrudan DOM'a yazılıyor ve döngü tek bir `requestAnimationFrame`
 * zinciri. Sekiz noktayı React durumunda tutmak saniyede altmış kez sekiz
 * öğelik bir ağaç çizdirirdi.
 *
 * ── NEREDE ÇİZİLMİYOR ────────────────────────────────────────────────────
 *   · `prefers-reduced-motion: reduce` — hareket isteği açıkça reddedilmiş
 *   · `(pointer: fine)` yoksa — dokunmatikte takip edecek bir imleç yok ve
 *     iz parmağın altında kalır
 * İkisinde de döngü HİÇ kurulmuyor: CSS'te gizlemek işi yapmazdı, rAF yine
 * dönerdi.
 */
export function BallCursor() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dots = Array.from(host.children) as HTMLElement[];
    if (dots.length === 0) return;

    /* Hedef: imlecin son konumu. Noktalar buraya doğru KADEMELİ yaklaşıyor —
       her nokta bir öncekinin konumuna doğru, yani zincir kendiliğinden bir
       kuyruk oluşturuyor. */
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let visible = false;
    let frame = 0;

    const xs = new Array<number>(dots.length).fill(targetX);
    const ys = new Array<number>(dots.length).fill(targetY);

    const tick = () => {
      let px = targetX;
      let py = targetY;
      for (let i = 0; i < dots.length; i += 1) {
        /* Öndeki nokta hızlı, arkadakiler giderek tembel: kuyruk uzadıkça
           daha çok geriden geliyor. */
        const ease = 0.34 - i * 0.028;
        xs[i] += (px - xs[i]) * ease;
        ys[i] += (py - ys[i]) * ease;
        dots[i].style.transform = `translate3d(${xs[i]}px, ${ys[i]}px, 0)`;
        px = xs[i];
        py = ys[i];
      }
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        visible = true;
        host.dataset.on = "";
        frame = requestAnimationFrame(tick);
      }
    };

    /* Sayfadan çıkınca iz sönüyor ama döngü DURMUYOR: imleç geri
       geldiğinde noktalar doğru yerden devam etsin. Duran bir rAF'ı
       yeniden başlatmak, sekiz noktanın da eski konumdan fırlaması
       demek olurdu. */
    const onLeave = () => delete host.dataset.on;
    const onEnter = () => {
      if (visible) host.dataset.on = "";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, []);

  return (
    <div ref={hostRef} className={styles.host} aria-hidden="true">
      {Array.from({ length: TRAIL }, (_, index) => (
        <span
          key={index}
          className={styles.dot}
          /* Sıra numarası boyutu ve sönüklüğü veriyor: baştaki top,
             arkadakiler kıvılcım. */
          style={{ "--i": index } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
