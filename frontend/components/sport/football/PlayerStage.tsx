"use client";

import { useEffect, useRef } from "react";
import type { FavouritePlayer } from "@/lib/sport/favourite-players";
import shell from "@/app/[locale]/spor/layout.module.css";
import styles from "./PlayerStage.module.css";

/**
 * FUTBOLCU SAHNESİ — profil sayfasının açılış kıvrımı.
 *
 * ── NEDEN HUB'IN KOPYASI DEĞİL ───────────────────────────────────────────
 * İki sahne de "gece stadyumu" ama ışıkları farklı yerden geliyor: hub'da
 * kehribar aşağıdan (saha kenarı), burada mor/çivit yandan ve kırmızı
 * arkadan (spot altında tek figür). Aynı dünyanın iki farklı saati; kopya
 * olsalardı sayfa değiştirdiğini hissettirmezdi.
 *
 * ── İSİM BİR NESNE ───────────────────────────────────────────────────────
 * Ad iki satıra bölünüyor ve ikinci satır kadrajın SOLUNDAN taşıyor. Bu bir
 * kaza değil, kompozisyon: taşan harf, kadrajın devam ettiğini söyler.
 * Taşma `overflow: hidden` ile kesiliyor, yatay kaydırma üretmiyor.
 *
 * `h1` erişilebilir ad olarak TAM adı taşıyor; iki satırlık dev tipografi
 * onun görsel karşılığı ve ayrı bir metin DEĞİL — aynı `h1`in içindeki iki
 * `span`.
 */
export function PlayerStage({
  player,
  badgesLabel,
}: {
  player: FavouritePlayer;
  /** Künye şeridinin erişilebilir adı */
  badgesLabel: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    let frame = 0;
    let px = 0;
    let py = 0;
    let active = true;

    const apply = () => {
      frame = 0;
      el.style.setProperty("--px", px.toFixed(3));
      el.style.setProperty("--py", py.toFixed(3));
    };

    const onMove = (event: PointerEvent) => {
      if (!active) return;
      const rect = el.getBoundingClientRect();
      px = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      py = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) active = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(el);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={ref}
      className={styles.stage}
      id="hikaye-ustu"
      style={
        {
          "--ink": player.palette.ink,
          "--accent": player.palette.accent,
          "--warm": player.palette.warm,
          "--glow": player.palette.glow,
          "--neon": player.palette.neon,
        } as React.CSSProperties
      }
    >
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={styles.field} />
        {player.backdrop ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={player.backdrop.src}
            alt=""
            className={styles.plate}
            width={player.backdrop.width}
            height={player.backdrop.height}
            fetchPriority="low"
            decoding="async"
          />
        ) : null}
        <span className={styles.beam} />
        <span className={styles.haze} />
        <span className={styles.motes}>
          {Array.from({ length: 12 }, (_, i) => (
            <i key={i} style={{ "--i": i } as React.CSSProperties} />
          ))}
        </span>
        <span className={styles.vignette} />
      </div>

      {/* Figür kadrajın sağında, tabana basıyor. `aria-hidden` DEĞİL:
          fotoğrafın kendisi sayfanın konusu ve alt metni veriden geliyor. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={player.figure.src}
        alt={player.figure.alt}
        className={styles.figure}
        width={player.figure.width}
        height={player.figure.height}
        fetchPriority="high"
        decoding="async"
      />

      <div className={styles.body}>
        {/* ⚠️ `aria-label` ZORUNLU. Ad iki blok `span`e bölünmüş durumda ve
            aralarında metin düğümü YOK (olsaydı flex sütununda fazladan bir
            satır açardı). Etiketsiz hâlinde ekran okuyucu adı bitişik
            okuyor — ölçüldü: "MAUROICARDI". Görünen metinle etiket aynı
            sözcükleri taşıyor, yani ad-içinde-etiket kuralı da sağlanıyor. */}
        <h1 className={`${shell.display} ${styles.name}`} aria-label={player.name}>
          <span className={styles.first}>{player.firstName}</span>
          <span className={styles.last}>{player.lastName}</span>
        </h1>

        <p className={styles.quote}>{player.quote}</p>

        <ul className={styles.badges} aria-label={badgesLabel}>
          {player.badges.map((badge) => (
            <li key={badge}>{badge}</li>
          ))}
        </ul>
      </div>

      <dl className={styles.figures}>
        {player.figures.map((entry) => (
          <div key={entry.label}>
            <dt>{entry.label}</dt>
            <dd className={shell.figure}>{entry.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
