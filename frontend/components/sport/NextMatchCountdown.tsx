"use client";

import { useEffect, useState } from "react";
import type { NextMatch } from "@/lib/api/types";
import styles from "./WidgetRail.module.css";

function parts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

/**
 * Sonraki maça geri sayım. Sunucu/istemci saati farkından doğan hydration
 * uyumsuzluğunu önlemek için ilk render'da boş durur, sayaç mount'tan sonra
 * başlar (kickoff sabit ISO tarih, hesap istemcide yapılır).
 */
export function NextMatchCountdown({
  match,
  labels,
}: {
  match: NextMatch;
  labels: { days: string; hours: string; minutes: string; seconds: string };
}) {
  const kickoff = new Date(match.date).getTime();
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(kickoff - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [kickoff]);

  if (left === null) {
    return <div className={styles.countdown} aria-hidden />;
  }

  const { d, h, m, s } = parts(left);
  const cells: Array<[number, string]> = [
    [d, labels.days],
    [h, labels.hours],
    [m, labels.minutes],
    [s, labels.seconds],
  ];

  return (
    <div className={styles.countdown}>
      {cells.map(([value, label]) => (
        <span key={label} className={styles.cdCell}>
          <b className={styles.cdValue}>{String(value).padStart(2, "0")}</b>
          <span className={styles.cdLabel}>{label}</span>
        </span>
      ))}
    </div>
  );
}
