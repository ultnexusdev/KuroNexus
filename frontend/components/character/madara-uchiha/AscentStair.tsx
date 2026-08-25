"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import styles from "./MadaraExperience.module.css";

/**
 * Yükselen basamaklar — sayfanın kalbi.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Altı basamak var ve kullanıcı ALTTAN YUKARI çıkıyor. Her basamakta
 * sayfanın ÖLÇEĞİ değişiyor: `data-step` niteliği CSS'te bir çarpana
 * (`--mad-scale`) çevriliyor, panelin `font-size`ı o çarpandan hesaplanıyor
 * ve panelin içindeki her şey `em` ile ölçüldüğü için tek bir geçişle
 * birlikte büyüyor. Aynı çarpan satır aralığını açıyor, boşluğu
 * genişletiyor, kart ızgarasının sütununu azaltıyor ve kalan sıcaklığı
 * (`--mad-warm`) söndürüyor. Yani sayfa yükseldikçe SEYRELİYOR ve SOĞUYOR;
 * ölçüyü metin değil düzenin kendisi anlatıyor.
 *
 * JS'in tuttuğu tek şey basamak numarası. Kart sayısının azalması veriden
 * geliyor (5 → 4 → 3 → 2 → 1 → 0), ölçek geçişi CSS'ten.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * WAI-ARIA "tabs" deseni, dikey yönelimli: her basamak bir sekme, her
 * basamağın paneli DOM'da duruyor ve etkin olmayanlar `hidden`. Böylece
 * bütün metin ilk yanıtta sunucudan iniyor — arama motoru ve JS'siz
 * ziyaretçi basamakların hepsini görüyor.
 *   ↑ / → : bir basamak yukarı     ↓ / ← : bir basamak aşağı
 *   Home  : en alt basamak         End   : en üst basamak
 * Ok tuşu kullanmayan için iki gerçek düğme var. Roving tabindex: yalnızca
 * etkin basamak tab sırasında.
 *
 * ⚠️ Görsel sıra DOM sırasının TERSİ (CSS `column-reverse`): birinci
 * basamak en altta duruyor, çünkü tırmanış aşağıdan başlıyor. Okuma sırası
 * (1 → 6) bilerek korundu; her sekmenin erişilebilir adı kendi numarasını
 * söylüyor, yani ekran okuyucuda sıra belirsiz kalmıyor.
 */

export interface AscentStepView {
  key: string;
  /** Basamağın ölçüsü — "bir klan", "bütün dünya" */
  reach: string;
  era: string;
  title: string;
  text: string;
  cards: { title: string; note: string }[];
  image: string | null;
}

export function AscentStair({
  steps,
  railLabel,
  stepWord,
  upLabel,
  downLabel,
  scaleLabel,
  keyboardHint,
}: {
  steps: AscentStepView[];
  railLabel: string;
  stepWord: string;
  upLabel: string;
  downLabel: string;
  scaleLabel: string;
  keyboardHint: string;
}) {
  const [index, setIndex] = useState(0);
  const rungRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = steps[index];
  if (!active) {
    return null;
  }

  const top = steps.length - 1;

  /* Basamak değişince odak da taşınır (roving tabindex şartı). Sınırlar
     KAPALI: merdivende en üstten en alta "sarmak" yanlış okunurdu. */
  const goTo = (next: number) => {
    const clamped = Math.min(Math.max(next, 0), top);
    setIndex(clamped);
    rungRefs.current[clamped]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowRight":
        event.preventDefault();
        goTo(index + 1);
        break;
      case "ArrowDown":
      case "ArrowLeft":
        event.preventDefault();
        goTo(index - 1);
        break;
      case "Home":
        event.preventDefault();
        goTo(0);
        break;
      case "End":
        event.preventDefault();
        goTo(top);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.climb} data-step={index + 1}>
      {/* ── Merdiven: basamak genişlikleri yukarı doğru büyüyor ── */}
      <div
        className={styles.rail}
        role="tablist"
        aria-orientation="vertical"
        aria-label={railLabel}
        onKeyDown={onKeyDown}
      >
        {steps.map((step, position) => (
          <button
            key={step.key}
            type="button"
            role="tab"
            id={`mad-rung-${step.key}`}
            aria-selected={position === index}
            aria-controls={`mad-step-${step.key}`}
            tabIndex={position === index ? 0 : -1}
            ref={(node) => {
              rungRefs.current[position] = node;
            }}
            className={styles.rung}
            data-rung={position + 1}
            data-state={
              position === index
                ? "here"
                : position < index
                  ? "climbed"
                  : "ahead"
            }
            onClick={() => setIndex(position)}
          >
            <span className={styles.tread} aria-hidden />
            <span className={styles.rungText} aria-hidden>
              <span className={styles.rungIndex}>{position + 1}</span>
              <span className={styles.rungReach}>{step.reach}</span>
            </span>
            <span className={styles.visuallyHidden}>
              {`${position + 1}. ${stepWord} — ${step.title} — ${step.reach}`}
            </span>
          </button>
        ))}
      </div>

      <div className={styles.climbBody}>
        {steps.map((step, position) => (
          <div
            key={step.key}
            id={`mad-step-${step.key}`}
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={`mad-rung-${step.key}`}
            className={styles.panel}
            hidden={position !== index}
          >
            {step.image ? (
              <span className={styles.panelArt} aria-hidden>
                <Image src={step.image} alt="" fill sizes="900px" />
              </span>
            ) : null}

            {/* Dönem satırı başlığın ALTINDA: başlığın üstüne etiket
                konmuyor, dönem bir künye satırı gibi okunuyor. */}
            <h3 className={styles.panelTitle}>{step.title}</h3>
            <p className={styles.panelEra}>{step.era}</p>
            <p className={styles.panelText}>{step.text}</p>

            {step.cards.length > 0 ? (
              <ul className={styles.panelCards}>
                {step.cards.map((card) => (
                  <li key={card.title} className={styles.panelCard}>
                    <span className={styles.panelCardTitle}>{card.title}</span>
                    <span className={styles.panelCardNote}>{card.note}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}

        <div className={styles.climbFoot}>
          <p className={styles.climbScale} role="status">
            <span className={styles.climbScaleLabel}>{scaleLabel}</span>
            <span className={styles.climbScaleValue}>{active.reach}</span>
          </p>

          <div className={styles.climbNav}>
            <button
              type="button"
              className={styles.navButton}
              onClick={() => setIndex((value) => Math.max(value - 1, 0))}
              disabled={index === 0}
            >
              <span aria-hidden>↓</span>
              {downLabel}
            </button>
            <button
              type="button"
              className={styles.navButton}
              onClick={() => setIndex((value) => Math.min(value + 1, top))}
              disabled={index === top}
            >
              <span aria-hidden>↑</span>
              {upLabel}
            </button>
          </div>

          <p className={styles.climbHint}>{keyboardHint}</p>
        </div>
      </div>
    </div>
  );
}
