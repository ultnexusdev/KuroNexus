"use client";

import { useState } from "react";
import styles from "./HeavenRestrictionExperience.module.css";

/**
 * ENVANTER — sayfanın kalbi.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Beş bölmeli bir ÇANTA (açılan rulo). Bir bölme açılınca alet dışarı
 * çıkıyor ve sağdaki üç FİZİKSEL okuma (hız / güç / menzil) yükseliyor.
 * Soldaki LANET ENERJİSİ sütunu hiç kıpırdamıyor: her açışta 0, her geri
 * koyuşta 0, beşi birden dışarıdayken de 0.
 *
 * Değişmeyen sıfır + artan karşıt. Sayfanın tek argümanı bu.
 *
 * ── MAKİ ZEN'İN'DEN AYRIM (dalga şartı) ──────────────────────────────────
 * Maki'nin sayfası da envanter tabanlı ama başka bir cümle kuruyor:
 *   Maki  → eşit hücreli RAF, tek seçim, seçim stat şeridini YENİDEN
 *           HESAPLIYOR, sıfır sütunu dört sütun arasında sessiz bir espri.
 *   Burada→ hücre yok, eşit ölçü yok: satırları farklı yükseklikte bir
 *           RULO. Seçim tekli değil BİRİKİMLİ ve geri alınabiliyor.
 *           Sıfır sütunu espri değil TEZ — tezgâhtaki en büyük tek öğe o,
 *           ve iki bölme hiçbir şeyi değiştirmiyor (biri boş olduğu için,
 *           biri lanetli alet olmadığı için).
 *
 * ── BEŞİNCİ BÖLME ────────────────────────────────────────────────────────
 * Boş. Bir büyücüde orada 術式 dururdu. Devre dışı bir düğme YAPILMADI:
 * tıklanamayan bir yer tutucu tezi anlatmaz. Açılıyor, hiçbir okuma
 * değişmiyor, durum satırı bunu yazıyor.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Her bölme gerçek bir `<button aria-pressed>`; klavyeyle gezilebiliyor ve
 * Boşluk/Enter aynı işi yapıyor. Değişikliği `aria-live="polite"` bir
 * paragraf duyuruyor. Çubuklar `aria-hidden` — sayı zaten metin olarak
 * yazılı, çubuk yalnızca onun resmi.
 */

export interface SatchelGain {
  stat: string;
  amount: number;
}

export interface SatchelItem {
  key: string;
  /** Japonca ad; yoksa boş dize (Latin ad tek başına yazılıyor) */
  name: string;
  reading: string;
  turkish: string;
  line: string;
  pulled: string;
  gains: SatchelGain[];
}

export interface SatchelStat {
  key: string;
  label: string;
  native: string;
  base: number;
  max: number;
  note: string;
}

export function ToolSatchel({
  items,
  stats,
  rollTitle,
  rollHint,
  physicalTitle,
  columnTitle,
  columnNative,
  columnCaption,
  outBadge,
  inBadge,
  attemptsLabel,
  attemptsNote,
  resetLabel,
  statusIdle,
  statusReturned,
  statusReset,
  statusAll,
  closingLine,
}: {
  items: SatchelItem[];
  stats: SatchelStat[];
  rollTitle: string;
  rollHint: string;
  physicalTitle: string;
  columnTitle: string;
  columnNative: string;
  columnCaption: string;
  outBadge: string;
  inBadge: string;
  attemptsLabel: string;
  attemptsNote: string;
  resetLabel: string;
  statusIdle: string;
  statusReturned: string;
  statusReset: string;
  statusAll: string;
  closingLine: string;
}) {
  const [out, setOut] = useState<string[]>([]);
  const [tries, setTries] = useState(0);
  const [status, setStatus] = useState(statusIdle);

  const toggle = (item: SatchelItem) => {
    const isOut = out.includes(item.key);
    if (isOut) {
      setOut((prev) => prev.filter((key) => key !== item.key));
      setStatus(statusReturned);
      return;
    }
    const next = [...out, item.key];
    setOut(next);
    setTries((n) => n + 1);
    setStatus(next.length === items.length ? statusAll : item.pulled);
  };

  const reset = () => {
    setOut([]);
    setStatus(statusReset);
  };

  /** Taban + dışarıdaki aletlerin katkısı. Sıfır sütunu bu hesabın DIŞINDA. */
  const readingOf = (stat: SatchelStat) => {
    let value = stat.base;
    for (const item of items) {
      if (!out.includes(item.key)) continue;
      for (const gain of item.gains) {
        if (gain.stat === stat.key) value += gain.amount;
      }
    }
    return Math.min(value, stat.max);
  };

  return (
    <div className={styles.bench}>
      {/* ── SIFIR SÜTUNU — tezgâhtaki en büyük tek öğe ─────────────────── */}
      <div className={styles.zero}>
        <p className={styles.zeroNative} lang="ja">
          {columnNative}
        </p>
        <p className={styles.zeroLabel}>{columnTitle}</p>
        <p className={styles.zeroValue}>0</p>
        <span className={styles.zeroShaft} aria-hidden />
        <p className={styles.zeroCaption}>{columnCaption}</p>
      </div>

      {/* ── ÇANTA — açılan rulo, eşit hücre YOK ────────────────────────── */}
      <div className={styles.roll}>
        <h3 className={styles.rollTitle}>{rollTitle}</h3>
        <p className={styles.rollHint}>{rollHint}</p>

        <ul className={styles.pockets}>
          {items.map((item, index) => {
            const isOut = out.includes(item.key);
            return (
              <li
                key={item.key}
                className={styles.pocket}
                data-out={isOut ? "true" : "false"}
              >
                <button
                  type="button"
                  className={styles.pocketButton}
                  onClick={() => toggle(item)}
                  aria-pressed={isOut}
                >
                  <span className={styles.pocketIndex} aria-hidden>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className={styles.pocketBody}>
                    {item.name ? (
                      <span className={styles.pocketNative} lang="ja">
                        {item.name}
                      </span>
                    ) : null}
                    <span className={styles.pocketName}>{item.turkish}</span>
                    {item.reading ? (
                      <span className={styles.pocketReading}>
                        {item.reading}
                      </span>
                    ) : null}
                    <span className={styles.pocketLine}>{item.line}</span>
                  </span>

                  <span className={styles.pocketState}>
                    {isOut ? outBadge : inBadge}
                  </span>

                  {/* Alet seçildiğinde çizilen kısa, kesin çizgi — sayfanın
                      gökyüzü kaymasından başka TEK hareketi. */}
                  <span className={styles.pocketRule} aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── ÜÇ FİZİKSEL OKUMA — artan karşıt ───────────────────────────── */}
      <div className={styles.reads}>
        <h3 className={styles.readsTitle}>{physicalTitle}</h3>

        <ul className={styles.readList}>
          {stats.map((stat) => {
            const value = readingOf(stat);
            return (
              <li key={stat.key} className={styles.read}>
                <span className={styles.readLabel}>
                  {stat.label}
                  <span className={styles.readNative} lang="ja">
                    {stat.native}
                  </span>
                </span>
                <span className={styles.readValue}>{value}</span>
                <span className={styles.readTrack} aria-hidden>
                  <span
                    className={styles.readFill}
                    style={{ width: `${(value / stat.max) * 100}%` }}
                  />
                </span>
                <span className={styles.readNote}>{stat.note}</span>
              </li>
            );
          })}
        </ul>

        <p className={styles.tries}>
          <span className={styles.triesLabel}>{attemptsLabel}</span>
          <span className={styles.triesValue}>{tries}</span>
          <span className={styles.triesNote}>{attemptsNote}</span>
        </p>

        <button type="button" className={styles.reset} onClick={reset}>
          {resetLabel}
        </button>
      </div>

      <p className={styles.benchStatus} aria-live="polite">
        {status}
      </p>

      <p className={styles.benchClosing}>{closingLine}</p>
    </div>
  );
}
