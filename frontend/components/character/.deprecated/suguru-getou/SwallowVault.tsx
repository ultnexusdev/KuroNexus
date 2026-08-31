"use client";

import { useState } from "react";
import { CurseOrb, VaultShape, VortexMark } from "./CurseGlyphs";
import styles from "./SwallowExperience.module.css";

/**
 * Yutma haznesi — sayfanın kalbi.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Üç kural ve tek bir yön:
 *
 *   1. AL      — karşındaki lanetlerden birine bas; hazneye iner ve
 *                karşıdan KALKAR. Yutulan geri verilmiyor.
 *   2. BİRİK   — haznedeki ağırlık toplanıyor. Sayfa boyunca büyüyen tek
 *                sayı bu; her yutulanın tadı ise değişmiyor.
 *   3. BOŞALT  — hazne yarıyı geçtiğinde girdap açılabiliyor. Açıldığında
 *                haznedeki HER ŞEY tek seferde gidiyor ve seviye sıfıra
 *                iniyor. Karşıdan kalkanlar geri gelmiyor: yıllarca
 *                biriktirilen şey bir hamlede harcanmış oluyor.
 *
 * Yani bu bir seçim listesi değil, tek yönlü bir HAZNE: girdi biriktiriyor,
 * çıkış tek ve toptan. Arşivdeki hiçbir mekanik böyle çalışmıyor — Chōji'nin
 * terazisi iki kefeyi dengeliyor, Neji'nin sayacı ilerliyor, Konohamaru'nun
 * zinciri devrediyor; burada bir kap doluyor ve bir kere boşalıyor.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Karşıdaki her lanet gerçek bir `<button>`; yutulduğunda listeden çıkıyor,
 * yani odak kaybolmasın diye liste kapsayıcısı odaklanabilir bir bölge
 * değil — düğmeler tek tek tab sırasında ve kalanlar yerinde kalıyor.
 * Hazne `role="img"` + `aria-label`: doluluk METİN olarak da söyleniyor
 * (`aria-valuenow` yerine düz metin, çünkü bu bir girdi değil bir gösterge).
 * Durum satırı `role="status"`.
 *
 * Metin sunucuda seçilmiş düz dize olarak iniyor (BRIEF §5).
 */

export interface CurseView {
  key: string;
  kanji: string;
  grade: string;
  weight: number;
  name: string;
  origin: string;
}

type Phase = "idle" | "swallowed" | "spent";

export function SwallowVault({
  curses,
  threshold,
  offerLabel,
  vaultLabel,
  swallowVerb,
  swallowedTag,
  gaugeLabel,
  tasteLabel,
  taste,
  uzumakiButton,
  uzumakiLocked,
  resetButton,
  statusIdle,
  statusSwallowed,
  statusReady,
  statusSpent,
  statusEmptyOffer,
  keyboardHint,
}: {
  curses: CurseView[];
  threshold: number;
  offerLabel: string;
  vaultLabel: string;
  swallowVerb: string;
  swallowedTag: string;
  gaugeLabel: string;
  tasteLabel: string;
  taste: string;
  uzumakiButton: string;
  uzumakiLocked: string;
  resetButton: string;
  statusIdle: string;
  statusSwallowed: string;
  statusReady: string;
  statusSpent: string;
  statusEmptyOffer: string;
  keyboardHint: string;
}) {
  const [held, setHeld] = useState<string[]>([]);
  const [gone, setGone] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");

  const capacity = curses.reduce((sum, curse) => sum + curse.weight, 0);
  const weight = curses
    .filter((curse) => held.includes(curse.key))
    .reduce((sum, curse) => sum + curse.weight, 0);

  /* Karşıda duranlar: ne yutulmuş ne de girdapta harcanmış olanlar. */
  const offered = curses.filter(
    (curse) => !held.includes(curse.key) && !gone.includes(curse.key),
  );
  const inVault = curses.filter((curse) => held.includes(curse.key));

  const ready = weight >= threshold;
  const fill = capacity === 0 ? 0 : Math.round((weight / capacity) * 100);

  const swallow = (key: string) => {
    setHeld((current) => [...current, key]);
    setPhase("swallowed");
  };

  const uzumaki = () => {
    setGone((current) => [...current, ...held]);
    setHeld([]);
    setPhase("spent");
  };

  const reset = () => {
    setHeld([]);
    setGone([]);
    setPhase("idle");
  };

  const status =
    phase === "spent"
      ? statusSpent
      : offered.length === 0 && held.length > 0
        ? statusEmptyOffer
        : ready
          ? statusReady
          : phase === "swallowed"
            ? statusSwallowed
            : statusIdle;

  return (
    <div className={styles.vault}>
      <div className={styles.vaultCols}>
        {/* ── Karşıdakiler ── */}
        <div className={styles.offer}>
          <p className={styles.barLabel}>{offerLabel}</p>
          <ul className={styles.offerList}>
            {offered.map((curse) => (
              <li key={curse.key}>
                <button
                  type="button"
                  className={styles.orb}
                  data-weight={curse.weight}
                  aria-label={`${curse.name} · ${curse.grade} — ${swallowVerb}`}
                  onClick={() => swallow(curse.key)}
                >
                  <span className={styles.orbArt} aria-hidden>
                    <CurseOrb
                      weight={curse.weight}
                      className={styles.orbShape}
                      shellClassName={styles.orbShell}
                      knotClassName={styles.orbKnot}
                    />
                  </span>
                  <span className={styles.orbBody}>
                    <span className={styles.orbKanji} aria-hidden>
                      {curse.kanji}
                    </span>
                    <span className={styles.orbName}>{curse.name}</span>
                    <span className={styles.orbOrigin}>{curse.origin}</span>
                  </span>
                  <span className={styles.orbWeight} aria-hidden>
                    {curse.weight}
                  </span>
                </button>
              </li>
            ))}
            {offered.length === 0 ? (
              <li className={styles.offerEmpty}>{statusEmptyOffer}</li>
            ) : null}
          </ul>
        </div>

        {/* ── Hazne ── */}
        <div className={styles.tank}>
          <p className={styles.barLabel}>{vaultLabel}</p>

          <div
            className={styles.gauge}
            role="img"
            aria-label={`${gaugeLabel}: ${weight} / ${capacity}`}
            data-ready={ready ? "true" : undefined}
            data-spent={phase === "spent" ? "true" : undefined}
          >
            <VaultShape
              className={styles.gaugeShape}
              wallClassName={styles.gaugeWall}
              throatClassName={styles.gaugeThroat}
            />
            {/* Seviye: dipten yükselen dolgu. Yüzde sayfada YAZIYLA da var. */}
            <span
              className={styles.gaugeFill}
              style={{ height: `${fill}%` }}
              aria-hidden
            />
            {/* Girdabın eşiği: kabın üstündeki çizgi */}
            <span
              className={styles.gaugeMark}
              style={{ bottom: `${(threshold / capacity) * 100}%` }}
              aria-hidden
            />
            <span className={styles.gaugeValue} aria-hidden>
              {weight}
              <span className={styles.gaugeTotal}>/{capacity}</span>
            </span>
          </div>

          {/* Haznedekiler — yalnızca kanji sırası; kalabalık burada görünüyor */}
          <ul className={styles.tankList}>
            {inVault.map((curse) => (
              <li key={curse.key} className={styles.tankItem}>
                <span className={styles.tankKanji} aria-hidden>
                  {curse.kanji}
                </span>
                <span className={styles.tankName}>
                  {curse.name}
                  <span className={styles.tankTag}> · {swallowedTag}</span>
                </span>
              </li>
            ))}
          </ul>

          {held.length > 0 ? (
            <p className={styles.taste}>
              <span className={styles.tasteLabel}>{tasteLabel}</span>
              <span className={styles.tasteText}>{taste}</span>
            </p>
          ) : null}
        </div>
      </div>

      {/* ── Tek çıkış ── */}
      <div className={styles.vaultActions}>
        <button
          type="button"
          className={styles.actionVortex}
          disabled={!ready}
          onClick={uzumaki}
        >
          <VortexMark
            className={styles.vortexGlyph}
            armClassName={styles.vortexArm}
            coreClassName={styles.vortexCore}
          />
          <span className={styles.actionVortexLabel} lang="ja">
            {uzumakiButton}
          </span>
        </button>
        <button
          type="button"
          className={styles.actionGhost}
          disabled={held.length === 0 && gone.length === 0}
          onClick={reset}
        >
          {resetButton}
        </button>
      </div>

      {!ready && phase !== "spent" ? (
        <p className={styles.lockNote}>{uzumakiLocked}</p>
      ) : null}

      <p className={styles.vaultStatus} role="status">
        {status}
      </p>

      <p className={styles.vaultHint}>{keyboardHint}</p>
    </div>
  );
}
