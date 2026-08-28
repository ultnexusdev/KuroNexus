"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import type { TeamId } from "@/lib/anime/slam-dunk/types";
import styles from "./MatchupSelector.module.css";

export interface MatchupTab {
  id: TeamId;
  /** Takım adı — ÇEVRİLMEZ */
  name: string;
  /** Kanji — ÇEVRİLMEZ */
  kanji: string;
  /** Sekmenin altındaki tek satır: sıralama */
  meta: string;
}

/**
 * RAKİP SEÇİCİ — devre arasının interaktif paneli.
 *
 * ── DÖRT PANEL SUNUCUDA ÇİZİLİYOR ────────────────────────────────────────
 * Panellerin içi (kadro kartları, küratör yuvaları, stat barları) SUNUCU
 * bileşeni ve buraya `panels` propuyla hazır JSX olarak geliyor. Bu ada
 * onların ne olduğunu bilmiyor; tek işi hangisinin görüneceğine karar
 * vermek.
 *
 * ⚠️ Sunucu bileşeni bir istemci bileşenine IMPORT EDİLEMEZ — Bleach'te bir
 * kez yaşanmış tuzak. Çözüm her seferinde aynı: prop olarak geçir.
 *
 * ── NEDEN HEPSİ DOM'DA ───────────────────────────────────────────────────
 * Seçilmeyen paneller `hidden` ile duruyor, sökülmüyor. Üç sebep:
 *   1. Sekme değiştirmek ağ isteği ya da yeniden çizim istemiyor — anında.
 *   2. Küratör dört takımın yuvalarını da tek sayfa yüklemesinde görüyor.
 *   3. Sayfa kaynağında dört kadro da yazılı: arama motoru ve JS'siz
 *      ziyaretçi hepsini okuyor.
 * Bedeli DOM boyutu ve ölçüldü: dört panel toplam otuz kart, kabul edilir.
 *
 * ── ⚠️ JS GELMEZSE ───────────────────────────────────────────────────────
 * `hidden` ilk çizimde YALNIZCA sunucunun seçtiği panelin dışındakilere
 * basılıyor. JS hiç gelmezse ziyaretçi ilk rakibi görüyor ve sekmeler
 * çalışmıyor — sayfa boş kalmıyor. Bunun yerine "hepsi açık" da olabilirdi
 * ama o zaman JS gelen ziyaretçi bir an dört panelin tamamını görürdü.
 *
 * ── KLAVYE ───────────────────────────────────────────────────────────────
 * WAI-ARIA sekme deseni: sağ/sol ok sekmeler arasında dolaşıyor, Home/End
 * uçlara gidiyor ve yalnızca seçili sekme `tabindex="0"` — sekme tuşu dört
 * düğmede tek tek durmuyor.
 */
export function MatchupSelector({
  tabs,
  panels,
}: {
  tabs: MatchupTab[];
  /** `tabs` ile AYNI SIRADA. Sunucuda çizilmiş panel gövdeleri. */
  panels: ReactNode[];
}) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function focusTab(index: number) {
    const next = (index + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className={styles.selector}>
      <div
        role="tablist"
        aria-orientation="horizontal"
        className={styles.tabs}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${tab.id}`}
            aria-selected={index === active}
            aria-controls={`${baseId}-panel-${tab.id}`}
            tabIndex={index === active ? 0 : -1}
            className={styles.tab}
            data-team={tab.id}
            data-active={index === active ? "" : undefined}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                focusTab(index + 1);
              } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                focusTab(index - 1);
              } else if (event.key === "Home") {
                event.preventDefault();
                focusTab(0);
              } else if (event.key === "End") {
                event.preventDefault();
                focusTab(tabs.length - 1);
              }
            }}
          >
            <span className={styles.tabName}>{tab.name}</span>
            <span className={styles.tabKanji} lang="ja">
              {tab.kanji}
            </span>
            <span className={styles.tabMeta}>{tab.meta}</span>
            <span className={styles.tabGlow} aria-hidden />
          </button>
        ))}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={index !== active}
          tabIndex={0}
          className={styles.panel}
          data-team={tab.id}
        >
          {panels[index]}
        </div>
      ))}
    </div>
  );
}
