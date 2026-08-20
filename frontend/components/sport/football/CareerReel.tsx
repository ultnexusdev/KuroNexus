"use client";

import { useEffect, useRef, useState } from "react";
import type { CareerStop } from "@/lib/sport/favourite-players";
import shell from "@/app/[locale]/spor/layout.module.css";
import styles from "./CareerReel.module.css";

/**
 * KARİYER YOLCULUĞU — yapışkan sahne + akan duraklar.
 *
 * ── NEDEN BU DÜZEN ───────────────────────────────────────────────────────
 * Kariyer verisi doğal olarak bir TABLO (yıl / kulüp / ülke) ve tablo olarak
 * çizilirse sayfanın geri kalanıyla hiç konuşmaz. Burada aynı veri iki
 * sütuna ayrıldı: SOLDA tek bir yapışkan çerçeve, SAĞDA akan duraklar.
 * Kaydırdıkça soldaki kare değişiyor — yani okuma hareketi doğrudan bir
 * görüntü değişimi üretiyor. Tablo bunu yapamaz.
 *
 * Bu, sayfadaki DİĞER şeritten (`HistoryReel`in omurgası) bilinçli olarak
 * farklı: aynı kanatta iki bölüm aynı hareketle açılırsa ikisi de sıradan
 * görünür.
 *
 * ── AKTİF DURAK ──────────────────────────────────────────────────────────
 * Tek `IntersectionObserver`, ekranın orta bandı. `Reveal` gibi kendini
 * SÖKMÜYOR: aktiflik bir giriş animasyonu değil, bir konum göstergesi —
 * yukarı kaydırınca da doğru olmak zorunda.
 *
 * ── MOBİL ────────────────────────────────────────────────────────────────
 * Yapışkan çerçeve dar ekranda çalışmaz (iki sütun yok). Orada her durak
 * kendi karesini kendi taşıyor; `data-mobile` kopyası CSS'te açılıyor,
 * yapışkan sahne gizleniyor. İki ayrı bileşen yazmak yerine tek ağaç.
 */
export function CareerReel({
  stops,
  title,
  lede,
}: {
  stops: CareerStop[];
  title: string;
  lede: string;
}) {
  const listRef = useRef<HTMLOListElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll("li"));
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          if (!record.isIntersecting) continue;
          const index = items.indexOf(record.target as HTMLLIElement);
          if (index >= 0) setActive(index);
        }
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 },
    );
    for (const item of items) observer.observe(item);
    return () => observer.disconnect();
  }, [stops.length]);

  if (stops.length === 0) return null;

  return (
    <section className={styles.reel} aria-labelledby="oyuncu-kariyer">
      <header className={styles.head}>
        <h2 id="oyuncu-kariyer" className={`${shell.display} ${styles.heading}`}>
          {title}
        </h2>
        <p className={styles.lede}>{lede}</p>
      </header>

      <div className={styles.grid}>
        {/* Yapışkan sahne — masaüstünde tek çerçeve, kareler çapraz geçiyor */}
        <div className={styles.stage} aria-hidden="true">
          <div className={styles.frame}>
            {stops.map((stop, i) => (
              <span
                key={`${stop.club}-${i}`}
                className={styles.slide}
                data-on={i === active ? "" : undefined}
                style={{ "--tone": stop.tone } as React.CSSProperties}
              >
                {stop.media ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={stop.media.src}
                    alt=""
                    width={stop.media.width}
                    height={stop.media.height}
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                <i />
              </span>
            ))}
            <span className={styles.counter}>
              <em className={shell.figure}>{active + 1}</em>
              <s />
              <em className={shell.figure}>{stops.length}</em>
            </span>
          </div>
        </div>

        <ol className={styles.list} ref={listRef}>
          {stops.map((stop, i) => (
            <li
              key={`${stop.club}-${stop.years}-${i}`}
              data-active={i === active ? "" : undefined}
              style={{ "--tone": stop.tone } as React.CSSProperties}
            >
              {/* Dar ekranda durağın kendi karesi burada çiziliyor */}
              {stop.media ? (
                <span className={styles.inlineShot} aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={stop.media.src}
                    alt=""
                    width={stop.media.width}
                    height={stop.media.height}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
              ) : null}

              <span className={`${shell.figure} ${styles.years}`}>
                {stop.years}
              </span>
              <span className={`${shell.display} ${styles.club}`}>
                {stop.club}
              </span>
              <span className={styles.country}>{stop.country}</span>
              <span className={styles.note}>{stop.note}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
