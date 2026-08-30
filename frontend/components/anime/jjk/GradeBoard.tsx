"use client";

import { useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import styles from "./GradeWall.module.css";

/**
 * DERECE DUVARI — istemci adası. İki hazır kip arasında geçiş; isimlerin
 * basamak değişimi CSS geçişiyle değil kip değişimiyle olur (liste yapısı
 * değişiyor — FLIP animasyonu buraya bilinçli olarak KONMADI: hareket
 * bölümün tezi değil, fark rozetleri tezin kendisi).
 */
export interface GradePersonView {
  name: string;
  mismatch: boolean;
  note: string | null;
  href: string | null;
}

export interface GradeTierView {
  jp: string;
  name: string;
  people: GradePersonView[];
}

export function GradeBoard({
  official,
  real,
  labels,
}: {
  official: GradeTierView[];
  real: GradeTierView[];
  labels: { switchAria: string; official: string; real: string; records: string };
}) {
  const [mode, setMode] = useState<"official" | "real">("official");
  const tiers = mode === "official" ? official : real;

  return (
    <div>
      <div role="group" aria-label={labels.switchAria} className={styles.switch}>
        <button
          type="button"
          className={styles.mode}
          aria-pressed={mode === "official"}
          data-on={mode === "official" ? "" : undefined}
          onClick={() => setMode("official")}
        >
          {labels.official}
        </button>
        <button
          type="button"
          className={styles.mode}
          aria-pressed={mode === "real"}
          data-on={mode === "real" ? "" : undefined}
          onClick={() => setMode("real")}
        >
          {labels.real}
        </button>
      </div>

      <div className={styles.wall}>
        {tiers.map((tier) => (
          <div key={tier.jp} className={styles.tier}>
            <div className={styles.tierHead}>
              <span className={styles.tierName}>{tier.name}</span>
              <span className={styles.tierJp} lang="ja" aria-hidden="true">
                {tier.jp}
              </span>
              <span className={styles.tierCount}>
                {String(tier.people.length).padStart(2, "0")} {labels.records}
              </span>
            </div>
            <ul className={styles.names}>
              {tier.people.map((person) => (
                <li
                  key={person.name}
                  className={styles.card}
                  data-mismatch={person.mismatch ? "" : undefined}
                >
                  {person.href ? (
                    <Link href={person.href} className={styles.cardName}>
                      {person.name}
                    </Link>
                  ) : (
                    <span className={styles.cardName}>{person.name}</span>
                  )}
                  {person.note ? (
                    <span className={styles.cardNote}>{person.note}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
