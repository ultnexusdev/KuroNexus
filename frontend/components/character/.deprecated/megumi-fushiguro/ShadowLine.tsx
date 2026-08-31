"use client";

import { useState } from "react";
import type { MegumiFigure, MegumiShadowState } from "./data";
import { BreakMark, ShikigamiSilhouette } from "./ShadowFigures";
import styles from "./TenShadowsExperience.module.css";

/**
 * On gölge — sayfanın kalbi.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Sayfada tek bir ZEMİN ÇİZGİSİ var ve on gölgenin hepsi onun altında
 * yatıyor. Seçilen gölge çizgiden doğruluyor. Mekaniği ayıran şey, seçimin
 * SONUCUNUN kayda göre değişmesi:
 *
 *   terbiye edilmiş → doğrulur
 *   kırılmış        → ASLA doğrulmaz; çizgi kıpırdar ve orada kalır
 *   terbiye edilmemiş → önce ritüel okunmalı; okununca doğrulur
 *
 * Yani liste homojen değil: aynı hareket üç ayrı cevap veriyor ve biri
 * kategorik olarak reddediyor. Bir raydaki kademe, bir ızgaradaki hücre ya
 * da bir zincirdeki halka değil — ortak bir çizgiden kalkan figürler, ve
 * içlerinden biri bir daha kalkmıyor.
 *
 * Ritüel bir kez okunduğunda geri alınmıyor (`ritualRead` sıfırlanmıyor):
 * tekniğin kendi kuralı da bu.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Liste gerçek `<button>` satırlarından oluşuyor ve hepsi tab sırasında —
 * öğrenilecek ek bir tuş sözleşmesi yok. Seçili satır `aria-current`
 * taşıyor. Durum satırı `role="status"`: doğrulma, reddedilme ve ritüel
 * ayrı ayrı SÖYLENİYOR, yalnızca çizilmiyor. Kayıt durumu (terbiye edilmiş /
 * kırılmış / terbiye edilmemiş) her satırda METİN olarak yazılı; renk ve
 * çentik ikinci göstergeler.
 *
 * Metin sunucuda seçilmiş düz dize olarak iniyor (BRIEF §5).
 */

export interface ShadowView {
  key: string;
  kanji: string;
  name: string;
  reading: string;
  turkish: string;
  figure: MegumiFigure;
  state: MegumiShadowState;
  stateLabel: string;
  role: string;
  text: string;
  ritualWarning: string | null;
}

export function ShadowLine({
  shadows,
  listLabel,
  stageLabel,
  ritualButton,
  ritualWord,
  ritualWordNote,
  countLabel,
  countBrokenLabel,
  statusRisen,
  statusBroken,
  statusUntamed,
  statusRitual,
  keyboardHint,
}: {
  shadows: ShadowView[];
  listLabel: string;
  stageLabel: string;
  ritualButton: string;
  ritualWord: string;
  ritualWordNote: string;
  countLabel: string;
  countBrokenLabel: string;
  statusRisen: string;
  statusBroken: string;
  statusUntamed: string;
  statusRitual: string;
  keyboardHint: string;
}) {
  const first = shadows.find((shadow) => shadow.state === "tamed") ?? shadows[0];
  const [selectedKey, setSelectedKey] = useState(first?.key ?? "");
  const [ritualRead, setRitualRead] = useState(false);
  const [justRead, setJustRead] = useState(false);

  const active = shadows.find((shadow) => shadow.key === selectedKey) ?? first;
  if (!active) {
    return null;
  }

  const risen =
    active.state === "tamed" || (active.state === "untamed" && ritualRead);

  const status = justRead
    ? statusRitual
    : active.state === "broken"
      ? statusBroken
      : active.state === "untamed" && !ritualRead
        ? statusUntamed
        : statusRisen;

  const brokenCount = shadows.filter((shadow) => shadow.state === "broken").length;
  const callable =
    shadows.filter((shadow) => shadow.state === "tamed").length +
    (ritualRead ? shadows.filter((shadow) => shadow.state === "untamed").length : 0);

  const select = (key: string) => {
    setJustRead(false);
    setSelectedKey(key);
  };

  return (
    <div className={styles.shadowBoard}>
      {/* ── Sahne: zemin çizgisi ve ondan doğrulan figür ── */}
      <div
        className={styles.stage}
        role="img"
        aria-label={`${stageLabel} — ${active.name}`}
        data-state={active.state}
        data-risen={risen ? "true" : "false"}
      >
        <span className={styles.stageFigure} aria-hidden>
          <ShikigamiSilhouette
            variant={active.figure}
            className={styles.stageFigureArt}
            bodyClassName={styles.stageFigureBody}
          />
        </span>

        {/* Çizgi: sayfanın taşıyıcı fikri. Kırık kayıt seçilince kıpırdıyor
            ama üstünde hiçbir şey kalmıyor. */}
        <span className={styles.stageLine} aria-hidden />
        <span className={styles.stagePool} aria-hidden />

        <span className={styles.stageKanji} aria-hidden>
          {active.kanji}
        </span>
      </div>

      {/* ── Sayaç: on gölgenin kaçı hâlâ çağrılabilir ── */}
      <p className={styles.countBar}>
        <span className={styles.countLabel}>{countLabel}</span>
        <span className={styles.countValue}>
          {callable}
          <span className={styles.countTotal}> / {shadows.length}</span>
        </span>
        <span className={styles.countBroken}>
          <BreakMark
            className={styles.countBrokenMark}
            lineClassName={styles.countBrokenLine}
          />
          {brokenCount} {countBrokenLabel}
        </span>
      </p>

      <div className={styles.shadowCols}>
        {/* ── Liste ── */}
        <ul className={styles.shadowList} aria-label={listLabel}>
          {shadows.map((shadow) => {
            const rowRisen =
              shadow.state === "tamed" ||
              (shadow.state === "untamed" && ritualRead);
            return (
              <li key={shadow.key}>
                <button
                  type="button"
                  className={styles.shadowRow}
                  data-state={shadow.state}
                  data-active={shadow.key === active.key ? "true" : undefined}
                  aria-current={shadow.key === active.key ? "true" : undefined}
                  onClick={() => select(shadow.key)}
                >
                  <span className={styles.rowMark} aria-hidden>
                    {shadow.state === "broken" ? (
                      <BreakMark
                        className={styles.rowBreak}
                        lineClassName={styles.rowBreakLine}
                      />
                    ) : (
                      <ShikigamiSilhouette
                        variant={shadow.figure}
                        className={styles.rowFigure}
                        bodyClassName={styles.rowFigureBody}
                      />
                    )}
                  </span>
                  <span className={styles.rowBody}>
                    <span className={styles.rowKanji} aria-hidden>
                      {shadow.kanji}
                    </span>
                    <span className={styles.rowName}>{shadow.turkish}</span>
                    <span className={styles.rowRole}>{shadow.role}</span>
                  </span>
                  <span className={styles.rowState} data-risen={rowRisen ? "true" : undefined}>
                    {shadow.stateLabel}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* ── Seçili kaydın panosu ── */}
        <div className={styles.shadowPanel}>
          <p className={styles.panelState} data-state={active.state}>
            {active.stateLabel}
          </p>
          <h3 className={styles.panelName}>
            <span className={styles.panelKanji} aria-hidden>
              {active.kanji}
            </span>
            {active.name}
          </h3>
          <p className={styles.panelReading} aria-hidden>
            {active.reading}
          </p>
          <p className={styles.panelTurkish}>{active.turkish}</p>
          <p className={styles.panelText}>{active.text}</p>

          {active.state === "untamed" ? (
            <div className={styles.ritual}>
              {active.ritualWarning ? (
                <p className={styles.ritualWarning}>{active.ritualWarning}</p>
              ) : null}
              {ritualRead ? (
                <p className={styles.ritualWord} lang="ja">
                  {ritualWord}
                  <span className={styles.ritualWordNote}>{ritualWordNote}</span>
                </p>
              ) : (
                <button
                  type="button"
                  className={styles.ritualButton}
                  onClick={() => {
                    setRitualRead(true);
                    setJustRead(true);
                  }}
                >
                  {ritualButton}
                </button>
              )}
            </div>
          ) : null}

          <p className={styles.panelStatus} role="status">
            {status}
          </p>
        </div>
      </div>

      <p className={styles.shadowHint}>{keyboardHint}</p>
    </div>
  );
}
