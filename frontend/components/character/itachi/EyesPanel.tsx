"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { EyeGlyph } from "@/lib/characters/itachi-experience";
import { SharinganDisc } from "./SharinganEyes";
import styles from "./ItachiExperience.module.css";

/**
 * Gözler bölümü — tıklanabilir Sharingan.
 *
 * Büyük göz bir düğmedir: tıklanınca kısa bir karga geçişi oynar ve göz
 * "açılır" — referans infografiğin içeriği (evrim, kilit yetenekler,
 * Mangekyō yetenekleri, ünlü kullanıcılar, güçlü/zayıf yönler) panel
 * olarak serilir. Evrim ve yetenek satırlarına gelmek büyük gözün
 * desenini değiştirir: gözler "hareket eder".
 *
 * Bütün metinler sunucuda seçilip düz dize olarak iner (LocalizedText
 * istemciye taşınmaz); reduced-motion'da geçiş anında olur.
 */

export interface EyesPanelProps {
  title: string;
  kanji: string;
  subtitle: string;
  intro: string;
  quoteText: string;
  quoteBy: string;
  openHint: string;
  closeLabel: string;
  evolutionTitle: string;
  evolution: Array<{ key: string; glyph: EyeGlyph; name: string; text: string }>;
  abilitiesTitle: string;
  abilities: Array<{ key: string; name: string; text: string }>;
  mangekyoTitle: string;
  mangekyo: Array<{
    key: string;
    glyph: EyeGlyph;
    name: string;
    user: string;
    /** Tekniği taşıyan kişinin portresi — adın yanında küçük yüz */
    userImage: string | null;
    text: string;
  }>;
  usersTitle: string;
  users: Array<{
    name: string;
    image: string | null;
    glyph: EyeGlyph;
    note: string;
  }>;
  strengthsTitle: string;
  strengths: string[];
  weaknessesTitle: string;
  weaknesses: string[];
  closing: string;
  /** Mangekyō deseninin CC BY-SA 3.0 atfı — lisans gereği görünür kalır */
  credit: string;
}

const BURST_MS = 700;
const BURST_CROWS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

function BurstCrow({ index }: { index: number }) {
  return (
    <svg
      viewBox="0 0 24 12"
      className={styles.burstCrow}
      style={{ "--crow-i": index } as React.CSSProperties}
      aria-hidden
      focusable="false"
    >
      <path
        d="M2 9 Q7 1 12 8 Q17 1 22 9"
        fill="none"
        stroke="var(--ita-crow)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function EyesPanel(props: EyesPanelProps) {
  const [open, setOpen] = useState(false);
  const [burst, setBurst] = useState(false);
  const [glyph, setGlyph] = useState<EyeGlyph>("tomoe3");
  const [reduced, setReduced] = useState(false);
  const burstTimer = useRef<number | null>(null);

  useEffect(() => {
    const list = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(list.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    list.addEventListener("change", onChange);
    return () => {
      list.removeEventListener("change", onChange);
      if (burstTimer.current !== null) window.clearTimeout(burstTimer.current);
    };
  }, []);

  const toggle = useCallback(() => {
    /* Bekleyen karga zamanlayıcısı hızlı çift tıklamada temizlenir */
    if (burstTimer.current !== null) {
      window.clearTimeout(burstTimer.current);
      burstTimer.current = null;
    }
    if (open) {
      setOpen(false);
      setBurst(false);
      setGlyph("tomoe3");
      return;
    }
    /* Panel ANINDA açılır — aria-expanded gerçeği söyler (inceleme:
       700ms boyunca durum çelişiyordu); kargalar açık panelin üstünde
       dekoratif süpürme olarak aynı anda oynar */
    setGlyph("mangekyoItachi");
    setOpen(true);
    if (!reduced) {
      setBurst(true);
      burstTimer.current = window.setTimeout(() => {
        burstTimer.current = null;
        setBurst(false);
      }, BURST_MS);
    }
  }, [open, reduced]);

  return (
    <div className={styles.eyesBlock} data-open={open || undefined}>
      <div className={styles.eyesStage}>
        <button
          type="button"
          className={styles.eyeMaster}
          onClick={toggle}
          aria-expanded={open}
          aria-controls="itachi-sharingan-panel"
          aria-label={open ? props.closeLabel : `${props.title} — ${props.openHint}`}
        >
          <SharinganDisc
            glyph={glyph}
            className={styles.eyeMasterDisc}
            spinClassName={styles.eyeSpinSlow}
          />
          <span className={styles.eyeMasterRing} aria-hidden />
        </button>
        <p className={styles.eyeMasterHint} aria-hidden>
          {open ? props.closeLabel : props.openHint}
        </p>
        {burst ? (
          <span className={styles.burstLayer} aria-hidden>
            {BURST_CROWS.map((index) => (
              <BurstCrow key={index} index={index} />
            ))}
          </span>
        ) : null}
      </div>

      <div
        id="itachi-sharingan-panel"
        className={styles.sharinganPanel}
        hidden={!open}
      >
        <header className={styles.sharinganHead}>
          <p className={styles.sharinganKanji} aria-hidden>
            {props.kanji}
          </p>
          <h3 className={styles.sharinganTitle}>{props.title}</h3>
          <p className={styles.sharinganSub}>{props.subtitle}</p>
        </header>

        <div className={styles.sharinganIntro}>
          <p className={styles.sharinganIntroText}>{props.intro}</p>
          <figure className={styles.sharinganQuote}>
            <blockquote>&ldquo;{props.quoteText}&rdquo;</blockquote>
            <figcaption>{props.quoteBy}</figcaption>
          </figure>
        </div>

        {/* Evrim — satıra gelmek büyük gözü o aşamaya çevirir */}
        <section aria-label={props.evolutionTitle} className={styles.evolution}>
          <h4 className={styles.panelTitle}>{props.evolutionTitle}</h4>
          <ol className={styles.evolutionRow}>
            {props.evolution.map((stage) => (
              <li key={stage.key}>
                <button
                  type="button"
                  className={styles.evolutionStop}
                  onMouseEnter={() => setGlyph(stage.glyph)}
                  onFocus={() => setGlyph(stage.glyph)}
                  onClick={() => setGlyph(stage.glyph)}
                >
                  <SharinganDisc
                    glyph={stage.glyph}
                    className={styles.evolutionEye}
                    spinClassName={styles.eyeSpinSlow}
                  />
                  <span className={styles.evolutionName}>{stage.name}</span>
                  <span className={styles.evolutionText}>{stage.text}</span>
                </button>
              </li>
            ))}
          </ol>
        </section>

        <div className={styles.sharinganColumns}>
          {/* Kilit yetenekler */}
          <section aria-label={props.abilitiesTitle} className={styles.keyAbilities}>
            <h4 className={styles.panelTitle}>{props.abilitiesTitle}</h4>
            <ul className={styles.keyAbilityList}>
              {props.abilities.map((ability) => (
                <li key={ability.key} className={styles.keyAbility}>
                  <span className={styles.keyAbilityName}>{ability.name}</span>
                  <span className={styles.keyAbilityText}>{ability.text}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Mangekyō yetenekleri */}
          <section aria-label={props.mangekyoTitle} className={styles.mangekyoList}>
            <h4 className={styles.panelTitle}>{props.mangekyoTitle}</h4>
            <ul>
              {props.mangekyo.map((row) => (
                <li key={row.key}>
                  <button
                    type="button"
                    className={styles.mangekyoHit}
                    onMouseEnter={() => setGlyph(row.glyph)}
                    onFocus={() => setGlyph(row.glyph)}
                    onClick={() => setGlyph(row.glyph)}
                  >
                    <SharinganDisc
                      glyph={row.glyph}
                      className={styles.mangekyoEye}
                      spinClassName={styles.eyeSpinSlow}
                    />
                    <span className={styles.mangekyoBody}>
                      <span className={styles.mangekyoName}>{row.name}</span>
                      <span className={styles.mangekyoText}>{row.text}</span>
                    </span>
                    <span className={styles.mangekyoUser}>
                      <span className={styles.mangekyoUserFace} aria-hidden>
                        {row.userImage ? (
                          <Image
                            src={row.userImage}
                            alt=""
                            fill
                            sizes="72px"
                          />
                        ) : null}
                      </span>
                      <span className={styles.mangekyoUserName}>{row.user}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Ünlü kullanıcılar */}
        <section aria-label={props.usersTitle} className={styles.usersBlock}>
          <h4 className={styles.panelTitle}>{props.usersTitle}</h4>
          <ul className={styles.usersRow}>
            {props.users.map((user) => (
              <li key={user.name} className={styles.userCard}>
                <span className={styles.userPortrait}>
                  {user.image ? (
                    <Image src={user.image} alt={user.name} fill sizes="220px" />
                  ) : (
                    <SharinganDisc glyph={user.glyph} className={styles.userFallbackEye} />
                  )}
                </span>
                <span className={styles.userName}>{user.name}</span>
                <SharinganDisc
                  glyph={user.glyph}
                  className={styles.userEyeChip}
                  spinClassName={styles.eyeSpinSlow}
                />
                <span className={styles.userNote}>{user.note}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Güçlü / zayıf yönler */}
        <div className={styles.meritGrid}>
          <section aria-label={props.strengthsTitle} className={styles.meritCol}>
            <h4 className={styles.panelTitle}>{props.strengthsTitle}</h4>
            <ul>
              {props.strengths.map((item) => (
                <li key={item} className={styles.meritRow} data-kind="plus">
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section aria-label={props.weaknessesTitle} className={styles.meritCol}>
            <h4 className={styles.panelTitle}>{props.weaknessesTitle}</h4>
            <ul>
              {props.weaknesses.map((item) => (
                <li key={item} className={styles.meritRow} data-kind="minus">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <p className={styles.sharinganClosing}>&ldquo;{props.closing}&rdquo;</p>
        <p className={styles.sharinganCredit}>{props.credit}</p>
      </div>
    </div>
  );
}
