"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { NotchGlyph, SparkBurst } from "./KenpachiMarks";
import styles from "./KenpachiExperience.module.css";

/**
 * ÇENTİK SAYACI — sayfanın kalbi ve tek karmaşık istemci adası.
 *
 * Kılıcın ağzı yatay bir ray (mobilde dikey); üstünde beş çentik. Bir
 * çentiğe basılınca çentik derinleşir, kıvılcım çıkar ve o savaş anlatılır.
 *
 * ── ERİŞİLEBİLİRLİK KARARI ───────────────────────────────────────────────
 * Desen: ARIA sekme listesi (tablist/tab/tabpanel) + gezici tabindex.
 * Sekmeler arasında Tab tuşuyla değil OK TUŞLARIYLA geziliyor (ARIA
 * kuralı), Home/End uçlara atlıyor; seçim odakla birlikte geliyor
 * (otomatik etkinleştirme — beş kısa panel için doğrusu bu).
 * Dört ok tuşu da bağlı: masaüstünde ray yatay, mobilde dikey duruyor ve
 * hangi eksende olduğunu CSS biliyor, JS bilmiyor.
 *
 * Bütün paneller DOM'da duruyor, edilgen olanlar `hidden`: içerik JS
 * çalışmadan da sayfada kalıyor.
 *
 * Metinler PROP olarak düz dize iniyor (BRIEF kural 5) — bu ada
 * `LocalizedText` görmüyor.
 */

export interface RailNotch {
  key: string;
  /** Ağız üzerindeki sırası — 1'den 5'e */
  index: number;
  opponent: string;
  arc: string;
  outcome: "WIN" | "LOSS";
  outcomeLabel: string;
  what: string;
  learned: string;
  /** Yüklenmişse sahne görseli, yoksa null → panel görselsiz ama ayakta */
  image: string | null;
  imageAlt: string;
  /** Rakibin arşivdeki sayfası — kaydı yoksa null */
  href: string | null;
  /** Rakibin portresi (bizim veritabanımız) — yoksa null */
  portrait: string | null;
  portraitAlt: string;
}

export function NotchRail({
  notches,
  listLabel,
  counterLabel,
  whatLabel,
  learnedLabel,
  hint,
}: {
  notches: RailNotch[];
  listLabel: string;
  counterLabel: string;
  whatLabel: string;
  learnedLabel: string;
  hint: string;
}) {
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  /* Seçim odakla birlikte hareket eder; uçlarda başa/sona sarar */
  const move = (target: number) => {
    const total = notches.length;
    const next = ((target % total) + total) % total;
    setActive(next);
    tabs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        move(active + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        move(active - 1);
        break;
      case "Home":
        event.preventDefault();
        move(0);
        break;
      case "End":
        event.preventDefault();
        move(notches.length - 1);
        break;
      default:
        break;
    }
  };

  const current = notches[active];
  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    <div className={styles.rail}>
      <p className={styles.counter}>
        <span className={styles.counterWord}>{counterLabel}</span>
        <span className={styles.counterNow}>{pad(current.index)}</span>
        <span className={styles.counterSlash} aria-hidden>
          /
        </span>
        <span className={styles.counterAll}>{pad(notches.length)}</span>
      </p>

      <div className={styles.railStage}>
        {/* Kılıcın ağzı — dekoratif katman, çentikler onun üstünde durur */}
        <span className={styles.blade} aria-hidden>
          <span className={styles.bladeSpine} />
          <span className={styles.bladeEdge} />
        </span>

        <div
          className={styles.tablist}
          role="tablist"
          aria-label={listLabel}
          onKeyDown={onKeyDown}
        >
          {notches.map((notch, index) => {
            const selected = index === active;
            return (
              <button
                key={notch.key}
                type="button"
                role="tab"
                id={`knp-notch-${notch.key}`}
                aria-selected={selected}
                aria-controls={`knp-panel-${notch.key}`}
                tabIndex={selected ? 0 : -1}
                ref={(node) => {
                  tabs.current[index] = node;
                }}
                className={styles.notch}
                data-active={selected || undefined}
                onClick={() => setActive(index)}
              >
                <span className={styles.notchArt} aria-hidden>
                  <NotchGlyph
                    className={styles.notchGlyph}
                    biteClassName={styles.notchBite}
                  />
                  <SparkBurst
                    className={styles.spark}
                    shardClassName={styles.sparkShard}
                    dotClassName={styles.sparkDot}
                  />
                </span>
                <span className={styles.notchIndex} aria-hidden>
                  {pad(notch.index)}
                </span>
                <span className={styles.notchName}>{notch.opponent}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className={styles.railHint}>{hint}</p>

      {notches.map((notch, index) => (
        <div
          key={notch.key}
          role="tabpanel"
          id={`knp-panel-${notch.key}`}
          aria-labelledby={`knp-notch-${notch.key}`}
          tabIndex={0}
          hidden={index !== active}
          className={styles.panel}
          data-outcome={notch.outcome}
        >
          <div className={styles.panelHead}>
            <span className={styles.panelIndex} aria-hidden>
              {pad(notch.index)}
            </span>
            <div className={styles.panelWho}>
              <h3 className={styles.panelName}>
                {notch.href ? (
                  <Link href={notch.href} className={styles.panelLink}>
                    {notch.opponent}
                  </Link>
                ) : (
                  notch.opponent
                )}
              </h3>
              <p className={styles.panelArc}>{notch.arc}</p>
            </div>
            <span className={styles.stamp} data-outcome={notch.outcome}>
              {notch.outcomeLabel}
            </span>
          </div>

          <div className={styles.panelBody}>
            <div className={styles.panelText}>
              <p className={styles.panelLabel}>{whatLabel}</p>
              <p className={styles.panelWhat}>{notch.what}</p>
              <p className={styles.panelLabel}>{learnedLabel}</p>
              <p className={styles.panelLearned}>{notch.learned}</p>
            </div>

            {/* Görsel yoksa bölüm görselsiz ama ayakta kalır */}
            {notch.image ? (
              <figure className={styles.panelArt}>
                <Image
                  src={notch.image}
                  alt={notch.imageAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 640px"
                />
                <span className={styles.panelScrim} aria-hidden />
              </figure>
            ) : notch.portrait ? (
              <figure className={styles.panelFace}>
                <Image
                  src={notch.portrait}
                  alt={notch.portraitAlt}
                  fill
                  sizes="220px"
                />
              </figure>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
