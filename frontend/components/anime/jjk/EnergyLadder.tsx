"use client";

import { useId, useState } from "react";
import styles from "./EnergySection.module.css";

/**
 * ENERJİ MERDİVENİ — istemci adası.
 *
 * Sekme deseni (`tablist/tab/tabpanel`): on katman tek panele yazar.
 * Klavye: ok tuşları listede gezdirir (roving tabindex), Enter/Space
 * zaten `button`. Metinler sunucudan dile indirilmiş geliyor.
 */
export interface EnergyLayerView {
  jp: string;
  name: string;
  cost: string;
  who: string;
  body: string;
}

export function EnergyLadder({
  layers,
  labels,
}: {
  layers: EnergyLayerView[];
  labels: { listAria: string; cost: string; who: string; index: string };
}) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const layer = layers[active];

  const move = (delta: number) => {
    const next = (active + delta + layers.length) % layers.length;
    setActive(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  };

  return (
    <div className={styles.ladder}>
      <div
        role="tablist"
        aria-label={labels.listAria}
        aria-orientation="vertical"
        className={styles.list}
      >
        {layers.map((item, i) => (
          <button
            key={item.jp}
            id={`${baseId}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={i === active ? 0 : -1}
            className={styles.rung}
            data-on={i === active ? "" : undefined}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                e.preventDefault();
                move(1);
              } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                e.preventDefault();
                move(-1);
              }
            }}
          >
            <span className={styles.rungJp} lang="ja" aria-hidden="true">
              {item.jp}
            </span>
            <span className={styles.rungName}>{item.name}</span>
          </button>
        ))}
      </div>

      <article
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active}`}
        className={styles.panel}
      >
        <p className={styles.panelIndex}>
          {labels.index} {String(active + 1).padStart(2, "0")} / {String(layers.length).padStart(2, "0")}
        </p>
        <h3 className={styles.panelJp} lang="ja">
          {layer.jp}
        </h3>
        <p className={styles.panelName}>{layer.name}</p>
        <dl className={styles.meta}>
          <div>
            <dt>{labels.cost}</dt>
            <dd>{layer.cost}</dd>
          </div>
          <div>
            <dt>{labels.who}</dt>
            <dd>{layer.who}</dd>
          </div>
        </dl>
        <p className={styles.panelBody}>{layer.body}</p>
      </article>
    </div>
  );
}
