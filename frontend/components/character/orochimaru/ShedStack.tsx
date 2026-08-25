"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ShedHusk } from "./OrochimaruGlyphs";
import styles from "./OrochimaruExperience.module.css";

/**
 * Dökülen deriler — sayfanın kalbi.
 *
 * Beş beden ÜST ÜSTE duruyor: aynı kutunun içinde, aynı hizada, en yenisi
 * en üstte. Bir deri seçilince o derinin ÜSTÜNDEKİLER baştan tutturulmuş
 * bir menteşeden geriye devriliyor (yılan derisini baştan çıkarır) ve
 * altta kalan kayıt okunur hâle geliyor. Altta kalanlar yerinde duruyor,
 * yalnızca soluyor: bırakılmış olan hâlâ orada.
 *
 * Bu bir kademe/ray DEĞİL — hiçbir şey yatay ya da dikey bir hat boyunca
 * ilerlemiyor; hareket tamamen Z ekseninde ve menteşede. Etiket listesi
 * yığının kendi sırasını (yeniden eskiye) tekrar ediyor, bir gösterge
 * çubuğu değil.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Desen: tek panelli, dikey tab listesi (otomatik etkinleştirme).
 *   ↑ ↓ ← → : listede gezinme      Home / End : listenin iki ucu
 * Ok tuşu kullanmayan ziyaretçi için iki gerçek düğme var. Roving tabindex:
 * yalnızca etkin etiket tab sırasında. Yığının kendisi tek bir `role="img"`
 * — beş katman ayrı ayrı okunacak bir liste değil, tek bir şema.
 *
 * Metinler sunucuda `pick` ile seçilmiş düz dize olarak iniyor (BRIEF §5):
 * bu ada `LocalizedText` görmüyor.
 */

export interface SkinView {
  key: string;
  ordinal: string;
  name: string;
  held: string;
  shed: string;
  text: string;
  image: string | null;
  witness: { name: string; note: string; portrait: string | null } | null;
}

/** Yığın derinliği ±4 ile sınırlı — CSS'te o kadar kural var. */
function depthAttr(layer: number, selected: number): string {
  const depth = layer - selected;
  return String(Math.min(Math.max(depth, -4), 4));
}

export function ShedStack({
  skins,
  listLabel,
  stackAlt,
  heldLabel,
  shedLabel,
  witnessLabel,
  newestLabel,
  oldestLabel,
  prevLabel,
  nextLabel,
  keyboardHint,
}: {
  /** Sıra ESKİDEN YENİYE — yığın bu sırayla üst üste biniyor */
  skins: SkinView[];
  listLabel: string;
  stackAlt: string;
  heldLabel: string;
  shedLabel: string;
  witnessLabel: string;
  newestLabel: string;
  oldestLabel: string;
  prevLabel: string;
  nextLabel: string;
  keyboardHint: string;
}) {
  const [index, setIndex] = useState(Math.max(skins.length - 1, 0));
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = skins[index];
  if (!active) {
    return null;
  }

  /* Etiketler yığının sırasını tekrar ediyor: en yeni üstte. Veri sırası
     eskiden yeniye olduğu için görüntü sırası ters çevriliyor. */
  const order = skins.map((_, layer) => skins.length - 1 - layer);
  const position = skins.length - 1 - index;

  /* Etiketler arası geçişte odak da taşınır — klavye kullanıcısı seçtiği
     etiketin üstünde kalmalı (roving tabindex şartı). */
  const focusAt = (next: number) => {
    const clamped = (next + order.length) % order.length;
    setIndex(order[clamped] ?? 0);
    tabRefs.current[clamped]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        focusAt(position + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        focusAt(position - 1);
        break;
      case "Home":
        event.preventDefault();
        focusAt(0);
        break;
      case "End":
        event.preventDefault();
        focusAt(order.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.shed}>
      {/* ── Yığın: beş kabuk, aynı kutuda, aynı hizada ─────────────────── */}
      <div className={styles.stackWrap}>
        <div className={styles.stack} role="img" aria-label={stackAlt}>
          {skins.map((skin, layer) => (
            <span
              key={skin.key}
              className={styles.skin}
              data-layer={layer}
              data-depth={depthAttr(layer, index)}
            >
              <ShedHusk
                variant={layer}
                lit={layer === index}
                className={styles.husk}
                outlineClassName={styles.huskOutline}
                splitClassName={styles.huskSplit}
                eyeClassName={styles.huskEyes}
              />
            </span>
          ))}
        </div>
      </div>

      {/* ── Etiketler + kayıt ──────────────────────────────────────────── */}
      <div className={styles.shedPanel}>
        <p className={styles.stackAxis} data-end="new" aria-hidden>
          {newestLabel}
        </p>
        <div
          className={styles.tags}
          role="tablist"
          aria-label={listLabel}
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
        >
          {order.map((layer, slot) => {
            const skin = skins[layer];
            if (!skin) {
              return null;
            }
            return (
              <button
                key={skin.key}
                type="button"
                role="tab"
                id={`oro-skin-tab-${skin.key}`}
                aria-selected={layer === index}
                aria-controls="oro-skin-panel"
                tabIndex={layer === index ? 0 : -1}
                className={styles.tag}
                data-slot={slot}
                ref={(node) => {
                  tabRefs.current[slot] = node;
                }}
                onClick={() => setIndex(layer)}
              >
                <span className={styles.tagOrdinal}>{skin.ordinal}</span>
                <span className={styles.tagName}>{skin.name}</span>
                <span className={styles.tagLeader} aria-hidden />
              </button>
            );
          })}
        </div>
        <p className={styles.stackAxis} data-end="old" aria-hidden>
          {oldestLabel}
        </p>

        <div
          id="oro-skin-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`oro-skin-tab-${active.key}`}
          className={styles.story}
        >
          {active.image ? (
            <span className={styles.storyArt} aria-hidden>
              <Image src={active.image} alt="" fill sizes="720px" />
            </span>
          ) : null}

          <p className={styles.storyOrdinal}>{active.ordinal}</p>
          <h3 className={styles.storyName}>{active.name}</h3>
          <p className={styles.storyText}>{active.text}</p>

          <dl className={styles.storyMeta}>
            <div className={styles.storyMetaRow}>
              <dt>{heldLabel}</dt>
              <dd>{active.held}</dd>
            </div>
            <div className={styles.storyMetaRow} data-kind="shed">
              <dt>{shedLabel}</dt>
              <dd>{active.shed}</dd>
            </div>
          </dl>

          {active.witness ? (
            <figure className={styles.witness}>
              <span className={styles.witnessArt}>
                {active.witness.portrait ? (
                  <Image
                    src={active.witness.portrait}
                    alt=""
                    fill
                    sizes="120px"
                  />
                ) : null}
              </span>
              <figcaption className={styles.witnessBody}>
                <span className={styles.witnessLabel}>{witnessLabel}</span>
                <span className={styles.witnessName}>{active.witness.name}</span>
                <span className={styles.witnessNote}>{active.witness.note}</span>
              </figcaption>
            </figure>
          ) : null}
        </div>

        <div className={styles.shedNav}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => setIndex((value) => Math.min(value + 1, skins.length - 1))}
            disabled={index === skins.length - 1}
          >
            <span aria-hidden>↑</span>
            {prevLabel}
          </button>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => setIndex((value) => Math.max(value - 1, 0))}
            disabled={index === 0}
          >
            <span aria-hidden>↓</span>
            {nextLabel}
          </button>
        </div>
        <p className={styles.shedHint}>{keyboardHint}</p>
      </div>
    </div>
  );
}
