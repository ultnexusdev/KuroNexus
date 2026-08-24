"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { GrowthTrunk } from "./WoodGlyphs";
import styles from "./YamatoExperience.module.css";

/**
 * Büyüyen yapı — sayfanın kalbi.
 *
 * Beş kademe: tohum → sütunlar → kubbe → ev → orman. Kademe yükseldikçe
 * gövde bir boğum daha uzuyor, dalları çoğalıyor ve o kademenin yapısı
 * gövdenin dibinde beliriyor; geçilen yapı silinmiyor, soluk bir iz olarak
 * kalıyor (birikimli büyüme). Metin sunucuda seçilmiş DÜZ DİZE olarak
 * iniyor (BRIEF §5): bu ada `LocalizedText` görmüyor.
 *
 * ── SEÇİCİ NEDEN GÖVDENİN KENDİSİ ────────────────────────────────────────
 * Kademeler bir sekme şeridine dizilseydi bu sayfa "başka etiketli bir ray"
 * olurdu. Onun yerine düğmeler gövdenin BOĞUMLARI: dikey, aşağıdan yukarıya,
 * ve tam olarak SVG'deki boğum noktalarının üstünde duruyorlar. Bağlantı
 * `WoodGlyphs.TRUNK_NODES` ile CSS'teki `.node[data-node]` yüzdeleri
 * arasında: ikisi de aynı viewBox oranına (120 × 300) bakıyor.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Desen: dikey tab listesi, otomatik etkinleştirme, roving tabindex.
 *   ↑ / → : bir boğum yukarı (sonraki kademe)
 *   ↓ / ← : bir boğum aşağı (önceki kademe)
 *   Home / End : ilk / son kademe
 * Ok yönleri GÖRSEL yöne bağlandı — düğmeler mutlak konumlandırıldığı için
 * "yukarı" tuşu gerçekten yukarıdaki düğmeye gidiyor. DOM sırası ise anlatı
 * sırası (1 → 5), yani ekran okuyucu tohumdan ormana doğru okuyor. Ayrıca
 * iki gerçek düğme var; ok tuşu bilmeyen ya da dokunmatik kullanan ziyaretçi
 * onlarla geziyor.
 */

export interface StageView {
  key: string;
  kanji: string;
  title: string;
  scale: string;
  read: string;
  note: string;
  image: string | null;
}

export function GrowthRail({
  stages,
  listLabel,
  stageWord,
  prevLabel,
  nextLabel,
  scaleLabel,
  keyboardHint,
  treeAlt,
}: {
  stages: StageView[];
  listLabel: string;
  stageWord: string;
  prevLabel: string;
  nextLabel: string;
  scaleLabel: string;
  keyboardHint: string;
  treeAlt: string;
}) {
  const [index, setIndex] = useState(0);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = stages[index];
  if (!active) {
    return null;
  }

  const last = stages.length - 1;

  /* Kademeler arası geçişte odak da taşınır — klavye kullanıcısı seçtiği
     boğumun üstünde kalmalı (roving tabindex şartı). */
  const focusNode = (next: number) => {
    const clamped = Math.min(Math.max(next, 0), last);
    setIndex(clamped);
    nodeRefs.current[clamped]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowRight":
        event.preventDefault();
        focusNode(index + 1);
        break;
      case "ArrowDown":
      case "ArrowLeft":
        event.preventDefault();
        focusNode(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusNode(0);
        break;
      case "End":
        event.preventDefault();
        focusNode(last);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.rail} data-stage={index}>
      <div className={styles.railTrunk}>
        <GrowthTrunk
          stage={index}
          title={treeAlt}
          className={styles.trunkArt}
          groundClassName={styles.ground}
          segmentClassName={styles.trunkSeg}
          branchClassName={styles.branch}
          rootClassName={styles.trunkRoot}
          structureClassName={styles.structure}
        />

        <div
          className={styles.nodes}
          role="tablist"
          aria-orientation="vertical"
          aria-label={listLabel}
          onKeyDown={onKeyDown}
        >
          {stages.map((stage, position) => (
            <button
              key={stage.key}
              type="button"
              role="tab"
              id={`yam-stage-tab-${stage.key}`}
              data-node={position}
              aria-selected={position === index}
              aria-controls="yam-stage-panel"
              tabIndex={position === index ? 0 : -1}
              ref={(node) => {
                nodeRefs.current[position] = node;
              }}
              className={styles.node}
              onClick={() => setIndex(position)}
            >
              <span className={styles.nodeRing} aria-hidden />
              <span className={styles.nodeNumber} aria-hidden>
                {position + 1}
              </span>
              <span className={styles.visuallyHidden}>
                {`${position + 1}. ${stageWord} — ${stage.title}`}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.railPanel}>
        <div
          id="yam-stage-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`yam-stage-tab-${active.key}`}
          className={styles.stagePanel}
        >
          {active.image ? (
            <span className={styles.stageArt} aria-hidden>
              <Image src={active.image} alt="" fill sizes="720px" />
            </span>
          ) : null}

          <p className={styles.stageCount}>
            <span className={styles.stageCountNumber}>{index + 1}</span>
            <span className={styles.stageCountTotal}>{`/ ${stages.length}`}</span>
            <span className={styles.stageCountWord}>{stageWord}</span>
          </p>

          <h3 className={styles.stageTitle}>
            <span className={styles.stageKanji} aria-hidden>
              {active.kanji}
            </span>
            {active.title}
          </h3>

          {/* Tek monospace satır: mimari çizimdeki kot işareti */}
          <p className={styles.stageScale}>
            <span className={styles.stageScaleLabel}>{scaleLabel}</span>
            <span className={styles.stageScaleValue}>{active.scale}</span>
          </p>

          <p className={styles.stageText}>{active.read}</p>
          <p className={styles.stageNote}>{active.note}</p>
        </div>

        <div className={styles.stageNav}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => setIndex((value) => Math.max(value - 1, 0))}
            disabled={index === 0}
          >
            <span aria-hidden>↓</span>
            {prevLabel}
          </button>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => setIndex((value) => Math.min(value + 1, last))}
            disabled={index === last}
          >
            {nextLabel}
            <span aria-hidden>↑</span>
          </button>
        </div>
        <p className={styles.stageHint}>{keyboardHint}</p>
      </div>
    </div>
  );
}
