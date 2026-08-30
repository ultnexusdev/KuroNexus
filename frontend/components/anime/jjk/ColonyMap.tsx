"use client";

import { useState, type ReactNode } from "react";
import styles from "./CullingSection.module.css";

/** KOLONİ HARİTASI — istemci adası. */
export interface ColonyView {
  no: string;
  name: string;
  jp: string;
  x: number;
  y: number;
  open: boolean;
  players: string;
  events: string;
  note: string;
}

export function ColonyMap({
  colonies,
  rules,
  backdrop,
  pen,
  labels,
}: {
  colonies: ColonyView[];
  rules: { no: string; text: string }[];
  backdrop: ReactNode;
  pen: ReactNode;
  labels: {
    mapAria: string;
    mapNote: string;
    colony: string;
    players: string;
    events: string;
    rulesTitle: string;
    sealed: string;
  };
}) {
  const [active, setActive] = useState(0);
  const colony = colonies[active];

  return (
    <div className={styles.game}>
      <div className={styles.map} aria-label={labels.mapAria} role="group">
        <span className={styles.mapArt} aria-hidden="true">
          {backdrop}
        </span>
        <span className={styles.mapWeave} aria-hidden="true" />
        {pen}

        <span className={styles.mapNote} aria-hidden="true">
          {labels.mapNote}
          <em className={styles.mapPicked}>
            ▸ {colony.no} {colony.name}
          </em>
        </span>

        {colonies.map((item, i) => (
          <button
            key={item.no}
            type="button"
            className={styles.node}
            data-open={item.open ? "" : undefined}
            data-on={i === active ? "" : undefined}
            aria-pressed={i === active}
            aria-label={`${labels.colony} ${item.no} — ${item.name}`}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            onClick={() => setActive(i)}
          >
            {item.no}
          </button>
        ))}
      </div>

      <div className={styles.desk}>
        <article className={styles.dossier} aria-live="polite">
          <p className={styles.dossierEyebrow}>
            {labels.colony} {colony.no}
            <span lang="ja" className={styles.dossierJp}>
              {colony.jp}
            </span>
          </p>
          <h3 className={styles.dossierName} data-sealed={colony.open ? undefined : ""}>
            {colony.open ? colony.name : labels.sealed}
          </h3>
          <dl className={styles.dossierMeta}>
            <div>
              <dt>{labels.players}</dt>
              <dd>{colony.players}</dd>
            </div>
            <div>
              <dt>{labels.events}</dt>
              <dd>{colony.events}</dd>
            </div>
          </dl>
          <p className={styles.dossierNote}>{colony.note}</p>
        </article>

        <aside className={styles.rules}>
          <p className={styles.rulesTitle}>{labels.rulesTitle}</p>
          <ol className={styles.rulesList}>
            {rules.map((rule) => (
              <li key={rule.no} className={styles.rule}>
                <span className={styles.ruleNo}>{rule.no}</span>
                <span className={styles.ruleText}>{rule.text}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
