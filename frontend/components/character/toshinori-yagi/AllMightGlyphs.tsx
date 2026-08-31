import styles from "./PlusUltraExperience.module.css";

/**
 * Toshinori Yagi sayfasının ELLE ÇİZİLMİŞ SVG'leri.
 *
 * Faz 2 görsel politikası: sahne/teknik görselleri ÜRETİLMEZ, dışarıdan
 * raster indirilmez. Motif gerekiyorsa elle SVG çizilir. Bu dosyadaki üç
 * parça sayfanın bütün grafiğini taşıyor:
 *
 *   SpeechBalloon → filigranın birinci yarısı: çizgi roman konuşma balonu
 *   SpeedBeam     → filigranın ikinci yarısı: ışın (speed line) demeti
 *   SmashGauge    → kalan süre göstergesi; ışın demetinin sayaç hâli
 *
 * ⚠️ Bu dosyada `"use client"` YOK ve olmamalı: hiçbirinin durumu yok.
 * `SmashGauge` bir istemci adasından (`SmashMeter`) çağrıldığı için istemci
 * paketine giriyor, ama kendisi bir ada değil — üç ada sınırı bu dosyayı
 * saymıyor (Eren'deki `ErenGlyphs`, Nanami'deki `RatioGlyphs` ile aynı
 * desen).
 *
 * ⚠️ RENK: hiçbir `fill`/`stroke` özniteliği burada yazılmıyor. Hepsi CSS
 * modülündeki sınıflardan token okuyor (kural 16).
 */

/* ── Konuşma balonu ─────────────────────────────────────────────────────── */

/**
 * Balonun `d` dizesi.
 *
 * Elle çizilmiş demek, kusurlu demek: kenar noktaları düzgün bir elipsten
 * bilinçli olarak kaydırıldı (her köşede birkaç birim), böylece kontur
 * ölçülmüş değil MÜREKKEPLE çekilmiş görünüyor. Kapalı bir şekil ama
 * dolgusuz — yalnızca kontur (brief §Filigran).
 */
const BALLOON_D =
  "M28 44 C34 20 92 8 168 9 C246 10 306 22 310 46 " +
  "C314 70 292 92 236 99 L214 128 L206 98 " +
  "C118 100 52 90 34 74 C26 66 25 54 28 44 Z";

/** Balonun içindeki üç nokta — "söz sürüyor" işareti. */
const BALLOON_DOTS = [
  { cx: 122, cy: 54, r: 7 },
  { cx: 166, cy: 54, r: 7 },
  { cx: 210, cy: 54, r: 7 },
];

/** Filigranın birinci yarısı: dolgusuz konuşma balonu konturu. */
export function SpeechBalloon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 336 136"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      focusable="false"
    >
      <path className={styles.balloonLine} d={BALLOON_D} />
      {BALLOON_DOTS.map((dot) => (
        <circle
          key={dot.cx}
          className={styles.balloonDot}
          cx={dot.cx}
          cy={dot.cy}
          r={dot.r}
        />
      ))}
    </svg>
  );
}

/* ── Işın demeti ────────────────────────────────────────────────────────── */

/**
 * Merkezden dışa açılan sivri ışınlar (speed line).
 *
 * Her ışın bir üçgen: merkezden çıkıyor, dışarıda genişliyor. Açı adımı
 * eşit DEĞİL — `i * i % 7` ile hafifçe bozuluyor ki demet mekanik değil
 * çizilmiş görünsün. Uzunluklar da üç kademede değişiyor.
 */
function beamRays(count: number): string[] {
  const rays: string[] = [];
  const cx = 200;
  const cy = 200;
  for (let i = 0; i < count; i++) {
    const step = (Math.PI * 2) / count;
    const angle = i * step + ((i * i) % 7) * 0.012;
    const half = 0.006 + ((i % 3) * 0.004);
    const len = 190 + ((i % 4) * 26);
    const x1 = cx + Math.cos(angle - half) * 26;
    const y1 = cy + Math.sin(angle - half) * 26;
    const x2 = cx + Math.cos(angle) * len;
    const y2 = cy + Math.sin(angle) * len;
    const x3 = cx + Math.cos(angle + half) * 26;
    const y3 = cy + Math.sin(angle + half) * 26;
    rays.push(
      `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} ` +
        `L${x3.toFixed(1)} ${y3.toFixed(1)} Z`,
    );
  }
  return rays;
}

const BEAM_RAYS = beamRays(34);

/** Filigranın ikinci yarısı: merkezden patlayan ışın demeti. */
export function SpeedBeam({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      focusable="false"
    >
      {BEAM_RAYS.map((d, index) => (
        <path
          key={d}
          className={styles.beamRay}
          d={d}
          data-tier={index % 3}
        />
      ))}
    </svg>
  );
}

/* ── Kalan süre göstergesi ──────────────────────────────────────────────── */

const GAUGE_TICKS = 24;

/**
 * Kalan süre göstergesi — filigranın ışın demetinin YATAY hâli.
 *
 * Çubuk değil ÇENTİK dizisi: soldan sağa 24 sivri ışın; kaçının yandığı
 * `lit` ile geliyor. Sönmüş olanlar silinmiyor, yalnızca sönüyor —
 * harcanan sürenin izi kalıyor (mekaniğin bütün fikri bu).
 *
 * ⚠️ Ölçüyü çağıran hesaplıyor; burada durum YOK.
 */
export function SmashGauge({
  lit,
  className,
}: {
  /** Yanacak çentik sayısı, 0–24 */
  lit: number;
  className?: string;
}) {
  const ticks = Array.from({ length: GAUGE_TICKS }, (_, index) => index);
  return (
    <svg
      className={className}
      viewBox="0 0 480 48"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      {ticks.map((index) => {
        const x = 6 + index * 19.6;
        /* Sivri uç: üstte dar, altta geniş — ışın hissi */
        const d =
          `M${(x + 7).toFixed(1)} 6 L${(x + 13).toFixed(1)} 6 ` +
          `L${(x + 16).toFixed(1)} 42 L${(x + 3).toFixed(1)} 42 Z`;
        return (
          <path
            key={index}
            className={styles.gaugeTick}
            d={d}
            data-lit={index < lit ? "true" : "false"}
          />
        );
      })}
      <path className={styles.gaugeBase} d="M0 45 L480 45" />
    </svg>
  );
}
