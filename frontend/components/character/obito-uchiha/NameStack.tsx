"use client";

import { useRef } from "react";
import Image from "next/image";
import type { ObitoVoice } from "@/lib/characters/obito-uchiha-experience";
import { useMaskVoice } from "./MaskShell";
import { ScarWeb, SpiralMask } from "./ObitoGlyphs";
import styles from "./ObitoExperience.module.css";

/**
 * Ad yığını — sayfanın kalbi.
 *
 * Dört ad üst üste duruyor: dışta maskenin bağırdığı ad, altta kimsenin
 * uzun süre söylemediği ad. Bir katman seçildiğinde üç şey aynı anda olur:
 *
 *   1. Spiral maske o oranda ÇÖZÜLÜR (stroke-dashoffset; merkezden dışa
 *      çizildiği için dış uç geri çekilir) ve altındaki yüz açılır.
 *   2. Üstteki adlar kayıp gider, alttakiler yüzeye çıkar.
 *   3. Sayfanın geri kalanının dili değişir — bölüm başlıkları ve giriş
 *      cümleleri o adın ağzından yeniden yazılmış hâlleriyle görünür.
 *
 * Üçünün de tek kaynağı kökteki `data-voice` niteliği; bu ada JS olarak
 * inen tek şey o niteliği çeviren durum. Metinler sunucuda `pick` ile
 * seçilip düz dize olarak geliyor (BRIEF §5): burada `LocalizedText` yok.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Desen: DİKEY sekme listesi, otomatik etkinleştirme. Gezinme:
 *   ↑ ↓ (← → de kabul) : katman değiştir     Home / End : en dış / en iç
 * Roving tabindex: yalnızca etkin katman tab sırasında; ok tuşu odağı da
 * taşıyor. Sekmelerin kendisi 44 pikselden büyük bloklar, yani ayrıca
 * ileri/geri düğmesi gerekmiyor.
 */

export interface LayerView {
  key: ObitoVoice;
  label: string;
  native: string;
  role: string;
  voice: string;
  note: string;
}

export function NameStack({
  layers,
  faceSrc,
  faceAlt,
  faceUnoptimized,
  maskAlt,
  listLabel,
  layerWord,
  voiceLabel,
  depthLabel,
  keyboardHint,
}: {
  layers: LayerView[];
  faceSrc: string | null;
  faceAlt: string;
  faceUnoptimized: boolean;
  maskAlt: string;
  listLabel: string;
  layerWord: string;
  voiceLabel: string;
  depthLabel: string;
  keyboardHint: string;
}) {
  const { voice, setVoice } = useMaskVoice();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const index = Math.max(
    layers.findIndex((layer) => layer.key === voice),
    0,
  );
  const active = layers[index];
  if (!active) {
    return null;
  }

  /* Katman değişince odak da taşınır — klavye kullanıcısı seçtiği
     sekmenin üstünde kalmalı (roving tabindex şartı). */
  const focusLayer = (next: number) => {
    const clamped = (next + layers.length) % layers.length;
    const target = layers[clamped];
    if (!target) {
      return;
    }
    setVoice(target.key);
    tabRefs.current[clamped]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        focusLayer(index + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        focusLayer(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusLayer(0);
        break;
      case "End":
        event.preventDefault();
        focusLayer(layers.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.stack}>
      <div className={styles.maskWrap}>
        <div className={styles.maskFrame}>
          {/* Maskenin ALTI: yüz. Yuva boşsa bölüm görselsiz ama ayakta
              kalır — spiral bu kez karanlığın üstünde çözülür. */}
          {faceSrc ? (
            <span className={styles.maskFace}>
              <Image
                src={faceSrc}
                alt={faceAlt}
                fill
                sizes="(max-width: 900px) 90vw, 460px"
                unoptimized={faceUnoptimized}
              />
            </span>
          ) : (
            <span className={styles.maskVoid} aria-hidden />
          )}

          <ScarWeb
            className={styles.maskScar}
            lineClassName={styles.scarLine}
          />

          <SpiralMask
            idPrefix="obi-mask"
            className={styles.maskArt}
            coilClassName={styles.maskCoil}
            rimClassName={styles.maskRim}
            eyeClassName={styles.maskEye}
            title={maskAlt}
          />

          {/* Adlar maskenin ÜSTÜNDE duruyor: soyulan şey yüz değil, ad.
              Üsttekiler kayıp gider, alttakiler yüzeye çıkar. */}
          <span className={styles.decals} aria-hidden>
            {layers.map((layer) => (
              <span
                key={layer.key}
                className={styles.decal}
                data-layer={layer.key}
              >
                {layer.label}
              </span>
            ))}
          </span>
        </div>

        <p className={styles.depth}>
          <span className={styles.depthLabel}>{depthLabel}</span>
          <span className={styles.depthTrack} aria-hidden>
            <span className={styles.depthFill} />
          </span>
        </p>
      </div>

      <div className={styles.stackPanel}>
        <div
          className={styles.layers}
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
              id={`obi-layer-${layer.key}`}
              aria-selected={position === index}
              aria-controls="obi-layer-panel"
              tabIndex={position === index ? 0 : -1}
              data-layer={layer.key}
              ref={(node) => {
                tabRefs.current[position] = node;
              }}
              className={styles.layer}
              onClick={() => setVoice(layer.key)}
            >
              <span className={styles.layerDepth} aria-hidden>
                {position + 1}
              </span>
              <span className={styles.layerBody}>
                <span className={styles.layerName}>{layer.label}</span>
                <span className={styles.layerRole}>{layer.role}</span>
              </span>
              <span className={styles.layerNative} aria-hidden>
                {layer.native}
              </span>
              <span className={styles.visuallyHidden}>
                {`${position + 1}. ${layerWord}`}
              </span>
            </button>
          ))}
        </div>

        <div
          id="obi-layer-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`obi-layer-${active.key}`}
          className={styles.layerPanel}
          data-layer={active.key}
        >
          <p className={styles.voiceLabel}>{voiceLabel}</p>
          <p className={styles.voiceLine}>{active.voice}</p>
          <p className={styles.voiceNote}>{active.note}</p>
        </div>

        <p className={styles.stackHint}>{keyboardHint}</p>
      </div>
    </div>
  );
}
