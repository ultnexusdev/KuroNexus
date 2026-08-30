"use client";

import { useState } from "react";
import type { ShibuyaActorKey, StopPositions } from "@/lib/anime/jjk/shibuya";
import styles from "./ShibuyaSection.module.css";

/**
 * OPERASYON ODASI — istemci adası.
 *
 * Saat, harita ve kayıt kartı TEK duruma bağlı. İğne hareketi CSS
 * `left/top` geçişi (1s, harita boyutuna göre yüzde) — azaltılmış
 * harekette anında atlar. İğnenin sahneden düşmesi geçişli değil:
 * "listeden düşmek" ani olmalı, kaybolma bir kayıt olayı.
 *
 * İğne rengi `--actor-*` token'ından (globals.css) — burada renk yok.
 * Aktör başına küçük bir sapma (offset) iğnelerin üst üste binmesini
 * engelliyor; değerler mockup'tan.
 */
export interface ShibuyaStopView {
  t: string;
  st: string;
  place: string;
  title: string;
  body: string;
  who: string;
}

const OFF_X = [-3.2, 3.4, 0, 4.6, -4.6];
const OFF_Y = [-4.5, 4.2, 5.4, -4.8, 4.6];

export function ShibuyaOps({
  stops,
  stations,
  actors,
  positions,
  labels,
}: {
  stops: ShibuyaStopView[];
  stations: { name: string; x: number; y: number }[];
  actors: { key: ShibuyaActorKey; name: string }[];
  positions: StopPositions[];
  labels: {
    lineAria: string;
    mapAria: string;
    legendAria: string;
    prev: string;
    next: string;
    stop: string;
    place: string;
    who: string;
  };
}) {
  const [active, setActive] = useState(0);
  const stop = stops[active];
  const frame = positions[active] ?? ({} as StopPositions);

  return (
    <div className={styles.ops}>
      {/* ── ZAMAN HATTI ─────────────────────────────────────────────── */}
      <div className={styles.line} role="tablist" aria-label={labels.lineAria}>
        <span className={styles.wire} aria-hidden="true" />
        {stops.map((item, i) => (
          <button
            key={item.t}
            type="button"
            role="tab"
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            className={styles.stopBtn}
            data-on={i === active ? "" : undefined}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                const delta = e.key === "ArrowRight" ? 1 : -1;
                const next = (active + delta + stops.length) % stops.length;
                setActive(next);
                (
                  e.currentTarget.parentElement?.querySelectorAll("button")[
                    next
                  ] as HTMLElement
                )?.focus();
              }
            }}
          >
            <span className={styles.stopTime}>{item.t}</span>
            <span className={styles.stopDot} aria-hidden="true" />
            <span className={styles.stopName}>{item.st}</span>
          </button>
        ))}
      </div>

      <div className={styles.floor}>
        {/* ── HARİTA ────────────────────────────────────────────────── */}
        <div className={styles.map} role="img" aria-label={labels.mapAria}>
          <span className={styles.grid} aria-hidden="true" />
          <span className={styles.ring} aria-hidden="true" />

          {stations.map((station) => (
            <span
              key={station.name}
              className={styles.station}
              style={{ left: `${station.x}%`, top: `${station.y}%` }}
              aria-hidden="true"
            >
              <i className={styles.stationDot} />
              <em className={styles.stationName}>{station.name}</em>
            </span>
          ))}

          {actors.map((actor, i) => {
            const at = frame[actor.key];
            if (!at) return null;
            return (
              <span
                key={actor.key}
                className={styles.pin}
                data-actor={actor.key}
                style={{
                  left: `${at[0] + OFF_X[i]}%`,
                  top: `${at[1] + OFF_Y[i]}%`,
                }}
                aria-hidden="true"
              />
            );
          })}
        </div>

        {/* ── KAYIT KARTI ───────────────────────────────────────────── */}
        <article className={styles.card} aria-live="polite">
          <p className={styles.cardEyebrow}>
            {labels.stop} {String(active + 1).padStart(2, "0")} / {String(stops.length).padStart(2, "0")}
            <span className={styles.cardTime}>{stop.t}</span>
          </p>
          <h3 className={styles.cardTitle}>{stop.title}</h3>
          <p className={styles.cardBody}>{stop.body}</p>
          <dl className={styles.cardMeta}>
            <div>
              <dt>{labels.place}</dt>
              <dd>{stop.place}</dd>
            </div>
            <div>
              <dt>{labels.who}</dt>
              <dd>{stop.who}</dd>
            </div>
          </dl>

          <div className={styles.nav}>
            <button
              type="button"
              className={styles.step}
              disabled={active === 0}
              onClick={() => setActive((v) => Math.max(0, v - 1))}
            >
              ← {labels.prev}
            </button>
            <button
              type="button"
              className={styles.step}
              disabled={active === stops.length - 1}
              onClick={() => setActive((v) => Math.min(stops.length - 1, v + 1))}
            >
              {labels.next} →
            </button>
          </div>

          <ul className={styles.legend} aria-label={labels.legendAria}>
            {actors.map((actor) => {
              const here = Boolean(frame[actor.key]);
              return (
                <li
                  key={actor.key}
                  className={styles.legendRow}
                  data-here={here ? "" : undefined}
                  data-actor={actor.key}
                >
                  <i className={styles.legendDot} aria-hidden="true" />
                  {actor.name}
                </li>
              );
            })}
          </ul>
        </article>
      </div>
    </div>
  );
}
