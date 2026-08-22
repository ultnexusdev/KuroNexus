"use client";

import { useEffect, useRef, useState } from "react";
import { clubLangOf, type CareerStop } from "@/lib/sport/players/types";
import { PlayerImage } from "./PlayerImage";
import styles from "./PlayerJourney.module.css";

/**
 * KARİYER YOLCULUĞU.
 *
 * ── HAT GİTTİKÇE PARLIYOR ────────────────────────────────────────────────
 * Şeridin omurgası tek bir yatay hat ve o hat SOLDAN SAĞA parlaklaşıyor:
 * ilk durakta sönük bir çizgi, son durakta halo bırakan bir ışık. Bu bir
 * dekorasyon değil, anlatının kendisi — kariyer ilerledikçe ışık artıyor ve
 * bugünkü kulüpte zirveye çıkıyor.
 *
 * Hat bölüm ekrana girince ÇİZİLİYOR (`--draw` 0 → 1) ve duraklar sırayla
 * yanıyor. Kaydırmaya bağlı sürekli bir hesap YOK: tek bir
 * `IntersectionObserver`, tek bir sınıf değişimi, gerisi CSS geçiş
 * gecikmeleri. Sürekli `scroll` dinlemek bu iş için pahalı olurdu.
 *
 * ── FOTOĞRAF HER DURAKTA ─────────────────────────────────────────────────
 * Her durak kendi karesini taşıyor ve karesi olmayan durak "FOTO EKLENECEK"
 * çerçevesi çiziyor — boş kutu değil. Kareler küratör modundan
 * değiştirilebiliyor (`PlayerImage` yuvası).
 *
 * ── MOBİL ────────────────────────────────────────────────────────────────
 * Yatay şerit dar ekranda ya kırpılır ya da okunamayacak kadar sıkışır.
 * Orada aynı veri DİKEY bir şeride dönüyor: hat solda, fotoğraf ve metin
 * sağda. Aynı DOM, farklı düzen.
 */
export function PlayerJourney({
  stops,
  labels,
}: {
  stops: CareerStop[];
  labels: { title: string; lede: string; matches: string; goals: string };
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLit(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setLit(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (stops.length === 0) return null;

  return (
    <section
      ref={ref}
      className={styles.journey}
      data-lit={lit ? "" : undefined}
      aria-labelledby="oyuncu-kariyer"
    >
      <header className={styles.head}>
        <h2 id="oyuncu-kariyer" className={styles.title}>
          {labels.title}
        </h2>
        <p className={styles.lede}>{labels.lede}</p>
      </header>

      <ol
        className={styles.rail}
        style={{ "--count": stops.length } as React.CSSProperties}
      >
        {/* Hat iki katman: sönük taban + çizilen parlak üst katman. */}
        <span className={styles.line} aria-hidden="true">
          <i />
        </span>

        {stops.map((stop, i) => (
          <li
            key={stop.id}
            className={styles.stop}
            data-current={stop.current ? "" : undefined}
            style={
              {
                "--tone": stop.tone,
                // Duraklar sırayla yanıyor: hattın o noktaya varma süresi.
                "--delay": `${240 + i * 260}ms`,
              } as React.CSSProperties
            }
          >
            <span className={styles.shot}>
              <PlayerImage
                slot={stop.image}
                position="50% 22%"
                decorative
                className={styles.shotImage}
              />
              <span className={styles.shotFade} aria-hidden="true" />
            </span>

            <span className={styles.node} aria-hidden="true" />

            <span className={styles.info}>
              <span className={styles.years}>{stop.years}</span>
              {/* `lang`: kulüp adı CSS'te büyütülüyor ve sayfanın dili
                  Türkçe — Türkçe kural yabancı kulüpleri bozuyordu
                  (LİLLE, SAMPDORİA). Gerekçe `clubLangOf`. */}
              <span className={styles.club} lang={clubLangOf(stop)}>
                {stop.club}
              </span>
              <span className={styles.country}>{stop.country}</span>
              {stop.matches !== null && stop.goals !== null ? (
                <span className={styles.count}>
                  {stop.matches} {labels.matches} · {stop.goals} {labels.goals}
                </span>
              ) : null}
              <span className={styles.note}>{stop.note}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
