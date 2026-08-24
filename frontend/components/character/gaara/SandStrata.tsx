"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { SandBand } from "./SandGlyphs";
import styles from "./GaaraExperience.module.css";

/**
 * Kum katmanları — sayfanın kalbi.
 *
 * Beş tabakalı bir KESİT: yandan bakılan, üst üste yığılmış beş kum bandı.
 * Bir bant seçildiğinde ALTINDAKİ bütün bantlar da yanar, çünkü Gaara'nın
 * savunması birikimli — beşinci kat ilk dördünün üstünde duruyor.
 *
 * ── DİZİLİŞ ──────────────────────────────────────────────────────────────
 * DOM sırası 1→5, yani ekran okuyucunun ve klavyenin gördüğü sıra
 * tırmanış sırası. Kesitin ters dizilişi (1 en altta) yalnızca CSS'te,
 * `column-reverse` ile. Bu yüzden ok tuşları GÖRSEL yöne bağlanıyor:
 *   ↑ / → : bir üst katman (daha derin tırmanış)
 *   ↓ / ← : bir alt katman        Home/End : ilk/son katman
 * Roving tabindex: yalnızca etkin sekme tab sırasında.
 *
 * Metin sunucuda seçilmiş düz dize olarak iniyor (BRIEF §5): bu ada
 * `LocalizedText` görmüyor.
 */

export interface LayerView {
  key: string;
  kanji: string;
  name: string;
  turkish: string;
  tag: string;
  text: string;
  cost: string;
  image: string | null;
}

export function SandStrata({
  layers,
  listLabel,
  layerWord,
  costLabel,
  litLabel,
  keyboardHint,
  sectionAlt,
}: {
  layers: LayerView[];
  listLabel: string;
  layerWord: string;
  costLabel: string;
  litLabel: string;
  keyboardHint: string;
  sectionAlt: string;
}) {
  const [index, setIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = layers[index];
  if (!active) {
    return null;
  }

  /* Sekmeler arası geçişte odak da taşınır — klavye kullanıcısı seçtiği
     bandın üstünde kalmalı (roving tabindex şartı). */
  const focusTab = (next: number) => {
    const clamped = (next + layers.length) % layers.length;
    setIndex(clamped);
    tabRefs.current[clamped]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowRight":
        event.preventDefault();
        focusTab(index + 1);
        break;
      case "ArrowDown":
      case "ArrowLeft":
        event.preventDefault();
        focusTab(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(layers.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.strata} data-layer={index}>
      {/* Kesit: tablist YALNIZCA bantları taşır (rol sözleşmesi), açıklama
          satırı listenin dışında kalır. */}
      <div className={styles.strataColumn}>
        <div
          className={styles.strataStack}
          role="tablist"
          aria-orientation="vertical"
          aria-label={listLabel}
          onKeyDown={onKeyDown}
        >
          {layers.map((layer, position) => (
            <button
              key={layer.key}
              type="button"
              role="tab"
              id={`gaa-layer-tab-${layer.key}`}
              aria-selected={position === index}
              aria-controls="gaa-layer-panel"
              tabIndex={position === index ? 0 : -1}
              ref={(node) => {
                tabRefs.current[position] = node;
              }}
              className={styles.band}
              data-lit={position <= index ? "true" : undefined}
              data-active={position === index ? "true" : undefined}
              onClick={() => setIndex(position)}
            >
              <SandBand
                index={position}
                className={styles.bandArt}
                edgeClassName={styles.bandEdge}
                grainClassName={styles.bandGrains}
              />
              <span className={styles.bandIndex} aria-hidden>
                {position + 1}
              </span>
              <span className={styles.bandBody}>
                <span className={styles.bandName}>{layer.turkish}</span>
                <span className={styles.bandRomaji}>{layer.name}</span>
              </span>
              <span className={styles.bandKanji} aria-hidden>
                {layer.kanji}
              </span>
            </button>
          ))}
        </div>
        {/* Kesitin okunuşu — ekran okuyucuya da iniyor */}
        <p className={styles.strataCaption}>{sectionAlt}</p>
      </div>

      <div
        id="gaa-layer-panel"
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`gaa-layer-tab-${active.key}`}
        className={styles.layerPanel}
      >
        {active.image ? (
          <span className={styles.layerArt} aria-hidden>
            <Image src={active.image} alt="" fill sizes="720px" />
          </span>
        ) : null}

        <p className={styles.layerCount}>
          <span className={styles.layerCountNumber}>{index + 1}</span>
          <span className={styles.layerCountTotal}>
            / {layers.length} · {litLabel}
          </span>
        </p>
        <h3 className={styles.layerTitle}>
          {active.turkish}
          <span className={styles.layerWord}>
            {index + 1}. {layerWord}
          </span>
        </h3>
        <p className={styles.layerName}>
          <span className={styles.layerKanji} aria-hidden>
            {active.kanji}
          </span>
          {active.name}
        </p>
        <p className={styles.layerTag}>{active.tag}</p>
        <p className={styles.layerText}>{active.text}</p>
        <p className={styles.layerCost}>
          <span className={styles.layerCostLabel}>{costLabel}</span>
          {active.cost}
        </p>
        <p className={styles.strataHint}>{keyboardHint}</p>
      </div>
    </div>
  );
}
