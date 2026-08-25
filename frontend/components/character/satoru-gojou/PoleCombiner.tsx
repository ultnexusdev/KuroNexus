"use client";

import { useState } from "react";
import Image from "next/image";
import { EraseTrace, PoleMark } from "./LimitGlyphs";
import styles from "./SixEyesExperience.module.css";

/**
 * İki uç — sayfanın kalbi.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Sayfa bir sıra ilerletmiyor, bir sekme açmıyor, bir kademe yükseltmiyor.
 * İki BOŞ YUVA var ve ziyaretçi onlara uç yerleştiriyor. Kural tek:
 *
 *     蒼 + 蒼  → hiçbir şey (iki yön aynı, alan dengede)
 *     赫 + 赫  → hiçbir şey
 *     蒼 + 赫  → 茈  (var olmayan üçüncü teknik)
 *
 * Yani sonucu getiren şey miktar değil ZITLIK. Aynı ucu iki kez yüklemek
 * kasıtlı olarak MÜMKÜN: "yanlış" kurulum da bir cevap veriyor ve mekaniğin
 * kuralını kullanıcıya kendi denemesiyle öğretiyor. Bir zincirin halkası, bir
 * rayın kademesi ya da bir ızgaranın hücresi değil — iki yuvalı bir
 * BİRLEŞTİRİCİ; arşivde eşi yok.
 *
 * Çarpıştırma ayrı bir düğme, çünkü iki ucun buluşması bir tarama değil bir
 * KARAR: yuvalar dolduktan sonra bile ziyaretçi çarpıştırmayabilir.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Sekme listesi yok, roving tabindex yok: her şey gerçek `<button>` ve
 * hepsi tab sırasında. Klavye için ek bir tuş sözleşmesi öğrenmek gerekmiyor.
 * Yuvalar dolu değilken "Çarpıştır" `disabled`; aynı uç iki kez yüklüyse de
 * `disabled` ve durum satırı sebebini söylüyor.
 * Alanın kendisi `role="img"` + `aria-label`; içindeki şekiller dekoratif.
 *
 * Metin sunucuda seçilmiş düz dize olarak iniyor (BRIEF §5): bu ada
 * `LocalizedText` görmüyor.
 */

export type PoleKey = "blue" | "red";

export interface PoleView {
  key: PoleKey;
  kanji: string;
  name: string;
  reading: string;
  turkish: string;
  sign: string;
  text: string;
  image: string | null;
}

export interface MergeView {
  kanji: string;
  name: string;
  reading: string;
  turkish: string;
  text: string;
  image: string | null;
}

type Slots = [PoleKey | null, PoleKey | null];

export function PoleCombiner({
  poles,
  merge,
  slotsLabel,
  slotALabel,
  slotBLabel,
  emptyLabel,
  pickLabel,
  clearLabel,
  collideLabel,
  againLabel,
  fieldLabel,
  keyboardHint,
  resultLabel,
  statusIdle,
  statusHalf,
  statusSame,
  statusReady,
  statusDone,
}: {
  poles: PoleView[];
  merge: MergeView;
  slotsLabel: string;
  slotALabel: string;
  slotBLabel: string;
  emptyLabel: string;
  pickLabel: string;
  clearLabel: string;
  collideLabel: string;
  againLabel: string;
  fieldLabel: string;
  keyboardHint: string;
  resultLabel: string;
  statusIdle: string;
  statusHalf: string;
  statusSame: string;
  statusReady: string;
  statusDone: string;
}) {
  const [slots, setSlots] = useState<Slots>([null, null]);
  const [collided, setCollided] = useState(false);

  const byKey = (key: PoleKey | null) =>
    key ? (poles.find((pole) => pole.key === key) ?? null) : null;

  const filled = slots.filter(Boolean).length;
  const opposite =
    slots[0] !== null && slots[1] !== null && slots[0] !== slots[1];
  const same = slots[0] !== null && slots[1] !== null && slots[0] === slots[1];

  const status = collided
    ? statusDone
    : opposite
      ? statusReady
      : same
        ? statusSame
        : filled === 1
          ? statusHalf
          : statusIdle;

  /* Uç yerleştirme: ilk boş yuvaya iner. İkisi de doluysa düğme kapalı,
     yani burada sessiz bir kayıp olmuyor. */
  const place = (key: PoleKey) => {
    setCollided(false);
    setSlots((current) => {
      if (current[0] === null) return [key, current[1]];
      if (current[1] === null) return [current[0], key];
      return current;
    });
  };

  const clearSlot = (index: 0 | 1) => {
    setCollided(false);
    setSlots((current) =>
      index === 0 ? [null, current[1]] : [current[0], null],
    );
  };

  const reset = () => {
    setCollided(false);
    setSlots([null, null]);
  };

  const slotState = (index: 0 | 1) => {
    const pole = byKey(slots[index]);
    const label = index === 0 ? slotALabel : slotBLabel;
    return { pole, label };
  };

  return (
    <div className={styles.combiner}>
      {/* ── Alan: iki uç burada duruyor, çarpışınca ortada buluşuyor ── */}
      <div
        className={styles.field}
        role="img"
        aria-label={fieldLabel}
        data-filled={filled}
        data-collided={collided ? "true" : undefined}
      >
        <span className={styles.fieldAxis} aria-hidden />

        {([0, 1] as const).map((index) => {
          const pole = byKey(slots[index]);
          return (
            <span
              key={index}
              className={styles.fieldPole}
              data-side={index === 0 ? "left" : "right"}
              data-pole={pole?.key}
              aria-hidden
            >
              {pole ? (
                <>
                  <PoleMark
                    className={styles.fieldMark}
                    strokeClassName={styles.fieldMarkStroke}
                    coreClassName={styles.fieldMarkCore}
                    direction={pole.key === "blue" ? "in" : "out"}
                  />
                  <span className={styles.fieldKanji}>{pole.kanji}</span>
                </>
              ) : (
                <span className={styles.fieldHollow} />
              )}
            </span>
          );
        })}

        {/* Çarpışma izi: yalnızca çarpıştıktan sonra çiziliyor */}
        <span className={styles.fieldTrace} aria-hidden>
          <EraseTrace
            className={styles.fieldTraceArt}
            coreClassName={styles.fieldTraceCore}
            edgeClassName={styles.fieldTraceEdge}
          />
          <span className={styles.fieldTraceKanji}>{merge.kanji}</span>
        </span>
      </div>

      {/* ── Yuvalar ── */}
      <div className={styles.slotBar}>
        <p className={styles.slotBarLabel}>{slotsLabel}</p>
        <div className={styles.slotRow2}>
          {([0, 1] as const).map((index) => {
            const { pole, label } = slotState(index);
            return (
              <button
                key={index}
                type="button"
                className={styles.slot}
                data-pole={pole?.key}
                data-empty={pole ? undefined : "true"}
                disabled={!pole}
                onClick={() => clearSlot(index)}
                aria-label={
                  pole ? `${label}: ${pole.name} — ${clearLabel}` : `${label}: ${emptyLabel}`
                }
              >
                <span className={styles.slotIndex} aria-hidden>
                  {index + 1}
                </span>
                <span className={styles.slotBody}>
                  <span className={styles.slotKanji} aria-hidden>
                    {pole ? pole.kanji : "—"}
                  </span>
                  <span className={styles.slotName}>
                    {pole ? pole.turkish : emptyLabel}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Uç seçici ── */}
      <div className={styles.pickBar}>
        <p className={styles.slotBarLabel}>{pickLabel}</p>
        <div className={styles.pickRow}>
          {poles.map((pole) => (
            <button
              key={pole.key}
              type="button"
              className={styles.pick}
              data-pole={pole.key}
              disabled={filled === 2}
              onClick={() => place(pole.key)}
            >
              <PoleMark
                className={styles.pickMark}
                strokeClassName={styles.pickMarkStroke}
                coreClassName={styles.pickMarkCore}
                direction={pole.key === "blue" ? "in" : "out"}
              />
              <span className={styles.pickBody}>
                <span className={styles.pickKanji} aria-hidden>
                  {pole.kanji}
                </span>
                <span className={styles.pickName}>{pole.name}</span>
                <span className={styles.pickSign}>{pole.sign}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Karar ── */}
      <div className={styles.actionRow}>
        <button
          type="button"
          className={styles.actionMain}
          disabled={!opposite || collided}
          onClick={() => setCollided(true)}
        >
          {collideLabel}
        </button>
        <button
          type="button"
          className={styles.actionGhost}
          disabled={filled === 0 && !collided}
          onClick={reset}
        >
          {collided ? againLabel : clearLabel}
        </button>
      </div>

      <p className={styles.combinerStatus} role="status">
        {status}
      </p>

      {/* ── Sonuç panosu: çarpışmadan önce yüklü uçların tarifi, sonra 茈 ── */}
      <div className={styles.result} data-collided={collided ? "true" : undefined}>
        {collided ? (
          <article className={styles.resultCard} data-pole="merge">
            {merge.image ? (
              <span className={styles.resultArt} aria-hidden>
                <Image src={merge.image} alt="" fill sizes="720px" />
              </span>
            ) : null}
            <p className={styles.resultTag}>{resultLabel}</p>
            <h3 className={styles.resultName}>
              <span className={styles.resultKanji} aria-hidden>
                {merge.kanji}
              </span>
              {merge.name}
            </h3>
            <p className={styles.resultReading} aria-hidden>
              {merge.reading}
            </p>
            <p className={styles.resultTurkish}>{merge.turkish}</p>
            <p className={styles.resultText}>{merge.text}</p>
          </article>
        ) : (
          <ul className={styles.resultList}>
            {([0, 1] as const)
              .map((index) => byKey(slots[index]))
              .map((pole, index) =>
                pole ? (
                  <li key={`${pole.key}-${index}`}>
                    <article className={styles.resultCard} data-pole={pole.key}>
                      {pole.image ? (
                        <span className={styles.resultArt} aria-hidden>
                          <Image src={pole.image} alt="" fill sizes="480px" />
                        </span>
                      ) : null}
                      <h3 className={styles.resultName}>
                        <span className={styles.resultKanji} aria-hidden>
                          {pole.kanji}
                        </span>
                        {pole.name}
                      </h3>
                      <p className={styles.resultReading} aria-hidden>
                        {pole.reading}
                      </p>
                      <p className={styles.resultTurkish}>{pole.turkish}</p>
                      <p className={styles.resultText}>{pole.text}</p>
                    </article>
                  </li>
                ) : null,
              )}
          </ul>
        )}
      </div>

      <p className={styles.combinerHint}>{keyboardHint}</p>
    </div>
  );
}
