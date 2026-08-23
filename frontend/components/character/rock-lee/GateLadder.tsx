"use client";

import Image from "next/image";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { LEE_IMAGE_KEYS } from "@/lib/characters/rock-lee-experience";
import { GateGlyph } from "./LeeMarks";
import styles from "./RockLeeExperience.module.css";

/**
 * Sekiz Kapı merdiveni — sayfanın kalbi.
 *
 * ── DURUM MODELİ: TEK SAYI ───────────────────────────────────────────
 * Kapılar sırayla açılır (kanon: beşinci kapı, birinciden dördüncüye
 * kadarki hepsi açıkken açılabilir). Dolayısıyla bütün durum TEK bir
 * tam sayı: kaç kapı açık (0–8). Bir kapıya dokunmak `open`u onun
 * numarasına çeker; zaten açık bir kapıya dokunmak onu VE üstündekileri
 * kapatır (`index - 1`). Geri alma böylece bedava geliyor.
 *
 * Aynı sayı sayfanın ısısını da sürüyor: `GateShell` onu köke
 * `data-gates` olarak yazıyor, geri kalan her şey CSS.
 *
 * ── GÖRSEL SIRA vs DOM SIRASI ────────────────────────────────────────
 * Merdiven aşağıdan yukarı çıkıyor: birinci kapı en altta, sekizinci en
 * üstte. Bunu `flex-direction: column-reverse` yapıyor; DOM ve klavye
 * sırası 1→8 kalıyor — yani ekran okuyucu ve Tab tuşu merdiveni kendi
 * ANLAMLI sırasında geziyor (WCAG 1.3.2). Her düğme "Basamak n / 8"
 * etiketini görünmez metin olarak taşıyor ki sıra kulakla da belli olsun.
 */

export interface GateRow {
  key: string;
  index: number;
  name: string;
  kanji: string;
  gloss: string;
  site: string;
  limit: string;
  cost: string;
  unlocks?: string;
  fatal?: boolean;
}

export interface GateCopy {
  title: string;
  kanji: string;
  lede: string;
  meterLabel: string;
  openAction: string;
  closeAction: string;
  limitLabel: string;
  costLabel: string;
  unlockLabel: string;
  siteLabel: string;
  rungLabel: string;
  warningTitle: string;
  warningText: string;
}

export function GateLadder({
  rows,
  copy,
  open,
  onOpen,
  characterId,
  eighthImage,
  eighthAlt,
  curatorLabel,
}: {
  rows: GateRow[];
  copy: GateCopy;
  open: number;
  onOpen: (next: number) => void;
  characterId: number;
  eighthImage: string | null;
  eighthAlt: string;
  /** Yalnızca kürator modunda dolu; yoksa yuva hiç çizilmez */
  curatorLabel?: string;
}) {
  return (
    <section
      className={styles.gates}
      aria-labelledby="lee-gates"
      data-open-count={open}
    >
      <header className={styles.gatesHead}>
        <p className={styles.gatesKanji} aria-hidden>
          {copy.kanji}
        </p>
        <h2 id="lee-gates" className={styles.sectionTitle}>
          {copy.title}
        </h2>
        <p className={styles.sectionLede}>{copy.lede}</p>
        <p className={styles.gatesStatus} aria-live="polite">
          <span className={styles.gatesStatusLabel}>{copy.meterLabel}</span>
          <span className={styles.gatesStatusValue}>
            {open} / {rows.length}
          </span>
        </p>
      </header>

      <div className={styles.ladderWrap}>
        {/* Termometre: aşağıdan yukarı dolan sekiz basamak. Salt dekoratif —
            aynı bilgi yukarıdaki canlı bölgede yazıyla var. */}
        <div className={styles.meter} aria-hidden>
          {rows.map((row) => (
            <span
              key={row.key}
              className={styles.rung}
              data-lit={open >= row.index ? "true" : undefined}
              data-fatal={row.fatal ? "true" : undefined}
            />
          ))}
        </div>

        <ol className={styles.ladder}>
          {rows.map((row) => {
            const isOpen = open >= row.index;
            const panelId = `lee-gate-${row.key}`;
            return (
              <li
                key={row.key}
                className={styles.gate}
                data-open={isOpen ? "true" : undefined}
                data-fatal={row.fatal ? "true" : undefined}
              >
                <button
                  type="button"
                  className={styles.gateBtn}
                  aria-expanded={isOpen}
                  aria-controls={isOpen ? panelId : undefined}
                  onClick={() => onOpen(isOpen ? row.index - 1 : row.index)}
                >
                  <span className={styles.gateNo} aria-hidden>
                    {row.index}
                  </span>
                  <span className={styles.visuallyHidden}>
                    {copy.rungLabel} {row.index} / {rows.length}.
                  </span>
                  <GateGlyph className={styles.gateGlyph} />
                  <span className={styles.gateNames}>
                    <span className={styles.gateName}>{row.name}</span>
                    <span className={styles.gateKanji} aria-hidden>
                      {row.kanji}
                    </span>
                    <span className={styles.gateGloss}>{row.gloss}</span>
                  </span>
                  <span className={styles.gateSite}>
                    <span className={styles.gateSiteLabel}>
                      {copy.siteLabel}
                    </span>
                    {row.site}
                  </span>
                  <span className={styles.gateAction}>
                    {isOpen ? copy.closeAction : copy.openAction}
                  </span>
                </button>

                {isOpen ? (
                  <div id={panelId} className={styles.gatePanel}>
                    <div className={styles.gateFact}>
                      <p className={styles.gateFactLabel}>{copy.limitLabel}</p>
                      <p className={styles.gateFactText}>{row.limit}</p>
                    </div>
                    <div className={styles.gateFact} data-kind="cost">
                      <p className={styles.gateFactLabel}>{copy.costLabel}</p>
                      <p className={styles.gateFactText}>{row.cost}</p>
                    </div>
                    {row.unlocks ? (
                      <p className={styles.gateUnlock}>
                        <span className={styles.gateUnlockLabel}>
                          {copy.unlockLabel}
                        </span>
                        {row.unlocks}
                      </p>
                    ) : null}
                    {row.fatal ? (
                      <div className={styles.deathWarn} role="status">
                        <p className={styles.deathWarnTitle}>
                          {copy.warningTitle}
                        </p>
                        <p className={styles.deathWarnText}>
                          {copy.warningText}
                        </p>
                      </div>
                    ) : null}
                    {row.fatal && eighthImage ? (
                      <figure className={styles.deathScene}>
                        <Image
                          src={eighthImage}
                          alt={eighthAlt}
                          fill
                          sizes="(max-width: 980px) 100vw, 900px"
                        />
                      </figure>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>

      {curatorLabel ? (
        <div className={styles.slotRow}>
          <CuratorSlot
            characterId={characterId}
            slot="ABILITY"
            abilityName={LEE_IMAGE_KEYS.gateEighth}
            label={curatorLabel}
          />
        </div>
      ) : null}
    </section>
  );
}
