"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { RhombusMark, SealDisc } from "./SakuraGlyphs";
import styles from "./SakuraExperience.module.css";

/**
 * Byakugō dolum ölçeği — sayfanın kalbi.
 *
 * Beş kademeli bir mühür: merdivenden bir kademe seçilince ortadaki disk
 * dolar, mühür büyür ve sayfanın ağırlığı yeşilden pembeye kayar (renk
 * geçişi CSS'te, kök öğedeki `--seal-fill` sayısından türüyor).
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────
 * ARIA sekme deseni: `tablist` + `tab` + `tabpanel`, dolaşan `tabindex`.
 * Ok tuşlarının DÖRDÜ de çalışıyor, çünkü merdiven geniş ekranda dikey,
 * dar ekranda yatay diziliyor — kullanıcının hangi oku deneyeceği
 * ekrana bağlı. Home/End uçlara gider. Etkinleştirme odağı izler
 * (paneller ucuz, ikinci bir Enter istemek gereksiz sürtünme olurdu).
 *
 * Disk tamamen dekoratif (`aria-hidden`): anlattığı her şey merdivende
 * ve panelde metin olarak da var.
 *
 * Metinler sunucuda `pick()` ile seçilip düz dize olarak iniyor;
 * `LocalizedText` istemci sınırını geçmiyor (BRIEF kural 5).
 */

export interface GaugeStageView {
  key: string;
  native: string;
  name: string;
  span: string;
  lede: string;
  text: string;
  gains: string[];
  cost: string;
}

export interface SealGaugeContent {
  title: string;
  lede: string;
  ladderLabel: string;
  readoutLabel: string;
  gainsLabel: string;
  costLabel: string;
  stages: GaugeStageView[];
  /** Kürator yuvası — yalnızca yöneticide dolu gelir */
  slot?: ReactNode;
}

interface SealGaugeProps extends SealGaugeContent {
  stage: number;
  onStage: (index: number) => void;
}

const tabId = (key: string) => `sakura-stage-${key}`;
const panelId = (key: string) => `sakura-panel-${key}`;

export function SealGauge({ stage, onStage, ...content }: SealGaugeProps) {
  const rungs = useRef<Array<HTMLButtonElement | null>>([]);
  const total = content.stages.length;

  /* Odak seçimle birlikte taşınır: klavye kullanıcısı sekmeler arasında
     gezerken paneli de görür, ikinci bir tuşa basmaz. */
  const move = useCallback(
    (next: number) => {
      const index = (next + total) % total;
      onStage(index);
      rungs.current[index]?.focus();
    },
    [onStage, total],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case "ArrowDown":
        case "ArrowRight":
          event.preventDefault();
          move(stage + 1);
          break;
        case "ArrowUp":
        case "ArrowLeft":
          event.preventDefault();
          move(stage - 1);
          break;
        case "Home":
          event.preventDefault();
          move(0);
          break;
        case "End":
          event.preventDefault();
          move(total - 1);
          break;
        default:
          break;
      }
    },
    [move, stage, total],
  );

  const active = content.stages[stage] ?? content.stages[0];

  return (
    <section className={styles.gauge} aria-labelledby="sakura-gauge">
      <header className={styles.sectionHead}>
        <h2 id="sakura-gauge" className={styles.sectionTitle}>
          {content.title}
        </h2>
        <p className={styles.sectionLede}>{content.lede}</p>
      </header>

      <div className={styles.gaugeBody}>
        {/* Tuş dinleyicisi listenin kendisinde: odaktaki düğmenin olayı
            buraya kabarıyor, beş ayrı dinleyici bağlamaya gerek kalmıyor. */}
        <div
          className={styles.ladder}
          role="tablist"
          aria-orientation="vertical"
          aria-label={content.ladderLabel}
          onKeyDown={onKeyDown}
        >
          {content.stages.map((item, index) => (
            <button
              key={item.key}
              type="button"
              id={tabId(item.key)}
              role="tab"
              className={styles.rung}
              aria-selected={index === stage}
              aria-controls={panelId(item.key)}
              tabIndex={index === stage ? 0 : -1}
              data-state={
                index < stage ? "done" : index === stage ? "current" : "ahead"
              }
              ref={(node) => {
                rungs.current[index] = node;
              }}
              onClick={() => onStage(index)}
            >
              <RhombusMark className={styles.rungMark} />
              <span className={styles.rungText}>
                <span className={styles.rungNative} lang="ja">
                  {item.native}
                </span>
                <span className={styles.rungName}>{item.name}</span>
              </span>
            </button>
          ))}
        </div>

        <div className={styles.discWrap}>
          <SealDisc stage={stage} className={styles.disc} />
          <p className={styles.readout}>
            <span className={styles.readoutLabel}>{content.readoutLabel}</span>
            <span className={styles.readoutValue}>
              {stage + 1}
              <span className={styles.readoutSlash} aria-hidden>
                /
              </span>
              <span className={styles.readoutTotal}>{total}</span>
            </span>
          </p>
        </div>

        {content.stages.map((item, index) => (
          <div
            key={item.key}
            id={panelId(item.key)}
            role="tabpanel"
            aria-labelledby={tabId(item.key)}
            tabIndex={0}
            hidden={index !== stage}
            className={styles.panel}
          >
            <p className={styles.panelNative} lang="ja">
              {item.native}
            </p>
            <h3 className={styles.panelName}>{item.name}</h3>
            <p className={styles.panelSpan}>{item.span}</p>
            <p className={styles.panelLede}>{item.lede}</p>
            <p className={styles.panelText}>{item.text}</p>
            <h4 className={styles.panelSubtitle}>{content.gainsLabel}</h4>
            <ul className={styles.gainList}>
              {item.gains.map((gain) => (
                <li key={gain} className={styles.gain}>
                  <RhombusMark className={styles.gainMark} />
                  <span>{gain}</span>
                </li>
              ))}
            </ul>
            <p className={styles.cost}>
              <span className={styles.costLabel}>{content.costLabel}</span>
              {item.cost}
            </p>
          </div>
        ))}
      </div>

      {/* Ekran okuyucuya durum: disk sessiz, bu satır konuşur */}
      <p className={styles.visuallyHidden} aria-live="polite">
        {`${content.readoutLabel}: ${stage + 1} / ${total} — ${active.name}`}
      </p>

      {content.slot}
    </section>
  );
}
