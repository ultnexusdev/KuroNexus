"use client";

import { useEffect, useRef } from "react";
import { FOOTBALL_MEDIA } from "@/lib/sport/football-media";
import shell from "@/app/[locale]/spor/layout.module.css";
import styles from "./HubStage.module.css";

export interface HubStageIndexEntry {
  label: string;
  count: number;
}

/**
 * `/spor/futbol` — AÇILIŞ SAHNESİ.
 *
 * ── NEDEN "SAHNE", "HERO" DEĞİL ──────────────────────────────────────────
 * Eski sayfa bir başlık + bir alt satırla açılıyordu: kanadın geri kalanıyla
 * aynı sessiz editoryal ses. Ölçülen sonuç, ilk ekranda dört satır metin ve
 * geri kalanı boş bir siyah alandı. Bu bileşen o kararı geri alıyor. İlk
 * kıvrım artık bir GECE: ışığın kendisi malzeme.
 *
 * ── KATMANLAR (arkadan öne) ──────────────────────────────────────────────
 *   1 renk alanı  — üç radyal yıkama (kehribar / kızıl / çivit). ASLA #000.
 *   2 fotoğraf    — gerçek bir gece stadyumu karesi, maskeyle alana eriyor
 *   3 huzmeler    — projektör konileri; blur + mask, çok yavaş sürükleniyor
 *   4 zerreler    — havada asılı toz; 14 adet, sayısı sabit
 *   5 vinyet      — okunurluk maskesi
 *   ( grain YOK — kanat kabuğu `.wing::before` ile zaten seriyor. İki grain
 *     üst üste dokuyu çamura çeviriyor; bu ders `MatchdayHero`da alınmıştı. )
 *
 * ── FARE PARALAKSI ───────────────────────────────────────────────────────
 * Yalnızca IŞIK katmanları oynuyor, metin ve fotoğraf sabit. Sebebi okunurluk:
 * hareket eden bir yüzeyde duran bir başlık "sabit" hissettirir, tersi baş
 * döndürür. Değerler CSS değişkenine yazılıyor (`--px` / `--py`), yani React
 * her karede yeniden render ETMİYOR — tek bir `style.setProperty` çağrısı ve
 * geri kalanı tarayıcının kompozitöründe.
 *
 * Kapatıldığı durumlar: `prefers-reduced-motion`, kaba işaretçi (dokunmatik),
 * ve sahne ekrandan çıktığında (gereksiz rAF döngüsü yok).
 */
export function HubStage({
  title,
  lines,
  index,
  scrollHint,
}: {
  title: string;
  /** İki satırlık editoryal ifade. İkinci satır vurguyu taşıyor. */
  lines: [string, string];
  index: HubStageIndexEntry[];
  scrollHint: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    if (reduced.matches || coarse.matches) return;

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
      // -1 … 1 aralığı; merkez 0. Kenarda bile hareket ~%2 kalıyor.
      px = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      py = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    // Sahne ekran dışındayken dinleyici çalışmasın — sayfanın altındaki
    // bölümlerde fare gezdirirken boşuna hesap yapılmasın diye.
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
    <section ref={ref} className={styles.stage} aria-labelledby="futbol-hero">
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={styles.field} />
        <picture className={styles.plate}>
          <source
            media="(max-width: 720px)"
            srcSet={FOOTBALL_MEDIA.stadiumNightSmall.src}
            width={FOOTBALL_MEDIA.stadiumNightSmall.width}
            height={FOOTBALL_MEDIA.stadiumNightSmall.height}
          />
          {/* `<picture>` içindeki `<img>` kuralı tetiklemiyor — burada
              `next/image` yerine el yazımı bir `<picture>` var, çünkü dar
              ekranda AYRI ve daha küçük bir plaka indiriliyor. */}
          <img
            src={FOOTBALL_MEDIA.stadiumNight.src}
            alt=""
            width={FOOTBALL_MEDIA.stadiumNight.width}
            height={FOOTBALL_MEDIA.stadiumNight.height}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <span className={styles.beams} />
        <span className={styles.motes}>
          {/* Sayı SABİT: 14. Rastgele üretilmiyor çünkü sunucu ve istemci
              farklı sayı üretirse hidrasyon uyuşmazlığı olur. Konumlar CSS'te
              `--i` üzerinden hesaplanıyor. */}
          {Array.from({ length: 14 }, (_, i) => (
            <i key={i} style={{ "--i": i } as React.CSSProperties} />
          ))}
        </span>
        <span className={styles.vignette} />
      </div>

      <div className={styles.body}>
        <h1 id="futbol-hero" className={`${shell.display} ${styles.word}`}>
          {title}
        </h1>

        <p className={styles.statement}>
          <span>{lines[0]}</span>
          <strong>{lines[1]}</strong>
        </p>
      </div>

      {/* ── Dizin şeridi ──
          Brief "KULÜPLER / EFSANELER / FUTBOLCULAR / HİKÂYELER" istiyor ama
          "dashboard görünümü" yasak. O yüzden bu bir istatistik kartı SIRASI
          değil, viewport'un tabanına oturan ince bir künye rayı: jenerik
          şeridi gibi okunuyor, sayı üst simge olarak küçük duruyor. */}
      <div className={styles.rail}>
        <span className={styles.hint} aria-hidden="true">
          <i />
          {scrollHint}
        </span>
        <ul className={styles.index}>
          {index.map((entry) => (
            <li key={entry.label}>
              <span className={styles.indexLabel}>{entry.label}</span>
              <span className={`${shell.figure} ${styles.indexCount}`}>
                {entry.count}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
