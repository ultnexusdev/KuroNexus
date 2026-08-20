"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import shell from "@/app/[locale]/spor/layout.module.css";
import styles from "./HistoryReel.module.css";

export interface HistoryEntry {
  year: number;
  title: string;
  kind: string;
  href: string;
}

export interface HistoryReelLabels {
  title: string;
  lede: string;
  kinds: Record<string, string>;
}

/**
 * Dönemin ışığı — yılın ve türün birlikte belirlediği renk sıcaklığı.
 *
 * ── NEDEN TÜRETİLİYOR, YAZILMIYOR ────────────────────────────────────────
 * Küratör şeride yeni bir kayıt eklediğinde onun rengini de seçmek zorunda
 * kalsaydı, ya her kayıt aynı renkte olurdu ya da şerit bir renk çorbasına
 * dönerdi. Renk yıldan geliyor: eski kayıtlar solmuş kâğıt, yakın kayıtlar
 * doygun gece. Yani şerit AŞAĞI indikçe ısınıyor ve bu ısınma anlatının
 * kendisi.
 *
 * `TROPHY` bunun üstüne bir kat daha ekliyor (bileşendeki `data-peak`):
 * kupa kaydında ışık zirveye
 * çıkıyor. Brief'in "2000 — bu noktada sayfanın ışıkları zirveye ulaşsın"
 * cümlesinin kuralı bu; tek bir yıla gömülmedi ki 2000'den başka kupa
 * geceleri eklendiğinde onlar da parlasın.
 */
function toneOf(year: number) {
  if (year < 1950) {
    return { tone: "#b99a5e", deep: "#3a2c17" };
  }
  if (year < 1990) {
    return { tone: "#8fa6c4", deep: "#1a2436" };
  }
  if (year < 2006) {
    return { tone: "#d9a62e", deep: "#3d1119" };
  }
  return { tone: "#ffc72c", deep: "#3a0d16" };
}

/**
 * TARİHTEN — sinematik şerit.
 *
 * ── NEDEN ESKİ LİSTE GİTTİ ───────────────────────────────────────────────
 * Eski hâli `1905 — Kuruluş` biçiminde dört satırlık bir tipografik dizindi:
 * doğru bilgi, sıfır anlatı. Aynı dört kayıt burada dört SAHNE. Değişen şey
 * veri değil, verinin ne kadar yer kapladığı.
 *
 * ── AKTİFLEŞME ───────────────────────────────────────────────────────────
 * Tek bir `IntersectionObserver` bütün kayıtları izliyor ve ekranın orta
 * bandına giren kayıt "aktif" oluyor: yılı büyüyor, ışığı açılıyor, omurga
 * o noktaya kadar doluyor. Gözlemci `Reveal` gibi kendini SÖKMÜYOR — burada
 * durum yukarı kaydırınca da doğru kalmalı, çünkü aktiflik bir giriş
 * animasyonu değil, bir konum göstergesi.
 *
 * `rootMargin` üst/alt %45: aynı anda yalnızca bir kayıt aktif kalsın diye
 * ekranın ortasında ince bir bant bırakıyor.
 */
export function HistoryReel({
  entries,
  labels,
}: {
  entries: HistoryEntry[];
  labels: HistoryReelLabels;
}) {
  const ref = useRef<HTMLOListElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = ref.current;
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
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const item of items) observer.observe(item);
    return () => observer.disconnect();
  }, [entries.length]);

  if (entries.length === 0) return null;

  // 0-1 aralığı: omurga `scaleY` ile doluyor (yükseklik animasyonu yerleşim
  // hesabı tetikliyordu).
  const fill = (active + 1) / entries.length;

  return (
    <section className={styles.reel} aria-labelledby="futbol-tarih">
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={styles.wash} />
        <span className={styles.paper} />
      </div>

      <header className={styles.head}>
        <h2 id="futbol-tarih" className={`${shell.display} ${styles.heading}`}>
          {labels.title}
        </h2>
        <p className={styles.lede}>{labels.lede}</p>
      </header>

      <div className={styles.frame}>
        {/* Omurga: şeridin ne kadarının geçildiğini gösteren tek dikey çizgi.
            Süs değil — uzun bir şeritte "neredeyim" sorusunun cevabı. */}
        <div className={styles.spine} aria-hidden="true">
          <span style={{ "--fill": fill } as React.CSSProperties} />
        </div>

        <ol className={styles.list} ref={ref}>
          {entries.map((entry, i) => {
            const { tone, deep } = toneOf(entry.year);
            const peak = entry.kind === "TROPHY";
            return (
              <li
                key={`${entry.year}-${entry.title}-${i}`}
                data-active={i === active ? "" : undefined}
                data-peak={peak ? "" : undefined}
                style={
                  { "--tone": tone, "--deep": deep } as React.CSSProperties
                }
              >
                <Link href={entry.href} className={styles.entry}>
                  <span className={styles.glow} aria-hidden="true" />
                  <span className={styles.node} aria-hidden="true" />

                  <span className={`${shell.figure} ${styles.year}`}>
                    {entry.year}
                  </span>

                  <span className={styles.text}>
                    {labels.kinds[entry.kind] ? (
                      <span className={styles.kind}>
                        {labels.kinds[entry.kind]}
                      </span>
                    ) : null}
                    <span className={`${shell.display} ${styles.title}`}>
                      {entry.title}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
