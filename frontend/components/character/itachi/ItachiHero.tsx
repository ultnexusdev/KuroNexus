"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getImageProps } from "next/image";
import { ITACHI_HERO_EYES } from "@/lib/characters/itachi-experience";
import styles from "./ItachiExperience.module.css";

/**
 * "The Eyes in the Dark" — hero.
 *
 * Mekanik: parlak sahne TEK katman; üstünde ortası delik bir "karanlık
 * örtü" (sabit radial-gradient) işaretçiyi transform ile izler — fener.
 * Compositor-only: sıcak yolda ne layout okuması ne repaint var.
 *
 * ⚠️ Gözlerin üstüne SVG disk BİNMİYOR (kullanıcı, 19 Ağustos 2026:
 * "bu 2 hareketli animasyonu kaldıralım"). Sahnedeki yüz zaten kendi
 * gözlerini taşıyor; fener onlara yaklaştıkça göz çukurlarında kızıl
 * hale güçleniyor — uyanma hissi yapay bir katmandan değil, ışıktan
 * geliyor. Sharingan glifleri sayfanın geri kalanında yaşıyor.
 *
 * Mühendislik sınırları (keşif + inceleme turları):
 * - Dinleyiciler bileşene KAPSANIR ve rAF ile seyreltilir.
 * - Kargalar tek <canvas>; hero ekran dışındayken ve sekme gizliyken
 *   HER İKİ rAF döngüsü de durur (paylaşılan IntersectionObserver).
 * - Görsel bağlanmamışsa hiçbir döngü kurulmaz (fallback şartı).
 * - reduced-motion: dinleyici/döngü yok; sahne açık gelir.
 * - Klavye: ok tuşları feneri gezdirir, Enter/Space karanlığı kaldırır.
 */

const SWEEP_MS = 2600;
const KEY_STEP = 6;

interface HeroLabels {
  hint: string;
  hintTouch: string;
  revealLabel: string;
  hideLabel: string;
}

/** Sahne görseli — <picture> ile sanat yönü: dar ekran dikey kadrajı çeker. */
function SceneImage({
  desktopSrc,
  mobileSrc,
}: {
  desktopSrc: string;
  mobileSrc: string | null;
}) {
  const common = {
    alt: "",
    fill: true as const,
    sizes: "100vw",
    priority: true,
  };
  const { props: desktop } = getImageProps({
    ...common,
    src: desktopSrc,
    fetchPriority: "high",
  });
  const mobile = mobileSrc
    ? getImageProps({ ...common, src: mobileSrc }).props
    : null;
  return (
    <span className={styles.layerBase} aria-hidden>
      <picture>
        {mobile ? (
          <source media="(max-width: 760px)" srcSet={mobile.srcSet} />
        ) : null}
        {/* eslint-disable-next-line jsx-a11y/alt-text -- dekoratif katman */}
        <img {...desktop} />
      </picture>
    </span>
  );
}

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

export function ItachiHero({
  desktopSrc,
  mobileSrc,
  labels,
}: {
  desktopSrc: string | null;
  mobileSrc: string | null;
  labels: HeroLabels;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const stageBoxRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [reduced, setReduced] = useState(false);
  const [touchMode, setTouchMode] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [moved, setMoved] = useState(false);
  const [revealed, setRevealed] = useState(false);

  /* Değişken durum ref'lerde — rAF döngüleri React'i uyandırmadan okur */
  const pointer = useRef({ x: 50, y: 42, has: false });
  /* Kanvasın IntersectionObserver'ı görünürlüğü buraya yazar; tarama
     döngüsü görünmezken zincirini düşürür, IO `sweepRestart` ile kurar. */
  const heroVisible = useRef(true);
  const sweepRestart = useRef<(() => void) | null>(null);
  /* Sahne kutusunun ölçüsü — sıcak yolda getBoundingClientRect YOK */
  const boxSize = useRef({ width: 0, height: 0 });

  /* Dikey kadraj YALNIZCA dikey görsel bağlıyken: mobil görsel yoksa dar
     ekran 16:9 kalır ve masaüstü göz koordinatları geçerliliğini korur */
  const hasMobile = mobileSrc !== null;
  const vertical = narrow && hasMobile;
  const eyes = vertical ? ITACHI_HERO_EYES.mobile : ITACHI_HERO_EYES.desktop;

  /* ── Ortam algısı: reduced-motion / dokunmatik / dar kadraj ── */
  useEffect(() => {
    const media = [
      ["(prefers-reduced-motion: reduce)", setReduced],
      ["(hover: none)", setTouchMode],
      ["(max-width: 760px)", setNarrow],
    ] as const;
    const cleanups = media.map(([query, set]) => {
      const list = window.matchMedia(query);
      set(list.matches);
      const onChange = (event: MediaQueryListEvent) => set(event.matches);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    });
    return () => cleanups.forEach((off) => off());
  }, []);

  /* ── Sahne kutusu ölçümü — tek yerden, gözlemciyle ── */
  useEffect(() => {
    if (reduced || !desktopSrc) return;
    const box = stageBoxRef.current;
    if (!box) return;
    const measure = () => {
      boxSize.current = { width: box.clientWidth, height: box.clientHeight };
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, [desktopSrc, reduced, vertical]);

  /* ── Fener + göz yakınlığı ──
     Sıcak yol yalnız YAZAR: örtü transform'u, imleç px'i, göz halesi. */
  const frame = useRef<number | null>(null);
  const applyPointer = useCallback(() => {
    frame.current = null;
    const root = rootRef.current;
    const { width, height } = boxSize.current;
    if (!root || width === 0) return;
    const { x, y } = pointer.current;

    const veil = veilRef.current;
    if (veil) {
      const dx = (((x - 50) / 100) * width).toFixed(1);
      const dy = (((y - 50) / 100) * height).toFixed(1);
      veil.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    }
    root.style.setProperty("--mx-px", `${((x / 100) * width).toFixed(1)}px`);
    root.style.setProperty("--my-px", `${((y / 100) * height).toFixed(1)}px`);

    /* Göz halesi: fener göze yaklaştıkça göz çukuru kızıla uyanır */
    const px = (x / 100) * width;
    const py = (y / 100) * height;
    const current = vertical ? ITACHI_HERO_EYES.mobile : ITACHI_HERO_EYES.desktop;
    let nearest = Infinity;
    for (const eye of [current.left, current.right]) {
      const ex = (eye.x / 100) * width;
      const ey = (eye.y / 100) * height;
      nearest = Math.min(nearest, Math.hypot(px - ex, py - ey));
    }
    const glow = Math.max(0, Math.min(1, 1 - nearest / width / 0.26));
    root.style.setProperty("--eye-glow", glow.toFixed(3));
  }, [vertical]);

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (reduced) return;
      const box = stageBoxRef.current;
      if (!box) return;
      /* Okuma olay anında, yazmalar rAF'ta — yaz-sonra-oku döngüsü yok */
      const rect = box.getBoundingClientRect();
      if (rect.width === 0) return;
      pointer.current = {
        x: clampPercent(((event.clientX - rect.left) / rect.width) * 100),
        y: clampPercent(((event.clientY - rect.top) / rect.height) * 100),
        has: true,
      };
      setMoved(true);
      if (frame.current === null) {
        frame.current = requestAnimationFrame(applyPointer);
      }
    },
    [applyPointer, reduced],
  );

  /* Klavye: ok tuşları feneri gezdirir (fener keşfinin klavye eşdeğeri) */
  const onKeyMove = useCallback(
    (event: React.KeyboardEvent) => {
      if (reduced) return;
      let dx = 0;
      let dy = 0;
      if (event.key === "ArrowLeft") dx = -KEY_STEP;
      else if (event.key === "ArrowRight") dx = KEY_STEP;
      else if (event.key === "ArrowUp") dy = -KEY_STEP;
      else if (event.key === "ArrowDown") dy = KEY_STEP;
      else return;
      event.preventDefault();
      pointer.current = {
        x: clampPercent(pointer.current.x + dx),
        y: clampPercent(pointer.current.y + dy),
        has: true,
      };
      setMoved(true);
      if (frame.current === null) {
        frame.current = requestAnimationFrame(applyPointer);
      }
    },
    [applyPointer, reduced],
  );

  /* ── Açılış taraması + dokunmatik gezinen fener ──
     Zincir; gerçek işaretçi devralınca, hero ekran dışına çıkınca ve
     dokunmatikte kullanıcı dokununca düşer. */
  useEffect(() => {
    if (reduced || !desktopSrc) return;
    let raf = 0;
    const start = performance.now();
    const from = { x: 18, y: 78 };
    const tick = (now: number) => {
      raf = 0; // zincir bu karede düştü; yeniden kurulmazsa `arm` kurabilir
      if (!heroVisible.current) return; // hero ekran dışı — IO geri çağırır
      if (pointer.current.has) return; // kullanıcı devraldı (fare ya da dokunuş)
      const t = (now - start) / SWEEP_MS;
      const current = vertical ? ITACHI_HERO_EYES.mobile : ITACHI_HERO_EYES.desktop;
      const target = {
        x: (current.left.x + current.right.x) / 2,
        y: (current.left.y + current.right.y) / 2,
      };
      if (t < 1) {
        const ease = 1 - Math.pow(1 - Math.min(1, t), 3);
        pointer.current.x = from.x + (target.x - from.x) * ease;
        pointer.current.y = from.y + (target.y - from.y) * ease;
      } else if (touchMode) {
        /* Dokunmatik: gözler çevresinde yumuşak salınım (dokunuşa dek) */
        const wave = (now - start - SWEEP_MS) / 1000;
        pointer.current.x = target.x + Math.sin(wave * 0.7) * 16;
        pointer.current.y = target.y + Math.cos(wave * 0.53) * 9;
      } else {
        applyPointer();
        return; // tarama bitti, işaretçi bekleniyor
      }
      applyPointer();
      raf = requestAnimationFrame(tick);
    };
    const arm = () => {
      if (raf === 0) {
        raf = requestAnimationFrame(tick);
      }
    };
    sweepRestart.current = arm;
    arm();
    return () => {
      sweepRestart.current = null;
      if (raf !== 0) cancelAnimationFrame(raf);
      raf = 0;
    };
  }, [applyPointer, desktopSrc, reduced, touchMode, vertical]);

  /* ── Kargalar: tek canvas, üç derinlik katmanı ── */
  useEffect(() => {
    if (reduced || !desktopSrc) return;
    const canvas = canvasRef.current;
    const box = stageBoxRef.current;
    if (!canvas || !box) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    /* Renk token'dan (canvas CSS değişkeni çözmez; kural 16 — ham renk
       yedeği yok, token boşsa kargalar hiç çizilmez) */
    const crowColor = getComputedStyle(box).getPropertyValue("--ita-crow").trim();
    if (!crowColor) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    const resize = () => {
      width = box.clientWidth;
      height = box.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(box);

    interface Crow {
      x: number;
      y: number;
      speed: number;
      size: number;
      alpha: number;
      depth: number; // 0 uzak — 1 yakın (parallax çarpanı)
      phase: number;
      flapSpeed: number;
      dir: 1 | -1;
    }
    const layers = [
      { count: 8, size: [5, 8], alpha: 0.22, speed: [8, 14], depth: 0.15 },
      { count: 6, size: [9, 13], alpha: 0.4, speed: [16, 26], depth: 0.45 },
      { count: 4, size: [14, 20], alpha: 0.6, speed: [30, 44], depth: 1 },
    ];
    const between = (min: number, max: number) => min + Math.random() * (max - min);
    const crows: Crow[] = layers.flatMap((layer) =>
      Array.from({ length: layer.count }, () => ({
        x: Math.random() * 100,
        y: between(8, 88),
        speed: between(layer.speed[0], layer.speed[1]),
        size: between(layer.size[0], layer.size[1]),
        alpha: layer.alpha,
        depth: layer.depth,
        phase: Math.random() * Math.PI * 2,
        flapSpeed: between(4, 7),
        dir: Math.random() > 0.5 ? 1 : -1,
      })),
    );

    let running = false;
    let raf = 0;
    let last = 0;
    const draw = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      context.clearRect(0, 0, width, height);
      const parallax = ((pointer.current.x - 50) / 50) * 8;
      for (const crow of crows) {
        crow.phase += crow.flapSpeed * dt;
        crow.x += ((crow.speed * dt) / width) * 100 * crow.dir;
        crow.y += Math.sin(crow.phase * 0.35) * 0.02;
        /* Kadraj dışına çıkan karga karşı kenardan yeni bir yolda döner */
        if (crow.dir === 1 && crow.x > 108) {
          crow.x = -8;
          crow.y = between(8, 88);
        } else if (crow.dir === -1 && crow.x < -8) {
          crow.x = 108;
          crow.y = between(8, 88);
        }
        const flap = Math.sin(crow.phase);
        const cx = (crow.x / 100) * width - parallax * crow.depth;
        const cy = (crow.y / 100) * height;
        const s = crow.size;
        context.globalAlpha = crow.alpha;
        context.strokeStyle = crowColor;
        context.lineWidth = Math.max(1, s * 0.16);
        context.lineCap = "round";
        context.beginPath();
        context.moveTo(cx - s, cy);
        context.quadraticCurveTo(cx - s * 0.45, cy - s * 0.7 * flap, cx, cy);
        context.quadraticCurveTo(cx + s * 0.45, cy - s * 0.7 * flap, cx + s, cy);
        context.stroke();
      }
      context.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    const play = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(draw);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    /* Hero görünmüyorken ve sekme gizliyken çizim durur; kesişim durumu
       yerel değişkende tutulur ve tarama döngüsüyle paylaşılır */
    let intersecting = false;
    const visibility = new IntersectionObserver(
      (entries) => {
        intersecting = entries.some((entry) => entry.isIntersecting);
        heroVisible.current = intersecting;
        if (intersecting && !document.hidden) {
          play();
          sweepRestart.current?.();
        } else {
          pause();
        }
      },
      { threshold: 0.05 },
    );
    visibility.observe(box);
    const onHidden = () =>
      document.hidden || !intersecting ? pause() : play();
    document.addEventListener("visibilitychange", onHidden);

    return () => {
      pause();
      visibility.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, [desktopSrc, reduced]);

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const eyeStyle = (eye: { x: number; y: number }) => ({
    left: `${eye.x}%`,
    top: `${eye.y}%`,
    width: `${eyes.radius * 2}%`,
  });

  if (!desktopSrc) {
    /* Görsel henüz bağlanmadıysa hero sahnesiz ama ayakta kalır; hiçbir
       döngü/dinleyici kurulmaz (fallback şartı) */
    return (
      <section className={styles.hero} data-fallback="">
        <div className={styles.stageBox}>
          <span className={styles.fallbackMoon} aria-hidden />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={rootRef}
      className={styles.hero}
      data-reduced={reduced || undefined}
      data-touch={touchMode || undefined}
      data-vertical={vertical || undefined}
      data-moved={moved || undefined}
      data-revealed={revealed || undefined}
      onPointerMove={onPointerMove}
    >
      <div ref={stageBoxRef} className={styles.stageBox}>
        <SceneImage desktopSrc={desktopSrc} mobileSrc={mobileSrc} />
        {/* Karanlık örtü: ortası delik sabit gradient; yalnız transform
            değişir (compositor-only fener) */}
        <span ref={veilRef} className={styles.darkVeil} aria-hidden />
        <canvas ref={canvasRef} className={styles.crowCanvas} aria-hidden />
        {/* Göz haleleri: sahnedeki gözlerin üstünde YALNIZ ışık — disk yok */}
        {([eyes.left, eyes.right] as const).map((eye, index) => (
          <span
            key={index}
            className={styles.eyeSlot}
            style={eyeStyle(eye)}
            aria-hidden
          >
            <span className={styles.eyeAura} />
          </span>
        ))}
        <span className={styles.cursorDot} aria-hidden />
      </div>

      {/* Klavye/erişilebilirlik anahtarı: ok tuşları feneri gezdirir,
          Enter/Space karanlığı tümden kaldırır */}
      <button
        type="button"
        className={styles.eyeKey}
        onClick={() => setRevealed((value) => !value)}
        onKeyDown={onKeyMove}
        aria-pressed={revealed}
      >
        {revealed ? labels.hideLabel : labels.revealLabel}
      </button>

      <p className={styles.heroHint} aria-hidden>
        {touchMode ? labels.hintTouch : labels.hint}
      </p>
    </section>
  );
}
