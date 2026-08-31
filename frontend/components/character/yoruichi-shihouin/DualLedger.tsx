"use client";

import { useState } from "react";
import styles from "./ShunkoExperience.module.css";

/** Satırın dönüşüm karşısındaki hâli — sunucuda hesaplanıp iniyor. */
export type LedgerState = "same" | "turned" | "void";

export interface DualRow {
  key: string;
  kanji: string;
  label: string;
  human: string;
  /** Kedi formundaki okuma; `null` ise satır ölçülemez hâle geliyor */
  cat: string | null;
  /** `cat === null` iken neden ölçülemediği — çıplak tire bırakılmıyor */
  reason: string | null;
  note: string;
  state: LedgerState;
}

/**
 * "İki beden" — sayfanın interaktif durağı (durak 5).
 *
 * ── ŞERİTTEN FARKI ───────────────────────────────────────────────────────
 * Durak 3 (künye şeridi) MEKANİK: yukarıdaki düğmeye basıldığında on üç
 * satır birden çevriliyor ve beşi düşüyor — orada gördüğün şey TABLONUN
 * TAMAMININ geçerliliğini kaybetmesi. Burası ise TEK SATIRIN denetimi:
 * bir satır seçiyorsun ve iki gövdenin okuması yan yana geliyor, ölçülemez
 * olanların nedeni açık açık yazılıyor. Biri toplu, öteki tek tek; ikisi de
 * aynı on üç satırdan besleniyor (tek doğruluk kaynağı `YOR_LEDGER`).
 *
 * ── NEDEN İSTEMCİ ────────────────────────────────────────────────────────
 * Seçili satır bir durum. İki dilli metinlerin hepsi sunucuda `pick`
 * edildi; buraya yalnızca düz dize iniyor (FAZ 2 §1).
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * · Seçiciler gerçek `<button>`; durum `aria-pressed` ile veriliyor.
 * · Panel `aria-live="polite"`: seçim değişince okuyucu yeni satırı duyuyor.
 * · Ölçülemeyen satırda "—" işareti `aria-hidden`; ekran okuyucu onun
 *   yerine "bu formda ölçülemiyor" + gerekçesini okuyor. Çıplak tire YOK.
 * · Şerit yatay kayıyor ama her öğesi odaklanabilir, yani klavyeyle
 *   sekmeleyerek geziliyor; tarayıcı odaklanan düğmeyi kendisi görünür
 *   alana kaydırıyor. Fare tekerleği HİÇ yakalanmıyor.
 */
export function DualLedger({
  rows,
  railLabel,
  railHint,
  humanColumn,
  catColumn,
  humanKanji,
  catKanji,
  voidLabel,
  voidBadge,
  sameBadge,
  turnedBadge,
  pickHint,
  selectedLabel,
  noteLabel,
  reasonLabel,
  tally,
}: {
  rows: DualRow[];
  railLabel: string;
  railHint: string;
  humanColumn: string;
  catColumn: string;
  humanKanji: string;
  catKanji: string;
  voidLabel: string;
  voidBadge: string;
  sameBadge: string;
  turnedBadge: string;
  pickHint: string;
  selectedLabel: string;
  noteLabel: string;
  reasonLabel: string;
  tally: string;
}) {
  const [activeKey, setActiveKey] = useState(rows[0]?.key ?? "");
  const active = rows.find((row) => row.key === activeKey) ?? rows[0];

  const badgeOf = (state: LedgerState) =>
    state === "void" ? voidBadge : state === "same" ? sameBadge : turnedBadge;

  if (!active) return null;

  return (
    <div className={styles.dual}>
      <p className={styles.dualHint}>{pickHint}</p>

      <div
        className={styles.dualRail}
        role="group"
        aria-label={railLabel}
        data-rail
      >
        {rows.map((row) => (
          <button
            key={row.key}
            type="button"
            className={styles.dualPick}
            data-state={row.state}
            aria-pressed={row.key === active.key}
            onClick={() => setActiveKey(row.key)}
          >
            <span className={styles.dualPickKanji} lang="ja" aria-hidden>
              {row.kanji}
            </span>
            <span className={styles.dualPickLabel}>{row.label}</span>
            <span className={styles.dualPickBadge}>{badgeOf(row.state)}</span>
          </button>
        ))}
      </div>
      <p className={styles.railHint}>{railHint}</p>

      <div className={styles.dualPanel} aria-live="polite" data-state={active.state}>
        <p className={styles.dualPanelHead}>
          <span className={styles.dualPanelTag}>{selectedLabel}</span>
          <span className={styles.dualPanelKanji} lang="ja" aria-hidden>
            {active.kanji}
          </span>
          <span className={styles.dualPanelLabel}>{active.label}</span>
        </p>

        <div className={styles.dualPair}>
          <div className={styles.dualSide} data-side="human">
            <p className={styles.dualSideHead}>
              <span className={styles.dualSideKanji} lang="ja" aria-hidden>
                {humanKanji}
              </span>
              {humanColumn}
            </p>
            <p className={styles.dualSideValue}>{active.human}</p>
          </div>

          <div className={styles.dualSide} data-side="cat">
            <p className={styles.dualSideHead}>
              <span className={styles.dualSideKanji} lang="ja" aria-hidden>
                {catKanji}
              </span>
              {catColumn}
            </p>
            {active.cat ? (
              <p className={styles.dualSideValue}>{active.cat}</p>
            ) : (
              <p className={styles.dualSideVoid}>
                {/* İşaret gözle görülen kısım; anlam yandaki metinde. */}
                <span className={styles.dualDash} aria-hidden>
                  —
                </span>
                <span className={styles.dualVoidWord}>{voidLabel}</span>
              </p>
            )}
          </div>
        </div>

        {active.reason ? (
          <p className={styles.dualReason}>
            <span className={styles.dualFieldTag}>{reasonLabel}</span>
            {active.reason}
          </p>
        ) : null}

        <p className={styles.dualNote}>
          <span className={styles.dualFieldTag}>{noteLabel}</span>
          {active.note}
        </p>
      </div>

      <p className={styles.dualTally}>{tally}</p>
    </div>
  );
}
