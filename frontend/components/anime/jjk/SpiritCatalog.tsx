"use client";

import { useState, type ReactNode } from "react";
import styles from "./SpiritArchive.module.css";

/**
 * LANET KATALOĞU — istemci adası.
 *
 * `revealed` seti oturuma özel ve BİLİNÇLİ olarak kalıcı değil: arşivi her
 * ziyarette yeniden açmak bölümün ritüeli (kalıcılık yalnızca 20 Parmak'ta,
 * kullanıcı kararı). Dosya bir kez açılınca aynı oturumda kapanmaz.
 *
 * Bar genişlikleri inline style — değerler VERİ (tehdit notu), tasarım
 * kararı değil; renk yine token'dan geliyor.
 */
export interface SpiritView {
  slug: string;
  name: string;
  jp: string;
  cls: string;
  threat: number;
  intel: number;
  energy: number;
  note: string;
}

export function SpiritCatalog({
  spirits,
  portraits,
  pens,
  labels,
}: {
  spirits: SpiritView[];
  portraits: ReactNode[];
  pens: ReactNode[];
  labels: {
    catalogAria: string;
    panelTitle: string;
    unknownName: string;
    unknownCls: string;
    sealedNote: string;
    threat: string;
    intel: string;
    energy: string;
  };
}) {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState<Record<string, true>>({});

  const spirit = spirits[active];
  const open = Boolean(revealed[spirit.slug]);

  const bars: { label: string; value: number }[] = [
    { label: labels.threat, value: spirit.threat },
    { label: labels.intel, value: spirit.intel },
    { label: labels.energy, value: spirit.energy },
  ];

  return (
    <div className={styles.split}>
      <ul className={styles.catalog} aria-label={labels.catalogAria}>
        {spirits.map((item, i) => {
          const on = Boolean(revealed[item.slug]);
          return (
            <li key={item.slug}>
              <button
                type="button"
                className={styles.file}
                data-open={on ? "" : undefined}
                data-on={i === active ? "" : undefined}
                aria-pressed={i === active}
                onClick={() => {
                  setActive(i);
                  setRevealed((prev) =>
                    prev[item.slug] ? prev : { ...prev, [item.slug]: true },
                  );
                }}
              >
                <span className={styles.fileJp} lang={on ? "ja" : undefined} aria-hidden="true">
                  {on ? item.jp : "呪"}
                </span>
                <span className={styles.fileBody}>
                  <span className={styles.fileName}>
                    {on ? item.name : labels.unknownName}
                  </span>
                  <span className={styles.fileCls}>
                    {on ? item.cls : labels.unknownCls}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <aside className={styles.panel} aria-live="polite">
        <p className={styles.panelEyebrow}>{labels.panelTitle}</p>

        <div className={styles.panelHead}>
          <span className={styles.panelJp} lang={open ? "ja" : undefined}>
            {open ? spirit.jp : "呪"}
          </span>
          <span className={styles.panelName}>
            {open ? spirit.name : labels.unknownName}
          </span>
        </div>
        <p className={styles.panelCls}>{open ? spirit.cls : labels.unknownCls}</p>

        {/* Portre koltuğu: yalnızca açık dosyada görünür; kare sunucudan */}
        <div className={styles.seat} data-open={open ? "" : undefined}>
          {portraits.map((node, i) => (
            <span
              key={spirits[i].slug}
              className={styles.seatFrame}
              data-on={i === active ? "" : undefined}
            >
              {node}
              {pens[i]}
            </span>
          ))}
        </div>

        <dl className={styles.bars}>
          {bars.map((bar) => (
            <div key={bar.label} className={styles.barRow}>
              <dt>{bar.label}</dt>
              <dd>
                <span className={styles.track}>
                  <span
                    className={styles.fill}
                    style={{ width: open ? `${bar.value * 10}%` : "0%" }}
                  />
                </span>
                <span className={styles.barVal}>
                  {open ? `${bar.value}/10` : "—"}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <p className={styles.panelNote}>{open ? spirit.note : labels.sealedNote}</p>
      </aside>
    </div>
  );
}
