"use client";

import { useState } from "react";
import { CleaverMark, TargetBar } from "./RatioGlyphs";
import styles from "./RatioExperience.module.css";

/**
 * Ölçüm tezgâhı — sayfanın kalbi.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Üç adım ve tek bir cümle:
 *
 *   1. TAHMİN — ziyaretçi zayıf noktanın nerede olduğunu bir kaydırıcıyla
 *      işaretliyor. Bu adımda gerçek nokta GÖRÜNMÜYOR.
 *   2. ÖLÇ    — teknik çalışıyor ve gerçek nokta beliriyor: her zaman
 *      yüzde 70. Tahminle arasındaki sapma sayıyla yazılıyor.
 *   3. İNDİR  — satır çizginin üstüne iniyor ve hedef yediye üç ayrılıyor.
 *
 * Hedef değiştirildiğinde çubuğun boyu değişiyor ama nokta yerinde kalıyor —
 * mekaniğin kanıtlamak istediği tek şey bu. Dolayısıyla "tekrar oyna"
 * anlamlı: dört hedefte de aynı sonuç çıkıyor.
 *
 * Arşivde eşi yok: bir kademe rayı, bir sekme listesi, bir ızgara ya da bir
 * zincir değil — bir TAHMİN-ÖLÇÜM tezgâhı. Ziyaretçi burada bir şey seçmiyor,
 * bir şey biliyormuş gibi davranıp yanılıyor.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Tahmin girdisi gerçek bir `<input type="range">`: ok tuşlarıyla, Home/End
 * ile ve dokunmayla çalışıyor; ekran okuyucu değeri yüzde olarak okuyor
 * (`aria-valuetext`). Hedefler ve düğmeler gerçek `<button>`.
 * Sahne `role="img"` + `aria-label`: o anda ne görüldüğünü METİN söylüyor.
 * Durum satırı `role="status"`.
 *
 * Metin sunucuda seçilmiş düz dize olarak iniyor (BRIEF §5).
 */

/** Tekniğin sabiti. Sayfanın tamamı bu tek sayıyı okuyor. */
const RATIO_POINT = 70;

export interface TargetView {
  key: string;
  kanji: string;
  name: string;
  span: number;
  size: string;
  note: string;
}

type Phase = "idle" | "measured" | "cut";

export function RatioBench({
  targets,
  stageLabel,
  targetLabel,
  guessLabel,
  guessHelp,
  measureButton,
  cutButton,
  resetButton,
  trueLabel,
  errorLabel,
  ratioLabel,
  ratioValue,
  statusIdle,
  statusMeasured,
  statusCut,
  statusExact,
  keyboardHint,
}: {
  targets: TargetView[];
  stageLabel: string;
  targetLabel: string;
  guessLabel: string;
  guessHelp: string;
  measureButton: string;
  cutButton: string;
  resetButton: string;
  trueLabel: string;
  errorLabel: string;
  ratioLabel: string;
  ratioValue: string;
  statusIdle: string;
  statusMeasured: string;
  statusCut: string;
  statusExact: string;
  keyboardHint: string;
}) {
  const [targetKey, setTargetKey] = useState(targets[0]?.key ?? "");
  const [guess, setGuess] = useState(50);
  const [phase, setPhase] = useState<Phase>("idle");

  const target = targets.find((item) => item.key === targetKey) ?? targets[0];
  if (!target) {
    return null;
  }

  const deviation = Math.abs(RATIO_POINT - guess);
  const exact = deviation === 0;

  /* Hedef değişince ölçüm sıfırlanıyor: yeni gövde, yeni ölçüm. Tahmin
     KORUNUYOR — aynı tahminin her hedefte aynı sapmayı verdiğini görmek
     mekaniğin asıl gösterisi. */
  const chooseTarget = (key: string) => {
    setTargetKey(key);
    setPhase("idle");
  };

  const status =
    phase === "cut"
      ? statusCut
      : phase === "measured"
        ? exact
          ? statusExact
          : statusMeasured
        : statusIdle;

  return (
    <div className={styles.bench}>
      {/* ── Hedef seçici ── */}
      <div className={styles.targetBar}>
        <p className={styles.barLabel}>{targetLabel}</p>
        <div className={styles.targetRow}>
          {targets.map((item) => (
            <button
              key={item.key}
              type="button"
              className={styles.targetPick}
              data-active={item.key === target.key ? "true" : undefined}
              aria-pressed={item.key === target.key}
              onClick={() => chooseTarget(item.key)}
            >
              <span className={styles.targetKanji} aria-hidden>
                {item.kanji}
              </span>
              <span className={styles.targetName}>{item.name}</span>
              <span className={styles.targetSize}>{item.size}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Sahne ── */}
      <div
        className={styles.stage}
        role="img"
        aria-label={`${stageLabel}: ${target.name}`}
        data-phase={phase}
      >
        <div className={styles.stageInner} style={{ width: `${target.span}%` }}>
          {/* Gövde — kesildiğinde iki parçaya ayrılıyor */}
          <span className={styles.barBody} aria-hidden>
            <span
              className={styles.barPiece}
              data-piece="major"
              style={{ width: `${RATIO_POINT}%` }}
            >
              <TargetBar
                variant={
                  target.key === "special"
                    ? "special"
                    : target.key === "wall"
                      ? "wall"
                      : target.key === "small"
                        ? "small"
                        : "curse"
                }
                className={styles.barArt}
                bodyClassName={styles.barFill}
                grainClassName={styles.barGrain}
              />
            </span>
            <span
              className={styles.barPiece}
              data-piece="minor"
              style={{ width: `${100 - RATIO_POINT}%` }}
            >
              <TargetBar
                variant={
                  target.key === "special"
                    ? "special"
                    : target.key === "wall"
                      ? "wall"
                      : target.key === "small"
                        ? "small"
                        : "curse"
                }
                className={styles.barArt}
                bodyClassName={styles.barFill}
                grainClassName={styles.barGrain}
              />
            </span>
          </span>

          {/* Tahmin işareti — her zaman görünür */}
          <span
            className={styles.guessMark}
            style={{ left: `${guess}%` }}
            aria-hidden
          >
            <span className={styles.guessFlag}>{guess}%</span>
          </span>

          {/* Gerçek nokta — yalnızca ölçüldükten sonra */}
          <span
            className={styles.trueMark}
            style={{ left: `${RATIO_POINT}%` }}
            aria-hidden
          >
            <span className={styles.trueFlag}>{RATIO_POINT}%</span>
          </span>

          {/* Satır — yalnızca kesildikten sonra çizginin üstüne iniyor */}
          <span
            className={styles.cleaver}
            style={{ left: `${RATIO_POINT}%` }}
            aria-hidden
          >
            <CleaverMark
              className={styles.cleaverArt}
              bladeClassName={styles.cleaverBlade}
              gripClassName={styles.cleaverGrip}
              raised={phase !== "cut"}
            />
          </span>
        </div>
      </div>

      {/* ── Tahmin girdisi ── */}
      <div className={styles.guessBar}>
        <label className={styles.guessLabel} htmlFor="nan-guess">
          {guessLabel}
          <span className={styles.guessValue}>{guess}%</span>
        </label>
        <input
          id="nan-guess"
          className={styles.guessRange}
          type="range"
          min={0}
          max={100}
          step={1}
          value={guess}
          aria-describedby="nan-guess-help"
          aria-valuetext={`${guess}%`}
          onChange={(event) => {
            setGuess(Number(event.target.value));
            setPhase("idle");
          }}
        />
        <p id="nan-guess-help" className={styles.guessHelp}>
          {guessHelp}
        </p>
      </div>

      {/* ── Ölçüm sonucu ── */}
      <dl className={styles.readout} data-open={phase === "idle" ? undefined : "true"}>
        <div className={styles.readoutCell}>
          <dt>{ratioLabel}</dt>
          <dd>{ratioValue}</dd>
        </div>
        <div className={styles.readoutCell}>
          <dt>{trueLabel}</dt>
          <dd>{phase === "idle" ? "—" : `${RATIO_POINT}%`}</dd>
        </div>
        <div className={styles.readoutCell}>
          <dt>{errorLabel}</dt>
          <dd>{phase === "idle" ? "—" : `${deviation}%`}</dd>
        </div>
      </dl>

      {/* ── Kararlar ── */}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.actionMain}
          disabled={phase !== "idle"}
          onClick={() => setPhase("measured")}
        >
          {measureButton}
        </button>
        <button
          type="button"
          className={styles.actionCut}
          disabled={phase !== "measured"}
          onClick={() => setPhase("cut")}
        >
          {cutButton}
        </button>
        <button
          type="button"
          className={styles.actionGhost}
          disabled={phase === "idle"}
          onClick={() => setPhase("idle")}
        >
          {resetButton}
        </button>
      </div>

      <p className={styles.benchStatus} role="status">
        {status}
      </p>

      <p className={styles.targetNote}>{target.note}</p>
      <p className={styles.benchHint}>{keyboardHint}</p>
    </div>
  );
}
