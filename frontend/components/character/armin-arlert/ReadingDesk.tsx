"use client";

import { useCallback, useRef, useState } from "react";
import styles from "./HorizonExperience.module.css";

/**
 * Sayfanın kalbi: AYNI OLAY, BEŞ OKUMA.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Üstte değişmeyen bir VERİ satırı var (dört cümle, 850, Dev Ağaçlar
 * Ormanı). Solda beş hipotez duruyor. Bir hipotez seçildiğinde sağdaki
 * panelin DÜZENİ hiç değişmiyor — dört satır, hep aynı dört etiket — ama
 * dördünün de içeriği baştan yazılıyor. Beş okuma da açıldığında "hangisi
 * doğruydu" satırı geliyor ve cevabı tek bir hipotez değil, hipotezlerin
 * SIRASI veriyor.
 *
 * ⚠️ Jiraiya'nın "çevrilen el yazması sayfaları" mekaniğiyle karıştırılmasın:
 * burada sayfa çevrilmiyor, kâğıt değişmiyor, hiçbir şey açılıp kapanmıyor.
 * Kadraj sabit; içine yazılan metin değişiyor. Fark tam olarak bu.
 *
 * ── NEDEN İSTEMCİ ADASI ──────────────────────────────────────────────────
 * İki durum tutuyor: hangi okuma açık (`active`) ve hangileri açıldı
 * (`seen`). İkincisi olmadan kapanış satırının kapısı olmazdı. Metinler
 * SUNUCUDA `pick()` ile seçilip buraya düz dize olarak iniyor — bu adaya
 * `LocalizedText` hiç girmiyor.
 *
 * ── KLAVYE ───────────────────────────────────────────────────────────────
 * Beş hipotez gerçek `<button>`. Sekme ile gezilir; ayrıca yukarı/aşağı ve
 * sol/sağ okları listenin içinde odağı taşıyor (Home/End uçlara gider).
 * Odak halkası CSS'te görünür.
 */

export interface DeskReading {
  key: string;
  index: string;
  title: string;
  retell: string;
  means: string;
  drops: string;
  next: string;
}

export function ReadingDesk({
  readings,
  dataLabel,
  data,
  dataNote,
  listLabel,
  listHint,
  activeLabel,
  retellLabel,
  meansLabel,
  dropsLabel,
  nextLabel,
  counterLabel,
  lockedLabel,
  seenLabel,
  resetLabel,
  emptyTitle,
  emptyText,
  keyboardHint,
  verdictTitle,
  verdictText,
  verdictStamp,
}: {
  readings: DeskReading[];
  dataLabel: string;
  data: string;
  dataNote: string;
  listLabel: string;
  listHint: string;
  activeLabel: string;
  retellLabel: string;
  meansLabel: string;
  dropsLabel: string;
  nextLabel: string;
  counterLabel: string;
  lockedLabel: string;
  seenLabel: string;
  resetLabel: string;
  emptyTitle: string;
  emptyText: string;
  keyboardHint: string;
  verdictTitle: string;
  verdictText: string;
  verdictStamp: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [seen, setSeen] = useState<string[]>([]);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const open = useCallback((key: string) => {
    setActive(key);
    setSeen((list) => (list.includes(key) ? list : [...list, key]));
  }, []);

  const move = useCallback(
    (from: number, event: React.KeyboardEvent<HTMLButtonElement>) => {
      const last = readings.length - 1;
      let to = from;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        to = from === last ? 0 : from + 1;
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        to = from === 0 ? last : from - 1;
      } else if (event.key === "Home") {
        to = 0;
      } else if (event.key === "End") {
        to = last;
      } else {
        return;
      }
      event.preventDefault();
      buttons.current[to]?.focus();
    },
    [readings.length],
  );

  const current = readings.find((row) => row.key === active) ?? null;
  const done = seen.length === readings.length;

  /* Panelin dört satırı: etiketler HER ZAMAN aynı, değerler değişiyor.
     Boş durumda da dört satır duruyor — düzen sabit kalsın diye. */
  const rows: { key: string; label: string; value: string | null }[] = [
    { key: "retell", label: retellLabel, value: current?.retell ?? null },
    { key: "means", label: meansLabel, value: current?.means ?? null },
    { key: "drops", label: dropsLabel, value: current?.drops ?? null },
    { key: "next", label: nextLabel, value: current?.next ?? null },
  ];

  return (
    <div className={styles.desk}>
      {/* ── Değişmeyen veri ─────────────────────────────────────────────── */}
      <div className={styles.deskData}>
        <p className={styles.deskDataLabel}>{dataLabel}</p>
        <p className={styles.deskDataText}>{data}</p>
        <p className={styles.deskDataNote}>{dataNote}</p>
      </div>

      <div className={styles.deskBody}>
        {/* ── Beş hipotez ───────────────────────────────────────────────── */}
        <div className={styles.deskList}>
          <p className={styles.deskListHead}>
            <span className={styles.deskListLabel}>{listLabel}</span>
            <span className={styles.deskCount}>
              {seen.length}/{readings.length} {counterLabel}
            </span>
          </p>
          <p className={styles.deskListHint}>{listHint}</p>

          <ul className={styles.deskOptions}>
            {readings.map((row, i) => {
              const isOpen = row.key === active;
              const isSeen = seen.includes(row.key);
              return (
                <li key={row.key}>
                  <button
                    type="button"
                    ref={(node) => {
                      buttons.current[i] = node;
                    }}
                    className={styles.deskOption}
                    data-open={isOpen ? "true" : "false"}
                    data-seen={isSeen ? "true" : "false"}
                    aria-pressed={isOpen}
                    onClick={() => open(row.key)}
                    onKeyDown={(event) => move(i, event)}
                  >
                    <span className={styles.deskOptionIndex} aria-hidden>
                      {row.index}
                    </span>
                    <span className={styles.deskOptionTitle}>{row.title}</span>
                    <span className={styles.deskOptionSeen}>
                      {isSeen ? seenLabel : ""}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <p className={styles.deskKeys}>{keyboardHint}</p>

          <button
            type="button"
            className={styles.deskReset}
            onClick={() => {
              setActive(null);
              setSeen([]);
            }}
            disabled={seen.length === 0}
          >
            {resetLabel}
          </button>
        </div>

        {/* ── Sabit kadraj, değişen metin ───────────────────────────────── */}
        <div className={styles.deskPanel} aria-live="polite">
          <p className={styles.deskPanelHead}>
            <span className={styles.deskPanelLabel}>{activeLabel}</span>
            <span className={styles.deskPanelTitle}>
              {current ? `${current.index} · ${current.title}` : emptyTitle}
            </span>
          </p>

          <dl className={styles.deskRows}>
            {rows.map((row) => (
              <div key={row.key} className={styles.deskRow}>
                <dt className={styles.deskRowLabel}>{row.label}</dt>
                <dd className={styles.deskRowValue} data-empty={row.value ? "false" : "true"}>
                  {row.value ?? emptyText}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ── Kapanış satırı: beş okuma da açıldığında ──────────────────────── */}
      <div className={styles.deskVerdict} data-open={done ? "true" : "false"}>
        {done ? (
          <>
            <h3 className={styles.deskVerdictTitle}>{verdictTitle}</h3>
            <p className={styles.deskVerdictText}>{verdictText}</p>
            <p className={styles.deskVerdictStamp}>{verdictStamp}</p>
          </>
        ) : (
          <p className={styles.deskVerdictLocked}>{lockedLabel}</p>
        )}
      </div>
    </div>
  );
}
