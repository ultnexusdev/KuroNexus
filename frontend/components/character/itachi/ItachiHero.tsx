"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getImageProps } from "next/image";
import {
  ITACHI_HERO_EYES,
  type EyeStage,
} from "@/lib/characters/itachi-experience";
import { HeroEye } from "./SharinganEyes";
import styles from "./ItachiExperience.module.css";

/**
 * "The Eyes in the Dark" — hero.
 *
 * Mekanik: parlak sahne TEK katman; üstünde ortası delik bir "karanlık
 * örtü" (sabit radial-gradient) işaretçiyi transform ile izler — fener.
 * (İlk sürüm iki katman + her karede yeniden üretilen mask-image
 * kullanıyordu; inceleme bulgusu üzerine compositor-dostu örtüye
 * çevrildi: sıcak yolda ne layout okuması ne repaint kaldı.)
 *
 * Gözler sahnenin üstünde SVG katmanıdır ve KULLANICI girdisiyle uyanır:
 * karanlık → kor → Sharingan → Mangekyō. Açılış taraması ve dokunmatik
 * salınımı yalnızca feneri gezdirir; aşamaları uyandırmaz (inceleme:
 * sayfa kendi kendine Mangekyō'ya ulaşıyordu).
 *
 * Mühendislik sınırları (keşif + inceleme turlarının bulguları):
 * - Dinleyiciler bileşene KAPSANIR (HeroGlyph dersi) ve rAF ile seyreltilir.
 * - Kargalar tek <canvas>; hero ekran dışındayken ve sekme gizliyken
 *   HER İKİ rAF döngüsü de durur (paylaşılan IntersectionObserver).
 * - Görsel bağlanmamışsa hiçbir döngü kurulmaz (fallback şartı).
 * - reduced-motion: dinleyici/döngü yok; sahne yarı açık, gözler durağan —
 *   ama eyeKey ile Sharingan↔Mangekyō statik geçişi yine çalışır.
 * - Klavye: eyeKey ok tuşlarıyla feneri gezdirir (fener keşfinin klavye
 *   eşdeğeri), Enter/Space aşamaları döndürür.
 */

const SWEEP_MS = 2600;
const HOLD_FOR_MANGEKYO_MS = 900;
const KEY_STEP = 6;

interface HeroLabels {
  hint: string;
  hintTouch: string;
  eyesLabel: string;
  stageNames: Record<EyeStage, string>;
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
  const [stage, setStage] = useState<EyeStage>("dark");
  const [moved, setMoved] = useState(false);
  const [announce, setAnnounce] = useState("");

  /* Değişken durum ref'lerde — rAF döngüleri React'i uyandırmadan okur */
  const pointer = useRef({ x: 50, y: 42, has: false });
  const holdTimer = useRef<number | null>(null);
  const stageRef = useRef<EyeStage>("dark");
  stageRef.current = stage;
  /* Kanvasın IntersectionObserver'ı görünürlüğü buraya yazar; tarama
     döngüsü görünmezken zincirini düşürür, IO `sweepRestart` ile kurar. */
  const heroVisible = useRef(true);
  const sweepRestart = useRef<(() => void) | null>(null);
  /* Sahne kutusunun ölçüsü — sıcak yolda getBoundingClientRect YOK
     (inceleme: yaz-sonra-oku her karede zorunlu layout üretiyordu). */
  const boxSize = useRef({ width: 0, height: 0 });
  /* Anons yalnızca kullanıcı eylemiyle (inceleme: role="status" otomatik
     taramada üç kez kendiliğinden konuşuyordu). */
  const userActed = useRef(false);

  /* Dikey kadraj YALNIZCA dikey görsel bağlıyken (inceleme: mobil görsel
     yokken dar ekranda mobil göz koordinatları masaüstü kadraja uyguланıyordu) */
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
     Sıcak yol yalnız YAZAR: örtü transform'u + px değişkenleri + glow.
     Aşama ilerletme gerçek girdiye (pointer.has) kilitli. */
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

    /* Göz yakınlığı: piksel uzayında en yakın göze uzaklık → 0..1 parlama */
    const px = (x / 100) * width;
    const py = (y / 100) * height;
    const current = vertical ? ITACHI_HERO_EYES.mobile : ITACHI_HERO_EYES.desktop;
    let nearest = Infinity;
    for (const eye of [current.left, current.right]) {
      const ex = (eye.x / 100) * width;
      const ey = (eye.y / 100) * height;
      nearest = Math.min(nearest, Math.hypot(px - ex, py - ey));
    }
    const near = nearest / width;
    const glow = Math.max(0, Math.min(1, 1 - near / 0.26));
    root.style.setProperty("--eye-glow", glow.toFixed(3));

    /* Aşamaları yalnızca gerçek girdi uyandırır — açılış taraması ve
       dokunmatik salınım feneri gezdirir ama gözleri açmaz */
    if (!pointer.current.has) return;

    const hit = near < (current.radius / 100) * 1.7;
    if (hit) {
      if (stageRef.current === "dark" || stageRef.current === "ember") {
        setStage("sharingan");
      }
      if (holdTimer.current === null && stageRef.current !== "mangekyo") {
        holdTimer.current = window.setTimeout(() => {
          holdTimer.current = null;
          setStage("mangekyo");
        }, HOLD_FOR_MANGEKYO_MS);
      }
    } else {
      if (holdTimer.current !== null) {
        window.clearTimeout(holdTimer.current);
        holdTimer.current = null;
      }
      if (stageRef.current === "dark" && glow > 0.2) {
        setStage("ember");
      }
    }
  }, [vertical]);

  const markActed = useCallback(() => {
    userActed.current = true;
    setMoved(true);
  }, []);

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
      markActed();
      if (frame.current === null) {
        frame.current = requestAnimationFrame(applyPointer);
      }
    },
    [applyPointer, markActed, reduced],
  );

  /* Göz bölgesine dokunma/tıklama: Mangekyō'yu doğrudan uyandırır */
  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (reduced) return;
      const box = stageBoxRef.current;
      if (!box) return;
      const rect = box.getBoundingClientRect();
      if (rect.width === 0) return;
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const current = vertical ? ITACHI_HERO_EYES.mobile : ITACHI_HERO_EYES.desktop;
      for (const eye of [current.left, current.right]) {
        const ex = (eye.x / 100) * rect.width;
        const ey = (eye.y / 100) * rect.height;
        if (Math.hypot(px - ex, py - ey) / rect.width < (current.radius / 100) * 2) {
          markActed();
          setStage((value) => (value === "mangekyo" ? "sharingan" : "mangekyo"));
          return;
        }
      }
    },
    [markActed, reduced, vertical],
  );

  /* Klavye: Enter/Space aşama döndürür; ok tuşları feneri gezdirir
     (fener keşfinin klavye eşdeğeri — inceleme bulgusu) */
  const cycleStage = useCallback(() => {
    markActed();
    setStage((value) =>
      value === "dark" || value === "ember"
        ? "sharingan"
        : value === "sharingan"
          ? "mangekyo"
          : "sharingan",
    );
  }, [markActed]);

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
      markActed();
      if (frame.current === null) {
        frame.current = requestAnimationFrame(applyPointer);
      }
    },
    [applyPointer, markActed, reduced],
  );

  /* ── Açılış taraması + dokunmatik gezinen fener ──
     Yalnızca feneri gezdirir. Zincir; gerçek işaretçi devralınca, hero
     ekran dışına çıkınca ve dokunmatikte kullanıcı dokununca düşer. */
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
       fallback'i yok, token boşsa kargalar hiç çizilmez) */
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

    /* Hero görünmüyorken ve sekme gizliyken çizim durur. Kesişim durumu
       yerel değişkende (inceleme: visibilitychange tek başına play()
       çağırıp ekran dışında döngüyü diriltiyordu) ve heroVisible ref'i
       üzerinden tarama döngüsüyle paylaşılır. */
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
      if (holdTimer.current !== null) window.clearTimeout(holdTimer.current);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  /* reduced-motion'da gözler durağan ama İŞLEVLİ: eyeKey Sharingan ↔
     Mangekyō arasında statik geçiş yapar (inceleme bulgusu) */
  const effStage: EyeStage = reduced
    ? stage === "mangekyo"
      ? "mangekyo"
      : "sharingan"
    : stage;

  /* Ekran okuyucu anonsu yalnızca kullanıcı eyleminden sonra */
  useEffect(() => {
    if (userActed.current) {
      setAnnounce(labels.stageNames[effStage]);
    }
  }, [effStage, labels]);

  const eyeGlyph =
    effStage === "mangekyo"
      ? ("mangekyoItachi" as const)
      : effStage === "sharingan"
        ? ("tomoe3" as const)
        : null;

  const eyeStyle = (eye: { x: number; y: number }) => ({
    left: `${eye.x}%`,
    top: `${eye.y}%`,
    width: `${eyes.radius * 2}%`,
  });

  if (!desktopSrc) {
    /* Görsel henüz bağlanmadıysa hero sahnesiz ama ayakta kalır; hiçbir
       döngü/dinleyici kurulmaz (fallback şartı + inceleme bulgusu) */
    return (
      <section className={styles.hero} data-stage="sharingan" data-fallback="">
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
      data-stage={effStage}
      data-reduced={reduced || undefined}
      data-touch={touchMode || undefined}
      data-vertical={vertical || undefined}
      data-moved={moved || undefined}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
    >
      <div ref={stageBoxRef} className={styles.stageBox}>
        <SceneImage desktopSrc={desktopSrc} mobileSrc={mobileSrc} />
        {/* Karanlık örtü: ortası delik sabit gradient; yalnız transform
            değişir (compositor-only fener) */}
        <span ref={veilRef} className={styles.darkVeil} aria-hidden />
        <canvas ref={canvasRef} className={styles.crowCanvas} aria-hidden />
        {([eyes.left, eyes.right] as const).map((eye, index) => (
          <span key={index} className={styles.eyeSlot} style={eyeStyle(eye)} aria-hidden>
            <span className={styles.eyeAura} />
            <HeroEye
              glyph={eyeGlyph}
              className={styles.eyeDisc}
              spinClassName={styles.eyeSpin}
            />
          </span>
        ))}
        <span className={styles.cursorDot} aria-hidden />
      </div>

      {/* Klavye kullanıcısı için görünmez ama odaklanabilir anahtar:
          Enter/Space aşama döndürür, ok tuşları feneri gezdirir */}
      <button
        type="button"
        className={styles.eyeKey}
        onClick={cycleStage}
        onKeyDown={onKeyMove}
        aria-label={labels.eyesLabel}
      />

      <p className={styles.heroHint} aria-hidden>
        {touchMode ? labels.hintTouch : labels.hint}
      </p>
      <p className={styles.stageTag} aria-hidden>
        {labels.stageNames[effStage]}
      </p>
      <p className={styles.visuallyHidden} role="status">
        {announce}
      </p>
    </section>
  );
}
