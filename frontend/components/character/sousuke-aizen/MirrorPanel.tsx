"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import {
  MIRROR_SHARDS,
  MirrorBed,
  SealMark,
  ShardMark,
  insetShard,
  toClipPath,
  toPoints,
  type ShardPoints,
} from "./AizenGlyphs";
import styles from "./AizenExperience.module.css";

/**
 * Kırılan ayna paneli — sayfanın kalbi.
 *
 * Beş cam parçası, beş yalan/gerçek çifti. Bir parçaya basılınca o parça
 * kırılır, yerinden azıcık kayar ve sağdaki deftere kaydın üstünü örttüğü
 * satır düşer. **Kırılan parça kırık kalır** (kullanıcı komutu): durum geri
 * alınmıyor, yalnızca büyüyor.
 *
 * ── NEDEN <button>, NEDEN clip-path ─────────────────────────────────────
 * SVG'nin içine gerçek bir düğme konamıyor; `<g role="button">` ise ev
 * kuralına aykırı (BRIEF kural 7: tıklanabilir her şey gerçek button).
 * Çözüm: parçanın poligonu bir HTML `<button>`ın `clip-path`i oluyor —
 * vuruş alanı camın gerçek şekliyle birebir örtüşüyor, ok tuşu ve Sekme
 * doğal çalışıyor. Düğmenin İÇİNDEKİ yüz ise poligonun içe çekilmiş hâli
 * (`insetShard`), yani odak konturu ve parlaması kırpılmıyor; aradaki
 * boşluk da kırığın görünen çizgisi oluyor.
 *
 * Katman durumu (Resmî Kayıt / Kırılan Yansıma) buraya karışmıyor: bu panel
 * kendi oyununu oynuyor, kabuk kendi katmanını çeviriyor.
 */

/** Kırığın çıkış noktası — geometriyle aynı kutu (AizenGlyphs). */
const IMPACT: readonly [number, number] = [58, 36];

function centroidOf(points: ShardPoints): [number, number] {
  const cx = points.reduce((sum, p) => sum + p[0], 0) / points.length;
  const cy = points.reduce((sum, p) => sum + p[1], 0) / points.length;
  return [cx, cy];
}

/**
 * Parçanın kırıldığında kaçtığı yön: darbe noktasından ağırlık merkezine
 * doğru. Yüzde değil piksel veriyoruz — panel boyu değişince kaymanın da
 * büyümesi camı "patlamış" gösteriyordu; sabit kayma daha soğuk duruyor.
 */
function driftOf(points: ShardPoints): { x: number; y: number; rot: number } {
  const [cx, cy] = centroidOf(points);
  const dx = cx - IMPACT[0];
  const dy = cy - IMPACT[1];
  const len = Math.hypot(dx, dy) || 1;
  return {
    x: Math.round((dx / len) * 480) / 100,
    y: Math.round((dy / len) * 480) / 100,
    /* Dönme yönü kaymanın yönünden türüyor: her parça farklı, hiçbiri rastgele */
    rot: Math.round(((dx * dy) / (len * len)) * 220) / 100,
  };
}

/** Parçanın üstündeki çatlak: darbe noktasından çıkıp bir köşede biten çizgi. */
function crackOf(points: ShardPoints): string {
  const [cx, cy] = centroidOf(points);
  const vx = cx - IMPACT[0];
  const vy = cy - IMPACT[1];
  const len = Math.hypot(vx, vy) || 1;
  const midX = IMPACT[0] + vx * 0.55;
  const midY = IMPACT[1] + vy * 0.55;
  /* Dikey kaydırma: çatlak düz bir çizgi değil, tek kırılmalı */
  const kinkX = midX + (-vy / len) * 3.4;
  const kinkY = midY + (vx / len) * 3.4;
  const far = points[Math.floor(points.length / 2)];
  const near = insetShard(points, 0.86);
  const end = near[Math.floor(near.length / 2)];
  return [
    `M ${IMPACT[0]} ${IMPACT[1]}`,
    `L ${kinkX.toFixed(2)} ${kinkY.toFixed(2)}`,
    `L ${((end[0] + far[0]) / 2).toFixed(2)} ${((end[1] + far[1]) / 2).toFixed(2)}`,
  ].join(" ");
}

export interface MirrorShardView {
  key: string;
  subject: string;
  record: string;
  reflection: string;
}

export function MirrorPanel({
  shards,
  recordName,
  reflectionName,
  sealedText,
  breakAllLabel,
  breakAllDoneLabel,
  counterTemplate,
  hint,
  brokenSuffix,
  sceneSrc,
  sceneAlt,
}: {
  shards: MirrorShardView[];
  recordName: string;
  reflectionName: string;
  sealedText: string;
  breakAllLabel: string;
  breakAllDoneLabel: string;
  counterTemplate: string;
  hint: string;
  /** Kırılmış parçanın erişilebilir adına eklenen durum */
  brokenSuffix: string;
  sceneSrc: string | null;
  sceneAlt: string;
}) {
  const [broken, setBroken] = useState<readonly string[]>([]);
  const allBroken = broken.length === shards.length;

  const breakShard = (key: string) => {
    setBroken((current) =>
      current.includes(key) ? current : [...current, key],
    );
  };

  return (
    <div className={styles.mirror}>
      <div className={styles.mirrorStage}>
        <div className={styles.mirrorSurface}>
          {sceneSrc ? (
            <Image
              className={styles.mirrorScene}
              src={sceneSrc}
              alt={sceneAlt}
              fill
              sizes="(max-width: 900px) 92vw, 520px"
            />
          ) : null}
          <MirrorBed className={styles.mirrorBed} />

          {shards.map((shard) => {
            const points = MIRROR_SHARDS[shard.key];
            if (!points) {
              return null;
            }
            const isBroken = broken.includes(shard.key);
            const drift = driftOf(points);
            const rowId = `azn-shard-${shard.key}`;
            return (
              <button
                key={shard.key}
                type="button"
                className={styles.shard}
                data-broken={isBroken || undefined}
                aria-expanded={isBroken}
                aria-controls={rowId}
                aria-disabled={isBroken || undefined}
                onClick={() => breakShard(shard.key)}
                style={
                  {
                    clipPath: toClipPath(points),
                    "--shard-x": `${drift.x}px`,
                    "--shard-y": `${drift.y}px`,
                    "--shard-rot": `${drift.rot}deg`,
                  } as CSSProperties
                }
              >
                <svg
                  className={styles.shardFace}
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                  focusable="false"
                >
                  <polygon
                    className={styles.shardPoly}
                    points={toPoints(insetShard(points))}
                  />
                  <path className={styles.shardCrack} d={crackOf(points)} />
                </svg>
                <span className={styles.visuallyHidden}>
                  {shard.subject}
                  {isBroken ? ` — ${brokenSuffix}` : ""}
                </span>
              </button>
            );
          })}
        </div>

        <p className={styles.mirrorCounter}>
          <span className={styles.mirrorCounterBar} aria-hidden>
            {shards.map((shard) => (
              <span
                key={shard.key}
                className={styles.mirrorTick}
                data-on={broken.includes(shard.key) || undefined}
              />
            ))}
          </span>
          <span role="status" aria-live="polite">
            {counterTemplate.replace("%s", String(broken.length))}
          </span>
        </p>

        <button
          type="button"
          className={styles.breakAll}
          onClick={() => setBroken(shards.map((shard) => shard.key))}
          aria-disabled={allBroken || undefined}
        >
          {allBroken ? breakAllDoneLabel : breakAllLabel}
        </button>
        <p className={styles.mirrorHint}>{hint}</p>
      </div>

      <ol className={styles.ledger}>
        {shards.map((shard) => {
          const isBroken = broken.includes(shard.key);
          return (
            <li
              key={shard.key}
              className={styles.ledgerRow}
              data-broken={isBroken || undefined}
            >
              <h3 className={styles.ledgerSubject}>{shard.subject}</h3>
              <div className={styles.ledgerBlock}>
                <p className={styles.ledgerTag}>
                  <SealMark className={styles.ledgerTagIcon} />
                  {recordName}
                </p>
                <p className={styles.ledgerText}>{shard.record}</p>
              </div>
              <div className={styles.ledgerBlock} id={`azn-shard-${shard.key}`}>
                {isBroken ? (
                  <>
                    <p className={`${styles.ledgerTag} ${styles.ledgerTagTrue}`}>
                      <ShardMark className={styles.ledgerTagIcon} />
                      {reflectionName}
                    </p>
                    <p className={styles.ledgerText}>{shard.reflection}</p>
                  </>
                ) : (
                  <p className={styles.ledgerSealed}>{sealedText}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
