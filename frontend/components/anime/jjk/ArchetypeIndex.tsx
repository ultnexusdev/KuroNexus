"use client";

import { useState, type ReactNode } from "react";
import { Link } from "@/lib/i18n/navigation";
import styles from "./ArchetypesSection.module.css";

/** ARKETİP DİZİNİ — istemci adası. */
export interface ArchetypeView {
  slug: string;
  role: string;
  jp: string;
  name: string;
  tech: string;
  domain: string;
  affiliation: string;
  fight: string;
  arc: string;
  line: string;
  href: string | null;
}

export function ArchetypeIndex({
  archetypes,
  portraits,
  pens,
  labels,
}: {
  archetypes: ArchetypeView[];
  portraits: ReactNode[];
  pens: ReactNode[];
  labels: {
    listAria: string;
    tech: string;
    domain: string;
    affiliation: string;
    fight: string;
    arc: string;
    openFile: string;
  };
}) {
  const [active, setActive] = useState(0);
  const arche = archetypes[active];

  return (
    <div className={styles.split}>
      <div
        className={styles.index}
        role="tablist"
        aria-label={labels.listAria}
        aria-orientation="vertical"
      >
        {archetypes.map((item, i) => (
          <button
            key={item.slug}
            type="button"
            role="tab"
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            className={styles.entry}
            data-on={i === active ? "" : undefined}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                const delta = e.key === "ArrowDown" ? 1 : -1;
                const next = (i + delta + archetypes.length) % archetypes.length;
                setActive(next);
                (
                  e.currentTarget.parentElement?.children[next] as HTMLElement
                )?.focus();
              }
            }}
          >
            <span className={styles.entryJp} lang="ja" aria-hidden="true">
              {item.jp}
            </span>
            <span className={styles.entryBody}>
              <span className={styles.entryRole}>{item.role}</span>
              <span className={styles.entryName}>{item.name}</span>
            </span>
          </button>
        ))}
      </div>

      <article className={styles.dossier}>
        <div className={styles.seat}>
          {portraits.map((node, i) => (
            <span
              key={archetypes[i].slug}
              className={styles.seatFrame}
              data-on={i === active ? "" : undefined}
            >
              {node}
              {pens[i]}
            </span>
          ))}
        </div>

        <div className={styles.text}>
          <p className={styles.role}>{arche.role}</p>
          <h3 className={styles.name}>{arche.name}</h3>
          <dl className={styles.meta}>
            <div>
              <dt>{labels.tech}</dt>
              <dd>{arche.tech}</dd>
            </div>
            <div>
              <dt>{labels.domain}</dt>
              <dd lang={arche.domain === "—" ? undefined : "en"}>{arche.domain}</dd>
            </div>
            <div>
              <dt>{labels.affiliation}</dt>
              <dd>{arche.affiliation}</dd>
            </div>
            <div>
              <dt>{labels.fight}</dt>
              <dd>{arche.fight}</dd>
            </div>
            <div>
              <dt>{labels.arc}</dt>
              <dd>{arche.arc}</dd>
            </div>
          </dl>
          <p className={styles.line}>{arche.line}</p>
          {arche.href ? (
            <Link href={arche.href} className={styles.fileLink}>
              {labels.openFile} →
            </Link>
          ) : null}
        </div>
      </article>
    </div>
  );
}
