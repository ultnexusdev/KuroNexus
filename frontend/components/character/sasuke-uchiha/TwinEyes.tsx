"use client";

import type { ReactNode } from "react";
import type { SasukePathKey } from "@/lib/characters/sasuke-uchiha-experience";
import { SasukeEyeDisc } from "./SasukeEyes";
import styles from "./SasukeExperience.module.css";

/**
 * Çift göz diski — sayfanın kalbi.
 *
 * Solda üç tomoe'li Sharingan, sağda halkalı Rinnegan; ikisinin arasından
 * yarık geçiyor. Bir diske basmak o yolu seçer: disk uyanır (tomoe → Ebedi
 * Mangekyō, çıplak halkalar → altı tomoe), yarık kayar ve o yolun paneli
 * açılır. Aynı diske yeniden basmak dengeye döndürür.
 *
 * Durum burada TUTULMUYOR — `RiftShell` tutuyor, çünkü seçim bütün sayfanın
 * paletini çeviriyor. Bu bileşen yalnızca iki düğmeyi ve panel kabuğunu
 * çiziyor; panellerin içeriği sunucuda çizilip ReactNode olarak geliyor.
 */

export interface TwinEyeButton {
  key: SasukePathKey;
  /** 復讐 / 贖罪 — yolun tek kelimesi */
  word: string;
  reading: string;
  label: string;
  /** Düğmenin erişilebilir adı; görünen etiketi içerir (WCAG 2.5.3) */
  eyeLabel: string;
  tagline: string;
}

export interface TwinEyesContent {
  headingId: string;
  title: string;
  lede: string;
  idleHint: string;
  activeHint: string;
  idleBody: string;
  eyes: TwinEyeButton[];
  /** Sunucuda çizilmiş yol panelleri — anahtar sırası `eyes` ile aynı */
  panels: { key: SasukePathKey; node: ReactNode }[];
}

const PANEL_ID = "sasuke-yol-paneli";

export function TwinEyes({
  headingId,
  title,
  lede,
  idleHint,
  activeHint,
  idleBody,
  eyes,
  panels,
  active,
  onSelect,
}: TwinEyesContent & {
  active: SasukePathKey | null;
  onSelect: (key: SasukePathKey) => void;
}) {
  return (
    <section className={styles.paths} aria-labelledby={headingId}>
      <header className={styles.sectionHead} data-align="center">
        <h2 id={headingId} className={styles.sectionTitle}>
          {title}
        </h2>
        <p className={styles.sectionLede}>{lede}</p>
      </header>

      <div className={styles.eyeStage}>
        {eyes.map((eye) => {
          const on = active === eye.key;
          return (
            <button
              key={eye.key}
              type="button"
              className={styles.eyeButton}
              data-wing={eye.key}
              aria-pressed={on}
              aria-label={eye.eyeLabel}
              aria-controls={PANEL_ID}
              onClick={() => onSelect(eye.key)}
            >
              <span className={styles.eyeHalo} aria-hidden />
              <SasukeEyeDisc
                variant={eye.key === "vengeance" ? "sharingan" : "rinnegan"}
                className={styles.eyeDisc}
                baseClassName={styles.eyeBase}
                awakenedClassName={styles.eyeAwakened}
                spinClassName={styles.eyeSpin}
              />
              <span className={styles.eyeWord} aria-hidden>
                {eye.word}
              </span>
              <span className={styles.eyeLabel}>{eye.label}</span>
              <span className={styles.eyeReading} aria-hidden>
                {eye.reading}
              </span>
              <span className={styles.eyeTagline}>{eye.tagline}</span>
            </button>
          );
        })}
      </div>

      <p className={styles.eyeHint}>{active ? activeHint : idleHint}</p>

      <div className={styles.pathPanels} id={PANEL_ID}>
        <p className={styles.pathIdle} hidden={active !== null}>
          {idleBody}
        </p>
        {panels.map((panel) => (
          <div
            key={panel.key}
            className={styles.pathPanel}
            data-wing={panel.key}
            hidden={active !== panel.key}
          >
            {panel.node}
          </div>
        ))}
      </div>
    </section>
  );
}
