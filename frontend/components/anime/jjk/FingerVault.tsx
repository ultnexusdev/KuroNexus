"use client";

import { useEffect, useState } from "react";
import type { FingerStatus } from "@/lib/anime/jjk/fingers";
import styles from "./FingersSection.module.css";

/**
 * PARMAK KASASI — istemci adası, sayfanın tek KALICI durumu.
 *
 * ── localStorage SÖZLEŞMESİ ──────────────────────────────────────────────
 * Anahtar `jjk:fingers:opened`, değer numara dizisi (`[1,4,20]`).
 * Her okuma/yazma try/catch içinde: özel pencere, kapalı depolama ya da
 * bozuk kayıt sayfayı ASLA kırmaz — kasa o ziyarette sıfırdan başlar.
 *
 * SSR uyumu: ilk çizim her zaman "yalnızca 1 numara açık" (sunucuyla aynı
 * kare), depodaki ilerleme `useEffect`te yüklenir. Hidrasyon uyuşmazlığı
 * yok; ilerleme bir kare sonra belirir ve bu kabul edilmiş bedel.
 */
const STORE_KEY = "jjk:fingers:opened";

function readStore(): number[] {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (n): n is number => typeof n === "number" && n >= 1 && n <= 20,
    );
  } catch {
    return [];
  }
}

function writeStore(opened: ReadonlySet<number>) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([...opened].sort((a, b) => a - b)));
  } catch {
    /* depo yoksa ilerleme yalnızca oturumda yaşar — sessizce devam */
  }
}

export interface FingerView {
  n: number;
  title: string;
  place: string;
  holder: string;
  arc: string;
  note: string;
  status: FingerStatus;
  statusLabel: string;
}

export function FingerVault({
  fingers,
  labels,
}: {
  fingers: FingerView[];
  labels: {
    counter: string;
    reset: string;
    gridAria: string;
    place: string;
    holder: string;
    arc: string;
    status: string;
  };
}) {
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState<Set<number>>(() => new Set([1]));

  useEffect(() => {
    const stored = readStore();
    if (stored.length > 0) {
      setOpened(new Set([1, ...stored]));
    }
  }, []);

  const finger = fingers[active];
  const count = opened.size;

  const openFinger = (i: number) => {
    setActive(i);
    const n = fingers[i].n;
    setOpened((prev) => {
      if (prev.has(n)) return prev;
      const next = new Set(prev);
      next.add(n);
      writeStore(next);
      return next;
    });
  };

  const reset = () => {
    const base = new Set([1]);
    setOpened(base);
    setActive(0);
    writeStore(base);
  };

  return (
    <div className={styles.vault}>
      <div className={styles.meter}>
        <span className={styles.meterLabel}>
          {labels.counter} {String(count).padStart(2, "0")} / 20
        </span>
        <span className={styles.meterTrack} aria-hidden="true">
          <span
            className={styles.meterFill}
            style={{ width: `${(count / 20) * 100}%` }}
          />
        </span>
        {count > 1 ? (
          <button type="button" className={styles.reset} onClick={reset}>
            {labels.reset}
          </button>
        ) : null}
      </div>

      <ul className={styles.grid} aria-label={labels.gridAria}>
        {fingers.map((item, i) => {
          const on = opened.has(item.n);
          return (
            <li key={item.n}>
              <button
                type="button"
                className={styles.tile}
                data-open={on ? "" : undefined}
                data-on={i === active ? "" : undefined}
                data-status={item.status}
                aria-pressed={i === active}
                onClick={() => openFinger(i)}
              >
                <span className={styles.tileNo}>
                  {String(item.n).padStart(2, "0")}
                </span>
                <span className={styles.tileJp} lang="ja" aria-hidden="true">
                  指
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <article className={styles.record} aria-live="polite">
        <p className={styles.recordEyebrow}>
          <span className={styles.recordNo}>
            {String(finger.n).padStart(2, "0")}
          </span>
          {finger.title}
        </p>
        <dl className={styles.recordMeta}>
          <div>
            <dt>{labels.place}</dt>
            <dd>{finger.place}</dd>
          </div>
          <div>
            <dt>{labels.holder}</dt>
            <dd>{finger.holder}</dd>
          </div>
          <div>
            <dt>{labels.arc}</dt>
            <dd>{finger.arc}</dd>
          </div>
          <div>
            <dt>{labels.status}</dt>
            <dd data-status={finger.status}>{finger.statusLabel}</dd>
          </div>
        </dl>
        <p className={styles.recordNote}>{finger.note}</p>
      </article>
    </div>
  );
}
