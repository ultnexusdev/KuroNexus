"use client";

import { useState } from "react";
import { useRika } from "./RikaShell";
import styles from "./RikaExperience.module.css";

/**
 * "Kopyalanan teknikler" — sayfanın kalbi.
 *
 * Altı kaynak var. Her biri desteye alınabiliyor ve GERİ VERİLEBİLİYOR;
 * deste büyüdükçe sağ şeritteki çentikler doluyor ve renk sayfanın içine
 * doğru ilerliyor (`--yut-take` → `--yut-spread`, modül dosyası).
 *
 * ── NE DEĞİL ─────────────────────────────────────────────────────────────
 * Eski Getō'nun haznesi değil: burada kapasite yok, boşaltma yok, sıra yok.
 * Kartların hiçbiri diğerini kilitlemiyor, sıralama sonucu değiştirmiyor ve
 * hiçbir seçim geri alınamaz değil. Dalga 5'in dallanan ihanet yoluyla da
 * ilgisi yok: dal yok, yol yok, tek yön yok.
 * Kabuto'nun "çekilen kimlik kartları destesi"nden ayrımı da aynı yerde:
 * orada kartlar sırayla ÇEKİLİYOR ve son kart boş; burada kartlar aynı anda
 * ortada duruyor, hepsi bağımsız ve hepsi geri konabiliyor.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Renk tek başına bilgi taşımıyor (renk körlüğü VE sayfanın monokrom hâli):
 *   · her kartın üstünde DESTEDE / DIŞARIDA rozeti yazıyor,
 *   · `aria-pressed` durumu düğmenin kendisinde,
 *   · destenin içeriği adlarıyla ayrı bir listede,
 *   · her değişiklik `aria-live="polite"` ile cümle olarak duyuruluyor,
 *   · geri verme aynı düğmede, yani klavyeyle de erişilebilir.
 *
 * Bütün metinler düz dize olarak iniyor — `LocalizedText` istemci adasına
 * geçmiyor (sözleşme).
 */

export interface DeckCard {
  key: string;
  kanji: string;
  reading: string;
  name: string;
  originLabel: string;
  origin: string;
  source: string;
  note: string;
}

export function CopyDeck({
  cards,
  groupLabel,
  takeLabel,
  dropLabel,
  inDeckLabel,
  outDeckLabel,
  countLabel,
  contentsLabel,
  emptyDeckLabel,
  spreadLabel,
  liveTaken,
  liveDropped,
  keyboardHint,
  monochromeNote,
}: {
  cards: DeckCard[];
  groupLabel: string;
  takeLabel: string;
  dropLabel: string;
  inDeckLabel: string;
  outDeckLabel: string;
  countLabel: string;
  contentsLabel: string;
  emptyDeckLabel: string;
  spreadLabel: string;
  /** `{ad}` ve `{n}` yer tutucuları taşıyan cümle */
  liveTaken: string;
  liveDropped: string;
  keyboardHint: string;
  monochromeNote: string;
}) {
  const { taken, toggleTake } = useRika();
  const [message, setMessage] = useState("");

  const total = cards.length;
  const count = taken.size;
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;
  const inDeck = cards.filter((card) => taken.has(card.key));

  const onToggle = (card: DeckCard) => {
    const adding = !taken.has(card.key);
    const next = adding ? count + 1 : count - 1;
    const template = adding ? liveTaken : liveDropped;
    setMessage(
      template.replace("{ad}", card.name).replace("{n}", String(next)),
    );
    toggleTake(card.key);
  };

  return (
    <div className={styles.deck}>
      {/* ── Sayaç: destenin durumu METİN olarak ─────────────────────── */}
      <div className={styles.deckMeter}>
        <p className={styles.deckCount}>
          <span className={styles.deckCountLabel}>{countLabel}</span>
          <span className={styles.deckCountValue}>
            {count}
            <span className={styles.deckCountSlash} aria-hidden>
              /
            </span>
            {total}
          </span>
        </p>
        <p className={styles.deckSpread}>
          <span className={styles.deckSpreadLabel}>{spreadLabel}</span>
          <span className={styles.deckSpreadValue}>%{percent}</span>
        </p>
        {/* Yayılımın görsel karşılığı — bilgi zaten yukarıda yazılı */}
        <span className={styles.deckBar} aria-hidden>
          <span className={styles.deckBarFill} />
        </span>
      </div>

      {/* ── Destenin içeriği: adlarla ───────────────────────────────── */}
      <div className={styles.deckContents}>
        <h3 className={styles.deckContentsTitle}>{contentsLabel}</h3>
        {inDeck.length === 0 ? (
          <p className={styles.deckEmpty}>{emptyDeckLabel}</p>
        ) : (
          <ul className={styles.deckList}>
            {inDeck.map((card) => (
              <li key={card.key} className={styles.deckListItem}>
                <span className={styles.deckListKanji} lang="ja" aria-hidden>
                  {card.kanji}
                </span>
                <span className={styles.deckListName}>{card.name}</span>
                <span className={styles.deckListOrigin}>{card.originLabel}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Her değişiklik cümle olarak duyuruluyor — renk yerine söz */}
      <p className={styles.deckLive} aria-live="polite">
        {message}
      </p>

      {/* ── Altı kaynak ─────────────────────────────────────────────── */}
      <ul className={styles.deckGrid} aria-label={groupLabel}>
        {cards.map((card, index) => {
          const on = taken.has(card.key);
          return (
            <li
              key={card.key}
              className={styles.deckCard}
              data-taken={on ? "true" : "false"}
              data-origin={card.origin}
              style={{ ["--i" as string]: index }}
            >
              <button
                type="button"
                className={styles.deckButton}
                aria-pressed={on}
                onClick={() => onToggle(card)}
              >
                <span className={styles.deckBadge}>
                  {on ? inDeckLabel : outDeckLabel}
                </span>
                <span className={styles.deckKanji} lang="ja" aria-hidden>
                  {card.kanji}
                </span>
                <span className={styles.deckName}>{card.name}</span>
                <span className={styles.deckReading} aria-hidden>
                  {card.reading}
                </span>
                <span className={styles.deckOrigin}>{card.originLabel}</span>
                <span className={styles.deckSource}>{card.source}</span>
                <span className={styles.deckNote}>{card.note}</span>
                <span className={styles.deckAction}>
                  {on ? dropLabel : takeLabel}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className={styles.deckHint}>{keyboardHint}</p>
      <p className={styles.deckNoteText}>{monochromeNote}</p>
    </div>
  );
}
