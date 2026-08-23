import type { InnerWorld } from "@/lib/anime/bleach/zanpakuto";
import styles from "./InnerWorldScene.module.css";

/**
 * İÇ DÜNYA SAHNELERİ — altı ruh, altı manzara.
 *
 * Her sahne saf CSS + inline SVG. Renk sahnenin kendisinden gelmiyor:
 * `--iw-ink` / `--iw-accent` / `--iw-paper` üç değişkeni dışarıdan iniyor
 * (kılıcın canon paleti, veri olarak). Yani aynı çizim farklı bir palette
 * farklı bir dünya oluyor.
 *
 * ⚠️ Hepsi `aria-hidden`: sahne dekor. Anlatıyı ruhun adı ve iki üç cümle
 * taşıyor — brief: "Başka hiçbir şey. Boşluk = güç."
 */
export function InnerWorldScene({ scene }: { scene: InnerWorld["scene"] }) {
  return (
    <div className={styles.scene} data-scene={scene} aria-hidden="true">
      {scene === "city" ? <City /> : null}
      {scene === "petals" ? <Petals /> : null}
      {scene === "ice" ? <Ice /> : null}
      {scene === "ruins" ? <Ruins /> : null}
      {scene === "snow" ? <Snow /> : null}
      {scene === "curtain" ? <Curtain /> : null}
    </div>
  );
}

/**
 * Zangetsu — sonsuz gökdelen şehri, YAN YATMIŞ.
 *
 * Ufuk dikey: sahne 90 derece döndürülüyor (CSS). Ichigo'nun iç dünyasında
 * yerçekimi doksan derece dönmüştür ve o bunu tuhaf bulmaz — çizimin de
 * bunu tuhaf bulmaması gerekiyor.
 */
function City() {
  const towers = [12, 40, 22, 64, 30, 88, 18, 52, 26, 74, 34, 46];
  return (
    <svg viewBox="0 0 400 300" className={styles.art}>
      {towers.map((h, i) => (
        <rect
          key={i}
          x={i * 34 + 4}
          y={300 - h * 3}
          width="26"
          height={h * 3}
          fill="currentColor"
          opacity={0.35 + (i % 3) * 0.18}
        />
      ))}
      {/* Pencereler: dikey ritim, çok az */}
      {towers.map((h, i) =>
        Array.from({ length: Math.floor(h / 12) }, (_, j) => (
          <rect
            key={`${i}-${j}`}
            x={i * 34 + 11}
            y={300 - h * 3 + 14 + j * 26}
            width="5"
            height="9"
            fill="var(--iw-accent)"
            opacity="0.5"
          />
        )),
      )}
    </svg>
  );
}

/** Senbonzakura — beyaz boşlukta düşen yapraklar; her yaprak bir bıçak */
function Petals() {
  const petals = Array.from({ length: 26 }, (_, i) => ({
    x: (i * 37) % 100,
    y: (i * 61) % 100,
    r: (i * 47) % 360,
    s: 0.6 + ((i * 13) % 9) / 10,
  }));
  return (
    <div className={styles.petalField}>
      {petals.map((p, i) => (
        <span
          key={i}
          className={styles.petal}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            rotate: `${p.r}deg`,
            scale: String(p.s),
            animationDelay: `${-(i * 0.7)}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Hyōrinmaru — donmuş gökyüzü, buz sütunları */
function Ice() {
  const pillars = [30, 78, 52, 96, 44, 68, 86, 38];
  return (
    <svg viewBox="0 0 400 300" className={styles.art}>
      {/* Kırılmış gökyüzü: ince çatlak hatları */}
      <g stroke="currentColor" strokeWidth="0.8" opacity="0.35" fill="none">
        <path d="M0 60 90 92 168 54 252 96 330 58 400 88" />
        <path d="M0 118 76 96 150 132 236 100 318 138 400 108" />
        <path d="M90 92 76 96M168 54 150 132M252 96 236 100M330 58 318 138" />
      </g>
      {/* Buz sütunları: yerden göğe */}
      {pillars.map((h, i) => (
        <path
          key={i}
          d={`M${i * 50 + 12} 300 L${i * 50 + 24} ${300 - h * 2.4} L${i * 50 + 36} 300 Z`}
          fill="currentColor"
          opacity={0.28 + (i % 3) * 0.16}
        />
      ))}
    </svg>
  );
}

/** Nozarashi — yıkık savaş alanı, tek dev figür */
function Ruins() {
  return (
    <svg viewBox="0 0 400 300" className={styles.art}>
      {/* Yıkıntı hattı */}
      <path
        d="M0 300v-38l28-16 22 24 34-40 26 30 40-52 30 44 36-28 28 36 40-46 32 40 30-24 24 30v40Z"
        fill="currentColor"
        opacity="0.4"
      />
      {/* Tek dev figür — silüet, yüz yok */}
      <path
        d="M196 300v-96l-16-30 8-34 16-12 16 12 8 34-16 30v96Z"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Omzunda taşınan dev bıçak */}
      <path d="M212 178 268 66l14 8-52 116Z" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

/** Sode no Shirayuki — kar tutan sessizlik */
function Snow() {
  const flakes = Array.from({ length: 34 }, (_, i) => ({
    x: (i * 53) % 100,
    y: (i * 29) % 100,
    s: 1 + ((i * 7) % 5) * 0.4,
  }));
  return (
    <div className={styles.snowField}>
      {flakes.map((f, i) => (
        <span
          key={i}
          className={styles.flake}
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: `${f.s}px`,
            height: `${f.s}px`,
            animationDelay: `${-(i * 0.9)}s`,
          }}
        />
      ))}
      {/* Kar hattı: tek yatay iz, dibe yakın */}
      <span className={styles.snowLine} />
    </div>
  );
}

/** Benihime — kırmızı perde ve gölgeler */
function Curtain() {
  return (
    <svg viewBox="0 0 400 300" className={styles.art} preserveAspectRatio="none">
      {Array.from({ length: 9 }, (_, i) => (
        <path
          key={i}
          d={`M${i * 46} 0 q${10 + (i % 3) * 6} 150 ${(i % 2 ? -6 : 6)} 300 L${i * 46 + 46} 300 q${-8 - (i % 3) * 4} -150 ${(i % 2 ? 4 : -4)} -300 Z`}
          fill="currentColor"
          opacity={0.18 + (i % 3) * 0.14}
        />
      ))}
    </svg>
  );
}
