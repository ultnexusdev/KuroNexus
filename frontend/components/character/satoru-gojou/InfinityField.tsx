"use client";

import { useEffect, useRef } from "react";
import { useMotionSafe } from "./useMotionSafe";
import { useSharedTicker } from "./useSharedTicker";

/**
 * SATORU GOJŌ · INFINITY FIELD — sayfanın iki imza mekanizmasından biri.
 *
 * Gojō'ya ayrılmış negatif alanın tepkisini yönetir. Üç değer yazıyor,
 * başka hiçbir şey yapmıyor:
 *
 *   --g-par-x / --g-par-y   katmanların kayması (mutlak sınır: 12px)
 *   --g-push                negatif alanın büyüme çarpanı (1 → 1.34)
 *
 * ── KURALIN GÖRSEL KARŞILIĞI (fare) ──────────────────────────────────────
 * İmleç merkeze YAKLAŞTIKÇA iki şey birden oluyor:
 *   1. Parallax tepkisi SÖNÜYOR — katmanlar imleci izlemeyi bırakıyor,
 *      yani hareket "ağırlaşıyor". Brief'in "imleç yavaşlar" dediği his
 *      bu; imlecin KENDİSİNE dokunulmuyor.
 *   2. `--g-push` büyüyor — maskenin yarıçapı genişliyor ve tipografi
 *      merkezden daha da geri çekiliyor.
 * İkisi birlikte şunu söylüyor: yaklaştıkça mesafe açılıyor. Zeno.
 *
 * ── DOKUNMATİK ───────────────────────────────────────────────────────────
 * BRIEF P01: "parallax cihaz eğiminden DEĞİL, scroll pozisyonundan
 * türetilir; InfinityField dokunmatikte pasif."
 *
 * Yani parmakla gezen kullanıcıda alanın İTME davranışı hiç çalışmıyor
 * (`--g-push` sabit 1) ve yatay kayma yok; yalnızca hero scroll'a göre
 * dikeyde hafifçe süzülüyor. Cihaz eğimi (`deviceorientation`) BİLEREK
 * kullanılmadı: izin istiyor, hareket hastalığı tetikleyebiliyor ve
 * kullanıcının niyetiyle ilgisi yok.
 *
 * ── NEDEN DOM'DAN ELEMENT ARIYOR ─────────────────────────────────────────
 * Hero sunucuda çiziliyor; bu ada onun içine ref veremiyor. Sayfada tek
 * bir hero var ve `data-gojo-hero` işaretini taşıyor.
 *
 * ── HAREKET SÖZLEŞMESİ ───────────────────────────────────────────────────
 * `reducedMotion` altında bileşen hiç abone olmuyor ve tek bir değer
 * yazmıyor — kompozisyon sunucudaki hâliyle duruyor, bilgi kaybı yok.
 * Kendi rAF döngüsünü açmıyor: paylaşılan ticker (BRIEF kural 4).
 */

/** Katmanların izin verilen en büyük kayması (BRIEF: maksimum 12px). */
const MAX_SHIFT = 12;

/** Negatif alanın imleç merkezdeyken ulaştığı en büyük çarpan. */
const MAX_PUSH = 1.34;

/** Kare başına yaklaşma oranı — 0.12 ≈ 250ms'de oturuyor. */
const EASE = 0.12;

export function InfinityField() {
  const { reducedMotion, coarsePointer } = useMotionSafe();
  const active = !reducedMotion;

  /* Hedef ve mevcut değerler tek bir ref'te: her karede setState çağırmak
     sayfayı yeniden çizerdi, oysa yazılan şey yalnızca üç özel değer.
     React bu döngünün tamamen dışında. */
  const io = useRef({
    el: null as HTMLElement | null,
    radius: 0,
    targetX: 0,
    targetY: 0,
    targetPush: 1,
    x: 0,
    y: 0,
    push: 1,
    dirty: false,
  });

  useEffect(() => {
    if (!active) return;

    const el = document.querySelector<HTMLElement>("[data-gojo-hero]");
    if (!el) return;

    /* Ref'in İÇERİĞİ yerel bir değişkene alınıyor: temizlik çalışırken
       `io.current` başka bir nesneye işaret ediyor olabilirdi. Nesnenin
       kendisi bu bileşenin ömrü boyunca sabit, ama kural doğru ve
       yakalamak bedava (react-hooks/exhaustive-deps). */
    const s = io.current;
    s.el = el;

    /* Negatif alanın yarıçapı CSS'ten okunuyor: tek doğruluk kaynağı
       `--g-infinity`. Burada ikinci bir sayı tanımlamak, token
       değiştiğinde sessizce ayrışırdı. */
    const readRadius = () => {
      const raw = getComputedStyle(el).getPropertyValue("--g-infinity");
      const parsed = Number.parseFloat(raw);
      /* `clamp()` hesaplanmış hâlde px döner; yine de bir taban ver. */
      s.radius = Number.isFinite(parsed) && parsed > 0 ? parsed : 200;
    };
    readRadius();

    /* ── DOKUNMATİK: scroll süzülmesi ────────────────────────────────── */
    function onScroll() {
      const node = s.el;
      if (!node) return;
      const box = node.getBoundingClientRect();
      /* Hero ekranın ortasındayken 0, girip çıkarken ±1. */
      const center = box.top + box.height / 2;
      const progress = (center - window.innerHeight / 2) / window.innerHeight;
      s.targetX = 0;
      s.targetY = Math.max(-1, Math.min(1, progress)) * MAX_SHIFT;
      s.targetPush = 1;
      s.dirty = true;
    }

    /* ── FARE: yaklaşma + sönümleme ──────────────────────────────────── */
    function onPointerMove(event: PointerEvent) {
      /* Yalnızca gerçek fare: kalem ve parmak bu daldan geçmiyor. */
      if (event.pointerType !== "mouse") return;
      const node = s.el;
      if (!node) return;

      const box = node.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;

      const distance = Math.hypot(dx, dy);
      const radius = s.radius;

      /* SÖNÜMLEME. Merkezde 0, yarıçapın dışında 1. Katmanlar merkeze
         yaklaşan imleci izlemeyi bırakıyor — "ağırlaşma" hissi. */
      const damp = radius > 0 ? Math.min(1, distance / radius) : 1;

      /* İTME. Merkezde en büyük, yarıçapın dışında yok. */
      const closeness = radius > 0 ? Math.max(0, 1 - distance / radius) : 0;

      /* Normalize edilmiş yön × sönümleme × sınır. Kutunun yarısına
         bölmek, kenardaki imleçte tam 12px vermeyi garantiliyor. */
      const nx = box.width > 0 ? dx / (box.width / 2) : 0;
      const ny = box.height > 0 ? dy / (box.height / 2) : 0;

      s.targetX = Math.max(-1, Math.min(1, nx)) * MAX_SHIFT * damp;
      s.targetY = Math.max(-1, Math.min(1, ny)) * MAX_SHIFT * damp;
      s.targetPush = 1 + (MAX_PUSH - 1) * closeness;
      s.dirty = true;
    }

    /* İmleç alandan çıkınca her şey dinlenme hâline dönüyor. */
    function onPointerLeave() {
      s.targetX = 0;
      s.targetY = 0;
      s.targetPush = 1;
      s.dirty = true;
    }

    if (coarsePointer) {
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    } else {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      el.addEventListener("pointerleave", onPointerLeave);
    }
    window.addEventListener("resize", readRadius);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", readRadius);
      /* ⚠️ Sökülürken yazdığı her şeyi geri alıyor: bileşen kalkıp
         değerler kalsaydı kompozisyon donmuş bir kaymada asılı
         kalırdı. */
      el.style.removeProperty("--g-par-x");
      el.style.removeProperty("--g-par-y");
      el.style.removeProperty("--g-push");
      s.el = null;
    };
  }, [active, coarsePointer]);

  useSharedTicker(() => {
    const s = io.current;
    const el = s.el;
    if (!el || !s.dirty) return;

    s.x += (s.targetX - s.x) * EASE;
    s.y += (s.targetY - s.y) * EASE;
    s.push += (s.targetPush - s.push) * EASE;

    /* Hedefe yeterince yaklaştıysa yaz ve DUR: her karede sonsuza kadar
       yazmak boşa iş. */
    const settled =
      Math.abs(s.targetX - s.x) < 0.05 &&
      Math.abs(s.targetY - s.y) < 0.05 &&
      Math.abs(s.targetPush - s.push) < 0.002;
    if (settled) {
      s.x = s.targetX;
      s.y = s.targetY;
      s.push = s.targetPush;
      s.dirty = false;
    }

    el.style.setProperty("--g-par-x", `${s.x.toFixed(2)}px`);
    el.style.setProperty("--g-par-y", `${s.y.toFixed(2)}px`);
    el.style.setProperty("--g-push", s.push.toFixed(3));
  }, active);

  return null;
}
