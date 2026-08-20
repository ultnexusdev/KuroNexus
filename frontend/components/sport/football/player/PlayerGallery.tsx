"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiUrl } from "@/lib/api/client";
import type { PlayerImageSlot } from "@/lib/sport/favourite-players";
import { PlayerImage } from "./PlayerImage";
import { usePlayerCurator } from "./PlayerCurator";
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
 * Kareler farklı oranlarda (dikey portre, yatay maç anı, kare antrenman).
 * Hepsini aynı kutuya sokmak ya kırpma ya boşluk üretir. Izgara
 * `grid-auto-flow: dense` ile çalışıyor ve her karenin span'i KENDİ
 * ORANINDAN hesaplanıyor.
 *
 * ── YER TUTUCU KARELER TIKLANMIYOR ───────────────────────────────────────
 * Henüz fotoğrafı olmayan bir yuvada ışık kutusunun gösterecek şeyi yok;
 * o kareler `<div>` olarak çiziliyor, `<button>` olarak değil. Klavyeyle
 * gezen kişi boş bir durağa takılmıyor. Küratör modundaki düzenle düğmesi
 * yine de orada — `PlayerImage` onu kendisi basıyor.
 *
 * ── IŞIK KUTUSU: NE VAR NE YOK ───────────────────────────────────────────
 * Var: Escape, sol/sağ ok, odak tuzağı, açılışta odak kapatma düğmesinde,
 * kapanışta odak geri açan karede, `aria-modal`, gövde kaydırma kilidi.
 * Yok: kütüphane. Bunların tamamı ~70 satır; bir bağımlılık orantısız olurdu.
 */
export function PlayerGallery({
  images,
  labels,
}: {
  images: PlayerImageSlot[];
  labels: GalleryLabels;
}) {
  const curator = usePlayerCurator();
  const [open, setOpen] = useState<number | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  /** Bir yuvanın gösterilebilir kaynağı var mı (küratör kopyası ya da gerçek kare)? */
  const sourceOf = useCallback(
    (slot: PlayerImageSlot): string | null => {
      const override = curator?.urlOf(
        slot.owner ?? curator.defaultOwner,
        slot.id,
      );
      if (override) return apiUrl(override);
      return slot.placeholder ? null : slot.src;
    },
    [curator],
  );

  /** Işık kutusu YALNIZCA gösterilebilir kareler arasında geziniyor. */
  const openable = images.filter((slot) => sourceOf(slot) !== null);

  const step = useCallback(
    (delta: number) => {
      setOpen((current) => {
        if (current === null) return current;
        return (current + delta + openable.length) % openable.length;
      });
    },
    [openable.length],
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
      openerRef.current?.focus();
    };
  }, [open, step]);

  if (images.length === 0) return null;

  const current = open === null ? null : openable[open];
  const currentSrc = current ? sourceOf(current) : null;

  return (
    <section className={styles.gallery} aria-labelledby="oyuncu-galeri">
      <header className={styles.head}>
        <h2 id="oyuncu-galeri" className={styles.title}>
          {labels.title}
        </h2>
        <p className={styles.lede}>{labels.lede}</p>
      </header>

      <ul className={styles.grid}>
        {images.map((slot, i) => {
          const wide = (slot.width ?? 1) > (slot.height ?? 1) * 1.2;
          const tall = (slot.height ?? 1) > (slot.width ?? 1) * 1.25;
          const openIndex = openable.indexOf(slot);
          /**
           * ⚠️ KÜRATÖR MODUNDA IŞIK KUTUSU KAPALI.
           *
           * Kare düzenlenebilirken `<button>` olarak çizilirse düzenleyicinin
           * dosya/adres alanları o düğmenin İÇİNDE kalıyor: hem geçersiz HTML
           * (button içinde button/input) hem de adres kutusuna basınca ışık
           * kutusunun açılması — kullanıcı bildirimi, "yeni bağlantı adresi
           * eklememi engelliyor". Düzenlerken göz atmaya da gerek yok; mod
           * kapanınca büyütme geri geliyor.
           */
          const clickable = openIndex >= 0 && !curator?.curating;

          const inner = (
            <>
              <PlayerImage slot={slot} position="50% 24%" />
              <span className={styles.veil} aria-hidden="true" />
              {slot.caption ? (
                <span className={styles.caption}>{slot.caption}</span>
              ) : null}
              {clickable ? (
                <span className={styles.zoom} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="6.5" />
                    <path d="M15.8 15.8 21 21M11 8.4v5.2M8.4 11h5.2" />
                  </svg>
                </span>
              ) : null}
            </>
          );

          return (
            <li
              key={slot.id}
              data-wide={wide ? "" : undefined}
              data-tall={tall ? "" : undefined}
              data-lead={i === 0 ? "" : undefined}
            >
              {clickable ? (
                <button
                  type="button"
                  className={styles.tile}
                  onClick={(event) => {
                    openerRef.current = event.currentTarget;
                    setOpen(openIndex);
                  }}
                >
                  {inner}
                  <span className={styles.srOnly}>{labels.open}</span>
                </button>
              ) : (
                <div className={styles.tile} data-static="">
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {current && currentSrc ? (
        <div
          className={styles.overlay}
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={labels.title}
          onClick={(event) => {
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
              src={currentSrc}
              alt={current.alt}
              width={current.width}
              height={current.height}
              decoding="async"
            />
            {current.caption ? (
              <figcaption>{current.caption}</figcaption>
            ) : null}
          </figure>

          {openable.length > 1 ? (
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
              <span>
                {(open ?? 0) + 1} / {openable.length}
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
