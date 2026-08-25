"use client";

import { useState } from "react";
import Image from "next/image";
import { CardBack, CardFaceArt } from "./TsunadeGlyphs";
import styles from "./TsunadeExperience.module.css";

/**
 * Bahis masası — sayfanın kalbi.
 *
 * Beş bahis, beş kart. Her kart BAĞIMSIZ çevriliyor ve ÇEVRİLİ KALIYOR:
 * bu bir "beş sekme, tek panel" seçicisi değil, aynı anda beş durumu olan
 * bir masa. Masanın altındaki hesap açılan kartlarla birlikte değişiyor ve
 * beşi de açıldığında sayfanın hükmünü basıyor — mekaniğin bütün fikri o
 * son satırda: Tsunade'nin kazandığı iki el, kaybettiği üç elden pahalıya
 * mal oldu.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Desen: beş bağımsız disclosure. Her kart gerçek bir `<button>`
 * (`aria-expanded` + `aria-controls`), yani Tab ile gezilip Enter/boşlukla
 * çevriliyor — özel bir klavye sözleşmesi öğrenmek gerekmiyor. Panel
 * kapalıyken `aria-hidden`: içinde odaklanabilir hiçbir şey yok, o yüzden
 * bu güvenli ve kapalı metin ekran okuyucuya sızmıyor.
 *
 * Metinler sunucuda `pick` ile seçilmiş düz dize olarak iniyor (BRIEF §5):
 * bu ada `LocalizedText` görmüyor.
 */

export interface BetView {
  key: string;
  suit: "crystal" | "drop" | "serpent" | "spiral" | "slug";
  rank: string;
  odds: string;
  title: string;
  call: string;
  stake: string;
  result: "won" | "lost";
  truth: string;
  image: string | null;
}

export function BettingTable({
  bets,
  listLabel,
  oddsLabel,
  stakeLabel,
  truthLabel,
  openLabel,
  closeLabel,
  wonStamp,
  lostStamp,
  ledgerLabel,
  wonWord,
  lostWord,
  closedWord,
  dealAllLabel,
  collectAllLabel,
  ruleLine,
  verdictLine,
  keyboardHint,
}: {
  bets: BetView[];
  listLabel: string;
  oddsLabel: string;
  stakeLabel: string;
  truthLabel: string;
  openLabel: string;
  closeLabel: string;
  wonStamp: string;
  lostStamp: string;
  ledgerLabel: string;
  wonWord: string;
  lostWord: string;
  closedWord: string;
  dealAllLabel: string;
  collectAllLabel: string;
  ruleLine: string;
  verdictLine: string;
  keyboardHint: string;
}) {
  const [turned, setTurned] = useState<string[]>([]);

  const isOpen = (key: string) => turned.includes(key);
  const allOpen = turned.length === bets.length;

  const toggle = (key: string) => {
    setTurned((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  };

  /* Tek düğme, iki iş: masada kapalı kart varsa hepsini açar, hepsi
     açıksa masayı toplar. İki ayrı düğme koymak masaya boşuna bir
     tıklama hedefi daha eklerdi. */
  const sweep = () => {
    setTurned(allOpen ? [] : bets.map((bet) => bet.key));
  };

  const wonCount = bets.filter(
    (bet) => isOpen(bet.key) && bet.result === "won",
  ).length;
  const lostCount = bets.filter(
    (bet) => isOpen(bet.key) && bet.result === "lost",
  ).length;
  const closedCount = bets.length - turned.length;

  return (
    <div className={styles.table} data-turned={turned.length}>
      <ul className={styles.bets} aria-label={listLabel}>
        {bets.map((bet) => {
          const open = isOpen(bet.key);
          const panelId = `tsu-bet-${bet.key}`;
          return (
            <li
              key={bet.key}
              className={styles.bet}
              data-open={open || undefined}
              data-result={bet.result}
            >
              <button
                type="button"
                className={styles.betTrigger}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(bet.key)}
              >
                <span className={styles.cardShell}>
                  <span className={styles.card}>
                    <span className={styles.cardBack}>
                      <CardBack className={styles.cardArt} />
                    </span>
                    <span className={styles.cardFace}>
                      <CardFaceArt suit={bet.suit} className={styles.cardArt} />
                      <span className={styles.cardRank} aria-hidden>
                        {bet.rank}
                      </span>
                      <span className={styles.cardRankFoot} aria-hidden>
                        {bet.rank}
                      </span>
                    </span>
                  </span>
                </span>

                <span className={styles.betHead}>
                  <span className={styles.betTitle}>{bet.title}</span>
                  <span className={styles.betCall}>
                    &ldquo;{bet.call}&rdquo;
                  </span>
                  <span className={styles.betAction}>
                    {open ? closeLabel : openLabel}
                  </span>
                </span>

                <span className={styles.odds}>
                  <span className={styles.oddsLabel}>{oddsLabel}</span>
                  <span className={styles.oddsValue}>{bet.odds}</span>
                </span>
              </button>

              {/* Kapalıyken aria-hidden: panelde odaklanabilir öğe yok, bu
                  yüzden gizlemek güvenli ve kapalı metin okuyucuya sızmıyor.
                  `aria-hidden={undefined}` yazılıyor ki açıkken nitelik hiç
                  basılmasın (aria-hidden="false" tavsiye edilmiyor). */}
              <div
                id={panelId}
                className={styles.betPanel}
                aria-hidden={open ? undefined : true}
              >
                <div className={styles.betPanelInner}>
                  {bet.image ? (
                    <span className={styles.betArt} aria-hidden>
                      <Image src={bet.image} alt="" fill sizes="720px" />
                    </span>
                  ) : null}
                  <p className={styles.stamp}>
                    {bet.result === "won" ? wonStamp : lostStamp}
                  </p>
                  <p className={styles.betLabel}>{stakeLabel}</p>
                  <p className={styles.betStake}>{bet.stake}</p>
                  <p className={styles.betLabel}>{truthLabel}</p>
                  <p className={styles.betTruth}>{bet.truth}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className={styles.ledger}>
        <p className={styles.ledgerLabel}>{ledgerLabel}</p>

        <div className={styles.tallies} role="status">
          <span className={styles.tally} data-kind="won">
            <span className={styles.tallyNumber}>{wonCount}</span>
            <span className={styles.tallyWord}>{wonWord}</span>
          </span>
          <span className={styles.tally} data-kind="lost">
            <span className={styles.tallyNumber}>{lostCount}</span>
            <span className={styles.tallyWord}>{lostWord}</span>
          </span>
          <span className={styles.tally} data-kind="closed">
            <span className={styles.tallyNumber}>{closedCount}</span>
            <span className={styles.tallyWord}>{closedWord}</span>
          </span>
          {allOpen ? <p className={styles.verdict}>{verdictLine}</p> : null}
        </div>

        <p className={styles.ledgerRule}>{ruleLine}</p>

        <div className={styles.tableActions}>
          <button type="button" className={styles.sweepButton} onClick={sweep}>
            {allOpen ? collectAllLabel : dealAllLabel}
          </button>
          <p className={styles.keyboardHint}>{keyboardHint}</p>
        </div>
      </div>
    </div>
  );
}
