"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ByakuganEye, CagedBirdSeal, RingDial } from "./HyugaGlyphs";
import styles from "./HinataExperience.module.css";

/**
 * Görüş halkası — sayfanın kalbi.
 *
 * Geometri anlatının kendisi: eş merkezli iki halkanın üstünde eşit
 * aralıklı sekiz tenketsu duruyor ve halkanın TAM ARKASINDAKİ nokta
 * (alt orta, 180°) diğerlerinden farklı işaretli. Orası Byakugan'ın
 * anatomik kör noktası; açıldığında klanın yarası anlatılıyor.
 *
 * ── NEDEN SEKMELİ (tablist) DESENİ ───────────────────────────────────────
 * Noktalar "aç/kapat" değil, "birini seç" davranışı gösteriyor: her an
 * tam olarak biri etkin ve gövde onu gösteriyor. WAI-ARIA'da bunun adı
 * sekme listesi. Kazancı bedava geliyor: ok tuşları halkada dolaşır,
 * Home/End uçlara gider, ekran okuyucu "8 sekmeden 5'i" diye okur.
 * Noktalar gerçek `<button>`; SVG'nin içine tıklanabilir düğüm KONMADI
 * (odak halkası ve dokunma hedefi orada güvenilir değil).
 *
 * Konumlandırma açıdan geliyor: 0° tepe, saat yönünde artıyor. Etiketin
 * dışa doğru kaçması için birim vektör (`--dx`, `--dy`) CSS'e veriliyor —
 * sekiz ayrı konum kuralı yazmaya gerek kalmıyor.
 *
 * Bütün metinler sunucuda seçilip düz dize olarak iniyor (LocalizedText
 * istemciye taşınmıyor — BRIEF §5).
 */

export interface VisionNode {
  key: string;
  /** 0° tepe, saat yönünde artan derece */
  angle: number;
  kanji: string;
  romaji: string;
  title: string;
  readout: string;
  body: string[];
  quote: { text: string; by: string } | null;
  companions: Array<{ name: string; image: string | null; alt: string }>;
  image: string | null;
  imageAlt: string;
  blind: boolean;
}

/** Halkanın yarıçapı — sahne kutusunun yüzdesi olarak. */
const RADIUS = 35;

export function VisionRing({
  nodes,
  ringLabel,
  eyeLabel,
  blindBadge,
  hint,
}: {
  nodes: VisionNode[];
  ringLabel: string;
  eyeLabel: string;
  blindBadge: string;
  hint: string;
}) {
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  const move = useCallback(
    (next: number) => {
      const index = (next + nodes.length) % nodes.length;
      setActive(index);
      tabs.current[index]?.focus();
    },
    [nodes.length],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          move(active + 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          move(active - 1);
          break;
        case "Home":
          event.preventDefault();
          move(0);
          break;
        case "End":
          event.preventDefault();
          move(nodes.length - 1);
          break;
        default:
          break;
      }
    },
    [active, move, nodes.length],
  );

  const current = nodes[active];

  return (
    <div className={styles.ring}>
      <div
        className={styles.ringStage}
        data-blind={current.blind || undefined}
        style={
          { "--hnt-ring-angle": `${current.angle}deg` } as React.CSSProperties
        }
      >
        <RingDial className={styles.ringDial} />
        {/* Gözün baktığı yön: seçili noktaya dönen ışık konisi. Kör
            noktada koni SÖNER — göz oraya bakamıyor. */}
        <span className={styles.ringSweep} aria-hidden />
        <span className={styles.ringEye}>
          <ByakuganEye veined title={eyeLabel} />
        </span>

        <div
          className={styles.ringNodes}
          role="tablist"
          aria-label={ringLabel}
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
        >
          {nodes.map((node, index) => {
            const radian = ((node.angle - 90) * Math.PI) / 180;
            const dx = Math.cos(radian);
            const dy = Math.sin(radian);
            return (
              <button
                key={node.key}
                type="button"
                role="tab"
                id={`hinata-tab-${node.key}`}
                aria-controls={`hinata-panel-${node.key}`}
                aria-selected={index === active}
                tabIndex={index === active ? 0 : -1}
                ref={(element) => {
                  tabs.current[index] = element;
                }}
                className={styles.node}
                data-blind={node.blind || undefined}
                onClick={() => setActive(index)}
                style={
                  {
                    left: `${50 + RADIUS * dx}%`,
                    top: `${50 + RADIUS * dy}%`,
                    "--dx": dx.toFixed(4),
                    "--dy": dy.toFixed(4),
                  } as React.CSSProperties
                }
              >
                <span className={styles.nodeDot} aria-hidden />
                <span className={styles.nodeKanji} aria-hidden>
                  {node.kanji}
                </span>
                <span className={styles.visuallyHidden}>
                  {node.blind ? `${node.title} — ${blindBadge}` : node.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className={styles.ringHint}>{hint}</p>

      <div
        className={styles.ringPanel}
        role="tabpanel"
        id={`hinata-panel-${current.key}`}
        aria-labelledby={`hinata-tab-${current.key}`}
        data-blind={current.blind || undefined}
        tabIndex={0}
      >
        <div className={styles.panelHead}>
          <span className={styles.panelKanji} aria-hidden>
            {current.kanji}
          </span>
          <h3 className={styles.panelTitle}>{current.title}</h3>
          <p className={styles.panelMeta}>
            <span>{current.romaji}</span>
            <span className={styles.panelReadout}>{current.readout}</span>
          </p>
          {current.blind ? (
            <p className={styles.blindBadge}>{blindBadge}</p>
          ) : null}
        </div>

        {current.blind ? (
          <CagedBirdSeal className={styles.blindSeal} />
        ) : null}

        {current.image ? (
          <span className={styles.panelArt}>
            <Image src={current.image} alt={current.imageAlt} fill sizes="720px" />
          </span>
        ) : null}

        <div className={styles.panelBody}>
          {current.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        {current.quote ? (
          <figure className={styles.panelQuote}>
            <blockquote>&ldquo;{current.quote.text}&rdquo;</blockquote>
            <figcaption>{current.quote.by}</figcaption>
          </figure>
        ) : null}

        {current.companions.length > 0 ? (
          <ul className={styles.panelFaces}>
            {current.companions.map((companion) => (
              <li key={companion.name} className={styles.face}>
                <span className={styles.faceArt}>
                  {companion.image ? (
                    <Image
                      src={companion.image}
                      alt={companion.alt}
                      fill
                      sizes="128px"
                    />
                  ) : null}
                </span>
                <span className={styles.faceName}>{companion.name}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
