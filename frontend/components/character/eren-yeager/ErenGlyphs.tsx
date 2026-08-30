import styles from "./RumblingExperience.module.css";

/**
 * Eren Yeager sayfasının ELLE ÇİZİLMİŞ SVG'leri.
 *
 * Faz 2 görsel politikası: sahne/teknik görselleri ÜRETİLMEZ, dışarıdan
 * raster indirilmez. Motif gerekiyorsa elle SVG çizilir. Bu dosyadaki dört
 * parça sayfanın bütün grafiğini taşıyor:
 *
 *   WallTeeth   → filigranın ikinci yarısı: dolgusuz duvar dişleri konturu
 *   BasementKey → künye şeridindeki sembolik obje (babasının bodrum anahtarı)
 *   TitanCrowd  → yürüyüş sahnesi; kalabalık bir SVG deseniyle katlanıyor
 *   HorizonMark → ufuk çizgisinin üstündeki küçük ölçü işareti
 *
 * ⚠️ Bu dosyada `"use client"` YOK ve olmamalı: hiçbirinin durumu yok.
 * `TitanCrowd` bir istemci adasından (MarchWalk) çağrıldığı için istemci
 * paketine giriyor, ama kendisi bir ada değil — üç ada sınırı bu dosyayı
 * saymıyor (Nanami'deki RatioGlyphs ile aynı desen).
 *
 * ⚠️ RENK: hiçbir `fill`/`stroke` özniteliği burada yazılmıyor. Hepsi CSS
 * modülündeki sınıflardan token okuyor (kural 16) — `stop-color` dâhil.
 */

/* ── Duvar dişleri ──────────────────────────────────────────────────────── */

/**
 * Mazgallı duvar profilinin `d` dizesi.
 *
 * Elle çizilmiş demek, kusurlu demek: diş yükseklikleri `i % 3` ile hafifçe
 * oynatıldı, yani kontur ölçülü değil ÖRÜLMÜŞ görünüyor. Kapalı bir şekil
 * değil — dolgusu olmayan tek bir kırık çizgi (brief: "dolgusuz kontur").
 */
function teethPath(teeth: number, unit: number): string {
  const base = 58;
  let d = `M0 ${base}`;
  for (let i = 0; i < teeth; i++) {
    const x = i * unit;
    const top = 14 + (i % 3) * 2.4;
    d += ` L${x.toFixed(1)} ${top.toFixed(1)}`;
    d += ` L${(x + unit * 0.6).toFixed(1)} ${(top + (i % 2) * 1.2).toFixed(1)}`;
    d += ` L${(x + unit * 0.6).toFixed(1)} ${base}`;
    d += ` L${(x + unit).toFixed(1)} ${base}`;
  }
  return d;
}

const TEETH_D = teethPath(18, 40);

/** Filigranın ikinci yarısı: dolgusuz duvar dişleri. */
export function WallTeeth({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 720 64"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <path className={styles.teethLine} d={TEETH_D} />
      <path className={styles.teethGround} d="M0 58 L720 58" />
    </svg>
  );
}

/* ── Bodrum anahtarı ────────────────────────────────────────────────────── */

/** Künye şeridindeki sembolik obje — Grisha'nın Eren'e bıraktığı anahtar. */
export function BasementKey({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 34 96"
      aria-hidden
      focusable="false"
    >
      {/* halka */}
      <circle className={styles.keyLine} cx="17" cy="17" r="11" />
      <circle className={styles.keyLine} cx="17" cy="17" r="5" />
      {/* gövde */}
      <path className={styles.keyLine} d="M17 28 L17 88" />
      {/* dişler */}
      <path className={styles.keyLine} d="M17 68 L28 68 L28 74" />
      <path className={styles.keyLine} d="M17 78 L26 78" />
      {/* uç */}
      <path className={styles.keyLine} d="M13 88 L21 88" />
    </svg>
  );
}

/* ── Ufuk işareti ───────────────────────────────────────────────────────── */

/** Ufuk çizgisinin başındaki küçük ölçü çentiği. */
export function HorizonMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 16" aria-hidden focusable="false">
      <path className={styles.horizonMarkLine} d="M0 15 L48 15" />
      <path className={styles.horizonMarkLine} d="M2 15 L2 4" />
      <path className={styles.horizonMarkLine} d="M14 15 L14 9" />
      <path className={styles.horizonMarkLine} d="M26 15 L26 9" />
      <path className={styles.horizonMarkLine} d="M38 15 L38 9" />
    </svg>
  );
}

/* ── Yürüyüş sahnesi ────────────────────────────────────────────────────── */

/**
 * Duvar titanı silueti — 24×40'lık bir kutuda tek bir kapalı şekil.
 * Kafa, geniş omuz, incelen gövde, iki bacak. Kasıtlı olarak KABA: bu bir
 * portre değil, uzaktan görülen bir gövde.
 */
const FIGURE_D =
  "M12 1.4c2.7 0 4.4 2 4.4 4.5 0 1.7-.8 3.1-2 3.9l3.6 1.7c1.7.9 2.6 2.4 2.7 4.4" +
  "l.4 7.6-2.8.3-.5-5.7-.7 7 1 14.8-3.3.3-2-12.2-2 12.2-3.3-.3 1-14.8-.7-7-.5 5.7" +
  "-2.8-.3.4-7.6c.1-2 1-3.5 2.7-4.4l3.6-1.7c-1.2-.8-2-2.2-2-3.9C7.2 3.4 9 1.4 12 1.4z";

const STAGE_W = 1200;
const STAGE_H = 320;

/**
 * Yürüyüş sahnesi.
 *
 * ── NEDEN DESEN, NEDEN BİN TANE `<use>` DEĞİL ────────────────────────────
 * Mekaniğin son iki adımı bin ve "sayısız" siluet istiyor. Bunu bin ayrı
 * düğümle çizmek tarayıcıyı boşuna yorardı ve amaç zaten tek tek figürleri
 * saymak DEĞİL — kalabalığın dokuya dönüştüğünü görmek. Tek bir
 * `<pattern>` karosu bunu bedelsiz veriyor: karo küçüldükçe sayı katlanıyor.
 *
 * İlk adım istisna: orada gerçekten TEK bir figür var ve büyük çizilmesi
 * gerekiyor (`tileW === 0`).
 *
 * Karo, sahnenin ALTINA hizalanıyor (`y = STAGE_H % tileH`) — böylece en alt
 * sıra hep tam, yani figürler zemine BASIYOR, havada kesilmiyor.
 */
export function TitanCrowd({
  tileW,
  tileH,
  className,
}: {
  tileW: number;
  tileH: number;
  className?: string;
}) {
  const single = tileW <= 0 || tileH <= 0;
  const scale = single ? 0 : Math.min(tileW / 24, tileH / 40) * 0.86;
  const offsetX = single ? 0 : (tileW - 24 * scale) / 2;
  const offsetY = single ? 0 : tileH - 40 * scale;
  const patternY = single ? 0 : STAGE_H % tileH;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
      focusable="false"
    >
      <defs>
        <path id="ern-figure" d={FIGURE_D} />
        {single ? null : (
          <pattern
            id="ern-crowd"
            x={0}
            y={patternY}
            width={tileW}
            height={tileH}
            patternUnits="userSpaceOnUse"
          >
            <g transform={`translate(${offsetX} ${offsetY}) scale(${scale})`}>
              <use className={styles.crowdFigure} href="#ern-figure" />
            </g>
          </pattern>
        )}
        <linearGradient id="ern-depth" x1="0" y1="0" x2="0" y2="1">
          <stop className={styles.depthTop} offset="0" />
          <stop className={styles.depthFade} offset="0.62" />
          <stop className={styles.depthFoot} offset="1" />
        </linearGradient>
      </defs>

      {single ? (
        <g transform={`translate(${STAGE_W / 2 - 24 * 3.4} ${STAGE_H - 40 * 6.9}) scale(6.9)`}>
          <use className={styles.crowdFigure} href="#ern-figure" />
        </g>
      ) : (
        <rect x="0" y="0" width={STAGE_W} height={STAGE_H} fill="url(#ern-crowd)" />
      )}

      {/* Derinlik perdesi: üst sıralar geriye çekilsin */}
      <rect
        x="0"
        y="0"
        width={STAGE_W}
        height={STAGE_H}
        fill="url(#ern-depth)"
      />
      <path className={styles.crowdGround} d={`M0 ${STAGE_H - 1} L${STAGE_W} ${STAGE_H - 1}`} />
    </svg>
  );
}
