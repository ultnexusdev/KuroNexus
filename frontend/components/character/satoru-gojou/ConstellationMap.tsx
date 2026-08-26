"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import styles from "./GojoExperience.module.css";

/**
 * P08 · TAKIMYILDIZ — etkileşim adası.
 *
 * ══ YÖRÜNGE MERKEZE DEĞMİYOR ═══════════════════════════════════════════
 * Her bağlantı çizgisi düğümden merkeze doğru uzanıyor ama ÇİZGİNİN KENDİ
 * TANIMI onu merkezden önce bitiriyor: bir `linearGradient` ile son parça
 * saydamlaşıyor. Yani kesme bir maske hilesi değil, çizginin rengi.
 * Ayrıca geometri de destekliyor — çizgi `R_STOP` yarıçapında duruyor,
 * merkeze kadar uzanmıyor bile.
 *
 * ══ KLAVYE ═════════════════════════════════════════════════════════════
 * Ağ tamamen klavyeyle gezilebilir (BRIEF şartı):
 *   · Her düğüm gerçek `<button>`.
 *   · Gezinme "roving tabindex" ile: gruba TEK sekme girişi var, içeride
 *     ok tuşları dolaşıyor. Yedi düğümü tek tek sekmelemek zorunda
 *     bırakmak sayfanın geri kalanına ulaşmayı zorlaştırırdı.
 *   · Seçili düğüm `aria-current="true"`.
 *
 * ══ ATMOSFER TOKEN SEVİYESİNDE ═════════════════════════════════════════
 * Seçim yalnızca kök öğedeki `--node-tone` değerini değiştiriyor; bölümün
 * ışıması ve yörünge renkleri ondan türüyor. Hiçbir bileşen moda ya da
 * seçime göre yeniden çizilmiyor (BRIEF: "atmosfer kaymaları token
 * seviyesinde, yeniden render ile değil").
 */

export interface MapNode {
  key: string;
  name: string;
  tag: string;
  text: string;
}

/** Düğümlerin yerleştiği çember yarıçapı (yüzde). */
const R_NODE = 40;

/**
 * Yörüngenin merkeze en fazla yaklaştığı yarıçap.
 * ⚠️ Merkezdeki portre `clamp(6rem, 22%, 11rem)` genişlikte, yani yarıçapı
 * ~%11. Çizgiler %18'de duruyor: portreye değmiyorlar bile.
 */
const R_STOP = 18;

export function ConstellationMap({
  nodes,
  idleLabel,
  keyHint,
  centerSlot,
  centerLabel,
  nodeArt,
}: {
  nodes: MapNode[];
  idleLabel: string;
  keyHint: string;
  /** Merkezdeki öğretmen kadrajı — sunucuda çizilmiş */
  centerSlot: ReactNode;
  centerLabel: string;
  /**
   * Düğüm siluetleri — sunucuda çizilmiş, anahtar başına bir tane.
   * ⚠️ `noEdit` ile geliyorlar: `<button>` içinde ikinci bir etkileşimli
   * öğe geçersiz HTML olurdu. Küratör bunları bölümdeki ayrı şeritten
   * düzenliyor.
   */
  nodeArt: Record<string, ReactNode>;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const active = nodes.find((node) => node.key === selected) ?? null;

  const move = useCallback(
    (from: number, delta: number) => {
      const next = (from + delta + nodes.length) % nodes.length;
      setFocusIndex(next);
      refs.current[next]?.focus();
    },
    [nodes.length],
  );

  const onKeyDown = useCallback(
    (index: number) => (event: React.KeyboardEvent<HTMLButtonElement>) => {
      const delta =
        event.key === "ArrowRight" || event.key === "ArrowDown"
          ? 1
          : event.key === "ArrowLeft" || event.key === "ArrowUp"
            ? -1
            : 0;
      if (delta === 0) return;
      event.preventDefault();
      move(index, delta);
    },
    [move],
  );

  /* Düğüm konumları — tepeden başlayıp saat yönünde. Deterministik. */
  const placed = nodes.map((node, index) => {
    const angle = (index / nodes.length) * Math.PI * 2 - Math.PI / 2;
    return {
      node,
      angle,
      x: 50 + Math.cos(angle) * R_NODE,
      y: 50 + Math.sin(angle) * R_NODE,
    };
  });

  return (
    <>
      <div
        className={styles.webStage}
        data-selected={selected ?? undefined}
        style={
          selected
            ? ({ "--node-tone": `var(--g-s08-${selected})` } as React.CSSProperties)
            : undefined
        }
      >
        <svg
          className={styles.webLines}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            {placed.map(({ node, x, y, angle }) => {
              const sx = 50 + Math.cos(angle) * R_STOP;
              const sy = 50 + Math.sin(angle) * R_STOP;
              return (
                /* ⚠️ Gradyan MERKEZE BAKAN uçta tamamen saydam.
                   Çizgi merkeze doğru yaklaşırken yok oluyor. */
                <linearGradient
                  key={node.key}
                  id={`gojo-orbit-${node.key}`}
                  gradientUnits="userSpaceOnUse"
                  x1={x}
                  y1={y}
                  x2={sx}
                  y2={sy}
                >
                  <stop offset="0%" stopColor="var(--g-s08-line)" />
                  <stop
                    offset="55%"
                    stopColor="var(--g-s08-line)"
                    stopOpacity="0.5"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--g-s08-line)"
                    stopOpacity="0"
                  />
                </linearGradient>
              );
            })}
          </defs>

          {placed.map(({ node, x, y, angle }) => (
            <line
              key={node.key}
              className={styles.webOrbit}
              data-on={selected === node.key ? "1" : undefined}
              x1={x}
              y1={y}
              x2={50 + Math.cos(angle) * R_STOP}
              y2={50 + Math.sin(angle) * R_STOP}
              stroke={`url(#gojo-orbit-${node.key})`}
              style={
                { "--node-tone": `var(--g-s08-${node.key})` } as React.CSSProperties
              }
            />
          ))}
        </svg>

        <div className={styles.webCore} aria-label={centerLabel}>
          {centerSlot}
        </div>

        {placed.map(({ node, x, y }, index) => (
          <button
            key={node.key}
            type="button"
            ref={(el) => {
              refs.current[index] = el;
            }}
            className={styles.webNode}
            style={
              {
                "--nx": x.toFixed(2),
                "--ny": y.toFixed(2),
                "--nodeTone": `var(--g-s08-${node.key})`,
              } as React.CSSProperties
            }
            aria-current={selected === node.key ? "true" : undefined}
            /* Roving tabindex: gruba tek giriş. */
            tabIndex={index === focusIndex ? 0 : -1}
            onFocus={() => setFocusIndex(index)}
            onKeyDown={onKeyDown(index)}
            onClick={() =>
              setSelected((current) => (current === node.key ? null : node.key))
            }
          >
            {nodeArt[node.key] ? (
              <span className={styles.webNodeArt} aria-hidden="true">
                {nodeArt[node.key]}
              </span>
            ) : (
              <span className={styles.webNodeDot} aria-hidden="true" />
            )}
            <span className={styles.webNodeName}>{node.name}</span>
            <span className={styles.webNodeTag}>{node.tag}</span>
          </button>
        ))}
      </div>

      {/* Seçilen bağlantı. `role="status"`: seçim ekran okuyucuya da
          bildiriliyor, yalnızca görsel bir değişim değil. */}
      <div className={styles.webDetail} role="status">
        {active ? (
          <>
            <p className={styles.webDetailName}>{active.name}</p>
            <p className={styles.webDetailText}>{active.text}</p>
          </>
        ) : (
          <p className={styles.webDetailText}>{idleLabel}</p>
        )}
      </div>

      <p className={styles.webHint}>{keyHint}</p>
    </>
  );
}
