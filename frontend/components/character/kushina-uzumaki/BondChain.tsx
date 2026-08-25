"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChainLink, HairFan, WhirlCrest } from "./UzumakiGlyphs";
import styles from "./KushinaExperience.module.css";

/**
 * Zincirin halkaları — sayfanın kalbi.
 *
 * Beş halka, beş bağ. Bir halka seçilince zincirin O BÖLÜMÜ gerilir:
 * seçilen halka tam, iki komşusu yarı gerilir (kuvvet zincirde dağılır),
 * kalanlar gevşek durur. Gevşeklik CSS'te yanal kaymayla anlatılıyor —
 * halkalar sırayla sağa sola sarkıyor; gerilince kayma sıfıra iner ve
 * zincir düz bir hat olur.
 *
 * Son halka (Naruto) seçildiğinde `data-broken` açılır: bütün zincir
 * gerilir, sonra DÖRDÜNCÜ halka açılıp kopar. Kopma noktası bilinçli
 * olarak son halkanın üstünde: yukarısı — memleket, ad, canavar, koca —
 * düşer, elde tek halka kalır.
 *
 * ⚠️ Konohamaru sayfasındaki meşale zinciriyle karıştırılmasın: orası bir
 * DEVİR zinciri (kimden kime geçti) ve son halkası boş; burası bir BAĞ
 * zinciri (neye bağlısın) ve sonunda kopuyor.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Tek panelli sekme listesi, otomatik etkinleştirme. Gezinme:
 *   ↑ ↓ ← → : önceki/sonraki halka     Home/End : zincirin iki ucu
 * Ok tuşu kullanmayan ziyaretçi için iki gerçek düğme var. Roving tabindex:
 * yalnızca etkin halka tab sırasında. Gerilme ve kopma görsel bilgi olduğu
 * için `role="status"` satırıyla ayrıca sözle söyleniyor.
 *
 * Metin sunucuda `pick` ile seçilmiş düz dize olarak iniyor (BRIEF §5):
 * bu ada `LocalizedText` görmüyor.
 */

export interface BondView {
  key: string;
  tag: string;
  name: string;
  kanji: string;
  turkish: string;
  pull: string;
  text: string;
  strain: string;
  /** Yalnızca son halkada dolu */
  breakText: string | null;
  /** Yoldaş portresi — kaydı yoksa null, halka amblemle çizilir */
  face: string | null;
  faceAlt: string;
  glyph: "whirl" | "hair" | null;
  /** Halkaya bağlı sahne görseli (ABILITY yuvası) */
  image: string | null;
}

export function BondChain({
  bonds,
  listLabel,
  linkWord,
  prevLabel,
  nextLabel,
  pullLabel,
  strainLabel,
  breakLabel,
  keyboardHint,
  railAlt,
  statusTaut,
  statusBroken,
}: {
  bonds: BondView[];
  listLabel: string;
  linkWord: string;
  prevLabel: string;
  nextLabel: string;
  pullLabel: string;
  strainLabel: string;
  breakLabel: string;
  keyboardHint: string;
  railAlt: string;
  statusTaut: string;
  statusBroken: string;
}) {
  const [index, setIndex] = useState(0);
  const linkRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = bonds[index];
  if (!active) {
    return null;
  }

  /** Zincir son halkada kopar; kopma noktası bir üstteki halkadır. */
  const broken = index === bonds.length - 1;
  const breakAt = bonds.length - 2;

  /* Halkalar arası geçişte odak da taşınır — klavye kullanıcısı seçtiği
     halkanın üstünde kalmalı (roving tabindex şartı). */
  const focusLink = (next: number) => {
    const clamped = (next + bonds.length) % bonds.length;
    setIndex(clamped);
    linkRefs.current[clamped]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        focusLink(index + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        focusLink(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusLink(0);
        break;
      case "End":
        event.preventDefault();
        focusLink(bonds.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={styles.chain}
      data-bond={index}
      data-broken={broken || undefined}
    >
      <div className={styles.rail}>
        <p className={styles.visuallyHidden}>{railAlt}</p>
        <div
          className={styles.railList}
          role="tablist"
          aria-label={listLabel}
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
        >
          {bonds.map((bond, position) => {
            const state = broken
              ? "taut"
              : position === index
                ? "taut"
                : Math.abs(position - index) === 1
                  ? "near"
                  : "slack";
            return (
              <button
                key={bond.key}
                type="button"
                role="tab"
                id={`kus-link-${bond.key}`}
                aria-selected={position === index}
                aria-controls="kus-bond-panel"
                tabIndex={position === index ? 0 : -1}
                ref={(node) => {
                  linkRefs.current[position] = node;
                }}
                className={styles.link}
                data-state={state}
                data-sag={position % 2 === 0 ? "a" : "b"}
                data-severed={broken && position < breakAt ? "true" : undefined}
                data-break={broken && position === breakAt ? "true" : undefined}
                data-freed={
                  broken && position === bonds.length - 1 ? "true" : undefined
                }
                onClick={() => setIndex(position)}
              >
                <ChainLink
                  pose={position % 2 === 0 ? "face" : "edge"}
                  broken={position === breakAt}
                  className={styles.linkArt}
                />
                <span className={styles.linkTag} aria-hidden>
                  {bond.tag}
                </span>
                <span className={styles.visuallyHidden}>
                  {`${position + 1}. ${linkWord} — ${bond.tag}: ${bond.name}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.bondColumn}>
        <div
          id="kus-bond-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`kus-link-${active.key}`}
          className={styles.bondPanel}
        >
          {active.image ? (
            <span className={styles.bondScene} aria-hidden>
              <Image src={active.image} alt="" fill sizes="820px" />
            </span>
          ) : null}

          <div className={styles.bondHead}>
            <span className={styles.bondFace} data-empty={active.face ? undefined : "true"}>
              {active.face ? (
                <Image src={active.face} alt={active.faceAlt} fill sizes="140px" />
              ) : active.glyph === "whirl" ? (
                <WhirlCrest className={styles.bondGlyph} />
              ) : active.glyph === "hair" ? (
                <HairFan className={styles.bondGlyph} strands={7} />
              ) : null}
            </span>
            <span className={styles.bondNames}>
              <span className={styles.bondCount}>
                <span className={styles.bondCountNumber} aria-hidden>
                  {index + 1}
                </span>
                <span className={styles.bondCountWord}>
                  {`/ ${bonds.length} ${linkWord} · ${active.tag}`}
                </span>
              </span>
              <h3 className={styles.bondName}>{active.name}</h3>
              <span className={styles.bondKanji} aria-hidden>
                {active.kanji}
              </span>
              <span className={styles.bondTurkish}>{active.turkish}</span>
            </span>
          </div>

          <div className={styles.bondBlock}>
            <p className={styles.bondLabel}>{pullLabel}</p>
            <p className={styles.bondPull}>{active.pull}</p>
          </div>
          <p className={styles.bondText}>{active.text}</p>
          <p className={styles.bondStrain}>
            <span className={styles.bondLabel}>{strainLabel}</span>
            {active.strain}
          </p>

          {broken && active.breakText ? (
            <div className={styles.bondBreak}>
              <p className={styles.bondLabel} data-tone="break">
                {breakLabel}
              </p>
              <p className={styles.bondBreakText}>{active.breakText}</p>
            </div>
          ) : null}
        </div>

        <div className={styles.bondNav}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => setIndex((value) => Math.max(value - 1, 0))}
            disabled={index === 0}
          >
            <span aria-hidden>↑</span>
            {prevLabel}
          </button>
          <button
            type="button"
            className={styles.navButton}
            onClick={() =>
              setIndex((value) => Math.min(value + 1, bonds.length - 1))
            }
            disabled={index === bonds.length - 1}
          >
            {nextLabel}
            <span aria-hidden>↓</span>
          </button>
        </div>

        <p className={styles.bondStatus} role="status">
          {broken ? statusBroken : statusTaut}
        </p>
        <p className={styles.bondHint}>{keyboardHint}</p>
      </div>
    </div>
  );
}
