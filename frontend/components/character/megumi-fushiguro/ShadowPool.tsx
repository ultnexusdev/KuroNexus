"use client";

import type { MegumiSigil } from "@/lib/characters/megumi-fushiguro-experience";
import { BeastSigil, ShadowEdge, WheelMark } from "./MegumiGlyphs";
import styles from "./ShadowMenagerieExperience.module.css";

/**
 * Gölge havuzunun ÇİZİM tarafı — istemci adası 2/2.
 *
 * Durum burada DEĞİL: `DomainShell` tutuyor, çünkü çağrılan şikigami
 * bölümlerin ARASINA yerleşiyor ve o yerleşimi ancak sayfanın düzenini
 * kuran bileşen yapabilir. Buradaki üç bileşen yalnızca prop çiziyor.
 *
 * Metinlerin hepsi ÇEVRİLMİŞ olarak geliyor (`pick(...)` sunucuda koştu) —
 * istemci adasına `LocalizedText` inmiyor (Faz 2 §1).
 */

export interface PoolBeastUI {
  key: string;
  kanji: string;
  name: string;
  reading: string;
  turkish: string;
  sigil: MegumiSigil;
  state: "callable" | "scar" | "locked";
  cost: number;
  role: string;
  text: string;
  onField: string;
  note?: string;
}

export interface PoolLabels {
  gaugeTitle: string;
  gaugeNative: string;
  remainingLabel: string;
  usableLabel: string;
  scarLabel: string;
  fieldLabel: string;
  unitLabel: string;
  costLabel: string;
  summon: string;
  returnOne: string;
  returnAll: string;
  insufficient: string;
  brokenBadge: string;
  lockedBadge: string;
  outBadge: string;
  readyBadge: string;
  emptyField: string;
  lockHint: string;
  unlockedHint: string;
  ritualButton: string;
  ritualDone: string;
  ritualWord: string;
  ritualWordNote: string;
  afterRitual: string;
  keyboardHint: string;
  deviceNote: string;
  bandLabel: string;
}

/* ══ Liste — on satır, her biri tek düğme ═════════════════════════════════ */

export function ShadowRoster({
  beasts,
  labels,
  out,
  remaining,
  unlocked,
  ritualRead,
  lockProgress,
  onToggle,
  onRitual,
}: {
  beasts: PoolBeastUI[];
  labels: PoolLabels;
  /** Sahadaki şikigami anahtarları, çağrılma sırasıyla */
  out: string[];
  remaining: number;
  unlocked: boolean;
  ritualRead: boolean;
  /** "Çağrılan: 5/8 · havuzda kalan: 3" — kilidin sayaç karşılığı */
  lockProgress: string;
  onToggle: (key: string) => void;
  onRitual: () => void;
}) {
  return (
    <>
      <ul className={styles.roster}>
        {beasts.map((beast) => {
          const isOut = out.includes(beast.key);
          const short = !isOut && beast.cost > remaining;

          /* ── Kırık satır: düğme var ama hiç etkin olmuyor ────────────────
             Bir <span> değil <button disabled>, çünkü listedeki diğer
             satırlarla aynı okuma sırasını taşıması gerekiyor; ekran
             okuyucu "devre dışı düğme" diyor ve sebebini rozet söylüyor. */
          if (beast.state === "scar") {
            return (
              <li key={beast.key} className={styles.beast} data-kind="scar">
                <BeastHead beast={beast} labels={labels} badge={labels.brokenBadge} />
                <p className={styles.beastText}>{beast.text}</p>
                {beast.note ? (
                  <p className={styles.beastNote}>{beast.note}</p>
                ) : null}
                <button
                  type="button"
                  className={styles.beastButton}
                  disabled
                  data-tone="scar"
                >
                  {labels.brokenBadge}
                </button>
              </li>
            );
          }

          /* ── Mahoraga: kilitli → açık → okunmuş ──────────────────────────
             Okunduktan SONRA da <button> kalıyor ve odaklanabilir olmaya
             devam ediyor. Sebebi tek: ritüeli okuyan tıklama tam olarak bu
             düğmenin üstünde oluyor; onu DOM'dan kaldırmak ya da `disabled`
             yapmak odağı gövdeye düşürürdü (erişilebilirlik şartı). */
          if (beast.state === "locked") {
            return (
              <li
                key={beast.key}
                className={styles.beast}
                data-kind="locked"
                data-open={unlocked || ritualRead ? "true" : "false"}
              >
                <BeastHead
                  beast={beast}
                  labels={labels}
                  badge={
                    ritualRead
                      ? labels.outBadge
                      : unlocked
                        ? labels.readyBadge
                        : labels.lockedBadge
                  }
                />
                <p className={styles.beastText}>{beast.text}</p>
                {beast.note ? (
                  <p className={styles.beastNote}>{beast.note}</p>
                ) : null}

                <p className={styles.beastLock}>
                  {ritualRead
                    ? labels.afterRitual
                    : unlocked
                      ? labels.unlockedHint
                      : labels.lockHint}
                </p>
                {ritualRead ? null : (
                  <p className={styles.beastProgress}>{lockProgress}</p>
                )}

                {ritualRead ? (
                  <>
                    <span className={styles.wheel} aria-hidden>
                      <WheelMark
                        className={styles.wheelArt}
                        rimClassName={styles.wheelRim}
                        spokeClassName={styles.wheelSpoke}
                      />
                    </span>
                    <button
                      type="button"
                      className={styles.beastButton}
                      data-tone="ritual"
                      aria-disabled="true"
                      onClick={(event) => event.preventDefault()}
                    >
                      {labels.ritualDone}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className={styles.beastButton}
                    data-tone="ritual"
                    disabled={!unlocked}
                    onClick={onRitual}
                  >
                    {unlocked ? labels.ritualButton : labels.lockedBadge}
                  </button>
                )}

                <p className={styles.ritualWord} lang="ja">
                  {labels.ritualWord}
                </p>
                <p className={styles.ritualWordNote}>{labels.ritualWordNote}</p>
              </li>
            );
          }

          /* ── Çağrılabilir sekiz ──────────────────────────────────────────
             TEK düğme iki iş yapıyor: havuzdaysa "çağır", sahadaysa "geri
             gönder". Tıklanan düğme her iki durumda da ETKİN kalıyor, yani
             odak hiçbir zaman kaybolmuyor. */
          return (
            <li
              key={beast.key}
              className={styles.beast}
              data-kind="callable"
              data-out={isOut ? "true" : "false"}
              data-short={short ? "true" : "false"}
            >
              <BeastHead
                beast={beast}
                labels={labels}
                badge={isOut ? labels.outBadge : labels.readyBadge}
              />
              <p className={styles.beastText}>{beast.text}</p>
              <button
                type="button"
                className={styles.beastButton}
                data-tone={isOut ? "return" : "call"}
                disabled={ritualRead || (!isOut && short)}
                aria-pressed={isOut}
                onClick={() => onToggle(beast.key)}
              >
                {isOut
                  ? labels.returnOne
                  : short
                    ? labels.insufficient
                    : labels.summon}
              </button>
            </li>
          );
        })}
      </ul>

      <p className={styles.rosterHint}>{labels.keyboardHint}</p>
      <p className={styles.rosterDevice}>{labels.deviceNote}</p>
    </>
  );
}

function BeastHead({
  beast,
  labels,
  badge,
}: {
  beast: PoolBeastUI;
  labels: PoolLabels;
  badge: string;
}) {
  return (
    <div className={styles.beastHead}>
      <span className={styles.beastSigil} aria-hidden>
        <BeastSigil
          sigil={beast.sigil}
          className={styles.sigilArt}
          ringClassName={styles.sigilRing}
          strokeClassName={styles.sigilStroke}
        />
      </span>
      {/* ⚠️ <div>, <span> DEĞİL: içinde <h3> var ve <span>'in içerik modeli
          yalnızca phrasing content'e izin veriyor. */}
      <div className={styles.beastNames}>
        <span className={styles.beastKanji} lang="ja">
          {beast.kanji}
        </span>
        <span className={styles.beastReading} lang="ja">
          {beast.reading}
        </span>
        <h3 className={styles.beastName}>{beast.turkish}</h3>
        <span className={styles.beastRoman}>{beast.name}</span>
        <span className={styles.beastRole}>{beast.role}</span>
      </div>
      <div className={styles.beastMeta}>
        <span className={styles.beastBadge}>{badge}</span>
        <span className={styles.beastCost}>
          {labels.costLabel}
          <b className={styles.beastCostValue}>{beast.cost}</b>
          <span className={styles.beastCostUnit}>{labels.unitLabel}</span>
        </span>
      </div>
    </div>
  );
}

/* ══ Bölümlerin arasına yerleşen şikigami ═════════════════════════════════ */

export function SummonedBand({
  beasts,
  label,
}: {
  beasts: PoolBeastUI[];
  label: string;
}) {
  if (beasts.length === 0) return null;
  return (
    <div className={styles.band} role="group" aria-label={label}>
      {beasts.map((beast) => (
        <div key={beast.key} className={styles.bandItem}>
          {/* Gölge yukarı uzayıp kopuyor: kuyruk önce, mühür sonra */}
          <span className={styles.bandTail} aria-hidden />
          <span className={styles.bandSigil} aria-hidden>
            <BeastSigil
              sigil={beast.sigil}
              className={styles.sigilArt}
              ringClassName={styles.sigilRing}
              strokeClassName={styles.sigilStroke}
            />
          </span>
          <span className={styles.bandText}>
            <span className={styles.bandKanji} lang="ja">
              {beast.kanji}
            </span>
            <span className={styles.bandName}>{beast.turkish}</span>
            <span className={styles.bandLine}>{beast.onField}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

/* ══ Alt kenardaki havuz şeridi (sticky) ══════════════════════════════════ */

export function ShadowPoolStrip({
  labels,
  total,
  scar,
  usable,
  remaining,
  out,
  beasts,
  ritualRead,
  status,
  onReturn,
  onReturnAll,
}: {
  labels: PoolLabels;
  total: number;
  scar: number;
  usable: number;
  remaining: number;
  out: string[];
  beasts: PoolBeastUI[];
  ritualRead: boolean;
  status: string;
  onReturn: (key: string) => void;
  onReturnAll: () => void;
}) {
  const byKey = new Map(beasts.map((beast) => [beast.key, beast]));

  /* Ölçek: yirmi birimin hepsi çiziliyor. Sondaki `scar` birim kalıcı
     olarak kayıp — havuzun ne kadar olduğu değil, ne kadar KALDIĞI
     görünsün diye ayrı bir ton taşıyor. */
  const cells = Array.from({ length: total }, (_, index) => {
    if (index >= usable) return "scar" as const;
    return index < remaining ? ("full" as const) : ("spent" as const);
  });

  return (
    <aside
      className={styles.pool}
      aria-label={labels.gaugeTitle}
      data-drained={remaining === 0 ? "true" : "false"}
      data-sealed={ritualRead ? "true" : "false"}
    >
      {/* Akışkan kenar: SVG durgun hâli veriyor, deformasyon CSS'te */}
      <span className={styles.poolEdge} aria-hidden>
        <ShadowEdge
          className={styles.poolEdgeArt}
          fillClassName={styles.poolEdgeFill}
        />
      </span>
      <span className={styles.poolBlob} aria-hidden />

      <div className={styles.poolInner}>
        <p className={styles.poolTitle}>
          <span className={styles.poolTitleJa} lang="ja" aria-hidden>
            {labels.gaugeNative}
          </span>
          {labels.gaugeTitle}
        </p>

        <p className={styles.poolCount}>
          <span className={styles.poolCountValue}>{remaining}</span>
          <span className={styles.poolCountOf}>/{usable}</span>
          <span className={styles.poolCountLabel}>
            {labels.remainingLabel} · {labels.unitLabel}
          </span>
        </p>

        <div className={styles.gauge} aria-hidden>
          {cells.map((kind, index) => (
            <span
              key={index}
              className={styles.gaugeCell}
              data-kind={kind}
            />
          ))}
        </div>

        <p className={styles.poolScar}>
          {labels.usableLabel}: {usable} · {labels.scarLabel}: {scar}{" "}
          {labels.unitLabel}
        </p>

        <div className={styles.poolField}>
          <p className={styles.poolFieldLabel}>
            {labels.fieldLabel} · {out.length}
          </p>
          {out.length === 0 ? (
            <p className={styles.poolEmpty}>{labels.emptyField}</p>
          ) : (
            <ul className={styles.chips}>
              {out.map((key) => {
                const beast = byKey.get(key);
                if (!beast) return null;
                return (
                  <li key={key}>
                    <button
                      type="button"
                      className={styles.chip}
                      disabled={ritualRead}
                      onClick={() => onReturn(key)}
                    >
                      <span className={styles.chipJa} lang="ja">
                        {beast.kanji}
                      </span>
                      <span className={styles.chipAction}>
                        {labels.returnOne}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <button
          type="button"
          className={styles.poolReset}
          disabled={ritualRead || out.length === 0}
          onClick={onReturnAll}
        >
          {labels.returnAll}
        </button>

        {/* Sonucu YAZIYLA da veren tek yer; Mahoraga'nın geri dönülmez adımı
            da buradan duyuruluyor (erişilebilirlik şartı). */}
        <p className={styles.poolStatus} role="status">
          {status}
        </p>
      </div>
    </aside>
  );
}
