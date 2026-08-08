"use client";

import { useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import type { FootballSquadPlayer } from "@/lib/api/types";
import styles from "./GsHall.module.css";
import { sportHref } from "@/lib/sport/routes";

const PREVIEW_COUNT = 5;

/**
 * Kadro ızgarası — varsayılan olarak ilk 5 oyuncuyu gösterir, "Tümünü göster"
 * ile tam kadroya açılır. Kartlar kompakt; dar ekranda da satır başına birden
 * fazla kart sığar (grid `minmax` değeri küçük tutuldu).
 */
export function SquadGrid({
  players,
  labels,
}: {
  players: FootballSquadPlayer[];
  labels: { showAll: string; showLess: string; viewProfile: string };
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? players : players.slice(0, PREVIEW_COUNT);
  const hasMore = players.length > PREVIEW_COUNT;

  return (
    <>
      <ul className={styles.squad}>
        {visible.map((p) => (
          <li key={p.id}>
            <Link href={sportHref.player(p.id)} className={styles.playerCard}>
              {p.photo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={p.photo}
                  alt=""
                  loading="lazy"
                  className={styles.playerPhoto}
                />
              ) : null}
              <span className={styles.shirtNo} aria-hidden>
                {p.number ?? "–"}
              </span>
              <span className={styles.playerMeta}>
                <span className={styles.playerName}>{p.name}</span>
                <span className={styles.playerPos}>
                  {p.position ?? ""}
                  {p.age ? ` · ${p.age}` : ""}
                </span>
              </span>
              <span className={styles.drawer}>
                <span className={styles.profileCue}>{labels.viewProfile} →</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {hasMore ? (
        <button
          type="button"
          className={styles.showAll}
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded
            ? labels.showLess
            : `${labels.showAll} (${players.length})`}
        </button>
      ) : null}
    </>
  );
}
