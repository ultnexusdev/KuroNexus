"use client";

import { useEffect, useRef } from "react";

/**
 * SATORU GOJŌ · TEK rAF DÖNGÜSÜ.
 *
 * BRIEF · hareket sözleşmesi kural 4: "Her component kendi
 * `requestAnimationFrame`'ini açmaz; paylaşılan bir ticker kullanılır."
 *
 * ── NEDEN ÖNEMLİ ─────────────────────────────────────────────────────────
 * Sayfada parallax, partikül, ızgara bükülmesi, sayaçlar ve çarpışma alanı
 * var. Her biri kendi döngüsünü açsaydı tarayıcı kare başına altı ayrı
 * geri çağırma zinciri çalıştırırdı; hepsi aynı 16.6ms'yi paylaştığı için
 * kazanç yok, ama her döngünün kendi zamanlama kayması ve kendi
 * temizlenme hatası riski oluyor. Tek döngü + abone kümesi hem ölçülebilir
 * hem tek yerden durdurulabilir.
 *
 * ── ÜÇ DURDURMA KAPISI ───────────────────────────────────────────────────
 *   1. Abone kalmadığında döngü tamamen kapanıyor (boşa kare yok).
 *   2. `document.hidden` iken duruyor (BRIEF kural 6) — arka plandaki
 *      sekme pil harcamıyor.
 *   3. Abonenin kendisi `active` bayrağıyla susabiliyor; bölümler
 *      `IntersectionObserver` ile görünür değilken bunu kullanıyor
 *      (BRIEF kural 4, ikinci cümle).
 *
 * Modül düzeyinde tekil: aynı sayfada kaç bileşen çağırırsa çağırsın
 * tek bir `requestAnimationFrame` zinciri var.
 */

type TickHandler = (deltaMs: number, nowMs: number) => void;

const subscribers = new Set<TickHandler>();
let frame = 0;
let previous = 0;

function step(now: number) {
  /* İlk karede delta anlamsız; sıfırla başlat ki abone ilk çağrıda
     devasa bir sıçrama görmesin (sekme geri geldiğinde de aynı durum). */
  const delta = previous === 0 ? 0 : now - previous;
  previous = now;
  for (const handler of subscribers) {
    handler(delta, now);
  }
  frame = requestAnimationFrame(step);
}

function start() {
  if (frame !== 0) return;
  if (typeof document !== "undefined" && document.hidden) return;
  if (subscribers.size === 0) return;
  previous = 0;
  frame = requestAnimationFrame(step);
}

function stop() {
  if (frame === 0) return;
  cancelAnimationFrame(frame);
  frame = 0;
  previous = 0;
}

/**
 * Sekme görünürlüğü dinleyicisi de tekil: her abone kendi dinleyicisini
 * eklerse yüz abonede yüz dinleyici olur.
 */
let visibilityBound = false;

function bindVisibility() {
  if (visibilityBound || typeof document === "undefined") return;
  visibilityBound = true;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });
}

/**
 * Paylaşılan döngüye abone olur.
 *
 * @param handler her karede çağrılan iş — geçen süre (ms) ve zaman damgası
 * @param active  `false` iken abone olunmaz; görünürlük kapısı budur
 */
export function useSharedTicker(handler: TickHandler, active = true): void {
  /* Geri çağırmayı ref'te tutmak, çağıranın her render'da yeni bir
     fonksiyon üretmesini zararsız kılıyor: abonelik `active` değişmedikçe
     yeniden kurulmuyor. */
  const ref = useRef(handler);
  ref.current = handler;

  useEffect(() => {
    if (!active) return;
    bindVisibility();

    const tick: TickHandler = (delta, now) => ref.current(delta, now);
    subscribers.add(tick);
    start();

    return () => {
      subscribers.delete(tick);
      if (subscribers.size === 0) stop();
    };
  }, [active]);
}
