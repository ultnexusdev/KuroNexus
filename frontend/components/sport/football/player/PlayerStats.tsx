"use client";

import { useState } from "react";
import type { PlayerStats as PlayerStatsData } from "@/lib/sport/favourite-players";
import { PlayerImage } from "./PlayerImage";
import styles from "./PlayerStats.module.css";

/**
 * İSTATİSTİKLER — iki küme, iki ışık.
 *
 * ── NEDEN İKİ KÜME ───────────────────────────────────────────────────────
 * "297 maç" bir kariyer toplamı, "98 maç" bir kulüp hikâyesi. Aynı satırda
 * gösterildiklerinde ikisi de anlamını kaybediyor: okuyucu hangi sayının
 * neyi saydığını bilmiyor. Bu yüzden iki ayrı küme ve aralarında AÇIK bir
 * geçiş var.
 *
 * ── ARMA BİR DÜĞME ───────────────────────────────────────────────────────
 * Kulüp kümesini açan şey kulübün kendi arması. Bu bir süs değil, sayfanın
 * en doğal kontrolü: "bu kulüpteki hâli" sorusunun cevabını kulübün işareti
 * açıyor. Arma basılıyken bölüm markanın tam doygunluğuna çıkıyor (renkli
 * zemin, altın halo, kenar ışığı); "tüm zamanlar" kümesi ise bilinçli olarak
 * SESSİZ — kariyer toplamı bir kutlama değil, bir künye.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * İkisi de gerçek `<button>` ve `aria-pressed` taşıyor; hangi kümenin açık
 * olduğu yalnızca renkten değil, düğme durumundan da okunuyor. Sayı ızgarası
 * `aria-live="polite"`: küme değişince ekran okuyucu yeni değerleri
 * duyuruyor, sessizce değişmiyor.
 */
export function PlayerStats({
  stats,
  labels,
}: {
  stats: PlayerStatsData;
  labels: { title: string; allTime: string; clubHint: string };
}) {
  const [mode, setMode] = useState<"club" | "all">("club");
  const active = mode === "club" ? stats.club : stats.all;

  return (
    <section
      className={styles.stats}
      data-mode={mode}
      aria-labelledby="oyuncu-istatistik"
    >
      <div className={styles.glow} aria-hidden="true" />

      <header className={styles.head}>
        <h2 id="oyuncu-istatistik" className={styles.title}>
          {labels.title}
        </h2>

        <div className={styles.switch} role="group" aria-label={labels.title}>
          <button
            type="button"
            className={styles.crestButton}
            aria-pressed={mode === "club"}
            onClick={() => setMode("club")}
            title={labels.clubHint}
          >
            <span className={styles.crestBox}>
              <PlayerImage slot={stats.club.crest} fit="contain" decorative />
            </span>
            <span className={styles.crestLabel}>{stats.club.label}</span>
          </button>

          <button
            type="button"
            className={styles.allButton}
            aria-pressed={mode === "all"}
            onClick={() => setMode("all")}
          >
            {labels.allTime}
          </button>
        </div>
      </header>

      <dl className={styles.grid} aria-live="polite">
        {active.entries.map((entry) => (
          <div key={entry.key} className={styles.cell}>
            <dd className={styles.value}>{entry.value}</dd>
            <dt className={styles.label}>{entry.label}</dt>
          </div>
        ))}
      </dl>

      <p className={styles.note}>{active.note}</p>
    </section>
  );
}
