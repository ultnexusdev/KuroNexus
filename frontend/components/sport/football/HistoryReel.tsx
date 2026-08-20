"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import type { PlayerImageSlot } from "@/lib/sport/favourite-players";
import { PlayerImage } from "./player/PlayerImage";
import { usePlayerCurator } from "./player/PlayerCurator";
import shell from "@/app/[locale]/spor/layout.module.css";
import styles from "./HistoryReel.module.css";

export interface HistoryEntry {
  year: number;
  title: string;
  kind: string;
  href: string;
  image: PlayerImageSlot;
}

export interface HistoryReelLabels {
  title: string;
  lede: string;
  kinds: Record<string, string>;
}

/**
 * Dönemin ışığı — yılın belirlediği renk sıcaklığı.
 *
 * ── NEDEN TÜRETİLİYOR, YAZILMIYOR ────────────────────────────────────────
 * Küratör şeride yeni bir kayıt eklediğinde onun rengini de seçmek zorunda
 * kalsaydı ya her kayıt aynı renkte olurdu ya da şerit bir renk çorbasına
 * dönerdi. Renk yıldan geliyor: eski kayıtlar solmuş kâğıt, yakın kayıtlar
 * doygun gece. Şerit aşağı indikçe ısınıyor ve bu ısınma anlatının kendisi.
 *
 * ⚠️ MAVİ/LACİVERT YOK. Önceki sürümde 1950-1990 bandı çelik mavisiydi
 * (`#8fa6c4`) ve 1964 satırı sayfada mavi görünüyordu. Kullanıcı kaldırılmasını
 * istedi ve gerekçesi kesin: lacivert rakip kulübün rengi, bir Galatasaray
 * arşivinde yeri yok. Bant bronza çevrildi; şerit baştan sona sıcak kalıyor.
 */
function toneOf(year: number) {
  if (year < 1950) {
    return { tone: "#b99a5e", deep: "#3a2c17" };
  }
  if (year < 1990) {
    return { tone: "#c08a4a", deep: "#3a2410" };
  }
  if (year < 2006) {
    return { tone: "#d9a62e", deep: "#3d1119" };
  }
  return { tone: "#ffc72c", deep: "#3a0d16" };
}

/**
 * TARİHTEN — zikzak şerit.
 *
 * ── NEDEN ZİKZAK ─────────────────────────────────────────────────────────
 * Önceki sürüm tek sütunluk bir listeydi: yıl solda, başlık sağda, hepsi aynı
 * hizada. Doğru bilgi ama tek ritim — göz üç kayıttan sonra tarıyor, okumuyor.
 * Kayıtlar merkezî omurganın iki yanına alternatif dizilince her satır bir
 * öncekinin aynası oluyor ve göz zikzak çizerek iniyor.
 *
 * ── FOTOĞRAF ─────────────────────────────────────────────────────────────
 * Her kaydın kendi karesi var ve küratör modundan değiştirilebiliyor. Karesi
 * olmayan kayıt "FOTO EKLENECEK" çerçevesi çiziyor — boş kutu değil.
 *
 * ── AKTİFLİK: SCROLL **VE** HOVER ────────────────────────────────────────
 * Kaydın ışığı iki yoldan açılıyor: ekranın orta bandına girince (okurken
 * kendiliğinden) ve üstüne gelince (ararken elle). İkincisi kullanıcı isteği:
 * "o satıra gelince aktifleşsin". Gözlemci `Reveal` gibi kendini SÖKMÜYOR —
 * aktiflik bir giriş animasyonu değil, bir konum göstergesi.
 *
 * ── KÜRATÖR MODUNDA BAĞLANTI KAPALI ──────────────────────────────────────
 * Kart normalde kulüp sayfasındaki dönem çapasına giden bir `<a>`. Düzenle
 * düğmesi ve dosya/adres alanları onun içinde kalırsa hem geçersiz HTML olur
 * hem de adres kutusuna basınca sayfa değişir. Mod açıkken kart `<div>`e
 * dönüyor; galeri karelerinde alınan dersin aynısı.
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
  const curator = usePlayerCurator();
  const curating = curator?.curating ?? false;

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
        {/* Omurga: şeridin ne kadarının geçildiğini gösteren tek dikey çizgi. */}
        <div className={styles.spine} aria-hidden="true">
          <span style={{ "--fill": fill } as React.CSSProperties} />
        </div>

        <ol className={styles.list} ref={ref}>
          {entries.map((entry, i) => {
            const { tone, deep } = toneOf(entry.year);
            const peak = entry.kind === "TROPHY";
            const body = (
              <>
                <span className={styles.shot}>
                  <PlayerImage
                    slot={entry.image}
                    position="50% 30%"
                    decorative
                  />
                  <span className={styles.shotLight} aria-hidden="true" />
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
              </>
            );

            return (
              <li
                key={entry.image.id}
                data-active={i === active ? "" : undefined}
                data-peak={peak ? "" : undefined}
                data-side={i % 2 === 0 ? "left" : "right"}
                style={{ "--tone": tone, "--deep": deep } as React.CSSProperties}
              >
                <span className={styles.glow} aria-hidden="true" />
                <span className={styles.node} aria-hidden="true" />
                <span className={`${shell.figure} ${styles.year}`}>
                  {entry.year}
                </span>

                {curating ? (
                  <div className={styles.card}>{body}</div>
                ) : (
                  <Link href={entry.href} className={styles.card}>
                    {body}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
