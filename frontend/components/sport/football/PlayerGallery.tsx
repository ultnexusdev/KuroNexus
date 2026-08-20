"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaAsset } from "@/lib/sport/football-media";
import shell from "@/app/[locale]/spor/layout.module.css";
import styles from "./PlayerGallery.module.css";

export interface GalleryLabels {
  title: string;
  lede: string;
  open: string;
  close: string;
  prev: string;
  next: string;
}

/**
 * GALERİ + IŞIK KUTUSU.
 *
 * ── NEDEN EŞİT KUTULU IZGARA DEĞİL ───────────────────────────────────────
 * Kareler farklı oranlarda (dikey portre, yatay stadyum, dar kesim). Hepsini
 * aynı kutuya sokmak ya kırpma ya boşluk üretirdi. Izgara `grid-auto-flow:
 * dense` ile çalışıyor ve her karenin span'i KENDİ ORANINDAN hesaplanıyor:
 * yatay kareler iki sütun, dikey kareler iki satır kaplıyor. Kırpma yok.
 *
 * ── IŞIK KUTUSU: NE VAR NE YOK ───────────────────────────────────────────
 * Var: Escape, sol/sağ ok, odak tuzağı, açılışta odak kapatma düğmesinde,
 * kapanışta odak geri açan karede, `aria-modal`, gövde kaydırma kilidi,
 * künye satırı.
 * Yok: kütüphane. Bunların tamamı ~70 satır; bir bağımlılık eklemek bu iş
 * için orantısız olurdu (brief: "Gereksiz dependency ekleme").
 *
 * ⚠️ `<dialog>` KULLANILMADI ve bu ölçülmüş bir tercih değil, bilinçli bir
 * kısıt: `showModal()` yalnızca istemcide çalışır ve JS gelmeden önce hiçbir
 * şey göstermez. Bu bileşen zaten istemci adası, ama ızgaranın KENDİSİ
 * JS'siz de tam çalışıyor (kareler görünür, künye görünür) — yalnızca büyütme
 * çalışmıyor. Kayıp kabul edilebilir, sessiz boş kutu değil.
 */
export function PlayerGallery({
  images,
  labels,
}: {
  images: MediaAsset[];
  labels: GalleryLabels;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const step = useCallback(
    (delta: number) => {
      setOpen((current) => {
        if (current === null) return current;
        return (current + delta + images.length) % images.length;
      });
    },
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(null);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
        return;
      }
      // Odak tuzağı: Tab kutunun dışına çıkmasın.
      if (event.key !== "Tab") return;
      const root = overlayRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>("button");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      // Odak, kutuyu AÇAN kareye geri dönüyor — klavyeyle gezen kişi
      // listenin başına fırlatılmıyor.
      openerRef.current?.focus();
    };
  }, [open, step]);

  if (images.length === 0) return null;

  const current = open === null ? null : images[open];

  return (
    <section className={styles.gallery} aria-labelledby="oyuncu-galeri">
      <header className={styles.head}>
        <h2 id="oyuncu-galeri" className={`${shell.display} ${styles.heading}`}>
          {labels.title}
        </h2>
        <p className={styles.lede}>{labels.lede}</p>
      </header>

      <ul className={styles.grid}>
        {images.map((image, i) => {
          const wide = image.width > image.height * 1.2;
          const tall = image.height > image.width * 1.25;
          return (
            <li
              key={`${image.src}-${i}`}
              data-wide={wide ? "" : undefined}
              data-tall={tall ? "" : undefined}
            >
              <button
                type="button"
                className={styles.tile}
                onClick={(event) => {
                  openerRef.current = event.currentTarget;
                  setOpen(i);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  loading="lazy"
                  decoding="async"
                />
                <span className={styles.tileVeil} aria-hidden="true" />
                {image.caption ? (
                  <span className={styles.caption}>{image.caption}</span>
                ) : null}
                <span className={styles.zoom} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="6.5" />
                    <path d="M15.8 15.8 21 21M11 8.4v5.2M8.4 11h5.2" />
                  </svg>
                </span>
                <span className={styles.srOnly}>{labels.open}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {current ? (
        <div
          className={styles.overlay}
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={labels.title}
          onClick={(event) => {
            // Yalnızca zemine tıklandığında kapansın; görsele tıklamak değil.
            if (event.target === event.currentTarget) setOpen(null);
          }}
        >
          <button
            type="button"
            className={styles.close}
            onClick={() => setOpen(null)}
            aria-label={labels.close}
            ref={closeRef}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <figure className={styles.lightbox}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              decoding="async"
            />
            {current.caption || current.credit ? (
              <figcaption>
                {current.caption ? <span>{current.caption}</span> : null}
                {current.credit ? (
                  <a
                    href={current.credit.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {current.credit.author} · {current.credit.license}
                  </a>
                ) : null}
              </figcaption>
            ) : null}
          </figure>

          {images.length > 1 ? (
            <div className={styles.pager}>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={labels.prev}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
              <span className={shell.figure}>
                {(open ?? 0) + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={labels.next}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
