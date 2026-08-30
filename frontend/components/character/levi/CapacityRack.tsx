"use client";

import { useState } from "react";
import styles from "./PrecisionExperience.module.css";

export interface RackItem {
  key: string;
  /** Japonca terim ya da özel ad — çevrilmiyor */
  name: string;
  /** Adın Türkçe/İngilizce karşılığı */
  title: string;
  /** YALNIZCA taşınırken görünen cümle. Düşünce kayboluyor. */
  line: string;
}

/**
 * SAYFANIN KALBİ — sabit kapasiteli el.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Listeden bir şey alınıyor. Elde en fazla ÜÇ yer var. Dördüncü alındığında
 * EN ESKİ olan düşüyor ve düşerken CÜMLESİNİ de götürüyor: aşağıdaki
 * "düşen" listesinde yalnızca adı kalıyor, ne anlattığı kalmıyor. Ziyaretçi
 * ne alacağını değil, neyi bırakacağını seçiyor.
 *
 * ⚠️ Bu bir ilerleme rayı DEĞİL (Naruto'nun dokuz kademesi, Shikamaru'nun
 * beş hamlesi, Neji'nin 2→64 sayacı): burada kademe yok, sıra yok, sonuç
 * yok. Sayının hep aynı kalması (üç) mekanizmanın kendisi. Itachi'nin
 * fenerinden de farkı burada: orada karanlık AÇILIYOR, burada elde olan
 * KAPANIYOR.
 *
 * Metinler dışarıdan düz dize olarak iniyor (FAZ 2 §1: istemci adasına
 * `LocalizedText` inmez).
 */
export function CapacityRack({
  items,
  capacity,
  openingLabel,
  capacityLabel,
  heldTitle,
  droppedTitle,
  emptySlotLabel,
  droppedEmptyLabel,
  listTitle,
  heldBadge,
  releaseHint,
  keyboardHint,
  resetLabel,
  statusTaken,
  statusDropped,
  statusReleased,
  statusReset,
  closingLine,
}: {
  items: RackItem[];
  capacity: number;
  openingLabel: string;
  capacityLabel: string;
  heldTitle: string;
  droppedTitle: string;
  emptySlotLabel: string;
  droppedEmptyLabel: string;
  listTitle: string;
  heldBadge: string;
  releaseHint: string;
  keyboardHint: string;
  resetLabel: string;
  statusTaken: string;
  statusDropped: string;
  statusReleased: string;
  statusReset: string;
  closingLine: string;
}) {
  /** Elde olanlar — EN ESKİ başta. Düşen her zaman baştan gider. */
  const [held, setHeld] = useState<string[]>([]);
  /** Düşenlerin adları — en yenisi başta. Cümleleri saklanmıyor, bilerek. */
  const [dropped, setDropped] = useState<string[]>([]);
  /** Bir kere bile alınmış olanlar — kapanış satırının koşulu */
  const [seen, setSeen] = useState<string[]>([]);
  const [status, setStatus] = useState("");

  const byKey = (key: string) => items.find((item) => item.key === key);
  const nameOf = (key: string) => byKey(key)?.name ?? key;

  const take = (key: string) => {
    if (held.includes(key)) return;

    let next = [...held, key];
    let fallen: string | null = null;
    if (next.length > capacity) {
      fallen = next[0];
      next = next.slice(1);
    }

    const dropKey = fallen;
    setHeld(next);
    if (dropKey) setDropped((old) => [dropKey, ...old]);
    setSeen((old) => (old.includes(key) ? old : [...old, key]));
    setStatus(
      fallen
        ? `${nameOf(key)} ${statusTaken} ${nameOf(fallen)} ${statusDropped}`
        : `${nameOf(key)} ${statusTaken}`,
    );
  };

  const release = (key: string) => {
    setHeld((old) => old.filter((entry) => entry !== key));
    setDropped((old) => [key, ...old]);
    setStatus(`${nameOf(key)} ${statusReleased}`);
  };

  const reset = () => {
    if (held.length > 0) {
      const back = [...held].reverse();
      setDropped((old) => [...back, ...old]);
    }
    setHeld([]);
    setStatus(statusReset);
  };

  /* Üç yuva HER ZAMAN çiziliyor: kapasite dolmasa da görünür kalıyor,
     çünkü sayfanın anlattığı şey doluluk değil SINIR. */
  const slots = Array.from({ length: capacity }, (_, index) => held[index] ?? null);
  const allSeen = seen.length === items.length && items.length > 0;

  return (
    <div className={styles.rack}>
      <p className={styles.rackCount}>
        <span className={styles.rackCountLabel}>{capacityLabel}</span>
        <span className={styles.rackCountValue}>
          {held.length} / {capacity}
        </span>
      </p>

      {/* ── ELDEKİLER ── */}
      <h3 className={styles.rackHead}>{heldTitle}</h3>
      <ol className={styles.slots}>
        {slots.map((key, index) => {
          const item = key ? byKey(key) : null;
          return (
            <li className={styles.slot} key={`slot-${index}`}>
              {item ? (
                <button
                  type="button"
                  className={styles.slotFull}
                  /* `key` ile yeniden monte oluyor: dönüş+bulanıklık
                     animasyonu her yeni öğede baştan koşsun diye */
                  key={item.key}
                  onClick={() => release(item.key)}
                >
                  <span className={styles.slotName} lang="ja">
                    {item.name}
                  </span>
                  <span className={styles.slotTitle}>{item.title}</span>
                  <span className={styles.slotLine}>{item.line}</span>
                </button>
              ) : (
                <span className={styles.slotEmpty} key={`empty-${index}`}>
                  {emptySlotLabel}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {held.length === 0 ? (
        <p className={styles.rackOpening}>{openingLabel}</p>
      ) : (
        <p className={styles.rackRelease}>{releaseHint}</p>
      )}

      {/* ── ALINABİLECEKLER ── */}
      <h3 className={styles.rackHead}>{listTitle}</h3>
      <ul className={styles.pool}>
        {items.map((item) => {
          const inHand = held.includes(item.key);
          return (
            <li className={styles.poolItem} key={item.key}>
              <button
                type="button"
                className={styles.poolButton}
                onClick={() => take(item.key)}
                disabled={inHand}
              >
                <span className={styles.poolName} lang="ja">
                  {item.name}
                </span>
                <span className={styles.poolTitle}>{item.title}</span>
                {inHand ? (
                  <span className={styles.poolBadge}>{heldBadge}</span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      {/* ── DÜŞENLER ── */}
      <h3 className={styles.rackHead}>{droppedTitle}</h3>
      {dropped.length === 0 ? (
        <p className={styles.droppedEmpty}>{droppedEmptyLabel}</p>
      ) : (
        <ol className={styles.dropped}>
          {dropped.map((key, index) => (
            <li className={styles.droppedItem} key={`${key}-${index}`} lang="ja">
              {nameOf(key)}
            </li>
          ))}
        </ol>
      )}

      <div className={styles.rackFoot}>
        <button
          type="button"
          className={styles.rackReset}
          onClick={reset}
          disabled={held.length === 0}
        >
          {resetLabel}
        </button>
        <p className={styles.rackKeys}>{keyboardHint}</p>
      </div>

      <p className={styles.rackStatus} role="status">
        {status}
      </p>

      {allSeen ? <p className={styles.rackClosing}>{closingLine}</p> : null}
    </div>
  );
}
