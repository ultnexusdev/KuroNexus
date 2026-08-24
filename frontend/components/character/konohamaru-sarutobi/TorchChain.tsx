"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { TorchCord, TorchRing } from "./KonohamaruGlyphs";
import { useTorchLight } from "./TorchShell";
import styles from "./KonohamaruExperience.module.css";

/**
 * Meşale zinciri — sayfanın kalbi.
 *
 * Beş halka, her halka bir el: Üçüncü → Asuma → Naruto → Konohamaru → boş.
 * Bir halkaya basınca o elden ne devralındığı açılır (ad, teknik, söz, yük);
 * halkalar arası halatta ateş bir kademe daha tırmanır ve kökteki
 * `data-lit` değişerek sayfanın ışığını yukarı taşır (`useTorchLight`).
 *
 * ── ZİNCİR NEDEN AŞAĞIDAN YUKARI ─────────────────────────────────────────
 * DOM sırası kronolojik: ilk düğüm Üçüncü, son düğüm boş halka. Görsel
 * sıra `column-reverse` ile ters çevriliyor, yani Üçüncü ZEMİNDE duruyor ve
 * ateş yukarı çıkıyor — meşale devri yukarı taşınır, aşağı değil. Anlamlı
 * sıra (WCAG 1.3.2) DOM'da korunduğu için ekran okuyucu zinciri baştan
 * sona doğru okuyor; gören kullanıcı da tek yönde, kesintisiz bir hat
 * görüyor.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Desen: tek panelli dikey sekme listesi (roving tabindex, otomatik
 * etkinleştirme). Ok tuşları GÖRSEL yöne bağlandı, DOM yönüne değil:
 *   ↑ / →  sonraki el (yukarı, geleceğe)      Home  ilk el (Üçüncü)
 *   ↓ / ←  önceki el                          End   son halka (boş)
 * Ayrıca iki gerçek düğme var; dokunmatik kullanan ya da ok tuşu bilmeyen
 * ziyaretçi onlarla geziyor. Halka düğmeleri 44 pikselin altına inmiyor.
 *
 * Metinler sunucuda seçilmiş düz dize olarak iniyor (BRIEF §5): bu ada
 * `LocalizedText` görmüyor.
 */

export interface RelayGiftView {
  name: string;
  technique: string;
  word: string;
  wordBy: string | null;
  wordNote: string | null;
  burden: string;
}

export interface RelayView {
  key: string;
  /** Boş halkada dize boş — düğme `emptyLabel` ile okunur */
  name: string;
  role: string;
  rank: string;
  lede: string;
  face: string | null;
  /** AniList portresi `next/image`de optimize EDİLEMEZ (BRIEF §3.2) */
  faceUnoptimized: boolean;
  art: string | null;
  gifts: RelayGiftView | null;
  empty: { title: string; text: string } | null;
}

export function TorchChain({
  links,
  listLabel,
  ringWord,
  emptyLabel,
  prevLabel,
  nextLabel,
  keyboardHint,
  giftLabels,
}: {
  links: RelayView[];
  listLabel: string;
  ringWord: string;
  emptyLabel: string;
  prevLabel: string;
  nextLabel: string;
  keyboardHint: string;
  giftLabels: {
    name: string;
    technique: string;
    word: string;
    burden: string;
  };
}) {
  const [index, setIndex] = useState(0);
  const setLight = useTorchLight();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = links[index];
  if (!active) {
    return null;
  }

  const select = (next: number) => {
    const clamped = Math.min(Math.max(next, 0), links.length - 1);
    setIndex(clamped);
    setLight(clamped);
  };

  /* Sekmeler arası geçişte odak da taşınır — klavye kullanıcısı seçtiği
     halkanın üstünde kalmalı (roving tabindex şartı). */
  const focusTab = (next: number) => {
    const clamped = (next + links.length) % links.length;
    select(clamped);
    tabRefs.current[clamped]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowRight":
        event.preventDefault();
        focusTab(index + 1);
        break;
      case "ArrowDown":
      case "ArrowLeft":
        event.preventDefault();
        focusTab(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(links.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.chain} data-lit={index}>
      <div
        className={styles.rings}
        role="tablist"
        aria-orientation="vertical"
        aria-label={listLabel}
        onKeyDown={onKeyDown}
      >
        {links.map((link, position) => {
          const reached = position <= index;
          const isEmpty = link.empty !== null;
          return (
            <div className={styles.ringItem} role="presentation" key={link.key}>
              {/* Halat, halkanın ÜSTÜNDE duruyor: görsel sırada bir üstteki
                  (yani bir sonraki) ele uzanır. Son halkanın üstü yok. */}
              {position < links.length - 1 ? (
                <TorchCord
                  className={styles.cord}
                  strandClassName={styles.cordStrand}
                  fireClassName={styles.cordFire}
                  lit={index > position}
                />
              ) : null}

              <button
                type="button"
                role="tab"
                id={`knh-relay-tab-${link.key}`}
                aria-selected={position === index}
                aria-controls="knh-relay-panel"
                tabIndex={position === index ? 0 : -1}
                ref={(node) => {
                  tabRefs.current[position] = node;
                }}
                className={styles.ringButton}
                data-empty={isEmpty ? "true" : undefined}
                data-reached={reached ? "true" : undefined}
                onClick={() => select(position)}
              >
                <span className={styles.ringDisc}>
                  {/* Portre halkanın altında: düğme zaten adı okuyor, görsel
                      tekrar olduğu için dekoratif (BRIEF §3.5). */}
                  {link.face ? (
                    <span className={styles.ringArt} aria-hidden>
                      <Image
                        src={link.face}
                        alt=""
                        fill
                        sizes="160px"
                        unoptimized={link.faceUnoptimized}
                      />
                    </span>
                  ) : null}
                  <TorchRing
                    className={styles.ringGlyph}
                    ringClassName={styles.ringBand}
                    flameClassName={styles.ringFlame}
                    empty={isEmpty}
                  />
                </span>

                <span className={styles.ringText}>
                  <span className={styles.ringRole}>{link.role}</span>
                  <span className={styles.ringName}>
                    {link.name || emptyLabel}
                  </span>
                  <span className={styles.ringRank}>{link.rank}</span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <div className={styles.relaySide}>
        <div
          id="knh-relay-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`knh-relay-tab-${active.key}`}
          className={styles.relayPanel}
          data-empty={active.empty ? "true" : undefined}
        >
          {active.art ? (
            <span className={styles.relayArt} aria-hidden>
              <Image src={active.art} alt="" fill sizes="720px" />
            </span>
          ) : null}

          <p className={styles.relayCount}>
            <span className={styles.relayCountNumber}>{index + 1}</span>
            <span className={styles.relayCountTotal}>
              / {links.length} {ringWord}
            </span>
          </p>

          <p className={styles.relayMeta}>
            <span className={styles.relayRole}>{active.role}</span>
            <span className={styles.relayRank}>{active.rank}</span>
          </p>

          <h3 className={styles.relayName}>
            {active.empty ? active.empty.title : active.name}
          </h3>
          <p className={styles.relayLede}>{active.lede}</p>

          {active.empty ? (
            <p className={styles.emptyText}>{active.empty.text}</p>
          ) : null}

          {active.gifts ? (
            <dl className={styles.gifts}>
              <div className={styles.gift}>
                <dt className={styles.giftLabel}>{giftLabels.name}</dt>
                <dd className={styles.giftValue}>{active.gifts.name}</dd>
              </div>
              <div className={styles.gift}>
                <dt className={styles.giftLabel}>{giftLabels.technique}</dt>
                <dd className={styles.giftValue}>{active.gifts.technique}</dd>
              </div>
              <div className={styles.gift} data-kind="word">
                <dt className={styles.giftLabel}>{giftLabels.word}</dt>
                <dd className={styles.giftValue}>
                  {active.gifts.wordBy ? (
                    <figure className={styles.giftQuote}>
                      <blockquote>&ldquo;{active.gifts.word}&rdquo;</blockquote>
                      <figcaption>
                        <span className={styles.giftQuoteBy}>
                          {active.gifts.wordBy}
                        </span>
                        {active.gifts.wordNote ? (
                          <span className={styles.giftQuoteNote}>
                            {active.gifts.wordNote}
                          </span>
                        ) : null}
                      </figcaption>
                    </figure>
                  ) : (
                    active.gifts.word
                  )}
                </dd>
              </div>
              <div className={styles.gift}>
                <dt className={styles.giftLabel}>{giftLabels.burden}</dt>
                <dd className={styles.giftValue}>{active.gifts.burden}</dd>
              </div>
            </dl>
          ) : null}
        </div>

        <div className={styles.relayNav}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => select(index - 1)}
            disabled={index === 0}
          >
            <span aria-hidden>↓</span>
            {prevLabel}
          </button>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => select(index + 1)}
            disabled={index === links.length - 1}
          >
            {nextLabel}
            <span aria-hidden>↑</span>
          </button>
        </div>
        <p className={styles.chainHint}>{keyboardHint}</p>
      </div>
    </div>
  );
}
